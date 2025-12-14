import type { Program, ProgramWeek, WorkoutDay, PlanConfig, UserProfile, SetTarget, Exercise } from '../types';

const createWeeks = (): ProgramWeek[] => {
    const weeks: ProgramWeek[] = [];
    for (let w = 1; w <= 15; w++) {
        const days: WorkoutDay[] = [];

        // --- PEAKING BLOCK (Weeks 13-15) ---
        if (w >= 13) {
            // Only generate days if we are in peaking block logic. 
            // We'll filter access to these in preprocessDay if user chose "Test Now".

            // Week 13: Doubles @ 90–92.5% + AMRAP @ 75%
            // Week 14: Singles @ 95–97.5% + AMRAP @ 80–82.5%
            // Week 15: 1RM test day

            const isWeek13 = w === 13;
            const isWeek15 = w === 15;

            // Day 1: Heavy Bench (modified)
            const d1Exercises: Exercise[] = [];
            if (!isWeek15) {
                d1Exercises.push({
                    id: `w${w}-d1-e1`,
                    name: "Paused Bench Press",
                    sets: isWeek13 ? 4 : 5,
                    target: {
                        type: "straight",
                        reps: isWeek13 ? "2" : "1",
                        percentage: isWeek13 ? 0.91 : 0.96, // Avg of range
                        percentageRef: "pausedBench"
                    },
                    notes: isWeek13 ? "90-92.5% Doubles" : "95-97.5% Singles"
                });
            } else {
                // Week 15 Day 1 is Rest or Prep? Usually Week 15 is just the Test Day.
                // Let's assume Mon is Rest/Light, Sat is Test? Or Mon is Test?
                // "Week 15: 1RM test day". Let's put it on Saturday (Test Day) or Day 1?
                // Standard structure: Taper -> Test. Let's put Test on Day 1 (Monday) or keep Saturday convention?
                // User prompt: "Monday: Heavy... Saturday: AMRAP".
                // Let's keep Test on Saturday for consistency, or standard Meet day.
                // Let's put it on Saturday (Day 6). Monday light work.
                d1Exercises.push({
                    id: `w${w}-d1-e1`,
                    name: "Paused Bench Press",
                    sets: 3,
                    target: { type: "straight", reps: "3", percentage: 0.5, percentageRef: "pausedBench" },
                    notes: "Active Recovery / Primer"
                });
            }

            // Accessories (Reduced volume during taper)
            if (!isWeek15) {
                d1Exercises.push({
                    id: `w${w}-d1-e2`,
                    name: "Tricep Giant Set",
                    sets: 2,
                    target: { type: "failure", reps: "Giant" },
                    giantSetConfig: {
                        steps: [
                            { name: "Bodyweight Dips", targetReps: "5", inputPlaceholder: "-" },
                            { name: "Rolling DB Tricep Extensions", targetReps: "10", inputPlaceholder: "-", editableWeight: true },
                            { name: "Banded EZ Bar Skullcrushers", targetReps: "15", inputPlaceholder: "-", editableWeight: true }
                        ]
                    }
                });
            }

            days.push({ dayName: `Monday - ${isWeek15 ? "Primer" : "Peaking"}`, dayOfWeek: 1, exercises: d1Exercises });

            // Day 2: Legs (Maintenance)
            days.push({
                dayName: "Tuesday - Legs (Maintenance)",
                dayOfWeek: 2,
                exercises: [
                    { id: `w${w}-d2-e1`, name: "Walking Lunges", sets: 2, target: { type: "range", reps: "10" } },
                    { id: `w${w}-d2-e2`, name: "Heels-Off Narrow Leg Press", sets: 2, target: { type: "range", reps: "10" } }
                ]
            });

            // Day 3: Volume/Speed (Reduced)
            const d3Exercises: Exercise[] = [];
            if (!isWeek15) {
                d3Exercises.push({
                    id: `w${w}-d3-e1`,
                    name: "Paused Bench Press",
                    sets: 3,
                    target: { type: "straight", reps: "3", percentage: 0.65, percentageRef: "pausedBench" },
                    notes: "Speed focus"
                });
                d3Exercises.push({
                    id: `w${w}-d3-e2`,
                    name: "Weighted Pull-ups",
                    sets: 3,
                    target: { type: "range", reps: "3-5" }
                });
            } else {
                d3Exercises.push({ id: `w${w}-d3-rest`, name: "Rest / Mobility", sets: 0, target: { type: "straight", reps: "0" }, notes: "Rest Day" });
            }
            days.push({ dayName: "Wednesday - Light/Speed", dayOfWeek: 3, exercises: d3Exercises });

            // Day 4: Power (Skipped or very light)
            days.push({
                dayName: "Thursday - Rest",
                dayOfWeek: 4,
                exercises: isWeek15 ? [] : [
                    { id: `w${w}-d4-e1`, name: "Behind-the-Neck Press", sets: 3, target: { type: "range", reps: "8-10" }, notes: "Light & Crisp" }
                ]
            });

            // Day 5: Legs Copy
            days.push({ dayName: "Friday - Legs", dayOfWeek: 5, exercises: days[1].exercises });

            // Day 6: Test / AMRAP
            const d6Exercises: Exercise[] = [];
            if (isWeek15) {
                d6Exercises.push({
                    id: `w${w}-d6-e1`,
                    name: "Paused Bench Press (1RM TEST)",
                    sets: 1,
                    target: { type: "straight", reps: "1", percentage: 1.05, percentageRef: "pausedBench" },
                    notes: "Warm up well. Go for PR. YOU ARE A THREAT."
                });
            } else {
                d6Exercises.push({
                    id: `w${w}-d6-e1`,
                    name: "Paused Bench Press (AMRAP)",
                    sets: 1,
                    target: {
                        type: "amrap",
                        reps: "AMRAP",
                        percentage: isWeek13 ? 0.75 : 0.81, // Avg of range 
                        percentageRef: "pausedBench"
                    },
                    notes: "Push hard but leave 1 rep"
                });
            }
            days.push({ dayName: isWeek15 ? "Saturday - JUDGMENT DAY" : "Saturday - Peaking AMRAP", dayOfWeek: 6, exercises: d6Exercises });

            weeks.push({ weekNumber: w, days });
            continue;
        }

        // --- NORMAL BLOCKS (Weeks 1-12) ---
        // Dynamic Percentages
        let monBenchPerc = 0.825;
        if (w >= 5) monBenchPerc = 0.85;
        if (w >= 9) monBenchPerc = 0.875;

        let wedBenchPerc = 0.725;
        if (w >= 5) wedBenchPerc = 0.75;
        if (w >= 9) wedBenchPerc = 0.775;

        // Tricep Giant Sets count
        const giantSets = w >= 9 ? 3 : 2;

        // Pullups logic
        let pullupReps = "Max";
        if (w >= 4 && w <= 6) {
            pullupReps = "3-5";
        } else if (w >= 7 && w <= 9) {
            pullupReps = "3";
        } else if (w >= 10 && w <= 12) {
            pullupReps = "2-3";
        }

        // MONDAY
        days.push({
            dayName: "Monday - Heavy Strength",
            dayOfWeek: 1,
            exercises: [
                {
                    id: `w${w}-d1-e1`,
                    name: "Paused Bench Press",
                    sets: 4,
                    target: { type: "straight", reps: "3", percentage: monBenchPerc, percentageRef: "pausedBench" }
                },
                {
                    id: `w${w}-d1-e2`,
                    name: "Wide-Grip Bench Press",
                    sets: 3,
                    target: { type: "range", reps: "6-8", percentage: 0.675, percentageRef: "wideGripBench" },

                },
                {
                    id: `w${w}-d1-e3`,
                    name: "Behind-the-Neck Press",
                    sets: 4,
                    target: { type: "range", reps: "3-5" }, // Heavy Day logic
                    notes: "Heavy Strength"
                },
                {
                    id: `w${w}-d1-e4`,
                    name: "Tricep Giant Set",
                    sets: giantSets,
                    target: { type: "failure", reps: "Giant" },

                    giantSetConfig: {
                        steps: [
                            { name: "Bodyweight Dips", targetReps: "5", inputPlaceholder: "-" },
                            { name: "Rolling DB Tricep Extensions", targetReps: "12", inputPlaceholder: "-", editableWeight: true },
                            { name: "Banded EZ Bar Skullcrushers", targetReps: "25", inputPlaceholder: "-", editableWeight: true }
                        ]
                    }
                },
                {
                    id: `w${w}-d1-e5`,
                    name: "Dragon Flags",
                    sets: 3,
                    target: { type: "failure", reps: "Failure" },

                }
            ]
        });

        // TUESDAY (Legs)
        days.push({
            dayName: "Tuesday - Legs",
            dayOfWeek: 2,
            exercises: [
                { id: `w${w}-d2-e1`, name: "Walking Lunges", sets: 3, target: { type: "range", reps: "10-15" } },
                { id: `w${w}-d2-e2`, name: "Heels-Off Narrow Leg Press", sets: 3, target: { type: "range", reps: "10-15" } },
                { id: `w${w}-d2-e3`, name: "Reverse Nordic Curls", sets: 2, target: { type: "failure", reps: "Failure" } },
                { id: `w${w}-d2-e4`, name: "Single-Leg Machine Hip Thrust", sets: 3, target: { type: "range", reps: "10-15" } },
                { id: `w${w}-d2-e5`, name: "Nordic Curls", sets: 3, target: { type: "failure", reps: "Failure" } },
                { id: `w${w}-d2-e6`, name: "Hack Squat Calf Raises", sets: 3, target: { type: "range", reps: "15-20" } },
                { id: `w${w}-d2-e7`, name: "Hip Adduction", sets: 2, target: { type: "range", reps: "8-12" } }
            ]
        });

        // WEDNESDAY
        days.push({
            dayName: "Wednesday - Volume Hypertrophy",
            dayOfWeek: 3,
            exercises: [
                {
                    id: `w${w}-d3-e1`,
                    name: "Paused Bench Press",
                    sets: 4,
                    target: { type: "range", reps: "8-10", percentage: wedBenchPerc, percentageRef: "pausedBench" }
                },
                {
                    id: `w${w}-d3-e2`,
                    name: "Spoto Press",
                    sets: 3,
                    target: { type: "straight", reps: "5", percentage: 0.725, percentageRef: "spotoPress" },

                },
                {
                    id: `w${w}-d3-e3`,
                    name: "Weighted Pull-ups",
                    sets: 0,
                    target: { type: "range", reps: pullupReps },

                },
                {
                    id: `w${w}-d3-e4`,
                    name: "Y-Raises",
                    sets: 5,
                    target: { type: "range", reps: "12-15" },

                },
                {
                    id: `w${w}-d3-e5`,
                    name: "Around-the-Worlds",
                    sets: 3,
                    target: { type: "range", reps: "12-15" },

                }
            ]
        });

        // THURSDAY
        days.push({
            dayName: "Thursday - Power / Speed",
            dayOfWeek: 4,
            exercises: [
                {
                    id: `w${w}-d4-e1`,
                    name: "Paused Bench Press",
                    sets: 5,
                    target: { type: "range", reps: "3-5", percentage: 0.775, percentageRef: "pausedBench" },
                    notes: "Explosive"
                },
                {
                    id: `w${w}-d4-e2`,
                    name: "Low Pin Press",
                    sets: 2,
                    target: { type: "straight", reps: "4", percentage: 0.775, percentageRef: "lowPinPress" },

                },
                {
                    id: `w${w}-d4-e3`,
                    name: "Behind-the-Neck Press",
                    sets: 4,
                    target: { type: "range", reps: "5-8" }, // Volume Day logic
                    notes: "Volume Work"
                },
                {
                    id: `w${w}-d4-e4`,
                    name: "Tricep Giant Set",
                    sets: giantSets,
                    target: { type: "failure", reps: "Giant" },
                    notes: "Same protocol.",
                    giantSetConfig: {
                        steps: [
                            { name: "Bodyweight Dips", targetReps: "5", inputPlaceholder: "-" },
                            { name: "Rolling DB Tricep Extensions", targetReps: "12", inputPlaceholder: "-", editableWeight: true },
                            { name: "Banded EZ Bar Skullcrushers", targetReps: "25", inputPlaceholder: "-", editableWeight: true }
                        ]
                    }
                },
                {
                    id: `w${w}-d4-e5`,
                    name: "Dragon Flags",
                    sets: 3,
                    target: { type: "failure", reps: "Failure" }
                }
            ]
        });

        // FRIDAY (Legs Copy)
        days.push({
            dayName: "Friday - Legs",
            dayOfWeek: 5,
            exercises: days[1].exercises.map(e => ({ ...e, id: e.id.replace('d2', 'd5') }))
        });

        // SATURDAY (TEST)
        days.push({
            dayName: "Saturday - AMRAP Test",
            dayOfWeek: 6,
            exercises: [
                {
                    id: `w${w}-d6-e1`,
                    name: "Paused Bench Press (AMRAP)",
                    sets: 1,
                    target: { type: "amrap", reps: "AMRAP", percentage: 0.675, percentageRef: "pausedBench" },

                },
                {
                    id: `w${w}-d6-e2`,
                    name: "Paused Bench Press (Back-off)",
                    sets: 3,
                    target: { type: "straight", reps: "5", percentage: 0.675, percentageRef: "pausedBench" },

                },
                {
                    id: `w${w}-d6-e3`,
                    name: "Wide-Grip Bench Press",
                    sets: 3,
                    target: { type: "range", reps: "6-8", percentage: 0.675, percentageRef: "wideGripBench" },

                },
                {
                    id: `w${w}-d6-e4`,
                    name: "Weighted Pull-ups",
                    sets: 0,
                    target: { type: "range", reps: pullupReps },

                },
                {
                    id: `w${w}-d6-e5`,
                    name: "High-Elbow Facepulls",
                    sets: 3,
                    target: { type: "range", reps: "15-20" },

                }
            ]
        });

        // SUNDAY (Rest Day)
        days.push({
            dayName: "Sunday - Rest",
            dayOfWeek: 7,
            exercises: []
        });

        weeks.push({ weekNumber: w, days });
    }
    return weeks;
};

const getPausedBenchBase = (user: UserProfile, context?: { week: number }) => {
    if (!user.stats.pausedBench) return 0;

    let currentBase = user.stats.pausedBench;

    if (user.benchHistory && user.benchHistory.length > 0) {
        const sortedAMRAPs = [...user.benchHistory].sort((a, b) => {
            return (a.week || 0) - (b.week || 0);
        });

        let consecutiveStalls = 0;
        for (const entry of sortedAMRAPs) {
            // Filter out future entries relative to context
            if (context && entry.week && entry.week >= context.week) continue;

            const reps = entry.actualReps || 0;
            if (reps >= 12) {
                currentBase += 5.0;
                consecutiveStalls = 0;
            } else if (reps >= 8) {
                currentBase += 2.5;
                consecutiveStalls = 0;
            } else {
                consecutiveStalls++;
            }
        }
    }
    return currentBase;
};

export const BENCH_DOMINATION_PROGRAM: Program = {
    id: "bench-domination",
    name: "Bench Domination",
    weeks: createWeeks()
};

export const BENCH_DOMINATION_CONFIG: PlanConfig = {
    id: BENCH_DOMINATION_PROGRAM.id,
    program: BENCH_DOMINATION_PROGRAM,
    ui: {
        dashboardWidgets: ['1rm', 'program_status', 'strength_chart']
    },
    hooks: {
        preprocessDay: (day, user) => {
            const weekNum = parseInt(day.exercises[0]?.id.split('-')[0].replace('w', '') || "1");
            // 1. Reactive Deload Check
            // "two consecutive Saturday AMRAPs ≤7 reps → next week = automatic 10–15% weight drop + half volume"
            let applyReactiveDeload = false;
            if (user.benchHistory && user.benchHistory.length >= 2) {
                const amraps = user.benchHistory
                    .filter(h => h.actualReps !== undefined)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                // Need strictly Saturday AMRAPs? The history usually logs standard AMRAPs.
                // Assuming filtered by 'Paused Bench Press' usually.
                if (amraps.length >= 2) {
                    const r1 = amraps[0].actualReps ?? 10;
                    const r2 = amraps[1].actualReps ?? 10;
                    if (r1 <= 7 && r2 <= 7) {
                        applyReactiveDeload = true;
                    }
                }
            }

            let processedDay = { ...day };

            if (applyReactiveDeload) {
                processedDay.dayName += " (Reactive Deload)";
                processedDay.exercises = processedDay.exercises.map(ex => ({
                    ...ex,
                    sets: Math.max(1, Math.floor(ex.sets / 2)),
                    target: {
                        ...ex.target,
                        percentage: ex.target.percentage ? ex.target.percentage * 0.85 : undefined,
                        weightAbsolute: ex.target.weightAbsolute ? ex.target.weightAbsolute * 0.85 : undefined
                    },
                    notes: (ex.notes || "") + " [DELOAD: -15% Weight, Half Volume]"
                }));
            }

            // 2. Module Filtering
            const modules = user.benchDominationModules || {
                tricepGiantSet: true,
                behindNeckPress: false,
                weightedPullups: true,
                accessories: true,
                legDays: true
            };

            // Leg Day Exclusion Logic
            // If Leg Days are disabled, we wipe exercises from Day 2 (Tue) and Day 5 (Fri).
            const isLegDay = day.dayOfWeek === 2 || day.dayOfWeek === 5;
            if (!modules.legDays) {
                if (isLegDay) {
                    processedDay.exercises = [];
                    processedDay.dayName = day.dayName.replace("Legs", "Rest");
                }
            }

            // Smart Day Assignment for Custom Schedules
            if (user.selectedDays && user.selectedDays.length > 0) {
                // Build list of workouts to assign (filter out legs if disabled)
                const workoutsToAssign = [
                    { originalDay: 1, type: 'heavy', needsRest: true, name: 'Heavy Strength' },
                    ...(modules.legDays ? [{ originalDay: 2, type: 'legs', needsRest: false, name: 'Legs' }] : []),
                    { originalDay: 3, type: 'volume', needsRest: false, name: 'Volume Hypertrophy' },
                    { originalDay: 4, type: 'power', needsRest: false, name: 'Power / Speed' },
                    ...(modules.legDays ? [{ originalDay: 5, type: 'legs', needsRest: false, name: 'Legs' }] : []),
                    { originalDay: 6, type: 'test', needsRest: true, name: 'AMRAP Test' }
                ];

                // Analyze user's selected days to find consecutive and isolated days
                const sorted = [...user.selectedDays].sort((a, b) => a - b);
                const consecutiveBlocks: number[][] = [];
                const isolatedDays: number[] = [];

                sorted.forEach((d, i) => {
                    const prev = sorted[i - 1];
                    const next = sorted[i + 1];
                    const hasConsecutiveBefore = prev === d - 1;
                    const hasConsecutiveAfter = next === d + 1;

                    if (hasConsecutiveBefore || hasConsecutiveAfter) {
                        // Part of consecutive block
                        if (!hasConsecutiveBefore) {
                            // Start of new consecutive block
                            consecutiveBlocks.push([d]);
                        } else {
                            // Continue existing block
                            consecutiveBlocks[consecutiveBlocks.length - 1].push(d);
                        }
                    } else {
                        // Isolated day
                        isolatedDays.push(d);
                    }
                });

                // Create mapping: originalDay -> selectedDay
                const dayMapping: Record<number, number> = {};

                // Strategy: Assign workouts needing rest to isolated days first
                const needsRestWorkouts = workoutsToAssign.filter(w => w.needsRest);
                const consecutiveWorkouts = workoutsToAssign.filter(w => !w.needsRest);

                // Assign rest-needing workouts to isolated days
                needsRestWorkouts.forEach((workout, i) => {
                    if (isolatedDays[i] !== undefined) {
                        dayMapping[workout.originalDay] = isolatedDays[i];
                    }
                });

                // Assign consecutive workouts to consecutive blocks
                let consecutiveIndex = 0;
                const flatConsecutiveDays = consecutiveBlocks.flat();
                consecutiveWorkouts.forEach(workout => {
                    if (flatConsecutiveDays[consecutiveIndex] !== undefined) {
                        dayMapping[workout.originalDay] = flatConsecutiveDays[consecutiveIndex];
                        consecutiveIndex++;
                    }
                });

                // Fill any remaining unmapped workouts with remaining days
                const usedDays = new Set(Object.values(dayMapping));
                const remainingSelectedDays = sorted.filter(d => !usedDays.has(d));
                const unmappedWorkouts = workoutsToAssign.filter(w => !dayMapping[w.originalDay]);
                unmappedWorkouts.forEach((workout, i) => {
                    if (remainingSelectedDays[i] !== undefined) {
                        dayMapping[workout.originalDay] = remainingSelectedDays[i];
                    }
                });

                // Apply the mapping: check if current day should show a different workout
                const mappedOriginalDay = Object.entries(dayMapping).find(([_orig, selectedDay]) =>
                    parseInt(selectedDay as any) === day.dayOfWeek
                )?.[0];

                if (mappedOriginalDay) {
                    const originalDayNum = parseInt(mappedOriginalDay);
                    if (originalDayNum !== day.dayOfWeek) {
                        // Fetch the workout from the original day
                        const weekData = BENCH_DOMINATION_PROGRAM.weeks.find(w => w.weekNumber === weekNum);
                        const originalDayData = weekData?.days.find((d: WorkoutDay) => d.dayOfWeek === originalDayNum);
                        if (originalDayData) {
                            processedDay.exercises = originalDayData.exercises;
                            processedDay.dayName = originalDayData.dayName;
                        }
                    }
                } else if (!user.selectedDays.includes(day.dayOfWeek)) {
                    // This day is not selected - mark as rest
                    processedDay.exercises = [];
                    processedDay.dayName = "Rest Day";
                }
            }

            processedDay.exercises = processedDay.exercises.filter(ex => {
                if (ex.name === "Tricep Giant Set" && !modules.tricepGiantSet) return false;
                if (ex.name === "Behind-the-Neck Press" && !modules.behindNeckPress) return false;
                if (ex.name === "Weighted Pull-ups" && !modules.weightedPullups) return false;
                if (["Dragon Flags", "Y-Raises", "Around-the-Worlds"].includes(ex.name) && !modules.accessories) return false;
                return true;
            });

            // 3. Exercise Specific Logic (Warmups, BTN, Swap)
            processedDay.exercises = processedDay.exercises.map(ex => {
                const round = (w: number) => Math.floor(w / 2.5) * 2.5;

                // A. Warm-up Sets
                // Targeting "Paused Bench Press" and "Paused Bench Press (AMRAP)"
                if (ex.name === "Paused Bench Press" || ex.name === "Paused Bench Press (AMRAP)") {
                    let targetLoad = 0;
                    if (ex.target.percentageRef === 'pausedBench') {
                        // Standard calc
                        const currentBase = getPausedBenchBase(user, { week: weekNum });
                        const perc = ex.target.percentage || 1;
                        targetLoad = currentBase * perc;
                    } else if (ex.target.weightAbsolute) {
                        targetLoad = ex.target.weightAbsolute;
                    }

                    if (targetLoad > 0) {
                        const warmupSets: { reps: string; weight: string; completed: boolean }[] = [];

                        // Set 1: 12 reps @ 20kg (Empty Bar)
                        warmupSets.push({ reps: "12", weight: "20", completed: false });

                        // Set 2: 8 reps
                        let set2Weight = 0;
                        if (targetLoad >= 100) {
                            set2Weight = 60;
                        } else {
                            set2Weight = Math.floor(targetLoad * 0.40);
                            // Ensure it's not below 20? The prompt says "40% of weight rounded down".
                            // If load is 40kg, 40% is 16kg. Let's floor it but keep it logical?
                            // Usually you don't go below empty bar. Let's assume min 20 or plate logic.
                            // But strictly following prompt: "40% of weight rounded down".
                            // I'll stick to prompt but ensure it's at least 20 if user can lift 20.
                            if (set2Weight < 20) set2Weight = 20;
                        }
                        // Rounding set 2 to nearest plate/logical increment? Prompt only says "rounded down".
                        // Assuming integer or 2.5 step? "rounded down" usually means integer.
                        // I'll apply standard gym rounding (2.5) for consistency if not specified "integer".
                        set2Weight = round(set2Weight);
                        warmupSets.push({ reps: "8", weight: set2Weight.toString(), completed: false });

                        // Progression to 90%
                        const target90 = round(targetLoad * 0.90);
                        const startProg = set2Weight;
                        const gap = target90 - startProg;

                        // Set 3 (5 reps) & Set 4 (3 reps) - Interpolate
                        // Jump roughly gap / 3
                        const jump = gap / 3;
                        const set3Weight = round(startProg + jump);
                        const set4Weight = round(startProg + (jump * 2));

                        warmupSets.push({ reps: "5", weight: set3Weight.toString(), completed: false });
                        warmupSets.push({ reps: "3", weight: set4Weight.toString(), completed: false });

                        // Set 5+ (1 rep)
                        if (targetLoad <= 120) {
                            // "Finally 90% ... for 1 rep"
                            warmupSets.push({ reps: "1", weight: target90.toString(), completed: false });
                        } else {
                            // "Progress from the 3 rep warm up set to 90% in 10kg jumps, all for 1 rep"
                            let current = set4Weight + 10;
                            // Just in case set4Weight + 10 > target90 (unlikely with >120kg load, but good to be safe)
                            while (current <= target90) {
                                warmupSets.push({ reps: "1", weight: round(current).toString(), completed: false });
                                if (current >= target90) break; // Reached target
                                current += 10;
                                // If next step overshoots significantly? 
                                // "in 10kg jumps". If target is 125 (90% of ~139). Set 4 might be 90.
                                // 100, 110, 120, 130(stop). 
                                // Should we hit exact 90% at end? "progress ... to 90%".
                                // If last jump is small, just do target90?
                                // Let's strictly do +10s up to target. 
                                // If the last increment creates a step > target90, we cap it or add the final set?
                                // "Finally 90% working weight for 1 rep" applies to the general logic, 
                                // but >120kg logic overrides "how" we get there.
                                // I will ensure the last set IS target90.
                            }
                            // If the loop didn't land exactly on target90 (e.g. ended at target90-5), add it?
                            // Using a small tolerance
                            const lastAdded = parseFloat(warmupSets[warmupSets.length - 1].weight);
                            if (lastAdded < target90) {
                                warmupSets.push({ reps: "1", weight: target90.toString(), completed: false });
                            }
                        }

                        ex.warmups = { sets: warmupSets };
                    }
                }

                // BTN Warmups
                if (ex.name === "Behind-the-Neck Press") {
                    // Previous BTN Logic maintained but refactored into this map block to avoid duplicate overrides
                    let targetLoad = 0;
                    // Calculate BTN Target Load
                    const monWeight = Math.floor((user.stats.pausedBench * 0.40) / 2.5) * 2.5;
                    if (day.dayOfWeek === 1) { // Monday
                        targetLoad = monWeight;
                    } else { // Thursday
                        // Approx Check: if day 4 is volume
                        const thuWeight = Math.floor((monWeight * 0.85) / 2.5) * 2.5;
                        targetLoad = thuWeight;
                    }

                    const startWeight = 20;
                    const gap = Math.max(0, targetLoad - startWeight);

                    if (day.dayOfWeek === 1) { // Monday - 3 Warmups
                        ex.warmups = {
                            sets: [
                                { reps: "10", weight: "20 (Empty Bar)", completed: false },
                                { reps: "5", weight: round(startWeight + (gap * 0.40)).toString(), completed: false },
                                { reps: "3", weight: round(startWeight + (gap * 0.75)).toString(), completed: false },
                            ]
                        };
                    } else { // Thursday - 2 Warmups
                        ex.warmups = {
                            sets: [
                                { reps: "10", weight: "20 (Empty Bar)", completed: false },
                                { reps: "5", weight: round(startWeight + (gap * 0.60)).toString(), completed: false },
                            ]
                        };
                    }
                }

                // C. BTN Specific Configuration (Sets/Reps/Weight) - Moved logic for clarity
                if (ex.name === "Behind-the-Neck Press") {
                    // Monday
                    if (day.dayOfWeek === 1) {
                        ex.sets = 4;
                        ex.target.reps = "3-5";
                        const w = Math.floor((user.stats.pausedBench * 0.40) / 2.5) * 2.5;
                        ex.target.weightAbsolute = w;
                        ex.notes = "Start here. +2.5kg if all sets 5 reps.";
                    }
                    // Thursday
                    if (day.dayOfWeek === 4) {
                        ex.sets = 4;
                        ex.target.reps = "5-8";
                        const monW = Math.floor((user.stats.pausedBench * 0.40) / 2.5) * 2.5;
                        const thuW = Math.floor((monW * 0.85) / 2.5) * 2.5;
                        ex.target.weightAbsolute = thuW;
                        ex.notes = "Volume Day. +2.5kg if all sets 8 reps.";
                    }
                }

                // D. Y-Raises / Facepulls Swap
                if (ex.name === "Y-Raises") {
                    ex.sets = 3;
                    ex.alternates = ["High-Elbow Facepulls"];

                    const pref = user.exercisePreferences?.['y-raise-variant'];
                    if (pref === "High-Elbow Facepulls") {
                        return {
                            ...ex,
                            id: ex.id + "-fp",
                            name: "High-Elbow Facepulls",
                            sets: 3,
                            target: { type: "range", reps: "15-20" },
                            alternates: ["Y-Raises"]
                        };
                    }
                }

                return ex;
            });


            // 3. Post-Week 12 Logic
            // If viewing Week 13-15, check user choice.
            // Assuming we determine "Current Week" context from the day being processed? 

            if (weekNum > 12) {
                // Mandatory Deload Logic: "After week 12 completion -> mandatory 7-10 day full deload"
                // How do we enforce time? We can't easily. We just show text.
                // If User chose 'test', Week 13 becomes "Max Test Day".
                // If User chose 'peak', Week 13-15 are shown (already generated).

                const choice = user.benchDominationStatus?.post12WeekChoice;

                if (choice === 'test') {
                    // User wants to test immediately.
                    // If this is Week 13, show Test Day.
                    // If Week 14+, show nothing/reset?
                    if (weekNum === 13) {
                        // Override Week 13 content to be a simple Test Day
                        if (day.dayOfWeek === 6) { // Saturday
                            processedDay.dayName = "TEST DAY";
                            processedDay.exercises = [{
                                id: `w13-d6-test`,
                                name: "Paused Bench Press (1RM TEST)",
                                sets: 1,
                                target: { type: "straight", reps: "1", percentage: 1.05, percentageRef: "pausedBench" },
                                notes: "Go for it."
                            }];
                        } else {
                            // Rest days
                            processedDay.exercises = [];
                            processedDay.dayName = "Rest / Prep";
                        }
                    } else {
                        // Week 14/15 should be empty if 'test' selected? Or we just guide them to finish?
                    }
                }
            }

            return processedDay;
        },

        calculateWeight: (target: SetTarget, user: UserProfile, exerciseName?: string, context?: { week: number; day: number }) => {
            // 0. Absolute Weight
            if (target.weightAbsolute) return target.weightAbsolute.toString();

            // 1. Paused Bench Special AMRAP Logic
            if (target.percentageRef === 'pausedBench' && user.stats.pausedBench) {
                const currentBase = getPausedBenchBase(user, context ? { week: context.week } : undefined);
                const perc = target.percentage || 1;
                // Reactive Deload applied in preprocessDay via percentage modification, so we just use target.percentage
                const raw = currentBase * perc;
                return (Math.round(raw / 2.5) * 2.5).toString();
            }

            // 2. Behind-the-Neck Press Auto-Progression
            if (exerciseName === "Behind-the-Neck Press" && context) {
                // Base weight calculation (Monday Heavy)
                let baseWeight = 0;

                if (user.stats.btnPress) {
                    baseWeight = user.stats.btnPress;
                } else if (user.stats.pausedBench) {
                    // Initial seed: 40% of Bench, rounded down
                    baseWeight = Math.floor((user.stats.pausedBench * 0.40) / 2.5) * 2.5;
                }

                // If Monday (Day 1), return Base
                if (context.day === 1) {
                    return baseWeight.toString();
                }

                // If Thursday (Day 4/5 depending on schedule?), checks Day 4 in program structure
                // Just check difference?
                // Or assume usually Volume day is lighter. 
                // Program structure: Mn (Heavy), Thu (Volume).
                // Let's assume if not Day 1, it's volume.
                if (context.day !== 1) {
                    return (Math.floor((baseWeight * 0.85) / 2.5) * 2.5).toString();
                }

                return baseWeight.toString();
            }

            // 3. Pullups Logic
            if (exerciseName?.includes("Pull-ups") && context) {
                const { week } = context;
                if (week >= 1 && week <= 3) return "2.5";
                if (week >= 4 && week <= 6) return "15";
            }

            return undefined;
        },
        getExerciseAdvice: (exercise, history) => {
            // 1. Giant Set Check
            if (exercise.giantSetConfig) {
                if (exercise.name === 'Tricep Giant Set' && history.length > 0) {
                    const lastLog = history[0];
                    if (lastLog.setResults) {
                        const sets = lastLog.setResults;
                        for (let i = sets.length - 1; i >= 0; i--) {
                            if ((i % 3) === 2) {
                                if (sets[i].reps >= 25) return "Increase Weight!";
                                break;
                            }
                        }
                    }
                }
            }

            // 2. BTN Progression Advice (Visual only, actual weight calc should happen on save)
            // But here we calculate based on logs for Advice?
            if (exercise.name === "Behind-the-Neck Press" && history.length > 0) {
                const lastLog = history[0];
                const targetReps = exercise.target.reps.split("-").map(Number);
                const topRep = targetReps[1] || targetReps[0];
                const bottomRep = targetReps[0];

                // "Hit top of rep range on all 4 sets → +5 lb / +2.5 kg"
                if (lastLog.setResults) {
                    const allTop = lastLog.setResults.slice(0, exercise.sets).every(s => s.reps >= topRep);
                    if (allTop) return "Increase Weight (+2.5kg)!";

                    // "Miss bottom of range on 2+ sets"
                    const failedBottom = lastLog.setResults.filter(s => s.reps < bottomRep).length >= 2;
                    if (failedBottom) return "Keep Weight";
                }
            }

            // 3. Standard Progression Check
            if (exercise.target.type === 'range') {
                const rangeParts = exercise.target.reps.split("-");
                const maxRep = rangeParts.length > 1 ? parseInt(rangeParts[1]) : parseInt(rangeParts[0]);

                if (!isNaN(maxRep) && history.length > 0) {
                    const lastLog = history[0];
                    // Only check if sufficient sets recorded
                    if (lastLog.setResults && lastLog.setResults.length >= exercise.sets) {
                        const relevantSets = lastLog.setResults.slice(0, exercise.sets);
                        const allHit = relevantSets.every((s: any) => s.reps >= maxRep);
                        if (allHit) return "Increase Weight!";
                    }
                }
            }

            return null;
        }
    }
};
