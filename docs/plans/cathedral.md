# Cathedral

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `cathedral` |
| **Length** | 10 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 68 across 4 training days (week 1 sample) |
| **Sets/session** | 17 |
| **Goal** | specialisation, hypertrophy |
| **Experience** | intermediate |
| **Equipment** | full-gym |
| **Adaptability** | responsive |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `drop-set`, `last-set-failure`, `myo-reps`, `partials` |
| **Card promise** | *"A 10-week chest specialisation built on three arches: press, stretch and adduction."* |

---

## 1. What this plan is

**Signature mechanic.** Three balanced arches — press, stretch and adduction — and no barbell bench anywhere.

The onboarding card claims:

- Chest 3× weekly
- Incline dumbbell press as the heavy arch
- Dips and flyes for stretch
- No barbell bench

**Prerequisites.** Access to dips and cable stations

**Not for you if.**

- You want to train the competition bench press

**Follow-ups.** [bench-domination](bench-domination.md), [monolith](monolith.md), [arms-race](arms-race.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Nave — Press · Foundation | 7 | 18 | Incline DB Bench Press 4×6-10, Dip 3×8-12, Low-to-High Cable Flyes 2×12-15, Pec Deck 2×12-15, Single-Arm Hammer Strength Row 3×8-12, Lying Cable Lat Raises 2×12-15, French Press 2×10-15 |
| Crypt — Lower · Foundation | 6 | 15 | Leg Press 3×10-15, Romanian Deadlift 3×8-12, Seated Hamstring Curl 3×10-15, Supported Sissy Squat 2×12-15, Hack Squat Calf Raises 2×12-20, Cable Crunch 2×8-12 |
| Transept — Stretch · Foundation | 6 | 15 | Mid Cable Flyes (Seated) 2×10-15, 30° Smith Incline Bench Press 4×8-12, Cable Crossover 2×12-20, Hammer Pulldown (Underhand) 3×8-12, Side-Lying Rear Delt Flyes 2×12-15, EZ Preacher Curl 2×8-12 |
| Spire — Adduction · Foundation | 9 | 20 | Pec Deck 2×12-15, Flat DB Press 3×8-12, Dip 2×8-12, Cable Flyes (mid height) 2×12-15, Lat Pulldown (Neutral) 3×8-12, Seated Hammer Shoulder Press 2×8-12, Hack Squat Calf Raises 2×12-20, Cable Triceps Extension 2×10-15, EZ Preacher Curl 2×8-12 |

### Week-to-week shape

The program runs 10 weeks falling into 4 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3 | Nave — Press · Foundation 18, Crypt — Lower · Foundation 15, Transept — Stretch · Foundation 15, Spire — Adduction · Foundation 20 |
| 4, 5, 6, 7 | Nave — Press · Vaulting 18, Crypt — Lower · Vaulting 15, Transept — Stretch · Vaulting 15, Spire — Adduction · Vaulting 20 |
| 8, 9 | Nave — Press · Consecration 18, Crypt — Lower · Consecration 15, Transept — Stretch · Consecration 15, Spire — Adduction · Consecration 20 |
| 10 | Nave — Press · Rest of the Stone 11, Crypt — Lower · Rest of the Stone 9, Transept — Stretch · Rest of the Stone 9, Spire — Adduction · Rest of the Stone 11 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| chest | 28 | above the 20-set ceiling |
| shoulders | 14 | in band |
| back | 9 | below the 10-set growth dose |
| triceps | 9 | in band |
| hamstrings | 6 | below the 10-set growth dose |
| glutes | 6 | below the 10-set growth dose |
| quads | 5 | below the 10-set growth dose |
| biceps | 4 | below the 6-set growth dose |
| calves | 4 | below the 6-set growth dose |
| core | 2 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 3.92 |
| Quad:hamstring | 0.83 |
| Groups covered (4+ sets) | 9 of 10 |
| Groups trained on two or more days | 6 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **91** |
| Axial | **15** |
| Lower back | 9 |
| Per-set systemic | 1.34 |
| High-systemic sets (cost 3+) | 3 |
| Compound share | 32% |
| Shoulder / knee / elbow cost | 36 / 15 / 52 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2.16 |
| Mean stability demand (0-4) | 0.9 |
| Stimulus per unit fatigue | 1.62 |
| Failure-safe share of sets | 48% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 28 |
| At 1 set | 0 |
| At 2 sets | 18 |
| At 3 sets | 8 |
| At 4+ sets | 2 |
| Mean sets per slot | 2.43 |
| Distinct exercises | 24 |
| Variety density (exercises per 10 sets) | 3.53 |
| Largest single-exercise share | 7% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (2):**

- Nave — Press · Foundation — Incline DB Bench Press, 4 sets *(session opener)*
- Transept — Stretch · Foundation — 30° Smith Incline Bench Press, 4 sets

---

## 6. Rep schemes

5 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Cable Triceps Extension, French Press, Leg Press, Mid Cable Flyes (Seated), Seated Hamstring Curl |
| `12-15` | Cable Flyes (mid height), Low-to-High Cable Flyes, Lying Cable Lat Raises, Pec Deck, Side-Lying Rear Delt Flyes, Supported Sissy Squat |
| `12-20` | Cable Crossover, Hack Squat Calf Raises |
| `6-10` | Incline DB Bench Press |
| `8-12` | 30° Smith Incline Bench Press, Cable Crunch, Dip, EZ Preacher Curl, Flat DB Press, Hammer Pulldown (Underhand), Lat Pulldown (Neutral), Romanian Deadlift, Seated Hammer Shoulder Press, Single-Arm Hammer Strength Row |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | none of its own; the shared `genericDoubleProgression` runs |
| **Slot-level rules** | declared on at least one movement |
| **Next load written** | 56 of 56 movements (100%) after a clean session |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | double progression +2.5kg | 30° Smith Incline Bench Press, Cable Crossover, Cable Crunch, Cable Flyes (mid height), Cable Triceps Extension, Dip, EZ Preacher Curl, Flat DB Press, French Press, Hack Squat Calf Raises, Hammer Pulldown (Underhand), Incline DB Bench Press, Lat Pulldown (Neutral), Leg Press, Low-to-High Cable Flyes, Lying Cable Lat Raises, Mid Cable Flyes (Seated), Pec Deck, Romanian Deadlift, Seated Hammer Shoulder Press, Seated Hamstring Curl, Side-Lying Rear Delt Flyes, Single-Arm Hammer Strength Row, Supported Sissy Squat |

---

## 8. Export block

```yaml
id: cathedral
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 10
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 68, days: 4, sets_per_session: 17, slots: 28 }
load: { systemic: 91, axial: 15, lower_back: 9, per_set_systemic: 1.34 }
volume: { chest: 28, shoulders: 14, back: 9, triceps: 9, hamstrings: 6, glutes: 6, quads: 5, biceps: 4, calves: 4, core: 2 }
coverage: { covered: 9, missing: [], in_band: 2, over: ['chest'], under: ['back', 'biceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'] }
set_shape: { slots: 28, ones: 0, twos: 18, threes: 8, four_plus: 2, mean: 2.43 }
rep_ranges: ['10-15', '12-15', '12-20', '6-10', '8-12']
progression: { handler: shared, slot_rules: true, distinct_rules: 1 }
variety: { distinct: 24, density: 3.53, top_share: 0.074, evenness: 0.985 }
```
