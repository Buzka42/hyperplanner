# Blackout

**Program ID:** `blackout` · **Source:** [src/data/plans/blackout.ts](../../src/data/plans/blackout.ts) · **Engine:** [src/features/blackout/singleSet.ts](../../src/features/blackout/singleSet.ts)
**Duration:** 8 weeks · **Frequency:** 3 full-body days/week (Mon / Wed / Fri)

## Overview

Advanced-only austerity: **exactly one work set per movement**. Warm-up is calibration; the work set is the prescription. Sessions are short but wide (7–8 slots) so the body is still covered twice weekly without stacking sets. Cap enforced in the tree and again in `preprocessDay` (`sets: 1`). Default tempo `20X0`. Rest: systemic **240 s**, else **150 s**.

## Onboarding

- **Stats:** none required.
- **Schedule:** 3 FB days.
- **Modules:** none. Quality + completion reason are mandatory at set log time.
- **Access:** paid. Portfolio: **advanced** only; prerequisites years of training + honest quality assessment.

### EN (`onboarding.programs.blackout`)

- **Name:** Blackout
- **Description:** An advanced 8-week plan of one work set per movement, and nothing wasted.
- **Features:** 3 full-body days · One work set per exercise · Back-off sets are earned, not scheduled · Quality and stop reason are mandatory

### PL (`onboarding.programs.blackout`)

- **Name:** Blackout
- **Description:** Zaawansowany 8-tygodniowy plan: jedna seria robocza na bój i nic ponadto.
- **Features:** 3 dni całego ciała · Jedna seria robocza na ćwiczenie · Serie back-off trzeba zasłużyć · Obowiązkowa jakość i powód zakończenia

## Weekly structure

Every exercise: **1 set**. Quality `clean` / `borderline` / `invalid` and completion reason are mandatory (`isEvaluable`).

### Blackout I — Mon

| Exercise | Reps | Notes |
|---|---|---|
| Hack Squat | 5-8 | systemic · primary |
| Incline DB Bench | 6-10 | primary |
| SA Hammer Row | 8-12 | unilateral |
| RDL | 6-10 | |
| Lateral Raise | 12-15 | failure-approved |
| Leg Extension | 12-15 | failure-approved |
| Hammer Curl | 8-12 | failure-approved |

### Blackout II — Wed

| Exercise | Reps | Notes |
|---|---|---|
| Paused Bench | 4-6 | systemic · primary |
| Hammer Pulldown | 8-12 | primary · failure-approved |
| Leg Press | 8-12 | |
| Seated Ham Curl | 10-15 | failure-approved |
| SA Reverse Pec Deck | 12-15 | failure-approved |
| Cable Tri Ext | 10-15 | failure-approved |
| Hack Calf | 12-20 | failure-approved |

### Blackout III — Fri

| Exercise | Reps | Notes |
|---|---|---|
| FFE Bulgarian Split Squat | 6-10 | uni · primary |
| Seated DB Press | 6-10 | primary |
| Lat Pulldown | 8-12 | |
| Lying Leg Curl | 10-15 | failure-approved |
| Pec Deck | 12-15 | failure-approved |
| Hammer Curl | 10-15 | failure-approved |
| Cable Tri Ext | 10-15 | failure-approved |
| Hack Calf | 12-20 | failure-approved |

## Phases & week-to-week progression

| Phase | Weeks | Change |
|---|---|---|
| Adjustment | 1–2 | Base |
| Blackout | 3–6 | Base |
| Deep | 7–8 | Primary slots → **RPE 10** (never adds a set) |

### Earned back-off (`earnedBackoff`)

Offered only when: evaluable + quality `clean` + met target floor + completion not pain/technical-failure + recovery action `continue`. Then **1 set @ −10%**. Otherwise session ends.

### Stall ladder (`BLACKOUT_STALL_LADDER`)

Fixed order: **recovery-check → repeat → rep-target → exercise-change → add-set**. Last two require confirmation (add-set changes what the plan is).

### Recovery

Recommends next exposure in **1 / 2 / 3 days** — never blocks training; warns of cost if sooner.

### Failure

Allowed only on `FAILURE_APPROVED` (machines / isolation). Loaded squat/hinge patterns: stop at target. Notes state which.

## Techniques, supersets, finishers

- No scheduled techniques / supersets / finishers.
- Back-off is earned, never authored into the day tree.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-blackout` |
| `i18nKey` | `blackout` |
| `logo` | `/blackout.png` |
| `coverBg` | `bg-[#070707]` |
| `order` | 31 |

**CSS:** near-mono — `--background: 0 0% 3%`; `--primary: 60 24% 88%`; `--accent: 60 12% 18%`; `--signal-text: 60 24% 88%`.

**Widgets:** `program_status`, `workout_history`. Engine-only for backoff/stall; generic quality select helps if wired in workout UI.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — single-set enforcement |
| Engine | **complete** — backoff, stall, failure, recovery |
| Dashboard | **missing** specialty UI |
| Onboarding | card complete; no extra modules |
| EN / PL | EN complete; PL keeps English “back-off” |
| Tips | none |
| Verify | `npm run verify:blackout` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `Serie back-off trzeba zasłużyć` | English loan + stiff | `Serie obniżone (back-off) trzeba sobie wypracować` |
| `jedna seria robocza na bój` | “bój” OK for lift | Keep or `na ćwiczenie` for consistency with feature 2 |
| Description | Clear | — |
