/**
 * Per-plan save-time progression.
 *
 * All of this logic used to live inline in `handleSaveSession`, an ~830-line
 * function computing Firestore updates for eight plans with no tests. Extracting
 * it a plan at a time makes each piece a pure function that can be checked
 * against the rules documented in docs/plans/, rather than only against itself.
 *
 * Handlers never touch Firestore. They return what should change, and the caller
 * applies it — which is what makes them testable at all.
 */

import type { UserProfile, WorkoutDay } from '../../../types';

/** A set as logged in the session, before it reaches Firestore. */
export type LoggedSet = {
    reps: string;
    weight: string;
    completed: boolean | null;
    kind?: string;
    rir?: number;
    quality?: 'clean' | 'borderline' | 'invalid';
};

export type ProgressionContext = {
    planId: string;
    week: number;
    day: number;
    /** True when re-saving an already-completed session; most rules skip these. */
    isExistingLog: boolean;
    user: UserProfile;
    /** The day as the athlete saw it. */
    workout: WorkoutDay | undefined;
    /** Logged sets, keyed by exercise id. */
    sets: Record<string, LoggedSet[]>;
    /**
     * Choices the athlete made during the session that are not sets — Ritual's
     * ME progression checkbox and its slow-velocity flag. Keyed by exercise id.
     */
    selections?: {
        /** null where the athlete cleared the choice, hence not just number. */
        meProgression?: Record<string, number | null>;
        slowVelocity?: Record<string, boolean>;
        hipCapsule?: Record<string, boolean>;
        carryLimiter?: Record<string, string>;
    };
};

/** A value to append to an array field, applied with arrayUnion by the caller. */
export type ProgressionAppend = { field: string; value: unknown };

/**
 * Something the UI must do that a pure function cannot: open a modal, navigate.
 *
 * Returning these rather than calling them keeps handlers testable, and makes
 * the trigger conditions assertable — "when does the weak-point picker appear?"
 * was previously only answerable by reading the save function.
 */
export type ProgressionEffect =
    | { type: 'navigate'; to: string }
    | { type: 'openSkeletonCompletion' }
    | { type: 'openPencilneckCompletion' }
    | { type: 'openDeficitFeedback' }
    | { type: 'openWeakPointPicker' }
    | { type: 'openTrinaryRerun' }
    | { type: 'openMutationReminder' }
    | { type: 'awardBadgeCheck' };

export type ProgressionResult = {
    /** Dotted-path field updates to merge into the user document. */
    updates: Record<string, unknown>;
    /** Array appends, kept separate because they need arrayUnion(). */
    appends: ProgressionAppend[];
    /** Atomic counter bumps, applied with increment(). */
    increments?: Record<string, number>;
    /** UI work for the caller to perform after the write succeeds. */
    effects: ProgressionEffect[];
};

export type ProgressionHandler = (ctx: ProgressionContext) => ProgressionResult;

export const empty = (): ProgressionResult => ({ updates: {}, appends: [], effects: [] });

/** Merges several handlers' output, for plans whose logic splits naturally. */
export const merge = (...results: ProgressionResult[]): ProgressionResult => ({
    updates: Object.assign({}, ...results.map(r => r.updates)),
    appends: results.flatMap(r => r.appends),
    increments: Object.assign({}, ...results.map(r => r.increments ?? {})),
    effects: results.flatMap(r => r.effects),
});

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/**
 * Sets that count toward progression: prescribed work only.
 *
 * Extra sets the athlete added, and technique rows (drop sets, rest-pause
 * bursts, clusters), are real logged work but are not the prescription. An
 * allowlist rather than a blocklist, so a new set kind cannot quietly count.
 */
export const workSets = (sets: LoggedSet[] | undefined): LoggedSet[] =>
    (sets ?? []).filter(set => set.kind === undefined || set.kind === 'work');

/** Completed sets with a parseable weight and reps. */
export const validSets = (sets: LoggedSet[] | undefined): { weight: number; reps: number }[] =>
    workSets(sets)
        .filter(s => s.completed)
        .map(s => ({ weight: parseFloat(s.weight), reps: parseInt(s.reps) }))
        .filter(s => Number.isFinite(s.weight) && Number.isFinite(s.reps));

/** Epley. Used everywhere the app needs an estimated 1RM. */
export const epley = (weight: number, reps: number): number => weight * (1 + reps / 30);

/** Finds the exercise the athlete actually performed, by display name. */
export const findExercise = (workout: WorkoutDay | undefined, name: string) =>
    workout?.exercises.find(ex => ex.name === name);
