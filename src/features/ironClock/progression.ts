/**
 * Iron Clock's density ladder.
 *
 * Every other plan in the portfolio overloads with the plate. Iron Clock
 * overloads with the clock, so "better" has to be defined before it can be
 * prescribed: more work inside the same window, then the same work inside a
 * shorter one, and only then a heavier bar.
 *
 * The ladder is deliberately ordered:
 *
 *   1. `reps`  — add rounds/reps at the same load and duration.
 *   2. `time`  — hold the work, compress the window a minute at a time.
 *   3. `load`  — add load once the window reaches its floor.
 *   4. `reset` — restore the base window and rep target at the new load.
 *
 * A block only climbs on a *valid completion*: the target was met and the
 * athlete confirmed the rounds were clean. Borderline rounds hold; invalid
 * rounds hold and are not eligible as a density best. Nothing here writes —
 * callers apply the returned prescription.
 */

import type { IronClockBlockRecord } from '../../types';

export type DensityStep = 'reps' | 'time' | 'load' | 'reset';

export interface DensityBlockConfig {
    blockId: string;
    /** Window the block starts at, and returns to after a load increase. */
    baseDurationSeconds: number;
    /** Compression floor — two thirds of base, rounded to whole minutes. */
    minDurationSeconds: number;
    baseRounds: number;
    /** Ceiling for added rounds before compression takes over. */
    maxRounds: number;
    loadIncrementKg: number;
}

export interface DensityBlockState {
    step: DensityStep;
    durationSeconds: number;
    targetRounds: number;
    loadKg: number;
}

export interface DensityBlockResult {
    completedRounds: number;
    quality: 'clean' | 'borderline' | 'invalid';
    /** Rest the athlete actually took, summed across the block. */
    restSeconds?: number;
}

export interface DensityAdvance {
    state: DensityBlockState;
    step: DensityStep;
    /** Human-readable reason, shown next to the new prescription. */
    reason: string;
    /** True when the change is a load jump the athlete must confirm. */
    requiresConfirmation: boolean;
}

export const startingState = (config: DensityBlockConfig, loadKg: number): DensityBlockState => ({
    step: 'reps',
    durationSeconds: config.baseDurationSeconds,
    targetRounds: config.baseRounds,
    loadKg,
});

export const advanceDensityBlock = (
    state: DensityBlockState,
    result: DensityBlockResult,
    config: DensityBlockConfig,
): DensityAdvance => {
    const met = result.completedRounds >= state.targetRounds;

    if (result.quality === 'invalid') {
        return { state, step: state.step, reason: 'Rounds were flagged invalid — the block repeats unchanged.', requiresConfirmation: false };
    }
    if (!met) {
        return { state, step: state.step, reason: 'Target rounds were not completed — the block repeats unchanged.', requiresConfirmation: false };
    }
    if (result.quality === 'borderline') {
        return { state, step: state.step, reason: 'Borderline rounds count as completed but do not progress.', requiresConfirmation: false };
    }

    // Clean and complete: climb one rung.
    if (state.targetRounds < config.maxRounds) {
        return {
            state: { ...state, step: 'reps', targetRounds: state.targetRounds + 1 },
            step: 'reps',
            reason: `Same window, one more round: ${state.targetRounds + 1}.`,
            requiresConfirmation: false,
        };
    }

    if (state.durationSeconds > config.minDurationSeconds) {
        const compressed = Math.max(config.minDurationSeconds, state.durationSeconds - 60);
        return {
            state: { ...state, step: 'time', durationSeconds: compressed },
            step: 'time',
            reason: `Same work, one minute less: ${Math.round(compressed / 60)} minutes.`,
            requiresConfirmation: false,
        };
    }

    // Window is at its floor and full — the block has earned load, and the
    // clock resets with it so the next cycle is comparable to this one's start.
    return {
        state: {
            step: 'reset',
            durationSeconds: config.baseDurationSeconds,
            targetRounds: config.baseRounds,
            loadKg: state.loadKg + config.loadIncrementKg,
        },
        step: 'load',
        reason: `Window is full at its floor — add ${config.loadIncrementKg} kg and reset the clock.`,
        requiresConfirmation: true,
    };
};

/**
 * How comparable two block records are.
 *
 * Density history is fragile: change one exercise in a pair and the raw
 * minutes-versus-reps number stops meaning anything. Throwing the history away
 * is worse than describing it honestly, so a changed block keeps its lineage
 * and drops to a lower comparability tier instead.
 */
export type DensityComparability = 'strict' | 'adapted' | 'incomparable';

export const compareBlocks = (a: IronClockBlockRecord, b: IronClockBlockRecord): DensityComparability => {
    const sameLineage = a.lineage.length === b.lineage.length && a.lineage.every((id, i) => id === b.lineage[i]);
    if (!sameLineage) {
        // A single substitution inside an otherwise identical block is still
        // worth trending; a wholesale rebuild is not.
        const overlap = a.lineage.filter(id => b.lineage.includes(id)).length;
        return overlap >= a.lineage.length - 1 && overlap > 0 ? 'adapted' : 'incomparable';
    }
    if (a.loadKg !== b.loadKg || a.durationSeconds !== b.durationSeconds) return 'adapted';
    return 'strict';
};

/** Work per minute, the block's headline number. Invalid rounds do not count. */
export const blockDensity = (record: IronClockBlockRecord): number => {
    if (record.quality === 'invalid' || record.durationSeconds <= 0) return 0;
    return Math.round(((record.reps * record.loadKg) / (record.durationSeconds / 60)) * 10) / 10;
};

/**
 * Rest is the athlete's to manage — the plan warns rather than blocks, because
 * a hard stop turns a judgement call into a failed session.
 */
export const restWarning = (restSeconds: number, maxRestSeconds = 90): string | undefined =>
    restSeconds > maxRestSeconds
        ? `Rest ran to ${restSeconds}s against a ${maxRestSeconds}s guide. The block still counts; density will show it.`
        : undefined;
