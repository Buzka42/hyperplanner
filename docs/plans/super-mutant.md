# Super Mutant

**Program ID:** `super-mutant` · **Source:** [src/data/supermutant.ts](../../src/data/supermutant.ts) · **Progression:** [src/features/workout/progression/superMutant.ts](../../src/features/workout/progression/superMutant.ts) · **Pool helpers:** [src/features/superMutant/pool.ts](../../src/features/superMutant/pool.ts)
**Duration:** 12 build weeks + 2 peak weeks (84 workouts) · **Frequency:** dynamic, capped at 6 sessions per rolling 7 days

## Overview

Fallout-themed high-frequency bodybuilding. There is no fixed calendar: `preprocessDay` calls `generateNextWorkout(user)` every time, building the session from muscle-group **cooldown timers** and a rolling **7-day set-volume** ledger.

## Onboarding

- **Stats / 1RMs:** none required (zeroed). Dedicated `super-mutant-stats` step collects **exercise preferences** only.
- **Preferences:** `quadExercise` (Hack vs Front Squat), `hamstringExercise` (Good Mornings vs Deficit RDLs).
- **Schedule:** fully dynamic; dashboard INITIATE routes to next generated slot (`week = floor(count/6)+1`, `day = count%6+1`).
- **Modules/toggles:** Settings “Skip 24 hours” (dev-labeled) shifts cooldown timestamps back one day.
- **Access:** paid (not `alwaysFree`).

### EN (`onboarding.programs.superMutant`)

- **Name:** Super Mutant
- **Description:** Advanced 12+2 week Fallout-themed high-frequency bodybuilding. Embrace the mutation through pain and iron.
- **Features:** Focus: All muscle groups · Dynamic 4-6 sessions/week · Auto-adaptive cooldown (48h upper / 72h lower) · Reactive volume ~20 sets/muscle/week · Progressive RPE ramp (8→9→9.5→10)

### PL (`onboarding.programs.superMutant`)

- **Name:** Super Mutant
- **Description:** Zaawansowany 12+2 tyg. program kulturystyczny o wysokiej częstotliwości w stylu Fallout. Przyjmij mutację poprzez ból i żelazo.
- **Features:** Cel: Wszystkie grupy mięśniowe · Dynamiczny 4-6 sesji/tydzień · Auto-adaptacyjny system przerw (48h góra / 72h dół) · Reaktywny cel objętości ~20 serii/mięsień/tydzień · Progresywny wzrost RPE (8→9→9.5→10)

Note: implementation intensity wave is **RIR**, not RPE — marketing copy on both languages is slightly mismatched.

## Weekly structure

Not a fixed weekly template. Each workout = **one upper block (always) + one lower block (if off cooldown)**.

| Block | Muscles | Cooldown |
|---|---|---|
| Upper A | Chest, Triceps, Biceps | 48 h |
| Upper B | Back, Shoulders, Calves | 48 h |
| Lower C | Hamstrings, Glutes, Lower Back | 72 h |
| Lower D | Quads, Abductors, Abs | 72 h |

Block choice is **stateless**: among recovered blocks, longest-ago wins (alternates A↔B / C↔D). **10-hour grace** (`isMuscleGroupReady`). Neither upper ready → Rest Day.

**Exercise selection:** chest and back alternate A/B variants (pre-exhaust → main → finisher for chest; 3 movements for back). Quads/hams use onboarding preference.

Typical slot shape: 2–4 sets on primaries (reactive), 2 on pre-exhaust/finishers; RIR from wave; double-progression loads from saved status.

## Phases & week-to-week progression

### Reactive volume (`calculateReactiveSetsForMuscle`)

Target ≈ **20 sets per muscle per week**. Per-exercise sets = `ceil((20 − current7DayVolume) / estimatedMuscleSessionsThisWeek)`, clamped **2–4**. Pre-exhaust/finishers fixed at 2. Muscles already **over 20/7d** (often triceps/biceps/shoulders) dropped from session. “Crank” rule bumps first primary to 4 when projected session under 45 minutes.

**Volume accounting** via `getMuscleContributions(exerciseId)` — exercise-id → muscle shares (1.0 primary, 0.5 assisting). Timestamps restart for every muscle with 1.0 share.

### RIR wave (4-week cycles via `getRIRForWeek`)

| Week in cycle | RIR | Notes |
|---|---|---|
| 1 | 2 | |
| 2 | 1 | |
| 3 | 0 | to failure |
| 4 | past failure | intensifiers (below) |

**Rep ranges** (`getRepRange`): cycles 1–2 → main 8-12 / isolation 10-15; cycles 3–4 → main 10-15 / isolation 15-20.

### Final peak (weeks 13–14)

Reactive volume + RIR wave continue; session cap and cooldowns remain mandatory.

### State & badges

`superMutantStatus`: `completedWorkouts`, `currentCycle`, timestamps, rolling volume, A/B flags, prefs, saved loads, `weeklySessionDates`.

Badges: **Super Mutant Aspirant** (72) · **Behemoth of the Wastes** (84). At 84, INITIATE becomes re-run offer (resets counters/volume/timestamps, keeps history).

## Techniques, supersets, finishers

Week-4-of-cycle intensifiers on every exercise note:

- Main lifts → **Rest-Pause** (fail, 10–15 s, 3–5 more, ×2–3)
- Pre-exhaust → **Dropset** (−20–30%, 2–3 drops)
- Finishers/abs → **Myo-reps** (activation + 3–5 mini-sets)

Chest variant structure includes dedicated finisher movements. No fixed A1/A2 supersets.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-super-mutant` |
| `i18nKey` | `superMutant` |
| `logo` | `/supermutant.png` |
| `coverBg` / gradient | `bg-black` / `from-black/90` |
| `order` | 8 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-super-mutant` — irradiated wasteland):

| Token | HSL |
|---|---|
| `--background` | `210 8% 4%` |
| `--primary` | `120 100% 38%` |
| `--accent` | `30 100% 50%` |
| `--secondary` | `30 90% 45%` |
| `--foreground` | `120 45% 86%` |
| `--ring` | `120 100% 38%` |
| `--signal-text` | global fallback |

**Widgets:** `recovery_gauge`, `mutant_mindset`, `workout_history`. Recovery Gauge (12 muscles ready/soon/cooldown + 7-day sets), Mutagen Exposure X/84, over-mutation warning at ≥6 sessions/7d, rotating Mutant Mindset quote, INITIATE button. Drafts reconciled against regenerated day.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — bespoke reactive generator |
| Progression hooks | **complete** — `superMutantProgression` |
| Dashboard | **complete** — Recovery Gauge + INITIATE |
| Onboarding wiring | **complete** — prefs step (hardcoded EN labels in step UI) |
| EN translations | **complete** (RPE vs RIR mismatch in features) |
| PL translations | **natural** with same RPE/RIR mismatch; onboarding step title still English in component |
| Exercise library / tips | **complete**; contribution map critical |
| Verify scripts | **`npm run verify:supermutant`**, **`verify:supermutant-pool`**, plus `verify:progression` |

## Translation notes

| String | Issue | Suggested PL / fix |
|---|---|---|
| Feature `Progresywny wzrost RPE (8→9→9.5→10)` | Code uses **RIR 2→1→0→past failure** | `Progresywna fala RIR (2→1→0→techniki past-failure)` |
| Same mismatch in EN features | Marketing drift | Align to RIR |
| Onboarding step `Super Mutant Configuration` | Hardcoded English in `Onboarding.tsx` | Wire `t(...)` keys |
| `Przyjmij mutację poprzez ból i żelazo` | Natural thematic | Keep |
