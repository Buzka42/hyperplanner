# Atlas

**Program ID:** `atlas` · **Source:** [src/data/plans/atlas.ts](../../src/data/plans/atlas.ts) · **Carries:** [src/features/atlas/carries.ts](../../src/features/atlas/carries.ts)
**Duration:** 10 weeks (2×5-week gauntlets) · **Frequency:** 3 full-body days/week (Mon / Wed / Fri)

## Overview

Strength plan built as two five-week **gauntlets**: same session layout, different movement set after week 5. Carries are trained as lifts scored **time × load** (kg·min, counting implements). Primary lifts use tempo **`10X0`**. Systemic rest **180 s**; carries **120 s**; else **90 s**. Optional KB power work exists in the feature pool but is **absent from the prescription tree**.

## Onboarding

- **seedStats:** `squat`, `conventionalDeadlift`, `standingPress` (optional; seeds first exposure via `seedLoadFor`).
- **Hinge choice:** trap-bar (default) / conventional / sumo — `planPreferences.atlas.exerciseSelections.hinge`; unapproved ids ignored.
- **Schedule:** 3 FB days.
- **Access:** paid. Portfolio: intermediate + advanced; fatigue 4; needs trap bar or loadable hinge + carry space.

### EN (`onboarding.programs.atlas`)

- **Name:** Atlas
- **Description:** A 10-week strength plan run as two five-week gauntlets, built on carries and hard basics.
- **Features:** 3 full-body days · Two five-week movement sets · Carries scored as time × load · Optional kettlebell power work

### PL (`onboarding.programs.atlas`)

- **Name:** Atlas
- **Description:** 10-tygodniowy plan siłowy w dwóch pięciotygodniowych blokach, oparty na spacerach z ciężarem i twardych podstawach.
- **Features:** 3 dni całego ciała · Dwa pięciotygodniowe zestawy bojów · Spacery liczone jako czas × ciężar · Opcjonalna praca dynamiczna z kettlem

## Weekly structure

### Gauntlet I (weeks 1–5)

**Atlas I — Carry the Bar (Mon)**

| Exercise | Sets × Reps |
|---|---|
| Safety-Bar Squat | 4×5-8 primary · systemic |
| Standing Barbell Press | 3×5-8 primary |
| SA Hammer Row | 3×8-12 uni |
| SL RDL | 2×8-10 uni |
| Ab Wheel | 2×8-12 |
| Farmer Carry | 3×40-60 s |

**Atlas II — Carry the Weight (Wed)**

| Exercise | Sets × Reps |
|---|---|
| Trap-Bar DL (or chosen hinge) | 4×4-6 primary · systemic |
| Weighted Pull-Up | 3×4-8 primary |
| Incline DB Bench | 3×6-10 |
| FFE BSS | 2×8-12 uni |
| Hack Calf | 2×12-20 |
| Cable Tri Ext | 1×10-15 |
| Suitcase Carry | 2×30-40 s uni |

**Atlas III — Carry the Rest (Fri)**

| Exercise | Sets × Reps |
|---|---|
| Safety-Bar Squat | 3×6-10 systemic |
| Flat DB Press | 3×6-10 |
| Barbell Row | 3×6-10 |
| Seated Ham Curl | 2×10-15 |
| Lateral Raise | 2×12-15 |
| Hammer Curl | 2×8-12 |
| Cable Tri Ext | 1×10-15 |
| Hack Calf | 1×12-20 |
| Suitcase Hold (optional) | 2×30-45 s |

### Gauntlet II (weeks 6–10) — pattern swap

- Mon: Front Squat 4×4-6, SA Standing Press 3×6-10, Weighted Pull-Up 3×4-8, Staggered RDL 2×8-12, Hanging Knee Raise 2×10-15, Farmer Carry 3×**50-70** s
- Wed: Trap-Bar DL 4×**3-5**, Incline DB 3×5-8 primary, Half-Kneeling Rotational Row 3×8-12, Weighted Step-Up 2×8-10, Suitcase Carry 2×**40-50** s
- Fri: Safety-Bar 3×6-10, Standing Press 3×6-10, SA Hammer Row, Lying Curl, laterals, curls, tris, calves, **Dip 2×6-10**, optional Suitcase Hold

`preprocessDay` swaps gauntlet-two days when `gauntletFor(week) === 2`.

## Phases & week-to-week progression

| Phase | Weeks |
|---|---|
| Gauntlet I | 1–5 |
| Gauntlet II | 6–10 |

Double progression +2.5 kg. Carry score: `loadKg × implements × seconds / 60` → kg·min. Limiter tags (`grip` / `trunk` / `breathing` / `upper-back` / `legs`): same limiter twice → advice only (never auto-rewrites carry). Optional power pool (KB swing, KB press, TGU) not in tree — cannot drive progression.

## Techniques, supersets, finishers

- None. Carries are primary work, not finishers.
- Primary tempo `10X0`.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-atlas` |
| `i18nKey` | `atlas` |
| `logo` | `/atlas.png` |
| `coverBg` | `bg-[#0d0a06]` |
| `order` | 33 |

**CSS:** `--background: 36 24% 5%`; `--primary: 36 62% 52%`; `--accent: 36 44% 20%`; `--signal-text: 38 76% 70%`.

**Widgets:** `program_status`, `workout_history`. Carry logging / limiter UI engine-only.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator | **complete** — dual gauntlet trees + hinge swap + seed loads |
| Carries engine | **complete** |
| Dashboard | **missing** carry score UI |
| Onboarding | **seedStats wired**; hinge preference in preprocess |
| EN / PL | complete and accurate |
| Tips | none |
| Verify | `npm run verify:atlas` |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| `Spacery liczone jako czas × ciężar` | Accurate | Keep |
| `zestawy bojów` | Gym jargon OK | Keep or `zestawy ćwiczeń` |
| Power feature | Matches “optional KB” | Keep |
