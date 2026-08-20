import { empty, merge, workSets } from './types';
import { genericDoubleProgression } from './genericDouble';
import type { ProgressionContext, ProgressionResult } from './types';

export const tenfoldProgression = (ctx: ProgressionContext): ProgressionResult => {
    // The 10x10 lift has its own rule — hold, or collapse to 90% — but the rest
    // of the session is ordinary accessory work. Without this the accessories
    // never got a next load, because a plan with its own handler never falls
    // back to the shared double progression.
    const double = genericDoubleProgression(ctx);
    if (ctx.isExistingLog || !ctx.workout) return merge(double, empty());

    const main = ctx.workout.exercises.find(ex => ex.sets >= 8 || ex.target.reps === '10');
    if (!main) return double;
    const sets = workSets(ctx.sets[main.id]).filter(set => set.completed);
    const collapse = sets.slice(0, 5).some(set => Number(set.reps) <= 7);
    const complete = sets.length >= main.sets && sets.every(set => Number(set.reps) >= Number(main.target.reps.split('-')[0] || 10));
    const load = Number(sets[0]?.weight);
    const next = collapse
        ? Math.round((load * 0.9) / 2.5) * 2.5
        : complete
            ? load + 2.5
            : load;

    // Start from what the shared pass already wrote, so the 10x10 rule adds to
    // the accessory loads rather than replacing the whole map.
    const planLoads = {
        ...(ctx.user.workingLoads?.[ctx.planId] ?? {}),
        ...((double.updates?.[`workingLoads.${ctx.planId}`] as Record<string, number>) ?? {}),
    };
    if (main.exerciseId && Number.isFinite(next) && next > 0) planLoads[main.exerciseId] = next;

    return merge(double, {
        updates: {
            [`workingLoads.${ctx.planId}`]: planLoads,
            'tenfoldStatus.collapsePending': collapse,
        },
        appends: [],
        effects: [],
    });
};
