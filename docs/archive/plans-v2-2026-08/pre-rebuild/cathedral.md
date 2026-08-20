# Cathedral

**Program ID:** `cathedral` · **Source:** [src/data/plans/cathedral.ts](../../src/data/plans/cathedral.ts) · **Arches:** [src/features/cathedral/arches.ts](../../src/features/cathedral/arches.ts)
**Duration:** 10 weeks · **Frequency:** 4 days/week — chest **3×** (Press / Stretch / Adduction lead) + 1 lower day

## Overview

Chest specialisation on the **Three Arches**. No barbell bench anywhere; Smith incline is the approved bar alternative. Arch balance is a ratio (no arch &lt; half of the largest). Machine Press/Fly Combo is opt-in with its own history and assigned arch. Default tempo `20X0`. Systemic rest **150 s**, else **90 s**.

## Onboarding

- **Stats:** none required.
- **Preferences:** `useComboMachine`, `comboMachineRole` (press | adduction), `acceptedArchShift`.
- **Schedule:** Mon Nave, Tue Crypt, Thu Transept, Fri Spire.
- **Access:** paid. Portfolio: intermediate; needs dips + cables; not for competition bench focus.

### EN (`onboarding.programs.cathedral`)

- **Name:** Cathedral
- **Description:** A 10-week chest specialisation built on three arches: press, stretch and adduction.
- **Features:** Chest 3× weekly · Incline dumbbell press as the heavy arch · Dips and flyes for stretch · No barbell bench

### PL (`onboarding.programs.cathedral`)

- **Name:** Cathedral
- **Description:** 10-tygodniowa specjalizacja na klatkę oparta na trzech łukach: wyciskanie, rozciągnięcie, addukcja.
- **Features:** Klatka 3× w tygodniu · Wyciskanie hantli na skosie jako ciężki łuk · Dipy i rozpiętki na rozciągnięcie · Bez wyciskania sztangi leżąc

## Weekly structure

### Nave — Press (Mon)

| Exercise | Sets × Reps | Arch |
|---|---|---|
| Incline DB Bench | 4×6-10 | press · primary · systemic |
| Dip | 3×8-12 | stretch |
| Pec Deck | 3×12-15 | adduction |
| SA Hammer Row | 3×8-12 | |
| Lateral Raise | 2×12-15 | |
| Cable Tri Ext | 1×10-15 | |

### Crypt — Lower (Tue)

| Exercise | Sets × Reps |
|---|---|
| Hack Squat | 3×6-10 systemic |
| RDL | 3×8-12 |
| Seated Ham Curl | 3×10-15 |
| Leg Extension | 2×12-15 |
| Hack Calf | 2×12-20 |
| Ab Wheel | 1×8-12 |

### Transept — Stretch (Thu)

| Exercise | Sets × Reps | Arch |
|---|---|---|
| Cable Fly | 3×10-15 | stretch |
| 30° Smith Incline | 3×8-12 | press |
| Cable Crossover | 3×12-20 | adduction |
| Hammer Pulldown | 3×8-12 | |
| SA Reverse Pec Deck | 2×12-15 | |
| Hammer Curl | 2×8-12 | |

### Spire — Adduction (Fri)

| Exercise | Sets × Reps | Arch |
|---|---|---|
| Pec Deck | 3×12-20 | adduction |
| Flat DB Press | 3×8-12 | press |
| Dip | 2×8-12 | stretch |
| Lat Pulldown | 3×8-12 | |
| Seated DB Press | 2×8-12 | |
| Hack Calf | 2×12-20 | |
| Cable Tri Ext | 1×10-15 | |
| Hammer Curl | 1×10-15 | |

## Phases & week-to-week progression

| Phase | Weeks | Change |
|---|---|---|
| Foundation | 1–3 | Base |
| Vaulting | 4–7 | Adduction slots → **myo-reps** (3 mini × 4-5, 5 breaths) |
| Consecration | 8–9 | Press-arch reps → **5-8** |
| Rest of the Stone | 10 | −1 set / slot |

### Limiting fatigue

If something other than pecs limits pressing **twice within three weeks**, plan offers to move **2 press sets → adduction** (sets moved, not deleted). Applied only when `acceptedArchShift === 'yes'`.

## Techniques, supersets, finishers

- Myo-reps on adduction weeks 4–7.
- No supersets / finishers.
- Combo machine substitutes into assigned arch only when opted in.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-cathedral` |
| `i18nKey` | `cathedral` |
| `logo` | `/cathedral.png` |
| `coverBg` | `bg-[#0a0810]` |
| `order` | 30 |

**CSS:** `--background: 264 22% 5%`; `--primary: 40 48% 71%`; `--accent: 40 30% 21%`; `--signal-text: 40 62% 78%`.

**Widgets:** `program_status`, `workout_history`. Chest-profile / arch dashboard **not** implemented as specialty UI.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** |
| Arch / fatigue / combo preprocess | **complete** |
| Dashboard | **missing** arch profile UI |
| Onboarding | **partial** — preferences in preprocess; limited dedicated steps |
| EN / PL | **complete** |
| Tips | none |
| Verify | `npm run verify:cathedral` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `addukcja` | Latinate gym jargon | Keep for consistency, or `przywodzenie` for lay clarity |
| `Dipy i rozpiętki` | Natural | Keep |
| `Bez wyciskania sztangi leżąc` | Accurate vs code | Keep |
