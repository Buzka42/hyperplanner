import { empty, type ProgressionHandler, workSets } from './types';
import { topSetCanProgress } from '../engines/topSetBackoff';

const upper = (reps: string) => Number(reps.match(/\d+/g)?.at(-1) ?? 0);

export const athenaProgression: ProgressionHandler = ctx => {
    if (ctx.isExistingLog || !ctx.workout) return empty();
    const loads = { ...(ctx.user.athenaStatus?.exerciseLoads ?? {}) };
    for (const exercise of ctx.workout.exercises) {
        if (!exercise.exerciseId) continue;
        const sets = workSets(ctx.sets[exercise.id]).slice(0, exercise.sets);
        const top = sets[0];
        if (!top?.completed || !Number.isFinite(Number(top.weight))) continue;
        const current = Number(top.weight);
        const config = exercise.prescription?.topSetBackoff;
        if (config) {
            loads[exercise.exerciseId] = topSetCanProgress({ completed: top.completed, reps: Number(top.reps), targetMaxReps: upper(exercise.target.reps), rir: top.rir, quality: top.quality }) ? current + config.incrementKg : current;
        } else {
            const clean = sets.length >= exercise.sets && sets.every(set => set.completed && Number(set.reps) >= upper(exercise.target.reps));
            loads[exercise.exerciseId] = clean ? current + 2.5 : current;
        }
    }
    return { updates: { 'athenaStatus.exerciseLoads': loads }, appends: [], effects: [] };
};
