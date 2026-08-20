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
