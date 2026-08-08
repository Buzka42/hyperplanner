/**
 * verify:registry
 *
 * The plan id list used to live in four places that had to be kept in sync by
 * hand. PLAN_META is now the source of truth; this script fails the build if
 * any other copy drifts from it.
 *
 * Checked:
 *   1. PLAN_META            (src/data/planMeta.ts)
 *   2. PLAN_REGISTRY        (src/data/plans.ts)
 *   3. validPlanIds()       (firestore.rules)  — a security boundary: a plan
 *                           missing here is silently unwritable for every user.
 *   4. Plan cover artwork   (public/) — a missing image is a blank card.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PLAN_META, PLAN_IDS, ORDERED_PLAN_META } from '../src/data/planMeta';
import { PLAN_REGISTRY } from '../src/data/plans';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures: string[] = [];
const fail = (msg: string) => failures.push(msg);

const sorted = (ids: string[]) => [...ids].sort();
const diff = (a: string[], b: string[]) => a.filter(id => !b.includes(id));

// --- 1 vs 2: PLAN_META vs PLAN_REGISTRY -------------------------------------
const registryIds = Object.keys(PLAN_REGISTRY);
for (const id of diff(PLAN_IDS, registryIds)) {
    fail(`PLAN_META has "${id}" but PLAN_REGISTRY (src/data/plans.ts) does not.`);
}
for (const id of diff(registryIds, PLAN_IDS)) {
    fail(`PLAN_REGISTRY has "${id}" but PLAN_META (src/data/planMeta.ts) does not.`);
}

// PLAN_REGISTRY is keyed by each config's own id; make sure the key agrees.
for (const [key, config] of Object.entries(PLAN_REGISTRY)) {
    if (config.id !== key) {
        fail(`PLAN_REGISTRY key "${key}" does not match its config id "${config.id}".`);
    }
}

// --- 3: firestore.rules validPlanIds() --------------------------------------
const rulesPath = resolve(root, 'firestore.rules');
const rulesSrc = readFileSync(rulesPath, 'utf8');
const rulesMatch = rulesSrc.match(/function\s+validPlanIds\(\)\s*\{\s*return\s*\[([^\]]*)\]/);

if (!rulesMatch) {
    fail('Could not find validPlanIds() in firestore.rules — has it been renamed?');
} else {
    const ruleIds = [...rulesMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
    for (const id of diff(PLAN_IDS, ruleIds)) {
        fail(`Plan "${id}" is missing from validPlanIds() in firestore.rules. Users on it cannot write their profile or workouts.`);
    }
    for (const id of diff(ruleIds, PLAN_IDS)) {
        fail(`firestore.rules validPlanIds() allows "${id}", which is not a known plan.`);
    }
}

// --- 4: artwork exists ------------------------------------------------------
for (const meta of ORDERED_PLAN_META) {
    const asset = resolve(root, 'public', meta.logo.replace(/^\//, ''));
    if (!existsSync(asset)) {
        fail(`Plan "${meta.id}" points at missing artwork: public${meta.logo}`);
    }
}

// --- 5: internal PLAN_META sanity -------------------------------------------
const orders = ORDERED_PLAN_META.map(m => m.order);
if (new Set(orders).size !== orders.length) {
    fail(`PLAN_META has duplicate "order" values: [${orders.join(', ')}]`);
}
const i18nKeys = ORDERED_PLAN_META.map(m => m.i18nKey);
if (new Set(i18nKeys).size !== i18nKeys.length) {
    fail(`PLAN_META has duplicate "i18nKey" values: [${i18nKeys.join(', ')}]`);
}
for (const [key, meta] of Object.entries(PLAN_META)) {
    if (meta.id !== key) fail(`PLAN_META key "${key}" does not match its id "${meta.id}".`);
}

// --- report -----------------------------------------------------------------
if (failures.length) {
    console.error(`\n  verify:registry FAILED (${failures.length} problem${failures.length === 1 ? '' : 's'})\n`);
    for (const f of failures) console.error(`   - ${f}`);
    console.error('');
    process.exit(1);
}

console.log(`  verify:registry OK — ${PLAN_IDS.length} plans consistent across PLAN_META, PLAN_REGISTRY, firestore.rules and public/`);
console.log(`   ${sorted(PLAN_IDS).join(', ')}`);
