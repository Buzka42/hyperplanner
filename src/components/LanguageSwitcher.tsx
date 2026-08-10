import React from 'react';
import { useLanguage } from '../contexts/useTranslation';
import { cn } from '../lib/utils';

interface LanguageSwitcherProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * The flag is 24-40px, but the button around it is always ≥44px — the flag is
 * the mark, the button is the target. Before this the whole control was the
 * flag's size and failed the 44px minimum at every size.
 */
const LANG_BUTTON = "inline-flex min-h-11 min-w-11 items-center justify-center border-2 transition-colors duration-200";

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className, size = 'md' }) => {
    const { language, setLanguage } = useLanguage();

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10'
    };

    const flagSize = sizeClasses[size];

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <button
                onClick={() => setLanguage('en')}
                className={cn(
                    LANG_BUTTON,
                    language === 'en'
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                )}
                title="English"
                aria-label="Switch to English"
            >
                <img
                    src="/eng.png"
                    alt="English"
                    className={cn(flagSize, "object-cover")}
                />
            </button>
            <button
                onClick={() => setLanguage('pl')}
                className={cn(
                    LANG_BUTTON,
                    language === 'pl'
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                )}
                title="Polski"
                aria-label="Switch to Polish"
            >
                <img
                    src="/pl.png"
                    alt="Polski"
                    className={cn(flagSize, "object-cover")}
                />
            </button>
        </div>
    );
};
