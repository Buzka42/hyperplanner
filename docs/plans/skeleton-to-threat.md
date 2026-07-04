# From Skeleton to Threat

**Program ID:** `skeleton-to-threat` · **Source:** [src/data/skeleton.ts](../../src/data/skeleton.ts)
**Duration:** 12 weeks · **Frequency:** user-selected days (every selected day is the same full-body session)

A beginner full-body program. The week grid is generated empty; `preprocessDay` injects the same six-exercise session into every day the user selected during onboarding, and marks everything else Rest & Recovery.

## The Session (every training day)

| # | Exercise | Sets | Reps |
|---|---|---|---|
| 1 | Deficit Push-ups | 3 | AMRAP |
| 2 | Leg Extensions | 3 (+1 late) | 12–20 |
| 3 | Supported Stiff-Legged DB Deadlift | 3 (+1 late) | 10–15 |
| 4 | Standing Calf Raises | 3 (+1 late) | 15–20 |
| 5 | Inverted Rows | 2 (+1 late) | 8–15 |
| 6 | Overhand Mid-Grip Pulldown | 2 (+1 late) | 10–15 |
| 7 | Planks | 3 | starts at 30s, see below |

**Late-phase volume bump:** from **Week 9** every exercise except push-ups and Planks gets +1 set (`getSets`).

### Planks: time-based progression

Planks is bodyweight/time only — the weight input is disabled. The target hold time starts at **30 seconds** and is persisted in `skeletonStatus.plankTargetSeconds` (defaults to 30 when unset). Each exercise render reads this stored value directly into `target.reps` (e.g. `"30sec"`), so it's the single source of truth for both the displayed target and the advice check.

On save, if **all sets** hit the current target time, `plankTargetSeconds` is incremented by **+10 seconds** for the next session (`handleSaveSession` in WorkoutView.tsx). The advice pill (`getExerciseAdvice`) parses the *current* target directly out of `exercise.target.reps` (rather than needing separate history lookups) and shows "Add 10 seconds from last session!" once all sets meet it. The accompanying tip explains the rule ("Hold each plank for the target time. Hit the target on ALL sets → +10 seconds next session.").

## Progression Rules (`getExerciseAdvice`)

No calculated weights — everything is beat-your-log:

- **Deficit Push-ups:** always shows "Try to beat: {last max reps}".
- **Leg Extensions:** all sets ≥20 → "+5 kg".
- **Supported SLDL:** all sets ≥15 → "+2.5 kg" if already ≥10 kg per hand, otherwise "+1 kg each dumbbell".
- **Standing Calf Raises:** all sets ≥20 → "switch to single-leg"; **Single Leg Calf Raises** at 20s → "+5 kg dumbbell".
- **Inverted Rows:** all sets ≥15 → "go deeper — decrease body angle".
- **Pulldown:** all sets ≥15 → "+7 kg".

Both modern (`exercises[].setsData`) and legacy (`setResults`) log formats are handled when reading history.

## Completion & Widgets

- Saving the session on the **highest selected day of Week 12** sets `skeletonStatus.completed`, triggers the victory screen, and awards **Certified Threat**; the follow-up screen offers trainer contact.
- Dashboard widgets: metamorphosis countdown (weeks remaining), Deficit Push-up PR (max reps in any single set across all logs), rest-day quotes.
