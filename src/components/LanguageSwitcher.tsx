import React from 'react';
import { useLanguage } from '../contexts/useTranslation';
import { cn } from '../lib/utils';

interface LanguageSwitcherProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

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
                    "transition-all duration-200 rounded overflow-hidden border-2 hover:scale-110",
                    language === 'en'
                        ? "border-primary shadow-lg scale-105"
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
                    "transition-all duration-200 rounded overflow-hidden border-2 hover:scale-110",
                    language === 'pl'
                        ? "border-primary shadow-lg scale-105"
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
