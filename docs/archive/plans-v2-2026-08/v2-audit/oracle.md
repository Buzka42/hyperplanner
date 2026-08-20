# Oracle

> Unified plan document, v2 format. Fourth plan of **Wave 6 (Advanced
> prototypes + roadmap)**. Structure and wiring verified via direct source
> trace of `src/data/plans/oracle.ts` (148 lines, `definePlan()`-generic),
> `src/features/oracle/prediction.ts` (255 lines, the prior/model/accuracy
> module), `src/features/workout/progression/oracle.ts` (the exposures-write
> progression hook, confirmed wired via `src/features/workout/progression/index.ts`),
> `src/features/onboarding/seedLoads.ts`, `src/lib/ai.ts`, `src/pages/admin/AiTab.tsx`,
> `src/pages/Dashboard.tsx`, `src/pages/WorkoutView.tsx:842`,
> `src/contexts/UserContext.tsx`'s `resetProgram()` — plus a computed dump of
> `ORACLE_DAYS`'s full weekly volume and systemic-load figures via `npx tsx`
> (scratch file written and deleted per audit protocol), and a live
> `test_claude` pass: hit the account's `ownerUid`-lock on login, isolated it
> against an admin-privileged write (§1c), onboarded into Oracle live (weekday
> selection, "Starting Numbers" squat/bench calibration), opened Week 9
> (Proof phase, admin-seeded to bypass a second write-path failure on
> `switchProgram`), started **Oracle — Upper A**, confirmed the live
> low-confidence prediction copy and set entry flow, logged two sets of Flat
> Barbell Bench Press, hit "Complete Workout", and cross-checked Firestore
> directly for the resulting write.

| | |
|---|---|
| **id** | `oracle` |
| **Length** | 10 weeks, 4 days/week (fixed weekday selection at onboarding — live-confirmed as an ordinary `definePlan()` schedule picker with suggested "Mon·Tue·Thu·Fri" split) |
| **Frequency** | Upper A (Mon), Lower A (Tue), Upper B (Thu), Lower B (Fri) — standard upper/lower split, 24 total slots/week |
| **Declared kind** | A prediction-and-scoring experiment layered on an ordinary double-progression upper/lower plan. Two calibration weeks collect "comparable exposures"; from week 3 every slot is annotated with a predicted load and a stated confidence (low/medium/high) derived from a transparent, inspectable prior (a recency- and RIR-weighted average of past exposures run through the Epley formula); an optional AI model may nudge the prior's output by at most ±7.5%, never override it. The plan's other stated design promise — that prediction error gets scored against what actually happened, in bands ("sharp"/"usable"/"loose"/"unreliable") rather than a single misleading percentage — is a second, independently-built module (`accuracyBand`/`accuracyTrend`/`predictionError` in `prediction.ts`) |
| **Calibration** | Weeks 1-2 are a dedicated `Calibration` phase (`isCalibrationWeek(week) = week <= 2`): every slot gets `rpe: 8` and a "pick a load you can hit, then rank RIR" note instead of a prediction — deliberately building the exposure history the rest of the plan depends on, rather than skipping straight to guessing |
| **Source** | `src/data/plans/oracle.ts` (148 lines) + `src/features/oracle/prediction.ts` (255 lines) + `src/features/workout/progression/oracle.ts` (32 lines) |
| **Stated promise** | Card: *"A 10-week plan that predicts your next session and then shows you how close it got."* Features: *"Weeks 1–2 calibrate", "Confidence is stated, never implied", "Honest accuracy, not a score"*. File header: *"The prescription is always computable from the priors... The model, when the owner has enabled it, may only refine that number inside a bounded window"* |

---

## 1. Headline finding — the plan's entire scoring half ("shows you how close it got") is unreachable dead code, and the AI-refinement toggle does nothing

Oracle is really two modules bolted together: a **prediction engine** (`predictFromPriors`) that is genuinely well-built and does run live, and a **scoring/refinement engine** (`refineWithModel`, `predict(request, useModel)`, `predictionError`, `accuracyBand`, `accuracyTrend`) that is fully exported from `prediction.ts` but **never imported or called from anywhere else in the codebase** — confirmed by a codebase-wide grep for every one of those five export names outside the file that defines them, which returns zero hits.

### 1a. The AI-refinement toggle is inert

`src/pages/admin/AiTab.tsx` exposes a checkbox: *"Oracle predictions — the plan still works without this, using its transparent priors"* — worded to imply that toggling it on makes the plan do something *more* than the transparent-prior fallback. But `oracle.ts`'s `preprocess()` hook (lines 92-119) calls `predictFromPriors()` directly and only that — never `predict()` (the function that actually branches on `useModel` to call `refineWithModel`), and never checks `loadAiConfig()`/`config.features.oracle` at all. Flipping the admin switch on changes literally nothing about what an Oracle athlete sees; the toggle controls a code path the plan's own file never enters.

### 1b. "Shows you how close it got" has no code path that ever runs

`predictionError`, `accuracyBand`, and `accuracyTrend` together are exactly the module that would fulfil the card's second promise — but nothing in `Dashboard.tsx`, `WorkoutView.tsx`, or anywhere else calls them. There is also no data to score even if a UI called them: `oracleStatus.exposures` (the only field Oracle ever writes, via `src/features/workout/progression/oracle.ts`) stores `{exerciseId, date, loadKg, reps, rir, comparable}` for each *actual* logged set, but never the *prediction* that was shown for that set at the time — `predictedKg` is attached transiently to the rendered day object in `preprocess()` and is never persisted anywhere. Even a future dashboard widget built to call `accuracyBand` today would have nothing to feed it beyond the current session's still-in-memory numbers.

### 1c. Net effect, live-confirmed

Live-confirmed on a Week 9 (Proof-phase) Upper A session with a freshly-seeded, empty `oracleStatus.exposures`: every exercise correctly rendered *"Low confidence — No comparable history for this movement yet — the first working set is a calibration set."* — exactly what `predictFromPriors` should produce with zero exposures, confirming the prior-only prediction path genuinely executes end to end. But nothing on the page, in the plan's dashboard widgets (`program_status`, `workout_history` — no `strength_chart`, no bespoke accuracy panel), or anywhere else in the app ever surfaces a "how close did the last prediction get" figure, at any confidence level, for any exercise, at any point in the 10 weeks. The card's second half of its own headline claim is simply never built.

### 1d. A related UI paper cut: "pred 0kg" is displayed as if it were a real number

When `predictFromPriors` has no usable exposures it returns `loadKg: 0` deliberately (the calibration branch, `prediction.ts:105-115`) — a sentinel meaning "no prediction," not a genuine zero-load prescription. `preprocess()` forwards this straight into `predictedKg: prediction.loadKg ?? prediction.range?.[0]` with no distinction for the `offersCalibration` case, and the live workout UI renders it verbatim as `"75kg (pred 0)"` next to the working set — live-confirmed on Flat Barbell Bench Press. An athlete glancing at that line sees a bare "0" next to their actual weight with no obvious meaning, when the honest state is "no prediction exists yet."

---

## 2. Structure

### `definePlan()`-generic base, four phases (label-only), one prediction hook, one progression hook

| Phase | Weeks | Set-count transform | `preprocessDay` behavior |
|---|---|---|---|
| Calibration | 1-2 | none | forces `rpe: 8`, replaces notes with a "pick a load, rank RIR" instruction; no prediction shown |
| Reading | 3-5 | none | prediction shown per exposures-to-date |
| Prediction | 6-8 | none | prediction shown per exposures-to-date |
| Proof | 9-10 | none | prediction shown per exposures-to-date |

**Unlike Immaculate, Oracle's phases carry no base-data set-count differences at all** — confirmed both by reading `phases` in `oracle.ts` (only `Calibration` has a `transform`, and it only sets `rpe`, never `sets`) and live (Week 9's rendered sets — 4/4/3/3/2/2/2 across the 7 Upper A exercises — matched `ORACLE_DAYS`'s base slot definitions exactly). **Weekly volume is therefore constant across all 10 weeks** — a genuine structural difference from Immaculate, where at least the Re-Test taper produced a real, if late, volume change.

### Onboarding

Live-confirmed: weekday selection (4/4 required, "Mon·Tue·Thu·Fri" suggested split) → a "Starting Numbers" step requesting Squat 1RM and Bench Press 1RM (`onboarding.seedStats: ['squat', 'flatBench']`), each optional and explicitly captioned "skip anything you are unsure of." `seedLoadFor()` (from `src/features/onboarding/seedLoads.ts`) only derives openers for `barbell-squat` and `flat-barbell-bench-press` — Oracle's other 22 slots (`hack-squat`, `incline-dumbbell-bench-press`, machine/dumbbell accessories) are deliberately outside `LIFT_SOURCES` and calibrate on the athlete's first logged set instead, matching the file's own documented design rule ("machine movements are deliberately absent... those calibrate on the first working set").

### `xStatus`, T-2, T-4, T-9, T-22, T-23, reverse-nordic

- **`oracleStatus` exists (`types.ts:389`, `{ exposures: Exposure[] }`) but is missing from `resetProgram()`'s hardcoded allowlist** (`UserContext.tsx:467-470`, currently only `benchDominationStatus`/`pencilneckStatus`/`skeletonStatus`) — same T-2 family as Athena/Kali/House of Iron/Apex Predator/Super Mutant/Neural Overload. "Reset Current Progress" would silently leave an athlete's full exposure history in place while claiming to reset them to Week 1 Day 1, meaning `predictFromPriors` would keep predicting off pre-reset history even after a deliberate reset.
- **No classic T-4 duplicated-definition drift.** `lateral-raise` and `hack-calf-raise` each appear twice across the week (Upper A/Upper B, Lower A/Lower B respectively) but both are built through the same shared `s()` slot-builder function with the same arguments each time — no divergent branch to drift.
- **T-9 reproduces live, first attempt, with zero deliberate poisoning.** No dedicated dashboard component for Oracle anywhere in `Dashboard.tsx` (zero matches for "oracle" there). Confirmed live: after switching from Immaculate (`dashboardViewWeek-test_claude` last set to `"9"`) into a freshly admin-seeded Oracle `programProgress` entry (`completedSessions: 0`, `startDate` minutes old), the dashboard immediately showed **"WEEK 9 · Oracle — Upper A · Proof"**, and `localStorage.getItem('dashboardViewWeek-test_claude')` read directly confirmed the stale `"9"` was the entire cause — the exact same mechanism as Immaculate's T-69, byte-for-byte.
- **T-22 does not apply.** `dashboardWidgets: ['program_status', 'workout_history']` — no `strength_chart` requested, so `trackedLiftFor()`'s missing/present case is moot for this plan.
- **T-23 does not apply.** A computed check of every exercise `weightMode` across all 24 of Oracle's slots found zero `weighted-bodyweight` movements — every slot is `external` (barbell/dumbbell/machine/cable). `WorkoutView.tsx:842`'s hardcoded allowlist has nothing to exclude here.
- **No `reverse-nordic-curl` anywhere in the exercise pool.** Leg work is `barbell-squat`, `romanian-deadlift`, `leg-press`, `seated-hamstring-curl`, `leg-extension`, `hack-calf-raise`, `hack-squat`, `lying-leg-curl`, `front-foot-elevated-bulgarian-split-squat`, `single-leg-machine-hip-thrust` — no knee-flexion/extension misattribution risk.
- **No `type: 'wave'` exposure — T-3 structurally does not apply.** Ordinary rep-range slots with `genericDoubleProgression` as the fallback inside `oracleProgression`; no percentage-of-1RM ladders.
- **`oracleProgression` (the exposures-writer) is correctly registered** in `src/features/workout/progression/index.ts:44` (`oracle: oracleProgression`) — the mechanism is genuinely wired into the save path, not an orphaned function. It wraps `genericDoubleProgression` and additionally records the best completed set of each exercise into `oracleStatus.exposures` on save — this write, and only this write, failed live this session (§3.3), not because it is unwired but because of the same shared write-path condition every other Wave 6 plan has hit.

---

## 3. Findings

### 3.1 The accuracy/scoring half of the plan's headline claim is entirely dead — no call site, no persisted data to score, and an inert admin toggle · **severity: critical, `plan-local`**

Detailed in §1. `refineWithModel`, `predict(request, useModel)`, `predictionError`, `accuracyBand`, and `accuracyTrend` are all exported from `prediction.ts` and never called anywhere else in the repository. The admin AI panel's "Oracle predictions" toggle, worded to imply it activates model-assisted refinement, changes nothing observable because `oracle.ts`'s `preprocess()` never checks the AI config and never calls `predict()`/`refineWithModel()` — it calls `predictFromPriors()` directly, unconditionally. Even if a future UI called `accuracyBand`, there is currently no stored predicted-vs-actual ledger to feed it: `oracleStatus.exposures` records only what was actually lifted, never what was predicted for that same set. The plan's card promises two things ("predicts your next session and then shows you how close it got"); only the first half is real.

### 3.2 "pred 0kg" is rendered as a literal number instead of a "no prediction" state · **severity: low, `plan-local`**

Detailed in §1d. `predictFromPriors`'s `loadKg: 0` sentinel for the no-exposure case is forwarded into the UI unchanged, live-confirmed as `"75kg (pred 0)"` next to a real working weight — a confusing artifact for exactly the calibration-week and early-history athletes the "low confidence" copy is meant to be reassuring, not confusing.

### 3.3 Write-path failure escalates to a total loss this session — session log, `oracleStatus`, and progress counters all failed to persist · **severity: critical, `shared-bug`**

This session's `test_claude` document had **no `ownerUid` field at all** (confirmed via a direct admin read before any intervention, same shape as Immaculate's T-70) — login's client-side self-claim failed `permission-denied`, surfacing the raw untranslated Firebase error rather than the friendlier claimed-keyword message. Isolated per the audit's standard method: an admin-privileged write setting `ownerUid` to this session's own anonymous auth uid (read from the browser's `firebaseLocalStorageDb` IndexedDB store) succeeded instantly and unblocked login on the very next attempt.

After login, `switchProgram`'s write into Oracle also failed `permission-denied` (console: `Registration failed`) — worked around with a second isolating admin write (`programId`, `selectedDays`, `scheduleMode`, `programProgress.oracle`, `stats.flatBench`), which again succeeded instantly with the identical payload, confirming a client-write-path failure rather than a data-shape problem.

**This session's third failure is a new escalation, not a repeat of the prior split-failure shape.** Immaculate and Super Mutant both showed the `workouts/{id}` session log saving correctly while only the parallel user-document write failed. Here, after a real Week 9 Upper A session (2 sets of Flat Barbell Bench Press logged through the live UI, "Complete Workout" pressed), a direct Firestore query of `users/test_claude/workouts` returned **zero** matching documents for this session — the session log itself did not save, in addition to `oracleStatus.exposures` remaining completely absent and `completedSessions`/`programProgress.oracle.completedSessions` staying unchanged at `0` with an unchanged `updateTime`. Every write attempted this session failed identically; the two admin-privileged writes of equivalent payloads (login self-claim, `switchProgram`) both succeeded instantly, meeting the audit's standard bar for "real app bug, not account state." This is the **seventh structurally distinct write call site** with the identical failure shape this wave (after Apex Predator T-54, Super Mutant T-57/58, Neural Overload T-64, Immaculate T-70's three sites), and the first to show a **total** loss (all three writes in one completed-session flow) rather than a partial split.

### 3.4 `oracleStatus` missing from `resetProgram()`'s allowlist · **severity: low, `shared-bug`**

Detailed in §2. T-2 family; low severity because, as with several prior plans this wave, the write-path failure (§3.3) currently means little ever populates `oracleStatus` to begin with — but the gap is real and would surface the moment §3.3 is fixed.

---

## 4. Weekly volume (fractional sets/muscle/week)

Computed from `EXERCISE_BY_ID`'s native `primary`/`secondary` muscle-group arrays (primary = full set credit, secondary = half credit), summed across `ORACLE_DAYS`'s base slot definitions. **Because no phase changes any slot's `sets` value (§2), this single table applies unchanged to all 10 weeks** — the only per-week variable is the predicted-load annotation, which has zero effect on volume. Every exercise checked against the attribution map's known bug list (§25) — none apply (no `reverse-nordic-curl`, no `around-the-worlds`, no `y-raise`, no `wall-slide`, no `loaded-ankle-rock`).

| Muscle | Sets/week (all 10 weeks) |
|---|---|
| Glutes | 20 |
| Hamstrings | 17.5 |
| Quads | 17 |
| Chest | 11 |
| Triceps | 11 |
| Lats | 11 |
| Front delt | 10.5 |
| Upper back | 9 |
| Calves | 9 |
| Biceps | 8.5 |
| Side delt | 5.5 |
| Adductors | 5.5 |
| Rear delt | 5 |
| Brachialis | 3 |
| Forearms | 2 |
| Abs | 2 |
| Lower back | 1.5 |
| Rotator cuff | 1.5 |
| Obliques | 1 |

Posterior chain and quads lead comfortably (glutes/hamstrings/quads driven by two full lower days with squat, RDL, leg press, hamstring curl, leg extension, split squat, and hip thrust all present), consistent with a balanced upper/lower split rather than an upper-body-only design. Abs/obliques are thin (2 and 1 sets/week — only `ab-wheel` on Lower B), the lowest of any muscle group with a dedicated slot; not necessarily a defect (many plans in the portfolio treat abs as incidental), but worth noting against the ≥5-sets calibration lens (§7 of `_audit-status.md`) since Oracle otherwise sits at moderate-to-good volume everywhere else. No muscle from the attribution map's zero-coverage list gets a dedicated loader here either (soleus, tibialis anterior, direct adductors, direct erectors, upper/lower traps, serratus, isolated upper pec all absent or secondary-only, consistent with every other plan audited).

---

## 5. Systemic / joint load

Computed from each exercise's `intelligence` block × sets, summed across the constant weekly template (same caveat as §4 — identical every week):

| Metric | Value (per week, constant) |
|---|---|
| Systemic cost | 118 |
| Axial cost | 41 |
| Lower-back cost | 21 |
| Knee cost | 40 |
| Elbow cost | 37 |
| Shoulder cost | 24 |

Systemic cost (118) sits in the same mid-to-upper band as Immaculate (127) and other four-fixed-day compound-first plans in the portfolio — two systemic-compound-tagged lifts a week (`barbell-squat`, `hack-squat`) plus a full RDL/leg-press/split-squat lower rotation account for the knee cost (40) being the single highest individual metric, ahead of even axial cost (41 is close but driven mostly by the two squat variants and the two bench variants rather than a single dominant lift). No deload week exists anywhere in the 10-week arc — Calibration's `rpe: 8` cap is the closest the plan comes to a lighter phase, and it is a target-RPE change, not a set or load reduction.

---

## 6. Ranked improvements

1. **`plan-local` — Wire `predict(request, useModel)` (which already branches correctly on the AI config) into `oracle.ts`'s `preprocessDay`, gated by `loadAiConfig().features.oracle`, instead of calling `predictFromPriors()` directly and unconditionally.** This is the single highest-leverage fix: as shipped, the admin panel's "Oracle predictions" toggle is pure UI theater, and the file's own header comment ("The model, when the owner has enabled it, may only refine that number") describes a code path that is never entered from anywhere in the plan.

2. **`plan-local` — Persist a `predictions` ledger inside `oracleStatus` (predicted load/reps/confidence at the moment a set was logged, alongside the existing `exposures` array of what actually happened) and build a dashboard/workout-view surface that calls `predictionError`/`accuracyBand`/`accuracyTrend` against it.** Without this, even fixing #1 leaves the card's second promise — "shows you how close it got" — permanently unbuildable, because the data needed to score a prediction against its outcome is never recorded anywhere today.

3. **`shared-bug` — Investigate the `test_claude` write-path failure as an urgent, worsening account/session-state issue.** This session is the first to show a *total* loss on a completed-session save (session log, plan-local status, and portfolio-wide counters all failed together, not the partial split seen on Immaculate/Super Mutant) — the seventh structurally distinct write call site this wave with the identical shape, and admin-privileged writes of equivalent payloads succeeded instantly at every isolation point tried. This remains the single highest-priority infra item for the owner across the whole wave.

4. **`plan-local` — Fix the `"pred 0kg"` display to show nothing (or an explicit "no prediction yet" label) when `prediction.offersCalibration` is true and `loadKg` is the no-data sentinel, rather than rendering the literal `0`.** A small, low-cost fix that removes a genuinely confusing artifact from exactly the early-history sessions where the "low confidence" copy is trying hardest to be reassuring.

5. **`shared-bug` — Add `oracleStatus` to `resetProgram()`'s hardcoded allowlist (`UserContext.tsx:467-470`).** Same T-2 family as five prior plans this wave; low-consequence only while §3.3's write failure also prevents the field from populating in the first place, but the gap is real underneath that.

6. **`hypothesis` — Consider a small "structural balance"-style panel showing each exercise's live prediction and confidence directly on the dashboard, not just inside the active workout.** The prediction mechanic itself (unlike its scoring half) is genuinely well-built and live-confirmed working — surfacing it earlier than the moment an athlete opens a specific exercise's set-entry screen would make the plan's core differentiator (which is real) more visible day to day, echoing the audit's repeated finding that this portfolio's best mechanics are frequently invisible unless an athlete is already mid-set.

---

## 7. Verdict

**The half of Oracle that is actually built is the more scientifically defensible half.** `predictFromPriors` is a genuinely careful piece of engineering: Epley-based load-from-reps conversion, RIR added back as evidence about true capability rather than decorated output, recency-weighted averaging that discounts stale data on a sensible half-life-style curve, a confidence gate that requires both volume of comparable evidence *and* recency before claiming high confidence, and an honest "low confidence, calibrate" fallback instead of asserting a number from nothing — live-confirmed rendering exactly that fallback correctly on a fresh Week 9 session with no history. The optional AI-refinement layer is architecturally sound too, with a hard ±7.5% clamp that makes a hallucinating model structurally incapable of producing a dangerous prescription. **But the plan's actual headline promise is a two-part claim, and only the first part exists.** "Shows you how close it got" — the accuracy-scoring half, the thing that would let an athlete actually judge whether Oracle is worth trusting over time — has zero call sites anywhere in the app, zero persisted data to feed it even if it were called, and an admin toggle that implies a live AI-refinement feature which, as shipped, cannot ever fire. Layered on top of a session where the completed-workout save failed to persist *anything at all* (§3.3) — a first for this wave, worse than every prior plan's partial-failure pattern — Oracle's honest current state is: **a genuinely good prediction engine with no way to prove it works, wrapped in a scoring promise that was never built, sitting inside the wave's worst-yet instance of the shared write-path bug.**

---

```yaml
plan: oracle
wave: 6
audit_status: complete
headline_finding: >
  The plan's entire scoring/accuracy half — "shows you how close it got" —
  is dead code. refineWithModel, predict(request, useModel), predictionError,
  accuracyBand, and accuracyTrend are all exported from prediction.ts and
  never called from anywhere else in the codebase. The admin AI panel's
  "Oracle predictions" toggle implies live model-assisted refinement but
  changes nothing observable, because preprocess() calls predictFromPriors()
  directly and unconditionally, never checking the AI config or calling
  predict()/refineWithModel(). Even a future UI built to call accuracyBand
  would have no data to score: oracleStatus.exposures records only actual
  logged sets, never the prediction that was shown for them. Only the
  prior-only prediction half of the plan's headline claim is real.
findings:
  - id: T-73
    severity: critical
    tag: plan-local
    summary: refineWithModel/predict(useModel)/predictionError/accuracyBand/accuracyTrend are all exported but never called anywhere outside prediction.ts. The admin "Oracle predictions" AI toggle is inert (preprocess() never checks the AI config). No predicted-vs-actual ledger is ever persisted, so the "shows you how close it got" half of the plan's headline claim has neither a call site nor data to score.
  - id: T-74
    severity: low
    tag: plan-local
    summary: predictFromPriors' loadKg:0 no-data sentinel is forwarded verbatim into the live UI as "pred 0kg" instead of an explicit no-prediction state, live-confirmed on Flat Barbell Bench Press during a fresh Week 9 session.
  - id: T-75
    severity: critical
    tag: shared-bug
    summary: Write-path failure escalates to total loss — session log (workouts/{id}), oracleStatus.exposures, and completedSessions/programProgress counters all failed to persist after a real completed workout, worse than the partial session-log-succeeds/user-doc-fails split seen on Immaculate and Super Mutant. Seventh structurally distinct failing write call site this wave; admin-privileged writes of equivalent payloads succeeded instantly at every isolation point.
  - id: T-76
    severity: low
    tag: shared-bug
    summary: oracleStatus missing from resetProgram()'s hardcoded allowlist (T-2 family).
t3_status: does not apply — no type:'wave' or percentage-ladder progression used
t9_status: reproduces (live-confirmed, zero deliberate poisoning) — no dedicated dashboard component, stale dashboardViewWeek-test_claude leaked "9" from the prior Immaculate session directly into a freshly-seeded, zero-progress Oracle
t22_status: does not apply — dashboardWidgets is [program_status, workout_history], no strength_chart requested
t23_status: does not apply — all 24 slots are weightMode:'external', zero weighted-bodyweight exercises
reverse_nordic_curl: absent
wave_progression: not used
oracle_progression_wiring: correctly registered in src/features/workout/progression/index.ts (oracle: oracleProgression) — genuinely wired, not orphaned; the exposures write itself failed live this session due to T-75, not a wiring gap
weekly_volume_top5_all_weeks:
  glutes: 20
  hamstrings: 17.5
  quads: 17
  chest: 11
  triceps: 11
systemic_load_per_week:
  systemic: 118
  axial: 41
  lowerBack: 21
  knee: 40
  elbow: 37
  shoulder: 24
live_test_login: failed initially (permission-denied on ownerUid self-claim on a doc with no ownerUid field at all), succeeded after admin-privileged write of the identical payload
live_test_switch_program_write: failed (permission-denied, console "Registration failed"), admin-seed used to unblock (programId, selectedDays, scheduleMode, programProgress.oracle, stats.flatBench)
live_test_workout_completion_write: total failure — no workouts/{id} document created for the session at all (unlike prior Wave 6 plans' partial split), oracleStatus.exposures absent, completedSessions/programProgress.oracle.completedSessions unchanged
live_test_prediction_ui: confirmed correct — a fresh Week 9 session with empty oracleStatus.exposures rendered "Low confidence — No comparable history for this movement yet" on every exercise, matching predictFromPriors' no-estimate branch exactly
```
