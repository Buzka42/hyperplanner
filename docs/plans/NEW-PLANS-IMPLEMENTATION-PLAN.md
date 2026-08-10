# New plans — implementation plan

Four design documents in `docs/plans/` describe **seven** unimplemented plans.
They were explicitly out of scope for the overhaul; this is the plan for
building them.

| Doc | Plans | Lines |
|---|---|---|
| `HYPERPLANNER_HOUSE_OF_IRON_PLAN.md` | House of Iron | 769 |
| `HYPERPLANNER_APEX_PREDATOR_PLAN.md` | Apex Predator | 996 |
| `HYPERPLANNER_REDLINE_CUTTING_PLAN.md` | REDLINE | 1236 |
| `HYPERPLANNER_VENUS_ATHENA_KALI_VALKYRIE_PLAN.md` | Venus Rising, Athena, Kali, Valkyrie | 1303 |

**This is a project, not a task.** Three of the four docs specify mechanics the
current engine does not have, and the exercise library does not cover the
movements any of them need.

---

## The two things that gate everything

### 1. The library is gym-shaped

195 entries, generated from the existing plan corpus and extended for the
Poliquin plans. It assumes a commercial gym: cables, Smith machine, hack squat,
Hammer rows.

House of Iron needs home movements, and a spot check found **6 of 19** present.
Real gaps, not naming variants — nothing close to a floor press, a pullover, a
suitcase carry, a one-arm dumbbell row, a single-leg RDL, a goblet
heel-elevated squat, or a weighted glute bridge.

REDLINE (conditioning) and the Venus family (time-efficient supersets) will each
have their own gaps. **Audit all four docs against the library before writing a
single plan file** — this is the work that blocks everything else, and it is
mechanical rather than hard.

Additions go in `src/data/exercises/libraryAdditions.ts`, which
`verify:library` already covers. Each needs: id, EN/PL names, aliases, pattern,
primary/secondary muscles, equipment, `weightMode`, `swapGroup`, and a bilingual
tip. `verify:tip-coverage` enforces the last one.

### 2. Three of the four are not calendar plans

`definePlan` builds a **scheduled** plan: fixed days, fixed slots, phase
transforms. That covers plans whose weeks are known in advance.

| Plan | Shape | `definePlan` fits? |
|---|---|---|
| Apex Predator | Scheduled base days + a per-user assessment layer | **Base days only** — see below |
| Venus / Athena | Scheduled, 3-day and 4-day modes | Mostly — needs a schedule-mode choice |
| Kali / Valkyrie | Scheduled | Likely yes |
| House of Iron | **Four selectable sessions**, no calendar | **No** |
| REDLINE | Three layers (Anchor / Burn / Finisher) per session | **No** |

The two that don't fit need engine work, and the precedents already exist:
Trinary and Adventure are both `session: { kind: 'pair-select' }`, so there is a
non-calendar session kind to extend rather than invent.

---

## Build order

Dependency-first, cheapest-to-prove-first.

### Phase 0 — Library audit *(blocks everything)*
Extract every movement named across the four docs, diff against the library,
and write the additions. Deliverable: a coverage report and a populated
`libraryAdditions.ts`. No plan files yet.

### Phase 1 — Apex Predator — **specced, see `APEX-PREDATOR-SPEC.md`**

**This was mis-scoped here as "the declarative one, no engine work".** It is
not. The audit script found no exercises in its doc, and that was read as
"simple" when it actually meant "differently shaped". Its three base days are
declarative; its assessment battery, per-user access slots, retest reallocation
and ROM tracking are not.

Owner decisions are recorded in the spec: all 7 tests presented and individually
skippable, access slots recomputed at each retest, a painful test invalidated
rather than blocking training, and ROM tracking in v1.

### Phase 2 — Venus Rising + Athena
Scheduled, but with a 3-day/4-day mode choice at onboarding. Establishes the
schedule-mode pattern the doc asks for. Kali and Valkyrie follow in the same
shape once it works.

### Phase 3 — Kali + Valkyrie
Same doc, same conventions. Should be mostly plan data by this point.

### Phase 4 — House of Iron *(first real engine work)*
Needs, roughly in order:

- a **session-select** kind: four cards, no calendar;
- **equipment onboarding** (`type`, `count`, `weightKg`) — a new bespoke step
  alongside the generic benchmark one;
- the **fixed-load progression ladder**: reps → ROM → pause → eccentric →
  1.5-rep → unilateral → density → heavier implement, stored per exercise as
  `houseProgression`. This is the plan's whole identity and the most
  design-heavy item in the four docs — **spec it and get approval before
  building**, the way B4 was handled;
- a **balance tracker** (upper push / upper pull / knee / hip) and an advisory
  next-session recommendation.

The doc's own warning is worth heeding: *"Do not make HOUSE OF IRON as complex
as Super Mutant."*

### Phase 5 — REDLINE
Three-layer sessions plus conditioning prescriptions the engine has no concept
of (intervals, work/rest, calorie or distance targets rather than load × reps).
Likely needs a new slot kind. Left last because it is the biggest unknown.

---

## Rules carried over from the overhaul

- **Every plan registers in three places.** `PLAN_REGISTRY`, `PLAN_META`, and
  `validPlanIds()` in `firestore.rules`. `verify:registry` fails the build on
  drift.
- **Every plan gets a theme** — a complete token set, and it must clear 4.5:1.
  Text carrying the accent uses `--signal-text`, never `--primary`.
- **Every declarative plan is covered by `verify:calibration`** the moment it
  declares a percentage/wave/linear progression. It will fail loudly if a
  required max has no exercise that can establish it.
- **`verify:volume` checks frequency**, and powerlifting plans are now exempt
  from the frequency floor and the specialisation frequency target. A new
  hypertrophy plan is still held to 2 exposures a week.
- **Bilingual or it doesn't ship.** Every name, tip and label needs PL.
  `verify:tip-coverage` enforces tips; the Polish string pass is manual.
- **Options round before UI work**, recorded as a document.

---

## Status

### Phase 0 — library audit: **House of Iron done, REDLINE outstanding**

`npm run audit:new-plan-library` extracts every movement the four docs
prescribe and diffs it against the library. It anchors on the set prescription
rather than the heading text — structure headings never carry one, which is far
more reliable than blacklisting them — and resolves `A / B` headings if either
side exists, because those are the doc offering a choice.

| Doc | Missing before | Missing now |
|---|---|---|
| House of Iron | 17 | **2** |
| REDLINE | 16 | 16 |
| Venus / Athena / Kali / Valkyrie | 3 | 0 |
| Apex Predator | — | — |

**House of Iron: 13 movements added**, and 3 folded into existing entries as
aliases rather than duplicated — the DB Romanian Deadlift, the Single-Arm DB
Row and the Dumbbell Hammer Curl were all already there under gym spellings.
Both also gained `kettlebell` equipment, since House of Iron's premise is that
either implement works. `verify:library` caught the two duplicates the moment
they were written, which is the guard doing exactly its job: history and
progression join on exercise name in ~10 places, so a second copy of a movement
splits an athlete's history in two.

Library is now **208 movements, 138 aliases, 208/208 Polish**.

Its remaining 2 are doc shorthand, not movements: "Curl" and "One-Arm Row
Variation" are the document naming a *category* and a *variation of a movement
already listed*, which the plan file resolves when it picks one.

**REDLINE's 16 are not yet triaged.** Most look like they will resolve to
existing gym movements under fuller names (`Standing OHP`, `Lateral Raise`,
`Triceps`, `Weighted Pull-Up`) — its doc names movements more loosely than
House of Iron does. Triage before adding anything.

**Apex Predator returns nothing** because it never writes a `sets × reps`
prescription — it is a movement-access plan whose sessions are built from
assessment results. Its exercise list has to be read out by hand.

### Next

Phase 1 (Apex Predator) as planned — but note its library needs are still
unknown, so read its doc for movements before building.
