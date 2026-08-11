# HyperPlanner

HyperPlanner is a bilingual workout-execution application for authored training
plans. It calculates prescriptions, records sets, applies plan-specific
progression, manages exercise swaps and exposes plan/library controls through an
Admin interface.

The app is currently being prepared for a substantially larger plan portfolio.
Unreleased plans remain absent from the catalogue until their engines, program
data, translations, artwork, themes and verification gates are complete.

## Documentation

Start with the [documentation index](docs/INDEX.md).

Key documents:

- [Product definition](PRODUCT.md)
- [Design system](DESIGN.md)
- [Master program record](PLAN.md)
- [Expansion roadmap](docs/roadmap/master-expansion.md)
- [Training-plan index](docs/plans/INDEX.md)
- [Exercise architecture](docs/architecture/exercise-system.md)

Historical implementation logs and superseded design drafts are preserved under
[`docs/archive`](docs/archive/INDEX.md); they are not current implementation
authority.

## Development

```powershell
npm install
npm run dev
```

Create a production build:

```powershell
npm run build
```

## Verification

The project uses focused TypeScript verification scripts rather than one general
unit-test runner. Available commands are defined in `package.json`. The core
suite currently includes registry, onboarding, calibration, plan lifecycle,
progression, exercise-library, technique, extra-set, volume, Adventure and Super
Mutant checks.

Run the relevant scripts for every changed subsystem and finish with
`npm run build`. New shared engines require example tests and invariant/property
tests; new plans must also satisfy the gates in the expansion roadmap.

## Architecture at a glance

- React, TypeScript and Vite provide the application shell.
- Firebase Authentication/Firestore store user profiles and workout logs.
- `PlanConfig` objects define registered plans.
- `definePlan()` builds ordinary declarative programs.
- Bespoke generators remain available for behavior such as Super Mutant and
  Trinary.
- `resolveDay()` layers canonical exercise data, plan configuration and user
  preferences over a generated workout.
- Pure save-time handlers under `src/features/workout/progression/` compute plan
  progression before Firestore writes are applied.

## Documentation discipline

Any plan behavior change must also update its concise document under
`docs/plans/` and the detailed record in `PLAN.md`. Major iterations require the
local `PLAN.md` backup specified by the project rules.
