# King of the Squat

**Program ID:** `king-of-the-squat` · **Source:** [src/data/plans/kingOfTheSquat.ts](../../src/data/plans/kingOfTheSquat.ts)
**Duration:** 12 weeks · **Frequency:** 4 days/week (dow 1, 2, 4, 5)

## Overview

Squat-specialisation powerlifting. Squat three times weekly (heavy wave, paused volume, front-squat structural), bench twice, deadlift once. The deadlift is fixed at **57.5%** of conventional 1RM for **3×3** and is never progressed — it exists for setup and bar speed while spinal fatigue stays budgeted for squatting.

Heavy day runs **two waves** per session. Weeks 1–3 wave **5/4/3**, 4–6 **4/3/2**, 7–9 **3/2/1**, each wave heavier than the last, stepping **+2.5% of squat 1RM per week** off a **75%** base. Support lifts are percentage-anchored: paused bench **85%** (volume day) / **87.5%** (structural day), paused volume squats **67.5%**, front squats **60%** with reps **3–6**. Safety-bar squat is the sanctioned front-squat alternate.

## Onboarding

- **Stats / 1RMs:** `squat`, `pausedBench`, `conventionalDeadlift` (derived by `requiredStatsFor` from percentage/wave progressions).
- **Modules:** none.
- **Access:** paid (not `alwaysFree`).
- **Calibration map:** Paused Low Bar Squat, Paused Bench Press, Conventional Deadlift, Paused Back Squat, Front Squats.
- **Schedule:** selectable=true; suggested splits (dow): 1-2-4-5; 1-3-5-6; 2-4-6-7.
- **Irregular templates:** 2on-1off, 3on-1off, every-other-day.

### EN (`onboarding.programs.kingOfTheSquat`)

- **Name:** King of the Squat
- **Description:** 12-week squat specialisation. Squat three times a week and let everything else serve it.
- **Features:**
  - Focus: Squat strength
  - 4 Days / Week - squat 3x, bench 2x, deadlift 1x
  - Wave loading: 5/4/3 to 4/3/2 to 3/2/1
  - Deadlift kept deliberately light to protect recovery
  - Front squat and paused work for positional strength

### PL (`onboarding.programs.kingOfTheSquat`)

- **Name:** Król Przysiadu
- **Description:** 12-tygodniowa specjalizacja przysiadowa. Przysiad trzy razy w tygodniu, reszta mu służy.
- **Features:**
  - Cel: Siła w przysiadzie
  - 4 dni / tydzień - przysiad 3x, wyciskanie 2x, martwy ciąg 1x
  - Fale obciążeń: 5/4/3, potem 4/3/2, potem 3/2/1
  - Martwy ciąg celowo lekki, by chronić regenerację
  - Przysiad przedni i pauzy dla siły w pozycjach

## Weekly structure

### Weeks 1–3 (3 weeks)

#### Heavy Squat · Volume Waves (dow 1)

- Paused Low Bar Squat · 6×5 · tempo 10X0 · rest 240s · tech {"kind":"wave","ladder":[5,4,3],"waves":2} · — Two waves of 5/4/3. Each wave heavier than the last.
- Leg Extensions · 3×8-12 · rest 90s
- Seated Ham Curl · 3×8-12 · rest 90s
- Paused Bench Press · 4×6-8 · tempo 11X0 · rest 180s
- Hammer Upper Row · 4×8-12 · rest 120s

#### Bench + Deadlift Maintenance · Volume Waves (dow 2)

- Paused Bench Press · 5×3-5 · 85.0% of pausedBench · tempo 11X0 · rest 210s
- Conventional Deadlift · 3×3 · 57.5% of conventionalDeadlift · tempo 10X0 · rest 180s · — Deliberately easy. Perfect setup, fast bar speed, no grinding. Do not add weight chasing a PR.
- Hammer Lower Row · 3×8-12 · rest 120s
- Seated Ham Curl · 3×10-15 · rest 90s
- Standing Military Press · 3×6-10 · rest 150s
- Hanging Knee Raise · 3×10-20 · rest 90s

#### Squat Volume · Volume Waves (dow 4)

- Paused Back Squat · 5×5-8 · 67.5% of squat · tempo 12X0 · rest 210s · — Two seconds motionless in the hole. Positional strength, not a max.
- Heel-Elevated Goblet Squat · 3×10-15 · rest 90s
- Leg Extensions · 3×12-15 · rest 75s
- Pull-Up · 4×6-10 · rest 120s
- Tricep Extensions · 3×10-15 · rest 75s

#### Structural Squat + Heavy Bench · Volume Waves (dow 5)

- Front Squats · 5×3-6 · 60.0% of squat · tempo 10X0 · rest 210s · — Keep the reps low. If the upper back folds before the legs, the load is doing the wrong job.
- Paused Bench Press · 5×3 · 87.5% of pausedBench · tempo 11X0 · rest 240s
- Hip-Supported Dumbbell Deadlift · 3×8-12 · rest 120s
- Calf Raises · 3×10-20 · rest 75s
- Machine Rear Delt Fly · 3×15-20 · rest 60s

### Weeks 4–6 (3 weeks)

#### Heavy Squat · Intensity Waves (dow 1)

- Paused Low Bar Squat · 6×4 · tempo 10X0 · rest 240s · tech {"kind":"wave","ladder":[4,3,2],"waves":2} · — Two waves of 5/4/3. Each wave heavier than the last.
- Leg Extensions · 3×8-12 · rest 90s
- Seated Ham Curl · 3×8-12 · rest 90s
- Paused Bench Press · 4×6-8 · tempo 11X0 · rest 180s
- Hammer Upper Row · 4×8-12 · rest 120s

#### Bench + Deadlift Maintenance · Intensity Waves (dow 2)

- Paused Bench Press · 5×3-5 · 85.0% of pausedBench · tempo 11X0 · rest 210s
- Conventional Deadlift · 3×3 · 57.5% of conventionalDeadlift · tempo 10X0 · rest 180s · — Deliberately easy. Perfect setup, fast bar speed, no grinding. Do not add weight chasing a PR.
- Hammer Lower Row · 3×8-12 · rest 120s
- Seated Ham Curl · 3×10-15 · rest 90s
- Standing Military Press · 3×6-10 · rest 150s
- Hanging Knee Raise · 3×10-20 · rest 90s

#### Squat Volume · Intensity Waves (dow 4)

- Paused Back Squat · 5×5-8 · 67.5% of squat · tempo 12X0 · rest 210s · — Two seconds motionless in the hole. Positional strength, not a max.
- Heel-Elevated Goblet Squat · 3×10-15 · rest 90s
- Leg Extensions · 3×12-15 · rest 75s
- Pull-Up · 4×6-10 · rest 120s
- Tricep Extensions · 3×10-15 · rest 75s

#### Structural Squat + Heavy Bench · Intensity Waves (dow 5)

- Front Squats · 5×3-6 · 60.0% of squat · tempo 10X0 · rest 210s · — Keep the reps low. If the upper back folds before the legs, the load is doing the wrong job.
- Paused Bench Press · 5×3 · 87.5% of pausedBench · tempo 11X0 · rest 240s
- Hip-Supported Dumbbell Deadlift · 3×8-12 · rest 120s
- Calf Raises · 3×10-20 · rest 75s
- Machine Rear Delt Fly · 3×15-20 · rest 60s

### Weeks 7–9 (3 weeks)

#### Heavy Squat · Peak Waves (dow 1)

- Paused Low Bar Squat · 6×3 · tempo 10X0 · rest 240s · tech {"kind":"wave","ladder":[3,2,1],"waves":2} · — Two waves of 5/4/3. Each wave heavier than the last.
- Leg Extensions · 3×8-12 · rest 90s
- Seated Ham Curl · 3×8-12 · rest 90s
- Paused Bench Press · 4×6-8 · tempo 11X0 · rest 180s
- Hammer Upper Row · 4×8-12 · rest 120s

#### Bench + Deadlift Maintenance · Peak Waves (dow 2)

- Paused Bench Press · 5×3-5 · 85.0% of pausedBench · tempo 11X0 · rest 210s
- Conventional Deadlift · 3×3 · 57.5% of conventionalDeadlift · tempo 10X0 · rest 180s · — Deliberately easy. Perfect setup, fast bar speed, no grinding. Do not add weight chasing a PR.
- Hammer Lower Row · 3×8-12 · rest 120s
- Seated Ham Curl · 3×10-15 · rest 90s
- Standing Military Press · 3×6-10 · rest 150s
- Hanging Knee Raise · 3×10-20 · rest 90s

#### Squat Volume · Peak Waves (dow 4)

- Paused Back Squat · 5×5-8 · 67.5% of squat · tempo 12X0 · rest 210s · — Two seconds motionless in the hole. Positional strength, not a max.
- Heel-Elevated Goblet Squat · 3×10-15 · rest 90s
- Leg Extensions · 3×12-15 · rest 75s
- Pull-Up · 4×6-10 · rest 120s
- Tricep Extensions · 3×10-15 · rest 75s

#### Structural Squat + Heavy Bench · Peak Waves (dow 5)

- Front Squats · 5×3-6 · 60.0% of squat · tempo 10X0 · rest 210s · — Keep the reps low. If the upper back folds before the legs, the load is doing the wrong job.
- Paused Bench Press · 5×3 · 87.5% of pausedBench · tempo 11X0 · rest 240s
- Hip-Supported Dumbbell Deadlift · 3×8-12 · rest 120s
- Calf Raises · 3×10-20 · rest 75s
- Machine Rear Delt Fly · 3×15-20 · rest 60s

### Weeks 10–11 (2 weeks)

#### Heavy Squat · Realisation (dow 1)

- Paused Low Bar Squat · 4×2 · tempo 10X0 · rest 240s · tech {"kind":"wave","ladder":[5,4,3],"waves":2} · — Two waves of 5/4/3. Each wave heavier than the last.
- Leg Extensions · 2×8-12 · rest 90s
- Seated Ham Curl · 2×8-12 · rest 90s
- Paused Bench Press · 3×6-8 · tempo 11X0 · rest 180s
- Hammer Upper Row · 3×8-12 · rest 120s

#### Bench + Deadlift Maintenance · Realisation (dow 2)

- Paused Bench Press · 4×3-5 · 85.0% of pausedBench · tempo 11X0 · rest 210s
- Conventional Deadlift · 2×3 · 57.5% of conventionalDeadlift · tempo 10X0 · rest 180s · — Deliberately easy. Perfect setup, fast bar speed, no grinding. Do not add weight chasing a PR.
- Hammer Lower Row · 2×8-12 · rest 120s
- Seated Ham Curl · 2×10-15 · rest 90s
- Standing Military Press · 2×6-10 · rest 150s
- Hanging Knee Raise · 2×10-20 · rest 90s

#### Squat Volume · Realisation (dow 4)

- Paused Back Squat · 4×5-8 · 67.5% of squat · tempo 12X0 · rest 210s · — Two seconds motionless in the hole. Positional strength, not a max.
- Heel-Elevated Goblet Squat · 2×10-15 · rest 90s
- Leg Extensions · 2×12-15 · rest 75s
- Pull-Up · 3×6-10 · rest 120s
- Tricep Extensions · 2×10-15 · rest 75s

#### Structural Squat + Heavy Bench · Realisation (dow 5)

- Front Squats · 4×3-6 · 60.0% of squat · tempo 10X0 · rest 210s · — Keep the reps low. If the upper back folds before the legs, the load is doing the wrong job.
- Paused Bench Press · 4×3 · 87.5% of pausedBench · tempo 11X0 · rest 240s
- Hip-Supported Dumbbell Deadlift · 2×8-12 · rest 120s
- Calf Raises · 2×10-20 · rest 75s
- Machine Rear Delt Fly · 2×15-20 · rest 60s

### Weeks 12 (single week)

#### Heavy Squat · Test Week (dow 1)

- Paused Low Bar Squat · 3×1 · tempo 10X0 · rest 240s · tech {"kind":"wave","ladder":[5,4,3],"waves":2} · — Squat test. Work up to a single you are certain of.
- Leg Extensions · 1×8-12 · rest 90s
- Seated Ham Curl · 1×8-12 · rest 90s
- Paused Bench Press · 2×6-8 · tempo 11X0 · rest 180s
- Hammer Upper Row · 2×8-12 · rest 120s

#### Bench + Deadlift Maintenance · Test Week (dow 2)

- Paused Bench Press · 3×3-5 · 85.0% of pausedBench · tempo 11X0 · rest 210s
- Conventional Deadlift · 1×3 · 57.5% of conventionalDeadlift · tempo 10X0 · rest 180s · — Deliberately easy. Perfect setup, fast bar speed, no grinding. Do not add weight chasing a PR.
- Hammer Lower Row · 1×8-12 · rest 120s
- Seated Ham Curl · 1×10-15 · rest 90s
- Standing Military Press · 1×6-10 · rest 150s
- Hanging Knee Raise · 1×10-20 · rest 90s

#### Squat Volume · Test Week (dow 4)

- Paused Back Squat · 3×5-8 · 67.5% of squat · tempo 12X0 · rest 210s · — Two seconds motionless in the hole. Positional strength, not a max.
- Heel-Elevated Goblet Squat · 1×10-15 · rest 90s
- Leg Extensions · 1×12-15 · rest 75s
- Pull-Up · 2×6-10 · rest 120s
- Tricep Extensions · 1×10-15 · rest 75s

#### Structural Squat + Heavy Bench · Test Week (dow 5)

- Front Squats · 3×3-6 · 60.0% of squat · tempo 10X0 · rest 210s · — Keep the reps low. If the upper back folds before the legs, the load is doing the wrong job.
- Paused Bench Press · 3×3 · 87.5% of pausedBench · tempo 11X0 · rest 240s
- Hip-Supported Dumbbell Deadlift · 1×8-12 · rest 120s
- Calf Raises · 1×10-20 · rest 75s
- Machine Rear Delt Fly · 1×15-20 · rest 60s


## Phases & week-to-week progression

### Volume Waves (weeks 1–3)
Low-bar squat: **6 sets × 5** with technique wave ladder **[5,4,3] × 2 waves**. Wave load = `0.75 + 0.025 × (weekInPhase − 1)` of squat 1RM.

### Intensity Waves (weeks 4–6)
Heavy squat transform → ladder **[4,3,2]**, reps display `4`, still 6 sets / 2 waves.

### Peak Waves (weeks 7–9)
Ladder **[3,2,1]**, reps `3`.

### Realisation (weeks 10–11)
Heavy squat → **4×2**; every other slot loses **1 set** (floor 2).

### Test Week (week 12)
Heavy squat → **3×1** with note “work up to a single you are certain of”; other slots lose **2 sets** (floor 1). No built-in deadlift or bench test.

## Techniques, supersets, finishers

- **Wave loading** on low-bar squat (heavy day only).
- Tempos: heavy squat `10X0`, paused bench `11X0`, paused back squat `12X0`, front squat `10X0`, deadlift `10X0`.
- No A1/A2 supersets; no finishers.
- Deadlift notes explicitly forbid chasing PRs.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-king-of-the-squat` |
| `i18nKey` | `kingOfTheSquat` |
| `logo` | `/squatking.png` |
| `coverBg` | `bg-[#0a0705]` |
| `order` | 10 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-king-of-the-squat`):

| Token | HSL |
|---|---|
| `--background` | `210 8% 4%` |
| `--primary` | `26 100% 40%` |
| `--accent` | `27 98% 32%` |
| `--card` | `0 0% 8%` |
| `--ring` | `26 100% 40%` |
| `--signal-text` | `(none — uses primary)` |

Palette note: warm brown from squatking.png.

**Widgets:** `1rm`, `program_status`, `strength_chart`, `workout_history`.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — `definePlan` + phase transforms |
| Progression | **complete** — wave + percentage via `calculateWeight` |
| Dedicated dashboard | **shared widgets only** |
| Onboarding | **complete** — three required stats |
| EN / PL copy | **complete** — natural PL name `Król Przysiadu` |
| Verify | shared `verify:plans` / `verify:registry` (no `verify:king`) |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| — | PL card copy is solid | keep |
| Feature “wyciskanie 2x” | Ambiguous (bench vs OHP) | `wyciskanie leżąc 2x` |
