import { merge } from './types';
import type { ProgressionContext, ProgressionResult } from './types';
import { genericDoubleProgression } from './genericDouble';
import { REGION_COSTS, type RegionReport } from '../../eventHorizon/costAwareSwaps';

export const eventHorizonProgression = (ctx: ProgressionContext): ProgressionResult => {
    const double = genericDoubleProgression(ctx);
    if (ctx.isExistingLog || !ctx.workout) return double;

    const incoming = ctx.selections?.regionReports ?? {};
    const reports = [...(ctx.user.eventHorizonStatus?.reports ?? [])];
    const fallbackId = ctx.workout.exercises.find(exercise => exercise.exerciseId)?.exerciseId ?? '';
    let wrote = false;

    for (const [key, value] of Object.entries(incoming)) {
        const report = value as RegionReport;
        if (!report) continue;
        const region = key in REGION_COSTS ? key : 'systemic';
        const exerciseId = key in REGION_COSTS ? fallbackId : key;
        reports.push({
            week: ctx.week,
            region,
            report,
            exerciseId,
            comparable: true,
        });
        wrote = true;
    }

    if (!wrote) return double;

    return merge(double, {
        updates: { 'eventHorizonStatus.reports': reports.slice(-64) },
        appends: [],
        effects: [],
    });
};
