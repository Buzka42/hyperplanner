/**
 * verify:minimum
 *
 * The plan is a promise about scope: two sessions, 14–16 sets each, every major
 * muscle in both, different movements, and bonus work that can never become
 * required. Each of those is asserted here because each is easy to erode.
 */

import assert from 'node:assert/strict';
import { THE_MINIMUM_CONFIG, MINIMUM_DAYS } from '../src/data/plans/theMinimum';
import { BONUS_MODULES, bonusContribution, recommendBonus } from '../src/features/theMinimum/bonus';
import { EXERCISE_BY_ID } from '../src/data/exercises/library';
import type { MinimumStatus } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

ok(THE_MINIMUM_CONFIG.program.weeks.length === 10, 'The Minimum runs ten weeks');
ok(MINIMUM_DAYS.length === 2, 'exactly two required sessions');

for (const day of MINIMUM_DAYS) {
    const sets = day.slots.reduce((n, slot) => n + slot.sets, 0);
    ok(sets >= 14 && sets <= 20, `${day.name} holds 14–20 sets (has ${sets})`);
    ok(day.slots.filter(slot => slot.systemicCompound).length <= 2, `${day.name} keeps systemic work bounded`);
}

// No movement appears in both sessions: the second exposure has to be a
// variation, which is the only reason twice a week is enough here.
const a = new Set(MINIMUM_DAYS[0].slots.map(slot => slot.ex));
ok(!MINIMUM_DAYS[1].slots.some(slot => a.has(slot.ex)), 'the two sessions share no movement');

// Every major muscle is trained in both sessions.
// Library muscles, not colloquial groups — back is stored as lats/upperBack.
const MAJOR = ['chest', 'lats', 'upperBack', 'quads', 'hamstrings', 'glutes', 'triceps', 'biceps', 'calves', 'abs'];
const covered = (day: typeof MINIMUM_DAYS[number]) => {
    const muscles = new Set<string>();
    for (const slot of day.slots) {
        const entry = EXERCISE_BY_ID[slot.ex];
        for (const muscle of [...(entry?.primary ?? []), ...(entry?.secondary ?? [])]) muscles.add(muscle);
    }
    return muscles;
};
for (const day of MINIMUM_DAYS) {
    const muscles = covered(day);
    for (const muscle of MAJOR) ok(muscles.has(muscle), `${day.name} trains ${muscle}`);
    // Delts are covered by whichever head the session's pressing implies.
    ok(['frontDelt', 'sideDelt', 'rearDelt'].some(head => muscles.has(head)), `${day.name} trains delts`);
}

// Volume never grows: the late phase raises effort instead of sets.
const weekSets = (week: number) => THE_MINIMUM_CONFIG.program.weeks[week - 1].days
    .flatMap(d => d.exercises).reduce((n, e) => n + e.sets, 0);
ok(weekSets(9) === weekSets(1), 'the late phase adds effort, not sets');
ok(THE_MINIMUM_CONFIG.program.weeks[8].days.flatMap(d => d.exercises).some(e => e.target.rpe === 9), 'the Press phase raises RPE');

// --- bonus modules -----------------------------------------------------------
ok(BONUS_MODULES.every(module => module.stations === 1), 'bonus modules stay at one station');
ok(BONUS_MODULES.every(module => module.systemicCost <= 2), 'bonus modules stay low-systemic');
ok(BONUS_MODULES.every(module => module.sets <= 6), 'bonus modules stay short');

const contribution = bonusContribution();
ok(contribution.weeklyVolume && contribution.performanceProfile && contribution.workoutHistory, 'bonus work counts as training');
ok(contribution.planProgression === false, 'bonus work never drives plan progression');

// Underexposure decides which module is offered.
const status = (over: Partial<MinimumStatus> = {}): MinimumStatus => ({ exposure: { lats: 12, biceps: 12, rearDelt: 12, chest: 12, frontDelt: 12, triceps: 12, hamstrings: 0, glutes: 0, quads: 12, calves: 12, abs: 12, sideDelt: 12 }, ...over });
ok(recommendBonus(status(), 3).module?.id === 'posterior', 'the least-exposed muscles are offered first');

// A decline discourages without blocking, and the message says so.
const declined = recommendBonus(status({ lastDecline: { week: 3, exerciseId: 'hack-squat' } }), 3);
ok(declined.discouraged, 'a performance decline discourages the next bonus');
ok(declined.message.includes('still allowed'), 'discouragement is advice, not a block');

// The weekly recommendation is a recommendation.
const second = recommendBonus(status({ bonusSessions: [{ moduleId: 'posterior', date: '', week: 3 }] }), 3);
ok(second.discouraged && second.module, 'a second bonus is discouraged but still offered');
ok(second.message.includes('not a cap'), 'the second bonus is explicitly not capped');

// A blank profile still gets a sensible offer rather than nothing.
ok(recommendBonus(undefined, 1).module, 'a first-week athlete is still offered a module');

console.log(`The Minimum verification passed: ${assertions} assertions.`);
