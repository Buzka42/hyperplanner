/**
 * Emulator check that every plan can actually save a session.
 *
 * This exists because of a real defect: Arms Race declared
 * `session: { kind: 'rotation' }`, `validWorkout` only allowed
 * `scheduled | pair-select | session-select`, and so every session an athlete
 * finished on that plan was rejected by security rules. The failure was
 * swallowed by a catch in WorkoutView, the athlete was navigated to the
 * dashboard as though it had saved, and `completedSessions` still incremented
 * because the profile update is a separate write. The symptom an owner sees is
 * "only the main lift saved" — the working load persisted, the session did not.
 *
 * Nothing caught it because the plan definitions are TypeScript and the rules
 * are not: `sessionKind` is a four-member union in `src/types.ts` and was a
 * three-member list in `firestore.rules`, and nothing compared them.
 *
 * So this walks every plan, builds the session log exactly as WorkoutView does,
 * and asserts the deployed rules accept it.
 *
 * Run: npm run verify:workout-writes
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

import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_IDS } from '../src/data/planMeta';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { createResolver } from '../src/data/exercises';
import { resolveDay } from '../src/lib/planResolution';
import { extractPerformanceObservations } from '../src/features/performanceProfile';
import { updatePerformanceSummary } from '../src/features/performanceProfile/summary';
import { buildPreviewUser } from '../src/pages/admin/previewUser';
import type { WorkoutDay } from '../src/types';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rules = readFileSync(resolve(root, 'firestore.rules'), 'utf8');
const resolver = createResolver(EXERCISE_LIBRARY);

const KEYWORD = 'rules-athlete';
const OWNER = 'owner-uid';

let checks = 0;

/** The session document WorkoutView writes, for one plan's first real day. */
const buildSessionLog = (planId: string) => {
    const config = PLAN_REGISTRY[planId];
    const user = buildPreviewUser(planId);

    for (const week of config.program.weeks.slice(0, 2)) {
        for (const day of week.days) {
            let generated: WorkoutDay = day;
            try {
                generated = config.hooks?.preprocessDay?.({ ...day, weekNumber: week.weekNumber }, user) ?? day;
            } catch {
                continue;
            }
            if (!generated.exercises?.length) continue;

            const dayData = resolveDay(generated, {
                planId, user, resolver, lang: 'en', week: week.weekNumber,
            });
            if (!dayData?.exercises.length) continue;

            const exercises = dayData.exercises.map(exercise => ({
                id: exercise.id,
                name: exercise.name,
                ...(exercise.exerciseId ? { exerciseId: exercise.exerciseId } : {}),
                setsData: Array.from({ length: Math.max(1, exercise.sets) }, () => ({
                    reps: '8', weight: '50', completed: true,
                })),
                notes: null,
            }));

            return {
                date: new Date().toISOString(),
                week: week.weekNumber,
                day: dayData.dayOfWeek,
                dayName: dayData.dayName,
                exercises,
                programId: planId,
                ...(config.session?.kind ? { sessionKind: config.session.kind } : {}),
            };
        }
    }
    return null;
};

async function run() {
    const testEnv: RulesTestEnvironment = await initializeTestEnvironment({
        projectId: 'demo-workout-writes',
        firestore: { rules, host: '127.0.0.1', port: 8080 },
    });

    try {
        await testEnv.withSecurityRulesDisabled(async ctx => {
            await ctx.firestore().doc(`users/${KEYWORD}`).set({ id: KEYWORD, ownerUid: OWNER, codeword: KEYWORD });
        });

        const db = testEnv.authenticatedContext(OWNER).firestore();
        const failures: string[] = [];

        for (const planId of PLAN_IDS) {
            const sessionLog = buildSessionLog(planId);
            if (!sessionLog) continue;

            // The session document itself.
            try {
                await assertSucceeds(db.doc(`users/${KEYWORD}/workouts/${planId}`).set(sessionLog));
                checks++;
            } catch {
                failures.push(`${planId}: workout document rejected (sessionKind=${JSON.stringify(sessionLog.sessionKind)})`);
                continue;
            }

            // And the performance profile written in the same transaction: a
            // rejection here loses the session just as completely.
            const observations = extractPerformanceObservations({
                sessionId: planId,
                date: sessionLog.date,
                programId: sessionLog.programId,
                week: sessionLog.week,
                day: sessionLog.day,
                exercises: sessionLog.exercises,
            });

            const groups = new Map<string, typeof observations>();
            for (const observation of observations) {
                const group = groups.get(observation.exerciseId) ?? [];
                group.push(observation);
                groups.set(observation.exerciseId, group);
            }

            for (const [exerciseId, group] of groups) {
                const summary = updatePerformanceSummary(undefined, group);
                if (summary) {
                    try {
                        await assertSucceeds(db.doc(`users/${KEYWORD}/performanceProfile/${exerciseId}`).set(summary));
                        checks++;
                    } catch {
                        failures.push(`${planId}: performance summary rejected for ${exerciseId}`);
                    }
                }
                try {
                    await assertSucceeds(
                        db.doc(`users/${KEYWORD}/performanceProfile/${exerciseId}/observations/${planId}-0`).set(group[0])
                    );
                    checks++;
                } catch {
                    failures.push(`${planId}: observation rejected for ${exerciseId}`);
                }
            }
        }

        // The rule must still be a real gate, not a rubber stamp.
        const valid = buildSessionLog('bench-domination')!;
        await assertFails(db.doc(`users/${KEYWORD}/workouts/bad-kind`).set({ ...valid, sessionKind: 'not-a-kind' }));
        await assertFails(db.doc(`users/${KEYWORD}/workouts/bad-plan`).set({ ...valid, programId: 'not-a-plan' }));
        await assertFails(db.doc(`users/${KEYWORD}/workouts/bad-extra`).set({ ...valid, somethingElse: true }));
        await assertFails(testEnv.unauthenticatedContext().firestore().doc(`users/${KEYWORD}/workouts/anon`).set(valid));
        checks += 4;

        if (failures.length) {
            console.error(`  test-workout-write-rules FAILED — ${failures.length} plan writes rejected:`);
            for (const failure of failures) console.error(`    ${failure}`);
            process.exit(1);
        }

        console.log(`  test-workout-write-rules OK — every plan's session log, summary and observations pass the deployed rules (${checks} assertions)`);
    } finally {
        await testEnv.cleanup();
    }
}

run().catch(error => {
    console.error(error);
    process.exit(1);
});
