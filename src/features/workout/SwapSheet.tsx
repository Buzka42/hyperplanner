import React, { useMemo, useState } from 'react';
import { Repeat, RotateCcw, Search, X } from 'lucide-react';

import { Input } from '../../components/ui/input';
import type { Lang, ResolvedSwap } from '../../data/exercises/types';

/**
 * Exercise swap picker.
 *
 * Replaces a row of unlabelled "Swap" buttons that, before the exercise layer
 * existed, silently did nothing for all but six hardcoded exercise names. What
 * appears here is whatever the plan's swap policy permits — an explicit pool, a
 * swap group, anything sharing the movement pattern, or (for test accounts)
 * the whole library.
 */
export const SwapSheet: React.FC<{
    exerciseName: string;
    swap: ResolvedSwap;
    lang: Lang;
    onChoose: (exerciseId: string | null) => void;
    onClose: () => void;
}> = ({ exerciseName, swap, lang, onChoose, onClose }) => {
    const [query, setQuery] = useState('');

    const options = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return swap.options;
        return swap.options.filter(
            o => (o.name[lang] || o.name.en).toLowerCase().includes(q) || o.name.en.toLowerCase().includes(q)
        );
    }, [swap.options, query, lang]);

    // Only worth a search box when the list is long enough to scroll.
    const showSearch = swap.options.length > 8;

    return (
        <div className="exercise-sheet-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="exercise-sheet" onClick={event => event.stopPropagation()}>
                <div className="exercise-sheet-head">
                    <div>
                        <h3>Swap {exerciseName}</h3>
                        <p className="exercise-sheet-alt">
                            {swap.policy === 'any'
                                ? 'Any movement that trains the same pattern.'
                                : swap.policy === 'group'
                                    ? 'Alternatives your coach grouped with this movement.'
                                    : 'Alternatives your coach approved.'}
                        </p>
                    </div>
                    <button onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
                </div>

                <div className="exercise-sheet-body">
                    {showSearch && (
                        <div className="admin-search">
                            <Search className="h-4 w-4" />
                            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search alternatives" aria-label="Search alternatives" />
                        </div>
                    )}

                    {swap.current && (
                        <button className="swap-option is-reset" onClick={() => onChoose(null)}>
                            <RotateCcw className="h-4 w-4" />
                            <span>Back to the plan's own choice</span>
                        </button>
                    )}

                    {!options.length ? (
                        <p className="exercise-sheet-setup">No alternatives match.</p>
                    ) : (
                        <div className="swap-options">
                            {options.map(option => (
                                <button
                                    key={option.id}
                                    className={option.id === swap.current ? 'swap-option is-current' : 'swap-option'}
                                    onClick={() => onChoose(option.id)}
                                >
                                    <span className="swap-option-name">{option.name[lang] || option.name.en}</span>
                                    <span className="swap-option-meta">
                                        {option.equipment.slice(0, 2).join(' · ')}
                                    </span>
                                    {option.id === swap.current && <Repeat className="h-4 w-4 shrink-0" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
