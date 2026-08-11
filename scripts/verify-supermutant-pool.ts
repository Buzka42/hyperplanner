/**
 * verify:supermutant-pool
 *
 * The pool mode's contract is mostly negative: with it off, Super Mutant must
 * behave exactly as it did before, and with it on, only movement names may
 * change. Both directions are asserted, because a regression here damages a
 * plan that already works.
 */

import assert from 'node:assert/strict';
import { SUPER_MUTANT_CONFIG } from '../src/data/supermutant';
import {
    SUPER_MUTANT_POOL, poolModeEnabled, recordPoolUse, rotateSession, selectFromPool, slotIdentity, type PoolState,
} from '../src/features/superMutant/pool';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { buildPreviewUser } from '../src/pages/admin/previewUser';
import type { UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

// --- the pool is real ---------------------------------------------------------
const ids = new Set(EXERCISE_LIBRARY.map(exercise => exercise.id));
for (const [muscle, entries] of Object.entries(SUPER_MUTANT_POOL)) {
    ok(entries.length >= 4, `${muscle} has a pool worth rotating`);
    ok(entries.some(entry => entry.role === 'main'), `${muscle} has a main movement`);
    for (const entry of entries) ok(ids.has(entry.id), `${entry.id} resolves in the library`);
}

// --- slot identity ------------------------------------------------------------
ok(slotIdentity('chest-a-pre')?.role === 'preExhaust', 'a pre-exhaust slot is recognised');
ok(slotIdentity('chest-b-main')?.role === 'main', 'a main slot is recognised');
ok(slotIdentity('chest-a-finish')?.role === 'finisher', 'a finisher slot is recognised');
ok(slotIdentity('back-b-2')?.muscle === 'back', 'numbered slots resolve their muscle');
ok(slotIdentity('super-mutant') === undefined, 'a non-slot id is ignored');
ok(slotIdentity('abs-1') === undefined, 'a muscle with no pool is left alone');

// --- default is the base programme -------------------------------------------
ok(!poolModeEnabled(undefined), 'pool mode is off for an untouched profile');
ok(!poolModeEnabled({ exerciseSelections: {} }), 'pool mode is off without an explicit choice');
ok(poolModeEnabled({ exerciseSelections: { mode: 'pool' } }), 'pool mode turns on when chosen');

const user = buildPreviewUser('super-mutant');
const day = SUPER_MUTANT_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!;
const baseline = SUPER_MUTANT_CONFIG.hooks!.preprocessDay!(day, user);
const again = SUPER_MUTANT_CONFIG.hooks!.preprocessDay!(day, user);
ok(JSON.stringify(baseline) === JSON.stringify(again), 'the base programme is unchanged and deterministic');
ok(baseline.exercises.length > 0, 'the base generator still produces a session');

const opted: UserProfile = {
    ...user,
    planPreferences: { ...(user.planPreferences ?? {}), 'super-mutant': { scheduleMode: 'auto', updatedAt: '', exerciseSelections: { mode: 'pool' } } },
};
const rotated = SUPER_MUTANT_CONFIG.hooks!.preprocessDay!(day, opted);

// --- only names change --------------------------------------------------------
ok(rotated.exercises.length === baseline.exercises.length, 'the session keeps its shape');
ok(rotated.dayName === baseline.dayName, 'the cluster identity is untouched');
for (let index = 0; index < baseline.exercises.length; index++) {
    const before = baseline.exercises[index];
    const after = rotated.exercises[index];
    ok(before.id === after.id, `slot ${index + 1} keeps its identity`);
    ok(before.sets === after.sets, `slot ${index + 1} keeps its set count`);
    ok(JSON.stringify(before.target) === JSON.stringify(after.target), `slot ${index + 1} keeps its target`);
    ok(before.notes === after.notes, `slot ${index + 1} keeps its coaching notes`);
}
ok(rotated.exercises.some((exercise, index) => exercise.name !== baseline.exercises[index].name),
    'pool mode actually rotates at least one movement');

// --- rotation is least-recently-used and deterministic ------------------------
const state: PoolState = { lastUsed: { chest: { 'incline-dumbbell-bench-press': '2026-05-01T00:00:00.000Z' } } };
const first = selectFromPool('chest', 'main', state, 'incline-dumbbell-bench-press');
ok(first !== 'incline-dumbbell-bench-press', 'the movement just performed is not handed back');
ok(selectFromPool('chest', 'main', state) === selectFromPool('chest', 'main', state), 'selection is deterministic');

const used = recordPoolUse(state, 'chest', first!, '2026-06-01T00:00:00.000Z');
ok(used.lastUsed!.chest[first!] === '2026-06-01T00:00:00.000Z', 'a completed exposure is recorded');
ok(selectFromPool('chest', 'main', used, first) !== first, 'the rotation moves on after use');

// Exclusions are permanent.
const excluded: PoolState = { excluded: ['front-squat', 'stiletto-squat'] };
const quadChoices = new Set([1, 2, 3].map(() => selectFromPool('quads', 'main', excluded)));
ok(!quadChoices.has('front-squat') && !quadChoices.has('stiletto-squat'), 'excluded movements are never offered');

// A pool that has been excluded down to nothing keeps the current movement
// rather than emptying the slot.
const everything: PoolState = { excluded: SUPER_MUTANT_POOL.calves.map(entry => entry.id) };
ok(selectFromPool('calves', 'main', everything, 'hack-calf-raise') === 'hack-calf-raise', 'an empty pool keeps the slot');

// And rotation never drops a slot.
ok(rotateSession([{ id: 'chest-a-main', name: 'Incline DB Bench Press' }], undefined).length === 1, 'rotation preserves the session length');
// A rotated slot names a real movement, not an id leaked into the UI.
const rotatedNames = new Set(EXERCISE_LIBRARY.map(exercise => exercise.name.en));
for (const exercise of rotated.exercises) {
    if (!slotIdentity(exercise.id)) continue;
    ok(rotatedNames.has(exercise.name) || baseline.exercises.some(base => base.name === exercise.name),
        `${exercise.name} is a real movement name`);
}

console.log(`Super Mutant pool verification passed: ${assertions} assertions.`);
