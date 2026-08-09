/**
 * verify:tip-coverage
 *
 * Guards the tip migration: every tip WorkoutView's inline tipMap served must
 * still be reachable from either the exercise library (the movement's general
 * cue) or the variant table (prescription-specific and week-scoped tips).
 *
 * Without this, removing the 97-entry tipMap silently drops coaching cues —
 * the failure is invisible because a missing tip renders as no tip at all.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { EXERCISE_VARIANT_TIPS } from '../src/data/exercises/variantTips';
import { createResolver } from '../src/data/exercises';
import { translations } from '../src/contexts/translations';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const resolver = createResolver(EXERCISE_LIBRARY);

type Bundle = Record<string, { tips?: Record<string, string> }>;
const tipsEn = (translations as unknown as Bundle).en?.tips ?? {};

const workoutView = readFileSync(join(root, 'src', 'pages', 'WorkoutView.tsx'), 'utf8');
const start = workoutView.indexOf('const tipMap');

if (start === -1) {
    // The map has been removed — that is the goal, so nothing to compare against.
    console.log('  verify:tip-coverage — tipMap already removed from WorkoutView; nothing to compare.');
    process.exit(0);
}

const block = workoutView.slice(start, start + 12000);

/** Trailing whitespace in translations.ts vs trimmed storage is not a difference. */
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

const served: { name: string; key: string }[] = [];
for (const m of block.matchAll(/"([^"]+)":\s*(?:\(([^)]*)\)\s*\?\s*)?"([^"]+)"(?:\s*:\s*"([^"]+)")?/g)) {
    const [, name, , first, second] = m;
    for (const key of [first, second].filter(Boolean) as string[]) {
        if (tipsEn[key]) served.push({ name, key });
    }
}

const variantTexts = new Set(Object.values(EXERCISE_VARIANT_TIPS).flat().map(v => norm(v.en)));

const lost: string[] = [];
for (const { name, key } of served) {
    const text = norm(tipsEn[key]);
    const viaLibrary = norm(resolver.resolve(name)?.tip?.en ?? '') === text;
    if (!viaLibrary && !variantTexts.has(text)) lost.push(`${name}  <-  ${key}`);
}

const unique = [...new Set(lost)];

console.log(`\n  verify:tip-coverage`);
console.log(`   tipMap serves ${served.length} (name, key) pairs`);
console.log(`   covered: ${served.length - lost.length}   library: ${EXERCISE_LIBRARY.filter(e => e.tip?.en).length}   variants: ${Object.values(EXERCISE_VARIANT_TIPS).flat().length}`);

if (unique.length) {
    console.error(`\n  FAILED — ${unique.length} tip${unique.length === 1 ? '' : 's'} would be lost:\n`);
    for (const l of unique) console.error(`   - ${l}`);
    console.error('');
    process.exit(1);
}

console.log('   no tips lost\n');
