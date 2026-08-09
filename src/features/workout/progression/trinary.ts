/**
 * Trinary — save-time progression.
 *
 * Conjugate: each session is Max Effort, Dynamic Effort or Repeated Effort, and
 * each earns progression differently.
 *
 *   - ME: an RPE self-report decides the jump (RPE <=7 -> +10, 7-8 -> +5,
 *     8-9 -> +2.5), applied straight to the lift's 1RM, but only if every set
 *     hit the required reps. The requirement depends on the athlete's
 *     onboarding choice of singles or a 3-rep ladder.
 *   - RE: 12 reps on every set queues +2.5 kg for the next RE exposure.
 *   - DE: completing every speed set queues +2.5 kg of bar weight.
 *
 * RE and DE are *queued* rather than applied because the increase belongs to
 * the next exposure of that effort, which may be weeks away.
 *
 * Accessory days deliberately do not advance the block: they are inserted
 * between blocks, and counting them would drift the whole conjugate schedule.
 */

import { getBlockFromWorkout } from '../../../data/trinary';
import { empty, workSets } from './types';
import type { LoggedSet, ProgressionContext, ProgressionResult } from './types';

type Lift = 'bench' | 'deadlift' | 'squat';
type Pending = { lift: Lift; amount: number };

const PROGRAM_LENGTH = 27;
const BLOCK_SIZE = 9;
const RE_TARGET_REPS = 12;

type TrinaryStatus = {
    completedWorkouts: number;
    bench1RM?: number;
    deadlift1RM?: number;
    squat1RM?: number;
    reProgressionPending?: Pending[];
    deProgressionPending?: Pending[];
} & Record<string, unknown>;

/**
 * Which competition lift a variation belongs to.
 *
 * Trinary rotates through named variations (Spoto Press, Block Pull, Box
 * Squat), so the mapping is by keyword rather than exact name.
 */
const liftOf = (name: string): Lift | null => {
    const n = name.toLowerCase();
    if (n.includes('bench') || n.includes('press') || n.includes('floor') || n.includes('board')) return 'bench';
    if (n.includes('deadlift') || n.includes('rdl') || n.includes('deficit') || n.includes('rack')
        || n.includes('hyperextension') || n.includes('good morning')) return 'deadlift';
    if (n.includes('squat') || n.includes('box')) return 'squat';
    return null;
};

/** RPE self-report to load increase, per the plan's ME rules. */
const progressionForRpe = (rpe: number | null | undefined): number => {
    if (rpe === 7) return 10;
    if (rpe === 7.5) return 5;
    if (rpe === 8.5) return 2.5;
    return 0;
};

/** Adds to an existing queued increase for the lift, or starts one. */
const queue = (pending: Pending[], lift: Lift, amount: number): Pending[] =>
    pending.some(p => p.lift === lift)
        ? pending.map(p => (p.lift === lift ? { ...p, amount: p.amount + amount } : p))
        : [...pending, { lift, amount }];

const allSetsReach = (sets: LoggedSet[], reps: number): boolean =>
    workSets(sets).every(s => parseInt(s.reps) >= reps);

export const trinaryProgression = (ctx: ProgressionContext): ProgressionResult => {
    const status = (ctx.user as { trinaryStatus?: TrinaryStatus }).trinaryStatus;
    if (!status) return empty();

    const currentWorkout = status.completedWorkouts + 1;
    const isAccessoryDay = ctx.workout?.dayName?.includes('Accessory') ?? false;

    const updates: Record<string, unknown> = {
        // Reset on every completed session, accessory or not.
        'trinaryStatus.skipNextAccessory': false,
    };
    const appends: ProgressionResult['appends'] = [{
        field: 'trinaryStatus.workoutLog',
        value: { date: new Date().toISOString(), workoutNumber: currentWorkout },
    }];

    const increments: Record<string, number> = {};

    if (isAccessoryDay) {
        increments['trinaryStatus.accessoryDaysCompleted'] = 1;
        updates['trinaryStatus.preferredAccessoryType'] = null;
        updates['trinaryStatus.forceAccessoryDay'] = false;
    } else {
        updates['trinaryStatus.completedWorkouts'] = currentWorkout;
        updates['trinaryStatus.currentBlock'] = getBlockFromWorkout(currentWorkout);
    }

    // Accumulated locally so several exercises can queue against one lift
    // without each overwriting the last.
    let rePending = [...(status.reProgressionPending ?? [])];
    let dePending = [...(status.deProgressionPending ?? [])];
    const oneRepMax: Partial<Record<Lift, number>> = {
        bench: status.bench1RM, deadlift: status.deadlift1RM, squat: status.squat1RM,
    };

    for (const exercise of ctx.workout?.exercises ?? []) {
        const sets = ctx.sets[exercise.id];
        if (!sets?.length) continue;

        const lift = liftOf(exercise.name.replace(/ \((ME|RE|DE)\)$/, ''));
        if (!lift) continue;

        // --- Max Effort: RPE decides the jump ---
        if (exercise.name.includes('(ME)')) {
            const rpe = ctx.selections?.meProgression?.[exercise.id];
            if (!rpe) continue;

            // Singles or a 3-rep ladder, per the athlete's onboarding choice.
            const requiredReps = exercise.sets <= 1 ? 1 : 3;
            if (workSets(sets).length < exercise.sets) continue;
            if (!allSetsReach(sets, requiredReps)) continue;

            const amount = progressionForRpe(rpe);
            if (amount > 0) {
                const current = oneRepMax[lift] ?? 0;
                oneRepMax[lift] = current + amount;
                updates[`trinaryStatus.${lift}1RM`] = current + amount;
            }
        }

        // --- Repeated Effort: 12 reps on every set ---
        if (exercise.name.includes('(RE)') && sets.length >= 4) {
            if (allSetsReach(sets, RE_TARGET_REPS)) {
                rePending = queue(rePending, lift, 2.5);
                updates['trinaryStatus.reProgressionPending'] = rePending;
            }
        }

        // --- Dynamic Effort: every speed set completed ---
        if (exercise.name.includes('(DE)')) {
            const prescribed = (exercise as { baseSets?: number }).baseSets ?? exercise.sets;
            const work = workSets(sets);
            if (work.length >= prescribed && work.every(s => s.completed && parseInt(s.reps) >= 2)) {
                dePending = queue(dePending, lift, 2.5);
                updates['trinaryStatus.deProgressionPending'] = dePending;
            }
        }
    }

    // End of programme, or the end of a three-block run where the athlete
    // re-picks their weak points.
    const effects: ProgressionResult['effects'] = [];
    if (currentWorkout >= PROGRAM_LENGTH) {
        effects.push({ type: 'openTrinaryRerun' });
    } else if (currentWorkout % BLOCK_SIZE === 0) {
        effects.push({ type: 'openWeakPointPicker' });
    }

    return { updates, appends, increments, effects };
};
