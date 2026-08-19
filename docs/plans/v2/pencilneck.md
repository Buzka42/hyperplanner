# Pencilneck Eradication

> Unified plan document, v2 format. Supersedes `docs/plans/pencilneck-eradication.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `pencilneck-eradication` |
| **Length** | 8 weeks/cycle, repeatable (Cycle 2+ changes phase timing, not duration) |
| **Frequency** | 4 days/week, Push A / Pull A / rest / Push B / Pull B |
| **Weekly sets** | **91, constant across all 8 weeks** — no deload, only reps/technique change by phase |
| **Declared kind** | upper-body hypertrophy split (card claim — see §1) |
| **Calibration** | none — pure user-entered double progression, app never sets weight |
| **Source** | `src/data/pencilneck.ts` (381 lines, **bespoke object literal**, not `definePlan()`) + `src/features/workout/progression/historyEntries.ts` (`pencilneckProgression`) |
| **Stated promise** | *"8-week upper body hypertrophy split. For those who look like a lollipop. Push / Pull Split."* |

---

## 1. Headline finding

**Pencilneck is Wave 2's one bespoke-engine plan, and it does not confirm the "generic engine is safer" pattern — but it doesn't reproduce Wave 1's worst failure modes either. Instead it introduces a new local defect class not yet seen in the audit: `pencilneckStatus` is overwritten (not merged) by two different write sites, so its shape silently drifts across the plan's own lifecycle.**

`historyEntries.ts` (completion) writes:
```ts
updates: { pencilneckStatus: { completed: true, completionDate: ... } }
```
`Dashboard.tsx`'s "Start Cycle 2" button writes:
```ts
updateUserProfile({ pencilneckStatus: { cycle: nextCycle, startDate: now }, ... });
```
Both are **plain-object replacements of the entire field**, not merges — confirmed by `ProgressionResult`'s merge function (`progression/types.ts`, `Object.assign({}, ...results.map(r => r.updates))`, shallow) and by Firestore's own `updateDoc` semantics for a top-level map field written as a plain value. So immediately after finishing Week 8, `pencilneckStatus` has no `cycle`/`startDate` until "Start Cycle 2" is clicked; immediately after that click, it has no `completed`/`completionDate` until the athlete finishes again. The declared type (`PencilneckStatus = { cycle, startDate, completed?, completionDate? }`) is never actually guaranteed to hold all four fields at once during real use — a genuine defect, though a quiet one (nothing currently reads a field expecting it to coexist with the others).

**Separately: "upper body hypertrophy split" is not accurate as literally worded.** Every one of the 4 training days embeds 2-3 lower-body exercises — roughly a third of each 9-exercise session's slot count:

| Day | Lower-body slots |
|---|---|
| Push A | Hack Squat, Leg Extensions, Leg Press Calf Raises |
| Pull A | Romanian Deadlift, Lying Leg Curls, Hanging Leg Raises |
| Push B | Front Squats, Walking Lunges, Hack Calf Raises |
| Pull B | Stiff-Legged Deadlift, Seated Leg Curls, Ab Wheel Rollouts |

The plan's own original doc already flags this internally ("push/pull split with legs folded into each day"), so the author was aware — this is a card-copy accuracy gap, not a hidden defect. Minor relative to the plans found with genuinely broken headline features (Event Horizon), but the "For those who look like a lollipop" framing specifically promises an upper-body-only identity that the actual session composition doesn't deliver.

---

## 2. Structure

### Static data vs. what actually renders — the biggest single gap in this plan

The static day data (`generatePencilneckWeeks()`) shows **every exercise at
3 sets**, and the original doc's weekly tables match that. **This is not
what ships.** `preprocessDay` unconditionally clamps every non-compound
(isolation) exercise to 2 sets, every week, regardless of phase:

```ts
exercises = exercises.map(ex => {
    if (COMPOUND_EXERCISES.has(ex.name)) return ex;
    return { ...ex, sets: Math.min(ex.sets, 2),
        prescription: { ...ex.prescription, technique: { kind: 'last-set-failure' } } };
});
```

**Confirmed live**, Week 5, Push A: Flat Barbell Bench Press, Incline DB
Press, and Seated DB Shoulder Press (all in `COMPOUND_EXERCISES`) rendered
at 3 sets; Cable Flyes, Lateral Raises, Overhead Tricep Extensions, Leg
Extensions, and Leg Press Calf Raises (all isolation) rendered at 2 sets
with a "Last set to failure" badge — exactly matching the clamp, and
exactly contradicting the static 3-set table both the original doc and the
plan-picker's implied volume suggest.

Real weekly totals, computed from the runtime clamp (20 compound-slot sets
+ isolation-slot sets per day):

| Day | Compound slots (3 sets) | Isolation slots (2 sets) | Total |
|---|---|---|---|
| Push A | 4 | 5 | 22 |
| Pull A | 5 | 4 | 23 |
| Push B | 6 | 3 | 24 |
| Pull B | 4 | 5 | 22 |

**91 sets/week, identical every week of all 8 weeks** — there is no
explicit deload anywhere in the 8-week block; only rep targets (compounds
→ 6-10 reps in weeks 5-8) and intensity technique (last-set drop-set/
rest-pause on compounds, cycle-1 weeks 7-8 only, cycle-2+ every week)
change across the block. Confirmed live at week 5: compounds rendered
3×6-10, matching the "Heavier Phase" transform exactly.

### `xStatus`, T-2, T-3, T-4, reverse-nordic

- **`pencilneckStatus`** exists and **is** one of the only 3 plans already
  in `resetProgram()`'s allowlist (`UserContext.tsx:469`) — confirmed
  correct as far as it goes: setting the field to `null` does fully clear
  whatever partial shape it currently holds. **New gap found**, however:
  `resetProgram()` does not touch `pencilneckBenchHistory` (a separate
  array field, `types.ts:410`), which `getExerciseAdvice`'s Week-5 seed and
  Cycle-2 reload math both scan directly. "Reset Current Progress" clears
  cycle/status but leaves the athlete's full historical bench-load record
  intact and still influencing future weight suggestions — the button's
  blanket "reset" framing isn't fully honest for this plan even though it's
  nominally on the allowlist.
- **No `type: 'wave'` progression** — not exposed to T-3.
- **No classic T-4 duplicated-branch pattern** — `COMPOUND_EXERCISES` is a
  single `Set`, checked by membership everywhere, not re-implemented per
  callsite. However, `getExerciseAdvice` has the same lookup logic
  copy-pasted 4 times verbatim (not diverged, but a latent risk: a future
  edit to only one copy would silently reintroduce real T-4-style drift).
- **No `reverse-nordic-curl`** anywhere in this plan.

---

## 3. Findings

### 3.1 `pencilneckStatus` shape drifts across the plan lifecycle · **severity: medium, `plan-local`**

Detailed in §1. Two independent write sites each shallow-overwrite the
whole field instead of merging, so the declared 4-field type is never
actually guaranteed to hold all fields at once during real use. Currently
low-visible-impact (nothing crashes), but it's exactly the kind of
"different parts of the app assume different shapes for the same object"
bug that becomes a real defect the moment a third feature reads a field
that's currently being silently dropped.

### 3.2 Static 3-set data vs. runtime 2-set isolation clamp · **severity: medium, `plan-local`**

Detailed in §2. The card, onboarding copy, and original doc all describe
(or imply, via the unmodified static table) a 3-sets-everywhere program;
the actual delivered volume on isolation work is a third lower. Not a
functional bug — the clamp itself may be a deliberate fatigue-management
decision — but it's undocumented anywhere a reader would see it, and it's
large enough (91 real sets/week vs. a naive 108 sets/week read off the
static table) to materially change any volume analysis done from source
alone, which is exactly why the audit's standing rule (§7 of
`_audit-status.md`) insists on live verification over source reading.

### 3.3 `resetProgram()` doesn't clear `pencilneckBenchHistory` · **severity: low, `plan-local`**

New gap, detailed in §2. `pencilneckStatus` is correctly nulled but the
separate strength-history array survives a reset and continues to
influence `getExerciseAdvice`'s Week-5/Cycle-2 weight-suggestion math.

### 3.4 "Upper body hypertrophy split" oversells the actual session composition · **severity: low, `plan-local`**

Detailed in §1. Roughly a third of every session is lower-body work; the
plan's own original doc already flags this internally, so it's a stale
card-copy issue rather than a hidden surprise.

### 3.5 Plan-switch bug (T-9) reproduces a fifth time · **severity: high, `shared-bug`**

Fresh Pencilneck registration (continuing the `test_claude` session from
Tenfold's stale week 5) showed "NEXT SESSION — WEEK 5" with no
`programProgress['pencilneck-eradication']` entry and a fresh `startDate`
in Firestore — confirmed directly. Interesting variant: **Pencilneck's own
routing doesn't use `Dashboard.tsx`'s generic `programProgress`/localStorage
resolver the same way as the other Wave 2 plans** — this plan is bespoke,
yet the *exact same* stale-week-5 symptom appeared, because the dashboard's
`dashboardViewWeek-${user.id}` cache key (T-9's root cause) is shared
app-wide regardless of which plan's engine is active underneath. Fifth
consecutive confirmation, first on a bespoke-engine plan — strong evidence
this bug is 100% independent of plan architecture.

### 3.6 UI/UX (live clickthrough) — genuinely fun, well-built presentation

| Finding | Severity | Detail |
|---|---|---|
| "Trap Barometer" widget | — (positive) | Dashboard shows a themed "Pencil → Boulder" progress meter ("63% GONE") — a nice, on-brand touch confirmed rendering correctly |
| Rest-day flavor text | — (positive) | Randomized joke copy ("Hoodies file for asylum") shown on rest days — confirmed present, adds personality without affecting function |
| Compound/isolation split renders correctly | — | 3-set compounds, 2-set last-set-failure isolations, matching the runtime clamp exactly |
| Heavy-phase reps | — | Week 5 compounds correctly showed 6-10 reps, confirming the `isHeavierPhase` transform |
| SWAP button on alternates | — | Hack Squat correctly showed a SWAP affordance (alternates: Leg Press) |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 4. Weekly volume (runtime set counts — 91 sets/week, constant)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Lats (lower)** | **19.25** | | Front delt | 18.00 |
| Pec (lower) | 14.50 | | Pec (upper) | 13.25 |
| Triceps (lateral/medial) | 13.00 each | | Biceps (long) | 12.75 |
| Teres major | 12.00 | | Rear delt | 12.00 |
| Rhomboids | 11.75 | | Quads (3 heads) | 11.00 each |
| Trap (mid) | 11.00 | | Glute max (lower) | 10.50 |
| Biceps femoris / semiMembTend | 10.00 each | | Triceps (long) | 9.75 |
| Erectors | 9.50 | | Side delt | 7.00 |
| Abdominal wall | 5.75 | | Gastrocnemius | 5.00 |
| Rectus femoris | 4.75 | | Biceps (short) | 4.70 |
| Lats (upper) | 4.50 | | Brachialis | 4.50 |

All 17 distinct exercises resolved to attribution rows via name/alias
matching — no unmatched exercises. **Front delt double-dipping is the
clearest structural finding**: four separate prime-mover front-delt
movements in the same week (Flat Bench, Incline Bench ×2, Standing
Military Press, Seated DB Shoulder Press) push front delt to 18.0
fractional sets/week — the highest single non-back/chest number in the
whole table, and a textbook case of the attribution map's own §16 warning
about press-heavy plans stacking front-delt volume without realizing it.
**Lats skew heavily toward `latsLower`** (19.25) over `latsUpper` (4.5) —
every pull exercise in the plan is a narrow/neutral/straight-arm pattern,
none targets the upper-lat fibers specifically. Erectors (9.5) come
entirely as a deadlift-variant by-product, consistent with the map's §25
portfolio-wide finding that no plan trains erectors directly.

---

## 5. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **147** |
| Axial | **45** |
| Sets | 91 |
| Per-set systemic | **1.62** |

Highest axial load of any Wave 2 plan audited (Monolith 28, Purgatorio 52,
Event Horizon 31, Tenfold 31 at full volume) — driven by 4 different
squat/deadlift-pattern compounds spread across all 4 training days (Hack
Squat, Front Squats, Romanian Deadlift, Stiff-Legged Deadlift), each
carrying real axial cost despite the plan's "upper body" framing. This is
the numeric confirmation of §3.4/§1's finding: the lower-body work isn't
just present in the exercise list, it's a meaningful fraction of the
plan's total joint stress too, not incidental accessory volume.

---

## 6. Improvements, ranked

### 1. Merge, don't overwrite, `pencilneckStatus` at both write sites · `plan-local`

Change `historyEntries.ts` and `Dashboard.tsx`'s "Start Cycle 2" handler to
spread the existing `pencilneckStatus` before applying their partial
update (`{ ...user.pencilneckStatus, completed: true, completionDate }`
and the equivalent for cycle/startDate), so the object never silently loses
fields mid-lifecycle.

### 2. Reconcile the static 3-set data with the runtime 2-set clamp · `plan-local`

Either update the static day data to already reflect 2 sets on isolation
work (so source, doc, and runtime all agree), or make the runtime clamp
configurable/documented if 3-set isolation work is sometimes intended —
right now the static data actively misleads anyone reading source instead
of testing live, which is exactly the failure mode the audit's standing
verification rule exists to catch.

### 3. Add `pencilneckBenchHistory` to `resetProgram()`'s clear list · `plan-local`

So "Reset Current Progress" actually resets the inputs that feed
`getExerciseAdvice`'s automated weight suggestions, not just the cycle
counter.

### 4. Correct "upper body hypertrophy split" or restructure the lower-body slots as clearly-labeled maintenance work · `plan-local` (`hypothesis`)

Either adjust the card/onboarding copy to acknowledge the roughly
one-third lower-body content (the plan's own original doc already does
internally), or, if a genuinely upper-body-only version is desired, move
the lower-body slots to a clearly optional/maintenance tier.

### 5. Namespace the dashboard view-week cache by program · `shared-bug`

Same T-9 recommendation as every other Wave-2 plan — fifth confirmation,
first on a bespoke-engine plan, strengthening the case that the fix
belongs in `Dashboard.tsx` itself rather than anywhere plan-specific.

---

## 7. Verdict

**Pencilneck is a well-built, characterful plan with real personality
(Trap Barometer, rest-day jokes) and a genuinely competent bespoke
progression system underneath — but it's the plan where the gap between
"what the static data/doc says" and "what actually ships" is largest in
Wave 2, and it introduces a new bug class (partial-object status
overwrites) the audit hasn't seen before.**

The compound/isolation rep-and-technique logic is well thought through
(heavier phase for compounds only, intensity techniques gated correctly by
cycle and week, a genuine "Final Exam" flourish in week 8), and the
`COMPOUND_EXERCISES`-as-single-source-of-truth design avoids the classic
Bench-Domination-style duplicated-branch bug that plagued Wave 1's other
bespoke engines. But the always-on isolation-set clamp — real, confirmed
live, and never mentioned anywhere outside the source code's own inline
comments — means the plan an athlete actually trains delivers meaningfully
less isolation volume than either the static data or the original doc's
tables suggest. Combined with the `pencilneckStatus` overwrite bug and the
"upper body" framing not quite matching a session composition that's
roughly a third lower-body work, this is a plan whose engineering is solid
but whose self-description, in three separate small ways, doesn't quite
match what ships.

---

## 8. Export block

```yaml
id: pencilneck-eradication
version: 2
length: { weeks: 8, cycles: repeatable }
frequency: 4_per_week
weekly_sets: { constant_all_8_weeks: 91 }
kind: upper_lower_hybrid_marketed_as_upper_body
calibration: none
engine: bespoke_object_literal
status_field: pencilneckStatus
systemic_load: { weekly: 147, axial: 45, sets: 91, per_set: 1.62 }
volume_top: { latsLower: 19.25, frontDelt: 18.0, pecLower: 14.5, pecUpper: 13.25 }
present_bug_patterns: [resetProgram_allowlist_present_but_incomplete]
absent_bug_patterns: [wave_progression_bug, classic_duplicated_branch_pattern, reverse_nordic_curl_misattribution]
new_bug_class:
  area: "pencilneckStatus shallow-overwrite (historyEntries.ts completion write, Dashboard.tsx Start-Cycle-2 write)"
  detail: "both write sites replace the whole field with a partial object instead of merging; declared 4-field type never guaranteed to hold all fields at once during real use"
doc_code_mismatch:
  area: "static day data shows 3 sets on every exercise; preprocessDay unconditionally clamps every non-compound exercise to 2 sets every week"
  detail: "confirmed live at week 5 — isolation slots (Cable Flyes, Lateral Raises, Overhead Tricep Ext, Leg Extensions, Leg Press Calf Raises) all rendered at 2 sets with last-set-failure, contradicting the static/doc 3-set table"
  real_weekly_sets: 91
  naive_static_reading_weekly_sets: "~108 (if read directly from source without live verification)"
resetProgram_gap: "pencilneckBenchHistory array survives reset, continues to influence getExerciseAdvice weight suggestions"
card_accuracy: "'upper body hypertrophy split' — roughly 1/3 of each session's 9 slots are lower-body (confirmed via structure + highest Wave-2 axial load, 45)"
shared_bug_gaps:
  T9_plan_switch: "reproduces a fifth consecutive Wave 2 plan, first confirmation on a bespoke-engine plan — proves the bug is plan-architecture-independent"
audit: { date: 2026-08-14, findings: 6, verdict: "solid, characterful bespoke engineering undercut by three separate small gaps between self-description and what actually ships" }
```
