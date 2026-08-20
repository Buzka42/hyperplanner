# Workhorse

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `workhorse` |
| **Length** | 10 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 79 across 4 training days (week 1 sample) |
| **Sets/session** | 19.8 |
| **Goal** | specialisation, hypertrophy |
| **Experience** | intermediate |
| **Equipment** | full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `calendar` |
| **Calibration** | `requireBodyweight: true` |
| **Hooks** | `calculateWeight` |
| **Techniques used** | `last-set-failure` |
| **Card promise** | *"10 weeks treating the weighted chin-up as a main lift, not an accessory. Ends in the Chin-Up Trial."* |

---

## 1. What this plan is

**Signature mechanic.** Back specialisation that separates width, thickness and the lower lats into their own slots.

The onboarding card claims:

- Focus: Back and chin-up strength
- 4 Days / Week - back 3x, biceps 3x
- Progressed on total system weight
- Weighted chins, pronated pull-ups, heavy rows
- Week 10: Chin-Up Trial

**Not for you if.**

- You want a pressing-led block

**Follow-ups.** [gravity-is-optional](gravity-is-optional.md), [atlas](atlas.md), [monolith](monolith.md)

---

## 2. The training week

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Weighted Chin Strength · Ascent | 6 | 18 | Weighted Chin-Up 6, Hammer Chest Press 3, Hammer Lower Row 3, Machine Rear Delt Fly 2, Cable Triceps Extension 2, Cable Lateral Raise 2 |
| Legs + Vertical Pull Volume · Ascent | 6 | 19 | Goblet Skater Squat 3, Hip-Supported Dumbbell Deadlift 3, Hack Squat Calf Raises 3, Pull-Up 4, 30° Incline-Lying Dumbbell Curl 3, Ab Wheel 3 |
| Horizontal Back · Ascent | 7 | 22 | Dumbbell Seal Row 4, Hammer Lower Row 3, Incline DB Bench Press 3, Standing Military Press 3, Reverse Curl 3, Overhead Tricep Extensions 3, Bench-Supported DB Rear Delt Fly 3 |
| Legs + Chest · Ascent | 7 | 20 | Heel-Elevated Goblet Squat 3, Sissy Squat 2, Seated Ham Curl 3, Pec Deck 3, Hanging Leg Raises 3, Hack Squat Calf Raises 3, Seated Dumbbell Lateral Raise 3 |

### Week-to-week shape

The program runs 10 weeks falling into 3 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3, 4 | Weighted Chin Strength · Ascent 18, Legs + Vertical Pull Volume · Ascent 19, Horizontal Back · Ascent 22, Legs + Chest · Ascent 20 |
| 5, 6, 7, 8, 9 | Weighted Chin Strength · Overhang 18, Legs + Vertical Pull Volume · Overhang 19, Horizontal Back · Overhang 22, Legs + Chest · Overhang 20 |
| 10 | Weighted Chin Strength · Chin-Up Trial 13, Legs + Vertical Pull Volume · Chin-Up Trial 13, Horizontal Back · Chin-Up Trial 15, Legs + Chest · Chin-Up Trial 14 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| back | 20 | in band |
| shoulders | 16 | in band |
| biceps | 12 | in band |
| chest | 9 | below the 10-set growth dose |
| glutes | 9 | below the 10-set growth dose |
| quads | 8 | below the 10-set growth dose |
| hamstrings | 6 | below the 10-set growth dose |
| calves | 6 | in band |
| core | 6 | in band |
| triceps | 5 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 0.94 |
| Quad:hamstring | 1.33 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **117** |
| Axial | **15** |
| Lower back | 23 |
| Per-set systemic | 1.48 |
| High-systemic sets (cost 3+) | 6 |
| Compound share | 37% |
| Shoulder / knee / elbow cost | 25 / 19 / 44 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.82 |
| Mean stability demand (0-4) | 1.29 |
| Stimulus per unit fatigue | 1.23 |
| Failure-safe share of sets | 37% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 26 |
| At 1 set | 0 |
| At 2 sets | 4 |
| At 3 sets | 19 |
| At 4+ sets | 3 |
| Mean sets per slot | 3.04 |
| Distinct exercises | 24 |
| Variety density (exercises per 10 sets) | 3.04 |
| Largest single-exercise share | 8% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (3):**

- Weighted Chin Strength · Ascent — Weighted Chin-Up, 6 sets *(session opener)*
- Legs + Vertical Pull Volume · Ascent — Pull-Up, 4 sets
- Horizontal Back · Ascent — Dumbbell Seal Row, 4 sets *(session opener)*

---

## 6. Export block

```yaml
id: workhorse
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 10
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 79, days: 4, sets_per_session: 19.8, slots: 26 }
load: { systemic: 117, axial: 15, lower_back: 23, per_set_systemic: 1.48 }
volume: { back: 20, shoulders: 16, biceps: 12, chest: 9, glutes: 9, quads: 8, hamstrings: 6, calves: 6, core: 6, triceps: 5 }
coverage: { covered: 10, missing: [], in_band: 5, over: [], under: ['chest', 'triceps', 'quads', 'hamstrings', 'glutes'] }
set_shape: { slots: 26, ones: 0, twos: 4, threes: 19, four_plus: 3, mean: 3.04 }
variety: { distinct: 24, density: 3.04, top_share: 0.076, evenness: 0.983 }
```
