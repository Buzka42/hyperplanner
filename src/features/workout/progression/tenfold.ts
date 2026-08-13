import { empty, workSets } from './types';
import type { ProgressionContext, ProgressionResult } from './types';

export const tenfoldProgression = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.isExistingLog || !ctx.workout) return empty();

    const main = ctx.workout.exercises.find(ex => ex.sets >= 8 || ex.target.reps === '10');
    if (!main) return empty();
    const sets = workSets(ctx.sets[main.id]).filter(set => set.completed);
    const collapse = sets.slice(0, 5).some(set => Number(set.reps) <= 7);
    const complete = sets.length >= main.sets && sets.every(set => Number(set.reps) >= Number(main.target.reps.split('-')[0] || 10));
    const load = Number(sets[0]?.weight);
    const next = collapse
        ? Math.round((load * 0.9) / 2.5) * 2.5
        : complete
            ? load + 2.5
            : load;

    const planLoads = { ...(ctx.user.workingLoads?.[ctx.planId] ?? {}) };
    if (main.exerciseId && Number.isFinite(next) && next > 0) planLoads[main.exerciseId] = next;

    return {
        updates: {
            [`workingLoads.${ctx.planId}`]: planLoads,
            'tenfoldStatus.collapsePending': collapse,
        },
        appends: [],
        effects: [],
    };
};
