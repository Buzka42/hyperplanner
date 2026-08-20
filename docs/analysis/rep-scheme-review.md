# Rep schemes and runtime health — all 36 plans

*2026-08-20, against `main`. Measured by walking every week and every training
day of every plan through that plan's own `preprocessDay` hook — 1,347 training
days in total — and recording the prescription the athlete actually receives.*

---

## 1. Runtime health: clean

All 36 plans, all 1,347 training days, checked for: exceptions thrown, empty
days, duplicate exercise ids within a day, `sets: 0`, empty rep targets,
unresolvable exercises, and `NaN`/`Infinity`/negative leaking into
`calculateWeight`.

**40 flags, all benign, in two groups:**

| Flag | Count | Verdict |
|---|---:|---|
| `"Tricep Giant Set"` does not resolve in the library | 35 | **By design.** It is a giant-set container, not a movement. `tricepGiantSet.ts:5` says so outright: *"The container name is not a library id — volume analysis expands these steps."* |
| Bench Domination `Rest / Mobility` / empty Wednesday, weeks 14–16 | 5 | **By design.** `program.ts:87` pushes an explicit `sets: 0` rest marker during the peaking block. |

**No crashes, no duplicate ids, no NaN loads, no empty prescriptions anywhere.**

---

## 2. The copy-paste has a single root cause

Your instinct was right, and it is structural rather than a habit. Every plan
built on `definePlan()` declares a local slot helper **with a default rep
range**, and every slot that does not explicitly override it inherits that
default:

```ts
// venusRising.ts:6
const slot = (ex, sets, reps = '8-12', restSeconds = 75) => ({ ... });
// athena.ts:8
const s = (ex, sets, reps = '6-10', restSeconds = 90) => ({ ... });
// kali.ts:6 · quadfather.ts:16 · cathedral.ts:18 — all default '8-12'
```

So a plan's rep differentiation is exactly *how often its author bothered to
override the default*. Plans where the author overrode deliberately (Quadfather,
Iron Clock, Project Chimera, Oracle) are well differentiated. Plans that leaned
on the default are uniform — and the default gets applied to lateral raises,
calves and planks just as readily as to squats.

**Important correction to the first pass:** an aggregate "heavy compounds vs
isolation" metric flagged 13 plans, but reading the actual prescriptions showed
most of those were false positives — goblet squats, hip-supported dumbbell
deadlifts and loaded carries are not the heavy barbell work in question, and
several plans that scored badly (Quadfather, Workhorse, The Minimum, Iron Clock)
turn out to have a genuine, deliberate spread. **Only three plans are actually
copy-pasted.** The list below reflects the readings, not the metric.

---

## 3. Plans that need a change

### 3.1 Athena — the clearest case · **high**

Declared job: *strength, intermediate, fatigue 3 — "A bridge into heavy
training: top sets with editable back-offs and no mandatory max test."*

**20 of 23 movements are prescribed `6-10`.** That single range currently covers
the Ab Wheel, Cable Crunch, Leaning One-Arm Lateral Raise, Pec Deck, Leg
Extensions, Hack Squat Calf Raises and Seated Hamstring Curl. Only Barbell
Squat, Flat Bench and Standing Military differ, at `6-8`.

Two things are wrong at once. A lateral raise or a calf raise at 6 reps cannot
be loaded well — the range fights the movement. And for a plan whose whole
mechanic is a **top set with a back-off**, `6-8` is too high on the main lifts:
a top set is meant to be a genuine heavy single-ish effort, and 8 reps is a
hypertrophy set.

| Exercise | Current | Proposed | Why |
|---|---|---|---|
| Barbell Squat, Flat Barbell Bench Press, Standing Military Press | 6-8 | **4-6** | These are the top sets the back-off mechanic hangs off. 4-6 makes the top set genuinely heavy and leaves the back-off meaningful. |
| Paused Squat, Romanian Deadlift | 6-10 | **5-8** | Secondary barbell strength work; still loaded, one notch above the top sets. |
| Incline DB Bench, Shoulder Press, Single-Arm Hammer Row, Assisted Pull-ups, FFE Bulgarian, Hip Thrusts | 6-10 | **8-12** | Loaded accessories. 8-12 is where they produce without competing with the top sets. |
| Leg Extensions, Lying Leg Curls, Seated Hamstring Curl, Pec Deck, Cable Triceps Ext, Rolling DB Tricep Ext, Straight-Bar Curl | 6-10 | **10-15** | Isolation. Tension and stretch drive these, not load. |
| Leaning One-Arm Lateral Raise, Rear Delt Fly | 6-10 | **12-20** | Side and rear delts are not loadable at 6 reps with clean mechanics. |
| Hack Squat Calf Raises | 6-10 | **12-20** | Calves need the higher dose. |
| Ab Wheel, Cable Crunch | 6-10 | **10-15** | Core. |

**Cheapest implementation:** change the `s()` default at `athena.ts:8` from
`'6-10'` to `'8-12'` and add explicit overrides for the main lifts (low) and the
delt/calf/core slots (high). That flips the default from wrong-for-most to
right-for-most.

### 3.2 Venus Rising — including one outright bug · **high**

Declared job: *hypertrophy, beginner→intermediate, fatigue 2 — a first
structured plan.*

**21 of 27 movements sit at the `8-12` default.**

**The bug:** `slot('plank', 2)` at `venusRising.ts:12` gives the plank
`reps: '8-12'`. Plank is `weightMode: 'timed'` in the library
(`library.ts:1386`) — it is an isometric hold. Every other plan prescribes it in
seconds (Skeleton uses `${plankTargetSeconds}sec`). "8-12 reps" of a plank is
not a prescription anyone can follow.

| Exercise | Current | Proposed | Why |
|---|---|---|---|
| **Planks** | **8-12** | **`30-60sec`** | It is a timed isometric. This is a defect, not a preference. |
| Hack Squat Calf Raises (×2 slots) | 8-12 | **12-20** | Calves. Note Venus is the only plan in the catalogue prescribing calves at 8-12. |
| Machine Hip Abduction | 8-12 | **12-20** | Small muscle, short range. |
| Cable Crunch | 8-12 | **10-15** | Core. |
| Machine Curl | 8-12 | **10-15** | Isolation. |
| Leg Extensions, Lying Leg Curls, Seated Hamstring Curl | 8-12 | **10-15** | Isolation; the compounds beside them already own 8-12. |
| Heel-Elevated Goblet Squat, Leg Press, Hip Thrusts, B-Stance Hip Thrust | 8-12 | keep **8-12** | Correct for a beginner hypertrophy plan. Do **not** push these lower — the plan's job is teaching effort, not maximal load. |

### 3.3 Kali — compounds right, accessories uniform · **medium**

Declared job: *strength + conditioning, fatigue 3 — "A cutting plan that
protects strength: one systemic anchor a session and preservation bands."*

Kali's heavy work is **already correct and deliberately differentiated**: High
Bar Squat `3-6`, Paused Bench `3-6`, Romanian Deadlift `4-6`, Assisted Pull-ups
`4-6`. That is exactly right for protecting strength in a deficit.

The problem is everything else: **22 of 29 movements sit at the `8-12` default**,
including Cable Lateral Raise, Lateral Raises, Machine Hip Abduction, Hack Squat
Calf Raises, Machine Curl, Leg Extensions and Cable Crunch.

| Exercise | Current | Proposed | Why |
|---|---|---|---|
| Cable Lateral Raise, Lateral Raises | 8-12 | **12-20** | Side delts. Side-Lying Rear Delt Flyes is already correctly at 12-20 — the other delt slots were simply not overridden. |
| Hack Squat Calf Raises | 8-12 | **12-20** | Calves. |
| Machine Hip Abduction | 8-12 | **12-20** | Small muscle. |
| Machine Curl, Leg Extensions, Lying Leg Curls, Seated Hamstring Curl, Cable Triceps Ext, Overhead Tricep Ext | 8-12 | **10-15** | Isolation. On a cut, the higher-rep accessory work is also the cheaper work systemically — which serves the plan's own stated goal. |
| Cable Crunch | 8-12 | **10-15** | Core. |
| Hack Squat, Leg Press, Dip, Smith Incline, pulldowns/rows | 8-12 | keep **8-12** | Correct: these are the volume work behind the heavy anchor. |

### 3.4 Pencilneck Eradication — two movements only · **low**

Otherwise well spread (`8-12` compounds → `20-30` face pulls). Two are off:

| Exercise | Current | Proposed | Why |
|---|---|---|---|
| Front Squats | 10-15 | **6-10** | A front squat at 15 reps is limited by thoracic position and breathing, not by the quads. The set ends for the wrong reason. |
| Close-Grip Bench Press | 10-14 | **6-10** | It is on the plan's list of compounds and is the day's heavy triceps driver; it earns its stimulus through load. |

### 3.5 Cathedral — one inversion · **low**

Chest work is properly spread (`6-10` incline → `12-20` crossover). But **Leg
Press sits at `6-10`** — the heaviest rep prescription in a plan whose legs are
explicitly maintenance work. Propose **10-15**: same maintenance stimulus, far
less systemic cost taken away from the chest specialisation.

---

## 4. Plans deliberately left alone

Verified as correct for their stated job — no change proposed:

| Plan | Why no change |
|---|---|
| Purgatorio | High-rep suffering with rest as the prescription **is** the plan. Two rep ranges is the identity. |
| Tenfold | 10×10. Uniformity is the method. |
| Blackout | One all-out work set; a rep range means something different here. |
| Lazarus | Compounds sit *above* isolations on purpose — a return-from-layoff plan should not prescribe heavy triples. |
| Trinary, Ritual of Strength, Pain & Glory, Bench Domination | Powerlifting. Already low where it matters (Trinary mean 4.8), with RE days correctly at 8-12. |
| Iron Clock, REDLINE | Density and timed blocks. Hack Squat 5-8, Paused Bench 4-6, RDL 5-8 already differentiated; carries are in steps, not reps. |
| Quadfather | The load/depth/burn roles produce a real spread: Hack Squat 5-8, RDL 6-10, Leg Press 10-15, Leg Extensions 12-15, calves 12-20. |
| Project Chimera, Oracle | Trap-Bar 4-6, Squat 5-8, Bench 5-8 against isolations at 10-20. Well differentiated. **Note:** changing Oracle's prescriptions degrades its prediction mechanic — leave it alone specifically. |
| Workhorse, King of the Squat, Overhead Dominion, Immaculate (Re)Structure, Neural Overload, Hamstring Foundry | Main lift correctly low (Weighted Chin-Up 3-5, RDL 5-8, PAP singles) against isolations at 12-20. |
| Monolith, Event Horizon, The Minimum | Machine-led but genuinely spread, 6-10 through 12-20. |
| House of Iron | Progresses by difficulty ladder, not load. A rep-range proposal would be meaningless. |
| Gravity Is Optional, Apex Predator, Arms Race, Peachy, Skeleton, Super Mutant, 30 Minute Adventure | No heavy barbell work, or already appropriate. |

---

## 4a. What was implemented

All of §3 was accepted and shipped on 2026-08-20 (`cac5b5c`), with two
additions found during implementation:

- **Lazarus was prescribing planks as `8-12` reps too.** Venus Rising was not
  the only plan with the bug — the same slot-helper default had leaked into
  Lazarus's plank slot. Both now read `30-60sec`.
- **Purgatorio's plank-to-failure was left alone.** Holding until you drop is a
  real prescription for a hold, and the goal logic falls back to beating the
  athlete's own best when there is no numeric target.

Timed exercises now have their own console: a time field in seconds, no weight
field for unloaded holds, and the weight field kept for loaded carries, which
are still weight × time. The app tracks the longest completed hold and suggests
what to beat. `npm run verify:timed` asserts all of it, including that no plan
prescribes a hold in a range too short to be one — the check that caught
Lazarus.

Athena now spans five rep ranges from 4-6 to 12-20 where it spanned three;
Kali five; Venus Rising four including the timed plank.

---

## 5. Recommended order

1. **Venus Rising plank → `30-60sec`.** A defect, not a preference. One line.
2. **Athena's `s()` default → `8-12` plus explicit overrides.** Biggest
   correctness gain per edit; currently mis-serves both ends of the plan.
3. **Kali's accessory overrides** (delts, calves, abduction, isolation).
4. **Pencilneck's Front Squat and Close-Grip Bench**; **Cathedral's Leg Press.**

A structural follow-up worth considering: the `slot()` default is what lets this
drift in silently. Making the `reps` argument **required** in the `definePlan`
slot helpers would force every future plan to state a rep range per movement,
and the compiler would find every slot that had been coasting on a default.

---

## 6. Reproducing

The runtime walk and rep inventory came from a temporary probe over
`PLAN_REGISTRY`, running each plan's own `preprocessDay` across every week.
Per-plan prescriptions are also visible in the generated docs under
[`docs/plans/`](../plans/INDEX.md), and the measured metrics in
`docs/analysis/plan-facts.json`.
