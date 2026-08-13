# HyperPlanner — implementation plan for GPT

**Written for a fresh agent picking this up with no memory of the sessions that
produced it.** Everything here is either an owner decision (locked, do not
relitigate), a fact verified against the repo (cited by file and line), or an
open question flagged as such. Nothing is inferred silently — where a call was
made without the owner, it says so.

Read in this order before writing code:

1. this file;
2. `HANDOFF.md` — repo conventions and the traps that have already cost a day;
3. `../../DESIGN.md` — the Protocol Sheet visual system and its verification rules;
4. the spec for whatever phase you are on.

---

## 0. Where the project actually is

| Area | State |
|---|---|
| UI overhaul (Protocol Sheet) | **Done.** Phases A, B1–B8 and C complete |
| Exercise library | **208 movements, 138 aliases, 208/208 Polish** |
| Plans shipped | 19, all registered and themed |
| Verification | 15 `verify:*` scripts, all green; `npm run build` clean |
| Branch | `claude/handoff-documents-continue-ubf0d6`, fast-forwarded to `main` |
| New plans | 0 of 7 built. 4 of 7 specced |
| New concepts | 0 of 12 built. Concept doc only |

There is no unit-test runner. The `verify:*` scripts **are** the test suite —
they are tsx programs that import the real plan modules and assert invariants
over generated output. A new capability is not finished until a `verify:*`
script fails when you break it. That standard was set during the overhaul and
should hold.

### Design docs in `docs/plans/`

| Doc | What it is |
|---|---|
| `HYPERPLANNER_APEX_PREDATOR_PLAN.md` | design doc — Apex Predator |
| `HYPERPLANNER_HOUSE_OF_IRON_PLAN.md` | design doc — House of Iron |
| `HYPERPLANNER_REDLINE_CUTTING_PLAN.md` | design doc — REDLINE |
| `HYPERPLANNER_VENUS_ATHENA_KALI_VALKYRIE_PLAN.md` | design doc — 4 plans |
| `HYPERPLANNER_NEXT_EXPANSION_CONCEPTS.md` | design doc — the 12 new concepts |
| `../HYPERPLANNER_OLD_VS_NEW_PORTFOLIO_SUMMARY_FOR_CLAUDE.md` | portfolio review of the 19 shipped plans |
| `APEX-PREDATOR-SPEC.md` | **build spec**, owner-decided |
| `VENUS-ATHENA-KALI-SPEC.md` | **build spec**, owner-decided |
| `PERFORMANCE-PROFILE-SPEC.md` | **build spec**, owner-decided |
| `NEW-PLANS-IMPLEMENTATION-PLAN.md` | scoping doc for the 7 plans |

A *design doc* is the owner's intent in prose. A *build spec* is that intent
resolved into data models, file paths and decisions. **Do not build from a
design doc that has no build spec** — House of Iron and REDLINE do not have one
yet, and writing one is part of their phase.

---

## 1. Locked owner decisions

Do not re-ask these. They were answered explicitly.

| # | Decision |
|---|---|
| D1 | **Extract shared engines first, then build plans.** Not plan-by-plan with refactoring later |
| D2 | **Bulk-author the full exercise metadata set for all 208 exercises now**, rather than adding fields as each plan needs them |
| D3 | **All 12 new concepts are in scope**, in the concept doc's own suggested order, with **GHOST IN THE MACHINE last and optional — not built in this pass** |
| D4 | PerformanceProfile is **ecosystem-wide**: every plan writes to it |
| D5 | A load derived from another plan's history is a **suggestion, never silent truth** — shown with its source, plus an opt-in "run a calibration set instead" affordance |
| D6 | **Exception:** a *direct* Venus/Athena → Kali switch trusts exact-match history outright, no offer. Detected via a new `lastProgramId` field written on every `switchProgram` |
| D7 | Apex: all 7 assessment tests presented, **each individually skippable** |
| D8 | Apex: access slots **recomputed at every retest** (weeks 0, 4, 8, 12) |
| D9 | Apex: pain on a test **invalidates that test only** — training proceeds normally |
| D10 | Apex: **ROM tracking ships in v1** |
| D11 | Venus/Athena: **full schedule-mode switching** (3-day ↔ 4-day), applied from the next training week |
| D12 | Kali Day II anchor: **≥5 strict pull-up reps → weighted pull-up, else assisted pulldown** |
| D13 | **Valkyrie is deferred** — per its own design doc §26 and owner confirmation |
| D14 | Powerlifting plans are **exempt from the 2×/week frequency floor** (already implemented) |

### One decision made without the owner

`APEX-PREDATOR-SPEC.md` §Decisions contains an inferred rule: **emphasis
selection requires at least 3 valid regions**, falling back to a default
ankle + thoracic-rotation module below that. It is flagged in that spec as
inferred rather than owner-given. It is a reasonable default and should ship,
but it is the one place in the Apex spec where the owner has not signed off.

---

## 2. Open decisions — ask the owner before the phase that needs them

These were asked and not answered before the session ended. Each names the
phase it blocks, so you can keep working until you reach it.

### O1 — Flagship plans vs the extracted engines *(blocks Phase 1 completion)*

Five plans have bespoke hand-written progression handlers rather than
`definePlan` specs: Super Mutant (801 lines), Trinary (553), Ritual (527),
Pain & Glory (441), Pencilneck (367). Phase 1 extracts shared primitives.
Three options:

- **(a) Extract-from-only** — read them to derive the primitives, leave the
  plans untouched. Zero regression risk, permanent duplication.
- **(b) Migrate the shared parts** — the five keep their bespoke logic but call
  the shared primitives where the behaviour is genuinely identical. Real risk:
  these are the portfolio's flagships and their behaviour is load-bearing.
- **(c) Full migration** to `definePlan` + engines. Highest risk, cleanest end
  state, almost certainly too much for this pass.

**Recommendation if the owner is unavailable: (a) for this pass**, with each
extracted primitive documenting which of the five it was derived from, so (b)
is a mechanical follow-up rather than an archaeology exercise.

### O2 — Left/right storage for unilateral work *(blocks Athena, Apex, ATLAS, CHIMERA)*

A logged set has no `side` field anywhere in the app — not in `SetKind`, not in
the set-data shape, not in Firestore. Four separate things want it:

- Athena's promised "useful left/right performance data";
- Apex's per-side asymmetry rule (`APEX-PREDATOR-SPEC.md` §3 item 5 — the
  weaker side goes first and gets one extra set);
- ATLAS's unilateral carry work;
- CHIMERA's `UNILATERAL` phenotype category.

The question is how deep it goes: a per-exercise `unilateralMode: 'combined' |
'per-side'` flag that splits the set rows, versus a `side?: 'L' | 'R'` on every
logged set. The first is cheap and covers Athena and Apex; the second is the
honest data model and touches the ledger, the console, progression handlers and
history. **Athena can ship without it** (its spec says so); Apex's asymmetry
rule can degrade to "the weaker side first" without the extra set.

### O3 — How far to upgrade the 19 existing plans *(blocks Phase 4)*

Portfolio §35 items 8–11 ask for "signature app mechanics", standardized
progression primitives, standardized metadata and QA tooling across the
existing portfolio. §24 defines six deliberate reactivity tiers (Static →
Recovery-Reactive) and says the hierarchy should stay deliberate — i.e. not
every plan should become reactive. Those two pull in opposite directions.
**Unresolved: which existing plans move up a tier, and which are meant to stay
simple.** §4's own ranking calls Skeleton, Pencilneck and Arms Race
"necessary straightforward programs" whose simplicity is useful, which is a
strong hint that the answer is "few of them" — but it is a hint, not a
decision.

### O4 — How bulk-authored metadata gets validated *(blocks Phase 2)*

D2 commits to authoring ~2,700 metadata values in one pass. Values like
`systemicFatigue` and `stabilityDemand` are coaching judgements with no
mechanical ground truth, so a `verify:` script can check **shape** (every
exercise has every field, every value in range) but not **correctness**. Three
candidate answers: owner spot-review of a sample; cross-checks that catch
absurdities (a machine movement with maximal stability demand, a bodyweight
movement with maximal systemic fatigue); or accept that v1 values are rough and
tune them once a plan actually consumes them. **Recommendation: all three** —
shape verification is non-negotiable, absurdity cross-checks are cheap, and the
tuning pass is honest about what these numbers are.

---

## 3. Repo facts and traps

Read `HANDOFF.md` for the full set. These are the ones that will bite hardest
on this specific work.

### The Tailwind v4 layer trap

Tailwind v4 puts utilities in `@layer utilities`. **Any unlayered CSS rule in
`src/index.css` beats them regardless of specificity.** Declaring `display` in
`index.css` for an element that also carries `md:hidden` silently defeats the
utility and renders mobile chrome on desktop. This already happened once.
Keep `display` (and anything else a responsive utility controls) in the JSX
class list, not the stylesheet.

### `--signal-text`, not `--primary`

Accent-coloured *text* uses `--signal-text`, which is
`color-mix(in oklab, hsl(var(--primary)) 72%, hsl(var(--foreground)))`. It is
declared on `.instrument-shell`, **not** `:root` — custom properties substitute
where they are declared, so moving it changes what it resolves to. Every new
plan theme must clear 4.5:1 with it.

### `handleSaveSession` is the single save path

`src/pages/WorkoutView.tsx` (~line 698). **Every** plan's session save goes
through it, declarative or hand-written. The existing calibration block already
runs there unconditionally for every plan. This is why "PerformanceProfile
touches all plans" is a one-file change rather than nineteen — verified, not
assumed.

### Every plan registers in three places

`PLAN_REGISTRY`, `PLAN_META`, and `validPlanIds()` in `firestore.rules`.
`verify:registry` fails the build on drift. Forgetting the Firestore rule means
the plan works locally and silently fails to save in production.

### Exercise identity joins on name in ~10 places

Which is why a duplicate library entry splits an athlete's history in two, and
why merging two movements means folding the loser's display name into the
survivor's `aliases` array rather than deleting it. `verify:library` catches
duplicates; it caught two during the House of Iron additions.

### Bilingual or it doesn't ship

Every name, tip and label needs Polish. `verify:tip-coverage` enforces tips;
the rest is manual. When inserting into `src/i18n/`, anchor edits on the
`en:` / `pl:` block boundaries by line number and verify — pattern-matching on
a nested key name has already put strings in the wrong locale once.

---

## 4. Phase 1 — Extract the shared engines *(do this first — D1)*

The case for doing this before any plan: the same mechanics are specified
independently across the design docs, and building the plans first means
writing each of them three to seven times.

| Mechanic | Specified independently in |
|---|---|
| Stall-breaking / fixed-load ladder (reps → ROM → pause → eccentric → 1.5-rep → unilateral → density → heavier) | Venus §5, House of Iron (its whole identity), Apex ROM progression, QUADFATHER's ROM lead — **4** |
| Calibration (establish a working load from a test set) | Section A onboarding calibration, PerformanceProfile exercise-level calibration, LAZARUS fast recalibration — **3 variants** |
| Confidence levels (HIGH / MEDIUM / LOW gating how strongly the app acts) | ORACLE, GHOST, EVENT HORIZON, CHIMERA, LAZARUS — **5 of the 12 concepts**, plus PerformanceProfile's transfer tiers |
| Per-session set caps with a documented drop order | 7 plans across the docs |

The concept doc says the same thing itself, in *Shared infrastructure
opportunities* (PerformanceProfile, exercise metadata, confidence system).

### What exists today

`src/data/planBuilder.ts` defines five progression types: `double`,
`percentage`, `wave`, `linear`, `totalReps`. Portfolio §25 lists twelve
primitives worth having. The gap is the work.

### 1.1 — PerformanceProfile *(fully specced — build it as written)*

`PERFORMANCE-PROFILE-SPEC.md`. Data model, write hook, 5-tier transfer
hierarchy, `lastProgramId`, and the suggestion-vs-trust rule are all decided.

Two things that spec defers and this phase should now do:

- the **tier-2 "close variation" table** — it says to author it once the
  Venus/Athena/Kali exercise lists are final. They are, in
  `VENUS-ATHENA-KALI-SPEC.md`;
- **exercise-level calibration** — distinct from Section A's
  `pendingCalibration: (keyof LiftingStats)[]`, which is keyed to the fixed
  `LiftingStats` enum and scoped to plan onboarding. This one is per-exercise,
  athlete-triggered mid-plan, and writes to `performanceProfile` rather than
  `stats`. It shares the calibration-band UI and the Epley-on-best-set maths.

Tiers 3 and 4 need **no new authored data** — they derive from
`LibraryExercise.pattern` and `.primary`, which every entry already has.
Verified against `src/data/exercises/types.ts`.

### 1.2 — Progression primitives

New `Progression` variants on `planBuilder.ts`. Named because a plan already
needs each:

| Type | Needed by |
|---|---|
| `top-set-backoff` | Athena phase 2 — one slot renders as two prescriptions, back-off load derived from what the top set produced |
| `fixed-load` (the stall ladder) | House of Iron, Venus §5, Apex |
| `density` | IRON CLOCK, REDLINE |
| `tempo` | Poliquin-family plans, Venus's ladder |
| `amrap-e1rm` | LAZARUS, ORACLE, Bench Domination's existing behaviour |

`top-set-backoff` is the structurally awkward one: no existing progression
turns one `SlotSpec` into two rendered prescriptions. Solve that shape before
writing the others, because `fixed-load` has the same one-to-many problem when
the ladder reaches its unilateral rung.

### 1.3 — The confidence primitive

One shared type and one shared rendering. The rule the docs converge on:
**below HIGH, the app shows its reasoning and offers a choice; it does not act
silently.** GHOST's camera-confidence section and PerformanceProfile's
suggestion rule (D5) are the same rule stated twice. Build it once.

### 1.4 — Session set caps

A `PhaseSpec.transform` helper that enforces a per-day cap with the documented
drop order (keep the primary movement → keep priority-muscle work → keep
minimum frequency → drop the lowest-priority isolation set last). Venus's spec
already describes this; seven plans want it.

### 1.5 — Verification

`verify:engines`. At minimum: every progression type resolves for every plan
that declares it; the fixed-load ladder advances one rung per stall and never
skips; the set-cap helper never drops a primary movement; confidence never
auto-applies below HIGH. **Write a deliberately broken variant of each and
confirm the script fails** — an earlier calibration test passed while silently
running 18 fewer checks, which is the failure mode to guard against.

---

## 5. Phase 2 — Exercise metadata for all 208 movements *(D2)*

Two field lists exist. Portfolio §26 names 13 fields; the concept doc's shared
-infrastructure section names 16. Their union, against what
`LibraryExercise` already has:

**Already present** (5): `pattern` (= `movementFamily`), `primary`,
`secondary`, `equipment`, `unilateral`.

**To author** (13, excluding `cameraFriendly` which only GHOST needs and GHOST
is out of scope per D3):

```
stabilityDemand      systemicFatigue      systemicCompound
homeCompatible       progressionType      lengthenedBias
shortenedBias        densityCompatible    axialCost
lowerBackCost        elbowCost            shoulderCost
kneeCost
```

The portfolio doc compresses the five `*Cost` fields into one `jointStressTags`
array; the concept doc keeps them separate. **Keep them separate** — the
fatigue audit in portfolio §29 is organised by joint, and an array of tags
cannot express "moderate" versus "high" without inventing tag values that are
really an enum.

13 fields × 208 exercises ≈ **2,700 values**. Add `cameraFriendly` later if
GHOST is ever built.

### How to author them

Not by hand, one at a time. Derive defaults mechanically from `pattern`,
`equipment` and `weightMode` — a machine movement's stability demand and a
barbell squat's axial cost are both predictable from fields that already
exist — then hand-correct the exceptions. That turns 2,700 judgements into a
few dozen rules plus a correction list, and the rules are reviewable in a way
that a 2,700-row table is not.

Validation: see **O4**. Ship shape verification (`verify:metadata`) regardless
of how that question resolves.

### What this unlocks

Exercise swaps, the fatigue audit (§29), Apex/Immaculate region mapping,
Kali's systemic-compound rule, REDLINE density compatibility, House of Iron's
home-equipment filtering, EVENT HORIZON's whole premise. Six consumers is why
this is a phase rather than a chore.

---

## 6. Phase 3 — The seven in-progress plans

Order below is dependency order, not doc order.

### 3.1 Apex Predator — **specced**, `APEX-PREDATOR-SPEC.md`

Build order is in that spec (§8), 10 steps. Two notes:

- **It was originally mis-scoped in `NEW-PLANS-IMPLEMENTATION-PLAN.md` as "the
  declarative one, probably no engine work".** That was wrong. The library
  audit script found no exercises in its doc, and that was read as "simple"
  when it actually meant "differently shaped" — Apex never writes a
  `sets × reps` prescription because its sessions are assembled from assessment
  results. The base days are declarative; the assessment battery, access slots,
  retest reallocation and ROM tracking are not. Both docs now say so.
- **Its library gap is untriaged.** Expect ~8–10 additions (knee-over-toe split
  squat, ankle rock, wall slide, open-book, quadruped rotation, 90/90
  transition, rotational row). Read them out of the design doc by hand — the
  audit script cannot see them. This blocks everything else in the phase.

### 3.2 Venus Rising + Athena + Kali — **specced**, `VENUS-ATHENA-KALI-SPEC.md`

Both new engine capabilities that spec identifies (`scheduleModes` on
`PlanSpec`, `top-set-backoff`) belong to **Phase 1**, not here. If Phase 1 is
done, these three are largely transcription: their day templates are fully
specified set-by-set in the design doc.

Athena is gated on **O2** for its left/right promise but can ship without it.

Library gap: **0**. Already verified by `npm run audit:new-plan-library`.

### 3.3 House of Iron — **needs a build spec first**

Design doc only. Its fixed-load progression ladder is the plan's whole identity
and the most design-heavy item across the four docs. **Write the spec and get
owner approval before building** — the same way the B4 ledger was handled.

Also needs: a `session-select` kind (four cards, no calendar — extend the
existing `session: { kind: 'pair-select' }` precedent from Adventure and
Trinary rather than inventing one), equipment onboarding (`type`, `count`,
`weightKg`), and a four-way balance tracker.

Library gap: **2**, and both are doc shorthand rather than missing movements —
"Curl" and "One-Arm Row Variation" name a category and a variation of a
movement already in the library. The plan file resolves them when it picks one.
13 movements were added for this plan already; the library is at 208 because of
it.

The design doc's own warning is worth repeating: *"Do not make HOUSE OF IRON as
complex as Super Mutant."*

### 3.4 REDLINE — **needs a build spec, and triage first**

Left last of the four because it is the biggest unknown. Three-layer sessions
(Anchor / Burn / Finisher) plus conditioning prescriptions the engine has no
concept of: intervals, work/rest ratios, calorie and distance targets rather
than load × reps. Likely needs a new slot kind.

Library gap: **16, untriaged.** Most will resolve to existing movements under
fuller names — its doc names movements loosely (`Standing OHP`, `Lateral
Raise`, `Triceps`, `Weighted Pull-Up`). **Triage before adding anything**;
adding a duplicate is worse than leaving the gap.

### 3.5 Valkyrie — **deferred** (D13)

Its design doc §26 asks for the deferral itself: it has no session data, only
bullet-point characteristics, and the doc says not to finalize it until the
shared profile is proven. Revisit after Kali ships.

---

## 7. Phase 4 — Portfolio fixes (§35)

From `../HYPERPLANNER_OLD_VS_NEW_PORTFOLIO_SUMMARY_FOR_CLAUDE.md` §35, with
current state verified where possible.

| § | Item | State |
|---|---|---|
| 35.1 | Skeleton minimum-frequency edge case | **Real, unfixed.** `src/pages/Onboarding.tsx:191` — `if (selectedDays.length !== 3)` forces exactly 3 days. §9 of the portfolio doc asks for 2 minimum / 3 recommended / 4 allowed |
| 35.2 | Overhead Dominion chest/arm maintenance frequency | Not audited |
| 35.3 | Second triceps exposure in Workhorse | **Already satisfied** — Cable Triceps Extension (day 1) and Rope Pressdown (day 3). Verified. No work needed |
| 35.4 | Immaculate non-priority muscle frequency | Not audited |
| 35.5 | Keep Hamstring Foundry distinct from Pain & Glory | Not audited |
| 35.6 | Keep Neural Overload centered on 1–6 reps | Not audited |
| 35.7 | Make Purgatorio phase changes mechanically obvious | Not audited |
| 35.8 | Upgrade new plans with signature app mechanics | **Blocked on O3** |
| 35.9 | Standardize shared progression primitives | **This is Phase 1** |
| 35.10 | Standardize exercise metadata | **This is Phase 2** |
| 35.11 | Volume/fatigue QA tooling | `verify:volume` exists and checks frequency. The **fatigue** audit (§29) needs Phase 2's joint-cost fields first |
| 35.12 | Update renamed-plan references everywhere | **Done this session** — the plan-id rename shipped. The Firestore migration itself is blocked, see §9 |
| 35.13 | Catalogue categories/filtering | Not started. §32 specifies the categories |
| 35.14 | Plan-transition recommendations | Not started. §34 specifies the transitions; PerformanceProfile's `lastProgramId` (Phase 1.1) is the mechanism |
| 35.15 | Add no more programs unless a genuine gap appears | Noted — but D3 explicitly commissions 12 more, so treat this as "no *unplanned* additions" |

Items 2, 4, 5, 6, 7 are audits, and audits are exactly what `verify:*` scripts
are for. Prefer extending `verify:volume` over reading plan files by hand —
`verify:volume` already knows how to expand every plan into sessions, including
the runtime-synthesised ones.

**Known `verify:volume` subtlety, since it will come up:** Skeleton was
invisible to it until this session, for two independent reasons — the preview
user had no `selectedDays` (Skeleton's `preprocessDay` gates on it) and the
per-visit detector's heuristic ("every day produces the same session") also
matches a legitimate full-body 3×/week plan. Both are fixed; Skeleton now
audits at 72 direct sets, 3× frequency. If a new plan seems to have no volume,
suspect the harness before the plan.

---

## 8. Phase 5 — The 12 new concepts

`HYPERPLANNER_NEXT_EXPANSION_CONCEPTS.md`. Build in the concept doc's own
suggested order — it is dependency-ordered, and the doc explains why.

| # | Concept | One-line problem it solves | Depends on |
|---|---|---|---|
| 1 | THE MINIMUM | How much can two reliable sessions accomplish? | — |
| 2 | LAZARUS | How to restore a previously trained athlete quickly but sensibly | PerformanceProfile (1.1), confidence (1.3) |
| 3 | QUADFATHER | Quad specialization that isn't squat specialization | metadata (2), ROM ladder (1.2) |
| 4 | CATHEDRAL | Chest specialization rather than bench performance | metadata (2) |
| 5 | IRON CLOCK | Density itself as progressive overload | `density` progression (1.2) |
| 6 | BLACKOUT | How little work still drives progress? | — |
| 7 | MONOLITH | Maximum local effort, minimum systemic cost | `stabilityDemand`, `systemicFatigue` (2) |
| 8 | ATLAS | Practical brute strength, efficiently | metadata (2), **O2** |
| 9 | PROJECT CHIMERA | Can the program evolve with the athlete's phenotype? | PerformanceProfile, confidence, **O2** |
| 10 | ORACLE | Can the app predict today's performance well enough to prescribe better? | PerformanceProfile, confidence |
| 11 | EVENT HORIZON | Same goal, less recoverability cost | full fatigue metadata (2) |
| 12 | **GHOST IN THE MACHINE** | **Optional. Not built in this pass (D3)** | camera analysis, unproven |

**GHOST is explicitly out of scope.** Do not start it. If everything else is
done and the owner wants it, its own doc says to prototype camera reliability
on rep counting, timing and ROM consistency *first*, on a few camera-friendly
movements, and only then build the plan.

### The rule the concept doc sets for all 12

> If this plan were exported to paper, what important behavior would be lost?

For QUADFATHER or CATHEDRAL that can be a specialization dashboard, intelligent
swaps, phase progression. For ORACLE or EVENT HORIZON it must be substantial —
prediction, personalization, automatic load adjustment, learned recovery
behaviour. **Twelve variations of "pick exercises → add sets → increase
weight" is the failure mode**, and the doc names it as such.

### And the rule about not locking too early

The concept doc's *Do not lock too early* section asks that exact set counts,
machine swaps, fatigue-cost values, prediction formulas, camera thresholds,
Chimera archetypes and the ORACLE model type all stay open until each concept's
own spec round. Lock the training problem, identity, inputs, outputs, signature
mechanic, guardrails and minimum viable version first. **Each of these 12 needs
its own options round and build spec before code**, same as Apex and Venus got.

---

## 9. Blockers that need the owner, not more work

| Blocker | Why | What it stops |
|---|---|---|
| Firestore credentials | `npm run migrate:plan-ids` writes to production. No credentials in the environment | The plan-id rename is shipped in code but **not migrated in the live database** |
| `firebase login` | `firebase-tools` runs and resolves the project (`workout-planner-b5bd6`), but auth needs interactive OAuth | `firebase deploy` |
| Impeccable detector | The skill is not installed in this environment | The detector run that was requested |

These were not worked around. The plan-id migration in particular matters: the
code expects the new ids and existing user documents still carry the old ones.

---

## 10. Suggested sequencing

Phase 1 → Phase 2 → Phase 3 → Phases 4 and 5 in parallel.

Phases 1 and 2 are the ones with no visible output, and skipping them is the
single decision most likely to be regretted — D1 and D2 exist precisely because
the alternative was writing the stall ladder four times and the confidence
system five.

A defensible first week:

1. Answer **O4**, then build Phase 2's derivation rules — metadata unblocks the
   most downstream work and is the least controversial.
2. Build **1.1 PerformanceProfile** from its spec, which is complete.
3. Build **1.2's `top-set-backoff`** first among the progressions, because its
   one-slot-to-two-prescriptions shape is the hard one and everything else in
   1.2 is easier once it exists.
4. Triage **Apex's** and **REDLINE's** library gaps — mechanical, and both
   block their phases.

Then raise **O1** and **O3** with the owner, since by that point Phase 1 will
have made the shape of both concrete enough to decide.
