import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/useTranslation';
import type { UserProfile } from '../../types';
import { clampProgramWeek } from '../planLifecycle';
import { effectiveAthenaMode } from '../../data/plans/athena';
import { epley } from '../workout/progression/types';


export const AthenaDashboard = ({ user }: { user: UserProfile }) => {
    const { language } = useLanguage(); const navigate = useNavigate(); const pl = language === 'pl';
    const start = user.programProgress?.athena?.startDate ?? user.startDate;
    const mode = effectiveAthenaMode(user);
    const week = clampProgramWeek({ startDate: start, completedSessions: user.programProgress?.athena?.completedSessions, sessionsPerWeek: mode === '3day' ? 3 : 4, maxWeeks: 12 });
    const prefs = user.planPreferences?.athena;
    // Read-only here: the choice is made at onboarding and changed in settings.
    const choices: Record<string, string> = { squat: 'barbell-squat', hinge: 'romanian-deadlift', bench: 'flat-barbell-bench-press', verticalPress: 'standing-barbell-military-press', ...(prefs?.exerciseSelections ?? {}) };
    const days = mode === '3day' ? [1, 3, 5] : [1, 2, 4, 5];
    // The top of the phase's top-set range: what the stored working load was
    // actually lifted for, and therefore the only honest input to an estimate.
    const topSetReps = week <= 4 ? 6 : week <= 8 ? 6 : week <= 11 ? 5 : 3;
    return <main className="instrument-page space-y-8"><section className="dashboard-command"><p className="dashboard-command-label">ATHENA · {pl ? `TYDZIEŃ ${week}` : `WEEK ${week}`}</p><h1>{week <= 4 ? (pl ? 'Mądrość' : 'Wisdom') : week <= 8 ? (pl ? 'Dyscyplina' : 'Discipline') : week <= 11 ? (pl ? 'Dowodzenie' : 'Command') : (pl ? 'Osąd' : 'Judgment')}</h1><p className="text-muted-foreground">{pl ? 'Opanuj boje. Naucz się trenować ciężko i inteligentnie.' : 'Master the lifts. Learn to train heavy intelligently.'}</p><Button size="lg" className="dashboard-start" onClick={() => navigate(`/app/workout/${week}/${days[0]}`)}>{pl ? 'Rozpocznij sesję' : 'Start session'}</Button></section>
        {prefs?.pendingScheduleChange && <p className="text-sm text-muted-foreground">{pl ? 'Zmiana trybu czeka na ukończenie tygodnia.' : 'The mode change is queued until this week is complete.'}</p>}
        <section className="space-y-3"><h2 className="text-xl font-semibold">{pl ? 'Szacowany 1RM' : 'Estimated 1RM'}</h2>
            <p className="text-sm text-muted-foreground">{pl ? `Z ostatniego ciężaru roboczego przy górnej granicy zakresu tej fazy (${topSetReps} powt.).` : `From your last working load at the top of this phase's rep range (${topSetReps} reps).`}</p>
            <dl className="spec-rows">{(['squat','hinge','bench','verticalPress'] as const).map(family => { const id = choices[family]; const nowKg = user.athenaStatus?.exerciseLoads?.[id]; const oneRm = nowKg ? Math.round(epley(nowKg, topSetReps) / 2.5) * 2.5 : undefined; return <div key={family}><dt>{family}</dt><dd>{oneRm ? `${oneRm} kg` : '—'}</dd></div>; })}</dl></section>
        <section><h2 className="text-xl font-semibold">{pl ? 'Sesje' : 'Sessions'}</h2><div className="border-t border-border mt-4">{days.map((day, index) => <button key={day} onClick={() => navigate(`/app/workout/${week}/${day}`)} className="block min-h-16 w-full border-b border-border px-3 text-left hover:bg-muted/40">{pl ? `Sesja ${index + 1}` : `Session ${index + 1}`}</button>)}</div></section></main>;
};
