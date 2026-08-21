# REDLINE

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `redline` |
| **Length** | 8 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 73 across 4 training days (week 1 sample) |
| **Sets/session** | 18.3 |
| **Goal** | conditioning, hypertrophy |
| **Experience** | intermediate |
| **Equipment** | full-gym |
| **Adaptability** | responsive |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `calendar` |
| **Calibration** | none |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Card promise** | *"An 8-week four-day full-body plan built around 40–50 minute sessions and timed finishers."* |

---

## 1. What this plan is

**Signature mechanic.** Forty-to-fifty minute sessions: one heavy anchor, paired burn work, timed finishers.

The onboarding card claims:

- 4 sessions of 40–50 minutes
- One heavy anchor, then paired burn work
- Timed finisher blocks
- Recovery check before every session

**Prerequisites.** A base of general fitness

**Not for you if.**

- You want long unhurried sessions
- Your gym is too crowded to hold two stations

**Follow-ups.** [kali](kali.md), [the-minimum](the-minimum.md)

---

## 2. The training week

| Day | Slots | Sets | Work (sets×reps) |
|---|---:|---:|---|
| PRESSURE · Ignition | 9 | 17 | Leg Press 3×4-6, Incline DB Bench Press 2×6-10, Single-Arm Hammer Strength Row 2×6-10, Seated Hamstring Curl 2×8-12, Cable Lateral Raise 2×12-15, Cable Rope Hammer Curl 2×8-15, Overhead Tricep Extensions 2×8-15, Kettlebell Swing 1×10-15, Farmer Carry 1×20-30 |
| REDLINE · Ignition | 10 | 18 | Lat Pulldown (Neutral) 3×4-6, Front-Foot Elevated Bulgarian Split Squat 2×8-10, Deficit Pushups 2×6-10, Hip-Supported Dumbbell Deadlift 2×8-10, Single Arm Reverse Pec Deck 2×12-15, Hack Squat Calf Raises 2×12-20, Ab Wheel 2×8-15, Heel-Elevated Goblet Squat 1×8, Push-Up 1×6-10, Farmer Carry 1×20-30 |
| FURNACE · Ignition | 10 | 18 | Paused Bench Press 3×4-6, Goblet Skater Squat 2×8-12, Bench-Supported Single-Arm Cable Pulldown 2×6-10, Leg Extensions 2×10-15, Lat Prayer 2×10-15, Behind-the-Back Cable Lateral Raise 2×12-20, 30° Incline-Lying Dumbbell Curl 2×8-15, Kettlebell Swing 1×10-15, Deficit Reverse Lunge 1×8, Deficit Pushups 1×6-10 |
| AFTERBURN · Ignition | 10 | 20 | Trap-Bar Deadlift 3×4-6, Deficit Pushups 2×6-10, Hammer Pulldown (Underhand) 2×8-12, Deficit Reverse Lunge 2×8, Single-Arm Hammer Strength Row 2×6-10, Behind-the-Back Cable Lateral Raise 2×12-20, Cable Triangle Pressdown 2×8-15, Hack Squat Calf Raises 2×12-20, Ab Wheel 2×8-15, Farmer Carry 1×20-30 |

### Week-to-week shape

The program runs 8 weeks falling into 4 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2 | PRESSURE · Ignition 17, REDLINE · Ignition 18, FURNACE · Ignition 18, AFTERBURN · Ignition 20 |
| 3, 4, 5 | PRESSURE · Burn 17, REDLINE · Burn 18, FURNACE · Burn 18, AFTERBURN · Burn 20 |
| 6, 7 | PRESSURE · Redline 17, REDLINE · Redline 18, FURNACE · Redline 18, AFTERBURN · Redline 20 |
| 8 | PRESSURE · Ashes 11, REDLINE · Ashes 12, FURNACE · Ashes 12, AFTERBURN · Ashes 12 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| glutes | 18 | in band |
| back | 16 | in band |
| quads | 16 | in band |
| chest | 11 | in band |
| shoulders | 10 | in band |
| hamstrings | 9 | below the 10-set growth dose |
| biceps | 7 | in band |
| triceps | 4 | below the 6-set growth dose |
| calves | 4 | below the 6-set growth dose |
| core | 4 | below the 6-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.09 |
| Quad:hamstring | 1.78 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **120** |
| Axial | **30** |
| Lower back | 35 |
| Per-set systemic | 1.64 |
| High-systemic sets (cost 3+) | 11 |
| Compound share | 44% |
| Shoulder / knee / elbow cost | 19 / 28 / 36 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 2.05 |
| Mean stability demand (0-4) | 1.51 |
| Stimulus per unit fatigue | 1.25 |
| Failure-safe share of sets | 30% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 39 |
| At 1 set | 0 |
| At 2 sets | 0 |
| At 3 sets | 0 |
| At 4+ sets | 0 |
| Mean sets per slot | 1.87 |
| Distinct exercises | 29 |
| Variety density (exercises per 10 sets) | 3.97 |
| Largest single-exercise share | 7% |

No slot sits at one set and none carries more than three. Nothing to flag.

---

## 6. Rep schemes

10 distinct rep ranges across the plan. A plan that prescribes one
range for every movement is asking a lateral raise and a squat the
same question; a real spread is the sign that each slot was chosen.

| Range | Movements |
|---|---|
| `10-15` | Kettlebell Swing, Lat Prayer, Leg Extensions |
| `12-15` | Cable Lateral Raise, Single Arm Reverse Pec Deck |
| `12-20` | Behind-the-Back Cable Lateral Raise, Hack Squat Calf Raises |
| `20-30` | Farmer Carry |
| `4-6` | Lat Pulldown (Neutral), Leg Press, Paused Bench Press, Trap-Bar Deadlift |
| `6-10` | Bench-Supported Single-Arm Cable Pulldown, Deficit Pushups, Incline DB Bench Press, Push-Up, Single-Arm Hammer Strength Row |
| `8` | Deficit Reverse Lunge, Heel-Elevated Goblet Squat |
| `8-10` | Front-Foot Elevated Bulgarian Split Squat, Hip-Supported Dumbbell Deadlift |
| `8-12` | Goblet Skater Squat, Hammer Pulldown (Underhand), Seated Hamstring Curl |
| `8-15` | 30° Incline-Lying Dumbbell Curl, Ab Wheel, Cable Rope Hammer Curl, Cable Triangle Pressdown, Overhead Tricep Extensions |

---

## 7. Load progression

How the weight on each movement is chosen, and what makes it go up.
Two layers combine: the rule the plan declares on a slot, and the
save-time handler that writes the next working load after a session.

| | |
|---|---|
| **Save-time handler** | its own rule — `PROGRESSION_HANDLERS['redline']` — composed on top of the shared double progression |
| **Slot-level rules** | declared on at least one movement |
| **Next load written** | 78 of 78 movements (100%) after a clean session |

| Prescribed from | Advances by | Movements |
|---|---|---|
| carried working load | double progression +2.5kg | 30° Incline-Lying Dumbbell Curl, Ab Wheel, Behind-the-Back Cable Lateral Raise, Bench-Supported Single-Arm Cable Pulldown, Cable Lateral Raise, Cable Rope Hammer Curl, Cable Triangle Pressdown, Deficit Pushups, Deficit Reverse Lunge, Farmer Carry, Front-Foot Elevated Bulgarian Split Squat, Goblet Skater Squat, Hack Squat Calf Raises, Hammer Pulldown (Underhand), Heel-Elevated Goblet Squat, Hip-Supported Dumbbell Deadlift, Incline DB Bench Press, Kettlebell Swing, Lat Prayer, Lat Pulldown (Neutral), Leg Extensions, Leg Press, Overhead Tricep Extensions, Push-Up, Seated Hamstring Curl, Single Arm Reverse Pec Deck, Single-Arm Hammer Strength Row |
| computed by the plan each session | the plan recalculates it from your logged work | Paused Bench Press, Trap-Bar Deadlift |

---

## 8. Export block

```yaml
id: redline
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 8
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 73, days: 4, sets_per_session: 18.3, slots: 39 }
load: { systemic: 120, axial: 30, lower_back: 35, per_set_systemic: 1.64 }
volume: { glutes: 18, back: 16, quads: 16, chest: 11, shoulders: 10, hamstrings: 9, biceps: 7, triceps: 4, calves: 4, core: 4 }
coverage: { covered: 10, missing: [], in_band: 6, over: [], under: ['triceps', 'hamstrings', 'calves', 'core'] }
set_shape: { slots: 39, ones: 0, twos: 0, threes: 0, four_plus: 0, mean: 1.87 }
rep_ranges: ['10-15', '12-15', '12-20', '20-30', '4-6', '6-10', '8', '8-10', '8-12', '8-15']
progression: { handler: own+double, slot_rules: true, distinct_rules: 2 }
variety: { distinct: 29, density: 3.97, top_share: 0.068, evenness: 0.981 }
```
