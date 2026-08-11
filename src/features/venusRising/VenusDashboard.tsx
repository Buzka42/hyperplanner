import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useUser } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/useTranslation';
import type { UserProfile } from '../../types';
import { calendarPlanWeek, requestScheduleMode } from '../planLifecycle';
import { effectiveVenusMode } from '../../data/plans/venusRising';
import { EXERCISE_BY_ID } from '../../data/exercises/library';

const PRIORITIES = ['side-glute-medius-hip-thrust', 'lateral-raise', 'assisted-pull-up', 'single-arm-hammer-row', 'leg-extension'];

export const VenusDashboard = ({ user }: { user: UserProfile }) => {
    const { updateUserProfile } = useUser();
    const { language } = useLanguage();
    const navigate = useNavigate();
    const pl = language === 'pl';
    const start = user.programProgress?.['venus-rising']?.startDate ?? user.startDate;
    const week = Math.min(12, calendarPlanWeek(start, new Date().toISOString()));
    const mode = effectiveVenusMode(user);
    const current = user.planPreferences?.['venus-rising'];
    const [first, setFirst] = useState(current?.exerciseSelections?.priority1 ?? 'lateral-raise');
    const [second, setSecond] = useState(current?.exerciseSelections?.priority2 ?? 'side-glute-medius-hip-thrust');
    const [saving, setSaving] = useState(false);
    const days = mode === '3day' ? [1, 3, 5] : [1, 2, 4, 5];

    const write = async (nextMode: '3day' | '4day') => {
        setSaving(true);
        const now = new Date().toISOString();
        const base = current ?? { scheduleMode: mode, exerciseSelections: {}, updatedAt: now };
        const prefs = nextMode === mode ? base : requestScheduleMode(base, { planId: 'venus-rising', startedAt: start, week, completedThroughWeek: Math.floor((user.programProgress?.['venus-rising']?.completedSessions ?? 0) / days.length) }, nextMode, now);
        await updateUserProfile({ planPreferences: { ...(user.planPreferences ?? {}), 'venus-rising': { ...prefs, exerciseSelections: { priority1: first, priority2: second }, updatedAt: now } } });
        setSaving(false);
    };

    return <main className="instrument-page space-y-8"><section className="dashboard-command"><p className="dashboard-command-label">VENUS RISING · {pl ? `TYDZIEŃ ${week}` : `WEEK ${week}`}</p><h1>{mode === '3day' ? (pl ? '3 dni · całe ciało' : '3-day full body') : (pl ? '4 dni · góra/dół' : '4-day upper/lower')}</h1><p className="text-muted-foreground">{current?.pendingScheduleChange ? (pl ? 'Zmiana trybu czeka na zakończenie obecnego tygodnia.' : 'Your mode change is queued until the current week is complete.') : (pl ? 'Buduj sylwetkę. Naucz się progresować.' : 'Build the physique. Learn how to progress.')}</p><Button size="lg" className="dashboard-start" onClick={() => navigate(`/app/workout/${week}/${days[0]}`)}>{pl ? 'Rozpocznij następną sesję' : 'Start next session'}</Button></section>
        <section className="space-y-4"><h2 className="text-2xl font-semibold">{pl ? 'Tryb i priorytety' : 'Mode and priorities'}</h2><div className="grid sm:grid-cols-3 gap-4"><label className="text-xs uppercase tracking-widest text-muted-foreground">{pl ? 'Tryb' : 'Mode'}<select defaultValue={mode} id="venus-mode" className="block min-h-11 w-full bg-transparent border-b border-input text-base text-foreground"><option value="4day">4 day</option><option value="3day">3 day</option></select></label>{[first, second].map((value, index) => <label key={index} className="text-xs uppercase tracking-widest text-muted-foreground">{pl ? `Priorytet ${index + 1}` : `Priority ${index + 1}`}<select value={value} onChange={e => index ? setSecond(e.target.value) : setFirst(e.target.value)} className="block min-h-11 w-full bg-transparent border-b border-input text-base text-foreground">{PRIORITIES.map(id => <option key={id} value={id}>{EXERCISE_BY_ID[id].name[pl ? 'pl' : 'en']}</option>)}</select></label>)}</div><Button variant="outline" disabled={saving} onClick={() => void write((document.getElementById('venus-mode') as HTMLSelectElement).value as '3day' | '4day')}>{pl ? 'Zapisz ustawienia' : 'Save settings'}</Button></section>
        <section><h2 className="text-xl font-semibold">{pl ? 'Sesje tego tygodnia' : 'This week’s sessions'}</h2><div className="border-t border-border mt-4">{days.map((day, i) => <button key={day} onClick={() => navigate(`/app/workout/${week}/${day}`)} className="block min-h-16 w-full text-left border-b border-border px-3 py-3 hover:bg-muted/40">{pl ? `Sesja ${i + 1}` : `Session ${i + 1}`}</button>)}</div></section></main>;
};
