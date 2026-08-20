/**
 * QUADFATHER — 10 weeks of quad specialisation on four days.
 *
 * Quads are trained three times; everything else is maintained twice. The three
 * quad sessions are deliberately different jobs rather than three attempts at
 * the same one — Load, Depth and Burn — and the balance between them is what
 * the dashboard reports. See `src/features/quadfather/roles.ts`.
 */

import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { proposeKneeSwap, resolveDepth, roleOf } from '../../features/quadfather/roles';
import { EXERCISE_BY_ID } from '../exercises/library';

const double = { type: 'double' as const, increment: 2.5 };
const s = (ex: string, sets: number, reps = '8-12', options: Partial<SlotSpec> = {}): SlotSpec =>
    ({ ex, sets, reps, restSeconds: options.systemicCompound ? 180 : 90, progression: double, ...options });

export const QUADFATHER_DAYS: DaySpec[] = [
    // Quad exposure 1 — Load.
    { name: 'The Offer — Load', dayOfWeek: 1, slots: [
        s('hack-squat', 4, '5-8', { systemicCompound: true, primary: true }),
        s('heel-elevated-goblet-squat', 3, '8-12'),
        s('leg-extension', 2, '12-15', { technique: { kind: 'last-set-failure' } }),
        s('incline-dumbbell-bench-press', 3, '6-10'),
        s('single-arm-hammer-row', 3, '8-12', { unilateral: true }),
        s('cable-lateral-raise', 2, '12-15', { technique: { kind: 'last-set-failure' } }),
        s('cable-crunch', 2, '12-20'),
    ] },
    // Posterior and upper maintenance; no quad work at all, on purpose.
    { name: 'The Family — Maintain', dayOfWeek: 2, slots: [
        s('romanian-deadlift', 3, '6-10', { systemicCompound: true }),
        s('lat-prayer', 3, '8-12'),
        s('dip', 3, '8-12'),
        s('seated-hamstring-curl', 3, '10-15'),
        s('bench-supported-dumbbell-rear-delt-fly', 2, '12-15', { unilateral: true }),
        s('ezbar-preacher-curl', 2, '8-12'),
        s('overhead-tricep-extension', 2, '8-15'),
        s('hack-calf-raise', 2, '12-20'),
    ] },
    // Quad exposure 2 — Unilateral/Depth.
    { name: 'The Debt — Depth', dayOfWeek: 4, slots: [
        s('front-foot-elevated-bulgarian-split-squat', 3, '8-12', { unilateral: true }),
        s('leg-press', 3, '10-15', { systemicCompound: true }),
        s('supported-sissy-squat', 2, '10-15', { technique: { kind: 'last-set-failure' } }),
        s('seated-hammer-shoulder-press', 3, '8-12'),
        s('hammer-pulldown', 3, '8-12'),
        s('hack-calf-raise', 2, '12-20'),
        s('cable-crunch', 3, '12-20'),
    ] },
    // Quad exposure 3 — Burn. Light on the spine by design, since it follows
    // two quad sessions and a hinge day.
    { name: 'The Reckoning — Burn', dayOfWeek: 5, slots: [
        s('knee-over-toe-split-squat', 3, '8-12', { unilateral: true }),
        s('stripper-squat', 3, '10-15'),
        s('reverse-nordic-curl', 2, '8-12', { technique: { kind: 'last-set-failure' } }),
        s('lying-leg-curl', 2, '10-15'),
        s('single-arm-hammer-row', 3, '8-12', { unilateral: true }),
        s('ezbar-preacher-curl', 2, '10-15'),
        s('cable-triceps-extension', 2, '10-15'),
    ] },
];

const phases = [
    { name: 'Introduction', weeks: [1, 2, 3] },
    { name: 'Enforcement', weeks: [4, 5, 6, 7], transform: (slot: SlotSpec): SlotSpec =>
        roleOf(slot.ex) === 'burn' ? { ...slot, technique: { kind: 'myo-reps', miniSets: 3, miniReps: '4-5', restBreaths: 5 } } : slot },
    { name: 'Succession', weeks: [8, 9], transform: (slot: SlotSpec): SlotSpec =>
        roleOf(slot.ex) === 'load' ? { ...slot, reps: '4-6' } : slot },
    { name: 'Settlement', weeks: [10], transform: (slot: SlotSpec): SlotSpec => ({ ...slot, sets: Math.max(1, slot.sets - 1) }) },
];

const base = definePlan({ id: 'quadfather', name: 'Quadfather', weeks: 10, defaultTempo: '20X0', days: QUADFATHER_DAYS, phases });

/**
 * Applies the athlete's confirmed main-load choice, their confirmed depth, and
 * any knee-feedback swap they have accepted. Nothing is swapped here that the
 * athlete has not already confirmed — `proposeKneeSwap` only produces offers.
 */
const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const choices = user.planPreferences?.quadfather?.exerciseSelections ?? {};
    const week = Number(day.id?.match(/-w(\d+)-/)?.[1] ?? 1);
    // Accepted knee swaps, latest confirmation per movement wins.
    const accepted = new Map<string, string>();
    const strainedCounts = new Map<string, number>();
    for (const entry of user.quadfatherStatus?.kneeFeedback ?? []) {
        if (entry.acceptedSwap && entry.week <= week) accepted.set(entry.exerciseId, entry.acceptedSwap);
        if (entry.severity !== 'normal' && !entry.acceptedSwap) {
            strainedCounts.set(entry.exerciseId, (strainedCounts.get(entry.exerciseId) ?? 0) + 1);
        }
    }
    const autoSwaps = new Map<string, string>();
    for (const [exerciseId, count] of strainedCounts) {
        if (count < 2) continue;
        const offer = proposeKneeSwap(exerciseId, 'strained');
        if (offer?.to) autoSwaps.set(exerciseId, offer.to);
    }

    return { ...day, exercises: day.exercises.map(exercise => {
        let next = exercise;

        if (exercise.exerciseId === 'hack-squat' && choices.mainLoad) {
            const entry = EXERCISE_BY_ID[choices.mainLoad];
            if (entry) next = { ...next, exerciseId: entry.id, name: entry.name.en };
        }

        const swap = next.exerciseId
            ? choices[`swap:${next.exerciseId}`] ?? accepted.get(next.exerciseId) ?? autoSwaps.get(next.exerciseId)
            : undefined;
        if (swap && next.exerciseId && roleOf(swap) && roleOf(swap) === roleOf(next.exerciseId)) {
            const entry = EXERCISE_BY_ID[swap];
            if (entry) next = { ...next, exerciseId: entry.id, name: entry.name.en };
        }

        const depth = next.exerciseId ? resolveDepth(next.exerciseId, user.quadfatherStatus) : { source: 'unknown' as const };
        if (depth.source === 'unknown' && next.exerciseId && roleOf(next.exerciseId)) {
            next = { ...next, notes: next.notes ?? 'Confirm your depth after the first set.' };
        }
        return next;
    }) };
};

export const QUADFATHER_CONFIG: PlanConfig = {
    ...base,
    hooks: { ...base.hooks, preprocessDay: preprocess },
    ui: { themeClass: 'theme-quadfather', coverImage: '/quadfather.png', navImage: '/quadfather.png', dashboardWidgets: ['program_status', 'workout_history'] },
};

export { proposeKneeSwap };
