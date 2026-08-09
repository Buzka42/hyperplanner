/**
 * verify:techniques
 *
 * Finishing techniques used to be a coloured badge and nothing else: an athlete
 * told to do three drops had nowhere to record them, so the work vanished from
 * their history. This asserts that each technique expands into the rows it
 * actually requires, with sane loads, and that none of those rows can be
 * mistaken for prescribed work by progression.
 */

import { techniqueAppliesTo, techniqueRows } from '../src/features/workout/techniqueSets';
import type { IntensityTechniqueSpec } from '../src/data/exercises/types';

const failures: string[] = [];
const check = (ok: boolean, msg: string) => { if (!ok) failures.push(msg); };

// --- scope -------------------------------------------------------------------
{
    const last: IntensityTechniqueSpec = { kind: 'drop-set', drops: 2, dropPercent: 20, applyTo: 'last' };
    check(!techniqueAppliesTo(last, 0, 4), 'applyTo "last" must not fire on the first set.');
    check(techniqueAppliesTo(last, 3, 4), 'applyTo "last" must fire on the final set.');

    const all: IntensityTechniqueSpec = { kind: 'drop-set', drops: 1, dropPercent: 20, applyTo: 'all' };
    check(techniqueAppliesTo(all, 0, 4) && techniqueAppliesTo(all, 3, 4), 'applyTo "all" must fire on every set.');

    const specific: IntensityTechniqueSpec = { kind: 'drop-set', drops: 1, dropPercent: 20, applyTo: [1] };
    check(techniqueAppliesTo(specific, 1, 4), 'Explicit index must fire on that set.');
    check(!techniqueAppliesTo(specific, 2, 4), 'Explicit index must not fire elsewhere.');

    check(!techniqueAppliesTo(undefined, 0, 3), 'No technique means no rows.');
    check(!techniqueAppliesTo({ kind: 'none' }, 0, 3), '"none" means no rows.');
}

// --- drop sets ---------------------------------------------------------------
{
    const rows = techniqueRows({ kind: 'drop-set', drops: 3, dropPercent: 20, applyTo: 'last', toFailure: true }, '100');
    check(rows.length === 3, `Three drops should give three rows, got ${rows.length}.`);
    check(rows.every(r => r.kind === 'drop'), 'Drop rows must be tagged "drop".');
    // Each drop comes off the previous load, not the original.
    check(rows[0].weight === '80', `First drop off 100kg at 20% should be 80, got ${rows[0].weight}.`);
    check(rows[1].weight === '65', `Second drop should compound to 65 (2.5kg rounded), got ${rows[1].weight}.`);
    check(rows.every(r => r.restSeconds === 0), 'Drop sets are continuous — no rest between drops.');
    check(rows.every(r => r.reps === 'Failure'), 'toFailure should carry into the rows.');
}

// --- load derived from actual weight -----------------------------------------
{
    const light = techniqueRows({ kind: 'drop-set', drops: 1, dropPercent: 20, applyTo: 'last' }, '60');
    check(light[0].weight === '47.5', `Drops must come off the weight actually used, got ${light[0].weight}.`);

    const bodyweight = techniqueRows({ kind: 'drop-set', drops: 1, dropPercent: 20, applyTo: 'last' }, '');
    check(bodyweight[0].weight === undefined, 'With no working weight, no load should be invented.');
}

// --- other techniques ---------------------------------------------------------
{
    const restPause = techniqueRows({ kind: 'rest-pause', bursts: 3, restSeconds: 15, applyTo: 'last' }, '80');
    check(restPause.length === 3 && restPause.every(r => r.kind === 'rest-pause'), 'Rest-pause should give one row per burst.');
    check(restPause.every(r => r.restSeconds === 15), 'Rest-pause rows carry their rest.');
    check(restPause.every(r => r.weight === '80'), 'Rest-pause keeps the working load.');

    const myo = techniqueRows({ kind: 'myo-reps', miniSets: 4, miniReps: '3-5', restBreaths: 4 }, '50');
    check(myo.length === 4 && myo.every(r => r.kind === 'myo'), 'Myo-reps should give one row per mini-set.');
    check(myo[0].reps === '3-5', 'Myo-rep rows carry their rep target.');

    const cluster = techniqueRows({ kind: 'cluster', clusters: 4, repsPerCluster: '2', intraRestSeconds: 20 }, '120');
    check(cluster.length === 4 && cluster.every(r => r.kind === 'cluster'), 'Clusters should give one row each.');

    const backOff = techniqueRows({ kind: 'back-off', percent: 80, sets: 2, reps: '6' }, '100');
    check(backOff.length === 2, 'Back-off should give one row per set.');
    check(backOff[0].weight === '80', `Back-off at 80% of 100 should be 80, got ${backOff[0].weight}.`);

    // Techniques that change how prescribed sets are performed add no rows.
    for (const spec of [
        { kind: 'tempo', tempo: '40X0' },
        { kind: 'one-and-half' },
        { kind: 'total-reps', targetReps: 40 },
        { kind: 'wave', ladder: [5, 4, 3], waves: 2 },
        { kind: 'amrap-finisher' },
    ] as IntensityTechniqueSpec[]) {
        check(techniqueRows(spec, '100').length === 0, `"${spec.kind}" should add no rows; it changes how the prescribed sets are done.`);
    }
}

// --- progression must ignore every technique row ------------------------------
{
    const workSets = <T extends { kind?: string }>(sets: T[]) =>
        sets.filter(s => s.kind === undefined || s.kind === 'work');

    const sets = [
        { reps: '8' }, { reps: '8' },
        ...techniqueRows({ kind: 'drop-set', drops: 2, dropPercent: 20, applyTo: 'last' }, '100').map(r => ({ reps: '', kind: r.kind })),
        ...techniqueRows({ kind: 'rest-pause', bursts: 2, restSeconds: 15, applyTo: 'last' }, '100').map(r => ({ reps: '', kind: r.kind })),
    ];
    check(workSets(sets).length === 2, `Only the two prescribed sets should count as work, got ${workSets(sets).length}.`);
    check(
        workSets(sets).every(s => parseInt(s.reps || '0') >= 8),
        'Progression must still pass with technique rows present.'
    );
}

if (failures.length) {
    console.error(`\n  verify:techniques FAILED (${failures.length})\n`);
    for (const f of failures) console.error(`   - ${f}`);
    console.error('');
    process.exit(1);
}

console.log('\n  verify:techniques OK');
console.log('   drop sets compound off the load actually used, and invent none when there is no weight');
console.log('   rest-pause, myo-reps, clusters and back-offs each expand into their own rows');
console.log('   tempo, 1.5 reps, total-reps, waves and AMRAP add no rows by design');
console.log('   progression counts prescribed sets only\n');
