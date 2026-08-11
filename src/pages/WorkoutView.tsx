
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage, resolveTemplate } from '../contexts/useTranslation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CheckCircle2, Circle, ArrowLeft, Save, AlertCircle, FlaskConical, Repeat } from 'lucide-react';
import { doc, updateDoc, arrayUnion, increment, collection, query, where, getDocs, deleteField } from 'firebase/firestore';
import { db } from '../firebase';
import { cn } from '../lib/utils';
import type { LiftingStats, WorkoutLog } from '../types';
import { getVariantTip } from '../data/exercises/variantTips';
import { resolveTips } from '../features/tips/resolve';
import { resolveDay } from '../lib/planResolution';
import { PrescriptionBadges } from '../features/workout/PrescriptionBadges';
import { RestTimer } from '../features/workout/RestTimer';
import { SwapSheet } from '../features/workout/SwapSheet';
import { techniqueAppliesTo, techniqueRows } from '../features/workout/techniqueSets';
import { PROGRESSION_HANDLERS, calibrationOutcomes, calibrationProgression, type CalibrationOutcome } from '../features/workout/progression';
import { WeakPointModal } from '../components/WeakPointModal';
import { VariationSwapModal } from '../components/VariationSwapModal';
import { TrinaryRerunModal } from '../components/TrinaryRerunModal';
import { selectVariation } from '../data/trinary';
import { createWorkoutWithPerformanceProfile, extractPerformanceObservations } from '../features/performanceProfile';
import { APEX_ACCESS } from '../data/apexAccess';
import { nextRomLevel } from '../features/apexPredator/assessment';
import { deriveBackoffLoad } from '../features/workout/engines/topSetBackoff';
import { EXERCISE_BY_ID } from '../data/exercises/library';
import { BlockTimer } from '../features/redline/BlockTimer';

interface SetLog {
    reps: string;
    weight: string;
    completed: boolean | null;
    /** Provenance. Absent means prescribed work; see SetKind. */
    kind?: import('../data/exercises/types').SetKind;
    /** Shown instead of a set number on technique rows, e.g. "Drop 1". */
    label?: string;
    rir?: number;
    quality?: 'clean' | 'borderline' | 'invalid';
}

// The number of sets the PLAN itself prescribes for this exercise (before any
// user-added extra sets). Shared between initial-state setup and the
// remove-extra-set guard so they can never disagree.
const getBaseSetsCount = (ex: { name: string; sets: number; baseSets?: number; giantSetConfig?: { steps: unknown[] } }, weekNum: number, programId: string): number => {
    const isGiantSet = !!ex.giantSetConfig;
    const isPullup = ex.name.includes("Pull-ups") && ex.sets === 0;
    // A resolved exercise's `sets` already includes the athlete's configured
    // extra sets, so it cannot be the baseline. `baseSets` is what the plan
    // actually prescribed.
    const prescribed = ex.baseSets ?? ex.sets;

    let pullupSetCount = 1;
    if (isPullup && programId === 'bench-domination') {
        if (weekNum >= 1 && weekNum <= 6) {
            pullupSetCount = 1;
        } else if (weekNum >= 7 && weekNum <= 9) {
            pullupSetCount = 7;
        } else if (weekNum >= 10 && weekNum <= 15) {
            pullupSetCount = 5;
        }
    }

    return isGiantSet
        ? prescribed * (ex.giantSetConfig?.steps.length || 1)
        : (isPullup ? pullupSetCount : prescribed);
};

export const WorkoutView: React.FC = () => {
    const { week, day } = useParams();
    const { user, activePlanConfig, exerciseResolver, planExerciseConfig } = useUser();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    // Parse params
    const weekNum = parseInt(week || "1");
    const dayNum = parseInt(day || "1");

    // State: exerciseId -> setIndex -> SetLog
    const [exerciseData, setExerciseData] = useState<Record<string, SetLog[]>>({});
    const [exerciseNotes, setExerciseNotes] = useState<Record<string, string>>({});

    // Previous stats state mapping
    const [previousStats, setPreviousStats] = useState<Record<string, { weight: string, reps: string, advice?: string }>>({});

    // UI States
    const [submitting, setSubmitting] = useState(false);
    /** Maxes established by this session's calibration sets, shown after saving. */
    const [calibrationResults, setCalibrationResults] = useState<CalibrationOutcome[]>([]);
    const [apexRomPending, setApexRomPending] = useState<string[]>([]);
    const [redlineBlockTimes, setRedlineBlockTimes] = useState<Record<string, { elapsedSeconds: number; expired: boolean }>>({});
    const [isExistingLog, setIsExistingLog] = useState(false);
    const [logId, setLogId] = useState<string | null>(null);

    // Pain & Glory: Deficit Snatch Grip modal state
    const [showDeficitModal, setShowDeficitModal] = useState(false);
    const [_pendingSessionLog, setPendingSessionLog] = useState<any>(null);

    // Trinary: RPE selection state for ME exercises (exerciseId -> RPE value or null)
    const [meRpeSelected, setMeRpeSelected] = useState<Record<string, number | null>>({});
    const [slowVelocitySelected, setSlowVelocitySelected] = useState<Record<string, boolean>>({});
    // Trinary: Modal states
    const [showWeakPointModal, setShowWeakPointModal] = useState(false);
    const [showVariationSwapModal, setShowVariationSwapModal] = useState(false);
    const [pendingWeakPoints, setPendingWeakPoints] = useState<{ bench: string, deadlift: string, squat: string } | null>(null);
    const [pendingVariations, setPendingVariations] = useState<{ bench: string, deadlift: string, squat: string } | null>(null);
    const [showTrinaryRerunModal, setShowTrinaryRerunModal] = useState(false);
    /**
     * Which set the console is editing.
     *
     * `null` means "whatever comes next", the behaviour that has always been
     * there. Tapping a ledger row pins the console to that set instead, which
     * is how logging out of order and correcting a logged set both work now
     * that the rows themselves are read-only. Logging clears the pin, so the
     * console falls back to advancing on its own.
     */
    const [selectedSet, setSelectedSet] = useState<{ exerciseId: string; index: number } | null>(null);
    const consoleRef = useRef<HTMLElement | null>(null);
    // Rest countdown for the set just logged; null when idle.
    const [restTimer, setRestTimer] = useState<{ seconds: number; label: string; key: number } | null>(null);
    // Exercise the athlete is choosing a swap for.
    const [swapTarget, setSwapTarget] = useState<{ name: string; swap: import('../data/exercises/types').ResolvedSwap } | null>(null);

    const programData = activePlanConfig.program;
    const weekData = programData.weeks.find(w => w.weekNumber === weekNum);
    const rawDayData = weekData?.days.find(d => d.dayOfWeek === dayNum);

    const dayData = useMemo(() => {
        if (!rawDayData || !user) return rawDayData;

        // Hooks: Preprocess Day
        const generated = activePlanConfig.hooks?.preprocessDay
            ? activePlanConfig.hooks.preprocessDay(rawDayData, user)
            : rawDayData;

        // Apply the exercise layer on top of whatever the plan generated:
        // admin overrides, the athlete's swaps and extra sets, techniques and
        // rest. Falls back to the generated day if anything goes wrong, so a
        // bad override can never leave someone without a workout.
        try {
            const resolved = resolveDay(
                generated,
                {
                    planId: activePlanConfig.id,
                    user,
                    resolver: exerciseResolver,
                    planConfig: planExerciseConfig,
                    lang: language as 'en' | 'pl',
                    week: weekNum,
                    testMode: user.isTestAccount === true,
                },
                t
            );
            return resolved ?? generated;
        } catch (error) {
            console.error('[workout] exercise resolution failed, using plan output', error);
            return generated;
        }
    }, [rawDayData, activePlanConfig, user, exerciseResolver, planExerciseConfig, language, weekNum, t]);

    // Persist "Current Workout"
    useEffect(() => {
        if (weekNum && dayNum) {
            localStorage.setItem("lastOpenedPath", `/app/workout/${weekNum}/${dayNum}`);
        }
    }, [weekNum, dayNum]);

    /**
     * The max this exercise is about to establish, if any.
     *
     * Non-null only while the stat is still outstanding, so the band disappears
     * once calibrated rather than reappearing every time the lift comes round.
     */
    const calibratingStat = (exerciseName: string): keyof LiftingStats | null => {
        const stat = activePlanConfig.calibration?.exerciseNameToStat?.[exerciseName];
        if (!stat) return null;
        return user?.pendingCalibration?.includes(stat) ? stat : null;
    };

    /**
     * Bucket for the live figure's type size.
     *
     * The console's figures are the largest type in the app, which means a
     * three-digit load plus a decimal ("142.5") outgrows the column and the
     * input clips it — the athlete types 333 and sees 33, which reads as lost
     * data. Stepping the size down by length keeps the whole number visible;
     * it stays the biggest thing on screen at every length.
     */
    /**
     * The figure input's width, in characters of its own value.
     *
     * `figureLength` picks the type size; this picks the box. Together they
     * mean the field is never narrower than what it holds, so the athlete can
     * never type 333 and see 33. Minimum 2 so an empty field stays visible.
     */
    const figureChars = (value: string): React.CSSProperties =>
        ({ '--figure-chars': Math.max(2, (value ?? '').length) } as React.CSSProperties);

    const figureLength = (value: string): 'short' | 'medium' | 'long' => {
        const digits = (value ?? '').replace(/[^0-9]/g, '').length;
        if (digits <= 2) return 'short';
        if (digits === 3) return 'medium';
        return 'long';
    };

    // Helper: Calculate Weight Wrapper
    const calculateWeight = (ex: any) => {
        if (activePlanConfig.hooks?.calculateWeight && user) {
            const hookResult = activePlanConfig.hooks.calculateWeight(
                ex.target,
                user,
                ex.name,
                { week: weekNum, day: dayNum }
            );
            if (hookResult !== undefined) return hookResult;
        }

        // Check for auto-calculated weight from preprocessDay (e.g., weighted pull-ups weeks 11-13)
        if (ex.calculatedWeight) return ex.calculatedWeight.toString();

        // Default Logic fallback
        const { percentage, percentageRef, weightAbsolute } = ex.target;
        if (weightAbsolute) return weightAbsolute.toString();
        if (percentage && percentageRef && user?.stats) {
            const base = (user.stats[percentageRef as keyof LiftingStats] as number) || 0;
            const raw = base * percentage;
            return (Math.round(raw / 2.5) * 2.5).toString();
        }
        return "0";
    };

    /**
     * True while the load in the input is still the one the plan computed.
     *
     * PRODUCT.md principle 5: an auto-calculated value must not read as one the
     * athlete entered. This is derived rather than stored — the moment they
     * type anything else the comparison fails and the label drops the mark, so
     * there is no flag to keep in sync with the input.
     *
     * `0` means the plan could not compute a load at all (an uncalibrated max,
     * a free-choice accessory), which is manual by definition.
     */
    const isAutoLoad = (ex: Parameters<typeof calculateWeight>[0], entered: string) => {
        const computed = calculateWeight(ex);
        if (!computed || computed === '0') return false;
        const a = parseFloat(computed);
        const b = parseFloat(entered);
        return Number.isFinite(a) && Number.isFinite(b) && a === b;
    };


    // 1. Fetch Existing Session & Previous Stats
    useEffect(() => {
        if (!user || !dayData) return;

        const initView = async () => {
            try {

                // SOFT SAVE: Try to load from localStorage first
                const programId = activePlanConfig.program.id;
                const softSaveKey = `workout_draft_${user.id}_${programId}_${weekNum}_${dayNum}`;
                const savedDraft = localStorage.getItem(softSaveKey);

                if (savedDraft) {
                    try {
                        const parsed = JSON.parse(savedDraft);
                        const draftData: Record<string, SetLog[]> = parsed.exerciseData || {};

                        // Reconcile the draft against the CURRENT day. Dynamic programs
                        // (Super Mutant) can regenerate a different workout for the same
                        // week/day slot, so seed exercises missing from the draft and drop
                        // entries whose exercises are no longer in the day — otherwise
                        // regenerated exercises render with zero set rows and save no volume.
                        const merged: Record<string, SetLog[]> = {};
                        dayData.exercises.forEach(ex => {
                            if (draftData[ex.id] && draftData[ex.id].length > 0) {
                                merged[ex.id] = draftData[ex.id];
                            } else {
                                const baseCount = getBaseSetsCount(ex, weekNum, programData.id);
                                // Configured extra sets are real rows, tagged so
                                // progression ignores them.
                                const extraCount = Math.max(0, (ex as { extraSets?: number }).extraSets ?? 0);
                                const targetWeight = calculateWeight(ex);
                                const defaultWeight = (targetWeight && !ex.giantSetConfig && targetWeight !== "0") ? targetWeight : "";
                                merged[ex.id] = Array.from({ length: baseCount + extraCount }, (_, i) => ({
                                    reps: '',
                                    weight: defaultWeight,
                                    completed: null,
                                    ...(i >= baseCount ? { kind: 'extra' as const } : {})
                                }));
                            }
                        });

                        setExerciseData(merged);
                        setExerciseNotes(parsed.exerciseNotes || {});
                        // Continue with loading history for previous stats, but don't overwrite the form
                        setPreviousStats(await fetchPreviousStats());
                        return; // Exit early - don't fetch/load completed session
                    } catch (e) {
                        console.error('[initView] Failed to parse draft', e);
                        localStorage.removeItem(softSaveKey);
                    }
                }

                // A. Check for existing log for THIS specific week/day
                const workoutsRef = collection(db, 'users', user.id, 'workouts');
                const todayQuery = query(
                    workoutsRef,
                    where('week', '==', weekNum),
                    where('day', '==', dayNum)
                );

                const todaySnapshot = await getDocs(todayQuery);
                let loaded = false;

                if (!todaySnapshot.empty) {
                    // Filter docs by programId AND date (must be after current program start)
                    const relevantDocs = todaySnapshot.docs.filter(doc => {
                        const d = doc.data();
                        const isProgramMatch = d.programId === programData.id || (!d.programId && programData.id === 'bench-domination');

                        // Date Check: Prevent loading "ghost" logs from previous runs of the same program
                        // Verify log is chronological with current PROGRAM start date
                        const logDate = new Date(d.date);
                        const currentRefStart = user.programProgress?.[programData.id]?.startDate || user.startDate;
                        const startDate = currentRefStart ? new Date(currentRefStart) : null;

                        // Allow 5 min buffer for clock drift/setup time, but generally exclude old logs
                        const isNewEnough = startDate ? logDate.getTime() >= (startDate.getTime() - 5 * 60 * 1000) : true;

                        return isProgramMatch && isNewEnough;
                    });

                    if (relevantDocs.length > 0) {
                        setIsExistingLog(true);
                        loaded = true;
                        // Load data into state
                        const loadedData: Record<string, SetLog[]> = {};
                        const loadedNotes: Record<string, string> = {};

                        relevantDocs.forEach(doc => {
                            const log = doc.data() as WorkoutLog;

                            if (log.exercises) {
                                log.exercises.forEach(exLog => {
                                    loadedData[exLog.id] = exLog.setsData.map(s => ({
                                        reps: s.reps.toString(),
                                        weight: s.weight.toString(),
                                        completed: s.completed
                                    }));
                                    if (exLog.notes) loadedNotes[exLog.id] = exLog.notes;
                                });
                            } else if (log.exerciseId && log.setResults) {
                                // Legacy Log
                                loadedData[log.exerciseId] = log.setResults.map(s => ({
                                    reps: s.reps.toString(),
                                    weight: s.weight.toString(),
                                    completed: s.completed
                                }));
                                if (log.notes) {
                                    loadedNotes[log.exerciseId] = log.notes;
                                }
                            }

                            if (!logId) setLogId(doc.id);
                        });
                        setExerciseData(loadedData);
                        setExerciseNotes(loadedNotes);
                    }
                }
                if (!loaded) {
                    initializeEmptyState();
                }

                // C. Fetch History for previous stats
                setPreviousStats(await fetchPreviousStats());
            } catch (err) {
                console.error("Init Error", err);
            }
        };

        const fetchPreviousStats = async (): Promise<Record<string, { weight: string, reps: string, advice?: string }>> => {
            const workoutsRef = collection(db, 'users', user.id, 'workouts');
            const allRecentQuery = query(workoutsRef);
            const allSnapshot = await getDocs(allRecentQuery);
            // Convert to simpler flattened structure for hooks if needed, or keeping generic
            const allSessions = allSnapshot.docs
                .map(d => d.data())
                .filter((d: any) => d.programId === programData.id || (!d.programId && programData.id === 'bench-domination'))
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const stats: Record<string, { weight: string, reps: string, advice?: string }> = {};

            if (dayData && dayData.exercises) {
                dayData.exercises.forEach(currentEx => {
                    // Gather history for this specific exercise
                    // We construct temporary "WorkoutLog" objects as defined in types.ts (exercise-specific)
                    const exHistory: WorkoutLog[] = [];

                    for (const session of allSessions as any[]) {
                        // Filter out current session
                        if (session.week === weekNum && session.day === dayNum) continue;

                        let setsData = null;
                        if (session.exercises) {
                            const exLog = session.exercises.find((e: any) => e.name === currentEx.name);
                            if (exLog) setsData = exLog.setsData;
                        } else if (session.exerciseId === currentEx.id && session.setResults) {
                            // Legacy support
                            setsData = session.setResults;
                        } else if (session.name === currentEx.name && session.setResults) {
                            // Fallback legacy check
                            setsData = session.setResults;
                        }

                        if (setsData && setsData.length > 0) {
                            exHistory.push({
                                id: `${session.date}_${currentEx.id}`,
                                date: session.date,
                                exerciseId: currentEx.id,
                                setResults: setsData
                            });
                        }
                    }

                    // Last Set info for display
                    let lastLabel = "";
                    let lastReps = "";
                    if (exHistory.length > 0) {
                        const lastEntry = exHistory[0];
                        const firstSet = lastEntry.setResults?.[0];
                        if (firstSet) {
                            lastLabel = firstSet.weight.toString();
                            lastReps = firstSet.reps.toString();
                        }
                    }

                    // Advice Hook
                    let advice = "";
                    // Suppress advice during deload weeks (Week 9 and 13 for Bench Domination)
                    const isDeloadWeek = programData.id === 'bench-domination' && (weekNum === 9 || weekNum === 13);
                    if (activePlanConfig.hooks?.getExerciseAdvice && !isDeloadWeek) {
                        const hookAdvice = activePlanConfig.hooks.getExerciseAdvice(currentEx, exHistory);
                        if (hookAdvice) advice = resolveTemplate(hookAdvice, t);
                    }

                    if (lastLabel) {
                        stats[currentEx.name] = { weight: lastLabel, reps: lastReps, advice };
                    } else if (advice) {
                        // Even if no specific weight history (e.g. giant set), we might have advice
                        stats[currentEx.name] = { weight: "-", reps: "-", advice };
                    }
                });
            }
            return stats;
        };

        const initializeEmptyState = () => {
            if (!dayData) return;
            const initialData: Record<string, SetLog[]> = {};
            dayData.exercises.forEach(ex => {
                const isGiantSet = !!ex.giantSetConfig;

                const baseCount = getBaseSetsCount(ex, weekNum, programData.id);
                const extraCount = Math.max(0, (ex as { extraSets?: number }).extraSets ?? 0);
                const setsCount = baseCount + extraCount;


                // Pullup special case fallback: logic moved to hook but UI needs default init?
                // Hook 'calculateWeight' might handle the 'weight' field init.

                const technique = (ex as { technique?: import('../data/exercises/types').IntensityTechniqueSpec }).technique
                    ?? ex.prescription?.technique;

                const sets: SetLog[] = [];
                const topSetBackoff = ex.prescription?.topSetBackoff;
                for (let i = 0; i < setsCount; i++) {
                    const targetWeight = calculateWeight(ex);
                    const defaultWeight = (targetWeight && !isGiantSet && targetWeight !== "0") ? targetWeight : "";

                    // For Pullups specific placeholder logic if NOT handled by calculateWeight returning a value?
                    // Bench Dom hook returns undefined for pullups currently (unless I implemented it).
                    // I removed explicit Pullup logic from program.ts hook (returned undefined).
                    // So we might lose the "2.5kg" default if I don't implement it in hook or here.
                    // The hook implementation I wrote in `program.ts` had comments about not having `weekNum`.
                    // BUT I added `context` now!
                    // So I SHOULD update `program.ts` to actually handle Pullups!
                    // I will assume I will do that in a follow-up step to fix generic regression.

                    sets.push({
                        reps: '',
                        weight: defaultWeight,
                        completed: null,
                        ...(i >= baseCount ? { kind: 'extra' as const } : {}),
                        ...(topSetBackoff && { label: i === 0 ? 'Top set' : `Back-off ${i}`, ...(i === 0 ? { quality: undefined, rir: undefined } : {}) })
                    });

                    // A technique attached to this set gets its own rows, so the
                    // work is recorded rather than only described.
                    if (techniqueAppliesTo(technique, i, baseCount)) {
                        const seedWeight = calculateWeight(ex) ?? '';
                        for (const row of techniqueRows(technique, seedWeight)) {
                            sets.push({
                                reps: '',
                                weight: row.weight ?? '',
                                completed: null,
                                kind: row.kind,
                                label: row.label,
                            });
                        }
                    }
                }
                initialData[ex.id] = sets;
            });
            setExerciseData(initialData);
        };

        initView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, weekNum, dayNum, activePlanConfig, dayData]);

    // SOFT SAVE: Save to localStorage whenever exerciseData or exerciseNotes change
    useEffect(() => {
        if (!user || !dayData) return;
        if (Object.keys(exerciseData).length === 0) return; // Don't save empty state

        const programId = activePlanConfig.program.id;
        const softSaveKey = `workout_draft_${user.id}_${programId}_${weekNum}_${dayNum}`;

        const draftData = {
            exerciseData,
            exerciseNotes,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(softSaveKey, JSON.stringify(draftData));
    }, [exerciseData, exerciseNotes, user, dayData, weekNum, dayNum, activePlanConfig.program.id]);

    const handleSetChange = (exId: string, setIndex: number, field: 'reps' | 'weight', value: string, isPullup: boolean = false, suggestedReps: string = "0") => {
        setExerciseData(prev => {
            const currentSets = [...(prev[exId] || [])];
            if (!currentSets[setIndex]) return prev;

            currentSets[setIndex] = { ...currentSets[setIndex], [field]: value };

            if (field === 'reps' && value === '') {
                currentSets[setIndex].completed = null;
            }

            // Auto-fill weights for straight sets
            if (setIndex === 0 && field === 'weight' && !isPullup) {
                const ex = dayData?.exercises.find(e => e.id === exId);
                // Don't auto-fill if giant set or special
                if (!ex?.giantSetConfig) {
                    for (let i = 1; i < currentSets.length; i++) {
                        if (currentSets[i].weight === '' || currentSets[i].weight === prev[exId][0].weight) {
                            currentSets[i].weight = value;
                        }
                    }
                }
            }

            // Pullup Week-Specific Auto-Fill Logic (Bench Domination EMOM)
            // This is UI behavior (auto-filling rows based on first set input)
            if (isPullup && programData.id === 'bench-domination' && setIndex === 0 && field === 'weight') {
                const w = parseFloat(value);
                if (!isNaN(w)) {
                    if (weekNum >= 4 && weekNum <= 6) {
                        // Weeks 4-6: FIXED-weight EMOM - same weight for ALL sets
                        for (let i = 1; i < currentSets.length; i++) {
                            currentSets[i].weight = value;
                        }
                    } else if (weekNum >= 7 && weekNum <= 9) {
                        // Weeks 7-9: Daily max triple + back-offs at 87.5%
                        const nextWeight = Math.floor((w * 0.875) / 2.5) * 2.5;
                        for (let i = 1; i < currentSets.length; i++) {
                            currentSets[i].weight = nextWeight.toString();
                        }
                    } else if (weekNum >= 10 && weekNum <= 12) {
                        // Weeks 10-12: Sets at 92.5% of week 10 max single
                        const nextWeight = Math.floor((w * 0.925) / 2.5) * 2.5;
                        for (let i = 1; i < currentSets.length; i++) {
                            currentSets[i].weight = nextWeight.toString();
                        }
                    }
                }
            }

            // EMOM Set Growth Logic (Weeks 1-6): Add new set when reps entered
            if (isPullup && programData.id === 'bench-domination' && weekNum >= 1 && weekNum <= 6 && field === 'reps') {
                const reps = parseInt(value);
                // Parse target: for "Max" use any reps, for "3-5" use first number (3)
                const isMax = suggestedReps.toLowerCase().includes("max");
                let target = 0;
                if (!isMax) {
                    // Extract first number from string like "3-5" or "5"
                    const match = suggestedReps.match(/\d+/);
                    target = match ? parseInt(match[0]) : 0;
                }
                const MAX_EMOM_SETS = 15; // 15-minute/15-set cap

                if (setIndex === currentSets.length - 1) {
                    if (!isNaN(reps)) {
                        // Add new set if target hit AND under the cap
                        if (((reps >= target && target > 0) || (isMax && reps > 0)) && currentSets.length < MAX_EMOM_SETS) {
                            currentSets.push({ reps: '', weight: currentSets[setIndex].weight, completed: null });
                        }
                    }
                }
            }
            return { ...prev, [exId]: currentSets };
        });
    };

    const handleNotesChange = (exId: string, value: string) => {
        setExerciseNotes(prev => ({ ...prev, [exId]: value }));
    };

    const handleMarkAll = (exId: string, targetReps: string, targetWeight?: string) => {
        setExerciseData(prev => {
            const currentSets = [...(prev[exId] || [])];
            const repsVal = targetReps.split('-')[0].replace(/[^0-9]/g, '');
            if (!repsVal) return prev;

            const newSets = currentSets.map(s => {
                if (s.completed) return s;
                return {
                    ...s,
                    weight: (s.weight === "" && targetWeight && targetWeight !== "0") ? targetWeight : s.weight,
                    reps: s.reps === "" ? repsVal : s.reps,
                    completed: true
                };
            });
            return { ...prev, [exId]: newSets };
        });
    };

    /**
     * Persists the athlete's swap under the plan they are training.
     *
     * The previous implementation matched six hardcoded exercise names and did
     * nothing for anything else, while still rendering a Swap button on every
     * exercise that had alternates. Choices are now keyed by canonical exercise
     * id, and resolveDay re-validates them against the current policy on every
     * load, so narrowing a pool retires choices made under the old one.
     */
    const handleSwapChoice = async (originalId: string, replacementId: string | null) => {
        if (!user) return;
        const path = `exerciseSwaps.${programData.id}.${originalId}`;
        try {
            await updateDoc(doc(db, 'users', user.id), {
                [path]: replacementId ?? deleteField(),
            });
        } catch (error) {
            console.error('[workout] could not save swap', error);
        }
        setSwapTarget(null);
    };

    // Add Extra Set Handler - allows adding one extra set to any exercise
    const handleAddExtraSet = (exId: string) => {
        setExerciseData(prev => {
            const currentSets = [...(prev[exId] || [])];
            if (currentSets.length === 0) return prev;

            // Find the last completed set to auto-fill weight
            let lastCompletedWeight = "";
            for (let i = currentSets.length - 1; i >= 0; i--) {
                if (currentSets[i].completed && currentSets[i].weight) {
                    lastCompletedWeight = currentSets[i].weight;
                    break;
                }
            }

            // If no completed set found, use the weight from the last set (even if not completed)
            if (!lastCompletedWeight && currentSets[currentSets.length - 1].weight) {
                lastCompletedWeight = currentSets[currentSets.length - 1].weight;
            }

            // Tagged so the saved log records that this set was added by the
            // athlete rather than prescribed. Progression must count only
            // prescribed work, or adding a junk set blocks a weight increase.
            currentSets.push({
                reps: '',
                weight: lastCompletedWeight,
                completed: null,
                kind: 'extra'
            });

            return { ...prev, [exId]: currentSets };
        });
    };

    // Remove Extra Set Handler - only allows trimming sets added beyond the plan's base count
    const handleRemoveExtraSet = (exId: string) => {
        setExerciseData(prev => {
            const currentSets = [...(prev[exId] || [])];
            const ex = dayData?.exercises.find(e => e.id === exId);
            if (!ex) return prev;

            const baseCount = getBaseSetsCount(ex, weekNum, programData.id);
            if (currentSets.length <= baseCount) return prev;

            currentSets.pop();
            return { ...prev, [exId]: currentSets };
        });
    };

    const handleSaveSession = async () => {
        if (!user) return;
        setSubmitting(true);
        try {
            const userRef = doc(db, 'users', user.id);
            const updatePayload: any = {};
            if (!isExistingLog) {
                updatePayload.completedSessions = increment(1);
                // Also update program specific progress
                updatePayload[`programProgress.${programData.id}.completedSessions`] = increment(1);
            }

            if (Object.keys(updatePayload).length > 0) {
                await updateDoc(userRef, updatePayload);
            }

            // Set by progression effects below; consumed after the save.
            let navigateToDashboard: Record<string, boolean> | null = null;
            // A modal raised by progression. Opened after the session is saved,
            // so a failed save never leaves the athlete answering a prompt about
            // work that was not recorded.
            let pendingModal: 'deficit' | 'trinary-rerun' | 'weak-point' | null = null;

            // Per-plan save-time progression — see
            // src/features/workout/progression/, checked by verify:progression.
            {
                const handler = PROGRESSION_HANDLERS[programData.id];
                if (handler) {
                    const result = handler({
                        planId: programData.id,
                        week: weekNum,
                        day: dayNum,
                        isExistingLog,
                        user,
                        workout: dayData,
                        sets: exerciseData,
                        selections: { meProgression: meRpeSelected, slowVelocity: slowVelocitySelected },
                    });

                    const payload: Record<string, unknown> = { ...result.updates };
                    for (const append of result.appends) {
                        payload[append.field] = arrayUnion(append.value);
                    }
                    for (const [field, by] of Object.entries(result.increments ?? {})) {
                        payload[field] = increment(by);
                    }
                    if (Object.keys(payload).length > 0) {
                        await updateDoc(userRef, payload);
                    }

                    // Effects are performed after the write, so a failed save
                    // never shows a completion screen for work that was not saved.
                    for (const effect of result.effects) {
                        if (effect.type === 'openSkeletonCompletion') {
                            navigateToDashboard = { showSkeletonCompletion: true };
                        } else if (effect.type === 'openPencilneckCompletion') {
                            navigateToDashboard = { showPencilneckCompletion: true };
                        } else if (effect.type === 'openDeficitFeedback') {
                            pendingModal = 'deficit';
                        } else if (effect.type === 'openTrinaryRerun') {
                            pendingModal = 'trinary-rerun';
                        } else if (effect.type === 'openWeakPointPicker') {
                            pendingModal = 'weak-point';
                        }
                    }
                }
            }

            // First-exposure calibration. Runs for every plan, not just those
            // with a per-plan handler, because it keys off the athlete's
            // pendingCalibration rather than the program's identity.
            {
                const ctx = {
                    planId: programData.id,
                    week: weekNum,
                    day: dayNum,
                    isExistingLog,
                    user,
                    workout: dayData,
                    sets: exerciseData,
                };
                const map = activePlanConfig.calibration?.exerciseNameToStat;
                const outcomes = calibrationOutcomes(ctx, map);
                const result = calibrationProgression(ctx, map);
                if (Object.keys(result.updates).length > 0) {
                    await updateDoc(userRef, result.updates);
                }
                if (outcomes.length) setCalibrationResults(outcomes);
            }

            const sessionLog = {
                date: new Date().toISOString(),
                week: weekNum,
                day: dayNum,
                dayName: dayData?.dayName,
                exercises: Object.entries(exerciseData).map(([id, sets]) => {
                    const source = dayData?.exercises.find(e => e.id === id);
                    return {
                        id,
                        name: source?.name || "Unknown",
                        // Canonical library id alongside the display name, so
                        // history survives a rename; older logs keep resolving
                        // by name through the alias table.
                        ...((source as { exerciseId?: string })?.exerciseId
                            ? { exerciseId: (source as { exerciseId?: string }).exerciseId }
                            : {}),
                        setsData: sets.map(set => {
                            const exerciseId = (source as { exerciseId?: string })?.exerciseId;
                            const mode = exerciseId ? EXERCISE_BY_ID[exerciseId]?.weightMode : undefined;
                            const bodyweight = user.kaliStatus?.bodyweightKg;
                            const external = Number(set.weight);
                            return programData.id === 'kali' && bodyweight && Number.isFinite(external) && (mode === 'bodyweight' || mode === 'weighted-bodyweight')
                                ? { ...set, totalSystemWeightKg: Math.max(0, bodyweight + external) }
                                : set;
                        }),
                        notes: exerciseNotes[id] || null
                    };
                }),
                programId: programData.id,
                ...(activePlanConfig.session?.kind && { sessionKind: activePlanConfig.session.kind }),
                ...(programData.id === 'redline' && { redline: {
                    blocks: Object.entries(redlineBlockTimes).map(([id, timing]) => {
                        const exercises = dayData?.exercises.filter(ex => ex.prescription?.block?.id === id) ?? [];
                        const kind = exercises[0]?.prescription?.block?.kind === 'finisher' ? 'finisher' as const : 'burn' as const;
                        const signature = JSON.stringify(exercises.map(ex => ({ exerciseId: ex.exerciseId, sets: (exerciseData[ex.id] ?? []).map(set => ({ weight: set.weight, reps: set.reps, completed: set.completed })), duration: ex.prescription?.block?.durationSeconds }))); 
                        return { id, kind, ...timing, completed: true, signature };
                    }), recovery: user.redlineStatus?.nextRecovery?.response,
                } }),
                // Test sessions stay out of PRs, badges and analytics.
                ...(user.isTestAccount === true && { isTest: true })
            };

            const workoutsRef = collection(db, 'users', user.id, 'workouts');

            if (isExistingLog && logId) {
                await updateDoc(doc(workoutsRef, logId), sessionLog);
            } else {
                const workoutRef = doc(workoutsRef);
                const observations = user.isTestAccount === true
                    ? []
                    : extractPerformanceObservations({
                        sessionId: workoutRef.id,
                        date: sessionLog.date,
                        programId: sessionLog.programId,
                        week: sessionLog.week,
                        day: sessionLog.day,
                        exercises: sessionLog.exercises,
                    });
                await createWorkoutWithPerformanceProfile(
                    user.id,
                    workoutRef.id,
                    sessionLog,
                    observations,
                );
            }

            if (programData.id === 'apex-predator') {
                const romIds = [...new Set(dayData?.exercises.map(ex => ex.exerciseId).filter((id): id is string =>
                    Boolean(id && Object.values(APEX_ACCESS).flat().some(movement => movement.exerciseId === id))) ?? [])];
                if (romIds.length) {
                    setApexRomPending(romIds);
                    setSubmitting(false);
                    return;
                }
            }

            // Modals raised by progression, opened now that the session is saved.
            if (pendingModal === 'trinary-rerun') {
                setShowTrinaryRerunModal(true);
                setSubmitting(false);
                return;
            }
            if (pendingModal === 'weak-point') {
                setShowWeakPointModal(true);
                setSubmitting(false);
                return;
            }
            if (pendingModal === 'deficit') {
                setPendingSessionLog(sessionLog);
                setShowDeficitModal(true);
                setSubmitting(false);
                return; // Don't navigate yet - wait for modal response
            }

            // ========== TRINARY SPECIFIC LOGIC ==========

            // ========== END TRINARY LOGIC ==========

            // ========== SUPER MUTANT LOGIC ==========

            // ========== END SUPER MUTANT LOGIC ==========

            // ========== RITUAL OF STRENGTH LOGIC ==========

            // ========== END RITUAL LOGIC ==========

            if (navigateToDashboard) {
                // Clear soft-save draft after successful completion
                const programId = activePlanConfig.program.id;
                const softSaveKey = `workout_draft_${user.id}_${programId}_${weekNum}_${dayNum}`;
                localStorage.removeItem(softSaveKey);

                navigate('/app/dashboard', { state: navigateToDashboard });
                return;
            }

            // Clear soft-save draft after successful completion
            const programId = activePlanConfig.program.id;
            const softSaveKey = `workout_draft_${user.id}_${programId}_${weekNum}_${dayNum}`;
            localStorage.removeItem(softSaveKey);

            // A calibration set established a max the rest of the plan is
            // computed from. Show what it found and what it unlocked before
            // leaving, rather than changing every future load silently.
            if (calibrationResults.length) {
                setSubmitting(false);
                return;
            }

            navigate('/app/dashboard');
        } catch (e) {
            console.error("Save Error:", e);
            alert("Error saving workout. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!weekData || !dayData) {
        return <div className="p-8 text-center text-muted-foreground">{t('workout.restDayOrInvalid')}</div>;
    }

    if (apexRomPending.length && user) {
        const answerRom = async (exerciseId: string, controlled: boolean) => {
            const movement = Object.values(APEX_ACCESS).flat().find(item => item.exerciseId === exerciseId);
            if (!movement) return;
            const current = user.apexPredatorStatus?.rom?.[exerciseId]?.level ?? 1;
            const rom = { ...(user.apexPredatorStatus?.rom ?? {}), [exerciseId]: { level: nextRomLevel(current, controlled, movement.maxRomLevel), updatedWeek: weekNum } };
            await updateDoc(doc(db, 'users', user.id), { 'apexPredatorStatus.rom': rom });
            const remaining = apexRomPending.filter(id => id !== exerciseId);
            setApexRomPending(remaining);
            if (!remaining.length) navigate('/app/dashboard');
        };
        const exerciseId = apexRomPending[0];
        const exercise = dayData.exercises.find(item => item.exerciseId === exerciseId);
        return <main className="instrument-page max-w-2xl space-y-6"><h1>{language === 'pl' ? 'Czy kontrolowałeś ten zakres?' : 'Did you control that range?'}</h1><p className="text-xl">{exercise?.name ?? exerciseId}</p><p className="text-muted-foreground">{language === 'pl' ? 'Tak zwiększa zakres przy następnym kontakcie. Nie utrzymuje obecny poziom.' : 'Yes advances the range at the next exposure. No holds the current level.'}</p><div className="grid grid-cols-2 gap-3"><Button size="lg" className="min-h-14" onClick={() => void answerRom(exerciseId, true)}>{language === 'pl' ? 'Tak' : 'Yes'}</Button><Button size="lg" variant="outline" className="min-h-14" onClick={() => void answerRom(exerciseId, false)}>{language === 'pl' ? 'Nie' : 'No'}</Button></div></main>;
    }

    const resolveDayName = (name: string) => {
        if (name.startsWith('t:')) {
            return resolveTemplate(name, t);
        }
        return name;
    };

    // The session is already saved at this point. This screen exists so a
    // number the whole plan is computed from is never established silently.
    if (calibrationResults.length) {
        return (
            <div className="calibration-result" role="status" aria-live="polite">
                <div className="calibration-result-inner">
                    <p className="calibration-result-label">{t('workout.calibration.resultLabel')}</p>
                    <h1>{t('workout.calibration.resultTitle')}</h1>
                    <p className="calibration-result-copy">{t('workout.calibration.resultCopy')}</p>
                    <ul className="calibration-result-list">
                        {calibrationResults.map(outcome => (
                            <li key={outcome.stat}>
                                <span>{outcome.exerciseName}</span>
                                <em>{outcome.weight}{t('common.kg')} × {outcome.reps}</em>
                                <strong>{outcome.oneRepMax}{t('common.kg')}</strong>
                            </li>
                        ))}
                    </ul>
                    <p className="calibration-result-note">{t('workout.calibration.resultNote')}</p>
                    <Button
                        className="w-full h-12 text-lg font-bold"
                        size="lg"
                        onClick={() => {
                            setCalibrationResults([]);
                            navigate('/app/dashboard');
                        }}
                    >
                        {t('workout.calibration.resultButton')}
                    </Button>
                </div>
            </div>
        );
    }

    // Detect Super Mutant for theme
    const isSuperMutant = programData.id === 'super-mutant';

    const sessionSets = dayData.exercises.flatMap(ex => exerciseData[ex.id] || []);
    // Timed blocks. REDLINE times burn/finisher work; Iron Clock's whole session
    // after the anchor is density blocks, so both read from the same prescription.
    const timedBlocks = ['redline', 'iron-clock'].includes(programData.id) ? [...new Map(dayData.exercises.filter(ex => ['burn','finisher','density'].includes(ex.prescription?.block?.kind ?? '')).map(ex => [ex.prescription!.block!.id, ex.prescription!.block!])).values()] : [];
    const completedSessionSets = sessionSets.filter(set => set.completed).length;
    // A pinned selection wins, but only while it still points at something —
    // a swap or a removed extra set can leave it dangling.
    const pinnedExercise = selectedSet ? dayData.exercises.find(ex => ex.id === selectedSet.exerciseId) : undefined;
    const pinnedSets = pinnedExercise ? (exerciseData[pinnedExercise.id] || []) : [];
    const pinned = pinnedExercise && pinnedSets[selectedSet!.index] ? selectedSet : null;

    const activeExercise = pinned
        ? pinnedExercise!
        : dayData.exercises.find(ex => (exerciseData[ex.id] || []).some(set => !set.completed)) || dayData.exercises[0];
    const activeSets = activeExercise ? (exerciseData[activeExercise.id] || []) : [];
    const unresolvedSetIndex = activeSets.findIndex(set => !set.completed);
    const activeSetIndex = pinned
        ? pinned.index
        : (unresolvedSetIndex >= 0 ? unresolvedSetIndex : Math.max(0, activeSets.length - 1));
    const activeSet = activeSets[activeSetIndex];
    const activeIsPullup = Boolean(activeExercise?.name.includes('Pull-ups'));

    /**
     * Tapping a ledger row hands that set to the console and brings the
     * console back into view — the rows do not edit in place, so a selection
     * the athlete cannot see would be a dead tap.
     */
    const selectSet = (exerciseId: string, index: number) => {
        setSelectedSet({ exerciseId, index });
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        consoleRef.current?.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
    };
    const activePreviousStat = activeExercise ? previousStats[activeExercise.name] : undefined;
    const activeAdvice = activePreviousStat?.advice || "";
    const sessionProgress = sessionSets.length > 0 ? Math.round((completedSessionSets / sessionSets.length) * 100) : 0;

    const logActiveSet = () => {
        if (!activeExercise || !activeSet || !activeSet.reps) return;
        setExerciseData(prev => {
            const config = activeExercise.prescription?.topSetBackoff;
            const topWeight = Number(activeSet.weight);
            const derived = config && activeSetIndex === 0 && Number.isFinite(topWeight) && topWeight > 0
                ? String(deriveBackoffLoad(topWeight, config.backoffPercent, config.incrementKg)) : null;
            return { ...prev, [activeExercise.id]: (prev[activeExercise.id] || []).map((set, index) => {
                if (index === activeSetIndex) return { ...set, completed: true };
                if (derived && index > 0 && !set.weight) return { ...set, weight: derived };
                return set;
            }) };
        });
        // Releasing the pin is what makes the console advance to the next
        // unresolved set instead of sitting on the one just logged.
        setSelectedSet(null);

        // Only where the plan actually prescribes a rest and the athlete
        // opted in; an unrequested countdown is nagging, not help.
        const rest = (activeExercise as { restSeconds?: number }).restSeconds ?? activeExercise.prescription?.restSeconds;
        if (rest && user?.trainingPreferences?.restTimer?.enabled) {
            setRestTimer({ seconds: rest, label: activeExercise.name, key: Date.now() });
        }
    };

    return (
        <div className="instrument-page workout-ledger space-y-6 pb-28">
            {swapTarget && (
                <SwapSheet
                    exerciseName={swapTarget.name}
                    swap={swapTarget.swap}
                    lang={language as 'en' | 'pl'}
                    onChoose={(id) => handleSwapChoice(swapTarget.swap.original, id)}
                    onClose={() => setSwapTarget(null)}
                />
            )}

            {restTimer && (
                <RestTimer
                    key={restTimer.key}
                    seconds={restTimer.seconds}
                    label={restTimer.label}
                    autoStart={user?.trainingPreferences?.restTimer?.autoStart !== false}
                    onDismiss={() => setRestTimer(null)}
                />
            )}
            {/* Pain & Glory: Deficit Snatch Grip RPE Modal */}
            {showDeficitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-300">
                    <div className="bg-card border-4 border-red-700 p-8 rounded-xl max-w-md w-full ">
                        <h2 className="text-2xl font-black text-red-800 text-center mb-2">
                            How Did That Feel?
                        </h2>
                        <p className="text-amber-900 text-center text-sm mb-6">
                            Based on your RPE, we'll adjust next session's weight
                        </p>

                        <div className="space-y-3">
                            <Button
                                onClick={async () => {
                                    // Get actual weight from the workout that was just completed
                                    const deficitExercise = _pendingSessionLog?.exercises.find((ex: any) => ex.name === 'Deficit Snatch Grip Deadlift');
                                    const actualWeight = deficitExercise?.setsData[0]?.weight ? parseFloat(deficitExercise.setsData[0].weight) : (user?.painGloryStatus?.deficitSnatchGripWeight || 0);

                                    // +5 kg next session
                                    await updateDoc(doc(db, 'users', user!.id), {
                                        'painGloryStatus.deficitSnatchGripWeight': actualWeight + 5,
                                        'painGloryStatus.lastFeedback': 'ready_for_more',
                                        'painGloryStatus.lastFeedbackDate': new Date().toISOString()
                                    });
                                    setShowDeficitModal(false);
                                    navigate('/app/dashboard');
                                }}
                                className="w-full h-14 text-lg font-bold bg-red-700 hover:bg-red-800 border-2 border-red-900 text-white shadow-md"
                            >
                                Ready For More (+5 kg)
                            </Button>

                            <Button
                                onClick={async () => {
                                    // Get actual weight from the workout that was just completed
                                    const deficitExercise = _pendingSessionLog?.exercises.find((ex: any) => ex.name === 'Deficit Snatch Grip Deadlift');
                                    const actualWeight = deficitExercise?.setsData[0]?.weight ? parseFloat(deficitExercise.setsData[0].weight) : (user?.painGloryStatus?.deficitSnatchGripWeight || 0);

                                    // Same weight
                                    await updateDoc(doc(db, 'users', user!.id), {
                                        'painGloryStatus.deficitSnatchGripWeight': actualWeight,
                                        'painGloryStatus.lastFeedback': 'good_maintain',
                                        'painGloryStatus.lastFeedbackDate': new Date().toISOString()
                                    });
                                    setShowDeficitModal(false);
                                    navigate('/app/dashboard');
                                }}
                                className="w-full h-14 text-lg font-bold bg-amber-700 hover:bg-amber-800 border-2 border-amber-900 text-white shadow-md"
                            >
                                Good, Maintain
                            </Button>

                            <Button
                                onClick={async () => {
                                    // Get actual weight from the workout that was just completed
                                    const deficitExercise = _pendingSessionLog?.exercises.find((ex: any) => ex.name === 'Deficit Snatch Grip Deadlift');
                                    const actualWeight = deficitExercise?.setsData[0]?.weight ? parseFloat(deficitExercise.setsData[0].weight) : (user?.painGloryStatus?.deficitSnatchGripWeight || 0);

                                    // -5 kg next session (minimum 20kg)
                                    await updateDoc(doc(db, 'users', user!.id), {
                                        'painGloryStatus.deficitSnatchGripWeight': Math.max(20, actualWeight - 5),
                                        'painGloryStatus.lastFeedback': 'wrecked',
                                        'painGloryStatus.lastFeedbackDate': new Date().toISOString()
                                    });
                                    setShowDeficitModal(false);
                                    navigate('/app/dashboard');
                                }}
                                className="w-full h-14 text-lg font-bold bg-stone-700 hover:bg-stone-800 border-2 border-stone-900 text-red-300 shadow-md"
                            >
                                Wrecked (-5 kg)
                            </Button>
                        </div>

                        <p className="text-xs text-center text-amber-800/70 mt-4">
                            Current weight: {user?.painGloryStatus?.deficitSnatchGripWeight || '?'} kg
                        </p>
                    </div>
                </div>
            )}

            {user?.isTestAccount && (
                <div className="lab-mode-banner" role="status">
                    <FlaskConical className="h-4 w-4 shrink-0" />
                    <span>
                        <strong>{t('labMode.title')}</strong> {t('labMode.description')}
                    </span>
                </div>
            )}

            <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate('/app/dashboard')} className="-ml-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {resolveDayName(dayData.dayName)}
                    </h2>
                    <p className="text-muted-foreground">{t('common.week')} {weekNum} {isExistingLog && <span className={`font-bold ml-2 ${activePlanConfig.id === 'pain-and-glory' ? 'text-red-500' : 'text-green-500'}`}>({t('workout.completed')})</span>}</p>
                </div>
            </div>
            {timedBlocks.length > 0 && <section className="border-t border-border" aria-label="Block timers">{timedBlocks.map(block => <BlockTimer key={block.id} label={`${block.kind === 'burn' ? 'BURN' : block.kind === 'density' ? 'BLOCK' : 'FINISHER'} · ${block.id}`} limitSeconds={block.kind === 'burn' ? undefined : block.durationSeconds} onFinish={(elapsedSeconds,expired)=>setRedlineBlockTimes(old=>({...old,[block.id]:{elapsedSeconds,expired}}))}/>)}</section>}

            {activeExercise && activeSet && (
                <section className="live-set-console" aria-label="Active set control deck" ref={consoleRef}>
                    {/* The head's bottom hairline is the session progress rule:
                        the line was already there separating the bands, and now
                        it reports as well. Scale, not height — the meter it
                        replaces animated `height`, which the detector flags. */}
                    <div className="live-set-head" style={{ '--session-progress': sessionProgress / 100 } as React.CSSProperties}>
                        <p className="live-set-label">
                            {t('workout.liveSet')} {completedSessionSets + 1}/{sessionSets.length}
                        </p>
                        <h1>{activeExercise.name}</h1>
                        <p className="sr-only" role="status">{sessionProgress}%</p>
                    </div>
                    <dl className="live-set-spec">
                        <div>
                            <dt>{t('workout.set')}</dt>
                            <dd>{activeSetIndex + 1}/{activeSets.length}</dd>
                        </div>
                        {activePreviousStat && activePreviousStat.weight !== "-" && (
                            <div>
                                <dt>{t('workout.last')}</dt>
                                <dd>{activePreviousStat.weight}{t('common.kg')} × {activePreviousStat.reps}</dd>
                            </div>
                        )}
                        {activeAdvice && (
                            <div className="is-advice">
                                <dt>{t('workout.advice')}</dt>
                                <dd><AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{activeAdvice}</dd>
                            </div>
                        )}
                    </dl>
                    {calibratingStat(activeExercise.name) && (
                        <div className="calibration-band" role="note">
                            <p className="calibration-band-label">{t('workout.calibration.label')}</p>
                            <p className="calibration-band-copy">{t('workout.calibration.instruction')}</p>
                        </div>
                    )}
                    <div className="live-set-measurements">
                        {/* `WEIGHT · AUTO` while the value is still the load the
                            plan computed; plain `WEIGHT` the moment the athlete
                            types their own. Principle 5, on the field it
                            describes rather than as a status line. */}
                        <label data-len={figureLength(activeSet.weight)} style={figureChars(activeSet.weight)}><span>{t('common.weight')}{isAutoLoad(activeExercise, activeSet.weight) && <em> · {t('workout.auto')}</em>}</span><Input inputMode="decimal" value={activeSet.weight} onChange={(event) => handleSetChange(activeExercise.id, activeSetIndex, 'weight', event.target.value, activeIsPullup, activeExercise.target.reps)} aria-label={t('common.weight')} /><b>{t('common.kg')}</b></label>
                        <label data-len={figureLength(activeSet.reps)} style={figureChars(activeSet.reps)}><span>{t('workout.reps')}</span><Input inputMode="numeric" value={activeSet.reps} onChange={(event) => handleSetChange(activeExercise.id, activeSetIndex, 'reps', event.target.value, activeIsPullup, activeExercise.target.reps)} aria-label={t('workout.reps')} /></label>
                    </div>
                    {activeExercise.prescription?.topSetBackoff && activeSetIndex === 0 && <div className="live-set-telemetry">
                        <label><span>RIR</span><select value={activeSet.rir ?? ''} onChange={event => setExerciseData(prev => ({ ...prev, [activeExercise.id]: prev[activeExercise.id].map((set, index) => index === 0 ? { ...set, rir: event.target.value === '' ? undefined : Number(event.target.value) } : set) }))} className="min-h-11 bg-transparent border-b border-input"><option value="">—</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3+</option></select></label>
                        <label><span>{language === 'pl' ? 'Jakość' : 'Quality'}</span><select value={activeSet.quality ?? ''} onChange={event => setExerciseData(prev => ({ ...prev, [activeExercise.id]: prev[activeExercise.id].map((set, index) => index === 0 ? { ...set, quality: event.target.value as SetLog['quality'] } : set) }))} className="min-h-11 bg-transparent border-b border-input"><option value="">—</option><option value="clean">{language === 'pl' ? 'Czysta' : 'Clean'}</option><option value="borderline">{language === 'pl' ? 'Graniczna' : 'Borderline'}</option><option value="invalid">{language === 'pl' ? 'Nieważna' : 'Invalid'}</option></select></label>
                    </div>}
                    {(activeExercise.target.rpe !== undefined || activeExercise.rest) && (
                        <div className="live-set-telemetry">
                            {activeExercise.target.rpe !== undefined && <div><span>{t('workout.rpe')}</span><strong>{activeExercise.target.rpe}</strong></div>}
                            {activeExercise.rest && <div><span>{t('workout.restLabel')}</span><strong>{activeExercise.rest}</strong></div>}
                        </div>
                    )}
                    {/* Saved looks saved: re-opening a logged set must not
                        offer a button that appears to do nothing. */}
                    <Button size="lg" onClick={logActiveSet} disabled={!activeSet.reps || Boolean(activeExercise.prescription?.topSetBackoff && activeSetIndex === 0 && (activeSet.rir == null || !activeSet.quality))} className="log-set-command"><CheckCircle2 className="mr-2 h-5 w-5" />{activeSet.completed ? t('workout.updateSet') : t('workout.logSet')}</Button>
                </section>
            )}

            <div className="workout-exercises space-y-8">
                {dayData.exercises.map((ex) => {
                    const sets = exerciseData[ex.id] || [];
                    const prevStat = previousStats[ex.name];
                    const targetWeight = calculateWeight(ex);

                    // Generate warm-up sets for bench/squat/deadlift variations
                    const isMainLift = ex.name.toLowerCase().includes('bench') ||
                        ex.name.toLowerCase().includes('squat') ||
                        ex.name.toLowerCase().includes('deadlift');

                    const isHeavyDay = ex.name.includes('(ME)') ||
                        ex.name.includes('Heavy') ||
                        ex.name.includes('Ascension Test') ||
                        (!ex.name.includes('(Light)') && !ex.name.includes('(DE)') && !ex.name.includes('(RE)'));

                    let warmupSets: { weight: string; reps: string }[] | null = null;

                    if (isMainLift && targetWeight && parseFloat(targetWeight) > 20) {
                        const firstSetWeight = parseFloat(targetWeight);
                        const roundTo2_5 = (w: number) => Math.floor(w / 2.5) * 2.5;

                        // Special case: Deficit Snatch Grip Deadlift only gets 3 warm-up sets
                        if (ex.name === "Deficit Snatch Grip Deadlift") {
                            warmupSets = [
                                { weight: '20', reps: '8-10' }, // Empty bar
                                { weight: roundTo2_5(firstSetWeight * 0.5).toString(), reps: '5' },
                                { weight: roundTo2_5(firstSetWeight * 0.7).toString(), reps: '3' }
                            ];
                        } else {
                            // Check if this is a 1RM test
                            const is1RMTest = ex.name.includes('1RM') || ex.name.includes('TEST');

                            // Standard warm-up progression for other lifts
                            // For 1RM tests: use 80%/90% (more conservative)
                            // For normal: use 85%/95%
                            const doublePercent = is1RMTest ? 0.80 : 0.85;
                            const singlePercent = is1RMTest ? 0.90 : 0.95;

                            warmupSets = [
                                { weight: '20', reps: '8-10' }, // Empty bar
                                { weight: roundTo2_5(firstSetWeight * 0.5).toString(), reps: '5' },
                                { weight: roundTo2_5(firstSetWeight * 0.7).toString(), reps: '3' },
                                { weight: roundTo2_5(firstSetWeight * doublePercent).toString(), reps: '2' }
                            ];

                            // Add final single only on heavy days
                            if (isHeavyDay) {
                                warmupSets.push({ weight: roundTo2_5(firstSetWeight * singlePercent).toString(), reps: '1' });
                            }
                        }
                    }

                    const isGiantSet = !!ex.giantSetConfig;
                    const isPullup = ex.name.includes("Pull-ups");
                    const isDragonFlag = ex.name.includes("Dragon Flags");
                    const isNordic = ex.name === "Nordic Curls" || ex.name === "Glute-Ham Raise";
                    const isAroundWorlds = ex.name === "Around-the-Worlds" || ex.name === "Power Hanging Leg Raises";
                    const isPlank = ex.name === "Planks";

                    const weightDisabled = isDragonFlag || isNordic || isAroundWorlds || isPlank;


                    // --- tips -------------------------------------------
                    // Two layers, resolved once: the plan's prescription cues
                    // for this set, then the movement's own coaching cue. See
                    // src/features/tips/resolve.ts for the precedence rules.
                    const libraryEntry = exerciseResolver.resolve(ex.name);
                    const variantTip = getVariantTip(ex.name, weekNum);
                    // resolveDay already merged the library cue, any plan-scoped
                    // override and the plan's own notes into these.
                    const resolvedTips: string[] = (ex as { tips?: string[] }).tips ?? [];

                    // Bar warm-up ramps are prescription content: they describe
                    // how today's heavy set is approached, not how the movement
                    // is performed.
                    const warmupKey = ex.name === "Paused Bench Press" && programData.id === 'bench-domination'
                        ? undefined
                        : ex.name.toLowerCase().includes('bench') ? 'tips.warmupBench'
                            : ex.name.toLowerCase().includes('squat') && ex.name !== 'Hack Squat Calf Raises' ? 'tips.warmupSquat'
                                : ex.name.toLowerCase().includes('deadlift') ? 'tips.warmupDeadlift'
                                    : undefined;
                    const translated = (key?: string) => {
                        if (!key) return undefined;
                        const value = t(key);
                        return value && value !== key ? value : undefined;
                    };

                    let pullupKey: string | undefined;
                    if (ex.name.includes("Pull-ups") && programData.id === 'bench-domination') {
                        pullupKey = weekNum <= 3 ? 'tips.pullupWeeks1to3'
                            : weekNum <= 6 ? 'tips.pullupWeeks4to6'
                                : weekNum <= 9 ? 'tips.pullupWeeks7to9'
                                    : weekNum === 10 ? 'tips.pullupWeek10'
                                        : 'tips.pullupWeeks11to12';
                    }

                    const planNote = ex.notes
                        ? (ex.notes.startsWith('t:') ? translated(ex.notes.substring(2)) : ex.notes)
                        : undefined;

                    // `resolvedTips` arrives with the library cue already folded
                    // in. Left alone it lands in the prescription layer and the
                    // general layer is then dropped as a duplicate — which is
                    // how a two-colour system renders in one colour. Pull the
                    // movement's own cue back out so it can be its own layer.
                    const generalTexts = new Set(
                        [libraryEntry?.tip?.en, libraryEntry?.tip?.pl]
                            .filter((text): text is string => !!text?.trim())
                            .map(text => text.trim().replace(/\s+/g, ' ').toLowerCase().replace(/[.!]+$/, '')),
                    );
                    const planOnlyTips = resolvedTips.filter(text =>
                        !generalTexts.has(text.trim().replace(/\s+/g, ' ').toLowerCase().replace(/[.!]+$/, '')));

                    const prescriptionSources: ({ en?: string; pl?: string } | undefined)[] = [
                        translated(warmupKey) ? { en: translated(warmupKey) } : undefined,
                        variantTip,
                        // Only when the variant path bypassed resolution; otherwise
                        // resolvedTips already carries the note.
                        ...(variantTip ? [] : planOnlyTips.map(text => ({ en: text }))),
                        variantTip && planNote ? { en: planNote } : undefined,
                        pullupKey && translated(pullupKey) ? { en: translated(pullupKey) } : undefined,
                        (ex.name === "Nordic Curls" || ex.name === "Glute-Ham Raise") ? { en: t('tips.nordicSwapTip') } : undefined,
                    ];

                    const tips = resolveTips({
                        general: libraryEntry?.tip,
                        prescription: prescriptionSources,
                        suppressGeneral: (ex as { suppressGeneralTip?: boolean }).suppressGeneralTip,
                    }, language as 'en' | 'pl');

                    let advice = prevStat?.advice || "";

                    return (
                        <section key={ex.id} className="ledger-exercise" aria-label={ex.name}>
                            {/* A section header, not a control. Nothing collapses:
                                the whole session stays scannable, which is the
                                point of a protocol sheet. */}
                            <header className="ledger-exercise-head">
                                <div className="ledger-exercise-id">
                                    <h2 className={isSuperMutant ? 'mutant-text' : undefined}>{ex.name}</h2>
                                    <p className="ledger-prescription">
                                        {isGiantSet ? (
                                            <>{ex.sets} {t('workout.giantSets')} × {ex.giantSetConfig?.steps.map(s => `${s.targetReps} ${s.name}`).join(', ')}</>
                                        ) : ex.sets > 0 ? (
                                            <>
                                                {ex.sets} {t('workout.sets')} × {ex.target.reps === "Failure" ? t('common.failure') : `${ex.target.reps} ${t('workout.reps')}`}
                                                {targetWeight && targetWeight !== "0" && <> · {targetWeight}{t('common.kg')}</>}
                                            </>
                                        ) : null}
                                    </p>
                                </div>
                                {(ex as { swap?: import('../data/exercises/types').ResolvedSwap }).swap && (
                                    <button
                                        type="button"
                                        className="ledger-swap"
                                        onClick={() => {
                                            const resolved = (ex as { swap?: import('../data/exercises/types').ResolvedSwap }).swap;
                                            if (resolved) setSwapTarget({ name: ex.name, swap: resolved });
                                        }}
                                    >
                                        <Repeat className="h-4 w-4" aria-hidden="true" />
                                        <span>{t('workout.swap')}</span>
                                    </button>
                                )}
                            </header>

                            {(prevStat && prevStat.weight !== "-") || advice ? (
                                <dl className="ledger-spec">
                                    {prevStat && prevStat.weight !== "-" && (
                                        <div>
                                            <dt>{t('workout.last')}</dt>
                                            <dd>{prevStat.weight}{t('common.kg')} × {prevStat.reps}</dd>
                                        </div>
                                    )}
                                    {advice && (
                                        <div className="is-advice">
                                            <dt>{t('workout.advice')}</dt>
                                            <dd><AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{advice}</dd>
                                        </div>
                                    )}
                                </dl>
                            ) : null}

                            {(tips.prescription.length > 0 || tips.general) && (
                                <ul className="ledger-tips">
                                    {/* Order and colour carry the distinction:
                                        the plan speaks first in its own accent,
                                        the movement's cue follows, quieter. */}
                                    {tips.prescription.map((tip, i) => (
                                        <li key={`p${i}`} className="ledger-tip-prescription">
                                            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" /><span>{tip}</span>
                                        </li>
                                    ))}
                                    {tips.general && (
                                        <li className="ledger-tip-general">
                                            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" /><span>{tips.general}</span>
                                        </li>
                                    )}
                                </ul>
                            )}

                            <PrescriptionBadges
                                pairRole={(ex as { group?: { role?: string } }).group?.role ?? ex.prescription?.pair}
                                tempo={(ex as { tempo?: string }).tempo ?? ex.prescription?.tempo}
                                restSeconds={(ex as { restSeconds?: number }).restSeconds ?? ex.prescription?.restSeconds}
                                technique={(ex as { technique?: never }).technique ?? ex.prescription?.technique}
                            />

                            {programData.id === 'ritual-of-strength' && ex.name.includes('(Light)') && (
                                <button
                                    type="button"
                                    aria-pressed={Boolean(slowVelocitySelected[ex.id])}
                                    onClick={() => setSlowVelocitySelected(current => ({ ...current, [ex.id]: !current[ex.id] }))}
                                    className={`min-h-11 w-full border px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] ${slowVelocitySelected[ex.id] ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground'}`}
                                >
                                    {t('workout.velocitySlow')}
                                </button>
                            )}

                            {/* Warm-ups are shown but never logged, so they are
                                half-ink and not tappable — visible ramp, no
                                competition with real sets. */}
                            {warmupSets && warmupSets.length > 0 && (
                                <div className="ledger-rows is-warmup">
                                    <p className="ledger-group-label">{t('workout.warmup')}</p>
                                    {warmupSets.map((w, i) => (
                                        <div key={`warmup-${i}`} className="ledger-row is-warmup">
                                            <span className="ledger-row-n">W{i + 1}</span>
                                            <span className="ledger-row-value">{w.weight}{t('common.kg')} × {w.reps}</span>
                                            <span className="ledger-row-state" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="ledger-rows">
                                {isGiantSet ? (
                                    sets.map((set, idx) => {
                                        const steps = ex.giantSetConfig?.steps || [];
                                        const stepCount = steps.length;
                                        if (stepCount === 0) return null;

                                        const subIndex = idx % stepCount;
                                        const giantSetIndex = Math.floor(idx / stepCount) + 1;
                                        const step = steps[subIndex];
                                        const isSelected = activeExercise?.id === ex.id && activeSetIndex === idx;

                                        return (
                                            <React.Fragment key={idx}>
                                                {subIndex === 0 && (
                                                    <p className="ledger-group-label">{t('workout.giantSet')} {giantSetIndex}</p>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => selectSet(ex.id, idx)}
                                                    aria-current={isSelected ? 'true' : undefined}
                                                    className={cn('ledger-row is-step-row', set.completed ? 'is-complete' : '', isSelected ? 'is-selected' : '')}
                                                >
                                                    <span className="ledger-row-n is-step">{step.name}</span>
                                                    <span className="ledger-row-value">
                                                        {set.weight ? <>{set.weight}{t('common.kg')} × </> : null}
                                                        {set.reps || <em>{step.targetReps}</em>}
                                                    </span>
                                                    <span className="ledger-row-state">
                                                        {set.completed ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : <Circle className="h-5 w-5" aria-hidden="true" />}
                                                        <span className="sr-only">{set.completed ? t('workout.rowDone') : t('workout.rowPending')}</span>
                                                    </span>
                                                </button>
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    sets.map((set, idx) => {
                                        // Technique rows carry their own label
                                        // ("Drop 1") and must not be numbered
                                        // alongside the prescribed sets.
                                        const isTechniqueRow = Boolean(set.label);
                                        const workNumber = sets
                                            .slice(0, idx + 1)
                                            .filter(s => !s.label && s.kind !== 'extra').length;
                                        const extraNumber = sets
                                            .slice(0, idx + 1)
                                            .filter(s => s.kind === 'extra' && !s.label).length;
                                        const isSelected = activeExercise?.id === ex.id && activeSetIndex === idx;
                                        const isAmrap = ex.target.type === 'amrap';
                                        const prescribedReps = ex.target.reps.replace(/[^0-9-]/g, '');

                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => selectSet(ex.id, idx)}
                                                aria-current={isSelected ? 'true' : undefined}
                                                className={cn(
                                                    'ledger-row',
                                                    isTechniqueRow ? 'is-step-row' : '',
                                                    set.completed ? 'is-complete' : '',
                                                    isSelected ? 'is-selected' : '',
                                                    isTechniqueRow ? 'is-technique-row' : '',
                                                    set.kind === 'extra' ? 'is-extra-row' : '',
                                                    isAmrap ? 'is-amrap' : ''
                                                )}
                                            >
                                                <span className={cn('ledger-row-n', isTechniqueRow && 'is-step')}>
                                                    {isTechniqueRow ? set.label : set.kind === 'extra' ? `+${extraNumber}` : workNumber}
                                                </span>
                                                <span className="ledger-row-value">
                                                    {!weightDisabled && (
                                                        set.weight
                                                            ? <>{set.weight}{t('common.kg')} </>
                                                            : (targetWeight && targetWeight !== "0" ? <em>{targetWeight}{t('common.kg')} </em> : null)
                                                    )}
                                                    <i aria-hidden="true">×</i>{' '}
                                                    {set.reps || <em>{isAmrap ? t('workout.amrap') : (prescribedReps || '—')}</em>}
                                                </span>
                                                <span className="ledger-row-state">
                                                    {set.completed ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : <Circle className="h-5 w-5" aria-hidden="true" />}
                                                    <span className="sr-only">{set.completed ? t('workout.rowDone') : t('workout.rowPending')}</span>
                                                </span>
                                            </button>
                                        );
                                    })
                                )}
                            </div>

                            {/* Adding volume is the athlete's call, so it is a
                                quiet row rather than a control wearing a
                                warning label. */}
                            <div className="ledger-extra">
                                <div>
                                    <button type="button" onClick={() => handleAddExtraSet(ex.id)}>+ {t('workout.addSet')}</button>
                                    {sets.length > getBaseSetsCount(ex, weekNum, programData.id) && (
                                        <button type="button" onClick={() => handleRemoveExtraSet(ex.id)}>− {t('workout.removeSet')}</button>
                                    )}
                                </div>
                                <p>{t('workout.extraSetNote')}</p>
                            </div>

                                {/* Intensity Technique callout */}
                                {ex.intensityTechnique && (
                                    <div className="mx-3 mt-3 p-3 bg-accent/15 border border-accent rounded-lg">
                                        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                            <svg className="w-4 h-4 shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                            </svg>
                                            <span className="uppercase tracking-wide">{ex.intensityTechnique}</span>
                                        </div>
                                    </div>
                                )}

                                {/* EMOM Total Rep Counter for Pull-ups */}
                                {isPullup && programData.id === 'bench-domination' && (
                                    <div className="mx-3 mt-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                                        {(() => {
                                            const totalReps = sets.reduce((sum, s) => sum + (parseInt(s.reps) || 0), 0);
                                            const completedSets = sets.filter(s => s.completed).length;
                                            const MAX_SETS = 15;
                                            const isEMOMComplete = completedSets >= MAX_SETS;

                                            if (isEMOMComplete) {
                                                return (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                                                            <CheckCircle2 className="w-5 h-5" />
                                                            <span>EMOM Complete – 15 sets reached!</span>
                                                        </div>
                                                        <div className="text-lg font-bold text-primary">
                                                            Total reps this session: {totalReps}
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-muted-foreground">
                                                        Sets: {completedSets}/{MAX_SETS}
                                                    </span>
                                                    <span className="text-sm font-bold text-primary">
                                                        Total reps: {totalReps}
                                                    </span>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* Trinary: RPE Selector for ME exercises (appears once all sets hit the required top reps) */}
                                {programData.id === 'trinary' && ex.name.includes('(ME)') && (() => {
                                    const sets = exerciseData[ex.id] || [];
                                    const requiredReps = ex.sets <= 1 ? 1 : 3;
                                    const allHit3 = sets.length >= ex.sets && sets.every(s => parseInt(s.reps) >= requiredReps);

                                    if (!allHit3) return null;

                                    return (
                                        <div className="p-4 bg-secondary border-t border-border space-y-3">
                                            <div className="text-sm font-bold text-muted-foreground">{t('trinary.rpeSelector.title')}</div>
                                            <p className="text-xs text-muted-foreground">{t('trinary.rpeSelector.description')}</p>

                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setMeRpeSelected(prev => ({ ...prev, [ex.id]: 7 }))}
                                                    className={`p-3 rounded border text-sm transition-all ${meRpeSelected[ex.id] === 7
                                                        ? 'bg-green-600 border-green-500 text-white'
                                                        : 'bg-secondary border-border text-muted-foreground hover:bg-secondary'
                                                        }`}
                                                >
                                                    <div className="font-bold">RPE ≤7</div>
                                                    <div className="text-xs mt-1 opacity-80">+10kg</div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setMeRpeSelected(prev => ({ ...prev, [ex.id]: 7.5 }))}
                                                    className={`p-3 rounded border text-sm transition-all ${meRpeSelected[ex.id] === 7.5
                                                        ? 'bg-yellow-600 border-yellow-500 text-white'
                                                        : 'bg-secondary border-border text-muted-foreground hover:bg-secondary'
                                                        }`}
                                                >
                                                    <div className="font-bold">RPE 7-8</div>
                                                    <div className="text-xs mt-1 opacity-80">+5kg</div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setMeRpeSelected(prev => ({ ...prev, [ex.id]: 8.5 }))}
                                                    className={`p-3 rounded border text-sm transition-all ${meRpeSelected[ex.id] === 8.5
                                                        ? 'bg-red-600 border-red-500 text-white'
                                                        : 'bg-secondary border-border text-muted-foreground hover:bg-secondary'
                                                        }`}
                                                >
                                                    <div className="font-bold">RPE 8-9</div>
                                                    <div className="text-xs mt-1 opacity-80">+2.5kg</div>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Ritual: Safety Checkbox for ME exercises (appears when user enters 1 rep) */}
                                {programData.id === 'ritual-of-strength' && ex.name.includes('(ME)') && (() => {
                                    const sets = exerciseData[ex.id] || [];
                                    // Show checkbox as soon as user enters "1" in any rep field
                                    const hasAnySingle = sets.some(s => parseInt(s.reps) === 1);

                                    if (!hasAnySingle) return null;

                                    const isChecked = meRpeSelected[ex.id] !== null && meRpeSelected[ex.id] !== undefined;
                                    const progressionAmount = meRpeSelected[ex.id];

                                    return (
                                        <div className="p-4 bg-red-950/30 border-t border-red-900/50 space-y-3">
                                            <div className="text-sm font-bold text-red-200">ME Single Progression</div>

                                            {/* Safety Checkbox */}
                                            <label className="flex items-start gap-3 cursor-pointer p-3 bg-red-900/20 border border-red-800/50 rounded hover:bg-red-900/30 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setMeRpeSelected(prev => ({ ...prev, [ex.id]: 2.5 })); // Default +2.5kg
                                                        } else {
                                                            setMeRpeSelected(prev => ({ ...prev, [ex.id]: null }));
                                                        }
                                                    }}
                                                    className="mt-1 w-5 h-5 accent-red-600 cursor-pointer"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold text-red-100">RPE 9 or lower with perfect form?</div>
                                                    <div className="text-xs text-red-300/70 mt-1">
                                                        Clean execution (no hitch, full ROM, stable movement)
                                                    </div>
                                                </div>
                                            </label>

                                            {/* Optional: Increase to +5kg if exceptionally easy */}
                                            {isChecked && (
                                                <div className="pl-8 space-y-2">
                                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-red-200">
                                                        <input
                                                            type="checkbox"
                                                            checked={progressionAmount === 5}
                                                            onChange={(e) => {
                                                                setMeRpeSelected(prev => ({
                                                                    ...prev,
                                                                    [ex.id]: e.target.checked ? 5 : 2.5
                                                                }));
                                                            }}
                                                            className="w-4 h-4 accent-green-600 cursor-pointer"
                                                        />
                                                        <span className="text-green-400">Exceptionally easy? Add +5kg instead of +2.5kg</span>
                                                    </label>
                                                    <div className="text-xs text-red-300/60">
                                                        Next session: <span className="font-bold text-red-200">+{progressionAmount}kg</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Ritual: Velocity Check for Light work exercises */}
                                {programData.id === 'ritual-of-strength' && ex.name.includes('(Light)') && (() => {
                                    const sets = exerciseData[ex.id] || [];
                                    // Show checkbox only after user has entered reps in all 3 sets
                                    const allSetsHaveReps = sets.length >= 3 && sets.slice(0, 3).every(s => s.reps && s.reps !== '');

                                    if (!allSetsHaveReps) return null;

                                    const isChecked = meRpeSelected[ex.id] !== null && meRpeSelected[ex.id] !== undefined;
                                    const needsReduction = meRpeSelected[ex.id] === -5;

                                    return (
                                        <div className="p-4 bg-blue-950/30 border-t border-blue-900/50 space-y-3">
                                            <div className="text-sm font-bold text-blue-200">Velocity Work Check</div>

                                            {/* Velocity Checkbox */}
                                            <label className="flex items-start gap-3 cursor-pointer p-3 bg-blue-900/20 border border-blue-800/50 rounded hover:bg-blue-900/30 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked && !needsReduction}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setMeRpeSelected(prev => ({ ...prev, [ex.id]: 0 })); // No change
                                                        } else {
                                                            setMeRpeSelected(prev => ({ ...prev, [ex.id]: -5 })); // Reduce by 5%
                                                        }
                                                    }}
                                                    className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold text-blue-100">Good bar speed? (Target: &gt;0.8 m/s)</div>
                                                    <div className="text-xs text-blue-300/70 mt-1">
                                                        Explosive, fast movement with perfect form
                                                    </div>
                                                    {needsReduction && (
                                                        <div className="text-xs text-orange-400 mt-2 font-semibold">
                                                            Next session: -5% weight (bar was slow)
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                    );
                                })()}

                                <div className="p-3 bg-secondary/5 border-t border-border space-y-3">
                                    <div className="relative">
                                        <Input
                                            placeholder={t('workout.notesPlaceholder')}
                                            value={exerciseNotes[ex.id] || ""}
                                            onChange={(e) => handleNotesChange(ex.id, e.target.value)}
                                            className="text-sm pr-8 bg-background"
                                        />
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full text-xs h-8"
                                        onClick={() => handleMarkAll(ex.id, ex.target.reps, targetWeight)}
                                    >
                                        <CheckCircle2 className="w-3 h-3 mr-2" /> {t('workout.completed')}
                                    </Button>
                                </div>
                        </section>
                    );
                })}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:static md:bg-transparent md:border-0 md:p-0">
                <Button
                    className="w-full h-14 text-lg font-bold shadow-lg"
                    onClick={handleSaveSession}
                    disabled={submitting}
                >
                    {submitting ? t('workout.saving') : t('workout.completeWorkout')} <Save className="ml-2 h-5 w-5" />
                </Button>
            </div>

            {/* Trinary: Weak Point Modal */}
            <WeakPointModal
                open={showWeakPointModal}
                onClose={() => setShowWeakPointModal(false)}
                onSubmit={async (weakPoints) => {
                    if (!user) return;
                    const status = (user as any).trinaryStatus;
                    if (!status) return;

                    // Select variations based on weak points
                    const excluded = status.excludedVariations || [];
                    const newBenchVariation = selectVariation('bench', weakPoints.bench, status.benchVariation, excluded);
                    const newDeadliftVariation = selectVariation('deadlift', weakPoints.deadlift, status.deadliftVariation, excluded);
                    const newSquatVariation = selectVariation('squat', weakPoints.squat, status.squatVariation, excluded);

                    // STORE pending data and open swap modal
                    setPendingWeakPoints(weakPoints);
                    setPendingVariations({
                        bench: newBenchVariation,
                        deadlift: newDeadliftVariation,
                        squat: newSquatVariation
                    });
                    setShowWeakPointModal(false);
                    setShowVariationSwapModal(true);
                }}
                currentWeakPoints={{
                    bench: (user as any)?.trinaryStatus?.benchWeakPoint,
                    deadlift: (user as any)?.trinaryStatus?.deadliftWeakPoint,
                    squat: (user as any)?.trinaryStatus?.squatWeakPoint
                }}
            />

            {/* Trinary: Variation Swap Modal */}
            {pendingVariations && pendingWeakPoints && (
                <VariationSwapModal
                    open={showVariationSwapModal}
                    onClose={() => setShowVariationSwapModal(false)}
                    initialVariations={pendingVariations}
                    weakPoints={pendingWeakPoints}
                    excludedVariations={(user as any).trinaryStatus?.excludedVariations || []}
                    onConfirm={async (confirmedVariations) => {
                        if (!user || !pendingWeakPoints) return;

                        // Update user profile with weak points and confirmed variations
                        const userRef = doc(db, 'users', user.id);
                        await updateDoc(userRef, {
                            'trinaryStatus.benchWeakPoint': pendingWeakPoints.bench,
                            'trinaryStatus.deadliftWeakPoint': pendingWeakPoints.deadlift,
                            'trinaryStatus.squatWeakPoint': pendingWeakPoints.squat,
                            'trinaryStatus.benchVariation': confirmedVariations.bench,
                            'trinaryStatus.deadliftVariation': confirmedVariations.deadlift,
                            'trinaryStatus.squatVariation': confirmedVariations.squat
                        });

                        setShowVariationSwapModal(false);
                        navigate('/app/dashboard');
                    }}
                />
            )}

            {/* Trinary: Re-run Modal */}
            <TrinaryRerunModal
                open={showTrinaryRerunModal}
                onDeloadWeek={async () => {
                    if (!user) return;
                    const userRef = doc(db, 'users', user.id);

                    // Option A: Deload week with reduced volume/intensity, new variations
                    await updateDoc(userRef, {
                        'trinaryStatus.completedWorkouts': 0,
                        'trinaryStatus.currentBlock': 1,
                        'trinaryStatus.cycleNumber': increment(1),
                        'trinaryStatus.isDeload': true,
                        'trinaryStatus.deloadType': 'week' // 50% volume, -25% ME, -15% DE/RE
                    });

                    // Show weak point modal for new variations
                    setShowTrinaryRerunModal(false);
                    setShowWeakPointModal(true);
                }}
                onContinueNoDeload={async () => {
                    if (!user) return;
                    const userRef = doc(db, 'users', user.id);

                    // Option B: Continue without deload
                    await updateDoc(userRef, {
                        'trinaryStatus.completedWorkouts': 0,
                        'trinaryStatus.currentBlock': 1,
                        'trinaryStatus.cycleNumber': increment(1),
                        'trinaryStatus.isDeload': false
                    });

                    // Show weak point modal for new variations
                    setShowTrinaryRerunModal(false);
                    setShowWeakPointModal(true);
                }}
                onRestDays={async () => {
                    if (!user) return;
                    const userRef = doc(db, 'users', user.id);

                    // Option C: 4-5 days rest, accessory work at RPE 7-8
                    await updateDoc(userRef, {
                        'trinaryStatus.completedWorkouts': 0,
                        'trinaryStatus.currentBlock': 1,
                        'trinaryStatus.cycleNumber': increment(1),
                        'trinaryStatus.isDeload': true,
                        'trinaryStatus.deloadType': 'rest' // 4-5 days off
                    });

                    // Show weak point modal for new variations
                    setShowTrinaryRerunModal(false);
                    setShowWeakPointModal(true);
                }}
            />
        </div>
    );
};
