# Event Horizon

**Program ID:** `event-horizon` · **Source:** [src/data/plans/eventHorizon.ts](../../src/data/plans/eventHorizon.ts) · **Swaps:** [src/features/eventHorizon/costAwareSwaps.ts](../../src/features/eventHorizon/costAwareSwaps.ts)
**Duration:** 12 weeks · **Frequency:** 4 days/week upper/lower (Mon / Tue / Thu / Fri)

## Overview

Ordinary, well-built hypertrophy (roughly **18–24** sets/session) whose specialty is **cost-aware substitution** when a region complains. Region report `normal` / `strained` / `impaired` is authoritative; nothing applies without confirmation. Costs are 0–4 ordinal metadata; personal learning may move a cost by **exactly one** ordinal after three comparable exposures. Default tempo `20X0`. Rest: systemic **150 s**, else **90 s**.

## Onboarding

- **Stats:** none.
- **Schedule:** 4 UL days.
- **Modules:** region reports + accepted swaps (`eventHorizonStatus.acceptedSwaps`) — engine + preprocess; no dedicated onboarding module list.
- **Access:** paid. Portfolio: intermediate + advanced; adaptive; not for current pain (occasional strain OK).

### EN (`onboarding.programs.eventHorizon`)

- **Name:** Event Horizon
- **Description:** A 12-week hypertrophy plan that finds a cheaper way to train when a joint starts complaining.
- **Features:** 4 days, upper/lower · Report a region, get real options · Every swap keeps the role · Nothing changes without confirmation

### PL (`onboarding.programs.eventHorizon`)

- **Name:** Event Horizon
- **Description:** 12-tygodniowy plan hipertroficzny, który znajduje tańszy sposób treningu, gdy staw zaczyna protestować.
- **Features:** 4 dni, góra/dół · Zgłoś obszar, dostaniesz realne opcje · Każda zamiana zachowuje rolę ćwiczenia · Nic nie zmienia się bez potwierdzenia

## Weekly structure

### Horizon — Upper A (Mon)

| Exercise | Sets × Reps |
|---|---|
| Incline DB Bench | 4×6-10 primary |
| SA Hammer Row | 4×8-12 uni |
| Seated DB Press | 3×8-12 |
| Lat Pulldown | 3×8-12 |
| Lateral Raise | 3×12-15 |
| Hammer Curl | 2×8-12 |
| Cable Tri Ext | 2×10-15 |

### Horizon — Lower A (Tue)

| Exercise | Sets × Reps |
|---|---|
| Hack Squat | 4×6-10 systemic · primary |
| RDL | 3×8-12 |
| Leg Extension | 3×12-15 |
| Seated Ham Curl | 3×10-15 |
| SL Hip Thrust | 3×10-15 uni |
| Hack Calf | 3×12-20 |

### Horizon — Upper B (Thu)

| Exercise | Sets × Reps |
|---|---|
| Hammer Pulldown | 4×8-12 primary |
| Hammer Chest Press | 4×8-12 |
| SA Reverse Pec Deck | 3×12-15 uni |
| Pec Deck | 3×12-15 |
| Lateral Raise | 3×12-20 |
| Cable Curl | 2×10-15 |
| Rope Pressdown | 2×10-15 |

### Horizon — Lower B (Fri)

| Exercise | Sets × Reps |
|---|---|
| Leg Press | 4×8-12 systemic · primary |
| Lying Leg Curl | 3×10-15 |
| FFE BSS | 3×8-12 uni |
| Hip Abduction | 3×12-20 |
| Leg Extension | 3×12-20 |
| Hack Calf | 3×12-20 |
| Ab Wheel | 2×8-12 |

## Phases & week-to-week progression

| Phase | Weeks | Change |
|---|---|---|
| Approach | 1–3 | Base |
| Accretion | 4–7 | Non-systemic → **RPE 9** |
| Horizon | 8–11 | All RPE 9; non-primary with sets &lt; 4 get **+1 set** |
| Escape | 12 | −1 set / slot |

Double progression +2.5 kg.

### Cost-aware swaps

- `impaired` always yields a recommendation; `normal` never does.
- Recommendation shows planned movement, replacements, role, cost before/after, tradeoffs.
- May **split** one movement into two cheaper ones; sets divide (`ceil(sets / n)`), not double.
- Where nothing helps, says so.
- `preprocessDay` applies only `acceptedSwaps` (string or string[] for splits).
- Follow-up verdict: helped / mixed / did not help.
- Learned cost: after **3** comparable exposures, ±1 ordinal from expert value max.

## Techniques, supersets, finishers

None authored.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-event-horizon` |
| `i18nKey` | `eventHorizon` |
| `logo` | `/eventhorizon.png` |
| `coverBg` | `bg-[#0a070d]` |
| `order` | 34 |

**CSS:** `--background: 276 26% 4%`; `--primary: 0 82% 57%`; `--accent: 0 50% 21%`; `--signal-text: 0 88% 72%`.

**Widgets:** `program_status`, `workout_history`. Region-report / swap UI not a dedicated page.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** |
| Swap engine + accepted-swap preprocess | **complete** |
| Dashboard / report UI | **partial / engine-first** |
| Onboarding | card complete |
| EN / PL | complete; informal tone fits |
| Tips | none |
| Verify | `npm run verify:event-horizon` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `tańszy sposób treningu` | Good metaphor for cost-aware | Keep |
| `Zgłoś obszar…` | Informal, clear | Keep |
| Product name EN | Brand | Keep |
