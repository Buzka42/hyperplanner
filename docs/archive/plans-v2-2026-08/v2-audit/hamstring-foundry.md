# Hamstring Foundry

> Unified plan document, v2 format. Supersedes `docs/plans/hamstring-foundry.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `hamstring-foundry` |
| **Length** | 10 weeks (Forging 1-5, Tempering 6-10) |
| **Frequency** | 4 days/week, hamstrings 3x |
| **Weekly sets** | 79, constant across all 10 weeks |
| **Declared kind** | specialisation, hamstrings |
| **Calibration** | none |
| **Source** | `src/data/plans/hamstringFoundry.ts` (125 lines, `definePlan()`-based) |
| **Stated promise** | *"10 weeks of hamstring specialisation through three different functions, all of which must progress... Four-second eccentrics during the accumulation block."* |

---

## 1. Headline finding

**"Three different functions, all of which must progress" is only one-third true at the engine level — only the hinge function (RDL) has any actual progression logic or dashboard tracking; the other two "functions" run as ordinary unprogressed accessories.**

The function-to-exercise mapping itself is real and correctly attributed:

| Function | Exercise | Attribution |
|---|---|---|
| Hinge strength | `barbell-romanian-deadlift` | `pattern: 'hinge'`, correctly filed |
| Knee flexion | `seated-ham-curl` | `pattern: 'knee-flexion'`, correctly filed |
| Lengthened control | `hip-supported-db-deadlift` | `pattern: 'hinge'`, correctly filed |

But **only the RDL carries a `progression` field anywhere in the file**:
`{ type: 'double', increment: 5 }` (`hamstringFoundry.ts:27`). Neither
`seated-ham-curl` nor `hip-supported-db-deadlift` has any `progression`
field on any of their slots, in either phase. The hip-supported DB
deadlift's `notes` field describes an elaborate manual progression ladder
("3s eccentric → 4s → pause in the stretch → 1.5 reps → extra reps") — but
this is prose only, never implemented as code, identical in kind to
Tenfold's unwired 5-7.5% Consolidation note (though there the base mechanic
at least worked; here there's no automated mechanic for this exercise at
all). `seated-ham-curl` gets a rep-range shift and tempo toggle between
phases (a real, if partial, form of progression via rep target), but no
load-tracking of any kind.

**Confirmed live**: the dashboard's "WORKOUT HISTORY" strength chart is
labeled simply **"RDL"** — `trackedLiftFor()` (`trackedLift.ts:28-29`)
surfaces only `barbell-romanian-deadlift` for this plan. There is no
comparable chart, tracked lift, or history for `seated-ham-curl` or
`hip-supported-db-deadlift` anywhere in the app. An athlete following the
"knee flexion" or "lengthened control" function has literally nothing
tracking their progress on either one — no chart, no logged working-weight
history, nothing beyond the generic per-set weight/reps entry every
exercise gets. This is exactly the "one tracked lift, two generic
accessories" failure mode the audit has been watching for since Wave 1's
powerlifting plans (where it was at least honest about tracking only one
lift) — here the card explicitly promises all three functions "must
progress," which the engine doesn't back up for two of the three.

---

## 2. "Four-second eccentrics during the accumulation block" — confirmed true, correctly phase-bound

```ts
{ name: 'Forging', weeks: [1,2,3,4,5],
    transform: slot => (slot.ex.includes('ham-curl') ? { ...slot, tempo: '40X0' } : slot) },
```

The substring match on `'ham-curl'` is precise: it catches both
`seated-ham-curl` occurrences (Day 1 and Day 2) but correctly excludes
`single-leg-hamstring-curl` (id lacks the hyphen the match requires) and
`hip-supported-db-deadlift` — the tempo prescription is specifically about
the knee-flexion function, matching the plan's own framing.

**Confirmed live**: Week 1 (Forging) rendered "TEMPO 4:0:X:0" on Seated Ham
Curl; Week 8 (Tempering) rendered the same exercise with **no tempo line at
all** — exactly matching the Tempering-phase transform, which clears
`tempo: undefined` and drops reps to `6-10`. This claim survives live
verification without qualification, standing in contrast to §1's finding
on the same plan.

---

## 3. Structure

### Weekly template (constant across all 10 weeks, 79 sets)

| Day | Sets | Key work |
|---|---|---|
| Heavy Hip Extension | 21 | Barbell RDL 4×5-8 (double +5kg), Seated Ham Curl 4×8-12 (4s tempo, Forging), Flat DB Press 3, Hammer Upper Row 3, Cable Lateral Raise 3, Cable Curl 2 (last-set-failure), Rope Pressdown 2 (last-set-failure) |
| Knee Flexion + Quads | 19 | Seated Ham Curl 4×8-12 (4s tempo, Forging), Goblet Skater Squat 3 (per side), Sissy Squat 3, Pull-up 3, Hammer Chest Press 3, Standing Calf Raise 3 |
| Upper Dominant | 20 | Incline DB Bench 4, Hammer Lower Row 4, Lat Pulldown 3, Seated DB Shoulder Press 3, Rear Delt Fly 2 (last-set-failure), DB Hammer Curl 2 (last-set-failure), Cable Tri Ext 2 (last-set-failure) — no hamstring work, by design, matching the card's "one upper day... to recover" claim |
| Lengthened Hamstrings | 19 | Hip-Supported DB Deadlift 4×10-15 (no progression field), Single-Leg Hamstring Curl 3, Heel-Elevated Goblet Squat 3, Standing Calf Raise 3, Ab Wheel 3, Pec Deck 3 |

Confirmed live: Upper Dominant day (dow 4) has zero hamstring-primary
exercises, matching the card's claim exactly.

### `xStatus`, T-2, T-3, T-14, T-4, reverse-nordic

- **No `hamstringFoundryStatus` anywhere** — structurally immune to
  T-1/T-2, same as Monolith/Purgatorio/Overhead Dominion/Arms Race's
  no-status-object class.
- **No `type: 'wave'` and no `technique: {kind: 'wave'}`** anywhere in the
  file — not exposed to T-3 or T-14 (no wave claim on the card, and none in
  code, unlike Overhead Dominion where the claim existed but the wiring
  didn't).
- **`reverse-nordic-curl` is not used anywhere in this plan.** This is the
  single most important absence to confirm for a hamstring specialization
  plan — the misattribution (filed as hamstring/knee-flexion but
  mechanically a quad/knee-extension movement) has already corrupted Bench
  Domination's and Quadfather's volume claims. Hamstring Foundry's actual
  knee-flexion exercises (`seated-ham-curl`, `single-leg-hamstring-curl`)
  are both correctly attributed to hamstrings in the library. Its quad work
  (`sissy-squat`, `goblet-skater-squat`) is separately and correctly filed
  as quad-primary. This plan dodges the single worst-case bug it could have
  had.
- **T-4 watch item, not yet a bug:** `seated-ham-curl` is defined twice
  (Day 1, Day 2) as independent literals — currently byte-identical in
  effect (Day 2 hardcodes `tempo: '40X0'` on the slot itself, which the
  phase transform would also apply, so both stay in sync automatically
  today). This is the same *shape* as Bench Domination's fatal duplicated-
  definition bug, just not yet drifted — worth flagging as a standing risk
  since any future edit to only one copy would silently reintroduce a real
  divergence.

---

## 4. Findings

### 4.1 Two of three "functions" have no progression tracking · **severity: high, `plan-local`**

Detailed in §1. The plan's single most significant finding — its own
headline claim about equal function-progression isn't backed by the engine
for 2/3 of the named functions.

### 4.2 "Three functions" are not equally dosed — 4:8:4, not 1:1:1 · **severity: low, `plan-local`**

`seated-ham-curl` (knee flexion) appears on two separate days for a
combined 8 sets/week, versus 4 sets/week each for the RDL (hinge) and
hip-supported DB deadlift (lengthened control). The card doesn't claim
equal dosing explicitly, but "three different functions, all of which must
progress" reads as parallel treatment, and the actual volume split is
2x weighted toward knee flexion. Not a defect — likely deliberate, since
knee flexion is a commonly under-trained hamstring function relative to
hinge work in most programs — but worth naming explicitly rather than
leaving as an implicit 4:8:4 split a reader wouldn't infer from the card.

### 4.3 Four-second eccentric tempo — confirmed correct · **severity: none (positive finding)**

Detailed in §2. Precisely scoped, phase-bound, and confirmed live in both
directions (present in Forging, absent in Tempering).

### 4.4 No `reverse-nordic-curl` exposure · **severity: none (positive finding)**

The single most important absence for this specific plan, given the
misattribution's track record on other leg-training plans. Confirmed clean.

### 4.5 Plan-switch bug (T-9) reproduces an eighth time · **severity: high, `shared-bug`**

Fresh Hamstring Foundry registration (continuing the `test_claude` session
from Arms Race's clamped week 8) showed "NEXT SESSION — WEEK 8 — Heavy Hip
Extension · Tempering" — eighth consecutive plan across Waves 2-3 with the
identical mechanism.

### 4.6 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| 4s tempo present/absent correctly by phase | — | Confirmed at Week 1 vs Week 8 |
| Only "RDL" tracked lift shown | High | Confirms §4.1 — no equivalent chart for the other two functions |
| Upper Dominant day genuinely hamstring-free | — | Confirmed matching the "recover" claim |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 5. Weekly volume (constant across all 10 weeks, 79 sets)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Hamstrings (2 heads)** | **19.0 each** | | Glute max (lower) | 11.0 |
| Pec (lower) | 11.0 | | Front delt | 10.75 |
| Teres major | 10.0 | | Triceps (lateral/medial) | 9.5 each |
| Quads (3 heads) | 9.0 each | | Rhomboids | 9.0 |
| Lats (lower) | 8.75 | | Gastrocnemius | 8.75 |
| Pec (upper) | 8.5 | | Abdominal wall | 8.25 |
| Biceps (long) | 7.75 | | Lats (upper) | 7.5 |
| Trap (mid) | 6.75 | | Forearm flexors | 6.5 |

All 15 distinct exercises resolved to attribution rows — no missing data.

### The "three functions" broken down by actual hamstring contribution

| Function | Exercise | Sets/wk | Biceps femoris | SemiMemb/Tend |
|---|---|---|---|---|
| Hinge | Barbell RDL | 4 | 4.0† | 4.0† |
| Knee flexion | Seated Ham Curl (both days) | 8 | 8.0† | 8.0† |
| Lengthened control | Hip-Supported DB Deadlift | 4 | 4.0† | 4.0† |
| **Subtotal** | | **16** | **16.0** | **16.0** |

(All three loaded at length, `†`, per the attribution map's convention —
worth noting that the plan's "three functions" are differentiated by joint
action, not by stretch position, since all three already sit in the
stretched-position bucket.) The remaining 3.0 of each hamstring head's 19.0
weekly total comes from Single-Leg Hamstring Curl (Day 4) — additional
knee-flexion volume, not a fourth named function. Glute contribution
(11.0 total) comes almost entirely from the two deadlift-pattern exercises
(8.0 combined) plus the two squat-pattern accessories (1.5 each);
`seated-ham-curl` contributes zero glute, consistent with it being a pure
knee-flexion isolation movement.

---

## 6. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **120** |
| Axial | **28** |
| Sets | 79 |
| Per-set systemic | **1.52** |

Mid-pack axial load among Wave 2/3 plans, driven by the two hinge-pattern
compounds (RDL, hip-supported DB deadlift) plus the two squat-pattern
accessories — appropriate for a plan whose specialization is built around
hip-hinge-family movements.

---

## 7. Improvements, ranked

### 1. Add real progression tracking for the other two functions · `plan-local`

Give `seated-ham-curl` and `hip-supported-db-deadlift` genuine `progression`
fields (even simple double progression) and add both to `trackedLift.ts`'s
dashboard chart, so the card's "all of which must progress" claim is
actually backed by the engine for all three functions, not just the hinge.
This is the plan's most impactful available fix.

### 2. Wire the hip-supported DB deadlift's notes-only progression ladder, or simplify the notes · `plan-local`

The elaborate manual tempo/pause/rep ladder described in the exercise's
`notes` field has no code behind it — either implement it as an actual
phase-driven progression (consistent with how the rest of the plan already
uses phase transforms), or simplify the coaching cue to something an
athlete can follow without expecting automated tracking that doesn't exist.

### 3. Name the 4:8:4 volume split explicitly in the onboarding copy · `plan-local` (`hypothesis`)

"Three different functions" reads as parallel treatment; stating the
actual emphasis (knee flexion at double the volume of the other two) would
set correct expectations, especially for an athlete who came to the plan
specifically wanting balanced hinge/flexion/lengthened work.

### 4. Merge the two `seated-ham-curl` slot definitions into a single source · `plan-local` (`hypothesis`)

Preemptive fix for the T-4-shaped risk in §3 — extract a shared slot
builder so Day 1 and Day 2's copies can't independently drift the way Bench
Domination's Weighted Pull-ups did.

### 5. Namespace the dashboard view-week cache by program · `shared-bug`

Same T-9 recommendation as every prior plan — eighth confirmation.

---

## 8. Verdict

**Hamstring Foundry gets its safest and most specific claim exactly
right — no `reverse-nordic-curl` exposure, and a precisely phase-bound
four-second-eccentric tempo confirmed live in both directions — but its
headline structural promise ("three functions, all of which must progress")
is only a third true at the engine level.**

The exercise selection and function-to-movement mapping are genuinely
sound: hinge, knee flexion, and lengthened control are real, distinct
biomechanical functions, correctly attributed in the library, and
thoughtfully arranged around a hamstring-free recovery day. But an athlete
who reads "all of which must progress" and expects three tracked lifts gets
one — the RDL is the only function with an automated progression rule and
the only one with a dashboard chart. The other two functions are
well-chosen accessories dressed in specialization-plan framing, not
independently progressed pillars of the program. This is a smaller-scale,
plan-local version of the pattern the audit has now seen in different forms
across Event Horizon (dead swap engine), Overhead Dominion (decorative wave
label, dead delt-split tracking), and here: a specific, appealing mechanical
claim on the card that the actual engine only partially delivers.

---

## 9. Export block

```yaml
id: hamstring-foundry
version: 2
length: { weeks: 10, phases: [forging_1to5, tempering_6to10] }
frequency: 4_per_week
weekly_sets: { constant_all_10_weeks: 79 }
kind: specialisation_hamstrings
calibration: none
engine: definePlan_generic
systemic_load: { weekly: 120, axial: 28, sets: 79, per_set: 1.52 }
volume_top: { bicepsFemoris: 19.0, semiMembTend: 19.0, gluteMaxLower: 11.0, pecLower: 11.0 }
three_functions_breakdown:
  hinge: { exercise: barbell-romanian-deadlift, sets: 4, progression: "double +5kg", tracked: true }
  knee_flexion: { exercise: seated-ham-curl, sets: 8, progression: none, tracked: false }
  lengthened_control: { exercise: hip-supported-db-deadlift, sets: 4, progression: "notes-only, unwired", tracked: false }
absent_bug_patterns: [T1_T2_no_status_object, wave_progression_bug, T14_no_wave_technique_used, reverse_nordic_curl_misattribution]
watch_item:
  area: "seated-ham-curl defined twice (Day 1, Day 2) as independent literals"
  detail: "currently byte-identical in effect, not yet drifted — same shape as Bench Domination's fatal duplicated-definition bug, worth a preemptive merge"
positive_findings:
  - "4-second eccentric tempo claim confirmed live in both directions — present in Forging (TEMPO 4:0:X:0), absent in Tempering"
  - "reverse-nordic-curl not used anywhere — dodges the single worst-case bug available to a hamstring specialization plan"
  - "Upper Dominant day genuinely hamstring-free, matching the 'one upper day to recover' claim"
plan_local_bug:
  area: "'three functions, all of which must progress' claim"
  detail: "only barbell-romanian-deadlift has a progression field and dashboard tracking (trackedLiftFor -> 'RDL'); seated-ham-curl and hip-supported-db-deadlift have zero automated progression or chart history"
  confirmed: "live — dashboard WORKOUT HISTORY chart is labeled 'RDL' only, no equivalent for the other two functions"
shared_bug_gaps:
  T9_plan_switch: "reproduces an eighth consecutive plan across Waves 2-3"
audit: { date: 2026-08-15, findings: 5, verdict: "sound exercise selection and a precisely-executed tempo claim undercut by a headline progression promise that only a third of the plan's own functions actually deliver" }
```
