export type TopSetQuality = 'clean' | 'borderline' | 'invalid';

export const roundToIncrement = (loadKg: number, incrementKg: number): number =>
    Math.max(0, Math.round(loadKg / incrementKg) * incrementKg);

export const deriveBackoffLoad = (topLoadKg: number, reductionPercent = 10, incrementKg = 2.5): number =>
    roundToIncrement(topLoadKg * (1 - reductionPercent / 100), incrementKg);

/** The deeper cut a ground-out top set earns. */
export const GRIND_BACKOFF_PERCENT = 15;

/**
 * A top set taken to RIR 0 (equivalently RPE 9.5+) means the back-offs that
 * follow are being asked to chase a load the athlete no longer has. That
 * session drops 15% instead of the plan's usual cut — for that session only,
 * so the plan's own percentage still governs every normal day. A plan that
 * already prescribes a deeper cut keeps it.
 */
export const backoffPercentFor = (
    configuredPercent: number,
    topSet: { rir?: number | null; rpe?: number | null },
): number => {
    const ground = topSet.rir === 0 || (topSet.rpe != null && topSet.rpe >= 9.5);
    return ground ? Math.max(configuredPercent, GRIND_BACKOFF_PERCENT) : configuredPercent;
};

export const topSetCanProgress = (input: { completed: boolean | null; reps: number; targetMaxReps: number; rir?: number; quality?: TopSetQuality }): boolean =>
    input.completed === true && input.quality === 'clean' && input.rir != null && input.rir >= 0 && input.rir <= 2 && input.reps >= input.targetMaxReps;

