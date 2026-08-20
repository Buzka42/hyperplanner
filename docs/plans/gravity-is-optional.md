# Gravity Is Optional

> Plan reference, v3 format — regenerated from the shipped code by
> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every
> number below is measured from the week the app actually builds, not
> transcribed from a spec. Supersedes the pre-rebuild doc and the v2
> audit note, both kept in `docs/archive/plans-v2-2026-08/`.

| | |
|---|---|
| **id** | `gravity-is-optional` |
| **Length** | 12 weeks |
| **Frequency** | 4 days/week |
| **Weekly sets** | 82 across 4 training days (week 1 sample) |
| **Sets/session** | 20.5 |
| **Goal** | hypertrophy, strength |
| **Experience** | intermediate |
| **Equipment** | minimal, full-gym |
| **Adaptability** | fixed |
| **Fatigue cost** | 3/4 — high |
| **Session engine** | `calendar` |
| **Calibration** | `requireBodyweight: true` |
| **Hooks** | `calculateWeight`, `preprocessDay` |
| **Techniques used** | `last-set-failure`, `total-reps` |
| **Card promise** | *"12-week weighted calisthenics. Pull-ups and dips as main lifts, tracked by total system weight."* |

---

## 1. What this plan is

**Signature mechanic.** Weighted calisthenics counted as total system weight, so bodyweight progress is visible.

The onboarding card claims:

- Focus: Weighted pulling and dipping
- 4 Days / Week
- Vertical pull and dip family 3x weekly
- Total system weight: bodyweight plus added load
- Total-rep targets - beat your set count, not your reps

**Prerequisites.** Five strict pull-ups and ten strict dips

**Not for you if.**

- You cannot yet perform the entry movements

**Follow-ups.** [workhorse](workhorse.md), [atlas](atlas.md), [monolith](monolith.md)

---

## 2. The training week

| Day | Slots | Sets | Work |
|---|---:|---:|---|
| Heavy Gravity · Ascent | 5 | 19 | Weighted Chin-Up 5, Weighted Dip 5, Hammer Upper Row 3, Sissy Squat 3, Hanging Leg Raises 3 |
| Single-Leg Gravity · Ascent | 6 | 20 | Goblet Skater Squat 4, Hip-Supported Dumbbell Deadlift 4, TRX Body Row 3, Deficit Pushups 3, Standing Calf Raises 3, Ab Wheel 3 |
| Volume Gravity · Ascent | 6 | 22 | Chin-Up 6, Dip 6, Heel-Elevated Goblet Squat 4, Cable Lateral Raise 2, Cable Curl 2, Cable Triceps Extension 2 |
| Control Gravity · Ascent | 7 | 21 | TRX Push-Up 3, TRX Body Row 3, Cable Lateral Raise 3, Sissy Squat 3, Hip-Supported Dumbbell Deadlift 3, Standing Calf Raises 3, Hanging Knee Raise 3 |

### Week-to-week shape

The program runs 12 weeks falling into 3 distinct set-count shapes:

| Weeks | Sets per training day |
|---|---|
| 1, 2, 3, 4 | Heavy Gravity · Ascent 19, Single-Leg Gravity · Ascent 20, Volume Gravity · Ascent 22, Control Gravity · Ascent 21 |
| 5, 6, 7, 8 | Heavy Gravity · Escape Velocity 21, Single-Leg Gravity · Escape Velocity 20, Volume Gravity · Escape Velocity 22, Control Gravity · Escape Velocity 21 |
| 9, 10, 11, 12 | Heavy Gravity · Orbit 19, Single-Leg Gravity · Orbit 20, Volume Gravity · Orbit 22, Control Gravity · Orbit 21 |

---

## 3. Weekly volume by muscle group

Direct sets, counted once per exercise per major group.

| Group | Sets | Read |
|---|---:|---|
| back | 20 | in band |
| chest | 17 | in band |
| glutes | 15 | in band |
| quads | 14 | in band |
| biceps | 13 | in band |
| triceps | 13 | in band |
| core | 9 | in band |
| hamstrings | 7 | below the 10-set growth dose |
| calves | 6 | in band |
| shoulders | 5 | below the 10-set growth dose |

| Balance | Value |
|---|---|
| Push:pull (direct sets) | 1.06 |
| Quad:hamstring | 2 |
| Groups covered (4+ sets) | 10 of 10 |
| Groups trained on two or more days | 10 |

---

## 4. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic (weekly) | **145** |
| Axial | **15** |
| Lower back | 39 |
| Per-set systemic | 1.77 |
| High-systemic sets (cost 3+) | 11 |
| Compound share | 60% |
| Shoulder / knee / elbow cost | 32 / 28 / 44 |

| Stimulus quality | Value |
|---|---|
| Mean lengthened bias (0-4) | 1.89 |
| Mean stability demand (0-4) | 1.11 |
| Stimulus per unit fatigue | 1.07 |
| Failure-safe share of sets | 29% |

---

## 5. Set shape

| | |
|---|---:|
| Slots | 24 |
| At 1 set | 0 |
| At 2 sets | 3 |
| At 3 sets | 14 |
| At 4+ sets | 7 |
| Mean sets per slot | 3.42 |
| Distinct exercises | 19 |
| Variety density (exercises per 10 sets) | 2.32 |
| Largest single-exercise share | 8% |

### Flagged slots

Every slot at one set, and every slot at four or more. Both are review
flags rather than automatic defects — a plan built on one all-out work
set, a top-single mechanic, a density block, or specialisation volume
on its own muscle earns them. The rest are worth a second look.

**Four or more sets (7):**

- Heavy Gravity · Ascent — Weighted Chin-Up, 5 sets *(session opener)*
- Heavy Gravity · Ascent — Weighted Dip, 5 sets
- Single-Leg Gravity · Ascent — Goblet Skater Squat, 4 sets *(session opener)*
- Single-Leg Gravity · Ascent — Hip-Supported Dumbbell Deadlift, 4 sets
- Volume Gravity · Ascent — Chin-Up, 6 sets *(session opener)*
- Volume Gravity · Ascent — Dip, 6 sets
- Volume Gravity · Ascent — Heel-Elevated Goblet Squat, 4 sets

---

## 6. Export block

```yaml
id: gravity-is-optional
version: 3
generated_from: docs/analysis/plan-facts.json
length_weeks: 12
frequency: [4]
engine: calendar
sampled_week: 1
weekly: { sets: 82, days: 4, sets_per_session: 20.5, slots: 24 }
load: { systemic: 145, axial: 15, lower_back: 39, per_set_systemic: 1.77 }
volume: { back: 20, chest: 17, glutes: 15, quads: 14, biceps: 13, triceps: 13, core: 9, hamstrings: 7, calves: 6, shoulders: 5 }
coverage: { covered: 10, missing: [], in_band: 8, over: [], under: ['shoulders', 'hamstrings'] }
set_shape: { slots: 24, ones: 0, twos: 3, threes: 14, four_plus: 7, mean: 3.42 }
variety: { distinct: 19, density: 2.32, top_share: 0.085, evenness: 0.978 }
```
