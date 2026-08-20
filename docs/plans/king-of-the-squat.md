# King of the Squat

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `king-of-the-squat` |
| **Length** | 12 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 82 across 4 training days (week 1 sample) |
| **Sets/session** | 20.5 |
| **Goal** | strength, specialisation |
| **Experience** | intermediate, advanced |
| **Equipment** | barbell, full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 4/4 — very high |
| **Session engine** | `calendar` |
| **Calibration** | required: `squat`, `pausedBench`, `conventionalDeadlift` |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `wave` |
| **Card promise** | *"12-week squat specialisation. Squat three times a week and let everything else serve it."* |

---

## 1. What this plan is

**Signature mechanic.** Squat three times a week with the accessories chosen to hold the position, not to add volume.

The onboarding card claims:

- Focus: Squat strength
- 4 Days / Week - squat 3x, bench 2x, deadlift 1x
- Wave loading: 5/4/3 to 4/3/2 to 3/2/1
- Deadlift kept deliberately light to protect recovery
- Front squat and paused work for positional strength

**Prerequisites.** A squat you can load without technical breakdown

**Not for you if.**

- Your knees or hips are the reason you are reading this

**Follow-ups.** [quadfather](quadfather.md), [atlas](atlas.md), [trinary](trinary.md)

---

## 2. The training week

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Heavy Squat · Volume Waves | 5 | 20 | Paused Low Bar Squat 6, Leg Extensions 3, Seated Ham Curl 3, Long Pause Bench Press 4, Hammer Upper Row 4 |
| Bench + Deadlift Maintenance · Volume Waves | 6 | 20 | Wide-Grip Bench Press 5, Conventional Deadlift 3, Hammer Lower Row 3, Glute-Ham Raise 3, Rear-Delt Rope Pulls to Face 3, Ab Wheel 3 |
| Squat Volume · Volume Waves | 6 | 22 | Paused Back Squat 5, Heel-Elevated Goblet Squat 3, Hip Adduction 3, Pull-Up 4, Heavy Rolling Tricep Extensions 4, Seated DB Shoulder Press 3 |
| Structural Squat + Heavy Bench · Volume Waves | 5 | 20 | Front Squats 5, Paused Bench Press 5, Hip-Supported Dumbbell Deadlift 3, Hack Squat Calf Raises 4, Machine Rear Delt Fly 3 |

### Week-to-week shape

The program runs 12 weeks falling into 5 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3 | Heavy Squat · Volume Waves 20, Bench + Deadlift Maintenance · Volume Waves 20, Squat Volume · Volume Waves 22, Structural Squat + Heavy Bench · Volume Waves 20 |
| 4, 5, 6 | Heavy Squat · Intensity Waves 20, Bench + Deadlift Maintenance · Intensity Waves 20, Squat Volume · Intensity Waves 22, Structural Squat + Heavy Bench · Intensity Waves 20 |
| 7, 8, 9 | Heavy Squat · Peak Waves 20, Bench + Deadlift Maintenance · Peak Waves 20, Squat Volume · Peak Waves 22, Structural Squat + Heavy Bench · Peak Waves 20 |
| 10, 11 | Heavy Squat · Realisation 14, Bench + Deadlift Maintenance · Realisation 14, Squat Volume · Realisation 16, Structural Squat + Heavy Bench · Realisation 15 |
| 12 | Heavy Squat · Test Week 9, Bench + Deadlift Maintenance · Test Week 8, Squat Volume · Test Week 10, Structural Squat + Heavy Bench · Test Week 10 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 28 | above the 20-set ceiling |
| quads | 22 | above the 20-set ceiling |
| chest | 14 | in band |
| back | 14 | in band |
| hamstrings | 12 | in band |
| shoulders | 9 | below the 10-set growth dose |
| triceps | 4 | below the 6-set growth dose |
| calves | 4 | below the 6-set growth dose |
| core | 3 | below the 6-set growth dose |
| biceps | 0 | no direct sets |

**Untrained groups:** `biceps`.

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.93 |
| Quad:hamstring | 1.83 |
| Groups covered (4+ sets) | 8 of 10 |
| Groups trained on two or more days | 6 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **156** |
| Axial | **72** |
| Lower back | 56 |
| Per-set systemic | 1.9 |
| High-systemic sets (cost 3+) | 25 |
| Compound share | 56% |
| Shoulder / knee / elbow cost | 26 / 50 / 33 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.77 |
| Mean stability demand (0-4) | 1.33 |
| Stimulus per unit fatigue | 0.93 |
| Failure-safe share of sets | 32% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 22 |
| At 1 set | 0 |
| At 2 sets | 0 |
| At 3 sets | 12 |
| At 4+ sets | 10 |
| Mean sets per slot | 3.73 |
| Distinct exercises | 22 |
| Variety density (exercises per 10 sets) | 2.68 |
| Largest single-exercise share | 7% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (10):**

- Heavy Squat · Volume Waves — Paused Low Bar Squat, 6 sets *(session opener)*
- Heavy Squat · Volume Waves — Long Pause Bench Press, 4 sets
- Heavy Squat · Volume Waves — Hammer Upper Row, 4 sets
- Bench + Deadlift Maintenance · Volume Waves — Wide-Grip Bench Press, 5 sets *(session opener)*
- Squat Volume · Volume Waves — Paused Back Squat, 5 sets *(session opener)*
- Squat Volume · Volume Waves — Pull-Up, 4 sets
- Squat Volume · Volume Waves — Heavy Rolling Tricep Extensions, 4 sets
- Structural Squat + Heavy Bench · Volume Waves — Front Squats, 5 sets *(session opener)*
- Structural Squat + Heavy Bench · Volume Waves — Paused Bench Press, 5 sets
- Structural Squat + Heavy Bench · Volume Waves — Hack Squat Calf Raises, 4 sets

---

## 6. Export block

```yaml
id: king-of-the-squat
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 12
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 82, days: 4, sets_per_session: 20.5, slots: 22 }
load: { systemic: 156, axial: 72, lower_back: 56, per_set_systemic: 1.9 }
volume: { glutes: 28, quads: 22, chest: 14, back: 14, hamstrings: 12, shoulders: 9, triceps: 4, calves: 4, core: 3, biceps: 0 }
coverage: { covered: 8, missing: ['biceps'], in_band: 3, over: ['quads', 'glutes'], under: ['shoulders', 'triceps', 'calves', 'core'] }
set_shape: { slots: 22, ones: 0, twos: 0, threes: 12, four_plus: 10, mean: 3.73 }
variety: { distinct: 22, density: 2.68, top_share: 0.073, evenness: 0.991 }
```
