/**
 * verify:cathedral
 *
 * Cathedral's specification is unusually concrete: chest three times, three
 * balanced arches, no barbell bench anywhere, and a fatigue response that moves
 * sets between arches rather than deleting them.
 */

import assert from 'node:assert/strict';
import { CATHEDRAL_CONFIG, CATHEDRAL_DAYS } from '../src/data/plans/cathedral';
import {
    COMBO_MACHINE, FORBIDDEN, adjustForLimitingFatigue, archBalance, archOf, chestProfile, isBalanced,
} from '../src/features/cathedral/arches';
import { EXERCISE_BY_ID } from '../src/data/exercises/library';
import type { CathedralStatus, UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

ok(CATHEDRAL_CONFIG.program.weeks.length === 10, 'Cathedral runs ten weeks');
ok(CATHEDRAL_DAYS.length === 4, 'Cathedral is four-day');

// --- no barbell bench, anywhere ----------------------------------------------
const allExercises = CATHEDRAL_DAYS.flatMap(day => day.slots.map(slot => slot.ex));
for (const forbidden of FORBIDDEN) {
    ok(!allExercises.includes(forbidden), `${forbidden} never appears`);
}
ok(allExercises.includes('30-smith-incline-bench-press'), 'Smith incline is the approved bar alternative');
ok(EXERCISE_BY_ID[COMBO_MACHINE], 'the combo machine exists in the library');

// --- frequency ---------------------------------------------------------------
const chestDays = CATHEDRAL_DAYS.filter(day => day.slots.some(slot => archOf(slot.ex)));
ok(chestDays.length === 3, 'chest is trained three times');
ok(!CATHEDRAL_DAYS[1].slots.some(slot => archOf(slot.ex)), 'the lower day carries no chest work');

// --- the three arches --------------------------------------------------------
const setsById: Record<string, number> = {};
for (const day of CATHEDRAL_DAYS) for (const slot of day.slots) setsById[slot.ex] = (setsById[slot.ex] ?? 0) + slot.sets;
const weekly = archBalance(Object.keys(setsById), setsById);
ok(weekly.press > 0 && weekly.stretch > 0 && weekly.adduction > 0, 'all three arches are trained weekly');
ok(isBalanced(weekly), `the arches are balanced weekly (${JSON.stringify(weekly)})`);

ok(!isBalanced({ press: 12, stretch: 2, adduction: 2 }), 'a pressing plan does not count as balanced');
ok(isBalanced({ press: 8, stretch: 4, adduction: 6 }), 'half of the largest arch is the balance floor');

// Each chest day leads with a different arch, so no exposure repeats the last.
const leads = chestDays.map(day => archOf(day.slots[0].ex));
ok(new Set(leads).size === 3, 'each chest day leads with a different arch');
ok(leads[0] === 'press', 'the heavy press day leads the week');

// --- limiting fatigue --------------------------------------------------------
const status = (regions: CathedralStatus['limitingFatigue']): CathedralStatus => ({ limitingFatigue: regions });
ok(adjustForLimitingFatigue(status([{ week: 4, region: 'chest' }, { week: 5, region: 'chest' }]), 5).shiftSets === 0,
    'pec-limited pressing changes nothing');

const shift = adjustForLimitingFatigue(status([{ week: 4, region: 'triceps' }, { week: 5, region: 'frontDelt' }]), 5);
ok(shift.shiftSets === 2 && shift.from === 'press' && shift.to === 'adduction', 'non-pec fatigue shifts pressing toward adduction');
ok(shift.requiresConfirmation, 'the shift is offered, never imposed');
ok(adjustForLimitingFatigue(status([{ week: 5, region: 'triceps' }]), 5).shiftSets === 0, 'one report is not a pattern');
ok(adjustForLimitingFatigue(status([{ week: 1, region: 'triceps' }, { week: 2, region: 'triceps' }]), 8).shiftSets === 0, 'stale reports expire');

// The shift is applied only after confirmation, and it moves sets rather than
// deleting them.
const day1 = () => CATHEDRAL_CONFIG.program.weeks[5].days.find(d => d.dayOfWeek === 1)!;
const fatigued = { cathedralStatus: status([{ week: 5, region: 'triceps' }, { week: 6, region: 'triceps' }]) } as unknown as UserProfile;
const unconfirmed = CATHEDRAL_CONFIG.hooks!.preprocessDay!(day1(), fatigued);
ok(unconfirmed.exercises.reduce((n, e) => n + e.sets, 0) === day1().exercises.reduce((n, e) => n + e.sets, 0), 'an unconfirmed shift changes nothing');

const confirmed = CATHEDRAL_CONFIG.hooks!.preprocessDay!(day1(), {
    ...fatigued,
    planPreferences: { cathedral: { scheduleMode: '4day', updatedAt: '', exerciseSelections: { acceptedArchShift: 'yes' } } },
} as unknown as UserProfile);
const before = archBalance(day1().exercises.map(e => e.exerciseId!), Object.fromEntries(day1().exercises.map(e => [e.exerciseId!, e.sets])));
const after = archBalance(confirmed.exercises.map(e => e.exerciseId!), Object.fromEntries(confirmed.exercises.map(e => [e.exerciseId!, e.sets])));
ok(after.press < before.press, 'a confirmed shift reduces pressing');
ok(after.adduction > before.adduction, 'the sets land in adduction rather than vanishing');
ok(after.press + after.adduction + after.stretch === before.press + before.adduction + before.stretch, 'total chest volume is preserved');
ok(confirmed.exercises.some(e => e.notes?.includes('adduction')), 'the athlete is told why the session changed');

// --- combo machine -----------------------------------------------------------
const combo = CATHEDRAL_CONFIG.hooks!.preprocessDay!(day1(), {
    cathedralStatus: { comboMachineRole: 'adduction' },
    planPreferences: { cathedral: { scheduleMode: '4day', updatedAt: '', exerciseSelections: { useComboMachine: 'yes' } } },
} as unknown as UserProfile);
ok(combo.exercises.some(e => e.exerciseId === COMBO_MACHINE), 'the combo machine fills the assigned arch');
ok(archOf(COMBO_MACHINE, 'adduction') === 'adduction' && archOf(COMBO_MACHINE, 'press') === 'press', 'the combo machine can serve either arch');
ok(!CATHEDRAL_CONFIG.hooks!.preprocessDay!(day1(), {} as UserProfile).exercises.some(e => e.exerciseId === COMBO_MACHINE),
    'the combo machine is opt-in');

// --- dashboard ---------------------------------------------------------------
const profile = chestProfile(weekly, status([{ week: 6, region: 'triceps' }]));
ok(profile.totalSets === weekly.press + weekly.stretch + weekly.adduction, 'the profile combines the arches');
ok(profile.limitingFatigue === 'triceps', 'the limiting factor stays visible, not averaged away');

console.log(`Cathedral verification passed: ${assertions} assertions.`);
