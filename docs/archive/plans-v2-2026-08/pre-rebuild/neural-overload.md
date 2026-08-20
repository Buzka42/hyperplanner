# Neural Overload

**Program ID:** `neural-overload` · **Source:** [src/data/plans/neuralOverload.ts](../../src/data/plans/neuralOverload.ts)
**Duration:** 9 weeks · **Frequency:** 4 days/week

## Overview

Poliquin **1-6** powerbuilding: four explicit slots per main lift — single @ **90%**, six @ **75%**, single @ **92.5%**, six @ **77.5%** of the tracked 1RM (bench/squat). The single must not become a weekly max. Chin day mirrors the pattern without percentage progression. Day 4 uses front squat straight sets @ **65%** squat 1RM (not 1-6) to build without neural cost.

## Onboarding

- **Stats:** `pausedBench`, `squat` (deadlift key appears in helper typing but is unused in days).
- **Access:** paid.
- **Schedule:** selectable=true; suggested splits (dow): 1-2-4-5; 1-3-5-6; 2-4-6-7.
- **Irregular templates:** 2on-1off, 3on-1off, every-other-day.

### EN (`onboarding.programs.neuralOverload`)

- **Name:** Neural Overload
- **Description:** 9 weeks of 1-6 loading. Heavy single, back-off six, heavier single, heavier six.
- **Features:**
  - Focus: Strength and size together
  - 4 Days / Week
  - Post-activation: does the second six beat the first?
  - The single is never a weekly max attempt
  - Day 4 builds without adding neural cost

### PL (`onboarding.programs.neuralOverload`)

- **Name:** Przeciążenie Nerwowe
- **Description:** 9 tygodni metody 1-6. Ciężka pojedyncza, szóstka, cięższa pojedyncza, cięższa szóstka.
- **Features:**
  - Cel: Siła i masa jednocześnie
  - 4 dni / tydzień
  - Potencjacja: czy druga szóstka bije pierwszą?
  - Pojedyncza nigdy nie jest cotygodniowym maksem
  - Dzień 4 buduje bez dokładania obciążenia nerwowego

## Weekly structure

### Weeks 1–3 (3 weeks)

#### Bench Neural · Charge (dow 1)

- Paused Bench Press · 1×1 · 90.0% of pausedBench · tempo 11X0 · rest 180s · — Heavy single at about 90%. Confident, not maximal — this primes the set that follows.
- Paused Bench Press · 1×6 · 75.0% of pausedBench · tempo 11X0 · rest 180s · — Back-off six. Note the bar speed.
- Paused Bench Press · 1×1 · 92.5% of pausedBench · tempo 11X0 · rest 180s · — Heavier single.
- Paused Bench Press · 1×6 · 77.5% of pausedBench · tempo 11X0 · rest 180s · — Second back-off six, heavier than the first. If it moves better than set two, the priming worked.
- Hammer Upper Row · 4×8-12 · rest 120s
- Cable Lateral Raise · 3×12-20 · rest 60s
- Cable Curl · 3×10-15 · rest 60s
- Cable Triceps Extension · 3×10-15 · rest 60s

#### Squat Neural · Charge (dow 2)

- Paused Low Bar Squat · 1×1 · 90.0% of squat · tempo 10X0 · rest 180s · — Heavy single at about 90%. Confident, not maximal — this primes the set that follows.
- Paused Low Bar Squat · 1×6 · 75.0% of squat · tempo 10X0 · rest 180s · — Back-off six. Note the bar speed.
- Paused Low Bar Squat · 1×1 · 92.5% of squat · tempo 10X0 · rest 180s · — Heavier single.
- Paused Low Bar Squat · 1×6 · 77.5% of squat · tempo 10X0 · rest 180s · — Second back-off six, heavier than the first. If it moves better than set two, the priming worked.
- Seated Ham Curl · 3×8-12 · rest 105s
- Leg Extensions · 3×10-15 · rest 90s
- Standing Calf Raises · 3×12-20 · rest 60s
- Cable Crunch · 3×12-20 · rest 60s

#### Chin Neural · Charge (dow 4)

- Weighted Chin-Up · 1×1-2 · rest 180s · — Heavy rep. Total system weight — bodyweight plus the belt.
- Weighted Chin-Up · 1×6 · rest 180s · — Back-off six.
- Weighted Chin-Up · 1×1-2 · rest 180s · — Heavier rep.
- Weighted Chin-Up · 1×6 · rest 180s · — Second back-off six, heavier.
- Incline DB Bench Press · 4×8-12 · rest 120s
- Machine Rear Delt Fly · 3×15-20 · rest 60s
- Dumbbell Hammer Curl · 3×10-15 · rest 60s
- Rope Pressdown · 3×10-15 · rest 60s

#### Lower Powerbuilding · Charge (dow 5)

- Front Squats · 5×3-5 · 65.0% of squat · rest 210s · — Straight sets, not 1-6. This day exists to build without adding neural cost.
- Hip-Supported Dumbbell Deadlift · 4×8-12 · rest 120s
- Goblet Skater Squat · 3×10-12 · rest 105s · — Per side.
- Seated Ham Curl · 3×10-15 · rest 90s
- Standing Calf Raises · 3×12-20 · rest 60s
- Hammer Chest Press · 3×8-12 · rest 105s

### Weeks 4–6 (3 weeks)

#### Bench Neural · Discharge (dow 1)

- Paused Bench Press · 1×1 · 90.0% of pausedBench · tempo 11X0 · rest 180s · — Heavy single at about 90%. Confident, not maximal — this primes the set that follows.
- Paused Bench Press · 1×6 · 75.0% of pausedBench · tempo 11X0 · rest 180s · — Back-off six. Note the bar speed.
- Paused Bench Press · 1×1 · 92.5% of pausedBench · tempo 11X0 · rest 180s · — Heavier single.
- Paused Bench Press · 1×6 · 77.5% of pausedBench · tempo 11X0 · rest 180s · — Second back-off six, heavier than the first. If it moves better than set two, the priming worked.
- Hammer Upper Row · 4×8-12 · rest 120s
- Cable Lateral Raise · 3×12-20 · rest 60s
- Cable Curl · 3×10-15 · rest 60s
- Cable Triceps Extension · 3×10-15 · rest 60s

#### Squat Neural · Discharge (dow 2)

- Paused Low Bar Squat · 1×1 · 90.0% of squat · tempo 10X0 · rest 180s · — Heavy single at about 90%. Confident, not maximal — this primes the set that follows.
- Paused Low Bar Squat · 1×6 · 75.0% of squat · tempo 10X0 · rest 180s · — Back-off six. Note the bar speed.
- Paused Low Bar Squat · 1×1 · 92.5% of squat · tempo 10X0 · rest 180s · — Heavier single.
- Paused Low Bar Squat · 1×6 · 77.5% of squat · tempo 10X0 · rest 180s · — Second back-off six, heavier than the first. If it moves better than set two, the priming worked.
- Seated Ham Curl · 3×8-12 · rest 105s
- Leg Extensions · 3×10-15 · rest 90s
- Standing Calf Raises · 3×12-20 · rest 60s
- Cable Crunch · 3×12-20 · rest 60s

#### Chin Neural · Discharge (dow 4)

- Weighted Chin-Up · 1×1-2 · rest 180s · — Heavy rep. Total system weight — bodyweight plus the belt.
- Weighted Chin-Up · 1×6 · rest 180s · — Back-off six.
- Weighted Chin-Up · 1×1-2 · rest 180s · — Heavier rep.
- Weighted Chin-Up · 1×6 · rest 180s · — Second back-off six, heavier.
- Incline DB Bench Press · 4×8-12 · rest 120s
- Machine Rear Delt Fly · 3×15-20 · rest 60s
- Dumbbell Hammer Curl · 3×10-15 · rest 60s
- Rope Pressdown · 3×10-15 · rest 60s

#### Lower Powerbuilding · Discharge (dow 5)

- Front Squats · 5×3-5 · 65.0% of squat · rest 210s · — Straight sets, not 1-6. This day exists to build without adding neural cost.
- Hip-Supported Dumbbell Deadlift · 4×8-12 · rest 120s
- Goblet Skater Squat · 3×10-12 · rest 105s · — Per side.
- Seated Ham Curl · 3×10-15 · rest 90s
- Standing Calf Raises · 3×12-20 · rest 60s
- Hammer Chest Press · 3×8-12 · rest 105s

### Weeks 7–9 (3 weeks)

#### Bench Neural · Overload (dow 1)

- Paused Bench Press · 1×1 · 90.0% of pausedBench · tempo 11X0 · rest 180s · — Heavy single at about 90%. Confident, not maximal — this primes the set that follows.
- Paused Bench Press · 1×6 · 75.0% of pausedBench · tempo 11X0 · rest 180s · — Back-off six. Note the bar speed.
- Paused Bench Press · 1×1 · 92.5% of pausedBench · tempo 11X0 · rest 180s · — Heavier single.
- Paused Bench Press · 1×6 · 77.5% of pausedBench · tempo 11X0 · rest 180s · — Second back-off six, heavier than the first. If it moves better than set two, the priming worked.
- Hammer Upper Row · 3×8-12 · rest 120s
- Cable Lateral Raise · 2×12-20 · rest 60s
- Cable Curl · 2×10-15 · rest 60s
- Cable Triceps Extension · 2×10-15 · rest 60s

#### Squat Neural · Overload (dow 2)

- Paused Low Bar Squat · 1×1 · 90.0% of squat · tempo 10X0 · rest 180s · — Heavy single at about 90%. Confident, not maximal — this primes the set that follows.
- Paused Low Bar Squat · 1×6 · 75.0% of squat · tempo 10X0 · rest 180s · — Back-off six. Note the bar speed.
- Paused Low Bar Squat · 1×1 · 92.5% of squat · tempo 10X0 · rest 180s · — Heavier single.
- Paused Low Bar Squat · 1×6 · 77.5% of squat · tempo 10X0 · rest 180s · — Second back-off six, heavier than the first. If it moves better than set two, the priming worked.
- Seated Ham Curl · 2×8-12 · rest 105s
- Leg Extensions · 2×10-15 · rest 90s
- Standing Calf Raises · 2×12-20 · rest 60s
- Cable Crunch · 2×12-20 · rest 60s

#### Chin Neural · Overload (dow 4)

- Weighted Chin-Up · 1×1-2 · rest 180s · — Heavy rep. Total system weight — bodyweight plus the belt.
- Weighted Chin-Up · 1×6 · rest 180s · — Back-off six.
- Weighted Chin-Up · 1×1-2 · rest 180s · — Heavier rep.
- Weighted Chin-Up · 1×6 · rest 180s · — Second back-off six, heavier.
- Incline DB Bench Press · 3×8-12 · rest 120s
- Machine Rear Delt Fly · 2×15-20 · rest 60s
- Dumbbell Hammer Curl · 2×10-15 · rest 60s
- Rope Pressdown · 2×10-15 · rest 60s

#### Lower Powerbuilding · Overload (dow 5)

- Front Squats · 4×3-5 · 65.0% of squat · rest 210s · — Straight sets, not 1-6. This day exists to build without adding neural cost.
- Hip-Supported Dumbbell Deadlift · 3×8-12 · rest 120s
- Goblet Skater Squat · 2×10-12 · rest 105s · — Per side.
- Seated Ham Curl · 2×10-15 · rest 90s
- Standing Calf Raises · 2×12-20 · rest 60s
- Hammer Chest Press · 2×8-12 · rest 105s


## Phases & week-to-week progression

### Charge (1–3) / Discharge (4–6)
Identical slot trees (phase name only).

### Overload (7–9)
Any slot with `sets >= 3` loses **1 set** (accessories shrink; the four 1-set neural exposures stay).

## Techniques, supersets, finishers

- Explicit 1-6 as four separate slots (not a technique object).
- Tempos `11X0` paused / `10X0` otherwise.
- Front squat alternate Safety Bar.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-neural-overload` |
| `i18nKey` | `neuralOverload` |
| `logo` | `/neuraloverload.png` |
| `coverBg` | `bg-[#0a0a05]` |
| `order` | 18 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-neural-overload`):

| Token | HSL |
|---|---|
| `--background` | `210 8% 4%` |
| `--primary` | `53 100% 49%` |
| `--accent` | `53 100% 49%` |
| `--card` | `0 0% 8%` |
| `--ring` | `53 100% 49%` |
| `--signal-text` | `(none)` |

Palette note: electric yellow.

**Widgets:** `1rm`, `program_status`, `strength_chart`, `workout_history`.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** |
| Post-activation scoring UI | **not present** — athlete compares manually via notes |
| Stats | pausedBench + squat collected |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| “Potencjacja” | Rare; PAP usually “potencjacja postaktywacyjna” | `Potencjacja postaktywacyjna (PAP)` or `Efekt pobudzenia` |
| “Przeciążenie Nerwowe” | Fine | keep |
