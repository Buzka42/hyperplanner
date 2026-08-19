# End-of-audit cross-plan synthesis report

> The deferred deliverable from the audit's original scope
> (`_audit-status.md` §1, item 6; `_audit-decisions.md` AUDIT-4/AUDIT-7),
> written now that all 36 shipped plans (Waves 0-6) plus Ghost in the
> Machine (Wave 7, doc-only) have been individually audited. This report
> synthesizes what only becomes visible once every plan is done — it does
> not add new findings. Everything cited here traces back to an individual
> plan doc in `docs/plans/v2/`, the Wave 1 comparison file, the Wave 6
> roadmap, `_audit-status.md`/`_audit-decisions.md`, or
> `docs/analysis/exercise-attribution-map.md` §25.
>
> **Per PROC-1, this report is findings-only.** It does not authorize,
> sequence, or begin implementation. See §6 for what remains parked.

---

## 1. Executive summary

Across all 36 shipped plans, **34 of 36 have at least one live-confirmed
defect that breaks or silently falsifies the specific mechanic the plan is
named and marketed for** — not a cosmetic bug, but something that stops the
plan from doing the one thing its own onboarding card promises. Only two
plans (Arms Race, Tenfold) came through their audit with every checkable
headline claim surviving live verification intact, and even they carry
minor plan-local gaps. The training *design* underneath nearly every plan —
exercise selection, periodization structure, volume balance — is
consistently sound and often genuinely sophisticated (independent
reinvention of "never compound an estimate on an estimate" on four
different plans; well-scored adaptive assessments on Athena, Kali, Apex
Predator). **The portfolio's problem is not design quality. It is that an
increasing share of that design never reaches the athlete**, through three
compounding causes that got worse, not better, as the plans got more
ambitious: a single shared dashboard bug that misroutes athletes on plan
switch (T-9, exposed on the clear majority of non-dedicated-dashboard
plans), a `resetProgram()` allowlist that has never once been updated to
match a new plan's status field (T-2/T-28 family, effectively 100% hit rate
on plans with their own status object), and — the single most consequential
finding of the whole audit — an unresolved Firestore write-path failure
that, by Wave 6, was blocking logins, silently swallowing completed
sessions, and freezing every adaptive mechanic in the portfolio's five most
ambitious plans, with no root cause ever pinned down from client-side
observation. An owner reading only this section should take away: the
portfolio's ambition consistently outpaces its wiring, and the gap between
"what the plan claims" and "what actually runs" widens, not narrows, the
more sophisticated the plan's mechanic is.

---

## 2. Shared/systemic bugs, final tally

Organized by theme, not discovery order. All ids reference the TECHNICAL
table in `_audit-decisions.md` (T-1 through T-82).

### 2.1 Plan-switch / dashboard routing (T-1, T-9 family)

**The single highest-confirmed-instance-count bug in the audit.** Root
cause: `Dashboard.tsx`'s `dashboardViewWeek-${user.id}` localStorage key
carries no `programId` component (`Dashboard.tsx:79`, `:187-189`), so
switching plans inherits whatever week was last viewed on a *different*
plan. First surfaced as three independently-diagnosed symptoms in Wave 1
(Ritual ignoring a real status field, Bench Domination and King of the
Squat showing stale state with no backing Firestore entry) before Monolith
exposed the literal shared-key root cause in Wave 2. From Wave 2 onward it
was tested on every plan and reproduced on the clear majority: 3/3 early
Wave 2 plans, 5/5 by Wave 2's close, 8/8 (in some variant) across all of
Wave 3, 5/7 in Wave 5, and 4/5 in Wave 6 (Super Mutant the one exception,
for a plan-local structural reason below). **The one reliable immunity
predictor, confirmed and refined repeatedly**: a plan with its own
dedicated dashboard *component* that early-returns before the shared render
path (Athena, Venus Rising, Kali, House of Iron — a clean 4/4 sweep in Wave
4 — plus 30-Min Adventure and Apex Predator in Wave 5) is immune. A
plan-specific *widget* embedded as a conditional block inside the shared
`Dashboard.tsx` (Lazarus's "Predicted vs logged" card, Skeleton's three
widgets) grants none of that immunity — having a bespoke UI surface is not
the same as bypassing the buggy read path. Super Mutant sharpened the rule
further: it has no dedicated component either, but is immune because its
block reads plan-local `completedWorkouts`/`weeklySessionDates` directly
rather than the shared `dashboardViewWeek` cache — **immunity tracks with
what state a block reads, not merely whether it is a separate component.**
Status: single shared-code fix, one place, would resolve every confirmed
instance at once — the highest-leverage fix in the whole audit by
confirmed-instance count.

### 2.2 `resetProgram()` allowlist gaps (T-2, T-28 family)

`UserContext.tsx`'s hardcoded status-nulling allowlist (`benchDomination
Status`, `pencilneckStatus`, `skeletonStatus` only) was never updated as new
plans shipped their own `xStatus` object. Confirmed missing on Event
Horizon, Tenfold, Pencilneck (partially — on the list but shallow-
overwritten, T-12), Athena, Venus Rising, Kali, House of Iron, Iron Clock,
REDLINE, Atlas, Lazarus, Apex Predator, Super Mutant, Project Chimera — every
Wave 4 and Wave 6 plan with a status object, without exception. Only three
plans in the entire portfolio have a correct, sufficient allowlist entry
(`bench-domination`, `pencilneck-eradication`, `skeleton-to-threat`
itself — confirmed clean on Skeleton's own audit). A closely related,
narrower gap (T-28) — `resetProgram()` never touches `planPreferences` for
*any* plan — hits Venus Rising, Kali, Atlas, and likely others with
preference-driven mode/exercise selection. Severity varies by plan: mostly
consequence-free where the underlying status field is itself dead
(Cathedral, Iron Clock, Lazarus, Project Chimera — nothing to leak because
nothing is ever written), but real and load-bearing where the mechanic
*is* wired (Athena's `exerciseLoads`, Kali's status, House of Iron's
substituted-variation state, Atlas's carry-limiter tag). Status: single
shared fix (make the allowlist derive from a plan registry rather than a
hardcoded list), but the fix needs to land alongside each plan's own
write-path repair to have real effect — fixing the allowlist alone doesn't
help a status object nothing populates.

### 2.3 The write-path failure saga (T-54 through T-79 and beyond)

**The single most important open item this audit surfaces for the owner.**
First isolated cleanly on Apex Predator (T-54, closing Wave 5): the
assessment-save write failed `permission-denied` for a real authenticated
athlete, on a payload that succeeded instantly via an admin-privileged
write of the identical object, with a full `firestore.rules` clause trace
finding nothing the payload should violate. Wave 6 then reproduced and
escalated the same isolation pattern on every single plan it audited:

- **Super Mutant** (T-57/T-58) — two independent sites, onboarding *and*
  save-time progression, the first case to touch a portfolio-wide field
  (`completedSessions`) alongside a plan-local one.
- **Neural Overload** (T-64) — a third, structurally unrelated write shape
  (a plain calibration write with no plan-local status object at all)
  failed identically, the point at which the audit's own notes call this
  "likely one shared condition" rather than a per-plan coincidence.
- **Immaculate** (T-70) — escalated to blocking *login itself*: the
  `test_claude` document had no `ownerUid` field at all, and even the
  client-side self-claim write that exists specifically to handle that case
  failed. Three further sites failed in the same session after admin
  unblocks.
- **Oracle** (T-75) — the first *total*-loss case: every write in a
  completed-session flow, including the session log itself, failed
  together, rather than the more common partial split.
- **Project Chimera** (T-79) — closed the wave in the more typical
  partial-split shape: the session log saves, but `completedSessions` and
  `workingLoads` writes silently fail.

Eight structurally distinct failing write call sites confirmed across five
Wave 6 plans by wave's end, never once explained by a rules-clause trace,
and never once failing on an admin-privileged write of the identical
payload — the defining signature that isolates this to the authenticated
client write path, not a data-shape problem. **Status: unresolved at the
close of the audit.** The Wave 6 roadmap (`_wave6-advanced-plans-roadmap.md`)
independently arrived at the same conclusion from its narrower four-plan
scope: this is not a per-plan bug but shared infrastructure, and it should
be root-caused first (recommending Apex Predator's cleanest, earliest
isolation as the starting case) because it blocks meaningful verification
of nearly every other fix downstream of it — Immaculate's two-line fix,
Oracle's ledger, Project Chimera's eventual reallocation UI, and ordinary
athlete use of five of the portfolio's most sophisticated plans all sit
behind this one condition. It is explicitly flagged as the single
highest-priority infra item across the whole audit, ahead of any individual
plan-local finding.

### 2.4 The dead/decorative-feature pattern

**This hit more plans than any other single issue category in the audit —
wider than the write-path saga once dead-feature instances across all
seven waves are counted together, even though the write-path bug is more
severe on the plans it touches.** The shape recurs in escalating severity:

- **Decorative label only** (King of the Squat's wave math is invoked but
  miscalculated; Overhead Dominion's T-14 "waves" badge and Gravity Is
  Optional's T-24 "total-reps" badge are never invoked at all).
- **Well-built backend, zero UI entry point anywhere** (Event Horizon's
  region-swap engine T-10; Overhead Dominion's delt-split tracker T-15;
  Quadfather's ROM confirmation and knee-feedback swaps T-18; Cathedral's
  entire arches/combo system T-20 — the cleanest "declared, wired,
  unreachable" case up to that point; Super Mutant's pool-mode rotator
  T-60 and `weakPointMuscle` T-61; Atlas's carry-scoring layer T-42, hinge
  substitution T-44, and kettlebell power work T-45).
- **Entire named mechanic, not one feature, dead** (Iron Clock's density
  ladder T-32 — the plan's whole promise, "the clock, not the plate";
  REDLINE's recovery-check safety valve T-34, arguably higher-stakes since
  it's a protective mechanic, not a progression upgrade; Lazarus's Memory
  Curve T-47, the cleanest total-deadness case, three call sites, all
  permanently `undefined`).
- **Reachable for a fraction of what it claims** (Venus Rising's priority
  menu T-27, 1 of 5 options; Immaculate's structural-balance mechanic
  T-67/T-68, 1 of 6 named ratio relationships).
- **Fully built, fully reachable, still broken by one write** (Apex
  Predator T-54 — a step beyond "never wired" into "wired correctly and
  still doesn't run").
- **Half the stated concept never called from anywhere** (Oracle's
  scoring/accuracy half T-73, genuinely new shape — the prediction half is
  excellent and works, the "shows you how close it got" half was never
  wired past its own file).
- **The single worst instance of the whole audit**: Project Chimera's
  T-78 reallocation engine — fully authored, zero callers anywhere outside
  its own file, no partial UI stub of any kind, the cleanest total case in
  36+ plans.

**Count:** at minimum Event Horizon, Overhead Dominion, Hamstring Foundry
(T-17, narrower — "one tracked lift, others generic"), Quadfather (×2),
Cathedral, Gravity Is Optional, Iron Clock, REDLINE, Lazarus, Venus Rising,
Atlas (×3), Immaculate, Super Mutant (×2), Oracle, Apex Predator, Project
Chimera, House of Iron (T-29, narrower — one regex blind spot) — **18 of 36
plans**, roughly half the portfolio, with at least one instance; several
carry two or three independent instances. Status: no single fix — each
instance needs its own per-plan wiring pass (or an owner decision to retire
the feature instead, as flagged explicitly for Project Chimera and Oracle's
scoring half in the Wave 6 roadmap's open questions). The *pattern itself*
is a single lesson (verify every specific card claim independently — never
assume a feature works because its backend module looks complete), not a
single code fix.

### 2.5 Attribution-map-era bugs (reverse-nordic-curl, T-22 liftHistory)

`reverse-nordic-curl` (filed as hamstring/knee-flexion, mechanically
quad/knee-extension) was flagged pre-audit in the attribution map and
confirmed live on exactly the plans predicted to be at risk: Bench
Domination, and — the highest-stakes case, quantified for the first time —
Quadfather (T-19), where it understates the plan's own specialization
muscle (quads) by ~10.6% and overstates hamstrings by 20%. It was tested
for on every subsequent plan and never reproduced again outside those two —
confined entirely to Wave 1/Wave 3, not a portfolio-wide exposure. `T-22`
(`liftHistory` has no write path anywhere in the codebase, silently
breaking the `strength_chart` dashboard widget) is a different shape:
discovered mid-Wave 3 on Workhorse, confirmed independently a second time
on Gravity Is Optional, and from that point tested on every plan requesting
the widget — reproduced again on Neural Overload (compounded with a missing
switch-case, T-65) and Immaculate (T-71, where the plan's own case is
correctly built but reads the dead field regardless). At minimum Overhead
Dominion, Hamstring Foundry, Cathedral, Quadfather, Workhorse, Gravity Is
Optional, Neural Overload, and Immaculate all request this widget — **8
confirmed-affected plans**, likely more that weren't independently
re-checked once the pattern was established. Status: single portfolio-wide
fix (add the write path), flagged in Wave 3 as plausibly the highest-
leverage fix to come out of the audit at that point in the process.

### 2.6 `type: 'wave'` progression math (T-3)

Confined to exactly one plan across the entire portfolio: King of the
Squat. Neural Overload was carried as the audit's longest-open suspicion
(flagged since the start of Wave 2) and definitively cleared in Wave 6 —
its "1-6" scheme uses `type: 'percentage'` with a function-valued percent,
never `type: 'wave'` at all. No other plan in the portfolio uses the
`wavePercentForSet` mechanism. Status: single-plan fix, narrowest-scoped
item in this section.

### 2.7 `totalSystemWeightKg` allowlist gate (T-23 family)

`WorkoutView.tsx:842`'s total-system-weight computation is gated to a
hardcoded plan-id allowlist (`kali`/`workhorse`/`gravity-is-optional`)
rather than being driven by `weightMode`. Confirmed reproducing on
Workhorse, Gravity Is Optional, Kali (the plan that makes it easiest to
trigger, via an onboarding-offered menu choice), Atlas (T-43, a more
specific root-cause than the first three), Neural Overload (T-66), and
Immaculate (T-72) — **6 confirmed instances**. Structurally inapplicable
(zero `weighted-bodyweight` exercises in the pool) on the majority of Wave
5-6 plans checked (Iron Clock, REDLINE, 30-Min Adventure, Lazarus, Skeleton,
Apex Predator, Oracle, Project Chimera, Super Mutant), so this is a narrow
gate that only bites plans that happen to use weighted-bodyweight lifts,
not a wave-wide or category-wide property. Status: single fix recommended
in-thread (make the gate `weightMode`-driven, not plan-id-driven, so it
can't silently exclude future plans the way it excluded Atlas).

### 2.8 Other named shared patterns

- **T-4 (duplicated exercise definitions drifting independently)** — the
  extreme case is Bench Domination's Weighted Pull-ups (three separately
  typed `sets:` values, only one ever fixed). Tested for on every
  subsequent plan and never reproduced in its classic divergent-branch form
  again — confirmed as a Wave-1-era artifact of a coding style Wave 2+
  plans structurally don't use (generic-engine phase transforms and
  single-source-of-truth Sets both avoid it by construction).
- **`startDate` sub-field gaps in `programProgress`** — a quieter,
  lower-severity recurring shape (REDLINE T-37, Atlas T-46, Lazarus's
  equivalent, Skeleton T-52, Apex Predator's wider "no entry at all" T-56)
  found on five plans across Wave 5-6. Mostly consequence-free due to a
  working `user.startDate` fallback confirmed on Atlas, but not verified on
  every instance.
- **App-wide accessibility/session findings, not plan-specific** — non-
  focusable plan-selection cards (T-7) and hard navigation dropping the
  session, both noted once in Wave 0-1 and correctly not re-derived per
  plan thereafter.

---

## 3. Wave-by-wave retrospective

**Waves 0-1 (calibration + powerlifting).** Established the audit's core
method and its first major finding: every one of the five dedicated-engine
plans (Pain & Glory through King of the Squat) shipped at least one
critical defect that broke its central promise, in three distinct failure
shapes — total non-wiring (Blackout), total inaccessibility (Pain & Glory,
blocked at registration), and partial/silent wrong numbers (Bench
Domination, King of the Squat) — with the third shape flagged as the most
dangerous, since it produces a plausible, fully-populated session that
quietly delivers the wrong thing. The plan-switch routing bug (T-1) and the
`resetProgram()` allowlist gap (T-2) were both discovered here and correctly
generalized before Wave 2 even began.

**Wave 2 (hypertrophy generalists).** Introduced and then complicated the
"generic `definePlan()` engine is structurally safer than bespoke" theory:
Monolith and Purgatorio held it up cleanly (one bug each, and it was
always T-9); Event Horizon broke it in a new way — a *feature*, not an
engine bug, can still be entirely unreachable regardless of engine
cleanliness; Tenfold showed the axis is actually two independent things
(generic day/phase layer vs. having a bespoke status object) rather than
one binary; Pencilneck closed the wave showing bespoke engines aren't
automatically unsafe either, just differently unsafe (a shallow-overwrite
status-drift class not seen on any generic-engine plan). T-9 reproduced
5/5. Wave 2 closed meaningfully cleaner in aggregate than Wave 1 — findings
skewed toward doc-vs-code mismatches and the one shared bug rather than
plan-breaking local defects.

**Wave 3 (specialization).** The dead/decorative-feature pattern became
the wave's dominant and most consistent signal: 6 of 8 plans had at least
one specific card claim that failed live verification, almost always tied
to a declared-but-unwritten status object feeding a claimed adaptive
feature. Only Arms Race and Peachy came through clean, and both notably
lack a status object something claims to adapt from — the clearest
positive/negative contrast pair in the whole audit. Quadfather delivered
the quantified reverse-nordic-curl finding predicted since Wave 1. T-22
(`liftHistory`) was discovered here and immediately flagged as the wave's
highest-leverage fix.

**Wave 4 (powerbuilding/physique).** The audit's cleanest wave by a wide
margin, and its dashboard-architecture peak: 4/4 plans built their own
dedicated dashboard component and all 4 turned out T-9-immune, the first
clean sweep of the audit. The dominant defect shape shifted from Wave 3's
"entirely dead status field" to something narrower — every plan had one
genuinely wired, mostly-working system with one precise internal gap
(Athena's allowlist omission, Venus Rising's 4-of-5 dead menu options,
Kali's third T-23 reproduction, House of Iron's single-regex AMRAP blind
spot). This is the wave where "dedicated dashboard = T-9 immunity" went
from hypothesis to established rule.

**Wave 5 (conditioning/constrained).** The category shift was real and
immediate: T-9 immunity did not carry over from Wave 4's clean sweep (only
2 of 7 plans immune, both via true dedicated components), and a new,
more severe defect class emerged — an entire *named mechanic*, not a side
feature, silently dead on a majority of plans (4 of 7: Iron Clock, REDLINE,
Lazarus, and, in the sharpest variant, Apex Predator's fully-built-but-
unwritable assessment). The wave also produced the audit's first cleanly
isolated write-path failure (Apex Predator's T-54), which would become
Wave 6's dominant story. Three plans (30-Min Adventure, Atlas, Skeleton)
broke the dead-mechanic streak in three different ways, showing the
pattern tracks with "has an unwired status-object safety/progression
layer," not with the conditioning category itself.

**Wave 6 (advanced prototypes + roadmap).** The worst per-wave "does the
headline feature actually work" record in the audit: 5 of 5 plans shipped
with their signature mechanic non-functional or partially so, and severity
escalated across the wave rather than staying flat — from a two-site write
failure (Super Mutant) to blocking login itself (Immaculate) to total
session loss (Oracle) to the cleanest, most total dead-engine case found
anywhere (Project Chimera). This is also where the write-path saga was
definitively established as one shared condition rather than five
coincidences, and where the audit's most ambitious engineering
(prediction models, adaptive reallocation, reactive scheduling) proved
consistently the *least* likely to reach an athlete.

**Wave 7 (Ghost in the Machine, concept, doc-only).** Not a live-plan
audit — a feasibility/spec review of an unbuilt pre-audit pitch fragment.
Its most important contribution is retrospective: it explicitly names the
dead-status-object/unwired-engine pattern (5/5 hit rate across Wave 6) as
the single most important thing a future build in this style must design
around from day one, and flags the still-unresolved write-path bug as a
second, independent blocker any new adaptive plan would inherit
immediately. A narrower, advisory-only piece of the original pitch
(camera-based lift analysis) did ship — inside Apex Predator, not as a
standalone Ghost plan.

**The narrative arc:** dashboard architecture quality trended toward its
peak in Wave 4 (clean 4/4 dedicated-dashboard immunity) and then fell away
in Wave 5-6 as plans got more experimental and stopped consistently
building dedicated dashboards. Dead-feature rate correlates directly with
plan ambition, not wave/category: the plans with the most sophisticated
named mechanics (Iron Clock's density ladder, REDLINE's safety valve,
Lazarus's Memory Curve, Oracle's scoring engine, Project Chimera's
reallocation engine) are exactly the ones where the mechanic is entirely
or mostly dead, while more modest, narrowly-scoped plans (Arms Race,
Tenfold, Peachy) came through with their specific claims intact. The write-
path failure is the clearest escalation of the whole audit — first isolated
cleanly and narrowly on Apex Predator at the close of Wave 5, then widening
in scope and severity on every subsequent Wave 6 plan without exception.

---

## 4. Cross-plan design patterns

**Positive:**

- **"Never compound an estimate on an estimate."** Independently
  reinvented, correctly, on at least four plans (Trinary, Bench Domination,
  Ritual of Strength, Pain & Glory by design) — periodic hard resets to a
  freshly-tested e1RM rather than letting small weekly bumps stack
  indefinitely.
- **Genuinely wired adaptive mechanics that work end to end.** Athena's
  `exerciseLoads` progression and dedicated dashboard; Kali's cross-plan
  `performanceProfile` read (the only plan confirmed to genuinely consume
  data other plans write); Atlas's carry-limiter swap (the most
  sophisticated live cross-session adaptive logic confirmed working
  anywhere in Wave 5); Skeleton's plank-target progression; Apex Predator's
  six-region assessment engine (once seeded, the cleanest-executing
  adaptive logic found anywhere in Waves 5-6 — undermined only by its
  broken save write, not its design); Oracle's prior-based prediction half.
- **Deload/purge auto-insertion with correct week renumbering** — solved
  correctly, independently, on both Ritual of Strength and Bench
  Domination in Wave 1, a genuinely hard scheduling problem neither got
  wrong.
- **Warm-up ramp generation, tempo notation, and RIR/quality-capture UI**
  — consistently well-built wherever actually wired, across every wave
  checked.
- **Every literal card claim surviving verification** — achieved cleanly
  on only two plans in the whole audit (Tenfold, Arms Race), the strongest
  positive signal available and worth treating as the bar the rest of the
  portfolio should be measured against.

**Negative:**

- **Concentration risk.** Per the attribution map's §25, thirteen movements
  appear in ~45% of all 36 plans, with `cable-triceps-extension` (22 plans),
  `incline-dumbbell-bench-press` (20), and `ab-wheel` (18) the most extreme
  cases — plans differ in set/rep scheme far more than in actual movement
  selection, which is the mechanical root of the "sameness" the owner had
  already flagged pre-audit.
- **Nine muscles with no adequate loader anywhere in the portfolio**: soleus
  (unreachable — its one candidate movement is never used), tibialis
  anterior (misfiled as calves via `loaded-ankle-rock`), direct adductors,
  direct erectors, upper traps, lower traps, serratus, isolated upper pec,
  and (thin coverage) rectus femoris.
- **Specific misattributions with real downstream cost**: `reverse-nordic-
  curl` (hamstring/knee-flexion filed, actually quad/knee-extension —
  quantified at a 10.6% quad understatement on Quadfather, its own
  specialization muscle); `around-the-worlds` (filed rear delt, actually
  pec-upper/front-delt); `y-raise` (filed rear delt, actually lower trap —
  hiding the portfolio's only good lower-trap option); `wall-slide` (filed
  front delt, actually lower-trap/serratus mobility work); `loaded-ankle-
  rock` (filed calves, actually the portfolio's only tibialis-anterior
  loader); undifferentiated triceps-head crediting on every press.
- **Duplicate exercise pairs still splitting usage history** without an
  alias linking them — `heel-elevated-goblet-squat`/`goblet-heel-elevated-
  squat`, `romanian-deadlift`/`barbell-romanian-deadlift`, `hammer-curl`/
  `dumbbell-hammer-curl` are the three damaging ones, both sides live in
  different plans.
- **The dead/decorative-feature pattern itself (§2.4)** is the dominant
  negative design pattern of the entire audit, hitting roughly half the
  portfolio.

---

## 5. Portfolio health by category

Ranked strongest to weakest as a wave/category group, for an owner
deciding where to focus implementation effort first:

1. **Strongest: Wave 4 (powerbuilding/physique — Athena, Venus Rising,
   Kali, House of Iron).** The only wave with a clean sweep on T-9 immunity
   (4/4 dedicated dashboards), and every plan's remaining gap is narrow and
   mechanically specific rather than a wide dead-feature surface. This is
   the wave to point to as "what a well-executed plan in this codebase
   looks like."
2. **Wave 3 (specialization).** Genuinely strong training design across
   the board (Arms Race and Peachy came through essentially clean; even
   the flawed plans have well-thought-out exercise-role structures), but
   the dead-feature rate (6/8) is the wave's real drag — the training
   *design* is arguably as strong as Wave 4's, the wiring is not.
3. **Wave 2 (hypertrophy generalists).** Cleaner in aggregate than Wave 1,
   dominated by the single shared T-9 bug rather than plan-breaking local
   defects, with one severe exception (Event Horizon's fully dead region-
   swap engine).
4. **Waves 0-1 (calibration + powerlifting).** Strong, well-researched
   periodization across all five dedicated-engine plans, but every single
   one shipped a critical defect undermining its central promise — the
   pattern that set the tone (and the testing method) for the rest of the
   audit.
5. **Wave 5 (conditioning/constrained).** Mixed: three genuinely clean
   core-mechanic results (30-Min Adventure, Atlas, Skeleton) sit alongside
   four dead-headline-mechanic plans, and it's the wave where the
   write-path bug first surfaced. Category-wide, dashboard architecture
   regressed sharply from Wave 4's clean sweep.
6. **Weakest: Wave 6 (advanced prototypes).** The worst headline-mechanic
   record in the audit (5/5) and the wave carrying the unresolved,
   escalating write-path failure that is now the audit's top infrastructure
   concern. The individual engineering quality is often excellent
   (Immaculate's fix is two lines; Apex Predator's engine is the best
   adaptive logic found anywhere) — the *category's* honest state is "the
   most ambitious ideas in the portfolio, the least likely to reach an
   athlete."

Wave 7 (Ghost in the Machine) is excluded from this ranking — it is an
unbuilt concept, not a shipped plan, and its own doc already frames it
against this exact pattern as the risk a future build must design around.

---

## 6. What this report does not do

Per PROC-1 (`_audit-decisions.md` §0), the entire audit — including this
report — is findings-only. Specifically, this report does **not**:

- Authorize or begin any code change, merge, or wiring fix. Nothing above
  is a ticket; every tag from each plan's own doc (`hypothesis` /
  `shared-bug` / `plan-local`) still applies and is not superseded here.
- Sequence a fix order across all 82 TECHNICAL items. That is explicitly a
  separate task for if/when the owner wants it — this report organizes the
  findings by theme, not by priority order, deliberately.
- Duplicate the Wave 6 roadmap's per-plan sequencing for Project Chimera,
  Oracle, Immaculate, and Apex Predator. That document
  (`_wave6-advanced-plans-roadmap.md`) already did that work for those four
  plans specifically — see it directly rather than this report for their
  effort tiers and recommended order.
- Resolve any parked per-plan design question. Sections §1-8 of
  `_audit-decisions.md` remain PARKED until the owner opens the post-audit
  decision round, exactly as before this report.
- Root-cause the shared write-path bug. Every attempt at a client-side
  rules-clause trace across five Wave 6 isolations failed to pin the exact
  cause; this remains an open server-side investigation for whenever the
  owner opens that work.

**New cross-cutting questions surfaced by writing this report, not
previously logged anywhere as a decision-log id** (flagged here for a
future round, not assigned a `PLN-N` id per the task's own instruction):

- Should the `resetProgram()` allowlist and the `dashboardViewWeek` cache
  both be refactored to derive from a single plan registry (so a new
  plan's status field and dashboard immunity are correct by construction)
  rather than fixed plan-by-plan after the fact, given the fix has been
  reactive on every wave so far?
- Given the dead-feature pattern's ~50% hit rate, should future plan
  ships require a lightweight "does the card's headline claim survive a
  single live clickthrough" check before shipping, rather than relying on
  a retrospective audit to catch it?
- For the handful of dead mechanics that are large, genuine design/scope
  decisions rather than wiring bugs (Project Chimera's reallocation
  engine, Oracle's scoring half, Lazarus's Memory Curve) — does the owner
  want each one built out as originally designed, or is a smaller,
  cheaper alternative mechanic (e.g., a read-only descriptive surface
  instead of a full write/reallocation loop) worth considering per plan?
  This mirrors the two design questions the Wave 6 roadmap already raised
  for Project Chimera and Oracle specifically, generalized to the rest of
  the dead-mechanic list.

---

## 7. Closing note

**The full 36-plan-plus-Ghost-in-the-Machine audit (Waves 0-7) is now
complete with this report**, per the original scope's item 6
(`_audit-status.md` §1). Every plan in the review order (`_audit-status.md`
§3) has been individually reviewed, documented in `docs/plans/v2/`, and is
now synthesized here at the portfolio level.

The only remaining items, per `_audit-status.md` §8 ("Open items") and the
parked sections of `_audit-decisions.md`, are:

1. **The post-audit implementation pass** (PROC-1) — not started, and not
   authorized by this report. Requires the owner to explicitly open that
   phase.
2. **The parked per-plan design decisions** (`_audit-decisions.md` §1-8) —
   untouched, PARKED, not re-litigated or answered here.

Both require the owner's explicit sign-off to begin. Nothing in this
document, or in the audit that preceded it, starts either one.

---

## 8. After this report (2026-08-16)

The parked design round **was** opened: per-plan `*-RB-*` (identity, frequency,
progression, tempo, techniques) and `*-V-*` (exercise variety) are decided
and indexed in `docs/plans/v2/_audit-closeout.md`. This synthesis report is
**not** rewritten to include those votes — it stays the defect/theme document.
PROC-1 is still not authorized. Iron Clock was later parked from the variety
pass.
