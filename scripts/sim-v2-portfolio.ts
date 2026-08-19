/**
 * sim-v2-portfolio — measures the portfolio before and after the post-audit votes.
 *
 * Applies `v2-change-map.ts` to each plan's materialised week and scores both
 * states with the same ruler, so every delta is attributable to a vote rather
 * than to a change in how the measurement works.
 *
 *   npx tsx scripts/sim-v2-portfolio.ts            # console table
 *   npx tsx scripts/sim-v2-portfolio.ts --json     # full before/after JSON
 */

import {
    materialise, score, ALL_PLAN_IDS, RESOLVER, extendLibrary, majorOf,
    type PlanWeek, type Slot,
} from './portfolio-metrics';
import { CHANGES, type Edit } from './v2-change-map';
import { ROUND2, PROPOSED_EXERCISES, SET_SHAPE } from './v2-round2-map';
import { DECISIONS } from './v3-owner-decisions';

extendLibrary(PROPOSED_EXERCISES);

const applyEdits = (week: PlanWeek, edits: Edit[]): { week: PlanWeek; warnings: string[] } => {
    let slots: Slot[] = week.slots.map(s => ({ ...s }));
    let trainingDays = week.trainingDays;
    const warnings: string[] = [];

    const nameOf = (id: string) => RESOLVER.byId(id as any)?.name.en ?? id;

    for (const edit of edits) {
        switch (edit.op) {
            case 'rebuild': {
                slots = [];
                edit.days.forEach((day, i) => {
                    for (const [id, sets] of day.slots) {
                        if (!RESOLVER.byId(id as any)) warnings.push(`unknown id in rebuild: ${id}`);
                        slots.push({ day: i + 1, dayName: day.name, name: nameOf(id), id, sets });
                    }
                });
                trainingDays = edit.days.length;
                break;
            }
            case 'swap': {
                if (!RESOLVER.byId(edit.to as any)) warnings.push(`swap target missing from library: ${edit.to}`);
                const targets = slots.filter(s => s.id === edit.from && (edit.day === undefined || s.day === edit.day));
                if (!targets.length) { warnings.push(`swap found no ${edit.from}${edit.day ? ` on day ${edit.day}` : ''}`); break; }
                for (const slot of targets.slice(0, edit.limit ?? targets.length)) {
                    slot.id = edit.to;
                    slot.name = nameOf(edit.to);
                }
                break;
            }
            case 'add': {
                if (!RESOLVER.byId(edit.id as any)) warnings.push(`add target missing from library: ${edit.id}`);
                slots.push({ day: edit.day, dayName: `Day ${edit.day}`, name: nameOf(edit.id), id: edit.id, sets: edit.sets });
                break;
            }
            case 'drop': {
                const before = slots.length;
                slots = slots.filter(s => !(s.id === edit.id && (edit.day === undefined || s.day === edit.day)));
                if (slots.length === before) warnings.push(`drop found no ${edit.id}`);
                break;
            }
            case 'setSets': {
                const targets = slots.filter(s => s.id === edit.id && (edit.day === undefined || s.day === edit.day));
                if (!targets.length) { warnings.push(`setSets found no ${edit.id}`); break; }
                for (const slot of targets) slot.sets = edit.sets;
                break;
            }
        }
    }

    return { week: { ...week, slots, trainingDays }, warnings };
};

/**
 * Applies the set-shape policy: no slot below the floor, no isolation accessory
 * above the cap unless the plan specialises in that muscle.
 *
 * Rules rather than a hand-written list, so the policy stays arguable — and so
 * a plan that later changes its exercises does not silently keep an exemption
 * written for a movement it no longer runs.
 */
const normaliseSetShape = (week: PlanWeek): { week: PlanWeek; changes: string[] } => {
    const changes: string[] = [];
    if (SET_SHAPE.floorExempt.has(week.planId)) return { week, changes };

    const exemptGroups = new Set(SET_SHAPE.capExempt[week.planId] ?? []);
    const byDay = new Map<number, Slot[]>();
    for (const s of week.slots) {
        if (!byDay.has(s.day)) byDay.set(s.day, []);
        byDay.get(s.day)!.push(s);
    }

    const slots = week.slots.map(s => ({ ...s }));
    for (const [, daySlots] of byDay) {
        daySlots.forEach((slot, index) => {
            const target = slots.find(s => s === slot) ?? slots.find(s => s.day === slot.day && s.id === slot.id)!;
            const entry = RESOLVER.byId(slot.id as any);
            // A timed/density block has no "second set" to add — leave it.
            if (!entry || slot.block || SET_SHAPE.skipPatterns.has(entry.pattern)) return;

            if (target.sets < SET_SHAPE.floor) {
                changes.push(`${slot.name} ${target.sets}→${SET_SHAPE.floor} sets (floor)`);
                target.sets = SET_SHAPE.floor;
                return;
            }
            // The first slot of a day is its driver; a 4+ block after it on an
            // isolation is the case worth capping.
            const isIsolation = SET_SHAPE.isolationPatterns.has(entry.pattern);
            const specialises = (entry.primary ?? []).some(m => {
                const g = majorOf(m);
                return g ? exemptGroups.has(g) : false;
            });
            if (index > 0 && isIsolation && !specialises && target.sets > SET_SHAPE.isolationCap) {
                changes.push(`${slot.name} ${target.sets}→${SET_SHAPE.isolationCap} sets (accessory cap)`);
                target.sets = SET_SHAPE.isolationCap;
            }
        });
    }

    return { week: { ...week, slots }, changes };
};

export const simulate = () => ALL_PLAN_IDS.map(planId => {
    const base = materialise(planId);
    if (!base) return { planId, error: 'no materialised week' };

    const change = CHANGES[planId];
    const r1 = change ? applyEdits(base, change.edits) : { week: base, warnings: ['no change-map entry'] };

    const round2 = ROUND2[planId];
    const r2edits = round2 ? applyEdits(r1.week, round2.edits) : { week: r1.week, warnings: [] as string[] };

    /*
     * Set-shape policy runs on the round-2 state, then the owner's round-3
     * decisions are applied on top and are NOT re-normalised.
     *
     * The order matters: the generic cap trims accessory isolations to 3 sets,
     * which silently reverted an explicit decision to put King of the Squat's
     * triceps and calves back above a growth dose. A per-plan judgement call
     * has to beat a catalogue-wide default, not lose to it.
     */
    const shaped = normaliseSetShape(r2edits.week);
    const decision = DECISIONS[planId];
    const r3edits = decision ? applyEdits(shaped.week, decision.edits) : { week: shaped.week, warnings: [] as string[] };

    return {
        planId,
        before: score(base),
        after: score(r1.week),                 // round 1: the audit votes
        final: score(r3edits.week),            // rounds 2-3: variety, set shape, owner decisions
        warnings: [...r1.warnings, ...r2edits.warnings, ...r3edits.warnings],
        setShapeChanges: shaped.changes,
        change: change ?? null,
        round2: round2 ?? null,
        decision: decision ?? null,
        afterWeek: r1.week,
        finalWeek: r3edits.week,
    };
});

// Importing this module must not print — build-portfolio-report consumes
// `simulate()` and writes JSON to the same stdout.
const isEntry = process.argv[1]?.replace(/\\/g, '/').endsWith('sim-v2-portfolio.ts');
const results = isEntry ? simulate() : [];

if (!isEntry) {
    // no-op: imported as a library
} else if (process.argv.includes('--json')) {
    console.log(JSON.stringify(results, null, 1));
} else {
    const pad = (v: unknown, n: number) => String(v).padStart(n);
    console.log('plan                      sets(b→a)   /sess    var(b→a)  sys(b→a)  ax(b→a)  psS');
    for (const r of results) {
        if (!('before' in r) || !r.before || !r.after) { console.log(r.planId, (r as any).error); continue; }
        const b = r.before, a = (r as any).final ?? r.after;
        console.log(
            r.planId.padEnd(24),
            `${pad(b.totalSets, 4)}→${pad(a.totalSets, 4)}`,
            pad(a.setsPerSession, 6),
            `${pad(b.distinctExercises, 4)}→${pad(a.distinctExercises, 3)}`,
            `${pad(b.systemic, 4)}→${pad(a.systemic, 4)}`,
            `${pad(b.axial, 4)}→${pad(a.axial, 4)}`,
            pad(a.perSetSystemic, 5),
        );
    }
    const allWarn = results.flatMap(r => ('warnings' in r ? r.warnings.map(w => `${r.planId}: ${w}`) : []));
    if (allWarn.length) {
        console.log('\nwarnings:');
        for (const w of allWarn) console.log('  ' + w);
    }
}
