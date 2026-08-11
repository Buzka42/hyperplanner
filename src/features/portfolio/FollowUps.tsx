import React from 'react';
import { ArrowRight } from 'lucide-react';

import { followUpsFor } from './recommend';
import { PORTFOLIO_BY_ID } from '../../data/portfolio';

/**
 * What to run next, shown only once a plan is actually finished.
 *
 * The rule from the portfolio specification is narrow on purpose: a plan you
 * are halfway through is not a problem to be solved with a different plan, so
 * nothing appears until the plan says it is complete.
 */
export interface FollowUpsProps {
    planId: string;
    completed: boolean;
    /** The athlete's key, so nothing unreachable is suggested. */
    availablePlanIds?: string[];
    daysPerWeek?: number;
    planName: (planId: string) => string;
    onChoose?: (planId: string) => void;
}

export const FollowUps: React.FC<FollowUpsProps> = ({
    planId, completed, availablePlanIds, daysPerWeek, planName, onChoose,
}) => {
    const suggestions = followUpsFor(planId, completed, { availablePlanIds, daysPerWeek });
    if (!suggestions.length) return null;

    return (
        <section className="follow-ups" aria-label="What to run next">
            <h2>Finished {planName(planId)}. What next?</h2>
            <ul>
                {suggestions.map(suggestion => {
                    const entry = PORTFOLIO_BY_ID[suggestion.planId];
                    return (
                        <li key={suggestion.planId}>
                            <div className="follow-up-head">
                                <strong>{planName(suggestion.planId)}</strong>
                                <span>{entry.weeks} weeks · {entry.frequency.join('/')} days</span>
                            </div>
                            <p className="follow-up-mechanic">{suggestion.signatureMechanic}</p>
                            <p className="follow-up-why">{suggestion.why}</p>
                            {onChoose && (
                                <button className="follow-up-action" onClick={() => onChoose(suggestion.planId)}>
                                    Switch to this plan <ArrowRight className="h-3 w-3" aria-hidden="true" />
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};
