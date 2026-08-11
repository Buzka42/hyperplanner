/**
 * verify:quadfather
 *
 * The plan claims a specific shape: quads three times, everything else twice,
 * and three distinct quad roles rather than three heavy squat sessions. It also
 * claims that depth is confirmed and that knee feedback never swaps anything
 * silently. All of that is asserted here.
 */

import assert from 'node:assert/strict';
import { QUADFATHER_CONFIG, QUADFATHER_DAYS } from '../src/data/plans/quadfather';
import {
    BURN_POOL, DEPTH_BY_VARIATION, proposeKneeSwap, recommendMainLoad, resolveDepth, roleBalance, roleOf,
} from '../src/features/quadfather/roles';
import { EXERCISE_BY_ID } from '../src/data/exercises/library';
import type { UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

ok(QUADFATHER_CONFIG.program.weeks.length === 10, 'Quadfather runs ten weeks');
ok(QUADFATHER_DAYS.length === 4, 'Quadfather is four-day');

// --- frequency ---------------------------------------------------------------
const quadDays = QUADFATHER_DAYS.filter(day => day.slots.some(slot => roleOf(slot.ex)));
ok(quadDays.length === 3, 'quads are trained on exactly three days');

const exposures = (exerciseIds: string[]) => QUADFATHER_DAYS.filter(day => day.slots.some(slot => exerciseIds.includes(slot.ex))).length;
ok(exposures(['incline-dumbbell-bench-press', 'hammer-chest-press']) === 2, 'chest is maintained twice');
ok(exposures(['lat-pulldown', 'hammer-pulldown', 'single-arm-hammer-row']) >= 2, 'back is maintained at least twice');
ok(exposures(['romanian-deadlift', 'seated-hamstring-curl', 'lying-leg-curl']) === 2, 'hamstrings are maintained twice');
ok(exposures(['hack-calf-raise']) === 2, 'calves are maintained twice');
ok(exposures(['hammer-curl']) === 2 && exposures(['cable-triceps-extension']) === 2, 'arms are maintained twice');

// --- roles -------------------------------------------------------------------
for (const day of quadDays) {
    const balance = roleBalance(day.slots.map(slot => slot.ex));
    const total = balance.load + balance.depth + balance.burn;
    ok(total >= 2, `${day.name} carries at least two quad roles`);
    // A quad day that is only load is the failure mode this plan exists to avoid.
    ok(!(balance.load === total), `${day.name} is not load-only`);
}
const allRoles = roleBalance(QUADFATHER_DAYS.flatMap(day => day.slots.map(slot => slot.ex)));
ok(allRoles.load >= 2 && allRoles.depth >= 3 && allRoles.burn >= 3, 'all three roles are represented across the week');

// Stripper Squat is a burn movement, never a strength variant.
ok(roleOf('stripper-squat') === 'burn', 'Stripper Squat is a burn movement');
ok(BURN_POOL.includes('supported-sissy-squat') && BURN_POOL.includes('leg-extension') && BURN_POOL.includes('reverse-nordic-curl'), 'the burn pool matches the specification');
// The late phase must not promote burn work into the strength role.
const lateLoad = QUADFATHER_CONFIG.program.weeks[8].days.flatMap(d => d.exercises)
    .filter(e => e.target.reps === '4-6').map(e => e.exerciseId!);
ok(lateLoad.every(id => roleOf(id) === 'load'), 'only load-role movements go heavy late');

// --- main load ---------------------------------------------------------------
ok(recommendMainLoad('regular').exerciseId === 'hack-squat', 'Hack Squat is the default main load');
ok(recommendMainLoad('regular').alternatives.includes('barbell-squat'), 'free squatting is offered to regular proportions');
ok(recommendMainLoad('long').alternatives[0] === 'stiletto-squat', 'long limbs are offered the Stiletto Squat first');
ok(recommendMainLoad('long').alternatives.includes('barbell-squat'), 'the free squat is never withheld');

const chosen = QUADFATHER_CONFIG.hooks!.preprocessDay!(
    QUADFATHER_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!,
    { planPreferences: { quadfather: { scheduleMode: '4day', updatedAt: '', exerciseSelections: { mainLoad: 'stiletto-squat' } } } } as unknown as UserProfile,
);
ok(chosen.exercises[0].exerciseId === 'stiletto-squat', 'the confirmed main load is used');

// --- range of motion ---------------------------------------------------------
ok(resolveDepth('front-foot-elevated-bulgarian-split-squat').source === 'inferred', 'an approved variation implies its depth');
ok(resolveDepth('hack-squat').source === 'unknown', 'an open movement asks rather than assumes');
ok(resolveDepth('hack-squat', { rom: { 'hack-squat': { confirmed: 'below-parallel', week: 2 } } }).source === 'confirmed', 'a confirmation is used');
ok(resolveDepth('high-box-squat', { rom: { 'high-box-squat': { confirmed: 'parallel', week: 2 } } }).depth === 'parallel', 'confirmation beats inference');
ok(Object.values(DEPTH_BY_VARIATION).every(depth => ['partial', 'parallel', 'below-parallel'].includes(depth)), 'inferred depths use the documented scale');

const unconfirmed = QUADFATHER_CONFIG.hooks!.preprocessDay!(QUADFATHER_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!, {} as UserProfile);
ok(unconfirmed.exercises[0].notes?.includes('Confirm your depth'), 'unconfirmed depth is asked for, not invented');

// --- knee feedback -----------------------------------------------------------
ok(proposeKneeSwap('hack-squat', 'normal') === undefined, 'normal knees produce no offer');
const strained = proposeKneeSwap('hack-squat', 'strained');
ok(strained?.requiresConfirmation === true, 'every knee swap requires confirmation');
ok(strained?.preservedRole === 'load' || !strained?.to, 'a swap preserves the slot role');
if (strained?.to) {
    const before = EXERCISE_BY_ID['hack-squat']?.intelligence?.kneeCost;
    const after = EXERCISE_BY_ID[strained.to]?.intelligence?.kneeCost;
    ok(typeof after === 'number' && typeof before === 'number' && after < before, 'a swap actually lowers knee cost');
}
const impaired = proposeKneeSwap('leg-extension', 'impaired');
ok(impaired !== undefined, 'impaired feedback always produces an offer');
ok(impaired!.to ? true : impaired!.message.includes('physiotherapist'), 'with no lower-cost option, impaired feedback points at a professional');

// An accepted swap is applied; an unaccepted proposal is not.
const swapped = QUADFATHER_CONFIG.hooks!.preprocessDay!(
    QUADFATHER_CONFIG.program.weeks[2].days.find(d => d.dayOfWeek === 1)!,
    { quadfatherStatus: { kneeFeedback: [{ week: 1, exerciseId: 'hack-squat', severity: 'strained', acceptedSwap: 'leg-press' }] } } as unknown as UserProfile,
);
ok(swapped.exercises[0].exerciseId === 'leg-press', 'an accepted swap is applied');
const notAccepted = QUADFATHER_CONFIG.hooks!.preprocessDay!(
    QUADFATHER_CONFIG.program.weeks[2].days.find(d => d.dayOfWeek === 1)!,
    { quadfatherStatus: { kneeFeedback: [{ week: 1, exerciseId: 'hack-squat', severity: 'strained' }] } } as unknown as UserProfile,
);
ok(notAccepted.exercises[0].exerciseId === 'hack-squat', 'an unconfirmed proposal changes nothing');

console.log(`Quadfather verification passed: ${assertions} assertions.`);
