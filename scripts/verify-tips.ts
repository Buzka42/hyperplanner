/**
 * verify:tips
 *
 * The tip system's contract is precedence, coverage and restraint: two layers
 * in a fixed order, a general cue that a plan cannot delete by accident,
 * bilingual fallback that never renders an empty line, no duplicate sentence
 * across the two colours, and no prescription content hiding in a library cue.
 */

import assert from 'node:assert/strict';
import { looksLikePrescription, pickLanguage, resolveTips } from '../src/features/tips/resolve';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { TIP_DRAFTS_EN } from '../src/data/exercises/tipDrafts';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

// --- coverage ----------------------------------------------------------------
const missingEn = EXERCISE_LIBRARY.filter(exercise => !exercise.tip?.en?.trim());
ok(missingEn.length === 0, `every exercise has an English cue (missing: ${missingEn.map(e => e.id).join(', ')})`);

const ids = new Set(EXERCISE_LIBRARY.map(exercise => exercise.id));
const orphans = Object.keys(TIP_DRAFTS_EN).filter(id => !ids.has(id));
ok(orphans.length === 0, `no drafted cue points at a missing exercise (${orphans.join(', ')})`);

// Every exercise is either approved or explicitly awaiting audit; nothing is in
// an unlabelled middle state.
const unlabelled = EXERCISE_LIBRARY.filter(exercise => !exercise.tipStatus);
ok(unlabelled.length === 0, `every cue carries an audit state (${unlabelled.map(e => e.id).slice(0, 5).join(', ')})`);
const drafts = EXERCISE_LIBRARY.filter(exercise => exercise.tipStatus === 'draft');
// A draft only fills a gap, so an entry that already had an approved cue keeps
// it and its draft goes unused — the flag must follow the text that actually
// shipped, not the presence of a draft.
for (const exercise of drafts) {
    ok(exercise.tip?.en === TIP_DRAFTS_EN[exercise.id], `${exercise.id} renders the cue it is flagged for`);
}
ok(drafts.length <= Object.keys(TIP_DRAFTS_EN).length, 'no exercise is flagged draft without a drafted cue');

// Translation no longer waits on approval. `tipStatus` tracks whether the
// English cue has been audited for content; the Polish line is a rendering
// concern, and a draft that shows an English cue must not fall back to English
// for a Polish reader. So the contract is coverage, not ordering: every cue is
// bilingual whatever its audit state.
const missingPl = EXERCISE_LIBRARY.filter(exercise => !exercise.tip?.pl?.trim());
ok(missingPl.length === 0, `every cue is bilingual regardless of audit state (missing: ${missingPl.map(e => e.id).join(', ')})`);

// --- library cues stay general -----------------------------------------------
const misplaced = EXERCISE_LIBRARY.filter(exercise => exercise.tip?.en && looksLikePrescription(exercise.tip.en));
ok(misplaced.length === 0, `no prescription content in library cues (${misplaced.map(e => e.id).slice(0, 5).join(', ')})`);
ok(looksLikePrescription('Week 3: work up to a heavy triple at RPE 9'), 'prescription content is detectable');
ok(!looksLikePrescription('Bar over mid-foot, lats set, brace before the pull.'), 'a general cue is not flagged');

// --- ordering ----------------------------------------------------------------
const both = resolveTips({
    general: { en: 'General cue.' },
    prescription: [{ en: 'Plan cue.' }],
}, 'en');
ok(both.prescription[0] === 'Plan cue.', 'the plan cue comes first');
ok(both.general === 'General cue.', 'the general cue is kept as its own layer');

const layered = resolveTips({
    general: { en: 'General cue.' },
    prescription: [{ en: 'Plan movement cue.' }, { en: 'Slot cue.' }, { en: 'This week only.' }],
}, 'en');
ok(layered.prescription.join('|') === 'Plan movement cue.|Slot cue.|This week only.', 'prescription cues keep their authored order');

// --- both show by default; suppression is explicit ----------------------------
ok(resolveTips({ general: { en: 'General.' }, prescription: [{ en: 'Plan.' }] }, 'en').general !== undefined,
    'both layers show by default');
ok(resolveTips({ general: { en: 'General.' }, prescription: [{ en: 'Plan.' }], suppressGeneral: true }, 'en').general === undefined,
    'suppression removes the general cue');
ok(resolveTips({ general: { en: 'General.' }, prescription: [{ en: 'Plan.' }], suppressGeneral: true }, 'en').prescription.length === 1,
    'suppression never touches the prescription layer');

// Appending is how a plan adds to the general cue — it cannot delete it.
const appended = resolveTips({ general: { en: 'General cue.' }, generalAppend: { en: 'Extra detail.' } }, 'en');
ok(appended.general === 'General cue. Extra detail.', 'an append extends rather than replaces');

// --- bilingual fallback -------------------------------------------------------
ok(pickLanguage({ en: 'English', pl: 'Polski' }, 'pl') === 'Polski', 'Polish is used when present');
ok(pickLanguage({ en: 'English' }, 'pl') === 'English', 'a missing translation falls back to English');
ok(pickLanguage({ en: 'English', pl: '   ' }, 'pl') === 'English', 'whitespace is not a translation');
ok(pickLanguage({ pl: 'Polski' }, 'en') === undefined, 'no English and no fallback renders nothing');
ok(resolveTips({ general: { pl: 'Tylko po polsku' } }, 'en').general === undefined, 'an untranslatable cue is omitted, not blanked');

const polish = resolveTips({ general: { en: 'General.', pl: 'Ogólna.' }, prescription: [{ en: 'Plan.', pl: 'Plan PL.' }] }, 'pl');
ok(polish.prescription[0] === 'Plan PL.' && polish.general === 'Ogólna.', 'both layers translate together');

// --- duplicate elimination ----------------------------------------------------
const duplicated = resolveTips({ prescription: [{ en: 'Same cue.' }, { en: 'same cue' }, { en: '  Same cue.  ' }] }, 'en');
ok(duplicated.prescription.length === 1, 'the same sentence is one cue, however it is punctuated');

const echoed = resolveTips({ general: { en: 'Keep the ribs down.' }, prescription: [{ en: 'Keep the ribs down.' }] }, 'en');
ok(echoed.general === undefined, 'a general cue already said by the plan is not repeated in a second colour');
ok(echoed.prescription.length === 1, 'and the plan keeps its own cue');

// --- empty states -------------------------------------------------------------
const empty = resolveTips({}, 'en');
ok(empty.prescription.length === 0 && empty.general === undefined, 'nothing in, nothing out');
ok(resolveTips({ prescription: [undefined, { en: '' }, { en: '   ' }] }, 'en').prescription.length === 0,
    'blank cues never render an empty line');

console.log(`Tip system verification passed: ${assertions} assertions.`);
console.log(`   ${EXERCISE_LIBRARY.length} exercises · ${drafts.length} awaiting owner audit · ${EXERCISE_LIBRARY.filter(e => e.tip?.pl?.trim()).length} translated`);
