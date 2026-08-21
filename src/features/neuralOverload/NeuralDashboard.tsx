import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/useTranslation';
import { useUser } from '../../contexts/UserContext';
import type { UserProfile } from '../../types';
import { clampProgramWeek } from '../planLifecycle';
import { EXERCISE_BY_ID } from '../../data/exercises/library';
import { NEURAL_D4_SQUATS } from '../planSelections/options';

export const NeuralDashboard = ({ user }: { user: UserProfile }) => {
    const { updateUserProfile } = useUser();
    const { language } = useLanguage();
    const navigate = useNavigate();
    const pl = language === 'pl';
    const start = user.programProgress?.['neural-overload']?.startDate ?? user.startDate;
    const week = clampProgramWeek({
        startDate: start,
        completedSessions: user.programProgress?.['neural-overload']?.completedSessions,
        sessionsPerWeek: 4,
        maxWeeks: 9,
    });
    const prefs = user.planPreferences?.['neural-overload'];
    const [d4Squat, setD4Squat] = useState(prefs?.exerciseSelections?.d4Squat ?? 'front-squat');
    const [saving, setSaving] = useState(false);
    const days = [1, 2, 4, 5];

    const save = async () => {
        setSaving(true);
        const now = new Date().toISOString();
        await updateUserProfile({
            planPreferences: {
                ...(user.planPreferences ?? {}),
                'neural-overload': {
                    scheduleMode: prefs?.scheduleMode ?? '4day',
                    updatedAt: now,
                    exerciseSelections: { ...(prefs?.exerciseSelections ?? {}), d4Squat },
                },
            },
        });
        setSaving(false);
    };

    return (
        <main className="instrument-page space-y-8">
            <section className="dashboard-command">
                <p className="dashboard-command-label">NEURAL OVERLOAD · {pl ? `TYDZIEŃ ${week}` : `WEEK ${week}`}</p>
                <h1>{week <= 3 ? (pl ? 'Naładowanie' : 'Charge') : week <= 6 ? (pl ? 'Rozładowanie' : 'Discharge') : (pl ? 'Przeciążenie' : 'Overload')}</h1>
                <p className="text-muted-foreground">{pl ? 'Dzień 4 buduje bez dokładania kosztu neuralnego.' : 'Day 4 builds without adding neural cost.'}</p>
                <Button size="lg" className="dashboard-start" onClick={() => navigate(`/app/workout/${week}/${days[0]}`)}>{pl ? 'Rozpocznij sesję' : 'Start session'}</Button>
            </section>
            <section className="space-y-5">
                <h2 className="text-2xl font-semibold">{pl ? 'Przysiad dnia 4' : 'Day 4 squat'}</h2>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                    {pl ? 'Wariant' : 'Variant'}
                    <select value={d4Squat} onChange={e => setD4Squat(e.target.value)} className="instrument-select">
                        {NEURAL_D4_SQUATS.filter(option => EXERCISE_BY_ID[option.id]).map(option => (
                            <option key={option.id} value={option.id}>{pl ? (EXERCISE_BY_ID[option.id].name.pl) : option.label}</option>
                        ))}
                    </select>
                </label>
                <Button variant="outline" disabled={saving} onClick={() => void save()}>{pl ? 'Zapisz' : 'Save'}</Button>
            </section>
            <section>
                <h2 className="text-xl font-semibold">{pl ? 'Sesje' : 'Sessions'}</h2>
                <div className="border-t border-border mt-4">
                    {days.map((day, index) => (
                        <button key={day} onClick={() => navigate(`/app/workout/${week}/${day}`)} className="block min-h-16 w-full border-b border-border px-3 text-left hover:bg-muted/40">
                            {pl ? `Sesja ${index + 1}` : `Session ${index + 1}`}
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
};
