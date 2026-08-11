/**
 * Phase 0: which movements the four new-plan docs name, and which of them the
 * exercise library already has.
 *
 * The docs write exercise names as markdown headings — `## Main 1 — Goblet
 * Heel-Elevated Squat`, `## Anchor`, `### Superset A` — so the heading text
 * after the em-dash is the movement, where there is one.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library';

// EXERCISE_LIBRARY already includes the authored additions.
const LIB = EXERCISE_LIBRARY;
const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

const norm = (s: string) =>
    s.toLowerCase()
        .replace(/[°"'’]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\b(the|a|an|with|and|or|to|of|for|on|in)\b/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const known = new Map<string, string>();
for (const e of LIB) {
    known.set(norm(e.name.en), e.id);
    for (const a of e.aliases ?? []) known.set(norm(a), e.id);
}

const DOCS = [
    'HYPERPLANNER_HOUSE_OF_IRON_PLAN.md',
    'HYPERPLANNER_APEX_PREDATOR_PLAN.md',
    'HYPERPLANNER_REDLINE_CUTTING_PLAN.md',
    'HYPERPLANNER_VENUS_ATHENA_KALI_VALKYRIE_PLAN.md',
];

// Headings that are structure, not movements.
const NOT_A_MOVEMENT = /^(week|day|phase|main|secondary|optional|anchor|burn|finisher|layer|superset|identity|duration|purpose|progression|schedule|structure|rules?|notes?|summary|overview|status|example|core identity|session|block|mode|warm|cool|option)\b/i;

type Row = { doc: string; name: string; id?: string };
const rows: Row[] = [];
const seen = new Set<string>();

const add = (doc: string, raw: string) => {
    const name = raw.replace(/\*\*/g, '').replace(/\s*\(.*?\)\s*$/, '').trim();
    if (!name) return;
    const key = norm(name);
    if (!key || seen.has(`${doc}:${key}`)) return;
    seen.add(`${doc}:${key}`);

    // `Cable / DB Lateral Raise` and `Squat / Hack Squat` are the doc offering a
    // choice, not one movement with a slash in its name. Resolved if EITHER
    // side is in the library — the plan can prescribe whichever exists.
    let id = known.get(key);
    if (!id && name.includes('/')) {
        for (const part of name.split('/').map(x => x.trim()).filter(Boolean)) {
            id = known.get(norm(part));
            if (id) break;
        }
    }
    rows.push({ doc: doc.replace('HYPERPLANNER_', '').replace('_PLAN.md', ''), name, id });
};

for (const doc of DOCS) {
    const text = readFileSync(resolve(ROOT, 'docs', 'archive', 'source-planning', doc), 'utf8');
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const m = /^#{2,4}\s+(.*)$/.exec(lines[i].trim());
        if (!m) continue;

        // A heading is a movement when the next non-empty line is a set
        // prescription — `**3×8–15**`, `**2×AMRAP**`, `**1–2×30–60 sec/side**`.
        // Structure headings (phases, rules, questions) never carry one, which
        // makes this far more reliable than trying to blacklist them.
        let j = i + 1;
        while (j < lines.length && !lines[j].trim()) j++;
        const next = (lines[j] ?? '').trim();
        if (!/^\*{0,2}\d+\s*[–-]?\s*\d*\s*[×x]\s*/i.test(next)) continue;

        let heading = m[1].trim().replace(/\*\*/g, '');
        const dash = heading.split(/\s+[—–]\s+/);
        if (dash.length > 1) heading = dash.slice(1).join(' — ').trim();
        heading = heading.replace(/\s*\(.*?\)\s*$/, '').trim();
        if (!heading) continue;

        add(doc, heading);
    }

    // Venus/Kali write prescriptions as a bolded line rather than a heading:
    // `**Squat / Hack Squat — 3×3–6**`.
    for (const line of lines) {
        const b = /^\*\*(.+?)\s+[—–]\s+\d+\s*[–-]?\s*\d*\s*[×x]\s*[\d]/.exec(line.trim());
        if (b) add(doc, b[1].trim());
    }
}

const missing = rows.filter(r => !r.id);
const present = rows.filter(r => r.id);

console.log(`\n  Library: ${LIB.length} canonical movements`);
console.log(`  Named across the four docs: ${rows.length} candidate movements`);
console.log(`  Already present: ${present.length}`);
console.log(`  MISSING: ${missing.length}\n`);

const byDoc = new Map<string, Row[]>();
for (const r of missing) {
    if (!byDoc.has(r.doc)) byDoc.set(r.doc, []);
    byDoc.get(r.doc)!.push(r);
}
for (const [doc, list] of byDoc) {
    console.log(`  ${doc} — ${list.length} missing`);
    for (const r of list) console.log(`     ${r.name}`);
    console.log('');
}
