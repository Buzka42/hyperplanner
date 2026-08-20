# Tenfold

**Program ID:** `tenfold` · **Source:** [src/data/plans/tenfold.ts](../../src/data/plans/tenfold.ts)
**Duration:** 8 weeks · **Frequency:** 4 days/week — exactly one 10×10 lift per session

## Overview

German Volume Training derivative. **Exactly one** priority exercise per session is **10×10** @ 90s rest, tempo `40X0`, with note: hold load until all ten sets hit ten. Accessories stay normal so the split remains survivable and still hits ~2×/week exposures.

## Onboarding

- **Stats:** none.
- **Access:** paid.
- **Schedule:** selectable=true; suggested splits (dow): 1-2-4-5; 1-3-5-6; 2-4-6-7.
- **Irregular templates:** 2on-1off, 3on-1off, every-other-day.

### EN (`onboarding.programs.tenfold`)

- **Name:** Tenfold
- **Description:** 8 weeks of German Volume Training. Ten sets of ten on exactly one lift per session.
- **Features:**
  - Focus: Hypertrophy through volume
  - 4 Days / Week
  - One ten-set lift per session, never two
  - Hold the load until all ten sets hit ten
  - Back half trades a set for load

### PL (`onboarding.programs.tenfold`)

- **Name:** Dziesięciokrotność
- **Description:** 8 tygodni German Volume Training. Dziesięć serii po dziesięć na dokładnie jednym boju w sesji.
- **Features:**
  - Cel: Hipertrofia przez objętość
  - 4 dni / tydzień
  - Jeden bój na 10 serii w sesji, nigdy dwa
  - Trzymaj ciężar, aż wszystkie dziesięć serii da dziesiątkę
  - Druga połowa zamienia serię na ciężar

## Weekly structure

### Weeks 1–5 (5 weeks)

#### Chest Tenfold · Ten Sets (dow 1)

- Hammer Chest Press · 10×10 · tempo 40X0 · rest 90s · — Hold the load until all ten sets reach ten reps. Only then add weight.
- Hammer Upper Row · 4×8-12 · rest 120s
- Cable Lateral Raise · 3×12-20 · rest 60s
- Cable Triceps Extension · 3×10-15 · rest 60s
- Cable Curl · 3×10-15 · rest 60s

#### Quad Tenfold · Ten Sets (dow 2)

- Hack Squat · 10×10 · tempo 40X0 · rest 90s · — Hold the load until all ten sets reach ten reps. Only then add weight.
- Seated Ham Curl · 4×8-12 · rest 105s
- Standing Calf Raises · 4×12-20 · rest 60s
- Cable Crunch · 3×12-20 · rest 60s
- Pec Deck · 3×10-15 · rest 75s

#### Back Tenfold · Ten Sets (dow 4)

- Hammer Lower Row · 10×10 · tempo 40X0 · rest 90s · — Hold the load until all ten sets reach ten reps. Only then add weight.
- Incline DB Bench Press · 4×8-12 · rest 120s
- Machine Rear Delt Fly · 3×15-20 · rest 60s
- Dumbbell Hammer Curl · 3×10-15 · rest 60s
- Rope Pressdown · 3×10-15 · rest 60s

#### Hamstring Tenfold · Ten Sets (dow 5)

- Seated Ham Curl · 10×10 · tempo 40X0 · rest 90s · — Hold the load until all ten sets reach ten reps. Only then add weight.
- Heel-Elevated Goblet Squat · 4×10-15 · rest 90s
- Hip-Supported Dumbbell Deadlift · 3×10-15 · rest 120s
- Standing Calf Raises · 4×12-20 · rest 60s
- Ab Wheel · 3×8-15 · rest 60s
- Lat Pulldown (Neutral) · 3×8-12 · rest 105s
- Seated Dumbbell Lateral Raise · 3×12-20 · rest 60s

### Weeks 6–8 (3 weeks)

#### Chest Tenfold · Consolidation (dow 1)

- Hammer Chest Press · 8×8-10 · tempo 40X0 · rest 90s · — Eight sets now. Push the load rather than the count.
- Hammer Upper Row · 4×8-12 · rest 120s
- Cable Lateral Raise · 3×12-20 · rest 60s
- Cable Triceps Extension · 3×10-15 · rest 60s
- Cable Curl · 3×10-15 · rest 60s

#### Quad Tenfold · Consolidation (dow 2)

- Hack Squat · 8×8-10 · tempo 40X0 · rest 90s · — Eight sets now. Push the load rather than the count.
- Seated Ham Curl · 4×8-12 · rest 105s
- Standing Calf Raises · 4×12-20 · rest 60s
- Cable Crunch · 3×12-20 · rest 60s
- Pec Deck · 3×10-15 · rest 75s

#### Back Tenfold · Consolidation (dow 4)

- Hammer Lower Row · 8×8-10 · tempo 40X0 · rest 90s · — Eight sets now. Push the load rather than the count.
- Incline DB Bench Press · 4×8-12 · rest 120s
- Machine Rear Delt Fly · 3×15-20 · rest 60s
- Dumbbell Hammer Curl · 3×10-15 · rest 60s
- Rope Pressdown · 3×10-15 · rest 60s

#### Hamstring Tenfold · Consolidation (dow 5)

- Seated Ham Curl · 8×8-10 · tempo 40X0 · rest 90s · — Eight sets now. Push the load rather than the count.
- Heel-Elevated Goblet Squat · 4×10-15 · rest 90s
- Hip-Supported Dumbbell Deadlift · 3×10-15 · rest 120s
- Standing Calf Raises · 4×12-20 · rest 60s
- Ab Wheel · 3×8-15 · rest 60s
- Lat Pulldown (Neutral) · 3×8-12 · rest 105s
- Seated Dumbbell Lateral Raise · 3×12-20 · rest 60s


## Phases & week-to-week progression

### Ten Sets (weeks 1–5)
Priority lifts: Hammer Chest Press, Hack Squat, Hammer Lower Row, Seated Ham Curl — each **10×10**.

### Consolidation (weeks 6–8)
Any 10-set slot → **8×8-10** with note to push load rather than count.

## Techniques, supersets, finishers

- GVT ten-set block; tempo `40X0`.
- No supersets.
- Hold-until-complete progression is instructional (notes), not a separate save-time handler file.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-tenfold` |
| `i18nKey` | `tenfold` |
| `logo` | `/tenfold.png` |
| `coverBg` | `bg-[#0a0808]` |
| `order` | 19 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-tenfold`):

| Token | HSL |
|---|---|
| `--background` | `210 8% 4%` |
| `--primary` | `0 32% 90%` |
| `--accent` | `60 28% 90%` |
| `--card` | `0 0% 8%` |
| `--ring` | `0 32% 90%` |
| `--signal-text` | `(none)` |

Palette note: near-white primary on dark.

**Widgets:** `program_status`, `strength_chart`, `workout_history`.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** |
| Hold-until-complete automation | **notes-only** (no dedicated progression handler) |
| PL “German Volume Training” | left EN inside PL description |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| “German Volume Training” in PL desc | Untranslated jargon | `niemieckiego treningu objętościowego (GVT)` |
| “Dziesięciokrotność” | Literal; a bit stiff | keep brand `Tenfold` or `Dziesiątka` |
