# Plan-audit decisions

Living log. **Owner answers planning questions. Technical bug-fixes are listed
but not voted on.** Per-plan design questions are parked until the 36-plan
audit is finished (see PROC-1).

How this file works:

- Status: `PENDING` · `DECIDED` · `DEFERRED` · `PARKED` (ask after audit) · `TECHNICAL`
- Answer in chat by **question id**. This file is updated after each round.
- New waves append findings and new question ids; parked Wave 1 questions
  are not re-asked until the post-audit decision round unless PROC-1 changes.

Last updated: 2026-08-16 — Waves 0–7 complete; rebuild (`*-RB-*`) and variety
(`*-V-*`) votes complete. **Close-out index:**
`docs/plans/v2/_audit-closeout.md`. Synthesis:
`docs/plans/v2/_end-of-audit-synthesis-report.md`. Next: owner opens **PROC-1**
implementation. Iron Clock parked. REDLINE abs and Peachy core movements still
open.

---

## 0. Process

### PROC-1. When do we implement vs keep auditing?

Claude is mid Wave 2 (hypertrophy). Options:

- **A.** Finish the full 36-plan audit, then one implementation pass
- **B.** Implement Wave 1 integrity now, keep auditing in parallel
- **C.** Implement only *shared* bugs now (routing, reset, wave math, attribution); leave per-plan design until that plan's wave is done
- **D.** Other

**Decision:** DECIDED — **A.** Finish all 36 plans (+ Ghost) as findings-only, then one implementation pass.

Recorded 2026-08-14 from owner: answering PROC-1 first “changes the complete direction of the task.” If that was not option A, correct it immediately.

**Consequence:** no **code** until the owner opens the implementation pass, **except AUDIT-6b** (claimed-keyword UX + Pain & Glory `registerUser` extra slot). Per-plan **design votes** (`*-RB-*`, `*-V-*`) were taken 2026-08-16 after the 36-plan audit; they are findings for that pass, not tickets. See `_audit-closeout.md`.

### PROC-2. Enhancement blueprint vs integrity

Cluster 1 extras (bands/chains, bench sparkline, wrap mode, paused vs TnG,
front-squat booster, etc.) — freeze until Layer A, implement in parallel, or
cherry-pick a short list now?

**Decision:** PARKED (post-audit)

### PROC-3. Shared primitives

Extract one checkpoint-e1RM + auto-deload + plan-week-pointer module, or
patch each plan in place and extract only if a third copy appears?

**Decision:** PARKED (post-audit)

### PROC-4. Exercise-library hygiene in the same pass?

Approved true-duplicate merges + attribution bugs (`reverse-nordic-curl`,
etc.) — same PR as plan fixes, separate library PR first, or wait until
hypertrophy volume tables depend on them?

**Decision:** PARKED (post-audit)

### PROC-5. Pain & Glory still untestable

Fresh unclaimed keyword from you, fix claimed-keyword UX first then retest,
or implement from source and live-verify later?

**Decision:** PARKED (post-audit) — except as an *audit* unblock (see AUDIT-6).

These ship only in the post-audit implementation pass unless PROC-1 is reversed.

---

## 0b. Given PROC-1 — questions that still matter *during* the audit

### AUDIT-1. My role until Wave 7 lands

- **A.** Second-review each wave when you drop the docs (same as Wave 1)
- **B.** Stay quiet until all waves are done, then one synthesis + one decision round
- **C.** Only update this file / standing watch-list; no plan-by-plan commentary
- **D.** Other

**Decision:** DECIDED — **A.** Second-review each wave when docs drop.

Does **not** include a Wave-N comparison write-up (see AUDIT-4, AUDIT-7).

### AUDIT-2. Per-plan docs: keep ranked implementation suggestions?

Current format requires ≥5 science-ranked improvements. Under “audit first”:

- **A.** Keep them — they are hypotheses, not tickets
- **B.** Findings + verdict only; defer “what to change” to the post-audit round
- **C.** Keep improvements, but label every one `hypothesis` / `shared-bug` / `plan-local`

**Decision:** DECIDED — **C.** Keep ≥5 ranked improvements; tag each `hypothesis` / `shared-bug` / `plan-local`.

### AUDIT-3. This decisions file during the remaining waves

- **A.** Accumulate a running pattern list (no owner votes) so the final round is short
- **B.** Leave parked questions untouched; only append new *process* items
- **C.** After each wave, add that wave’s decision ids still PARKED (don’t ask yet)

**Decision:** DECIDED — **A.** Accumulate a running pattern list (no owner votes). See §0c.

### AUDIT-4. Wave comparison files

Keep writing `_comparison-waveN-*.md` at the end of each wave (as Wave 1), or
hold all cross-plan diffs for a single end-of-audit report?

**Decision:** DECIDED — **B.** No per-wave `_comparison-waveN-*.md`. One end-of-audit report after Wave 7. Wave 1’s comparison file stays as a record.

### AUDIT-5. Tell the auditing agent PROC-1?

Should `_audit-status.md` state explicitly: no code, no merges, no wiring
fixes, even for critical bugs, until owner opens the implementation pass?

**Decision:** DECIDED — **B.** Do not add a PROC-1 banner. Existing findings-only copy in `_audit-status.md` is enough.

### AUDIT-6. Pain & Glory live gap *as an audit hole*

Accept the source-only review until implementation, or still get a fresh
keyword so Wave 1 is complete before Wave 2 continues?

**Decision:** DECIDED — **C.** Fix claimed-keyword UX first, then retest Pain & Glory.

**Conflict with PROC-1:** this is application code during the audit. Needs an explicit override (AUDIT-6b).

### AUDIT-7. When Wave 2 (hypertrophy) docs arrive

Immediate synthesis (like the Wave 1 note you asked for), or hold all
cross-wave synthesis until Waves 0–7 exist?

**Decision:** DECIDED — **B.** Hold all cross-wave synthesis until Waves 0–7 exist.

With AUDIT-1 A: still second-review the new plan docs when they land; do not write a hypertrophy comparison or a portfolio synthesis until the catalog is complete.

### AUDIT-6b. Override PROC-1 for claimed-keyword UX?

AUDIT-6 C is the only in-audit code the owner has asked for so far.

- **A.** Yes — narrow exception: claimed-keyword / `registerUser` failure UX only, so Pain & Glory can be live-tested. Nothing else.
- **B.** Yes, and also T-5 (`handlePainGlorySubmit` wrong slot) if needed to register at all
- **C.** Revert AUDIT-6 to accept source-only until the implementation pass
- **D.** Don’t write code; I’ll hand a fresh unclaimed keyword instead

**Decision:** DECIDED — **B.** Narrow PROC-1 exception: claimed-keyword / `registerUser` failure UX, **and** T-5 (`painGloryStatus` must go in `registerUser`’s `extra` slot). Nothing else during the audit.

---

## 0c. Running patterns (AUDIT-3 — no votes)

Append here at the end of each wave. Do not promote to DECIDED.

### Wave 0–1 (already observed)

- Dedicated-engine plans can ship with one critical defect that silently falsifies the headline promise.
- Three failure modes: total non-wiring, total inaccessibility, partial/silent wrong numbers.
- Plan-switch / next-session routing is shared (Ritual, Bench, King).
- `resetProgram()` allowlist is incomplete.
- `type: 'wave'` load math can ignore phase (King; check Neural Overload).
- Duplicated slot definitions drift (Bench pull-ups).
- Runtime-substituted names bypass `verify:*` (Trinary lockout variations).
- Checkpoint e1RM “never compound estimates” independently correct on four plans.
- Auto-deload + week renumber correct on Ritual and Bench; missing on Pain & Glory and King.
- Low-volume plans: judge zeros, not the 5-set MAV line.
- Reverse-nordic misattribution already hits Bench (and Quadfather, not yet in this wave’s docs).

### Wave 2 (in progress)

- Monolith: cleanest-engineered plan yet — one bug, and it's T-1's root cause
  laid bare (T-9, a literal shared `localStorage` key with no `programId`
  component). Zero exposure to T-3 (no wave progression), T-2 (no `xStatus`
  to omit — `resetProgram()`'s generic path already covers it), or the
  duplicated-slot pattern (phase `transform` functions, single authoritative
  definition per slot). Suggests the `definePlan()`-generic engine plans as
  a class may be structurally safer than the bespoke-engine ones audited in
  Wave 1 — worth watching across the rest of Wave 2 (Purgatorio, Event
  Horizon, Tenfold, Pencilneck) to see if that holds.
- Purgatorio: **hypothesis holds twice in a row.** Same `definePlan()` +
  phase-transform architecture, same immunity to T-2/T-3/T-4/reverse-nordic,
  and T-9 reproduces with byte-identical mechanism (no `programProgress`
  entry, fresh `startDate`, stale week shown from whatever plan was viewed
  previously). Two consecutive generic-engine plans, two consecutive
  "one bug and it's the shared one" results — strengthening evidence T-9
  is the single highest-leverage fix in the whole audit so far, since it's
  the *only* defect two structurally clean plans in a row actually have.
  New pattern: a source-comment-vs-code mismatch (Purgatorio's header claims
  "fewer exercises" during Intensification; code doesn't reduce exercise
  count) — worth a quick grep on remaining Wave 2/3 plans for similar stale
  header comments describing an earlier design.
- Event Horizon: **worst single finding of Wave 2** — the plan's entire
  headline mechanic (report a painful joint region, get a cost-aware
  same-role swap) is a complete, carefully-designed backend
  (`costAwareSwaps.ts`) with **zero UI entry points anywhere in the app**
  (T-10). Confirmed both statically (no references outside the engine file)
  and live (no report/swap/region control on dashboard or workout view).
  Worse than Blackout's dead-feature-module precedent (§ Wave 0-1) because
  there the features were partially wired; here there is no way in at all.
  Third consecutive `definePlan()`-generic plan with T-9 and zero exposure
  to T-2/T-3/T-4/reverse-nordic otherwise — the "generic engine = safer"
  pattern keeps holding for local bugs, but doesn't protect against a
  feature simply never getting a frontend.
- Tenfold: **first "generic engine, safer" data point that's genuinely
  mixed rather than clean-sweep.** Same generic day/phase architecture
  (immune to T-3/T-4/reverse-nordic, same as the other three Wave-2 plans),
  but pairs it with a *bespoke* progression handler and its own `xStatus`
  (`tenfoldStatus`) — which reintroduces T-2 (now T-11) despite the
  generic day layer. Useful refinement: "generic day/phase engine" and
  "has its own status object" are independent axes, not one binary
  bespoke-vs-generic split. On the positive side: this is the **first plan
  in the whole audit where every literal card claim checked out exactly as
  written** under live verification — the 10x10 gated-progression logic is
  genuinely correct (requires *all* ten sets to hit target, not any-set).
  T-9 confirmed a fourth consecutive time.
- Pencilneck (Wave 2 close-out, bespoke engine): **resolves the "generic
  engine is safer" question with a nuanced answer, not a clean yes/no.**
  Zero exposure to T-3 (no wave progression) and no *classic* T-4
  duplicated-branch pattern (single `COMPOUND_EXERCISES` Set as source of
  truth, unlike Bench Domination's divergent `===` branches) — so bespoke
  engines aren't automatically unsafe either. But it introduces a genuinely
  new defect class (T-12: shallow-overwrite status drift across two write
  sites) not seen on any generic-engine plan, plus a resetProgram gap
  (T-13) even though `pencilneckStatus` is nominally on the allowlist, plus
  the single largest static-doc-vs-runtime gap of Wave 2 (isolation sets
  silently clamped 3→2 app-wide, every week, never documented). **T-9
  reproduced a fifth consecutive time, including on this bespoke-engine
  plan** — conclusive proof the plan-switch bug is 100% independent of
  which engine (generic or bespoke) sits underneath, since it lives entirely
  in `Dashboard.tsx`'s shared localStorage key.

### Wave 2 summary (5/5 plans done)

Every plan: T-9 confirmed (5/5). Zero T-3 exposure (5/5 — none use `type:
'wave'`). Zero reverse-nordic-curl exposure (5/5). T-4 classic pattern
absent on all 5 (generic-engine plans structurally immune; Pencilneck's
bespoke engine used a single-source-of-truth Set instead of divergent
branches, avoiding it too). T-2-family gaps found on 3/5 (Event Horizon
T-10, Tenfold T-11, Pencilneck T-12/T-13) — only Monolith and Purgatorio,
both with no `xStatus` at all, were fully clean on this axis. One
Wave-1-caliber critical finding (Event Horizon's entirely unreachable
headline feature, T-10) — otherwise Wave 2 plans are meaningfully
cleaner in aggregate than Wave 1's, with findings skewing toward
doc-vs-code mismatches and the one shared T-9 bug rather than plan-breaking
local defects.

### Wave 3 (in progress)

- Overhead Dominion: **two independent claims fail live verification, one
  of them the worst progression bug found in the audit so far.** The card's
  "5/3/2 waves" claim is pure UI decoration (T-14) — worse than King of the
  Squat's T-3, since here the wave math is never invoked at all, not just
  miscalculated. The "front/side/rear delt tracked separately" claim is a
  second confirmed instance of Event Horizon's dead-feature pattern (T-15)
  — a real, correct computation with zero athlete-facing surface. T-9
  confirmed a sixth consecutive time. Otherwise the plan's actual day
  design and delt-head volume balance are genuinely well thought out —
  worth watching whether "specialization plan promises tracked sub-muscle
  volume it never shows" becomes a Wave 3 theme, since every plan left in
  this wave is a specialization plan by definition.
- Arms Race: **hypothesis weakened.** Second Wave-3 specialization plan,
  and it doesn't repeat either T-14 or T-10/T-15 — every distinctive claim
  (density-day supersets, myo-reps technique, "never the same way twice")
  checked out live exactly as written, and the plan never claims a
  per-head tracking feature it doesn't build (so there's nothing to be a
  dead feature). Strongest-executed specialization plan in the audit so
  far, second only to Tenfold's "every card claim survives verification"
  result across the whole audit. Also the clearest illustration yet of why
  T-14 happened: myo-reps only needed a `technique` change to work, while
  Overhead Dominion's wave technique specifically needed a matching
  `progression.type` change it never got — the bug is about a specific
  progression-type/technique-kind coupling, not techniques in general. T-9
  confirmed a seventh time, in a new variant (stale week clamped to a
  shorter plan's final week rather than reset to week 1).
- Hamstring Foundry: **no `reverse-nordic-curl` exposure** (the single
  highest-stakes check for a hamstring plan, given the misattribution's
  track record on Bench Domination/Quadfather) — clean. Precisely-scoped
  4-second-eccentric tempo claim confirmed live in both directions. But a
  new plan-local instance of "one tracked lift, others unprogressed" (T-17)
  directly contradicts the card's explicit "all of which must progress"
  claim — the third Wave-3 plan in a row where at least one specific,
  appealing mechanical claim doesn't survive contact with the actual
  engine (Overhead Dominion's wave/delt-split, then a clean pass on Arms
  Race, now Hamstring Foundry's progression claim). T-9 confirmed an
  eighth consecutive time.
- Quadfather: **the reverse-nordic-curl misattribution finally gets
  quantified**, and it's the worst-case scenario predicted since Wave 1 —
  it specifically launders volume away from a plan's own specialization
  muscle (quads), not just a random secondary muscle (T-19: quad total
  understated ~10.6%, hamstring total overstated 20%). Also the third
  Wave-3 plan in a row with a dead-feature finding — two this time (ROM
  confirmation, knee-feedback swaps, T-18), both well-engineered backends
  with zero UI, continuing Overhead Dominion's and Hamstring Foundry's
  pattern of appealing mechanical claims that don't survive live
  verification. The Load/Depth/Burn role design itself, like Arms Race's
  day structure, is genuinely excellent — Wave 3's emerging shape is
  "strong training design, oversold feature list."
- Cathedral: **confirms the pattern a fourth time, with the cleanest
  version yet (T-20).** Every literal card claim about the actual training
  design ("no barbell bench," "incline DB press as the heavy arch," "three
  arches") is true and confirmed live — matching Arms Race's clean pass.
  But `cathedralStatus` is entirely unwritten anywhere in the codebase, no
  exceptions, and unlike every prior dead-feature instance this wave, the
  *entire* consuming code path (`preprocessDay`'s combo/shift logic, over
  a third of the plan file) is structurally unreachable, not merely
  unsurfaced. Four consecutive Wave-3 plans, four dead-feature findings —
  this is now the wave's single most consistent defect class, more
  reliable than any individual shared-bug pattern from Waves 1-2.
- Peachy: **streak breaks.** First Wave-3 plan (5th in the wave) with zero
  T-10/T-14/T-15/T-17/T-18/T-20-class findings — both its tracking
  features (glute circumference, squat history) are genuinely wired, write
  real data, and pay off in real badges, not static fallbacks. Also the
  first bespoke-engine plan in Wave 3 (lives outside `src/data/plans/`,
  unlike every other plan this wave) and structurally immune to T-4 by a
  different mechanism than the `definePlan()`-generic plans — procedural
  per-week generation rather than phase transforms on a static template.
  Its one real finding (T-21) is a training-design gap, not a wiring bug:
  no bilateral hip thrust anywhere in a glute-specialization plan, a
  genuine mismatch with the "science-based" framing that a volume-table
  computation caught precisely. Worth noting for the rest of Wave 3: the
  dead-feature pattern isn't universal to specialization plans as a
  category, it tracks with a specific engine/status-object shape (a
  declared-but-unwritten status field feeding a claimed adaptive feature)
  that Peachy simply doesn't have.
- Workhorse: **the wave's highest-leverage finding, and it's not
  plan-local.** "Progressed on total system weight" is false for the
  number that actually decides next week's load (T-23) — confirmed by
  logging a real set live and reading `workingLoads` back from Firestore.
  But the more important discovery came from checking *why* the "Chin
  belt" strength chart looked empty: `liftHistory` (the field
  `trackedLiftFor()` reads for the `strength_chart` widget already seen on
  four other plans this wave) has **no write path anywhere in the
  codebase** (T-22). This means the widget has plausibly been silently
  broken on every plan audited so far that uses it — worth a priority
  re-check pass once this is fixed, since it could change the UI/UX
  findings section of Overhead Dominion, Hamstring Foundry, Cathedral, and
  Quadfather's docs (their "tracked lift" widgets were confirmed to render
  correctly, but none of those sessions verified the underlying chart data
  actually populates from a real workout).
- Gravity Is Optional (Wave 3 close-out): **both shared bugs confirmed
  reproducing on a second, independent plan.** T-22 (`liftHistory` unwritten)
  and T-23 (total-system-weight never progressed, TSW card mislabeled) both
  reproduce exactly, live-confirmed — strong evidence both are single,
  portfolio-wide fixes rather than Workhorse-specific quirks. A new
  decorative-claim instance (T-24, "total-rep targets" is a badge with no
  tracking) extends the wave's dominant theme to a `technique` kind, and
  "vertical pull and dip family 3x weekly" is off by one exposure for both
  named families (2x each, not 3x) — though the families are at least
  volume-matched against each other.

### Wave 3 summary (8/8 plans done)

Every plan: T-9-family reproduced in some form on all 8 (including two new
variants — clamped-to-final-week on a shorter plan, and the "last manually
viewed week" mechanism confirmed again on several). Zero exposure to T-3
(wave progression) and zero `reverse-nordic-curl` misattribution across
the whole wave — both patterns stayed confined to Wave 1's powerlifting
plans and Wave 3's Quadfather respectively. T-4's classic duplicated-branch
pattern never reproduced once, across 8 plans with 3 different engine
shapes (`definePlan()`-generic, bespoke-with-preprocessDay, bespoke
procedural-per-week) — the strongest evidence yet that this specific bug
pattern was a Wave-1-era artifact of a coding style Wave 2/3's plans don't
use, not something to keep actively hunting for.

**The dominant Wave-3 finding, by a wide margin, was the dead/decorative-
claim pattern**: 6 of 8 plans (Overhead Dominion, Hamstring Foundry,
Quadfather ×2, Cathedral, Gravity Is Optional) had at least one specific,
checkable card claim that doesn't survive live verification — a
declared-but-unwritten status object feeding a claimed adaptive feature,
an unprogressed "tracked" lift, or a technique/progression-type label with
no matching engine logic. Only Arms Race and Peachy came through clean on
this axis, and both share a trait the failing plans don't: neither has a
declared status object that something claims to adapt from. This is now
the single most consistent, checkable signal across the wave — worth
explicitly testing for on every remaining specialization-flavored plan in
Waves 4-6 (a declared `xStatus` field that's read by an "adaptive" feature
but never written by any reachable UI path).

Discovered in the process, not specific to any one plan: **T-22
(`liftHistory` never written, breaking `strength_chart` on every plan that
uses it)** — confirmed on 2 independent plans (Workhorse, Gravity Is
Optional), read by `trackedLiftFor()` on at least 5 plans total this wave.
This is very likely the single highest-leverage fix to come out of the
audit so far, and worth flagging to the owner ahead of the post-audit
implementation pass given how many already-shipped plan docs its display
correctness silently affects.

### Wave 4 (in progress)

- Athena: **breaks two of the audit's most persistent patterns at once.**
  First plan with a genuinely wired `xStatus` (`athenaStatus.exerciseLoads`
  — real progression handler, real read-back, real UI surface on its own
  dedicated dashboard), reversing Wave 3's dominant dead-status theme. Also
  the **first plan confirmed structurally immune to T-9** (T-25) —
  confirmed via a deliberately isolated test, not inference — because its
  dedicated `AthenaDashboard` component never touches the shared buggy
  `dashboardViewWeek` cache at all. The one place this cuts the other way:
  its `resetProgram()` gap (T-26) actually matters, unlike the same gap on
  plans with nothing real to lose. Worth checking every remaining plan for
  whether it has a dedicated dashboard component (T-9 immunity candidate)
  and whether its `xStatus`, if any, is genuinely written (Wave-3 pattern
  check).
- Venus Rising: **second T-9-immune plan, same dedicated-dashboard
  mechanism as Athena** — high-confidence via direct source trace (not
  independently re-confirmed live this session; a mid-audit auth/
  device-lock interrupted the live pass, noted in `_audit-status.md`'s
  session note). Its own signature claim has a real gap, quieter than
  Wave 3's dead-feature pattern: "user-selected priorities" (T-27) writes
  real data and works for exactly 1 of its 5 menu options in the default
  mode, not zero — a subtler, harder-to-catch version of the same family.
  Also surfaced a generalizable gap (T-28): `resetProgram()` never touches
  `planPreferences` for any plan, only `programProgress` — worth checking
  on any remaining plan with preference-driven mode/selection state.
- Kali: **T-23 closes out its three-plan run, and closes it on the plan
  that makes it easiest to hit.** Kali has no dedicated progression
  handler, so it falls through to the same `genericDoubleProgression`
  already confirmed broken on Workhorse and Gravity Is Optional — but
  Kali's own onboarding offers `weighted-pull-up` (a true
  `weighted-bodyweight` lift) as one of three selectable pull-anchor
  options, where the other two plans' exposure was to their sole
  progressed lift rather than a menu choice. Also a third confirmed
  T-9-immune plan (same `Dashboard.tsx` early-return-before-`viewWeek`
  pattern as Athena and Venus Rising) and the first plan this audit found
  to genuinely *read* the cross-plan `performanceProfile` data other plans
  write into (`KaliDashboard`'s family-bucketed 1RM-retention display) —
  though that feature turns out structurally unverifiable live through the
  audit's own `test_claude` account, since `WorkoutView.tsx` explicitly
  skips writing `performanceProfile` observations whenever
  `user.isTestAccount === true`. Unusually clean on its own specific
  claims otherwise: "one systemic anchor per session" and "glute and lat
  intensification" (quantified — lats and glutes are the plan's two
  largest volume groups, and the late-block technique upgrades land on
  exactly those muscles) both survive verification. `kaliStatus` (T-2
  family) and `planPreferences` (T-28) both confirmed missing from
  `resetProgram()`, same as Athena/Venus Rising. **Second consecutive
  Wave-4 plan blocked from a live pass by the identical `test_claude`
  device-lock error** first seen on Venus Rising — findings rest on source
  trace, cross-checked against a direct Firestore read that confirms no
  stale prior Kali state on the account (ruling out contamination as an
  alternative explanation). Worth flagging to the owner if the lock
  recurs into House of Iron.
- House of Iron (Wave 4 close-out): **the lock lifted, and the wave closes
  with its narrowest, most surgical defect.** `test_claude` logged in on
  the first attempt this session — no device lock — enabling a full live
  pass (switch-in, mandatory equipment onboarding, free session choice,
  a complete 13-set logged Push A workout, Firestore cross-check). The
  plan's headline mechanic ("fixed-load mastery ladders instead of more
  load") is real and well-built, but `topReps()`'s regex-based rep-target
  parser cannot read the literal string `"AMRAP"`, so the plan's two
  AMRAP-target push-up slots can never generate a progression entry —
  confirmed live by logging an unambiguous top-end AMRAP set and reading
  back an empty `houseOfIronStatus.progression` entry for that exercise,
  while every numeric-range exercise logged in the same session got one.
  Fourth and final Wave-4 plan confirmed T-9-immune via a dedicated
  dashboard (4/4 for the wave) and the first Wave-4 plan structurally
  immune to T-23 rather than merely un-triggered, since it has no
  working-weight-in-kg progression axis at all. `houseOfIronStatus`
  missing from `resetProgram()`'s allowlist reproduces the wave's T-2
  pattern a fourth time, with real consequence since the stale state is a
  substituted exercise variation, not just an inert number.

### Wave 4 summary (4/4 plans done)

Wave 4 closes as the audit's most consistently well-engineered wave so
far. **T-9 immunity via a dedicated dashboard component went a clean 4/4**
(Athena, Venus Rising, Kali, House of Iron) — every Wave-4 plan built its
own dashboard, and every one of them turned out structurally immune to the
shared `dashboardViewWeek` localStorage bug that had reproduced on every
plan in Waves 2 and 3. This is now strong enough evidence to treat
"dedicated dashboard" as a reliable T-9-immunity predictor going into
Wave 5, worth checking first on each remaining plan rather than assuming
the bug by default. **T-23 (total-system-weight never actually used in
progression) reproduced on 1 of 4** (Kali, the third and declared-final
plan sharing that specific gate from Wave 3) and was **structurally
inapplicable on the other 3** (Athena uses top-set/back-off percentages
of a tracked 1RM, not `genericDoubleProgression`; Venus Rising and House
of Iron both progress via mechanisms — user-selected priorities and a
ladder-of-variations system respectively — that never touch
`totalSystemWeightKg` at all). The wave's dominant defect shape was not
Wave 3's "declared-but-unwritten dead status field" pattern (only Venus
Rising's partial-priority gap and House of Iron's AMRAP-parsing gap come
close, and both are narrower and more mechanically specific than a fully
inert feature) — instead, every Wave-4 plan had at least one genuinely
wired, mostly-working system with one precise internal gap: Athena's
`resetProgram()` omission on a load-bearing status field, Venus Rising's
4-of-5 dead priority menu options, Kali's third-and-final T-23
reproduction on its own onboarding-offered exercise, and House of Iron's
single-regex AMRAP blind spot. All four plans also share the same T-2
gap (their own `xStatus` field missing from `resetProgram()`'s allowlist),
making it the wave's one true cross-plan constant alongside T-9 immunity.
The `test_claude` device lock that blocked live passes on Venus Rising and
Kali did not recur on House of Iron, logging in cleanly on the first
attempt — likely transient/session-specific rather than a persistent
account-level block, though Wave 5 should still budget for the
source-trace-plus-Firestore-read fallback in case it returns.

### Wave 4 retro-verification (2026-08-15, same day)

The device lock's root cause was found (a stale `ownerUid` on the
`users/test_claude` doc, pinning it to an old anonymous-auth session) and
fixed by clearing the field. A dedicated retro-verification session logged
into `test_claude` on the first attempt and ran full live passes on both
Venus Rising and Kali, the two plans whose docs had been finished from
source trace. Every source-trace finding held on live testing: Venus
Rising's T-9 immunity (poisoned-`localStorage` test), its
priority-selection write path (genuine Firestore write on save, correct
round-trip on reload), and Upper A's 17-set count all reproduced exactly
as predicted; Kali's T-9 immunity and its T-23 reproduction (a logged
20kg×5 weighted-pull-up set wrote `workingLoads.kali.weighted-pull-up: 20`,
external load only, bodyweight never folded in) also reproduced exactly.
One finding changed on live testing rather than merely being confirmed:
Kali's claim that `performanceProfile` was "structurally untestable via
`test_claude`" (because `WorkoutView.tsx` skips writing observations when
`isTestAccount === true`) turned out to be a misread — `test_claude`'s
access key has `testAccount: false`, so `isTestAccount` is never set on
this account, and the feature was directly observed working live,
including a fresh write and non-blank dashboard percentages from this
session's own logged set. Net effect: source-trace-plus-Firestore-read, as
a fallback method when live access is blocked, held up well here — four
of five headline findings needed no correction at all, and the one that
did was caught and fixed by the live pass exactly as the method is
supposed to allow.

### Wave 5 (in progress — first plan, Iron Clock)

**Wave 5 (conditioning/constrained) opens, and the category change is real: the
first plan out of the gate breaks two of Wave 4's cleanest patterns at once.**

- **T-9 immunity did not carry over.** Iron Clock has no dedicated dashboard
  component (unlike all 4/4 Wave-4 plans) and reproduced T-9 live on the
  first attempt: switching in from Kali showed "Week 7 · Escapement"
  immediately, sourced from a stale `dashboardViewWeek-test_claude`
  localStorage key, despite zero prior `programProgress['iron-clock']`.
  Confirms the working hypothesis from Wave 4's close-out note: T-9 immunity
  tracks with "does this plan have its own dashboard component," not with
  wave/category — Wave 5 plans need to be checked individually, not assumed
  immune or exposed as a block.
- **New, more severe defect class: an entire named progression mechanic, not
  one feature, is dead code.** Iron Clock's whole promise ("the clock, not
  the plate, is the thing you beat") depends on a density ladder
  (`src/features/ironClock/progression.ts`) that is real, well-designed, and
  passes its own verify script — but has no caller anywhere in the running
  app. `ironClockStatus` is declared, read once for a cosmetic notes string,
  and never written. Live-confirmed: a fully logged session (anchor +
  complete density block, both at top-of-range) produced ordinary
  `genericDoubleProgression` working-load writes and zero `ironClockStatus`
  state. This is a step beyond every prior Wave 3-4 dead-feature finding
  (Event Horizon T-10, Overhead Dominion T-14/T-15, Quadfather T-18,
  Cathedral T-20, House of Iron's narrower T-29) — those were each one
  feature on an otherwise-working plan; here it is the plan's entire
  differentiating mechanic, and three of the card's four listed features
  describe it.
- Clean on everything else checked: no `reverse-nordic-curl`, no classic T-4
  duplicated-slot drift, no `type: 'wave'` exposure, structurally immune to
  T-23 (no `weighted-bodyweight` exercises in the pool), T-22 inapplicable
  (no `strength_chart` widget requested). The `resetProgram()` T-2-family gap
  technically reproduces (`ironClockStatus` missing from the allowlist) but
  is currently consequence-free, since the field it would need to clear is
  never populated in the first place — worth fixing in the same pass as the
  write-path fix so the gap doesn't reappear with real stakes once the ladder
  is wired, the way it did on Athena/Kali/House of Iron.
- Login worked on the first attempt this session, no device-lock recurrence.

### REDLINE (Wave 5, second plan)

**The dead-headline-mechanic pattern repeats, on the very next plan, and in a
higher-stakes shape.** REDLINE's fourth card feature — "Recovery check before
every session" — has the identical dead-write-path shape as Iron Clock's T-32
(`redlineStatus.nextRecovery` declared, referenced only in a dead read/echo,
never written anywhere in the app, live-confirmed via a full logged session
producing zero `redlineStatus` state before or after). This makes it 2/2 for
Wave 5 plans having their entire named headline mechanic — not merely a side
feature — completely unwired. The category is different in kind from every
prior dead-feature instance across Waves 3-4 (Event Horizon, Overhead
Dominion, Quadfather, Cathedral, House of Iron's narrower gap): REDLINE's
dead mechanic is a self-regulation *safety valve*, not a progression upgrade
— its entire stated purpose was protecting an athlete who reports being
wrecked, and it silently never does that, every week, for every athlete.
Compounding it, a second and structurally distinct bug (T-35) lives in the
same `preprocessDay` function: the FURNACE-day duration cap's guard
condition treats "no recovery data" as "confirmed not recovered" rather than
requiring `confirmed` first, so it fires unconditionally and will remain a
live bug even after T-34's write path ships unless separately fixed — worth
noting as a new sub-pattern: a dead status field can leave behind not just
an inert code path, but an *active*, wrongly-defaulting one, if a downstream
branch's guard condition assumes the field being undefined means something
specific (here, "not recovered") rather than "no data yet." T-9 also
reproduced live a second consecutive Wave-5 plan (REDLINE has no dedicated
dashboard either), continuing to support "dedicated dashboard component," not
plan category, as the real T-9-immunity predictor. Two for two on Wave 5
opening with source-comment-acknowledged incompleteness, too: REDLINE's own
week-8 "Ashes" phase transform carries an inline comment admitting its
`sets * 0.65` deload math can't reduce 1-set burn slots (T-36) — the first
plan in the audit where the shipped source code itself documents a known,
undisclosed-to-the-athlete limitation, rather than the audit discovering an
undocumented one from scratch. Login required no fresh authentication this
session (continued directly from the prior Iron Clock pass); the live pass
included a deliberate `localStorage` poisoning test to reproduce T-9 cleanly
rather than relying on incidental staleness, and a direct Firestore
before/after comparison rather than inference.

### Lazarus (Wave 5, fifth plan)

**The dead-headline-mechanic streak extends to 3/5 Wave-5 plans, and Lazarus is
the cleanest, most total instance of the pattern found so far.** Unlike Iron
Clock's `ironClockStatus` and REDLINE's `redlineStatus` (each read once,
cosmetically, before being confirmed dead), Lazarus's `lazarusStatus` has
three live call sites (`preprocess`, `calculateWeight`, a Dashboard "Predicted
vs logged" card) and **all three permanently see `undefined`**, because
nothing anywhere in `src/pages/Onboarding.tsx` or `Settings.tsx` ever writes
`breakMonths`, `memoryCurve`, or `underestimated` — a codebase-wide grep finds
zero writers of any kind. Two of the plan's four card features ("Memory Curve
against your old bests," "Accelerates once you prove it") are consequently
unreachable for every athlete, live-confirmed via a fully logged 13-set
session that produced ordinary `workingLoads.lazarus` writes and zero
`lazarusStatus` field in Firestore before or after. A third, unadvertised
function (`injuryReturnGuidance()`) is also dead, with zero callers anywhere
— the plan file's own header comment treats it as a real safety behavior, but
no onboarding step ever asks the injury question that would trigger it.
**Unlike Iron Clock and REDLINE, though, Lazarus has a genuine positive
finding to weigh against the dead mechanic**: the plan's hard week-1/2 volume
cap (`weekSetCap`) is applied from the static phase table using only the week
number, entirely independent of the dead status object, and was live-confirmed
working exactly as designed — a base-3-set systemic-compound slot correctly
rendered as 2 sets at RPE 7 during the actual week-1 session. This makes
Lazarus the wave's second "mixed" result after Atlas, though in a different
shape: Atlas's central mechanic was the strong, well-wired part with side
claims failing; Lazarus's central mechanic (the Memory Curve) is the entirely
dead part, with a secondary, less-advertised claim (the hard cap) being the
one that survives. **T-23 does not reproduce** — the audit's specific check
for this plan, given the newly-identified `WorkoutView.tsx:842` allowlist gap
found on Atlas — because Lazarus's 18-exercise pool contains zero
`weighted-bodyweight` exercises; this is a structural non-exposure, not a
near-miss, directly answering the brief's question with "no." **T-9
reproduced live a fourth time in Wave 5** (after Iron Clock, REDLINE, Atlas;
30-Min Adventure remains the wave's only immune plan), confirmed via a
deliberate `dashboardViewWeek` localStorage-poisoning test — notably, Lazarus
*does* have a plan-specific dashboard card (the "Predicted vs logged" widget),
but because it's a conditional block inside the shared `Dashboard.tsx` rather
than an early-returning dedicated component, it grants none of the T-9
immunity that Athena/Venus Rising/Kali/House of Iron/30-Min Adventure's true
dedicated dashboards do — a useful refinement of the wave's running
T-9-immunity heuristic: having *a* plan-specific widget is not the same as
having a dedicated dashboard *component* that bypasses the buggy shared
render path. `lazarusStatus`/`planPreferences.lazarus` also missing from
`resetProgram()`'s allowlist (T-2/T-28 family), consequence-free like Iron
Clock's instance since nothing populates either field. `programProgress.lazarus`
also missing its `startDate` sub-field, a third instance of the same shape
seen on REDLINE (T-37) and Atlas (T-46). No reverse-nordic-curl, no
`type: 'wave'`, no classic T-4 duplicated-slot drift, no T-22 exposure.
Login required no fresh authentication this session (continued directly from
the prior Atlas pass).

### 30-Min Adventure (Wave 5, third plan)

**The dead-headline-mechanic pattern breaks, decisively, on the third plan —
and so does the T-9 exposure pattern.** Unlike Iron Clock and REDLINE, 30-Min
Adventure has no `xStatus` object layering an unwired auto-regulation or
progression system on top of a templated structure — its entire mechanic
(pick one pair per portal across 5 portals, log 20 sets, commit) *is* the
UI, and a full live pass confirmed every piece of it works end-to-end: a
randomly generated route, a complete 20-set session driven via direct-DOM
logging (including the round-2 "challenge" escalation prompt on every pair),
a real `programProgress['30-minute-adventure']` write with a correctly
populated `startDate` (unlike REDLINE's T-37 gap), and a real `workouts`
subcollection document with correct per-round `setsData`, including correct
omission of the `weight` field for the one bodyweight exercise in the route.
This is 1/3 on Wave 5's opening dead-mechanic streak, not 3/3 — the pattern
turns out to be specific to plans with an unwired status-object safety/
progression layer, not a property of "conditioning/constrained" plans as a
category. **T-9 also breaks its 2/2 Wave-5 exposure streak**: 30-Min
Adventure is the first Wave-5 plan with a genuine dedicated dashboard
component (`AdventureDashboard`, gated by an `isAdventure` early return in
`Dashboard.tsx` before the shared buggy `dashboardViewWeek` path is ever
reached), and live testing confirmed immunity (switching in from a
just-logged REDLINE session produced a clean, correct "0 sessions" Adventure
dashboard with no stale week/phase artifact — though Adventure has no
week/phase concept at all, so this is a stronger and cleaner form of
immunity than a plan that merely resolves the week correctly). Continues to
support "dedicated dashboard component," not plan category or wave, as the
actual T-9-immunity predictor, now 2-for-3 within Wave 5 itself. That said,
the plan is not clean: two of its own specific marketing claims — a
"thirty-minute target" and "never repeats the same pairing twice" — do not
hold up under live arithmetic. A live-generated random route scored ~33
minutes on the first attempt (the underlying `estimatedMinutes` figures are
a flat editorial lookup, not computed from real rest/set/rep arithmetic, and
`randomize()` has no time-budget awareness at all), and the "never repeat"
claim (shown verbatim to athletes in the "Help Me Choose" quiz) has no
enforcing mechanism anywhere in the codebase — it fails even within a single
session, since one exercise (`cable-pull-through`) appears in pairs spanning
two different portals. Neither is a dead-code finding in the Iron Clock/
REDLINE sense — both are real, live mechanisms (a working duration estimate
that just isn't budget-aware; a working random selector that just isn't
history-aware) that were never built to actually guarantee the specific
claim made about them elsewhere in the product. Login required no fresh
authentication this session (continued directly from the prior REDLINE
pass).

### Atlas (Wave 5, fourth plan)

**Neither streak survives cleanly — Atlas is the wave's first genuinely mixed
result, with its actual headline mechanic real and live-confirmed while
separate advertised features fail independently.** Unlike Iron Clock/REDLINE
(headline mechanic entirely dead) and unlike 30-Min Adventure (headline
mechanic entirely real, two side claims soft), Atlas's central mechanic — a
carry-limiter tag on Farmer Carry/Suitcase Carry/Suitcase Hold feeding a
cross-session `nextCarryFor()` swap — is real, well-designed, and was
live-confirmed end-to-end across three sessions this session: tagging two
consecutive carry sets "grip" (Atlas I's Farmer Carry, Atlas II's Suitcase
Carry) caused Atlas III's Suitcase Hold slot to render as Farmer Carry
instead, with a visible "Swapped from last limiter (grip)" note. This is the
most sophisticated piece of cross-session adaptive logic confirmed working
anywhere in Wave 5. But the card's literal claim about that same mechanic
("carries scored as time × load") is false for what the athlete sees —
`carryScore()`/`compareCarries()`/`limiterAdvice()` are fully implemented and
never called anywhere outside their own file, so no kg·min score or
plain-English advisory is ever shown, only the swap's silent consequence.
Two of the plan's other three card features are separately dead on
inspection: the "approved hinge substitution" preference
(`planPreferences.atlas.exerciseSelections.hinge`) has zero UI anywhere in
the app (confirmed live — onboarding's own "NEXT: EXERCISE SELECTION" button
skips straight past a step that doesn't exist), and "optional kettlebell
power work" (one of exactly four card bullets, in both languages) has its
entire `POWER_POOL`/`isPowerWork`/`powerWorkEnabled` stack unreferenced by
any day, hook, or UI control. T-23 reproduces a fourth time (after Workhorse,
Gravity Is Optional, Kali), via a new and more specific root cause than
previously documented: `WorkoutView.tsx:842`'s `totalSystemWeightKg`
computation is gated to a hardcoded three-plan allowlist
(`kali`/`workhorse`/`gravity-is-optional`) that silently excludes any other
plan using a `weighted-bodyweight` exercise, Atlas's `weighted-pull-up`
included — live-confirmed via a logged 15kg set writing the raw belt weight
only. T-9 reproduced live a third time in Wave 5 (after Iron Clock, REDLINE;
30-Min Adventure remains the wave's only immune plan), confirmed via a
deliberate localStorage-poisoning test. The `atlasStatus`/T-2 gap also
reproduces, with real stakes for once: `atlasStatus.carries` is the one
Wave-5 status object confirmed this session to genuinely drive live
behavior, so `resetProgram()` not clearing it means the carry-swap mechanic
can fire from pre-reset data after a reset. Net effect for the wave's
running "verify every specific claim independently" pattern: it holds a
fourth consecutive time, but Atlas is the first plan where doing so surfaces
both a genuine, well-executed positive result and multiple genuine negative
ones on the same plan, rather than a single dominant verdict either way.
Login required no fresh authentication this session (continued directly
from the prior 30-Min Adventure pass).

---

### Skeleton (Wave 5, sixth plan)

**The dead-headline-mechanic streak breaks on its actual core progression system — Skeleton is the wave's second plan (after 30-Min Adventure) whose named mechanic survives contact with the running app.** `skeletonProgression`'s plank time-based progression is registered in `PROGRESSION_HANDLERS` and live-confirmed working exactly as designed this session: a clean, all-sets-hit Week-1 Wednesday plank block (three sets at 35s, target 30s) produced `skeletonStatus.plankTargetSeconds: 40` in Firestore immediately after `COMPLETE WORKOUT`, an exact match to the source's documented `PLANK_INCREMENT = 10` rule. This breaks Iron Clock/REDLINE/Lazarus's three-plan streak of a fully dead headline mechanic. What Skeleton has instead is a narrower, more mundane defect on its *secondary* dashboard claim: the Deficit Push-up PR widget is dead because of a single incorrect string literal (`Dashboard.tsx:109`'s `user.programId === 'skeleton-'`, which can never equal the real id `'skeleton-to-threat'`), not a missing writer or unbuilt onboarding step — live-confirmed stuck at `'--'` across two fully logged sessions with real Deficit Push-up data (15/20/15 reps, then 30/30/30 reps), while the underlying `workouts` documents held correctly-shaped data both times. Cheapest fix of any Wave-5 dead-feature finding: one line, no missing UI required, and it would retroactively work on already-logged history. T-9 reproduces live a fifth time in Wave 5 (Iron Clock, REDLINE, Atlas, Lazarus, now Skeleton; 30-Min Adventure remains the wave's only immune plan) — Skeleton's three dashboard widgets are conditional blocks inside the shared `Dashboard.tsx`, not a dedicated component, confirmed via a deliberate `dashboardViewWeek` localStorage-poisoning test (poisoned to week 9, resolved incorrectly to "Full Body - Week 9" with a recalculated countdown, despite only 2 of 3 weekly sessions done). **T-23 does not reproduce** — structural, like Lazarus: both of Skeleton's candidate exercises (`deficit-push-up`, `inverted-row`) resolve to `weightMode: 'bodyweight'`, not `'weighted-bodyweight'`, so the plan never reaches the `WorkoutView.tsx:842` allowlist gap at all. Genuinely positive and distinct from every other Wave-5 plan checked: `resetProgram()`'s hardcoded status-nulling allowlist is **fully accurate and sufficient for Skeleton** — one of only three plans on that list (with `bench-domination`/`pencilneck-eradication`), confirmed correct both in source and by re-reading the allowlist logic; no T-2/T-28 gap to report. A narrower, session-scoped gap does exist: `programProgress['skeleton-to-threat']` never receives a `startDate` sub-field from ordinary session completion (only `completedSessions` increments) — same shape as REDLINE's T-37, Atlas's T-46, and Lazarus's equivalent — though unlike those plans, Skeleton's `resetProgram()` itself does correctly write `startDate` on an explicit reset. Also surfaced a documentation-only finding: `UserContext.tsx`'s `scheduleMode === 'rolling'` branch carries a comment explicitly naming Skeleton as the reason for its empty-placeholder handling, but Skeleton's onboarding always sets `scheduleMode: 'fixed'`, so the branch is never reached for this plan at all — Skeleton's correct day-of-week behavior (live-confirmed via Monday/Wednesday sessions both landing on the right week/day) comes entirely from the `selectedDays`-remap path's early-return no-op instead, a different mechanism than the comment claims, though the athlete-facing result is correct either way. No reverse-nordic-curl, no `type: 'wave'` exposure (no weight-based progression axis at all — a deliberate design choice, not a gap), no classic T-4 duplicated-slot drift, no T-22 exposure. Login required no fresh authentication this session (continued directly from the prior Lazarus pass).

---

### Apex Predator (Wave 5, seventh and final plan)

**Wave 5 closes on its sharpest possible version of the dead-mechanic pattern: not an unbuilt feature, but a fully-built, well-designed one blocked by a single broken write.** Apex Predator's entire signature mechanic — a six-region movement-access assessment (`ApexDashboard.tsx`) driving which corrective exercises appear via `applyApexAccess`'s `preprocessDay` hook — is, on trace and once seeded, the cleanest-executing adaptive logic found anywhere in the wave: `selectApexEmphasis`'s lowest-two-regions-with-tie-breaks selection, pain-invalidation, and the placeholder-to-real-exercise substitution with level-gated ROM cues all live-confirmed working exactly as designed after an admin-seeded assessment. But the one button a real athlete needs to feed it — "Save Assessment" — fails every time: two independent live attempts through the actual onboarding UI, both with a correctly-filled six-region assessment, both produced "The assessment could not be saved" and left `apexPredatorStatus` absent from Firestore. Writing the *identical* payload via an admin-privileged call succeeded instantly, isolating the failure to the authenticated-user write path specifically (not a data-shape or size-limit problem) — a manual trace of every relevant `firestore.rules` clause against the live-fetched deployed rules text found no rule the payload should fail, so the precise trigger could not be pinned down further from client-side observation alone this session. Net effect: every athlete permanently runs the plan on its untested `['ankle', 'thoracicRotation']` default emphasis for the full 12 weeks, with no way to ever activate the plan's actual premise. **T-9 is structurally immune, live-confirmed** (true dedicated `ApexDashboard` component, poisoned-localStorage test showed no staleness) — sixth Wave-5 plan checked, third confirmed immune (with 30-Min Adventure and, functionally, none of the "widget-not-component" plans). **T-23 does not reproduce, structurally** (zero `weighted-bodyweight` exercises across all 16 distinct ids in the pool) — third consecutive Wave-5 plan (after Lazarus, Skeleton) where this specific check resolves to a clean structural "no." `apexPredatorStatus` also missing from `resetProgram()`'s allowlist (currently consequence-free for the same reason the save is broken) and `programProgress['apex-predator']` never receives an entry at all, even before the first session — the widest instance yet of the REDLINE/Atlas/Lazarus/Skeleton `startDate`-gap family, since here there is no entry whatsoever rather than a missing sub-field. **This closes Wave 5.** Login required no fresh authentication this session (continued directly from the prior Skeleton pass, no device-lock recurrence).

### Wave 5 summary (7/7 plans done)

Wave 5 (conditioning/constrained) is the audit's first wave where a single defect *class* — not a shared engine bug, but an entire headline mechanic silently failing to run — was the dominant finding on a majority of plans, rather than one-off dead side-features layered on an otherwise-working core. **The dead/broken-headline-mechanic pattern hit 4 of 7 plans** (Iron Clock's density ladder, REDLINE's recovery-check safety valve, Lazarus's Memory Curve, Apex Predator's movement-access assessment) — each plan's single most-advertised, most-differentiating feature never actually executes for a real athlete, in three different failure shapes: never wired to any UI at all (Iron Clock, REDLINE), no onboarding step ever collects the input it depends on (Lazarus), and — the sharpest variant, found only on the wave's closing plan — fully built, fully reachable, and still broken by a single failing write (Apex Predator). The other 3 plans broke the streak in three different ways: 30-Min Adventure's core mechanic is genuinely wired end-to-end with only side-claims (timing budget, no-repeat pairing) failing independently; Atlas's core carry-limiter swap is real and live-confirmed with separate advertised features (carry scoring, hinge substitution, kettlebell power work) dead independently; Skeleton's actual core progression (plank time target) works exactly as designed, with only a secondary dashboard widget broken by a one-line string-prefix bug. **T-9 (plan-switch routing) reached its final wave tally at 5 of 7 exposed, 2 of 7 immune** — Iron Clock, REDLINE, Atlas, Lazarus, and Skeleton all reproduced live; only 30-Min Adventure and Apex Predator had true early-returning dedicated dashboard components, both confirmed immune via deliberate localStorage-poisoning tests. This holds the running portfolio-wide pattern exactly: T-9 immunity tracks with "does this plan have its own dashboard component," never with wave or plan category, and Wave 5 — unlike Wave 4's clean 4/4 immunity sweep — shows that conditioning/constrained plans build dedicated dashboards far less consistently than Wave 4's powerbuilding/physique plans did. **T-23 (total-system-weight allowlist gap) reached its final wave tally at 1 of 7 reproduced** (Atlas, via a new and more specific root cause than the three Wave-3/4 plans that found it first — a hardcoded plan-id allowlist rather than a missing computation) and **structurally inapplicable on the other 6** (Iron Clock, REDLINE, 30-Min Adventure, Lazarus, Skeleton, and Apex Predator all have zero `weighted-bodyweight` exercises in their pools) — confirming T-23 is not a conditioning-wave-wide property but a narrow gate specific to plans that happen to use weighted-bodyweight lifts, which most of Wave 5's constrained/equipment-light designs simply don't reach for. Compared to Wave 3's dominant theme (a declared-but-unwritten status field feeding a claimed adaptive feature, 6/8 plans) and Wave 4's dominant theme (T-9 immunity via dedicated dashboards going a clean 4/4, with every plan's one gap being narrow and mechanically specific), Wave 5's signature is starker: on a majority of its plans, the single feature the plan's own marketing card leads with simply does not run, in an escalating series of ways to fail — never built, never reachable, and finally, on the wave's last plan, built and reachable and still broken by one write.

---

### Wave 6 (advanced prototypes + roadmap) — opens with Super Mutant

**Super Mutant is the audit's most severe headline-mechanic failure so far, and it breaks Wave 5's closing pattern rather than extending it.** Apex Predator's T-54 (Wave 5's closing finding) was "one well-built feature, permanently locked behind one broken write, with the rest of the plan working normally." Super Mutant escalates this: the plan's *entire* premise — a reactive, cooldown-gated, RIR-waved, auto-progressing scheduler (`generateNextWorkout` + `superMutant.ts`'s save-time handler) — is real, well-engineered, and correctly wired in source, but **two independent writes fail for a real authenticated athlete**, not one: the onboarding write (blocks entry to the plan entirely) and the save-time progression write (freezes all adaptive state even once an account is admin-seeded past the first failure). Both were live-confirmed via `test_claude`: three onboarding attempts, all `permission-denied`; one fully logged, fully completed 30-set workout whose session log saved correctly but whose `superMutantStatus`/`completedSessions` writes both failed identically, silently swallowed by a try/catch with no visible error to the athlete. Admin-privileged writes of the identical payloads succeeded instantly both times, matching T-54's isolation method exactly (payload is well-formed; the authenticated-user write path is the problem) — but unlike T-54, a full rules-clause trace found nothing either write should violate, and the failure touched a portfolio-wide field (`completedSessions`) as well as the plan-local one, leaving open whether this is Super-Mutant-specific or a broader `test_claude` account/session-state issue given the account now carries state for roughly 30 plans. Practical effect, confirmed by direct computation from the frozen state: a real athlete is stuck training the identical 13-exercise, 5-of-12-muscle session forever, never reaching 6 of the plan's 12 trained muscle groups even once.

**Wave 5's carried-forward patterns had a mixed first test.** T-9 (plan-switch routing): Super Mutant's dashboard block is an inline conditional in shared `Dashboard.tsx`, the same shape that was *not* immune on Skeleton/Lazarus — but traced (not live-repoisoned this session, time budget) as genuinely immune anyway, because unlike those two plans it derives its numbers directly from plan-local `completedWorkouts`/`weeklySessionDates` rather than from the shared `dashboardViewWeek` localStorage mechanism the vulnerable blocks read. This sharpens the running rule: **immunity tracks with what state a block reads, not merely whether it is a literal separate component** — worth applying this more precise test on Neural Overload/Immaculate/Oracle/Project Chimera rather than the coarser "dedicated component vs. inline block" heuristic used through Wave 5. T-23 (total-system-weight allowlist): structurally inapplicable again (zero `weighted-bodyweight` exercises), fifth consecutive plan where this resolves to a clean structural no. T-22 (`liftHistory`/`strength_chart`): does not apply (no such widget requested). The plan also has two of its own dead-code shapes distinct from T-54's pattern: an unreachable "pool mode" exercise-rotation feature (fully wired, zero UI entry point) and a `weakPointMuscle` field with no writer anywhere — both smaller-scale, plan-local echoes of the "declared, wired, unreachable" shape rather than new instances of a shared bug. `superMutantStatus` is also missing from `resetProgram()`'s allowlist, same T-2 family as Athena/Kali/House of Iron/Apex Predator, currently low-consequence for the same reason the write is broken in the first place.

### Neural Overload (Wave 6, second plan)

**Headline result first, since this was flagged as the audit's single highest-priority pending check: T-3 does NOT reproduce.** Neural Overload was the specific candidate carried since the start of Wave 2 as the one unchecked second consumer of `wavePercentForSet`/`type: 'wave'` — the mechanism King of the Squat's T-3 lives in. Direct source read plus a direct function call against `NEURAL_OVERLOAD_CONFIG.hooks.calculateWeight` with a synthetic user across all 9 weeks confirms the plan never references `type: 'wave'` at all: its "1-6" Poliquin loading scheme (the plan's own use of the word "wave" is informal, describing the single/six/single/six *set structure*, not the engine's wave progression type) is built entirely on `type: 'percentage'` slots whose `percent` field is a function of `ProgressionContext` — a shape `buildWeightCalculator` already resolves correctly. **This closes the audit's longest-open T-3 question: the portfolio-wide `type: 'wave'` exposure count remains 1 of all plans checked so far (King of the Squat only).**

**But a closely-adjacent, genuinely new bug was found and live-confirmed in its place.** The plan's own `discharge()` helper (`neuralOverload.ts`'s `oneSixWave()`) branches only on `ctx.week >= 4 && ctx.week <= 6` — true for the middle "Discharge" phase, false for both the first ("Charge," weeks 1-3) and third ("Overload," weeks 7-9) phases alike. Because the conditional only distinguishes one phase from "everything else" rather than all three, **weeks 1-3 and weeks 7-9 get byte-identical 1-6 percentages** (90%/75%/92.5%/77.5% of the relevant 1RM in both). Confirmed by direct function call (Squat Neural: 180/150/185/155kg on weeks 1/2/3/7/8/9 alike, dropping only in weeks 4-6) and then live-confirmed exactly on the real `test_claude` account after an admin seed (Week 9 Bench Neural rendered 90/75/92.5/77.5kg on a 100kg paused-bench base — precisely the Week-1-3 values). The plan's "Overload" phase — whose own file comment frames it as keeping "the neural work" the priority — in practice only trims accessory sets; the headline 1-6 lifts never exceed their week-1 numbers for the program's entire back third. A materially different failure shape from every prior "wave" finding in the audit: a real, correctly-invoked function with a two-state-instead-of-three-state conditional, not a miscalculation or a decorative label.

**The onboarding write-path failure reproduces a third time this wave, now across a third structurally distinct write shape.** Submitting Neural Overload's real "Starting Numbers" calibration form (which has no bespoke status object at all — just `stats.pausedBench` + `switchProgram`) produced the identical `permission-denied` "Registration failed" error seen on Apex Predator's assessment save (T-54) and Super Mutant's onboarding/save-time writes (T-57/T-58), confirmed via Firestore (`programId` and `stats.pausedBench` both unchanged after the attempt) and resolved via an admin-privileged write of the identical payload succeeding instantly. Three independent plans, three unrelated write call sites (an assessment save, a plan-switch-with-status-object, a plain calibration write with zero plan-local state), all failing identically this wave — this is now strong enough evidence to treat as a `test_claude` account/session-state condition rather than a per-plan coincidence, and worth flagging to the owner as a priority investigation (server-side Firestore audit logs, since client-side rules tracing has failed to pin the exact clause three times running).

**Wave 5/6 patterns otherwise:** T-9 reproduces live (poisoned-localStorage test, no dedicated dashboard or even a conditional block for this plan anywhere in `Dashboard.tsx`). T-22 reproduces in a new shape: `strength_chart` is requested but `trackedLiftFor()` has no `neural-overload` case, falling to a generic "Paused bench" default that reads the already-confirmed-dead `benchHistory` field — a compound gap (missing case + already-broken underlying field). T-23 reproduces via the same `WorkoutView.tsx:842` hardcoded-allowlist mechanism as Atlas's T-43, a fourth instance (`weighted-chin-up` in Chin Neural). No `xStatus` object exists at all, so T-2/T-28 structurally does not apply — same "nothing to omit" shape as Monolith/Purgatorio. No `reverse-nordic-curl` exposure. No classic T-4 duplicated-slot drift (Chin Neural's four same-named `weighted-chin-up` rows resolve correctly via exercise-id/slot-index matching, confirmed live with four distinct rendered prescriptions).

### Immaculate (Wave 6, third plan)

**Worst-scoped instance of the "declared-but-mostly-unreachable feature" pattern found in the whole audit, and a new, more dangerous variant of the write-path failure.** Immaculate's entire named concept — find the athlete's lagging Poliquin-ratio structure and give it a third weekly exposure — turns out to be reachable for exactly 1 of its 6 named relationships (T-67/T-68): `preprocess()`'s day-of-week guard checks `dayOfWeek 2/4` instead of the correct `1/4` (both upper days), so Upper Structural A's four ratio exercises (chin-up 81%, incline bench 83%, reverse curl 30%, external rotation 9%) are never evaluated at all; separately, `ezbar-preacher-curl` has no `strengthRef` in the library despite the plan's own inline note citing a 46% target, so even the one correctly-checked day's second relationship can't fire either. Live-confirmed two ways: a deliberately catastrophic chin-up/external-rotation underload (well past the 90%-of-target threshold) produced zero bonus sets on a real logged Upper Structural A session, and a full 10-week computed dump of the plan's own base program data shows Assessment and Correction phases are byte-identical in every set count on every day — the only phase transform that ever changes anything is Re-Test's uniform trim. Different failure shape from every prior dead-feature instance this wave (Iron Clock's/REDLINE's/Lazarus's mechanics were *fully* dead) — here the mechanism genuinely runs and genuinely works, just for one narrow case, which would make it invisible to spot-testing that happens to land on that one case.

**T-9 reproduced with an unusually clean isolation this time**: no deliberate `localStorage` poisoning was needed — switching from Neural Overload (last viewed week 9) directly into a freshly-seeded, zero-progress Immaculate showed "WEEK 9" immediately, and a direct `localStorage.getItem()` read confirmed the stale key was the entire cause, with no other explanation available.

**The write-path failure escalated in scope and, for the first time this wave, blocked login itself.** Prior Wave 6 instances (Apex Predator T-54, Super Mutant T-57/58, Neural Overload T-64) each hit exactly one failing write call site per session, always after a successful login. This session's `test_claude` document had **no `ownerUid` field at all** (not a stale value pointing at a different session — simply absent), and the client-side self-claim `updateDoc` that `checkCodeword()` runs specifically to handle that case on login **also** failed `permission-denied`, surfacing as a raw, untranslated Firebase error rather than the friendlier claimed-keyword message and blocking entry to the app entirely. After an admin write unblocked login, the subsequent `switchProgram` write failed too; after that was also admin-unblocked, the workout-completion write failed a third time in the same session — though, matching Super Mutant's documented split, the `workouts/{id}` session log itself saved correctly every time (all 14 sets, correct weights/reps); only the parallel user-document write (`workingLoads`, `completedSessions`, progression payload) failed. Four structurally distinct write call sites now confirmed failing identically across three plans this wave, with admin writes of the identical payload succeeding instantly on every one of them — this is very likely one shared, session-scoped condition rather than four-to-six coincidentally-identical plan-local bugs, and probably the single highest-priority infra item to flag to the owner once the audit wave closes.

### Oracle (Wave 6, fourth plan)

**Same `ownerUid`-absent login lock as Immaculate, hit again — cleared moments before this session started per the owner's own note in the launch brief, but the account had already regressed to owner-less by the time login was attempted.** Isolated with the now-standard method (admin read confirmed `ownerUid` genuinely absent, not stale; an admin-privileged write setting it to this session's own anonymous auth uid, read out of `firebaseLocalStorageDb`, succeeded instantly and unblocked login on the very next attempt). `switchProgram` into Oracle also failed `permission-denied` and needed a second admin write to unblock — both isolations matched Immaculate's shape exactly.

**The workout-completion write escalated from a partial split to a total loss.** Every prior instance this wave (Super Mutant, Immaculate) showed the `workouts/{id}` session log saving correctly while only the parallel user-document write (`oracleStatus`/`workingLoads`/`completedSessions`) failed. This session, after a real Week 9 session was logged live through the UI (two sets of Flat Barbell Bench Press) and "Complete Workout" was pressed, a direct Firestore query of `users/test_claude/workouts` returned **zero** matching documents for the session — the session log itself did not persist this time, in addition to `oracleStatus.exposures` staying completely absent and `completedSessions`/`programProgress.oracle.completedSessions` remaining unchanged. Seventh structurally distinct failing write call site this wave (after Apex Predator T-54, Super Mutant T-57/58, Neural Overload T-64, Immaculate's three sites), and the first to show every write in a session's flow fail together rather than split.

**T-9 reproduces with the same clean isolation as Immaculate** — no dedicated dashboard component for Oracle in `Dashboard.tsx`; switching from a Week-9 Immaculate session into a freshly-seeded, zero-progress Oracle immediately showed "WEEK 9," and `localStorage.getItem('dashboardViewWeek-test_claude')` confirmed the stale value directly.

**T-22/T-23 both structurally do not apply to Oracle** — `dashboardWidgets` requests no `strength_chart`, and a computed check of all 24 exercise slots found zero `weighted-bodyweight` movements. First plan this wave to sidestep both by construction rather than by a wiring gap.

**Headline finding is a new shape for this wave: not a wiring bug in the plan's own mechanic, but half of the plan's *stated concept* never being called from anywhere.** Oracle's prior-only prediction engine (`predictFromPriors`) is genuinely well-built and live-confirmed correct (a fresh session with no exposures rendered the exact "low confidence, calibrate" copy the code predicts). But the plan's second stated promise — scoring predictions against outcomes ("shows you how close it got") — has a fully-built module (`predictionError`/`accuracyBand`/`accuracyTrend`) that is never called from anywhere outside the file that defines it, and an admin AI-refinement toggle (`refineWithModel`/`predict(useModel)`) that is equally never invoked by the plan's own `preprocessDay` hook, despite the admin panel's copy implying it does something when switched on. Worth watching on Project Chimera for a similar "half the concept is real, half was never wired to anything" shape, since this is now two data points (Oracle here; Event Horizon's fully-dead `costAwareSwaps.ts` in Wave 2 was the closest prior analogue, though that was 0% wired rather than half).

T-22 reproduces with an unusual twist: `trackedLiftFor()`'s `immaculate-restructure` case is genuinely well-built (a real "Lagging lift" title, correct calibration-lift start value) — the only gap is the portfolio-wide unwritten `liftHistory` field, not this plan's own wiring. T-23 reproduces a sixth time (`weighted-chin-up`, same `WorkoutView.tsx:842` allowlist gate as Workhorse/Gravity Is Optional/Kali/Atlas/Neural Overload). No `xStatus` object exists for this plan at all, so T-2/T-28 structurally do not apply (same shape as Monolith/Purgatorio/Neural Overload). No `reverse-nordic-curl`, no `type: 'wave'`/T-3 exposure, no classic T-4 duplicated-branch drift.

### Project Chimera (Wave 6, fifth and final plan — closes the wave)

**Worst dead-headline-mechanic case in the audit, and it closes Wave 6 on the theme the wave opened with.** Project Chimera's entire named concept — after each 4-week block, propose moving up to two weekly sets per training quality toward whatever the athlete responded to best, gated on real comparable-exposure evidence — is fully authored in `src/features/projectChimera/mutation.ts` (`proposeMutation`/`applyMutation`/`phenotype`, evidence floors, reallocation caps, per-component confirmation, a hard minimum-sets floor) but has **zero callers anywhere outside that file.** `projectChimeraStatus` (which the plan's own `preprocess()` reads for `status.allocation`/`status.acceptedExerciseChanges`) is read exactly once and written nowhere — a codebase-wide check found zero references to "chimera" in any casing in either `Settings.tsx` or `Onboarding.tsx`, the only two files with plan-specific write logic anywhere in the app. Unlike every prior "declared, wired, unreachable" instance this audit has found (Event Horizon's region-swap engine, Cathedral's arches, Quadfather's knee-feedback, Super Mutant's pool mode, and even Oracle's own half-dead scoring engine one plan earlier this wave), there is no partial UI stub, no settings screen reading a status field that never gets populated correctly, nothing at all — the gap is total. Every athlete runs the identical unmutated base 16-week programme regardless of what they log. The plan's block-level rep/RPE periodization (Blocks I-IV) is real and live-confirmed correctly wired, giving the plan *some* real structure across its length, but that structure is fixed and pre-authored, not the adaptive mechanic the plan is named and marketed for.

**The `ownerUid`/write-path saga recurred a final time this wave, in the more common partial-split shape.** Login succeeded on the first attempt with no lock (`ownerUid` matched this session cleanly) — the account was already switched into Project Chimera from an unrelated prior session. A real Week 9 Lower A session was logged live (Barbell Squat sets) and completed through the UI with no visible error; Firestore confirmed the `workouts/{id}` session log itself saved correctly, but `programProgress['project-chimera'].completedSessions`, the portfolio-wide `completedSessions` counter, and `workingLoads['project-chimera']` all failed to persist, with the user document's own `updateTime` unchanged before vs. after the session. This is the **eighth structurally distinct failing write call site this wave** (after Apex Predator T-54, Super Mutant T-57/58, Neural Overload T-64, Immaculate's three sites, Oracle's total-loss instance), and it closes the wave with the condition still unresolved — never explained by a rules-clause trace, never once reproduced on an admin-privileged write of the identical payload.

**T-9 reproduced a fourth time this wave** with the now-standard clean isolation (no dedicated dashboard component; a stale `dashboardViewWeek-test_claude` localStorage key leaked "9" from the immediately-prior Oracle testing session into a freshly-switched, zero-progress Project Chimera). T-22/T-23 both structurally do not apply (no `strength_chart` widget requested; zero `weighted-bodyweight` exercises across all 21 distinct exercise ids). No `reverse-nordic-curl`, no `type: 'wave'`/T-3 exposure, no classic T-4 duplicated-slot drift (shared exercises across days all resolve through the same slot-builder function). `projectChimeraStatus` is missing from `resetProgram()`'s allowlist, same T-2 family as every other Wave 6 plan, currently consequence-free for the same reason the whole mechanic is dead.

**This closes Wave 6.** Final tally: 5/5 plans with a non-functional or partially non-functional headline mechanic; T-9 reproduced on 4/5 plans (Super Mutant traced immune for a plan-local structural reason); the shared write-path condition reproduced in some form on all 5 plans, escalating in severity across the wave (two-site failure → three-site failure blocking login → total loss on a completed session → partial-split closing the wave) and remaining unresolved at wave's end. The Wave 6 roadmap deliverable (a plan for Project Chimera/Ghost in the Machine/Oracle/possibly Immaculate+Apex, per the audit's original §1 item 5) was not produced this wave and is carried forward as an outstanding item, not attempted as part of Project Chimera's own audit task.

### Wave 6 roadmap deliverable (produced separately, after Wave 6 closed)

The deferred Wave 6 roadmap item was written as its own document,
`_wave6-advanced-plans-roadmap.md`, covering Project Chimera, Oracle,
Immaculate (Re)Structure, and Apex Predator (Ghost in the Machine
explicitly excluded — it gets its own Wave 7 doc, since it has no shipped
source to roadmap against). Per-plan breakdown of what's broken / what a
fix would take / dependencies / effort tier, plus a recommended portfolio-
wide fix order (root-cause the shared write-path bug first via Apex
Predator's cleanest isolation case; Immaculate's two-line fix next; Oracle's
AI-config wiring third; then Apex's remaining T-2/T-3 gaps; Oracle's
predictions-ledger/UI; Project Chimera's full reallocation engine last,
gated on an owner design decision). Open design questions were listed in
that document rather than logged as new decision-log ids here, per this
same file's own convention (§0b/AUDIT-3: running patterns, no owner votes,
during the audit).

### Wave 7 / Ghost in the Machine (doc-only, closes the full Wave 0-7 review order)

**An existing spec fragment was found — this was not specified from
scratch.** `docs/archive/source-planning/next-expansion-concepts.md`
carries the original pre-audit pitch (camera-based rep-quality/fatigue
analysis feeding autoregulation, deliberately sequenced last of 12 concepts
pending proof that reliable camera-vision signal extraction was possible at
all), and `docs/roadmap/master-expansion.md` §6 records what actually
shipped against it: a video-lift-advice feature (`aiAnalyzeLift`/Gemini,
Squat/Bench/Deadlift, advisory-only, zero prescription impact) surfaced
inside **Apex Predator's** optional assessment step, not as a standalone
Ghost plan — confirmed by grep across `src/` for `ghost`/`ghostInTheMachine`
turning up nothing but unrelated shadcn `variant="ghost"` button styling and
a `Ghost` badge icon literal. No `src/data/plans/ghostInTheMachine.ts` or
equivalent exists anywhere in the repo.

The Wave 7 document (`ghost-in-the-machine.md`) assesses feasibility
against this audit's own accumulated findings rather than the pitch in
isolation. Headline warning: the pitch's proposed GHOST-MODE autoregulation
engine is structurally the same shape of feature as Project Chimera's dead
reallocation engine and Oracle's dead scoring half — a piece of adaptive
logic that only matters if genuinely wired to a real UI write/read path —
and any future build should design against that pattern (5/5 hit rate
across Wave 6) explicitly from day one, alongside the still-unresolved
shared write-path bug this same document's §2.2 flags as a second,
independent blocker. A phased spec outline (SIGNAL → CALIBRATE → OVERRIDE →
GHOST MODE, inherited from the original pitch with audit-informed
sequencing layered on) and five open product/design questions for the owner
are recorded in that document, not logged as new decision-log ids here, per
this same convention used for the Wave 6 roadmap above.

**This closes the full Wave 0-7 per-plan review order** (`_audit-status.md`
§3) — all 36 shipped plans plus Ghost in the Machine have now been
reviewed. The end-of-audit cross-plan synthesis report (§1 item 6, deferred
per AUDIT-4/AUDIT-7 until all waves were done) and the post-audit
implementation pass (PROC-1) remain outstanding; neither is addressed by
this entry or by `ghost-in-the-machine.md`.

---

## TECHNICAL — logged for the post-audit pass, not voted on now

These ship as bugfixes. Flag only if you want one *not* fixed.

| Id | Item |
|---|---|
| T-1 | Plan-switch / next-session resolver (Ritual, Bench, King, likely more) |
| T-2 | `resetProgram()` status-nulling allowlist → all `xStatus` fields |
| T-3 | `wavePercentForSet` ignores phase intensity (King; check other `type: 'wave'`) |
| T-4 | Bench Domination Weighted Pull-ups `sets: 0` on two of three copies |
| T-5 | `handlePainGlorySubmit` passes status into the wrong `registerUser` slot |
| T-6 | Claimed-keyword onboarding walks the full form then `permission-denied` |
| T-7 | Hard navigation drops session; non-focusable plan cards (app-wide a11y) |
| T-8 | Verify scripts must expand runtime-substituted names (Trinary variations) |
| T-9 | `dashboardViewWeek-${user.id}` localStorage key has no `programId` component (Dashboard.tsx:79, :187-189) — cleanest-root-cause version of T-1, found on Monolith; reproduced identically on Purgatorio and Event Horizon (3/3 Wave-2 plans so far) |
| T-10 | Event Horizon's headline "region swap" feature (`src/features/eventHorizon/costAwareSwaps.ts`) has zero UI entry points anywhere in `src/**/*.tsx` — engine is complete and well-designed, `eventHorizonStatus` is never read/written outside the engine's own `preprocessDay` hook. Add `eventHorizonStatus` to the T-2 allowlist fix once a UI exists. |
| T-11 | Tenfold: `tenfoldStatus` (a single `collapsePending` boolean) missing from the T-2 allowlist — narrow blast radius but same pattern |
| T-12 | Pencilneck: `pencilneckStatus` is shallow-overwritten (not merged) at two write sites (`historyEntries.ts` completion, `Dashboard.tsx` Start-Cycle-2) — declared 4-field type never guaranteed to hold all fields at once. New bug class, not yet seen elsewhere. |
| T-13 | Pencilneck: `resetProgram()` nulls `pencilneckStatus` correctly but never touches `pencilneckBenchHistory`, which still feeds `getExerciseAdvice`'s automated weight suggestions after a reset |
| T-14 | Overhead Dominion: a phase transform sets `technique: {kind:'wave'}` without ever changing `progression.type` from `'double'` — the weight calculator branches on `progression.type`, not `technique.kind`, so the wave ladder is never invoked; only effect is a decorative "Waves: 2x 5/3/2" badge. Worse than T-3 (King of the Squat) — there the wave math was at least reached and miscalculated; here it's never invoked at all. Check any other plan using `technique: {kind:'wave'}` for the same gap. |
| T-15 | Overhead Dominion: `splitDelts` front/side/rear volume tracking (`volumeAnalysis.ts`) is real and correct but its only consumer app-wide is the admin-only `AnalysisTab.tsx` — second confirmed instance of Event Horizon's T-10 dead-feature pattern (well-built backend, zero athlete-facing UI) |
| T-16 | (Not a bug — positive contrast case) Arms Race's myo-reps technique proves T-14's failure mode isn't inherent to non-`double`/`wave` techniques: it's real, live-rendering actual "MINI 1"/"MINI 2" set rows. The difference from Overhead Dominion: myo-reps only needed a `technique` change to work (no `progression.type` dependency), while T-14's wave technique specifically requires a matching `progression.type: 'wave'` that Overhead Dominion never added. |
| T-17 | Hamstring Foundry: card claims "three functions, all of which must progress" but only 1 of 3 (`barbell-romanian-deadlift`) has a `progression` field or dashboard tracking (`trackedLiftFor` → "RDL" only); the other two run as unprogressed, untracked accessories. A plan-local instance of the "one tracked lift, others generic" pattern, this time contradicting an explicit card claim rather than being merely unstated. |
| T-18 | Quadfather: "confirmed range of motion" and "knee-feedback swaps" are both dead features (third confirmed instance of the Event Horizon/Overhead Dominion pattern) — well-built backends (`quadfatherStatus.rom`/`kneeFeedback`, `proposeKneeSwap()`), zero UI entry points anywhere in `src/**/*.tsx`. Bonus: the knee-swap `preprocess()` function's own doc comment ("nothing is swapped without confirmation") is contradicted by its own `autoSwaps` branch, which swaps without confirmation after 2 unaccepted strained reports — independent of the dead-UI finding. `quadfatherStatus` also missing from the T-2 allowlist (currently inert). |
| T-19 | `reverse-nordic-curl` misattribution reproduces a third time (Bench Domination, now Quadfather) — quantified for the first time: understates Quadfather's own quad total by ~10.6% (75.5→83.5 corrected) and overstates its hamstring total by 20% (20.0→16.0 corrected). Highest-stakes case yet since it's the plan's own specialization muscle being undercounted. |
| T-20 | Cathedral: `cathedralStatus` (arches/limitingFatigue/comboMachineRole) is read in `Dashboard.tsx` and `arches.ts` but never written anywhere in the codebase — no `Onboarding.tsx`/`Settings.tsx` reference to `cathedral` at all. Cleanest dead-feature case in the audit: unlike Event Horizon/Quadfather (backend engine runs on unreachable input), here the entire `preprocessDay` consuming path can only hit its no-op branch, since nothing ever populates the state it reads. Also missing from the T-2 allowlist (currently inert). |
| T-21 | Peachy: no bilateral loaded hip thrust anywhere in the 4-day split — gluteMaxLower (24.25 sets/wk) outweighs gluteMaxUpper (11.0) roughly 2.2:1; only short-length glute driver is a 3-set unilateral machine hip thrust on the week's last training day. Not a bug — a real design gap against the "science-based" card framing, given the attribution map's own `hip-thrust` row is used on 4 other portfolio plans but absent here. |
| T-22 | **New shared-bug candidate, likely portfolio-wide.** `liftHistory` (feeds the `strength_chart` dashboard widget on Overhead Dominion, Hamstring Foundry, Cathedral, Quadfather, Workhorse, and likely others) is declared and read in `trackedLift.ts` but has no write path anywhere in the codebase. Confirmed live on Workhorse: a fully completed, logged session left `workingLoads` correctly updated but `liftHistory` entirely absent from the user document. Recommend checking every remaining plan with a `strength_chart` widget — this is plausibly a single fix with portfolio-wide impact, the highest-leverage finding of Wave 3 so far. |
| T-23 | Workhorse: "progressed on total system weight" is false for the number that actually drives progression — `totalSystemWeightKg` (bodyweight+external) is computed per set but `genericDoubleProgression` reads `sets[0].weight` (external only); confirmed live in Firestore, `workingLoads.workhorse['weighted-chin-up']` stored the raw belt weight. The dashboard's "TSW" card is also mislabeled — shows `bodyweightKg` alone despite a subtitle promising belt+bodyweight. **Confirmed reproducing on Gravity Is Optional** (second independent plan, same root cause); Kali shares the same gate and is the remaining unchecked plan. |
| T-24 | Gravity Is Optional: `technique:{kind:'total-reps'}` (the "beat your set count, not your reps" claim) only feeds a badge label (`techniqueLabel()`); `maxSets` never expands set rows, nothing tracks cumulative reps toward `targetReps`, nothing compares to a prior session's set count. Confirmed live — fixed 6-row rendering at week 1 regardless of the 40-rep target. Same decorative-claim family as T-14, this time on a `technique` kind rather than a progression type. |
| T-25 | (Positive pattern, not a bug) Athena is structurally immune to T-9 because its dedicated `AthenaDashboard` component reads `programProgress.athena` directly and never enters `Dashboard.tsx`'s shared widget-render path where the buggy `dashboardViewWeek` cache lives. Confirmed via isolated test (forced Monolith to week 9, then switched into Athena, which correctly showed week 1). Any plan with its own dedicated dashboard component gets this protection for free — worth checking which other plans have one. |
| T-26 | Athena: `athenaStatus` missing from the T-2 `resetProgram()` allowlist — but unlike prior T-2 findings on dead-status plans, this one has real consequence, since `exerciseLoads` genuinely drives prescribed weight via a real, wired progression handler. |
| T-27 | Venus Rising: "user-selected priorities" is real and writes data, but in the default 4-day mode only 1 of its 5 menu options (`leg-extension`) can ever actually trigger the sets-bump — the other 4 are either always the wrong base set count to qualify, or (`side-glute-medius-hip-thrust`) absent from the 4-day tree entirely. Also only active weeks 5-8 (8 of 12 weeks inert), undisclosed on the card. |
| T-28 | `resetProgram()` never touches `planPreferences` for any plan (generalizes beyond Venus) — mode-switch/priority-selection state (and any stale `pendingScheduleChange`) survives a reset untouched, only `programProgress` gets cleared. Lower severity than T-26 on plans where nothing in `planPreferences` drives load, but worth checking on Kali/House of Iron if either uses similar preference-driven state. |
| T-29 | House of Iron: `houseOfIronProgression`'s `topReps()` (`src/features/workout/progression/houseOfIron.ts:23-26`) parses a target rep string with `/\d+/g` — returns `null` for the literal string `"AMRAP"`, which is the target on `push-up` and `close-grip-push-up` (the plan's only two AMRAP slots). `null` upper bound short-circuits the per-exercise loop before `cleanTop`/`progression[canonicalId]` are ever touched, so those two exercises can never generate a `pendingProgressions` offer regardless of performance. Live-confirmed: logged 0kg×25 push-up (2 sets) produced no `houseOfIronStatus.progression['push-up']` entry, while every numeric-range exercise logged in the same session (`goblet-heel-elevated-squat`, `bulgarian-split-squat`, `single-arm-floor-press`, `single-arm-overhead-triceps-extension`, `suitcase-hold`) got one after a single clean-top set. `HOUSE_LADDERS['push-up']`'s 7-stage authored ladder is fully dead code as a result. |
| T-30 | House of Iron: `houseOfIronStatus` missing from `resetProgram()`'s allowlist (`UserContext.tsx:467-470`) — same T-2 family as Athena's T-26 and Kali's equivalent gap, closing Wave 4 at 4/4 plans sharing this pattern. Real consequence here too: `progression`/`pendingProgressions` drive an actual substituted exercise variation (via `applyHouseProgressions`), not just a displayed number, so a "Reset Current Progress" that doesn't clear it leaves the athlete on an already-earned harder variation despite the button's Week-1-Day-1 copy. |
| T-32 | Iron Clock: the entire density-ladder progression system (`src/features/ironClock/progression.ts` — `advanceDensityBlock`, `compareBlocks`, `blockDensity`, `restWarning`, `startingState`) has zero callers anywhere in `src/` outside its own file and `scripts/verify-iron-clock.ts`. `ironClockStatus` is declared in `types.ts`, read exactly once (`ironClock.ts`'s `applyLadder`, purely to append a cosmetic notes string), and **never written by any code path**. Every exercise — anchor and density block alike — falls through to `genericDoubleProgression` instead, which bumps `workingLoads.iron-clock[id]` by a flat +2.5kg on a top-of-range set, ignoring rounds/duration/pairing/quality entirely. Live-confirmed: a fully logged Week-7 session (3/3 anchor sets + 5/5 density rounds, all at or above target) produced ordinary `workingLoads` writes and zero `ironClockStatus` field in Firestore. The plan's entire named mechanic ("the clock, not the plate") does not run. |
| T-33 | Iron Clock: T-9 reproduces live, first Wave-5 plan, breaking Wave 4's 4/4 dedicated-dashboard-immunity streak — no dedicated dashboard component. Confirmed live: switch-in from Kali showed "Week 7 · Escapement" sourced from a stale `dashboardViewWeek-test_claude` localStorage key despite zero prior `programProgress['iron-clock']`; resolved correctly after logging a real session. |
| T-31 | House of Iron: `exerciseImplementIds` (written every session by `houseOfIronProgression`, matching logged weight against the athlete's declared equipment inventory) has no reader anywhere in the codebase — a "written but never read" subvariant of the Event Horizon/Cathedral/Quadfather dead-feature family, distinct from those plans' "declared but unwritten" shape. |
| T-34 | REDLINE: the plan's fourth card feature, "Recovery check before every session," has no write path anywhere in the app — same shape as Iron Clock's T-32 one plan earlier in Wave 5. `redlineStatus.nextRecovery` is declared, read only once (`WorkoutView.tsx:857`, to echo the value into a `historyEntry` field, itself a read of the never-populated value), and never written by any onboarding screen, pre/post-workout prompt, or settings control. Because `redline.ts`'s `preprocessDay` (lines 26-33) gates its entire recovery-based volume-cut/finisher-skip auto-regulation system on `recovery?.confirmed`, and `recovery` is always `undefined`, that system is structurally unreachable. Live-confirmed: a fully logged Week-7 PRESSURE session (15 sets, both burn pairs, both finishers, one BURN block-timer start/finish cycle) produced ordinary `workingLoads.redline` writes and zero `redlineStatus` field in Firestore before or after. Unlike T-32 (a dead progression upgrade), this is a dead *safety* mechanic — the plan never protects an athlete who reports being wrecked, because it has no way to find out. |
| T-35 | REDLINE: independent of T-34, `preprocessDay`'s FURNACE-day branch (`redline.ts:29-31`) guards on `recovery?.response !== 'recovered'` alone, not also on `recovery?.confirmed` (unlike the general volume-cut branch immediately below it, which correctly checks `confirmed` first). Since `recovery` is always `undefined` (T-34), this evaluates true unconditionally on every FURNACE session for every athlete, capping finisher `durationSeconds` to `min(existing, 360)` regardless of week. Confirmed analytically via a direct call to `REDLINE_CONFIG.hooks.preprocessDay` against a synthetic week-7 FURNACE day carrying the phase-correct 480s duration: output capped to 360s. Will persist as a live bug even after T-34's write path ships unless this guard is separately corrected to also require `confirmed`. |
| T-36 | REDLINE: the Ashes (week-8) phase transform's own inline source comment (`redline.ts:21-22`) acknowledges that `Math.round(sets*0.65)` cannot reduce a 1-set burn slot (`Math.round(1*0.65)=1`, floored by `Math.max(1,...)`) — so the plan's week-8 taper only actually reduces 2-set A/B burn slots; every 1-set arm/calf/core slot (`hammer-curl`, `cable-triceps-extension`, `hack-calf-raise`, `ab-wheel`) runs at full week-1-7 volume straight through the taper week. Not disclosed to the athlete anywhere in the UI. Developer-acknowledged in-code, not previously surfaced as a plan-doc finding. |
| T-37 | REDLINE: `programProgress.redline` is written with only `completedSessions` after a completed session, missing the `startDate` field every other plan's `programProgress` entry carries (confirmed against 20+ sibling entries in the same live Firestore document). Flagged as a hypothesis, not independently root-caused or reproduced a second time this session — no observed UI consequence yet since nothing currently reads `startDate` for date-relative copy on this plan. |
| T-38 | (Positive pattern, not a bug) 30-Min Adventure: the plan's entire session-generator mechanic is fully wired and live-confirmed end-to-end — real `programProgress` write with a correct `startDate` (unlike REDLINE's T-37), real per-round `workouts` subcollection data, correct bodyweight-mode weight omission. Breaks Wave 5's 2/2 dead-headline-mechanic streak (Iron Clock T-32, REDLINE T-34); the plan has no `xStatus` object at all, so there is no unwired safety/progression layer for the pattern to reproduce on. |
| T-39 | (Positive pattern, not a bug) 30-Min Adventure: first Wave-5 plan with genuine T-9 immunity via a real dedicated dashboard component (`AdventureDashboard`, gated by `Dashboard.tsx`'s `isAdventure` early return before the shared `dashboardViewWeek` path is ever reached). Live-confirmed: switching in from a just-logged REDLINE session produced a clean dashboard with no stale-week artifact. Continues to support "dedicated dashboard," not plan category, as the real T-9-immunity predictor. |
| T-40 | 30-Min Adventure: the "Thirty-minute target" / "fit in half an hour" claim does not reliably hold. `estimatedMinutes` per pair is a flat 5/6/7 editorial lookup keyed only off a `setup` tier label, not computed from actual rest seconds/set count/rep ranges, and `randomize()` has no running-total or time-budget awareness. Live-confirmed: a randomly generated route scored ~33 minutes on the first attempt. A throwaway script confirmed the true reachable range is 25-35 minutes across all portal combinations, meaning roughly half of all combinations exceed 30 minutes, with no bias in the random generator away from that outcome. |
| T-42 | Atlas: `carryScore()`, `compareCarries()`, and `limiterAdvice()` (`src/features/atlas/carries.ts`) are fully implemented and exported but have zero callers anywhere else in the codebase. No dashboard/workout/history surface ever computes or displays a kg·min carry score or the plain-English limiter advisory, despite "Carries scored as time × load" being one of exactly four card feature bullets (and the portfolio quiz's `signatureMechanic` wording verbatim). The underlying `atlasStatus.carries` data these functions would consume is real and separately drives a genuinely working exercise-swap mechanic (see the positive note in the Wave 5 running-patterns log) — this is a decorative-scoring-layer gap, not a dead-data-pipeline gap. |
| T-43 | Atlas: `weighted-pull-up` (weightMode: `weighted-bodyweight`) reproduces T-23 via a new, more specific root cause than Workhorse/Gravity Is Optional/Kali. `WorkoutView.tsx:842`'s `totalSystemWeightKg` computation is gated to a hardcoded `programData.id === 'kali' \|\| 'workhorse' \|\| 'gravity-is-optional'` allowlist that excludes `atlas` (and any other future plan using the mode) entirely — on top of `genericDoubleProgression`'s existing `sets[0].weight`-only read. Live-confirmed: a logged 15kg×6 Weighted Pull-up set wrote `workingLoads.atlas['weighted-pull-up']: 15` with no `totalSystemWeightKg` field anywhere in the session's `setsData`. Recommend the post-audit fix make the `WorkoutView.tsx:842` gate `weightMode`-driven rather than plan-id-driven, so it can't silently exclude future plans the way it excluded Atlas. |
| T-44 | Atlas: `planPreferences.atlas.exerciseSelections.hinge` (an "approved hinge substitution" letting an athlete swap trap-bar-deadlift for conventional/sumo deadlift, per `APPROVED_HINGES`) has zero UI entry point anywhere in `src/pages/Settings.tsx` or `src/pages/Onboarding.tsx` — unlike the matching Kali/Gravity Is Optional/Venus Rising/Athena preference pickers, which all have one. Live-confirmed: onboarding's own "NEXT: EXERCISE SELECTION" button skips directly to the Starting Numbers step; no exercise-selection screen exists in the shipped app. Permanently a no-op default to trap-bar-deadlift for every athlete, despite the plan file's own comment framing it as a real opt-out ("the plan defaults to trap bar and never insists"). |
| T-45 | Atlas: "Optional kettlebell power work" — one of exactly four onboarding-card feature bullets, in both English and Polish (`src/contexts/translations.ts`) — is entirely dead code. `POWER_POOL` (`kettlebell-swing`, `kettlebell-shoulder-press`, `turkish-get-up`), `isPowerWork()`, and `powerWorkEnabled` (declared on `AtlasStatus`) are never referenced anywhere in `ATLAS_GAUNTLET_ONE`/`TWO`'s slots, `preprocessDay`, or any onboarding/settings control. A three-part dead-feature stack (pool + predicate + status flag) behind a top-level, translated marketing claim, not just buried dashboard copy. |
| T-46 | Atlas: `programProgress.atlas` never receives its own `startDate` sub-field while it's the active plan — live-confirmed after both 1 and 2 completed sessions, unlike every sibling `programProgress` entry in the same Firestore document. Same shape as REDLINE's T-37; root-caused this time to `switchProgram()` (`UserContext.tsx:434-456`) only ever backfilling the *previous* plan's entry on the way out, never proactively creating one for the plan being switched into, combined with `WorkoutView.tsx:727`'s session-complete handler only `increment()`ing `completedSessions`. Unlike T-37, a working fallback was directly confirmed this session (`WorkoutView.tsx:333`'s `\|\| user.startDate`), so no live-observed wrong date resulted — recorded as hypothesis-severity, not a live-consequence bug. |
| T-41 | 30-Min Adventure: the "never repeat the same pairing twice" claim (`portfolio.ts`'s `signatureMechanic`, shown verbatim to athletes in the "Help Me Choose" quiz via `FollowUps.tsx:42`) has no enforcing mechanism anywhere in the codebase — no history-aware exclusion in `randomize()`/`rerollPortal()`/manual selection, despite `AdventureDashboard` already resolving prior `selectedPairIds` for its own last-route display. Fails even within a single session: `cable-pull-through` appears in pairs spanning two different portals (Abs/Glutes and Biceps/Hamstrings/Lower Back), so one specific two-portal combination trains the identical exercise twice in the same 20-set route. |
| T-47 | Lazarus: `lazarusStatus` (`breakMonths`, `memoryCurve`, `underestimated`, `injuryReturn`) has zero writers anywhere in `src/` — no reference to `lazarus` at all in `Onboarding.tsx` or `Settings.tsx`. Three live readers (`lazarus.ts`'s `preprocess`/`calculateWeight` hooks, `Dashboard.tsx:695-716`'s "Predicted vs logged" card) all permanently see `undefined`. Two of the plan's four card features ("Memory Curve against your old bests," "Accelerates once you prove it") are consequently unreachable for every athlete. Live-confirmed: a fully logged 13-set Return I session produced ordinary `genericDoubleProgression` `workingLoads.lazarus` writes and zero `lazarusStatus` field in Firestore before or after. Stricter than Iron Clock's T-32/REDLINE's T-34 (each read once, cosmetically) since all three of this status object's call sites are permanent no-ops. `injuryReturnGuidance()`, a third function referenced only in the plan file's own header comment, has zero callers anywhere and is equally unreachable. |
| T-48 | Lazarus: T-9 reproduces live (fourth Wave-5 plan exposed, after Iron Clock/REDLINE/Atlas). Notable refinement: Lazarus *does* have a plan-specific dashboard widget (`Dashboard.tsx:695`'s "Predicted vs logged" card), but it's a conditional block inside the shared `Dashboard.tsx` render path rather than an early-returning dedicated component, so it grants none of the T-9 immunity that Athena/Venus Rising/Kali/House of Iron/30-Min Adventure's true dedicated dashboards do. Confirmed via a deliberate `dashboardViewWeek-test_claude` localStorage-poisoning test (set to `8`, reloaded, showed "Week 8 · Returned · Return I" despite `programProgress.lazarus` correctly holding one completed session, which should resolve to Week 2 "Return II"; clearing the key resolved correctly). |
| T-49 | Lazarus: `lazarusStatus`/`planPreferences.lazarus` missing from `resetProgram()`'s allowlist (T-2/T-28 family), consequence-free like Iron Clock's instance since T-47 means nothing currently populates either field. `programProgress.lazarus` also missing its `startDate` sub-field after a completed live session (only `completedSessions`), a third instance of the same shape as REDLINE's T-37 and Atlas's T-46 — not independently confirmed for a working fallback this session, recorded at hypothesis severity given the identical code path to Atlas's confirmed-working case. Structurally immune to T-23 (zero `weighted-bodyweight` exercises across all 18 distinct exercise ids in the plan's pool) — directly answers the audit brief's specific check for this plan: the newly-identified `WorkoutView.tsx:842` allowlist gap does not reproduce a third time here, because Lazarus never reaches the code path the gap lives in. |
| T-50 | Skeleton: `Dashboard.tsx:109`'s `user.programId === 'skeleton-'` can never equal the plan's real id (`'skeleton-to-threat'`), so `localMaxDeficitPushupReps` never advances past 0 and the "Deficit Push-up PR" widget (`Dashboard.tsx:1202`) renders `'--'` unconditionally for every athlete, forever. Live-confirmed across two fully logged sessions with real Deficit Push-up data (15/20/15 reps, then 30/30/30 reps) — widget stuck at `'--'` both times, while the underlying `workouts` documents held correctly-shaped data. Narrowest root cause of any Wave-5 dead-feature finding: a one-line string-literal fix, no missing writer or onboarding step involved — the write side already works. |
| T-51 | Skeleton: T-9 reproduces live (fifth Wave-5 plan exposed, after Iron Clock/REDLINE/Atlas/Lazarus). Skeleton's three dashboard widgets (`skeleton_countdown`/`skeleton_pushup_max`/`skeleton_quotes`) are conditional blocks inside the shared `Dashboard.tsx`, not an early-returning dedicated component — same non-immunity shape as Lazarus's T-48. Confirmed via a deliberate `dashboardViewWeek-test_claude` localStorage-poisoning test (set to `9`, reloaded, showed "Full Body - Week 9" with a recalculated "3 weeks left" countdown despite only 2 of 3 weekly sessions completed, which should resolve to Week 1). |
| T-52 | Skeleton: `programProgress['skeleton-to-threat']` never receives a `startDate` sub-field from ordinary session completion (only `completedSessions` increments) — same shape as REDLINE's T-37, Atlas's T-46, and Lazarus's equivalent. Narrower than those instances: Skeleton's `resetProgram()` itself does correctly write `startDate` on an explicit reset (§ T-2/T-28 does not apply to this plan at all, see running-patterns note); the gap is confined to the ordinary session-complete path. Not independently confirmed for a working fallback this session, recorded at hypothesis severity given the identical code path to Atlas's confirmed-working case. |
| T-53 | Skeleton: `UserContext.tsx:99-116`'s `scheduleMode === 'rolling'` branch carries a comment explicitly naming Skeleton as relying on its empty-placeholder handling ("Skeleton (and similar) stores empty placeholders..."), but Skeleton's onboarding always sets `scheduleMode: 'fixed'` (confirmed live and in Firestore), so the branch is never reached for this plan. Skeleton's correct day-of-week behavior instead comes from the `selectedDays`-remap path's early-return no-op (every week's static-template exercises array is empty, not just non-training days) — live-confirmed correct via Monday/Wednesday sessions both landing on the right week/day, but via a different mechanism than the comment claims. Not a bug — a stale/misattributing comment worth a one-line fix on next touch. |

| T-54 | Apex Predator: the movement-access assessment save (`ApexDashboard.tsx`'s `save()` -> `updateUserProfile({ apexPredatorStatus })`) fails for every real athlete. Live-confirmed twice: a correctly-filled six-region assessment through the real onboarding UI produced "The assessment could not be saved" both times, with `apexPredatorStatus` confirmed absent from Firestore after each attempt. The identical payload written via an admin-privileged Firestore call succeeded immediately, proving the object is well-formed and isolating the failure to the authenticated-user write path specifically — not a data-shape or size-limit problem. A manual clause-by-clause trace of `firestore.rules`'s `validUserProfile` (live-fetched deployed rules confirmed identical to the repo copy, so not a stale-deployment gap) found no rule the payload should fail; the precise trigger was not pinned down further from client-side observation alone this session. Net effect: every athlete permanently runs the plan on its untested `['ankle','thoracicRotation']` default emphasis for its full 12-week length, since the plan's entire premise (assessment-driven access work) can never be personalized. |
| T-55 | Apex Predator: `apexPredatorStatus` missing from `resetProgram()`'s hardcoded allowlist (`UserContext.tsx:467-470`) — same T-2 family as Athena/Kali/House of Iron, currently consequence-free only because T-54 means nothing populates the field in the first place. |
| T-56 | Apex Predator: `programProgress['apex-predator']` never receives an entry at all, confirmed via a Firestore read taken immediately after a successful `switchProgram()` call — wider than REDLINE's T-37/Atlas's T-46/Lazarus's and Skeleton's post-completion-only gaps, since here there is no entry whatsoever rather than a missing `startDate` sub-field. `ApexDashboard`'s own `user.startDate` fallback (same mechanism confirmed working on Atlas) meant no wrong week was observed live. |
| T-57 | Super Mutant: the save-time progression write (`superMutantStatus`, via `src/features/workout/progression/superMutant.ts`) fails with `permission-denied` for a real authenticated user, silently swallowed by a try/catch in `WorkoutView.tsx`'s `handleSaveSession` (`console.warn` only, no visible error). Live-confirmed on a fully logged, fully completed 30-set session: the `workouts/{id}` log saved correctly and completely, but `superMutantStatus` and the portfolio-wide `completedSessions` counter were both unchanged in Firestore afterward. Because `generateNextWorkout()` reads exactly the fields this write should update (`muscleGroupTimestamps`, `rolling7DayVolume`, `completedWorkouts`), the effect compounds: every subsequent session regenerates the identical Block A + Block C workout, and RIR/cycle/variant/load progression are all frozen at their initial values. Admin-privileged write of the identical resulting document succeeded instantly, isolating the failure to the authenticated-user write path (same isolation method as T-54) rather than payload shape — but a full `firestore.rules` clause trace found nothing either write should violate, and since a portfolio-wide field (`completedSessions`) failed alongside the plan-local one, root cause could not be pinned to Super-Mutant-specifically vs. a broader `test_claude` account/session-state issue in the time available. |
| T-58 | Super Mutant: the onboarding write (`updateUserProfile({ superMutantStatus })` + `switchProgram(...)`) fails identically — `permission-denied`, three live attempts, all producing `"Failed to build program: Missing or insufficient permissions."` with `superMutantStatus`/`programId` confirmed unchanged in Firestore after each. Blocks entry to the plan entirely for a real athlete; compounds with T-57 since even an admin-seeded account then hits the independent save-time failure on the first logged session. |
| T-59 | Super Mutant: `superMutantStatus` missing from `resetProgram()`'s hardcoded allowlist (`UserContext.tsx:467-470`) — same T-2 family as Athena/Kali/House of Iron/Apex Predator. Currently low-consequence only because T-57/T-58 already prevent the field from moving in normal use. |
| T-60 | Super Mutant: "pool mode" (`src/features/superMutant/pool.ts`, 204 lines, a deterministic least-recently-used exercise rotator) is fully wired into `preprocessDay` but has zero UI entry point in `Settings.tsx` or `Onboarding.tsx` — no athlete can ever opt in. Plan-local echo of the "declared, wired, unreachable" shape, not a new shared bug. |
| T-61 | Super Mutant: `weakPointMuscle` (`types.ts:145`) is read by `generateNextWorkout` to add a bonus set to a matching exercise, but has no writer anywhere in the codebase — a second, independent dead field in the same plan file as T-60. |
| T-62 | Neural Overload: **T-3 does NOT reproduce** — the plan never uses `type: 'wave'`/`wavePercentForSet` anywhere; its "1-6" scheme is `type: 'percentage'` with a function-valued `percent`. Closes the audit's longest-open T-3 question (flagged since start of Wave 2) — portfolio-wide `type: 'wave'` exposure remains 1 of all plans checked (King of the Squat only). |
| T-63 | Neural Overload: `oneSixWave()`'s `discharge()` helper branches only on `ctx.week >= 4 && ctx.week <= 6`, so weeks 1-3 (Charge) and weeks 7-9 (Overload) get byte-identical 1-6 percentages (90/75/92.5/77.5%); only weeks 4-6 (Discharge) differ. Confirmed by direct function call across all 9 weeks and live on `test_claude` (Week 9 Bench Neural rendered 90/75/92.5/77.5kg on a 100kg paused-bench base, identical to the Week 1-3 prediction). The Overload phase's only real effect is its accessory-set trim; the plan's headline "neural" lifts never exceed week-1 numbers for the back third of the program. |
| T-64 | Neural Overload: onboarding write (`updateUserProfile`/`switchProgram` on the "Starting Numbers" calibration form) fails `permission-denied` for a real authenticated user — third independent plan this wave with this exact failure shape (Apex Predator T-54, Super Mutant T-57/T-58), now across a third structurally distinct write call site (a plain calibration write with no plan-local status object at all). `programId`/`stats.pausedBench` confirmed unchanged in Firestore after the attempt; admin-privileged write of the identical payload succeeded instantly. |
| T-65 | Neural Overload: `trackedLiftFor()` (`trackedLift.ts`) has no `case 'neural-overload'` despite `dashboardWidgets` requesting `'strength_chart'` — falls to the `default` branch, reading `user.benchHistory` (already confirmed dead portfolio-wide, T-22). Compound gap: even fixing T-22 would leave this plan's chart showing a generic "Paused bench" title uncredited to its actual 1-6 lifts, unless a dedicated case is also added. |
| T-66 | Neural Overload: `weighted-chin-up` (Chin Neural, `weightMode: 'weighted-bodyweight'`) excluded from `WorkoutView.tsx:842`'s hardcoded plan-id allowlist for `totalSystemWeightKg` — fourth instance of the same gate after Workhorse/Gravity Is Optional/Kali/Atlas (T-43). Chin Neural's own slot note ("Total system weight — bodyweight plus the belt") explicitly promises the number this gate withholds. |
| T-67 | Immaculate: `preprocess()`'s day-of-week guard (`immaculateRestructure.ts`) checks `day.dayOfWeek !== 2 && day.dayOfWeek !== 4` instead of the correct `1 && 4` (both upper days) — every ratio-tracked exercise is upper-body, but the check only ever runs on Lower Structural A (day 2, zero ratio exercises, permanent no-op) and Upper Structural B (day 4). Upper Structural A (day 1), which carries 4 of the plan's 6 named Poliquin ratio relationships, is never checked at all. Live-confirmed: a catastrophically lagging `weighted-chin-up` (50kg vs 72.9kg threshold) and `single-arm-external-rotation` (3kg vs 8.1kg threshold) received zero bonus sets on a real logged Upper Structural A session. One-line fix. |
| T-68 | Immaculate: `ezbar-preacher-curl` has no `strengthRef` field in its library entry (`library.ts:635-644`) despite the plan's own inline note citing "Poliquin target: ~46% of close-grip bench" — `preprocess()`'s `if (!ref \|\| ...) return exercise;` guard silently skips it, so even on the one correctly-checked day (Upper Structural B) this specific relationship can never fire. Needs a library addition, not a plan-file change. |
| T-69 | Immaculate: T-9 reproduces with an unusually clean isolation — no deliberate poisoning needed. Switching from Neural Overload (last viewed week 9) into a freshly-seeded, zero-progress Immaculate showed "WEEK 9" immediately; `localStorage.getItem('dashboardViewWeek-test_claude')` read directly confirmed the stale value was the sole cause. No dedicated dashboard component for this plan anywhere in `Dashboard.tsx`. |
| T-70 | Immaculate: new write-path failure variant. `test_claude`'s document had no `ownerUid` field at all (not stale — absent); the client-side self-claim `updateDoc({ownerUid})` that `checkCodeword()` runs on login for exactly this case failed `permission-denied`, blocking login itself with a raw untranslated error. After an admin write unblocked login, `switchProgram`'s write also failed `permission-denied` (`programId` unchanged in Firestore); after a second admin write, the workout-completion write failed a third time in the same session (`Firestore updateDoc skipped/failed for test user`, `Firestore progression payload write skipped/failed for test user` in console) — though the `workouts/{id}` session log itself saved correctly (all 14 sets), matching Super Mutant's documented split-failure shape. Admin-privileged writes of identical payloads succeeded instantly on all three failed writes. Fourth-through-sixth structurally distinct write call sites this wave with the identical failure shape (after Apex Predator T-54, Super Mutant T-57/58, Neural Overload T-64). |
| T-71 | Immaculate: `trackedLiftFor()` has a well-built, genuinely plan-specific `case 'immaculate-restructure'` ("Lagging lift", reads `close-grip-bench-press` as start value) — unlike Neural Overload's missing case, the switch-case wiring here is correct. The only gap is that it reads `user.liftHistory?.lagging`, and `liftHistory` has no write path anywhere in the codebase (T-22 family) — confirmed live, the widget rendered a start value but zero history points both before and after a fully logged, fully completed session. |
| T-72 | Immaculate: `weighted-chin-up` total system weight dropped — same `WorkoutView.tsx:842` hardcoded plan-id allowlist gate, sixth instance after Workhorse/Gravity Is Optional/Kali/Atlas/Neural Overload (T-43/T-66). |
| T-73 | Oracle: `refineWithModel`/`predict(request, useModel)`/`predictionError`/`accuracyBand`/`accuracyTrend` all exported from `prediction.ts`, never called anywhere else. Admin "Oracle predictions" AI toggle is inert. No predicted-vs-actual ledger ever persisted — the "shows you how close it got" half of the plan's headline claim has neither a call site nor data to score. |
| T-74 | Oracle: `predictFromPriors`' `loadKg:0` no-data sentinel forwarded verbatim into the live UI as "pred 0kg" instead of an explicit no-prediction state. |
| T-75 | Oracle: write-path failure escalates to total loss — session log, `oracleStatus.exposures`, and progress counters all failed to persist after a real completed workout. Seventh structurally distinct failing write call site this wave. |
| T-76 | Oracle: `oracleStatus` missing from `resetProgram()`'s hardcoded allowlist (T-2 family). |
| T-78 | Project Chimera: the plan's entire named mechanic — adaptive, evidence-gated volume reallocation (`proposeMutation`/`applyMutation`/`phenotype` in `src/features/projectChimera/mutation.ts`) — has zero callers anywhere outside its own file; `projectChimeraStatus` is read once (`preprocess()`) and written nowhere in the codebase (zero references to "chimera" in `Settings.tsx`/`Onboarding.tsx`). Every athlete runs the identical unmutated base 16-week programme. The cleanest, most complete "declared, wired, unreachable" case found in the audit — no partial UI stub exists anywhere, unlike Oracle (half real) or Immaculate (1 of 6 relationships reachable). |
| T-79 | Project Chimera: write-path failure reproduces on ordinary session completion — `workouts/{id}` session log saved correctly (real logged squat sets) but `programProgress['project-chimera'].completedSessions`, top-level `completedSessions`, and `workingLoads['project-chimera']` all failed to persist (user document `updateTime` unchanged before vs. after). Matches Super Mutant/Immaculate's partial-split shape. Eighth structurally distinct failing write call site this wave, closing Wave 6 with the condition still unresolved. |
| T-80 | Project Chimera: `projectChimeraStatus` missing from `resetProgram()`'s hardcoded allowlist (T-2 family); consequence-free while the mechanic itself is dead. |
| T-81 | Project Chimera: T-9 reproduces live, zero deliberate poisoning — stale `dashboardViewWeek-test_claude` leaked "9" from the prior Oracle session into a freshly-switched, zero-progress Project Chimera. Fourth Wave-6 plan exposed. |
| T-82 | (Positive pattern, not a bug) Project Chimera's block-level rep/RPE phase transforms (Blocks I-IV) are real, correctly wired, and live-confirmed on a Week 9 Block III session — structurally separate from, and unaffected by, the dead reallocation engine (T-78). |

**Renumbering applied:** Oracle's and Project Chimera's docs each independently continued local numbering from the same last-known table state, causing a T-73–T-76 id collision. Resolved: Oracle keeps T-73–76; Project Chimera's four colliding entries became T-78–T-81, and its T-77 (already non-colliding) became T-82. `docs/plans/v2/project-chimera.md`'s own findings section and YAML export block still reference the old T-73/T-74/T-75/T-76/T-77 ids and should be updated to match on the next pass through that doc.

**Owner override:** none yet.

---

> **Sections 1–8 below are PARKED** until the 36-plan audit is complete.
> Their `PENDING` markers are not live. Do not answer them in this phase.

## 1. Blackout

Premise: one work set; back-off *earned*; quality/stop-reason captured.
Today: neither headline feature runs.

### BLK-1. Identity of the two dead features

- **A.** Wire as already written (`earnedBackoff` + telemetry gate)
- **B.** Wire, but change the earn rule (you specify)
- **C.** Un-advertise and delete unreachable code
- **D.** Wire earned back-off, drop mandatory quality capture (or vice versa)

**Decision:** PENDING

### BLK-2. Effort target on the single set

Audit: replace “stop at the target” with explicit RIR, capture RIR every set.

- Capture **mandatory / optional / primary slots only**?
- Default prescription: RIR 2 → 1 → 0 by phase, or one fixed RIR for all 8 weeks?

**Decision:** PENDING

### BLK-3. “+ ADD SET”

- **A.** Hide on this plan
- **B.** Confirm-modal quoting the stall ladder
- **C.** Leave it; stall ladder is the safety valve
- **D.** Adding a set *is* how you take the earned back-off (reframe, don't hide)

**Decision:** PENDING

### BLK-4. Eight weeks, almost no change

Audit proposal: RIR 2 (wk 1–2) → RIR 1 (3–6) → RPE 10 + earned back-off (7–8),
end with a re-test.

Accept as written, load-only double progression (no RIR phases), keep flat on
purpose, or different phase table?

**Decision:** PENDING

### BLK-5. Core is zero; arms are triple-dosed

Audit: Day III `hammer-curl` → ab-wheel; `cable-triceps-extension` → hanging
leg raise. Net zero sets.

Accept both swaps, only one core slot, add core *on top of* 22 sets, or keep
arm density (HIT arms are the point)?

**Decision:** PENDING

### BLK-6. Glute max upper is zero

Swap Day II leg-press → hip thrust (lose a quad slot), swap the extra tricep
instead, add a 23rd set, or leave long-length glutes only?

**Decision:** PENDING

### BLK-7. Failure-approval list vs metadata

`lat-pulldown` vs `hammer-pulldown` opposite permissions; `hammer-chest-press`
listed but unused.

Approve both machine pulldowns, neither (no failure on machines), or write a
principle (“machines yes / no / only isolation”)?

**Decision:** PENDING

---

## 2. The Minimum

Premise: 2 days, 29 sets, bonus modules. Engine works. Progression is thin.

### MIN-1. Progression vector (no extra session)

Audit table: RIR 3→2 (1–3), RIR 2→1 + last isolation to failure (4–7), RPE 9
+ rest compression (8–9), week 10 deload + retest.

Accept, load-only per slot, bonus sessions *are* the progression (leave the
two mandatory days flat), or different table?

**Decision:** PENDING

### MIN-2. Week 10

Deload + retest, retest at full volume, or leave as another work week?

**Decision:** PENDING

### MIN-3. Rear delt / traps / cuff via substitution

Audit: 1 lateral + 1 reverse pec-deck on A; pulldown → rope row **or** keep
pulldown and make a slot face-pulls.

Which swap? Anything you refuse to lose (laterals, pulldown)?

**Decision:** PENDING

### MIN-4. Two standing-calf slots; no real knee-extension

Seated calf on B + steal a set for leg extension on A — accept, seated calf
only, leg extension only, or keep both standing calves?

**Decision:** PENDING

### MIN-5. Superset antagonist pairs

Yes always, optional setting, or no (keep straight sets)?

**Decision:** PENDING

### MIN-6. Reorder Session A

`hack squat → incline press → RDL → row → …` to unstack axial load. Yes / no?

**Decision:** PENDING

### MIN-7. Per-slot load increments

5 kg leg press / 2.5 compounds / 1–1.25 isolation, vs keep global +2.5?

If per-slot: this plan only, or a library-wide `weightMode` rule?

**Decision:** PENDING

### MIN-8. Blanket `20X0` tempo vs per-slot cues

Fix this plan's exceptions, or audit every plan's tempo vs cue mismatch later?

**Decision:** PENDING

### MIN-9. Bonus-session UX

Dashboard prompt naming the weakest muscle, keep `· bonus unused`, or
something else?

**Decision:** PENDING

---

## 3. Pain & Glory

Best periodisation of the deadlift plans; untestable live; high axial weeks
with no deload.

### PG-1. Deload cadence in weeks 1–12

Audit: deload wk 4, 8, and **12 before the test**. Alternatives: only week 12;
every 4th week including peak; keep 12 flat weeks (fatigue is the point).

**Decision:** SUPERSEDED by effectiveness **PG-4** (optional 4, forced 8 and 12).

### PG-2. What a deload *does*

Cut deficit sets 10→5 and hold 45%; cut load not sets; cut both; drop the
second pull day only?

**Decision:** DECIDED — **E.** ~50% weekly volume at held % (same rule as King).

### PG-3. Week-13 AMRAP seeds the peak

Must the test be on a recovered back (deload 12), or is a fatigued test a
deliberate conservative floor?

**Decision:** SUPERSEDED by effectiveness **PG-5** (recovered AMRAP).

### PG-4. Rear delt + external rotation (14 weekly press sets, zero rear/cuff)

Add 2 reverse pec-deck + 1 ER on push day, replace an existing push slot,
or specialist-bias OK (leave zeros)?

**Decision:** SUPERSEDED by effectiveness **PG-7** (optional 2 sets, 2nd to failure).

### PG-5. Direct biceps / brachioradialis

Add hammer or reverse curl (where?), replace a pull accessory, or skip?

**Decision:** SUPERSEDED by effectiveness **PG-8** (skip).

### PG-6. Nordics after 10 deficit sets

Nordics first, interleave 5 deficit / pulldown / 5 deficit, or leave?

**Decision:** SUPERSEDED by effectiveness **PG-6** (no Nordics on 10×6 days).

### PG-7. How far to cut lumbar, beyond deloads?

Keep 10×6 deficit, cut to 8×6 or 6×6, or change deficit height / frequency?

**Decision:** DECIDED — **A.** Keep 10×6 @ 45%; lumbar managed by deloads + no
Nordics on those days. Not revisited.

### PG-8. Free-text → `exerciseId`

This plan now, all four legacy PL plans together, or after hypertrophy audit?

**Decision:** DECIDED — **B.** All four legacy PL plans together in the
implementation pass.

### PG-RB-F / PG-RB-P / PG-RB-M

- **F:** 4-day default; 3-day (drop a push) and optional 5th stay as locked.
- **P:** Accessory RIR 3→1 in accumulation, easier when DL intensifies (King pattern).
- **M:** 10×6 is a **3–4 s eccentric**, not speed work — tempo field **30X0**
  plus tips that say 3–4 s down (PG-RB-M2 **D**).

---

## 4. Trinary

Best-wired engine; lockout names missing; accessory trap; unsafe RE ratios.

### TRI-1. Eight unresolved variation names (all lockout options empty)

- **A.** Add all 8 to the library (and translations)
- **B.** Map each to an existing library exercise (you confirm the mapping)
- **C.** Remove lockout as a weak-point until the library exists
- **D.** Mix: add some, map some — list which

Names: Close Grip Bench, Lockout Holds, Floor Press, High Pin Press, Reverse
Band Bench, Mid Pin Press, Board Press, Paused Deadlift (knee), Rack Pulls,
Snatch Grip RDLs, Banded Deadlift. (Doc said 8 unresolved in those buckets;
confirm the exact leftover list when implementing.)

**Decision:** SUPERSEDED by **TRI-E7 A** (add lockout names). Confirmed stand.

### TRI-2. Accessory-day trap (4×/week never returns to ME/DE/RE)

- **A.** Accessory days do not increment the 7-day count
- **B.** At most one accessory day per week, then auto-return to main cycle
- **C.** Change copy to 3 days; accessory is opt-in only
- **D.** Rolling count of *main* workouts only (accessories ignored)
- **E.** Other

**Decision:** SUPERSEDED by **TRI-E2/E3** (hard-cap one accessory/week, then return).

### TRI-3. Skip Accessory UX

Keep per-session skip, skip-once-sticks-until-toggled, or remove skip if
TRI-2 makes it unnecessary?

**Decision:** DECIDED — **A.** Unnecessary; the cap auto-returns. No extra Skip control.

### TRI-4. RE deadlift substitutes (GM and reverse hyper at 70–80% DL)

Use attribution-map ratios, athlete-entered working weight (not % of DL),
remove GM/reverse hyper from the list, or keep and warn?

Map ballpark: GM ~45% DL; reverse hyper often not % of DL at all.

**Decision:** SUPERSEDED by **TRI-E8 / E13** (separate % table).

### TRI-5. ME jump size (+10 kg off one RPE≤7)

Keep, +5 only, +2.5/+5 with Ritual-style two-easy streak for the bigger jump,
or RPE bands with smaller steps at heavier absolute loads?

**Decision:** SUPERSEDED by **TRI-E6** (+2.5 bench; squat/DL +2.5/5 by RPE; typed-in ME).

### TRI-6. Weak-point accessory bundles (blueprint TRI-1)

Do after library names exist, skip, or design the bundles now so Wave 2
doesn't block on it?

**Decision:** SUPERSEDED by **TRI-E14 C** (bundles + custom slot).

### TRI-7. Bands/chains (blueprint TRI-2)

Later, never, or a simple “I use accommodating resistance” note that does
not change math?

**Decision:** SUPERSEDED by **TRI-E4 B** (bands/chains toggle).

---

## 5. Ritual of Strength

Periodisation and progression already match the claim. Routing/reset are T-1/T-2.

### RIT-1. After routing is fixed, skip-ramp UX

Silent start at week 5, confirmation (“Ramp-in skipped — this is week 5, ME
bench”), or a one-screen “here is your first real week” recap?

**Decision:** DECIDED — **B.** One-line confirmation: “Ramp-in skipped — this is week 5, ME bench.”

### RIT-2. Ramp-in tips show actual % (70/80/90)

Yes / no / only in the live set header, not the tip?

**Decision:** SUPERSEDED by **RIT-E20 A**. Confirmed stand.

### RIT-3. Accessory muscle-balance nudge

Flag-only (all-press / all-pull), suggest a pull, hard-require mixed selection,
or no — athlete owns the slot?

**Decision:** SUPERSEDED by **RIT-E5 C**. Confirmed stand.

### RIT-4. Blueprint extras (velocity chip, Ascension milestone card)

Now, after integrity, or never (progression already works without the chrome)?

**Decision:** DECIDED — **B.** Ascension milestone card after integrity. No velocity chip (E13).

---

## 6. King of the Squat

Wave display changes; load does not. 1RM never updates. No mid-block deload.

T-3 fixes “it doesn't escalate.” The following is *how* it should escalate.

### KOS-1. Peak-week top single target (week 9, vs a 160 kg example)

Audit suggestion 92–95%+. Your target for the heaviest prescribed single
before test week: ~90, 92–95, 97–100, or no prescribed top — athlete works up?

**Decision:** DECIDED — **B.** 92–95%.

### KOS-2. How phases differ besides reps

Phase `basePercent` offset (audit), map ladder reps to intensity (3/2/1
heavier than 5/4/3 by construction), both, or you specify a week-by-week %
table?

**Decision:** DECIDED — **C.** Both: phase `basePercent` offset **and** heavier
ladders in later blocks.

### KOS-3. Recalibration of `stats.squat`

Week 6 AMRAP, week 9 before realisation, week 12 test writes back, athlete
edits 1RM only, or checkpoints at more than one of these?

**Decision:** DECIDED — **A.** Week-6 AMRAP only. **KOS-3b:** week-12 test **also** writes (floor, never compound).

### KOS-4. If a checkpoint exists, compounding rule

Same as Bench/P&G (reset to fresh e1RM, do not stack weekly bumps), or waves
keep using day-one max and the checkpoint is display-only?

**Decision:** DECIDED — **A.** Same as Bench/P&G — reset to fresh e1RM, never
compound.

### KOS-5. Deload

After volume waves (~wk 4), after intensity (~wk 7), both, week 12 drop is
enough, or a dedicated deload week that is not a wave repeat?

**Decision:** DECIDED — **B.** After intensity (~week 7) only.

### KOS-6. What the deload cuts

Load only, sets only, skip the heavy squat day, or ~50% volume at held %?

**Decision:** DECIDED — **D.** ~50% volume at held %.

### KOS-7. Contaminated shared tips

Plan-specific note override (two lines), or re-key tips by `(planId, exerciseId)`
for the whole app?

**Decision:** DECIDED — **Custom.** Evaluate per exercise whether King needs its
own tip. Where copy overlaps another PL plan (especially Bench Domination),
**share one tip**. Tempo fields still ship on CAT/paused work (KOS-RB-M).
**KOS-RB-T:** optional intensifiers in weeks **4–6** on **low-intensity**
isolations only.

### KOS-8. Blueprint extras already partly built

Hip/capsule swap is wired. Still want low/high-bar selector and front-squat
booster, or ship the existing swap and stop?

**Decision:** SUPERSEDED by KOS-X1/X2/X3. **KOS-8b:** confirmed dead.

### KOS-RB-F. Frequency revisit

**Decision:** DECIDED — **A.** Keep 4-day only.

### KOS-RB-P. Accessory effort language

**Decision:** DECIDED — **Custom.** Accessory RIR progresses in volume weeks,
then tapers as squat intensity takes the fatigue budget.
**KOS-RB-P2:** RIR **0** on low-fatigue isolations; remaining accessories
**RIR 3 → 1 across weeks 1–6**. Then taper when squat intensifies (wk 7
deload; wks 8–11 accessories easier).

---

## 7. Bench Domination

Engine is good. Pull-ups T-4. Routing T-1. Remaining is structure and the
onboarding module's honesty.

### BD-1. Weighted Pull-ups once sets exist

Keep 3 numbered sets, true EMOM for 12–15 min, or 3–5 sets with a duration
cap? Progress readout denominator must match whatever you pick.

**Decision:** SUPERSEDED by **BD-E12**. Stand — keep coded progression; fix 0-set bug only.

### BD-2. Split 1,446-line `program.ts`

Now (day-builder vs progression), after this audit wave, or never (fix the
duplication with a local helper only)?

**Decision:** PENDING

### BD-3. Design-indecision comments (Week 15 Day 1, etc.)

You pick the placement now (describe it), “pick one and delete comments”
delegated to implementer, or leave comments until you re-read the file?

**Decision:** PENDING

### BD-4. Blueprint extras (Wed velocity → Saturday AMRAP, pause vs TnG, sparkline)

Freeze, sparkline only, pause/TnG only, or all later?

**Decision:** DECIDED — **A+C+F.** Kill Wednesday velocity check. Stand paused-only (no TnG). Sparkline after integrity, this plan’s dashboard only.

### BD-5. Reverse nordic on leg days

Once library attribution is fixed, keep the movement (as a quad exercise),
swap to a true hamstring curl, or remove?

**Decision:** SUPERSEDED by **BD-E5 / E6**. Keep reverse Nordic as a quad; ham curl with 3s ecc is an onboarding option on one leg day.

---

## 8. Cross-plan training rules (so hypertrophy doesn't re-litigate)

### XR-1. Press + hinge plans and rear delt / ER

Hard rule (must include), default-include unless the plan opts out in copy,
or case-by-case forever?

**Decision:** PENDING

### XR-calf. Calf loader (catalog)

**Decision:** DECIDED 2026-08-16 — **no seated calf, ever**. Default **standing DB/KB calf**. Progress to **standing hack-calf** when strong (onboarding/tip; hack-calf starts at **+40 kg**). **Same principle on every plan** — only weekly set count changes. Do not re-ask calf per SKU.

### XR-mix. Regional mix (catalog, 2026-08-16)

Owner brief — use this when proposing exercise swaps (supersedes the earlier “drop incline / kill hip-supported DL / always overhead tri” draft):

- **Triceps:** even mix of overhead vs other (pressdown, skull, dip, close-grip). Do not convert every cable tri to overhead.
- **Pecs:** always emphasize **upper chest**; use **lower pec** (dip, pec-deck, decline, high-to-low fly) as variation so weeks stay fresh. Incline stays the default bias.
- **Hamstrings:** even shortened (seated/lying curl) vs lengthened (RDL, Nordic/GHR, hip-supported DL). **Hip-supported DB DL** is the preferred stretch loader on **beginner** programs; **sprinkle** it on intermediate/advanced — never the only/main ham movement there.
- **Lower trap:** sprinkle a Y-raise / face-pull if the week has space; otherwise prefer back ids that already load lower trap (pull-up, chest-supported row). Do not add sets on high-volume weeks.
- **Horizontal vs vertical pull:** `hammer-upper-row` counts closer to a **pulldown** than a row. Most plans should have both a vertical and a true horizontal pull — don’t treat hammer-upper as the horizontal.
- **Calves:** standing only (XR-calf). Do not re-ask per plan.
- **Front squat slots (catalog):** wherever a plan uses a front squat, the athlete picks **`front-squat` / `safety-bar-squat` / `stiletto-squat`**. Not a per-plan vote.
- **Core:** wider pool. **Cable crunch** is a mainstay; also machine crunch, hanging/side knee raises, not ab-wheel-or-plank only. Library still needs machine crunch + side knee raise ids.
- **Holes:** sprinkle when the week is **low volume** or one region is **overloaded** relative to the rest. Quantify direct sets first (`scripts/analyze-plan-muscle-mix.ts`). Glute/back “hot” numbers often double-count compounds — treat isolation-family imbalance as the real signal.
- **Pool size:** no arbitrary “tiny pool / don’t add” cap. If a movement is effective and fits the plan’s job, house, and fatigue, **suggest it**.

### XR-2. Deadlift-heavy plans and direct elbow flexion

Same three options as XR-1.

**Decision:** PENDING

### XR-3. Low-volume plans (Minimum, Blackout, later Skeleton-class)

Health gaps filled by **substitution only** (no extra sets), allow +1–3 sets,
or zeros are acceptable if the card says so?

**Decision:** PARTIAL 2026-08-16 — holes may be **sprinkled in** on low-volume weeks (add allowed) *or* by substituting off an overloaded region. High-systemic weeks still substitute, don’t stack.

### XR-4. High-axial specialists (P&G, King, later similar)

Must have a deload every N weeks — what is N? 3, 4, 6, or “when the plan
already has a test/peak”?

**Decision:** PENDING

### XR-5. “Never compound estimate on estimate”

Promote to a documented engine rule all new plans must follow, or leave as
a pattern implementers copy?

**Decision:** PENDING

### XR-6. ≥5 fractional sets / muscle / week

Already calibrated: not a hard rule; judge vs the plan's own budget. Confirm
or tighten for hypertrophy generalists (Monolith, Purgatorio, etc.)?

**Decision:** PENDING

---

## 9. Decision log (append-only)

| Date | Id | Decision | Notes |
|---|---|---|---|
| 2026-08-14 | PROC-1 | **A** — full audit, then one implementation pass | First answer; redirected the task. |
| 2026-08-14 | AUDIT-1 | **A** — second-review each wave’s docs | Not a cross-wave synthesis. |
| 2026-08-14 | AUDIT-2 | **C** — tag improvements `hypothesis` / `shared-bug` / `plan-local` | Format for remaining plan docs. |
| 2026-08-14 | AUDIT-3 | **A** — running pattern list, no votes | §0c. |
| 2026-08-14 | AUDIT-4 | **B** — one end-of-audit report, no more wave comparison files | Wave 1 comparison kept as record. |
| 2026-08-14 | AUDIT-5 | **B** — no extra PROC-1 banner in `_audit-status.md` | |
| 2026-08-14 | AUDIT-6 | **C** — fix claimed-keyword UX first | Conflicts with PROC-1; see AUDIT-6b. |
| 2026-08-14 | AUDIT-6b | **B** — PROC-1 exception: claimed-keyword UX + T-5 only | In-audit code allowed for this slice. |
| 2026-08-15 | KOS-1 | **B** — 92–95% peak single | |
| 2026-08-15 | KOS-2 | **C** — phase offset + heavier ladders | |
| 2026-08-15 | KOS-3 | **A** — week-6 AMRAP only | KOS-3b pending |
| 2026-08-15 | KOS-4 | **A** — never compound; reset to e1RM | |
| 2026-08-15 | KOS-5 | **B** — deload after intensity ~wk 7 | |
| 2026-08-15 | KOS-6 | **D** — ~50% volume at held % | |
| 2026-08-15 | KOS-RB-F | **A** — 4-day only | |
| 2026-08-15 | KOS-3b | **A** — week-12 test also writes | floor, never compound |
| 2026-08-15 | KOS-7 / KOS-RB-M | **Custom** — per-exercise tips; share with other PL plans where copy overlaps; CAT tempo + tips | |
| 2026-08-15 | KOS-8b | **A** — superseded by X1–X3 | |
| 2026-08-15 | KOS-RB-P2 | **Custom** — RIR 0 on low-fatigue isolations; others 3→1 wks 1–6 | |
| 2026-08-15 | KOS-RB-T | Optional intensifiers wks 4–6 on low-intensity work | |
| 2026-08-15 | TRI-1 | Stand E7 — add lockout names | |
| 2026-08-15 | TRI-2 | Superseded by E2/E3 | |
| 2026-08-15 | TRI-3 | **A** — no Skip Accessory UX | |
| 2026-08-15 | TRI-4…7 | Superseded by E8/E13, E6, E14, E4 | |
| 2026-08-15 | TRI-RB-F | **A** — default 3-day; max one accessory | |
| 2026-08-15 | TRI-RB-M | **A** — DE concentric-intent; ME paused; RE grind/none | |
| 2026-08-15 | TRI-RB-T | **RIR** 2→1→1+technique on **some** accessories | not RPE |
| 2026-08-15 | TRI-RB-T2 | Isolations in bundle = RIR ladder; compound/lockout = DP | T2b **A** |
| 2026-08-15 | BD-1 | Stand E12 | |
| 2026-08-15 | BD-RB-M | **B** — all paused 11X0 incl. AMRAP | |
| 2026-08-15 | BD-RB-P | **A** — acc RIR 3→1; easier heavy/deload | |
| 2026-08-15 | BD-4 | Kill Wed velocity; no TnG; sparkline after integrity | A+C+F |
| 2026-08-15 | PN-RB-I | **A** — retag intermediate; keep lollipop copy | |
| 2026-08-15 | PN-RB-F | **B** — 4-day, ramp from ~50 sets | peak pending |
| 2026-08-15 | PN-RB-X | **A** — keep legs in; honest card | |
| 2026-08-15 | PN-RB-T | **A** — cycle 2+ real drop/RP on isolations | |
| 2026-08-15 | PN-RB-F2 | **B** — peak ~90–100 | |
| 2026-08-15 | PN-RB-R | Builders first, cap 3; then isolations | |
| 2026-08-15 | PN-RB-P | **B** — compounds DP; isolations RIR 3→1 | |
| 2026-08-15 | PN-RB-T2 | **A** — drop last iso; RP laterals/arms | |
| 2026-08-16 | PN-RB-D | Suggest deload **before cycle 2 only** | |
| 2026-08-16 | PN-RB-C2 | **A** — hold ~90–100; C2 = techniques + DP | |
| 2026-08-16 | RB-V1 | Keep all four clone SKUs; distinct jobs | |
| 2026-08-16 | RB-V1b | Research houses accepted | |
| 2026-08-16 | MON-RB-F | **A** — default 3-day, start ~60–70 | |
| 2026-08-16 | MON-RB-T | **A** — no intensifiers wks 1–6; late drop-set | |
| 2026-08-16 | MON-RB-F2 | **C** — Upper / Lower / Full (light machines) | |
| 2026-08-16 | MON-RB-P | **A** — double progression everything | |
| 2026-08-16 | MON-RB-V | **A** — no incline; swap cable tri | |
| 2026-08-16 | MON-RB-4 | **C** — 3-day only | |
| 2026-08-16 | EH-RB-I | **A** — wire region-report + confirmable swaps | |
| 2026-08-16 | EH-RB-F | Free attendance (2-on/1-off, EOD, 6-in-a-row); Oracle too | F3 pending |
| 2026-08-16 | EH-RB-V | Inventive pool; repeats OK if effective | |
| 2026-08-16 | EH-RB-T | LSF where it makes sense; rotate slots | |
| 2026-08-16 | EH-RB-P | RIR 2→1→0→0+intensity instead of RPE-9 phases | |
| 2026-08-16 | EH-RB-S | **A** — dashboard report + post-pain prompt | |
| 2026-08-16 | EH-RB-F3 | **A** — rotate A/B deck; 6-in-a-row wraps | |
| 2026-08-16 | OR-RB-F | **A** — Oracle same free-attendance scheduler | |
| 2026-08-16 | OR-RB-I | **A** — wire scoring + keep predictions | |
| 2026-08-16 | OR-RB-AI | **C** — optional AI ±7.5% now | |
| 2026-08-16 | OR-RB-P | RIR 2→1; final = AI 3–5 to last-set failure | compounds |
| 2026-08-16 | OR-RB-V | Effective barbell + machines/cables to spare axial | |
| 2026-08-16 | OR-RB-P2 | Unique compounds (BB/DB); 3–5 to failure; not S/B/R/H lock | |
| 2026-08-16 | CH-RB-I | **A** — wire block reallocation | |
| 2026-08-16 | CH-RB-F | **C** — free attendance, cap 4 / 7 days | |
| 2026-08-16 | CH-RB-V | **A** — trap-bar house + six qualities | |
| 2026-08-16 | CH-RB-P | **A** — DP inside blocks; reallocate between | |
| 2026-08-16 | CH-RB-T | **C** — technique only on responding quality | |
| 2026-08-16 | CH-RB-U | **C** — auto-apply strong evidence; confirm swaps | |
| 2026-08-16 | PUR-RB-I | Pairs stay; ramp volume; compound+iso; close equipment | pair map pending |
| 2026-08-16 | PUR-RB-R | **A** — Acc 8–12/10–15; Int compounds 5–8/6–10 | |
| 2026-08-16 | PUR-RB-F | **A** — 4-day | |
| 2026-08-16 | PUR-RB-M | **A** — 30X0 compounds | |
| 2026-08-16 | PUR-RB-V | Selection OK; lower = 1 machine + 1 FW; movable | |
| 2026-08-16 | PUR-V-map | Pair table in effectiveness Purgatorio section | leaning lat; hack+hack-calf opt |
| 2026-08-16 | PUR-RB-P | **B** — start ~75, peak Acc ~90 | |
| 2026-08-16 | TEN-RB-I | Pick four mains at onboarding; engine stands | |
| 2026-08-16 | TEN-RB-C | **B** — don’t halve accessories; copy stands | |
| 2026-08-16 | TEN-RB-F | **A** — 4-day | |
| 2026-08-16 | TEN-RB-M | Controlled eccentric, not 40X0 mandate | |
| 2026-08-16 | TEN-RB-I2 | **A** — per-slot short compound lists | |
| 2026-08-16 | OHP-RB-I | **A** — real 5/3/2 wave in Artillery | |
| 2026-08-16 | OHP-RB-F | **B** — optional 3-day (2 spec + 1 maint) | |
| 2026-08-16 | OHP-RB-D | **A** — wire split-delt UI or drop claim | |
| 2026-08-16 | OHP-RB-P | RIR isolations; PL wave on the press | |
| 2026-08-16 | OHP-RB-F2 | **A** — 2 delt + 1 pull maint | |
| 2026-08-16 | OHP-RB-D2 | **A** — wire front/side/rear widget | |
| 2026-08-16 | AR-RB-I | **A** — stand engine | |
| 2026-08-16 | AR-RB-F | **C** — 4-day only | |
| 2026-08-16 | AR-RB-R | **A** — role-based sets/reps | |
| 2026-08-16 | AR-RB-T | **B** — myo + rotate drop/RP on pumps | |
| 2026-08-16 | HF-RB-I | **A** — all three functions progress | |
| 2026-08-16 | HF-RB-F | **A** — 4-day | |
| 2026-08-16 | HF-RB-M | **A** — 4s ecc Forging only | |
| 2026-08-16 | HF-RB-V | Keep hip-supported; options SL RDL / GHR / Nordic | difficulty ladder |
| 2026-08-16 | QF-RB-I | **A** — wire ROM + knee swaps | |
| 2026-08-16 | QF-RB-F | **A** — 4-day | |
| 2026-08-16 | QF-RB-S | **A** — EH-style report UX | |
| 2026-08-16 | CAT-RB-I | Stand arches; rebalancer wire-or-delete | I2 pending |
| 2026-08-16 | CAT-RB-I2 | **B** — delete rebalancer | |
| 2026-08-16 | CAT-RB-F | **B** — optional 3-day | |
| 2026-08-16 | CAT-RB-T | **A** — keep LSF + partials + myo | |
| 2026-08-16 | CAT-RB-F2 | Upper/Lower/Stretch focus; chest every day; all 3 arches | |
| 2026-08-16 | PEA-RB-I | Kas GB; optimize whole-glute sets; no extra heavy bar | |
| 2026-08-16 | PEA-RB-F | **A** — optional 3-day (2 lower + 1 upper) | |
| 2026-08-16 | PEA-RB-R | **A** — 5–8 heavy / 12–20 pump | |
| 2026-08-16 | PEA-RB-T | one-and-half on lighter quad squats | not the bridge |
| 2026-08-16 | WH-RB-I | **A** — system-weight progression; trial stays | |
| 2026-08-16 | WH-RB-F | **A** — optional 3-day | |
| 2026-08-16 | WH-RB-P | PL-style chin strength; builders 2→1; pumps 2→0 | |
| 2026-08-16 | GIO-RB-I | **A** — T-23 + true 3× pull and dip | |
| 2026-08-16 | GIO-RB-T | **A** — wire total-rep | |
| 2026-08-16 | GIO-RB-F | **B** — optional 3-day | |
| 2026-08-16 | GIO-RB-P | Unweighted→weighted; pull-up not chin; assistance for <5 reps | |
| 2026-08-16 | GIO-RB-A | Negatives/foot-assist; 5+ unassisted gate | |
| 2026-08-16 | GIO-RB-F2 | **A** — pull-up / dip / mixed | |
| 2026-08-16 | ATH-RB-I | **A** — stand engine | |
| 2026-08-16 | ATH-RB-L | **A** — retag intermediate; 3-day on-ramp | |
| 2026-08-16 | ATH-RB-R | **A** — compounds 6–10; acc 8–12/12–15 | |
| 2026-08-16 | ATH-RB-P | **A** — ATH-1 + optional realisation AMRAP | |
| 2026-08-16 | VEN-RB-I | **A** — priorities work in 4-day; honest session size | |
| 2026-08-16 | VEN-RB-R | **A** — jobs 8–12; isolations 12–20/15–25 | |
| 2026-08-16 | VEN-RB-P | **A** — double progression | |
| 2026-08-16 | KALI-RB-I | **A** — stand; fix T-23 on weighted pull-up | |
| 2026-08-16 | KALI-RB-F | **B** — 4-day only | |
| 2026-08-16 | KALI-RB-R | **A** — anchors 3–6; builders 8–12; burns 12–20 | |
| 2026-08-16 | KALI-RB-X | **B** — no deficit toggle; Unleashed techniques only | |
| 2026-08-16 | HOI-RB-I | **A** — stand ladder; fix AMRAP parser | |
| 2026-08-16 | HOI-RB-F | **A** — 2/3/4 free-order | |
| 2026-08-16 | HOI-RB-X | **A** — stepper + consume implement ids | |
| 2026-08-16 | HOI-RB-P | **B** — named phases actually differ | |
| 2026-08-16 | IC-RB-I | Wire ladder; cut volume / raise intensity; progressive | |
| 2026-08-16 | IC-RB-F | Start 3-day; 4th optional | |
| 2026-08-16 | IC-RB-V | **A** — IC lower density; REDLINE upper/mixed | |
| 2026-08-16 | IC-RB-D | **A** — cut opening 4-day dose | |
| 2026-08-16 | RL-RB-I | **A** — wire recovery check | |
| 2026-08-16 | RL-RB-F | **A** — 4-day; optional 20-min express | |
| 2026-08-16 | RL-RB-T | **A** — timed finishers + amrap-finisher | |
| 2026-08-16 | RL-RB-V | **A** — upper/mixed house | |
| 2026-08-16 | ADV-RB-I | **A** — 30-min budget + no-repeat pairings | |
| 2026-08-16 | ADV-RB-F | Run whenever; no set days | |
| 2026-08-16 | ADV-RB-X | **A** — equipment filter now; timer after integrity | |
| 2026-08-16 | ATL-RB-I | **A** — swap stays; show score + advice | |
| 2026-08-16 | ATL-RB-X | **A** — hinge UI + KB power + distance/time | |
| 2026-08-16 | ATL-RB-F | **A** — 3-day only | |
| 2026-08-16 | LAZ-RB-I | **A** — wire Memory Curve + acceleration | |
| 2026-08-16 | LAZ-RB-X | **B** — no injury-copy UI | |
| 2026-08-16 | LAZ-RB-F | **B** — optional 2-day | |
| 2026-08-16 | SKEL-RB-I | Load DP on machines/FW; fix push-up PR id | |
| 2026-08-16 | SKEL-RB-F | 3-day starts 2 sets; 2-day is 3 sets | |
| 2026-08-16 | SKEL-RB-P | **A** — BW rep DP; plank time | |
| 2026-08-16 | APX-RB-I | **A** — fix assessment save | |
| 2026-08-16 | APX-RB-X | **B** — drop AI video from card | |
| 2026-08-16 | APX-RB-F | **B** — optional 2-day | |
| 2026-08-16 | SM-RB-I | **A** — fix both writes; engine stands | |
| 2026-08-16 | SM-RB-X | **A** — expose pool-mode | |
| 2026-08-16 | SM-RB-F | **A** — 4–6 dynamic, cap 6/7 | |
| 2026-08-16 | NO-RB-I | **A** — 1-6 stays; Overload actually heavier | |
| 2026-08-16 | NO-RB-F | **A** — 4-day | |
| 2026-08-16 | NO-RB-T | **A** — clusters on singles | |
| 2026-08-16 | IMM-RB-I | **A** — all six ratios; preacher strengthRef | |
| 2026-08-16 | IMM-RB-F | **A** — 4-day | |
| 2026-08-16 | IMM-RB-P | **A** — DP vs ratio; +2 if <90% | |
| 2026-08-16 | GHOST-RB-I | **A** — no 37th plan this pass | |
| 2026-08-16 | MIN-RB-I | **A** — stand 2-day MEV | |
| 2026-08-16 | MIN-RB-X | **A** — bonus never gates | |
| 2026-08-16 | BLK-RB-I | **A** — wire earned back-off + quality | |
| 2026-08-16 | BLK-RB-X | **A** — stop reason + quality; back-off if clean | |
| 2026-08-16 | CAT-RB-F | **B** — optional 3-day | |
| 2026-08-16 | CAT-RB-T | **A** — keep LSF + partials + myo | |
| 2026-08-16 | EH-RB-V | Inventive pool; repeats OK if effective | |
| 2026-08-16 | EH-RB-T | LSF where it makes sense; rotate slots | |
| 2026-08-15 | TRI-RB-T3 | Clusters not here; still want a catalog home | DE candidate |
| 2026-08-15 | RIT-E10b | **A** — 4th day Hungry + accessory | corrects E10 |
| 2026-08-15 | RIT-RB-P | **C** — one builder RIR 2→1; rest DP | |
| 2026-08-15 | RIT-1 | **B** — skip-ramp one-liner | |
| 2026-08-15 | RIT-2 | Stand E20 | |
| 2026-08-15 | RIT-3 | Stand E5 | |
| 2026-08-15 | RIT-4 | **B** — Ascension card after integrity | |
| 2026-08-15 | RIT-RB-F | **B** — default 3; market 4th on (hungry+acc) | E10b pending |
| 2026-08-16 | XR-calf | Standing DB/KB → hack-calf when strong; **all plans**; volume only differs | never seated; stop per-plan calf votes |
| 2026-08-16 | PN-V-pec / tri | Keep existing mix | |
| 2026-08-16 | XR-pool | No tiny-pool cap — suggest effective movements if they fit the plan | |
| 2026-08-16 | SKEL-V-ham | Supported SLDL = hip-supp DB DL; merge ids; fix tempo | |
| 2026-08-16 | SKEL-V-core | Plank only | |
| 2026-08-16 | PEA-V-core | Two 2-set core sessions, place where it fits | movements TBD |
| 2026-08-16 | PG-V-push | One push: paused bench vs second incline; Thu OHP → rear delt | updates PG-9 defaults |
| 2026-08-16 | PG-V-tri / core / thrust | Leave tri; keep hang+plank; keep SL thrust | |
| 2026-08-16 | SM-V-* | Leave back/ham/delt/push-up fin; rotate abs crunch/wheel; keep standing calf | |
| 2026-08-16 | NO-V-* | BB row; tri mix; drop hammer chest; low-to-high fly; -1 hip-supp set → lowest-volume muscle | |
| 2026-08-16 | APX-V-* | Incline DB; tri mix from laterals/ext; abs picker + suitcase; hack → goblet/high-bar picker | access slots stay |
| 2026-08-16 | VEN-V-* | Goblet→high-bar like Apex; hanging knee + plank rotate; leave RDL; priorities add volume only | pec/tri mix already even |
| 2026-08-16 | ATH-V-* | Tri mix; crunch/wheel rotate; keep flat BB default; keep hack + add leg-press to squat family | |
| 2026-08-16 | KALI-V-* | Earth hack→high-bar; Hunt incline DB; tri mix; crunch/wheel; leave ham | paused bench stays |
| 2026-08-16 | RL-V-* | Pressure hack→leg-press; Afterburn RDL→trap-bar; hammer chest→deficit PU (feet-elevated progression); tri mix | abs not voted |
| 2026-08-16 | IC-V-retire | Park Iron Clock; skip variety until a dedicated selection pass | hide-from-catalog at PROC-1 |
| 2026-08-16 | MIN-V-* | Keep A hack; A RDL→hip-supp; B hammer→30° Smith incline; tri mix | abs leave wheel+hang |
| 2026-08-16 | LAZ-V-* | RDL→hip-supp; hammer→dip/pec-deck picker; tri mix; hack→goblet/high-bar picker | Memory Curve ids |
| 2026-08-16 | QF-V-* | Load picker +high-bar +leg-press; hammer→dip; tri mix + crunch/wheel; leave ham | don't add quad |
| 2026-08-16 | CAT-V-* | Crypt hack→leg-press; keep flat DB; tri mix; crunch only | pec arches stand |
| 2026-08-16 | BLK-V-* | I hack→LP; II LP→hack; paused→hammer; tri mix; +1 cable crunch; drop RDL keep two curls | |
| 2026-08-16 | MON-V-* | No incline; +cable crunch; leave curls; rest of MON-V stands | |
| 2026-08-16 | ATL-V-* | Tri mix; leave wheel+carries; leave flat DB; no G1 dip | XR-front on G2 squat |
| 2026-08-16 | EH-V-* | Keep hammer chest; tri 2+2 mix; crunch/wheel; hack/LP picker | |
| 2026-08-16 | CH-V-* | Keep hammer chest; tri mix; add core on top (cable crunch); keep BB squat; leave ham | 116-set week, add anyway |
| 2026-08-16 | OR-V-* | Keep hammer chest; tri mix; crunch/wheel; Lower B hack/LP picker | last plan this pass |
| 2026-08-16 | XR-mix | Even tri OH/other; pec upper-bias + lower variation; even ham short/long; hip-supp beginner stretch; trapLower sprinkle; core cable-crunch mainstay | quantify volume first |
| 2026-08-16 | MON-V-* | See effectiveness Monolith variety table | quad hack pending |
| 2026-08-16 | PN-V-pec / tri | Keep pec template + OH/close-grip mix | |
| 2026-08-16 | PN-V-core | Keep ab wheel; hanging raise optional → machine crunch | library id TBD |
| 2026-08-16 | PN-V-calf | XR-calf (DB/KB → hack-calf) | |

---

## 10. Open question rounds

- **Now:** Audit documentation closed. Index: `_audit-closeout.md`. PROC-1 still holds (no plan code until the owner opens implementation).
- **Leftovers:** Iron Clock parked; REDLINE abs; Peachy core movements; PROC-2–5.
