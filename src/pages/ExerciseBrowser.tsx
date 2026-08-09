import React, { useMemo, useState } from 'react';
import { Dumbbell, Search, X } from 'lucide-react';

import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import { Input } from '../components/ui/input';
import { getVariantTip } from '../data/exercises/variantTips';
import type { LibraryExercise, MajorMuscleGroup } from '../data/exercises/types';
import { MUSCLE_AGGREGATES } from '../data/exercises/types';

/** Coarse groups make a usable filter row; the fine-grained list would not. */
const GROUPS = Object.keys(MUSCLE_AGGREGATES) as MajorMuscleGroup[];

const majorOf = (exercise: LibraryExercise): MajorMuscleGroup[] => {
    const found = new Set<MajorMuscleGroup>();
    for (const muscle of exercise.primary ?? []) {
        for (const [group, muscles] of Object.entries(MUSCLE_AGGREGATES) as [MajorMuscleGroup, string[]][]) {
            if (muscles.includes(muscle)) found.add(group);
        }
    }
    return [...found];
};

export const ExerciseBrowser: React.FC = () => {
    const { exerciseResolver } = useUser();
    const { language } = useLanguage();

    const [query, setQuery] = useState('');
    const [group, setGroup] = useState<MajorMuscleGroup | 'all'>('all');
    const [selected, setSelected] = useState<LibraryExercise | null>(null);

    const all = useMemo(
        () => exerciseResolver.all
            .filter(e => e.status === 'active')
            .sort((a, b) => (a.name[language] || a.name.en).localeCompare(b.name[language] || b.name.en)),
        [exerciseResolver, language]
    );

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return all.filter(e => {
            if (group !== 'all' && !majorOf(e).includes(group)) return false;
            if (!q) return true;
            // Aliases are searchable so a plan's own wording finds the entry.
            return (
                (e.name[language] || '').toLowerCase().includes(q) ||
                e.name.en.toLowerCase().includes(q) ||
                e.aliases.some(a => a.toLowerCase().includes(q)) ||
                e.equipment.some(eq => eq.includes(q))
            );
        });
    }, [all, query, group, language]);

    const displayName = (e: LibraryExercise) => e.name[language] || e.name.en;
    const tipFor = (e: LibraryExercise) => {
        const variant = getVariantTip(e.name.en, 1);
        const tip = variant ?? e.tip;
        return tip?.[language] || tip?.en;
    };

    return (
        <div className="instrument-page space-y-6 pb-16">
            <header className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Dumbbell className="h-6 w-6" /> {t(language, 'title')}
                </h2>
                <p className="text-muted-foreground text-sm">{t(language, 'subtitle', all.length)}</p>
            </header>

            <div className="exercise-browser-tools">
                <div className="admin-search">
                    <Search className="h-4 w-4" />
                    <Input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder={t(language, 'search')}
                        aria-label={t(language, 'search')}
                    />
                    {query && (
                        <button onClick={() => setQuery('')} aria-label={t(language, 'clear')}>
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <div className="exercise-browser-filters">
                    <button className={group === 'all' ? 'admin-chip is-active' : 'admin-chip'} onClick={() => setGroup('all')}>
                        {t(language, 'all')}
                    </button>
                    {GROUPS.map(g => (
                        <button key={g} className={group === g ? 'admin-chip is-active' : 'admin-chip'} onClick={() => setGroup(g)}>
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {!visible.length ? (
                <div className="admin-empty"><Search /><h3>{t(language, 'empty')}</h3></div>
            ) : (
                <div className="exercise-grid">
                    {visible.map(e => (
                        <button key={e.id} className="exercise-card" onClick={() => setSelected(e)}>
                            <strong>{displayName(e)}</strong>
                            <span className="exercise-card-meta">
                                {majorOf(e).slice(0, 2).map(g => <span className="admin-tag" key={g}>{g}</span>)}
                                {e.equipment.slice(0, 2).map(eq => <span className="admin-tag is-muted" key={eq}>{eq}</span>)}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {selected && (
                <div className="exercise-sheet-backdrop" role="dialog" aria-modal="true" onClick={() => setSelected(null)}>
                    <div className="exercise-sheet" onClick={event => event.stopPropagation()}>
                        <div className="exercise-sheet-head">
                            <div>
                                <h3>{displayName(selected)}</h3>
                                {/* Show the English name too when viewing in Polish: gym
                                    signage and plan text are frequently English. */}
                                {language !== 'en' && selected.name.en !== displayName(selected) && (
                                    <p className="exercise-sheet-alt">{selected.name.en}</p>
                                )}
                            </div>
                            <button onClick={() => setSelected(null)} aria-label={t(language, 'close')}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="exercise-sheet-body">
                            {tipFor(selected) && <p className="exercise-sheet-tip">{tipFor(selected)}</p>}
                            {selected.setupNotes && (
                                <p className="exercise-sheet-setup">
                                    {selected.setupNotes[language] || selected.setupNotes.en}
                                </p>
                            )}

                            <dl className="exercise-sheet-facts">
                                <div><dt>{t(language, 'pattern')}</dt><dd>{selected.pattern}</dd></div>
                                <div><dt>{t(language, 'primary')}</dt><dd>{(selected.primary ?? []).join(', ') || '—'}</dd></div>
                                {selected.secondary?.length ? (
                                    <div><dt>{t(language, 'secondary')}</dt><dd>{selected.secondary.join(', ')}</dd></div>
                                ) : null}
                                <div><dt>{t(language, 'equipment')}</dt><dd>{selected.equipment.join(', ')}</dd></div>
                                {selected.unilateral && <div><dt>{t(language, 'unilateral')}</dt><dd>{t(language, 'yes')}</dd></div>}
                                {selected.strengthRef && (
                                    <div>
                                        <dt>{t(language, 'balance')}</dt>
                                        <dd>
                                            ~{selected.strengthRef.poliquinPercent}% of{' '}
                                            {exerciseResolver.byId(selected.strengthRef.ratioOf)?.name.en ?? selected.strengthRef.ratioOf}
                                            <small>{t(language, 'balanceNote')}</small>
                                        </dd>
                                    </div>
                                )}
                            </dl>

                            {selected.aliases.length > 0 && (
                                <p className="exercise-sheet-aliases">
                                    {t(language, 'alsoKnown')}: {selected.aliases.slice(0, 6).join(' · ')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Local copy rather than translations.ts keys: this screen's strings are only
 * used here, and adding them to the shared bundle would grow a 144k file for
 * no reuse.
 */
const COPY = {
    en: {
        title: 'Exercise library', subtitle: (n: number) => `${n} movements used across every plan.`,
        search: 'Search name, equipment or an old spelling', clear: 'Clear search', all: 'All',
        empty: 'Nothing matches', pattern: 'Movement', primary: 'Primary', secondary: 'Also works',
        equipment: 'Equipment', unilateral: 'One side at a time', yes: 'Yes',
        balance: 'Structural balance', balanceNote: 'Poliquin reference target, not a medical threshold.',
        alsoKnown: 'Also written as', close: 'Close',
    },
    pl: {
        title: 'Biblioteka ćwiczeń', subtitle: (n: number) => `${n} ruchów używanych we wszystkich planach.`,
        search: 'Szukaj nazwy, sprzętu lub starej pisowni', clear: 'Wyczyść', all: 'Wszystkie',
        empty: 'Brak wyników', pattern: 'Wzorzec ruchu', primary: 'Główne mięśnie', secondary: 'Wspomagające',
        equipment: 'Sprzęt', unilateral: 'Jednostronne', yes: 'Tak',
        balance: 'Równowaga strukturalna', balanceNote: 'Wartość referencyjna Poliquina, nie norma medyczna.',
        alsoKnown: 'Inne zapisy', close: 'Zamknij',
    },
} as const;

function t(lang: string, key: keyof typeof COPY.en, n?: number): string {
    const bundle = COPY[lang === 'pl' ? 'pl' : 'en'];
    const value = bundle[key];
    return typeof value === 'function' ? value(n ?? 0) : value;
}
