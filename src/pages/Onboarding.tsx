
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import type { LiftingStats } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { BENCH_DOMINATION_PROGRAM } from '../data/program';
import { SKELETON_PROGRAM } from '../data/skeleton';
import { PENCILNECK_PROGRAM } from '../data/pencilneck';
import { PEACHY_CONFIG } from '../data/peachy';
import { PAIN_GLORY_CONFIG } from '../data/painglory';
import { TRINARY_CONFIG } from '../data/trinary';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

type Step = 'program' | 'days' | 'preferences' | 'stats' | 'bench-modules';

export const Onboarding: React.FC = () => {
    const { state } = useLocation();
    const { registerUser, user, switchProgram, updateUserProfile } = useUser();
    const { t, tObject, tArray } = useLanguage();
    const navigate = useNavigate();
    const codeword = state?.codeword;

    const [step, setStep] = useState<Step>('program');
    const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [preferences, setPreferences] = useState<Record<string, string>>({
        "push-a-leg-primary": "Hack Squat",
        "push-b-fly": "Pec-Dec",
        "push-b-leg-secondary": "Front Squats"
    });

    const [benchModules, setBenchModules] = useState<{
        tricepGiantSet: boolean;
        behindNeckPress: boolean;
        weightedPullups: boolean;
        accessories: boolean;
        legDays: boolean;
    }>({
        tricepGiantSet: true,
        behindNeckPress: true,
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

    // ... (rest of code)



    useEffect(() => {
        if (!codeword && !user) {
            navigate('/');
        }
    }, [codeword, user, navigate]);

    const handleProgramSelect = (pid: string) => {
        setSelectedProgramId(pid);
        if (pid === PENCILNECK_PROGRAM.id || pid === SKELETON_PROGRAM.id) {
            setStep('days');
        } else if (pid === BENCH_DOMINATION_PROGRAM.id) {
            setStep('bench-modules');
        } else if (pid === PEACHY_CONFIG.id) {
            setStep('days');
        } else if (pid === PAIN_GLORY_CONFIG.id) {
            setStep('days');
        } else if (pid === TRINARY_CONFIG.id) {
            // Trinary goes directly to stats - no schedule selection
            setStep('stats');
        } else {
            setStep('stats');
        }
    };

    const handleDayToggle = (dayIndex: number) => {
        // Target count depends on program
        const targetCount = selectedProgramId === SKELETON_PROGRAM.id ? 3 : 4;

        setSelectedDays(prev => {
            if (prev.includes(dayIndex)) {
                return prev.filter(d => d !== dayIndex);
            } else {
                if (prev.length >= targetCount) return prev;
                return [...prev, dayIndex].sort();
            }
        });
    };

    const handlePrefChange = (key: string, value: string) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Handle mobile keyboards sending comma (e.g. "100,5")
        const sanitizedValue = value.replace(',', '.');
        const numValue = parseFloat(sanitizedValue);

        setStats(prev => ({
            ...prev,
            [name]: isNaN(numValue) ? 0 : numValue
        }));
    };

    const handlePencilneckSubmit = async () => {
        if (user) {
            // Switch Mode
            await updateUserProfile({
                exercisePreferences: preferences,
                selectedDays: selectedDays
            });
            await switchProgram(PENCILNECK_PROGRAM.id);
        } else {
            // New User Mode
            const zeroStats: LiftingStats = {
                pausedBench: 0,
                wideGripBench: 0,
                spotoPress: 0,
                lowPinPress: 0
            };
            await registerUser(codeword, zeroStats, PENCILNECK_PROGRAM.id, selectedDays, preferences);
        }
        navigate('/app/dashboard');
    };

    const handleSkeletonSubmit = async () => {
        // Skeleton needs 3 days
        if (selectedDays.length !== 3) {
            alert("Please select exactly 3 training days.");
            return;
        }

        if (user) {
            // Switch Mode
            await updateUserProfile({
                selectedDays: selectedDays
            });
            await switchProgram(SKELETON_PROGRAM.id);
        } else {
            // New User Mode
            const zeroStats: LiftingStats = {
                pausedBench: 0,
                wideGripBench: 0,
                spotoPress: 0,
                lowPinPress: 0
            };
            await registerUser(codeword, zeroStats, SKELETON_PROGRAM.id, selectedDays, {});
        }
        navigate('/app/dashboard');
    };

    const handlePeachySubmit = async () => {
        if (selectedDays.length !== 4) {
            alert("Please select exactly 4 training days.");
            return;
        }

        if (user) {
            await updateUserProfile({ selectedDays });
            await switchProgram(PEACHY_CONFIG.id);
        } else {
            const zeroStats: LiftingStats = { pausedBench: 0, wideGripBench: 0, spotoPress: 0, lowPinPress: 0 };
            await registerUser(codeword, zeroStats, PEACHY_CONFIG.id, selectedDays, {});
        }
        navigate('/app/dashboard');
    };

    const handlePainGlorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const deadlift1RM = (stats as any).conventionalDeadlift || 0;
        const squat1RM = (stats as any).lowBarSquat || 0;

        if (deadlift1RM <= 0 || squat1RM <= 0) {
            alert("Please enter valid 1RM values for both lifts.");
            return;
        }

        const painGloryStats = {
            ...stats,
            conventionalDeadlift: deadlift1RM,
            lowBarSquat: squat1RM
        };

        const initialDeficitWeight = Math.floor((deadlift1RM * 0.45) / 2.5) * 2.5;

        try {
            if (user) {
                await updateUserProfile({
                    stats: painGloryStats,
                    selectedDays: selectedDays.length === 4 ? selectedDays : [1, 2, 4, 5],
                    painGloryStatus: {
                        deficitSnatchGripWeight: initialDeficitWeight,
                        squatProgress: 0
                    }
                });
                await switchProgram(PAIN_GLORY_CONFIG.id);
            } else {
                if (!codeword) throw new Error("No codeword found. Please restart.");
                // @ts-ignore
                await registerUser(codeword, painGloryStats, PAIN_GLORY_CONFIG.id, selectedDays.length === 4 ? selectedDays : [1, 2, 4, 5], {});
            }
            navigate('/app/dashboard');
        } catch (err: any) {
            console.error("Registration failed:", err);
            alert("Failed to build program: " + (err.message || "Unknown error"));
        }
    };

    const handleTrinarySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const bench1RM = (stats as any).trinaryBench || 0;
        const deadlift1RM = (stats as any).trinaryDeadlift || 0;
        const squat1RM = (stats as any).trinarySquat || 0;

        if (bench1RM <= 0 || deadlift1RM <= 0 || squat1RM <= 0) {
            alert("Please enter valid 1RM values for all three lifts.");
            return;
        }

        const trinaryStats = {
            ...stats,
            trinaryBench1RM: bench1RM,
            trinaryDeadlift1RM: deadlift1RM,
            trinarySquat1RM: squat1RM
        };

        const initialTrinaryStatus = {
            completedWorkouts: 0,
            currentBlock: 1,
            bench1RM: bench1RM,
            deadlift1RM: deadlift1RM,
            squat1RM: squat1RM,
            workoutLog: [],
            cycleNumber: 1,
            isDeload: false
        };

        try {
            if (user) {
                await updateUserProfile({
                    stats: trinaryStats,
                    trinaryStatus: initialTrinaryStatus
                });
                await switchProgram(TRINARY_CONFIG.id);
            } else {
                if (!codeword) throw new Error("No codeword found. Please restart.");
                // Register new user and then update trinaryStatus
                await registerUser(codeword, trinaryStats, TRINARY_CONFIG.id, [], {});
                // Set trinaryStatus after registration
                const userRef = doc(db, 'users', codeword.toLowerCase());
                await updateDoc(userRef, {
                    trinaryStatus: initialTrinaryStatus
                });
            }
            navigate('/app/dashboard');
        } catch (err: any) {
            console.error("Registration failed:", err);
            alert("Failed to build program: " + (err.message || "Unknown error"));
        }
    };

    const handleBenchDominationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (stats.pausedBench <= 0) {
            alert("Please enter a valid Paused Bench 1RM greater than 0.");
            return;
        }

        const finalStats = {
            pausedBench: stats.pausedBench,
            wideGripBench: stats.wideGripBench > 0 ? stats.wideGripBench : Math.floor((stats.pausedBench * 0.92) / 2.5) * 2.5,
            spotoPress: stats.spotoPress > 0 ? stats.spotoPress : Math.floor((stats.pausedBench * 0.95) / 2.5) * 2.5,
            lowPinPress: stats.lowPinPress > 0 ? stats.lowPinPress : Math.floor((stats.pausedBench * 0.88) / 2.5) * 2.5,
        };

        try {
            if (user) {
                // Switch Mode
                await updateUserProfile({
                    stats: finalStats,
                    benchDominationModules: benchModules
                });
                await switchProgram(BENCH_DOMINATION_PROGRAM.id);
            } else {
                // New User Mode
                if (!codeword) throw new Error("No codeword found. Please restart.");
                // @ts-ignore
                await registerUser(codeword, finalStats, BENCH_DOMINATION_PROGRAM.id, [], {}, benchModules);
            }
            navigate('/app/dashboard');
        } catch (err: any) {
            console.error("Registration failed:", err);
            alert("Failed to build program: " + (err.message || "Unknown error"));
        }
    };

    // Render Steps

    if (step === 'program') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-5xl space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">{t('onboarding.selectProtocol')}</h1>
                        <p className="text-muted-foreground">{t('onboarding.choosePath')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Bench Domination Card */}
                        <Card
                            className="overflow-hidden cursor-pointer hover:border-primary transition-all hover:scale-105 group"
                            onClick={() => handleProgramSelect(BENCH_DOMINATION_PROGRAM.id)}
                        >
                            <div className="h-48 bg-black relative flex items-center justify-center">
                                <img src="/benchdomination.png" alt="Bench Domination" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-4">
                                    <h3 className="text-xl font-bold text-white leading-tight">{tObject('onboarding.programs.benchDomination').name}</h3>
                                </div>
                            </div>
                            <CardContent className="pt-4 p-4">
                                <p className="text-muted-foreground text-xs mb-3">
                                    {tObject('onboarding.programs.benchDomination').description}
                                </p>
                                <ul className="space-y-1 text-xs">
                                    {tArray('onboarding.programs.benchDomination.features').map((feature, i) => (
                                        <li key={i} className="flex items-center"><CheckCircle2 className="mr-2 h-3 w-3 text-green-500" /> {feature}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Pencilneck Eradication Card */}
                        <Card
                            className="overflow-hidden cursor-pointer hover:border-primary transition-all hover:scale-105 group"
                            onClick={() => handleProgramSelect(PENCILNECK_PROGRAM.id)}
                        >
                            <div className="h-48 bg-black relative flex items-center justify-center">
                                <img src="/pencilneck.png" alt="Pencilneck Eradication" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-4">
                                    <h3 className="text-xl font-bold text-white leading-tight">{tObject('onboarding.programs.pencilneck').name}</h3>
                                </div>
                            </div>
                            <CardContent className="pt-4 p-4">
                                <p className="text-muted-foreground text-xs mb-3">
                                    {tObject('onboarding.programs.pencilneck').description}
                                </p>
                                <ul className="space-y-1 text-xs">
                                    {tArray('onboarding.programs.pencilneck.features').map((feature, i) => (
                                        <li key={i} className="flex items-center"><CheckCircle2 className="mr-2 h-3 w-3 text-green-500" /> {feature}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Skeleton to Threat Card */}
                        <Card
                            className="overflow-hidden cursor-pointer hover:border-primary transition-all hover:scale-105 group"
                            onClick={() => handleProgramSelect(SKELETON_PROGRAM.id)}
                        >
                            <div className="h-48 bg-black relative flex items-center justify-center">
                                <img src="/SKELETON.png" alt="Skeleton Transformation" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-4">
                                    <h3 className="text-xl font-bold text-white leading-tight">{tObject('onboarding.programs.skeleton').name}</h3>
                                </div>
                            </div>
                            <CardContent className="pt-4 p-4">
                                <p className="text-muted-foreground text-xs mb-3">
                                    {tObject('onboarding.programs.skeleton').description}
                                </p>
                                <ul className="space-y-1 text-xs">
                                    {tArray('onboarding.programs.skeleton.features').map((feature, i) => (
                                        <li key={i} className="flex items-center"><CheckCircle2 className="mr-2 h-3 w-3 text-green-500" /> {feature}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Peachy Card */}
                        <Card
                            className="overflow-hidden cursor-pointer hover:border-primary transition-all hover:scale-105 group"
                            onClick={() => handleProgramSelect(PEACHY_CONFIG.id)}
                        >
                            <div className="h-48 bg-black relative flex items-center justify-center">
                                <img src="/peachy.png" alt="Peachy Plan" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-4">
                                    <h3 className="text-xl font-bold text-white leading-tight">{tObject('onboarding.programs.peachy').name}</h3>
                                </div>
                            </div>
                            <CardContent className="pt-4 p-4">
                                <p className="text-muted-foreground text-xs mb-3">
                                    {tObject('onboarding.programs.peachy').description}
                                </p>
                                <ul className="space-y-1 text-xs">
                                    {tArray('onboarding.programs.peachy.features').map((feature, i) => (
                                        <li key={i} className="flex items-center"><CheckCircle2 className="mr-2 h-3 w-3 text-green-500" /> {feature}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Pain & Glory Card */}
                        <Card
                            className="overflow-hidden cursor-pointer hover:border-primary transition-all hover:scale-105 group"
                            onClick={() => handleProgramSelect(PAIN_GLORY_CONFIG.id)}
                        >
                            <div className="h-48 bg-black relative flex items-center justify-center">
                                <img src="/painglory.png" alt="Pain & Glory" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-4">
                                    <h3 className="text-xl font-bold text-white leading-tight">{tObject('onboarding.programs.painGlory').name}</h3>
                                </div>
                            </div>
                            <CardContent className="pt-4 p-4">
                                <p className="text-muted-foreground text-xs mb-3">
                                    {tObject('onboarding.programs.painGlory').description}
                                </p>
                                <ul className="space-y-1 text-xs">
                                    {tArray('onboarding.programs.painGlory.features').map((feature, i) => (
                                        <li key={i} className="flex items-center"><CheckCircle2 className="mr-2 h-3 w-3 text-green-500" /> {feature}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Trinary Card */}
                        <Card
                            className="overflow-hidden cursor-pointer hover:border-primary transition-all hover:scale-105 group"
                            onClick={() => handleProgramSelect('trinary')}
                        >
                            <div className="h-48 bg-black relative flex items-center justify-center">
                                <img src="/trinary.png" alt="Trinary" className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-4">
                                    <h3 className="text-xl font-bold text-white leading-tight">{tObject('onboarding.programs.trinary').name}</h3>
                                </div>
                            </div>
                            <CardContent className="pt-4 p-4">
                                <p className="text-muted-foreground text-xs mb-3">
                                    {tObject('onboarding.programs.trinary').description}
                                </p>
                                <ul className="space-y-1 text-xs">
                                    {tArray('onboarding.programs.trinary.features').map((feature, i) => (
                                        <li key={i} className="flex items-center"><CheckCircle2 className="mr-2 h-3 w-3 text-green-500" /> {feature}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <Button variant="ghost" onClick={() => navigate('/')} className="mx-auto block">
                        {t('common.cancel')}
                    </Button>
                </div>
            </div>
        );
    }

    if (step === 'bench-modules') {
        const ModuleToggle = ({
            title,
            desc,
            isOn,
            onToggle,
            mandatory = false,
            recommended = false
        }: { title: string, desc: string, isOn: boolean, onToggle: () => void, mandatory?: boolean, recommended?: boolean }) => (
            <div className={`flex items-start justify-between p-4 border rounded-lg ${isOn ? 'bg-primary/5 border-primary/20' : 'bg-background hover:bg-muted/50'} cursor-pointer`} onClick={!mandatory ? onToggle : undefined}>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{title}</h4>
                        {mandatory && <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-bold">REQUIRED</span>}
                        {recommended && !mandatory && <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-bold">RECOMMENDED</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${isOn ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isOn ? 'left-5' : 'left-1'}`}></div>
                </div>
            </div>
        );

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('program')} className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle>{t('onboarding.modules.title')}</CardTitle>
                        </div>
                        <CardDescription>{t('onboarding.modules.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
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
                                onToggle={() => setBenchModules(p => ({ ...p, tricepGiantSet: !p.tricepGiantSet }))}
                                recommended
                            />

                            <ModuleToggle
                                title={tObject('onboarding.modules.behindNeckPress').title}
                                desc={tObject('onboarding.modules.behindNeckPress').description}
                                isOn={benchModules.behindNeckPress}
                                onToggle={() => setBenchModules(p => ({ ...p, behindNeckPress: !p.behindNeckPress }))}
                            />

                            <ModuleToggle
                                title={tObject('onboarding.modules.weightedPullups').title}
                                desc={tObject('onboarding.modules.weightedPullups').description}
                                isOn={benchModules.weightedPullups}
                                onToggle={() => setBenchModules(p => ({ ...p, weightedPullups: !p.weightedPullups }))}
                            />

                            <ModuleToggle
                                title={tObject('onboarding.modules.legDays').title}
                                desc={tObject('onboarding.modules.legDays').description}
                                isOn={benchModules.legDays}
                                onToggle={() => {
                                    setBenchModules(p => ({ ...p, legDays: !p.legDays }));
                                    if (!benchModules.legDays) {
                                        setSelectedDays([]);
                                    } else {
                                        setSelectedDays([1, 3, 4, 6]);
                                    }
                                }}
                            />
                            {!benchModules.legDays && (
                                <div className="p-4 bg-secondary/10 border border-primary/20 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-2 text-primary font-semibold">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{t('onboarding.modules.selectDays')}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Select optimal days for the 4 core bench sessions. We recommend giving yourself a rest day after the heavy Monday session if possible, but the default suggestion (M/W/Th/Sat) works well.</p>

                                    <div className="grid grid-cols-7 gap-1">
                                        {['M', 'T', 'W', 'Th', 'F', 'S', 'Su'].map((d, i) => {
                                            const dayNum = i + 1;
                                            const isSelected = selectedDays.includes(dayNum);
                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        const targetCount = 4;
                                                        setSelectedDays(prev => {
                                                            if (prev.includes(dayNum)) return prev.filter(x => x !== dayNum);
                                                            if (prev.length >= targetCount) return prev;
                                                            return [...prev, dayNum].sort();
                                                        });
                                                    }}
                                                    className={`aspect-square flex items-center justify-center rounded cursor-pointer text-sm font-bold border transition-colors ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                                                >
                                                    {d}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <p className="text-[10px] text-right text-muted-foreground">{selectedDays.length} / 4 selected</p>
                                </div>
                            )}

                            <ModuleToggle
                                title="Accessories"
                                desc="Dragon Flags, Y-Raises, Around-the-Worlds."
                                isOn={benchModules.accessories}
                                onToggle={() => setBenchModules(p => ({ ...p, accessories: !p.accessories }))}
                            />
                        </div>

                        <div className="bg-muted p-3 rounded-lg text-xs italic text-muted-foreground text-center">
                            “The bench press and its variations are sacred and cannot be removed. Everything else is optional. Most mortals keep triceps + pull-ups.”
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={() => setStep('stats')}
                        >
                            Next: Calibration
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'days') {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const isSkeleton = selectedProgramId === SKELETON_PROGRAM.id;
        const isPainGlory = selectedProgramId === PAIN_GLORY_CONFIG.id;
        const targetCount = isSkeleton ? 3 : 4;

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('program')} className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle>Training Schedule</CardTitle>
                        </div>
                        <CardDescription>Select exactly {targetCount} training days per week.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-4 text-sm text-yellow-600 dark:text-yellow-400">
                            {isSkeleton ? (
                                <strong>Best results: at least 1 rest day between training days (e.g., Mon-Wed-Fri or Tue-Thu-Sat)</strong>
                            ) : selectedProgramId === PEACHY_CONFIG.id ? (
                                <strong>High Frequency: Select any 4 days. Suggestion: Mon/Wed/Fri/Sat with rest between Days 1-2 and 2-3.</strong>
                            ) : isPainGlory ? (
                                <strong>Classic 4-Day Split: Best results with a rest day in the middle (e.g., Mon-Tue-Thu-Fri).</strong>
                            ) : (
                                <strong>Best recovery: at least 1 rest day between Push B and the next Pull A (e.g., Mon-Tue-Thu-Fri)</strong>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {days.map((day, index) => (
                                <div key={day} className="flex items-center space-x-3 border rounded p-3 hover:bg-accent cursor-pointer" onClick={() => handleDayToggle(index + 1)}>
                                    <Checkbox
                                        id={day}
                                        checked={selectedDays.includes(index + 1)}
                                        onCheckedChange={() => handleDayToggle(index + 1)}
                                    />
                                    <label htmlFor={day} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                        {day}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <Button
                            className="w-full"
                            disabled={selectedDays.length !== targetCount}
                            onClick={() => {
                                if (isSkeleton) {
                                    handleSkeletonSubmit();
                                } else if (selectedProgramId === PEACHY_CONFIG.id) {
                                    handlePeachySubmit();
                                } else if (isPainGlory) {
                                    setStep('stats');
                                } else {
                                    setStep('preferences');
                                }
                            }}
                        >
                            {isSkeleton || selectedProgramId === PEACHY_CONFIG.id ? t('onboarding.buildProgram') : t('onboarding.nextExerciseSelection')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (step === 'preferences') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('days')} className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle>{t('onboarding.preferences.title')}</CardTitle>
                        </div>
                        <CardDescription>{t('onboarding.preferences.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Leg Primary */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Push A: Leg Primary</Label>
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

                        <div className="border-t my-4"></div>

                        {/* Chest Fly */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Push B: Chest Isolation</Label>
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

                        <div className="border-t my-4"></div>

                        {/* Leg Secondary */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Push B: Leg Secondary</Label>
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

                        <Button
                            className="w-full mt-6"
                            size="lg"
                            onClick={handlePencilneckSubmit}
                        >
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            FINALIZE PROTOCOL
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Default Stats Step - now conditional for Pain & Glory vs Bench Domination
    if (selectedProgramId === PAIN_GLORY_CONFIG.id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-950/20 to-red-950/10 flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg border-red-900/30 shadow-2xl bg-gradient-to-b from-card to-amber-950/5">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('program')} className="-ml-2">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle className="text-2xl text-amber-100">{t('onboarding.painGlory.calibrationTitle')}</CardTitle>
                        </div>
                        <CardDescription className="text-amber-200/70">
                            {t('onboarding.painGlory.calibrationDesc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePainGlorySubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="conventionalDeadlift" className="text-base text-amber-100">{t('onboarding.painGlory.deadliftLabel')}</Label>
                                    <Input
                                        id="conventionalDeadlift"
                                        name="conventionalDeadlift"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 180"
                                        className="text-lg bg-amber-950/20 border-amber-900/30"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-amber-200/50">{t('onboarding.painGlory.deadliftHint')}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lowBarSquat" className="text-base text-amber-100">{t('onboarding.painGlory.squatLabel')}</Label>
                                    <Input
                                        id="lowBarSquat"
                                        name="lowBarSquat"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 140"
                                        className="text-lg bg-amber-950/20 border-amber-900/30"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-amber-200/50">{t('onboarding.painGlory.squatHint')}</p>
                                </div>
                            </div>

                            <div className="bg-red-950/30 border border-red-900/30 rounded p-3 text-sm text-amber-100/80">
                                <strong className="text-red-400">{t('onboarding.painGlory.scheduleTitle')}</strong><br />
                                {t('onboarding.painGlory.scheduleDesc')}
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg font-bold bg-gradient-to-r from-red-900 to-amber-900 hover:from-red-800 hover:to-amber-800" size="lg">
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                {t('onboarding.painGlory.buildButton')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Trinary stats form - heavy metal styled
    if (selectedProgramId === TRINARY_CONFIG.id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950 flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg border-zinc-700/50 shadow-2xl bg-gradient-to-b from-zinc-900 to-slate-950">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setStep('program')} className="-ml-2 text-zinc-400 hover:text-zinc-200">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <CardTitle className="text-2xl bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 bg-clip-text text-transparent">{t('onboarding.trinary.calibrationTitle')}</CardTitle>
                        </div>
                        <CardDescription className="text-zinc-400">
                            {t('onboarding.trinary.calibrationDesc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center mb-6">
                            <img src="/trinary.png" alt="Trinary" className="w-32 h-32 object-contain opacity-80" />
                        </div>

                        <form onSubmit={handleTrinarySubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="trinaryBench" className="text-base text-zinc-200">{t('onboarding.trinary.benchLabel')}</Label>
                                    <Input
                                        id="trinaryBench"
                                        name="trinaryBench"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 100"
                                        className="text-lg bg-zinc-800/50 border-zinc-700/50 text-zinc-100"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-zinc-500">{t('onboarding.trinary.benchHint')}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="trinaryDeadlift" className="text-base text-zinc-200">{t('onboarding.trinary.deadliftLabel')}</Label>
                                    <Input
                                        id="trinaryDeadlift"
                                        name="trinaryDeadlift"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 180"
                                        className="text-lg bg-zinc-800/50 border-zinc-700/50 text-zinc-100"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-zinc-500">{t('onboarding.trinary.deadliftHint')}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="trinarySquat" className="text-base text-zinc-200">{t('onboarding.trinary.squatLabel')}</Label>
                                    <Input
                                        id="trinarySquat"
                                        name="trinarySquat"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 140"
                                        className="text-lg bg-zinc-800/50 border-zinc-700/50 text-zinc-100"
                                        onChange={handleStatsChange}
                                        step="2.5"
                                        required
                                    />
                                    <p className="text-xs text-zinc-500">{t('onboarding.trinary.squatHint')}</p>
                                </div>
                            </div>

                            <div className="bg-zinc-800/50 border border-zinc-700/30 rounded p-3 text-sm text-zinc-300">
                                <strong className="text-zinc-200">{t('onboarding.trinary.scheduleTitle')}</strong><br />
                                {t('onboarding.trinary.scheduleDesc')}
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg font-bold bg-gradient-to-r from-zinc-700 to-slate-700 hover:from-zinc-600 hover:to-slate-600 text-zinc-100" size="lg">
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                {t('onboarding.trinary.buildButton')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Bench Domination stats form
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-lg border-primary/20 shadow-2xl">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setStep('bench-modules')} className="-ml-2">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <CardTitle className="text-2xl">Calibration Phase</CardTitle>
                    </div>
                    <CardDescription>
                        Enter your current 1 Rep Max (1RM) for the following lifts. Be honest. The program depends on accurate inputs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleBenchDominationSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="pausedBench" className="text-base">Paused Bench Press 1RM (Primary)</Label>
                                <Input
                                    id="pausedBench"
                                    name="pausedBench"
                                    type="number"
                                    min="0"
                                    placeholder="e.g. 100"
                                    className="text-lg"
                                    onChange={handleStatsChange}
                                    step="0.1"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Competition style pause.</p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                                    <strong>These are optional but HIGHLY recommended.</strong> If left blank, the app will estimate:<br />
                                    • Wide-Grip ≈ 92% of your paused bench<br />
                                    • Spoto Press ≈ 95% of your paused bench<br />
                                    • Low Pin Press ≈ 88% of your paused bench<br />
                                    Entering your real 1RMs for these variations will give far more accurate and safer weights.
                                </p>
                                <div className="space-y-2">
                                    <Label htmlFor="wideGripBench">Wide-Grip Bench 1RM (Optional)</Label>
                                    <Input
                                        id="wideGripBench"
                                        name="wideGripBench"
                                        type="number"
                                        min="0"
                                        placeholder={stats.pausedBench > 0 ? `Est: ${Math.floor((stats.pausedBench * 0.92) / 2.5) * 2.5}` : "e.g. 90"}
                                        onChange={handleStatsChange}
                                        step="0.5"
                                        className={!stats.wideGripBench ? "italic text-muted-foreground" : ""}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="spotoPress">Spoto Press 1RM (Optional)</Label>
                                    <Input
                                        id="spotoPress"
                                        name="spotoPress"
                                        type="number"
                                        min="0"
                                        placeholder={stats.pausedBench > 0 ? `Est: ${Math.floor((stats.pausedBench * 0.95) / 2.5) * 2.5}` : "e.g. 95"}
                                        onChange={handleStatsChange}
                                        step="0.5"
                                        className={!stats.spotoPress ? "italic text-muted-foreground" : ""}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lowPinPress">Low Pin Press 1RM (Optional)</Label>
                                <Input
                                    id="lowPinPress"
                                    name="lowPinPress"
                                    type="number"
                                    min="0"
                                    placeholder={stats.pausedBench > 0 ? `Est: ${Math.floor((stats.pausedBench * 0.88) / 2.5) * 2.5}` : "e.g. 105"}
                                    onChange={handleStatsChange}
                                    step="0.5"
                                    className={!stats.lowPinPress ? "italic text-muted-foreground" : ""}
                                />
                                <p className="text-xs text-muted-foreground">Pins at your sticking point.</p>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg font-bold" size="lg">
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            BUILD MY PROGRAM
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
