# Peachy

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `peachy-glute-plan` |
| **Length** | 12 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 68 across 4 training days (week 1 sample) |
| **Sets/session** | 17 |
| **Goal** | specialisation, hypertrophy |
| **Experience** | beginner, intermediate |
| **Equipment** | full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 2/4 — moderate |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `preprocessDay`, `calculateWeight`, `getExerciseAdvice` |
| **Card promise** | *"12-week glute specialization. For those who want a better booty."* |

---

## 1. What this plan is

**Signature mechanic.** Glute specialisation with a measurement widget and a hip-thrust progression that actually loads.

The onboarding card claims:

- Focus: Glutes & Lower
- 4 Days / Week
- Science-Based Glute Programming

**Not for you if.**

- You want upper-body development in the same block

**Follow-ups.** [venus-rising](venus-rising.md), [quadfather](quadfather.md), [event-horizon](event-horizon.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Monday - Glute/Legs Heavy | 6 | 17 | Sumo Deadlift 3×5-8, Front-Foot Elevated Bulgarian Split Squat 3×8-12, Squats 3×5-10, Seated Hamstring Curl 3×8-12, Hack Squat Calf Raises 3×15-20, Machine Hip Abduction 2×12-20 |
| Wednesday - Glute/Upper Pump | 7 | 17 | Kas Glute Bridge 3×8-12, 45-Degree Hyperextension 2×15-20, Standing Military Press 2×8-12, Incline DB Bench Press (45°) 2×8-12, Inverted Rows 3×8-12, Side-Lying Rear Delt Fly 3×12-15, Cable Crunch 2×10-15 |
| Friday - Posterior Chain | 6 | 17 | DB Romanian Deadlift 3×5-8, Paused Squat 3×5-10, Glute Ham Raise (eccentric only) 3×Failure, Hip Adduction 3×8-12, Standing Calf Raises 3×15-20, Machine Hip Abduction 2×12-20 |
| Saturday - Unilateral & Pump | 7 | 17 | Deficit Reverse Lunge 2×8-12, Single Leg Machine Hip Thrust 3×12-15, Deficit Push-ups 3×Max, Assisted Pull-ups 2×Max, Y-Raises 2×12-15, Lying Cable Lat Raises 3×12-15, Cable Crunch 2×10-15 |

### Week-to-week shape

The program runs 12 weeks falling into 2 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 | Monday - Glute/Legs Heavy 17, Wednesday - Glute/Upper Pump 17, Friday - Posterior Chain 17, Saturday - Unilateral & Pump 17 |
| 12 | Monday - Glute/Legs Heavy 17, Wednesday - Glute/Upper Pump 17, Friday - Posterior Chain 17, Saturday - Unilateral & Pump 18 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 32 | above the 20-set ceiling |
| back | 12 | in band |
| hamstrings | 12 | in band |
| quads | 11 | in band |
| shoulders | 10 | in band |
| calves | 6 | in band |
| chest | 5 | below the 10-set growth dose |
| core | 4 | below the 6-set growth dose |
| biceps | 0 | no direct sets |
| triceps | 0 | no direct sets |

**Untrained groups:** `biceps`, `triceps`.

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.25 |
| Quad:hamstring | 0.92 |
| Groups covered (4+ sets) | 8 of 10 |
| Groups trained on two or more days | 8 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **107** |
| Axial | **34** |
| Lower back | 40 |
| Per-set systemic | 1.57 |
| High-systemic sets (cost 3+) | 12 |
| Compound share | 40% |
| Shoulder / knee / elbow cost | 19 / 28 / 9 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.94 |
| Mean stability demand (0-4) | 1.09 |
| Stimulus per unit fatigue | 1.23 |
| Failure-safe share of sets | 46% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 26 |
| At 1 set | 0 |
| At 2 sets | 10 |
| At 3 sets | 16 |
| At 4+ sets | 0 |
| Mean sets per slot | 2.62 |
| Distinct exercises | 24 |
| Variety density (exercises per 10 sets) | 3.53 |
| Largest single-exercise share | 6% |

No slot sits at one set and none carries more than three. Nothing to flag.

---

## 6. Rep schemes

9 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Cable Crunch |
| `12-15` | Lying Cable Lat Raises, Side-Lying Rear Delt Fly, Single Leg Machine Hip Thrust, Y-Raises |
| `12-20` | Machine Hip Abduction |
| `15-20` | 45-Degree Hyperextension, Hack Squat Calf Raises, Standing Calf Raises |
| `5-10` | Paused Squat, Squats |
| `5-8` | DB Romanian Deadlift, Sumo Deadlift |
| `8-12` | Deficit Reverse Lunge, Front-Foot Elevated Bulgarian Split Squat, Hip Adduction, Incline DB Bench Press (45°), Inverted Rows, Kas Glute Bridge, Seated Hamstring Curl, Standing Military Press |
| `Failure` | Glute Ham Raise (eccentric only) |
| `Max` | Assisted Pull-ups, Deficit Push-ups |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | its own rule — `PROGRESSION_HANDLERS['peachy-glute-plan']`, which does **not** fall back to the shared double progression |
| **Slot-level rules** | none — every movement is carried by the handler |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | the plan's own rule (`peachy-glute-plan` handler) | 45-Degree Hyperextension, Assisted Pull-ups, Cable Crunch, DB Romanian Deadlift, Deficit Push-ups, Deficit Reverse Lunge, Front-Foot Elevated Bulgarian Split Squat, Glute Ham Raise (eccentric only), Glute Pump Finisher, Hack Squat Calf Raises, Hip Adduction, Incline DB Bench Press (45°), Inverted Rows, Kas Glute Bridge, Lying Cable Lat Raises, Machine Hip Abduction, Seated Hamstring Curl, Side-Lying Rear Delt Fly, Single Leg Machine Hip Thrust, Squats, Standing Calf Raises, Standing Military Press, Sumo Deadlift, Y-Raises |
| 80% of squat | the tracked max is re-estimated from what you log | Paused Squat |

---

## 8. Export block

```yaml
id: peachy-glute-plan
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 12
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 68, days: 4, sets_per_session: 17, slots: 26 }
load: { systemic: 107, axial: 34, lower_back: 40, per_set_systemic: 1.57 }
volume: { glutes: 32, back: 12, hamstrings: 12, quads: 11, shoulders: 10, calves: 6, chest: 5, core: 4, biceps: 0, triceps: 0 }
coverage: { covered: 8, missing: ['biceps', 'triceps'], in_band: 5, over: ['glutes'], under: ['chest', 'core'] }
set_shape: { slots: 26, ones: 0, twos: 10, threes: 16, four_plus: 0, mean: 2.62 }
rep_ranges: ['10-15', '12-15', '12-20', '15-20', '5-10', '5-8', '8-12', 'Failure', 'Max']
progression: { handler: own, slot_rules: false, distinct_rules: 2 }
variety: { distinct: 24, density: 3.53, top_share: 0.059, evenness: 0.994 }
```
