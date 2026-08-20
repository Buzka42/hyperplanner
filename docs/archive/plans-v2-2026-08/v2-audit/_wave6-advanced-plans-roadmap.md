# Wave 6 advanced-plans roadmap — Project Chimera, Oracle, Immaculate, Apex Predator

> Deferred deliverable from the audit's original scope (`_audit-status.md` §1
> item 5): "a roadmap for Project Chimera, Ghost in the Machine, Oracle, and
> possibly Immaculate + Apex." This document covers the four already-audited
> plans whose headline mechanics were found non-functional or partially
> non-functional: **Project Chimera, Oracle, Immaculate (Re)Structure, and
> Apex Predator**. Ghost in the Machine is an unbuilt concept (docs only, no
> source code) and gets its own dedicated Wave 7 doc — it is intentionally
> out of scope here.
>
> This is a **planning/synthesis document, not an implementation plan**. Per
> PROC-1 (`_audit-decisions.md` §0), no code changes happen until the owner
> opens the post-audit implementation pass. Nothing below is a proposal to
> implement; it is a map of what's broken, what a fix would take, what it
> depends on, and what open design questions need the owner's input before
> any of it can be built. Sourced entirely from the four plans' own finished
> v2 docs (`project-chimera.md`, `oracle.md`, `immaculate-restructure.md`,
> `apex-predator.md`) and the TECHNICAL table / Wave 6 summary in
> `_audit-status.md` and `_audit-decisions.md` — no new source-code tracing
> or live testing was done for this document.

---

## 1. Per-plan breakdown

### 1.1 Project Chimera

**What's broken.** The plan's entire named differentiator — adaptive,
evidence-gated volume reallocation between six training qualities after each
4-week block — has **zero reachable code path** (T-78). `proposeMutation`,
`applyMutation`, and `phenotype` (`src/features/projectChimera/mutation.ts`)
are fully authored, genuinely careful engineering (evidence floors,
reallocation caps, a hard minimum-sets floor, separately-confirmable
proposal components) but are never called from anywhere outside their own
file. `projectChimeraStatus` is read once and written nowhere.
`Settings.tsx`/`Onboarding.tsx` contain zero references to Project Chimera
at all — no partial UI stub exists anywhere, the cleanest "declared, wired,
unreachable" case in the whole audit. What *is* real: four block-level
rep/RPE phase transforms (a fixed, pre-authored periodization scheme, live-
confirmed correct) — a genuine but modest differentiator, not what the plan
is named or marketed for.

**What it would take.** This is **not** a connect-the-wires fix — it needs
genuine product/design work first, then substantial new engineering. The
engine itself doesn't need to be rewritten (it's careful, already-correct
work), but nothing exists yet to feed it: no per-block `QualityEvidence[]`
collection (comparable exposures, trend, fatigue, stalled flag — none of
these four values are computed or stored anywhere for this plan today), no
proposal-review UI, no confirm/decline flow, no write path for
`projectChimeraStatus.allocation`. Someone has to design the UI for a
per-quality proposal review screen from scratch — the engine's output shape
exists, but the screen that shows it to an athlete does not.

**Dependencies.** Fixing the ordinary session-completion write path (T-79,
the wave's shared write-path bug — session log saves, `completedSessions`
and `workingLoads` writes silently fail) blocks *nothing* about building the
reallocation UI/evidence-collection layer itself, but it does block any
athlete from ever accumulating usable exposure history in the meantime, so
it's a practical prerequisite for testing the eventual fix. Also needs
`projectChimeraStatus` added to `resetProgram()`'s allowlist (T-80, T-2
family) — trivial, but only meaningful once the engine is wired.

**Effort tier: large, needs design decisions from the owner first.** The
backend exists; the entire UI/data-collection/write layer above it does
not. This is the single biggest build in the four-plan set.

---

### 1.2 Oracle

**What's broken.** Oracle is two modules; only one is reachable. The
**prediction engine** (`predictFromPriors`) is real, well-built, and
live-confirmed working end to end (Epley-based load-from-reps conversion,
recency/RIR-weighted averaging, honest low-confidence fallback). The
**scoring/refinement half** — "shows you how close it got," the second half
of the plan's own headline promise — is fully dead (T-73): `refineWithModel`,
`predict(request, useModel)`, `predictionError`, `accuracyBand`, and
`accuracyTrend` are all exported from `prediction.ts` and never called
anywhere else. The admin "Oracle predictions" AI toggle is inert — it
implies live model-assisted refinement but changes nothing observable,
because `preprocess()` calls `predictFromPriors()` directly and
unconditionally, never checking the AI config. Even a hypothetical future UI
calling `accuracyBand` would have nothing to score: `oracleStatus.exposures`
only ever records what was actually lifted, never what was predicted for
that set at the time. Separately, a UI paper cut (T-74) renders the "no
prediction yet" sentinel as a literal "pred 0kg."

**What it would take.** Two structurally different fixes bundled under one
headline finding:
- **Wiring `predict(request, useModel)` instead of `predictFromPriors()`
  directly, gated by `loadAiConfig().features.oracle`** — this is a genuine
  connect-the-wires fix. The function that branches correctly on the AI
  config already exists (`predict()`); `oracle.ts`'s `preprocess()` simply
  calls the wrong one. Small, isolated, cheap.
- **Persisting a predictions ledger and building a dashboard/workout-view
  surface for `predictionError`/`accuracyBand`/`accuracyTrend`** — this is
  new work, not wiring. Nothing today stores "what was predicted for this
  set at the time it was logged," so the scoring engine (though itself
  already correct code) has no data to run against until a persistence
  layer is added. Requires a small UI surface (an accuracy panel/badge) that
  doesn't exist yet, but the underlying computation is already written and
  doesn't need design invention the way Project Chimera's proposal UI does.

**Dependencies.** The write-path bug hit its worst form on Oracle this wave
— a **total** loss (T-75): session log, `oracleStatus.exposures`, and
progress counters all failed to persist together, not the partial split seen
elsewhere. Nothing about accuracy-scoring can be usefully tested, let alone
used by a real athlete, until this is fixed — the exposures write is the
same call site that would need to also carry the new predictions-ledger
write. `oracleStatus` also needs adding to `resetProgram()`'s allowlist
(T-76, T-2 family).

**Effort tier:** the AI-config wiring fix is **small/isolated**. The
predictions-ledger + accuracy UI is **medium, needs a UI surface built** —
but unlike Project Chimera, the underlying computation (`predictionError`,
`accuracyBand`, `accuracyTrend`) needs no new design work, only a place to
store predictions and a place to show the score.

---

### 1.3 Immaculate (Re)Structure

**What's broken.** The weak-link/structural-balance mechanic — the plan's
entire named concept, "find the lagging structure and feed it" — can only
ever fire for **1 of its 6** named Poliquin ratio relationships (T-67, T-68).
Two independent, compounding bugs: (a) `preprocess()`'s day-of-week guard
checks `dayOfWeek 2/4` instead of the correct `1/4` (both upper days),
silently excluding Upper Structural A's four ratio exercises (chin-up 81%,
incline bench 83%, reverse curl 30%, external rotation 9%) entirely; (b)
`ezbar-preacher-curl` has no `strengthRef` field in the exercise library at
all, so even the one correctly-checked day's second ratio target (46%) can
never fire either. Live-confirmed: a catastrophically lagging chin-up (50kg
vs. a 72.9kg threshold) and external rotation (3kg vs. 8.1kg) both received
zero bonus sets. A full 10-week computed dump independently confirms
Assessment and Correction phases are byte-identical in base set counts for
every exercise, every day — the only volume change across the whole plan is
the uniform Re-Test taper.

**What it would take.** This is the **cheapest fix of the four plans by a
wide margin** — genuinely a connect-the-wires case, not a design gap. Fix
(a) is a one-line condition change (`dayOfWeek === 1 || dayOfWeek === 4`
instead of `2 || 4`). Fix (b) is a one-line library addition
(`strengthRef: { ratioOf: 'close-grip-bench-press', poliquinPercent: 46 }`
on `ezbar-preacher-curl`). No new engine, no new UI, no new data model — the
mechanism, once these two lines are corrected, runs exactly as designed for
all six relationships.

**Dependencies.** The wave's shared write-path bug hit Immaculate in its
widest form (T-70) — a *new* variant where even the client's self-claim of
an owner-less document failed, blocking login itself, in addition to
plan-switch and workout-completion writes all failing in the same session.
This doesn't block *writing* the two-line fix, but does block verifying it
live and block any athlete from actually benefiting until it's resolved.
Also needs `weighted-chin-up`'s total-system-weight gate fixed
(`WorkoutView.tsx:842`, T-72 — the sixth confirmed instance of the
portfolio-wide hardcoded-allowlist gate, shared with Workhorse/Gravity Is
Optional/Kali/Atlas/Neural Overload) and `liftHistory`'s write path fixed
(T-22/T-71) for the plan's "Lagging lift" strength-chart widget, which is
well-built but reads a field nothing in the codebase ever writes.

**Effort tier: small/isolated.** Two one-line changes fix the headline
mechanic entirely. The remaining findings (T-72, T-22/T-71) are portfolio-
wide shared bugs, not Immaculate-specific work.

---

### 1.4 Apex Predator

**What's broken.** The plan's signature mechanic — a six-region movement
assessment that drives which corrective access exercises appear each
session — is, once seeded with data, the single best-engineered adaptive
mechanic found anywhere in Wave 5/6: region scoring, pain-invalidation,
lowest-two-regions emphasis selection with tie-breaks, and placeholder-to-
real-exercise substitution with level-gated ROM cues all live-confirmed
working exactly as designed. But **the one button that writes the
assessment, "Save Assessment," fails for every real athlete, every time**
(T-54). Two independent live attempts through the real onboarding UI, with a
correctly-filled assessment, both produced "The assessment could not be
saved" and left `apexPredatorStatus` absent from Firestore. The identical
payload succeeds instantly via an admin-privileged write, proving the object
itself is valid — the failure is isolated to the authenticated-user write
path, but its precise trigger was not pinned to a specific `firestore.rules`
clause from client-side observation. Every athlete permanently runs the full
12-week program on the untested `['ankle', 'thoracicRotation']` default.

**What it would take.** Unlike the other three plans, this is not a design
or UI gap at all — the UI, the read path, and the downstream prescription
logic are all already built and confirmed correct. This is purely a **write-
path bug**, and by the audit's own isolation method (admin write succeeds
instantly on the identical payload), it is very likely the *same underlying
condition* as the wave's broader shared write-path bug, not a distinct
Apex-Predator-specific defect — though it was found and isolated a full wave
before the shared-bug pattern was named as such, and is the earliest and
cleanest single-call-site isolation of it on record. Fixing it is a
server-side/rules investigation, not a design task.

**Dependencies.** This is arguably not "dependent on" the shared write-path
fix so much as **evidence for what the shared write-path fix actually is** —
Apex Predator's assessment-save failure is explicitly named in
`_audit-status.md`'s Wave 6 summary as the origin point of the write-path
saga that "escalated in severity across the wave." Also needs
`apexPredatorStatus` added to `resetProgram()`'s allowlist (T-55, T-2
family, currently consequence-free only because nothing populates the
field) and `programProgress['apex-predator']` backfilled on `switchProgram()`
rather than only on session completion (T-56).

**Effort tier: small/isolated, contingent on root-causing the write bug.**
No design work and no new UI needed — this is the cheapest *conceptual* fix
of the four (nothing to design, nothing to build), but the actual root cause
of the write failure was not pinned down this audit, so the effort is
bounded by how deep the investigation needs to go once the owner/an admin
can inspect server-side rules-evaluation logs.

---

## 2. Portfolio-level synthesis

### 2.1 Recommended fix order

1. **Root-cause and fix the shared write-path bug first, treating Apex
   Predator's assessment-save failure as the cleanest, earliest, most
   isolated reproduction case to start from.** It blocks meaningful use or
   verification of every other fix in this document — Immaculate's two-line
   mechanic fix can't be confirmed live without it, Oracle's accuracy ledger
   has nothing to persist without it, and even Project Chimera's eventual
   evidence-collection layer needs ordinary session-completion writes to
   succeed before it can accumulate anything. This is not a plan-specific
   fix; it is infrastructure that unblocks all four (and, per the Wave 6
   summary, likely several more plans across the whole audit).
2. **Immaculate (Re)Structure next** — the two-line fix (day-of-week
   condition + one library field) is by far the cheapest win available
   anywhere in this document and restores the plan's entire named mechanic
   for 5 of its 6 relationships in one small change. High leverage, minimal
   risk, no design questions to resolve first.
3. **Oracle's AI-config wiring fix third** — also small and isolated
   (`predict()` instead of `predictFromPriors()`, gated on the existing AI
   config check), independent of the larger accuracy-ledger work, and worth
   doing on its own even before the ledger/UI piece is scoped.
4. **Apex Predator's remaining T-2/T-3-family gaps (`resetProgram()`
   allowlist, `programProgress` backfill)** — small, low-risk, can ship
   alongside item 1 once the write path is fixed, since they were
   previously consequence-free only because nothing could populate the
   fields.
5. **Oracle's predictions-ledger + accuracy UI** — medium scope, no design
   invention needed (the scoring functions already exist and are correct),
   but does need a UI surface built and a data-model addition
   (`oracleStatus.predictions`), so it's sequenced after the cheaper wins.
6. **Project Chimera last** — by far the largest lift of the four, and the
   only one that cannot start until the owner answers the open design
   question in §2.2 below (does the reallocation engine get built out as
   designed, at all?). No amount of engineering effort should go into the
   evidence-collection/proposal-UI layer before that question is answered,
   since the owner might prefer a different, smaller mechanic instead.

### 2.2 Open design questions for the owner

These are open questions, not proposals — per PROC-1, no code changes and no
per-plan design decisions happen until the owner opens the implementation
pass, and per this audit's process, these get formally logged as `PLN-N`
question ids in `_audit-decisions.md` during the post-audit question round,
not here.

- **Project Chimera:** Does the adaptive reallocation engine get built out
  end-to-end as originally designed (full evidence-collection pipeline +
  proposal-review UI + write path), or does the owner want a smaller,
  cheaper mechanic instead — e.g., surfacing `phenotype()`'s descriptive
  label read-only on the dashboard (a lift already flagged in the plan's own
  doc as improvement #4, well short of the full reallocation loop) while
  deciding whether the full mechanic is worth the build cost? This is the
  single biggest scope decision blocking any of this roadmap's work on that
  plan.
- **Oracle:** Does the accuracy-scoring/"how close it got" half get built at
  all, or should the dead code (`refineWithModel`, `predictionError`,
  `accuracyBand`, `accuracyTrend`) simply be removed and the card's promise
  rewritten to describe only the (real, good) prediction half? The functions
  are already correct and small to wire up, but they still require new
  persisted state and a new UI surface — worth confirming the owner still
  wants this second half before building it, rather than assuming the
  original two-part card promise is fixed in stone.
- **Oracle's AI toggle:** Is the admin "Oracle predictions" AI-refinement
  feature (`refineWithModel`, ±7.5% bounded nudge) something the owner wants
  live at all, given `appConfig/ai` is currently disabled platform-wide? If
  not, the toggle and its bounded-refinement logic could be removed instead
  of wired up, simplifying Oracle to a pure-prior prediction engine.
- **Immaculate:** No open design question — the fix is unambiguous and
  small (two one-line changes). The only judgment call is whether to also
  add the improvement doc's suggested fallback (a base-data Correction-phase
  set bump independent of the runtime `preprocessDay` check, as a safety net
  in case the dynamic mechanism has further edge cases) — a nice-to-have,
  not a blocker.
- **Apex Predator:** No open design question either — everything about the
  mechanic is already correct and desired as-is; the only work is a
  server-side root-cause investigation into the write failure. Worth asking
  the owner whether they want Firestore audit logs pulled for the exact
  denied request as the first diagnostic step, since client-side rules
  tracing failed to pin the cause across multiple isolation attempts this
  audit.

### 2.3 Honest assessment of Wave 6 as a category

**Wave 6's prototypes are, with one partial exception, fundamentally sound in
design and let down by execution — but "execution" spans two very different
kinds of failure, and treating them as one bucket would be a mistake.**
Immaculate and Apex Predator are the clean cases: both are well-conceived,
scientifically grounded designs (Poliquin structural-balance ratios; a
region-scored movement-access assessment) whose engines are already correct
and either fully or almost-fully built — Immaculate needs a two-line fix,
Apex Predator needs a write-path root-cause, and neither needs the owner to
rethink what the plan is supposed to do. Oracle sits in the middle: its
prediction half is genuinely excellent, already-correct engineering that
works end to end, but its scoring half was never wired past its own file
boundary, and — unlike the other two — fixing it requires *new* work (a
persistence layer, a UI surface), not merely a bug fix, even though no new
design invention is needed. **Project Chimera is the one genuine design-
scope case in the set**, not merely an execution failure: its reallocation
engine is real and careful, but nothing in the app was ever built to feed it
data or show its proposals to an athlete, and closing that gap is a
ground-up build, not a fix — this is the one plan where the honest verdict
is "a large chunk of the intended feature doesn't exist yet," rather than
"the intended feature exists and something is silently disconnecting it."
Layered under all four sits the wave's dominant, unresolved infrastructure
story: a shared write-path failure that appeared first and most cleanly on
Apex Predator, then recurred and escalated in severity through every
subsequent Wave 6 plan, up to Oracle's total-loss case — this single
condition is a bigger practical blocker to all four plans working for real
athletes than any of their individual design or wiring gaps, and fixing it
first is what turns three of these four fixes (Immaculate, Oracle's small
piece, Apex Predator) from "correct code nobody can verify" into "correct
code that ships."

---

```yaml
doc: wave6-advanced-plans-roadmap
covers: [project-chimera, oracle, immaculate-restructure, apex-predator]
excludes: ghost-in-the-machine  # separate Wave 7 doc, unbuilt concept plan
recommended_fix_order:
  1: shared-write-path-bug (root-cause via Apex Predator's cleanest isolation case)
  2: immaculate-restructure (two one-line fixes, T-67/T-68)
  3: oracle-ai-config-wiring (predict() instead of predictFromPriors(), small)
  4: apex-predator-t2-t3-family-gaps (resetProgram allowlist, programProgress backfill)
  5: oracle-predictions-ledger-and-accuracy-ui (medium, no design invention needed)
  6: project-chimera-reallocation-engine (large, blocked on owner design decision)
effort_tiers:
  project-chimera: large, needs design decision from owner first
  oracle: split — small (AI wiring) + medium (accuracy ledger/UI), no design invention needed for either
  immaculate-restructure: small/isolated, two one-line changes
  apex-predator: small/isolated conceptually, bounded by depth of required root-cause investigation
open_design_questions:
  - project-chimera: build the full reallocation engine as designed, or ship a smaller descriptive-only surface instead?
  - oracle: build the accuracy-scoring half at all, or remove the dead code and narrow the card's promise?
  - oracle: keep or remove the inert AI-refinement toggle, given appConfig/ai is disabled platform-wide?
  - immaculate-restructure: none (fix is unambiguous)
  - apex-predator: none (fix is unambiguous, scope is investigation depth only)
shared_dependency: >
  All four plans' fixes are gated in practice by the wave's shared write-path
  bug (T-54 Apex Predator, T-57/58 Super Mutant, T-64 Neural Overload, T-70
  Immaculate, T-75 Oracle, T-79 Project Chimera) — admin-privileged writes of
  identical payloads succeeded instantly at every isolation point tried
  across all five Wave 6 plans, never once explained by a rules-clause trace.
  This is the single highest-priority infrastructure item ahead of any
  individual plan-local finding in this roadmap.
```
