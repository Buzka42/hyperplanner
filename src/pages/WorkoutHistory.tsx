import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, Dumbbell, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
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
                <p className="text-zinc-400">Identity check failed. Please log in.</p>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="icon" onClick={() => navigate('/app/dashboard')} className="hover:bg-zinc-800">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-white uppercase">Archive</h2>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        {workouts.length} total sessions committed to code
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-12 h-12 border-4 border-zinc-800 border-t-red-600 rounded-full animate-spin"></div>
                    <p className="text-zinc-500 font-bold tracking-widest uppercase text-[10px]">Retrieving Records...</p>
                </div>
            ) : workouts.length === 0 ? (
                <Card className="bg-zinc-950 border-zinc-900 border-dashed border-2">
                    <CardContent className="p-20 text-center space-y-4">
                        <Dumbbell className="h-20 w-20 mx-auto text-zinc-900" />
                        <div className="space-y-1">
                            <p className="text-zinc-400 font-bold uppercase tracking-tight text-xl">Empty Repository</p>
                            <p className="text-zinc-600 text-sm">No data logged. Execute your first program to begin tracking.</p>
                        </div>
                        <Button onClick={() => navigate('/app/dashboard')} className="bg-red-600 hover:bg-red-500 font-black px-8">EXECUTE FIRST WORKOUT</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {workouts.map((workout) => {
                        const isExpanded = expandedIds.has(workout.id);
                        const w = workout.week !== undefined ? workout.week : workout.weekNum;
                        const d = workout.day !== undefined ? workout.day : workout.dayNum;

                        return (
                            <Card key={workout.id} className="bg-zinc-950 border-zinc-900 hover:border-zinc-800 transition-all duration-300 group shadow-2xl overflow-hidden">
                                <CardHeader className="p-5 cursor-pointer select-none" onClick={() => toggleExpand(workout.id)}>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                                                {renderWorkoutName(workout.dayName, w, d)}
                                            </CardTitle>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                                                    <Calendar className="h-3 w-3 text-zinc-800" />
                                                    {new Date(workout.date).toLocaleDateString()}
                                                </div>
                                                <div className="text-[10px] text-red-600/80 font-black uppercase tracking-widest bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30">
                                                    {new Date(workout.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 h-10 px-5 uppercase font-black text-[10px] tracking-[0.2em]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(workout);
                                                }}
                                            >
                                                <Edit2 className="h-3.5 w-3.5 mr-2 text-red-600" />
                                                Edit
                                            </Button>
                                            <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                                {isExpanded ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                {isExpanded && (
                                    <CardContent className="px-5 pb-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="grid gap-6 pt-5 border-t border-zinc-900">
                                            {workout.exercises?.map((ex: any, exIdx: number) => (
                                                <div key={exIdx} className="space-y-3">
                                                    <div className="flex items-center justify-between border-l-2 border-red-600 pl-3">
                                                        <div className="text-xs font-black text-zinc-200 uppercase tracking-widest">{ex.name}</div>
                                                        <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest bg-zinc-900 px-2 rounded">{ex.sets} SETS DATA</div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                                        {ex.setsData?.map((set: any, setIdx: number) => (
                                                            <div key={setIdx} className="flex items-center gap-4 bg-zinc-900/50 p-3 rounded-lg border border-zinc-900/80 hover:bg-zinc-900 transition-colors">
                                                                <span className="text-[10px] font-black text-zinc-700 w-4">#{setIdx + 1}</span>
                                                                <div className="flex-1 flex justify-around items-center">
                                                                    <div className="flex flex-col items-center">
                                                                        <span className="text-white font-black text-base leading-none">{set.weight}</span>
                                                                        <span className="text-[8px] text-zinc-600 uppercase font-black tracking-tighter">kg</span>
                                                                    </div>
                                                                    <div className="h-4 w-[1px] bg-zinc-800" />
                                                                    <div className="flex flex-col items-center">
                                                                        <span className="text-white font-black text-base leading-none">{set.reps}</span>
                                                                        <span className="text-[8px] text-zinc-600 uppercase font-black tracking-tighter">reps</span>
                                                                    </div>
                                                                </div>
                                                                {set.note && (
                                                                    <div className="absolute top-0 right-0 p-1">
                                                                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full" title={set.note} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
