# The Minimum

**Program ID:** `the-minimum` · **Source:** [src/data/plans/theMinimum.ts](../../src/data/plans/theMinimum.ts) · **Bonus:** [src/features/theMinimum/bonus.ts](../../src/features/theMinimum/bonus.ts)
**Duration:** 10 weeks · **Frequency:** 2 required full-body days/week (Mon Session A, Thu Session B)

## Overview

Two mandatory sessions cover every major muscle with **different** movements — the second exposure is a variation, never a repeat. Volume is fixed at **14 sets (A)** and **16 sets (B)**. Weeks 8–9 raise effort (RPE 9 on non-systemic work) instead of adding sets. Default tempo `20X0`. Rest: systemic **150 s**, else **90 s**. Double progression **+2.5 kg**.

Bonus modules live outside the program tree so they cannot become a third required session.

## Onboarding

- **Stats / 1RMs:** none.
- **Schedule:** 2 fixed days (authored Mon/Thu).
- **Modules:** optional bonus templates only (see below) — not onboarding toggles.
- **Access:** paid. Portfolio: beginner + intermediate; frequency `[2]`; fatigue 2; full-gym.

### EN (`onboarding.programs.theMinimum`)

- **Name:** The Minimum
- **Description:** A 10-week plan of two mandatory full-body sessions, with optional bonus work when you have time.
- **Features:** 2 required sessions weekly · 14–16 sets each · Optional underexposure-driven bonuses · Bonus work never gates progress

### PL (`onboarding.programs.theMinimum`)

- **Name:** The Minimum
- **Description:** 10 tygodni: dwie obowiązkowe sesje całego ciała i opcjonalna praca dodatkowa, gdy masz czas.
- **Features:** 2 obowiązkowe sesje tygodniowo · Po 14–16 serii · Opcjonalne bonusy z niedoborów objętości · Bonus nigdy nie warunkuje progresji

## Weekly structure

### Session A — Mon (14 sets)

| Exercise | Sets × Reps | Notes |
|---|---|---|
| Hack Squat | 2×6-10 | systemic |
| Romanian Deadlift | 2×6-10 | systemic |
| Incline DB Bench | 2×6-10 | |
| SA Hammer Row | 2×8-12 | unilateral |
| Lateral Raise | 2×12-15 | |
| Hammer Curl | 1×8-12 | |
| Cable Triceps Extension | 1×8-15 | |
| Hack Calf Raise | 1×12-20 | |
| Ab Wheel | 1×8-12 | |

### Session B — Thu (16 sets)

| Exercise | Sets × Reps | Notes |
|---|---|---|
| Leg Press | 2×8-12 | systemic |
| Seated Hamstring Curl | 2×10-15 | |
| Hammer Chest Press | 2×8-12 | |
| Lat Pulldown | 2×8-12 | |
| Seated DB Shoulder Press | 2×8-12 | |
| SL Machine Hip Thrust | 1×10-15 | unilateral |
| Cable Curl | 1×10-15 | |
| Rope Pressdown | 1×10-15 | |
| Leg Press Calf Raise | 1×12-20 | |
| Hanging Knee Raise | 1×10-15 | |

No slot ID repeats across A and B.

## Phases & week-to-week progression

| Phase | Weeks | Change |
|---|---|---|
| Establish | 1–3 | Base prescription |
| Build | 4–7 | Base (load via double progression) |
| Press | 8–9 | Non-systemic slots → **RPE 9** (no set increase) |
| Confirm | 10 | Base |

**Volume never grows.** Progression is double (+2.5 kg when all sets hit top of range).

### Bonus modules (`BONUS_MODULES`)

| id | Muscles | Exercises | Sets | Systemic cost |
|---|---|---|---|---|
| `upper-pull` | lats, biceps, rearDelt | Hammer Pulldown, SA Rev Pec Deck, Hammer Curl | 6 | 1 |
| `upper-push` | chest, frontDelt, triceps | Hammer Chest, Lateral Raise, Cable Tri | 6 | 1 |
| `posterior` | hamstrings, glutes | Seated Ham Curl, SL Hip Thrust | 6 | 2 |
| `quads-calves` | quads, calves | Leg Ext, Hack Calf | 6 | 1 |
| `trunk-delts` | abs, sideDelt | Ab Wheel, Lateral Raise | 5 | 0 |

- Recommended **1 bonus/week** (not a hard cap).
- Offered by underexposure over the trailing fortnight.
- If last required session declined this week → discouraged in copy, **never blocked**.
- Counts toward volume/history/profile; **never** gates required-session progression.
- `preprocessDay` only annotates; it must not edit required sets.

## Techniques, supersets, finishers

None. Straight sets only.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-the-minimum` |
| `i18nKey` | `theMinimum` |
| `logo` | `/minimum.png` |
| `coverBg` / gradient | `bg-[#0a0d0d]` / `from-[#0a0d0d]` |
| `order` | 27 |

**CSS tokens** (`.theme-the-minimum`):

| Token | HSL |
|---|---|
| `--background` | `180 10% 5%` |
| `--primary` | `6 74% 55%` |
| `--accent` | `6 48% 20%` |
| `--signal-text` | `6 84% 71%` |

**Widgets:** `program_status`, `workout_history`. No specialty bonus dashboard.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — fixed 2-day tree, phase RPE |
| Progression | **generic double** — no dedicated handler; bonus engine complete |
| Dashboard | **minimal** — shared widgets only |
| Onboarding | **complete** for card; no seed stats / bonus UI step |
| EN / PL | **complete**; PL “Po 14–16 serii” slightly terse |
| Tips | none |
| Verify | `npm run verify:minimum` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `Po 14–16 serii` | Ambiguous (per session vs total) | `Po 14–16 serii na sesję` |
| Product name EN | Intentional brand | Keep |
| Rest of features | Clear and accurate | — |
