# Training-plan documentation

The short files in this directory describe behavior that exists in code. Future
or not-yet-built plans live in `specs/` or the master expansion roadmap; they do
not appear in this runtime table until implemented.

## Implemented plans

| Plan | ID | Length | Focus |
|---|---|---:|---|
| [Bench Domination](bench-domination.md) | `bench-domination` | 16 weeks | Bench specialization |
| [Pencilneck Eradication](pencilneck-eradication.md) | `pencilneck-eradication` | 8 weeks/cycle | Classic bodybuilding |
| [From Skeleton to Threat](skeleton-to-threat.md) | `skeleton-to-threat` | 12 weeks | Beginner full body |
| [Peachy](peachy.md) | `peachy-glute-plan` | 12 weeks | Glute specialization |
| [Pain & Glory](pain-and-glory.md) | `pain-and-glory` | 16 weeks | Deadlift specialization |
| [Trinary](trinary.md) | `trinary` | 27 workouts | Conjugate powerlifting |
| [Ritual of Strength](ritual-of-strength.md) | `ritual-of-strength` | 16 weeks | High-frequency powerlifting |
| [Super Mutant](super-mutant.md) | `super-mutant` | 12 + 2 weeks | Reactive bodybuilding |
| [House of Iron](house-of-iron.md) | `house-of-iron` | 8 weeks/repeatable | Minimal-equipment fixed-load progression |
| [REDLINE](redline.md) | `redline` | 8 weeks | Time-capped full body with timed finishers |
| [Iron Clock](iron-clock.md) | `iron-clock` | 8 weeks | Density blocks as the overload method |
| [The Minimum](the-minimum.md) | `the-minimum` | 10 weeks | Two required sessions plus optional bonuses |
| [Lazarus](lazarus.md) | `lazarus` | 8 weeks | Return after three months or more away |
| [Quadfather](quadfather.md) | `quadfather` | 10 weeks | Quad specialisation by role |
| [Cathedral](cathedral.md) | `cathedral` | 10 weeks | Chest specialisation on three arches |
| [Blackout](blackout.md) | `blackout` | 8 weeks | Advanced single-work-set training |
| [Monolith](monolith.md) | `monolith` | 10 weeks | Machine-dominant upper/lower volume |
| [Atlas](atlas.md) | `atlas` | 10 weeks | Two five-week gauntlets, carries as a lift |
| [Event Horizon](event-horizon.md) | `event-horizon` | 12 weeks | Cost-aware hypertrophy substitution |
| [Project Chimera](project-chimera.md) | `project-chimera` | 16 weeks | Confirmable per-block volume reallocation |
| [Oracle](oracle.md) | `oracle` | 10 weeks | Prediction, stated confidence and honest accuracy |
| [King of the Squat](king-of-the-squat.md) | `king-of-the-squat` | 12 weeks | Squat specialisation on descending waves |
| [Purgatorio](purgatorio.md) | `purgatorio` | 12 weeks | Accumulation/intensification upper/lower blocks |
| [Immaculate (Re)Structure](immaculate-restructure.md) | `immaculate-restructure` | 10 weeks | Structural balance against Poliquin ratios |
| [Overhead Dominion](overhead-dominion.md) | `overhead-dominion` | 10 weeks | Shoulder specialisation, wave-converted press |
| [Hamstring Foundry](hamstring-foundry.md) | `hamstring-foundry` | 10 weeks | Hamstrings through all three functions |
| [Arms Race](arms-race.md) | `arms-race` | 8 weeks | Arm specialisation, four distinct exposures |
| [Workhorse](workhorse.md) | `workhorse` | 10 weeks | Weighted chin-up as a major strength lift |
| [Neural Overload](neural-overload.md) | `neural-overload` | 9 weeks | 1-6 post-activation powerbuilding |
| [Tenfold](tenfold.md) | `tenfold` | 8 weeks | One 10×10 per session, hold-until-complete |
| [Gravity Is Optional](gravity-is-optional.md) | `gravity-is-optional` | 12 weeks | Weighted calisthenics on total system weight |
| [Venus Rising](venus-rising.md) | `venus-rising` | 12 weeks | RPE-escalating hypertrophy, 3- or 4-day modes |
| [Athena](athena.md) | `athena` | 12 weeks | Barbell strength in switchable 3/4-day schedules |
| [Kali](kali.md) | `kali` | 8 weeks | Low volume, intensifiers only in the final block |
| [Apex Predator](apex-predator.md) | `apex-predator` | 12 weeks | Movement-access-driven full body |
| [30 Minute Adventure](30-minute-adventure.md) | `30-minute-adventure` | ongoing | Time-boxed drafted superset circuits |

Apex Predator's six-region movement screen has its own step-by-step field
guide with per-test image prompts: [assessment guide](apex-assessment-guide.md).

## Expansion specifications

- [Master expansion roadmap](../roadmap/master-expansion.md)
- [Apex Predator implementation spec](specs/apex-predator.md)
- [House of Iron implementation spec](specs/house-of-iron.md)
- [Venus Rising / Athena / Kali implementation spec](specs/venus-athena-kali.md)
- [PerformanceProfile architecture](../architecture/performance-profile.md)
- [AI integration](../architecture/ai.md)

## Shared implementation rules

- New plans use `definePlan()` unless their behavior genuinely requires a
  bespoke generator.
- Save-time progression is implemented as pure handlers under
  `src/features/workout/progression/`.
- Exercise names, tips, swaps, techniques and plan overrides resolve through the
  [exercise system](../architecture/exercise-system.md).
- Every added plan requires registry metadata, Firestore allowlisting,
  onboarding copy, English/Polish strings, artwork and a contrast-verified theme.
- Extra and technique-derived sets never drive plan progression.
