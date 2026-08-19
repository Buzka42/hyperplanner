# REDLINE

> Unified plan document, v2 format. Supersedes `docs/plans/redline.md`.
> Second plan of **Wave 5 (Conditioning / constrained)**. Volume from
> `docs/analysis/exercise-attribution-map.md`'s native muscle categories
> (primary = 1.0 set-equivalent, secondary = 0.5) computed programmatically
> from `src/data/plans/redline.ts`'s `REDLINE_DAYS` via a throwaway `tsx`
> script (deleted after use) — this plan's exercise pool has no exotic
> attribution-bug exposure, so the lighter native-category model is used
> rather than hand-transcribing all 26 movements against the full 35-dim
> map; cross-checked qualitatively against the map's §25 zero-coverage list.
> Systemic figures from the same script, off each movement's `intelligence`
> block × sets. Wiring verified via direct source trace of
> `src/data/plans/redline.ts`, `src/pages/WorkoutView.tsx`,
> `src/features/redline/BlockTimer.tsx`, `src/types.ts`, and
> `src/contexts/UserContext.tsx` — **and a full `test_claude` live pass**:
> logged in on the first attempt, switched into REDLINE from Iron Clock,
> selected the Mon/Tue/Thu/Fri fixed schedule, deliberately poisoned
> `dashboardViewWeek-test_claude` to reproduce T-9, then logged a complete
> 15-set PRESSURE session (all 3 anchor sets + both A/B/C burn pairs +
> both finishers) plus a BURN block-timer start/finish cycle, completed the
> workout, and cross-checked the resulting document directly in Firestore
> both before and after. The FURNACE-day duration-cap defect (§3.2) was
> confirmed analytically by calling `REDLINE_CONFIG.hooks.preprocessDay`
> directly with a synthetic week-7 day, per §5.3's load-math verification
> method — not re-walked live this session, since the fixed-weekday
> schedule's first FURNACE day is Thursday and the live pass only covered
> Monday (PRESSURE). All other findings below are live-confirmed.

| | |
|---|---|
| **id** | `redline` |
| **Length** | 8 weeks (Ignition 1-2, Burn 3-5, Redline 6-7, Ashes 8) |
| **Frequency** | 4 sessions, fixed weekdays chosen at switch-in (2-on/1-off, 3-on/1-off, every-other-day, or a suggested split like Mon/Tue/Thu/Fri) — no internal 3-day alternative tree, unlike Iron Clock |
| **Weekly sets** | 56 straight sets/week (anchor + burn) at base (Ignition/Burn/Redline phases) + 9 timed finisher blocks/week; Ashes (week 8) cuts 2-set burn slots to 1 (see §3.3), 1-set burn slots unchanged |
| **Declared kind** | conditioning/hypertrophy full-body, non-repeatable (8-week arc) |
| **Calibration** | none — no stats/1RMs required at onboarding |
| **Source** | `src/data/plans/redline.ts` (35 lines, `definePlan()`-generic with a `preprocessDay` hook for furnace-anchor substitution and recovery-gated auto-regulation) |
| **Stated promise** | *"An 8-week four-day full-body plan built around 40–50 minute sessions and timed finishers."* Features: 4 sessions of 40–50 minutes · one heavy anchor, then paired burn work · timed finisher blocks · **recovery check before every session**. |

---

## 1. Headline finding

**REDLINE's fourth listed card feature — "Recovery check before every session" — has no write path anywhere in the running app, exactly mirroring Iron Clock's T-32 one plan earlier in the same wave. `redlineStatus` (the field the plan's entire auto-regulation system reads) is declared in `types.ts`, referenced only by `redline.ts`'s own `preprocessDay` hook, and never written by any code path — no onboarding screen, no pre-workout prompt, no settings control. Confirmed live: a fully logged Week-7 PRESSURE session (all 15 sets, both burn pairs, both finishers, plus a real BURN block-timer start/finish cycle) produced ordinary `workingLoads.redline` writes and, before and after, zero `redlineStatus` field anywhere in the Firestore document.**

### 1a. What the dead mechanic was supposed to do

`redline.ts`'s `preprocessDay` (lines 26-33) reads `user.redlineStatus?.nextRecovery` and, if a confirmed response exists and isn't `'recovered'`, cuts burn-slot set counts by a `0.85`x (`somewhat-fatigued`) or `0.7`x (`performance-impaired`) multiplier, and drops finisher blocks entirely under `performance-impaired`. This is a real, coherently-designed auto-regulation system — the same three-tier `RecoveryResponse` union (`recovered`/`somewhat-fatigued`/`performance-impaired`) and multiplier values (0.85/0.7) as the portfolio's shared `src/features/workout/engines/recovery.ts`, though REDLINE re-implements the multipliers inline rather than calling `recoveryRecommendation()` directly (a minor duplication, not drift, since the numbers match exactly).

### 1b. Live confirmation: no prompt exists, so `recovery` is always `undefined`

A full grep across `src/` for `redlineStatus`, `nextRecovery`, and every `RecoveryResponse` literal (`'recovered'`, `'somewhat-fatigued'`, `'performance-impaired'`) turns up exactly two files that reference `redlineStatus`: `types.ts` (the type declaration) and `redline.ts` (the read). `WorkoutView.tsx:857` reads `user.redlineStatus?.nextRecovery?.response` only to echo it into a `historyEntry.redline.recovery` field on session completion — a read of the same never-populated value, not a write path. Live-confirmed: the switch-in flow (Settings → Switch Program → REDLINE card → Training Schedule step) went straight from schedule selection to the dashboard, with **no recovery-check screen at any point** — before the session, during it, or at completion. Firestore before the session: no `redlineStatus` key. After a complete logged session: still no `redlineStatus` key. Because `recovery` is therefore always `undefined`, `preprocessDay`'s `if(!recovery?.confirmed)return result;` guard (line 32) always short-circuits before the volume-cut math runs — the auto-regulation system is not merely underused, it is structurally unreachable.

This is the same "declared but unwritten" shape as Iron Clock's T-32 one plan earlier in Wave 5, but arguably more consequential: Iron Clock's dead mechanic was a progression ladder (an upgrade athletes miss out on); REDLINE's is a safety valve (a *protection* athletes never get). An athlete who reports being wrecked has no way to tell the app, and the app has no way to know — every PRESSURE/REDLINE/FURNACE/AFTERBURN session runs at full prescribed volume every week, unconditionally.

---

## 2. Structure

### Weekly template (Ignition phase, weeks 1-2, base prescription)

| Day | Anchor (3×, rest 180s) | Burn A (rest 60s) | Burn B (rest 60s) | Burn C (rest 60s) | Finisher(s) |
|---|---|---|---|---|---|
| PRESSURE (Mon) | Hack Squat 4-6 | Incline DB BP + SA Hammer Row 2×6-10 | Seated Ham Curl + Lateral Raise 2×8-12/12-15 | Hammer Curl + Cable Tri Ext 1×8-15 | KB Swing, Farmer Carry (5:00) |
| REDLINE (Tue) | Lat Pulldown 6-8 | FFE Bulgarian Split Squat + Hammer Chest Press 2×8-10 | Hip-Supported DB DL + SA Reverse Pec Deck 2×8-10/12-15 | Hack Calf + Ab Wheel 1×12-20/8-15 | Goblet Heel-Elevated Squat, Push-Up, Farmer Carry (5:00) |
| FURNACE (Thu) | Paused Bench 4-6 | Goblet Skater Squat + SA Hammer Row 2×8-12/6-10 | Leg Extension + Lat Prayer 2×10-15 | Lateral Raise + Hammer Curl 2×12-20/1×8-15 | KB Swing, Deficit Reverse Lunge, Deficit Push-Up (5:00) |
| AFTERBURN (Fri) | Romanian Deadlift 5-8 | Hammer Chest Press + Hammer Pulldown 2×8-12 | Deficit Reverse Lunge + SA Hammer Row 2×8-12 | Lateral Raise 2×12-20 + Cable Tri Ext/Hack Calf/Ab Wheel 1× each | Farmer Carry (5:00) |

56 straight sets/week (anchor + burn) + 9 finisher blocks. All burn slots use `restSeconds: 60`; anchors use 180s. Base finisher duration is 5:00 (300s), scaled by phase (§ below).

### Phases

| Phase | Weeks | Change |
|---|---|---|
| Ignition | 1-2 | Base finisher duration: 5:00 |
| Burn | 3-4 | Finisher duration: 6:00 |
| Burn (cont.) | 5 | Finisher duration: 7:00 |
| Redline | 6-7 | Finisher duration: 8:00 |
| Ashes | 8 | Finisher duration returns to 5:00; burn-slot sets cut (partially — see §3.3) |

Only finisher `durationSeconds` is phase-scaled via the `duration(week)` helper (line 16); anchor/burn set counts and rep ranges are constant across Ignition/Burn/Redline and only change in Ashes. Confirmed live: switching in from Iron Clock (whose poisoned `dashboardViewWeek` initially showed "PRESSURE · Redline / WEEK 7") correctly displayed 9 exercises and the Redline-phase label once actually rendered — phase-name display is correctly wired, independent of the T-9 bug that mis-selected the week (§3.1 below).

### `xStatus`, T-2, T-3, T-4, T-9, T-22, T-23, reverse-nordic

- **`redlineStatus`** is declared, referenced only for the dead read/echo described in §1, and **never written anywhere**. Because nothing ever populates it, `resetProgram()`'s allowlist gap (`UserContext.tsx:467-470`, still only `benchDominationStatus`/`pencilneckStatus`/`skeletonStatus`) is **structurally moot for `redlineStatus`** — same shape as Iron Clock's T-2-adjacent finding, now reproducing a second consecutive Wave-5 plan.
- **`planPreferences.redline`** (the `exerciseSelections.furnaceAnchor` field controlling which exercise substitutes for Paused Bench Press on FURNACE day) is likewise never written — confirmed both by grep (only `redline.ts`'s own read at line 26) and live (the switch-in flow's "NEXT: EXERCISE SELECTION" button routes straight to the dashboard with no selection step, identical to the minor step-label mismatch already noted on Iron Clock and House of Iron). `planPreferences` for `redline` is entirely absent from the live Firestore document even after a completed session, confirming T-28 (generalized: `resetProgram()` never touches `planPreferences` for any plan) also applies here, though — like `redlineStatus` — with no practical consequence since nothing is ever written to clear.
- **No `type: 'wave'` anywhere in the plan file** — zero T-3 exposure.
- **No classic T-4 duplicated-definition drift.** `single-arm-hammer-row` (3×), `lateral-raise` (3×), `farmer-carry` (3×), `hammer-curl`/`cable-triceps-extension`/`kettlebell-swing`/`hammer-chest-press`/`hack-calf-raise`/`ab-wheel`/`deficit-reverse-lunge` (2× each) all appear on multiple days, but every occurrence is an independent call to the `b()`/`f()` helper with its own literal set/rep/duration arguments — the same clean pattern seen on Iron Clock and every `definePlan()`-generic plan since Wave 2.
- **No `reverse-nordic-curl`** anywhere in the exercise pool — clean, consistent with every plan since Quadfather.
- **T-9 reproduces live, second consecutive Wave-5 plan.** REDLINE has no dedicated dashboard component (`ui.dashboardWidgets: ['program_status', 'workout_history']`, both generic). Detailed in §3.1.
- **T-22 does not apply.** `dashboardWidgets` never requests `strength_chart`, and no `trackedLiftFor()` call exists in the plan's own code.
- **T-23 does not apply, structurally.** All 26 distinct movements in the pool are `weightMode: 'external'` except `push-up` and `deficit-push-up`, which are `weightMode: 'bodyweight'` (not `weighted-bodyweight`) — confirmed against the library. No exercise has a `totalSystemWeightKg` progression axis to break.

---

## 3. Findings

### 3.1 T-9 reproduces live, second consecutive Wave-5 plan with no dedicated dashboard · **severity: high, `shared-bug`**

Deliberately set `localStorage['dashboardViewWeek-test_claude']` to `'7'` (simulating a leftover value from a previously-viewed plan) and navigated to the dashboard without a hard reload: it immediately rendered "PRESSURE · Redline / WEEK 7," despite Firestore showing zero `programProgress['redline']` entry at all at that point (confirmed via direct read before the session). After logging and completing a real session, the dashboard correctly resolved to Week 1 · Ignition on the next render. Same mechanism as every T-9 instance since Monolith (`Dashboard.tsx:79,187-189`'s shared, `programId`-unscoped localStorage key) and identical in kind to Iron Clock's T-33 one plan earlier. Two for two on Wave 5 plans lacking a dedicated dashboard component — continuing to support "dedicated dashboard" as the actual predictor of T-9 immunity, independent of plan category.

### 3.2 FURNACE-day duration cap is unconditionally active, silently undercutting the plan's own designed escalation · **severity: medium, `plan-local`**

Detailed in §1a-1b: because `redlineStatus` is never written, `recovery?.response` is always `undefined`, and the FURNACE-day branch (`redline.ts:29-31`, `if(furnace && recovery?.response!=='recovered'){...}`) treats "no recovery data" identically to "confirmed not recovered." Its cap — `Math.min(existing durationSeconds, 360)` — therefore fires on **every** FURNACE session, every week, for every athlete, with no way to opt out short of the (nonexistent) recovery UI reporting `'recovered'`. Confirmed analytically by calling `REDLINE_CONFIG.hooks.preprocessDay` directly against a synthetic week-7 FURNACE day carrying the phase-correct 480s finisher duration: output was capped to 360s. Weeks 1-4 are unaffected (their phase-scaled durations, 300s/360s, are already ≤360s), but weeks 5, 6, and 7 — whose `duration(week)` values are 420s/480s/480s — are silently held at 360s specifically on Thursdays, while the identical finisher exercises on Monday/Tuesday/Friday escalate as designed. This is a second, independent bug living in the same function as the headline finding, not merely a restatement of it: even after §1's write path is fixed, this branch's condition needs correcting (gate on `recovery?.confirmed` too, not just `response !== 'recovered'`) or every future "recovered" report will still get silently overridden on FURNACE day by matching `undefined !== 'recovered'` before the `confirmed` check is ever reached in that specific branch — the two guards are structured inconsistently (`furnace` branch checks `response` alone, the general volume-cut branch below it correctly checks `confirmed` first).

### 3.3 Ashes-phase "deload" is real but self-acknowledged as incomplete for 1-set burn slots · **severity: low-medium, `plan-local`**

The phase's own inline comment (`redline.ts:21-22`) states the limitation directly: *"Rounds rather than ceilings: with two-set burn slots, ceiling left week 8 identical to week 7 and the deload existed only on paper."* Verified against the actual set distribution: 2-set burn slots (A/B pairs on every day, most C slots) correctly halve to 1 set via `Math.round(sets*.65)` (`Math.round(2*0.65)=1`), but every 1-set burn slot — `hammer-curl`/`cable-triceps-extension` (arms, both C-role) and `hack-calf-raise`/`ab-wheel` (calves/core, C or D-role) — computes `Math.round(1*0.65)=1`, floored at `Math.max(1,...)`, and gets **zero** week-8 volume reduction. This means REDLINE's week-8 taper (undisclosed on the card as a deload at all, but implied by the phase name "Ashes") only actually reduces the plan's larger antagonist-paired compound/isolation slots, while every arm, calf, and core accessory runs at full week-1-7 volume straight through the taper week. Not flagged to the athlete anywhere in the UI.

### 3.4 BlockTimer captures elapsed time only, feeding nothing · **severity: low, `plan-local`**

Confirmed live: starting and finishing the PRESSURE-A burn-block timer (`src/features/redline/BlockTimer.tsx`, shared component with Iron Clock) produces an `elapsedSeconds`/`expired` pair stored in local component state (`redlineBlockTimes`) and folded into `historyEntry.redline.blocks` on workout completion — a real write, unlike Iron Clock's density ladder. But nothing reads it back: no pacing feedback, no "beat your last block" comparison, no connection to the (dead) recovery/auto-regulation system despite both living in the same file. It is honest telemetry with no consumer, a milder version of Iron Clock's identical finding on the same shared component.

### 3.5 `programProgress.redline` written without a `startDate` field · **severity: low, `hypothesis`, not root-caused**

Every other plan's `programProgress[planId]` entry in the live Firestore document (`arms-race`, `athena`, `bench-domination`, etc. — 20+ entries) carries both `completedSessions` and `startDate`. After switching into and completing a REDLINE session, `programProgress.redline` holds only `{completedSessions: 1}` — no `startDate`. Flagged as a hypothesis worth a fast trace (possibly `switchProgram()`'s write differs from `resetProgram()`'s for this plan, or a first-session-completion path skips the field some other write site sets) rather than a confirmed bug — not independently reproduced a second time this session, and not currently observed to affect any UI (nothing in the dashboard reads `startDate` for date-relative copy on this plan).

### 3.6 UI/UX

Fully live-tested this session, no login friction (`test_claude` worked on the first attempt, already mid-session from the prior Iron Clock pass). Switch-in flow: Settings → Switch Program → REDLINE card → mandatory "Training Schedule" step (fixed weekdays via 2-on/1-off, 3-on/1-off, every-other-day, or three suggested splits) → "NEXT: EXERCISE SELECTION," which — like Iron Clock and House of Iron — actually routes straight to the dashboard with no selection step (§2, `planPreferences.redline` dead). Set logging, antagonist-pair display (A1/A2, B1/B2 labeled "with ‹partner exercise›"), the Extra-sets "+ ADD SET" affordance, and workout completion all worked without error across all 15 sets of a full PRESSURE session.

---

## 4. Weekly volume (56 sets/week, Ignition/Burn/Redline phases, anchor+burn only)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Glutes | 14.0 | | Lats | 13.0 |
| Hamstrings | 11.5 | | Quads | 11.0 |
| Upper back | 10.5 | | Chest | 9.0 |
| Biceps | 7.5 | | Triceps | 6.5 |
| Side delt | 6.0 | | Front delt | 5.5 |
| Rear delt | 5.0 | | Calves | 3.0 |
| Abs | 3.0 | | Lower back | 2.5 |
| Brachialis | 2.0 | | Forearms | 2.0 |
| Adductors | 1.5 | | Rotator cuff | 1.0 |
| Obliques | 1.0 | | | |

Computed from `EXERCISE_LIBRARY`'s native primary(1.0)/secondary(0.5) categorization across all 26 distinct movements in the anchor+burn tree (finisher blocks excluded — they are duration-based conditioning work, not set-counted resistance volume, and are not comparable set-for-set to the table above). This is a lighter model than the full 35-dim fractional map used elsewhere in the audit; REDLINE's pool has no attribution-bug exposure (no `reverse-nordic-curl`, no `around-the-worlds`, no other §25-flagged movement) to make the extra resolution load-bearing here. Consistent with the map's portfolio-wide zero-coverage findings: REDLINE has no direct adductor isolation (1.5 above is entirely secondary squat/hinge carryover), no direct erector work, no soleus-specific loader, no upper-trap work, and no tibialis-anterior exposure — it does nothing to close any of those gaps, same as every plan audited so far.

Burn-slot sets are unchanged Ignition→Burn→Redline (only finisher duration escalates, §2); Ashes (week 8) reduces this table by roughly 15-20% on the 2-set slots only (§3.3), leaving 1-set arm/calf/core slots at full volume even in the taper week.

---

## 5. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **85** |
| Axial | **17** |
| Lower back | **19** |
| Knee | **24** |
| Shoulder | **17** |
| Elbow | **24** |
| Sets (anchor + burn) | 56 |
| Per-set systemic | **1.52** |

Elbow (24) and knee (24) are tied as the highest raw categories — elbow driven by `hammer-curl`/`cable-triceps-extension` appearing in 3 of 4 sessions, knee by the squat-pattern anchor (Hack Squat, Paused Bench is upper so excluded) plus FFE Bulgarian Split Squat, Goblet Skater Squat, and Leg Extension across the week. Per-set systemic cost (1.52) sits close to Iron Clock's 1.47 from the same wave — both plans lean on machine/dumbbell/cable work for the bulk of volume, with only the four anchors (Hack Squat, Lat Pulldown, Paused Bench, Romanian Deadlift) carrying real axial or free-weight loading. Finisher blocks (KB Swing, Farmer Carry, Goblet Heel-Elevated Squat, Push-Up, Deficit Reverse Lunge, Deficit Push-Up) are excluded from this table since they are prescribed by duration, not sets, and their systemic cost model doesn't compose additively with the anchor/burn table above without double-counting relative to the plan's actual per-session time budget.

---

## 6. Improvements, ranked

### 1. Build the recovery-check UI and wire it to `redlineStatus.nextRecovery` · `plan-local`

The single highest-value fix, and the plan's own headline promise. `preprocessDay`'s volume-cut/finisher-skip logic already exists, is coherently designed, and matches the shared `recoveryRecommendation()` multipliers almost exactly — it just has no data to consume. A lightweight pre-session or post-session three-state prompt (recovered / somewhat-fatigued / performance-impaired), written to `redlineStatus.nextRecovery` with `confirmed: true`, closes this. Given Blackout's `singleSet.ts` already consumes the identical `RecoveryResponse` union via the shared `recovery.ts` engine, a single reusable recovery-prompt component could plausibly serve both plans rather than building REDLINE-specific UI from scratch.

### 2. Fix the FURNACE-day duration cap's guard condition · `plan-local`

Detailed in §3.2. The `furnace` branch should gate on `recovery?.confirmed && recovery.response !== 'recovered'`, matching the general volume-cut branch's own guard immediately below it, rather than on `recovery?.response !== 'recovered'` alone — otherwise, even after improvement #1 ships, the very first FURNACE session before an athlete has ever answered the recovery check will still get silently capped, and the fix will look "half-wired" until this second guard is corrected too.

### 3. Either extend the Ashes-phase reduction to 1-set slots, or redesign week 8's taper mechanism entirely · `plan-local`

Detailed in §3.3 — the plan's own source comment already flags this as known and unresolved ("the deload existed only on paper" for 1-set slots). A duration or load-based cut for single-set arm/calf/core slots (rather than a `sets * 0.65` rounding rule that can never move a 1-set slot) would make week 8 an actual taper across the whole session, not just the paired A/B slots.

### 4. Add `redlineStatus` and `planPreferences.redline` to `resetProgram()`'s allowlist, bundled with improvement #1 · `shared-bug`

Currently moot (§2) but should ship in the same change as the write path, so the gap doesn't quietly reappear with real consequences the way it did on Athena/Kali/House of Iron once `redlineStatus` starts holding real state.

### 5. Give `furnaceAnchor` selection a real UI, or drop the dead field and fix the "NEXT: EXERCISE SELECTION" button copy · `plan-local`

`planPreferences.redline.exerciseSelections.furnaceAnchor` is fully built into `preprocessDay` (it substitutes the FURNACE anchor exercise) but has no selection screen anywhere, and the switch-in flow's button label promises a step that never appears — third instance of this exact pattern in Wave 5 (also seen on Iron Clock and House of Iron), suggesting a shared onboarding-flow template that isn't always filled in per-plan.

### 6. Reconsider whether an entirely un-auto-regulated conditioning plan is appropriately conservative as shipped · `hypothesis`

With the recovery check dead, REDLINE currently runs at full prescribed volume and full finisher duration every week regardless of how the athlete is actually recovering — the opposite of the "recovery check before every session" framing on the card. Worth a science-based gut-check once #1 ships: is the un-gated version (today's actual behavior) too aggressive for a self-described "conditioning/constrained" plan, or was the auto-regulation always meant as a light guardrail rather than the plan's real volume driver? The literature on autoregulated training (Helms et al. on RPE-based autoregulation; general APRE frameworks) generally favors *some* fatigue-responsive adjustment for high-frequency density work like REDLINE's — this plan currently provides none.

---

## 7. Verdict

**REDLINE is Wave 5's second plan, and it repeats Iron Clock's most severe finding almost exactly: the plan's own headline, card-listed mechanic does not run in the shipped app.** "Recovery check before every session" is not true — there is no recovery-check screen anywhere in the live product, `redlineStatus` has no writer anywhere in the codebase, and a fully logged Week-7 session confirmed this directly against Firestore both before and after. Where Iron Clock's dead mechanic was a progression ladder (athletes miss an upgrade), REDLINE's is a safety valve (athletes get zero protection from a system whose stated purpose is protecting them) — arguably a more consequential gap for a plan explicitly positioned around 40-50 minute sessions and timed finishers meant to push conditioning. A second, independent bug compounds it: the FURNACE-day duration cap treats "no recovery data" as "confirmed not recovered," silently holding Thursday's finisher durations at 360s even in weeks 6-7 when the phase table intends 480s — a defect that will persist even after the write path is fixed unless its guard condition is corrected too. A third, smaller gap (the Ashes-phase taper's own source comment acknowledging it doesn't reduce 1-set slots) rounds out a genuinely under-tested `preprocessDay` function.

Beyond the auto-regulation system, REDLINE's actual authored structure is sound: four sessions balancing a heavy anchor against antagonist-paired burn supersets and timed conditioning finishers, moderate and well-distributed systemic/joint load (85 systemic, per-set cost close to Iron Clock's from the same wave), no `reverse-nordic-curl` exposure, no classic duplicated-slot drift despite heavy movement reuse across days, and structural immunity to T-22/T-23. The T-9 plan-switch bug reproduces live a second consecutive Wave-5 plan, continuing to confirm "dedicated dashboard" — not plan category — as the operative predictor. As shipped, an athlete on REDLINE is training a reasonable, moderately-loaded four-day full-body density/conditioning hybrid — just one that never actually listens when they report they're cooked, exactly the failure mode the plan's own name and marketing most directly promise it won't have.

---

## 8. Export block

```yaml
id: redline
version: 2
length: { weeks: 8, phases: [ignition_1to2, burn_3to5, redline_6to7, ashes_8], repeatable: false }
frequency: 4_sessions_fixed_weekday_only_no_internal_alt_tree
weekly_sets: { anchor_burn_base: 56, ashes_partial_reduction: "2-set burn slots only, 1-set slots unchanged" }
finisher_blocks_per_week: 9
kind: conditioning_hypertrophy_hybrid
calibration: none
engine: definePlan_generic_4day_fixed_tree_with_preprocessDay_furnace_substitution_and_dead_recovery_gate_no_dedicated_dashboard_no_dedicated_progression_handler
systemic_load: { weekly: 85, axial: 17, lower_back: 19, knee: 24, shoulder: 17, elbow: 24, sets: 56, per_set: 1.52 }
volume_top: { glutes: 14.0, lats: 13.0, hamstrings: 11.5, quads: 11.0, upperBack: 10.5 }
positive_findings:
  - "phase-scaled finisher duration escalation (300->360->420->480s) is correctly computed by duration() and correctly displayed once rendered, distinct from the T-9 bug that mis-selected the week"
  - "no reverse-nordic-curl exposure, no classic T-4 duplicated-slot drift despite heavy cross-day movement reuse, structurally immune to T-23 (no weighted-bodyweight exercises), T-22 inapplicable (no strength_chart widget)"
  - "BlockTimer genuinely writes historyEntry.redline.blocks (elapsedSeconds/expired) on completion, unlike Iron Clock's identical shared component which had no completion write at all for its own plan"
shared_bugs:
  - id: T-9
    detail: "Second consecutive Wave-5 plan reproducing live — no dedicated dashboard component. Deliberately poisoned dashboardViewWeek-test_claude to '7' and confirmed the dashboard rendered Week 7 despite zero programProgress['redline'] at that point; resolved correctly to Week 1 after logging a real session."
  - id: T-2-adjacent
    detail: "redlineStatus and planPreferences.redline both missing from resetProgram()'s allowlist, but structurally moot — neither is ever written by any code path, so there is no stale state a reset could fail to clear. Should be fixed together with the write-path fix (improvement #1), not standalone."
plan_local_bugs:
  - area: "src/data/plans/redline.ts preprocessDay (lines 26-33) — recovery-gated auto-regulation"
    detail: "The plan's fourth card feature, 'Recovery check before every session,' has zero UI entry points anywhere in the app. redlineStatus is declared, read only to echo a value into historyEntry on completion, and never written. Because recovery is therefore always undefined, the volume-cut/finisher-skip logic that reads it can never execute. Live-confirmed via a full logged Week-7 session producing zero redlineStatus state before or after."
  - area: "src/data/plans/redline.ts preprocessDay, FURNACE-day branch (lines 29-31)"
    detail: "Guards on recovery?.response !== 'recovered' rather than also checking recovery?.confirmed, so with recovery always undefined this branch is unconditionally true on every FURNACE session — silently caps finisher duration to 360s even in weeks 5-7 when the phase table intends 420s/480s. Confirmed analytically via a direct call to REDLINE_CONFIG.hooks.preprocessDay against a synthetic week-7 day. Will persist as a bug even after the recovery write path is built unless this guard is separately corrected."
  - area: "src/data/plans/redline.ts Ashes phase transform (lines 21-23)"
    detail: "Source's own inline comment acknowledges: Math.round(sets*0.65) cannot reduce a 1-set burn slot (arms/calves/core, mostly C/D-role), so REDLINE's week-8 taper only actually reduces 2-set A/B slots. Not disclosed to the athlete anywhere in the UI."
  - area: "programProgress.redline"
    detail: "Written with only completedSessions after a completed session, missing the startDate field every other plan's programProgress entry carries. Flagged as a hypothesis, not independently root-caused or reproduced a second time this session."
verification_note: "test_claude was already logged in from the prior Iron Clock session this session; switched into REDLINE cleanly. A full live pass was completed: fixed-weekday schedule selection, a deliberate localStorage-poisoning test reproducing T-9, a complete 15-set PRESSURE session (3 anchor + 4 burn pairs across A/B/C + 2 finishers) plus a BURN block-timer start/finish cycle, workout completion, and direct Firestore cross-checks both before and after. The FURNACE duration-cap finding (T-35-equivalent, see plan_local_bugs) was verified analytically via a direct preprocessDay call rather than a live Thursday session, consistent with the audit's load-math verification method used since King of the Squat."
audit: { date: 2026-08-15, findings: 6, verdict: "Second consecutive Wave-5 plan whose entire named headline mechanic is dead code, confirmed live — this time a safety/auto-regulation feature rather than a progression ladder, arguably higher-stakes given its stated protective purpose" }
```
