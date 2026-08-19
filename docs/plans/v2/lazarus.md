# Lazarus

> Unified plan document, v2 format. Supersedes `docs/plans/lazarus.md` if one
> exists. Fifth plan of **Wave 5 (Conditioning / constrained)**. Structure and
> wiring verified via direct source trace of `src/data/plans/lazarus.ts`,
> `src/features/lazarus/memoryCurve.ts`, `src/pages/Dashboard.tsx`,
> `src/pages/Onboarding.tsx`, `src/pages/Settings.tsx`,
> `src/pages/WorkoutView.tsx`, `src/contexts/UserContext.tsx`,
> `src/data/portfolio.ts`, `src/contexts/translations.ts`, `src/types.ts` —
> **plus a full `test_claude` live pass**: logged in on the first attempt,
> switched into Lazarus (mandatory 3-day schedule step, no exercise-selection
> or break/history step of any kind), completed a full Return I session
> (13 sets, capped to the plan's own week-1/2 hard limit), confirmed
> `lazarusStatus` absent from Firestore before and after, and ran a deliberate
> `dashboardViewWeek` localStorage-poisoning test to confirm T-9. Volume and
> systemic figures computed from a throwaway `tsx` script (deleted after use)
> resolving all 18 distinct exercise ids against `EXERCISE_LIBRARY` and its
> `intelligence` block (18/18 resolved).

| | |
|---|---|
| **id** | `lazarus` |
| **Length** | 8 weeks, one shared `DaySpec` template (`LAZARUS_DAYS`) across three phases (`Waking` wk 1-2, `Remembering` wk 3-5, `Returned` wk 6-8) |
| **Frequency** | Fixed 3 days/week, mandatory weekday selection at onboarding |
| **Weekly sets** | 36 (Waking, hard-capped) / 45 (Remembering and Returned, identical set counts — only rep ranges and RPE differ) across 3 sessions — see §4 |
| **Declared kind** | Return-to-training, intermediate/advanced, full-body, `adaptability: 'responsive'`, `fatigue: 2` |
| **Calibration** | None reachable in the shipped app — see Headline finding. The plan's own design intends an optional pre-break-best/self-reported-load input feeding `LazarusStatus.memoryCurve`, but no onboarding or settings screen collects it. |
| **Source** | `src/data/plans/lazarus.ts` (103 lines) + `src/features/lazarus/memoryCurve.ts` (118 lines: `detrainingFactor`, `openingLoad`, `weekSetCap`, `capIsHard`, `shouldAccelerate`, `injuryReturnGuidance`) |
| **Stated promise** | Card: *"An 8-week return plan for trained athletes coming back after three months or more away."* Features: *"3 full-body days," "Memory Curve against your old bests," "Hard caps in weeks 1–2," "Accelerates once you prove it."* Portfolio quiz `signatureMechanic`: *"The Memory Curve: loads open from your last stable pre-break performance, not your best ever."* File header comment: *"loads open from the last stable pre-break performance rather than the lifetime best, and weeks 1–2 are capped whatever the athlete's readiness says."* |

---

## 1. Headline finding

**Lazarus is Wave 5's third plan (of five checked) with its entire named headline mechanic dead — and the cleanest, most total instance of the pattern found so far: not one single field of `lazarusStatus` is ever written by any code path in the shipped app, so the plan's two data-dependent card claims never activate even once, for any athlete, ever. The plan's other two card claims — the hard week-1/2 caps — are real, and were live-confirmed working exactly as designed.**

### 1a. The Memory Curve has zero write path — `lazarusStatus` is completely absent from the schema's live surface

`LazarusStatus` (`src/types.ts:278-286`) declares four fields: `breakMonths`, `priorExperienceYears`, `memoryCurve` (per-exercise pre-break/lifetime-best loads), and `underestimated` (sessions that beat the prescription, feeding acceleration). A codebase-wide grep for `lazarusStatus`, `memoryCurve`, `breakMonths`, and `underestimated` outside `lazarus.ts`/`memoryCurve.ts` themselves finds exactly two consumers — `lazarus.ts`'s own `preprocess`/`calculateWeight` hooks, and one read-only Dashboard widget (§1c) — and **zero writers anywhere**: no reference to `lazarus` at all in `Onboarding.tsx` or `Settings.tsx` (both greped clean), no workout-completion handler that appends to `underestimated`, nothing that ever sets `breakMonths` or `injuryReturn`. This is a stricter dead-status finding than Iron Clock's T-32 or REDLINE's T-34 (Wave 5's two prior instances) — those plans' status objects were at least read once for a cosmetic echo; here `lazarusStatus` is read in three places (`preprocess`, `calculateWeight`, the Dashboard card) and **all three permanently see `undefined`**, because nothing in the running app can ever populate it.

Live-confirmed twice: onboarding's schedule step (the only step that exists) leads directly into a live session with no break-duration, prior-best, or injury question anywhere; and a direct Firestore read of `users/test_claude` after a fully completed, logged Return I session shows no `lazarusStatus` field of any kind — `workingLoads.lazarus` is correctly populated (`hack-squat: 40`, etc.) from the ordinary `genericDoubleProgression` fallback, exactly as the file's own `calculateWeight` hook's comment predicts (*"a returning athlete with no history is a beginner as far as the prescription is concerned"*) — but the two features that make Lazarus *Lazarus* rather than a generic full-body template never engage.

### 1b. Two of the card's four claims are consequently unreachable

- **"Memory Curve against your old bests"** — `openingLoad()` (the detraining-discount calculation: 0.9/0.8/0.7/0.6 of the pre-break load by months away) is fully implemented and correctly unit-testable in isolation, but both of its callers (`preprocess`'s `predictedKg` and `calculateWeight`'s opening-load override) short-circuit to the generic fallback on every single call, because `memory` and `breakMonths` are always `undefined`.
- **"Accelerates once you prove it"** — `shouldAccelerate()` reads `status?.underestimated`, filters to the last 3 weeks, and returns `accelerate: true` after two qualifying sessions. Since `underestimated` is never appended to by anything, this function returns `{ accelerate: false, reason: 'Progression continues at the standard step.' }` on literally every call, for every athlete, for all 8 weeks. The acceleration mechanic described on the card cannot fire once, structurally, not merely rarely.
- **`injuryReturnGuidance()`** — a third function, not on the card but referenced in the file's own header comment (*"Where an injury caused the break, the plan says so in copy and points at a professional"*) — is fully written (heading, body copy, a conditional `apex-predator` follow-up suggestion) and has **zero callers anywhere in `src/`**. An athlete who indicates an injury-caused break — if there were any UI to indicate it, which there is not — would never see this copy regardless.

### 1c. What survives: the hard week-1/2 volume cap is real, live-confirmed, and independent of the dead status object

Unlike the memory curve and acceleration mechanics, `weekSetCap()` is applied unconditionally from the plan's static phase table (`{ name: 'Waking', weeks: [1, 2], transform: (slot) => ({ ...slot, sets: weekSetCap(1, slot.sets), rpe: 7 }) }`) and again in `preprocess`, using only the week number — never `lazarusStatus`. This is the one headline mechanic in the file that doesn't depend on unreachable state, and it works: live-confirmed, Return I's `hack-squat` slot (base 3 sets, `systemicCompound: true`) rendered as **"2 sets × 8-12 reps"** with **RPE 7** during the week-1 session, matching the phase transform exactly (`weekSetCap` caps any base set count to a maximum of 2 for weeks ≤ 2, and the phase's `rpe: 7` override was visible on the live-set widget throughout). This is the strongest positive finding of the Wave 5 dead-mechanic plans so far — Iron Clock and REDLINE had nothing real left standing once their central mechanic was confirmed dead; Lazarus's "don't let a strong-feeling week 1 produce a week-3 injury" design goal is genuinely enforced, just by a much simpler, `lazarusStatus`-independent code path than the card's language implies.

### 1d. The Dashboard's own "Predicted vs logged" card is permanently, honestly empty

`Dashboard.tsx:695-716` renders a Lazarus-specific card ("Predicted vs logged") whenever `activePlanConfig.id === 'lazarus'`, iterating `user.lazarusStatus?.memoryCurve ?? {}` and falling back to *"No memory-curve loads yet — first sessions calibrate."* when the map is empty. Live-confirmed: this fallback string is what every Lazarus athlete sees, forever, on every dashboard visit — the card is well-designed (it would correctly show predicted-vs-logged pairs per exercise if `memoryCurve` were ever populated) but structurally can never leave its empty state given §1a. Worth noting as a small mercy relative to Iron Clock/REDLINE: the UI doesn't lie about having data it doesn't have — it honestly reports zero — but the athlete has no way to learn *why* it's permanently zero, since nothing tells them the pre-break-load input they might expect to find during onboarding doesn't exist.

---

## 2. Structure

### The three-phase template

Lazarus uses one `DaySpec` array (`LAZARUS_DAYS`) across all 8 weeks — unlike Atlas's two distinct gauntlet arrays — with phase transforms changing only set counts (Waking) and rep ranges on `systemicCompound` slots (Returned):

| Day | Exercises | Systemic compound |
|---|---|---|
| Return I (Mon) | Hack Squat, Incline DB Bench, Single-Arm Hammer Row, Seated Hamstring Curl, Lateral Raise (last-set-failure), Cable Triceps Ext, Hack Calf Raise, Ab Wheel | Hack Squat |
| Return II (Wed) | Romanian Deadlift, Lat Pulldown, Hammer Chest Press, Leg Extension, Single-Arm Reverse Pec-Deck, Hack Calf Raise, Hammer Curl | Romanian Deadlift |
| Return III (Fri) | Leg Press, Seated DB Shoulder Press, Hammer Pulldown, Lying Leg Curl, Hammer Curl, Cable Triceps Ext | Leg Press |

- **Waking (wk 1-2):** every slot capped to a maximum of 2 sets (`weekSetCap`), RPE explicitly set to 7 regardless of the slot's normal target. 36 sets/week.
- **Remembering (wk 3-5):** slots return to their authored base set counts (2-3 per slot), no rep-range change. 45 sets/week.
- **Returned (wk 6-8):** identical set counts to Remembering; the only change is `systemicCompound` slots (hack-squat, romanian-deadlift, leg-press) shift from `8-12` to `6-10` reps — a real, live-verifiable strength-lean in the back third of the plan, unrelated to the dead status object. 45 sets/week.

A conservative, ordinary hypertrophy-leaning full-body template — deliberately so, per the file's own header comment (*"the movements are deliberately ordinary"*). The differentiator was always meant to be the Memory Curve, not the exercise selection.

### Onboarding

Two-step flow, live-confirmed: (1) mandatory fixed-weekday schedule selection (3 sessions/week; the "0/3 → 3/3" counter correctly gated the "NEXT: EXERCISE SELECTION" button), (2) **nothing** — clicking past the schedule step lands directly on the live dashboard, at Return I, Week 1. Same misleading button-copy pattern already documented on Atlas (T-44, "NEXT: EXERCISE SELECTION" implying a step that doesn't exist) — except Lazarus's actual missing step isn't exercise selection at all, it's the break-duration/prior-bests calibration the card explicitly promises ("Memory Curve against your old bests"). No `breakMonths`, `injuryReturn`, or prior-lift-input screen exists anywhere in `Onboarding.tsx`.

### `xStatus`, T-2, T-3, T-4, T-9, T-22, T-23, reverse-nordic

- **`lazarusStatus` is declared and read but never written anywhere** — the cleanest total-dead-status case in Wave 5 (see §1a). Distinct from Iron Clock's `ironClockStatus` (read once, cosmetically) and REDLINE's `redlineStatus` (read once, cosmetically) in that Lazarus's status object has *three* live call sites, all permanently no-ops.
- **T-2/T-28 gap reproduces, consequence-free (matching Iron Clock, not Atlas).** `resetProgram()` (`UserContext.tsx:467-470`) special-cases only `benchDominationStatus`/`pencilneckStatus`/`skeletonStatus` — `lazarusStatus` and `planPreferences.lazarus` are both absent from the allowlist. Since nothing ever populates either field in the first place (§1a), this gap currently has nothing to leave stale — same shape as Iron Clock's T-2 instance, not Atlas's (where the equivalent gap had real consequence for `atlasStatus.carries`).
- **No `type: 'wave'` anywhere** — zero T-3 exposure. The only progression type used is `{ type: 'double', increment: 2.5 }`.
- **No classic T-4 duplicated-definition drift.** Each exercise appears in at most two of the three days at genuinely different set/rep prescriptions appropriate to its role that day (e.g. `hack-calf-raise`: 1 set on Return I, 2 sets on Return II — a legitimate volume split, not two copies of the same slot silently diverging).
- **No `reverse-nordic-curl`** anywhere in the day template — clean, consistent with every Wave 5 plan checked so far.
- **T-9 reproduces live, a fourth time in Wave 5 (after Iron Clock, REDLINE, Atlas; 30-Min Adventure remains the wave's only immune plan).** `dashboardWidgets: ['program_status', 'workout_history']` are both generic, shared widgets — no dedicated dashboard component (confirmed via a `Dashboard.tsx` grep: the Lazarus-specific "Predicted vs logged" card at line 695 is a conditional block *inside* the shared `Dashboard.tsx`, not an early-returning dedicated component like `AthenaDashboard`/`AdventureDashboard`, so it never escapes the buggy shared `dashboardViewWeek` cache path). Live-confirmed via a deliberate localStorage-poisoning test: setting `dashboardViewWeek-test_claude` to `8` and reloading showed **"Week 8 · Returned · Return I"** as the next session, despite `programProgress.lazarus` correctly holding `{ completedSessions: 1 }` (which should resolve to Week 2, "Return II"). Clearing the poisoned key and reloading resolved correctly to "Return II · Waking · Week 1."
- **T-22 does not apply.** `dashboardWidgets` requests no `strength_chart`, and no code path calls `trackedLiftFor()` for this plan.
- **T-23 does not apply — structurally, not merely un-triggered.** None of Lazarus's 18 distinct exercise ids use `weightMode: 'weighted-bodyweight'` (all resolve to the library's default `'external'` mode, confirmed via direct lookup against `EXERCISE_LIBRARY`). This directly answers the audit brief's specific check: **Lazarus does not reproduce the newly-identified `WorkoutView.tsx:842` hardcoded-allowlist gap a third time**, because it never reaches the code path the gap lives in — there is no total-system-weight concept anywhere in this plan's exercise pool for the allowlist to exclude.
- **A new dead-function instance beyond the card's own claims:** `injuryReturnGuidance()` (§1c) is a third, uncalled function in `memoryCurve.ts` — not advertised on the card, but referenced in the plan file's own header comment as a real safety feature ("the plan says so in copy and points at a professional"). No UI anywhere shows this copy to any athlete.

---

## 3. Findings

### 3.1 The entire Memory Curve mechanic — two of four card features — has zero write path anywhere in the app · **severity: critical, `shared-bug`-adjacent (plan-local root cause, same defect family as T-32/T-34)**

Detailed in §1a-§1b. `lazarusStatus.breakMonths`, `.memoryCurve`, and `.underestimated` are never written by any onboarding screen, settings control, or workout-completion handler anywhere in `src/`. Both `openingLoad()`'s detraining-discounted opening weight and `shouldAccelerate()`'s two-clean-sessions acceleration rule are correctly implemented and unit-testable in isolation, but permanently unreachable in the shipped app. Live-confirmed: a fully logged 13-set Return I session produced ordinary `workingLoads.lazarus` writes via the generic double-progression fallback, and zero `lazarusStatus` field in Firestore before or after. This is the third of five Wave-5 plans checked so far (after Iron Clock T-32, REDLINE T-34) to have its entire named headline mechanic be dead code — and the most total instance yet, since unlike those two plans' status objects (each read once, cosmetically), `lazarusStatus` has three live call sites that all permanently no-op rather than just one.

### 3.2 `injuryReturnGuidance()` is a third, unadvertised dead function — the plan's own stated safety framing never reaches an athlete · **severity: medium, `plan-local`**

`injuryReturnGuidance()` produces a heading (*"This plan is not rehabilitation"*), a body warning athletes to see a professional if an injury still limits them, and a conditional `apex-predator` follow-up suggestion for breaks of 12+ months. It has zero callers anywhere in `src/`. The plan file's own header comment treats this as a real, shipped safety behavior ("the plan says so in copy and points at a professional; it does not model it") — in the live app, it says nothing, because there is no injury-return question anywhere in onboarding to trigger the copy.

### 3.3 T-9 reproduces via the shared `Dashboard.tsx` path, not a dedicated component — Lazarus's own dashboard card doesn't grant the immunity Athena/Venus Rising/Kali/House of Iron/30-Min Adventure get · **severity: medium, `shared-bug`**

Detailed in §2. Lazarus has a genuinely Lazarus-specific dashboard widget (the "Predicted vs logged" card), but because it's rendered as a conditional block inside the shared `Dashboard.tsx` rather than as an early-returning dedicated component, the plan gets none of the T-9 immunity that a true dedicated dashboard provides. Worth noting as a distinct sub-pattern from the wave's running observation: "has a plan-specific dashboard card" and "is immune to T-9" are not the same thing — only the latter, which requires bypassing the shared `dashboardViewWeek` render path entirely, confers protection.

### 3.4 `programProgress.lazarus` never receives a `startDate` sub-field — third instance of the same gap this wave · **severity: low, `hypothesis`**

Live-confirmed: after one completed session, `programProgress.lazarus` in Firestore contains only `{ completedSessions: 1 }`, missing the `startDate` field every sibling `programProgress` entry in the same document carries (confirmed against 20+ other plan entries, including this session's own `atlas` entry). Same shape and same root cause as REDLINE's T-37 and Atlas's T-46 (`switchProgram()` only backfills the *previous* plan's entry on the way out; the session-complete handler only increments `completedSessions`). Not independently tested for a working fallback this session (Atlas's T-46 confirmed one via `WorkoutView.tsx:333`'s `|| user.startDate`); given the identical code path, the same fallback almost certainly applies here too, so this is recorded at hypothesis severity rather than a live-observed wrong date.

### 3.5 No exercise-selection, break-duration, or injury-status onboarding step exists despite the button copy implying one · **severity: low, `plan-local`, overlaps §3.1**

Onboarding's "NEXT: EXERCISE SELECTION" button label (shared UI copy with Atlas's equivalent, unrelated step) skips directly from the schedule screen to the live dashboard. Unlike Atlas, where the missing step really was an exercise-selection screen, Lazarus's card promise implies the missing step should instead be the Memory Curve's calibration input — the athlete never sees any UI suggesting one should have existed, so the plan's core premise silently degrades to "an ordinary full-body template with a two-week volume cap" without ever telling the athlete why.

---

## 4. Weekly volume (fractional sets/muscle/week)

### Waking (weeks 1-2, hard-capped), 36 sets/week across 3 sessions

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Hamstrings | 8.0 | | Chest | 4.0 |
| Quads | 6.0 | | Biceps | 4.0 |
| Glutes | 6.0 | | Rear delt | 3.0 |
| Lats | 6.0 | | Side delt | 3.0 |
| Front delt | 5.0 | | Adductors | 2.0 |
| Triceps | 5.0 | | Brachialis | 2.0 |
| Upper back | 5.0 | | Forearms | 2.0 |
| Calves | 5.0 | | Abs | 1.0 |
| | | | Lower back | 1.0 |
| | | | Rotator cuff | 1.0 |
| | | | Obliques | 0.5 |

### Remembering (weeks 3-5) and Returned (weeks 6-8) — identical set counts, 45 sets/week across 3 sessions

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Hamstrings | 10.0 | | Chest | 6.0 |
| Glutes | 9.0 | | Biceps | 5.5 |
| Lats | 9.0 | | Calves | 5.0 |
| Quads | 8.0 | | Rear delt | 3.5 |
| Front delt | 7.5 | | Side delt | 3.5 |
| Upper back | 7.0 | | Adductors | 3.0 |
| Triceps | 6.5 | | Brachialis | 2.0 |
| | | | Forearms | 2.0 |
| | | | Lower back | 1.5 |
| | | | Abs | 1.0 |
| | | | Rotator cuff | 1.0 |
| | | | Obliques | 0.5 |

Computed from `EXERCISE_LIBRARY`'s native primary(1.0)/secondary(0.5) categorization; all 18 distinct exercise ids resolved cleanly. Against the ≥5-sets/muscle/week reference point (§7 calibration principle — judged case by case, not a hard floor): the Waking phase, by deliberate design, sits below floor almost everywhere except hamstrings/quads/glutes/lats/front-delt/triceps/upper-back/calves — appropriate given the plan's own stated purpose is protecting a returning athlete from a week-3 injury, not maximizing week-1 stimulus. Remembering/Returned clear the floor comfortably across the whole lower body and pull chain (hamstrings, glutes, lats, quads all 8-10; front delt, upper back, triceps 6.5-7.5), with chest (6.0) and biceps (5.5) at the low-normal end appropriate for a full-body template that isn't specializing in either. No direct adductor isolation beyond the RDL/leg-press secondary credit, no soleus-specific loader, no upper-trap or tibialis-anterior exposure — consistent with the map's portfolio-wide zero-coverage findings; Lazarus does nothing to close any of those gaps, same as every plan audited so far. Obliques (0.5, ab-wheel's secondary-only credit) is the thinnest single-muscle exposure in the whole plan — worth flagging alongside Peachy's hip-thrust gap (T-21) as a case where a plan's stated "full body" framing has one specific muscle group essentially unaddressed.

---

## 5. Systemic and joint load (weekly, 3 sessions)

| Metric | Waking (wk 1-2) | Remembering / Returned (wk 3-8) |
|---|---|---|
| Systemic | **51** | **67** |
| Axial | **18** | **27** |
| Lower back | **8** | **11** |
| Knee | **16** | **20** |
| Shoulder | **12** | **16** |
| Elbow | **18** | **23** |
| Sets | 36 | 45 |
| Per-set systemic | **1.42** | **1.49** |

Lowest per-set systemic cost of any Wave 5 plan audited so far (Atlas 1.87-2.02, 30-Min Adventure 1.80, REDLINE 1.52, Iron Clock 1.47) — consistent with the plan's design goal and its exercise selection, which leans machine/dumbbell-dominant (hack squat, leg press, hammer-brand machines, cable work) rather than free-barbell compounds, with only Romanian deadlift as a genuinely heavy hinge pattern. `fatigue: 2` (of presumably a 1-5 portfolio scale) is a reasonable and, per this computation, slightly conservative self-rating — the absolute systemic totals (51-67) sit well below Atlas's 103-107 and REDLINE's figures, appropriate for a plan whose explicit purpose is not re-injuring a detrained athlete. The Waking→Remembering/Returned jump (51→67 systemic, +31%) is exactly what the hard-cap design intends: a real, measurable step-up in total weekly load once the two-week floor lifts, not a token gesture.

---

## 6. Improvements, ranked

### 1. Build the missing break-duration/prior-bests onboarding step, or drop the two Memory-Curve card claims entirely · `plan-local`

The highest-leverage fix — `openingLoad()` and `shouldAccelerate()` are both correctly implemented and would work immediately given real `breakMonths`/`memoryCurve`/`underestimated` data. A minimal version: one onboarding screen after the schedule step, asking (a) months since last structured training, (b) optional per-lift pre-break best (with a "skip, calibrate live" option matching the plan's own `requiresCalibration` fallback path already built into `openingLoad()`), and (c) a yes/no injury question that, if yes, surfaces the already-written `injuryReturnGuidance()` copy and the plan's own `apex-predator` follow-up suggestion for long-injury-affected returns. Given `notForYouIf: ['You are returning from an injury that still limits you']` is already on the card, the injury question in particular closes a real gap between the portfolio's own stated exclusion criteria and what onboarding actually screens for.

### 2. Wire a per-session completion check into `underestimated`, so "accelerates once you prove it" can ever fire · `plan-local`

Lower effort than item 1 in isolation, but dependent on it for full effect (acceleration needs a memory curve to accelerate *against*, though the underlying set-count/RPE bump logic doesn't strictly require one). A workout-completion handler comparing logged reps against the prescribed top of range, appending `{ week, date }` to `lazarusStatus.underestimated` on a clean overshoot, would make this specific card claim true without needing the full memory-curve UI to ship first.

### 3. Give `resetProgram()` the same `lazarusStatus`/`planPreferences.lazarus` allowlist fix already recommended for every other Wave 4-5 plan · `shared-bug`

Currently consequence-free (nothing populates either field), but should ship in the same pass as items 1-2 so the gap doesn't reappear with real stakes the way it did on Athena/Kali/House of Iron/Atlas once genuine `xStatus` state exists.

### 4. Tell the athlete why the "Predicted vs logged" card is empty, rather than leaving a generic calibration message · `plan-local`

`Dashboard.tsx:711`'s fallback ("No memory-curve loads yet — first sessions calibrate") reads as if the app is quietly gathering data behind the scenes and will populate the card soon. In the shipped app, nothing is being gathered — every athlete sees this message for the plan's full 8 weeks. Even a small honesty fix (e.g. "Pre-break load history isn't collected yet — this plan currently opens every lift from a fresh calibration set") would prevent the athlete from expecting a payoff that structurally cannot arrive, independent of whether items 1-2 ship.

### 5. Extend the `Remembering`→`Returned` rep-range shift to cover more than just the three systemic-compound slots · `hypothesis`

The plan's one genuinely dynamic, non-status-dependent progression signal (the wk6-8 `8-12`→`6-10` rep shift) currently touches only hack-squat, romanian-deadlift, and leg-press. A parallel, smaller shift on the plan's secondary compound-ish movements (incline DB bench, lat pulldown, hammer chest press) in the final third would give the "Returned" phase name more structural meaning across the whole session, not just the systemic anchor per day — worth considering once the higher-priority Memory Curve gap (items 1-2) is addressed, since it's a design refinement rather than a fix for something broken.

### 6. Add at least one direct oblique/rotational slot · `hypothesis`

Obliques sit at 0.5 sets/week throughout the entire 8-week plan (ab-wheel's secondary-only credit) — the thinnest single-muscle exposure found in this plan's volume table by a wide margin, and arguably in tension with a "return to full training" framing for an athlete who may have specifically detrained anti-rotation/rotational core capacity along with everything else. A single low-cost swap (e.g. a Pallof press or cable woodchop in one of Ab Wheel's or Hack Calf Raise's less differentiated slots) would close this without materially changing the plan's identity.

---

## 7. Verdict

**Lazarus is Wave 5's third dead-headline-mechanic plan, and the cleanest case of the pattern in the wave: `lazarusStatus` isn't merely underused, it is never written by a single code path anywhere in the shipped app, so the two data-dependent halves of the card ("Memory Curve against your old bests," "Accelerates once you prove it") can never activate for any athlete under any circumstances.** This is a stricter failure than Iron Clock's T-32 or REDLINE's T-34 — both of those plans' status objects were at least read once, cosmetically; Lazarus's has three live call sites that all permanently see `undefined`. Unlike those two plans, though, Lazarus has a real positive to weigh against it: the plan's other, arguably more clinically important claim — hard week-1/2 volume caps that override even a strong-feeling return — is genuinely wired, entirely independent of the dead status object, and was live-confirmed working exactly as designed (a base-3-set systemic-compound slot correctly rendered as 2 sets at RPE 7 during the actual week-1 session). No `weighted-bodyweight` exercises anywhere in the plan's 18-exercise pool means it does not reproduce the newly-identified `WorkoutView.tsx` total-system-weight allowlist gap (T-23) — this audit's specific check for this plan comes back clean, structurally rather than by luck.

On pure training-design merit, independent of the wiring findings: the underlying return-to-training logic — deliberately ordinary movement selection, a genuinely conservative two-week volume floor with a hard ceiling regardless of subjective readiness, and a real (if currently under-differentiated) strength-lean in the final third — reflects sound return-to-training practice and is broadly consistent with detraining and reconditioning literature's core recommendation (start meaningfully below prior capacity and ramp deliberately, rather than trusting how strong a returning athlete subjectively feels in week 1). The systemic-load numbers (§5) support this: Lazarus has the lowest per-set systemic cost of any Wave 5 plan audited, appropriate for its stated audience. But the plan's actual differentiator — opening loads from a real pre-break number rather than a lifetime best, the thing that would make Lazarus meaningfully better than a generic full-body template for a returning athlete — simply isn't reachable in the app today. An athlete running Lazarus currently gets a competent, conservative, low-systemic-cost 8-week full-body return template with a genuinely enforced early-weeks safety cap; they do not get the personalized reconditioning tool the card, the portfolio quiz, and the plan's own file-header comment all promise.

---

## 8. Export block

```yaml
id: lazarus
version: 2
length: { weeks: 8, phases: 3 }
frequency: fixed_3day_mandatory_weekday_selection
weekly_sets: { waking_wk1_2: 36, remembering_wk3_5: 45, returned_wk6_8: 45 }
kind: return_to_training_fullbody_intermediate_advanced
calibration: none_reachable_in_shipped_app_lazarusStatus_never_written
engine: definePlan_single_dayspec_three_phase_transform_hard_week_cap_plus_dead_memory_curve_no_dedicated_dashboard
systemic_load: { waking: { systemic: 51, axial: 18, lower_back: 8, knee: 16, shoulder: 12, elbow: 18, sets: 36, per_set: 1.42 }, remembering_returned: { systemic: 67, axial: 27, lower_back: 11, knee: 20, shoulder: 16, elbow: 23, sets: 45, per_set: 1.49 } }
volume_top_waking: { hamstrings: 8.0, quads: 6.0, glutes: 6.0, lats: 6.0, frontDelt: 5.0 }
volume_top_remembering_returned: { hamstrings: 10.0, glutes: 9.0, lats: 9.0, quads: 8.0, frontDelt: 7.5 }
positive_findings:
  - "Hard week-1/2 volume cap (weekSetCap) is real, live-confirmed, and independent of the dead lazarusStatus object: a base-3-set systemic-compound slot correctly rendered as 2 sets at RPE 7 during a live week-1 session"
  - "No reverse-nordic-curl, no type:'wave' exposure, no classic T-4 duplicated-slot drift, no T-22 exposure, no T-23 exposure (structural — zero weighted-bodyweight exercises in the pool, directly answering this audit's specific check)"
  - "Lowest per-set systemic cost of any Wave 5 plan audited (1.42-1.49 vs Iron Clock 1.47, REDLINE 1.52, 30-Min Adventure 1.80, Atlas 1.87-2.02), consistent with and appropriate for the plan's stated return-to-training audience"
  - "Dashboard's own 'no memory-curve loads yet' fallback is at least honest about having no data, rather than fabricating a plausible-looking but fake result"
dead_features:
  - area: "src/features/lazarus/memoryCurve.ts openingLoad()/shouldAccelerate() + src/types.ts LazarusStatus + zero writers anywhere in src/pages/Onboarding.tsx or Settings.tsx"
    detail: "lazarusStatus (breakMonths, memoryCurve, underestimated, injuryReturn) is declared and read in three live call sites (lazarus.ts's preprocess and calculateWeight hooks, Dashboard.tsx's 'Predicted vs logged' card) but never written by any code path anywhere in the shipped app. Two of the plan's four card features ('Memory Curve against your old bests', 'Accelerates once you prove it') are consequently permanently unreachable for every athlete. Live-confirmed: a fully logged 13-set Return I session produced ordinary genericDoubleProgression workingLoads writes and zero lazarusStatus field in Firestore before or after."
  - area: "src/features/lazarus/memoryCurve.ts injuryReturnGuidance()"
    detail: "A third function, not itself a card claim but referenced in the plan file's own header comment as a real safety behavior ('the plan says so in copy and points at a professional'), has zero callers anywhere in src/. No UI ever surfaces this copy to any athlete, because no onboarding step asks whether the break was injury-caused in the first place."
plan_local_bugs:
  - area: "src/pages/Dashboard.tsx:695-716 'Predicted vs logged' card + src/pages/Dashboard.tsx shared dashboardViewWeek path"
    detail: "Lazarus has a plan-specific dashboard card, but it is a conditional block inside the shared Dashboard.tsx rather than an early-returning dedicated component, so it does not grant T-9 immunity the way Athena/Venus Rising/Kali/House of Iron/30-Min Adventure's true dedicated dashboards do. T-9 reproduces live: a dashboardViewWeek-test_claude localStorage poisoning test (set to '8') showed 'Week 8 · Returned · Return I' despite programProgress.lazarus correctly holding one completed session (which should resolve to Week 2, Return II); clearing the key resolved correctly."
  - area: "src/contexts/UserContext.tsx switchProgram()/resetProgram() + src/pages/WorkoutView.tsx session-complete handler"
    detail: "programProgress.lazarus never received a startDate sub-field after one completed live session (only completedSessions), matching every sibling entry's exception pattern already seen on REDLINE (T-37) and Atlas (T-46) — same root cause (switchProgram() only backfills the previous plan's entry on the way out; the session handler only increments completedSessions). Not independently confirmed for a working fallback this session; recorded at hypothesis severity given the identical code path to Atlas's confirmed-working case."
  - area: "src/contexts/UserContext.tsx resetProgram() allowlist"
    detail: "lazarusStatus and planPreferences.lazarus are both absent from resetProgram()'s hardcoded allowlist (benchDominationStatus/pencilneckStatus/skeletonStatus only) — same T-2/T-28 family gap as every other Wave 4-5 plan, currently consequence-free since nothing populates either field."
verification_note: "test_claude logged in successfully on the first attempt this session (continued directly from the prior Atlas pass, no device-lock recurrence). Full live pass: onboarding (mandatory 3-day schedule selection, confirmed no exercise-selection or break/history step of any kind), a complete 13-set Return I session logged via direct-DOM set logging with a live-confirmed 2-set hard cap and RPE 7 on the systemic-compound slot, a direct Firestore cross-check confirming lazarusStatus absent both before and after the session while workingLoads.lazarus and programProgress.lazarus populated correctly, and a deliberate dashboardViewWeek localStorage-poisoning test proving T-9 (poisoned to week 8, resolved incorrectly to 'Week 8 · Return I'; cleared, resolved correctly to 'Week 1 · Return II')."
audit: { date: 2026-08-15, findings: 5, verdict: "Lazarus's entire Memory Curve mechanic (2 of 4 card features) has zero write path anywhere in the app — lazarusStatus is read in three places and none of them are ever populated, the cleanest total-dead-status case in Wave 5 so far. The plan's other headline claim, hard week-1/2 volume caps, is real and live-confirmed working independent of the dead status object. No weighted-bodyweight exposure means T-23 does not reproduce a third time via the newly-identified WorkoutView.tsx allowlist gap. T-9 reproduces live via the shared Dashboard.tsx path, since Lazarus's own dashboard card isn't a true dedicated component." }
```
