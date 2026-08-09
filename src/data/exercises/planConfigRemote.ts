/**
 * Firestore overlay for per-plan exercise configuration.
 *
 * Same shape as the library overlay: a bundled seed is always present, admin
 * edits live in `planConfigs/{planId}`, and `appConfig/libraryMeta` carries a
 * per-plan version so the client only refetches a plan's config when it has
 * actually changed.
 *
 * Every write also snapshots the previous document to
 * `planConfigs/{planId}/versions/{id}` so an edit can be diffed and rolled back.
 */

import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { PLAN_EXERCISE_CONFIGS } from './planConfigs';
import type { LibraryMeta, PlanExerciseDoc } from './types';

const cacheKey = (planId: string) => `planConfig:${planId}`;
const versionKey = (planId: string) => `planConfig:${planId}:version`;

const readCache = (planId: string): { version: number; doc: PlanExerciseDoc } | null => {
    try {
        const raw = localStorage.getItem(cacheKey(planId));
        const version = Number(localStorage.getItem(versionKey(planId)));
        if (!raw || !Number.isFinite(version)) return null;
        return { version, doc: JSON.parse(raw) as PlanExerciseDoc };
    } catch {
        return null;
    }
};

const writeCache = (planId: string, version: number, value: PlanExerciseDoc) => {
    try {
        localStorage.setItem(cacheKey(planId), JSON.stringify(value));
        localStorage.setItem(versionKey(planId), String(version));
    } catch {
        // Storage unavailable — the config still works, just uncached.
    }
};

const emptyDoc = (planId: string): PlanExerciseDoc => ({
    planId,
    version: 0,
    updatedAt: new Date(0).toISOString(),
    updatedBy: '',
    exercises: {},
});

export const fetchLibraryMeta = async (): Promise<LibraryMeta | null> => {
    const snap = await getDoc(doc(db, 'appConfig', 'libraryMeta'));
    return snap.exists() ? (snap.data() as LibraryMeta) : null;
};

/**
 * Seed merged with the remote overlay. Never throws: a failure yields the
 * bundled seed so a workout still renders.
 */
export const loadPlanConfig = async (planId: string, force = false): Promise<PlanExerciseDoc> => {
    const seed = PLAN_EXERCISE_CONFIGS[planId] ?? emptyDoc(planId);

    try {
        const meta = await fetchLibraryMeta();
        const remoteVersion = meta?.planConfigVersions?.[planId] ?? 0;

        if (!force) {
            const cached = readCache(planId);
            if (cached && cached.version === remoteVersion) return mergeConfigs(seed, cached.doc);
        }

        if (remoteVersion === 0) return seed;   // nothing published for this plan

        const snap = await getDoc(doc(db, 'planConfigs', planId));
        if (!snap.exists()) return seed;

        const remote = snap.data() as PlanExerciseDoc;
        writeCache(planId, remoteVersion, remote);
        return mergeConfigs(seed, remote);
    } catch (error) {
        console.warn(`[exercises] plan config for ${planId} unavailable, using bundled seed`, error);
        const cached = readCache(planId);
        return cached ? mergeConfigs(seed, cached.doc) : seed;
    }
};

/** Remote wins per exercise/slot; seed entries with no remote counterpart survive. */
export const mergeConfigs = (seed: PlanExerciseDoc, remote: PlanExerciseDoc): PlanExerciseDoc => ({
    ...seed,
    ...remote,
    exercises: { ...seed.exercises, ...remote.exercises },
    slots: { ...(seed.slots ?? {}), ...(remote.slots ?? {}) },
    groups: { ...(seed.groups ?? {}), ...(remote.groups ?? {}) },
    defaults: { ...(seed.defaults ?? {}), ...(remote.defaults ?? {}) },
});

// ---------------------------------------------------------------------------
// Admin writes
// ---------------------------------------------------------------------------

const bumpPlanVersion = async (planId: string): Promise<number> => {
    const meta = await fetchLibraryMeta();
    const next = (meta?.planConfigVersions?.[planId] ?? 0) + 1;
    await setDoc(
        doc(db, 'appConfig', 'libraryMeta'),
        {
            libraryVersion: meta?.libraryVersion ?? 0,
            planConfigVersions: { ...(meta?.planConfigVersions ?? {}), [planId]: next },
            updatedAt: new Date().toISOString(),
        } satisfies LibraryMeta,
        { merge: true }
    );
    return next;
};

/**
 * Publishes a plan config, snapshotting the version it replaces first so the
 * change can be reviewed or reverted.
 */
export const savePlanConfig = async (
    planId: string,
    next: Omit<PlanExerciseDoc, 'version' | 'updatedAt' | 'updatedBy'>,
    author: string
): Promise<number> => {
    const ref = doc(db, 'planConfigs', planId);

    const current = await getDoc(ref);
    if (current.exists()) {
        const previous = current.data() as PlanExerciseDoc;
        await setDoc(doc(collection(ref, 'versions'), String(previous.version ?? 0).padStart(6, '0')), previous);
    }

    const version = await bumpPlanVersion(planId);
    const payload: PlanExerciseDoc = {
        ...next,
        planId,
        version,
        updatedAt: new Date().toISOString(),
        updatedBy: author,
    };

    await setDoc(ref, payload);
    writeCache(planId, version, payload);
    return version;
};

export const listPlanConfigVersions = async (planId: string): Promise<PlanExerciseDoc[]> => {
    const snap = await getDocs(
        query(collection(doc(db, 'planConfigs', planId), 'versions'), orderBy('version', 'desc'), limit(25))
    );
    return snap.docs.map(d => d.data() as PlanExerciseDoc);
};
