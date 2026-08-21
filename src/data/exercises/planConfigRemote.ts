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
    next: Omit<PlanExerciseDoc, 'version' | 'updatedAt' | 'updatedBy' | 'note'>,
    author: string,
    note = ''
): Promise<number> => {
    const ref = doc(db, 'planConfigs', planId);

    const current = await getDoc(ref);
    if (current.exists()) {
        const previous = current.data() as PlanExerciseDoc;
        await setDoc(doc(collection(ref, 'versions'), String(previous.version ?? 0).padStart(6, '0')), previous);
    }

    const version = await bumpPlanVersion(planId);
    const trimmed = note.trim().slice(0, 280);
    const payload: PlanExerciseDoc = {
        ...next,
        planId,
        version,
        updatedAt: new Date().toISOString(),
        updatedBy: author,
        // Omitted rather than written empty: the security rules only accept
        // `note` once they are deployed, so a publish with nothing to say keeps
        // working against the rules already in production.
        ...(trimmed ? { note: trimmed } : {}),
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

/**
 * The stored document, without the bundled seed merged in.
 *
 * `loadPlanConfig` is what the athlete's session needs — seed plus overlay. The
 * changelog needs the other thing: exactly what was published, so a diff
 * between two versions reports what an admin changed rather than what the
 * bundled seed happens to contain.
 */
export const loadRawPlanConfig = async (planId: string): Promise<PlanExerciseDoc | null> => {
    const snap = await getDoc(doc(db, 'planConfigs', planId));
    return snap.exists() ? (snap.data() as PlanExerciseDoc) : null;
};

/** Plans that have ever been published, newest version first is not implied. */
export const listPublishedPlanIds = async (): Promise<string[]> => {
    const meta = await fetchLibraryMeta();
    return Object.entries(meta?.planConfigVersions ?? {})
        .filter(([, version]) => (version ?? 0) > 0)
        .map(([planId]) => planId);
};

export type PlanChangeEntry = {
    planId: string;
    doc: PlanExerciseDoc;
    /** True for the version currently serving athletes. */
    isLive: boolean;
    /** The version this one replaced, for diffing. Absent for the first ever. */
    previous?: PlanExerciseDoc;
};

/**
 * Every published change across every plan, newest first.
 *
 * Reads only the plans that have actually been published — the portfolio is 36
 * plans and most of them run entirely on their bundled definition, so fetching
 * a history subcollection for each would be 36 wasted round trips.
 */
export const listAllPlanChanges = async (): Promise<PlanChangeEntry[]> => {
    const planIds = await listPublishedPlanIds();

    const perPlan = await Promise.all(planIds.map(async planId => {
        try {
            const [live, history] = await Promise.all([loadRawPlanConfig(planId), listPlanConfigVersions(planId)]);
            const timeline = [...(live ? [live] : []), ...history]
                // A live document is also snapshotted into `versions` the moment
                // it is replaced, so the two lists overlap by one on every plan
                // that has been edited twice.
                .filter((entry, index, all) => all.findIndex(o => o.version === entry.version) === index)
                .sort((a, b) => (b.version ?? 0) - (a.version ?? 0));

            return timeline.map((entry, index): PlanChangeEntry => ({
                planId,
                doc: entry,
                isLive: Boolean(live) && entry.version === live!.version,
                previous: timeline[index + 1],
            }));
        } catch {
            return [] as PlanChangeEntry[];
        }
    }));

    return perPlan
        .flat()
        .sort((a, b) => (b.doc.updatedAt ?? '').localeCompare(a.doc.updatedAt ?? ''));
};
