# PerformanceProfile — shared system spec

Design doc: `HYPERPLANNER_VENUS_ATHENA_KALI_VALKYRIE_PLAN.md` §20–22, §25, §29
(items 16–20). This is the shared infrastructure Kali's load-transfer hierarchy
needs, built to span every plan per the owner's decision — not just
Venus/Athena/Kali.

**Grounded in the real save path**, not the doc's pseudocode, because the doc's
"do not build an Athena-specific import system" instruction only works if this
plugs into something that already touches every plan. It does:
`WorkoutView.handleSaveSession` is the **one** write path every plan's session
goes through, declarative or hand-written — the existing calibration block
(Section A) already runs there unconditionally, "for every plan, not just those
with a per-plan handler." PerformanceProfile is a second unconditional block
next to it. **This means "existing plans start writing to it too" is a
one-file change, not nineteen.** No per-plan progression handler is touched.

---

## 1. Owner decisions

| # | Question | Decision |
|---|---|---|
| 1 | Scope | **Ecosystem-wide** — reads and writes span all plans, not just Venus/Athena/Kali |
| 2 | Trust model | Non-exact history is a **suggestion**, never silent truth |
| 3 | Suggestion behaviour | **Shown, with an opt-in calibration offer** — the athlete chooses whether to calibrate, never forced |
| 4 | Sister-plan exception | **Exact-match history from a direct Venus/Athena → Kali switch is trusted**, skips the offer, same as ordinary same-plan history |
| 5 | Write model | **Existing plans write to it too** (see above — centralized, not per-plan) |

---

## 2. Data model

```ts
// users/{uid}.performanceProfile — a map, not a subcollection: it is read as
// a whole on every load-resolution, and Firestore document reads are cheaper
// than a query per exercise.
performanceProfile: {
  [exerciseId: string]: {
    latestWeight: number;
    latestReps: number;
    latestE1RM: number;          // Epley, best set of the session
    date: string;                 // ISO
    sourceProgram: string;        // programId at time of logging
    recent: { weight: number; reps: number; e1rm: number; date: string }[];  // capped at 5, newest first
  }
}

// Written alongside programId at every switchProgram call — the one field
// this spec adds to that function.
lastProgramId?: string;   // the programId being switched away from
```

**Keyed by canonical `exerciseId`, not display name.** Names get translated and
renamed (the plan-id rename this session did the same for plans); the library's
`exerciseId` is already carried on `sessionLog.exercises[].exerciseId` when the
resolver can determine it, and is stable across renames by design — the whole
point of the alias table. An exercise logged only under a bare display name (no
`exerciseId` resolved) does not enter PerformanceProfile; it stays exact-match
findable through the existing per-plan workout history the way it already is.

## 3. The write hook

One addition to `handleSaveSession`, positioned next to the existing
plan-agnostic calibration block (`src/pages/WorkoutView.tsx`, after progression
handlers run, using the same `sessionLog.exercises` already being assembled for
the workout log write):

```ts
// Plan-agnostic, like calibration above it. Reads the same sessionLog.exercises
// this save is already writing to the workouts subcollection.
const profileUpdates: Record<string, unknown> = {};
for (const ex of sessionLog.exercises) {
  if (!ex.exerciseId) continue;
  const sets = validSets(ex.setsData);
  if (!sets.length) continue;
  const best = bestByEpley(sets);
  profileUpdates[`performanceProfile.${ex.exerciseId}`] = {
    latestWeight: best.weight, latestReps: best.reps, latestE1RM: round2p5(epley(best.weight, best.reps)),
    date: sessionLog.date, sourceProgram: programData.id,
    recent: [{ weight: best.weight, reps: best.reps, e1rm: ..., date: sessionLog.date }, ...(prior.recent ?? []).slice(0, 4)],
  };
}
if (Object.keys(profileUpdates).length) await updateDoc(userRef, profileUpdates);
```

`bestByEpley` and `validSets` are already written — `calibration.ts` has them
for the exact same purpose (best-set selection for a 1RM estimate). Reused, not
reimplemented.

**`switchProgram`** (`UserContext.tsx`) gains one field on its existing update:
`lastProgramId: currentId` — it already computes `currentId` before the write,
so this is a one-line addition, not new logic.

## 4. The transfer hierarchy

Doc §21, implemented as `resolveStartingLoad(profile, targetExerciseId, lastProgramId)`:

| Tier | Match | Confidence | Source |
|---|---|---|---|
| 1 | Exact `exerciseId` in `performanceProfile` | HIGH | direct lookup |
| 2 | Explicit "close variation" pair | MEDIUM-HIGH | new hand-authored table, see §5 |
| 3 | Same `pattern` (movement family) | MEDIUM-LOW | derived from existing `LibraryExercise.pattern` — no new data |
| 4 | Overlapping `primary` muscle, best e1RM among candidates | LOW | derived from existing `LibraryExercise.primary` |
| 5 | Nothing found | — | no suggestion; behaves exactly like today's uncalibrated slot |

Tiers 3 and 4 are **derived from metadata the library already has**
(`pattern`, `primary`) rather than a second hand-authored table — the doc asks
for a "movement family" and "muscle family" fallback, and those are already
first-class fields on every `LibraryExercise`. Only tier 2 ("close variation")
needs new authored data, because "Barbell Bench → Hammer Chest Press" isn't
derivable from pattern/muscle alone (both share pattern *and* primary muscle
with plenty of other exercises that are not close variations).

### Tier 5 confidence, and what "trusted" changes

Per decision 3, tiers 2–4 (and tier 1 from a **non**-sister-plan source) are
**shown, never silently applied**: the console renders the suggested load with
its source (`"Suggested: 42.5kg — from Machine Chest Press, Venus, 3 weeks
ago"`) and an **optional** "Run a calibration set instead" affordance. Neither
choice blocks the session — declining just means the suggested number is what
gets prescribed, editable like any other field.

Per decision 4, **tier 1 exact-match where `lastProgramId` is `venus-rising` or
`athena` and the switch was direct** is trusted outright — no offer shown, same
as ordinary same-program history behaves today. "Direct" means `lastProgramId`
still points at that plan; switching through a third plan in between clears the
special case (an athlete who went Venus → Bench Domination → Kali gets the
ordinary tier-1 treatment, not the trusted one, because the `lastProgramId`
write happens on every switch and only remembers the most recent hop).

## 5. What still needs authoring

- **Tier-2 "close variation" table.** Small and hand-curated — pairs the doc
  itself names (Barbell Bench ↔ Hammer Chest Press) plus whatever Venus/
  Athena/Kali's own exercise lists turn up as genuinely equivalent swaps.
  Not derivable; do this when the three plans' exercise lists are finalized so
  the pairs that actually matter are known rather than guessed.
- **Exercise-level calibration.** Distinct from Section A's calibration (which
  is keyed to the fixed `LiftingStats` enum — squat, pausedBench, etc. — and is
  plan-onboarding-scoped). This is calibration for **any** exercise in
  `performanceProfile`, triggered by the athlete's own choice mid-plan rather
  than a fixed onboarding step. Shares the calibration-band UI and the
  Epley-on-best-set maths; needs its own trigger (a per-slot flag rather than
  `pendingCalibration: (keyof LiftingStats)[]`) and writes to
  `performanceProfile`, not `stats`.

## 6. What this spec does not do

- It does not touch any of the 19 existing plans' progression handlers or
  onboarding steps. They keep computing loads exactly as they do today;
  PerformanceProfile is a passive passenger on the save they already make.
- It does not replace `LiftingStats` / `pendingCalibration` (Section A). Those
  remain the mechanism for a plan's own declared onboarding maxes; this is the
  mechanism for "I switched plans and need a number for a lift I've never done
  under this plan's name for it."
- It does not yet decide what, if anything, other plans *read* from it. Kali is
  the first and, for now, only consumer. Extending read access to other plans
  is a separate decision when a plan actually wants it.
