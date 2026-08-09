/**
 * migrate-tips
 *
 * Joins the four independent tip mechanisms into one canonical tip per library
 * exercise, and reports what needs a human decision.
 *
 * Sources:
 *   1. WorkoutView's `tipMap` — ~97 entries mapping exercise display name to a
 *      `tips.*` translation key, rebuilt inside the render loop.
 *   2. `notes: 't:tips.*'` markers on plan exercises (66 occurrences).
 *   3. Inline English `notes` strings on plan exercises.
 *   4. Adventure's per-exercise bilingual `cue` objects.
 *
 * Text for 1 and 2 lives in translations.ts under en.tips / pl.tips.
 *
 * Output:
 *   output/tip-merge-report.md   — per-exercise candidates, collisions, orphans
 *   output/tips-resolved.json    — machine-readable, consumed by apply-tips
 *
 * Wording judgement is not automated: where an exercise has several candidate
 * tips this reports all of them and picks a provisional winner, for review.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { createResolver } from '../src/data/exercises';
import { ADVENTURE_EXERCISES } from '../src/data/adventure';
import { translations } from '../src/contexts/translations';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const resolver = createResolver(EXERCISE_LIBRARY);

type Lang = 'en' | 'pl';
type Candidate = {
    key: string;              // tips.* key, adventure key, or 'inline'
    source: string;           // where it came from, for the report
    en: string;
    pl: string;
    plans: string[];
};

const tipsEn = ((translations as Record<string, any>).en?.tips ?? {}) as Record<string, string>;
const tipsPl = ((translations as Record<string, any>).pl?.tips ?? {}) as Record<string, string>;

const candidates = new Map<string, Candidate[]>();   // exerciseId -> candidates
const usedKeys = new Set<string>();
const unmatched: { name: string; source: string }[] = [];

const addCandidate = (name: string, candidate: Candidate) => {
    const entry = resolver.resolve(name);
    if (!entry) {
        unmatched.push({ name, source: candidate.source });
        return;
    }
    const list = candidates.get(entry.id) ?? [];
    // Same key already recorded for this exercise: merge the plan list.
    const existing = list.find(c => c.key === candidate.key);
    if (existing) {
        existing.plans = [...new Set([...existing.plans, ...candidate.plans])];
        return;
    }
    list.push(candidate);
    candidates.set(entry.id, list);
};

// ---------------------------------------------------------------------------
// Source 1 — WorkoutView tipMap
// ---------------------------------------------------------------------------

const workoutView = readFileSync(join(root, 'src', 'pages', 'WorkoutView.tsx'), 'utf8');

// Entries look like:  "Paused Bench Press": "pausedBench",
// or context-branched: "Walking Lunges": (weekNum >= 11) ? "a" : "b",
const tipMapBlock = workoutView.slice(
    workoutView.indexOf('const tipMap'),
    workoutView.indexOf('const tipMap') + 12000
);

let tipMapCount = 0;
// Keys may be plain identifiers OR full display names — `t()` splits the path
// on '.', and a name like "Conventional Deadlift (ME)" contains none, so
// tips["Conventional Deadlift (ME)"] resolves fine. Those 21 entries look
// self-referential but are live, effort-variant-specific tips.
for (const m of tipMapBlock.matchAll(/"([^"]+)":\s*(?:\(([^)]*)\)\s*\?\s*)?"([^"]+)"(?:\s*:\s*"([^"]+)")?/g)) {
    const [, name, condition, first, second] = m;
    const keys = [first, second].filter(Boolean) as string[];
    for (const [branch, key] of keys.entries()) {
        if (!tipsEn[key]) continue;
        usedKeys.add(key);
        tipMapCount++;
        // In `cond ? special : base` the second branch is the fallback, i.e. the
        // movement's normal cue; the first is the week/plan special case.
        const isConditionalSpecialCase = Boolean(condition) && keys.length > 1 && branch === 0;
        addCandidate(name, {
            key,
            source: !condition
                ? 'WorkoutView tipMap'
                : isConditionalSpecialCase
                    ? `WorkoutView tipMap (special case: ${condition.trim().slice(0, 50)})`
                    : 'WorkoutView tipMap (default branch)',
            en: tipsEn[key] ?? '',
            pl: tipsPl[key] ?? '',
            plans: [],
        });
    }
}

// ---------------------------------------------------------------------------
// Sources 2 + 3 — notes on plan exercises
// ---------------------------------------------------------------------------

const FILE_TO_PLAN: Record<string, string> = {
    program: 'bench-domination', pencilneck: 'pencilneck-eradication',
    skeleton: 'skeleton-to-threat', peachy: 'peachy-glute-plan',
    painglory: 'pain-and-glory', trinary: 'trinary',
    ritual: 'ritual-of-strength', supermutant: 'super-mutant',
    adventure: '30-minute-adventure',
};

const dataDir = join(root, 'src', 'data');
let markerCount = 0;
let inlineCount = 0;

for (const file of readdirSync(dataDir).filter(f => f.endsWith('.ts'))) {
    const planId = FILE_TO_PLAN[file.replace('.ts', '')];
    if (!planId) continue;
    const src = readFileSync(join(dataDir, file), 'utf8');

    // Pair each note with the nearest preceding `name:` in the same literal.
    const lines = src.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const noteMatch = lines[i].match(/\bnotes:\s*(['"`])([^'"`]+)\1/);
        if (!noteMatch) continue;
        const note = noteMatch[2];

        let name: string | undefined;
        for (let j = i; j >= Math.max(0, i - 8); j--) {
            const nm = lines[j].match(/\bname:\s*(['"`])([^'"`]+)\1/);
            if (nm) { name = nm[2]; break; }
        }
        if (!name) continue;

        if (note.startsWith('t:')) {
            const key = note.slice(2).replace(/^tips\./, '');
            if (!tipsEn[key]) continue;
            usedKeys.add(key);
            markerCount++;
            addCandidate(name, {
                key, source: `${planId} notes marker`,
                en: tipsEn[key] ?? '', pl: tipsPl[key] ?? '', plans: [planId],
            });
        } else {
            inlineCount++;
            addCandidate(name, {
                key: 'inline', source: `${planId} inline note (${file}:${i + 1})`,
                en: note, pl: '', plans: [planId],
            });
        }
    }
}

// ---------------------------------------------------------------------------
// Source 4 — Adventure cues (already bilingual)
// ---------------------------------------------------------------------------

const DEFAULT_CUE_EN = 'Control the eccentric and finish every rep in the same position.';
let cueCount = 0;
for (const ex of Object.values(ADVENTURE_EXERCISES)) {
    if (!ex.cue?.en || ex.cue.en === DEFAULT_CUE_EN) continue; // skip the boilerplate default
    cueCount++;
    addCandidate(ex.name.en, {
        key: `adventure:${ex.key}`, source: '30-minute-adventure cue',
        en: ex.cue.en, pl: ex.cue.pl ?? '', plans: ['30-minute-adventure'],
    });
}

// ---------------------------------------------------------------------------
// Pick a provisional winner per exercise
// ---------------------------------------------------------------------------

/**
 * Prescription-specific tips describe *how this set is being run today*
 * (Ascension Test, E2MOM, CAT, heavy single, back-down), not how the movement
 * is performed. Conventional Deadlift alone has 16 of them.
 *
 * They must not become the library default: the library tip is the movement's
 * general coaching cue, and anything effort-specific belongs on the plan as a
 * scoped override. Misclassifying here would show a Ritual ascension-test
 * instruction to someone doing a light Pain & Glory speed set.
 */
const PRESCRIPTION_MARKERS = /(ascension|amrap|e2mom|emom|\bcat\b|heavy (single|double|triple)|max single|back[- ]?down|back[- ]?off|light work|ramp ?in|optional|deload|1rm test|final exam|\(me\)|\(de\)|\(re\)|\btest\b|monday|tuesday|wednesday|thursday|friday|saturday|sunday|week \d|weeks \d|reps in reserve|explosive|active recovery|primer)/i;

/** camelCase keys like `conventionalCAT` need splitting before word-boundary tests. */
const humanise = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

const isPrescriptionSpecific = (c: Candidate) =>
    PRESCRIPTION_MARKERS.test(humanise(c.key)) || PRESCRIPTION_MARKERS.test(c.en.slice(0, 100));

/**
 * tipMap entries keyed by a plain identifier (`pausedBench`) rather than a full
 * display name (`Paused Bench Press (Light)`) are the curated general cues for
 * the movement — that is precisely the distinction the original tipMap encoded.
 */
const isCuratedGeneralCue = (c: Candidate) =>
    c.source.startsWith('WorkoutView tipMap') &&
    !c.source.includes('special case') &&
    /^[a-z][A-Za-z0-9]*$/.test(c.key);

/**
 * Prefer a general cue that exists in both languages, then the one used by the
 * most plans, then the longest (usually the most instructive). Inline English
 * notes rank last: untranslated, and often prescription text rather than cues.
 */
const rank = (c: Candidate) => {
    let score = 0;
    if (isPrescriptionSpecific(c)) score -= 5000;
    if (isCuratedGeneralCue(c)) score += 3000;
    if (c.pl?.trim()) score += 1000;
    if (c.key === 'inline') score -= 500;
    score += c.plans.length * 50;
    score += Math.min(c.en.length, 200) / 10;
    return score;
};

type Resolved = {
    id: string;
    en: string;
    pl: string;
    chosenKey: string;
    candidateCount: number;
    needsReview: boolean;
};

const resolved: Resolved[] = [];
const collisions: { id: string; name: string; candidates: Candidate[] }[] = [];

const prescriptionOnly: { id: string; name: string; candidates: Candidate[] }[] = [];

for (const [id, list] of candidates) {
    const sorted = [...list].sort((a, b) => rank(b) - rank(a));
    const general = sorted.filter(c => !isPrescriptionSpecific(c));
    const specific = sorted.filter(isPrescriptionSpecific);
    const entry = resolver.byId(id)!;

    // Promotion is opt-in rather than best-effort. Blacklisting prescription
    // wording turned into whack-a-mole ("JUDGMENT DAY. Your moment of glory."
    // was about to become the deadlift's coaching cue), so a tip only becomes
    // the library default if the original tipMap curated it as a movement cue
    // — a plain identifier key — or if it is the single uncontested candidate.
    const curated = general.filter(isCuratedGeneralCue);
    const promotable =
        curated.length ? curated
            : general.length === 1 && list.length === 1 ? general
                : [];

    if (!promotable.length) {
        prescriptionOnly.push({ id, name: entry.name.en, candidates: sorted });
        continue;
    }

    const winner = promotable[0];
    const distinctGeneral = new Set(general.map(c => c.en.trim()));
    const needsReview = distinctGeneral.size > 1;
    if (needsReview) collisions.push({ id, name: entry.name.en, candidates: general });
    if (specific.length) prescriptionOnly.push({ id, name: entry.name.en, candidates: specific });

    resolved.push({
        id,
        en: winner.en.trim(),
        pl: (winner.pl ?? '').trim(),
        chosenKey: winner.key,
        candidateCount: list.length,
        needsReview,
    });
}

resolved.sort((a, b) => a.id.localeCompare(b.id));

// ---------------------------------------------------------------------------
// Orphan keys — tips.* with nothing pointing at them
// ---------------------------------------------------------------------------

/**
 * A key is only an orphan if nothing anywhere in src references it. Many
 * `tips.*` keys are not exercise tips at all — plan hooks return
 * `t:tips.increaseWeight` as progression advice, and dashboards use others.
 * Marking those "unused" would invite deleting live copy.
 */
const allSource = (function readAll(dir: string): string {
    let text = '';
    for (const name of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, name.name);
        if (name.isDirectory()) text += readAll(full);
        else if (/\.(ts|tsx)$/.test(name.name)) text += readFileSync(full, 'utf8');
    }
    return text;
})(join(root, 'src'));

const isReferencedInSource = (key: string) =>
    allSource.includes(`tips.${key}`) ||
    new RegExp(`["'\`]${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'\`]`).test(allSource);

const orphanKeys = Object.keys(tipsEn)
    .filter(k => !usedKeys.has(k) && !isReferencedInSource(k))
    .sort();

/** Referenced somewhere, just not as an exercise tip — keep these. */
const nonExerciseKeys = Object.keys(tipsEn)
    .filter(k => !usedKeys.has(k) && isReferencedInSource(k))
    .sort();
const missingPl = resolved.filter(r => r.en && !r.pl);
const withoutTips = EXERCISE_LIBRARY.filter(e => !candidates.has(e.id));

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const out: string[] = [];
out.push('# Tip merge report');
out.push('');
out.push('Generated by `npm run migrate:tips`. Review before applying — where an');
out.push('exercise has several candidate tips the winner below is provisional.');
out.push('');
out.push('| | |');
out.push('|---|---:|');
out.push(`| Library exercises | ${EXERCISE_LIBRARY.length} |`);
out.push(`| Exercises with at least one tip | ${resolved.length} |`);
out.push(`| Exercises with no tip anywhere | ${withoutTips.length} |`);
out.push(`| Needing review (conflicting general cues) | ${collisions.length} |`);
out.push(`| Exercises with prescription-specific variant tips | ${prescriptionOnly.length} |`);
out.push(`| Chosen tips missing Polish | ${missingPl.length} |`);
out.push(`| Orphan \`tips.*\` keys (nothing references them) | ${orphanKeys.length} |`);
out.push(`| \`tips.*\` keys used elsewhere (advice, dashboards) — keep | ${nonExerciseKeys.length} |`);
out.push('');
out.push(`Sources: tipMap ${tipMapCount} · note markers ${markerCount} · inline notes ${inlineCount} · Adventure cues ${cueCount}`);
out.push('');
out.push('---');
out.push('');
out.push('## Needs review — conflicting wording');
out.push('');
if (!collisions.length) out.push('_None._');
for (const c of collisions.sort((a, b) => b.candidates.length - a.candidates.length)) {
    out.push(`### ${c.name} \`${c.id}\``);
    out.push('');
    for (const [i, cand] of c.candidates.entries()) {
        out.push(`${i === 0 ? '**CHOSEN**' : 'alt'} · \`${cand.key}\` · ${cand.source}`);
        out.push('');
        out.push(`> ${cand.en.replace(/\n/g, ' ')}`);
        out.push('');
    }
}
out.push('---');
out.push('');
out.push(`## Prescription-specific tips (${prescriptionOnly.length} exercises)`);
out.push('');
out.push('These describe how a set is run on a given day (Ascension Test, E2MOM,');
out.push('CAT, heavy single, back-down), not how the movement is performed, so they');
out.push('are deliberately NOT used as the library default. They belong on the plan');
out.push('as scoped overrides — showing a Ritual ascension-test instruction during a');
out.push('light Pain & Glory speed set would be wrong.');
out.push('');
for (const p of prescriptionOnly.sort((a, b) => b.candidates.length - a.candidates.length)) {
    out.push(`### ${p.name} \`${p.id}\` — ${p.candidates.length} variant tips`);
    out.push('');
    out.push('| Key | Source | Tip |');
    out.push('|---|---|---|');
    for (const c of p.candidates) {
        out.push(`| \`${c.key}\` | ${c.source} | ${c.en.replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 110)} |`);
    }
    out.push('');
}
out.push('---');
out.push('');
out.push('## Chosen tips missing a Polish translation');
out.push('');
if (!missingPl.length) out.push('_None._');
else {
    out.push('| Exercise | Key | English |');
    out.push('|---|---|---|');
    for (const r of missingPl) {
        out.push(`| \`${r.id}\` | \`${r.chosenKey}\` | ${r.en.replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 120)} |`);
    }
}
out.push('');
out.push('---');
out.push('');
out.push(`## Orphan \`tips.*\` keys (${orphanKeys.length})`);
out.push('');
out.push('Verified unreferenced by a full scan of src/. Safe to delete from');
out.push('translations.ts once the tips are in the library.');
out.push('');
for (const k of orphanKeys) out.push(`- \`${k}\``);
out.push('');
out.push(`### Keep — referenced outside the tip map (${nonExerciseKeys.length})`);
out.push('');
out.push('Progression advice returned by plan hooks, dashboard copy, and similar.');
out.push('Not exercise tips, so they stay in translations.ts.');
out.push('');
for (const k of nonExerciseKeys) out.push(`- \`${k}\``);
out.push('');
out.push('---');
out.push('');
out.push(`## Exercises with no tip in any source (${withoutTips.length})`);
out.push('');
out.push('These can be written directly in the admin Exercise library tab.');
out.push('');
for (const e of withoutTips) out.push(`- \`${e.id}\` — ${e.name.en}`);
out.push('');

if (unmatched.length) {
    out.push('---');
    out.push('');
    out.push(`## Tip sources whose exercise could not be resolved (${unmatched.length})`);
    out.push('');
    for (const u of unmatched) out.push(`- \`${u.name}\` (${u.source})`);
    out.push('');
}

mkdirSync(join(root, 'output'), { recursive: true });
writeFileSync(join(root, 'output', 'tip-merge-report.md'), out.join('\n'), 'utf8');
writeFileSync(
    join(root, 'output', 'tips-resolved.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), tips: resolved, orphanKeys, nonExerciseKeys, prescriptionOnly }, null, 2),
    'utf8'
);

console.log('  migrate:tips');
console.log(`   sources: tipMap ${tipMapCount}, markers ${markerCount}, inline ${inlineCount}, cues ${cueCount}`);
console.log(`   ${resolved.length}/${EXERCISE_LIBRARY.length} exercises have a tip`);
console.log(`   ${collisions.length} need review, ${prescriptionOnly.length} have prescription-specific variants`);
console.log(`   ${missingPl.length} missing Polish, ${orphanKeys.length} orphan keys, ${nonExerciseKeys.length} non-exercise keys kept`);
if (unmatched.length) console.log(`   ${unmatched.length} tip sources did not resolve to a library exercise`);
console.log('   wrote output/tip-merge-report.md and output/tips-resolved.json');
