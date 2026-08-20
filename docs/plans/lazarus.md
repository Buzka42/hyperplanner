# Lazarus

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `lazarus` |
| **Length** | 8 weeks |
| **Frequency** | 3 days/week |
| **Weekly sets** | 56 across 3 training days (week 3 sample) |
| **Sets/session** | 18.7 |
| **Goal** | return, general |
| **Experience** | intermediate, advanced |
| **Equipment** | full-gym |
| **Adaptability** | responsive |
| **Fatigue cost** | 2/4 — moderate |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `last-set-failure` |
| **Card promise** | *"An 8-week return plan for trained athletes coming back after three months or more away."* |

---

## 1. What this plan is

**Signature mechanic.** The Memory Curve: loads open from your last stable pre-break performance, not your best ever.

The onboarding card claims:

- 3 full-body days
- Memory Curve against your old bests
- Hard caps in weeks 1–2
- Accelerates once you prove it

**Prerequisites.** Previous structured training; At least three months away

**Not for you if.**

- You never stopped training
- You are returning from an injury that still limits you

**Follow-ups.** [athena](athena.md), [pencilneck-eradication](pencilneck-eradication.md), [project-chimera](project-chimera.md)

---

## 2. The training week

> **Measurement note.** sampled week 3 (week 1 is off-median at 46 sets)

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Return I · Remembering | 8 | 19 | Heel-Elevated Goblet Squat 3, 30° Smith Incline Bench Press 3, Single-Arm Hammer Strength Row 3, Seated Hamstring Curl 2, Cable Lateral Raise 2, Overhead Tricep Extensions 2, Hack Squat Calf Raises 2, Cable Crunch 2 |
| Return II · Remembering | 7 | 17 | Hip-Supported Dumbbell Deadlift 3, Overhand Mid-Grip Pulldown 3, Dip 3, Reverse Nordic Curls 2, Machine Rear Delt Fly 2, Hack Squat Calf Raises 2, Machine Curl 2 |
| Return III · Remembering | 8 | 20 | Leg Press 3, Seated Hammer Shoulder Press 3, Hammer Pulldown (Underhand) 3, Machine Press/Fly Combo 3, Lying Leg Curls 2, Machine Curl 2, Cable Triceps Extension 2, Planks 2 |

### Week-to-week shape

The program runs 8 weeks falling into 3 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2 | Return I · Waking 16, Return II · Waking 14, Return III · Waking 16 |
| 3, 4, 5 | Return I · Remembering 19, Return II · Remembering 17, Return III · Remembering 20 |
| 6, 7, 8 | Return I · Returned 19, Return II · Returned 17, Return III · Returned 20 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| shoulders | 10 | in band |
| chest | 9 | below the 10-set growth dose |
| back | 9 | below the 10-set growth dose |
| glutes | 9 | below the 10-set growth dose |
| quads | 8 | below the 10-set growth dose |
| triceps | 7 | in band |
| hamstrings | 7 | below the 10-set growth dose |
| biceps | 4 | below the 6-set growth dose |
| calves | 4 | below the 6-set growth dose |
| core | 4 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 2 |
| Quad:hamstring | 1.14 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **77** |
| Axial | **15** |
| Lower back | 9 |
| Per-set systemic | 1.38 |
| High-systemic sets (cost 3+) | 6 |
| Compound share | 27% |
| Shoulder / knee / elbow cost | 19 / 22 / 34 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2.02 |
| Mean stability demand (0-4) | 0.7 |
| Stimulus per unit fatigue | 1.47 |
| Failure-safe share of sets | 54% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 23 |
| At 1 set | 0 |
| At 2 sets | 13 |
| At 3 sets | 10 |
| At 4+ sets | 0 |
| Mean sets per slot | 2.43 |
| Distinct exercises | 21 |
| Variety density (exercises per 10 sets) | 3.75 |
| Largest single-exercise share | 7% |

No slot sits at one set and none carries more than three. Nothing to flag.

---

## 6. Export block

```yaml
id: lazarus
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 8
frequency: [3]
engine: calendar
sampled_week: 3
weekly: { sets: 56, days: 3, sets_per_session: 18.7, slots: 23 }
load: { systemic: 77, axial: 15, lower_back: 9, per_set_systemic: 1.38 }
volume: { shoulders: 10, chest: 9, back: 9, glutes: 9, quads: 8, triceps: 7, hamstrings: 7, biceps: 4, calves: 4, core: 4 }
coverage: { covered: 10, missing: [], in_band: 2, over: [], under: ['chest', 'back', 'biceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'] }
set_shape: { slots: 23, ones: 0, twos: 13, threes: 10, four_plus: 0, mean: 2.43 }
variety: { distinct: 21, density: 3.75, top_share: 0.071, evenness: 0.991 }
```
