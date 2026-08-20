# PROC-1 build review — branch `impl/v2-proc-1`

**Date:** 2026-08-20 · **Reviewed against:** `docs/plans/v2/_implementation-plan.md`

The build covers the plan well. Phase 0 is root-caused properly, Phases 1, 2, 5
and 6 are substantially complete, and every existing verification passes. The
one systematic gap was **Phase 3's set-shape policy**, which was not applied at
all — fixed in this pass, along with a set of voted content items that had been
missed.

---

## What the build got right

### Phase 0 — the write path, root-caused

This was the highest-priority item in the plan and it is genuinely solved. The
`permission-denied` failures were **Firestore's 1000-expression evaluation cap**:
`allowedPlanIds.hasOnly(validPlanIds())` rebuilt a 39-entry list to compare
against, blew the cap, and the evaluator failed closed.

That explains every symptom the audit could not: workout logs (a cheaper rule)
still saved, an Admin SDK write of the identical payload succeeded because it
bypasses rules, and no clause trace ever found anything wrong with the payload.
`planIdCount()` now pins the length as a constant with
`scripts/verify-profile-rules.ts` checking it against the real list, and
`firebase.json` gained an emulator config so the rules can be tested.

### Phase 1 — all five shared fixes landed

| Fix | State |
|---|---|
| T-1 / T-9 dashboard week key | `dashboardViewWeek-${user.id}-${user.programId}` ✅ |
| T-2 / T-28 reset allowlist | Derives from `PLAN_STATUS_FIELD` in the new `src/data/planStatus.ts`, and clears `planPreferences` ✅ |
| T-23 system weight | `src/features/workout/systemWeight.ts` ✅ |
| T-22 `liftHistory` | `src/features/workout/progression/liftHistory.ts`, keyed per plan ✅ |
| `volumeAnalysis.ts` double-count | Collects distinct groups then credits once ✅ |

### Phase 2 — library complete

All 13 ids present, `reverse-nordic-curl` reclassified to `knee-extension` /
quads, and the hip-supported deadlift merge done properly: aliases folded into
the survivor, the loser marked `deprecated`, and no plan still resolving to it.
`stripper-squat` was also corrected to `knee-extension`.

The Tricep Giant Set became a shared component (`src/data/tricepGiantSet.ts`)
referenced by both Bench Domination and Arms Race, and `volumeAnalysis.ts` now
expands giant-set steps — so its triceps work is finally visible to the volume
checks.

### Phases 5 and 6

Nine of ten card changes applied, Iron Clock hidden via a proper
`hiddenFromCatalogue` flag that keeps it in the registry, Ritual's frequency
corrected to 3/4, and Pain & Glory's specialisation declared as
`['back', 'hamstrings', 'glutes']` — a better call than the plan's suggestion.

Every new engine module is wired in and imported, not dead code: the rotation
scheduler, Blackout's single-set enforcement, the Event Horizon / Gravity /
Lazarus / Quadfather / REDLINE progressions, `PlanMechanics.tsx` and the Neural
Overload dashboard.

---

## What was missing, and is now fixed

### The set-shape policy had not been applied

Phase 3's floor (every working slot ≥ 2 sets) and cap (accessory isolations ≤ 3
unless the plan specialises in that muscle) were not implemented. **48
unexplained flags against a target of zero.**

Fixed across 13 plans — 44 slots raised off one set, and cap breaches trimmed on
Purgatorio (6 isolation slots the pair map left at 4), Monolith, Tenfold and
Venus.

**One real bug found while fixing this:** Arms Race's `bicepsGiantSet` transform
matched on exercise id alone, so it collapsed the **Lengthened day's** 3-set
incline curl into a single myo-rep set as well as the nuclear day's. Since the
nuclear load is prescribed as a percentage of that day's working weight, the
plan was reading from a set that no longer existed. Now scoped to the nuclear
day, with the genuine single-set slot given a named exemption.

### Voted content that had been skipped

| Plan | Missing | Vote |
|---|---|---|
| **Pain & Glory** | Both push days were identical again — Thursday now takes a paused bench and rear-delt work | PG-V-push |
| **Peachy** | No core at all; leg-press calf raise | PEA-V-core, XR-calf |
| **Quadfather** | Hammer chest press still in the maintain slot; no overhead triceps | QF-V-pec, QF-V-tri-core |
| **Bench Domination** | Both leg days ran hip adduction; two dragon-flag slots and no cable crunch | BD-E19, BD-V-core |
| **Ritual** | Cable crunch and the chest-supported row absent from the accessory lists | RIT-V-core, RIT-V-row |
| **30 Minute Adventure** | All three cable-pull-through pairs still present; none of the four new pairs; an off-step calf raise | ADV-V-pullthrough, ADV-V-new-pairs, XR-calf |

Two new tip keys (`pausedBenchPG`, `rearDeltPG`) added in both languages, and
`verify-adventure.ts`'s pinned pair counts updated to 34 with the reason noted.

### The standing checks were pointed at the simulation

`review-flags.ts` and `spec-fit.ts` both ran through `simulate()`, which layers
the change maps on top of the plans. Now that the changes are implemented, that
would have applied every edit a second time — the checks would have been
measuring a fiction. Both now read the shipped plans directly.

---

## New verification

Three gates added to `package.json`:

```bash
npm run verify:flags             # set-shape, --strict, currently 0 unexplained
npm run verify:spec-fit          # card versus content
npm run verify:portfolio-shape   # the plan's §7.2 portfolio targets, --strict
```

`scripts/portfolio-metrics.ts` was also brought in line with the app: it now
expands giant sets and prefers an explicit `exerciseId` over the free-text name,
matching `volumeAnalysis.ts`.

### Where the portfolio landed

| Target (plan §7.2) | Goal | Shipped |
|---|--:|--:|
| Near-clone pairs (>0.5 overlap) | 1 | **1** |
| Mean pairwise similarity | 0.130 | **0.133** |
| Library movements in use | 191 | **187** |
| Median distinct exercises | 23 | **22** |
| Median weekly sets | 74 | **74** |
| Median axial per set | 0.38 | **0.38** |
| Unexplained set-shape flags | 0 | **0** |

Library-in-use is 187 rather than 191 because dropping the three
cable-pull-through pairs removed those movements from Adventure's reachable
pool — the intended consequence of ADV-V-pullthrough.

All 15 verification scripts pass and `tsc` is clean.

---

## Follow-up pass — the pull-up ladder and REDLINE's fatigue

### Bench Domination: the ladder was documented but never wired

`translations.ts` describes the whole progression, and the code did not follow
it:

| Weeks | Prescription in the tips | Sets in code | Sets now |
|---|---|--:|--:|
| 1–3 | max strict reps EMOM until form breaks | **1** | 8 |
| 4–6 | 3–5 reps EMOM for 12–15 minutes | **1** | 12 |
| 7–9 | max triple + 4–6 back-off triples | 7 | 7 |
| 10 | max single test, then back-offs | 4 | 4 |
| 11–13 | 3–5 sets of 2–3 reps @ 92.5% | 5 → 4 | 5 → 4 |

Reps come down as load goes up, so sets have to come up to meet them. The flat
`1` for weeks 1–6 was the 0-set bug patched with a placeholder rather than the
ladder, which is why the plan still read as having almost no back work.

Two further fixes went with it: set counts now key off `displayWeek` like the
reps do — using raw `w` desynced them either side of the week-9 deload — and the
five `pullupWeeks*` tips are now attached to the exercise, so the athlete can
actually see the scheme.

Saturday carries a fixed lighter dose (3–4 sets) rather than the full EMOM: it
is the AMRAP test day at ten sets, and the weeks 10–13 progression block already
treats Wednesday as the pull-up day. **Back volume: 8 → 17 sets.**

The 8- and 12-set EMOM blocks are exempted in `review-flags.ts` by name, the
same way Trinary's dynamic-effort squat is.

### REDLINE: back to fatigue 3

It declared 3 and measured 4. The cause was the batch-8 "no 1-set slots" pass
being applied to its **timed finishers**, which are blocks prescribed in minutes
(`durationSeconds`, rising 300 → 480 across the phases) rather than sets. The
set-shape floor skips blocks for exactly that reason; overriding it ran every
finisher twice, adding roughly a third of a session to a plan that promises
forty to fifty minutes.

All finishers are back to one round. **73 sets, systemic 120, axial 30 — measured
fatigue 3, matching the card.**

The gains that were actually asked for are untouched: triceps, calves and core
all sit at **4 sets**, because the implementation put them in burn slots rather
than finishers, which is where real sets belong.

---

## Still open — owner decisions, not defects

1. **Bench Domination frequency** — the card declares 4, the template runs six
   days. Correct the card, or make the default four via BD-E1's module toggles.
2. **Bench Domination biceps still measures zero** — the weighted pull-up lists
   `lats` as its only primary muscle. That is a library attribution question,
   not a plan one; a chin-up would carry biceps.
3. **Fatigue ratings still off by two bands:** Pencilneck declares 2 / measures
   4, and Cathedral declares 3 / measures 1. (REDLINE is now resolved.)
4. **Monolith is newly flagged on experience** — open to beginners at 22.7 sets
   a session, just over the threshold. A consequence of the 3-day rebuild
   concentrating the same work into fewer sessions.
5. **`cable-triceps-extension` and `cable-crunch` concentrations** — the
   pressdown half of the triceps rule and the core rule still never got the
   per-plan assignment the overhead half did.

## One note on the tooling

`scripts/build-portfolio-report.ts`, `sim-v2-portfolio.ts` and the three change
maps are now **historical record**. They describe how the plans got here and
should not be re-run against the implemented plans — doing so double-applies
every edit. The live checks are `verify:flags`, `verify:spec-fit` and
`verify:portfolio-shape`.
