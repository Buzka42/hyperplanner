import type { Program, ProgramWeek, WorkoutDay, PlanConfig, Exercise, UserProfile, WorkoutLog, SetTarget } from '../types';

// ============ TRINARY - Conjugate Periodization Powerlifting Program ============
// 27 workouts (9 blocks × 3 workouts per block)
// ME/DE/RE rotation across Bench/Deadlift/Squat

// ============ VARIATION MAPPINGS ============
export const BENCH_VARIATIONS = {
    'off-chest': ['Long Pause Bench Press', 'Wide-Grip Bench Press', 'Spoto Press (1cm above chest)', 'Larsen Press', 'Incline Bench Press'],
    'mid-range': ['Spoto Press (4-8cm)', 'Mid Pin Press', 'Board Press'],
    'lockout': ['Close Grip Bench', 'Lockout Holds', 'Floor Press', 'High Pin Press', 'Reverse Band Bench']
};

export const DEADLIFT_VARIATIONS = {
    'lift-off': ['Deficit Deadlift', 'Snatch Grip Deficit', 'Paused Deficit Deadlift', 'Anderson Deadlift'],
    'over-knees': ['RDLs', 'Paused Deadlift (mid-shin)', 'Block Pull (mid-shin)', 'Speed Deadlift with bands'],
    'lockout': ['Paused Deadlift (knee level)', 'Rack Pulls', 'Snatch Grip RDLs', 'Banded Deadlift']
};

export const SQUAT_VARIATIONS = {
    'bottom': ['Paused Squat', 'Low Box Squat', 'Front Squat', 'Zercher Squat'],
    'mid-range': ['Stiletto Squat', 'Safety Bar Squat', 'Mid Pin Squat', 'Tempo Squat'],
    'lockout': ['High Box Squat', 'Banded Squat']
};

// Standard competition lifts for Block 1
const STANDARD_LIFTS = {
    bench: 'Paused Bench Press',
    deadlift: 'Conventional Deadlift',
    squat: 'Low Bar Squat'
};

// Select a variation based on weak point, rotating through options
// If same weak point is selected multiple blocks, pick next variation in list
export const selectVariation = (
    lift: 'bench' | 'deadlift' | 'squat',
    weakPoint: string,
    previousVariation?: string,
    excludedVariations: string[] = []
): string => {
    let variations: string[];

    if (lift === 'bench') {
        variations = BENCH_VARIATIONS[weakPoint as keyof typeof BENCH_VARIATIONS] || [];
    } else if (lift === 'deadlift') {
        variations = DEADLIFT_VARIATIONS[weakPoint as keyof typeof DEADLIFT_VARIATIONS] || [];
    } else {
        variations = SQUAT_VARIATIONS[weakPoint as keyof typeof SQUAT_VARIATIONS] || [];
    }

    // Filter out excluded variations
    if (excludedVariations.length > 0) {
        const availableVariations = variations.filter(v => !excludedVariations.includes(v));
        // Only use filtered list if it's not empty (don't allow excluding everything)
        if (availableVariations.length > 0) {
            variations = availableVariations;
        }
    }

    if (variations.length === 0) {
        return STANDARD_LIFTS[lift];
    }

    // If no previous variation or previous not in list, return first
    if (!previousVariation || !variations.includes(previousVariation)) {
        return variations[0];
    }

    // Rotate to next variation
    const currentIndex = variations.indexOf(previousVariation);
    const nextIndex = (currentIndex + 1) % variations.length;
    return variations[nextIndex];
};

// Variation-specific percentages of current 1RM for ME starting weights (midpoint of ranges)
export const VARIATION_PERCENTAGES: Record<string, number> = {
    // Bench variations - Off chest
    'Long Pause Bench Press': 0.91,      // 90-92%
    'Wide-Grip Bench Press': 0.935,      // 92-95%
    'Spoto Press (1cm above chest)': 0.94, // 93-95%
    'Larsen Press': 0.875,               // 85-90%
    'Incline Bench Press': 0.725,        // 70-75%
    // Bench variations - Mid-range
    'Spoto Press (4-8cm)': 0.935,        // 92-95%
    'Mid Pin Press': 0.945,              // 93-96%
    'Board Press': 0.96,                 // 95-97%
    // Bench variations - Lockout
    'Close Grip Bench': 0.975,           // 95-100%
    'Lockout Holds': 1.025,              // 100-105% (isometric)
    'Floor Press': 0.975,                // 95-100%
    'High Pin Press': 1.025,             // 100-105%
    'Reverse Band Bench': 1.05,          // 100-110%

    // Deadlift variations - Lift-off
    'Deficit Deadlift': 0.75,            // 70-80%
    'Snatch Grip Deficit': 0.65,         // 60-70%
    'Paused Deficit Deadlift': 0.70,     // 65-75%
    'Anderson Deadlift': 0.70,           // 65-75%
    // Deadlift variations - Over knees
    'RDLs': 0.875,                       // 85-90%
    'Paused Deadlift (mid-shin)': 0.905, // 88-93%
    'Block Pull (mid-shin)': 0.925,      // 90-95%
    'Speed Deadlift with bands': 0.65,   // 60-70% (DE explosive)
    // Deadlift variations - Lockout
    'Paused Deadlift (knee level)': 1.025, // 100-105%
    'Rack Pulls': 1.15,                  // 110-120%
    'Snatch Grip RDLs': 0.95,            // 90-100%
    'Banded Deadlift': 1.075,            // 100-115%

    // Squat variations - Bottom
    'Paused Squat': 0.915,               // 90-93%
    'Low Box Squat': 0.935,              // 92-95%
    'Front Squat': 0.85,                 // 80-90%
    'Zercher Squat': 0.775,              // 70-85%
    // Squat variations - Mid-range
    'Stiletto Squat': 0.935,             // 92-95%
    'Safety Bar Squat': 0.92,            // 90-94%
    'Mid Pin Squat': 0.925,              // 90-95%
    'Tempo Squat': 0.90,                 // 85-95%
    // Squat variations - Lockout
    'High Box Squat': 1.025,             // 100-105%
    'Banded Squat': 1.00,                // 95-105% bar weight

    // Standard competition lifts (Block 1)
    'Paused Bench Press': 1.00,
    'Conventional Deadlift': 1.00,
    'Low Bar Squat': 1.00
};

// Block percentages: [ME%, DE%, RE%]
const BLOCK_PERCENTAGES: Record<number, { me: number; de: number; re: number }> = {
    1: { me: 0.90, de: 0.60, re: 0.70 },
    2: { me: 0.90, de: 0.60, re: 0.70 },
    3: { me: 0.90, de: 0.60, re: 0.70 },
    4: { me: 0.92, de: 0.65, re: 0.75 },
    5: { me: 0.92, de: 0.65, re: 0.75 },
    6: { me: 0.92, de: 0.65, re: 0.75 },
    7: { me: 0.95, de: 0.70, re: 0.80 },
    8: { me: 0.95, de: 0.70, re: 0.80 },
    9: { me: 0.95, de: 0.70, re: 0.80 }
};

// Get block number from workout number (1-27 -> 1-9)
export const getBlockFromWorkout = (workoutNum: number): number => {
    return Math.ceil(workoutNum / 3);
};

// Get workout position within block (1, 2, or 3)
export const getWorkoutPositionInBlock = (workoutNum: number): number => {
    const pos = workoutNum % 3;
    return pos === 0 ? 3 : pos;
};

// Workout rotation pattern:
// Workout 1: Deadlift ME, Squat DE, Bench RE
// Workout 2: Squat ME, Bench DE, Deadlift RE
// Workout 3: Bench ME, Deadlift DE, Squat RE
export const getWorkoutPattern = (workoutNum: number): { me: 'bench' | 'deadlift' | 'squat'; de: 'bench' | 'deadlift' | 'squat'; re: 'bench' | 'deadlift' | 'squat' } => {
    const position = getWorkoutPositionInBlock(workoutNum);
    switch (position) {
        case 1:
            return { me: 'deadlift', de: 'squat', re: 'bench' };
        case 2:
            return { me: 'squat', de: 'bench', re: 'deadlift' };
        case 3:
        default:
            return { me: 'bench', de: 'deadlift', re: 'squat' };
    }
};

// Round down to nearest 2.5kg
const roundDownTo2_5 = (weight: number): number => {
    return Math.floor(weight / 2.5) * 2.5;
};

// Epley formula: e1RM = weight × (1 + reps/30)
export const calculateE1RM = (weight: number, reps: number): number => {
    return roundDownTo2_5(weight * (1 + reps / 30));
};

// Get lift name based on variation or standard
// Only ME exercises use variations from block 4+ (Workout 10+)
// DE and RE always use standard competition lifts
const getLiftName = (
    liftType: 'bench' | 'deadlift' | 'squat',
    effortType: 'me' | 'de' | 're',
    user: UserProfile | null,
    block: number
): string => {
    const suffix = effortType === 'me' ? ' (ME)' : effortType === 'de' ? ' (DE)' : ' (RE)';

    // DE and RE always use standard lifts
    if (effortType !== 'me') {
        return STANDARD_LIFTS[liftType] + suffix;
    }

    // Blocks 1-3: ME uses standard lifts
    if (block <= 3) {
        return STANDARD_LIFTS[liftType] + suffix;
    }

    // Block 2+: ME uses variations from weak point selection
    const status = (user as any)?.trinaryStatus;
    if (!status) {
        return STANDARD_LIFTS[liftType] + suffix;
    }

    let variationName = '';
    switch (liftType) {
        case 'bench':
            variationName = status.benchVariation || STANDARD_LIFTS.bench;
            break;
        case 'deadlift':
            variationName = status.deadliftVariation || STANDARD_LIFTS.deadlift;
            break;
        case 'squat':
            variationName = status.squatVariation || STANDARD_LIFTS.squat;
            break;
    }

    return variationName + suffix;
};

// Get sets/reps for effort type
const getSetTarget = (effortType: 'me' | 'de' | 're'): { sets: number; target: SetTarget } => {
    switch (effortType) {
        case 'me':
            return {
                sets: 3,
                target: { type: 'range', reps: '1-3', rpe: 9 }
            };
        case 'de':
            return {
                sets: 8,
                target: { type: 'straight', reps: '2-3' }
            };
        case 're':
            return {
                sets: 4,
                target: { type: 'range', reps: '8-12' }
            };
    }
};

// Create accessory exercises for accessory days
const createAccessoryDay = (focusType: 'upper' | 'lower'): Exercise[] => {
    if (focusType === 'upper') {
        return [
            {
                id: 'trinary-acc-upper-1',
                name: 'Tricep Extensions',
                sets: 4,
                target: { type: 'range', reps: '8-12' },
                notes: 't:tips.trinaryAccessory'
            },
            {
                id: 'trinary-acc-upper-2',
                name: 'Rows (neutral grip)',
                sets: 4,
                target: { type: 'range', reps: '8-12' },
                notes: 't:tips.trinaryAccessory'
            },
            {
                id: 'trinary-acc-upper-3',
                name: 'Shoulder Press',
                sets: 4,
                target: { type: 'range', reps: '8-12' },
                notes: 't:tips.trinaryAccessory'
            },
            {
                id: 'trinary-acc-upper-4',
                name: 'Rear Delt Flys',
                sets: 4,
                target: { type: 'range', reps: '8-12' },
                notes: 't:tips.trinaryAccessory'
            }
        ];
    } else {
        return [
            {
                id: 'trinary-acc-lower-1',
                name: 'Leg Extensions',
                sets: 4,
                target: { type: 'range', reps: '8-12' },
                notes: 't:tips.trinaryAccessory'
            },
            {
                id: 'trinary-acc-lower-2',
                name: 'Ham Curls',
                sets: 4,
                target: { type: 'range', reps: '8-12' },
                notes: 't:tips.trinaryAccessory'
            },
            {
                id: 'trinary-acc-lower-3',
                name: 'Calf Raises',
                sets: 4,
                target: { type: 'range', reps: '8-12' },
                notes: 't:tips.trinaryAccessory'
            },
            {
                id: 'trinary-acc-lower-4',
                name: 'Hip Thrusts',
                sets: 4,
                target: { type: 'range', reps: '8-12' },
                notes: 't:tips.trinaryAccessory'
            }
        ];
    }
};

// Create the 27 workouts
const createTrinaryWeeks = (): ProgramWeek[] => {
    const weeks: ProgramWeek[] = [];

    // We create 9 "weeks" but each represents 3 workouts
    // The user progresses by completing workouts, not by calendar
    for (let block = 1; block <= 9; block++) {
        const days: WorkoutDay[] = [];

        for (let workoutInBlock = 1; workoutInBlock <= 3; workoutInBlock++) {
            const workoutNum = (block - 1) * 3 + workoutInBlock;
            const pattern = getWorkoutPattern(workoutNum);

            const exercises: Exercise[] = [];

            // ME Exercise (main lift)
            const meSetup = getSetTarget('me');
            exercises.push({
                id: `trinary-w${workoutNum}-me`,
                name: `${STANDARD_LIFTS[pattern.me]} (ME)`, // Will be replaced by preprocessDay with variation
                sets: meSetup.sets,
                target: meSetup.target,
                notes: workoutNum <= 9 ? 't:tips.trinaryMEStandard' : 't:tips.trinaryMEVariation'
            });

            // DE Exercise
            const deSetup = getSetTarget('de');
            exercises.push({
                id: `trinary-w${workoutNum}-de`,
                name: `${STANDARD_LIFTS[pattern.de]} (DE)`,
                sets: deSetup.sets,
                target: deSetup.target,
                notes: 't:tips.trinaryDE'
            });

            // RE Exercise
            const reSetup = getSetTarget('re');
            exercises.push({
                id: `trinary-w${workoutNum}-re`,
                name: `${STANDARD_LIFTS[pattern.re]} (RE)`,
                sets: reSetup.sets,
                target: reSetup.target,
                notes: 't:tips.trinaryRE'
            });

            days.push({
                id: `trinary-block${block}-w${workoutInBlock}`,
                dayName: `t:dayNames.trinaryWorkout|{"num":${workoutNum}}`,
                dayOfWeek: workoutInBlock, // 1, 2, 3 within the block
                exercises
            });
        }

        weeks.push({ weekNumber: block, days });
    }

    return weeks;
};

export const TRINARY_PROGRAM: Program = {
    id: 'trinary',
    name: 'Trinary',
    weeks: createTrinaryWeeks()
};

export const TRINARY_CONFIG: PlanConfig = {
    id: TRINARY_PROGRAM.id,
    program: TRINARY_PROGRAM,
    ui: {
        dashboardWidgets: ['program_status', 'workout_history']
    },
    hooks: {
        preprocessDay: (day: WorkoutDay, user: UserProfile): WorkoutDay => {
            const status = (user as any)?.trinaryStatus;
            if (!status) return day;

            const workoutNum = status.completedWorkouts + 1;
            const block = getBlockFromWorkout(workoutNum);
            const pattern = getWorkoutPattern(workoutNum);

            // Check if user wants to skip next accessory day
            if (status.skipNextAccessory) {
                // Reset the flag and continue with normal workout
                // Note: The flag will be reset when the workout is completed
                // For now, just skip the accessory check
            } else {
                // Check if this is an accessory day (>4 workouts in last 7 days)
                if (status.workoutLog) {
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    const recentWorkouts = status.workoutLog.filter((log: { date: string }) =>
                        new Date(log.date) > sevenDaysAgo
                    );

                    if (recentWorkouts.length >= 4) {
                        // Use preferred accessory type if set, otherwise alternate
                        let focusType: 'upper' | 'lower';

                        if (status.preferredAccessoryType) {
                            focusType = status.preferredAccessoryType;
                        } else {
                            const accessoryCount = status.accessoryDaysCompleted || 0;
                            focusType = accessoryCount % 2 === 0 ? 'upper' : 'lower';
                        }

                        return {
                            ...day,
                            dayName: `t:dayNames.trinaryAccessory|{"type":"${focusType}"}`,
                            exercises: createAccessoryDay(focusType)
                        };
                    }
                }
            }

            // Replace exercise names with correct variations based on block
            const processedExercises = day.exercises.map(ex => {
                if (ex.id.includes('-me')) {
                    const liftName = getLiftName(pattern.me, 'me', user, block);
                    return {
                        ...ex,
                        name: liftName,
                        notes: block <= 3 ? 't:tips.trinaryMEStandard' : 't:tips.trinaryMEVariation'
                    };
                } else if (ex.id.includes('-de')) {
                    const liftName = getLiftName(pattern.de, 'de', user, block);
                    return { ...ex, name: liftName };
                } else if (ex.id.includes('-re')) {
                    const liftName = getLiftName(pattern.re, 're', user, block);
                    return { ...ex, name: liftName };
                }
                return ex;
            });

            return { ...day, exercises: processedExercises };
        },

        calculateWeight: (_target: SetTarget, user: UserProfile, exerciseName?: string, _context?: { week: number; day: number }): string | undefined => {
            const status = (user as any)?.trinaryStatus;
            if (!status || !exerciseName) return undefined;

            const workoutNum = status.completedWorkouts + 1;
            const block = getBlockFromWorkout(workoutNum);
            const blockPercentages = BLOCK_PERCENTAGES[block];

            // Determine lift type and effort type from exercise name
            const isME = exerciseName.includes('(ME)');
            const isDE = exerciseName.includes('(DE)');
            const isRE = exerciseName.includes('(RE)');

            // Determine which 1RM to use
            let current1RM = 0;
            const baseName = exerciseName.replace(' (ME)', '').replace(' (DE)', '').replace(' (RE)', '');

            // Note: Variation percentage (VARIATION_PERCENTAGES) is only used for
            // "suggested starting weight" tip on first ME day of new variation
            // This is handled in preprocessDay exercise notes

            // Determine which lift's 1RM to use
            if (baseName.toLowerCase().includes('bench') || baseName.toLowerCase().includes('press') ||
                baseName.toLowerCase().includes('floor') || baseName.toLowerCase().includes('board') ||
                baseName.toLowerCase().includes('close grip') || baseName.toLowerCase().includes('lockout holds')) {
                current1RM = status.bench1RM || 0;
            } else if (baseName.toLowerCase().includes('deadlift') || baseName.toLowerCase().includes('rdl') ||
                baseName.toLowerCase().includes('deficit') || baseName.toLowerCase().includes('rack pull') ||
                baseName.toLowerCase().includes('block pull')) {
                current1RM = status.deadlift1RM || 0;
            } else if (baseName.toLowerCase().includes('squat') || baseName.toLowerCase().includes('box') ||
                baseName.toLowerCase().includes('stiletto') || baseName.toLowerCase().includes('safety bar') ||
                baseName.toLowerCase().includes('banded')) {
                current1RM = status.squat1RM || 0;
            }

            if (current1RM <= 0) return undefined;

            // Calculate weight based on effort type - using ONLY block percentage
            // Variation percentage is only for "suggested starting weight" tip (displayed separately)
            let blockPct = 1.0;
            if (isME) {
                blockPct = blockPercentages.me;
            } else if (isDE) {
                blockPct = blockPercentages.de;
            } else if (isRE) {
                blockPct = blockPercentages.re;
            }

            // Weight = 1RM × block % (rounded down to 2.5 kg)
            let calculatedWeight = roundDownTo2_5(current1RM * blockPct);

            // Apply RE progression bonus if earned (double progression +2.5kg)
            if (isRE && status.reProgressionPending) {
                const liftType = baseName.toLowerCase().includes('bench') ? 'bench' :
                    baseName.toLowerCase().includes('deadlift') || baseName.toLowerCase().includes('rdl') ? 'deadlift' : 'squat';
                const bonus = status.reProgressionPending.find((p: any) => p.lift === liftType);
                if (bonus) {
                    calculatedWeight += bonus.amount;
                }
            }

            return calculatedWeight.toString();
        },

        getExerciseAdvice: (exercise: Exercise, _history: WorkoutLog[]): string | null => {
            // Main lifts (ME/DE/RE) have auto-calculated weights - no advice needed
            if (exercise.name.includes('(ME)') || exercise.name.includes('(DE)') || exercise.name.includes('(RE)')) {
                return null;
            }

            // Accessory exercises could have tips here if needed
            return null;
        }
    }
};
