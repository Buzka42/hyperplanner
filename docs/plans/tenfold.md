# Tenfold

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `tenfold` |
| **Length** | 8 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 88 across 4 training days (week 1 sample) |
| **Sets/session** | 22 |
| **Goal** | hypertrophy |
| **Experience** | intermediate |
| **Equipment** | full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 4/4 — very high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight` |
| **Techniques used** | `last-set-failure` |
| **Card promise** | *"8 weeks of German Volume Training. Ten sets of ten on exactly one lift per session."* |

---

## 1. What this plan is

**Signature mechanic.** German volume training: ten sets of ten on exactly one lift per session.

The onboarding card claims:

- Focus: Hypertrophy through volume
- 4 Days / Week
- One ten-set lift per session, never two
- Hold the load until all ten sets hit ten
- Back half trades a set for load

**Prerequisites.** Tolerance for repetitive high-volume work

**Not for you if.**

- You bore easily
- Your joints object to volume before your muscles do

**Follow-ups.** [purgatorio](purgatorio.md), [event-horizon](event-horizon.md), [monolith](monolith.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Chest Tenfold · Ten Sets | 5 | 18 | Hammer Chest Press 10×10, Hammer Upper Row 2×8-12, Cable Lateral Raise 2×12-20, Cable Triangle Pressdown 2×10-15, Machine Curl 2×10-15 |
| Quad Tenfold · Ten Sets | 5 | 23 | Hack Squat 10×10, Seated Ham Curl 4×8-12, Hack Squat Calf Raises 3×12-20, Cable Crunch 3×12-20, Pec Deck 3×10-15 |
| Back Tenfold · Ten Sets | 5 | 23 | Hammer Lower Row 10×10, Incline DB Bench Press 4×8-12, Machine Rear Delt Fly 3×15-20, EZ Preacher Curl 3×10-15, French Press 3×10-15 |
| Hamstring Tenfold · Ten Sets | 6 | 24 | Seated Ham Curl 10×8-12, Heel-Elevated Goblet Squat 4×10-15, Hack Squat Calf Raises 2×12-20, Ab Wheel 3×8-15, Assisted Pull-ups 3×8-12, Cable Lateral Raise 2×12-20 |

### Week-to-week shape

The program runs 8 weeks falling into 2 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3, 4, 5 | Chest Tenfold · Ten Sets 18, Quad Tenfold · Ten Sets 23, Back Tenfold · Ten Sets 23, Hamstring Tenfold · Ten Sets 24 |
| 6, 7, 8 | Chest Tenfold · Consolidation 13, Quad Tenfold · Consolidation 13, Back Tenfold · Consolidation 13, Hamstring Tenfold · Consolidation 15 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| chest | 17 | in band |
| back | 15 | in band |
| quads | 14 | in band |
| hamstrings | 14 | in band |
| glutes | 14 | in band |
| shoulders | 11 | in band |
| core | 6 | in band |
| biceps | 5 | below the 6-set growth dose |
| triceps | 5 | below the 6-set growth dose |
| calves | 5 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.65 |
| Quad:hamstring | 1 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **123** |
| Axial | **28** |
| Lower back | 6 |
| Per-set systemic | 1.4 |
| High-systemic sets (cost 3+) | 14 |
| Compound share | 20% |
| Shoulder / knee / elbow cost | 27 / 42 / 42 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.84 |
| Mean stability demand (0-4) | 0.66 |
| Stimulus per unit fatigue | 1.32 |
| Failure-safe share of sets | 73% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 21 |
| At 1 set | 0 |
| At 2 sets | 6 |
| At 3 sets | 8 |
| At 4+ sets | 7 |
| Mean sets per slot | 4.19 |
| Distinct exercises | 18 |
| Variety density (exercises per 10 sets) | 2.05 |
| Largest single-exercise share | 16% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (7):**

- Chest Tenfold · Ten Sets — Hammer Chest Press, 10 sets *(session opener)*
- Quad Tenfold · Ten Sets — Hack Squat, 10 sets *(session opener)*
- Quad Tenfold · Ten Sets — Seated Ham Curl, 4 sets
- Back Tenfold · Ten Sets — Hammer Lower Row, 10 sets *(session opener)*
- Back Tenfold · Ten Sets — Incline DB Bench Press, 4 sets
- Hamstring Tenfold · Ten Sets — Seated Ham Curl, 10 sets *(session opener)*
- Hamstring Tenfold · Ten Sets — Heel-Elevated Goblet Squat, 4 sets

---

## 6. Rep schemes

6 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10` | Hack Squat, Hammer Chest Press, Hammer Lower Row |
| `10-15` | Cable Triangle Pressdown, EZ Preacher Curl, French Press, Heel-Elevated Goblet Squat, Machine Curl, Pec Deck |
| `12-20` | Cable Crunch, Cable Lateral Raise, Hack Squat Calf Raises |
| `15-20` | Machine Rear Delt Fly |
| `8-12` | Assisted Pull-ups, Hammer Upper Row, Incline DB Bench Press, Seated Ham Curl |
| `8-15` | Ab Wheel |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | its own rule — `PROGRESSION_HANDLERS['tenfold']` — composed on top of the shared double progression |
| **Slot-level rules** | none — every movement is carried by the handler |
| **Next load written** | 42 of 42 movements (100%) after a clean session |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | double progression +2.5kg | Ab Wheel, Assisted Pull-ups, Cable Crunch, Cable Lateral Raise, Cable Triangle Pressdown, EZ Preacher Curl, French Press, Hack Squat, Hack Squat Calf Raises, Hammer Chest Press, Hammer Lower Row, Hammer Upper Row, Heel-Elevated Goblet Squat, Incline DB Bench Press, Machine Curl, Machine Rear Delt Fly, Pec Deck, Seated Ham Curl |

---

## 8. Export block

```yaml
id: tenfold
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 8
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 88, days: 4, sets_per_session: 22, slots: 21 }
load: { systemic: 123, axial: 28, lower_back: 6, per_set_systemic: 1.4 }
volume: { chest: 17, back: 15, quads: 14, hamstrings: 14, glutes: 14, shoulders: 11, core: 6, biceps: 5, triceps: 5, calves: 5 }
coverage: { covered: 10, missing: [], in_band: 7, over: [], under: ['biceps', 'triceps', 'calves'] }
set_shape: { slots: 21, ones: 0, twos: 6, threes: 8, four_plus: 7, mean: 4.19 }
rep_ranges: ['10', '10-15', '12-20', '15-20', '8-12', '8-15']
progression: { handler: own+double, slot_rules: false, distinct_rules: 1 }
variety: { distinct: 18, density: 2.05, top_share: 0.159, evenness: 0.928 }
```
