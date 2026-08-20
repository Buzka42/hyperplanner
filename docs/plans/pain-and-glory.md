# Pain & Glory

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `pain-and-glory` |
| **Length** | 16 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 74 across 4 training days (week 1 sample) |
| **Sets/session** | 18.5 |
| **Goal** | strength, specialisation |
| **Experience** | intermediate, advanced |
| **Equipment** | barbell, full-gym |
| **Adaptability** | responsive |
| **Fatigue cost** | 4/4 — very high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `preprocessDay`, `calculateWeight`, `getExerciseAdvice` |
| **Techniques used** | `last-set-failure` |
| **Card promise** | *"Pain today, glory tomorrow."* |

---

## 1. What this plan is

**Signature mechanic.** Deadlift specialisation where the deficit work is dosed by how wrecked the last one left you.

The onboarding card claims:

- Focus: Heavy Deadlifting
- 4 Days / Week - Pull/Push
- 16 Week Program with Peaking
- Self-regulating via RPE feedback

**Prerequisites.** A conventional deadlift max you trust; Tolerance for heavy pulling

**Not for you if.**

- Your lower back is your limiting factor
- You want a plan that goes easy on you

**Follow-ups.** [trinary](trinary.md), [atlas](atlas.md), [ritual-of-strength](ritual-of-strength.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Pull Day | 6 | 22 | Deficit Snatch Grip Deadlift 10×6, Close Neutral Grip Lat Pulldown 4×6-10, Slow Eccentric Cheat Nordic Curls 2×4-8, Single-Leg Machine Hip Thrust 2×8-12, Dead Hang 2×20-40, Planks 2×20-40 |
| Push Day | 5 | 15 | Paused Low Bar Squat 4×4-6, Leg Extensions 2×6-10, Hack Squat Calf Raises 2×15-20, Incline DB Bench Press 4×6-10, Standing Military Press 3×6-10 |
| Push Day | 5 | 15 | Paused Low Bar Squat 4×4-6, Leg Extensions 2×6-10, Hack Squat Calf Raises 2×15-20, Paused Bench Press 4×5-8, Machine Rear Delt Fly 3×12-20 |
| Pull Day | 6 | 22 | Deficit Snatch Grip Deadlift 10×6, Close Neutral Grip Lat Pulldown 4×6-10, Slow Eccentric Cheat Nordic Curls 2×4-8, Single-Leg Machine Hip Thrust 2×8-12, Dead Hang 2×20-40, Planks 2×20-40 |

### Week-to-week shape

The program runs 16 weeks falling into 4 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3, 4, 5, 6, 7, 8 | Pull Day 22, Push Day 15, Push Day 15, Pull Day 22 |
| 9, 10, 11, 12 | Pull Day 22, Push Day 15, Push Day 15, Pull Day 18 |
| 13, 14, 15 | Pull Day 16, Push Day 15, Push Day 15, Pull Day 16 |
| 16 | Pull Day 14, Push Day 15, Push Day 15, Pull Day 16 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 32 | above the 20-set ceiling |
| back | 28 | above the 20-set ceiling |
| hamstrings | 24 | above the 20-set ceiling |
| quads | 12 | in band |
| shoulders | 10 | in band |
| chest | 8 | below the 10-set growth dose |
| biceps | 4 | below the 6-set growth dose |
| calves | 4 | below the 6-set growth dose |
| core | 4 | below the 6-set growth dose |
| triceps | 0 | no direct sets |

**Untrained groups:** `triceps`.

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 0.56 |
| Quad:hamstring | 0.5 |
| Groups covered (4+ sets) | 9 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **141** |
| Axial | **90** |
| Lower back | 76 |
| Per-set systemic | 1.91 |
| High-systemic sets (cost 3+) | 28 |
| Compound share | 53% |
| Shoulder / knee / elbow cost | 25 / 32 / 23 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2.3 |
| Mean stability demand (0-4) | 1.43 |
| Stimulus per unit fatigue | 1.21 |
| Failure-safe share of sets | 20% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 22 |
| At 1 set | 0 |
| At 2 sets | 12 |
| At 3 sets | 2 |
| At 4+ sets | 8 |
| Mean sets per slot | 3.36 |
| Distinct exercises | 13 |
| Variety density (exercises per 10 sets) | 1.76 |
| Largest single-exercise share | 27% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (8):**

- Pull Day — Deficit Snatch Grip Deadlift, 10 sets *(session opener)*
- Pull Day — Close Neutral Grip Lat Pulldown, 4 sets
- Push Day — Paused Low Bar Squat, 4 sets *(session opener)*
- Push Day — Incline DB Bench Press, 4 sets
- Push Day — Paused Low Bar Squat, 4 sets *(session opener)*
- Push Day — Paused Bench Press, 4 sets
- Pull Day — Deficit Snatch Grip Deadlift, 10 sets *(session opener)*
- Pull Day — Close Neutral Grip Lat Pulldown, 4 sets

---

## 6. Rep schemes

9 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `12-20` | Machine Rear Delt Fly |
| `15-20` | Hack Squat Calf Raises |
| `20-40` | Dead Hang, Planks |
| `4-6` | Paused Low Bar Squat |
| `4-8` | Slow Eccentric Cheat Nordic Curls |
| `5-8` | Paused Bench Press |
| `6` | Deficit Snatch Grip Deadlift |
| `6-10` | Close Neutral Grip Lat Pulldown, Incline DB Bench Press, Leg Extensions, Standing Military Press |
| `8-12` | Single-Leg Machine Hip Thrust |

---

## 7. Export block

```yaml
id: pain-and-glory
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 16
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 74, days: 4, sets_per_session: 18.5, slots: 22 }
load: { systemic: 141, axial: 90, lower_back: 76, per_set_systemic: 1.91 }
volume: { glutes: 32, back: 28, hamstrings: 24, quads: 12, shoulders: 10, chest: 8, biceps: 4, calves: 4, core: 4, triceps: 0 }
coverage: { covered: 9, missing: ['triceps'], in_band: 2, over: ['back', 'hamstrings', 'glutes'], under: ['chest', 'biceps', 'calves', 'core'] }
set_shape: { slots: 22, ones: 0, twos: 12, threes: 2, four_plus: 8, mean: 3.36 }
rep_ranges: ['12-20', '15-20', '20-40', '4-6', '4-8', '5-8', '6', '6-10', '8-12']
variety: { distinct: 13, density: 1.76, top_share: 0.27, evenness: 0.919 }
```
