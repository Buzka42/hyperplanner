# Atlas

> Unified plan document, v2 format. Supersedes `docs/plans/atlas.md` if one
> exists. Fourth plan of **Wave 5 (Conditioning / constrained)**. Structure
> and wiring verified via direct source trace of `src/data/plans/atlas.ts`,
> `src/features/atlas/carries.ts`, `src/features/workout/progression/atlas.ts`,
> `src/pages/WorkoutView.tsx`, `src/contexts/UserContext.tsx`,
> `src/data/portfolio.ts`, `src/contexts/translations.ts` — **plus a full
> `test_claude` live pass**: logged in on the first attempt, switched into
> Atlas (mandatory 3-day schedule step, seeded squat/deadlift 1RMs from
> profile), completed two full sessions (Atlas I and Atlas II, 17 sets each)
> via direct-DOM set logging including limiter tags on both carry exercises,
> confirmed a third session (Atlas III) live-swapped its carry exercise as a
> result, and cross-checked `atlasStatus`, `workingLoads.atlas`, and
> `programProgress.atlas` directly in Firestore after each session. Volume
> and systemic figures computed from a throwaway `tsx` script (deleted after
> use) resolving all 26 distinct exercise ids used across both gauntlets
> against `EXERCISE_LIBRARY` (26/26 resolved) and `buildExerciseIntelligence()`.

| | |
|---|---|
| **id** | `atlas` |
| **Length** | 10 weeks, run as two internal 5-week "gauntlets" (`Gauntlet I` = weeks 1-5, `Gauntlet II` = weeks 6-10) sharing one `definePlan()` phase table but built from two entirely separate `DaySpec` arrays (`ATLAS_GAUNTLET_ONE`/`ATLAS_GAUNTLET_TWO`), swapped by a `preprocessDay` hook keyed on `gauntletFor(week)` rather than a normal phase-transform |
| **Frequency** | Fixed 3 days/week, mandatory weekday selection at onboarding (Mon/Wed/Fri-style presets or manual pick) |
| **Weekly sets** | 53 (Gauntlet I) / 55 (Gauntlet II) across 3 sessions — see §4 |
| **Declared kind** | Strength, intermediate/advanced, full-body, `adaptability: 'fixed'`, `fatigue: 4` |
| **Calibration** | Optional 1RM seeding at onboarding for squat/standing-press/conventional-deadlift (`seedStats`), used only for the very first working-weight suggestion per exercise via `seedLoadFor()` — the plan's own `calculateWeight` hook explicitly defers to any already-logged weight first, never overriding a value the athlete has moved |
| **Source** | `src/data/plans/atlas.ts` (159 lines) + `src/features/atlas/carries.ts` (72 lines: limiter types, `carryScore`, `limiterAdvice`, gauntlet/hinge/power-work constants, `nextCarryFor`) + `src/features/workout/progression/atlas.ts` (33 lines: carry-logging progression handler) |
| **Stated promise** | Card: *"A 10-week strength plan run as two five-week gauntlets, built on carries and hard basics."* Features: *"3 full-body days," "Two five-week movement sets," "Carries scored as time × load," "Optional kettlebell power work."* Portfolio quiz `signatureMechanic`: *"Two five-week gauntlets, with carries trained as a lift and scored as time × load."* File header comment: *"Carries are trained as a lift, not as a finisher."* |

---

## 1. Headline finding

**Atlas is a mixed case unlike any other Wave 5 plan so far: its central mechanic is real, live-confirmed, and the single most sophisticated piece of cross-session conditional logic found in the wave — but the specific claim printed on the card about that mechanic ("scored as time × load") is decorative, and two of the plan's other three advertised features are dead on independent inspection.**

### 1a. The carry-limiter swap mechanic is real, working, and the best-wired headline feature in Wave 5 — confirmed end-to-end live

Every carry set (Farmer Carry, Suitcase Carry, Suitcase Hold) is logged with an optional limiter tag (grip / trunk / breathing / upper-back / legs / none) via a real button row shown only on carry exercises. `atlasProgression` (`src/features/workout/progression/atlas.ts`) appends one aggregated `{exerciseId, week, seconds, loadKg, limiter, date}` entry per carry exercise per session to `atlasStatus.carries`, live-confirmed twice this session (Firestore showed a `farmer-carry` entry after session 1, a second `suitcase-carry` entry after session 2, both correctly aggregating multiple sets' interval-seconds into one record and correctly recording the tagged limiter). `preprocessDay`'s `carrySwap` logic then compares the two most recent carry entries: if both share the same non-`'none'` limiter, `nextCarryFor()` substitutes a different carry movement into the *next* session's carry slot. **Live-confirmed exactly as designed**: after tagging both Atlas I's Farmer Carry and Atlas II's Suitcase Carry as "grip," Atlas III's originally-scripted Suitcase Hold slot rendered as **Farmer Carry** instead, with the note *"Swapped from last limiter (grip)"* visible to the athlete. This is a genuine, multi-session, state-driven adaptive mechanic that works — the strongest positive finding of Wave 5, ahead of even 30-Min Adventure's session generator, because it involves real conditional logic across sessions rather than a single session's self-contained generation.

### 1b. "Carries scored as time × load" is not true of anything the athlete sees

`carryScore()` (kg·load × seconds ÷ 60, "reported in kg·min for readability" per its own doc comment) and `compareCarries()` (better/worse/equal between two carry results) are both fully implemented and exported from `carries.ts` — and **never called anywhere else in the codebase.** No dashboard widget, workout view, or history screen computes or displays a kg·min score for any carry, ever, despite this being one of exactly four bullet points on the plan's onboarding card and the literal wording of the portfolio quiz's `signatureMechanic`. What the athlete actually sees is a raw weight/duration log per set — accurate, but not "scored" in the sense the copy describes. `limiterAdvice()` (the plain-English "Grip has ended your carries twice — add a suitcase hold..." message keyed off the same limiter data) is similarly declared, exported, and never imported or called anywhere — the athlete gets the *consequence* of a repeated limiter (the exercise swap, §1a) but never the *explanation* text that was written to accompany it.

### 1c. Two of the card's four features are separately dead: hinge substitution has no UI, and "optional kettlebell power work" is entirely unwired

Detailed in Findings §3.3 and §3.4. Neither is visible from the card copy alone, but both are directly checkable claims that fail on inspection.

---

## 2. Structure

### The two gauntlets

| | Gauntlet I (wk 1-5) | Gauntlet II (wk 6-10) |
|---|---|---|
| Day 1 | Safety Bar Squat, Standing Military Press, Single-Arm Hammer Row, Single-Leg RDL, Ab Wheel, **Farmer Carry** | Front Squat, Single-Arm Standing Press, Weighted Pull-ups, Staggered-Stance RDL, Hanging Knee Raise, **Farmer Carry** |
| Day 2 | Trap-Bar Deadlift, Weighted Pull-ups, Incline DB Bench, FFE Bulgarian Split Squat, Hack Calf Raise, Cable Triceps Ext, **Suitcase Carry** | Trap-Bar Deadlift, Incline DB Bench, Half-Kneeling Rotational Row, Weighted Step-Up, Hack Calf Raise, Cable Triceps Ext, **Suitcase Carry** |
| Day 3 | Safety Bar Squat, Flat DB Press, Barbell Row, Seated Hamstring Curl, Lateral Raise, Hammer Curl, Cable Triceps Ext, Hack Calf Raise, **Suitcase Hold (optional)** | Safety Bar Squat, Standing Military Press, Single-Arm Hammer Row, Lying Leg Curl, Lateral Raise, Hammer Curl, Cable Triceps Ext, Hack Calf Raise, Dip, **Suitcase Hold (optional)** |

Both gauntlets share one systemic-compound-tagged squat/hinge pair per week (Day 1 squat variant + Day 2 trap-bar deadlift), a primary press, one weighted vertical pull, unilateral lower-body accessory work, and one carry exercise per day. Gauntlet II shifts toward more unilateral/overhead volume (front squat instead of safety bar, single-arm standing press, staggered-stance RDL) exactly as the file's own header comment describes ("unilateral and overhead work take a larger share now that the patterns are established") — this specific structural claim is confirmed by direct comparison of the two `DaySpec` arrays, not just asserted.

### Onboarding and hinge substitution

Onboarding is a real 2-step flow: (1) mandatory fixed-weekday schedule selection (3 sessions/week, confirmed live — the "0/3 → 3/3" counter correctly gated the "next" button), (2) optional squat/standing-press/conventional-deadlift 1RM entry with a "tap to use" shortcut pulling from `user.stats` (confirmed live). A third step the app itself labels "EXERCISE SELECTION" is advertised by the button copy between these two steps but **does not exist as a screen** — clicking past the schedule step lands directly on Starting Numbers, confirmed live. This is the UI surface (or lack of one) for the `hinge` substitution described in Finding 3.3.

### `xStatus`, T-2, T-3, T-4, T-9, T-22, T-23, reverse-nordic

- **`atlasStatus` is real and genuinely written**, unlike Iron Clock's `ironClockStatus` and REDLINE's `redlineStatus` (both fully dead, Wave 5's opening pattern). `atlasStatus.carries` is populated by every carry-exercise completion and directly drives real behavior the following session — the strongest `xStatus` wiring seen in Wave 5.
- **T-2/T-28 gap reproduces.** Neither `atlasStatus` nor `planPreferences.atlas` appears in `resetProgram()`'s allowlist (`src/contexts/UserContext.tsx:467-470`, source-confirmed — the function only special-cases `benchDominationStatus`/`pencilneckStatus`/`skeletonStatus`). Unlike prior Wave-5 plans where this gap was consequence-free (nothing real to lose), it has real consequence here for `atlasStatus.carries`: an athlete who resets progress keeps their full carry-limiter history, so the very next post-reset session can still trigger a "swapped from last limiter" substitution seeded by pre-reset data, contradicting "Reset Current Progress"'s Week-1-Day-1 framing. Not independently live-clicked this session (per the audit's standard of preferring a direct code read over a destructive action against the account's own accumulating multi-plan state); the allowlist gap itself is unambiguous from source.
- **No `type: 'wave'` anywhere** — zero T-3 exposure. Both gauntlets use plain `progression: { type: 'double' }` on every slot.
- **No classic T-4 duplicated-definition drift.** `ATLAS_GAUNTLET_ONE`/`TWO` are two genuinely different `DaySpec` arrays (not two copies of the same slot with diverging values) — the closest analogue, `safety-bar-squat` appearing in both Day 1 and Day 3 of Gauntlet I at different set/rep prescriptions, is intentional same-exercise-different-role programming, not drift.
- **No `reverse-nordic-curl`** anywhere in either gauntlet's exercise list — clean.
- **T-9 reproduces live.** No dedicated dashboard component (`ui.dashboardWidgets: ['program_status', 'workout_history']` — both generic, shared widgets, confirmed via a `Dashboard.tsx` grep returning zero Atlas-specific matches). Live-confirmed via a deliberate `dashboardViewWeek-test_claude` localStorage poisoning test: setting the cached value to `9` and reloading showed "Week 9 · Gauntlet II" immediately on switch-in, despite `programProgress.atlas` not existing yet at that point (zero completed sessions). Resolved correctly once the cache was reset and a real session logged. Fourth Wave-5 plan checked, second exposed (after Iron Clock and REDLINE; 30-Min Adventure remains the wave's only immune plan).
- **T-22 does not apply.** `dashboardWidgets` requests no `strength_chart`, and no code path calls `trackedLiftFor()` for this plan.
- **T-23 reproduces, with a new root cause.** Detailed in Finding 3.2 — Atlas is the fourth plan this audit to hit this bug family (after Workhorse, Gravity Is Optional, Kali), and the first where the root cause is a hardcoded plan-id allowlist gap in the `totalSystemWeightKg` *producer* itself, not (only) the progression *reader*.

---

## 3. Findings

### 3.1 "Carries scored as time × load" is decorative copy — the score is never computed or shown to the athlete · **severity: medium, `plan-local`**

Detailed in §1b. `carryScore()` and `compareCarries()` are fully implemented, unit-testable, correctly designed (kg·load × seconds, normalized to kg·min) — and have zero callers anywhere outside `carries.ts` itself. `limiterAdvice()`, the plain-English explanation meant to accompany a repeated-limiter pattern, is equally dead. The athlete experiences the *consequence* of the underlying carry data (the exercise swap in Finding none — see the positive note below) but never the *feedback* the card explicitly promises ("scored as time × load"). This is the inverse of Iron Clock/REDLINE's pattern: there, the entire mechanic was unwired; here, the data pipeline and the behavioral output are both wired, but the specific display/scoring layer promised by the marketing copy sits unused between them.

**Positive counterpoint, not a finding:** the carry-limiter *swap* mechanic that consumes the same `atlasStatus.carries` data is fully wired and live-confirmed working exactly as designed (§1a) — logging two consecutive same-limiter carry sets across Atlas I and Atlas II caused Atlas III's carry slot to swap from Suitcase Hold to Farmer Carry with a visible "Swapped from last limiter (grip)" note. This is the strongest-wired specific mechanic found in Wave 5 to date, and worth recording explicitly given how consistently Wave 5's other named mechanics have turned out to be fully dead.

### 3.2 `weighted-pull-up` reproduces T-23, via a new and more specific root cause: Atlas is excluded from the `totalSystemWeightKg` producer's own hardcoded plan allowlist · **severity: high, `shared-bug`**

`weighted-pull-up` (`weightMode: 'weighted-bodyweight'`) is a primary lift in Gauntlet I's Day 2 and a secondary lift in Gauntlet II's Day 1. `WorkoutView.tsx:842` computes `totalSystemWeightKg` (bodyweight + external load) only when `programData.id === 'kali' || programData.id === 'workhorse' || programData.id === 'gravity-is-optional'` — a hardcoded three-plan allowlist that does not include `atlas`. Even setting that gate aside, `genericDoubleProgression` (the handler `atlasProgression` wraps for every non-carry exercise) reads `sets[0]?.weight` directly — external load only — matching the read-side bug already confirmed on Workhorse/Gravity Is Optional/Kali. Both problems compound here: even if Atlas were added to the producer allowlist, the progression *reader* would still need a separate fix to consume `totalSystemWeightKg` instead of raw `weight`. Live-confirmed: logging 15kg × 6 on Weighted Pull-ups (session 2, all 3 sets) wrote `workingLoads.atlas['weighted-pull-up']: 15` in Firestore — the raw belt weight, with no `totalSystemWeightKg` field present anywhere in the corresponding `setsData`. This refines T-23 for the post-audit fix: the allowlist at `WorkoutView.tsx:842` needs to become a `weightMode`-driven check (any plan/exercise combination where `mode === 'weighted-bodyweight'`), not a hardcoded plan-id list that silently excludes every future plan using the mode.

### 3.3 The "approved hinge substitution" preference has no UI anywhere in the app — permanently a no-op · **severity: medium, `plan-local`**

`preprocess()` in `atlas.ts` reads `user.planPreferences?.atlas?.exerciseSelections?.hinge` and, if it's one of `APPROVED_HINGES` (`trap-bar-deadlift`/`conventional-deadlift`/`sumo-deadlift`), substitutes it for every `trap-bar-deadlift` slot. No component anywhere in `src/` writes to `planPreferences.atlas` — a grep for `exerciseSelections` across the whole codebase finds Settings.tsx/Onboarding.tsx pickers for Kali, Gravity Is Optional, Venus Rising, and dedicated-dashboard pickers for Athena and Venus Rising, but nothing for `atlas`. Live-confirmed: onboarding's own "NEXT: EXERCISE SELECTION" button (implying a selection step exists) skips directly to the Starting Numbers screen with no intermediate hinge-choice UI of any kind. The file's own comment — *"the plan defaults to trap bar and never insists"* — frames this as a deliberate default with an opt-out; in the shipped app there is no opt-out, only the default, permanently. Every Atlas athlete trains trap-bar-deadlift for all 10 weeks regardless of preference.

### 3.4 "Optional kettlebell power work" — one of exactly four card features — is entirely dead code · **severity: medium, `plan-local`**

`POWER_POOL` (`kettlebell-swing`, `kettlebell-shoulder-press`, `turkish-get-up`) and `isPowerWork()` are declared and exported from `carries.ts`; `powerWorkEnabled?: boolean` is declared on `AtlasStatus` in `types.ts`. None of the three pool exercises appears anywhere in `ATLAS_GAUNTLET_ONE` or `ATLAS_GAUNTLET_TWO`'s slots, `preprocessDay` never references `POWER_POOL`/`isPowerWork`, and no onboarding or settings control ever sets `powerWorkEnabled`. This is a complete, three-part dead-feature stack (a data pool, a predicate function, and a status flag) supporting a claim printed as one of only four bullet points on the plan's onboarding card in both English and Polish translations (`"Optional kettlebell power work"` / `"Opcjonalna praca dynamiczna z kettlem"`) — a higher-visibility instance of the Wave 3/Wave 5 dead-feature pattern than most, since it's advertised at the top level rather than buried in dashboard-only copy.

### 3.5 Carry exercises label a seconds-interval prescription as "reps" in the athlete-facing UI · **severity: low, `plan-local`**

The `carry()` slot-builder in `atlas.ts` stores the prescribed time interval in the generic `SlotSpec.reps` field (its own comment: *"Carries are prescribed in seconds; `reps` carries the interval"*) because `definePlan()`'s `SlotSpec` has no dedicated duration field. This is a reasonable implementation shortcut, but it leaks into the UI verbatim: live-confirmed prescriptions read *"3 sets × 40-60 reps"* (Farmer Carry) and *"2 sets × 30-40 reps"* (Suitcase Carry) — a 40-60 "rep" carry reads as a typo or an absurd prescription to an athlete unfamiliar with the convention, rather than the 40-60 *second* interval it actually is. The in-exercise coaching note ("Logged as time × load. Tag what ended the set.") partially compensates but never states the unit explicitly.

### 3.6 `programProgress.atlas` never receives its own `startDate` sub-field while it's the active plan — same shape as REDLINE's T-37, with a working fallback confirmed this time · **severity: low, `hypothesis`**

Live-confirmed twice (after 1 and after 2 completed Atlas sessions): `programProgress.atlas` contains only `{completedSessions}`, never `startDate`, unlike every sibling entry in the same document (`kali`, `workhorse`, `iron-clock`, `redline`, `athena`, etc. all carry both fields). Root cause traced via source: `switchProgram()` (`UserContext.tsx:434-456`) only ever writes back the *previous* plan's `programProgress[currentId]` entry on the way out — it never proactively creates one for the plan being switched *into*; `WorkoutView.tsx:727`'s session-complete handler only `increment()`s `completedSessions`, never touches `startDate`. The entry only gets its `startDate` backfilled retroactively, the next time the athlete switches *away* from it (captured from the top-level `user.startDate` at that moment). Unlike T-37's flag (no confirmed consequence one way or the other), this session directly confirmed a working fallback: `WorkoutView.tsx:333` reads `user.programProgress?.[programData.id]?.startDate || user.startDate`, and Atlas's top-level `startDate` correctly reflected the real switch-in time throughout — so the missing sub-field produced no observed wrong date anywhere in the live pass. Recorded as a hypothesis/shared pattern, not a live-consequence bug.

---

## 4. Weekly volume (fractional sets/muscle/week)

### Gauntlet I (weeks 1-5), 53 sets/week across 3 sessions

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Glutes | 16.0 | | Forearms | 9.0 |
| Quads | 13.0 | | Lats | 9.0 |
| Hamstrings | 12.5 | | Traps | 7.0 |
| Front delt | 7.5 | | Upper back | 7.5 |
| Biceps | 5.5 | | Triceps | 6.5 |
| Chest | 6.0 | | Obliques | 6.5 |
| Abs | 5.5 | | Adductors | 3.5 |
| Side delt | 3.5 | | Rear delt | 3.0 |
| Lower back | 3.0 | | Calves | 4.0 |
| Brachialis | 2.0 | | | |

### Gauntlet II (weeks 6-10), 55 sets/week across 3 sessions

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Glutes | 16.0 | | Forearms | 9.0 |
| Quads | 13.0 | | Lats | 9.0 |
| Hamstrings | 12.5 | | Traps | 7.0 |
| Obliques | 9.5 | | Upper back | 7.5 |
| Front delt | 10.0 | | Triceps | 8.5 |
| Side delt | 6.5 | | Abs | 6.0 |
| Chest | 5.0 | | Adductors | 3.5 |
| Biceps | 4.0 | | Lower back | 3.0 |
| Calves | 4.0 | | Rear delt | 1.5 |
| Brachialis | 2.0 | | | |

Computed from `EXERCISE_LIBRARY`'s native primary(1.0)/secondary(0.5) categorization; all 26 distinct exercise ids across both gauntlets resolved cleanly. Against the ≥5-sets/muscle/week reference point (§7 calibration principle — judged case by case, not as a hard floor): both gauntlets clear it comfortably for the lower body (glutes, quads, hamstrings all well above 12) and mid-body pull chain (lats, traps, forearms, upper back all 7-9), consistent with the plan's carry-heavy, hinge-anchored design. Chest and triceps sit in the 5-8.5 range (light-to-moderate, appropriate for a plan that isn't chest-specialized). The gauntlet-to-gauntlet shift matches the file's own stated design intent: front/side delt rises 7.5→10.0/3.5→6.5 (more unilateral overhead pressing), biceps falls 5.5→4.0 (fewer curl-adjacent slots as unilateral rowing/pressing crowds them out), rear delt falls 3.0→1.5 (single-arm hammer row appears once instead of twice weekly). No direct adductor isolation beyond the RDL-family secondary credit, no soleus-specific loader, no upper-trap isolation, no tibialis-anterior exposure — consistent with the map's portfolio-wide zero-coverage findings; Atlas does nothing to close any of those gaps, same as every plan audited so far.

---

## 5. Systemic and joint load (weekly, 3 sessions)

| Metric | Gauntlet I | Gauntlet II |
|---|---|---|
| Systemic | **107** | **103** |
| Axial | **56** | **56** |
| Lower back | **51** | **38** |
| Knee | **20** | **20** |
| Shoulder | **14** | **19** |
| Elbow | **20** | **22** |
| Sets | 53 | 55 |
| Per-set systemic | **2.02** | **1.87** |

Highest per-set systemic cost of any Wave 5 plan audited so far (30-Min Adventure 1.80, REDLINE 1.52, Iron Clock 1.47) — expected given Atlas is the only Wave 5 plan built around heavy barbell/trap-bar compounds (safety-bar squat, trap-bar deadlift, front squat) as the majority of its non-accessory volume, rather than machine/dumbbell/bodyweight-dominant conditioning work. Lower-back load drops meaningfully from Gauntlet I to II (51→38) even though axial load holds flat (56→56) — front squat's more upright torso angle relative to safety-bar squat's slight forward lean accounts for the difference, a genuine (if likely unintentional) lower-back-sparing effect of the gauntlet-two exercise swap. `fatigue: 4` (of presumably a 1-5 portfolio scale) is a reasonable self-rating given these figures sit meaningfully above Wave 5's other three plans on every axis except knee load.

---

## 6. Improvements, ranked

### 1. Fix the `totalSystemWeightKg` producer's hardcoded plan allowlist to be `weightMode`-driven instead of plan-id-driven · `shared-bug`

The highest-leverage fix here, and one that benefits every future plan, not just Atlas. `WorkoutView.tsx:842`'s `programData.id === 'kali' || 'workhorse' || 'gravity-is-optional'` check should instead trigger whenever any exercise in the session has `weightMode === 'weighted-bodyweight'` (or `'bodyweight'`), regardless of plan. This alone doesn't fix T-23's progression-reader half (`genericDoubleProgression` still needs to prefer `totalSystemWeightKg` over raw `weight` when present) but closes the gap that makes Atlas's `weighted-pull-up` slot invisible to the total-system-weight concept even in principle.

### 2. Either wire `carryScore()`/`compareCarries()` into a real display, or drop "scored as time × load" from the card copy · `plan-local`

The underlying data (`atlasStatus.carries`) is already collected correctly — this is a pure display gap, not a data-collection gap, which makes it comparatively cheap to close: a small "Last carry: 24kg × 127s ≈ 50.8 kg·min" line under each carry exercise's history, or a simple better/worse indicator against the previous session's `compareCarries()` result, would make the card's literal claim true. Given the underlying swap mechanic (§1a) is already excellent, this is a case of shipping 90% of a good feature and stopping just short of the part the athlete actually sees.

### 3. Build the missing hinge-selection UI, or remove the unreachable preference entirely · `plan-local`

`planPreferences.atlas.exerciseSelections.hinge` and its `APPROVED_HINGES` list are fully functional on the read side — this needs only a Settings.tsx picker matching the existing Kali/Gravity Is Optional pattern (three radio options: trap bar / conventional / sumo) to become real. Given the plan's own file comment frames this as a real athlete-facing choice ("never insists"), building the picker is likely truer to intent than deleting the feature.

### 4. Wire `POWER_POOL` into an actual optional slot, or remove "Optional kettlebell power work" from the card · `plan-local`

Lowest-effort version: add one optional carry-adjacent slot (kettlebell swing or Turkish get-up) to Day 3 of each gauntlet, gated on `powerWorkEnabled`, with a Settings.tsx toggle to set it — mirroring the "Extra sets" opt-in pattern already used app-wide for accessory volume. Until then, this is the fourth of four card bullets and the only one with zero code path anywhere touching it.

### 5. Label carry prescriptions in seconds, not "reps," in the exercise header and set rows · `plan-local`

A `SlotSpec.durationSeconds` (or even a lightweight `isTimeBased` flag consumed by the same rendering path that already special-cases carry exercises for the limiter buttons) would let the UI print "3 sets × 40-60s" instead of "3 sets × 40-60 reps" without needing a larger schema change — the limiter-button special case at `WorkoutView.tsx:1605` already identifies carry exercises by id pattern, so the same identification could drive the label text.

### 6. Have `resetProgram()` clear `atlasStatus.carries` (and `planPreferences.atlas`) alongside every other plan's status object · `shared-bug`

Same T-2/T-28 family fix already recommended for every prior Wave 4-5 plan with real state in its `xStatus` — Atlas is a higher-priority instance than most because `atlasStatus.carries` is the one piece of Wave-5 `xStatus` state confirmed this session to actually drive live behavior (the carry-swap mechanic), so the current gap is not merely cosmetic.

---

## 7. Verdict

**Atlas earns the most nuanced verdict in Wave 5: it has the wave's single best-engineered piece of cross-session adaptive logic, confirmed working exactly as designed by a live two-session test — and it simultaneously has three of its four advertised card features fail independent verification, ranging from "the underlying data is real but never displayed" (carry scoring) to "genuinely no UI exists" (hinge substitution) to "completely unreferenced anywhere" (kettlebell power work).** This breaks the wave's emerging binary a third time: Iron Clock and REDLINE had their entire headline mechanic be dead code; 30-Min Adventure had its entire mechanic work but two of its marketing claims not hold up; Atlas has its actual headline mechanic (carry-limiter-driven exercise substitution) work convincingly, while separately having other, smaller advertised features be dead. The lesson for the remaining Wave 5 plans (Lazarus, Skeleton, Apex Predator) is the same one 30-Min Adventure already established but Atlas sharpens further: check every individually quotable claim on the card independently, because a plan's central mechanic being real says nothing about whether its other three bullet points are.

On pure training-design merit, independent of the wiring findings: Atlas is well-constructed for its stated goal. Loaded carries as a trained-not-finisher movement, block/gauntlet periodization (5 weeks per movement pattern before a deliberate swap — a legitimate mastery-oriented periodization approach with real support in the strength literature for skill-dependent barbell lifts), a sensible squat/hinge/press/pull structure repeated with enough exercise variation between gauntlets to avoid staleness, and genuinely well-thought-out volume distribution (heavy on the posterior chain and pull musculature, light but present everywhere else) all hold up under the volume-table computation in §4. The `weighted-pull-up` T-23 exposure is a real defect for an athlete progressing that specific lift over 10 weeks (their belt weight will under-track true loading as bodyweight changes), but it's a progression-accuracy bug, not a structural flaw in the plan's design. For an intermediate/advanced athlete who wants a carry-centric full-body strength block and doesn't mind that "the kettlebell option" and "the hinge choice" are currently unreachable, Atlas delivers its actual training stimulus faithfully — it just doesn't deliver everything printed on its own onboarding card.

---

## 8. Export block

```yaml
id: atlas
version: 2
length: { weeks: 10, gauntlets: 2, weeks_per_gauntlet: 5 }
frequency: fixed_3day_mandatory_weekday_selection
weekly_sets: { gauntlet_1: 53, gauntlet_2: 55 }
kind: strength_fullbody_carry_centric_intermediate_advanced
calibration: optional_1rm_seed_squat_standingPress_conventionalDeadlift_first_exposure_only
engine: definePlan_two_dayspec_arrays_preprocessDay_gauntlet_switch_plus_carry_limiter_swap_no_dedicated_dashboard
systemic_load: { gauntlet_1: { systemic: 107, axial: 56, lower_back: 51, knee: 20, shoulder: 14, elbow: 20, sets: 53, per_set: 2.02 }, gauntlet_2: { systemic: 103, axial: 56, lower_back: 38, knee: 20, shoulder: 19, elbow: 22, sets: 55, per_set: 1.87 } }
volume_top_gauntlet_1: { glutes: 16.0, quads: 13.0, hamstrings: 12.5, forearms: 9.0, lats: 9.0 }
volume_top_gauntlet_2: { glutes: 16.0, quads: 13.0, hamstrings: 12.5, frontDelt: 10.0, obliques: 9.5 }
positive_findings:
  - "Headline carry-limiter swap mechanic is fully wired and live-confirmed across a real two-session sequence: tagging Farmer Carry and Suitcase Carry both 'grip' in consecutive sessions caused the next session's carry slot to swap exercises with a visible 'Swapped from last limiter' note — the strongest cross-session adaptive mechanic confirmed working in Wave 5 to date"
  - "atlasStatus.carries is genuinely written every session (unlike ironClockStatus/redlineStatus, both fully dead) and directly consumed by real preprocessDay logic, not merely stored"
  - "No reverse-nordic-curl, no type:'wave' exposure, no classic T-4 duplicated-slot drift, no T-22 exposure; onboarding schedule step and 1RM-seed step both fully functional live"
  - "Well-designed training structure independent of the wiring findings: legitimate block/gauntlet periodization, sensible squat/hinge/press/pull balance, carry work programmed as a trained lift rather than a finisher"
plan_local_bugs:
  - area: "src/features/atlas/carries.ts carryScore()/compareCarries()/limiterAdvice()"
    detail: "All three functions are fully implemented and exported but never called anywhere outside their own file. The card's 'Carries scored as time × load' claim and the portfolio quiz's identical signatureMechanic wording are both false for what the athlete actually sees — a raw weight/duration log, with no kg·min score or plain-English limiter advisory ever displayed, despite the underlying limiter data genuinely driving the (separately real) carry-swap mechanic."
  - area: "src/pages/WorkoutView.tsx:842 totalSystemWeightKg hardcoded plan allowlist + src/features/workout/progression/genericDouble.ts"
    detail: "T-23 reproduces on Atlas via weighted-pull-up (weightMode: weighted-bodyweight), via a new root cause: the totalSystemWeightKg computation itself is gated to programData.id in ('kali','workhorse','gravity-is-optional'), excluding atlas entirely, on top of genericDoubleProgression's existing sets[0].weight-only read. Live-confirmed: logging 15kg on Weighted Pull-ups wrote workingLoads.atlas['weighted-pull-up']: 15 (raw belt weight), no totalSystemWeightKg field anywhere in the session's setsData."
  - area: "src/data/plans/atlas.ts preprocess() hinge substitution + absence anywhere in src/pages/Settings.tsx or Onboarding.tsx"
    detail: "planPreferences.atlas.exerciseSelections.hinge (letting an athlete swap trap-bar-deadlift for conventional/sumo deadlift, per APPROVED_HINGES) has zero UI entry point anywhere in the app. Live-confirmed: onboarding's own 'NEXT: EXERCISE SELECTION' button skips straight to the Starting Numbers step; no exercise-selection screen exists. Permanently a no-op default to trap-bar-deadlift for every athlete."
  - area: "src/features/atlas/carries.ts POWER_POOL/isPowerWork + src/contexts/translations.ts atlas.features"
    detail: "'Optional kettlebell power work' (one of exactly 4 onboarding-card feature bullets, EN and PL) is entirely dead: POWER_POOL's three exercises (kettlebell-swing, kettlebell-shoulder-press, turkish-get-up) never appear in either gauntlet's DaySpec, isPowerWork() and powerWorkEnabled are never referenced by preprocessDay or any UI control."
  - area: "src/pages/WorkoutView.tsx carry-exercise set-row rendering"
    detail: "Carry prescriptions (a seconds interval stored in the generic SlotSpec.reps field per the plan file's own comment) render verbatim as e.g. '3 sets × 40-60 reps' in the live UI, mislabeling a time-based prescription as a rep count. Low severity, cosmetic; the in-exercise coaching note partially compensates but never states the unit."
  - area: "src/contexts/UserContext.tsx switchProgram()/resetProgram() + src/pages/WorkoutView.tsx:727"
    detail: "programProgress.atlas never receives its own startDate sub-field while it's the active plan (live-confirmed after 1 and 2 completed sessions) — switchProgram() only backfills the previous plan's entry on the way out, the session-complete handler only increments completedSessions. Same shape as REDLINE's T-37; this session directly confirmed a working fallback (WorkoutView.tsx:333's user.startDate fallback), so no live-observed wrong date resulted. resetProgram() also never clears atlasStatus or planPreferences.atlas (T-2/T-28 family), with real consequence for atlasStatus.carries given the confirmed-working carry-swap mechanic it feeds."
verification_note: "test_claude logged in successfully on the first attempt this session (no device-lock recurrence). Full live pass: onboarding (mandatory 3-day schedule selection, optional 1RM seeding with profile tap-to-use), a deliberate dashboardViewWeek localStorage poisoning test proving T-9, two complete logged sessions (Atlas I and Atlas II, 17 sets each) via direct-DOM set logging including limiter tags on Farmer Carry and Suitcase Carry (both tagged 'grip'), a third session (Atlas III) confirming the resulting carry-exercise swap live, and direct Firestore cross-checks of atlasStatus, workingLoads.atlas, and programProgress.atlas after each session."
audit: { date: 2026-08-15, findings: 6, verdict: "Atlas's headline carry-limiter swap mechanic is real and the best-wired cross-session adaptive logic found in Wave 5 so far, live-confirmed end-to-end across three sessions. But three of its four card features independently fail verification: the promised time×load carry score is never displayed, the hinge-substitution preference has no UI, and the advertised optional kettlebell power work is entirely unreferenced in code. T-23 reproduces via a new, more specific root cause (a hardcoded 3-plan allowlist in the totalSystemWeightKg producer itself). T-9 reproduces live; no dedicated dashboard." }
```
