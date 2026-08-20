import { merge, workSets } from './types';
import type { ProgressionContext, ProgressionResult } from './types';
import { genericDoubleProgression } from './genericDouble';
import { roleBalance } from '../../quadfather/roles';

export const quadfatherProgression = (ctx: ProgressionContext): ProgressionResult => {
    const double = genericDoubleProgression(ctx);
    if (ctx.isExistingLog || !ctx.workout) return double;

    const rom = { ...(ctx.user.quadfatherStatus?.rom ?? {}) };
    const kneeFeedback = [...(ctx.user.quadfatherStatus?.kneeFeedback ?? [])];
    let wrote = false;

    for (const exercise of ctx.workout.exercises) {
        const id = exercise.exerciseId;
        if (!id) continue;
        if (!workSets(ctx.sets[exercise.id]).some(set => set.completed)) continue;

        const depth = ctx.selections?.romDepth?.[exercise.id];
        if (depth) {
            rom[id] = { confirmed: depth, week: ctx.week };
            wrote = true;
        }

        const severity = ctx.selections?.kneeSeverity?.[exercise.id];
        if (severity) {
            kneeFeedback.push({ week: ctx.week, exerciseId: id, severity });
            wrote = true;
        }
    }

    const ids = ctx.workout.exercises.map(exercise => exercise.exerciseId).filter((id): id is string => !!id);
    const balance = roleBalance(ids);

    if (!wrote) {
        return merge(double, {
            updates: { 'quadfatherStatus.roleBalance': balance },
            appends: [],
            effects: [],
        });
    }

    return merge(double, {
        updates: {
            'quadfatherStatus.rom': rom,
            'quadfatherStatus.kneeFeedback': kneeFeedback.slice(-48),
            'quadfatherStatus.roleBalance': balance,
        },
        appends: [],
        effects: [],
    });
};
