/**
 * Generic double-progression for definePlan slots.
 *
 * Plans that tag `progression: { type: 'double' }` but have no dedicated
 * handler were leaving next week's load blank. This writes a working load
 * keyed by plan + library id when every prescribed set hits the top of the range.
 */

import { doubleProgression } from '../engines/progression';
import { empty, workSets } from './types';
import type { ProgressionContext, ProgressionResult } from './types';

const topOfRange = (reps: string): number => {
    const parts = reps.split('-').map(Number).filter(Number.isFinite);
    return parts.length ? Math.max(...parts) : 0;
};

export const genericDoubleProgression = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.isExistingLog || !ctx.workout) return empty();

    const planLoads = { ...(ctx.user.workingLoads?.[ctx.planId] ?? {}) };
    let wrote = false;

    for (const exercise of ctx.workout.exercises) {
        const id = exercise.exerciseId;
        if (!id) continue;
        const increment = exercise.prescription?.topSetBackoff?.incrementKg ?? 2.5;
        const sets = workSets(ctx.sets[exercise.id]);
        if (!sets.length) continue;
        const current = parseFloat(sets[0]?.weight || '0');
        if (!(current > 0)) continue;
        const target = topOfRange(exercise.target.reps);
        if (!target) continue;
        const outcome = doubleProgression({
            prescribedSets: exercise.sets,
            targetMaxReps: target,
            currentLoadKg: current,
            incrementKg: increment,
            sets: sets.map(set => ({
                completed: Boolean(set.completed),
                reps: parseInt(set.reps || '0', 10) || 0,
                weightKg: current,
                rir: set.rir,
                quality: set.quality,
            })),
        });
        planLoads[id] = outcome.nextLoadKg;
        wrote = true;
    }

    if (!wrote) return empty();
    return {
        updates: { [`workingLoads.${ctx.planId}`]: planLoads },
        appends: [],
        effects: [],
    };
};
