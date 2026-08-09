/**
 * Synthetic user for admin previews.
 *
 * Super Mutant, Trinary, Skeleton and Ritual generate their days at runtime and
 * ship stub weeks, so the Plan Composer has to run their generators against a
 * plausible user to see any exercises at all. Every plan-specific status object
 * is populated because a generator that reads a missing field throws, and a
 * thrown generator shows as an empty plan.
 */

import { RITUAL_ACCESSORIES } from '../../data/ritual';
import type { UserProfile } from '../../types';

const BASE_STATS = {
    pausedBench: 100,
    wideGripBench: 90,
    spotoPress: 95,
    lowPinPress: 88,
    btnPress: 45,
    squat: 140,
    conventionalDeadlift: 180,
    lowBarSquat: 150,
};

/**
 * Alternative states that unlock different branches of a plan's generator.
 *
 * A single preview user shows only one slice: Super Mutant rotates its session
 * queue on block and variant state, so one state surfaces 12 of its ~40
 * movements and an admin would never see the rest. Trinary branches on weak
 * point and block, Pencilneck on exercise preferences.
 */
export const buildPreviewVariants = (planId: string): UserProfile[] => {
    const base = buildPreviewUser(planId);
    const variants: UserProfile[] = [base];
    const clone = (overrides: Record<string, unknown>) => ({ ...base, ...overrides }) as UserProfile;

    if (planId === 'super-mutant') {
        // The session queue is chosen from which muscle groups are recovered,
        // so an all-empty timestamp map keeps landing on the same groups.
        // Marking each group as freshly trained in turn forces the generator to
        // pick the others and surfaces the rest of the exercise pool.
        const GROUPS = [
            'chest', 'shoulders', 'triceps', 'back', 'biceps', 'calves',
            'hamstrings', 'glutes', 'lowerBack', 'quads', 'abductors', 'abs',
        ];
        const now = Date.now();
        const timestampSets: Record<string, number>[] = [{}];
        for (const group of GROUPS) timestampSets.push({ [group]: now });
        // Whole upper body fresh, then whole lower body fresh.
        timestampSets.push(Object.fromEntries(GROUPS.slice(0, 6).map(g => [g, now])));
        timestampSets.push(Object.fromEntries(GROUPS.slice(6).map(g => [g, now])));

        for (const muscleGroupTimestamps of timestampSets)
            for (const chestVariant of ['A', 'B'] as const)
                for (const backVariant of ['A', 'B'] as const)
                    for (const nextUpperBlock of ['A', 'B'] as const)
                        for (const nextLowerBlock of ['C', 'D'] as const)
                            for (const quadExercise of ['Hack Squat', 'Front Squat'] as const)
                                for (const hamstringExercise of ['Good Mornings', 'Deficit RDLs'] as const)
                                    variants.push(clone({
                                        superMutantStatus: {
                                            ...(base.superMutantStatus as object),
                                            muscleGroupTimestamps,
                                            chestVariant, backVariant, nextUpperBlock, nextLowerBlock,
                                            quadExercise, hamstringExercise,
                                        },
                                    }));
    }

    if (planId === 'trinary') {
        for (const wp of [
            { benchWeakPoint: 'off-chest', deadliftWeakPoint: 'lift-off', squatWeakPoint: 'bottom' },
            { benchWeakPoint: 'mid-range', deadliftWeakPoint: 'over-knees', squatWeakPoint: 'mid-range' },
            { benchWeakPoint: 'lockout', deadliftWeakPoint: 'lockout', squatWeakPoint: 'lockout' },
        ]) {
            for (const completedWorkouts of [0, 3, 9, 18]) {
                variants.push(clone({
                    trinaryStatus: {
                        ...(base.trinaryStatus as object),
                        ...wp,
                        completedWorkouts,
                        currentBlock: Math.floor(completedWorkouts / 3) + 1,
                        preferredAccessoryType: 'upper',
                        reDeadliftVariant: 'Reverse Hyperextensions',
                    },
                }));
            }
        }
    }

    if (planId === 'pencilneck-eradication') {
        for (const exercisePreferences of [
            { 'push-a-leg-primary': 'Hack Squat', 'push-b-fly': 'Pec Deck', 'push-b-leg-secondary': 'Front Squats' },
            { 'push-a-leg-primary': 'High-Foot Leg Press', 'push-b-fly': 'Low-to-High Cable Flyes', 'push-b-leg-secondary': 'Narrow-Stance Leg Press' },
            { 'push-b-leg-secondary': 'Stiletto Squats' },
        ]) variants.push(clone({ exercisePreferences }));
    }

    if (planId === 'skeleton-to-threat') {
        variants.push(clone({ completedSessions: 12 }));
        variants.push(clone({ completedSessions: 30 }));
    }

    if (planId === 'ritual-of-strength') {
        variants.push(clone({ ritualStatus: { ...(base.ritualStatus as object), completedWorkouts: 20, currentWeek: 8 } }));
    }

    if (planId === 'bench-domination') {
        variants.push(clone({
            benchDominationModules: {
                tricepGiantSet: false, behindNeckPress: false, weightedPullups: false,
                accessories: false, legDays: false, thursdayTricepVariant: 'heavy-extensions',
                lowPinPressExtraSet: true,
            },
        }));
    }

    return variants;
};

export const buildPreviewUser = (planId: string): UserProfile =>
    ({
        id: 'preview',
        codeword: 'preview',
        ownerUid: 'preview',
        stats: { ...BASE_STATS },
        startDate: new Date('2026-01-01').toISOString(),
        programId: planId,
        completedSessions: 0,
        benchHistory: [],
        // All modules on, so the composer shows the fullest version of the plan.
        benchDominationModules: {
            tricepGiantSet: true,
            behindNeckPress: true,
            weightedPullups: true,
            accessories: true,
            legDays: true,
            thursdayTricepVariant: 'giant-set',
        },
        trinaryStatus: {
            completedWorkouts: 0,
            currentBlock: 1,
            bench1RM: 120,
            deadlift1RM: 200,
            squat1RM: 160,
            benchWeakPoint: 'lockout',
            deadliftWeakPoint: 'lockout',
            squatWeakPoint: 'bottom',
            workoutLog: [],
            cycleNumber: 1,
        },
        superMutantStatus: {
            completedWorkouts: 0,
            currentCycle: 1,
            muscleGroupTimestamps: {},
            rolling7DayVolume: {
                chest: 0, shoulders: 0, triceps: 0, back: 0, biceps: 0, calves: 0,
                hamstrings: 0, glutes: 0, lowerBack: 0, quads: 0, abductors: 0, abs: 0,
            },
            chestVariant: 'A',
            backVariant: 'A',
            bench1RM: 120,
            deadlift1RM: 200,
            squat1RM: 160,
            quadExercise: 'Hack Squat',
            hamstringExercise: 'Good Mornings',
        },
        ritualStatus: { completedWorkouts: 0, currentWeek: 1, ritualAccessories: RITUAL_ACCESSORIES },
        pencilneckStatus: { cycle: 1, startDate: new Date('2026-01-01').toISOString() },
        painGloryStatus: {},
        skeletonStatus: { completed: false },
        programProgress: {},
        badges: [],
    }) as unknown as UserProfile;
