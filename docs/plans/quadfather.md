# Quadfather

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `quadfather` |
| **Length** | 10 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 75 across 4 training days (week 1 sample) |
| **Sets/session** | 18.8 |
| **Goal** | specialisation, hypertrophy |
| **Experience** | intermediate |
| **Equipment** | full-gym |
| **Adaptability** | responsive |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `last-set-failure`, `myo-reps` |
| **Card promise** | *"A 10-week quad specialisation that trains legs three times while everything else is maintained."* |

---

## 1. What this plan is

**Signature mechanic.** Three quad sessions doing three different jobs — load, depth and burn — never three of the same.

The onboarding card claims:

- Quads 3×, other muscles 2×
- Load, depth and burn roles
- Confirmed range of motion
- Knee-feedback swaps

**Prerequisites.** Knees that tolerate loaded knee flexion

**Not for you if.**

- Your posterior chain is the weak link

**Follow-ups.** [king-of-the-squat](king-of-the-squat.md), [hamstring-foundry](hamstring-foundry.md), [event-horizon](event-horizon.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| The Offer — Load · Introduction | 7 | 19 | Hack Squat 4×5-8, Heel-Elevated Goblet Squat 3×8-12, Leg Extensions 2×12-15, Incline DB Bench Press 3×6-10, Single-Arm Hammer Strength Row 3×8-12, Cable Lateral Raise 2×12-15, Cable Crunch 2×12-20 |
| The Family — Maintain · Introduction | 8 | 20 | Romanian Deadlift 3×6-10, Lat Prayer 3×8-12, Dip 3×8-12, Seated Hamstring Curl 3×10-15, Bench-Supported DB Rear Delt Fly 2×12-15, EZ Preacher Curl 2×8-12, Overhead Tricep Extensions 2×8-15, Hack Squat Calf Raises 2×12-20 |
| The Debt — Depth · Introduction | 7 | 19 | Front-Foot Elevated Bulgarian Split Squat 3×8-12, Leg Press 3×10-15, Supported Sissy Squat 2×10-15, Seated Hammer Shoulder Press 3×8-12, Hammer Pulldown (Underhand) 3×8-12, Hack Squat Calf Raises 2×12-20, Cable Crunch 3×12-20 |
| The Reckoning — Burn · Introduction | 7 | 17 | Knee-Over-Toe Split Squat 3×8-12, Stripper Squat 3×10-15, Reverse Nordic Curls 2×8-12, Lying Leg Curls 2×10-15, Single-Arm Hammer Strength Row 3×8-12, EZ Preacher Curl 2×8-12, Cable Triceps Extension 2×10-15 |

### Week-to-week shape

The program runs 10 weeks falling into 4 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3 | The Offer — Load · Introduction 19, The Family — Maintain · Introduction 20, The Debt — Depth · Introduction 19, The Reckoning — Burn · Introduction 17 |
| 4, 5, 6, 7 | The Offer — Load · Enforcement 19, The Family — Maintain · Enforcement 20, The Debt — Depth · Enforcement 19, The Reckoning — Burn · Enforcement 17 |
| 8, 9 | The Offer — Load · Succession 19, The Family — Maintain · Succession 20, The Debt — Depth · Succession 19, The Reckoning — Burn · Succession 17 |
| 10 | The Offer — Load · Settlement 12, The Family — Maintain · Settlement 12, The Debt — Depth · Settlement 12, The Reckoning — Burn · Settlement 10 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| quads | 25 | above the 20-set ceiling |
| glutes | 16 | in band |
| back | 12 | in band |
| shoulders | 10 | in band |
| hamstrings | 8 | below the 10-set growth dose |
| triceps | 7 | in band |
| chest | 6 | below the 10-set growth dose |
| core | 5 | below the 6-set growth dose |
| biceps | 4 | below the 6-set growth dose |
| calves | 4 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.44 |
| Quad:hamstring | 3.13 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **108** |
| Axial | **32** |
| Lower back | 9 |
| Per-set systemic | 1.44 |
| High-systemic sets (cost 3+) | 10 |
| Compound share | 33% |
| Shoulder / knee / elbow cost | 16 / 62 / 31 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2.11 |
| Mean stability demand (0-4) | 1.08 |
| Stimulus per unit fatigue | 1.46 |
| Failure-safe share of sets | 48% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 29 |
| At 1 set | 0 |
| At 2 sets | 13 |
| At 3 sets | 15 |
| At 4+ sets | 1 |
| Mean sets per slot | 2.59 |
| Distinct exercises | 25 |
| Variety density (exercises per 10 sets) | 3.33 |
| Largest single-exercise share | 8% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (1):**

- The Offer — Load · Introduction — Hack Squat, 4 sets *(session opener)*

---

## 6. Rep schemes

7 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Cable Triceps Extension, Leg Press, Lying Leg Curls, Seated Hamstring Curl, Stripper Squat, Supported Sissy Squat |
| `12-15` | Bench-Supported DB Rear Delt Fly, Cable Lateral Raise, Leg Extensions |
| `12-20` | Cable Crunch, Hack Squat Calf Raises |
| `5-8` | Hack Squat |
| `6-10` | Incline DB Bench Press, Romanian Deadlift |
| `8-12` | Dip, EZ Preacher Curl, Front-Foot Elevated Bulgarian Split Squat, Hammer Pulldown (Underhand), Heel-Elevated Goblet Squat, Knee-Over-Toe Split Squat, Lat Prayer, Reverse Nordic Curls, Seated Hammer Shoulder Press, Single-Arm Hammer Strength Row |
| `8-15` | Overhead Tricep Extensions |

---

## 7. Export block

```yaml
id: quadfather
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 10
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 75, days: 4, sets_per_session: 18.8, slots: 29 }
load: { systemic: 108, axial: 32, lower_back: 9, per_set_systemic: 1.44 }
volume: { quads: 25, glutes: 16, back: 12, shoulders: 10, hamstrings: 8, triceps: 7, chest: 6, core: 5, biceps: 4, calves: 4 }
coverage: { covered: 10, missing: [], in_band: 4, over: ['quads'], under: ['chest', 'biceps', 'hamstrings', 'calves', 'core'] }
set_shape: { slots: 29, ones: 0, twos: 13, threes: 15, four_plus: 1, mean: 2.59 }
rep_ranges: ['10-15', '12-15', '12-20', '5-8', '6-10', '8-12', '8-15']
variety: { distinct: 25, density: 3.33, top_share: 0.08, evenness: 0.985 }
```
