/**
 * Opening loads from an entered max.
 *
 * Plans that overload by double progression still have to start *somewhere*,
 * and asking an athlete to guess their first working set is how a block starts
 * two weeks behind. Where a plan's primary lifts are genuinely heavy, it asks
 * for those maxes at onboarding and uses them to seed the first exposure only —
 * the plan's own progression takes over from the first logged set and is free to
 * move away from the seed entirely.
 *
 * Sister lifts derive from a parent max at owner-approved percentages, following
 * the precedent Bench Domination already sets (wide-grip 92%, Spoto 95%, low-pin
 * 88% of the paused bench). Every derived number is an estimate the athlete can
 * overwrite, and nothing here is ever presented as a tested max.
 *
 * Machine movements are deliberately absent: a hack squat load is not
 * comparable between gyms or even between machines, so those calibrate on the
 * first working set instead.
 */

import type { LiftingStats } from '../../types';

export interface Derivation {
    /** The max this is estimated from. */
    from: keyof LiftingStats;
    /** Fraction of the parent max. */
    percent: number;
}

/**
 * exerciseId -> where its load comes from.
 *
 * A `percent` of 1 means the movement *is* the lift the max was entered for.
 */
export const LIFT_SOURCES: Record<string, Derivation> = {
    // --- squat -------------------------------------------------------------
    'barbell-squat': { from: 'squat', percent: 1 },
    'low-bar-squat': { from: 'lowBarSquat', percent: 1 },
    'paused-squat': { from: 'squat', percent: 0.9 },
    'paused-back-squat': { from: 'squat', percent: 0.9 },
    'tempo-squat': { from: 'squat', percent: 0.85 },
    'front-squat': { from: 'squat', percent: 0.85 },
    'safety-bar-squat': { from: 'squat', percent: 0.9 },
    'high-bar-squat': { from: 'squat', percent: 1 },
    'high-box-squat': { from: 'squat', percent: 0.9 },
    'low-box-squat': { from: 'squat', percent: 0.9 },

    // --- deadlift ----------------------------------------------------------
    'conventional-deadlift': { from: 'conventionalDeadlift', percent: 1 },
    'sumo-deadlift': { from: 'conventionalDeadlift', percent: 1 },
    'trap-bar-deadlift': { from: 'conventionalDeadlift', percent: 1.05 },
    'deficit-deadlift': { from: 'conventionalDeadlift', percent: 0.9 },
    'paused-deadlift': { from: 'conventionalDeadlift', percent: 0.9 },
    'block-pull': { from: 'conventionalDeadlift', percent: 1.05 },

    // --- bench -------------------------------------------------------------
    'flat-barbell-bench-press': { from: 'flatBench', percent: 1 },
    'paused-bench-press': { from: 'pausedBench', percent: 1 },
    'close-grip-bench-press': { from: 'flatBench', percent: 0.92 },
    'incline-barbell-bench-press': { from: 'flatBench', percent: 0.85 },
    'spoto-press': { from: 'pausedBench', percent: 0.95 },
    'wide-grip-bench-press': { from: 'pausedBench', percent: 0.92 },
    'low-pin-press': { from: 'pausedBench', percent: 0.88 },

    // --- overhead ----------------------------------------------------------
    'standing-barbell-military-press': { from: 'standingPress', percent: 1 },
    'behind-the-neck-press': { from: 'standingPress', percent: 0.85 },
};

/**
 * The max behind a movement, entered or derived.
 *
 * Returns the source too, so the UI can say "estimated from your squat" rather
 * than presenting a guess as a measurement.
 */
export const maxFor = (
    stats: Partial<LiftingStats> | undefined,
    exerciseId: string,
): { kg: number; from: keyof LiftingStats; derived: boolean } | undefined => {
    const source = LIFT_SOURCES[exerciseId];
    if (!source || !stats) return undefined;
    let parent = stats[source.from];
    if ((typeof parent !== 'number' || parent <= 0) && source.from === 'pausedBench') parent = stats.flatBench;
    if (typeof parent !== 'number' || parent <= 0) return undefined;
    return {
        kg: Math.round((parent * source.percent) / 2.5) * 2.5,
        from: source.from,
        derived: source.percent !== 1,
    };
};

/**
 * The max a percentage prescription should be taken of, for one movement.
 *
 * A percentage is an intensity for *that* movement: 85% on a wide-grip bench
 * means 85% of what you can wide-grip, not 85% of your paused bench. Where a
 * plan prescribes off a parent lift, the variant's own ratio converts the
 * parent max first.
 *
 * The conversion applies only when the referenced stat *is* that parent. A plan
 * naming a movement's own tested max — Bench Domination collects the Spoto and
 * low-pin maxes directly — must use that number untouched rather than an
 * estimate derived from something else.
 */
export const percentageBaseFor = (
    stats: Partial<LiftingStats> | undefined,
    exerciseId: string | undefined,
    ref: keyof LiftingStats,
): number => {
    const entered = (stats?.[ref] as number) || 0;
    if (!entered || !exerciseId) return entered;
    const source = LIFT_SOURCES[exerciseId];
    if (!source || source.from !== ref || source.percent === 1) return entered;
    return entered * source.percent;
};

/**
 * Opening working load for a rep target, from a max.
 *
 * Inverse Epley, then a deliberate 5% haircut: the first session of a block
 * should be repeatable, and an athlete who opens too light catches up in a
 * week while one who opens too heavy loses two.
 */
export const openingLoad = (maxKg: number, targetReps: number): number => {
    if (maxKg <= 0 || targetReps <= 0) return 0;
    const raw = maxKg / (1 + targetReps / 30);
    return Math.round((raw * 0.95) / 2.5) * 2.5;
};

/**
 * The seed for a plan slot, or undefined when there is nothing to seed from.
 *
 * `reps` accepts the plan's own target string ('5-8', '4-6', '8').
 */
export const seedLoadFor = (
    stats: Partial<LiftingStats> | undefined,
    exerciseId: string,
    reps: string,
): { kg: number; derived: boolean; from: keyof LiftingStats } | undefined => {
    const max = maxFor(stats, exerciseId);
    if (!max) return undefined;
    // The top of the range is the honest target for an opening load: the
    // athlete should finish the first session having completed it.
    const parsed = reps.split('-').map(part => Number(part.trim())).filter(Number.isFinite);
    const target = parsed.length ? Math.max(...parsed) : 8;
    const kg = openingLoad(max.kg, target);
    return kg > 0 ? { kg, derived: max.derived, from: max.from } : undefined;
};

/** Stats a set of movements could use, for the onboarding form. */
export const statsUsedBy = (exerciseIds: string[]): (keyof LiftingStats)[] => {
    const wanted = new Set<keyof LiftingStats>();
    for (const id of exerciseIds) {
        const source = LIFT_SOURCES[id];
        if (source) wanted.add(source.from);
    }
    return [...wanted];
};
