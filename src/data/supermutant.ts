// Super Mutant - Advanced 16 Week Fallout-Themed High-Frequency Bodybuilding Plan
// RIR progression (2→1→0→past failure), mandatory deloads, dynamic volume-based queue

import type { Program, PlanConfig, WorkoutDay, UserProfile, Exercise } from '../types';

// Super Mutant specific status tracking
export type SuperMutantStatus = {
    completedWorkouts: number;
    currentCycle: number; // 1-4 (tracks which 4-week cycle user is in)
    muscleGroupTimestamps: {
        chest?: number;
        shoulders?: number;
        triceps?: number;
        back?: number;
        biceps?: number;
        calves?: number;
        hamstrings?: number;
        glutes?: number;
        lowerBack?: number;
        quads?: number;
        abductors?: number;
        abs?: number;
    };
    rolling7DayVolume: {
        chest: number;
        shoulders: number;
        triceps: number;
        back: number;
        biceps: number;
        calves: number;
        hamstrings: number;
        glutes: number;
        lowerBack: number;
        quads: number;
        abductors: number;
        abs: number;
    };
    // Alternation tracking
    chestVariant: 'A' | 'B';
    backVariant: 'A' | 'B';
    // Block alternation for new queue system
    nextUpperBlock?: 'A' | 'B'; // Chest/Tri/Bi (A) or Back/Shoulders/Calves (B)
    nextLowerBlock?: 'C' | 'D'; // Hams/Glutes/LBack (C) or Quads/Abd/Abs (D)
    // Weak point tracking
    lastWeakPointCheck?: number; // workout number
    weakPointMuscle?: string;
    // Mutation reminders
    lastMutationReminder?: number; // workout number
    // Initial 1RMs
    bench1RM: number;
    deadlift1RM: number;
    squat1RM: number;
    // Exercise preferences
    quadExercise: 'Hack Squat' | 'Front Squat';
    hamstringExercise: 'Good Mornings' | 'Deficit RDLs';
    // Weekly session tracking for cap
    weeklySessionDates?: string[]; // Last 7 days of session dates
};

// Cooldown periods in hours
const COOLDOWN_PERIODS = {
    upper: 48, // Chest/Triceps/Biceps and Back/Shoulders/Calves
    lower: 72  // Hamstrings/Glutes/LowerBack and Quads/Abductors/Abs
};

// Define 4 fixed training clusters
// Each cluster is trained together as a unit
const TRAINING_CLUSTERS = {
    cluster1: {
        name: 'Chest/Triceps/Biceps',
        muscles: ['chest', 'triceps', 'biceps'],
        cooldown: COOLDOWN_PERIODS.upper,
        estimatedTime: 35 // 15 + 10 + 10
    },
    cluster2: {
        name: 'Back/Shoulders/Calves',
        muscles: ['back', 'shoulders', 'calves'],
        cooldown: COOLDOWN_PERIODS.upper,
        estimatedTime: 45 // 20 + 15 + 10
    },
    cluster3: {
        name: 'Hamstrings/Glutes/LowerBack',
        muscles: ['hamstrings', 'glutes', 'lowerBack'],
        cooldown: COOLDOWN_PERIODS.lower,
        estimatedTime: 45 // 15 + 15 + 15
    },
    cluster4: {
        name: 'Quads/Abductors/Abs',
        muscles: ['quads', 'abductors', 'abs'],
        cooldown: COOLDOWN_PERIODS.lower,
        estimatedTime: 40 // 15 + 15 + 10
    }
};

// Exercise definitions with all muscle group exercises
const EXERCISES = {
    chest: {
        A: {
            preExhaust: {
                id: 'chest-a-pre',
                name: 'Pec Deck',
                sets: 2,
                target: { type: 'range' as const, reps: '10-15', rpe: 8 }
            },
            main: {
                id: 'chest-a-main',
                name: 'Incline DB Bench Press',
                sets: 4, // Will be reactive 2-4
                target: { type: 'range' as const, reps: '8-12', rpe: 8 }
            },
            finisher: {
                id: 'chest-a-finish',
                name: 'Deficit Pushups',
                sets: 2,
                target: { type: 'failure' as const, reps: 'Failure', rpe: 10 }
            }
        },
        B: {
            preExhaust: {
                id: 'chest-b-pre',
                name: 'Mid Cable Flyes (Seated)',
                sets: 2,
                target: { type: 'range' as const, reps: '10-15', rpe: 8 }
            },
            main: {
                id: 'chest-b-main',
                name: 'Hammer Chest Press',
                sets: 4, // Will be reactive 2-4
                target: { type: 'range' as const, reps: '8-12', rpe: 8 }
            },
            finisher: {
                id: 'chest-b-finish',
                name: 'Deficit Pushups',
                sets: 2,
                target: { type: 'failure' as const, reps: 'Failure', rpe: 10 }
            }
        }
    },
    back: {
        A: [
            {
                id: 'back-a-1',
                name: 'Hammer Underhand Pulldown',
                sets: 4,
                target: { type: 'range' as const, reps: '8-12', rpe: 8 }
            },
            {
                id: 'back-a-2',
                name: 'Single Arm Cable Row',
                sets: 4,
                target: { type: 'range' as const, reps: '10-15', rpe: 8 }
            },
            {
                id: 'back-a-3',
                name: 'Lat Prayer',
                sets: 4,
                target: { type: 'range' as const, reps: '10-15', rpe: 8 }
            }
        ],
        B: [
            {
                id: 'back-b-1',
                name: 'Rope Cable Row',
                sets: 4,
                target: { type: 'range' as const, reps: '10-15', rpe: 8 }
            },
            {
                id: 'back-b-2',
                name: 'Lat Pulldown (Mid Grip)',
                sets: 4,
                target: { type: 'range' as const, reps: '8-12', rpe: 8 }
            },
            {
                id: 'back-b-3',
                name: 'Single Arm Hammer Row',
                sets: 4,
                target: { type: 'range' as const, reps: '8-12', rpe: 8 }
            }
        ]
    },
    shoulders: [
        {
            id: 'shoulders-1',
            name: 'Lying Cable Lat Raises',
            sets: 4,
            target: { type: 'range' as const, reps: '10-15', rpe: 8 }
        },
        {
            id: 'shoulders-2',
            name: 'Single Arm Reverse Pec Deck',
            sets: 4,
            target: { type: 'range' as const, reps: '10-15', rpe: 8 }
        },
        {
            id: 'shoulders-3',
            name: 'Lateral Raises',
            sets: 4,
            target: { type: 'range' as const, reps: '10-15', rpe: 8 },
            notes: 'Cable or DB variation'
        }
    ],
    triceps: [
        {
            id: 'triceps-1',
            name: 'Triangle Pushdown',
            sets: 4,
            target: { type: 'range' as const, reps: '8-12', rpe: 8 }
        },
        {
            id: 'triceps-2',
            name: 'EZ Skullcrushers',
            sets: 4,
            target: { type: 'range' as const, reps: '8-12', rpe: 8 }
        },
        {
            id: 'triceps-3',
            name: 'Single Arm Overhead Extension',
            sets: 4,
            target: { type: 'range' as const, reps: '10-15', rpe: 8 }
        }
    ],
    biceps: [
        {
            id: 'biceps-1',
            name: 'Incline DB Curls',
            sets: 4,
            target: { type: 'range' as const, reps: '10-15', rpe: 8 }
        },
        {
            id: 'biceps-2',
            name: 'EZ Preacher Curl',
            sets: 4,
            target: { type: 'range' as const, reps: '10-15', rpe: 8 }
        },
        {
            id: 'biceps-3',
            name: 'Hammer Curls',
            sets: 4,
            target: { type: 'range' as const, reps: '10-15', rpe: 8 }
        }
    ],
    calves: [
        {
            id: 'calves-1',
            name: 'Standing Calf Raises',
            sets: 4,
            target: { type: 'range' as const, reps: '15-20', rpe: 8 }
        }
    ],
    hamstrings: (choice: 'Good Mornings' | 'Deficit RDLs') => [
        {
            id: 'hamstrings-1',
            name: 'Seated Ham Curl',
            sets: 4,
            target: { type: 'range' as const, reps: '10-15', rpe: 8 }
        },
        {
            id: 'hamstrings-2',
            name: choice,
            sets: 4,
            target: { type: 'range' as const, reps: '8-12', rpe: 8 }
        },
        {
            id: 'hamstrings-3',
            name: 'Single Leg Machine Hip Thrust',
            sets: 4,
            target: { type: 'range' as const, reps: '8-12', rpe: 8 }
        }
    ],
    quads: (choice: 'Hack Squat' | 'Front Squat') => [
        {
            id: 'quads-1',
            name: 'Leg Extensions',
            sets: 4,
            target: { type: 'range' as const, reps: '8-12', rpe: 8 }
        },
        {
            id: 'quads-2',
            name: choice,
            sets: 4,
            target: { type: 'range' as const, reps: '8-12', rpe: 8 }
        },
        {
            id: 'quads-3',
            name: 'Hip Adduction',
            sets: 4,
            target: { type: 'range' as const, reps: '8-12', rpe: 8 }
        }
    ],
    abs: [
        {
            id: 'abs-1',
            name: 'Cable Crunches',
            sets: 4,
            target: { type: 'range' as const, reps: '10-20', rpe: 8 }
        }
    ]
};

// Calculate reactive sets for a specific muscle group based on its 7-day volume
// Target: ~20 sets per muscle per week
// Strategy: Estimate how many times this muscle will train this week and distribute sets accordingly
function calculateReactiveSetsForMuscle(current7DayVolume: number, isPreExhaustOrFinisher: boolean = false, status?: any, muscleGroup?: string): number {
    // Pre-exhaust and finishers are always 2 sets
    if (isPreExhaustOrFinisher) return 2;

    // Lower body muscles (hams, glutes, lowerBack, abs, abductors) start at max (4 sets)
    // They have limited exercises and unlikely to hit 20 sets/week
    const lowerBodyMuscles = ['hamstrings', 'glutes', 'lowerBack', 'abs', 'abductors'];
    if ((!current7DayVolume || current7DayVolume === 0 || isNaN(current7DayVolume))) {
        if (muscleGroup && lowerBodyMuscles.includes(muscleGroup)) {
            console.log(`[Super Mutant] ${muscleGroup}: No volume, starting at MAX 4 sets (lower body)`);
            return 4;
        }
        console.log('[Super Mutant] No volume history, starting with 2 sets');
        return 2;
    }

    // Estimate weekly workout frequency based on recent activity
    // If user has done X workouts in last 7 days, assume similar pace
    const recentWorkouts = status?.weeklySessionDates?.length || 0;
    const estimatedWeeklyWorkouts = Math.max(2, Math.min(6, recentWorkouts)); // Estimate 2-6 workouts/week

    // Each muscle appears in 1 cluster, so it trains when that cluster trains
    // Clusters train ~every 2-3 workouts (2 clusters selected per workout, 4 total clusters)
    // So estimate this muscle will train 2-3 times this week
    const estimatedMuscleWorkouts = Math.ceil(estimatedWeeklyWorkouts / 2); // Rough estimate

    // Calculate how many sets we need per workout to reach ~20 total
    const remainingSets = Math.max(0, 20 - current7DayVolume);
    const setsPerWorkout = Math.ceil(remainingSets / estimatedMuscleWorkouts);

    // Constrain to 2-4 sets range
    let sets = Math.max(2, Math.min(4, setsPerWorkout));

    console.log(`[Super Mutant] Volume: ${current7DayVolume}, Estimated workouts left: ${estimatedMuscleWorkouts}, Sets: ${sets}`);

    return sets;
}

// Check if muscle group is ready (cooldown period passed with 10h grace period)
export function isMuscleGroupReady(lastTrainTime: number | undefined, muscleGroup: string): boolean {
    if (!lastTrainTime) return true;

    const isLowerBody = muscleGroup === 'abs' || muscleGroup === 'hamstrings' || muscleGroup === 'glutes' ||
        muscleGroup === 'lowerBack' || muscleGroup === 'quads' || muscleGroup === 'abductors';

    const baseCooldownHours = isLowerBody ? COOLDOWN_PERIODS.lower : COOLDOWN_PERIODS.upper;
    const graceHours = 10; // Allow training up to 10 hours early
    const effectiveCooldownMs = (baseCooldownHours - graceHours) * 60 * 60 * 1000;

    return (Date.now() - lastTrainTime) >= effectiveCooldownMs;
}

// Calculate RIR (Reps in Reserve) based on week within current 4-week cycle
function getRIRForWeek(completedWorkouts: number): number {
    const weekInCycle = (completedWorkouts % 28) % 4; // 0-3 within each 4-week cycle
    if (weekInCycle === 0) return 2; // Week 1: 2 RIR
    if (weekInCycle === 1) return 1; // Week 2: 1 RIR
    if (weekInCycle === 2) return 0; // Week 3: Failure
    return -1; // Week 4: Past failure (intensification techniques)
}

// Get RIR message for display
function getRIRMessage(rir: number): string {
    if (rir === 2) return "Leave 2 reps in reserve";
    if (rir === 1) return "Leave 1 rep in reserve";
    if (rir === 0) return "Take to failure";
    return "Past failure – use intensification technique";
}

// Get intensification technique guide based on exercise type
function getIntensificationTechnique(exerciseType: 'main' | 'preExhaust' | 'finisher'): string {
    if (exerciseType === 'main') {
        return "REST-PAUSE: Reach failure, rest 10–15 sec, squeeze 3–5 more reps, repeat 2–3 times. Tip: 'Failure, short breath rest, squeeze more reps – build the beast.'";
    }
    if (exerciseType === 'preExhaust') {
        return "DROPSET: Drop 20–30% weight 2–3 times till failure each drop. Tip: 'Drop weight immediately after failure, no rest, repeat 2–3 times – chase the burn.'";
    }
    // finisher
    return "MYO-REPS: Activation set to failure, then 3–5 mini-sets of 3–5 reps with 3–5 breaths rest. Tip: 'Activation to failure, then mini-sets with short breaths – total exhaustion for growth.'";
}

// Get rep range based on current cycle
function getRepRange(currentCycle: number, exerciseType: 'main' | 'isolation'): string {
    // Cycles 1-2: 8-12 (main), 10-15 (isolation)
    // Cycles 3-4: 10-15 (main), 15-20 (isolation)
    if (currentCycle <= 2) {
        return exerciseType === 'main' ? '8-12' : '10-15';
    } else {
        return exerciseType === 'main' ? '10-15' : '15-20';
    }
}


// Check if a cluster is ready (all muscles in cluster off cooldown)
function isClusterReady(status: any, clusterKey: string): boolean {
    const cluster = TRAINING_CLUSTERS[clusterKey as keyof typeof TRAINING_CLUSTERS];
    const now = Date.now();
    const cooldownMs = cluster.cooldown * 60 * 60 * 1000;

    // Check if all muscles in the cluster are off cooldown
    for (const muscle of cluster.muscles) {
        const lastTrained = (status.muscleGroupTimestamps as any)?.[muscle];
        if (lastTrained && (now - lastTrained) < cooldownMs) {
            return false; // Cluster not ready if any muscle still on cooldown
        }
    }
    return true;
}

// Generate next workout based on cluster system
function generateNextWorkout(user: UserProfile): WorkoutDay | null {
    const status = user.superMutantStatus;
    if (!status) return null;

    // Check if current week is week 9 (deload week) - after 8 complete weeks (56 workouts)
    const isDeloadWeek = status.completedWorkouts >= 56 && status.completedWorkouts < 63; // Week 9 = workouts 57-63

    if (isDeloadWeek) {
        // Generate deload workout: 50% sets, RIR 2-3
        // Use same cluster selection logic but with reduced volume
        const readyClusters: string[] = [];
        const clusterKeys = Object.keys(TRAINING_CLUSTERS);

        for (const clusterKey of clusterKeys) {
            if (isClusterReady(status, clusterKey)) {
                readyClusters.push(clusterKey);
            }
        }

        if (readyClusters.length === 0) {
            return {
                dayName: 'Rest Day – Deload Week Recovery',
                dayOfWeek: 0,
                exercises: []
            };
        }

        // Sort by volume priority (same as regular)
        readyClusters.sort((a, b) => {
            const clusterA = TRAINING_CLUSTERS[a as keyof typeof TRAINING_CLUSTERS];
            const clusterB = TRAINING_CLUSTERS[b as keyof typeof TRAINING_CLUSTERS];
            let volumeA = 0, volumeB = 0;
            for (const muscle of clusterA.muscles) volumeA += (status.rolling7DayVolume as any)?.[muscle] || 0;
            for (const muscle of clusterB.muscles) volumeB += (status.rolling7DayVolume as any)?.[muscle] || 0;
            if (volumeA !== volumeB) return volumeA - volumeB;
            let avgA = 0, avgB = 0;
            for (const muscle of clusterA.muscles) avgA += (status.muscleGroupTimestamps as any)?.[muscle] || 0;
            for (const muscle of clusterB.muscles) avgB += (status.muscleGroupTimestamps as any)?.[muscle] || 0;
            return (avgA / clusterA.muscles.length) - (avgB / clusterB.muscles.length);
        });

        // Select first cluster (simplified for deload)
        const selectedCluster = readyClusters[0];
        const cluster = TRAINING_CLUSTERS[selectedCluster as keyof typeof TRAINING_CLUSTERS];
        const exercises: Exercise[] = [];

        for (const muscle of cluster.muscles) {
            const deloadNotes = "DELOAD WEEK: Leave 2-3 reps in reserve, focus on form and recovery";

            if (muscle === 'chest') {
                const variant = status.chestVariant;
                const chestEx = EXERCISES.chest[variant];
                exercises.push({ ...chestEx.main, sets: 2, notes: deloadNotes }); // 50% of 4 = 2
            } else if (muscle === 'back') {
                const variant = status.backVariant;
                const backEx = EXERCISES.back[variant];
                // Take first exercise only, 2 sets
                exercises.push({ ...backEx[0], sets: 2, notes: deloadNotes });
            } else if (muscle === 'shoulders') {
                exercises.push({ ...EXERCISES.shoulders[0], sets: 2, notes: deloadNotes });
            } else if (muscle === 'triceps') {
                exercises.push({ ...EXERCISES.triceps[0], sets: 2, notes: deloadNotes });
            } else if (muscle === 'biceps') {
                exercises.push({ ...EXERCISES.biceps[0], sets: 2, notes: deloadNotes });
            } else if (muscle === 'calves') {
                exercises.push({ ...EXERCISES.calves[0], sets: 2, notes: deloadNotes });
            } else if (muscle === 'hamstrings') {
                exercises.push({ ...EXERCISES.hamstrings(status.hamstringExercise)[0], sets: 2, notes: deloadNotes });
            } else if (muscle === 'quads') {
                exercises.push({ ...EXERCISES.quads(status.quadExercise)[0], sets: 2, notes: deloadNotes });
            } else if (muscle === 'abs') {
                exercises.push({ ...EXERCISES.abs[0], sets: 2, notes: deloadNotes });
            }
        }


        const dayNum = (status.completedWorkouts % 7) + 1;

        return {
            dayName: `DELOAD Week 9 – ${cluster.name} (Light Recovery)`,
            dayOfWeek: dayNum,
            exercises: []
        };
    }

    // NEW QUEUE SYSTEM: Strict Upper Block Alternation + Lower When Ready

    // Initialize block alternation if not set
    const nextUpper = status.nextUpperBlock || 'A';
    const nextLower = status.nextLowerBlock || 'C';

    // Check upper blocks cooldown
    const upperBlockAReady = ['chest', 'triceps', 'biceps'].every(m =>
        isMuscleGroupReady((status.muscleGroupTimestamps as any)?.[m], m)
    );
    const upperBlockBReady = ['back', 'shoulders', 'calves'].every(m =>
        isMuscleGroupReady((status.muscleGroupTimestamps as any)?.[m], m)
    );

    // Determine which upper block to use
    let selectedUpperBlock: 'A' | 'B' | null = null;

    if (nextUpper === 'A' && upperBlockAReady) {
        selectedUpperBlock = 'A';
    } else if (nextUpper === 'A' && upperBlockBReady) {
        // A not ready, try B as fallback
        selectedUpperBlock = 'B';
    } else if (nextUpper === 'B' && upperBlockBReady) {
        selectedUpperBlock = 'B';
    } else if (nextUpper === 'B' && upperBlockAReady) {
        // B not ready, try A as fallback
        selectedUpperBlock = 'A';
    }

    // If neither upper block is ready, return rest day
    if (!selectedUpperBlock) {
        return {
            dayName: 'Rest Day – Upper Body Recovery',
            dayOfWeek: (status.completedWorkouts % 7) + 1,
            exercises: []
        };
    }

    // Check lower blocks cooldown (72h for all lower body)
    const lowerBlockCReady = ['hamstrings', 'glutes', 'lowerBack'].every(m =>
        isMuscleGroupReady((status.muscleGroupTimestamps as any)?.[m], m)
    );
    const lowerBlockDReady = ['quads', 'abductors', 'abs'].every(m =>
        isMuscleGroupReady((status.muscleGroupTimestamps as any)?.[m], m)
    );

    // Determine which lower block to use (if any ready)
    let includeLower = false;
    let lowerBlock: 'C' | 'D' | null = null;

    if (nextLower === 'C' && lowerBlockCReady) {
        includeLower = true;
        lowerBlock = 'C';
    } else if (nextLower === 'D' && lowerBlockDReady) {
        includeLower = true;
        lowerBlock = 'D';
    }

    // Check for over-volume muscles (>20 sets in 7 days)
    const tricepsOverVolume = (status.rolling7DayVolume.triceps || 0) > 20;
    const bicepsOverVolume = (status.rolling7DayVolume.biceps || 0) > 20;
    const shouldersOverVolume = (status.rolling7DayVolume.shoulders || 0) > 20;

    // Build workout
    const exercises: Exercise[] = [];
    let sessionTime = 0;
    const clusterNames: string[] = [];

    // Get RIR for current week
    const currentRIR = getRIRForWeek(status.completedWorkouts);
    const rirMessage = getRIRMessage(currentRIR);
    const isPastFailureWeek = currentRIR === -1;

    // UPPER BLOCK (ALWAYS INCLUDED - based on which is ready)
    if (selectedUpperBlock === 'A') {
        // Block A: Chest / Triceps / Biceps
        clusterNames.push('Chest/Triceps/Biceps');

        // Chest (always included - primary)
        const chestVolume = (status.rolling7DayVolume.chest || 0);
        const variant = status.chestVariant;
        const chestEx = EXERCISES.chest[variant];

        const preExNotes = isPastFailureWeek ? `${rirMessage}\n\n${getIntensificationTechnique('preExhaust')}` : rirMessage;
        const mainNotes = isPastFailureWeek ? `${rirMessage}\n\n${getIntensificationTechnique('main')}` : rirMessage;
        const finishNotes = isPastFailureWeek ? `${rirMessage}\n\n${getIntensificationTechnique('finisher')}` : rirMessage;

        const mainReps = getRepRange(status.currentCycle, 'main');
        const isolationReps = getRepRange(status.currentCycle, 'isolation');

        let chestSets = calculateReactiveSetsForMuscle(chestVolume, false, status);

        exercises.push({
            ...chestEx.preExhaust,
            sets: calculateReactiveSetsForMuscle(chestVolume, true, status),
            notes: preExNotes,
            target: { ...chestEx.preExhaust.target, reps: isolationReps }
        });
        exercises.push({
            ...chestEx.main,
            sets: chestSets,
            notes: mainNotes,
            target: { ...chestEx.main.target, reps: mainReps }
        });
        exercises.push({
            ...chestEx.finisher,
            sets: calculateReactiveSetsForMuscle(chestVolume, true, status),
            notes: finishNotes
        });

        // Triceps (only if NOT over volume)
        if (!tricepsOverVolume) {
            const tricepsVolume = (status.rolling7DayVolume.triceps || 0);
            const tricepsNotes = isPastFailureWeek ? `${rirMessage}\n\n${getIntensificationTechnique('main')}` : rirMessage;
            exercises.push(...EXERCISES.triceps.map(e => ({
                ...e,
                sets: calculateReactiveSetsForMuscle(tricepsVolume, false, status),
                notes: tricepsNotes,
                target: { ...e.target, reps: mainReps }
            })));
        }

        // Biceps (only if NOT over volume)
        if (!bicepsOverVolume) {
            const bicepsVolume = (status.rolling7DayVolume.biceps || 0);
            const bicepsNotes = isPastFailureWeek ? `${rirMessage}\n\n${getIntensificationTechnique('main')}` : rirMessage;
            exercises.push(...EXERCISES.biceps.map(e => ({
                ...e,
                sets: calculateReactiveSetsForMuscle(bicepsVolume, false, status),
                notes: bicepsNotes,
                target: { ...e.target, reps: isolationReps }
            })));
        }

        sessionTime = 30; // Upper Block A estimate

    } else {
        // Block B: Back / Shoulders / Calves
        clusterNames.push('Back/Shoulders/Calves');

        // Back (always included - primary)
        const backVolume = (status.rolling7DayVolume.back || 0);
        const variant = status.backVariant;
        const backEx = EXERCISES.back[variant];
        const backNotes = isPastFailureWeek ? `${rirMessage}\n\n${getIntensificationTechnique('main')}` : rirMessage;
        const mainReps = getRepRange(status.currentCycle, 'main');

        exercises.push(...backEx.map(e => ({
            ...e,
            sets: calculateReactiveSetsForMuscle(backVolume, false, status),
            notes: backNotes,
            target: { ...e.target, reps: mainReps }
        })));

        // Shoulders (only if NOT over volume)
        if (!shouldersOverVolume) {
            const shouldersVolume = (status.rolling7DayVolume.shoulders || 0);
            const shouldersNotes = isPastFailureWeek ? `${rirMessage}\n\n${getIntensificationTechnique('main')}` : rirMessage;
            const isolationReps = getRepRange(status.currentCycle, 'isolation');
            exercises.push(...EXERCISES.shoulders.map(e => ({
                ...e,
                sets: calculateReactiveSetsForMuscle(shouldersVolume, false, status),
                notes: shouldersNotes,
                target: { ...e.target, reps: isolationReps }
            })));
        }

        // Calves (always included)
        const calvesVolume = (status.rolling7DayVolume.calves || 0);
        const calvesNotes = isPastFailureWeek ? `${rirMessage}\n\n${getIntensificationTechnique('main')}` : rirMessage;
        const isolationReps = getRepRange(status.currentCycle, 'isolation');
        exercises.push(...EXERCISES.calves.map(e => ({
            ...e,
            sets: calculateReactiveSetsForMuscle(calvesVolume, false, status, 'calves'),
            notes: calvesNotes,
            target: { ...e.target, reps: isolationReps }
        })));

        sessionTime = 30; // Upper Block B estimate
    }

    // LOWER BLOCK (if ready and time permits)
    if (includeLower && sessionTime + 20 <= 90) {
        const mainReps = getRepRange(status.currentCycle, 'main');

        if (lowerBlock === 'C') {
            // Block C: Hamstrings / Glutes / Lower Back
            clusterNames.push('Hams/Glutes/LowerBack');

            const hamstringVolume = (status.rolling7DayVolume.hamstrings || 0);
            const hamstringNotes = isPastFailureWeek ? `${rirMessage}\n\n${getIntensificationTechnique('main')}` : rirMessage;
            exercises.push(...EXERCISES.hamstrings(status.hamstringExercise).map(e => ({
                ...e,
                sets: calculateReactiveSetsForMuscle(hamstringVolume, false, status, 'hamstrings'),
                notes: hamstringNotes,
                target: { ...e.target, reps: mainReps }
            })));

            sessionTime += 20;

        } else if (lowerBlock === 'D') {
            // Block D: Quads / Abductors / Abs
            clusterNames.push('Quads/Abductors/Abs');

            const quadsVolume = (status.rolling7DayVolume.quads || 0);
            const quadsNotes = isPastFailureWeek ? `${rirMessage}\n\n${getIntensificationTechnique('main')}` : rirMessage;
            const isolationReps = getRepRange(status.currentCycle, 'isolation');

            exercises.push(...EXERCISES.quads(status.quadExercise).map(e => ({
                ...e,
                sets: calculateReactiveSetsForMuscle(quadsVolume, false, status, 'quads'),
                notes: quadsNotes,
                target: { ...e.target, reps: mainReps }
            })));

            const absVolume = (status.rolling7DayVolume.abs || 0);
            const absNotes = isPastFailureWeek ? `${rirMessage}\n\n${getIntensificationTechnique('finisher')}` : rirMessage;
            exercises.push(...EXERCISES.abs.map(e => ({
                ...e,
                sets: calculateReactiveSetsForMuscle(absVolume, false, status, 'abs'),
                notes: absNotes,
                target: { ...e.target, reps: isolationReps }
            })));

            sessionTime += 20;
        }
    }

    // CRANK LOGIC: If session too short (<45min), crank primary to 4 sets
    if (sessionTime < 45) {
        // Find first primary exercise (chest main or back exercise) and crank to 4 sets
        for (const ex of exercises) {
            if (ex.name.includes('Incline DB Bench') || ex.name.includes('Hammer Chest Press') ||
                ex.name.includes('Pulldown') || ex.name.includes('Row')) {
                if (ex.sets < 4) {
                    ex.sets = 4;
                    ex.notes = `${ex.notes}\n\n᲼SHORT SESSION CRANK: Sets increased to 4 for volume`;
                }
                break;
            }
        }
    }

    // Check for session too short warning
    if (sessionTime < 30 && !includeLower) {
        return {
            dayName: 'Short Mutation – Rest or Perish',
            dayOfWeek: (status.completedWorkouts % 7) + 1,
            exercises: []
        };
    }

    const dayName = `Workout ${status.completedWorkouts + 1} – ${clusterNames.join(' + ')}`;

    // Use workout count as week so each workout has unique save slot
    const weekNum = Math.floor(status.completedWorkouts / 7) + 1;
    const dayNum = (status.completedWorkouts % 7) + 1;

    console.log('[Super Mutant] Generated workout:', {
        clusters: clusterNames,
        week: weekNum,
        day: dayNum,
        exerciseCount: exercises.length,
        exercises: exercises.map(e => ({ name: e.name, sets: e.sets, id: e.id }))
    });

    return {
        dayName,
        dayOfWeek: dayNum,
        exercises
    };
}

// Placeholder program structure (16 weeks: 4 complete 4-week cycles)
const createSuperMutantWeeks = () => {
    // Super Mutant is entirely dynamic based on queue system
    // We create a traditional week structure, but preprocessDay will override with dynamic workouts
    const weeks = [];
    for (let i = 1; i <= 16; i++) {
        const days = [];
        // Create 7 days per week (standard structure)
        for (let d = 1; d <= 7; d++) {
            days.push({
                dayName: `Dynamic Workout`,
                dayOfWeek: d,
                exercises: [] // preprocessDay will populate this
            });
        }
        weeks.push({
            weekNumber: i,
            days
        });
    }
    return weeks;
};

export const SUPER_MUTANT_PROGRAM: Program = {
    id: 'super-mutant',
    name: 'Super Mutant',
    weeks: createSuperMutantWeeks()
};

export const SUPER_MUTANT_CONFIG: PlanConfig = {
    id: SUPER_MUTANT_PROGRAM.id,
    program: SUPER_MUTANT_PROGRAM,
    ui: {
        dashboardWidgets: ['mutagen_exposure', 'recovery_gauge', 'mutant_mindset', 'workout_history']
    },
    hooks: {
        preprocessDay: (day, user) => {
            // Generate next workout dynamically
            const nextWorkout = generateNextWorkout(user);
            console.log('[preprocessDay] OUTPUT:', nextWorkout);
            if (nextWorkout) {
                return nextWorkout;
            }
            return day;
        }
    }
};
