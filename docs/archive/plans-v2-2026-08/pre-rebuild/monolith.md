# Monolith

**Program ID:** `monolith` · **Source:** [src/data/plans/monolith.ts](../../src/data/plans/monolith.ts)
**Duration:** 10 weeks · **Frequency:** 4 days/week upper/lower (Mon / Tue / Thu / Fri)

## Overview

Machine-dominant hypertrophy volume with low systemic cost — not machine-exclusive. Sessions ~**19–21** working sets; at most one systemic anchor per day; bilateral + unilateral mix. Effort progresses before technique. Machine Press/Fly Combo has its own history and must never share a superset with Pec Deck (distant floor stations). Default tempo `20X0`. Rest: systemic **150 s**, else **90 s**.

## Onboarding

- **Stats:** none.
- **Schedule:** 4 UL days. Fixed gym inventory — no per-run machine picker.
- **Modules:** none.
- **Access:** paid. Portfolio: beginner + intermediate; equipment machines / full-gym; fatigue 2.

### EN (`onboarding.programs.monolith`)

- **Name:** Monolith
- **Description:** A 10-week machine-dominant upper/lower plan for accumulating volume you can recover from.
- **Features:** 4 days, upper/lower · Machine-dominant, not machine-only · Effort first, technique later · Low systemic cost

### PL (`onboarding.programs.monolith`)

- **Name:** Monolith
- **Description:** 10-tygodniowy plan góra/dół oparty na maszynach, do budowania objętości, z której da się zregenerować.
- **Features:** 4 dni, góra/dół · Przewaga maszyn, ale nie tylko maszyny · Najpierw wysiłek, później techniki · Niski koszt systemowy

## Weekly structure

### Upper A — Mon (21 sets)

| Exercise | Sets × Reps |
|---|---|
| Hammer Chest Press | 4×6-10 primary |
| Hammer Pulldown | 4×8-12 |
| Machine Press/Fly Combo | 3×10-15 |
| SA Hammer Row | 3×8-12 uni |
| Lateral Raise | 3×12-15 |
| Cable Tri Ext | 2×10-15 |
| Hammer Curl | 2×8-12 |

### Lower A — Tue (19 sets)

| Exercise | Sets × Reps |
|---|---|
| Hack Squat | 4×6-10 systemic · primary |
| Lying Leg Curl | 3×10-15 |
| Leg Press | 3×10-15 |
| SL Machine Hip Thrust | 3×10-15 uni |
| Leg Extension | 3×12-15 |
| Hack Calf | 3×12-20 |

### Upper B — Thu (20 sets)

| Exercise | Sets × Reps |
|---|---|
| Lat Pulldown | 4×8-12 primary |
| Incline DB Bench | 3×6-10 |
| SA Reverse Pec Deck | 3×12-15 uni |
| Pec Deck | 3×12-15 |
| Seated DB Press | 3×8-12 |
| Rope Pressdown | 2×10-15 |
| Cable Curl | 2×10-15 |

### Lower B — Fri (19 sets)

| Exercise | Sets × Reps |
|---|---|
| Leg Press | 4×8-12 systemic · primary |
| Seated Ham Curl | 3×10-15 |
| FFE Bulgarian Split Squat | 3×8-12 uni |
| Machine Hip Abduction | 3×12-20 |
| Leg Extension | 3×12-20 |
| Hack Calf | 3×12-20 |

**Distant pairs stripped at build:** `[machine-press-fly-combo, pec-deck]`, `[hack-squat, lat-prayer]`.

## Phases & week-to-week progression

| Phase | Weeks | Change |
|---|---|---|
| Placement | 1–3 | Base |
| Pressure | 4–6 | Non-systemic → **RPE 9** |
| Weight of It | 7–9 | `TECHNIQUE_SAFE` machines → RPE 9 + **drop-set** 1× **−20%** on last set |
| Settling | 10 | −1 set / slot |

**TECHNIQUE_SAFE:** leg-extension, lying/seated ham curl, pec-deck, hip abduction, hammer chest/pulldown, SA reverse pec deck, press/fly combo, hack calf.

Double progression +2.5 kg throughout.

## Techniques, supersets, finishers

- Drop-sets weeks 7–9 on safe machines only (`drops: 1`, `dropPercent: 20`, `applyTo: 'last'`).
- No authored supersets; distant pair labels stripped if introduced.
- No finishers.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-monolith` |
| `i18nKey` | `monolith` |
| `logo` | `/monolith.png` |
| `coverBg` | `bg-[#080a0b]` |
| `order` | 32 |

**CSS:** `--background: 210 10% 5%`; `--primary: 40 40% 78%`; `--accent: 40 24% 20%`; `--signal-text: 40 52% 82%`.

**Widgets:** `program_status`, `workout_history`.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** (logic in-plan; no separate feature folder) |
| Progression | **phase transforms complete**; generic double |
| Dashboard | shared widgets only |
| Onboarding | complete for card |
| EN / PL | complete; PL description slightly heavy |
| Tips | none |
| Verify | `npm run verify:monolith` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `…do budowania objętości, z której da się zregenerować` | Awkward relative clause | `…żeby budować objętość, z której da się zregenerować` |
| Features | Accurate match to effort→technique order | Keep |
