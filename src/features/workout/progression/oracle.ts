import { merge, workSets } from './types';
import type { ProgressionContext, ProgressionResult } from './types';
import { genericDoubleProgression } from './genericDouble';
import { predictionError } from '../../oracle/prediction';

export const oracleProgression = (ctx: ProgressionContext): ProgressionResult => {
    const double = genericDoubleProgression(ctx);
    if (ctx.isExistingLog || !ctx.workout) return double;

    const exposures = [...(ctx.user.oracleStatus?.exposures ?? [])];
    const errors = [...(ctx.user.oracleStatus?.errors ?? [])];

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

        if (exercise.predictedKg != null && exercise.predictedKg > 0) {
            const targetReps = exercise.target.reps.split('-').map(Number);
            const error = predictionError({
                predictedLoadKg: exercise.predictedKg,
                predictedReps: [targetReps[0] || 5, targetReps[1] || targetReps[0] || 8],
                actualLoadKg: Number(best.weight) || 0,
                actualReps: Number(best.reps) || 0,
                actualRir: best.rir,
                confidence: 'medium',
            });
            errors.push({
                week: ctx.week,
                exerciseId: id,
                error,
                confidence: error <= 0.05 ? 'high' : error <= 0.1 ? 'medium' : 'low',
            });
        }
    }

    return merge(double, {
        updates: {
            'oracleStatus.exposures': exposures.slice(-120),
            'oracleStatus.errors': errors.slice(-80),
        },
        appends: [],
        effects: [],
    });
};
