# Event Horizon

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `event-horizon` |
| **Length** | 12 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 78 across 4 training days (week 1 sample) |
| **Sets/session** | 19.5 |
| **Goal** | hypertrophy |
| **Experience** | intermediate, advanced |
| **Equipment** | full-gym |
| **Adaptability** | adaptive |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `rotation` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `last-set-failure` |
| **Card promise** | *"A 12-week hypertrophy plan that finds a cheaper way to train when a joint starts complaining."* |

---

## 1. What this plan is

**Signature mechanic.** When a joint complains it finds you a cheaper way to buy the same stimulus, and asks first.

The onboarding card claims:

- 4 days, upper/lower
- Report a region, get real options
- Every swap keeps the role
- Nothing changes without confirmation

**Prerequisites.** Enough experience to report a region honestly

**Not for you if.**

- You are in pain now rather than occasionally strained

**Follow-ups.** [project-chimera](project-chimera.md), [monolith](monolith.md), [oracle](oracle.md)

---

## 2. The training week

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Horizon — Upper A · Approach | 8 | 20 | 30° Smith Incline Bench Press 4, Single-Arm Hammer Strength Row 2, Dumbbell Seal Row 2, Seated Hammer Shoulder Press 3, Close Neutral Grip Lat Pulldown 3, Cable Lateral Raise 2, Bayesian Cable Curl 2, Cable Triceps Extension 2 |
| Horizon — Lower A · Approach | 6 | 19 | Hack Squat 4, Romanian Deadlift 3, Leg Extensions 3, Seated Hamstring Curl 3, Single Leg Machine Hip Thrust 3, Hack Squat Calf Raises 3 |
| Horizon — Upper B · Approach | 8 | 18 | Hammer Pulldown (Underhand) 4, Hammer Chest Press 2, Machine Press/Fly Combo 2, Side-Lying Rear Delt Flyes 2, Pec Deck 2, Lying Cable Lat Raises 2, Cable Curl 2, French Press 2 |
| Horizon — Lower B · Approach | 7 | 21 | Leg Press 4, Lying Leg Curls 3, Front-Foot Elevated Bulgarian Split Squat 3, Machine Hip Abduction 3, Supported Sissy Squat 3, Hack Squat Calf Raises 3, Cable Crunch 2 |

### Week-to-week shape

The program runs 12 weeks falling into 5 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3 | Horizon — Upper A · Approach 20, Horizon — Lower A · Approach 19, Horizon — Upper B · Approach 18, Horizon — Lower B · Approach 21 |
| 4, 5, 6 | Horizon — Upper A · Accretion 20, Horizon — Lower A · Accretion 19, Horizon — Upper B · Accretion 18, Horizon — Lower B · Accretion 21 |
| 7 | Horizon — Upper A · Deload 12, Horizon — Lower A · Deload 13, Horizon — Upper B · Deload 10, Horizon — Lower B · Deload 14 |
| 8, 9, 10, 11 | Horizon — Upper A · Horizon 27, Horizon — Lower A · Horizon 24, Horizon — Upper B · Horizon 25, Horizon — Lower B · Horizon 27 |
| 12 | Horizon — Upper A · Escape 12, Horizon — Lower A · Escape 13, Horizon — Upper B · Escape 10, Horizon — Lower B · Escape 14 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 20 | in band |
| quads | 17 | in band |
| shoulders | 13 | in band |
| back | 11 | in band |
| chest | 10 | in band |
| hamstrings | 9 | below the 10-set growth dose |
| calves | 6 | in band |
| biceps | 4 | below the 6-set growth dose |
| triceps | 4 | below the 6-set growth dose |
| core | 2 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.8 |
| Quad:hamstring | 1.89 |
| Groups covered (4+ sets) | 9 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **102** |
| Axial | **25** |
| Lower back | 13 |
| Per-set systemic | 1.31 |
| High-systemic sets (cost 3+) | 7 |
| Compound share | 26% |
| Shoulder / knee / elbow cost | 22 / 43 / 36 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.97 |
| Mean stability demand (0-4) | 0.77 |
| Stimulus per unit fatigue | 1.51 |
| Failure-safe share of sets | 65% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 29 |
| At 1 set | 0 |
| At 2 sets | 13 |
| At 3 sets | 12 |
| At 4+ sets | 4 |
| Mean sets per slot | 2.69 |
| Distinct exercises | 28 |
| Variety density (exercises per 10 sets) | 3.59 |
| Largest single-exercise share | 8% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (4):**

- Horizon — Upper A · Approach — 30° Smith Incline Bench Press, 4 sets *(session opener)*
- Horizon — Lower A · Approach — Hack Squat, 4 sets *(session opener)*
- Horizon — Upper B · Approach — Hammer Pulldown (Underhand), 4 sets *(session opener)*
- Horizon — Lower B · Approach — Leg Press, 4 sets *(session opener)*

---

## 6. Export block

```yaml
id: event-horizon
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 12
frequency: [4]
engine: rotation
sampled_week: 1
weekly: { sets: 78, days: 4, sets_per_session: 19.5, slots: 29 }
load: { systemic: 102, axial: 25, lower_back: 13, per_set_systemic: 1.31 }
volume: { glutes: 20, quads: 17, shoulders: 13, back: 11, chest: 10, hamstrings: 9, calves: 6, biceps: 4, triceps: 4, core: 2 }
coverage: { covered: 9, missing: [], in_band: 6, over: [], under: ['biceps', 'triceps', 'hamstrings', 'core'] }
set_shape: { slots: 29, ones: 0, twos: 13, threes: 12, four_plus: 4, mean: 2.69 }
variety: { distinct: 28, density: 3.59, top_share: 0.077, evenness: 0.985 }
```
