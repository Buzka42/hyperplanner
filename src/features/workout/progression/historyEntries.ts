/**
 * Strength-history recording for Peachy and Pencilneck.
 *
 * Both plans log a per-session best on one tracked lift, and both skip
 * re-saved sessions so re-opening a finished workout cannot double-count it.
 *
 * They differ in what "best" means, and the difference is deliberate:
 *   - Peachy records the heaviest completed squat set, because the plan
 *     progresses on load.
 *   - Pencilneck records the set with the highest estimated 1RM, because a
 *     hypertrophy plan on double progression can improve by adding reps at the
 *     same weight, and heaviest-set alone would miss that entirely.
 */

import { empty, epley, findExercise, merge, validSets } from './types';
import type { ProgressionContext, ProgressionResult } from './types';

const PEACHY_TRACKED_LIFT = 'Squats';
const PENCILNECK_TRACKED_LIFT = 'Flat Barbell Bench Press';

/** Peachy: heaviest completed squat set of the session. */
export const peachyProgression = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.isExistingLog) return empty();

    const exercise = findExercise(ctx.workout, PEACHY_TRACKED_LIFT);
    if (!exercise) return empty();

    const sets = validSets(ctx.sets[exercise.id]);
    if (!sets.length) return empty();

    const heaviest = sets.reduce((best, set) => (set.weight > best.weight ? set : best));
    if (heaviest.weight <= 0) return empty();

    return {
        updates: {},
        effects: [],
        appends: [{
            field: 'squatHistory',
            value: {
                date: new Date().toISOString(),
                week: ctx.week,
                weight: heaviest.weight,
                actualWeight: heaviest.weight,
                actualReps: heaviest.reps,
            },
        }],
    };
};

/**
 * Pencilneck completes on the Pull B session of week 8.
 *
 * The day is matched by name, with a fallback to day 5 for schedules where the
 * name check fails — the original comment on this was explicit that the
 * fallback exists because the name is not always reliable.
 */
const pencilneckCompletion = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.week !== 8) return empty();

    const isPullB = ctx.workout?.dayName.includes('Pull B') || ctx.day === 5;
    if (!isPullB) return empty();

    return {
        updates: {
            pencilneckStatus: { completed: true, completionDate: new Date().toISOString() },
        },
        appends: [],
        effects: [{ type: 'openPencilneckCompletion' }],
    };
};

/** Pencilneck: best estimated 1RM across completed bench sets. */
const pencilneckBenchHistory = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.isExistingLog) return empty();

    const exercise = findExercise(ctx.workout, PENCILNECK_TRACKED_LIFT);
    if (!exercise) return empty();

    const sets = validSets(ctx.sets[exercise.id]);
    if (!sets.length) return empty();

    const best = sets.reduce((winner, set) =>
        epley(set.weight, set.reps) > epley(winner.weight, winner.reps) ? set : winner
    );

    const estimated = epley(best.weight, best.reps);
    if (estimated <= 0) return empty();

    return {
        updates: {},
        effects: [],
        appends: [{
            field: 'pencilneckBenchHistory',
            value: {
                date: new Date().toISOString(),
                week: ctx.week,
                // Stored under `weight` for consistency with benchHistory, which
                // the charts read; the raw lift is kept alongside it.
                weight: Math.round(estimated),
                actualWeight: best.weight,
                actualReps: best.reps,
            },
        }],
    };
};

/** Pencilneck: strength history plus programme completion. */
export const pencilneckProgression = (ctx: ProgressionContext): ProgressionResult =>
    merge(pencilneckBenchHistory(ctx), pencilneckCompletion(ctx));
