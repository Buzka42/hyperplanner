
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/useTranslation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowRight, Loader2 } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export const Entry: React.FC = () => {
    const [codeword, setCodeword] = useState('');
    const [loading, setLoading] = useState(false);
    const { checkCodeword } = useUser();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        console.log("Submitting codeword:", codeword);
        if (!codeword.trim()) return;

        setLoading(true);
        try {
            const result = await checkCodeword(codeword);
            console.log("Check result:", result);
            if (result === 'exists') {
                navigate('/app/dashboard');
            } else if (result === 'admin') {
                navigate('/admin');
            } else {
                // New user - go straight to plan selection
                navigate('/onboarding', { state: { codeword } });
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

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
            {/* Language Switcher - Top Right */}
            <div className="absolute top-4 right-4">
                <LanguageSwitcher size="md" />
            </div>
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-2 flex flex-col items-center">
                    <img src="/logo.png" alt="Hyper Planner Logo" className="w-24 h-24 object-contain mb-4 opacity-90 grayscale contrast-125" />
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                        {t('entry.title')}
                        <span className="text-zinc-800 block text-6xl mt-1 tracking-tighter">{t('entry.subtitle')}</span>
                    </h1>
                    <p className="text-muted-foreground mt-4 text-lg">
                        {t('entry.description')}
                    </p>
                </div>

                {error && <div className="p-3 mb-4 bg-red-900/20 border border-red-900/30 rounded text-red-500 text-sm font-bold text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4 mt-8">
                    <Input
                        placeholder={t('entry.placeholder')}
                        value={codeword}
                        onChange={(e) => setCodeword(e.target.value)}
                        className="h-14 text-lg px-6 bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-600 transition-all font-mono tracking-wider text-center"
                        autoFocus
                    />
                    <Button
                        type="submit"
                        className="w-full h-14 text-lg font-bold shadow-lg shadow-black/50 hover:bg-white hover:text-black transition-all bg-zinc-100 text-black border border-transparent"
                        disabled={loading || !codeword.trim()}
                    >
                        {loading ? <Loader2 className="mr-2 animate-spin" /> : <ArrowRight className="mr-2" />}
                        {loading ? t('common.loading') : t('entry.button')}
                    </Button>
                </form>
            </div>
        </div>
    );
};
