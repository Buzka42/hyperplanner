
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
                "push-b-fly": "Pec-Dec",
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
                        excludedVariations: excludedVariations
                    };
                }
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

    const ModuleToggle = ({
        title,
        desc,
        isOn,
        onToggle,
        mandatory = false
    }: { title: string, desc: string, isOn: boolean, onToggle: () => void, mandatory?: boolean }) => (
        <div className={`flex items-start justify-between p-4 border rounded-lg ${isOn ? 'bg-primary/5 border-primary/20' : 'bg-background hover:bg-muted/50'} cursor-pointer`} onClick={!mandatory ? onToggle : undefined}>
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
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h2>
                <p className="text-muted-foreground">{t('settings.description')}</p>
            </div>

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
                                    <RadioGroupItem value="Pec-Dec" id="pecdec" />
                                    <Label htmlFor="pecdec">Pec-Dec</Label>
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
                            <div className="space-y-3 p-4 border rounded-lg bg-background">
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
                                ⚠️ Only update if you have tested a new true 1RM.
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

            {!isPencilneck && !isBenchDomination && !isTrinary && (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('settings.programSettings')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t('settings.noConfigurableSettings')}</p>
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
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-semibold">{t('settings.switchProgram')}</h4>
                                <p className="text-sm text-muted-foreground">{t('settings.switchProgramDesc')}</p>
                            </div>
                            <Button variant="outline" onClick={() => navigate('/onboarding')}>
                                {t('settings.switchProgram')}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/20 rounded-lg">
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
