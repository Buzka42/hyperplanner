# Tenfold

> Unified plan document, v2 format. Supersedes `docs/plans/tenfold.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `tenfold` |
| **Length** | 8 weeks (Ten Sets 1-5, Consolidation 6-8) |
| **Frequency** | 4 days/week (Chest / Quad / Back / Hamstring, Mon/Tue/Thu/Fri) |
| **Weekly sets** | 95 (weeks 1-5), 56 (weeks 6-8) |
| **Declared kind** | hypertrophy, German Volume Training derivative |
| **Calibration** | none |
| **Source** | `src/data/plans/tenfold.ts` (105 lines, `definePlan()`-based day/phase structure) + `src/features/workout/progression/tenfold.ts` (30 lines, **bespoke** progression handler — a hybrid of the generic engine and a dedicated handler, unlike Monolith/Purgatorio/Event Horizon) |
| **Stated promise** | *"Ten sets of ten on exactly one lift per session, never two. Hold the load until all ten sets hit ten. Back half trades a set for load."* |

---

## 1. Headline finding

**The core 10×10 mechanic and its gated progression are both correctly and carefully implemented — Tenfold is the first plan in the audit where every literal claim on the card checks out exactly as written. The one real gap is that "back half trades a set for load" substantially understates what the Consolidation phase actually does to accessory volume.**

**"Exactly one lift per session, never two"** — confirmed in source (each `DaySpec`
has exactly one `tenfold(ex)` slot, always listed first) and live: Week 5's
Chest Tenfold session rendered "Hammer Chest Press — 10 sets × 10 reps" as
the only 10-set slot, with four 2-set accessory slots after it.

**"Hold the load until all ten sets hit ten"** — this is genuine gated
double progression, not generic set-completion logic:

```js
const complete = sets.length >= main.sets &&
    sets.every(set => Number(set.reps) >= Number(main.target.reps.split('-')[0] || 10));
const next = collapse ? Math.round((load * 0.9) / 2.5) * 2.5 : complete ? load + 2.5 : load;
```

`complete` requires the full set count **and every single completed set**
to clear the rep floor before `load += 2.5` fires — a stricter and more
correct implementation than a naive "any set hit target → bump" pattern
would be. There's also an undocumented safety mechanic: if any of the first
5 sets falls to ≤7 reps, load drops 10% (rounded to the nearest 2.5) and
`tenfoldStatus.collapsePending` is set — a real auto-deload the plan card
and original doc never mention.

**"Back half trades a set for load" undersells the actual change.** The
Consolidation transform:

```js
transform: slot =>
    slot.sets === 10
        ? { ...slot, sets: 5, reps: '10', notes: 'Consolidation: 5×10. Add 5–7.5% to the tenfold load.' }
        : { ...slot, sets: 2, technique: { kind: 'last-set-failure' as const } },
```

applies to **every slot in the day**, not just the main lift — every
accessory, regardless of its original set count (2, 3, or 4), gets
collapsed to exactly 2 sets. Combined with the main lift dropping 10→5,
total weekly volume falls from **95 to 56 sets — a 41% cut**, not "a set
traded for load" on one exercise. Neither the plan card, the EN/PL
onboarding copy, nor the original doc mentions that non-main-lift volume is
roughly halved across the board in weeks 6-8. This is a real, if
non-critical, mismatch between what the plan claims and what it delivers —
the mechanic itself is reasonable programming (GVT genuinely can't run
10×10 for 8 straight weeks, and trimming accessories while the main lift
consolidates is defensible), it's just not what "trades a set for load"
communicates to an athlete reading the card.

**One more gap:** the Consolidation notes text promises *"Add 5-7.5% to
the tenfold load,"* but the progression handler still only ever adds a flat
`+2.5` on a `complete` week — the same increment used in weeks 1-5. The
5-7.5% figure in the UI-facing notes has no corresponding code path; it's
copy that was never wired to the actual progression math.

---

## 2. Structure

### Weekly template (Ten Sets phase, weeks 1-5, 95 sets)

| Day | Sets | Main lift (10×10) | Accessories |
|---|---|---|---|
| Chest Tenfold | 18 | Hammer Chest Press | Hammer Upper Row 2, Cable Lateral Raise 2, Cable Tri Ext 2, Cable Curl 2 (all last-set-failure) |
| Quad Tenfold | 24 | Hack Squat | Seated Ham Curl 4, Standing Calf Raise 4, Cable Crunch 3, Pec Deck 3 |
| Back Tenfold | 23 | Hammer Lower Row | Incline DB Bench 4, Rear Delt Fly 3, DB Hammer Curl 3, Rope Pressdown 3 |
| Hamstring Tenfold | 30 | Seated Ham Curl | Heel-Elevated Goblet Squat 4, Hip-Supported DB Deadlift 3, Standing Calf Raise 4, Ab Wheel 3, Lat Pulldown 3, Seated DB Lateral Raise 3 |

Deliberate design note preserved in-source (`tenfold.ts:47-48`, `:74`): Quad
day's Pec Deck and Hamstring day's Lat Pulldown/Lateral Raise exist
specifically to give chest and back/shoulders a second weekly exposure
around their single-muscle-focus days — a genuine, stated design
consideration, confirmed present in both day definitions.

### Consolidation phase (weeks 6-8, 56 sets)

| Day | Sets | Main lift (5×10) | Accessories (all → 2 sets, last-set-failure) |
|---|---|---|---|
| Chest Tenfold | 13 | Hammer Chest Press | 4 slots × 2 |
| Quad Tenfold | 13 | Hack Squat | 4 slots × 2 |
| Back Tenfold | 13 | Hammer Lower Row | 4 slots × 2 |
| Hamstring Tenfold | 17 | Seated Ham Curl | 6 slots × 2 |

### `xStatus`, T-2, T-3, T-4, reverse-nordic

- **`tenfoldStatus: { collapsePending?: boolean }`** exists (`types.ts:395`)
  — Tenfold has real plan-specific status, unlike Monolith/Purgatorio/Event
  Horizon.
- **T-2 confirmed present:** `tenfoldStatus` is absent from both
  `UserContext.tsx`'s reset allowlist (`:468-470`) and registration merge
  (`:365-367`) — "Reset Current Progress" will not clear
  `tenfoldStatus.collapsePending`, contradicting the button's copy. Narrow
  blast radius (one boolean flag) but the same bug pattern as Bench
  Domination/Pencilneck/Skeleton's inverse.
- **No `type: 'wave'` progression** (day/phase structure uses the generic
  `definePlan()` transform architecture) — not exposed to T-3.
- **No duplicated exercise definitions** — each day/slot defined once;
  week-to-week variation comes entirely from the single `transform`
  function. Not exposed to T-4.
- **No `reverse-nordic-curl`** anywhere in the plan.

This makes Tenfold a genuine hybrid: **generic day/phase architecture**
(immune to T-3/T-4, same as Monolith/Purgatorio/Event Horizon) **plus a
bespoke progression handler** (exposed to T-2, unlike those three). Useful
data point — the "generic engine is safer" pattern from `_audit-decisions.md`
§0c holds specifically for the day/phase-transform layer, not for whether a
plan has its own status object; those are independent axes.

---

## 3. Findings

### 3.1 Consolidation phase cuts total volume 41%, not "a set for load" · **severity: medium, `plan-local`**

Detailed in §1. Genuine finding, not critical — the design itself is
reasonable, but the card/onboarding copy doesn't communicate the scale of
the change.

### 3.2 Consolidation notes promise 5-7.5% load increase; code delivers flat +2.5 · **severity: low, `plan-local`**

The in-session notes text (`'Consolidation: 5×10. Add 5–7.5% to the tenfold
load.'`) is user-facing copy with no corresponding progression-handler
logic — `tenfoldProgression` uses the same `load + 2.5` regardless of
phase. An athlete following the notes literally would add more than the
system actually applies automatically, creating a mismatch between advice
text and auto-progression.

### 3.3 Undocumented auto-deload mechanic · **severity: none (positive finding, but undocumented)**

`collapse = sets.slice(0, 5).some(set => Number(set.reps) <= 7)` triggers a
10% load cut if any of the first 5 sets falls to ≤7 reps — a real,
sensible safety valve neither the plan card, onboarding copy, nor the
original doc mentions. Not a bug; worth surfacing in the plan's own UI copy
so an athlete who sees a weight drop mid-block understands why.

### 3.4 `resetProgram()` allowlist gap · **severity: low, `shared-bug`**

`tenfoldStatus` missing from both allowlists (§2 above) — same T-2 pattern,
narrow practical impact given the status object is a single boolean.

### 3.5 Plan-switch bug (T-9) reproduces a fourth time · **severity: high, `shared-bug`**

Continuing the `test_claude` session from Event Horizon's stale week 5,
switching into Tenfold again showed "NEXT SESSION — WEEK 5 — Chest Tenfold
· Ten Sets" — fourth consecutive Wave-2 reproduction of the same
`Dashboard.tsx:79` mechanism. Not independently re-verified against
Firestore this time (root cause and mechanism already conclusively
established across three prior plans); live dashboard text alone is
sufficient confirmation at this point.

### 3.6 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| 10×10 rendering | — | Exactly one 10-set/10-rep slot, tempo `4:0:X:0`, rest 90s, "Hold the load until all ten sets reach ten reps" note — all matching source exactly |
| Accessory last-set-failure | — | "Last set to failure" + "TO FAILURE" badge correctly rendered on set 2 of every accessory slot |
| Extra second-exposure slots | — | Pec Deck (Quad day) and Lat Pulldown/Lateral Raise (Hamstring day) render correctly as ordinary accessory slots, matching the stated design intent |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 4. Weekly volume

### Ten Sets phase (weeks 1-5, 95 sets)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Biceps femoris / semiMembTend | 17.0 each | | Pec (lower) | 15.0 |
| **Quads (3 heads)** | **14.0 each** | | Teres major | 13.0 |
| Lats (lower) | 12.25 | | Gastrocnemius | 11.5 |
| Triceps (lateral/medial) | 11.0 each | | Pec (upper) | 10.5 |
| Rhomboids | 10.0 | | Glute max (lower) | 10.0 |
| Trap (mid) | 9.5 | | Biceps (long) | 9.5 |
| Front delt | 7.75 | | Abs (upper) | 6.0 |
| Brachialis | 5.5 | | Rear delt / side delt | 5.0 each |
| Abdominal wall | 5.0 | | Abs (lower) | 4.5 |
| Lats (upper) / soleus | 4.0 each | | Triceps (long) | 3.75 |
| Adductors / forearm flexors | 3.5 each | | Biceps (short) | 3.05 |

### Consolidation phase (weeks 6-8, 56 sets)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Biceps femoris / semiMembTend | 9.0 each | | Pec (lower) | 8.0 |
| **Quads (3 heads)** | **7.0 each** | | Teres major | 7.0 |
| Triceps (lateral/medial) | 6.5 each | | Rhomboids / lats (lower) | 6.5 each |
| Trap (mid) / biceps (long) | 6.0 each | | Gastrocnemius | 5.75 |
| Pec (upper) / glute max (lower) | 5.5 each | | Front delt | 4.25 |
| Rear/side delt/brachialis/abs upper | 4.0 each | | Lats (upper)/triceps long/abs lower/abdominal wall | 3.0 each |

All 20 distinct exercise ids resolved to attribution rows — no missing-data
caveats. The Ten Sets phase clears 5+ fractional sets/week on nearly every
major muscle; hamstrings (both heads, from the 10-set main lift on
Hamstring day plus the 4-set accessory on Quad day) and quads are the
standout, unsurprising given both get a genuine 10-set exposure somewhere
in the week. `rectusFemoris` (2.5→1.25) and `erectors` (0.75→0.5) are the
thinnest dimensions — both are already known library-wide thin-coverage
muscles per the attribution map's §25, not a Tenfold-specific gap.
Consolidation-phase numbers scale down almost uniformly (~41% cut across
the board, consistent with §3.1's set-count finding), rather than
concentrating the cut on any particular muscle group.

---

## 5. Systemic and joint load

| Metric | Ten Sets (95 sets) | Consolidation (56 sets) |
|---|---|---|
| Systemic | **136** | **78** |
| Axial | **31** | **16** |
| Per-set systemic | **1.43** | **1.39** |

Per-set systemic cost stays roughly constant across phases (as with
Purgatorio) — the total load swing tracks the 41% set-count cut almost
exactly. Highest total weekly systemic load of any Wave 2 plan audited at
full volume (Ten Sets phase: 136, vs. Purgatorio's Accumulation-week 151 —
actually slightly below Purgatorio, but well above Monolith's 103 and Event
Horizon's 108), driven by two 10-set lifts a week each carrying real
systemic cost (Hack Squat, and the second hamstring-focus 10-set day).

---

## 6. Improvements, ranked

### 1. Update the "back half trades a set for load" claim to reflect the actual accessory cut · `plan-local`

Either state the real numbers (95→56 sets, a 41% volume cut across
accessories, not just the main lift) in the onboarding copy, or reconsider
whether cutting every accessory to a flat 2 sets is the intended design —
if it is, it deserves to be named accurately rather than undersold as "a
set traded for load."

### 2. Wire the 5-7.5% Consolidation load bump, or correct the notes text · `plan-local`

The progression handler still applies a flat +2.5 during Consolidation
weeks; either implement the percentage-based bump the notes promise, or
change the notes to describe the flat increment that's actually applied.

### 3. Surface the auto-deload mechanic in the plan's UI copy · `plan-local` (`hypothesis`)

The 10%-cut-on-collapse safety valve is a real, sensible design already
shipped — it just isn't explained anywhere the athlete can see it. A short
note ("if your first 5 sets can't hold 8+ reps, load drops 10% next
session") would turn a potentially confusing surprise into a stated,
trusted feature.

### 4. Fix the `resetProgram()` allowlist gap · `shared-bug`

Add `tenfoldStatus` to both `UserContext.tsx` allowlists (T-2), same as the
other `xStatus`-bearing plans.

### 5. Namespace the dashboard view-week cache by program · `shared-bug`

Same T-9 recommendation as every other Wave-2 plan — fourth confirmation.

---

## 7. Verdict

**Tenfold is the most faithfully-implemented plan audited so far — its
central, very specific mechanical claim ("ten sets of ten, exactly one lift
per session, hold the load until all ten hit ten") is programmed exactly as
described, with genuinely correct gated double progression and a
thoughtful, if undocumented, auto-deload safety valve.**

Every literal sentence on the plan card checks out under live verification:
one 10×10 lift per session (never two, confirmed by construction), a
progression handler that requires every one of the ten sets to clear the
rep floor before adding load (not a naive any-set trigger), and a real
Consolidation-phase change in the back half. The only place the plan
undersells or oversells itself is scope: "trades a set for load" is a much
smaller claim than the actual 41% total-volume cut across every accessory
slot, and the notes text's "5-7.5%" load bump has no corresponding code.
Both are minor, plan-local documentation gaps rather than functional
defects — the mechanics an athlete actually trains under are sound, gated
correctly, and match the spirit of German Volume Training's most important
constraint: the load does not move until the tenth set proves it's earned.

---

## 8. Export block

```yaml
id: tenfold
version: 2
length: { weeks: 8, phases: [ten_sets_1to5, consolidation_6to8] }
frequency: 4_per_week
weekly_sets: { ten_sets: 95, consolidation: 56 }
kind: hypertrophy_gvt
calibration: none
engine: definePlan_generic_days_bespoke_progression_handler
status_field: tenfoldStatus
systemic_load:
  ten_sets: { weekly: 136, axial: 31, sets: 95, per_set: 1.43 }
  consolidation: { weekly: 78, axial: 16, sets: 56, per_set: 1.39 }
volume_ten_sets_top: { bicepsFemoris: 17.0, semiMembTend: 17.0, pecLower: 15.0, vastusLateralis: 14.0 }
absent_bug_patterns: [wave_progression_bug, duplicated_exercise_definitions, reverse_nordic_curl_misattribution]
present_bug_patterns: [resetProgram_allowlist_gap]
progression_verification:
  gated_double_progression: "confirmed correct — complete requires ALL sets to hit rep floor, not any-set (progression/tenfold.ts:11)"
  undocumented_auto_deload: "10% cut if any of first 5 sets <=7 reps, sets tenfoldStatus.collapsePending — real, not mentioned anywhere in UI copy"
doc_code_mismatch:
  - area: "'back half trades a set for load' card claim"
    detail: "actual effect is a 41% total weekly volume cut (95->56 sets) — every accessory slot collapses to 2 sets regardless of original count, not just the main lift losing sets"
  - area: "Consolidation notes text '5-7.5%' load increase"
    detail: "progression handler still applies flat +2.5 regardless of phase — notes promise a bump the code never implements"
shared_bug_gaps:
  T9_plan_switch: "reproduces a fourth consecutive Wave 2 plan"
  T2_resetProgram_allowlist: "tenfoldStatus missing from both allowlists, narrow blast radius (single boolean)"
audit: { date: 2026-08-14, findings: 6, verdict: "most faithfully-implemented headline mechanic in the audit so far; two minor plan-local doc/code mismatches, otherwise clean" }
```
