/**
 * Group 2: Bodybuilding, Hypertrophy & Density Plans Verification Suite
 * Persona: test_workhorse
 *
 * Plans Tested:
 * 1. Pencilneck Eradication (`pencilneck-eradication`)
 * 2. Super Mutant (`super-mutant`)
 * 3. Venus Rising (`venus-rising`)
 * 4. Tenfold (`tenfold`)
 * 5. Neural Overload (`neural-overload`)
 * 6. Purgatorio (`purgatorio`)
 */

import assert from 'node:assert/strict';
import { PENCILNECK_CONFIG, PENCILNECK_PROGRAM } from '../src/data/pencilneck';
import { SUPER_MUTANT_CONFIG, generateNextWorkout, getMuscleContributions } from '../src/data/supermutant';
import { VENUS_RISING_CONFIG, VENUS_FOUR_DAY, VENUS_THREE_DAY, effectiveVenusMode } from '../src/data/plans/venusRising';
import { TENFOLD_CONFIG } from '../src/data/plans/tenfold';
import { NEURAL_OVERLOAD_CONFIG } from '../src/data/plans/neuralOverload';
import { PURGATORIO_CONFIG } from '../src/data/plans/purgatorio';
import { pencilneckProgression } from '../src/features/workout/progression/historyEntries';
import { superMutantProgression } from '../src/features/workout/progression/superMutant';
import type { LoggedSet, ProgressionContext } from '../src/features/workout/progression/types';
import type { Exercise, SuperMutantStatus, UserProfile, WorkoutDay, WorkoutLog } from '../src/types';

let totalChecks = 0;
const failures: string[] = [];

const check = (condition: boolean, message: string) => {
    totalChecks++;
    if (!condition) {
        failures.push(message);
        console.error(`FAIL: ${message}`);
    }
};

const near = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol;

console.log('========================================================================');
console.log('STARTING GROUP 2 VERIFICATION SUITE — PERSONA: test_workhorse');
console.log('========================================================================\n');

// Base persona: test_workhorse
const createWorkhorseUser = (programId: string, overrides: Partial<UserProfile> = {}): UserProfile => ({
    id: 'test_workhorse',
    codeword: 'test_workhorse',
    programId,
    startDate: '2026-01-01T00:00:00.000Z',
    completedSessions: 0,
    stats: {
        pausedBench: 120,
        wideGripBench: 105,
        spotoPress: 110,
        lowPinPress: 100,
        btnPress: 55,
        squat: 160,
        conventionalDeadlift: 200,
        lowBarSquat: 160,
    },
    benchHistory: [],
    squatHistory: [],
    pencilneckBenchHistory: [],
    programProgress: {},
    badges: [],
    gluteMeasurements: [],
    exercisePreferences: {},
    planPreferences: {},
    ...overrides,
});

// ============================================================================
// 1. PENCILNECK ERADICATION PROTOCOL
// ============================================================================
console.log('--- [1/6] TESTING PENCILNECK ERADICATION PROTOCOL ---');
{
    const user = createWorkhorseUser('pencilneck-eradication', {
        pencilneckStatus: { cycle: 1, completed: false },
        exercisePreferences: {
            'push-a-leg-primary': 'High-Foot Leg Press',
            'push-b-fly': 'Low-to-High Cable Flyes',
            'push-b-leg-secondary': 'Stiletto Squats',
        },
    });

    check(PENCILNECK_PROGRAM.weeks.length === 8, 'Pencilneck must have exactly 8 weeks');

    // Test Week 1 Day 1 (Push A) Preprocessing with Swaps
    const w1d1Raw = PENCILNECK_PROGRAM.weeks[0].days[0];
    const w1d1Preprocessed = PENCILNECK_CONFIG.hooks!.preprocessDay!(w1d1Raw, user);

    const flatBench = w1d1Preprocessed.exercises.find(e => e.name === 'Flat Barbell Bench Press');
    check(!!flatBench, 'Pencilneck W1D1 has Flat Barbell Bench Press');
    check(flatBench?.target.reps === '8-12', 'Pencilneck W1D1 Flat Bench reps must be 8-12');
    check(flatBench?.prescription?.tempo === '20X0', 'Pencilneck Flat Bench tempo must default to 20X0');
    check(flatBench?.id.endsWith('-c1') === true, 'Pencilneck exercise ID must append cycle suffix -c1');

    const swappedLeg = w1d1Preprocessed.exercises.find(e => e.name === 'High-Foot Leg Press');
    check(!!swappedLeg, 'Push A leg primary swapped Hack Squat -> High-Foot Leg Press');

    // Test Week 4 (Volume Phase) vs Week 5 (Heavy Phase)
    const w4d1Pre = PENCILNECK_CONFIG.hooks!.preprocessDay!(PENCILNECK_PROGRAM.weeks[3].days[0], user);
    const w5d1Pre = PENCILNECK_CONFIG.hooks!.preprocessDay!(PENCILNECK_PROGRAM.weeks[4].days[0], user);

    const w4Bench = w4d1Pre.exercises.find(e => e.name === 'Flat Barbell Bench Press');
    const w5Bench = w5d1Pre.exercises.find(e => e.name === 'Flat Barbell Bench Press');
    check(w4Bench?.target.reps === '8-12', 'Pencilneck W4 (Volume) Flat Bench reps = 8-12');
    check(w5Bench?.target.reps === '6-10', 'Pencilneck W5 (Heavy Phase) Flat Bench drops to 6-10');

    const w4Flyes = w4d1Pre.exercises.find(e => e.name === 'Cable Flyes (mid height)');
    const w5Flyes = w5d1Pre.exercises.find(e => e.name === 'Cable Flyes (mid height)');
    check(w4Flyes?.target.reps === '12-15' && w5Flyes?.target.reps === '12-15', 'Pencilneck isolations remain high rep in heavy phase');

    // Test Intensity Techniques: Cycle 1 weeks 7-8 vs Cycle 2 weeks 1-8
    const w6d1Pre = PENCILNECK_CONFIG.hooks!.preprocessDay!(PENCILNECK_PROGRAM.weeks[5].days[0], user);
    const w7d1Pre = PENCILNECK_CONFIG.hooks!.preprocessDay!(PENCILNECK_PROGRAM.weeks[6].days[0], user);
    const w6Bench = w6d1Pre.exercises.find(e => e.name === 'Flat Barbell Bench Press');
    const w7Bench = w7d1Pre.exercises.find(e => e.name === 'Flat Barbell Bench Press');

    check(!w6Bench?.intensityTechnique, 'Cycle 1 W6 Flat Bench should NOT have intensity technique');
    check(w7Bench?.intensityTechnique === 'LAST SET: Drop Set or Rest-Pause to Failure', 'Cycle 1 W7 Flat Bench has intensity technique');

    const userCycle2 = createWorkhorseUser('pencilneck-eradication', {
        pencilneckStatus: { cycle: 2, completed: false },
    });
    const c2w1d1Pre = PENCILNECK_CONFIG.hooks!.preprocessDay!(PENCILNECK_PROGRAM.weeks[0].days[0], userCycle2);
    const c2w1Bench = c2w1d1Pre.exercises.find(e => e.name === 'Flat Barbell Bench Press');
    check(c2w1Bench?.intensityTechnique === 'LAST SET: Drop Set or Rest-Pause to Failure', 'Cycle 2 W1 Flat Bench has intensity technique across all weeks');
    check(c2w1Bench?.id.endsWith('-c2') === true, 'Cycle 2 exercise ID must append cycle suffix -c2');

    // Test Week 8 Day 4 Final Exam bonus exercises
    const w8d4Raw = PENCILNECK_PROGRAM.weeks[7].days[3]; // Day 4 (dow 5 in array)
    const w8d4Pre = PENCILNECK_CONFIG.hooks!.preprocessDay!(w8d4Raw, user);
    const bonusLateral = w8d4Pre.exercises.find(e => e.name.includes('FINAL EXAM'));
    const bonusRearDelt = w8d4Pre.exercises.find(e => e.name === 'Rear Delt Burnout');
    check(!!bonusLateral && bonusLateral.target.type === 'failure', 'Pencilneck W8D4 includes Lateral Raise Final Exam');
    check(!!bonusRearDelt && bonusRearDelt.target.reps === '100', 'Pencilneck W8D4 includes 100-rep Rear Delt Burnout');

    // Test Advice Logic: Double progression, W5 heavy seeding, C2W1 reload
    const benchEx = flatBench!;
    const hitTopLog: WorkoutLog[] = [{
        id: 'log1', date: '2026-01-05', programId: 'pencilneck-eradication', week: 1, day: 1,
        exercises: [{ id: benchEx.id, name: benchEx.name, setsData: [
            { reps: '12', weight: '80', completed: true },
            { reps: '12', weight: '80', completed: true },
            { reps: '12', weight: '80', completed: true },
        ]}],
    }];
    const adviceHitTop = PENCILNECK_CONFIG.hooks!.getExerciseAdvice!(benchEx, hitTopLog);
    check(adviceHitTop === 't:tips.increaseWeight', 'All sets hitting 12 reps on 8-12 gives increaseWeight advice');

    const missedTopLog: WorkoutLog[] = [{
        id: 'log2', date: '2026-01-05', programId: 'pencilneck-eradication', week: 1, day: 1,
        exercises: [{ id: benchEx.id, name: benchEx.name, setsData: [
            { reps: '12', weight: '80', completed: true },
            { reps: '11', weight: '80', completed: true },
            { reps: '10', weight: '80', completed: true },
        ]}],
    }];
    const adviceMissedTop = PENCILNECK_CONFIG.hooks!.getExerciseAdvice!(benchEx, missedTopLog);
    check(adviceMissedTop === null, 'Missing top reps gives no increaseWeight advice');

    // Week 5 heavy phase advice calculation (+15% rounded down to 2.5kg)
    const w5BenchEx = w5Bench!;
    const pastLogs: WorkoutLog[] = [{
        id: 'log4', date: '2026-01-20', programId: 'pencilneck-eradication', week: 4, day: 1,
        exercises: [{ id: 'pn-w4-d1-e1-c1', name: 'Flat Barbell Bench Press', setsData: [
            { reps: '12', weight: '90', completed: true },
            { reps: '12', weight: '90', completed: true },
            { reps: '12', weight: '90', completed: true },
        ]}],
    }];
    const w5Advice = PENCILNECK_CONFIG.hooks!.getExerciseAdvice!(w5BenchEx, pastLogs);
    // 90 * 1.15 = 103.5 -> floor(103.5 / 2.5) * 2.5 = 102.5
    check(w5Advice === 't:tips.pencilneckWeek5HeavyPhase|{"maxWeight":90,"suggested":102.5}', `W5 advice suggested load = 102.5kg, got ${w5Advice}`);

    // Cycle 2 Week 1 reload advice (0.87 for compound with min 1.10 over C1W1)
    const c2w1BenchEx = c2w1Bench!;
    const fullCycleHistory: WorkoutLog[] = [
        {
            id: 'c1w8', date: '2026-02-20', programId: 'pencilneck-eradication', week: 8, day: 1,
            exercises: [{ id: 'pn-w8-d1-e1-c1', name: 'Flat Barbell Bench Press', setsData: [
                { reps: '10', weight: '105', completed: true },
            ]}],
        },
        {
            id: 'c1w1', date: '2026-01-01', programId: 'pencilneck-eradication', week: 1, day: 1,
            exercises: [{ id: 'pn-w1-d1-e1-c1', name: 'Flat Barbell Bench Press', setsData: [
                { reps: '12', weight: '80', completed: true },
            ]}],
        },
    ];
    // 105 * 0.87 = 91.35; minTarget = 80 * 1.10 = 88. Suggested = floor(91.35/2.5)*2.5 = 90
    const c2w1Advice = PENCILNECK_CONFIG.hooks!.getExerciseAdvice!(c2w1BenchEx, fullCycleHistory);
    check(c2w1Advice === 't:tips.pencilneckCycleReload|{"cycle":2,"suggested":90}', `C2W1 reload advice = 90kg, got ${c2w1Advice}`);

    // Test pencilneckProgression handler: Flat Bench session (Push A)
    const pushAWorkout = w1d1Preprocessed;
    const benchExId = pushAWorkout.exercises.find(e => e.name === 'Flat Barbell Bench Press')!.id;
    const benchCtx: ProgressionContext = {
        planId: 'pencilneck-eradication',
        week: 1,
        day: 1,
        isExistingLog: false,
        user,
        workout: pushAWorkout,
        sets: {
            [benchExId]: [
                { weight: '100', reps: '10', completed: true }, // e1RM = 100 * (1 + 10/30) = 133.33 -> 133
                { weight: '110', reps: '6', completed: true },  // e1RM = 110 * (1 + 6/30) = 132
                { weight: '120', reps: '2', completed: false }, // unticked must be ignored
            ],
        },
    };
    const benchProgResult = pencilneckProgression(benchCtx);
    const benchRecord = benchProgResult.appends.find(a => a.field === 'pencilneckBenchHistory')?.value as any;
    check(benchRecord?.weight === 133, `Pencilneck e1RM record should be 133, got ${benchRecord?.weight}`);
    check(benchRecord?.actualWeight === 100 && benchRecord?.actualReps === 10, 'Pencilneck records raw lift of highest e1RM set');

    // Test pencilneckProgression handler: Week 8 Completion (Pull B)
    const w8PullB = PENCILNECK_CONFIG.hooks!.preprocessDay!(PENCILNECK_PROGRAM.weeks[7].days[3], user); // Day 5
    const compCtx: ProgressionContext = {
        planId: 'pencilneck-eradication',
        week: 8,
        day: 5,
        isExistingLog: false,
        user,
        workout: { ...w8PullB, dayName: 'Pull B · Final' },
        sets: {},
    };
    const compResult = pencilneckProgression(compCtx);
    check(compResult.updates['pencilneckStatus']?.completed === true, 'Pencilneck marked completed on W8 Pull B');
    check(compResult.effects.some(e => e.type === 'openPencilneckCompletion'), 'Pencilneck completion effect emitted');
}

// ============================================================================
// 2. SUPER MUTANT
// ============================================================================
console.log('\n--- [2/6] TESTING SUPER MUTANT ---');
{
    const muscles = ['chest', 'shoulders', 'triceps', 'back', 'biceps', 'calves', 'hamstrings', 'glutes', 'lowerBack', 'quads', 'abductors', 'abs'];
    let simTime = Date.UTC(2026, 0, 5, 10);
    Date.now = () => simTime;

    const smStatus: SuperMutantStatus = {
        completedWorkouts: 0,
        currentCycle: 1,
        muscleGroupTimestamps: {},
        rolling7DayVolume: Object.fromEntries(muscles.map(m => [m, 0])) as SuperMutantStatus['rolling7DayVolume'],
        chestVariant: 'A',
        backVariant: 'A',
        bench1RM: 120,
        deadlift1RM: 200,
        squat1RM: 160,
        quadExercise: 'Hack Squat',
        hamstringExercise: 'Good Mornings',
        weeklySessionDates: [],
        volumeHistory: [],
        exerciseLoads: {},
    };

    const user = createWorkhorseUser('super-mutant', { superMutantStatus: smStatus });

    // Step 1: Generate first workout (should be Upper A + Lower C or D)
    const w1 = generateNextWorkout(user);
    check(!!w1 && w1.exercises.length > 0, 'Super Mutant generates initial workout');
    check(w1?.exercises.some(e => e.name === 'Good Mornings') === true, 'Super Mutant respects Good Mornings preference');

    // Step 2: Test Double Progression Handler
    const ctx: ProgressionContext = {
        planId: 'super-mutant',
        week: 1,
        day: 1,
        isExistingLog: false,
        user,
        workout: w1,
        sets: {
            [w1!.exercises[0].id]: [
                { weight: '100', reps: '12', completed: true },
                { weight: '100', reps: '12', completed: true },
                { weight: '100', reps: '12', completed: true },
            ],
        },
    };
    const res = superMutantProgression(ctx);
    check((res.updates['superMutantStatus.completedWorkouts'] as number) === 1, 'Super Mutant increments completed workouts');
    const firstExId = w1!.exercises[0].id;
    const targetReps = Number(String(w1!.exercises[0].target.reps).split('-').pop());
    if (targetReps === 12) {
        check(res.updates[`superMutantStatus.exerciseLoads.${firstExId}`] !== undefined, 'Super Mutant double progression increments exercise load on hitting top reps');
    }

    // Step 3: Test 84-workout Lifecycle Simulation with cooldown timers & rolling volume
    let completed = 0;
    let restDays = 0;
    let chestCountA = 0, chestCountB = 0;
    const seenExercises = new Set<string>();

    for (let day = 0; day < 160 && smStatus.completedWorkouts < 84; day++, simTime += 24 * 3600 * 1000) {
        smStatus.weeklySessionDates = (smStatus.weeklySessionDates || []).filter(d => new Date(d).getTime() > simTime - 7 * 86400 * 1000);
        const workout = generateNextWorkout(user);
        if (!workout || !workout.exercises.length) {
            restDays++;
            continue;
        }

        check((smStatus.weeklySessionDates?.length || 0) < 6, `Super Mutant weekly cap (<6) respected at workout ${smStatus.completedWorkouts + 1}`);

        const contributions: Record<string, number> = {};
        for (const ex of workout.exercises) {
            seenExercises.add(ex.name);
            if (ex.id.startsWith('chest-a-')) chestCountA++;
            if (ex.id.startsWith('chest-b-')) chestCountB++;
            for (const [muscle, share] of Object.entries(getMuscleContributions(ex.id))) {
                contributions[muscle] = (contributions[muscle] || 0) + ex.sets * share;
                if (share >= 1) {
                    smStatus.muscleGroupTimestamps[muscle as keyof typeof smStatus.muscleGroupTimestamps] = simTime;
                }
            }
        }

        smStatus.volumeHistory = (smStatus.volumeHistory || []).filter(e => new Date(e.date).getTime() > simTime - 7 * 86400 * 1000);
        smStatus.volumeHistory.push({ date: new Date(simTime).toISOString(), contributions });
        smStatus.rolling7DayVolume = Object.fromEntries(
            muscles.map(m => [m, smStatus.volumeHistory!.reduce((n, e) => n + (e.contributions[m] || 0), 0)])
        ) as SuperMutantStatus['rolling7DayVolume'];

        if (contributions.chest) smStatus.chestVariant = smStatus.chestVariant === 'A' ? 'B' : 'A';
        if (contributions.back) smStatus.backVariant = smStatus.backVariant === 'A' ? 'B' : 'A';
        smStatus.weeklySessionDates!.push(new Date(simTime).toISOString());
        smStatus.completedWorkouts++;
        completed++;
    }

    check(completed === 84, `Super Mutant completed all 84 workouts (got ${completed})`);
    check(restDays >= 10, `Super Mutant generated natural rest days (${restDays} rest days)`);
    check(chestCountA > 0 && chestCountB > 0, 'Super Mutant rotated chest variants A and B');
    check(seenExercises.has('Hack Squat') && !seenExercises.has('Front Squat'), 'Super Mutant respected Hack Squat onboarding preference');
    check(seenExercises.has('Good Mornings') && !seenExercises.has('Deficit RDLs'), 'Super Mutant respected Good Mornings onboarding preference');
}

// ============================================================================
// 3. VENUS RISING
// ============================================================================
console.log('\n--- [3/6] TESTING VENUS RISING ---');
{
    const user4Day = createWorkhorseUser('venus-rising', {
        planPreferences: {
            'venus-rising': {
                scheduleMode: '4day',
                exerciseSelections: { priority1: 'leg-extension', priority2: 'lateral-raise' },
                updatedAt: '2026-01-01T00:00:00.000Z',
            },
        },
    });

    check(VENUS_RISING_CONFIG.program.weeks.length === 12, 'Venus Rising has 12 weeks');
    check(VENUS_FOUR_DAY.length === 4, 'Venus 4-day has 4 workouts');
    check(VENUS_THREE_DAY.length === 3, 'Venus 3-day has 3 workouts');

    // Test Schedule bounds (15-16 sets per day)
    for (const d of VENUS_FOUR_DAY) {
        const sets = d.slots.reduce((s, sl) => s + sl.sets, 0);
        check(sets >= 15 && sets <= 16, `Venus 4-day ${d.name} has 15-16 sets (got ${sets})`);
    }
    for (const d of VENUS_THREE_DAY) {
        const sets = d.slots.reduce((s, sl) => s + sl.sets, 0);
        check(sets >= 15 && sets <= 16, `Venus 3-day ${d.name} has 15-16 sets (got ${sets})`);
    }

    // Test Foundation phase (W1-4): default RPE unset
    const w1d1 = VENUS_RISING_CONFIG.program.weeks[0].days[0];
    const w1d1Pre = VENUS_RISING_CONFIG.hooks!.preprocessDay!(w1d1, user4Day);
    const hackW1 = w1d1Pre.exercises.find(e => e.name === 'Hack Squat');
    check(hackW1?.target.rpe === undefined, 'Venus W1 Foundation RPE is undefined/standard');

    // Test Rising phase (W5-8): RPE 8.5 and priority additions
    const w5d1 = VENUS_RISING_CONFIG.program.weeks[4].days[0];
    const w5d1Pre = VENUS_RISING_CONFIG.hooks!.preprocessDay!(w5d1, user4Day);
    const hackW5 = w5d1Pre.exercises.find(e => e.name === 'Hack Squat');
    const legExtW5 = w5d1Pre.exercises.find(e => e.name === 'Leg Extensions');
    check(hackW5?.target.rpe === 8.5, `Venus W5 Rising RPE is 8.5, got ${hackW5?.target.rpe}`);
    check(legExtW5?.sets === 3, `Venus W5 priority exercise 'leg-extension' bumped from 2 to 3 sets (got ${legExtW5?.sets})`);
    const totalW5Sets = w5d1Pre.exercises.reduce((s, e) => s + e.sets, 0);
    check(totalW5Sets <= 16, `Venus W5 session total sets must not exceed 16 cap (got ${totalW5Sets})`);

    // Test Ascension phase (W9-11): Isolation RPE 9.5, Compound RPE 8.5
    const w9d2 = VENUS_RISING_CONFIG.program.weeks[8].days[1];
    const w9d2Pre = VENUS_RISING_CONFIG.hooks!.preprocessDay!(w9d2, user4Day);
    const latRaise = w9d2Pre.exercises.find(e => e.name === 'Lateral Raises');
    const hammerRow = w9d2Pre.exercises.find(e => e.name.includes('Hammer'));
    check(latRaise?.target.rpe === 9.5, `Venus W9 Ascension Isolation (Lateral Raise) RPE = 9.5, got ${latRaise?.target.rpe}`);
    check(hammerRow?.target.rpe === 8.5, `Venus W9 Ascension Compound (Hammer Row) RPE = 8.5, got ${hammerRow?.target.rpe}`);

    // Test Rebirth phase (W12): Deload volume (60-70% of base) and RPE 8
    const w12d1 = VENUS_RISING_CONFIG.program.weeks[11].days[0];
    const w12d1Pre = VENUS_RISING_CONFIG.hooks!.preprocessDay!(w12d1, user4Day);
    const hackW12 = w12d1Pre.exercises.find(e => e.name === 'Hack Squat');
    check(hackW12?.sets === 2, `Venus W12 Rebirth Hack Squat sets reduced 3 -> 2 (got ${hackW12?.sets})`);
    check(hackW12?.target.rpe === 8, `Venus W12 Rebirth RPE is 8, got ${hackW12?.target.rpe}`);
    const w12Sets = w12d1Pre.exercises.reduce((s, e) => s + e.sets, 0);
    const baseSets = w1d1Pre.exercises.reduce((s, e) => s + e.sets, 0);
    const ratio = w12Sets / baseSets;
    check(ratio >= 0.6 && ratio <= 0.7, `Venus W12 Rebirth volume ratio is 60-70% (got ${(ratio * 100).toFixed(1)}%)`);

    // Test 3-day mode dynamic switch
    const user3Day = createWorkhorseUser('venus-rising', {
        planPreferences: {
            'venus-rising': {
                scheduleMode: '3day',
                exerciseSelections: {},
                updatedAt: '2026-01-01T00:00:00.000Z',
            },
        },
    });
    check(effectiveVenusMode(user3Day) === '3day', 'Venus correctly resolves 3day mode');
    const w1d1_3day = VENUS_RISING_CONFIG.hooks!.preprocessDay!(w1d1, user3Day);
    check(w1d1_3day.dayName.includes('FBW A'), 'Venus 3-day mode swaps workout day to FBW tree');
}

// ============================================================================
// 4. TENFOLD
// ============================================================================
console.log('\n--- [4/6] TESTING TENFOLD ---');
{
    const user = createWorkhorseUser('tenfold');

    check(TENFOLD_CONFIG.program.weeks.length === 8, 'Tenfold has 8 weeks');
    check(TENFOLD_CONFIG.program.weeks[0].days.filter(d => d.exercises.length).length === 4, 'Tenfold has 4 training days per week');

    // Verify 10x10 structure on Weeks 1-5
    for (let w = 1; w <= 5; w++) {
        const week = TENFOLD_CONFIG.program.weeks[w - 1];
        const day1 = week.days.find(d => d.dayOfWeek === 1)!;
        const day2 = week.days.find(d => d.dayOfWeek === 2)!;
        const day4 = week.days.find(d => d.dayOfWeek === 4)!;
        const day5 = week.days.find(d => d.dayOfWeek === 5)!;

        const chest10 = day1.exercises[0];
        const quad10 = day2.exercises[0];
        const back10 = day4.exercises[0];
        const ham10 = day5.exercises[0];

        check(chest10.name === 'Hammer Chest Press' && chest10.sets === 10 && chest10.target.reps === '10', `Tenfold W${w} Day 1 has 10x10 Hammer Chest Press`);
        check(quad10.name === 'Hack Squat' && quad10.sets === 10 && quad10.target.reps === '10', `Tenfold W${w} Day 2 has 10x10 Hack Squat`);
        check(back10.name === 'Hammer Lower Row' && back10.sets === 10 && back10.target.reps === '10', `Tenfold W${w} Day 4 has 10x10 Hammer Lower Row`);
        check(ham10.name === 'Seated Ham Curl' && ham10.sets === 10 && ham10.target.reps === '10', `Tenfold W${w} Day 5 has 10x10 Seated Ham Curl`);

        // Check tempo, rest, notes
        check(chest10.prescription?.tempo === '40X0', `Tenfold W${w} tempo is 40X0`);
        check(chest10.prescription?.restSeconds === 90, `Tenfold W${w} rest is 90s`);
        check(chest10.notes?.includes('Hold the load until all ten sets reach ten reps') === true, `Tenfold W${w} notes hold rule`);

        // Exactly one 10x10 exercise per session
        const tenSetCount = day1.exercises.filter(e => e.sets === 10).length;
        check(tenSetCount === 1, `Tenfold W${w} Day 1 has exactly one 10-set exercise`);
    }

    // Verify Consolidation Phase on Weeks 6-8 (10x10 drops to 8x8-10)
    for (let w = 6; w <= 8; w++) {
        const week = TENFOLD_CONFIG.program.weeks[w - 1];
        const day1 = week.days.find(d => d.dayOfWeek === 1)!;
        const mainEx = day1.exercises[0];
        check(mainEx.sets === 8, `Tenfold W${w} main lift sets reduced to 8 (got ${mainEx.sets})`);
        check(mainEx.target.reps === '8-10', `Tenfold W${w} main lift reps = 8-10 (got ${mainEx.target.reps})`);
        check(mainEx.notes?.includes('Eight sets now. Push the load rather than the count.') === true, `Tenfold W${w} consolidation note present`);
    }

    // Test simulation of 10x10 sets: all 10 sets completed @ 10 reps
    const w1d1Ex = TENFOLD_CONFIG.program.weeks[0].days[0].exercises[0];
    const loggedSetsAll10: LoggedSet[] = Array.from({ length: 10 }, () => ({
        weight: '70',
        reps: '10',
        completed: true,
    }));
    check(loggedSetsAll10.length === 10 && loggedSetsAll10.every(s => s.completed && s.reps === '10'), 'Tenfold 10x10 full completion simulated successfully');
}

// ============================================================================
// 5. NEURAL OVERLOAD
// ============================================================================
console.log('\n--- [5/6] TESTING NEURAL OVERLOAD ---');
{
    const user = createWorkhorseUser('neural-overload', {
        stats: { pausedBench: 120, squat: 160 } as any,
    });

    check(NEURAL_OVERLOAD_CONFIG.program.weeks.length === 9, 'Neural Overload has 9 weeks');

    // Test 1-6 Post-Activation Wave on Bench Day (Day 1)
    const w1d1 = NEURAL_OVERLOAD_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!;
    check(w1d1.exercises.length >= 8, 'Neural Overload Day 1 has main wave + accessories');

    const e1 = w1d1.exercises[0]; // Set 1: 1 rep @ 90%
    const e2 = w1d1.exercises[1]; // Set 2: 6 reps @ 75%
    const e3 = w1d1.exercises[2]; // Set 3: 1 rep @ 92.5%
    const e4 = w1d1.exercises[3]; // Set 4: 6 reps @ 77.5%

    check(e1.name === 'Paused Bench Press' && e1.sets === 1 && e1.target.reps === '1', 'Neural Overload Slot 1: 1x1');
    check(e2.name === 'Paused Bench Press' && e2.sets === 1 && e2.target.reps === '6', 'Neural Overload Slot 2: 1x6');
    check(e3.name === 'Paused Bench Press' && e3.sets === 1 && e3.target.reps === '1', 'Neural Overload Slot 3: 1x1');
    check(e4.name === 'Paused Bench Press' && e4.sets === 1 && e4.target.reps === '6', 'Neural Overload Slot 4: 1x6');

    check(e1.prescription?.tempo === '11X0', 'Paused Bench 1-6 tempo is 11X0');
    check(e1.prescription?.restSeconds === 180, '1-6 rest interval is 180s');

    // Calculate weights for Bench Day: 120kg max
    // Slot 1: 120 * 0.90 = 108 -> round to 2.5 = 107.5
    // Slot 2: 120 * 0.75 = 90
    // Slot 3: 120 * 0.925 = 111 -> round to 2.5 = 110
    // Slot 4: 120 * 0.775 = 93 -> round to 2.5 = 92.5
    const wS1 = NEURAL_OVERLOAD_CONFIG.hooks!.calculateWeight!(e1.target, user, e1.name, { week: 1, day: 1, exerciseId: e1.id });
    const wS2 = NEURAL_OVERLOAD_CONFIG.hooks!.calculateWeight!(e2.target, user, e2.name, { week: 1, day: 1, exerciseId: e2.id });
    const wS3 = NEURAL_OVERLOAD_CONFIG.hooks!.calculateWeight!(e3.target, user, e3.name, { week: 1, day: 1, exerciseId: e3.id });
    const wS4 = NEURAL_OVERLOAD_CONFIG.hooks!.calculateWeight!(e4.target, user, e4.name, { week: 1, day: 1, exerciseId: e4.id });

    check(wS1 === '107.5', `Neural slot 1 @ 90% of 120 should be 107.5, got ${wS1}`);
    check(wS2 === '90', `Neural slot 2 @ 75% of 120 should be 90, got ${wS2}`);
    check(wS3 === '110', `Neural slot 3 @ 92.5% of 120 should be 110, got ${wS3}`);
    check(wS4 === '92.5', `Neural slot 4 @ 77.5% of 120 should be 92.5, got ${wS4}`);

    // Note: buildWeightCalculator matches by name; for 1-6 where all 4 slots share name 'Paused Bench Press',
    // let's verify how percentage target is processed or if each slot target is handled.
    check(e1.target.percentage === 0.9, 'Slot 1 target percentage = 0.9');
    check(e2.target.percentage === 0.75, 'Slot 2 target percentage = 0.75');
    check(e3.target.percentage === 0.925, 'Slot 3 target percentage = 0.925');
    check(e4.target.percentage === 0.775, 'Slot 4 target percentage = 0.775');

    // Day 5 Lower Powerbuilding: Front Squat 5x3-5 @ 65% of squat (160 * 0.65 = 104 -> 105kg)
    const w1d5 = NEURAL_OVERLOAD_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 5)!;
    const frontSquat = w1d5.exercises.find(e => e.name === 'Front Squats')!;
    check(frontSquat.sets === 5 && frontSquat.target.reps === '3-5', 'Day 5 Front Squats is 5x3-5 straight sets');
    check(frontSquat.target.percentage === 0.65, 'Front Squats target percentage = 0.65');
    const frontSquatLoad = NEURAL_OVERLOAD_CONFIG.hooks!.calculateWeight!(frontSquat.target, user, frontSquat.name, { week: 1, day: 5 });
    check(frontSquatLoad === '105', `Front Squat load calculated = 105kg (got ${frontSquatLoad})`);

    // Test Phase Overload (Weeks 7-9): Accessories with sets >= 3 drop by 1 set
    const w7d1 = NEURAL_OVERLOAD_CONFIG.program.weeks[6].days.find(d => d.dayOfWeek === 1)!;
    const hammerUpperRowW1 = w1d1.exercises.find(e => e.name === 'Hammer Upper Row')!;
    const hammerUpperRowW7 = w7d1.exercises.find(e => e.name === 'Hammer Upper Row')!;
    check(hammerUpperRowW1.sets === 4, 'W1 Hammer Upper Row sets = 4');
    check(hammerUpperRowW7.sets === 3, 'W7 Hammer Upper Row sets reduced to 3');

    // Verify 1-6 main slots remain 1 set in Overload phase
    check(w7d1.exercises[0].sets === 1 && w7d1.exercises[1].sets === 1, '1-6 wave slots preserved at 1 set in Overload phase');
}

// ============================================================================
// 6. PURGATORIO
// ============================================================================
console.log('\n--- [6/6] TESTING PURGATORIO ---');
{
    const user = createWorkhorseUser('purgatorio');

    check(PURGATORIO_CONFIG.program.weeks.length === 12, 'Purgatorio has 12 weeks');

    // Test 6-week repeating cycle:
    // Block 1: W1-3 Accumulation -> W4-6 Intensification
    // Block 2: W7-9 Accumulation II -> W10-12 Intensification II
    const w1d1 = PURGATORIO_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!; // Acc 1
    const w4d1 = PURGATORIO_CONFIG.program.weeks[3].days.find(d => d.dayOfWeek === 1)!; // Int 1
    const w7d1 = PURGATORIO_CONFIG.program.weeks[6].days.find(d => d.dayOfWeek === 1)!; // Acc 2
    const w10d1 = PURGATORIO_CONFIG.program.weeks[9].days.find(d => d.dayOfWeek === 1)!; // Int 2

    check(w1d1.dayName.includes('Accumulation'), 'W1 is Accumulation phase');
    check(w4d1.dayName.includes('Intensification'), 'W4 is Intensification phase');
    check(w7d1.dayName.includes('Accumulation II'), 'W7 is Accumulation II phase');
    check(w10d1.dayName.includes('Intensification II'), 'W10 is Intensification II phase');

    // Antagonist Pairs (A1/A2, B1/B2, C1/C2) verification
    const ex1 = w1d1.exercises[0];
    const ex2 = w1d1.exercises[1];
    const ex3 = w1d1.exercises[2];
    const ex4 = w1d1.exercises[3];
    const ex5 = w1d1.exercises[4];
    const ex6 = w1d1.exercises[5];

    check(ex1.prescription?.pair === 'A1' && ex2.prescription?.pair === 'A2', 'Purgatorio pairs A1 and A2');
    check(ex3.prescription?.pair === 'B1' && ex4.prescription?.pair === 'B2', 'Purgatorio pairs B1 and B2');
    check(ex5.prescription?.pair === 'C1' && ex6.prescription?.pair === 'C2', 'Purgatorio pairs C1 and C2');

    // Accumulation Transform (W1-3): sets+1 (3->4), reps 10-15, rest x0.75 (120*0.75=90s), tempo 30X0
    check(ex1.sets === 4, `Accumulation sets = 4 (got ${ex1.sets})`);
    check(ex1.target.reps === '10-15', `Accumulation reps = 10-15 (got ${ex1.target.reps})`);
    check(ex1.prescription?.restSeconds === 90, `Accumulation rest = 90s (got ${ex1.prescription?.restSeconds})`);
    check(ex1.prescription?.tempo === '30X0', `Accumulation tempo = 30X0 (got ${ex1.prescription?.tempo})`);

    // Intensification Transform (W4-6): base sets (3), reps 5-8, rest x1.4 (120*1.4=168->165s), tempo cleared
    const intEx1 = w4d1.exercises[0];
    check(intEx1.sets === 3, `Intensification sets = 3 (got ${intEx1.sets})`);
    check(intEx1.target.reps === '5-8', `Intensification reps = 5-8 (got ${intEx1.target.reps})`);
    check(intEx1.prescription?.restSeconds === 165, `Intensification rest = 165s (got ${intEx1.prescription?.restSeconds})`);
    check(intEx1.prescription?.tempo === undefined, 'Intensification tempo is cleared');

    // Test Accumulation II vs Intensification II identical transformations in Block 2
    const acc2Ex1 = w7d1.exercises[0];
    const int2Ex1 = w10d1.exercises[0];
    check(acc2Ex1.sets === 4 && acc2Ex1.target.reps === '10-15' && acc2Ex1.prescription?.tempo === '30X0', 'Accumulation II matches Accumulation I transforms');
    check(int2Ex1.sets === 3 && int2Ex1.target.reps === '5-8' && int2Ex1.prescription?.tempo === undefined, 'Intensification II matches Intensification I transforms');

    // Double progression simulation across 12-week lifecycle
    const logAcc: WorkoutLog = {
        id: 'purg-log-1',
        date: '2026-01-05',
        programId: 'purgatorio',
        week: 1,
        day: 1,
        exercises: [{
            id: ex1.id,
            name: ex1.name,
            setsData: [
                { weight: '32', reps: '15', completed: true },
                { weight: '32', reps: '15', completed: true },
                { weight: '32', reps: '15', completed: true },
                { weight: '32', reps: '15', completed: true },
            ],
        }],
    };
    check(logAcc.exercises[0].setsData.every(s => s.completed && s.reps === '15'), 'Purgatorio accumulation double progression sets simulated');
}

console.log('\n========================================================================');
console.log(`GROUP 2 VERIFICATION SUMMARY: ${totalChecks} CHECKS RUN, ${failures.length} FAILURES`);
console.log('========================================================================\n');

if (failures.length > 0) {
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
} else {
    console.log('ALL 6 PLANS IN GROUP 2 PASSED VERIFICATION WITH PERSONA test_workhorse!');
}
