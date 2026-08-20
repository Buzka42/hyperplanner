# 30 Minute Adventure

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `30-minute-adventure` |
| **Length** | 4 weeks |
| **Frequency** | 2/3/4 days/week |
| **Weekly sets** | 60 across 3 training days (week 1 sample) |
| **Sets/session** | 20 |
| **Goal** | general, conditioning |
| **Experience** | beginner, intermediate |
| **Equipment** | full-gym, minimal |
| **Adaptability** | fixed |
| **Fatigue cost** | 1/4 — low |
| **Session engine** | `pair-select` |
| **Calibration** | none |
| **Access** | always free |
| **Card promise** | *"A flexible full-body session generator built for fast, equipment-aware training."* |

---

## 1. What this plan is

**Signature mechanic.** Pick-a-path sessions that fit in half an hour and never repeat the same pairing twice.

The onboarding card claims:

- Free for every new keyword
- 5 portals · 10 exercises · 20 working sets
- No 1RM or RPE calibration
- Exercise history and load recommendations

**Not for you if.**

- You are chasing a specific strength or size target

**Follow-ups.** [the-minimum](the-minimum.md), [skeleton-to-threat](skeleton-to-threat.md), [house-of-iron](house-of-iron.md)

---

## 2. The training week

This plan generates each session on demand rather than from a fixed
calendar, so the week below is a representative sample taken at the
plan's own stated frequency, not a fixed template.

> **Measurement note.** free-choice generator: expected session averaged over all 34 pairs, × 3 sessions/week

> **Measurement note.** variety counts the reachable pool, not one route — 20 sets/session by construction

This plan draws each session from a pool rather than prescribing one,
so the measured "session" is an expectation averaged over every route
through it. No single slot table describes what an athlete is handed.

| | |
|---|---:|
| Reachable movements | 59 |
| Sets per session | 19 (by construction) |
| Sessions per week | 3 (declared) |

<details><summary>The reachable pool (59 movements)</summary>

- 30° Incline-Lying Dumbbell Curl
- 30° Smith Incline Bench Press
- 45° Back Extension
- Ab Wheel
- Arnold Press
- B-Stance Hip Thrust
- Barbell Romanian Deadlift
- Barbell Row
- Barbell Squat
- Bench Hip Thrust
- Bench Reverse Crunch
- Bench-Supported One-Arm Dumbbell Row
- Bulgarian Split Squat
- Cable Crossover
- Cable Crunch
- Cable Cyclist Squat
- Cable Lateral Raise
- Cable Romanian Deadlift
- Close-Grip Push-Up
- Diamond Push-Up
- Dual-Cable Chest Press
- Dual-Cable High Row
- Dumbbell Hammer Curl
- Dumbbell Hip Thrust
- Dumbbell Romanian Deadlift
- Dumbbell Seal Row
- Dumbbell Walking Lunge
- Flat Dumbbell Bench Press
- French Press
- Frog Pump
- Hack-Squat Calf Raise
- Hanging Leg Raise
- Heel-Elevated Goblet Squat
- Incline Barbell Bench Press
- Kas Glute Bridge
- Kneeling One-Arm Cable Row
- Leaning One-Arm Lateral Raise
- Leg Extension
- Lying Dumbbell Skullcrusher
- Lying Leg Curl
- Machine Hip Thrust
- One-Dumbbell Overhead Triceps Extension
- Pec Deck
- Plank
- Pull-Up
- Push-Up
- Reverse Pec Deck
- Rope Pressdown
- Seated Cable Row
- Seated Dumbbell Lateral Raise
- Seated Dumbbell Shoulder Press
- Single-Leg Dumbbell Romanian Deadlift
- Smith Machine Overhead Press
- Standing Dumbbell/KB Calf Raise
- Standing Military Press
- Standing Straight-Bar Curl
- Straight-Bar Cable Curl
- Weighted Crunch
- Y-Raise

</details>

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 16 | in band |
| shoulders | 8.3 | below the 10-set growth dose |
| chest | 8 | below the 10-set growth dose |
| back | 7 | below the 10-set growth dose |
| biceps | 6 | in band |
| quads | 6 | below the 10-set growth dose |
| calves | 6 | in band |
| core | 6 | in band |
| hamstrings | 5 | below the 10-set growth dose |
| triceps | 4 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.56 |
| Quad:hamstring | 1.2 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **86.7** |
| Axial | **19** |
| Lower back | 23.3 |
| Per-set systemic | 1.45 |
| High-systemic sets (cost 3+) | 5.7 |
| Compound share | 30% |
| Shoulder / knee / elbow cost | 17.8 / 13 / 31.8 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.97 |
| Mean stability demand (0-4) | 1.41 |
| Stimulus per unit fatigue | 1.36 |
| Failure-safe share of sets | 25% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 204 |
| At 1 set | 204 |
| At 2 sets | 0 |
| At 3 sets | 0 |
| At 4+ sets | 0 |
| Mean sets per slot | 0.29 |
| Distinct exercises | 59 |
| Variety density (exercises per 10 sets) | 9.83 |
| Largest single-exercise share | 8% |

Set shape is a property of each drafted pair rather than of a fixed
template here, so per-slot flags do not apply.

---

## 8. Export block

```yaml
id: 30-minute-adventure
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 4
frequency: [2, 3, 4]
engine: pair-select
sampled_week: 1
weekly: { sets: 60, days: 3, sets_per_session: 20, slots: 204 }
load: { systemic: 86.7, axial: 19, lower_back: 23.3, per_set_systemic: 1.45 }
volume: { glutes: 16, shoulders: 8.3, chest: 8, back: 7, biceps: 6, quads: 6, calves: 6, core: 6, hamstrings: 5, triceps: 4 }
coverage: { covered: 10, missing: [], in_band: 4, over: [], under: ['chest', 'shoulders', 'back', 'triceps', 'quads', 'hamstrings'] }
set_shape: { slots: 204, ones: 204, twos: 0, threes: 0, four_plus: 0, mean: 0.29 }
variety: { distinct: 59, density: 9.83, top_share: 0.075, evenness: 0.977 }
```
