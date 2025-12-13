import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, Dumbbell, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const History: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, 'users', user.id, 'workouts'),
                    orderBy('date', 'desc')
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setWorkouts(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate('/app/dashboard')} className="-ml-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">Workout History</h2>
            </div>

            {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading logs...</div>
            ) : workouts.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-secondary/10">
                    <Dumbbell className="h-10 w-10 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium">No workouts logged yet</h3>
                    <p className="text-muted-foreground">Get in there and crush some steel.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {workouts.map((workout) => (
                        <Card key={workout.id} className="border-l-4 border-l-primary">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">{workout.dayName || `Week ${workout.week} Day ${workout.day}`}</CardTitle>
                                        <div className="flex items-center text-xs text-muted-foreground gap-3">
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(workout.date), 'MMM d, yyyy')}</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(workout.date), 'h:mm a')}</span>
                                        </div>
                                    </div>
                                    {/* Calculated stats/volume could go here */}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {(workout.exercises || []).map((ex: any) => (
                                        <div key={ex.id} className="flex justify-between text-sm py-1 border-b last:border-0 border-border/50">
                                            <span className={ex.completed ? "" : "text-muted-foreground line-through"}>{ex.name}</span>
                                            <span className="font-mono text-muted-foreground">
                                                {ex.weight > 0 ? `${ex.weight}kg` : ""} {ex.reps && `x ${ex.reps}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
