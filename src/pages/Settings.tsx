
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Save, CheckCircle2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import type { TrainingPreferences } from '../data/exercises/types';
import { CORE_RAISE_OPTIONS, KALI_PULL_ANCHORS, KALI_WEEK8, NEURAL_D4_SQUATS, KOS_BENCH_JOB1, KOS_BENCH_JOB2, KOS_BENCH_JOB3, LAZARUS_SQUATS, LAZARUS_CHEST, QUADFATHER_LOAD, REDLINE_FURNACE, ATLAS_HINGES, ATLAS_FRONT } from '../features/planSelections/options';
import { db } from '../firebase';
import { PENCILNECK_PROGRAM } from '../data/pencilneck';
import { BENCH_DOMINATION_PROGRAM } from '../data/program';
import { BENCH_VARIATIONS, DEADLIFT_VARIATIONS, SQUAT_VARIATIONS } from '../data/trinary';
import type { BenchDominationModules, LiftingStats } from '../types';

export const Settings: React.FC = () => {
    const { user, resetProgram } = useUser();
    const { t, tObject } = useLanguage();
    const navigate = useNavigate();
    const [preferences, setPreferences] = useState<Record<string, string>>({});
    const [benchModules, setBenchModules] = useState<BenchDominationModules>({
        tricepGiantSet: true,
        behindNeckPress: false,
        weightedPullups: true,
        accessories: true,
        legDays: true
    });
    const [stats, setStats] = useState<LiftingStats>({
        pausedBench: 0,
        wideGripBench: 0,
        spotoPress: 0,
        lowPinPress: 0,
        btnPress: 0
    });
    const [trinaryStats, setTrinaryStats] = useState({
        bench: 0,
        squat: 0,
        deadlift: 0
    });
    const [excludedVariations, setExcludedVariations] = useState<string[]>([]);
    const [reDeadliftVariant, setReDeadliftVariant] = useState<'Romanian Deadlift' | 'Reverse Hyperextensions' | 'Good Mornings'>('Romanian Deadlift');
    const [ritualAccessories, setRitualAccessories] = useState<{ bench: string[]; squat: string[]; deadlift: string[] }>({ bench: [], squat: [], deadlift: [] });
    const [timeSkipping, setTimeSkipping] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!user) return;

        if (user.exercisePreferences) {
            setPreferences(user.exercisePreferences);
        } else {
            // Default preferences
            setPreferences({
                "push-a-leg-primary": "Hack Squat",
                "push-b-fly": "Pec Deck",
                "push-b-leg-secondary": "Front Squats"
            });
        }

        if (user.benchDominationModules) {
            setBenchModules(prev => ({ ...prev, ...user.benchDominationModules }));
        }

        if (user.stats) {
            setStats(user.stats);
        }

        if (user.trinaryStatus) {
            setTrinaryStats({
                bench: user.trinaryStatus.bench1RM || 0,
                squat: user.trinaryStatus.squat1RM || 0,
                deadlift: user.trinaryStatus.deadlift1RM || 0
            });
            setExcludedVariations(user.trinaryStatus.excludedVariations || []);
            setReDeadliftVariant(user.trinaryStatus.reDeadliftVariant || 'Romanian Deadlift');
        }

        const rs = (user as any).ritualStatus;
        if (rs) {
            setRitualAccessories({
                bench: rs.ritualAccessories?.bench || [],
                squat: rs.ritualAccessories?.squat || [],
                deadlift: rs.ritualAccessories?.deadlift || []
            });
        }
    }, [user]);

    const handlePrefChange = (key: string, value: string) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleModuleToggle = (key: keyof BenchDominationModules) => {
        setBenchModules(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        setSaved(false);
    };

    // Plan-agnostic training preferences (extra sets, rest timer, tips).
    const [trainingPrefs, setTrainingPrefs] = useState<TrainingPreferences>(
        () => user?.trainingPreferences ?? {}
    );
    const [kaliPull, setKaliPull] = useState(user?.planPreferences?.kali?.exerciseSelections?.pullAnchor ?? 'assisted-pull-up');
    const [kaliWeek8, setKaliWeek8] = useState(user?.planPreferences?.kali?.exerciseSelections?.week8Intensifier ?? 'none');
    const [gravityAbs, setGravityAbs] = useState(user?.planPreferences?.['gravity-is-optional']?.exerciseSelections?.abs ?? user?.trainingPreferences?.coreRaiseId ?? 'hanging-leg-raise');
    const [neuralD4, setNeuralD4] = useState(user?.planPreferences?.['neural-overload']?.exerciseSelections?.d4Squat ?? 'front-squat');
    const [kosJob1, setKosJob1] = useState(user?.planPreferences?.['king-of-the-squat']?.exerciseSelections?.benchJob1 ?? 'long-pause-bench-press');
    const [kosJob2, setKosJob2] = useState(user?.planPreferences?.['king-of-the-squat']?.exerciseSelections?.benchJob2 ?? 'wide-grip-bench-press');
    const [kosJob3, setKosJob3] = useState(user?.planPreferences?.['king-of-the-squat']?.exerciseSelections?.benchJob3 ?? 'paused-bench-press');
    const [lazarusSquat, setLazarusSquat] = useState(user?.planPreferences?.lazarus?.exerciseSelections?.returnISquat ?? 'heel-elevated-goblet-squat');
    const [lazarusChest, setLazarusChest] = useState(user?.planPreferences?.lazarus?.exerciseSelections?.returnIIChest ?? 'dip');
    const [quadfatherLoad, setQuadfatherLoad] = useState(user?.planPreferences?.quadfather?.exerciseSelections?.mainLoad ?? 'hack-squat');
    const [furnaceAnchor, setFurnaceAnchor] = useState(user?.planPreferences?.redline?.exerciseSelections?.furnaceAnchor ?? 'paused-bench-press');
    const [atlasHinge, setAtlasHinge] = useState(user?.planPreferences?.atlas?.exerciseSelections?.hinge ?? 'trap-bar-deadlift');
    const [atlasFront, setAtlasFront] = useState(user?.planPreferences?.atlas?.exerciseSelections?.g2FrontSquat ?? 'front-squat');
    useEffect(() => {
        if (user?.trainingPreferences) setTrainingPrefs(user.trainingPreferences);
        if (user?.planPreferences?.kali?.exerciseSelections?.pullAnchor) setKaliPull(user.planPreferences.kali.exerciseSelections.pullAnchor);
        if (user?.planPreferences?.kali?.exerciseSelections?.week8Intensifier) setKaliWeek8(user.planPreferences.kali.exerciseSelections.week8Intensifier);
        const abs = user?.planPreferences?.['gravity-is-optional']?.exerciseSelections?.abs ?? user?.trainingPreferences?.coreRaiseId;
        if (abs) setGravityAbs(abs);
        if (user?.planPreferences?.['neural-overload']?.exerciseSelections?.d4Squat) setNeuralD4(user.planPreferences['neural-overload'].exerciseSelections.d4Squat);
        if (user?.planPreferences?.['king-of-the-squat']?.exerciseSelections?.benchJob1) setKosJob1(user.planPreferences['king-of-the-squat'].exerciseSelections.benchJob1);
        if (user?.planPreferences?.['king-of-the-squat']?.exerciseSelections?.benchJob2) setKosJob2(user.planPreferences['king-of-the-squat'].exerciseSelections.benchJob2);
        if (user?.planPreferences?.['king-of-the-squat']?.exerciseSelections?.benchJob3) setKosJob3(user.planPreferences['king-of-the-squat'].exerciseSelections.benchJob3);
        if (user?.planPreferences?.lazarus?.exerciseSelections?.returnISquat) setLazarusSquat(user.planPreferences.lazarus.exerciseSelections.returnISquat);
        if (user?.planPreferences?.lazarus?.exerciseSelections?.returnIIChest) setLazarusChest(user.planPreferences.lazarus.exerciseSelections.returnIIChest);
        if (user?.planPreferences?.quadfather?.exerciseSelections?.mainLoad) setQuadfatherLoad(user.planPreferences.quadfather.exerciseSelections.mainLoad);
        if (user?.planPreferences?.redline?.exerciseSelections?.furnaceAnchor) setFurnaceAnchor(user.planPreferences.redline.exerciseSelections.furnaceAnchor);
        if (user?.planPreferences?.atlas?.exerciseSelections?.hinge) setAtlasHinge(user.planPreferences.atlas.exerciseSelections.hinge);
        if (user?.planPreferences?.atlas?.exerciseSelections?.g2FrontSquat) setAtlasFront(user.planPreferences.atlas.exerciseSelections.g2FrontSquat);
    }, [user?.trainingPreferences, user?.planPreferences]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const userRef = doc(db, 'users', user.id);
            const updates: any = {};

            if (user.programId === PENCILNECK_PROGRAM.id) {
                updates.exercisePreferences = preferences;
            } else if (user.programId === BENCH_DOMINATION_PROGRAM.id) {
                updates.benchDominationModules = benchModules;
                // Only update stats if pausedBench has changed
                if (stats.pausedBench !== user.stats?.pausedBench) {
                    updates.stats = stats;
                }
            } else if (user.programId === 'trinary') {
                if (user.trinaryStatus) {
                    updates.trinaryStatus = {
                        ...user.trinaryStatus,
                        bench1RM: trinaryStats.bench,
                        squat1RM: trinaryStats.squat,
                        deadlift1RM: trinaryStats.deadlift,
                        excludedVariations: excludedVariations,
                        reDeadliftVariant: reDeadliftVariant
                    };
                }
            } else if (user.programId === 'ritual-of-strength') {
                if ((user as any).ritualStatus) {
                    updates['ritualStatus.ritualAccessories'] = ritualAccessories;
                }
            }

            updates.trainingPreferences = {
                ...trainingPrefs,
                coreRaiseId: gravityAbs || trainingPrefs.coreRaiseId,
            };

            if (user.programId === 'kali') {
                const now = new Date().toISOString();
                updates.planPreferences = {
                    ...(user.planPreferences ?? {}),
                    kali: {
                        scheduleMode: user.planPreferences?.kali?.scheduleMode ?? '4day',
                        updatedAt: now,
                        exerciseSelections: {
                            ...(user.planPreferences?.kali?.exerciseSelections ?? {}),
                            pullAnchor: kaliPull,
                            week8Intensifier: kaliWeek8 === 'none' ? '' : kaliWeek8,
                        },
                    },
                };
            }
            if (user.programId === 'gravity-is-optional') {
                const now = new Date().toISOString();
                updates.planPreferences = {
                    ...(user.planPreferences ?? {}),
                    'gravity-is-optional': {
                        scheduleMode: user.planPreferences?.['gravity-is-optional']?.scheduleMode ?? '4day',
                        updatedAt: now,
                        exerciseSelections: { abs: gravityAbs },
                    },
                };
            }
            if (user.programId === 'neural-overload') {
                const now = new Date().toISOString();
                updates.planPreferences = {
                    ...(user.planPreferences ?? {}),
                    'neural-overload': {
                        scheduleMode: user.planPreferences?.['neural-overload']?.scheduleMode ?? '4day',
                        updatedAt: now,
                        exerciseSelections: {
                            ...(user.planPreferences?.['neural-overload']?.exerciseSelections ?? {}),
                            d4Squat: neuralD4,
                        },
                    },
                };
            }
            if (user.programId === 'king-of-the-squat') {
                const now = new Date().toISOString();
                updates.planPreferences = {
                    ...(user.planPreferences ?? {}),
                    'king-of-the-squat': {
                        scheduleMode: user.planPreferences?.['king-of-the-squat']?.scheduleMode ?? '4day',
                        updatedAt: now,
                        exerciseSelections: {
                            ...(user.planPreferences?.['king-of-the-squat']?.exerciseSelections ?? {}),
                            benchJob1: kosJob1,
                            benchJob2: kosJob2,
                            benchJob3: kosJob3,
                        },
                    },
                };
            }
            if (user.programId === 'lazarus') {
                const now = new Date().toISOString();
                updates.planPreferences = {
                    ...(user.planPreferences ?? {}),
                    lazarus: {
                        scheduleMode: user.planPreferences?.lazarus?.scheduleMode ?? '4day',
                        updatedAt: now,
                        exerciseSelections: {
                            ...(user.planPreferences?.lazarus?.exerciseSelections ?? {}),
                            returnISquat: lazarusSquat,
                            returnIIChest: lazarusChest,
                        },
                    },
                };
            }
            if (user.programId === 'quadfather') {
                const now = new Date().toISOString();
                updates.planPreferences = {
                    ...(user.planPreferences ?? {}),
                    quadfather: {
                        scheduleMode: user.planPreferences?.quadfather?.scheduleMode ?? '4day',
                        updatedAt: now,
                        exerciseSelections: {
                            ...(user.planPreferences?.quadfather?.exerciseSelections ?? {}),
                            mainLoad: quadfatherLoad,
                        },
                    },
                };
            }
            if (user.programId === 'redline') {
                const now = new Date().toISOString();
                updates.planPreferences = {
                    ...(user.planPreferences ?? {}),
                    redline: {
                        scheduleMode: user.planPreferences?.redline?.scheduleMode ?? '4day',
                        updatedAt: now,
                        exerciseSelections: {
                            ...(user.planPreferences?.redline?.exerciseSelections ?? {}),
                            furnaceAnchor,
                        },
                    },
                };
            }
            if (user.programId === 'atlas') {
                const now = new Date().toISOString();
                updates.planPreferences = {
                    ...(user.planPreferences ?? {}),
                    atlas: {
                        scheduleMode: user.planPreferences?.atlas?.scheduleMode ?? '4day',
                        updatedAt: now,
                        exerciseSelections: {
                            ...(user.planPreferences?.atlas?.exerciseSelections ?? {}),
                            hinge: atlasHinge,
                            g2FrontSquat: atlasFront,
                        },
                    },
                };
            }

            if (Object.keys(updates).length > 0) {
                await updateDoc(userRef, updates);
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 2000); // Reset saved message
        } catch (e) {
            console.error("Error saving settings", e);
        } finally {
            setLoading(false);
        }
    };

    const isPencilneck = user?.programId === PENCILNECK_PROGRAM.id;
    const isBenchDomination = user?.programId === BENCH_DOMINATION_PROGRAM.id;
    const isTrinary = user?.programId === 'trinary';
    const isRitual = user?.programId === 'ritual-of-strength';
    const isSuperMutant = user?.programId === 'super-mutant';

    const ModuleToggle = ({
        title,
        desc,
        isOn,
        onToggle,
        mandatory = false
    }: { title: string, desc: string, isOn: boolean, onToggle: () => void, mandatory?: boolean }) => (
        <div className={`flex items-start justify-between p-4 border rounded-none ${isOn ? 'bg-primary/5 border-primary/20' : 'bg-background hover:bg-muted/50'} cursor-pointer`} onClick={!mandatory ? onToggle : undefined}>
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{title}</h4>
                    {mandatory && <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-bold">{t('common.required')}</span>}
                </div>
                <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
            <div className={`w-10 h-6 rounded-full relative transition-colors ${isOn ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isOn ? 'left-5' : 'left-1'}`}></div>
            </div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="instrument-page settings-console space-y-6 pb-24">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h2>
                <p className="text-muted-foreground">{t('settings.description')}</p>
            </div>

            {/* Plan-agnostic training preferences, above the plan-specific cards. */}
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>{t('settings.training.title')}</CardTitle>
                    <CardDescription>{t('settings.training.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">{t('settings.training.extraSets')}</Label>
                        <p className="text-xs text-muted-foreground">{t('settings.training.extraSetsDesc')}</p>
                        <RadioGroup
                            value={trainingPrefs.extraSets?.mode ?? 'off'}
                            onValueChange={(mode) => {
                                setTrainingPrefs(prev => ({
                                    ...prev,
                                    extraSets: {
                                        mode: mode as 'off' | 'accessories' | 'all',
                                        count: prev.extraSets?.count ?? 1,
                                    },
                                }));
                                setSaved(false);
                            }}
                        >
                            {(['off', 'accessories', 'all'] as const).map(mode => (
                                <div className="flex items-center space-x-2" key={mode}>
                                    <RadioGroupItem value={mode} id={`extra-${mode}`} />
                                    <Label htmlFor={`extra-${mode}`} className="font-normal">
                                        {t(`settings.training.extraSetsMode.${mode}`)}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>

                        {trainingPrefs.extraSets?.mode && trainingPrefs.extraSets.mode !== 'off' && (
                            <div className="flex items-center gap-3 pt-1">
                                <Label htmlFor="extra-count" className="font-normal">{t('settings.training.extraSetsCount')}</Label>
                                <Input
                                    id="extra-count" type="number" min={1} max={2} className="w-20"
                                    value={trainingPrefs.extraSets.count}
                                    onChange={(e) => {
                                        const count = Math.min(2, Math.max(1, Number(e.target.value) || 1)) as 1 | 2;
                                        setTrainingPrefs(prev => ({
                                            ...prev,
                                            extraSets: { mode: prev.extraSets?.mode ?? 'all', count },
                                        }));
                                        setSaved(false);
                                    }}
                                />
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">{t('settings.training.extraSetsNote')}</p>
                    </div>

                    <div className="space-y-3 border-t border-border pt-5">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <Checkbox
                                checked={trainingPrefs.restTimer?.enabled ?? false}
                                onCheckedChange={(checked) => {
                                    setTrainingPrefs(prev => ({
                                        ...prev,
                                        restTimer: { enabled: checked === true, autoStart: prev.restTimer?.autoStart ?? true },
                                    }));
                                    setSaved(false);
                                }}
                            />
                            <span>
                                <span className="block text-sm font-semibold">{t('settings.training.restTimer')}</span>
                                <span className="block text-xs text-muted-foreground">{t('settings.training.restTimerDesc')}</span>
                            </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <Checkbox
                                checked={trainingPrefs.techniquesEnabled !== false}
                                onCheckedChange={(checked) => {
                                    setTrainingPrefs(prev => ({ ...prev, techniquesEnabled: checked === true }));
                                    setSaved(false);
                                }}
                            />
                            <span>
                                <span className="block text-sm font-semibold">{t('settings.training.techniques')}</span>
                                <span className="block text-xs text-muted-foreground">{t('settings.training.techniquesDesc')}</span>
                            </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <Checkbox
                                checked={trainingPrefs.showTips !== false}
                                onCheckedChange={(checked) => {
                                    setTrainingPrefs(prev => ({ ...prev, showTips: checked === true }));
                                    setSaved(false);
                                }}
                            />
                            <span>
                                <span className="block text-sm font-semibold">{t('settings.training.showTips')}</span>
                                <span className="block text-xs text-muted-foreground">{t('settings.training.showTipsDesc')}</span>
                            </span>
                        </label>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">{t('settings.training.namePriority')}</Label>
                            <p className="text-xs text-muted-foreground">{t('settings.training.namePriorityDesc')}</p>
                            <RadioGroup
                                value={trainingPrefs.exerciseNamePriority ?? 'en'}
                                onValueChange={(value) => {
                                    setTrainingPrefs(prev => ({ ...prev, exerciseNamePriority: value as 'en' | 'pl' }));
                                    setSaved(false);
                                }}
                                className="flex gap-4"
                            >
                                {(['en', 'pl'] as const).map(priority => (
                                    <div key={priority} className="flex items-center space-x-2">
                                        <RadioGroupItem value={priority} id={`name-priority-${priority}`} />
                                        <Label htmlFor={`name-priority-${priority}`} className="font-normal">
                                            {t(`settings.training.namePriorityOption.${priority}`)}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isPencilneck && (
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>{t('settings.exercisePreferences')}</CardTitle>
                        <CardDescription>
                            {t('settings.exercisePreferencesDesc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Leg Primary */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">{t('settings.pushALegPrimary')}</Label>
                            <RadioGroup value={preferences["push-a-leg-primary"]} onValueChange={(v) => handlePrefChange("push-a-leg-primary", v)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Hack Squat" id="hack" />
                                    <Label htmlFor="hack">Hack Squat</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="High-Foot Leg Press" id="high-leg" />
                                    <Label htmlFor="high-leg">High-Foot Leg Press</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="border-t"></div>

                        {/* Chest Fly */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">{t('settings.pushBChestIsolation')}</Label>
                            <RadioGroup value={preferences["push-b-fly"]} onValueChange={(v) => handlePrefChange("push-b-fly", v)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Pec Deck" id="pecdec" />
                                    <Label htmlFor="pecdec">Pec Deck</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Low-to-High Cable Flyes" id="lowhigh" />
                                    <Label htmlFor="lowhigh">Low-to-High Cable Flyes</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="border-t"></div>

                        {/* Leg Secondary */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">{t('settings.pushBLegSecondary')}</Label>
                            <RadioGroup value={preferences["push-b-leg-secondary"]} onValueChange={(v) => handlePrefChange("push-b-leg-secondary", v)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Front Squats" id="front" />
                                    <Label htmlFor="front">Front Squats</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Safety Bar Squat" id="safety-bar" />
                                    <Label htmlFor="safety-bar">Safety Bar Squat</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Narrow-Stance Leg Press" id="narrow" />
                                    <Label htmlFor="narrow">Narrow-Stance Leg Press</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Stiletto Squats" id="stiletto" />
                                    <Label htmlFor="stiletto">Stiletto Squats</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isBenchDomination && (
                <>
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>{t('settings.programModules')}</CardTitle>
                            <CardDescription>
                                {t('settings.programModulesDesc')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ModuleToggle
                                title={tObject('onboarding.modules.coreBench').title}
                                desc={tObject('onboarding.modules.coreBench').description}
                                isOn={true}
                                onToggle={() => { }}
                                mandatory
                            />
                            <ModuleToggle
                                title={tObject('onboarding.modules.tricepGiantSets').title}
                                desc={tObject('onboarding.modules.tricepGiantSets').description}
                                isOn={benchModules.tricepGiantSet}
                                onToggle={() => handleModuleToggle('tricepGiantSet')}
                            />

                            <ModuleToggle
                                title={tObject('onboarding.modules.behindNeckPress').title}
                                desc={tObject('onboarding.modules.behindNeckPress').description}
                                isOn={benchModules.behindNeckPress}
                                onToggle={() => handleModuleToggle('behindNeckPress')}
                            />

                            <ModuleToggle
                                title={tObject('onboarding.modules.weightedPullups').title}
                                desc={tObject('onboarding.modules.weightedPullups').description}
                                isOn={benchModules.weightedPullups}
                                onToggle={() => handleModuleToggle('weightedPullups')}
                            />

                            <ModuleToggle
                                title={tObject('onboarding.modules.legDays').title}
                                desc={tObject('onboarding.modules.legDays').description}
                                isOn={benchModules.legDays}
                                onToggle={() => handleModuleToggle('legDays')}
                            />

                            <ModuleToggle
                                title={tObject('onboarding.modules.accessories').title}
                                desc={tObject('onboarding.modules.accessories').description}
                                isOn={benchModules.accessories}
                                onToggle={() => handleModuleToggle('accessories')}
                            />

                            <div className="border-t mt-4 pt-4"></div>

                            {/* Thursday Tricep Variant Selection */}
                            <div className="space-y-3 p-4 border rounded-none bg-background">
                                <div className="space-y-1">
                                    <h4 className="font-semibold">Thursday Tricep Exercise</h4>
                                    <p className="text-sm text-muted-foreground">Choose between Tricep Giant Set (default) or Heavy Rolling Extensions for lockout strength</p>
                                </div>
                                <RadioGroup
                                    value={benchModules.thursdayTricepVariant || 'giant-set'}
                                    onValueChange={(v) => {
                                        setBenchModules(prev => ({ ...prev, thursdayTricepVariant: v as 'giant-set' | 'heavy-extensions' }));
                                        setSaved(false);
                                    }}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="giant-set" id="tricep-giant" />
                                        <Label htmlFor="tricep-giant">Tricep Giant Set (Default)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="heavy-extensions" id="tricep-heavy" />
                                        <Label htmlFor="tricep-heavy">Heavy Rolling Tricep Extensions (4×4-6)</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Low Pin Press Extra Set Toggle */}
                            <ModuleToggle
                                title="Low Pin Press Extra Set"
                                desc="Move 1 set from Paused Bench (5→4) to Low Pin Press (2→3) on Thursday for extra lockout focus"
                                isOn={benchModules.lowPinPressExtraSet || false}
                                onToggle={() => {
                                    setBenchModules(prev => ({ ...prev, lowPinPressExtraSet: !prev.lowPinPressExtraSet }));
                                    setSaved(false);
                                }}
                            />

                            <div className="space-y-3 p-4 border rounded-none bg-background">
                                <div className="space-y-1">
                                    <h4 className="font-semibold">Bench tempo</h4>
                                    <p className="text-sm text-muted-foreground">Display only. Competition pause stays the default; touch-and-go does not change the formula.</p>
                                </div>
                                <RadioGroup
                                    value={benchModules.pauseStyle || 'paused'}
                                    onValueChange={(v) => {
                                        setBenchModules(prev => ({ ...prev, pauseStyle: v as 'paused' | 'touch-and-go' }));
                                        setSaved(false);
                                    }}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="paused" id="pause-paused" />
                                        <Label htmlFor="pause-paused">Paused (11X0)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="touch-and-go" id="pause-tng" />
                                        <Label htmlFor="pause-tng">Touch-and-go (10X0)</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="max-w-2xl border-red-500/20">
                        <CardHeader>
                            <CardTitle className="text-red-500 flex items-center gap-2">
                                {t('settings.manual1rmOverride')}
                            </CardTitle>
                            <CardDescription>
                                {t('settings.manual1rmDesc')}
                                <span className="block mt-2 text-yellow-600 dark:text-yellow-500 font-semibold bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                                    {t('settings.manual1rmWarning')}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="manual-bench">{t('settings.pausedBench1rm')}</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="manual-bench"
                                        type="number"
                                        value={stats.pausedBench || ''}
                                        onChange={(e) => {
                                            setStats(prev => ({ ...prev, pausedBench: parseFloat(e.target.value) || 0 }));
                                            setSaved(false);
                                        }}
                                        step="0.5" // Allow 0.5 increments
                                        className="max-w-[150px] text-lg font-bold"
                                    />
                                    <span className="text-sm text-muted-foreground">{t('settings.currentCalculatedMax')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {isTrinary && (
                <Card className="max-w-2xl border-red-500/20">
                    <CardHeader>
                        <CardTitle className="text-red-500 flex items-center gap-2">
                            Manual 1RM Overrides
                        </CardTitle>
                        <CardDescription>
                            Manually update your contest maxes. These dictate all your percentage work.
                            <div className="mt-2 text-yellow-600 dark:text-yellow-500 font-semibold bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                                Only update if you have tested a new true 1RM.
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Bench */}
                        <div className="space-y-2">
                            <Label htmlFor="trinary-bench">Bench Press 1RM</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="trinary-bench"
                                    type="number"
                                    value={trinaryStats.bench || ''}
                                    onChange={(e) => {
                                        setTrinaryStats(prev => ({ ...prev, bench: parseFloat(e.target.value) || 0 }));
                                        setSaved(false);
                                    }}
                                    step="2.5"
                                    className="max-w-[150px] text-lg font-bold"
                                />
                                <span className="text-sm text-muted-foreground">kg</span>
                            </div>
                        </div>
                        {/* Squat */}
                        <div className="space-y-2">
                            <Label htmlFor="trinary-squat">Squat 1RM</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="trinary-squat"
                                    type="number"
                                    value={trinaryStats.squat || ''}
                                    onChange={(e) => {
                                        setTrinaryStats(prev => ({ ...prev, squat: parseFloat(e.target.value) || 0 }));
                                        setSaved(false);
                                    }}
                                    step="2.5"
                                    className="max-w-[150px] text-lg font-bold"
                                />
                                <span className="text-sm text-muted-foreground">kg</span>
                            </div>
                        </div>
                        {/* Deadlift */}
                        <div className="space-y-2">
                            <Label htmlFor="trinary-deadlift">Deadlift 1RM</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="trinary-deadlift"
                                    type="number"
                                    value={trinaryStats.deadlift || ''}
                                    onChange={(e) => {
                                        setTrinaryStats(prev => ({ ...prev, deadlift: parseFloat(e.target.value) || 0 }));
                                        setSaved(false);
                                    }}
                                    step="2.5"
                                    className="max-w-[150px] text-lg font-bold"
                                />
                                <span className="text-sm text-muted-foreground">kg</span>
                            </div>
                        </div>

                        <div className="border-t my-4 py-4">
                            <h3 className="text-lg font-semibold mb-2">Repeated Effort Deadlift Movement</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Choose the movement used for your Repeated Effort (RE) deadlift slot. Weight is still based on your Deadlift 1RM.
                            </p>
                            <RadioGroup value={reDeadliftVariant} onValueChange={(v) => { setReDeadliftVariant(v as typeof reDeadliftVariant); setSaved(false); }}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Romanian Deadlift" id="re-rdl" />
                                    <Label htmlFor="re-rdl" className="font-normal cursor-pointer">Romanian Deadlift</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Reverse Hyperextensions" id="re-rhe" />
                                    <Label htmlFor="re-rhe" className="font-normal cursor-pointer">Reverse Hyperextensions</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Good Mornings" id="re-gm" />
                                    <Label htmlFor="re-gm" className="font-normal cursor-pointer">Good Mornings</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="border-t my-4 py-4">
                            <h3 className="text-lg font-semibold mb-2">Exclude Lift Variations</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Select variations you cannot perform (e.g. due to equipment limitations).
                                Excluded lifts will not be generated in future blocks.
                            </p>

                            <div className="space-y-6">
                                {/* Bench Variations */}
                                <div>
                                    <h4 className="font-medium mb-2 text-primary">Bench Press Variations</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {Object.values(BENCH_VARIATIONS).flat().map(variation => (
                                            <div key={variation} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`exclude-${variation}`}
                                                    checked={excludedVariations.includes(variation)}
                                                    onCheckedChange={(checked) => {
                                                        setExcludedVariations(prev =>
                                                            checked
                                                                ? [...prev, variation]
                                                                : prev.filter(v => v !== variation)
                                                        );
                                                        setSaved(false);
                                                    }}
                                                />
                                                <Label htmlFor={`exclude-${variation}`} className="text-sm cursor-pointer font-normal">
                                                    {variation}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Squat Variations */}
                                <div>
                                    <h4 className="font-medium mb-2 text-primary">Squat Variations</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {Object.values(SQUAT_VARIATIONS).flat().map(variation => (
                                            <div key={variation} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`exclude-${variation}`}
                                                    checked={excludedVariations.includes(variation)}
                                                    onCheckedChange={(checked) => {
                                                        setExcludedVariations(prev =>
                                                            checked
                                                                ? [...prev, variation]
                                                                : prev.filter(v => v !== variation)
                                                        );
                                                        setSaved(false);
                                                    }}
                                                />
                                                <Label htmlFor={`exclude-${variation}`} className="text-sm cursor-pointer font-normal">
                                                    {variation}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Deadlift Variations */}
                                <div>
                                    <h4 className="font-medium mb-2 text-primary">Deadlift Variations</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {Object.values(DEADLIFT_VARIATIONS).flat().map(variation => (
                                            <div key={variation} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`exclude-${variation}`}
                                                    checked={excludedVariations.includes(variation)}
                                                    onCheckedChange={(checked) => {
                                                        setExcludedVariations(prev =>
                                                            checked
                                                                ? [...prev, variation]
                                                                : prev.filter(v => v !== variation)
                                                        );
                                                        setSaved(false);
                                                    }}
                                                />
                                                <Label htmlFor={`exclude-${variation}`} className="text-sm cursor-pointer font-normal">
                                                    {variation}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isRitual && (
                <Card className="max-w-2xl border-red-500/20">
                    <CardHeader>
                        <CardTitle className="text-red-500">Ritual Accessories</CardTitle>
                        <CardDescription>
                            Pick up to 3 accessories per training day. They are added after the main ritual work (3×10-12, double progression).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {([
                            { key: 'bench' as const, label: 'Bench Day', options: ['Rows', 'Rear Delt Flyes', 'Tricep Extensions', 'Face Pulls'] },
                            { key: 'squat' as const, label: 'Squat Day', options: ['Ham Curls', 'Leg Extensions', 'Hip Thrusts', 'Calves'] },
                            { key: 'deadlift' as const, label: 'Deadlift Day', options: ['Shrugs', 'Band Pull-Aparts', 'Ab Wheel', 'Planks'] },
                        ]).map(group => (
                            <div key={group.key}>
                                <h4 className="font-medium mb-2 text-primary">{group.label} <span className="text-xs text-muted-foreground font-normal">({ritualAccessories[group.key].length}/3 selected)</span></h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {group.options.map(opt => {
                                        const selected = ritualAccessories[group.key].includes(opt);
                                        const full = ritualAccessories[group.key].length >= 3 && !selected;
                                        return (
                                            <div key={opt} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`ritual-acc-${group.key}-${opt}`}
                                                    checked={selected}
                                                    disabled={full}
                                                    onCheckedChange={(checked) => {
                                                        setRitualAccessories(prev => ({
                                                            ...prev,
                                                            [group.key]: checked
                                                                ? [...prev[group.key], opt]
                                                                : prev[group.key].filter(o => o !== opt)
                                                        }));
                                                        setSaved(false);
                                                    }}
                                                />
                                                <Label htmlFor={`ritual-acc-${group.key}-${opt}`} className={`text-sm cursor-pointer font-normal ${full ? 'opacity-50' : ''}`}>
                                                    {opt}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {isSuperMutant && (
                <Card className="max-w-2xl border-orange-500/30">
                    <CardHeader>
                        <CardTitle className="text-orange-500 flex items-center gap-2">
                            Developer Tools
                        </CardTitle>
                        <CardDescription>
                            Testing feature — not part of the program. Shifts every muscle-group cooldown timestamp back 24 hours so the next workout unlocks early. Your volume history is untouched.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="outline"
                            disabled={timeSkipping}
                            className="border-orange-700 text-orange-400 hover:bg-orange-900/20"
                            onClick={async () => {
                                if (!user?.superMutantStatus) return;
                                setTimeSkipping(true);
                                try {
                                    const userRef = doc(db, 'users', user.id);
                                    const updates: Record<string, number> = {};
                                    const dayMs = 24 * 60 * 60 * 1000;
                                    const muscles = ['chest', 'back', 'shoulders', 'triceps', 'biceps', 'calves', 'hamstrings', 'glutes', 'lowerBack', 'quads', 'abductors', 'abs'];
                                    muscles.forEach(m => {
                                        const cur = (user.superMutantStatus?.muscleGroupTimestamps as any)?.[m];
                                        if (cur) updates[`superMutantStatus.muscleGroupTimestamps.${m}`] = cur - dayMs;
                                    });
                                    if (Object.keys(updates).length > 0) await updateDoc(userRef, updates);
                                } finally {
                                    setTimeSkipping(false);
                                }
                            }}
                        >
                            {timeSkipping ? 'Skipping...' : 'Skip 24 hours'}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {!isPencilneck && !isBenchDomination && !isTrinary && !isRitual && !isSuperMutant && (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('settings.programSettings')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {user?.programId === 'neural-overload' && (
                            <div className="space-y-2">
                                <Label>Day 4 squat</Label>
                                <RadioGroup value={neuralD4} onValueChange={v => { setNeuralD4(v); setSaved(false); }}>
                                    {NEURAL_D4_SQUATS.map(option => (
                                        <div key={option.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option.id} id={`set-neural-${option.id}`} />
                                            <Label htmlFor={`set-neural-${option.id}`} className="font-normal">{option.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        )}
                        {user?.programId === 'king-of-the-squat' && (
                            <>
                                <div className="space-y-2">
                                    <Label>Bench job 1 — technique</Label>
                                    <RadioGroup value={kosJob1} onValueChange={v => { setKosJob1(v); setSaved(false); }}>
                                        {KOS_BENCH_JOB1.map(option => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={`set-kos1-${option.id}`} />
                                                <Label htmlFor={`set-kos1-${option.id}`} className="font-normal">{option.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label>Bench job 2 — hypertrophy</Label>
                                    <RadioGroup value={kosJob2} onValueChange={v => { setKosJob2(v); setSaved(false); }}>
                                        {KOS_BENCH_JOB2.map(option => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={`set-kos2-${option.id}`} />
                                                <Label htmlFor={`set-kos2-${option.id}`} className="font-normal">{option.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label>Bench job 3 — heavy</Label>
                                    <RadioGroup value={kosJob3} onValueChange={v => { setKosJob3(v); setSaved(false); }}>
                                        {KOS_BENCH_JOB3.map(option => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={`set-kos3-${option.id}`} />
                                                <Label htmlFor={`set-kos3-${option.id}`} className="font-normal">{option.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </>
                        )}
                        {user?.programId === 'lazarus' && (
                            <>
                                <div className="space-y-2">
                                    <Label>Return I squat</Label>
                                    <RadioGroup value={lazarusSquat} onValueChange={v => { setLazarusSquat(v); setSaved(false); }}>
                                        {LAZARUS_SQUATS.map(option => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={`set-laz-sq-${option.id}`} />
                                                <Label htmlFor={`set-laz-sq-${option.id}`} className="font-normal">{option.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label>Return II chest</Label>
                                    <RadioGroup value={lazarusChest} onValueChange={v => { setLazarusChest(v); setSaved(false); }}>
                                        {LAZARUS_CHEST.map(option => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={`set-laz-ch-${option.id}`} />
                                                <Label htmlFor={`set-laz-ch-${option.id}`} className="font-normal">{option.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </>
                        )}
                        {user?.programId === 'quadfather' && (
                            <div className="space-y-2">
                                <Label>Main load</Label>
                                <RadioGroup value={quadfatherLoad} onValueChange={v => { setQuadfatherLoad(v); setSaved(false); }}>
                                    {QUADFATHER_LOAD.map(option => (
                                        <div key={option.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option.id} id={`set-qf-${option.id}`} />
                                            <Label htmlFor={`set-qf-${option.id}`} className="font-normal">{option.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        )}
                        {user?.programId === 'redline' && (
                            <div className="space-y-2">
                                <Label>Furnace anchor</Label>
                                <RadioGroup value={furnaceAnchor} onValueChange={v => { setFurnaceAnchor(v); setSaved(false); }}>
                                    {REDLINE_FURNACE.map(option => (
                                        <div key={option.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option.id} id={`set-rl-${option.id}`} />
                                            <Label htmlFor={`set-rl-${option.id}`} className="font-normal">{option.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        )}
                        {user?.programId === 'atlas' && (
                            <>
                                <div className="space-y-2">
                                    <Label>Hinge</Label>
                                    <RadioGroup value={atlasHinge} onValueChange={v => { setAtlasHinge(v); setSaved(false); }}>
                                        {ATLAS_HINGES.map(option => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={`set-at-h-${option.id}`} />
                                                <Label htmlFor={`set-at-h-${option.id}`} className="font-normal">{option.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label>Gauntlet 2 squat</Label>
                                    <RadioGroup value={atlasFront} onValueChange={v => { setAtlasFront(v); setSaved(false); }}>
                                        {ATLAS_FRONT.map(option => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={`set-at-f-${option.id}`} />
                                                <Label htmlFor={`set-at-f-${option.id}`} className="font-normal">{option.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </>
                        )}
                        {user?.programId === 'kali' && (
                            <>
                                <div className="space-y-2">
                                    <Label>Pull anchor (Hunt day)</Label>
                                    <RadioGroup value={kaliPull} onValueChange={v => { setKaliPull(v); setSaved(false); }}>
                                        {KALI_PULL_ANCHORS.map(option => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={`set-kali-${option.id}`} />
                                                <Label htmlFor={`set-kali-${option.id}`} className="font-normal">{option.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label>Week 8 intensifier repeat</Label>
                                    <RadioGroup value={kaliWeek8} onValueChange={v => { setKaliWeek8(v); setSaved(false); }}>
                                        {KALI_WEEK8.map(option => (
                                            <div key={option.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option.id} id={`set-kali-w8-${option.id}`} />
                                                <Label htmlFor={`set-kali-w8-${option.id}`} className="font-normal">{option.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </>
                        )}
                        <div className="space-y-2">
                            <Label>Hanging Leg Raise alternative</Label>
                            <p className="text-sm text-muted-foreground">Used wherever a plan prescribes hanging leg raises{user?.programId === 'gravity-is-optional' ? ', and for Gravity’s other ab slot.' : '.'}</p>
                            <RadioGroup value={gravityAbs} onValueChange={v => { setGravityAbs(v); setSaved(false); }}>
                                {CORE_RAISE_OPTIONS.map(option => (
                                    <div key={option.id} className="flex items-start space-x-2">
                                        <RadioGroupItem value={option.id} id={`set-abs-${option.id}`} className="mt-1" />
                                        <Label htmlFor={`set-abs-${option.id}`} className="font-normal">
                                            <span className="font-semibold capitalize">{option.level}</span>
                                            {' — '}
                                            {option.label}
                                            <span className="block text-xs text-muted-foreground">{option.hint}</span>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Program Management */}
            <Card className="border-red-500/10">
                <CardHeader>
                    <CardTitle>{t('settings.programManagement')}</CardTitle>
                    <CardDescription>{t('settings.programManagementDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between p-4 border rounded-none">
                            <div>
                                <h4 className="font-semibold">{t('settings.switchProgram')}</h4>
                                <p className="text-sm text-muted-foreground">{t('settings.switchProgramDesc')}</p>
                            </div>
                            <Button variant="outline" onClick={() => navigate('/onboarding')}>
                                {t('settings.switchProgram')}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/20 rounded-none">
                            <div className="space-y-1">
                                <h4 className="font-semibold text-red-600 dark:text-red-400">{t('settings.resetProgress')}</h4>
                                <p className="text-sm text-muted-foreground">{t('settings.resetProgressDesc')}</p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={async () => {
                                    if (confirm(t('alerts.confirmReset'))) {
                                        setLoading(true);
                                        await resetProgram();
                                        setLoading(false);
                                        alert(t('alerts.progressReset'));
                                    }
                                }}
                            >
                                {t('settings.resetProgress')}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:static md:bg-transparent md:border-0 md:p-0 flex flex-col md:flex-row gap-4 items-center">
                <Button
                    className="w-full md:w-auto h-12 text-lg font-bold shadow-lg min-w-[200px]"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {saved ? (
                        <>{t('common.saved')} <CheckCircle2 className="ml-2 h-5 w-5" /></>
                    ) : (
                        <>{t('common.saveChanges')} <Save className="ml-2 h-5 w-5" /></>
                    )}
                </Button>

                <Button variant="outline" onClick={() => {
                    if (!user) return;
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user));
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute("download", "workout_data_backup.json");
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                }}>
                    {t('common.exportData')}
                </Button>
            </div>
        </div>
    );
};
