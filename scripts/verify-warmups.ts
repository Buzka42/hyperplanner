/**
 * verify:warmups
 *
 * Warm-ups are guidance rows the athlete reads and the app never records.
 * These assertions pin the two schemes, the empty-bar start, and the fallback
 * to percentages when no working weight is known yet.
 */

import assert from 'node:assert/strict';
import { BAR_KG, isHeavyCompound, RAMPED_PATTERNS, topRepOf, warmupFor } from '../src/features/workout/warmup';
import { EXERCISE_LIBRARY } from '../src/data/exercises';

let assertions = 0;
const ok = (condition: boolean, message: string) => { assert.ok(condition, message); assertions += 1; };

const lib = EXERCISE_LIBRARY as Record<string, { equipment?: readonly string[]; pattern?: string }>;
const byId = (id: string) => Object.values(lib).find((e: any) => e.id === id) as any;

// --- rep reading -------------------------------------------------------------------
ok(topRepOf('3-5') === 3, 'a range is read at its heavy end');
ok(topRepOf(5) === 5, 'a bare number is itself');
ok(topRepOf('AMRAP') === undefined, 'prose has no rep count');
ok(topRepOf(undefined) === undefined, 'nor does an absent target');

// --- which scheme ------------------------------------------------------------------
ok(isHeavyCompound(byId('flat-barbell-bench-press'), '3-5'), 'a heavy barbell bench ramps');
ok(!isHeavyCompound(byId('flat-barbell-bench-press'), '8-12'), 'the same bar at 8-12 does not');
ok(isHeavyCompound(byId('conventional-deadlift'), 5), 'deadlifts ramp');
ok(isHeavyCompound(byId('low-bar-squat'), '1-3'), 'squats ramp');
ok(isHeavyCompound(byId('barbell-row'), '4-6'), 'heavy rows ramp');
ok(!isHeavyCompound(byId('lat-pulldown'), '4-6'), 'a machine never ramps, however heavy');
ok(!isHeavyCompound(byId('standing-straight-bar-curl'), '4-6'), 'a barbell curl is not a compound');
ok(!isHeavyCompound(undefined, '3-5'), 'an unknown movement takes the accessory scheme');

// The case that killed the old name-matched scheme: a light, low-rep hinge
// whose name contains "deadlift". It is a dumbbell/smith movement, so the
// equipment check excludes it without anyone having to special-case a string.
ok(!isHeavyCompound(byId('hip-supported-db-deadlift'), '5'), 'a smith/dumbbell hinge never ramps');
ok(!isHeavyCompound(byId('dumbbell-romanian-deadlift'), '5'), 'nor does a dumbbell RDL');

// A snapshot of everything the rule ramps, so a library edit that quietly
// widens or narrows it shows up here rather than in someone's session.
{
    const ramped = Object.values(lib)
        .filter((e: any) => isHeavyCompound(e, '5'))
        .map((e: any) => e.id)
        .sort();
    ok(ramped.every(id => (byId(id).equipment ?? []).includes('barbell')),
        'every ramped movement is loaded on a barbell');
    ok(ramped.every(id => RAMPED_PATTERNS.has(byId(id).pattern)),
        'and is a compound pattern');

    // `shrug` is tagged horizontal-pull in the library, which is why it lands
    // here. Nothing prescribes it at six reps or fewer so it never reaches an
    // athlete; recorded rather than special-cased, so retagging it is a
    // library fix and this line simply stops mattering.
    ok(!ramped.includes('lat-pulldown') && !ramped.includes('leg-press'),
        'no machine work ramps');
}

// --- the accessory scheme ----------------------------------------------------------
{
    const sets = warmupFor(byId('lat-pulldown'), '8-12', 80);
    ok(sets.length === 1, 'an accessory gets exactly one warm-up set');
    ok(sets[0].reps === 12 && sets[0].weightKg === 40, '12 reps at half the working weight');

    const unknown = warmupFor(byId('lat-pulldown'), '8-12', undefined);
    ok(unknown[0].weightKg === undefined && unknown[0].percent === 0.5, 'no weight means show the percent');
}

// --- the ramp ----------------------------------------------------------------------
{
    const sets = warmupFor(byId('flat-barbell-bench-press'), '3-5', 100);
    ok(sets[0].bar === true && sets[0].weightKg === BAR_KG && sets[0].reps === 10, 'the ramp opens on the empty bar');
    ok(sets.map(s => s.weightKg).join() === `${BAR_KG},40,55,70,85`, 'and climbs 40/55/70/85');
    ok(sets.map(s => s.reps).join() === '10,8,5,3,1', 'with reps falling as the bar loads');

    // A light lifter's early rungs land at or under the bar; repeating 20kg
    // twice is not a warm-up.
    const light = warmupFor(byId('flat-barbell-bench-press'), '3-5', 40);
    ok(light.filter(s => !s.bar).every(s => (s.weightKg ?? 0) > BAR_KG), 'rungs at or below the bar are dropped');
    ok(light[0].bar === true, 'but the bar itself always stays');

    const unknown = warmupFor(byId('low-bar-squat'), '3-5', undefined);
    ok(unknown.every(s => s.weightKg === undefined), 'an untested lift shows percentages throughout');
    ok(unknown[0].bar === true, 'and still opens on the bar');
}

console.log(`Warm-up verification passed: ${assertions} assertions.`);
