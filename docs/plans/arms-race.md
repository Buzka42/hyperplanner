# Arms Race

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `arms-race` |
| **Length** | 8 weeks |
| **Frequency** | 3/4 days/week |
| **Weekly sets** | 80 across 4 training days (week 1 sample) |
| **Sets/session** | 20 |
| **Goal** | specialisation, hypertrophy |
| **Experience** | intermediate |
| **Equipment** | full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 2/4 — moderate |
| **Session engine** | `rotation` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `myo-reps` |
| **Card promise** | *"8 weeks of arm specialisation. Biceps and triceps four times a week, never the same way twice."* |

---

## 1. What this plan is

**Signature mechanic.** A three-session rotation run every other day, with an optional fourth go-nuclear session of giant sets.

The onboarding card claims:

- Focus: Biceps and triceps
- 4 Days / Week - arms 4x
- Heavy, brachialis, lengthened, and a density day
- Supersets on the density day
- Everything else held at twice weekly

**Not for you if.**

- Your compounds are the thing that needs work

**Follow-ups.** [pencilneck-eradication](pencilneck-eradication.md), [monolith](monolith.md), [cathedral](cathedral.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| Volume + Legs · Escalation | 7 | 21 | Close-Grip Bench Press 4×6-10, Cable Rope Hammer Curl 4×8-12, Reverse Curl 3×8-12, Cable Rope Pressdown 2×12-20, Hack Squat 3×8-12, Hack Squat Calf Raises 3×12-20, Hip-Supported Dumbbell Deadlift 2×8-12 |
| Lengthened · Escalation | 7 | 20 | Bayesian Cable Curl 4×8-12, Rolling DB Tricep Extensions 4×10-15, 30° Incline-Lying Dumbbell Curl 3×12-15, French Press 2×10-15, Bench-Supported Single-Arm Cable Pulldown 3×8-12, Pec Deck 2×12-15, Behind-the-Back Cable Lateral Raise 2×15-20 |
| Pump · Escalation | 8 | 24 | Standing Straight-Bar Curl 4×8-12, Lying Dumbbell Skullcrusher 4×12-15, Machine Curl 3×10-15, Cable Triangle Pressdown 2×12-20, Heel-Elevated Goblet Squat 3×10-15, Hack Squat Calf Raises 3×12-20, Cable Crunch 3×12-20, Seated Ham Curl 2×10-15 |
| Go Nuclear (optional) · Escalation | 7 | 15 | Bodyweight Dips 2, Rolling DB Tricep Extensions 2×10-15, Banded EZ Bar Skullcrushers 2, 30° Incline-Lying Dumbbell Curl 1×12-15, 30° Smith Incline Bench Press 3×8-12, Hammer Upper Row 3×8-12, Machine Rear Delt Fly 2×15-20 |

### Week-to-week shape

The program runs 8 weeks falling into 2 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3, 4 | Volume + Legs · Escalation 21, Lengthened · Escalation 20, Pump · Escalation 24, Go Nuclear (optional) · Escalation 16 |
| 5, 6, 7, 8 | Volume + Legs · Proliferation 21, Lengthened · Proliferation 20, Pump · Proliferation 24, Go Nuclear (optional) · Proliferation 16 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| triceps | 24 | above the 20-set ceiling |
| biceps | 22 | above the 20-set ceiling |
| chest | 11 | in band |
| glutes | 8 | below the 10-set growth dose |
| shoulders | 7 | below the 10-set growth dose |
| back | 6 | below the 10-set growth dose |
| quads | 6 | below the 10-set growth dose |
| calves | 6 | in band |
| hamstrings | 4 | below the 10-set growth dose |
| core | 3 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.5 |
| Quad:hamstring | 1.5 |
| Groups covered (4+ sets) | 9 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **105** |
| Axial | **14** |
| Lower back | 6 |
| Per-set systemic | 1.31 |
| High-systemic sets (cost 3+) | 8 |
| Compound share | 21% |
| Shoulder / knee / elbow cost | 15 / 14 / 97 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2.38 |
| Mean stability demand (0-4) | 1.34 |
| Stimulus per unit fatigue | 1.81 |
| Failure-safe share of sets | 35% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 29 |
| At 1 set | 1 |
| At 2 sets | 11 |
| At 3 sets | 11 |
| At 4+ sets | 6 |
| Mean sets per slot | 2.76 |
| Distinct exercises | 26 |
| Variety density (exercises per 10 sets) | 3.25 |
| Largest single-exercise share | 8% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**One set (1):**

- Go Nuclear (optional) · Escalation — 30° Incline-Lying Dumbbell Curl

**Four or more sets (6):**

- Volume + Legs · Escalation — Close-Grip Bench Press, 4 sets *(session opener)*
- Volume + Legs · Escalation — Cable Rope Hammer Curl, 4 sets
- Lengthened · Escalation — Bayesian Cable Curl, 4 sets *(session opener)*
- Lengthened · Escalation — Rolling DB Tricep Extensions, 4 sets
- Pump · Escalation — Standing Straight-Bar Curl, 4 sets *(session opener)*
- Pump · Escalation — Lying Dumbbell Skullcrusher, 4 sets

---

## 6. Rep schemes

7 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | French Press, Heel-Elevated Goblet Squat, Machine Curl, Rolling DB Tricep Extensions, Seated Ham Curl |
| `12-15` | 30° Incline-Lying Dumbbell Curl, Lying Dumbbell Skullcrusher, Pec Deck |
| `12-20` | Cable Crunch, Cable Rope Pressdown, Cable Triangle Pressdown, Hack Squat Calf Raises |
| `15-20` | Behind-the-Back Cable Lateral Raise, Machine Rear Delt Fly |
| `6-10` | Close-Grip Bench Press |
| `8-12` | 30° Smith Incline Bench Press, Bayesian Cable Curl, Bench-Supported Single-Arm Cable Pulldown, Cable Rope Hammer Curl, Hack Squat, Hammer Upper Row, Hip-Supported Dumbbell Deadlift, Reverse Curl, Standing Straight-Bar Curl |
| `Giant` | Tricep Giant Set |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | none of its own; the shared `genericDoubleProgression` runs |
| **Slot-level rules** | declared on at least one movement |
| **Next load written** | 52 of 52 movements (100%) after a clean session |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | double progression +2.5kg | 30° Incline-Lying Dumbbell Curl, 30° Smith Incline Bench Press, Bayesian Cable Curl, Behind-the-Back Cable Lateral Raise, Bench-Supported Single-Arm Cable Pulldown, Cable Crunch, Cable Rope Hammer Curl, Cable Rope Pressdown, Cable Triangle Pressdown, Close-Grip Bench Press, French Press, Hack Squat, Hack Squat Calf Raises, Hammer Upper Row, Heel-Elevated Goblet Squat, Hip-Supported Dumbbell Deadlift, Lying Dumbbell Skullcrusher, Machine Curl, Machine Rear Delt Fly, Pec Deck, Reverse Curl, Rolling DB Tricep Extensions, Seated Ham Curl, Standing Straight-Bar Curl, Tricep Giant Set |

---

## 8. Export block

```yaml
id: arms-race
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 8
frequency: [3, 4]
engine: rotation
sampled_week: 1
weekly: { sets: 80, days: 4, sets_per_session: 20, slots: 29 }
load: { systemic: 105, axial: 14, lower_back: 6, per_set_systemic: 1.31 }
volume: { triceps: 24, biceps: 22, chest: 11, glutes: 8, shoulders: 7, back: 6, quads: 6, calves: 6, hamstrings: 4, core: 3 }
coverage: { covered: 9, missing: [], in_band: 2, over: ['biceps', 'triceps'], under: ['shoulders', 'back', 'quads', 'hamstrings', 'glutes', 'core'] }
set_shape: { slots: 29, ones: 1, twos: 11, threes: 11, four_plus: 6, mean: 2.76 }
rep_ranges: ['10-15', '12-15', '12-20', '15-20', '6-10', '8-12', 'Giant']
progression: { handler: shared, slot_rules: true, distinct_rules: 1 }
variety: { distinct: 26, density: 3.25, top_share: 0.075, evenness: 0.98 }
```
