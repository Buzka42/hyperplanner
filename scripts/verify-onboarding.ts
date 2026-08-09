/**
 * verify:onboarding
 *
 * Guards the contract between a plan's progressions and the onboarding step
 * that collects their inputs.
 *
 * The bug this exists to prevent: a plan declares a percentage/wave/linear
 * progression against some 1RM, nothing ever asks the athlete for that number,
 * and `buildWeightCalculator` quietly returns undefined — so the authored
 * percentages never apply and WorkoutView's generic estimate runs instead. It
 * looks like a working plan. It isn't the plan that was designed.
 *
 * So: for every registered plan, every stat key any progression reads must be
 * renderable by the benchmark step, or collected by that plan's bespoke step.
 */

import { PLAN_REGISTRY } from '../src/data/plans';
import { BENCHMARK_LIFTS, benchmarkLiftsFor } from '../src/data/benchmarkLifts';
import { translations } from '../src/contexts/translations';

const failures: string[] = [];
let checksRun = 0;
const check = (ok: boolean, msg: string) => { checksRun++; if (!ok) failures.push(msg); };

/**
 * Plans that predate `definePlan`: hand-written week trees, each owning its own
 * onboarding step (or needing no stats at all). They never carry
 * `requiredStats`, so they're excluded by id rather than by a null check —
 * that way a *declarative* plan losing its requiredStats still fails loudly.
 */
const HAND_WRITTEN = new Set([
    'bench-domination',
    'pain-and-glory',
    'trinary',
    'ritual-of-strength',
    'pencilneck-eradication',
    'skeleton-to-threat',
    'peachy-glute-plan',
    'super-mutant',
    '30-minute-adventure',
]);

for (const [id, plan] of Object.entries(PLAN_REGISTRY)) {
    const required = plan.onboarding?.requiredStats;

    if (HAND_WRITTEN.has(id)) {
        check(
            required === undefined,
            `${id}: listed as hand-written but now carries requiredStats — move it out of HAND_WRITTEN.`,
        );
        continue;
    }

    check(
        required !== undefined,
        `${id}: built by definePlan but has no onboarding.requiredStats — did definePlan stop populating it?`,
    );

    for (const stat of required ?? []) {
        check(
            BENCHMARK_LIFTS[stat] !== undefined,
            `${id}: progression reads stats.${stat}, but BENCHMARK_LIFTS has no entry for it, `
            + `so the benchmark step cannot ask for it. Add it to src/data/benchmarkLifts.ts `
            + `(and both translation blocks under onboarding.benchmark.lifts).`,
        );
    }
}

// Every renderable lift needs copy in both languages. A missing key renders as
// the raw key string ("onboarding.benchmark.lifts.squat.label") in the form —
// the kind of thing that ships because nobody onboarded in Polish.
for (const lang of ['en', 'pl'] as const) {
    const lifts = (translations[lang] as any)?.onboarding?.benchmark?.lifts;
    check(lifts !== undefined, `${lang}: onboarding.benchmark.lifts block is missing entirely.`);
    for (const key of Object.values(BENCHMARK_LIFTS).map(l => l!.key)) {
        check(
            typeof lifts?.[key]?.label === 'string' && typeof lifts?.[key]?.hint === 'string',
            `${lang}: onboarding.benchmark.lifts.${key} needs both a label and a hint.`,
        );
    }
    for (const key of ['title', 'desc', 'unknownToggle', 'unknownNote', 'buildButton', 'allUnknownNote']) {
        check(
            typeof (translations[lang] as any)?.onboarding?.benchmark?.[key] === 'string',
            `${lang}: onboarding.benchmark.${key} is missing.`,
        );
    }
}

// The step must actually resolve lifts for the plans that need them, not just
// hold consistent metadata. King of the Squat is the widest case in the
// catalogue: squat, bench and deadlift maxes all feed its percentages.
const kots = benchmarkLiftsFor(PLAN_REGISTRY['king-of-the-squat']?.onboarding?.requiredStats);
check(kots.length === 3, `king-of-the-squat should render 3 benchmark inputs, got ${kots.length}.`);
check(
    kots[0]?.stat === 'squat',
    `king-of-the-squat should lead with the squat, got ${kots[0]?.stat}.`,
);

// A plan with no percentage progressions must render no inputs — the step
// degrades to a plain confirmation rather than inventing questions.
check(
    benchmarkLiftsFor(PLAN_REGISTRY['tenfold']?.onboarding?.requiredStats).length === 0,
    'tenfold has no percentage progressions and should ask for no maxes.',
);

// The registry itself must be non-trivial, so a broken import can't turn this
// script into a no-op that passes by checking nothing.
check(Object.keys(PLAN_REGISTRY).length >= 15, 'PLAN_REGISTRY looks truncated — expected 15+ plans.');

if (failures.length) {
    console.error(`\n  verify:onboarding FAILED (${failures.length})\n`);
    for (const f of failures) console.error(`   - ${f}`);
    console.error('');
    process.exit(1);
}

console.log(`\n  verify:onboarding OK — ${checksRun} assertions across ${Object.keys(PLAN_REGISTRY).length} plans`);
console.log('   every progression base stat is collectable at onboarding or calibrated on first exposure\n');
