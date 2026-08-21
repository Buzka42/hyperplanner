# Apex Predator

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `apex-predator` |
| **Length** | 12 weeks |
| **Frequency** | 3 days/week |
| **Weekly sets** | 50 across 3 training days (week 1 sample) |
| **Sets/session** | 16.7 |
| **Goal** | assessment, general |
| **Experience** | beginner, intermediate, advanced |
| **Equipment** | full-gym |
| **Adaptability** | adaptive |
| **Fatigue cost** | 2/4 — moderate |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Card promise** | *"A 12-week full-body plan that turns repeatable movement assessments into focused access work."* |

---

## 1. What this plan is

**Signature mechanic.** Repeatable movement assessments that turn into at most two access movements per session.

The onboarding card claims:

- 3 full-body days
- Six optional measured regions
- Retests in weeks 4, 8 and 12
- Optional AI video advice

**Not for you if.**

- You are in pain right now — see someone qualified first
- You want maximum size or strength this block

**Follow-ups.** [skeleton-to-threat](skeleton-to-threat.md), [immaculate-restructure](immaculate-restructure.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| A — Lower Access + Push/Pull · Stalk | 7 | 17 | Loaded Ankle Rock 2×8-12, Open-Book Rotation 2×8-12, Heel-Elevated Goblet Squat 3×8-12, Incline DB Bench Press 3×8-12, Bench-Supported One-Arm Dumbbell Row 3×8-12, Seated Hamstring Curl 2×10-15, Single-Arm Overhead Triceps Extension 2×12-20 |
| B — Hinge + Vertical · Stalk | 8 | 17 | Loaded Ankle Rock 2×8-12, Romanian Deadlift 3×6-10, Assisted Pull-ups 3×6-10, Single-Arm Landmine Press 2×8-12, Front-Foot Elevated Bulgarian Split Squat 2×8-12, Bench-Supported DB Rear Delt Fly 2×12-20, Ab Wheel 2×8-12, Suitcase Carry 1×30-60 |
| C — Unilateral + Shape · Stalk | 7 | 16 | Loaded Ankle Rock 2×8-12, Open-Book Rotation 2×8-12, Deficit Reverse Lunge 3×8-12, Hammer Chest Press 2×8-15, Single-Arm Hammer Strength Row 3×8-15, Hip Thrusts 2×8-15, Cable Rope Pressdown 2×12-20 |

### Week-to-week shape

The program runs 12 weeks falling into 6 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3 | A — Lower Access + Push/Pull · Stalk 17, B — Hinge + Vertical · Stalk 17, C — Unilateral + Shape · Stalk 16 |
| 4 | A — Lower Access + Push/Pull · First Hunt · Retest 14, B — Hinge + Vertical · First Hunt · Retest 15, C — Unilateral + Shape · First Hunt · Retest 14 |
| 5, 6, 7 | A — Lower Access + Push/Pull · Adapt 17, B — Hinge + Vertical · Adapt 17, C — Unilateral + Shape · Adapt 16 |
| 8 | A — Lower Access + Push/Pull · Second Hunt · Retest 14, B — Hinge + Vertical · Second Hunt · Retest 15, C — Unilateral + Shape · Second Hunt · Retest 14 |
| 9, 10, 11 | A — Lower Access + Push/Pull · Apex 17, B — Hinge + Vertical · Apex 17, C — Unilateral + Shape · Apex 16 |
| 12 | A — Lower Access + Push/Pull · Final Hunt · Retest 11, B — Hinge + Vertical · Final Hunt · Retest 10, C — Unilateral + Shape · Final Hunt · Retest 9 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 13 | in band |
| back | 9 | below the 10-set growth dose |
| quads | 8 | below the 10-set growth dose |
| shoulders | 7 | below the 10-set growth dose |
| core | 7 | in band |
| calves | 6 | in band |
| chest | 5 | below the 10-set growth dose |
| hamstrings | 5 | below the 10-set growth dose |
| triceps | 4 | below the 6-set growth dose |
| biceps | 0 | no direct sets |

**Untrained groups:** `biceps`.

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.78 |
| Quad:hamstring | 1.6 |
| Groups covered (4+ sets) | 9 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **73** |
| Axial | **19** |
| Lower back | 19 |
| Per-set systemic | 1.46 |
| High-systemic sets (cost 3+) | 6 |
| Compound share | 38% |
| Shoulder / knee / elbow cost | 14 / 18 / 18 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2.04 |
| Mean stability demand (0-4) | 1.88 |
| Stimulus per unit fatigue | 1.4 |
| Failure-safe share of sets | 28% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 22 |
| At 1 set | 1 |
| At 2 sets | 14 |
| At 3 sets | 7 |
| At 4+ sets | 0 |
| Mean sets per slot | 2.27 |
| Distinct exercises | 19 |
| Variety density (exercises per 10 sets) | 3.8 |
| Largest single-exercise share | 12% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**One set (1):**

- B — Hinge + Vertical · Stalk — Suitcase Carry

---

## 6. Rep schemes

6 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Seated Hamstring Curl |
| `12-20` | Bench-Supported DB Rear Delt Fly, Cable Rope Pressdown, Single-Arm Overhead Triceps Extension |
| `30-60` | Suitcase Carry |
| `6-10` | Assisted Pull-ups, Romanian Deadlift |
| `8-12` | Ab Wheel, Bench-Supported One-Arm Dumbbell Row, Deficit Reverse Lunge, Front-Foot Elevated Bulgarian Split Squat, Heel-Elevated Goblet Squat, Incline DB Bench Press, Loaded Ankle Rock, Open-Book Rotation, Single-Arm Landmine Press |
| `8-15` | Hammer Chest Press, Hip Thrusts, Single-Arm Hammer Strength Row |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | none of its own; the shared `genericDoubleProgression` runs |
| **Slot-level rules** | declared on at least one movement |
| **Next load written** | 59 of 59 movements (100%) after a clean session |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | double progression +2.5kg | Ab Wheel, Assisted Pull-ups, Bench-Supported DB Rear Delt Fly, Cable Rope Pressdown, Deficit Reverse Lunge, Front-Foot Elevated Bulgarian Split Squat, Hammer Chest Press, Heel-Elevated Goblet Squat, Hip Thrusts, Loaded Ankle Rock, Open-Book Rotation, Romanian Deadlift, Seated Hamstring Curl, Single-Arm Hammer Strength Row, Single-Arm Landmine Press, Single-Arm Overhead Triceps Extension, Suitcase Carry |
| carried working load | double progression +2kg | Bench-Supported One-Arm Dumbbell Row, Incline DB Bench Press |

---

## 8. Export block

```yaml
id: apex-predator
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 12
frequency: [3]
engine: calendar
sampled_week: 1
weekly: { sets: 50, days: 3, sets_per_session: 16.7, slots: 22 }
load: { systemic: 73, axial: 19, lower_back: 19, per_set_systemic: 1.46 }
volume: { glutes: 13, back: 9, quads: 8, shoulders: 7, core: 7, calves: 6, chest: 5, hamstrings: 5, triceps: 4, biceps: 0 }
coverage: { covered: 9, missing: ['biceps'], in_band: 3, over: [], under: ['chest', 'shoulders', 'back', 'triceps', 'quads', 'hamstrings'] }
set_shape: { slots: 22, ones: 1, twos: 14, threes: 7, four_plus: 0, mean: 2.27 }
rep_ranges: ['10-15', '12-20', '30-60', '6-10', '8-12', '8-15']
progression: { handler: shared, slot_rules: true, distinct_rules: 2 }
variety: { distinct: 19, density: 3.8, top_share: 0.12, evenness: 0.976 }
```
