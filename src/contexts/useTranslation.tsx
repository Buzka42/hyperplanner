import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { translations } from './translations';

type Language = 'en' | 'pl';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (keyPath: string, replacements?: Record<string, string | number>) => string;
    tArray: (keyPath: string) => string[];
    tObject: <T = Record<string, any>>(keyPath: string) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved === 'pl' || saved === 'en') ? saved : 'en';
    });

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (keyPath: string, replacements?: Record<string, string | number>): string => {
        const keys = keyPath.split('.');
        let value: any = (translations as any)[language];
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                if (language === 'pl') {
                    let fallbackValue: any = translations.en;
                    for (const k of keys) {
                        if (fallbackValue && typeof fallbackValue === 'object' && k in fallbackValue) {
                            fallbackValue = fallbackValue[k];
                        } else {
                            return keyPath;
                        }
                    }
                    if (typeof fallbackValue === 'string') {
                        value = fallbackValue;
                    } else {
                        return keyPath;
                    }
                } else {
                    return keyPath;
                }
            }
        }
        if (typeof value !== 'string') {
            return keyPath;
        }
        if (replacements) {
            let result = value;
            for (const [key, val] of Object.entries(replacements)) {
                result = result.replace(new RegExp('\\{' + key + '\\}', 'g'), String(val));
            }
            return result;
        }
        return value;
    };

    const tArray = (keyPath: string): string[] => {
        const keys = keyPath.split('.');
        let value: any = (translations as any)[language];
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                if (language === 'pl') {
                    let fallbackValue: any = translations.en;
                    for (const k of keys) {
                        if (fallbackValue && typeof fallbackValue === 'object' && k in fallbackValue) {
                            fallbackValue = fallbackValue[k];
                        } else {
                            return [];
                        }
                    }
                    if (Array.isArray(fallbackValue)) {
                        return fallbackValue;
                    }
                }
                return [];
            }
        }
        if (!Array.isArray(value)) {
            return [];
        }
        return value;
    };

    const tObject = <T = Record<string, any>>(keyPath: string): T => {
        const keys = keyPath.split('.');
        let value: any = (translations as any)[language];
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                if (language === 'pl') {
                    let fallbackValue: any = translations.en;
                    for (const k of keys) {
                        if (fallbackValue && typeof fallbackValue === 'object' && k in fallbackValue) {
                            fallbackValue = fallbackValue[k];
                        } else {
                            return {} as T;
                        }
                    }
                    return fallbackValue as T;
                }
                return {} as T;
            }
        }
        return value as T;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, tArray, tObject }}>
    {children}
    </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export { translations };

