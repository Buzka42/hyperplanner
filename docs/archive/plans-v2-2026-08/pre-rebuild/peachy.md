# Peachy

**Program ID:** `peachy-glute-plan` · **Source:** [src/data/peachy.ts](../../src/data/peachy.ts) · **Progression:** [src/features/workout/progression/historyEntries.ts](../../src/features/workout/progression/historyEntries.ts) (`peachyProgression`)
**Duration:** 12 weeks · **Frequency:** 4 days/week (Mon / Wed / Fri / Sat)

## Overview

Glute-focused lower/upper hybrid. The only light-pink theme in the app; the dashboard mascot switches from Froggy (weeks 1–4) to Peachy (week 5+).

## Onboarding

- **Stats / 1RMs:** none required for percentage loading (Paused Squat uses Monday squat history or optional `stats.squat` fallback). Day-selection flow shares the peachy path in Onboarding (builds after days, not bench modules).
- **Schedule:** 4 fixed training days (Mon/Wed/Fri/Sat pattern in program).
- **Modules/toggles:** none dedicated.
- **Access:** paid (not `alwaysFree`).

### EN (`onboarding.programs.peachy`)

- **Name:** Peachy
- **Description:** 12-week glute specialization. For those who want a better booty.
- **Features:** Focus: Glutes & Lower · 4 Days / Week · Science-Based Glute Programming

### PL (`onboarding.programs.peachy`)

- **Name:** Peachy
- **Description:** 8-tygodniowy program hipertrofii pośladków. Zbuduj prawdziwą półkę. ← **wrong duration vs code (12 weeks)**
- **Features:** Cel: Pośladki i dół · **5 dni/tydzień** ← **wrong vs code (4 days)** · Programowanie oparte na nauce

## Weekly structure

### Monday – Glute & Leg Heavy

| Exercise | Sets × Reps |
|---|---|
| Sumo Deadlift | 3×5-8 |
| FFE Bulgarian Split Squat | 3×8-12 |
| Squats | 3×5-10 |
| Seated Ham Curl | 3×8-12 |
| Hack Squat Calves | 3×15-20 |

### Wednesday – Glute & Upper Pump

| Exercise | Sets × Reps |
|---|---|
| Kas Glute Bridge | 3×8-12 |
| 45° Hyperextension | 2×15-20 |
| Standing Military Press | 2×8-12 |
| Incline DB Bench | 2×8-12 |
| Inverted Rows | 3×8-12 |
| Side-Lying Rear Delt Fly | 3×12-15 |

### Friday – Posterior Chain

| Exercise | Sets × Reps / notes |
|---|---|
| DB RDL | 3×5-8 |
| **Paused Squat** | 3×5-10 @ **80% of Monday’s squat** |
| GHR (eccentric only) | 3×failure |
| Hip Adduction | 3×8-12 |
| Leg Press Calves | 3×15-20 |

### Saturday – Unilateral & Pump

| Exercise | Sets × Reps |
|---|---|
| Deficit Reverse Lunge | 2×8-12 |
| SL Machine Hip Thrust | 3×12-15 |
| Deficit Push-ups | 3×max |
| Assisted Pull-ups | 2×max |
| Y-Raises | 2×12-15 |
| Lying Cable Lat Raises | 3×12-15 |

**Week 12 Saturday:** adds the 100-rep **Glute Pump Finisher**.

## Phases & week-to-week progression

### Calculations (`calculateWeight`)

- **Paused Squat (Friday):** this week’s Monday squat from `squatHistory` → **80%**, floored to 2.5 kg. Fallback: `stats.squat × percentage` rounded nearest 2.5.
- Everything else: user-entered.

### Advice / progression

- **Squats:** hitting **3×10** last week → “+2.5 kg now.”
- **Other range exercises:** double progression — every set at top of range → “Increase Weight!”
- **Weeks 9–12 intensifier:** Bulgarian Split Squats and Deficit Reverse Lunges → “LAST SET: drop to bodyweight, go to failure”.

### Tracking & badges

- Every “Squats” session logs max completed weight/reps into `squatHistory`.
- **Glute tracker:** weekly circumference (cm) in `gluteMeasurements`; **+3 cm total → Glute Gainz Queen**.
- 48 completed sessions → **Peachy Perfection**; Kas Glute Bridge ≥100 kg → **Kas Glute Bridge 100**; squat +30 kg first→last → **Squat +30 kg**.

## Techniques, supersets, finishers

- Weeks 9–12 bodyweight-to-failure last set on BSS / Deficit Reverse Lunges.
- Week 12 Saturday **100-rep Glute Pump Finisher**.
- GHR eccentric-only to failure.
- No fixed A1/A2 supersets.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-peachy` |
| `i18nKey` | `peachy` |
| `logo` | `/peachy.png` |
| `coverBg` / gradient | `bg-black` / `from-black/90` |
| `order` | 4 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-peachy` — the one light theme):

| Token | HSL |
|---|---|
| `--background` | `340 18% 96%` |
| `--foreground` | `340 72% 10%` |
| `--primary` | `340 82% 42%` |
| `--accent` | `340 55% 92%` |
| `--muted-foreground` | `340 38% 27%` |
| `--destructive` | `0 74% 41%` |
| `--ring` | `340 82% 42%` |
| `--signal-text` | global fallback |

**Widgets:** `glute_tracker`, `strength_chart`, `workout_history`. Weekly Glute Tracker with mini trend chart; Froggy→Peachy mascot swap.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — `PEACHY_CONFIG` |
| Progression hooks | **complete** — `peachyProgression` |
| Dashboard | **complete** — glute tracker + chart |
| Onboarding wiring | **complete** |
| EN translations | **complete** (matches 12 wk / 4 days) |
| PL translations | **wrong facts** — 8 weeks / 5 days (see below) |
| Exercise library / tips | **complete** |
| Verify script | **shared** — `verify:progression` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `8-tygodniowy program…` | Code is **12 weeks** | `12-tygodniowy program hipertrofii pośladków…` |
| `5 dni/tydzień` | Code is **4 days** | `4 dni/tydzień` |
| `Zbuduj prawdziwą półkę` | Natural slang | Keep |
| EN “better booty” | Casual EN; not a PL issue | — |
