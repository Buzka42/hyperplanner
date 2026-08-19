# Overhead Dominion

> Unified plan document, v2 format. Supersedes `docs/plans/overhead-dominion.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `overhead-dominion` |
| **Length** | 10 weeks (Bombardment 1-5, Artillery 6-10) |
| **Frequency** | 4 days/week (delts 4x, upper back 3x) |
| **Weekly sets** | 81, constant across all 10 weeks |
| **Declared kind** | shoulder specialisation, `splitDelts: true` in the volume-analysis config |
| **Calibration** | none |
| **Source** | `src/data/plans/overheadDominion.ts` (118 lines, `definePlan()`-based, same generic engine family as Monolith/Purgatorio/Event Horizon/Tenfold) |
| **Stated promise** | *"Delts four times a week, and never the same way twice... Front, side and rear delt volume tracked separately. Later block moves the press onto 5/3/2 waves."* |

---

## 1. Headline finding

**Two separate claims on the card don't survive contact with the running app — one is a dead-feature repeat of Event Horizon's T-10 pattern, the other is a new and more severe bug class than King of the Squat's T-3.**

### 1a. "5/3/2 waves" is a label with zero effect on load or reps

The Artillery-phase transform rewrites `reps`, `sets`, `notes`, and
`technique` on the standing press slot — but never touches `progression`,
which stays `{ type: 'double', increment: 2.5 }` for all 10 weeks:

```ts
transform: (slot, ctx) =>
    slot.ex === 'standing-barbell-military-press'
        ? ctx.week >= 9
            ? { ...slot, reps: '3', sets: 5, notes: '...', technique: { kind: 'wave', ladder: [5, 3, 2], waves: 2 } }
            : { ...slot, reps: '3', sets: 5, technique: { kind: 'wave', ladder: [5, 3, 2], waves: 2 } }
        : slot,
```

`planBuilder.ts`'s weight calculator branches on **`progression.type`**,
not `technique.kind` — `case 'wave'` (line 403) is keyed to
`progression.type === 'wave'`, and since this plan's progression never
becomes that, weight resolution always falls into `case 'double'` (line
414), reading the athlete's saved working load exactly as it did in
Bombardment. `technique: { kind: 'wave', ladder: [5,3,2], waves: 2 }` has
exactly one consumer anywhere in the app: `techniqueLabel()`
(`planBuilder.ts:168`), which only produces the display string `"Waves: 2x
5/3/2"` for a UI badge. `targetFor()` uses `slot.reps` directly, which after
the transform is the literal string `'3'` — the same target on every one of
the 5 sets, not a 5/4/3/5/4/3 ladder.

**Confirmed live**, Week 9 (Artillery, push-press variant): Standing
Military Press rendered "5 sets × 3 reps," a "Waves: 2x 5/3/2" badge, and
**every one of the 5 sets showed an identical target of "× 3"** — no
per-set variation at all. The badge describes a wave that never happens.

This is a worse bug than King of the Squat's T-3: there, `wavePercentForSet`
was at least reached and miscalculated the percentage. Here, the wave
machinery is never invoked in the first place — `technique.kind === 'wave'`
is purely decorative unless `progression.type` is independently also set to
`'wave'`, and this plan's phase transform only ever touched the former.
This is a **new pattern** worth its own id (T-14): *any plan's phase
transform that sets `technique: { kind: 'wave' }` without a matching
`progression: { type: 'wave' }` change silently strands the load math on
whatever scheme was already active* — a trap the plan author appears not to
have realized exists, since the notes text and technique label both
describe real wave programming that the prescription never delivers.

### 1b. "Front/side/rear delt volume tracked separately" — real backend, zero athlete-facing UI

Same dead-feature shape as Event Horizon's T-10. The computation is genuine
and correct: `src/lib/volumeAnalysis.ts` has `splitDelts?: boolean` on
`VolumeRules`, sums `frontDelt`/`sideDelt`/`rearDelt` separately when set,
and Overhead Dominion's rules entry (`volumeAnalysis.ts:279`) sets
`splitDelts: true`. But the only consumer of `splitDelts` anywhere in
`src/` is `src/pages/admin/AnalysisTab.tsx` — confirmed rendering inside
`<main className="admin-console">`, an internal dev/admin-only screen with
no athlete-facing route. The plan's own `dashboardWidgets` are
`['program_status', 'strength_chart', 'workout_history']` — no delt-split
widget listed, and the dashboard's tracked-lift display (`trackedLift.ts`)
only surfaces a single "Standing press" line, not a per-head breakdown. An
athlete choosing this plan specifically for the promise of seeing whether
their rear delts are catching up gets no such view anywhere in the product.
The plan's own original doc already flagged this internally ("aspirational
— no dedicated widget"), so — like Purgatorio's stale comment and
Pencilneck's own internal push/pull admission — the author knew.

---

## 2. Structure

### Weekly template (constant across all 10 weeks, 81 sets)

| Day | Sets | Key work |
|---|---|---|
| Overhead Strength | 18 | Standing Military Press 5×5-8→3 (Artillery), Weighted Chin-Up 5×5-8, Cable Lateral Raise 2×12-20, Leaning 1-Arm Lateral Raise 2×12-20, Rope Pressdown 2×10-15, Rear Delt Fly 2×15-20 |
| Delts + Legs | 21 | Cable Lateral Raise 2, Seated DB Lateral Raise 2, SA Reverse Pec Deck 2, Hack Squat 3×8-12, Seated Ham Curl 3×8-12, Hammer Chest Press 3×8-12, Standing Calf Raise 3, Cable Crunch 3 |
| Shoulder Hypertrophy | 21 | One-Arm Braced DB Press 4×8-12, Hammer Upper Row 4×8-12, Seated DB Lateral Raise 2, Leaning 1-Arm Lateral Raise 2, Rear Delt Fly 3×15-25, Incline DB Bench 3×8-12, Cable Curl 3×10-15 |
| Structural Shoulders + Legs | 21 | Seated DB Shoulder Press 3×8-12, SA External Rotation 3×12-20, Rear Delt Fly 3×15-20, Goblet Skater Squat 3×8-12, Hip-Supported DB Deadlift 3×10-15, Standing Calf Raise 3, Rope Pressdown 3×12-20 |

Genuinely well-designed variety, matching the card's "never the same way
twice" claim: heavy strict standing press, high-volume lateral/rear day,
braced unilateral press, and a structural day built around external
rotation. Confirmed live and in source — the four days are functionally
distinct, not four copies of the same session with different labels.

### Two source comments admit the plan undershoots its own exposure targets

```ts
// Second weekly chest exposure. The doc calls for chest 2x, but its own
// day lists press only on day 3.
{ ex: 'hammer-chest-press', ... },
```
```ts
// Second weekly tricep and chest exposure; the doc's own day lists
// leave both at one, against its two-exposure minimum.
{ ex: 'rope-pressdown', ... },
```

Both comments were confirmed structurally accurate against the day lists —
same class of honest self-documentation as Purgatorio's stale-comment
finding, though here the comments describe a real design gap rather than a
factual inaccuracy about what the code does.

### `xStatus`, T-2, T-4, reverse-nordic

- **No `overheadDominionStatus` anywhere** — T-2/`resetProgram()` allowlist
  is not applicable; the generic `programProgress` reset path covers this
  plan fully.
- **No duplicated exercise definitions** — grepped `exerciseName ===`/
  `ex.name ===`, zero matches. Not exposed to the classic T-4 pattern.
- **No `reverse-nordic-curl`** anywhere in the plan.

---

## 3. Findings

### 3.1 "5/3/2 waves" is decorative-only — new bug class T-14 · **severity: critical, `plan-local`**

Detailed in §1a. The single most severe finding in Wave 3 so far, and worth
flagging as a new shared pattern (`_audit-decisions.md` T-14) since any
other plan using this same "change `technique` without changing
`progression`" shortcut would carry the identical bug silently.

### 3.2 Delt-split tracking is a dead feature, same shape as T-10 · **severity: high, `plan-local`**

Detailed in §1b. Second confirmed instance of the Event Horizon dead-feature
pattern (well-built backend, zero athlete-facing UI) — worth checking
whether any later Wave 3 specialisation plan (which are, by nature, the
plans most likely to promise per-region tracking) repeats it.

### 3.3 Plan-switch bug (T-9) reproduces a sixth time · **severity: high, `shared-bug`**

Fresh Overhead Dominion registration (continuing the `test_claude` session
from Pencilneck's stale week 5) showed "NEXT SESSION — WEEK 5 — Overhead
Strength · Bombardment" — sixth consecutive plan across Waves 2-3 with the
identical `Dashboard.tsx:79` mechanism.

### 3.4 Stated 2x chest/tricep exposure minimum not actually met · **severity: low, `plan-local`**

Both in-source comments (§2) are accurate: chest gets one true pressing
exposure (Overhead Strength's OHP doesn't count as chest-primary) plus
Hammer Chest Press on Delts + Legs — genuinely 2x, so that comment reads as
resolved in the current file despite its own uncertainty. Triceps gets Rope
Pressdown on two days (Overhead Strength, Structural Shoulders) — also
genuinely 2x. Both comments appear to describe a gap that's already been
closed in the current version of the file rather than a live shortfall;
worth removing the comments since they no longer describe reality, similar
to Purgatorio's stale-comment finding but resolved in the opposite
direction (the code caught up to the comment instead of drifting from it).

### 3.5 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| "Waves: 2x 5/3/2" badge with flat 3-rep target on every set | Critical | See §3.1 — confirmed live at week 9 |
| Push-press note at weeks 9-10 | — | "Weeks 9–10: optional push-press on the top set only. Strict on the rest." rendered correctly, matching source |
| Day variety | — | Four functionally distinct sessions confirmed, matching the card's claim |
| No delt-split view anywhere | High | Confirmed absent from dashboard, matching §3.2 |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 4. Weekly volume (constant across all 10 weeks, 81 sets)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Side delt** | **18.00** | | Front delt | 16.75 |
| Rear delt | 14.75 | | Triceps (lateral/medial) | 14.00 each |
| Rhomboids / trap (mid) | 9.00 each | | Biceps (short) | 8.00 |
| Biceps (long) | 7.50 | | Lats (upper) | 7.00 |
| Gastrocnemius | 6.75 | | Quads (3 heads) | 6.00 each |
| Glute max (lower) | 6.00 | | Hamstrings (2 heads) | 6.00 each |
| Pec (upper) | 5.75 | | Infraspinatus | 5.50 |
| Triceps (long) | 5.25 | | Teres major | 5.00 |
| Pec (lower) | 4.50 | | Trap (upper) | 4.30 |

### The headline claim's own numbers

| Delt head | Sets | Primary contributors |
|---|---|---|
| Side delt | 18.00 | 3 dedicated lateral-raise variants (12.0 combined) + press carryover |
| Front delt | 16.75 | Standing Press (5.0) + Braced DB Press (4.0) + Incline Bench (3.0) + Seated DB Press (3.0) |
| Rear delt | 14.75 | Rear Delt Fly (8.0 across 3 days) + Hammer Upper Row (4.0) + SA Reverse Pec Deck (2.0) |

The three heads land much closer together than a naive glance at exercise
selection suggests (an 18% spread top-to-bottom), because three separate
pressing movements — not just the two dedicated OHP slots — quietly
contribute near-full front-delt volume as prime movers. Side delt is
correctly the leader for a specialization plan, but the gap to front delt is
narrower than the plan's exercise list alone implies, and this is exactly
the kind of number the (non-functional) delt-split widget would have made
visible to an athlete if it existed. Worth noting: triceps (14.0 each head)
and mid-back (rhomboids/trap-mid, 9.0 each) are riding along at
near-specialization-level volume without being named as a target anywhere
in the plan's copy.

---

## 5. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **116** |
| Axial | **33** |
| Sets | 81 |
| Per-set systemic | **1.43** |

Mid-pack per-set cost among Wave 2/3 plans audited so far. Axial load (33)
is entirely a by-product of the two leg-accessory days (Hack Squat, Goblet
Skater Squat, Hip-Supported DB Deadlift) rather than the shoulder work
itself, consistent with a specialization plan that maintains rather than
neglects the rest of the body.

---

## 6. Improvements, ranked

### 1. Wire `progression.type` to actually change during the Artillery phase · `plan-local`

Either add a real `{ type: 'wave', of: 'standingPress', ladder: [...] }`
progression alongside the `technique: { kind: 'wave' }` change, or remove
the wave technique/label entirely and keep the flat 3-rep target honest
about what it is (a rep-range change, not a wave). Right now the UI
actively tells the athlete they're on a wave when they're on flat double
progression at 3 reps — the least honest single element found in Wave 3 so
far.

### 2. Build the delt-split widget, or remove the claim · `plan-local`

Same recommendation as Event Horizon's T-10 fix — the computation already
exists (`volumeAnalysis.ts`'s `splitDelts` logic); it needs a dashboard
surface, or the onboarding copy shouldn't promise a tracked breakdown that
doesn't reach the athlete.

### 3. Remove the two now-stale "doesn't meet exposure minimum" comments · `plan-local`

Per §3.4, both comments describe a gap that appears already closed in the
current file — leaving them in risks a future editor "fixing" a problem
that no longer exists, the inverse of Purgatorio's drift risk.

### 4. Consider naming triceps/mid-back as secondary beneficiaries in the onboarding copy · `plan-local` (`hypothesis`)

At 14.0 and 9.0 fractional sets/week respectively, triceps and rhomboids/
trap-mid are trained at a level most dedicated plans would call a real
secondary focus — worth a one-line mention so an athlete isn't surprised by
how much incidental arm/back growth accompanies the shoulder work.

### 5. Namespace the dashboard view-week cache by program · `shared-bug`

Same T-9 recommendation as every prior plan — sixth confirmation.

---

## 7. Verdict

**Overhead Dominion's day design is genuinely thoughtful — four
functionally distinct shoulder exposures, sensible systemic/axial
maintenance of the rest of the body, and delt-head volume that's more
balanced than the exercise list alone suggests — but two of its three most
specific claims (the wave progression, the tracked delt split) don't
survive live verification, and one of them is a new and more severe bug
pattern than anything found in Wave 1 or 2's progression logic.**

The "5/3/2 waves" finding matters beyond this one plan: it's a trap any
future phase-transform plan could fall into by changing `technique` without
also changing `progression`, and it produces a UI that actively
misrepresents what the athlete is training — a flat 3-rep double-progression
scheme labeled and narrated as a wave. The delt-split dead feature is a
second confirmed instance of Event Horizon's pattern from Wave 2, suggesting
"a specialization plan promises tracked sub-muscle volume it never actually
shows" may itself be worth watching as a recurring Wave 3 theme, given the
rest of this wave is entirely specialization plans.

---

## 8. Export block

```yaml
id: overhead-dominion
version: 2
length: { weeks: 10, phases: [bombardment_1to5, artillery_6to10] }
frequency: 4_per_week
weekly_sets: { constant_all_10_weeks: 81 }
kind: specialisation_shoulders
calibration: none
engine: definePlan_generic
systemic_load: { weekly: 116, axial: 33, sets: 81, per_set: 1.43 }
volume_top: { sideDelt: 18.0, frontDelt: 16.75, rearDelt: 14.75, tricepsLateral: 14.0, tricepsMedial: 14.0 }
delt_split_actual: { sideDelt: 18.0, frontDelt: 16.75, rearDelt: 14.75 }
absent_bug_patterns: [resetProgram_allowlist_na, duplicated_exercise_definitions, reverse_nordic_curl_misattribution]
new_bug_class:
  id: T-14
  area: "Artillery-phase transform sets technique:{kind:'wave'} without ever changing progression.type from 'double'"
  detail: "planBuilder.ts's weight calculator branches on progression.type, not technique.kind; techniqueLabel() is the only consumer of technique.kind==='wave', producing a decorative badge only"
  confirmed: "live at week 9 — 'Waves: 2x 5/3/2' badge shown, but all 5 sets rendered an identical '×3' target, no ladder variation, weight calculated via case 'double' exactly as in Bombardment"
  severity_vs_T3: "worse than King of the Squat's T-3 — there wavePercentForSet was at least reached and miscalculated; here the wave machinery is never invoked at all"
dead_feature:
  area: "splitDelts front/side/rear tracking (volumeAnalysis.ts:279)"
  detail: "computation is real and correct; only consumer app-wide is src/pages/admin/AnalysisTab.tsx (admin-console, not athlete-facing); no dashboard widget, same pattern as Event Horizon's T-10"
shared_bug_gaps:
  T9_plan_switch: "reproduces a sixth consecutive plan across Waves 2-3"
audit: { date: 2026-08-14, findings: 5, verdict: "well-designed day structure and balanced delt-head volume undercut by two claims (wave progression, tracked delt split) that don't survive live verification" }
```
