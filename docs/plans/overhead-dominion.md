# Overhead Dominion

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `overhead-dominion` |
| **Length** | 10 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 81 across 4 training days (week 1 sample) |
| **Sets/session** | 20.3 |
| **Goal** | specialisation, strength |
| **Experience** | intermediate, advanced |
| **Equipment** | barbell, full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight` |
| **Techniques used** | `last-set-failure`, `wave` |
| **Card promise** | *"10 weeks of shoulder specialisation. Delts four times a week, and never the same way twice."* |

---

## 1. What this plan is

**Signature mechanic.** Shoulder specialisation built on the standing press four times a week.

The onboarding card claims:

- Focus: Shoulders
- 4 Days / Week - delts 4x, upper back 3x
- Heavy press, volume laterals, braced unilateral, structural
- Front, side and rear delt volume tracked separately
- Later block moves the press onto 5/3/2 waves

**Prerequisites.** Comfortable overhead position

**Not for you if.**

- Overhead pressing is where your shoulder complains

**Follow-ups.** [atlas](atlas.md), [monolith](monolith.md), [cathedral](cathedral.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Overhead Strength · Bombardment | 6 | 18 | Standing Military Press 5×5-8, Weighted Chin-Up 5×5-8, Cable Lateral Raise 2×12-20, Leaning One-Arm Lateral Raise 2×12-20, Rope Pressdown 2×10-15, Machine Rear Delt Fly 2×15-20 |
| Delts + Legs · Bombardment | 8 | 21 | Cable Lateral Raise 2×12-20, Seated Dumbbell Lateral Raise 2×12-20, Single Arm Reverse Pec Deck 2×12-20, Hack Squat 3×8-12, Seated Ham Curl 3×8-12, Hammer Chest Press 3×8-12, Standing Calf Raises 3×12-20, Cable Crunch 3×12-20 |
| Shoulder Hypertrophy · Bombardment | 8 | 21 | One-Arm Braced Dumbbell Press 4×8-12, Single-Arm DB Row 2×8-12, Lat Prayer 2×8-12, Seated Dumbbell Lateral Raise 2×12-20, Leaning One-Arm Lateral Raise 2×12-20, Machine Rear Delt Fly 3×15-20, Incline DB Bench Press 3×8-12, Cable Curl 3×10-15 |
| Structural Shoulders + Legs · Bombardment | 7 | 21 | Seated DB Shoulder Press 3×8-12, Single-Arm External Rotation 3×12-20, Machine Rear Delt Fly 3×15-20, Goblet Skater Squat 3×8-12, Hip-Supported Dumbbell Deadlift 3×10-15, Standing Calf Raises 3×12-20, Rope Pressdown 3×10-15 |

### Week-to-week shape

The program runs 10 weeks falling into 2 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3, 4, 5 | Overhead Strength · Bombardment 18, Delts + Legs · Bombardment 21, Shoulder Hypertrophy · Bombardment 21, Structural Shoulders + Legs · Bombardment 21 |
| 6, 7, 8, 9, 10 | Overhead Strength · Artillery 18, Delts + Legs · Artillery 21, Shoulder Hypertrophy · Artillery 21, Structural Shoulders + Legs · Artillery 21 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| shoulders | 40 | above the 20-set ceiling |
| back | 9 | below the 10-set growth dose |
| glutes | 9 | below the 10-set growth dose |
| biceps | 8 | in band |
| chest | 6 | below the 10-set growth dose |
| quads | 6 | below the 10-set growth dose |
| hamstrings | 6 | below the 10-set growth dose |
| calves | 6 | in band |
| triceps | 5 | below the 6-set growth dose |
| core | 3 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 3 |
| Quad:hamstring | 1 |
| Groups covered (4+ sets) | 9 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **118** |
| Axial | **33** |
| Lower back | 13 |
| Per-set systemic | 1.46 |
| High-systemic sets (cost 3+) | 6 |
| Compound share | 38% |
| Shoulder / knee / elbow cost | 52 / 15 / 41 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.65 |
| Mean stability demand (0-4) | 1.3 |
| Stimulus per unit fatigue | 1.14 |
| Failure-safe share of sets | 42% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 29 |
| At 1 set | 0 |
| At 2 sets | 11 |
| At 3 sets | 15 |
| At 4+ sets | 3 |
| Mean sets per slot | 2.79 |
| Distinct exercises | 22 |
| Variety density (exercises per 10 sets) | 2.72 |
| Largest single-exercise share | 10% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (3):**

- Overhead Strength · Bombardment — Standing Military Press, 5 sets *(session opener)*
- Overhead Strength · Bombardment — Weighted Chin-Up, 5 sets
- Shoulder Hypertrophy · Bombardment — One-Arm Braced Dumbbell Press, 4 sets *(session opener)*

---

## 6. Rep schemes

5 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Cable Curl, Hip-Supported Dumbbell Deadlift, Rope Pressdown |
| `12-20` | Cable Crunch, Cable Lateral Raise, Leaning One-Arm Lateral Raise, Seated Dumbbell Lateral Raise, Single Arm Reverse Pec Deck, Single-Arm External Rotation, Standing Calf Raises |
| `15-20` | Machine Rear Delt Fly |
| `5-8` | Standing Military Press, Weighted Chin-Up |
| `8-12` | Goblet Skater Squat, Hack Squat, Hammer Chest Press, Incline DB Bench Press, Lat Prayer, One-Arm Braced Dumbbell Press, Seated DB Shoulder Press, Seated Ham Curl, Single-Arm DB Row |

---

## 7. Export block

```yaml
id: overhead-dominion
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 10
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 81, days: 4, sets_per_session: 20.3, slots: 29 }
load: { systemic: 118, axial: 33, lower_back: 13, per_set_systemic: 1.46 }
volume: { shoulders: 40, back: 9, glutes: 9, biceps: 8, chest: 6, quads: 6, hamstrings: 6, calves: 6, triceps: 5, core: 3 }
coverage: { covered: 9, missing: [], in_band: 2, over: ['shoulders'], under: ['chest', 'back', 'triceps', 'quads', 'hamstrings', 'glutes', 'core'] }
set_shape: { slots: 29, ones: 0, twos: 11, threes: 15, four_plus: 3, mean: 2.79 }
rep_ranges: ['10-15', '12-20', '15-20', '5-8', '8-12']
variety: { distinct: 22, density: 2.72, top_share: 0.099, evenness: 0.979 }
```
