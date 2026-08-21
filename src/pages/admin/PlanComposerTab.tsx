import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    AlertCircle, ArrowDown, ArrowUp, Check, ChevronDown, ChevronRight, EyeOff,
    Layers, ListOrdered, RotateCcw, Save, Search, Settings2, Sliders,
} from 'lucide-react';

import { useLanguage, resolveTemplate } from '../../contexts/useTranslation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { PLAN_REGISTRY } from '../../data/plans';
import { ORDERED_PLAN_META } from '../../data/planMeta';
import { EXERCISE_LIBRARY } from '../../data/exercises/library';
import { createResolver } from '../../data/exercises';
import { loadPlanConfig, savePlanConfig } from '../../data/exercises/planConfigRemote';
import type { PlanExerciseConfig, PlanExerciseDoc, SwapPolicy } from '../../data/exercises/types';
import { MovementEditor } from './composer/MovementEditor';
import { SWAP_POLICIES } from './composer/prescriptionOptions';
import { SessionStatsStrip, SessionStatsDetail } from './composer/SessionStatsPanel';
import {
    hasStableSlots, materialiseMovements, materialiseSessions,
    type ComposerDay, type ComposerSlot,
} from './composer/materialise';

const resolver = createResolver(EXERCISE_LIBRARY);

const emptyDoc = (planId: string): PlanExerciseDoc => ({
    planId, version: 0, updatedAt: '', updatedBy: '', exercises: {}, slots: {}, groups: {}, defaults: {},
});

type View = 'sessions' | 'movements' | 'defaults';

/** Only the parts of the document an admin edits; version metadata is the server's. */
const editable = (doc: PlanExerciseDoc) => JSON.stringify({
    exercises: doc.exercises ?? {}, slots: doc.slots ?? {}, groups: doc.groups ?? {}, defaults: doc.defaults ?? {},
});

/** Drops override objects that no longer say anything, so the stored doc stays a real diff. */
const prune = <T extends Record<string, PlanExerciseConfig>>(map: T | undefined): Record<string, PlanExerciseConfig> =>
    Object.fromEntries(Object.entries(map ?? {}).filter(([, v]) => Object.keys(v).length > 0));

export const PlanComposerTab: React.FC = () => {
    const { t } = useLanguage();
    const [planId, setPlanId] = useState(ORDERED_PLAN_META[0].id);
    const [doc, setDoc] = useState<PlanExerciseDoc>(() => emptyDoc(ORDERED_PLAN_META[0].id));
    const [baseline, setBaseline] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
    const [note, setNote] = useState('');

    const [view, setView] = useState<View>('sessions');
    const [query, setQuery] = useState('');
    const [openMovement, setOpenMovement] = useState<string | null>(null);
    const [openSlot, setOpenSlot] = useState<string | null>(null);
    const [openStats, setOpenStats] = useState<string | null>(null);
    const [weekIndex, setWeekIndex] = useState(0);
    /** Slots the admin has narrowed to this session only, rather than the movement. */
    const [slotScoped, setSlotScoped] = useState<Record<string, boolean>>({});

    const stableSlots = useMemo(() => hasStableSlots(planId), [planId]);
    const sessions = useMemo(
        () => (stableSlots ? materialiseSessions(planId, doc, resolver) : []),
        [planId, doc, stableSlots]
    );
    const movements = useMemo(() => materialiseMovements(planId, resolver), [planId]);
    const weeks = useMemo(() => [...new Set(sessions.map(s => s.week))].sort((a, b) => a - b), [sessions]);
    const planWeeks = useMemo(
        () => PLAN_REGISTRY[planId]?.program.weeks.map(w => w.weekNumber) ?? [],
        [planId]
    );

    const load = useCallback(async (id: string) => {
        setLoading(true);
        setMessage(null);
        try {
            const remote = await loadPlanConfig(id, true);
            setDoc(remote);
            setBaseline(editable(remote));
            setSlotScoped(Object.fromEntries(Object.keys(remote.slots ?? {}).map(k => [k, true])));
        } catch (error) {
            setMessage({ kind: 'error', text: `Could not load plan config: ${(error as Error).message}` });
            setDoc(emptyDoc(id));
            setBaseline(editable(emptyDoc(id)));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(planId); }, [planId, load]);
    useEffect(() => { setWeekIndex(0); setOpenSlot(null); setOpenMovement(null); }, [planId]);

    const dirty = editable(doc) !== baseline;

    useEffect(() => {
        if (!dirty) return;
        const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirty]);

    // --- editing -----------------------------------------------------------

    const patchMovement = (exerciseId: string, updates: Partial<PlanExerciseConfig>) =>
        setDoc(prev => ({
            ...prev,
            exercises: { ...prev.exercises, [exerciseId]: { ...(prev.exercises?.[exerciseId] ?? {}), ...updates } },
        }));

    const patchSlot = (slot: string, updates: Partial<PlanExerciseConfig>) =>
        setDoc(prev => ({
            ...prev,
            slots: { ...(prev.slots ?? {}), [slot]: { ...(prev.slots?.[slot] ?? {}), ...updates } },
        }));

    const clearMovement = (exerciseId: string) =>
        setDoc(prev => {
            const next = { ...prev.exercises };
            delete next[exerciseId];
            return { ...prev, exercises: next };
        });

    /** Clears everything except the running order, which is not a movement setting. */
    const clearSlot = (slot: string) =>
        setDoc(prev => {
            const order = prev.slots?.[slot]?.order;
            const next = { ...(prev.slots ?? {}) };
            if (order === undefined) delete next[slot]; else next[slot] = { order };
            return { ...prev, slots: next };
        });

    /**
     * Reordering writes an explicit position for every movement in the session,
     * not just the one that moved. A partial ordering would leave the rest
     * sorting by their generated index, which reads as movements jumping around
     * on their own.
     */
    const reorder = (day: ComposerDay, from: number, to: number) => {
        const list = [...day.slots];
        if (to < 0 || to >= list.length) return;
        const [moved] = list.splice(from, 1);
        list.splice(to, 0, moved);

        setDoc(prev => {
            const slots = { ...(prev.slots ?? {}) };
            list.forEach((item, position) => {
                slots[item.slot] = { ...(slots[item.slot] ?? {}), order: position };
            });
            return { ...prev, slots };
        });
    };

    const resetOrder = (day: ComposerDay) =>
        setDoc(prev => {
            const slots = { ...(prev.slots ?? {}) };
            for (const item of [...day.slots, ...day.disabled]) {
                const rest = { ...(slots[item.slot] ?? {}) };
                delete rest.order;
                if (Object.keys(rest).length) slots[item.slot] = rest; else delete slots[item.slot];
            }
            return { ...prev, slots };
        });

    const patchDefaults = (updates: Partial<NonNullable<PlanExerciseDoc['defaults']>>) =>
        setDoc(prev => ({ ...prev, defaults: { ...(prev.defaults ?? {}), ...updates } }));

    const save = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const cleaned = {
                planId,
                exercises: prune(doc.exercises),
                slots: prune(doc.slots),
                groups: doc.groups ?? {},
                defaults: doc.defaults ?? {},
            };
            const version = await savePlanConfig(planId, cleaned, 'admin', note.trim());
            setDoc(prev => ({ ...prev, ...cleaned, version }));
            setBaseline(editable({ ...doc, ...cleaned } as PlanExerciseDoc));
            setNote('');
            setMessage({ kind: 'ok', text: `Published version ${version}. Live for every athlete on this plan.` });
        } catch (error) {
            const detail = (error as Error).message.replace(/\.$/, '');
            setMessage({ kind: 'error', text: `Save failed: ${detail}. Your changes are still here.` });
        } finally {
            setSaving(false);
        }
    };

    // --- derived -----------------------------------------------------------

    const visibleMovements = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return movements;
        return movements.filter(m => m.name.toLowerCase().includes(q) || m.id.includes(q));
    }, [movements, query]);

    const week = weeks[Math.min(weekIndex, Math.max(0, weeks.length - 1))];
    const weekSessions = useMemo(() => sessions.filter(s => s.week === week), [sessions, week]);

    /**
     * Reordering a session writes an explicit position for every movement in
     * it, so counting raw slot entries reported a five-movement session as
     * "5 movements customised" when nothing about any movement had changed.
     * A running order is a property of the session, and is counted as one.
     */
    const settingsCount =
        Object.values(prune(doc.exercises)).length
        + Object.values(prune(doc.slots)).filter(config => Object.keys(config).some(k => k !== 'order')).length;
    const reorderedSessions = sessions.filter(
        day => day.slots.some(item => doc.slots?.[item.slot]?.order !== undefined)
    ).length;
    const unmappedCount = movements.filter(m => m.unmapped).length;
    const planName = PLAN_REGISTRY[planId]?.program.name ?? planId;

    /** One session row: order controls, a summary, and the full editor when open. */
    const renderSlot = (day: ComposerDay, item: ComposerSlot, position: number, total: number) => {
        const perSlot = slotScoped[item.slot] ?? false;
        const config = perSlot ? (doc.slots?.[item.slot] ?? {}) : (doc.exercises?.[item.exerciseId] ?? {});
        // The running order lives on the slot whichever scope is being edited,
        // so a row counts as touched if either layer says anything.
        const slotConfig = doc.slots?.[item.slot] ?? {};
        const settings = Object.keys(config).filter(k => k !== 'order').length;
        const customised = settings > 0 || Object.keys(slotConfig).some(k => k !== 'order');
        const moved = slotConfig.order !== undefined && slotConfig.order !== item.index;
        const open = openSlot === item.slot;
        const resolved = item.resolved;
        const isContainer = Boolean(item.source.giantSetConfig?.steps?.length);

        return (
            <article className={customised ? 'session-row is-customised' : 'session-row'} key={item.slot}>
                <div className="session-order">
                    <button
                        type="button" aria-label={`Move ${item.name} up`} disabled={position === 0}
                        onClick={() => reorder(day, position, position - 1)}
                    ><ArrowUp className="h-3 w-3" /></button>
                    <span className="session-position">{position + 1}</span>
                    <button
                        type="button" aria-label={`Move ${item.name} down`} disabled={position === total - 1}
                        onClick={() => reorder(day, position, position + 1)}
                    ><ArrowDown className="h-3 w-3" /></button>
                </div>

                <button className="session-row-head" aria-expanded={open}
                    onClick={() => setOpenSlot(open ? null : item.slot)}>
                    {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <span className="admin-slot-name">
                        <strong>{resolved?.displayName ?? item.name}</strong>
                        <small>
                            {resolved ? `${resolved.sets} × ${resolved.target?.reps ?? '?'}` : '—'}
                            {resolved?.restSeconds ? ` · ${resolved.restSeconds}s rest` : ''}
                            {resolved?.tempo ? ` · tempo ${resolved.tempo}` : ''}
                            {resolved?.technique && resolved.technique.kind !== 'none' ? ` · ${resolved.technique.kind}` : ''}
                        </small>
                    </span>
                    {moved && <span className="admin-tag is-muted">moved</span>}
                    {isContainer
                        ? <span className="admin-tag is-muted">giant set</span>
                        : item.unmapped && <span className="admin-tag is-warning">unmapped</span>}
                    {customised && <span className="admin-tag">customised</span>}
                </button>

                {open && isContainer && (
                    <div className="admin-slot-body">
                        <p className="admin-note">
                            This slot is a giant-set container holding{' '}
                            {item.source.giantSetConfig?.steps?.length} movements, not a movement of its own.
                            Its position in the session can be changed here; its contents are defined by the plan.
                        </p>
                    </div>
                )}

                {open && !isContainer && !item.unmapped && (
                    <>
                        <div className="session-scope">
                            <span>These settings apply to</span>
                            <div className="admin-filter-row">
                                <button type="button" className={!perSlot ? 'admin-chip is-active' : 'admin-chip'}
                                    onClick={() => setSlotScoped(s => ({ ...s, [item.slot]: false }))}>
                                    every appearance of this movement
                                </button>
                                <button type="button" className={perSlot ? 'admin-chip is-active' : 'admin-chip'}
                                    onClick={() => setSlotScoped(s => ({ ...s, [item.slot]: true }))}>
                                    this session only
                                </button>
                            </div>
                            <small>
                                {perSlot
                                    ? `Slot ${item.slot}. Wins over the movement-wide settings.`
                                    : `Reaches all ${movements.find(m => m.id === item.exerciseId)?.appearances ?? 1} slots this movement occupies in ${planName}.`}
                            </small>
                        </div>
                        <MovementEditor
                            fieldId={item.slot}
                            name={item.name}
                            library={resolver.byId(item.exerciseId)}
                            config={config}
                            onPatch={updates => (perSlot ? patchSlot(item.slot, updates) : patchMovement(item.exerciseId, updates))}
                            onClear={() => (perSlot ? clearSlot(item.slot) : clearMovement(item.exerciseId))}
                            weeks={perSlot ? undefined : planWeeks}
                            planDefault={{
                                sets: item.source.sets,
                                reps: item.source.target?.reps,
                                restSeconds: item.source.prescription?.restSeconds,
                                tempo: item.source.prescription?.tempo,
                            }}
                        />
                    </>
                )}
            </article>
        );
    };

    return (
        <main className="admin-console">
            <header className="admin-command-bar">
                <div>
                    <h1><Layers /> Plan composer</h1>
                    <p>The exercises, order, prescriptions, swaps and techniques for each plan — and what each session costs.</p>
                </div>
                <div className="admin-live">
                    <span /> {movements.length} movements · {settingsCount} customised
                    {reorderedSessions > 0 && ` · ${reorderedSessions} reordered`}
                </div>
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
                        <h2>{planName}</h2>
                        <p>Showing what the plan's own generator produces, resolved through your unpublished edits.</p>
                    </div>
                    <select
                        className="admin-select is-wide" aria-label="Plan"
                        value={planId} onChange={e => setPlanId(e.target.value)}
                    >
                        {ORDERED_PLAN_META.map(meta => (
                            <option key={meta.id} value={meta.id}>{PLAN_REGISTRY[meta.id]?.program.name ?? meta.id}</option>
                        ))}
                    </select>
                </div>

                <div className="admin-viewswitch" role="tablist" aria-label="Composer view">
                    <button role="tab" aria-selected={view === 'sessions'}
                        className={view === 'sessions' ? 'admin-chip is-active' : 'admin-chip'}
                        onClick={() => setView('sessions')}><ListOrdered className="h-3 w-3" /> Sessions</button>
                    <button role="tab" aria-selected={view === 'movements'}
                        className={view === 'movements' ? 'admin-chip is-active' : 'admin-chip'}
                        onClick={() => setView('movements')}><Sliders className="h-3 w-3" /> Movements</button>
                    <button role="tab" aria-selected={view === 'defaults'}
                        className={view === 'defaults' ? 'admin-chip is-active' : 'admin-chip'}
                        onClick={() => setView('defaults')}><Settings2 className="h-3 w-3" /> Plan defaults</button>
                </div>

                {unmappedCount > 0 && (
                    <p className="admin-warning">
                        <AlertCircle className="h-4 w-4" />
                        {unmappedCount} movement{unmappedCount === 1 ? '' : 's'} in this plan have no library entry and cannot be customised yet.
                    </p>
                )}
            </section>

            {loading ? (
                <div className="admin-ledger"><div className="admin-empty"><Layers /><h3>Loading plan…</h3></div></div>
            ) : view === 'sessions' ? (
                !stableSlots ? (
                    <div className="admin-ledger">
                        <div className="admin-empty">
                            <ListOrdered />
                            <h3>This plan builds its sessions at runtime</h3>
                            <p>
                                {planName} returns whichever session is next for the athlete rather than the one
                                the calendar asks for, so no fixed position in a week names the same movement
                                twice. Reordering and per-session settings have nothing stable to attach to.
                                Edit it under <strong>Movements</strong>, where a change reaches the movement
                                wherever the generator puts it.
                            </p>
                            <Button variant="outline" size="sm" onClick={() => setView('movements')}>Go to movements</Button>
                        </div>
                    </div>
                ) : !weekSessions.length ? (
                    <div className="admin-ledger"><div className="admin-empty"><ListOrdered /><h3>No sessions materialised</h3></div></div>
                ) : (
                    <>
                        <section className="admin-ledger">
                            <div className="admin-ledger-tools">
                                <div>
                                    <h2>Week {week}</h2>
                                    <p>Drag order, prescription and coaching for each session. Figures update as you edit.</p>
                                </div>
                                <div className="admin-filter-row">
                                    {weeks.map((w, i) => (
                                        <button key={w} className={i === weekIndex ? 'admin-chip is-active' : 'admin-chip'}
                                            onClick={() => { setWeekIndex(i); setOpenSlot(null); }}>{w}</button>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {weekSessions.map(day => (
                            <section className="admin-ledger session-card" key={day.key}>
                                <div className="session-head">
                                    <div>
                                        <h2>{resolveTemplate(day.dayName, t)}</h2>
                                        <p>Day {day.dayOfWeek} · week {day.week}</p>
                                    </div>
                                    <div className="session-head-actions">
                                        <Button variant="ghost" size="sm" onClick={() => resetOrder(day)}
                                            disabled={!day.slots.some(s => doc.slots?.[s.slot]?.order !== undefined)}>
                                            <RotateCcw className="mr-2 h-3 w-3" />Reset order
                                        </Button>
                                        <Button variant="outline" size="sm"
                                            onClick={() => setOpenStats(openStats === day.key ? null : day.key)}>
                                            {openStats === day.key ? 'Hide breakdown' : 'Breakdown'}
                                        </Button>
                                    </div>
                                </div>

                                <SessionStatsStrip stats={day.stats} />
                                {openStats === day.key && <SessionStatsDetail stats={day.stats} />}

                                <div className="session-rows">
                                    {day.slots.map((item, position) => renderSlot(day, item, position, day.slots.length))}
                                </div>

                                {day.disabled.length > 0 && (
                                    <div className="session-disabled">
                                        <h4><EyeOff className="h-3 w-3" /> Removed from this session</h4>
                                        {day.disabled.map(item => (
                                            <div className="session-disabled-row" key={item.slot}>
                                                <span>{item.name}</span>
                                                <Button variant="ghost" size="sm"
                                                    onClick={() => {
                                                        // The movement may have been switched off at either
                                                        // layer; clearing both is what "restore" means.
                                                        if (doc.slots?.[item.slot]?.enabled === false) patchSlot(item.slot, { enabled: undefined });
                                                        if (doc.exercises?.[item.exerciseId]?.enabled === false) patchMovement(item.exerciseId, { enabled: undefined });
                                                    }}>
                                                    Restore
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        ))}
                    </>
                )
            ) : view === 'movements' ? (
                <section className="admin-ledger">
                    <div className="admin-ledger-tools">
                        <div>
                            <h2>Movements</h2>
                            <p>An edit applies everywhere the movement appears in this plan.</p>
                        </div>
                        <div className="admin-search">
                            <Search className="h-4 w-4" />
                            <Input value={query} onChange={e => setQuery(e.target.value)}
                                placeholder="Search movements" aria-label="Search movements" />
                        </div>
                    </div>

                    {!visibleMovements.length ? (
                        <div className="admin-empty"><Search /><h3>No movements match</h3></div>
                    ) : (
                        visibleMovements.map(movement => {
                            const config = doc.exercises?.[movement.id] ?? {};
                            const customised = Object.keys(config).length > 0;
                            const isOpen = openMovement === movement.id;

                            return (
                                <article className={customised ? 'admin-slot-row is-customised' : 'admin-slot-row'} key={movement.id}>
                                    <button className="admin-slot-head" aria-expanded={isOpen}
                                        onClick={() => setOpenMovement(isOpen ? null : movement.id)}>
                                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        <span className="admin-slot-name">
                                            <strong>{movement.name}</strong>
                                            <small>
                                                weeks {movement.weeks.length > 6
                                                    ? `${movement.weeks[0]}–${movement.weeks[movement.weeks.length - 1]}`
                                                    : movement.weeks.join(', ')}
                                                {' · '}{movement.prescriptions.slice(0, 3).join(', ')}
                                            </small>
                                        </span>
                                        {config.enabled === false && <span className="admin-tag is-warning">removed</span>}
                                        {movement.unmapped && <span className="admin-tag is-warning">unmapped</span>}
                                        {customised && <span className="admin-tag">customised</span>}
                                    </button>

                                    {isOpen && !movement.unmapped && (
                                        <MovementEditor
                                            fieldId={movement.id}
                                            name={movement.name}
                                            library={resolver.byId(movement.id)}
                                            config={config}
                                            onPatch={updates => patchMovement(movement.id, updates)}
                                            onClear={() => clearMovement(movement.id)}
                                            weeks={planWeeks}
                                        />
                                    )}
                                </article>
                            );
                        })
                    )}
                </section>
            ) : (
                <section className="admin-sector">
                    <div className="admin-sector-heading">
                        <div>
                            <h2>Plan defaults</h2>
                            <p>The fallback for every movement in {planName} that does not set its own.</p>
                        </div>
                    </div>
                    <div className="admin-field-grid">
                        <div>
                            <Label htmlFor="default-rest">Rest (seconds)</Label>
                            <Input
                                id="default-rest" type="number" min={0} max={900} step={15}
                                value={doc.defaults?.restSeconds ?? ''}
                                onChange={e => patchDefaults({ restSeconds: e.target.value ? Number(e.target.value) : undefined })}
                            />
                            <small>Used only where neither the movement nor the plan's own prescription says.</small>
                        </div>
                        <div>
                            <Label htmlFor="default-swap">Athlete may swap</Label>
                            <select
                                id="default-swap" className="admin-select is-wide"
                                value={doc.defaults?.swap?.policy ?? 'locked'}
                                onChange={e => patchDefaults({ swap: { ...(doc.defaults?.swap ?? {}), policy: e.target.value as SwapPolicy } })}
                            >
                                {SWAP_POLICIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                            <small>{SWAP_POLICIES.find(p => p.value === (doc.defaults?.swap?.policy ?? 'locked'))?.help}</small>
                        </div>
                        <div>
                            <Label>Extra sets</Label>
                            <label className="admin-inline-check">
                                <input
                                    type="checkbox"
                                    checked={doc.defaults?.userExtraSets?.allowed ?? false}
                                    onChange={e => patchDefaults({
                                        userExtraSets: { allowed: e.target.checked, max: doc.defaults?.userExtraSets?.max ?? 2 },
                                    })}
                                />
                                <span>Athlete may add up to</span>
                                <Input
                                    type="number" min={1} max={5} className="admin-mini-input"
                                    aria-label="Maximum extra sets by default"
                                    value={doc.defaults?.userExtraSets?.max ?? 2}
                                    disabled={!doc.defaults?.userExtraSets?.allowed}
                                    onChange={e => patchDefaults({ userExtraSets: { allowed: true, max: Number(e.target.value) || 1 } })}
                                />
                            </label>
                        </div>
                    </div>
                </section>
            )}

            {dirty && (
                <div className="admin-savebar" role="region" aria-label="Unsaved plan changes">
                    <span>
                        <strong>{settingsCount}</strong> movement{settingsCount === 1 ? '' : 's'} customised
                        {reorderedSessions > 0 && <> · <strong>{reorderedSessions}</strong> session{reorderedSessions === 1 ? '' : 's'} reordered</>}
                        {' · unpublished'}
                    </span>
                    <Input
                        className="admin-note-field"
                        placeholder="What changed, and why (shown in the changelog)"
                        aria-label="Publish note"
                        maxLength={280}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                    <div>
                        <Button variant="ghost" onClick={() => void load(planId)} disabled={saving}>Discard</Button>
                        <Button onClick={save} disabled={saving}>
                            <Save className="mr-2 h-4 w-4" />{saving ? 'Publishing…' : 'Publish to athletes'}
                        </Button>
                    </div>
                </div>
            )}
        </main>
    );
};
