/**
 * THE MINIMUM — bonus modules.
 *
 * The plan's promise is that two sessions a week are enough. Bonus work exists
 * for the weeks where there is time for more, and it has to stay genuinely
 * optional: it feeds volume, history and the performance profile, but it can
 * never be a precondition for progressing the two mandatory sessions.
 *
 * Modules are therefore selected by *underexposure* rather than by preference —
 * the athlete is offered the muscle the fortnight actually missed — and a
 * module is withheld when the last mandatory session went backwards.
 */

import type { MinimumStatus } from '../../types';

export interface BonusModule {
    id: string;
    /** Muscles this module actually exposes, used for the underexposure match. */
    muscles: string[];
    exerciseIds: string[];
    sets: number;
    /** 0–4 ordinal, matching the shared exercise cost model. Bonus work stays low. */
    systemicCost: 0 | 1 | 2;
    /** Transitions are the hidden cost of a short session; keep them at one place. */
    stations: number;
}

/**
 * Approved templates only. Every module is low-systemic, single-station and
 * free of isolation that the mandatory sessions already cover twice.
 */
export const BONUS_MODULES: BonusModule[] = [
    // Muscle keys are library tokens (`lats`, `upperBack`, …) so exposure
    // counts can be summed straight from logged exercises.
    { id: 'upper-pull', muscles: ['lats', 'biceps', 'rearDelt'], exerciseIds: ['hammer-pulldown', 'single-arm-reverse-pec-deck', 'hammer-curl'], sets: 6, systemicCost: 1, stations: 1 },
    { id: 'upper-push', muscles: ['chest', 'frontDelt', 'triceps'], exerciseIds: ['hammer-chest-press', 'lateral-raise', 'cable-triceps-extension'], sets: 6, systemicCost: 1, stations: 1 },
    { id: 'posterior', muscles: ['hamstrings', 'glutes'], exerciseIds: ['seated-hamstring-curl', 'single-leg-machine-hip-thrust'], sets: 6, systemicCost: 2, stations: 1 },
    { id: 'quads-calves', muscles: ['quads', 'calves'], exerciseIds: ['leg-extension', 'hack-calf-raise'], sets: 6, systemicCost: 1, stations: 1 },
    { id: 'trunk-delts', muscles: ['abs', 'sideDelt'], exerciseIds: ['ab-wheel', 'lateral-raise'], sets: 5, systemicCost: 0, stations: 1 },
];

export interface BonusRecommendation {
    module?: BonusModule;
    /** Shown verbatim; the athlete decides, the plan only advises. */
    message: string;
    discouraged: boolean;
}

/**
 * @param exposure  Sets per muscle over the trailing fortnight.
 * @param week      Current program week, used to read `lastDecline`.
 */
export const recommendBonus = (
    status: MinimumStatus | undefined,
    week: number,
    recommendedPerWeek = 1,
): BonusRecommendation => {
    const doneThisWeek = (status?.bonusSessions ?? []).filter(session => session.week === week).length;
    const exposure = status?.exposure ?? {};

    // Performance going backwards is the one signal that overrides "there is
    // time for more". It discourages; it does not lock anything.
    if (status?.lastDecline?.week === week) {
        return {
            discouraged: true,
            message: 'Your last required session went backwards. A bonus is still allowed, but recovery is the better bet this week.',
        };
    }

    const ranked = [...BONUS_MODULES].sort((a, b) => score(a, exposure) - score(b, exposure));
    const module = ranked[0];

    if (doneThisWeek >= recommendedPerWeek) {
        return {
            module,
            discouraged: true,
            message: `You have already done ${doneThisWeek} bonus session${doneThisWeek === 1 ? '' : 's'} this week. One is the recommendation, not a cap.`,
        };
    }

    return {
        module,
        discouraged: false,
        message: `${module.muscles.join(', ')} saw the least work lately — this module covers it in ${module.sets} sets at one station.`,
    };
};

/** Lower is more underexposed, so it sorts first. Ties break on systemic cost. */
const score = (module: BonusModule, exposure: Record<string, number>): number => {
    const sets = module.muscles.reduce((total, muscle) => total + (exposure[muscle] ?? 0), 0) / module.muscles.length;
    return sets * 10 + module.systemicCost;
};

/**
 * Bonus work counts everywhere except plan progression.
 *
 * Kept as an explicit function rather than a comment because this is the rule
 * most likely to be broken by a future "just let bonus sets count" change.
 */
export const bonusContribution = () => ({
    weeklyVolume: true,
    performanceProfile: true,
    workoutHistory: true,
    planProgression: false,
});
