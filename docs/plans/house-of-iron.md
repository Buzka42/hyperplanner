# House of Iron

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `house-of-iron` |
| **Length** | 8 weeks |
| **Frequency** | 2/3/4 days/week |
| **Weekly sets** | 55 across 4 training days (week 1 sample) |
| **Sets/session** | 13.8 |
| **Goal** | general, hypertrophy |
| **Experience** | beginner, intermediate |
| **Equipment** | minimal |
| **Adaptability** | responsive |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `session-select` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `last-set-failure` |
| **Card promise** | *"An 8-week repeatable minimal-equipment plan that makes one dumbbell or kettlebell last."* |

---

## 1. What this plan is

**Signature mechanic.** One dumbbell or kettlebell made to last through authored difficulty ladders instead of more load.

The onboarding card claims:

- 2–4 free-order sessions weekly
- Fixed-load mastery ladders
- Push/pull and knee/hinge balance
- Works with one implement

**Prerequisites.** At least one adjustable or moderately heavy implement — and the ability to hold a solid position under load, because every movement here is unilateral or unsupported with no machine to fall back on

**Not for you if.**

- You have a full gym and want to use it

**Follow-ups.** [the-minimum](the-minimum.md), [30-minute-adventure](30-minute-adventure.md), [skeleton-to-threat](skeleton-to-threat.md)

---

## 2. The training week

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Push A — Chest + Quads · Foundation | 6 | 13 | Goblet Heel-Elevated Squat (legacy id) 3, Single-Arm Floor Press 3, Bulgarian Split Squat 2, Push-Up 2, Single-Arm Overhead Triceps Extension 2, Suitcase Hold 1 |
| Pull A — Back + Hamstrings · Foundation | 6 | 13 | Single-Arm DB Row 3, Romanian Deadlift 3, Dumbbell Pullover 2, Single-Leg Romanian Deadlift 2, Hammer Curls 2, Suitcase Carry 1 |
| Push B — Shoulders + Quads/Glutes · Foundation | 6 | 14 | Single-Arm Standing Press 3, Goblet Skater Squat 3, Single-Arm Floor Press 2, Supported Sissy Squat 2, Leaning One-Arm Lateral Raise 2, Close-Grip Push-Up 2 |
| Pull B — Back + Glutes/Hamstrings · Foundation | 6 | 15 | B-Stance Romanian Deadlift 3, Single-Arm DB Row 3, Glute Bridge 3, Dumbbell Pullover 2, Rear-Delt Row 2, Hammer Curls 2 |

### Week-to-week shape

The program runs 8 weeks falling into 5 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2 | Push A — Chest + Quads · Foundation 13, Pull A — Back + Hamstrings · Foundation 13, Push B — Shoulders + Quads/Glutes · Foundation 14, Pull B — Back + Glutes/Hamstrings · Foundation 15 |
| 3, 4 | Push A — Chest + Quads · Build 13, Pull A — Back + Hamstrings · Build 13, Push B — Shoulders + Quads/Glutes · Build 14, Pull B — Back + Glutes/Hamstrings · Build 15 |
| 5, 6 | Push A — Chest + Quads · Harden 13, Pull A — Back + Hamstrings · Harden 13, Push B — Shoulders + Quads/Glutes · Harden 14, Pull B — Back + Glutes/Hamstrings · Harden 15 |
| 7 | Push A — Chest + Quads · House on Fire 13, Pull A — Back + Hamstrings · House on Fire 13, Push B — Shoulders + Quads/Glutes · House on Fire 14, Pull B — Back + Glutes/Hamstrings · House on Fire 15 |
| 8 | Push A — Chest + Quads · Rebuild 9, Pull A — Back + Hamstrings · Rebuild 9, Push B — Shoulders + Quads/Glutes · Rebuild 8, Pull B — Back + Glutes/Hamstrings · Rebuild 9 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 16 | in band |
| back | 10 | in band |
| quads | 10 | in band |
| chest | 9 | below the 10-set growth dose |
| hamstrings | 8 | below the 10-set growth dose |
| shoulders | 7 | below the 10-set growth dose |
| triceps | 7 | in band |
| biceps | 4 | below the 6-set growth dose |
| core | 2 | below the 6-set growth dose |
| calves | 0 | no direct sets |

**Untrained groups:** `calves`.

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.64 |
| Quad:hamstring | 1.25 |
| Groups covered (4+ sets) | 8 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **102** |
| Axial | **26** |
| Lower back | 36 |
| Per-set systemic | 1.85 |
| High-systemic sets (cost 3+) | 11 |
| Compound share | 69% |
| Shoulder / knee / elbow cost | 19 / 22 / 28 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2.24 |
| Mean stability demand (0-4) | 2.44 |
| Stimulus per unit fatigue | 1.21 |
| Failure-safe share of sets | 4% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 24 |
| At 1 set | 2 |
| At 2 sets | 13 |
| At 3 sets | 9 |
| At 4+ sets | 0 |
| Mean sets per slot | 2.29 |
| Distinct exercises | 20 |
| Variety density (exercises per 10 sets) | 3.64 |
| Largest single-exercise share | 11% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**One set (2):**

- Push A — Chest + Quads · Foundation — Suitcase Hold
- Pull A — Back + Hamstrings · Foundation — Suitcase Carry

---

## 6. Export block

```yaml
id: house-of-iron
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 8
frequency: [2, 3, 4]
engine: session-select
sampled_week: 1
weekly: { sets: 55, days: 4, sets_per_session: 13.8, slots: 24 }
load: { systemic: 102, axial: 26, lower_back: 36, per_set_systemic: 1.85 }
volume: { glutes: 16, back: 10, quads: 10, chest: 9, hamstrings: 8, shoulders: 7, triceps: 7, biceps: 4, core: 2, calves: 0 }
coverage: { covered: 8, missing: ['calves'], in_band: 4, over: [], under: ['chest', 'shoulders', 'biceps', 'hamstrings', 'core'] }
set_shape: { slots: 24, ones: 2, twos: 13, threes: 9, four_plus: 0, mean: 2.29 }
variety: { distinct: 20, density: 3.64, top_share: 0.109, evenness: 0.969 }
```
