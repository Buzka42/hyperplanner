# Ghost in the Machine — feasibility review and spec (Wave 7, doc-only)

> **This document is different in kind from every other file in
> `docs/plans/v2/`.** Ghost in the Machine has never been built. There is no
> `src/data/plans/ghostInTheMachine.ts`, no dedicated engine file, no
> Firestore status field, nothing to click through, nothing to log a workout
> against. This is not a bug audit of shipped code — it is a feasibility
> assessment and spec outline for a concept, informed by everything the other
> 36 plan audits (Waves 0–6) found about what actually works, and fails to
> work, in this codebase. No "wiring table" or "weekly volume table" appears
> below because there is no code and no exercise program to point at.

| | |
|---|---|
| **Wave** | 7 (final item in the review order, `_audit-status.md` §3) |
| **Status** | Unbuilt concept. Zero lines of plan-specific source. One adjacent capability (camera-based lift analysis) shipped, but inside a different plan (Apex Predator), not as Ghost in the Machine itself. |
| **Source docs found** | `docs/archive/source-planning/next-expansion-concepts.md` (original pitch, ~2026 pre-audit planning), `docs/roadmap/master-expansion.md` (implementation-order roadmap, records the partial ship) |
| **This document's job** | Determine what Ghost in the Machine is supposed to be, assess whether it's realistic to build given the audit's accumulated findings, sketch a spec outline, and list open questions for the owner — not to write code or make product decisions. |

---

## 1. What Ghost in the Machine is — found, not invented

An existing pitch **was found** — this is not being specified from a blank
page. Two source documents describe it, and a third records what actually
shipped.

### 1.1 The original pitch (`next-expansion-concepts.md`)

> **"The camera watches the set deteriorate."**

Ghost in the Machine is pitched as camera-assisted rep analysis: a fixed
phone camera watching a set and extracting objective signals about how the
lifter is degrading, then using those signals to inform training decisions
that would otherwise rely on the athlete's own subjective RIR report. The
source doc is explicit that this is "the most experimental plan and should
be prototyped before full implementation," and lists a deliberately modest
signal set it thinks is actually extractable from a fixed phone camera:

- rep count
- rep duration, split into concentric/eccentric
- approximate ROM consistency (not lab-grade bar-velocity — the doc
  explicitly warns against claiming that)
- pauses
- rep-to-rep slowing ("the fatigue trace" — described as the signature
  mechanic, rendered as a bar chart of rep duration climbing set to set)

Proposed engine idea: a set can be told to stop (or the next set adjusted)
when concentric-duration slowdown crosses a threshold, or ROM falls below a
threshold, or a fixed rep target is hit — i.e. camera-driven autoregulation
as an alternative/supplement to RIR self-report. A four-phase rollout is
sketched (SIGNAL → CALIBRATE → OVERRIDE → GHOST MODE, weeks 1–2/3–4/5–8/
9–12), moving from passive data collection to full autoregulated set
termination only after within-user camera-vs-RIR correlation is established.

The doc's own risk section is unusually self-aware for a pre-audit pitch
document: "Main risk: Computer-vision reliability," explicit warnings against
false precision ("never show fake statements like '93.7% recovered'"), and
an explicit prototype-first ordering (rep counting → timing → ROM
consistency, "only then build the full plan"). It's placed in "Tier C —
Platform-level / advanced" alongside Oracle and Event Horizon, and the
suggested build order puts it dead last of twelve concepts, with the
reasoning stated outright: **"GHOST should wait until camera analysis is
proven."** The closing synthesis frames its training question as: *"can rep
behavior become an objective autoregulation signal?"*

### 1.2 What actually shipped (`master-expansion.md` §6, "GHOST IN THE MACHINE
— video analysis shipped 2026-08-11")

The roadmap doc records, in its own words: **"Still no dedicated plan. What
shipped is the video-analysis capability, surfaced inside Apex Predator's
optional assessment step."** Concretely:

- Squat, Bench Press, and Deadlift lift videos are analyzed by Gemini
  through `aiAnalyzeLift` (`src/lib/ai.ts`, consumed by
  `src/features/apexPredator/videoAdvice.ts`).
- The clip is forwarded to the model and discarded — never stored.
- The result is advisory text only, confidence-flagged, explicitly refuses
  to diagnose, and **no prescription in the app changes because of it** —
  the roadmap doc states this as a hard constraint, not an observed gap.
- On-device signal work (the original pitch's rep-count/duration/ROM
  extraction, done locally rather than via a cloud vision model) "remains
  unexplored."
- Acceptance criteria as written: reliable rep counting, concentric trend,
  coarse ROM consistency, bad-angle rejection, and zero programming action
  from low-confidence reads.

This is confirmed independently by the Apex Predator audit
(`docs/plans/v2/apex-predator.md` §1, live-verified this audit): the
"Optional AI video advice" feature is real, gracefully degrades when
`appConfig/ai` is disabled platform-wide (which it currently is,
confirmed via a direct Firestore read), and matches its own card wording
exactly — it is explicitly *not* one of Apex Predator's dead-feature
findings.

**Net: the single most experimentally risky piece of the original
pitch — reliable computer-vision signal extraction from a fixed
camera — has a live, working, if currently platform-disabled,
implementation. But it exists as an advisory bolt-on to a different,
already-shipped plan, not as anything resembling the GHOST MODE
autoregulation engine, the four-phase rollout, or a standalone plan with
its own identity, exercises, or progression logic.** Nothing else described
in the pitch — fatigue-trace UI, ROM-consistency rewards, quality-PR
framing, threshold-based autoregulated set termination, the phase
structure — has any code anywhere in the repo. This was confirmed by
grep across `src/` for `ghost`, `ghostInTheMachine`, and
`ghost-in-the-machine`; every hit in application code is the unrelated
shadcn/ui `Button` `variant="ghost"` (a visual style name, not this
concept) or a `Ghost` badge icon literal unrelated to this plan.

### 1.3 What this means for "is there a gap in the portfolio this fills"

Per this task's brief, a proposed premise for an unbuilt plan should be
grounded in a gap the other 36 plans leave, not invented arbitrarily. Ghost
in the Machine already answers this for itself in its own source pitch: it
is the only plan in the entire original 12-concept list built around
**objective, camera-derived autoregulation** as opposed to the two
dominant existing paradigms across all 36 shipped plans —
1) load/rep-based double progression against a fixed template, and
2) subjective self-report (RIR, recovery-check, region pain) driving
adaptive logic (Immaculate's structural-balance ratios, Apex Predator's
pain-invalidated assessment, REDLINE's dead recovery check, Project
Chimera's dead evidence-gated reallocation). No shipped plan currently asks
"is the *rep itself* degrading in a way the lifter isn't self-reporting
accurately" — that gap is real and is exactly what the original pitch
targets. This audit is not proposing a new premise from scratch; it is
confirming the one already on file is still the correct gap to target, and
flagging that the piece already shipped (video-quality advisory analysis)
answers a narrower question (form/technique feedback) than the piece never
built (fatigue-driven autoregulation), so the gap the pitch describes is
still fully open.

---

## 2. Feasibility assessment, audit-grounded

This section is the core of the task: given everything the 36-plan audit
found about which engine shapes work, which fail silently, and why, what
would it take to build Ghost in the Machine correctly the first time?

### 2.1 The single most important warning: don't repeat Wave 6's dead-status-object pattern

Every one of Wave 6's advanced prototypes (Super Mutant, Neural Overload,
Immaculate, Oracle, Project Chimera) shipped with its headline adaptive
mechanic either fully or partially non-functional — a 5/5 rate, the worst
per-wave record in the whole audit (`_audit-status.md` §3, Wave 6 summary).
The dominant failure shape across those five plans was **a declared status
object or engine that is read somewhere but never reliably written by a
real UI path** — Project Chimera's `projectChimeraStatus` (zero callers to
the reallocation engine at all, no UI stub anywhere in `Settings.tsx` or
`Onboarding.tsx`), Oracle's scoring half (`refineWithModel`,
`predictionError`, `accuracyBand` — exported, never called), Super Mutant
and Immaculate's write-path failures freezing otherwise-real mechanics.

**Ghost in the Machine's proposed GHOST MODE (autoregulated set
termination driven by camera signal) is structurally the same shape of
feature as Project Chimera's reallocation engine and Oracle's scoring
half — a piece of adaptive logic that only matters if it's actually wired
into the athlete's live session, with a genuine write path, not a
side-channel computation nobody reads.** The single most important
audit-grounded rule to apply here, stated in the terms this audit already
uses: **any Ghost in the Machine status object (fatigue-trace history,
per-rep signal log, calibration state, autoregulation trigger) must be
wired to a real UI write path and a real UI read path before ship** — not
authored as a correct, isolated module with no caller, per the
Chimera/Oracle/Immaculate pattern this audit found on 3 of 5 Wave 6 plans.
If the eventual build produces a well-engineered `ghostAutoregulation.ts`
with no reference anywhere else in the app, that is not a smaller version
of the feature — per this audit's own findings, it is the *single most
common failure mode found in the entire advanced-plans category.*

### 2.2 The shared write-path bug is the second blocker, and it is unresolved

Independent of any Ghost-specific engineering, the Wave 6 roadmap
(`_wave6-advanced-plans-roadmap.md` §2.1) names an unresolved, portfolio-
wide write-path failure — `updateDoc` writes to the user's own document
failing with `permission-denied` at multiple independent call sites across
five separate plans (Super Mutant, Neural Overload, Immaculate, Oracle,
Project Chimera), never explained by a rules-clause trace, never failing on
an admin-privileged write of the identical payload. This is flagged as
"the single highest-priority infra item for the owner across the whole
audit." **Any Ghost in the Machine build that depends on persisting
per-rep signal data, calibration state, or an autoregulation trigger is
exposed to this bug by default** — it is exactly the kind of frequent,
small, session-scoped write (analogous to Oracle's `oracleStatus.exposures`
or Immaculate's structural-balance state) that has already failed on every
Wave 6 plan tested. Building Ghost's persistence layer before this is
root-caused would mean debugging a brand-new feature against a known,
already-diagnosed-as-systemic failure mode — wasted effort that would look
like a Ghost-specific bug but isn't.

### 2.3 What "good, working" looks like in this codebase — the bar to clear

Two contrasting reference points from the audit, both genuinely wired:

- **Apex Predator's movement-access assessment** (once its one broken
  write is bypassed): region scoring, pain-invalidation, lowest-two-
  regions emphasis selection with asymmetry/recency tie-breaks, and
  placeholder-to-real-exercise substitution all live-confirmed working
  exactly as designed — described in this audit as "the single
  best-engineered adaptive mechanic found anywhere in Wave 5/6." Its
  lesson for Ghost: complex, multi-input adaptive selection logic is
  achievable in this codebase and can be excellent — the risk is never in
  the computation, it's in the one write call that persists the input
  data in the first place.
- **Athena/Kali's dedicated dashboards** (Wave 4): the first plans found
  structurally immune to T-9 (the shared plan-switch/stale-week routing
  bug), because they read from plan-local state rather than the shared
  `dashboardViewWeek` localStorage cache. This became a reliable predictor
  across the rest of the audit — every Wave 4 plan with its own dashboard
  component went 4/4 clean on T-9. **Any Ghost dashboard surface (the
  fatigue-trace bar chart, a calibration-confidence readout) should be
  built as its own dedicated component reading plan-local state, not
  folded into the shared dashboard's generic week-view path**, both to
  inherit this T-9 immunity and because the fatigue-trace visualization
  described in the pitch (a live-updating rep-duration bar chart) doesn't
  fit the shared dashboard's existing week-card layout anyway.

### 2.4 Specific engine-shape risks to design around, from the TECHNICAL table

- **T-2 family (`resetProgram()` allowlist).** Every plan audited with its
  own `xStatus` object has needed to be added to `resetProgram()`'s
  hardcoded allowlist by hand, and every single one so far launched
  without that addition (Athena, Venus Rising, Kali, House of Iron, Apex
  Predator, and more). A Ghost `ghostStatus`/`ghostCalibration` object
  should be added to that allowlist in the same PR that introduces it, not
  as a follow-up — the pattern's hit rate across the whole audit is
  effectively 100% otherwise.
- **T-22 (`liftHistory` never written).** If a future Ghost surface ever
  wants to show "form quality over time" alongside a `strength_chart`-style
  widget, it would inherit this bug by default — `liftHistory` is declared,
  read in 7 places, and written by nothing, portfolio-wide. Don't build a
  Ghost-specific history chart on the assumption that the underlying
  write path already works; verify it explicitly, since 5+ plans already
  discovered it silently doesn't.
- **T-9 (plan-switch/stale-week routing).** Confirmed on the large majority
  of plans without a dedicated dashboard (Waves 2, 3, and most of 5).
  Given §2.3 above, this is avoidable by construction if Ghost gets its own
  dashboard component from day one — worth stating as a design requirement,
  not an afterthought fix.
- **The write-path bug's specific shape on adjacent plans** — Oracle's
  *total* loss (session log, `oracleStatus.exposures`, and progress
  counters all failing together) is the closest structural analog to what
  a Ghost per-rep signal log would need: multiple related writes bundled
  in one completion event. If that bug is still unresolved when Ghost
  engineering starts, expect the same bundled-failure shape, not a clean
  partial write.

### 2.5 A genuinely new risk class Ghost introduces that no prior plan has faced

Every risk above is a repeat of a pattern already seen elsewhere in the
portfolio. Ghost also introduces at least one risk class with **no
precedent anywhere in the 36 audited plans**: computer-vision reliability
directly gating a training decision. The original pitch's own "camera
confidence" guardrail — don't make programming changes when the athlete
leaves frame, the angle is poor, there's an obstruction, or detection is
uncertain — has no analog to check against, because no other plan in the
audit makes a prescription decision from an external sensor at all (Apex
Predator's video advice is explicitly prescription-inert by design, per
§1.2). This means the audit's usual method — "check whether this repeats a
known shared bug" — doesn't apply to Ghost's core mechanic the way it does
to every other Wave 6 plan; the CV-reliability risk has to be assessed on
its own terms; a prototype-first approach (rep count → timing → ROM
consistency, exactly as the original pitch itself already recommends) is
the only way to get any audit-style evidence about it before committing to
the full engine.

### 2.6 Overall feasibility verdict

**Building Ghost in the Machine as originally pitched (full four-phase
GHOST MODE autoregulation) is a large, multi-stage effort with a genuinely
unproven core technical risk (on-device or reliable cloud CV signal
extraction) sitting underneath an application-layer risk this audit has
already seen fail on 5 of 5 Wave 6 plans (dead status objects / unwired
engines) and a portfolio-wide infrastructure risk that is currently
unresolved (the shared write-path bug).** None of these three risks are
Ghost-specific — they're all findings this audit already made elsewhere —
which is exactly why this section leads with them: a future implementer
who treats Ghost as a green-field build without reading this table is very
likely to rediscover all three independently, at Ghost-specific cost, when
each one already has a name, a root cause investigation status, and (for
two of the three) a recommended fix path elsewhere in this audit.

The one piece of the original pitch already de-risked — camera-based rep
signal extraction being *achievable at all* — has already been proven, in
production, via the shipped Apex Predator video-advice feature. That
substantially lowers the technical uncertainty of the pitch's own
"prototype computer vision first" gate, even though it proves it for
advisory analysis, not for the harder real-time autoregulation loop GHOST
MODE describes.

---

## 3. Spec outline (not an implementation plan — PROC-1)

This is not a set of implementation instructions. It is a structured
restatement of what's known and proposed, detailed enough to be useful
input to a future design decision, consistent with every other
document produced under PROC-1 (findings/spec only, no code).

### 3.1 Proposed phased scope, inherited from the original pitch with audit-informed sequencing added

1. **Phase 0 — Signal validation (prototype only, no plan yet).** Confirm
   rep counting, concentric-duration trend, and coarse ROM consistency are
   extractable reliably enough to show an athlete, on a small set of
   camera-friendly movements, exactly as the original pitch's own §"Main
   risk" section recommends. The shipped `aiAnalyzeLift`/Gemini pipeline
   inside Apex Predator is a plausible existing foundation to prototype
   against rather than building new CV infrastructure from scratch — worth
   evaluating explicitly before assuming a new pipeline is needed.
2. **Phase 1 — SIGNAL (passive collection).** Build a `ghostStatus`-style
   per-set signal log (rep count, rep durations, ROM-consistency score,
   confidence flag) with a real write path, wired into `resetProgram()`'s
   allowlist from day one, and a dedicated dashboard component (not the
   shared week-view cache) showing the fatigue-trace bar chart the
   original pitch names as the signature mechanic. No prescription change
   yet — this phase is pure data collection and display, deliberately
   avoiding the T-2/T-9/dead-object risks in §2 before any adaptive logic
   is added.
3. **Phase 2 — CALIBRATE.** Compare camera-derived slowdown against
   athlete-reported RIR, within-user only (the pitch is explicit that
   between-user comparison isn't the useful signal). Surfaces a
   correlation/confidence readout, still no autoregulation.
4. **Phase 3 — OVERRIDE.** Camera signal begins informing session-level
   recommendations (extra rest, set adjustment) with a required
   confirm-or-decline UI step, modeled on Event Horizon's "every swap
   requires confirmation" precedent rather than a silent auto-adjustment.
5. **Phase 4 — GHOST MODE.** Full individualized autoregulated set
   termination, only after Phases 0–3 have produced within-user evidence
   the signal is trustworthy — exactly the original pitch's own gating
   logic, now cross-referenced against this audit's finding that adaptive
   engines without a proven data pipeline underneath them are precisely
   the pattern that failed on 5/5 Wave 6 plans.

### 3.2 What each phase would need, structurally (not prescriptively)

- A dedicated plan identity, exercises, and template — none of this exists
  yet; Ghost has no place in `PLAN_REGISTRY` today and building the
  signal/engine work described above doesn't by itself answer what the
  actual training program looks like.
- A `ghostStatus`-shaped object added to `resetProgram()`'s allowlist at
  creation time, not retrofitted.
- A dedicated dashboard component from Phase 1 onward, for T-9 immunity
  and because the fatigue-trace visualization doesn't fit the existing
  shared week-card layout.
- An explicit low-confidence guardrail (per the pitch's own "camera
  confidence" section) gating every phase past Phase 1 — no programming
  change fires on an uncertain read, mirrored on Apex Predator's own
  "zero programming action from low confidence" acceptance criterion for
  its already-shipped video advice.
- A decision — open question, not decided here — on whether the CV
  pipeline is cloud-based (extending the existing Gemini/`aiAnalyzeLift`
  approach) or on-device (the original pitch's "unexplored" alternative),
  since this materially changes cost, latency, and privacy posture and
  is not something this audit is positioned to resolve.

---

## 4. Open questions for the owner

These are genuine product/design decisions, parked per this audit's
established practice (not decided here, not voted on, and — per the Wave 6
roadmap's own convention for this same kind of document — not logged as new
`PLN-N` decision-log ids; any such ids belong to the post-audit question
round per PROC-1).

1. **Does Ghost in the Machine get built at all, and on what timeline
   relative to the post-audit implementation pass?** It was originally
   ranked last of 12 concepts for a specific, stated reason ("should wait
   until camera analysis is proven") — that gate has now been partially
   cleared by the Apex Predator video-advice ship, but only for advisory
   analysis, not for the harder real-time autoregulation loop. Does the
   owner consider the original gating condition satisfied, partially
   satisfied, or still open?
2. **Cloud vision (extend the existing Gemini pipeline) vs. on-device
   signal extraction?** The original pitch treats on-device as the more
   interesting long-term direction but explicitly unexplored; the shipped
   Apex Predator feature is cloud-based. This has real cost/latency/
   privacy tradeoffs the audit isn't positioned to resolve.
3. **Does the eventual build stay a standalone plan, or become a
   cross-plan capability (a video-analysis layer any plan can opt into),
   the way it already partially works today as an Apex Predator
   assessment-step add-on rather than its own plan?** The original pitch
   assumes a standalone plan; what actually shipped suggests a
   feature-layer shape might already be the direction the codebase is
   drifting toward.
4. **How much of the four-phase rollout (SIGNAL → CALIBRATE → OVERRIDE →
   GHOST MODE) ships as one build vs. gated releases with real athlete
   data between phases?** The original pitch's own phase design assumes
   waiting for real calibration data before enabling OVERRIDE/GHOST MODE
   — does the owner want that gating to be a genuine ship-gate (don't
   build Phase 3 code until Phase 2 has real data), or built end-to-end
   with the gating enforced only at runtime?
5. **Should the shared write-path bug (§2.2) be resolved before any Ghost
   engineering starts, given it's already flagged as the audit's top
   cross-plan infrastructure priority independent of this plan?** This
   audit's own recommendation (consistent with the Wave 6 roadmap's fix
   ordering) is yes, but it's the owner's call on sequencing relative to
   other post-audit work.

---

## 5. Closing note — end of the review-order pass, not the whole audit

This document is the last item in the review order specified in
`_audit-status.md` §3: Waves 0 through 7, all 36 shipped plans plus Ghost
in the Machine, are now fully reviewed. **This marks the completion of the
plan-by-plan review order only.** Per this audit's own process
(`_audit-decisions.md` §0, PROC-1/AUDIT-4/AUDIT-7), two pieces of
deliberately deferred work remain outstanding and are not addressed by
this document:

1. **The end-of-audit cross-plan synthesis report** (`_audit-status.md` §1
   item 6, deferred per AUDIT-4/AUDIT-7 until all waves are done — that
   condition is now met).
2. **The post-audit implementation pass** (PROC-1's option A: findings
   only during the audit, one implementation pass after). No code has been
   changed anywhere in this repo as part of this task or any prior wave,
   with the sole standing exception already recorded (AUDIT-6b, the Pain &
   Glory claimed-keyword UX fix).

The audit is not "done" — the review order is.

---

```yaml
doc: ghost-in-the-machine
wave: 7
status: unbuilt-concept, doc-only, feasibility + spec (not implementation)
existing_spec_found: true
sources:
  - docs/archive/source-planning/next-expansion-concepts.md  # original pitch
  - docs/roadmap/master-expansion.md                          # implementation-order roadmap, records partial ship
shipped_today:
  - feature: ai-video-lift-advice
    location: src/features/apexPredator/videoAdvice.ts, src/lib/ai.ts (aiAnalyzeLift)
    surfaced_in: apex-predator (not a standalone Ghost plan)
    scope: advisory only, Squat/Bench/Deadlift, Gemini-based, confidence-flagged, discards clip, zero prescription impact
    status: platform-wide appConfig/ai currently disabled; degrades gracefully (confirmed, not a dead-feature finding — see apex-predator.md §1)
  - feature: on-device signal extraction (rep count/duration/ROM via local CV, no cloud call)
    status: unexplored, per master-expansion.md
not_shipped:
  - dedicated ghost-in-the-machine plan/template/exercise-set
  - ghostStatus or equivalent data model
  - fatigue-trace UI (signature mechanic per original pitch)
  - four-phase SIGNAL/CALIBRATE/OVERRIDE/GHOST-MODE rollout
  - camera-driven autoregulated set termination
core_gap_this_would_fill: >
  objective, camera-derived autoregulation as a third paradigm alongside the
  portfolio's two existing ones (fixed-template double progression; subjective
  self-report driving adaptive logic) -- no shipped plan currently questions
  whether self-reported RIR/recovery is accurate against an external signal
key_feasibility_risks:
  - dead-status-object / unwired-engine pattern (5/5 Wave 6 plans hit this; single biggest risk to design around explicitly)
  - shared cross-plan write-path bug, unresolved as of Wave 6 close (T-54/57/58/64/70/75/79)
  - T-9 plan-switch/stale-week routing (avoidable by building a dedicated dashboard from day one, per Wave 4's 4/4 clean record)
  - T-2 resetProgram() allowlist gap (100% hit rate across audited plans with their own xStatus; add ghostStatus at creation, not retrofit)
  - CV reliability under real conditions -- no precedent elsewhere in the 36-plan portfolio, must be assessed on its own terms
de_risked_by_shipped_work:
  - camera-based rep/form signal extraction is proven achievable in production (Apex Predator's aiAnalyzeLift), for advisory use -- does not prove the harder real-time autoregulation loop
open_questions_for_owner: 5   # see §4; none decided here, no new PLN-N ids logged in this doc
audit_milestone: >
  Completes the full Wave 0-7 review order (36 shipped plans + Ghost in the
  Machine). Cross-plan synthesis report and post-audit implementation pass
  both remain outstanding per PROC-1/AUDIT-4/AUDIT-7.
```
