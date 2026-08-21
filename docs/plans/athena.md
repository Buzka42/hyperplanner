# Athena

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `athena` |
| **Length** | 12 weeks |
| **Frequency** | 3/4 days/week |
| **Weekly sets** | 67 across 4 training days (week 1 sample) |
| **Sets/session** | 16.8 |
| **Goal** | strength, hypertrophy |
| **Experience** | beginner, intermediate |
| **Equipment** | barbell, full-gym |
| **Adaptability** | responsive |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Card promise** | *"A 12-week bridge into intelligent heavy training and reusable performance data."* |

---

## 1. What this plan is

**Signature mechanic.** A bridge into heavy training: top sets with editable back-offs and no mandatory max test.

The onboarding card claims:

- 3-day or 4-day mode
- User-selected lift families
- Top sets with editable back-offs
- No mandatory max test

**Prerequisites.** Basic barbell competence

**Not for you if.**

- You already train with percentages and know your maxes

**Follow-ups.** [kali](kali.md), [oracle](oracle.md), [project-chimera](project-chimera.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Lower A — Squat · Wisdom | 6 | 15 | Barbell Squat 4×4-6, Romanian Deadlift 3×5-8, Front-Foot Elevated Bulgarian Split Squat 2×8-12, Seated Hamstring Curl 2×10-15, Hack Squat Calf Raises 2×12-20, Ab Wheel 2×10-15 |
| Upper A — Bench · Wisdom | 7 | 18 | Flat Barbell Bench Press 4×4-6, Single-Arm Hammer Strength Row 3×8-12, Assisted Pull-ups 3×5, Shoulder Press 2×8-12, Bench-Supported DB Rear Delt Fly 2×12-20, Rolling DB Tricep Extensions 2×10-15, Standing Straight-Bar Curl 2×10-15 |
| Lower B — Hinge · Wisdom | 7 | 16 | Romanian Deadlift 3×5-8, Paused Squat 3×5-8, Hip Thrusts 2×8-12, Leg Extensions 2×10-15, Lying Leg Curls 2×10-15, Hack Squat Calf Raises 2×12-20, Cable Crunch 2×10-15 |
| Upper B — Press/Pull · Wisdom | 8 | 18 | Standing Military Press 3×4-6, Assisted Pull-ups 3×5, Incline DB Bench Press 2×8-12, Pec Deck 2×10-15, Single-Arm Hammer Strength Row 2×8-12, Leaning One-Arm Lateral Raise 2×12-20, Bayesian Cable Curl 2×10-15, Cable Rope Pressdown 2×10-15 |

### Week-to-week shape

The program runs 12 weeks falling into 4 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3, 4 | Lower A — Squat · Wisdom 15, Upper A — Bench · Wisdom 18, Lower B — Hinge · Wisdom 16, Upper B — Press/Pull · Wisdom 18 |
| 5, 6, 7, 8 | Lower A — Squat · Discipline 15, Upper A — Bench · Discipline 18, Lower B — Hinge · Discipline 16, Upper B — Press/Pull · Discipline 18 |
| 9, 10, 11 | Lower A — Squat · Command 15, Upper A — Bench · Command 18, Lower B — Hinge · Command 16, Upper B — Press/Pull · Command 18 |
| 12 | Lower A — Squat · Judgment 10, Upper A — Bench · Judgment 11, Lower B — Hinge · Judgment 10, Upper B — Press/Pull · Judgment 11 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 17 | in band |
| shoulders | 11 | in band |
| back | 11 | in band |
| quads | 11 | in band |
| hamstrings | 10 | in band |
| chest | 8 | below the 10-set growth dose |
| biceps | 4 | below the 6-set growth dose |
| triceps | 4 | below the 6-set growth dose |
| calves | 4 | below the 6-set growth dose |
| core | 4 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.53 |
| Quad:hamstring | 1.1 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **108** |
| Axial | **49** |
| Lower back | 36 |
| Per-set systemic | 1.61 |
| High-systemic sets (cost 3+) | 13 |
| Compound share | 39% |
| Shoulder / knee / elbow cost | 28 / 26 / 35 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.96 |
| Mean stability demand (0-4) | 1.51 |
| Stimulus per unit fatigue | 1.21 |
| Failure-safe share of sets | 40% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 28 |
| At 1 set | 0 |
| At 2 sets | 19 |
| At 3 sets | 7 |
| At 4+ sets | 2 |
| Mean sets per slot | 2.39 |
| Distinct exercises | 24 |
| Variety density (exercises per 10 sets) | 3.58 |
| Largest single-exercise share | 9% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (2):**

- Lower A — Squat · Wisdom — Barbell Squat, 4 sets *(session opener)*
- Upper A — Bench · Wisdom — Flat Barbell Bench Press, 4 sets *(session opener)*

---

## 6. Rep schemes

6 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Ab Wheel, Bayesian Cable Curl, Cable Crunch, Cable Rope Pressdown, Leg Extensions, Lying Leg Curls, Pec Deck, Rolling DB Tricep Extensions, Seated Hamstring Curl, Standing Straight-Bar Curl |
| `12-20` | Bench-Supported DB Rear Delt Fly, Hack Squat Calf Raises, Leaning One-Arm Lateral Raise |
| `4-6` | Barbell Squat, Flat Barbell Bench Press, Standing Military Press |
| `5` | Assisted Pull-ups |
| `5-8` | Paused Squat, Romanian Deadlift |
| `8-12` | Front-Foot Elevated Bulgarian Split Squat, Hip Thrusts, Incline DB Bench Press, Shoulder Press, Single-Arm Hammer Strength Row |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | its own rule — `PROGRESSION_HANDLERS['athena']`, which does **not** fall back to the shared double progression |
| **Slot-level rules** | declared on at least one movement |
| **Next load written** | 56 of 56 movements (100%) after a clean session |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | the plan's own rule (`athena` handler) | Ab Wheel, Assisted Pull-ups, Bayesian Cable Curl, Bench-Supported DB Rear Delt Fly, Cable Crunch, Cable Rope Pressdown, Front-Foot Elevated Bulgarian Split Squat, Hack Squat Calf Raises, Hip Thrusts, Incline DB Bench Press, Leaning One-Arm Lateral Raise, Leg Extensions, Lying Leg Curls, Pec Deck, Rolling DB Tricep Extensions, Seated Hamstring Curl, Shoulder Press, Single-Arm Hammer Strength Row, Standing Straight-Bar Curl |
| computed by the plan each session | the plan recalculates it from your logged work | Barbell Squat, Paused Squat |
| carried working load | the plan's own rule (`athena` handler); later top set, then 2 back-off sets at 90% (+2.5kg) | Romanian Deadlift, Standing Military Press |
| carried working load | the plan's own rule (`athena` handler); later top set, then 3 back-off sets at 90% (+2.5kg); later top set, then 2 back-off sets at 90% (+2.5kg) | Flat Barbell Bench Press |

---

## 8. Export block

```yaml
id: athena
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 12
frequency: [3, 4]
engine: calendar
sampled_week: 1
weekly: { sets: 67, days: 4, sets_per_session: 16.8, slots: 28 }
load: { systemic: 108, axial: 49, lower_back: 36, per_set_systemic: 1.61 }
volume: { glutes: 17, shoulders: 11, back: 11, quads: 11, hamstrings: 10, chest: 8, biceps: 4, triceps: 4, calves: 4, core: 4 }
coverage: { covered: 10, missing: [], in_band: 5, over: [], under: ['chest', 'biceps', 'triceps', 'calves', 'core'] }
set_shape: { slots: 28, ones: 0, twos: 19, threes: 7, four_plus: 2, mean: 2.39 }
rep_ranges: ['10-15', '12-20', '4-6', '5', '5-8', '8-12']
progression: { handler: own, slot_rules: true, distinct_rules: 4 }
variety: { distinct: 24, density: 3.58, top_share: 0.09, evenness: 0.971 }
```
