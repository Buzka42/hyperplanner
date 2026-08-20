/**
 * verify:lazarus
 *
 * The plan's safety property is the week 1–2 cap, and its honesty property is
 * that it prescribes from the last stable pre-break load rather than the
 * lifetime best. Both are asserted, along with the acceleration rule that is
 * the only thing allowed to loosen the caps — and only after they expire.
 */

import assert from 'node:assert/strict';
import { LAZARUS_CONFIG, LAZARUS_DAYS } from '../src/data/plans/lazarus';
import {
    detrainingFactor, injuryReturnGuidance, openingLoad, shouldAccelerate, weekSetCap, capIsHard,
} from '../src/features/lazarus/memoryCurve';
import type { LazarusStatus, UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

ok(LAZARUS_CONFIG.program.weeks.length === 8, 'Lazarus runs eight weeks');
ok(LAZARUS_DAYS.length === 3, 'Lazarus is three-day full body');
for (const day of LAZARUS_DAYS) {
    const sets = day.slots.reduce((n, slot) => n + slot.sets, 0);
    ok(sets >= 12 && sets <= 20, `${day.name} holds 12–20 sets (has ${sets})`);
    ok(day.slots.filter(slot => slot.systemicCompound).length === 1, `${day.name} has one systemic anchor`);
}

// --- the caps ----------------------------------------------------------------
ok(capIsHard(1) && capIsHard(2) && !capIsHard(3), 'weeks 1–2 are the hard-capped weeks');
ok(weekSetCap(1, 4) === 2 && weekSetCap(3, 4) === 4, 'the cap holds sets at two, then releases');

const setsIn = (week: number) => LAZARUS_CONFIG.program.weeks[week - 1].days
    .flatMap(d => d.exercises).reduce((n, e) => n + e.sets, 0);
ok(setsIn(1) < setsIn(3), 'week 1 carries less volume than week 3');
ok(LAZARUS_CONFIG.program.weeks[0].days.flatMap(d => d.exercises).every(e => e.sets <= 2), 'no week-1 slot exceeds two sets');

// The cap survives an athlete who feels ready, and survives preprocessDay.
const eager: UserProfile = { lazarusStatus: { breakMonths: 4, underestimated: [{ week: 1, date: '' }, { week: 2, date: '' }] } } as unknown as UserProfile;
const weekOne = LAZARUS_CONFIG.hooks!.preprocessDay!(LAZARUS_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!, eager);
ok(weekOne.exercises.every(e => e.sets <= 2), 'readiness does not lift the week-1 cap');
ok(!shouldAccelerate(eager.lazarusStatus, 2).accelerate, 'acceleration cannot fire inside the capped weeks');

// --- acceleration ------------------------------------------------------------
const twoClean: LazarusStatus = { underestimated: [{ week: 4, date: '' }, { week: 5, date: '' }] };
ok(shouldAccelerate(twoClean, 5).accelerate, 'two clean underestimated sessions accelerate');
ok(!shouldAccelerate({ underestimated: [{ week: 4, date: '' }] }, 5).accelerate, 'one session is not a pattern');
// Stale evidence expires rather than banking forever.
ok(!shouldAccelerate({ underestimated: [{ week: 1, date: '' }, { week: 2, date: '' }] }, 8).accelerate, 'old sessions do not accelerate week 8');

// --- the Memory Curve --------------------------------------------------------
ok(detrainingFactor(4) === 0.8 && detrainingFactor(8) === 0.7 && detrainingFactor(24) === 0.6, 'the discount deepens with time away');
ok(detrainingFactor(36) === detrainingFactor(24), 'the discount flattens rather than extrapolating forever');

const profile = { lifetimeBestKg: 140, preBreakKg: 120, source: 'profile' as const };
const opening = openingLoad(profile, 4);
ok(opening.openingKg === 95, 'the opening load is discounted from the pre-break number');
ok(opening.openingKg! < profile.lifetimeBestKg, 'the lifetime best never sets the prescription');
ok(!opening.requiresCalibration, 'a profile-sourced memory needs no calibration set');

const reported = openingLoad({ ...profile, source: 'self-reported' }, 4);
ok(reported.requiresCalibration, 'a self-reported memory is confirmed on first exposure');

const indirect = openingLoad(profile, 4, 'same-pattern');
ok(indirect.openingKg! < opening.openingKg!, 'indirect history opens lighter');
ok(indirect.requiresCalibration, 'indirect history requires calibration');

const blank = openingLoad(undefined, 6);
ok(blank.openingKg === undefined && blank.requiresCalibration, 'no memory means calibrate, not guess');

// A stale memory decays instead of being trusted at face value.
const stale = openingLoad(profile, 12, 'exact', '2020-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z');
ok(stale.confidence === 'expired' || stale.confidence === 'low', 'a years-old memory is low confidence');

// --- injury copy -------------------------------------------------------------
const guidance = injuryReturnGuidance(14);
ok(guidance.heading.includes('not rehabilitation'), 'injury copy refuses to pose as rehab');
ok(guidance.body.includes('physiotherapist'), 'injury copy points at a professional');
ok(guidance.suggestion === 'apex-predator', 'a long injury break suggests Apex');
ok(injuryReturnGuidance(4).suggestion === undefined, 'a short break makes no plan suggestion');

console.log(`Lazarus verification passed: ${assertions} assertions.`);
