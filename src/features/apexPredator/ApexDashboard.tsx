import { APEX_PREDATOR_CONFIG } from '../../data/plans/apexPredator';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/useTranslation';
import { useUser } from '../../contexts/UserContext';
import { APEX_INSTRUCTIONS } from './instructions';
import type { ApexRegion, UserProfile } from '../../types';
import { APEX_REGIONS } from '../../data/apexAccess';
import { clampProgramWeek } from '../planLifecycle';
import { selectApexEmphasis, validRegionScore, type ApexAssessment, type ApexPain, type ApexRegionResult } from './assessment';

const COPY: Record<ApexRegion, { en: string; pl: string; unit: string }> = {
    ankle: { en: 'Ankle dorsiflexion', pl: 'Zgięcie grzbietowe stawu skokowego', unit: 'cm' },
    hipFlexion: { en: 'Active straight-leg raise', pl: 'Aktywne uniesienie prostej nogi', unit: '°' },
    hipRotation: { en: 'Hip rotation', pl: 'Rotacja biodra', unit: '°' },
    shoulderFlexion: { en: 'Shoulder flexion', pl: 'Zgięcie barku', unit: '°' },
    shoulderRotation: { en: 'Shoulder rotation', pl: 'Rotacja barku', unit: '°' },
    thoracicRotation: { en: 'Thoracic rotation', pl: 'Rotacja piersiowa', unit: '°' },
};

const checkpointFor = (week: number): 0 | 4 | 8 | 12 => week >= 12 ? 12 : week >= 8 ? 8 : week >= 4 ? 4 : 0;

/** Taken from the plan so the dashboard cannot disagree with the program. */
const APEX_SESSIONS = APEX_PREDATOR_CONFIG.program.weeks[0].days
    .filter(day => day.exercises?.length)
    .map(day => ({ day: day.dayOfWeek, label: day.dayName.split(' · ')[0] }));

export const ApexDashboard = ({ user }: { user: UserProfile }) => {
    const { updateUserProfile } = useUser();
    const { language } = useLanguage();
    const navigate = useNavigate();
    const pl = language === 'pl';
    const start = user.programProgress?.['apex-predator']?.startDate ?? user.startDate;
    const week = clampProgramWeek({ startDate: start, completedSessions: user.programProgress?.['apex-predator']?.completedSessions, sessionsPerWeek: 3, maxWeeks: 12 });
    const checkpoint = checkpointFor(week);
    const assessments = user.apexPredatorStatus?.assessments ?? [];
    const current = [...assessments].reverse().find(item => item.week === checkpoint);
    const due = !current;
    const [editing, setEditing] = useState(due);
    const [regions, setRegions] = useState<Partial<Record<ApexRegion, ApexRegionResult>>>(current?.regions ?? {});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const emphasis = user.apexPredatorStatus?.emphasis?.regions ?? ['ankle', 'thoracicRotation'];
    const validCount = useMemo(() => APEX_REGIONS.filter(region => validRegionScore(regions[region], region) !== null).length, [regions]);

    const patchRegion = (region: ApexRegion, patch: Partial<ApexRegionResult>) => setRegions(old => ({ ...old, [region]: { pain: 'none', ...old[region], ...patch } }));
    const save = async () => {
        setSaving(true); setError('');
        // The descriptive screen and the AI video advice are gone: the
        // assessment is a set of measurements and nothing else. The fields stay
        // optional on the type so previously saved checkpoints still read.
        const assessment: ApexAssessment = { week: checkpoint, date: new Date().toISOString(), regions };
        const nextEmphasis = selectApexEmphasis(assessment, emphasis);
        const nextAssessments = [...assessments.filter(item => item.week !== checkpoint), assessment];
        try {
            await updateUserProfile({ apexPredatorStatus: { ...(user.apexPredatorStatus ?? {}), assessments: nextAssessments, emphasis: { regions: nextEmphasis, sinceWeek: checkpoint } } });
            setEditing(false);
        } catch (err) {
            console.error('[apex] assessment save failed', err);
            setError(pl ? 'Nie udało się zapisać oceny.' : 'The assessment could not be saved.');
        }
        finally { setSaving(false); }
    };

    if (editing) return <main className="instrument-page max-w-4xl space-y-7">
        <header><p className="dashboard-command-label">APEX PROFILE · {pl ? `PUNKT ${checkpoint}` : `CHECKPOINT ${checkpoint}`}</p><h1 className="text-4xl font-semibold">{pl ? 'Ocena dostępu do ruchu' : 'Movement access assessment'}</h1><p className="text-muted-foreground mt-2">{pl ? 'Podaj pomiar albo ocenę 1–3. Każdy test możesz pominąć.' : 'Enter an exact measurement or a 1–3 fallback. Every test is optional.'}</p></header>
        <div className="border-t border-border">{APEX_REGIONS.map(region => {
            const value = regions[region] ?? { pain: 'none' as ApexPain };
            return <section key={region} className="border-b border-border py-5 space-y-3">
                <div className="flex justify-between gap-4"><h2 className="text-xl font-semibold">{COPY[region][pl ? 'pl' : 'en']}</h2><button className="min-h-11 px-3 text-muted-foreground" onClick={() => patchRegion(region, { skipped: !value.skipped })}>{value.skipped ? (pl ? 'Przywróć' : 'Restore') : (pl ? 'Pomiń' : 'Skip')}</button></div>
                {/* Six unexplained number fields collect six meaningless
                    numbers. What the test measures, how it scores, and what the
                    position looks like all belong on the screen taking it. */}
                {!value.skipped && <>
                    <p className="text-sm text-muted-foreground">{APEX_INSTRUCTIONS[region].measures[pl ? 'pl' : 'en']}</p>
                    <p className="text-sm text-muted-foreground">{APEX_INSTRUCTIONS[region].needs[pl ? 'pl' : 'en']}</p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{APEX_INSTRUCTIONS[region].scoring[pl ? 'pl' : 'en']}</p>
                    <ol className="apex-steps">
                        {APEX_INSTRUCTIONS[region].steps.map((step, index) => (
                            <li key={index} className="apex-step">
                                <span className="apex-step-index">{index + 1}</span>
                                <div className="apex-step-body">
                                    <p>{step[pl ? 'pl' : 'en']}</p>
                                    {step.watch && <p className="apex-step-watch">{step.watch[pl ? 'pl' : 'en']}</p>}
                                    {step.image && <img src={`/apex/${step.image}.jpg`} alt="" loading="lazy" className="apex-step-image" />}
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div className="grid sm:grid-cols-3 gap-4">
                    {(['left', 'right'] as const).map(side => <label key={side} className="text-xs uppercase tracking-widest text-muted-foreground">{side === 'left' ? (pl ? 'Lewa' : 'Left') : (pl ? 'Prawa' : 'Right')} ({COPY[region].unit})<input type="number" value={value[side] ?? ''} onChange={e => patchRegion(region, { [side]: e.target.value === '' ? null : Number(e.target.value), skipped: false })} className="block w-full min-h-11 bg-transparent border-b border-input text-base text-foreground" /></label>)}
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">{pl ? 'Ocena zastępcza' : 'Fallback score'}<select value={value.score ?? ''} onChange={e => patchRegion(region, { score: e.target.value ? Number(e.target.value) as 1 | 2 | 3 : null })} className="block w-full min-h-11 bg-transparent border-b border-input text-base text-foreground"><option value="">—</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></label>
                </div><label className="block text-xs uppercase tracking-widest text-muted-foreground">{pl ? 'Odczucie' : 'Sensation'}<select value={value.pain} onChange={e => patchRegion(region, { pain: e.target.value as ApexPain })} className="block w-full min-h-11 bg-transparent border-b border-input text-base text-foreground"><option value="none">{pl ? 'Bez bólu' : 'No pain'}</option><option value="discomfort">{pl ? 'Dyskomfort' : 'Discomfort'}</option><option value="pain">{pl ? 'Ból — wynik nieważny' : 'Pain — invalidate result'}</option></select></label></>}
            </section>;
        })}</div>
        <p className="text-sm text-muted-foreground">{validCount < 3 ? (pl ? 'Mniej niż 3 ważne obszary: użyjemy domyślnie stawu skokowego i rotacji piersiowej.' : 'Fewer than 3 valid regions: ankle and thoracic rotation will be used by default.') : (pl ? `${validCount} ważnych obszarów.` : `${validCount} valid regions.`)}</p>
        {error && <p role="alert" className="text-destructive">{error}</p>}<Button size="lg" className="w-full min-h-14" disabled={saving} onClick={save}>{saving ? (pl ? 'Zapisywanie…' : 'Saving…') : (pl ? 'Zapisz ocenę' : 'Save assessment')}</Button>
    </main>;

    return <main className="instrument-page space-y-8"><section className="dashboard-command"><p className="dashboard-command-label">APEX PROFILE · {pl ? `TYDZIEŃ ${week}` : `WEEK ${week}`}</p><h1>{emphasis.map(region => COPY[region][pl ? 'pl' : 'en']).join(' + ')}</h1><p className="text-muted-foreground">{pl ? 'Dwa obszary dostępu na ten blok. Ocena nie jest diagnozą.' : 'Two access regions for this block. The assessment is not a diagnosis.'}</p><Button size="lg" className="dashboard-start" onClick={() => navigate(`/app/workout/${week}/${APEX_SESSIONS[0].day}`)}>{pl ? 'Rozpocznij sesję A' : 'Start session A'}</Button></section>
        {/* The dashboard only ever offered session A, hardcoded to day 1, so
            finishing it left nowhere to go but back to the same session. */}
        <section><h2 className="text-xl font-semibold">{pl ? 'Sesje' : 'Sessions'}</h2><div className="border-t border-border mt-4">{APEX_SESSIONS.map(session => <button key={session.day} onClick={() => navigate(`/app/workout/${week}/${session.day}`)} className="block min-h-16 w-full border-b border-border px-3 text-left hover:bg-muted/40">{session.label}</button>)}</div></section><section><h2 className="text-2xl font-semibold">{pl ? 'Ostatnia ocena' : 'Latest assessment'}</h2><dl className="spec-rows mt-4">{APEX_REGIONS.map(region => <div key={region}><dt>{COPY[region][pl ? 'pl' : 'en']}</dt><dd>{validRegionScore(current?.regions[region], region) ?? '—'}</dd></div>)}</dl><Button variant="outline" className="mt-5" onClick={() => setEditing(true)}>{pl ? 'Edytuj punkt kontrolny' : 'Edit checkpoint'}</Button></section></main>;
};
