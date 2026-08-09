/**
 * First-exposure calibration.
 *
 * An athlete who didn't know a 1RM at onboarding has that stat recorded on
 * `pendingCalibration` instead. The first time a plan prescribes the lift whose
 * loads depend on it, the session is flagged as a calibration set: work up to
 * roughly 8-10 reps at ~2 RIR, and the logged result establishes the max.
 *
 * Without this, a missing base makes `buildWeightCalculator` return undefined,
 * so the plan quietly runs on WorkoutView's generic estimate and none of its
 * authored percentages ever apply.
 *
 * Unlike the per-plan handlers this is plan-agnostic: it keys off the plan's
 * own `calibration.exerciseNameToStat` map, which `definePlan` derives from the
 * very progressions that consume the max.
 */

import type { LiftingStats } from '../../../types';
import { epley, validSets, type ProgressionContext, type ProgressionResult, empty } from './types';

/** Plate-realistic. Matches the rounding used across the progression handlers. */
const round2p5 = (n: number) => Math.round(n / 2.5) * 2.5;

export type CalibrationOutcome = {
    stat: keyof LiftingStats;
    exerciseName: string;
    /** The best set that produced the estimate. */
    weight: number;
    reps: number;
    /** Rounded estimated 1RM written to stats. */
    oneRepMax: number;
};

/**
 * Reported alongside the result so the UI can show what was established.
 * Populated by the same pass that builds the updates, rather than recomputed.
 */
export const calibrationOutcomes = (
    ctx: ProgressionContext,
    exerciseNameToStat: Record<string, keyof LiftingStats> | undefined,
): CalibrationOutcome[] => {
    const pending = ctx.user.pendingCalibration;
    if (!pending?.length || !exerciseNameToStat) return [];

    const outcomes: CalibrationOutcome[] = [];
    const claimed = new Set<keyof LiftingStats>();

    for (const exercise of ctx.workout?.exercises ?? []) {
        const stat = exerciseNameToStat[exercise.name];
        // Only calibrate what is actually outstanding, and only once per save
        // even if a plan prescribes the same lift twice in a session.
        if (!stat || !pending.includes(stat) || claimed.has(stat)) continue;

        const sets = validSets(ctx.sets[exercise.id]);
        if (!sets.length) continue;

        // Best estimate across the logged sets rather than simply the heaviest:
        // a hard set of 8 is a better read on the max than a light single.
        let best = sets[0];
        let bestE1rm = epley(best.weight, best.reps);
        for (const set of sets.slice(1)) {
            const e1rm = epley(set.weight, set.reps);
            if (e1rm > bestE1rm) { best = set; bestE1rm = e1rm; }
        }

        const oneRepMax = round2p5(bestE1rm);
        if (oneRepMax <= 0) continue;

        claimed.add(stat);
        outcomes.push({ stat, exerciseName: exercise.name, weight: best.weight, reps: best.reps, oneRepMax });
    }

    return outcomes;
};

export const calibrationProgression = (
    ctx: ProgressionContext,
    exerciseNameToStat?: Record<string, keyof LiftingStats>,
): ProgressionResult => {
    // Re-saving a completed session must not re-establish a max the athlete has
    // since trained past.
    if (ctx.isExistingLog) return empty();

    const outcomes = calibrationOutcomes(ctx, exerciseNameToStat);
    if (!outcomes.length) return empty();

    const updates: Record<string, unknown> = {};
    for (const outcome of outcomes) {
        updates[`stats.${outcome.stat}`] = outcome.oneRepMax;
    }

    // Rewrite the whole array rather than arrayRemove: the remaining keys are
    // known here, and a single assignment can't interleave with another save.
    const done = new Set(outcomes.map(o => o.stat));
    updates.pendingCalibration = (ctx.user.pendingCalibration ?? []).filter(stat => !done.has(stat));

    return { updates, appends: [], effects: [] };
};
