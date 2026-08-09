# Exercise system

How exercises, tips, swaps and per-plan overrides work.

Before this existed there was no concept of "an exercise": every plan invented
its own representation of the same movements as free-text strings, and every
cross-cutting behaviour (tips, swaps, variations) was a separate name-keyed
side table in a different file.

---

## The three layers

```
PLAN_REGISTRY[planId]                  static TypeScript, unchanged
   └─ hooks.preprocessDay(day, user)   each plan's own generator
        └─ resolveDay(day, ctx)        library + overrides + user preferences
             └─ ResolvedDay            what WorkoutView and Dashboard render
```

`PlanConfig.hooks` are **functions**, so plans can never round-trip through
Firestore. That single constraint shapes everything: plans keep generating days
in code, and `resolveDay` post-processes the result.

| Layer | Bundled seed | Firestore overlay | Written by |
|---|---|---|---|
| Exercise library | `src/data/exercises/library.ts` | `exerciseLibrary/{id}` | Admin → Exercise library tab |
| Per-plan config | `src/data/exercises/planConfigs.ts` | `planConfigs/{planId}` | Admin → Plan composer |
| User preferences | — | `users/{id}` | Settings, swap sheet |

The bundled seed always renders. Overlays are merged on top, version-gated
through a single `appConfig/libraryMeta` document so the steady state is one
small read per session rather than a collection scan. A Firestore outage
degrades to the last shipped config, never a blank workout.

---

## Identity and aliases

Every movement has a stable kebab-case id (`paused-bench-press`). Display names
never changed during migration, so nothing user-visible moved.

`aliases` is the safety net. History and progression join on exercise *name* in
about ten places (`e.name === "Squats"`, `name.includes("Deadlift") && !name.includes("Romanian")`),
so a rename would silently sever a user's history. Merging two duplicate
movements therefore folds the loser's spelling into `aliases` — an alias is
never removed.

`resolveExerciseId(name)` tries exact name → alias → normalised form, where
normalising strips effort suffixes. That is why `Conventional Deadlift (ME)`,
`(DE)`, `(CAT)`, `(E2MOM)` and eleven other spellings all resolve to one
movement: they are the same lift with different *prescriptions*, which belong
in `IntensityTechniqueSpec`, not in the name.

---

## Tips

Tips come from two places, and the split matters:

- **`library.tip`** — the movement's general coaching cue. How the lift is
  performed.
- **`variantTips.ts`** — prescription-specific and week-scoped tips, keyed by
  the exact name a plan renders. How *this set* is run today.

Conventional Deadlift alone had 17 candidate tips. Promoting one to the library
default would show a Ritual ascension-test instruction to somebody doing a
light Pain & Glory speed set, so promotion is opt-in: a tip becomes the library
default only if the original tipMap curated it as a movement cue, or if it is
the single uncontested candidate. Conventional Deadlift, Low Bar Squat, Plank
and Leg Extensions therefore have no library tip — write one in the admin panel
if you want one.

Plan-scoped overrides (`tipOverride`) win over the library tip for one plan.

---

## Prescriptions

`definePlan` writes a structured `prescription` onto each exercise:
rest, tempo, technique and superset pairing. `resolveDay` resolves each field as

```
admin override  →  plan prescription  →  library default
```

These are rendered as badges rather than folded into the notes string. An
earlier version flattened them into prose, which meant the rest timer had
nothing to read and the UI could not tell a superset from a tempo.

---

## Finishing techniques

A technique that adds work expands into real, logged rows rather than a badge
telling the athlete to do something they cannot record:

| Technique | Produces |
|---|---|
| `drop-set` | One row per drop, each compounding off the load actually used |
| `rest-pause` | One row per burst, carrying its rest |
| `myo-reps` | One row per mini-set |
| `cluster` | One row per cluster |
| `back-off` | One row per set at the given percentage |

`tempo`, `one-and-half`, `total-reps`, `wave` and `amrap-finisher` change how
the prescribed sets are *performed* and correctly add no rows; they appear as
badges instead.

Drop percentages come off the weight the athlete actually used, not the
prescription — someone training lighter than planned gets lighter drops. With
no working weight, no load is invented.

Every generated row is tagged with its kind and excluded from progression.
Guarded by `verify:techniques`.

Plans that set the older free-text `intensityTechnique` banner inside their own
`preprocessDay` (Peachy from week 9, Pencilneck for compounds in certain weeks)
have it read and converted, so their week conditions are preserved rather than
duplicated. Ambiguous banners offering the athlete a choice are left as text.

---

## Sets

`baseSets` is what the plan prescribed. `extraSets` is what the athlete added,
and is only offered where the Plan Composer allows it, capped per exercise.

Extra sets are tagged `kind: 'extra'` and **excluded from progression**. Before
this, adding one extra set could stop a `+2.5 kg` increase, because the "did
every set hit the top of the range?" checks counted it — an invisible failure
that looked like a plateau. Untagged sets always count as work, so every
pre-existing log behaves exactly as before.

---

## Swaps

Policy is set per movement per plan in the Plan Composer:

| Policy | Offers |
|---|---|
| `locked` | Nothing, except the plan's own legacy `alternates` |
| `pool` | An explicit list you choose |
| `group` | Everything sharing the movement's `swapGroup` |
| `any` | Everything with the same movement pattern |

Test accounts ignore the policy entirely and get the whole library.

A stored swap is re-validated on every load, so narrowing a pool retires
choices made under the old one rather than honouring them forever.

---

## Verification

| Script | Guards |
|---|---|
| `verify:library` | Every exercise every plan can produce resolves; aliases globally unique; plan configs reference real exercises |
| `verify:registry` | Plan ids agree across `PLAN_META`, `PLAN_REGISTRY`, `firestore.rules` and `public/`; onboarding copy exists in both languages and is not swapped |
| `verify:tip-coverage` | No tip lost when the old tipMap was removed |
| `verify:tip-equivalence` | Each exercise still resolves to the *same* tip as before |
| `verify:volume` | Weekly muscle frequency against the concept doc's rules (`--strict` to fail) |
| `verify:extra-sets` | Extras are separated from prescribed work and ignored by progression |
| `verify:techniques` | Each technique expands into the right rows with sane loads |
| `verify:progression` | Extracted progression handlers follow the rules in docs/plans/ |

`verify:library` walks every week and day of every plan, running each
generator against synthetic users — currently about 85,000 exercise references.

Two lessons are baked into these: a check that only confirms *presence* is not
enough (the onboarding copy passed while eight plans had their languages
swapped), and data can be complete while the lookup returns the wrong row
(which is why tip coverage and tip equivalence are separate scripts).

---

## Save-time progression

Per-plan progression — the rules that update a 1RM, record a strength history
entry or advance a block when a session is saved — historically lived inline in
`handleSaveSession`, an ~830-line function covering eight plans with no tests.

It is being extracted a plan at a time into
`src/features/workout/progression/`. Handlers are pure: they receive the
session and return `{ updates, appends }`, and the caller writes to Firestore.
That is what makes them testable at all.

`verify:progression` checks them against the rules documented in docs/plans/
rather than against a copy of the original code — a test that compares
extracted code to the code it came from proves only that the copy succeeded,
and would pass just as happily on a faithfully copied bug.

Extracted so far: Peachy and Pencilneck strength history. Everything else still
runs inline; `PROGRESSION_HANDLERS` is consulted first and anything absent
falls through to the existing path, so extraction is incremental and reversible.

Note that extraction is not always behaviour-preserving by design. The
extracted handlers ignore extra and technique sets, which the inline code did
not — previously an extra set could set a false strength record.

---

## Authoring

**A new exercise** — add to `libraryAdditions.ts` with bilingual name, pattern,
muscles, equipment and a tip. Run `verify:library`.

**A new plan** — one `definePlan()` literal, one `PLAN_META` entry, one line in
`firestore.rules validPlanIds()`, onboarding copy in both languages, and a
theme class. `verify:registry` fails the build if you miss any of them.

**Checking a plan's balance** — the Volume analysis tab shows weekly sets and
exposures per muscle group for any plan, flags breaches of the frequency rules,
and refuses to analyse plans that generate one session per visit rather than
reporting figures that are an artifact of the preview.

**Adjusting an existing plan** — use the Plan Composer. It runs the plan's real
generator (sampling multiple user states for plans that synthesise days at
runtime) so you edit what an athlete actually sees, then publishes a versioned
overlay with the previous version snapshotted for rollback.

**Undoing a change** — the History tab lists every published version with a
field-level diff of which movements changed and how. Restoring publishes the
old configuration as a *new* version rather than rewinding the counter, so
history stays append-only and a rollback is itself reversible.

**Scripts** — `extract:exercises` and `scaffold:library` built the initial
library from the plan corpus; `migrate:tips` and `apply:tips` built the tip
tables. They are kept for provenance. `library.ts` is hand-maintained now, so
do not re-run them over it.
