
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowRight, KeyRound, Loader2, X } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { DEFAULT_ONBOARDING_CONFIG, isAlwaysFreePlan, normalizeKeyword, PLAN_OPTIONS, withAlwaysFreePlans, type OnboardingConfig } from '../data/accessControl';
import { PLAN_META } from '../data/planMeta';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export const Entry: React.FC = () => {
    const [codeword, setCodeword] = useState('');
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [config, setConfig] = useState<OnboardingConfig>(DEFAULT_ONBOARDING_CONFIG);
    const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
    const { checkCodeword } = useUser();
    const { t, tArray, tObject } = useLanguage();

    const localizedPlanName = (planId: string, fallback: string): string => {
        const meta = PLAN_META[planId];
        if (!meta) return fallback;
        const copy = tObject(`onboarding.programs.${meta.i18nKey}`);
        return (copy as { name?: string })?.name || fallback;
    };
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const createPublicKeyword = async (keyword: string, allowedPlanIds: string[]) => {
        const ref = doc(db, 'accessKeys', keyword);
        const key = await getDoc(ref);
        if (key.exists()) throw new Error('That keyword is already in use.');
        const expiresAt = config.defaultExpiryDays > 0
            ? new Date(Date.now() + config.defaultExpiryDays * 86400000).toISOString() : null;
        await setDoc(ref, {
            keyword, allowedPlanIds: withAlwaysFreePlans(allowedPlanIds), active: true, source: 'public',
            allowPlanSwitching: true, expiresAt, createdAt: new Date().toISOString(), createdBy: auth.currentUser?.uid || ''
        });
    };

    useEffect(() => {
        getDoc(doc(db, 'appConfig', 'onboarding')).then(snap => {
            const next = snap.exists() ? { ...DEFAULT_ONBOARDING_CONFIG, ...snap.data() } as OnboardingConfig : DEFAULT_ONBOARDING_CONFIG;
            next.generalPlanIds = withAlwaysFreePlans(next.generalPlanIds);
            setConfig(next);
            setSelectedPlans(withAlwaysFreePlans([]));
        }).catch(() => setSelectedPlans(withAlwaysFreePlans([])));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!codeword.trim()) return;

        setLoading(true);
        try {
            const result = await checkCodeword(codeword);
            if (result.status === 'exists') {
                navigate('/app/dashboard');
            } else if (result.status === 'admin') {
                navigate('/admin');
            } else if (result.status === 'claimed') {
                setError(t('entry.keywordClaimed'));
            } else if (result.status === 'onboarding') {
                navigate('/onboarding', { state: { codeword: normalizeKeyword(codeword), allowedPlanIds: result.allowedPlanIds } });
            } else {
                const keyword = normalizeKeyword(codeword);
                if (keyword === 'judziek') {
                    setError(`Admin authorization is required. Device UID: ${auth.currentUser?.uid || 'unavailable'}`);
                } else if (!config.allowPublicKeywordCreation || !config.generalPlanIds.length) {
                    setError('New keyword registration is currently unavailable.');
                } else if (keyword.length < config.keywordMinLength || keyword.length > config.keywordMaxLength) {
                    setError(`Use ${config.keywordMinLength}–${config.keywordMaxLength} characters.`);
                } else {
                    const allowedPlanIds = withAlwaysFreePlans(config.generalPlanIds);
                    await createPublicKeyword(keyword, allowedPlanIds);
                    navigate('/onboarding', { state: { codeword: keyword, allowedPlanIds } });
                }
            }
        } catch (err: any) {
            console.error("Entry Error:", err);
            let msg = err.message;
            if (err.code === 'keyword-claimed') {
                msg = t('entry.keywordClaimed');
            } else if (err.code === 'auth/configuration-not-found' || err.message?.includes('configuration-not-found')) {
                msg = "Firebase Auth not enabled. Go to Console -> Authentication -> Sign-in method -> Enable Anonymous.";
            } else if (err.code === 'auth/operation-not-allowed') {
                msg = "Anonymous Auth disabled in Firebase. Enable it in Console.";
            }
            setError(msg || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const keyword = normalizeKeyword(codeword);
        setError(null);
        if (keyword.length < config.keywordMinLength || keyword.length > config.keywordMaxLength) {
            setError(`Use ${config.keywordMinLength}–${config.keywordMaxLength} characters.`); return;
        }
        if (!selectedPlans.length) { setError('Select at least one available plan.'); return; }
        setLoading(true);
        try {
            await createPublicKeyword(keyword, selectedPlans);
            navigate('/onboarding', { state: { codeword: keyword, allowedPlanIds: selectedPlans } });
        } catch (err: any) { setError(err.message || 'Could not create keyword.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="entry-console min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
            {/* Language Switcher - Top Right */}
            <div className="absolute top-4 right-4">
                <LanguageSwitcher size="md" />
            </div>
            <div className="entry-instrument">
                <div className="entry-identity">
                    {/* Entry keeps the mark, the shell does not. This is the
                        one screen with room for a brand moment and no program
                        to carry the identity yet; inside the app the wordmark
                        alone is enough and the plan artwork does that job. */}
                    <img src="/brand/hyperplanner-logo.png" alt="" aria-hidden="true" className="entry-mark" />
                    <p className="brand-lockup">Hyperplanner</p>
                    <h1>
                        {t('entry.title')}
                        <span>{t('entry.subtitle')}</span>
                    </h1>
                    <p className="entry-description">{t('entry.description')}</p>
                    <ul className="entry-pillars">
                        {tArray('entry.pillars').map(pillar => <li key={pillar}>{pillar}</li>)}
                    </ul>
                </div>

                <div className="entry-form">
                {error && <p className="entry-error" role="alert">{error}</p>}
                <form onSubmit={creating ? handleCreate : handleSubmit} className="space-y-6">
                    <label className="entry-field">
                        <span>{t('entry.placeholder')}</span>
                        <Input
                            value={codeword}
                            onChange={(e) => setCodeword(e.target.value)}
                            className="font-mono tracking-wider text-base"
                            autoFocus
                        />
                    </label>
                    {creating && <div className="choice-rows" aria-label={t('entry.availablePlans')}>
                        {PLAN_OPTIONS.filter(plan => config.generalPlanIds.includes(plan.id)).map(plan => (
                            <label key={plan.id} className="choice-row">
                                <span>{localizedPlanName(plan.id, plan.name)}{isAlwaysFreePlan(plan.id) ? ` · ${t('entry.freeTag')}` : ''}</span>
                                <input type="checkbox" disabled={isAlwaysFreePlan(plan.id)} checked={selectedPlans.includes(plan.id)} onChange={() => setSelectedPlans(value => value.includes(plan.id) ? value.filter(id => id !== plan.id) : [...value, plan.id])} />
                            </label>
                        ))}
                    </div>}
                    {/* Was `bg-zinc-100 text-black`, a per-page style fork that
                        rendered grey instead of the program signal. */}
                    <Button type="submit" className="entry-submit" disabled={loading || !codeword.trim()}>
                        {loading ? <Loader2 className="mr-2 animate-spin" /> : <ArrowRight className="mr-2" />}
                        {loading ? t('common.loading') : creating ? t('entry.createContinue') : t('entry.button')}
                    </Button>
                </form>
                {config.allowPublicKeywordCreation && <Button type="button" variant="ghost" className="mt-4 w-full" onClick={() => { setCreating(v => !v); setError(null); }}>
                    {creating ? <X className="mr-2 h-4 w-4" /> : <KeyRound className="mr-2 h-4 w-4" />}
                    {creating ? t('entry.useExisting') : t('entry.createNew')}
                </Button>}
                </div>
            </div>
        </div>
    );
};
