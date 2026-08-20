# Training-plan documentation

One file per shipped plan, regenerated from the code by
`scripts/gen-plan-docs.py`. The figures are measured from the week the
app actually builds, so a plan doc cannot silently drift from its
implementation the way the pre-rebuild docs did.

Regenerate after changing any plan:

```bash
npx --yes tsx scripts/dump-plan-facts.ts && python scripts/gen-plan-docs.py
```

Pre-rebuild docs and the v2 audit notes are kept in
[`docs/archive/plans-v2-2026-08/`](../archive/plans-v2-2026-08/).

## Plans

| Plan | ID | Weeks | Days | Weekly sets | Fatigue | Signature mechanic |
|---|---|---:|---:|---:|---:|---|
| [Bench Domination](bench-domination.md) | `bench-domination` | 16 | 4 | 112 | 3 | Percentage bench work off five separate press maxes, with modules you switch off when life gets busy. |
| [Pencilneck Eradication](pencilneck-eradication.md) | `pencilneck-eradication` | 8 | 4 | 91 | 2 | Classic bodybuilding split run in repeatable eight-week cycles. |
| [From Skeleton to Threat](skeleton-to-threat.md) | `skeleton-to-threat` | 12 | 3 | 57 | 2 | Full-body beginner progression that adds load whenever the last session was clean. |
| [Peachy](peachy.md) | `peachy-glute-plan` | 12 | 4 | 68 | 2 | Glute specialisation with a measurement widget and a hip-thrust progression that actually loads. |
| [Pain & Glory](pain-and-glory.md) | `pain-and-glory` | 16 | 4 | 74 | 4 | Deadlift specialisation where the deficit work is dosed by how wrecked the last one left you. |
| [Trinary](trinary.md) | `trinary` | 9 | 3/4 | 45 | 4 | Conjugate rotation driven by the weak point you name for each lift. |
| [Ritual of Strength](ritual-of-strength.md) | `ritual-of-strength` | 19 | 3/4 | 42 | 4 | High-frequency powerlifting: the competition lifts most days, autoregulated by feel. |
| [Super Mutant](super-mutant.md) | `super-mutant` | 14 | 4/5/6 | 150 | 4 | A session queue that picks what to train from rolling volume and how long each muscle has rested. |
| [30 Minute Adventure](30-minute-adventure.md) | `30-minute-adventure` | 4 | 2/3/4 | 60 | 1 | Pick-a-path sessions that fit in half an hour and never repeat the same pairing twice. |
| [King of the Squat](king-of-the-squat.md) | `king-of-the-squat` | 12 | 4 | 82 | 4 | Squat three times a week with the accessories chosen to hold the position, not to add volume. |
| [Gravity Is Optional](gravity-is-optional.md) | `gravity-is-optional` | 12 | 4 | 82 | 3 | Weighted calisthenics counted as total system weight, so bodyweight progress is visible. |
| [Purgatorio](purgatorio.md) | `purgatorio` | 12 | 4 | 79 | 4 | Sustained high-rep suffering with the rest periods as the prescription. |
| [Immaculate (Re)Structure](immaculate-restructure.md) | `immaculate-restructure` | 10 | 4 | 78 | 3 | Proportion-led rebuild: the weakest region gets the frequency, everything else holds. |
| [Overhead Dominion](overhead-dominion.md) | `overhead-dominion` | 10 | 4 | 81 | 3 | Shoulder specialisation built on the standing press four times a week. |
| [Hamstring Foundry](hamstring-foundry.md) | `hamstring-foundry` | 10 | 4 | 79 | 3 | Hamstrings by both functions — knee flexion and hip extension — three times weekly. |
| [Arms Race](arms-race.md) | `arms-race` | 8 | 3/4 | 80 | 2 | A three-session rotation run every other day, with an optional fourth go-nuclear session of giant sets. |
| [Workhorse](workhorse.md) | `workhorse` | 10 | 4 | 79 | 3 | Back specialisation that separates width, thickness and the lower lats into their own slots. |
| [Neural Overload](neural-overload.md) | `neural-overload` | 9 | 4 | 70 | 4 | The 1-6 method: a heavy single potentiating a set of six, twice over. Day 4’s squat is a picker — front, hack, stripper or safety-bar. |
| [Tenfold](tenfold.md) | `tenfold` | 8 | 4 | 88 | 4 | German volume training: ten sets of ten on exactly one lift per session. |
| [House of Iron](house-of-iron.md) | `house-of-iron` | 8 | 2/3/4 | 55 | 3 | One dumbbell or kettlebell made to last through authored difficulty ladders instead of more load. |
| [Apex Predator](apex-predator.md) | `apex-predator` | 12 | 3 | 50 | 2 | Repeatable movement assessments that turn into at most two access movements per session. |
| [Venus Rising](venus-rising.md) | `venus-rising` | 12 | 3/4 | 68 | 2 | A first structured plan — lower-body led, machine and cable led, with the priorities you pick once held inside a weekly set cap. |
| [Athena](athena.md) | `athena` | 12 | 3/4 | 67 | 3 | A bridge into heavy training: top sets with editable back-offs and no mandatory max test. |
| [Kali](kali.md) | `kali` | 8 | 4 | 74 | 3 | A cutting plan that protects strength: one systemic anchor a session and preservation bands. |
| [REDLINE](redline.md) | `redline` | 8 | 4 | 73 | 3 | Forty-to-fifty minute sessions: one heavy anchor, paired burn work, timed finishers. |
| [Iron Clock](iron-clock.md) | `iron-clock` | 8 | 3/4 | 36 | 3 | Density is the overload: beat the block by rounds, then by time, and only then by load. |
| [The Minimum](the-minimum.md) | `the-minimum` | 10 | 2 | 38 | 2 | Two required sessions that cover everything, with bonus work that never becomes required. |
| [Lazarus](lazarus.md) | `lazarus` | 8 | 3 | 56 | 2 | The Memory Curve: loads open from your last stable pre-break performance, not your best ever. |
| [Quadfather](quadfather.md) | `quadfather` | 10 | 4 | 75 | 3 | Three quad sessions doing three different jobs — load, depth and burn — never three of the same. |
| [Cathedral](cathedral.md) | `cathedral` | 10 | 4 | 68 | 3 | Three balanced arches — press, stretch and adduction — and no barbell bench anywhere. |
| [Blackout](blackout.md) | `blackout` | 8 | 3 | 23 | 2 | One work set per movement, and a back-off you have to earn with a clean one. |
| [Monolith](monolith.md) | `monolith` | 10 | 3 | 68 | 2 | Three machine-house days — Upper, Lower, Full — that keep systemic cost low: effort first, techniques much later. |
| [Atlas](atlas.md) | `atlas` | 10 | 3 | 56 | 4 | Two five-week gauntlets, with carries trained as a lift and scored as time × load. |
| [Event Horizon](event-horizon.md) | `event-horizon` | 12 | 4 | 78 | 3 | When a joint complains it finds you a cheaper way to buy the same stimulus, and asks first. |
| [Project Chimera](project-chimera.md) | `project-chimera` | 16 | 4 | 79 | 3 | Four blocks that quietly reallocate a couple of sets toward whatever you respond to. |
| [Oracle](oracle.md) | `oracle` | 10 | 4 | 77 | 3 | It predicts your next session, states how confident it is, and shows you how close it got. |

## Reference

- [Apex Predator assessment guide](apex-assessment-guide.md)
- [Implementation specs](specs/)
- [Master expansion roadmap](../roadmap/master-expansion.md)
- [PerformanceProfile architecture](../architecture/performance-profile.md)
