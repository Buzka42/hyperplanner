# Oracle

**Program ID:** `oracle` · **Source:** [src/data/plans/oracle.ts](../../src/data/plans/oracle.ts) · **Prediction:** [src/features/oracle/prediction.ts](../../src/features/oracle/prediction.ts)
**Duration:** 10 weeks · **Frequency:** 4 days/week upper/lower (Mon / Tue / Thu / Fri)

## Overview

Plan built to test whether the app can **predict** the next session. Weeks 1–2 **calibrate** (RPE 8, no prediction). From week 3 every slot gets a prior-based prediction with stated confidence. AI (when owner-enabled, feature `'oracle'`) may refine within **±7.5%** only; outage leaves priors intact. Error scored on load + reps + RIR, not e1RM alone. Default tempo `20X0`. Rest: systemic **150 s**, else **90 s**.

## Onboarding

- **seedStats:** `squat`, `flatBench` (seed calibration weeks).
- **Schedule:** 4 UL days.
- **Modules:** none; honesty on RIR is the prerequisite.
- **Access:** paid. Portfolio: intermediate + advanced; needs consistent RIR logging.

### EN (`onboarding.programs.oracle`)

- **Name:** Oracle
- **Description:** A 10-week plan that predicts your next session and then shows you how close it got.
- **Features:** 4 days, upper/lower · Weeks 1–2 calibrate · Confidence is stated, never implied · Honest accuracy, not a score

### PL (`onboarding.programs.oracle`)

- **Name:** Oracle
- **Description:** 10-tygodniowy plan, który przewiduje twoją następną sesję i pokazuje, jak blisko był.
- **Features:** 4 dni, góra/dół · Tygodnie 1–2 kalibrują · Pewność zawsze podana wprost · Uczciwa trafność zamiast oceny

## Weekly structure

### Oracle — Upper A (Mon)

| Exercise | Sets × Reps |
|---|---|
| Flat BB Bench | 4×5-8 primary |
| SA Hammer Row | 4×8-12 uni |
| Seated DB Press | 3×8-12 |
| Lat Pulldown | 3×8-12 |
| Lateral Raise | 3×12-15 |
| Cable Tri Ext | 2×10-15 |
| Hammer Curl | 2×8-12 |

### Oracle — Lower A (Tue)

| Exercise | Sets × Reps |
|---|---|
| Barbell Squat | 4×5-8 systemic · primary |
| RDL | 3×6-10 |
| Leg Press | 3×8-12 |
| Seated Ham Curl | 3×10-15 |
| Leg Extension | 3×12-15 |
| Hack Calf | 3×12-20 |

### Oracle — Upper B (Thu)

| Exercise | Sets × Reps |
|---|---|
| Incline DB Bench | 4×6-10 primary |
| Hammer Pulldown | 4×8-12 |
| Hammer Chest | 3×8-12 |
| SA Reverse Pec Deck | 3×12-15 uni |
| Lateral Raise | 3×12-20 |
| Rope Pressdown | 2×10-15 |
| Cable Curl | 2×10-15 |

### Oracle — Lower B (Fri)

| Exercise | Sets × Reps |
|---|---|
| Hack Squat | 4×6-10 systemic · primary |
| Lying Leg Curl | 3×10-15 |
| FFE BSS | 3×8-12 uni |
| SL Hip Thrust | 3×10-15 uni |
| Hack Calf | 3×12-20 |
| Ab Wheel | 2×8-12 |

## Phases & week-to-week progression

| Phase | Weeks | Change |
|---|---|---|
| Calibration | 1–2 | **RPE 8**; notes: train to target, report RIR; **no prediction** |
| Reading | 3–5 | Predictions begin |
| Prediction | 6–8 | Predictions continue |
| Proof | 9–10 | Predictions + accuracy story |

### Confidence (`assessConfidence`)

| Level | Rule | UI behaviour |
|---|---|---|
| **low** | &lt;1 comparable exposure | Offers calibration set |
| **medium** | ≥1 comparable | Gives a **range** |
| **high** | ≥3 comparable **and** ≥1 within **28 days** | Single editable target |

External-factor sessions (illness/travel/sleep) count at **⅓** weight, not discarded.

### Accuracy bands

Reported only with **n ≥ 5**: `sharp` / `usable` / `loose` / `unreliable`. Trend direction needs **n ≥ 8** and reports worsening as readily as improving.

`preprocessDay` writes prior prediction into exercise notes (never waits on network). Exposures live in `oracleStatus.exposures` — must be written on save (no `PROGRESSION_HANDLERS` entry).

## Techniques, supersets, finishers

None.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-oracle` |
| `i18nKey` | `oracle` |
| `logo` | `/oracle.png` |
| `coverBg` | `bg-[#08070d]` |
| `order` | 36 |

**CSS:** `--background: 250 24% 5%`; `--primary: 262 62% 66%`; `--accent: 262 40% 22%`; `--signal-text: 262 74% 78%`.

**Widgets:** `program_status`, `workout_history`. Accuracy dashboard / model opt-in UI **partial** (priors in notes; AI refine belongs to session UI per architecture docs).

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** |
| Prediction engine | **complete** (priors + bounded AI refine) |
| Dashboard | **partial** — no specialty accuracy board |
| Save / exposures | **partial** — not in progression handlers |
| Onboarding | seedStats wired |
| EN / PL | EN complete; PL gender/agreement nit |
| Tips | none |
| Verify | `npm run verify:oracle` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `…pokazuje, jak blisko był` | “był” OK for masculine *plan*, but reads oddly | `…pokazuje, jak blisko trafił` or `jak bardzo się pomylił` |
| `Uczciwa trafność zamiast oceny` | Abstract | `Uczciwa miara trafności, nie ocena` |
| Features 1–3 | Clear | Keep |
