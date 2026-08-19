# Workhorse

> Unified plan document, v2 format. Supersedes `docs/plans/workhorse.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `workhorse` |
| **Length** | 10 weeks (Ascent 1-4, Overhang 5-9, Chin-Up Trial 10) |
| **Frequency** | 4 days/week, back 3x, biceps 3x |
| **Weekly sets** | 76 (Ascent) |
| **Declared kind** | specialisation, back |
| **Calibration** | none, but `requireBodyweight: true` at onboarding |
| **Source** | `src/data/plans/workhorse.ts` (120 lines, `definePlan()`-based) |
| **Stated promise** | *"...treating the weighted chin-up as a main lift... Progressed on total system weight... Week 10: Chin-Up Trial."* |

---

## 1. Headline finding

**"Progressed on total system weight" is genuinely false for the mechanism that actually drives progression, and this session found a new cross-plan bug candidate: the strength-chart widget several plans rely on has no working data source anywhere in the codebase.**

### 1a. Total system weight is calculated, but never used for progression

A real `totalSystemWeightKg = bodyweight + external` calculation exists
(`WorkoutView.tsx`), correctly gated on `workhorse`/`kali`/
`gravity-is-optional` and on `weightMode: 'weighted-bodyweight'`. But
**confirmed live and in Firestore**: after logging a set of Weighted
Chin-Up at 20kg external load and completing the session,
`workingLoads.workhorse['weighted-chin-up']` was written as exactly
**`20`** — the raw belt weight, with no bodyweight added anywhere in the
value that actually drives next session's prescribed load. The
progression handler (`genericDoubleProgression`) reads
`sets[0]?.weight` directly and runs double progression on that number
alone; `totalSystemWeightKg` is computed and stored per-set but never
enters the calculation that decides what the athlete lifts next. The
card's "progressed on total system weight" describes a metric that's
computed and displayed, not the metric that's actually progressed.

### 1b. The dashboard's "TSW" card shows the wrong number

`Dashboard.tsx`'s TSW card is titled "TSW" with subtitle "Belt load +
bodyweight on chins and dips," but the value it renders is
**`user.stats.bodyweightKg`** alone — it never adds belt/working load.
Confirmed live: the card showed "Log bodyweight" (no bodyweight entered
yet in this session), consistent with source, but the code path shows this
would display bodyweight-only even once populated — the card is
mislabeled regardless of data state.

### 1c. New cross-plan finding: the "Chin belt" / `strength_chart` widget has no working data source anywhere

**Confirmed live and in Firestore.** After completing a full logged
session (Weighted Chin-Up 1×5@20kg plus the rest of Day 1), the user
document has **no `liftHistory` field at all** — grepped the entire
codebase for every write site that could populate `user.liftHistory`
(the field `trackedLiftFor()` reads to build the "Chin belt"/"Standing
press"/"RDL"/etc. strength charts across at least 5 other audited plans)
and found none. `liftHistory` is declared in `types.ts`, read in 7 places
across `trackedLift.ts`, and **written nowhere**. This means the
`strength_chart` dashboard widget — present on Overhead Dominion,
Hamstring Foundry, Cathedral, Quadfather, and Workhorse among plans
audited so far — has been rendering against a permanently-empty data
source on every one of them. This wasn't caught on those plans individually
because an empty chart doesn't visually announce itself as broken the way
a mislabeled card does; it took directly comparing "what got written after
a logged set" against "what the chart reads" to surface it. Flagging as a
new shared-bug candidate (pending a name in `_audit-decisions.md`) since it
plausibly affects every `trackedLiftFor`-consuming plan already audited,
not just Workhorse.

---

## 2. Week 10 "Chin-Up Trial" — a real phase change, but a thin test mechanism

```ts
{ name: 'Chin-Up Trial', weeks: [10],
    transform: slot => slot.ex === 'weighted-chin-up'
        ? { ...slot, sets: 3, reps: '1-3', notes: 'Chin-Up Trial: work to a weighted 3RM, or test bodyweight max reps. Pick one and record it.' }
        : { ...slot, sets: Math.max(2, slot.sets - 1) } },
```

This is a genuine, distinct deload-into-test week — the chin-up prescription
changes (6×3-5 → 3×1-3) and every other slot drops one set (floor 2), a
real structural shape, not a renamed regular day. But there is no dedicated
test-capture mechanism beyond the instruction "Pick one and record it" in
the set's `notes` field — grepped the whole app for `Chin-Up Trial`/
`chinUpTrial` and found only the phase name, the note string, and the card
copy. No AMRAP flag, no result-capture field, no badge, no dashboard
callout. Milder than this wave's fully-dead features (the phase logic
itself is real and correctly wired) but the "Trial" framing implies more
ceremony than a plain logged set with extra instructional text delivers.

---

## 3. Structure

### Weekly template (Ascent phase, weeks 1-4, 76 sets)

| Day | Sets | Key work |
|---|---|---|
| Weighted Chin Strength | 15 | Weighted Chin-Up 6×3-5 (double +2.5kg), Hammer Chest Press 3, Rear Delt Fly 2 (last-set-failure), Cable Tri Ext 2 (last-set-failure), Cable Lateral Raise 2 (last-set-failure) |
| Legs + Vertical Pull Volume | 19 | Goblet Skater Squat 3, Hip-Supported DB Deadlift 3, Hack Calf Raise 3, Pull-Up (pronated) 4×6-10, Incline-Lying DB Curl 3, Ab Wheel 3 |
| Horizontal Back | 22 | Hammer Upper Row 4×6-10, Hammer Lower Row 3, Incline DB Bench 3, Standing Military Press 3×6-10, Reverse Curl 3, Rope Pressdown 3, Rear Delt Fly 3 |
| Legs + Chest | 20 | Heel-Elevated Goblet Squat 3, Sissy Squat 2 (last-set-failure), Seated Ham Curl 3, Flat DB Press 3, Hanging Leg Raise 3, Standing Calf Raise 3, Seated DB Lateral Raise 3 |

### `xStatus`, T-2, T-3, T-14, T-4, reverse-nordic

- **No `workhorseStatus` anywhere** — structurally immune to T-1/T-2, same
  no-status-object class as Monolith/Purgatorio.
- **No `type: 'wave'` and no `technique: {kind:'wave'}`** — not exposed to
  T-3/T-14.
- **No classic T-4 pattern** — single authoritative slot per day, phase
  transforms mutate it.
- **No `reverse-nordic-curl`** anywhere in this plan.
- **Doc-vs-code mismatch, same shape as Purgatorio/Cathedral's stale
  tables**: the original doc's weeks 1-4 table shows Machine Rear Delt
  Fly/Cable Triceps/Cable Lateral Raise all at 3 sets; live source has all
  three at 2 sets. Only the doc's week-10 table correctly shows 2.

---

## 4. Findings

### 4.1 Progression ignores "total system weight" despite the card claim · **severity: high, `plan-local`**

Detailed in §1a. Confirmed live and in Firestore — `workingLoads` stores
the raw belt weight only.

### 4.2 Dashboard TSW card shows bodyweight only, mislabeled · **severity: medium, `plan-local`**

Detailed in §1b. The subtitle explicitly promises "belt load + bodyweight"
math the displayed number never performs.

### 4.3 `liftHistory` has no write path anywhere — new cross-plan finding · **severity: high, `shared-bug` (new pattern, not yet numbered)**

Detailed in §1c. Confirmed live and in Firestore on this plan; plausibly
affects every plan using `trackedLiftFor()` already audited this session
(Overhead Dominion, Hamstring Foundry, Cathedral, Quadfather) and any
remaining plan using the same widget. This is the highest-leverage single
finding from this plan's audit, since fixing one write path likely fixes
the strength chart across the whole portfolio at once — recommend
escalating to the shared-pattern list alongside T-9.

### 4.4 Chin-Up Trial has no dedicated test-capture mechanism · **severity: low, `plan-local`**

Detailed in §2. Real phase logic, thin ceremony beyond a notes-field
instruction.

### 4.5 Back-region differentiation is real, though lower lats lag · **severity: none (mostly positive finding)**

Detailed in §5. "Width, thickness, lower lats into their own slots" holds
up directionally — four distinguishable sub-region numbers rather than one
generic "back" total — though latsLower sits ~33% below teresMajor since no
single exercise trains it as a true 1.0 prime mover.

### 4.6 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| "Chin belt" strength chart | High | Confirmed rendering against a field that's never written anywhere — see §4.3 |
| "TSW" card mislabeled | Medium | Confirmed showing bodyweight only, not belt+bodyweight — see §4.2 |
| `workingLoads` stores raw belt weight | High | Confirmed via Firestore read after a completed session — see §4.1 |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 5. Weekly volume (Ascent phase, 76 sets/week)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Biceps (long) | 14.25 | | Teres major | 13.0 |
| Lats (upper) | 12.0 | | Rhomboids | 10.0 |
| Triceps (lateral/medial) | 10.0 each | | Abdominal wall | 9.5 |
| Rear delt | 9.0 | | Lats (lower) | 8.75 |
| Front delt | 8.75 | | Trap (mid) | 8.75 |
| Brachialis | 8.75 | | Quads (3 heads) | 8.0 each |
| Biceps (short) | 7.5 | | Pec (lower) | 7.5 |

All 24 distinct exercises resolved to attribution rows — no missing data.

### Back-region breakdown (the "width, thickness, lower lats" claim)

| Sub-region | Sets | Share |
|---|---|---|
| Teres major | 13.0 | 29.7% |
| Lats (upper) | 12.0 | 27.4% |
| Rhomboids | 10.0 | 22.9% |
| Lats (lower) | 8.75 | 20.0% |

A genuine ~1.5:1 spread rather than one dimension dominating — Weighted
Chin-Up and Pull-Up together drive teres major/lats-upper hard as a
byproduct of stacking two vertical-pull movements; Hammer Upper Row is the
width/thickness driver (rhomboids, trap mid); Hammer Lower Row is the only
true 1.0-prime-mover source for lats lower, which is why that sub-region
trails the other three — it's built entirely from secondary contributions
elsewhere in the split, with no dedicated lower-lat lead exercise.

---

## 6. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **113** |
| Axial | **15** |
| Sets | 76 |
| Per-set systemic | **1.49** |

Low axial load (15, lowest of any Wave 3 plan audited except Cathedral's
19 and Arms Race's 15) — expected for a plan built around bodyweight/
loaded-bodyweight vertical pulling with no barbell squat or deadlift
pattern anywhere in the four days.

---

## 7. Improvements, ranked

### 1. Feed `totalSystemWeightKg` into progression, or drop the "total system weight" claim · `plan-local`

Either make `genericDoubleProgression` (or a Workhorse-specific variant)
progress on the combined bodyweight+load figure that's already computed
per set, or change the card copy to describe what actually happens
(belt-load double progression). The math already exists; it just needs to
reach the decision that matters.

### 2. Fix the TSW dashboard card's math · `plan-local`

Add the belt/working load to `bodyweightKg` before display, matching the
card's own subtitle.

### 3. Wire a `liftHistory` write path · `shared-bug`

The single highest-leverage fix found on this plan — likely resolves the
empty strength chart across every plan using `trackedLiftFor()` at once,
not just Workhorse. Should be logged as a new shared pattern alongside T-9.

### 4. Give the Chin-Up Trial a real result-capture field · `plan-local` (`hypothesis`)

A dedicated "Trial result" input (weight × reps or bodyweight max reps)
distinct from a normal logged set would match the "Trial" framing and give
the athlete something concrete to look back on, rather than a notes-field
instruction easy to skip past.

### 5. Add a dedicated lower-lat lead exercise · `plan-local` (`hypothesis`)

Currently latsLower is entirely secondary-contribution volume; a
straight-arm pulldown or similar movement positioned as its own slot would
close the ~33% gap to teres major and make all four back sub-regions
genuinely equal, matching the card's implied even split more literally.

---

## 8. Verdict

**Workhorse's actual back-region programming is thoughtful and does
deliver differentiated width/thickness/lower-lat volume as claimed, but
its headline mechanical promise — progression on total system weight — is
false for the number that actually matters, and this audit turned up a
likely portfolio-wide bug in the process.**

The four back sub-regions land in a genuine, non-trivial spread rather than
collapsing into one number, and the Ascent/Overhang/Chin-Up-Trial phase
structure is a real, correctly-implemented arc. But "progressed on total
system weight" is the plan's specific, checkable claim, and it's false for
the mechanism an athlete actually experiences: the belt weight alone is
what goes up by 2.5kg, bodyweight never enters the equation that decides
next week's prescription, and the dashboard card that's supposed to show
the combined number shows only bodyweight. The most consequential thing
this plan's audit surfaced, though, wasn't local to Workhorse at all — the
"Chin belt" strength chart's backing field (`liftHistory`) has no write
path anywhere in the codebase, a finding that plausibly invalidates the
same dashboard widget on every other plan already audited this wave that
uses it.

---

## 9. Export block

```yaml
id: workhorse
version: 2
length: { weeks: 10, phases: [ascent_1to4, overhang_5to9, chin_up_trial_10] }
frequency: 4_per_week
weekly_sets: { ascent: 76 }
kind: specialisation_back
calibration: { requireBodyweight: true }
engine: definePlan_generic
systemic_load: { weekly: 113, axial: 15, sets: 76, per_set: 1.49 }
volume_top: { bicepsLong: 14.25, teresMajor: 13.0, latsUpper: 12.0, rhomboids: 10.0 }
back_region_split: { teresMajor: 13.0, latsUpper: 12.0, rhomboids: 10.0, latsLower: 8.75 }
absent_bug_patterns: [T1_T2_no_status_object, wave_progression_bug, T14_no_wave_technique_used, classic_T4_duplicated_definitions, reverse_nordic_curl_misattribution]
plan_local_bugs:
  - area: "'progressed on total system weight' card claim"
    detail: "totalSystemWeightKg (bodyweight+external) is computed per set in WorkoutView.tsx but genericDoubleProgression reads sets[0].weight only; workingLoads.workhorse['weighted-chin-up'] confirmed live in Firestore to store the raw belt weight (20), not a combined figure"
  - area: "Dashboard.tsx TSW card"
    detail: "titled 'TSW' with subtitle 'Belt load + bodyweight on chins and dips' but renders user.stats.bodyweightKg alone, never adding belt/working load"
new_shared_bug_candidate:
  area: "liftHistory has no write path anywhere in the codebase"
  detail: "declared in types.ts, read in 7 places in trackedLift.ts (feeds the strength_chart widget on Overhead Dominion, Hamstring Foundry, Cathedral, Quadfather, Workhorse, and likely others), never written by any code path"
  confirmed: "live — completed a full logged session on Workhorse (Weighted Chin-Up 1x5@20kg + rest of Day 1), Firestore read afterward shows no liftHistory field on the user document at all, while workingLoads correctly updated"
  recommend: "escalate to _audit-decisions.md's shared-pattern list (candidate T-22) — likely a single-fix, portfolio-wide impact bug, the highest-leverage finding from this plan's audit"
doc_code_mismatch:
  area: "docs/plans/workhorse.md weeks 1-4 table"
  detail: "shows Rear Delt Fly/Cable Tri Ext/Cable Lateral Raise at 3 sets; live source has all three at 2 sets, same stale-table pattern as Purgatorio/Cathedral"
audit: { date: 2026-08-15, findings: 5, verdict: "genuine back-region differentiation delivered as claimed; the headline progression mechanic is false for what actually drives load, and the audit surfaced a likely portfolio-wide strength-chart data-source bug in the process" }
```
