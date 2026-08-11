/**
 * verify:seed-loads
 *
 * Seeded maxes are the one place the app puts a number in front of an athlete
 * that nobody measured. The rules that keep that honest are asserted here:
 * every derivation is owner-approved, no machine movement is ever derived, a
 * seed only ever fills a gap, and every seeded stat is actually askable at
 * onboarding.
 */

import assert from 'node:assert/strict';
import { LIFT_SOURCES, maxFor, openingLoad, seedLoadFor, statsUsedBy } from '../src/features/onboarding/seedLoads';
import { benchmarkLiftsFor } from '../src/data/benchmarkLifts';
import { EXERCISE_BY_ID } from '../src/data/exercises/library';
import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_IDS } from '../src/data/planMeta';
import type { LiftingStats, UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

// --- the derivation table ------------------------------------------------------
for (const [id, source] of Object.entries(LIFT_SOURCES)) {
    ok(EXERCISE_BY_ID[id], `${id} exists in the library`);
    ok(source.percent > 0.5 && source.percent <= 1.1, `${id} derives at a sane percentage`);
    // A derived number must be askable, or it can never resolve.
    ok(benchmarkLiftsFor([source.from]).length === 1, `${source.from} is askable at onboarding`);
}

// Machine movements are never derived: a hack squat load means nothing across
// gyms, so those calibrate on the first working set instead.
for (const id of ['hack-squat', 'leg-press', 'hammer-chest-press', 'leg-extension', 'lat-pulldown', 'hammer-pulldown']) {
    ok(!LIFT_SOURCES[id], `${id} is not derived — machines calibrate on the first set`);
}

// --- the approved percentages ---------------------------------------------------
const stats: Partial<LiftingStats> = { squat: 200, conventionalDeadlift: 200, flatBench: 100, pausedBench: 100, standingPress: 60 };

ok(maxFor(stats, 'front-squat')?.kg === 170, 'front squat derives at 85% of the squat');
ok(maxFor(stats, 'safety-bar-squat')?.kg === 180, 'safety bar derives at 90%');
ok(maxFor(stats, 'trap-bar-deadlift')?.kg === 210, 'trap bar derives at 105% of the conventional deadlift');
ok(maxFor(stats, 'sumo-deadlift')?.kg === 200, 'sumo derives at parity');
ok(maxFor(stats, 'close-grip-bench-press')?.kg === 92.5, 'close grip derives at 92% of the flat bench');
ok(maxFor(stats, 'incline-barbell-bench-press')?.kg === 85, 'incline barbell derives at 85%');
// The existing Bench Domination precedent stays intact.
ok(maxFor(stats, 'wide-grip-bench-press')?.kg === 92.5, 'wide grip keeps its 92% of the paused bench');
ok(maxFor(stats, 'spoto-press')?.kg === 95, 'Spoto keeps its 95%');
ok(maxFor(stats, 'low-pin-press')?.kg === 87.5, 'low pin keeps its 88%');

// A movement the athlete entered directly is not flagged as an estimate.
ok(maxFor(stats, 'barbell-squat')?.derived === false, 'an entered max is not an estimate');
ok(maxFor(stats, 'front-squat')?.derived === true, 'a derived max says so');

// Nothing is invented from nothing.
ok(maxFor({}, 'front-squat') === undefined, 'no parent max means no derivation');
ok(maxFor({ squat: 0 }, 'front-squat') === undefined, 'a zero max is not a max');
ok(maxFor(stats, 'lateral-raise') === undefined, 'movements outside the table are never seeded');

// --- opening loads ---------------------------------------------------------------
ok(openingLoad(100, 5) < 100, 'an opening load is below the max');
ok(openingLoad(100, 10) < openingLoad(100, 5), 'higher rep targets open lighter');
ok(openingLoad(0, 5) === 0, 'no max means no load');
// Deliberately conservative: catching up takes a week, overshooting costs two.
ok(openingLoad(100, 5) <= 100 / (1 + 5 / 30), 'the opening load is not optimistic');

const seed = seedLoadFor(stats, 'barbell-squat', '5-8');
ok(seed && seed.kg > 0, 'a seeded slot produces a load');
ok(seedLoadFor(stats, 'barbell-squat', '5-8')!.kg < seedLoadFor(stats, 'barbell-squat', '3-5')!.kg,
    'the top of the rep range sets the opening load');
ok(seedLoadFor({}, 'barbell-squat', '5-8') === undefined, 'no max means no seed');

// --- plans -----------------------------------------------------------------------
const seeded = PLAN_IDS.filter(id => PLAN_REGISTRY[id].onboarding?.seedStats?.length);
ok(seeded.length > 0, 'some plans seed their opening loads');
for (const id of seeded) {
    const config = PLAN_REGISTRY[id];
    const stats_ = config.onboarding!.seedStats!;
    ok(benchmarkLiftsFor(stats_).length === stats_.length, `${id} can ask for every stat it seeds`);

    // A seeded stat has to be used by something the plan actually prescribes.
    const prescribed = config.program.weeks[0].days.flatMap(day => day.exercises.map(exercise => exercise.exerciseId ?? ''));
    const used = new Set(statsUsedBy(config.program.weeks.flatMap(week => week.days.flatMap(day => day.exercises.map(e => e.exerciseId ?? '')))));
    for (const stat of stats_) ok(used.has(stat), `${id} seeds ${stat}, which one of its movements uses`);
    ok(prescribed.length > 0, `${id} prescribes movements in week 1`);
}

// The seed fills a gap; it never overrides a plan that already has an answer.
const config = PLAN_REGISTRY['oracle'];
const user = { stats: { ...stats } } as unknown as UserProfile;
const withSeed = config.hooks?.calculateWeight?.({ type: 'range', reps: '5-8' }, user, 'Barbell Squat', { week: 1, day: 1 });
ok(withSeed && Number(withSeed) > 0, 'Oracle seeds its squat from an entered max');
const withoutSeed = config.hooks?.calculateWeight?.({ type: 'range', reps: '5-8' }, { stats: {} } as unknown as UserProfile, 'Barbell Squat', { week: 1, day: 1 });
ok(withoutSeed === undefined, 'with no max, the generic calibration path runs instead');
ok(config.hooks?.calculateWeight?.({ type: 'range', reps: '8-12' }, user, 'Hack Squat', { week: 1, day: 1 }) === undefined,
    'machine anchors are never seeded');

console.log(`Seed-load verification passed: ${assertions} assertions across ${Object.keys(LIFT_SOURCES).length} derivations and ${seeded.length} seeded plans.`);
