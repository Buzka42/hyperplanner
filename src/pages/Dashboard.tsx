
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trophy, Calendar, ChevronLeft, ChevronRight, Skull, Activity, ShieldCheck, Dumbbell } from 'lucide-react';
import { BADGES } from '../data/badges';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const Dashboard: React.FC = () => {
    const { user, activePlanConfig, updateUserProfile } = useUser();
    const { t, tArray } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
    const [lastW12Date, setLastW12Date] = useState<Date | null>(null);
    const [maxDeficitPushupReps, setMaxDeficitPushupReps] = useState<number>(0);

    const [completionType, setCompletionType] = useState<'skeleton' | 'pencilneck' | null>(null);
    const [showNextSteps, setShowNextSteps] = useState(false);
    const [gluteInput, setGluteInput] = useState("");
    const isPeachy = activePlanConfig.id === 'peachy-glute-plan';
    const isPainGlory = activePlanConfig.id === 'pain-and-glory';
    const [gloryCounter, setGloryCounter] = useState<number>(0);

    useEffect(() => {
        if (location.state?.showSkeletonCompletion) {
            setCompletionType('skeleton');
            const audio = new Audio('/victory.mp3');
            audio.play().catch(() => { });
        } else if (location.state?.showPencilneckCompletion) {
            setCompletionType('pencilneck');
            const audio = new Audio('/victory.mp3');
            audio.play().catch(() => { });
        }
    }, [location.state]);

    // Use active plan
    const currentProgram = activePlanConfig.program;
    const activeWidgets = activePlanConfig.ui?.dashboardWidgets || [];

    const [viewWeek, setViewWeek] = useState<number>(1);
    const [display1RM, setDisplay1RM] = useState<string>("0");

    useEffect(() => {
        if (!user) return;

        const savedViewWeek = localStorage.getItem(`dashboardViewWeek-${user.id}`);

        const fetchStatus = async () => {
            try {
                const workoutsRef = collection(db, 'users', user.id, 'workouts');
                const q = query(workoutsRef);
                const snapshot = await getDocs(q);

                const completedKeys = new Set<string>();
                let maxCompletedWeek = 0;
                let logsForWeek: Record<number, number> = {};
                let week12FinishDate: Date | null = null;

                let localMaxDeficitPushupReps = 0;

                snapshot.docs.forEach(doc => {
                    const d = doc.data();
                    const isMatch = d.programId === user.programId || (!d.programId && user.programId === 'bench-domination');
                    if (!isMatch) return;

                    const activeStartDate = user.programProgress?.[user.programId]?.startDate || user.startDate;
                    if (activeStartDate && new Date(d.date) < new Date(activeStartDate)) return;

                    const key = `${d.week}-${d.day}`;
                    completedKeys.add(key);

                    if (d.week > maxCompletedWeek) maxCompletedWeek = d.week;
                    logsForWeek[d.week] = (logsForWeek[d.week] || 0) + 1;

                    // Track Deficit Push-up PR for skeleton program
                    if (user.programId === 'skeleton-to-threat' && d.exercises) {
                        const deficitPushupExercise = d.exercises.find((ex: any) => ex.name === 'Deficit Push-ups');
                        if (deficitPushupExercise && deficitPushupExercise.setsData) {
                            deficitPushupExercise.setsData.forEach((set: any) => {
                                const reps = parseInt(set.reps || '0');
                                if (reps > localMaxDeficitPushupReps) {
                                    localMaxDeficitPushupReps = reps;
                                }
                            });
                        }
                    }

                    if (d.week === 12) {
                        const dDate = new Date(d.date);
                        if (!week12FinishDate || dDate > week12FinishDate) {
                            week12FinishDate = dDate;
                        }
                    }
                });

                if (week12FinishDate && activePlanConfig.id === 'bench-domination') {
                    setLastW12Date(week12FinishDate);
                }

                setCompletedSet(completedKeys);
                setMaxDeficitPushupReps(localMaxDeficitPushupReps);

                // Calculate Glory Counter for Pain & Glory (total kg lifted in deadlift variations)
                if (activePlanConfig.id === 'pain-and-glory') {
                    let totalGlory = 0;
                    snapshot.docs.forEach(doc => {
                        const d = doc.data();
                        if (d.programId !== 'pain-and-glory') return;
                        if (d.exercises) {
                            d.exercises.forEach((ex: any) => {
                                // Count deadlift variations
                                if (ex.name && (ex.name.includes('Deadlift') || ex.name.includes('deadlift'))) {
                                    if (ex.setsData) {
                                        ex.setsData.forEach((set: any) => {
                                            const weight = parseFloat(set.weight || '0');
                                            const reps = parseInt(set.reps || '0');
                                            if (weight > 0 && reps > 0) {
                                                totalGlory += weight * reps;
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                    setGloryCounter(totalGlory);
                }

                let targetWeek = 1;
                if (savedViewWeek) {
                    targetWeek = parseInt(savedViewWeek);
                } else {
                    targetWeek = maxCompletedWeek || 1;
                }

                targetWeek = Math.min(targetWeek, currentProgram.weeks.length);

                const weekConf = currentProgram.weeks.find(w => w.weekNumber === targetWeek);
                const totalDays = weekConf?.days.length || 4;
                if ((logsForWeek[targetWeek] || 0) >= totalDays) {
                    targetWeek = Math.min(currentProgram.weeks.length, targetWeek + 1);
                }

                setViewWeek(targetWeek);

            } catch (e) {
                console.error("Dashboard fetch error", e);
            }
        };

        fetchStatus();
    }, [user, currentProgram, activePlanConfig.id]);

    useEffect(() => {
        if (user && viewWeek) {
            localStorage.setItem(`dashboardViewWeek-${user.id}`, viewWeek.toString());
        }
    }, [viewWeek, user]);

    useEffect(() => {
        if (!user || !activeWidgets.includes('1rm')) return;
        if (user.benchHistory && user.benchHistory.length > 0) {
            const sorted = [...user.benchHistory].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setDisplay1RM(sorted[0].weight.toString());
        } else {
            setDisplay1RM(user.stats.pausedBench?.toString() || "0");
        }
    }, [user, activeWidgets]);

    if (!user) return null;

    const weekData = currentProgram.weeks.find(w => w.weekNumber === viewWeek);

    // Use squat history for Peachy, bench history for others
    const strengthHistory = isPeachy ? (user.squatHistory || []) : (user.benchHistory || []);
    const strengthChartTitle = isPeachy ? t('dashboard.cards.squatStrengthProgression') : t('dashboard.cards.strengthProgression');
    const initialStat = isPeachy ? user.stats.squat : user.stats.pausedBench;

    const data = strengthHistory?.map((entry: any) => ({
        date: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        weight: entry.weight
    })) || [];
    if (data.length === 0 && activeWidgets.includes('strength_chart') && initialStat) {
        data.push({ date: 'Start', weight: initialStat });
    }

    const nextWeek = () => {
        if (viewWeek < currentProgram.weeks.length) setViewWeek(prev => prev + 1);
    };

    const prevWeek = () => {
        if (viewWeek > 1) setViewWeek(prev => prev - 1);
    };

    let weekTitleColor = "text-foreground";
    let weekBadge = null;
    if (activePlanConfig.id === 'bench-domination') {
        if (viewWeek > 12) {
            if (viewWeek === 13) {
                weekTitleColor = "text-blue-500";
                weekBadge = <div className="flex items-center text-blue-500 text-sm font-bold ml-2"><ShieldCheck className="w-4 h-4 mr-1" /> {t('dashboard.mandatoryDeload')}</div>;
            } else if (viewWeek >= 14) {
                weekTitleColor = "text-red-600";
                weekBadge = <div className="flex items-center text-red-600 text-sm font-bold ml-2"><Skull className="w-4 h-4 mr-1" /> {t('dashboard.peakingBlock')}</div>;
            }
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            {isPeachy && (
                <style>{`
                    .peachy-theme {
                        --background: 200 60% 94%; 
                        --foreground: 215 25% 27%;
                        --card: 330 60% 95%; 
                        --card-foreground: 215 25% 27%;
                        --popover: 330 60% 95%;
                        --popover-foreground: 215 25% 27%;
                        --primary: 15 100% 74%; 
                        --primary-foreground: 0 0% 100%;
                        --secondary: 15 100% 68%; 
                        --secondary-foreground: 0 0% 100%;
                        --muted: 210 40% 90%;
                        --muted-foreground: 215 16% 47%;
                        --accent: 15 100% 74%;
                        --accent-foreground: 0 0% 100%;
                        --destructive: 0 84.2% 60.2%;
                        --destructive-foreground: 210 40% 98%;
                        --border: 15 100% 74%;
                        --input: 15 100% 74%;
                        --ring: 15 100% 74%;
                    }
                    .peachy-theme .text-primary { color: #FF7A5C !important; }
                    .peachy-theme .bg-primary { background-color: #FF9F7A !important; }
                 `}</style>
            )}

            {isPainGlory && (
                <style>{`
                    :root {
                        --background: 35 30% 12%;
                        --foreground: 35 20% 90%;
                        --card: 35 25% 15%;
                        --card-foreground: 35 20% 90%;
                        --popover: 35 25% 15%;
                        --popover-foreground: 35 20% 90%;
                        --primary: 0 65% 45%;
                        --primary-foreground: 35 20% 95%;
                        --secondary: 35 40% 25%;
                        --secondary-foreground: 35 20% 90%;
                        --muted: 35 20% 20%;
                        --muted-foreground: 35 15% 60%;
                        --accent: 0 65% 45%;
                        --accent-foreground: 35 20% 95%;
                        --destructive: 0 84.2% 60.2%;
                        --destructive-foreground: 210 40% 98%;
                        --border: 35 30% 25%;
                        --input: 35 30% 25%;
                        --ring: 0 65% 45%;
                    }
                `}</style>
            )}

            {completionType && (() => {
                const badgeId = completionType === 'skeleton' ? 'certified_threat' : 'certified_boulder';
                const badge = BADGES.find(b => b.id === badgeId);
                const badgeImage = badge?.image;

                return (
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white p-4 animate-in fade-in duration-1000">
                        <div className="text-6xl animate-bounce mb-8">
                            {completionType === 'skeleton' ? "💀 🎉 💀" : "🎉 🗿 🎉"}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-center mb-4 text-primary uppercase tracking-tighter">
                            {completionType === 'skeleton' ? t('dashboard.completion.skeletonTitle') : t('dashboard.completion.pencilneckTitle')}
                        </h1>
                        <p className="text-xl text-center text-muted-foreground mb-12">
                            {completionType === 'skeleton' ? t('dashboard.completion.skeletonSubtitle') : t('dashboard.completion.pencilneckSubtitle')}
                        </p>
                        <div className="bg-yellow-500/20 border border-yellow-500 p-6 rounded-lg mb-8">
                            {badgeImage ? (
                                <img src={badgeImage} alt={badge?.name || 'Badge'} className="w-24 h-24 mx-auto mb-2 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                            ) : null}
                            <Trophy className={`w-12 h-12 text-yellow-500 mx-auto mb-2 ${badgeImage ? 'hidden' : ''}`} />
                            <div className="text-center font-bold text-yellow-500 text-lg">
                                {completionType === 'skeleton' ? t('dashboard.completion.certifiedThreat') : t('dashboard.completion.certifiedBoulder')}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full max-w-sm">
                            <Button onClick={() => {
                                if (completionType === 'skeleton') {
                                    setShowNextSteps(true);
                                } else if (completionType === 'pencilneck') {
                                    const currentCycle = user.pencilneckStatus?.cycle || 1;
                                    if (currentCycle >= 2) {
                                        // Cycle 2 complete - show trainer contact
                                        setShowNextSteps(true);
                                    } else {
                                        // Cycle 1 complete - just close
                                        setCompletionType(null);
                                    }
                                } else {
                                    setCompletionType(null);
                                }
                            }} size="lg" className="font-bold text-xl w-full py-8">
                                {t('dashboard.completion.claimVictory')}
                            </Button>

                            {completionType === 'pencilneck' && (user.pencilneckStatus?.cycle || 1) === 1 && (
                                <Button
                                    onClick={async () => {
                                        const nextCycle = 2; // Always go to cycle 2 from cycle 1
                                        const now = new Date().toISOString();

                                        // Reset program progress and increment cycle
                                        const updatedProgress = { ...(user.programProgress || {}) };
                                        updatedProgress['pencilneck-eradication'] = {
                                            completedSessions: 0,
                                            startDate: now
                                        };

                                        await updateUserProfile({
                                            pencilneckStatus: { cycle: nextCycle, startDate: now },
                                            programProgress: updatedProgress,
                                            startDate: now, // Update main start date too for safety
                                            completedSessions: 0
                                        });
                                        setCompletionType(null);
                                        // Clear history state to prevent modal reappearing, then reload to refresh data
                                        navigate('/app/dashboard', { replace: true, state: {} });
                                        window.location.reload();
                                    }}
                                    variant="destructive"
                                    size="lg"
                                    className="font-bold text-xl w-full py-8 border-2 border-red-500 bg-red-900/50 hover:bg-red-800"
                                >
                                    {t('dashboard.completion.startCycle2')}
                                </Button>
                            )}
                        </div>
                    </div>
                );
            })()}

            {showNextSteps && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white p-4 animate-in fade-in duration-500">
                    <h1 className="text-4xl font-black text-center mb-6 text-primary">{t('dashboard.nextSteps.title')}</h1>
                    <p className="text-xl text-center text-muted-foreground mb-8 max-w-lg">
                        {completionType === 'skeleton' ? t('dashboard.nextSteps.skeletonDescription') : t('dashboard.nextSteps.pencilneckDescription')}
                    </p>
                    <a href="https://placeholder-contact.com" target="_blank" rel="noreferrer">
                        <Button size="lg" className="font-bold text-xl px-12 py-8 bg-blue-600 hover:bg-blue-700 text-white">
                            {t('dashboard.nextSteps.contactTrainer')}
                        </Button>
                    </a>
                    <button
                        onClick={() => {
                            setShowNextSteps(false);
                            setCompletionType(null);
                        }}
                        className="mt-6 text-sm text-muted-foreground hover:text-white underline"
                    >
                        Close
                    </button>
                </div>
            )}

            <div>
                {isPeachy ? (
                    <div className="flex flex-col gap-4">
                        {viewWeek <= 4 ? (
                            <div className="flex items-center gap-4">
                                <h2 className="text-4xl font-black tracking-tight">
                                    {t('dashboard.feelingFroggy')} <span className="shimmer-text">{t('dashboard.froggyStatus')}</span>
                                </h2>
                                <img src="/frog.png" alt="Froggy" className="w-24 h-24 object-contain shimmer-img" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <h2 className="text-4xl font-black tracking-tight">
                                    {t('dashboard.feelingPeachy')} <span className="shimmer-text">{t('dashboard.peachyStatus')}</span> 🍑
                                </h2>
                            </div>
                        )}
                    </div>
                ) : isPainGlory ? (
                    <div className="text-left">
                        <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-red-900 via-red-600 to-red-900 bg-clip-text text-transparent animate-pulse">
                            Pain today, glory tomorrow
                        </h2>
                    </div>
                ) : (
                    <>
                        {user.pencilneckStatus && user.pencilneckStatus.cycle > 1 && (
                            <div className="bg-red-900/40 border border-red-500/50 p-4 rounded-lg mb-6 flex items-center gap-4 animate-in slide-in-from-top duration-700">
                                <Dumbbell className="h-8 w-8 text-red-500" />
                                <div>
                                    <div className="font-black text-2xl text-red-500 uppercase tracking-tight">
                                        {t('dashboard.cycleTitle', { cycle: user.pencilneckStatus.cycle })}
                                    </div>
                                    <div className="text-sm text-red-300">
                                        {t('dashboard.cycleDescription')}
                                    </div>
                                </div>
                            </div>
                        )}
                        <h2 className="text-3xl font-bold tracking-tight">
                            {activePlanConfig.id === 'pencilneck-eradication' ? t('dashboard.eradicateThe') :
                                activePlanConfig.id === 'skeleton-to-threat' ? t('dashboard.becomeA') :
                                    t('dashboard.timeTo')} <span className="shimmer-text">
                                {activePlanConfig.id === 'pencilneck-eradication' ? t('dashboard.weakness') :
                                    activePlanConfig.id === 'skeleton-to-threat' ? t('dashboard.threat') :
                                        t('dashboard.dominate')}
                            </span>
                        </h2>
                        <p className="text-muted-foreground">{t('dashboard.welcomeBack')}, {user?.codeword}.</p>
                    </>
                )}
            </div>

            <div className={`grid gap-4 ${activeWidgets.includes('strength_chart') ? 'md:grid-cols-7' : 'grid-cols-1'}`}>
                {activeWidgets.includes('1rm') && (
                    <Card className="col-span-2 bg-primary/5 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.cards.est1rm')}</CardTitle>
                            <Trophy className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{display1RM} {t('common.kg')}</div>
                            <p className="text-xs text-muted-foreground">{t('dashboard.cards.calculatedMax')}</p>
                        </CardContent>
                    </Card>
                )}

                {activeWidgets.includes('glute_tracker') && (
                    <Card className="col-span-3 border-primary/20 bg-primary/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center justify-between">
                                <span>{t('dashboard.cards.weeklyGluteTracker')}</span>
                                <Activity className="w-4 h-4 text-primary" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 items-end">
                                <div className="grid gap-1.5 flex-1">
                                    <label className="text-xs font-medium text-muted-foreground">{t('dashboard.cards.currentCircumference')}</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 102"
                                        value={gluteInput}
                                        onChange={(e) => setGluteInput(e.target.value)}
                                        className="h-8"
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    onClick={async () => {
                                        if (!gluteInput) return;
                                        const newVal = parseFloat(gluteInput);
                                        const newHistory = [...(user.gluteMeasurements || []), { date: new Date().toISOString(), sizeCm: newVal }];
                                        await updateUserProfile({ gluteMeasurements: newHistory });
                                        setGluteInput("");
                                    }}
                                >
                                    {t('common.log')}
                                </Button>
                            </div>
                            {user.gluteMeasurements && user.gluteMeasurements.length > 0 && (
                                <div className="mt-4">
                                    <div className="text-xs text-muted-foreground mb-1">{t('dashboard.cards.latestGrowthTrend')}</div>
                                    <div className="h-[60px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={user.gluteMeasurements.slice(-5)}>
                                                <YAxis domain={['dataMin', 'auto']} hide />
                                                <Line type="monotone" dataKey="sizeCm" stroke="#FF7A5C" strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {activeWidgets.includes('program_status') && (
                    <Card className="col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.cards.programStatus')}</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{t('common.week')} {viewWeek}</div>
                            <p className="text-xs text-muted-foreground">{t('dashboard.cards.viewingSchedule')}</p>
                        </CardContent>
                    </Card>
                )}

                {activePlanConfig.id === 'bench-domination' && user.benchDominationModules && (
                    <Card className="col-span-2 md:col-span-3 border-primary/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.cards.activeModules')}</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-primary/20 text-primary px-2 py-1 rounded font-bold">Core Bench</span>
                                {user.benchDominationModules.tricepGiantSet && <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded">Tricep Giant Set</span>}
                                {user.benchDominationModules.behindNeckPress && <span className="bg-orange-500/10 text-orange-600 px-2 py-1 rounded">BTN Press</span>}
                                {user.benchDominationModules.weightedPullups && <span className="bg-blue-500/10 text-blue-600 px-2 py-1 rounded">W. Pull-ups</span>}
                                {user.benchDominationModules.accessories && <span className="bg-purple-500/10 text-purple-600 px-2 py-1 rounded">Accessories</span>}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeWidgets.includes('strength_chart') && (
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>{strengthChartTitle}</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-0">
                            <div className="h-[140px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="date" hide />
                                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                                        <Line
                                            type="monotone"
                                            dataKey="weight"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            dot={{ fill: "hsl(var(--primary))", r: 3 }}
                                            label={{ position: 'top', fill: 'hsl(var(--foreground))', fontSize: 12, formatter: (value: any) => `${value} kg` }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Glory Counter widget for Pain & Glory */}
                {isPainGlory && (
                    <Card className="col-span-full md:col-span-4 border-red-900/30 bg-gradient-to-br from-amber-950/20 to-red-950/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl text-red-500 font-black flex items-center gap-2">
                                <Trophy className="h-5 w-5" />
                                Glory Counter
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-amber-200">
                                {gloryCounter.toLocaleString()} <span className="text-lg font-normal text-muted-foreground">kg</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total weight lifted in all deadlift variations
                            </p>
                            <div className="mt-4 h-2 bg-red-950/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (gloryCounter / 50000) * 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-right text-amber-500/70 mt-1">
                                {Math.round((gloryCounter / 50000) * 100)}% to 50,000 kg milestone
                            </p>
                        </CardContent>
                    </Card>
                )}

                {activeWidgets.includes('pencilneck_commandments') && (
                    <Card className="col-span-full md:col-span-4 border-primary/20 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                {t('pencilneck.commandmentsTitle')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {tArray('commandments.list').map((p, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm md:text-base">
                                        <span className="font-bold text-primary">{i + 1}.</span>
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {activePlanConfig.id === 'pencilneck-eradication' && (
                    <>
                        <Card className="col-span-full border-red-500/20 bg-red-500/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl text-red-500 uppercase tracking-widest font-black">
                                    Week {viewWeek} Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold italic">
                                    "{tArray('quotes.pencilneckStatus')[Math.min(viewWeek, 8) - 1] || "ERADICATED"}"
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="col-span-full md:col-span-3 border-slate-800 bg-slate-950">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Trap Barometer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{t('pencilneck.pencil')}</span>
                                        <span>{t('pencilneck.boulder')}</span>
                                    </div>
                                    <div className="h-4 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 transition-all duration-1000"
                                            style={{ width: `${Math.min((viewWeek / 8) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-right text-red-400 font-bold">
                                        {t('pencilneck.percentGone', { percent: Math.round((viewWeek / 8) * 100) })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-full md:col-span-4 border-primary/10 bg-primary/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">{t('pencilneck.restDayThought')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="italic text-sm text-muted-foreground">
                                    "{tArray('pencilneck.quotes')[(viewWeek * 3 + 1) % tArray('pencilneck.quotes').length]}"
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}

                {activeWidgets.includes('skeleton_countdown') && (
                    <Card className="col-span-2 bg-slate-950 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{t('skeleton.metamorphosis')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">
                                {currentProgram.weeks.length - Math.min(viewWeek, currentProgram.weeks.length)} <span className="text-base font-normal text-muted-foreground">{t('skeleton.weeksLeft')}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {t('skeleton.untilNoLongerSkeleton')}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {activeWidgets.includes('skeleton_pushup_max') && (
                    <Card className="col-span-2 bg-slate-950 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{t('skeleton.deficitPushupPR')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {maxDeficitPushupReps > 0 ? maxDeficitPushupReps : '--'}
                            </div>
                            <p className="text-xs text-muted-foreground">{t('skeleton.perfectRepsSingleSet')}</p>
                        </CardContent>
                    </Card>
                )}

                {activeWidgets.includes('skeleton_quotes') && (
                    <Card className="col-span-3 border-primary/10 bg-primary/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{t('pencilneck.restDayThought')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="italic text-sm text-muted-foreground">
                                "{t('skeleton.restDayQuote')}"
                            </p>
                        </CardContent>
                    </Card>
                )}

                {activePlanConfig.id === 'bench-domination' && viewWeek === 13 && !user.benchDominationStatus && (
                    <Card className="col-span-full border-yellow-500 bg-yellow-500/5 animate-pulse">
                        <CardHeader>
                            <CardTitle className="text-2xl text-yellow-500 flex items-center gap-2">
                                <Activity className="w-6 h-6" /> {t('crossroads.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                {t('crossroads.survived')}
                            </p>

                            {lastW12Date && (
                                <div className="bg-black/20 p-4 rounded text-center border border-yellow-500/30">
                                    <div className="text-sm uppercase tracking-widest text-muted-foreground">{t('crossroads.restTimer')}</div>
                                    <div className="text-4xl font-black text-white">
                                        {Math.max(0, 7 - Math.floor((new Date().getTime() - lastW12Date.getTime()) / (1000 * 60 * 60 * 24)))}
                                        <span className="text-lg font-medium text-muted-foreground ml-2">{t('crossroads.daysLeft')}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">{t('crossroads.restAdvice')}</p>
                                </div>
                            )}

                            <p className="text-muted-foreground">
                                {t('crossroads.proceedQuestion')}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    size="lg"
                                    className="h-auto py-6 flex flex-col items-start space-y-2 border-2 border-primary hover:bg-primary/10 w-full"
                                    variant="outline"
                                    onClick={async () => {
                                        await updateDoc(doc(db, 'users', user.id), {
                                            benchDominationStatus: {
                                                post12WeekChoice: 'peak',
                                                completedWeeks: 12
                                            }
                                        });
                                    }}
                                >
                                    <span className="font-bold text-lg text-left whitespace-normal w-full">{t('crossroads.optionA.title')}</span>
                                    <span className="text-xs font-normal text-muted-foreground text-left whitespace-normal w-full">
                                        {t('crossroads.optionA.description')}
                                    </span>
                                </Button>

                                <Button
                                    size="lg"
                                    className="h-auto py-6 flex flex-col items-start space-y-2 border-2 border-red-500/50 hover:bg-red-500/10 w-full"
                                    variant="outline"
                                    onClick={async () => {
                                        await updateDoc(doc(db, 'users', user.id), {
                                            benchDominationStatus: {
                                                post12WeekChoice: 'test',
                                                completedWeeks: 12
                                            }
                                        });
                                    }}
                                >
                                    <span className="font-bold text-lg text-red-500 text-left whitespace-normal w-full">{t('crossroads.optionB.title')}</span>
                                    <span className="text-xs font-normal text-muted-foreground text-left whitespace-normal w-full">
                                        {t('crossroads.optionB.description')}
                                    </span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-baseline gap-2">
                            {weekBadge}
                        </div>
                        <div className="flex items-center border rounded-md">
                            <Button variant="ghost" size="icon" onClick={prevWeek} disabled={viewWeek <= 1} className="h-8 w-8">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <select
                                value={viewWeek}
                                onChange={(e) => setViewWeek(Number(e.target.value))}
                                className={`h-8 px-3 text-sm font-bold border-0 bg-background focus:outline-none focus:ring-0 cursor-pointer ${weekTitleColor} [&>option]:bg-background [&>option]:text-foreground`}
                            >
                                {Array.from({ length: currentProgram.weeks.length }, (_, i) => i + 1).map(week => {
                                    // Disable Week 14/15 if Testing selected
                                    let disabled = false;
                                    if (activePlanConfig.id === 'bench-domination' && user.benchDominationStatus?.post12WeekChoice === 'test') {
                                        if (week > 13) disabled = true;
                                    }
                                    if (disabled) return null; // Or render disabled option, but removing seems cleaner to avoid confusion

                                    return (
                                        <option key={week} value={week}>{t('common.week')} {week}</option>
                                    );
                                })}
                            </select>
                            <Button variant="ghost" size="icon" onClick={nextWeek} disabled={viewWeek >= currentProgram.weeks.length || (activePlanConfig.id === 'bench-domination' && user.benchDominationStatus?.post12WeekChoice === 'test' && viewWeek >= 13)} className="h-8 w-8">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {weekData?.days.sort((a, b) => a.dayOfWeek - b.dayOfWeek).map((rawDay) => {
                        let day = rawDay;
                        if (activePlanConfig.hooks?.preprocessDay) {
                            day = activePlanConfig.hooks.preprocessDay(rawDay, user);
                        }

                        const isDone = completedSet.has(`${viewWeek}-${day.dayOfWeek}`);
                        let displayDayName = day.dayName;
                        if (day.dayName.startsWith('t:')) {
                            const raw = day.dayName.substring(2);
                            const sepIndex = raw.indexOf('|');
                            if (sepIndex !== -1) {
                                const key = raw.substring(0, sepIndex);
                                try {
                                    const params = JSON.parse(raw.substring(sepIndex + 1));
                                    displayDayName = t(key, params);
                                } catch (e) {
                                    displayDayName = t(key);
                                }
                            } else {
                                displayDayName = t(raw);
                            }
                        }
                        const subTitle = t('workout.exercisesCount', { count: day.exercises.length });

                        return (
                            <Link key={day.dayOfWeek} to={`/app/workout/${viewWeek}/${day.dayOfWeek}`}>
                                <Card className={`h-full transition-colors ${isDone ? (isPainGlory ? 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10' : 'border-green-500/50 bg-green-500/5 hover:bg-green-500/10') : 'hover:border-primary/50'}`}>
                                    <CardHeader className="p-4">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-base truncate pr-2" title={displayDayName}>{displayDayName}</CardTitle>
                                            {isDone && <CheckCircleIcon className={`h-5 w-5 flex-shrink-0 ${isPainGlory ? 'text-red-500' : 'text-green-500'}`} />}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 truncate" title={subTitle}>{subTitle}</p>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <ul className="text-sm space-y-1 text-muted-foreground">
                                            {day.exercises.slice(0, 3).map(ex => (
                                                <li key={ex.id} className="truncate">• {ex.name}</li>
                                            ))}
                                            {day.exercises.length > 3 && <li className="text-xs opacity-70">{t('workout.andMore', { count: day.exercises.length - 3 })}</li>}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div >
    );
};

const CheckCircleIcon = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)
