import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { Button } from '../../components/ui/button';
import { useUser } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/useTranslation';
import type { UserProfile } from '../../types';
import type { PerformanceProfileSummary } from '../performanceProfile/types';
import { EXERCISE_BY_ID } from '../../data/exercises/library';
import { clampProgramWeek } from '../planLifecycle';

type Family = 'squat' | 'hinge' | 'push' | 'pull';
const family = (id: string): Family | null => {
    const p = EXERCISE_BY_ID[id]?.pattern;
    return p === 'squat' || p === 'lunge' || p === 'knee-extension' ? 'squat'
        : p === 'hinge' || p === 'hip-extension' || p === 'knee-flexion' ? 'hinge'
            : p?.includes('press') ? 'push'
                : p?.includes('pull') ? 'pull'
                    : null;
};

export const KaliDashboard = ({ user }: { user: UserProfile }) => {
    const { updateUserProfile } = useUser();
    const { language } = useLanguage();
    const navigate = useNavigate();
    const pl = language === 'pl';
    const start = user.programProgress?.kali?.startDate ?? user.startDate;
    const week = clampProgramWeek({ startDate: start, completedSessions: user.programProgress?.kali?.completedSessions, sessionsPerWeek: 4, maxWeeks: 8 });
    const [current, setCurrent] = useState<Partial<Record<Family, number>>>({});
    const [bodyweight, setBodyweight] = useState(user.kaliStatus?.bodyweightKg?.toString() ?? '');
    const [aggressive, setAggressive] = useState(Boolean(user.kaliStatus?.aggressive));

    useEffect(() => {
        void (async () => {
            const snapshot = await getDocs(collection(db, 'users', user.id, 'performanceProfile'));
            const latest: Partial<Record<Family, number>> = {};
            snapshot.docs.forEach(docSnap => {
                const summary = docSnap.data() as PerformanceProfileSummary;
                const f = family(summary.exerciseId);
                const observation = summary.latestObservation;
                if (f && observation.estimateConfidence === 'standard' && observation.estimated1RMKg) {
                    latest[f] = Math.max(latest[f] ?? 0, observation.estimated1RMKg);
                }
            });
            setCurrent(latest);
            if (!user.kaliStatus?.baseline && Object.keys(latest).length) {
                await updateUserProfile({ kaliStatus: { ...(user.kaliStatus ?? {}), baseline: latest } });
            }
        })();
    }, [user.id]);

    const save = async () => {
        const kg = Number(bodyweight.replace(',', '.'));
        await updateUserProfile({
            kaliStatus: {
                ...(user.kaliStatus ?? {}),
                aggressive,
                ...(Number.isFinite(kg) && kg > 0 ? { bodyweightKg: kg } : {}),
            },
        });
    };

    return (
        <main className="instrument-page space-y-8">
            <section className="dashboard-command">
                <p className="dashboard-command-label">KALI · {pl ? `TYDZIEŃ ${week}` : `WEEK ${week}`}</p>
                <h1>{pl ? 'Zachowaj siłę' : 'Keep the strength'}</h1>
                <p className="text-muted-foreground">{pl ? 'Najpierw redukuj objętość, nie intensywność.' : 'Reduce volume before intensity.'}</p>
                <Button size="lg" className="dashboard-start" onClick={() => navigate(`/app/workout/${week}/1`)}>{pl ? 'Rozpocznij Earth' : 'Start Earth'}</Button>
            </section>
            <section>
                <h2 className="text-2xl font-semibold">{pl ? 'Zachowanie wyników' : 'Performance retained'}</h2>
                <dl className="spec-rows mt-4">
                    {(['squat', 'hinge', 'push', 'pull'] as Family[]).map(f => (
                        <div key={f}>
                            <dt className="text-sm uppercase tracking-widest">{f}</dt>
                            <dd className="text-3xl font-bold">
                                {user.kaliStatus?.baseline?.[f] && current[f]
                                    ? `${Math.round(current[f]! / user.kaliStatus.baseline[f]! * 100)}%`
                                    : '—'}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">{pl ? 'Ustawienia biegu' : 'Run settings'}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">
                        {pl ? 'Masa ciała' : 'Bodyweight'}
                        <input value={bodyweight} onChange={e => setBodyweight(e.target.value)} inputMode="decimal" className="block min-h-11 w-full bg-transparent border-b border-input text-base" />
                    </label>
                </div>
                <button
                    type="button"
                    aria-pressed={aggressive}
                    onClick={() => setAggressive(value => !value)}
                    className={`min-h-11 w-full border px-3 py-2 text-left text-sm ${aggressive ? 'border-primary bg-primary/15 text-primary' : 'border-border text-muted-foreground'}`}
                >
                    {pl ? 'Agresywny deficyt — odejmij 1 akcesorium dziennie' : 'Aggressive deficit — drop 1 accessory per day'}
                </button>
                <Button variant="outline" onClick={() => void save()}>{pl ? 'Zapisz' : 'Save'}</Button>
            </section>
        </main>
    );
};
