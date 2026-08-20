# Monolith

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `monolith` |
| **Length** | 10 weeks |
| **Frequency** | 3 days/week |
| **Weekly sets** | 68 across 3 training days (week 1 sample) |
| **Sets/session** | 22.7 |
| **Goal** | hypertrophy |
| **Experience** | beginner, intermediate |
| **Equipment** | machines, full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 2/4 — moderate |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `drop-set` |
| **Card promise** | *"A 10-week machine-dominant upper/lower plan for accumulating volume you can recover from."* |

---

## 1. What this plan is

**Signature mechanic.** Three machine-house days — Upper, Lower, Full — that keep systemic cost low: effort first, techniques much later.

The onboarding card claims:

- 4 days, upper/lower
- Machine-dominant, not machine-only
- Effort first, technique later
- Low systemic cost

**Prerequisites.** A gym with a reasonable machine inventory

**Not for you if.**

- You want to get better at barbell lifts

**Follow-ups.** [event-horizon](event-horizon.md), [project-chimera](project-chimera.md), [cathedral](cathedral.md)

---

## 2. The training week

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Upper · Placement | 8 | 24 | Hammer Chest Press 4, Hammer Pulldown (Underhand) 3, Single-Arm Hammer Strength Row 3, Seated Hammer Shoulder Press 3, Machine Press/Fly Combo 3, Cable Triceps Extension 3, Machine Curl 3, Cable Crunch 2 |
| Lower · Placement | 6 | 18 | Leg Press 4, Leg Extensions 3, Lying Leg Curls 3, Single Leg Machine Hip Thrust 3, Standing Dumbbell/KB Calf Raise 3, Cable Crunch 2 |
| Full (light) · Placement | 10 | 26 | Pec Deck 3, Hammer Pulldown (Underhand) 2, Machine Rear Delt Fly 3, Seated Hamstring Curl 3, Leg Extensions 2, Standing Dumbbell/KB Calf Raise 3, Machine Hip Abduction 3, Hip Adduction 3, Cable Triceps Extension 2, Machine Curl 2 |

### Week-to-week shape

The program runs 10 weeks falling into 4 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3 | Upper · Placement 24, Lower · Placement 18, Full (light) · Placement 26 |
| 4, 5, 6 | Upper · Pressure 24, Lower · Pressure 18, Full (light) · Pressure 26 |
| 7, 8, 9 | Upper · Weight of It 24, Lower · Weight of It 18, Full (light) · Weight of It 26 |
| 10 | Upper · Settling 16, Lower · Settling 12, Full (light) · Settling 16 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 13 | in band |
| chest | 10 | in band |
| quads | 9 | below the 10-set growth dose |
| back | 8 | below the 10-set growth dose |
| shoulders | 6 | below the 10-set growth dose |
| hamstrings | 6 | below the 10-set growth dose |
| calves | 6 | in band |
| biceps | 5 | below the 6-set growth dose |
| triceps | 5 | below the 6-set growth dose |
| core | 4 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.62 |
| Quad:hamstring | 1.5 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **72** |
| Axial | **8** |
| Lower back | 0 |
| Per-set systemic | 1.06 |
| High-systemic sets (cost 3+) | 0 |
| Compound share | 6% |
| Shoulder / knee / elbow cost | 19 / 24 / 38 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.74 |
| Mean stability demand (0-4) | 0.4 |
| Stimulus per unit fatigue | 1.64 |
| Failure-safe share of sets | 79% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 24 |
| At 1 set | 0 |
| At 2 sets | 6 |
| At 3 sets | 16 |
| At 4+ sets | 2 |
| Mean sets per slot | 2.83 |
| Distinct exercises | 18 |
| Variety density (exercises per 10 sets) | 2.65 |
| Largest single-exercise share | 9% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (2):**

- Upper · Placement — Hammer Chest Press, 4 sets *(session opener)*
- Lower · Placement — Leg Press, 4 sets *(session opener)*

---

## 6. Export block

```yaml
id: monolith
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 10
frequency: [3]
engine: calendar
sampled_week: 1
weekly: { sets: 68, days: 3, sets_per_session: 22.7, slots: 24 }
load: { systemic: 72, axial: 8, lower_back: 0, per_set_systemic: 1.06 }
volume: { glutes: 13, chest: 10, quads: 9, back: 8, shoulders: 6, hamstrings: 6, calves: 6, biceps: 5, triceps: 5, core: 4 }
coverage: { covered: 10, missing: [], in_band: 3, over: [], under: ['shoulders', 'back', 'biceps', 'triceps', 'quads', 'hamstrings', 'core'] }
set_shape: { slots: 24, ones: 0, twos: 6, threes: 16, four_plus: 2, mean: 2.83 }
variety: { distinct: 18, density: 2.65, top_share: 0.088, evenness: 0.989 }
```
