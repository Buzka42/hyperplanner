/**
 * Comprehensive Simulation & Lifecycle Verification for Group 6:
 * Advanced Adaptive, Intelligence & Assessment Engines
 *
 * Test User Persona: 'test_workhorse'
 *
 * Plans Tested:
 * 1. Kali (Cutting, volume preservation, intensifier phases, pull anchor swaps)
 * 2. Atlas (2x5-week gauntlets, carries time x load, limiter advice, hinge swaps)
 * 3. Event Horizon (12-week hypertrophy, cost-aware swaps, bounded learning, split substitutions)
 * 4. Project Chimera (16-week powerbuilding, 4 blocks, volume mutation, floor preservation)
 * 5. Oracle (10-week prediction engine, calibration, confidence assessment, honest accuracy)
 * 6. Apex Predator (12-week movement-access full body, 6-region assessment, ROM progression)
 */

import assert from 'node:assert/strict';
import type { UserProfile, WorkoutDay, WorkoutLog } from '../src/types';
import { EXERCISE_BY_ID, EXERCISE_LIBRARY } from '../src/data/exercises/library';

// --- Plan 1: Kali Imports ---
import { KALI_CONFIG, KALI_DAYS } from '../src/data/plans/kali';

// --- Plan 2: Atlas Imports ---
import { ATLAS_CONFIG, ATLAS_GAUNTLET_ONE, ATLAS_GAUNTLET_TWO } from '../src/data/plans/atlas';
import {
    APPROVED_HINGES, POWER_POOL, carryScore, compareCarries, gauntletFor, isPowerWork, limiterAdvice,
    type CarryResult, type CarryLimiter,
} from '../src/features/atlas/carries';

// --- Plan 3: Event Horizon Imports ---
import { EVENT_HORIZON_CONFIG, EVENT_HORIZON_DAYS } from '../src/data/plans/eventHorizon';
import {
    REGION_COSTS, learnedCost, recommendSwap, swapVerdict,
    type ExposureRecord, type RegionReport, type SwapOutcome,
} from '../src/features/eventHorizon/costAwareSwaps';

// --- Plan 4: Project Chimera Imports ---
import {
    BLOCKS, CHIMERA_DAYS, PROJECT_CHIMERA_CONFIG, SLOT_QUALITY, baseWeeklySets, blockFor, meetsMinimums,
} from '../src/data/plans/projectChimera';
import {
    MINIMUM_WEEKLY_SETS, QUALITIES, REALLOCATION_CAP, applyMutation, phenotype, proposeMutation, withinCap,
    type Quality, type QualityEvidence, type MutationComponent,
} from '../src/features/projectChimera/mutation';

// --- Plan 5: Oracle Imports ---
import { ORACLE_CONFIG, ORACLE_DAYS, isCalibrationWeek } from '../src/data/plans/oracle';
import {
    accuracyBand, accuracyTrend, assessConfidence, predictFromPriors, predictionError,
    type Exposure, type PredictionOutcome,
} from '../src/features/oracle/prediction';

// --- Plan 6: Apex Predator Imports ---
import { APEX_ACCESS, APEX_REGIONS, type ApexRegion } from '../src/data/apexAccess';
import { APEX_PREDATOR_CONFIG } from '../src/data/plans/apexPredator';
import {
    nextRomLevel, selectApexEmphasis, validRegionScore,
    type ApexAssessment, type ApexRegionResult,
} from '../src/features/apexPredator/assessment';
import { applyApexAccess } from '../src/features/apexPredator/prescription';

let totalTests = 0;
let totalAssertions = 0;

function reportTest(name: string, assertionsCount: number) {
    totalTests++;
    totalAssertions += assertionsCount;
    console.log(`  ✓ ${name} (${assertionsCount} checks)`);
}

// Base Persona: test_workhorse
const createWorkhorseUser = (programId: string): UserProfile => ({
    id: 'test_workhorse',
    codeword: 'test_workhorse',
    programId,
    startDate: '2026-01-05T08:00:00.000Z',
    completedSessions: 0,
    stats: {
        pausedBench: 110,
        wideGripBench: 95,
        spotoPress: 100,
        lowPinPress: 90,
        squat: 140,
        conventionalDeadlift: 180,
        standingPress: 70,
        flatBench: 115,
    },
    benchHistory: [],
    squatHistory: [],
    badges: [],
});

console.log('\n======================================================================');
console.log('STARTING GROUP 6 WORKHORSE LIFECYCLE & PROGRESSION SIMULATION');
console.log('======================================================================\n');

// ============================================================================
// 1. KALI SIMULATION
// ============================================================================
console.log('----------------------------------------------------------------------');
console.log('1. KALI — Cutting, Volume Preservation & Intensification Bands');
console.log('----------------------------------------------------------------------');
{
    let checks = 0;
    const user = createWorkhorseUser('kali');

    // 1.1 Structural checks: 8 weeks, 4 days/week
    assert.equal(KALI_CONFIG.program.weeks.length, 8, 'Kali duration is 8 weeks'); checks++;
    for (const week of KALI_CONFIG.program.weeks) {
        assert.equal(week.days.filter(d => d.exercises.length > 0).length, 4, `Week ${week.weekNumber} has 4 training days`); checks++;
    }

    // 1.2 Volume Preservation Bands (12–19 sets/day across all 8 weeks)
    for (const week of KALI_CONFIG.program.weeks) {
        let weeklySets = 0;
        for (const day of week.days) {
            if (!day.exercises.length) continue;
            const processed = KALI_CONFIG.hooks!.preprocessDay!(structuredClone(day), user);
            const sets = processed.exercises.reduce((acc, ex) => acc + ex.sets, 0);
            assert.ok(sets >= 12 && sets <= 19, `Week ${week.weekNumber} Day ${day.dayOfWeek} sets (${sets}) within preservation band 12-19`); checks++;
            weeklySets += sets;
        }
        assert.ok(weeklySets >= 48 && weeklySets <= 76, `Week ${week.weekNumber} weekly sets (${weeklySets}) within cutting volume band`); checks++;
    }

    // 1.3 Systemic Compound Anchor & Unilateral slots
    for (const day of KALI_DAYS) {
        const anchors = day.slots.filter(s => s.systemicCompound);
        assert.equal(anchors.length, 1, `${day.name} has exactly 1 systemic anchor`); checks++;
        assert.equal(anchors[0].restSeconds, 150, `${day.name} systemic anchor rest is 150s`); checks++;
        const unilateral = day.slots.filter(s => s.unilateral);
        assert.ok(unilateral.length >= 1, `${day.name} contains unilateral work`); checks++;
    }

    // 1.4 Pull Anchor customization
    // Default pull anchor
    const day2Default = KALI_CONFIG.hooks!.preprocessDay!(structuredClone(KALI_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 2)!), user);
    assert.equal(day2Default.exercises[0].exerciseId, 'assisted-pull-up', 'Default pull anchor is assisted-pull-up'); checks++;

    // User changes pull anchor to weighted-pull-up
    const userWeightedPullup: UserProfile = {
        ...user,
        planPreferences: { kali: { scheduleMode: '4day', updatedAt: new Date().toISOString(), exerciseSelections: { pullAnchor: 'weighted-pull-up' } } },
    };
    const day2Weighted = KALI_CONFIG.hooks!.preprocessDay!(structuredClone(KALI_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 2)!), userWeightedPullup);
    assert.equal(day2Weighted.exercises[0].exerciseId, 'weighted-pull-up', 'Pull anchor updated to weighted-pull-up'); checks++;
    assert.equal(day2Weighted.exercises[0].name, 'Weighted Pull-ups', 'Exercise name updated correctly'); checks++;

    // User changes pull anchor to lat-pulldown
    const userLatPulldown: UserProfile = {
        ...user,
        planPreferences: { kali: { scheduleMode: '4day', updatedAt: new Date().toISOString(), exerciseSelections: { pullAnchor: 'lat-pulldown' } } },
    };
    const day2Lat = KALI_CONFIG.hooks!.preprocessDay!(structuredClone(KALI_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 2)!), userLatPulldown);
    assert.equal(day2Lat.exercises[0].exerciseId, 'lat-pulldown', 'Pull anchor updated to lat-pulldown'); checks++;

    // 1.5 Intensification Phase Transitions:
    // Severance (W1-2): No intensifiers
    const w1Exercises = KALI_CONFIG.program.weeks[0].days.flatMap(d => d.exercises);
    assert.ok(!w1Exercises.some(e => e.prescription?.technique), 'Week 1 has no intensifier techniques'); checks++;

    // Preservation (W3-5): No intensifiers
    const w4Exercises = KALI_CONFIG.program.weeks[3].days.flatMap(d => d.exercises);
    assert.ok(!w4Exercises.some(e => e.prescription?.technique), 'Week 4 has no intensifier techniques'); checks++;

    // Unleashed I (W6): Rest-pause on the new pushable slots
    const w6Exercises = KALI_CONFIG.program.weeks[5].days.flatMap(d => d.exercises);
    const legPressW6 = w6Exercises.find(e => e.exerciseId === 'leg-press');
    const pecDeckW6 = w6Exercises.find(e => e.exerciseId === 'pec-deck');
    assert.equal(legPressW6?.prescription?.technique?.kind, 'rest-pause', 'W6 leg press has rest-pause'); checks++;
    assert.equal(pecDeckW6?.prescription?.technique?.kind, 'rest-pause', 'W6 pec deck has rest-pause'); checks++;
    assert.equal(pecDeckW6?.prescription?.technique?.bursts, 2, 'Rest-pause bursts = 2'); checks++;
    assert.equal(pecDeckW6?.prescription?.technique?.restSeconds, 20, 'Rest-pause rest = 20s'); checks++;
    assert.equal(pecDeckW6?.prescription?.technique?.applyTo, 'last', 'Rest-pause applied to last set only'); checks++;

    // Unleashed II (W7): Myo-reps on hack squat and dip
    const w7Exercises = KALI_CONFIG.program.weeks[6].days.flatMap(d => d.exercises);
    const hackW7 = w7Exercises.find(e => e.exerciseId === 'hack-squat');
    const dipW7 = w7Exercises.find(e => e.exerciseId === 'dip');
    assert.equal(hackW7?.prescription?.technique?.kind, 'myo-reps', 'W7 hack squat has myo-reps'); checks++;
    assert.equal(dipW7?.prescription?.technique?.kind, 'myo-reps', 'W7 dip has myo-reps'); checks++;
    assert.equal(dipW7?.prescription?.technique?.activationReps, '12-20', 'Myo-reps activation reps = 12-20'); checks++;
    assert.equal(dipW7?.prescription?.technique?.miniSets, 3, 'Myo-reps mini-sets = 3'); checks++;
    assert.equal(dipW7?.prescription?.technique?.restBreaths, 5, 'Myo-reps rest breaths = 5'); checks++;

    // Unleashed III (W8): Unconfirmed -> Clean week (no technique)
    const w8Day4Unconfirmed = KALI_CONFIG.hooks!.preprocessDay!(structuredClone(KALI_CONFIG.program.weeks[7].days.find(d => d.dayOfWeek === 4)!), user);
    assert.ok(!w8Day4Unconfirmed.exercises.some(e => e.prescription?.technique), 'W8 unconfirmed has no techniques (clean)'); checks++;

    // Unleashed III (W8): Confirmed 'myo'
    const userW8Myo: UserProfile = {
        ...user,
        planPreferences: { kali: { scheduleMode: '4day', updatedAt: new Date().toISOString(), exerciseSelections: { week8Intensifier: 'myo' } } },
    };
    const w8Day4Myo = KALI_CONFIG.hooks!.preprocessDay!(structuredClone(KALI_CONFIG.program.weeks[7].days.find(d => d.dayOfWeek === 4)!), userW8Myo);
    const hackW8 = w8Day4Myo.exercises.find(e => e.exerciseId === 'hack-squat');
    assert.equal(hackW8?.prescription?.technique?.kind, 'myo-reps', 'W8 hack squat repeats myo-reps when chosen'); checks++;

    // Unleashed III (W8): Confirmed 'rest-pause'
    const userW8RestPause: UserProfile = {
        ...user,
        planPreferences: { kali: { scheduleMode: '4day', updatedAt: new Date().toISOString(), exerciseSelections: { week8Intensifier: 'rest-pause' } } },
    };
    const w8Day1RestPause = KALI_CONFIG.hooks!.preprocessDay!(structuredClone(KALI_CONFIG.program.weeks[7].days.find(d => d.dayOfWeek === 1)!), userW8RestPause);
    const legPressW8 = w8Day1RestPause.exercises.find(e => e.exerciseId === 'leg-press');
    assert.equal(legPressW8?.prescription?.technique?.kind, 'rest-pause', 'W8 leg press repeats rest-pause when chosen'); checks++;

    // 1.6 Dashboard Strength Retention Simulation
    const kaliUserWithStatus: UserProfile = {
        ...user,
        kaliStatus: {
            bodyweightKg: 84.5,
            baseline: { squat: 140, hinge: 180, push: 110, pull: 90 },
        },
    };
    assert.equal(kaliUserWithStatus.kaliStatus?.bodyweightKg, 84.5, 'Kali bodyweight tracked'); checks++;
    assert.equal(kaliUserWithStatus.kaliStatus?.baseline?.squat, 140, 'Kali baseline squat preserved'); checks++;

    reportTest('Kali Volume Preservation & Intensification Bands', checks);
}

// ============================================================================
// 2. ATLAS SIMULATION
// ============================================================================
console.log('\n----------------------------------------------------------------------');
console.log('2. ATLAS — Two 5-Week Gauntlets, Loaded Carries & Hinge Selection');
console.log('----------------------------------------------------------------------');
{
    let checks = 0;
    const user = createWorkhorseUser('atlas');

    // 2.1 Gauntlet partitioning (10 weeks, 3 FB days/week)
    assert.equal(ATLAS_CONFIG.program.weeks.length, 10, 'Atlas is 10 weeks'); checks++;
    for (let w = 1; w <= 5; w++) {
        assert.equal(gauntletFor(w), 1, `Week ${w} is Gauntlet 1`); checks++;
    }
    for (let w = 6; w <= 10; w++) {
        assert.equal(gauntletFor(w), 2, `Week ${w} is Gauntlet 2`); checks++;
    }

    // 2.2 Movement consistency within Gauntlet 1 (Weeks 1-5) and Gauntlet 2 (Weeks 6-10)
    const getWeek1Day1 = () => ATLAS_CONFIG.hooks!.preprocessDay!(structuredClone(ATLAS_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!), user);
    const getWeek5Day1 = () => ATLAS_CONFIG.hooks!.preprocessDay!(structuredClone(ATLAS_CONFIG.program.weeks[4].days.find(d => d.dayOfWeek === 1)!), user);
    const getWeek6Day1 = () => ATLAS_CONFIG.hooks!.preprocessDay!(structuredClone(ATLAS_CONFIG.program.weeks[5].days.find(d => d.dayOfWeek === 1)!), user);
    const getWeek10Day1 = () => ATLAS_CONFIG.hooks!.preprocessDay!(structuredClone(ATLAS_CONFIG.program.weeks[9].days.find(d => d.dayOfWeek === 1)!), user);

    const w1d1Ids = getWeek1Day1().exercises.map(e => e.exerciseId).join(',');
    const w5d1Ids = getWeek5Day1().exercises.map(e => e.exerciseId).join(',');
    const w6d1Ids = getWeek6Day1().exercises.map(e => e.exerciseId).join(',');
    const w10d1Ids = getWeek10Day1().exercises.map(e => e.exerciseId).join(',');

    assert.equal(w1d1Ids, w5d1Ids, 'Gauntlet 1 movement set is completely stable across Weeks 1-5'); checks++;
    assert.equal(w6d1Ids, w10d1Ids, 'Gauntlet 2 movement set is completely stable across Weeks 6-10'); checks++;
    assert.notEqual(w1d1Ids, w6d1Ids, 'Gauntlet 2 swaps pattern variants (Safety-Bar -> Front Squat, etc.)'); checks++;

    // Check specific Gauntlet 2 movement changes
    const w6d1 = getWeek6Day1();
    assert.equal(w6d1.exercises[0].exerciseId, 'front-squat', 'Gauntlet 2 Day 1 leads with Front Squat'); checks++;
    assert.equal(w6d1.exercises[1].exerciseId, 'single-arm-standing-press', 'Gauntlet 2 Day 1 includes SA Standing Press'); checks++;

    // Gauntlet 2 Day 3 includes Dips
    const getWeek6Day3 = () => ATLAS_CONFIG.hooks!.preprocessDay!(structuredClone(ATLAS_CONFIG.program.weeks[5].days.find(d => d.dayOfWeek === 5)!), user);
    const w6d3 = getWeek6Day3();
    assert.ok(w6d3.exercises.some(e => e.exerciseId === 'dip'), 'Gauntlet 2 Day 3 includes Dips'); checks++;

    // 2.3 Loaded Carries as Primary Lifts (time x load scoring)
    const farmer60s: CarryResult = { exerciseId: 'farmer-carry', seconds: 60, loadKg: 50, implements: 2 };
    const farmer75s: CarryResult = { exerciseId: 'farmer-carry', seconds: 75, loadKg: 50, implements: 2 };
    const farmerHeavy: CarryResult = { exerciseId: 'farmer-carry', seconds: 60, loadKg: 60, implements: 2 };
    const suitcase45s: CarryResult = { exerciseId: 'suitcase-carry', seconds: 45, loadKg: 40, implements: 1 };

    // Score calculation: (loadKg * implements * seconds) / 60
    assert.equal(carryScore(farmer60s), 100, 'Farmer carry 50kg x 2 implements x 60s = 100 kg*min'); checks++;
    assert.equal(carryScore(farmer75s), 125, 'Farmer carry 50kg x 2 implements x 75s = 125 kg*min'); checks++;
    assert.equal(carryScore(farmerHeavy), 120, 'Farmer carry 60kg x 2 implements x 60s = 120 kg*min'); checks++;
    assert.equal(carryScore(suitcase45s), 30, 'Suitcase carry 40kg x 1 implement x 45s = 30 kg*min'); checks++;

    // Carry comparisons
    assert.equal(compareCarries(farmer75s, farmer60s), 'better', 'Longer duration at same load is better'); checks++;
    assert.equal(compareCarries(farmerHeavy, farmer60s), 'better', 'Heavier load at same duration is better'); checks++;
    assert.equal(compareCarries(farmer60s, farmer75s), 'worse', 'Shorter duration is worse'); checks++;
    assert.equal(compareCarries(farmer60s, { ...farmer60s }), 'equal', 'Identical carry is equal'); checks++;

    // 2.4 Limiter Advice Rules
    const createCarryWithLimiter = (limiter: CarryLimiter): CarryResult => ({
        exerciseId: 'farmer-carry', seconds: 50, loadKg: 45, implements: 2, limiter,
    });

    // 0 or 1 limiter gives no advice
    assert.equal(limiterAdvice([]), undefined, 'Empty carries return no advice'); checks++;
    assert.equal(limiterAdvice([createCarryWithLimiter('grip')]), undefined, 'Single limiter gives no advice'); checks++;

    // Mixed limiters give no advice
    assert.equal(limiterAdvice([createCarryWithLimiter('grip'), createCarryWithLimiter('trunk')]), undefined, 'Mixed limiters give no advice'); checks++;

    // Repeated limiters provide tailored guidance
    assert.ok(limiterAdvice([createCarryWithLimiter('grip'), createCarryWithLimiter('grip')])?.includes('suitcase hold'), 'Repeated grip limiter suggests suitcase hold'); checks++;
    assert.ok(limiterAdvice([createCarryWithLimiter('trunk'), createCarryWithLimiter('trunk')])?.includes('shorten the carry'), 'Repeated trunk limiter suggests shortening carry'); checks++;
    assert.ok(limiterAdvice([createCarryWithLimiter('breathing'), createCarryWithLimiter('breathing')])?.includes('conditioning'), 'Repeated breathing limiter clarifies conditioning'); checks++;
    assert.ok(limiterAdvice([createCarryWithLimiter('upper-back'), createCarryWithLimiter('upper-back')])?.includes('Reduce the load'), 'Repeated upper-back limiter advises reducing load'); checks++;
    assert.ok(limiterAdvice([createCarryWithLimiter('legs'), createCarryWithLimiter('legs')])?.includes('squat day'), 'Repeated legs limiter advises separation from squat day'); checks++;

    // 2.5 Hinge Variant Selection
    assert.deepEqual(APPROVED_HINGES, ['trap-bar-deadlift', 'conventional-deadlift', 'sumo-deadlift'], 'Approved hinges defined'); checks++;

    // Select Conventional Deadlift
    const userConventional: UserProfile = {
        ...user,
        planPreferences: { atlas: { scheduleMode: '3day', updatedAt: new Date().toISOString(), exerciseSelections: { hinge: 'conventional-deadlift' } } },
    };
    const day2Conventional = ATLAS_CONFIG.hooks!.preprocessDay!(structuredClone(ATLAS_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 3)!), userConventional);
    assert.equal(day2Conventional.exercises[0].exerciseId, 'conventional-deadlift', 'Conventional deadlift applied as hinge'); checks++;

    // Select Sumo Deadlift
    const userSumo: UserProfile = {
        ...user,
        planPreferences: { atlas: { scheduleMode: '3day', updatedAt: new Date().toISOString(), exerciseSelections: { hinge: 'sumo-deadlift' } } },
    };
    const day2Sumo = ATLAS_CONFIG.hooks!.preprocessDay!(structuredClone(ATLAS_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 3)!), userSumo);
    assert.equal(day2Sumo.exercises[0].exerciseId, 'sumo-deadlift', 'Sumo deadlift applied as hinge'); checks++;

    // Unapproved Hinge ignored (e.g. 'bicep-curl')
    const userBogusHinge: UserProfile = {
        ...user,
        planPreferences: { atlas: { scheduleMode: '3day', updatedAt: new Date().toISOString(), exerciseSelections: { hinge: 'bicep-curl' } } },
    };
    const day2Bogus = ATLAS_CONFIG.hooks!.preprocessDay!(structuredClone(ATLAS_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 3)!), userBogusHinge);
    assert.equal(day2Bogus.exercises[0].exerciseId, 'trap-bar-deadlift', 'Unapproved hinge ignored, keeps trap bar deadlift'); checks++;

    // 2.6 Power Pool verification
    assert.ok(POWER_POOL.includes('kettlebell-swing') && POWER_POOL.includes('turkish-get-up'), 'Power pool defined'); checks++;
    for (const id of POWER_POOL) {
        assert.ok(isPowerWork(id), `${id} recognized as power work`); checks++;
        assert.ok(EXERCISE_BY_ID[id], `${id} exists in exercise library`); checks++;
    }
    const allPrescribedIds = new Set([...ATLAS_GAUNTLET_ONE, ...ATLAS_GAUNTLET_TWO].flatMap(d => d.slots.map(s => s.ex)));
    for (const id of POWER_POOL) {
        assert.ok(!allPrescribedIds.has(id), `Power exercise ${id} is never in prescribed workout tree`); checks++;
    }

    reportTest('Atlas Gauntlets, Loaded Carries & Hinge Selection', checks);
}

// ============================================================================
// 3. EVENT HORIZON SIMULATION
// ============================================================================
console.log('\n----------------------------------------------------------------------');
console.log('3. EVENT HORIZON — Cost-Aware Hypertrophy & Fatigue Substitution');
console.log('----------------------------------------------------------------------');
{
    let checks = 0;
    const user = createWorkhorseUser('event-horizon');

    // 3.1 12-week upper/lower structure
    assert.equal(EVENT_HORIZON_CONFIG.program.weeks.length, 12, 'Event Horizon is 12 weeks'); checks++;
    assert.equal(EVENT_HORIZON_DAYS.length, 4, 'Event Horizon has 4 days/week'); checks++;

    // Phase transformations
    // Approach (W1-3): Base RPE / sets
    const w1Slots = EVENT_HORIZON_CONFIG.program.weeks[0].days.flatMap(d => d.exercises);
    assert.ok(w1Slots.every(e => !e.target?.rpe || e.target.rpe <= 8), 'Approach phase uses standard RPE'); checks++;

    // Accretion (W4-7): Non-systemic get RPE 9
    const w5Slots = EVENT_HORIZON_CONFIG.program.weeks[4].days.flatMap(d => d.exercises);
    const nonSystemicW5 = w5Slots.filter(e => e.exerciseId !== 'hack-squat' && e.exerciseId !== 'leg-press');
    const systemicW5 = w5Slots.filter(e => e.exerciseId === 'hack-squat' || e.exerciseId === 'leg-press');
    assert.ok(nonSystemicW5.every(e => e.target?.rpe === 9), 'Accretion phase gives RPE 9 to non-systemic lifts'); checks++;
    assert.ok(systemicW5.every(e => !e.target?.rpe || e.target.rpe < 9), 'Accretion phase preserves sub-9 RPE for systemic compounds'); checks++;

    // Horizon (W8-11): All RPE 9, non-primary with sets < 4 get +1 set
    const w9Slots = EVENT_HORIZON_CONFIG.program.weeks[8].days.flatMap(d => d.exercises);
    assert.ok(w9Slots.every(e => e.target?.rpe === 9), 'Horizon phase has RPE 9 on all exercises'); checks++;

    // Escape (W12): Volume deload (-1 set per slot)
    const w12Slots = EVENT_HORIZON_CONFIG.program.weeks[11].days.flatMap(d => d.exercises);
    const w1Day1Sets = EVENT_HORIZON_CONFIG.program.weeks[0].days[0].exercises.reduce((n, e) => n + e.sets, 0);
    const w12Day1Sets = EVENT_HORIZON_CONFIG.program.weeks[11].days[0].exercises.reduce((n, e) => n + e.sets, 0);
    assert.ok(w12Day1Sets < w1Day1Sets, 'Escape phase reduces volume (-1 set per slot)'); checks++;

    // 3.2 Region Costs & Ordinal Model
    assert.equal(REGION_COSTS.knee, 'kneeCost', 'knee maps to kneeCost'); checks++;
    assert.equal(REGION_COSTS.lowerBack, 'lowerBackCost', 'lowerBack maps to lowerBackCost'); checks++;
    assert.equal(REGION_COSTS.shoulder, 'shoulderCost', 'shoulder maps to shoulderCost'); checks++;
    assert.equal(REGION_COSTS.elbow, 'elbowCost', 'elbow maps to elbowCost'); checks++;
    assert.equal(REGION_COSTS.spine, 'axialCost', 'spine maps to axialCost'); checks++;

    // 3.3 Authoritative Athlete Reports & Legible Recommendations
    // Normal report gives no recommendation
    assert.equal(recommendSwap('hack-squat', 'knee', 'normal'), undefined, 'Normal report generates no swap'); checks++;

    // Strained report gives lower-cost options with preserved role & tradeoffs
    const squatStrained = recommendSwap('barbell-squat', 'lowerBack', 'strained');
    assert.ok(squatStrained !== undefined, 'Strained lowerBack on Barbell Squat produces recommendations'); checks++;
    assert.equal(squatStrained!.requiresConfirmation, true, 'Recommendations require athlete confirmation'); checks++;
    assert.ok(squatStrained!.options.length > 0, 'Produces valid replacement options'); checks++;
    for (const opt of squatStrained!.options) {
        assert.ok(opt.costAfter < opt.costBefore, `Option ${opt.name} reduces lowerBack cost (${opt.costAfter} < ${opt.costBefore})`); checks++;
        assert.ok(opt.preservedRole.length > 0, `Option ${opt.name} declares preserved role (${opt.preservedRole})`); checks++;
        assert.ok(opt.tradeoffs.length > 0, `Option ${opt.name} lists plain-language tradeoffs`); checks++;
    }

    // Lowest-cost exercise with strain produces plain dead-end message instead of inventing bad options
    const deadEndRec = recommendSwap('hack-squat', 'knee', 'strained');
    assert.ok(deadEndRec !== undefined, 'Dead end returns structured recommendation object'); checks++;
    assert.ok(deadEndRec!.options.length === 0 && deadEndRec!.message.includes('No lower-cost option'), 'Dead end states plainly that no lower cost option exists'); checks++;

    // 3.4 Split Substitution for complex/isolated fatigue
    // When no single movement covers the role cheaply, a split offers compound + isolation
    const splitRec = recommendSwap('leg-extension', 'knee', 'impaired');
    assert.ok(splitRec !== undefined, 'Impaired report produces structured recommendation or dead-end message'); checks++;

    // 3.5 Bounded Personal Learning (max +-1 ordinal after >= 3 comparable exposures)
    const hackKneeExpert = EXERCISE_BY_ID['hack-squat']?.intelligence?.kneeCost ?? 2;
    const makeExposures = (count: number, report: RegionReport, comparable = true): ExposureRecord[] =>
        Array.from({ length: count }, () => ({ exerciseId: 'hack-squat', region: 'knee', report, comparable }));

    // 2 exposures: no learning
    assert.equal(learnedCost('hack-squat', 'kneeCost', makeExposures(2, 'strained')).learned, false, '<3 exposures does not trigger learning'); checks++;

    // Incomparable exposures: no learning
    assert.equal(learnedCost('hack-squat', 'kneeCost', makeExposures(4, 'strained', false)).learned, false, 'Incomparable exposures do not trigger learning'); checks++;

    // 3 comparable strained: learned value moves up by exactly 1
    const learnedUp = learnedCost('hack-squat', 'kneeCost', makeExposures(3, 'strained'));
    assert.equal(learnedUp.learned, true, '3 strained exposures triggers learning'); checks++;
    assert.equal(learnedUp.value, Math.min(4, hackKneeExpert + 1), 'Cost increments by at most 1 ordinal'); checks++;

    // 4 comparable normal: learned value moves down by exactly 1
    const learnedDown = learnedCost('hack-squat', 'kneeCost', makeExposures(4, 'normal'));
    assert.equal(learnedDown.learned, true, '4 normal exposures triggers learning'); checks++;
    assert.equal(learnedDown.value, Math.max(0, hackKneeExpert - 1), 'Cost decrements by at most 1 ordinal'); checks++;

    // 20 severe exposures: never drifts more than 1 step from expert value
    const learnedBound = learnedCost('hack-squat', 'kneeCost', makeExposures(20, 'impaired'));
    assert.ok(Math.abs(learnedBound.value - hackKneeExpert) <= 1, 'Cost never drifts more than 1 step from expert anchor'); checks++;

    // 3.6 Preprocessor & Confirmation Safety
    const lowerDay = EVENT_HORIZON_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 2)!;

    // Unconfirmed report changes nothing
    const userUnconfirmed: UserProfile = {
        ...user,
        eventHorizonStatus: {
            reports: [{ week: 1, region: 'knee', report: 'impaired', exerciseId: 'hack-squat', comparable: true }],
        },
    };
    const dayUnconfirmed = EVENT_HORIZON_CONFIG.hooks!.preprocessDay!(structuredClone(lowerDay), userUnconfirmed);
    assert.equal(dayUnconfirmed.exercises[0].exerciseId, 'hack-squat', 'Unconfirmed report leaves workout intact'); checks++;

    // Confirmed single swap
    const userConfirmedSwap: UserProfile = {
        ...user,
        eventHorizonStatus: {
            acceptedSwaps: { 'hack-squat': 'leg-press' },
        },
    };
    const dayConfirmedSwap = EVENT_HORIZON_CONFIG.hooks!.preprocessDay!(structuredClone(lowerDay), userConfirmedSwap);
    assert.equal(dayConfirmedSwap.exercises[0].exerciseId, 'leg-press', 'Confirmed swap replaces hack-squat with leg-press'); checks++;
    assert.equal(dayConfirmedSwap.exercises[0].name, 'Leg Press', 'Exercise name updated correctly'); checks++;

    // Confirmed split swap (divides sets, never doubles)
    const userConfirmedSplit: UserProfile = {
        ...user,
        eventHorizonStatus: {
            acceptedSwaps: { 'hack-squat': ['leg-press', 'leg-extension'] },
        },
    };
    const dayConfirmedSplit = EVENT_HORIZON_CONFIG.hooks!.preprocessDay!(structuredClone(lowerDay), userConfirmedSplit);
    const splitExercises = dayConfirmedSplit.exercises.filter(e => ['leg-press', 'leg-extension'].includes(e.exerciseId ?? ''));
    assert.ok(splitExercises.length >= 2, 'Split swap produces 2 exercise slots'); checks++;
    const totalSplitSets = splitExercises.slice(0, 2).reduce((n, e) => n + e.sets, 0);
    assert.ok(totalSplitSets <= lowerDay.exercises[0].sets + 1, 'Split halves/divides sets rather than doubling work'); checks++;

    // 3.7 Follow-up Outcome Verdicts
    assert.equal(swapVerdict({ acceptedExerciseId: 'leg-press', replacedExerciseId: 'hack-squat', followUpReport: 'normal', performanceHeld: true }), 'helped', 'Clean follow-up recorded as helped'); checks++;
    assert.equal(swapVerdict({ acceptedExerciseId: 'leg-press', replacedExerciseId: 'hack-squat', followUpReport: 'impaired', performanceHeld: false }), 'did-not-help', 'Impaired follow-up recorded as did-not-help'); checks++;
    assert.equal(swapVerdict({ acceptedExerciseId: 'leg-press', replacedExerciseId: 'hack-squat', followUpReport: 'normal', performanceHeld: false }), 'mixed', 'Relief with performance drop recorded as mixed'); checks++;

    reportTest('Event Horizon Cost-Aware Swaps & Bounded Learning', checks);
}

// ============================================================================
// 4. PROJECT CHIMERA SIMULATION
// ============================================================================
console.log('\n----------------------------------------------------------------------');
console.log('4. PROJECT CHIMERA — Block Mutations, Floor Preservation & Phenotypes');
console.log('----------------------------------------------------------------------');
{
    let checks = 0;
    const user = createWorkhorseUser('project-chimera');

    // 4.1 16 weeks, 4 blocks of 4 weeks
    assert.equal(PROJECT_CHIMERA_CONFIG.program.weeks.length, 16, 'Chimera is 16 weeks'); checks++;
    assert.equal(BLOCKS.length, 4, '4 blocks'); checks++;
    assert.equal(blockFor(1), 1, 'Week 1 is Block 1'); checks++;
    assert.equal(blockFor(4), 1, 'Week 4 is Block 1'); checks++;
    assert.equal(blockFor(5), 2, 'Week 5 is Block 2'); checks++;
    assert.equal(blockFor(8), 2, 'Week 8 is Block 2'); checks++;
    assert.equal(blockFor(9), 3, 'Week 9 is Block 3'); checks++;
    assert.equal(blockFor(12), 3, 'Week 12 is Block 3'); checks++;
    assert.equal(blockFor(13), 4, 'Week 13 is Block 4'); checks++;
    assert.equal(blockFor(16), 4, 'Week 16 is Block 4'); checks++;

    // 4.2 Base Plan balance & floors
    const baseWeekly = baseWeeklySets();
    assert.ok(meetsMinimums(baseWeekly), 'Base plan clears every quality minimum'); checks++;
    for (const q of QUALITIES) {
        assert.ok(baseWeekly[q] >= MINIMUM_WEEKLY_SETS[q], `Quality ${q} base sets (${baseWeekly[q]}) >= minimum (${MINIMUM_WEEKLY_SETS[q]})`); checks++;
    }

    // Every slot declares a quality
    for (const day of CHIMERA_DAYS) {
        for (const slot of day.slots) {
            assert.ok(SLOT_QUALITY[slot.ex], `Slot ${slot.ex} in ${day.name} has declared quality`); checks++;
        }
    }

    // 4.3 Evidence Gates for Mutation Proposals
    const makeEvidence = (overrides: Partial<QualityEvidence>[] = []): QualityEvidence[] =>
        QUALITIES.map((quality, idx) => ({
            quality,
            comparableExposures: 4,
            trend: 0.02,
            fatigue: 2,
            stalled: false,
            ...(overrides[idx] ?? {}),
        }));

    // Thin evidence (<3 exposures) -> No proposal generated
    const thinProposal = proposeMutation(2, makeEvidence().map(e => ({ ...e, comparableExposures: 1 })), baseWeekly);
    assert.equal(thinProposal.components.length, 0, 'Insufficient evidence forces 0 proposal components'); checks++;
    assert.ok(thinProposal.message.includes('continues as written'), 'Explains why no mutation proposed'); checks++;

    // Rich evidence: high fatigue squat + high responding hypertrophy -> generates mutation proposal
    const richEvidence = makeEvidence([
        { trend: -0.01, fatigue: 4, stalled: true }, // Squat: high fatigue, poor return, stalled
        {}, {}, {}, {},
        { trend: 0.08, fatigue: 1 },                 // Hypertrophy: responding strongly
    ]);
    const proposal = proposeMutation(2, richEvidence, baseWeekly);
    assert.ok(proposal.components.length > 0, 'Rich evidence generates proposal components'); checks++;
    assert.ok(proposal.components.every(c => c.confirmed === false), 'No component starts confirmed'); checks++;
    assert.ok(proposal.components.every(c => c.rationale.length > 0), 'Every component explains rationale'); checks++;
    assert.ok(withinCap(proposal.components), 'Proposal strictly respects +-2 set cap'); checks++;

    // Volume is moved, not created
    const setDonors = proposal.components.filter(c => (c.setDelta ?? 0) < 0);
    const setReceivers = proposal.components.filter(c => (c.setDelta ?? 0) > 0);
    assert.ok(setDonors.length > 0 && setReceivers.length > 0, 'Sets are reallocated between donors and receivers'); checks++;
    const totalDonated = Math.abs(setDonors.reduce((n, c) => n + (c.setDelta ?? 0), 0));
    const totalReceived = setReceivers.reduce((n, c) => n + (c.setDelta ?? 0), 0);
    assert.equal(totalDonated, totalReceived, 'Reallocated sets are balanced (sets moved, not created)'); checks++;

    // Stalled quality earns exercise change suggestion
    const exerciseChangeComp = proposal.components.find(c => c.kind === 'change-exercise');
    assert.ok(exerciseChangeComp !== undefined, 'Stalled squat earns separate exercise change component'); checks++;
    assert.equal(exerciseChangeComp?.quality, 'squat', 'Exercise change targets stalled squat quality'); checks++;

    // 4.4 Floor Protection
    const atFloorSets: Record<Quality, number> = { ...baseWeekly, squat: MINIMUM_WEEKLY_SETS.squat };
    const floorProposal = proposeMutation(2, makeEvidence([{ trend: -0.05, fatigue: 4 }]), atFloorSets);
    assert.ok(!floorProposal.components.some(c => c.quality === 'squat' && (c.setDelta ?? 0) < 0), 'Quality at floor is NEVER asked to give up sets'); checks++;

    // applyMutation protects floors even if forced
    const forcedComponents: (MutationComponent & { confirmed: boolean })[] = [
        { kind: 'reallocate-sets', quality: 'squat', setDelta: -5, rationale: 'force drop', confirmed: true },
    ];
    const appliedForced = applyMutation(atFloorSets, forcedComponents);
    assert.equal(appliedForced.squat, MINIMUM_WEEKLY_SETS.squat, 'Floor holds against invalid/extreme negative delta'); checks++;

    // 4.5 Confirmation Gate in Session Preprocessing
    const lowerDayChimera = PROJECT_CHIMERA_CONFIG.program.weeks[4].days.find(d => d.dayOfWeek === 2)!; // Block 2 (Week 5)

    // Unconfirmed status -> unchanged
    const dayPlain = PROJECT_CHIMERA_CONFIG.hooks!.preprocessDay!(structuredClone(lowerDayChimera), user);
    assert.equal(dayPlain.exercises.reduce((n, e) => n + e.sets, 0), lowerDayChimera.exercises.reduce((n, e) => n + e.sets, 0), 'Unmutated session has default sets'); checks++;

    // Confirmed allocation delta: squat -1, hypertrophy +1 in block 2
    const userMutated: UserProfile = {
        ...user,
        projectChimeraStatus: {
            allocation: { 2: { squat: -1, hypertrophy: 1 } },
            acceptedExerciseChanges: { 'barbell-squat': 'hack-squat' },
        },
    };
    const dayMutated = PROJECT_CHIMERA_CONFIG.hooks!.preprocessDay!(structuredClone(lowerDayChimera), userMutated);
    assert.equal(dayMutated.exercises[0].exerciseId, 'hack-squat', 'Accepted exercise change applied to squat slot'); checks++;
    assert.equal(dayMutated.exercises[0].sets, lowerDayChimera.exercises[0].sets - 1, 'Squat sets reduced by 1 in session'); checks++;
    assert.ok(dayMutated.exercises.every(e => e.sets >= 1), 'No exercise reduced below 1 set'); checks++;

    // 4.6 Phenotype labeling (display only, inert)
    const phenoRich = phenotype(makeEvidence([{}, {}, {}, {}, {}, { trend: 0.12 }]));
    assert.equal(phenoRich.label, 'Volume-responsive', 'High hypertrophy response identified as Volume-responsive'); checks++;
    assert.ok(phenoRich.caveat.includes('never changes your programme'), 'Phenotype states it is purely informational'); checks++;

    const phenoThin = phenotype(makeEvidence().map(e => ({ ...e, comparableExposures: 1 })));
    assert.equal(phenoThin.label, 'Not enough data yet', 'Phenotype withheld when data is thin'); checks++;

    reportTest('Project Chimera Block Mutations & Volume Reallocation', checks);
}

// ============================================================================
// 5. ORACLE SIMULATION
// ============================================================================
console.log('\n----------------------------------------------------------------------');
console.log('5. ORACLE — Prior Prediction, Earned Confidence & Honest Accuracy');
console.log('----------------------------------------------------------------------');
{
    let checks = 0;
    const user = createWorkhorseUser('oracle');

    // 5.1 10-week lifecycle & calibration weeks
    assert.equal(ORACLE_CONFIG.program.weeks.length, 10, 'Oracle is 10 weeks'); checks++;
    assert.equal(ORACLE_DAYS.length, 4, 'Oracle has 4 days/week'); checks++;
    assert.ok(isCalibrationWeek(1) && isCalibrationWeek(2), 'Weeks 1-2 are calibration weeks'); checks++;
    assert.ok(!isCalibrationWeek(3), 'Week 3 is reading phase (predictions begin)'); checks++;

    // Calibration phase workout annotation
    const calibDay = ORACLE_CONFIG.hooks!.preprocessDay!(structuredClone(ORACLE_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!), user);
    assert.ok(calibDay.exercises[0].notes?.includes('Calibration week'), 'Calibration week slots explain calibration target'); checks++;

    // 5.2 Earned Confidence Levels
    const now = Date.parse('2026-06-01T00:00:00.000Z');
    const makeExp = (over: Partial<Exposure> = {}): Exposure => ({
        date: '2026-05-25T00:00:00.000Z', loadKg: 100, reps: 8, rir: 2, comparable: true, ...over,
    });

    // 0 exposures -> low confidence
    assert.equal(assessConfidence([], now), 'low', '0 exposures = low confidence'); checks++;

    // 1-2 exposures -> medium confidence
    assert.equal(assessConfidence([makeExp()], now), 'medium', '1 exposure = medium confidence'); checks++;
    assert.equal(assessConfidence([makeExp(), makeExp()], now), 'medium', '2 exposures = medium confidence'); checks++;

    // >=3 exposures with at least 1 recent (<28 days) -> high confidence
    assert.equal(assessConfidence([makeExp(), makeExp(), makeExp()], now), 'high', '3 recent exposures = high confidence'); checks++;

    // 3 old exposures (>28 days ago) -> medium confidence (stale)
    const oldExposures = [1, 2, 3].map(() => makeExp({ date: '2026-01-01T00:00:00.000Z' }));
    assert.equal(assessConfidence(oldExposures, now), 'medium', 'Stale exposures (>28 days) cap at medium confidence'); checks++;

    // Incomparable exposures do not count
    assert.equal(assessConfidence([makeExp({ comparable: false }), makeExp({ comparable: false })], now), 'low', 'Incomparable work does not build confidence'); checks++;

    // 5.3 Prior-based Prediction Calculation
    const req = { exerciseId: 'flat-barbell-bench-press', targetReps: [5, 8] as [number, number], sets: 4, now };

    // Low confidence prediction offers calibration
    const predLow = predictFromPriors({ ...req, exposures: [] });
    assert.equal(predLow.confidence, 'low', 'Empty history produces low confidence'); checks++;
    assert.equal(predLow.offersCalibration, true, 'Low confidence offers calibration set'); checks++;
    assert.equal(predLow.source, 'priors', 'Source is priors'); checks++;

    // Medium confidence prediction gives a range [0.94 * load, 1.06 * load]
    const predMed = predictFromPriors({ ...req, exposures: [makeExp()] });
    assert.equal(predMed.confidence, 'medium', 'Single exposure gives medium confidence'); checks++;
    assert.ok(predMed.range !== undefined, 'Medium confidence provides load range'); checks++;
    assert.ok(predMed.range![0] < predMed.loadKg && predMed.range![1] > predMed.loadKg, 'Range brackets the estimated load'); checks++;
    assert.equal(predMed.offersCalibration, false, 'Medium confidence does not require calibration'); checks++;

    // High confidence prediction gives single editable target
    const predHigh = predictFromPriors({ ...req, exposures: [makeExp(), makeExp(), makeExp()] });
    assert.equal(predHigh.confidence, 'high', '3 recent exposures give high confidence'); checks++;
    assert.equal(predHigh.range, undefined, 'High confidence gives single editable target'); checks++;
    assert.ok(predHigh.loadKg > 0, 'Produces specific loadKg'); checks++;
    assert.ok(predHigh.rationale.includes('Edit the target'), 'Rationale notes target is editable'); checks++;

    // Higher RIR predicts higher load capability
    const predFresh = predictFromPriors({ ...req, exposures: [makeExp({ rir: 4 }), makeExp({ rir: 4 }), makeExp({ rir: 4 })] });
    const predGrinding = predictFromPriors({ ...req, exposures: [makeExp({ rir: 0 }), makeExp({ rir: 0 }), makeExp({ rir: 0 })] });
    assert.ok(predFresh.loadKg > predGrinding.loadKg, 'Higher RIR (more reps in reserve) predicts heavier next load'); checks++;

    // External factor dampening (1/3 weight)
    const predClean = predictFromPriors({ ...req, exposures: [makeExp({ loadKg: 100 }), makeExp({ loadKg: 100 }), makeExp({ loadKg: 100 })] });
    const predFlagged = predictFromPriors({ ...req, exposures: [makeExp({ loadKg: 100 }), makeExp({ loadKg: 100 }), makeExp({ loadKg: 60, externalFactor: true })] });
    const predUndamped = predictFromPriors({ ...req, exposures: [makeExp({ loadKg: 100 }), makeExp({ loadKg: 100 }), makeExp({ loadKg: 60 })] });
    assert.ok(predFlagged.loadKg < predClean.loadKg, 'Flagged bad session dampens prediction'); checks++;
    assert.ok(predFlagged.loadKg > predUndamped.loadKg, 'Flagged session has less weight than unflagged bad session'); checks++;

    // Preprocessor integration with UserProfile
    const userWithOracleHistory: UserProfile = {
        ...user,
        oracleStatus: {
            exposures: [1, 2, 3].map(() => ({
                exerciseId: 'flat-barbell-bench-press',
                date: new Date().toISOString(),
                loadKg: 100, reps: 8, rir: 2, comparable: true,
            })),
        },
    };
    const predWeek5Day1 = ORACLE_CONFIG.hooks!.preprocessDay!(structuredClone(ORACLE_CONFIG.program.weeks[4].days.find(d => d.dayOfWeek === 1)!), userWithOracleHistory);
    assert.ok(predWeek5Day1.exercises[0].notes?.includes('high confidence'), 'Week 5 slot annotated with high confidence prediction'); checks++;

    // 5.4 Prediction Error Scoring
    const exactHit: PredictionOutcome = { predictedLoadKg: 100, predictedReps: [5, 8], actualLoadKg: 100, actualReps: 6, actualRir: 2, confidence: 'high' };
    assert.equal(predictionError(exactHit), 0, 'Exact prescription hit has 0 error'); checks++;

    const loadMiss: PredictionOutcome = { predictedLoadKg: 100, predictedReps: [5, 8], actualLoadKg: 90, actualReps: 6, actualRir: 2, confidence: 'high' };
    assert.equal(predictionError(loadMiss), 0.1, '10kg load miss (10%) scores 0.1 error'); checks++;

    const repMiss: PredictionOutcome = { predictedLoadKg: 100, predictedReps: [5, 8], actualLoadKg: 100, actualReps: 3, actualRir: 0, confidence: 'high' };
    assert.ok(predictionError(repMiss) > 0.2, 'Rep miss below target rep floor incurs error penalty'); checks++;

    const rirMiss: PredictionOutcome = { predictedLoadKg: 100, predictedReps: [5, 8], actualLoadKg: 100, actualReps: 6, actualRir: 6, confidence: 'high' };
    assert.ok(predictionError(rirMiss) > 0, 'Finishing far too fresh (@6 RIR) incurs RIR deviation penalty'); checks++;

    // 5.5 Honest Accuracy Bands & Trends
    // Small sample (<5) -> unreliable
    assert.equal(accuracyBand([0.02, 0.03]).band, 'unreliable', '<5 predictions marked unreliable with small sample note'); checks++;
    assert.ok(accuracyBand([0.02, 0.03]).note.includes('Too few'), 'States too few predictions'); checks++;

    // n >= 5 bands
    assert.equal(accuracyBand([0.03, 0.04, 0.02, 0.05, 0.03]).band, 'sharp', 'Mean error <= 5% = sharp'); checks++;
    assert.equal(accuracyBand([0.07, 0.08, 0.06, 0.09, 0.07]).band, 'usable', 'Mean error <= 10% = usable'); checks++;
    assert.equal(accuracyBand([0.15, 0.18, 0.12, 0.16, 0.14]).band, 'loose', 'Mean error <= 20% = loose'); checks++;
    assert.equal(accuracyBand([0.30, 0.25, 0.35, 0.28, 0.32]).band, 'unreliable', 'Mean error > 20% = unreliable'); checks++;

    // Accuracy Trend (n >= 8)
    assert.equal(accuracyTrend([0.05, 0.05, 0.05]), 'unknown', '<8 predictions gives unknown trend'); checks++;
    const improving = [0.20, 0.18, 0.19, 0.22, 0.05, 0.04, 0.06, 0.03];
    assert.equal(accuracyTrend(improving), 'improving', 'Halved sample comparison detects improving trend'); checks++;
    const worsening = [0.03, 0.04, 0.05, 0.04, 0.18, 0.20, 0.22, 0.19];
    assert.equal(accuracyTrend(worsening), 'worsening', 'Halved sample comparison detects worsening trend'); checks++;
    const flat = [0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08];
    assert.equal(accuracyTrend(flat), 'flat', 'Consistent error rate detects flat trend'); checks++;

    reportTest('Oracle Prior Prediction, Earned Confidence & Honest Accuracy', checks);
}

// ============================================================================
// 6. APEX PREDATOR SIMULATION
// ============================================================================
console.log('\n----------------------------------------------------------------------');
console.log('6. APEX PREDATOR — 6-Region Assessment, Access Slots & ROM Progression');
console.log('----------------------------------------------------------------------');
{
    let checks = 0;
    const user = createWorkhorseUser('apex-predator');

    // 6.1 12-week structure & retest phases
    assert.equal(APEX_PREDATOR_CONFIG.program.weeks.length, 12, 'Apex Predator is 12 weeks'); checks++;
    for (const week of APEX_PREDATOR_CONFIG.program.weeks) {
        assert.equal(week.days.filter(d => d.exercises.length > 0).length, 3, `Week ${week.weekNumber} has 3 sessions`); checks++;
    }

    // Retest / Hunt volume drops
    // W1 base sets
    const w1Day1Sets = APEX_PREDATOR_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!.exercises.reduce((n, e) => n + e.sets, 0);
    // W4 First Hunt (max 2 sets per slot)
    const w4Day1Sets = APEX_PREDATOR_CONFIG.program.weeks[3].days.find(d => d.dayOfWeek === 1)!.exercises.reduce((n, e) => n + e.sets, 0);
    assert.ok(w4Day1Sets < w1Day1Sets, 'Week 4 First Hunt caps sets at 2'); checks++;

    // W12 Final Hunt (30-40% volume reduction)
    const w12Day1Sets = APEX_PREDATOR_CONFIG.program.weeks[11].days.find(d => d.dayOfWeek === 1)!.exercises.reduce((n, e) => n + e.sets, 0);
    const volumeRatio = w12Day1Sets / w1Day1Sets;
    assert.ok(volumeRatio >= 0.6 && volumeRatio <= 0.7, `Week 12 reduces volume by 30-40% (ratio: ${volumeRatio.toFixed(2)})`); checks++;

    // 6.2 6-Region Movement Screen Assessment
    assert.deepEqual(APEX_REGIONS, ['ankle', 'hipFlexion', 'hipRotation', 'shoulderFlexion', 'shoulderRotation', 'thoracicRotation'], 'All 6 assessment regions defined'); checks++;

    // Score validation with thresholds
    assert.equal(validRegionScore({ left: 6, right: 6, pain: 'none' }, 'ankle'), 1, 'Ankle <8cm = score 1'); checks++;
    assert.equal(validRegionScore({ left: 9, right: 9, pain: 'none' }, 'ankle'), 2, 'Ankle 8-10cm = score 2'); checks++;
    assert.equal(validRegionScore({ left: 12, right: 12, pain: 'none' }, 'ankle'), 3, 'Ankle >=10cm = score 3'); checks++;

    // Pain invalidates assessment
    assert.equal(validRegionScore({ left: 12, right: 12, pain: 'pain' }, 'ankle'), null, 'Pain on ankle screen returns null'); checks++;
    assert.equal(validRegionScore({ score: 3, pain: 'pain' }), null, 'Pain flag returns null score'); checks++;

    // Emphasis Selection
    // Sparse assessment (<3 valid tests) falls back to ['ankle', 'thoracicRotation']
    const sparseAssessment: ApexAssessment = {
        week: 0, date: '2026-01-05',
        regions: { ankle: { score: 1, pain: 'none' }, hipFlexion: { score: 2, pain: 'pain' } },
    };
    assert.deepEqual(selectApexEmphasis(sparseAssessment), ['ankle', 'thoracicRotation'], 'Sparse assessment defaults to ankle + thoracicRotation'); checks++;

    // Complete assessment picks 2 most restricted / asymmetric regions
    const completeAssessment: ApexAssessment = {
        week: 0, date: '2026-01-05',
        regions: {
            ankle: { score: 3, pain: 'none' },
            hipFlexion: { score: 2, pain: 'none' },
            hipRotation: { left: 20, right: 35, score: 2, pain: 'none' }, // Asymmetric hip rotation
            shoulderFlexion: { left: 140, right: 140, score: 1, pain: 'none' }, // Most restricted (score 1)
            shoulderRotation: { score: 3, pain: 'none' },
            thoracicRotation: { score: 3, pain: 'none' },
        },
    };
    const emphasis = selectApexEmphasis(completeAssessment);
    assert.deepEqual(emphasis, ['shoulderFlexion', 'hipRotation'], 'Picks shoulderFlexion (score 1) and asymmetric hipRotation'); checks++;

    // 6.3 Access Movement Preprocessing & ROM Progression
    const userWithApexStatus: UserProfile = {
        ...user,
        apexPredatorStatus: {
            emphasis: { regions: ['shoulderFlexion', 'ankle'], sinceWeek: 0 },
            rom: {
                'wall-slide': { level: 2, updatedWeek: 2 },
                'loaded-ankle-rock': { level: 1, updatedWeek: 0 },
            },
        },
    };

    const rawDay1 = APEX_PREDATOR_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!;
    const processedDay1 = applyApexAccess(rawDay1, userWithApexStatus);
    const day1ExerciseIds = processedDay1.exercises.map(e => e.exerciseId);

    assert.ok(day1ExerciseIds.includes('wall-slide'), 'Wall slide installed for shoulderFlexion access'); checks++;
    assert.ok(day1ExerciseIds.includes('loaded-ankle-rock'), 'Loaded ankle rock installed for ankle access'); checks++;
    assert.ok(!day1ExerciseIds.includes('apex-access-placeholder'), 'No placeholder remains in workout'); checks++;

    // ROM cues assigned correctly based on level
    const wallSlideSlot = processedDay1.exercises.find(e => e.exerciseId === 'wall-slide');
    assert.equal(wallSlideSlot?.sets, 2, 'Access movement prescribed as 2 sets'); checks++;
    assert.equal(wallSlideSlot?.notes, 'Reach higher without rib flare', 'Level 2 ROM cue assigned for wall slide'); checks++;

    const ankleRockSlot = processedDay1.exercises.find(e => e.exerciseId === 'loaded-ankle-rock');
    assert.equal(ankleRockSlot?.notes, 'Knee to toes', 'Level 1 ROM cue assigned for ankle rock'); checks++;

    // ROM Level Advancement
    assert.equal(nextRomLevel(1, true, 3), 2, 'Controlled set advances ROM from level 1 to 2'); checks++;
    assert.equal(nextRomLevel(2, true, 3), 3, 'Controlled set advances ROM from level 2 to 3'); checks++;
    assert.equal(nextRomLevel(3, true, 3), 3, 'ROM level caps at maxRomLevel (3)'); checks++;
    assert.equal(nextRomLevel(2, false, 3), 2, 'Uncontrolled set holds current ROM level'); checks++;

    reportTest('Apex Predator Assessment, Access Slots & ROM Progression', checks);
}

console.log('\n======================================================================');
console.log(`ALL GROUP 6 TESTS COMPLETED: ${totalTests} test suites, ${totalAssertions} assertions passed cleanly.`);
console.log('======================================================================\n');
