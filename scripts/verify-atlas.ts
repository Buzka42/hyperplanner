/**
 * verify:atlas
 *
 * Atlas is two five-week gauntlets, carries scored as time × load, and a hinge
 * the athlete chooses from an approved list. The gauntlet switch is the part
 * most likely to break silently, so it is checked week by week.
 */

import assert from 'node:assert/strict';
import { ATLAS_CONFIG, ATLAS_GAUNTLET_ONE, ATLAS_GAUNTLET_TWO } from '../src/data/plans/atlas';
import {
    APPROVED_HINGES, POWER_POOL, carryScore, compareCarries, gauntletFor, isPowerWork, limiterAdvice,
    type CarryResult,
} from '../src/features/atlas/carries';
import { EXERCISE_BY_ID } from '../src/data/exercises/library';
import type { UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

ok(ATLAS_CONFIG.program.weeks.length === 10, 'Atlas runs ten weeks');
ok(ATLAS_GAUNTLET_ONE.length === 3 && ATLAS_GAUNTLET_TWO.length === 3, 'both gauntlets are three-day');

// --- gauntlets ---------------------------------------------------------------
for (const week of [1, 3, 5]) ok(gauntletFor(week) === 1, `week ${week} is in the first gauntlet`);
for (const week of [6, 8, 10]) ok(gauntletFor(week) === 2, `week ${week} is in the second gauntlet`);

const session = (week: number, dayOfWeek: number) => ATLAS_CONFIG.hooks!.preprocessDay!(
    ATLAS_CONFIG.program.weeks[week - 1].days.find(d => d.dayOfWeek === dayOfWeek)!, {} as UserProfile);

ok(session(5, 1).exercises[0].exerciseId === 'safety-bar-squat', 'gauntlet one holds through week 5');
ok(session(6, 1).exercises[0].exerciseId === 'front-squat', 'gauntlet two takes over at week 6');
ok(session(10, 3).exercises[0].exerciseId === 'trap-bar-deadlift', 'the hinge anchor survives the switch');

// Five weeks is the point: the movement set must not change inside a gauntlet.
const firstDayIds = (week: number) => session(week, 1).exercises.map(e => e.exerciseId).join(',');
ok(firstDayIds(1) === firstDayIds(5), 'the first gauntlet is stable for five weeks');
ok(firstDayIds(6) === firstDayIds(10), 'the second gauntlet is stable for five weeks');
ok(firstDayIds(1) !== firstDayIds(6), 'the second gauntlet changes the movement set');

// --- carries -----------------------------------------------------------------
for (const days of [ATLAS_GAUNTLET_ONE, ATLAS_GAUNTLET_TWO]) {
    const carries = days.flatMap(day => day.slots.filter(slot => ['farmer-carry', 'suitcase-carry', 'suitcase-hold'].includes(slot.ex)));
    ok(carries.length >= 3, 'every gauntlet carries weekly');
    ok(days.filter(day => day.slots.some(slot => slot.ex === 'farmer-carry')).length === 1, 'one main carry exposure a week');
    ok(days.filter(day => day.slots.some(slot => ['suitcase-carry', 'suitcase-hold'].includes(slot.ex))).length === 2, 'two shorter carry exposures a week');
    ok(carries.every(slot => slot.notes?.includes('time × load')), 'carries state their metric');
}

const carry = (over: Partial<CarryResult> = {}): CarryResult => ({ exerciseId: 'farmer-carry', seconds: 60, loadKg: 40, implements: 2, ...over });
ok(carryScore(carry()) === 80, 'a carry scores load × implements × minutes');
ok(carryScore(carry({ implements: 1 })) === 40, 'a one-implement carry is not counted twice');
ok(compareCarries(carry({ seconds: 70 }), carry()) === 'better', 'longer at the same load is better');
ok(compareCarries(carry({ loadKg: 50 }), carry()) === 'better', 'heavier for the same time is better');
ok(compareCarries(carry({ loadKg: 50, seconds: 48 }), carry()) === 'equal', 'the trade is expressed in one number');

// The limiter tag is advice, and only after a pattern.
ok(limiterAdvice([carry({ limiter: 'grip' })]) === undefined, 'one tag is not a pattern');
ok(limiterAdvice([carry({ limiter: 'grip' }), carry({ limiter: 'trunk' })]) === undefined, 'mixed limiters give no advice');
ok(limiterAdvice([carry({ limiter: 'grip' }), carry({ limiter: 'grip' })])?.includes('suitcase hold'), 'a repeated grip limiter earns specific advice');
ok(limiterAdvice([carry({ limiter: 'trunk' }), carry({ limiter: 'trunk' })])?.includes('shorten'), 'a trunk limiter shortens the carry rather than dropping it');

// --- hinge choice ------------------------------------------------------------
ok(APPROVED_HINGES.includes('conventional-deadlift') && APPROVED_HINGES.includes('sumo-deadlift'), 'both conventional and sumo are approved');
ok(APPROVED_HINGES.every(id => EXERCISE_BY_ID[id]), 'every approved hinge exists in the library');
const sumo = ATLAS_CONFIG.hooks!.preprocessDay!(
    ATLAS_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 3)!,
    { planPreferences: { atlas: { scheduleMode: '3day', updatedAt: '', exerciseSelections: { hinge: 'sumo-deadlift' } } } } as unknown as UserProfile);
ok(sumo.exercises[0].exerciseId === 'sumo-deadlift', 'the chosen hinge is applied');
const bogus = ATLAS_CONFIG.hooks!.preprocessDay!(
    ATLAS_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 3)!,
    { planPreferences: { atlas: { scheduleMode: '3day', updatedAt: '', exerciseSelections: { hinge: 'leg-press' } } } } as unknown as UserProfile);
ok(bogus.exercises[0].exerciseId === 'trap-bar-deadlift', 'an unapproved hinge is ignored');

// --- power work --------------------------------------------------------------
ok(POWER_POOL.every(id => EXERCISE_BY_ID[id]), 'every power movement exists in the library');
ok(isPowerWork('turkish-get-up') && !isPowerWork('safety-bar-squat'), 'power work is identifiable');
// Optional means absent from the prescription, not merely flagged.
const prescribed = new Set([...ATLAS_GAUNTLET_ONE, ...ATLAS_GAUNTLET_TWO].flatMap(day => day.slots.map(slot => slot.ex)));
ok(POWER_POOL.every(id => !prescribed.has(id)), 'power work is never a required slot');

console.log(`Atlas verification passed: ${assertions} assertions.`);
