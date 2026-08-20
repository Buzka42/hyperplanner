/**
 * Emulator check for the authenticated user-doc write path (T-54).
 *
 * Seeds a test_claude-shaped profile (36 allowed plans, many status objects)
 * and asserts that an ordinary owner can save an Apex assessment, increment
 * completedSessions, and self-claim an unowned doc — and that extra fields
 * and stolen ownership still deny.
 *
 * Run: npx firebase emulators:exec --only firestore "npx tsx scripts/test-profile-write-rules.ts"
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

const ALLOWED_PLAN_IDS = [
    '30-minute-adventure', 'bench-domination', 'pencilneck-eradication', 'peachy-glute-plan',
    'skeleton-to-threat', 'pain-and-glory', 'trinary', 'super-mutant', 'ritual-of-strength',
    'king-of-the-squat', 'purgatorio', 'overhead-dominion', 'arms-race', 'kali', 'house-of-iron',
    'neural-overload', 'venus-rising', 'iron-clock', 'lazarus', 'cathedral', 'monolith',
    'event-horizon', 'oracle', 'project-chimera', 'atlas', 'blackout', 'quadfather',
    'the-minimum', 'redline', 'athena', 'apex-predator', 'workhorse', 'tenfold',
    'immaculate-restructure', 'hamstring-foundry', 'gravity-is-optional',
];

const OWNER = 'alice-uid';
const KEYWORD = 'test_claude';

const fatProfile = {
    id: KEYWORD,
    ownerUid: OWNER,
    codeword: KEYWORD,
    stats: { pausedBench: 100, wideGripBench: 0, spotoPress: 0, lowPinPress: 0, squat: 160, conventionalDeadlift: 200, flatBench: 100 },
    startDate: '2026-08-15T12:20:17.438Z',
    programId: 'project-chimera',
    allowedPlanIds: ALLOWED_PLAN_IDS,
    allowPlanSwitching: true,
    completedSessions: 0,
    benchHistory: [],
    programProgress: { 'project-chimera': { completedSessions: 0, startDate: '2026-08-15T13:59:00.000Z' } },
    badges: ['first_blood'],
    selectedDays: [1, 2, 4, 5],
    scheduleMode: 'fixed',
    exercisePreferences: { 'push-a-leg-primary': 'Hack Squat' },
    benchDominationModules: { accessories: true, behindNeckPress: true, legDays: true, tricepGiantSet: true, weightedPullups: true },
    skeletonStatus: { plankTargetSeconds: 40 },
    ritualStatus: { completedWorkouts: 0, currentWeek: 5, benchPress1RM: 100, squat1RM: 160, deadlift1RM: 200 },
    superMutantStatus: { completedWorkouts: 0, currentCycle: 1, chestVariant: 'A', backVariant: 'A', bench1RM: 0, squat1RM: 0, deadlift1RM: 0, quadExercise: 'Hack Squat', hamstringExercise: 'Good Mornings', nextUpperBlock: 'A', nextLowerBlock: 'C', muscleGroupTimestamps: {}, rolling7DayVolume: { chest: 0 }, weeklySessionDates: [] },
    trinaryStatus: { completedWorkouts: 0, currentBlock: 1, cycleNumber: 1, bench1RM: 100, squat1RM: 160, deadlift1RM: 200, workoutLog: [] },
    houseOfIronStatus: { preferredImplement: 'dumbbell', equipment: [], progression: {}, pendingProgressions: {}, sessionHistory: [] },
    kaliStatus: { baseline: { squat: 30, push: 30, pull: 23.3 } },
    atlasStatus: { carries: [] },
    apexPredatorStatus: { assessments: [], emphasis: { regions: ['ankle', 'thoracicRotation'], sinceWeek: 0 } },
    workingLoads: { atlas: { 'farmer-carry': 24 } },
    planPreferences: { kali: { scheduleMode: '4day', updatedAt: '2026-08-15T08:14:23.080Z' } },
    trainingPreferences: { coreRaiseId: 'hanging-leg-raise' },
    pendingCalibration: [],
    armMeasurements: [],
    gluteMeasurements: [],
    pencilneckBenchHistory: [],
};

const accessKey = {
    keyword: KEYWORD,
    allowedPlanIds: ALLOWED_PLAN_IDS,
    active: true,
    source: 'admin',
    allowPlanSwitching: true,
    expiresAt: null,
    createdAt: '2026-08-14T17:00:04.628Z',
    createdBy: 'admin',
};

const apexSave = {
    apexPredatorStatus: {
        assessments: [{
            week: 0,
            date: '2026-08-19T20:00:00.000Z',
            regions: { ankle: { pain: 'none', score: 1 }, hipRotation: { pain: 'none', score: 1 } },
            squatScreen: '',
            videoAdvice: [],
        }],
        emphasis: { regions: ['ankle', 'hipRotation'], sinceWeek: 0 },
    },
};

async function run() {
    const testEnv: RulesTestEnvironment = await initializeTestEnvironment({
        projectId: 'demo-hyperplanner',
        firestore: { rules, host: '127.0.0.1', port: 8080 },
    });

    try {
        await testEnv.withSecurityRulesDisabled(async (ctx) => {
            await ctx.firestore().doc(`accessKeys/${KEYWORD}`).set(accessKey);
            await ctx.firestore().doc(`users/${KEYWORD}`).set(fatProfile);
            const { ownerUid: _unused, ...unowned } = fatProfile;
            await ctx.firestore().doc('users/unowned').set({ ...unowned, id: 'unowned', codeword: 'unowned' });
        });

        const owner = testEnv.authenticatedContext(OWNER);
        const stranger = testEnv.authenticatedContext('stranger-uid');
        const db = owner.firestore();

        await assertSucceeds(db.doc(`users/${KEYWORD}`).update(apexSave));
        await assertSucceeds(db.doc(`users/${KEYWORD}`).update({ completedSessions: 1 }));
        await assertSucceeds(db.doc(`users/${KEYWORD}`).update({ 'programProgress.project-chimera.completedSessions': 1 }));
        await assertFails(db.doc(`users/${KEYWORD}`).update({ notAProfileField: true }));
        await assertFails(stranger.firestore().doc(`users/${KEYWORD}`).update(apexSave));
        await assertFails(stranger.firestore().doc('users/unowned').update({ ownerUid: OWNER }));
        await assertSucceeds(owner.firestore().doc('users/unowned').update({ ownerUid: OWNER }));

        console.log('  test-profile-write-rules OK — fat-profile assessment save, session increment, and self-claim succeed; extra fields and theft deny');
    } finally {
        await testEnv.cleanup();
    }
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
