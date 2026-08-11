import React, { useMemo, useState } from 'react';
import { Check, Compass, X } from 'lucide-react';

import { Button } from '../../components/ui/button';
import { recommend, type Preferences } from './recommend';
import type { Equipment, Experience, Goal } from '../../data/portfolio';

/**
 * "Help me choose", for the onboarding catalogue.
 *
 * Three questions, because those are the three answers that genuinely exclude
 * plans: what you want, how much you have run before, and how many days you can
 * commit to. Everything else is ranking, not filtering.
 *
 * The result is not a verdict. Each recommendation shows why it appeared *and*
 * the plan's own reasons to walk away, and the full catalogue stays one click
 * behind — the portfolio document is explicit that clear descriptions beat
 * overlap warnings and forced funnels.
 */

const GOALS: { id: Goal; label: string }[] = [
    { id: 'strength', label: 'Get stronger' },
    { id: 'hypertrophy', label: 'Add size' },
    { id: 'specialisation', label: 'Bring up one body part' },
    { id: 'conditioning', label: 'Work capacity' },
    { id: 'return', label: 'Come back after time off' },
    { id: 'general', label: 'Train well, generally' },
    { id: 'assessment', label: 'Find out where I am' },
];

const EXPERIENCE: { id: Experience; label: string }[] = [
    { id: 'beginner', label: 'New to structured training' },
    { id: 'intermediate', label: 'A year or two in' },
    { id: 'advanced', label: 'Long-term trained' },
];

const EQUIPMENT: { id: Equipment; label: string }[] = [
    { id: 'full-gym', label: 'Full gym' },
    { id: 'machines', label: 'Mostly machines' },
    { id: 'barbell', label: 'Barbell and plates' },
    { id: 'minimal', label: 'One or two dumbbells' },
];

export interface PlanFinderProps {
    /** Ids the athlete's key actually unlocks. */
    availablePlanIds?: string[];
    planName: (planId: string) => string;
    onPick: (planId: string) => void;
    onDismiss: () => void;
}

export const PlanFinder: React.FC<PlanFinderProps> = ({ availablePlanIds, planName, onPick, onDismiss }) => {
    const [preferences, setPreferences] = useState<Preferences>({});

    const answered = preferences.goal && preferences.experience && preferences.daysPerWeek;
    const results = useMemo(
        () => (answered ? recommend({ ...preferences, availablePlanIds }, 4) : []),
        [preferences, answered, availablePlanIds],
    );

    return (
        <section className="plan-finder" aria-label="Help me choose a plan">
            <header className="plan-finder-head">
                <h2><Compass className="h-4 w-4" aria-hidden="true" /> Help me choose</h2>
                <button onClick={onDismiss} aria-label="Close"><X className="h-4 w-4" /></button>
            </header>

            <fieldset className="plan-finder-group">
                <legend>What is this block for?</legend>
                {GOALS.map(option => (
                    <button
                        key={option.id}
                        className={preferences.goal === option.id ? 'plan-finder-chip is-active' : 'plan-finder-chip'}
                        onClick={() => setPreferences(current => ({ ...current, goal: option.id }))}
                    >{option.label}</button>
                ))}
            </fieldset>

            <fieldset className="plan-finder-group">
                <legend>How long have you trained?</legend>
                {EXPERIENCE.map(option => (
                    <button
                        key={option.id}
                        className={preferences.experience === option.id ? 'plan-finder-chip is-active' : 'plan-finder-chip'}
                        onClick={() => setPreferences(current => ({ ...current, experience: option.id }))}
                    >{option.label}</button>
                ))}
            </fieldset>

            <fieldset className="plan-finder-group">
                <legend>Days a week you can genuinely commit to</legend>
                {[2, 3, 4, 5, 6].map(days => (
                    <button
                        key={days}
                        className={preferences.daysPerWeek === days ? 'plan-finder-chip is-active' : 'plan-finder-chip'}
                        onClick={() => setPreferences(current => ({ ...current, daysPerWeek: days }))}
                    >{days}</button>
                ))}
            </fieldset>

            <fieldset className="plan-finder-group">
                <legend>Equipment <span className="plan-finder-optional">(optional)</span></legend>
                {EQUIPMENT.map(option => (
                    <button
                        key={option.id}
                        className={preferences.equipment === option.id ? 'plan-finder-chip is-active' : 'plan-finder-chip'}
                        onClick={() => setPreferences(current => ({
                            ...current,
                            equipment: current.equipment === option.id ? undefined : option.id,
                        }))}
                    >{option.label}</button>
                ))}
            </fieldset>

            {!answered ? (
                <p className="plan-finder-hint">Answer the first three and the shortlist appears here.</p>
            ) : !results.length ? (
                <p className="plan-finder-hint">
                    Nothing in your catalogue fits that combination. Widen the days or the equipment, or browse the full
                    list below — the descriptions are written to be read.
                </p>
            ) : (
                <ol className="plan-finder-results">
                    {results.map(({ entry, reasons, caveats }) => (
                        <li key={entry.id}>
                            <div className="plan-finder-result-head">
                                <strong>{planName(entry.id)}</strong>
                                <span>{entry.weeks} weeks · {entry.frequency.join('/')} days</span>
                            </div>
                            <ul className="plan-finder-reasons">
                                {reasons.map((reason, index) => (
                                    <li key={index}><Check className="h-3 w-3" aria-hidden="true" />{reason}</li>
                                ))}
                            </ul>
                            {/* Never suppressed: the reason to walk away is the
                                most useful thing the matrix knows. */}
                            <ul className="plan-finder-caveats">
                                {caveats.map((caveat, index) => (
                                    <li key={index}>Not for you if: {caveat}</li>
                                ))}
                            </ul>
                            <Button size="sm" onClick={() => onPick(entry.id)}>Choose this plan</Button>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
};
