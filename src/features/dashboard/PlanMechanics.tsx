import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import type { UserProfile, WorkoutDay } from '../../types';
import { carryScore, limiterAdvice } from '../atlas/carries';
import { REGION_COSTS, recommendSwap, type RegionReport } from '../eventHorizon/costAwareSwaps';
import { QUALITIES, applyMutation, phenotype, proposeMutation, type Quality } from '../projectChimera/mutation';
import { BLOCKS, baseWeeklySets, blockFor } from '../../data/plans/projectChimera';
import { accuracyBand, accuracyTrend } from '../oracle/prediction';
import { proposeKneeSwap } from '../quadfather/roles';
import { analyseWeek, PLAN_RULES } from '../../lib/volumeAnalysis';
import type { ExerciseResolver } from '../../data/exercises';

const RECOVERY = [
    { id: 'recovered' as const, label: 'Recovered' },
    { id: 'somewhat-fatigued' as const, label: 'Somewhat fatigued' },
    { id: 'performance-impaired' as const, label: 'Performance impaired' },
];

const REGIONS = Object.keys(REGION_COSTS);

export function PlanMechanics({
    user,
    planId,
    week,
    nextDay,
    days,
    exerciseResolver,
    updateUserProfile,
}: {
    user: UserProfile;
    planId: string;
    week: number;
    nextDay?: WorkoutDay;
    days?: WorkoutDay[];
    exerciseResolver?: ExerciseResolver;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}) {
    if (planId === 'redline') return <RedlineRecovery user={user} updateUserProfile={updateUserProfile} />;
    if (planId === 'atlas') return <AtlasScore user={user} />;
    if (planId === 'event-horizon') return <EventHorizonReports user={user} week={week} nextDay={nextDay} updateUserProfile={updateUserProfile} />;
    if (planId === 'project-chimera') return <ChimeraMutation user={user} week={week} updateUserProfile={updateUserProfile} />;
    if (planId === 'oracle') return <OracleAccuracy user={user} updateUserProfile={updateUserProfile} />;
    if (planId === 'quadfather') return <QuadfatherOffers user={user} week={week} updateUserProfile={updateUserProfile} />;
    if (planId === 'overhead-dominion' && days && exerciseResolver) {
        return <SplitDeltWidget days={days} week={week} resolver={exerciseResolver} />;
    }
    if (planId === 'pain-and-glory') return <PainGloryFifthDay user={user} updateUserProfile={updateUserProfile} />;
    if (planId === 'lazarus' && !user.lazarusStatus?.breakMonths) {
        return <LazarusMemorySetup user={user} updateUserProfile={updateUserProfile} />;
    }
    return null;
}

function RedlineRecovery({
    user,
    updateUserProfile,
}: {
    user: UserProfile;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}) {
    const current = user.redlineStatus?.nextRecovery;
    const [saving, setSaving] = useState(false);
    const save = async (response: (typeof RECOVERY)[number]['id']) => {
        setSaving(true);
        try {
            await updateUserProfile({
                redlineStatus: {
                    ...user.redlineStatus,
                    nextRecovery: { response, confirmed: true, recordedAt: new Date().toISOString() },
                },
            });
        } finally {
            setSaving(false);
        }
    };
    return (
        <Card className="col-span-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">How recovered are you?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    Confirmed before the session. Somewhat fatigued trims burn volume; impaired also drops finishers.
                </p>
                <div className="flex flex-wrap gap-2">
                    {RECOVERY.map(option => (
                        <Button
                            key={option.id}
                            size="sm"
                            variant={current?.confirmed && current.response === option.id ? 'default' : 'outline'}
                            disabled={saving}
                            onClick={() => void save(option.id)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function AtlasScore({ user }: { user: UserProfile }) {
    const carries = user.atlasStatus?.carries ?? [];
    const latest = carries.at(-1);
    const advice = limiterAdvice(carries.map(entry => ({
        exerciseId: entry.exerciseId,
        seconds: entry.seconds,
        loadKg: entry.loadKg,
        implements: (entry.implements === 2 ? 2 : 1) as 1 | 2,
        limiter: entry.limiter as 'grip' | 'trunk' | 'breathing' | 'upper-back' | 'legs' | 'none' | undefined,
    })));
    const score = latest
        ? carryScore({
            exerciseId: latest.exerciseId,
            seconds: latest.seconds,
            loadKg: latest.loadKg,
            implements: latest.implements === 2 ? 2 : 1,
        })
        : undefined;
    return (
        <Card className="col-span-full md:col-span-3">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Carry score</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{score != null ? `${score} kg·min` : 'Log a carry'}</div>
                {latest?.limiter && latest.limiter !== 'none' && (
                    <p className="text-xs text-muted-foreground">Last limiter: {latest.limiter}</p>
                )}
                {advice && <p className="text-sm">{advice}</p>}
            </CardContent>
        </Card>
    );
}

function EventHorizonReports({
    user,
    week,
    nextDay,
    updateUserProfile,
}: {
    user: UserProfile;
    week: number;
    nextDay?: WorkoutDay;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}) {
    const [region, setRegion] = useState(REGIONS[0] ?? 'lowerBack');
    const [report, setReport] = useState<RegionReport>('normal');
    const [saving, setSaving] = useState(false);
    const exposures = (user.eventHorizonStatus?.reports ?? []).map(entry => ({
        exerciseId: entry.exerciseId,
        region: entry.region,
        report: entry.report,
        comparable: entry.comparable,
    }));
    const planned = (nextDay?.exercises ?? []).filter(exercise => exercise.exerciseId);
    const recs = report === 'normal'
        ? []
        : planned.flatMap(exercise => {
            const rec = recommendSwap(exercise.exerciseId!, region, report, exposures);
            return rec ? [rec] : [];
        });

    const saveReport = async () => {
        setSaving(true);
        try {
            const reports = [...(user.eventHorizonStatus?.reports ?? []), {
                week,
                region,
                report,
                exerciseId: planned[0]?.exerciseId ?? region,
                comparable: true,
            }];
            await updateUserProfile({
                eventHorizonStatus: { ...user.eventHorizonStatus, reports: reports.slice(-64) },
            });
        } finally {
            setSaving(false);
        }
    };

    const accept = async (fromId: string, toId: string | string[]) => {
        setSaving(true);
        try {
            await updateUserProfile({
                eventHorizonStatus: {
                    ...user.eventHorizonStatus,
                    acceptedSwaps: { ...(user.eventHorizonStatus?.acceptedSwaps ?? {}), [fromId]: toId },
                },
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="col-span-full">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Region report</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    {REGIONS.map(item => (
                        <Button key={item} size="sm" variant={region === item ? 'default' : 'outline'} onClick={() => setRegion(item)}>
                            {item}
                        </Button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    {(['normal', 'strained', 'impaired'] as const).map(item => (
                        <Button key={item} size="sm" variant={report === item ? 'default' : 'outline'} onClick={() => setReport(item)}>
                            {item}
                        </Button>
                    ))}
                    <Button size="sm" disabled={saving} onClick={() => void saveReport()}>Save report</Button>
                </div>
                {recs.map(rec => (
                    <div key={rec.plannedExerciseId} className="space-y-2 border border-border p-3">
                        <p className="text-sm">{rec.message}</p>
                        <div className="flex flex-wrap gap-2">
                            {rec.options.map(option => (
                                <Button
                                    key={option.exerciseId}
                                    size="sm"
                                    variant="outline"
                                    disabled={saving}
                                    onClick={() => void accept(rec.plannedExerciseId, option.exerciseId)}
                                >
                                    {option.name}
                                </Button>
                            ))}
                            {rec.split && (
                                <Button size="sm" variant="outline" disabled={saving} onClick={() => void accept(rec.plannedExerciseId, rec.split!.exerciseIds)}>
                                    Split: {rec.split.rationale}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function ChimeraMutation({
    user,
    week,
    updateUserProfile,
}: {
    user: UserProfile;
    week: number;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}) {
    const block = blockFor(week);
    const endWeek = BLOCKS[block - 1]?.at(-1);
    const [fatigue, setFatigue] = useState<Record<Quality, number>>({
        squat: 2, hinge: 2, push: 2, pull: 2, unilateral: 2, hypertrophy: 2,
    });
    const [saving, setSaving] = useState(false);
    const current = baseWeeklySets();
    const proposal = useMemo(() => proposeMutation(
        block,
        QUALITIES.map(quality => ({
            quality,
            comparableExposures: 3,
            trend: 0,
            fatigue: fatigue[quality] ?? 2,
            stalled: (fatigue[quality] ?? 2) >= 3,
        })),
        current,
    ), [block, fatigue, current]);
    const shown = phenotype(QUALITIES.map(quality => ({
        quality, comparableExposures: 3, trend: 0, fatigue: fatigue[quality] ?? 2, stalled: false,
    })));

    if (week !== endWeek) return null;

    const confirm = async () => {
        setSaving(true);
        try {
            const confirmed = proposal.components.map(component => ({ ...component, confirmed: true }));
            const nextAbs = applyMutation(current, confirmed as Parameters<typeof applyMutation>[1]);
            const deltas: Record<string, number> = {};
            for (const quality of QUALITIES) {
                const delta = nextAbs[quality] - current[quality];
                if (delta) deltas[quality] = delta;
            }
            const nextBlock = Math.min(4, block + 1);
            await updateUserProfile({
                projectChimeraStatus: {
                    ...user.projectChimeraStatus,
                    allocation: { ...(user.projectChimeraStatus?.allocation ?? {}), [nextBlock]: deltas },
                    phenotype: [...(user.projectChimeraStatus?.phenotype ?? []), { block, label: shown.label }],
                },
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="col-span-full">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Block {block} reallocation</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{proposal.message} {shown.caveat}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {QUALITIES.map(quality => (
                        <label key={quality} className="text-xs space-y-1">
                            <span className="uppercase tracking-widest text-muted-foreground">{quality} fatigue</span>
                            <input
                                type="range"
                                min={0}
                                max={4}
                                value={fatigue[quality]}
                                onChange={event => setFatigue(currentFatigue => ({ ...currentFatigue, [quality]: Number(event.target.value) }))}
                                className="w-full"
                            />
                        </label>
                    ))}
                </div>
                {proposal.components.map((component, index) => (
                    <p key={`${component.quality}-${index}`} className="text-sm">{component.rationale}</p>
                ))}
                <p className="text-xs text-muted-foreground">Phenotype: {shown.label}</p>
                <Button size="sm" disabled={saving || !proposal.components.length} onClick={() => void confirm()}>
                    Confirm proposed changes
                </Button>
            </CardContent>
        </Card>
    );
}

function OracleAccuracy({
    user,
    updateUserProfile,
}: {
    user: UserProfile;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}) {
    const errors = (user.oracleStatus?.errors ?? []).map(entry => entry.error);
    const band = accuracyBand(errors);
    const trend = accuracyTrend(errors);
    const enabled = Boolean(user.oracleStatus?.modelRefinementEnabled);
    return (
        <Card className="col-span-full md:col-span-3">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Prediction accuracy</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold capitalize">{band.band}</div>
                <p className="text-xs text-muted-foreground">{band.note} Trend: {trend}.</p>
                <Button
                    size="sm"
                    variant={enabled ? 'default' : 'outline'}
                    onClick={() => void updateUserProfile({
                        oracleStatus: { ...user.oracleStatus, modelRefinementEnabled: !enabled },
                    })}
                >
                    {enabled ? 'Model refinement on' : 'Enable model refinement (±7.5%)'}
                </Button>
            </CardContent>
        </Card>
    );
}

function QuadfatherOffers({
    user,
    week,
    updateUserProfile,
}: {
    user: UserProfile;
    week: number;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}) {
    const pending = [...(user.quadfatherStatus?.kneeFeedback ?? [])]
        .reverse()
        .find(entry => entry.severity !== 'normal' && !entry.acceptedSwap);
    if (!pending) return null;
    const offer = proposeKneeSwap(pending.exerciseId, pending.severity);
    if (!offer) return null;
    const accept = async () => {
        if (!offer.to) return;
        const kneeFeedback = (user.quadfatherStatus?.kneeFeedback ?? []).map(entry =>
            entry === pending ? { ...entry, acceptedSwap: offer.to } : entry);
        await updateUserProfile({
            quadfatherStatus: { ...user.quadfatherStatus, kneeFeedback },
        });
    };
    return (
        <Card className="col-span-full">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Knee feedback</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm">{offer.message}</p>
                {offer.to && <Button size="sm" onClick={() => void accept()}>Confirm swap · week {week}</Button>}
            </CardContent>
        </Card>
    );
}

function SplitDeltWidget({
    days,
    week,
    resolver,
}: {
    days: WorkoutDay[];
    week: number;
    resolver: ExerciseResolver;
}) {
    const analysis = analyseWeek(days, week, resolver, PLAN_RULES['overhead-dominion'] ?? { kind: 'specialisation', specialisation: ['shoulders'], splitDelts: true });
    const split = analysis.splitDelts;
    if (!split) return null;
    return (
        <Card className="col-span-full md:col-span-3">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Split delts</CardTitle></CardHeader>
            <CardContent>
                <dl className="grid grid-cols-3 gap-3 text-center">
                    {(['frontDelt', 'sideDelt', 'rearDelt'] as const).map(head => (
                        <div key={head}>
                            <dt className="text-xs uppercase tracking-widest text-muted-foreground">{head.replace('Delt', '')}</dt>
                            <dd className="text-2xl font-bold">{split[head]}</dd>
                        </div>
                    ))}
                </dl>
                {analysis.findings[0] && <p className="mt-2 text-sm text-muted-foreground">{analysis.findings[0].message}</p>}
            </CardContent>
        </Card>
    );
}

function PainGloryFifthDay({
    user,
    updateUserProfile,
}: {
    user: UserProfile;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}) {
    const prefs = user.planPreferences?.['pain-and-glory'];
    const on = prefs?.exerciseSelections?.fifthDay === 'on';
    const toggle = async () => {
        const now = new Date().toISOString();
        await updateUserProfile({
            planPreferences: {
                ...(user.planPreferences ?? {}),
                'pain-and-glory': {
                    scheduleMode: prefs?.scheduleMode ?? '4day',
                    updatedAt: now,
                    exerciseSelections: { ...(prefs?.exerciseSelections ?? {}), fifthDay: on ? 'off' : 'on' },
                },
            },
        });
    };
    return (
        <Card className="col-span-full md:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Optional Saturday</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Fills chest, delts, quads, arms and calves — the groups the four-day under-doses.</p>
                <Button size="sm" variant={on ? 'default' : 'outline'} onClick={() => void toggle()}>
                    {on ? 'Fifth day on' : 'Enable fifth day'}
                </Button>
            </CardContent>
        </Card>
    );
}

function LazarusMemorySetup({
    user,
    updateUserProfile,
}: {
    user: UserProfile;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}) {
    const [months, setMonths] = useState('6');
    const [injury, setInjury] = useState(false);
    const [preBreak, setPreBreak] = useState('');
    const save = async () => {
        const kg = Number(preBreak);
        await updateUserProfile({
            lazarusStatus: {
                ...user.lazarusStatus,
                breakMonths: Number(months) || 6,
                injuryReturn: injury,
                memoryCurve: {
                    ...(user.lazarusStatus?.memoryCurve ?? {}),
                    ...(kg > 0 ? { 'heel-elevated-goblet-squat': { preBreakKg: kg, source: 'self-reported' as const } } : {}),
                },
            },
        });
    };
    return (
        <Card className="col-span-full">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Memory Curve</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <label className="block text-sm">
                    Months away
                    <input className="mt-1 w-full border border-border bg-background px-3 py-2" type="number" min={3} value={months} onChange={event => setMonths(event.target.value)} />
                </label>
                <label className="block text-sm">
                    Last stable squat (kg)
                    <input className="mt-1 w-full border border-border bg-background px-3 py-2" type="number" min={0} value={preBreak} onChange={event => setPreBreak(event.target.value)} />
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={injury} onChange={event => setInjury(event.target.checked)} />
                    The break was caused by injury — this plan is not rehabilitation.
                </label>
                <Button size="sm" onClick={() => void save()}>Save Memory Curve</Button>
            </CardContent>
        </Card>
    );
}
