/**
 * MONOLITH — 10 weeks, four-day upper/lower, machine-dominant.
 *
 * Machine-dominant is not machine-exclusive: the plan uses the known fixed gym
 * inventory and keeps free weights where they are the better tool, rather than
 * banning barbells to make a theme hold. What it does avoid is stacking
 * systemic cost, and it progresses effort before it progresses technique.
 *
 * Machine Press/Fly Combo carries its own history and is never paired
 * operationally with the Pec Deck — they sit at opposite ends of the floor, and
 * a superset across that distance is a rest period with extra walking.
 */

import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';

const double = { type: 'double' as const, increment: 2.5 };
const s = (ex: string, sets: number, reps = '8-12', options: Partial<SlotSpec> = {}): SlotSpec =>
    ({ ex, sets, reps, restSeconds: options.systemicCompound ? 150 : 90, progression: double, ...options });

/** Stations that must never share a superset label. */
export const DISTANT_PAIRS: [string, string][] = [
    ['machine-press-fly-combo', 'pec-deck'],
    ['hack-squat', 'lat-prayer'],
];

export const MONOLITH_DAYS: DaySpec[] = [
    { name: 'Upper A', dayOfWeek: 1, slots: [
        s('hammer-chest-press', 4, '6-10', { primary: true }),
        s('hammer-pulldown', 4, '8-12'),
        s('machine-press-fly-combo', 3, '10-15'),
        s('single-arm-hammer-row', 3, '8-12', { unilateral: true }),
        s('lateral-raise', 3, '12-15'),
        s('cable-triceps-extension', 2, '10-15'),
        s('hammer-curl', 2, '8-12'),
    ] },
    { name: 'Lower A', dayOfWeek: 2, slots: [
        s('hack-squat', 4, '6-10', { systemicCompound: true, primary: true }),
        s('lying-leg-curl', 3, '10-15'),
        s('leg-press', 3, '10-15'),
        s('single-leg-machine-hip-thrust', 3, '10-15', { unilateral: true }),
        s('leg-extension', 3, '12-15'),
        s('hack-calf-raise', 3, '12-20'),
    ] },
    { name: 'Upper B', dayOfWeek: 4, slots: [
        s('lat-pulldown', 4, '8-12', { primary: true }),
        s('incline-dumbbell-bench-press', 3, '6-10'),
        s('single-arm-reverse-pec-deck', 3, '12-15', { unilateral: true }),
        s('pec-deck', 3, '12-15'),
        s('seated-dumbbell-shoulder-press', 3, '8-12'),
        s('rope-pressdown', 2, '10-15'),
        s('cable-curl', 2, '10-15'),
    ] },
    { name: 'Lower B', dayOfWeek: 5, slots: [
        s('leg-press', 4, '8-12', { systemicCompound: true, primary: true }),
        s('seated-hamstring-curl', 3, '10-15'),
        s('front-foot-elevated-bulgarian-split-squat', 3, '8-12', { unilateral: true }),
        s('machine-hip-abduction', 3, '12-20'),
        s('leg-extension', 3, '12-20'),
        s('hack-calf-raise', 3, '12-20'),
    ] },
];

/**
 * Effort first, then technique. Load progression continues throughout; what the
 * phases change is how hard the last set is taken, and only on machines where
 * that is safe alone.
 */
const TECHNIQUE_SAFE = new Set([
    'leg-extension', 'lying-leg-curl', 'seated-hamstring-curl', 'pec-deck',
    'machine-hip-abduction', 'hammer-chest-press', 'hammer-pulldown',
    'single-arm-reverse-pec-deck', 'machine-press-fly-combo', 'hack-calf-raise',
]);

const phases = [
    { name: 'Placement', weeks: [1, 2, 3] },
    // Effort: the same work, taken closer to the limit.
    { name: 'Pressure', weeks: [4, 5, 6], transform: (slot: SlotSpec): SlotSpec =>
        slot.systemicCompound ? slot : { ...slot, rpe: 9 } },
    // Only now, technique — and only where the machine makes it safe solo.
    { name: 'Weight of It', weeks: [7, 8, 9], transform: (slot: SlotSpec): SlotSpec =>
        TECHNIQUE_SAFE.has(slot.ex)
            ? { ...slot, rpe: 9, technique: { kind: 'drop-set', drops: 1, dropPercent: 20, applyTo: 'last' as const } }
            : slot },
    { name: 'Settling', weeks: [10], transform: (slot: SlotSpec): SlotSpec => ({ ...slot, sets: Math.max(1, slot.sets - 1) }) },
];

const base = definePlan({ id: 'monolith', name: 'Monolith', weeks: 10, days: MONOLITH_DAYS, phases });

const preprocess = (day: WorkoutDay, _user: UserProfile): WorkoutDay => ({
    ...day,
    // Pair labels are stripped from any distant pairing that a future edit
    // introduces, so the session never asks for a walk mid-superset.
    exercises: day.exercises.map(exercise => {
        const distant = DISTANT_PAIRS.some(([a, b]) =>
            (exercise.exerciseId === a || exercise.exerciseId === b)
            && day.exercises.some(other => other.prescription?.pair
                && other.prescription.pair === exercise.prescription?.pair
                && (other.exerciseId === a || other.exerciseId === b)
                && other.exerciseId !== exercise.exerciseId));
        return distant ? { ...exercise, prescription: { ...exercise.prescription, pair: undefined } } : exercise;
    }),
});

export const MONOLITH_CONFIG: PlanConfig = {
    ...base,
    hooks: { ...base.hooks, preprocessDay: preprocess },
    ui: { themeClass: 'theme-monolith', coverImage: '/monolith.png', navImage: '/monolith.png', dashboardWidgets: ['program_status', 'workout_history'] },
};
