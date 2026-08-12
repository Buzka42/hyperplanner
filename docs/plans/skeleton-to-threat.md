# From Skeleton to Threat

**Program ID:** `skeleton-to-threat` · **Source:** [src/data/skeleton.ts](../../src/data/skeleton.ts) · **Progression:** [src/features/workout/progression/skeleton.ts](../../src/features/workout/progression/skeleton.ts)
**Duration:** 12 weeks · **Frequency:** user-selected days (every selected day is the same full-body session; onboarding targets **3** days)

## Overview

Beginner full-body program. The week grid is generated empty; `preprocessDay` injects the same six-exercise (+ plank) session into every day the user selected during onboarding, and marks everything else Rest & Recovery.

## Onboarding

- **Stats / 1RMs:** none (blank lifting stats).
- **Schedule:** selectable days; target count **3** (`selectedProgramId === SKELETON` uses `targetCount = 3`). Every selected weekday gets the identical session.
- **Modules/toggles:** none.
- **Access:** paid (not `alwaysFree`).

### EN (`onboarding.programs.skeleton`)

- **Name:** From Skeleton to Threat
- **Description:** 12-week beginner program. For those who have never touched a weight.
- **Features:** Focus: Full Body · 3 Days / Week · Flexible Schedule

### PL (`onboarding.programs.skeleton`)

- **Name:** Od Szkieleta do Zagrożenia
- **Description:** 12-tygodniowy program dla początkujących. Dla tych, którzy nigdy nie ruszyli żelastwa.
- **Features:** Cel: Hipertrofia całego ciała · 3 dni/tydzień · Elastyczny grafik

## Weekly structure

Same session every training day:

| # | Exercise | Sets | Reps / notes |
|---|---|---|---|
| 1 | Deficit Push-ups | 3 | AMRAP |
| 2 | Leg Extensions | 3 (+1 from W9) | 12–20 |
| 3 | Supported Stiff-Legged DB Deadlift | 3 (+1 from W9) | 10–15 |
| 4 | Standing Calf Raises | 3 (+1 from W9) | 15–20 |
| 5 | Inverted Rows | 2 (+1 from W9) | 8–15 |
| 6 | Overhand Mid-Grip Pulldown | 2 (+1 from W9) | 10–15 |
| 7 | Planks | 3 | time target (starts 30s) — weight input disabled |

**Late-phase volume:** from **Week 9**, every exercise except push-ups and Planks gets +1 set (`getSets`).

Tempo / rest / RPE: not percentage-based; beat-your-log advice drives load. Planks are time-only.

## Phases & week-to-week progression

### Planks (time-based)

- Target starts at **30 seconds**, stored in `skeletonStatus.plankTargetSeconds`.
- Rendered into `target.reps` (e.g. `"30sec"`).
- On save, if **all sets** hit the current target → `plankTargetSeconds` **+10** (`skeletonProgression` / save path).
- Advice: “Add 10 seconds from last session!” when all sets meet target.

### Other exercises (`getExerciseAdvice`)

No calculated weights:

| Exercise | Progression cue |
|---|---|
| Deficit Push-ups | “Try to beat: {last max reps}” |
| Leg Extensions | all sets ≥20 → “+7 kg” |
| Supported SLDL | all sets ≥15 → “+2.5 kg” if already ≥10 kg/hand, else “+1 kg each dumbbell” |
| Standing Calf Raises | all sets ≥20 → “switch to single-leg”; Single-Leg at 20s → “+5 kg dumbbell” |
| Inverted Rows | all sets ≥15 → “go deeper — decrease body angle” |
| Pulldown | all sets ≥15 → “+7 kg” |

Both modern (`exercises[].setsData`) and legacy (`setResults`) log formats are handled.

### Completion

Saving on the **highest selected day of Week 12** → `skeletonStatus.completed`, victory screen, **Certified Threat**, trainer-contact follow-up.

## Techniques, supersets, finishers

- N/A — straight sets only; no supersets, drop sets, or timed finishers beyond plank holds.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-skeleton` |
| `i18nKey` | `skeleton` |
| `logo` | `/SKELETON.png` |
| `coverBg` / gradient | `bg-black` / `from-black/90` |
| `order` | 3 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-skeleton` — toxic green over dark rot):

| Token | HSL |
|---|---|
| `--background` | `210 8% 4%` |
| `--primary` | `110 90% 45%` |
| `--accent` | `0 70% 42%` (blood red contrast) |
| `--secondary` | `0 55% 14%` |
| `--ring` | `110 90% 45%` |
| `--signal-text` | global fallback |

**Widgets:** `skeleton_countdown`, `skeleton_pushup_max`, `skeleton_quotes`, `workout_history`. Metamorphosis countdown (weeks remaining), Deficit Push-up PR (max reps any set), rest-day quotes.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — `SKELETON_CONFIG` + `preprocessDay` injection |
| Progression hooks | **complete** — `skeletonProgression` |
| Dashboard | **complete** — countdown / PR / quotes |
| Onboarding wiring | **complete** — 3-day selectable schedule |
| EN translations | **complete** |
| PL translations | **natural** for card copy |
| Exercise library / tips | **complete** for beginner stack |
| Verify script | **shared** — `verify:progression` |

## Translation notes

PL onboarding card reads naturally. Minor optional polish:

| String | Note |
|---|---|
| `nigdy nie ruszyli żelastwa` | Idiomatic; OK |
| Feature `Cel: Hipertrofia całego ciała` | EN says “Full Body” (broader than hypertrophy) — acceptable |
| No calques flagged in program card | — |
