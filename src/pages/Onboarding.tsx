
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import type { LiftingStats, UserProfile } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { BENCH_DOMINATION_PROGRAM } from '../data/program';
import { SKELETON_PROGRAM } from '../data/skeleton';
import { PENCILNECK_PROGRAM } from '../data/pencilneck';
import { PEACHY_CONFIG } from '../data/peachy';
import { PAIN_GLORY_CONFIG } from '../data/painglory';
import { TRINARY_CONFIG } from '../data/trinary';
import { RITUAL_CONFIG } from '../data/ritual';
import { SUPER_MUTANT_PROGRAM } from '../data/supermutant';
import { ADVENTURE_PLAN_ID } from '../data/adventure';
import { ORDERED_PLAN_META } from '../data/planMeta';
import { PlanFinder } from '../features/portfolio/PlanFinder';
import { getPlan } from '../data/plans';
import { benchmarkLiftsFor } from '../data/benchmarkLifts';
import { cn } from '../lib/utils';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { epley } from '../features/workout/progression/types';
import { CORE_RAISE_OPTIONS, KALI_PULL_ANCHORS, KALI_WEEK8, needsPlanSelections } from '../features/planSelections/options';

type Step = 'program' | 'days' | 'preferences' | 'stats' | 'bench-modules' | 'super-mutant-stats' | 'benchmark' | 'schedule' | 'plan-selections';

export const Onboarding: React.FC = () => {
    const { state } = useLocation();
    const { registerUser, user, switchProgram, updateUserProfile } = useUser();
    const { t, tObject, tArray } = useLanguage();
    const navigate = useNavigate();
    const codeword = state?.codeword;
    const allowedPlanIds: string[] | undefined = state?.allowedPlanIds || user?.allowedPlanIds;
    const isPlanAllowed = (id: string) => !allowedPlanIds || allowedPlanIds.includes(id);

    const [step, setStep] = useState<Step>('program');
    // Opt-in helper over the catalogue; the grid remains the default surface.
    const [showFinder, setShowFinder] = useState(false);
    const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    /** 'rolling' = an irregular template (2 on / 1 off) chosen on the schedule step. */
    const [scheduleMode, setScheduleMode] = useState<'fixed' | 'rolling'>('fixed');
    /** Which irregular template was picked when scheduleMode is 'rolling'. */
    const [selectedTemplate, setSelectedTemplate] = useState<string>('2on-1off');
    const [preferences, setPreferences] = useState<Record<string, string>>({
        "push-a-leg-primary": "Hack Squat",
        "push-b-fly": "Pec Deck",
        "push-b-leg-secondary": "Front Squats"
    });

    const [benchModules, setBenchModules] = useState<{
        tricepGiantSet: boolean;
        behindNeckPress: boolean;
        weightedPullups: boolean;
        accessories: boolean;
        legDays: boolean;
    }>({
        tricepGiantSet: true,
        behindNeckPress: true,
        weightedPullups: true,
        accessories: true,
        legDays: true
    });

    const [trinaryMeRepMaxStyle, setTrinaryMeRepMaxStyle] = useState<'1rm' | '3rm'>('3rm');
    const [kaliPull, setKaliPull] = useState('assisted-pull-up');
    const [kaliWeek8, setKaliWeek8] = useState('none');
    const [coreRaise, setCoreRaise] = useState('hanging-leg-raise');

    const [stats, setStats] = useState<LiftingStats>({
        pausedBench: 0,
        wideGripBench: 0,
        spotoPress: 0,
        lowPinPress: 0,
        btnPress: 0
    });

    /** Stats the athlete marked "I don't know" on the benchmark step. */
    const [unknownStats, setUnknownStats] = useState<Set<keyof LiftingStats>>(new Set());
    /** Suggested maxes for the benchmark step — profile first, log-derived e1RM next. */
    const [benchmarkSuggestions, setBenchmarkSuggestions] = useState<Partial<Record<keyof LiftingStats, { kg: number; source: 'profile' | 'history' }>>>({});

    const [ritualIsFirstProgram, setRitualIsFirstProgram] = useState<boolean | null>(null);
    const [superMutantPrefs, setSuperMutantPrefs] = useState<{
        quadExercise: 'Hack Squat' | 'Front Squat' | 'Safety Bar Squat';
        hamstringExercise: 'Good Mornings' | 'Deficit RDLs';
    }>({
        quadExercise: 'Hack Squat',
        hamstringExercise: 'Good Mornings'
    });

    // ... (rest of code)



    useEffect(() => {
        if (!codeword && !user) {
            navigate('/');
        }
    }, [codeword, user, navigate]);

    const handleAdventureSubmit = async () => {
        const zeroStats: LiftingStats = { pausedBench: 0, wideGripBench: 0, spotoPress: 0, lowPinPress: 0 };
        try {
            if (user) await switchProgram(ADVENTURE_PLAN_ID);
            else await registerUser(codeword, zeroStats, ADVENTURE_PLAN_ID, [], {});
            navigate('/app/dashboard');
        } catch (err: unknown) {
            console.error('Adventure registration failed', err);
            alert(t('adventure.errors.registration'));
        }
    };

    const handleProgramSelect = (pid: string) => {
        if (!isPlanAllowed(pid)) return;
        setSelectedProgramId(pid);
        if (pid === ADVENTURE_PLAN_ID) {
            void handleAdventureSubmit();
        } else if (pid === PENCILNECK_PROGRAM.id || pid === SKELETON_PROGRAM.id) {
            setStep('days');
        } else if (pid === BENCH_DOMINATION_PROGRAM.id) {
            setStep('bench-modules');
        } else if (pid === PEACHY_CONFIG.id) {
            setStep('days');
        } else if (pid === PAIN_GLORY_CONFIG.id) {
            setStep('days');
        } else if (pid === TRINARY_CONFIG.id || pid === RITUAL_CONFIG.id) {
            // Trinary and Ritual go directly to stats - no schedule selection
            setStep('stats');
        } else if (pid === SUPER_MUTANT_PROGRAM.id) {
            // Super Mutant goes to its own stats step
            setStep('super-mutant-stats');
        } else {
            // Every remaining plan is declarative. It gets the generic benchmark
            // step, which asks for exactly the maxes its progressions read —
            // possibly none, in which case the step is a plain confirmation.
            // Previously this fell through to the Bench Domination stats form,
            // which enrolled the athlete in Bench Domination regardless of pick.
            setUnknownStats(new Set());
            // Declarative plans offer weekday selection (with suggested splits
            // and irregular templates) before any benchmark questions.
            if (getPlan(pid).schedule?.selectable) {
                setSelectedDays([]);
                setScheduleMode('fixed');
                setStep('schedule');
                return;
            }
            if (needsPlanSelections(pid)) {
                setStep('plan-selections');
                return;
            }
            // Plans whose progressions read no maxes have nothing to ask for.
            // Showing an empty form with one button reads like a broken step,
            // so enrol straight away instead.
            const planOnboarding = getPlan(pid).onboarding;
            if (!benchmarkLiftsFor([...(planOnboarding?.requiredStats ?? []), ...(planOnboarding?.seedStats ?? [])]).length) {
                void enrolWithoutBenchmarks(pid);
                return;
            }
            setStep('benchmark');
        }
    };

    // Prefill benchmark maxes for a returning athlete: known stats come from
    // the profile, and anything missing is estimated (Epley, best set) from
    // logged sessions of the lifts this plan calibrates on.
    useEffect(() => {
        if (step !== 'benchmark' || !user || !selectedProgramId) return;
        const plan = getPlan(selectedProgramId);
        const onboarding = plan.onboarding;
        const lifts = benchmarkLiftsFor([...(onboarding?.requiredStats ?? []), ...(onboarding?.seedStats ?? [])]);
        if (!lifts.length) return;

        const suggestions: Partial<Record<keyof LiftingStats, { kg: number; source: 'profile' | 'history' }>> = {};
        const missing: (keyof LiftingStats)[] = [];
        for (const { stat } of lifts) {
            const known = (user.stats as Record<string, number | undefined>)?.[stat] ?? 0;
            if (known > 0) suggestions[stat] = { kg: known, source: 'profile' };
            else missing.push(stat);
        }
        setBenchmarkSuggestions(suggestions);
        setStats(prev => ({
            ...prev,
            ...Object.fromEntries(Object.entries(suggestions).map(([stat, s]) => [stat, s!.kg])),
        }));

        if (!missing.length) return;
        const nameToStat = plan.calibration?.exerciseNameToStat ?? {};
        const wanted = new Set(missing);
        const nameForStat = new Map<string, keyof LiftingStats>();
        for (const [name, stat] of Object.entries(nameToStat)) {
            if (wanted.has(stat)) nameForStat.set(name, stat);
        }
        if (!nameForStat.size) return;

        let cancelled = false;
        void (async () => {
            try {
                const snapshot = await getDocs(collection(db, 'users', user.id, 'workouts'));
                const best: Partial<Record<keyof LiftingStats, number>> = {};
                for (const docSnap of snapshot.docs) {
                    const data = docSnap.data();
                    for (const ex of data.exercises ?? []) {
                        const stat = nameForStat.get(ex.name);
                        if (!stat) continue;
                        for (const set of ex.setsData ?? []) {
                            if (!set.completed) continue;
                            const w = parseFloat(set.weight || '0');
                            const r = parseInt(set.reps || '0', 10);
                            if (w > 0 && r > 0) {
                                const est = epley(w, r);
                                if (est > (best[stat] ?? 0)) best[stat] = est;
                            }
                        }
                    }
                }
                if (cancelled) return;
                const round = (n: number) => Math.round(n / 2.5) * 2.5;
                setBenchmarkSuggestions(prev => {
                    const next = { ...prev };
                    for (const [stat, kg] of Object.entries(best) as [keyof LiftingStats, number][]) {
                        if (!next[stat] && kg > 0) next[stat] = { kg: round(kg), source: 'history' };
                    }
                    return next;
                });
            } catch {
                // Suggestions are a convenience; the plain form still works.
            }
        })();
        return () => { cancelled = true; };
    }, [step, selectedProgramId, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDayToggle = (dayIndex: number) => {
        // Target count depends on program
        const targetCount = selectedProgramId === SKELETON_PROGRAM.id ? 3 : 4;

        setSelectedDays(prev => {
            if (prev.includes(dayIndex)) {
                return prev.filter(d => d !== dayIndex);
            } else {
                if (prev.length >= targetCount) return prev;
                return [...prev, dayIndex].sort();
            }
        });
    };

    const handlePrefChange = (key: string, value: string) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Handle mobile keyboards sending comma (e.g. "100,5")
        const sanitizedValue = value.replace(',', '.');
        const numValue = parseFloat(sanitizedValue);

        setStats(prev => ({
            ...prev,
            [name]: isNaN(numValue) ? 0 : numValue
        }));
    };

    const handlePencilneckSubmit = async () => {
        if (user) {
            // Switch Mode
            await updateUserProfile({
                exercisePreferences: preferences,
                selectedDays: selectedDays
            });
            await switchProgram(PENCILNECK_PROGRAM.id);
        } else {
            // New User Mode
            const zeroStats: LiftingStats = {
                pausedBench: 0,
                wideGripBench: 0,
                spotoPress: 0,
                lowPinPress: 0
            };
            await registerUser(codeword, zeroStats, PENCILNECK_PROGRAM.id, selectedDays, preferences);
        }
        navigate('/app/dashboard');
    };

    const handleSkeletonSubmit = async () => {
        // Skeleton needs 3 days
        if (selectedDays.length !== 3) {
            alert("Please select exactly 3 training days.");
            return;
        }

        if (user) {
            // Switch Mode
            await updateUserProfile({
                selectedDays: selectedDays
            });
            await switchProgram(SKELETON_PROGRAM.id);
        } else {
            // New User Mode
            const zeroStats: LiftingStats = {
                pausedBench: 0,
                wideGripBench: 0,
                spotoPress: 0,
                lowPinPress: 0
            };
            await registerUser(codeword, zeroStats, SKELETON_PROGRAM.id, selectedDays, {});
        }
        navigate('/app/dashboard');
    };

    const handlePeachySubmit = async () => {
        if (selectedDays.length !== 4) {
            alert("Please select exactly 4 training days.");
            return;
        }

        if (user) {
            await updateUserProfile({ selectedDays });
            await switchProgram(PEACHY_CONFIG.id);
        } else {
            const zeroStats: LiftingStats = { pausedBench: 0, wideGripBench: 0, spotoPress: 0, lowPinPress: 0 };
            await registerUser(codeword, zeroStats, PEACHY_CONFIG.id, selectedDays, {});
        }
        navigate('/app/dashboard');
    };

    const handlePainGlorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const deadlift1RM = (stats as any).conventionalDeadlift || 0;
        const squat1RM = (stats as any).lowBarSquat || 0;

        if (deadlift1RM <= 0 || squat1RM <= 0) {
            alert("Please enter valid 1RM values for both lifts.");
            return;
        }

        const painGloryStats = {
            ...stats,
            conventionalDeadlift: deadlift1RM,
            lowBarSquat: squat1RM
        };

        const initialDeficitWeight = Math.floor((deadlift1RM * 0.45) / 2.5) * 2.5;

        try {
            if (user) {
                await updateUserProfile({
                    stats: painGloryStats,
                    selectedDays: selectedDays.length === 4 ? selectedDays : [1, 2, 4, 5],
                    painGloryStatus: {
                        deficitSnatchGripWeight: initialDeficitWeight,
                        squatProgress: 0
                    }
                });
                await switchProgram(PAIN_GLORY_CONFIG.id);
            } else {
                if (!codeword) throw new Error("No codeword found. Please restart.");
                await registerUser(
                    codeword,
                    painGloryStats,
                    PAIN_GLORY_CONFIG.id,
                    selectedDays.length === 4 ? selectedDays : [1, 2, 4, 5],
                    {},
                    undefined,
                    {
                        painGloryStatus: {
                            deficitSnatchGripWeight: initialDeficitWeight,
                            squatProgress: 0
                        }
                    }
                );
            }
            navigate('/app/dashboard');
        } catch (err: any) {
            console.error("Registration failed:", err);
            const message = err?.code === 'keyword-claimed'
                ? t('entry.keywordClaimed')
                : "Failed to build program: " + (err.message || "Unknown error");
            alert(message);
        }
    };

    const handleTrinarySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const bench1RM = (stats as any).trinaryBench || 0;
        const deadlift1RM = (stats as any).trinaryDeadlift || 0;
        const squat1RM = (stats as any).trinarySquat || 0;

        if (bench1RM <= 0 || deadlift1RM <= 0 || squat1RM <= 0) {
            alert("Please enter valid 1RM values for all three lifts.");
            return;
        }

        const trinaryStats = {
            ...stats,
            trinaryBench1RM: bench1RM,
            trinaryDeadlift1RM: deadlift1RM,
            trinarySquat1RM: squat1RM
        };

        const initialTrinaryStatus = {
            completedWorkouts: 0,
            currentBlock: 1,
            bench1RM: bench1RM,
            deadlift1RM: deadlift1RM,
            squat1RM: squat1RM,
            workoutLog: [],
            cycleNumber: 1,
            isDeload: false,
            meRepMaxStyle: trinaryMeRepMaxStyle
        };

        try {
            if (user) {
                await updateUserProfile({
                    stats: trinaryStats,
                    trinaryStatus: initialTrinaryStatus
                });
                await switchProgram(TRINARY_CONFIG.id);
            } else {
                if (!codeword) throw new Error("No codeword found. Please restart.");
                // Register new user and then update trinaryStatus
                await registerUser(codeword, trinaryStats, TRINARY_CONFIG.id, [], {});
                // Set trinaryStatus after registration
                const userRef = doc(db, 'users', codeword.toLowerCase());
                await updateDoc(userRef, {
                    trinaryStatus: initialTrinaryStatus
                });
            }
            navigate('/app/dashboard');
        } catch (err: any) {
            console.error("Registration failed:", err);
            alert("Failed to build program: " + (err.message || "Unknown error"));
        }
    };

    const handleBenchDominationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (stats.pausedBench <= 0) {
            alert("Please enter a valid Paused Bench 1RM greater than 0.");
            return;
        }

        const finalStats = {
            pausedBench: stats.pausedBench,
            wideGripBench: stats.wideGripBench > 0 ? stats.wideGripBench : Math.floor((stats.pausedBench * 0.92) / 2.5) * 2.5,
            spotoPress: stats.spotoPress > 0 ? stats.spotoPress : Math.floor((stats.pausedBench * 0.95) / 2.5) * 2.5,
            lowPinPress: stats.lowPinPress > 0 ? stats.lowPinPress : Math.floor((stats.pausedBench * 0.88) / 2.5) * 2.5,
        };

        try {
            if (user) {
                // Switch Mode
                await updateUserProfile({
                    stats: finalStats,
                    benchDominationModules: benchModules
                });
                await switchProgram(BENCH_DOMINATION_PROGRAM.id);
            } else {
                // New User Mode
                if (!codeword) throw new Error("No codeword found. Please restart.");
                // @ts-ignore
                await registerUser(codeword, finalStats, BENCH_DOMINATION_PROGRAM.id, [], {}, benchModules);
            }
            navigate('/app/dashboard');
        } catch (err: any) {
            console.error("Registration failed:", err);
            alert("Failed to build program: " + (err.message || "Unknown error"));
        }
    };

    /**
     * Enrols in whichever plan the athlete actually picked.
     *
     * Stats left blank or explicitly marked unknown are recorded on
     * `pendingCalibration` so the first prescribed exposure of that lift runs as
     * a calibration set rather than resolving its percentage against nothing.
     */
    /**
     * Enrols in a plan that asks for no maxes at all.
     *
     * Its loads come from double progression against the athlete's own logged
     * sets, so there is nothing to collect and nothing to calibrate.
     */
    const selectionProfile = (planId: string): Partial<UserProfile> => {
        const now = new Date().toISOString();
        const planPreferences = { ...(user?.planPreferences ?? {}) };
        const trainingPreferences = { ...(user?.trainingPreferences ?? {}) };
        if (planId === 'kali') {
            planPreferences.kali = {
                scheduleMode: '4day',
                updatedAt: now,
                exerciseSelections: { pullAnchor: kaliPull, ...(kaliWeek8 !== 'none' ? { week8Intensifier: kaliWeek8 } : {}) },
            };
        }
        if (planId === 'gravity-is-optional') {
            planPreferences['gravity-is-optional'] = {
                scheduleMode: '4day',
                updatedAt: now,
                exerciseSelections: { abs: coreRaise },
            };
            trainingPreferences.coreRaiseId = coreRaise;
        }
        return { planPreferences, trainingPreferences };
    };

    const enrolWithoutBenchmarks = async (planId: string) => {
        const blankStats: LiftingStats = { pausedBench: 0, wideGripBench: 0, spotoPress: 0, lowPinPress: 0 };
        try {
            if (user) {
                await updateUserProfile({
                    stats: user.stats ?? blankStats,
                    pendingCalibration: [],
                    selectedDays: scheduleMode === 'fixed' ? selectedDays : [],
                    scheduleMode,
                    ...selectionProfile(planId),
                });
                await switchProgram(planId);
            } else {
                if (!codeword) throw new Error('No codeword found. Please restart.');
                await registerUser(codeword, blankStats, planId, scheduleMode === 'fixed' ? selectedDays : [], {}, undefined, { pendingCalibration: [], scheduleMode, ...selectionProfile(planId) });
            }
            navigate('/app/dashboard');
        } catch (err: unknown) {
            console.error('Registration failed:', err);
            alert('Failed to build program: ' + ((err as Error)?.message || 'Unknown error'));
        }
    };

    const handleBenchmarkSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProgramId) return;

        const onboarding = getPlan(selectedProgramId).onboarding;
        const lifts = benchmarkLiftsFor([...(onboarding?.requiredStats ?? []), ...(onboarding?.seedStats ?? [])]);

        const entered: Partial<LiftingStats> = {};
        const pendingCalibration: (keyof LiftingStats)[] = [];
        for (const { stat } of lifts) {
            const value = (stats as Record<string, number | undefined>)[stat] ?? 0;
            if (unknownStats.has(stat) || !value || value <= 0) pendingCalibration.push(stat);
            else entered[stat] = value;
        }

        if (onboarding?.requireBodyweight) {
            const kg = stats.bodyweightKg ?? 0;
            if (!kg || kg <= 0) {
                alert(t('onboarding.benchmark.bodyweightRequired') || 'Bodyweight is required for this plan.');
                return;
            }
            entered.bodyweightKg = kg;
        }

        // The bench-family keys are non-optional on LiftingStats; anything this
        // plan doesn't use stays 0 and is simply never read.
        const finalStats: LiftingStats = {
            pausedBench: 0, wideGripBench: 0, spotoPress: 0, lowPinPress: 0,
            ...entered,
        };

        try {
            if (user) {
                await updateUserProfile({
                    stats: finalStats,
                    pendingCalibration,
                    selectedDays: scheduleMode === 'fixed' ? selectedDays : [],
                    scheduleMode,
                    ...selectionProfile(selectedProgramId),
                });
                await switchProgram(selectedProgramId);
            } else {
                if (!codeword) throw new Error("No codeword found. Please restart.");
                await registerUser(codeword, finalStats, selectedProgramId, scheduleMode === 'fixed' ? selectedDays : [], {}, undefined, { pendingCalibration, scheduleMode, ...selectionProfile(selectedProgramId) });
            }
            navigate('/app/dashboard');
        } catch (err: any) {
            console.error("Registration failed:", err);
            alert("Failed to build program: " + (err.message || "Unknown error"));
        }
    };

    // Render Steps

    if (step === 'program') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-5xl space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">{t('onboarding.selectProtocol')}</h1>
                        <p className="text-muted-foreground">{t('onboarding.choosePath')}</p>
                        {/* Optional, and never in the way: the catalogue below
                            stays the primary surface. */}
                        {!showFinder && (
                            <button className="plan-finder-open" onClick={() => setShowFinder(true)}>
                                {t('onboarding.helpMeChoose')}
                            </button>
                        )}
                    </div>

                    {showFinder && (
                        <PlanFinder
                            availablePlanIds={ORDERED_PLAN_META.filter(meta => isPlanAllowed(meta.id)).map(meta => meta.id)}
                            planName={planId => {
                                const meta = ORDERED_PLAN_META.find(item => item.id === planId);
                                const copy = meta ? tObject(`onboarding.programs.${meta.i18nKey}`) : undefined;
                                return (copy as { name?: string })?.name ?? planId;
                            }}
                            onPick={handleProgramSelect}
                            onDismiss={() => setShowFinder(false)}
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {ORDERED_PLAN_META.filter(meta => isPlanAllowed(meta.id)).map(meta => {
                            const copy = tObject(`onboarding.programs.${meta.i18nKey}`);
                            const plan = getPlan(meta.id);
                            const weeks = plan.program.weeks.length;
                            const daysPerWeek = plan.program.weeks[0]?.days.filter(d => d.exercises.length > 0).length ?? 0;
                            return (
                                <Card
                                    key={meta.id}
                                    className="overflow-hidden cursor-pointer hover:border-primary transition-all hover:scale-[1.02] group"
                                    onClick={() => handleProgramSelect(meta.id)}
                                >
                                    {/* Artwork panel: the cover carries the plan's identity, so it
                                        stays fully visible; title and copy live below it. */}
                                    <div className={cn("relative h-56 flex items-center justify-center p-5", meta.coverBg)}>
                                        <img src={meta.logo} alt={copy.name ?? ''} className="max-h-full w-auto object-contain opacity-95 group-hover:opacity-100 group-hover:scale-[1.03] transition-all" />
                                        {meta.alwaysFree && <span className="absolute right-3 top-3 bg-[#b7ff35] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0a1110]">{t('adventure.free')}</span>}
                                        <div className="absolute left-3 bottom-3 flex gap-1.5">
                                            <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/90">{weeks} {t('onboarding.programCard.weeks')}</span>
                                            {daysPerWeek > 0 && <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/90">{daysPerWeek} {t('onboarding.programCard.daysPerWeek')}</span>}
                                        </div>
                                    </div>
                                    <CardContent className="pt-4 p-4">
                                        <h3 className="text-lg font-semibold leading-tight mb-1.5">{copy.name}</h3>
                                        <p className="text-muted-foreground text-xs mb-3">{copy.description}</p>
                                        <ul className="space-y-1 text-xs">
                                            {tArray(`onboarding.programs.${meta.i18nKey}.features`).map((feature, i) => (
                                                <li key={i} className="flex items-center"><CheckCircle2 className="mr-2 h-3 w-3 text-primary shrink-0" /> {feature}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <Button variant="ghost" onClick={() => navigate('/')} className="mx-auto block">
                        {t('common.cancel')}
                    </Button>
                </div>
            </div>
        );
    }

    if (step === 'bench-modules') {
        const ModuleToggle = ({
            title,
            desc,
            isOn,
            onToggle,
            mandatory = false,
            recommended = false
        }: { title: string, desc: string, isOn: boolean, onToggle: () => void, mandatory?: boolean, recommended?: boolean }) => (
            <div className={`flex items-start justify-between p-4 border rounded-none ${isOn ? 'bg-primary/5 border-primary/20' : 'bg-background hover:bg-muted/50'} cursor-pointer`} onClick={!mandatory ? onToggle : undefined}>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{title}</h4>
                        {mandatory && <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-bold">REQUIRED</span>}
                        {recommended && !mandatory && <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-bold">RECOMMENDED</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${isOn ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isOn ? 'left-5' : 'left-1'}`}></div>
                </div>
            </div>
        );

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('program')} className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle>{t('onboarding.modules.title')}</CardTitle>
                        </div>
                        <CardDescription>{t('onboarding.modules.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <ModuleToggle
                                title={tObject('onboarding.modules.coreBench').title}
                                desc={tObject('onboarding.modules.coreBench').description}
                                isOn={true}
                                onToggle={() => { }}
                                mandatory
                            />

                            <ModuleToggle
                                title={tObject('onboarding.modules.tricepGiantSets').title}
                                desc={tObject('onboarding.modules.tricepGiantSets').description}
                                isOn={benchModules.tricepGiantSet}
                                onToggle={() => setBenchModules(p => ({ ...p, tricepGiantSet: !p.tricepGiantSet }))}
                                recommended
                            />

                            <ModuleToggle
                                title={tObject('onboarding.modules.behindNeckPress').title}
                                desc={tObject('onboarding.modules.behindNeckPress').description}
                                isOn={benchModules.behindNeckPress}
                                onToggle={() => setBenchModules(p => ({ ...p, behindNeckPress: !p.behindNeckPress }))}
                            />

                            <ModuleToggle
                                title={tObject('onboarding.modules.weightedPullups').title}
                                desc={tObject('onboarding.modules.weightedPullups').description}
                                isOn={benchModules.weightedPullups}
                                onToggle={() => setBenchModules(p => ({ ...p, weightedPullups: !p.weightedPullups }))}
                            />

                            <ModuleToggle
                                title={tObject('onboarding.modules.legDays').title}
                                desc={tObject('onboarding.modules.legDays').description}
                                isOn={benchModules.legDays}
                                onToggle={() => {
                                    setBenchModules(p => ({ ...p, legDays: !p.legDays }));
                                    if (!benchModules.legDays) {
                                        setSelectedDays([]);
                                    } else {
                                        setSelectedDays([1, 3, 4, 6]);
                                    }
                                }}
                            />
                            {!benchModules.legDays && (
                                <div className="p-4 bg-secondary/10 border border-primary/20 rounded-none space-y-4 animate-in fade-in slide-in-">
                                    <div className="flex items-center gap-2 text-primary font-semibold">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{t('onboarding.modules.selectDays')}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Select optimal days for the 4 core bench sessions. We recommend giving yourself a rest day after the heavy Monday session if possible, but the default suggestion (M/W/Th/Sat) works well.</p>

                                    <div className="grid grid-cols-7 gap-1">
                                        {['M', 'T', 'W', 'Th', 'F', 'S', 'Su'].map((d, i) => {
                                            const dayNum = i + 1;
                                            const isSelected = selectedDays.includes(dayNum);
                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        const targetCount = 4;
                                                        setSelectedDays(prev => {
                                                            if (prev.includes(dayNum)) return prev.filter(x => x !== dayNum);
                                                            if (prev.length >= targetCount) return prev;
                                                            return [...prev, dayNum].sort();
                                                        });
                                                    }}
                                                    className={`aspect-square flex items-center justify-center rounded cursor-pointer text-sm font-bold border transition-colors ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                                                >
                                                    {d}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <p className="text-[10px] text-right text-muted-foreground">{selectedDays.length} / 4 selected</p>
                                </div>
                            )}

                            <ModuleToggle
                                title="Accessories"
                                desc="Dragon Flags, Y-Raises, Around-the-Worlds."
                                isOn={benchModules.accessories}
                                onToggle={() => setBenchModules(p => ({ ...p, accessories: !p.accessories }))}
                            />
                        </div>

                        <div className="bg-muted p-3 rounded-none text-xs italic text-muted-foreground text-center">
                            “The bench press and its variations are sacred and cannot be removed. Everything else is optional. Most mortals keep triceps + pull-ups.”
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={() => setStep('stats')}
                        >
                            Next: Calibration
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'days') {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const isSkeleton = selectedProgramId === SKELETON_PROGRAM.id;
        const isPainGlory = selectedProgramId === PAIN_GLORY_CONFIG.id;
        const targetCount = isSkeleton ? 3 : 4;

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('program')} className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle>Training Schedule</CardTitle>
                        </div>
                        <CardDescription>Select exactly {targetCount} training days per week.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-4 text-sm text-yellow-600 dark:text-yellow-400">
                            {isSkeleton ? (
                                <strong>Best results: at least 1 rest day between training days (e.g., Mon-Wed-Fri or Tue-Thu-Sat)</strong>
                            ) : selectedProgramId === PEACHY_CONFIG.id ? (
                                <strong>High Frequency: Select any 4 days. Suggestion: Mon/Wed/Fri/Sat with rest between Days 1-2 and 2-3.</strong>
                            ) : isPainGlory ? (
                                <strong>Classic 4-Day Split: Best results with a rest day in the middle (e.g., Mon-Tue-Thu-Fri).</strong>
                            ) : (
                                <strong>Best recovery: at least 1 rest day between Push B and the next Pull A (e.g., Mon-Tue-Thu-Fri)</strong>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {days.map((day, index) => (
                                <div key={day} className="flex items-center space-x-3 border rounded p-3 hover:bg-accent cursor-pointer" onClick={() => handleDayToggle(index + 1)}>
                                    <Checkbox
                                        id={day}
                                        checked={selectedDays.includes(index + 1)}
                                    />
                                    <label htmlFor={day} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                        {day}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <Button
                            className="w-full"
                            disabled={selectedDays.length !== targetCount}
                            onClick={() => {
                                if (isSkeleton) {
                                    handleSkeletonSubmit();
                                } else if (selectedProgramId === PEACHY_CONFIG.id) {
                                    handlePeachySubmit();
                                } else if (isPainGlory) {
                                    setStep('stats');
                                } else {
                                    setStep('preferences');
                                }
                            }}
                        >
                            {isSkeleton || selectedProgramId === PEACHY_CONFIG.id ? t('onboarding.buildProgram') : t('onboarding.nextExerciseSelection')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'preferences') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('days')} className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle>{t('onboarding.preferences.title')}</CardTitle>
                        </div>
                        <CardDescription>{t('onboarding.preferences.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Leg Primary */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Push A: Leg Primary</Label>
                            <RadioGroup value={preferences["push-a-leg-primary"]} onValueChange={(v) => handlePrefChange("push-a-leg-primary", v)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Hack Squat" id="hack" />
                                    <Label htmlFor="hack">Hack Squat</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="High-Foot Leg Press" id="high-leg" />
                                    <Label htmlFor="high-leg">High-Foot Leg Press</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="border-t my-4"></div>

                        {/* Chest Fly */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Push B: Chest Isolation</Label>
                            <RadioGroup value={preferences["push-b-fly"]} onValueChange={(v) => handlePrefChange("push-b-fly", v)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Pec Deck" id="pecdec" />
                                    <Label htmlFor="pecdec">Pec Deck</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Low-Cable Flyes" id="lowhigh" />
                                    <Label htmlFor="lowhigh">Low-Cable Flyes</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="border-t my-4"></div>

                        {/* Leg Secondary */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Push B: Leg Secondary</Label>
                            <RadioGroup value={preferences["push-b-leg-secondary"]} onValueChange={(v) => handlePrefChange("push-b-leg-secondary", v)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Front Squats" id="front" />
                                    <Label htmlFor="front">Front Squats</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Safety Bar Squat" id="safety-bar" />
                                    <Label htmlFor="safety-bar">Safety Bar Squat</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Narrow-Stance Leg Press" id="narrow" />
                                    <Label htmlFor="narrow">Narrow-Stance Leg Press</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Stiletto Squats" id="stiletto" />
                                    <Label htmlFor="stiletto">Stiletto Squats</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <Button
                            className="w-full mt-6"
                            size="lg"
                            onClick={handlePencilneckSubmit}
                        >
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            FINALIZE PROTOCOL
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Default Stats Step - now conditional for Pain & Glory vs Bench Domination
    if (selectedProgramId === PAIN_GLORY_CONFIG.id) {
        return (
            <div className="min-h-screen bg-card flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg border-red-900/30  bg-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('program')} className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle className="text-2xl text-amber-100">{t('onboarding.painGlory.calibrationTitle')}</CardTitle>
                        </div>
                        <CardDescription className="text-amber-200/70">
                            {t('onboarding.painGlory.calibrationDesc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePainGlorySubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="conventionalDeadlift" className="text-base text-amber-100">{t('onboarding.painGlory.deadliftLabel')}</Label>
                                    <Input
                                        id="conventionalDeadlift"
                                        name="conventionalDeadlift"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 180"
                                        className="text-lg bg-amber-950/20 border-amber-900/30"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-amber-200/50">{t('onboarding.painGlory.deadliftHint')}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lowBarSquat" className="text-base text-amber-100">{t('onboarding.painGlory.squatLabel')}</Label>
                                    <Input
                                        id="lowBarSquat"
                                        name="lowBarSquat"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 140"
                                        className="text-lg bg-amber-950/20 border-amber-900/30"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-amber-200/50">{t('onboarding.painGlory.squatHint')}</p>
                                </div>
                            </div>

                            <div className="bg-red-950/30 border border-red-900/30 rounded p-3 text-sm text-amber-100/80">
                                <strong className="text-red-400">{t('onboarding.painGlory.scheduleTitle')}</strong><br />
                                {t('onboarding.painGlory.scheduleDesc')}
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg font-bold bg-card hover:hover:" size="lg">
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                {t('onboarding.painGlory.buildButton')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Trinary stats form - heavy metal styled
    if (selectedProgramId === TRINARY_CONFIG.id) {
        return (
            <div className="min-h-screen bg-card flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg border-border/50  bg-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('program')} className="-ml-2 text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle className="text-2xl">{t('onboarding.trinary.calibrationTitle')}</CardTitle>
                        </div>
                        <CardDescription className="text-muted-foreground">
                            {t('onboarding.trinary.calibrationDesc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center mb-6">
                            <img src="/trinary.png" alt="Trinary" className="w-32 h-32 object-contain opacity-80" />
                        </div>

                        <form onSubmit={handleTrinarySubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="trinaryBench" className="text-base text-foreground">{t('onboarding.trinary.benchLabel')}</Label>
                                    <Input
                                        id="trinaryBench"
                                        name="trinaryBench"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 100"
                                        className="text-lg bg-secondary/50 border-border/50 text-foreground"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">{t('onboarding.trinary.benchHint')}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="trinaryDeadlift" className="text-base text-foreground">{t('onboarding.trinary.deadliftLabel')}</Label>
                                    <Input
                                        id="trinaryDeadlift"
                                        name="trinaryDeadlift"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 180"
                                        className="text-lg bg-secondary/50 border-border/50 text-foreground"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">{t('onboarding.trinary.deadliftHint')}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="trinarySquat" className="text-base text-foreground">{t('onboarding.trinary.squatLabel')}</Label>
                                    <Input
                                        id="trinarySquat"
                                        name="trinarySquat"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 140"
                                        className="text-lg bg-secondary/50 border-border/50 text-foreground"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">{t('onboarding.trinary.squatHint')}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-base text-foreground">{t('onboarding.trinary.meStyleTitle')}</Label>
                                <p className="text-xs text-muted-foreground">{t('onboarding.trinary.meStyleDesc')}</p>
                                <RadioGroup value={trinaryMeRepMaxStyle} onValueChange={(v) => setTrinaryMeRepMaxStyle(v as '1rm' | '3rm')} className="grid grid-cols-2 gap-2">
                                    <div className={`flex items-center space-x-2 p-3 rounded border ${trinaryMeRepMaxStyle === '3rm' ? 'border-border bg-secondary' : 'border-border/50'}`}>
                                        <RadioGroupItem value="3rm" id="me-3rm" />
                                        <Label htmlFor="me-3rm" className="text-foreground cursor-pointer">{t('onboarding.trinary.meStyle3rm')}</Label>
                                    </div>
                                    <div className={`flex items-center space-x-2 p-3 rounded border ${trinaryMeRepMaxStyle === '1rm' ? 'border-border bg-secondary' : 'border-border/50'}`}>
                                        <RadioGroupItem value="1rm" id="me-1rm" />
                                        <Label htmlFor="me-1rm" className="text-foreground cursor-pointer">{t('onboarding.trinary.meStyle1rm')}</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="bg-secondary/50 border border-border/30 rounded p-3 text-sm text-foreground">
                                <strong className="text-foreground">{t('onboarding.trinary.scheduleTitle')}</strong><br />
                                {t('onboarding.trinary.scheduleDesc')}
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg font-bold bg-card hover:hover:text-foreground" size="lg">
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                {t('onboarding.trinary.buildButton')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Ritual of Strength - First Program Question (before stats)
    if (selectedProgramId === RITUAL_CONFIG.id && ritualIsFirstProgram === null) {
        return (
            <div className="min-h-screen bg-card flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg border-red-900/40  bg-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('program')} className="-ml-2 text-red-200 hover:text-red-100">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle className="text-2xl">Ritual of Strength</CardTitle>
                        </div>
                        <CardDescription className="text-red-200/70">
                            {t('onboarding.ritualOfStrength.firstProgramQuestion')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Button
                                onClick={() => setRitualIsFirstProgram(true)}
                                className="w-full h-16 text-lg bg-card hover:hover:text-red-50"
                                size="lg"
                            >
                                {t('onboarding.ritualOfStrength.firstProgramYes')}
                            </Button>

                            <Button
                                onClick={() => setRitualIsFirstProgram(false)}
                                variant="outline"
                                className="w-full h-16 text-lg border-red-900/50 bg-red-950/20 text-red-400 hover:bg-red-900/40 hover:text-red-300"
                                size="lg"
                            >
                                {t('onboarding.ritualOfStrength.firstProgramNo')}
                            </Button>
                        </div>

                        <div className="mt-6 p-4 bg-red-950/20 border border-red-900/30 rounded text-sm text-red-200/70">
                            {t('onboarding.ritualOfStrength.firstProgramNote')}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Ritual of Strength stats form - dark cult theme
    if (selectedProgramId === RITUAL_CONFIG.id) {
        return (
            <div className="min-h-screen bg-card flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg border-red-900/40  bg-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setRitualIsFirstProgram(null)} className="-ml-2 text-red-200 hover:text-red-100">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle className="text-2xl">{t('onboarding.ritualOfStrength.calibrationTitle')}</CardTitle>
                        </div>
                        <CardDescription className="text-red-200/70">
                            {t('onboarding.ritualOfStrength.calibrationDesc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center mb-6">
                            <img src="/ritual.png" alt="Ritual of Strength" className="w-32 h-32 object-contain opacity-70" />
                        </div>

                        <form onSubmit={async (e: React.FormEvent) => {
                            e.preventDefault();
                            const bench1RM = (stats as any).ritualBench || 0;
                            const deadlift1RM = (stats as any).ritualDeadlift || 0;
                            const squat1RM = (stats as any).ritualSquat || 0;

                            if (bench1RM <= 0 || deadlift1RM <= 0 || squat1RM <= 0) {
                                alert("Please enter valid 1RM values for all three lifts.");
                                return;
                            }

                            const ritualStats = {
                                ...stats,
                                ritualBench1RM: bench1RM,
                                ritualDeadlift1RM: deadlift1RM,
                                ritualSquat1RM: squat1RM
                            };

                            const initialRitualStatus = {
                                benchPress1RM: bench1RM,
                                deadlift1RM: deadlift1RM,
                                squat1RM: squat1RM,
                                completedWorkouts: 0,
                                currentWeek: ritualIsFirstProgram ? 1 : 5, // Week 1 for ramp-in, Week 5 to skip
                                isFirstProgram: ritualIsFirstProgram || false,
                                rampInComplete: !ritualIsFirstProgram // true if skipping ramp-in
                            };

                            try {
                                if (user) {
                                    await updateUserProfile({
                                        stats: ritualStats,
                                        ritualStatus: initialRitualStatus
                                    });
                                    await switchProgram(RITUAL_CONFIG.id);
                                } else {
                                    if (!codeword) throw new Error("No codeword found. Please restart.");
                                    await registerUser(codeword, ritualStats, RITUAL_CONFIG.id, [], {});
                                    const userRef = doc(db, 'users', codeword.toLowerCase());
                                    await updateDoc(userRef, {
                                        ritualStatus: initialRitualStatus
                                    });
                                }
                                navigate('/app/dashboard');
                            } catch (err: any) {
                                console.error("Registration failed:", err);
                                alert("Failed to build program: " + (err.message || "Unknown error"));
                            }
                        }} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ritualBench" className="text-base text-red-100">{t('onboarding.ritualOfStrength.benchLabel')}</Label>
                                    <Input
                                        id="ritualBench"
                                        name="ritualBench"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 100"
                                        className="text-lg bg-red-950/30 border-red-900/50 text-red-50"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-red-300/50">{t('onboarding.ritualOfStrength.benchHint')}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ritualDeadlift" className="text-base text-red-100">{t('onboarding.ritualOfStrength.deadliftLabel')}</Label>
                                    <Input
                                        id="ritualDeadlift"
                                        name="ritualDeadlift"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 180"
                                        className="text-lg bg-red-950/30 border-red-900/50 text-red-50"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-red-300/50">{t('onboarding.ritualOfStrength.deadliftHint')}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ritualSquat" className="text-base text-red-100">{t('onboarding.ritualOfStrength.squatLabel')}</Label>
                                    <Input
                                        id="ritualSquat"
                                        name="ritualSquat"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 140"
                                        className="text-lg bg-red-950/30 border-red-900/50 text-red-50"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-red-300/50">{t('onboarding.ritualOfStrength.squatHint')}</p>
                                </div>
                            </div>

                            <div className="bg-red-950/30 border border-red-900/30 rounded p-3 text-sm text-red-200">
                                <strong className="text-red-100">{t('onboarding.ritualOfStrength.scheduleTitle')}</strong><br />
                                {t('onboarding.ritualOfStrength.scheduleDesc')}
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg font-bold bg-card hover:hover:text-red-50" size="lg">
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                {t('onboarding.ritualOfStrength.buildButton')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Super Mutant stats form - Fallout wasteland theme
    if (step === 'super-mutant-stats') {
        return (
            <div className="min-h-screen bg-card flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg border-green-800/40  bg-card">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('program')} className="-ml-2 text-green-200 hover:text-green-100">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle className="text-2xl">Super Mutant Configuration</CardTitle>
                        </div>
                        <CardDescription className="text-green-200/70">
                            Select your exercise preferences. The program adapts to your recovery with dynamic scheduling.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                        <form onSubmit={async (e: React.FormEvent) => {
                            e.preventDefault();

                            const initialSuperMutantStatus = {
                                completedWorkouts: 0,
                                currentCycle: 1,
                                muscleGroupTimestamps: {},
                                rolling7DayVolume: {
                                    chest: 0,
                                    shoulders: 0,
                                    triceps: 0,
                                    back: 0,
                                    biceps: 0,
                                    calves: 0,
                                    hamstrings: 0,
                                    glutes: 0,
                                    lowerBack: 0,
                                    quads: 0,
                                    abductors: 0,
                                    abs: 0
                                },
                                chestVariant: 'A' as const,
                                backVariant: 'A' as const,
                                nextUpperBlock: 'A' as const,
                                nextLowerBlock: 'C' as const,
                                bench1RM: 0,
                                deadlift1RM: 0,
                                squat1RM: 0,
                                quadExercise: superMutantPrefs.quadExercise,
                                hamstringExercise: superMutantPrefs.hamstringExercise,
                                weeklySessionDates: []
                            };

                            try {
                                if (user) {
                                    await updateUserProfile({
                                        superMutantStatus: initialSuperMutantStatus
                                    });
                                    await switchProgram(SUPER_MUTANT_PROGRAM.id);
                                } else {
                                    if (!codeword) throw new Error("No codeword found. Please restart.");
                                    const zeroStats = { pausedBench: 0, wideGripBench: 0, spotoPress: 0, lowPinPress: 0 };
                                    await registerUser(codeword, zeroStats, SUPER_MUTANT_PROGRAM.id, [], {});
                                    const userRef = doc(db, 'users', codeword.toLowerCase());
                                    await updateDoc(userRef, {
                                        superMutantStatus: initialSuperMutantStatus
                                    });
                                }
                                navigate('/app/dashboard');
                            } catch (err: any) {
                                console.error("Registration failed:", err);
                                alert("Failed to build program: " + (err.message || "Unknown error"));
                            }
                        }} className="space-y-6">
                            <div className="space-y-4 border-b border-green-900/30 pb-4">
                                <h3 className="text-lg font-semibold text-green-200">Exercise Preferences</h3>
                                <p className="text-sm text-green-300/70">Choose your preferred exercises for quads and hamstrings. All other exercises are fixed for optimal muscle development.</p>

                                <div className="space-y-2">
                                    <Label className="text-base text-green-100">Quad Exercise</Label>
                                    <RadioGroup value={superMutantPrefs.quadExercise} onValueChange={(v) => setSuperMutantPrefs(p => ({ ...p, quadExercise: v as 'Hack Squat' | 'Front Squat' | 'Safety Bar Squat' }))}>
                                        <div className="flex items-center space-x-2 p-3 border border-green-900/30 rounded hover:bg-green-950/20 cursor-pointer">
                                            <RadioGroupItem value="Hack Squat" id="hack-squat" />
                                            <Label htmlFor="hack-squat" className="text-green-200 cursor-pointer flex-1">Hack Squat</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-3 border border-green-900/30 rounded hover:bg-green-950/20 cursor-pointer">
                                            <RadioGroupItem value="Front Squat" id="front-squat" />
                                            <Label htmlFor="front-squat" className="text-green-200 cursor-pointer flex-1">Front Squat</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-3 border border-green-900/30 rounded hover:bg-green-950/20 cursor-pointer">
                                            <RadioGroupItem value="Safety Bar Squat" id="safety-bar-squat" />
                                            <Label htmlFor="safety-bar-squat" className="text-green-200 cursor-pointer flex-1">Safety Bar Squat</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-base text-green-100">Hamstring Exercise</Label>
                                    <RadioGroup value={superMutantPrefs.hamstringExercise} onValueChange={(v) => setSuperMutantPrefs(p => ({ ...p, hamstringExercise: v as 'Good Mornings' | 'Deficit RDLs' }))}>
                                        <div className="flex items-center space-x-2 p-3 border border-green-900/30 rounded hover:bg-green-950/20 cursor-pointer">
                                            <RadioGroupItem value="Good Mornings" id="good-mornings" />
                                            <Label htmlFor="good-mornings" className="text-green-200 cursor-pointer flex-1">Good Mornings</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 p-3 border border-green-900/30 rounded hover:bg-green-950/20 cursor-pointer">
                                            <RadioGroupItem value="Deficit RDLs" id="deficit-rdls" />
                                            <Label htmlFor="deficit-rdls" className="text-green-200 cursor-pointer flex-1">Deficit RDLs</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>

                            <div className="bg-orange-950/30 border border-orange-900/30 rounded p-4 space-y-2">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-orange-100">Dynamic Auto-Scheduling</p>
                                        <ul className="text-xs text-orange-200/80 space-y-1">
                                            <li>• No fixed weekly schedule - train when ready</li>
                                            <li>• Upper body: 48-hour cooldown between sessions</li>
                                            <li>• Lower body: 72-hour cooldown between sessions</li>
                                            <li>• App builds sessions automatically targeting ~90 min</li>
                                            <li>• Weekly cap: Maximum 6 sessions per week</li>
                                            <li>• Use "Next Workout" button on dashboard when ready</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg font-bold bg-card hover:hover:text-green-50" size="lg">
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                BEGIN MUTATION
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Generic schedule step for declarative plans: pick weekdays (suggested
    // splits offered as one-tap chips) or an irregular rotation template like
    // 2 days on / 1 day off, which runs the plan completion-driven.
    if (step === 'plan-selections') {
        const plan = getPlan(selectedProgramId ?? undefined);
        const continueFromSelections = () => {
            const planOnboarding = plan.onboarding;
            if (!benchmarkLiftsFor([...(planOnboarding?.requiredStats ?? []), ...(planOnboarding?.seedStats ?? [])]).length) {
                void enrolWithoutBenchmarks(plan.id);
                return;
            }
            setStep('benchmark');
        };
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep(plan.schedule?.selectable ? 'schedule' : 'program')} className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle>Exercise choices</CardTitle>
                        </div>
                        <CardDescription>These can be changed later in Settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {selectedProgramId === 'kali' && (
                            <>
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Pull anchor (Hunt day)</Label>
                                    <RadioGroup value={kaliPull} onValueChange={setKaliPull}>
                                        {KALI_PULL_ANCHORS.map(option => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={`kali-pull-${option.id}`} />
                                                <Label htmlFor={`kali-pull-${option.id}`} className="font-normal">{option.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">Week 8 intensifier repeat</Label>
                                    <RadioGroup value={kaliWeek8} onValueChange={setKaliWeek8}>
                                        {KALI_WEEK8.map(option => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={`kali-w8-${option.id}`} />
                                                <Label htmlFor={`kali-w8-${option.id}`} className="font-normal">{option.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </>
                        )}
                        {selectedProgramId === 'gravity-is-optional' && (
                            <div className="space-y-3">
                                <Label className="text-base font-semibold">Ab raise</Label>
                                <RadioGroup value={coreRaise} onValueChange={setCoreRaise}>
                                    {CORE_RAISE_OPTIONS.map(option => (
                                        <div key={option.id} className="flex items-start space-x-2">
                                            <RadioGroupItem value={option.id} id={`abs-${option.id}`} className="mt-1" />
                                            <Label htmlFor={`abs-${option.id}`} className="font-normal">
                                                <span className="font-semibold capitalize">{option.level}</span>
                                                {' — '}
                                                {option.label}
                                                <span className="block text-xs text-muted-foreground">{option.hint}</span>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        )}
                        <Button className="w-full" size="lg" onClick={continueFromSelections}>Continue</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'schedule') {
        const plan = getPlan(selectedProgramId ?? undefined);
        const schedule = plan.schedule ?? {};
        const daysPerWeek = plan.program.weeks[0]?.days.filter(d => d.exercises.length > 0).length ?? 0;
        const weekDayLabels = tArray('common.daysShort');
        const templates = schedule.irregularTemplates ?? [];

        const continueFromSchedule = () => {
            const planOnboarding = plan.onboarding;
            if (needsPlanSelections(plan.id)) {
                setStep('plan-selections');
                return;
            }
            if (!benchmarkLiftsFor([...(planOnboarding?.requiredStats ?? []), ...(planOnboarding?.seedStats ?? [])]).length) {
                void enrolWithoutBenchmarks(plan.id);
                return;
            }
            setStep('benchmark');
        };

        const toggleFixedDay = (dayNum: number) => {
            setSelectedDays(prev => {
                if (prev.includes(dayNum)) return prev.filter(d => d !== dayNum);
                if (prev.length >= daysPerWeek) return prev;
                return [...prev, dayNum].sort((a, b) => a - b);
            });
        };

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('program')} className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle>{t('onboarding.schedule.title')}</CardTitle>
                        </div>
                        <CardDescription>{t('onboarding.schedule.desc', { count: daysPerWeek })}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup
                            value={scheduleMode === 'fixed' ? 'fixed' : `tpl:${selectedTemplate}`}
                            onValueChange={(v) => {
                                if (v === 'fixed') setScheduleMode('fixed');
                                else {
                                    setScheduleMode('rolling');
                                    setSelectedTemplate(v.replace('tpl:', ''));
                                }
                            }}
                            className="space-y-3"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fixed" id="sched-fixed" />
                                <Label htmlFor="sched-fixed" className="font-normal">{t('onboarding.schedule.fixedDays')}</Label>
                            </div>
                            {templates.map(tpl => (
                                <div key={tpl.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={`tpl:${tpl.id}`} id={`sched-${tpl.id}`} />
                                    <Label htmlFor={`sched-${tpl.id}`} className="font-normal">
                                        {t(`onboarding.schedule.templates.${tpl.id}`, { on: tpl.onDays, off: tpl.offDays })}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>

                        {scheduleMode === 'fixed' && (
                            <div className="space-y-3">
                                {(schedule.suggestedSplits ?? []).length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">{t('onboarding.schedule.suggested')}</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {(schedule.suggestedSplits ?? []).map(split => (
                                                <button
                                                    key={split.join('-')}
                                                    type="button"
                                                    onClick={() => setSelectedDays(split)}
                                                    className={`px-3 py-1.5 border rounded text-xs font-medium transition-colors ${selectedDays.join('-') === split.join('-') ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                                                >
                                                    {split.map(d => weekDayLabels[d - 1] ?? d).join(' · ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-7 gap-1">
                                    {Array.from({ length: 7 }, (_, i) => i + 1).map(dayNum => {
                                        const isSelected = selectedDays.includes(dayNum);
                                        return (
                                            <div
                                                key={dayNum}
                                                onClick={() => toggleFixedDay(dayNum)}
                                                className={`aspect-square flex items-center justify-center rounded cursor-pointer text-sm font-bold border transition-colors ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                                            >
                                                {weekDayLabels[dayNum - 1] ?? dayNum}
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-[10px] text-right text-muted-foreground">{selectedDays.length} / {daysPerWeek}</p>
                            </div>
                        )}

                        {scheduleMode === 'rolling' && (
                            <p className="text-sm text-muted-foreground">{t('onboarding.schedule.rollingNote')}</p>
                        )}

                        <Button
                            className="w-full"
                            size="lg"
                            disabled={scheduleMode === 'fixed' && selectedDays.length !== daysPerWeek}
                            onClick={continueFromSchedule}
                        >
                            {t('onboarding.nextExerciseSelection')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Generic benchmark step. Which lifts appear comes from the plan's own
    // progressions, so this one form serves every declarative plan and asks for
    // nothing a plan doesn't actually read.
    if (step === 'benchmark') {
        const onboarding = getPlan(selectedProgramId ?? undefined).onboarding;
        const lifts = benchmarkLiftsFor([...(onboarding?.requiredStats ?? []), ...(onboarding?.seedStats ?? [])]);
        const seeded = new Set(onboarding?.seedStats ?? []);
        const allUnknown = lifts.length > 0 && lifts.every(({ stat }) => unknownStats.has(stat));

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg border-primary/20 ">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep(getPlan(selectedProgramId ?? undefined).schedule?.selectable ? 'schedule' : 'program')} className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle className="text-2xl">{t('onboarding.benchmark.title')}</CardTitle>
                        </div>
                        {lifts.length > 0 && (
                            <CardDescription>
                                {/* A plan that only seeds opening loads does not
                                    prescribe by percentage, and saying it does
                                    makes a skipped field look consequential. */}
                                {lifts.every(({ stat }) => seeded.has(stat))
                                    ? t('onboarding.benchmark.seedDesc')
                                    : t('onboarding.benchmark.desc')}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleBenchmarkSubmit} className="space-y-6">
                            {lifts.map(({ stat, lift }) => {
                                const isUnknown = unknownStats.has(stat);
                                return (
                                    <div key={stat} className="space-y-2">
                                        <Label htmlFor={stat} className="text-base">
                                            {t(`onboarding.benchmark.lifts.${lift.key}.label`)}
                                        </Label>
                                        <Input
                                            id={stat}
                                            name={stat}
                                            type="number"
                                            min="0"
                                            step="2.5"
                                            inputMode="decimal"
                                            disabled={isUnknown}
                                            placeholder={`e.g. ${lift.placeholder}`}
                                            className="text-lg"
                                            value={(stats as unknown as Record<string, number>)[stat] || ''}
                                            onChange={handleStatsChange}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {seeded.has(stat)
                                                ? t('onboarding.benchmark.seedHint')
                                                : t(`onboarding.benchmark.lifts.${lift.key}.hint`)}
                                        </p>
                                        {benchmarkSuggestions[stat] && !isUnknown && (
                                            <button
                                                type="button"
                                                onClick={() => setStats(prev => ({ ...prev, [stat]: benchmarkSuggestions[stat]!.kg }))}
                                                className="text-xs font-medium text-primary hover:underline"
                                            >
                                                {t(`onboarding.benchmark.suggest.${benchmarkSuggestions[stat]!.source}`, { kg: benchmarkSuggestions[stat]!.kg })}
                                            </button>
                                        )}
                                        <label className="flex items-center gap-2 pt-1 cursor-pointer">
                                            <Checkbox
                                                checked={isUnknown}
                                                onCheckedChange={() => setUnknownStats(prev => {
                                                    const next = new Set(prev);
                                                    if (next.has(stat)) next.delete(stat); else next.add(stat);
                                                    return next;
                                                })}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {t('onboarding.benchmark.unknownToggle')}
                                            </span>
                                        </label>
                                        {isUnknown && (
                                            <div className="flex gap-2 rounded border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                                                <AlertCircle className="h-4 w-4 shrink-0 text-primary" />
                                                <span>{t('onboarding.benchmark.unknownNote')}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {onboarding?.requireBodyweight && (
                                <div className="space-y-2">
                                    <Label htmlFor="bodyweightKg" className="text-base">Bodyweight (kg)</Label>
                                    <Input
                                        id="bodyweightKg"
                                        name="bodyweightKg"
                                        type="number"
                                        inputMode="decimal"
                                        required
                                        value={stats.bodyweightKg || ''}
                                        onChange={e => setStats(current => ({ ...current, bodyweightKg: Number(e.target.value) || 0 }))}
                                    />
                                </div>
                            )}

                            {allUnknown && (
                                <p className="text-xs text-muted-foreground">
                                    {t('onboarding.benchmark.allUnknownNote')}
                                </p>
                            )}

                            <Button type="submit" className="w-full h-12 text-lg font-bold" size="lg">
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                {t('onboarding.benchmark.buildButton')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Bench Domination stats form
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-lg border-primary/20 ">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setStep('bench-modules')} className="-ml-2">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <CardTitle className="text-2xl">Calibration Phase</CardTitle>
                    </div>
                    <CardDescription>
                        Enter your current 1 Rep Max (1RM) for the following lifts. Be honest. The program depends on accurate inputs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleBenchDominationSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="pausedBench" className="text-base">Paused Bench Press 1RM (Primary)</Label>
                                <Input
                                    id="pausedBench"
                                    name="pausedBench"
                                    type="number"
                                    min="0"
                                    placeholder="e.g. 100"
                                    className="text-lg"
                                    onChange={handleStatsChange}
                                    step="0.1"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Competition style pause.</p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                                    <strong>These are optional but HIGHLY recommended.</strong> If left blank, the app will estimate:<br />
                                    • Wide-Grip ≈ 92% of your paused bench<br />
                                    • Spoto Press ≈ 95% of your paused bench<br />
                                    • Low Pin Press ≈ 88% of your paused bench<br />
                                    Entering your real 1RMs for these variations will give far more accurate and safer weights.
                                </p>
                                <div className="space-y-2">
                                    <Label htmlFor="wideGripBench">Wide-Grip Bench 1RM (Optional)</Label>
                                    <Input
                                        id="wideGripBench"
                                        name="wideGripBench"
                                        type="number"
                                        min="0"
                                        placeholder={stats.pausedBench > 0 ? `Est: ${Math.floor((stats.pausedBench * 0.92) / 2.5) * 2.5}` : "e.g. 90"}
                                        onChange={handleStatsChange}
                                        step="0.5"
                                        className={!stats.wideGripBench ? "italic text-muted-foreground" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="spotoPress">Spoto Press 1RM (Optional)</Label>
                                    <Input
                                        id="spotoPress"
                                        name="spotoPress"
                                        type="number"
                                        min="0"
                                        placeholder={stats.pausedBench > 0 ? `Est: ${Math.floor((stats.pausedBench * 0.95) / 2.5) * 2.5}` : "e.g. 95"}
                                        onChange={handleStatsChange}
                                        step="0.5"
                                        className={!stats.spotoPress ? "italic text-muted-foreground" : ""}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lowPinPress">Low Pin Press 1RM (Optional)</Label>
                                <Input
                                    id="lowPinPress"
                                    name="lowPinPress"
                                    type="number"
                                    min="0"
                                    placeholder={stats.pausedBench > 0 ? `Est: ${Math.floor((stats.pausedBench * 0.88) / 2.5) * 2.5}` : "e.g. 105"}
                                    onChange={handleStatsChange}
                                    step="0.5"
                                    className={!stats.lowPinPress ? "italic text-muted-foreground" : ""}
                                />
                                <p className="text-xs text-muted-foreground">Pins at your sticking point.</p>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg font-bold" size="lg">
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            BUILD MY PROGRAM
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
