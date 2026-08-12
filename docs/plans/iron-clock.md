# Iron Clock

**Program ID:** `iron-clock` · **Source:** [src/data/plans/ironClock.ts](../../src/data/plans/ironClock.ts) · **Progression:** [src/features/ironClock/progression.ts](../../src/features/ironClock/progression.ts)
**Duration:** 8 weeks · **Frequency:** 4 days/week default, or 3-day full body (`scheduleMode`)

## Overview

Density, not load, is the primary overload. Every session opens with one straight-set **anchor** at full rest (180 s), then three timed **density blocks** of curated pairs worked alternately inside one window. Pairs are chosen so both stations sit within reach of each other — not antagonist theory.

Base windows: **A = 600 s**, **B = 480 s**, **C = 360 s**. Compression floors (two thirds): **420 / 300 / 240 s**. Base rounds **4**, max rounds **6**, load step **+2.5 kg**. Default tempo `20X0`.

## Onboarding

- **Stats / 1RMs:** none required.
- **Schedule:** 4-day (Mon/Tue/Thu/Fri) or 3-day (Mon/Wed/Fri). Mode change via `planPreferences['iron-clock'].pendingScheduleChange` takes effect only after the requested week is finished on the calendar **and** in sessions (`effectiveIronClockMode`). Untrained weekdays in 3-day mode become genuine rest (`exercises: []`), never a fourth session.
- **Modules:** none.
- **Access:** paid (not `alwaysFree`). Portfolio: intermediate; frequency `[3, 4]`; fatigue 3; full-gym.

### EN (`onboarding.programs.ironClock`)

- **Name:** Iron Clock
- **Description:** An 8-week plan where the clock, not the plate, is the thing you beat.
- **Features:** 4-day mode or 3-day full body · Density blocks with visible pacing · Reps, then time, then load · Round-by-round quality

### PL (`onboarding.programs.ironClock`)

- **Name:** Iron Clock
- **Description:** 8 tygodni, w których pokonujesz zegar, a nie talerz.
- **Features:** Tryb 4-dniowy lub 3 dni całego ciała · Bloki gęstości z widocznym tempem · Najpierw powtórzenia, potem czas, na końcu ciężar · Ocena jakości po każdej rundzie

## Weekly structure

### Four-day mode

| Day | Session | Anchor (3 sets, rest 180 s) | Density A (600 s) | Density B (480 s) | Density C (360 s) |
|---|---|---|---|---|---|
| Mon | First Bell | Hack Squat 5-8 | Incline DB BP + SA Hammer Row 4×8-10 | Seated Ham Curl 4×10-12 + Lateral Raise 4×12-15 | KB Swing 4×12-15 + Ab Wheel 4×8-12 |
| Tue | Second Bell | Lat Pulldown 6-8 | FFE BSS + Hammer Chest Press 4×8-10 | Hip-supported DB DL 4×8-12 + SA Reverse Pec Deck 4×12-15 | Hack Calf 4×12-20 + Hammer Curl 4×8-15 |
| Thu | Third Bell | Paused Bench 4-6 | Goblet Skater 4×8-12 + Hammer Pulldown 4×8-10 | Leg Ext 4×10-15 + Lat Prayer 4×10-15 | Hammer Curl + Cable Tri Ext 4×8-15 |
| Fri | Final Bell | RDL 5-8 | Hammer Chest + SA Hammer Row 4×8-12 | Deficit Rev Lunge 4×8-12 + Lateral Raise 4×12-20 | Hack Calf 4×12-20 + Cable Tri Ext 4×10-15 |

Density slots use `restSeconds: 0` (rest is managed inside the window). Pair labels `A1/A2`, `B1/B2`, `C1/C2`.

### Three-day mode (`IRON_CLOCK_THREE_DAY`)

| Day | Session | Anchor | Notes |
|---|---|---|---|
| Mon | Iron Clock I | Hack Squat 3×5-8 | Same A/B/C pattern as First Bell |
| Wed | Iron Clock II | Paused Bench 3×4-6 | C2 = Hanging Knee Raise (not Ab Wheel) |
| Fri | Iron Clock III | RDL 3×5-8 | A2 = Lat Pulldown |

## Phases & week-to-week progression

| Phase | Weeks | Default prescription change |
|---|---|---|
| Winding | 1–2 | Base windows, 4 rounds |
| Tension | 3–5 | Density slots: **+1 round** |
| Escapement | 6–7 | +1 round **and** window × **5/6** |
| Benchmark | 8 | Opening windows return (comparable to week 1) |

Phases move the *authored* default only. An athlete whose blocks already compressed keeps ladder state in `ironClockStatus.stage`.

### Density ladder (`advanceDensityBlock`)

On a **valid** completion (target met + quality `clean`):

1. **reps** — +1 round at same load/window (until `maxRounds` = 6)
2. **time** — hold work, compress window by **−60 s** (floor = `minDurationSeconds`)
3. **load** — at floor with full rounds: **+2.5 kg**, requires confirmation
4. **reset** — restore base window + base rounds at the new load

- `borderline`: counts completed, **no** progression
- `invalid`: holds prescription; not eligible as density best
- Rest guide **90 s**; exceeding warns only (`restWarning`) — block still counts

Comparability of history: `strict` / `adapted` / `incomparable` via `compareBlocks` (lineage, load, window). Headline metric: work per minute (`blockDensity`).

## Techniques, supersets, finishers

- Density pairs are timed alternate work, not classic supersets with fixed rest.
- No finishers.
- Anchor uses double progression (+2.5 kg).

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-iron-clock` |
| `i18nKey` | `ironClock` |
| `logo` | `/ironclock.png` |
| `coverBg` / gradient | `bg-[#0e0b07]` / `from-[#0e0b07]` |
| `order` | 26 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-iron-clock`):

| Token | HSL |
|---|---|
| `--background` | `30 16% 5%` |
| `--primary` | `34 68% 52%` |
| `--accent` | `34 44% 20%` |
| `--ring` | `34 68% 52%` |
| `--signal-text` | `36 82% 70%` |

**Widgets:** `program_status`, `workout_history`. Workout UI: **BlockTimer** for density blocks (`WorkoutView` when `programData.id === 'iron-clock'`). Ladder stage annotated in exercise notes when present — no dedicated density dashboard.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — 4-day + 3-day trees, deferred mode switch |
| Progression | **engine complete** — ladder pure functions; save-time persistence partial (notes annotate stage; not in `PROGRESSION_HANDLERS`) |
| Dashboard | **partial** — shared widgets + BlockTimer; no specialty density UI |
| Onboarding | **complete** for schedule mode; no seed stats |
| EN / PL | **complete** and factually aligned |
| Tips | none under this i18n key |
| Verify | `npm run verify:iron-clock` → `scripts/verify-iron-clock.ts` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| Product name “Iron Clock” | Brand kept EN (intentional) | Keep |
| Features / description | Natural, accurate | — |
