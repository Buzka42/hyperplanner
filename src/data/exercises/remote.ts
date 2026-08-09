/**
 * Firestore overlay for the exercise library.
 *
 * Reading the whole `exerciseLibrary` collection on every app start would be a
 * per-user read charge for data that changes rarely. Instead a single
 * `appConfig/libraryMeta` doc carries a version number: the client reads that
 * one doc, and only refetches the collection when the version has moved past
 * what's in localStorage. Steady state is one small read per session.
 */

import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { EXERCISE_LIBRARY } from './library';
import { createResolver, mergeLibrary, type ExerciseResolver } from './index';
import type { LibraryExercise, LibraryMeta, LibraryOverlayEntry } from './types';

const CACHE_KEY = 'exerciseLibraryOverlay';
const CACHE_VERSION_KEY = 'exerciseLibraryOverlayVersion';

type CachedOverlay = { version: number; entries: LibraryOverlayEntry[] };

const readCache = (): CachedOverlay | null => {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        const version = Number(localStorage.getItem(CACHE_VERSION_KEY));
        if (!raw || !Number.isFinite(version)) return null;
        return { version, entries: JSON.parse(raw) as LibraryOverlayEntry[] };
    } catch {
        return null; // corrupt or unavailable storage: fall through to a fetch
    }
};

const writeCache = (version: number, entries: LibraryOverlayEntry[]) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
        localStorage.setItem(CACHE_VERSION_KEY, String(version));
    } catch {
        // Quota or private mode — the overlay still works, just uncached.
    }
};

export const fetchLibraryMeta = async (): Promise<LibraryMeta | null> => {
    const snap = await getDoc(doc(db, 'appConfig', 'libraryMeta'));
    return snap.exists() ? (snap.data() as LibraryMeta) : null;
};

export const fetchOverlayEntries = async (): Promise<LibraryOverlayEntry[]> => {
    const snap = await getDocs(collection(db, 'exerciseLibrary'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }) as LibraryOverlayEntry);
};

/**
 * Loads the overlay, preferring the local cache when the remote version
 * matches. Never throws: any failure yields an empty overlay so the caller
 * still gets the bundled seed.
 */
export const loadOverlay = async (force = false): Promise<LibraryOverlayEntry[]> => {
    try {
        const meta = await fetchLibraryMeta();
        const remoteVersion = meta?.libraryVersion ?? 0;

        if (!force) {
            const cached = readCache();
            if (cached && cached.version === remoteVersion) return cached.entries;
        }

        const entries = await fetchOverlayEntries();
        writeCache(remoteVersion, entries);
        return entries;
    } catch (error) {
        console.warn('[exercises] overlay unavailable, using bundled library', error);
        return readCache()?.entries ?? [];
    }
};

/** Full library (seed ⊕ overlay) plus a resolver over it. */
export const loadLibrary = async (force = false): Promise<{ library: LibraryExercise[]; resolver: ExerciseResolver }> => {
    const overlay = await loadOverlay(force);
    const library = mergeLibrary(EXERCISE_LIBRARY, overlay);
    return { library, resolver: createResolver(library) };
};

// ---------------------------------------------------------------------------
// Admin writes
// ---------------------------------------------------------------------------

const bumpVersion = async () => {
    const meta = await fetchLibraryMeta();
    const next: LibraryMeta = {
        libraryVersion: (meta?.libraryVersion ?? 0) + 1,
        planConfigVersions: meta?.planConfigVersions ?? {},
        updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'appConfig', 'libraryMeta'), next, { merge: true });
    return next.libraryVersion;
};

/**
 * Writes only the fields that differ from the bundled seed, so the overlay
 * stays a small diff rather than a second copy of the library.
 */
export const diffAgainstSeed = (entry: LibraryExercise): LibraryOverlayEntry | null => {
    const seed = EXERCISE_LIBRARY.find(e => e.id === entry.id);
    if (!seed) return entry; // new exercise: store it whole

    const patch: Record<string, unknown> = { id: entry.id };
    let changed = false;

    if (entry.name.en !== seed.name.en || entry.name.pl !== seed.name.pl) {
        patch.name = { en: entry.name.en, pl: entry.name.pl };
        changed = true;
    }
    for (const key of ['pattern', 'weightMode', 'status', 'swapGroup'] as const) {
        if (entry[key] !== seed[key]) { patch[key] = entry[key]; changed = true; }
    }
    for (const key of ['primary', 'secondary', 'equipment', 'aliases', 'tags'] as const) {
        const a = JSON.stringify(entry[key] ?? []);
        const b = JSON.stringify(seed[key] ?? []);
        if (a !== b) { patch[key] = entry[key] ?? []; changed = true; }
    }
    for (const key of ['tip', 'setupNotes', 'media'] as const) {
        if (JSON.stringify(entry[key] ?? null) !== JSON.stringify(seed[key] ?? null)) {
            patch[key] = entry[key] ?? null;
            changed = true;
        }
    }
    if (Boolean(entry.unilateral) !== Boolean(seed.unilateral)) {
        patch.unilateral = Boolean(entry.unilateral);
        changed = true;
    }

    return changed ? (patch as LibraryOverlayEntry) : null;
};

/**
 * Saves a batch of edited exercises. Entries that match the seed exactly have
 * their overlay doc removed rather than stored as a no-op patch, so reverting
 * an edit in the UI genuinely returns to the shipped value.
 */
export const saveLibraryEdits = async (edited: LibraryExercise[]): Promise<number> => {
    const batch = writeBatch(db);

    for (const entry of edited) {
        const patch = diffAgainstSeed(entry);
        const ref = doc(db, 'exerciseLibrary', entry.id);
        if (patch) batch.set(ref, { ...patch, updatedAt: new Date().toISOString() }, { merge: false });
        else batch.delete(ref);
    }

    await batch.commit();
    const version = await bumpVersion();
    writeCache(version, await fetchOverlayEntries());
    return version;
};

/** Drops a single overlay entry, restoring the bundled definition. */
export const resetExerciseToSeed = async (id: string) => {
    await deleteDoc(doc(db, 'exerciseLibrary', id));
    const version = await bumpVersion();
    writeCache(version, await fetchOverlayEntries());
};
