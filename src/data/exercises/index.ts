/**
 * Exercise library access — bundled seed ⊕ Firestore overlay.
 *
 * The seed in library.ts is always present, so a Firestore outage degrades to
 * the last shipped library rather than a blank workout. Admin edits are stored
 * as partial overlay entries and merged on top.
 */

import { EXERCISE_LIBRARY } from './library';
import type { ExerciseId, Lang, LibraryExercise, LibraryOverlayEntry } from './types';

export { EXERCISE_LIBRARY, EXERCISE_BY_ID } from './library';
export * from './types';

// ---------------------------------------------------------------------------
// Merge
// ---------------------------------------------------------------------------

/**
 * Applies an overlay over the bundled seed.
 *
 * Overlay entries are partial: an absent field keeps the seed's value, so the
 * admin panel only ever has to write what actually changed. An overlay entry
 * with an unknown id is treated as a brand-new exercise.
 */
export const mergeLibrary = (
    seed: LibraryExercise[],
    overlay: LibraryOverlayEntry[]
): LibraryExercise[] => {
    const byId = new Map(seed.map(entry => [entry.id, entry]));

    for (const patch of overlay) {
        const base = byId.get(patch.id);
        if (!base) {
            // A wholly new exercise authored in the admin panel.
            byId.set(patch.id, { status: 'active', aliases: [], ...patch } as LibraryExercise);
            continue;
        }
        byId.set(patch.id, {
            ...base,
            ...patch,
            // Names merge per-language so an overlay that only sets Polish
            // doesn't blank the English.
            name: { ...base.name, ...(patch.name ?? {}) },
            // Aliases are additive and never dropped: old workout logs and plan
            // data still refer to them.
            aliases: [...new Set([...base.aliases, ...(patch.aliases ?? [])])],
        });
    }

    return [...byId.values()];
};

// ---------------------------------------------------------------------------
// Name resolution
// ---------------------------------------------------------------------------

/** Effort suffixes plans append at runtime — not different movements. */
const EFFORT_SUFFIX = /\s*\((me|de|re|amrap|back-?off|back-?down|e2mom|emom|cat|light|1rm test|ascension test|heavy single|heavy double|heavy triple|optional 2nd single|final exam|eccentric only)\)\s*$/i;

/** Same normalisation the extraction pipeline used, so ids stay joinable. */
export const normalizeExerciseName = (raw: string): string =>
    raw
        .toLowerCase()
        .trim()
        .replace(EFFORT_SUFFIX, '')
        .replace(/\([^)]*\)/g, ' ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

export type ExerciseResolver = {
    all: LibraryExercise[];
    byId: (id: ExerciseId) => LibraryExercise | undefined;
    /** Resolves a plan's free-text exercise name to a library entry. */
    resolve: (name: string) => LibraryExercise | undefined;
    /** Resolves to an id, falling back to a stable `unmapped:` marker. */
    resolveId: (name: string) => ExerciseId;
    displayName: (entry: LibraryExercise | undefined, lang: Lang, fallback: string) => string;
};

export const createResolver = (library: LibraryExercise[]): ExerciseResolver => {
    const byId = new Map(library.map(e => [e.id, e]));

    // Exact spellings (canonical + every alias) take priority over normalised
    // matches, so "Front Squat" can never be captured by a looser entry.
    const exact = new Map<string, LibraryExercise>();
    const loose = new Map<string, LibraryExercise>();

    for (const entry of library) {
        for (const spelling of [entry.name.en, ...entry.aliases]) {
            if (!spelling) continue;
            exact.set(spelling.toLowerCase(), entry);
            const norm = normalizeExerciseName(spelling);
            if (norm && !loose.has(norm)) loose.set(norm, entry);
        }
        const idAsWords = entry.id.replace(/-/g, ' ');
        if (!loose.has(idAsWords)) loose.set(idAsWords, entry);
    }

    const resolve = (name: string) => {
        if (!name) return undefined;
        return exact.get(name.toLowerCase().trim()) ?? loose.get(normalizeExerciseName(name));
    };

    return {
        all: library,
        byId: id => byId.get(id),
        resolve,
        resolveId: name => resolve(name)?.id ?? `unmapped:${normalizeExerciseName(name).replace(/\s+/g, '-')}`,
        displayName: (entry, lang, fallback) => {
            if (!entry) return fallback;
            // Empty pl means "not translated yet" — fall back to English rather
            // than rendering a blank exercise name.
            return entry.name[lang] || entry.name.en || fallback;
        },
    };
};

/** Resolver over the bundled seed only. Used by scripts and as the app default. */
export const SEED_RESOLVER = createResolver(EXERCISE_LIBRARY);
