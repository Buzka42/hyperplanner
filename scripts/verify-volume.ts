/**
 * verify:volume
 *
 * Checks every plan against the programming rules in the concept doc: no major
 * muscle group trained only once a week in a hypertrophy plan, and
 * specialisation plans actually specialising through frequency.
 *
 * Reports rather than fails by default — the existing plans predate these rules
 * and some breaches are deliberate. Pass --strict to fail the build, which is
 * what the new plans are held to.
 */

import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_IDS } from '../src/data/planMeta';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { createResolver } from '../src/data/exercises';
import { analyseWeek, summarise, PLAN_RULES } from '../src/lib/volumeAnalysis';
import { buildPreviewUser } from '../src/pages/admin/previewUser';
import type { WorkoutDay } from '../src/types';

const strict = process.argv.includes('--strict');
const only = process.argv.find(a => a.startsWith('--plan='))?.split('=')[1];
const resolver = createResolver(EXERCISE_LIBRARY);

let totalErrors = 0;

for (const planId of PLAN_IDS) {
    if (only && planId !== only) continue;

    const config = PLAN_REGISTRY[planId];
    const rules = PLAN_RULES[planId];
    if (!config || !rules) continue;

    const user = buildPreviewUser(planId);

    /**
     * Some generators ignore the day they are handed and return whichever
     * session is next for the athlete (Super Mutant, Skeleton). Running them
     * once per calendar day then multiplies one session by seven and collapses
     * every exposure onto a single weekday — which reads as "chest trained once
     * a week with 42 sets". That is a measurement artifact, not a plan defect,
     * so detect it and skip rather than report false breaches.
     */
    const generatesPerVisit = (() => {
        const week = config.program.weeks[0];
        if (!week) return false;
        const signatures = week.days.map(day => {
            try {
                const generated = config.hooks?.preprocessDay?.(day, user) ?? day;
                return (generated.exercises ?? []).map(e => e.name).join('|');
            } catch {
                return '';
            }
        });
        // "Same session every day" alone is not the signal — a full-body plan
        // run three times a week looks exactly like that, and Skeleton was
        // being skipped entirely as a result. What actually distinguishes a
        // per-visit generator is that it ignores the calendar: it returns a
        // session for *every* day it is handed, including the plan's own rest
        // days. A calendar plan leaves those empty.
        const everyDayTrains = signatures.every(Boolean);
        return everyDayTrains && signatures.length > 1 && new Set(signatures).size === 1;
    })();

    const weeks = generatesPerVisit ? [] : config.program.weeks.map(week => {
        const days: WorkoutDay[] = week.days.map(day => {
            try {
                return config.hooks?.preprocessDay?.(day, user) ?? day;
            } catch {
                return day;
            }
        });
        return analyseWeek(days, week.weekNumber, resolver, rules);
    // A week with no work at all is a rest or deload week, not a rule breach.
    }).filter(w => w.totalSets > 0);

    const report = summarise(weeks);
    const name = config.program.name;

    console.log(`\n  ${name}  [${rules.kind}${rules.specialisation ? ` · specialises ${rules.specialisation.join(', ')}` : ''}]`);

    if (generatesPerVisit) {
        console.log('     skipped: generates one session per visit, so weekly volume depends on');
        console.log('              training history rather than the calendar.');
        continue;
    }
    if (!weeks.length) {
        console.log('     no materialised training weeks');
        continue;
    }

    const sample = weeks[0];
    const worked = sample.volumes.filter(v => v.directSets > 0).sort((a, b) => b.directSets - a.directSets);
    console.log(`     week ${sample.week}: ${sample.totalSets} direct sets · ` +
        worked.slice(0, 6).map(v => `${v.group} ${v.directSets}s/${v.exposures}x`).join('  '));

    if (report.clean) {
        console.log('     no rule breaches');
    } else {
        totalErrors += report.distinctIssues.length;
        for (const issue of report.distinctIssues) {
            const span = issue.weeks.length > 3
                ? `weeks ${issue.weeks[0]}-${issue.weeks[issue.weeks.length - 1]}`
                : `week${issue.weeks.length > 1 ? 's' : ''} ${issue.weeks.join(', ')}`;
            console.log(`     ! ${issue.group}: ${issue.message} (${span})`);
        }
    }
    if (report.warnings.length) {
        const uniq = [...new Set(report.warnings.map(w => `${w.group}: ${w.message}`))];
        for (const w of uniq.slice(0, 3)) console.log(`     ~ ${w}`);
    }
}

console.log('');
if (strict && totalErrors > 0) {
    console.error(`  verify:volume FAILED — ${totalErrors} rule breach${totalErrors === 1 ? '' : 'es'}\n`);
    process.exit(1);
}
console.log(`  verify:volume complete — ${totalErrors} rule breach${totalErrors === 1 ? '' : 'es'} reported${strict ? '' : ' (advisory; use --strict to fail)'}\n`);
