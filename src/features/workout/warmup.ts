/**
 * Warm-up prescription.
 *
 * Warm-ups are guidance, never log rows: they must not reach history, volume
 * or any progression handler, or a plan would read a 40% single as a working
 * set and back the athlete off. Nothing here writes; the console renders it.
 *
 * Two schemes, chosen by what the set actually asks for:
 *
 *  - A heavy compound at 1-6 reps ramps from the empty bar. You cannot walk up
 *    to a heavy single cold, and the ramp doubles as technique rehearsal.
 *  - Everything else gets one set of 12 at half the working weight. More than
 *    that on an accessory is just fatigue spent before the work.
 *
 * When the working weight is not known yet — a calibration week, an untested
 * lift — the percentages are shown instead of invented kilos.
 */

import { roundToIncrement } from './engines/prescription';

/** A loaded olympic bar. Warm-ups on a barbell start here, not at zero. */
export const BAR_KG = 20;

export interface WarmupSet {
    /** Percent of the working weight. 0 marks the empty bar. */
    percent: number;
    reps: number;
    /** Absent when the working weight is unknown — render the percent instead. */
    weightKg?: number;
    /** True for the empty-bar set, which is named rather than numbered. */
    bar?: boolean;
}

/**
 * Patterns that earn the full ramp, paired with a barbell.
 *
 * Read off the library rather than kept as a list of ids: a hand-written list
 * of "squat, bench, deadlift, OHP, rows" has to name every variant, and a
 * variant added later silently loses its warm-up. Equipment plus pattern says
 * the same thing and stays true as the library grows.
 *
 * `inverted-row` is a horizontal-pull the library tags barbell; it carries no
 * external load, so the weight branch below simply has nothing to scale and it
 * falls through to the accessory set.
 */
export const RAMPED_PATTERNS = new Set([
    'squat', 'hinge', 'horizontal-press', 'incline-press', 'vertical-press', 'horizontal-pull',
]);

/** The ramp, as a share of the working weight. */
const RAMP: ReadonlyArray<{ percent: number; reps: number }> = [
    { percent: 0.40, reps: 8 },
    { percent: 0.55, reps: 5 },
    { percent: 0.70, reps: 3 },
    { percent: 0.85, reps: 1 },
];

/**
 * The heaviest rep in the prescription, which is what decides the scheme.
 *
 * A range is read at its bottom end: "3-5" is a heavy triple that wants the
 * full ramp, and reading the top would demote it. Prose and holds return
 * undefined and fall to the accessory scheme.
 */
export const topRepOf = (target: string | number | undefined): number | undefined => {
    if (typeof target === 'number') return target;
    if (!target) return undefined;
    const first = String(target).match(/\d+/);
    return first ? Number(first[0]) : undefined;
};

export const isHeavyCompound = (
    exercise: { equipment?: readonly string[]; pattern?: string } | undefined,
    target: string | number | undefined,
): boolean => {
    if (!exercise?.equipment?.includes('barbell')) return false;
    if (!exercise.pattern || !RAMPED_PATTERNS.has(exercise.pattern)) return false;
    const reps = topRepOf(target);
    return reps !== undefined && reps <= 6;
};

/**
 * @param workingKg the load for the first working set, if it is known.
 */
export const warmupFor = (
    exercise: { equipment?: readonly string[]; pattern?: string } | undefined,
    target: string | number | undefined,
    workingKg: number | undefined,
    incrementKg = 2.5,
): WarmupSet[] => {
    const known = typeof workingKg === 'number' && Number.isFinite(workingKg) && workingKg > 0;

    if (!isHeavyCompound(exercise, target)) {
        return [{ percent: 0.5, reps: 12, weightKg: known ? roundToIncrement(workingKg! * 0.5, incrementKg) : undefined }];
    }

    const ramp = RAMP
        // A rung at or below the bar is the bar again. Dropped rather than
        // shown, so a 60kg bencher is not told to warm up twice at 20kg.
        .filter(step => !known || roundToIncrement(workingKg! * step.percent, incrementKg) > BAR_KG)
        .map(step => ({
            percent: step.percent,
            reps: step.reps,
            weightKg: known ? roundToIncrement(workingKg! * step.percent, incrementKg) : undefined,
        }));

    return [{ percent: 0, reps: 10, weightKg: known ? BAR_KG : undefined, bar: true }, ...ramp];
};
