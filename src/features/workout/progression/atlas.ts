import { merge, workSets } from './types';
import type { ProgressionContext, ProgressionResult } from './types';
import { genericDoubleProgression } from './genericDouble';

export const atlasProgression = (ctx: ProgressionContext): ProgressionResult => {
    const double = genericDoubleProgression(ctx);
    if (ctx.isExistingLog || !ctx.workout) return double;

    const carries = [...(ctx.user.atlasStatus?.carries ?? [])];
    for (const exercise of ctx.workout.exercises) {
        const id = exercise.exerciseId ?? '';
        if (!id.includes('carry') && id !== 'suitcase-hold') continue;
        const sets = workSets(ctx.sets[exercise.id]).filter(set => set.completed);
        if (!sets.length) continue;
        const seconds = sets.reduce((sum, set) => sum + (Number(set.reps) || 0), 0);
        const loadKg = Number(sets[0]?.weight) || 0;
        carries.push({
            exerciseId: id,
            week: ctx.week,
            seconds,
            loadKg,
            implements: 1,
            limiter: ctx.selections?.carryLimiter?.[exercise.id],
            date: new Date().toISOString(),
        });
    }

    return merge(double, {
        updates: { 'atlasStatus.carries': carries },
        appends: [],
        effects: [],
    });
};
