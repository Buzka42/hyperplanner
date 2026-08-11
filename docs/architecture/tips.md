# Tip system

Two layers, in a fixed order, with no visible labels — colour and position carry
the distinction.

1. **Prescription** — what this plan wants from this set today. Rendered first,
   in the plan's accent (`--signal-text`).
2. **General** — how the movement is performed, independent of any plan.
   Rendered second, quieter (`--muted-foreground`).

Both show by default.

## Precedence

`src/features/tips/resolve.ts` is pure and takes already-resolved strings, so
precedence is testable without a plan, a user or a language context.

- Prescription sources are rendered in authored order: plan-movement, then
  slot-scoped, then week-scoped variant text, then plan notes.
- A plan **cannot** delete the general cue by writing its own guidance. The old
  "override replaces everything" behaviour is retired — it silently removed
  safety-relevant coaching whenever a plan wanted to add one sentence.
- `tipAppend` extends the general cue.
- `suppressGeneralTip` removes it, and is an explicit, exceptional Admin control
  for the case where showing both would mislead.
- The same sentence arriving from two sources renders once, whatever its
  punctuation. A general cue the plan already said is dropped rather than
  repeated in a second colour.
- Bilingual fallback is requested language, then English, then nothing. A cue
  with no usable text renders no line at all.

## Authoring

Two surfaces, deliberately separate, so plan instructions stop leaking into the
library:

- **Admin → Exercise cues** edits the general layer, in English and Polish, with
  filters for missing English, awaiting audit, missing Polish and overridden. It
  warns when a cue reads like plan guidance (weeks, percentages, set counts,
  RIR).
- **Admin → Plan composer** edits plan and slot guidance, showing the inherited
  general cue while you write, with append and suppress controls.

`verify:tips` fails the build if a library cue contains prescription content.

## The audit gate

English is drafted first, the owner audits the training content, and Polish is
written only after approval — so a rejected cue never becomes a translation
source. `tipStatus` is `draft` or `approved`; the Polish field is disabled while
a cue is still a draft.

The 102 cues drafted to close the coverage gap live in
`src/data/exercises/tipDrafts.ts`, flagged `draft`, so the audit is a diff
rather than a hunt. Approving one in the admin console promotes it; the text can
then be folded into the library entry and dropped from the drafts file.

Authoring rules and review batches are in
[the authoring ledger](exercise-tip-authoring.md).
