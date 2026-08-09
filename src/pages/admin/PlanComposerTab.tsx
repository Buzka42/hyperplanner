import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check, ChevronDown, ChevronRight, Layers, RotateCcw, Save, Search } from 'lucide-react';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { PLAN_REGISTRY } from '../../data/plans';
import { ORDERED_PLAN_META } from '../../data/planMeta';
import { EXERCISE_LIBRARY } from '../../data/exercises/library';
import { createResolver } from '../../data/exercises';
import { loadPlanConfig, savePlanConfig } from '../../data/exercises/planConfigRemote';
import { slotKey } from '../../data/exercises/types';
import type {
    IntensityTechniqueSpec,
    PlanExerciseConfig,
    PlanExerciseDoc,
    SwapPolicy,
} from '../../data/exercises/types';
import type { Exercise, UserProfile, WorkoutDay } from '../../types';
import { buildPreviewVariants } from './previewUser';

const resolver = createResolver(EXERCISE_LIBRARY);

/** Rest/mobility entries occupy an exercise slot but are not movements. */
const isPlaceholder = (name: string) =>
    /^(rest|rest\s*\/\s*mobility|rest day|mobility|active recovery)$/i.test(name.trim());

type MaterialisedExercise = {
    exercise: Exercise;
    exerciseId: string;
    index: number;
    slot: string;
    resolvedName: string;
    unmapped: boolean;
};

type MaterialisedDay = {
    week: number;
    dayOfWeek: number;
    dayName: string;
    exercises: MaterialisedExercise[];
};

const TECHNIQUE_KINDS: IntensityTechniqueSpec['kind'][] = [
    'none', 'drop-set', 'rest-pause', 'myo-reps', 'cluster', 'partials',
    'one-and-half', 'tempo', 'total-reps', 'back-off', 'wave', 'amrap-finisher',
];

const SWAP_POLICIES: { value: SwapPolicy; label: string; help: string }[] = [
    { value: 'locked', label: 'Locked', help: 'No swapping. Legacy alternates still apply.' },
    { value: 'pool', label: 'Chosen list', help: 'Only the exercises you pick below.' },
    { value: 'group', label: 'Swap group', help: 'Anything sharing this movement\'s swap group.' },
    { value: 'any', label: 'Same pattern', help: 'Anything with the same movement pattern.' },
];

/**
 * Runs each plan's real generator (including preprocessDay) against a synthetic
 * user, so the composer edits what a user actually sees rather than the static
 * literal — which for Super Mutant, Trinary and Skeleton is an empty stub.
 */
const materialisePlan = (planId: string, previewUsers: UserProfile[]): MaterialisedDay[] => {
    const config = PLAN_REGISTRY[planId];
    if (!config) return [];

    const days: MaterialisedDay[] = [];
    const seen = new Set<string>();

    for (const week of config.program.weeks) {
        for (const day of week.days) {
            // Sample every preview state and union the results, so plans whose
            // generator rotates a queue show their whole exercise pool rather
            // than whichever slice one state happens to produce.
            for (const previewUser of previewUsers) {
            let generated: WorkoutDay = day;
            try {
                generated = config.hooks?.preprocessDay?.(day, previewUser) ?? day;
            } catch {
                generated = day;   // unreachable state for this generator
            }
            if (!generated.exercises?.length) continue;

            const signature = `${week.weekNumber}:${generated.dayOfWeek}:${generated.exercises.map(e => e.name).join('|')}`;
            if (seen.has(signature)) continue;
            seen.add(signature);

            days.push({
                week: week.weekNumber,
                dayOfWeek: generated.dayOfWeek,
                dayName: generated.dayName,
                exercises: generated.exercises
                    // Giant-set containers ("Tricep Giant Set") and rest-day
                    // placeholders occupy an exercise slot without being
                    // movements; listing them as unmapped is just noise.
                    .filter(exercise => !exercise.giantSetConfig?.steps?.length && !isPlaceholder(exercise.name))
                    .map((exercise, index) => {
                        const entry = resolver.resolve(exercise.name);
                        return {
                            exercise,
                            index,
                            exerciseId: entry?.id ?? `unmapped:${exercise.name}`,
                            slot: slotKey(week.weekNumber, generated.dayOfWeek, index),
                            resolvedName: entry?.name.en ?? exercise.name,
                            unmapped: !entry,
                        };
                    }),
            });
            }
        }
    }
    return days;
};

const emptyDoc = (planId: string): PlanExerciseDoc => ({
    planId, version: 0, updatedAt: '', updatedBy: '', exercises: {}, slots: {}, groups: {}, defaults: {},
});

export const PlanComposerTab: React.FC = () => {
    const [planId, setPlanId] = useState(ORDERED_PLAN_META[0].id);
    const [doc, setDoc] = useState<PlanExerciseDoc>(() => emptyDoc(ORDERED_PLAN_META[0].id));
    const [baseline, setBaseline] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

    const [query, setQuery] = useState('');
    const [openExercise, setOpenExercise] = useState<string | null>(null);

    const previewUsers = useMemo(() => buildPreviewVariants(planId), [planId]);
    const days = useMemo(() => materialisePlan(planId, previewUsers), [planId, previewUsers]);

    /**
     * Movement-scope editing is the default because plans that synthesise days
     * at runtime have no stable slot addresses. Weeks are shown so you can see
     * where a movement appears, but an edit applies wherever it appears.
     */
    const movements = useMemo(() => {
        const map = new Map<string, { name: string; unmapped: boolean; weeks: Set<number>; prescriptions: Set<string> }>();
        for (const day of days) {
            for (const item of day.exercises) {
                const existing = map.get(item.exerciseId) ?? {
                    name: item.resolvedName, unmapped: item.unmapped, weeks: new Set<number>(), prescriptions: new Set<string>(),
                };
                existing.weeks.add(day.week);
                existing.prescriptions.add(`${item.exercise.sets}x${item.exercise.target?.reps ?? '?'}`);
                map.set(item.exerciseId, existing);
            }
        }
        return [...map.entries()]
            .map(([id, v]) => ({ id, ...v, weeks: [...v.weeks].sort((a, b) => a - b), prescriptions: [...v.prescriptions] }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [days]);

    const load = useCallback(async (id: string) => {
        setLoading(true);
        setMessage(null);
        try {
            const remote = await loadPlanConfig(id, true);
            setDoc(remote);
            setBaseline(JSON.stringify(remote.exercises ?? {}));
        } catch (error) {
            setMessage({ kind: 'error', text: `Could not load plan config: ${(error as Error).message}` });
            setDoc(emptyDoc(id));
            setBaseline('{}');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void load(planId); }, [planId, load]);

    const dirty = JSON.stringify(doc.exercises ?? {}) !== baseline;

    const patch = (exerciseId: string, updates: Partial<PlanExerciseConfig>) =>
        setDoc(prev => ({
            ...prev,
            exercises: {
                ...prev.exercises,
                [exerciseId]: { ...(prev.exercises?.[exerciseId] ?? {}), ...updates },
            },
        }));

    const clearOverride = (exerciseId: string) =>
        setDoc(prev => {
            const next = { ...prev.exercises };
            delete next[exerciseId];
            return { ...prev, exercises: next };
        });

    const save = async () => {
        setSaving(true);
        setMessage(null);
        try {
            // Drop empty override objects so the stored doc stays a real diff.
            const cleaned = Object.fromEntries(
                Object.entries(doc.exercises ?? {}).filter(([, v]) => Object.keys(v).length > 0)
            );
            const version = await savePlanConfig(
                planId,
                { planId, exercises: cleaned, slots: doc.slots ?? {}, groups: doc.groups ?? {}, defaults: doc.defaults ?? {} },
                'admin'
            );
            setDoc(prev => ({ ...prev, exercises: cleaned, version }));
            setBaseline(JSON.stringify(cleaned));
            setMessage({ kind: 'ok', text: `Published version ${version}. Live for every athlete on this plan.` });
        } catch (error) {
            const detail = (error as Error).message.replace(/\.$/, '');
            setMessage({ kind: 'error', text: `Save failed: ${detail}. Your changes are still here.` });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!dirty) return;
        const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirty]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return movements;
        return movements.filter(m => m.name.toLowerCase().includes(q) || m.id.includes(q));
    }, [movements, query]);

    const overriddenCount = Object.values(doc.exercises ?? {}).filter(v => Object.keys(v).length).length;
    const unmappedCount = movements.filter(m => m.unmapped).length;

    return (
        <main className="admin-console">
            <header className="admin-command-bar">
                <div>
                    <h1><Layers /> Plan composer</h1>
                    <p>Choose the exercises, prescriptions, swaps and finishing techniques for each plan.</p>
                </div>
                <div className="admin-live">
                    <span /> {movements.length} movements · {overriddenCount} customised
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
                        <h2>Plan</h2>
                        <p>Showing what the plan's own generator produces, so dynamic plans are covered too.</p>
                    </div>
                </div>
                <div className="admin-filter-row">
                    {ORDERED_PLAN_META.map(meta => (
                        <button
                            key={meta.id}
                            className={planId === meta.id ? 'admin-chip is-active' : 'admin-chip'}
                            onClick={() => setPlanId(meta.id)}
                        >
                            {PLAN_REGISTRY[meta.id]?.program.name ?? meta.id}
                        </button>
                    ))}
                </div>
                {unmappedCount > 0 && (
                    <p className="admin-warning">
                        <AlertCircle className="h-4 w-4" />
                        {unmappedCount} movement{unmappedCount === 1 ? '' : 's'} in this plan have no library entry and cannot be customised yet.
                    </p>
                )}
            </section>

            <section className="admin-ledger">
                <div className="admin-ledger-tools">
                    <div>
                        <h2>Movements</h2>
                        <p>An edit applies everywhere the movement appears in this plan.</p>
                    </div>
                    <div className="admin-search">
                        <Search className="h-4 w-4" />
                        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movements" aria-label="Search movements" />
                    </div>
                </div>

                {loading ? (
                    <div className="admin-empty"><Layers /><h3>Loading plan…</h3></div>
                ) : !visible.length ? (
                    <div className="admin-empty"><Search /><h3>No movements match</h3></div>
                ) : (
                    visible.map(movement => {
                        const config = doc.exercises?.[movement.id] ?? {};
                        const customised = Object.keys(config).length > 0;
                        const isOpen = openExercise === movement.id;
                        const library = resolver.byId(movement.id);

                        return (
                            <article className={customised ? 'admin-slot-row is-customised' : 'admin-slot-row'} key={movement.id}>
                                <button
                                    className="admin-slot-head"
                                    aria-expanded={isOpen}
                                    onClick={() => setOpenExercise(isOpen ? null : movement.id)}
                                >
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
                                    {movement.unmapped && <span className="admin-tag is-warning">unmapped</span>}
                                    {customised && <span className="admin-tag">customised</span>}
                                </button>

                                {isOpen && !movement.unmapped && (
                                    <div className="admin-slot-body">
                                        <div className="admin-field-grid">
                                            <div>
                                                <Label htmlFor={`sets-${movement.id}`}>Sets adjustment</Label>
                                                <Input
                                                    id={`sets-${movement.id}`}
                                                    type="number" min={-3} max={5}
                                                    value={config.setsDelta ?? 0}
                                                    onChange={e => patch(movement.id, { setsDelta: Number(e.target.value) || undefined })}
                                                />
                                                <small>Relative to what the plan prescribes. 0 = unchanged.</small>
                                            </div>
                                            <div>
                                                <Label htmlFor={`min-${movement.id}`}>Rep range</Label>
                                                <div className="admin-range">
                                                    <Input
                                                        id={`min-${movement.id}`} type="number" min={1} max={100}
                                                        placeholder="min"
                                                        value={config.repsMin ?? ''}
                                                        onChange={e => patch(movement.id, { repsMin: e.target.value ? Number(e.target.value) : undefined })}
                                                    />
                                                    <span>–</span>
                                                    <Input
                                                        type="number" min={1} max={100} placeholder="max"
                                                        aria-label="Maximum reps"
                                                        value={config.repsMax ?? ''}
                                                        onChange={e => patch(movement.id, { repsMax: e.target.value ? Number(e.target.value) : undefined })}
                                                    />
                                                </div>
                                                <small>Leave empty to keep the plan's own range.</small>
                                            </div>
                                            <div>
                                                <Label htmlFor={`rest-${movement.id}`}>Rest (seconds)</Label>
                                                <Input
                                                    id={`rest-${movement.id}`} type="number" min={0} max={900} step={15}
                                                    value={config.restSeconds ?? ''}
                                                    onChange={e => patch(movement.id, { restSeconds: e.target.value ? Number(e.target.value) : undefined })}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor={`tempo-${movement.id}`}>Tempo</Label>
                                                <Input
                                                    id={`tempo-${movement.id}`} placeholder="e.g. 40X0"
                                                    value={config.tempo ?? ''}
                                                    onChange={e => patch(movement.id, { tempo: e.target.value || undefined })}
                                                />
                                                <small>Eccentric · pause · concentric · pause.</small>
                                            </div>
                                        </div>

                                        <div className="admin-field-grid">
                                            <div>
                                                <Label htmlFor={`sub-${movement.id}`}>Replace with</Label>
                                                <select
                                                    id={`sub-${movement.id}`} className="admin-select is-wide"
                                                    value={config.substituteWith ?? ''}
                                                    onChange={e => patch(movement.id, { substituteWith: e.target.value || undefined })}
                                                >
                                                    <option value="">Keep {movement.name}</option>
                                                    {EXERCISE_LIBRARY
                                                        .filter(e => e.status === 'active' && e.pattern === library?.pattern && e.id !== movement.id)
                                                        .map(e => <option key={e.id} value={e.id}>{e.name.en}</option>)}
                                                </select>
                                                <small>Same movement pattern only.</small>
                                            </div>
                                            <div>
                                                <Label htmlFor={`swap-${movement.id}`}>Athlete may swap</Label>
                                                <select
                                                    id={`swap-${movement.id}`} className="admin-select is-wide"
                                                    value={config.swap?.policy ?? 'locked'}
                                                    onChange={e => patch(movement.id, { swap: { ...(config.swap ?? {}), policy: e.target.value as SwapPolicy } })}
                                                >
                                                    {SWAP_POLICIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                                </select>
                                                <small>{SWAP_POLICIES.find(p => p.value === (config.swap?.policy ?? 'locked'))?.help}</small>
                                            </div>
                                            <div>
                                                <Label htmlFor={`tech-${movement.id}`}>Finishing technique</Label>
                                                <select
                                                    id={`tech-${movement.id}`} className="admin-select is-wide"
                                                    value={config.technique?.kind ?? 'none'}
                                                    onChange={e => {
                                                        const kind = e.target.value as IntensityTechniqueSpec['kind'];
                                                        patch(movement.id, { technique: kind === 'none' ? undefined : defaultTechnique(kind) });
                                                    }}
                                                >
                                                    {TECHNIQUE_KINDS.map(k => <option key={k} value={k}>{k}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <Label>Extra sets</Label>
                                                <label className="admin-inline-check">
                                                    <input
                                                        type="checkbox"
                                                        checked={config.userExtraSets?.allowed ?? false}
                                                        onChange={e => patch(movement.id, {
                                                            userExtraSets: { allowed: e.target.checked, max: config.userExtraSets?.max ?? 2 },
                                                        })}
                                                    />
                                                    <span>Athlete may add up to</span>
                                                    <Input
                                                        type="number" min={1} max={5} className="admin-mini-input"
                                                        aria-label="Maximum extra sets"
                                                        value={config.userExtraSets?.max ?? 2}
                                                        disabled={!config.userExtraSets?.allowed}
                                                        onChange={e => patch(movement.id, {
                                                            userExtraSets: { allowed: true, max: Number(e.target.value) || 1 },
                                                        })}
                                                    />
                                                </label>
                                                <small>Extra sets never count toward progression.</small>
                                            </div>
                                        </div>

                                        <div className="admin-tip-edit">
                                            <Label htmlFor={`tip-${movement.id}`}>Tip for this plan</Label>
                                            {library?.tip?.en && (
                                                <p className="admin-tip-default">Library default: {library.tip.en}</p>
                                            )}
                                            <Input
                                                id={`tip-${movement.id}`}
                                                placeholder="Leave empty to use the library tip"
                                                value={config.tipOverride?.en ?? ''}
                                                onChange={e => patch(movement.id, {
                                                    tipOverride: e.target.value
                                                        ? { en: e.target.value, pl: config.tipOverride?.pl ?? '' }
                                                        : undefined,
                                                })}
                                            />
                                            <Input
                                                aria-label="Polish tip for this plan"
                                                placeholder="Polish (optional)"
                                                value={config.tipOverride?.pl ?? ''}
                                                onChange={e => patch(movement.id, {
                                                    tipOverride: { en: config.tipOverride?.en ?? '', pl: e.target.value },
                                                })}
                                            />
                                        </div>

                                        {customised && (
                                            <Button variant="ghost" size="sm" onClick={() => clearOverride(movement.id)}>
                                                <RotateCcw className="mr-2 h-3 w-3" /> Reset this movement
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </article>
                        );
                    })
                )}
            </section>

            {dirty && (
                <div className="admin-savebar" role="region" aria-label="Unsaved plan changes">
                    <span><strong>{overriddenCount}</strong> movement{overriddenCount === 1 ? '' : 's'} customised · unpublished</span>
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

/** Sensible starting parameters so a technique is usable the moment it is picked. */
function defaultTechnique(kind: IntensityTechniqueSpec['kind']): IntensityTechniqueSpec {
    switch (kind) {
        case 'drop-set': return { kind, drops: 2, dropPercent: 20, applyTo: 'last', toFailure: true };
        case 'rest-pause': return { kind, bursts: 3, restSeconds: 15, applyTo: 'last' };
        case 'myo-reps': return { kind, miniSets: 4, miniReps: '3-5', restBreaths: 4 };
        case 'cluster': return { kind, clusters: 4, repsPerCluster: '2', intraRestSeconds: 20 };
        case 'partials': return { kind, extraReps: '5', range: 'bottom', applyTo: 'last' };
        case 'tempo': return { kind, tempo: '40X0' };
        case 'total-reps': return { kind, targetReps: 40 };
        case 'back-off': return { kind, percent: 80, sets: 2, reps: '6' };
        case 'wave': return { kind, ladder: [5, 4, 3], waves: 2 };
        default: return { kind: kind as 'none' };
    }
}
