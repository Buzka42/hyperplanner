/**
 * Bench Domination — save-time progression.
 *
 * Rules per docs/plans/bench-domination.md:
 *
 *   - Saturday AMRAP sets the estimated 1RM that drives every bench percentage.
 *   - Behind-the-Neck Press: Monday is the driver. All sets at the top of the
 *     range earns +2.5 kg for next week; `btnPressWeek` stops it applying twice
 *     in the same week.
 *   - Spoto / Low Pin Press: fixed rep target, all sets hit earns +2.5 kg
 *     immediately.
 *   - Wide-Grip Bench: needs two consecutive Mondays at the top of 6-8 before
 *     +2.5 kg. A miss resets the counter.
 *   - Deloads are inserted rather than replacing weeks: a forced one after
 *     week 8, brought forward if two consecutive Saturday AMRAPs come in at 7
 *     reps or fewer, plus a second if the week 5 recalculation drops the
 *     estimated max by more than 15%.
 */

import { empty, epley, merge, workSets } from './types';
import type { LoggedSet, ProgressionContext, ProgressionResult } from './types';

const INCREMENT = 2.5;
const MONDAY = 1;
const WEDNESDAY = 3;
const SATURDAY = 6;
const REACTIVE_DELOAD_REPS = 7;
const BIG_DROP_PERCENT = 15;

/** Saturday AMRAP must hit this many reps to add +2.5 kg to the paused-bench base. */
export const amrapRepThreshold = (week: number): number => {
    if (week >= 13) return 6;
    if (week >= 10) return 8;
    if (week >= 7) return 10;
    return 12;
};

const topOfRange = (reps: string): number => {
    const parts = reps.split('-').map(Number);
    return parts[1] || parts[0];
};

const firstWeight = (sets: LoggedSet[]): number => parseFloat(sets[0]?.weight || '0');

const allSetsReach = (sets: LoggedSet[], target: number): boolean =>
    workSets(sets).every(s => s.completed && parseInt(s.reps) >= target);

// ---------------------------------------------------------------------------
// Accessory progressions
// ---------------------------------------------------------------------------

const accessories = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.isExistingLog) return empty();

    const stats: Record<string, number> = {};
    const statusUpdates: Record<string, unknown> = {};
    let history: ProgressionResult['appends'] = [];
    let pullupOneRepMax: number | undefined;

    for (const exercise of ctx.workout?.exercises ?? []) {
        const sets = ctx.sets[exercise.id];
        if (!sets?.length) continue;

        // --- Saturday AMRAP: the estimated max everything else keys off ---
        if (exercise.target.type === 'amrap' && exercise.target.percentageRef === 'pausedBench') {
            const [amrap] = sets;
            const reps = parseInt(amrap?.reps ?? '');
            const weight = parseFloat(amrap?.weight ?? '');
            if (Number.isFinite(reps) && Number.isFinite(weight)) {
                history = [{
                    field: 'benchHistory',
                    value: {
                        date: new Date().toISOString(),
                        week: ctx.week,
                        weight: Math.round(epley(weight, reps)),
                        actualWeight: weight,
                        actualReps: reps,
                    },
                }];
                const easy = Boolean(ctx.user.benchDominationStatus?.wednesdayVolumeEasy);
                statusUpdates['benchDominationStatus.saturdayBackoffBump'] = easy && reps >= amrapRepThreshold(ctx.week);
                statusUpdates['benchDominationStatus.wednesdayVolumeEasy'] = false;
            }
        }

        if (ctx.day === WEDNESDAY && exercise.name === 'Paused Bench Press') {
            const rirs = workSets(sets).map(s => s.rir).filter((n): n is number => typeof n === 'number');
            if (rirs.length) {
                const avg = rirs.reduce((a, b) => a + b, 0) / rirs.length;
                statusUpdates['benchDominationStatus.wednesdayVolumeEasy'] = avg >= 3;
            }
        }

        const weight = firstWeight(sets);
        if (weight <= 0) continue;

        // --- Behind-the-Neck Press: Monday drives it ---
        if (exercise.name === 'Behind-the-Neck Press' && ctx.day === MONDAY) {
            const hit = allSetsReach(sets, topOfRange(exercise.target.reps));
            stats.btnPress = hit ? weight + INCREMENT : weight;
            // Recorded even on a miss, so Thursday's 85% follows the weight
            // actually used rather than a stale one.
            stats.btnPressWeek = ctx.week;
        }

        // --- Spoto / Low Pin: fixed target, immediate progression ---
        if (exercise.name === 'Spoto Press' || exercise.name === 'Low Pin Press') {
            const key = exercise.name === 'Spoto Press' ? 'spotoPress' : 'lowPinPress';
            const hit = allSetsReach(sets, parseInt(exercise.target.reps));
            stats[key] = hit ? weight + INCREMENT : weight;
        }

        // --- Weighted pull-up 1RM, captured in week 10 to drive weeks 11-13 ---
        if (exercise.name === 'Weighted Pull-ups' && ctx.week === 10 && ctx.day === 3) {
            if (weight > 0) pullupOneRepMax = weight;
        }

        // --- Wide-Grip: two consecutive Mondays at the top of the range ---
        if (exercise.name === 'Wide-Grip Bench Press' && ctx.day === MONDAY) {
            const hit = allSetsReach(sets, topOfRange(exercise.target.reps));
            const streak = ctx.user.stats?.wideGripConsecutive || 0;

            if (!hit) {
                stats.wideGripBench = weight;
                stats.wideGripConsecutive = 0;
            } else if (streak + 1 >= 2) {
                stats.wideGripBench = weight + INCREMENT;
                stats.wideGripConsecutive = 0;
            } else {
                stats.wideGripBench = weight;
                stats.wideGripConsecutive = streak + 1;
            }
        }
    }

    // Dotted paths rather than replacing the whole stats object, so a
    // concurrent write to an unrelated stat cannot be clobbered.
    const updates: Record<string, unknown> = { ...statusUpdates };
    for (const [key, value] of Object.entries(stats)) updates[`stats.${key}`] = value;
    if (pullupOneRepMax !== undefined) updates.pullup1RM = pullupOneRepMax;

    return { updates, appends: history, effects: [] };
};

// ---------------------------------------------------------------------------
// Deloads
// ---------------------------------------------------------------------------

type DeloadEntry = { insertAfterWeek: number; type: 'forced' | 'reactive' | 'drop-recalc' };

/**
 * Deloads are *inserted* rather than replacing a training week, so the
 * programme lengthens instead of losing work.
 */
const deloads = (ctx: ProgressionContext, amrapEntry: ProgressionResult['appends']): ProgressionResult => {
    if (ctx.isExistingLog) return empty();

    const status = (ctx.user.benchDominationStatus ?? {}) as {
        addedDeloadWeeks?: DeloadEntry[];
        forcedDeloadCompleted?: boolean;
        week5BaseBeforeRecalc?: number;
    };
    const added = status.addedDeloadWeeks ?? [];
    const updates: Record<string, unknown> = {};
    const appends: ProgressionResult['appends'] = [];

    const hasForced = added.some(d => d.type === 'forced');

    // 1. Scheduled forced deload after week 8.
    if (ctx.week === 8 && ctx.day === SATURDAY && !status.forcedDeloadCompleted) {
        if (!added.some(d => d.insertAfterWeek === 8 && d.type === 'forced')) {
            appends.push({ field: 'benchDominationStatus.addedDeloadWeeks', value: { insertAfterWeek: 8, type: 'forced' } });
            updates['benchDominationStatus.forcedDeloadCompleted'] = true;
        }
    }

    // 2. Reactive: two consecutive Saturday AMRAPs at 7 reps or fewer during
    //    weeks 5-8 brings the forced deload forward rather than adding another.
    if (ctx.week >= 5 && ctx.week <= 8 && ctx.day === SATURDAY && amrapEntry.length) {
        const justLogged = amrapEntry[0].value as { week?: number; actualReps?: number };
        const history = [...(ctx.user.benchHistory ?? []), justLogged]
            .filter(h => h.actualReps !== undefined && h.week !== undefined && h.week >= 5 && h.week <= 8)
            .sort((a, b) => (b.week ?? 0) - (a.week ?? 0));

        if (history.length >= 2) {
            const [latest, previous] = history;
            const bothStalled = (latest.actualReps ?? 0) <= REACTIVE_DELOAD_REPS
                && (previous.actualReps ?? 0) <= REACTIVE_DELOAD_REPS;
            const consecutive = Math.abs((latest.week ?? 0) - (previous.week ?? 0)) === 1;

            if (bothStalled && consecutive && !hasForced && !status.forcedDeloadCompleted) {
                appends.push({
                    field: 'benchDominationStatus.addedDeloadWeeks',
                    value: { insertAfterWeek: ctx.week, type: 'forced' },
                });
                updates['benchDominationStatus.forcedDeloadCompleted'] = true;
            }
        }
    }

    // 3. Big drop: week 5 recalculation more than 15% below week 4's base.
    if (ctx.week === 5 && ctx.day === SATURDAY && amrapEntry.length) {
        const current = ctx.user.stats?.pausedBench || 0;
        const before = status.week5BaseBeforeRecalc || current;
        const drop = before > 0 ? ((before - current) / before) * 100 : 0;
        if (drop > BIG_DROP_PERCENT) {
            appends.push({
                field: 'benchDominationStatus.addedDeloadWeeks',
                value: { insertAfterWeek: 5, type: 'drop-recalc' },
            });
        }
    }

    // 4. Record week 4's base so the week 5 comparison has something to use.
    if (ctx.week === 4 && ctx.day === SATURDAY) {
        updates['benchDominationStatus.week5BaseBeforeRecalc'] = ctx.user.stats?.pausedBench || 0;
    }

    return { updates, appends, effects: [] };
};

export const benchDominationProgression = (ctx: ProgressionContext): ProgressionResult => {
    const accessoryResult = accessories(ctx);
    // The deload rules read the AMRAP just logged, so they run after it.
    const amrap = accessoryResult.appends.filter(a => a.field === 'benchHistory');
    return merge(accessoryResult, deloads(ctx, amrap));
};
