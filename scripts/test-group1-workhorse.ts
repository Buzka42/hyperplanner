/**
 * Comprehensive Test Suite for Group 1: Strength & Powerlifting Specialization
 * Test Account Persona: 'test_workhorse'
 * 
 * Plans Tested:
 * 1. Bench Domination (`bench-domination`)
 * 2. King of the Squat (`king-of-the-squat`)
 * 3. Pain & Glory (`pain-and-glory`)
 * 4. Trinary (`trinary`)
 * 5. Ritual of Strength (`ritual-of-strength`)
 * 6. Athena (`athena`)
 */

import assert from 'node:assert/strict';
import { BENCH_DOMINATION_CONFIG } from '../src/data/program';
import { KING_OF_THE_SQUAT_CONFIG } from '../src/data/plans/kingOfTheSquat';
import { PAIN_GLORY_CONFIG } from '../src/data/painglory';
import { TRINARY_CONFIG, getBlockFromWorkout } from '../src/data/trinary';
import { RITUAL_CONFIG } from '../src/data/ritual';
import { ATHENA_CONFIG, ATHENA_FOUR_DAY, ATHENA_THREE_DAY, effectiveAthenaMode } from '../src/data/plans/athena';

import { benchDominationProgression } from '../src/features/workout/progression/benchDomination';
import { painGloryProgression } from '../src/features/workout/progression/painGlory';
import { trinaryProgression } from '../src/features/workout/progression/trinary';
import { ritualProgression } from '../src/features/workout/progression/ritual';
import { athenaProgression } from '../src/features/workout/progression/athena';
import { deriveBackoffLoad, topSetCanProgress } from '../src/features/workout/engines/topSetBackoff';
import { requiredStatsFor, calibrationExercisesFor } from '../src/data/planBuilder';

import type { UserProfile, WorkoutDay, Exercise, WorkoutLog } from '../src/types';
import type { LoggedSet, ProgressionContext } from '../src/features/workout/progression/types';

let totalChecks = 0;
const failures: string[] = [];

const check = (condition: boolean, description: string) => {
    totalChecks++;
    if (!condition) {
        failures.push(description);
        console.error(`  FAIL: ${description}`);
    }
};

const makeWorkhorse = (programId: string): UserProfile => ({
    id: 'test_workhorse',
    codeword: 'workhorse',
    name: 'Test Workhorse',
    email: 'workhorse@test.com',
    programId,
    startDate: '2026-01-01T00:00:00.000Z',
    completedSessions: 0,
    stats: {
        pausedBench: 140,
        wideGripBench: 125,
        spotoPress: 130,
        lowPinPress: 125,
        btnPress: 60,
        squat: 180,
        lowBarSquat: 180,
        conventionalDeadlift: 220,
        benchPress: 140,
        deadlift: 220,
        overheadPress: 80,
        wideGripConsecutive: 0,
    },
    benchHistory: [],
    squatHistory: [],
    programProgress: {},
    badges: [],
    gluteMeasurements: [],
    pencilneckBenchHistory: [],
    benchDominationModules: {
        tricepGiantSet: true,
        behindNeckPress: true,
        weightedPullups: true,
        accessories: true,
        legDays: true,
        thursdayTricepVariant: 'giant-set',
        lowPinPressExtraSet: false,
    },
    benchDominationStatus: {
        completedWeeks: 0,
        addedDeloadWeeks: [],
        forcedDeloadCompleted: false,
    },
    painGloryStatus: {
        deficitSnatchGripWeight: 100,
        squatProgress: 0,
        e2momWeightAdjustment: 0,
    },
    trinaryStatus: {
        completedWorkouts: 0,
        currentBlock: 1,
        bench1RM: 140,
        deadlift1RM: 220,
        squat1RM: 180,
        benchVariation: 'Paused Bench Press',
        deadliftVariation: 'Deficit Deadlift',
        squatVariation: 'Pause Squat',
        workoutLog: [],
        cycleNumber: 1,
        isDeload: false,
        meRepMaxStyle: '3rm',
        reDeadliftVariant: 'Romanian Deadlift',
        reProgressionPending: [],
        deProgressionPending: [],
    },
    ritualStatus: {
        completedWorkouts: 0,
        currentWeek: 1,
        isFirstProgram: true,
        rampInComplete: false,
        benchPress1RM: 140,
        deadlift1RM: 220,
        squat1RM: 180,
        benchMEProgression: 0,
        deadliftMEProgression: 0,
        squatMEProgression: 0,
        lightWorkReductionPending: {},
    },
    athenaStatus: {
        exerciseLoads: {},
    },
    planPreferences: {
        athena: {
            scheduleMode: '4day',
            exerciseSelections: {},
            updatedAt: '2026-01-01T00:00:00.000Z',
        },
    },
});

const makeSet = (weight: string, reps: string, completed = true, extra?: Partial<LoggedSet>): LoggedSet => ({
    weight,
    reps,
    completed,
    ...extra,
});

console.log('========================================================================');
console.log('STARTING GROUP 1 VERIFICATION FOR PERSONA: test_workhorse');
console.log('========================================================================\n');

// ============================================================================
// 1. BENCH DOMINATION
// ============================================================================
console.log('>>> [1/6] Testing Plan: Bench Domination (bench-domination)...');
{
    const user = makeWorkhorse('bench-domination');
    const config = BENCH_DOMINATION_CONFIG;

    // A. Lifecycle & Weeks
    check(config.program.weeks.length === 16, 'Bench Domination program has 16 weeks (15 core + 1 inserted deload)');
    
    // B. PreprocessDay & Module Toggles
    const w1d1 = config.program.weeks[0].days.find(d => d.dayOfWeek === 1)!;
    const preprocessedFull = config.hooks?.preprocessDay ? config.hooks.preprocessDay(structuredClone(w1d1), user) : w1d1;
    check(preprocessedFull.exercises.some(e => e.name === 'Tricep Giant Set'), 'Tricep Giant Set present when module enabled');
    check(preprocessedFull.exercises.some(e => e.name === 'Behind-the-Neck Press'), 'BTN Press present when module enabled');
    check(preprocessedFull.exercises.some(e => e.name === 'Dragon Flags'), 'Dragon Flags present when accessories module enabled');

    // Test disabling modules
    const userNoMods = structuredClone(user);
    userNoMods.benchDominationModules = {
        tricepGiantSet: false,
        behindNeckPress: false,
        weightedPullups: false,
        accessories: false,
        legDays: false,
    };
    const preprocessedNoMods = config.hooks?.preprocessDay ? config.hooks.preprocessDay(structuredClone(w1d1), userNoMods) : w1d1;
    check(!preprocessedNoMods.exercises.some(e => e.name === 'Tricep Giant Set'), 'Tricep Giant Set removed when disabled');
    check(!preprocessedNoMods.exercises.some(e => e.name === 'Behind-the-Neck Press'), 'BTN Press removed when disabled');
    check(!preprocessedNoMods.exercises.some(e => e.name === 'Dragon Flags'), 'Dragon Flags removed when accessories disabled');

    // Leg day module toggle (Day 2)
    const w1d2 = config.program.weeks[0].days.find(d => d.dayOfWeek === 2)!;
    const preprocessedLegsDisabled = config.hooks?.preprocessDay ? config.hooks.preprocessDay(structuredClone(w1d2), userNoMods) : w1d2;
    check(preprocessedLegsDisabled.exercises.length === 0, 'Leg day is empty when legDays module is disabled');

    // Thursday heavy extensions variant
    const w1d4 = config.program.weeks[0].days.find(d => d.dayOfWeek === 4)!;
    const userHeavyTri = structuredClone(user);
    userHeavyTri.benchDominationModules!.thursdayTricepVariant = 'heavy-extensions';
    const preprocessedHeavyTri = config.hooks?.preprocessDay ? config.hooks.preprocessDay(structuredClone(w1d4), userHeavyTri) : w1d4;
    check(preprocessedHeavyTri.exercises.some(e => e.name === 'Heavy Rolling Tricep Extensions'), 'Heavy Rolling Tricep Extensions substituted when variant selected');

    // C. Weight Calculation Logic
    const calcWeight = config.hooks?.calculateWeight!;
    check(calcWeight !== undefined, 'calculateWeight hook exists');

    // Monday Heavy (82.5% of 140 = 115.5 -> nearest 2.5kg with cap = 115)
    const monBenchEx = w1d1.exercises.find(e => e.name === 'Paused Bench Press')!;
    const monLoad = calcWeight(monBenchEx.target, user, 'Paused Bench Press', { week: 1, day: 1 });
    check(monLoad === '115', `Monday W1 heavy bench load expected 115, got ${monLoad}`);

    // Wednesday Volume (72.5% of 140 = 101.5 -> ceil 2.5kg = 102.5)
    const w1d3 = config.program.weeks[0].days.find(d => d.dayOfWeek === 3)!;
    const wedBenchEx = w1d3.exercises.find(e => e.name === 'Paused Bench Press')!;
    const wedLoad = calcWeight(wedBenchEx.target, user, 'Paused Bench Press', { week: 1, day: 3 });
    check(wedLoad === '102.5', `Wednesday W1 volume bench load expected 102.5, got ${wedLoad}`);

    // Thursday Power (65% of fallback/last AMRAP = 140 * 0.65 = 91 -> nearest 2.5kg = 90)
    const thuBenchEx = w1d4.exercises.find(e => e.name === 'Paused Bench Press')!;
    const thuLoad = calcWeight(thuBenchEx.target, user, 'Paused Bench Press', { week: 1, day: 4 });
    check(thuLoad === '90', `Thursday W1 power bench load expected 90, got ${thuLoad}`);

    // Saturday AMRAP (67.5% of 140 = 94.5 -> ceil 2.5kg = 95)
    const w1d6 = config.program.weeks[0].days.find(d => d.dayOfWeek === 6)!;
    const satAmrapEx = w1d6.exercises.find(e => e.name === 'Paused Bench Press (AMRAP)')!;
    const satLoad = calcWeight(satAmrapEx.target, user, 'Paused Bench Press (AMRAP)', { week: 1, day: 6 });
    check(satLoad === '95', `Saturday W1 AMRAP bench load expected 95, got ${satLoad}`);

    // BTN Press Monday (60 kg) & Thursday (85% of 60 = 51 -> floor 2.5kg = 50 kg)
    const btnMon = calcWeight({ type: 'range', reps: '3-5' }, user, 'Behind-the-Neck Press', { week: 1, day: 1 });
    const btnThu = calcWeight({ type: 'range', reps: '5-8' }, user, 'Behind-the-Neck Press', { week: 1, day: 4 });
    check(btnMon === '60', `BTN Press Monday expected 60, got ${btnMon}`);
    check(btnThu === '50', `BTN Press Thursday expected 50, got ${btnThu}`);

    // Pullups EMOM W1-3 returns 2.5, W4-6 returns 15
    const pullupW1 = calcWeight({ type: 'range', reps: '15' }, user, 'Weighted Pull-ups', { week: 1, day: 3 });
    const pullupW4 = calcWeight({ type: 'range', reps: '15' }, user, 'Weighted Pull-ups', { week: 4, day: 3 });
    check(pullupW1 === '2.5', `Pull-ups W1 expected 2.5, got ${pullupW1}`);
    check(pullupW4 === '15', `Pull-ups W4 expected 15, got ${pullupW4}`);

    // D. Progression Simulation (AMRAP & Accessories)
    // 1. Saturday AMRAP successful (+2.5 kg e1RM recorded in benchHistory)
    const satProg = benchDominationProgression({
        planId: 'bench-domination',
        week: 1,
        day: 6,
        isExistingLog: false,
        user,
        workout: w1d6,
        sets: {
            [satAmrapEx.id]: [makeSet('95', '14')], // 95kg x 14 reps -> e1RM = 95*(1+14/30) = 139.33 -> round = 139
        },
    });
    check(satProg.appends.length === 1 && satProg.appends[0].field === 'benchHistory', 'Saturday AMRAP logs entry to benchHistory');
    const amrapEntry = satProg.appends[0].value as { weight: number; actualWeight: number; actualReps: number };
    check(amrapEntry.actualWeight === 95 && amrapEntry.actualReps === 14, 'AMRAP entry records exact weight and reps');

    // 2. Monday BTN Press Progression (4 sets of 5 reps -> btnPress +2.5 kg)
    const btnEx = w1d1.exercises.find(e => e.name === 'Behind-the-Neck Press')!;
    const btnProg = benchDominationProgression({
        planId: 'bench-domination',
        week: 1,
        day: 1,
        isExistingLog: false,
        user,
        workout: w1d1,
        sets: {
            [btnEx.id]: [makeSet('60', '5'), makeSet('60', '5'), makeSet('60', '5'), makeSet('60', '5')],
        },
    });
    check(btnProg.updates['stats.btnPress'] === 62.5, 'BTN Press progresses +2.5kg when all sets hit top reps (5)');

    // 3. Wide-Grip Bench 2-consecutive-weeks streak
    const wgEx = w1d1.exercises.find(e => e.name === 'Wide-Grip Bench Press')!;
    // Week 1: 3x8 reps (streak 0 -> 1)
    const wgProg1 = benchDominationProgression({
        planId: 'bench-domination',
        week: 1,
        day: 1,
        isExistingLog: false,
        user: { ...user, stats: { ...user.stats, wideGripConsecutive: 0 } },
        workout: w1d1,
        sets: {
            [wgEx.id]: [makeSet('100', '8'), makeSet('100', '8'), makeSet('100', '8')],
        },
    });
    check(wgProg1.updates['stats.wideGripConsecutive'] === 1 && wgProg1.updates['stats.wideGripBench'] === 100, 'Wide-Grip streak increments to 1 on first top week');

    // Week 2: 3x8 reps with streak=1 -> progresses +2.5kg and resets streak to 0
    const wgProg2 = benchDominationProgression({
        planId: 'bench-domination',
        week: 2,
        day: 1,
        isExistingLog: false,
        user: { ...user, stats: { ...user.stats, wideGripConsecutive: 1 } },
        workout: w1d1,
        sets: {
            [wgEx.id]: [makeSet('100', '8'), makeSet('100', '8'), makeSet('100', '8')],
        },
    });
    check(wgProg2.updates['stats.wideGripConsecutive'] === 0 && wgProg2.updates['stats.wideGripBench'] === 102.5, 'Wide-Grip progresses +2.5kg and resets streak on second consecutive top week');

    // Week 2 Miss: 3x6 reps resets streak
    const wgProgMiss = benchDominationProgression({
        planId: 'bench-domination',
        week: 2,
        day: 1,
        isExistingLog: false,
        user: { ...user, stats: { ...user.stats, wideGripConsecutive: 1 } },
        workout: w1d1,
        sets: {
            [wgEx.id]: [makeSet('100', '6'), makeSet('100', '7'), makeSet('100', '8')],
        },
    });
    check(wgProgMiss.updates['stats.wideGripConsecutive'] === 0 && wgProgMiss.updates['stats.wideGripBench'] === 100, 'Wide-Grip miss resets streak to 0 and holds weight');

    // 4. Spoto Press & Low Pin Press progression
    const spotoEx = w1d3.exercises.find(e => e.name === 'Spoto Press')!;
    const spotoProg = benchDominationProgression({
        planId: 'bench-domination',
        week: 1,
        day: 3,
        isExistingLog: false,
        user,
        workout: w1d3,
        sets: {
            [spotoEx.id]: [makeSet('110', '5'), makeSet('110', '5'), makeSet('110', '5')],
        },
    });
    check(spotoProg.updates['stats.spotoPress'] === 112.5, 'Spoto Press progresses +2.5kg when all sets hit target (5 reps)');

    // 5. Deload Triggers:
    // Scheduled Week 8 forced deload
    const w8Prog = benchDominationProgression({
        planId: 'bench-domination',
        week: 8,
        day: 6,
        isExistingLog: false,
        user,
        workout: w1d6,
        sets: { [satAmrapEx.id]: [makeSet('95', '10')] },
    });
    check(w8Prog.appends.some(a => a.field === 'benchDominationStatus.addedDeloadWeeks'), 'Week 8 Saturday inserts forced deload week');

    // Reactive deload: 2 consecutive AMRAPs <= 7 in weeks 5-8
    const userWithPastStall = {
        ...user,
        benchHistory: [{ date: '2026-01-10', week: 5, weight: 100, actualWeight: 95, actualReps: 6 }],
    };
    const reactiveDeloadProg = benchDominationProgression({
        planId: 'bench-domination',
        week: 6,
        day: 6,
        isExistingLog: false,
        user: userWithPastStall,
        workout: w1d6,
        sets: { [satAmrapEx.id]: [makeSet('95', '7')] },
    });
    check(reactiveDeloadProg.appends.some(a => a.field === 'benchDominationStatus.addedDeloadWeeks'), 'Two consecutive Saturday AMRAPs <= 7 reps triggers reactive deload');

    // 6. Incomplete / Edge Cases
    const uncompletedProg = benchDominationProgression({
        planId: 'bench-domination',
        week: 1,
        day: 3,
        isExistingLog: false,
        user,
        workout: w1d3,
        sets: {
            [spotoEx.id]: [makeSet('110', '5', true), makeSet('110', '5', false), makeSet('110', '5', true)],
        },
    });
    check(uncompletedProg.updates['stats.spotoPress'] === 110, 'Uncompleted set prevents Spoto Press progression');

    const existingLogProg = benchDominationProgression({
        planId: 'bench-domination',
        week: 1,
        day: 6,
        isExistingLog: true,
        user,
        workout: w1d6,
        sets: { [satAmrapEx.id]: [makeSet('95', '15')] },
    });
    check(Object.keys(existingLogProg.updates).length === 0 && existingLogProg.appends.length === 0, 'Re-saving existing log produces no updates or appends');
}
console.log('>>> Bench Domination passed all assertions!\n');

// ============================================================================
// 2. KING OF THE SQUAT
// ============================================================================
console.log('>>> [2/6] Testing Plan: King of the Squat (king-of-the-squat)...');
{
    const user = makeWorkhorse('king-of-the-squat');
    const config = KING_OF_THE_SQUAT_CONFIG;

    // A. Lifecycle & Weeks & Phases
    check(config.program.weeks.length === 12, 'King of the Squat has 12 weeks');
    for (const week of config.program.weeks) {
        const activeDays = week.days.filter(d => d.exercises.length > 0);
        check(activeDays.length === 4, `Week ${week.weekNumber} has 4 active training days`);
    }

    // B. Loading & Wave Calculations
    const calcWeight = config.hooks?.calculateWeight!;
    check(calcWeight !== undefined, 'calculateWeight hook exists');

    // Low Bar Squat Waves: 180 kg base squat
    // Phase 1 (Weeks 1-3): base 75%, step 2.5%
    // W1 (weekInPhase 1): 180 * 0.75 = 135 kg
    const w1Squat = calcWeight(undefined as any, user, 'Paused Low Bar Squat', { week: 1, day: 1, setIndex: 0 });
    check(w1Squat === '135', `King of the Squat W1 squat load expected 135, got ${w1Squat}`);
    const w1Rung2 = calcWeight(undefined as any, user, 'Paused Low Bar Squat', { week: 1, day: 1, setIndex: 1 });
    check(w1Rung2 === '140', `King of the Squat W1 second rung expected 140, got ${w1Rung2}`);

    // W2 (weekInPhase 2): 180 * (0.75 + 0.025) = 180 * 0.775 = 139.5 -> rounded 2.5 = 140 kg
    const w2Squat = calcWeight(undefined as any, user, 'Paused Low Bar Squat', { week: 2, day: 1 });
    check(w2Squat === '140', `King of the Squat W2 squat load expected 140, got ${w2Squat}`);

    // W3 (weekInPhase 3): 180 * (0.75 + 0.050) = 180 * 0.80 = 144 -> rounded 2.5 = 145 kg
    const w3Squat = calcWeight(undefined as any, user, 'Paused Low Bar Squat', { week: 3, day: 1 });
    check(w3Squat === '145', `King of the Squat W3 squat load expected 145, got ${w3Squat}`);

    // Phase 2 (Weeks 4-6): starts fresh at base 75% for new rep ladder
    const w4Squat = calcWeight(undefined as any, user, 'Paused Low Bar Squat', { week: 4, day: 1 });
    check(w4Squat === '135', `King of the Squat W4 squat load expected 135, got ${w4Squat}`);

    // Paused Bench Press Day 2 Maintenance: 85% of 140 = 119 -> rounded 2.5 = 120 kg
    const d2Bench = calcWeight(undefined as any, user, 'Paused Bench Press', { week: 1, day: 2 });
    check(d2Bench === '120', `King of the Squat Day 2 bench load expected 120, got ${d2Bench}`);

    // Conventional Deadlift Day 2: Fixed 57.5% of 220 = 126.5 -> rounded 2.5 = 127.5 kg (deliberately light)
    const d2Deadlift = calcWeight(undefined as any, user, 'Conventional Deadlift', { week: 1, day: 2 });
    check(d2Deadlift === '127.5', `King of the Squat Day 2 deadlift load expected 127.5, got ${d2Deadlift}`);

    // Paused Back Squat (Day 4 Volume): 67.5% of 180 = 121.5 -> rounded 2.5 = 122.5 kg
    const d4Squat = calcWeight(undefined as any, user, 'Paused Back Squat', { week: 1, day: 4 });
    check(d4Squat === '122.5', `King of the Squat Day 4 paused back squat load expected 122.5, got ${d4Squat}`);

    // Front Squats (Day 5 Structural): 60% of 180 = 108 -> rounded 2.5 = 107.5 kg
    const d5FrontSquat = calcWeight(undefined as any, user, 'Front Squats', { week: 1, day: 5 });
    check(d5FrontSquat === '107.5', `King of the Squat Day 5 front squat load expected 107.5, got ${d5FrontSquat}`);

    // C. Onboarding Requirements & Calibration Mapping
    check(config.onboarding?.requiredStats?.includes('squat') === true, 'Onboarding requires squat 1RM');
    check(config.onboarding?.requiredStats?.includes('pausedBench') === true, 'Onboarding requires pausedBench 1RM');
    check(config.onboarding?.requiredStats?.includes('conventionalDeadlift') === true, 'Onboarding requires conventionalDeadlift 1RM');

    const calib = config.calibration?.exerciseNameToStat!;
    check(calib['Paused Low Bar Squat'] === 'squat', 'Paused Low Bar Squat calibrates squat');
    check(calib['Paused Bench Press'] === 'pausedBench', 'Paused Bench Press calibrates pausedBench');
    check(calib['Conventional Deadlift'] === 'conventionalDeadlift', 'Conventional Deadlift calibrates conventionalDeadlift');

    // D. Edge Cases: Missing stats fallback
    const userNoStats: UserProfile = { ...user, stats: {} as any };
    const missingLoad = calcWeight(undefined as any, userNoStats, 'Paused Low Bar Squat', { week: 1, day: 1 });
    check(missingLoad === undefined, 'Missing stats safely returns undefined without crashing');
}
console.log('>>> King of the Squat passed all assertions!\n');

// ============================================================================
// 3. PAIN & GLORY
// ============================================================================
console.log('>>> [3/6] Testing Plan: Pain & Glory (pain-and-glory)...');
{
    const user = makeWorkhorse('pain-and-glory');
    const config = PAIN_GLORY_CONFIG;

    // A. Lifecycle & Structure
    check(config.program.weeks.length === 16, 'Pain & Glory has 16 weeks');
    for (const week of config.program.weeks) {
        const activeDays = week.days.filter(d => d.exercises.length > 0);
        check(activeDays.length === 4, `Pain & Glory Week ${week.weekNumber} has 4 active training days`);
    }

    // B. Weight Calculations
    const calcWeight = config.hooks?.calculateWeight!;
    check(calcWeight !== undefined, 'calculateWeight hook exists');

    // 1. Deficit Snatch Grip: starting 45% of 220 = 99 -> floored 2.5 = 97.5 kg
    const userDefaultPG = { ...user, painGloryStatus: undefined };
    const defStart = calcWeight(undefined as any, userDefaultPG, 'Deficit Snatch Grip Deadlift', { week: 1, day: 1 });
    check(defStart === '97.5', `Deficit Snatch Grip starting load expected 97.5, got ${defStart}`);

    // With accumulated deficit weight (100 kg)
    const defCurrent = calcWeight(undefined as any, user, 'Deficit Snatch Grip Deadlift', { week: 1, day: 1 });
    check(defCurrent === '100', `Deficit Snatch Grip current load expected 100, got ${defCurrent}`);

    // 2. Paused Low Bar Squat
    // W1-4: base 70% of 180 = 126 -> floored 2.5 = 125 kg
    const w1Squat = calcWeight(undefined as any, user, 'Paused Low Bar Squat', { week: 1, day: 2 });
    check(w1Squat === '125', `Paused Low Bar Squat W1 expected 125, got ${w1Squat}`);

    // W5 reset: (180 * 1.075) * 0.70 = 135.45 -> floored 2.5 = 135 kg
    const w5Squat = calcWeight(undefined as any, user, 'Paused Low Bar Squat', { week: 5, day: 2 });
    check(w5Squat === '135', `Paused Low Bar Squat W5 reset expected 135, got ${w5Squat}`);

    // W9-16 maintenance: 85% of week8SquatWeight (e.g. 140 * 0.85 = 119 -> floored 2.5 = 117.5)
    const userWithW8 = { ...user, painGloryStatus: { ...user.painGloryStatus, week8SquatWeight: 140 } };
    const w9Squat = calcWeight(undefined as any, userWithW8, 'Paused Low Bar Squat', { week: 9, day: 2 });
    check(w9Squat === '117.5', `Paused Low Bar Squat W9 maintenance expected 117.5, got ${w9Squat}`);

    // 3. E2MOM Conventional Deadlift (Weeks 9-12): highest deficit (100) * 1.35 = 135 kg + adjustment
    const userE2mom = { ...user, painGloryStatus: { ...user.painGloryStatus, deficitSnatchGripWeight: 100, e2momWeightAdjustment: 5 } };
    const e2momLoad = calcWeight(undefined as any, userE2mom, 'Conventional Deadlift (E2MOM)', { week: 9, day: 5 });
    check(e2momLoad === '140', `E2MOM deadlift load expected 140, got ${e2momLoad}`);

    // C. Progression Simulation
    // 1. Squat progression: 4 sets within 4-6 reps -> +2.5kg squatProgress
    const pushDay = config.program.weeks[0].days.find(d => d.dayOfWeek === 2)!;
    const squatEx = pushDay.exercises.find(e => e.name === 'Paused Low Bar Squat')!;
    const squatProg = painGloryProgression({
        planId: 'pain-and-glory',
        week: 1,
        day: 2,
        isExistingLog: false,
        user,
        workout: pushDay,
        sets: {
            [squatEx.id]: [makeSet('125', '5'), makeSet('125', '5'), makeSet('125', '6'), makeSet('125', '5')],
        },
    });
    check(squatProg.updates['painGloryStatus.squatProgress'] === 2.5, 'Paused Low Bar Squat progresses +2.5kg on clean 4-6 rep completion');

    // Week 8 captures week8SquatWeight
    const w8PushDay = config.program.weeks[7].days.find(d => d.dayOfWeek === 2)!;
    const w8SquatEx = w8PushDay.exercises.find(e => e.name === 'Paused Low Bar Squat')!;
    const w8SquatProg = painGloryProgression({
        planId: 'pain-and-glory',
        week: 8,
        day: 2,
        isExistingLog: false,
        user,
        workout: w8PushDay,
        sets: {
            [w8SquatEx.id]: [makeSet('142.5', '5'), makeSet('142.5', '5'), makeSet('142.5', '5'), makeSet('142.5', '5')],
        },
    });
    check(w8SquatProg.updates['painGloryStatus.week8SquatWeight'] === 142.5, 'Week 8 captures final squat weight for peaking maintenance');

    // 2. E2MOM Progression (Weeks 9-12): 6 sets of 5 reps -> e2momWeightAdjustment +2.5kg
    const w9PullDay2 = config.program.weeks[8].days.find(d => d.dayOfWeek === 5)!;
    const e2momEx = w9PullDay2.exercises.find(e => e.name === 'Conventional Deadlift (E2MOM)')!;
    const e2momProg = painGloryProgression({
        planId: 'pain-and-glory',
        week: 9,
        day: 5,
        isExistingLog: false,
        user,
        workout: w9PullDay2,
        sets: {
            [e2momEx.id]: Array.from({ length: 6 }, () => makeSet('135', '5')),
        },
    });
    check(e2momProg.updates['painGloryStatus.e2momWeightAdjustment'] === 2.5, 'E2MOM deadlift progresses +2.5kg when all 6 sets hit 5 reps');

    // 3. Week 13 AMRAP Test: 185kg x 6 reps -> e1RM = 185 * (1 + 6/30) = 185 * 1.20 = 222 -> floored 2.5 = 220 kg
    const w13PullDay1 = config.program.weeks[12].days.find(d => d.dayOfWeek === 1)!;
    const amrapEx = w13PullDay1.exercises.find(e => e.name === 'Conventional Deadlift (AMRAP)')!;
    const amrapProg = painGloryProgression({
        planId: 'pain-and-glory',
        week: 13,
        day: 1,
        isExistingLog: false,
        user,
        workout: w13PullDay1,
        sets: {
            [amrapEx.id]: [makeSet('185', '6')],
        },
    });
    check(amrapProg.updates['painGloryStatus.estimatedE1RM'] === 220, `AMRAP test calculates floored e1RM (220), got ${amrapProg.updates['painGloryStatus.estimatedE1RM']}`);
    check(amrapProg.updates['painGloryStatus.amrapWeight'] === 185 && amrapProg.updates['painGloryStatus.amrapReps'] === 6, 'AMRAP records raw weight and reps');

    // 4. Deficit RPE feedback effect
    const w1PullDay1 = config.program.weeks[0].days.find(d => d.dayOfWeek === 1)!;
    const defProg = painGloryProgression({
        planId: 'pain-and-glory',
        week: 1,
        day: 1,
        isExistingLog: false,
        user,
        workout: w1PullDay1,
        sets: {},
    });
    check(defProg.effects.some(e => e.type === 'openDeficitFeedback'), 'Deficit pull session triggers openDeficitFeedback modal effect');

    // 5. Edge Cases: Failed rep blocks squat progression
    const squatFailProg = painGloryProgression({
        planId: 'pain-and-glory',
        week: 1,
        day: 2,
        isExistingLog: false,
        user,
        workout: pushDay,
        sets: {
            [squatEx.id]: [makeSet('125', '5'), makeSet('125', '3'), makeSet('125', '5'), makeSet('125', '5')],
        },
    });
    check(squatFailProg.updates['painGloryStatus.squatProgress'] === undefined, 'Rep count below target (<4) blocks squat progression');
}
console.log('>>> Pain & Glory passed all assertions!\n');

// ============================================================================
// 4. TRINARY
// ============================================================================
console.log('>>> [4/6] Testing Plan: Trinary (trinary)...');
{
    const user = makeWorkhorse('trinary');
    const config = TRINARY_CONFIG;

    // A. Lifecycle & Blocks
    check(config.program.weeks.length === 9, 'Trinary program has 9 nominal weeks / blocks');
    check(getBlockFromWorkout(1) === 1, 'Workout 1 is in Block 1');
    check(getBlockFromWorkout(10) === 4, 'Workout 10 is in Block 4');
    check(getBlockFromWorkout(27) === 9, 'Workout 27 is in Block 9');

    // B. Weight Calculations
    const calcWeight = config.hooks?.calculateWeight!;
    check(calcWeight !== undefined, 'calculateWeight hook exists');

    // Block 1 (90% ME, 60% DE, 70% RE)
    // Bench 1RM 140, Squat 1RM 180, Deadlift 1RM 220
    // ME Deadlift: 220 * 0.90 = 198 -> floor 2.5 = 197.5 kg
    const w1MEDeadlift = calcWeight({ type: 'straight', reps: '3' }, user, 'Conventional Deadlift (ME)', { week: 1, day: 1 });
    check(w1MEDeadlift === '197.5', `Trinary ME deadlift load expected 197.5, got ${w1MEDeadlift}`);

    // DE Squat: 180 * 0.60 = 108 -> floor 2.5 = 107.5 kg
    const w1DESquat = calcWeight({ type: 'straight', reps: '3' }, user, 'Low Bar Squat (DE)', { week: 1, day: 1 });
    check(w1DESquat === '107.5', `Trinary DE squat load expected 107.5, got ${w1DESquat}`);

    // RE Bench: 140 * 0.70 = 98 -> floor 2.5 = 97.5 kg
    const w1REBench = calcWeight({ type: 'range', reps: '8-12' }, user, 'Paused Bench Press (RE)', { week: 1, day: 1 });
    check(w1REBench === '97.5', `Trinary RE bench load expected 97.5, got ${w1REBench}`);

    // RE Deadlift variant: RDL at fixed 55% of 220 = 121 -> floor 2.5 = 120 kg
    const userRDL = { ...user, trinaryStatus: { ...user.trinaryStatus!, reDeadliftVariant: 'Romanian Deadlift' } };
    const w2RDL = calcWeight({ type: 'range', reps: '8-12' }, userRDL, 'Romanian Deadlift (RE)', { week: 1, day: 2 });
    check(w2RDL === '120', `Trinary RDL RE load expected 120 (55%), got ${w2RDL}`);

    // C. Progression Simulation
    const w1 = config.program.weeks[0].days.find(d => d.dayOfWeek === 1)!;
    const meEx = w1.exercises.find(e => e.name.includes('(ME)'))!;
    const deEx = w1.exercises.find(e => e.name.includes('(DE)'))!;
    const reEx = w1.exercises.find(e => e.name.includes('(RE)'))!;

    // 1. ME Progression by RPE
    // RPE 7 (<=7) -> +10 kg to deadlift 1RM
    const meProg7 = trinaryProgression({
        planId: 'trinary',
        week: 1,
        day: 1,
        isExistingLog: false,
        user,
        workout: w1,
        sets: {
            [meEx.id]: [makeSet('197.5', '3'), makeSet('197.5', '3'), makeSet('197.5', '3')],
        },
        selections: { meProgression: { [meEx.id]: 7 } },
    });
    check(meProg7.updates['trinaryStatus.deadlift1RM'] === 230, 'ME deadlift with RPE 7 increases deadlift 1RM by +10kg');

    // RPE 7.5 (7-8) -> +5 kg
    const meProg75 = trinaryProgression({
        planId: 'trinary',
        week: 1,
        day: 1,
        isExistingLog: false,
        user,
        workout: w1,
        sets: {
            [meEx.id]: [makeSet('197.5', '3'), makeSet('197.5', '3'), makeSet('197.5', '3')],
        },
        selections: { meProgression: { [meEx.id]: 7.5 } },
    });
    check(meProg75.updates['trinaryStatus.deadlift1RM'] === 225, 'ME deadlift with RPE 7.5 increases deadlift 1RM by +5kg');

    // RPE 8.5 (8-9) -> +2.5 kg
    const meProg85 = trinaryProgression({
        planId: 'trinary',
        week: 1,
        day: 1,
        isExistingLog: false,
        user,
        workout: w1,
        sets: {
            [meEx.id]: [makeSet('197.5', '3'), makeSet('197.5', '3'), makeSet('197.5', '3')],
        },
        selections: { meProgression: { [meEx.id]: 8.5 } },
    });
    check(meProg85.updates['trinaryStatus.deadlift1RM'] === 222.5, 'ME deadlift with RPE 8.5 increases deadlift 1RM by +2.5kg');

    // 2. RE Progression: 12 reps on all 4 sets queues +2.5kg
    const reProg = trinaryProgression({
        planId: 'trinary',
        week: 1,
        day: 1,
        isExistingLog: false,
        user,
        workout: w1,
        sets: {
            [reEx.id]: [makeSet('97.5', '12'), makeSet('97.5', '12'), makeSet('97.5', '12'), makeSet('97.5', '12')],
        },
    });
    const rePending = reProg.updates['trinaryStatus.reProgressionPending'] as Array<{ lift: string; amount: number }>;
    check(rePending?.some(p => p.lift === 'bench' && p.amount === 2.5), 'RE bench hitting 4x12 reps queues +2.5kg in reProgressionPending');

    // 3. DE Progression: 8 speed sets completed with >= 2 reps queues +2.5kg
    const deProg = trinaryProgression({
        planId: 'trinary',
        week: 1,
        day: 1,
        isExistingLog: false,
        user,
        workout: w1,
        sets: {
            [deEx.id]: Array.from({ length: 8 }, () => makeSet('107.5', '3')),
        },
    });
    const dePending = deProg.updates['trinaryStatus.deProgressionPending'] as Array<{ lift: string; amount: number }>;
    check(dePending?.some(p => p.lift === 'squat' && p.amount === 2.5), 'DE squat completing all speed sets queues +2.5kg in deProgressionPending');

    // 4. Accessory Day Handling
    const accessoryWorkout: WorkoutDay = {
        dayName: 'Accessory Day (Upper)',
        dayOfWeek: 1,
        exercises: [],
    };
    const accProg = trinaryProgression({
        planId: 'trinary',
        week: 1,
        day: 1,
        isExistingLog: false,
        user,
        workout: accessoryWorkout,
        sets: {},
    });
    check(accProg.updates['trinaryStatus.completedWorkouts'] === undefined, 'Accessory day does NOT advance completedWorkouts counter');
    check(accProg.updates['trinaryStatus.skipNextAccessory'] === false, 'Accessory day resets skipNextAccessory flag');

    // 5. Edge Cases: Missed rep on ME blocks progression
    const meMissProg = trinaryProgression({
        planId: 'trinary',
        week: 1,
        day: 1,
        isExistingLog: false,
        user,
        workout: w1,
        sets: {
            [meEx.id]: [makeSet('197.5', '3'), makeSet('197.5', '2'), makeSet('197.5', '3')],
        },
        selections: { meProgression: { [meEx.id]: 7 } },
    });
    check(meMissProg.updates['trinaryStatus.deadlift1RM'] === undefined, 'Missed rep (<3) on ME blocks RPE progression');
}
console.log('>>> Trinary passed all assertions!\n');

// ============================================================================
// 5. RITUAL OF STRENGTH
// ============================================================================
console.log('>>> [5/6] Testing Plan: Ritual of Strength (ritual-of-strength)...');
{
    const user = makeWorkhorse('ritual-of-strength');
    const config = RITUAL_CONFIG;

    // A. Lifecycle & Structure
    check(config.program.weeks.length === 19, 'Ritual of Strength has 19 weeks (including purge weeks)');
    
    // Ramp-In check: isFirstProgram true starts at Week 1; false starts at Week 5
    const userRepeat = { ...user, ritualStatus: { ...user.ritualStatus!, isFirstProgram: false } };
    const repeatSched = ritualProgression({
        planId: 'ritual-of-strength',
        week: 5,
        day: 1,
        isExistingLog: false,
        user: userRepeat,
        workout: { dayName: 'Bench ME', dayOfWeek: 1, exercises: [] },
        sets: {},
    });
    check(repeatSched.updates['ritualStatus.currentWeek'] === 5, 'Repeat run of Ritual starts at week 5 (skips ramp-in)');

    // B. Weight Calculations
    const calcWeight = config.hooks?.calculateWeight!;
    check(calcWeight !== undefined, 'calculateWeight hook exists');

    // Ramp-In Week 1 (70%): Bench 140 * 0.7 = 98 -> floor 2.5 = 97.5 kg
    const w1Bench = calcWeight(undefined as any, user, 'Paused Bench Press', { week: 1, day: 1 });
    check(w1Bench === '97.5', `Ritual Ramp-In W1 bench load expected 97.5, got ${w1Bench}`);

    // Main Phase Week 5 ME Bench (95% of 140 = 133 -> floor 2.5 = 132.5 kg)
    const w5MEBench = calcWeight(undefined as any, user, 'Paused Bench Press (ME)', { week: 5, day: 1 });
    check(w5MEBench === '132.5', `Ritual W5 ME bench load expected 132.5, got ${w5MEBench}`);

    // Main Phase Week 5 Light Squat (70% of 180 = 126 -> floor 2.5 = 125 kg)
    const w5LightSquat = calcWeight(undefined as any, user, 'Low Bar Squat (Light)', { week: 5, day: 1 });
    check(w5LightSquat === '125', `Ritual W5 light squat load expected 125, got ${w5LightSquat}`);

    // Light work with slow velocity reduction (65% of 180 = 117 -> floor 2.5 = 115 kg)
    const userSlow = { ...user, ritualStatus: { ...user.ritualStatus!, lightWorkReductionPending: { squat: true } } };
    const w5LightSquatSlow = calcWeight(undefined as any, userSlow, 'Low Bar Squat (Light)', { week: 5, day: 1 });
    check(w5LightSquatSlow === '115', `Ritual light squat with slow velocity penalty expected 115 (65%), got ${w5LightSquatSlow}`);

    // C. Progression Simulation
    // 1. Ascension Test (Week 4 AMRAP @ 85%): 117.5kg x 8 reps -> e1RM = 117.5 * (1 + 8/30) = 148.83 -> floor 2.5 = 147.5 kg
    const w4AscensionEx: Exercise = {
        id: 'r-w4-d1-e1',
        name: 'Paused Bench Press (Ascension Test)',
        sets: 1,
        target: { type: 'amrap', reps: 'Max' },
    };
    const ascensionProg = ritualProgression({
        planId: 'ritual-of-strength',
        week: 4,
        day: 1,
        isExistingLog: false,
        user: { ...user, ritualStatus: { ...user.ritualStatus!, benchMEProgression: 5 } },
        workout: { dayName: 'Bench Ascension', dayOfWeek: 1, exercises: [w4AscensionEx] },
        sets: {
            [w4AscensionEx.id]: [makeSet('117.5', '8')],
        },
    });
    check(ascensionProg.updates['ritualStatus.benchPress1RM'] === 147.5, `Ascension test recalculates 1RM (147.5), got ${ascensionProg.updates['ritualStatus.benchPress1RM']}`);
    check(ascensionProg.updates['ritualStatus.benchMEProgression'] === 0, 'Ascension test resets accumulated benchMEProgression to 0');

    // 2. ME Single Auto-PR (Week 5 heavier single: 145kg > 140kg 1RM -> updates 1RM to 145)
    const w5MEEx: Exercise = {
        id: 'r-w5-d1-e1',
        name: 'Paused Bench Press (ME)',
        sets: 1,
        target: { type: 'straight', reps: '1' },
    };
    const meAutoPR = ritualProgression({
        planId: 'ritual-of-strength',
        week: 5,
        day: 1,
        isExistingLog: false,
        user,
        workout: { dayName: 'Bench ME', dayOfWeek: 1, exercises: [w5MEEx] },
        sets: {
            [w5MEEx.id]: [makeSet('145', '1')],
        },
    });
    check(meAutoPR.updates['ritualStatus.benchPress1RM'] === 145, 'Heavier successful ME single auto-updates 1RM');

    // 3. ME Checkbox Progression (+2.5kg and +5kg)
    const meCheck25 = ritualProgression({
        planId: 'ritual-of-strength',
        week: 5,
        day: 1,
        isExistingLog: false,
        user,
        workout: { dayName: 'Bench ME', dayOfWeek: 1, exercises: [w5MEEx] },
        sets: { [w5MEEx.id]: [makeSet('135', '1')] },
        selections: { meProgression: { [w5MEEx.id]: 2.5 } },
    });
    check(meCheck25.updates['ritualStatus.benchMEProgression'] === 2.5, 'ME safety checkbox adds +2.5kg to benchMEProgression');

    const meCheck50 = ritualProgression({
        planId: 'ritual-of-strength',
        week: 5,
        day: 1,
        isExistingLog: false,
        user: { ...user, ritualStatus: { ...user.ritualStatus!, benchMEProgression: 2.5 } },
        workout: { dayName: 'Bench ME', dayOfWeek: 1, exercises: [w5MEEx] },
        sets: { [w5MEEx.id]: [makeSet('135', '1')] },
        selections: { meProgression: { [w5MEEx.id]: 5 } },
    });
    check(meCheck50.updates['ritualStatus.benchMEProgression'] === 7.5, 'Exceptionally easy checkbox adds +5kg to accumulated bonus (2.5 -> 7.5)');

    // 4. Edge Cases: Incomplete single does NOT trigger PR or bonus
    const incompleteME = ritualProgression({
        planId: 'ritual-of-strength',
        week: 5,
        day: 1,
        isExistingLog: false,
        user,
        workout: { dayName: 'Bench ME', dayOfWeek: 1, exercises: [w5MEEx] },
        sets: { [w5MEEx.id]: [makeSet('145', '1', false)] },
        selections: { meProgression: { [w5MEEx.id]: 2.5 } },
    });
    check(incompleteME.updates['ritualStatus.benchPress1RM'] === undefined, 'Uncompleted single does not trigger 1RM PR update');
    check(incompleteME.updates['ritualStatus.benchMEProgression'] === undefined, 'Uncompleted single does not trigger ME checkbox progression');
}
console.log('>>> Ritual of Strength passed all assertions!\n');

// ============================================================================
// 6. ATHENA
// ============================================================================
console.log('>>> [6/6] Testing Plan: Athena (athena)...');
{
    const user = makeWorkhorse('athena');
    const config = ATHENA_CONFIG;

    // A. Lifecycle & Frequency Modes
    check(config.program.weeks.length === 12, 'Athena has 12 weeks');
    check(ATHENA_FOUR_DAY.length === 4, 'Athena 4-day mode has 4 sessions');
    check(ATHENA_THREE_DAY.length === 3, 'Athena 3-day mode has 3 sessions');

    // B. Top-Set + Backoff Engine
    check(deriveBackoffLoad(100, 10, 2.5) === 90, '100kg with 10% backoff derives 90kg');
    check(deriveBackoffLoad(140, 10, 2.5) === 125, '140kg with 10% backoff derives 125kg (126 -> rounded 125)');

    check(topSetCanProgress({ completed: true, reps: 6, targetMaxReps: 6, rir: 2, quality: 'clean' }) === true, 'Clean top set with valid RIR can progress');
    check(topSetCanProgress({ completed: false, reps: 6, targetMaxReps: 6, rir: 2, quality: 'clean' }) === false, 'Incomplete top set cannot progress');
    check(topSetCanProgress({ completed: true, reps: 6, targetMaxReps: 6, rir: 2, quality: 'borderline' }) === false, 'Borderline top set cannot progress');
    check(topSetCanProgress({ completed: true, reps: 6, targetMaxReps: 6, rir: 2, quality: 'invalid' }) === false, 'Invalid form top set cannot progress');
    check(topSetCanProgress({ completed: true, reps: 6, targetMaxReps: 6, rir: undefined, quality: 'clean' }) === false, 'Missing RIR top set cannot progress');
    check(topSetCanProgress({ completed: true, reps: 5, targetMaxReps: 6, rir: 2, quality: 'clean' }) === false, 'Under-target rep top set cannot progress');

    // C. Progression Simulation
    // Week 1 (Wisdom Phase - Straight double progression)
    const w1d1 = config.program.weeks[0].days.find(d => d.dayOfWeek === 1)!;
    const squatEx = w1d1.exercises[0]; // Barbell Squat 4x6-8
    const wisdomCleanProg = athenaProgression({
        planId: 'athena',
        week: 1,
        day: 1,
        isExistingLog: false,
        user,
        workout: w1d1,
        sets: {
            [squatEx.id]: [makeSet('140', '8'), makeSet('140', '8'), makeSet('140', '8'), makeSet('140', '8')],
        },
    });
    const loadsWisdom = wisdomCleanProg.updates['athenaStatus.exerciseLoads'] as Record<string, number>;
    check(loadsWisdom?.[squatEx.exerciseId!] === 142.5, 'Wisdom phase clean completion at top reps (8) advances load by +2.5kg');

    // Week 5 (Discipline Phase - Top Set + Backoff)
    const w5d1 = config.program.weeks[4].days.find(d => d.dayOfWeek === 1)!;
    const w5SquatEx = w5d1.exercises[0]; // Barbell Squat topSetBackoff
    check(w5SquatEx.prescription?.topSetBackoff?.backoffPercent === 10, 'Discipline phase has 10% backoff configured');

    const disciplineCleanProg = athenaProgression({
        planId: 'athena',
        week: 5,
        day: 1,
        isExistingLog: false,
        user,
        workout: w5d1,
        sets: {
            [w5SquatEx.id]: [makeSet('140', '6', true, { rir: 2, quality: 'clean' })],
        },
    });
    const loadsDiscipline = disciplineCleanProg.updates['athenaStatus.exerciseLoads'] as Record<string, number>;
    check(loadsDiscipline?.[w5SquatEx.exerciseId!] === 142.5, 'Discipline clean top set advances load by incrementKg (140 -> 142.5)');

    // Borderline top set holds load
    const disciplineBorderlineProg = athenaProgression({
        planId: 'athena',
        week: 5,
        day: 1,
        isExistingLog: false,
        user,
        workout: w5d1,
        sets: {
            [w5SquatEx.id]: [makeSet('140', '6', true, { rir: 2, quality: 'borderline' })],
        },
    });
    const loadsBorderline = disciplineBorderlineProg.updates['athenaStatus.exerciseLoads'] as Record<string, number>;
    check(loadsBorderline?.[w5SquatEx.exerciseId!] === 140, 'Discipline borderline top set holds load at current weight');

    // D. Schedule Mode Transition
    const userAthenaChange: UserProfile = {
        ...user,
        startDate: '2026-01-01',
        programProgress: { athena: { completedSessions: 0, startDate: '2026-01-01' } },
        planPreferences: {
            athena: {
                scheduleMode: '4day',
                exerciseSelections: {},
                updatedAt: '2026-01-01T00:00:00.000Z',
                pendingScheduleChange: { mode: '3day', requestedAt: '2026-01-02T00:00:00.000Z', requestedDuringWeek: 1 },
            },
        },
    };
    check(effectiveAthenaMode(userAthenaChange, '2026-01-10') === '4day', 'Mode stays 4day before week completion');
    userAthenaChange.programProgress!.athena.completedSessions = 4;
    check(effectiveAthenaMode(userAthenaChange, '2026-01-10') === '3day', 'Mode transitions to 3day after week completion and calendar boundary');
}
console.log('>>> Athena passed all assertions!\n');

// ============================================================================
// SUMMARY REPORT
// ============================================================================
console.log('========================================================================');
console.log(`GROUP 1 SIMULATION COMPLETE: ${totalChecks} checks run, ${failures.length} failures.`);
console.log('========================================================================\n');

if (failures.length > 0) {
    console.error('FAILURES FOUND:');
    for (const f of failures) console.error(` - ${f}`);
    process.exit(1);
} else {
    console.log('ALL 6 PLANS PASSED SIMULATION WITH PERSONA test_workhorse!');
}
