import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/useTranslation';
import { useUser } from '../../contexts/UserContext';
import type { UserProfile } from '../../types';
import { calendarPlanWeek, requestScheduleMode } from '../planLifecycle';
import { effectiveAthenaMode } from '../../data/plans/athena';
import { EXERCISE_BY_ID } from '../../data/exercises/library';

const FAMILIES = {
    squat: ['barbell-squat', 'hack-squat', 'safety-bar-squat'],
    hinge: ['romanian-deadlift', 'conventional-deadlift', 'sumo-deadlift'],
    bench: ['flat-barbell-bench-press', 'paused-bench-press', 'hammer-chest-press'],
    verticalPress: ['standing-barbell-military-press', 'seated-dumbbell-shoulder-press', 'shoulder-press-machine'],
};

export const AthenaDashboard = ({ user }: { user: UserProfile }) => {
    const { updateUserProfile } = useUser(); const { language } = useLanguage(); const navigate = useNavigate(); const pl = language === 'pl';
    const start = user.programProgress?.athena?.startDate ?? user.startDate; const week = Math.min(12, calendarPlanWeek(start, new Date().toISOString()));
    const mode = effectiveAthenaMode(user); const prefs = user.planPreferences?.athena;
    const [nextMode, setNextMode] = useState<'3day' | '4day'>(mode);
    const [choices, setChoices] = useState<Record<string, string>>({ squat: 'barbell-squat', hinge: 'romanian-deadlift', bench: 'flat-barbell-bench-press', verticalPress: 'standing-barbell-military-press', ...(prefs?.exerciseSelections ?? {}) });
    const [saving, setSaving] = useState(false); const days = mode === '3day' ? [1, 3, 5] : [1, 2, 4, 5];
    const save = async () => { setSaving(true); const now = new Date().toISOString(); const base = prefs ?? { scheduleMode: mode, exerciseSelections: {}, updatedAt: now };
        const next = nextMode === mode ? base : requestScheduleMode(base, { planId: 'athena', startedAt: start, week, completedThroughWeek: Math.floor((user.programProgress?.athena?.completedSessions ?? 0) / days.length) }, nextMode, now);
        await updateUserProfile({ planPreferences: { ...(user.planPreferences ?? {}), athena: { ...next, exerciseSelections: choices, updatedAt: now } } }); setSaving(false); };
    return <main className="instrument-page space-y-8"><section className="dashboard-command"><p className="dashboard-command-label">ATHENA · {pl ? `TYDZIEŃ ${week}` : `WEEK ${week}`}</p><h1>{week <= 4 ? (pl ? 'Mądrość' : 'Wisdom') : week <= 8 ? (pl ? 'Dyscyplina' : 'Discipline') : week <= 11 ? (pl ? 'Dowodzenie' : 'Command') : (pl ? 'Osąd' : 'Judgment')}</h1><p className="text-muted-foreground">{pl ? 'Opanuj boje. Naucz się trenować ciężko i inteligentnie.' : 'Master the lifts. Learn to train heavy intelligently.'}</p><Button size="lg" className="dashboard-start" onClick={() => navigate(`/app/workout/${week}/${days[0]}`)}>{pl ? 'Rozpocznij sesję' : 'Start session'}</Button></section>
        <section className="space-y-5"><h2 className="text-2xl font-semibold">{pl ? 'Konfiguracja biegu' : 'Run configuration'}</h2><div className="grid sm:grid-cols-2 gap-4"><label className="text-xs uppercase tracking-widest text-muted-foreground">{pl ? 'Tryb' : 'Mode'}<select value={nextMode} onChange={e => setNextMode(e.target.value as typeof nextMode)} className="block min-h-11 w-full bg-transparent border-b border-input text-base text-foreground"><option value="4day">4 day</option><option value="3day">3 day</option></select></label>{Object.entries(FAMILIES).map(([family, ids]) => <label key={family} className="text-xs uppercase tracking-widest text-muted-foreground">{family}<select value={choices[family]} onChange={e => setChoices(old => ({ ...old, [family]: e.target.value }))} className="block min-h-11 w-full bg-transparent border-b border-input text-base text-foreground">{ids.filter(id => EXERCISE_BY_ID[id]).map(id => <option key={id} value={id}>{EXERCISE_BY_ID[id].name[pl ? 'pl' : 'en']}</option>)}</select></label>)}</div>{prefs?.pendingScheduleChange && <p className="text-sm text-muted-foreground">{pl ? 'Zmiana trybu czeka na ukończenie tygodnia.' : 'The mode change is queued until this week is complete.'}</p>}<Button variant="outline" disabled={saving} onClick={() => void save()}>{pl ? 'Zapisz konfigurację' : 'Save configuration'}</Button></section>
        <section><h2 className="text-xl font-semibold">{pl ? 'Sesje' : 'Sessions'}</h2><div className="border-t border-border mt-4">{days.map((day, index) => <button key={day} onClick={() => navigate(`/app/workout/${week}/${day}`)} className="block min-h-16 w-full border-b border-border px-3 text-left hover:bg-muted/40">{pl ? `Sesja ${index + 1}` : `Session ${index + 1}`}</button>)}</div></section></main>;
};
