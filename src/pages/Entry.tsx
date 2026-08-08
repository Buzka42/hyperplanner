
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
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export const Entry: React.FC = () => {
    const [codeword, setCodeword] = useState('');
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [config, setConfig] = useState<OnboardingConfig>(DEFAULT_ONBOARDING_CONFIG);
    const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
    const { checkCodeword } = useUser();
    const { t } = useLanguage();
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
            if (err.code === 'auth/configuration-not-found' || err.message?.includes('configuration-not-found')) {
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
            <div className="entry-instrument instrument-panel w-full max-w-6xl grid gap-8 md:grid-cols-[1.2fr_.8fr] p-6 md:p-12">
                <div className="text-center space-y-2 flex flex-col items-center">
                    <img src="/brand/hyperplanner-logo.png" alt="Hyper Planner Logo" className="w-28 h-28 object-contain mb-4" />
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                        {t('entry.title')}
                        <span className="text-zinc-400 block text-6xl mt-1 tracking-tighter">{t('entry.subtitle')}</span>
                    </h1>
                    <p className="text-muted-foreground mt-4 text-lg max-w-sm">
                        {t('entry.description')}
                    </p>
                </div>

                <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
                {error && <div className="p-3 mb-4 bg-red-900/20 border border-red-900/30 rounded text-red-500 text-sm font-bold text-center">{error}</div>}
                <form onSubmit={creating ? handleCreate : handleSubmit} className="space-y-4">
                    <Input
                        placeholder={t('entry.placeholder')}
                        value={codeword}
                        onChange={(e) => setCodeword(e.target.value)}
                        className="h-14 text-lg px-6 bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-600 transition-all font-mono tracking-wider text-center"
                        autoFocus
                    />
                    {creating && <div className="space-y-2" aria-label="Available plans">
                        {PLAN_OPTIONS.filter(plan => config.generalPlanIds.includes(plan.id)).map(plan => (
                            <label key={plan.id} className="flex min-h-11 items-center gap-3 border border-border bg-card px-3 py-2 text-sm cursor-pointer">
                                <input type="checkbox" disabled={isAlwaysFreePlan(plan.id)} checked={selectedPlans.includes(plan.id)} onChange={() => setSelectedPlans(value => value.includes(plan.id) ? value.filter(id => id !== plan.id) : [...value, plan.id])} />
                                <span>{plan.name}{isAlwaysFreePlan(plan.id) ? ' · FREE' : ''}</span>
                            </label>
                        ))}
                    </div>}
                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold shadow-lg shadow-black/50 hover:bg-white hover:text-black transition-all bg-zinc-100 text-black border border-transparent"
                        disabled={loading || !codeword.trim()}
                    >
                        {loading ? <Loader2 className="mr-2 animate-spin" /> : <ArrowRight className="mr-2" />}
                        {loading ? t('common.loading') : creating ? 'CREATE & CONTINUE' : t('entry.button')}
                    </Button>
                </form>
                {config.allowPublicKeywordCreation && <Button type="button" variant="ghost" className="mt-3 w-full" onClick={() => { setCreating(v => !v); setError(null); }}>
                    {creating ? <X className="mr-2 h-4 w-4" /> : <KeyRound className="mr-2 h-4 w-4" />}
                    {creating ? 'Use an existing keyword' : 'Create a new keyword'}
                </Button>}
                <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                    <span className="border-t border-border pt-2">Calculate</span><span className="border-t border-border pt-2">Execute</span><span className="border-t border-border pt-2">Log</span>
                </div>
                </div>
            </div>
        </div>
    );
};
