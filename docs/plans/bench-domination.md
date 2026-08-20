# Bench Domination

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `bench-domination` |
| **Length** | 16 weeks |
| **Frequency** | 6 days/week |
| **Weekly sets** | 112 across 6 training days (week 1 sample) |
| **Sets/session** | 18.7 |
| **Goal** | strength, specialisation |
| **Experience** | intermediate, advanced |
| **Equipment** | barbell, full-gym |
| **Adaptability** | responsive |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `preprocessDay`, `calculateWeight`, `getExerciseAdvice` |
| **Card promise** | *"13-week powerlifting program to explode your bench press, extended with added deload weeks for optimal recovery. Daily Undulating Periodization - build muscle and strength at the same time."* |

---

## 1. What this plan is

**Signature mechanic.** Percentage bench work off five separate press maxes, with modules you switch off when life gets busy.

The onboarding card claims:

- Focus: Bench Strength
- 13 Week Core Cycle + Optional 3 Week Peaking
- Flexible Duration: Extended with deload weeks for recovery
- 4 Benching days a week + 2 Lower Body days, optional accessories
- Auto-regulating progression based on AMRAP test

**Prerequisites.** A tested or confident paused bench max

**Not for you if.**

- You want balanced development — this is a bench plan first
- You cannot train six days most weeks — four benching plus two lower

**Follow-ups.** [trinary](trinary.md), [ritual-of-strength](ritual-of-strength.md), [neural-overload](neural-overload.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Monday - Heavy Strength | 7 | 19 | Walking Lunges 3×10-15, Heels-Off Narrow Leg Press 3×10-15, Reverse Nordic Curls 2×Failure, Single-Leg Machine Hip Thrust 3×10-15, Nordic Curls 3×Failure, Hack Squat Calf Raises 3×15-20, Hip Adduction 2×8-12 |
| Tuesday - Legs | 5 | 21 | Paused Bench Press 4×5-10, Spoto Press 3×5, Weighted Pull-ups 8×Max, Y-Raises 3×12-15, Around-the-Worlds 3×4-16 |
| Wednesday - Volume Hypertrophy | 7 | 20 | Paused Bench Press 5×5-10, Low Pin Press 2×4, Behind-the-Neck Press 4, Bodyweight Dips 2, Rolling DB Tricep Extensions 2, Banded EZ Bar Skullcrushers 2, Cable Crunch 3×Failure |
| Thursday - Power / Speed | 7 | 19 | Walking Lunges 3×10-15, Heels-Off Narrow Leg Press 3×10-15, Reverse Nordic Curls 2×Failure, Single-Leg Machine Hip Thrust 3×10-15, Nordic Curls 3×Failure, Hack Squat Calf Raises 3×15-20, Machine Hip Abduction 2×8-12 |
| Friday - Legs | 7 | 20 | Paused Bench Press 4×5-10, Wide-Grip Bench Press 3×6-8, Behind-the-Neck Press 4, Bodyweight Dips 2, Rolling DB Tricep Extensions 2, Banded EZ Bar Skullcrushers 2, Dragon Flags 3×Failure |
| Saturday - AMRAP Test | 5 | 13 | Paused Bench Press (AMRAP) 1×AMRAP, Paused Bench Press (Back-off) 3×5, Wide-Grip Bench Press 3×6-8, Weighted Pull-ups 3×Max, Y-Raises 3×12-15 |

### Week-to-week shape

The program runs 16 weeks falling into 8 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3 | Monday - Heavy Strength 16, Tuesday - Legs 19, Wednesday - Volume Hypertrophy 21, Thursday - Power / Speed 16, Friday - Legs 19, Saturday - AMRAP Test 13 |
| 4, 5, 6 | Monday - Heavy Strength 16, Tuesday - Legs 19, Wednesday - Volume Hypertrophy 25, Thursday - Power / Speed 16, Friday - Legs 19, Saturday - AMRAP Test 13 |
| 7, 8 | Monday - Heavy Strength 16, Tuesday - Legs 19, Wednesday - Volume Hypertrophy 20, Thursday - Power / Speed 16, Friday - Legs 19, Saturday - AMRAP Test 14 |
| 9 | Monday - Recovery DELOAD 16, Tuesday - Light Legs DELOAD 19, Wednesday - Light DELOAD 20, Thursday - Light Power DELOAD 16, Friday - Light Legs DELOAD 19, Saturday - Technique DELOAD 14 |
| 10, 11, 12, 13 | Monday - Heavy Strength 17, Tuesday - Legs 19, Wednesday - Volume Hypertrophy 18, Thursday - Power / Speed 17, Friday - Legs 19, Saturday - AMRAP Test 13 |
| 14 | Monday - Peaking 6, Tuesday - Legs (Maintenance) 4, Wednesday - Light/Speed 6, Thursday - Rest 3, Friday - Legs 4, Saturday - Light Technique 4 |
| 15 | Monday - Peaking 7, Tuesday - Legs (Maintenance) 4, Wednesday - Light/Speed 6, Thursday - Rest 3, Friday - Legs 4, Saturday - Light Technique 3 |
| 16 | Monday - Primer 3, Tuesday - Legs (Maintenance) 4, Wednesday - Light/Speed 0, Friday - Legs 4, Saturday - JUDGMENT DAY 1 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| chest | 35 | above the 20-set ceiling |
| glutes | 22 | above the 20-set ceiling |
| back | 17 | in band |
| quads | 16 | in band |
| triceps | 12 | in band |
| shoulders | 11 | in band |
| hamstrings | 6 | below the 10-set growth dose |
| calves | 6 | in band |
| core | 6 | in band |
| biceps | 0 | no direct sets |

**Untrained groups:** `biceps`.

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 3.41 |
| Quad:hamstring | 2.67 |
| Groups covered (4+ sets) | 9 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **175** |
| Axial | **28** |
| Lower back | 0 |
| Per-set systemic | 1.56 |
| High-systemic sets (cost 3+) | 0 |
| Compound share | 56% |
| Shoulder / knee / elbow cost | 73 / 54 / 70 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2.01 |
| Mean stability demand (0-4) | 1.36 |
| Stimulus per unit fatigue | 1.29 |
| Failure-safe share of sets | 20% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 38 |
| At 1 set | 1 |
| At 2 sets | 11 |
| At 3 sets | 20 |
| At 4+ sets | 6 |
| Mean sets per slot | 2.95 |
| Distinct exercises | 21 |
| Variety density (exercises per 10 sets) | 1.88 |
| Largest single-exercise share | 15% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**One set (1):**

- Saturday - AMRAP Test — Paused Bench Press (AMRAP)

**Four or more sets (6):**

- Tuesday - Legs — Paused Bench Press, 4 sets *(session opener)*
- Tuesday - Legs — Weighted Pull-ups, 8 sets
- Wednesday - Volume Hypertrophy — Paused Bench Press, 5 sets *(session opener)*
- Wednesday - Volume Hypertrophy — Behind-the-Neck Press, 4 sets
- Friday - Legs — Paused Bench Press, 4 sets *(session opener)*
- Friday - Legs — Behind-the-Neck Press, 4 sets

---

## 6. Rep schemes

13 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Heels-Off Narrow Leg Press, Single-Leg Machine Hip Thrust, Walking Lunges |
| `12-15` | Y-Raises |
| `15-20` | Hack Squat Calf Raises |
| `4` | Low Pin Press |
| `4-16` | Around-the-Worlds |
| `5` | Paused Bench Press (Back-off), Spoto Press |
| `5-10` | Paused Bench Press |
| `6-8` | Wide-Grip Bench Press |
| `8-12` | Hip Adduction, Machine Hip Abduction |
| `AMRAP` | Paused Bench Press (AMRAP) |
| `Failure` | Cable Crunch, Dragon Flags, Nordic Curls, Reverse Nordic Curls |
| `Giant` | Tricep Giant Set |
| `Max` | Weighted Pull-ups |

---

## 7. Export block

```yaml
id: bench-domination
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 16
frequency: [6]
engine: calendar
sampled_week: 1
weekly: { sets: 112, days: 6, sets_per_session: 18.7, slots: 38 }
load: { systemic: 175, axial: 28, lower_back: 0, per_set_systemic: 1.56 }
volume: { chest: 35, glutes: 22, back: 17, quads: 16, triceps: 12, shoulders: 11, hamstrings: 6, calves: 6, core: 6, biceps: 0 }
coverage: { covered: 9, missing: ['biceps'], in_band: 6, over: ['chest', 'glutes'], under: ['hamstrings'] }
set_shape: { slots: 38, ones: 1, twos: 11, threes: 20, four_plus: 6, mean: 2.95 }
rep_ranges: ['10-15', '12-15', '15-20', '4', '4-16', '5', '5-10', '6-8', '8-12', 'AMRAP', 'Failure', 'Giant', 'Max']
variety: { distinct: 21, density: 1.88, top_share: 0.152, evenness: 0.946 }
```
