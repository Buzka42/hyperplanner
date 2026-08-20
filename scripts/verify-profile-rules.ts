/**
 * verify:profile-rules
 *
 * Profile writes used to re-run `keys().hasOnly(54 names)` plus
 * `allowedPlanIds.hasOnly(validPlanIds())` on the whole document. On a
 * many-plan athlete (test_claude) that exceeds Firestore's 1000-expression
 * cap and fails closed as permission-denied — T-54 and friends.
 *
 * Allowed keys now live in `profileKeys()`. This script still compares that
 * list to `UserProfile` so a new field cannot ship without a rules entry.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures: string[] = [];

const rules = readFileSync(resolve(root, 'firestore.rules'), 'utf8');

const keysBlock = rules.match(/function\s+profileKeys\(\)\s*\{[\s\S]*?return\s+\[([\s\S]*?)\]/);
assert.ok(keysBlock, 'profileKeys() not found — has it been renamed?');
const allowed = new Set([...keysBlock![1].matchAll(/'([^']+)'/g)].map(match => match[1]));

const planIdsBlock = rules.match(/function\s+validPlanIds\(\)\s*\{[\s\S]*?return\s+\[([\s\S]*?)\]/);
assert.ok(planIdsBlock, 'validPlanIds() not found');
const planIds = [...planIdsBlock![1].matchAll(/'([^']+)'/g)].map(match => match[1]);
const countMatch = rules.match(/function\s+planIdCount\(\)\s*\{[\s\S]*?return\s+(\d+)/);
assert.ok(countMatch, 'planIdCount() not found');
const planIdCount = Number(countMatch![1]);
if (planIdCount !== planIds.length) {
    failures.push(`planIdCount() is ${planIdCount} but validPlanIds() has ${planIds.length} entries.`);
}

const types = readFileSync(resolve(root, 'src', 'types.ts'), 'utf8');
const typeBlock = types.match(/export type UserProfile = \{([\s\S]*?)\n\};/);
assert.ok(typeBlock, 'UserProfile type not found');
const declared = [...typeBlock![1].matchAll(/^\s{4}(\w+)\??:/gm)].map(match => match[1]);
assert.ok(declared.length > 10, 'UserProfile parsed suspiciously small');

for (const field of declared) {
    if (!allowed.has(field)) {
        failures.push(`UserProfile.${field} is not allowed by profileKeys(). Any write carrying it is rejected as a permissions error.`);
    }
}

const declaredSet = new Set(declared);
for (const field of allowed) {
    if (!declaredSet.has(field)) {
        failures.push(`firestore.rules allows "${field}", which UserProfile no longer declares.`);
    }
}

for (const field of ['pendingCalibration', 'planPreferences', 'exerciseSwaps', 'isTestAccount']) {
    if (!allowed.has(field)) failures.push(`"${field}" is written by the app but not allowed by the rules.`);
}

if (failures.length) {
    console.error(`\n  verify:profile-rules FAILED (${failures.length} problem${failures.length === 1 ? '' : 's'})\n`);
    for (const failure of failures) console.error(`   - ${failure}`);
    console.error('');
    process.exit(1);
}

console.log(`  verify:profile-rules OK — ${declared.length} profile fields all allowed; planIdCount=${planIdCount}`);
