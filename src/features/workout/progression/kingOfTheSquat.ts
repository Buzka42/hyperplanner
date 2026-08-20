/**
 * King of the Squat — save-time flags.
 *
 * Two consecutive hip/capsule flags auto-swap the competition squat to the
 * safety bar (same pattern as Cathedral's limiter: the next session changes,
 * there is no extra modal). Stance/bar can also be swapped by hand.
 */

import { empty, merge } from './types';
import { genericDoubleProgression } from './genericDouble';
import type { ProgressionContext, ProgressionResult } from './types';

export const kingOfTheSquatProgression = (ctx: ProgressionContext): ProgressionResult => {
    // The handler below only manages the squat swap. Everything else in the
    // session still has to get its next load from somewhere, and a plan with
    // its own handler never falls back to the shared one — so compose it.
    const double = genericDoubleProgression(ctx);
    if (ctx.isExistingLog) return merge(double, empty());

    const squat = (ctx.workout?.exercises ?? []).find(ex =>
        ex.exerciseId === 'low-bar-squat' || ex.name.includes('Low Bar Squat') || ex.name === 'High Bar Squat' || ex.name === 'Safety Bar Squat',
    );
    if (!squat) return double;

    const flagged = Boolean(ctx.selections?.hipCapsule?.[squat.id]);
    const previous = (ctx.user as { kingOfTheSquatStatus?: { hipCapsuleStreak?: number } }).kingOfTheSquatStatus?.hipCapsuleStreak ?? 0;
    const streak = flagged ? previous + 1 : 0;
    const updates: Record<string, unknown> = {
        'kingOfTheSquatStatus.hipCapsuleStreak': streak,
    };

    if (streak >= 2) {
        updates[`exerciseSwaps.${ctx.planId}.low-bar-squat`] = 'safety-bar-squat';
        updates['kingOfTheSquatStatus.hipCapsuleStreak'] = 0;
    }

    return merge(double, { updates, appends: [], effects: [] });
};
