/**
 * Pain & Glory — save-time progression.
 *
 * Per docs/plans/pain-and-glory.md:
 *   - Paused Low Bar Squat progresses +2.5 kg per session in weeks 1-8, then
 *     holds at the week 8 weight while the deadlift peaks.
 *   - The E2MOM deadlift block (weeks 9-12) adds 2.5 kg when all six sets hit
 *     five reps.
 *   - Week 13 is an AMRAP test; its Epley estimate seeds the peaking weights.
 *   - Deficit Snatch Grip Deadlift asks the athlete how it felt (weeks 1-11),
 *     which is a modal and therefore an effect rather than an update.
 */

import { empty, merge, workSets } from './types';
import type { LoggedSet, ProgressionContext, ProgressionResult } from './types';

const INCREMENT = 2.5;
const SQUAT = 'Paused Low Bar Squat';
const E2MOM = 'Conventional Deadlift (E2MOM)';
const AMRAP = 'Conventional Deadlift (AMRAP)';
const DEFICIT = 'Deficit Snatch Grip Deadlift';

const setsFor = (ctx: ProgressionContext, name: string): LoggedSet[] | undefined => {
    const exercise = ctx.workout?.exercises.find(ex => ex.name === name);
    return exercise ? ctx.sets[exercise.id] : undefined;
};

/** Squat: every set inside 4-6 reps and completed earns the increase. */
const squat = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.week < 1 || ctx.week > 8) return empty();

    const sets = workSets(setsFor(ctx, SQUAT));
    if (!sets.length) return empty();

    const updates: Record<string, unknown> = {};

    const targetMet = sets.every(set => {
        const reps = parseInt(set.reps || '0');
        return reps >= 4 && reps <= 6 && set.completed;
    });
    if (targetMet) {
        updates['painGloryStatus.squatProgress'] = (ctx.user.painGloryStatus?.squatProgress || 0) + INCREMENT;
    }

    // The week 8 weight becomes the maintenance load once deadlift peaking
    // takes priority, so it is captured whether or not the target was met.
    if (ctx.week === 8) {
        updates['painGloryStatus.week8SquatWeight'] = parseFloat(sets[0]?.weight || '0');
    }

    return { updates, appends: [], effects: [] };
};

/** E2MOM: all six working sets at five reps or more. */
const e2mom = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.week < 9 || ctx.week > 12) return empty();

    const sets = workSets(setsFor(ctx, E2MOM));
    if (sets.length < 6) return empty();

    const allHit = sets.slice(0, 6).every(set => parseInt(set.reps || '0') >= 5 && set.completed);
    if (!allHit) return empty();

    return {
        updates: {
            'painGloryStatus.e2momWeightAdjustment':
                (ctx.user.painGloryStatus?.e2momWeightAdjustment || 0) + INCREMENT,
        },
        appends: [],
        effects: [],
    };
};

/**
 * Week 13 AMRAP test.
 *
 * Floored to 2.5 kg rather than rounded, deliberately: this estimate seeds the
 * peaking weights, and rounding up would build the peak on a number the athlete
 * never actually lifted.
 */
const amrapTest = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.week !== 13) return empty();

    const sets = workSets(setsFor(ctx, AMRAP));
    const [top] = sets;
    if (!top?.completed) return empty();

    const weight = parseFloat(top.weight || '0');
    const reps = parseInt(top.reps || '0');
    if (weight <= 0 || reps <= 0) return empty();

    const estimated = Math.floor((weight * (1 + reps / 30)) / 2.5) * 2.5;

    return {
        updates: {
            'painGloryStatus.amrapWeight': weight,
            'painGloryStatus.amrapReps': reps,
            'painGloryStatus.estimatedE1RM': estimated,
        },
        appends: [],
        effects: [],
    };
};

/** The RPE prompt after deficit work, weeks 1-11. */
const deficitFeedback = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.week < 1 || ctx.week > 11) return empty();

    const present = ctx.workout?.exercises.some(ex => ex.name.includes(DEFICIT));
    if (!present) return empty();

    return { updates: {}, appends: [], effects: [{ type: 'openDeficitFeedback' }] };
};

export const painGloryProgression = (ctx: ProgressionContext): ProgressionResult =>
    merge(squat(ctx), e2mom(ctx), amrapTest(ctx), deficitFeedback(ctx));
