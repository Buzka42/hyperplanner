/**
 * THE MINIMUM — 10 weeks, two required sessions a week.
 *
 * Both sessions cover every major muscle, using different movements so the
 * second exposure is a genuine variation rather than a repeat. Set counts are
 * held to 14–16: the plan is only credible if the required work stays required,
 * which means it has to fit a week where nothing else goes right.
 *
 * Bonus modules live in `src/features/theMinimum/bonus.ts` and are never part
 * of the program tree — they cannot become a third mandatory session by
 * accident.
 */

import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';

const double = { type: 'double' as const, increment: 2.5 };
const s = (ex: string, sets: number, reps = '8-12', options: Partial<SlotSpec> = {}): SlotSpec =>
    ({ ex, sets, reps, restSeconds: options.systemicCompound ? 150 : 90, progression: double, ...options });

export const MINIMUM_DAYS: DaySpec[] = [
    // Squat/press/row session.
    { name: 'Session A', dayOfWeek: 1, slots: [
        s('hack-squat', 2, '6-10', { systemicCompound: true }),
        s('romanian-deadlift', 2, '6-10', { systemicCompound: true }),
        s('incline-dumbbell-bench-press', 2, '6-10'),
        s('single-arm-hammer-row', 2, '8-12', { unilateral: true }),
        s('lateral-raise', 2, '12-15'),
        s('hammer-curl', 1, '8-12'),
        s('cable-triceps-extension', 1, '8-15'),
        s('hack-calf-raise', 1, '12-20'),
        s('ab-wheel', 1, '8-12'),
    ] },
    // Same muscles, different movements — no slot repeats from Session A.
    { name: 'Session B', dayOfWeek: 4, slots: [
        s('leg-press', 2, '8-12', { systemicCompound: true }),
        s('seated-hamstring-curl', 2, '10-15'),
        s('hammer-chest-press', 2, '8-12'),
        s('lat-pulldown', 2, '8-12'),
        s('seated-dumbbell-shoulder-press', 2, '8-12'),
        s('single-leg-machine-hip-thrust', 1, '10-15', { unilateral: true }),
        s('cable-curl', 1, '10-15'),
        s('rope-pressdown', 1, '10-15'),
        s('seated-dumbbell-calf-raise', 1, '12-20'),
        s('hanging-knee-raise', 1, '10-15'),
    ] },
];

const phases = [
    { name: 'Establish', weeks: [1, 2, 3] },
    { name: 'Build', weeks: [4, 5, 6, 7] },
    // Effort rises rather than volume: adding sets would break the promise the
    // plan is named after.
    { name: 'Press', weeks: [8, 9], transform: (slot: SlotSpec): SlotSpec =>
        slot.systemicCompound ? slot : { ...slot, rpe: 9 } },
    { name: 'Confirm', weeks: [10] },
];

const base = definePlan({ id: 'the-minimum', name: 'The Minimum', weeks: 10, days: MINIMUM_DAYS, phases });

/**
 * Bonus work is recorded but must not alter the required session, so the hook
 * only annotates. If this ever starts editing sets, the plan has quietly grown
 * a third mandatory session.
 */
const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const bonuses = user.minimumStatus?.bonusSessions?.length ?? 0;
    if (!bonuses) return day;
    return { ...day, exercises: day.exercises.map(exercise => ({ ...exercise })) };
};

export const THE_MINIMUM_CONFIG: PlanConfig = {
    ...base,
    hooks: { ...base.hooks, preprocessDay: preprocess },
    ui: { themeClass: 'theme-the-minimum', coverImage: '/minimum.png', navImage: '/minimum.png', dashboardWidgets: ['program_status', 'workout_history'] },
};
