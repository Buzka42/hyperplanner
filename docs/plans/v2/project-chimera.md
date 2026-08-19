# Project Chimera

> Unified plan document, v2 format. Fifth and final plan of **Wave 6 (Advanced
> prototypes + roadmap)** — closes the wave. Structure and wiring verified via
> direct source trace of `src/data/plans/projectChimera.ts` (161 lines,
> `definePlan()`-generic with a phase-transform layer),
> `src/features/projectChimera/mutation.ts` (165 lines, the reallocation
> engine), `src/features/onboarding/seedLoads.ts`, `src/types.ts`
> (`ProjectChimeraStatus`), `src/pages/Dashboard.tsx`, `src/pages/Settings.tsx`,
> `src/pages/Onboarding.tsx`, `src/pages/WorkoutView.tsx`,
> `src/contexts/UserContext.tsx`'s `resetProgram()`, `src/data/portfolio.ts`
> and `src/contexts/translations.ts` for the card's stated claims — plus a
> computed dump of `CHIMERA_DAYS`'s full weekly volume and systemic-load
> figures via `npx tsx` (scratch file written and deleted per audit protocol),
> and a live `test_claude` pass: logged in on the first attempt (no
> `ownerUid` lock this session — the account's `ownerUid` matched cleanly),
> found the account already switched into Project Chimera at Week 9 · Block
> III from an unrelated prior session, confirmed a T-9 stale-week
> reproduction, started and logged real sets on **Chimera — Lower A**
> (Barbell Squat, 120kg × 8 twice), pressed **Complete Workout**, and
> cross-checked Firestore directly for the resulting writes.

| | |
|---|---|
| **id** | `project-chimera` |
| **Length** | 16 weeks, 4 days/week, four 4-week blocks (fixed weekday selection at onboarding) |
| **Frequency** | Upper A (Mon), Lower A (Tue), Upper B (Thu), Lower B (Fri) — standard upper/lower split, 26 total slots/week |
| **Declared kind** | A balanced six-quality (squat/hinge/push/pull/unilateral/hypertrophy) upper/lower hypertrophy-strength hybrid whose actual differentiator is meant to be **adaptive volume reallocation**: after each 4-week block, the plan is supposed to propose moving up to 2 weekly sets per quality toward whichever quality the athlete responded to best, with every component of the proposal separately confirmable, and to change nothing at all when there isn't enough comparable evidence |
| **Source** | `src/data/plans/projectChimera.ts` (161 lines) + `src/features/projectChimera/mutation.ts` (165 lines) |
| **Stated promise** | Card `signatureMechanic`: *"Four blocks that quietly reallocate a couple of sets toward whatever you respond to."* Onboarding-card description: *"16 weeks in four blocks, reallocating a little volume toward whatever you actually respond to."* Features: *"Balanced across six qualities"*, *"Small, confirmable changes each block"*, *"No data means no change"*. File header: *"after each block the plan may propose moving up to two weekly sets per quality, and every component of that proposal is previewed and separately confirmable"* |

---

## 1. Headline finding — the plan's entire adaptive mechanic is dead on arrival: not partially wired, not half-built, entirely unreachable

Project Chimera is really **two files bolted together, and only one of them is ever entered.** `projectChimeraStatus` (`types.ts:328-`, `{ allocation?: Record<number, Partial<Record<Quality, number>>>, acceptedExerciseChanges?: Record<string, string> }`) is read exactly once in the whole codebase — `projectChimera.ts`'s `preprocess()` (lines 89-120), which uses `status.allocation`/`status.acceptedExerciseChanges` to nudge set counts and swap exercises. It is **never written anywhere.** A codebase-wide grep for `projectChimeraStatus` returns exactly two hits: its own type declaration and this single read site. `Settings.tsx` and `Onboarding.tsx` — the only two files with any plan-specific write logic in the whole app — contain **zero references to "chimera" in any casing.**

The reallocation engine itself (`mutation.ts`'s `proposeMutation`, `applyMutation`, and `phenotype`) is fully implemented, genuinely careful work — an evidence-gated proposal generator (`HAS_EVIDENCE = 3` comparable exposures before a quality's trend counts as real), a hard per-block reallocation cap (`REALLOCATION_CAP = 2`, doubling to 4 only after two consecutive stalled blocks), a floor that can never be crossed (`MINIMUM_WEEKLY_SETS`), and separately-confirmable components rather than an all-or-nothing proposal. But a codebase-wide grep for `proposeMutation`, `applyMutation`, and `phenotype` returns **zero call sites anywhere outside `mutation.ts` itself** — no dashboard widget, no settings screen, no admin panel, no cron-equivalent, nothing. `projectChimera.ts` doesn't even import these three functions; it only imports the shared `MINIMUM_WEEKLY_SETS` constant and the `Quality` type.

This is the most complete instance of the audit's recurring "declared, wired, unreachable" dead-feature family (Event Horizon T-10, Cathedral T-20, Quadfather T-18, Super Mutant T-60/61, Oracle's scoring half T-73-in-that-doc) — worse than every prior case, because there isn't even a partial UI stub or a status-object read from a settings screen to point to. Nothing in the shipped app ever collects the `QualityEvidence[]` the proposal generator needs (comparable exposures, trend, fatigue, stalled flag — none of these four values are computed or stored anywhere for this plan), nothing ever calls `proposeMutation`, nothing ever renders a proposal, and nothing ever writes `status.allocation` for `preprocess()` to find. **Every athlete, for the entire 16-week length of the plan, runs the identical unmutated base programme in `CHIMERA_DAYS` — the "quiet reallocation" the card promises never fires, not once, for any athlete, ever.** The card's own "No data means no change" bullet is unintentionally, literally true for every single athlete — but for the wrong reason: not because the evidence gate correctly withheld a change, but because the mechanism that would make a change has no way to run at all.

### 1a. What *is* real: the block-level phase transforms

Unlike the reallocation engine, `projectChimera.ts`'s four `phases` (`Block I`–`Block IV`) are ordinary `definePlan()` phase transforms and are genuinely wired and live-confirmed correct. Block II tightens primary-lift reps to `4-6`; Block III leaves primary reps alone but sets `rpe: 9` on everything else; Block IV combines both (`3-5` on primaries, `rpe: 9` elsewhere). Live-confirmed on a Week 9 (Block III) **Chimera — Lower A** session: Barbell Squat (a `primary: true` slot) rendered its unmutated base prescription (4 sets × 5-8 reps, 120kg auto-load), matching the transform's `primary ? slot : {...slot, rpe: 9}` branch exactly. This is a real, if modest, differentiator across the 16 weeks — but it is a fixed, pre-authored periodization scheme, not the adaptive "reallocate toward what you respond to" mechanic the plan is actually named and marketed for.

---

## 2. Structure

### `definePlan()`-generic base, four blocks, one preprocess hook, one seeded-weight hook

| Block | Weeks | Transform |
|---|---|---|
| I | 1-4 | none — base `CHIMERA_DAYS` sets/reps as authored |
| II | 5-8 | primary slots: reps → `4-6` |
| III | 9-12 | non-primary slots: `rpe: 9` |
| IV | 13-16 | primary slots: reps → `3-5`; non-primary slots: `rpe: 9` |

**No block transform ever changes a slot's `sets` value** — confirmed both by reading `phases` in `projectChimera.ts` (each `transform` only touches `reps` or adds `rpe`) and by the live Week 9 session matching the base slot's 4-set squat prescription exactly. The only mechanism that could ever change weekly set counts is the reallocation engine in §1, which never runs. **Weekly volume is therefore constant across all 16 weeks**, same structural shape as Oracle.

### Onboarding

`seedStats: ['squat', 'flatBench', 'conventionalDeadlift']` — three maxes requested at onboarding. `LIFT_SOURCES` (`seedLoads.ts`) correctly derives `barbell-squat` (100%), `flat-barbell-bench-press` (100%), and — via the existing Bench-Domination-precedent derivation table — `trap-bar-deadlift` at **105% of conventional deadlift**, matching the plan's Lower B primary lift. `romanian-deadlift`, machine/dumbbell accessories, and every other slot fall outside `LIFT_SOURCES` and calibrate on the first logged set instead, the same documented design already used by Neural Overload/Immaculate/Oracle.

### `xStatus`, T-2, T-4, T-9, T-22, T-23, reverse-nordic

- **`projectChimeraStatus` exists but is missing from `resetProgram()`'s hardcoded allowlist** (`UserContext.tsx:467-470`; currently only `benchDominationStatus`/`pencilneckStatus`/`skeletonStatus`) — same T-2 family as every other Wave 6 plan. Currently consequence-free for the same reason as Iron Clock's/Lazarus's instances: nothing populates the field to begin with (§1), so there is nothing for a reset to fail to clear.
- **No classic T-4 duplicated-definition drift.** `cable-triceps-extension` and `hammer-curl` each appear twice (Upper A/Upper B); `hack-calf-raise` appears twice (Lower A/Lower B). All three are built through the same shared `s()` slot-builder function with matching arguments each time, same non-drifting pattern as Oracle's `lateral-raise`/`hack-calf-raise`.
- **T-9 reproduces live, first attempt, zero deliberate poisoning.** No dedicated dashboard component for Project Chimera anywhere in `Dashboard.tsx` or `Settings.tsx` (zero matches for "chimera" in either). Confirmed live: the account had already been switched into Project Chimera from a prior session with `programProgress['project-chimera'].completedSessions: 0` and a `startDate` only minutes old, yet the dashboard showed **"WEEK 9 · Chimera — Lower A · Block III"** immediately on login. `localStorage.getItem('dashboardViewWeek-test_claude')` read directly confirmed the stale value `"9"` (leaked from the immediately-prior Oracle testing session) was the entire cause — the identical mechanism as Immaculate's T-69 and Oracle's own T-9 finding, byte-for-byte, now reproduced a fourth time this wave.
- **T-22 does not apply.** `dashboardWidgets: ['program_status', 'workout_history']` — no `strength_chart` requested, so `trackedLiftFor()`'s missing/present case is moot for this plan, same shape as Oracle.
- **T-23 does not apply.** A computed check of every exercise's `weightMode` across all 21 distinct exercise ids in the plan's pool (26 slots total) found zero `weighted-bodyweight` movements — every slot is barbell/dumbbell/machine/cable `external`. `WorkoutView.tsx:842`'s hardcoded allowlist has nothing to exclude here.
- **No `reverse-nordic-curl` anywhere in the exercise pool.** Leg work is `barbell-squat`, `romanian-deadlift`, `front-foot-elevated-bulgarian-split-squat`, `seated-hamstring-curl`, `leg-extension`, `hack-calf-raise`, `trap-bar-deadlift`, `leg-press`, `weighted-step-up`, `lying-leg-curl`, `single-leg-machine-hip-thrust` — no knee-flexion/extension misattribution risk.
- **No `type: 'wave'` exposure — T-3 structurally does not apply.** All slots use `progression: { type: 'double', increment: 2.5 }`, ordinary `genericDoubleProgression`.

---

## 3. Findings

### 3.1 The plan's entire named mechanic — adaptive reallocation — has no path to ever run, for any athlete · **severity: critical, `plan-local`** (T-78)

Detailed in §1. `proposeMutation`, `applyMutation`, and `phenotype` are all exported from `mutation.ts` and never called anywhere else in the repository; `projectChimeraStatus` is read once and written nowhere; `Settings.tsx`/`Onboarding.tsx` contain zero references to Project Chimera at all. Unlike Oracle (half the concept is real) or Immaculate (1 of 6 relationships is reachable), Project Chimera's differentiating mechanic is **100% unreachable** — the cleanest, most complete dead-feature case in the audit to date. The card's second and third feature bullets ("Small, confirmable changes each block", "No data means no change") describe a UI flow — a proposal screen, per-component confirm/decline controls — that does not exist anywhere in `src/pages/**` or `src/features/**`.

### 3.2 Write-path failure reproduces on the ordinary session-completion flow, matching the wave's established partial-split shape · **severity: critical, `shared-bug`** (T-79)

A real Week 9 Lower A session was logged live through the UI (two working sets of Barbell Squat, 120kg × 8) and "Complete Workout" was pressed; the app advanced cleanly to "NEXT SESSION: Chimera — Upper B" with no visible error and the workout history list correctly marked Lower A "Logged." A direct Firestore query confirmed the session log itself **did** persist (`users/test_claude/workouts/s4o5M2tJ0pSpl1sdEvwW`, `programId: project-chimera`, `week: 9`, correct exercise/set data) — but the parallel user-document writes did not: `programProgress['project-chimera'].completedSessions` remained `0`, the portfolio-wide `completedSessions` counter remained unchanged, and `workingLoads` gained no `project-chimera` key at all (the squat's `genericDoubleProgression` write never landed). The user document's own `updateTime` was unchanged from before the session was started, confirming no write to it succeeded at any point in the flow. This matches the exact partial-split shape already seen on Super Mutant (T-57) and Immaculate (T-70) — session log succeeds, user-doc write silently fails — rather than Oracle's total-loss escalation (T-75 in that doc). **Eighth structurally distinct failing write call site this wave** (after Apex Predator T-54, Super Mutant T-57/58, Neural Overload T-64, Immaculate's three sites, Oracle T-75), closing Wave 6 with the same unresolved condition it carried through every prior plan.

### 3.3 `projectChimeraStatus` missing from `resetProgram()`'s allowlist · **severity: low, `shared-bug`** (T-80)

T-2 family; low severity because, per §1, nothing currently populates `projectChimeraStatus` to begin with — but the gap is real underneath that and would surface the moment §3.1 is fixed.

### 3.4 T-9 reproduces cleanly, fourth time this wave · **severity: medium, `shared-bug`** (T-81)

Detailed in §2. No dedicated dashboard component; the shared `dashboardViewWeek-${user.id}` localStorage key leaked the prior Oracle session's "9" directly into a freshly-switched, zero-progress Project Chimera. Consistent with every plan this wave except the four with a genuine dedicated dashboard component in earlier waves.

### 3.5 (Positive pattern, not a bug) The block-level phase transforms are real, live-confirmed, and structurally separate from the dead reallocation engine · **T-82**

Detailed in §1a. Rep-range tightening and accessory RPE bumps across the four blocks genuinely execute and were live-confirmed correct on a Week 9 session. This is a real, if modest, periodization scheme layered under the plan's dead headline mechanic — worth distinguishing clearly in any fix-prioritization discussion, since an athlete on this plan is not running a static program in every respect, just in the one respect the plan is actually named and marketed for.

---

## 4. Weekly volume (fractional sets/muscle/week)

Computed from `EXERCISE_BY_ID`'s native `primary`/`secondary` muscle-group arrays (primary = full set credit, secondary = half credit), summed across `CHIMERA_DAYS`'s base slot definitions. **Because no block transform ever changes any slot's `sets` value (§2), and the reallocation engine that could never runs (§1), this single table applies unchanged to all 16 weeks** — the only per-block variables are rep range and RPE, both zero-effect on set-volume accounting. Checked against the attribution map's known bug list (§25) — none apply (no `reverse-nordic-curl`, no `around-the-worlds`, no `y-raise`, no `wall-slide`, no `loaded-ankle-rock`).

| Muscle | Sets/week (all 16 weeks) |
|---|---|
| Glutes | 23 |
| Hamstrings | 21 |
| Quads | 19 |
| Lats | 14 |
| Upper back | 11.5 |
| Chest | 11 |
| Triceps | 11 |
| Front delt | 10.5 |
| Biceps | 9 |
| Calves | 9 |
| Forearms | 6 |
| Rear delt | 5.5 |
| Brachialis | 4 |
| Side delt | 3.5 |
| Adductors | 3.5 |
| Lower back | 3.5 |
| Traps | 2 |
| Rotator cuff | 1 |

Posterior chain dominates (glutes 23, hamstrings 21, quads 19 — driven by two full lower days carrying squat, RDL, split squat, hamstring curl ×2, trap-bar deadlift, leg press, step-up, and hip thrust), a heavier lower-body lean than Oracle's comparable split (glutes 20/hamstrings 17.5/quads 17). Upper-body pull (lats 14, upper back 11.5) comfortably outweighs chest/triceps (11 each), consistent with the "pull" quality's two dedicated back-focused days. Rotator cuff (1 set/week, secondary-only via `single-arm-reverse-pec-deck`) and traps (2, secondary-only via row/pulldown variants) sit at the bottom, both from the attribution map's known thin-coverage list, but neither is claimed as a plan focus so this isn't a contradiction of the card. Every one of the six named "qualities" (squat/hinge/push/pull/unilateral/hypertrophy) meaningfully exceeds the plan's own `MINIMUM_WEEKLY_SETS` floor in the base allocation — squat 8≥4, hinge 10≥4, push 14≥6, pull 14≥6, unilateral 9≥3, hypertrophy 10≥6 — meaning the base program is honestly balanced even though the reallocation layer that would ever move sets between them never fires.

---

## 5. Systemic / joint load

Computed from each exercise's `intelligence` block × sets, summed across the constant weekly template (same caveat as §4):

| Metric | Value (per week, constant) |
|---|---|
| Systemic cost | 125 |
| Axial cost | 51 |
| Lower-back cost | 38 |
| Knee cost | 36 |
| Elbow cost | 37 |
| Shoulder cost | 21 |

Systemic cost (125) sits just above Oracle (118) and Immaculate (127) — consistent with the portfolio's four-fixed-day, two-systemic-compound-lift (`barbell-squat` primary, `trap-bar-deadlift` primary) pattern. Axial cost (51) and lower-back cost (38) are both the highest of any Wave-6 plan checked so far, driven by the combination of a heavy squat day and a heavy trap-bar-deadlift day landing on separate days of the same week rather than being spread further apart — worth a look if the plan is ever extended to athletes with lower axial tolerance, since no deload week exists anywhere in the 16-week arc (Block III's `rpe: 9` bump on accessories is a harder week for non-primary lifts, not a lighter one).

---

## 6. Ranked improvements

1. **`plan-local` — Wire the reallocation engine end-to-end: build the per-block `QualityEvidence[]` collection (comparable exposures, trend, fatigue, stalled flag — currently computed nowhere for this plan), a proposal-review UI that calls `proposeMutation()` and lets an athlete confirm or decline each `MutationComponent` separately, and the write path that actually persists `projectChimeraStatus.allocation`/`acceptedExerciseChanges`.** This is by a wide margin the single highest-leverage fix in the whole plan — as shipped, every one of the card's three most specific feature claims describes a screen and a data pipeline that do not exist anywhere in the app, and every athlete runs a static periodized program regardless of what "Project Chimera" implies about it.

2. **`shared-bug` — Treat the `test_claude` write-path failure as a closed-out, wave-spanning finding needing owner-level infra investigation, not a per-plan curiosity.** Eight structurally distinct write call sites across five plans this wave (assessment saves, calibration writes, onboarding writes, plan-switch writes, and now an ordinary session-completion write) have all failed identically, with admin-privileged writes of equivalent payloads succeeding instantly at every single isolation point tried. This is the single most consequential open item Wave 6 leaves behind, independent of any individual plan's design.

3. **`shared-bug` — Add `projectChimeraStatus` to `resetProgram()`'s hardcoded allowlist (`UserContext.tsx:467-470`).** Same T-2 family as every other Wave 6 plan; low-consequence only while §3.1's dead engine also means nothing populates the field, but the gap is real underneath that and cheap to close alongside the other five plans' identical gaps in one pass.

4. **`plan-local` — Even ahead of #1 shipping, surface the `phenotype()` label read-only on the dashboard once minimal exposure tracking exists.** The function is a genuinely careful, honestly-caveated ("Shown for interest only. It never changes your programme.") descriptive feature that would cost far less to wire than the full reallocation loop, and would give the plan *something* visibly adaptive-feeling while the harder write-path and confirm-UI work in #1 is pending.

5. **`hypothesis` — Reconsider scheduling `barbell-squat` (Block I-IV primary) and `trap-bar-deadlift` (Block I-IV primary) on separate days of the same week without a lighter day between them**, given this plan's axial (51) and lower-back (38) costs are the highest of any Wave-6 plan checked, and the plan explicitly targets 16 weeks with zero built-in deload — a real fatigue-management question independent of the reallocation-engine finding, worth flagging given the "Sixteen weeks you can actually commit to" prerequisite already signals this is meant for sustained, not short-block, use.

6. **`hypothesis` — Disclose the reallocation engine's actual gating conditions in the onboarding copy once it is wired**, since `HAS_EVIDENCE = 3` comparable exposures and `usable.length < 2` (at least two qualities need evidence before any donor/receiver pair can form) mean a plan that logs inconsistently, or trains only 1-2 qualities with clean comparable data in a given block, could legitimately see zero proposals for a whole block even after the engine is fixed — "No data means no change" is honest but under-explains how much data is actually required, and an athlete debugging "why did nothing change" deserves the same transparency the card already extends to confidence/accuracy on Oracle.

---

## 7. Verdict

**The base program under Project Chimera is a genuinely solid, well-balanced 16-week upper/lower hybrid** — six explicitly-named training qualities each clear their own stated floor in the unmutated template, double progression is the right default mechanism for this population, the block-level rep/RPE periodization is real and live-confirmed correctly wired, and the seeded-opening-load derivation (including the less-obvious trap-bar-deadlift-from-conventional-deadlift 105% mapping) is careful, precedented work consistent with the rest of the portfolio. **But none of that is what the plan is named for, marketed as, or differentiated by.** "Project Chimera" — a name and a card description built entirely around adaptive, evidence-gated volume reallocation — ships with a reallocation engine that is fully authored, thoughtfully constrained (evidence floors, reallocation caps, separately-confirmable components, a hard minimum-sets floor), and **completely unreachable from any code path a real athlete's actions can trigger.** No onboarding step, no settings screen, no dashboard widget, and no workout-completion hook ever collects the evidence the engine needs or calls the engine itself. Layered onto a session where the ordinary act of completing a workout hit the wave's now-familiar write-path failure (the session log saved, the athlete's actual progress data did not) — Project Chimera's honest current state is: **a well-designed static periodized program wearing the name and marketing of an adaptive one, with the adaptive half never built past its own file boundary, closing Wave 6 on the same unresolved shared-write-path condition that opened it on Super Mutant.**

---

```yaml
plan: project-chimera
wave: 6
audit_status: complete
headline_finding: >
  The plan's entire named differentiator — adaptive, evidence-gated volume
  reallocation between six training qualities — has zero reachable code path.
  proposeMutation, applyMutation, and phenotype (src/features/projectChimera/mutation.ts)
  are exported but never called anywhere else in the codebase. projectChimeraStatus
  (which preprocess() reads for status.allocation/acceptedExerciseChanges) is read
  exactly once and written nowhere — Settings.tsx and Onboarding.tsx contain zero
  references to Project Chimera at all. Every athlete runs the identical unmutated
  base CHIMERA_DAYS programme for the entire 16-week length; only the pre-authored
  block-level rep/RPE periodization (not the reallocation engine) ever changes
  anything. The most complete "declared, wired, unreachable" dead-feature case
  found in the audit — no partial UI stub exists anywhere, unlike Oracle (half real)
  or Immaculate (1 of 6 relationships reachable).
findings:
  - id: T-78
    severity: critical
    tag: plan-local
    summary: proposeMutation/applyMutation/phenotype are all exported from mutation.ts but never called anywhere outside it. projectChimeraStatus is read once (preprocess()) and written nowhere in the codebase — zero references to "chimera" anywhere in Settings.tsx or Onboarding.tsx. The plan's entire named adaptive mechanic never runs for any athlete.
  - id: T-79
    severity: critical
    tag: shared-bug
    summary: Write-path failure reproduces on ordinary session completion — a real logged Lower A session's workouts/{id} document saved correctly, but programProgress['project-chimera'].completedSessions, top-level completedSessions, and workingLoads['project-chimera'] all failed to persist (user document updateTime unchanged). Matches the Super Mutant/Immaculate partial-split shape. Eighth structurally distinct failing write call site this wave.
  - id: T-80
    severity: low
    tag: shared-bug
    summary: projectChimeraStatus missing from resetProgram()'s hardcoded allowlist (T-2 family). Currently consequence-free because T-78 means nothing populates the field.
  - id: T-81
    severity: medium
    tag: shared-bug
    summary: T-9 reproduces live, zero deliberate poisoning — no dedicated dashboard component; stale dashboardViewWeek-test_claude leaked "9" from the prior Oracle session directly into a freshly-switched, zero-progress Project Chimera.
  - id: T-82
    severity: informational
    tag: plan-local
    summary: (Positive pattern) Block-level rep/RPE phase transforms are real, correctly wired, and live-confirmed on a Week 9 Block III session — structurally separate from, and unaffected by, the dead reallocation engine in T-78.
t3_status: does not apply — all slots use progression type 'double', no wave/percentage ladders
t9_status: reproduces (live-confirmed, zero deliberate poisoning) — no dedicated dashboard component, stale dashboardViewWeek-test_claude leaked "9" from the prior Oracle session
t22_status: does not apply — dashboardWidgets is [program_status, workout_history], no strength_chart requested
t23_status: does not apply — all 21 distinct exercise ids across 26 slots are weightMode:'external', zero weighted-bodyweight exercises
reverse_nordic_curl: absent
wave_progression: not used
mutation_engine_wiring: not wired at all — proposeMutation/applyMutation/phenotype have zero callers outside mutation.ts; projectChimeraStatus has zero writers anywhere in src/
weekly_volume_top5_all_weeks:
  glutes: 23
  hamstrings: 21
  quads: 19
  lats: 14
  upperBack: 11.5
systemic_load_per_week:
  systemic: 125
  axial: 51
  lowerBack: 38
  knee: 36
  elbow: 37
  shoulder: 21
live_test_login: succeeded on first attempt — ownerUid matched this session cleanly, no lock encountered
live_test_switch_program_write: not exercised this session — account was already on project-chimera from a prior session at time of login
live_test_workout_completion_write: partial failure — workouts/{id} session log saved correctly (real squat sets, correct week/day), but programProgress/completedSessions/workingLoads all failed to persist (user document updateTime unchanged before vs. after)
live_test_t9: confirmed reproducing — dashboard showed "WEEK 9 · Chimera — Lower A · Block III" against a freshly-switched, zero-progress project-chimera programProgress entry, sourced from a stale dashboardViewWeek-test_claude localStorage key left over from the prior Oracle session
```
