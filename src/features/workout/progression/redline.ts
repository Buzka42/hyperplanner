import { merge } from './types';
import type { ProgressionContext, ProgressionResult } from './types';
import { genericDoubleProgression } from './genericDouble';

/**
 * A confirmed recovery check only applies to the next session. Saving clears
 * it so the athlete answers again before the following one.
 */
export const redlineProgression = (ctx: ProgressionContext): ProgressionResult => {
    const double = genericDoubleProgression(ctx);
    if (ctx.isExistingLog) return double;
    if (!ctx.user.redlineStatus?.nextRecovery) return double;

    return merge(double, {
        updates: {
            'redlineStatus.nextRecovery': {
                response: ctx.user.redlineStatus.nextRecovery.response,
                confirmed: false,
                recordedAt: new Date().toISOString(),
            },
        },
        appends: [],
        effects: [],
    });
};
