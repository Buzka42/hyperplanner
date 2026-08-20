import { merge } from './types';
import type { ProgressionContext, ProgressionResult } from './types';
import { genericDoubleProgression } from './genericDouble';

/**
 * Total-rep slots are judged on set count, not load: hit the target in fewer
 * sets than last time. Extra rows the athlete added still count — that is the
 * work that produced the total.
 */
export const gravityProgression = (ctx: ProgressionContext): ProgressionResult => {
    const double = genericDoubleProgression(ctx);
    if (ctx.isExistingLog || !ctx.workout) return double;

    const existing = ctx.user.planPreferences?.['gravity-is-optional']?.exerciseSelections ?? {};
    const next = { ...existing };
    let wrote = false;

    for (const exercise of ctx.workout.exercises) {
        const technique = exercise.prescription?.technique;
        if (technique?.kind !== 'total-reps' || !exercise.exerciseId) continue;
        const logged = (ctx.sets[exercise.id] ?? []).filter(set => set.completed);
        if (!logged.length) continue;
        const total = logged.reduce((sum, set) => sum + (Number(set.reps) || 0), 0);
        if (total < technique.targetReps) continue;
        next[`totalRepSets:${exercise.exerciseId}`] = String(logged.length);
        wrote = true;
    }

    if (!wrote) return double;

    const prefs = ctx.user.planPreferences?.['gravity-is-optional'];
    return merge(double, {
        updates: {
            'planPreferences.gravity-is-optional': {
                scheduleMode: prefs?.scheduleMode ?? '4day',
                updatedAt: new Date().toISOString(),
                exerciseSelections: next,
            },
        },
        appends: [],
        effects: [],
    });
};
