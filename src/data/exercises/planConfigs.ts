/**
 * Per-plan exercise configuration — bundled seed.
 *
 * Admin edits from the Plan Composer are stored as a Firestore overlay
 * (`planConfigs/{planId}`) and merged over whatever is here, exactly like the
 * exercise library. An absent plan means "no overrides": the plan's own
 * generator output is used verbatim, so adding a plan needs no entry here.
 *
 * Defaults are deliberately conservative — swap policy `pool` with no pool
 * means nothing is swappable until an admin says so, which preserves today's
 * behaviour rather than silently opening every exercise up.
 */

import type { PlanExerciseDefaults, PlanExerciseDoc } from './types';

/** Applied to any plan without its own `defaults` block. */
export const GLOBAL_DEFAULTS: PlanExerciseDefaults = {
    userExtraSets: { allowed: false, max: 2 },
    swap: { policy: 'locked' },
};

export const PLAN_EXERCISE_CONFIGS: Record<string, PlanExerciseDoc> = {
    'gravity-is-optional': {
        planId: 'gravity-is-optional',
        version: 1,
        updatedAt: '2026-08-13',
        updatedBy: 'seed',
        exercises: {
            'ab-wheel-rollout': {
                tipOverride: {
                    en: 'Chest to the ground every rep.',
                    pl: 'Klatka do ziemi w każdym powtórzeniu.',
                },
            },
        },
    },
};

export const getPlanExerciseConfig = (planId: string): PlanExerciseDoc | undefined =>
    PLAN_EXERCISE_CONFIGS[planId];
