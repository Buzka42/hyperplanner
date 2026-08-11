/**
 * verify:monolith
 *
 * Machine-dominant but not machine-exclusive, effort before technique, and no
 * superset that requires crossing the gym floor.
 */

import assert from 'node:assert/strict';
import { MONOLITH_CONFIG, MONOLITH_DAYS, DISTANT_PAIRS } from '../src/data/plans/monolith';
import { EXERCISE_BY_ID } from '../src/data/exercises/library';
import type { UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

ok(MONOLITH_CONFIG.program.weeks.length === 10, 'Monolith runs ten weeks');
ok(MONOLITH_DAYS.length === 4, 'Monolith is four-day');
ok(MONOLITH_DAYS.map(day => day.name).join(',') === 'Upper A,Lower A,Upper B,Lower B', 'the split is upper/lower');

const MACHINE = ['machine', 'hammer-strength', 'pec-deck', 'leg-extension', 'leg-curl', 'rear-delt-machine', 'hack-squat', 'smith', 'cable'];
const all = MONOLITH_DAYS.flatMap(day => day.slots);
const machineSlots = all.filter(slot => EXERCISE_BY_ID[slot.ex]?.equipment.some(item => MACHINE.includes(item)));
ok(machineSlots.length / all.length >= 0.7, `machine-dominant (${machineSlots.length}/${all.length} slots)`);
// Not machine-exclusive: banning free weights outright would be a theme, not a plan.
ok(machineSlots.length < all.length, 'free weights are not banned');

// Systemic cost stays bounded — that is the point of the machine bias.
for (const day of MONOLITH_DAYS) {
    ok(day.slots.filter(slot => slot.systemicCompound).length <= 1, `${day.name} carries at most one systemic anchor`);
    const sets = day.slots.reduce((n, slot) => n + slot.sets, 0);
    ok(sets >= 16 && sets <= 22, `${day.name} runs 16–22 sets (has ${sets})`);
}

// Both execution styles appear, rather than a page of bilateral machines.
for (const day of MONOLITH_DAYS) {
    ok(day.slots.some(slot => slot.unilateral), `${day.name} includes unilateral work`);
    ok(day.slots.some(slot => !slot.unilateral), `${day.name} includes bilateral work`);
}

// --- effort first, technique later -------------------------------------------
const techniquesIn = (week: number) => MONOLITH_CONFIG.program.weeks[week - 1].days
    .flatMap(d => d.exercises).filter(e => e.prescription?.technique).length;
const rpeIn = (week: number) => MONOLITH_CONFIG.program.weeks[week - 1].days
    .flatMap(d => d.exercises).filter(e => e.target.rpe).length;

ok(rpeIn(2) === 0 && techniquesIn(2) === 0, 'the first phase just places the work');
ok(rpeIn(5) > 0 && techniquesIn(5) === 0, 'effort rises before any technique appears');
ok(techniquesIn(8) > 0, 'techniques arrive only in the late phase');

// And only where a machine makes the technique safe alone.
const FREE_WEIGHT = ['barbell', 'dumbbell', 'kettlebell'];
const risky = MONOLITH_CONFIG.program.weeks[7].days.flatMap(d => d.exercises)
    .filter(e => e.prescription?.technique)
    .filter(e => {
        const equipment = EXERCISE_BY_ID[e.exerciseId ?? '']?.equipment ?? [];
        return equipment.some(item => FREE_WEIGHT.includes(item)) && !equipment.some(item => MACHINE.includes(item));
    });
ok(risky.length === 0, `drop sets never land on free-weight slots (found ${risky.map(e => e.exerciseId).join(', ')})`);

// --- combo machine and distant pairings --------------------------------------
ok(all.some(slot => slot.ex === 'machine-press-fly-combo'), 'the combo machine is used');
ok(all.some(slot => slot.ex === 'pec-deck'), 'the pec deck is used');
const comboDay = MONOLITH_DAYS.find(day => day.slots.some(slot => slot.ex === 'machine-press-fly-combo'))!;
ok(!comboDay.slots.some(slot => slot.ex === 'pec-deck'), 'the combo machine and pec deck are not even in the same session');

for (const [a, b] of DISTANT_PAIRS) {
    const shared = MONOLITH_DAYS.some(day => {
        const first = day.slots.find(slot => slot.ex === a);
        const second = day.slots.find(slot => slot.ex === b);
        return !!first?.pair && first.pair === second?.pair;
    });
    ok(!shared, `${a} and ${b} never share a superset`);
}

// The hook strips a distant pairing even if a future edit introduces one.
const day = MONOLITH_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!;
const forced = {
    ...day,
    exercises: day.exercises.map(exercise =>
        ['machine-press-fly-combo', 'pec-deck'].includes(exercise.exerciseId ?? '')
            ? { ...exercise, prescription: { ...exercise.prescription, pair: 'A1' } }
            : exercise),
};
const cleaned = MONOLITH_CONFIG.hooks!.preprocessDay!(
    { ...forced, exercises: [...forced.exercises, { ...forced.exercises[0], id: 'x', exerciseId: 'pec-deck', prescription: { pair: 'A1' } }] },
    {} as UserProfile,
);
ok(!cleaned.exercises.some(e => e.exerciseId === 'pec-deck' && e.prescription?.pair), 'a distant pairing is stripped at session build');

console.log(`Monolith verification passed: ${assertions} assertions.`);
