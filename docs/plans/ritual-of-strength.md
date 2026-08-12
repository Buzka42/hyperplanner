# Ritual of Strength

**Program ID:** `ritual-of-strength` · **Source:** [src/data/ritual.ts](../../src/data/ritual.ts) · **Progression:** [src/features/workout/progression/ritual.ts](../../src/features/workout/progression/ritual.ts)
**Duration:** 16 weeks (4-week ramp-in + 12-week main phase; purge weeks insert into the calendar) · **Frequency:** 3 days/week (Mon / Wed / Fri pattern)

## Overview

Cult-themed powerlifting frequency program: every session touches all three lifts — one at max effort, the other two light — plus user-chosen accessories. Optional ramp-in for first-timers.

## Onboarding

- **First-program question:** `isFirstProgram` true → weeks 1–4 ramp-in; false → `preprocessDay` jumps to week-5 content.
- **Stats / 1RMs:** ritual bench, squat, deadlift 1RMs → `ritualStatus`.
- **Schedule:** 3 days/week ideal Mon/Wed/Fri.
- **Modules:** up to 3 **user-selected accessories** per day type in Settings → Ritual Accessories (`ritualStatus.ritualAccessories`).
- **Access:** paid (not `alwaysFree`).

### EN (`onboarding.programs.ritualOfStrength`)

- **Name:** Ritual of Strength
- **Description:** 3 day/week minimum effective dose powerlifting program.
- **Features:** Focus: Bench / Deadlift / Squat · 3 Days / Week (Mon/Wed/Fri ideal) · 16 Week Program (with optional 4-week ramp-in) · ME singles + RPE based progression

### PL (`onboarding.programs.ritualOfStrength`)

- **Name:** Rytuał Siły
- **Description:** 3 dni/tydzień **prograu** trójboju siłowego z minimalną efektywną dawką. ← **typo**
- **Features:** Cel: Wycisk / Martwy / Przysiad · 3 dni/tydzień (Pon/Śr/Pt idealnie) · 16 tyg. (z opcjonalną 4-tyg. rozgrzewką) · ME single + progresja na podstawie oceny RPE

## Weekly structure

### Phase 1: Ramp-In (Weeks 1–4, first-timers)

Each week: Day 1 bench focus, Day 2 squat focus, Day 3 deadlift focus, each with 2 accessories (rows/face pulls, ham curls/leg extensions, farmer holds/ab wheel).

| Week | Prescription |
|---|---|
| 1 | 3×9 @ **70%** of 1RM |
| 2 | 3×6 @ **80%** |
| 3 | 3×3 @ **90%** |
| 4 | **Ascension Test** — 1 AMRAP @ **85%** + 3×5 back-down @ 80% of AMRAP weight (= 68% of 1RM). Epley replaces stored 1RM |

### Phase 2: Main Phase (Weeks 5–16)

Every session (rotating which lift is ME):

- **ME lift:** 1 heavy single @ ~**95%** of current 1RM (+ accumulated ME progression)
- **Other two lifts (Light):** 3×5 @ **70%** — velocity work
- Day 3 adds Farmer Holds 3×20-30 s
- Up to 3 accessories per day type at 3×10-12 (bench: rows/rear delts/tricep ext/face pulls; squat: ham curls/leg ext/hip thrusts/calves; deadlift: shrugs/pull-aparts/ab wheel/planks)

**Ascension Tests** every 4 weeks (8, 12, 16): AMRAP @ 85% + back-downs, Epley 1RM update. Day names for weeks 8/16 are normal Bench/Squat/Deadlift (not “Purge Day”).

Purge/deload weeks insert as schedule weeks **9, 14, and 19**, with underlying training-week mapping preserved.

## Phases & week-to-week progression

Applied in `ritualProgression` / save path:

- **Ascension Test 1RM update:** gated by exercise name containing “Ascension Test” (weeks 4/8/12/16). Also **resets that lift’s ME checkbox bonus to 0**.
- **ME singles auto-PR:** successful single heavier than stored 1RM (floored 2.5) overwrites it.
- **Checkbox progression:** “RPE ≤9 with perfect form?” → **+2.5 kg** next ME; “exceptionally easy” upgrades to **+5 kg**. Per-lift: `benchMEProgression / squatMEProgression / deadliftMEProgression` added on top of 95%.
- **Velocity check on Light work:** slow bar speed persists per-lift reduction → next light **65%** instead of 70%; successful work clears it.

### State

`ritualStatus`: three 1RMs, `currentWeek`, `completedWorkouts`, `isFirstProgram`/`rampInComplete`, weak points, accessory picks, ME progressions, `lastAscensionWeek`, `lastDeloadWeek`.

### Badges

Initiate of Iron · Disciple of Pain · Acolyte of Strength · High Priest of Power · Eternal Worshipper.

## Techniques, supersets, finishers

- ME singles + light velocity work triad.
- Farmer Holds timed holds on Day 3.
- Ascension AMRAP + back-downs.
- No supersets in the core template; accessories are straight sets.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-ritual` |
| `i18nKey` | `ritualOfStrength` |
| `logo` | `/ritual.png` |
| `coverBg` / gradient | `bg-black` / `from-black/90` |
| `order` | 7 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-ritual` — candlelit black, deep red):

| Token | HSL |
|---|---|
| `--background` | `210 8% 4%` |
| `--primary` | `0 80% 42%` |
| `--accent` | `20 70% 45%` |
| `--card` | `0 8% 8%` |
| `--ring` | `0 80% 42%` |
| `--signal-text` | global fallback |

**Widgets:** `strength_altar`, `program_status`, `workout_history`. **Strength Altar** — three candles for bench/squat/deadlift 1RMs. Tagline via `tips.ritualDashboardTagline`.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — `RITUAL_CONFIG` |
| Progression hooks | **complete** — `ritualProgression` |
| Dashboard | **complete** — Strength Altar |
| Onboarding wiring | **complete** — first-program gate + 1RMs + accessories |
| EN translations | **complete** |
| PL translations | **typo** in description (`prograu`); otherwise natural |
| Exercise library / tips | **complete** |
| Verify script | **shared** — `verify:progression` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `3 dni/tydzień prograu trójboju…` | Typo **prograu** | `3 dni/tydzień programu trójboju siłowego z minimalną efektywną dawką.` |
| `4-tyg. rozgrzewką` for ramp-in | “Warm-up” undersells ramp-in | `4-tyg. fazą wprowadzającą` |
| `ME single` | Gym jargon OK | Optional `seria maksymalna (ME)` |
| Dashboard PL tagline `ofiara dla bogów żelaza` | Dramatic; OK for theme | Keep |
