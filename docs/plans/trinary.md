# Trinary

**Program ID:** `trinary` · **Source:** [src/data/trinary.ts](../../src/data/trinary.ts) · **Progression:** [src/features/workout/progression/trinary.ts](../../src/features/workout/progression/trinary.ts)
**Duration:** 27 workouts = 9 blocks × 3 workouts (workout-count based, not calendar) · **Frequency:** flexible; recommended spacing on dashboard

## Overview

**Conjugate-periodization powerlifting.** Every workout trains all three lifts, each under a different effort type, rotating so each lift cycles through Max Effort → Dynamic Effort → Repetition Effort across a block.

## Onboarding

- **Stats / 1RMs:** bench, deadlift, squat 1RMs → `trinaryStatus.bench1RM / deadlift1RM / squat1RM` (also mirrored into stats fields used at registration).
- **Schedule:** flexible 3–4 days/week; no locked weekdays. Accessory day can insert when ≥4 workouts logged in last 7 days.
- **Modules/toggles:**
  - **Max Effort Style** (`meRepMaxStyle`): `3rm` (default) or `1rm`
  - Settings: `reDeadliftVariant` (RDL / Reverse Hyperextensions / Good Mornings), `excludedVariations`, weak-point answers after workouts 9 and 18
- **Access:** paid (not `alwaysFree`).

### EN (`onboarding.programs.trinary`)

- **Name:** Trinary
- **Description:** Conjugate periodization powerlifting. Adapt to your weak points.
- **Features:** Focus: Bench / Deadlift / Squat · Flexible 3-4 Days / Week · 27 Workouts (9 Blocks) · Auto-adapts to weak point selection

### PL (`onboarding.programs.trinary`)

- **Name:** Trinary
- **Description:** Zaawansowana periodyzacja trójboju siłowego na podstawie metody Conjugate z elastycznym grafikiem.
- **Features:** Cel: Wycisk / Martwy / Przysiad · Elastyczny 3-4 dni/tydzień · 27 treningów (9 bloków) · Autoregulacja przez słabe punkty

## Weekly structure

Workout pattern (not calendar days):

| Position in block | ME | DE | RE |
|---|---|---|---|
| Workout 1 | Deadlift | Squat | Bench |
| Workout 2 | Squat | Bench | Deadlift |
| Workout 3 | Bench | Deadlift | Squat |

### Set/rep prescriptions (`getSetTarget`)

- **ME:** from onboarding `meRepMaxStyle`:
  - `3rm` (default): 3×1-3 @ RPE 9
  - `1rm`: 1×1 @ RPE 9
  - Static template always generates `3rm`; `preprocessDay` overrides per user. Progression reads processed `ex.sets <= 1 ? 1 : 3`.
- **DE:** 8×2-3 (speed)
- **RE:** 4×8-12 — deadlift RE movement is user-selectable (below)

## Phases & week-to-week progression

### Loading (`calculateWeight`)

Weight = **lift 1RM × block percentage**, floored to 2.5 kg:

| Blocks | ME | DE | RE |
|---|---|---|---|
| 1–3 | 90% | 60% | 70% |
| 4–6 | 92% | 65% | 75% |
| 7–9 | 95% | 70% | 80% |

Lift inferred from exercise name keywords (bench/press/board…, deadlift/rdl/deficit…, squat/box…).

### Variations & weak points

- Blocks 1–3: ME = competition lifts (Paused Bench / Conventional DL / Low Bar Squat). DE always competition; RE competition except RE deadlift slot.
- After workouts 9 and 18: **weak-point modal** (bench: off-chest / mid-range / lockout; DL: lift-off / over-knees / lockout; squat: bottom / mid-range / lockout) → `selectVariation` with rotation + `excludedVariations`; swap modal override.
- `VARIATION_PERCENTAGES` for first-day suggestion tips only; actual loading still uses block %.

### RE Deadlift movement

Settings: Romanian Deadlift (default), Reverse Hyperextensions, or Good Mornings (`reDeadliftVariant`).

- Reverse Hypers / Good Mornings: `deadlift1RM × RE block %`
- **RDL: fixed 55% of deadlift 1RM** (block-scaled 70–80% would be too heavy for 8–12)
- RE double-progression bonus stacks on all three. Keyword matching includes “hyperextension” / “good morning”.

### Progression

- **ME (on save):** all prescribed sets hit required top reps → RPE selector: ≤7 → **+10 kg** 1RM; 7–8 → **+5**; 8–9 → **+2.5**
- **RE:** all 4×12 → +2.5 kg queued in `reProgressionPending` for that lift’s next RE day
- **DE:** no progression; rides block percentages

### Accessory days & cycle end

- ≥4 workouts in last 7 days → next session can become **accessory day** (upper: triceps/rows/shoulder press/rear delts; lower: leg ext/ham curls/calves/hip thrusts — all 4×8-12). Preference / alternation; `skipNextAccessory` or force from dashboard. Does **not** advance the 27-workout counter.
- **After workout 27:** re-run modal — (A) deload week re-run (50% volume, −25% ME / −15% DE-RE), (B) continue immediately, (C) 4–5 days rest with light accessories. All reset to workout 1, increment `cycleNumber`, re-ask weak points.

## Techniques, supersets, finishers

- Effort-type rotation is the primary “technique.”
- Accessory days are optional density/hypertrophy inserts.
- Deload re-run path cuts ME/DE/RE percentages as above.
- No timed finishers.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-trinary` |
| `i18nKey` | `trinary` |
| `logo` | `/trinary.png` |
| `coverBg` / gradient | `bg-black` / `from-black/90` |
| `order` | 6 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-trinary` — cold steel + jade):

| Token | HSL |
|---|---|
| `--background` | `210 8% 4%` |
| `--primary` | `150 60% 45%` |
| `--accent` | `280 45% 40%` |
| `--card` | `220 14% 11%` |
| `--ring` | `150 60% 45%` |
| `--signal-text` | global fallback |

**UI:** dedicated Trinary dashboard panel — next workout ME/DE/RE preview, 27-workout progress bar, block counter, three 1RMs. Shared widget list may be suppressed for Trinary’s custom view.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — bespoke `TRINARY_CONFIG` |
| Progression hooks | **complete** — `trinaryProgression` |
| Dashboard | **complete** — custom single-workout view |
| Onboarding wiring | **complete** — 1RMs + ME style |
| EN translations | **complete** (+ extended `onboarding.trinary.*` calibration strings) |
| PL translations | **natural** |
| Exercise library / tips | **complete**; variation pool + exclusions |
| Verify script | **shared** — `verify:progression` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `Wycisk / Martwy / Przysiad` | Abbreviated but clear | Optional expand: `Wyciskanie / Martwy ciąg / Przysiad` |
| `metody Conjugate` | Brand term OK | Keep |
| No major calques in program card | — | — |
