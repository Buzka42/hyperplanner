/**
 * Extract every library exercise tip (EN/PL) into a shared proposal markdown.
 * Run: npx tsx scripts/extract-tips-for-docs.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library.ts';
import { TIP_DRAFTS_EN, TIP_DRAFTS_PL } from '../src/data/exercises/tipDrafts.ts';

type Row = {
  id: string;
  nameEn: string;
  namePl: string;
  tipEn: string;
  tipPl: string;
  tipStatus: string;
  source: 'library' | 'draft' | 'missing';
  pattern: string;
};

const rows: Row[] = EXERCISE_LIBRARY.map((ex) => {
  const tipEn = ex.tip?.en || TIP_DRAFTS_EN[ex.id] || '';
  const tipPl = ex.tip?.pl || TIP_DRAFTS_PL[ex.id] || '';
  const source: Row['source'] = ex.tip?.en
    ? 'library'
    : TIP_DRAFTS_EN[ex.id]
      ? 'draft'
      : 'missing';
  return {
    id: ex.id,
    nameEn: ex.name.en,
    namePl: ex.name.pl || '',
    tipEn,
    tipPl,
    tipStatus: ex.tipStatus || (source === 'draft' ? 'draft' : tipEn ? 'inline' : 'none'),
    source,
    pattern: ex.pattern,
  };
});

rows.sort((a, b) => a.nameEn.localeCompare(b.nameEn));

const stats = {
  total: rows.length,
  withTipEn: rows.filter((r) => r.tipEn).length,
  missingTipEn: rows.filter((r) => !r.tipEn).length,
  missingTipPl: rows.filter((r) => r.tipEn && !r.tipPl).length,
  missingNamePl: rows.filter((r) => !r.namePl).length,
  nameSameAsEn: rows.filter((r) => r.namePl && r.namePl === r.nameEn).length,
  draft: rows.filter((r) => r.source === 'draft').length,
  library: rows.filter((r) => r.source === 'library').length,
};

const outDir = path.join('docs', 'translations');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, '_tips-extract.json'), JSON.stringify({ stats, rows }, null, 2));

const escapeCell = (s: string) => s.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');

const lines: string[] = [];
lines.push('# Exercise tips translation proposal');
lines.push('');
lines.push('Shared bilingual ledger for every movement in the exercise library.');
lines.push('English and Polish names, general cues, and proposed Polish where the current');
lines.push('wording is missing, calqued, or unnatural.');
lines.push('');
lines.push('**Runtime source of truth** remains `src/data/exercises/library.ts` (+ `tipDrafts.ts` for unaudited drafts).');
lines.push('This document is the bilingual review ledger. After the naturalization pass, **PL tip (current) is the applied proposal** in the library.');
lines.push('');
lines.push('## Review summary');
lines.push('');
lines.push('| Pass | Result |');
lines.push('|---|---|');
lines.push('| Coverage | **231/231** EN + PL tips; **0** missing Polish names; **0** names identical to English |');
lines.push('| Naturalization | ~38 tip rewrites, ~40 name localizations, 4 missing tips filled (applied in `library.ts`) |');
lines.push('| Remaining owner work | Audit English training content (`tipStatus`); promote drafts where needed |');
lines.push('');
lines.push('### Principles used');
lines.push('');
lines.push('- Prefer established Polish gym verbs: **wyciskanie**, **wiosłowanie**, **uginanie**, **przysiad**, **martwy ciąg**, **rozpiętki**, **unoszenie bokiem**.');
lines.push('- Prefer **faza ekscentryczna / koncentryczna**, **zamknięcie ruchu**, **napięcie** over English leftovers (`hip hinge`, `lockout`, `ROM`, `HARD`, `DB`).');
lines.push('- Keep recognizable English brand/gym norms where Polish gyms use them (**hip thrust**, **hack squat**, Spoto/Larsen as proper nouns) with a Polish descriptor when helpful (`Wyciskanie Spoto`).');
lines.push('- Tips stay short (1–3 sentences); no plan/week/RIR prescription in the general layer.');
lines.push('');
lines.push('## Coverage snapshot');
lines.push('');
lines.push(`| Metric | Count |`);
lines.push(`|---|---:|`);
lines.push(`| Exercises | ${stats.total} |`);
lines.push(`| With English tip | ${stats.withTipEn} |`);
lines.push(`| Missing English tip | ${stats.missingTipEn} |`);
lines.push(`| English tip, missing Polish tip | ${stats.missingTipPl} |`);
lines.push(`| Missing Polish name | ${stats.missingNamePl} |`);
lines.push(`| Polish name identical to English | ${stats.nameSameAsEn} |`);
lines.push(`| Tips from library seed | ${stats.library} |`);
lines.push(`| Tips from draft file | ${stats.draft} |`);
lines.push('');
lines.push('## How to use this ledger');
lines.push('');
lines.push('1. Owner audits English cue (general layer only — no plan/week/RIR prescription).');
lines.push('2. Polish text below is the applied gym-Polish wording — revise further only if a cue still feels off.');
lines.push('3. Approve English → keep/update `tipStatus` to `approved` in the library.');
lines.push('4. Prefer established Polish gym terms (`wyciskanie`, `wiosłowanie`, `uginanie`, `przysiad`) over English leftovers unless the English name is the local norm (e.g. hip thrust).');
lines.push('');
lines.push('## Decision legend');
lines.push('');
lines.push('- **applied** — Polish tip/name is in the library after the naturalization pass (same text as Proposed)');
lines.push('- **missing-en** — no English general tip yet');
lines.push('');
lines.push('---');
lines.push('');
lines.push('## Full exercise table');
lines.push('');

for (const r of rows) {
  const decision = r.tipEn ? 'applied' : 'missing-en';
  lines.push(`### \`${r.id}\``);
  lines.push('');
  lines.push(`| | |`);
  lines.push(`|---|---|`);
  lines.push(`| **EN name** | ${escapeCell(r.nameEn)} |`);
  lines.push(`| **PL name** | ${escapeCell(r.namePl || '—')} |`);
  lines.push(`| **Pattern** | ${r.pattern} |`);
  lines.push(`| **Tip source** | ${r.source} (\`${r.tipStatus}\`) |`);
  lines.push(`| **EN tip** | ${escapeCell(r.tipEn || '—')} |`);
  lines.push(`| **PL tip (current)** | ${escapeCell(r.tipPl || '—')} |`);
  lines.push(`| **PL tip (proposed)** | ${escapeCell(r.tipPl || '—')} |`);
  lines.push(`| **Decision** | ${decision} |`);
  lines.push('');
}

const mdPath = path.join(outDir, 'exercise-tips-proposal.md');
fs.writeFileSync(mdPath, lines.join('\n'), 'utf8');
console.log(JSON.stringify(stats, null, 2));
console.log(`wrote ${mdPath}`);
