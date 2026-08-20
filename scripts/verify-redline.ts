/**
 * verify:redline
 *
 * REDLINE's promises are structural — a 40–50 minute session, one heavy anchor,
 * paired burn work and timed finishers whose expiry is what makes density
 * comparable. Each is asserted here because none of them survives a careless
 * edit to the day table.
 */

import assert from 'node:assert/strict';
import { REDLINE_CONFIG, REDLINE_DAYS } from '../src/data/plans/redline';
import type { UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

ok(REDLINE_DAYS.length === 4, 'REDLINE is four-day');
ok(REDLINE_CONFIG.program.weeks.length === 8, 'REDLINE runs eight weeks');

for (const day of REDLINE_DAYS) {
    const anchors = day.slots.filter(slot => slot.block?.kind === 'anchor');
    ok(anchors.length === 1, `${day.name} has exactly one anchor`);
    ok(anchors[0].restSeconds === 180, `${day.name} rests the anchor properly`);

    const burn = day.slots.filter(slot => slot.block?.kind === 'burn');
    ok(burn.length >= 4, `${day.name} pairs enough burn work`);
    ok(burn.every(slot => slot.pair), `${day.name} pairs every burn slot`);
    // A pair label with no partner is a superset that silently became a
    // straight set, which is what breaks the session's time budget.
    for (const slot of burn) {
        const letter = slot.pair![0];
        const partners = burn.filter(other => other.block!.id === slot.block!.id && other.pair![0] === letter);
        ok(partners.length === 2, `${day.name} ${slot.pair} has a partner`);
    }

    const finishers = day.slots.filter(slot => slot.block?.kind === 'finisher');
    ok(finishers.length >= 1, `${day.name} ends on a timed finisher`);
    ok(finishers.every(slot => slot.optional), `${day.name} keeps finishers optional`);
    ok(finishers.every(slot => slot.block!.durationSeconds), `${day.name} times every finisher`);

    // Session budget: work sets only, since finishers run on the clock.
    const sets = day.slots.filter(slot => slot.block?.kind !== 'finisher').reduce((n, slot) => n + slot.sets, 0);
    ok(sets >= 12 && sets <= 20, `${day.name} holds 12–20 work sets (has ${sets})`);
}

// Finisher duration ladder: 5 → 6 → 7 → 8 minutes, then back to 5 in Ashes.
const finisherSeconds = (week: number) => {
    const day = REDLINE_CONFIG.program.weeks[week - 1].days.find(d => d.dayOfWeek === 1)!;
    return day.exercises.find(e => e.prescription?.block?.kind === 'finisher')!.prescription!.block!.durationSeconds;
};
for (const [week, expected] of [[1, 300], [3, 360], [5, 420], [6, 480], [8, 300]] as const) {
    ok(finisherSeconds(week) === expected, `week ${week} finisher runs ${expected}s`);
}

// Week 8 (Ashes) sheds burn volume rather than intensity.
const burnSets = (week: number) => REDLINE_CONFIG.program.weeks[week - 1].days
    .flatMap(d => d.exercises).filter(e => e.prescription?.block?.kind === 'burn')
    .reduce((n, e) => n + e.sets, 0);
ok(burnSets(8) < burnSets(7), 'Ashes reduces burn volume');

// The Furnace choice is persistent, not re-asked per session.
const furnace = (choice?: string) => REDLINE_CONFIG.hooks!.preprocessDay!(
    REDLINE_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 4)!,
    { planPreferences: choice ? { redline: { scheduleMode: '4day', updatedAt: '', exerciseSelections: { furnaceAnchor: choice } } } : undefined } as unknown as UserProfile,
);
ok(furnace().exercises[0].exerciseId === 'paused-bench-press', 'Furnace defaults to Paused Bench');
ok(furnace('standing-barbell-military-press').exercises[0].exerciseId === 'standing-barbell-military-press', 'Furnace honours Standing OHP');

// Recovery: advisory, confirmed, and visibly reversible — an unconfirmed answer
// must never quietly shrink the session.
const withRecovery = (response: string, confirmed: boolean) => REDLINE_CONFIG.hooks!.preprocessDay!(
    REDLINE_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!,
    { redlineStatus: { nextRecovery: { response, confirmed, recordedAt: '' } } } as unknown as UserProfile,
);
const baseline = withRecovery('recovered', true);
const baselineBurn = baseline.exercises.filter(e => e.prescription?.block?.kind === 'burn').reduce((n, e) => n + e.sets, 0);
ok(withRecovery('performance-impaired', false).exercises.length === baseline.exercises.length, 'unconfirmed recovery changes nothing');

const fatigued = withRecovery('somewhat-fatigued', true);
const fatiguedBurn = fatigued.exercises.filter(e => e.prescription?.block?.kind === 'burn').reduce((n, e) => n + e.sets, 0);
ok(fatiguedBurn < baselineBurn, 'fatigue reduces burn volume');
ok(fatigued.exercises.some(e => e.prescription?.block?.kind === 'finisher'), 'fatigue keeps the finisher available');

const impaired = withRecovery('performance-impaired', true);
ok(!impaired.exercises.some(e => e.prescription?.block?.kind === 'finisher'), 'impaired recovery drops the finisher');
ok(impaired.exercises.some(e => e.prescription?.block?.kind === 'anchor'), 'impaired recovery keeps the anchor');

console.log(`REDLINE verification passed: ${assertions} assertions.`);
