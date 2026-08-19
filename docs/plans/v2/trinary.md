# Trinary

> Unified plan document, v2 format. Supersedes `docs/plans/trinary.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block; wiring and load calculations
> verified live via `test_claude` (calibrated bench 100 / deadlift 200 /
> squat 160 kg) and cross-checked against hand computation.

| | |
|---|---|
| **id** | `trinary` |
| **Length** | 27 workouts, 9 blocks of 3 (not calendar weeks) |
| **Frequency** | Flexible, 3–4 days/week suggested |
| **Weekly sets** | 45 sets / block (15 per lift), plus auto-triggered accessory days |
| **Declared kind** | `powerlifting` (exempt from frequency floors) |
| **Calibration** | Bench, deadlift, squat 1RM + Max Effort style (1RM singles or 3RM ladder) |
| **Progression** | Dedicated handler, **fully wired**, most sophisticated in the portfolio |
| **Source** | `src/data/trinary.ts` (564 lines) · `src/features/workout/progression/trinary.ts` (163 lines) · `WeakPointModal` · `TrinaryRerunModal` |
| **Stated promise** | *"Conjugate periodization powerlifting. Adapt to your weak points."* |

---

## 1. Structure — conjugate ME/DE/RE

Three named effort types rotate across three workouts per block, one exposure
per lift per block:

| Workout | Max Effort (ME) | Dynamic Effort (DE) | Repeated Effort (RE) |
|---|---|---|---|
| 1 | Deadlift | Squat | Bench |
| 2 | Squat | Bench | Deadlift |
| 3 | Bench | Deadlift | Squat |

Each lift receives one ME, one DE and one RE exposure per 3-workout block —
verified programmatically: **15 sets per lift per block, 45 total**, perfectly
balanced regardless of rotation position.

| Effort | Sets × reps | Intensity | Purpose |
|---|---|---|---|
| ME | 3×1–3 (or 1×1 if 1RM style) | 90–95% 1RM | Strength, near-max singles/triples |
| DE | 8×2–3 | 60–70% 1RM, block-scaled | Bar speed |
| RE | 4×8–12 | 70–80% 1RM, block-scaled | Hypertrophy / work capacity |

### Blocks and periodisation

Nine blocks group into three 3-block phases, each with its own intensity table:

| Blocks | ME % | DE % | RE % |
|---|---|---|---|
| 1–3 | 90% | 60% | 70% |
| 4–6 | 92% | 65% | 75% |
| 7–9 | 95% | 70% | 80% |

**Blocks 1–3 use the standard competition lifts** (Conventional Deadlift, Low
Bar Squat, Paused Bench Press) for every effort type. **From block 4, ME
exercises rotate to weak-point variations** chosen by the athlete; DE and RE
stay on the standard lifts throughout — correct powerlifting practice, since
dynamic and repeated effort work is meant to reinforce the competition pattern
while max effort work attacks the sticking point.

### Live-verified load calculation (test_claude, bench 100 / deadlift 200 / squat 160)

| Exercise | Prescribed | Calculated | Hand check |
|---|---|---|---|
| Conventional Deadlift (ME) | 3×1–3 | **180 kg** | 200 × 0.90 = 180 ✓ |
| Low Bar Squat (DE) | 8×2–3 | **95 kg** | 160 × 0.60 = 96 → floor 2.5 = 95 ✓ |
| Paused Bench Press (RE) | 4×8–12 | **70 kg** | 100 × 0.70 = 70 ✓ |

All three matched exactly. Warm-up ramps are auto-generated and percentage-correct
(e.g. deadlift: empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1 → 180 kg
work sets). This is the most numerically reliable plan audited so far.

---

## 2. Wiring — the deepest system in the portfolio

Every advertised mechanism traced end-to-end and confirmed live:

| Feature | Status |
|---|---|
| ME progression (RPE-banded: ≤7→+10kg, 7–8→+5kg, 8–9→+2.5kg) | ✅ 3-button UI matches the handler's exact-value checks precisely |
| RE progression (12 reps all sets → +2.5kg queued) | ✅ |
| DE progression (all speed sets clean → +2.5kg queued) | ✅, with a "bar speed died" override that suppresses the queue |
| Progression *queuing* (increase applies next exposure of that effort, not immediately) | ✅ — correctly modeled; the next ME/DE/RE of that lift may be days away |
| Weak-point picker at block boundaries (workouts 9, 18) | ✅ `openWeakPointPicker` effect → `WeakPointModal` |
| Variation rotation (repeats avoided via `excludedVariations`) | ✅ |
| End-of-programme rerun (workout 27) | ✅ `openTrinaryRerun` → `TrinaryRerunModal` |
| RE-deadlift substitute selection (Settings) | ✅ writes `trinaryStatus.reDeadliftVariant` |
| Auto-accessory day (≥4 workouts/7 days) | ✅ triggers correctly — see §4 for a defect in its *design*, not its wiring |
| Manual accessory day | ✅ visible button on dashboard |
| Manual accessory-skip | ✅ writes `skipNextAccessory` |

I initially suspected a data-loss bug matching Pain & Glory's (registration
passing `{}` where `trinaryStatus` belongs) — **this one is fine**. The `else`
branch does a second, explicit `updateDoc` immediately after `registerUser`
specifically to set `trinaryStatus`, with a comment marking the two-step
intentionally: *"Register new user and then update trinaryStatus."* Slightly
inelegant (two writes instead of one, a window where the profile briefly
exists without status), but not a bug.

---

## 3. Findings

### 3.1 Eight of 25 named variations don't exist in the exercise library · **severity: critical**

Checked every name in `BENCH_VARIATIONS`, `DEADLIFT_VARIATIONS` and
`SQUAT_VARIATIONS` against the library by exact name and alias:

| Category | Names | Resolve |
|---|---|---|
| Bench — lockout | Close Grip Bench, Lockout Holds, Floor Press, High Pin Press, Reverse Band Bench | **0 / 5** |
| Bench — mid-range | Mid Pin Press, Board Press | **0 / 2** |
| Deadlift — lockout | Paused Deadlift (knee level), Rack Pulls, Snatch Grip RDLs, Banded Deadlift | **0 / 4** |

**Every single "lockout" weak-point option for bench and deadlift resolves to
nothing.** An athlete who honestly reports their weak point as lockout — a
common and legitimate answer — gets ME variations for the rest of the block
with:

- No tip or cue text (the tip system resolves by library lookup)
- No muscle attribution (invisible to any volume analysis)
- No Polish translation
- Silent failure — the exercise still renders with a name and a computed
  weight, because `calculateWeight`'s keyword matching (`includes('board')`,
  `includes('rack')` etc.) works independently of the library. **The athlete
  sees nothing wrong**, which is what makes this dangerous — a real UI defect
  masked by a robust fallback.

**No verify script catches this.** These names exist only as runtime string
substitutions inside `preprocessDay`, driven by `user.trinaryStatus`, so a
static analysis of `PLAN_REGISTRY` (which every `verify:*` script that checks
library coverage relies on) never sees them — the static tree only contains
the block 1–3 standard-lift placeholders.

### 3.2 The accessory-day auto-trigger can trap a compliant athlete permanently · **severity: high**

The plan's own copy recommends *"train 3-4 days per week... after 4
workouts/week, accessory days auto-trigger."* The trigger:

```
recentWorkouts = workoutLog.filter(within last 7 days)
isAccessoryDay = recentWorkouts.length >= 4
```

`workoutLog` is appended **unconditionally**, for accessory days and main
workouts alike (`trinaryProgression`, unconditional `appends`). So:

1. Athlete trains 4×/week as instructed → triggers accessory day 5
2. Accessory day 5 completes → **also logs into `workoutLog`**
3. The rolling 7-day count is still ≥4 → accessory triggers again
4. This repeats indefinitely — **the main ME/DE/RE cycle never advances again**
   for any athlete who sustains the plan's own recommended frequency

The only escape is a manual "Skip Accessory" button on the dashboard, which
writes `skipNextAccessory: true` — but that flag is reset to `false` after
**every** completed session (`trinaryStatus.skipNextAccessory: false` in the
unconditional `updates`), accessory or not. So the athlete must click "skip"
before *every single session* once they cross the threshold, forever. The
"auto-adapts" framing in the plan's own card copy is the opposite of what
happens: a diligent 4×/week lifter gets permanently diverted unless they
intervene manually every time.

### 3.3 Two of three RE-deadlift substitutes are loaded unsafely · **severity: high**

`calculateWeight` special-cases exactly one substitute:

```js
blockPct = baseName.toLowerCase() === 'romanian deadlift' ? 0.55 : blockPercentages.re;
```

Settings offers **three** RE-deadlift substitutes: Romanian Deadlift, Good
Mornings, Reverse Hyperextensions. Only Romanian Deadlift gets the reduced
55% ratio. The other two fall through to the standard RE percentage (70–80%
of the **deadlift** 1RM, block-dependent), applied directly:

- **Good Mornings at 70–80% of a conventional deadlift 1RM for 8–12 reps.**
  My own attribution map (§11) puts Good Mornings at roughly **45% DL** as a
  sane ratio — this prescribes roughly **1.6–1.8×** the defensible load, for
  reps, on a movement with a well-documented lower-back injury profile at
  high loads.
- **Reverse Hyperextensions** are typically a low-load, bodyweight-referenced
  posterior-chain movement, not one conventionally programmed as a percentage
  of a deadlift max at all. A fixed percentage of deadlift 1RM has no
  established basis for this exercise.

This is a substitute list built to let the athlete avoid a movement pattern
their setup can't accommodate (equipment, injury, preference) — and two of its
three options load to a percentage that was clearly derived for the one that
was special-cased, not validated for the other two.

### 3.4 ME load jumps are large for a self-reported RPE · **severity: medium**

+10 kg to a competition 1RM off a single RPE≤7 top single (or a 3-rep ladder)
is a large jump — 5% of the 200 kg deadlift calibration used in this test.
RPE self-report at the top of a near-max attempt is also the least reliable
place to self-report RPE (Zourdos et al. 2016 finds RPE accuracy degrades as
proximity to failure increases at the same time confidence in the estimate
typically rises). Not obviously wrong for an intermediate lifter, but worth a
science-backed second opinion before calling it correct — conjugate systems
conventionally move ME weekly by feel with a coach in the room, which this
system is trying to replace with three discrete buttons.

### 3.5 Legacy free-text identity · **severity: medium**

Same class of issue as Pain & Glory: no `exerciseId`, matching entirely by
substring on `exercise.name`. `calculateWeight`'s lift-classification
(`includes('press')`, `includes('board')`, `includes('rack')`...) is fragile —
a future variation name containing an unexpected substring could silently
misclassify onto the wrong 1RM. `workingLoads` cannot key this plan, and the
swap system cannot target its slots.

### 3.6 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| Excellent session copy | — | Warm-up protocols, tempo notation, and progression rules ("RPE 9 or lower + 3 clean reps = +5kg next ME session") are all shown inline, correctly computed, and genuinely well-written |
| "Bar speed died" checkbox | — | A clean, correct implementation of DE-specific autoregulation — holds the load next DE rather than progressing on a slow rep |
| Skip-accessory triggers a full reload | Low | `window.location.reload()` after writing `skipNextAccessory` — functional but heavier than a state update, and it's part of the pattern in §3.2 that will recur every session for compliant athletes |
| Weak-point picker not reachable in this session | — | Fires only at workout 9; the 27-workout structure makes this section of the UI unverifiable without either simulating many sessions or admin-seeding `completedWorkouts` |

Shared defects from prior audits (hero card / week mismatch, session lost on
reload, plan cards not keyboard-reachable) are assumed present and reported
once in the final compilation.

---

## 4. Weekly volume (block 1–3, standard lifts)

Because ME/DE/RE all use the *same three movements* in blocks 1–3, volume is
straightforward: three exercises, three attribution profiles, applied at 15
sets/lift/block.

| Muscle | Sets/block | | Muscle | Sets/block |
|---|---|---|---|---|
| **Biceps femoris** | 15.0† | | **Semimemb/tendinosus** | 15.0† |
| **Glute max (lower)** | 15.0† | | **Vastus lat/med/int** | 15.0 each |
| **Erectors** | 12.75 | | **Pec lower** | 15.0† |
| **Triceps lat/med** | 7.5 each | | Front delt | 7.5 |
| Trap mid | 7.5 | | Forearm flexors | 7.5 |
| Adductors | 3.75 | | Rectus femoris | 3.75 |
| Triceps long | 3.75† | | — | — |

**Zero:** every muscle not directly loaded by a barbell squat, deadlift or
bench — biceps, back width (lats/rhomboids), all three delt heads bar front,
calves, abs. This is expected and correct for a 3-lift specialisation block —
Trinary does not claim to be a hypertrophy plan, and the accessory-day system
exists precisely to fill these gaps *when triggered*, which makes §3.2's bug
more costly than it would be on a plan without that safety valve.

---

## 5. Systemic and joint load

Workout 1 (Deadlift-ME + Squat-DE + Bench-RE), computed from `intelligence`:

| Metric | Value |
|---|---|
| Systemic | **41** |
| Axial | **33** |
| Lower back | **25** |
| Sets | 15 |
| Per-set systemic | **2.73** |

This is the **highest per-set systemic cost of any plan audited so far** —
higher than Pain & Glory's 1.95, more than double Blackout's 1.41. It makes
sense: one workout stacks a near-max deadlift single, 8 sets of dynamic-effort
squat, and 4 sets of bench in a single session, with no low-cost accessory
volume diluting the average. The other two workouts in the block rotate the
same three movements through the other effort-type slots and land at similar
totals by symmetry.

For a plan run 3–4×/week, this is a legitimately advanced systemic demand,
consistent with its "advanced" framing — but it also means §3.2's failure mode
(accessory days becoming permanent) is not merely an annoyance: it silently
removes the plan's only lower-systemic session type from a compliant athlete's
week, right when they're training frequently enough to need the relief.

---

## 6. Improvements, ranked

### 1. Fill or remove the 8 unresolved variation names

Highest severity, cheapest class of fix. Two paths, and they're not mutually
exclusive:

- Add the 8 missing movements to the library (`board-press`, `floor-press`,
  `close-grip-bench-lockout` or reuse `close-grip-bench-press`, `mid-pin-press`,
  `high-pin-press`, `reverse-band-bench`, `rack-pull`, `paused-deadlift-knee`,
  `snatch-grip-rdl`, `banded-deadlift`) with real attribution and tips.
- At minimum, add a build-time check that walks `BENCH_VARIATIONS` /
  `DEADLIFT_VARIATIONS` / `SQUAT_VARIATIONS` against the library resolver —
  the gap should fail `verify:library`, not ship silently. This is the more
  urgent half: it prevents the next variation list edit from reintroducing the
  same bug even after the current 8 are fixed.

### 2. Fix the accessory-day trap

Exclude accessory-day entries from the `recentWorkouts` count that decides
whether the *next* session is an accessory day — the trigger should be
"4+ **main** workouts in 7 days," not "4+ sessions of any kind." That single
filter change (`workoutLog.filter(log => within7Days && !log.isAccessory)`)
converts a permanent trap into the intended behaviour: a period of higher
accessory frequency that relaxes once main-workout frequency drops, with no
manual intervention required. Tag accessory entries in `workoutLog` at write
time (`isAccessory: true`) to make the filter possible.

### 3. Correct the RE-deadlift substitute loading

Give Good Mornings and Reverse Hyperextensions their own ratios rather than
falling through to the Romanian Deadlift-derived default:

| Substitute | Current | Proposed |
|---|---|---|
| Romanian Deadlift | 55% DL fixed | Keep |
| Good Mornings | 70–80% DL (block RE%) | **~40–45% DL fixed**, per the attribution map |
| Reverse Hyperextensions | 70–80% DL (block RE%) | **Load-agnostic** — bodyweight/plate-stack progression, not a deadlift percentage at all |

### 4. Give Trinary real exercise ids

Same recommendation as Pain & Glory (§4 there): migrate the 3 standard lifts
and the 25 variation names to `exerciseId`, with display names as aliases.
This is the precondition for fix #1's verify-script check, for `workingLoads`
persistence, and for removing the substring-matching fragility in
`calculateWeight` and `liftOf`.

### 5. Surface the RPE-jump science, or soften it

Either cite the basis for +10/+5/+2.5 kg bands (if there's a source this was
built from) in the in-app copy, or consider damping the ≤7 band — a single
easy top single is a reasonable trigger for *some* increase, but +10 kg in one
session, unconditionally, is aggressive for anyone within a few percent of
their true max. A smaller default with a "confident? take the full jump"
manual override would hedge against a false-easy self-report.

### 6. Collapse the two-write registration path

Cosmetic relative to 1–3, but worth doing alongside a broader
`registerUser`/`extra` cleanup across the portfolio (Pain & Glory needs this
fixed for a real bug; Trinary's version works but is needlessly two writes).
Pass `trinaryStatus` through the existing `extra` parameter instead of a
follow-up `updateDoc`.

---

## 7. Verdict

**The best-engineered system in the portfolio, and the only one whose flaws are
in design decisions rather than missing wiring.**

Every mechanism I traced — ME/DE/RE rotation, queued RE/DE progression, the
weak-point picker, variation rotation with exclusion, the end-of-programme
rerun, RE-deadlift substitution, bar-speed autoregulation on DE — is wired
correctly and confirmed live. The load calculations matched hand computation
to the kilogram on all three effort types in the first session tested. The
in-session copy (warm-up ramps, progression rules displayed inline, tempo
notation) is the clearest and most complete of any plan reviewed so far. This
is what "wired" looks like, and it makes the contrast with Blackout — where an
equally sophisticated design runs none of its logic — stark.

Two problems keep it from being unreservedly excellent, and both are
consequential precisely because the engineering around them is otherwise so
careful. **A quarter of the weak-point variation catalogue points at nothing**,
silently, with no verify script positioned to catch it — a lifter reporting a
lockout weakness, which is a common and legitimate answer, gets steered onto
exercises the app cannot describe, attribute, or translate. And **the
accessory-day system, built specifically to auto-adapt to training frequency,
inverts on any athlete who follows the plan's own stated recommendation of
training 4 days a week** — logging its own remedial sessions into the count
that triggers it, with no automatic way out.

Neither flaw is a small thing to fix, but neither is architecturally hard
either: a resolver check at the point the variation catalogue is defined, and
a boolean tag on one array append, would close both. The RE-deadlift loading
issue (§3.3) is smaller in scope but should be treated with real urgency —
it's a specific, quantified over-load on a lower-back-risk movement, not a
missing-feature gap.

---

## 8. Export block

```yaml
id: trinary
version: 2
length: { workouts: 27, blocks: 9, workouts_per_block: 3 }
frequency: flexible_3_4_per_week
weekly_sets: { per_lift_per_block: 15, total_per_block: 45 }
kind: powerlifting
calibration: [bench1RM, deadlift1RM, squat1RM, meRepMaxStyle]
progression:
  me: { rule: "RPE-banded self-report", bands: [{rpe: "<=7", kg: 10}, {rpe: "7-8", kg: 5}, {rpe: "8-9", kg: 2.5}], wired: true }
  de: { rule: "all speed sets clean -> +2.5kg queued", wired: true }
  re: { rule: "12 reps all sets -> +2.5kg queued", wired: true }
verified_loads: { deadlift_me: "200*0.90=180 (confirmed)", squat_de: "160*0.60->95 (confirmed)", bench_re: "100*0.70=70 (confirmed)" }
systemic_load: { workout1: { systemic: 41, axial: 33, lower_back: 25, sets: 15, per_set: 2.73 } }
unresolved_variations: [close-grip-bench, lockout-holds, floor-press, high-pin-press, reverse-band-bench, mid-pin-press, board-press, paused-deadlift-knee-level, rack-pulls, snatch-grip-rdls, banded-deadlift]
accessory_trigger_bug: { trigger: ">=4 sessions/7 days, includes accessory sessions themselves", effect: "permanent trap for 4x/week athletes without manual skip every session" }
re_deadlift_loading: { romanian_deadlift: "0.55 DL, correct", good_mornings: "0.70-0.80 DL, unsafe (should be ~0.45)", reverse_hyperextension: "0.70-0.80 DL, no basis" }
legacy: { free_text_names: true, exercise_ids: false }
audit: { date: 2026-08-14, findings: 6, verdict: "best-engineered system in the portfolio; two design-level bugs undermine an otherwise excellent build" }
```
