/**
 * dump-plan-facts — emits the measured facts behind docs/plans/*.md.
 *
 * One JSON blob per plan: card copy, portfolio row, materialised representative
 * week, metrics, set shape and per-day breakdown. The plan docs are written from
 * this file so every number in them is the number the app actually produces.
 */
import * as fs from 'fs';
import { PLAN_META, ORDERED_PLAN_META } from '../src/data/planMeta';
import { PORTFOLIO } from '../src/data/portfolio';
import { PLAN_REGISTRY } from '../src/data/plans';
import { translations } from '../src/contexts/translations';
import { materialise, score, setShape } from './portfolio-metrics';
import { PROGRESSION_HANDLERS, progressionHandlerFor } from '../src/features/workout/progression';



const en: any = (translations as any).en;
const dig = (obj: any, path: string) => path.split('.').reduce((o, k) => o?.[k], obj);

/** Day names are stored as `t:` translation keys; render them in English. */
const label = (name: string) => {
    // Day names are either a bare `t:` key or a key followed by a literal
    // suffix the plan appends, e.g. `t:dayNames.mondayRecovery DELOAD`.
    if (typeof name !== 'string' || !name.startsWith('t:')) return name;
    const [key, ...rest] = name.slice(2).split(' ');
    const translated = dig(en, key);
    if (translated === undefined) return name;
    return [translated, ...rest].join(' ');
};

/** Enough profile for a preprocessDay hook to run without throwing. */
const previewUser = (planId: string): any => ({
    id: 'docs', codeword: 'docs', programId: planId,
    startDate: '2026-01-05T00:00:00.000Z', completedSessions: 0,
    selectedDays: [1, 2, 3, 4, 5, 6],
    stats: { pausedBench: 100, wideGripBench: 90, spotoPress: 95, lowPinPress: 88, btnPress: 40,
        squat: 140, lowBarSquat: 140, conventionalDeadlift: 180, bodyweightKg: 82 },
    benchHistory: [], programProgress: {}, badges: [],
    pencilneckStatus: { cycle: 1 }, skeletonStatus: { plankTargetSeconds: 30 },
});

/**
 * Plan ids whose own save-time handler composes the shared double progression.
 *
 * `progressionHandlerFor` uses genericDoubleProgression only as a *fallback*,
 * so a plan with its own handler does not get double progression unless that
 * handler calls it. Labelling every slot "double progression" without checking
 * would be wrong for the thirteen plans that implement their own rule instead.
 */
const COMPOSES_DOUBLE = (() => {
    // planId -> handler symbol -> module file, read out of the registry so a
    // renamed module cannot silently mislabel a plan (gravity-is-optional's
    // handler lives in gravity.ts, which no naming convention would guess).
    const index = fs.readFileSync('src/features/workout/progression/index.ts', 'utf8');
    const moduleOf = new Map<string, string>();
    for (const m of index.matchAll(/import \{ (\w+) \} from '\.\/(\w+)'/g)) moduleOf.set(m[1], m[2]);
    const composes = new Set<string>();
    for (const m of index.matchAll(/^\s*'?([\w-]+)'?:\s*(\w+Progression),/gm)) {
        const file = moduleOf.get(m[2]);
        if (!file) continue;
        const src = fs.readFileSync(`src/features/workout/progression/${file}.ts`, 'utf8');
        if (/genericDoubleProgression\(/.test(src)) composes.add(m[1]);
    }
    return composes;
})();

/** Does the plan hand this movement a computed load rather than carrying one? */
const computesLoad = (cfg: any, ex: any, planId: string): boolean => {
    if (!cfg?.hooks?.calculateWeight) return false;
    try {
        const w = cfg.hooks.calculateWeight(ex.target, previewUser(planId), ex.name, { week: 1, day: 1 });
        return w !== undefined && w !== null && String(w).trim() !== '' && String(w) !== '0';
    } catch { return false; }
};

const out: any[] = [];
for (const meta of ORDERED_PLAN_META) {
    const week = materialise(meta.id);
    const card = dig(en, `onboarding.programs.${meta.i18nKey}`) ?? {};
    const pf = PORTFOLIO.find(p => p.id === meta.id);
    const cfg: any = (PLAN_REGISTRY as any)[meta.id];
    const row: any = {
        id: meta.id,
        order: meta.order,
        i18nKey: meta.i18nKey,
        hidden: !!meta.hiddenFromCatalogue,
        alwaysFree: !!meta.alwaysFree,
        card: { name: card.name, description: card.description, features: card.features },
        portfolio: pf ?? null,
        engine: cfg?.session?.kind ?? 'calendar',
        weeksInProgram: cfg?.program?.weeks?.length ?? null,
        onboarding: cfg?.onboarding ?? null,
        hooks: cfg?.hooks ? Object.keys(cfg.hooks) : [],
        techniques: cfg?.program?.weeks
            ? [...new Set(cfg.program.weeks.flatMap((w: any) => w.days.flatMap((d: any) =>
                d.exercises.map((e: any) => e.prescription?.technique?.kind).filter(Boolean))))]
            : [],
        weekShapes: cfg?.program?.weeks
            ? cfg.program.weeks.map((w: any) => ({
                week: w.weekNumber,
                days: w.days.filter((d: any) => d.exercises.length).map((d: any) => ({
                    name: label(d.dayName), sets: d.exercises.reduce((n: number, e: any) => n + e.sets, 0),
                })),
            }))
            : [],
    };
    if (week) {
        const m = score(week);
        const s = setShape(week);

        /**
         * Prescribed rep ranges, taken from the sampled week after the plan's
         * own hooks have run. `materialise` keeps set counts but drops the
         * target, and the docs need the range: whether a squat and a lateral
         * raise are asked for at the same reps is exactly the thing a reader
         * cannot otherwise check.
         */
        const repsByExercise: Record<string, string> = {};
        const sampled = cfg?.program?.weeks?.find((w: any) => w.weekNumber === week.week);
        const sampledDays: any[] = [];
        for (const day of sampled?.days ?? []) {
            // Generator plans ship empty days and fill them in preprocessDay,
            // so an empty raw day is only skippable without a hook to fill it.
            if (!day.exercises?.length && !cfg?.hooks?.preprocessDay) continue;
            let processed = day;
            try {
                if (cfg?.hooks?.preprocessDay) processed = cfg.hooks.preprocessDay(structuredClone(day), previewUser(meta.id));
            } catch { /* a plan that needs richer state keeps its raw targets */ }
            if (!processed?.exercises?.length) continue;
            sampledDays.push(processed);
            for (const ex of processed.exercises ?? []) {
                if (ex?.name && ex?.target?.reps != null && !repsByExercise[ex.name]) {
                    repsByExercise[ex.name] = String(ex.target.reps);
                }
            }
        }
        row.repsByExercise = repsByExercise;

        /**
         * How the load on each movement is set and how it moves.
         *
         * Two layers combine: the per-slot rule a plan declares (a percentage
         * of a tracked max, a wave, a top set with back-offs) and the
         * save-time handler that writes the next working load. A slot with no
         * declared rule is not un-progressed — it is carried by the handler.
         */
        const progressionByExercise: Record<string, { from: string; advances: string }> = {};
        // No own handler means the shared double progression runs; an own
        // handler only double-progresses if it composes that helper.
        const ownHandler = Boolean((PROGRESSION_HANDLERS as any)[meta.id]);
        const usesDouble = !ownHandler || COMPOSES_DOUBLE.has(meta.id);
        // Scanned across every week, not just the sampled one: a rule can be
        // introduced by a phase (Athena's top set arrives in week 5), and a
        // single-week view reports the plan as more uniform than it is.
        const allDays: any[] = [];
        for (const wk of cfg?.program?.weeks ?? []) {
            for (const day of wk.days ?? []) {
                if (!day.exercises?.length && !cfg?.hooks?.preprocessDay) continue;
                let processed = day;
                try {
                    if (cfg?.hooks?.preprocessDay) processed = cfg.hooks.preprocessDay(structuredClone(day), previewUser(meta.id));
                } catch { /* keep the raw day */ }
                if (processed?.exercises?.length) allDays.push(processed);
            }
        }
        for (const day of allDays) {
            for (const ex of day.exercises ?? []) {
                if (!ex?.name) continue;
                const pr = ex.prescription?.progression;
                const tsb = ex.prescription?.topSetBackoff;
                const pct = ex.target?.percentage;
                let from: string;
                let advances: string;
                if (pct) {
                    from = `${Math.round(pct * 100)}% of ${ex.target.percentageRef ?? 'a tracked max'}`;
                    advances = 'the tracked max is re-estimated from what you log';
                } else if (pr?.kind === 'wave') {
                    from = `wave off ${pr.of ?? 'a tracked max'}`;
                    advances = 'each wave steps the percentage up';
                } else if (pr?.kind === 'linear') {
                    from = `${pr.of ?? 'a tracked max'}, opening percentage`;
                    advances = `+${pr.increment ?? 2.5}kg per week`;
                } else if (computesLoad(cfg, ex, meta.id)) {
                    // The hand-authored plans compute the bar weight in
                    // calculateWeight rather than tagging the slot, so a slot
                    // with no rule is not necessarily athlete-entered.
                    from = 'computed by the plan each session';
                    advances = 'the plan recalculates it from your logged work';
                    progressionByExercise[ex.name] = { from, advances };
                    continue;
                } else {
                    from = 'carried working load';
                    if (tsb) {
                        advances = `top set, then ${tsb.backoffSets} back-off sets at ${100 - tsb.backoffPercent}% (+${tsb.incrementKg}kg)`;
                    } else if (pr?.kind === 'totalReps') {
                        advances = 'hold the load until the total rep target is met';
                    } else if (usesDouble) {
                        advances = `double progression +${pr?.increment ?? 2.5}kg`;
                    } else {
                        advances = `the plan's own rule (\`${meta.id}\` handler)`;
                    }
                }
                const existing = progressionByExercise[ex.name];
                if (!existing) progressionByExercise[ex.name] = { from, advances };
                else if (existing.advances !== advances && !existing.advances.includes(advances)) {
                    progressionByExercise[ex.name] = {
                        from: existing.from === from ? from : `${existing.from}; later ${from}`,
                        advances: `${existing.advances}; later ${advances}`,
                    };
                }
            }
        }
        row.progressionByExercise = progressionByExercise;

        /**
         * Does a clean session actually leave the athlete with a next load?
         *
         * Simulates every prescribed set completed at the top of its range and
         * counts the movements that come back with a number written. This is
         * the check that distinguishes "the plan has a rule" from "the rule
         * covers this movement": a plan with its own handler never runs the
         * shared double progression, so anything the handler ignores is a
         * movement the athlete has to remember unaided.
         */
        const topOf = (reps: string) => {
            const n = String(reps).split('-').map(Number).filter(Number.isFinite);
            return n.length ? Math.max(...n) : 10;
        };
        let movements = 0, writtenLoads = 0, wroteSomething = false;
        for (const day of allDays.slice(0, 8)) {
            const sets: Record<string, unknown[]> = {};
            for (const ex of day.exercises ?? []) {
                sets[ex.id] = Array.from({ length: ex.sets || 1 }, () => ({
                    reps: String(topOf(ex.target?.reps ?? '10')), weight: '60', completed: true,
                }));
            }
            let result: any = {};
            try {
                result = progressionHandlerFor(meta.id)({
                    planId: meta.id, week: 2, day: day.dayOfWeek ?? 1, isExistingLog: false,
                    user: previewUser(meta.id), workout: day, sets,
                } as any);
            } catch { /* a handler needing richer state writes nothing */ }
            const loaded = new Set<string>();
            for (const value of Object.values(result?.updates ?? {})) {
                if (!value || typeof value !== 'object') continue;
                for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
                    if (typeof v === 'number' && Number.isFinite(v)) loaded.add(k);
                }
            }
            if (Object.keys(result?.updates ?? {}).length) wroteSomething = true;
            const ids = new Set((day.exercises ?? []).map((e: any) => e.exerciseId).filter(Boolean));
            movements += ids.size;
            writtenLoads += [...ids].filter(id => loaded.has(id as string)).length;
        }
        row.progressionCoverage = movements
            ? { movements, written: writtenLoads, pct: Math.round((writtenLoads / movements) * 100) }
            : null;
        // House of Iron advances by difficulty ladder, not by load. Zero loads
        // written is correct there, so it must not read as a coverage gap.
        row.progressesByLoad = !(writtenLoads === 0 && wroteSomething);
        row.progressionHandler = ownHandler ? (usesDouble ? 'own+double' : 'own') : 'shared';
        // Whether the plan states any load rule at the slot level at all, as
        // opposed to leaving every movement to the save-time handler. Read off
        // the data rather than a name list, which drifts.
        row.declaresSlotRules = allDays.some((d: any) => (d.exercises ?? []).some((e: any) => e.prescription?.progression));
        row.distinctRepRanges = [...new Set(Object.values(repsByExercise))].sort();
        row.week = { sampledWeek: week.week, trainingDays: week.trainingDays, perVisitGenerator: week.perVisitGenerator, notes: week.notes };
        row.metrics = m;
        row.setShape = s;
        row.days = s.days;
        const byDay = new Map<number, any[]>();
        for (const slot of week.slots) { if (!byDay.has(slot.day)) byDay.set(slot.day, []); byDay.get(slot.day)!.push(slot); }
        row.dayDetail = [...byDay.entries()].sort((a, b) => a[0] - b[0]).map(([, slots]) => ({
            name: label(slots[0].dayName),
            sets: slots.reduce((n, x) => n + x.sets, 0),
            slots: slots.map(x => ({ name: x.name, id: x.id, sets: x.sets, block: x.block, giantSetOf: x.giantSetOf })),
        }));
    } else {
        row.week = null;
    }
    out.push(row);
}
fs.writeFileSync('docs/analysis/plan-facts.json', JSON.stringify(out, null, 2));
console.log(`wrote docs/analysis/plan-facts.json — ${out.length} plans, ${out.filter(r => r.week).length} materialised`);
