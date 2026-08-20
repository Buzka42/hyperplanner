/**
 * MONOLITH — 10 weeks, three-day Upper / Lower / Full, machines-only house.
 *
 * MON-RB-F/F2 plus the MON-V table: default is 3-day, machines and cables,
 * effort before technique. The combo press/fly and the pec-deck still never
 * share a session — they sit at opposite ends of the floor.
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
    { name: 'Upper', dayOfWeek: 1, slots: [
        s('hammer-chest-press', 4, '6-10', { primary: true }),
        s('hammer-pulldown', 3, '8-12'),
        s('single-arm-hammer-row', 3, '8-12', { unilateral: true }),
        s('seated-hammer-shoulder-press', 3, '8-12'),
        s('machine-press-fly-combo', 3, '10-15'),
        s('cable-triceps-extension', 3, '10-15'),
        s('machine-curl', 3, '8-12'),
        s('cable-crunch', 2, '12-20'),
    ] },
    { name: 'Lower', dayOfWeek: 3, slots: [
        s('leg-press', 4, '8-12', { systemicCompound: true, primary: true }),
        s('leg-extension', 3, '10-15'),
        s('lying-leg-curl', 3, '10-15'),
        s('single-leg-machine-hip-thrust', 3, '10-15', { unilateral: true }),
        s('standing-dumbbell-kb-calf-raise', 3, '12-20'),
        s('cable-crunch', 2, '12-20'),
    ] },
    { name: 'Full (light)', dayOfWeek: 5, slots: [
        s('pec-deck', 3, '12-15'),
        s('hammer-pulldown', 2, '10-15'),
        s('rear-delt-fly', 3, '12-15'),
        s('seated-hamstring-curl', 3, '10-15'),
        s('leg-extension', 2, '12-20'),
        s('standing-dumbbell-kb-calf-raise', 3, '12-20'),
        s('machine-hip-abduction', 3, '12-20'),
        s('hip-adduction', 3, '12-20'),
        s('cable-triceps-extension', 2, '10-15'),
        s('machine-curl', 2, '8-12'),
    ] },
];

/**
 * Effort first, then technique. Load progression continues throughout; what the
 * phases change is how hard the last set is taken, and only on machines where
 * that is safe alone.
 */
const TECHNIQUE_SAFE = new Set([
    'leg-extension', 'lying-leg-curl', 'seated-hamstring-curl', 'pec-deck',
    'machine-hip-abduction', 'hip-adduction', 'hammer-chest-press', 'hammer-pulldown',
    'single-arm-hammer-row', 'machine-press-fly-combo', 'seated-hammer-shoulder-press',
    'machine-curl', 'cable-triceps-extension', 'cable-crunch', 'rear-delt-fly',
]);

const phases = [
    { name: 'Placement', weeks: [1, 2, 3] },
    { name: 'Pressure', weeks: [4, 5, 6], transform: (slot: SlotSpec): SlotSpec =>
        slot.systemicCompound ? slot : { ...slot, rpe: 9 } },
    { name: 'Weight of It', weeks: [7, 8, 9], transform: (slot: SlotSpec): SlotSpec =>
        TECHNIQUE_SAFE.has(slot.ex)
            ? { ...slot, rpe: 9, technique: { kind: 'drop-set', drops: 1, dropPercent: 20, applyTo: 'last' as const } }
            : slot },
    { name: 'Settling', weeks: [10], transform: (slot: SlotSpec): SlotSpec => ({ ...slot, sets: Math.max(1, slot.sets - 1) }) },
];

const base = definePlan({ id: 'monolith', name: 'Monolith', weeks: 10, defaultTempo: '20X0', days: MONOLITH_DAYS, phases });

const preprocess = (day: WorkoutDay, _user: UserProfile): WorkoutDay => ({
    ...day,
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
