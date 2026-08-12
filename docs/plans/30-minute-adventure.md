# 30 Minute Adventure

**Program ID:** `30-minute-adventure` · **Source:** [src/data/adventure.ts](../../src/data/adventure.ts)
**Duration:** Ongoing (no fixed week count) · **Frequency:** Session-select; typically one drafted circuit

## Overview

Time-boxed **pair-select** session generator — not a progressive mesocycle. Athlete picks one antagonist pair per **portal** (5 portals → 10 exercises → 20 working sets: 2 rounds × A/B). Equipment-aware routes, hero picks, failure modes (muscular / technical / preprogrammed). **Always free.** No 1RM/RPE calibration.

## Onboarding

- **Stats:** none (`onboarding` null on config).
- **Session kind:** `pair-select`.
- **Access:** `alwaysFree: true`.
- **Draft key:** `adventure_draft_${userId}`.
- **Widgets:** `workout_history` only.
- **Schedule:** none / session-driven (see Overview).

### EN (`onboarding.programs.adventure`)

- **Name:** 30 Minute Adventure
- **Description:** A flexible full-body session generator built for fast, equipment-aware training.
- **Features:**
  - Free for every new keyword
  - 5 portals · 10 exercises · 20 working sets
  - No 1RM or RPE calibration
  - Exercise history and load recommendations

### PL (`onboarding.programs.adventure`)

- **Name:** 30 Minute Adventure
- **Description:** Elastyczny generator treningu całego ciała, zoptymalizowany pod czas i dostępny sprzęt.
- **Features:**
  - Darmowy dla każdego nowego słowa kluczowego
  - 5 portali · 10 ćwiczeń · 20 serii roboczych
  - Bez kalibracji 1RM i RPE
  - Historia ćwiczeń i sugestie ciężaru

## Weekly structure

Not a fixed weekly split. Runtime builds a sequence via `buildAdventureSequence(selectedPairIds)`:

| Portal id | EN name | PL name | Pair count |
|---|---|---|---:|
| `upper` | Chest / Upper Back | Klatka / Górne plecy | 7 |
| `core-glutes` | Abs / Glutes | Brzuch / Pośladki | 6 |
| `calves-shoulders` | Calves / Shoulders | Łydki / Barki | 7 |
| `quads-triceps` | Quads / Triceps | Czworogłowe / Triceps | 6 |
| `arms-posterior` | Biceps / Hamstrings / Lower Back | Biceps / Dwugłowe / Dół pleców | 7 |

Each selected pair contributes 4 sequence steps (A1, B1, A2, B2). Program stub is a single empty week for registry compatibility.

## Phases & week-to-week progression

No weekly phases. Each session is a fresh draft.

**Portals:** Upper Gate (chest/upper back), Core Gate (abs/glutes), Signal Gate (calves/shoulders), Power Gate (quads/triceps), Rear Gate (biceps/hamstrings/lower back).

**Pair count:** 35 drafted pairs across portals; rest 60–90s; setup fast/moderate/slow → estimated 5/6/7 minutes per pair.

**Hero picks (flagged):** upper incline barbell+row, quads squat+skullcrusher, posterior barbell RDL+curl.

## Techniques, supersets, finishers

- All work is **superset pairs** (A then B, two rounds).
- Failure modes and weight modes per exercise (external / bodyweight / assisted / timed / optional).
- Timed plank example: 30–45 seconds, set 2 ends at positional failure.

## Dashboard & UI theme

| Meta | Value |
|---|---|
| `themeClass` | `theme-adventure` |
| `i18nKey` | `adventure` |
| `logo` | `/30min.png` |
| `coverBg` | `bg-[#080617]` |
| `order` | 9 |
| `alwaysFree` | yes |

**CSS tokens** (`.theme-adventure`):

| Token | HSL |
|---|---|
| `--background` | `210 8% 4%` |
| `--primary` | `83 96% 58%` |
| `--accent` | `56 100% 57%` |
| `--card` | `254 42% 9%` |
| `--ring` | `83 96% 58%` |
| `--signal-text` | `(none)` |

Palette note: lime + yellow on purple card.

**Widgets:** `workout_history`.

## Implementation completion analysis

| Area | Status |
|---|---|
| Pair catalog | **complete** — adventure.ts |
| Session UX | **complete** — pair-select |
| Progression plan | **N/A** — ongoing generator |
| Verify | `npm run verify:adventure` |
| Free access | **complete** |
| EN feature “every new keyword” | odd marketing leftover |

## Translation notes

| String | Issue | Suggested PL |
|---|---|---|
| Name left EN | OK for free plan brand | or `30-minutowa Przygoda` |
| “dla każdego nowego słowa kluczowego” | Nonsense calque of “keyword” | `dla każdego nowego konta` / `darmowy dla wszystkich` |
| “Wybór Bohatera Akcji” (adventure.heroPick) | Over-literal | `Wybór bohatera` / `Propozycja trasy` |
