/**
 * scaffold-library
 *
 * Turns output/exercise-inventory.json into a first-draft
 * src/data/exercises/library.generated.ts: one entry per movement cluster,
 * with id, canonical name, aliases, and taxonomy inferred from keywords.
 *
 * The inference is a starting point, not an authority. The generated file is
 * reviewed and curated into library.ts, which is then hand-maintained — this
 * script is not re-run over a curated library.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

type Inventory = {
    clusters: { normalised: string; names: string[]; plans: string[] }[];
    sightings: Record<string, { plan: string; where: string }[]>;
};

const inv: Inventory = JSON.parse(readFileSync(join(root, 'output', 'exercise-inventory.json'), 'utf8'));

// ---------------------------------------------------------------------------
// Canonical name selection
// ---------------------------------------------------------------------------

const hasParen = (n: string) => /\(/.test(n);

/**
 * Prefer a spelling with no parenthetical qualifier (those are effort markers
 * like "(ME)" or "(Back-off)", which belong in the prescription, not the name),
 * then the one seen in the most places, then the most explicit spelling.
 */
const pickCanonical = (names: string[]): string => {
    const score = (n: string) => inv.sightings[n]?.length ?? 0;
    const plain = names.filter(n => !hasParen(n));
    const pool = plain.length ? plain : names;
    return [...pool].sort((a, b) => score(b) - score(a) || b.length - a.length || a.localeCompare(b))[0];
};

const toId = (key: string) =>
    key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').replace(/-+/g, '-');

// ---------------------------------------------------------------------------
// Taxonomy inference
// ---------------------------------------------------------------------------

type Rule = {
    match: RegExp;
    pattern: string;
    primary: string[];
    secondary?: string[];
};

/** First match wins, so the list runs most-specific to most-general. */
const RULES: Rule[] = [
    // --- core / abs ---
    { match: /ab wheel|rollout|dragon flag|plank|hollow/, pattern: 'core-antiextension', primary: ['abs'], secondary: ['obliques'] },
    { match: /pallof|anti-?rotation|woodchop/, pattern: 'core-antirotation', primary: ['obliques'], secondary: ['abs'] },
    { match: /crunch|sit up|leg raise|knee raise|toes to bar|v-?up/, pattern: 'core-flexion', primary: ['abs'], secondary: ['obliques'] },
    { match: /dead hang/, pattern: 'carry', primary: ['forearms'], secondary: ['lats'] },
    { match: /farmer|carry|suitcase/, pattern: 'carry', primary: ['forearms', 'traps'], secondary: ['abs'] },

    // --- calves ---
    { match: /calf|calves/, pattern: 'calf', primary: ['calves'] },

    // --- shoulders (isolation) ---
    { match: /external rotation|cuban|rotator/, pattern: 'external-rotation', primary: ['rotatorCuff'], secondary: ['rearDelt'] },
    { match: /face ?pull|rear[- ]?delt|reverse pec deck|band pull-?apart|y-?raise|around-the-world/, pattern: 'shoulder-horizontal-abduction', primary: ['rearDelt'], secondary: ['upperBack', 'rotatorCuff'] },
    { match: /lateral raise|lat raise/, pattern: 'shoulder-abduction', primary: ['sideDelt'] },
    { match: /shrug/, pattern: 'horizontal-pull', primary: ['traps'] },

    // --- knee flexion MUST precede the arm-curl rules: "Seated Leg Curls"
    //     contains "curl" and would otherwise be classified as biceps. ---
    { match: /leg curl|ham curl|hamstring curl|nordic|glute ?-?ham raise/, pattern: 'knee-flexion', primary: ['hamstrings'], secondary: ['calves'] },

    // --- arms ---
    { match: /pressdown|pushdown|skullcrusher|french press|tricep|triangle push|overhead extension/, pattern: 'elbow-extension', primary: ['triceps'] },
    { match: /reverse curl|hammer curl|rope hammer/, pattern: 'elbow-flexion', primary: ['brachialis', 'forearms'], secondary: ['biceps'] },
    { match: /curl/, pattern: 'elbow-flexion', primary: ['biceps'], secondary: ['brachialis'] },

    // --- legs: posterior ---
    { match: /hip thrust|glute bridge|frog pump|kas/, pattern: 'hip-extension', primary: ['glutes'], secondary: ['hamstrings'] },
    { match: /back extension|hyperextension|reverse hyper|pull-?through/, pattern: 'hip-extension', primary: ['glutes', 'lowerBack'], secondary: ['hamstrings'] },
    { match: /good morning|romanian deadlift|stiff.?legged|rdl/, pattern: 'hinge', primary: ['hamstrings', 'glutes'], secondary: ['lowerBack'] },
    { match: /deadlift|block pull|rack pull/, pattern: 'hinge', primary: ['hamstrings', 'glutes', 'lowerBack'], secondary: ['traps', 'quads'] },

    // --- legs: anterior ---
    { match: /leg extension|sissy/, pattern: 'knee-extension', primary: ['quads'] },
    { match: /lunge|split squat|step[- ]?up|skater/, pattern: 'lunge', primary: ['quads', 'glutes'], secondary: ['hamstrings'] },
    { match: /hip adduction|adductor/, pattern: 'hip-adduction', primary: ['adductors'] },
    { match: /hip abduction|abductor/, pattern: 'hip-abduction', primary: ['abductors', 'glutes'] },
    { match: /squat|leg press/, pattern: 'squat', primary: ['quads', 'glutes'], secondary: ['hamstrings', 'adductors'] },

    // --- back ---
    { match: /pull-?up|chin-?up|pulldown|lat prayer|pullover/, pattern: 'vertical-pull', primary: ['lats'], secondary: ['biceps', 'upperBack'] },
    { match: /row/, pattern: 'horizontal-pull', primary: ['upperBack', 'lats'], secondary: ['biceps', 'rearDelt'] },

    // --- pressing ---
    { match: /overhead press|military|shoulder press|arnold|behind-?the-?neck|btn press/, pattern: 'vertical-press', primary: ['frontDelt'], secondary: ['triceps', 'sideDelt'] },
    { match: /incline/, pattern: 'incline-press', primary: ['chest', 'frontDelt'], secondary: ['triceps'] },
    { match: /fly|flye|pec deck|crossover/, pattern: 'horizontal-press', primary: ['chest'], secondary: ['frontDelt'] },
    { match: /dip/, pattern: 'horizontal-press', primary: ['chest', 'triceps'], secondary: ['frontDelt'] },
    { match: /bench press|chest press|push-?up|floor press|pin press|spoto|larsen|board press/, pattern: 'horizontal-press', primary: ['chest'], secondary: ['triceps', 'frontDelt'] },
    { match: /glute pump|glute finisher/, pattern: 'hip-extension', primary: ['glutes'] },
    // Catch-all for bare "... Press" (e.g. "Flat DB Press") after every
    // specific press rule above has had its chance.
    { match: /\bpress\b/, pattern: 'horizontal-press', primary: ['chest'], secondary: ['triceps', 'frontDelt'] },
];

const EQUIPMENT: [RegExp, string][] = [
    [/\btrx\b/, 'trx'],
    [/ab wheel/, 'ab-wheel'],
    [/smith/, 'smith'],
    [/hack/, 'hack-squat'],
    [/hammer (strength|chest|upper|lower|pulldown|underhand|row)/, 'hammer-strength'],
    [/pec deck/, 'pec-deck'],
    [/leg extension/, 'leg-extension'],
    [/leg curl|ham(string)? curl/, 'leg-curl'],
    [/rear delt (machine|fly)|reverse pec deck/, 'rear-delt-machine'],
    [/\bez\b|ez-?bar/, 'ez-bar'],
    [/cable|pulldown|pressdown|pushdown|crossover|pull-?through/, 'cable'],
    [/dumbbell|\bdb\b/, 'dumbbell'],
    [/barbell|\bbb\b|\bbar\b/, 'barbell'],
    [/kettlebell|\bkb\b/, 'kettlebell'],
    [/band/, 'bands'],
    [/machine|leg press|selectorized/, 'machine'],
    [/pull-?up|chin-?up|hanging|dead hang/, 'pull-up-bar'],
    [/\bdip\b|dips/, 'dip-station'],
    [/push-?up|plank|dragon flag|inverted row|bodyweight|sissy|nordic|frog pump|glute bridge/, 'bodyweight'],
    [/back extension|hyperextension|reverse hyper|glute ?-?ham raise|roman chair/, 'machine'],
    [/hip thrust|hip adduction|hip abduction/, 'machine'],
];

/**
 * Only movements that are genuinely loaded with a bar should fall back to
 * 'barbell'; everything else falls back by pattern so we don't claim a
 * back extension needs a barbell.
 */
const EQUIPMENT_FALLBACK_BY_PATTERN: Record<string, string> = {
    'core-flexion': 'bodyweight',
    'core-antiextension': 'bodyweight',
    'core-antirotation': 'cable',
    'calf': 'machine',
    'knee-flexion': 'leg-curl',
    'knee-extension': 'leg-extension',
    'hip-extension': 'machine',
    'hip-abduction': 'machine',
    'hip-adduction': 'machine',
    'external-rotation': 'cable',
    'shoulder-abduction': 'dumbbell',
    'shoulder-horizontal-abduction': 'cable',
};

const infer = (canonical: string, normalised: string) => {
    const hay = `${canonical.toLowerCase()} ${normalised}`;

    const rule = RULES.find(r => r.match.test(hay));
    const equipment = [...new Set(EQUIPMENT.filter(([re]) => re.test(hay)).map(([, eq]) => eq))];

    if (!equipment.length) {
        equipment.push(EQUIPMENT_FALLBACK_BY_PATTERN[rule?.pattern ?? ''] ?? 'barbell');
    }

    const bodyweightish = /push-?up|pull-?up|chin-?up|\bdip\b|plank|dragon flag|inverted row|hanging|sissy|nordic|dead hang|frog pump/.test(hay);
    const weighted = /weighted/.test(hay);
    const timed = /hold|plank|hang|sec\b/.test(hay);

    const weightMode = weighted ? 'weighted-bodyweight'
        : bodyweightish ? 'bodyweight'
            : timed ? 'timed'
                : 'external';

    const unilateral = /single|one-?arm|one-?leg|1-?arm|unilateral|b-?stance|split squat|skater|bulgarian|leaning/.test(hay);

    return {
        pattern: rule?.pattern ?? 'other',
        primary: rule?.primary ?? [],
        secondary: rule?.secondary,
        equipment,
        weightMode,
        unilateral,
        confident: Boolean(rule)
    };
};

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------

const entries = inv.clusters
    .map(c => {
        const canonical = pickCanonical(c.names);
        const aliases = c.names.filter(n => n !== canonical).sort();
        const t = infer(canonical, c.normalised);
        return { id: toId(c.normalised), canonical, aliases, plans: c.plans, ...t };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

const dupes = entries.map(e => e.id).filter((id, i, a) => a.indexOf(id) !== i);
if (dupes.length) console.warn(`  duplicate ids after slugging: ${[...new Set(dupes)].join(', ')}`);

const q = (s: string) => `'${s.replace(/'/g, "\\'")}'`;
const arr = (xs: string[]) => `[${xs.map(q).join(', ')}]`;

const lines: string[] = [];
lines.push('/**');
lines.push(' * GENERATED DRAFT — lives in output/, not src/, because it is not importable');
lines.push(' * source. Review and curate into src/data/exercises/library.ts.');
lines.push(' *');
lines.push(' * Produced by `npm run scaffold:library` from output/exercise-inventory.json.');
lines.push(' * Taxonomy below is keyword-inferred; entries marked REVIEW had no rule match');
lines.push(' * and need a pattern and muscles assigned by hand. Polish names and tips are');
lines.push(' * filled in separately by the tip merger.');
lines.push(' */');
lines.push('');
lines.push("import type { LibraryExercise } from '../src/data/exercises/types';");
lines.push('');
lines.push('export const DRAFT_LIBRARY: LibraryExercise[] = [');

for (const e of entries) {
    lines.push(`    {`);
    if (!e.confident) lines.push(`        // REVIEW: no taxonomy rule matched`);
    lines.push(`        id: ${q(e.id)},`);
    lines.push(`        name: { en: ${q(e.canonical)}, pl: ${q(e.canonical)} },`);
    lines.push(`        aliases: ${arr(e.aliases)},`);
    lines.push(`        pattern: ${q(e.pattern)},`);
    lines.push(`        primary: ${arr(e.primary)},`);
    if (e.secondary?.length) lines.push(`        secondary: ${arr(e.secondary)},`);
    lines.push(`        equipment: ${arr(e.equipment)},`);
    if (e.unilateral) lines.push(`        unilateral: true,`);
    lines.push(`        weightMode: ${q(e.weightMode)},`);
    lines.push(`        status: 'active',`);
    lines.push(`        // plans: ${e.plans.join(', ')}`);
    lines.push(`    },`);
}
lines.push('];');
lines.push('');

writeFileSync(join(root, 'output', 'library.draft.ts'), lines.join('\n'), 'utf8');

const needsReview = entries.filter(e => !e.confident);
const byPattern = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.pattern] = (acc[e.pattern] ?? 0) + 1;
    return acc;
}, {});

console.log('  scaffold:library');
console.log(`   ${entries.length} draft entries -> output/library.draft.ts`);
console.log(`   ${needsReview.length} need manual taxonomy:`);
for (const e of needsReview) console.log(`      - ${e.id}  (${e.canonical})`);
console.log('   pattern spread:');
for (const [p, n] of Object.entries(byPattern).sort((a, b) => b[1] - a[1])) console.log(`      ${String(n).padStart(3)}  ${p}`);
