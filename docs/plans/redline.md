# REDLINE

**Program ID:** `redline` · **Source:** [src/data/plans/redline.ts](../../src/data/plans/redline.ts) · **UI timer:** [src/features/redline/BlockTimer.tsx](../../src/features/redline/BlockTimer.tsx)
**Duration:** 8 weeks · **Frequency:** 4 days/week (Pressure / Redline / Furnace / Afterburn) · **Default tempo:** `20X0`

## Overview

Four-day full-body plan built for **40–50 minute** sessions. Every session is one heavy **anchor** at full rest, then paired **burn** work, then optional **timed finishers**. Recovery check before each session can trim burn (and finishers) without touching the anchor.

## Onboarding

- **Stats / 1RMs:** none required for prescription math; loads use **double progression** (`increment: 2.5`) on slots.
- **Schedule:** fixed four training days (`dayOfWeek` 1, 2, 4, 5) — Pressure, Redline, Furnace, Afterburn.
- **Modules / preferences:** Furnace day anchor choice — **Paused Bench** (default) vs **Standing Overhead Press**, stored in `user.planPreferences.redline.exerciseSelections.furnaceAnchor`.
- **Access:** paid (not `alwaysFree`).

### EN (`onboarding.programs.redline`)

- **Name:** REDLINE
- **Description:** An 8-week four-day full-body plan built around 40–50 minute sessions and timed finishers.
- **Features:** 4 sessions of 40–50 minutes · One heavy anchor, then paired burn work · Timed finisher blocks · Recovery check before every session

### PL (`onboarding.programs.redline`)

- **Name:** REDLINE
- **Description:** 8-tygodniowy, czterodniowy plan całego ciała oparty na sesjach 40–50 minut i finiszerach na czas.
- **Features:** 4 sesje po 40–50 minut · Jedna ciężka kotwica, potem praca w parach · Bloki finiszerów na czas · Pytanie o regenerację przed każdą sesją

## Weekly structure

Each day: **12–16 prescribed working sets** outside finishers. Burn slots always paired (`A1/A2`, `B1/B2`…). Anchor rest **180s**; burn/finisher rest **60s**.

### PRESSURE (Day 1)

| Role | Exercise | Sets × Reps | Pair / block |
|---|---|---|---|
| Anchor | Hack Squat | 3×4-6 | `anchor` |
| Burn | Incline DB Bench | 2×6-10 | A1 `pressure-a` |
| Burn | SA Hammer Row | 2×6-10 | A2 |
| Burn | Seated Ham Curl | 2×8-12 | B1 `pressure-b` |
| Burn | Lateral Raise | 2×12-15 | B2 |
| Burn | Hammer Curl | 1×8-15 | C1 `pressure-c` |
| Burn | Cable Triceps Ext | 1×8-15 | C2 |
| Finisher (opt.) | KB Swing | 1×10-15 | timed |
| Finisher (opt.) | Farmer Carry | 1×20-30 | timed |

### REDLINE (Day 2)

| Role | Exercise | Sets × Reps | Pair |
|---|---|---|---|
| Anchor | Lat Pulldown | 3×4-6 | |
| Burn | FFE Bulgarian Split Squat | 2×8-10 | A1 |
| Burn | Hammer Chest Press | 2×6-10 | A2 |
| Burn | Hip-Supported DB Deadlift | 2×8-10 | B1 |
| Burn | SA Reverse Pec Deck | 2×12-15 | B2 |
| Burn | Hack Calf Raise | 1×12-20 | C1 |
| Burn | Ab Wheel | 1×8-15 | C2 |
| Finisher | Goblet Heel-Elevated Squat | 1×8 | |
| Finisher | Push-up | 1×6-10 | |
| Finisher | Farmer Carry | 1×20-30 | |

### FURNACE (Day 4)

| Role | Exercise | Sets × Reps | Pair |
|---|---|---|---|
| Anchor | Paused Bench *(or OH Press via prefs)* | 3×4-6 | |
| Burn | Goblet Skater Squat | 2×8-12 | A1 |
| Burn | SA Hammer Row | 2×6-10 | A2 |
| Burn | Leg Extension | 2×10-15 | B1 |
| Burn | Lat Prayer | 2×10-15 | B2 |
| Burn | Lateral Raise | 2×12-20 | C1 |
| Burn | Hammer Curl | 1×8-15 | C2 |
| Finisher | KB Swing / Deficit Reverse Lunge / Deficit Push-up | timed | |

### AFTERBURN (Day 5)

| Role | Exercise | Sets × Reps | Pair |
|---|---|---|---|
| Anchor | Romanian Deadlift | 3×4-6 | |
| Burn | Hammer Chest Press | 2×8-12 | A1 |
| Burn | Hammer Pulldown | 2×8-12 | A2 |
| Burn | Deficit Reverse Lunge | 2×8-12 | B1 |
| Burn | SA Hammer Row | 2×8-12 | B2 |
| Burn | Lateral Raise | 2×12-20 | C1 |
| Burn | Cable Triceps Ext | 1×8-15 | C2 |
| Burn | Hack Calf / Ab Wheel | 1×… | D1/D2 |
| Finisher | Farmer Carry | 1×20-40 | |

## Phases & week-to-week progression

### Finisher window durations (`duration(week)`)

| Weeks | Cap (seconds) |
|---|---|
| 1–2 (Ignition) | 300 (5 min) |
| 3–4 (Burn) | 360 (6 min) |
| 5 (Burn) | 420 (7 min) |
| 6–7 (Redline) | 480 (8 min) |
| 8 (Ashes) | 300 (5 min) |

Work logged after the window expires counts as training but **never improves density** (`BlockTimer` expired flag).

### Week 8 Ashes

Burn sets → `Math.max(1, Math.round(sets * 0.65))` (~two thirds). Finishers reset to 300s. Intensity of remaining work is not reduced.

### Recovery preprocess

`redlineStatus.nextRecovery` must be **confirmed**. Effects:

| Response | Effect |
|---|---|
| `recovered` | no change |
| `somewhat-fatigued` | burn volume × ~0.85 (sets trimmed, min 1 per burn slot) |
| `performance-impaired` | burn × ~0.7 **and finishers dropped** |
| — | **anchor always survives** |

Reduction is visible and reversible (re-confirm another response).

### Load progression

Slot-level `progression: { type: 'double', increment: 2.5 }` via `definePlan` engine. **No** dedicated entry in `PROGRESSION_HANDLERS` (generic double progression / session engines handle it).

## Techniques, supersets, finishers

- **Paired burn supersets** mandatory for verification (`verify:redline` / supersets rules): every burn pair id must have both partners.
- **Timed finishers** optional; `BlockTimer` Start/Pause/Finish with hard cap.
- Default tempo `20X0` on the plan.
- No drop-set / rest-pause prescriptions in the static template.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-redline` |
| `i18nKey` | `redline` |
| `logo` | `/redline.png` |
| `coverBg` / gradient | `bg-[#0a0a0a]` / `from-[#0a0a0a]` |
| `order` | 25 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-redline`):

| Token | HSL |
|---|---|
| `--background` | `0 0% 4%` |
| `--primary` | `0 92% 54%` |
| `--accent` | `0 60% 20%` |
| `--accent-foreground` | `0 90% 78%` |
| `--ring` | `0 92% 54%` |
| `--signal-text` | `0 96% 70%` |

**Widgets:** `program_status`, `workout_history`. Specialty UI is in-session `BlockTimer` + recovery prompt rather than a custom dashboard shell.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator / `definePlan` | **complete** — `REDLINE_CONFIG` with custom `preprocessDay` |
| Progression hooks | **partial** — double progression via plan builder; no plan-specific `PROGRESSION_HANDLERS` entry |
| Dashboard | **partial** — generic widgets; timer lives in workout UI |
| Onboarding wiring | **complete** for card + furnace preference path |
| EN translations | **complete** |
| PL translations | **natural** |
| Exercise library / tips | **complete**; furnace swap uses library ids |
| Verify script | **`npm run verify:redline`** (+ shared `verify:supersets`) |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| Brand `REDLINE` | Left EN | Keep |
| `Jedna ciężka kotwica, potem praca w parach` | Natural | Keep |
| `BlockTimer` expired copy is EN-only in component | Hardcoded English | Add `t(...)` for “Time cap expired…” |
| No calques in program card features | — | — |
