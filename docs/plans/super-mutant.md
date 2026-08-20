# Super Mutant

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `super-mutant` |
| **Length** | 14 weeks |
| **Frequency** | 4/5/6 days/week |
| **Weekly sets** | 150 across 5 training days (week 1 sample) |
| **Sets/session** | 30 |
| **Goal** | hypertrophy |
| **Experience** | advanced |
| **Equipment** | full-gym |
| **Adaptability** | adaptive |
| **Fatigue cost** | 4/4 — very high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `preprocessDay` |
| **Card promise** | *"Advanced 12+2 week Fallout-themed high-frequency bodybuilding. Embrace the mutation through pain and iron."* |

---

## 1. What this plan is

**Signature mechanic.** A session queue that picks what to train from rolling volume and how long each muscle has rested.

The onboarding card claims:

- Focus: All muscle groups
- Dynamic 4-6 sessions/week
- Auto-adaptive cooldown system (48h upper / 72h lower)
- Reactive volume targeting ~20 sets/muscle/week
- Progressive RIR wave (2→1→0→beyond failure)

**Prerequisites.** Enough training history to handle failure work; A flexible schedule

**Not for you if.**

- You want to know on Sunday what Thursday looks like

**Follow-ups.** [event-horizon](event-horizon.md), [monolith](monolith.md), [project-chimera](project-chimera.md)

---

## 2. The training week

This plan generates each session on demand rather than from a fixed
calendar, so the week below is a representative sample taken at the
plan's own stated frequency, not a fixed template.

> **Measurement note.** per-visit generator: one session × 5 sessions/week (declared frequency)

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Representative session | 13 | 30 | Pec Deck 2, Incline DB Bench Press 2, Deficit Pushups 2, Triangle Pushdown 2, EZ Skullcrushers 2, Single Arm Overhead Extension 2, Incline DB Curls 2, EZ Preacher Curl 2, Hammer Curls 2, Seated Ham Curl 4, Good Mornings 4, Front-Foot Elevated Bulgarian Split Squat 2, Dumbbell Walking Lunge 2 |

Weekly totals elsewhere in this doc are that session multiplied by the
plan's declared 5 sessions per week.

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| hamstrings | 40 | above the 20-set ceiling |
| glutes | 40 | above the 20-set ceiling |
| chest | 30 | above the 20-set ceiling |
| biceps | 30 | above the 20-set ceiling |
| triceps | 30 | above the 20-set ceiling |
| quads | 20 | in band |
| shoulders | 10 | in band |
| back | 0 | no direct sets |
| calves | 0 | no direct sets |
| core | 0 | no direct sets |

**Untrained groups:** `back`, `calves`, `core`.

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 2.33 |
| Quad:hamstring | 0.5 |
| Groups covered (4+ sets) | 7 of 10 |
| Groups trained on two or more days | 7 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **250** |
| Axial | **80** |
| Lower back | 80 |
| Per-set systemic | 1.67 |
| High-systemic sets (cost 3+) | 20 |
| Compound share | 40% |
| Shoulder / knee / elbow cost | 30 / 60 / 150 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 3 |
| Mean stability demand (0-4) | 1.6 |
| Stimulus per unit fatigue | 1.8 |
| Failure-safe share of sets | 40% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 65 |
| At 1 set | 0 |
| At 2 sets | 55 |
| At 3 sets | 0 |
| At 4+ sets | 10 |
| Mean sets per slot | 2.31 |
| Distinct exercises | 13 |
| Variety density (exercises per 10 sets) | 0.87 |
| Largest single-exercise share | 13% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (2):**

- Representative session — Seated Ham Curl, 4 sets
- Representative session — Good Mornings, 4 sets

---

## 6. Export block

```yaml
id: super-mutant
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 14
frequency: [4, 5, 6]
engine: calendar
sampled_week: 1
weekly: { sets: 150, days: 5, sets_per_session: 30, slots: 65 }
load: { systemic: 250, axial: 80, lower_back: 80, per_set_systemic: 1.67 }
volume: { hamstrings: 40, glutes: 40, chest: 30, biceps: 30, triceps: 30, quads: 20, shoulders: 10, back: 0, calves: 0, core: 0 }
coverage: { covered: 7, missing: ['back', 'calves', 'core'], in_band: 2, over: ['chest', 'biceps', 'triceps', 'hamstrings', 'glutes'], under: [] }
set_shape: { slots: 65, ones: 0, twos: 55, threes: 0, four_plus: 10, mean: 2.31 }
variety: { distinct: 13, density: 0.87, top_share: 0.133, evenness: 0.984 }
```
