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
        s('heel-elevated-goblet-squat', 3, '8-12', { systemicCompound: true }),
        s('30-smith-incline-bench-press', 3, '8-12'),
        s('single-arm-hammer-row', 3, '8-12', { unilateral: true }),
        s('seated-hamstring-curl', 2, '10-15'),
        s('cable-lateral-raise', 2, '12-15', { technique: { kind: 'last-set-failure' } }),
        s('overhead-tricep-extension', 2, '8-15'),
        s('hack-calf-raise', 2, '12-20'),
        s('cable-crunch', 2, '8-12'),
    ] },
    { name: 'Return II', dayOfWeek: 3, slots: [
        s('hip-supported-db-deadlift', 3, '8-12', { systemicCompound: true }),
        s('overhand-mid-grip-pulldown', 3, '8-12'),
        s('dip', 3, '8-12'),
        s('reverse-nordic-curl', 2, '10-15'),
        s('rear-delt-fly', 2, '12-15'),
        s('hack-calf-raise', 2, '12-20'),
        s('machine-curl', 2, '8-12'),
    ] },
    { name: 'Return III', dayOfWeek: 5, slots: [
        s('leg-press', 3, '10-15', { systemicCompound: true }),
        s('seated-hammer-shoulder-press', 3, '8-12'),
        s('hammer-pulldown', 3, '8-12'),
        s('machine-press-fly-combo', 3, '8-12'),
        s('lying-leg-curl', 2, '10-15'),
        s('rope-hammer-curl', 2, '8-12'),
        s('cable-triceps-extension', 2, '8-15'),
        s('plank', 2, '30-60sec'),
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

const base = definePlan({ id: 'lazarus', name: 'Lazarus', weeks: 8, defaultTempo: '20X0', days: LAZARUS_DAYS, phases });

const weekOf = (day: WorkoutDay): number => Number(day.id?.match(/-w(\d+)-/)?.[1] ?? 1);

const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const week = weekOf(day);
    const acceleration = shouldAccelerate(user.lazarusStatus, week);
    const choices = user.planPreferences?.lazarus?.exerciseSelections ?? {};
    return {
        ...day,
        exercises: day.exercises.map(exercise => {
            let next = exercise;
            if (exercise.exerciseId === 'heel-elevated-goblet-squat' && choices.returnISquat) {
                const entry = EXERCISE_BY_ID[choices.returnISquat];
                if (entry) next = { ...next, exerciseId: entry.id, name: entry.name.en };
            }
            if (exercise.exerciseId === 'dip' && choices.returnIIChest) {
                const entry = EXERCISE_BY_ID[choices.returnIIChest];
                if (entry) next = { ...next, exerciseId: entry.id, name: entry.name.en };
            }
            const entry = next.exerciseId ? EXERCISE_BY_ID[next.exerciseId] : undefined;
            const memory = entry && user.lazarusStatus?.memoryCurve?.[entry.id];
            const opening = memory && user.lazarusStatus?.breakMonths
                ? openingLoad(memory, user.lazarusStatus.breakMonths)
                : undefined;
            return {
                ...next,
                sets: weekSetCap(week, next.sets),
                notes: next.notes ?? (acceleration.accelerate ? acceleration.reason : undefined),
                predictedKg: opening?.openingKg,
            };
        }),
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
