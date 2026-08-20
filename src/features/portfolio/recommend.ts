/**
 * Plan recommendation.
 *
 * Deliberately a filter with a ranking, not a scoring model pretending to know
 * the athlete. Everything it uses is something the athlete said out loud, and
 * every result carries the reason it appeared and the reason it might not suit.
 *
 * Two rules the portfolio document is explicit about:
 *
 *   - overlapping goals are fine. Where two plans share a goal, they differ by
 *     method or by the experience they assume, and the recommendation says so
 *     rather than hiding one.
 *   - follow-ups are offered only on completion. A plan you are halfway through
 *     is not a problem to be solved with a different plan.
 */

import { PORTFOLIO, PORTFOLIO_BY_ID, type Equipment, type Experience, type Goal, type PortfolioEntry } from '../../data/portfolio';

export interface Preferences {
    goal?: Goal;
    experience?: Experience;
    /** Sessions per week the athlete can actually commit to. */
    daysPerWeek?: number;
    equipment?: Equipment;
    /** Ids the athlete may not access, e.g. outside their key. */
    availablePlanIds?: string[];
    /** Plans already completed; they still appear, ranked lower. */
    completedPlanIds?: string[];
    /** Hard ceiling on weekly systemic cost, on the shared 0–4 ordinal. */
    maximumFatigue?: number;
}

export interface Recommendation {
    entry: PortfolioEntry;
    /** Why this appeared, in the athlete's terms. */
    reasons: string[];
    /** The plan's own "not for you if" lines, never suppressed. */
    caveats: string[];
    score: number;
}

const EQUIPMENT_SATISFIES: Record<Equipment, Equipment[]> = {
    // A full gym covers everything; a machine gym does not cover barbell work.
    'full-gym': ['full-gym', 'machines', 'minimal', 'barbell'],
    machines: ['machines', 'minimal'],
    barbell: ['barbell', 'minimal'],
    minimal: ['minimal'],
};

/**
 * A plan is *eligible* when the athlete could actually run it. Preference
 * mismatches lower the ranking; only access, schedule and equipment exclude.
 */
export const eligible = (entry: PortfolioEntry, preferences: Preferences): boolean => {
    if (entry.hiddenFromCatalogue) return false;
    if (preferences.availablePlanIds && !preferences.availablePlanIds.includes(entry.id)) return false;

    if (preferences.daysPerWeek != null) {
        // The plan's lowest supported frequency has to fit the week the athlete
        // actually has. A four-day plan run three days is a different plan.
        if (Math.min(...entry.frequency) > preferences.daysPerWeek) return false;
    }

    if (preferences.equipment) {
        const covered = EQUIPMENT_SATISFIES[preferences.equipment];
        if (!entry.equipment.some(item => covered.includes(item))) return false;
    }

    if (preferences.maximumFatigue != null && entry.fatigue > preferences.maximumFatigue) return false;

    return true;
};

export const recommend = (preferences: Preferences, limit = 5): Recommendation[] => {
    const completed = new Set(preferences.completedPlanIds ?? []);

    return PORTFOLIO
        .filter(entry => eligible(entry, preferences))
        .map(entry => {
            const reasons: string[] = [];
            let score = 0;

            if (preferences.goal && entry.goal.includes(preferences.goal)) {
                score += 40;
                reasons.push(`Built for ${preferences.goal}.`);
            }
            if (preferences.experience && entry.experience.includes(preferences.experience)) {
                score += 30;
                reasons.push(`Written for ${preferences.experience} lifters.`);
            } else if (preferences.experience) {
                // Not disqualifying, but the athlete should know.
                score -= 15;
                reasons.push(`Assumes ${entry.experience.join(' or ')} training experience.`);
            }
            if (preferences.daysPerWeek != null && entry.frequency.includes(preferences.daysPerWeek)) {
                score += 20;
                reasons.push(`Runs at ${preferences.daysPerWeek} days a week.`);
            }
            if (preferences.equipment === 'minimal' && entry.equipment.includes('minimal')) {
                score += 15;
                reasons.push('Works with minimal equipment.');
            }

            // The signature mechanic is what actually distinguishes two plans
            // with the same goal, so it is always part of the reason.
            reasons.push(entry.signatureMechanic);

            if (completed.has(entry.id)) {
                score -= 25;
                reasons.push('You have run this before.');
            }

            return { entry, reasons, caveats: entry.notForYouIf, score };
        })
        .sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id))
        .slice(0, limit);
};

// ---------------------------------------------------------------------------
// Follow-ups
// ---------------------------------------------------------------------------

export interface FollowUp {
    planId: string;
    signatureMechanic: string;
    why: string;
}

/**
 * Suggested only when a plan is finished.
 *
 * `completed` is the caller's judgement — a plan is complete when its own
 * status says so, not when enough weeks have elapsed on the calendar.
 */
export const followUpsFor = (
    planId: string,
    completed: boolean,
    preferences: Preferences = {},
): FollowUp[] => {
    if (!completed) return [];
    const entry = PORTFOLIO_BY_ID[planId];
    if (!entry) return [];

    return entry.followUps
        .map(id => PORTFOLIO_BY_ID[id])
        .filter((candidate): candidate is PortfolioEntry => !!candidate)
        .filter(candidate => eligible(candidate, preferences))
        .map(candidate => ({
            planId: candidate.id,
            signatureMechanic: candidate.signatureMechanic,
            why: sharedGoal(entry, candidate)
                ? `Continues the same goal by a different method.`
                : `A deliberate change of direction after ${planId.replace(/-/g, ' ')}.`,
        }));
};

const sharedGoal = (a: PortfolioEntry, b: PortfolioEntry) => a.goal.some(goal => b.goal.includes(goal));

/**
 * Plans that look similar to this one, for the catalogue.
 *
 * Similar broad goals are allowed, so this exists to explain the difference
 * rather than to warn about overlap — the portfolio document is explicit that
 * overlap banners are not the answer.
 */
export const comparableTo = (planId: string, limit = 3): { planId: string; differs: string }[] => {
    const entry = PORTFOLIO_BY_ID[planId];
    if (!entry) return [];

    return PORTFOLIO
        .filter(candidate => candidate.id !== planId && sharedGoal(entry, candidate))
        .sort((a, b) => a.id.localeCompare(b.id))
        .slice(0, limit)
        .map(candidate => ({
            planId: candidate.id,
            differs: candidate.experience.join('/') !== entry.experience.join('/')
                ? `Assumes ${candidate.experience.join(' or ')} experience; ${candidate.signatureMechanic}`
                : candidate.signatureMechanic,
        }));
};
