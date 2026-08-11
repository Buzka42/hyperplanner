export const DEFAULT_STALL_LADDER = ['reps', 'rom', 'pause', 'eccentric', 'variation'] as const;
export type StallStage = typeof DEFAULT_STALL_LADDER[number];

export interface StallLadderState {
    stageIndex: number;
    consecutiveStalls: number;
}

export interface StallLadderOutcome {
    state: StallLadderState;
    stage: StallStage;
    requiresVariationConfirmation: boolean;
}

/**
 * Shared fixed-load mastery ladder. Successful load progression resets the
 * ladder; repeated stalls advance one technique at a time. A variation is
 * never changed silently.
 */
export const advanceStallLadder = (
    previous: StallLadderState,
    result: 'progressed' | 'stalled' | 'failed',
    stallsBeforeAdvance = 2,
): StallLadderOutcome => {
    if (result === 'progressed') return {
        state: { stageIndex: 0, consecutiveStalls: 0 },
        stage: DEFAULT_STALL_LADDER[0],
        requiresVariationConfirmation: false,
    };

    // A failed/invalid exposure holds the prescription; it is not evidence
    // that the athlete mastered the current fixed-load step.
    if (result === 'failed') return {
        state: previous,
        stage: DEFAULT_STALL_LADDER[Math.min(previous.stageIndex, DEFAULT_STALL_LADDER.length - 1)],
        requiresVariationConfirmation: false,
    };

    const stalls = previous.consecutiveStalls + 1;
    const shouldAdvance = stalls >= stallsBeforeAdvance;
    const stageIndex = shouldAdvance
        ? Math.min(previous.stageIndex + 1, DEFAULT_STALL_LADDER.length - 1)
        : previous.stageIndex;
    const state = { stageIndex, consecutiveStalls: shouldAdvance ? 0 : stalls };
    return {
        state,
        stage: DEFAULT_STALL_LADDER[stageIndex],
        requiresVariationConfirmation: shouldAdvance && stageIndex === DEFAULT_STALL_LADDER.length - 1,
    };
};
