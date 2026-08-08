import React, { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clock3, Dices, Gauge, RotateCcw, ShieldAlert, TimerReset, Zap } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useLanguage } from '../contexts/useTranslation';
import { useUser } from '../contexts/UserContext';
import { db } from '../firebase';
import {
    ADVENTURE_EXERCISES,
    ADVENTURE_PAIRS,
    ADVENTURE_PLAN_ID,
    ADVENTURE_PORTALS,
    adventureResultKey,
    adventureDraftKey,
    buildAdventureSequence,
    findPreviousAdventureWeight,
    getAdventureExercise,
    getAdventurePair,
    type AdventureEquipment,
    type AdventurePortalId
} from '../data/adventure';

type Stage = 'select' | 'work' | 'summary';
type StepResult = { weight: string; reps: string; completed: boolean; variant?: string };
type LastPerformance = { weight: string; reps: string; increase: boolean; date: string };
type StoredSet = { weight?: string | number; reps?: string | number; completed?: boolean; variant?: string };
type StoredExercise = { id: string; exerciseKey?: string; pairId: string; setsData?: StoredSet[] };
type StoredAdventureLog = {
    programId?: string;
    date: string;
    exercises?: StoredExercise[];
    adventure?: { sessionToken?: string; selectedPairIds?: Record<string, string>; challengeAnswers?: Record<string, string[]> };
};
type AdventureDraft = {
    sessionToken: string;
    stage: Stage;
    selectedPairIds: Record<string, string>;
    results: Record<string, StepResult>;
    challengeAnswers: Record<string, string[]>;
    currentIndex: number;
    startedAt: string;
    selectedEquipment: AdventureEquipment[];
};

const ALL_EQUIPMENT: AdventureEquipment[] = ['bodyweight', 'dumbbells', 'barbell', 'cable', 'machines'];
const newToken = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export const AdventureSession: React.FC = () => {
    const { user, updateUserProfile } = useUser();
    const { language, t } = useLanguage();
    const navigate = useNavigate();
    const { logId } = useParams();
    const [stage, setStage] = useState<Stage>('select');
    const [selectedPairIds, setSelectedPairIds] = useState<Record<string, string>>({});
    const [selectedEquipment, setSelectedEquipment] = useState<AdventureEquipment[]>(ALL_EQUIPMENT);
    const [results, setResults] = useState<Record<string, StepResult>>({});
    const [challengeAnswers, setChallengeAnswers] = useState<Record<string, string[]>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sessionToken, setSessionToken] = useState<string>(() => newToken());
    const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
    const [openPortal, setOpenPortal] = useState<AdventurePortalId>('upper');
    const [promptPairId, setPromptPairId] = useState<string | null>(null);
    const [restRemaining, setRestRemaining] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [history, setHistory] = useState<Record<string, LastPerformance>>({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);

    const sequence = useMemo(() => buildAdventureSequence(selectedPairIds), [selectedPairIds]);
    const currentStep = sequence[currentIndex];
    const currentPair = currentStep ? getAdventurePair(currentStep.pairId) : undefined;
    const currentExercise = currentStep ? getAdventureExercise(currentStep.exerciseKey) : undefined;
    const currentResultKey = currentStep ? adventureResultKey(currentStep.pairId, currentStep.exerciseKey, currentStep.round) : '';
    const currentResult = useMemo<StepResult>(() => results[currentResultKey] || { weight: '', reps: '', completed: false }, [currentResultKey, results]);
    const selectedCount = Object.keys(selectedPairIds).length;
    const estimatedMinutes = Object.values(selectedPairIds).reduce((sum, pairId) => sum + (getAdventurePair(pairId)?.estimatedMinutes || 0), 0);

    useEffect(() => {
        if (!user) return;
        const hydrate = async () => {
            if (logId) {
                const saved = await getDoc(doc(db, 'users', user.id, 'workouts', logId));
                if (!saved.exists() || saved.data().programId !== ADVENTURE_PLAN_ID) {
                    setError(t('adventure.errors.sessionNotFound')); setHydrated(true); return;
                }
                const data = saved.data() as StoredAdventureLog;
                const savedPairs = data.adventure?.selectedPairIds || {};
                const restoredResults: Record<string, StepResult> = {};
                (data.exercises || []).forEach(exerciseItem => {
                    (exerciseItem.setsData || []).forEach((set, index) => {
                        restoredResults[adventureResultKey(exerciseItem.pairId, exerciseItem.exerciseKey || exerciseItem.id, index + 1)] = {
                            weight: String(set.weight ?? ''), reps: String(set.reps ?? ''), completed: Boolean(set.completed), variant: set.variant
                        };
                    });
                });
                setSelectedPairIds(savedPairs);
                setChallengeAnswers(data.adventure?.challengeAnswers || {});
                setResults(restoredResults);
                setSessionToken(data.adventure?.sessionToken || logId);
                setStartedAt(data.date || new Date().toISOString());
                setCurrentIndex(0);
                setStage('work');
            } else {
                const savedDraft = localStorage.getItem(adventureDraftKey(user.id));
                if (savedDraft) {
                    try {
                        const draft = JSON.parse(savedDraft) as AdventureDraft;
                        setSessionToken(draft.sessionToken);
                        setStage(draft.stage);
                        setSelectedPairIds(draft.selectedPairIds || {});
                        setResults(draft.results || {});
                        setChallengeAnswers(draft.challengeAnswers || {});
                        setCurrentIndex(draft.currentIndex || 0);
                        setStartedAt(draft.startedAt || new Date().toISOString());
                        setSelectedEquipment(draft.selectedEquipment || ALL_EQUIPMENT);
                    } catch {
                        localStorage.removeItem(adventureDraftKey(user.id));
                    }
                }
            }
            setHydrated(true);
        };
        hydrate().catch(err => { console.error(err); setError(t('adventure.errors.sessionLoad')); setHydrated(true); });
    }, [logId, t, user]);

    useEffect(() => {
        if (!user) return;
        getDocs(collection(db, 'users', user.id, 'workouts')).then(snapshot => {
            const next: Record<string, LastPerformance> = {};
            snapshot.docs
                .map(item => item.data() as StoredAdventureLog)
                .filter(item => item.programId === ADVENTURE_PLAN_ID)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .forEach(log => (log.exercises || []).forEach(exerciseItem => {
                    const key = exerciseItem.exerciseKey || exerciseItem.id;
                    if (next[key]) return;
                    const completed = (exerciseItem.setsData || []).filter(set => set.completed);
                    if (!completed.length) return;
                    const definition = ADVENTURE_EXERCISES[key];
                    const lastSet = completed[completed.length - 1];
                    const bothAtTop = definition && completed.length >= 2 && completed.slice(0, 2).every(set => Number(set.reps) >= definition.target.max);
                    const challengeBeat = definition && Number(lastSet.reps) >= definition.target.max + 3;
                    next[key] = { weight: String(lastSet.weight ?? ''), reps: String(lastSet.reps ?? ''), increase: Boolean(bothAtTop || challengeBeat), date: log.date };
                }));
            setHistory(next);
        }).catch(errorValue => console.error('Adventure history lookup failed', errorValue));
    }, [user]);

    useEffect(() => {
        if (!hydrated || !user || logId) return;
        const draft: AdventureDraft = { sessionToken, stage, selectedPairIds, results, challengeAnswers, currentIndex, startedAt, selectedEquipment };
        localStorage.setItem(adventureDraftKey(user.id), JSON.stringify(draft));
    }, [challengeAnswers, currentIndex, hydrated, logId, results, selectedEquipment, selectedPairIds, sessionToken, stage, startedAt, user]);

    useEffect(() => {
        if (stage === 'select') return;
        const update = () => setElapsed(Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)));
        update();
        const timer = window.setInterval(update, 1000);
        return () => window.clearInterval(timer);
    }, [stage, startedAt]);

    useEffect(() => {
        if (!restRemaining) return;
        const timer = window.setInterval(() => setRestRemaining(value => Math.max(0, value - 1)), 1000);
        return () => window.clearInterval(timer);
    }, [restRemaining]);

    useEffect(() => {
        if (!currentStep || !currentExercise || currentResult.weight) return;
        if (currentExercise.weightMode === 'external' || currentExercise.weightMode === 'optional' || currentExercise.weightMode === 'assisted') {
            const carriedWeight = findPreviousAdventureWeight(sequence, results, currentIndex, currentExercise.key);
            const savedWeight = history[currentExercise.key]?.weight || '';
            const weight = carriedWeight || savedWeight;
            if (weight) setResults(value => ({ ...value, [currentResultKey]: { ...currentResult, weight } }));
        }
    }, [currentExercise, currentIndex, currentResult, currentResultKey, currentStep, history, results, sequence]);

    if (!user || !hydrated) return <div className="instrument-page flex min-h-[60vh] items-center justify-center text-muted-foreground">{t('common.loading')}</div>;

    const availablePairs = (portalId: AdventurePortalId) => ADVENTURE_PAIRS.filter(pair => pair.portalId === portalId && pair.equipment.every(item => selectedEquipment.includes(item)));
    const toggleEquipment = (item: AdventureEquipment) => setSelectedEquipment(value => value.includes(item) ? value.filter(entry => entry !== item) : [...value, item]);
    const choosePair = (portalId: AdventurePortalId, pairId: string) => setSelectedPairIds(value => ({ ...value, [portalId]: pairId }));
    const randomize = () => {
        const next: Record<string, string> = {};
        ADVENTURE_PORTALS.forEach(portal => {
            const options = availablePairs(portal.id);
            if (options.length) next[portal.id] = options[Math.floor(Math.random() * options.length)].id;
        });
        setSelectedPairIds(next);
    };
    const rerollPortal = (portalId: AdventurePortalId) => {
        const options = availablePairs(portalId).filter(pair => pair.id !== selectedPairIds[portalId]);
        if (!options.length) return;
        choosePair(portalId, options[Math.floor(Math.random() * options.length)].id);
    };
    const startSession = () => {
        if (selectedCount !== ADVENTURE_PORTALS.length) return;
        setStartedAt(new Date().toISOString()); setCurrentIndex(0); setStage('work'); window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const updateCurrentResult = (updates: Partial<StepResult>) => setResults(value => ({ ...value, [currentResultKey]: { ...currentResult, ...updates } }));
    const advance = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= sequence.length) { setCurrentIndex(sequence.length); setStage('summary'); }
        else setCurrentIndex(nextIndex);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const logSet = () => {
        setError(null);
        if (!currentExercise || !currentPair || !currentStep) return;
        if (!currentResult.reps || Number(currentResult.reps) <= 0) { setError(t('adventure.errors.repsRequired')); return; }
        if (currentExercise.weightMode === 'external' && currentResult.weight === '') { setError(t('adventure.errors.weightRequired')); return; }
        setResults(value => ({ ...value, [currentResultKey]: { ...currentResult, completed: true } }));
        if (currentStep.slot === 'B') {
            if (currentStep.round === 1) {
                setRestRemaining(currentPair.restSeconds);
                setPromptPairId(currentPair.id);
                return;
            }
        }
        advance();
    };
    const answerChallenge = (keys: string[]) => {
        if (!promptPairId) return;
        setChallengeAnswers(value => ({ ...value, [promptPairId]: keys }));
        setPromptPairId(null);
        advance();
    };
    const resetDraft = () => {
        if (!window.confirm(t('adventure.confirmReset'))) return;
        localStorage.removeItem(adventureDraftKey(user.id));
        setSessionToken(newToken()); setStage('select'); setSelectedPairIds({}); setResults({}); setChallengeAnswers({}); setCurrentIndex(0); setStartedAt(new Date().toISOString()); setPromptPairId(null);
    };
    const saveSession = async () => {
        setSaving(true); setError(null);
        try {
            const exercises = Object.values(selectedPairIds).flatMap(pairId => {
                const selected = getAdventurePair(pairId);
                if (!selected) return [];
                return [selected.a, selected.b].map(exerciseKey => {
                    const definition = getAdventureExercise(exerciseKey);
                    return {
                        id: `${pairId}:${exerciseKey}`,
                        exerciseKey,
                        pairId,
                        portalId: selected.portalId,
                        name: definition.name.en,
                        sets: 2,
                        setsData: [1, 2].map(round => ({ ...results[adventureResultKey(pairId, exerciseKey, round)], round }))
                    };
                });
            });
            const payload = {
                date: new Date().toISOString(),
                dayName: '30 Minute Adventure',
                programId: ADVENTURE_PLAN_ID,
                sessionKind: 'pair-select',
                elapsedSeconds: elapsed,
                adventure: { sessionToken, selectedPairIds, challengeAnswers },
                exercises
            };
            const workoutCollection = collection(db, 'users', user.id, 'workouts');
            if (logId) await updateDoc(doc(workoutCollection, logId), payload);
            else await addDoc(workoutCollection, payload);
            if (!logId) {
                const progress = { ...(user.programProgress || {}) };
                progress[ADVENTURE_PLAN_ID] = {
                    completedSessions: (progress[ADVENTURE_PLAN_ID]?.completedSessions || 0) + 1,
                    startDate: progress[ADVENTURE_PLAN_ID]?.startDate || startedAt
                };
                await updateUserProfile({ completedSessions: user.completedSessions + 1, programProgress: progress });
            }
            localStorage.removeItem(adventureDraftKey(user.id));
            navigate('/app/dashboard', { replace: true });
        } catch (saveError) {
            console.error(saveError); setError(t('adventure.errors.save'));
        } finally { setSaving(false); }
    };

    if (stage === 'select') return (
        <div className="adventure-selector instrument-page">
            <div className="adventure-selector-hero">
                <button onClick={() => navigate('/app/dashboard')} aria-label={t('common.back')}><ArrowLeft /></button>
                <div><h1>{t('adventure.selector.title')}</h1><p>{t('adventure.selector.description')}</p></div>
                <img src="/30min.png" alt="" />
            </div>

            <div className="adventure-route-console">
                <div className="adventure-route-status"><b>{selectedCount}/5</b><span>{t('adventure.selector.routeStatus')}</span><strong>~{estimatedMinutes || 30} min</strong></div>
                <div className="adventure-equipment" aria-label={t('adventure.selector.equipment')}>
                    {ALL_EQUIPMENT.map(item => <button key={item} className={selectedEquipment.includes(item) ? 'is-active' : ''} onClick={() => toggleEquipment(item)}>{t(`adventure.equipment.${item}`)}</button>)}
                </div>
                <Button variant="outline" onClick={randomize}><Dices className="mr-2 h-4 w-4" />{t('adventure.selector.random')}</Button>
            </div>

            <div className="adventure-portals">
                {ADVENTURE_PORTALS.map((portal, portalIndex) => {
                    const isOpen = openPortal === portal.id;
                    const selected = getAdventurePair(selectedPairIds[portal.id] || '');
                    const options = ADVENTURE_PAIRS.filter(pair => pair.portalId === portal.id);
                    return <section key={portal.id} className={isOpen ? 'is-open' : ''}>
                        <button className="adventure-portal-heading" onClick={() => setOpenPortal(portal.id)} aria-expanded={isOpen}>
                            <span>{portalIndex + 1}</span>
                            <div><h2>{portal.name[language]}</h2><p>{selected ? `${getAdventureExercise(selected.a).name[language]} + ${getAdventureExercise(selected.b).name[language]}` : t('adventure.selector.choosePair')}</p></div>
                            {selected && <Check className="adventure-selected-check" />}
                            <ChevronDown className="adventure-chevron" />
                        </button>
                        {isOpen && <div className="adventure-pair-list">
                            {options.map(pairItem => {
                                const available = pairItem.equipment.every(item => selectedEquipment.includes(item));
                                const isSelected = selectedPairIds[portal.id] === pairItem.id;
                                const a = getAdventureExercise(pairItem.a); const b = getAdventureExercise(pairItem.b);
                                return <button key={pairItem.id} disabled={!available} className={isSelected ? 'is-selected' : ''} onClick={() => choosePair(portal.id, pairItem.id)}>
                                    <div className="adventure-pair-main">
                                        <span className="adventure-slot">A</span><strong>{a.name[language]}</strong><small>{a.target.min === a.target.max ? a.target.min : `${a.target.min}–${a.target.max}`} {a.target.unit === 'seconds' ? t('adventure.seconds') : t('common.reps')}</small>
                                        <span className="adventure-slot">B</span><strong>{b.name[language]}</strong><small>{b.target.min === b.target.max ? b.target.min : `${b.target.min}–${b.target.max}`} {b.target.unit === 'seconds' ? t('adventure.seconds') : t('common.reps')}</small>
                                    </div>
                                    <div className="adventure-pair-meta">
                                        {pairItem.heroPick && <em>{t('adventure.heroPick')}</em>}
                                        <span>{t(`adventure.setup.${pairItem.setup}`)}</span><span>{pairItem.restSeconds}s</span>
                                    </div>
                                    <p>{available ? pairItem.note[language] : t('adventure.selector.missingEquipment')}</p>
                                </button>;
                            })}
                            <Button variant="ghost" onClick={() => rerollPortal(portal.id)} disabled={availablePairs(portal.id).length < 2}><RotateCcw className="mr-2 h-4 w-4" />{t('adventure.selector.reroll')}</Button>
                        </div>}
                    </section>;
                })}
            </div>

            <div className="adventure-selector-dock">
                <Button variant="ghost" onClick={resetDraft}><RotateCcw className="mr-2 h-4 w-4" />{t('adventure.selector.clear')}</Button>
                <Button className="adventure-primary-command" disabled={selectedCount !== 5} onClick={startSession}>{t('adventure.selector.enter')}<ArrowRight className="ml-2 h-5 w-5" /></Button>
            </div>
        </div>
    );

    if (stage === 'summary') return (
        <div className="adventure-summary instrument-page">
            <div className="adventure-summary-portal"><Check /></div>
            <h1>{t('adventure.summary.title')}</h1>
            <p>{t('adventure.summary.description')}</p>
            <div className="adventure-summary-readout"><span><b>{formatTime(elapsed)}</b>{t('adventure.summary.time')}</span><span><b>20</b>{t('adventure.summary.sets')}</span><span><b>5</b>{t('adventure.summary.portals')}</span></div>
            {error && <p className="adventure-error" role="alert">{error}</p>}
            <Button className="adventure-primary-command" disabled={saving} onClick={saveSession}>{saving ? t('common.saving') : logId ? t('common.saveChanges') : t('adventure.summary.commit')}</Button>
        </div>
    );

    const challenged = Boolean(currentPair && currentExercise && challengeAnswers[currentPair.id]?.includes(currentExercise.key));
    const specialTarget = currentStep?.round === 2 && (challenged || currentExercise?.failureMode === 'preprogrammed');
    const targetLabel = specialTarget
        ? currentExercise?.failureMode === 'technical' || currentExercise?.failureMode === 'preprogrammed' ? t('adventure.lastCleanRep') : t('common.failure')
        : currentExercise ? `${currentExercise.target.min === currentExercise.target.max ? currentExercise.target.min : `${currentExercise.target.min}–${currentExercise.target.max}`} ${currentExercise.target.unit === 'seconds' ? t('adventure.seconds') : t('common.reps')}` : '';
    const last = currentExercise ? history[currentExercise.key] : undefined;
    const pairA = currentPair ? getAdventureExercise(currentPair.a) : undefined;
    const pairB = currentPair ? getAdventureExercise(currentPair.b) : undefined;
    const eligibleA = pairA?.failureMode !== 'preprogrammed';
    const eligibleB = pairB?.failureMode !== 'preprogrammed';

    return (
        <div className="adventure-workout instrument-page">
            <header className="adventure-live-header">
                <Button variant="ghost" size="icon" onClick={() => navigate('/app/dashboard')} aria-label={t('common.back')}><ArrowLeft /></Button>
                <div><span>{t('adventure.workout.live')}</span><b>{currentIndex + 1}/20</b></div>
                <strong>{formatTime(elapsed)}</strong>
                <button onClick={resetDraft} aria-label={t('adventure.selector.clear')}><RotateCcw /></button>
            </header>
            <div className="adventure-progress"><span style={{ transform: `scaleX(${Math.min(1, (currentIndex + 1) / 20)})` }} /></div>

            {restRemaining > 0 && <div className="adventure-rest-console" role="timer"><TimerReset /><span>{t('adventure.workout.rest')}</span><b>{formatTime(restRemaining)}</b><button onClick={() => setRestRemaining(0)}>{t('adventure.workout.skip')}</button></div>}

            {promptPairId && currentPair && pairA && pairB ? <section className="adventure-easy-panel">
                <Zap />
                <h1>{t('adventure.challenge.title')}</h1>
                <p>{t('adventure.challenge.description')}</p>
                <div>
                    {eligibleA && <Button variant="outline" onClick={() => answerChallenge([pairA.key])}>A · {pairA.name[language]}</Button>}
                    {eligibleB && <Button variant="outline" onClick={() => answerChallenge([pairB.key])}>B · {pairB.name[language]}</Button>}
                    {eligibleA && eligibleB && <Button variant="outline" onClick={() => answerChallenge([pairA.key, pairB.key])}>{t('adventure.challenge.both')}</Button>}
                    <Button className="adventure-primary-command" onClick={() => answerChallenge([])}>{t('adventure.challenge.neither')}</Button>
                </div>
                <small>{t('adventure.challenge.safety')}</small>
            </section> : currentExercise && currentPair && currentStep ? <>
                <section className="adventure-live-set">
                    <div className="adventure-live-context"><span>{ADVENTURE_PORTALS.find(item => item.id === currentPair.portalId)?.name[language]}</span><b>{t('adventure.workout.round')} {currentStep.round}/2 · {currentStep.slot}</b></div>
                    <h1>{currentExercise.name[language]}</h1>
                    <div className={specialTarget ? 'adventure-target is-challenge' : 'adventure-target'}><Gauge /><span>{t('workout.target')}</span><b>{targetLabel}</b></div>
                    <p className="adventure-cue">{currentExercise.cue[language]}</p>

                    <div className="adventure-history-pills">
                        {last ? <span>{t('adventure.workout.last')} <b>{last.weight ? `${last.weight} kg × ` : ''}{last.reps}</b></span> : <span>{t('adventure.workout.firstExposure')}</span>}
                        {last?.increase && <strong><Zap />{t('adventure.workout.increase')}</strong>}
                    </div>

                    {currentExercise.variants && <label className="adventure-variant"><span>{t('adventure.workout.variant')}</span><select value={currentResult.variant || currentExercise.variants[language][0]} onChange={event => updateCurrentResult({ variant: event.target.value })}>{currentExercise.variants[language].map(option => <option key={option}>{option}</option>)}</select></label>}

                    <div className="adventure-input-bank">
                        {currentExercise.weightMode !== 'bodyweight' && currentExercise.weightMode !== 'timed' && <label><span>{currentExercise.weightMode === 'assisted' ? t('adventure.workout.assistance') : t('common.weight')}</span><Input inputMode="decimal" value={currentResult.weight} onChange={event => updateCurrentResult({ weight: event.target.value.replace(',', '.') })} /><b>kg</b></label>}
                        <label><span>{currentExercise.target.unit === 'seconds' ? t('adventure.seconds') : t('common.reps')}</span><Input inputMode="numeric" value={currentResult.reps} onChange={event => updateCurrentResult({ reps: event.target.value.replace(/\D/g, '') })} /><b>{currentExercise.target.unit === 'seconds' ? 's' : t('common.reps')}</b></label>
                    </div>
                    {error && <p className="adventure-error" role="alert">{error}</p>}
                    {specialTarget && <div className="adventure-safety"><ShieldAlert />{currentExercise.failureMode === 'technical' || currentExercise.failureMode === 'preprogrammed' ? t('adventure.workout.technicalSafety') : t('adventure.workout.failureSafety')}</div>}
                    <Button className="adventure-log-command" onClick={logSet}>{t('adventure.workout.logSet')}<ArrowRight /></Button>
                </section>

                <section className="adventure-pair-rail">
                    {[pairA, pairB].map((exerciseItem, index) => <div key={exerciseItem?.key} className={exerciseItem?.key === currentExercise.key ? 'is-active' : ''}><span>{index === 0 ? 'A' : 'B'}</span><strong>{exerciseItem?.name[language]}</strong><small>{challengeAnswers[currentPair.id]?.includes(exerciseItem?.key || '') ? t('adventure.workout.challengeQueued') : t('adventure.workout.standardTarget')}</small></div>)}
                    <p><Clock3 />{currentPair.restSeconds}s · {currentPair.note[language]}</p>
                </section>
            </> : null}
        </div>
    );
};
