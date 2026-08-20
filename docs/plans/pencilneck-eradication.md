# Pencilneck Eradication

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `pencilneck-eradication` |
| **Length** | 8 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 91 across 4 training days (week 3 sample) |
| **Sets/session** | 22.8 |
| **Goal** | hypertrophy |
| **Experience** | intermediate |
| **Equipment** | full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 2/4 — moderate |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `preprocessDay`, `calculateWeight`, `getExerciseAdvice` |
| **Card promise** | *"8-week upper body hypertrophy split. For those who look like a lollipop."* |

---

## 1. What this plan is

**Signature mechanic.** Classic bodybuilding split run in repeatable eight-week cycles.

The onboarding card claims:

- Focus: Upper Body Mass
- 4 Days / Week
- Push / Pull Split

**Not for you if.**

- You want your squat and deadlift to go up — legs are maintained, not pushed

**Follow-ups.** [super-mutant](super-mutant.md), [tenfold](tenfold.md), [event-horizon](event-horizon.md)

---

## 2. The training week

> **Measurement note.** sampled week 3 (week 1 is off-median at 55 sets)

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Push A (Chest/Delts/Tri/Quads) | 9 | 22 | Flat Barbell Bench Press 3, Incline DB Press (45°) 3, Cable Flyes (mid height) 2, Seated DB Shoulder Press 3, Leaning Single Arm DB Lateral Raises 2, Overhead Tricep Extensions 2, Hack Squat 3, Leg Extensions 2, Standing Calf Raises 2 |
| Pull A (Back/Rear Delt/Bi/Hams) | 9 | 23 | Hammer Pulldown (Underhand) 3, Seated Cable Row 3, Lat Prayer 3, Wide Grip BB Row 3, Side-Lying Rear Delt Flyes 2, Preacher EZ-Bar Curls 2, Romanian Deadlift 3, Lying Leg Curls 2, Hanging Leg Raises 2 |
| Push B (Chest/Delts/Tri/Quads) | 9 | 24 | Incline Barbell Bench Press (45°) 3, Flat DB Press 3, Pec Deck 2, Standing Barbell Military Press 3, Leaning Single Arm DB Lateral Raises 2, Close-Grip Bench Press 3, Front Squats 3, Walking Lunges (DB) 3, Hack Calf Raises 2 |
| Pull B (Back/Rear Delt/Bi/Hams) | 9 | 22 | Lat Pulldown (Neutral) 3, Single-Arm Hammer Strength Row 3, Single-Arm DB Row 3, Rear-Delt Rope Pulls to Face 2, Bench-Supported DB Rear Delt Fly 2, Incline DB Curls 2, Stiff-Legged Deadlift 3, Seated Leg Curls 2, Ab Wheel Rollouts 2 |

All 8 weeks carry the same set-count shape; what varies week to
week is load, reps and technique rather than volume.

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| shoulders | 22 | above the 20-set ceiling |
| back | 21 | above the 20-set ceiling |
| chest | 19 | in band |
| glutes | 15 | in band |
| quads | 11 | in band |
| hamstrings | 10 | in band |
| triceps | 5 | below the 6-set growth dose |
| biceps | 4 | below the 6-set growth dose |
| calves | 4 | below the 6-set growth dose |
| core | 4 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.84 |
| Quad:hamstring | 1.1 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **147** |
| Axial | **45** |
| Lower back | 40 |
| Per-set systemic | 1.62 |
| High-systemic sets (cost 3+) | 12 |
| Compound share | 46% |
| Shoulder / knee / elbow cost | 41 / 26 / 46 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.86 |
| Mean stability demand (0-4) | 1.49 |
| Stimulus per unit fatigue | 1.15 |
| Failure-safe share of sets | 26% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 36 |
| At 1 set | 0 |
| At 2 sets | 17 |
| At 3 sets | 19 |
| At 4+ sets | 0 |
| Mean sets per slot | 2.53 |
| Distinct exercises | 35 |
| Variety density (exercises per 10 sets) | 3.85 |
| Largest single-exercise share | 4% |

No slot sits at one set and none carries more than three. Nothing to flag.

---

## 6. Export block

```yaml
id: pencilneck-eradication
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 8
frequency: [4]
engine: calendar
sampled_week: 3
weekly: { sets: 91, days: 4, sets_per_session: 22.8, slots: 36 }
load: { systemic: 147, axial: 45, lower_back: 40, per_set_systemic: 1.62 }
volume: { shoulders: 22, back: 21, chest: 19, glutes: 15, quads: 11, hamstrings: 10, triceps: 5, biceps: 4, calves: 4, core: 4 }
coverage: { covered: 10, missing: [], in_band: 4, over: ['shoulders', 'back'], under: ['biceps', 'triceps', 'calves', 'core'] }
set_shape: { slots: 36, ones: 0, twos: 17, threes: 19, four_plus: 0, mean: 2.53 }
variety: { distinct: 35, density: 3.85, top_share: 0.044, evenness: 0.994 }
```
