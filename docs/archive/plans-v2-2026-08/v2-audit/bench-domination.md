# Bench Domination

> Unified plan document, v2 format. Supersedes `docs/plans/bench-domination.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`.

| | |
|---|---|
| **id** | `bench-domination` |
| **Length** | 16 weeks (13-week core + auto-inserted Week 9 deload + 3-week optional peaking) |
| **Frequency** | 6 days/week (4 bench-touching + 2 leg days) |
| **Weekly sets** | 95 (weeks 1–8), 95 (deload week 9, same count at reduced load), 97 (weeks 10–13), tapering to 12 (week 16) |
| **Declared kind** | `powerlifting` |
| **Calibration** | Paused Bench 1RM (required) + Wide-Grip/Spoto/Low Pin 1RMs (optional, else estimated as %s of paused bench) |
| **Source** | `src/data/program.ts` — **1,446 lines**, by far the largest and least structured plan file in the portfolio |
| **Stated promise** | *"Daily Undulating Periodization... Auto-regulating progression based on AMRAP test."* |

---

## 1. Headline finding

**"Weighted Pull-ups" — a module the plan explicitly sells as *"Back strength
for bench stability. Wed & Sat"* — is hardcoded to zero sets on Saturday in
every one of the 16 weeks, and on Wednesday in 12 of them.**

Three separate definitions of the same exercise exist in the source:

| Location | Day | Sets (weeks 1–9) | Sets (weeks 10–13) | Sets (weeks 14–16, peaking) |
|---|---|---|---|---|
| `program.ts:264` | Wednesday | **0** | 4 (patched by a dedicated `weekNum >= 10 && <= 13` block) | — |
| `program.ts:371` | Saturday | **0** | **0** — never patched | — |
| `program.ts:93` | Wed-equivalent (peaking) | — | — | 3, correctly defined |

The week 10–13 patch (`WEIGHTED PULL-UPS PROGRESSION`) explicitly checks
`day.dayOfWeek === 3` — it only ever touches the Wednesday slot. The Saturday
occurrence at line 371 has no corresponding fix anywhere in the file; I
searched for every write to `.sets` near a `"Weighted Pull-ups"` match and
found none beyond the three sites above.

**Confirmed live.** After registering with default modules
(`weightedPullups: true`, the plan's own recommended default), Wednesday's
session showed:

- Paused Bench Press, Spoto Press, Y-Raises, Around-the-Worlds: all render
  with numbered set rows (1, 2, 3, 4…) matching their prescription.
- **Weighted Pull-ups: no numbered set rows at all.** Just *"Sets: 0/15, Total
  reps: 0"* and a bare `+ ADD SET` control — the same affordance used for
  optional bonus work on every other plan in the portfolio. The athlete gets
  a real prescribed exercise unless they manually build their own set from
  scratch.

**Quantified cost.** Tallying week-1 muscle volume from the attribution map:
`chest = 28.0`, `frontDelt = 17.2`, `triceps = 11.9` — and **lats and biceps
do not appear in the tally at all**, because a 0-set exercise contributes zero
to any muscle regardless of its attribution. A plan that explicitly designed
weighted pull-ups as the structural counterbalance to five weekly pressing
sessions delivers a chest-to-back sets ratio that, for 9 of 16 weeks, is
effectively infinite in one direction. This is not a stylistic choice the
plan is making — the source comments, the module description shown at
onboarding, and the dedicated week 10–13 progression patch all show the
intent was real, tracked pull-up work throughout.

---

## 2. Structure

### Weekly template (weeks 1–8, 95 sets)

| Day | Focus | Sets | Key work |
|---|---|---|---|
| Mon | Heavy Strength | 16 | Paused Bench 4×3 @ 82.5%, Wide-Grip 3×6-8, Behind-Neck Press, Tricep Giant Set, Dragon Flags |
| Tue | Legs | 19 | Walking Lunges, Heels-Off Leg Press, Reverse Nordic Curls, Hip Thrust, Nordic Curls, Calf Raises, Hip Adduction |
| Wed | Volume/Hypertrophy | 15 | Paused Bench 4×5-10 @ 72.5%, Spoto Press, **Weighted Pull-ups (0)**, Y-Raises, Around-the-Worlds |
| Thu | Power/Speed | 16 | Paused Bench 5×3-5 @ 65%, Low Pin Press, Behind-Neck Press, Tricep Giant Set, Dragon Flags |
| Fri | Legs | 19 | Same as Tuesday |
| Sat | AMRAP Test | 10 | Paused Bench AMRAP @ 67.5% + 3×5 back-off, Wide-Grip, **Weighted Pull-ups (0)**, Y-Raises |

Bench is touched **four days a week** (Mon, Wed, Thu, Sat) at four different
intensities — a genuine daily-undulating structure, and the one clearly
deliberate, well-executed part of the design.

### The 16-week arc

| Weeks | What happens |
|---|---|
| 1–8 | Main block, 95 sets/week, structure above |
| **9** | **Auto-inserted deload** — every exercise's day name gets " DELOAD" appended; volume/intensity cut (verified: still 95 total sets counted, but percentages and set counts are reduced within each exercise per the source's deload branch) |
| 10–13 | Main block resumes, 97 sets/week (Weighted Pull-ups partially fixed — Wednesday only) |
| 14–15 | Optional peaking block (doubles → singles, AMRAP-driven), 27 sets/week |
| 16 | Taper into a 1RM test day ("Judgment Day"), 12 sets, 5 days |

The week-9 insertion and the 9→16 renumbering (`RENUMBER WEEKS` in the
source) are executed correctly — I traced the shift arithmetic and it lines
up with the displayed week numbers. This is the same class of scheduling
complexity as Ritual's purge weeks, solved competently, just far more
verbosely and without the comments-as-decisions hygiene Ritual's file has.

### Auto-regulation — genuinely sophisticated

`getPausedBenchBase()` implements a real e1RM-checkpoint system: the working
base compounds weekly from Saturday's AMRAP performance (small `+2.5kg` bumps
when a rep threshold is hit), but at weeks 5, 9 and 13 it **resets** to a
fresh Epley e1RM calculated from the checkpoint week's actual AMRAP — flooring
to 2.5kg, discarding the accumulated small bumps so they don't stack on top of
a freshly-tested max. This is the same discipline Trinary and Ritual show
elsewhere in the portfolio (never let an estimate compound on top of another
estimate), implemented independently a third time. `getPowerDayBenchBase()`
is separately and correctly documented as non-compounding — Thursday's weight
is always 65% of *last week's* AMRAP e1RM, recalculated fresh, never carrying
its own momentum. Both are sound designs, buried in a file that badly needs
to be split apart.

---

## 3. Findings

### 3.1 Weighted Pull-ups prescribes zero sets for most of the program · **severity: critical**

Detailed in §1. This is the most severe single-exercise defect found in the
audit — worse than Blackout's dead feature-module (§ prior audit), because
here the exercise *appears* in every session, with real tips and warm-up
copy, giving every visual signal of being a working prescription while
delivering none.

### 3.2 Switching into this plan does not initialize its progress state · **severity: high**

Registering fresh into Bench Domination from a different active plan
(`test_claude` had just been on Ritual, week 5) produced a dashboard reading
**"NEXT SESSION — WEEK 5"** despite `programProgress['bench-domination']` not
existing in Firestore at all — confirmed by direct document read immediately
after registration. `completedSessions: 0` was correctly written at the top
level; the week-5 figure is stale client state from the previously-viewed
plan, never reset by `switchProgram()`.

**This generalizes the routing bug found on Ritual of Strength** (§3.1 of
that audit) to a second, structurally different mechanism: there it was the
dashboard ignoring a real `ritualStatus.currentWeek` field in favour of a
hardcoded default; here it's the dashboard failing to reset *at all* when the
active plan changes, carrying over a number that has no relationship to the
new plan. Two different code paths, same user-facing failure — a
freshly-registered athlete does not land on their actual first session. The
content shown for Bench Domination happened to be harmless in this instance
(weeks 1–8 are structurally identical, so "week 5" content matches "week 1"),
but that is luck specific to this plan's design, not a property of the fix.

### 3.3 1,446-line single file with visible design indecision · **severity: medium (maintainability)**

Inline comments preserved in the shipped file read as unresolved internal
debate rather than documentation:

> *"Week 15 Day 1 is Rest or Prep? ... Let's assume Mon is Rest/Light, Sat is
> Test? Or Mon is Test? ... Let's put it on Saturday (Test Day) or Day 1? ...
> Let's keep Test on Saturday for consistency, or standard Meet day. Let's put
> it on Saturday (Day 6)."*

This isn't a style complaint — it's the same class of risk as §3.1. A file
this size, with this much unresolved back-and-forth left in place, is exactly
where a hardcoded `sets: 0` placeholder gets shipped and never comes back to
be finished. Every other plan in the portfolio audited so far lives in a
150–600 line file with a clear day-builder/progression-handler split; this
one is 2.4–9.6× larger than any of them and mixes generation, deload
insertion, renumbering, progression, and module-filtering in one file.

### 3.4 Leg days repeat the reverse-nordic-curl misattribution · **severity: medium**

Both leg days prescribe `Reverse Nordic Curls` (2×Failure) as accessory work
alongside `Nordic Curls` (3×Failure). Per the attribution map (§9 of the
shared analysis), `reverse-nordic-curl` is filed as `knee-flexion` /
`hamstrings` in the library but is mechanically a loaded knee-*extension*
movement — the same misattribution already flagged in Quadfather. Here it
means two of the plan's four weekly leg-day hamstring accessory slots are
mislabelled quad work, understating actual hamstring volume in any analysis
that trusts the library's current classification (including this one, before
the correction).

### 3.5 Module system is a genuine strength, undersold by the bug it can't prevent

The `benchDominationModules` system (tricep giant sets, behind-neck press,
weighted pull-ups, leg days, accessories — each independently toggleable) is
well designed: turning off leg days correctly wipes Tuesday/Friday and renames
the day to "Rest," and the smart day-reassignment logic
(`Smart Day Assignment for Custom Schedules`) reflows the six-day template
onto however many days the athlete actually selects. None of this machinery
can compensate for §3.1, since the module being *on* (the recommended default)
is precisely the state in which the bug fires.

### 3.6 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| RIR selector on Wednesday's bench sets | — | Clean implementation: "Leave 2 reps in reserve on Set 1 & 2 and 1 rep on Set 3 & 4," with a 0/1/2/3+ RIR picker matching the copy |
| Warm-up ramps | — | Auto-generated and percentage-consistent on every exercise checked |
| Est. 1RM widget | — | Dashboard correctly displays "100 kg — Calculated max" from the onboarding input |
| Active Modules summary | — | Dashboard lists all five modules by their on/off state clearly |
| Weighted Pull-ups progress readout | Low | "Sets: 0/15, Total reps: 0" reads as a broken counter even setting the 0-sets bug aside — "0/15" implies a target of 15 total reps that's never stated anywhere in the visible copy |

---

## 4. Weekly volume (week 1, as actually delivered — including the bug's effect)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Chest** | **28.0** | | Glutes | 18.0 |
| Front delt | 17.2 | | Hamstrings | 15.9 |
| Quads | 12.0 | | Triceps | 11.9 |
| Rear delt | 11.0 | | Calves | 9.3 |
| Abs | 6.0 | | Adductors | 6.0 |
| Upper back | 3.6 | | Rotator cuff | 3.6 |
| Side delt | 2.6 | | Obliques | 2.0 |
| **Lats** | **0** | | **Biceps** | **0** |

Chest at 28 direct sets/week is far above any hypertrophy ceiling in the
portfolio — appropriate only because this is a strength specialisation plan
where most of that volume is at 65–92.5% 1RM, not hypertrophy-rep-range work.
The **complete absence of lats and biceps** is the direct, quantified
consequence of §3.1 — not a designed feature of a "chest-and-triceps
specialisation" plan, since the plan's own module description and dedicated
progression system prove back work was intended to be present throughout.

---

## 5. Systemic and joint load

Week 1 totals, computed from `intelligence`:

| Metric | Value |
|---|---|
| Systemic | **139** |
| Axial | **28** |
| Sets | 95 |
| Per-set systemic | **1.46** |

Lower in axial cost than any of the other powerlifting plans audited
(Trinary 33, Ritual 18, Pain & Glory's single-day figure of 25) because most
of the systemic load here comes from repeated *pressing*, which the
`intelligence` model correctly scores as lower-axial than squatting or
deadlifting. At 95 sets/week this is nonetheless the highest total weekly set
count of any powerlifting plan audited — high frequency, moderate per-set
cost, six days a week.

---

## 6. Improvements, ranked

### 1. Fix the Weighted Pull-ups set count

The single highest-impact fix available anywhere in this audit so far. Set
`sets: 3` (matching the peaking block's own correct definition) at both
line 264 and line 371, or better, extract a single shared exercise-builder
function so the three definitions can't drift independently again — which is
exactly how this happened the first time.

### 2. Fix plan-switch progress initialization

`switchProgram()` needs to either write a fresh
`programProgress[newPlanId]` entry immediately, or the dashboard's
next-session resolver needs to stop trusting stale client state across a plan
change. Given this is now confirmed on both Ritual (ignoring real state) and
Bench Domination (no state to ignore, stale value shown anyway), this belongs
in the shared dashboard code, not a per-plan patch — see the equivalent
recommendation in the Ritual of Strength audit.

### 3. Split `program.ts` into a day-builder and a progression module

Every other plan in the portfolio separates static day generation
(`src/data/plans/*.ts`) from save-time progression
(`src/features/workout/progression/*.ts`). Bench Domination predates that
convention and never migrated. Splitting it is the structural fix that
prevents a future §3.1 — a 1,446-line file with three independent copies of
the same exercise definition is where that bug lives comfortably.

### 4. Remove the design-indecision comments before they ship again

Resolve the Week 15 Day 1 placement question (the comments show at least
three considered options) and delete the reasoning trail. If the answer
genuinely doesn't matter, pick one and say why in one line — not leave the
debate in production code.

### 5. Correct the Reverse Nordic Curl attribution (shared fix)

Same recommendation as Quadfather: reclassify `reverse-nordic-curl` to
`knee-extension` / `rectusFemoris` in the library. Fixes the hamstring-volume
overstatement here and in every other plan using the movement.

### 6. Give the Weighted Pull-ups progress readout a real denominator

"Sets: 0/15" implies a 15-rep target that appears nowhere in the visible
copy (the note says "3-5 reps EMOM for 12-15 minutes," which is a *duration*,
not a rep count). Once §1 is fixed and real sets are prescribed, make sure
the progress readout's denominator matches something the athlete can see.

---

## 7. Verdict

**The plan's central identity — daily-undulating bench frequency with
genuine AMRAP-driven auto-regulation — is well engineered. Its supporting
structure work is not just weak, it is silently absent for most of the
program's length, contradicting what the plan explicitly sells at
onboarding.**

The bench-specific machinery here is some of the best in the portfolio: four
weekly bench exposures at different intensities, a real e1RM-checkpoint
system that resets cleanly at weeks 5/9/13 rather than compounding
estimate-on-estimate, a non-compounding Thursday power-day calculation
documented as deliberately different from the main progression, and a
correctly-executed auto-inserted deload with week renumbering. Judged purely
on how it trains a bench press, this is a serious, well-thought-out system.

But "Weighted Pull-ups — Back strength for bench stability" is presented to
every athlete at onboarding as a real, trackable module with its own
progression system, and for 9 of 16 weeks it delivers a session with no
numbered sets at all — an empty slot dressed as an exercise. The resulting
volume profile (28 direct chest sets, zero lats, zero biceps, in week 1
alone) is precisely the muscular imbalance the module exists to prevent. This
is not a design trade-off available for debate; it is dead code that looks
like a live prescription, in the same family as the routing bug that also
misdirects a fresh Ritual registration and — now confirmed — misdirects a
fresh Bench Domination registration too. Two separate, real bugs
independently pointing at the same underlying weak spot: what a brand-new
athlete sees in the first minutes after choosing this plan is not reliably
what the plan intends to show them.

---

## 8. Export block

```yaml
id: bench-domination
version: 2
length: { weeks: 16, core_weeks: 8, deload_week: 9, resume_weeks: [10,13], peaking_weeks: [14,16] }
frequency: 6_per_week
weekly_sets: { w1_8: 95, w9_deload: 95, w10_13: 97, w14_15: 27, w16: 12 }
kind: powerlifting
calibration: [pausedBench1RM, wideGripBench1RM_optional, spotoPress1RM_optional, lowPinPress1RM_optional]
progression:
  checkpoint_e1rm: { rule: "Epley from AMRAP at weeks 4/8/12, floored, resets accumulated bumps", wired: true }
  weekly_amrap_bump: { rule: "+2.5kg if rep threshold hit", wired: true }
  power_day: { rule: "65% of last AMRAP e1RM, non-compounding, recalculated weekly", wired: true }
systemic_load: { weekly: 139, axial: 28, sets: 95, per_set: 1.46 }
volume_w1_top: { chest: 28.0, glutes: 18.0, frontDelt: 17.2 }
volume_w1_zero: [lats, biceps]
critical_bug:
  area: "Weighted Pull-ups exercise definition"
  detail: "sets:0 hardcoded at two of three definition sites (program.ts:264 Wed, program.ts:371 Sat); Sat never patched in any week; Wed patched only weeks 10-13"
  confirmed: "live rendering shows 'Sets: 0/15' with no numbered set rows"
plan_switch_bug:
  area: "switchProgram() / dashboard next-session resolver"
  detail: "programProgress['bench-domination'] absent from Firestore after fresh registration; dashboard showed stale 'Week 5' carried over from previously-viewed plan"
audit: { date: 2026-08-14, findings: 6, verdict: "excellent bench-specific engineering; back-work module silently delivers nothing for 9 of 16 weeks" }
```
