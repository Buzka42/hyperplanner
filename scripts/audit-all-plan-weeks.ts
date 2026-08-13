/**
 * Generator-side audit of every week of every plan.
 * Does not need a browser. Prints phase drift, empty days, same-name % collisions,
 * and week fingerprints so later weeks can be compared to week 1.
 */
import * as fs from 'fs';
import * as path from 'path';
import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_META } from '../src/data/planMeta';
import { PORTFOLIO } from '../src/data/portfolio';
import type { Exercise, ProgramWeek, WorkoutDay } from '../src/types';

type SlotPrint = {
    name: string;
    sets: number;
    reps?: string;
    percentage?: number;
    notes?: string;
};

const fingerprintDay = (day: WorkoutDay): string =>
    day.exercises
        .map(ex => {
            const t = ex.target;
            const reps = t && 'reps' in t ? String(t.reps) : '';
            const pct = t && 'percentage' in t && t.percentage != null ? `@${t.percentage}` : '';
            return `${ex.name}|${ex.sets}x${reps}${pct}`;
        })
        .join(' || ');

const fingerprintWeek = (week: ProgramWeek): string =>
    week.days
        .filter(d => d.exercises.length > 0)
        .map(d => `${d.dayOfWeek}:${fingerprintDay(d)}`)
        .join('\n');

const collisionSlots = (day: WorkoutDay): string[] => {
    const hits: string[] = [];
    const seen = new Map<string, Exercise[]>();
    for (const ex of day.exercises) {
        const list = seen.get(ex.name) ?? [];
        list.push(ex);
        seen.set(ex.name, list);
    }
    for (const [name, list] of seen) {
        if (list.length < 2) continue;
        const pcts = list.map(ex => (ex.target && 'percentage' in ex.target ? ex.target.percentage : undefined));
        const unique = new Set(pcts.filter(p => p != null));
        if (unique.size > 1) {
            hits.push(`${name}: ${[...unique].join(' / ')} (${list.length} slots)`);
        }
    }
    return hits;
};

const printSlots = (day: WorkoutDay): SlotPrint[] =>
    day.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.target && 'reps' in ex.target ? String(ex.target.reps) : undefined,
        percentage: ex.target && 'percentage' in ex.target ? ex.target.percentage : undefined,
        notes: ex.notes?.slice(0, 140),
    }));

const reports: unknown[] = [];

for (const [planId, config] of Object.entries(PLAN_REGISTRY)) {
    const weeks = config.program.weeks;
    const portfolio = PORTFOLIO.find(p => p.id === planId);
    const meta = PLAN_META[planId];
    const trainingWeeks = weeks.filter(w => w.days.some(d => d.exercises.length > 0));
    const last = trainingWeeks[trainingWeeks.length - 1];
    const mid = trainingWeeks[Math.floor((trainingWeeks.length - 1) / 2)];
    const first = trainingWeeks[0];

    const weekPrints = trainingWeeks.map(w => fingerprintWeek(w));
    const uniquePrints = new Set(weekPrints);
    const collisions: { week: number; day: string; detail: string }[] = [];
    const emptyNamedDays: { week: number; dayName: string }[] = [];
    const rawKeys: { week: number; text: string }[] = [];

    for (const week of weeks) {
        for (const day of week.days) {
            for (const hit of collisionSlots(day)) {
                collisions.push({ week: week.weekNumber, day: day.dayName, detail: hit });
            }
            if (day.dayName && day.dayName !== 'Rest' && !day.dayName.toLowerCase().includes('rest') && day.exercises.length === 0) {
                emptyNamedDays.push({ week: week.weekNumber, dayName: day.dayName });
            }
            if (day.dayName?.includes('t:') && day.exercises.length > 0) {
                // translation keys are OK if resolveDayName handles them; still record
            }
            for (const ex of day.exercises) {
                if (ex.notes?.startsWith('t:') || ex.name.startsWith('t:')) {
                    rawKeys.push({ week: week.weekNumber, text: ex.notes || ex.name });
                }
            }
        }
    }

    const sampleWeeks = [first, mid, last].filter(Boolean) as ProgramWeek[];
    const uniqueSample = new Set(sampleWeeks.map(fingerprintWeek));

    const report = {
        planId,
        name: config.program.name,
        theme: meta?.themeClass,
        claimedWeeks: portfolio?.weeks,
        generatedWeeks: weeks.length,
        trainingWeeks: trainingWeeks.length,
        uniqueWeekShapes: uniquePrints.size,
        firstMidLastIdentical: uniqueSample.size === 1 && sampleWeeks.length > 1,
        sameNamePercentCollisions: collisions.slice(0, 12),
        emptyNamedDays: emptyNamedDays.slice(0, 8),
        rawTranslationKeysOnExercises: rawKeys.slice(0, 8),
        samples: sampleWeeks.map(w => ({
            week: w.weekNumber,
            days: w.days
                .filter(d => d.exercises.length > 0)
                .map(d => ({
                    dayOfWeek: d.dayOfWeek,
                    dayName: d.dayName,
                    slots: printSlots(d),
                })),
        })),
    };
    reports.push(report);

    const flag = [
        report.firstMidLastIdentical ? 'STATIC' : 'VARIES',
        collisions.length ? `COLLIDE×${collisions.length}` : '',
        uniquePrints.size === 1 && trainingWeeks.length > 4 ? 'NO-PHASE-DRIFT' : '',
    ].filter(Boolean).join(' ');

    console.log(`[${planId}] ${trainingWeeks.length}w shapes=${uniquePrints.size} ${flag}`);
}

const out = path.resolve('output/plan-week-structure-audit.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(reports, null, 2));
console.log(`\nWrote ${out}`);
