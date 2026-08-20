# Lazarus

**Program ID:** `lazarus` · **Source:** [src/data/plans/lazarus.ts](../../src/data/plans/lazarus.ts) · **Engine:** [src/features/lazarus/memoryCurve.ts](../../src/features/lazarus/memoryCurve.ts)
**Duration:** 8 weeks · **Frequency:** 3 full-body days/week (Mon / Wed / Fri)

## Overview

Return plan for a previously trained athlete after **≥3 months** away. Movements are ordinary; the Memory Curve drives opening loads from the last *stable* pre-break performance (never the lifetime best), discounted for time off. Weeks 1–2 hard-cap volume at **≤2 sets per slot** in the tree *and* in `preprocessDay`. Default tempo `20X0`. Rest: systemic **150 s**, else **90 s**.

## Onboarding

- **Intended status fields:** `breakMonths`, prior experience / memory points, injury-caused-break flag (`lazarusStatus`) — types + `calculateWeight` / guidance exist.
- **Stats:** Memory Curve points per exercise (`lifetimeBestKg`, `preBreakKg`, source `profile` | `self-reported`).
- **Schedule:** 3 fixed FB days.
- **Modules:** none.
- **Access:** paid. Portfolio: intermediate + advanced; prerequisites previous structured training + ≥3 months away; not for active injury limits.

Dedicated Onboarding.tsx fields for break duration / injury are **not** wired as a plan-specific step (status must be populated elsewhere or manually).

### EN (`onboarding.programs.lazarus`)

- **Name:** Lazarus
- **Description:** An 8-week return plan for trained athletes coming back after three months or more away.
- **Features:** 3 full-body days · Memory Curve against your old bests · Hard caps in weeks 1–2 · Accelerates once you prove it

### PL (`onboarding.programs.lazarus`)

- **Name:** Lazarus
- **Description:** 8-tygodniowy powrót dla trenujących wcześniej po co najmniej trzech miesiącach przerwy.
- **Features:** 3 dni całego ciała · Krzywa Pamięci względem dawnych rekordów · Twarde limity w tygodniach 1–2 · Przyspiesza, gdy to udowodnisz

## Weekly structure

### Return I — Mon

| Exercise | Sets × Reps |
|---|---|
| Hack Squat | 3×8-12 (systemic) |
| Incline DB Bench | 3×8-12 |
| SA Hammer Row | 3×8-12 uni |
| Seated Ham Curl | 2×10-15 |
| Lateral Raise | 2×12-15 |
| Cable Tri Ext | 1×8-15 |
| Hack Calf | 1×12-20 |
| Ab Wheel | 1×8-12 |

### Return II — Wed

| Exercise | Sets × Reps |
|---|---|
| RDL | 3×8-12 (systemic) |
| Lat Pulldown | 3×8-12 |
| Hammer Chest Press | 3×8-12 |
| Leg Extension | 2×10-15 |
| SA Reverse Pec Deck | 2×12-15 uni |
| Hack Calf | 2×12-20 |
| Hammer Curl | 1×8-12 |

### Return III — Fri

| Exercise | Sets × Reps |
|---|---|
| Leg Press | 3×10-15 (systemic) |
| Seated DB Press | 3×8-12 |
| Hammer Pulldown | 3×8-12 |
| Lying Leg Curl | 2×10-15 |
| Hammer Curl | 1×8-12 |
| Cable Tri Ext | 1×8-15 |

Weeks 1–2: every slot capped to **min(authored, 2)** sets, **RPE 7**.

## Phases & week-to-week progression

| Phase | Weeks | Change |
|---|---|---|
| Waking | 1–2 | Cap ≤2 sets, RPE 7 |
| Remembering | 3–5 | Full authored sets |
| Returned | 6–8 | Systemic compounds → reps **6-10** |

### Memory Curve (`detrainingFactor` / `openingLoad`)

| Break length | % of pre-break stable load |
|---|---|
| &lt; 3 months | 90% |
| &lt; 6 months | 80% |
| &lt; 12 months | 70% |
| ≥ 12 months | 60% (flat — no further extrapolation) |

- Exact / close variation → prescribe discounted kg (rounded to 2.5).
- Same-pattern / same-muscle / expired → further ×0.85 + calibration required.
- Self-reported source → requires calibration.
- No usable memory → first working set is calibration.

### Acceleration (`shouldAccelerate`)

From week 3: **≥2** underestimated sessions in a rolling window (`week - 3` … current) → accelerate (notes reason). One session is noise. Weeks 1–2 never accelerate.

### Injury guidance (`injuryReturnGuidance`)

Not rehab. Points to trainer/physio. If break ≥12 months, suggests **Apex Predator**.

## Techniques, supersets, finishers

None.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-lazarus` |
| `i18nKey` | `lazarus` |
| `logo` | `/lazarus.png` |
| `coverBg` | `bg-[#080b0d]` |
| `order` | 28 |

**CSS tokens** (`.theme-lazarus`): `--background: 200 14% 5%`; `--primary: 36 44% 67%`; `--accent: 36 28% 20%`; `--signal-text: 36 56% 76%`.

**Widgets:** `program_status`, `workout_history`. No Memory Curve chart UI.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** |
| Progression / Memory Curve | **engine + calculateWeight complete** |
| Dashboard | **missing** specialty Memory Curve view |
| Onboarding UI | **incomplete** — status fields typed, no dedicated break/injury step in Onboarding.tsx |
| EN / PL | EN complete; PL description slightly awkward |
| Tips | none |
| Verify | `npm run verify:lazarus` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `…dla trenujących wcześniej po co najmniej trzech miesiącach przerwy` | Clunky word order | `…dla osób wracających po co najmniej trzech miesiącach przerwy` |
| `Krzywa Pamięci` | Good calque | Keep |
| `Twarde limity` | Clear | Keep |
