import React, { useMemo, useState } from 'react';
import { AlertCircle, Activity, CheckCircle2 } from 'lucide-react';

import { PLAN_REGISTRY } from '../../data/plans';
import { ORDERED_PLAN_META } from '../../data/planMeta';
import { EXERCISE_LIBRARY } from '../../data/exercises/library';
import { createResolver } from '../../data/exercises';
import { analyseWeek, summarise, PLAN_RULES } from '../../lib/volumeAnalysis';
import type { WeekAnalysis } from '../../lib/volumeAnalysis';
import { buildPreviewUser } from './previewUser';
import type { WorkoutDay } from '../../types';

const resolver = createResolver(EXERCISE_LIBRARY);

/**
 * Some generators ignore the day handed to them and return whichever session is
 * next for the athlete (Super Mutant, Trinary, Skeleton). Analysing those per
 * calendar day multiplies one session by seven and collapses every exposure
 * onto a single weekday, which reads as "chest trained once a week with 42
 * sets" — a measurement artifact, not a plan defect.
 */
const generatesPerVisit = (planId: string): boolean => {
    const config = PLAN_REGISTRY[planId];
    const week = config?.program.weeks[0];
    if (!week) return false;
    const user = buildPreviewUser(planId);
    const signatures = week.days
        .map(day => {
            try {
                const generated = config.hooks?.preprocessDay?.(day, user) ?? day;
                return (generated.exercises ?? []).map(e => e.name).join('|');
            } catch {
                return '';
            }
        })
        .filter(Boolean);
    return signatures.length > 1 && new Set(signatures).size === 1;
};

const analysePlan = (planId: string): WeekAnalysis[] => {
    const config = PLAN_REGISTRY[planId];
    const rules = PLAN_RULES[planId];
    if (!config || !rules || generatesPerVisit(planId)) return [];

    const user = buildPreviewUser(planId);
    return config.program.weeks
        .map(week => {
            const days: WorkoutDay[] = week.days.map(day => {
                try {
                    return config.hooks?.preprocessDay?.(day, user) ?? day;
                } catch {
                    return day;
                }
            });
            return analyseWeek(days, week.weekNumber, resolver, rules);
        })
        // A week with no work at all is a rest or deload week, not a breach.
        .filter(w => w.totalSets > 0);
};

export const AnalysisTab: React.FC = () => {
    const [planId, setPlanId] = useState(ORDERED_PLAN_META[0].id);
    const [weekIndex, setWeekIndex] = useState(0);

    const rules = PLAN_RULES[planId];
    const weeks = useMemo(() => analysePlan(planId), [planId]);
    const report = useMemo(() => summarise(weeks), [weeks]);
    const perVisit = useMemo(() => generatesPerVisit(planId), [planId]);

    const week = weeks[Math.min(weekIndex, Math.max(0, weeks.length - 1))];
    const worked = week ? week.volumes.filter(v => v.directSets > 0).sort((a, b) => b.directSets - a.directSets) : [];
    const peak = worked[0]?.directSets ?? 1;

    return (
        <main className="admin-console">
            <header className="admin-command-bar">
                <div>
                    <h1><Activity /> Volume analysis</h1>
                    <p>Weekly sets and exposures per muscle group, checked against the programming rules.</p>
                </div>
                {week && <div className="admin-live"><span /> {week.totalSets} direct sets · week {week.week}</div>}
            </header>

            <section className="admin-sector">
                <div className="admin-sector-heading">
                    <div>
                        <h2>Plan</h2>
                        <p>
                            {rules
                                ? `${rules.kind}${rules.specialisation ? ` · specialises ${rules.specialisation.join(', ')}` : ''}`
                                : 'No rules declared for this plan.'}
                        </p>
                    </div>
                </div>
                <div className="admin-filter-row">
                    {ORDERED_PLAN_META.map(meta => (
                        <button
                            key={meta.id}
                            className={planId === meta.id ? 'admin-chip is-active' : 'admin-chip'}
                            onClick={() => { setPlanId(meta.id); setWeekIndex(0); }}
                        >
                            {PLAN_REGISTRY[meta.id]?.program.name ?? meta.id}
                        </button>
                    ))}
                </div>
            </section>

            {perVisit ? (
                <section className="admin-sector">
                    <p className="admin-warning">
                        <AlertCircle className="h-4 w-4" />
                        This plan generates one session per visit, so weekly volume depends on training
                        history rather than the calendar. Analysing it per weekday would report figures
                        that are an artifact of the preview rather than the programme.
                    </p>
                </section>
            ) : !weeks.length ? (
                <div className="admin-empty"><Activity /><h3>No materialised training weeks</h3></div>
            ) : (
                <>
                    <section className={report.clean ? 'admin-sector' : 'admin-sector is-flagged'}>
                        <div className="admin-sector-heading">
                            <div>
                                <h2>{report.clean ? 'No rule breaches' : `${report.distinctIssues.length} rule breach${report.distinctIssues.length === 1 ? '' : 'es'}`}</h2>
                                <p>
                                    {report.clean
                                        ? 'Every muscle group meets its weekly exposure minimum.'
                                        : 'A group trained on too few days a week, or a specialisation not specialising.'}
                                </p>
                            </div>
                            {report.clean
                                ? <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                : <AlertCircle className="h-6 w-6" />}
                        </div>

                        {report.distinctIssues.map(issue => (
                            <p className="admin-warning" key={`${issue.group}-${issue.message}`}>
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>
                                    <strong>{issue.group}</strong> — {issue.message}{' '}
                                    <em>
                                        ({issue.weeks.length > 3
                                            ? `weeks ${issue.weeks[0]}–${issue.weeks[issue.weeks.length - 1]}`
                                            : `week${issue.weeks.length > 1 ? 's' : ''} ${issue.weeks.join(', ')}`})
                                    </em>
                                </span>
                            </p>
                        ))}

                        {!report.clean && report.warnings.length > 0 && <hr className="admin-rule" />}

                        {[...new Set(report.warnings.map(w => `${w.group}|${w.message}`))].slice(0, 4).map(key => {
                            const [group, message] = key.split('|');
                            return (
                                <p className="admin-note" key={key}>
                                    <strong>{group}</strong> — {message}
                                </p>
                            );
                        })}
                    </section>

                    <section className="admin-ledger">
                        <div className="admin-ledger-tools">
                            <div>
                                <h2>Week {week?.week}</h2>
                                <p>Direct sets, and the number of separate days each group is trained.</p>
                            </div>
                            <div className="admin-filter-row">
                                {weeks.map((w, i) => (
                                    <button
                                        key={w.week}
                                        className={i === weekIndex ? 'admin-chip is-active' : 'admin-chip'}
                                        onClick={() => setWeekIndex(i)}
                                    >
                                        {w.week}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="volume-chart">
                            {worked.map(volume => {
                                const specialised = rules?.specialisation?.includes(volume.group);
                                const target = specialised ? (rules?.specialisationExposures ?? 3) : (rules?.minWeeklyExposures ?? 2);
                                const short = volume.exposures < target;
                                return (
                                    <div className="volume-row" key={volume.group}>
                                        <span className="volume-label">
                                            {volume.group}
                                            {specialised && <span className="admin-tag">focus</span>}
                                        </span>
                                        <span className="volume-bar-track">
                                            <span
                                                className={specialised ? 'volume-bar is-focus' : 'volume-bar'}
                                                style={{ width: `${Math.max(4, (volume.directSets / peak) * 100)}%` }}
                                            />
                                        </span>
                                        <span className="volume-figure">{volume.directSets} sets</span>
                                        <span className={short ? 'volume-exposure is-short' : 'volume-exposure'}>
                                            {volume.exposures}× / week
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </>
            )}
        </main>
    );
};
