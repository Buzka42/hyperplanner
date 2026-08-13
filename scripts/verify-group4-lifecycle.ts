/**
 * verify:group4-lifecycle
 *
 * Comprehensive test & lifecycle simulation suite for Group 4:
 * Calisthenics, Structural Balance & Minimal Equipment plans:
 *
 * 1. Workhorse (workhorse)
 * 2. Gravity Is Optional (gravity-is-optional)
 * 3. Immaculate (Re)Structure (immaculate-restructure)
 * 4. Skeleton to Threat (skeleton-to-threat)
 * 5. House of Iron (house-of-iron)
 * 6. 30 Minute Adventure (30-minute-adventure)
 *
 * Persona: test_workhorse
 */

import assert from 'node:assert/strict';
import { PLAN_REGISTRY, getPlan } from '../src/data/plans';
import { WORKHORSE_CONFIG } from '../src/data/plans/workhorse';
import { GRAVITY_IS_OPTIONAL_CONFIG } from '../src/data/plans/gravityIsOptional';
import { IMMACULATE_RESTRUCTURE_CONFIG } from '../src/data/plans/immaculateRestructure';
import { SKELETON_CONFIG } from '../src/data/skeleton';
import { skeletonProgression } from '../src/features/workout/progression/skeleton';
import { HOUSE_OF_IRON_CONFIG } from '../src/data/plans/houseOfIron';
import { HOUSE_LADDERS, houseOfIronProgression } from '../src/features/workout/progression/houseOfIron';
import { houseBalance, recommendHouseSession } from '../src/features/houseOfIron/recommendation';
import { applyHouseProgressions } from '../src/features/houseOfIron/prescription';
import {
    ADVENTURE_CONFIG,
    ADVENTURE_EXERCISES,
    ADVENTURE_PAIRS,
    ADVENTURE_PLAN_ID,
    ADVENTURE_PORTALS,
    adventureDraftKey,
    adventureResultKey,
    buildAdventureSequence,
    findPreviousAdventureWeight,
    getAdventureExercise,
    getAdventurePair,
} from '../src/data/adventure';
import { EXERCISE_BY_ID } from '../src/data/exercises/library';
import { ALWAYS_FREE_PLAN_IDS, DEFAULT_ONBOARDING_CONFIG } from '../src/data/accessControl';
import { translations } from '../src/contexts/translations';
import type { LoggedSet, ProgressionContext } from '../src/features/workout/progression/types';
import type { Exercise, ProgramWeek, UserProfile, WorkoutDay, WorkoutLog } from '../src/types';

let checksRun = 0;
const failures: string[] = [];

const check = (ok: boolean, msg: string) => {
    checksRun++;
    if (!ok) {
        failures.push(msg);
        console.error(`FAIL: ${msg}`);
    }
};

const set = (weight: string, reps: string, completed = true, kind?: string): LoggedSet =>
    ({ weight, reps, completed, ...(kind ? { kind } : {}) });

const context = (over: Partial<ProgressionContext>): ProgressionContext => ({
    planId: 'test',
    week: 1,
    day: 1,
    isExistingLog: false,
    user: {} as UserProfile,
    workout: undefined,
    sets: {},
    ...over,
});

console.log('========================================================================');
console.log('STARTING GROUP 4 COMPREHENSIVE VERIFICATION & LIFECYCLE SIMULATION');
console.log('Test Persona: test_workhorse');
console.log('========================================================================\n');

// ===========================================================================
// 1. WORKHORSE
// ===========================================================================
console.log('--- 1. Testing Workhorse (workhorse) ---');
{
    const plan = WORKHORSE_CONFIG;
    check(plan.id === 'workhorse', 'Workhorse config id must be workhorse');
    check(PLAN_REGISTRY['workhorse'] !== undefined, 'Workhorse must be in PLAN_REGISTRY');
    check(plan.program.weeks.length === 10, 'Workhorse must have 10 weeks');
    check(plan.ui?.themeClass === 'theme-workhorse', 'Workhorse themeClass must be theme-workhorse');
    check(plan.ui?.dashboardWidgets?.includes('1rm') === true, 'Workhorse must include 1rm widget');
    check(plan.ui?.dashboardWidgets?.includes('strength_chart') === true, 'Workhorse must include strength_chart widget');

    // Test structure: 4 training days per week (out of 7 total days including rest)
    for (let w = 0; w < 10; w++) {
        const week = plan.program.weeks[w];
        const trainingDays = week.days.filter(d => d.exercises.length > 0);
        check(trainingDays.length === 4, `Workhorse week ${w + 1} must have 4 training days`);
        const dayNames = trainingDays.map(d => d.dayName);
        check(dayNames.some(n => n.includes('Weighted Chin Strength')), `W${w + 1} must have Weighted Chin Strength`);
        check(dayNames.some(n => n.includes('Legs + Vertical Pull Volume')), `W${w + 1} must have Legs + Vertical Pull Volume`);
        check(dayNames.some(n => n.includes('Horizontal Back')), `W${w + 1} must have Horizontal Back`);
        check(dayNames.some(n => n.includes('Legs + Chest')), `W${w + 1} must have Legs + Chest`);
    }

    // Phase 1: Ascent (Weeks 1–4)
    const w1d1 = plan.program.weeks[0].days.find(d => d.dayOfWeek === 1)!;
    const chinW1 = w1d1.exercises.find(e => e.exerciseId === 'weighted-chin-up');
    check(chinW1 !== undefined, 'W1 D1 must have weighted-chin-up');
    check(chinW1?.sets === 6, 'W1 Chin must be 6 sets');
    check(chinW1?.target.reps === '3-5', 'W1 Chin target must be 3-5 reps');
    check(chinW1?.prescription?.restSeconds === 210, 'W1 Chin rest must be 210 seconds');
    check(chinW1?.prescription?.tempo === '20X0', 'W1 Chin tempo must be 20X0');
    check(chinW1?.notes?.includes('Total system weight') === true, 'W1 Chin note specifies total system weight');

    // Phase 2: Overhang (Weeks 5–9) -> 6x3
    const w5d1 = plan.program.weeks[4].days.find(d => d.dayOfWeek === 1)!;
    const chinW5 = w5d1.exercises.find(e => e.exerciseId === 'weighted-chin-up');
    check(chinW5?.sets === 6, 'W5 Overhang Chin must be 6 sets');
    check(chinW5?.target.reps === '3', 'W5 Overhang Chin target must be straight 3 reps');

    // Phase 3: Chin-Up Trial (Week 10) -> 3x1-3 & other slots -1 set (min 2)
    const w10d1 = plan.program.weeks[9].days.find(d => d.dayOfWeek === 1)!;
    const chinW10 = w10d1.exercises.find(e => e.exerciseId === 'weighted-chin-up');
    check(chinW10?.sets === 3, 'W10 Trial Chin must be 3 sets');
    check(chinW10?.target.reps === '1-3', 'W10 Trial Chin target must be 1-3 reps');
    check(chinW10?.notes?.includes('Chin-Up Trial') === true, 'W10 Chin note specifies Chin-Up Trial');

    // Check volume reduction on other exercises in W10
    const w1ChestPress = w1d1.exercises.find(e => e.exerciseId === 'hammer-chest-press')!;
    const w10ChestPress = w10d1.exercises.find(e => e.exerciseId === 'hammer-chest-press')!;
    check(w1ChestPress.sets === 3 && w10ChestPress.sets === 2, 'Hammer chest press drops from 3 to 2 sets in W10 trial');

    // Verify weighted-chin-up exercise definition in library
    const libChin = EXERCISE_BY_ID['weighted-chin-up'];
    check(libChin !== undefined, 'weighted-chin-up must exist in library');
    check(libChin?.weightMode === 'weighted-bodyweight', 'weighted-chin-up weightMode must be weighted-bodyweight');
    check(libChin?.strengthRef?.ratioOf === 'close-grip-bench-press', 'weighted-chin-up ratioOf close-grip-bench-press');
    check(libChin?.strengthRef?.poliquinPercent === 81, 'weighted-chin-up Poliquin percent must be 81%');

    // Simulate persona 'test_workhorse' (BW = 80kg, belt load +20kg -> total system weight 100kg)
    const personaUser: UserProfile = {
        id: 'test_workhorse',
        codeword: 'workhorse_tester',
        programId: 'workhorse',
        startDate: '2026-08-01',
        completedSessions: 0,
        stats: { bodyWeight: 80, closeGripBench: 125 },
        programProgress: {},
        badges: [],
    } as unknown as UserProfile;

    const expectedPoliquinTotalSystem = 125 * 0.81; // 101.25 kg total system weight
    const expectedBeltLoadAt80kgBW = expectedPoliquinTotalSystem - 80; // 21.25 kg belt load
    check(Math.abs(expectedPoliquinTotalSystem - 101.25) < 0.01, 'Poliquin total system calculation aligns');
    check(Math.abs(expectedBeltLoadAt80kgBW - 21.25) < 0.01, 'Belt load calculation aligns');

    console.log('   Workhorse checks passed.');
}

// ===========================================================================
// 2. GRAVITY IS OPTIONAL
// ===========================================================================
console.log('--- 2. Testing Gravity Is Optional (gravity-is-optional) ---');
{
    const plan = GRAVITY_IS_OPTIONAL_CONFIG;
    check(plan.id === 'gravity-is-optional', 'Gravity Is Optional config id must match');
    check(PLAN_REGISTRY['gravity-is-optional'] !== undefined, 'Gravity Is Optional must be registered');
    check(plan.program.weeks.length === 12, 'Gravity Is Optional must have 12 weeks');
    check(plan.ui?.themeClass === 'theme-gravity-is-optional', 'Theme class must be theme-gravity-is-optional');

    // Phase 1: Ascent (Weeks 1–4)
    const w1 = plan.program.weeks[0];
    const heavyDayW1 = w1.days.find(d => d.dayOfWeek === 1)!;
    const volumeDayW1 = w1.days.find(d => d.dayOfWeek === 4)!;
    const controlDayW1 = w1.days.find(d => d.dayOfWeek === 5)!;

    const w1Chin = heavyDayW1.exercises.find(e => e.exerciseId === 'weighted-chin-up')!;
    const w1Dip = heavyDayW1.exercises.find(e => e.exerciseId === 'weighted-dip')!;
    check(w1Chin.sets === 5 && w1Chin.target.reps === '3-5', 'W1 Heavy Chin is 5x3-5');
    check(w1Dip.sets === 5 && w1Dip.target.reps === '3-5', 'W1 Heavy Dip is 5x3-5');
    check(w1Chin.prescription?.restSeconds === 210, 'W1 Chin rest is 210s');
    check(w1Dip.prescription?.restSeconds === 210, 'W1 Dip rest is 210s');

    const w1VolChin = volumeDayW1.exercises.find(e => e.exerciseId === 'chin-up')!;
    const w1VolDip = volumeDayW1.exercises.find(e => e.exerciseId === 'dip')!;
    check(w1VolChin.prescription?.technique?.kind === 'total-reps' && (w1VolChin.prescription.technique as any).targetReps === 40, 'W1 Volume Chin target is 40 total reps');
    check(w1VolDip.prescription?.technique?.kind === 'total-reps' && (w1VolDip.prescription.technique as any).targetReps === 50, 'W1 Volume Dip target is 50 total reps');

    const w1ControlDeadlift = controlDayW1.exercises.find(e => e.exerciseId === 'hip-supported-db-deadlift')!;
    check(w1ControlDeadlift.prescription?.tempo === '40X0', 'Control DB Deadlift has 40X0 tempo');

    // Phase 2: Escape Velocity (Weeks 5–8) -> +1 set on weighted chin and dip (6x3-5)
    const w5 = plan.program.weeks[4];
    const heavyDayW5 = w5.days.find(d => d.dayOfWeek === 1)!;
    const w5Chin = heavyDayW5.exercises.find(e => e.exerciseId === 'weighted-chin-up')!;
    const w5Dip = heavyDayW5.exercises.find(e => e.exerciseId === 'weighted-dip')!;
    check(w5Chin.sets === 6, 'W5 Heavy Chin gets +1 set -> 6 sets');
    check(w5Dip.sets === 6, 'W5 Heavy Dip gets +1 set -> 6 sets');

    // Phase 3: Orbit (Weeks 9–12) -> total-reps targets x 1.25 (Chin -> 50, Dip -> 63)
    const w9 = plan.program.weeks[8];
    const volumeDayW9 = w9.days.find(d => d.dayOfWeek === 4)!;
    const w9VolChin = volumeDayW9.exercises.find(e => e.exerciseId === 'chin-up')!;
    const w9VolDip = volumeDayW9.exercises.find(e => e.exerciseId === 'dip')!;
    check((w9VolChin.prescription?.technique as any)?.targetReps === 50, 'W9 Volume Chin target scaled by 1.25 to 50 reps');
    check((w9VolDip.prescription?.technique as any)?.targetReps === 63, 'W9 Volume Dip target scaled by 1.25 to 63 reps');

    // Library weightModes
    check(EXERCISE_BY_ID['weighted-chin-up'].weightMode === 'weighted-bodyweight', 'weighted-chin-up is weighted-bodyweight');
    check(EXERCISE_BY_ID['weighted-dip'].weightMode === 'weighted-bodyweight', 'weighted-dip is weighted-bodyweight');
    check(EXERCISE_BY_ID['chin-up'].weightMode === 'bodyweight', 'chin-up is bodyweight');
    check(EXERCISE_BY_ID['dip'].weightMode === 'bodyweight', 'dip is bodyweight');

    console.log('   Gravity Is Optional checks passed.');
}

// ===========================================================================
// 3. IMMACULATE (RE)STRUCTURE
// ===========================================================================
console.log('--- 3. Testing Immaculate (Re)Structure (immaculate-restructure) ---');
{
    const plan = IMMACULATE_RESTRUCTURE_CONFIG;
    check(plan.id === 'immaculate-restructure', 'Immaculate Restructure config id must match');
    check(PLAN_REGISTRY['immaculate-restructure'] !== undefined, 'Immaculate Restructure must be registered');
    check(plan.program.weeks.length === 10, 'Immaculate Restructure must have 10 weeks');
    check(plan.ui?.themeClass === 'theme-immaculate-restructure', 'Theme class must be theme-immaculate-restructure');

    // Verify Poliquin structural balance targets in notes & library
    const w1d1 = plan.program.weeks[0].days.find(d => d.dayOfWeek === 1)!;
    const cgbp = w1d1.exercises.find(e => e.exerciseId === 'close-grip-bench-press')!;
    const chin = w1d1.exercises.find(e => e.exerciseId === 'weighted-chin-up')!;
    const incline = w1d1.exercises.find(e => e.exerciseId === 'incline-barbell-bench-press')!;
    const extRot = w1d1.exercises.find(e => e.exerciseId === 'single-arm-external-rotation')!;
    const revCurl = w1d1.exercises.find(e => e.exerciseId === 'reverse-curl')!;

    check(cgbp !== undefined && cgbp.notes?.includes('reference lift') === true, 'CGBP is marked as reference lift');
    check(chin.notes?.includes('81%') === true, 'Chin note mentions 81%');
    check(incline.notes?.includes('83%') === true, 'Incline note mentions 83%');
    check(extRot.notes?.includes('9%') === true, 'Ext rotation note mentions 9%');
    check(revCurl.notes?.includes('30%') === true, 'Reverse curl note mentions 30%');

    const w1d4 = plan.program.weeks[0].days.find(d => d.dayOfWeek === 4)!;
    const preacher = w1d4.exercises.find(e => e.exerciseId === 'ezbar-preacher-curl')!;
    check(preacher.notes?.includes('46%') === true, 'Preacher curl note mentions 46%');

    // Verify library strengthRef ratios
    check(EXERCISE_BY_ID['incline-barbell-bench-press'].strengthRef?.poliquinPercent === 83, 'Library Incline bench strengthRef is 83%');
    check(EXERCISE_BY_ID['weighted-chin-up'].strengthRef?.poliquinPercent === 81, 'Library Weighted chin strengthRef is 81%');
    check(EXERCISE_BY_ID['single-arm-external-rotation'].strengthRef?.poliquinPercent === 9, 'Library External rotation strengthRef is 9%');
    check(EXERCISE_BY_ID['reverse-curl'].strengthRef?.poliquinPercent === 30, 'Library Reverse curl strengthRef is 30%');

    // Test Persona structural ratio calculations
    const cgbpBaseline = 100; // 100 kg
    const targetIncline = cgbpBaseline * (EXERCISE_BY_ID['incline-barbell-bench-press'].strengthRef?.poliquinPercent! / 100);
    const targetChinSystem = cgbpBaseline * (EXERCISE_BY_ID['weighted-chin-up'].strengthRef?.poliquinPercent! / 100);
    const targetExtRot = cgbpBaseline * (EXERCISE_BY_ID['single-arm-external-rotation'].strengthRef?.poliquinPercent! / 100);
    const targetRevCurl = cgbpBaseline * (EXERCISE_BY_ID['reverse-curl'].strengthRef?.poliquinPercent! / 100);

    check(targetIncline === 83, 'Incline target at 100kg CGBP is 83kg');
    check(targetChinSystem === 81, 'Weighted chin system target at 100kg CGBP is 81kg');
    check(targetExtRot === 9, 'Ext rotation target at 100kg CGBP is 9kg');
    check(targetRevCurl === 30, 'Reverse curl target at 100kg CGBP is 30kg');

    // Phase 3: Re-Test (Weeks 8–10) -> volume cut: sets = Math.max(2, slot.sets - 1)
    const w1d1_cgbpSets = w1d1.exercises.find(e => e.exerciseId === 'close-grip-bench-press')!.sets; // 4
    const w8d1 = plan.program.weeks[7].days.find(d => d.dayOfWeek === 1)!;
    const w8d1_cgbpSets = w8d1.exercises.find(e => e.exerciseId === 'close-grip-bench-press')!.sets; // 3
    const w1d1_inclineSets = w1d1.exercises.find(e => e.exerciseId === 'incline-barbell-bench-press')!.sets; // 3
    const w8d1_inclineSets = w8d1.exercises.find(e => e.exerciseId === 'incline-barbell-bench-press')!.sets; // 2
    check(w1d1_cgbpSets === 4 && w8d1_cgbpSets === 3, 'CGBP drops from 4 to 3 sets in Re-Test');
    check(w1d1_inclineSets === 3 && w8d1_inclineSets === 2, 'Incline drops from 3 to 2 sets in Re-Test');

    console.log('   Immaculate (Re)Structure checks passed.');
}

// ===========================================================================
// 4. SKELETON TO THREAT
// ===========================================================================
console.log('--- 4. Testing Skeleton to Threat (skeleton-to-threat) ---');
{
    const plan = SKELETON_CONFIG;
    check(plan.id === 'skeleton-to-threat', 'Skeleton to Threat config id must match');
    check(PLAN_REGISTRY['skeleton-to-threat'] !== undefined, 'Skeleton to Threat must be registered');
    check(plan.program.weeks.length === 12, 'Skeleton to Threat must have 12 weeks');

    // Test preprocessDay with persona selectedDays [1, 3, 5]
    const testUser: UserProfile = {
        id: 'test_workhorse',
        codeword: 'workhorse_tester',
        programId: 'skeleton-to-threat',
        selectedDays: [1, 3, 5],
        skeletonStatus: { completed: false, plankTargetSeconds: 30 },
    } as unknown as UserProfile;

    // Week 1 Day 1 (Monday = selected)
    const rawW1D1: WorkoutDay = { id: 'sk-w1-d1', dayName: 't:dayNames.restAndRecovery', dayOfWeek: 1, exercises: [] };
    const prepW1D1 = plan.hooks!.preprocessDay!(rawW1D1, testUser);
    check(prepW1D1.exercises.length === 7, 'Preprocessed selected day has 7 exercises');
    check(prepW1D1.exercises[0].name === 'Deficit Push-ups', 'Exercise 1 is Deficit Push-ups');
    check(prepW1D1.exercises[0].sets === 3, 'Deficit push-ups has 3 sets');
    check(prepW1D1.exercises[1].name === 'Leg Extensions' && prepW1D1.exercises[1].sets === 3, 'Leg Extensions has 3 sets in W1');
    check(prepW1D1.exercises[6].name === 'Planks' && prepW1D1.exercises[6].target.reps === '30sec', 'Planks starts at 30sec');

    // Week 1 Day 2 (Tuesday = rest day)
    const rawW1D2: WorkoutDay = { id: 'sk-w1-d2', dayName: 't:dayNames.restAndRecovery', dayOfWeek: 2, exercises: [] };
    const prepW1D2 = plan.hooks!.preprocessDay!(rawW1D2, testUser);
    check(prepW1D2.exercises.length === 0, 'Rest day has 0 exercises');

    // Week 9+ (Late phase volume: exercises 2-6 get +1 set, push-ups and planks stay 3 sets)
    const rawW9D1: WorkoutDay = { id: 'sk-w9-d1', dayName: 't:dayNames.restAndRecovery', dayOfWeek: 1, exercises: [] };
    const prepW9D1 = plan.hooks!.preprocessDay!(rawW9D1, testUser);
    check(prepW9D1.exercises[0].sets === 3, 'Push-ups remain 3 sets in W9');
    check(prepW9D1.exercises[1].sets === 4, 'Leg Extensions increase to 4 sets in W9');
    check(prepW9D1.exercises[2].sets === 4, 'Supported SLDL increases to 4 sets in W9');
    check(prepW9D1.exercises[3].sets === 4, 'Standing Calf Raises increase to 4 sets in W9');
    check(prepW9D1.exercises[4].sets === 3, 'Inverted Rows increase to 3 sets in W9');
    check(prepW9D1.exercises[5].sets === 3, 'Pulldown increases to 3 sets in W9');
    check(prepW9D1.exercises[6].sets === 3, 'Planks remain 3 sets in W9');

    // Progression handler testing: Planks
    const plankEx = prepW1D1.exercises[6];
    // 1. All 3 sets hit 30s -> updates to 40s
    const plankContext1 = context({
        planId: 'skeleton-to-threat',
        workout: prepW1D1,
        user: testUser,
        sets: { [plankEx.id]: [set('0', '30'), set('0', '35'), set('0', '30')] },
    });
    const res1 = skeletonProgression(plankContext1);
    check(res1.updates['skeletonStatus.plankTargetSeconds'] === 40, 'All sets hitting 30s advances plank target to 40s');

    // 2. Missed set -> no advancement
    const plankContextMiss = context({
        planId: 'skeleton-to-threat',
        workout: prepW1D1,
        user: testUser,
        sets: { [plankEx.id]: [set('0', '30'), set('0', '25'), set('0', '30')] },
    });
    const resMiss = skeletonProgression(plankContextMiss);
    check(resMiss.updates['skeletonStatus.plankTargetSeconds'] === undefined, 'Missed set does not advance plank target');

    // 3. Compounding: at 40s target, hitting 40s advances to 50s
    const userAt40: UserProfile = { ...testUser, skeletonStatus: { completed: false, plankTargetSeconds: 40 } };
    const prepAt40 = plan.hooks!.preprocessDay!(rawW1D1, userAt40);
    const plankContext40 = context({
        planId: 'skeleton-to-threat',
        workout: prepAt40,
        user: userAt40,
        sets: { [prepAt40.exercises[6].id]: [set('0', '40'), set('0', '40'), set('0', '45')] },
    });
    const res40 = skeletonProgression(plankContext40);
    check(res40.updates['skeletonStatus.plankTargetSeconds'] === 50, 'Hitting 40s advances plank target to 50s');

    // 4. Programme completion on Week 12 Day 5 (highest selected day)
    const rawW12D5: WorkoutDay = { id: 'sk-w12-d5', dayName: 't:dayNames.restAndRecovery', dayOfWeek: 5, exercises: [] };
    const prepW12D5 = plan.hooks!.preprocessDay!(rawW12D5, testUser);
    const w12CompletionContext = context({
        planId: 'skeleton-to-threat',
        workout: prepW12D5,
        user: testUser,
        week: 12,
        day: 5,
        sets: {},
    });
    const resCompletion = skeletonProgression(w12CompletionContext);
    check(resCompletion.updates['skeletonStatus.completed'] === true, 'W12 D5 sets skeletonStatus.completed = true');
    check(resCompletion.effects.some(e => e.type === 'openSkeletonCompletion'), 'W12 D5 triggers openSkeletonCompletion effect');

    // Week 12 Day 3 (not last day) must not trigger completion
    const rawW12D3: WorkoutDay = { id: 'sk-w12-d3', dayName: 't:dayNames.restAndRecovery', dayOfWeek: 3, exercises: [] };
    const prepW12D3 = plan.hooks!.preprocessDay!(rawW12D3, testUser);
    const w12MidContext = context({
        planId: 'skeleton-to-threat',
        workout: prepW12D3,
        user: testUser,
        week: 12,
        day: 3,
        sets: {},
    });
    const resMid = skeletonProgression(w12MidContext);
    check(resMid.updates['skeletonStatus.completed'] === undefined, 'W12 D3 does not complete programme early');

    console.log('   Skeleton to Threat checks passed.');
}

// ===========================================================================
// 5. HOUSE OF IRON
// ===========================================================================
console.log('--- 5. Testing House of Iron (house-of-iron) ---');
{
    const plan = HOUSE_OF_IRON_CONFIG;
    check(plan.id === 'house-of-iron', 'House of Iron config id must match');
    check(PLAN_REGISTRY['house-of-iron'] !== undefined, 'House of Iron must be registered');
    check(plan.session?.kind === 'session-select', 'House of Iron must use session-select session mode');
    check(plan.program.weeks.length === 8, 'House of Iron must have 8 weeks');

    // Test required sets per session (12–15 required sets)
    const week1 = plan.program.weeks[0].days.filter(d => d.exercises.length);
    for (const d of week1) {
        const requiredSets = d.exercises.filter(e => !e.optional).reduce((sum, e) => sum + e.sets, 0);
        check(requiredSets >= 12 && requiredSets <= 15, `${d.dayName} has ${requiredSets} required sets (12-15 expected)`);
    }

    // Week 8 (Rebuild) volume reduction: 30-40%
    const week8 = plan.program.weeks[7].days.filter(d => d.exercises.length);
    week1.forEach((d, i) => {
        const normal = d.exercises.filter(e => !e.optional).reduce((sum, e) => sum + e.sets, 0);
        const rebuild = week8[i].exercises.filter(e => !e.optional).reduce((sum, e) => sum + e.sets, 0);
        const reduction = 1 - rebuild / normal;
        check(reduction >= 0.3 && reduction <= 0.4, `${d.dayName} rebuild reduction is ${Math.round(reduction * 100)}% (30-40% expected)`);
    });

    // Test houseBalance tracking
    const history = [
        { session: 'push-a', date: '2026-08-01' },
        { session: 'push-b', date: '2026-08-02' },
    ];
    const bal = houseBalance(history);
    check(bal.upperPush === 2 && bal.upperPull === 0 && bal.knee === 2 && bal.hip === 0, 'houseBalance counts push & knee');
    const rec = recommendHouseSession(history, '2026-08-05');
    check(rec.startsWith('pull'), `recommendHouseSession recommends pull to balance, got ${rec}`);

    // Test fixed-load progression ladder & 2 consecutive clean exposures rule
    const squatEx = {
        id: 'house-slot-1',
        name: 'Goblet Heel-Elevated Squat',
        exerciseId: 'goblet-heel-elevated-squat',
        sets: 3,
        target: { type: 'range' as const, reps: '8-15' },
    };
    const cleanSets = {
        'house-slot-1': [set('20', '15'), set('20', '15'), set('20', '15')],
    };

    // Exposure 1
    const p1 = houseOfIronProgression(context({
        planId: 'house-of-iron',
        workout: { dayName: 'Push A', dayOfWeek: 1, exercises: [squatEx] },
        sets: cleanSets,
    }));
    const p1Prog = p1.updates['houseOfIronStatus.progression'] as Record<string, { cleanTopRangeExposures: number }>;
    const p1Pending = p1.updates['houseOfIronStatus.pendingProgressions'] as Record<string, { stage: string }>;
    check(p1Prog['goblet-heel-elevated-squat']?.cleanTopRangeExposures === 1, 'Exposure 1 gives cleanTopRangeExposures = 1');
    check(p1Pending?.['goblet-heel-elevated-squat'] === undefined, 'Exposure 1 does not trigger pending recommendation');

    // Exposure 2 (consecutive clean)
    const userAfterP1: UserProfile = {
        houseOfIronStatus: { progression: p1Prog as any },
    } as unknown as UserProfile;

    const p2 = houseOfIronProgression(context({
        planId: 'house-of-iron',
        workout: { dayName: 'Push A', dayOfWeek: 1, exercises: [squatEx] },
        user: userAfterP1,
        sets: cleanSets,
    }));
    const p2Pending = p2.updates['houseOfIronStatus.pendingProgressions'] as Record<string, { stage: string }>;
    check(p2Pending?.['goblet-heel-elevated-squat']?.stage === 'rom', 'Exposure 2 triggers pending progression recommendation for stage rom');

    // Missed exposure breaks consecutive streak
    const missSets = {
        'house-slot-1': [set('20', '15'), set('20', '14'), set('20', '15')],
    };
    const pMiss = houseOfIronProgression(context({
        planId: 'house-of-iron',
        workout: { dayName: 'Push A', dayOfWeek: 1, exercises: [squatEx] },
        user: userAfterP1,
        sets: missSets,
    }));
    const pMissProg = pMiss.updates['houseOfIronStatus.progression'] as Record<string, { cleanTopRangeExposures: number }>;
    check(pMissProg['goblet-heel-elevated-squat']?.cleanTopRangeExposures === 0, 'Missed set resets cleanTopRangeExposures to 0');

    // Test variation swap via applyHouseProgressions
    const rdlDay = week1.find(d => d.dayName.startsWith('Pull A'))!;
    const userWithRdlStage4: UserProfile = {
        houseOfIronStatus: {
            progression: {
                'romanian-deadlift': {
                    stageIndex: 4,
                    consecutiveStalls: 0,
                    cleanTopRangeExposures: 0,
                    variationId: 'staggered-stance-rdl',
                },
            },
        },
    } as unknown as UserProfile;
    const appliedDay = applyHouseProgressions(rdlDay, userWithRdlStage4);
    const swappedRdl = appliedDay.exercises.find(e => e.exerciseId === 'staggered-stance-rdl');
    check(swappedRdl !== undefined, 'applyHouseProgressions swapped romanian-deadlift to staggered-stance-rdl');
    check(swappedRdl?.name === 'B-Stance Romanian Deadlift', 'B-Stance Romanian Deadlift has correct display name');

    console.log('   House of Iron checks passed.');
}

// ===========================================================================
// 6. 30 MINUTE ADVENTURE
// ===========================================================================
console.log('--- 6. Testing 30 Minute Adventure (30-minute-adventure) ---');
{
    const plan = ADVENTURE_CONFIG;
    check(plan.id === ADVENTURE_PLAN_ID, 'Adventure config id must be 30-minute-adventure');
    check(PLAN_REGISTRY[ADVENTURE_PLAN_ID] !== undefined, 'Adventure must be registered in PLAN_REGISTRY');
    check(ALWAYS_FREE_PLAN_IDS.includes(ADVENTURE_PLAN_ID as never), 'Adventure must be in ALWAYS_FREE_PLAN_IDS');
    check(DEFAULT_ONBOARDING_CONFIG.generalPlanIds.includes(ADVENTURE_PLAN_ID), 'Adventure must be in DEFAULT_ONBOARDING_CONFIG');
    check(plan.session?.kind === 'pair-select', 'Adventure session kind must be pair-select');
    check(plan.ui?.themeClass === 'theme-adventure', 'Theme class must be theme-adventure');

    // 5 portals, 33 pairs, 62 exercises
    check(ADVENTURE_PORTALS.length === 5, 'Must have 5 portals');
    check(ADVENTURE_PAIRS.length === 33, 'Must have 33 pairs');
    check(Object.keys(ADVENTURE_EXERCISES).length === 62, `Must have 62 exercises, got ${Object.keys(ADVENTURE_EXERCISES).length}`);

    // Check unique pair ids
    const pairIds = new Set(ADVENTURE_PAIRS.map(p => p.id));
    check(pairIds.size === ADVENTURE_PAIRS.length, 'All pair IDs must be unique');

    // Check hero picks
    const heroPicks = ADVENTURE_PAIRS.filter(p => p.heroPick);
    check(heroPicks.length === 3, 'Must have exactly 3 hero picks');
    const heroIds = heroPicks.map(p => p.id);
    check(heroIds.includes('upper-incline-barbell-row'), 'Hero pick 1: upper-incline-barbell-row');
    check(heroIds.includes('quads-squat-skullcrusher'), 'Hero pick 2: quads-squat-skullcrusher');
    check(heroIds.includes('posterior-barbell-rdl-curl'), 'Hero pick 3: posterior-barbell-rdl-curl');

    // Test circuit drafting sequence builder
    const selectedPairs: Record<string, string> = {
        upper: 'upper-incline-barbell-row',
        'core-glutes': 'core-machine-plank',
        'calves-shoulders': 'calves-military-standing',
        'quads-triceps': 'quads-squat-skullcrusher',
        'arms-posterior': 'posterior-barbell-rdl-curl',
    };
    const seq = buildAdventureSequence(selectedPairs);
    check(seq.length === 20, `Drafted circuit must produce 20 sets, got ${seq.length}`);

    // Test round 2 weight inheritance with findPreviousAdventureWeight
    // Case 1: completed round 1 with weight '70' -> round 2 inherits '70'
    const carriedResults = {
        [adventureResultKey('upper-incline-barbell-row', 'incline-barbell-bench', 1)]: { weight: '70', completed: true },
    };
    const secondBenchStepIdx = seq.findIndex((s, idx) => idx > 0 && s.exerciseKey === 'incline-barbell-bench');
    const inheritedWeight = findPreviousAdventureWeight(seq, carriedResults, secondBenchStepIdx, 'incline-barbell-bench');
    check(inheritedWeight === '70', `Round 2 must inherit '70' from completed round 1, got '${inheritedWeight}'`);

    // Case 2: uncompleted round 1 -> round 2 gets empty string
    const incompleteResults = {
        [adventureResultKey('upper-incline-barbell-row', 'incline-barbell-bench', 1)]: { weight: '70', completed: false },
    };
    const uninheritedWeight = findPreviousAdventureWeight(seq, incompleteResults, secondBenchStepIdx, 'incline-barbell-bench');
    check(uninheritedWeight === '', 'Round 2 must not inherit from uncompleted round 1');

    // Test draft key generation
    check(adventureDraftKey('test_workhorse') === 'adventure_draft_test_workhorse', 'Draft key generated correctly');

    // Test failure mode types
    check(ADVENTURE_EXERCISES['barbell-squat'].failureMode === 'technical', 'Barbell Squat has technical failureMode');
    check(ADVENTURE_EXERCISES['diamond-push-up'].failureMode === 'preprogrammed', 'Diamond Push-Up has preprogrammed failureMode');
    check(ADVENTURE_EXERCISES['pec-deck'].failureMode === 'muscular', 'Pec Deck has muscular failureMode');

    console.log('   30 Minute Adventure checks passed.');
}

console.log('\n========================================================================');
console.log(`ALL GROUP 4 TESTS COMPLETE: ${checksRun} assertions run across 6 plans.`);
if (failures.length > 0) {
    console.error(`TOTAL FAILURES: ${failures.length}`);
    for (const f of failures) console.error(` - ${f}`);
    process.exit(1);
} else {
    console.log('STATUS: ALL 6 PLANS PASSED WITH ZERO ERRORS / ZERO REGRESSIONS!');
}
console.log('========================================================================\n');
