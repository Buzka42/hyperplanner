/**
 * BLACKOUT — 8 weeks, three-day full body, advanced only.
 *
 * One work set per movement. The warm-up ramp is the calibration, the work set
 * is the whole prescription, and a back-off set is earned rather than
 * scheduled. Logic lives in `src/features/blackout/singleSet.ts`.
 *
 * Because a session is short, it is wide: every slot is one set, so the plan
 * still covers the body twice a week without ever running three sets of
 * anything.
 */

import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { earnedBackoff, failureAllowed } from '../../features/blackout/singleSet';

const double = { type: 'double' as const, increment: 2.5 };

/** One work set, always. The rep range is the only thing that varies. */
const one = (ex: string, reps = '6-10', options: Partial<SlotSpec> = {}): SlotSpec =>
    ({ ex, sets: 1, reps, restSeconds: options.systemicCompound ? 240 : 150, progression: double, ...options });

export const BLACKOUT_DAYS: DaySpec[] = [
    { name: 'Blackout I', dayOfWeek: 1, slots: [
        one('hack-squat', '5-8', { systemicCompound: true, primary: true }),
        one('incline-dumbbell-bench-press', '6-10', { primary: true }),
        one('single-arm-hammer-row', '8-12', { unilateral: true }),
        one('romanian-deadlift', '6-10'),
        one('lateral-raise', '12-15'),
        one('leg-extension', '12-15'),
        one('hammer-curl', '8-12'),
    ] },
    { name: 'Blackout II', dayOfWeek: 3, slots: [
        one('paused-bench-press', '4-6', { systemicCompound: true, primary: true }),
        one('hammer-pulldown', '8-12', { primary: true }),
        one('leg-press', '8-12'),
        one('seated-hamstring-curl', '10-15'),
        one('single-arm-reverse-pec-deck', '12-15', { unilateral: true }),
        one('cable-triceps-extension', '10-15'),
        one('hack-calf-raise', '12-20'),
    ] },
    { name: 'Blackout III', dayOfWeek: 5, slots: [
        one('front-foot-elevated-bulgarian-split-squat', '6-10', { unilateral: true, primary: true }),
        one('seated-dumbbell-shoulder-press', '6-10', { primary: true }),
        one('lat-pulldown', '8-12'),
        one('lying-leg-curl', '10-15'),
        one('pec-deck', '12-15'),
        one('hammer-curl', '10-15'),
        one('cable-triceps-extension', '10-15'),
        one('hack-calf-raise', '12-20'),
    ] },
];

const phases = [
    { name: 'Adjustment', weeks: [1, 2] },
    { name: 'Blackout', weeks: [3, 4, 5, 6] },
    // The late phase sharpens the primary sets. It never adds one.
    { name: 'Deep', weeks: [7, 8], transform: (slot: SlotSpec): SlotSpec =>
        slot.primary ? { ...slot, rpe: 10 } : slot },
];

const base = definePlan({ id: 'blackout', name: 'Blackout', weeks: 8, days: BLACKOUT_DAYS, phases });

const preprocess = (day: WorkoutDay, _user: UserProfile): WorkoutDay => ({
    ...day,
    exercises: day.exercises.map(exercise => ({
        ...exercise,
        // Every slot is a single set. If this ever stops being true, the plan
        // has become an ordinary three-day full body with fewer exercises.
        sets: 1,
        notes: exercise.notes ?? (exercise.exerciseId && failureAllowed(exercise.exerciseId)
            ? 'Taking this set to muscular failure is approved.'
            : 'Stop at the target. This slot is not approved for failure.'),
    })),
});

export const BLACKOUT_CONFIG: PlanConfig = {
    ...base,
    hooks: { ...base.hooks, preprocessDay: preprocess },
    ui: { themeClass: 'theme-blackout', coverImage: '/blackout.png', navImage: '/blackout.png', dashboardWidgets: ['program_status', 'workout_history'] },
};

export { earnedBackoff };
