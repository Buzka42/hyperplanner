# Peachy

> Unified plan document, v2 format. Supersedes `docs/plans/peachy.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `peachy-glute-plan` |
| **Length** | 12 weeks (base 1-8, intensification 9-12) |
| **Frequency** | 4 days/week (Mon/Wed/Fri/Sat) |
| **Weekly sets** | 64 (base weeks) |
| **Declared kind** | specialisation, glutes |
| **Calibration** | none |
| **Source** | `src/data/peachy.ts` (155 lines, **bespoke** object literal — Peachy lives outside `src/data/plans/`, unlike every other Wave-3 plan audited so far) |
| **Stated promise** | *"12-week glute specialization. For those who want a better booty. Science-Based Glute Programming."* |

---

## 1. Headline finding

**The four-plan Wave-3 dead-feature streak (Overhead Dominion, Hamstring Foundry, Quadfather, Cathedral) breaks here. Peachy has two genuinely real, wired tracking features with live badge payoffs — no dead code found anywhere in its feature set — but its "science-based" glute programming has a real, checkable structural gap: no bilateral loaded hip thrust anywhere in the split, leaving gluteMaxUpper (the short-length/peak-contraction stimulus) meaningfully under-served relative to gluteMaxLower.**

### 1a. The glute tracker is real and wired — second positive precedent after Arms Race

Declared in `ui.dashboardWidgets: ['glute_tracker', ...]`. `Dashboard.tsx`
has a full working implementation: a numeric input + "Log" button that
appends `{date, sizeCm}` to `user.gluteMeasurements` via a real
`updateUserProfile()` write, plus a live trend chart reading directly from
that array. **Confirmed live**: the dashboard rendered "Weekly Glute
Tracker — Current Circumference (cm) — LOG" as a functional control.
`glute_gainz_queen` badge (≥3cm growth) computes from the same array's
first-vs-last delta — a real payoff for a real mechanism.

### 1b. Squat history tracking is also real and wired, independently

`peachyProgression` (`historyEntries.ts`) logs the heaviest completed
"Squats" set each session into `squatHistory`, feeding: the dashboard's
tracked-lift widget (confirmed live as "Squat"), a "Squat +30kg" badge, and
Paused Squat's automated 80%-of-Monday's-squat load calculation
(`calculateWeight`, floored to 2.5kg). This is a genuine automated
progression mechanism — unlike Hamstring Foundry's notes-only ladder or
Overhead Dominion's decorative wave label, Paused Squat's weight is
actually computed and applied by the engine, not left to the athlete.

### 1c. "Science-based" is unfalsifiable marketing copy, but the exercise selection has a real, checkable gap

No code maps to a specific "science-based" claim — as expected, this is
vaguer than the other Wave-3 cards' specific mechanical promises. But the
exercise selection itself is checkable against current glute-training
literature's central finding (hip thrust patterns peak tension at short
muscle length; squat/hinge patterns peak at long length — complementary,
not substitutable). Computed from the attribution map: **gluteMaxLower
sits at 24.25 fractional sets/week versus gluteMaxUpper at 11.0 — a
roughly 2.2:1 ratio**, and the plan contains **no bilateral loaded hip
thrust anywhere** in any of the 4 days. The only genuine short-length
glute driver is a unilateral Single-Leg Machine Hip Thrust (3 sets,
Saturday — the week's last training day) plus Kas Glute Bridge (3 sets,
deliberately short-ROM top-range only). For a plan whose entire premise is
glute specialization, the absence of a bilateral hip-thrust-family lead
lift is a real, structural gap relative to what "science-based glute
programming" would typically signal, not a nitpick about marketing tone.

---

## 2. Structure

### Weekly template (base weeks 1-8, 64 sets)

| Day | Sets | Key work |
|---|---|---|
| Monday — Glute/Legs Heavy | 17 | Sumo Deadlift 3×5-8, FFE Bulgarian Split Squat 3×8-12, Squats 3×5-10, Seated Ham Curl 3×8-12, Hack Squat Calf Raises 3×15-20, Machine Hip Abduction 2×12-20 |
| Wednesday — Glute/Upper Pump | 15 | Kas Glute Bridge 3×8-12, 45° Hyperextension 2×15-20, Standing Military Press 2×8-12, Incline DB Bench 2×8-12, Inverted Rows 3×8-12, Side-Lying Rear Delt Fly 3×12-15 |
| Friday — Posterior Chain | 17 | DB RDL 3×5-8, Paused Squat 3×5-10 (@80% Monday squat), Glute Ham Raise (eccentric only) 3×failure, Hip Adduction 3×8-12, Leg Press Calf Raises 3×15-20, Machine Hip Abduction 2×12-20 |
| Saturday — Unilateral & Pump | 15 | Deficit Reverse Lunge 2×8-12, Single-Leg Machine Hip Thrust 3×12-15, Deficit Push-ups 3×AMRAP, Assisted Pull-ups 2×AMRAP, Y-Raises 2×12-15, Lying Cable Lat Raises 3×12-15 |

Weeks 9-12: Bulgarian Split Squat and Deficit Reverse Lunge get a
"drop-to-bodyweight, go to failure" last-set tag; Squats and Paused Squat
gain +1 set with the note "add a set or 2.5kg — do not only drop-set the
accessories." Week 12's Saturday adds a 1×100-rep "Glute Pump Finisher."

Procedurally generated per-week (`createPeachyWeeks()`, fresh exercise ids
each week) rather than a single static template with phase transforms —
**structurally immune to T-4 by construction**, the same immunity class as
`definePlan()`-generic plans despite being a bespoke engine.

### `xStatus`, T-2, T-3, T-14, T-4, reverse-nordic

- **No `xStatus` object exists at all.** Grepped the full codebase — no
  `peachyStatus`. (The `peachyStatus`/`feelingPeachy` strings found in
  translations are dashboard greeting-pun i18n keys, not a status object.)
  T-2/`resetProgram()` allowlist is structurally not applicable — there's
  nothing for the allowlist to miss.
- **No `type: 'wave'` and no `technique: {kind:'wave'}`** — not exposed to
  T-3/T-14. The weeks 9-12 modification uses a plain descriptive
  `intensityTechnique` string, not the shared technique-badge system.
- **No T-4 exposure** — procedural per-week generation, no duplicated
  static slots to drift.
- **No `reverse-nordic-curl`** anywhere in this plan.

---

## 3. Findings

### 3.1 No bilateral loaded hip thrust — the plan's one real structural gap · **severity: medium, `plan-local` (`hypothesis`)**

Detailed in §1c. gluteMaxLower outweighs gluteMaxUpper roughly 2.2:1;
the only short-length glute-max driver is a 3-set unilateral machine
variant on the week's last day. Not a bug — a genuine design choice that's
defensible on its own terms (the split is legitimately glute-heavy in
aggregate, 43.25 combined glute-region fractional sets/week) — but a real
gap against what "science-based glute programming" implies to an athlete
familiar with the literature the card is gesturing at.

### 3.2 `resetProgram()` doesn't clear `squatHistory` or `gluteMeasurements` · **severity: low, `plan-local`**

Milder version of Pencilneck's T-13 (there, an explicit status-reset claim
was contradicted; here, there's no status object to contradict, so this is
a quieter gap). "Reset Current Progress" leaves both history arrays
intact, continuing to feed Paused Squat's 80%-of-squat calculation and the
glute trend chart after a reset.

### 3.3 No dead-feature pattern anywhere in this plan · **severity: none (positive finding)**

First Wave-3 plan (5th overall in the wave) with zero instances of the
T-10/T-15/T-18/T-20 pattern. Both tracking mechanisms are genuinely real,
wired, and payoff-complete (badges compute from the same data the widgets
display). This breaks a four-plan streak.

### 3.4 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| "Weekly Glute Tracker" widget | — | Confirmed present and functional |
| "Squat" tracked-lift widget | — | Confirmed present, matching the automated `squatHistory` mechanism |
| "Feeling Froggy" mascot copy | — | Confirmed rendering at week 1 (mascot swaps to Peachy at week 5+, source-confirmed, not independently re-verified live at week 5) |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 4. Weekly volume (base weeks 1-8, 64 sets/week)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Glute max (lower)** | **24.25** | | Hamstrings (biceps femoris) | 15.0 |
| Hamstrings (semiMemb/Tend) | 13.0 | | Quads (3 heads) | 11.5 each |
| Adductors | 11.5 | | **Glute max (upper)** | **11.0** |
| Erectors | 10.0 | | Glute medius | 8.0 |
| Gastrocnemius | 7.5 | | Abdominal wall | 6.0 |
| Front delt / rear delt | 5.5 each | | Trap (mid) | 4.5 |

All 24 slots resolved to attribution rows — no missing data.

### The glute-head breakdown (the plan's own core question)

| Head | Sets | Share |
|---|---|---|
| Glute max (lower) | 24.25 | ~69% |
| Glute max (upper) | 11.0 | ~31% |
| Glute medius (separate) | 8.0 | — |

Combined glute-region volume (43.25 fractional sets/week) is genuinely
high — well above both hamstrings (28.0) and quads (36.75+2.25 rectus
femoris) — so the aggregate "glute specialization" claim holds. But the
composition is lower-glute/long-length dominant: outside Kas Glute Bridge
(short-ROM, top-range only) and the single-leg hip thrust, there's no
dedicated peak-contraction glute driver, and the attribution map's own
`hip-thrust` row (bilateral machine, used on 4 other plans in the
portfolio) is notably absent here — the natural lead exercise for a card
built around glute specialization.

---

## 5. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **103** |
| Axial | **34** |
| Sets | 64 |
| Per-set systemic | **1.61** |

Highest per-set systemic cost of any Wave 3 plan audited so far (Overhead
Dominion 1.43, Arms Race 1.34, Hamstring Foundry 1.52, Quadfather 1.49,
Cathedral 1.51) — driven by three separate hinge/squat-pattern compounds
across two of the four days (Sumo Deadlift, Squats, DB RDL, Paused Squat),
each carrying genuine axial cost. Appropriate for a lower-body
specialization plan, though worth noting alongside §3.1: much of that
systemic cost is being spent on long-length glute stimulus via squat/hinge
patterns rather than being split with a dedicated short-length driver.

---

## 6. Improvements, ranked

### 1. Add a bilateral loaded hip thrust as a genuine lead lift · `plan-local` (`hypothesis`)

Swapping Wednesday's Kas Glute Bridge (or adding a slot) for a barbell or
machine hip thrust would meaningfully close the gluteMaxUpper gap and give
the plan the signature movement its "science-based" framing implies is
present. This is the single highest-impact change available for this
plan's own stated goal.

### 2. Clear `squatHistory` and `gluteMeasurements` on reset · `plan-local`

Milder analog to T-13 — add both arrays to whatever reset path handles
Peachy, so "Reset Current Progress" doesn't leave stale data feeding the
Paused Squat load calc and trend chart.

### 3. Consider moving the Single-Leg Machine Hip Thrust earlier in the week · `plan-local` (`hypothesis`)

Currently the week's only true hip-thrust-pattern exercise lands on
Saturday, the last training day — worth considering whether an earlier
placement (fresher CNS/glute state) would let it be loaded more
aggressively, especially if improvement #1 isn't adopted and this remains
the plan's primary short-length driver.

---

## 7. Verdict

**Peachy is Wave 3's strongest showing on engineering integrity — no
dead features, no status-object gaps, no wave-math or duplicated-slot
exposure, and two genuinely real tracking mechanisms with live badge
payoffs — but its actual exercise selection has a real, checkable gap
against the "science-based" framing on its own card.**

This is the first Wave-3 plan to break the four-plan dead-feature streak
(Overhead Dominion, Hamstring Foundry, Quadfather, Cathedral), and it does
so cleanly: both the glute-circumference tracker and the squat-history
mechanism are fully wired, write real data, and pay off in real badges —
not just rendered widgets showing static fallbacks. The plan's one genuine
weakness is structural rather than a wiring defect: a glute specialization
plan built without a bilateral loaded hip thrust anywhere in its four days
is missing the single most literature-associated glute-max exercise,
leaving the plan's volume profile skewed toward long-length stimulus
(squats, hinges, lunges) at the expense of the short-length/peak-contraction
work a "science-based" glute plan would typically foreground. The aggregate
glute volume is genuinely high — this isn't a plan that fails to train
glutes — but an athlete expecting hip-thrust-led programming based on
current research citations would find something structurally different
from what the card's framing suggests.

---

## 8. Export block

```yaml
id: peachy-glute-plan
version: 2
length: { weeks: 12, phases: [base_1to8, intensification_9to12] }
frequency: 4_per_week
weekly_sets: { base: 64 }
kind: specialisation_glutes
calibration: none
engine: bespoke_procedural_per_week_generation
systemic_load: { weekly: 103, axial: 34, sets: 64, per_set: 1.61 }
volume_top: { gluteMaxLower: 24.25, bicepsFemoris: 15.0, semiMembTend: 13.0, vastusLateralis: 11.5, vastusMedialis: 11.5 }
glute_head_split: { lower: 24.25, upper: 11.0, medius: 8.0, ratio_lower_to_upper: "2.2:1" }
absent_bug_patterns: [T1_T2_no_status_object, wave_progression_bug, T14_no_wave_technique_used, T4_procedural_generation_immune, reverse_nordic_curl_misattribution, dead_feature_pattern]
positive_findings:
  - "glute_tracker widget genuinely wired — real Firestore write, real trend chart, real badge payoff (glute_gainz_queen, >=3cm growth)"
  - "squatHistory mechanism genuinely wired — real automated progression feeding Paused Squat's 80%-of-squat load calc, real badge payoff (Squat +30kg)"
  - "breaks the four-plan Wave-3 dead-feature streak (Overhead Dominion T-14/T-15, Hamstring Foundry T-17, Quadfather T-18/T-19, Cathedral T-20)"
plan_local_gap:
  area: "no bilateral loaded hip thrust anywhere in the 4-day split"
  detail: "gluteMaxLower (24.25 sets/wk) outweighs gluteMaxUpper (11.0 sets/wk) roughly 2.2:1; only short-length glute driver is a 3-set unilateral machine hip thrust (Saturday, last training day) plus a short-ROM Kas Glute Bridge"
  framing: "the attribution map's own hip-thrust row, used on 4 other plans in the portfolio, is notably absent here — the natural lead exercise for a glute-specialization card"
minor_gap: "resetProgram() doesn't clear squatHistory or gluteMeasurements, milder analog to Pencilneck's T-13 since there's no status object to contradict"
audit: { date: 2026-08-15, findings: 3, verdict: "cleanest engineering integrity in Wave 3 — no dead features anywhere — but a real structural gap between the 'science-based' framing and the actual absence of a bilateral hip-thrust lead lift" }
```
