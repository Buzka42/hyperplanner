# Atlas

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `atlas` |
| **Length** | 10 weeks |
| **Frequency** | 3 days/week |
| **Weekly sets** | 56 across 3 training days (week 1 sample) |
| **Sets/session** | 18.7 |
| **Goal** | strength, general |
| **Experience** | intermediate, advanced |
| **Equipment** | barbell, full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 4/4 — very high |
| **Session engine** | `calendar` |
| **Calibration** | seeded: `squat`, `conventionalDeadlift`, `standingPress` |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Card promise** | *"A 10-week strength plan run as two five-week gauntlets, built on carries and hard basics."* |

---

## 1. What this plan is

**Signature mechanic.** Two five-week gauntlets, with carries trained as a lift and scored as time × load.

The onboarding card claims:

- 3 full-body days
- Two five-week movement sets
- Carries scored as time × load
- Optional kettlebell power work

**Prerequisites.** Trap bar or a hinge you can load; Somewhere you can actually walk with weight

**Not for you if.**

- Your gym has no space for carries
- You want isolation-led hypertrophy

**Follow-ups.** [trinary](trinary.md), [pain-and-glory](pain-and-glory.md)

---

## 2. The training week

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Atlas I — Carry the Bar · Gauntlet I | 6 | 17 | Safety Bar Squat 4, Standing Military Press 3, Single-Arm Hammer Strength Row 3, Single-Leg Romanian Deadlift 2, Ab Wheel 2, Farmer Carry 3 |
| Atlas II — Carry the Weight · Gauntlet I | 7 | 18 | Trap-Bar Deadlift 4, Weighted Pull-ups 3, Incline DB Bench Press 3, Front-Foot Elevated Bulgarian Split Squat 2, Hack Squat Calf Raises 2, Heavy Rolling Tricep Extensions 2, Suitcase Carry 2 |
| Atlas III — Carry the Rest · Gauntlet I | 9 | 21 | Safety Bar Squat 3, Flat DB Press 3, Barbell Row 3, Seated Hamstring Curl 2, Leaning One-Arm Lateral Raise 2, Standing Straight-Bar Curl 2, Cable Triceps Extension 2, Hack Squat Calf Raises 2, Suitcase Hold 2 |

### Week-to-week shape

The program runs 10 weeks falling into 2 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3, 4, 5 | Atlas I — Carry the Bar · Gauntlet I 17, Atlas II — Carry the Weight · Gauntlet I 18, Atlas III — Carry the Rest · Gauntlet I 21 |
| 6, 7, 8, 9, 10 | Atlas I — Carry the Bar · Gauntlet II 17, Atlas II — Carry the Weight · Gauntlet II 18, Atlas III — Carry the Rest · Gauntlet II 21 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 15 | in band |
| quads | 13 | in band |
| back | 12 | in band |
| shoulders | 8 | below the 10-set growth dose |
| hamstrings | 8 | below the 10-set growth dose |
| chest | 6 | below the 10-set growth dose |
| core | 6 | in band |
| biceps | 5 | below the 6-set growth dose |
| triceps | 4 | below the 6-set growth dose |
| calves | 4 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.06 |
| Quad:hamstring | 1.63 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **110** |
| Axial | **56** |
| Lower back | 51 |
| Per-set systemic | 1.96 |
| High-systemic sets (cost 3+) | 19 |
| Compound share | 59% |
| Shoulder / knee / elbow cost | 14 / 20 / 24 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.89 |
| Mean stability demand (0-4) | 1.98 |
| Stimulus per unit fatigue | 0.96 |
| Failure-safe share of sets | 20% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 22 |
| At 1 set | 0 |
| At 2 sets | 12 |
| At 3 sets | 8 |
| At 4+ sets | 2 |
| Mean sets per slot | 2.55 |
| Distinct exercises | 20 |
| Variety density (exercises per 10 sets) | 3.57 |
| Largest single-exercise share | 12% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (2):**

- Atlas I — Carry the Bar · Gauntlet I — Safety Bar Squat, 4 sets *(session opener)*
- Atlas II — Carry the Weight · Gauntlet I — Trap-Bar Deadlift, 4 sets *(session opener)*

---

## 6. Export block

```yaml
id: atlas
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 10
frequency: [3]
engine: calendar
sampled_week: 1
weekly: { sets: 56, days: 3, sets_per_session: 18.7, slots: 22 }
load: { systemic: 110, axial: 56, lower_back: 51, per_set_systemic: 1.96 }
volume: { glutes: 15, quads: 13, back: 12, shoulders: 8, hamstrings: 8, chest: 6, core: 6, biceps: 5, triceps: 4, calves: 4 }
coverage: { covered: 10, missing: [], in_band: 4, over: [], under: ['chest', 'shoulders', 'biceps', 'triceps', 'hamstrings', 'calves'] }
set_shape: { slots: 22, ones: 0, twos: 12, threes: 8, four_plus: 2, mean: 2.55 }
variety: { distinct: 20, density: 3.57, top_share: 0.125, evenness: 0.976 }
```
