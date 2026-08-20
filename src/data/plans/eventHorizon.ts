/**
 * EVENT HORIZON — 12 weeks, four-day hypertrophy.
 *
 * An ordinary, well-built hypertrophy plan is the point: the interesting part is
 * what happens when a region starts complaining. Cost-aware substitution lives
 * in `src/features/eventHorizon/costAwareSwaps.ts`, and nothing it produces is
 * applied without the athlete confirming it.
 */

import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { EXERCISE_BY_ID } from '../exercises/library';

const double = { type: 'double' as const, increment: 2.5 };
const s = (ex: string, sets: number, reps = '8-12', options: Partial<SlotSpec> = {}): SlotSpec =>
    ({ ex, sets, reps, restSeconds: options.systemicCompound ? 150 : 90, progression: double, ...options });

export const EVENT_HORIZON_DAYS: DaySpec[] = [
    { name: 'Horizon — Upper A', dayOfWeek: 1, slots: [
        s('30-smith-incline-bench-press', 4, '6-10', { primary: true }),
        s('single-arm-hammer-row', 2, '8-12', { unilateral: true }),
        s('dumbbell-seal-row', 2, '8-12'),
        s('seated-hammer-shoulder-press', 3, '8-12'),
        s('close-neutral-grip-lat-pulldown', 3, '8-12'),
        s('cable-lateral-raise', 2, '12-15', { technique: { kind: 'last-set-failure' } }),
        s('bayesian-cable-curl', 2, '8-12', { technique: { kind: 'last-set-failure' } }),
        s('cable-triceps-extension', 2, '10-15', { technique: { kind: 'last-set-failure' } }),
    ] },
    { name: 'Horizon — Lower A', dayOfWeek: 2, slots: [
        s('hack-squat', 4, '6-10', { systemicCompound: true, primary: true }),
        s('romanian-deadlift', 3, '8-12'),
        s('leg-extension', 3, '12-15'),
        s('seated-hamstring-curl', 3, '10-15'),
        s('single-leg-machine-hip-thrust', 3, '10-15', { unilateral: true }),
        s('hack-calf-raise', 3, '12-20'),
    ] },
    { name: 'Horizon — Upper B', dayOfWeek: 4, slots: [
        s('hammer-pulldown', 4, '8-12', { primary: true }),
        s('hammer-chest-press', 2, '8-12'),
        s('machine-press-fly-combo', 2, '8-12'),
        s('side-lying-rear-delt-fly', 2, '12-15', { unilateral: true, technique: { kind: 'last-set-failure' } }),
        s('pec-deck', 2, '12-15', { technique: { kind: 'last-set-failure' } }),
        s('lying-cable-lat-raise', 2, '12-20', { technique: { kind: 'last-set-failure' } }),
        s('cable-curl', 2, '10-15', { technique: { kind: 'last-set-failure' } }),
        s('french-press', 2, '10-15', { technique: { kind: 'last-set-failure' } }),
    ] },
    { name: 'Horizon — Lower B', dayOfWeek: 5, slots: [
        s('leg-press', 4, '8-12', { systemicCompound: true, primary: true }),
        s('lying-leg-curl', 3, '10-15'),
        s('front-foot-elevated-bulgarian-split-squat', 3, '8-12', { unilateral: true }),
        s('machine-hip-abduction', 3, '12-20'),
        s('supported-sissy-squat', 3, '12-20'),
        s('hack-calf-raise', 3, '12-20'),
        s('cable-crunch', 2, '8-12'),
    ] },
];

const phases = [
    { name: 'Approach', weeks: [1, 2, 3] },
    { name: 'Accretion', weeks: [4, 5, 6], transform: (slot: SlotSpec): SlotSpec =>
        slot.systemicCompound ? slot : { ...slot, rpe: 9 } },
    { name: 'Deload', weeks: [7], transform: (slot: SlotSpec): SlotSpec => ({ ...slot, sets: Math.max(1, slot.sets - 1), rpe: 7 }) },
    { name: 'Horizon', weeks: [8, 9, 10, 11], transform: (slot: SlotSpec): SlotSpec =>
        slot.primary ? { ...slot, rpe: 9 } : { ...slot, rpe: 9, sets: slot.sets + (slot.sets < 4 ? 1 : 0) } },
    { name: 'Escape', weeks: [12], transform: (slot: SlotSpec): SlotSpec => ({ ...slot, sets: Math.max(1, slot.sets - 1) }) },
];

const base = definePlan({ id: 'event-horizon', name: 'Event Horizon', weeks: 12, defaultTempo: '20X0', days: EVENT_HORIZON_DAYS, phases });

/**
 * Applies only swaps the athlete has already accepted. Recommendations are
 * produced by the engine and surfaced in the UI — this hook never decides
 * anything on its own.
 */
const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const week = Number(day.id?.match(/-w(\d+)-/)?.[1] ?? day.weekNumber ?? 1);
    const accepted = user.eventHorizonStatus?.acceptedSwaps ?? {};
    const named = week === 7 ? { ...day, dayName: `Deload — ${day.dayName}` } : day;
    if (!Object.keys(accepted).length) return named;

    return { ...named, exercises: named.exercises.flatMap(exercise => {
        const replacement = exercise.exerciseId ? accepted[exercise.exerciseId] : undefined;
        if (!replacement) return [exercise];

        // A split replaces one movement with two, each carrying part of the
        // role at a lower cost. Sets are halved rather than doubled.
        const ids = Array.isArray(replacement) ? replacement : [replacement];
        const entries = ids.map(id => EXERCISE_BY_ID[id]).filter(Boolean);
        if (!entries.length) return [exercise];

        const sets = entries.length > 1 ? Math.max(1, Math.ceil(exercise.sets / entries.length)) : exercise.sets;
        return entries.map((entry, index) => ({
            ...exercise,
            id: `${exercise.id}-swap${index + 1}`,
            exerciseId: entry!.id,
            name: entry!.name.en,
            sets,
        }));
    }) };
};

export const EVENT_HORIZON_CONFIG: PlanConfig = {
    ...base,
    session: { kind: 'rotation', rotation: { capPer7Days: 6 } },
    schedule: { selectable: false },
    hooks: { ...base.hooks, preprocessDay: preprocess },
    ui: { themeClass: 'theme-event-horizon', coverImage: '/eventhorizon.png', navImage: '/eventhorizon.png', dashboardWidgets: ['program_status', 'workout_history'] },
};
