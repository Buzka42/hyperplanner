# Pain & Glory

**Program ID:** `pain-and-glory` · **Source:** [src/data/painglory.ts](../../src/data/painglory.ts) · **Progression:** [src/features/workout/progression/painGlory.ts](../../src/features/workout/progression/painGlory.ts)
**Duration:** 16 weeks · **Frequency:** 4 days/week (Pull Mon / Push Tue / Push Thu / Pull Fri)

## Overview

Intermediate **deadlift specialization** built on brutal submaximal volume: 8 weeks of 10×6 deficit snatch-grip pulls, 4 weeks of E2MOM conventional work, then a 4-week peak to a max single.

## Onboarding

- **Stats / 1RMs:** required **conventional deadlift 1RM** and **low-bar squat 1RM** (dedicated Pain & Glory calibration screen).
- **Schedule:** fixed Pull/Push/Push/Pull; onboarding shows schedule note (localized).
- **Modules/toggles:** none.
- **Access:** paid (not `alwaysFree`).

### EN (`onboarding.programs.painGlory`)

- **Name:** Pain & Glory
- **Description:** Pain today, glory tomorrow.
- **Features:** Focus: Heavy Deadlifting · 4 Days / Week - Pull/Push · 16 Week Program with Peaking · Self-regulating via RPE feedback

### PL (`onboarding.programs.painGlory`)

- **Name:** Pain & Glory
- **Description:** 16-tygodniowy program specjalizacyjny na martwy ciąg. Dziś ból, jutro chwała.
- **Features:** Cel: Siła w martwym ciągu · 4 dni/tydzień - Pull/Push · 16 tyg. z peakingiem · Autoregulacja przez uproszczony system RPE

PL description is richer than EN (EN card is tagline-only).

## Weekly structure

### Phase map (main pull)

| Weeks | Pull Day 1 (Mon) | Pull Day 2 (Fri) |
|---|---|---|
| 1–8 | Deficit Snatch Grip DL 10×6 | Deficit Snatch Grip DL 10×6 |
| 9–12 | Deficit Snatch Grip DL 10×6 | Conventional DL **E2MOM 6×3-5** |
| 13 | **AMRAP test** + 3×5 back-down | Conventional DL (CAT) 4×6 |
| 14 | Heavy Triple @ RPE 9 + 3×3 back-down | CAT 4×6 |
| 15 | Heavy Double @ RPE 9.5 + 3×2 back-down | CAT 4×6 |
| 16 | **Heavy Single @ RPE 10** (+ optional 2nd single) | CAT 4×6 |

**Fixed accessories every pull day:** Close Neutral Lat Pulldown 4×6-10, Slow-Eccentric Cheat Nordics 2×failure, SL Machine Hip Thrust 3×8-12, Dead Hang + Planks 3×failure.

**Push days (identical Tue/Thu, all 16 weeks):** Paused Low Bar Squat 4×4-6 @ ~70%, Leg Extensions 3×6-10, Hack Squat Calves 3×15-20, Incline DB Bench 4×6-10, Standing Military Press 3×6-10.

## Phases & week-to-week progression

- **Deficit Snatch Grip:** starts at **45% of `conventionalDeadlift` 1RM**, floored to 2.5 kg. After every session (weeks 1–11) RPE modal:
  - Ready For More → **+5 kg**
  - Good, Maintain → same
  - Wrecked → **−5 kg** (floor 20 kg)
  Running value: `painGloryStatus.deficitSnatchGripWeight`.
- **Paused Low Bar Squat:**
  - W1–4: base = `lowBarSquat × 0.70`; all sets 4–6 → `squatProgress` +2.5 kg
  - Week 5 reset: `(1RM × 1.075) × 0.70` + accumulated progress
  - Week 8 weight saved as `week8SquatWeight`; W9–16 hold **85%** as maintenance
- **Conventional E2MOM (W9–12):** start = **highest deficit × 1.35** (floored). All 6 sets ≥5 reps → `e2momWeightAdjustment` +2.5 kg
- **Week 13 AMRAP:** target = **deficit × 2.22 × 0.85** (floored). Stores `amrapWeight`/`amrapReps`; Epley e1RM (`estimatedE1RM`, floored 2.5) drives peak:
  - W13 back-down: 85% of AMRAP weight
  - W14 triple: **e1RM × 0.90** (back-down ×0.85)
  - W15 double: **e1RM × 0.93** (back-down ×0.875)
  - W16 single: **e1RM × 0.97**
  - CAT (W13–16): **70% of AMRAP weight**
- **Accessories:** double progression advice (top of range → increase). Main lifts excluded from advice (auto-progress).

## Techniques, supersets, finishers

- E2MOM conventional triples (weeks 9–12).
- CAT (compensatory acceleration training) singles/back-offs in peaking.
- Slow-eccentric cheat Nordics to failure; Dead Hang + Planks finisher pair on pull days.
- No A1/A2 supersets in the static push/pull templates.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-pain-glory` |
| `i18nKey` | `painGlory` |
| `logo` | `/painglory.png` |
| `coverBg` / gradient | `bg-black` / `from-black/90` |
| `order` | 5 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-pain-glory`):

| Token | HSL |
|---|---|
| `--background` | `210 8% 4%` |
| `--primary` | `0 68% 48%` |
| `--accent` | `40 65% 55%` (amber/gold) |
| `--card` | `35 26% 13%` |
| `--ring` | `0 68% 48%` |
| `--signal-text` | global fallback |

**Widgets:** `deficit_snatch_tracker`, `workout_history`. **Glory Counter** (total kg across deadlift variations, bar to 50 t) computed on Dashboard.

### Badges

Void Gazer · EMOM Executioner · Deficit Demon · Glory Achieved · Single Supreme · 50 Tonne Club (see prior doc detail / badge definitions in `badges.ts`).

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — `PAIN_GLORY_CONFIG` |
| Progression hooks | **complete** — `painGloryProgression` |
| Dashboard | **complete** — deficit tracker + glory counter |
| Onboarding wiring | **complete** — DL + squat 1RMs |
| EN translations | **partial** — card description is tagline-only |
| PL translations | **natural** (richer than EN); `peakingiem` is a mild loan |
| Exercise library / tips | **complete** for deficit / CAT paths |
| Verify script | **shared** — `verify:progression` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| EN description “Pain today, glory tomorrow.” | Too thin vs PL | Mirror PL: “16-week deadlift specialization…” |
| `16 tyg. z peakingiem` | Loanword | `16 tyg. ze szczytowaniem` |
| Brand name left EN | Intentional | Keep `Pain & Glory` |
