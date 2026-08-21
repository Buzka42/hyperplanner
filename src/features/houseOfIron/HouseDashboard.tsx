import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useLanguage } from '../../contexts/useTranslation';
import type { UserProfile } from '../../types';
import { useUser } from '../../contexts/UserContext';
import { EXERCISE_BY_ID } from '../../data/exercises/library';
import { HOUSE_LADDERS } from '../workout/progression/houseOfIron';
import { clampProgramWeek } from '../planLifecycle';
import { HOUSE_SESSION_DAY, houseBalance, recommendHouseSession, type HouseSessionId } from './recommendation';

const LABELS: Record<HouseSessionId, string> = {
    'push-a': 'Push A', 'pull-a': 'Pull A', 'push-b': 'Push B', 'pull-b': 'Pull B',
};

export const HouseDashboard = ({ user }: { user: UserProfile }) => {
    const { updateUserProfile } = useUser();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const start = user.programProgress?.['house-of-iron']?.startDate ?? user.startDate;
    const now = new Date().toISOString();
    const week = clampProgramWeek({ startDate: start, completedSessions: user.programProgress?.['house-of-iron']?.completedSessions, sessionsPerWeek: 4, maxWeeks: 8 });
    const allHistory = user.houseOfIronStatus?.sessionHistory ?? [];
    const weekStart = new Date(new Date(start ?? now).getTime() + (week - 1) * 7 * 86_400_000).getTime();
    const history = allHistory.filter(entry => new Date(entry.date).getTime() >= weekStart);
    const recommended = recommendHouseSession(history, now);
    const balance = houseBalance(history);
    const pl = language === 'pl';
    const [type, setType] = useState<'dumbbell' | 'kettlebell'>('dumbbell');
    const [count, setCount] = useState<1 | 2>(1);
    const [weight, setWeight] = useState('');
    const [equipment, setEquipment] = useState(user.houseOfIronStatus?.equipment ?? []);
    const [saving, setSaving] = useState(false);
    const [equipmentError, setEquipmentError] = useState('');
    const [preferred, setPreferred] = useState<'dumbbell' | 'kettlebell'>(user.houseOfIronStatus?.preferredImplement ?? 'dumbbell');
    const [resolving, setResolving] = useState<string | null>(null);
    const [actionError, setActionError] = useState('');

    const stageLabel = (stage: string): string => {
        const replacement = EXERCISE_BY_ID[stage];
        if (replacement) return pl ? `Trudniejszy wariant: ${replacement.name.pl}` : `Harder variation: ${replacement.name.en}`;
        const labels: Record<string, [string, string]> = {
            rom: ['Larger controlled range of motion', 'Większy kontrolowany zakres ruchu'],
            'pause-1s': ['One-second pause in the difficult position', 'Jednosekundowa pauza w trudnej pozycji'],
            'pause-2s': ['Two-second pause in the difficult position', 'Dwusekundowa pauza w trudnej pozycji'],
            'eccentric-3s': ['Three-second lowering phase', 'Trzysekundowa faza opuszczania'],
            'eccentric-4s': ['Four-second lowering phase', 'Czterosekundowa faza opuszczania'],
            'one-and-half': ['Approved 1.5-rep technique', 'Zatwierdzona technika 1,5 powtórzenia'],
            density: ['Same work in less block time', 'Ta sama praca w krótszym czasie bloku'],
            'heavier-equipment': ['A heavier implement would now be useful', 'Cięższe obciążenie będzie teraz przydatne'],
            deficit: ['Stable deficit for more range', 'Stabilny deficyt dla większego zakresu'],
            'feet-elevated': ['Feet-elevated push-up', 'Pompka z nogami na podwyższeniu'],
            'glute-bridge-floor-press': ['Glute-bridge floor press', 'Wyciskanie z podłogi w mostku biodrowym'],
        };
        return labels[stage]?.[pl ? 1 : 0] ?? stage.replaceAll('-', ' ');
    };

    const saveEquipment = async () => {
        if (!equipment.length) return;
        setSaving(true);
        setEquipmentError('');
        try {
            const selectedPreferred = equipment.some(item => item.type === preferred) ? preferred : equipment[0].type;
            await updateUserProfile({ houseOfIronStatus: { ...(user.houseOfIronStatus ?? {}), equipment, preferredImplement: selectedPreferred } });
        } catch {
            setEquipmentError(pl ? 'Nie udało się zapisać sprzętu. Sprawdź połączenie i spróbuj ponownie.' : 'Equipment could not be saved. Check your connection and try again.');
        } finally {
            setSaving(false);
        }
    };

    const resolveProgression = async (exerciseId: string, accept: boolean) => {
        setResolving(exerciseId);
        setActionError('');
        const status = user.houseOfIronStatus ?? {};
        const pending = { ...(status.pendingProgressions ?? {}) };
        const recommendation = pending[exerciseId];
        delete pending[exerciseId];
        const progression = { ...(status.progression ?? {}) };
        if (accept && recommendation) {
            const ladder = HOUSE_LADDERS[exerciseId] ?? ['reps', 'pause-1s', 'eccentric-3s', 'density', 'heavier-equipment'];
            const stageIndex = Math.max(0, ladder.indexOf(recommendation.stage));
            progression[exerciseId] = {
                ...(progression[exerciseId] ?? { consecutiveStalls: 0, cleanTopRangeExposures: 0 }),
                stageIndex,
                ...(EXERCISE_BY_ID[recommendation.stage] && { variationId: recommendation.stage }),
            };
        }
        try {
            await updateUserProfile({ houseOfIronStatus: { ...status, pendingProgressions: pending, progression } });
        } catch {
            setActionError(pl ? 'Nie udało się zapisać decyzji. Spróbuj ponownie.' : 'The progression decision could not be saved. Try again.');
        } finally {
            setResolving(null);
        }
    };

    const startNextCycle = async () => {
        const startedAt = new Date().toISOString();
        setSaving(true);
        setActionError('');
        try {
            await updateUserProfile({
                startDate: startedAt,
                programProgress: {
                    ...(user.programProgress ?? {}),
                    'house-of-iron': { completedSessions: 0, startDate: startedAt },
                },
            });
        } catch {
            setActionError(pl ? 'Nie udało się rozpocząć cyklu. Spróbuj ponownie.' : 'The next cycle could not be started. Try again.');
        } finally {
            setSaving(false);
        }
    };

    if (!user.houseOfIronStatus?.equipment?.length) return (
        <div className="instrument-page max-w-2xl space-y-6">
            <h1 className="text-4xl font-semibold">{pl ? 'Zbuduj swój dom' : 'Build your house'}</h1>
            <p className="text-muted-foreground">{pl ? 'Dodaj wszystkie hantle i kettle, których możesz używać. Wystarczy jeden.' : 'Add every dumbbell and kettlebell you can use. One is enough.'}</p>
            <div className="grid sm:grid-cols-3 gap-4">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{pl ? 'Typ' : 'Type'}<select value={type} onChange={event => setType(event.target.value as typeof type)} className="instrument-select"><option value="dumbbell">{pl ? 'Hantel' : 'Dumbbell'}</option><option value="kettlebell">Kettlebell</option></select></label>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{pl ? 'Liczba' : 'Count'}<select value={count} onChange={event => setCount(Number(event.target.value) as 1 | 2)} className="instrument-select"><option value={1}>{pl ? 'Jedna sztuka' : 'One'}</option><option value={2}>{pl ? 'Para' : 'Pair'}</option></select></label>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{pl ? 'Ciężar' : 'Weight'}<input value={weight} onChange={event => { setWeight(event.target.value); setEquipmentError(''); }} inputMode="decimal" placeholder="kg" className="block w-full min-h-11 bg-transparent border-b border-input text-foreground text-base focus:border-primary outline-none" /></label>
            </div>
            <Button variant="outline" onClick={() => {
                const kg = Number(weight.replace(',', '.'));
                if (kg <= 0 || !Number.isFinite(kg)) { setEquipmentError(pl ? 'Podaj prawidłowy ciężar większy od zera.' : 'Enter a valid weight above zero.'); return; }
                setEquipment(current => [...current, { id: `${type}-${kg}-${count}-${current.length}`, type, count, weightKg: kg }]);
                setWeight('');
            }}>{pl ? 'Dodaj obciążenie' : 'Add implement'}</Button>
            {equipmentError && <p role="alert" className="text-destructive">{equipmentError}</p>}
            <div>{equipment.map((item, index) => <div key={item.id} className="flex min-h-12 items-center justify-between border-b border-border py-2"><span>{item.type === 'dumbbell' ? (pl ? 'Hantel' : 'Dumbbell') : 'Kettlebell'} · {item.weightKg} kg · {item.count === 2 ? (pl ? 'para' : 'pair') : '1'}</span><button onClick={() => setEquipment(current => current.filter((_, i) => i !== index))} className="min-h-11 px-3 text-muted-foreground hover:text-foreground">{pl ? 'Usuń' : 'Remove'}</button></div>)}</div>
            {new Set(equipment.map(item => item.type)).size > 1 && <label className="block text-xs uppercase tracking-widest text-muted-foreground">{pl ? 'Preferowany typ' : 'Preferred type'}<select value={preferred} onChange={event => setPreferred(event.target.value as typeof preferred)} className="instrument-select"><option value="dumbbell">{pl ? 'Hantel' : 'Dumbbell'}</option><option value="kettlebell">Kettlebell</option></select></label>}
            <Button className="w-full min-h-14" size="lg" disabled={!equipment.length || saving} onClick={saveEquipment}>{saving ? (pl ? 'Zapisywanie…' : 'Saving…') : (pl ? 'Zapisz i rozpocznij' : 'Save and continue')}</Button>
        </div>
    );

    if (week > 8) return <div className="instrument-page max-w-3xl">
        <section className="border-y border-border py-8 space-y-4">
            <h1 className="text-3xl font-semibold">{pl ? 'Odbuduj dom' : 'Rebuild the house'}</h1>
            <p className="text-muted-foreground">{pl ? 'Zachowasz sprzęt, wybory i zaakceptowane poziomy. Tylko zdobyte progresje przechodzą dalej.' : 'Equipment, selections, and accepted levels stay. Only earned progressions carry forward.'}</p>
            {actionError && <p role="alert" className="text-destructive">{actionError}</p>}
            <Button className="w-full min-h-14" disabled={saving} onClick={startNextCycle}>{saving ? (pl ? 'Uruchamianie…' : 'Starting…') : (pl ? 'Rozpocznij kolejny cykl' : 'Start next cycle')}</Button>
        </section>
    </div>;

    return (
        <div className="instrument-page space-y-8">
            <section className="dashboard-command" aria-label={pl ? 'Zalecana sesja' : 'Recommended session'}>
                <p className="dashboard-command-label">{pl ? 'ZALECANA NASTĘPNA SESJA' : 'RECOMMENDED NEXT SESSION'}</p>
                <h1>{LABELS[recommended]}</h1>
                <p className="text-muted-foreground">{pl ? 'Rekomendacja równoważy push/pull i kolano/biodro. Możesz wybrać inną sesję.' : 'This recommendation restores push/pull and knee/hip balance. You may choose another session.'}</p>
                <Button size="lg" className="dashboard-start" onClick={() => navigate(`/app/workout/${week}/${HOUSE_SESSION_DAY[recommended]}`)}>
                    <Dumbbell className="h-5 w-5" /> {pl ? 'Rozpocznij' : 'Start session'}
                </Button>
            </section>

            <section>
                <h2 className="text-2xl font-semibold">{pl ? `Tydzień ${week} · Bilans domu` : `Week ${week} · House balance`}</h2>
                <dl className="spec-rows mt-4">
                    {[
                        [pl ? 'Góra push' : 'Upper push', balance.upperPush],
                        [pl ? 'Góra pull' : 'Upper pull', balance.upperPull],
                        [pl ? 'Dominacja kolana' : 'Knee dominant', balance.knee],
                        [pl ? 'Dominacja biodra' : 'Hip dominant', balance.hip],
                    ].map(([label, value]) => <div key={String(label)}><dt>{label}</dt><dd className="text-2xl tabular-nums">{value}</dd></div>)}
                </dl>
            </section>

            {Object.entries(user.houseOfIronStatus?.pendingProgressions ?? {}).length > 0 && <section className="space-y-3">
                <h2 className="text-xl font-semibold">{pl ? 'Zdobyte progresje' : 'Earned progressions'}</h2>
                {Object.entries(user.houseOfIronStatus?.pendingProgressions ?? {}).map(([exerciseId, recommendation]) => <div key={exerciseId} className="border-b border-border py-4">
                    <strong>{EXERCISE_BY_ID[exerciseId]?.name[pl ? 'pl' : 'en'] ?? exerciseId}</strong>
                    <p className="text-sm text-muted-foreground mt-1">{stageLabel(recommendation.stage)}</p>
                    <div className="flex gap-2 mt-3"><Button variant="outline" disabled={resolving === exerciseId} onClick={() => resolveProgression(exerciseId, true)}>{pl ? 'Akceptuj' : 'Accept'}</Button><Button variant="ghost" disabled={resolving === exerciseId} onClick={() => resolveProgression(exerciseId, false)}>{pl ? 'Zostań przy obecnym' : 'Keep current'}</Button></div>
                </div>)}
                {actionError && <p role="alert" className="text-destructive">{actionError}</p>}
            </section>}

            <section>
                <h2 className="text-xl font-semibold">{pl ? 'Wybierz sesję' : 'Choose a session'}</h2>
                <div className="mt-4 border-t border-border">
                    {(Object.keys(HOUSE_SESSION_DAY) as HouseSessionId[]).map(id => (
                        <button key={id} onClick={() => navigate(`/app/workout/${week}/${HOUSE_SESSION_DAY[id]}`)} className="block min-h-20 w-full text-left border-b border-border px-3 py-4 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors">
                            <strong className="text-xl">{LABELS[id]}</strong>
                            {id === recommended && <span className="ml-3 text-xs text-[hsl(var(--signal-text))]">{pl ? 'ZALECANA' : 'RECOMMENDED'}</span>}
                            <p className="text-sm text-muted-foreground mt-2">{{
                                'push-a': pl ? 'Klatka + czworogłowe' : 'Chest + quads',
                                'pull-a': pl ? 'Plecy + dwugłowe uda' : 'Back + hamstrings',
                                'push-b': pl ? 'Barki + czworogłowe/pośladki' : 'Shoulders + quads/glutes',
                                'pull-b': pl ? 'Plecy + pośladki/dwugłowe' : 'Back + glutes/hamstrings',
                            }[id]}</p>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};
