# Ritual of Strength

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `ritual-of-strength` |
| **Length** | 19 weeks |
| **Frequency** | 3/4 days/week |
| **Weekly sets** | 42 across 3 training days (week 5 sample) |
| **Sets/session** | 14 |
| **Goal** | strength |
| **Experience** | intermediate, advanced |
| **Equipment** | barbell, full-gym |
| **Adaptability** | responsive |
| **Fatigue cost** | 4/4 — very high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `preprocessDay`, `calculateWeight`, `getExerciseAdvice` |
| **Card promise** | *"3 day/week minimum effective dose powerlifting program."* |

---

## 1. What this plan is

**Signature mechanic.** High-frequency powerlifting: the competition lifts most days, autoregulated by feel.

The onboarding card claims:

- Focus: Bench / Deadlift / Squat
- 3 Days / Week (Mon/Wed/Fri ideal)
- 16 Week Program (with optional 4-week ramp-in)
- ME singles + RPE based progression

**Prerequisites.** Solid technique under fatigue; Time for three sessions a week — four if you add the optional day

**Not for you if.**

- You train two days a week
- You need long recovery between heavy sessions

**Follow-ups.** [trinary](trinary.md), [blackout](blackout.md), [oracle](oracle.md)

---

## 2. The training week

> **Measurement note.** sampled week 5 (week 1 is off-median at 26 sets)

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Day 1 - Bench ME | 3 | 7 | Paused Bench Press (ME) 1, Low Bar Squat (Light) 3, Conventional Deadlift (Light) 3 |
| Day 2 - Squat ME | 4 | 10 | Conventional Deadlift (ME) 1, Paused Bench Press (Light) 3, Low Bar Squat (Light) 3, Farmer Holds 3 |
| Day 3 - Deadlift ME | 9 | 25 | Conventional Deadlift (ME) 1, Paused Bench Press (Light) 3, Low Bar Squat (Light) 3, Farmer Holds 3, Shrugs 3, Band Pull-Aparts 3, Ab Wheel 3, Planks 3, Cable Crunch 3 |

### Week-to-week shape

The program runs 19 weeks falling into 5 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3 | Day 1 - Bench (Ramp-In) 9, Day 2 - Squat (Ramp-In) 9, Day 3 - Deadlift (Ramp-In) 9 |
| 4 | Day 1 - Bench (Ramp-In) 10, Day 2 - Squat (Ramp-In) 10, Day 3 - Deadlift (Ramp-In) 10 |
| 5, 6, 7, 10, 11, 12, 15, 16, 17 | Day 1 - Bench ME 7, Day 2 - Squat ME 7, Day 3 - Deadlift ME 10 |
| 8, 13, 18 | Day 1 - Bench ME 10, Day 2 - Squat ME 10, Day 3 - Deadlift ME 13 |
| 9, 14, 19 | Purge Week - Day 1 7, Purge Week - Day 2 7, Purge Week - Day 3 7 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| back | 14 | in band |
| glutes | 14 | in band |
| quads | 9 | below the 10-set growth dose |
| core | 9 | in band |
| chest | 7 | below the 10-set growth dose |
| biceps | 6 | in band |
| hamstrings | 5 | below the 10-set growth dose |
| shoulders | 3 | below the 10-set growth dose |
| triceps | 0 | no direct sets |
| calves | 0 | no direct sets |

**Untrained groups:** `triceps`, `calves`.

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 0.5 |
| Quad:hamstring | 1.8 |
| Groups covered (4+ sets) | 7 of 10 |
| Groups trained on two or more days | 6 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **95** |
| Axial | **60** |
| Lower back | 57 |
| Per-set systemic | 2.26 |
| High-systemic sets (cost 3+) | 20 |
| Compound share | 71% |
| Shoulder / knee / elbow cost | 10 / 18 / 7 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.52 |
| Mean stability demand (0-4) | 2 |
| Stimulus per unit fatigue | 0.67 |
| Failure-safe share of sets | 7% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 16 |
| At 1 set | 3 |
| At 2 sets | 0 |
| At 3 sets | 13 |
| At 4+ sets | 0 |
| Mean sets per slot | 2.63 |
| Distinct exercises | 9 |
| Variety density (exercises per 10 sets) | 2.14 |
| Largest single-exercise share | 21% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**One set (3):**

- Day 1 - Bench ME — Paused Bench Press (ME)
- Day 2 - Squat ME — Conventional Deadlift (ME)
- Day 3 - Deadlift ME — Conventional Deadlift (ME)

---

## 6. Export block

```yaml
id: ritual-of-strength
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 19
frequency: [3, 4]
engine: calendar
sampled_week: 5
weekly: { sets: 42, days: 3, sets_per_session: 14, slots: 16 }
load: { systemic: 95, axial: 60, lower_back: 57, per_set_systemic: 2.26 }
volume: { back: 14, glutes: 14, quads: 9, core: 9, chest: 7, biceps: 6, hamstrings: 5, shoulders: 3, triceps: 0, calves: 0 }
coverage: { covered: 7, missing: ['triceps', 'calves'], in_band: 4, over: [], under: ['chest', 'shoulders', 'quads', 'hamstrings'] }
set_shape: { slots: 16, ones: 3, twos: 0, threes: 13, four_plus: 0, mean: 2.63 }
variety: { distinct: 9, density: 2.14, top_share: 0.214, evenness: 0.957 }
```
