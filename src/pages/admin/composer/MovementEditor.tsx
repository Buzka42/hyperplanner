import React, { useMemo, useState } from 'react';
import { RotateCcw, Search, X } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { EXERCISE_LIBRARY } from '../../../data/exercises/library';
import type {
    IntensityTechniqueSpec,
    LibraryExercise,
    PlanExerciseConfig,
    SwapPolicy,
} from '../../../data/exercises/types';
import { defaultTechnique, SWAP_POLICIES, TECHNIQUE_KINDS, TECHNIQUE_SCOPES } from './prescriptionOptions';

/** A labelled number field that stores `undefined` rather than 0 when cleared. */
const NumberField: React.FC<{
    label: string; value: number | undefined; onChange: (n: number | undefined) => void;
    min?: number; max?: number; step?: number; hint?: string; placeholder?: string;
}> = ({ label, value, onChange, min, max, step, hint, placeholder }) => (
    <div>
        <Label>{label}</Label>
        <Input
            type="number" min={min} max={max} step={step} placeholder={placeholder}
            value={value ?? ''}
            onChange={e => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        />
        {hint && <small>{hint}</small>}
    </div>
);

/**
 * Parameters for the chosen finishing technique.
 *
 * Picking a technique used to apply a fixed set of parameters with no way to
 * see or change them, so "drop set" silently meant two drops of 20% whatever
 * the movement — an instruction the owner never chose and could not correct.
 */
const TechniqueFields: React.FC<{
    technique: IntensityTechniqueSpec;
    onChange: (spec: IntensityTechniqueSpec) => void;
}> = ({ technique, onChange }) => {
    const scope = (
        <div>
            <Label>Applies to</Label>
            <select
                className="admin-select is-wide"
                value={(technique as { applyTo?: string }).applyTo ?? 'last'}
                onChange={e => onChange({ ...technique, applyTo: e.target.value } as IntensityTechniqueSpec)}
            >
                {TECHNIQUE_SCOPES.map(s => <option key={s} value={s}>{s === 'last' ? 'the last set' : s === 'all' ? 'every set' : 'the first set'}</option>)}
            </select>
        </div>
    );

    switch (technique.kind) {
        case 'drop-set':
            return (
                <div className="admin-field-grid is-tight">
                    <NumberField label="Drops" min={1} max={5} value={technique.drops}
                        onChange={n => onChange({ ...technique, drops: n ?? 1 })} />
                    <NumberField label="Load cut per drop (%)" min={5} max={100} step={5} value={technique.dropPercent}
                        onChange={n => onChange({ ...technique, dropPercent: n ?? 20 })} />
                    {scope}
                    <div>
                        <Label>To failure</Label>
                        <label className="admin-inline-check">
                            <input type="checkbox" checked={technique.toFailure ?? false}
                                onChange={e => onChange({ ...technique, toFailure: e.target.checked })} />
                            <span>Each drop is taken to failure</span>
                        </label>
                    </div>
                </div>
            );
        case 'rest-pause':
            return (
                <div className="admin-field-grid is-tight">
                    <NumberField label="Bursts" min={1} max={6} value={technique.bursts}
                        onChange={n => onChange({ ...technique, bursts: n ?? 3 })} />
                    <NumberField label="Rest between bursts (s)" min={5} max={60} step={5} value={technique.restSeconds}
                        onChange={n => onChange({ ...technique, restSeconds: n ?? 15 })} />
                    {scope}
                </div>
            );
        case 'myo-reps':
            return (
                <div className="admin-field-grid is-tight">
                    <NumberField label="Mini sets" min={1} max={10} value={technique.miniSets}
                        onChange={n => onChange({ ...technique, miniSets: n ?? 4 })} />
                    <div>
                        <Label>Reps per mini set</Label>
                        <Input value={technique.miniReps} onChange={e => onChange({ ...technique, miniReps: e.target.value })} />
                    </div>
                    <NumberField label="Rest (breaths)" min={1} max={20} value={technique.restBreaths}
                        onChange={n => onChange({ ...technique, restBreaths: n ?? 4 })} />
                </div>
            );
        case 'cluster':
            return (
                <div className="admin-field-grid is-tight">
                    <NumberField label="Clusters" min={2} max={10} value={technique.clusters}
                        onChange={n => onChange({ ...technique, clusters: n ?? 4 })} />
                    <div>
                        <Label>Reps per cluster</Label>
                        <Input value={technique.repsPerCluster} onChange={e => onChange({ ...technique, repsPerCluster: e.target.value })} />
                    </div>
                    <NumberField label="Intra-set rest (s)" min={5} max={60} step={5} value={technique.intraRestSeconds}
                        onChange={n => onChange({ ...technique, intraRestSeconds: n ?? 20 })} />
                </div>
            );
        case 'partials':
            return (
                <div className="admin-field-grid is-tight">
                    <div>
                        <Label>Extra partial reps</Label>
                        <Input value={technique.extraReps} onChange={e => onChange({ ...technique, extraReps: e.target.value })} />
                    </div>
                    <div>
                        <Label>Range</Label>
                        <select className="admin-select is-wide" value={technique.range}
                            onChange={e => onChange({ ...technique, range: e.target.value as 'top' | 'bottom' })}>
                            <option value="bottom">bottom half</option>
                            <option value="top">top half</option>
                        </select>
                    </div>
                    {scope}
                </div>
            );
        case 'tempo':
            return (
                <div className="admin-field-grid is-tight">
                    <div>
                        <Label>Tempo</Label>
                        <Input value={technique.tempo} placeholder="40X0"
                            onChange={e => onChange({ ...technique, tempo: e.target.value })} />
                        <small>Eccentric · pause · concentric · pause.</small>
                    </div>
                </div>
            );
        case 'total-reps':
            return (
                <div className="admin-field-grid is-tight">
                    <NumberField label="Target total reps" min={5} max={200} value={technique.targetReps}
                        onChange={n => onChange({ ...technique, targetReps: n ?? 40 })} />
                    <NumberField label="Set cap (optional)" min={1} max={20} value={technique.maxSets}
                        onChange={n => onChange({ ...technique, maxSets: n })}
                        hint="However many sets it takes, up to this." />
                </div>
            );
        case 'back-off':
            return (
                <div className="admin-field-grid is-tight">
                    <NumberField label="Load (% of top set)" min={40} max={95} step={5} value={technique.percent}
                        onChange={n => onChange({ ...technique, percent: n ?? 80 })} />
                    <NumberField label="Back-off sets" min={1} max={6} value={technique.sets}
                        onChange={n => onChange({ ...technique, sets: n ?? 2 })} />
                    <div>
                        <Label>Reps</Label>
                        <Input value={technique.reps} onChange={e => onChange({ ...technique, reps: e.target.value })} />
                    </div>
                </div>
            );
        case 'wave':
            return (
                <div className="admin-field-grid is-tight">
                    <div>
                        <Label>Ladder</Label>
                        <Input
                            value={technique.ladder.join(', ')}
                            placeholder="5, 4, 3"
                            onChange={e => onChange({
                                ...technique,
                                ladder: e.target.value.split(',').map(n => Number(n.trim())).filter(n => n > 0),
                            })}
                        />
                        <small>Reps per rung, descending.</small>
                    </div>
                    <NumberField label="Waves" min={1} max={5} value={technique.waves}
                        onChange={n => onChange({ ...technique, waves: n ?? 2 })} />
                </div>
            );
        default:
            return null;
    }
};

/** Pick the exact exercises an athlete may swap to. */
const SwapPoolPicker: React.FC<{
    pool: string[];
    current: LibraryExercise | undefined;
    onChange: (pool: string[]) => void;
}> = ({ pool, current, onChange }) => {
    const [query, setQuery] = useState('');

    const candidates = useMemo(() => {
        const q = query.trim().toLowerCase();
        return EXERCISE_LIBRARY
            .filter(e => e.status === 'active' && e.id !== current?.id)
            .filter(e => !q || e.name.en.toLowerCase().includes(q) || e.id.includes(q))
            // Same-pattern movements first: they are what a swap normally means.
            .sort((a, b) => {
                const aMatch = a.pattern === current?.pattern ? 0 : 1;
                const bMatch = b.pattern === current?.pattern ? 0 : 1;
                return aMatch - bMatch || a.name.en.localeCompare(b.name.en);
            })
            .slice(0, 40);
    }, [query, current]);

    return (
        <div className="admin-pool">
            <div className="admin-pool-chosen">
                {pool.length === 0
                    ? <span className="admin-note">Nothing chosen yet — the athlete has no swap options.</span>
                    : pool.map(id => {
                        const entry = EXERCISE_LIBRARY.find(e => e.id === id);
                        return (
                            <button type="button" className="admin-tag is-removable" key={id}
                                onClick={() => onChange(pool.filter(p => p !== id))}>
                                {entry?.name.en ?? id}<X className="h-3 w-3" />
                            </button>
                        );
                    })}
            </div>
            <div className="admin-search">
                <Search className="h-4 w-4" />
                <Input value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Add an exercise to the list" aria-label="Search the exercise library" />
            </div>
            {query.trim() && (
                <div className="admin-pool-results">
                    {candidates.filter(e => !pool.includes(e.id)).map(entry => (
                        <button type="button" className="admin-pool-result" key={entry.id}
                            onClick={() => { onChange([...pool, entry.id]); setQuery(''); }}>
                            <span>{entry.name.en}</span>
                            <small>{entry.pattern}{entry.pattern === current?.pattern ? ' · same pattern' : ''}</small>
                        </button>
                    ))}
                    {!candidates.filter(e => !pool.includes(e.id)).length && <p className="admin-note">Nothing matches.</p>}
                </div>
            )}
        </div>
    );
};

export type MovementEditorProps = {
    /** Unique per rendered editor, so labels bind to the right field. */
    fieldId: string;
    name: string;
    library: LibraryExercise | undefined;
    config: PlanExerciseConfig;
    onPatch: (updates: Partial<PlanExerciseConfig>) => void;
    onClear: () => void;
    /** Weeks this plan runs, for the scope picker. Omit to hide scoping. */
    weeks?: number[];
    /** What the plan itself prescribes, shown so an override is made knowingly. */
    planDefault?: { sets?: number; reps?: string; restSeconds?: number; tempo?: string };
};

/**
 * The full control surface for one movement.
 *
 * Shared by the session view and the movement view so a field behaves
 * identically wherever it is edited — the two views differ in what they
 * address, not in what they can change.
 */
export const MovementEditor: React.FC<MovementEditorProps> = ({
    fieldId, name, library, config, onPatch, onClear, weeks, planDefault,
}) => {
    const customised = Object.keys(config).length > 0;
    const setsMode = typeof config.setsOverride === 'number' ? 'absolute' : 'relative';
    const swapPolicy = config.swap?.policy ?? 'locked';

    return (
        <div className="admin-slot-body">
            <div className="admin-editor-section">
                <label className="admin-inline-check is-prominent">
                    <input
                        type="checkbox"
                        checked={config.enabled !== false}
                        onChange={e => onPatch({ enabled: e.target.checked ? undefined : false })}
                    />
                    <span>
                        <strong>Include in the plan</strong>
                        <small>Unticking removes the movement from every session it appears in.</small>
                    </span>
                </label>
            </div>

            <div className="admin-editor-section">
                <h4>Prescription</h4>
                <div className="admin-field-grid">
                    <div>
                        <Label htmlFor={`sets-${fieldId}`}>Sets</Label>
                        <div className="admin-range">
                            <select
                                className="admin-select"
                                aria-label="How the set count is set"
                                value={setsMode}
                                onChange={e => onPatch(e.target.value === 'absolute'
                                    ? { setsOverride: planDefault?.sets ?? 3, setsDelta: undefined }
                                    : { setsOverride: undefined, setsDelta: config.setsDelta })}
                            >
                                <option value="relative">adjust by</option>
                                <option value="absolute">set to</option>
                            </select>
                            {setsMode === 'absolute' ? (
                                <Input
                                    id={`sets-${fieldId}`} type="number" min={1} max={30}
                                    value={config.setsOverride ?? ''}
                                    onChange={e => onPatch({ setsOverride: e.target.value === '' ? undefined : Number(e.target.value) })}
                                />
                            ) : (
                                <Input
                                    id={`sets-${fieldId}`} type="number" min={-5} max={10}
                                    value={config.setsDelta ?? 0}
                                    onChange={e => onPatch({ setsDelta: Number(e.target.value) || undefined })}
                                />
                            )}
                        </div>
                        <small>
                            {planDefault?.sets !== undefined
                                ? `The plan prescribes ${planDefault.sets}.`
                                : 'Relative to what the plan prescribes. 0 = unchanged.'}
                        </small>
                    </div>

                    <div>
                        <Label htmlFor={`min-${fieldId}`}>Rep range</Label>
                        <div className="admin-range">
                            <Input
                                id={`min-${fieldId}`} type="number" min={1} max={100} placeholder="min"
                                value={config.repsMin ?? ''}
                                onChange={e => onPatch({ repsMin: e.target.value ? Number(e.target.value) : undefined })}
                            />
                            <span>–</span>
                            <Input
                                type="number" min={1} max={100} placeholder="max" aria-label="Maximum reps"
                                value={config.repsMax ?? ''}
                                onChange={e => onPatch({ repsMax: e.target.value ? Number(e.target.value) : undefined })}
                            />
                        </div>
                        <small>{planDefault?.reps ? `The plan prescribes ${planDefault.reps}.` : 'Leave empty to keep the plan\'s own range.'}</small>
                    </div>

                    <NumberField
                        label="Rest (seconds)" min={0} max={900} step={15}
                        value={config.restSeconds}
                        onChange={n => onPatch({ restSeconds: n })}
                        placeholder={planDefault?.restSeconds ? String(planDefault.restSeconds) : undefined}
                        hint={library?.restForced ? 'The library forces this movement\'s rest; this field will not reach the athlete.' : undefined}
                    />

                    <div>
                        <Label htmlFor={`tempo-${fieldId}`}>Tempo</Label>
                        <Input
                            id={`tempo-${fieldId}`} placeholder={planDefault?.tempo ?? 'e.g. 40X0'}
                            value={config.tempo ?? ''}
                            onChange={e => onPatch({ tempo: e.target.value || undefined })}
                        />
                        <small>
                            {library?.tempoForced
                                ? 'The library forces this movement\'s tempo; this field will not reach the athlete.'
                                : 'Eccentric · pause · concentric · pause.'}
                        </small>
                    </div>
                </div>
            </div>

            <div className="admin-editor-section">
                <h4>Movement</h4>
                <div className="admin-field-grid">
                    <div>
                        <Label htmlFor={`sub-${fieldId}`}>Replace with</Label>
                        <select
                            id={`sub-${fieldId}`} className="admin-select is-wide"
                            value={config.substituteWith ?? ''}
                            onChange={e => onPatch({ substituteWith: e.target.value || undefined })}
                        >
                            <option value="">Keep {name}</option>
                            {EXERCISE_LIBRARY
                                .filter(e => e.status === 'active' && e.pattern === library?.pattern && e.id !== library?.id)
                                .map(e => <option key={e.id} value={e.id}>{e.name.en}</option>)}
                        </select>
                        <small>Same movement pattern only. Applied before any athlete swap.</small>
                    </div>

                    <div>
                        <Label htmlFor={`swap-${fieldId}`}>Athlete may swap</Label>
                        <select
                            id={`swap-${fieldId}`} className="admin-select is-wide"
                            value={swapPolicy}
                            onChange={e => onPatch({ swap: { ...(config.swap ?? {}), policy: e.target.value as SwapPolicy } })}
                        >
                            {SWAP_POLICIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                        <small>{SWAP_POLICIES.find(p => p.value === swapPolicy)?.help}</small>
                    </div>

                    <div>
                        <Label>Extra sets</Label>
                        <label className="admin-inline-check">
                            <input
                                type="checkbox"
                                checked={config.userExtraSets?.allowed ?? false}
                                onChange={e => onPatch({
                                    userExtraSets: { allowed: e.target.checked, max: config.userExtraSets?.max ?? 2 },
                                })}
                            />
                            <span>Athlete may add up to</span>
                            <Input
                                type="number" min={1} max={5} className="admin-mini-input"
                                aria-label="Maximum extra sets"
                                value={config.userExtraSets?.max ?? 2}
                                disabled={!config.userExtraSets?.allowed}
                                onChange={e => onPatch({ userExtraSets: { allowed: true, max: Number(e.target.value) || 1 } })}
                            />
                        </label>
                        <small>Extra sets never count toward progression.</small>
                    </div>

                    <div>
                        <Label htmlFor={`tech-${fieldId}`}>Finishing technique</Label>
                        <select
                            id={`tech-${fieldId}`} className="admin-select is-wide"
                            value={config.technique?.kind ?? 'none'}
                            onChange={e => {
                                const kind = e.target.value as IntensityTechniqueSpec['kind'];
                                onPatch({ technique: kind === 'none' ? undefined : defaultTechnique(kind) });
                            }}
                        >
                            {TECHNIQUE_KINDS.map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                    </div>
                </div>

                {swapPolicy === 'pool' && (
                    <div className="admin-editor-subsection">
                        <Label>Swap list</Label>
                        <SwapPoolPicker
                            pool={config.swap?.pool ?? []}
                            current={library}
                            onChange={pool => onPatch({ swap: { policy: 'pool', ...(config.swap ?? {}), pool } })}
                        />
                    </div>
                )}

                {swapPolicy === 'group' && (
                    <div className="admin-editor-subsection">
                        <Label htmlFor={`group-${fieldId}`}>Swap group</Label>
                        <Input
                            id={`group-${fieldId}`}
                            placeholder={library?.swapGroup ?? 'this movement has no swap group'}
                            value={config.swap?.group ?? ''}
                            onChange={e => onPatch({ swap: { policy: 'group', ...(config.swap ?? {}), group: e.target.value || undefined } })}
                        />
                        <small>Leave empty to use the movement's own group{library?.swapGroup ? ` (${library.swapGroup})` : ', which it does not have — the athlete would get no options'}.</small>
                    </div>
                )}

                {config.technique && config.technique.kind !== 'none' && (
                    <div className="admin-editor-subsection">
                        <TechniqueFields
                            technique={config.technique}
                            onChange={technique => onPatch({ technique })}
                        />
                    </div>
                )}
            </div>

            <div className="admin-editor-section">
                <h4>Coaching</h4>
                <div className="admin-tip-edit">
                    <Label htmlFor={`tip-${fieldId}`}>Plan guidance for this movement</Label>
                    {/* The inherited cue is shown while authoring so plan guidance
                        is written against what the athlete will actually see. */}
                    {library?.tip?.en
                        ? <p className="admin-tip-default">Movement cue (shown second, quieter): {library.tip.en}</p>
                        : <p className="admin-tip-default">This movement has no general cue yet.</p>}
                    <Input
                        id={`tip-${fieldId}`}
                        placeholder="Shown first, in the plan accent. Leave empty for none."
                        value={config.tipOverride?.en ?? ''}
                        onChange={e => onPatch({
                            tipOverride: e.target.value
                                ? { en: e.target.value, pl: config.tipOverride?.pl ?? '' }
                                : undefined,
                        })}
                    />
                    <Input
                        aria-label="Polish plan guidance" placeholder="Polish (optional)"
                        value={config.tipOverride?.pl ?? ''}
                        onChange={e => onPatch({ tipOverride: { en: config.tipOverride?.en ?? '', pl: e.target.value } })}
                    />

                    <Label htmlFor={`tip-append-${fieldId}`}>Append to the movement cue</Label>
                    <Input
                        id={`tip-append-${fieldId}`}
                        placeholder="Extends the general cue rather than replacing it"
                        value={config.tipAppend?.en ?? ''}
                        onChange={e => onPatch({
                            tipAppend: e.target.value
                                ? { en: e.target.value, pl: config.tipAppend?.pl ?? '' }
                                : undefined,
                        })}
                    />

                    {/* Suppression is exceptional and explicit: plan guidance no
                        longer deletes the movement cue as a side effect. */}
                    <label className="admin-tip-suppress">
                        <input
                            type="checkbox"
                            checked={Boolean(config.suppressGeneralTip)}
                            onChange={e => onPatch({ suppressGeneralTip: e.target.checked || undefined })}
                        />
                        <span>Hide the movement cue for this plan — only when showing both would mislead.</span>
                    </label>
                </div>
            </div>

            {weeks && weeks.length > 1 && (
                <div className="admin-editor-section">
                    <h4>When this applies</h4>
                    <div className="admin-filter-row">
                        <button
                            type="button"
                            className={!config.scope?.weeks?.length ? 'admin-chip is-active' : 'admin-chip'}
                            onClick={() => onPatch({ scope: undefined })}
                        >
                            every week
                        </button>
                        {weeks.map(week => {
                            const active = config.scope?.weeks?.includes(week) ?? false;
                            return (
                                <button
                                    type="button" key={week}
                                    className={active ? 'admin-chip is-active' : 'admin-chip'}
                                    onClick={() => {
                                        const current = config.scope?.weeks ?? [];
                                        const next = active ? current.filter(w => w !== week) : [...current, week].sort((a, b) => a - b);
                                        onPatch({ scope: next.length ? { ...config.scope, weeks: next } : undefined });
                                    }}
                                >
                                    {week}
                                </button>
                            );
                        })}
                    </div>
                    <small>
                        {config.scope?.weeks?.length
                            ? `These settings apply in week${config.scope.weeks.length === 1 ? '' : 's'} ${config.scope.weeks.join(', ')} only.`
                            : 'These settings apply wherever the movement appears.'}
                    </small>
                </div>
            )}

            {customised && (
                <Button variant="ghost" size="sm" onClick={onClear}>
                    <RotateCcw className="mr-2 h-3 w-3" /> Reset this movement
                </Button>
            )}
        </div>
    );
};
