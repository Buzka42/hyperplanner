# Purgatorio

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `purgatorio` |
| **Length** | 12 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 79 across 4 training days (week 1 sample) |
| **Sets/session** | 19.8 |
| **Goal** | hypertrophy, conditioning |
| **Experience** | intermediate, advanced |
| **Equipment** | full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 4/4 — very high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight` |
| **Techniques used** | `last-set-failure` |
| **Card promise** | *"Repeating 6-week blocks: three weeks of volume, three weeks of load. Every muscle twice a week in both."* |

---

## 1. What this plan is

**Signature mechanic.** Sustained high-rep suffering with the rest periods as the prescription.

The onboarding card claims:

- Focus: Size and strength together
- 4 Days / Week - antagonist paired A1/A2
- Accumulation: 10-15 reps, more sets, short rest
- Intensification: 5-8 reps, heavier, long rest
- Exercise variations rotate between blocks

**Prerequisites.** A base of general fitness

**Not for you if.**

- You are trying to add maximal strength
- You dislike training near failure

**Follow-ups.** [redline](redline.md), [event-horizon](event-horizon.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Upper A · Accumulation | 6 | 21 | Flat DB Press 4×10-15, EZ Preacher Curl 3×10-15, Lat Pulldown (Neutral) 4×10-15, Rope Pressdown 3×10-15, Seated DB Shoulder Press 4×10-15, Leaning One-Arm Lateral Raise 3×10-15 |
| Lower A · Accumulation | 6 | 19 | Hack Squat 4×10-15, Hack Squat Calf Raises 3×10-15, Lying Leg Curls 3×10-15, Single-Leg Dumbbell Romanian Deadlift 3×10-15, Hip Adduction 3×10-15, Planks 3×Failure |
| Upper B · Accumulation | 6 | 20 | Incline DB Bench Press 4×10-15, Dumbbell Hammer Curl (legacy id) 3×10-15, Seated Cable Row 4×10-15, French Press 3×10-15, Rear-Delt Rope Pulls to Face 3×10-15, Cable Lateral Raise 3×10-15 |
| Lower B · Accumulation | 6 | 19 | Heel-Elevated Goblet Squat 4×10-15, Machine Hip Abduction 3×10-15, Seated Ham Curl 3×10-15, Standing Dumbbell/KB Calf Raise 3×10-15, DB Romanian Deadlift 3×10-15, Planks 3×Failure |

### Week-to-week shape

The program runs 12 weeks falling into 4 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3 | Upper A · Accumulation 21, Lower A · Accumulation 19, Upper B · Accumulation 20, Lower B · Accumulation 19 |
| 4, 5, 6 | Upper A · Intensification 15, Lower A · Intensification 13, Upper B · Intensification 14, Lower B · Intensification 13 |
| 7, 8, 9 | Upper A · Accumulation II 21, Lower A · Accumulation II 19, Upper B · Accumulation II 20, Lower B · Accumulation II 19 |
| 10, 11, 12 | Upper A · Intensification II 15, Lower A · Intensification II 13, Upper B · Intensification II 14, Lower B · Intensification II 13 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 20 | in band |
| shoulders | 17 | in band |
| hamstrings | 12 | in band |
| chest | 8 | below the 10-set growth dose |
| back | 8 | below the 10-set growth dose |
| quads | 8 | below the 10-set growth dose |
| biceps | 6 | in band |
| triceps | 6 | in band |
| calves | 6 | in band |
| core | 6 | in band |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 2.21 |
| Quad:hamstring | 0.67 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **119** |
| Axial | **30** |
| Lower back | 18 |
| Per-set systemic | 1.51 |
| High-systemic sets (cost 3+) | 14 |
| Compound share | 33% |
| Shoulder / knee / elbow cost | 25 / 22 / 40 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.89 |
| Mean stability demand (0-4) | 1.32 |
| Stimulus per unit fatigue | 1.25 |
| Failure-safe share of sets | 38% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 24 |
| At 1 set | 0 |
| At 2 sets | 0 |
| At 3 sets | 17 |
| At 4+ sets | 7 |
| Mean sets per slot | 3.29 |
| Distinct exercises | 23 |
| Variety density (exercises per 10 sets) | 2.91 |
| Largest single-exercise share | 8% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (7):**

- Upper A · Accumulation — Flat DB Press, 4 sets *(session opener)*
- Upper A · Accumulation — Lat Pulldown (Neutral), 4 sets
- Upper A · Accumulation — Seated DB Shoulder Press, 4 sets
- Lower A · Accumulation — Hack Squat, 4 sets *(session opener)*
- Upper B · Accumulation — Incline DB Bench Press, 4 sets *(session opener)*
- Upper B · Accumulation — Seated Cable Row, 4 sets
- Lower B · Accumulation — Heel-Elevated Goblet Squat, 4 sets *(session opener)*

---

## 6. Rep schemes

2 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Cable Lateral Raise, DB Romanian Deadlift, Dumbbell Hammer Curl (legacy id), EZ Preacher Curl, Flat DB Press, French Press, Hack Squat, Hack Squat Calf Raises, Heel-Elevated Goblet Squat, Hip Adduction, Incline DB Bench Press, Lat Pulldown (Neutral), Leaning One-Arm Lateral Raise, Lying Leg Curls, Machine Hip Abduction, Rear-Delt Rope Pulls to Face, Rope Pressdown, Seated Cable Row, Seated DB Shoulder Press, Seated Ham Curl, Single-Leg Dumbbell Romanian Deadlift, Standing Dumbbell/KB Calf Raise |
| `Failure` | Planks |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | none of its own; the shared `genericDoubleProgression` runs |
| **Slot-level rules** | none — every movement is carried by the handler |
| **Next load written** | 44 of 48 movements (92%) after a clean session |

> **Coverage note.** 4 of this plan's 48 movements come back from a
> fully-completed session with no next load recorded, so the athlete
> carries those numbers themselves. A plan with its own save-time
> handler never runs the shared double progression, so any movement
> that handler does not cover is left unprogressed.

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | double progression +2.5kg | Cable Lateral Raise, DB Romanian Deadlift, Dumbbell Hammer Curl (legacy id), EZ Preacher Curl, Flat DB Press, French Press, Hack Squat, Hack Squat Calf Raises, Heel-Elevated Goblet Squat, Hip Adduction, Incline DB Bench Press, Lat Pulldown (Neutral), Leaning One-Arm Lateral Raise, Lying Leg Curls, Machine Hip Abduction, Planks, Rear-Delt Rope Pulls to Face, Rope Pressdown, Seated Cable Row, Seated DB Shoulder Press, Seated Ham Curl, Single-Leg Dumbbell Romanian Deadlift, Standing Dumbbell/KB Calf Raise |

---

## 8. Export block

```yaml
id: purgatorio
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 12
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 79, days: 4, sets_per_session: 19.8, slots: 24 }
load: { systemic: 119, axial: 30, lower_back: 18, per_set_systemic: 1.51 }
volume: { glutes: 20, shoulders: 17, hamstrings: 12, chest: 8, back: 8, quads: 8, biceps: 6, triceps: 6, calves: 6, core: 6 }
coverage: { covered: 10, missing: [], in_band: 7, over: [], under: ['chest', 'back', 'quads'] }
set_shape: { slots: 24, ones: 0, twos: 0, threes: 17, four_plus: 7, mean: 3.29 }
rep_ranges: ['10-15', 'Failure']
progression: { handler: shared, slot_rules: false, distinct_rules: 1 }
variety: { distinct: 23, density: 2.91, top_share: 0.076, evenness: 0.994 }
```
