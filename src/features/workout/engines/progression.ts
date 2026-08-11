import type { EvaluatedSet, ProgressionOutcome } from './types';

const blocksProgression = (set: EvaluatedSet): boolean =>
    !set.completed ||
    set.quality === 'borderline' ||
    set.quality === 'invalid' ||
    set.completionReason === 'technical-failure' ||
    set.completionReason === 'pain' ||
    set.completionReason === 'stopped-early';

export interface DoubleProgressionInput {
    prescribedSets: number;
    targetMaxReps: number;
    currentLoadKg: number;
    incrementKg: number;
    sets: EvaluatedSet[];
    /** Omit to support lower-level plans that do not collect RIR. */
    maximumProgressionRir?: number;
}

export const doubleProgression = (input: DoubleProgressionInput): ProgressionOutcome => {
    const prescribed = input.sets.slice(0, input.prescribedSets);
    const complete = prescribed.length === input.prescribedSets && prescribed.every(set =>
        !blocksProgression(set) &&
        set.reps >= input.targetMaxReps &&
        (input.maximumProgressionRir == null || set.rir == null || set.rir <= input.maximumProgressionRir),
    );
    return complete
        ? { decision: 'progress', nextLoadKg: input.currentLoadKg + input.incrementKg, reason: 'upper-target-complete' }
        : { decision: 'hold', nextLoadKg: input.currentLoadKg, reason: 'upper-target-not-cleanly-complete' };
};

export interface TopSetProgressionInput {
    topSet: EvaluatedSet | undefined;
    targetMaxReps: number;
    currentLoadKg: number;
    incrementKg: number;
    maximumProgressionRir: number;
}

export const topSetProgression = (input: TopSetProgressionInput): ProgressionOutcome => {
    const set = input.topSet;
    const progress = !!set && !blocksProgression(set) && set.reps >= input.targetMaxReps &&
        (set.rir == null || set.rir <= input.maximumProgressionRir);
    return progress
        ? { decision: 'progress', nextLoadKg: input.currentLoadKg + input.incrementKg, reason: 'clean-upper-target-top-set' }
        : { decision: 'hold', nextLoadKg: input.currentLoadKg, reason: 'top-set-held' };
};

export const totalSystemWeight = (externalLoadKg: number, bodyweightKg?: number): number | undefined =>
    bodyweightKg == null ? undefined : Math.max(0, bodyweightKg + externalLoadKg);
