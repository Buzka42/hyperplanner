
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { useLanguage, resolveTemplate } from '../contexts/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trophy, Calendar, ChevronLeft, ChevronRight, Skull, Activity, ShieldCheck, Dumbbell, History } from 'lucide-react';
import { BADGES } from '../data/badges';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AccessoryChoiceModal } from '../components/AccessoryChoiceModal';
import { AdventureDashboard } from './AdventureDashboard';
import { ADVENTURE_PLAN_ID } from '../data/adventure';
import { cn } from '../lib/utils';
import { trackedLiftFor } from '../features/dashboard/trackedLift';
import { canStartRotationSession } from '../features/workout/engines';
import { HouseDashboard } from '../features/houseOfIron/HouseDashboard';
import { ApexDashboard } from '../features/apexPredator/ApexDashboard';
import { VenusDashboard } from '../features/venusRising/VenusDashboard';
import { AthenaDashboard } from '../features/athena/AthenaDashboard';
import { FollowUps } from '../features/portfolio/FollowUps';
import { ORDERED_PLAN_META } from '../data/planMeta';
import { KaliDashboard } from '../features/kali/KaliDashboard';
import { NeuralDashboard } from '../features/neuralOverload/NeuralDashboard';
import { PlanMechanics } from '../features/dashboard/PlanMechanics';
import { QUADFATHER_DAYS } from '../data/plans/quadfather';
import { roleBalance } from '../features/quadfather/roles';
import { CATHEDRAL_DAYS } from '../data/plans/cathedral';
import { archBalance } from '../features/cathedral/arches';

export const Dashboard: React.FC = () => {
    const { user, activePlanConfig, updateUserProfile, exerciseResolver } = useUser();
    const { t, tArray, tObject } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
    const [sessionDates, setSessionDates] = useState<string[]>([]);
    const [lastW12Date, setLastW12Date] = useState<Date | null>(null);
    const [maxDeficitPushupReps, setMaxDeficitPushupReps] = useState<number>(0);
    const [weeklySets, setWeeklySets] = useState<number>(0);

    const [completionType, setCompletionType] = useState<'skeleton' | 'pencilneck' | null>(null);
    const [showNextSteps, setShowNextSteps] = useState(false);
    const [gluteInput, setGluteInput] = useState("");
    const [armInput, setArmInput] = useState("");
    const isPeachy = activePlanConfig.id === 'peachy-glute-plan';
    const isPainGlory = activePlanConfig.id === 'pain-and-glory';
    const isTrinary = activePlanConfig.id === 'trinary';
    const isSuperMutant = activePlanConfig.id === 'super-mutant';
    const isAdventure = activePlanConfig.id === ADVENTURE_PLAN_ID;
    const isHouseOfIron = activePlanConfig.id === 'house-of-iron';
    const isApexPredator = activePlanConfig.id === 'apex-predator';
    const isVenusRising = activePlanConfig.id === 'venus-rising';
    const isAthena = activePlanConfig.id === 'athena';
    const isKali = activePlanConfig.id === 'kali';
    const isNeural = activePlanConfig.id === 'neural-overload';
    const [gloryCounter, setGloryCounter] = useState<number>(0);
    const [showAccessoryModal, setShowAccessoryModal] = useState(false);

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

    const persistedPlanId = useRef(user?.programId);
    const weekHydrated = useRef(false);
    const weekStorageKey = user ? `dashboardViewWeek-${user.id}-${user.programId}` : '';

    useEffect(() => {
        if (!user) return;

        const savedViewWeek = localStorage.getItem(weekStorageKey);

        const fetchStatus = async () => {
            try {
                const workoutsRef = collection(db, 'users', user.id, 'workouts');
                const q = query(workoutsRef);
                const snapshot = await getDocs(q);

                const completedKeys = new Set<string>();
                const dates: string[] = [];
                let maxCompletedWeek = 0;
                let logsForWeek: Record<number, number> = {};
                let week12FinishDate: Date | null = null;

                let localMaxDeficitPushupReps = 0;
                // Plans with no single headline lift show the work they did
                // instead. Completed sets only — a logged-but-unfinished set is
                // not work done.
                const weekAgo = Date.now() - 7 * 86400e3;
                let setsThisWeek = 0;

                snapshot.docs.forEach(doc => {
                    const d = doc.data();
                    const isMatch = d.programId === user.programId || (!d.programId && user.programId === 'bench-domination');
                    if (!isMatch) return;

                    const activeStartDate = user.programProgress?.[user.programId]?.startDate || user.startDate;
                    if (activeStartDate && new Date(d.date) < new Date(activeStartDate)) return;

                    const key = `${d.week}-${d.day}`;
                    completedKeys.add(key);
                    if (typeof d.date === 'string') dates.push(d.date);

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

                    if (typeof d.date === 'string' && new Date(d.date).getTime() >= weekAgo) {
                        for (const ex of d.exercises ?? []) {
                            for (const set of ex.setsData ?? []) if (set?.completed) setsThisWeek++;
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
                setSessionDates(dates);
                setMaxDeficitPushupReps(localMaxDeficitPushupReps);
                setWeeklySets(setsThisWeek);

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
                weekHydrated.current = true;

            } catch (e) {
                console.error("Dashboard fetch error", e);
            }
        };

        fetchStatus();
    }, [user, currentProgram, activePlanConfig.id, weekStorageKey]);

    useEffect(() => {
        if (!user || !viewWeek || !weekStorageKey) return;
        if (persistedPlanId.current !== user.programId) {
            persistedPlanId.current = user.programId;
            weekHydrated.current = false;
            return;
        }
        if (!weekHydrated.current) return;
        localStorage.setItem(weekStorageKey, viewWeek.toString());
    }, [viewWeek, user, weekStorageKey]);

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
    if (isAdventure) return <AdventureDashboard />;
    if (isHouseOfIron) return <HouseDashboard user={user} />;
    if (isApexPredator) return <ApexDashboard user={user} />;
    if (isVenusRising) return <VenusDashboard user={user} />;
    if (isAthena) return <AthenaDashboard user={user} />;
    if (isKali) return <KaliDashboard user={user} />;
    if (isNeural) return <NeuralDashboard user={user} />;

    const weekData = currentProgram.weeks.find(w => w.weekNumber === viewWeek);

    const tracked = trackedLiftFor(activePlanConfig.id, user);
    const strengthHistory = tracked?.history;
    const strengthChartTitle = tracked?.title;
    const initialStat = tracked?.startKg;

    const data = strengthHistory?.map((entry: any) => ({
        date: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        weight: entry.weight
    })) || [];
    if (data.length === 0 && activeWidgets.includes('strength_chart') && tracked && initialStat) {
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
        if (viewWeek === 9) {
            // Week 9: Mandatory Deload
            weekTitleColor = "text-blue-500";
            weekBadge = <div className="flex items-center text-blue-500 text-sm font-bold ml-2"><ShieldCheck className="w-4 h-4 mr-1" /> {t('dashboard.mandatoryDeload')}</div>;
        } else if (viewWeek >= 14) {
            // Weeks 14-16: Peaking/Testing
            weekTitleColor = "text-red-600";
            weekBadge = <div className="flex items-center text-red-600 text-sm font-bold ml-2"><Skull className="w-4 h-4 mr-1" /> {t('dashboard.peakingBlock')}</div>;
        }
    }

    const dashboardDays = weekData?.days.map(day => activePlanConfig.hooks?.preprocessDay ? activePlanConfig.hooks.preprocessDay(day, user) : day) || [];
    const autoDeckDays = dashboardDays.filter(day => day.exercises.length > 0 && !day.exercises.every(exercise => exercise.optional));
    const nextTrainingDay = autoDeckDays
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
        .find(day => !completedSet.has(`${viewWeek}-${day.dayOfWeek}`)) || autoDeckDays[0];
    const nextDayName = nextTrainingDay?.dayName.startsWith('t:')
        ? resolveTemplate(nextTrainingDay.dayName, t)
        : nextTrainingDay?.dayName;
    const rotationGate = activePlanConfig.session?.kind === 'rotation' && activePlanConfig.session.rotation
        ? canStartRotationSession(activePlanConfig.session.rotation, sessionDates)
        : { allowed: true as const };
    const nuclearDay = dashboardDays.find(day => day.dayName.includes('Go Nuclear'));
    const redlineBlocked = activePlanConfig.id === 'redline' && !user.redlineStatus?.nextRecovery?.confirmed;

    /**
     * The greeting's copy varies by program; its structure and styling do not.
     *
     * `mark` is the one place a program may contribute an image — Peachy's frog
     * and peach are copy in the same sense the plan artwork is, not icons
     * standing in for controls, which is what PRODUCT.md actually bans.
     */
    const greeting: { title: React.ReactNode; tagline?: string; mark?: React.ReactNode } = (() => {
        if (isPeachy) {
            return viewWeek <= 4
                ? {
                    title: <>{t('dashboard.feelingFroggy')} {t('dashboard.froggyStatus')}</>,
                    mark: <img src="/frog.png" alt="" aria-hidden="true" className="dashboard-greeting-mark" />,
                }
                : {
                    title: <>{t('dashboard.feelingPeachy')} {t('dashboard.peachyStatus')}</>,
                    mark: <span className="dashboard-greeting-mark is-glyph" role="img" aria-label="Peach">🍑</span>,
                };
        }
        if (isPainGlory) return { title: t('dashboard.painGloryTagline') };
        if (isTrinary) return { title: t('dashboard.trinary.title'), tagline: t('dashboard.trinary.tagline') };
        if (activePlanConfig.id === 'ritual-of-strength') return { title: t('tips.ritualDashboardTagline') };
        if (isSuperMutant) return { title: activePlanConfig.program.name, tagline: t('dashboard.superMutant.tagline') };

        const lead = activePlanConfig.id === 'pencilneck-eradication' ? t('dashboard.eradicateThe')
            : activePlanConfig.id === 'skeleton-to-threat' ? t('dashboard.becomeA')
                : t('dashboard.timeTo');
        const target = activePlanConfig.id === 'pencilneck-eradication' ? t('dashboard.weakness')
            : activePlanConfig.id === 'skeleton-to-threat' ? t('dashboard.threat')
                : t('dashboard.dominate');
        return { title: <>{lead} {target}</> };
    })();

    /**
     * A plan counts as finished when its own weeks are all behind the athlete.
     * Follow-ups are offered only then — never as a mid-plan nudge.
     */
    const planCompleted = viewWeek > (activePlanConfig.program.weeks.length || Infinity);

    return (
        <div className="instrument-page space-y-8 relative">
            <FollowUps
                planId={activePlanConfig.id}
                completed={planCompleted}
                availablePlanIds={user.allowedPlanIds}
                daysPerWeek={user.selectedDays?.length}
                planName={planId => {
                    const meta = ORDERED_PLAN_META.find(item => item.id === planId);
                    const copy = meta ? tObject(`onboarding.programs.${meta.i18nKey}`) : undefined;
                    return (copy as { name?: string })?.name ?? planId;
                }}
            />
            {completionType && (() => {
                const badgeId = completionType === 'skeleton' ? 'certified_threat' : 'certified_boulder';
                const badge = BADGES.find(b => b.id === badgeId);
                const badgeImage = badge?.image;

                return (
                    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white p-4 animate-in fade-in duration-1000">
                        <Trophy className="h-20 w-20 mb-8 text-primary" />
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
                    <Button size="lg" className="font-bold text-xl px-12 py-8" onClick={() => { setShowNextSteps(false); setCompletionType(null); }}>
                        {t('common.close')}
                    </Button>
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

            {!isTrinary && !isSuperMutant && nextTrainingDay && (
                <section className="dashboard-command" aria-label="Next workout">
                    <p className="dashboard-command-label">{t('dashboard.nextSession')}</p>
                    <h1>{nextDayName}</h1>
                    {/* Only real data. The plan sketched an "Est. time" row;
                        nothing in the app measures session duration, and a
                        number that lies is worse than a row that isn't there. */}
                    <dl className="spec-rows">
                        <div>
                            <dt>{t('common.week')}</dt>
                            <dd className="tabular-nums">{viewWeek}</dd>
                        </div>
                        <div>
                            <dt>{t('common.exercises')}</dt>
                            <dd className="tabular-nums">{nextTrainingDay.exercises.length}</dd>
                        </div>
                        <div>
                            <dt>{t('dashboard.movements')}</dt>
                            <dd>{nextTrainingDay.exercises.slice(0, 4).map(e => e.name).join(' · ')}</dd>
                        </div>
                    </dl>
                    <Button size="lg" className="dashboard-start" disabled={!rotationGate.allowed || redlineBlocked} onClick={() => navigate(`/app/workout/${viewWeek}/${nextTrainingDay.dayOfWeek}`)}>
                        <Dumbbell className="h-5 w-5" />
                        <span>{t('dashboard.trinary.startWorkout')}</span>
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                    {!rotationGate.allowed && 'reason' in rotationGate && (
                        <p className="text-sm text-muted-foreground">{rotationGate.reason}</p>
                    )}
                    {redlineBlocked && (
                        <p className="text-sm text-muted-foreground">Confirm recovery below before starting.</p>
                    )}
                    {nuclearDay && (
                        <Button
                            variant="outline"
                            className="mt-3"
                            disabled={!rotationGate.allowed}
                            onClick={() => navigate(`/app/workout/${viewWeek}/${nuclearDay.dayOfWeek}`, { state: { nuclearAckRequired: true } })}
                        >
                            Go Nuclear
                        </Button>
                    )}
                </section>
            )}

            {/* One structure, program copy.
                This block used to be six forks — Peachy, Pain & Glory, Trinary,
                Ritual, Super Mutant and the default — each hardcoding its own
                button colours. PRODUCT.md bans per-page style forks; it does not
                ban per-program copy, which is where flavor belongs. */}
            <header className="dashboard-greeting">
                <div className="dashboard-greeting-copy">
                    {user.pencilneckStatus && user.pencilneckStatus.cycle > 1 && (
                        <p className="dashboard-cycle">
                            <strong>{t('dashboard.cycleTitle', { cycle: user.pencilneckStatus.cycle })}</strong>
                            <span>{t('dashboard.cycleDescription')}</span>
                        </p>
                    )}
                    <h2>{greeting.title}</h2>
                    {greeting.tagline && <p className="dashboard-greeting-tagline">{greeting.tagline}</p>}
                </div>
                {greeting.mark}
                {activeWidgets.includes('workout_history') && (
                    <Link to="/app/history" className="dashboard-history-link">
                        <History className="h-4 w-4" aria-hidden="true" />
                        <span>{t('sidebar.history')}</span>
                    </Link>
                )}
            </header>

            {/* Dashboard Widgets (hide for Trinary) */}
            {!isTrinary && (
                <div className={`dashboard-telemetry grid gap-3 ${activeWidgets.includes('strength_chart') && tracked ? 'md:grid-cols-7' : 'grid-cols-1'}`}>
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
                                                    <Line type="monotone" dataKey="sizeCm" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {activeWidgets.includes('arm_tracker') && (
                        <Card className="col-span-3 border-primary/20 bg-primary/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center justify-between">
                                    <span>Arm tape</span>
                                    <Activity className="w-4 h-4 text-primary" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2 items-end">
                                    <div className="grid gap-1.5 flex-1">
                                        <label className="text-xs font-medium text-muted-foreground">Circumference (cm)</label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 38"
                                            value={armInput}
                                            onChange={(e) => setArmInput(e.target.value)}
                                            className="h-8"
                                        />
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={async () => {
                                            if (!armInput) return;
                                            const newVal = parseFloat(armInput);
                                            const newHistory = [...(user.armMeasurements || []), { date: new Date().toISOString(), sizeCm: newVal }];
                                            await updateUserProfile({ armMeasurements: newHistory });
                                            setArmInput("");
                                        }}
                                    >
                                        {t('common.log')}
                                    </Button>
                                </div>
                                {user.armMeasurements && user.armMeasurements.length > 0 && (
                                    <div className="mt-4">
                                        <div className="text-xs text-muted-foreground mb-1">{t('dashboard.cards.latestGrowthTrend')}</div>
                                        <div className="h-[60px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={user.armMeasurements.slice(-5)}>
                                                    <YAxis domain={['dataMin', 'auto']} hide />
                                                    <Line type="monotone" dataKey="sizeCm" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {false && activeWidgets.includes('program_status') && (
                        <Card className="col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t('dashboard.cards.programStatus')}</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {t('common.week')} {viewWeek}
                                </div>
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

                    {activeWidgets.includes('weekly_sets') && (
                        <Card className="col-span-3">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{t('dashboard.cards.weeklySets')}</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{weeklySets}</div>
                                <p className="text-xs text-muted-foreground">{t('dashboard.cards.weeklySetsDesc')}</p>
                            </CardContent>
                        </Card>
                    )}

                    {activeWidgets.includes('strength_chart') && tracked && (
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
                                                fill="none"
                                                dot={(props: { index?: number; cx?: number; cy?: number }) =>
                                                    props.index === data.length - 1
                                                        ? <circle cx={props.cx} cy={props.cy} r={3} fill="hsl(var(--primary))" />
                                                        : <g />
                                                }
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {(activePlanConfig.id === 'workhorse' || activePlanConfig.id === 'gravity-is-optional') && (() => {
                        const bw = user.stats.bodyweightKg ?? 0;
                        const belt = user.workingLoads?.[activePlanConfig.id]?.['weighted-chin-up']
                            ?? user.workingLoads?.[activePlanConfig.id]?.['weighted-dip']
                            ?? 0;
                        const logged = user.liftHistory?.chinBelt?.at(-1)?.weight;
                        const tsw = logged ?? (bw ? bw + belt : 0);
                        return (
                        <Card className="col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">TSW</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{bw ? `${tsw} kg` : 'Log bodyweight'}</div>
                                <p className="text-xs text-muted-foreground">Belt load + bodyweight on chins and dips.</p>
                            </CardContent>
                        </Card>
                        );
                    })()}

                    {user && (
                        <PlanMechanics
                            user={user}
                            planId={activePlanConfig.id}
                            week={viewWeek}
                            nextDay={nextTrainingDay}
                            days={dashboardDays}
                            exerciseResolver={exerciseResolver}
                            updateUserProfile={updateUserProfile}
                        />
                    )}

                    {activePlanConfig.id === 'quadfather' && (() => {
                        const balance = user.quadfatherStatus?.roleBalance ?? roleBalance(QUADFATHER_DAYS.flatMap(day => day.slots.map(slot => slot.ex)));
                        return (
                        <Card className="col-span-2 md:col-span-3">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Load / Depth / Burn</CardTitle></CardHeader>
                            <CardContent>
                                <dl className="grid grid-cols-3 gap-3 text-center">
                                    {(['load', 'depth', 'burn'] as const).map(role => (
                                        <div key={role}>
                                            <dt className="text-xs uppercase tracking-widest text-muted-foreground">{role}</dt>
                                            <dd className="text-2xl font-bold">{balance[role]}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </CardContent>
                        </Card>
                        );
                    })()}

                    {activePlanConfig.id === 'cathedral' && (() => {
                        const setsById: Record<string, number> = {};
                        for (const day of CATHEDRAL_DAYS) for (const slot of day.slots) setsById[slot.ex] = (setsById[slot.ex] ?? 0) + slot.sets;
                        const balance = user.cathedralStatus?.arches ?? archBalance(CATHEDRAL_DAYS.flatMap(day => day.slots.map(slot => slot.ex)), setsById, user.cathedralStatus?.comboMachineRole);
                        return (
                        <Card className="col-span-2 md:col-span-3">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Press / Stretch / Adduction</CardTitle></CardHeader>
                            <CardContent>
                                <dl className="grid grid-cols-3 gap-3 text-center">
                                    {(['press', 'stretch', 'adduction'] as const).map(arch => (
                                        <div key={arch}>
                                            <dt className="text-xs uppercase tracking-widest text-muted-foreground">{arch}</dt>
                                            <dd className="text-2xl font-bold">{balance[arch]}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </CardContent>
                        </Card>
                        );
                    })()}

                    {activePlanConfig.id === 'lazarus' && (
                        <Card className="col-span-3">
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Predicted vs logged</CardTitle></CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                {Object.entries(user.lazarusStatus?.memoryCurve ?? {}).slice(0, 6).map(([id, memory]) => {
                                    const predicted = memory.preBreakKg && user.lazarusStatus?.breakMonths
                                        ? Math.round((memory.preBreakKg * (user.lazarusStatus.breakMonths < 3 ? 0.9 : user.lazarusStatus.breakMonths < 6 ? 0.8 : user.lazarusStatus.breakMonths < 12 ? 0.7 : 0.6)) / 2.5) * 2.5
                                        : undefined;
                                    const logged = user.workingLoads?.lazarus?.[id];
                                    return (
                                        <div key={id} className="flex justify-between gap-3 border-b border-border py-1">
                                            <span className="text-muted-foreground">{id}</span>
                                            <span>{predicted ? `${predicted} kg pred` : '—'} · {logged ? `${logged} kg logged` : '—'}</span>
                                        </div>
                                    );
                                })}
                                {!Object.keys(user.lazarusStatus?.memoryCurve ?? {}).length && (
                                    <p className="text-muted-foreground">No memory-curve loads yet — first sessions calibrate.</p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Glory Counter widget for Pain & Glory */}
                    {isPainGlory && (
                        <Card className="col-span-full md:col-span-4 border-red-900/30 bg-card">
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
                                        className="h-full bg-card transition-all duration-1000"
                                        style={{ width: `${Math.min(100, (gloryCounter / 50000) * 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-right text-amber-500/70 mt-1">
                                    {Math.round((gloryCounter / 50000) * 100)}% to 50,000 kg milestone
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        type="button"
                                        variant={(user as { painGloryStatus?: { speedScheme?: string } }).painGloryStatus?.speedScheme === 'low-fatigue' ? 'secondary' : 'default'}
                                        size="sm"
                                        onClick={() => updateDoc(doc(db, 'users', user.id), { 'painGloryStatus.speedScheme': 'classic' })}
                                    >
                                        Speed 10×6
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={(user as { painGloryStatus?: { speedScheme?: string } }).painGloryStatus?.speedScheme === 'low-fatigue' ? 'default' : 'secondary'}
                                        size="sm"
                                        onClick={() => updateDoc(doc(db, 'users', user.id), { 'painGloryStatus.speedScheme': 'low-fatigue' })}
                                    >
                                        Low-fatigue 8×3
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Strength Altar widget for Ritual of Strength */}
                    {activeWidgets.includes('strength_altar') && activePlanConfig.id === 'ritual-of-strength' && (
                        <Card className="col-span-full md:col-span-4 border-red-900/30 bg-card relative overflow-hidden">
                            {/* Flame shimmer background effect */}
                            <div className="absolute inset-0 bg-card pointer-events-none" />

                            <CardHeader className="pb-2 relative z-10">
                                <CardTitle className="text-xl font-black flex items-center justify-center gap-3 text-red-500 uppercase tracking-widest">
                                    STRENGTH ALTAR
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="grid grid-cols-3 gap-6 px-4">
                                    {/* Bench Press Candle */}
                                    <div className="flex flex-col items-center">
                                        <div className="text-sm text-orange-400 mb-6 font-black uppercase tracking-widest">
                                            BENCH
                                        </div>
                                        <div className="relative w-16">
                                            {/* Flame effect on top */}
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl">
                                                <Activity className="h-5 w-5" />
                                            </div>
                                            {/* Candle body */}
                                            <div className="bg-card h-40 flex items-center justify-center rounded-t-sm border-2 border-red-700/50 shadow-lg shadow-red-900/50">
                                                <div className="text-2xl font-black text-red-50 drop-shadow-[0_0_8px_rgba(255,100,100,0.8)]">
                                                    {((user as any)?.ritualStatus?.benchPress1RM || 0)}
                                                </div>
                                            </div>
                                            {/* Candle base */}
                                            <div className="bg-red-950 h-3 border-x-2 border-b-2 border-red-800/50"></div>
                                        </div>
                                    </div>

                                    {/* Squat Candle */}
                                    <div className="flex flex-col items-center">
                                        <div className="text-sm text-orange-400 mb-6 font-black uppercase tracking-widest">
                                            SQUAT
                                        </div>
                                        <div className="relative w-16">
                                            {/* Flame effect on top */}
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl">
                                                <Activity className="h-5 w-5" />
                                            </div>
                                            {/* Candle body */}
                                            <div className="bg-card h-40 flex items-center justify-center rounded-t-sm border-2 border-red-700/50 shadow-lg shadow-red-900/50">
                                                <div className="text-2xl font-black text-red-50 drop-shadow-[0_0_8px_rgba(255,100,100,0.8)]">
                                                    {((user as any)?.ritualStatus?.squat1RM || 0)}
                                                </div>
                                            </div>
                                            {/* Candle base */}
                                            <div className="bg-red-950 h-3 border-x-2 border-b-2 border-red-800/50"></div>
                                        </div>
                                    </div>

                                    {/* Deadlift Candle */}
                                    <div className="flex flex-col items-center">
                                        <div className="text-sm text-orange-400 mb-6 font-black uppercase tracking-widest">
                                            DEAD
                                        </div>
                                        <div className="relative w-16">
                                            {/* Flame effect on top */}
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl">
                                                <Activity className="h-5 w-5" />
                                            </div>
                                            {/* Candle body */}
                                            <div className="bg-card h-40 flex items-center justify-center rounded-t-sm border-2 border-red-700/50 shadow-lg shadow-red-900/50">
                                                <div className="text-2xl font-black text-red-50 drop-shadow-[0_0_8px_rgba(255,100,100,0.8)]">
                                                    {((user as any)?.ritualStatus?.deadlift1RM || 0)}
                                                </div>
                                            </div>
                                            {/* Candle base */}
                                            <div className="bg-red-950 h-3 border-x-2 border-b-2 border-red-800/50"></div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-center text-red-400/70 mt-6 italic font-serif">
                                    "The three pillars of iron — your ascension to power"
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Trinary Widgets */}
                    {isTrinary && (
                        <>
                            {/* Schedule Tip Card */}
                            <Card className="col-span-full md:col-span-4 border-border bg-secondary">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {t('dashboard.trinary.scheduleTip')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground">
                                        {t('dashboard.trinary.scheduleAdvice')}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Workout Progress Card */}
                            <Card className="col-span-full md:col-span-3 border-border bg-secondary">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {t('dashboard.trinary.progressTitle')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-muted-foreground">
                                        {((user as any)?.trinaryStatus?.completedWorkouts || 0)} <span className="text-lg font-normal text-muted-foreground">/ 27</span>
                                    </div>
                                    <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-card transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (((user as any)?.trinaryStatus?.completedWorkouts || 0) / 27) * 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-right text-muted-foreground mt-1">
                                        {t('dashboard.trinary.block')} {Math.ceil((((user as any)?.trinaryStatus?.completedWorkouts || 0) + 1) / 3)} / 9
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Next Workout Button */}
                            <Card className="col-span-full border-border bg-card">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-muted-foreground">
                                            {t('dashboard.trinary.nextWorkout', { num: ((user as any)?.trinaryStatus?.completedWorkouts || 0) + 1 })}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {t('dashboard.trinary.readyWhenYouAre')}
                                        </p>
                                    </div>
                                    <Link to={`/app/workout/${Math.ceil((((user as any)?.trinaryStatus?.completedWorkouts || 0) + 1) / 3)}/${((((user as any)?.trinaryStatus?.completedWorkouts || 0)) % 3) + 1}`}>
                                        <Button size="lg" className="bg-secondary hover:bg-secondary text-muted-foreground">
                                            <Dumbbell className="mr-2 h-5 w-5" />
                                            {t('dashboard.trinary.startWorkout')}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Super Mutant Widgets */}
                    {isSuperMutant && (
                        <>
                            {/* Recovery Gauge - Cooldown Status */}
                            <Card className="col-span-full md:col-span-4 border-green-800/30 bg-card">
                                <CardHeader className="pb-2">
                                    <CardTitle className="mutant-text text-lg font-black flex items-center gap-2">
                                        RECOVERY GAUGE
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {(() => {
                                            const muscleGroups = ['chest', 'back', 'shoulders', 'triceps', 'biceps', 'calves', 'hamstrings', 'glutes', 'lowerBack', 'quads', 'abductors', 'abs'];
                                            const groupLabels: Record<string, string> = {
                                                chest: 'Chest',
                                                back: 'Back',
                                                shoulders: 'Delts',
                                                triceps: 'Triceps',
                                                biceps: 'Biceps',
                                                calves: 'Calves',
                                                hamstrings: 'Hams',
                                                glutes: 'Glutes',
                                                lowerBack: 'L.Back',
                                                quads: 'Quads',
                                                abductors: 'Abd',
                                                abs: 'Abs'
                                            };
                                            const lowerBodyGroups = ['hamstrings', 'glutes', 'lowerBack', 'quads', 'abductors', 'abs'];
                                            const now = Date.now();

                                            return muscleGroups.map(group => {
                                                const lastTrained = (user.superMutantStatus?.muscleGroupTimestamps as any)?.[group];
                                                const cooldownHours = lowerBodyGroups.includes(group) ? 72 : 48;
                                                const cooldownMs = cooldownHours * 60 * 60 * 1000;
                                                const graceHours = 10;
                                                const graceMs = graceHours * 60 * 60 * 1000;

                                                let status = 'ready';
                                                let timeRemaining = '';
                                                let bgColor = 'bg-green-900/40 border-green-600/50';
                                                let textColor = 'text-green-300';

                                                if (lastTrained) {
                                                    const elapsed = now - lastTrained;
                                                    const remaining = cooldownMs - elapsed;

                                                    if (remaining > graceMs) {
                                                        // Still in cooldown, more than 10h left
                                                        status = 'cooldown';
                                                        const hoursLeft = Math.ceil(remaining / (60 * 60 * 1000));
                                                        timeRemaining = `${hoursLeft}h`;

                                                        if (hoursLeft > cooldownHours / 2) {
                                                            bgColor = 'bg-red-900/40 border-red-600/50';
                                                            textColor = 'text-red-300';
                                                        } else {
                                                            bgColor = 'bg-orange-900/40 border-orange-600/50';
                                                            textColor = 'text-orange-300';
                                                        }
                                                    } else if (remaining > 0) {
                                                        // Nearly ready (within 10h grace period)
                                                        status = 'nearly-ready';
                                                        const hoursLeft = Math.ceil(remaining / (60 * 60 * 1000));
                                                        timeRemaining = `~${hoursLeft}h`;
                                                        bgColor = 'bg-card border-yellow-600/50';
                                                        textColor = 'text-yellow-300';
                                                    }
                                                }

                                                const volume = (user.superMutantStatus?.rolling7DayVolume as any)?.[group] || 0;

                                                return (
                                                    <div
                                                        key={group}
                                                        className={`${bgColor} border rounded px-2 py-1.5 text-center transition-all`}
                                                    >
                                                        <div className={`text-xs font-bold ${textColor}`}>
                                                            {groupLabels[group]}
                                                        </div>
                                                        <div className="text-[10px] text-green-400/60">
                                                            {status === 'ready' ? 'READY' : status === 'nearly-ready' ? 'SOON' : timeRemaining}
                                                        </div>
                                                        <div className="text-[9px] text-green-300/40 mt-0.5">
                                                            {volume} sets/7d
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                    <p className="text-xs text-green-400/50 mt-3 italic text-center">
                                        {t('dashboard.superMutant.recoveryInfo')}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Mutant Mindset removed — recovery gauge is the product. */}

                            {/* Mutagen Exposure - program progress */}
                            {(() => {
                                const done = user.superMutantStatus?.completedWorkouts || 0;
                                const total = 84;
                                const pct = Math.min(100, (done / total) * 100);
                                return (
                                    <Card className="col-span-full md:col-span-3 border-green-800/30 bg-card">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="mutant-text text-lg font-black">MUTAGEN EXPOSURE</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-3xl font-black text-green-300">
                                                {done} <span className="text-lg font-normal text-muted-foreground">/ {total} {t('dashboard.superMutant.workouts')}</span>
                                            </div>
                                            <div className="mt-4 h-2 bg-green-950/60 rounded-full overflow-hidden">
                                                <div className="h-full bg-card transition-all duration-1000" style={{ width: `${pct}%` }} />
                                            </div>
                                            <p className="text-xs text-right text-green-400/60 mt-1">{Math.round(pct)}%</p>
                                        </CardContent>
                                    </Card>
                                );
                            })()}

                            {/* Next Workout Button / Completion / Over-mutation warning */}
                            <Card className="col-span-full border-green-700/50 bg-card mutant-glow">
                                <CardContent className="p-6">
                                    {(() => {
                                        const workoutNum = user.superMutantStatus?.completedWorkouts || 0;
                                        const weekNum = Math.floor(workoutNum / 6) + 1;
                                        const dayNum = (workoutNum % 6) + 1;

                                        // Weekly session cap: >=6 sessions in the rolling 7 days
                                        const weekAgo = new Date();
                                        weekAgo.setDate(weekAgo.getDate() - 7);
                                        const recentSessions = (user.superMutantStatus?.weeklySessionDates || []).filter((d: string) => new Date(d) >= weekAgo).length;
                                        const overMutation = recentSessions >= 6;

                                        // Program complete: re-run offer
                                        if (workoutNum >= 84) {
                                            return (
                                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold mutant-text">{t('dashboard.superMutant.completeTitle')}</h3>
                                                        <p className="text-sm radiation-text">{t('dashboard.superMutant.completeDesc')}</p>
                                                    </div>
                                                    <Button
                                                        size="lg"
                                                        className="bg-orange-700 hover:bg-orange-600 text-orange-50 font-black"
                                                        onClick={async () => {
                                                            if (!confirm(t('dashboard.superMutant.rerunConfirm'))) return;
                                                            await updateDoc(doc(db, 'users', user.id), {
                                                                'superMutantStatus.completedWorkouts': 0,
                                                                'superMutantStatus.currentCycle': 1,
                                                                'superMutantStatus.muscleGroupTimestamps': {},
                                                                'superMutantStatus.rolling7DayVolume': Object.fromEntries(['chest', 'back', 'shoulders', 'triceps', 'biceps', 'calves', 'hamstrings', 'glutes', 'lowerBack', 'quads', 'abductors', 'abs'].map(m => [m, 0])),
                                                                'superMutantStatus.weeklySessionDates': []
                                                            });
                                                        }}
                                                    >
                                                        {t('dashboard.superMutant.rerunButton')}
                                                    </Button>
                                                </div>
                                            );
                                        }

                                        return (
                                            <>
                                                {overMutation && (
                                                    <div className="mb-4 p-3 rounded border border-orange-600/60 bg-orange-950/40 text-orange-300 text-sm font-bold">
                                                        {t('dashboard.superMutant.overMutationWarning', { count: recentSessions })}
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-bold mutant-text">
                                                            {t('dashboard.superMutant.nextSession')}
                                                        </h3>
                                                        <p className="text-sm radiation-text">
                                                            {t('dashboard.superMutant.dynamicWorkout')}
                                                        </p>
                                                    </div>
                                                    <Link to={overMutation ? '#' : `/app/workout/${weekNum}/${dayNum}`} aria-disabled={overMutation}>
                                                        <Button disabled={overMutation} size="lg" className="bg-green-700 hover:bg-green-600 text-green-50 font-black">
                                                            <Dumbbell className="mr-2 h-5 w-5" />
                                                            INITIATE
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                        </>
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
                        <Card className="col-span-full border-yellow-500 bg-yellow-500/5">
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
            )}

            {/* Trinary-specific Dashboard - Single Workout View */}
            {isTrinary && (() => {
                const trinaryStatus = (user as any)?.trinaryStatus;
                const completedWorkouts = trinaryStatus?.completedWorkouts || 0;
                const currentWorkout = completedWorkouts + 1;
                const currentBlock = Math.ceil(currentWorkout / 3);
                const workoutPositionInBlock = ((currentWorkout - 1) % 3) + 1;

                return (
                    <div className="space-y-6">
                        {/* Schedule Tip */}
                        <Card className="border-border bg-secondary">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm text-muted-foreground">{t('dashboard.trinary.scheduleTip')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{t('dashboard.trinary.scheduleAdvice')}</p>
                            </CardContent>
                        </Card>

                        {/* Current Workout Card */}
                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-2xl text-muted-foreground flex items-center justify-between">
                                    <span>{t('dashboard.trinary.nextWorkout', { num: currentWorkout })}</span>
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {t('dashboard.trinary.block')} {currentBlock}/9
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-muted-foreground">
                                        {t('dashboard.trinary.progressTitle')}: <span className="font-bold text-muted-foreground">{completedWorkouts}/27</span>
                                    </div>
                                    <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-secondary transition-all duration-500"
                                            style={{ width: `${(completedWorkouts / 27) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* ME/DE/RE preview for current workout */}
                                <div className="space-y-3">
                                    {/* ME - Maximum Effort */}
                                    <div className="bg-red-900/20 border border-red-700/30 rounded p-3">
                                        <div className="text-red-400 text-xs font-bold uppercase mb-1">Maximum Effort (ME)</div>
                                        <div className="text-muted-foreground text-sm">
                                            {(() => {
                                                const lift = workoutPositionInBlock === 1 ? 'deadlift' : workoutPositionInBlock === 2 ? 'squat' : 'bench';
                                                const variation = currentBlock <= 3
                                                    ? (lift === 'bench' ? 'Paused Bench Press' : lift === 'deadlift' ? 'Conventional Deadlift' : 'Low Bar Squat')
                                                    : (lift === 'bench' ? trinaryStatus?.benchVariation :
                                                        lift === 'deadlift' ? trinaryStatus?.deadliftVariation :
                                                            trinaryStatus?.squatVariation) || 'Standard';
                                                return variation;
                                            })()}
                                        </div>
                                    </div>

                                    {/* DE - Dynamic Effort */}
                                    <div className="bg-blue-900/20 border border-blue-700/30 rounded p-3">
                                        <div className="text-blue-400 text-xs font-bold uppercase mb-1">Dynamic Effort (DE)</div>
                                        <div className="text-muted-foreground text-sm">
                                            {workoutPositionInBlock === 1 ? 'Low Bar Squat' : workoutPositionInBlock === 2 ? 'Paused Bench Press' : 'Conventional Deadlift'}
                                        </div>
                                    </div>

                                    {/* RE - Repetition Effort */}
                                    <div className="bg-green-900/20 border border-green-700/30 rounded p-3">
                                        <div className="text-green-400 text-xs font-bold uppercase mb-1">Repetition Effort (RE)</div>
                                        <div className="text-muted-foreground text-sm">
                                            {workoutPositionInBlock === 1 ? 'Paused Bench Press' : workoutPositionInBlock === 2 ? 'Conventional Deadlift' : 'Low Bar Squat'}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground text-center">
                                    {t('dashboard.trinary.readyWhenYouAre')}
                                </p>

                                {/* Action Buttons - conditional based on workout frequency */}
                                {(() => {
                                    // Check if 4+ workouts in last 7 days
                                    const sevenDaysAgo = new Date();
                                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                                    const recentWorkouts = (trinaryStatus?.workoutLog || []).filter((log: any) =>
                                        new Date(log.date) > sevenDaysAgo
                                    );
                                    const isAccessoryDay = recentWorkouts.length >= 4 && !trinaryStatus?.skipNextAccessory;

                                    if (isAccessoryDay) {
                                        return (
                                            <>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Button
                                                        variant="outline"
                                                        className="border-orange-600/50 text-orange-400 hover:bg-orange-900/20"
                                                        onClick={async () => {
                                                            // Skip accessory - set flag to bypass accessory check
                                                            const userRef = doc(db, 'users', user.id);
                                                            await updateDoc(userRef, {
                                                                'trinaryStatus.skipNextAccessory': true
                                                            });
                                                            window.location.reload(); // Refresh to show next workout
                                                        }}
                                                    >
                                                        {t('dashboard.trinary.skipAccessory')}
                                                    </Button>
                                                    <Button
                                                        className="bg-secondary hover:bg-secondary text-muted-foreground font-bold"
                                                        onClick={() => setShowAccessoryModal(true)}
                                                    >
                                                        {t('dashboard.trinary.startAccessory')}
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-orange-400/70 text-center mt-2">
                                                    {t('dashboard.trinary.accessoryRecommendation')}
                                                </p>
                                            </>
                                        );
                                    }

                                    return (
                                        <>
                                            <Button
                                                className="w-full bg-secondary hover:bg-secondary text-muted-foreground font-bold"
                                                onClick={() => navigate(`/app/workout/${currentBlock}/${workoutPositionInBlock}`)}
                                            >
                                                {t('dashboard.trinary.startWorkout')}
                                            </Button>
                                            <div className="mt-4 pt-4 border-t border-border">
                                                <p className="text-xs text-muted-foreground text-center mb-3">{t('dashboard.trinary.manualAccessoryHint')}</p>
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-border text-muted-foreground hover:bg-secondary"
                                                    onClick={() => setShowAccessoryModal(true)}
                                                >
                                                    {t('dashboard.trinary.startManualAccessory')}
                                                </Button>
                                            </div>
                                        </>
                                    );
                                })()}
                            </CardContent>
                        </Card>

                        {/* 1RM Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="border-border bg-secondary">
                                <CardContent className="p-4 text-center">
                                    <div className="text-xs text-muted-foreground uppercase">Bench 1RM</div>
                                    <div className="text-xl font-bold text-muted-foreground">{trinaryStatus?.bench1RM || 0} kg</div>
                                </CardContent>
                            </Card>
                            <Card className="border-border bg-secondary">
                                <CardContent className="p-4 text-center">
                                    <div className="text-xs text-muted-foreground uppercase">Deadlift 1RM</div>
                                    <div className="text-xl font-bold text-muted-foreground">{trinaryStatus?.deadlift1RM || 0} kg</div>
                                </CardContent>
                            </Card>
                            <Card className="border-border bg-secondary">
                                <CardContent className="p-4 text-center">
                                    <div className="text-xs text-muted-foreground uppercase">Squat 1RM</div>
                                    <div className="text-xl font-bold text-muted-foreground">{trinaryStatus?.squat1RM || 0} kg</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );
            })()}

            {/* Standard Week View (hide for Trinary and Super Mutant - they use dynamic systems) */}
            {!isTrinary && !isSuperMutant && (
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

                    <div className="week-sector-list">
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
                                /* Same row grammar as the set ledger: done is
                                   fill plus glyph plus a word, never colour
                                   alone, and never a per-program colour. */
                                <Link
                                    key={day.dayOfWeek}
                                    to={`/app/workout/${viewWeek}/${day.dayOfWeek}`}
                                    className={cn('week-row', isDone && 'is-done')}
                                >
                                    <span className="week-row-id">
                                        <strong title={displayDayName}>{displayDayName}</strong>
                                        <em>{subTitle}</em>
                                    </span>
                                    <span className="week-row-movements">
                                        {day.exercises.slice(0, 3).map(ex => ex.name).join(' · ')}
                                        {day.exercises.length > 3 && ` · ${t('workout.andMore', { count: day.exercises.length - 3 })}`}
                                    </span>
                                    <span className="week-row-state">
                                        {isDone && <CheckCircleIcon className="h-5 w-5" />}
                                        <span className="sr-only">{isDone ? t('workout.rowDone') : t('workout.rowPending')}</span>
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
            {isTrinary && (
                <AccessoryChoiceModal
                    open={showAccessoryModal}
                    onClose={() => setShowAccessoryModal(false)}
                    onSelectType={async (type) => {
                        if (!user) return;

                        const trinaryStatus = user.trinaryStatus;
                        const completed = trinaryStatus?.completedWorkouts || 0;
                        const nextCtx = completed + 1;
                        const block = Math.ceil(nextCtx / 3);
                        const pos = ((nextCtx - 1) % 3) + 1;

                        const userRef = doc(db, 'users', user.id);

                        await updateDoc(userRef, {
                            'trinaryStatus.preferredAccessoryType': type,
                            'trinaryStatus.forceAccessoryDay': true
                        });

                        setShowAccessoryModal(false);

                        // Small delay to ensure Firestore update propagates
                        setTimeout(() => {
                            navigate(`/app/workout/${block}/${pos}`);
                        }, 100);
                    }}
                />
            )}
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
);
