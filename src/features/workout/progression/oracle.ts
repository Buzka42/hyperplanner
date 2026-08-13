import { merge, workSets } from './types';
import type { ProgressionContext, ProgressionResult } from './types';
import { genericDoubleProgression } from './genericDouble';

export const oracleProgression = (ctx: ProgressionContext): ProgressionResult => {
    const double = genericDoubleProgression(ctx);
    if (ctx.isExistingLog || !ctx.workout) return double;

    const exposures = [...(ctx.user.oracleStatus?.exposures ?? [])];
    for (const exercise of ctx.workout.exercises) {
        const id = exercise.exerciseId;
        if (!id) continue;
        const sets = workSets(ctx.sets[exercise.id]).filter(set => set.completed && Number(set.weight) > 0);
        if (!sets.length) continue;
        const best = sets.reduce((winner, set) =>
            (Number(set.reps) || 0) > (Number(winner.reps) || 0) ? set : winner);
        exposures.push({
            exerciseId: id,
            date: new Date().toISOString(),
            loadKg: Number(best.weight) || 0,
            reps: Number(best.reps) || 0,
            rir: best.rir,
            comparable: true,
        });
    }

    return merge(double, {
        updates: { 'oracleStatus.exposures': exposures },
        appends: [],
        effects: [],
    });
};
