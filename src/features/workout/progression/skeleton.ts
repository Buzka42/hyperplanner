/**
 * From Skeleton to Threat — save-time progression.
 *
 * Two rules, both documented in docs/plans/skeleton-to-threat.md:
 *
 *   1. Planks are time-based. Hit the target hold on every set and the target
 *      rises by 10 seconds for the next session. `plankTargetSeconds` is the
 *      single source of truth for both the displayed target and this check.
 *   2. Finishing the last training day of week 12 completes the programme.
 */

import { empty, findExercise, merge, workSets } from './types';
import type { ProgressionContext, ProgressionResult } from './types';

const PLANK = 'Planks';
const DEFAULT_PLANK_SECONDS = 30;
const PLANK_INCREMENT = 10;
const FINAL_WEEK = 12;

/** Target hold time, parsed from the prescription (e.g. "30sec"). */
const plankTarget = (reps: string): number =>
    parseInt(reps.replace(/[^0-9]/g, '')) || DEFAULT_PLANK_SECONDS;

const plankProgression = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.isExistingLog) return empty();

    const planks = findExercise(ctx.workout, PLANK);
    if (!planks) return empty();

    const sets = ctx.sets[planks.id];
    if (!sets?.length) return empty();

    const prescribed = workSets(sets);
    // A short session does not earn the increase, even if what was done hit
    // the target — the rule is "all sets", not "all the sets you did".
    if (prescribed.length < planks.sets) return empty();

    const target = plankTarget(planks.target.reps);
    const allHit = prescribed.every(s => s.completed && parseInt(s.reps || '0') >= target);
    if (!allHit) return empty();

    return {
        updates: { 'skeletonStatus.plankTargetSeconds': target + PLANK_INCREMENT },
        appends: [],
        effects: [],
    };
};

const completion = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.week !== FINAL_WEEK) return empty();

    // Completion fires on the athlete's own last training day, which depends on
    // the schedule they chose rather than on a fixed weekday.
    const selectedDays = ctx.user.selectedDays;
    if (!selectedDays?.length) return empty();
    if (ctx.day !== Math.max(...selectedDays)) return empty();

    return {
        updates: {
            'skeletonStatus.completed': true,
            'skeletonStatus.completionDate': new Date().toISOString(),
        },
        appends: [],
        effects: [{ type: 'openSkeletonCompletion' }],
    };
};

export const skeletonProgression = (ctx: ProgressionContext): ProgressionResult =>
    merge(plankProgression(ctx), completion(ctx));
