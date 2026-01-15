import type { Program, ProgramWeek, WorkoutDay, PlanConfig, UserProfile, SetTarget, Exercise, LiftingStats } from '../types';

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

            days.push({ dayName: isWeek15 ? "t:dayNames.mondayPrimer" : "t:dayNames.mondayPeaking", dayOfWeek: 1, exercises: d1Exercises });

            // Day 2: Legs (Maintenance)
            days.push({
                dayName: "t:dayNames.tuesdayLegsMaintenance",
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
            days.push({ dayName: "t:dayNames.wednesdayLightSpeed", dayOfWeek: 3, exercises: d3Exercises });

            // Day 4: Power (Skipped or very light)
            days.push({
                dayName: "t:dayNames.thursdayRest",
                dayOfWeek: 4,
                exercises: isWeek15 ? [] : [
                    { id: `w${w}-d4-e1`, name: "Behind-the-Neck Press", sets: 3, target: { type: "range", reps: "8-10" }, notes: "Light & Crisp" }
                ]
            });

            // Day 5: Legs Copy
            days.push({ dayName: "t:dayNames.fridayLegs", dayOfWeek: 5, exercises: days[1].exercises });

            // Day 6: Test / Light Technique
            const d6Exercises: Exercise[] = [];
            if (isWeek15) {
                // Week 15: Pure 1RM Test Day
                d6Exercises.push({
                    id: `w${w}-d6-e1`,
                    name: "Paused Bench Press (1RM TEST)",
                    sets: 1,
                    target: { type: "straight", reps: "1", percentage: 1.05, percentageRef: "pausedBench" },
                    notes: "Warm up well. Go for PR. DOMINATE."
                });
            } else if (isWeek13) {
                // Week 13: Light Technique Day - 4×3 @ 60-70%
                d6Exercises.push({
                    id: `w${w}-d6-e1`,
                    name: "Paused Bench Press",
                    sets: 4,
                    target: { type: "straight", reps: "3", percentage: 0.65, percentageRef: "pausedBench" },
                    notes: "Peaking phase – light technique for confidence, no AMRAP fatigue. Save energy for heavy days and test. Focus: explosive, perfect form, RPE 6-7."
                });
            } else {
                // Week 14: Very Light Technique - 2-3×2-3 @ 60%
                d6Exercises.push({
                    id: `w${w}-d6-e1`,
                    name: "Paused Bench Press",
                    sets: 3,
                    target: { type: "range", reps: "2-3", percentage: 0.60, percentageRef: "pausedBench" },
                    notes: "Peaking phase – light technique for confidence, no AMRAP fatigue. Save energy for heavy days and test. Optional: focus speed/form or full rest."
                });
            }
            days.push({ dayName: isWeek15 ? "t:dayNames.saturdayJudgmentDay" : "t:dayNames.saturdayLightTechnique", dayOfWeek: 6, exercises: d6Exercises });

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
            dayName: "t:dayNames.mondayHeavyStrength",
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
            dayName: "t:dayNames.tuesdayLegs",
            dayOfWeek: 2,
            exercises: [
                { id: `w${w}-d2-e1`, name: "Walking Lunges", sets: 3, target: { type: "range", reps: "10-15" } },
                { id: `w${w}-d2-e2`, name: "Heels-Off Narrow Leg Press", sets: 3, target: { type: "range", reps: "10-15" } },
                { id: `w${w}-d2-e3`, name: "Reverse Nordic Curls", sets: 2, target: { type: "failure", reps: "Failure" } },
                { id: `w${w}-d2-e4`, name: "Single-Leg Machine Hip Thrust", sets: 3, target: { type: "range", reps: "10-15" } },
                { id: `w${w}-d2-e5`, name: "Nordic Curls", sets: 3, target: { type: "failure", reps: "Failure" }, alternates: ["Glute-Ham Raise"] },
                { id: `w${w}-d2-e6`, name: "Hack Squat Calf Raises", sets: 3, target: { type: "range", reps: "15-20" } },
                { id: `w${w}-d2-e7`, name: "Hip Adduction", sets: 2, target: { type: "range", reps: "8-12" } }
            ]
        });

        // WEDNESDAY
        days.push({
            dayName: "t:dayNames.wednesdayVolumeHypertrophy",
            dayOfWeek: 3,
            exercises: [
                {
                    id: `w${w}-d3-e1`,
                    name: "Paused Bench Press",
                    sets: 4,
                    target: { type: "range", reps: "8-10", percentage: wedBenchPerc, percentageRef: "pausedBench" },
                    notes: "t:tips.pausedBenchWednesday"
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
                    target: { type: "range", reps: "4-16" },
                    alternates: ["Power Hanging Leg Raises"]
                }
            ]
        });

        // THURSDAY
        days.push({
            dayName: "t:dayNames.thursdayPowerSpeed",
            dayOfWeek: 4,
            exercises: [
                {
                    id: `w${w}-d4-e1`,
                    name: "Paused Bench Press",
                    sets: 5,
                    target: { type: "range", reps: "3-5", percentage: 0.775, percentageRef: "pausedBench" },
                    notes: "t:tips.explosiveThursday"
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
            dayName: "t:dayNames.fridayLegs",
            dayOfWeek: 5,
            exercises: days[1].exercises.map(e => ({ ...e, id: e.id.replace('d2', 'd5') }))
        });

        // SATURDAY (TEST)
        days.push({
            dayName: "t:dayNames.saturdayAMRAPTest",
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
                    name: "Y-Raises",
                    sets: 3,
                    target: { type: "range", reps: "12-15" },

                }
            ]
        });

        // SUNDAY (Rest Day)
        days.push({
            dayName: "t:dayNames.sundayRest",
            dayOfWeek: 7,
            exercises: []
        });

        weeks.push({ weekNumber: w, days });
    }
    return weeks;
};

// Helper function to get rep threshold based on week (phased progression)
const getRepThresholdForWeek = (week: number): number => {
    if (week >= 13) return 6;  // Peaking weeks 13-15: ≥6 reps
    if (week >= 10) return 8;  // Weeks 10-12: ≥8 reps
    if (week >= 7) return 10;  // Weeks 7-9: ≥10 reps
    return 12;                  // Weeks 1-6: ≥12 reps
};

/**
 * Safe rounding to nearest 2.5 kg with +2.5 kg upward cap.
 * Ensures we never round up more than +2.5 kg above raw calculated value.
 * - If raw is 134.375 kg → nearest is 135 kg (up +0.625 kg OK)
 * - If raw is 134.9 kg → nearest is 135 kg (up +0.1 kg OK)
 * - If raw is 135.1 kg → 135 kg (down, not up)
 */
const roundToNearest2_5WithCap = (rawWeight: number): number => {
    // Calculate nearest 2.5 kg (standard rounding)
    const nearestRounded = Math.round(rawWeight / 2.5) * 2.5;

    // Check if we're rounding up more than 2.5 kg
    const difference = nearestRounded - rawWeight;

    if (difference > 2.5) {
        // Safety cap: if rounding up by more than 2.5 kg, round down instead
        return Math.floor(rawWeight / 2.5) * 2.5;
    }

    // If difference is positive but <= 2.5 kg, OK to round up
    // If difference is negative or zero, we're rounding down (always OK)
    return nearestRounded;
};

/**
 * Round DOWN to nearest 2.5 kg (for e1RM base calculations)
 */
const roundDownToNearest2_5 = (weight: number): number => {
    return Math.floor(weight / 2.5) * 2.5;
};

/**
 * Round UP to nearest 2.5 kg (for Volume/AMRAP days to show clear progression)
 * Used on Wednesday and Saturday to ensure visible weight increases after successful AMRAPs.
 */
const roundUpToNearest2_5 = (weight: number): number => {
    return Math.ceil(weight / 2.5) * 2.5;
};

/**
 * Calculate e1RM using Epley formula: weight × (1 + reps/30)
 */
const calculateE1RM = (weight: number, reps: number): number => {
    if (reps <= 0) return weight;
    return weight * (1 + reps / 30);
};

/**
 * Get Paused Bench Base Weight with complete overhaul:
 * - Base weight (pausedBench) starts from user onboarding 1RM
 * - AMRAP progression: phased thresholds determine +2.5 kg increases
 * - e1RM re-calculation every 4 weeks (end of week 4, 8, 12) using Epley formula
 * - New base = e1RM rounded DOWN to nearest 2.5 kg
 * - Peaking block (weeks 13-15): uses final w12 re-calc e1RM
 * 
 * NOTE: benchHistory.weight contains CALCULATED e1RM (from Epley)
 *       benchHistory.actualWeight contains the ACTUAL weight lifted in AMRAP
 *       benchHistory.actualReps contains the actual reps performed
 * 
 * OLD SYSTEM REMOVED: No direct jumps from onboarding weight, no old rounding rules.
 * All progress driven by AMRAP and phased thresholds.
 */
const getPausedBenchBase = (user: UserProfile, context?: { week: number }): number => {
    if (!user.stats.pausedBench) return 0;

    // Start with onboarding 1RM
    let currentBase = user.stats.pausedBench;
    const currentWeek = context?.week || 1;

    console.log(`[BASE CALC] Starting calculation for week ${currentWeek}, initial base: ${currentBase} kg`);

    if (!user.benchHistory || user.benchHistory.length === 0) {
        console.log(`[BASE CALC] No benchHistory, returning initial base: ${currentBase} kg`);
        return currentBase;
    }

    // Sort by week ascending and filter to only weeks before current
    const sortedAMRAPs = [...user.benchHistory]
        .filter(entry => entry.week !== undefined && entry.week !== null && entry.week < currentWeek)
        .sort((a, b) => (a.week || 0) - (b.week || 0));

    console.log(`[BASE CALC] Found ${sortedAMRAPs.length} AMRAP entries before week ${currentWeek}`);

    // Track which weeks we've processed to avoid duplicates
    const processedWeeks = new Set<number>();

    // e1RM recalculation checkpoints: at the START of weeks 5, 9, 13 (after completing 4, 8, 12)
    // We recalculate based on the AMRAP from the checkpoint week (4, 8, 12)
    const e1rmCheckpoints = [
        { afterWeek: 4, forWeeksFrom: 5 },
        { afterWeek: 8, forWeeksFrom: 9 },
        { afterWeek: 12, forWeeksFrom: 13 }
    ];

    // First, determine if we need an e1RM reset based on current week
    for (const checkpoint of e1rmCheckpoints) {
        if (currentWeek >= checkpoint.forWeeksFrom) {
            // Find the AMRAP from the checkpoint week
            const checkpointEntry = sortedAMRAPs.find(e => e.week === checkpoint.afterWeek);
            if (checkpointEntry && checkpointEntry.actualReps && checkpointEntry.actualWeight) {
                // Calculate e1RM using Epley formula with ACTUAL weight lifted
                const e1RM = calculateE1RM(checkpointEntry.actualWeight, checkpointEntry.actualReps);
                // New base = e1RM rounded DOWN to nearest 2.5 kg
                const newBase = roundDownToNearest2_5(e1RM);

                console.log(`[e1RM RESET] Week ${checkpoint.afterWeek} checkpoint for week ${currentWeek}:`);
                console.log(`[e1RM RESET] AMRAP: ${checkpointEntry.actualWeight}kg × ${checkpointEntry.actualReps} reps`);
                console.log(`[e1RM RESET] e1RM = ${e1RM.toFixed(2)} kg → New base = ${newBase} kg`);

                // Reset base to e1RM
                currentBase = newBase;

                // Now only count progressions AFTER this checkpoint week
                // Clear processed weeks and start fresh from after the checkpoint
                processedWeeks.clear();

                // Mark all weeks up to and including checkpoint as processed (don't count them again)
                for (const entry of sortedAMRAPs) {
                    if ((entry.week || 0) <= checkpoint.afterWeek) {
                        processedWeeks.add(entry.week || 0);
                    }
                }
            }
        }
    }

    // Now apply weekly AMRAP progressions for weeks we haven't processed
    for (const entry of sortedAMRAPs) {
        const entryWeek = entry.week || 0;

        // Skip if we already processed this week
        if (processedWeeks.has(entryWeek)) continue;
        processedWeeks.add(entryWeek);

        const reps = entry.actualReps || 0;

        // Apply weekly AMRAP progression (phased thresholds)
        const threshold = getRepThresholdForWeek(entryWeek);
        if (reps >= threshold) {
            currentBase += 2.5;
            console.log(`[AMRAP PROGRESS] Week ${entryWeek}: ${reps} reps >= ${threshold} threshold → +2.5 kg, base now ${currentBase} kg`);
        } else {
            console.log(`[AMRAP STALL] Week ${entryWeek}: ${reps} reps < ${threshold} threshold → no increase, base stays ${currentBase} kg`);
        }
    }

    console.log(`[BASE CALC] Final base for week ${currentWeek}: ${currentBase} kg`);
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
        dashboardWidgets: ['1rm', 'program_status', 'strength_chart', 'workout_history']
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
                    // Reactive deload trigger: 2 consecutive weeks ≤7 reps
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

                // A. Elite Warm-up Sets for Paused Bench Press
                if (ex.name === "Paused Bench Press" || ex.name === "Paused Bench Press (AMRAP)") {
                    let targetLoad = 0;
                    if (ex.target.percentageRef === 'pausedBench') {
                        const currentBase = getPausedBenchBase(user, { week: weekNum });
                        const perc = ex.target.percentage || 1;
                        targetLoad = currentBase * perc;
                    } else if (ex.target.weightAbsolute) {
                        targetLoad = ex.target.weightAbsolute;
                    }

                    if (targetLoad > 0) {
                        const warmupSets: { reps: string; weight: string; completed: boolean }[] = [];
                        const isHeavyDay = day.dayOfWeek === 1 || day.dayOfWeek === 4; // Monday or Thursday

                        // Elite warm-up protocol
                        warmupSets.push({ reps: "8-10", weight: "20", completed: false });
                        const w50 = round(targetLoad * 0.50);
                        warmupSets.push({ reps: "5", weight: w50.toString(), completed: false });
                        const w70 = round(targetLoad * 0.70);
                        warmupSets.push({ reps: "3", weight: w70.toString(), completed: false });
                        const w85 = round(targetLoad * 0.85);
                        warmupSets.push({ reps: "2", weight: w85.toString(), completed: false });

                        if (isHeavyDay) {
                            const w95 = round(targetLoad * 0.95);
                            warmupSets.push({ reps: "1", weight: w95.toString(), completed: false });
                        }

                        ex.warmups = {
                            sets: warmupSets,
                            note: "Minimal fatigue, maximal potentiation. Pause every rep."
                        };
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
                    const currentWeek = weekNum;
                    let baseWeight = 0;

                    // Only use saved btnPress if we're in a week AFTER it was earned
                    if (user.stats.btnPress && user.stats.btnPressWeek !== undefined) {
                        // If current week > btnPressWeek, use the new weight
                        if (currentWeek > user.stats.btnPressWeek) {
                            baseWeight = user.stats.btnPress;
                        } else {
                            // Same week as progression was earned - use seed weight
                            baseWeight = Math.floor((user.stats.pausedBench * 0.40) / 2.5) * 2.5;
                        }
                    } else if (user.stats.btnPress) {
                        // Old data without week tracking - use btnPress
                        baseWeight = user.stats.btnPress;
                    } else if (user.stats.pausedBench) {
                        // No btnPress saved - seed from pausedBench
                        baseWeight = Math.floor((user.stats.pausedBench * 0.40) / 2.5) * 2.5;
                    }

                    // Monday
                    if (day.dayOfWeek === 1) {
                        ex.sets = 4;
                        ex.target.reps = "3-5";
                        ex.target.weightAbsolute = baseWeight;
                        // Tip is in translations as 'behindNeckPressGrip'
                        // Add elite warmups for BTN Press
                        const btnLoad = baseWeight;
                        if (btnLoad > 0) {
                            const warmupSets: { reps: string; weight: string; completed: boolean }[] = [];
                            const isHeavyDay = day.dayOfWeek === 1 || day.dayOfWeek === 4;

                            warmupSets.push({ reps: "8-10", weight: "20", completed: false });
                            const w50 = Math.floor((btnLoad * 0.50 + 1.25) / 2.5) * 2.5;
                            warmupSets.push({ reps: "5", weight: w50.toString(), completed: false });
                            const w70 = Math.floor((btnLoad * 0.70 + 1.25) / 2.5) * 2.5;
                            warmupSets.push({ reps: "3", weight: w70.toString(), completed: false });
                            const w85 = Math.floor((btnLoad * 0.85 + 1.25) / 2.5) * 2.5;
                            warmupSets.push({ reps: "2", weight: w85.toString(), completed: false });

                            if (isHeavyDay) {
                                const w95 = Math.floor((btnLoad * 0.95 + 1.25) / 2.5) * 2.5;
                                warmupSets.push({ reps: "1", weight: w95.toString(), completed: false });
                            }

                            ex.warmups = {
                                sets: warmupSets,
                                note: "Minimal fatigue, maximal potentiation. Pause every rep."
                            };
                        }
                    }
                    // Thursday
                    if (day.dayOfWeek === 4) {
                        ex.sets = 4;
                        ex.target.reps = "5-8";
                        const thuW = Math.floor((baseWeight * 0.85) / 2.5) * 2.5;
                        ex.target.weightAbsolute = thuW;
                        // Tip is in translations as 'behindNeckPressGrip'
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

                // E. Around-the-Worlds / Power Hanging Leg Raises Swap
                if (ex.name === "Around-the-Worlds") {
                    const pref = user.exercisePreferences?.['around-worlds-variant'];
                    if (pref === "Power Hanging Leg Raises") {
                        return {
                            ...ex,
                            id: ex.id + "-phlr",
                            name: "Power Hanging Leg Raises",
                            sets: 3,
                            target: { type: "range", reps: "10-15" },
                            alternates: ["Around-the-Worlds"]
                        };
                    }
                }

                // F. Nordic Curls / Glute-Ham Raise Swap
                if (ex.name === "Nordic Curls") {
                    const pref = user.exercisePreferences?.['nordic-variant'];
                    if (pref === "Glute-Ham Raise") {
                        return {
                            ...ex,
                            id: ex.id + "-ghr",
                            name: "Glute-Ham Raise",
                            sets: 3,
                            target: { type: "failure", reps: "Failure" },
                            alternates: ["Nordic Curls"]
                        };
                    }
                }

                // G. Thursday Tricep Exercise Swap (Giant Set ↔ Heavy Rolling Tricep Extensions)
                if (ex.name === "Tricep Giant Set" && day.dayOfWeek === 4) {
                    const tricepVariant = modules.thursdayTricepVariant || 'giant-set';
                    if (tricepVariant === 'heavy-extensions') {
                        // Replace with Heavy Rolling Tricep Extensions
                        return {
                            ...ex,
                            id: ex.id + "-hrte",
                            name: "Heavy Rolling Tricep Extensions",
                            sets: 4,
                            target: { type: "range", reps: "4-6", percentageRef: undefined },
                            notes: "Heavy tricep option – focusing on lockout strength",
                            giantSetConfig: undefined,
                            alternates: ["Tricep Giant Set"]
                        };
                    } else {
                        // Default: Keep Giant Set but add alternate
                        return {
                            ...ex,
                            alternates: ["Heavy Rolling Tricep Extensions"]
                        };
                    }
                }

                // H. Low Pin Press Extra Set Logic (Swap 1 set from Paused Bench to Low Pin Press)
                // This affects Paused Bench on Thursday and Low Pin Press
                if (modules.lowPinPressExtraSet && day.dayOfWeek === 4) {
                    if (ex.name === "Paused Bench Press") {
                        // Reduce by 1 set (from 5 to 4)
                        return {
                            ...ex,
                            sets: Math.max(1, ex.sets - 1)
                        };
                    }
                    if (ex.name === "Low Pin Press") {
                        // Increase by 1 set (from 2 to 3)
                        return {
                            ...ex,
                            sets: ex.sets + 1
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

        /**
         * Calculate working weight for Paused Bench Press and variations.
         * 
         * NEW SYSTEM (January 2026 Overhaul):
         * - Working weights = % of current base (from getPausedBenchBase)
         * - Round to nearest 2.5 kg with +2.5 kg upward cap for safety
         * - Base is determined by: onboarding 1RM → AMRAP progression → e1RM recalcs every 4 weeks
         * 
         * OLD SYSTEM REMOVED: No direct jumps from onboarding, no old rounding rules.
         */
        calculateWeight: (target: SetTarget, user: UserProfile, exerciseName?: string, context?: { week: number; day: number }) => {
            // 0. Absolute Weight
            if (target.weightAbsolute) return target.weightAbsolute.toString();

            // 1. Paused Bench Press - Complete Overhaul
            if (target.percentageRef === 'pausedBench' && user.stats.pausedBench && context) {
                // Get current base (includes all AMRAP progressions and e1RM recalculations)
                const currentBase = getPausedBenchBase(user, { week: context.week });
                const perc = target.percentage || 1;

                // Calculate raw percentage weight
                const rawWeight = currentBase * perc;

                // Determine rounding strategy based on day:
                // - Monday (day 1) Heavy: nearest rounding (conservative)
                // - Wednesday (day 3) Volume: ceiling rounding (show progression)
                // - Thursday (day 4) Power: nearest rounding (conservative)
                // - Saturday (day 6) AMRAP: ceiling rounding (show progression)
                let finalWeight: number;
                const day = context.day;

                if (day === 3 || day === 6) {
                    // Volume (Wed) and AMRAP (Sat): round UP to show clear progression
                    finalWeight = roundUpToNearest2_5(rawWeight);
                    console.log(`[WEIGHT CALC] Paused Bench (${day === 3 ? 'Volume' : 'AMRAP'}): base ${currentBase} kg × ${(perc * 100).toFixed(1)}% = raw ${rawWeight.toFixed(2)} kg → CEIL ${finalWeight} kg`);
                } else {
                    // Heavy (Mon) and Power (Thu): round to nearest with safety cap
                    finalWeight = roundToNearest2_5WithCap(rawWeight);
                    console.log(`[WEIGHT CALC] Paused Bench (${day === 1 ? 'Heavy' : 'Power'}): base ${currentBase} kg × ${(perc * 100).toFixed(1)}% = raw ${rawWeight.toFixed(2)} kg → NEAREST ${finalWeight} kg`);
                }

                return finalWeight.toString();
            }

            // 2. Bench Press Variations - Detect 1RM vs Working Weight via Ratio
            if (exerciseName && ["Wide-Grip Bench Press", "Spoto Press", "Low Pin Press"].includes(exerciseName) && context) {
                const statMap: Record<string, keyof LiftingStats> = {
                    "Wide-Grip Bench Press": "wideGripBench",
                    "Spoto Press": "spotoPress",
                    "Low Pin Press": "lowPinPress"
                };
                const statKey = statMap[exerciseName];

                // Get reference 1RM for heuristics
                const bench1RM = user.stats.pausedBench || 0;

                if (statKey && user.stats[statKey]) {
                    const storedValue = user.stats[statKey];

                    // Heuristic: If stored value is > 85% of Bench 1RM, it's likely a 1RM (calculate working weight)
                    // If it's <= 85%, it's likely already a working weight (use directly)
                    const threshold = bench1RM > 0 ? bench1RM * 0.85 : 999;

                    if (storedValue > threshold) {
                        // Likely 1RM - convert to working weight using new rounding rules
                        const perc = target.percentage || 1;
                        const rawWeight = storedValue * perc;
                        // Use safe rounding with upward cap for consistency
                        const finalWeight = roundToNearest2_5WithCap(rawWeight);
                        return finalWeight.toString();
                    } else {
                        // Likely Working Weight - use directly
                        return storedValue.toString();
                    }
                }
            }

            // 3. Behind-the-Neck Press Auto-Progression (Monday drives both days)
            if (exerciseName === "Behind-the-Neck Press" && context) {
                let baseWeight = 0;

                console.log(`[BTN CALC] Week ${context.week}, Day ${context.day}`);
                console.log(`[BTN CALC] user.stats.btnPress:`, user.stats.btnPress);
                console.log(`[BTN CALC] user.stats.pausedBench:`, user.stats.pausedBench);

                // Week 1: Seed from pausedBench if btnPress not set
                if (context.week === 1) {
                    if (user.stats.btnPress) {
                        baseWeight = user.stats.btnPress;
                        console.log(`[BTN CALC] Week 1 using saved btnPress: ${baseWeight}`);
                    } else if (user.stats.pausedBench) {
                        // Initial seed: 40% of Bench, rounded down
                        baseWeight = Math.floor((user.stats.pausedBench * 0.40) / 2.5) * 2.5;
                        console.log(`[BTN CALC] Week 1 seeding from pausedBench: ${baseWeight}`);
                    }
                } else {
                    // Week 2+: Use stored value (includes progression)
                    if (user.stats.btnPress) {
                        baseWeight = user.stats.btnPress;
                        console.log(`[BTN CALC] Week 2+ using saved btnPress: ${baseWeight}`);
                    } else if (user.stats.pausedBench) {
                        // Fallback if somehow not saved
                        baseWeight = Math.floor((user.stats.pausedBench * 0.40) / 2.5) * 2.5;
                        console.log(`[BTN CALC] Week 2+ fallback seed: ${baseWeight}`);
                    }
                }

                // Monday returns base weight
                if (context.day === 1) {
                    console.log(`[BTN CALC] Monday returning: ${baseWeight}`);
                    return baseWeight.toString();
                }

                // Thursday returns 85% of Monday's weight
                const thursdayWeight = Math.floor((baseWeight * 0.85) / 2.5) * 2.5;
                console.log(`[BTN CALC] Thursday returning: ${thursdayWeight}`);
                return thursdayWeight.toString();
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

            // 2. Standard Progression Check (exclude auto-progressing exercises)
            const autoProgressExercises = ["Pull-ups", "Behind-the-Neck Press", "Wide-Grip Bench Press", "Spoto Press", "Low Pin Press", "Paused Bench Press"];
            const shouldSkipAdvice = autoProgressExercises.some(name => exercise.name.includes(name));

            if (exercise.target.type === 'range' && !shouldSkipAdvice) {
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

            // 3. Heavy Rolling Tricep Extensions (Thursday variant)
            if (exercise.name === "Heavy Rolling Tricep Extensions" && history.length > 0) {
                const lastLog = history[0];
                if (lastLog.setResults && lastLog.setResults.length >= 4) {
                    // Check if all 4 sets hit 6 reps
                    const allSetsAt6 = lastLog.setResults.slice(0, 4).every((s: any) => s.reps >= 6);
                    if (allSetsAt6) return "All sets at 6 reps – +2.5 kg next Thursday!";
                }
            }

            return null;
        }
    }
};
