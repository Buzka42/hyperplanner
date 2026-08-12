# Quadfather

**Program ID:** `quadfather` · **Source:** [src/data/plans/quadfather.ts](../../src/data/plans/quadfather.ts) · **Roles:** [src/features/quadfather/roles.ts](../../src/features/quadfather/roles.ts)
**Duration:** 10 weeks · **Frequency:** 4 days/week — quads **3×**, other muscles **2×** (one day with zero quad work)

## Overview

Quad specialisation where each quad slot has a **role** — Load, Depth, or Burn — and each quad day carries at least two roles. Hack Squat is the default main load; free squat / Stiletto remain selectable by limb proportion. Knee feedback may propose same-role, lower-cost swaps (athlete must accept). Default tempo `20X0`. Systemic rest **180 s**, else **90 s**.

## Onboarding

- **Stats:** none required for %.
- **Preferences:** `planPreferences.quadfather.exerciseSelections.mainLoad` (+ optional swaps); limb proportion drives `recommendMainLoad` advice.
- **Schedule:** 4 days (Mon Load, Tue Maintain, Thu Depth, Fri Burn).
- **Modules:** knee-feedback swaps; ROM confirmation (notes ask when unknown).
- **Access:** paid. Portfolio: intermediate; fatigue 3; knees that tolerate loaded knee flexion.

Limb-proportion / ROM collection is engine-ready; dedicated Onboarding UI steps are limited.

### EN (`onboarding.programs.quadfather`)

- **Name:** Quadfather
- **Description:** A 10-week quad specialisation that trains legs three times while everything else is maintained.
- **Features:** Quads 3×, other muscles 2× · Load, depth and burn roles · Confirmed range of motion · Knee-feedback swaps

### PL (`onboarding.programs.quadfather`)

- **Name:** Quadfather
- **Description:** 10-tygodniowa specjalizacja na czworogłowe: nogi trzy razy, reszta podtrzymywana.
- **Features:** Czworogłowe 3×, pozostałe partie 2× · Role: ciężar, zakres i pompa · Potwierdzany zakres ruchu · Zamiany przy dolegliwościach kolan

## Weekly structure

### The Offer — Load (Mon)

| Exercise | Sets × Reps | Role |
|---|---|---|
| Hack Squat (or chosen main load) | 4×5-8 | load · primary · systemic |
| Goblet Heel-Elevated Squat | 3×8-12 | depth |
| Leg Extension | 2×12-15 | burn |
| Incline DB Bench | 3×6-10 | maintain |
| SA Hammer Row | 3×8-12 | maintain |
| Lateral Raise | 2×12-15 | maintain |

### The Family — Maintain (Tue) — **no quads**

| Exercise | Sets × Reps |
|---|---|
| RDL | 3×6-10 systemic |
| Lat Pulldown | 3×8-12 |
| Hammer Chest | 3×8-12 |
| Seated Ham Curl | 3×10-15 |
| SA Reverse Pec Deck | 2×12-15 |
| Hammer Curl | 2×8-12 |
| Cable Tri Ext | 2×8-15 |
| Hack Calf | 2×12-20 |

### The Debt — Depth (Thu)

| Exercise | Sets × Reps | Role |
|---|---|---|
| FFE Bulgarian Split Squat | 3×8-12 | depth |
| Leg Press | 3×10-15 | load · systemic |
| Supported Sissy Squat | 2×10-15 | burn |
| Seated DB Press | 3×8-12 | |
| Hammer Pulldown | 3×8-12 | |
| Hack Calf | 2×12-20 | |

### The Reckoning — Burn (Fri)

| Exercise | Sets × Reps | Role |
|---|---|---|
| Knee-over-toe Split Squat | 3×8-12 | depth |
| Stripper Squat | 3×10-15 | burn (always burn) |
| Reverse Nordic | 2×8-12 | burn |
| Lying Leg Curl | 2×10-15 | |
| SA Hammer Row | 3×8-12 | |
| Hammer Curl | 1×10-15 | |
| Cable Tri Ext | 1×10-15 | |
| Ab Wheel | 1×8-12 | |

**Load pool:** Hack Squat, Barbell Squat, Stiletto Squat, Leg Press.  
**Depth pool:** split squats, knee-over-toe, step-ups, deficit reverse lunges, heel-elevated goblets.  
**Burn pool:** Leg Ext, Supported Sissy, Reverse Nordic, Stripper Squat.

## Phases & week-to-week progression

| Phase | Weeks | Change |
|---|---|---|
| Introduction | 1–3 | Base |
| Enforcement | 4–7 | Burn-role slots → **myo-reps** (3 mini × 4-5, 5 breaths) |
| Succession | 8–9 | Load-role reps → **4-6** (Stripper stays burn) |
| Settlement | 10 | −1 set per slot (min 1) |

Double progression +2.5 kg on ranges. Knee: `normal` / `strained` / `impaired` → `proposeKneeSwap` same role, lower knee cost; applied only after accept. Unconfirmed depth → note “Confirm your depth after the first set.”

## Techniques, supersets, finishers

- **Myo-reps** weeks 4–7 on burn-role movements only.
- No supersets / finishers.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-quadfather` |
| `i18nKey` | `quadfather` |
| `logo` | `/quadfather.png` |
| `coverBg` | `bg-[#0f0a06]` |
| `order` | 29 |

**CSS:** `--background: 22 20% 5%`; `--primary: 22 62% 52%`; `--accent: 22 44% 20%`; `--signal-text: 24 78% 70%`.

**Widgets:** `program_status`, `workout_history`. Doc/engine intend role-balance + ROM reporting; **no** specialty React dashboard.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** |
| Roles / knee / depth engine | **complete** |
| Dashboard | **missing** role-balance UI |
| Onboarding | **partial** — preferences/preprocess wired; limb UI incomplete |
| EN / PL | **complete**; PL “pompa” good for burn |
| Tips | none |
| Verify | `npm run verify:quadfather` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `Role: ciężar, zakres i pompa` | Good paraphrase of load/depth/burn | Keep |
| Product name EN | Brand | Keep |
| Description “nogi trzy razy” | Slightly vague vs quads 3× | `czworogłowe trzy razy w tygodniu` |
