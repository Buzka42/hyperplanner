# Documentation cleanup report

**Completed:** 2026-08-10  
**Policy:** move unique material; do not delete it.

## Canonical entry points

- Repository: [`README.md`](../../README.md)
- Documentation: [`docs/INDEX.md`](../INDEX.md)
- Product: [`PRODUCT.md`](../../PRODUCT.md)
- Design: [`DESIGN.md`](../../DESIGN.md)
- Implemented-plan detail: [`PLAN.md`](../../PLAN.md)
- Training-plan index: [`docs/plans/INDEX.md`](../plans/INDEX.md)
- Expansion: [`master-expansion.md`](master-expansion.md)

## Canonical moves

| Previous location | Current location |
|---|---|
| `docs/exercise-system.md` | `docs/architecture/exercise-system.md` |
| `docs/plans/PERFORMANCE-PROFILE-SPEC.md` | `docs/architecture/performance-profile.md` |
| `docs/plans/APEX-PREDATOR-SPEC.md` | `docs/plans/specs/apex-predator.md` |
| `docs/plans/VENUS-ATHENA-KALI-SPEC.md` | `docs/plans/specs/venus-athena-kali.md` |

The master expansion roadmap and exercise-tip authoring workflow were created
directly in their canonical locations.

## Archived groups

### UI overhaul

The completed Protocol Sheet brief, option rounds, implementation plan and
handoff moved to `docs/archive/ui-overhaul-2026/`. `DESIGN.md` is the current
visual contract.

### Source planning

Long-form House of Iron, Apex Predator, REDLINE and Venus/Athena/Kali/Valkyrie
designs, the old-vs-new portfolio review, the original next-expansion concept
document and the earlier new-plan implementation outline moved to
`docs/archive/source-planning/`.

### Legacy plan drafts

The two Adventure drafts, old Super Mutant development notes, accumulated former
root implementation guide and replaced training-plan README moved to
`docs/archive/legacy-plan-drafts/`.

## Deliberately retained

- `PLAN.md` remains the mandatory detailed program record required by project
  rules. Its historical implementation sections have not been discarded.
- `TRANSLATIONS.md` remains the translation reference.
- Short implemented-plan documents remain beside `docs/plans/INDEX.md`.
- Historical source wording is preserved unchanged inside the archive.

## Verification

- Canonical Markdown file links resolve.
- Canonical architecture, roadmap, index and focused specification files contain
  no assistant-specific wording.
- `git diff --check` passes.
- The repository was fast-forwarded to GitHub `main` before cleanup.
- The local next-expansion concept source and all 12 new cover images were backed
  up before synchronization and remain in the workspace.

