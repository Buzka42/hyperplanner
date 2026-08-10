import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Check, Languages, RotateCcw, Save, Search, X } from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { EXERCISE_LIBRARY } from '../../data/exercises/library';
import { loadLibrary, saveLibraryEdits } from '../../data/exercises/remote';
import type { LibraryExercise } from '../../data/exercises/types';

type Filter = 'all' | 'missing-pl' | 'translated' | 'edited';

const seedById = new Map(EXERCISE_LIBRARY.map(e => [e.id, e]));

const isTranslated = (e: LibraryExercise) => Boolean(e.name.pl?.trim());

/** Only name edits are compared here; this tab is the naming surface. */
const isDirty = (e: LibraryExercise, original: LibraryExercise | undefined) =>
    !original || e.name.en !== original.name.en || e.name.pl !== original.name.pl;

const differsFromSeed = (e: LibraryExercise) => {
    const seed = seedById.get(e.id);
    return !seed || seed.name.en !== e.name.en || seed.name.pl !== e.name.pl;
};

export const LibraryTab: React.FC = () => {
    const [entries, setEntries] = useState<LibraryExercise[]>([]);
    const [original, setOriginal] = useState<Map<string, LibraryExercise>>(new Map());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<Filter>('all');
    const [pattern, setPattern] = useState('all');

    const plInputs = useRef<Record<string, HTMLInputElement | null>>({});

    // --- load -------------------------------------------------------------
    const load = useCallback(async () => {
        setLoading(true);
        try {
            const { library } = await loadLibrary(true);
            const sorted = [...library].sort((a, b) => a.name.en.localeCompare(b.name.en));
            setEntries(sorted);
            setOriginal(new Map(sorted.map(e => [e.id, structuredClone(e)])));
        } catch (error) {
            setMessage({ kind: 'error', text: `Could not load the library: ${(error as Error).message}` });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(); }, [load]);

    // --- derived ----------------------------------------------------------
    const dirtyIds = useMemo(
        () => new Set(entries.filter(e => isDirty(e, original.get(e.id))).map(e => e.id)),
        [entries, original]
    );

    const translatedCount = useMemo(() => entries.filter(isTranslated).length, [entries]);

    const patterns = useMemo(
        () => [...new Set(entries.map(e => e.pattern))].sort(),
        [entries]
    );

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return entries.filter(e => {
            if (pattern !== 'all' && e.pattern !== pattern) return false;
            // A row you are actively editing stays put even once it no longer
            // matches the filter. Without this, typing a Polish name under the
            // "Missing Polish" filter makes the row vanish mid-keystroke.
            const editing = dirtyIds.has(e.id);
            if (filter === 'missing-pl' && isTranslated(e) && !editing) return false;
            if (filter === 'translated' && !isTranslated(e) && !editing) return false;
            if (filter === 'edited' && !editing) return false;
            if (!q) return true;
            return (
                e.name.en.toLowerCase().includes(q) ||
                (e.name.pl ?? '').toLowerCase().includes(q) ||
                e.id.includes(q) ||
                e.aliases.some(a => a.toLowerCase().includes(q))
            );
        });
    }, [entries, query, filter, pattern, dirtyIds]);

    // --- edit -------------------------------------------------------------
    const setName = (id: string, lang: 'en' | 'pl', value: string) =>
        setEntries(prev => prev.map(e => (e.id === id ? { ...e, name: { ...e.name, [lang]: value } } : e)));

    const revert = (id: string) => {
        const before = original.get(id);
        if (before) setEntries(prev => prev.map(e => (e.id === id ? structuredClone(before) : e)));
    };

    const revertToSeed = (id: string) => {
        const seed = seedById.get(id);
        if (seed) setEntries(prev => prev.map(e => (e.id === id ? { ...e, name: { ...seed.name } } : e)));
    };

    /** Enter jumps to the next untranslated row — the fast path for bulk entry. */
    const focusNextEmpty = (fromId: string) => {
        const index = visible.findIndex(e => e.id === fromId);
        const next = visible.slice(index + 1).find(e => !isTranslated(e));
        if (next) plInputs.current[next.id]?.focus();
    };

    const discardAll = () => {
        setEntries(prev => prev.map(e => structuredClone(original.get(e.id) ?? e)));
        setMessage(null);
    };

    const save = async () => {
        const changed = entries.filter(e => dirtyIds.has(e.id));
        if (!changed.length) return;
        setSaving(true);
        setMessage(null);
        try {
            await saveLibraryEdits(changed);
            setOriginal(new Map(entries.map(e => [e.id, structuredClone(e)])));
            setMessage({ kind: 'ok', text: `Saved ${changed.length} exercise${changed.length === 1 ? '' : 's'}.` });
        } catch (error) {
            const detail = (error as Error).message.replace(/\.$/, '');
            setMessage({
                kind: 'error',
                text: `Save failed: ${detail}. Your edits are still here — fix the problem and save again.`,
            });
        } finally {
            setSaving(false);
        }
    };

    // Guard against losing bulk translation work to an accidental tab close.
    useEffect(() => {
        if (!dirtyIds.size) return;
        const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirtyIds.size]);

    const pct = entries.length ? Math.round((translatedCount / entries.length) * 100) : 0;

    return (
        <main className="admin-console">
            <header className="admin-command-bar">
                <div>
                    <h1><Languages /> Exercise library</h1>
                    <p>Set the English and Polish name for every movement in the app.</p>
                </div>
                <div className="admin-live"><span /> {entries.length} exercises · {translatedCount} translated</div>
            </header>

            {message && (
                <div className={message.kind === 'error' ? 'admin-notice is-error' : 'admin-notice'} role="status">
                    {message.kind === 'error' ? <AlertCircle className="h-4 w-4 shrink-0" /> : <Check className="h-4 w-4 shrink-0" />}
                    <span>{message.text}</span>
                    <button onClick={() => setMessage(null)}>Dismiss</button>
                </div>
            )}

            <section className="admin-sector">
                <div className="admin-sector-heading">
                    <div>
                        <h2>Polish coverage</h2>
                        <p>{translatedCount} of {entries.length} movements have a Polish name. Untranslated names fall back to English in the app.</p>
                    </div>
                    <strong className="admin-progress-figure">{pct}%</strong>
                </div>
                <div className="admin-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                    <span style={{ '--admin-progress': pct / 100 } as React.CSSProperties} />
                </div>
            </section>

            <section className="admin-ledger">
                <div className="admin-ledger-tools">
                    <div className="admin-filter-row">
                        {([
                            ['all', `All (${entries.length})`],
                            ['missing-pl', `Missing Polish (${entries.length - translatedCount})`],
                            ['translated', `Translated (${translatedCount})`],
                            ['edited', `Unsaved (${dirtyIds.size})`],
                        ] as [Filter, string][]).map(([id, label]) => (
                            <button
                                key={id}
                                className={filter === id ? 'admin-chip is-active' : 'admin-chip'}
                                onClick={() => setFilter(id)}
                            >
                                {label}
                            </button>
                        ))}
                        <select
                            className="admin-select"
                            value={pattern}
                            onChange={e => setPattern(e.target.value)}
                            aria-label="Filter by movement pattern"
                        >
                            <option value="all">Every pattern</option>
                            {patterns.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div className="admin-search">
                        <Search className="h-4 w-4" />
                        <Input
                            aria-label="Search exercises"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search name, id or legacy spelling"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} aria-label="Clear search"><X className="h-4 w-4" /></button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="admin-empty"><Languages /><h3>Loading library…</h3></div>
                ) : !visible.length ? (
                    <div className="admin-empty">
                        <Search />
                        <h3>Nothing matches</h3>
                        <p>Clear the search or pick a different filter.</p>
                    </div>
                ) : (
                    <>
                        <div className="admin-name-head" aria-hidden="true">
                            <span>English name</span>
                            <span>Polish name</span>
                            <span>Movement</span>
                            <span />
                        </div>
                        {visible.map(entry => {
                            const dirty = dirtyIds.has(entry.id);
                            const overridden = differsFromSeed(entry);
                            return (
                                <article className={dirty ? 'admin-name-row is-dirty' : 'admin-name-row'} key={entry.id}>
                                    <div className="admin-name-field">
                                        <Label className="sr-only" htmlFor={`en-${entry.id}`}>English name</Label>
                                        <Input
                                            id={`en-${entry.id}`}
                                            value={entry.name.en}
                                            onChange={e => setName(entry.id, 'en', e.target.value)}
                                        />
                                        <small title={entry.aliases.join('\n') || 'No legacy spellings'}>
                                            {entry.id}
                                            {entry.aliases.length > 0 && ` · ${entry.aliases.length} legacy spelling${entry.aliases.length === 1 ? '' : 's'}`}
                                        </small>
                                    </div>

                                    <div className="admin-name-field">
                                        <Label className="sr-only" htmlFor={`pl-${entry.id}`}>Polish name</Label>
                                        <Input
                                            id={`pl-${entry.id}`}
                                            ref={el => { plInputs.current[entry.id] = el; }}
                                            value={entry.name.pl ?? ''}
                                            placeholder={`${entry.name.en} (falls back to English)`}
                                            className={isTranslated(entry) ? undefined : 'admin-input-untranslated'}
                                            onChange={e => setName(entry.id, 'pl', e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') { e.preventDefault(); focusNextEmpty(entry.id); }
                                            }}
                                        />
                                        <small>{isTranslated(entry) ? 'Translated' : 'Shows the English name to Polish users'}</small>
                                    </div>

                                    <div className="admin-name-meta">
                                        <span className="admin-tag">{entry.pattern}</span>
                                        {entry.equipment.slice(0, 2).map(eq => <span className="admin-tag is-muted" key={eq}>{eq}</span>)}
                                    </div>

                                    <div className="admin-row-actions">
                                        {dirty && (
                                            <Button variant="ghost" size="icon" aria-label={`Undo changes to ${entry.name.en}`} onClick={() => revert(entry.id)}>
                                                <RotateCcw />
                                            </Button>
                                        )}
                                        {!dirty && overridden && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                title="Restore the name shipped with the app"
                                                onClick={() => revertToSeed(entry.id)}
                                            >
                                                Reset
                                            </Button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </>
                )}
            </section>

            {dirtyIds.size > 0 && (
                <div className="admin-savebar" role="region" aria-label="Unsaved changes">
                    <span><strong>{dirtyIds.size}</strong> unsaved change{dirtyIds.size === 1 ? '' : 's'}</span>
                    <div>
                        <Button variant="ghost" onClick={discardAll} disabled={saving}>Discard</Button>
                        <Button onClick={save} disabled={saving}>
                            <Save className="mr-2 h-4 w-4" />
                            {saving ? 'Saving…' : 'Save changes'}
                        </Button>
                    </div>
                </div>
            )}
        </main>
    );
};
