# Skeleton (From Skeleton to Threat)

> Unified plan document, v2 format. Supersedes `docs/plans/skeleton-to-threat.md`
> if one exists. Sixth plan of **Wave 5 (Conditioning / constrained)**.
> Structure and wiring verified via direct source trace of
> `src/data/skeleton.ts`, `src/features/workout/progression/skeleton.ts`,
> `src/features/workout/progression/index.ts`, `src/pages/Dashboard.tsx`,
> `src/pages/Onboarding.tsx`, `src/contexts/UserContext.tsx`,
> `src/pages/WorkoutView.tsx`, `src/data/portfolio.ts`,
> `src/contexts/translations.ts`, `src/types.ts` — **plus a full `test_claude`
> live pass**: logged in on the first attempt, switched into Skeleton
> (mandatory 3-day Mon/Wed/Fri weekday selection, `scheduleMode: 'fixed'`),
> completed **two** full 19-set Week-1 sessions (Monday and Wednesday) via
> direct-DOM set logging, confirmed `skeletonStatus.plankTargetSeconds`
> incremented 30→40 in Firestore after an all-sets-hit plank session, confirmed
> the Deficit Push-up PR dashboard widget stuck at "--" after two logged
> sessions with real Deficit Push-up reps, and ran a deliberate
> `dashboardViewWeek` localStorage-poisoning test to confirm T-9. Volume and
> systemic figures computed from a throwaway `tsx` script (deleted after use)
> resolving all 7 distinct exercise ids against `EXERCISE_LIBRARY` and its
> `intelligence` block (7/7 resolved).

| | |
|---|---|
| **id** | `skeleton-to-threat` |
| **Length** | 12 weeks, one shared exercise template computed live per session in `preprocessDay` (no static `DaySpec` array — the base `SKELETON_PROGRAM.weeks` holds 7×12 empty rest-day placeholders, entirely populated at read time) |
| **Frequency** | Fixed 3 days/week, mandatory weekday selection at onboarding (`scheduleMode: 'fixed'`) |
| **Weekly sets** | 57 (weeks 1-8) / 72 (weeks 9-12, "late phase" +1 set on 5 of 7 slots) across 3 sessions — see §4 |
| **Declared kind** | Beginner, full-body, `adaptability: 'fixed'`, `fatigue: 2` |
| **Calibration** | None — `calculateWeight` always returns `undefined` (a deliberate design choice: every exercise in the pool is bodyweight or reps-driven, not externally loaded) |
| **Source** | `src/data/skeleton.ts` (195 lines) + `src/features/workout/progression/skeleton.ts` (70 lines: `plankProgression`, `completion`) |
| **Stated promise** | Card: *"12-week beginner program. For those who have never touched a weight."* Features: *"Focus: Full Body," "3 Days / Week," "Flexible Schedule."* Portfolio quiz `signatureMechanic`: *"Full-body beginner progression that adds load whenever the last session was clean."* Dashboard framing: *"Time to Become a Threat"* / *"Metamorphosis — N weeks left — Until you are no longer a skeleton."* Dashboard widget: *"Deficit Push-up PR — Perfect Reps (Single Set)."* |

---

## 1. Headline finding

**Skeleton breaks Wave 5's dead-headline-mechanic streak on its actual core progression system — the plank time-based progression is real, live-confirmed, and works exactly as designed — but the plan's second dashboard-facing claim, the Deficit Push-up PR tracker, is dead for a much narrower and more mundane reason than any prior Wave-5 finding: a single hardcoded string literal (`'skeleton-'`) that can never equal the plan's real `programId` (`'skeleton-to-threat'`).**

### 1a. The plank progression is genuinely wired and live-confirmed working

`skeletonProgression` (`src/features/workout/progression/skeleton.ts`) is registered in `PROGRESSION_HANDLERS['skeleton-to-threat']` (`src/features/workout/progression/index.ts:32`) — unlike Iron Clock's `ironClockStatus`, REDLINE's `redlineStatus`, and Lazarus's `lazarusStatus`, this is not a status object with zero writers. Two rules run on every save: `plankProgression` (bump `plankTargetSeconds` by 10 seconds if every prescribed plank set hit the current target) and `completion` (mark the plan complete on the athlete's own last training day of week 12).

Live-confirmed twice in this session. First Week-1 Monday session: three Planks sets logged with `reps` values of 15/20/15-family noise from an early automation pass that did not reliably hit the 30-second target on every set — `skeletonStatus` remained absent from Firestore afterward, correctly reflecting "not all sets hit target." Second Week-1 Wednesday session, all 19 sets logged cleanly including three Planks sets at 35 seconds each (target 30) — a direct Firestore read immediately after `COMPLETE WORKOUT` showed `skeletonStatus: { plankTargetSeconds: 40 }`, exactly the 30→40 bump `PLANK_INCREMENT = 10` predicts. This is the cleanest positive progression-mechanic confirmation of any Wave-5 plan so far: not merely "a real code path exists," but a specific before/after numeric change, live-observed, matching the source's own documented rule to the second.

### 1b. The Deficit Push-up PR widget is permanently stuck at "--" — a one-string-literal bug, not a missing-writer bug

`Dashboard.tsx:109`:

```ts
if (user.programId === 'skeleton-' && d.exercises) {
```

The plan's actual `programId` is `'skeleton-to-threat'` (`src/data/skeleton.ts:5`). `'skeleton-'` is not a prefix match, an alias, or a legacy id found anywhere else in the codebase — it is simply wrong, and the condition can never be true for any athlete on any session. `localMaxDeficitPushupReps` therefore never advances past its initial `0`, and `Dashboard.tsx:1202`'s `{maxDeficitPushupReps > 0 ? maxDeficitPushupReps : '--'}` renders `'--'` unconditionally, forever, regardless of how much real Deficit Push-up data exists in the athlete's `workouts` subcollection.

Live-confirmed: after the first logged session (Deficit Push-ups: 15, 20, 15 reps) the dashboard showed "Deficit Push-up PR — --". After the second logged session (Deficit Push-ups: 30, 30, 30 reps, a personal-record-worthy number by any reading) the dashboard still showed "Deficit Push-up PR — --". A direct Firestore check of both logged `workouts` documents confirms the underlying data is present and correctly shaped (`exercises[].name === 'Deficit Push-ups'`, `setsData[].reps` populated) — the bug is entirely in the dashboard's own filter condition, not in what gets saved. This is a narrower, more mechanical defect than every other Wave-5 dead-feature finding (Iron Clock T-32, REDLINE T-34, Lazarus's Memory Curve) — those required an entire unbuilt onboarding step or an entirely unwritten status object; this one is a single incorrect string literal in an `if` condition, on a feature whose write side (the workout log) already works perfectly.

### 1c. `getExerciseAdvice`'s "beat last week" tip works correctly and is a genuine, if smaller, positive

Independent of the PR widget, `getExerciseAdvice` (`src/data/skeleton.ts:107-190`) reads the *previous logged session* directly (not the broken `programId === 'skeleton-'` aggregate) and correctly surfaced `"Try to beat: 20 reps this week"` on the second session's live Deficit Push-ups card — sourced from the first session's actual max rep count (20), confirmed against the live page text. This is a smaller, session-scoped echo of the same "beat your best" idea the dead PR widget was meant to surface plan-wide, and it works — an athlete running Skeleton does get real, correctly-computed progressive-overload coaching on Deficit Push-ups, just not the persistent all-time-PR summary card the dashboard promises.

---

## 2. Structure

### The fully dynamic, single-template day

Unlike every prior Wave 5 plan (static `DaySpec` arrays with phase transforms), Skeleton's base `Program` (`SKELETON_PROGRAM`) contains 12 weeks × 7 days of empty rest-day placeholders — **no exercises are ever defined statically**. `preprocessDay` computes the entire exercise list live, on every render, for every training day, entirely from `day.id` (parsed for the week number) and `day.dayOfWeek` (checked against `user.selectedDays`):

| Exercise | Base sets (wk 1-8) | Late-phase sets (wk 9-12) | Target |
|---|---|---|---|
| Deficit Push-ups | 3 | 3 (unchanged) | AMRAP |
| Leg Extensions | 3 | 4 | 12-20 reps |
| Supported Stiff Legged DB Deadlift | 3 | 4 | 10-15 reps |
| Standing Calf Raises | 3 | 4 | 15-20 reps |
| Inverted Rows | 2 | 3 | 8-15 reps |
| Overhand Mid-Grip Pulldown | 2 | 3 | 10-15 reps |
| Planks | 3 | 3 (unchanged) | `plankTargetSeconds`sec, dynamic |

`getSets(base) = isLatePhase ? base + 1 : base`, where `isLatePhase = week >= 9`. Push-ups and Planks are deliberately excluded from the late-phase bump (AMRAP and isometric-hold slots don't take a straightforward "+1 set" the same way). All non-Plank exercises are stamped with a `20X0` tempo (2s eccentric, explosive concentric, no pause) — live-confirmed via the "TEMPO 2:0:X:0" label shown on every exercise card except Planks, which correctly shows no tempo (isometric).

### Onboarding

Single-step flow, live-confirmed: mandatory "select exactly 3 training days" screen (`scheduleMode` stays `'fixed'`) — no exercise-selection, calibration, or preference step of any kind. Selecting Monday/Wednesday/Friday and clicking "BUILD PROGRAM" (initially disabled until exactly 3 days are checked, correctly re-enabling one render tick after the third click) landed directly on the live dashboard at Week 1.

### `xStatus`, T-2, T-3, T-4, T-9, T-22, T-23, reverse-nordic

- **`skeletonStatus` is genuinely wired — the cleanest working-status case in Wave 5 so far.** `{ plankTargetSeconds, completed, completionDate }` (`src/types.ts:370`) is written by a real, registered progression handler and live-confirmed changing after a qualifying session (§1a).
- **T-2/T-28 does *not* reproduce — `resetProgram()` already covers Skeleton correctly, and this session confirms it's still accurate.** `UserContext.tsx:470`: `if (currentId === 'skeleton-to-threat') statusUpdates.skeletonStatus = null;` — one of only three plans on the hardcoded allowlist (`bench-domination`, `pencilneck-eradication`, `skeleton-to-threat`), and unlike Bench Domination/Pencilneck's own findings elsewhere, this entry is exactly right: the field name matches the type exactly, and `resetProgram()`'s generic path (`UserContext.tsx:461-465`) also correctly resets `programProgress['skeleton-to-threat']` to `{ completedSessions: 0, startDate: <now> }` on every reset. This directly answers the audit brief's specific question: the allowlist entry is both present and sufficient, no gap to report.
- **No `type: 'wave'` anywhere** — zero T-3 exposure. `calculateWeight` always returns `undefined`; there is no weight-based progression axis at all.
- **No classic T-4 duplicated-definition drift.** All 7 exercises are defined exactly once, inline, in a single `preprocessDay` call — there is no second copy anywhere to drift.
- **No `reverse-nordic-curl`** anywhere in the exercise pool — clean, consistent with every Wave 5 plan checked so far.
- **T-9 reproduces live, a fifth time in Wave 5 (after Iron Clock, REDLINE, Atlas, Lazarus; 30-Min Adventure remains the wave's only immune plan).** `dashboardWidgets: ['skeleton_countdown', 'skeleton_pushup_max', 'workout_history']` are rendered as conditional blocks inside the shared `Dashboard.tsx` (lines 1179-1207), not an early-returning dedicated component — same shape as Lazarus's "has a widget, not a component" case, not Athena/Venus Rising/Kali/House of Iron/30-Min Adventure's true immunity. Live-confirmed via a deliberate localStorage-poisoning test: setting `dashboardViewWeek-test_claude` to `'9'` and reloading showed **"Full Body — Week 9"** as the next session (with the Metamorphosis countdown correctly recalculating to "3 weeks left" from the poisoned value), despite only 2 real completed sessions in `programProgress['skeleton-to-threat']`, which should resolve to Week 1 (2 of 3 weekly sessions done).
- **T-22 does not apply.** `dashboardWidgets` requests no `strength_chart`, and no code path calls `trackedLiftFor()` for this plan.
- **T-23 does not apply — structurally, not merely un-triggered.** Neither of the plan's two candidate exercises resolves to `weighted-bodyweight`: `deficit-push-up` and `inverted-row` both carry `weightMode: 'bodyweight'` in `EXERCISE_LIBRARY` (confirmed via direct lookup), not `'weighted-bodyweight'`. This directly answers the audit brief's specific check: **Skeleton does not reproduce the `WorkoutView.tsx:842` hardcoded-allowlist gap**, for the same structural reason as Lazarus — there is no total-system-weight concept anywhere in this plan's exercise pool for the allowlist to exclude.
- **A source-comment-vs-reality mismatch, working correctly by a different mechanism than the comment implies.** `UserContext.tsx:99-107`'s `scheduleMode === 'rolling'` branch carries a comment naming Skeleton explicitly (*"Skeleton (and similar) stores empty placeholders and fills from `day.id` in `preprocessDay` — do not strip those ids"*) — but Skeleton's onboarding always sets `scheduleMode: 'fixed'` (confirmed live and in Firestore: `"scheduleMode": "fixed"`), so this branch is never actually reached for Skeleton at all. Skeleton instead takes the `selectedDays`-based remap path (`UserContext.tsx:118-143`) — and because *every* day in `SKELETON_PROGRAM`'s static template has `exercises: []` (not just the non-training days), `originalTrainingDays.length === 0` on every week, hitting the early return at line 123 and passing the week through completely unmodified. The correct result — training days landing on the athlete's actual chosen weekdays — still happens, but entirely because `preprocessDay`'s own `user.selectedDays?.includes(day.dayOfWeek)` check does the real work independently, not because of the 'rolling' code path the comment attributes it to. Live-confirmed via the Monday/Wednesday sessions both logging with correct `day: 1` / `day: 3` fields and week-1-scoped exercise ids (`sk-w1-d1-e*`, `sk-w1-d3-e*`). Not a bug — the athlete-facing behavior is exactly correct — but a stale/misleading source comment worth fixing alongside any future touch of that function, since it currently documents a code path Skeleton never uses.

---

## 3. Findings

### 3.1 The Deficit Push-up PR dashboard widget is permanently stuck at "--" for every athlete, on every session, forever · **severity: medium, `plan-local`**

Detailed in §1b. `Dashboard.tsx:109`'s `user.programId === 'skeleton-'` can never match the plan's real id, `'skeleton-to-threat'`. Live-confirmed across two fully logged sessions with real Deficit Push-up data (15/20/15 reps, then 30/30/30 reps) — the widget showed `'--'` both times. The narrowest and most mechanically trivial dead-feature root cause found in the audit so far: a one-character-class typo in a string literal, not a missing onboarding step or an unwritten status object. The underlying data the widget needs is already saved correctly on every session; only the aggregation query that would read it back is broken.

### 3.2 T-9 reproduces via widget-in-shared-Dashboard, not a dedicated component · **severity: medium, `shared-bug`**

Detailed in §2. Skeleton's three dashboard widgets (`skeleton_countdown`, `skeleton_pushup_max`, `skeleton_quotes`) are all conditional blocks inside the shared `Dashboard.tsx`, not an early-returning dedicated component — same non-immunity shape as Lazarus. Live-confirmed via a deliberate `dashboardViewWeek` localStorage-poisoning test: poisoning to `'9'` showed "Full Body — Week 9" (and a recalculated "3 weeks left" countdown) despite only 2 of the week's 3 sessions being complete, which should resolve to Week 1.

### 3.3 `programProgress['skeleton-to-threat']` never receives a `startDate` sub-field from ordinary session completion — though it is correctly written on plan switch and reset · **severity: low, `hypothesis`**

Live-confirmed: after two completed sessions logged via ordinary `START WORKOUT` → `COMPLETE WORKOUT` flow, `programProgress['skeleton-to-threat']` in Firestore holds only `{ completedSessions: 2 }`, missing the `startDate` field every sibling `programProgress` entry in the same document carries — same shape as REDLINE's T-37, Atlas's T-46, and Lazarus's equivalent finding. Notably, this is *not* a `switchProgram()`/`resetProgram()` gap on this plan specifically — `resetProgram()`'s generic path (§2) does correctly write `startDate` when a reset happens. The gap is narrower than on other plans: it is the ordinary session-complete handler (increments `completedSessions` only) that never backfills `startDate` for a plan freshly switched into without an explicit reset. Given the identical code path already confirmed working via a fallback on Atlas (`WorkoutView.tsx:333`'s `|| user.startDate`), this is recorded at hypothesis severity rather than a live-observed wrong date.

### 3.4 Stale source comment misattributes Skeleton's day-of-week correctness to the `scheduleMode === 'rolling'` branch it never reaches · **severity: low, `hypothesis`**

Detailed in §2. Not a live bug — Monday/Wednesday sessions both resolved to the correct week/day and produced correctly-shaped `workouts` documents — but the comment at `UserContext.tsx:106-107` names Skeleton as the reason for a code path (`scheduleMode === 'rolling'`) that Skeleton's own onboarding never actually sets. Worth a one-line comment fix the next time that function is touched, so a future reader doesn't misdiagnose which path is load-bearing for this plan.

### 3.5 The "Flexible Schedule" card claim is a fixed 3-of-7 weekday picker, not a flexible/rolling template · **severity: low, `plan-local`**

The portfolio card's third bullet reads "Flexible Schedule." In the live app this means "pick any 3 of the 7 weekdays once, at onboarding" (same mechanism as Lazarus's fixed weekday selection) — not a rolling/completion-driven template like Kali's or Gravity Is Optional's `scheduleMode: '4day'` `planPreferences`, and not adjustable after the fact without a full plan-switch/reonboard. "Flexible" is technically true relative to a fully fixed Mon/Wed/Fri-only plan, but reads as a stronger claim (day-to-day flexibility) than what's actually offered (a one-time weekday choice).

---

## 4. Weekly volume (fractional sets/muscle/week)

Computed from `EXERCISE_LIBRARY`'s native primary(1.0)/secondary(0.5) categorization, matching the convention used in the most recent Wave-5 docs; all 7 distinct exercise ids resolved cleanly.

### Weeks 1-8, 57 sets/week across 3 sessions

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Lats | 12.0 | | Front delt | 4.5 |
| Upper back | 9.0 | | Triceps | 4.5 |
| Calves | 9.0 | | Rear delt | 3.0 |
| Quads | 9.0 | | Obliques | 4.5 |
| Hamstrings | 9.0 | | Biceps | 6.0 |
| Glutes | 9.0 | | | |
| Chest | 9.0 | | | |
| Abs | 9.0 | | | |
| Lower back | 4.5 | | | |

### Weeks 9-12 (late phase), 72 sets/week across 3 sessions

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Lats | 18.0 | | Front delt | 4.5 |
| Upper back | 13.5 | | Triceps | 4.5 |
| Quads | 12.0 | | Rear delt | 4.5 |
| Hamstrings | 12.0 | | Obliques | 4.5 |
| Glutes | 12.0 | | Biceps | 9.0 |
| Calves | 12.0 | | | |
| Chest | 9.0 | | | |
| Abs | 9.0 | | | |
| Lower back | 6.0 | | | |

Against the ≥5-sets/muscle/week reference point (§7 calibration principle — judged case by case, not a hard floor): even the weeks 1-8 floor is comfortably cleared everywhere except front delt/triceps/rear delt/obliques (all in the 3.0-4.5 range), appropriate for a beginner full-body plan whose 7-exercise pool doesn't dedicate an isolated slot to any of them — front delt/triceps only appear as Deficit Push-ups' secondary credit, rear delt only as Inverted Rows' secondary credit. Biceps (6.0→9.0) is entirely secondary-only credit too (Inverted Rows + Overhand Mid-Grip Pulldown), consistent with a beginner template that doesn't isolate arms directly. The late-phase jump is substantial and well-distributed — every muscle at or above its weeks-1-8 number, none left behind — a genuine, real volume progression independent of the dead PR widget. No direct adductor isolation, no soleus-specific loader (Standing Calf Raise's `gastrocnemius 1.0` primary carries no soleus credit under this plan's native-categorization convention), no upper-trap or tibialis-anterior exposure — consistent with the map's portfolio-wide zero-coverage findings; Skeleton does nothing to close any of those gaps, same as every plan audited so far.

---

## 5. Systemic and joint load (weekly, 3 sessions)

| Metric | Weeks 1-8 | Weeks 9-12 (late phase) |
|---|---|---|
| Systemic | **90** | **114** |
| Axial | **9** | **12** |
| Lower back | **39** | **54** |
| Knee | **18** | **24** |
| Shoulder | **9** | **9** |
| Elbow | **15** | **18** |
| Sets | 57 | 72 |
| Per-set systemic | **1.58** | **1.58** |

Second-lowest per-set systemic cost of any Wave 5 plan audited so far (Lazarus 1.42-1.49, Skeleton 1.58, Iron Clock 1.47 is actually lower — Skeleton sits between Iron Clock/Lazarus and REDLINE 1.52/30-Min Adventure 1.80/Atlas 1.87-2.02), consistent with a beginner-appropriate, bodyweight/machine-dominant exercise selection (Deficit Push-ups, Leg Extension, Standing Calf Raise, Inverted Rows, cable Pulldown — only the Supported Stiff Legged DB Deadlift carries meaningful lower-back cost, and it's explicitly "supported," reducing its systemic and axial load relative to a free hinge). The lower-back figure (39-54) is entirely driven by two slots — the SLDL (`lowerBackCost: 3` ×9-12 sets) and Inverted Rows (`lowerBackCost: 2` ×6-9 sets) — worth noting for a true beginner audience where lower-back tolerance is often the limiting factor early on; the plan's own selection (a supported hinge variant rather than a free RDL) already reflects awareness of this. `fatigue: 2` (of presumably a 1-5 portfolio scale) matches the computed totals reasonably well relative to other low-fatigue-rated plans in the audit.

---

## 6. Improvements, ranked

### 1. Fix the one-character string comparison powering the Deficit Push-up PR widget · `plan-local`

The highest-leverage fix in this doc by a wide margin, and the cheapest fix of any Wave-5 finding: `Dashboard.tsx:109`'s `user.programId === 'skeleton-'` should read `user.programId === 'skeleton-to-threat'`. No onboarding step, status object, or write path needs to change — the underlying `workouts` documents already carry correctly-shaped `Deficit Push-ups` entries on every session. This single-line fix immediately makes the plan's only quantitative dashboard callout functional for every athlete who has ever run the plan, retroactively, since the fix operates on already-logged history.

### 2. Give the "Metamorphosis" countdown widget a plank-target companion, so the plan's one genuinely working adaptive number is visible somewhere on the dashboard · `hypothesis`

`skeletonStatus.plankTargetSeconds` is real, live-updating data (confirmed in §1a) with no dashboard surface of its own — the athlete only discovers their current plank target by starting a session and reading the live exercise card. A small addition next to the (also real) countdown widget — e.g. "Current plank target: 40s" — would make the plan's one genuinely adaptive, athlete-facing mechanic visible without opening a workout, complementing the fix in item 1 rather than duplicating it.

### 3. Reconsider "Flexible Schedule" as card copy, or build the flexibility it implies · `plan-local`

Detailed in §3.5. The current mechanism (a one-time, unchangeable 3-of-7 weekday pick at onboarding) is closer to "fixed schedule, your choice of days" than "flexible." Either soften the copy to match Lazarus's more accurate "3 full-body days" framing, or extend the mechanism to allow genuinely flexible/rolling session order (matching the `scheduleMode: 'rolling'` machinery already built and working elsewhere in the codebase for Kali/Gravity Is Optional) if "flexible" is meant literally.

### 4. Backfill `startDate` on `programProgress['skeleton-to-threat']` from the ordinary session-complete handler, not just `resetProgram()` · `shared-bug`

Detailed in §3.3. Lower priority than items 1-2 since a documented fallback (`|| user.startDate`) already covers the immediate display consequence on at least one other plan (Atlas) — but worth fixing in the same pass as the other Wave 4-5 instances of this gap (REDLINE T-37, Atlas T-46, Lazarus's equivalent) so the fallback doesn't have to keep doing the work indefinitely.

### 5. Extend the late-phase (week 9-12) set bump to Deficit Push-ups and Planks, or state explicitly why they're excluded · `hypothesis`

Currently 5 of 7 slots gain a set in the late phase; Push-ups (AMRAP) and Planks (isometric, time-progressed) don't, which is a reasonable design choice given their different progression axes — but nothing in the card or in-app copy explains this to the athlete, who may notice the asymmetry and wonder if it's an oversight. A one-line note ("Push-ups and Planks progress by reps/time instead of sets") would close the gap without changing the underlying design.

### 6. Fix the stale `scheduleMode === 'rolling'` comment attributing Skeleton to a code path it never reaches · `hypothesis`

Detailed in §3.4. Not athlete-facing — purely a maintainability fix for the next person reading `UserContext.tsx:99-116` and trying to understand which branch actually handles Skeleton's day-of-week remap.

---

## 7. Verdict

**Skeleton is Wave 5's second plan (after 30-Min Adventure) whose core, named progression mechanic survives contact with the running app — the plank time-based progression is real, correctly registered, and was live-confirmed producing an exact, predicted 30→40 second bump after a clean session.** This breaks a streak that had held for three consecutive plans (Iron Clock, REDLINE, Lazarus), each of which had its entire headline mechanic silently dead. Skeleton's failure mode is different in kind, not degree: the plan's *secondary* dashboard claim (the Deficit Push-up PR tracker) is dead for the narrowest, most mechanically trivial reason found anywhere in this audit — a single incorrect string literal comparing the plan's real id against a value that was presumably true at some earlier point in the codebase's history (`'skeleton-'`, missing the `to-threat` suffix) and never updated. Unlike Iron Clock/REDLINE/Lazarus, fixing this costs one line and touches no missing onboarding flow or unwritten status object — the underlying data has been correct on every logged session throughout this audit.

On pure training-design merit, independent of the wiring findings: a 7-exercise, bodyweight/machine-dominant full-body template with a beginner-appropriate low systemic cost (1.58 per-set, among the lowest in Wave 5), a genuine late-phase volume progression (+15 sets/week from week 9), a working session-to-session "beat your best" coaching tip on the plan's signature exercise, and a real, live-confirmed adaptive plank-hold target is a sound, well-calibrated beginner program — closely matching general recommendations for novice full-body training (moderate per-session volume, compound-pattern coverage across all major muscle groups, conservative lower-back exposure via a supported hinge variant rather than a free RDL). The plan's `resetProgram()` coverage is also the cleanest of any plan checked this wave — one of only three plans on the hardcoded status-nulling allowlist, and correctly so. An athlete running Skeleton today gets a genuinely well-built, appropriately-paced beginner program with real week-to-week adaptivity on its plank work; they just never see their own Deficit Push-up personal record reflected back to them on the dashboard the card promises it for, despite that exact data sitting correctly in their own workout history the entire time.

---

## 8. Export block

```yaml
id: skeleton-to-threat
version: 2
length: { weeks: 12, phases: 2 }
frequency: fixed_3day_mandatory_weekday_selection
weekly_sets: { wk1_8: 57, wk9_12_late_phase: 72 }
kind: beginner_fullbody_bodyweight_dominant_no_external_load_progression
calibration: none_by_design_all_exercises_bodyweight_or_reps_driven
engine: dynamic_preprocessDay_no_static_dayspec_registered_plank_progression_handler_widgets_in_shared_dashboard
systemic_load: { wk1_8: { systemic: 90, axial: 9, lower_back: 39, knee: 18, shoulder: 9, elbow: 15, sets: 57, per_set: 1.58 }, wk9_12: { systemic: 114, axial: 12, lower_back: 54, knee: 24, shoulder: 9, elbow: 18, sets: 72, per_set: 1.58 } }
volume_top_wk1_8: { lats: 12.0, upperBack: 9.0, calves: 9.0, quads: 9.0, hamstrings: 9.0, glutes: 9.0, chest: 9.0, abs: 9.0 }
volume_top_wk9_12: { lats: 18.0, upperBack: 13.5, quads: 12.0, hamstrings: 12.0, glutes: 12.0, calves: 12.0, chest: 9.0, abs: 9.0 }
positive_findings:
  - "Plank time-based progression (skeletonProgression) is real, registered in PROGRESSION_HANDLERS, and live-confirmed: skeletonStatus.plankTargetSeconds correctly bumped 30 -> 40 in Firestore immediately after an all-sets-hit plank session, exactly matching the source's PLANK_INCREMENT = 10 rule"
  - "getExerciseAdvice's session-scoped 'beat last week' tip works correctly and live-confirmed ('Try to beat: 20 reps this week' after a first session with a 20-rep max)"
  - "resetProgram()'s hardcoded status-nulling allowlist already covers skeletonStatus correctly and completely -- one of only three plans (with bench-domination and pencilneck-eradication) where this audit's T-2 check finds no gap at all"
  - "No reverse-nordic-curl, no type:'wave' exposure, no classic T-4 duplicated-slot drift, no T-22 exposure, no T-23 exposure (structural -- both candidate exercises resolve to weightMode:'bodyweight', not 'weighted-bodyweight')"
  - "Second-lowest per-set systemic cost of any Wave 5 plan audited (1.58 vs Iron Clock 1.47, Lazarus 1.42-1.49, REDLINE 1.52, 30-Min Adventure 1.80, Atlas 1.87-2.02), consistent with and appropriate for a true-beginner audience"
dead_features:
  - area: "src/pages/Dashboard.tsx:109 (Deficit Push-up PR widget aggregation)"
    detail: "if (user.programId === 'skeleton-' && d.exercises) can never be true -- the plan's real programId is 'skeleton-to-threat'. localMaxDeficitPushupReps never advances past 0, so Dashboard.tsx:1202's PR widget renders '--' unconditionally for every athlete, forever, despite correctly-shaped Deficit Push-ups data already present in every logged workout. Live-confirmed across two sessions with real reps (15/20/15, then 30/30/30) -- widget showed '--' both times. Narrowest root cause of any Wave-5 dead-feature finding: a one-line string-literal fix, no missing writer or onboarding step involved."
plan_local_bugs:
  - area: "src/pages/Dashboard.tsx skeleton_countdown/skeleton_pushup_max/skeleton_quotes widgets + shared dashboardViewWeek path"
    detail: "Skeleton's dashboard widgets are conditional blocks inside the shared Dashboard.tsx rather than an early-returning dedicated component, so the plan does not get the T-9 immunity that a true dedicated dashboard provides. T-9 reproduces live: a dashboardViewWeek-test_claude localStorage poisoning test (set to '9') showed 'Full Body - Week 9' and a recalculated '3 weeks left' countdown despite only 2 of 3 weekly sessions completed, which should resolve to Week 1."
  - area: "src/contexts/UserContext.tsx session-complete handler (programProgress.skeleton-to-threat)"
    detail: "programProgress['skeleton-to-threat'] never received a startDate sub-field from ordinary session completion (only completedSessions incremented) -- same shape as REDLINE's T-37, Atlas's T-46, and Lazarus's equivalent. Unlike those plans' resetProgram() gaps, Skeleton's resetProgram() itself correctly writes startDate on an explicit reset -- this gap is narrower, in the ordinary session-complete path only. Not independently confirmed for a working fallback this session; recorded at hypothesis severity given the identical code path to Atlas's confirmed-working case."
  - area: "src/contexts/UserContext.tsx:99-116 (scheduleMode === 'rolling' branch comment)"
    detail: "The comment explicitly names Skeleton as relying on this branch's empty-placeholder handling, but Skeleton's onboarding always sets scheduleMode: 'fixed' (confirmed live and in Firestore), so the branch is never reached for this plan. Skeleton instead takes the selectedDays-remap path, which happens to produce correct output via an early-return no-op (every week's exercises array is empty in the static template, not just non-training days). Not a live bug -- Monday/Wednesday sessions both resolved to correct week/day -- but a stale, misattributing comment worth fixing on next touch."
verification_note: "test_claude logged in successfully on the first attempt this session (continued directly from the prior Lazarus pass, no device-lock recurrence). Full live pass: onboarding (mandatory Mon/Wed/Fri weekday selection, BUILD PROGRAM correctly gated on exactly 3 selected days), two complete 19-set Week-1 sessions logged via direct-DOM set logging (Monday day=1 and Wednesday day=3, both confirmed via direct Firestore reads with correctly-shaped exercises/setsData), a direct Firestore cross-check confirming skeletonStatus.plankTargetSeconds correctly bumped 30->40 after the second (all-sets-hit) session, a direct comparison of the Deficit Push-up PR dashboard widget against real logged data confirming it never updates from its '--' default, and a deliberate dashboardViewWeek localStorage-poisoning test proving T-9 (poisoned to week 9, resolved incorrectly to 'Full Body - Week 9' with a recalculated countdown)."
audit: { date: 2026-08-15, findings: 5, verdict: "Skeleton's actual headline progression mechanic (plank time-based target) is real and live-confirmed working exactly as designed, breaking Wave 5's three-plan dead-headline-mechanic streak. The plan's secondary Deficit Push-up PR dashboard claim is dead, but for the narrowest root cause found anywhere in this audit -- a single incorrect string literal comparing programId against a value that can never match, with the underlying write-side data already correct on every session. resetProgram()'s status-nulling allowlist is fully accurate for this plan, no gap. T-9 reproduces via widget-in-shared-Dashboard, not a dedicated component -- fifth Wave-5 instance. No weighted-bodyweight exposure means T-23 does not reproduce, structurally." }
```
