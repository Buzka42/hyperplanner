/**
 * LAZARUS — 8 weeks, three-day full body, for a trained athlete returning after
 * three months or more away.
 *
 * The movements are deliberately ordinary. What makes the plan work is the
 * Memory Curve in `src/features/lazarus/memoryCurve.ts`: loads open from the
 * last stable pre-break performance rather than the lifetime best, and weeks
 * 1–2 are capped whatever the athlete's readiness says.
 */

import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { openingLoad, shouldAccelerate, weekSetCap } from '../../features/lazarus/memoryCurve';
import { EXERCISE_BY_ID } from '../exercises/library';

const double = { type: 'double' as const, increment: 2.5 };
const s = (ex: string, sets: number, reps = '8-12', options: Partial<SlotSpec> = {}): SlotSpec =>
    ({ ex, sets, reps, restSeconds: options.systemicCompound ? 150 : 90, progression: double, ...options });

export const LAZARUS_DAYS: DaySpec[] = [
    { name: 'Return I', dayOfWeek: 1, slots: [
        s('hack-squat', 3, '8-12', { systemicCompound: true }),
        s('incline-dumbbell-bench-press', 3, '8-12'),
        s('single-arm-hammer-row', 3, '8-12', { unilateral: true }),
        s('seated-hamstring-curl', 2, '10-15'),
        s('lateral-raise', 2, '12-15'),
        s('cable-triceps-extension', 1, '8-15'),
        s('hack-calf-raise', 1, '12-20'),
        s('ab-wheel', 1, '8-12'),
    ] },
    { name: 'Return II', dayOfWeek: 3, slots: [
        s('romanian-deadlift', 3, '8-12', { systemicCompound: true }),
        s('lat-pulldown', 3, '8-12'),
        s('hammer-chest-press', 3, '8-12'),
        s('leg-extension', 2, '10-15'),
        s('single-arm-reverse-pec-deck', 2, '12-15', { unilateral: true }),
        s('hack-calf-raise', 2, '12-20'),
        s('hammer-curl', 1, '8-12'),
    ] },
    { name: 'Return III', dayOfWeek: 5, slots: [
        s('leg-press', 3, '10-15', { systemicCompound: true }),
        s('seated-dumbbell-shoulder-press', 3, '8-12'),
        s('hammer-pulldown', 3, '8-12'),
        s('lying-leg-curl', 2, '10-15'),
        s('hammer-curl', 1, '8-12'),
        s('cable-triceps-extension', 1, '8-15'),
    ] },
];

const phases = [
    // Weeks 1–2 are capped in the plan tree *and* in preprocessDay, so a
    // rerun, a swap or an admin edit cannot reintroduce the volume.
    { name: 'Waking', weeks: [1, 2], transform: (slot: SlotSpec): SlotSpec => ({ ...slot, sets: weekSetCap(1, slot.sets), rpe: 7 }) },
    { name: 'Remembering', weeks: [3, 4, 5] },
    { name: 'Returned', weeks: [6, 7, 8], transform: (slot: SlotSpec): SlotSpec =>
        slot.systemicCompound ? { ...slot, reps: '6-10' } : slot },
];

const base = definePlan({ id: 'lazarus', name: 'Lazarus', weeks: 8, days: LAZARUS_DAYS, phases });

const weekOf = (day: WorkoutDay): number => Number(day.id?.match(/-w(\d+)-/)?.[1] ?? 1);

const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const week = weekOf(day);
    const acceleration = shouldAccelerate(user.lazarusStatus, week);
    return {
        ...day,
        exercises: day.exercises.map(exercise => ({
            ...exercise,
            // The cap is reasserted here rather than trusted from the tree.
            sets: weekSetCap(week, exercise.sets),
            notes: exercise.notes ?? (acceleration.accelerate ? acceleration.reason : undefined),
        })),
    };
};

/**
 * Load comes from the Memory Curve when there is a usable memory, and is left
 * to the generic calibration path when there is not — a returning athlete with
 * no history is a beginner as far as the prescription is concerned.
 */
const calculateWeight: NonNullable<PlanConfig['hooks']>['calculateWeight'] = (target, user, exerciseName, context) => {
    const entry = Object.values(EXERCISE_BY_ID).find(item => item.name.en === exerciseName || item.name.pl === exerciseName);
    const memory = entry && user.lazarusStatus?.memoryCurve?.[entry.id];
    if (!memory || !user.lazarusStatus?.breakMonths) return base.hooks?.calculateWeight?.(target, user, exerciseName, context);

    const opening = openingLoad(memory, user.lazarusStatus.breakMonths);
    return opening.openingKg ? String(opening.openingKg) : base.hooks?.calculateWeight?.(target, user, exerciseName, context);
};

export const LAZARUS_CONFIG: PlanConfig = {
    ...base,
    hooks: { ...base.hooks, preprocessDay: preprocess, calculateWeight },
    ui: { themeClass: 'theme-lazarus', coverImage: '/lazarus.png', navImage: '/lazarus.png', dashboardWidgets: ['program_status', 'workout_history'] },
};
