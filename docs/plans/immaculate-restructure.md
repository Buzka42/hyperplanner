# Immaculate (Re)Structure

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `immaculate-restructure` |
| **Length** | 10 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 78 across 4 training days (week 1 sample) |
| **Sets/session** | 19.5 |
| **Goal** | hypertrophy |
| **Experience** | intermediate |
| **Equipment** | full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `last-set-failure` |
| **Card promise** | *"10 weeks built on Poliquin structural-balance relationships. Find the lagging structure and feed it."* |

---

## 1. What this plan is

**Signature mechanic.** Proportion-led rebuild: the weakest region gets the frequency, everything else holds.

The onboarding card claims:

- Focus: Structural balance
- 4 Days / Week - every group at least 2x
- Close-grip bench as the reference lift
- Poliquin reference targets, not medical thresholds
- Weak-link work added as a small third exposure

**Prerequisites.** A year or so of consistent training

**Not for you if.**

- You have no clear structural weak point yet

**Follow-ups.** [event-horizon](event-horizon.md), [project-chimera](project-chimera.md), [monolith](monolith.md)

---

## 2. The training week

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Upper Structural A · Assessment | 6 | 19 | Close-Grip Bench Press 4, Weighted Chin-Up 4, Incline Barbell Bench Press 3, Single-Arm External Rotation 3, Reverse Curl 3, Machine Rear Delt Fly 2 |
| Lower Structural A · Assessment | 6 | 19 | Front Squats 4, Single-Leg Hamstring Curl 3, Goblet Skater Squat 3, Hip-Supported Dumbbell Deadlift 3, Standing Calf Raises 3, Ab Wheel 3 |
| Upper Structural B · Assessment | 7 | 21 | Seated DB Shoulder Press 4, Hammer Upper Row 4, Flat DB Press 3, Single-Arm External Rotation 3, EZ Preacher Curl 3, Cable Triceps Extension 2, Machine Rear Delt Fly 2 |
| Lower Structural B · Assessment | 6 | 19 | Heel-Elevated Goblet Squat 4, Seated Ham Curl 3, Split Squat 3, Hip Thrusts 3, Standing Calf Raises 3, Hanging Leg Raises 3 |

### Week-to-week shape

The program runs 10 weeks falling into 3 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2 | Upper Structural A · Assessment 19, Lower Structural A · Assessment 19, Upper Structural B · Assessment 21, Lower Structural B · Assessment 19 |
| 3, 4, 5, 6, 7 | Upper Structural A · Correction 19, Lower Structural A · Correction 19, Upper Structural B · Correction 21, Lower Structural B · Correction 19 |
| 8, 9, 10 | Upper Structural A · Re-Test 14, Lower Structural A · Re-Test 13, Upper Structural B · Re-Test 16, Lower Structural B · Re-Test 13 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 20 | in band |
| shoulders | 17 | in band |
| quads | 14 | in band |
| chest | 10 | in band |
| biceps | 10 | in band |
| hamstrings | 9 | below the 10-set growth dose |
| back | 8 | below the 10-set growth dose |
| triceps | 6 | in band |
| calves | 6 | in band |
| core | 6 | in band |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.83 |
| Quad:hamstring | 1.56 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **127** |
| Axial | **31** |
| Lower back | 23 |
| Per-set systemic | 1.63 |
| High-systemic sets (cost 3+) | 11 |
| Compound share | 45% |
| Shoulder / knee / elbow cost | 22 / 34 / 38 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.94 |
| Mean stability demand (0-4) | 1.37 |
| Stimulus per unit fatigue | 1.19 |
| Failure-safe share of sets | 36% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 25 |
| At 1 set | 0 |
| At 2 sets | 3 |
| At 3 sets | 16 |
| At 4+ sets | 6 |
| Mean sets per slot | 3.12 |
| Distinct exercises | 22 |
| Variety density (exercises per 10 sets) | 2.82 |
| Largest single-exercise share | 8% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (6):**

- Upper Structural A · Assessment — Close-Grip Bench Press, 4 sets *(session opener)*
- Upper Structural A · Assessment — Weighted Chin-Up, 4 sets
- Lower Structural A · Assessment — Front Squats, 4 sets *(session opener)*
- Upper Structural B · Assessment — Seated DB Shoulder Press, 4 sets *(session opener)*
- Upper Structural B · Assessment — Hammer Upper Row, 4 sets
- Lower Structural B · Assessment — Heel-Elevated Goblet Squat, 4 sets *(session opener)*

---

## 6. Export block

```yaml
id: immaculate-restructure
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 10
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 78, days: 4, sets_per_session: 19.5, slots: 25 }
load: { systemic: 127, axial: 31, lower_back: 23, per_set_systemic: 1.63 }
volume: { glutes: 20, shoulders: 17, quads: 14, chest: 10, biceps: 10, hamstrings: 9, back: 8, triceps: 6, calves: 6, core: 6 }
coverage: { covered: 10, missing: [], in_band: 8, over: [], under: ['back', 'hamstrings'] }
set_shape: { slots: 25, ones: 0, twos: 3, threes: 16, four_plus: 6, mean: 3.12 }
variety: { distinct: 22, density: 2.82, top_share: 0.077, evenness: 0.989 }
```
