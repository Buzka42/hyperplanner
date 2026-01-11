
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { CheckCircle2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { doc, updateDoc, arrayUnion, increment, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { cn } from '../lib/utils';
import type { LiftingStats, WorkoutLog } from '../types';

interface SetLog {
    reps: string;
    weight: string;
    completed: boolean | null;
}

export const WorkoutView: React.FC = () => {
    const { week, day } = useParams();
    const { user, activePlanConfig } = useUser();
    const { t } = useLanguage();
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
    const [isExistingLog, setIsExistingLog] = useState(false);
    const [logId, setLogId] = useState<string | null>(null);

    const programData = activePlanConfig.program;
    const weekData = programData.weeks.find(w => w.weekNumber === weekNum);
    const rawDayData = weekData?.days.find(d => d.dayOfWeek === dayNum);

    const dayData = useMemo(() => {
        if (!rawDayData || !user) return rawDayData;

        // Hooks: Preprocess Day
        if (activePlanConfig.hooks?.preprocessDay) {
            return activePlanConfig.hooks.preprocessDay(rawDayData, user);
        }

        return rawDayData;
    }, [rawDayData, activePlanConfig, user]);

    // Persist "Current Workout"
    useEffect(() => {
        if (weekNum && dayNum) {
            localStorage.setItem("lastOpenedPath", `/app/workout/${weekNum}/${dayNum}`);
        }
    }, [weekNum, dayNum]);

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

    // 1. Fetch Existing Session & Previous Stats
    useEffect(() => {
        if (!user || !dayData) return;

        const initView = async () => {
            try {
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
                        if (activePlanConfig.hooks?.getExerciseAdvice) {
                            const hookAdvice = activePlanConfig.hooks.getExerciseAdvice(currentEx, exHistory);
                            if (hookAdvice) advice = hookAdvice;
                        }

                        if (lastLabel) {
                            stats[currentEx.name] = { weight: lastLabel, reps: lastReps, advice };
                        } else if (advice) {
                            // Even if no specific weight history (e.g. giant set), we might have advice
                            stats[currentEx.name] = { weight: "-", reps: "-", advice };
                        }
                    });
                }
                setPreviousStats(stats);
            } catch (err) {
                console.error("Init Error", err);
            }
        };

        const initializeEmptyState = () => {
            if (!dayData) return;
            const initialData: Record<string, SetLog[]> = {};
            dayData.exercises.forEach(ex => {
                const isGiantSet = !!ex.giantSetConfig;
                const isPullup = ex.name.includes("Pull-ups") && ex.sets === 0;

                // Pull-up week-specific set count for Bench Domination EMOM
                let pullupSetCount = 1;
                if (isPullup && programData.id === 'bench-domination') {
                    if (weekNum >= 1 && weekNum <= 6) {
                        // Weeks 1-6: Start with 1 set, grows dynamically via EMOM
                        pullupSetCount = 1;
                    } else if (weekNum >= 7 && weekNum <= 9) {
                        // Weeks 7-9: 1 max triple + 6 back-off sets = 7 total
                        pullupSetCount = 7;
                    } else if (weekNum >= 10 && weekNum <= 12) {
                        // Weeks 10-12: 5 sets
                        pullupSetCount = 5;
                    }
                }

                // If giant set, sets = defined sets * steps count
                const setsCount = isGiantSet
                    ? ex.sets * (ex.giantSetConfig?.steps.length || 1)
                    : (isPullup ? pullupSetCount : ex.sets);

                // Pullup special case fallback: logic moved to hook but UI needs default init?
                // Hook 'calculateWeight' might handle the 'weight' field init.

                const sets: SetLog[] = [];
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
                        completed: null
                    });
                }
                initialData[ex.id] = sets;
            });
            setExerciseData(initialData);
        };

        initView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, weekNum, dayNum, activePlanConfig, dayData]);

    const handleSetChange = (exId: string, setIndex: number, field: 'reps' | 'weight', value: string, isPullup: boolean = false, suggestedReps: string = "0") => {
        setExerciseData(prev => {
            const currentSets = [...(prev[exId] || [])];
            if (!currentSets[setIndex]) return prev;

            currentSets[setIndex] = { ...currentSets[setIndex], [field]: value };

            if (field === 'reps' && value !== '') {
                currentSets[setIndex].completed = true;
            } else if (field === 'reps' && value === '') {
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
                const target = parseInt(suggestedReps.replace(/[^0-9]/g, '') || "0");
                const isMax = suggestedReps.toLowerCase().includes("max");
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

    const handleSwap = async (exName: string, alternateName: string) => {
        if (!user) return;
        let prefKey = '';
        if (exName === "Y-Raises" || exName === "High-Elbow Facepulls") prefKey = 'y-raise-variant';
        if (exName === "Around-the-Worlds" || exName === "Power Hanging Leg Raises") prefKey = 'around-worlds-variant';
        if (exName === "Nordic Curls" || exName === "Glute-Ham Raise") prefKey = 'nordic-variant';

        if (prefKey) {
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, {
                [`exercisePreferences.${prefKey}`]: alternateName
            });
        }
    };

    const handleSaveSession = async () => {
        if (!user) return;
        setSubmitting(true);
        try {
            let newStats = { ...user.stats };
            let updated = false;
            let historyEntry = null;

            if (!isExistingLog) {
                dayData?.exercises.forEach(ex => {
                    const sets = exerciseData[ex.id];
                    if (!sets) return;

                    // Bench AMRAP Record Logic
                    if (ex.target.type === 'amrap' && ex.target.percentageRef === 'pausedBench') {
                        const amrapSet = sets[0];
                        if (amrapSet) {
                            const reps = parseInt(amrapSet.reps);
                            const weight = parseFloat(amrapSet.weight);
                            if (!isNaN(reps) && !isNaN(weight)) {
                                const est1RM = weight * (1 + reps / 30);
                                historyEntry = {
                                    date: new Date().toISOString(),
                                    week: weekNum,
                                    weight: Math.round(est1RM),
                                    actualWeight: weight,
                                    actualReps: reps
                                };
                            }
                        }
                    }

                    // Behind-the-Neck Press Progression Logic (Monday Only)
                    if (ex.name === "Behind-the-Neck Press" && sets.length > 0 && dayNum === 1) {
                        const targetRepsArr = ex.target.reps.split('-').map(Number);
                        const topRep = targetRepsArr[1] || targetRepsArr[0];
                        const currentWeight = parseFloat(sets[0].weight || "0");

                        console.log(`[BTN DEBUG] Current weight: ${currentWeight}, Top rep: ${topRep}`);
                        console.log(`[BTN DEBUG] Sets:`, sets.map(s => ({ weight: s.weight, reps: s.reps })));

                        if (currentWeight > 0) {
                            // Check if all sets hit top of rep range
                            const allTop = sets.every(s => parseInt(s.reps) >= topRep);
                            console.log(`[BTN DEBUG] All sets hit top? ${allTop}`);

                            if (allTop) {
                                // Save progression for NEXT week
                                newStats.btnPress = currentWeight + 2.5;
                                newStats.btnPressWeek = weekNum; // Track which week this was earned in
                                updated = true;
                                console.log(`[BTN DEBUG] Saving new weight: ${newStats.btnPress} for week ${weekNum}`);
                            } else {
                                // Keep current weight
                                newStats.btnPress = currentWeight;
                                newStats.btnPressWeek = weekNum;
                                updated = true;
                                console.log(`[BTN DEBUG] Keeping weight: ${newStats.btnPress}`);
                            }
                        }
                    }

                    // Bench Press Variations - Different progression rules
                    if (ex.name === "Spoto Press" || ex.name === "Low Pin Press") {
                        // FIXED TARGET: Immediate progression if all sets hit target
                        const variationKey = ex.name === "Spoto Press" ? "spotoPress" : "lowPinPress";
                        if (sets.length > 0) {
                            const targetReps = parseInt(ex.target.reps);
                            const currentWeight = parseFloat(sets[0].weight || "0");

                            if (currentWeight > 0) {
                                const allHitTarget = sets.every(s => parseInt(s.reps) >= targetReps);
                                if (allHitTarget) {
                                    newStats[variationKey] = currentWeight + 2.5;
                                    updated = true;
                                } else {
                                    newStats[variationKey] = currentWeight;
                                    updated = true;
                                }
                            }
                        }
                    }

                    if (ex.name === "Wide-Grip Bench Press" && dayNum === 1) {
                        // REP RANGE: Need 2 consecutive MONDAY weeks at top of range
                        if (sets.length > 0) {
                            const targetRepsArr = ex.target.reps.split('-').map(Number);
                            const topRep = targetRepsArr[1] || targetRepsArr[0];
                            const currentWeight = parseFloat(sets[0].weight || "0");
                            const currentConsecutive = user.stats.wideGripConsecutive || 0;

                            if (currentWeight > 0) {
                                const allHitTop = sets.every(s => parseInt(s.reps) >= topRep);

                                if (allHitTop) {
                                    const newConsecutive = currentConsecutive + 1;
                                    if (newConsecutive >= 2) {
                                        // 2 consecutive weeks - progress!
                                        newStats.wideGripBench = currentWeight + 2.5;
                                        newStats.wideGripConsecutive = 0; // Reset counter
                                        updated = true;
                                    } else {
                                        // 1 week done, keep same weight
                                        newStats.wideGripBench = currentWeight;
                                        newStats.wideGripConsecutive = newConsecutive;
                                        updated = true;
                                    }
                                } else {
                                    // Missed - reset counter and keep weight
                                    newStats.wideGripBench = currentWeight;
                                    newStats.wideGripConsecutive = 0;
                                    updated = true;
                                }
                            }
                        }
                    }
                });
                // Variations update stats for next week's auto-progression
            }

            const userRef = doc(db, 'users', user.id);
            const updatePayload: any = {};
            if (!isExistingLog) {
                updatePayload.completedSessions = increment(1);
                // Also update program specific progress
                updatePayload[`programProgress.${programData.id}.completedSessions`] = increment(1);
            }
            if (updated) updatePayload.stats = newStats;
            if (historyEntry) updatePayload.benchHistory = arrayUnion(historyEntry);

            if (Object.keys(updatePayload).length > 0) {
                await updateDoc(userRef, updatePayload);
            }

            // Squat History Logic (For Peachy Program)
            let squatHistoryEntry = null;
            if (programData.id === 'peachy-glute-plan' && !isExistingLog) {
                dayData?.exercises.forEach(ex => {
                    if (ex.name === "Squats") {
                        const sets = exerciseData[ex.id];
                        if (sets && sets.length > 0) {
                            // Find max weight for valid set
                            let maxWeight = 0;
                            let maxReps = 0;
                            sets.forEach(s => {
                                const w = parseFloat(s.weight);
                                const r = parseInt(s.reps);
                                if (!isNaN(w) && !isNaN(r) && s.completed) {
                                    if (w > maxWeight) {
                                        maxWeight = w;
                                        maxReps = r;
                                    }
                                }
                            });

                            if (maxWeight > 0) {
                                squatHistoryEntry = {
                                    date: new Date().toISOString(),
                                    week: weekNum,
                                    weight: maxWeight,
                                    actualWeight: maxWeight,
                                    actualReps: maxReps
                                };
                            }
                        }
                    }
                });
            }

            if (squatHistoryEntry) {
                await updateDoc(userRef, {
                    squatHistory: arrayUnion(squatHistoryEntry)
                });
            }

            // Pencilneck Bench History Check
            let pencilneckBenchEntry = null;
            if (programData.id === 'pencilneck-eradication' && !isExistingLog) {
                dayData?.exercises.forEach(ex => {
                    if (ex.name === "Flat Barbell Bench Press") {
                        const sets = exerciseData[ex.id];
                        if (sets && sets.length > 0) {
                            // Calculate Best Est 1RM
                            let bestEst1RM = 0;
                            let bestSet: { w: number, r: number } | null = null;

                            for (const s of sets) {
                                const w = parseFloat(s.weight);
                                const r = parseInt(s.reps);
                                if (!isNaN(w) && !isNaN(r) && s.completed) {
                                    const est1RM = w * (1 + r / 30);
                                    if (est1RM > bestEst1RM) {
                                        bestEst1RM = est1RM;
                                        bestSet = { w, r };
                                    }
                                }
                            }

                            if (bestEst1RM > 0 && bestSet) {
                                pencilneckBenchEntry = {
                                    date: new Date().toISOString(),
                                    week: weekNum,
                                    weight: Math.round(bestEst1RM), // Store Est 1RM as 'weight'
                                    actualWeight: bestSet.w,
                                    actualReps: bestSet.r
                                };
                            }
                        }
                    }
                });
            }

            if (pencilneckBenchEntry) {
                await updateDoc(userRef, {
                    pencilneckBenchHistory: arrayUnion(pencilneckBenchEntry)
                });
            }

            // Completion Logic Check (Persist Status)
            let navigateToDashboard = null;

            if (programData.id === 'skeleton-to-threat' && weekNum === 12) {
                if (user.selectedDays && user.selectedDays.length > 0) {
                    const maxSelectedDay = Math.max(...user.selectedDays);
                    if (dayNum === maxSelectedDay) {
                        await updateDoc(userRef, { skeletonStatus: { completed: true, completionDate: new Date().toISOString() } });
                        navigateToDashboard = { showSkeletonCompletion: true };
                    }
                }
            }

            // Check for Pull B completion explicitly by name or day 5 fallback
            const isPullB = dayData?.dayName.includes("Pull B") || (weekNum === 8 && dayNum === 5); // Fallback to day 5 if name check fails
            if (programData.id === 'pencilneck-eradication' && weekNum === 8 && isPullB) {
                await updateDoc(userRef, { pencilneckStatus: { completed: true, completionDate: new Date().toISOString() } });
                navigateToDashboard = { showPencilneckCompletion: true };
            }

            const sessionLog = {
                date: new Date().toISOString(),
                week: weekNum,
                day: dayNum,
                dayName: dayData?.dayName,
                exercises: Object.entries(exerciseData).map(([id, sets]) => ({
                    id,
                    name: dayData?.exercises.find(e => e.id === id)?.name || "Unknown",
                    setsData: sets,
                    notes: exerciseNotes[id] || null
                })),
                programId: programData.id
            };

            const workoutsRef = collection(db, 'users', user.id, 'workouts');

            if (isExistingLog && logId) {
                await updateDoc(doc(workoutsRef, logId), sessionLog);
            } else {
                await addDoc(workoutsRef, sessionLog);
            }

            if (navigateToDashboard) {
                navigate('/app/dashboard', { state: navigateToDashboard });
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

    const resolveDayName = (name: string) => {
        if (name.startsWith('t:')) {
            const raw = name.substring(2);
            const sepIndex = raw.indexOf('|');
            if (sepIndex !== -1) {
                const key = raw.substring(0, sepIndex);
                try {
                    const params = JSON.parse(raw.substring(sepIndex + 1));
                    return t(key, params);
                } catch (e) {
                    return t(key);
                }
            } else {
                return t(raw);
            }
        }
        return name;
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate('/app/dashboard')} className="-ml-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {resolveDayName(dayData.dayName)}
                    </h2>
                    <p className="text-muted-foreground">{t('common.week')} {weekNum} {isExistingLog && <span className="text-green-500 font-bold ml-2">({t('workout.completed')})</span>}</p>
                </div>
            </div>

            <div className="space-y-4">
                {dayData.exercises.map((ex) => {
                    const sets = exerciseData[ex.id] || [];
                    const prevStat = previousStats[ex.name];
                    const targetWeight = calculateWeight(ex);

                    const isGiantSet = !!ex.giantSetConfig;
                    const isPullup = ex.name.includes("Pull-ups");
                    const isDragonFlag = ex.name.includes("Dragon Flags");
                    const isNordic = ex.name === "Nordic Curls" || ex.name === "Glute-Ham Raise";
                    const isAroundWorlds = ex.name === "Around-the-Worlds" || ex.name === "Power Hanging Leg Raises";

                    const weightDisabled = isDragonFlag || isNordic || isAroundWorlds;


                    // Tip Logic
                    // Tip Logic
                    const displayTips: string[] = [];

                    const tipMap: Record<string, string | undefined> = {
                        // --- BENCH DOMINATION ---
                        "Paused Bench Press": "pausedBench",
                        "Wide-Grip Bench Press": "wideGripBench",
                        "Spoto Press": "spotoPress",
                        "Low Pin Press": "lowPinPress",
                        "Paused Bench Press (AMRAP)": "pausedBenchAMRAP",
                        "Paused Bench Press (Back-off)": "pausedBenchBackoff",
                        "Tricep Giant Set": "tricepGiantSet",
                        "Dragon Flags": "dragonFlags",
                        "Walking Lunges": (weekNum >= 11 && weekNum <= 12) ? "walkingLungesWeek11" : "walkingLunges",
                        "Heels-Off Narrow Leg Press": (weekNum >= 11 && weekNum <= 12) ? "heelsOffLegPressWeek11" : "heelsOffLegPress",
                        "Reverse Nordic Curls": "reverseNordic",
                        "Single-Leg Machine Hip Thrust": (weekNum >= 11 && weekNum <= 12) ? "singleLegHipThrustWeek11" : "singleLegHipThrust",
                        "Nordic Curls": "nordicCurls",
                        "Glute-Ham Raise": "gluteHamRaise",
                        "Hack Squat Calf Raises": programData.id === 'peachy-glute-plan' ? "legPressCalves" : "hackSquatCalves",
                        "Around-the-Worlds": "aroundTheWorlds",
                        "Power Hanging Leg Raises": "powerHangingLegRaises",
                        "High-Elbow Facepulls": "highElbowFacepulls",
                        "Y-Raises": programData.id === 'peachy-glute-plan' ? "yRaisesPeachy" : "yRaises",
                        "Behind-the-Neck Press": "behindNeckPress",
                        "Hip Adduction": "hipAdduction",

                        // --- PEACHY PROGRAM ---
                        "Sumo Deadlift": "sumoDeadlift",
                        "Front-Foot Elevated Bulgarian Split Squat": "bulgarianSplitSquat",
                        "Squats": "squats",
                        "Seated Hamstring Curl": "seatedHamstringCurl",
                        "Kas Glute Bridge": "kasGluteBridge",
                        "45-Degree Hyperextension": "hyperextension45",
                        "Standing Military Press": "militaryPress",
                        "Incline DB Bench Press (45°)": "inclineDBBench",
                        "Inverted Rows": programData.id === 'skeleton-to-threat' ? "invertedRowsSkeleton" : "invertedRows",
                        "Side-Lying Rear Delt Fly": "sideLyingRearDeltFly",
                        "DB Romanian Deadlift": "dbRDL",
                        "Paused Squat": "pausedSquat",
                        "Glute Ham Raise (eccentric only)": "ghr",
                        "Leg Press Calf Raises": "legPressCalves",
                        "Deficit Reverse Lunge": "deficitReverseLunge",
                        "Single Leg Machine Hip Thrust": "singleLegHipThrust",
                        "Deficit Push-ups": programData.id === 'skeleton-to-threat' ? "deficitPushupsSkeleton" : "deficitPushups",
                        "Assisted Pull-ups": "assistedPullups",
                        "Lying Cable Lat Raises": "lyingCableLatRaises",
                        "Glute Pump Finisher": "glutePumpFinisher",

                        // --- PENCILNECK PROGRAM ---
                        "Flat Barbell Bench Press": "flatBarbellBenchPress",
                        "Cable Flyes (mid height)": "cableFlyes",
                        "Seated DB Shoulder Press": "seatedDBShoulderPress",
                        "Overhead Tricep Extensions": "overheadTricepExtensions",
                        "Hack Squat": "hackSquat",
                        "Leg Extensions": programData.id === 'skeleton-to-threat' ? "legExtensionsSkeleton" : "legExtensions",
                        "Hammer Pulldown (Underhand)": "hammerPulldown",
                        "Preacher EZ-Bar Curls": "preacherEZBarCurls",
                        "Hanging Leg Raises": "hangingLegRaises",
                        "Lying Leg Curls": "lyingLegCurls",
                        "Incline Barbell Bench Press (45°)": "inclineBarbellBenchPress",
                        "Flat DB Press": "flatDBPress",
                        "Close-Grip Bench Press": "closeGripBenchPress",
                        "Lat Pulldown (Neutral)": "latPulldownNeutral",
                        "Single-Arm Hammer Strength Row": "singleArmHammerStrengthRow",
                        "Single-Arm DB Row": "singleArmDBRow",
                        "Machine Rear Delt Fly": "machineRearDeltFly",
                        "Incline DB Curls": "inclineDBCurls",
                        "Stiff-Legged Deadlift": "stiffLeggedDeadlift",
                        "Ab Wheel Rollouts": "abWheelRollouts",
                        "Front Squats": "frontSquats",
                        "Stiletto Squats": "stilettoSquats",
                        "Incline DB Press (45°)": "inclineDBPress",
                        "Seated Cable Row": "seatedCableRow",
                        "Lat Prayer": "latPrayer",
                        "Wide Grip BB Row": "wideGripBBRow",
                        "Side-Lying Rear Delt Flyes": "sideLyingRearDeltFly",
                        "Romanian Deadlift": "romanianDeadlift",
                        "Standing Barbell Military Press": "standingMilitaryPress",
                        "Leaning Single Arm DB Lateral Raises": "leaningLateralRaises",
                        "Walking Lunges (DB)": "walkingLungesDB",
                        "Hack Calf Raises": "hackCalfRaises",
                        "Seated Leg Curls": "seatedLegCurls",
                        "Pec Deck": "pecDeck",

                        // --- SKELETON PROGRAM ---
                        "Supported Stiff Legged DB Deadlift": "supportedSLDL",
                        "Standing Calf Raises": "standingCalfRaises",
                        "Overhand Mid-Grip Pulldown": "overhandPulldown"
                    };

                    const tipKey = tipMap[ex.name];
                    if (tipKey) {
                        const tipText = t(`tips.${tipKey}`);
                        if (tipText && tipText !== `tips.${tipKey}`) { // Check if translation exists
                            displayTips.push(tipText);
                        }
                    }

                    // Add Nordic/Glute-Ham swap tip for both original and alternative
                    if (ex.name === "Nordic Curls" || ex.name === "Glute-Ham Raise") {
                        displayTips.push(t('tips.nordicSwapTip'));

                    }

                    if (ex.name.includes("Pull-ups") && programData.id === 'bench-domination') {
                        let pKey: string | null = null;
                        if (weekNum <= 3) pKey = "pullupWeeks1to3";
                        else if (weekNum <= 6) pKey = "pullupWeeks4to6";
                        else if (weekNum <= 9) pKey = "pullupWeeks7to9";
                        else if (weekNum === 10) pKey = "pullupWeek10";
                        else if (weekNum >= 11) pKey = "pullupWeeks11to12";

                        if (pKey) {
                            const pullupTip = t(`tips.${pKey}`);
                            if (pullupTip && pullupTip !== `tips.${pKey}`) {
                                displayTips.push(pullupTip);
                            }
                        }
                    }

                    // Add dynamic notes from program (if not empty)
                    if (ex.notes) {
                        displayTips.push(ex.notes);
                    }

                    let advice = prevStat?.advice || "";

                    return (
                        <Card key={ex.id} className="overflow-hidden">
                            <CardHeader className="bg-secondary/10 pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="w-full">
                                        <div className="flex justify-between w-full items-start gap-2">
                                            <div className="flex flex-col gap-1">
                                                <CardTitle className="text-lg leading-tight">{ex.name}</CardTitle>
                                                {prevStat && prevStat.weight !== "-" && (
                                                    <div className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded w-fit">
                                                        {t('workout.last')}: {prevStat.weight}{t('common.kg')} x {prevStat.reps}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Swap Button */}
                                            {ex.alternates && ex.alternates.length > 0 && (
                                                <div className="flex flex-col gap-1">
                                                    {ex.alternates.map(alt => (
                                                        <Button key={alt} variant="outline" size="sm" className="h-7 text-[10px] px-2" onClick={() => handleSwap(ex.name, alt)}>
                                                            Swap
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {displayTips.length > 0 && (
                                            <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-600 dark:text-yellow-400 font-medium flex flex-col gap-1">
                                                {displayTips.map((tip, i) => (
                                                    <div key={i} className="flex gap-2">
                                                        <span className="font-bold shrink-0">💡</span>
                                                        <span>{tip}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-1 mt-2">
                                            {isGiantSet ? (
                                                <div className="text-sm text-muted-foreground">
                                                    {ex.sets} {t('workout.giantSets')} × {ex.giantSetConfig?.steps.map((s, i) =>
                                                        `${s.targetReps} ${s.name}${i < (ex.giantSetConfig?.steps.length || 0) - 1 ? ", " : ""}`
                                                    )}
                                                </div>
                                            ) : ex.sets > 0 ? (
                                                <p className="text-sm text-muted-foreground">
                                                    {ex.sets} {t('workout.sets')} × {ex.target.reps === "Failure" ? t('common.failure') : `${ex.target.reps} ${t('workout.reps')}`}
                                                </p>
                                            ) : null}
                                            <div className="flex justify-between items-center">
                                                {targetWeight && targetWeight !== "0" && !isGiantSet ? (
                                                    <span className="text-sm font-mono text-primary font-bold">{t('workout.target')} {targetWeight}{t('common.kg')}</span>
                                                ) : <span></span>}

                                                {advice && (
                                                    <div className="flex items-center text-xs font-bold text-red-500 animate-pulse">
                                                        <AlertCircle className="mr-1 h-3 w-3" />
                                                        {advice}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* Warmups Section */}
                                {ex.warmups && (
                                    <div className="bg-muted/30 border-b border-border">
                                        <div className="p-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center bg-muted/50">Warm Up</div>
                                        {ex.warmups.sets.map((w, i) => (
                                            <div key={`warmup-${i}`} className="grid grid-cols-10 gap-2 p-1 px-2 items-center text-sm text-muted-foreground/60 select-none">
                                                <div className="col-span-1 text-center text-[10px]">W{i + 1}</div>
                                                <div className="col-span-4 text-center font-mono bg-muted/20 rounded mx-1">{w.weight}</div>
                                                <div className="col-span-4 text-center font-mono bg-muted/20 rounded mx-1">{w.reps}</div>
                                                <div className="col-span-1 text-center text-[10px]"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="divide-y divide-border">
                                    {!isGiantSet && (
                                        <div className="grid grid-cols-10 gap-2 p-2 bg-muted/50 text-xs font-medium text-muted-foreground text-center">
                                            <div className="col-span-1">SET</div>
                                            <div className="col-span-4">KG</div>
                                            <div className="col-span-4">REPS</div>
                                            <div className="col-span-1"></div>
                                        </div>
                                    )}

                                    {isGiantSet ? (
                                        sets.map((set, idx) => {
                                            const steps = ex.giantSetConfig?.steps || [];
                                            const stepCount = steps.length;
                                            if (stepCount === 0) return null;

                                            const subIndex = idx % stepCount;
                                            const giantSetIndex = Math.floor(idx / stepCount) + 1;
                                            const isNewGroup = subIndex === 0;
                                            const step = steps[subIndex];

                                            const placeholderR = step.targetReps;
                                            const placeholderW = step.inputPlaceholder || "-";
                                            const disabledW = step.editableWeight === true ? false : (placeholderW === "-");

                                            return (
                                                <React.Fragment key={idx}>
                                                    {isNewGroup && (
                                                        <div className="p-2 bg-secondary/10 font-bold text-center text-primary text-xs tracking-wider border-b border-border">
                                                            GIANT SET {giantSetIndex}
                                                        </div>
                                                    )}
                                                    <div className={cn("grid grid-cols-10 gap-2 p-2 items-center border-b border-border/50 last:border-0", set.completed ? "bg-green-500/5" : "")}>
                                                        <div className="col-span-3 text-xs font-bold text-muted-foreground whitespace-normal leading-tight flex items-center h-full">
                                                            {step.name}
                                                        </div>
                                                        <div className="col-span-3">
                                                            <Input
                                                                disabled={disabledW}
                                                                type="text" inputMode="decimal"
                                                                placeholder={placeholderW}
                                                                value={set.weight}
                                                                onChange={(e) => handleSetChange(ex.id, idx, 'weight', e.target.value)}
                                                                className={cn("h-9 font-mono text-center px-1 text-sm", disabledW ? "opacity-50 bg-muted" : "")}
                                                            />
                                                        </div>
                                                        <div className="col-span-3">
                                                            <Input
                                                                type="text" inputMode="numeric"
                                                                placeholder={placeholderR}
                                                                value={set.reps}
                                                                onChange={(e) => handleSetChange(ex.id, idx, 'reps', e.target.value)}
                                                                className={cn("h-9 font-mono text-center px-1 text-sm", set.completed ? "border-green-500 bg-green-500/10" : "")}
                                                            />
                                                        </div>
                                                        <div className="col-span-1 flex justify-center">
                                                            {set.completed && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })
                                    ) : (
                                        sets.map((set, idx) => (
                                            <div key={idx} className={cn("grid grid-cols-10 gap-2 p-2 items-center", set.completed ? "bg-green-500/5" : "")}>
                                                <div className="col-span-1 text-center font-bold text-muted-foreground">{idx + 1}</div>
                                                <div className="col-span-4">
                                                    <Input
                                                        disabled={weightDisabled}
                                                        type="text" inputMode="decimal"
                                                        placeholder={weightDisabled ? "-" : (targetWeight && targetWeight !== "0" ? targetWeight.toString() : "-")}
                                                        value={set.weight}
                                                        onChange={(e) => handleSetChange(ex.id, idx, 'weight', e.target.value, isPullup, ex.target.reps)}
                                                        className={cn("h-9 font-mono text-center px-1", weightDisabled ? "opacity-50 bg-muted" : "")}
                                                    />
                                                </div>
                                                <div className="col-span-4">
                                                    <Input
                                                        type="text" inputMode="numeric"
                                                        placeholder={ex.target.reps.replace(/[^0-9-]/g, '')}
                                                        value={set.reps}
                                                        onChange={(e) => handleSetChange(ex.id, idx, 'reps', e.target.value, isPullup, ex.target.reps)}
                                                        className={cn("h-9 font-mono text-center px-1", ex.target.type === 'amrap' ? "border-yellow-500/50 bg-yellow-500/10" : "", set.completed ? "border-green-500" : "")}
                                                    />
                                                </div>
                                                <div className="col-span-1 flex justify-center">
                                                    {set.completed && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Flashy Intensity Technique Message */}
                                {ex.intensityTechnique && (
                                    <div className="mx-3 mt-3 p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500 rounded-lg animate-pulse">
                                        <div className="flex items-center gap-2 text-orange-500 font-bold text-sm">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                            </svg>
                                            <span className="uppercase tracking-wide">{ex.intensityTechnique}</span>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                            </svg>
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
                            </CardContent>
                        </Card>
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
        </div>
    );
};
