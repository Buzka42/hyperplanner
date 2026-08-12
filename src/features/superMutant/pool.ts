/**
 * SUPER MUTANT — optional indefinite pool.
 *
 * The base 12+2 programme is unchanged and remains the default. This is an
 * opt-in mode for athletes who have finished a cycle and want the plan to keep
 * running: instead of the fixed A/B variants, each slot draws from an approved
 * pool, least-recently-used first, so exposure rotates without the athlete
 * hand-picking movements every session.
 *
 * The rotation replaces the *movement*, never the slot's role, sets, target or
 * position in the session. Everything that makes Super Mutant work — the
 * cluster queue, the cooldowns, the RIR ladder, the deloads — is untouched.
 */

import { EXERCISE_BY_ID, EXERCISE_LIBRARY } from '../../data/exercises/library';

export type PoolRole = 'preExhaust' | 'main' | 'finisher';

export interface PoolEntry {
    /** Library id. Ids are stable; display names are not. */
    id: string;
    role: PoolRole;
}

/**
 * Approved movements per muscle and role. Deliberately conservative: a pool
 * entry has to be a genuine substitute for the slot it fills, because the
 * queue's time estimates and cooldowns assume the same kind of work.
 */
export const SUPER_MUTANT_POOL: Record<string, PoolEntry[]> = {
    chest: [
        { id: 'pec-deck', role: 'preExhaust' },
        { id: 'cable-fly', role: 'preExhaust' },
        { id: 'machine-press-fly-combo', role: 'preExhaust' },
        { id: 'incline-dumbbell-bench-press', role: 'main' },
        { id: 'flat-dumbbell-press', role: 'main' },
        { id: 'hammer-chest-press', role: 'main' },
        { id: '30-smith-incline-bench-press', role: 'main' },
        { id: 'cable-crossover', role: 'finisher' },
        { id: 'dip', role: 'finisher' },
    ],
    back: [
        { id: 'lat-prayer', role: 'preExhaust' },
        { id: 'dumbbell-pullover', role: 'preExhaust' },
        { id: 'lat-pulldown', role: 'main' },
        { id: 'hammer-pulldown', role: 'main' },
        { id: 'single-arm-hammer-row', role: 'main' },
        { id: 'barbell-row', role: 'main' },
        { id: 'seated-cable-row', role: 'finisher' },
        { id: 'rope-cable-row', role: 'finisher' },
    ],
    shoulders: [
        { id: 'lateral-raise', role: 'preExhaust' },
        { id: 'cable-lateral-raise', role: 'preExhaust' },
        { id: 'seated-dumbbell-shoulder-press', role: 'main' },
        { id: 'standing-barbell-military-press', role: 'main' },
        { id: 'single-arm-standing-press', role: 'main' },
        { id: 'reverse-pec-deck', role: 'finisher' },
        { id: 'single-arm-reverse-pec-deck', role: 'finisher' },
    ],
    quads: [
        { id: 'leg-extension', role: 'preExhaust' },
        { id: 'hack-squat', role: 'main' },
        { id: 'front-squat', role: 'main' },
        { id: 'safety-bar-squat', role: 'main' },
        { id: 'leg-press', role: 'main' },
        { id: 'stiletto-squat', role: 'main' },
        { id: 'supported-sissy-squat', role: 'finisher' },
        { id: 'stripper-squat', role: 'finisher' },
    ],
    hamstrings: [
        { id: 'lying-leg-curl', role: 'preExhaust' },
        { id: 'seated-hamstring-curl', role: 'preExhaust' },
        { id: 'romanian-deadlift', role: 'main' },
        { id: 'good-mornings', role: 'main' },
        { id: 'deficit-romanian-deadlift', role: 'main' },
        { id: 'single-leg-hamstring-curl', role: 'finisher' },
    ],
    glutes: [
        { id: 'machine-hip-abduction', role: 'preExhaust' },
        { id: 'hip-thrust', role: 'main' },
        { id: 'single-leg-machine-hip-thrust', role: 'main' },
        { id: 'b-stance-hip-thrust', role: 'main' },
        { id: 'kas-glute-bridge', role: 'finisher' },
        { id: 'frog-pump', role: 'finisher' },
    ],
    biceps: [
        { id: 'hammer-curl', role: 'main' },
        { id: 'cable-curl', role: 'main' },
        { id: 'ezbar-preacher-curl', role: 'main' },
        { id: 'bayesian-cable-curl', role: 'finisher' },
        { id: 'reverse-curl', role: 'finisher' },
    ],
    triceps: [
        { id: 'cable-triceps-extension', role: 'main' },
        { id: 'rope-pressdown', role: 'main' },
        { id: 'ezbar-skullcrushers', role: 'main' },
        { id: 'single-arm-overhead-triceps-extension', role: 'finisher' },
        { id: 'triangle-pushdown', role: 'finisher' },
    ],
    calves: [
        { id: 'hack-calf-raise', role: 'main' },
        { id: 'standing-calf-raise', role: 'main' },
        { id: 'standing-dumbbell-kb-calf-raise', role: 'main' },
        { id: 'leg-press-calf-raise', role: 'finisher' },
    ],
};

export interface PoolState {
    /** muscle -> exercise id -> ISO date it was last performed. */
    lastUsed?: Record<string, Record<string, string>>;
    /** Exercise ids the athlete has excluded. Never offered again. */
    excluded?: string[];
}

/**
 * Least-recently-used selection, with never-used movements first.
 *
 * Deterministic on purpose: an athlete should be able to see why a movement
 * came up, and a random pick makes the rotation impossible to reason about.
 */
export const selectFromPool = (
    muscle: string,
    role: PoolRole,
    state: PoolState | undefined,
    currentId?: string,
): string | undefined => {
    const pool = (SUPER_MUTANT_POOL[muscle] ?? []).filter(entry => entry.role === role);
    const excluded = new Set(state?.excluded ?? []);
    const candidates = pool.filter(entry => !excluded.has(entry.id));
    if (!candidates.length) return currentId;

    const lastUsed = state?.lastUsed?.[muscle] ?? {};
    const ranked = [...candidates].sort((a, b) => {
        const aUsed = lastUsed[a.id] ? Date.parse(lastUsed[a.id]) : 0;
        const bUsed = lastUsed[b.id] ? Date.parse(lastUsed[b.id]) : 0;
        return aUsed - bUsed || a.id.localeCompare(b.id);
    });

    // Avoid handing back the movement that was just performed when the pool has
    // anything else to offer.
    const choice = ranked[0].id === currentId && ranked.length > 1 ? ranked[1] : ranked[0];
    return choice.id;
};

/** Records a completed exposure so the next rotation moves on. */
export const recordPoolUse = (state: PoolState | undefined, muscle: string, exerciseId: string, date = new Date().toISOString()): PoolState => ({
    ...state,
    lastUsed: {
        ...(state?.lastUsed ?? {}),
        [muscle]: { ...(state?.lastUsed?.[muscle] ?? {}), [exerciseId]: date },
    },
});

/**
 * The mode is off unless the athlete turned it on. This is the whole contract
 * with the existing plan: an untouched profile runs the base programme.
 */
export const poolModeEnabled = (preferences?: { exerciseSelections?: Record<string, string> }): boolean =>
    preferences?.exerciseSelections?.mode === 'pool';

/**
 * Slot identity, read from the generator's own exercise ids
 * (`chest-a-pre`, `back-b-2`, `biceps-1`, …).
 *
 * Derived rather than duplicated: the generator stays the single source of
 * truth for what a session contains, and this mode only decides which movement
 * fills a slot it already produced.
 */
export const slotIdentity = (exerciseId: string): { muscle: string; role: PoolRole } | undefined => {
    const match = /^([a-z]+)-(?:[ab]-)?(pre|main|finish|\d)$/.exec(exerciseId);
    if (!match) return undefined;
    const [, muscle, tail] = match;
    if (!SUPER_MUTANT_POOL[muscle]) return undefined;
    const role: PoolRole = tail === 'pre' || tail === '1' ? 'preExhaust'
        : tail === 'finish' || tail === '3' ? 'finisher'
            : 'main';
    return { muscle, role };
};

/**
 * Rotates the movements of an already-generated session.
 *
 * Only names change. Sets, targets, notes, ordering and the session's cluster
 * identity are the generator's decisions and are passed through untouched, so
 * the queue, cooldowns, RIR ladder and deloads behave exactly as they do in the
 * base programme.
 */
export const rotateSession = <T extends { id: string; name: string; exerciseId?: string }>(
    exercises: T[],
    state: PoolState | undefined,
): T[] => exercises.map(exercise => {
    const identity = slotIdentity(exercise.id);
    if (!identity) return exercise;

    const currentId = exercise.exerciseId ?? EXERCISE_LIBRARY.find(entry =>
        entry.name.en === exercise.name || entry.aliases.includes(exercise.name))?.id;
    const chosen = selectFromPool(identity.muscle, identity.role, state, currentId);
    const entry = chosen ? EXERCISE_BY_ID[chosen] : undefined;
    if (!entry || entry.id === currentId) return exercise;

    return { ...exercise, exerciseId: entry.id, name: entry.name.en };
});
