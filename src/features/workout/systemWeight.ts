import { EXERCISE_BY_ID } from '../../data/exercises/library';
import type { UserProfile } from '../../types';

const SYSTEM_MODES = new Set(['bodyweight', 'weighted-bodyweight']);

export const bodyweightKgOf = (user: UserProfile): number | undefined => {
    const kg = user.stats?.bodyweightKg ?? user.kaliStatus?.bodyweightKg;
    return kg && kg > 0 ? kg : undefined;
};

/** Belt/held load plus bodyweight, when the library says the lift is a system-weight movement. */
export const totalSystemWeightKg = (
    exerciseId: string | undefined,
    externalKg: number,
    user: UserProfile,
): number | undefined => {
    if (!exerciseId || !Number.isFinite(externalKg)) return undefined;
    const mode = EXERCISE_BY_ID[exerciseId]?.weightMode;
    const bodyweight = bodyweightKgOf(user);
    if (!mode || !bodyweight || !SYSTEM_MODES.has(mode)) return undefined;
    return Math.max(0, bodyweight + externalKg);
};
