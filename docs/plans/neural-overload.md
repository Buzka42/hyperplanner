# Neural Overload

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `neural-overload` |
| **Length** | 9 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 70 across 4 training days (week 1 sample) |
| **Sets/session** | 17.5 |
| **Goal** | strength, hypertrophy |
| **Experience** | advanced |
| **Equipment** | barbell, full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 4/4 — very high |
| **Session engine** | `calendar` |
| **Calibration** | required: `pausedBench`, `squat` |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `last-set-failure` |
| **Card promise** | *"9 weeks of 1-6 loading. Heavy single, back-off six, heavier single, heavier six."* |

---

## 1. What this plan is

**Signature mechanic.** The 1-6 method: a heavy single potentiating a set of six, twice over. Day 4’s squat is a picker — front, hack, stripper or safety-bar.

The onboarding card claims:

- Focus: Strength and size together
- 4 Days / Week
- Post-activation: does the second six beat the first?
- The single is never a weekly max attempt
- Day 4 builds without adding neural cost

**Prerequisites.** Confident singles; A training age past the beginner jumps

**Not for you if.**

- You are uncomfortable taking heavy singles alone

**Follow-ups.** [trinary](trinary.md), [blackout](blackout.md), [oracle](oracle.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Bench Neural · Charge | 9 | 17 | Paused Bench Press 1×1, Paused Bench Press 1×1, Paused Bench Press 1×1, Paused Bench Press 1×1, Barbell Row 4×8-12, Wide-Grip Cable Row 3×8-12, Leaning One-Arm Lateral Raise 2×12-20, Bayesian Cable Curl 2×10-15, Cable Triceps Extension 2×10-15 |
| Squat Neural · Charge | 8 | 16 | Paused Low Bar Squat 1×1, Paused Low Bar Squat 1×1, Paused Low Bar Squat 1×1, Paused Low Bar Squat 1×1, Seated Ham Curl 3×8-12, Leg Extensions 3×10-15, Hack Squat Calf Raises 3×12-20, Cable Crunch 3×12-20 |
| Chin Neural · Charge | 8 | 17 | Weighted Chin-Up 1×1-2, Weighted Chin-Up 1×1-2, Weighted Chin-Up 1×1-2, Weighted Chin-Up 1×1-2, Incline DB Bench Press 4×8-12, Machine Rear Delt Fly 3×15-20, Standing Straight-Bar Curl 3×10-15, Heavy Rolling Tricep Extensions 3×10-15 |
| Lower Powerbuilding · Charge | 6 | 20 | Front Squats 5×3-5, Hip-Supported Dumbbell Deadlift 3×8-12, Goblet Skater Squat 3×10-12, Seated Ham Curl 3×8-12, Hack Squat Calf Raises 3×12-20, Low-to-High Cable Flyes 3×8-12 |

### Week-to-week shape

The program runs 9 weeks falling into 3 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3 | Bench Neural · Charge 17, Squat Neural · Charge 16, Chin Neural · Charge 17, Lower Powerbuilding · Charge 20 |
| 4, 5, 6 | Bench Neural · Discharge 17, Squat Neural · Discharge 16, Chin Neural · Discharge 17, Lower Powerbuilding · Discharge 20 |
| 7, 8, 9 | Bench Neural · Overload 15, Squat Neural · Overload 12, Chin Neural · Overload 13, Lower Powerbuilding · Overload 14 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| quads | 15 | in band |
| glutes | 15 | in band |
| chest | 11 | in band |
| back | 11 | in band |
| shoulders | 9 | below the 10-set growth dose |
| biceps | 9 | in band |
| hamstrings | 9 | below the 10-set growth dose |
| calves | 6 | in band |
| triceps | 5 | below the 6-set growth dose |
| core | 3 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.25 |
| Quad:hamstring | 1.67 |
| Groups covered (4+ sets) | 9 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **117** |
| Axial | **38** |
| Lower back | 39 |
| Per-set systemic | 1.67 |
| High-systemic sets (cost 3+) | 16 |
| Compound share | 44% |
| Shoulder / knee / elbow cost | 16 / 36 / 35 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.94 |
| Mean stability demand (0-4) | 1.39 |
| Stimulus per unit fatigue | 1.16 |
| Failure-safe share of sets | 29% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 31 |
| At 1 set | 12 |
| At 2 sets | 3 |
| At 3 sets | 13 |
| At 4+ sets | 3 |
| Mean sets per slot | 2.26 |
| Distinct exercises | 20 |
| Variety density (exercises per 10 sets) | 2.86 |
| Largest single-exercise share | 9% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**One set (12):**

- Bench Neural · Charge — Paused Bench Press
- Bench Neural · Charge — Paused Bench Press
- Bench Neural · Charge — Paused Bench Press
- Bench Neural · Charge — Paused Bench Press
- Squat Neural · Charge — Paused Low Bar Squat
- Squat Neural · Charge — Paused Low Bar Squat
- Squat Neural · Charge — Paused Low Bar Squat
- Squat Neural · Charge — Paused Low Bar Squat
- Chin Neural · Charge — Weighted Chin-Up
- Chin Neural · Charge — Weighted Chin-Up
- Chin Neural · Charge — Weighted Chin-Up
- Chin Neural · Charge — Weighted Chin-Up

**Four or more sets (3):**

- Bench Neural · Charge — Barbell Row, 4 sets
- Chin Neural · Charge — Incline DB Bench Press, 4 sets
- Lower Powerbuilding · Charge — Front Squats, 5 sets *(session opener)*

---

## 6. Rep schemes

8 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `1` | Paused Bench Press, Paused Low Bar Squat |
| `1-2` | Weighted Chin-Up |
| `10-12` | Goblet Skater Squat |
| `10-15` | Bayesian Cable Curl, Cable Triceps Extension, Heavy Rolling Tricep Extensions, Leg Extensions, Standing Straight-Bar Curl |
| `12-20` | Cable Crunch, Hack Squat Calf Raises, Leaning One-Arm Lateral Raise |
| `15-20` | Machine Rear Delt Fly |
| `3-5` | Front Squats |
| `8-12` | Barbell Row, Hip-Supported Dumbbell Deadlift, Incline DB Bench Press, Low-to-High Cable Flyes, Seated Ham Curl, Wide-Grip Cable Row |

---

## 7. Export block

```yaml
id: neural-overload
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 9
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 70, days: 4, sets_per_session: 17.5, slots: 31 }
load: { systemic: 117, axial: 38, lower_back: 39, per_set_systemic: 1.67 }
volume: { quads: 15, glutes: 15, chest: 11, back: 11, shoulders: 9, biceps: 9, hamstrings: 9, calves: 6, triceps: 5, core: 3 }
coverage: { covered: 9, missing: [], in_band: 6, over: [], under: ['shoulders', 'triceps', 'hamstrings', 'core'] }
set_shape: { slots: 31, ones: 12, twos: 3, threes: 13, four_plus: 3, mean: 2.26 }
rep_ranges: ['1', '1-2', '10-12', '10-15', '12-20', '15-20', '3-5', '8-12']
variety: { distinct: 20, density: 2.86, top_share: 0.086, evenness: 0.984 }
```
