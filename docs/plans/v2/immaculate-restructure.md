# Immaculate (Re)Structure

> Unified plan document, v2 format. Supersedes `docs/plans/immaculate-restructure.md`
> if one exists. Third plan of **Wave 6 (Advanced prototypes + roadmap)**.
> Structure and wiring verified via direct source trace of
> `src/data/plans/immaculateRestructure.ts` (135 lines, `definePlan()`-generic
> plus a bespoke `preprocessDay` hook), `src/data/exercises/library.ts` and
> `libraryAdditions.ts` (`strengthRef` entries), `src/pages/Dashboard.tsx`,
> `src/pages/WorkoutView.tsx:842`, `src/contexts/UserContext.tsx`,
> `src/features/dashboard/trackedLift.ts` — plus a computed dump of
> `IMMACULATE_RESTRUCTURE_CONFIG.program.weeks` across all 10 weeks via
> `npx tsx` (scratch file written and deleted per audit protocol), and a live
> `test_claude` pass: logged in (after resolving a new write-path failure
> variant, §1c), switched into Immaculate via Settings → Program Management →
> Switch Program, admin-seeded a lagging `close-grip-bench-press` baseline plus
> a deliberately-lagging `weighted-chin-up` and `single-arm-external-rotation`
> working load, then logged a full 6-exercise, 14-set Upper Structural A
> session end-to-end and inspected the rendered set counts/notes live before
> and after completion.

| | |
|---|---|
| **id** | `immaculate-restructure` |
| **Length** | 10 weeks, 4 days/week (fixed weekday selection at onboarding — live-confirmed as an ordinary `definePlan()` schedule picker) |
| **Frequency** | Upper Structural A (Mon), Lower Structural A (Tue), Upper Structural B (Thu), Lower Structural B (Fri) — every major group trained at least twice weekly |
| **Declared kind** | Poliquin structural-balance hybrid: close-grip bench press is the 100% reference lift, and every other upper-body exercise is programmed at a literature-derived percentage of it (weighted chin-up ~81%, incline bench ~83%, preacher curl ~46%, reverse curl ~30%, external rotation ~9%). A `preprocessDay` hook is meant to detect when an athlete's actual working load on a ratio exercise falls below 90% of its target and add "a small third exposure" (+2 sets) to that lagging structure during the Correction phase |
| **Calibration** | No onboarding stat requirement beyond the plan's own `progression.of` derivation (paused-bench-style single-stat calibration was not required here — `requiredStatsFor()` derives none, since the plan's slots don't reference `progression.of` on a calibration stat; working loads instead accumulate purely from logged sets) |
| **Source** | `src/data/plans/immaculateRestructure.ts` (135 lines) |
| **Stated promise** | Card: *"10 weeks built on Poliquin structural-balance relationships. Find the lagging structure and feed it."* Features: *"Close-grip bench as the reference lift", "Poliquin reference targets, not medical thresholds", "Weak-link work added as a small third exposure"*. File header additionally frames it as "THE WEAKEST LINK" |

---

## 1. Headline finding — the entire weak-link mechanic can only ever fire for one of its six named ratio relationships

This is the worst-scoped instance of the audit's "declared-but-mostly-unreachable feature" pattern found so far — worse than a fully dead feature (Iron Clock, REDLINE, Lazarus, Wave 5), because it *looks* alive: the mechanism runs, the code path executes, and for one specific exercise it genuinely works. That single working case is exactly what would make this bug invisible to a casual QA pass that happens to test that one exercise.

### 1a. `preprocess()`'s day-of-week check targets the wrong two days

```ts
const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const week = Number(day.id?.match(/-w(\d+)-/)?.[1] ?? day.weekNumber ?? 1);
    if (week < 3 || (day.dayOfWeek !== 2 && day.dayOfWeek !== 4)) return day;
    ...
```

The plan's four days are `dayOfWeek: 1` (Upper Structural A, Mon), `2` (Lower Structural A, Tue), `4` (Upper Structural B, Thu), `5` (Lower Structural B, Fri). Every exercise carrying a `strengthRef.ratioOf: 'close-grip-bench-press'` is an **upper-body** exercise — but the guard only lets the weak-link logic run on `dayOfWeek === 2` (Lower Structural A) or `dayOfWeek === 4` (Upper Structural B). Lower Structural A has zero ratio-tracked exercises (front squat, hamstring curl, goblet squat, hip-supported deadlift, calf raise, ab wheel — none reference `close-grip-bench-press`), so the check on that day is a permanent no-op. **Upper Structural A (`dayOfWeek: 1`) — which carries four of the plan's six named ratio relationships (weighted chin-up 81%, incline bench 83%, single-arm external rotation 9%, reverse curl 30%) — is never checked at all**, because `1` isn't `2` or `4`.

Only Upper Structural B (`dayOfWeek: 4`, correctly included) carries any ratio-tracked exercises that are actually reachable: single-arm external rotation (9%, a second weekly instance of the same exercise as Upper A) and `ezbar-preacher-curl` (46%, per the plan's own inline note).

### 1b. `ezbar-preacher-curl` has no library `strengthRef` at all, so even the one checked day's second ratio target can't fire either

`ezbar-preacher-curl`'s library entry (`src/data/exercises/library.ts:635-644`) has no `strengthRef` field whatsoever — unlike `incline-barbell-bench-press`, `weighted-chin-up`, `single-arm-external-rotation`, and `reverse-curl`, all of which do. `preprocess()`'s guard (`if (!ref || ref.ratioOf !== 'close-grip-bench-press') return exercise;`) silently skips any exercise without a `strengthRef`, so preacher curl's own inline note — *"Poliquin target: ~46% of close-grip bench."* — describes a relationship the engine can never evaluate, on either day it's trained.

### 1c. Net effect, live-confirmed

Combining 1a and 1b: of the plan's six named Poliquin ratio relationships (81%/83%/46%/30%/9%×2), **five are structurally unreachable** — four (chin-up, incline bench, reverse curl, one of the two external-rotation instances) because their day is never checked, one (preacher curl) because the library entry itself lacks the data the check needs. Only **one** relationship — single-arm external rotation, Upper Structural B instance — can ever receive the "+2 sets, lagging vs close-grip ratio" bonus the plan's entire concept is built around.

Live-confirmed on Upper Structural A (week 9, Correction-phase logic active per `week >= 3`): with an admin-seeded `close-grip-bench-press` working load of 100kg and a deliberately catastrophic `weighted-chin-up` load of 50kg (expected ≥72.9kg, i.e. 90% of the 81kg target — the actual load undershoots by nearly a third) and `single-arm-external-rotation` at 3kg (expected ≥8.1kg, a 9kg target), neither exercise carried any "+2 sets" bonus or lagging-structure note in the rendered session — Weighted Chin-Up showed exactly 3 sets (the Re-Test phase's base-4-minus-1, unmodified) and Single-Arm External Rotation showed exactly 2 sets (base-3-minus-1, unmodified), matching what an unmodified `phase.transform` alone would produce with zero contribution from `preprocessDay`. This confirms the bug fires exactly as source analysis predicts: Upper Structural A gets no weak-link treatment regardless of how badly any of its four ratio exercises lag.

**A direct computed dump of `IMMACULATE_RESTRUCTURE_CONFIG.program.weeks` across the full 10-week program independently confirms the same conclusion from a different angle**: Assessment-phase (weeks 1-2) and Correction-phase (weeks 3-7) set counts are **byte-identical for every exercise on every day** — the only phase transform that ever changes anything is Re-Test's uniform `sets - 1`. Since the Correction phase's entire distinguishing purpose is supposed to be adding weak-link sets, and the base program data shows zero difference between Assessment and Correction, the only way any Correction-phase set increase could ever appear is through `preprocessDay` at render time — and for 5 of 6 ratio relationships, it never does.

**What this means for the plan's own name and headline claim:** "Find the lagging structure and feed it" and the file's own header framing ("THE WEAKEST LINK... a small third dose of the lagging structure") describe a mechanic that, as shipped, can find and feed exactly one specific exercise out of six named targets — an athlete whose weakest link is their chin-up strength, their incline press, their reverse curl, or (on 5 of 6 chances even for the one exercise type that's checked) sometimes their external rotation, receives no additional work for it, ever, for the entire 10-week program.

---

## 2. Structure

### `definePlan()`-generic base, three phases, one bespoke `preprocessDay` hook

| Phase | Weeks | Base-data transform | `preprocessDay` (external, week≥3 gate) |
|---|---|---|---|
| Assessment | 1-2 | none | inactive (week < 3) |
| Correction | 3-7 | none — identical to Assessment, confirmed via computed dump | active but reaches only 1 of 6 ratio relationships (§1) |
| Re-Test | 8-10 | `sets: Math.max(2, sets - 1)` (uniform, all slots) | active, same 1-of-6 limitation |

Four fixed days, no rotation. `LOWER_A`'s `front-squat` slot has a single `alternates: ['Safety Bar Squat']` (a Swap-sheet offer, not a plan mechanic). No `xStatus` object of any kind exists in the codebase for this plan (no `immaculateRestructureStatus`, no `weakestLinkStatus`).

### Onboarding

Live-confirmed: reaches weekday selection (4/4 required, suggested "Mon·Tue·Thu·Fri" split selectable in one click) directly — no calibration/"Starting Numbers" step, since `requiredStatsFor()` derives no required stat for this plan (its slots don't gate on a `progression.of` calibration reference the way Neural Overload's 1-6 percentages do). Submission (switching into the plan) failed on this session for reasons unrelated to the plan itself (§1c below is a Wave-6 shared-bug reproduction, not a plan defect) and was worked around via an isolating admin write; see §3.3.

### `xStatus`, T-2, T-4, T-9, T-22, T-23, reverse-nordic

- **No `xStatus` object exists — T-2/T-28 structurally does not apply.** Same shape as Monolith/Purgatorio/Neural Overload: `resetProgram()`'s generic `programProgress` clear already covers everything this plan has.
- **No classic T-4 duplicated-definition drift.** `preprocess()` is a single shared function applied uniformly; `single-arm-external-rotation` appears twice (Upper A, Upper B) as the same exercise-id slot, not divergent branches.
- **T-9 reproduces live, first attempt, with zero prior state to justify it.** No dedicated dashboard component or conditional block for Immaculate anywhere in `Dashboard.tsx` (zero matches for "immaculate" there). Confirmed live without even deliberately poisoning `localStorage`: after switching from Neural Overload (last viewed at week 9) into a freshly-seeded Immaculate `programProgress` entry (`completedSessions: 0`, fresh `startDate`), the dashboard immediately showed **"WEEK 9 · Upper Structural A · Re-Test"** — reading `localStorage.getItem('dashboardViewWeek-test_claude')` directly confirmed the stored value was still `"9"`, carried over unmodified from the Neural Overload session with no relationship whatsoever to Immaculate's actual (zero) progress.
- **T-22 reproduces.** `dashboardWidgets` includes `'strength_chart'`, and unlike Neural Overload, `trackedLiftFor()` **does** have a dedicated `case 'immaculate-restructure'` (`trackedLift.ts:36-37`, `{ title: 'Lagging lift', history: asHistory(user.liftHistory?.lagging), startKg: loads['close-grip-bench-press'] }`) — a well-designed, plan-specific case that reads `user.liftHistory?.lagging`. But `liftHistory` has no write path anywhere in the codebase (T-22, first found on Workhorse, confirmed on 5+ plans since) — live-confirmed here too: the "Lagging lift" widget rendered with a start value but zero history points both before and after a fully logged, fully completed session.
- **T-23 reproduces — fifth confirmed instance of the `WorkoutView.tsx:842` allowlist gate.** `weighted-chin-up` is `weightMode: 'weighted-bodyweight'` (`libraryAdditions.ts:41`), but the gate is hardcoded to `programData.id === 'kali' || 'workhorse' || 'gravity-is-optional'`, excluding `immaculate-restructure` (same exclusion as Atlas's T-43 and Neural Overload's T-66). A logged Weighted Chin-Up set falls through to `genericDoubleProgression`, reading external load only — the exact bodyweight-plus-belt total the exercise's own tip text promises ("Total system weight is bodyweight plus the load on the belt") is never computed for this plan.
- **No `reverse-nordic-curl` anywhere in the exercise pool.** Leg work is `front-squat`, `single-leg-hamstring-curl`, `goblet-skater-squat`, `hip-supported-db-deadlift`, `calf-raise`, `heel-elevated-goblet-squat`, `seated-ham-curl`, `split-squat`, `hip-thrust`, `standing-calf-raise` — no knee-flexion/extension misattribution risk.
- **No `type: 'wave'` exposure — T-3 structurally does not apply.** The plan uses ordinary rep-range slots with default `genericDoubleProgression`, no percentage-of-1RM ladders at all.

---

## 3. Findings

### 3.1 The weak-link mechanic reaches only 1 of 6 named ratio relationships (day-of-week bug + missing library data) · **severity: critical, `plan-local`**

Detailed in §1. Two independent, compounding defects: (a) `preprocess()`'s day guard checks `dayOfWeek 2/4` instead of the correct `1/4` (both upper days), silently excluding Upper Structural A's four ratio exercises entirely; (b) `ezbar-preacher-curl`'s library entry has no `strengthRef`, so even the one exercise type on the correctly-checked day (Upper B) that the plan's own note describes as a Poliquin target can never trigger. Net effect, live-confirmed: 5 of the plan's 6 named structural-balance relationships can never receive the "small third exposure" the plan is entirely built around and named after. This is a one-line fix for (a) — change the condition to `day.dayOfWeek !== 1 && day.dayOfWeek !== 4` — and a one-line library addition for (b).

### 3.2 T-9 reproduces with zero justifying prior state — no dedicated dashboard component · **severity: medium, `shared-bug`**

Detailed in §2. Live-confirmed via direct `localStorage` read (not merely inferred from the displayed week) that the stale `dashboardViewWeek-test_claude` key from the immediately-prior Neural Overload session leaked directly into a plan with zero completed sessions and a same-minute `startDate`.

### 3.3 A new write-path failure variant: the client can't self-claim ownership of an already-owner-less document, and every subsequent write in the same session also fails · **severity: critical, `shared-bug`**

This session's `test_claude` login hit a *different* failure shape than the `ownerUid`-pinning lock documented on prior Wave 5/6 sessions: the account's Firestore document had **no `ownerUid` field at all** (confirmed via direct admin read before any intervention) — not a stale value pointing at a different session, simply absent. `checkCodeword()`'s own logic (`UserContext.tsx:255-258`) is supposed to handle exactly this case, self-claiming the doc with `updateDoc(docRef, { ownerUid: auth.currentUser.uid })` on first read of an unowned document. That `updateDoc` call itself failed with `permission-denied`, surfacing as a raw, untranslated `"Missing or insufficient permissions."` string on the entry screen (not the friendlier `entry.keywordClaimed` message, since the failure happens in an un-caught branch of `checkCodeword`) — blocking login entirely, not just a later write.

Isolated per the audit's standard method: an admin-privileged Firestore update setting `ownerUid` to this session's own anonymous auth uid (read directly from the browser's `firebaseLocalStorageDb` IndexedDB store) succeeded instantly and unblocked login. This is a **fourth structurally distinct write call site** failing with the identical error shape this wave (after Apex Predator's T-54 assessment save, Super Mutant's T-57/58 plan-switch-with-status-object, and Neural Overload's T-64 plain onboarding calibration) — strengthening the case that this is a broad, session-scoped condition rather than four coincidentally-identical plan-local bugs.

**The failure did not stop at login.** After the `ownerUid` fix, `switchProgram`'s write (`programId`/`selectedDays`/`programProgress` update) also failed with `permission-denied` (console: `Registration failed`, `programId` unchanged in Firestore) — worked around with a second isolating admin write, identical payload, instant success. Then, after a full 6-exercise, 14-set Upper Structural A session was logged and "Complete Workout" pressed, the console showed **`Firestore updateDoc skipped/failed for test user: permission-denied`** and **`Firestore progression payload write skipped/failed for test user: permission-denied`** — a third failed write in the same session. Cross-checked directly against Firestore: the `workouts/{id}` session log itself **did** save correctly (all 14 sets present, correct weights/reps, `nBfPUY0Rj4Y9MmgVASX9`), matching the exact split-failure shape documented in Super Mutant's session note (session log write succeeds, parallel user-doc write fails) — but `workingLoads.immaculate-restructure` was completely unchanged from its pre-session admin-seeded values, and `completedSessions`/`programProgress.immaculate-restructure.completedSessions` both remained `0`. **Every attempted authenticated write this session failed identically; every admin-privileged write of the same payload succeeded instantly**, which is the audit's own defined bar for "real app bug, not just account state" — this session clears that bar on four separate call sites in a row.

### 3.4 `strength_chart` widget has a well-built dedicated case, but reads the still-unwritten `liftHistory` field · **severity: low, `shared-bug`**

Detailed in §2. Unlike Neural Overload (which has no dedicated `trackedLiftFor()` case at all), Immaculate's case is genuinely plan-specific and well-designed (`title: 'Lagging lift'`, reading `close-grip-bench-press` as the start value) — the only gap is the portfolio-wide T-22 write-path bug, not this plan's own switch-case wiring.

### 3.5 `weighted-chin-up`'s total system weight is silently dropped · **severity: medium, `shared-bug`**

Detailed in §2. Fifth confirmed instance of the `WorkoutView.tsx:842` hardcoded plan-id allowlist (Workhorse, Gravity Is Optional, Kali, Atlas, Neural Overload, now Immaculate) — continues to support the standing recommendation to make the gate `weightMode`-driven instead of plan-id-driven.

---

## 4. Weekly volume (fractional sets/muscle/week)

Computed from `EXERCISE_BY_ID`'s native `primary`/`secondary` muscle-group arrays (primary = full set credit, secondary = half credit), summed across each week's actual generated exercise list from `IMMACULATE_RESTRUCTURE_CONFIG.program.weeks` (base data only — `preprocessDay`'s near-total non-firing per §1 means the live numbers below are, in practice, what nearly every athlete actually trains, week after week, regardless of phase). Every exercise checked against the attribution map's known bug list (§25) — none apply (no `reverse-nordic-curl`, no `around-the-worlds`, no `y-raise`, no `wall-slide`, no `loaded-ankle-rock`).

| Muscle | Week 2 (Assessment) | Week 5 (Correction) | Week 9 (Re-Test) |
|---|---|---|---|
| Glutes | 20 | 20 | 14 |
| Hamstrings | 17.5 | 17.5 | 12 |
| Quads | 14 | 14 | 10 |
| Triceps | 11 | 11 | 8.5 |
| Chest | 10 | 10 | 7 |
| Front delt | 10.5 | 10.5 | 7.5 |
| Biceps | 10.5 | 10.5 | 7.5 |
| Calves | 9 | 9 | 6 |
| Rear delt | 9 | 9 | 7.5 |
| Rotator cuff | 8 | 8 | 6 |
| Lats | 8 | 8 | 6 |
| Upper back | 8 | 8 | 6.5 |
| Abs | 7.5 | 7.5 | 5 |
| Brachialis | 6.5 | 6.5 | 4.5 |
| Adductors | 4 | 4 | 3 |
| Forearms | 3 | 3 | 2 |
| Obliques | 3 | 3 | 2 |
| Side delt | 2 | 2 | 1.5 |
| Lower back | 1.5 | 1.5 | 1 |

**Week 2 and Week 5 are identical for every single muscle group — direct numeric confirmation of §1's core finding.** The plan's entire premise is that the Correction phase adds targeted volume to whatever's lagging; the volume table shows zero difference exists between "before Correction" and "during Correction" for any muscle, because the one mechanism meant to create that difference reaches only one specific exercise for one specific athlete profile. Re-Test's uniform ~25-30% cut is the only volume change the plan ever actually delivers. Posterior chain (glutes, hamstrings, quads) leads clearly, driven by the two Lower days' heavier compound-first structure — consistent with the card's "every group at least 2x" framing rather than an upper-body-only structural-balance plan. No muscle from the attribution map's zero-coverage list gets a dedicated loader here either (soleus/tibialis anterior/direct adductors/direct erectors/upper-lower traps/serratus/isolated upper pec all absent or secondary-only, as on every other plan audited).

---

## 5. Systemic / joint load

Computed from each exercise's `intelligence` block × sets, summed per week (base data, same caveat as §4 about `preprocessDay`'s near-total inactivity):

| Metric | Week 2 (Assessment) | Week 5 (Correction) | Week 9 (Re-Test) |
|---|---|---|---|
| Systemic cost | 127 | 127 | 91 |
| Axial cost | 31 | 31 | 23 |
| Lower-back cost | 23 | 23 | 16 |
| Knee cost | 34 | 34 | 24 |
| Elbow cost | 34 | 34 | 25 |
| Shoulder cost | 22 | 22 | 17 |

Same pattern as §4: Assessment and Correction are numerically identical on every axis, and the Re-Test phase's uniform set trim (~25-29% across every metric) is the plan's only real lever. Systemic cost (127) sits in the mid-to-upper range of plans audited so far, consistent with four fixed compound-first days and no deload week built into the 10-week arc outside the final Re-Test taper.

---

## 6. Ranked improvements

1. **`plan-local` — Fix `preprocess()`'s day guard to check `dayOfWeek === 1 || dayOfWeek === 4` (both upper days) instead of `2 || 4`.** This is the single highest-leverage fix available anywhere in this plan: a one-line condition change would restore weak-link detection to Upper Structural A's four ratio exercises (chin-up 81%, incline bench 83%, reverse curl 30%, external rotation 9%) — the majority of the plan's entire named mechanic — with no other code changes needed.

2. **`plan-local` — Add a `strengthRef: { ratioOf: 'close-grip-bench-press', poliquinPercent: 46 }` entry to `ezbar-preacher-curl`'s library definition.** Without it, even after fixing #1, the preacher-curl relationship the plan's own inline note explicitly describes remains permanently unreachable — the only one of the six named ratios that needs a library change rather than a plan-file change.

3. **`shared-bug` — Investigate the `test_claude` write-path failure as an account/session-state issue affecting essentially every write, not per-call-site.** Fourth structurally distinct write call site this wave (login self-claim, plan-switch, workout-completion, in addition to prior waves' assessment-save and plan-switch-with-status-object instances) failing identically while admin-privileged writes of the same payload succeed instantly every time. This blocks onboarding, plan-switching, *and* progression tracking simultaneously on this account — the single highest-priority item for the owner to investigate server-side (Firestore audit logs for the exact denied request), since client-side rules tracing has now failed to pin the cause on five occasions across three plans.

4. **`shared-bug` — Make `WorkoutView.tsx:842`'s `totalSystemWeightKg` gate `weightMode`-driven instead of plan-id-hardcoded.** Sixth plan this wave-and-a-half excluded from its own weighted-bodyweight exercise's total-load credit (Workhorse, Gravity Is Optional, Kali, Atlas, Neural Overload, now Immaculate) — the fix is identical every time and the list of affected plans keeps growing.

5. **`shared-bug` — Fix `liftHistory`'s write gap (T-22).** Immaculate's `trackedLiftFor()` case is unusually well-built (a genuinely plan-specific "Lagging lift" title reading the correct calibration lift) — it is wasted entirely on a field nothing ever writes.

6. **`hypothesis` — Consider surfacing the weak-link mechanism's activity (or inactivity) directly on the dashboard.** Even after #1/#2 ship, the mechanism is inherently invisible to an athlete unless they cross-reference their own working loads against the plan's stated percentages by hand — a small "structural balance" panel showing each ratio exercise's current percent-of-target, similar in spirit to Overhead Dominion's dead per-delt tracking or Quadfather's dead ROM confirmation but actually wired this time, would make the plan's headline concept legible rather than assumed to be silently working in the background.

7. **`hypothesis` — Give the Correction phase a base-data difference independent of `preprocessDay`, as a fallback.** Because the entire volume differentiation between Assessment and Correction currently depends on one narrow runtime condition (§1), a plan-file-level fallback — e.g., Correction phase's base `sets` are one higher than Assessment's on the ratio-tracked slots specifically, before any lagging-structure logic even runs — would mean the phase still delivers *something* distinguishable even if the dynamic mechanism has further edge cases the audit didn't surface (e.g., an athlete who has genuinely balanced ratios and is never meant to get bonus sets, versus one whose `workingLoads` entry for a ratio exercise simply doesn't exist yet).

---

## 7. Verdict

**As a training-design concept, Poliquin structural-balance programming is well-cited and genuinely differentiated from every other plan in the portfolio** — no other plan expresses its own accessory-work targets as literature-derived ratios of a single reference lift, and the four-day, every-group-twice-weekly base template (independent of the weak-link mechanism entirely) is a sound, moderate-volume hypertrophy/strength hybrid on its own numeric terms (§4-5). **But the plan's entire reason for existing — finding the lagging structure and feeding it — is, as shipped, capable of finding and feeding exactly one of its six named relationships**, because of a day-of-week condition that checks the wrong two days and a missing library field that would have left even the one correctly-checked day's second target unreachable regardless. An athlete training this plan for the full 10 weeks with a genuinely lagging chin-up, incline press, reverse curl, or preacher curl — four of the five most commonly underdeveloped structures in exactly the population this plan targets — receives zero additional exposure for it, silently, the entire time, while the card and file-level documentation describe a plan that is actively watching and correcting for exactly that. Layered on top of a session that also could not reliably log in, switch into the plan, or save a completed workout without direct admin intervention at every step (§3.3), Immaculate's honest current state is: **a genuinely interesting, well-researched design whose one differentiating mechanism does not work for 5 of its 6 stated cases, sitting inside an account/write-path failure that currently makes even verifying that fact require a Firestore console rather than the app itself.**

---

```yaml
plan: immaculate-restructure
wave: 6
audit_status: complete
headline_finding: >
  The weak-link/structural-balance mechanism (the plan's entire named concept)
  can only ever fire for 1 of its 6 named Poliquin ratio relationships.
  preprocess()'s day guard checks dayOfWeek 2/4 instead of the correct 1/4
  (both upper days), so Upper Structural A's four ratio exercises (chin-up,
  incline bench, reverse curl, external rotation) are never checked at all.
  Separately, ezbar-preacher-curl has no strengthRef in the library, so even
  the one correctly-checked day's second ratio target (46%) can never fire
  either. Live-confirmed: a catastrophically lagging chin-up (50kg vs 72.9kg
  threshold) and external rotation (3kg vs 8.1kg threshold) received zero
  bonus sets on Upper Structural A. A computed dump of all 10 weeks
  independently confirms Assessment and Correction phases are byte-identical
  in base set counts for every exercise, on every day.
findings:
  - id: T-67
    severity: critical
    tag: plan-local
    summary: preprocess()'s day-of-week guard checks dayOfWeek 2/4 instead of 1/4, excluding Upper Structural A's four ratio-tracked exercises from the weak-link bonus entirely.
  - id: T-68
    severity: high
    tag: plan-local
    summary: ezbar-preacher-curl has no strengthRef entry in the library despite the plan's own inline note citing a 46% Poliquin target, making that relationship unreachable even on the one correctly-checked day.
  - id: T-69
    severity: medium
    tag: shared-bug
    summary: T-9 reproduces with zero justifying prior state — stale dashboardViewWeek localStorage key from the prior plan session showed Week 9 for a freshly-switched-into plan with zero completed sessions.
  - id: T-70
    severity: critical
    tag: shared-bug
    summary: New write-path failure variant — client-side self-claim of an ownerUid-less user doc on login fails permission-denied; switchProgram and workout-completion writes also fail in the same session. Admin writes of identical payloads succeed instantly on all three. Fourth-through-sixth structurally distinct write call sites this wave with the identical failure shape.
  - id: T-71
    severity: low
    tag: shared-bug
    summary: trackedLiftFor() has a well-built immaculate-restructure case ("Lagging lift", reads liftHistory.lagging) but liftHistory is never written anywhere (T-22 family).
  - id: T-72
    severity: medium
    tag: shared-bug
    summary: weighted-chin-up total system weight dropped — WorkoutView.tsx:842 allowlist gate excludes immaculate-restructure, sixth instance after Workhorse/Gravity Is Optional/Kali/Atlas/Neural Overload.
t3_status: does not apply — no type:'wave' or percentage-ladder progression used
t9_status: reproduces (live-confirmed, zero prior-state justification) — no dedicated dashboard component
t22_status: reproduces (dedicated trackedLiftFor case exists and is well-designed, but liftHistory.lagging never written)
t23_status: reproduces (weighted-chin-up excluded from WorkoutView.tsx:842 allowlist, 6th instance)
reverse_nordic_curl: absent
wave_progression: not used
weekly_volume_assessment_week2_top5:
  glutes: 20
  hamstrings: 17.5
  quads: 14
  triceps: 11
  biceps: 10.5
weekly_volume_correction_week5_top5:
  glutes: 20
  hamstrings: 17.5
  quads: 14
  triceps: 11
  biceps: 10.5
weekly_volume_retest_week9_top5:
  glutes: 14
  hamstrings: 12
  quads: 10
  triceps: 8.5
  frontDelt: 7.5
live_test_login: failed initially (permission-denied on ownerUid self-claim), succeeded after admin-privileged write of the identical payload
live_test_switch_program_write: failed (permission-denied), admin-seed used to unblock
live_test_workout_completion_write: partially failed — workouts/{id} session log saved correctly (14/14 sets), but the parallel user-doc write (workingLoads, completedSessions, progression payload) failed permission-denied
live_test_weak_link_check: confirmed via both live UI (Upper Structural A rendered no bonus sets for a catastrophically lagging chin-up and external rotation) and a full 10-week computed dump (Assessment and Correction phases byte-identical in base set counts)
```
