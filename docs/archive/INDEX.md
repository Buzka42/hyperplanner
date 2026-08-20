# Documentation archive

These documents preserve decisions, alternatives and source material. They are
kept for auditability and historical context but are not current implementation
authority. Start from [the canonical documentation index](../INDEX.md).

Archived files are preserved as historical snapshots. Relative links inside a
snapshot may reflect its original location; use this index and the canonical
documentation tree for current navigation.

## UI overhaul — 2026

`ui-overhaul-2026/` contains the completed transition from the earlier Pit-Wall
visual system to the current Protocol Sheet system:

- original redesign brief;
- shell, console, ledger, dashboard and timer/modal option rounds;
- completed implementation plan;
- session handoff.

The current visual contract is `DESIGN.md`; do not use these archived option
documents to reopen settled decisions.

## Source planning

`source-planning/` contains portfolio comparisons, initial long-form plan
designs, the earlier new-plan implementation outline and the original 12-concept
exploration. Their accepted decisions have been consolidated into the
[master expansion roadmap](../roadmap/master-expansion.md).

These sources remain valuable when writing each plan's detailed exercise
template, but conflicts are resolved in favor of the master roadmap and the
latest focused plan spec.

## Legacy plan drafts

`legacy-plan-drafts/` contains the two superseded 30 Minute Adventure drafts,
old Super Mutant development notes, the former accumulated root implementation
guide and the replaced training-plan README. Runtime behavior is determined by
code, verification scripts, `PLAN.md` and the concise plan documents.

## Plan documentation superseded by the v2 rebuild — August 2026

`plans-v2-2026-08/` holds the two generations of plan documentation replaced
when the v2 rebuild landed:

- `pre-rebuild/` — the hand-written per-plan documents that were canonical
  before the rebuild. They were the source of the long-running doc-vs-code
  drift `verify:plans` kept reporting as discrepancy notes: set counts,
  exercise lists and week tables transcribed by hand and never re-synced.
- `v2-audit/` — the v2 audit packet: one findings note per plan plus the
  cross-plan decision, closeout, synthesis and implementation-review documents
  that drove the rebuild. The implementation specs stay live in
  `docs/plans/specs/`; only the audit notes are archived here. Useful for understanding *why* a plan changed; not a
  description of what any plan does now.

Current plan documentation lives in [`docs/plans/`](../plans/INDEX.md) and is
generated from the shipped code rather than written by hand, so the drift these
two directories record cannot recur silently.
