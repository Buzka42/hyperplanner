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
    /**
     * The assisted pull-up graduates on clean reps, not on load.
     *
     * Five unassisted reps opening the movement, twice running, means the
     * assistance has stopped being the limiter — the athlete moves to an
     * overhand pull-up at 3-5. Five clean across every set instead earns a
     * note to add their own weight next time.
     */
    const updates: Record<string, unknown> = { 'athenaStatus.exerciseLoads': loads };
    const pullUp = ctx.workout.exercises.find(exercise => exercise.exerciseId === 'assisted-pull-up');
    if (pullUp) {
        const sets = workSets(ctx.sets[pullUp.id]).slice(0, pullUp.sets);
        const cleanIn = (set: typeof sets[number] | undefined) => Number(set?.cleanReps ?? 0);
        const openedClean = sets.length > 0 && sets[0]?.completed === true && cleanIn(sets[0]) >= 5;
        const allClean = sets.length >= pullUp.sets && sets.every(set => set.completed && cleanIn(set) >= 5);
        const streak = openedClean ? (ctx.user.athenaStatus?.cleanPullUpStreak ?? 0) + 1 : 0;

        if (streak >= 2) {
            updates['athenaStatus.pullUpGraduated'] = true;
            updates['athenaStatus.cleanPullUpStreak'] = 0;
        } else {
            updates['athenaStatus.cleanPullUpStreak'] = streak;
        }
        updates['athenaStatus.pullUpAddLoad'] = allClean && streak < 2;
    }

    return { updates, appends: [], effects: [] };
};
