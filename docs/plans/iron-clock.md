# Iron Clock

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `iron-clock` |
| **Length** | 8 weeks |
| **Frequency** | 3/4 days/week |
| **Weekly sets** | 36 across 4 training days (week 1 sample) |
| **Sets/session** | 9 |
| **Goal** | conditioning, hypertrophy |
| **Experience** | intermediate |
| **Equipment** | full-gym |
| **Adaptability** | responsive |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Catalogue** | hidden from onboarding |
| **Card promise** | *"An 8-week plan where the clock, not the plate, is the thing you beat."* |

---

## 1. What this plan is

**Signature mechanic.** Density is the overload: beat the block by rounds, then by time, and only then by load.

The onboarding card claims:

- 4-day mode or 3-day full body
- Density blocks with visible pacing
- Reps, then time, then load
- Round-by-round quality

**Prerequisites.** Willingness to work against a clock

**Not for you if.**

- You want maximal strength this block
- You cannot hold two stations at once

**Follow-ups.** [redline](redline.md), [atlas](atlas.md), [project-chimera](project-chimera.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| First Bell · Winding | 7 | 9 | Hack Squat 3×5-8, Incline DB Bench Press 1×8-10, Single-Arm Hammer Strength Row 1×8-10, Seated Hamstring Curl 1×10-12, Lateral Raises 1×12-15, Kettlebell Swing 1×12-15, Ab Wheel 1×8-12 |
| Second Bell · Winding | 7 | 9 | Lat Pulldown (Neutral) 3×6-8, Front-Foot Elevated Bulgarian Split Squat 1×8-10, Hammer Chest Press 1×8-10, Hip-Supported Dumbbell Deadlift 1×8-12, Single Arm Reverse Pec Deck 1×12-15, Hack Squat Calf Raises 1×12-20, Hammer Curls 1×8-15 |
| Third Bell · Winding | 7 | 9 | Paused Bench Press 3×4-6, Goblet Skater Squat 1×8-12, Hammer Pulldown (Underhand) 1×8-10, Leg Extensions 1×10-15, Lat Prayer 1×10-15, Hammer Curls 1×8-15, Cable EZ-Bar Pressdown 1×8-15 |
| Final Bell · Winding | 7 | 9 | Romanian Deadlift 3×5-8, Hammer Chest Press 1×8-10, Single-Arm Hammer Strength Row 1×8-10, Deficit Reverse Lunge 1×8-12, Lateral Raises 1×12-15, Hack Squat Calf Raises 1×12-20, Rolling DB Tricep Extensions 1×10-15 |

### Week-to-week shape

The program runs 8 weeks falling into 4 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2 | First Bell · Winding 27, Second Bell · Winding 27, Third Bell · Winding 27, Final Bell · Winding 27 |
| 3, 4, 5 | First Bell · Tension 33, Second Bell · Tension 33, Third Bell · Tension 33, Final Bell · Tension 33 |
| 6, 7 | First Bell · Escapement 33, Second Bell · Escapement 33, Third Bell · Escapement 33, Final Bell · Escapement 33 |
| 8 | First Bell · Benchmark 27, Second Bell · Benchmark 27, Third Bell · Benchmark 27, Final Bell · Benchmark 27 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 11 | in band |
| back | 7 | below the 10-set growth dose |
| quads | 7 | below the 10-set growth dose |
| chest | 6 | below the 10-set growth dose |
| hamstrings | 6 | below the 10-set growth dose |
| shoulders | 4 | below the 10-set growth dose |
| biceps | 2 | below the 6-set growth dose |
| triceps | 2 | below the 6-set growth dose |
| calves | 2 | below the 6-set growth dose |
| core | 1 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.33 |
| Quad:hamstring | 1.17 |
| Groups covered (4+ sets) | 6 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **60** |
| Axial | **17** |
| Lower back | 17 |
| Per-set systemic | 1.67 |
| High-systemic sets (cost 3+) | 8 |
| Compound share | 42% |
| Shoulder / knee / elbow cost | 9 / 15 / 19 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2.19 |
| Mean stability demand (0-4) | 1.42 |
| Stimulus per unit fatigue | 1.32 |
| Failure-safe share of sets | 31% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 28 |
| At 1 set | 0 |
| At 2 sets | 0 |
| At 3 sets | 0 |
| At 4+ sets | 0 |
| Mean sets per slot | 1.29 |
| Distinct exercises | 23 |
| Variety density (exercises per 10 sets) | 6.39 |
| Largest single-exercise share | 8% |

No slot sits at one set and none carries more than three. Nothing to flag.

---

## 6. Rep schemes

10 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-12` | Seated Hamstring Curl |
| `10-15` | Lat Prayer, Leg Extensions, Rolling DB Tricep Extensions |
| `12-15` | Kettlebell Swing, Lateral Raises, Single Arm Reverse Pec Deck |
| `12-20` | Hack Squat Calf Raises |
| `4-6` | Paused Bench Press |
| `5-8` | Hack Squat, Romanian Deadlift |
| `6-8` | Lat Pulldown (Neutral) |
| `8-10` | Front-Foot Elevated Bulgarian Split Squat, Hammer Chest Press, Hammer Pulldown (Underhand), Incline DB Bench Press, Single-Arm Hammer Strength Row |
| `8-12` | Ab Wheel, Deficit Reverse Lunge, Goblet Skater Squat, Hip-Supported Dumbbell Deadlift |
| `8-15` | Cable EZ-Bar Pressdown, Hammer Curls |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | none of its own; the shared `genericDoubleProgression` runs |
| **Slot-level rules** | declared on at least one movement |
| **Next load written** | 56 of 56 movements (100%) after a clean session |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | double progression +2.5kg | Ab Wheel, Cable EZ-Bar Pressdown, Deficit Reverse Lunge, Front-Foot Elevated Bulgarian Split Squat, Goblet Skater Squat, Hack Squat, Hack Squat Calf Raises, Hammer Chest Press, Hammer Curls, Hammer Pulldown (Underhand), Hip-Supported Dumbbell Deadlift, Incline DB Bench Press, Kettlebell Swing, Lat Prayer, Lat Pulldown (Neutral), Lateral Raises, Leg Extensions, Rolling DB Tricep Extensions, Romanian Deadlift, Seated Hamstring Curl, Single Arm Reverse Pec Deck, Single-Arm Hammer Strength Row |
| computed by the plan each session | the plan recalculates it from your logged work | Paused Bench Press |

---

## 8. Export block

```yaml
id: iron-clock
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 8
frequency: [3, 4]
engine: calendar
sampled_week: 1
weekly: { sets: 36, days: 4, sets_per_session: 9, slots: 28 }
load: { systemic: 60, axial: 17, lower_back: 17, per_set_systemic: 1.67 }
volume: { glutes: 11, back: 7, quads: 7, chest: 6, hamstrings: 6, shoulders: 4, biceps: 2, triceps: 2, calves: 2, core: 1 }
coverage: { covered: 6, missing: [], in_band: 1, over: [], under: ['chest', 'shoulders', 'back', 'biceps', 'triceps', 'quads', 'hamstrings', 'calves', 'core'] }
set_shape: { slots: 28, ones: 0, twos: 0, threes: 0, four_plus: 0, mean: 1.29 }
rep_ranges: ['10-12', '10-15', '12-15', '12-20', '4-6', '5-8', '6-8', '8-10', '8-12', '8-15']
progression: { handler: shared, slot_rules: true, distinct_rules: 2 }
variety: { distinct: 23, density: 6.39, top_share: 0.083, evenness: 0.965 }
```
