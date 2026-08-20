# Trinary

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `trinary` |
| **Length** | 9 weeks |
| **Frequency** | 3/4 days/week |
| **Weekly sets** | 45 across 3 training days (week 1 sample) |
| **Sets/session** | 15 |
| **Goal** | strength |
| **Experience** | advanced |
| **Equipment** | barbell, full-gym |
| **Adaptability** | adaptive |
| **Fatigue cost** | 4/4 — very high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `preprocessDay`, `calculateWeight`, `getExerciseAdvice` |
| **Card promise** | *"Conjugate periodization powerlifting. Adapt to your weak points."* |

---

## 1. What this plan is

**Signature mechanic.** Conjugate rotation driven by the weak point you name for each lift.

The onboarding card claims:

- Focus: Bench / Deadlift / Squat
- Flexible 3-4 Days / Week
- 27 Workouts (9 Blocks)
- Auto-adapts to weak point selection

**Prerequisites.** Competent squat, bench and deadlift technique; At least a year of structured training

**Not for you if.**

- You want a fixed weekly template
- You cannot judge your own weak points honestly

**Follow-ups.** [ritual-of-strength](ritual-of-strength.md), [blackout](blackout.md), [oracle](oracle.md)

---

## 2. The training week

This plan generates each session on demand rather than from a fixed
calendar, so the week below is a representative sample taken at the
plan's own stated frequency, not a fixed template.

> **Measurement note.** per-visit generator: one session × 3 sessions/week (declared frequency)

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Representative session | 3 | 15 | Conventional Deadlift (ME) 3, Low Bar Squat (DE) 8, Paused Bench Press (RE) 4 |

Weekly totals elsewhere in this doc are that session multiplied by the
plan's declared 3 sessions per week.

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 33 | above the 20-set ceiling |
| quads | 24 | above the 20-set ceiling |
| chest | 12 | in band |
| back | 9 | below the 10-set growth dose |
| hamstrings | 9 | below the 10-set growth dose |
| shoulders | 0 | no direct sets |
| biceps | 0 | no direct sets |
| triceps | 0 | no direct sets |
| calves | 0 | no direct sets |
| core | 0 | no direct sets |

**Untrained groups:** `shoulders`, `biceps`, `triceps`, `calves`, `core`.

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.33 |
| Quad:hamstring | 2.67 |
| Groups covered (4+ sets) | 5 of 10 |
| Groups trained on two or more days | 5 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **123** |
| Axial | **99** |
| Lower back | 75 |
| Per-set systemic | 2.73 |
| High-systemic sets (cost 3+) | 33 |
| Compound share | 100% |
| Shoulder / knee / elbow cost | 12 / 48 / 12 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.87 |
| Mean stability demand (0-4) | 2 |
| Stimulus per unit fatigue | 0.68 |
| Failure-safe share of sets | 0% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 9 |
| At 1 set | 0 |
| At 2 sets | 0 |
| At 3 sets | 3 |
| At 4+ sets | 6 |
| Mean sets per slot | 5 |
| Distinct exercises | 3 |
| Variety density (exercises per 10 sets) | 0.67 |
| Largest single-exercise share | 53% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (2):**

- Representative session — Low Bar Squat (DE), 8 sets
- Representative session — Paused Bench Press (RE), 4 sets

---

## 6. Export block

```yaml
id: trinary
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 9
frequency: [3, 4]
engine: calendar
sampled_week: 1
weekly: { sets: 45, days: 3, sets_per_session: 15, slots: 9 }
load: { systemic: 123, axial: 99, lower_back: 75, per_set_systemic: 2.73 }
volume: { glutes: 33, quads: 24, chest: 12, back: 9, hamstrings: 9, shoulders: 0, biceps: 0, triceps: 0, calves: 0, core: 0 }
coverage: { covered: 5, missing: ['shoulders', 'biceps', 'triceps', 'calves', 'core'], in_band: 1, over: ['quads', 'glutes'], under: ['back', 'hamstrings'] }
set_shape: { slots: 9, ones: 0, twos: 0, threes: 3, four_plus: 6, mean: 5 }
variety: { distinct: 3, density: 0.67, top_share: 0.533, evenness: 0.919 }
```
