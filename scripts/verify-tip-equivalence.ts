/**
 * verify:tip-equivalence
 *
 * Behavioural check for the tipMap removal: for every exercise name every plan
 * can render, the tip the NEW lookup produces must equal the tip the OLD
 * tipMap produced.
 *
 * Coverage (verify:tip-coverage) proves the text still exists somewhere.
 * This proves each exercise still gets *its own* tip — a table can be complete
 * while the lookup returns the wrong row.
 *
 * The old map is read from git HEAD, so this keeps working after the map is
 * deleted from the working tree.
 */

import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_IDS } from '../src/data/planMeta';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { getVariantTip } from '../src/data/exercises/variantTips';
import { createResolver } from '../src/data/exercises';
import { translations } from '../src/contexts/translations';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const resolver = createResolver(EXERCISE_LIBRARY);

type Bundle = Record<string, { tips?: Record<string, string> }>;
const tipsEn = (translations as unknown as Bundle).en?.tips ?? {};

// --- the old map, from the last commit that still had it --------------------

const findOldTipMap = (): string | null => {
    for (const rev of ['HEAD', 'HEAD~1', 'HEAD~2', 'HEAD~3', 'HEAD~4', 'HEAD~5']) {
        try {
            const file = execSync(`git show ${rev}:src/pages/WorkoutView.tsx`, {
                cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
            });
            const at = file.indexOf('const tipMap');
            if (at !== -1) return file.slice(at, at + 12000);
        } catch {
            // rev missing or file absent there; try the next one
        }
    }
    return null;
};

const block = findOldTipMap();
if (!block) {
    console.log('  verify:tip-equivalence — no historical tipMap found; skipping.');
    process.exit(0);
}

/** name -> the key the old map would have used (default branch, as at runtime). */
const oldKeyFor = new Map<string, string>();
for (const m of block.matchAll(/"([^"]+)":\s*(?:\(([^)]*)\)\s*\?\s*)?"([^"]+)"(?:\s*:\s*"([^"]+)")?/g)) {
    const [, name, condition, first, second] = m;
    // A conditional resolved to the first branch only inside its week window;
    // the second branch is the everyday value, which is what we compare.
    const key = condition && second ? second : first;
    if (tipsEn[key]) oldKeyFor.set(name, key);
}

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

const oldTip = (name: string): string => {
    const key = oldKeyFor.get(name);
    return key ? norm(tipsEn[key]) : '';
};

/** Week 1 stands in for "outside any special-case window", matching oldTip. */
const newTip = (name: string, week = 1): string => {
    const variant = getVariantTip(name, week);
    if (variant?.en) return norm(variant.en);
    return norm(resolver.resolve(name)?.tip?.en ?? '');
};

// --- every exercise name the plans can render -------------------------------

const names = new Set<string>();
for (const planId of PLAN_IDS) {
    const config = PLAN_REGISTRY[planId];
    for (const week of config?.program.weeks ?? []) {
        for (const day of week.days) {
            for (const ex of day.exercises) {
                names.add(ex.name);
                for (const alt of ex.alternates ?? []) names.add(alt);
            }
        }
    }
}
// Names only the old map knew about are still worth checking.
for (const name of oldKeyFor.keys()) names.add(name);

const mismatches: { name: string; before: string; after: string }[] = [];
let sameCount = 0;

for (const name of names) {
    const before = oldTip(name);
    const after = newTip(name);
    if (!before) continue;               // nothing before, nothing to regress
    if (before === after) { sameCount++; continue; }
    mismatches.push({ name, before, after });
}

console.log(`\n  verify:tip-equivalence`);
console.log(`   ${names.size} exercise names checked, ${sameCount} tips identical to before`);

if (mismatches.length) {
    console.error(`\n  FAILED — ${mismatches.length} exercise${mismatches.length === 1 ? '' : 's'} would show a different tip:\n`);
    for (const m of mismatches.slice(0, 25)) {
        console.error(`   ${m.name}`);
        console.error(`     before: ${m.before.slice(0, 100) || '(none)'}`);
        console.error(`     after:  ${m.after.slice(0, 100) || '(none)'}`);
    }
    if (mismatches.length > 25) console.error(`   ... and ${mismatches.length - 25} more`);
    console.error('');
    process.exit(1);
}

console.log('   every exercise resolves to the same tip as before\n');
