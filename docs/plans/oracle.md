# Oracle

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `oracle` |
| **Length** | 10 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 77 across 4 training days (week 1 sample) |
| **Sets/session** | 19.3 |
| **Goal** | general, assessment |
| **Experience** | intermediate, advanced |
| **Equipment** | full-gym, barbell |
| **Adaptability** | adaptive |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `rotation` |
| **Calibration** | seeded: `squat`, `flatBench` |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `last-set-failure` |
| **Card promise** | *"A 10-week plan that predicts your next session and then shows you how close it got."* |

---

## 1. What this plan is

**Signature mechanic.** It predicts your next session, states how confident it is, and shows you how close it got.

The onboarding card claims:

- 4 days, upper/lower
- Weeks 1–2 calibrate
- Confidence is stated, never implied
- Honest accuracy, not a score

**Prerequisites.** Consistent, honest logging including RIR

**Not for you if.**

- You will not report RIR
- You want the plan to chase a single peak

**Follow-ups.** [project-chimera](project-chimera.md), [blackout](blackout.md), [trinary](trinary.md)

---

## 2. The training week

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Oracle — Upper A · Calibration | 8 | 20 | Flat Barbell Bench Press 4, Single-Arm Hammer Strength Row 2, Seated Cable Row 2, Shoulder Press 3, Lat Prayer 3, Behind-the-Back Cable Lateral Raise 2, Cable Triceps Extension 2, EZ Preacher Curl 2 |
| Oracle — Lower A · Calibration | 6 | 19 | Barbell Squat 4, Romanian Deadlift 3, Leg Press 3, Seated Hamstring Curl 3, Leg Extensions 3, Hack Squat Calf Raises 3 |
| Oracle — Upper B · Calibration | 8 | 20 | Incline DB Bench Press 4, Hammer Pulldown (Underhand) 2, Bench-Supported Single-Arm Cable Pulldown 2, Hammer Chest Press 3, Bench-Supported DB Rear Delt Fly 3, Leaning One-Arm Lateral Raise 2, Rolling DB Tricep Extensions 2, Straight-Bar Cable Curl 2 |
| Oracle — Lower B · Calibration | 6 | 18 | Leg Press 4, Lying Leg Curls 3, Front-Foot Elevated Bulgarian Split Squat 3, Single Leg Machine Hip Thrust 3, Hack Squat Calf Raises 3, Cable Crunch 2 |

### Week-to-week shape

The program runs 10 weeks falling into 4 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2 | Oracle — Upper A · Calibration 20, Oracle — Lower A · Calibration 19, Oracle — Upper B · Calibration 20, Oracle — Lower B · Calibration 18 |
| 3, 4, 5 | Oracle — Upper A · Reading 20, Oracle — Lower A · Reading 19, Oracle — Upper B · Reading 20, Oracle — Lower B · Reading 18 |
| 6, 7, 8 | Oracle — Upper A · Prediction 20, Oracle — Lower A · Prediction 19, Oracle — Upper B · Prediction 20, Oracle — Lower B · Prediction 18 |
| 9, 10 | Oracle — Upper A · Proof 20, Oracle — Lower A · Proof 19, Oracle — Upper B · Proof 20, Oracle — Lower B · Proof 18 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 20 | in band |
| quads | 17 | in band |
| shoulders | 14 | in band |
| chest | 11 | in band |
| back | 11 | in band |
| hamstrings | 9 | below the 10-set growth dose |
| calves | 6 | in band |
| biceps | 4 | below the 6-set growth dose |
| triceps | 4 | below the 6-set growth dose |
| core | 2 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.93 |
| Quad:hamstring | 1.89 |
| Groups covered (4+ sets) | 9 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **112** |
| Axial | **41** |
| Lower back | 17 |
| Per-set systemic | 1.45 |
| High-systemic sets (cost 3+) | 7 |
| Compound share | 36% |
| Shoulder / knee / elbow cost | 24 / 40 / 37 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.88 |
| Mean stability demand (0-4) | 1.21 |
| Stimulus per unit fatigue | 1.29 |
| Failure-safe share of sets | 40% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 28 |
| At 1 set | 0 |
| At 2 sets | 11 |
| At 3 sets | 13 |
| At 4+ sets | 4 |
| Mean sets per slot | 2.75 |
| Distinct exercises | 26 |
| Variety density (exercises per 10 sets) | 3.38 |
| Largest single-exercise share | 9% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (4):**

- Oracle — Upper A · Calibration — Flat Barbell Bench Press, 4 sets *(session opener)*
- Oracle — Lower A · Calibration — Barbell Squat, 4 sets *(session opener)*
- Oracle — Upper B · Calibration — Incline DB Bench Press, 4 sets *(session opener)*
- Oracle — Lower B · Calibration — Leg Press, 4 sets *(session opener)*

---

## 6. Export block

```yaml
id: oracle
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 10
frequency: [4]
engine: rotation
sampled_week: 1
weekly: { sets: 77, days: 4, sets_per_session: 19.3, slots: 28 }
load: { systemic: 112, axial: 41, lower_back: 17, per_set_systemic: 1.45 }
volume: { glutes: 20, quads: 17, shoulders: 14, chest: 11, back: 11, hamstrings: 9, calves: 6, biceps: 4, triceps: 4, core: 2 }
coverage: { covered: 9, missing: [], in_band: 6, over: [], under: ['biceps', 'triceps', 'hamstrings', 'core'] }
set_shape: { slots: 28, ones: 0, twos: 11, threes: 13, four_plus: 4, mean: 2.75 }
variety: { distinct: 26, density: 3.38, top_share: 0.091, evenness: 0.978 }
```
