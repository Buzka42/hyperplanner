# Gravity Is Optional

> Unified plan document, v2 format. Supersedes `docs/plans/gravity-is-optional.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `gravity-is-optional` |
| **Length** | 12 weeks (Ascent 1-4, Escape Velocity 5-8, Orbit 9-12) |
| **Frequency** | 4 days/week |
| **Weekly sets** | 82 (Ascent) |
| **Declared kind** | specialisation, weighted calisthenics |
| **Calibration** | none, but `requireBodyweight: true` at onboarding |
| **Source** | `src/data/plans/gravityIsOptional.ts` (173 lines, `definePlan()`-based) |
| **Stated promise** | *"...tracked by total system weight... Vertical pull and dip family 3x weekly... Total-rep targets - beat your set count, not your reps."* |

---

## 1. Headline finding

**All three of Workhorse's shared-bug findings (T-22, T-23) reproduce here exactly, confirmed live and in Firestore. A third card claim — "vertical pull and dip family 3x weekly" — is also false: both families get 2 direct exposures, not 3. This is Wave 3's most concentrated cluster of claim-vs-reality gaps in a single plan.**

### 1a. T-23 reproduces: "total system weight" is computed but never progressed

Identical mechanism to Workhorse. `totalSystemWeightKg` (bodyweight+
external) is computed per set in `WorkoutView.tsx`, correctly gated on
`gravity-is-optional` alongside `workhorse`/`kali`. But this plan has no
dedicated progression handler — it falls through to
`genericDoubleProgression`, which reads `sets[0]?.weight` (external load
only) and writes that alone to `workingLoads`. Confirmed by direct source
trace (no separate handler registered for this plan id in
`progression/index.ts`), consistent with Workhorse's live-verified result.

### 1b. T-23's TSW dashboard card also reproduces

`Dashboard.tsx`'s TSW card gate is literally
`activePlanConfig.id === 'workhorse' || activePlanConfig.id === 'gravity-is-optional'`
— the same card, same mislabeling. **Confirmed live**: the dashboard
rendered "Chin belt / TSW / Log bodyweight / Belt load + bodyweight on
chins and dips" — identical copy and identical bug to Workhorse.

### 1c. T-22 reproduces: `liftHistory` still has no write path

This plan declares `dashboardWidgets: ['program_status', 'strength_chart',
'workout_history']` and uses the same "Chin belt" tracked-lift widget as
Workhorse (`trackedLiftFor`'s `'gravity-is-optional'` case reads
`user.liftHistory?.chinBelt`). **Confirmed live**: the widget rendered
with the same title. Since T-22's root cause (`liftHistory` has no write
path anywhere in the codebase) is a shared, plan-independent defect, this
is expected to be permanently empty here too — not re-verified via a fresh
Firestore read this session since the mechanism is already conclusively
established.

### 1d. "Total-rep targets" is decorative, and "beat your set count" has nothing to compare against

`technique: { kind: 'total-reps', targetReps: 40, maxSets: 12 }` on the
Volume day's Chin-Up and Dip slots has exactly one consumer anywhere in the
app: `techniqueLabel()`, which produces the badge string "Total 40 reps."
**Confirmed live**: Week 1's Volume Gravity session showed the badge
correctly, but rendered exactly **6 fixed AMRAP set rows** — `maxSets: 12`
never expands or contracts the row count, nothing tracks cumulative reps
toward the 40-rep target, and nothing compares this session's set count
against a prior one. "Beat last session on set count, not reps" (the
slot's own notes text) has no mechanism to know what last session's set
count was. The Orbit phase (weeks 9-12) even increases `targetReps` by 25%
— a real, intentional progression on paper — but since nothing reads or
enforces the field beyond the badge label, this progression is as inert as
the base target itself.

### 1e. "Vertical pull and dip family 3x weekly" is false — both land at 2 exposures

Traced exactly: chin-up-pattern work (`weighted-chin-up`, `chin-up`)
appears only in Heavy Gravity and Volume Gravity — **2 exposures, 11
sets/week**. Dip-station work (`weighted-dip`, `dip`) appears in the same
two days only — **also 2 exposures, 11 sets/week**. Single-Leg Gravity and
Control Gravity contain no pull-up-bar or dip-station movement at all
(their "pull" and "press" work is `trx-body-row`/`trx-push-up`, different
movement patterns). The two families are volume-matched against each other
(11 vs 11 sets) — a genuine positive, and consistent with the card's
"pull-ups and dips as main lifts" framing — but the specific "3x weekly"
figure doesn't hold for either.

---

## 2. Structure

### Weekly template (Ascent phase, weeks 1-4, 82 sets)

| Day | Sets | Key work |
|---|---|---|
| Heavy Gravity | 19 | Weighted Chin-Up 5×3-5 (double +2.5kg), Weighted Dip 5×3-5 (double +2.5kg), Hammer Upper Row 3, Sissy Squat 3, Hanging Leg Raise 3 |
| Single-Leg Gravity | 21 | Goblet Skater Squat 4, Hip-Supported DB Deadlift 4, TRX Body Row 3, Deficit Push-up 3×AMRAP, Standing Calf Raise 3, Ab Wheel 3 |
| Volume Gravity | 22 | Chin-Up 6×AMRAP ("Total 40 reps"), Dip 6×AMRAP ("Total 50 reps"), Heel-Elevated Goblet Squat 4, Cable Lateral Raise 2, Cable Curl 2, Cable Tri Ext 2 |
| Control Gravity | 21 | TRX Push-Up 3, TRX Body Row 3, Cable Lateral Raise 3, Sissy Squat 3, Hip-Supported DB Deadlift 3 (4s eccentric tempo), Standing Calf Raise 3, Hanging Knee Raise 3 |

### Phases

| Phase | Weeks | Change |
|---|---|---|
| Ascent | 1-4 | Base |
| Escape Velocity | 5-8 | Weighted chin-up/dip get +1 set; everything else holds |
| Orbit | 9-12 | `total-reps` slots' `targetReps` × 1.25 (inert per §1d) |

### `xStatus`, T-2, T-3, T-4, reverse-nordic

- **No `gravityIsOptionalStatus` anywhere** — structurally immune to
  T-1/T-2, same no-status-object class as Monolith/Purgatorio/Workhorse.
- **No `type: 'wave'` and no `technique: {kind:'wave'}`** — not exposed to
  T-3/T-14.
- **No classic T-4 pattern** — single authoritative slot per day.
- **No `reverse-nordic-curl`** anywhere in this plan.

---

## 3. Findings

### 3.1 T-23 reproduces exactly · **severity: high, `shared-bug`**

Detailed in §1a-1b. Second confirmed instance — this is now a
confirmed, repeating shared bug across both plans that use the
`weighted-bodyweight` gate, strengthening the case for a single fix.

### 3.2 T-22 reproduces (expected) · **severity: high, `shared-bug`**

Detailed in §1c.

### 3.3 "Total-rep targets" mechanic is entirely decorative · **severity: medium, `plan-local`**

Detailed in §1d. A new instance of the wave's dominant theme (specific
mechanical claim, zero backing implementation), this time on a `technique`
kind rather than a progression type or status object — the pattern keeps
finding new places to hide in this codebase.

### 3.4 "3x weekly" claim is off by one exposure for both named families · **severity: low, `plan-local`**

Detailed in §1e. The families are at least volume-matched against each
other, which is a real positive — this is a specific-number inaccuracy,
not a design flaw.

### 3.5 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| "Chin belt" / TSW card | High | Confirmed identical to Workhorse's bug — see §1b |
| "Total 40 reps" badge, fixed 6-row rendering | Medium | Confirmed decorative — see §1d |
| Pull/dip volume-matched at the exercise level | — (positive) | 11 vs 11 sets/week, confirmed via source trace |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 4. Weekly volume (Ascent phase, 82 sets/week)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Pec (lower) | 17.0 | | Biceps (long) | 15.75 |
| Abdominal wall | 15.25 | | Triceps (lateral) | 15.0 |
| Quads (3 heads) | 14.0 each | | Triceps (medial) | 13.5 |
| Biceps (short) | 13.0 | | Lats (upper) | 12.5 |
| Teres major | 11.0 | | Glute max (lower) | 11.0 |
| Trap (mid) | 10.0 | | Front delt | 9.75 |
| Lats (lower) | 9.25 | | Rhomboids | 9.0 |
| Abs (lower) | 9.0 | | Forearm flexors | 9.0 |

All 19 distinct exercises resolved to attribution rows — no missing data.

### Pull vs. dip-family balance (the card's "3x weekly" claim, quantified)

| Family | Sets/wk | Exposures/wk |
|---|---|---|
| Vertical pull (chin-up pattern) | 11.0 | 2, not 3 |
| Dip family (dip-station) | 11.0 | 2, not 3 |

Genuinely volume-matched against each other; both fall one exposure short
of the card's specific "3x weekly" claim.

---

## 5. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **145** |
| Axial | **15** |
| Sets | 82 |
| Per-set systemic | **1.77** |

Highest per-set systemic cost of any Wave 3 plan audited (Overhead
Dominion 1.43, Arms Race 1.34, Hamstring Foundry 1.52, Quadfather 1.49,
Cathedral 1.51, Peachy 1.61, Workhorse 1.49) despite the lowest axial load
tier (15, tied with Workhorse) — driven by the weighted-bodyweight
compounds (chin-up, dip) both carrying substantial systemic cost as
multi-joint, high-effort movements even though they don't load the spine
axially the way a squat or deadlift does.

---

## 6. Improvements, ranked

### 1. Wire `liftHistory` and feed `totalSystemWeightKg` into progression · `shared-bug`

Same recommendation as Workhorse's #1 and #3 — this plan is a second,
independent confirmation that both fixes have portfolio-wide leverage, not
plan-specific.

### 2. Implement the total-reps mechanic, or remove the claim · `plan-local`

Either build real cumulative-rep tracking against `targetReps`/`maxSets`
(dynamically adding set rows until the target is hit, capped at
`maxSets`, and surfacing last session's set count for comparison), or
simplify the copy to describe a plain AMRAP set scheme without the
"beat your set count" framing that currently has nothing to measure
against.

### 3. Add a chin-up-bar or dip-station exposure to one of the other two days, or correct "3x weekly" to "2x weekly" · `plan-local` (`hypothesis`)

Either change would resolve the gap between the card's specific number and
what's actually programmed — adding a third exposure is the more
faithful fix to the stated design intent, given the plan's own name and
premise center on these two movements.

---

## 7. Verdict

**Gravity Is Optional closes Wave 3 as the plan with the most claims
per square inch, and the most of them shown false under verification —
but every one of its defects is either a confirmed repeat of an already-
diagnosed shared bug or a new decorative-claim instance of the wave's
dominant pattern, not a novel failure mode.**

The exercise selection itself is sound: pull and dip work are genuinely
volume-matched against each other, the Escape Velocity phase's +1-set
strength block is a sensible progression shape, and the plan avoids every
local bug class (T-3/T-4/T-14/reverse-nordic) the rest of the audit has
been checking for. But three of its four most specific claims don't survive
contact with the running app: total system weight isn't what progresses,
the total-rep mechanic is a badge with no tracking behind it, and the
"3x weekly" figure for both named lifts is off by one exposure each. Two
of these (T-22, T-23) are now confirmed on two independent plans sharing
the same underlying code paths — strong evidence both are single,
high-leverage fixes rather than plan-specific patches, closing out Wave 3
on the same note nearly every plan in it has struck: solid training design,
oversold or unbuilt supporting claims.

---

## 8. Export block

```yaml
id: gravity-is-optional
version: 2
length: { weeks: 12, phases: [ascent_1to4, escape_velocity_5to8, orbit_9to12] }
frequency: 4_per_week
weekly_sets: { ascent: 82 }
kind: specialisation_weighted_calisthenics
calibration: { requireBodyweight: true }
engine: definePlan_generic
systemic_load: { weekly: 145, axial: 15, sets: 82, per_set: 1.77 }
volume_top: { pecLower: 17.0, bicepsLong: 15.75, abdominalWall: 15.25, tricepsLateral: 15.0 }
pull_dip_balance: { vertical_pull: { sets: 11.0, exposures: 2 }, dip_family: { sets: 11.0, exposures: 2 } }
absent_bug_patterns: [T1_T2_no_status_object, wave_progression_bug, T14_no_wave_technique_used, classic_T4_duplicated_definitions, reverse_nordic_curl_misattribution]
shared_bug_confirmations:
  T22_liftHistory_unwritten: "reproduces — same trackedLiftFor 'Chin belt' widget as Workhorse, same unwritten liftHistory field"
  T23_total_system_weight_not_progressed: "reproduces exactly — no dedicated progression handler, falls through to genericDoubleProgression (external load only); TSW dashboard card confirmed live showing bodyweight-only, identical to Workhorse"
plan_local_bugs:
  - area: "'total-rep targets — beat your set count, not your reps' card claim"
    detail: "technique:{kind:'total-reps'} only feeds a badge label; maxSets never expands set rows; nothing tracks cumulative reps or compares to a prior session's set count; confirmed live at week 1 — fixed 6-row rendering regardless of the 40-rep target"
  - area: "'vertical pull and dip family 3x weekly' card claim"
    detail: "both families traced to exactly 2 exposures/week (Heavy Gravity + Volume Gravity only), not 3 — Single-Leg and Control Gravity contain no pull-up-bar or dip-station work"
audit: { date: 2026-08-15, findings: 5, verdict: "closes Wave 3 with the highest claim-to-reality gap count of any plan this wave, but every gap is either a confirmed repeat of an already-diagnosed shared bug or a new instance of the wave's dominant decorative-claim pattern" }
```
