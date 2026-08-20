# Arms Race

> Unified plan document, v2 format. Supersedes `docs/plans/arms-race.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `arms-race` |
| **Length** | 8 weeks (Escalation 1-4, Proliferation 5-8) |
| **Frequency** | 4 days/week (arms 4x, everything else 2x) |
| **Weekly sets** | 86, constant across all 8 weeks — Proliferation adds a real myo-reps technique, never changes `sets` |
| **Declared kind** | specialisation, biceps/triceps |
| **Calibration** | none |
| **Source** | `src/data/plans/armsRace.ts` (107 lines, `definePlan()`-based) |
| **Stated promise** | *"Biceps and triceps four times a week, never the same way twice... Heavy, brachialis, lengthened, and a density day. Supersets on the density day."* |

---

## 1. Headline finding

**Arms Race is the first plan in the audit where every distinctive mechanic checked out live exactly as claimed — including the two specific patterns (T-14's decorative wave label, T-10/T-15's dead per-region tracking) that broke on the two plans right before it.**

**"Supersets on the density day" — confirmed structurally real.** The
`ARM_DENSITY` day pairs `standing-straight-bar-curl`/`lying-dumbbell-
skullcrusher` as A1/A2 and `rope-hammer-curl`/`rope-pressdown` as B1/B2,
using the same `pair` mechanism already proven wired on Monolith. Confirmed
live at Week 8 (Proliferation): both pairs rendered with correct "with
[partner]" labels and correctly differentiated rest times per side (30s on
the first exercise of each pair, 90s on the second).

**Proliferation's myo-reps technique is genuinely functional, not
decorative — the direct opposite of Overhead Dominion's T-14 bug.** The
transform:

```ts
transform: slot =>
    slot.pair || slot.ex.includes('curl') || slot.ex.includes('pressdown')
        ? { ...slot, technique: { kind: 'myo-reps', miniSets: 2, miniReps: '4-5', restBreaths: 5 } }
        : slot,
```

only ever adds a `technique`, never touches `sets` — so **weekly volume is
literally identical (86 sets) across both phases**; "arm work gains a set"
(the file's own comment) describes the myo-reps mini-clusters, not a
`sets` field change. Unlike Overhead Dominion's wave label, this technique
has a real, wired consumer: **confirmed live**, every curl/pressdown/paired
slot at Week 8 rendered a "Myo-reps: 2x4-5" badge **and** genuinely
rendered extra "MINI 1"/"MINI 2" set rows beyond the base set count — the
UI doesn't just claim myo-reps, it delivers the actual extra micro-sets an
athlete needs to log. This is the correct pattern T-14 should have followed:
a technique claim that's backed by rendering logic, not just a label.

**No dead-feature repeat of T-10/T-15.** Unlike Overhead Dominion's
`splitDelts` flag, Arms Race declares no per-head (biceps long/short/
brachialis, triceps long/lateral/medial) tracking anywhere in its
`volumeAnalysis.ts` rules entry, and the onboarding copy never claims one.
The one arm-specific widget, `arm_tracker`, is a straightforward
circumference (cm) tape-measurement log with a trend chart — confirmed live
("Arm tape — Circumference (cm) — LOG"), real and wired, not a per-head
volume breakdown. This is a genuine absence of the pattern, not a narrower
version of it: the plan simply never promises what it doesn't deliver.
Worth recording as the first Wave-3 specialization plan that doesn't repeat
Overhead Dominion's dead-feature finding — weakens (doesn't falsify) the
"every specialization plan does this" hypothesis raised after that audit.

---

## 2. Structure

### Weekly template (constant across all 8 weeks, 86 sets)

| Day | Sets | Key work |
|---|---|---|
| Arm Strength | 18 | Close-Grip Bench 5×4-6, Standing Straight-Bar Curl 5×4-6, Flat DB Press 3×8-12, Hammer Upper Row 3×8-12, Rear-Delt Fly 2×15-20 |
| Brachialis + Legs | 21 | Reverse Curl 3×8-12, DB Hammer Curl 3×10-15, Cable Tri Ext 3×10-15, Rope Pressdown 3×12-20, Hack Squat 3×8-12, Hip-Supported DB Deadlift 3×8-12, Standing Calf Raise 3×12-20 |
| Lengthened Arms + Torso | 21 | Bayesian Cable Curl 3×8-12, 30° Incline-Lying DB Curl 3×12-15, Cable Tri Ext 3×10-15, French Press 3×10-15, Incline BB Bench 3×8-12, Lat Pulldown 3×8-12, Cable Lateral Raise 3×15-20 |
| Arm Density + Legs | 26 | Standing Straight-Bar Curl 4×8-12 (A1), Lying DB Skullcrusher 4×12-15 (A2), Rope Hammer Curl 3×12-20 (B1), Rope Pressdown 3×12-20 (B2), Heel-Elevated Goblet Squat 3×10-15, Seated Ham Curl 3×10-15, Standing Calf Raise 3×12-20, Cable Crunch 3×12-20 |

Card's "never the same way twice" claim confirmed structurally: four
distinct curl variants across the week (straight-bar, reverse, Bayesian
cable, incline-lying, hammer, rope-hammer) each targeting a genuinely
different length/angle, matching the plan's Escalation/Brachialis/
Lengthened/Density framing exactly. "Everything else held at twice weekly"
also checks out — pressing (Close-Grip Bench, Flat DB Press, Incline BB
Bench) and pulling (Hammer Upper Row, Lat Pulldown) each appear exactly
twice across the 4 days, and leg/core accessory work stays flat at
maintenance level throughout.

### `xStatus`, T-2, T-3, T-4, T-14, reverse-nordic

- **No `armsRaceStatus` anywhere** — structurally immune to T-1/T-2, same
  as Monolith/Purgatorio/Overhead Dominion's no-status-object class. The
  generic `resetProgram()` path covers it fully.
- **No `type: 'wave'` progression** — not exposed to T-3.
- **No `technique: {kind: 'wave'}` anywhere** — not exposed to T-14 at all
  (the pattern doesn't apply here since no wave technique is ever used,
  genuine vs. Overhead Dominion's active-but-broken usage).
- **No duplicated exercise definitions** — `cable-triceps-extension`
  legitimately appears in two different days with different rep/rest
  values (distinct slots, not two competing definitions of the same slot).
  Not exposed to T-4.
- **No `reverse-nordic-curl`** anywhere in the plan.

---

## 3. Findings

### 3.1 Every distinctive mechanic checked out live · **severity: none (positive finding)**

Detailed in §1 — supersets real, myo-reps real and rendering actual mini-set
rows, no dead per-head tracking feature. Second plan in the whole audit
(after Tenfold) where every card claim survives live verification without
qualification.

### 3.2 Plan-switch bug (T-9) reproduces, in a new variant · **severity: high, `shared-bug`**

Continuing the `test_claude` session from Overhead Dominion's manually-set
Week 9, switching into Arms Race (only 8 weeks long) showed **"WEEK 8"** —
the stale week-9 value from `Dashboard.tsx`'s cache exceeded this plan's
week count, and `Math.min(targetWeek, currentProgram.weeks.length)`
(`Dashboard.tsx:169`) silently clamped it to the plan's final week instead
of resetting to week 1. This is a new observable variant of the same root
cause: instead of landing on an arbitrary mid-plan week, a short plan
following a longer one lands on its *last* week — skipping the entire
Escalation phase and all but the final week of Proliferation. Seventh
consecutive confirmation of T-9, and the first to show the clamp
side-effect explicitly.

### 3.3 Front delt carries meaningful incidental volume · **severity: none (informational)**

At 10.0 fractional sets/week (driven by three separate pressing movements
plus the heavy curl), front delt is the fourth-highest non-arm muscle in
the plan's volume table — not called out anywhere in the plan's copy, and
worth knowing for an athlete stacking this with another press-heavy plan
in future mesocycles, though not a defect in isolation.

### 3.4 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| A1/A2/B1/B2 supersets on the density day | — | Confirmed correct pairing labels and differentiated rest times |
| Myo-reps mini-set rows | — | "MINI 1"/"MINI 2" rendered as real loggable rows beyond the base set count, not just a badge |
| "Arm tape" widget | — | Confirmed present and functional (circumference input + trend chart) |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 4. Weekly volume (constant across all 8 weeks, 86 sets)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Triceps (lateral/medial)** | **22.5 each** | | Biceps (long) | 21.0 |
| Triceps (long) | 18.5 | | Brachialis | 16.5 |
| Biceps (short) | 13.5 | | Front delt | 10.0 |
| Brachioradialis / forearm flexors | 9.0 each | | Pec (upper/lower) | 7.0 each |
| Gastrocnemius | 6.75 | | Quads (3 heads) | 6.0 each |
| Glute max (lower) | 6.0 | | Hamstrings (2 heads) | 6.0 each |
| Rhomboids | 5.5 | | Rear delt | 5.0 |
| Trap (mid) | 4.75 | | Lats (upper) | 4.5 |

All 23 distinct exercise ids resolved to attribution rows — no missing
data.

### Per-head breakdown

| Biceps head | Sets | Share | | Triceps head | Sets | Share |
|---|---|---|---|---|---|---|
| Long | 21.0 | 38% | | Lateral | 22.5 | 34.5% |
| Brachialis | 16.5 | 30% | | Medial | 22.5 | 34.5% |
| Short | 13.5 | 25% | | Long | 18.5 | 28.4% |

Triceps heads are close to perfectly balanced — lateral and medial draw
identically from every triceps exercise in the plan, and long head trails
only modestly, helped by Cable Triceps Extension (overhead, long-head-
dominant per the map) and French Press both contributing at full weight.
This is meaningfully better long-head coverage than a pressdown-only
triceps rotation would produce, and the attribution map's §21 flags
pressdown-heavy plans as a common failure mode this plan avoids. Biceps
skew harder toward long head — no exercise in the plan gives short head a
full prime-mover row (Cable Curl and EZ-Bar Preacher Curl, both
short-head-dominant per the map, are absent here) — a real, if minor,
asymmetry in an otherwise well-designed arm split.

---

## 5. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **115** |
| Axial | **15** |
| Sets | 86 |
| Per-set systemic | **1.34** |

Lowest axial load of any Wave 2/3 plan audited so far (Monolith 28,
Purgatorio 52, Event Horizon 31, Tenfold 31, Pencilneck 45, Overhead
Dominion 33) — expected for an arm-isolation-dominant specialization plan
whose only compound lower-body work is maintenance-level (Hack Squat,
Heel-Elevated Goblet Squat, Hip-Supported DB Deadlift, all 3 sets each).

---

## 6. Improvements, ranked

### 1. Add a short-head-dominant curl variant · `plan-local` (`hypothesis`)

Biceps short head (13.5 sets/week, 25% share) trails long head (21.0, 38%)
and brachialis (16.5, 30%). Swapping one Escalation-phase curl (e.g.
Reverse Curl, which is brachialis/brachioradialis-dominant) for Cable Curl
or EZ-Bar Preacher Curl would close the gap without adding a slot.

### 2. Note the incidental front-delt volume in the onboarding copy · `plan-local` (`hypothesis`)

At 10.0 fractional sets/week, front delt is trained at a level worth
knowing about for an athlete layering this plan against another
press-heavy mesocycle — not a defect, just an unstated number.

### 3. Namespace the dashboard view-week cache by program · `shared-bug`

Same T-9 recommendation as every prior plan — seventh confirmation, and
the first to show the `Math.min(week, plan.weeks.length)` clamp landing an
athlete on a short plan's *final* week rather than an arbitrary mid-plan
one, which is arguably worse (skips the entire Escalation ramp-in
entirely).

---

## 7. Verdict

**Arms Race is the strongest-executed specialization plan audited so
far — every distinctive claim on its card survives live verification, and
it stands in direct, useful contrast to the two plans immediately before it
in this wave: where Overhead Dominion's wave label was pure decoration,
Arms Race's myo-reps technique genuinely renders the extra work it
promises; where Overhead Dominion's delt-split tracking was a dead
feature, Arms Race simply doesn't claim a per-head tracking feature it
doesn't build.**

The four-day arm-focus structure is well thought through (heavy, brachialis,
lengthened, density — each day trains a genuinely different length/angle),
the antagonist supersets on the density day are real and correctly wired
using the same proven mechanism as Monolith, and the resulting triceps-head
balance is close to ideal. The one real gap is a minor volume asymmetry
(biceps short head trailing the other two heads) rather than a functional
defect. T-9 is the only shared-bug exposure, reproducing in a new variant
(clamped to the plan's final week rather than an arbitrary mid-plan one)
that's worth noting as evidence the bug's blast radius scales with how
different two consecutively-viewed plans' lengths are.

---

## 8. Export block

```yaml
id: arms-race
version: 2
length: { weeks: 8, phases: [escalation_1to4, proliferation_5to8] }
frequency: 4_per_week
weekly_sets: { constant_all_8_weeks: 86 }
kind: specialisation_arms
calibration: none
engine: definePlan_generic
systemic_load: { weekly: 115, axial: 15, sets: 86, per_set: 1.34 }
volume_top: { tricepsLateral: 22.5, tricepsMedial: 22.5, bicepsLong: 21.0, tricepsLong: 18.5, brachialis: 16.5 }
biceps_head_split: { long: 21.0, brachialis: 16.5, short: 13.5 }
triceps_head_split: { lateral: 22.5, medial: 22.5, long: 18.5 }
absent_bug_patterns: [T1_T2_no_status_object, wave_progression_bug, T14_no_wave_technique_used, duplicated_exercise_definitions, reverse_nordic_curl_misattribution, T10_T15_no_dead_feature_claimed]
positive_findings:
  - "myo-reps technique genuinely functional — confirmed live, renders real MINI 1/MINI 2 set rows, not decorative like Overhead Dominion's wave badge (T-14 contrast case)"
  - "density-day A1/A2/B1/B2 supersets confirmed live, reusing Monolith's already-proven pair mechanism"
  - "no per-head tracking claimed anywhere, so no T-10/T-15-style dead feature to find"
shared_bug_gaps:
  T9_plan_switch: "seventh consecutive confirmation; new variant — stale week (9, from a longer plan) exceeded this plan's 8-week length and was clamped to week 8 (Dashboard.tsx:169's Math.min), landing on the final week instead of resetting to week 1"
audit: { date: 2026-08-14, findings: 3, verdict: "strongest-executed specialization plan in the audit so far; every distinctive claim survives live verification, only real gap is a minor biceps short-head volume asymmetry" }
```
