/**
 * verify:portfolio-shape — the portfolio-level targets from the PROC-1 plan.
 *
 * Reads the shipped plans and checks the figures the whole review was aiming
 * at: plans stay distinct from each other, the library keeps getting spent, and
 * the dose does not drift. Run with --strict to fail the build.
 */

import { materialise, score, ALL_PLAN_IDS } from './portfolio-metrics';

const sets = new Map<string, Set<string>>();
const metrics: ReturnType<typeof score>[] = [];
for (const id of ALL_PLAN_IDS) {
    const week = materialise(id);
    if (!week) continue;
    sets.set(id, new Set(week.slots.map(s => s.id)));
    metrics.push(score(week));
}

const jaccard = (a: Set<string>, b: Set<string>) => {
    let inter = 0;
    for (const v of a) if (b.has(v)) inter += 1;
    return inter / (a.size + b.size - inter);
};

const ids = [...sets.keys()];
const pairs: { a: string; b: string; score: number }[] = [];
for (let i = 0; i < ids.length; i += 1)
    for (let j = i + 1; j < ids.length; j += 1)
        pairs.push({ a: ids[i], b: ids[j], score: jaccard(sets.get(ids[i])!, sets.get(ids[j])!) });
pairs.sort((x, y) => y.score - x.score);

const used = new Set<string>();
for (const s of sets.values()) for (const v of s) used.add(v);
const median = (v: number[]) => { const a = [...v].sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
const live = metrics.filter(m => m.planId !== 'iron-clock');
const mean = pairs.reduce((s, p) => s + p.score, 0) / pairs.length;

/** [label, actual, bound, direction] — bounds are the PROC-1 plan's §7.2 targets. */
const checks: [string, number, number, 'max' | 'min'][] = [
    ['near-clone pairs (>0.5 overlap)', pairs.filter(p => p.score > 0.5).length, 2, 'max'],
    ['mean pairwise similarity', Math.round(mean * 1000) / 1000, 0.15, 'max'],
    ['library movements in use', used.size, 185, 'min'],
    ['median distinct exercises', median(live.map(m => m.distinctExercises)), 22, 'min'],
    ['median axial per set', median(live.map(m => m.perSetAxial)), 0.42, 'max'],
];

let failed = 0;
for (const [label, actual, bound, dir] of checks) {
    const ok = dir === 'max' ? actual <= bound : actual >= bound;
    if (!ok) failed += 1;
    console.log(`  ${ok ? ' ' : '!'} ${label.padEnd(34)} ${String(actual).padStart(7)}   (${dir} ${bound})`);
}
console.log('\n  closest pairs:');
for (const p of pairs.slice(0, 3)) console.log(`     ${p.score.toFixed(3)}  ${p.a} ~ ${p.b}`);

if (failed && process.argv.includes('--strict')) {
    console.error(`\n  verify:portfolio-shape FAILED — ${failed} target(s) missed\n`);
    process.exit(1);
}
console.log(`\n  verify:portfolio-shape — ${checks.length - failed}/${checks.length} targets met\n`);
