# HyperPlanner documentation

This is the entry point for current product, training-plan and implementation
documentation. Documents under `archive/` preserve design history and source
material; they are not implementation authority.

## Start here

- [Product definition](../PRODUCT.md)
- [Current design system](../DESIGN.md)
- [Master expansion roadmap](roadmap/master-expansion.md)
- [Documentation cleanup report](roadmap/documentation-cleanup-report.md)
- [Training-plan index](plans/INDEX.md)
- [Post-rebuild plan review](analysis/plan-review-post-rebuild.md)
- [Rep-scheme and runtime review](analysis/rep-scheme-review.md)
- [Master program record](../PLAN.md)

## Architecture

- [Exercise system](architecture/exercise-system.md)
- [PerformanceProfile](architecture/performance-profile.md)
- [Shared session and lifecycle engines](architecture/shared-session-engines.md)
- [Exercise-tip authoring and audit](architecture/exercise-tip-authoring.md)
- [AI integration](architecture/ai.md)
- [Portfolio and recommendations](architecture/portfolio.md)
- [Tip system](architecture/tips.md)
- [Admin composer](architecture/admin-composer.md)
- [Translation reference](../TRANSLATIONS.md)

## Implementation-ready plan specifications

- [Apex Predator](plans/specs/apex-predator.md)
- [House of Iron](plans/specs/house-of-iron.md)
- [Venus Rising / Athena / Kali](plans/specs/venus-athena-kali.md)

Every plan in the roadmap is now implemented and verified. Each has a canonical
runtime document under [plans/](plans/INDEX.md) and its own `npm run verify:*`
script; the specs above are retained as the pre-implementation record.

## Operations

- [Admin-device setup](../ADMIN_DEVICE_SETUP.md)
- [Repository implementation guide](../README.md)

## Historical material

See the [archive index](archive/INDEX.md) for completed UI-overhaul decisions,
superseded source plans, previous handoffs and legacy plan drafts.
