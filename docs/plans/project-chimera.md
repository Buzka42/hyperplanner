# Project Chimera

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `project-chimera` |
| **Length** | 16 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 79 across 4 training days (week 1 sample) |
| **Sets/session** | 19.8 |
| **Goal** | hypertrophy, strength |
| **Experience** | intermediate, advanced |
| **Equipment** | full-gym, barbell |
| **Adaptability** | adaptive |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `rotation` |
| **Calibration** | seeded: `squat`, `flatBench`, `conventionalDeadlift` |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `last-set-failure` |
| **Card promise** | *"16 weeks in four blocks, reallocating a little volume toward whatever you actually respond to."* |

---

## 1. What this plan is

**Signature mechanic.** Four blocks that quietly reallocate a couple of sets toward whatever you respond to.

The onboarding card claims:

- 4 days, upper/lower
- Balanced across six qualities
- Small, confirmable changes each block
- No data means no change

**Prerequisites.** Sixteen weeks you can actually commit to

**Not for you if.**

- You want a short block
- You will not log consistently enough to produce evidence

**Follow-ups.** [oracle](oracle.md), [event-horizon](event-horizon.md), [blackout](blackout.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Chimera — Upper A · Block I | 9 | 22 | Flat Barbell Bench Press 4×5-8, Single-Arm Hammer Strength Row 2×8-12, Bench-Supported One-Arm Dumbbell Row 2×8-12, Single-Arm Landmine Press 3×8-12, Pull-Up 3×8-12, Leaning One-Arm Lateral Raise 2×12-15, Standing Straight-Bar Curl 2×8-12, Heavy Rolling Tricep Extensions 2×10-15, Cable Crunch 2×8-12 |
| Chimera — Lower A · Block I | 6 | 18 | Barbell Squat 4×5-8, Romanian Deadlift 3×6-10, Front-Foot Elevated Bulgarian Split Squat 3×8-12, Seated Hamstring Curl 3×10-15, Leg Extensions 2×12-15, Hack Squat Calf Raises 3×12-20 |
| Chimera — Upper B · Block I | 8 | 20 | Hammer Pulldown (Underhand) 4×8-12, Incline DB Bench Press 2×6-10, 30° Smith Incline Bench Press 2×6-10, Barbell Row 3×6-10, Hammer Chest Press 3×8-12, Side-Lying Rear Delt Flyes 2×12-15, Cable Triceps Extension 2×10-15, Standing Straight-Bar Curl 2×8-12 |
| Chimera — Lower B · Block I | 6 | 19 | Trap-Bar Deadlift 4×4-6, Leg Press 3×8-12, Weighted Step-Up 3×8-10, Lying Leg Curls 3×10-15, Single Leg Machine Hip Thrust 3×10-15, Hack Squat Calf Raises 3×12-20 |

### Week-to-week shape

The program runs 16 weeks falling into 4 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3, 4 | Chimera — Upper A · Block I 22, Chimera — Lower A · Block I 18, Chimera — Upper B · Block I 20, Chimera — Lower B · Block I 19 |
| 5, 6, 7, 8 | Chimera — Upper A · Block II 22, Chimera — Lower A · Block II 18, Chimera — Upper B · Block II 20, Chimera — Lower B · Block II 19 |
| 9, 10, 11, 12 | Chimera — Upper A · Block III 22, Chimera — Lower A · Block III 18, Chimera — Upper B · Block III 20, Chimera — Lower B · Block III 19 |
| 13, 14, 15, 16 | Chimera — Upper A · Block IV 22, Chimera — Lower A · Block IV 18, Chimera — Upper B · Block IV 20, Chimera — Lower B · Block IV 19 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 23 | above the 20-set ceiling |
| quads | 19 | in band |
| back | 14 | in band |
| hamstrings | 13 | in band |
| chest | 11 | in band |
| shoulders | 11 | in band |
| calves | 6 | in band |
| biceps | 4 | below the 6-set growth dose |
| triceps | 4 | below the 6-set growth dose |
| core | 2 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.44 |
| Quad:hamstring | 1.46 |
| Groups covered (4+ sets) | 9 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **132** |
| Axial | **51** |
| Lower back | 42 |
| Per-set systemic | 1.67 |
| High-systemic sets (cost 3+) | 14 |
| Compound share | 49% |
| Shoulder / knee / elbow cost | 21 / 36 / 37 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2.09 |
| Mean stability demand (0-4) | 1.41 |
| Stimulus per unit fatigue | 1.25 |
| Failure-safe share of sets | 38% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 29 |
| At 1 set | 0 |
| At 2 sets | 12 |
| At 3 sets | 13 |
| At 4+ sets | 4 |
| Mean sets per slot | 2.72 |
| Distinct exercises | 27 |
| Variety density (exercises per 10 sets) | 3.42 |
| Largest single-exercise share | 8% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (4):**

- Chimera — Upper A · Block I — Flat Barbell Bench Press, 4 sets *(session opener)*
- Chimera — Lower A · Block I — Barbell Squat, 4 sets *(session opener)*
- Chimera — Upper B · Block I — Hammer Pulldown (Underhand), 4 sets *(session opener)*
- Chimera — Lower B · Block I — Trap-Bar Deadlift, 4 sets *(session opener)*

---

## 6. Rep schemes

8 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Cable Triceps Extension, Heavy Rolling Tricep Extensions, Lying Leg Curls, Seated Hamstring Curl, Single Leg Machine Hip Thrust |
| `12-15` | Leaning One-Arm Lateral Raise, Leg Extensions, Side-Lying Rear Delt Flyes |
| `12-20` | Hack Squat Calf Raises |
| `4-6` | Trap-Bar Deadlift |
| `5-8` | Barbell Squat, Flat Barbell Bench Press |
| `6-10` | 30° Smith Incline Bench Press, Barbell Row, Incline DB Bench Press, Romanian Deadlift |
| `8-10` | Weighted Step-Up |
| `8-12` | Bench-Supported One-Arm Dumbbell Row, Cable Crunch, Front-Foot Elevated Bulgarian Split Squat, Hammer Chest Press, Hammer Pulldown (Underhand), Leg Press, Pull-Up, Single-Arm Hammer Strength Row, Single-Arm Landmine Press, Standing Straight-Bar Curl |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | none of its own; the shared `genericDoubleProgression` runs |
| **Slot-level rules** | declared on at least one movement |
| **Next load written** | 58 of 58 movements (100%) after a clean session |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | double progression +2.5kg | 30° Smith Incline Bench Press, Barbell Row, Bench-Supported One-Arm Dumbbell Row, Cable Crunch, Cable Triceps Extension, Flat Barbell Bench Press, Front-Foot Elevated Bulgarian Split Squat, Hack Squat Calf Raises, Hammer Chest Press, Hammer Pulldown (Underhand), Heavy Rolling Tricep Extensions, Incline DB Bench Press, Leaning One-Arm Lateral Raise, Leg Extensions, Leg Press, Lying Leg Curls, Pull-Up, Romanian Deadlift, Seated Hamstring Curl, Side-Lying Rear Delt Flyes, Single Leg Machine Hip Thrust, Single-Arm Hammer Strength Row, Single-Arm Landmine Press, Standing Straight-Bar Curl, Weighted Step-Up |
| computed by the plan each session | the plan recalculates it from your logged work | Barbell Squat, Trap-Bar Deadlift |

---

## 8. Export block

```yaml
id: project-chimera
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 16
frequency: [4]
engine: rotation
sampled_week: 1
weekly: { sets: 79, days: 4, sets_per_session: 19.8, slots: 29 }
load: { systemic: 132, axial: 51, lower_back: 42, per_set_systemic: 1.67 }
volume: { glutes: 23, quads: 19, back: 14, hamstrings: 13, chest: 11, shoulders: 11, calves: 6, biceps: 4, triceps: 4, core: 2 }
coverage: { covered: 9, missing: [], in_band: 6, over: ['glutes'], under: ['biceps', 'triceps', 'core'] }
set_shape: { slots: 29, ones: 0, twos: 12, threes: 13, four_plus: 4, mean: 2.72 }
rep_ranges: ['10-15', '12-15', '12-20', '4-6', '5-8', '6-10', '8-10', '8-12']
progression: { handler: shared, slot_rules: true, distinct_rules: 2 }
variety: { distinct: 27, density: 3.42, top_share: 0.076, evenness: 0.985 }
```
