/**
 * scripts/simulate-group5-workhorse.ts
 *
 * Full lifecycle and workout progression simulation for persona 'test_workhorse'
 * across Group 5 plans:
 * 1. REDLINE
 * 2. Iron Clock
 * 3. The Minimum
 * 4. Lazarus
 * 5. Blackout
 * 6. Monolith
 */

import assert from 'node:assert/strict';
import type { UserProfile, WorkoutDay, IronClockBlockRecord, MinimumStatus, LazarusStatus } from '../src/types';

// 1. REDLINE imports
import { REDLINE_CONFIG, REDLINE_DAYS } from '../src/data/plans/redline';

// 2. Iron Clock imports
import {
    IRON_CLOCK_CONFIG, IRON_CLOCK_FOUR_DAY, IRON_CLOCK_THREE_DAY,
    IRON_CLOCK_WINDOWS, IRON_CLOCK_MIN_WINDOWS, IRON_CLOCK_MAX_ROUNDS, effectiveIronClockMode,
} from '../src/data/plans/ironClock';
import {
    advanceDensityBlock, blockDensity, compareBlocks, restWarning, startingState,
    type DensityBlockConfig,
} from '../src/features/ironClock/progression';

// 3. The Minimum imports
import { THE_MINIMUM_CONFIG, MINIMUM_DAYS } from '../src/data/plans/theMinimum';
import { BONUS_MODULES, bonusContribution, recommendBonus } from '../src/features/theMinimum/bonus';
import { EXERCISE_BY_ID, EXERCISE_LIBRARY } from '../src/data/exercises/library';

// 4. Lazarus imports
import { LAZARUS_CONFIG, LAZARUS_DAYS } from '../src/data/plans/lazarus';
import {
    detrainingFactor, injuryReturnGuidance, openingLoad, shouldAccelerate, weekSetCap, capIsHard,
} from '../src/features/lazarus/memoryCurve';

// 5. Blackout imports
import { BLACKOUT_CONFIG, BLACKOUT_DAYS } from '../src/data/plans/blackout';
import {
    BLACKOUT_STALL_LADDER, advanceStall, earnedBackoff, failureAllowed, isEvaluable, nextExposureAdvice,
    type PrimarySetResult,
} from '../src/features/blackout/singleSet';

// 6. Monolith imports
import { MONOLITH_CONFIG, MONOLITH_DAYS, DISTANT_PAIRS } from '../src/data/plans/monolith';

let totalAssertions = 0;
const testPassed = (plan: string, count: number) => {
    console.log(`[PASS] ${plan}: ${count} simulation assertions passed.`);
};

// Base persona 'test_workhorse'
const createTestWorkhorse = (overrides: Partial<UserProfile> = {}): UserProfile => ({
    id: 'test_workhorse',
    name: 'Test Workhorse',
    email: 'test_workhorse@gym.internal',
    startDate: '2026-08-01',
    planPreferences: {},
    workoutHistory: [],
    prs: {},
    equipment: ['barbell', 'dumbbell', 'cable', 'machine', 'smith', 'hammer-strength', 'pec-deck', 'leg-extension', 'leg-curl', 'hack-squat'],
    ...overrides,
} as unknown as UserProfile);

console.log('=== SIMULATING GROUP 5: TIME-CAPPED, DENSITY, MINIMALIST & MACHINE FOCUS ===\n');

// ============================================================================
// 1. REDLINE SIMULATION
// ============================================================================
{
    let count = 0;
    const ok = (v: unknown, msg: string) => { assert.ok(v, msg); count++; totalAssertions++; };

    const workhorse = createTestWorkhorse({
        currentProgramId: 'redline',
        planPreferences: {
            redline: {
                scheduleMode: '4day',
                updatedAt: new Date().toISOString(),
                exerciseSelections: { furnaceAnchor: 'paused-bench-press' },
            },
        },
    });

    // Test Week Finisher Windows
    for (let w = 1; w <= 8; w++) {
        const week = REDLINE_CONFIG.program.weeks[w - 1];
        const trainingDays = week.days.filter(d => d.exercises.length > 0);
        ok(trainingDays.length === 4, `Week ${w} has 4 training days`);
        const day1 = week.days.find(d => d.dayOfWeek === 1)!;
        const finisher = day1.exercises.find(e => e.prescription?.block?.kind === 'finisher');
        ok(finisher, `Week ${w} day 1 has timed finisher`);
        const expectedDuration = w <= 2 ? 300 : w <= 4 ? 360 : w === 5 ? 420 : w <= 7 ? 480 : 300;
        ok(finisher?.prescription?.block?.durationSeconds === expectedDuration, `Week ${w} finisher duration is ${expectedDuration}s`);
    }

    // Furnace Anchor selection preference simulation
    const furnaceDay = REDLINE_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 4)!;
    const processedBench = REDLINE_CONFIG.hooks!.preprocessDay!(furnaceDay, workhorse);
    ok(processedBench.exercises[0].exerciseId === 'paused-bench-press', 'Furnace defaults to Paused Bench');

    const workhorseOHP = createTestWorkhorse({
        planPreferences: {
            redline: {
                scheduleMode: '4day',
                updatedAt: new Date().toISOString(),
                exerciseSelections: { furnaceAnchor: 'standing-barbell-military-press' },
            },
        },
    });
    const processedOHP = REDLINE_CONFIG.hooks!.preprocessDay!(furnaceDay, workhorseOHP);
    ok(processedOHP.exercises[0].exerciseId === 'standing-barbell-military-press', 'Furnace switches to OHP');

    // Recovery check lifecycle simulation
    const day1 = REDLINE_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!;

    // 1) Recovered: no reduction
    const workhorseRecovered = createTestWorkhorse({
        redlineStatus: { nextRecovery: { response: 'recovered', confirmed: true, recordedAt: new Date().toISOString() } },
    });
    const pRecovered = REDLINE_CONFIG.hooks!.preprocessDay!(day1, workhorseRecovered);
    const baselineBurnSets = pRecovered.exercises.filter(e => e.prescription?.block?.kind === 'burn').reduce((n, e) => n + e.sets, 0);
    ok(baselineBurnSets === 10, 'Baseline burn sets is 10');

    // 2) Somewhat Fatigued: burn volume reduced to 85%, finisher kept
    const workhorseFatigued = createTestWorkhorse({
        redlineStatus: { nextRecovery: { response: 'somewhat-fatigued', confirmed: true, recordedAt: new Date().toISOString() } },
    });
    const pFatigued = REDLINE_CONFIG.hooks!.preprocessDay!(day1, workhorseFatigued);
    const fatiguedBurnSets = pFatigued.exercises.filter(e => e.prescription?.block?.kind === 'burn').reduce((n, e) => n + e.sets, 0);
    ok(fatiguedBurnSets < baselineBurnSets, 'Fatigued burns sets trimmed');
    ok(pFatigued.exercises.some(e => e.prescription?.block?.kind === 'finisher'), 'Fatigued retains finisher');
    ok(pFatigued.exercises[0].sets === 3, 'Anchor sets preserved');

    // 3) Performance Impaired: burn volume reduced to 70%, finisher dropped, anchor kept!
    const workhorseImpaired = createTestWorkhorse({
        redlineStatus: { nextRecovery: { response: 'performance-impaired', confirmed: true, recordedAt: new Date().toISOString() } },
    });
    const pImpaired = REDLINE_CONFIG.hooks!.preprocessDay!(day1, workhorseImpaired);
    const impairedBurnSets = pImpaired.exercises.filter(e => e.prescription?.block?.kind === 'burn').reduce((n, e) => n + e.sets, 0);
    ok(impairedBurnSets < fatiguedBurnSets, 'Impaired trims burn sets more');
    ok(!pImpaired.exercises.some(e => e.prescription?.block?.kind === 'finisher'), 'Impaired drops finishers');
    ok(pImpaired.exercises[0].sets === 3, 'Anchor sets preserved during impairment');

    // 4) Unconfirmed report changes nothing
    const workhorseUnconfirmed = createTestWorkhorse({
        redlineStatus: { nextRecovery: { response: 'performance-impaired', confirmed: false, recordedAt: new Date().toISOString() } },
    });
    const pUnconfirmed = REDLINE_CONFIG.hooks!.preprocessDay!(day1, workhorseUnconfirmed);
    ok(pUnconfirmed.exercises.length === pRecovered.exercises.length, 'Unconfirmed report changes nothing');

    // Week 8 (Ashes) volume reduction test
    const w7Day1 = REDLINE_CONFIG.program.weeks[6].days.find(d => d.dayOfWeek === 1)!;
    const w8Day1 = REDLINE_CONFIG.program.weeks[7].days.find(d => d.dayOfWeek === 1)!;
    const w7Burn = w7Day1.exercises.filter(e => e.prescription?.block?.kind === 'burn').reduce((n, e) => n + e.sets, 0);
    const w8Burn = w8Day1.exercises.filter(e => e.prescription?.block?.kind === 'burn').reduce((n, e) => n + e.sets, 0);
    ok(w8Burn < w7Burn, 'Week 8 Ashes trims burn sets');
    ok(w8Day1.exercises[0].sets === 3, 'Week 8 retains anchor volume');

    testPassed('REDLINE', count);
}

// ============================================================================
// 2. IRON CLOCK SIMULATION
// ============================================================================
{
    let count = 0;
    const ok = (v: unknown, msg: string) => { assert.ok(v, msg); count++; totalAssertions++; };

    const workhorse = createTestWorkhorse({
        currentProgramId: 'iron-clock',
        startDate: '2026-08-01',
    });

    // Schedule modes
    ok(effectiveIronClockMode(workhorse) === '4day', 'Default mode is 4day');
    const workhorse3Day = createTestWorkhorse({
        startDate: '2026-08-01',
        planPreferences: { 'iron-clock': { scheduleMode: '3day', exerciseSelections: {}, updatedAt: '' } },
    });
    ok(effectiveIronClockMode(workhorse3Day) === '3day', 'Honors 3day mode');

    // Density Ladder lifecycle simulation
    const blockConfig: DensityBlockConfig = {
        blockId: 'bell-1-a',
        baseDurationSeconds: IRON_CLOCK_WINDOWS.a, // 600
        minDurationSeconds: IRON_CLOCK_MIN_WINDOWS.a, // 420
        baseRounds: 4,
        maxRounds: IRON_CLOCK_MAX_ROUNDS, // 6
        loadIncrementKg: 2.5,
    };

    let state = startingState(blockConfig, 30);
    ok(state.durationSeconds === 600 && state.targetRounds === 4 && state.loadKg === 30, 'Initial state: 600s, 4 rounds, 30kg');

    // Simulate Session 1: Clean 4 rounds -> Reps step (targetRounds = 5)
    let advance = advanceDensityBlock(state, { completedRounds: 4, quality: 'clean' }, blockConfig);
    ok(advance.step === 'reps' && advance.state.targetRounds === 5 && advance.state.durationSeconds === 600, 'Session 1: +1 round -> 5');
    state = advance.state;

    // Simulate Session 2: Clean 5 rounds -> Reps step (targetRounds = 6 = maxRounds)
    advance = advanceDensityBlock(state, { completedRounds: 5, quality: 'clean' }, blockConfig);
    ok(advance.step === 'reps' && advance.state.targetRounds === 6 && advance.state.durationSeconds === 600, 'Session 2: +1 round -> 6 (max)');
    state = advance.state;

    // Simulate Session 3: Clean 6 rounds -> Time compression step (-60s -> 540s)
    advance = advanceDensityBlock(state, { completedRounds: 6, quality: 'clean' }, blockConfig);
    ok(advance.step === 'time' && advance.state.durationSeconds === 540 && advance.state.targetRounds === 6, 'Session 3: -60s -> 540s');
    state = advance.state;

    // Simulate Session 4: Clean 6 rounds in 540s -> Time compression step (-60s -> 480s)
    advance = advanceDensityBlock(state, { completedRounds: 6, quality: 'clean' }, blockConfig);
    ok(advance.step === 'time' && advance.state.durationSeconds === 480, 'Session 4: -60s -> 480s');
    state = advance.state;

    // Simulate Session 5: Clean 6 rounds in 480s -> Time compression step (-60s -> 420s = floor)
    advance = advanceDensityBlock(state, { completedRounds: 6, quality: 'clean' }, blockConfig);
    ok(advance.step === 'time' && advance.state.durationSeconds === 420, 'Session 5: -60s -> 420s (min floor)');
    state = advance.state;

    // Simulate Session 6: Clean 6 rounds at floor 420s -> Load step (+2.5kg, reset window to 600s, reset rounds to 4)
    advance = advanceDensityBlock(state, { completedRounds: 6, quality: 'clean' }, blockConfig);
    ok(advance.step === 'load' && advance.state.loadKg === 32.5, 'Session 6: +2.5kg load increase');
    ok(advance.state.durationSeconds === 600 && advance.state.targetRounds === 4, 'Session 6: Reset to 600s and 4 rounds');
    ok(advance.requiresConfirmation === true, 'Session 6: Load increase requires confirmation');

    // Quality gates simulation
    const holdState = startingState(blockConfig, 32.5);
    // Unmet rounds
    const unmet = advanceDensityBlock(holdState, { completedRounds: 3, quality: 'clean' }, blockConfig);
    ok(unmet.state.targetRounds === 4 && unmet.reason.includes('not completed'), 'Unmet rounds holds state');
    // Borderline quality
    const border = advanceDensityBlock(holdState, { completedRounds: 4, quality: 'borderline' }, blockConfig);
    ok(border.state.targetRounds === 4 && border.reason.includes('Borderline'), 'Borderline rounds holds state');
    // Invalid quality
    const invalid = advanceDensityBlock(holdState, { completedRounds: 6, quality: 'invalid' }, blockConfig);
    ok(invalid.state.targetRounds === 4 && invalid.reason.includes('invalid'), 'Invalid rounds holds state');

    // Comparability & Density metric
    const rec1: IronClockBlockRecord = {
        blockId: 'bell-1-a', week: 1, durationSeconds: 600, rounds: 4, reps: 40, loadKg: 30,
        quality: 'clean', lineage: ['incline-dumbbell-bench-press', 'single-arm-hammer-row'], date: '2026-08-01',
    };
    const rec2: IronClockBlockRecord = { ...rec1, week: 2, rounds: 5, reps: 50 };
    const recCompressed: IronClockBlockRecord = { ...rec1, durationSeconds: 540 };
    const recSubbed: IronClockBlockRecord = { ...rec1, lineage: ['incline-dumbbell-bench-press', 'seated-cable-row'] };
    const recReplaced: IronClockBlockRecord = { ...rec1, lineage: ['leg-extension', 'lat-prayer'] };

    ok(compareBlocks(rec1, rec2) === 'strict', 'Strict comparability on identical movements & load/duration');
    ok(compareBlocks(rec1, recCompressed) === 'adapted', 'Adapted comparability on compressed window');
    ok(compareBlocks(rec1, recSubbed) === 'adapted', 'Adapted comparability on single exercise substitution');
    ok(compareBlocks(rec1, recReplaced) === 'incomparable', 'Incomparable on full block rebuild');

    ok(blockDensity(rec1) === 120, 'Block density calculation: (40 reps * 30 kg) / 10 min = 120 kg/min');
    ok(blockDensity({ ...rec1, quality: 'invalid' }) === 0, 'Invalid rounds density is 0');

    // Rest warnings
    ok(restWarning(60) === undefined, '60s rest passes without warning');
    ok(restWarning(120)?.includes('still counts'), '120s rest warns but does not invalidate');

    testPassed('Iron Clock', count);
}

// ============================================================================
// 3. THE MINIMUM SIMULATION
// ============================================================================
{
    let count = 0;
    const ok = (v: unknown, msg: string) => { assert.ok(v, msg); count++; totalAssertions++; };

    const workhorse = createTestWorkhorse({
        currentProgramId: 'the-minimum',
    });

    ok(THE_MINIMUM_CONFIG.program.weeks.length === 10, '10 weeks total');
    ok(MINIMUM_DAYS.length === 2, 'Exactly 2 mandatory sessions');

    // Structure & movement independence
    const sessionA = MINIMUM_DAYS[0];
    const sessionB = MINIMUM_DAYS[1];
    ok(sessionA.slots.reduce((n, s) => n + s.sets, 0) === 14, 'Session A has 14 sets');
    const bSets = sessionB.slots.reduce((n, s) => n + s.sets, 0);
    ok(bSets >= 14 && bSets <= 16, `Session B holds 14-16 sets (has ${bSets})`);

    const movementsA = new Set(sessionA.slots.map(s => s.ex));
    ok(!sessionB.slots.some(s => movementsA.has(s.ex)), 'No duplicate movements between Session A and B');

    // Phase checks
    const w1Slots = THE_MINIMUM_CONFIG.program.weeks[0].days.flatMap(d => d.exercises);
    const w8Slots = THE_MINIMUM_CONFIG.program.weeks[7].days.flatMap(d => d.exercises);
    const w1Sets = w1Slots.reduce((n, e) => n + e.sets, 0);
    const w8Sets = w8Slots.reduce((n, e) => n + e.sets, 0);
    ok(w1Sets === w8Sets, 'Volume does not change across phases');
    ok(w8Slots.some(e => e.target.rpe === 9), 'Week 8 Press phase raises RPE to 9');

    // Bonus module recommendations
    // 1) Underexposure: posterior muscles (hamstrings=0, glutes=0)
    const minStatus: MinimumStatus = {
        exposure: { lats: 10, biceps: 10, chest: 10, frontDelt: 10, triceps: 10, hamstrings: 0, glutes: 0, quads: 10, calves: 10, abs: 10, sideDelt: 10 },
        bonusSessions: [],
    };
    const rec = recommendBonus(minStatus, 1);
    ok(rec.module?.id === 'posterior', 'Posterior module recommended for underexposed hamstrings/glutes');
    ok(rec.discouraged === false, 'Bonus not discouraged');

    // 2) Performance decline discouragement
    const declinedStatus: MinimumStatus = {
        ...minStatus,
        lastDecline: { week: 2, exerciseId: 'hack-squat' },
    };
    const recDeclined = recommendBonus(declinedStatus, 2);
    ok(recDeclined.discouraged === true, 'Performance decline flags discouraged');
    ok(recDeclined.message.includes('still allowed'), 'Discouragement is non-blocking advice');

    // 3) Second bonus in same week
    const secondBonusStatus: MinimumStatus = {
        ...minStatus,
        bonusSessions: [{ moduleId: 'posterior', date: '2026-08-03', week: 3 }],
    };
    const recSecond = recommendBonus(secondBonusStatus, 3);
    ok(recSecond.discouraged === true && recSecond.message.includes('not a cap'), 'Second bonus discouraged but not capped');

    // 4) Contribution rules
    const contrib = bonusContribution();
    ok(contrib.weeklyVolume === true && contrib.performanceProfile === true && contrib.workoutHistory === true, 'Bonus counts for volume/profile/history');
    ok(contrib.planProgression === false, 'Bonus NEVER counts for plan progression');

    // Preprocess hook
    const day = THE_MINIMUM_CONFIG.program.weeks[0].days[0];
    const processed = THE_MINIMUM_CONFIG.hooks!.preprocessDay!(day, createTestWorkhorse({ minimumStatus: secondBonusStatus }));
    ok(processed.exercises.length === day.exercises.length, 'PreprocessDay preserves required workout structure');

    testPassed('The Minimum', count);
}

// ============================================================================
// 4. LAZARUS SIMULATION
// ============================================================================
{
    let count = 0;
    const ok = (v: unknown, msg: string) => { assert.ok(v, msg); count++; totalAssertions++; };

    // Detraining curve
    ok(detrainingFactor(2) === 0.9, '<3 months: 90%');
    ok(detrainingFactor(4) === 0.8, '<6 months: 80%');
    ok(detrainingFactor(8) === 0.7, '<12 months: 70%');
    ok(detrainingFactor(14) === 0.6, '>=12 months: 60%');
    ok(detrainingFactor(36) === 0.6, '36 months: 60% flat cap');

    // Memory Curve load calculation
    const profileMemory = { lifetimeBestKg: 140, preBreakKg: 100, source: 'profile' as const };
    const opProfile = openingLoad(profileMemory, 4); // 80% of 100kg = 80kg
    ok(opProfile.openingKg === 80, 'Opening load is 80kg (80% of 100kg preBreakKg)');
    ok(opProfile.requiresCalibration === false, 'Profile memory needs no calibration');

    const selfReportedMemory = { lifetimeBestKg: 140, preBreakKg: 100, source: 'self-reported' as const };
    const opSelf = openingLoad(selfReportedMemory, 4);
    ok(opSelf.openingKg === 80, 'Self reported opening load is 80kg');
    ok(opSelf.requiresCalibration === true, 'Self reported memory requires calibration');

    const indirectOp = openingLoad(profileMemory, 4, 'same-pattern');
    ok(indirectOp.openingKg === 67.5, 'Indirect distance: 100 * 0.8 * 0.85 = 68 -> rounded to 67.5kg');
    ok(indirectOp.requiresCalibration === true, 'Indirect distance requires calibration');

    // Week 1-2 volume caps
    ok(capIsHard(1) && capIsHard(2) && !capIsHard(3), 'Hard cap in weeks 1 and 2 only');
    ok(weekSetCap(1, 3) === 2, 'Week 1 caps 3 sets to 2');
    ok(weekSetCap(3, 3) === 3, 'Week 3 restores 3 sets');

    // Preprocess hook enforces cap regardless of user readiness
    const workhorseReady = createTestWorkhorse({
        lazarusStatus: {
            breakMonths: 6,
            underestimated: [{ week: 1, date: '2026-08-01' }, { week: 2, date: '2026-08-03' }],
            memoryCurve: { 'hack-squat': { lifetimeBestKg: 160, preBreakKg: 120, source: 'profile' } },
        },
    });
    const w1Day1 = LAZARUS_CONFIG.program.weeks[0].days[0];
    const pW1 = LAZARUS_CONFIG.hooks!.preprocessDay!(w1Day1, workhorseReady);
    ok(pW1.exercises.every(e => e.sets <= 2), 'Week 1 sets capped to <= 2');
    ok(pW1.exercises.every(e => e.target.rpe === 7), 'Week 1 RPE is 7');

    // Acceleration rules
    ok(shouldAccelerate(workhorseReady.lazarusStatus, 1).accelerate === false, 'Week 1 never accelerates');
    ok(shouldAccelerate(workhorseReady.lazarusStatus, 2).accelerate === false, 'Week 2 never accelerates');

    const acceleratedStatus: LazarusStatus = {
        breakMonths: 6,
        underestimated: [{ week: 3, date: '2026-08-15' }, { week: 4, date: '2026-08-18' }],
    };
    ok(shouldAccelerate(acceleratedStatus, 4).accelerate === true, 'Week 4 accelerates after 2 underestimated sessions');

    // CalculateWeight hook simulation (for breakMonths: 6 -> 70% of 120kg = 84kg -> 85kg)
    const target = { rpe: 7, reps: '8-12' };
    const weightPrescribed = LAZARUS_CONFIG.hooks!.calculateWeight!(target, workhorseReady, 'Hack Squat', { week: 1, dayIndex: 0, exerciseIndex: 0 });
    ok(weightPrescribed === '85', `Memory curve calculates Hack Squat opening weight for 6mo break as 85kg (got ${weightPrescribed})`);

    // For breakMonths: 4 -> 80% of 120kg = 96kg -> 95kg
    const workhorse4Mo = createTestWorkhorse({
        lazarusStatus: {
            breakMonths: 4,
            memoryCurve: { 'hack-squat': { lifetimeBestKg: 160, preBreakKg: 120, source: 'profile' } },
        },
    });
    const weight4Mo = LAZARUS_CONFIG.hooks!.calculateWeight!(target, workhorse4Mo, 'Hack Squat', { week: 1, dayIndex: 0, exerciseIndex: 0 });
    ok(weight4Mo === '95', `Memory curve calculates Hack Squat opening weight for 4mo break as 95kg (got ${weight4Mo})`);

    // Injury return guidance
    const injGuidance = injuryReturnGuidance(14);
    ok(injGuidance.heading.includes('not rehabilitation'), 'Injury copy disclaims rehab');
    ok(injGuidance.suggestion === 'apex-predator', 'Long injury break suggests Apex Predator');

    testPassed('Lazarus', count);
}

// ============================================================================
// 5. BLACKOUT SIMULATION
// ============================================================================
{
    let count = 0;
    const ok = (v: unknown, msg: string) => { assert.ok(v, msg); count++; totalAssertions++; };

    const workhorse = createTestWorkhorse({
        currentProgramId: 'blackout',
    });

    ok(BLACKOUT_CONFIG.program.weeks.length === 8, '8 weeks duration');
    ok(BLACKOUT_DAYS.length === 3, '3 full-body days');

    // Single work set guarantee across entire program
    for (const week of BLACKOUT_CONFIG.program.weeks) {
        for (const day of week.days) {
            ok(day.exercises.every(e => e.sets === 1), `Week ${week.weekNumber} day ${day.dayOfWeek} strictly 1 set`);
        }
    }

    // Preprocess enforcement & failure notes
    const d1 = BLACKOUT_CONFIG.program.weeks[0].days[0];
    const processedD1 = BLACKOUT_CONFIG.hooks!.preprocessDay!(d1, workhorse);
    ok(processedD1.exercises.every(e => e.sets === 1), 'Preprocessed day strictly 1 set');

    const hackSquat = processedD1.exercises.find(e => e.exerciseId === 'hack-squat')!;
    const legExt = processedD1.exercises.find(e => e.exerciseId === 'leg-extension')!;
    ok(hackSquat.notes?.includes('not approved for failure'), 'Hack squat not approved for failure');
    ok(legExt.notes?.includes('muscular failure is approved'), 'Leg extension approved for failure');

    // Set evaluation & earned back-off mechanics
    const baseSet: PrimarySetResult = {
        reps: 8,
        targetReps: [6, 10],
        loadKg: 100,
        quality: 'clean',
        completionReason: 'target-completed',
    };
    ok(isEvaluable(baseSet), 'Valid set is evaluable');
    ok(!isEvaluable({ ...baseSet, quality: undefined }), 'Missing quality is not evaluable');
    ok(!isEvaluable({ ...baseSet, completionReason: undefined }), 'Missing completion reason is not evaluable');

    // 1) Clean + Recovered -> Earned Backoff
    const boClean = earnedBackoff(baseSet, 'recovered');
    ok(boClean.offered === true && boClean.sets === 1 && boClean.percent === 10, 'Clean set earns 1 back-off set at -10%');

    // 2) Borderline -> No Backoff
    const boBorder = earnedBackoff({ ...baseSet, quality: 'borderline' }, 'recovered');
    ok(boBorder.offered === false, 'Borderline set earns no back-off');

    // 3) Technical failure -> No Backoff
    const boTechFail = earnedBackoff({ ...baseSet, completionReason: 'technical-failure' }, 'recovered');
    ok(boTechFail.offered === false, 'Technical failure earns no back-off');

    // 4) Pain stop -> No Backoff
    const boPain = earnedBackoff({ ...baseSet, completionReason: 'pain' }, 'recovered');
    ok(boPain.offered === false, 'Pain stop earns no back-off');

    // 5) Missed target reps -> No Backoff
    const boMissed = earnedBackoff({ ...baseSet, reps: 4 }, 'recovered');
    ok(boMissed.offered === false, 'Missed target earns no back-off');

    // 6) Poor recovery -> No Backoff
    const boFatigued = earnedBackoff(baseSet, 'somewhat-fatigued');
    ok(boFatigued.offered === false, 'Poor recovery earns no back-off');

    // Stall ladder simulation
    let stallState = { stageIndex: 0, consecutiveStalls: 0 };
    const expectedStages = ['repeat', 'rep-target', 'exercise-change', 'add-set', 'add-set'];
    for (let i = 0; i < expectedStages.length; i++) {
        const resp = advanceStall(stallState, false);
        ok(resp.stage === expectedStages[i], `Stall iteration ${i + 1} climbs to ${expectedStages[i]}`);
        if (resp.stage === 'exercise-change' || resp.stage === 'add-set') {
            ok(resp.requiresConfirmation === true, `${resp.stage} requires user confirmation`);
        }
        stallState = resp.state;
    }
    // Progression resets stall ladder
    const resetResp = advanceStall(stallState, true);
    ok(resetResp.state.stageIndex === 0 && resetResp.stage === 'recovery-check', 'Progress resets stall ladder');

    // Recovery advice
    const rAdv = nextExposureAdvice('performance-impaired');
    ok(rAdv.recommendedRestDays === 3 && rAdv.blocks === false, 'Impaired recovery recommends 3 days rest without blocking');

    testPassed('Blackout', count);
}

// ============================================================================
// 6. MONOLITH SIMULATION
// ============================================================================
{
    let count = 0;
    const ok = (v: unknown, msg: string) => { assert.ok(v, msg); count++; totalAssertions++; };

    const workhorse = createTestWorkhorse({
        currentProgramId: 'monolith',
    });

    ok(MONOLITH_CONFIG.program.weeks.length === 10, '10 weeks duration');
    ok(MONOLITH_DAYS.length === 4, '4-day upper/lower split');

    // Structure checks
    const allSlots = MONOLITH_DAYS.flatMap(d => d.slots);
    const machineKeywords = ['machine', 'hammer-strength', 'pec-deck', 'leg-extension', 'leg-curl', 'rear-delt-machine', 'hack-squat', 'smith', 'cable'];
    const machineCount = allSlots.filter(s => EXERCISE_BY_ID[s.ex]?.equipment.some(eq => machineKeywords.includes(eq))).length;
    const machineRatio = machineCount / allSlots.length;
    ok(machineRatio >= 0.7, `Machine dominant (>=70%): actual ${(machineRatio * 100).toFixed(1)}%`);
    ok(machineCount < allSlots.length, 'Free weights are included');

    for (const day of MONOLITH_DAYS) {
        const systemicCount = day.slots.filter(s => s.systemicCompound).length;
        ok(systemicCount <= 1, `${day.name} has at most 1 systemic compound`);
        const totalSets = day.slots.reduce((n, s) => n + s.sets, 0);
        ok(totalSets >= 19 && totalSets <= 21, `${day.name} has 19-21 sets (actual: ${totalSets})`);
    }

    // Phase progression simulation: Placement (w1-3) -> Pressure (w4-6) -> Weight of It (w7-9) -> Settling (w10)
    // 1) Week 2: Placement - no RPE, no technique
    const w2Exercises = MONOLITH_CONFIG.program.weeks[1].days.flatMap(d => d.exercises);
    ok(w2Exercises.every(e => !e.target.rpe && !e.prescription?.technique), 'Week 2 has no RPE and no drop sets');

    // 2) Week 5: Pressure - RPE 9 on non-systemic, no drop sets yet
    const w5Exercises = MONOLITH_CONFIG.program.weeks[4].days.flatMap(d => d.exercises);
    ok(w5Exercises.filter(e => e.target.rpe === 9).length > 0, 'Week 5 introduces RPE 9');
    ok(w5Exercises.every(e => !e.prescription?.technique), 'Week 5 has no drop sets yet');

    // 3) Week 8: Weight of It - drop sets on technique-safe machines only!
    const w8Exercises = MONOLITH_CONFIG.program.weeks[7].days.flatMap(d => d.exercises);
    const dropSetExercises = w8Exercises.filter(e => e.prescription?.technique?.kind === 'drop-set');
    ok(dropSetExercises.length > 0, 'Week 8 introduces drop sets');
    for (const dse of dropSetExercises) {
        const entry = EXERCISE_BY_ID[dse.exerciseId ?? ''];
        ok(entry, 'Exercise exists');
        const eq = entry.equipment ?? [];
        ok(eq.some(item => machineKeywords.includes(item)), `${dse.exerciseId} drop set is on a machine`);
        ok(!eq.includes('barbell') && !eq.includes('dumbbell'), `${dse.exerciseId} drop set never on free weights`);
        ok(dse.prescription?.technique?.dropPercent === 20, 'Drop percent is 20%');
        ok(dse.prescription?.technique?.applyTo === 'last', 'Drop set applies to last set only');
    }

    // 4) Week 10: Settling - volume reduced by 1 set per slot
    const w9Sets = MONOLITH_CONFIG.program.weeks[8].days.flatMap(d => d.exercises).reduce((n, e) => n + e.sets, 0);
    const w10Sets = MONOLITH_CONFIG.program.weeks[9].days.flatMap(d => d.exercises).reduce((n, e) => n + e.sets, 0);
    ok(w10Sets < w9Sets, 'Week 10 Settling reduces set count');

    // Distant pair safety verification
    const d1 = MONOLITH_CONFIG.program.weeks[0].days[0];
    const forcedDistantDay: WorkoutDay = {
        ...d1,
        exercises: [
            ...d1.exercises,
            { ...d1.exercises[0], id: 'pec-deck-forced', exerciseId: 'pec-deck', prescription: { ...d1.exercises[0].prescription, pair: 'A1' } },
            { ...d1.exercises[1], id: 'combo-forced', exerciseId: 'machine-press-fly-combo', prescription: { ...d1.exercises[1].prescription, pair: 'A1' } },
        ],
    };
    const cleanedDay = MONOLITH_CONFIG.hooks!.preprocessDay!(forcedDistantDay, workhorse);
    const pec = cleanedDay.exercises.find(e => e.exerciseId === 'pec-deck');
    const combo = cleanedDay.exercises.find(e => e.exerciseId === 'machine-press-fly-combo');
    ok(pec?.prescription?.pair === undefined, 'Distant pair Pec Deck pair stripped');
    ok(combo?.prescription?.pair === undefined, 'Distant pair Combo Machine pair stripped');

    testPassed('Monolith', count);
}

console.log(`\n================================================================`);
console.log(`ALL GROUP 5 SIMULATION TESTS PASSED: ${totalAssertions} TOTAL ASSERTIONS.`);
console.log(`================================================================\n`);
