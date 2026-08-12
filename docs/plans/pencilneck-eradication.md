# Pencilneck Eradication Protocol

**Program ID:** `pencilneck-eradication` · **Source:** [src/data/pencilneck.ts](../../src/data/pencilneck.ts) · **Progression:** [src/features/workout/progression/historyEntries.ts](../../src/features/workout/progression/historyEntries.ts) (`pencilneckProgression`)
**Duration:** 8 weeks per cycle, repeatable (Cycle 2+ changes the rules) · **Frequency:** 4 days/week (Push A / Pull A / rest / Push B / Pull B)

## Overview

Classic hypertrophy push/pull split with legs folded into each day. All loading is **user-driven double progression** — the app never calculates working weights; it only advises when to add.

## Onboarding

- **Stats / 1RMs:** none required (zeroed lifting stats at registration).
- **Schedule:** fixed 4-day pattern (days 1, 2, 4, 5); day selection via onboarding days step where applicable.
- **Modules/toggles:** exercise preference swaps in Settings (Hack Squat ↔ High-Foot Leg Press; Pec Deck ↔ Low-to-High Cable Flyes; Front Squats ↔ Narrow-Stance Leg Press ↔ Stiletto Squats).
- **Access:** paid (not `alwaysFree`).

### EN (`onboarding.programs.pencilneck`)

- **Name:** Pencilneck Eradication
- **Description:** 8-week upper body hypertrophy split. For those who look like a lollipop.
- **Features:** Focus: Upper Body Mass · 4 Days / Week · Push / Pull Split

### PL (`onboarding.programs.pencilneck`)

- **Name:** Protokół Pencilneck
- **Description:** 8-tygodniowy split na górę ciała. Dla tych, których szyja wygląda jak ołówek.
- **Features:** Cel: Hipertrofia upper body · 4 dni/tydzień · Split Push / Pull

## Weekly structure

Identical every week within a cycle:

### Day 1 – Push A

| Exercise | Sets × Reps |
|---|---|
| Flat BB Bench | 3×8-12 |
| Incline DB Press | 3×10-14 |
| Cable Flyes | 3×12-15 |
| Seated DB Shoulder Press | 3×8-12 |
| Leaning Lateral Raises | 3×15-20 |
| Overhead Tricep Ext | 3×12-15 |
| Hack Squat | 3×10-15 |
| Leg Extensions | 3×15-20 |
| Leg Press Calves | 3×12-18 |

### Day 2 – Pull A

| Exercise | Sets × Reps |
|---|---|
| Hammer Pulldown | 3×8-12 |
| Seated Cable Row | 3×10-14 |
| Lat Prayer | 3×12-15 |
| Wide Grip BB Row | 3×10-15 |
| Side-Lying Rear Delt Flyes | 3×15-20 |
| Preacher Curls | 3×10-15 |
| RDL | 3×8-12 |
| Lying Leg Curls | 3×12-16 |
| Hanging Leg Raises | 3×12-20 |

### Day 4 – Push B

| Exercise | Sets × Reps |
|---|---|
| Incline BB Bench | 3×8-12 |
| Flat DB Press | 3×10-14 |
| Pec Deck | 3×12-15 |
| Standing Military Press | 3×8-12 |
| Laterals | 3×15-20 |
| Close-Grip Bench | 3×10-14 |
| Front Squats | 3×10-15 |
| Walking Lunges | 3×12-16 |
| Hack Calf Raises | 3×15-20 |

### Day 5 – Pull B

| Exercise | Sets × Reps |
|---|---|
| Lat Pulldown (neutral) | 3×10-14 |
| SA Hammer Row | 3×10-14 |
| SA DB Row | 3×12-15 |
| Rear-Delt Rope Pulls | 3×20-30 |
| Machine Rear Delt Fly | 3×15-20 |
| Incline DB Curls | 3×12-15 |
| Stiff-Legged DL | 3×10-14 |
| Seated Leg Curls | 3×12-16 |
| Ab Wheel | 3×failure |

Rest / tempo / RPE: user-entered loads; no percentage prescriptions. Compounds use standard rest; isolation shorter as typical BB practice (not hard-coded per slot in all cases).

## Phases & week-to-week progression

`preprocessDay` phase logic:

- **Weeks 1–4 (Volume):** rep ranges as above.
- **Weeks 5–8 (Heavy):** every exercise in `COMPOUND_EXERCISES` → **6–10 reps** (isolation untouched). Swapped-in exercises not in the set keep high reps.
- **Intensity techniques:** last set of each compound gets “Drop Set or Rest-Pause to Failure”:
  - Cycle 1: weeks 7–8 only
  - Cycle 2+: all 8 weeks
- **Week 8 Day 4 Final Exam:** bonus Leaning Lateral failure + drop set; 100-rep Rear Delt Burnout.

### Progression (`getExerciseAdvice` + `pencilneckProgression`)

- **Double progression:** all sets at **top of rep range** → “Increase weight!” next session. Weights always user-entered.
- **Week 5 heavy-phase seeding:** scan last ~5 logs for best completed weight → suggest **max × 1.15**, floored to 2.5 kg.
- **Cycle 2 Week 1 reload:** Cycle 1 Week 8 max × **0.87 (compounds) / 0.92 (isolation)**, never below Cycle 1 Week 1 × **1.10**; floored to 2.5 kg.
- Cycle context smuggled into exercise IDs as `-c{n}` so advice can tell cycles apart.
- **Bench e1RM:** every Flat BB Bench session stores best Epley e1RM in `pencilneckBenchHistory` (20/30 kg jump badges).

### Completion

Finishing Week 8 Pull B → `pencilneckStatus.completed`, victory screen, **Certified Boulder**. Cycle 1 offers “Start Cycle 2”; Cycle 2 points at trainer contact.

## Techniques, supersets, finishers

- Drop set / rest-pause on last compound set (phase-gated).
- Week 8 Final Exam: lateral failure + drop; **100-rep Rear Delt Burnout**.
- No fixed supersets in the static template.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-pencilneck` |
| `i18nKey` | `pencilneck` |
| `logo` | `/pencilneck.png` |
| `coverBg` / gradient | `bg-black` / `from-black/90` |
| `order` | 2 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-pencilneck` — blood red on black):

| Token | HSL |
|---|---|
| `--background` | `210 8% 4%` |
| `--primary` | `0 72% 51%` |
| `--accent` | `0 0% 88%` |
| `--card` | `0 14% 9%` |
| `--ring` | `0 72% 51%` |
| `--signal-text` | global fallback (no plan override) |

**Widgets:** `pencilneck_commandments`, `program_status`, `trap_barometer`, `workout_history`. Dashboard: Commandments list, Trap Barometer (week/8), weekly status quotes.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — bespoke `PENCILNECK_CONFIG` |
| Progression hooks | **complete** — `pencilneckProgression` |
| Dashboard | **complete** — commandments + trap barometer |
| Onboarding wiring | **complete** — no 1RMs; preference swaps |
| EN translations | **complete** |
| PL translations | **calqued** — “Hipertrofia upper body” mixes EN |
| Exercise library / tips | **complete**; swaps use preference keys |
| Verify script | **shared** — `verify:progression` (no plan-specific script) |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `Cel: Hipertrofia upper body` | English fragment | `Cel: hipertrofia górnej części ciała` |
| `Split Push / Pull` | Fine as gym jargon; optional | `Split push/pull` or `Dzień pchania / ciągnięcia` |
| Name `Protokół Pencilneck` | Brand OK | Keep; optional full `Protokół Eradykacji Pencilneck` |
