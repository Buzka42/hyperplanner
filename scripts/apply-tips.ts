/**
 * apply-tips
 *
 * Writes the tips resolved by `migrate:tips` into the exercise library, and
 * carries everything else the old tipMap served into a variant-tip table.
 *
 *   library.ts      — the movement's general coaching cue
 *   variantTips.ts  — prescription-specific and week-scoped tips, keyed by the
 *                     exact exercise name a plan renders
 *
 * Together these cover exactly what WorkoutView's inline tipMap served, which
 * is what `verify:tip-coverage` asserts.
 *
 * Idempotent: re-running replaces existing tip blocks rather than stacking.
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { createResolver } from '../src/data/exercises';
import { translations } from '../src/contexts/translations';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const libPath = join(root, 'src', 'data', 'exercises', 'library.ts');

type Resolved = { id: string; en: string; pl: string; chosenKey: string };
const { tips } = JSON.parse(
    readFileSync(join(root, 'output', 'tips-resolved.json'), 'utf8')
) as { tips: Resolved[] };

const quote = (s: string) =>
    `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, ' ').trim()}'`;

// ---------------------------------------------------------------------------
// 1. Library tips — the movement's general cue
// ---------------------------------------------------------------------------

const byId = new Map(tips.filter(t => t.en?.trim()).map(t => [t.id, t]));

let source = readFileSync(libPath, 'utf8');
source = source.replace(/\n {8}tip: \{[^}]*\},/g, '');   // keeps this idempotent

let applied = 0;
source = source.replace(/( {8}id: '([^']+)',\n)/g, (whole: string, _m: string, id: string) => {
    const tip = byId.get(id);
    if (!tip) return whole;
    applied++;
    const pl = tip.pl?.trim() ? quote(tip.pl) : "''";
    return `${whole}        tip: { en: ${quote(tip.en)}, pl: ${pl} },\n`;
});

writeFileSync(libPath, source, 'utf8');

// ---------------------------------------------------------------------------
// 2. Variant tips — everything else tipMap served
// ---------------------------------------------------------------------------

/**
 * Keyed by the exact exercise name tipMap looked up.
 *
 * Two kinds land here: prescription-specific tips ("Conventional Deadlift
 * (ME)", "Paused Bench Press (Light)") and week-scoped special cases
 * (walkingLungesWeek11). Both are live today and must not regress.
 *
 * Keying by *name* rather than by translation key is the point — a first
 * attempt keyed by translation key and silently dropped every
 * identifier-keyed entry, because there was no name left to match at runtime.
 *
 * Built by re-parsing tipMap, so coverage is exact by construction.
 */
type Bundle = Record<string, { tips?: Record<string, string> }>;
const tipsEn = (translations as unknown as Bundle).en?.tips ?? {};
const tipsPl = (translations as unknown as Bundle).pl?.tips ?? {};

/**
 * Sourced from git history, not the working tree: this script is what *removes*
 * the tipMap, so after the first run the working copy no longer has it and a
 * naive read would silently regenerate an empty table.
 */
const findTipMap = (): string => {
    const local = readFileSync(join(root, 'src', 'pages', 'WorkoutView.tsx'), 'utf8');
    const localAt = local.indexOf('const tipMap');
    if (localAt !== -1) return local.slice(localAt, localAt + 12000);

    for (const rev of ['HEAD', 'HEAD~1', 'HEAD~2', 'HEAD~3', 'HEAD~4', 'HEAD~5', 'HEAD~6']) {
        try {
            const file = execSync(`git show ${rev}:src/pages/WorkoutView.tsx`, {
                cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
            });
            const at = file.indexOf('const tipMap');
            if (at !== -1) return file.slice(at, at + 12000);
        } catch {
            // revision unavailable; try the next
        }
    }
    throw new Error('Could not find tipMap in the working tree or recent history.');
};

const block = findTipMap();

const resolver = createResolver(EXERCISE_LIBRARY);
const libraryTipFor = new Map(tips.filter(t => t.en?.trim()).map(t => [t.id, t.en.trim()]));

/**
 * Reads `weekNum >= 11 && weekNum <= 12` style guards so a week-scoped tip
 * stays week-scoped. Without this the special-case branch wins in every week —
 * Walking Lunges would show its weeks 11-12 rest-pause instruction in week 1.
 */
const weeksFromCondition = (condition: string): number[] | undefined => {
    if (!condition) return undefined;
    const ge = condition.match(/weekNum\s*>=\s*(\d+)/);
    const le = condition.match(/weekNum\s*<=\s*(\d+)/);
    const eq = condition.match(/weekNum\s*===?\s*(\d+)/);
    if (eq) return [Number(eq[1])];
    if (ge || le) {
        const lo = ge ? Number(ge[1]) : 1;
        const hi = le ? Number(le[1]) : 52;
        if (hi - lo > 51) return undefined;
        return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
    }
    return undefined;
};

type VariantTip = { en: string; pl: string; weeks?: number[] };
const variantEntries = new Map<string, VariantTip[]>();

for (const m of block.matchAll(/"([^"]+)":\s*(?:\(([^)]*)\)\s*\?\s*)?"([^"]+)"(?:\s*:\s*"([^"]+)")?/g)) {
    const [, name, condition, first, second] = m;
    const branches: { key: string; weeks?: number[] }[] = condition && second
        ? [{ key: first, weeks: weeksFromCondition(condition) }, { key: second }]
        : [{ key: first }];

    for (const { key, weeks } of branches) {
        const en = tipsEn[key];
        if (!en) continue;
        const entry = resolver.resolve(name);
        if (entry && libraryTipFor.get(entry.id) === en.trim()) continue;  // already the library cue

        const list = variantEntries.get(name) ?? [];
        if (list.some(v => v.en === en)) continue;
        list.push({ en, pl: tipsPl[key] ?? '', ...(weeks ? { weeks } : {}) });
        variantEntries.set(name, list);
    }
}

const variantFile = [
    '/**',
    " * Exercise tips that are not a movement's general coaching cue, keyed by the",
    ' * exact name a plan renders.',
    ' *',
    ' * Prescription-specific ("Conventional Deadlift (ME)", "Paused Bench Press',
    ' * (Light)") and week-scoped special cases. These describe how a set is run on',
    ' * a given day rather than how the movement is performed, so they are',
    ' * intentionally NOT library tips — see library.ts.',
    ' *',
    ' * Generated by scripts/apply-tips.ts from the former WorkoutView tipMap, so',
    ' * library tips + these cover everything that map served.',
    ' */',
    '',
    '/** `weeks` restricts a tip to those training weeks; absent means always. */',
    'export type VariantTip = { en: string; pl: string; weeks?: number[] };',
    '',
    'export const EXERCISE_VARIANT_TIPS: Record<string, VariantTip[]> = {',
    ...[...variantEntries.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, list]) => {
            const items = list
                .map(v => {
                    const weeks = v.weeks ? `, weeks: [${v.weeks.join(', ')}]` : '';
                    return `        { en: ${quote(v.en)}, pl: ${v.pl.trim() ? quote(v.pl) : "''"}${weeks} },`;
                })
                .join('\n');
            return `    ${JSON.stringify(name)}: [\n${items}\n    ],`;
        }),
    '};',
    '',
    '/**',
    ' * Most specific match wins: a week-scoped tip applies only inside its weeks,',
    ' * and an unscoped one is the fallback for every other week.',
    ' */',
    'export const getVariantTip = (name: string, week: number): VariantTip | undefined => {',
    '    const list = EXERCISE_VARIANT_TIPS[name];',
    '    if (!list?.length) return undefined;',
    '    return list.find(v => v.weeks?.includes(week)) ?? list.find(v => !v.weeks);',
    '};',
    '',
].join('\n');

writeFileSync(join(root, 'src', 'data', 'exercises', 'variantTips.ts'), variantFile, 'utf8');

const withPl = tips.filter(t => t.en?.trim() && t.pl?.trim()).length;
console.log('  apply-tips');
console.log(`   ${applied} library tips (${withPl} with Polish)`);
console.log(`   ${variantEntries.size} variant tips -> src/data/exercises/variantTips.ts`);
