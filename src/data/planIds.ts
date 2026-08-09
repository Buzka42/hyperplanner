/**
 * Plan ids as stored before the rename, mapped to their current id.
 *
 * Ids key user documents, `programProgress` entries, saved workout logs and
 * access keys, so renaming them in code alone would strand every athlete
 * mid-program on a plan the registry no longer knows. Reads resolve through
 * `canonicalPlanId`; `scripts/migrate-plan-ids.ts` rewrites the stored data.
 * Having both means the code deploy and the migration can run in either order
 * without a window where the app is broken.
 *
 * This map stays after the migration: historical workout logs keep the id they
 * were written with, and are deliberately not rewritten.
 *
 * Dependency-free on purpose — both `plans.ts` and `planMeta.ts` need it, and
 * importing one from the other would make a cycle.
 */

export const LEGACY_PLAN_IDS: Record<string, string> = {
    'accumulate-intensify': 'purgatorio',
    'the-weakest-link': 'immaculate-restructure',
    'upper-body-squat': 'workhorse',
};

/** Resolves a stored plan id to the id the registry uses today. */
export const canonicalPlanId = (id?: string): string | undefined =>
    id ? (LEGACY_PLAN_IDS[id] ?? id) : id;

/** Maps a list of stored ids, dropping duplicates a rename could introduce. */
export const canonicalPlanIds = (ids?: string[]): string[] =>
    ids ? [...new Set(ids.map(id => canonicalPlanId(id)!))] : [];

/**
 * Rewrites the plan ids on a loaded profile so the rest of the app never has to
 * think about the rename. Read-side only — it does not write to Firestore, so
 * an unmigrated athlete simply works, and `migrate-plan-ids.ts` makes it
 * permanent.
 *
 * Typed loosely because it runs on raw Firestore data, before the shape is
 * trusted.
 */
export const normalizeLegacyPlanIds = <T extends {
    programId?: string;
    allowedPlanIds?: string[];
    programProgress?: Record<string, unknown>;
}>(profile: T): T => {
    const programId = canonicalPlanId(profile.programId);
    const allowedPlanIds = profile.allowedPlanIds ? canonicalPlanIds(profile.allowedPlanIds) : undefined;

    let programProgress = profile.programProgress;
    if (programProgress) {
        const mapped: Record<string, unknown> = {};
        for (const [id, value] of Object.entries(programProgress)) {
            // On the off chance both ids carry progress, the newer entry wins
            // rather than being silently overwritten by the legacy one.
            const key = canonicalPlanId(id)!;
            mapped[key] = key in mapped ? mapped[key] : value;
        }
        programProgress = mapped;
    }

    return {
        ...profile,
        ...(programId !== undefined && { programId }),
        ...(allowedPlanIds !== undefined && { allowedPlanIds }),
        ...(programProgress !== undefined && { programProgress }),
    };
};
