# The Minimum

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `the-minimum` |
| **Length** | 10 weeks |
| **Frequency** | 2 days/week |
| **Weekly sets** | 38 across 2 training days (week 1 sample) |
| **Sets/session** | 19 |
| **Goal** | general, hypertrophy |
| **Experience** | beginner, intermediate |
| **Equipment** | full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 2/4 — moderate |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Card promise** | *"A 10-week plan of two mandatory full-body sessions, with optional bonus work when you have time."* |

---

## 1. What this plan is

**Signature mechanic.** Two required sessions that cover everything, with bonus work that never becomes required.

The onboarding card claims:

- 2 required sessions weekly
- 14–16 sets each
- Optional underexposure-driven bonuses
- Bonus work never gates progress

**Not for you if.**

- You have four days a week and want to use them

**Follow-ups.** [pencilneck-eradication](pencilneck-eradication.md), [athena](athena.md), [monolith](monolith.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Session A · Establish | 9 | 18 | Hack Squat 2×6-10, Hip-Supported Dumbbell Deadlift 2×6-10, Incline DB Bench Press 2×6-10, Single-Arm Hammer Strength Row 2×8-12, Cable Lateral Raise 2×12-15, EZ Preacher Curl 2×8-12, Cable Triceps Extension 2×8-15, Hack Squat Calf Raises 2×12-20, Ab Wheel 2×8-12 |
| Session B · Establish | 10 | 20 | Leg Press 2×8-12, Seated Hamstring Curl 2×10-15, 30° Smith Incline Bench Press 2×8-12, Close Neutral Grip Lat Pulldown 2×8-12, Seated Hammer Shoulder Press 2×8-12, Single Leg Machine Hip Thrust 2×10-15, Bayesian Cable Curl 2×10-15, Overhead Tricep Extensions 2×10-15, Standing Calf Raises 2×12-20, Hanging Knee Raise 2×10-15 |

### Week-to-week shape

The program runs 10 weeks falling into 4 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3 | Session A · Establish 18, Session B · Establish 20 |
| 4, 5, 6, 7 | Session A · Build 18, Session B · Build 20 |
| 8, 9 | Session A · Press 18, Session B · Press 20 |
| 10 | Session A · Confirm 18, Session B · Confirm 20 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| shoulders | 8 | below the 10-set growth dose |
| glutes | 8 | below the 10-set growth dose |
| chest | 4 | below the 10-set growth dose |
| back | 4 | below the 10-set growth dose |
| biceps | 4 | below the 6-set growth dose |
| triceps | 4 | below the 6-set growth dose |
| quads | 4 | below the 10-set growth dose |
| hamstrings | 4 | below the 10-set growth dose |
| calves | 4 | below the 6-set growth dose |
| core | 4 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 2 |
| Quad:hamstring | 1 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **54** |
| Axial | **10** |
| Lower back | 10 |
| Per-set systemic | 1.42 |
| High-systemic sets (cost 3+) | 4 |
| Compound share | 26% |
| Shoulder / knee / elbow cost | 10 / 10 / 24 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2 |
| Mean stability demand (0-4) | 1.05 |
| Stimulus per unit fatigue | 1.41 |
| Failure-safe share of sets | 47% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 19 |
| At 1 set | 0 |
| At 2 sets | 19 |
| At 3 sets | 0 |
| At 4+ sets | 0 |
| Mean sets per slot | 2 |
| Distinct exercises | 19 |
| Variety density (exercises per 10 sets) | 5 |
| Largest single-exercise share | 5% |

No slot sits at one set and none carries more than three. Nothing to flag.

---

## 6. Rep schemes

6 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Bayesian Cable Curl, Hanging Knee Raise, Overhead Tricep Extensions, Seated Hamstring Curl, Single Leg Machine Hip Thrust |
| `12-15` | Cable Lateral Raise |
| `12-20` | Hack Squat Calf Raises, Standing Calf Raises |
| `6-10` | Hack Squat, Hip-Supported Dumbbell Deadlift, Incline DB Bench Press |
| `8-12` | 30° Smith Incline Bench Press, Ab Wheel, Close Neutral Grip Lat Pulldown, EZ Preacher Curl, Leg Press, Seated Hammer Shoulder Press, Single-Arm Hammer Strength Row |
| `8-15` | Cable Triceps Extension |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | none of its own; the shared `genericDoubleProgression` runs |
| **Slot-level rules** | declared on at least one movement |
| **Next load written** | 76 of 76 movements (100%) after a clean session |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | double progression +2.5kg | 30° Smith Incline Bench Press, Ab Wheel, Bayesian Cable Curl, Cable Lateral Raise, Cable Triceps Extension, Close Neutral Grip Lat Pulldown, EZ Preacher Curl, Hack Squat, Hack Squat Calf Raises, Hanging Knee Raise, Hip-Supported Dumbbell Deadlift, Incline DB Bench Press, Leg Press, Overhead Tricep Extensions, Seated Hammer Shoulder Press, Seated Hamstring Curl, Single Leg Machine Hip Thrust, Single-Arm Hammer Strength Row, Standing Calf Raises |

---

## 8. Export block

```yaml
id: the-minimum
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 10
frequency: [2]
engine: calendar
sampled_week: 1
weekly: { sets: 38, days: 2, sets_per_session: 19, slots: 19 }
load: { systemic: 54, axial: 10, lower_back: 10, per_set_systemic: 1.42 }
volume: { shoulders: 8, glutes: 8, chest: 4, back: 4, biceps: 4, triceps: 4, quads: 4, hamstrings: 4, calves: 4, core: 4 }
coverage: { covered: 10, missing: [], in_band: 0, over: [], under: ['chest', 'shoulders', 'back', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'] }
set_shape: { slots: 19, ones: 0, twos: 19, threes: 0, four_plus: 0, mean: 2 }
rep_ranges: ['10-15', '12-15', '12-20', '6-10', '8-12', '8-15']
progression: { handler: shared, slot_rules: true, distinct_rules: 1 }
variety: { distinct: 19, density: 5, top_share: 0.053, evenness: 1 }
```
