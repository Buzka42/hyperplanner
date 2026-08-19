# House of Iron

> Unified plan document, v2 format. Supersedes `docs/plans/house-of-iron.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> computed programmatically from each movement's `intelligence` block via a
> throwaway `tsx` script (deleted after use). Wiring verified via direct
> source trace of `src/data/plans/houseOfIron.ts`,
> `src/features/houseOfIron/{prescription,recommendation,HouseDashboard}.tsx`,
> `src/features/workout/progression/houseOfIron.ts`, `src/pages/Dashboard.tsx`,
> and `src/contexts/UserContext.tsx` — **and this session's `test_claude`
> login succeeded on the first attempt** (the device-lock error that blocked
> Venus Rising's and Kali's sessions was not present this time). A full live
> pass was run: switched into House of Iron from Athena, completed the
> mandatory equipment-onboarding step, and logged an entire Push A session
> (13 sets, all at top-of-range reps) end to end, then cross-checked the
> resulting `houseOfIronStatus` write directly in Firestore. Findings below
> are live-confirmed unless explicitly marked source-trace-only.

| | |
|---|---|
| **id** | `house-of-iron` |
| **Length** | 8 weeks, repeatable (Foundation 1-2, Build 3-4, Harden 5-6, House on Fire 7, Rebuild 8) |
| **Frequency** | 4 sessions, free-order (`session.kind: 'session-select'`) — no session is pinned to a specific day |
| **Weekly sets** | 53 (13 + 13 + 13 + 14) in Foundation/Build/Harden/House on Fire; 35 in Rebuild (week 8) |
| **Declared kind** | general / minimal-equipment hypertrophy, repeatable |
| **Calibration** | none — mandatory "Build your house" equipment inventory (≥1 dumbbell or kettlebell) instead |
| **Source** | `src/data/plans/houseOfIron.ts` (73 lines) + `src/features/houseOfIron/{prescription,recommendation,HouseDashboard}.tsx` + `src/features/workout/progression/houseOfIron.ts` (dedicated dashboard, dedicated progression handler) |
| **Stated promise** | *"An 8-week repeatable minimal-equipment plan that makes one dumbbell or kettlebell last."* Features: 2–4 free-order sessions weekly, fixed-load mastery ladders, push/pull and knee/hinge balance, works with one implement. |

---

## 1. Headline finding

**A real, carefully-built "fixed-load mastery ladder" progression system — the plan's entire signature mechanic — silently drops two of its twenty exercises from tracking forever, because the parser that reads a set's target rep count cannot parse the literal string `"AMRAP"`. Confirmed live: a fully logged Push-Up set (2×25 reps, well past any plausible ceiling) produced zero `houseOfIronStatus.progression` entry, while every other exercise logged in the same session got one after a single clean top-range set.**

### 1a. The `topReps("AMRAP")` gap, confirmed live

`src/features/workout/progression/houseOfIron.ts:23-26`:

```ts
const topReps = (reps: string): number | null => {
    const matches = reps.match(/\d+/g);
    return matches?.length ? Number(matches.at(-1)) : null;
};
```

Every slot in the plan targets a numeric range (`'8-15'`, `'10-20'`, `'30-60'`) **except** `push-up` (Push A, `reps: 'AMRAP'`) and `close-grip-push-up` (Push B, `reps: 'AMRAP'`). `"AMRAP".match(/\d+/g)` returns `null`, so `topReps()` returns `null`, and `houseOfIronProgression`'s per-exercise loop
(`src/features/workout/progression/houseOfIron.ts:38-39`) hits `if (!canonicalId || upper == null || pendingProgressions[canonicalId]) continue;` before ever computing `cleanTop` or touching `progression[canonicalId]`. **The exercise is invisible to the progression system, permanently — not "slow to progress," structurally unreachable.**

Confirmed live this session: logged a full Push A workout (goblet-heel-elevated-squat, single-arm-floor-press, bulgarian-split-squat, push-up, single-arm-overhead-triceps-extension, suitcase-hold — 13 sets total) with every numeric-range exercise at the top of its rep window. The resulting `houseOfIronStatus.progression` map in Firestore contains exactly five keys — `goblet-heel-elevated-squat`, `bulgarian-split-squat`, `single-arm-floor-press`, `single-arm-overhead-triceps-extension`, `suitcase-hold` — each with `cleanTopRangeExposures: 1` after one session. **`push-up` has no entry at all**, despite being logged at 25 reps (0kg × 25 × 2 sets), an unambiguous "clean top" performance by any reasonable reading of "stop with 1–2 reps in reserve."

This matters more here than a typical dead-status finding because `push-up` has one of the plan's most fully-authored ladders — `HOUSE_LADDERS['push-up']` (`src/features/workout/progression/houseOfIron.ts:8`) is `['reps', 'deficit', 'pause-1s', 'eccentric-3s', 'feet-elevated', 'density', 'heavier-equipment']`, a genuinely well-designed bodyweight-difficulty progression (deficit push-ups, then tempo, then feet-elevated, then density, before finally suggesting a weighted vest). All of it is dead code for this exercise. `close-grip-push-up` has no dedicated ladder entry either (falls to the generic default, which is equally unreachable), so both of the plan's two AMRAP slots are permanently frozen at week-1 difficulty regardless of how many reps the athlete produces.

### 1b. Everything else about the ladder system is genuinely well-built

This is not a "dead feature" plan in the Wave 3 sense — it's the opposite failure mode: the mechanism is real, wired, and correctly gated (requires two consecutive clean-top sessions before offering a progression, and the athlete must actively **Accept** or **Keep current** on the dashboard before `stageIndex` advances — declining doesn't silently reset earned progress, `resolveProgression(id, false)` in `HouseDashboard.tsx:73-97` clears the pending offer but leaves `cleanTopRangeExposures` at the value already zeroed when the offer was generated). The five exercises confirmed live above will each need one more clean top-range session to generate their first upgrade offer — the mechanism is working as designed for every exercise it can actually see. The one gap is narrow, specific, and provable by a single regex.

### 1c. `exerciseImplementIds` is written but never read anywhere

`houseOfIronProgression` (`src/features/workout/progression/houseOfIron.ts:43-48`) carefully matches each logged set's weight against the athlete's declared equipment inventory (preferring `preferredImplement`) and writes the resolved implement id into `houseOfIronStatus.exerciseImplementIds`. Confirmed live — after logging, Firestore shows `exerciseImplementIds: { "bulgarian-split-squat": "dumbbell-20-1-0", "goblet-heel-elevated-squat": "dumbbell-20-1-0", "single-arm-floor-press": "dumbbell-20-1-0" }`. A portfolio-wide grep confirms this field has **no reader anywhere** in `src/` — not in `WorkoutView.tsx` (no prefill/suggestion), not in `HouseDashboard.tsx`, not even elsewhere in its own writer file. A different subvariant of the Wave 3 dead-feature pattern: not "declared but unwritten" (T-10/T-18/T-20's shape), but *written correctly, every session, and never consumed*. Low severity — nothing depends on it working — but real engineering effort with zero payoff.

---

## 2. Structure

### Weekly template (Foundation/Build/Harden/House on Fire phases, weeks 1-7, 53 sets)

| Day | Sets | Key work |
|---|---|---|
| Push A — Chest + Quads | 13 (12 + 1 optional) | Goblet Heel-Elevated Squat 3, Single-Arm Floor Press 3, Bulgarian Split Squat 2, Push-Up 2 (AMRAP), Single-Arm Overhead Triceps Extension 2, Suitcase Hold 1 (optional) |
| Pull A — Back + Hamstrings | 13 (12 + 1 optional) | Single-Arm Dumbbell Row 3, Romanian Deadlift 3, Dumbbell Pullover 2, Single-Leg RDL 2, Hammer Curl 2, Suitcase Carry 1 (optional) |
| Push B — Shoulders + Quads/Glutes | 13 | Single-Arm Standing Press 3, Goblet Skater Squat 3, Single-Arm Floor Press 2, Supported Sissy Squat 2, Lateral Raise 2, Close-Grip Push-Up 1 (AMRAP) |
| Pull B — Back + Glutes/Hamstrings | 14 | Staggered-Stance RDL 3, Single-Arm Dumbbell Row 3, Glute Bridge 3, Dumbbell Pullover 2, Bent-Over Rear-Delt Row 2, Hammer Curl 1 |

### Phases

| Phase | Weeks | Change |
|---|---|---|
| Foundation | 1-2 | Base |
| Build | 3-4 | Base (identical to Foundation in the source — same naming-only pattern as Kali's Severance/Preservation) |
| Harden | 5-6 | Base (identical again) |
| House on Fire | 7 | Base (identical again) |
| Rebuild | 8 | `transform` halves most set counts (sets ≥3 → 2; two named 2-set exercises → 2 as well; everything else → 1). Weekly total drops 53 → 35. |

Four of the plan's five named phases (Foundation, Build, Harden, House on Fire) are behaviorally identical in the source — only the final "Rebuild" week actually changes anything programmatically. Same cosmetic-phase-naming pattern already logged on Kali (Severance/Preservation) as a low-severity, portfolio-recurring finding — worth folding into a single cross-plan note rather than re-flagging as a new bug each time.

### `xStatus`, T-2, T-3, T-4, T-14, T-22, T-23, reverse-nordic

- **`houseOfIronStatus`** (`equipment`, `preferredImplement`, `exerciseImplementIds`, `progression`, `pendingProgressions`, `sessionHistory`) is genuinely written by the progression handler and the dashboard's equipment/save/accept actions — confirmed live this session (§1a). **Missing from `resetProgram()`'s allowlist** (`UserContext.tsx:467-470` covers only `benchDominationStatus`/`pencilneckStatus`/`skeletonStatus`) — same T-2 gap as Athena (T-26) and Kali (T-24-adjacent), with real consequence: `progression` and `pendingProgressions` drive which exercise variation the athlete is actually prescribed (`applyHouseProgressions` in `prescription.ts` substitutes the exercise itself, not just a displayed number), so "Reset Current Progress" — whose own copy promises a return to Week 1 Day 1 — silently leaves the athlete on whatever harder variation they'd already earned. Worse than a stale-number bug: a "reset" that doesn't reset earned exercise substitutions is arguably the opposite of what the button claims to do.
- **No `planPreferences` for `house-of-iron`** — the plan doesn't use `planPreferences` at all (no exercise-selection or mode toggle stored there), so T-28 doesn't apply here; noted as a clean absence, not a finding.
- **No `type: 'wave'`, no `technique` field anywhere in the plan file** — zero exposure to T-3/T-14.
- **No classic T-4 pattern.** `single-arm-floor-press`, `single-arm-dumbbell-row`, `dumbbell-pullover`, and `hammer-curl` each appear on two different days at different set counts, but every occurrence is an independently-defined slot in the single `days` array — no duplicated-definition drift risk, same clean pattern seen on every generic-`definePlan()` plan since Wave 2.
- **No `reverse-nordic-curl`** anywhere in the exercise pool — clean, consistent with every plan since Quadfather.
- **T-22 does not apply.** `ui.dashboardWidgets: ['program_status', 'workout_history']` never requests `strength_chart`, and `HouseDashboard` doesn't call `trackedLiftFor()`. A fourth Wave-4 plan (after Athena, Venus Rising, Kali) where the dedicated dashboard makes the broken generic widget moot.
- **T-23 does not apply — genuinely, not just untriggered.** House of Iron uses no `weighted-bodyweight`-mode exercises anywhere in its pool (verified against the library: none of its 20 movements carry `weightMode: 'weighted-bodyweight'`). More fundamentally, the plan doesn't progress via working-weight-in-kg at all outside of the athlete's fixed equipment inventory — the entire mechanic is the ladder-of-variations system in §1, not a load increment. This is the first Wave-4 plan structurally immune to T-23 rather than merely lacking the triggering exercise choice this session.

### T-9 immunity — fourth Wave-4 plan in a row, confirmed live

`Dashboard.tsx:205` early-returns `<HouseDashboard user={user}/>` **before** line 211's `weekData = currentProgram.weeks.find(...)` — the exact same guard-clause position as `AthenaDashboard` (T-25), `VenusDashboard`, and `KaliDashboard`. `HouseDashboard.tsx:21-23` computes its own week via `clampProgramWeek({ startDate: ..., completedSessions: ..., sessionsPerWeek: 4, maxWeeks: 8 })`, never touching `dashboardViewWeek-${user.id}`. Confirmed live this session by direct observation, not just source trace: switching from Athena (a plan with its own, unrelated dashboard) into House of Iron rendered `HouseDashboard` correctly at Week 1 with no stale week bleed-through. **This is 4/4 Wave-4 plans with a dedicated dashboard, and 4/4 confirmed T-9-immune** — the hypothesis first raised on Athena now has a clean sweep across the entire wave.

### `clampProgramWeek`'s session-count basis handles the "2-4 free-order sessions" claim correctly

Unlike a calendar-driven week clock (`calendarPlanWeek`, used when `completedSessions` isn't tracked), House of Iron's week advances as `floor(completedSessions / 4) + 1` — genuinely proportional to actual training frequency, not elapsed calendar time. An athlete training 2 sessions/week (a stated valid frequency per the portfolio's own `frequency: [2, 3, 4]` entry) advances through the 8-week arc at half pace instead of falling behind a calendar clock that assumes 4/week — this is the correct implementation for a plan that explicitly claims to support variable frequency, and a positive contrast with plans elsewhere in the audit whose week math silently assumes full adherence.

### Free-order session selection — confirmed real, not decorative

`recommendHouseSession` (`src/features/houseOfIron/recommendation.ts`) scores all four sessions by push/pull and knee/hip imbalance plus a 48-hour recency penalty, and the dashboard's "Choose a session" list (confirmed live) lets the athlete start **any** of the four regardless of calendar day — `HOUSE_SESSION_DAY` only supplies a route parameter (`/app/workout/${week}/${day}`), not a lock. The plan's own `days` array still declares `dayOfWeek: 1-4` internally, but nothing in `HouseDashboard` or the routing constrains session choice to those values — confirming "free-order" is real, live-tested by starting Push A (not the tie-broken "recommended" Pull A) without friction.

---

## 3. Findings

### 3.1 `push-up` and `close-grip-push-up` are structurally invisible to the progression system · **severity: high, `plan-local`**

Detailed in §1a-1b. Live-confirmed via a full logged session. A precise, single-cause bug (`topReps()`'s regex can't parse `"AMRAP"`) with a well-designed, fully dead consequence (`HOUSE_LADDERS['push-up']`'s 7-stage ladder never fires). Both affected exercises are AMRAP-target bodyweight presses — the plan's only two non-numeric-range slots, so the fix is narrow: give `topReps()` (or `houseOfIronProgression`'s caller) an AMRAP-aware branch that reads the actual logged rep count as its own "top," rather than trying to parse a ceiling out of the target string.

### 3.2 `exerciseImplementIds` computed correctly, consumed nowhere · **severity: low, `plan-local`**

Detailed in §1c. A real write with no reader anywhere in the codebase — likely intended to eventually drive an auto-selected implement suggestion in the workout UI that was never built, or was built and later removed without removing the write side.

### 3.3 `houseOfIronStatus` missing from `resetProgram()`'s allowlist, with real consequence · **severity: medium, `shared-bug`**

Detailed in §2. Same T-2 family gap already logged on Athena (T-26) and Kali — but here the stale-after-reset state is an earned exercise *substitution*, not just a displayed number, making the mismatch between the button's copy ("Reset your sessions to Week 1 Day 1") and its actual effect more visible than on plans where the leftover status field is inert.

### 3.4 Fourth consecutive T-9-immune, dedicated-dashboard Wave-4 plan · **severity: none (positive finding)**

Detailed in §2. Closes out Wave 4 at a clean 4/4 for the dedicated-dashboard-implies-T-9-immunity hypothesis first raised on Athena.

### 3.5 Structurally immune to T-23, not merely untriggered · **severity: none (positive finding)**

Detailed in §2. The plan's own progression mechanic never touches working-weight-in-kg outside a fixed equipment inventory, so the `genericDoubleProgression`/`totalSystemWeightKg` gate that hit Workhorse, Gravity Is Optional, and Kali simply doesn't apply here — a genuine architectural difference, not luck of exercise selection.

### 3.6 Cosmetic four-of-five-phases-identical pattern · **severity: low, `plan-local`**

Detailed in §2. Same shape as Kali's Severance/Preservation finding — worth eventually treating as one cross-plan note ("named phases with no `transform` carry zero behavioral information") rather than re-logging per plan.

### 3.7 Free-order sessions, variable-frequency week math, and equipment-driven onboarding all confirmed genuinely wired · **severity: none (positive finding)**

Detailed in §2. Three specific, checkable claims — "2-4 free-order sessions," implicit variable-pace progression, and "works with one implement" (the onboarding gate accepts exactly one item) — all survive live verification without qualification. The cleanest set of confirmed claims of any Wave-4 plan; House of Iron's actual defects are narrow and structural (§3.1, §3.3), not decorative feature-list padding.

### 3.8 UI/UX

Fully live-tested this session — no device lock (see header). Switch-into flow: Settings → Switch Program → House of Iron card → a mandatory "Training Schedule" step (fixed weekdays or rotation, confirmed distinct UI from the free-order dashboard claim, see note below) → "NEXT: EXERCISE SELECTION," which actually routes to the equipment-inventory ("Build your house") screen rather than an exercise picker — a minor copy mismatch between the switch-flow's step label and what it actually shows, not a functional bug. Equipment save, session selection, live set logging (13/13 sets across 6 exercises), and workout completion all worked without error. One incidental, expected re-confirmation: navigating via a hard `navigate()` call to the root URL (done deliberately, post-session, to check whether Reset Current Progress needed live re-verification) immediately dropped the authenticated session back to the codeword-entry screen — the already-logged T-7 finding, reproduced again, not a new one.

**Minor note on the "Training Schedule" step:** the switch-in flow asks the athlete to commit to fixed weekdays or a rotation pattern *before* ever reaching the dashboard that recommends and lets you freely pick any of the four sessions — a real, if small, tension between the onboarding copy ("Pick fixed weekdays or an irregular rotation") and the card's "free-order" claim. In practice the fixed-weekday choice appears cosmetic once inside `HouseDashboard` (nothing observed in the dashboard read the selected days to gate session choice), but this wasn't exhaustively traced through every code path this session — flagged as a hypothesis, not a confirmed finding.

---

## 4. Weekly volume (53 sets/week, Foundation/Build/Harden/House on Fire phase)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Glute max (lower) | 14.5 | | Lats (lower) | 10.75 |
| Abdominal wall | 10.5 | | Quads (3 heads, each) | 10.0 |
| Biceps femoris | 9.5 | | Pec (lower) | 9.5 |
| Obliques | 9.0 | | SemiMemb/Tend | 8.0 |
| Front delt | 7.5 | | Teres major | 7.0 |
| Triceps (lateral) | 7.0 | | Triceps (medial) | 7.0 |
| Triceps (long) | 7.0 | | Glute medius | 6.0 |
| Trap mid | 5.75 | | Rhomboids | 5.0 |
| Forearm flexors | 5.0 | | Side delt | 3.5 |

All 20 distinct exercises resolved to attribution rows — no missing data, no `reverse-nordic-curl` exposure. Rebuild week (week 8) scales every muscle down proportionally with the plan-wide 53→35 set cut; no muscle is selectively dropped.

### The card's "push/pull and knee/hip balance" claim, quantified

| Focus area | Combined dimensions | Weekly sets |
|---|---|---|
| Quads (knee-dominant) | vastus×3 + rectusFemoris | **32.5** |
| Glutes/hamstrings (hip-dominant) | gluteMax(Upper+Lower) + gluteMedius + bicepsFemoris + semiMembTend | **41.5** |
| Push (pec+delt+triceps) | pecLower + pecUpper + frontDelt + sideDelt + tricepsLateral/Medial/Long | **41.0** |
| Pull (lats+teres+rhomboids+trapMid) | latsUpper + latsLower + teresMajor + rhomboids + trapMid | **30.5** |

The four buckets land within a reasonably tight band (30.5–41.5), consistent with the card's stated "balance" mechanic — the widest gap is push (41.0) vs. pull (30.5), a real but modest ~34% skew rather than a severe imbalance. `houseBalance()`'s own live session-count tracker (§2) operates on a coarser binary axis (which *session* was done, not which *muscle* got volume) — the two balance concepts are related but not identical, worth keeping distinct if this plan is ever revisited for a load-bearing balance claim.

---

## 5. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **99** |
| Axial | **26** |
| Lower back | **36** |
| Knee | **22** |
| Shoulder | **18** |
| Elbow | **25** |
| Sets | 53 |
| Per-set systemic | **1.87** |

Higher per-set systemic cost than Kali's 1.31 despite being a nominally "minimal-equipment" plan — driven by the unilateral/anti-rotation demand baked into most of the exercise pool (single-arm floor press, single-arm dumbbell row, single-arm standing press, staggered-stance RDL, single-leg RDL — nearly every slot in the plan is unilateral or split-stance) rather than raw external load. Lower back (36) is the single highest raw category, concentrated in the three RDL-family lifts (romanian-deadlift, staggered-stance-rdl, single-leg-rdl each carry `lowerBackCost: 3`) that anchor both pull days — consistent with a hinge-heavy accessory structure rather than a specific technique flaw.

---

## 6. Improvements, ranked

### 1. Give `topReps()` (or its caller) an AMRAP-aware branch · `plan-local`

The single highest-value fix in this doc. `push-up` and `close-grip-push-up` each have real, well-designed progression ladders that can never fire under the current implementation. The fix is narrow and local to `houseOfIronProgression`: when the target reps string has no parseable digit ceiling (i.e. contains `AMRAP`), compare the athlete's actual logged rep count against a stored or configurable per-exercise AMRAP floor instead of the current numeric-range comparison — the rest of the state machine (`cleanTopRangeExposures`, `pendingProgressions`, accept/decline) needs no change.

### 2. Add `houseOfIronStatus` to `resetProgram()`'s reach · `shared-bug`

Bundle with the other Wave-4 T-2 findings (Athena's `athenaStatus`, Kali's `kaliStatus`) already logged for the post-audit pass — House of Iron's version has the added wrinkle that the stale state is a substituted *exercise*, not just a number, so the reset-button-copy mismatch is more visible here than on most other affected plans.

### 3. Either wire `exerciseImplementIds` to something, or stop writing it · `plan-local` (`hypothesis`)

A plausible, low-cost win: use it to prefill the LOAD field with the matched implement's `weightKg` when an athlete reaches a tracked exercise, closing the loop between "tell us your equipment" and the actual logging screen, which currently doesn't reference the inventory at all once past onboarding.

### 4. Reconcile the "Training Schedule" step with the free-order dashboard · `hypothesis`

Detailed in §3.8. Not confirmed as a functional bug this session, but worth a fast trace: if the fixed-weekday selection genuinely has zero downstream effect once inside `HouseDashboard`, either remove the step for this plan (it doesn't need day pinning, given `recommendHouseSession` already handles ordering) or make it optional/skippable, since asking for a commitment the app doesn't enforce sets a false expectation at the exact moment an athlete is forming their first impression of the plan.

### 5. Collapse or differentiate the four identical-in-source phases · `plan-local` (`hypothesis`)

Same recommendation already made for Kali's Severance/Preservation — Foundation/Build/Harden/House on Fire carry zero behavioral difference across 7 of the plan's 8 weeks. Either use phase boundaries for a real difficulty signal (a small rep-target or rest-period shift) or merge the cosmetic phase names into fewer, more honest labels.

---

## 7. Verdict

**House of Iron closes Wave 4 as the wave's cleanest execution of its own signature mechanic, with one narrow but high-value gap.** Its headline claim — "fixed-load mastery ladders instead of more load" — is real, live-confirmed, and well-designed: a two-session clean-top gate, an athlete-controlled accept/decline step, and per-exercise authored difficulty ladders that correctly substitute harder variations, adjust tempo, and compress rest. The one place it breaks is exactly where the target-rep format changes shape: the two AMRAP-based push-up slots can never enter the progression system at all, confirmed by a live logged session that produced zero tracking state for `push-up` despite an unambiguous top-end performance. This is a smaller, more surgical defect than the dead-feature-with-zero-UI pattern that dominated Wave 3 — the mechanism exists, is reachable, and works for 18 of the plan's 20 exercises.

The plan is also the fourth and final confirmation of Wave 4's T-9-immunity-via-dedicated-dashboard pattern (a clean 4/4 across Athena, Venus Rising, Kali, and House of Iron) and the first Wave-4 plan structurally immune to T-23 rather than merely lucky in its exercise menu, since its progression mechanic never touches working-weight-in-kg at all. Its `resetProgram()` gap (`houseOfIronStatus` missing from the allowlist) matches the now-familiar Wave-4 T-2 pattern, with slightly higher real-world stakes than most instances since the stale state is a substituted exercise rather than an inert number. As a minimal-equipment, repeatable, free-order design, its core training logic — genuinely balanced push/pull and knee/hip volume, session-count-based (not calendar-based) pacing that correctly handles variable frequency, and a real equipment-aware onboarding gate — holds up under contact with the actual engine better than most plans audited so far, Wave 4 or otherwise.

---

## 8. Export block

```yaml
id: house-of-iron
version: 2
length: { weeks: 8, phases: [foundation_1to2, build_3to4, harden_5to6, house_on_fire_7, rebuild_8], repeatable: true }
frequency: 4_sessions_free_order_no_fixed_weekday
weekly_sets: { foundation_build_harden_house_on_fire: 53, rebuild: 35 }
kind: general_minimal_equipment_hypertrophy
calibration: none_equipment_inventory_gate_instead
engine: definePlan_generic_4day_tree_dedicated_dashboard_dedicated_progression_handler
systemic_load: { weekly: 99, axial: 26, lower_back: 36, knee: 22, shoulder: 18, elbow: 25, sets: 53, per_set: 1.87 }
volume_top: { gluteMaxLower: 14.5, abdominalWall: 10.5, latsLower: 10.75, vastusEach: 10.0 }
focus_area_totals: { quads_knee_dominant: 32.5, glutes_hamstrings_hip_dominant: 41.5, push: 41.0, pull: 30.5 }
positive_findings:
  - "fourth and final confirmed T-9-immune Wave-4 plan (4/4), same dedicated-dashboard mechanism as Athena/Venus Rising/Kali — live-confirmed this session by direct switch-in observation, not just source trace"
  - "structurally immune to T-23 (not merely untriggered) — no weighted-bodyweight exercises in the pool and no working-weight-in-kg progression axis at all outside the ladder-of-variations mechanic"
  - "'fixed-load mastery ladder' progression genuinely wired for 18 of 20 exercises — confirmed live via a full logged Push A session that correctly populated houseOfIronStatus.progression for every numeric-target exercise"
  - "'2-4 free-order sessions,' variable-frequency week pacing (completedSessions-based, not calendar-based), and equipment-gated onboarding all confirmed genuinely wired and functioning as claimed"
shared_bugs:
  - id: T-2
    detail: "houseOfIronStatus missing from resetProgram()'s allowlist — real consequence, since progression/pendingProgressions drive an actual exercise substitution, not just a displayed number"
plan_local_bugs:
  - area: "houseOfIronProgression / topReps()"
    detail: "topReps() cannot parse the literal string 'AMRAP', so push-up and close-grip-push-up (the plan's only two AMRAP-target slots) never generate a progression entry regardless of performance — confirmed live: a logged 0kg×25 push-up set produced no houseOfIronStatus.progression['push-up'] entry, while every numeric-range exercise logged in the same session did"
  - area: "exerciseImplementIds"
    detail: "written correctly every session by the progression handler (matches logged weight to the athlete's declared equipment) but has no reader anywhere in the codebase"
  - area: "switch-in flow copy"
    detail: "'NEXT: EXERCISE SELECTION' step label routes to the equipment-inventory screen, not an exercise picker; and a mandatory fixed-weekday/rotation choice precedes a dashboard that otherwise claims and behaves as fully free-order — not confirmed as functionally broken, flagged as a hypothesis"
  - area: "phase structure"
    detail: "Foundation/Build/Harden/House on Fire (weeks 1-7) are behaviorally identical in source — only Rebuild (week 8) has a real transform — same cosmetic-phase pattern already logged on Kali"
verification_note: "test_claude logged in successfully on the first attempt this session — the device-lock error that blocked Venus Rising and Kali did not recur. A full live pass was completed: switch-in, equipment onboarding, session selection, and a complete 13-set logged workout, cross-checked directly against Firestore."
audit: { date: 2026-08-15, findings: 8, verdict: "Wave 4's cleanest execution of its own signature mechanic — a real, well-designed progression system with one narrow, live-confirmed, high-value gap (AMRAP-target exercises never progress) rather than a wide dead-feature surface" }
```
