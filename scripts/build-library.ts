/**
 * build-library
 *
 * One-shot generator for src/data/exercises/library.ts.
 *
 * Combines the machine-clustered inventory with the hand corrections below,
 * and pre-fills Polish names from the two places the repo already has them.
 * After this runs once, library.ts is hand-maintained source (and editable
 * from the admin panel) — do not re-run it over a curated library.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ADVENTURE_EXERCISES } from '../src/data/adventure';
import { translations } from '../src/contexts/translations';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

type Inventory = {
    clusters: { normalised: string; names: string[]; plans: string[] }[];
    sightings: Record<string, { plan: string; where: string }[]>;
};
const inv: Inventory = JSON.parse(readFileSync(join(root, 'output', 'exercise-inventory.json'), 'utf8'));

// ===========================================================================
// HAND CORRECTIONS — judgement the keyword inference can't supply
// ===========================================================================

/**
 * Not movements. "Tricep Giant Set" is a container; its three steps
 * (Bodyweight Dips, Rolling DB Tricep Extensions, Banded EZ Bar Skullcrushers)
 * are already separate entries.
 */
const DROP = new Set(['tricep-giant-set']);

/** Clusters the fuzzy matcher missed. Key merges into value; key becomes an alias. */
const MERGE_INTO: Record<string, string> = {
    '45-degree-hyperextension': '45-back-extension',
    'squat': 'barbell-squat',                 // Peachy's bare "Squats" is a back squat
    'incline-dumbbell-curl': '30-incline-lying-dumbbell-curl',
};

/** Equipment the fallback got wrong. Replaces the inferred list outright. */
const EQUIPMENT_FIX: Record<string, string[]> = {
    'arnold-press': ['dumbbell'],
    'bulgarian-split-squat': ['dumbbell'],
    'front-foot-elevated-bulgarian-split-squat': ['dumbbell'],
    'deficit-reverse-lunge': ['dumbbell'],
    'walking-lunge': ['dumbbell'],
    'heel-elevated-goblet-squat': ['dumbbell'],
    'farmer-hold': ['dumbbell'],
    'french-press': ['ez-bar'],
    'hammer-curl': ['dumbbell'],
    'rope-hammer-curl': ['cable'],
    'heavy-rolling-tricep-extension': ['dumbbell'],
    'overhead-tricep-extension': ['dumbbell'],
    'single-arm-overhead-extension': ['dumbbell'],
    'tricep-extension': ['cable'],
    'lat-prayer': ['cable'],
    'stiletto-squat': ['dumbbell'],
    'shrug': ['barbell', 'dumbbell'],
    'inverted-row': ['bodyweight', 'barbell'],
    'assisted-pull-up': ['machine'],
    'glute-pump-finisher': ['bodyweight'],
};

/** Movements loaded as bodyweight + added weight; drives total-system-weight maths. */
const WEIGHTED_BODYWEIGHT = new Set(['weighted-pull-up', 'weighted-crunch', 'bodyweight-dip']);

/** Timed holds rather than rep-counted sets. */
const TIMED = new Set(['farmer-hold', 'plank', 'dead-hang-plank']);

/**
 * Ritual's accessory pools are deliberately generic slots ("Rows", "Calves"),
 * not specific movements. Tagging them keeps the admin UI honest about it.
 */
const GENERIC_SLOTS = new Set(['row', 'calf-raise', 'ham-curl', 'tricep-extension', 'shrug', 'face-pull', 'band-pull-apart', 'ab-wheel', 'leg-extension', 'hip-thrust', 'rear-delt-fly', 'plank']);

/**
 * Poliquin structural-balance references, expressed as a percentage of
 * Close-Grip Bench Press. Presented in the app as "Poliquin structural-balance
 * targets" — programming references, never safe/unsafe thresholds.
 * Source: the concept doc, section 2.6.
 */
const STRENGTH_REF: Record<string, { ratioOf: string; poliquinPercent: number }> = {
    'incline-barbell-bench-press': { ratioOf: 'close-grip-bench-press', poliquinPercent: 83 },
};

// ===========================================================================
// Polish name sources already in the repo
// ===========================================================================

const polishByEnglish = new Map<string, string>();

// 1. Adventure ships 62 curated bilingual names.
for (const ex of Object.values(ADVENTURE_EXERCISES)) {
    if (ex.name.pl && ex.name.pl !== ex.name.en) polishByEnglish.set(ex.name.en, ex.name.pl);
}

// 2. translations.exercises — populated in both languages but never referenced
//    by any call site. Absorbed here, then deleted from translations.ts.
const plExercises = (translations as Record<string, Record<string, unknown>>).pl?.exercises as Record<string, string> | undefined;
const enExercises = (translations as Record<string, Record<string, unknown>>).en?.exercises as Record<string, string> | undefined;
for (const [key, pl] of Object.entries(plExercises ?? {})) {
    const en = enExercises?.[key] ?? key;
    if (pl && pl !== en) polishByEnglish.set(key, pl);
}

// ===========================================================================
// Taxonomy inference (same rules as scaffold-library, kept in sync by hand)
// ===========================================================================

type Rule = { match: RegExp; pattern: string; primary: string[]; secondary?: string[] };

const RULES: Rule[] = [
    { match: /ab wheel|rollout|dragon flag|plank|hollow/, pattern: 'core-antiextension', primary: ['abs'], secondary: ['obliques'] },
    { match: /pallof|anti-?rotation|woodchop/, pattern: 'core-antirotation', primary: ['obliques'], secondary: ['abs'] },
    { match: /crunch|sit up|leg raise|knee raise|toes to bar|v-?up/, pattern: 'core-flexion', primary: ['abs'], secondary: ['obliques'] },
    { match: /dead hang/, pattern: 'carry', primary: ['forearms'], secondary: ['lats'] },
    { match: /farmer|carry|suitcase/, pattern: 'carry', primary: ['forearms', 'traps'], secondary: ['abs'] },
    { match: /calf|calves/, pattern: 'calf', primary: ['calves'] },
    { match: /external rotation|cuban|rotator/, pattern: 'external-rotation', primary: ['rotatorCuff'], secondary: ['rearDelt'] },
    { match: /face ?pull|rear[- ]?delt|reverse pec deck|band pull-?apart|y-?raise|around-the-world/, pattern: 'shoulder-horizontal-abduction', primary: ['rearDelt'], secondary: ['upperBack', 'rotatorCuff'] },
    { match: /lateral raise|lat raise/, pattern: 'shoulder-abduction', primary: ['sideDelt'] },
    { match: /shrug/, pattern: 'horizontal-pull', primary: ['traps'] },
    { match: /leg curl|ham curl|hamstring curl|nordic|glute ?-?ham raise/, pattern: 'knee-flexion', primary: ['hamstrings'], secondary: ['calves'] },
    { match: /pressdown|pushdown|skullcrusher|french press|tricep|triangle push|overhead extension/, pattern: 'elbow-extension', primary: ['triceps'] },
    { match: /reverse curl|hammer curl|rope hammer/, pattern: 'elbow-flexion', primary: ['brachialis', 'forearms'], secondary: ['biceps'] },
    { match: /curl/, pattern: 'elbow-flexion', primary: ['biceps'], secondary: ['brachialis'] },
    { match: /hip thrust|glute bridge|frog pump|kas/, pattern: 'hip-extension', primary: ['glutes'], secondary: ['hamstrings'] },
    { match: /back extension|hyperextension|reverse hyper|pull-?through/, pattern: 'hip-extension', primary: ['glutes', 'lowerBack'], secondary: ['hamstrings'] },
    { match: /good morning|romanian deadlift|stiff.?legged|rdl/, pattern: 'hinge', primary: ['hamstrings', 'glutes'], secondary: ['lowerBack'] },
    { match: /deadlift|block pull|rack pull/, pattern: 'hinge', primary: ['hamstrings', 'glutes', 'lowerBack'], secondary: ['traps', 'quads'] },
    { match: /leg extension|sissy/, pattern: 'knee-extension', primary: ['quads'] },
    { match: /lunge|split squat|step[- ]?up|skater/, pattern: 'lunge', primary: ['quads', 'glutes'], secondary: ['hamstrings'] },
    { match: /hip adduction|adductor/, pattern: 'hip-adduction', primary: ['adductors'] },
    { match: /hip abduction|abductor/, pattern: 'hip-abduction', primary: ['abductors', 'glutes'] },
    { match: /squat|leg press/, pattern: 'squat', primary: ['quads', 'glutes'], secondary: ['hamstrings', 'adductors'] },
    { match: /pull-?up|chin-?up|pulldown|lat prayer|pullover/, pattern: 'vertical-pull', primary: ['lats'], secondary: ['biceps', 'upperBack'] },
    { match: /row/, pattern: 'horizontal-pull', primary: ['upperBack', 'lats'], secondary: ['biceps', 'rearDelt'] },
    { match: /overhead press|military|shoulder press|arnold|behind-?the-?neck|btn press/, pattern: 'vertical-press', primary: ['frontDelt'], secondary: ['triceps', 'sideDelt'] },
    { match: /incline/, pattern: 'incline-press', primary: ['chest', 'frontDelt'], secondary: ['triceps'] },
    { match: /fly|flye|pec deck|crossover/, pattern: 'horizontal-press', primary: ['chest'], secondary: ['frontDelt'] },
    { match: /dip/, pattern: 'horizontal-press', primary: ['chest', 'triceps'], secondary: ['frontDelt'] },
    { match: /bench press|chest press|push-?up|floor press|pin press|spoto|larsen|board press/, pattern: 'horizontal-press', primary: ['chest'], secondary: ['triceps', 'frontDelt'] },
    { match: /glute pump|glute finisher/, pattern: 'hip-extension', primary: ['glutes'] },
    { match: /\bpress\b/, pattern: 'horizontal-press', primary: ['chest'], secondary: ['triceps', 'frontDelt'] },
];

const EQUIPMENT: [RegExp, string][] = [
    [/\btrx\b/, 'trx'], [/ab wheel/, 'ab-wheel'], [/smith/, 'smith'], [/hack/, 'hack-squat'],
    [/hammer (strength|chest|upper|lower|pulldown|underhand|row)/, 'hammer-strength'],
    [/pec deck/, 'pec-deck'], [/leg extension/, 'leg-extension'], [/leg curl|ham(string)? curl/, 'leg-curl'],
    [/rear delt (machine|fly)|reverse pec deck/, 'rear-delt-machine'], [/\bez\b|ez-?bar/, 'ez-bar'],
    [/cable|pulldown|pressdown|pushdown|crossover|pull-?through/, 'cable'],
    [/dumbbell|\bdb\b/, 'dumbbell'], [/barbell|\bbb\b|\bbar\b/, 'barbell'],
    [/kettlebell|\bkb\b/, 'kettlebell'], [/band/, 'bands'],
    [/machine|leg press|selectorized/, 'machine'],
    [/pull-?up|chin-?up|hanging|dead hang/, 'pull-up-bar'], [/\bdip\b|dips/, 'dip-station'],
    [/push-?up|plank|dragon flag|inverted row|bodyweight|sissy|nordic|frog pump|glute bridge/, 'bodyweight'],
    [/back extension|hyperextension|reverse hyper|glute ?-?ham raise|roman chair/, 'machine'],
    [/hip thrust|hip adduction|hip abduction/, 'machine'],
];

const EQUIPMENT_FALLBACK_BY_PATTERN: Record<string, string> = {
    'core-flexion': 'bodyweight', 'core-antiextension': 'bodyweight', 'core-antirotation': 'cable',
    'calf': 'machine', 'knee-flexion': 'leg-curl', 'knee-extension': 'leg-extension',
    'hip-extension': 'machine', 'hip-abduction': 'machine', 'hip-adduction': 'machine',
    'external-rotation': 'cable', 'shoulder-abduction': 'dumbbell', 'shoulder-horizontal-abduction': 'cable',
};

const hasParen = (n: string) => /\(/.test(n);
const pickCanonical = (names: string[]): string => {
    const score = (n: string) => inv.sightings[n]?.length ?? 0;
    const plain = names.filter(n => !hasParen(n));
    const pool = plain.length ? plain : names;
    return [...pool].sort((a, b) => score(b) - score(a) || b.length - a.length || a.localeCompare(b))[0];
};
const toId = (key: string) => key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').replace(/-+/g, '-');

// ===========================================================================
// Build
// ===========================================================================

type Entry = {
    id: string; en: string; pl: string; aliases: string[];
    pattern: string; primary: string[]; secondary?: string[];
    equipment: string[]; unilateral: boolean; weightMode: string;
    plans: string[]; generic: boolean;
    strengthRef?: { ratioOf: string; poliquinPercent: number };
};

const byId = new Map<string, Entry>();

for (const c of inv.clusters) {
    const id = toId(c.normalised);
    if (DROP.has(id)) continue;

    const canonical = pickCanonical(c.names);
    const hay = `${canonical.toLowerCase()} ${c.normalised}`;
    const rule = RULES.find(r => r.match.test(hay));

    let equipment = [...new Set(EQUIPMENT.filter(([re]) => re.test(hay)).map(([, eq]) => eq))];
    if (!equipment.length) equipment = [EQUIPMENT_FALLBACK_BY_PATTERN[rule?.pattern ?? ''] ?? 'barbell'];
    if (EQUIPMENT_FIX[id]) equipment = EQUIPMENT_FIX[id];

    const weightMode = WEIGHTED_BODYWEIGHT.has(id) ? 'weighted-bodyweight'
        : TIMED.has(id) ? 'timed'
            : /push-?up|pull-?up|chin-?up|\bdip\b|plank|dragon flag|inverted row|hanging|sissy|nordic|dead hang|frog pump/.test(hay) ? 'bodyweight'
                : 'external';

    byId.set(id, {
        id,
        en: canonical,
        pl: polishByEnglish.get(canonical) ?? '',
        aliases: c.names.filter(n => n !== canonical).sort(),
        pattern: rule?.pattern ?? 'other',
        primary: rule?.primary ?? [],
        secondary: rule?.secondary,
        equipment,
        unilateral: /single|one-?arm|one-?leg|1-?arm|unilateral|b-?stance|split squat|skater|bulgarian|leaning/.test(hay),
        weightMode,
        plans: c.plans,
        generic: GENERIC_SLOTS.has(id),
        strengthRef: STRENGTH_REF[id],
    });
}

// Apply hand merges: the merged-away id becomes an alias of its target.
for (const [from, to] of Object.entries(MERGE_INTO)) {
    const src = byId.get(from);
    const dst = byId.get(to);
    if (!src || !dst) {
        console.warn(`  merge skipped: ${from} -> ${to} (missing ${!src ? from : to})`);
        continue;
    }
    dst.aliases = [...new Set([...dst.aliases, src.en, ...src.aliases])].sort();
    dst.plans = [...new Set([...dst.plans, ...src.plans])].sort();
    if (!dst.pl && src.pl) dst.pl = src.pl;
    byId.delete(from);
}

// Polish can also be keyed off any alias, not just the canonical spelling.
for (const e of byId.values()) {
    if (e.pl) continue;
    for (const alias of e.aliases) {
        const pl = polishByEnglish.get(alias);
        if (pl) { e.pl = pl; break; }
    }
}

const entries = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));

// Aliases must be globally unique, or resolution is ambiguous.
const aliasOwner = new Map<string, string>();
const aliasClashes: string[] = [];
for (const e of entries) {
    for (const a of [e.en, ...e.aliases]) {
        const key = a.toLowerCase();
        if (aliasOwner.has(key) && aliasOwner.get(key) !== e.id) {
            aliasClashes.push(`"${a}" claimed by both ${aliasOwner.get(key)} and ${e.id}`);
        }
        aliasOwner.set(key, e.id);
    }
}
if (aliasClashes.length) {
    console.error('  alias clashes:');
    for (const c of aliasClashes) console.error(`   - ${c}`);
    process.exit(1);
}

// ===========================================================================
// Emit
// ===========================================================================

const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const arr = (xs: string[]) => `[${xs.map(q).join(', ')}]`;

const out: string[] = [];
out.push('/**');
out.push(' * The exercise library — canonical definition of every movement in the app.');
out.push(' *');
out.push(' * Generated once from the plan corpus by `scripts/build-library.ts`, then');
out.push(' * hand-maintained. Admin edits from the Exercise Library tab are stored as a');
out.push(' * Firestore overlay and merged over this seed at runtime, so the app always');
out.push(' * renders from bundled data even if Firestore is unavailable.');
out.push(' *');
out.push(' * `aliases` carries every legacy spelling a plan or an old workout log might');
out.push(' * use. History and progression join on exercise name in ~10 places, so an');
out.push(' * alias is never removed — merging two movements folds the loser in here.');
out.push(' *');
out.push(" * `name.pl` empty means not yet translated; the UI falls back to English and");
out.push(' * the admin Library tab lists these under its "Missing Polish" filter.');
out.push(' */');
out.push('');
out.push("import type { LibraryExercise } from './types';");
out.push('');
out.push('export const EXERCISE_LIBRARY: LibraryExercise[] = [');

for (const e of entries) {
    out.push('    {');
    out.push(`        id: ${q(e.id)},`);
    out.push(`        name: { en: ${q(e.en)}, pl: ${q(e.pl)} },`);
    out.push(`        aliases: ${arr(e.aliases)},`);
    out.push(`        pattern: ${q(e.pattern)},`);
    out.push(`        primary: ${arr(e.primary)},`);
    if (e.secondary?.length) out.push(`        secondary: ${arr(e.secondary)},`);
    out.push(`        equipment: ${arr(e.equipment)},`);
    if (e.unilateral) out.push('        unilateral: true,');
    out.push(`        weightMode: ${q(e.weightMode)},`);
    if (e.strengthRef) out.push(`        strengthRef: { ratioOf: ${q(e.strengthRef.ratioOf)}, poliquinPercent: ${e.strengthRef.poliquinPercent} },`);
    if (e.generic) out.push("        tags: ['generic-slot'],");
    out.push("        status: 'active',");
    out.push('    },');
}
out.push('];');
out.push('');
out.push('/** Fast id lookup. */');
out.push('export const EXERCISE_BY_ID: Record<string, LibraryExercise> = Object.fromEntries(');
out.push('    EXERCISE_LIBRARY.map(exercise => [exercise.id, exercise])');
out.push(');');
out.push('');

writeFileSync(join(root, 'src', 'data', 'exercises', 'library.ts'), out.join('\n'), 'utf8');

const withPl = entries.filter(e => e.pl).length;
console.log('  build-library');
console.log(`   ${entries.length} exercises -> src/data/exercises/library.ts`);
console.log(`   ${entries.length + [...Object.keys(MERGE_INTO)].length} clusters in, ${DROP.size} dropped, ${Object.keys(MERGE_INTO).length} hand-merged`);
console.log(`   Polish names: ${withPl} pre-filled, ${entries.length - withPl} awaiting translation in the admin panel`);
console.log(`   aliases: ${entries.reduce((n, e) => n + e.aliases.length, 0)} legacy spellings preserved`);
