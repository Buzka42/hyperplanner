/**
 * apply-tips
 *
 * Writes the tips resolved by `migrate:tips` into src/data/exercises/library.ts.
 *
 * Only the general movement cue lands on the library entry. Prescription-
 * specific variants (Ascension Test, E2MOM, heavy single…) are deliberately
 * left out — they belong on the plan as scoped overrides, and are listed in
 * output/tip-merge-report.md.
 *
 * Idempotent: re-running replaces existing tip blocks rather than stacking.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const libPath = join(root, 'src', 'data', 'exercises', 'library.ts');

type Resolved = { id: string; en: string; pl: string; chosenKey: string };
const { tips } = JSON.parse(
    readFileSync(join(root, 'output', 'tips-resolved.json'), 'utf8')
) as { tips: Resolved[] };

const byId = new Map(tips.filter(t => t.en?.trim()).map(t => [t.id, t]));

const quote = (s: string) =>
    `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, ' ').trim()}'`;

let source = readFileSync(libPath, 'utf8');

// Drop any tip block from a previous run so this stays idempotent.
source = source.replace(/\n {8}tip: \{[^}]*\},/g, '');

let applied = 0;
source = source.replace(
    /( {8}id: '([^']+)',\n)/g,
    (match, whole: string, id: string) => {
        const tip = byId.get(id);
        if (!tip) return whole;
        applied++;
        const pl = tip.pl?.trim() ? quote(tip.pl) : "''";
        return `${whole}        tip: { en: ${quote(tip.en)}, pl: ${pl} },\n`;
    }
);

writeFileSync(libPath, source, 'utf8');

const withPl = tips.filter(t => t.en?.trim() && t.pl?.trim()).length;
console.log('  apply-tips');
console.log(`   ${applied} tips written into src/data/exercises/library.ts`);
console.log(`   ${withPl} have Polish, ${applied - withPl} English-only`);
