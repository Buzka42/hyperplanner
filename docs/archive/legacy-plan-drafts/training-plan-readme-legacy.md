# Training Plan Documentation

## Expansion planning

- [Master expansion specification](MASTER-PLAN-EXPANSION-SPEC.md) — approved
  shared architecture, build order, existing-plan review commitments and the
  specifications for the next expansion portfolio.
- [PerformanceProfile specification](PERFORMANCE-PROFILE-SPEC.md) — earlier
  focused design; the master specification supersedes it where decisions differ.
- [Venus / Athena / Kali specification](VENUS-ATHENA-KALI-SPEC.md) — focused
  implementation detail, subject to the corrections recorded in the master spec.
- [Exercise-tip English audit](../exercise-tip-english-audit.md) — authoring and
  owner-review workflow before Polish translation.

One document per program. Each covers the weekly structure, exercise/rep-range outline, and the technical details of how weights, progressions, and program state are calculated in code.

| Plan | ID | Length | Focus |
|---|---|---|---|
| [Bench Domination](bench-domination.md) | `bench-domination` | 16 wks | Bench press specialization (AMRAP-driven base weight) |
| [Pencilneck Eradication](pencilneck-eradication.md) | `pencilneck-eradication` | 8 wks/cycle | Push/pull hypertrophy, double progression |
| [From Skeleton to Threat](skeleton-to-threat.md) | `skeleton-to-threat` | 12 wks | Beginner full-body |
| [Peachy](peachy.md) | `peachy-glute-plan` | 12 wks | Glute-focused hybrid |
| [Pain & Glory](pain-and-glory.md) | `pain-and-glory` | 16 wks | Deadlift specialization + peak |
| [Trinary](trinary.md) | `trinary` | 27 workouts | Conjugate powerlifting (ME/DE/RE) |
| [Ritual of Strength](ritual-of-strength.md) | `ritual-of-strength` | 16 wks | 3-day powerlifting frequency |
| [Super Mutant](super-mutant.md) | `super-mutant` | 12+2 wks | Dynamic high-frequency bodybuilding |
| 30 Minute Adventure | `30-minute-adventure` | — | Session generator (free tier) |

### Poliquin-inspired plans

Built declaratively with `definePlan()` from
[HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md]. Each lives in
[src/data/plans/](../../src/data/plans/) as a single data literal.

| Plan | ID | Length | Focus |
|---|---|---|---|
| King of the Squat | `king-of-the-squat` | 12 wks | Squat specialisation, wave loading |
| Gravity Is Optional | `gravity-is-optional` | 12 wks | Weighted calisthenics, total system weight |
| Immaculate (Re)Structure | `the-weakest-link` | 10 wks | Structural balance |
| Purgatorio | `accumulate-intensify` | 12 wks | Alternating volume/intensity blocks |
| Overhead Dominion | `overhead-dominion` | 10 wks | Shoulder specialisation (delts 4x) |
| Hamstring Foundry | `hamstring-foundry` | 10 wks | Hamstring specialisation (3 functions) |
| Arms Race | `arms-race` | 8 wks | Arm specialisation (arms 4x) |
| Workhorse | `upper-body-squat` | 10 wks | Weighted chin-up specialisation |
| Neural Overload | `neural-overload` | 9 wks | 1-6 loading, powerbuilding |
| Tenfold | `tenfold` | 8 wks | German Volume Training |

## Shared architecture

- Plans are `PlanConfig` objects registered in [src/data/plans.ts](../../src/data/plans.ts); each provides a static week grid plus three hooks:
  - `preprocessDay(day, user)` — mutates the day before render (deloads, variations, module filtering, dynamic generation).
  - `calculateWeight(target, user, exerciseName, {week, day})` — returns the prescribed working weight as a string, or `undefined` for user-entered loads.
  - `getExerciseAdvice(exercise, history)` — progression hints ("Increase weight!") from past logs.
- Program-specific *save-time* logic (progression state, 1RM updates) lives in [src/features/workout/progression/](../../src/features/workout/progression/), one pure handler per plan returning `{ updates, appends, increments, effects }`. WorkoutView applies them; `npm run verify:progression` checks all eight against the rules documented here (82 assertions). Badges remain in `checkBadges` in [src/contexts/UserContext.tsx](../../src/contexts/UserContext.tsx).
- **Epley formula** everywhere an e1RM is needed: `e1RM = weight × (1 + reps/30)`, typically floored to the nearest 2.5 kg.
- Per-program state is stored on the user document (`benchDominationStatus`, `trinaryStatus`, `ritualStatus`, `superMutantStatus`, `painGloryStatus`, `skeletonStatus`, …); workout logs live in the `users/{id}/workouts` subcollection.
- Both `dayName` and `getExerciseAdvice` support a translation-marker convention: a string starting with `t:` — either `t:some.key` or `t:some.key|{"param":"value"}` — is resolved through `resolveTemplate()` in [src/contexts/useTranslation.tsx](../../src/contexts/useTranslation.tsx). Plan hooks run outside React and can't call `t()` directly, so any advice or day-name text with dynamic values (weights, rep counts, etc.) must return this encoded form rather than a hardcoded English string, or it won't be translated for Polish users.
- Users can add extra sets beyond a plan's prescription, either persistently through Settings (only where the Plan Composer allows it, capped per exercise) or ad hoc with `+ Add Extra Set`. Both are tagged `kind: 'extra'` and **excluded from progression** — before that, one extra set could silently block a `+2.5 kg` increase. The base count comes from `getBaseSetsCount()`, which reads the resolved `baseSets` rather than `sets`, since `sets` already includes the athlete's extras. Guarded by `verify:extra-sets`.
- Exercises, tips, swaps and per-plan overrides are described separately in [docs/exercise-system.md](../exercise-system.md). `resolveDay()` runs after `preprocessDay` and is what turns a generated day into what the athlete sees.
- New plans should use `definePlan()` ([src/data/planBuilder.ts](../../src/data/planBuilder.ts)) rather than hand-written week trees. Adding one requires a `PLAN_META` entry, a `PLAN_REGISTRY` entry, a line in `firestore.rules validPlanIds()`, onboarding copy in both languages and a theme class — `npm run verify:registry` fails the build if any is missing.
