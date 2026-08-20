/**
 * Timed exercises — holds and carries prescribed in seconds, not reps.
 *
 * The library already marks these with `weightMode: 'timed'`; what was missing
 * was the app treating them differently. A plank asked for a weight and a rep
 * count, which is two wrong questions: the athlete has nothing to type in
 * either box.
 *
 * Seconds live in the `reps` field of a logged set rather than a new one. That
 * is the convention the plans already use (`reps: '30sec'` in Skeleton), and it
 * keeps every existing consumer — history joins, session summaries, the volume
 * analysis — working untouched. The unit is carried by the exercise, not by the
 * value.
 */

import type { LibraryExercise } from '../../data/exercises/types';
import type { WorkoutLog } from '../../types';

/** Prescribed in seconds rather than repetitions. */
export const isTimed = (entry?: LibraryExercise): boolean => entry?.weightMode === 'timed';

/**
 * Timed *and* unloaded — a plank or a dead hang, where the only variable is how
 * long you last. Farmer holds and suitcase carries are also timed, but they are
 * carrying something, so they keep their weight field.
 */
export const isBodyweightTimed = (entry?: LibraryExercise): boolean =>
    isTimed(entry) && (entry?.equipment ?? []).includes('bodyweight');

/** Seconds a set lasted, from the value stored in its `reps` field. */
export const parseSeconds = (value: string | number | undefined): number => {
    if (value === undefined || value === null) return 0;
    const match = String(value).match(/(\d+(?:\.\d+)?)/);
    return match ? Math.round(Number(match[1])) : 0;
};

/** `95` -> `1:35`, `45` -> `45s`. Minutes only once there are minutes to show. */
export const formatSeconds = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '0s';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const rest = Math.round(seconds % 60);
    return rest ? `${mins}:${String(rest).padStart(2, '0')}` : `${mins}:00`;
};

/**
 * The prescribed window, read off the target string a plan wrote:
 * `'30-60sec'`, `'45sec'`, `'45'` and `'30-60'` all parse.
 */
export const parseTimeTarget = (reps: string | undefined): { min: number; max: number } | undefined => {
    if (!reps) return undefined;
    const range = String(reps).match(/(\d+)\s*-\s*(\d+)/);
    if (range) return { min: Number(range[1]), max: Number(range[2]) };
    const single = String(reps).match(/(\d+)/);
    return single ? { min: Number(single[1]), max: Number(single[1]) } : undefined;
};

/**
 * Longest hold ever logged for this exercise, across the sessions supplied.
 *
 * Callers pass history already narrowed to one exercise (that is the shape
 * WorkoutView builds), so a full-session log is matched by name and a narrowed
 * one falls through to its `setResults`.
 */
export const bestHoldSeconds = (history: WorkoutLog[], exerciseName: string): number => {
    let best = 0;
    for (const log of history) {
        const sets = log.exercises?.find(e => e.name === exerciseName)?.setsData ?? log.setResults;
        for (const set of sets ?? []) {
            if (!set?.completed) continue;
            best = Math.max(best, parseSeconds(set.reps));
        }
    }
    return best;
};

/**
 * Add 5s while the holds are short and 10s once they are long — a flat
 * increment is a big jump early and a rounding error later.
 */
const step = (seconds: number): number => (seconds < 60 ? 5 : 10);

export type TimedGoal = {
    /** Seconds to aim for in the next session. */
    target: number;
    /** Why, in one line, for display next to the input. */
    reason: 'first-attempt' | 'reach-target' | 'extend' | 'add-load';
};

/**
 * What to aim for next.
 *
 * Below the prescribed window the goal is simply to reach it. Inside it the
 * goal is the athlete's own best plus a step, never a number they have already
 * beaten. Once they are past the top of the window, more seconds stops being
 * the useful variable — a loaded hold should get heavier, and an unloaded one
 * has outgrown the prescription.
 */
export const nextTimedGoal = (
    best: number,
    target: { min: number; max: number } | undefined,
    loaded: boolean,
): TimedGoal => {
    if (!best) return { target: target?.min ?? 30, reason: 'first-attempt' };
    if (target && best < target.min) return { target: target.min, reason: 'reach-target' };
    if (target && best >= target.max) {
        return loaded
            ? { target: target.max, reason: 'add-load' }
            : { target: best + step(best), reason: 'extend' };
    }
    const next = best + step(best);
    return {
        target: target ? Math.min(next, target.max) : next,
        reason: 'extend',
    };
};
