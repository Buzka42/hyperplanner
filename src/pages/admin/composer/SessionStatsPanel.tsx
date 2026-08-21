import React from 'react';
import { Clock, Dumbbell, Layers3, Repeat, Weight } from 'lucide-react';

import { formatDuration, formatTonnage, type SessionStats } from '../../../lib/sessionStats';

/**
 * The numbers for one session.
 *
 * Shown against the session being edited rather than on a separate screen: a
 * set added in one place and its cost read in another is how sessions quietly
 * grow to ninety minutes. Every figure updates from the pending edits, before
 * anything is published.
 */

const Figure: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    hint?: string;
}> = ({ icon: Icon, label, value, hint }) => (
    <div className="session-figure" title={hint}>
        <Icon className="h-4 w-4" />
        <span className="session-figure-value">{value}</span>
        <span className="session-figure-label">{label}</span>
    </div>
);

/** The compact strip that sits in a session header. */
export const SessionStatsStrip: React.FC<{ stats: SessionStats }> = ({ stats }) => (
    <div className="session-figures">
        <Figure icon={Layers3} label="movements" value={String(stats.movements)} />
        <Figure icon={Dumbbell} label="working sets" value={String(stats.workingSets)} />
        <Figure
            icon={Repeat}
            label="reps"
            value={stats.estimatedReps ? `≈${Math.round(stats.estimatedReps)}` : '—'}
            hint="Rep ranges counted at their midpoint; AMRAP and failure sets at ten."
        />
        <Figure
            icon={Clock}
            label="duration"
            value={formatDuration(stats.estimatedSeconds)}
            hint={`Includes ${formatDuration(stats.restSeconds)} of prescribed rest.`}
        />
        {stats.tonnageCoverage > 0 && (
            <Figure
                icon={Weight}
                label={stats.tonnageCoverage === stats.movements ? 'tonnage' : `tonnage (${stats.tonnageCoverage}/${stats.movements})`}
                value={formatTonnage(stats.tonnageKg)}
                hint="Summed over the movements whose load is determinable from the prescription — percentage-based and fixed-weight slots. Movements loaded from the athlete's own history are excluded."
            />
        )}
    </div>
);

/** The expanded breakdown: where the work lands, and what shapes it. */
export const SessionStatsDetail: React.FC<{ stats: SessionStats }> = ({ stats }) => {
    const peak = Math.max(1, ...stats.muscles.map(m => m.totalSets));

    return (
        <div className="session-detail">
            <div className="session-detail-block">
                <h4>Where the work lands</h4>
                {!stats.muscles.length ? (
                    <p className="admin-note">No movement in this session maps to the library yet.</p>
                ) : (
                    <div className="volume-chart">
                        {stats.muscles.map(muscle => (
                            <div className="volume-row" key={muscle.group}>
                                <span className="volume-label">{muscle.group}</span>
                                <span className="volume-bar-track">
                                    <span className="volume-bar" style={{ width: `${(muscle.directSets / peak) * 100}%` }} />
                                    {muscle.totalSets > muscle.directSets && (
                                        <span
                                            className="volume-bar is-secondary"
                                            style={{
                                                left: `${(muscle.directSets / peak) * 100}%`,
                                                width: `${((muscle.totalSets - muscle.directSets) / peak) * 100}%`,
                                            }}
                                        />
                                    )}
                                </span>
                                <span className="volume-figure">
                                    {muscle.directSets} direct
                                    {muscle.totalSets > muscle.directSets && (
                                        <small> +{(muscle.totalSets - muscle.directSets).toFixed(1)} indirect</small>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                <p className="admin-note">
                    A secondary muscle earns a third of a set, matching how the weekly volume analysis counts.
                </p>
            </div>

            <div className="session-detail-block">
                <h4>Cost per movement</h4>
                <table className="session-table">
                    <thead>
                        <tr>
                            <th>Movement</th><th>Sets</th><th>Reps</th><th>Rest</th><th>Time</th><th>Load</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.perMovement.map(movement => (
                            <tr key={`${movement.exerciseId}-${movement.name}`}>
                                <td>
                                    {movement.name}
                                    {movement.technique && <span className="admin-tag is-muted">{movement.technique}</span>}
                                </td>
                                <td>{movement.sets}</td>
                                <td>{movement.reps}</td>
                                <td>{movement.restSeconds}s</td>
                                <td>{formatDuration(movement.estimatedSeconds)}</td>
                                <td>{movement.tonnageKg !== undefined ? formatTonnage(movement.tonnageKg) : '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {stats.timedSeconds > 0 && (
                    <p className="admin-note">Plus {formatDuration(stats.timedSeconds)} of held time in timed work.</p>
                )}
                {stats.techniques.length > 0 && (
                    <p className="admin-note">Intensity techniques in this session: {stats.techniques.join(', ')}.</p>
                )}
            </div>
        </div>
    );
};
