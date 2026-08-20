# Event Horizon

> Unified plan document, v2 format. Supersedes `docs/plans/event-horizon.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `event-horizon` |
| **Length** | 12 weeks (Approach 1-3, Accretion 4-6, Deload 7, Horizon 8-11, Escape 12) |
| **Frequency** | 4 days/week upper/lower (Mon / Tue / Thu / Fri) |
| **Weekly sets** | 78 (Approach), ~78+RPE9 (Accretion), ~71 (Deload wk 7, −1/slot), up to ~85 (Horizon, +1 set on sub-4-set non-primary slots), ~71 (Escape wk 12, −1/slot) |
| **Declared kind** | hypertrophy, adaptive/joint-accommodating |
| **Calibration** | none |
| **Source** | `src/data/plans/eventHorizon.ts` (105 lines) + `src/features/eventHorizon/costAwareSwaps.ts` (200 lines) — `definePlan()`-based, same generic engine as Monolith/Purgatorio |
| **Stated promise** | *"A 12-week hypertrophy plan that finds a cheaper way to train when a joint starts complaining... Report a region, get real options. Every swap keeps the role. Nothing changes without confirmation."* |

---

## 1. Headline finding

**The plan's entire premise — reporting a painful region and getting a cost-aware exercise swap — is dead code with zero UI entry points anywhere in the application. Not partially wired, not hard to find: completely unreachable.**

`src/features/eventHorizon/costAwareSwaps.ts` is a genuinely well-designed,
non-trivial substitution engine:

- `REGION_COSTS` maps 6 regions (`lowerBack`, `knee`, `shoulder`, `elbow`,
  `spine`, `systemic`) to the corresponding `intelligence` cost field on each
  exercise (`lowerBackCost`, `kneeCost`, etc.).
- `recommendSwap(exerciseId, region, report, exposures)` ranks real
  candidate substitutes strictly cheaper on the reported region, preserving
  `source.pattern` as a `preservedRole` field — genuinely enforcing the "every
  swap keeps the role" claim, not a hardcoded lookup table.
- `splitFor()` — when no single cheaper exercise exists, offers a two-exercise
  split (a cheaper same-pattern compound + a same-primary-muscle isolation),
  dividing sets via `Math.ceil(sets / n)`.
- `learnedCost()` — a bounded personal-learning adjustment: only activates
  after ≥3 comparable exposures, and moves at most one ordinal cost step from
  the expert-authored baseline. Careful, conservative design.
- `swapVerdict()` classifies a follow-up exposure as helped/mixed/did-not-help.
- `SwapRecommendation.requiresConfirmation: true` is a real field on the type
  — the "nothing changes without confirmation" claim is genuinely encoded.

**None of this is ever called.** A repo-wide search for `costAwareSwaps` and
`recommendSwap` outside the engine file itself, and for `eventHorizonStatus`
across every `.tsx` file in `src/`, returns **zero matches**. There is no
region-report form, no swap-recommendation display, no accept/reject
control, no dashboard widget (`dashboardWidgets: ['program_status',
'workout_history']` — no swap-related widget listed), anywhere in the UI
layer. `eventHorizonStatus.acceptedSwaps` can only ever be populated by
hand-editing Firestore directly — there is no product surface that writes to
it.

**Confirmed live.** A fresh registration into Event Horizon and a full
clickthrough of the dashboard and the Upper A session found no button, link,
or control matching `/report|swap|region|joint|pain|strain|complain|hurt/i`
anywhere on either screen.

The one place `eventHorizonStatus` is ever *read* is inside the plan's own
`preprocessDay` hook (`eventHorizon.ts`'s `preprocess()`), which correctly
applies any accepted swaps *if* they exist in `user.eventHorizonStatus.
acceptedSwaps` — that mechanism is real and would work if fed data, but
nothing in the running application can ever feed it any. The plan's own
original doc (`docs/plans/event-horizon.md`) already flags this as *"partial
/ engine-first"* — an understatement. It is not partial; it is a complete,
well-engineered backend for a frontend that was never built. This is a more
severe version of Blackout's dead-feature pattern (§6.8 precedent): Blackout
had features that were partially wired; here the entire plan's identity
("finds a cheaper way to train when a joint starts complaining") has no
functioning entry point at all.

---

## 2. Structure

### Weekly template (Approach, weeks 1-3, 78 sets)

| Day | Sets | Key work |
|---|---|---|
| Horizon — Upper A | 20 | Incline DB Bench 4×6-10 (primary), SA Hammer Row 4×8-12 (uni), Seated DB Shoulder Press 3×8-12, Lat Pulldown 3×8-12, Lateral Raise 2×12-15 (last-set-failure), Hammer Curl 2×8-12 (last-set-failure), Cable Tri Ext 2×10-15 (last-set-failure) |
| Horizon — Lower A | 19 | Hack Squat 4×6-10 (systemic, primary), RDL 3×8-12, Leg Extension 3×12-15, Seated Ham Curl 3×10-15, SL Machine Hip Thrust 3×10-15 (uni), Hack Calf Raise 3×12-20 |
| Horizon — Upper B | 18 | Hammer Pulldown 4×8-12 (primary), Hammer Chest Press 4×8-12, SA Reverse Pec Deck 2×12-15 (uni, last-set-failure), Pec Deck 2×12-15 (last-set-failure), Lateral Raise 2×12-20 (last-set-failure), Cable Curl 2×10-15 (last-set-failure), Rope Pressdown 2×10-15 (last-set-failure) |
| Horizon — Lower B | 21 | Leg Press 4×8-12 (systemic, primary), Lying Leg Curl 3×10-15, FFE Bulgarian Split Squat 3×8-12 (uni), Hip Abduction 3×12-20, Leg Extension 3×12-20, Hack Calf Raise 3×12-20, Ab Wheel 2×8-12 |

### Phases

| Phase | Weeks | Change |
|---|---|---|
| Approach | 1-3 | Base prescription |
| Accretion | 4-6 | Non-systemic slots → RPE 9 |
| Deload | 7 | −1 set/slot, RPE 7; day renamed `"Deload — <name>"` |
| Horizon | 8-11 | Primary slots → RPE 9; non-primary slots under 4 sets → RPE 9 **and** +1 set |
| Escape | 12 | −1 set/slot |

Same single-day-list-plus-phase-transform architecture as Monolith and
Purgatorio: no duplicated exercise definitions (grepped `exerciseName ===`/
`ex.name ===` — no matches), no `type: 'wave'` progression (not exposed to
T-3), and `reverse-nordic-curl` is not used anywhere. **Third consecutive
Wave-2 plan with this clean immunity profile.**

**Confirmed live**, week 5 (Accretion): dashboard showed "Horizon — Upper A
· Accretion, WEEK 5, 7 EXERCISES," matching source exactly.

---

## 3. Findings

### 3.1 Headline "region swap" feature has zero UI entry points · **severity: critical, `plan-local`**

Detailed in §1. The single most severe finding of Wave 2 so far, and among
the most severe in the whole audit — it isn't a bug in a feature, it's an
entire, well-built feature with literally no way for a user to reach it.
Since the current phase of the audit is findings-only (PROC-1), this is
logged for the post-audit implementation round; per AUDIT-2 it's tagged
`plan-local` since the engine code itself is correct and self-contained —
what's missing is a UI layer, not a shared-system fix.

### 3.2 Plan-switch bug (T-9) reproduces a third time · **severity: high, `shared-bug`**

Continuing the `test_claude` session (Purgatorio's stale week 5), switching
into Event Horizon again showed "NEXT SESSION — WEEK 5" with no
`programProgress.event-horizon` entry and a fresh `startDate` — same
mechanism as Monolith and Purgatorio (§1 of those docs). Not re-verified
against Firestore individually this time since the mechanism and its root
cause (`Dashboard.tsx:79`) are already conclusively established; a third
identical reproduction on a third `definePlan()`-generic plan is
confirmation enough without repeating the full Firestore-read ceremony.

### 3.3 `resetProgram()` allowlist gap — real, though currently inert · **severity: low (given §3.1), `shared-bug`**

`eventHorizonStatus` is absent from both the hardcoded reset allowlist
(`UserContext.tsx:468-470`) and the registration-merge allowlist
(`:365-367`) — the same T-2 gap already logged against Bench Domination/
Pencilneck/Skeleton's inverse (those three are the *only* entries in the
list). Unlike those plans, this is currently low-impact in practice: since
nothing in the UI ever writes to `eventHorizonStatus` (§3.1), there's
nothing for "Reset Current Progress" to fail to clear yet. Worth fixing in
the same pass as T-2 generally, but it's a latent bug that only matters once
§3.1 is fixed — flagging now so it isn't rediscovered independently later.

### 3.4 No `xStatus`-adjacent exposure otherwise, no duplicated slots, no wave bug, no reverse-nordic · **severity: none (positive findings)**

Same clean profile as Monolith and Purgatorio — third consecutive
confirmation of the `_audit-decisions.md` §0c hypothesis that
`definePlan()`-generic-engine plans are structurally safer than Wave 1's
bespoke engines. The pattern is now strong enough to treat as expected
rather than worth re-deriving in full detail on every remaining Wave 2 plan
(Tenfold, Pencilneck — the latter is bespoke-engine, worth watching whether
it breaks the streak).

### 3.5 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| No region/pain/swap control anywhere | Critical | See §3.1 — confirmed absent on dashboard and workout view |
| Accretion-phase RPE 9 correctly rendered | — | Consistent with Monolith/Purgatorio's equivalent phase transforms |
| Exercise order/count matches source | — | 7/6/7/7 exercises across the 4 days, matching `EVENT_HORIZON_DAYS` exactly |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 4. Weekly volume (Approach phase, weeks 1-3, 78 sets)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Quads (3 heads)** | **17.0 each** | | Glute max (lower) | 13.0 |
| Biceps femoris | 10.5 | | Front delt | 9.5 |
| Semimembranosus/tendinosus | 9.0 | | Teres major | 9.0 |
| Lats (lower) | 8.75 | | Triceps (lateral/medial) | 8.5 each |
| Pec (lower) | 8.0 | | Rectus femoris | 7.75 |
| Biceps (long) | 7.5 | | Gastrocnemius | 7.5 |
| Lats (upper) | 7.0 | | Pec (upper) | 7.0 |
| Rhomboids | 6.5 | | Brachialis | 6.5 |
| Forearm flexors | 6.5 | | Glute medius | 6.0 |
| Side delt | 5.5 | | Glute max (upper) | 4.5 |
| Triceps (long) | 4.25 | | Adductors | 3.5 |
| Trap (mid) | 3.0 | | Rear delt | 3.0 |
| Soleus | 3.0 | | Abdominal wall | 2.75 |
| Biceps (short) | 2.7 | | Abs (upper/lower) | 2.0 each |

All 27 slots resolved to an attribution row — no missing-data caveats. Good
floor clearance across the board; the thinnest dimensions (serratus 0.75,
infraspinatus 0.5, subscapularis/trap upper 1.0) are secondary
stability/cuff targets, consistent with the same pattern seen on Monolith
and Purgatorio and not claimed as a focus of this plan. Soleus (3.0) is
underloaded relative to gastrocnemius (7.5) since only Hack Calf Raise is
used — a straight-leg calf variant would balance this, though it's a minor
gap against the plan's own budget, not a floor violation.

---

## 5. Systemic and joint load

Approach-phase (weeks 1-3) totals, computed from `intelligence`:

| Metric | Value |
|---|---|
| Systemic | **108** |
| Axial | **31** |
| Sets | 78 |
| Per-set systemic | **1.38** |

Mid-pack among the Wave 2 hypertrophy generalists audited so far (Monolith:
1.30, Purgatorio: 1.66-1.67). One systemic-compound anchor per lower day
(Hack Squat, Leg Press), same one-per-day discipline as Monolith.

---

## 6. Improvements, ranked

### 1. Build the region-report/swap UI, or remove the claim from the plan card · `plan-local`

The single highest-impact item found in Wave 2. The backend
(`costAwareSwaps.ts`) is already done and well-designed — what's needed is
a UI surface: a "report a region" control (dashboard or per-exercise),
a recommendation display reading `recommendSwap()`'s output, and an
accept/reject control that writes to `eventHorizonStatus.acceptedSwaps`
(which `preprocessDay` already reads correctly). Until this exists, the
plan's entire stated identity is unearned — an athlete choosing Event
Horizon specifically for its joint-accommodation promise gets an ordinary
upper/lower hypertrophy plan with no way to ever invoke the one thing that
sets it apart. If UI work is genuinely not planned soon, the onboarding
copy should not claim "report a region, get real options" as a live
feature.

### 2. Fix the `resetProgram()` allowlist gap · `shared-bug`

Add `eventHorizonStatus` to both allowlists (`UserContext.tsx:365-367`,
`:468-470`) in the same pass as the broader T-2 fix, so it's not
rediscovered independently once §improvement-1 ships and the field starts
holding real data.

### 3. Namespace the dashboard view-week cache by program · `shared-bug`

Same T-9 recommendation as Monolith and Purgatorio — third confirmation in
Wave 2 alone.

### 4. Balance soleus against gastrocnemius · `plan-local` (`hypothesis`)

Both lower days use only Hack Calf Raise (gastrocnemius-biased). Swapping
one occurrence for a seated/bent-knee calf variant would add direct soleus
work without changing total calf volume.

### 5. Give the Deload week (7) a stated purpose in the onboarding copy · `plan-local` (`hypothesis`)

The plan card doesn't mention a mid-program deload; the day-rename to
"Deload — <name>" is a nice in-session touch (confirmed present in source)
but a first-time athlete choosing this plan for its adaptive-swap promise
has no advance notice that week 7 is a planned lighter week, unlike some
other audited plans that state this upfront.

---

## 7. Verdict

**Event Horizon's ordinary hypertrophy programming is sound and structurally
clean — same immunity profile as Monolith and Purgatorio — but the feature
that gives the plan its entire reason to exist doesn't reach the user at
all.**

The day structure, phase transforms, and volume profile are all competently
built, continuing Wave 2's pattern of `definePlan()`-generic plans avoiding
every local bug class found in Wave 1's bespoke engines. But "a cheaper way
to train when a joint starts complaining" — the plan's stated premise, its
differentiator from Monolith and Purgatorio, and the reason someone with a
known joint sensitivity would choose it over either — is backed by a
genuinely well-designed, careful substitution engine (bounded personal
learning, role-preserving swaps, an honest confirmation gate) that has no
way to ever be invoked. This is worse than a bug in a feature: it's a
feature with no way in. An athlete who reports pain by any means available
in this app — because there is no means available in this app — gets
exactly the same session as an athlete with no complaints at all.

---

## 8. Export block

```yaml
id: event-horizon
version: 2
length: { weeks: 12, phases: [approach_1to3, accretion_4to6, deload_7, horizon_8to11, escape_12] }
frequency: 4_per_week
weekly_sets: { approach: 78, deload_wk7: ~71, horizon_8to11: up_to_85, escape_wk12: ~71 }
kind: hypertrophy_adaptive
calibration: none
engine: definePlan_generic
systemic_load: { weekly: 108, axial: 31, sets: 78, per_set: 1.38 }
volume_approach_top: { vastusLateralis: 17.0, vastusMedialis: 17.0, vastusIntermedius: 17.0, gluteMaxLower: 13.0, bicepsFemoris: 10.5 }
absent_bug_patterns: [duplicated_exercise_definitions, wave_progression_bug, reverse_nordic_curl_misattribution]
critical_bug:
  area: "src/features/eventHorizon/costAwareSwaps.ts — the plan's headline feature"
  detail: "recommendSwap/learnedCost/swapVerdict never imported outside the engine file; eventHorizonStatus never read/written from any .tsx file in the app; no region-report or swap UI exists anywhere"
  confirmed: "static grep (zero references outside the engine file and the plan's own preprocessDay hook) + live clickthrough of dashboard and Upper A session found no report/swap/region control anywhere"
shared_bug_gaps:
  T9_plan_switch: "reproduces identically, third consecutive Wave 2 plan"
  T2_resetProgram_allowlist: "eventHorizonStatus missing from both allowlists — currently inert since nothing writes to the field, but will matter once the swap UI (improvement 1) ships"
audit: { date: 2026-08-14, findings: 5, verdict: "clean, ordinary hypertrophy programming; the plan's entire stated identity — adaptive joint-pain swaps — is unreachable dead code" }
```
