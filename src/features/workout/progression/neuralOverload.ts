import { empty, workSets } from './types';
import type { ProgressionContext, ProgressionResult } from './types';

export const neuralOverloadProgression = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.isExistingLog || !ctx.workout) return empty();

    const holdWave2 = Boolean(ctx.user.neuralOverloadStatus?.holdWave2);
    const sixLoads = { ...(ctx.user.neuralOverloadStatus?.sixLoads ?? {}) };

    const neural = ctx.workout.exercises.filter(ex => ex.target.reps === '1' || ex.target.reps === '6' || ex.target.reps === '1-2');
    const firstSix = neural.find(ex => ex.target.reps === '6');
    const secondSix = neural.filter(ex => ex.target.reps === '6')[1];
    const grindSingle = neural.some(ex => {
        if (ex.target.reps !== '1' && ex.target.reps !== '1-2') return false;
        const sets = workSets(ctx.sets[ex.id]);
        return sets.some(set => set.completed && (set.rir === 0 || Number(set.reps) < 1));
    });

    let couple = false;
    if (firstSix && secondSix) {
        const a = workSets(ctx.sets[firstSix.id])[0];
        const b = workSets(ctx.sets[secondSix.id])[0];
        const aReps = Number(a?.reps);
        const bReps = Number(b?.reps);
        couple = Boolean(a?.completed && b?.completed && (a.rir ?? 0) >= 3 && bReps > aReps);
        if (couple && Number(b.weight) > 0) sixLoads[secondSix.exerciseId ?? secondSix.id] = Number(b.weight) + 2.5;
    }

    return {
        updates: {
            'neuralOverloadStatus.holdWave2': grindSingle || holdWave2,
            'neuralOverloadStatus.sixLoads': sixLoads,
            'neuralOverloadStatus.coupleNextSixes': couple,
        },
        appends: [],
        effects: [],
    };
};
