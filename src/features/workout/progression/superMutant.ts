/**
 * Super Mutant — save-time progression.
 *
 * The plan schedules itself from what the athlete has recently trained, so the
 * save is mostly bookkeeping that the next session's generator reads back:
 *
 *   - muscle timestamps drive the 48h upper / 72h lower cooldown;
 *   - a true rolling 7-day volume ledger, rebuilt each save so old sets expire
 *     rather than accumulating forever;
 *   - double progression per exercise, stored by exercise id;
 *   - A/B variant alternation for chest and back;
 *   - a session-date list for the weekly cap.
 *
 * Muscle attribution comes from getMuscleContributions, keyed by exercise id.
 * An earlier keyword approach misfired constantly — "Seated Ham Curl" matched
 * biceps, "Standing Calf Raises" matched shoulders.
 */

import { getMuscleContributions } from '../../../data/supermutant';
import { empty } from './types';
import type { ProgressionContext, ProgressionResult } from './types';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Compound movements earn a bigger jump than isolation work. */
const COMPOUND_EXERCISE_IDS = /chest-[ab]-main|hamstrings-2|quads-2/;
const COMPOUND_INCREMENT = 5;
const ISOLATION_INCREMENT = 2.5;

export const superMutantProgression = (ctx: ProgressionContext): ProgressionResult => {
    if (ctx.isExistingLog) return empty();

    const status = ctx.user.superMutantStatus;
    if (!status) return empty();

    const now = Date.now();
    const exercises = ctx.workout?.exercises ?? [];
    const updates: Record<string, unknown> = {
        'superMutantStatus.completedWorkouts': (status.completedWorkouts || 0) + 1,
    };

    // --- muscle timestamps: only a full share counts as having trained it ---
    const trained = new Set<string>();
    for (const exercise of exercises) {
        for (const [muscle, share] of Object.entries(getMuscleContributions(exercise.id))) {
            if (share >= 1) trained.add(muscle);
        }
    }
    for (const muscle of trained) {
        updates[`superMutantStatus.muscleGroupTimestamps.${muscle}`] = now;
    }

    // --- rolling 7-day volume, with assisting muscles counted fractionally ---
    const contributions: Record<string, number> = {};
    for (const exercise of exercises) {
        const completed = (ctx.sets[exercise.id] ?? [])
            .filter(s => s.completed && s.reps && s.reps.trim() !== '').length;
        if (!completed) continue;

        for (const [muscle, share] of Object.entries(getMuscleContributions(exercise.id))) {
            contributions[muscle] = (contributions[muscle] || 0) + completed * share;
        }
    }

    // Rebuilt from the ledger rather than incremented, so sets older than a
    // week drop out instead of inflating the total forever.
    const cutoff = now - WEEK_MS;
    const history = (status.volumeHistory ?? [])
        .filter(entry => new Date(entry.date).getTime() > cutoff)
        .concat({ date: new Date(now).toISOString(), contributions });

    const rolling: Record<string, number> = {};
    for (const entry of history) {
        for (const [muscle, amount] of Object.entries(entry.contributions)) {
            rolling[muscle] = (rolling[muscle] || 0) + amount;
        }
    }
    updates['superMutantStatus.volumeHistory'] = history;
    updates['superMutantStatus.rolling7DayVolume'] = rolling;

    // --- double progression, keyed by exercise id ---
    for (const exercise of exercises) {
        if (exercise.target.type !== 'range') continue;

        const topReps = Number(String(exercise.target.reps).split('-').pop());
        const sets = ctx.sets[exercise.id] ?? [];
        // Judged on the prescribed sets only; anything the athlete added on top
        // is real work but not what the progression is measured against.
        const prescribed = sets.slice(0, exercise.sets);
        const hitTop = prescribed.length >= exercise.sets
            && prescribed.every(s => s.completed && Number(s.reps) >= topReps);
        if (!hitTop) continue;

        const heaviest = Math.max(...sets.map(s => Number(s.weight) || 0));
        if (heaviest <= 0) continue;

        const increment = COMPOUND_EXERCISE_IDS.test(exercise.id) ? COMPOUND_INCREMENT : ISOLATION_INCREMENT;
        updates[`superMutantStatus.exerciseLoads.${exercise.id}`] = heaviest + increment;
    }

    // --- A/B alternation, so the next chest or back day is the other variant ---
    if (trained.has('chest')) {
        updates['superMutantStatus.chestVariant'] = status.chestVariant === 'A' ? 'B' : 'A';
    }
    if (trained.has('back')) {
        updates['superMutantStatus.backVariant'] = status.backVariant === 'A' ? 'B' : 'A';
    }

    // --- session dates for the weekly cap ---
    updates['superMutantStatus.weeklySessionDates'] = (status.weeklySessionDates ?? [])
        .filter(date => new Date(date).getTime() >= cutoff)
        .concat(new Date(now).toISOString());

    return { updates, appends: [], effects: [] };
};
