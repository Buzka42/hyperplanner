# From Skeleton to Threat

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `skeleton-to-threat` |
| **Length** | 12 weeks |
| **Frequency** | 3 days/week |
| **Weekly sets** | 57 across 3 training days (week 1 sample) |
| **Sets/session** | 19 |
| **Goal** | general, hypertrophy |
| **Experience** | beginner |
| **Equipment** | full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 2/4 — moderate |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `preprocessDay`, `calculateWeight`, `getExerciseAdvice` |
| **Card promise** | *"12-week beginner program. For those who have never touched a weight."* |

---

## 1. What this plan is

**Signature mechanic.** Full-body beginner progression that adds load whenever the last session was clean.

The onboarding card claims:

- Focus: Full Body
- 3 Days / Week
- Flexible Schedule

**Not for you if.**

- You already train and progress — you will outgrow the jumps in a fortnight

**Follow-ups.** [pencilneck-eradication](pencilneck-eradication.md), [the-minimum](the-minimum.md), [athena](athena.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Day 1 | 7 | 19 | Deficit Push-ups 3×AMRAP, Leg Extensions 3×12-20, Supported Stiff Legged DB Deadlift 3×10-15, Standing Calf Raises 3×15-20, Inverted Rows 2×8-15, Overhand Mid-Grip Pulldown 2×10-15, Planks 3×30sec |
| Day 2 | 7 | 19 | Deficit Push-ups 3×AMRAP, Leg Extensions 3×12-20, Supported Stiff Legged DB Deadlift 3×10-15, Standing Calf Raises 3×15-20, Inverted Rows 2×8-15, Overhand Mid-Grip Pulldown 2×10-15, Planks 3×30sec |
| Day 3 | 7 | 19 | Deficit Push-ups 3×AMRAP, Leg Extensions 3×12-20, Supported Stiff Legged DB Deadlift 3×10-15, Standing Calf Raises 3×15-20, Inverted Rows 2×8-15, Overhand Mid-Grip Pulldown 2×10-15, Planks 3×30sec |

All 12 weeks carry the same set-count shape; what varies week to
week is load, reps and technique rather than volume.

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| back | 12 | in band |
| chest | 9 | below the 10-set growth dose |
| quads | 9 | below the 10-set growth dose |
| hamstrings | 9 | below the 10-set growth dose |
| glutes | 9 | below the 10-set growth dose |
| calves | 9 | in band |
| core | 9 | in band |
| shoulders | 0 | no direct sets |
| biceps | 0 | no direct sets |
| triceps | 0 | no direct sets |

**Untrained groups:** `shoulders`, `biceps`, `triceps`.

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 0.75 |
| Quad:hamstring | 1 |
| Groups covered (4+ sets) | 7 of 10 |
| Groups trained on two or more days | 7 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **90** |
| Axial | **9** |
| Lower back | 39 |
| Per-set systemic | 1.58 |
| High-systemic sets (cost 3+) | 9 |
| Compound share | 42% |
| Shoulder / knee / elbow cost | 9 / 18 / 15 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.74 |
| Mean stability demand (0-4) | 0.79 |
| Stimulus per unit fatigue | 1.1 |
| Failure-safe share of sets | 32% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 21 |
| At 1 set | 0 |
| At 2 sets | 6 |
| At 3 sets | 15 |
| At 4+ sets | 0 |
| Mean sets per slot | 2.71 |
| Distinct exercises | 7 |
| Variety density (exercises per 10 sets) | 1.23 |
| Largest single-exercise share | 16% |

No slot sits at one set and none carries more than three. Nothing to flag.

---

## 6. Rep schemes

6 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Overhand Mid-Grip Pulldown, Supported Stiff Legged DB Deadlift |
| `12-20` | Leg Extensions |
| `15-20` | Standing Calf Raises |
| `30sec` | Planks |
| `8-15` | Inverted Rows |
| `AMRAP` | Deficit Push-ups |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | its own rule — `PROGRESSION_HANDLERS['skeleton-to-threat']`, which does **not** fall back to the shared double progression |
| **Slot-level rules** | none — every movement is carried by the handler |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | the plan's own rule (`skeleton-to-threat` handler) | Deficit Push-ups, Inverted Rows, Leg Extensions, Overhand Mid-Grip Pulldown, Planks, Standing Calf Raises, Supported Stiff Legged DB Deadlift |

---

## 8. Export block

```yaml
id: skeleton-to-threat
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 12
frequency: [3]
engine: calendar
sampled_week: 1
weekly: { sets: 57, days: 3, sets_per_session: 19, slots: 21 }
load: { systemic: 90, axial: 9, lower_back: 39, per_set_systemic: 1.58 }
volume: { back: 12, chest: 9, quads: 9, hamstrings: 9, glutes: 9, calves: 9, core: 9, shoulders: 0, biceps: 0, triceps: 0 }
coverage: { covered: 7, missing: ['shoulders', 'biceps', 'triceps'], in_band: 3, over: [], under: ['chest', 'quads', 'hamstrings', 'glutes'] }
set_shape: { slots: 21, ones: 0, twos: 6, threes: 15, four_plus: 0, mean: 2.71 }
rep_ranges: ['10-15', '12-20', '15-20', '30sec', '8-15', 'AMRAP']
progression: { handler: own, slot_rules: false, distinct_rules: 1 }
variety: { distinct: 7, density: 1.23, top_share: 0.158, evenness: 0.992 }
```
