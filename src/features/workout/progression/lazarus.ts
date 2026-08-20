import { merge, workSets } from './types';
import type { ProgressionContext, ProgressionResult } from './types';
import { genericDoubleProgression } from './genericDouble';

const topOfRange = (reps: string): number => {
    const parts = reps.split('-').map(Number).filter(Number.isFinite);
    return parts.length ? Math.max(...parts) : 0;
};

/**
 * Two clean sessions that beat the prescription are the Memory Curve's
 * acceleration signal. One is noise; this write is what makes the second count.
 */
export const lazarusProgression = (ctx: ProgressionContext): ProgressionResult => {
    const double = genericDoubleProgression(ctx);
    if (ctx.isExistingLog || !ctx.workout) return double;

    const work = ctx.workout.exercises.filter(exercise => {
        const target = topOfRange(exercise.target.reps);
        if (!target) return false;
        const sets = workSets(ctx.sets[exercise.id]);
        if (sets.length < exercise.sets) return false;
        const predicted = exercise.predictedKg;
        return sets.every(set => {
            if (!set.completed) return false;
            if ((Number(set.reps) || 0) < target) return false;
            if (predicted != null && (Number(set.weight) || 0) < predicted) return false;
            return true;
        });
    });

    if (!work.length) return double;

    const underestimated = [...(ctx.user.lazarusStatus?.underestimated ?? []), {
        week: ctx.week,
        date: new Date().toISOString(),
    }].slice(-12);

    return merge(double, {
        updates: { 'lazarusStatus.underestimated': underestimated },
        appends: [],
        effects: [],
    });
};
