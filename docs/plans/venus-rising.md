# Venus Rising

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `venus-rising` |
| **Length** | 12 weeks |
| **Frequency** | 3/4 days/week |
| **Weekly sets** | 68 across 4 training days (week 1 sample) |
| **Sets/session** | 17 |
| **Goal** | hypertrophy, general |
| **Experience** | beginner, intermediate |
| **Equipment** | full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 2/4 — moderate |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Card promise** | *"A 12-week first structured plan — lower-body led, machine and cable led, with the priorities you pick once held inside a weekly set cap."* |

---

## 1. What this plan is

**Signature mechanic.** A first structured plan — lower-body led, machine and cable led, with the priorities you pick once held inside a weekly set cap.

The onboarding card claims:

- 3-day full body or 4-day upper/lower
- 15–17 sets per session
- User-selected priorities
- Simple double progression

**Not for you if.**

- You want a strength-first block

**Follow-ups.** [kali](kali.md), [peachy-glute-plan](peachy.md), [event-horizon](event-horizon.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Lower A — Quads + Glutes · Foundation | 7 | 16 | Heel-Elevated Goblet Squat 3×8-12, Leg Press 3×8-12, Seated Hamstring Curl 2×10-15, Leg Extensions 2×10-15, Machine Hip Abduction 2×12-20, Hack Squat Calf Raises 2×12-20, Cable Crunch 2×10-15 |
| Upper A — Back + Delts · Foundation | 7 | 18 | Assisted Pull-ups 3×8-12, Single-Arm Hammer Strength Row 3×8-12, Incline DB Bench Press 3×8-12, Cable Lateral Raise 3×12-20, Side-Lying Rear Delt Flyes 2×12-20, EZ Preacher Curl 2×10-15, Rope Pressdown 2×10-15 |
| Lower B — Glutes + Posterior Chain · Foundation | 6 | 15 | Hip Thrusts 3×8-12, Cable Romanian Deadlift 3×8-12, B-Stance Hip Thrust 3×8-12, Supported Sissy Squat 2×10-15, Lying Leg Curls 2×10-15, Hack Squat Calf Raises 2×12-20 |
| Upper B — Shape · Foundation | 8 | 19 | Hammer Pulldown (Underhand) 3×8-12, Flat DB Press 3×8-12, Pec Deck 2×8-12, Seated Hammer Shoulder Press 2×8-12, Seated Cable Row 3×8-12, Machine Curl 2×10-15, Cable Triceps Extension 2×10-15, Planks 2×30-60sec |

### Week-to-week shape

The program runs 12 weeks falling into 4 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3, 4 | Lower A — Quads + Glutes · Foundation 16, Upper A — Back + Delts · Foundation 18, Lower B — Glutes + Posterior Chain · Foundation 15, Upper B — Shape · Foundation 19 |
| 5, 6, 7, 8 | Lower A — Quads + Glutes · Rising 16, Upper A — Back + Delts · Rising 18, Lower B — Glutes + Posterior Chain · Rising 15, Upper B — Shape · Rising 19 |
| 9, 10, 11 | Lower A — Quads + Glutes · Ascension 16, Upper A — Back + Delts · Ascension 18, Lower B — Glutes + Posterior Chain · Ascension 15, Upper B — Shape · Ascension 19 |
| 12 | Lower A — Quads + Glutes · Rebirth 9, Upper A — Back + Delts · Rebirth 11, Lower B — Glutes + Posterior Chain · Rebirth 9, Upper B — Shape · Rebirth 11 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 17 | in band |
| back | 12 | in band |
| shoulders | 10 | in band |
| quads | 10 | in band |
| chest | 8 | below the 10-set growth dose |
| hamstrings | 7 | below the 10-set growth dose |
| biceps | 4 | below the 6-set growth dose |
| triceps | 4 | below the 6-set growth dose |
| calves | 4 | below the 6-set growth dose |
| core | 4 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.38 |
| Quad:hamstring | 1.43 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **84** |
| Axial | **15** |
| Lower back | 9 |
| Per-set systemic | 1.24 |
| High-systemic sets (cost 3+) | 3 |
| Compound share | 18% |
| Shoulder / knee / elbow cost | 20 / 26 / 32 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.91 |
| Mean stability demand (0-4) | 0.76 |
| Stimulus per unit fatigue | 1.55 |
| Failure-safe share of sets | 68% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 28 |
| At 1 set | 0 |
| At 2 sets | 16 |
| At 3 sets | 12 |
| At 4+ sets | 0 |
| Mean sets per slot | 2.43 |
| Distinct exercises | 27 |
| Variety density (exercises per 10 sets) | 3.97 |
| Largest single-exercise share | 6% |

No slot sits at one set and none carries more than three. Nothing to flag.

---

## 6. Rep schemes

4 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Cable Crunch, Cable Triceps Extension, EZ Preacher Curl, Leg Extensions, Lying Leg Curls, Machine Curl, Rope Pressdown, Seated Hamstring Curl, Supported Sissy Squat |
| `12-20` | Cable Lateral Raise, Hack Squat Calf Raises, Machine Hip Abduction, Side-Lying Rear Delt Flyes |
| `30-60sec` | Planks |
| `8-12` | Assisted Pull-ups, B-Stance Hip Thrust, Cable Romanian Deadlift, Flat DB Press, Hammer Pulldown (Underhand), Heel-Elevated Goblet Squat, Hip Thrusts, Incline DB Bench Press, Leg Press, Pec Deck, Seated Cable Row, Seated Hammer Shoulder Press, Single-Arm Hammer Strength Row |

---

## 7. Export block

```yaml
id: venus-rising
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 12
frequency: [3, 4]
engine: calendar
sampled_week: 1
weekly: { sets: 68, days: 4, sets_per_session: 17, slots: 28 }
load: { systemic: 84, axial: 15, lower_back: 9, per_set_systemic: 1.24 }
volume: { glutes: 17, back: 12, shoulders: 10, quads: 10, chest: 8, hamstrings: 7, biceps: 4, triceps: 4, calves: 4, core: 4 }
coverage: { covered: 10, missing: [], in_band: 4, over: [], under: ['chest', 'biceps', 'triceps', 'hamstrings', 'calves', 'core'] }
set_shape: { slots: 28, ones: 0, twos: 16, threes: 12, four_plus: 0, mean: 2.43 }
rep_ranges: ['10-15', '12-20', '30-60sec', '8-12']
variety: { distinct: 27, density: 3.97, top_share: 0.059, evenness: 0.992 }
```
