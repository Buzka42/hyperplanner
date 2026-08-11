/**
 * verify:event-horizon
 *
 * The plan's contract is about restraint: the athlete's report is
 * authoritative, every recommendation shows its costs and tradeoffs, nothing is
 * applied without confirmation, and personal learning stays bounded around the
 * expert metadata.
 */

import assert from 'node:assert/strict';
import { EVENT_HORIZON_CONFIG, EVENT_HORIZON_DAYS } from '../src/data/plans/eventHorizon';
import {
    REGION_COSTS, learnedCost, recommendSwap, swapVerdict, type ExposureRecord,
} from '../src/features/eventHorizon/costAwareSwaps';
import { EXERCISE_BY_ID, EXERCISE_LIBRARY } from '../src/data/exercises/library';
import type { UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

ok(EVENT_HORIZON_CONFIG.program.weeks.length === 12, 'Event Horizon runs twelve weeks');
ok(EVENT_HORIZON_DAYS.length === 4, 'Event Horizon is four-day');
for (const day of EVENT_HORIZON_DAYS) {
    const sets = day.slots.reduce((n, slot) => n + slot.sets, 0);
    ok(sets >= 18 && sets <= 24, `${day.name} runs 18–24 sets (has ${sets})`);
}

// --- costs come from the documented ordinal model -----------------------------
ok(Object.values(REGION_COSTS).every(field => field.endsWith('Cost')), 'regions map onto documented cost fields');
const rated = EXERCISE_LIBRARY.filter(exercise => typeof exercise.intelligence?.kneeCost === 'number');
ok(rated.length === EXERCISE_LIBRARY.length, 'every library exercise carries authored costs');

// --- the athlete's report is authoritative ------------------------------------
ok(recommendSwap('hack-squat', 'knee', 'normal') === undefined, 'a normal report changes nothing');
const strained = recommendSwap('hack-squat', 'knee', 'strained');
ok(strained !== undefined, 'a strained report produces a recommendation');
const impaired = recommendSwap('barbell-squat', 'knee', 'impaired');
ok(impaired !== undefined, 'an impaired report always produces a recommendation');
ok(impaired!.requiresConfirmation === true, 'every recommendation requires confirmation');

// --- recommendations are legible ---------------------------------------------
for (const option of strained!.options) {
    ok(!!option.name, 'each option names the replacement');
    ok(!!option.preservedRole, 'each option states the role it preserves');
    ok(option.costAfter < option.costBefore, 'each option actually reduces the reported cost');
    ok(option.tradeoffs.length > 0, 'each option states its tradeoffs');
}
ok(strained!.plannedExerciseId === 'hack-squat', 'the recommendation names the planned movement');

// Where nothing helps, the message says so instead of inventing an option.
const nothing = recommendSwap('leg-extension', 'knee', 'impaired');
ok(nothing !== undefined, 'even a dead end produces a response');
ok(nothing!.options.length > 0 || nothing!.split || nothing!.message.includes('No lower-cost'), 'a dead end is stated plainly');

// --- bounded personal learning ------------------------------------------------
const exposures = (count: number, report: 'normal' | 'strained' | 'impaired', comparable = true): ExposureRecord[] =>
    Array.from({ length: count }, () => ({ exerciseId: 'hack-squat', region: 'knee', report, comparable }));

const expert = typeof EXERCISE_BY_ID['hack-squat']?.intelligence?.kneeCost === 'number'
    ? EXERCISE_BY_ID['hack-squat']!.intelligence!.kneeCost as number : 0;
ok(learnedCost('hack-squat', 'kneeCost', exposures(2, 'strained')).learned === false, 'two exposures are not enough to learn');
ok(learnedCost('hack-squat', 'kneeCost', exposures(3, 'strained', false)).learned === false, 'incomparable exposures do not teach');

const up = learnedCost('hack-squat', 'kneeCost', exposures(3, 'strained'));
ok(up.learned && up.value === Math.min(4, expert + 1), 'learning moves the cost by exactly one step up');
const down = learnedCost('hack-squat', 'kneeCost', exposures(4, 'normal'));
ok(down.value === Math.max(0, expert - 1), 'learning moves the cost by exactly one step down');
const far = learnedCost('hack-squat', 'kneeCost', exposures(20, 'impaired'));
ok(Math.abs(far.value - expert) <= 1, 'learning never drifts more than one step from the expert value');

// --- nothing applies without confirmation ------------------------------------
const day = () => EVENT_HORIZON_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 2)!;
const untouched = EVENT_HORIZON_CONFIG.hooks!.preprocessDay!(day(), { eventHorizonStatus: { reports: [{ week: 1, region: 'knee', report: 'impaired', exerciseId: 'hack-squat', comparable: true }] } } as unknown as UserProfile);
ok(untouched.exercises[0].exerciseId === 'hack-squat', 'a report alone changes nothing');

const accepted = EVENT_HORIZON_CONFIG.hooks!.preprocessDay!(day(), { eventHorizonStatus: { acceptedSwaps: { 'hack-squat': 'leg-press' } } } as unknown as UserProfile);
ok(accepted.exercises[0].exerciseId === 'leg-press', 'an accepted swap is applied');

// A split replaces one movement with two, without doubling the work.
const split = EVENT_HORIZON_CONFIG.hooks!.preprocessDay!(day(), { eventHorizonStatus: { acceptedSwaps: { 'hack-squat': ['leg-press', 'leg-extension'] } } } as unknown as UserProfile);
const splitSlots = split.exercises.filter(e => ['leg-press', 'leg-extension'].includes(e.exerciseId ?? ''));
ok(splitSlots.length >= 2, 'a split produces two slots');
const original = day().exercises[0].sets;
ok(splitSlots.slice(0, 2).reduce((n, e) => n + e.sets, 0) <= original + 1, 'a split divides the work rather than doubling it');

// --- swap outcomes are tracked -----------------------------------------------
ok(swapVerdict({ acceptedExerciseId: 'leg-press', replacedExerciseId: 'hack-squat', followUpReport: 'normal', performanceHeld: true }) === 'helped', 'a clean follow-up counts as helped');
ok(swapVerdict({ acceptedExerciseId: 'leg-press', replacedExerciseId: 'hack-squat', followUpReport: 'impaired', performanceHeld: false }) === 'did-not-help', 'a bad follow-up is recorded honestly');
ok(swapVerdict({ acceptedExerciseId: 'leg-press', replacedExerciseId: 'hack-squat', followUpReport: 'normal', performanceHeld: false }) === 'mixed', 'relief at the cost of performance is mixed');

console.log(`Event Horizon verification passed: ${assertions} assertions.`);
