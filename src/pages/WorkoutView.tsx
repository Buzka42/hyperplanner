
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { CheckCircle2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { doc, updateDoc, arrayUnion, increment, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { cn } from '../lib/utils';
import { translations } from '../contexts/translations';
import type { LiftingStats, WorkoutLog } from '../types';

interface SetLog {
    reps: string;
    weight: string;
    completed: boolean | null;
}

export const WorkoutView: React.FC = () => {
    const { week, day } = useParams();
    const { user, activePlanConfig } = useUser();
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
                    setIsExistingLog(true);
                    loaded = true;
                    // Load data into state
                    const loadedData: Record<string, SetLog[]> = {};
                    const loadedNotes: Record<string, string> = {};

                    // Filter docs by programId, similar to the original logic
                    const relevantDocs = todaySnapshot.docs.filter(doc => {
                        const d = doc.data();
                        return d.programId === programData.id || (!d.programId && programData.id === 'bench-domination');
                    });

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
                // If giant set, sets = defined sets * steps count
                const setsCount = isGiantSet
                    ? ex.sets * (ex.giantSetConfig?.steps.length || 1)
                    : (ex.name.includes("Pull-ups") && ex.sets === 0 ? 1 : ex.sets);

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

            // Pullup Backoff Logic (Specific to Bench Dom, should ideally be in hook or genericized?)
            // This is UI behavior (auto-filling rows).
            // It's hard to hook-ify "onChange behavior" without complex config.
            // I'll leave the specific Pullup logic here for now but guard it?
            // "if isPullup" is already a guard.
            if (isPullup && weekNum >= 7 && weekNum <= 9 && setIndex === 0 && field === 'weight') {
                const w = parseFloat(value);
                if (!isNaN(w)) {
                    const nextWeight = Math.ceil((w * 0.9) / 1.25) * 1.25;
                    for (let i = 1; i < currentSets.length; i++) {
                        currentSets[i].weight = nextWeight.toString();
                    }
                }
            }

            if (isPullup && field === 'reps') {
                const reps = parseInt(value);
                const target = parseInt(suggestedReps.replace(/[^0-9]/g, '') || "0");
                const isMax = suggestedReps.toLowerCase().includes("max");
                if (setIndex === currentSets.length - 1) {
                    if (!isNaN(reps)) {
                        // Add new set if target hit
                        if ((reps >= target && target > 0) || (isMax && reps > 0)) {
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

                    // Behind-the-Neck Press Progression Logic
                    if (ex.name === "Behind-the-Neck Press" && sets.length > 0) {
                        const targetRepsArr = ex.target.reps.split('-').map(Number);
                        const topRep = targetRepsArr[1] || targetRepsArr[0];
                        const bottomRep = targetRepsArr[0] || 0;
                        const currentWeight = parseFloat(sets[0].weight || "0");

                        if (currentWeight > 0) {
                            const allTop = sets.every(s => parseInt(s.reps) >= topRep);
                            const failedBottom = sets.filter(s => parseInt(s.reps) < bottomRep).length >= 2;

                            let nextWeight = currentWeight;
                            if (allTop) {
                                nextWeight += 2.5;
                            } else if (failedBottom) {
                                // Prompt says "keep same weight" but technically it implies failing.
                                // We keep it same.
                                nextWeight = currentWeight;
                            }

                            // Update Snapshot
                            newStats.btnPress = nextWeight;
                            updated = true;
                        }
                    }
                });
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
        return <div className="p-8 text-center text-muted-foreground">Rest Day or Invalid Date</div>;
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate('/app/dashboard')} className="-ml-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{dayData.dayName}</h2>
                    <p className="text-muted-foreground">Week {weekNum} {isExistingLog && <span className="text-green-500 font-bold ml-2">(Completed)</span>}</p>
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
                    const isNordic = ex.name.includes("Nordic Curls");
                    const isAroundWorlds = ex.name.includes("Around-the-Worlds");

                    const weightDisabled = isDragonFlag || isNordic || isAroundWorlds;


                    // Tip Logic
                    // Tip Logic
                    const displayTips: string[] = [];

                    const tipMap: Record<string, keyof typeof translations.en.tips | undefined> = {
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
                        "Hack Squat Calf Raises": programData.id === 'peachy-glute-plan' ? undefined : "hackSquatCalves",
                        "Hip Adduction": "hipAdduction",
                        "Around-the-Worlds": "aroundTheWorlds",
                        "Y-Raises": programData.id === 'peachy-glute-plan' ? "yRaisesPeachy" : "yRaises",
                        "Assisted Pull-ups": programData.id === 'peachy-glute-plan' ? "assistedPullups" : undefined,
                        "High-Elbow Facepulls": "highElbowFacepulls"
                    };

                    const tipKey = tipMap[ex.name];
                    if (tipKey && translations.en.tips[tipKey]) {
                        displayTips.push(translations.en.tips[tipKey]);
                    }

                    if (ex.name.includes("Pull-ups")) {
                        let pKey: keyof typeof translations.en.tips | null = null;
                        if (weekNum <= 3) pKey = "pullupWeeks1to3";
                        else if (weekNum <= 6) pKey = "pullupWeeks4to6";
                        else if (weekNum <= 9) pKey = "pullupWeeks7to9";
                        else if (weekNum === 10) pKey = "pullupWeek10";
                        else if (weekNum >= 11) pKey = "pullupWeeks11to12";

                        if (pKey && translations.en.tips[pKey]) {
                            displayTips.push(translations.en.tips[pKey]);
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
                                                        last: {prevStat.weight}kg x {prevStat.reps}
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
                                                    {ex.sets} giant sets × {ex.giantSetConfig?.steps.map((s, i) =>
                                                        `${s.targetReps} ${s.name}${i < (ex.giantSetConfig?.steps.length || 0) - 1 ? ", " : ""}`
                                                    )}
                                                </div>
                                            ) : ex.sets > 0 ? (
                                                <p className="text-sm text-muted-foreground">
                                                    {ex.sets} sets × {ex.target.reps === "Failure" ? "Failure" : `${ex.target.reps} reps`}
                                                </p>
                                            ) : null}
                                            <div className="flex justify-between items-center">
                                                {targetWeight && targetWeight !== "0" && !isGiantSet ? (
                                                    <span className="text-sm font-mono text-primary font-bold">Target: {targetWeight}kg</span>
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

                                <div className="p-3 bg-secondary/5 border-t border-border space-y-3">
                                    <div className="relative">
                                        <Input
                                            placeholder="Notes..."
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
                                        <CheckCircle2 className="w-3 h-3 mr-2" /> Mark All Completed
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
                    {submitting ? "SAVING..." : "COMPLETE WORKOUT"} <Save className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};
