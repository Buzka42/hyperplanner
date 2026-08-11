/**
 * The two canonical tip layers.
 *
 * A session shows at most two cues per movement, in a fixed order:
 *
 *   1. **prescription** — what this plan wants from this set today. Rendered
 *      first, in the plan's accent.
 *   2. **general** — how the movement is performed, independent of any plan.
 *      Rendered second, quieter.
 *
 * There are no visible labels; colour and order carry the distinction. Both
 * show by default, and a plan may suppress the general cue only by saying so
 * explicitly — the old "override replaces everything" semantics are retired,
 * because they silently deleted safety-relevant coaching whenever a plan wanted
 * to add one sentence.
 *
 * This module is pure. It does no lookups of its own: callers hand it the
 * strings they already resolved, so precedence is testable without a plan, a
 * user or a language context.
 */

export type TipLanguage = 'en' | 'pl';
export type LocalizedTip = { en?: string; pl?: string };

export interface TipInputs {
    /** The movement's own coaching cue, from the library. */
    general?: LocalizedTip;
    /**
     * Plan-scoped prescription cues, most specific last: plan-movement first,
     * then slot-scoped, then week-scoped variant text.
     */
    prescription?: (LocalizedTip | undefined)[];
    /** Appended to the general cue rather than replacing it. */
    generalAppend?: LocalizedTip;
    /**
     * Explicit, exceptional suppression of the general cue — an Admin control,
     * not a side effect of authoring plan guidance.
     */
    suppressGeneral?: boolean;
}

export interface ResolvedTips {
    /** Rendered first, in the plan accent. May be empty. */
    prescription: string[];
    /** Rendered second, quieter. Undefined when absent or suppressed. */
    general?: string;
}

/**
 * Bilingual fallback: the requested language, then English, then nothing.
 * Polish is authored after English approval, so a missing `pl` is the normal
 * state for a freshly drafted cue rather than an error.
 */
export const pickLanguage = (text: LocalizedTip | undefined, language: TipLanguage): string | undefined => {
    const preferred = text?.[language]?.trim();
    if (preferred) return preferred;
    const fallback = text?.en?.trim();
    return fallback || undefined;
};

const normalise = (text: string) => text.trim().replace(/\s+/g, ' ').toLowerCase().replace(/[.!]+$/, '');

export const resolveTips = (inputs: TipInputs, language: TipLanguage): ResolvedTips => {
    const seen = new Set<string>();
    const prescription: string[] = [];

    for (const entry of inputs.prescription ?? []) {
        const text = pickLanguage(entry, language);
        if (!text) continue;
        // The same sentence arriving from a plan note and a variant tip is one
        // cue, not two. Duplicates were the most common complaint about the old
        // renderer, which concatenated four sources without checking.
        const key = normalise(text);
        if (seen.has(key)) continue;
        seen.add(key);
        prescription.push(text);
    }

    if (inputs.suppressGeneral) return { prescription };

    const base = pickLanguage(inputs.general, language);
    const append = pickLanguage(inputs.generalAppend, language);
    const general = [base, append].filter(Boolean).join(' ') || undefined;
    if (!general) return { prescription };

    // A general cue already said by the prescription layer is dropped rather
    // than repeated in a second colour.
    if (seen.has(normalise(general))) return { prescription };

    return { prescription, general };
};

/**
 * Whether a cue belongs to the general layer at all.
 *
 * Plan phase, weekly load, prescribed RIR, set counts and test-day instructions
 * are prescription content. They ended up in library tips repeatedly during the
 * migration, so the check is codified rather than left to review.
 */
const PRESCRIPTION_MARKERS = [
    /\bweek\s*\d/i,
    /\brir\b/i,
    /\brpe\s*\d/i,
    /\b\d+\s*(?:x|×)\s*\d+/i,
    /\bset[s]?\s*\d/i,
    /\bamrap\b/i,
    /\btest day\b/i,
    /\bphase\b/i,
    /\b\d{2,3}\s*%/,
];

export const looksLikePrescription = (text: string): boolean =>
    PRESCRIPTION_MARKERS.some(pattern => pattern.test(text));
