/**
 * Ritual of Strength — save-time progression.
 *
 * Per docs/plans/ritual-of-strength.md:
 *   - Three sessions advance the schedule by one week, capped at 19.
 *   - Ascension Test weeks (4, 8, 12, 16) recalculate a lift's 1RM from an
 *     AMRAP. The gate is the exercise name, which only carries "Ascension Test"
 *     on those weeks.
 *   - From week 5, a heavier successful single raises the 1RM directly.
 *   - The ME checkbox adds an explicit 2.5 or 5 kg to the next session.
 *   - A slow Light-day bar speed flags a reduction for next time.
 *
 * Estimates are floored to 2.5 kg rather than rounded: an inflated 1RM would
 * raise every percentage in the plan off a lift that never happened.
 */

import { empty, merge } from './types';
import type { ProgressionContext, ProgressionResult } from './types';

type Lift = 'bench' | 'squat' | 'deadlift';

type RitualStatus = {
    completedWorkouts?: number;
    isFirstProgram?: boolean;
    benchPress1RM?: number;
    squat1RM?: number;
    deadlift1RM?: number;
    lightWorkReductionPending?: Partial<Record<Lift, boolean>>;
} & Record<string, unknown>;

const MAX_WEEK = 19;
const SESSIONS_PER_WEEK = 3;

const floor2p5 = (n: number) => Math.floor(n / 2.5) * 2.5;

/** Which competition lift an exercise belongs to, by name. */
const liftOf = (name: string): Lift | null => {
    if (name.includes('Bench')) return 'bench';
    if (name.includes('Squat')) return 'squat';
    if (name.includes('Deadlift')) return 'deadlift';
    return null;
};

const ONE_RM_FIELD: Record<Lift, string> = {
    bench: 'benchPress1RM',
    squat: 'squat1RM',
    deadlift: 'deadlift1RM',
};

const ME_PROGRESSION_FIELD: Record<Lift, string> = {
    bench: 'benchMEProgression',
    squat: 'squatMEProgression',
    deadlift: 'deadliftMEProgression',
};

/** Schedule advances once every three completed sessions. */
const schedule = (ctx: ProgressionContext, status: RitualStatus): ProgressionResult => {
    if (ctx.isExistingLog) return empty();

    const completed = (status.completedWorkouts || 0) + 1;
    // A repeat run of the programme starts at week 5, skipping the ramp-in.
    const startWeek = status.isFirstProgram ? 1 : 5;

    return {
        updates: {
            'ritualStatus.completedWorkouts': completed,
            'ritualStatus.currentWeek': Math.min(MAX_WEEK, startWeek + Math.floor(completed / SESSIONS_PER_WEEK)),
        },
        appends: [],
        effects: [],
    };
};

/** Ascension Test: recalculate the lift's 1RM from the AMRAP. */
const ascensionTest = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.isExistingLog) return empty();

    const updates: Record<string, unknown> = {};

    for (const exercise of ctx.workout?.exercises ?? []) {
        if (!exercise.name.includes('Ascension Test')) continue;

        const [amrap] = ctx.sets[exercise.id] ?? [];
        if (!amrap?.completed) continue;

        const weight = parseFloat(amrap.weight);
        const reps = parseInt(amrap.reps);
        if (!(weight > 0 && reps > 0)) continue;

        const lift = liftOf(exercise.name);
        if (!lift) continue;

        updates[`ritualStatus.${ONE_RM_FIELD[lift]}`] = floor2p5(weight * (1 + reps / 30));
        // The accumulated ME bonus was earned against the OLD 1RM; leaving it
        // would stack it on top of the freshly recalculated one.
        updates[`ritualStatus.${ME_PROGRESSION_FIELD[lift]}`] = 0;
    }

    return { updates, appends: [], effects: [] };
};

/** From week 5, a heavier successful single raises the 1RM. */
const maxEffortSingles = (ctx: ProgressionContext, status: RitualStatus): ProgressionResult => {
    if (ctx.isExistingLog || ctx.week < 5) return empty();

    const updates: Record<string, unknown> = {};

    for (const exercise of ctx.workout?.exercises ?? []) {
        if (!exercise.name.includes('(ME)')) continue;

        const sets = ctx.sets[exercise.id] ?? [];
        const singles = sets
            .filter(s => s.completed && parseInt(s.reps) === 1)
            .map(s => parseFloat(s.weight))
            .filter(w => Number.isFinite(w) && w > 0);

        if (!singles.length) continue;

        const lift = liftOf(exercise.name);
        if (!lift) continue;

        const heaviest = floor2p5(Math.max(...singles));
        const current = (status[ONE_RM_FIELD[lift]] as number) ?? 0;
        if (heaviest > current) {
            updates[`ritualStatus.${ONE_RM_FIELD[lift]}`] = heaviest;
        }

        // The athlete's own call on whether to add load next session.
        const chosen = ctx.selections?.meProgression?.[exercise.id];
        if (chosen === 2.5 || chosen === 5) {
            const accumulated = (status[ME_PROGRESSION_FIELD[lift]] as number) || 0;
            updates[`ritualStatus.${ME_PROGRESSION_FIELD[lift]}`] = accumulated + chosen;
        }
    }

    return { updates, appends: [], effects: [] };
};

/** Slow bar speed on a Light day flags a reduction for next session. */
const lightWorkVelocity = (ctx: ProgressionContext, status: RitualStatus): ProgressionResult => {
    if (ctx.isExistingLog) return empty();

    const lightDays = (ctx.workout?.exercises ?? []).filter(ex => ex.name.includes('(Light)'));
    if (!lightDays.length) return empty();

    const pending = { ...(status.lightWorkReductionPending ?? {}) };
    for (const exercise of lightDays) {
        const lift = liftOf(exercise.name);
        if (lift) pending[lift] = Boolean(ctx.selections?.slowVelocity?.[exercise.id]);
    }

    return { updates: { 'ritualStatus.lightWorkReductionPending': pending }, appends: [], effects: [] };
};

export const ritualProgression = (ctx: ProgressionContext): ProgressionResult => {
    const status = (ctx.user as { ritualStatus?: RitualStatus }).ritualStatus;
    // The plan only progresses once its status object exists, which onboarding
    // creates; without it there is nothing to advance.
    if (!status) return empty();

    return merge(
        schedule(ctx, status),
        ascensionTest(ctx),
        maxEffortSingles(ctx, status),
        lightWorkVelocity(ctx, status),
    );
};
