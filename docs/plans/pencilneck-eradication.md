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
| **Weekly sets** | 79 across 4 training days (week 2 sample) |
| **Sets/session** | 19.8 |
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

> **Measurement note.** sampled week 2 (week 1 is off-median at 55 sets)

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Push A (Chest/Delts/Tri/Quads) | 9 | 19 | Flat Barbell Bench Press 3, Incline DB Press (45°) 3, Cable Flyes (mid height) 2, Seated DB Shoulder Press 3, Leaning Single Arm DB Lateral Raises 2, Overhead Tricep Extensions 2, Hack Squat 2, Leg Extensions 1, Standing Calf Raises 1 |
| Pull A (Back/Rear Delt/Bi/Hams) | 9 | 20 | Hammer Pulldown (Underhand) 3, Seated Cable Row 3, Lat Prayer 3, Wide Grip BB Row 3, Side-Lying Rear Delt Flyes 2, Preacher EZ-Bar Curls 2, Romanian Deadlift 2, Lying Leg Curls 1, Hanging Leg Raises 1 |
| Push B (Chest/Delts/Tri/Quads) | 9 | 21 | Incline Barbell Bench Press (45°) 3, Flat DB Press 3, Pec Deck 2, Standing Barbell Military Press 3, Leaning Single Arm DB Lateral Raises 2, Close-Grip Bench Press 3, Front Squats 2, Walking Lunges (DB) 2, Hack Calf Raises 1 |
| Pull B (Back/Rear Delt/Bi/Hams) | 9 | 19 | Lat Pulldown (Neutral) 3, Single-Arm Hammer Strength Row 3, Single-Arm DB Row 3, Rear-Delt Rope Pulls to Face 2, Bench-Supported DB Rear Delt Fly 2, Incline DB Curls 2, Stiff-Legged Deadlift 2, Seated Leg Curls 1, Ab Wheel Rollouts 1 |

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
| glutes | 10 | in band |
| quads | 7 | below the 10-set growth dose |
| hamstrings | 6 | below the 10-set growth dose |
| triceps | 5 | below the 6-set growth dose |
| biceps | 4 | below the 6-set growth dose |
| calves | 2 | below the 6-set growth dose |
| core | 2 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.84 |
| Quad:hamstring | 1.17 |
| Groups covered (4+ sets) | 8 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **125** |
| Axial | **34** |
| Lower back | 30 |
| Per-set systemic | 1.58 |
| High-systemic sets (cost 3+) | 8 |
| Compound share | 47% |
| Shoulder / knee / elbow cost | 41 / 16 / 46 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.84 |
| Mean stability demand (0-4) | 1.54 |
| Stimulus per unit fatigue | 1.16 |
| Failure-safe share of sets | 24% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 36 |
| At 1 set | 7 |
| At 2 sets | 15 |
| At 3 sets | 14 |
| At 4+ sets | 0 |
| Mean sets per slot | 2.19 |
| Distinct exercises | 35 |
| Variety density (exercises per 10 sets) | 4.43 |
| Largest single-exercise share | 5% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**One set (7):**

- Push A (Chest/Delts/Tri/Quads) — Leg Extensions
- Push A (Chest/Delts/Tri/Quads) — Standing Calf Raises
- Pull A (Back/Rear Delt/Bi/Hams) — Lying Leg Curls
- Pull A (Back/Rear Delt/Bi/Hams) — Hanging Leg Raises
- Push B (Chest/Delts/Tri/Quads) — Hack Calf Raises
- Pull B (Back/Rear Delt/Bi/Hams) — Seated Leg Curls
- Pull B (Back/Rear Delt/Bi/Hams) — Ab Wheel Rollouts

---

## 6. Export block

```yaml
id: pencilneck-eradication
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 8
frequency: [4]
engine: calendar
sampled_week: 2
weekly: { sets: 79, days: 4, sets_per_session: 19.8, slots: 36 }
load: { systemic: 125, axial: 34, lower_back: 30, per_set_systemic: 1.58 }
volume: { shoulders: 22, back: 21, chest: 19, glutes: 10, quads: 7, hamstrings: 6, triceps: 5, biceps: 4, calves: 2, core: 2 }
coverage: { covered: 8, missing: [], in_band: 2, over: ['shoulders', 'back'], under: ['biceps', 'triceps', 'quads', 'hamstrings', 'calves', 'core'] }
set_shape: { slots: 36, ones: 7, twos: 15, threes: 14, four_plus: 0, mean: 2.19 }
variety: { distinct: 35, density: 4.43, top_share: 0.051, evenness: 0.981 }
```
