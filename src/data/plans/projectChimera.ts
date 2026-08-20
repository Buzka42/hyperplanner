/**
 * PROJECT CHIMERA — 16 weeks, four-day upper/lower, four four-week blocks.
 *
 * The base programme is deliberately balanced across squat, hinge, push, pull,
 * unilateral and hypertrophy work. What changes is the allocation: after each
 * block the plan may propose moving up to two weekly sets per quality, and every
 * component of that proposal is previewed and separately confirmable.
 *
 * See `src/features/projectChimera/mutation.ts`. This module only applies what
 * the athlete has already accepted.
 */

import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { MINIMUM_WEEKLY_SETS, type Quality } from '../../features/projectChimera/mutation';
import { EXERCISE_BY_ID } from '../exercises/library';
import { seedLoadFor } from '../../features/onboarding/seedLoads';

const double = { type: 'double' as const, increment: 2.5 };
const s = (ex: string, sets: number, reps = '8-12', quality?: Quality, options: Partial<SlotSpec> = {}): SlotSpec =>
    ({ ex, sets, reps, restSeconds: options.systemicCompound ? 150 : 90, progression: double, notes: quality, ...options });

/** The quality each slot serves, keyed by exercise id. */
export const SLOT_QUALITY: Record<string, Quality> = {
    'barbell-squat': 'squat', 'hack-squat': 'squat', 'leg-press': 'squat',
    'romanian-deadlift': 'hinge', 'trap-bar-deadlift': 'hinge', 'seated-hamstring-curl': 'hinge', 'lying-leg-curl': 'hinge',
    'flat-barbell-bench-press': 'push', 'incline-dumbbell-bench-press': 'push', 'seated-dumbbell-shoulder-press': 'push',
    'single-arm-landmine-press': 'push', 'hammer-chest-press': 'push', '30-smith-incline-bench-press': 'push',
    'lat-pulldown': 'pull', 'single-arm-hammer-row': 'pull', 'hammer-pulldown': 'pull', 'barbell-row': 'pull',
    'pull-up': 'pull', 'bench-supported-one-arm-dumbbell-row': 'pull',
    'front-foot-elevated-bulgarian-split-squat': 'unilateral', 'single-leg-machine-hip-thrust': 'unilateral', 'weighted-step-up': 'unilateral',
    'lateral-raise': 'hypertrophy', 'leaning-one-arm-lateral-raise': 'hypertrophy',
    'hammer-curl': 'hypertrophy', 'standing-straight-bar-curl': 'hypertrophy',
    'cable-triceps-extension': 'hypertrophy', 'overhead-tricep-extension': 'hypertrophy', 'heavy-rolling-tricep-extension': 'hypertrophy',
    'single-arm-reverse-pec-deck': 'hypertrophy', 'side-lying-rear-delt-fly': 'hypertrophy',
    'leg-extension': 'hypertrophy', 'hack-calf-raise': 'hypertrophy', 'cable-crunch': 'hypertrophy',
};

export const CHIMERA_DAYS: DaySpec[] = [
    { name: 'Chimera — Upper A', dayOfWeek: 1, slots: [
        s('flat-barbell-bench-press', 4, '5-8', 'push', { primary: true }),
        s('single-arm-hammer-row', 2, '8-12', 'pull', { unilateral: true }),
        s('bench-supported-one-arm-dumbbell-row', 2, '8-12', 'pull', { unilateral: true }),
        s('single-arm-landmine-press', 3, '8-12', 'push'),
        s('pull-up', 3, '8-12', 'pull'),
        s('leaning-one-arm-lateral-raise', 2, '12-15', 'hypertrophy', { technique: { kind: 'last-set-failure' } }),
        s('standing-straight-bar-curl', 2, '8-12', 'hypertrophy', { technique: { kind: 'last-set-failure' } }),
        s('heavy-rolling-tricep-extension', 2, '10-15', 'hypertrophy', { technique: { kind: 'last-set-failure' } }),
        s('cable-crunch', 2, '8-12', 'hypertrophy'),
    ] },
    { name: 'Chimera — Lower A', dayOfWeek: 2, slots: [
        s('barbell-squat', 4, '5-8', 'squat', { systemicCompound: true, primary: true }),
        s('romanian-deadlift', 3, '6-10', 'hinge'),
        s('front-foot-elevated-bulgarian-split-squat', 3, '8-12', 'unilateral', { unilateral: true }),
        s('seated-hamstring-curl', 3, '10-15', 'hinge'),
        s('leg-extension', 2, '12-15', 'hypertrophy', { technique: { kind: 'last-set-failure' } }),
        s('hack-calf-raise', 3, '12-20', 'hypertrophy'),
    ] },
    { name: 'Chimera — Upper B', dayOfWeek: 4, slots: [
        s('hammer-pulldown', 4, '8-12', 'pull', { primary: true }),
        s('incline-dumbbell-bench-press', 2, '6-10', 'push'),
        s('30-smith-incline-bench-press', 2, '6-10', 'push'),
        s('barbell-row', 3, '6-10', 'pull'),
        s('hammer-chest-press', 3, '8-12', 'push'),
        s('side-lying-rear-delt-fly', 2, '12-15', 'hypertrophy', { unilateral: true, technique: { kind: 'last-set-failure' } }),
        s('cable-triceps-extension', 2, '10-15', 'hypertrophy', { technique: { kind: 'last-set-failure' } }),
        s('standing-straight-bar-curl', 2, '8-12', 'hypertrophy', { technique: { kind: 'last-set-failure' } }),
    ] },
    { name: 'Chimera — Lower B', dayOfWeek: 5, slots: [
        s('trap-bar-deadlift', 4, '4-6', 'hinge', { systemicCompound: true, primary: true }),
        s('leg-press', 3, '8-12', 'squat'),
        s('weighted-step-up', 3, '8-10', 'unilateral', { unilateral: true }),
        s('lying-leg-curl', 3, '10-15', 'hinge'),
        s('single-leg-machine-hip-thrust', 3, '10-15', 'unilateral', { unilateral: true }),
        s('hack-calf-raise', 3, '12-20', 'hypertrophy'),
    ] },
];

export const BLOCKS = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];

const phases = [
    { name: 'Block I', weeks: BLOCKS[0] },
    { name: 'Block II', weeks: BLOCKS[1], transform: (slot: SlotSpec): SlotSpec => slot.primary ? { ...slot, reps: '4-6' } : slot },
    { name: 'Block III', weeks: BLOCKS[2], transform: (slot: SlotSpec): SlotSpec => slot.primary ? slot : { ...slot, rpe: 9 } },
    { name: 'Block IV', weeks: BLOCKS[3], transform: (slot: SlotSpec): SlotSpec => slot.primary ? { ...slot, reps: '3-5' } : { ...slot, rpe: 9 } },
];

const base = definePlan({ id: 'project-chimera', name: 'Project Chimera', weeks: 16, defaultTempo: '20X0', days: CHIMERA_DAYS, phases });

export const blockFor = (week: number): number => BLOCKS.findIndex(weeks => weeks.includes(week)) + 1;

/**
 * Applies confirmed set reallocations and confirmed exercise changes. Every
 * quality keeps its floor here as well as in the engine, so a stale or
 * hand-edited status cannot strip a quality out of the programme.
 */
const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const status = user.projectChimeraStatus;
    if (!status) return day;

    const week = Number(day.id?.match(/-w(\d+)-/)?.[1] ?? 1);
    const block = blockFor(week);
    const allocation = status.allocation?.[block] ?? status.allocation?.[block - 1];
    const swaps = status.acceptedExerciseChanges ?? {};

    const withSwaps = day.exercises.map(exercise => {
        const replacement = exercise.exerciseId ? swaps[exercise.exerciseId] : undefined;
        const entry = replacement ? EXERCISE_BY_ID[replacement] : undefined;
        return entry ? { ...exercise, exerciseId: entry.id, name: entry.name.en } : exercise;
    });

    if (!allocation) return { ...day, exercises: withSwaps };

    // Reallocation is expressed per quality per week; spread it across the
    // slots of that quality in this session, never below one set.
    const pending = new Map<Quality, number>();
    for (const [quality, delta] of Object.entries(allocation) as [Quality, number][]) pending.set(quality, delta);

    return { ...day, exercises: withSwaps.map(exercise => {
        const quality = exercise.exerciseId ? SLOT_QUALITY[exercise.exerciseId] : undefined;
        if (!quality) return exercise;
        const delta = pending.get(quality) ?? 0;
        if (!delta) return exercise;
        const applied = delta > 0 ? 1 : -1;
        pending.set(quality, delta - applied);
        return { ...exercise, sets: Math.max(1, exercise.sets + applied) };
    }) };
};

/** Weekly sets per quality in the unmutated base plan. */
export const baseWeeklySets = (): Record<Quality, number> => {
    const totals = { squat: 0, hinge: 0, push: 0, pull: 0, unilateral: 0, hypertrophy: 0 } as Record<Quality, number>;
    for (const day of CHIMERA_DAYS) {
        for (const slot of day.slots) {
            const quality = SLOT_QUALITY[slot.ex];
            if (quality) totals[quality] += slot.sets;
        }
    }
    return totals;
};

export const meetsMinimums = (weekly: Record<Quality, number>): boolean =>
    (Object.keys(MINIMUM_WEEKLY_SETS) as Quality[]).every(quality => weekly[quality] >= MINIMUM_WEEKLY_SETS[quality]);


/**
 * Opening loads from the maxes collected at onboarding.
 *
 * Only the first exposure: once a set is logged the plan's own progression owns
 * the load, and `Project Chimera` never overrides a value the athlete has moved.
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

export const PROJECT_CHIMERA_CONFIG: PlanConfig = {
    ...base,
    session: { kind: 'rotation', rotation: { capPer7Days: 4 } },
    schedule: { selectable: false },
    onboarding: { ...base.onboarding, seedStats: ['squat', 'flatBench', 'conventionalDeadlift'] },
    hooks: { ...base.hooks, preprocessDay: preprocess, calculateWeight: seededWeight(base) },
    ui: { themeClass: 'theme-project-chimera', coverImage: '/projectchimera.png', navImage: '/projectchimera.png', dashboardWidgets: ['program_status', 'workout_history'] },
};
