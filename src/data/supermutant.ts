// Super Mutant - Advanced 12+2 Week Fallout-Themed High-Frequency Bodybuilding Plan
// A dynamic high-frequency program with adaptive muscle group cooldowns and reactive volume

import type { Program, PlanConfig, WorkoutDay, UserProfile, Exercise } from '../types';

// Super Mutant specific status tracking
export type SuperMutantStatus = {
    completedWorkouts: number;
    muscleGroupTimestamps: {
        chest?: number;
        shoulders?: number;
        triceps?: number;
        upperBack?: number;
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

// Check if muscle group is ready (cooldown period passed)
export function isMuscleGroupReady(lastTrainTime: number | undefined, muscleGroup: string): boolean {
    if (!lastTrainTime) return true;
    const cooldownMs = (muscleGroup === 'abs' || muscleGroup === 'hamstrings' || muscleGroup === 'glutes' ||
        muscleGroup === 'lowerBack' || muscleGroup === 'quads' || muscleGroup === 'abductors'
        ? COOLDOWN_PERIODS.lower : COOLDOWN_PERIODS.upper) * 60 * 60 * 1000;
    return (Date.now() - lastTrainTime) >= cooldownMs;
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

    // Check which clusters are ready
    const readyClusters: string[] = [];
    const clusterKeys = Object.keys(TRAINING_CLUSTERS);

    for (const clusterKey of clusterKeys) {
        if (isClusterReady(status, clusterKey)) {
            readyClusters.push(clusterKey);
        }
    }

    // If no clusters ready, return rest day
    if (readyClusters.length === 0) {
        return {
            dayName: 'Rest Day – Mutation Needs Recovery',
            dayOfWeek: 0,
            exercises: []
        };
    }

    // Sort clusters by oldest average timestamp (prioritize clusters trained longest ago)
    readyClusters.sort((a, b) => {
        const clusterA = TRAINING_CLUSTERS[a as keyof typeof TRAINING_CLUSTERS];
        const clusterB = TRAINING_CLUSTERS[b as keyof typeof TRAINING_CLUSTERS];

        // Get average timestamp for each cluster
        let avgA = 0, avgB = 0;
        for (const muscle of clusterA.muscles) {
            avgA += (status.muscleGroupTimestamps as any)?.[muscle] || 0;
        }
        for (const muscle of clusterB.muscles) {
            avgB += (status.muscleGroupTimestamps as any)?.[muscle] || 0;
        }
        avgA /= clusterA.muscles.length;
        avgB /= clusterB.muscles.length;

        return avgA - avgB; // Oldest first
    });

    // Select clusters up to 90 minutes
    // Clusters have exclusivity rules:
    // - Cluster1 (Chest/Tri/Bi) CANNOT train with Cluster2 (Back/Shoulder/Calves)
    // - Cluster3 (Ham/Glute/LBack) CANNOT train with Cluster4 (Quad/Abd/Abs)
    const selectedClusters: string[] = [];
    let totalTime = 0;
    const targetTime = 90;

    const exclusivityMap: Record<string, string[]> = {
        'cluster1': ['cluster2'], // Chest/Tri/Bi excludes Back/Shoulder/Calves
        'cluster2': ['cluster1'], // Back/Shoulder/Calves excludes Chest/Tri/Bi
        'cluster3': ['cluster4'], // Hams/Glutes/LBack excludes Quads/Abd/Abs
        'cluster4': ['cluster3']  // Quads/Abd/Abs excludes Hams/Glutes/LBack
    };

    for (const clusterKey of readyClusters) {
        const cluster = TRAINING_CLUSTERS[clusterKey as keyof typeof TRAINING_CLUSTERS];

        // Check if this cluster is excluded by already selected clusters
        const isExcluded = selectedClusters.some(selected => {
            const exclusions = exclusivityMap[selected] || [];
            return exclusions.includes(clusterKey);
        });

        if (!isExcluded && totalTime + cluster.estimatedTime <= targetTime) {
            selectedClusters.push(clusterKey);
            totalTime += cluster.estimatedTime;
        }
    }

    // Build exercises for selected clusters
    const exercises: Exercise[] = [];
    const clusterNames: string[] = [];

    selectedClusters.forEach(clusterKey => {
        const cluster = TRAINING_CLUSTERS[clusterKey as keyof typeof TRAINING_CLUSTERS];
        clusterNames.push(cluster.name);

        // Add all exercises for all muscles in this cluster
        for (const muscle of cluster.muscles) {
            const muscleVolume = (status.rolling7DayVolume as any)[muscle] || 0;

            if (muscle === 'chest') {
                const variant = status.chestVariant;
                const chestEx = EXERCISES.chest[variant];
                exercises.push({ ...chestEx.preExhaust, sets: calculateReactiveSetsForMuscle(muscleVolume, true, status) });
                exercises.push({ ...chestEx.main, sets: calculateReactiveSetsForMuscle(muscleVolume, false, status) });
                exercises.push({ ...chestEx.finisher, sets: calculateReactiveSetsForMuscle(muscleVolume, true, status) });
            } else if (muscle === 'back') {
                const variant = status.backVariant;
                const backEx = EXERCISES.back[variant];
                exercises.push(...backEx.map(e => ({ ...e, sets: calculateReactiveSetsForMuscle(muscleVolume, false, status) })));
            } else if (muscle === 'shoulders') {
                exercises.push(...EXERCISES.shoulders.map(e => ({ ...e, sets: calculateReactiveSetsForMuscle(muscleVolume, false, status) })));
            } else if (muscle === 'triceps') {
                exercises.push(...EXERCISES.triceps.map(e => ({ ...e, sets: calculateReactiveSetsForMuscle(muscleVolume, false, status) })));
            } else if (muscle === 'biceps') {
                exercises.push(...EXERCISES.biceps.map(e => ({ ...e, sets: calculateReactiveSetsForMuscle(muscleVolume, false, status) })));
            } else if (muscle === 'calves') {
                exercises.push(...EXERCISES.calves.map(e => ({ ...e, sets: calculateReactiveSetsForMuscle(muscleVolume, false, status, 'calves') })));
            } else if (muscle === 'hamstrings') {
                exercises.push(...EXERCISES.hamstrings(status.hamstringExercise).map(e => ({ ...e, sets: calculateReactiveSetsForMuscle(muscleVolume, false, status, 'hamstrings') })));
            } else if (muscle === 'quads') {
                exercises.push(...EXERCISES.quads(status.quadExercise).map(e => ({ ...e, sets: calculateReactiveSetsForMuscle(muscleVolume, false, status, 'quads') })));
            } else if (muscle === 'abs') {
                exercises.push(...EXERCISES.abs.map(e => ({ ...e, sets: calculateReactiveSetsForMuscle(muscleVolume, false, status, 'abs') })));
            }
            // Note: glutes, lowerBack, and abductors are included in their combined exercises
        }
    });

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

// Placeholder program structure (14 weeks: 12 main + 2 peak)
const createSuperMutantWeeks = () => {
    // Super Mutant is entirely dynamic based on queue system
    // We create a traditional week structure, but preprocessDay will override with dynamic workouts
    const weeks = [];
    for (let i = 1; i <= 14; i++) {
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
