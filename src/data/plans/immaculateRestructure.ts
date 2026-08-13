/**
 * THE WEAKEST LINK — structural balance + hypertrophy/strength hybrid.
 *
 * From HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md section 5.
 *
 * Every major group at least twice weekly, built around the Poliquin
 * structural-balance relationships: close-grip bench at 100%, incline barbell
 * ~83%, weighted chin total system weight ~81%, preacher curl ~46%, reverse
 * curl ~30%, single-arm external rotation ~9%. Those ratios live on the library
 * entries via `strengthRef`.
 *
 * Per section 5 and section 15, the ratios are presented as *Poliquin
 * structural-balance targets* — programming references, never safe/unsafe
 * thresholds or injury prediction.
 *
 * The weak-link exposure is a small third dose of the lagging structure, never
 * an extra fatigue-heavy compound.
 */

import { definePlan } from '../planBuilder';
import type { DaySpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { EXERCISE_BY_ID } from '../exercises/library';

const UPPER_A: DaySpec = {
    name: 'Upper Structural A',
    dayOfWeek: 1,
    slots: [
        {
            ex: 'close-grip-bench-press',
            sets: 4,
            reps: '5-8',
            restSeconds: 180,
            notes: 'The reference lift. Every other upper-body target is expressed relative to this.',
        },
        { ex: 'weighted-chin-up', sets: 4, reps: '5-8', restSeconds: 180, notes: 'Poliquin target: ~81% of close-grip bench as total system weight.' },
        { ex: 'incline-barbell-bench-press', sets: 3, reps: '6-10', restSeconds: 150, notes: 'Poliquin target: ~83% of close-grip bench.' },
        { ex: 'single-arm-external-rotation', sets: 3, reps: '12-20', restSeconds: 60, notes: 'Poliquin target: ~9% of close-grip bench.' },
        { ex: 'reverse-curl', sets: 3, reps: '8-12', restSeconds: 75, notes: 'Poliquin target: ~30% of close-grip bench.' },
        { ex: 'rear-delt-fly', sets: 2, reps: '15-20', restSeconds: 60, technique: { kind: 'last-set-failure' } },
    ],
};

const LOWER_A: DaySpec = {
    name: 'Lower Structural A',
    dayOfWeek: 2,
    slots: [
        { ex: 'front-squat', sets: 4, reps: '3-6', restSeconds: 210, notes: 'Keep the reps low — the torso should not be the limiter.', alternates: ['Safety Bar Squat'] },
        { ex: 'single-leg-hamstring-curl', sets: 3, reps: '8-12', restSeconds: 90 },
        { ex: 'goblet-skater-squat', sets: 3, reps: '8-12', restSeconds: 105, notes: 'Per side. Weaker leg first.' },
        { ex: 'hip-supported-db-deadlift', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'calf-raise', sets: 3, reps: '10-20', restSeconds: 60 },
        { ex: 'ab-wheel', sets: 3, reps: '6-15', restSeconds: 60 },
    ],
};

const UPPER_B: DaySpec = {
    name: 'Upper Structural B',
    dayOfWeek: 4,
    slots: [
        { ex: 'seated-dumbbell-shoulder-press', sets: 4, reps: '6-10', restSeconds: 150 },
        { ex: 'hammer-upper-row', sets: 4, reps: '8-12', restSeconds: 120 },
        { ex: 'flat-dumbbell-press', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'single-arm-external-rotation', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'ezbar-preacher-curl', sets: 3, reps: '8-12', restSeconds: 75, notes: 'Poliquin target: ~46% of close-grip bench.' },
        // Second weekly tricep exposure. The concept doc's Upper Structural B
        // has no direct tricep work, leaving one exposure a week and breaking
        // its own two-exposure minimum; section 16's intent wins.
        { ex: 'cable-triceps-extension', sets: 2, reps: '10-15', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'rear-delt-fly', sets: 2, reps: '15-20', restSeconds: 60, technique: { kind: 'last-set-failure' } },
    ],
};

const LOWER_B: DaySpec = {
    name: 'Lower Structural B',
    dayOfWeek: 5,
    slots: [
        { ex: 'heel-elevated-goblet-squat', sets: 4, reps: '10-15', restSeconds: 105 },
        { ex: 'seated-ham-curl', sets: 3, reps: '8-12', restSeconds: 90 },
        { ex: 'split-squat', sets: 3, reps: '8-12', restSeconds: 105, notes: 'Per side.' },
        { ex: 'hip-thrust', sets: 3, reps: '8-12', restSeconds: 105 },
        { ex: 'standing-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'hanging-leg-raise', sets: 3, reps: '10-20', restSeconds: 60 },
    ],
};

const base = definePlan({
    id: 'immaculate-restructure',
    name: 'Immaculate (Re)Structure',
    weeks: 10,
    defaultTempo: '20X0',
    days: [UPPER_A, LOWER_A, UPPER_B, LOWER_B],
    phases: [
        { name: 'Assessment', weeks: [1, 2] },
        { name: 'Correction', weeks: [3, 4, 5, 6, 7] },
        {
            name: 'Re-Test',
            weeks: [8, 9, 10],
            transform: slot => ({ ...slot, sets: Math.max(2, slot.sets - 1) }),
        },
    ],
});

const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const week = Number(day.id?.match(/-w(\d+)-/)?.[1] ?? day.weekNumber ?? 1);
    if (week < 3 || (day.dayOfWeek !== 2 && day.dayOfWeek !== 4)) return day;
    const loads = user.workingLoads?.['immaculate-restructure'] ?? {};
    const closeGrip = loads['close-grip-bench-press'] ?? 0;
    if (!closeGrip) return day;

    return {
        ...day,
        exercises: day.exercises.map(exercise => {
            const entry = exercise.exerciseId ? EXERCISE_BY_ID[exercise.exerciseId] : undefined;
            const ref = entry?.strengthRef;
            if (!ref || ref.ratioOf !== 'close-grip-bench-press') return exercise;
            const expected = closeGrip * (ref.poliquinPercent / 100);
            const actual = loads[entry.id];
            if (!actual || actual >= expected * 0.9) return exercise;
            return { ...exercise, sets: exercise.sets + 2, notes: `${exercise.notes ?? ''} Lagging vs close-grip ratio — +2 sets.`.trim() };
        }),
    };
};

export const IMMACULATE_RESTRUCTURE_CONFIG: PlanConfig = {
    ...base,
    hooks: { ...base.hooks, preprocessDay: preprocess },
    ui: {
        themeClass: 'theme-immaculate-restructure',
        coverImage: '/imamculate.png',
        navImage: '/imamculate.png',
        dashboardWidgets: ['1rm', 'program_status', 'strength_chart', 'workout_history'],
    },
};
