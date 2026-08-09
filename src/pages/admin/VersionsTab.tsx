import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check, History, RotateCcw } from 'lucide-react';

import { Button } from '../../components/ui/button';
import { PLAN_REGISTRY } from '../../data/plans';
import { ORDERED_PLAN_META } from '../../data/planMeta';
import { EXERCISE_LIBRARY } from '../../data/exercises/library';
import { createResolver } from '../../data/exercises';
import { listPlanConfigVersions, loadPlanConfig, savePlanConfig } from '../../data/exercises/planConfigRemote';
import type { PlanExerciseConfig, PlanExerciseDoc } from '../../data/exercises/types';

const resolver = createResolver(EXERCISE_LIBRARY);

type Change = { exerciseId: string; name: string; kind: 'added' | 'removed' | 'changed'; fields: string[] };

/**
 * Field-level diff between two published configs.
 *
 * A whole-document JSON dump would technically be a diff, but nobody reviewing
 * a training change wants to read one — what matters is which movements changed
 * and in what respect.
 */
const diff = (from: PlanExerciseDoc | null, to: PlanExerciseDoc): Change[] => {
    const before = from?.exercises ?? {};
    const after = to.exercises ?? {};
    const ids = [...new Set([...Object.keys(before), ...Object.keys(after)])];

    const changes: Change[] = [];
    for (const id of ids) {
        const a = before[id];
        const b = after[id];
        const name = resolver.byId(id)?.name.en ?? id;

        if (!a && b) { changes.push({ exerciseId: id, name, kind: 'added', fields: Object.keys(b) }); continue; }
        if (a && !b) { changes.push({ exerciseId: id, name, kind: 'removed', fields: Object.keys(a) }); continue; }
        if (!a || !b) continue;

        const fields = [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(
            key => JSON.stringify(a[key as keyof PlanExerciseConfig]) !== JSON.stringify(b[key as keyof PlanExerciseConfig])
        );
        if (fields.length) changes.push({ exerciseId: id, name, kind: 'changed', fields });
    }
    return changes.sort((x, y) => x.name.localeCompare(y.name));
};

const describeField = (field: string): string => ({
    setsDelta: 'sets adjustment', setsOverride: 'set count', repsMin: 'minimum reps', repsMax: 'maximum reps',
    restSeconds: 'rest', tempo: 'tempo', technique: 'finishing technique', swap: 'swap policy',
    substituteWith: 'replacement exercise', userExtraSets: 'extra sets', tipOverride: 'tip',
    enabled: 'included in plan', groupId: 'superset', scope: 'weeks it applies to',
}[field] ?? field);

export const VersionsTab: React.FC = () => {
    const [planId, setPlanId] = useState(ORDERED_PLAN_META[0].id);
    const [current, setCurrent] = useState<PlanExerciseDoc | null>(null);
    const [history, setHistory] = useState<PlanExerciseDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
    const [openVersion, setOpenVersion] = useState<number | null>(null);

    const load = useCallback(async (id: string) => {
        setLoading(true);
        setMessage(null);
        try {
            const [live, versions] = await Promise.all([loadPlanConfig(id, true), listPlanConfigVersions(id)]);
            setCurrent(live);
            setHistory(versions);
        } catch (error) {
            setMessage({ kind: 'error', text: `Could not load history: ${(error as Error).message.replace(/\.$/, '')}.` });
            setCurrent(null);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(planId); }, [planId, load]);

    /** Newest first, with the live document at the top. */
    const timeline = useMemo(() => {
        const entries = [...history].sort((a, b) => (b.version ?? 0) - (a.version ?? 0));
        return current && current.version > 0 ? [current, ...entries.filter(v => v.version !== current.version)] : entries;
    }, [history, current]);

    const rollback = async (version: PlanExerciseDoc) => {
        const changes = diff(current, version);
        const confirmed = window.confirm(
            `Roll ${PLAN_REGISTRY[planId]?.program.name ?? planId} back to version ${version.version}?\n\n` +
            `${changes.length} movement${changes.length === 1 ? '' : 's'} will change for every athlete on this plan.\n\n` +
            `This publishes a new version rather than deleting anything, so it can be undone.`
        );
        if (!confirmed) return;

        setBusy(true);
        setMessage(null);
        try {
            // Published as a new version rather than by rewinding the counter,
            // so history stays append-only and a rollback is itself reversible.
            const next = await savePlanConfig(planId, {
                planId,
                exercises: version.exercises ?? {},
                slots: version.slots ?? {},
                groups: version.groups ?? {},
                defaults: version.defaults ?? {},
            }, `rollback to v${version.version}`);
            setMessage({ kind: 'ok', text: `Rolled back to version ${version.version}, published as version ${next}.` });
            await load(planId);
        } catch (error) {
            setMessage({ kind: 'error', text: `Rollback failed: ${(error as Error).message.replace(/\.$/, '')}.` });
        } finally {
            setBusy(false);
        }
    };

    return (
        <main className="admin-console">
            <header className="admin-command-bar">
                <div>
                    <h1><History /> Change history</h1>
                    <p>Every published plan change, what it altered, and how to undo it.</p>
                </div>
                <div className="admin-live"><span /> {timeline.length} version{timeline.length === 1 ? '' : 's'}</div>
            </header>

            {message && (
                <div className={message.kind === 'error' ? 'admin-notice is-error' : 'admin-notice'} role="status">
                    {message.kind === 'error' ? <AlertCircle className="h-4 w-4 shrink-0" /> : <Check className="h-4 w-4 shrink-0" />}
                    <span>{message.text}</span>
                    <button onClick={() => setMessage(null)}>Dismiss</button>
                </div>
            )}

            <section className="admin-sector">
                <div className="admin-sector-heading"><div><h2>Plan</h2></div></div>
                <div className="admin-filter-row">
                    {ORDERED_PLAN_META.map(meta => (
                        <button
                            key={meta.id}
                            className={planId === meta.id ? 'admin-chip is-active' : 'admin-chip'}
                            onClick={() => { setPlanId(meta.id); setOpenVersion(null); }}
                        >
                            {PLAN_REGISTRY[meta.id]?.program.name ?? meta.id}
                        </button>
                    ))}
                </div>
            </section>

            <section className="admin-ledger">
                {loading ? (
                    <div className="admin-empty"><History /><h3>Loading history…</h3></div>
                ) : !timeline.length ? (
                    <div className="admin-empty">
                        <History />
                        <h3>Nothing published yet</h3>
                        <p>This plan runs entirely on its bundled definition. Publish a change in the Plan composer and it will appear here.</p>
                    </div>
                ) : (
                    timeline.map((version, index) => {
                        const isLive = index === 0 && current?.version === version.version;
                        const previous = timeline[index + 1] ?? null;
                        const changes = diff(previous, version);
                        const open = openVersion === version.version;

                        return (
                            <article className={isLive ? 'admin-slot-row is-customised' : 'admin-slot-row'} key={version.version}>
                                <button className="admin-slot-head" aria-expanded={open} onClick={() => setOpenVersion(open ? null : version.version)}>
                                    <span className="admin-slot-name">
                                        <strong>
                                            Version {version.version}
                                            {isLive && <span className="admin-tag">live</span>}
                                        </strong>
                                        <small>
                                            {version.updatedAt ? new Date(version.updatedAt).toLocaleString() : 'unknown date'}
                                            {version.updatedBy ? ` · ${version.updatedBy}` : ''}
                                            {` · ${changes.length} movement${changes.length === 1 ? '' : 's'} changed`}
                                        </small>
                                    </span>
                                    {!isLive && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={busy}
                                            onClick={(event) => { event.stopPropagation(); void rollback(version); }}
                                        >
                                            <RotateCcw className="mr-2 h-3 w-3" />Restore
                                        </Button>
                                    )}
                                </button>

                                {open && (
                                    <div className="admin-slot-body">
                                        {!changes.length ? (
                                            <p className="admin-note">No movement-level differences from the version before it.</p>
                                        ) : (
                                            changes.map(change => (
                                                <p className={`version-change is-${change.kind}`} key={change.exerciseId}>
                                                    <strong>{change.name}</strong>
                                                    <span>
                                                        {change.kind === 'added' ? 'customised' : change.kind === 'removed' ? 'reset to the plan default' : 'changed'}
                                                        {change.fields.length > 0 && `: ${change.fields.map(describeField).join(', ')}`}
                                                    </span>
                                                </p>
                                            ))
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
