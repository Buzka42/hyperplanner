# House of Iron

**Program ID:** `house-of-iron` · **Source:** [src/data/plans/houseOfIron.ts](../../src/data/plans/houseOfIron.ts) · **Progression:** [src/features/workout/progression/houseOfIron.ts](../../src/features/workout/progression/houseOfIron.ts) · **Prescription:** [src/features/houseOfIron/prescription.ts](../../src/features/houseOfIron/prescription.ts) · **Dashboard:** [src/features/houseOfIron/HouseDashboard.tsx](../../src/features/houseOfIron/HouseDashboard.tsx)
**Duration:** 8 weeks / repeatable · **Frequency:** 2–4 free-order sessions weekly (3 recommended); session-select, no weekday lock

Full contract: [specs/house-of-iron.md](specs/house-of-iron.md).

## Overview

Minimal-equipment plan for one or more dumbbells or kettlebells. Athletes freely select Push A, Pull A, Push B or Pull B; the dashboard recommends (never forces) the session that best restores upper push/pull and knee/hip balance. Overload comes from **authored fixed-load ladders** (reps → ROM → pauses → eccentrics → variations → density → heavier equipment), not plate jumping.

## Onboarding

- **Stats / 1RMs:** none (`definePlan` double-progression slots do not pull percentage stats).
- **Equipment:** list of implements `{ id, type: 'dumbbell'|'kettlebell', weightKg, count: 1|2 }` via House Dashboard; preferred implement type; at least one required before training productively.
- **Schedule:** `session: { kind: 'session-select' }` — any of the four cards any day; advisory recommendation from balance + recency.
- **Modules/toggles:** curl role selectable in plan preferences; Bulgarian has reverse-lunge fallback note.
- **Access:** paid (not `alwaysFree`).

### EN (`onboarding.programs.houseOfIron`)

- **Name:** House of Iron
- **Description:** An 8-week repeatable minimal-equipment plan that makes one dumbbell or kettlebell last.
- **Features:** 2–4 free-order sessions weekly · Fixed-load mastery ladders · Push/pull and knee/hinge balance · Works with one implement

### PL (`onboarding.programs.houseOfIron`)

- **Name:** House of Iron
- **Description:** Powtarzalny 8-tygodniowy plan na minimalnym sprzęcie, który pozwala długo rozwijać się z jednym hantlem lub kettlem.
- **Features:** 2–4 dowolnie wybierane sesje tygodniowo · Drabinki progresji przy stałym ciężarze · Równowaga push/pull i kolano/biodro · Działa z jednym obciążeniem

## Weekly structure

Required sessions contain **12–15 working sets** (optional suitcase holds/carries excluded). Unilateral = weaker side first, equal reps; sides not logged separately.

### Push A — Chest + Quads (`dayOfWeek: 1`)

| Exercise | Sets × Reps | Rest | Notes |
|---|---|---|---|
| Goblet heel-elevated squat | 3×8-15 | 90s | |
| Single-arm floor press | 3×8-15 | 90s | Weaker side first |
| Bulgarian split squat | 2×8-15 | 90s | Reverse lunge fallback |
| Push-up | 2×AMRAP | 75s | Stop ~1–2 RIR |
| SA overhead triceps extension | 2×10-20 | 60s | |
| Suitcase hold | 1×30-60s | 45s | **Optional** |

### Pull A — Back + Hamstrings (`dayOfWeek: 2`)

| Exercise | Sets × Reps | Rest | Notes |
|---|---|---|---|
| Single-arm DB row | 3×8-15 | 90s | |
| Romanian deadlift | 3×8-15 | 120s | |
| Dumbbell pullover | 2×10-20 | 75s | |
| Single-leg RDL | 2×8-15 | 90s | |
| Hammer curl | 2×10-20 | 60s | Curl role changeable |
| Suitcase carry | 1×30-60s | 45s | **Optional** |

### Push B — Shoulders + Quads/Glutes (`dayOfWeek: 3`)

| Exercise | Sets × Reps | Rest | Notes |
|---|---|---|---|
| SA standing press | 3×6-12 | 90s | |
| Goblet skater squat | 3×6-12 | 120s | |
| SA floor press | 2×10-15 | 75s | |
| Supported sissy squat | 2×10-20 | 75s | |
| Lateral raise | 2×12-25 | 60s | Shorten lever if needed |
| Close-grip push-up | 1×AMRAP | 75s | |

### Pull B — Back + Glutes/Hamstrings (`dayOfWeek: 4`)

| Exercise | Sets × Reps | Rest | Notes |
|---|---|---|---|
| Staggered-stance RDL | 3×8-15 | 120s | |
| SA DB row | 3×10-20 | 90s | |
| Glute bridge | 3×10-20 | 75s | Load `0` valid |
| Dumbbell pullover | 2×12-20 | 75s | |
| Bent-over rear-delt row | 2×12-20 | 60s | |
| Hammer curl | 1×10-20 | 60s | |

## Phases & week-to-week progression

### Named phases (`definePlan`)

| Phase | Weeks | Behavior |
|---|---|---|
| Foundation | 1–2 | Establish variants; standard tempo; ~2–3 RIR |
| Build | 3–4 | 1–2 RIR; pause steps after rep mastery |
| Harden | 5–6 | ROM/tempo on capped priority moves |
| House on Fire | 7 | Hardest normal week; safe finals may hit 0–1 RIR |
| Rebuild | 8 | Volume cut: slots with ≥3 sets → 2; many others → 1 (push-up / SL RDL stay 2) — ~30–40% less required work |

Week 8 offers another cycle without erasing equipment or accepted ladder stages.

### Fixed-load ladder (`HOUSE_LADDERS` + `houseOfIronProgression`)

Two **consecutive** clean top-of-range exposures → **pending recommendation** (never auto-mutate). Athlete accepts or keeps current step on House Dashboard.

Typical stage order (per exercise family; unsupported stages skipped):

1. top-range reps  
2. increased usable ROM  
3. pause 1s → 2s  
4. eccentric 3s → 4s  
5. 1.5 reps (approved movements)  
6. harder variation (e.g. skater squat, glute-bridge floor press, SL RDL)  
7. density (rest ×0.9, min 30s)  
8. heavier-equipment advice  

`borderline` / invalid / pain-stopped work does not progress. `applyHouseProgressions` injects cues and may swap to variation IDs / tempos.

Session history (last 64) feeds `recommendHouseSession` / `houseBalance` (upper push, upper pull, knee-dominant, hip-dominant).

## Techniques, supersets, finishers

- No supersets; straight sets only.
- Ladder techniques: pauses, eccentrics, 1.5 reps, density, leverage/unilateral progressions.
- Optional suitcase hold/carry never gates completion or balance.
- No timed finisher blocks.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-house-of-iron` |
| `i18nKey` | `houseOfIron` |
| `logo` | `/houseofiron.png` |
| `coverBg` / gradient | `bg-[#090805]` / `from-[#090805]` |
| `order` | 20 |
| `alwaysFree` | no |

**CSS tokens** (`.theme-house-of-iron`):

| Token | HSL |
|---|---|
| `--background` | `42 28% 5%` |
| `--primary` | `38 68% 48%` |
| `--accent` | `17 63% 39%` |
| `--card` | `39 22% 8%` |
| `--ring` | `38 68% 48%` |
| `--signal-text` | `40 75% 68%` |

**UI:** dedicated `HouseDashboard` — equipment editor, recommended session cards, balance warning, pending progression accept/decline, start-next-cycle. Registry widgets also list `program_status`, `workout_history` but custom dashboard replaces the generic shell for this plan.

## Implementation completion analysis

| Area | Status |
|---|---|
| Plan generator / `definePlan` | **complete** |
| Progression hooks | **complete** — `houseOfIronProgression` + preprocess `applyHouseProgressions` |
| Dashboard | **complete** — `HouseDashboard` |
| Onboarding wiring | **complete** via plan registry + equipment on dashboard (equipment is post-select, not a classic 1RM step) |
| EN translations | **complete** |
| PL translations | **natural** (brand name left EN) |
| Exercise library / tips | **complete**; ladders authored per id |
| Verify scripts | **`npm run verify:house-of-iron`**, **`verify:progression`** |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| Brand `House of Iron` | Left EN in PL card | Keep brand; optional `Dom Żelaza` subtitle |
| `kolano/biodro` | Clear | Keep |
| Dashboard stage labels | Already bilingual in `HouseDashboard` | Good reference quality |
| No calques flagged in program features | — | — |
