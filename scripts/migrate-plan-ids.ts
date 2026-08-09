/**
 * migrate-plan-ids
 *
 * Rewrites the three renamed plan ids in Firestore:
 *
 *   accumulate-intensify -> purgatorio
 *   the-weakest-link     -> immaculate-restructure
 *   upper-body-squat     -> workhorse
 *
 * The app already reads through `canonicalPlanId`, so nothing is broken while
 * this is pending — this makes the rename permanent so the alias map can
 * eventually be dropped for live data.
 *
 * Runs dry by default and prints every change it would make. Pass --apply to
 * write. Requires GOOGLE_APPLICATION_CREDENTIALS pointing at a service account
 * with Firestore access:
 *
 *   npx tsx scripts/migrate-plan-ids.ts            # dry run
 *   npx tsx scripts/migrate-plan-ids.ts --apply    # write
 *
 * Deliberately NOT rewritten: documents in users/<id>/workouts. A saved session
 * is a historical record of what was run under the id current at the time, and
 * the alias map keeps them readable. Rewriting history to match a marketing
 * rename is how logs stop being trustworthy.
 */

import { LEGACY_PLAN_IDS } from '../src/data/planIds';

const APPLY = process.argv.includes('--apply');

type Change = { doc: string; field: string; from: string; to: string };

const main = async () => {
    // Imported lazily so a dry run in an environment without credentials still
    // fails with a clear message rather than at module load.
    let admin: typeof import('firebase-admin');
    try {
        admin = await import('firebase-admin');
    } catch {
        console.error('\n  firebase-admin is not installed.\n');
        console.error('   npm i -D firebase-admin\n');
        process.exit(1);
    }

    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.error('\n  GOOGLE_APPLICATION_CREDENTIALS is not set.\n');
        console.error('   Point it at a service-account JSON with Firestore access, then re-run.\n');
        process.exit(1);
    }

    if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.applicationDefault() });
    const db = admin.firestore();

    const changes: Change[] = [];

    // --- users -------------------------------------------------------------
    const users = await db.collection('users').get();
    for (const snap of users.docs) {
        const data = snap.data();
        const update: Record<string, unknown> = {};

        const mappedProgram = LEGACY_PLAN_IDS[data.programId];
        if (mappedProgram) {
            update.programId = mappedProgram;
            changes.push({ doc: `users/${snap.id}`, field: 'programId', from: data.programId, to: mappedProgram });
        }

        if (Array.isArray(data.allowedPlanIds)) {
            const mapped = [...new Set(data.allowedPlanIds.map((id: string) => LEGACY_PLAN_IDS[id] ?? id))];
            if (JSON.stringify(mapped) !== JSON.stringify(data.allowedPlanIds)) {
                update.allowedPlanIds = mapped;
                changes.push({ doc: `users/${snap.id}`, field: 'allowedPlanIds', from: data.allowedPlanIds.join(','), to: mapped.join(',') });
            }
        }

        if (data.programProgress && typeof data.programProgress === 'object') {
            const entries = Object.entries(data.programProgress);
            if (entries.some(([id]) => LEGACY_PLAN_IDS[id])) {
                const mapped: Record<string, unknown> = {};
                for (const [id, value] of entries) {
                    const key = LEGACY_PLAN_IDS[id] ?? id;
                    // If both ids somehow carry progress, keep the one already
                    // under the new id rather than clobbering it.
                    if (!(key in mapped)) mapped[key] = value;
                }
                update.programProgress = mapped;
                changes.push({ doc: `users/${snap.id}`, field: 'programProgress', from: entries.map(([k]) => k).join(','), to: Object.keys(mapped).join(',') });
            }
        }

        if (APPLY && Object.keys(update).length) await snap.ref.update(update);
    }

    // --- accessKeys --------------------------------------------------------
    const keys = await db.collection('accessKeys').get();
    for (const snap of keys.docs) {
        const data = snap.data();
        if (!Array.isArray(data.allowedPlanIds)) continue;
        const mapped = [...new Set(data.allowedPlanIds.map((id: string) => LEGACY_PLAN_IDS[id] ?? id))];
        if (JSON.stringify(mapped) === JSON.stringify(data.allowedPlanIds)) continue;
        changes.push({ doc: `accessKeys/${snap.id}`, field: 'allowedPlanIds', from: data.allowedPlanIds.join(','), to: mapped.join(',') });
        if (APPLY) await snap.ref.update({ allowedPlanIds: mapped });
    }

    // --- report ------------------------------------------------------------
    if (!changes.length) {
        console.log('\n  migrate-plan-ids: nothing to change — no legacy plan ids found.\n');
        return;
    }

    console.log(`\n  migrate-plan-ids: ${changes.length} change(s) ${APPLY ? 'APPLIED' : 'pending (dry run)'}\n`);
    for (const c of changes) console.log(`   ${c.doc}  ${c.field}\n      ${c.from}\n   -> ${c.to}`);
    if (!APPLY) console.log('\n   Re-run with --apply to write these.\n');
    else console.log('\n   Done. Old ids remain valid in firestore.rules until you remove them.\n');
};

main().catch(err => { console.error(err); process.exit(1); });
