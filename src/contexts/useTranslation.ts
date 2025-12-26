import { translations } from './translations';

// Current language - can be expanded to use context/state for dynamic switching
type Language = 'en';
let currentLanguage: Language = 'en';

/**
 * Get a translation value by key path
 * @example t('common.save') => "Save"
 * @example t('dashboard.cards.est1rm') => "Est. 1RM (From AMRAP)"
 */
export function t(keyPath: string, replacements?: Record<string, string | number>): string {
    const keys = keyPath.split('.');
    let value: any = translations[currentLanguage];

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            console.warn(`Translation key not found: ${keyPath}`);
            return keyPath; // Return key path as fallback
        }
    }

    if (typeof value !== 'string') {
        console.warn(`Translation value is not a string: ${keyPath}`);
        return keyPath;
    }

    // Handle replacements like {count}, {week}, etc.
    if (replacements) {
        let result = value;
        for (const [key, val] of Object.entries(replacements)) {
            result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val));
        }
        return result;
    }

    return value;
}

/**
 * Get an array translation (for lists like commandments, quotes, etc.)
 * @example tArray('dashboard.commandments.list') => ["300-500 kcal...", ...]
 */
export function tArray(keyPath: string): string[] {
    const keys = keyPath.split('.');
    let value: any = translations[currentLanguage];

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            console.warn(`Translation array not found: ${keyPath}`);
            return [];
        }
    }

    if (!Array.isArray(value)) {
        console.warn(`Translation value is not an array: ${keyPath}`);
        return [];
    }

    return value;
}

/**
 * Get an object of translations (for nested objects like programs, modules)
 * @example tObject('onboarding.programs.benchDomination') => { name: "...", description: "...", features: [...] }
 */
export function tObject<T = Record<string, any>>(keyPath: string): T {
    const keys = keyPath.split('.');
    let value: any = translations[currentLanguage];

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            console.warn(`Translation object not found: ${keyPath}`);
            return {} as T;
        }
    }

    return value as T;
}

/**
 * Set current language
 */
export function setLanguage(lang: Language) {
    currentLanguage = lang;
}

/**
 * Get current language
 */
export function getLanguage(): Language {
    return currentLanguage;
}

/**
 * Check if a translation key exists
 */
export function hasTranslation(keyPath: string): boolean {
    const keys = keyPath.split('.');
    let value: any = translations[currentLanguage];

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return false;
        }
    }

    return true;
}

// Re-export translations for direct access when needed
export { translations };
