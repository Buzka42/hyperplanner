# Athena

**Program ID:** `athena` · **Source:** [src/data/plans/athena.ts](../../src/data/plans/athena.ts)
**Duration:** 12 weeks · **Frequency:** 3- or 4-day mode

## Overview

Barbell strength bridge. Primary lifts (squat, bench, RDL, OHP) marked `primary`. From Discipline onward they use **top-set + backoff** progression. `preprocessDay` applies 3-day tree and user lift-family swaps. Loads can persist in `user.athenaStatus.exerciseLoads`. Dedicated AthenaDashboard + `progression/athena.ts`.

## Onboarding

- **Stats:** none required at definePlan (double / top-set-backoff).
- **Lift families:** `planPreferences.athena.exerciseSelections` keys `squat`, `bench`, `hinge`, `verticalPress`.
- **Schedule mode:** 3day/4day with pending change (same pattern as Venus).
- **Access:** paid.
- **Dashboard / progression:** `src/features/athena/`, `src/features/workout/progression/athena.ts`.
- **Schedule:** selectable=true; suggested splits (dow): 1-2-4-5; 1-3-5-6; 2-4-6-7.
- **Irregular templates:** 2on-1off, 3on-1off, every-other-day.

### EN (`onboarding.programs.athena`)

- **Name:** Athena
- **Description:** A 12-week bridge into intelligent heavy training and reusable performance data.
- **Features:**
  - 3-day or 4-day mode
  - User-selected lift families
  - Top sets with editable back-offs
  - No mandatory max test

### PL (`onboarding.programs.athena`)

- **Name:** Athena
- **Description:** 12-tygodniowe przejście do inteligentnego ciężkiego treningu i wspólnego profilu wyników.
- **Features:**
  - Tryb 3- lub 4-dniowy
  - Rodziny bojów wybierane przez użytkownika
  - Serie główne i edytowalne back-offy
  - Bez obowiązkowego testu maksa

## Weekly structure

### Weeks 1–4 (4 weeks)

#### Lower A — Squat · Wisdom (dow 1)

- Barbell Squat · 4×6-8 · tempo 20X0 · rest 150s
- Romanian Deadlift · 3×6-10 · tempo 20X0 · rest 120s
- Front-Foot Elevated Bulgarian Split Squat · 2×6-10 · tempo 20X0 · rest 90s
- Seated Hamstring Curl · 2×6-10 · tempo 20X0 · rest 90s
- Hack Squat Calf Raises · 2×6-10 · tempo 20X0 · rest 90s
- Ab Wheel · 2×6-10 · tempo 20X0 · rest 90s

#### Upper A — Bench · Wisdom (dow 2)

- Flat Barbell Bench Press · 4×6-8 · tempo 20X0 · rest 150s
- Single-Arm Hammer Strength Row · 3×6-10 · tempo 20X0 · rest 90s
- Assisted Pull-ups · 3×6-10 · tempo 20X0 · rest 90s
- Seated DB Shoulder Press · 2×6-10 · tempo 20X0 · rest 90s
- Single Arm Reverse Pec Deck · 2×6-10 · tempo 20X0 · rest 90s
- Cable Triceps Extension · 1×6-10 · tempo 20X0 · rest 90s
- Hammer Curls · 1×6-10 · tempo 20X0 · rest 90s

#### Lower B — Hinge · Wisdom (dow 4)

- Romanian Deadlift · 3×5-8 · tempo 20X0 · rest 150s
- Paused Squat · 3×6-10 · tempo 20X0 · rest 90s
- Hip Thrusts · 2×6-10 · tempo 20X0 · rest 90s
- Leg Extensions · 2×6-10 · tempo 20X0 · rest 90s
- Lying Leg Curls · 2×6-10 · tempo 20X0 · rest 90s
- Hack Squat Calf Raises · 2×6-10 · tempo 20X0 · rest 90s
- Ab Wheel · 1×6-10 · tempo 20X0 · rest 90s

#### Upper B — Press/Pull · Wisdom (dow 5)

- Standing Military Press · 3×6-8 · tempo 20X0 · rest 150s
- Assisted Pull-ups · 3×6-10 · tempo 20X0 · rest 90s
- Incline DB Bench Press · 2×6-10 · tempo 20X0 · rest 90s
- Single-Arm Hammer Strength Row · 3×6-10 · tempo 20X0 · rest 90s
- Lateral Raises · 2×6-10 · tempo 20X0 · rest 90s
- Hammer Curls · 1×6-10 · tempo 20X0 · rest 90s
- Cable Triceps Extension · 1×6-10 · tempo 20X0 · rest 90s

### Weeks 5–8 (4 weeks)

#### Lower A — Squat · Discipline (dow 1)

- Barbell Squat · 4×4-6 · tempo 20X0 · rest 150s
- Romanian Deadlift · 3×4-6 · tempo 20X0 · rest 120s
- Front-Foot Elevated Bulgarian Split Squat · 2×6-10 · tempo 20X0 · rest 90s
- Seated Hamstring Curl · 2×6-10 · tempo 20X0 · rest 90s
- Hack Squat Calf Raises · 2×6-10 · tempo 20X0 · rest 90s
- Ab Wheel · 2×6-10 · tempo 20X0 · rest 90s

#### Upper A — Bench · Discipline (dow 2)

- Flat Barbell Bench Press · 4×4-6 · tempo 20X0 · rest 150s
- Single-Arm Hammer Strength Row · 3×6-10 · tempo 20X0 · rest 90s
- Assisted Pull-ups · 3×6-10 · tempo 20X0 · rest 90s
- Seated DB Shoulder Press · 2×6-10 · tempo 20X0 · rest 90s
- Single Arm Reverse Pec Deck · 2×6-10 · tempo 20X0 · rest 90s
- Cable Triceps Extension · 1×6-10 · tempo 20X0 · rest 90s
- Hammer Curls · 1×6-10 · tempo 20X0 · rest 90s

#### Lower B — Hinge · Discipline (dow 4)

- Romanian Deadlift · 3×4-6 · tempo 20X0 · rest 150s
- Paused Squat · 3×6-10 · tempo 20X0 · rest 90s
- Hip Thrusts · 2×6-10 · tempo 20X0 · rest 90s
- Leg Extensions · 2×6-10 · tempo 20X0 · rest 90s
- Lying Leg Curls · 2×6-10 · tempo 20X0 · rest 90s
- Hack Squat Calf Raises · 2×6-10 · tempo 20X0 · rest 90s
- Ab Wheel · 1×6-10 · tempo 20X0 · rest 90s

#### Upper B — Press/Pull · Discipline (dow 5)

- Standing Military Press · 3×4-6 · tempo 20X0 · rest 150s
- Assisted Pull-ups · 3×6-10 · tempo 20X0 · rest 90s
- Incline DB Bench Press · 2×6-10 · tempo 20X0 · rest 90s
- Single-Arm Hammer Strength Row · 3×6-10 · tempo 20X0 · rest 90s
- Lateral Raises · 2×6-10 · tempo 20X0 · rest 90s
- Hammer Curls · 1×6-10 · tempo 20X0 · rest 90s
- Cable Triceps Extension · 1×6-10 · tempo 20X0 · rest 90s

### Weeks 9–11 (3 weeks)

#### Lower A — Squat · Command (dow 1)

- Barbell Squat · 4×3-5 · tempo 20X0 · rest 150s
- Romanian Deadlift · 3×3-5 · tempo 20X0 · rest 120s
- Front-Foot Elevated Bulgarian Split Squat · 2×6-10 · tempo 20X0 · rest 90s
- Seated Hamstring Curl · 2×6-10 · tempo 20X0 · rest 90s
- Hack Squat Calf Raises · 2×6-10 · tempo 20X0 · rest 90s
- Ab Wheel · 2×6-10 · tempo 20X0 · rest 90s

#### Upper A — Bench · Command (dow 2)

- Flat Barbell Bench Press · 4×3-5 · tempo 20X0 · rest 150s
- Single-Arm Hammer Strength Row · 3×6-10 · tempo 20X0 · rest 90s
- Assisted Pull-ups · 3×6-10 · tempo 20X0 · rest 90s
- Seated DB Shoulder Press · 2×6-10 · tempo 20X0 · rest 90s
- Single Arm Reverse Pec Deck · 2×6-10 · tempo 20X0 · rest 90s
- Cable Triceps Extension · 1×6-10 · tempo 20X0 · rest 90s
- Hammer Curls · 1×6-10 · tempo 20X0 · rest 90s

#### Lower B — Hinge · Command (dow 4)

- Romanian Deadlift · 3×3-5 · tempo 20X0 · rest 150s
- Paused Squat · 3×6-10 · tempo 20X0 · rest 90s
- Hip Thrusts · 2×6-10 · tempo 20X0 · rest 90s
- Leg Extensions · 2×6-10 · tempo 20X0 · rest 90s
- Lying Leg Curls · 2×6-10 · tempo 20X0 · rest 90s
- Hack Squat Calf Raises · 2×6-10 · tempo 20X0 · rest 90s
- Ab Wheel · 1×6-10 · tempo 20X0 · rest 90s

#### Upper B — Press/Pull · Command (dow 5)

- Standing Military Press · 3×3-5 · tempo 20X0 · rest 150s
- Assisted Pull-ups · 3×6-10 · tempo 20X0 · rest 90s
- Incline DB Bench Press · 2×6-10 · tempo 20X0 · rest 90s
- Single-Arm Hammer Strength Row · 3×6-10 · tempo 20X0 · rest 90s
- Lateral Raises · 2×6-10 · tempo 20X0 · rest 90s
- Hammer Curls · 1×6-10 · tempo 20X0 · rest 90s
- Cable Triceps Extension · 1×6-10 · tempo 20X0 · rest 90s

### Weeks 12 (single week)

#### Lower A — Squat · Judgment (dow 1)

- Barbell Squat · 3×3-5 · tempo 20X0 · rest 150s
- Romanian Deadlift · 3×3-5 · tempo 20X0 · rest 120s
- Front-Foot Elevated Bulgarian Split Squat · 1×6-10 · tempo 20X0 · rest 90s
- Seated Hamstring Curl · 1×6-10 · tempo 20X0 · rest 90s
- Hack Squat Calf Raises · 1×6-10 · tempo 20X0 · rest 90s
- Ab Wheel · 1×6-10 · tempo 20X0 · rest 90s

#### Upper A — Bench · Judgment (dow 2)

- Flat Barbell Bench Press · 3×3-5 · tempo 20X0 · rest 150s
- Single-Arm Hammer Strength Row · 2×6-10 · tempo 20X0 · rest 90s
- Assisted Pull-ups · 2×6-10 · tempo 20X0 · rest 90s
- Seated DB Shoulder Press · 1×6-10 · tempo 20X0 · rest 90s
- Single Arm Reverse Pec Deck · 1×6-10 · tempo 20X0 · rest 90s
- Cable Triceps Extension · 1×6-10 · tempo 20X0 · rest 90s
- Hammer Curls · 1×6-10 · tempo 20X0 · rest 90s

#### Lower B — Hinge · Judgment (dow 4)

- Romanian Deadlift · 3×3-5 · tempo 20X0 · rest 150s
- Paused Squat · 2×6-10 · tempo 20X0 · rest 90s
- Hip Thrusts · 1×6-10 · tempo 20X0 · rest 90s
- Leg Extensions · 1×6-10 · tempo 20X0 · rest 90s
- Lying Leg Curls · 1×6-10 · tempo 20X0 · rest 90s
- Hack Squat Calf Raises · 1×6-10 · tempo 20X0 · rest 90s
- Ab Wheel · 1×6-10 · tempo 20X0 · rest 90s

#### Upper B — Press/Pull · Judgment (dow 5)

- Standing Military Press · 3×3-5 · tempo 20X0 · rest 150s
- Assisted Pull-ups · 2×6-10 · tempo 20X0 · rest 90s
- Incline DB Bench Press · 1×6-10 · tempo 20X0 · rest 90s
- Single-Arm Hammer Strength Row · 2×6-10 · tempo 20X0 · rest 90s
- Lateral Raises · 1×6-10 · tempo 20X0 · rest 90s
- Hammer Curls · 1×6-10 · tempo 20X0 · rest 90s
- Cable Triceps Extension · 1×6-10 · tempo 20X0 · rest 90s


## Phases & week-to-week progression

### Wisdom (1–4)
Straight double progression on all slots.

### Discipline (5–8)
Primary → top-set-backoff: top **4–6**, backoff −10%, backoff sets = sets−1, backoff reps **6–8**, +2.5 kg.

### Command (9–11)
Top **3–5**, backoff reps **5–7**.

### Judgment (12)
Primary capped ≤3 sets; accessories −1 set.

## Techniques, supersets, finishers

- `top-set-backoff` technique/progression on primaries from week 5.
- Default tempo `20X0`.
- No supersets.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-athena` |
| `i18nKey` | `athena` |
| `logo` | `/athena.png` |
| `coverBg` | `bg-[#080d14]` |
| `order` | 23 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-athena`):

| Token | HSL |
|---|---|
| `--background` | `214 42% 5%` |
| `--primary` | `42 70% 53%` |
| `--accent` | `42 42% 19%` |
| `--card` | `214 34% 8%` |
| `--ring` | `42 70% 53%` |
| `--signal-text` | `42 78% 70%` |

Palette note: gold on navy.

**Widgets:** `program_status`, `workout_history`.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** |
| Progression handler | **complete** |
| Dashboard | **complete** |
| Verify | `npm run verify:athena` |
| PL “back-offy” | hybrid loanword |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| “edytowalne back-offy” | Hybrid EN | `edytowalne serie zbijające` / `serie odciążające` |
| “Rodziny bojów” | OK gym jargon | keep |
