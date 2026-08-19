# King of the Squat

> Unified plan document, v2 format. Supersedes `docs/plans/king-of-the-squat.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wave-progression math verified
> both analytically (calling `calculateWeight` directly across all 12 weeks)
> and live in-app via `test_claude`.

| | |
|---|---|
| **id** | `king-of-the-squat` |
| **Length** | 12 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 77 (weeks 1–9) → 55 (Realisation, 10–11) → 34 (Test Week, 12) |
| **Declared kind** | `powerlifting`, `specialisation: [quads]`, `specialisationExposures: 3` |
| **Calibration** | Squat, Bench, Deadlift 1RM (bench pre-fills from a shared profile if already calibrated on another plan) |
| **Progression** | Modern `definePlan` builder, wave + percentage progressions, **one confirmed math bug in the wave engine** |
| **Source** | `src/data/plans/kingOfTheSquat.ts` (165 lines) · `src/features/workout/progression/kingOfTheSquat.ts` (33 lines) |
| **Stated promise** | *"Squat three times a week and let everything else serve it... Wave loading: 5/4/3 to 4/3/2 to 3/2/1."* |

---

## 1. Headline finding — the wave never actually escalates

Called `calculateWeight` directly for every set of the Heavy Squat slot,
across all 12 weeks, on a calibrated 160 kg squat:

```
week  1: 120, 125, 127.5, 125, 127.5, 132.5   top=132.5
week  2: 125, 127.5, 132.5, 127.5, 132.5, 135   top=135
week  3: 127.5, 132.5, 135, 132.5, 135, 140     top=140
week  4: 120, 125, 127.5, 125, 127.5, 132.5   top=132.5   ← identical to week 1
week  5: 125, 127.5, 132.5, 127.5, 132.5, 135   top=135   ← identical to week 2
week  6: 127.5, 132.5, 135, 132.5, 135, 140     top=140   ← identical to week 3
week  7: 120, 125, 127.5, 125, 127.5, 132.5   top=132.5   ← identical to week 1
week  8: 125, 127.5, 132.5, 127.5, 132.5, 135   top=135   ← identical to week 2
week  9: 127.5, 132.5, 135, 132.5, 135, 140     top=140   ← identical to week 3
week 10: 120, 125, 127.5, 125, 127.5, 132.5   top=132.5
week 11: 125, 127.5, 132.5, 127.5, 132.5, 135   top=135
week 12: 120, 125, 127.5, 125, 127.5, 132.5   top=132.5   ← LOWER than week 9's peak
```

**Weeks 1, 4, 7 and 10 prescribe byte-identical loads. So do 2/5/8/11 and
3/6/9.** Live-confirmed at week 5 in-app: the rendered set weights were
125/127.5/132.5/127.5/132.5/135 kg — matching the table exactly. This is not
a rounding coincidence; it's a mechanical property of how the wave engine is
built.

### Why

`buildWeightCalculator`'s wave case (`src/data/planBuilder.ts:331`) computes:

```js
const rungs = Math.max(1, progression.ladder.length);
const rung = setIndex % rungs;
const waveIndex = Math.floor(setIndex / rungs);
percent = basePercent + step*(weekInPhase-1) + step*waveIndex + step*rung;
```

`weekInPhase` resets to 1 at the start of every phase (`phase.weeks.indexOf(week) + 1`).
`basePercent` (0.75) and `step` (0.025) live on the slot's **`progression`**
object, defined once in `HEAVY_SQUAT` and never touched again. The three
phase transforms (`Volume Waves`, `Intensity Waves`, `Peak Waves`) each
rewrite `slot.technique.ladder` — the array that drives the *displayed* rep
target per rung ("5/4/3" → "4/3/2" → "3/2/1") — but **`wavePercentForSet`
never reads `technique.ladder`, and never reads `progression.ladder`'s
values, only its `.length`.** Since all three ladders happen to have length
3, the percentage formula is mathematically identical every time
`weekInPhase` cycles back to 1 — which is the start of every phase.

The display layer and the load-calculation layer are correctly decoupled in
general (this is good architecture elsewhere in the portfolio — Trinary uses
the same pattern deliberately), but here nothing updates the load side when
the phase changes, so decoupling became a bug: the athlete is told they're
in "Intensity Waves" doing 4-rep sets, and shown a smaller rep target, but
the actual bar weight is whatever week 1–3's identical percentage table
already produced.

### The consequence for "Peak Waves" specifically

Week 9's heaviest prescribed set — a *single* rep, in the phase explicitly
named for peaking — is **140 kg, 87.5% of the calibrated max**. That is the
same absolute weight as week 3's heaviest *triple*, in the phase named
"Volume Waves." A lifter capable of tripling 87.5% has a true 1–2RM
meaningfully above 140 kg; asking for a single at that same load in the
"peak" phase is not a peak, it's a rehearsal of week 3.

### Week 12 ("Test Week") loads *lower* than week 9

The notes correctly say *"work up to a single you are certain of,"*
acknowledging this is meant to be athlete-driven at the top end — but the
calculated *reference* weight the app hands the athlete for that top set is
132.5 kg, below week 9's 140 kg peak. A 12-week squat specialisation plan's
final scheduled loading number is lower than its ninth week's, with no
recalibration between them (see §1.2).

### 1.2 The squat 1RM never updates

`user.stats.squat` is written once at calibration and read by
`calculateWeight` for all 12 weeks. I searched every write site in
`WorkoutView.tsx` and `Onboarding.tsx` for `stats.squat` and
`kingOfTheSquat` — there is no AMRAP test, no e1RM checkpoint, and no
recalibration prompt anywhere in the plan. Every other powerlifting plan
audited has *some* mechanism for the base number to move during the cycle
(Bench Domination's weekly AMRAP + checkpoint resets, Pain & Glory's week-13
AMRAP, Ritual's Ascension Tests, Trinary's per-session RPE bump). King of the
Squat has none for its own named lift. Combined with §1.1, this means the
entire 12-week cycle trains at percentages of a number fixed on day one, and
those percentages never climb past week 3's ceiling either.

---

## 2. A second, independent bug: contaminated tip copy

The live session for "Paused Low Bar Squat" displayed:

> *"Progression weeks 1-8: +2.5kg weekly. Weeks 9-16: fixed weight to
> prioritize deadlift peaking."*

King of the Squat is **12 weeks**, has no deadlift-peaking phase, and its
deadlift is explicitly described in its own source as *"deliberately light...
never progressed aggressively."* Traced the string to
`src/data/exercises/variantTips.ts:88` and `src/contexts/translations.ts:1429` —
it is **Pain & Glory's** description of its own paused-squat behaviour
(verified against that plan's actual 16-week, weeks-9-16-fixed design,
documented in the Pain & Glory audit). Tips resolve by exercise name/id, not
by plan, so two plans sharing "Paused Low Bar Squat" as a display name also
share this plan-specific paragraph, and it's simply wrong on one of them.

---

## 3. A third, now-familiar bug: plan-switch state leak

Registering fresh into King of the Squat immediately after viewing Bench
Domination's week 5 produced the same symptom found on Ritual and Bench
Domination: **"NEXT SESSION — WEEK 5"** for a brand-new profile with no
completed sessions. This is the third plan on which this exact failure has
been confirmed — see the Ritual of Strength and Bench Domination audits for
the root-cause analysis (`switchProgram()` doesn't initialize
`programProgress` for the new plan; the dashboard carries over stale client
state). No new analysis needed here beyond confirming it recurs; this is
conclusively a shared dashboard defect, not a per-plan one.

---

## 4. Structure

### Weekly template

| Day | Focus | Sets | Key work |
|---|---|---|---|
| Mon | Heavy Squat | 20 | Squat wave 6 sets, Leg Extension, Seated Ham Curl, Paused Bench 4×6-8, Hammer Row |
| Tue | Bench + Deadlift Maintenance | 20 | Paused Bench 5×3-5 @ 85%, **Deadlift 3×3 @ 57.5%** (deliberately light), Row, Ham Curl, OHP, Hanging Knee Raise |
| Thu | Squat Volume | 18 | Paused Back Squat 5×5-8 @ 67.5%, Goblet Squat, Leg Extension, Pull-up, Triceps |
| Fri | Structural Squat + Heavy Bench | 19 | Front Squat 5×3-6 @ 60%, Paused Bench 5×3 @ 87.5%, DB Deadlift, Calves, Rear Delt Fly |

Squat touched 3× weekly (Heavy/Volume/Structural) via three genuinely
different variations (low-bar wave, paused back squat, front squat) — real
variety, not the same movement three times. Bench 2×, deadlift deliberately
1× and light. This part of the design matches the plan's stated premise
exactly.

### The safety-bar swap — correctly wired

`kingOfTheSquatProgression` tracks a `hipCapsuleStreak`: two consecutive
sessions flagged for hip/capsule discomfort auto-swap `low-bar-squat` →
`safety-bar-squat` via `exerciseSwaps`, then resets the streak. Confirmed
live — the flag prompt rendered correctly under the squat exercise
("HIPS / CAPSULE LIMITED THIS SQUAT — TWO FLAGS SWAP TO SAFETY BAR"). Same
pattern as Cathedral's limiter system, and it works.

---

## 5. Weekly volume (week 1)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Quads** | **26.0** | | **Glutes** | **25.0** |
| Hamstrings | 18.3 | | Chest | 14.0 |
| Lats | 11.0 | | Upper back | 9.3 |
| Triceps | 8.6 | | Front delt | 7.6 |
| Adductors | 6.3 | | Lower back | 5.6 |
| Calves | 5.0 | | Rear delt | 4.3 |
| Biceps | 3.6 | | Abs | 3.0 |
| Traps | 1.0 | | Side delt | 1.0 |

Unlike Bench Domination, this plan's supporting musculature is genuinely
balanced — lats and biceps are present (pull-up, hammer row) at levels
proportionate to a squat-specialisation plan's pressing/pulling secondary
work, not zeroed out by a shipping bug. Quads at 26 direct sets clears the
specialisation exposure target (3 weekly exposures — Mon/Thu/Fri all hit
quads directly) with room to spare.

---

## 6. Systemic and joint load

| Metric | Wk 1–9 | Realisation (10–11) | Test Week (12) |
|---|---|---|---|
| Systemic | 148 | 107 | 69 |
| Axial | 72 | 52 | 35 |
| Lower back | 50 | 36 | 24 |
| Knee | 56 | 40 | 26 |
| Sets | 77 | 55 | 34 |

**148 systemic units held constant for 9 straight weeks with no deload** —
matching Pain & Glory's finding almost exactly (that plan ran 144/week for 8
weeks, also with no deload before its test). Here it's worse in one respect:
because §1.1 means the *intensity* isn't actually climbing either, the
9-week plateau isn't even buying progressive overload in exchange for the
accumulated fatigue — the athlete carries 9 weeks of unchanging systemic cost
for 3 weeks' worth of actual load progression, repeated three times.

---

## 7. Findings summary

| # | Finding | Severity |
|---|---|---|
| 1 | Wave progression's `basePercent`/`step` never advances between phases; weeks 1/4/7/10, 2/5/8/11, 3/6/9 are load-identical | **Critical** |
| 2 | No recalibration mechanism for `stats.squat` anywhere in the plan | **High** |
| 3 | "Paused Low Bar Squat" tip text is contaminated with Pain & Glory's 16-week, deadlift-peaking description | **Medium** |
| 4 | Plan-switch dashboard state leak (shared, third confirmation) | **High** (shared fix) |
| 5 | No deload across 9 weeks of constant systemic load | **Medium** |

---

## 8. Improvements, ranked

### 1. Fix the wave engine to actually escalate per phase

The cleanest fix: give each phase transform its own `basePercent` (or a
`step`-multiplied phase offset) rather than relying on `weekInPhase` alone to
carry the whole progression. Concretely, `wavePercentForSet` needs a
phase-index term:

```js
percent = basePercent + phaseOffset*(phaseIndex) + step*(weekInPhase-1) + step*waveIndex + step*rung
```

with `phaseOffset` set so week 9's top single lands meaningfully above week
3's top triple — e.g. large enough that "Peak Waves" reaches 92–95%+ by its
final week, which is what a peaking single actually calls for. This is a
shared-engine fix (`planBuilder.ts`), not a per-plan patch, and should be
checked against every other plan using `type: 'wave'` progression (Neural
Overload, Athena's earlier wave usage) in case the same length-only reading
of `ladder` masks the identical bug elsewhere.

### 2. Add a recalibration point

At minimum, an AMRAP or e1RM checkpoint at the Realisation→Test Week boundary
(week 9→10, mirroring Bench Domination's and Pain & Glory's checkpoint
placement) so `stats.squat` reflects 9 weeks of training before the final
taper computes its percentages. Without this, fixing §1 alone still leaves
the whole cycle anchored to a day-one number.

### 3. Scope tips by plan, or de-duplicate the shared name

Either key tip resolution by `(planId, exerciseId)` instead of exercise name
alone, or give King of the Squat's low-bar squat slot a plan-specific note
override (the `notes` field already supports per-slot overrides elsewhere in
this same file — `HEAVY_SQUAT`'s slot already carries one). The second option
is a two-line fix available today without touching the tip-resolution
architecture.

### 4. Insert a deload around week 5–6

Given the systemic plateau in §6, a single reduced week roughly at the
Volume→Intensity boundary would cost little (the plan already resets its
wave every phase per §1, so a deload week slotted between phases wouldn't
disrupt any real progression that doesn't already reset itself) and would
bring this in line with Ritual's and Bench Domination's better-paced cycles.

---

## 9. Verdict

**The best-scoped, most focused specialisation plan in the portfolio by
design — three genuinely different squat variations, a sensible 3:2:1
frequency ratio against bench and deadlift, a well-balanced accessory
selection, and a working auto-swap safety valve for hip discomfort. Its core
progression math simply doesn't do what its own name and phase labels claim.**

The concept is exactly right for what it's called: squat three times weekly
through Heavy/Volume/Structural variations, keep bench present but
secondary, keep deadlift present but deliberately light to protect the
budget being spent on squatting. Every part of that design reads as
deliberate and well-reasoned, and the accessory/volume balance (§5) is the
healthiest of any specialisation plan audited so far — nothing here is
zeroed out or forgotten.

But "Volume Waves → Intensity Waves → Peak Waves" is a promise of escalating
intensity that the underlying calculation cannot keep: the three phases are
mathematically the same 3-week percentage climb, run three times, with only
the displayed rep target changing. A lifter who trusts the app's numbers
squats the same weight in week 9's "peak" as week 3's "volume" work, and
finishes the cycle never having been asked for more than 87.5% of a 1RM that
was itself fixed on day one. For a plan whose entire premise is specialised
progressive overload on one lift, that is the one thing it needs to get
right and currently doesn't. The fix is a single, well-scoped change to the
shared wave engine — not a redesign of the plan.

---

## 10. Export block

```yaml
id: king-of-the-squat
version: 2
weeks: 12
sessions_per_week: 4
weekly_sets: { w1_9: 77, realisation: 55, test_week: 34 }
kind: powerlifting
specialisation: { group: quads, exposures_target: 3, exposures_actual: 3 }
calibration: [squat1RM, pausedBench1RM, conventionalDeadlift1RM]
critical_bug:
  area: "wave progression engine (src/data/planBuilder.ts wavePercentForSet)"
  detail: "phase transforms rewrite technique.ladder (display) but never progression.basePercent/step (calculation); wavePercentForSet reads only ladder.length, so weeks 1/4/7/10, 2/5/8/11, 3/6/9 are load-identical"
  verified: "calculateWeight called directly across all 12 weeks + confirmed live at week 5 (135kg top set matched exactly)"
no_recalibration: { field: "stats.squat", detail: "set once at onboarding, never updated anywhere in the plan" }
tip_contamination:
  exercise: "Paused Low Bar Squat"
  contaminating_source: "Pain & Glory's weeks-9-16 deadlift-peaking description (variantTips.ts:88)"
plan_switch_bug: "third confirmation of shared dashboard state-leak (see Ritual of Strength, Bench Domination audits)"
systemic_load: { w1_9_weekly: 148, no_deload: true }
volume_w1: { quads: 26.0, glutes: 25.0, lats: 11.0, biceps: 3.6 }
audit: { date: 2026-08-14, findings: 5, verdict: "best-scoped specialisation plan in the portfolio; wave engine never actually intensifies phase-to-phase" }
```
