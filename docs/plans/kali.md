# Kali

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `kali` |
| **Length** | 8 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 74 across 4 training days (week 1 sample) |
| **Sets/session** | 18.5 |
| **Goal** | strength, conditioning |
| **Experience** | intermediate |
| **Equipment** | full-gym |
| **Adaptability** | responsive |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `calendar` |
| **Calibration** | `requireBodyweight: true` |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `myo-reps`, `rest-pause` |
| **Card promise** | *"An 8-week cutting plan that protects strength while controlling systemic fatigue."* |

---

## 1. What this plan is

**Signature mechanic.** A cutting plan that protects strength: one systemic anchor a session and preservation bands.

The onboarding card claims:

- Fixed four-day structure
- One systemic anchor per session
- Glute and lat intensification
- Performance-retention dashboard

**Prerequisites.** An established strength baseline to protect

**Not for you if.**

- You are gaining weight
- You cannot commit to four days

**Follow-ups.** [athena](athena.md), [venus-rising](venus-rising.md), [oracle](oracle.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| I — Earth · Severance | 8 | 18 | High Bar Squat 3×3-6, Leg Press 2×8-12, Front-Foot Elevated Bulgarian Split Squat 2×8-12, Seated Hamstring Curl 2×10-15, Hammer Pulldown (Underhand) 3×8-12, Cable Lateral Raise 2×12-20, Hack Squat Calf Raises 2×12-20, Cable Triangle Pressdown 2×10-15 |
| II — Hunt · Severance | 8 | 18 | Assisted Pull-ups 3×4-6, 30° Smith Incline Bench Press 2×8-12, Pec Deck 2×8-12, Single Leg Machine Hip Thrust 3×8-12, Single-Arm Hammer Strength Row 2×8-12, Lying Cable Lat Raises 2×8-12, Machine Curl 2×10-15, Overhead Tricep Extensions 2×10-15 |
| III — Death · Severance | 8 | 19 | Romanian Deadlift 3×4-6, Hack Squat 2×8-12, Leg Extensions 2×10-15, Lat Prayer 3×8-12, Machine Hip Abduction 3×12-20, Side-Lying Rear Delt Flyes 2×12-20, Cable Crunch 2×10-15, Hack Squat Calf Raises 2×12-20 |
| IV — Rebirth · Severance | 8 | 19 | Paused Bench Press 3×3-6, Dip 2×8-12, Single-Arm Hammer Strength Row 3×8-12, Single-Leg Hip Thrust 3×8-12, Bench-Supported Single-Arm Cable Pulldown 2×8-12, Lying Leg Curls 2×10-15, Lateral Raises 2×12-20, 30° Incline-Lying Dumbbell Curl 2×10-15 |

### Week-to-week shape

The program runs 8 weeks falling into 5 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2 | I — Earth · Severance 18, II — Hunt · Severance 18, III — Death · Severance 19, IV — Rebirth · Severance 19 |
| 3, 4, 5 | I — Earth · Preservation 18, II — Hunt · Preservation 18, III — Death · Preservation 19, IV — Rebirth · Preservation 19 |
| 6 | I — Earth · Unleashed I 18, II — Hunt · Unleashed I 18, III — Death · Unleashed I 19, IV — Rebirth · Unleashed I 19 |
| 7 | I — Earth · Unleashed II 18, II — Hunt · Unleashed II 18, III — Death · Unleashed II 19, IV — Rebirth · Unleashed II 19 |
| 8 | I — Earth · Unleashed III 18, II — Hunt · Unleashed III 18, III — Death · Unleashed III 19, IV — Rebirth · Unleashed III 19 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 21 | above the 20-set ceiling |
| back | 16 | in band |
| quads | 11 | in band |
| shoulders | 10 | in band |
| chest | 9 | below the 10-set growth dose |
| hamstrings | 7 | below the 10-set growth dose |
| triceps | 6 | in band |
| biceps | 4 | below the 6-set growth dose |
| calves | 4 | below the 6-set growth dose |
| core | 2 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.25 |
| Quad:hamstring | 1.57 |
| Groups covered (4+ sets) | 9 of 10 |
| Groups trained on two or more days | 9 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **101** |
| Axial | **26** |
| Lower back | 15 |
| Per-set systemic | 1.36 |
| High-systemic sets (cost 3+) | 8 |
| Compound share | 26% |
| Shoulder / knee / elbow cost | 20 / 26 / 36 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.88 |
| Mean stability demand (0-4) | 1.05 |
| Stimulus per unit fatigue | 1.38 |
| Failure-safe share of sets | 57% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 32 |
| At 1 set | 0 |
| At 2 sets | 22 |
| At 3 sets | 10 |
| At 4+ sets | 0 |
| Mean sets per slot | 2.31 |
| Distinct exercises | 30 |
| Variety density (exercises per 10 sets) | 4.05 |
| Largest single-exercise share | 7% |

No slot sits at one set and none carries more than three. Nothing to flag.

---

## 6. Rep schemes

5 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | 30° Incline-Lying Dumbbell Curl, Cable Crunch, Cable Triangle Pressdown, Leg Extensions, Lying Leg Curls, Machine Curl, Overhead Tricep Extensions, Seated Hamstring Curl |
| `12-20` | Cable Lateral Raise, Hack Squat Calf Raises, Lateral Raises, Machine Hip Abduction, Side-Lying Rear Delt Flyes |
| `3-6` | High Bar Squat, Paused Bench Press |
| `4-6` | Assisted Pull-ups, Romanian Deadlift |
| `8-12` | 30° Smith Incline Bench Press, Bench-Supported Single-Arm Cable Pulldown, Dip, Front-Foot Elevated Bulgarian Split Squat, Hack Squat, Hammer Pulldown (Underhand), Lat Prayer, Leg Press, Lying Cable Lat Raises, Pec Deck, Single Leg Machine Hip Thrust, Single-Arm Hammer Strength Row, Single-Leg Hip Thrust |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | none of its own; the shared `genericDoubleProgression` runs |
| **Slot-level rules** | declared on at least one movement |
| **Next load written** | 64 of 64 movements (100%) after a clean session |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | double progression +2.5kg | 30° Incline-Lying Dumbbell Curl, 30° Smith Incline Bench Press, Assisted Pull-ups, Bench-Supported Single-Arm Cable Pulldown, Cable Crunch, Cable Lateral Raise, Cable Triangle Pressdown, Dip, Front-Foot Elevated Bulgarian Split Squat, Hack Squat, Hack Squat Calf Raises, Hammer Pulldown (Underhand), Lat Prayer, Lateral Raises, Leg Extensions, Leg Press, Lying Cable Lat Raises, Lying Leg Curls, Machine Curl, Machine Hip Abduction, Overhead Tricep Extensions, Pec Deck, Romanian Deadlift, Seated Hamstring Curl, Side-Lying Rear Delt Flyes, Single Leg Machine Hip Thrust, Single-Arm Hammer Strength Row, Single-Leg Hip Thrust |
| computed by the plan each session | the plan recalculates it from your logged work | High Bar Squat, Paused Bench Press |

---

## 8. Export block

```yaml
id: kali
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 8
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 74, days: 4, sets_per_session: 18.5, slots: 32 }
load: { systemic: 101, axial: 26, lower_back: 15, per_set_systemic: 1.36 }
volume: { glutes: 21, back: 16, quads: 11, shoulders: 10, chest: 9, hamstrings: 7, triceps: 6, biceps: 4, calves: 4, core: 2 }
coverage: { covered: 9, missing: [], in_band: 4, over: ['glutes'], under: ['chest', 'biceps', 'hamstrings', 'calves', 'core'] }
set_shape: { slots: 32, ones: 0, twos: 22, threes: 10, four_plus: 0, mean: 2.31 }
rep_ranges: ['10-15', '12-20', '3-6', '4-6', '8-12']
progression: { handler: shared, slot_rules: true, distinct_rules: 2 }
variety: { distinct: 30, density: 4.05, top_share: 0.068, evenness: 0.989 }
```
