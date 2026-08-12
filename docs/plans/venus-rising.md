# Venus Rising

**Program ID:** `venus-rising` · **Source:** [src/data/plans/venusRising.ts](../../src/data/plans/venusRising.ts)
**Duration:** 12 weeks · **Frequency:** 3-day FBW or 4-day upper/lower (user preference)

## Overview

Physique plan prioritising glutes, delts, back, quads. Default export is **4-day**; `effectiveVenusMode` + `preprocessDay` swap in the 3-day tree. Double progression +2.5 kg. Weeks 5–8 can add a set to up to two user-selected priority exercises (session cap 16 sets). Dedicated `VenusDashboard`.

## Onboarding

- **Stats:** none.
- **Schedule mode:** `planPreferences['venus-rising'].scheduleMode` `3day`|`4day` with pending week-boundary switch.
- **Exercise priorities:** up to 2 ids in `exerciseSelections` for Rising-phase set bump.
- **Access:** paid.
- **Dashboard:** `src/features/venusRising/VenusDashboard.tsx`.
- **Schedule:** selectable=true; suggested splits (dow): 1-2-4-5; 1-3-5-6; 2-4-6-7.
- **Irregular templates:** 2on-1off, 3on-1off, every-other-day.

### EN (`onboarding.programs.venusRising`)

- **Name:** Venus Rising
- **Description:** A 12-week physique plan for glutes, delts, back and quads.
- **Features:**
  - 3-day full body or 4-day upper/lower
  - 15–16 sets per session
  - User-selected priorities
  - Simple double progression

### PL (`onboarding.programs.venusRising`)

- **Name:** Venus Rising
- **Description:** 12-tygodniowy plan sylwetkowy z naciskiem na pośladki, barki, plecy i czworogłowe.
- **Features:**
  - 3 dni całego ciała lub 4 dni góra/dół
  - 15–16 serii na sesję
  - Priorytety wybierane przez użytkownika
  - Prosta podwójna progresja

## Weekly structure

### Weeks 1–4 (4 weeks)

#### Lower A — Quads + Glutes · Foundation (dow 1)

- Hack Squat · 3×8-12 · tempo 20X0 · rest 75s
- Front-Foot Elevated Bulgarian Split Squat · 3×8-12 · tempo 20X0 · rest 75s
- Seated Hamstring Curl · 2×8-12 · tempo 20X0 · rest 75s
- Leg Extensions · 2×8-12 · tempo 20X0 · rest 75s
- Machine Hip Abduction · 2×8-12 · tempo 20X0 · rest 75s
- Hack Squat Calf Raises · 2×8-12 · tempo 20X0 · rest 75s
- Ab Wheel · 1×8-12 · tempo 20X0 · rest 75s

#### Upper A — Back + Delts · Foundation (dow 2)

- Assisted Pull-ups · 3×8-12 · tempo 20X0 · rest 75s
- Single-Arm Hammer Strength Row · 3×8-12 · tempo 20X0 · rest 75s
- Incline DB Bench Press · 2×8-12 · tempo 20X0 · rest 75s
- Lateral Raises · 3×12-20 · tempo 20X0 · rest 60s
- Single Arm Reverse Pec Deck · 2×12-20 · tempo 20X0 · rest 60s
- Bayesian Cable Curl · 1×10-15 · tempo 20X0 · rest 60s
- Overhead Tricep Extensions · 1×10-15 · tempo 20X0 · rest 60s

#### Lower B — Glutes + Posterior Chain · Foundation (dow 4)

- Hip Thrusts · 3×8-12 · tempo 20X0 · rest 75s
- Romanian Deadlift · 3×8-12 · tempo 20X0 · rest 75s
- Deficit Reverse Lunge · 3×8-12 · tempo 20X0 · rest 75s
- Supported Sissy Squat · 2×10-15 · tempo 20X0 · rest 75s
- Lying Leg Curls · 2×8-12 · tempo 20X0 · rest 75s
- Hack Squat Calf Raises · 2×8-12 · tempo 20X0 · rest 75s

#### Upper B — Shape · Foundation (dow 5)

- Single-Arm Hammer Strength Row · 3×8-12 · tempo 20X0 · rest 75s
- Flat DB Press · 3×8-12 · tempo 20X0 · rest 75s
- Dumbbell Pullover · 2×8-12 · tempo 20X0 · rest 75s
- Seated DB Shoulder Press · 2×8-12 · tempo 20X0 · rest 75s
- Lateral Raises · 3×12-20 · tempo 20X0 · rest 60s
- Hammer Curls · 1×8-12 · tempo 20X0 · rest 75s
- Cable Triceps Extension · 1×8-12 · tempo 20X0 · rest 75s

### Weeks 5–8 (4 weeks)

#### Lower A — Quads + Glutes · Rising (dow 1)

- Hack Squat · 3×8-12 · tempo 20X0 · rest 75s
- Front-Foot Elevated Bulgarian Split Squat · 3×8-12 · tempo 20X0 · rest 75s
- Seated Hamstring Curl · 2×8-12 · tempo 20X0 · rest 75s
- Leg Extensions · 2×8-12 · tempo 20X0 · rest 75s
- Machine Hip Abduction · 2×8-12 · tempo 20X0 · rest 75s
- Hack Squat Calf Raises · 2×8-12 · tempo 20X0 · rest 75s
- Ab Wheel · 1×8-12 · tempo 20X0 · rest 75s

#### Upper A — Back + Delts · Rising (dow 2)

- Assisted Pull-ups · 3×8-12 · tempo 20X0 · rest 75s
- Single-Arm Hammer Strength Row · 3×8-12 · tempo 20X0 · rest 75s
- Incline DB Bench Press · 2×8-12 · tempo 20X0 · rest 75s
- Lateral Raises · 3×12-20 · tempo 20X0 · rest 60s
- Single Arm Reverse Pec Deck · 2×12-20 · tempo 20X0 · rest 60s
- Bayesian Cable Curl · 1×10-15 · tempo 20X0 · rest 60s
- Overhead Tricep Extensions · 1×10-15 · tempo 20X0 · rest 60s

#### Lower B — Glutes + Posterior Chain · Rising (dow 4)

- Hip Thrusts · 3×8-12 · tempo 20X0 · rest 75s
- Romanian Deadlift · 3×8-12 · tempo 20X0 · rest 75s
- Deficit Reverse Lunge · 3×8-12 · tempo 20X0 · rest 75s
- Supported Sissy Squat · 2×10-15 · tempo 20X0 · rest 75s
- Lying Leg Curls · 2×8-12 · tempo 20X0 · rest 75s
- Hack Squat Calf Raises · 2×8-12 · tempo 20X0 · rest 75s

#### Upper B — Shape · Rising (dow 5)

- Single-Arm Hammer Strength Row · 3×8-12 · tempo 20X0 · rest 75s
- Flat DB Press · 3×8-12 · tempo 20X0 · rest 75s
- Dumbbell Pullover · 2×8-12 · tempo 20X0 · rest 75s
- Seated DB Shoulder Press · 2×8-12 · tempo 20X0 · rest 75s
- Lateral Raises · 3×12-20 · tempo 20X0 · rest 60s
- Hammer Curls · 1×8-12 · tempo 20X0 · rest 75s
- Cable Triceps Extension · 1×8-12 · tempo 20X0 · rest 75s

### Weeks 9–11 (3 weeks)

#### Lower A — Quads + Glutes · Ascension (dow 1)

- Hack Squat · 3×8-12 · tempo 20X0 · rest 75s
- Front-Foot Elevated Bulgarian Split Squat · 3×8-12 · tempo 20X0 · rest 75s
- Seated Hamstring Curl · 2×8-12 · tempo 20X0 · rest 75s
- Leg Extensions · 2×8-12 · tempo 20X0 · rest 75s
- Machine Hip Abduction · 2×8-12 · tempo 20X0 · rest 75s
- Hack Squat Calf Raises · 2×8-12 · tempo 20X0 · rest 75s
- Ab Wheel · 1×8-12 · tempo 20X0 · rest 75s

#### Upper A — Back + Delts · Ascension (dow 2)

- Assisted Pull-ups · 3×8-12 · tempo 20X0 · rest 75s
- Single-Arm Hammer Strength Row · 3×8-12 · tempo 20X0 · rest 75s
- Incline DB Bench Press · 2×8-12 · tempo 20X0 · rest 75s
- Lateral Raises · 3×12-20 · tempo 20X0 · rest 60s
- Single Arm Reverse Pec Deck · 2×12-20 · tempo 20X0 · rest 60s
- Bayesian Cable Curl · 1×10-15 · tempo 20X0 · rest 60s
- Overhead Tricep Extensions · 1×10-15 · tempo 20X0 · rest 60s

#### Lower B — Glutes + Posterior Chain · Ascension (dow 4)

- Hip Thrusts · 3×8-12 · tempo 20X0 · rest 75s
- Romanian Deadlift · 3×8-12 · tempo 20X0 · rest 75s
- Deficit Reverse Lunge · 3×8-12 · tempo 20X0 · rest 75s
- Supported Sissy Squat · 2×10-15 · tempo 20X0 · rest 75s
- Lying Leg Curls · 2×8-12 · tempo 20X0 · rest 75s
- Hack Squat Calf Raises · 2×8-12 · tempo 20X0 · rest 75s

#### Upper B — Shape · Ascension (dow 5)

- Single-Arm Hammer Strength Row · 3×8-12 · tempo 20X0 · rest 75s
- Flat DB Press · 3×8-12 · tempo 20X0 · rest 75s
- Dumbbell Pullover · 2×8-12 · tempo 20X0 · rest 75s
- Seated DB Shoulder Press · 2×8-12 · tempo 20X0 · rest 75s
- Lateral Raises · 3×12-20 · tempo 20X0 · rest 60s
- Hammer Curls · 1×8-12 · tempo 20X0 · rest 75s
- Cable Triceps Extension · 1×8-12 · tempo 20X0 · rest 75s

### Weeks 12 (single week)

#### Lower A — Quads + Glutes · Rebirth (dow 1)

- Hack Squat · 2×8-12 · tempo 20X0 · rest 75s
- Front-Foot Elevated Bulgarian Split Squat · 2×8-12 · tempo 20X0 · rest 75s
- Seated Hamstring Curl · 1×8-12 · tempo 20X0 · rest 75s
- Leg Extensions · 1×8-12 · tempo 20X0 · rest 75s
- Machine Hip Abduction · 1×8-12 · tempo 20X0 · rest 75s
- Hack Squat Calf Raises · 1×8-12 · tempo 20X0 · rest 75s
- Ab Wheel · 1×8-12 · tempo 20X0 · rest 75s

#### Upper A — Back + Delts · Rebirth (dow 2)

- Assisted Pull-ups · 2×8-12 · tempo 20X0 · rest 75s
- Single-Arm Hammer Strength Row · 2×8-12 · tempo 20X0 · rest 75s
- Incline DB Bench Press · 1×8-12 · tempo 20X0 · rest 75s
- Lateral Raises · 2×12-20 · tempo 20X0 · rest 60s
- Single Arm Reverse Pec Deck · 1×12-20 · tempo 20X0 · rest 60s
- Bayesian Cable Curl · 1×10-15 · tempo 20X0 · rest 60s
- Overhead Tricep Extensions · 1×10-15 · tempo 20X0 · rest 60s

#### Lower B — Glutes + Posterior Chain · Rebirth (dow 4)

- Hip Thrusts · 2×8-12 · tempo 20X0 · rest 75s
- Romanian Deadlift · 2×8-12 · tempo 20X0 · rest 75s
- Deficit Reverse Lunge · 2×8-12 · tempo 20X0 · rest 75s
- Supported Sissy Squat · 1×10-15 · tempo 20X0 · rest 75s
- Lying Leg Curls · 1×8-12 · tempo 20X0 · rest 75s
- Hack Squat Calf Raises · 1×8-12 · tempo 20X0 · rest 75s

#### Upper B — Shape · Rebirth (dow 5)

- Single-Arm Hammer Strength Row · 2×8-12 · tempo 20X0 · rest 75s
- Flat DB Press · 2×8-12 · tempo 20X0 · rest 75s
- Dumbbell Pullover · 1×8-12 · tempo 20X0 · rest 75s
- Seated DB Shoulder Press · 1×8-12 · tempo 20X0 · rest 75s
- Lateral Raises · 2×12-20 · tempo 20X0 · rest 60s
- Hammer Curls · 1×8-12 · tempo 20X0 · rest 75s
- Cable Triceps Extension · 1×8-12 · tempo 20X0 · rest 75s


## Phases & week-to-week progression

### Foundation (1–4)
RPE unset (default).

### Rising (5–8)
All slots `rpe: 8.5`; priority exercises may go 2→3 sets if total <16.

### Ascension (9–11)
Isolation (`lateral-raise`, `leg-extension`, `single-arm-reverse-pec-deck`) → RPE **9.5**; else 8.5.

### Rebirth (12)
Sets ≥3 → 2, else 1; RPE 8.

## Techniques, supersets, finishers

- Double progression only; default tempo `20X0`.
- No supersets / intensifiers in source.
- 3-day internal id `venus-rising-3day-internal` (not a separate catalog plan).

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-venus-rising` |
| `i18nKey` | `venusRising` |
| `logo` | `/venusrising.png` |
| `coverBg` | `bg-[#12080e]` |
| `order` | 22 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-venus-rising`):

| Token | HSL |
|---|---|
| `--background` | `330 38% 5%` |
| `--primary` | `337 68% 55%` |
| `--accent` | `347 48% 22%` |
| `--card` | `330 30% 8%` |
| `--ring` | `337 68% 55%` |
| `--signal-text` | `337 78% 72%` |

Palette note: rose/magenta.

**Widgets:** `program_status`, `workout_history`.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** (dual trees) |
| Dashboard | **complete** — VenusDashboard |
| Mode switching | **complete** — week-boundary pending change |
| PL name | left EN |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| Name `Venus Rising` | Untranslated | keep brand or `Wenus Wschodząca` |
