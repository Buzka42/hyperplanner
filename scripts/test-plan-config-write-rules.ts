/**
 * Emulator check for the admin plan-config write path.
 *
 * The composer's publish is not one write. It snapshots the document it is
 * about to replace into `planConfigs/{planId}/versions/{n}`, bumps the plan's
 * version in `appConfig/libraryMeta`, then writes the new document — and the
 * changelog's revert replays that same sequence with an older payload. Every
 * step of it goes through security rules that only an admin passes.
 *
 * None of that was covered: the composer's own tests run in-process and never
 * touch rules, so a rules change could reject a publish and nothing would say
 * so until an owner tried to publish. This runs the real sequence against the
 * real `firestore.rules`.
 *
 * Run: npm run verify:plan-config-writes
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rules = readFileSync(resolve(root, 'firestore.rules'), 'utf8');

const PLAN_ID = 'bench-domination';

/** The shape the composer publishes: movement scope, slot scope, defaults. */
const configV1 = {
    planId: PLAN_ID,
    version: 1,
    updatedAt: '2026-08-21T10:00:00.000Z',
    updatedBy: 'admin',
    exercises: {
        'paused-bench-press': {
            setsDelta: 1,
            restSeconds: 180,
            swap: { policy: 'pool', pool: ['spoto-press', 'larsen-press'] },
            technique: { kind: 'drop-set', drops: 2, dropPercent: 20, applyTo: 'last', toFailure: true },
        },
        'dragon-flags': { enabled: false },
    },
    slots: {
        // A running order, which is what reordering a session writes.
        'w1d1#0': { order: 1 },
        'w1d1#1': { order: 0 },
        'w1d1#2': { order: 2, repsMin: 6, repsMax: 8 },
    },
    groups: {},
    defaults: { restSeconds: 120, swap: { policy: 'locked' } },
};

const configV2 = {
    ...configV1,
    version: 2,
    updatedAt: '2026-08-21T11:00:00.000Z',
    exercises: { 'paused-bench-press': { setsDelta: 2 } },
    slots: {},
    note: 'Bench up a set for the peaking block',
};

async function run() {
    const testEnv: RulesTestEnvironment = await initializeTestEnvironment({
        projectId: 'demo-hyperplanner-plan-config',
        firestore: { rules, host: '127.0.0.1', port: 8080 },
    });

    try {
        const admin = testEnv.authenticatedContext('admin-device-uid', { admin: true }).firestore();
        const athlete = testEnv.authenticatedContext('athlete-uid').firestore();
        const anonymous = testEnv.unauthenticatedContext().firestore();

        // --- publishing --------------------------------------------------------
        await assertSucceeds(admin.doc(`planConfigs/${PLAN_ID}`).set(configV1));
        await assertSucceeds(admin.doc('appConfig/libraryMeta').set({
            libraryVersion: 0,
            planConfigVersions: { [PLAN_ID]: 1 },
            updatedAt: configV1.updatedAt,
        }));

        // A running order stored per slot is the whole reordering feature; if
        // rules rejected `order` inside a slot map, reordering would fail only
        // at publish time.
        await assertSucceeds(
            admin.doc(`planConfigs/${PLAN_ID}`).set({ ...configV1, slots: { 'w3d2#4': { order: 0 } } })
        );

        // --- the publish note ---------------------------------------------------
        await assertSucceeds(admin.doc(`planConfigs/${PLAN_ID}`).set(configV2));
        await assertFails(
            admin.doc(`planConfigs/${PLAN_ID}`).set({ ...configV2, note: 'x'.repeat(281) })
        );
        await assertFails(
            admin.doc(`planConfigs/${PLAN_ID}`).set({ ...configV2, note: 42 })
        );
        // A document with no note at all must still publish: the composer omits
        // the field entirely when there is nothing to say.
        const { note: _dropped, ...withoutNote } = configV2;
        await assertSucceeds(admin.doc(`planConfigs/${PLAN_ID}`).set(withoutNote));

        // --- the document stays closed ------------------------------------------
        await assertFails(
            admin.doc(`planConfigs/${PLAN_ID}`).set({ ...configV2, somethingNew: true })
        );
        await assertFails(
            admin.doc(`planConfigs/${PLAN_ID}`).set({ ...configV2, planId: 'not-a-real-plan' })
        );
        await assertFails(admin.doc('planConfigs/not-a-real-plan').set({ ...configV2, planId: 'not-a-real-plan' }));

        // --- only an admin publishes ---------------------------------------------
        await assertFails(athlete.doc(`planConfigs/${PLAN_ID}`).set(configV2));
        await assertFails(anonymous.doc(`planConfigs/${PLAN_ID}`).set(configV2));
        await assertFails(athlete.doc('appConfig/libraryMeta').set({ libraryVersion: 99 }));
        // But an athlete must be able to READ it, or their session cannot
        // resolve the config the owner published.
        await assertSucceeds(athlete.doc(`planConfigs/${PLAN_ID}`).get());

        // --- history is append-only ------------------------------------------------
        const versionRef = admin.doc(`planConfigs/${PLAN_ID}/versions/000001`);
        await assertSucceeds(versionRef.set(configV1));
        await assertFails(versionRef.set({ ...configV1, updatedBy: 'rewritten' }));
        await assertFails(versionRef.delete());
        await assertSucceeds(admin.doc(`planConfigs/${PLAN_ID}/versions/000002`).set(configV2));
        await assertFails(athlete.doc(`planConfigs/${PLAN_ID}/versions/000003`).set(configV1));
        // History is the owner's audit trail, not athlete-readable.
        await assertFails(athlete.doc(`planConfigs/${PLAN_ID}/versions/000001`).get());
        await assertSucceeds(admin.collection(`planConfigs/${PLAN_ID}/versions`).get());

        // --- a revert is a normal publish ---------------------------------------------
        // The changelog reverts by republishing an old payload as a new version,
        // so it must satisfy exactly the same rules a first publish did.
        const reverted = {
            ...configV1,
            version: 3,
            updatedAt: '2026-08-21T12:00:00.000Z',
            note: 'revert to v1',
        };
        await assertSucceeds(admin.doc(`planConfigs/${PLAN_ID}`).set(reverted));
        await assertSucceeds(admin.doc('appConfig/libraryMeta').set({
            libraryVersion: 0,
            planConfigVersions: { [PLAN_ID]: 3 },
            updatedAt: reverted.updatedAt,
        }));

        // And the revert is itself reversible, which is the claim the changelog
        // makes to the owner when it does not ask for confirmation.
        await assertSucceeds(admin.doc(`planConfigs/${PLAN_ID}`).set({
            ...configV2, version: 4, updatedAt: '2026-08-21T12:05:00.000Z', note: 'undo revert, back to v2',
        }));

        console.log(
            '  test-plan-config-write-rules OK — publish, slot ordering, notes, append-only history and the revert round trip all pass the deployed rules; athletes and anonymous sessions are denied'
        );
    } finally {
        await testEnv.cleanup();
    }
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
