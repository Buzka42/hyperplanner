/**
 * verify:profile-rules
 *
 * `validUserProfile` in firestore.rules uses `hasOnly`, so a field added to
 * `UserProfile` and written by the app but never added to that list makes every
 * write fail — and the failure surfaces to the athlete as "Missing or
 * insufficient permissions", with nothing pointing at the real cause.
 *
 * That is exactly what happened to `pendingCalibration`: onboarding wrote it,
 * the rules rejected it, and every declarative plan became unregisterable. This
 * script compares the two lists so it cannot happen quietly again.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures: string[] = [];

// --- the rules' allowed keys --------------------------------------------------
const rules = readFileSync(resolve(root, 'firestore.rules'), 'utf8');
const block = rules.match(/function\s+validUserProfile\(data,\s*userId\)\s*\{[\s\S]*?hasOnly\(\[([\s\S]*?)\]\)/);
assert.ok(block, 'validUserProfile hasOnly() not found — has it been renamed?');
const allowed = new Set([...block![1].matchAll(/'([^']+)'/g)].map(match => match[1]));

// --- the type's fields --------------------------------------------------------
const types = readFileSync(resolve(root, 'src', 'types.ts'), 'utf8');
const typeBlock = types.match(/export type UserProfile = \{([\s\S]*?)\n\};/);
assert.ok(typeBlock, 'UserProfile type not found');
const declared = [...typeBlock![1].matchAll(/^\s{4}(\w+)\??:/gm)].map(match => match[1]);
assert.ok(declared.length > 10, 'UserProfile parsed suspiciously small');

for (const field of declared) {
    if (!allowed.has(field)) {
        failures.push(`UserProfile.${field} is not allowed by validUserProfile(). Any write carrying it is rejected as a permissions error.`);
    }
}

// The reverse direction is a smaller problem — a stale allowance — but it still
// means the rules are describing a shape the app no longer writes.
const declaredSet = new Set(declared);
for (const field of allowed) {
    if (!declaredSet.has(field)) {
        failures.push(`firestore.rules allows "${field}", which UserProfile no longer declares.`);
    }
}

// --- fields the app writes outside the type ----------------------------------
// Onboarding and the plan hooks write through helpers; spot-check the ones that
// have caused outages, so a rename in the app is caught here too.
for (const field of ['pendingCalibration', 'planPreferences', 'exerciseSwaps', 'isTestAccount']) {
    if (!allowed.has(field)) failures.push(`"${field}" is written by the app but not allowed by the rules.`);
}

if (failures.length) {
    console.error(`\n  verify:profile-rules FAILED (${failures.length} problem${failures.length === 1 ? '' : 's'})\n`);
    for (const failure of failures) console.error(`   - ${failure}`);
    console.error('');
    process.exit(1);
}

console.log(`  verify:profile-rules OK — ${declared.length} profile fields all allowed by firestore.rules`);
