import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ArrowRight, Clock3, History, Route, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/useTranslation';
import { useUser } from '../contexts/UserContext';
import { db } from '../firebase';
import { ADVENTURE_EXERCISES, ADVENTURE_PLAN_ID, ADVENTURE_PORTALS, adventureDraftKey, getAdventurePair } from '../data/adventure';

type AdventureLog = {
    id: string;
    date: string;
    elapsedSeconds?: number;
    adventure?: { selectedPairIds?: Record<string, string> };
};

const formatTime = (seconds = 0) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export const AdventureDashboard: React.FC = () => {
    const { user } = useUser();
    const { language, t } = useLanguage();
    const navigate = useNavigate();
    const [logs, setLogs] = useState<AdventureLog[]>([]);
    const [loading, setLoading] = useState(true);

    const hasDraft = useMemo(() => Boolean(user && localStorage.getItem(adventureDraftKey(user.id))), [user]);

    useEffect(() => {
        if (!user) return;
        getDocs(collection(db, 'users', user.id, 'workouts'))
            .then(snapshot => setLogs(snapshot.docs
                .map(item => ({ id: item.id, ...item.data() } as AdventureLog & { programId?: string }))
                .filter(item => item.programId === ADVENTURE_PLAN_ID)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())))
            .catch(error => console.error('Adventure dashboard history failed', error))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return null;

    const last = logs[0];
    const routeNames = last?.adventure?.selectedPairIds
        ? ADVENTURE_PORTALS.map(portal => getAdventurePair(last.adventure?.selectedPairIds?.[portal.id] || ''))
            .filter(Boolean)
            .map(pair => pair
                ? `${ADVENTURE_EXERCISES[pair.a].name[language]} + ${ADVENTURE_EXERCISES[pair.b].name[language]}`
                : '')
        : [];

    return (
        <div className="adventure-dashboard space-y-8">
            <section className="adventure-command" aria-label={t('adventure.dashboard.commandLabel')}>
                <div className="adventure-command-art">
                    <img src="/30min.png" alt="30 Minute Adventure" />
                </div>
                <div className="adventure-command-copy">
                    <h1>{t('adventure.title')}</h1>
                    <p>{t('adventure.dashboard.description')}</p>
                    <div className="adventure-command-readout">
                        <span><b>{logs.length}</b>{t('adventure.dashboard.sessions')}</span>
                        <span><b>{last ? formatTime(last.elapsedSeconds) : '—'}</b>{t('adventure.dashboard.lastTime')}</span>
                        <span><b>5</b>{t('adventure.dashboard.portals')}</span>
                    </div>
                    <Button className="adventure-primary-command" onClick={() => navigate('/app/adventure')}>
                        <Route className="h-5 w-5" />
                        {hasDraft ? t('adventure.dashboard.resume') : t('adventure.dashboard.planRoute')}
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </div>
            </section>

            <div className="adventure-briefing">
                <section>
                    <Zap />
                    <div><h2>{t('adventure.dashboard.ruleTitle')}</h2><p>{t('adventure.dashboard.ruleBody')}</p></div>
                </section>
                <section>
                    <Clock3 />
                    <div><h2>{t('adventure.dashboard.timeTitle')}</h2><p>{t('adventure.dashboard.timeBody')}</p></div>
                </section>
                <section>
                    <History />
                    <div><h2>{t('adventure.dashboard.historyTitle')}</h2><p>{t('adventure.dashboard.historyBody')}</p></div>
                </section>
            </div>

            <section className="adventure-last-route">
                <div>
                    <h2>{t('adventure.dashboard.lastRoute')}</h2>
                    <p>{loading ? t('common.loading') : last ? new Date(last.date).toLocaleString(language) : t('adventure.dashboard.noSessions')}</p>
                </div>
                {routeNames.length > 0 && <div className="adventure-route-strip">
                    {routeNames.map((name, index) => <span key={`${name}-${index}`}>{name}</span>)}
                </div>}
                <Button variant="outline" onClick={() => navigate('/app/history')}><History className="mr-2 h-4 w-4" />{t('sidebar.history')}</Button>
            </section>
        </div>
    );
};
