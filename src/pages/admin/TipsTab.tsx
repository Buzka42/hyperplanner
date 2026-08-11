import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Check, Languages, RotateCcw, Save, Search, X } from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { EXERCISE_LIBRARY } from '../../data/exercises/library';
import { loadLibrary, saveLibraryEdits } from '../../data/exercises/remote';
import { looksLikePrescription } from '../../features/tips/resolve';
import type { LibraryExercise } from '../../data/exercises/types';

/**
 * General-cue authoring.
 *
 * This is the *general* layer only: how a movement is performed, independent of
 * any plan. Plan and slot guidance is authored in the Plan Composer, and the
 * two are deliberately edited in different places so plan instructions stop
 * leaking into the library — which is exactly what the migration found.
 *
 * The audit flow is two-gated: English is drafted, the owner approves it, and
 * only then is Polish written. The filters here mirror those gates.
 */

type Filter = 'all' | 'missing-en' | 'awaiting-audit' | 'missing-pl' | 'overridden';

const seedById = new Map(EXERCISE_LIBRARY.map(entry => [entry.id, entry]));

const tipOf = (entry: LibraryExercise): { en?: string; pl?: string } => entry.tip ?? {};
const hasEn = (entry: LibraryExercise) => Boolean(tipOf(entry).en?.trim());
const hasPl = (entry: LibraryExercise) => Boolean(tipOf(entry).pl?.trim());
const awaitingAudit = (entry: LibraryExercise) => entry.tipStatus === 'draft';

const differsFromSeed = (entry: LibraryExercise) => {
    const seed = seedById.get(entry.id);
    if (!seed) return true;
    return JSON.stringify(seed.tip ?? null) !== JSON.stringify(entry.tip ?? null)
        || (seed.tipStatus ?? null) !== (entry.tipStatus ?? null);
};

const isDirty = (entry: LibraryExercise, original: LibraryExercise | undefined) =>
    !original
    || JSON.stringify(original.tip ?? null) !== JSON.stringify(entry.tip ?? null)
    || (original.tipStatus ?? null) !== (entry.tipStatus ?? null);

export const TipsTab: React.FC = () => {
    const [entries, setEntries] = useState<LibraryExercise[]>([]);
    const [original, setOriginal] = useState<Map<string, LibraryExercise>>(new Map());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<Filter>('awaiting-audit');

    // Unsaved edits must survive a reload of the list, so the working copy is
    // kept here and only replaced when the athlete-facing data actually changes.
    const draftEdits = useRef<Map<string, LibraryExercise>>(new Map());

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const { library } = await loadLibrary(true);
            const sorted = [...library].sort((a, b) => a.name.en.localeCompare(b.name.en));
            const withDrafts = sorted.map(entry => draftEdits.current.get(entry.id) ?? entry);
            setEntries(withDrafts);
            setOriginal(new Map(sorted.map(entry => [entry.id, structuredClone(entry)])));
        } catch (error) {
            setMessage({ kind: 'error', text: `Could not load the library: ${(error as Error).message}` });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(); }, [load]);

    const dirtyIds = useMemo(
        () => new Set(entries.filter(entry => isDirty(entry, original.get(entry.id))).map(entry => entry.id)),
        [entries, original],
    );

    const counts = useMemo(() => ({
        missingEn: entries.filter(entry => !hasEn(entry)).length,
        awaiting: entries.filter(awaitingAudit).length,
        missingPl: entries.filter(entry => hasEn(entry) && !hasPl(entry)).length,
        overridden: entries.filter(differsFromSeed).length,
    }), [entries]);

    const visible = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return entries.filter(entry => {
            // An entry being edited never disappears mid-keystroke, however the
            // edit affects the active filter.
            const editing = dirtyIds.has(entry.id);
            if (!editing) {
                if (filter === 'missing-en' && hasEn(entry)) return false;
                if (filter === 'awaiting-audit' && !awaitingAudit(entry)) return false;
                if (filter === 'missing-pl' && (!hasEn(entry) || hasPl(entry))) return false;
                if (filter === 'overridden' && !differsFromSeed(entry)) return false;
            }
            if (!needle) return true;
            return entry.name.en.toLowerCase().includes(needle)
                || entry.id.includes(needle)
                || (tipOf(entry).en ?? '').toLowerCase().includes(needle);
        });
    }, [entries, query, filter, dirtyIds]);

    const patch = (id: string, next: Partial<LibraryExercise>) => {
        setEntries(current => current.map(entry => {
            if (entry.id !== id) return entry;
            const updated = { ...entry, ...next };
            draftEdits.current.set(id, updated);
            return updated;
        }));
    };

    const setTip = (entry: LibraryExercise, language: 'en' | 'pl', value: string) => {
        const current = tipOf(entry);
        patch(entry.id, { tip: { en: current.en ?? '', pl: current.pl ?? '', [language]: value } });
    };

    const save = async () => {
        const changed = entries.filter(entry => dirtyIds.has(entry.id));
        if (!changed.length) return;
        setSaving(true);
        try {
            const version = await saveLibraryEdits(changed);
            draftEdits.current.clear();
            setMessage({ kind: 'ok', text: `Saved ${changed.length} cue${changed.length === 1 ? '' : 's'} as library version ${version}.` });
            await load();
        } catch (error) {
            setMessage({ kind: 'error', text: `Could not save: ${(error as Error).message}` });
        } finally {
            setSaving(false);
        }
    };

    const approved = entries.length - counts.awaiting;
    const pct = entries.length ? Math.round((approved / entries.length) * 100) : 0;

    return (
        <section className="admin-panel">
            <header className="admin-panel-header">
                <h2>Exercise cues</h2>
                <p className="text-sm text-muted-foreground">
                    How the movement is performed, independent of any plan. Plan and slot guidance is authored in the
                    Plan Composer — keep prescribed loads, set counts, RIR and test-day instructions out of this layer.
                </p>
            </header>

            <div className="admin-progress-block">
                <div className="admin-progress-label">
                    <span>{approved} of {entries.length} cues audited</span>
                    <strong className="admin-progress-figure">{pct}%</strong>
                </div>
                <div className="admin-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                    <span style={{ '--admin-progress': pct / 100 } as React.CSSProperties} />
                </div>
            </div>

            <div className="admin-ledger-tools">
                <div className="admin-filter-row">
                    {([
                        ['all', `All (${entries.length})`],
                        ['missing-en', `Missing English (${counts.missingEn})`],
                        ['awaiting-audit', `Awaiting audit (${counts.awaiting})`],
                        ['missing-pl', `Missing Polish (${counts.missingPl})`],
                        ['overridden', `Overridden (${counts.overridden})`],
                    ] as [Filter, string][]).map(([id, label]) => (
                        <button
                            key={id}
                            className={filter === id ? 'admin-chip is-active' : 'admin-chip'}
                            onClick={() => setFilter(id)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="admin-search">
                    <Search className="h-4 w-4" />
                    <Input
                        aria-label="Search cues"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search name, id or cue text"
                    />
                    {query && <button onClick={() => setQuery('')} aria-label="Clear search"><X className="h-4 w-4" /></button>}
                </div>
                <Button onClick={save} disabled={saving || !dirtyIds.size}>
                    <Save className="mr-2 h-4 w-4" /> {dirtyIds.size ? `Save ${dirtyIds.size}` : 'Saved'}
                </Button>
            </div>

            {message && (
                <p className={message.kind === 'ok' ? 'admin-message is-ok' : 'admin-message is-error'}>
                    {message.kind === 'ok' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {message.text}
                </p>
            )}

            {loading ? (
                <div className="admin-empty"><Languages /><h3>Loading cues…</h3></div>
            ) : !visible.length ? (
                <div className="admin-empty">
                    <Search /><h3>Nothing matches</h3>
                    <p>Clear the search or pick a different filter.</p>
                </div>
            ) : visible.map(entry => {
                const dirty = dirtyIds.has(entry.id);
                const warning = hasEn(entry) && looksLikePrescription(tipOf(entry).en!);
                return (
                    <article className={dirty ? 'admin-tip-row is-dirty' : 'admin-tip-row'} key={entry.id}>
                        <header className="admin-tip-row-head">
                            <strong>{entry.name.en}</strong>
                            <span className="admin-tip-meta">
                                {awaitingAudit(entry) ? 'awaiting audit' : 'approved'}
                                {differsFromSeed(entry) && ' · overridden'}
                            </span>
                        </header>

                        <Label className="sr-only" htmlFor={`tip-en-${entry.id}`}>English cue</Label>
                        <textarea
                            id={`tip-en-${entry.id}`}
                            className="admin-textarea"
                            rows={2}
                            value={tipOf(entry).en ?? ''}
                            placeholder="English coaching cue"
                            onChange={event => setTip(entry, 'en', event.target.value)}
                        />

                        {warning && (
                            <p className="admin-tip-warning">
                                <AlertCircle className="h-3.5 w-3.5" />
                                This reads like plan guidance — weeks, percentages, set counts or RIR belong in the Plan Composer.
                            </p>
                        )}

                        <Label className="sr-only" htmlFor={`tip-pl-${entry.id}`}>Polish cue</Label>
                        <textarea
                            id={`tip-pl-${entry.id}`}
                            className="admin-textarea"
                            rows={2}
                            value={tipOf(entry).pl ?? ''}
                            placeholder={awaitingAudit(entry) ? 'Approve the English cue before translating' : 'Polish coaching cue'}
                            disabled={awaitingAudit(entry)}
                            onChange={event => setTip(entry, 'pl', event.target.value)}
                        />

                        <div className="admin-tip-actions">
                            {awaitingAudit(entry) ? (
                                <Button size="sm" variant="outline" onClick={() => patch(entry.id, { tipStatus: 'approved' })}>
                                    <Check className="mr-2 h-3 w-3" /> Approve English
                                </Button>
                            ) : (
                                <Button size="sm" variant="ghost" onClick={() => patch(entry.id, { tipStatus: 'draft' })}>
                                    <RotateCcw className="mr-2 h-3 w-3" /> Send back to audit
                                </Button>
                            )}
                        </div>
                    </article>
                );
            })}
        </section>
    );
};
