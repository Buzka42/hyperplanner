import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface WorkoutLog {
    id: string;
    date: string;
    week?: number;
    day?: number;
    weekNum?: number;
    dayNum?: number;
    dayName: string;
    programId?: string;
    exercises: Array<{
        name: string;
        sets: number;
        setsData: any[];
    }>;
}

export const WorkoutHistory: React.FC = () => {
    const { user } = useUser();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedIds(newExpanded);
    };

    const renderWorkoutName = (name: any, week: any, day: any) => {
        if (!name) return `Session (W:${week || '?'}, D:${day || '?'})`;

        const nameStr = String(name);

        if (nameStr.startsWith('t:')) {
            try {
                // Remove 't:' prefix
                const content = nameStr.substring(2);

                // Check if it has args separator '|'
                if (content.includes('|')) {
                    const [key, jsonStr] = content.split('|');
                    const args = JSON.parse(jsonStr);
                    return t(key.trim(), args);
                } else {
                    return t(content.trim());
                }
            } catch (e) {
                console.error("Error parsing translation in history name:", nameStr, e);
                // Last ditch effort: try to translate the key directly if it doesn't look like JSON
                const simpleKey = nameStr.startsWith('t:') ? nameStr.substring(2) : nameStr;
                return t(simpleKey.split('|')[0].trim());
            }
        }
        return nameStr;
    };

    const handleEdit = (workout: WorkoutLog) => {
        if (workout.programId === '30-minute-adventure') {
            navigate(`/app/adventure/${workout.id}`);
            return;
        }
        // Fallback check for different naming conventions in database
        const w = workout.week !== undefined ? workout.week : workout.weekNum;
        const d = workout.day !== undefined ? workout.day : workout.dayNum;

        if (w !== undefined && d !== undefined) {
            navigate(`/app/workout/${w}/${d}`);
        } else {
            console.error("Critical: Workout session missing schedule metadata", workout);
            alert(t('common.error') + ": Missing week/day data. Contact support.");
        }
    };

    useEffect(() => {
        if (!user) return;

        const fetchWorkouts = async () => {
            try {
                const workoutsRef = collection(db, 'users', user.id, 'workouts');
                const q = query(workoutsRef, orderBy('date', 'desc'));
                const snapshot = await getDocs(q);

                const logs: WorkoutLog[] = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    logs.push({
                        id: doc.id,
                        ...data
                    } as WorkoutLog);
                });

                setWorkouts(logs);
            } catch (error) {
                console.error('Error fetching workout history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, [user]);

    if (!user) {
        return (
            <div className="p-4 bg-background h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Identity check failed. Please log in.</p>
            </div>
        );
    }

    return (
        <div className="instrument-page history-ledger max-w-5xl mx-auto pb-24">
            <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate('/app/dashboard')} className="-ml-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1>{t('history.title')}</h1>
                    <p className="history-count">{t('history.sessionCount', { count: workouts.length })}</p>
                </div>
            </div>

            {loading ? (
                <p className="history-empty">{t('common.loading')}</p>
            ) : workouts.length === 0 ? (
                <div className="history-empty">
                    <p>{t('history.emptyTitle')}</p>
                    <p>{t('history.emptyCopy')}</p>
                    <Button onClick={() => navigate('/app/dashboard')} className="mt-4">{t('history.emptyAction')}</Button>
                </div>
            ) : (
                /* Dense tabular data — a hairline table, the same grammar as the
                   set ledger. This block used to hardcode zinc greys and a red
                   accent, so every program rendered its history in Pencilneck's
                   colours. */
                <div className="history-rows">
                    {workouts.map((workout) => {
                        const isExpanded = expandedIds.has(workout.id);
                        const w = workout.week !== undefined ? workout.week : workout.weekNum;
                        const d = workout.day !== undefined ? workout.day : workout.dayNum;
                        const when = new Date(workout.date);

                        return (
                            <div key={workout.id} className={cn('history-session', isExpanded && 'is-open')}>
                                <div className="history-session-head">
                                    <button
                                        type="button"
                                        className="history-session-toggle"
                                        aria-expanded={isExpanded}
                                        onClick={() => toggleExpand(workout.id)}
                                    >
                                        <span className="history-session-name">{renderWorkoutName(workout.dayName, w, d)}</span>
                                        <span className="history-session-when">
                                            <Calendar className="h-3 w-3" aria-hidden="true" />
                                            {when.toLocaleDateString()} · {when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0" aria-hidden="true" /> : <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />}
                                    </button>
                                    <Button variant="ghost" size="sm" className="history-edit" onClick={() => handleEdit(workout)}>
                                        <Edit2 className="h-3.5 w-3.5 mr-2" />{t('history.edit')}
                                    </Button>
                                </div>

                                {isExpanded && (
                                    <div className="history-session-body">
                                        {workout.exercises?.map((ex: any, exIdx: number) => (
                                            <div key={exIdx} className="history-exercise">
                                                <p className="history-exercise-name">{ex.name}</p>
                                                <div className="ledger-rows">
                                                    {ex.setsData?.map((set: any, setIdx: number) => (
                                                        <div key={setIdx} className="ledger-row is-complete">
                                                            <span className="ledger-row-n">{setIdx + 1}</span>
                                                            <span className="ledger-row-value">
                                                                {set.weight}{t('common.kg')} <i aria-hidden="true">×</i> {set.reps}
                                                            </span>
                                                            <span className="ledger-row-state">
                                                                {set.note ? <span className="history-note" title={set.note} aria-label={set.note} /> : null}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
