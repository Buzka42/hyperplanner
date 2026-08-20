# Hamstring Foundry

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `hamstring-foundry` |
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
| **Calibration** | none |
| **Hooks** | `calculateWeight` |
| **Techniques used** | `last-set-failure` |
| **Card promise** | *"10 weeks of hamstring specialisation through three different functions, all of which must progress."* |

---

## 1. What this plan is

**Signature mechanic.** Hamstrings by both functions — knee flexion and hip extension — three times weekly.

The onboarding card claims:

- Focus: Hamstrings
- 4 Days / Week - hamstrings 3x
- Hinge strength, knee flexion, lengthened control
- Four-second eccentrics during the accumulation block
- One upper day with no hard hamstring work, to recover

**Not for you if.**

- You want your quads to grow in the same block

**Follow-ups.** [pain-and-glory](pain-and-glory.md), [quadfather](quadfather.md), [event-horizon](event-horizon.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Heavy Hip Extension · Forging | 7 | 21 | Romanian Deadlift 4×5-8, Seated Ham Curl 4×8-12, Flat DB Press 3×8-12, Rope Cable Row 3×8-12, Cable Lateral Raise 3×12-20, Cable Curl 2×10-15, Overhead Tricep Extensions 2×10-15 |
| Knee Flexion + Quads · Forging | 6 | 19 | Seated Ham Curl 4×8-12, Goblet Skater Squat 3×8-12, Sissy Squat 3×12-20, Pull-Up 3×8-12, Hammer Chest Press 3×8-12, Hack Squat Calf Raises 3×12-20 |
| Upper Dominant · Forging | 8 | 20 | Incline DB Bench Press 4×8-12, Hammer Lower Row 2×8-12, Rope Cable Row 2×8-12, Lat Pulldown (Neutral) 3×8-12, Seated DB Shoulder Press 3×8-12, Machine Rear Delt Fly 2×15-20, Dumbbell Hammer Curl (legacy id) 2×10-15, Cable Triceps Extension 2×10-15 |
| Lengthened Hamstrings · Forging | 6 | 19 | Hip-Supported Dumbbell Deadlift 4×10-15, Single-Leg Hamstring Curl 3×10-15, Heel-Elevated Goblet Squat 3×10-15, Hack Squat Calf Raises 3×12-20, Ab Wheel 3×8-15, Pec Deck 3×10-15 |

### Week-to-week shape

The program runs 10 weeks falling into 2 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3, 4, 5 | Heavy Hip Extension · Forging 21, Knee Flexion + Quads · Forging 19, Upper Dominant · Forging 20, Lengthened Hamstrings · Forging 19 |
| 6, 7, 8, 9, 10 | Heavy Hip Extension · Tempering 22, Knee Flexion + Quads · Tempering 19, Upper Dominant · Tempering 20, Lengthened Hamstrings · Tempering 19 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| hamstrings | 19 | in band |
| glutes | 14 | in band |
| chest | 13 | in band |
| back | 13 | in band |
| shoulders | 12 | in band |
| quads | 9 | below the 10-set growth dose |
| calves | 6 | in band |
| biceps | 4 | below the 6-set growth dose |
| triceps | 4 | below the 6-set growth dose |
| core | 3 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.71 |
| Quad:hamstring | 0.47 |
| Groups covered (4+ sets) | 9 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **120** |
| Axial | **28** |
| Lower back | 30 |
| Per-set systemic | 1.52 |
| High-systemic sets (cost 3+) | 11 |
| Compound share | 34% |
| Shoulder / knee / elbow cost | 24 / 29 / 38 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2.15 |
| Mean stability demand (0-4) | 1.19 |
| Stimulus per unit fatigue | 1.42 |
| Failure-safe share of sets | 47% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 27 |
| At 1 set | 0 |
| At 2 sets | 7 |
| At 3 sets | 15 |
| At 4+ sets | 5 |
| Mean sets per slot | 2.93 |
| Distinct exercises | 24 |
| Variety density (exercises per 10 sets) | 3.04 |
| Largest single-exercise share | 10% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (5):**

- Heavy Hip Extension · Forging — Romanian Deadlift, 4 sets *(session opener)*
- Heavy Hip Extension · Forging — Seated Ham Curl, 4 sets
- Knee Flexion + Quads · Forging — Seated Ham Curl, 4 sets *(session opener)*
- Upper Dominant · Forging — Incline DB Bench Press, 4 sets *(session opener)*
- Lengthened Hamstrings · Forging — Hip-Supported Dumbbell Deadlift, 4 sets *(session opener)*

---

## 6. Rep schemes

6 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Cable Curl, Cable Triceps Extension, Dumbbell Hammer Curl (legacy id), Heel-Elevated Goblet Squat, Hip-Supported Dumbbell Deadlift, Overhead Tricep Extensions, Pec Deck, Single-Leg Hamstring Curl |
| `12-20` | Cable Lateral Raise, Hack Squat Calf Raises, Sissy Squat |
| `15-20` | Machine Rear Delt Fly |
| `5-8` | Romanian Deadlift |
| `8-12` | Flat DB Press, Goblet Skater Squat, Hammer Chest Press, Hammer Lower Row, Incline DB Bench Press, Lat Pulldown (Neutral), Pull-Up, Rope Cable Row, Seated DB Shoulder Press, Seated Ham Curl |
| `8-15` | Ab Wheel |

---

## 7. Export block

```yaml
id: hamstring-foundry
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 10
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 79, days: 4, sets_per_session: 19.8, slots: 27 }
load: { systemic: 120, axial: 28, lower_back: 30, per_set_systemic: 1.52 }
volume: { hamstrings: 19, glutes: 14, chest: 13, back: 13, shoulders: 12, quads: 9, calves: 6, biceps: 4, triceps: 4, core: 3 }
coverage: { covered: 9, missing: [], in_band: 6, over: [], under: ['biceps', 'triceps', 'quads', 'core'] }
set_shape: { slots: 27, ones: 0, twos: 7, threes: 15, four_plus: 5, mean: 2.93 }
rep_ranges: ['10-15', '12-20', '15-20', '5-8', '8-12', '8-15']
variety: { distinct: 24, density: 3.04, top_share: 0.101, evenness: 0.977 }
```
