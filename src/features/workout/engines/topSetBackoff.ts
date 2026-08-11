export type TopSetQuality = 'clean' | 'borderline' | 'invalid';

export const roundToIncrement = (loadKg: number, incrementKg: number): number =>
    Math.max(0, Math.round(loadKg / incrementKg) * incrementKg);

export const deriveBackoffLoad = (topLoadKg: number, reductionPercent = 10, incrementKg = 2.5): number =>
    roundToIncrement(topLoadKg * (1 - reductionPercent / 100), incrementKg);

export const topSetCanProgress = (input: { completed: boolean | null; reps: number; targetMaxReps: number; rir?: number; quality?: TopSetQuality }): boolean =>
    input.completed === true && input.quality === 'clean' && input.rir != null && input.rir >= 0 && input.rir <= 2 && input.reps >= input.targetMaxReps;

