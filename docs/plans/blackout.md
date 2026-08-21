# Blackout

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `blackout` |
| **Length** | 8 weeks |
| **Frequency** | 3 days/week |
| **Weekly sets** | 23 across 3 training days (week 1 sample) |
| **Sets/session** | 7.7 |
| **Goal** | strength, hypertrophy |
| **Experience** | intermediate |
| **Equipment** | full-gym |
| **Adaptability** | responsive |
| **Fatigue cost** | 2/4 — moderate |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Card promise** | *"An advanced 8-week plan of one work set per movement, and nothing wasted."* |

---

## 1. What this plan is

**Signature mechanic.** One work set per movement, and a back-off you have to earn with a clean one.

The onboarding card claims:

- 3 full-body days
- One work set per exercise
- Back-off sets are earned, not scheduled
- Quality and stop reason are mandatory

**Prerequisites.** Years of training; Honest self-assessment of set quality

**Not for you if.**

- You are still learning what a hard set feels like
- You need volume to feel like you trained

**Follow-ups.** [trinary](trinary.md), [oracle](oracle.md), [project-chimera](project-chimera.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Blackout I · Adjustment | 7 | 7 | Leg Press 1×5-8, 30° Smith Incline Bench Press 1×6-10, Single-Arm Hammer Strength Row 1×8-12, Seated Hamstring Curl 1×10-15, Cable Lateral Raise 1×12-15, Leg Extensions 1×12-15, Machine Curl 1×8-12 |
| Blackout II · Adjustment | 7 | 7 | Hammer Chest Press 1×4-6, Hammer Pulldown (Underhand) 1×8-12, Hack Squat 1×8-12, Seated Hamstring Curl 1×10-15, Machine Rear Delt Fly 1×12-15, Rolling DB Tricep Extensions 1×10-15, Hack Squat Calf Raises 1×12-20 |
| Blackout III · Adjustment | 9 | 9 | Front-Foot Elevated Bulgarian Split Squat 1×6-10, Shoulder Press 1×6-10, Overhand Mid-Grip Pulldown 1×8-12, Lying Leg Curls 1×10-15, Pec Deck 1×12-15, Bayesian Cable Curl 1×10-15, Smith Machine Skullcrusher 1×10-15, Hack Squat Calf Raises 1×12-20, Cable Crunch 1×10-15 |

### Week-to-week shape

The program runs 8 weeks falling into 3 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2 | Blackout I · Adjustment 7, Blackout II · Adjustment 7, Blackout III · Adjustment 9 |
| 3, 4, 5, 6 | Blackout I · Blackout 7, Blackout II · Blackout 7, Blackout III · Blackout 9 |
| 7, 8 | Blackout I · Deep 7, Blackout II · Deep 7, Blackout III · Deep 9 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| shoulders | 4 | below the 10-set growth dose |
| quads | 4 | below the 10-set growth dose |
| chest | 3 | below the 10-set growth dose |
| back | 3 | below the 10-set growth dose |
| hamstrings | 3 | below the 10-set growth dose |
| glutes | 3 | below the 10-set growth dose |
| biceps | 2 | below the 6-set growth dose |
| triceps | 2 | below the 6-set growth dose |
| calves | 2 | below the 6-set growth dose |
| core | 1 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.8 |
| Quad:hamstring | 1.33 |
| Groups covered (4+ sets) | 2 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **29** |
| Axial | **6** |
| Lower back | 0 |
| Per-set systemic | 1.26 |
| High-systemic sets (cost 3+) | 1 |
| Compound share | 22% |
| Shoulder / knee / elbow cost | 7 / 11 / 14 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.96 |
| Mean stability demand (0-4) | 0.74 |
| Stimulus per unit fatigue | 1.55 |
| Failure-safe share of sets | 61% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 23 |
| At 1 set | 23 |
| At 2 sets | 0 |
| At 3 sets | 0 |
| At 4+ sets | 0 |
| Mean sets per slot | 1 |
| Distinct exercises | 21 |
| Variety density (exercises per 10 sets) | 9.13 |
| Largest single-exercise share | 9% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**One set (23):**

- Blackout I · Adjustment — Leg Press
- Blackout I · Adjustment — 30° Smith Incline Bench Press
- Blackout I · Adjustment — Single-Arm Hammer Strength Row
- Blackout I · Adjustment — Seated Hamstring Curl
- Blackout I · Adjustment — Cable Lateral Raise
- Blackout I · Adjustment — Leg Extensions
- Blackout I · Adjustment — Machine Curl
- Blackout II · Adjustment — Hammer Chest Press
- Blackout II · Adjustment — Hammer Pulldown (Underhand)
- Blackout II · Adjustment — Hack Squat
- Blackout II · Adjustment — Seated Hamstring Curl
- Blackout II · Adjustment — Machine Rear Delt Fly
- Blackout II · Adjustment — Rolling DB Tricep Extensions
- Blackout II · Adjustment — Hack Squat Calf Raises
- Blackout III · Adjustment — Front-Foot Elevated Bulgarian Split Squat
- Blackout III · Adjustment — Shoulder Press
- Blackout III · Adjustment — Overhand Mid-Grip Pulldown
- Blackout III · Adjustment — Lying Leg Curls
- Blackout III · Adjustment — Pec Deck
- Blackout III · Adjustment — Bayesian Cable Curl
- Blackout III · Adjustment — Smith Machine Skullcrusher
- Blackout III · Adjustment — Hack Squat Calf Raises
- Blackout III · Adjustment — Cable Crunch

---

## 6. Rep schemes

7 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Bayesian Cable Curl, Cable Crunch, Lying Leg Curls, Rolling DB Tricep Extensions, Seated Hamstring Curl, Smith Machine Skullcrusher |
| `12-15` | Cable Lateral Raise, Leg Extensions, Machine Rear Delt Fly, Pec Deck |
| `12-20` | Hack Squat Calf Raises |
| `4-6` | Hammer Chest Press |
| `5-8` | Leg Press |
| `6-10` | 30° Smith Incline Bench Press, Front-Foot Elevated Bulgarian Split Squat, Shoulder Press |
| `8-12` | Hack Squat, Hammer Pulldown (Underhand), Machine Curl, Overhand Mid-Grip Pulldown, Single-Arm Hammer Strength Row |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | none of its own; the shared `genericDoubleProgression` runs |
| **Slot-level rules** | declared on at least one movement |
| **Next load written** | 60 of 60 movements (100%) after a clean session |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | double progression +2.5kg | 30° Smith Incline Bench Press, Bayesian Cable Curl, Cable Crunch, Cable Lateral Raise, Front-Foot Elevated Bulgarian Split Squat, Hack Squat, Hack Squat Calf Raises, Hammer Chest Press, Hammer Pulldown (Underhand), Leg Extensions, Leg Press, Lying Leg Curls, Machine Curl, Machine Rear Delt Fly, Overhand Mid-Grip Pulldown, Pec Deck, Rolling DB Tricep Extensions, Seated Hamstring Curl, Shoulder Press, Single-Arm Hammer Strength Row, Smith Machine Skullcrusher |

---

## 8. Export block

```yaml
id: blackout
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 8
frequency: [3]
engine: calendar
sampled_week: 1
weekly: { sets: 23, days: 3, sets_per_session: 7.7, slots: 23 }
load: { systemic: 29, axial: 6, lower_back: 0, per_set_systemic: 1.26 }
volume: { shoulders: 4, quads: 4, chest: 3, back: 3, hamstrings: 3, glutes: 3, biceps: 2, triceps: 2, calves: 2, core: 1 }
coverage: { covered: 2, missing: [], in_band: 0, over: [], under: ['chest', 'shoulders', 'back', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'] }
set_shape: { slots: 23, ones: 23, twos: 0, threes: 0, four_plus: 0, mean: 1 }
rep_ranges: ['10-15', '12-15', '12-20', '4-6', '5-8', '6-10', '8-12']
progression: { handler: shared, slot_rules: true, distinct_rules: 1 }
variety: { distinct: 21, density: 9.13, top_share: 0.087, evenness: 0.99 }
```
