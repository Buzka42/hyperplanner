import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check, History, RotateCcw, Undo2 } from 'lucide-react';

import { Button } from '../../components/ui/button';
import { PLAN_REGISTRY } from '../../data/plans';
import { EXERCISE_LIBRARY } from '../../data/exercises/library';
import { createResolver } from '../../data/exercises';
import { listAllPlanChanges, savePlanConfig, type PlanChangeEntry } from '../../data/exercises/planConfigRemote';
import type { PlanExerciseConfig, PlanExerciseDoc } from '../../data/exercises/types';

const resolver = createResolver(EXERCISE_LIBRARY);

type Change = {
    key: string;
    label: string;
    scope: 'movement' | 'session' | 'plan';
    kind: 'added' | 'removed' | 'changed';
    fields: string[];
};

const describeField = (field: string): string => ({
    setsDelta: 'sets adjustment', setsOverride: 'set count', repsMin: 'minimum reps', repsMax: 'maximum reps',
    restSeconds: 'rest', tempo: 'tempo', technique: 'finishing technique', swap: 'swap policy',
    substituteWith: 'replacement exercise', userExtraSets: 'extra sets', tipOverride: 'plan guidance',
    tipAppend: 'appended cue', suppressGeneralTip: 'movement cue visibility',
    enabled: 'included in plan', groupId: 'superset', groupRole: 'superset role',
    scope: 'weeks it applies to', order: 'running order', target: 'target',
}[field] ?? field);

const nameFor = (key: string, scope: 'movement' | 'session'): string =>
    scope === 'movement' ? (resolver.byId(key)?.name.en ?? key) : `Session slot ${key}`;

/**
 * Field-level diff between two published configs.
 *
 * A whole-document JSON dump would technically be a diff, but nobody reviewing
 * a training change wants to read one — what matters is which movements changed
 * and in what respect.
 */
const diff = (from: PlanExerciseDoc | undefined, to: PlanExerciseDoc): Change[] => {
    const changes: Change[] = [];

    const compare = (
        before: Record<string, PlanExerciseConfig>,
        after: Record<string, PlanExerciseConfig>,
        scope: 'movement' | 'session',
    ) => {
        for (const key of [...new Set([...Object.keys(before), ...Object.keys(after)])]) {
            const a = before[key];
            const b = after[key];
            const label = nameFor(key, scope);

            if (!a && b) { changes.push({ key: `${scope}:${key}`, label, scope, kind: 'added', fields: Object.keys(b) }); continue; }
            if (a && !b) { changes.push({ key: `${scope}:${key}`, label, scope, kind: 'removed', fields: Object.keys(a) }); continue; }
            if (!a || !b) continue;

            const fields = [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(
                field => JSON.stringify(a[field as keyof PlanExerciseConfig]) !== JSON.stringify(b[field as keyof PlanExerciseConfig])
            );
            if (fields.length) changes.push({ key: `${scope}:${key}`, label, scope, kind: 'changed', fields });
        }
    };

    compare(from?.exercises ?? {}, to.exercises ?? {}, 'movement');
    compare(from?.slots ?? {}, to.slots ?? {}, 'session');

    if (JSON.stringify(from?.defaults ?? {}) !== JSON.stringify(to.defaults ?? {})) {
        changes.push({ key: 'plan:defaults', label: 'Plan defaults', scope: 'plan', kind: 'changed', fields: ['defaults'] });
    }
    if (JSON.stringify(from?.groups ?? {}) !== JSON.stringify(to.groups ?? {})) {
        changes.push({ key: 'plan:groups', label: 'Supersets', scope: 'plan', kind: 'changed', fields: ['groups'] });
    }

    return changes.sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * Change history across the whole portfolio.
 *
 * A revert is one click and needs no confirmation, because it is not
 * destructive: restoring an old version publishes it as a new one, so nothing
 * is lost and the revert itself can be reverted. The undo offered afterwards is
 * a convenience on top of that, not the safety net.
 */
export const ChangelogTab: React.FC = () => {
    const [entries, setEntries] = useState<PlanChangeEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<string | null>(null);
    const [planFilter, setPlanFilter] = useState<string>('all');
    const [open, setOpen] = useState<string | null>(null);
    const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
    /** What the last revert replaced, so it can be put straight back. */
    const [undo, setUndo] = useState<{ planId: string; doc: PlanExerciseDoc; label: string } | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            setEntries(await listAllPlanChanges());
        } catch (error) {
            setMessage({ kind: 'error', text: `Could not load the changelog: ${(error as Error).message.replace(/\.$/, '')}.` });
            setEntries([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(); }, [load]);

    const publish = async (planId: string, source: PlanExerciseDoc, note: string) => {
        // Published as a new version rather than by rewinding the counter, so
        // history stays append-only and a revert is itself reversible.
        return savePlanConfig(planId, {
            planId,
            exercises: source.exercises ?? {},
            slots: source.slots ?? {},
            groups: source.groups ?? {},
            defaults: source.defaults ?? {},
        }, 'admin', note);
    };

    const revert = async (entry: PlanChangeEntry) => {
        const planName = PLAN_REGISTRY[entry.planId]?.program.name ?? entry.planId;
        const live = entries.find(e => e.planId === entry.planId && e.isLive)?.doc;

        setBusy(`${entry.planId}:${entry.doc.version}`);
        setMessage(null);
        try {
            const version = await publish(entry.planId, entry.doc, `revert to v${entry.doc.version}`);
            if (live) setUndo({ planId: entry.planId, doc: live, label: `${planName} v${live.version}` });
            setMessage({
                kind: 'ok',
                text: `${planName} reverted to version ${entry.doc.version}, published as version ${version}.`,
            });
            await load();
        } catch (error) {
            setMessage({ kind: 'error', text: `Revert failed: ${(error as Error).message.replace(/\.$/, '')}.` });
        } finally {
            setBusy(null);
        }
    };

    const applyUndo = async () => {
        if (!undo) return;
        setBusy('undo');
        try {
            await publish(undo.planId, undo.doc, `undo revert, back to v${undo.doc.version}`);
            setMessage({ kind: 'ok', text: `Put back ${undo.label}.` });
            setUndo(null);
            await load();
        } catch (error) {
            setMessage({ kind: 'error', text: `Could not undo: ${(error as Error).message.replace(/\.$/, '')}.` });
        } finally {
            setBusy(null);
        }
    };

    const planIds = useMemo(
        () => [...new Set(entries.map(e => e.planId))]
            .sort((a, b) => (PLAN_REGISTRY[a]?.program.name ?? a).localeCompare(PLAN_REGISTRY[b]?.program.name ?? b)),
        [entries]
    );

    const visible = useMemo(
        () => (planFilter === 'all' ? entries : entries.filter(e => e.planId === planFilter)),
        [entries, planFilter]
    );

    return (
        <main className="admin-console">
            <header className="admin-command-bar">
                <div>
                    <h1><History /> Changelog</h1>
                    <p>Every published plan change across the portfolio, what it altered, and one click to put it back.</p>
                </div>
                <div className="admin-live"><span /> {entries.length} change{entries.length === 1 ? '' : 's'}</div>
            </header>

            {message && (
                <div className={message.kind === 'error' ? 'admin-notice is-error' : 'admin-notice'} role="status">
                    {message.kind === 'error' ? <AlertCircle className="h-4 w-4 shrink-0" /> : <Check className="h-4 w-4 shrink-0" />}
                    <span>{message.text}</span>
                    {undo && message.kind === 'ok' && (
                        <Button variant="outline" size="sm" disabled={busy !== null} onClick={() => void applyUndo()}>
                            <Undo2 className="mr-2 h-3 w-3" />Undo
                        </Button>
                    )}
                    <button onClick={() => { setMessage(null); setUndo(null); }}>Dismiss</button>
                </div>
            )}

            {planIds.length > 1 && (
                <section className="admin-sector">
                    <div className="admin-filter-row">
                        <button className={planFilter === 'all' ? 'admin-chip is-active' : 'admin-chip'}
                            onClick={() => setPlanFilter('all')}>All plans</button>
                        {planIds.map(id => (
                            <button key={id} className={planFilter === id ? 'admin-chip is-active' : 'admin-chip'}
                                onClick={() => setPlanFilter(id)}>
                                {PLAN_REGISTRY[id]?.program.name ?? id}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            <section className="admin-ledger">
                {loading ? (
                    <div className="admin-empty"><History /><h3>Loading the changelog…</h3></div>
                ) : !visible.length ? (
                    <div className="admin-empty">
                        <History />
                        <h3>Nothing published yet</h3>
                        <p>Every plan is running on its bundled definition. Publish a change in the Plan composer and it will appear here.</p>
                    </div>
                ) : (
                    visible.map(entry => {
                        const id = `${entry.planId}:${entry.doc.version}`;
                        const changes = diff(entry.previous, entry.doc);
                        const isOpen = open === id;
                        const planName = PLAN_REGISTRY[entry.planId]?.program.name ?? entry.planId;

                        return (
                            <article className={entry.isLive ? 'admin-slot-row is-customised' : 'admin-slot-row'} key={id}>
                                <div className="changelog-head">
                                    <button className="admin-slot-head" aria-expanded={isOpen}
                                        onClick={() => setOpen(isOpen ? null : id)}>
                                        <span className="admin-slot-name">
                                            <strong>
                                                {planName}
                                                <span className="changelog-version">v{entry.doc.version}</span>
                                                {entry.isLive && <span className="admin-tag">live</span>}
                                            </strong>
                                            <small>
                                                {entry.doc.updatedAt ? new Date(entry.doc.updatedAt).toLocaleString() : 'unknown date'}
                                                {entry.doc.updatedBy ? ` · ${entry.doc.updatedBy}` : ''}
                                                {` · ${changes.length} change${changes.length === 1 ? '' : 's'}`}
                                            </small>
                                            {entry.doc.note && <em className="changelog-note">{entry.doc.note}</em>}
                                        </span>
                                    </button>
                                    {!entry.isLive && (
                                        <Button variant="outline" size="sm" disabled={busy !== null}
                                            onClick={() => void revert(entry)}>
                                            <RotateCcw className="mr-2 h-3 w-3" />
                                            {busy === id ? 'Reverting…' : 'Revert'}
                                        </Button>
                                    )}
                                </div>

                                {isOpen && (
                                    <div className="admin-slot-body">
                                        {!changes.length ? (
                                            <p className="admin-note">No differences from the version before it.</p>
                                        ) : (
                                            changes.map(change => (
                                                <p className={`version-change is-${change.kind}`} key={change.key}>
                                                    <strong>{change.label}</strong>
                                                    <span>
                                                        {change.kind === 'added' ? 'customised' : change.kind === 'removed' ? 'reset to the plan default' : 'changed'}
                                                        {change.fields.length > 0 && `: ${change.fields.map(describeField).join(', ')}`}
                                                    </span>
                                                </p>
                                            ))
                                        )}
                                        {!entry.isLive && (
                                            <p className="admin-note">
                                                Reverting publishes this version as a new one. Nothing is deleted, and the
                                                revert can itself be reverted.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </article>
                        );
                    })
                )}
            </section>
        </main>
    );
};
