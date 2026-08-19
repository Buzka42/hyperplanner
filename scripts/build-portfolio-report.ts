/**
 * build-portfolio-report — emits the data behind the v2 simulation review.
 *
 * Writes a single JSON blob (per-plan before/after metrics, portfolio
 * aggregates, plan-similarity matrix and exercise concentration) that the
 * HTML chart embeds, so the chart never carries hand-typed numbers.
 *
 *   npx tsx scripts/build-portfolio-report.ts > report.json
 */

import { materialise, setShape, extendLibrary } from './portfolio-metrics';
import { simulate } from './sim-v2-portfolio';
import { CHANGES } from './v2-change-map';
import { ROUND2, PROPOSED_EXERCISES } from './v2-round2-map';
import { specFit } from './spec-fit';
import { reviewFlags } from './review-flags';
import { DECISIONS } from './v3-owner-decisions';

extendLibrary(PROPOSED_EXERCISES);

const results = simulate().filter((r): r is Extract<typeof r, { before: any }> => 'before' in r);

const idsOf = (slots: { id: string }[]) => new Set(slots.map(s => s.id));
const before = new Map<string, Set<string>>();
const after = new Map<string, Set<string>>();
for (const r of results) {
    const base = materialise(r.planId)!;
    before.set(r.planId, idsOf(base.slots));
    after.set(r.planId, idsOf(r.finalWeek.slots));
}

const jaccard = (a: Set<string>, b: Set<string>) => {
    let inter = 0;
    for (const v of a) if (b.has(v)) inter += 1;
    return inter / (a.size + b.size - inter);
};

const nearest = (map: Map<string, Set<string>>, id: string) => {
    let best = { plan: '', score: 0 };
    for (const [other, set] of map) {
        if (other === id) continue;
        const s = jaccard(map.get(id)!, set);
        if (s > best.score) best = { plan: other, score: Math.round(s * 1000) / 1000 };
    }
    return best;
};

const concentration = (map: Map<string, Set<string>>) => {
    const counts: Record<string, number> = {};
    for (const set of map.values()) for (const id of set) counts[id] = (counts[id] ?? 0) + 1;
    return counts;
};

const pairScores = (map: Map<string, Set<string>>) => {
    const ids = [...map.keys()];
    const out: { a: string; b: string; score: number }[] = [];
    for (let i = 0; i < ids.length; i += 1)
        for (let j = i + 1; j < ids.length; j += 1)
            out.push({ a: ids[i], b: ids[j], score: Math.round(jaccard(map.get(ids[i])!, map.get(ids[j])!) * 1000) / 1000 });
    return out.sort((x, y) => y.score - x.score);
};

const median = (v: number[]) => { const s = [...v].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const mean = (v: number[]) => v.reduce((s, x) => s + x, 0) / v.length;

const live = results.filter(r => !CHANGES[r.planId]?.parked);
const agg = (key: keyof typeof live[0]['before']) => ({
    beforeMedian: Math.round(median(live.map(r => Number(r.before[key]) || 0)) * 100) / 100,
    afterMedian: Math.round(median(live.map(r => Number(r.after[key]) || 0)) * 100) / 100,
    finalMedian: Math.round(median(live.map(r => Number(r.final[key]) || 0)) * 100) / 100,
    beforeMean: Math.round(mean(live.map(r => Number(r.before[key]) || 0)) * 100) / 100,
    afterMean: Math.round(mean(live.map(r => Number(r.after[key]) || 0)) * 100) / 100,
    finalMean: Math.round(mean(live.map(r => Number(r.final[key]) || 0)) * 100) / 100,
});

const fitById = Object.fromEntries(specFit().map(f => [f.planId, f]));
const beforePairs = pairScores(before);
const afterPairs = pairScores(after);
const cBefore = concentration(before);
const cAfter = concentration(after);

console.log(JSON.stringify({
    generated: new Date().toISOString().slice(0, 10),
    plans: results.map(r => ({
        planId: r.planId,
        name: r.before.name,
        parked: CHANGES[r.planId]?.parked ?? false,
        votes: CHANGES[r.planId]?.votes ?? [],
        editCount: CHANGES[r.planId]?.edits.length ?? 0,
        pickerOptions: (CHANGES[r.planId]?.pickers ?? []).reduce((s, p) => s + Math.max(0, p.options.length - 1), 0),
        pickers: CHANGES[r.planId]?.pickers ?? [],
        nonStructural: CHANGES[r.planId]?.nonStructural ?? [],
        open: CHANGES[r.planId]?.open ?? [],
        edits: CHANGES[r.planId]?.edits ?? [],
        round2Rationale: ROUND2[r.planId]?.rationale ?? '',
        round2Edits: (ROUND2[r.planId]?.edits ?? []).length,
        setShapeChanges: r.setShapeChanges,
        flags: reviewFlags(r.planId, r.finalWeek),
        decision: DECISIONS[r.planId] ?? null,
        shape: setShape(r.finalWeek),
        shapeBefore: setShape(materialise(r.planId)!),
        specFit: fitById[r.planId] ?? null,
        before: r.before,
        after: r.after,
        final: r.final,
        nearestBefore: nearest(before, r.planId),
        nearestAfter: nearest(after, r.planId),
    })),
    aggregates: {
        totalSets: agg('totalSets'), setsPerSession: agg('setsPerSession'),
        distinctExercises: agg('distinctExercises'), varietyDensity: agg('varietyDensity'),
        systemic: agg('systemic'), axial: agg('axial'),
        perSetSystemic: agg('perSetSystemic'), perSetAxial: agg('perSetAxial'),
        avgLengthened: agg('avgLengthened'), stimulusPerFatigue: agg('stimulusPerFatigue'),
        groupsInMav: agg('groupsInMav'), twicePlusGroups: agg('twicePlusGroups'),
        failureSafeShare: agg('failureSafeShare'), evenness: agg('evenness'),
    },
    similarity: {
        meanBefore: Math.round(mean(beforePairs.map(p => p.score)) * 1000) / 1000,
        meanAfter: Math.round(mean(afterPairs.map(p => p.score)) * 1000) / 1000,
        clonesBefore: beforePairs.filter(p => p.score > 0.5).length,
        clonesAfter: afterPairs.filter(p => p.score > 0.5).length,
        // The same twelve pairs, scored in both states, so the slopegraph never
        // has to guess an after-value that fell out of the after top-12.
        topBefore: beforePairs.slice(0, 12).map(p => ({
            ...p,
            after: Math.round(jaccard(after.get(p.a)!, after.get(p.b)!) * 1000) / 1000,
        })),
        topAfter: afterPairs.slice(0, 12),
    },
    concentration: {
        distinctBefore: Object.keys(cBefore).length,
        distinctAfter: Object.keys(cAfter).length,
        libraryActive: 230,
        top: Object.entries(cAfter)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([id, count]) => ({ id, before: cBefore[id] ?? 0, after: count })),
    },
}, null, 1));
