# Bench Domination

**Program ID:** `bench-domination` · **Source:** [src/data/program.ts](../../src/data/program.ts) · **Progression:** [src/features/workout/progression/benchDomination.ts](../../src/features/workout/progression/benchDomination.ts)
**Duration:** 16 weeks (15 generated weeks + 1 inserted deload) · **Frequency:** 6 days/week (4 bench days + 2 optional leg days)

## Overview

Flagship bench-press specialization. Everything revolves around a single number — the **Paused Bench base** — seeded from the onboarding 1RM and driven entirely by Saturday AMRAP performance. Daily Undulating Periodization mixes heavy, volume, power, and test days in the same week.

## Onboarding

- **Stats / 1RMs:** required `pausedBench`; optional `wideGripBench`, `spotoPress`, `lowPinPress` (auto-estimated at 92% / 95% / 88% of paused bench if blank).
- **Schedule:** custom training-day selection remaps workouts; rest-critical sessions (Heavy Monday, Saturday AMRAP) are placed on isolated days when possible.
- **Modules (`benchDominationModules`):** tricep giant set, BTN press, weighted pull-ups, accessories (Dragon Flags / Y-Raises / Around-the-Worlds), leg days, Thursday tricep variant (`giant-set` | `heavy-extensions` 4×4-6), `lowPinPressExtraSet`.
- **Access:** paid (not `alwaysFree`); included only when the access key allows the plan id.

### EN (`onboarding.programs.benchDomination`)

- **Name:** Bench Domination
- **Description:** 13-week powerlifting program to explode your bench press, extended with added deload weeks for optimal recovery. Daily Undulating Periodization — build muscle and strength at the same time.
- **Features:** Focus: Bench Strength · 13 Week Core Cycle + Optional 3 Week Peaking · Flexible Duration with deload weeks · 4 Benching days + 2 Lower Body days, optional accessories · Auto-regulating progression based on AMRAP test

### PL (`onboarding.programs.benchDomination`)

- **Name:** Bench Press Domination
- **Description:** 13-tygodniowy program siłowy z fokusem na wyciskanie, rozszerzony o tygodnie odciążeniowe… Daily Undulating Periodization — buduj siłę i masę jednocześnie.
- **Features:** Cel: Siła wyciskania · 13 tygodni cyklu głównego + opcjonalnie 3 tygodnie peakingu · Elastyczny czas trwania… · 4 dni wyciskania + 2 dni dolnej części ciała… · Autoregulacja oparta na teście AMRAP

## Weekly structure

| Day | Session | Bench work |
|---|---|---|
| Monday | Heavy Strength | Paused Bench 4×3 @ 82.5% (85% from W5, 87.5% from W10), Wide-Grip 3×6-8, BTN Press 4×3-5, Tricep Giant Set, Dragon Flags |
| Tuesday | Legs | Lunges, leg press, Nordics, hip thrusts, calves, adduction (toggleable module) |
| Wednesday | Volume Hypertrophy | Paused Bench 4×5-10 @ 72.5%→77.5%, Spoto Press 3×5 @ 72.5%, Weighted Pull-ups, Y-Raises, Around-the-Worlds |
| Thursday | Power / Speed | Paused Bench 5×3-5 @ **65% of last week's AMRAP e1RM** (explosive), Low Pin Press 2×4 @ 77.5%, BTN Press 4×5-8, Tricep Giant Set |
| Friday | Legs | Copy of Tuesday |
| Saturday | AMRAP Test | **Paused Bench AMRAP @ 67.5%**, back-off 3×5, Wide-Grip, Pull-ups, Y-Raises |
| Sunday | Rest | — |

Week 9 is an auto-inserted deload (see below); original weeks 9–15 shift to 10–16.

## Phases & week-to-week progression

### The Base-Weight Engine (`getPausedBenchBase`)

1. **Start:** base = onboarding `stats.pausedBench`.
2. **Weekly AMRAP progression:** each logged Saturday AMRAP is checked against a phased rep threshold. Meeting it adds **+2.5 kg** to the base:
   - Weeks 1–6: ≥12 reps
   - Weeks 7–9: ≥10 reps
   - Weeks 10–12: ≥8 reps
   - Weeks 13+: ≥6 reps
3. **e1RM recalculation** at the start of weeks 5, 9, 13 (after completing weeks 4/8/12): the checkpoint week's AMRAP is run through **Epley** (`e1RM = weight × (1 + reps/30)`), rounded **down** to 2.5 kg, and that becomes the new base. Progressions from before the checkpoint are discarded; only post-checkpoint AMRAPs add +2.5 kg on top.

**Rounding rules** (`calculateWeight`):
- Heavy day (Mon): round to **nearest** 2.5 kg with a safety cap (never round up more than +2.5 kg).
- Volume/AMRAP days (Wed/Sat): round **up** to 2.5 kg so progression is always visible.

`benchHistory` entries store `weight` = calculated e1RM, `actualWeight`/`actualReps` = the real AMRAP set.

### Thursday exception: `getPowerDayBenchBase`

Thursday's Paused Bench is **65% of last week's Saturday AMRAP e1RM**, recalculated fresh every week — it never compounds. Week 1 falls back to onboarding 1RM. Applies to working weight and warm-ups.

### Deloads

- **Forced deload (Week 9):** inserted after Week 8 Saturday. Duplicates Week 8 with **−15% weight and half volume**. Leg deload weights from last completed leg day (−15%, floored to 2.5 kg).
- **Reactive deload:** two consecutive Saturday AMRAPs ≤7 reps (weeks 5–8) triggers early; `preprocessDay` also applies −15%/half-volume when last two AMRAPs were ≤7.
- **Big-drop check:** at Week 5 recalc, if new base dropped >15% vs Week 4's base → extra deload (`drop-recalc`).
- State: `benchDominationStatus.addedDeloadWeeks` / `forcedDeloadCompleted`.

### Week 13 Crossroads & Peaking (Weeks 13–16)

After Week 12 the dashboard forces `post12WeekChoice`:
- **Test now:** Saturday Week 13 = **1RM test** (100–105% of base); weeks 14+ hidden.
- **Peak:** 3-week peaking —
  - Week 14: 4×2 @ ~91% + light technique Saturday (4×3 @ 65%)
  - Week 15: 5×1 @ ~96% + very light technique (3×2-3 @ 60%)
  - Week 16: Monday primer (3×3 @ 50%), **Saturday Judgment Day: 1RM test @ ~105%**

Week 13 selective deload: Monday drops Wide-Grip and triceps; Wed/Thu bench −15%/half volume; Saturday keeps AMRAP/test + pull-ups + delts.

### Accessory progression

- **BTN Press:** seeded at 40% of bench 1RM. Monday driver: all 4 sets top of 3–5 → `btnPress` +2.5 kg (`btnPressWeek` same-week guard). Thursday uses 85% of Monday's weight.
- **Spoto / Low Pin:** all sets hit target → working weight +2.5 kg.
- **Wide-Grip:** **2 consecutive Mondays** at top of 6–8 → +2.5 kg; miss resets `wideGripConsecutive`.
- **Variation heuristic:** stored value >85% of bench 1RM treated as 1RM (percentage applied); else used as working weight.
- **Weighted Pull-ups (EMOM):** W1–3 +2.5 kg EMOM (cap 15 sets); W4–6 fixed 15 kg EMOM 3–5; W7–9 daily max triple + 87.5% back-offs; W10 max single (`pullup1RM`) then 92.5%; W11–13 4×2+ @ 92.5%. Display week buckets use `displayWeek = w >= 9 ? w + 1 : w` after deload insertion.
- **Tricep Giant Set:** dips 5 → rolling extensions 12 → banded skullcrushers 25; 2 rounds (3 from W9).

## Techniques, supersets, finishers

- Tricep Giant Set (or Thursday heavy extensions variant).
- Elite warm-up for Paused Bench / BTN: bar ×8-10 → 50%×5 → 70%×3 → 85%×2 (→ 95%×1 on heavy days). 1RM tests use 75%/88% steps.
- No formal A1/A2 supersets in the static program; intensity is via AMRAP, EMOM pull-ups, and giant sets.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-bench-domination` |
| `i18nKey` | `benchDomination` |
| `logo` | `/benchdomination.png` |
| `coverBg` / gradient | `bg-black` / `from-black/90` |
| `order` | 1 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-bench-domination`):

| Token | HSL |
|---|---|
| `--background` | `210 8% 4%` |
| `--primary` | `262 83% 62%` (violet) |
| `--accent` | `25 95% 53%` (orange) |
| `--card` | `250 22% 10%` |
| `--ring` | `262 83% 62%` |
| `--signal-text` | falls back to global mix from primary (no plan override) |

**Widgets:** `1rm`, `program_status`, `strength_chart`, `workout_history`. Post-week-12 choice UI and bench history chart live on the shared Dashboard.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — bespoke `BENCH_DOMINATION_CONFIG` in `program.ts` |
| Progression hooks | **complete** — `benchDominationProgression` in `PROGRESSION_HANDLERS` |
| Dashboard | **complete** — shared widgets + specialty flows |
| Onboarding wiring | **complete** — stats + modules + day remap |
| EN translations | **complete** |
| PL translations | **partial / calqued** — English product terms retained (`Daily Undulating Periodization`, `peakingu`); name diverges (`Bench Press Domination`) |
| Exercise library / tips | **complete** for core bench variations |
| Verify script | **shared** — `npm run verify:progression`, `verify:registry`, `verify:plans` (no plan-specific `verify:bench`) |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| Name `Bench Press Domination` | Inconsistent with EN / brand | `Dominacja Wyciskania` or keep EN `Bench Domination` |
| `Daily Undulating Periodization` left in English | Calque / jargon dump | `periodyzacja falująca (DUP)` or drop acronym gloss |
| `peakingu` | Loanword with Polish case ending | `szczytowania` / `fazy peaking` |
| Feature “Elastyczny czas trwania: Rozszerzony o…” | Awkward capital mid-sentence | Align casing with other cards |
