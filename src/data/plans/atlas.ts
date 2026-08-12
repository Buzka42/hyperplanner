/**
 * ATLAS — 10 weeks, three-day full body, run as two five-week gauntlets.
 *
 * The gauntlet structure is the point: five weeks is long enough to get good at
 * a movement set, and the second gauntlet changes the pattern rather than the
 * page layout. Carries are trained as a lift, not as a finisher — see
 * `src/features/atlas/carries.ts` for the `time × load` metric.
 */

import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { APPROVED_HINGES, gauntletFor } from '../../features/atlas/carries';
import { seedLoadFor } from '../../features/onboarding/seedLoads';
import { EXERCISE_BY_ID } from '../exercises/library';

const double = { type: 'double' as const, increment: 2.5 };
// Primary lifts are strength work: controlled down, explosive up.
const s = (ex: string, sets: number, reps = '6-10', options: Partial<SlotSpec> = {}): SlotSpec =>
    ({ ex, sets, reps, restSeconds: options.systemicCompound ? 180 : 90, progression: double, ...(options.primary && { tempo: '10X0' }), ...options });

/** Carries are prescribed in seconds; `reps` carries the interval. */
const carry = (ex: string, sets: number, seconds: string, options: Partial<SlotSpec> = {}): SlotSpec =>
    ({ ex, sets, reps: seconds, restSeconds: 120, notes: 'Logged as time × load. Tag what ended the set.', ...options });

/** Gauntlet 1 — safety bar, trap bar, standing press, weighted pull-up. */
export const ATLAS_GAUNTLET_ONE: DaySpec[] = [
    { name: 'Atlas I — Carry the Bar', dayOfWeek: 1, slots: [
        s('safety-bar-squat', 4, '5-8', { systemicCompound: true, primary: true }),
        s('standing-barbell-military-press', 3, '5-8', { primary: true }),
        s('single-arm-hammer-row', 3, '8-12', { unilateral: true }),
        s('single-leg-rdl', 2, '8-10', { unilateral: true }),
        s('ab-wheel', 2, '8-12'),
        carry('farmer-carry', 3, '40-60'),
    ] },
    { name: 'Atlas II — Carry the Weight', dayOfWeek: 3, slots: [
        s('trap-bar-deadlift', 4, '4-6', { systemicCompound: true, primary: true }),
        s('weighted-pull-up', 3, '4-8', { primary: true }),
        s('incline-dumbbell-bench-press', 3, '6-10'),
        s('front-foot-elevated-bulgarian-split-squat', 2, '8-12', { unilateral: true }),
        s('hack-calf-raise', 2, '12-20'),
        s('cable-triceps-extension', 1, '10-15'),
        carry('suitcase-carry', 2, '30-40', { unilateral: true }),
    ] },
    { name: 'Atlas III — Carry the Rest', dayOfWeek: 5, slots: [
        s('safety-bar-squat', 3, '6-10', { systemicCompound: true }),
        s('flat-dumbbell-press', 3, '6-10'),
        s('barbell-row', 3, '6-10'),
        s('seated-hamstring-curl', 2, '10-15'),
        s('lateral-raise', 2, '12-15'),
        s('hammer-curl', 2, '8-12'),
        s('cable-triceps-extension', 1, '10-15'),
        s('hack-calf-raise', 1, '12-20'),
        carry('suitcase-hold', 2, '30-45', { unilateral: true, optional: true }),
    ] },
];

/**
 * Gauntlet 2 — the same qualities through different movements. Unilateral and
 * overhead work take a larger share now that the patterns are established.
 */
export const ATLAS_GAUNTLET_TWO: DaySpec[] = [
    { name: 'Atlas IV — Carry the Bar', dayOfWeek: 1, slots: [
        s('front-squat', 4, '4-6', { systemicCompound: true, primary: true, alternates: ['Safety Bar Squat'] }),
        s('single-arm-standing-press', 3, '6-10', { unilateral: true, primary: true }),
        s('weighted-pull-up', 3, '4-8'),
        s('staggered-stance-rdl', 2, '8-12', { unilateral: true }),
        s('hanging-knee-raise', 2, '10-15'),
        carry('farmer-carry', 3, '50-70'),
    ] },
    { name: 'Atlas V — Carry the Weight', dayOfWeek: 3, slots: [
        s('trap-bar-deadlift', 4, '3-5', { systemicCompound: true, primary: true }),
        s('incline-dumbbell-bench-press', 3, '5-8', { primary: true }),
        s('half-kneeling-rotational-row', 3, '8-12', { unilateral: true }),
        s('weighted-step-up', 2, '8-10', { unilateral: true }),
        s('hack-calf-raise', 2, '12-20'),
        s('cable-triceps-extension', 1, '10-15'),
        carry('suitcase-carry', 2, '40-50', { unilateral: true }),
    ] },
    { name: 'Atlas VI — Carry the Rest', dayOfWeek: 5, slots: [
        s('safety-bar-squat', 3, '6-10', { systemicCompound: true }),
        s('standing-barbell-military-press', 3, '6-10'),
        s('single-arm-hammer-row', 3, '8-12', { unilateral: true }),
        s('lying-leg-curl', 2, '10-15'),
        s('lateral-raise', 2, '12-15'),
        s('hammer-curl', 2, '8-12'),
        s('cable-triceps-extension', 1, '10-15'),
        s('hack-calf-raise', 1, '12-20'),
        s('dip', 2, '6-10'),
        carry('suitcase-hold', 2, '30-45', { unilateral: true, optional: true }),
    ] },
];

const phases = [
    { name: 'Gauntlet I', weeks: [1, 2, 3, 4, 5] },
    { name: 'Gauntlet II', weeks: [6, 7, 8, 9, 10] },
];

const one = definePlan({ id: 'atlas', name: 'Atlas', weeks: 10, days: ATLAS_GAUNTLET_ONE, phases });
const two = definePlan({ id: 'atlas-gauntlet-two-internal', name: 'Atlas', weeks: 10, days: ATLAS_GAUNTLET_TWO, phases });

const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const match = day.id?.match(/-w(\d+)-d(\d+)$/);
    if (!match) return day;
    const week = Number(match[1]);

    const source = gauntletFor(week) === 1
        ? day
        : two.program.weeks[week - 1]?.days.find(candidate => candidate.dayOfWeek === Number(match[2])) ?? day;

    // The hinge is the athlete's choice among approved variants, held for the
    // whole run rather than picked per session.
    const hinge = user.planPreferences?.atlas?.exerciseSelections?.hinge;
    if (!hinge || !APPROVED_HINGES.includes(hinge)) return source;
    const entry = EXERCISE_BY_ID[hinge];
    if (!entry) return source;

    return { ...source, exercises: source.exercises.map(exercise =>
        exercise.exerciseId === 'trap-bar-deadlift'
            ? { ...exercise, exerciseId: entry.id, name: entry.name.en }
            : exercise) };
};


/**
 * Opening loads from the maxes collected at onboarding.
 *
 * Only the first exposure: once a set is logged the plan's own progression owns
 * the load, and `Atlas` never overrides a value the athlete has moved.
 */
const seededWeight = (base: PlanConfig): NonNullable<PlanConfig['hooks']>['calculateWeight'] =>
    (target, user, exerciseName, context) => {
        const existing = base.hooks?.calculateWeight?.(target, user, exerciseName, context);
        if (existing) return existing;

        const entry = Object.values(EXERCISE_BY_ID).find(item => item.name.en === exerciseName || item.name.pl === exerciseName);
        if (!entry) return undefined;
        const seed = seedLoadFor(user?.stats, entry.id, String(target?.reps ?? '8'));
        return seed ? String(seed.kg) : undefined;
    };

export const ATLAS_CONFIG: PlanConfig = {
    ...one,
    // Safety-bar squat, trap-bar deadlift and the standing press are heavy from
    // week one, so the plan asks for the maxes behind them rather than letting
    // the athlete guess. Both are optional.
    onboarding: { ...one.onboarding, seedStats: ['squat', 'conventionalDeadlift', 'standingPress'] },
    hooks: { ...one.hooks, preprocessDay: preprocess, calculateWeight: seededWeight(one) },
    ui: { themeClass: 'theme-atlas', coverImage: '/atlas.png', navImage: '/atlas.png', dashboardWidgets: ['program_status', 'workout_history'] },
};
