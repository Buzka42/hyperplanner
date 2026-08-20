/**
 * Writes the session's best on the lift the strength chart actually reads.
 *
 * `trackedLiftFor` already knows which chart each plan shows; nothing was
 * appending to `liftHistory`, so those charts stayed empty (T-22).
 */

import { totalSystemWeightKg } from '../systemWeight';
import { empty, validSets } from './types';
import type { ProgressionContext, ProgressionResult } from './types';

type Tracked = { field: string; ids: string[] };

const TRACKED_BY_PLAN: Record<string, Tracked> = {
    'overhead-dominion': { field: 'liftHistory.standingPress', ids: ['standing-barbell-military-press'] },
    workhorse: { field: 'liftHistory.chinBelt', ids: ['weighted-chin-up'] },
    'gravity-is-optional': { field: 'liftHistory.chinBelt', ids: ['weighted-chin-up'] },
    'neural-overload': { field: 'liftHistory.chinBelt', ids: ['weighted-chin-up'] },
    'hamstring-foundry': { field: 'liftHistory.rdl', ids: ['barbell-romanian-deadlift', 'romanian-deadlift'] },
    cathedral: { field: 'liftHistory.inclineDb', ids: ['incline-dumbbell-bench-press'] },
    quadfather: { field: 'liftHistory.hackSquat', ids: ['hack-squat'] },
    'arms-race': { field: 'liftHistory.curl', ids: ['standing-straight-bar-curl'] },
    'immaculate-restructure': { field: 'liftHistory.lagging', ids: ['close-grip-bench-press'] },
    'king-of-the-squat': { field: 'squatHistory', ids: ['low-bar-squat', 'paused-back-squat', 'front-squat'] },
    athena: { field: 'squatHistory', ids: ['barbell-squat'] },
};

export const liftHistoryProgression = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.isExistingLog || !ctx.workout) return empty();
    const tracked = TRACKED_BY_PLAN[ctx.planId];
    if (!tracked) return empty();

    let best = 0;
    let bestReps = 0;
    for (const exercise of ctx.workout.exercises) {
        const id = exercise.exerciseId;
        if (!id || !tracked.ids.includes(id)) continue;
        const sets = validSets(ctx.sets[exercise.id]);
        for (const set of sets) {
            const load = totalSystemWeightKg(id, set.weight, ctx.user) ?? set.weight;
            if (load > best) {
                best = load;
                bestReps = set.reps;
            }
        }
    }
    if (!(best > 0)) return empty();

    const value = tracked.field === 'squatHistory'
        ? { date: new Date().toISOString(), week: ctx.week, weight: best, actualWeight: best, actualReps: bestReps }
        : { date: new Date().toISOString(), weight: best };

    return {
        updates: {},
        effects: [],
        appends: [{ field: tracked.field, value }],
    };
};
