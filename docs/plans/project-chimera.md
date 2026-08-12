# Project Chimera

**Program ID:** `project-chimera` · **Source:** [src/data/plans/projectChimera.ts](../../src/data/plans/projectChimera.ts) · **Mutation:** [src/features/projectChimera/mutation.ts](../../src/features/projectChimera/mutation.ts)
**Duration:** 16 weeks (4×4-week blocks) · **Frequency:** 4 days/week upper/lower (Mon / Tue / Thu / Fri)

## Overview

Balanced powerbuilding across six **qualities** — squat, hinge, push, pull, unilateral, hypertrophy. After each block the plan may propose a **mutation**: move volume (never invent it), keep floors, require evidence, and confirm each component separately. Phenotype labels are display-only. Default tempo `20X0`. Rest: systemic **150 s**, else **90 s**.

## Onboarding

- **seedStats:** `squat`, `flatBench`, `conventionalDeadlift` (optional first-exposure seeds).
- **Schedule:** 4 UL days.
- **Modules:** post-block mutation confirmations (`projectChimeraStatus.allocation`, `acceptedExerciseChanges`).
- **Access:** paid. Portfolio: intermediate + advanced; needs 16-week commitment + consistent logging.

### EN (`onboarding.programs.projectChimera`)

- **Name:** Project Chimera
- **Description:** 16 weeks in four blocks, reallocating a little volume toward whatever you actually respond to.
- **Features:** 4 days, upper/lower · Balanced across six qualities · Small, confirmable changes each block · No data means no change

### PL (`onboarding.programs.projectChimera`)

- **Name:** Project Chimera
- **Description:** 16 tygodni w czterech blokach: objętość powoli przesuwa się tam, gdzie faktycznie reagujesz.
- **Features:** 4 dni, góra/dół · Równowaga sześciu cech · Małe, potwierdzane zmiany co blok · Brak danych oznacza brak zmian

## Weekly structure

### Chimera — Upper A (Mon)

| Exercise | Sets × Reps | Quality |
|---|---|---|
| Flat BB Bench | 4×5-8 | push · primary |
| SA Hammer Row | 4×8-12 | pull · uni |
| Seated DB Press | 3×8-12 | push |
| Lat Pulldown | 3×8-12 | pull |
| Lateral Raise | 3×12-15 | hypertrophy |
| Hammer Curl | 2×8-12 | hypertrophy |
| Cable Tri Ext | 2×10-15 | hypertrophy |

### Chimera — Lower A (Tue)

| Exercise | Sets × Reps | Quality |
|---|---|---|
| Barbell Squat | 4×5-8 | squat · systemic · primary |
| RDL | 3×6-10 | hinge |
| FFE BSS | 3×8-12 | unilateral |
| Seated Ham Curl | 3×10-15 | hinge |
| Leg Extension | 3×12-15 | hypertrophy |
| Hack Calf | 3×12-20 | hypertrophy |

### Chimera — Upper B (Thu)

| Exercise | Sets × Reps | Quality |
|---|---|---|
| Hammer Pulldown | 4×8-12 | pull · primary |
| Incline DB Bench | 4×6-10 | push |
| Barbell Row | 3×6-10 | pull |
| Hammer Chest | 3×8-12 | push |
| SA Reverse Pec Deck | 3×12-15 | hypertrophy |
| Cable Tri Ext | 2×10-15 | hypertrophy |
| Hammer Curl | 2×8-12 | hypertrophy |

### Chimera — Lower B (Fri)

| Exercise | Sets × Reps | Quality |
|---|---|---|
| Trap-Bar Deadlift | 4×4-6 | hinge · systemic · primary |
| Leg Press | 3×8-12 | squat |
| Weighted Step-Up | 3×8-10 | unilateral |
| Lying Leg Curl | 3×10-15 | hinge |
| SL Hip Thrust | 3×10-15 | unilateral |
| Hack Calf | 3×12-20 | hypertrophy |

Qualities tagged in slot `notes` / `SLOT_QUALITY`.

## Phases & week-to-week progression

| Block | Weeks | Change |
|---|---|---|
| I | 1–4 | Base |
| II | 5–8 | Primary reps → **4-6** |
| III | 9–12 | Non-primary → **RPE 9** |
| IV | 13–16 | Primary → **3-5**; non-primary RPE 9 |

### Mutation constraints (`proposeMutation`)

| Rule | Value |
|---|---|
| Max reallocation | **±2 weekly sets** per quality per block |
| Floors (`MINIMUM_WEEKLY_SETS`) | squat **4**, hinge **4**, push **6**, pull **6**, unilateral **3**, hypertrophy **6** |
| Evidence floor | **≥3** comparable exposures; &lt;2 usable qualities → no mutation |
| Confirm | each component separately (reallocate vs exercise change) |
| Phenotype | description only — never an input |

`preprocessDay` applies confirmed allocation deltas (±1 set per matching slot, never below 1) and accepted exercise swaps; floors re-checked so stale status cannot strip a quality.

## Techniques, supersets, finishers

None authored. Volume moves between qualities instead.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-project-chimera` |
| `i18nKey` | `projectChimera` |
| `logo` | `/projectchimera.png` |
| `coverBg` | `bg-[#060a07]` |
| `order` | 35 |

**CSS:** `--background: 128 18% 4%`; `--primary: 35 74% 50%`; `--accent: 35 48% 20%`; `--signal-text: 37 84% 68%`.

**Widgets:** `program_status`, `workout_history`. Mutation proposal UI missing as dedicated surface.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** |
| Mutation engine + preprocess | **complete** |
| Dashboard / confirm UI | **missing** |
| Onboarding | seedStats wired |
| EN / PL | complete; “cech” abstract |
| Tips | none |
| Verify | `npm run verify:project-chimera` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `Równowaga sześciu cech` | “cech” vague for qualities | `Równowaga sześciu kategorii (przysiad, hinge, push…)` or `sześciu jakości ruchu` |
| Description | Accurate | Keep |
| Product name EN | Brand | Keep |
