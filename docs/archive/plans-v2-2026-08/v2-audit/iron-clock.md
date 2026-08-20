# Iron Clock

> Unified plan document, v2 format. Supersedes `docs/plans/iron-clock.md`.
> Opens **Wave 5 (Conditioning / constrained)**. Volume from
> `docs/analysis/exercise-attribution-map.md`; systemic figures computed
> programmatically from each movement's `intelligence` block via a throwaway
> `tsx` script (deleted after use). Wiring verified via direct source trace of
> `src/data/plans/ironClock.ts`, `src/features/ironClock/progression.ts`,
> `src/pages/WorkoutView.tsx`, `src/pages/Dashboard.tsx`, and
> `src/contexts/UserContext.tsx` — **and a full `test_claude` live pass**:
> logged in on the first attempt, switched into Iron Clock from Kali, selected
> the Mon/Tue/Thu/Fri fixed schedule, completed a full anchor (3/3 sets) plus
> one full 5-round density block at top-of-range reps, completed the workout,
> then cross-checked the resulting document directly in Firestore. All
> findings below are live-confirmed unless explicitly marked otherwise.

| | |
|---|---|
| **id** | `iron-clock` |
| **Length** | 8 weeks (Winding 1-2, Tension 3-5, Escapement 6-7, Benchmark 8) |
| **Frequency** | 4 sessions (fixed weekdays chosen at switch-in, e.g. Mon/Tue/Thu/Fri), or an internal 3-day full-body tree (`iron-clock-3day-internal`) selected via `planPreferences['iron-clock'].scheduleMode` |
| **Weekly sets** | 108 rounds/week in the 4-day tree at base (Winding) prescription — 4 days × (3 anchor + 6 × 4 density rounds) |
| **Declared kind** | conditioning/density hypertrophy-hybrid, non-repeatable (8-week arc) |
| **Calibration** | none — no stats/1RMs required at onboarding |
| **Source** | `src/data/plans/ironClock.ts` (178 lines, `definePlan()`-generic with a `preprocessDay` hook for the 3-day/4-day switch) + `src/features/ironClock/progression.ts` (pure density-ladder functions) |
| **Stated promise** | *"An 8-week plan where the clock, not the plate, is the thing you beat."* Features: 4-day mode or 3-day full body · density blocks with visible pacing · reps, then time, then load · round-by-round quality. |

---

## 1. Headline finding

**The plan's entire signature mechanic — a carefully-designed, unit-tested "reps → time → load" density ladder — has no write path anywhere in the running app. `ironClockStatus` (the field the ladder reads and writes state to) is declared in `types.ts`, read exactly once for a cosmetic notes string, and never written by any code path. Confirmed live: a fully logged Week-7 session (anchor 3/3 sets, one complete 5-round density block, all at or above the top of the prescribed rep range) produced zero `ironClockStatus` field in Firestore. Instead, every exercise in the plan — anchor and density block alike — silently falls through to the portfolio's generic double-progression handler, which bumps `workingLoads.iron-clock[exerciseId]` by a flat +2.5 kg whenever the first set hits the top of the rep range, with no concept of rounds, duration, pairing, or quality at all.**

### 1a. The ladder is real, tested, and 100% unreachable

`src/features/ironClock/progression.ts` implements exactly what the card promises: `startingState`, `advanceDensityBlock` (reps → time → load → reset, gated on `quality: 'clean' | 'borderline' | 'invalid'`), `compareBlocks` (strict/adapted/incomparable lineage comparison), `blockDensity` (work-per-minute), and `restWarning`. `scripts/verify-iron-clock.ts` exercises all of it and passes. A portfolio-wide grep for every exported function name (`advanceDensityBlock`, `compareBlocks`, `blockDensity`, `restWarning`, `startingState`) turns up **zero callers anywhere in `src/`** outside `progression.ts` itself and the verify script — not in `WorkoutView.tsx`, not in any progression handler, not in `Dashboard.tsx`. `ironClockStatus` itself is read exactly once, in `ironClock.ts`'s `applyLadder()`, purely to append a `Ladder: {step} since week {sinceWeek}` string to an exercise's `notes` field if the state happens to already exist — it has no writer to ever populate that state in the first place.

### 1b. Live confirmation: `genericDoubleProgression` runs instead, and ignores everything the card claims

`src/features/workout/progression/index.ts`'s `PROGRESSION_HANDLERS` registry has no `iron-clock` entry, so `progressionHandlerFor('iron-clock')` falls back to `genericDoubleProgression` (`src/features/workout/progression/genericDouble.ts`) for every exercise in the plan, anchor or density block alike. That handler reads `sets[0]`'s logged weight and the *first* set's completion against `topOfRange(exercise.target.reps)`, and simply increments `workingLoads.iron-clock[id]` by `topSetBackoff?.incrementKg ?? 2.5` — it has no field for rounds completed, no field for block duration, no concept of a paired A1/A2 block, and no `quality` input at all.

Confirmed live this session: after logging Hack Squat (the anchor) at 40kg×8×3 (all sets at the top of its 5-8 range) and Incline DB Bench Press (a density block, target 8-10 reps) at 10kg×10×5 rounds, then completing the workout, Firestore shows:

```
workingLoads.iron-clock.hack-squat: 42.5          (+2.5kg, ordinary double progression)
workingLoads.iron-clock.incline-dumbbell-bench-press: 10
```

and **no `ironClockStatus` field anywhere in the document** — no `stage`, no `history`, nothing. The density block's 5 completed rounds at 10/10 reps produced exactly the same kind of write as the anchor's 3 straight sets: a flat kg number keyed by exercise id. The card's "rounds first, then time, then load" ladder — the plan's one differentiating idea — never executes. Nor does the app's UI ever prompt for the `quality: clean/borderline/invalid` confirmation the ladder's own gating logic requires; the BlockTimer that fires alongside a density block (`WorkoutView.tsx:1032`, shared with REDLINE) is a pure countdown display with no round-completion or quality capture wired to it at all.

This is the worst version yet of the "declared but unwritten" dead-feature pattern that has recurred across Waves 3-4 (Event Horizon's T-10, Overhead Dominion's T-14/T-15, Quadfather's T-18, Cathedral's T-20, House of Iron's narrower AMRAP gap T-29): those were each one feature or one status field on an otherwise-working plan. Here it is the entire progression mechanic the plan is built and named around.

---

## 2. Structure

### Weekly template (Winding phase, weeks 1-2, base prescription, 4-day mode)

| Day | Anchor (3×, rest 180s) | Density A (10:00) | Density B (8:00) | Density C (6:00) |
|---|---|---|---|---|
| First Bell (Mon) | Hack Squat 5-8 | Incline DB BP + SA Hammer Row 4×8-10 | Seated Ham Curl 4×10-12 + Lateral Raise 4×12-15 | KB Swing 4×12-15 + Ab Wheel 4×8-12 |
| Second Bell (Tue) | Lat Pulldown 6-8 | FFE Bulgarian Split Squat + Hammer Chest Press 4×8-10 | Hip-Supported DB DL 4×8-12 + SA Reverse Pec Deck 4×12-15 | Hack Calf 4×12-20 + Hammer Curl 4×8-15 |
| Third Bell (Thu) | Paused Bench 4-6 | Goblet Skater Squat + Hammer Pulldown 4×8-10 | Leg Extension 4×10-15 + Lat Prayer 4×10-15 | Hammer Curl + Cable Tri Ext 4×8-15 |
| Final Bell (Fri) | Romanian Deadlift 5-8 | Hammer Chest Press + SA Hammer Row 4×8-12 | Deficit Reverse Lunge 4×8-12 + Lateral Raise 4×12-20 | Hack Calf 4×12-20 + Cable Tri Ext 4×10-15 |

108 rounds/week at base (27/day: 3 anchor + 24 density). Density slots use `restSeconds: 0` — the alternating window is the rest mechanism. The internal 3-day tree covers the same three muscle groupings across three sessions instead of four, swapping two slots per session (Ab Wheel → Hanging Knee Raise, Lat Pulldown → Hammer Pulldown) to fit a full-body-per-day layout.

### Phases

| Phase | Weeks | Change |
|---|---|---|
| Winding | 1-2 | Base windows (10:00/8:00/6:00), base rounds (4) |
| Tension | 3-5 | Density slots: **+1 round** (4→5) |
| Escapement | 6-7 | +1 round (4→5) **and** window × 5/6 (10:00→8:20, 8:00→6:40, 6:00→5:00) |
| Benchmark | 8 | Opening windows return — comparable to week 1, not to week 7's compressed clock |

Confirmed live: switching in showed "First Bell · Escapement / WEEK 7" (the T-9 bug, §3.2), and once the phase actually rendered it correctly showed 5 rounds/block and compressed windows (8:00/6:00/5:00 displayed, matching Escapement's 5/6 compression of the base windows) — the phase transform logic itself is correctly wired, independent of the T-9 week-selection bug that put it on screen in the first place.

### `xStatus`, T-2, T-3, T-4, T-9, T-22, T-23, reverse-nordic

- **`ironClockStatus`** is declared, read once for display, and **never written anywhere** (§1). Because nothing is ever written to it, `resetProgram()`'s allowlist gap (`UserContext.tsx:467-470`, still only `benchDominationStatus`/`pencilneckStatus`/`skeletonStatus`) is **structurally moot for this plan** — there is no stale ladder state a reset could fail to clear, because no ladder state is ever created in the first place. This is a different shape from every prior T-2 finding (Athena/Kali/House of Iron all have real, written state a reset should clear but doesn't) — worth recording as the first plan where "missing from the allowlist" causes zero practical harm, precisely because the underlying write path is itself dead.
- **`resetProgram()` never touches `workingLoads` for any plan** (confirmed by reading the function in full) — this is universal, not Iron Clock-specific, and consistent with the "Reset Current Progress" UI copy's own promise ("Stats and history are preserved"). Not a bug.
- **No `type: 'wave'` anywhere in the plan file** — zero T-3 exposure.
- **No classic T-4 duplicated-definition drift.** `hammer-curl`, `hammer-chest-press`, `single-arm-hammer-row`, `lateral-raise`, `hack-calf-raise`, and `cable-triceps-extension` each appear on two different days, but every occurrence is an independent call to the `block()` helper with its own literal set/rep/window arguments — the same clean pattern seen on every `definePlan()`-generic plan since Wave 2, no shared mutable definition to drift.
- **No `reverse-nordic-curl`** anywhere in the exercise pool — clean, consistent with every plan since Quadfather.
- **T-9 reproduces live, breaking Wave 4's 4/4 dedicated-dashboard-immunity streak** — detailed in §3.2. Iron Clock has no dedicated dashboard component (`ui.dashboardWidgets: ['program_status', 'workout_history']`, both generic widgets on the shared `Dashboard.tsx` path); this is the first Wave-5 data point and it goes the other way from all of Wave 4.
- **T-22 does not apply.** `dashboardWidgets` never requests `strength_chart`, and no `trackedLiftFor()` call exists in the plan's own code.
- **T-23 does not apply, structurally.** None of Iron Clock's 22 distinct movements use `weightMode: 'weighted-bodyweight'` — every slot is `external`-load (dumbbell, hack-squat, cable, hammer-strength, barbell, kettlebell), so the `totalSystemWeightKg` gate that caught Workhorse/Gravity Is Optional/Kali never has a triggering exercise to hit in the first place.

---

## 3. Findings

### 3.1 The entire density-ladder progression system is dead code · **severity: critical, `plan-local`**

Detailed in §1. The plan's one distinguishing mechanic — "reps, then time, then load" — never executes. `genericDoubleProgression` silently substitutes an ordinary rep-range load bump for every exercise, anchor and density block alike, with no way for an athlete to ever see a round-count increase, a window compression, or a quality-gated load jump. Live-confirmed via a full logged session (§1b). Given this is the plan's core identity (the card's four bullet points are "density blocks with visible pacing," "reps then time then load," "round-by-round quality" — three of four directly describe the dead mechanic), this is a stronger version of Event Horizon's T-10 and closer in severity to a plan simply not having the feature it's named for.

### 3.2 T-9 reproduces live, first Wave-5 plan, breaking Wave 4's clean sweep · **severity: high, `shared-bug`**

Switched into Iron Clock from Kali (last viewed at Week 1) and the dashboard immediately rendered "First Bell · Escapement / WEEK 7" — despite `programProgress['iron-clock']` not existing at all yet in Firestore (confirmed via a direct read: zero prior progress, zero `ironClockStatus`). `localStorage.getItem('dashboardViewWeek-test_claude')` read `"7"`, a leftover from a different plan viewed earlier in the session — the exact T-9 mechanism (`Dashboard.tsx:79,187-189`) documented since Monolith. After logging and completing a real session, the dashboard correctly resolved to Week 1 on the next render, matching the established recovery behavior. Iron Clock has no dedicated dashboard component, so it gets no T-9 immunity — the first Wave-5 data point going the opposite direction from Wave 4's 4/4 immune result, evidence that "dedicated dashboard" (not "conditioning vs. powerbuilding category") is what predicts immunity, exactly as flagged going into this wave.

### 3.3 `ironClockStatus` missing from `resetProgram()`'s allowlist, but with zero practical consequence · **severity: none (structural, not a live bug)**

Detailed in §2. Same T-2-shaped gap as every plan since Athena, but here it causes no observable harm, since the field it would need to clear is never populated to begin with (§1). Worth fixing alongside the write-path fix (§6.1) rather than as a standalone ticket, since adding the write path without also fixing the allowlist would recreate the same live-consequence gap seen on Athena/Kali/House of Iron.

### 3.4 BlockTimer is a decorative countdown with no data capture · **severity: medium, `plan-local`**

The density-block timer shown during a workout (`WorkoutView.tsx:1032`, shared with REDLINE) starts, pauses, and finishes a visible countdown per block, but nothing observed in the live session ties a block's "FINISH" action to a quality prompt, a round tally, or any write distinct from the ordinary per-set LOG SET flow. The athlete-facing pacing cue is real and visible; the "round-by-round quality" the card promises alongside it is not captured anywhere.

### 3.5 Unexplained working-load write on an unlogged paired exercise · **severity: low, `hypothesis`, not independently root-caused**

`workingLoads.iron-clock.single-arm-hammer-row` showed `10` in Firestore after the session, despite that exercise never being logged this session (only its A1 partner, Incline DB Bench Press, was). `genericDoubleProgression` should `continue` past any exercise with an empty `sets` array, so this write is not explained by the code read in §1b alone. Flagged as a hypothesis worth a fast follow-up trace (possibly a shared LOAD-field default between paired A1/A2 slots bleeding into a phantom set, or a UI "COMPLETED" toggle on unlogged rows behaving as an implicit log) rather than a confirmed bug — not independently reproduced a second time this session.

### 3.6 Very high nominal round count for a "conditioning/constrained" plan · **severity: low, `hypothesis`**

108 rounds/week (27/session) is a high number relative to most of the portfolio, though the density format (light load, short windows, alternating pairs) is not directly comparable set-for-set to a straight-sets hypertrophy plan. Worth an explicit gut-check against the wave's own "constrained" framing once the ladder is actually wired (§6.1) — a high round count that never earns real load progression (because the ladder is dead) risks becoming pure volume accumulation without the intended density payoff.

### 3.7 UI/UX

Fully live-tested this session, no login friction (`test_claude` worked on the first attempt). Switch-in flow: Settings → Switch Program → Iron Clock card → mandatory "Training Schedule" step (fixed weekdays, suggested-split shortcuts, or a rotation cadence) → "NEXT: EXERCISE SELECTION," which actually routes straight to the dashboard (there is no exercise-selection step for this plan — same minor step-label mismatch pattern already noted on House of Iron, not a functional bug). Anchor and density-block set logging, LOAD/REPS autofill from the prior session (`LAST 40kg × 8` correctly appeared on the second visit), and workout completion all worked without error.

---

## 4. Weekly volume (108 rounds/week, Winding phase, 4-day mode)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Glute max (lower) | 20.5 | | Lats (lower) | 17.25 |
| Quads (3 heads, each) | 17.0 | | Teres major | 15.0 |
| Biceps femoris | 14.0 | | Pec (lower) | 13.0 |
| SemiMemb/Tend | 13.0 | | Triceps (lateral) | 11.5 |
| Triceps (medial) | 11.5 | | Biceps (long head) | 11.5 |
| Brachialis | 11.5 | | Front delt | 9.5 |
| Pec (upper) | 9.5 | | Triceps (long) | 9.75 |
| Rhomboids | 9.5 | | Lats (upper) | 9.0 |
| Gastrocnemius | 9.0 | | Forearm flexors | 9.0 |
| Side delt | 8.0 | | Brachioradialis | 8.0 |
| Abdominal wall | 8.0 | | Rear delt | 6.0 |
| Trap mid | 6.0 | | Glute medius | 6.0 |
| Adductors | 5.75 | | Rectus femoris | 5.75 |
| Erectors | 4.5 | | Glute max (upper) | 4.0 |
| Soleus | 4.0 | | Abs (upper/lower) | 4.0 each |

Computed by hand from `docs/analysis/exercise-attribution-map.md`'s per-exercise fractional rows for all 22 distinct movements in the four-day tree; no missing attribution data, no `reverse-nordic-curl` exposure. Consistent with the map's §25 findings: soleus (4.0) and rectus femoris (5.75, "thin") are the plan's weakest-covered dimensions among muscles it does train at all, and it has **zero** direct adductor or erector isolation work (both scores above come entirely from secondary squat/hinge involvement) and **zero** tibialis anterior, upper-trap, serratus, or isolated-upper-pec coverage — all four are on the map's portfolio-wide zero-coverage list, and Iron Clock does nothing to change that.

Tension (weeks 3-5) scales every density slot's rounds 4→5 (a uniform ~19% bump to every non-anchor muscle's total, since all six density blocks per day gain the same +1 round); Escapement (weeks 6-7) holds that round count and additionally compresses the window, which does not change the volume table (no set-count change, only pacing); Benchmark (week 8) returns to Winding's base numbers above.

---

## 5. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **159** |
| Axial | **23** |
| Lower back | **41** |
| Knee | **42** |
| Shoulder | **27** |
| Elbow | **58** |
| Sets (rounds) | 108 |
| Per-set systemic | **1.47** |

Elbow (58) and knee (42) are the two highest raw categories, driven by the sheer round count on elbow-flexion/extension slots (Hammer Curl and Cable Triceps Extension both appear twice weekly at 4 rounds each, every week) and knee-dominant density blocks (FFE Bulgarian Split Squat, Goblet Skater Squat, Leg Extension, plus the squat-pattern anchor). Systemic-cost-per-set (1.47) is markedly lower than House of Iron's 1.87 or Kali's 1.31-ish range from earlier waves — expected, since most of the plan's volume is machine/dumbbell/cable density work rather than free-weight compounds, and only the four anchors carry real axial loading.

---

## 6. Improvements, ranked

### 1. Wire `genericDoubleProgression` to exclude density-block slots, and give the density ladder a real caller · `plan-local`, `shared-bug` (touches the progression registry)

The single highest-value fix. Add an `iron-clock` entry to `PROGRESSION_HANDLERS` that routes anchor slots through ordinary double progression (already correct) but routes density-block slots through `advanceDensityBlock` instead — the pure function already exists, is tested, and just needs a caller that reads logged rounds/duration/quality from the workout and writes the result into a genuinely-created `ironClockStatus.stage`/`.history`. This single change fixes §3.1 and, as a side effect, gives §3.3's `resetProgram()` gap actual stakes worth then also fixing.

### 2. Add a quality-confirmation control to the density-block UI · `plan-local`

`DensityBlockResult.quality` (`clean`/`borderline`/`invalid`) has no UI input anywhere. Without one, improvement #1 has no data to consume even once wired — the athlete needs some lightweight per-block confirmation (a three-state toggle at "FINISH," in the spirit of House of Iron's accept/decline pattern) for the ladder's gating logic to mean anything.

### 3. Add `ironClockStatus` to `resetProgram()`'s allowlist, bundled with improvement #1 · `shared-bug`

Currently moot (§3.3) but should ship in the same change as the write path, so the gap doesn't quietly reappear with real consequences the way it did on Athena/Kali/House of Iron.

### 4. Trace and fix the unexplained `single-arm-hammer-row` working-load write · `hypothesis`

Detailed in §3.5. Low severity on its own, but worth a fast check given it touches the same paired-A1/A2 UI structure that improvement #1 will also need to reason about correctly.

### 5. Reconsider the round count once the ladder is real · `hypothesis`

108 rounds/week is a lot of exposure for a plan whose actual overload mechanism (once fixed) will be earned round-by-round, not handed out by a flat rep-range bump. Worth revisiting whether 4 base rounds × 6 density blocks/day is the right starting point once athletes are actually climbing the ladder, rather than assuming the current count (tuned, likely, against the dead genericDoubleProgression behavior) is correct for the intended mechanic.

### 6. Add direct adductor/erector/soleus work, or accept the gap explicitly · `hypothesis`

Consistent with the attribution map's portfolio-wide finding (§25): Iron Clock does nothing to close the zero-coverage list, and its own soleus (4.0) and rectus femoris (5.75) numbers are thin even among what it does train. Not urgent for an 8-week non-repeating plan, but worth a conscious call rather than a silent gap if a future revision reuses this template.

---

## 7. Verdict

**Iron Clock is Wave 5's opening plan, and it opens with the wave's most severe finding so far: the plan's entire named mechanic doesn't run.** "The clock, not the plate, is the thing you beat" is not true in the shipped app — every exercise, anchor and density block alike, progresses on a flat rep-range-triggered kg bump, identical in kind to every other plan on the portfolio's generic double-progression path. The density ladder that would make the card's claim true is real, competently designed, and fully unit-tested in isolation, but has no caller anywhere in the running application and no UI control to even supply the quality input it would need. This is confirmed live, not just by source trace: a fully logged Week-7 session with a clean top-of-range anchor and a complete 5-round density block produced ordinary `workingLoads` entries and zero `ironClockStatus` state of any kind.

Beyond the headline gap, the plan's actual authored structure is sound — four sessions balancing squat/hinge/press/pull patterns with sensible pairings, phases that (once actually displayed, past the T-9 bug) do apply their documented round/window transforms correctly, and volume that, while numerically high in round count, spreads reasonably across the portfolio's muscle groups with no `reverse-nordic-curl` exposure and no classic duplicated-slot drift. The T-9 plan-switch bug reproduces live and cleanly on the first Wave-5 plan — breaking Wave 4's 4/4 dedicated-dashboard immunity streak exactly as predicted, since Iron Clock (unlike every Wave-4 plan) has no dedicated dashboard component. As shipped, an athlete on Iron Clock is training a perfectly reasonable, if oddly high-round-count, machine/dumbbell density-circuit hypertrophy plan — just not the density-mastery plan the card, the onboarding copy, and the plan's own name promise.

---

## 8. Export block

```yaml
id: iron-clock
version: 2
length: { weeks: 8, phases: [winding_1to2, tension_3to5, escapement_6to7, benchmark_8], repeatable: false }
frequency: 4_sessions_fixed_weekday_or_3day_internal_alt
weekly_sets: { winding_benchmark: 108, tension_escapement: 132 }
kind: conditioning_density_hypertrophy_hybrid
calibration: none
engine: definePlan_generic_4day_tree_with_3day_preprocessDay_switch_no_dedicated_dashboard_no_dedicated_progression_handler
systemic_load: { weekly: 159, axial: 23, lower_back: 41, knee: 42, shoulder: 27, elbow: 58, sets: 108, per_set: 1.47 }
volume_top: { gluteMaxLower: 20.5, latsLower: 17.25, vastusEach: 17.0, teresMajor: 15.0 }
positive_findings:
  - "phase transforms (round +1 in Tension, round +1 and window x5/6 in Escapement, reset in Benchmark) are correctly wired once actually displayed — confirmed live, distinct from the T-9 bug that mis-selected the week"
  - "no reverse-nordic-curl exposure, no classic T-4 duplicated-slot drift, no type:'wave' exposure, structurally immune to T-23 (no weighted-bodyweight exercises in the pool)"
shared_bugs:
  - id: T-9
    detail: "First Wave-5 plan, breaks Wave 4's 4/4 dedicated-dashboard-immunity streak — Iron Clock has no dedicated dashboard component. Live-confirmed: switched in from Kali and the dashboard showed Week 7/Escapement from a stale dashboardViewWeek-test_claude localStorage key despite zero prior programProgress['iron-clock']. Resolved correctly after logging a real session."
  - id: T-2-adjacent
    detail: "ironClockStatus missing from resetProgram()'s allowlist, but structurally moot — the field is never written by any code path, so there is no stale state a reset could fail to clear. Should be fixed together with the write-path fix below, not standalone."
plan_local_bugs:
  - area: "src/features/ironClock/progression.ts and its consumer"
    detail: "The entire density-ladder progression system (advanceDensityBlock, compareBlocks, blockDensity, restWarning, startingState) has zero callers anywhere in src/ outside its own file and the verify script. ironClockStatus is declared, read once for a cosmetic notes string, and never written. Every exercise, anchor and density block alike, silently falls through to genericDoubleProgression instead, which ignores rounds/duration/pairing/quality entirely and just bumps working load by +2.5kg on a top-of-range set. Live-confirmed via a full logged session producing zero ironClockStatus state."
  - area: "BlockTimer (WorkoutView.tsx, shared with REDLINE)"
    detail: "A real, visible countdown per density block with no round-completion or quality-capture UI tied to it — the pacing cue is genuine, the 'round-by-round quality' the card promises alongside it is not captured anywhere"
  - area: "workingLoads.iron-clock.single-arm-hammer-row"
    detail: "Unexplained write (value 10) on an exercise never logged this session — flagged as a hypothesis for follow-up, not independently root-caused or reproduced a second time"
verification_note: "test_claude logged in successfully on the first attempt. A full live pass was completed: switch-in with fixed-weekday schedule selection, a full anchor (3/3 sets) plus one complete 5-round density block logged at or above top-of-range reps, workout completion, and a direct Firestore cross-check both before and after — including a direct localStorage read confirming the T-9 mechanism (dashboardViewWeek-test_claude stuck at '7' from a previously viewed plan)."
audit: { date: 2026-08-15, findings: 7, verdict: "Wave 5 opens with the audit's most severe single finding to date — an entire named progression mechanic, not just one feature, is dead code in the running app, confirmed live rather than only by source trace" }
```
