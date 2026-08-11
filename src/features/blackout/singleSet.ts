/**
 * BLACKOUT — one work set, earned back-offs, and a stall response that adds
 * volume last.
 *
 * The plan is advanced-only and deliberately austere: warm up, calibrate, take
 * one genuine work set, and stop. Everything here exists to stop that austerity
 * quietly turning into an ordinary three-set plan — which is what happens when
 * a stall response reaches for "add a set" first.
 */

import { recoveryRecommendation } from '../workout/engines';
import type { RecoveryResponse } from '../workout/engines';

export type SetQuality = 'clean' | 'borderline' | 'invalid';
export type CompletionReason = 'target-completed' | 'muscular-failure' | 'technical-failure' | 'voluntary-stop' | 'pain';

export interface PrimarySetResult {
    reps: number;
    targetReps: [number, number];
    loadKg: number;
    /** Mandatory in this plan — an unanswered set is treated as invalid. */
    quality?: SetQuality;
    completionReason?: CompletionReason;
    rir?: number;
}

/**
 * Both fields are mandatory here, unlike plans where quality is advisory: a
 * single work set carries the whole session's evidence, so an unlabelled set
 * cannot be allowed to progress anything.
 */
export const isEvaluable = (result: PrimarySetResult): boolean =>
    result.quality !== undefined && result.completionReason !== undefined;

// ---------------------------------------------------------------------------
// Earned back-off
// ---------------------------------------------------------------------------

export interface BackoffDecision {
    offered: boolean;
    sets: number;
    percent: number;
    reason: string;
}

/**
 * The back-off is earned, not scheduled. It requires a clean primary set and
 * acceptable recovery — after a poor primary set, extra volume is the worst
 * available response.
 */
export const earnedBackoff = (
    primary: PrimarySetResult,
    recovery: RecoveryResponse,
    painReported = false,
): BackoffDecision => {
    const none = (reason: string): BackoffDecision => ({ offered: false, sets: 0, percent: 0, reason });

    if (!isEvaluable(primary)) return none('Quality and completion reason are required before a back-off is offered.');
    if (primary.quality !== 'clean') return none('The primary set was not clean — no back-off this session.');
    if (primary.completionReason === 'pain' || primary.completionReason === 'technical-failure') {
        return none('The primary set ended badly — the session finishes here.');
    }
    if (primary.reps < primary.targetReps[0]) return none('The primary set missed its target — no back-off.');

    const recommendation = recoveryRecommendation(recovery, painReported);
    if (recommendation.action !== 'continue') return none('Recovery is not where it needs to be for extra work today.');

    return { offered: true, sets: 1, percent: 10, reason: 'Clean primary set and good recovery — one back-off set is available.' };
};

// ---------------------------------------------------------------------------
// Failure suitability
// ---------------------------------------------------------------------------

/**
 * Training to muscular failure is allowed only on slots explicitly approved for
 * it. The plan's own low-risk list, not the exercise metadata default, is the
 * authority here, because BLACKOUT's single-set structure makes every failure
 * decision consequential.
 */
export const FAILURE_APPROVED = new Set([
    'leg-extension', 'seated-hamstring-curl', 'lying-leg-curl', 'lateral-raise',
    'hammer-curl', 'cable-triceps-extension', 'single-arm-reverse-pec-deck',
    'hack-calf-raise', 'pec-deck', 'hammer-chest-press', 'hammer-pulldown',
]);

export const failureAllowed = (exerciseId: string): boolean => FAILURE_APPROVED.has(exerciseId);

// ---------------------------------------------------------------------------
// Stall response
// ---------------------------------------------------------------------------

/**
 * The documented order. Adding a set is last on purpose: it is the one response
 * that changes what the plan *is*, and it is usually a substitute for asking
 * whether the athlete has recovered.
 */
export const BLACKOUT_STALL_LADDER = ['recovery-check', 'repeat', 'rep-target', 'exercise-change', 'add-set'] as const;
export type BlackoutStallStage = typeof BLACKOUT_STALL_LADDER[number];

export interface StallState {
    stageIndex: number;
    consecutiveStalls: number;
}

export interface StallResponse {
    state: StallState;
    stage: BlackoutStallStage;
    requiresConfirmation: boolean;
    message: string;
}

const MESSAGES: Record<BlackoutStallStage, string> = {
    'recovery-check': 'Before anything changes: how recovered were you? A stalled set after a bad week is not a stalled programme.',
    repeat: 'Repeat the prescription. One missed set is not a trend.',
    'rep-target': 'Adjust the rep target rather than the load — the same work at a different target often moves again.',
    'exercise-change': 'Change the movement for this slot. Confirm the replacement before it is applied.',
    'add-set': 'Only now: add a second work set. This changes what the plan is, so it is confirmed explicitly.',
};

export const advanceStall = (previous: StallState, progressed: boolean): StallResponse => {
    if (progressed) {
        return {
            state: { stageIndex: 0, consecutiveStalls: 0 },
            stage: 'recovery-check',
            requiresConfirmation: false,
            message: 'Progressed — the stall ladder resets.',
        };
    }
    const stageIndex = Math.min(previous.stageIndex + 1, BLACKOUT_STALL_LADDER.length - 1);
    const stage = BLACKOUT_STALL_LADDER[stageIndex];
    return {
        state: { stageIndex, consecutiveStalls: previous.consecutiveStalls + 1 },
        stage,
        requiresConfirmation: stage === 'exercise-change' || stage === 'add-set',
        message: MESSAGES[stage],
    };
};

/**
 * Recovery recommends the next exposure; it never blocks a session. An athlete
 * who wants to train on a bad day is allowed to, and is told what it costs.
 */
export const nextExposureAdvice = (recovery: RecoveryResponse): { recommendedRestDays: number; blocks: false; message: string } => {
    const recommended = recovery === 'performance-impaired' ? 3 : recovery === 'somewhat-fatigued' ? 2 : 1;
    return {
        recommendedRestDays: recommended,
        blocks: false,
        message: `Next session recommended in ${recommended} day${recommended === 1 ? '' : 's'}. You can train sooner; the single work set will show the cost.`,
    };
};
