# HyperPlanner expansion — master implementation specification

**Status:** canonical planning baseline approved through owner interview,
2026-08-10.  
**Purpose:** the canonical implementation order and cross-plan contract for the
existing-plan overhaul, House of Iron/Apex/REDLINE/Venus/Athena/Kali, and the 12
next expansion concepts. Detailed exercise selection is reviewed again directly
before each plan is implemented.

Ghost in the Machine is specified only as an optional prototype gate. It is not
part of the production build covered by this pass.

---

## 1. Delivery contract

1. Finish extracting existing save-time progression before adding new engines.
2. Build shared engines before plans that consume them.
3. Write and review the plans, then implement them one at a time.
4. Before implementing each plan, ask a short plan-specific confirmation round
   covering final exercises, sets, swaps and any engine behavior still open.
5. Unreleased plans remain absent from the catalogue. Do not show placeholders.
6. Each engine is independently testable and may be extracted before a second
   consumer exists when the reuse case is credible.
7. Existing behavior stays compatible where practical. Do not rewrite working
   old-plan logic merely to make it look uniform.
8. There are no production users or launch data to migrate. Existing schemas and
   exercise IDs may be normalized from scratch, provided every reference, alias,
   rule and verification script changes atomically.
9. Every major plan change is documented in `PLAN.md`, with the required local
   backup before implementation.

---

## 2. Architecture boundaries

Keep these as distinct packages rather than one universal engine:

1. **Progression primitives** — Epley, rounding, double progression, top-set and
   back-off, fixed-load ladders, density progression, total-system-weight work.
2. **Save-time progression** — pure per-plan handlers that return writes/effects.
3. **PerformanceProfile** — cross-plan performance observations and confidence.
4. **Exercise intelligence** — canonical patterns, costs, compatibility and swap
   rules.
5. **Plan lifecycle** — phases, calendar weeks, schedule modes and reruns.
6. **Session adaptation** — calibration, recovery response, fatigue-aware swaps,
   bonus sessions and plan mutations.
7. **Analytics/recommendations** — retention, density, prediction error, portfolio
   follow-ups and dashboards.
8. **Sensor analysis** — optional camera/AI work isolated from core logging.

Plans should be declarative where that makes behavior legible. Bespoke handlers
remain appropriate for Super Mutant, Trinary and other genuinely unusual plans.

Existing per-plan status fields may remain separate. A generic `planState` rewrite
has no current product benefit.

---

## 3. Foundation build order

### F0 — Repository and documentation baseline

- Treat GitHub `main` at `2dec349` as the code baseline.
- Preserve the local 12-plan concepts document and new artwork.
- Keep canonical documents tool-neutral; assistant-specific source wording is
  preserved only in the archive.
- Establish the canonical documentation hierarchy described in §17.

### F1 — Complete progression extraction *(complete on baseline `2dec349`)*

- Remove the remaining inline plan fallbacks from `WorkoutView`.
- Keep handlers pure and independently verified.
- Preserve old-plan output except for specifically documented defects.
- Make every handler cycle-aware and exclude warm-up, incomplete and
  technique-derived work from plan progression.
- Extra work may enter general performance history but never plan progression.
- Change Trinary Reverse Hyperextensions from deadlift-1RM percentage loading to
  their own controlled-ROM double progression.

### F2 — Exercise-library normalization *(complete; 215 canonical exercises)*

- Normalize duplicate IDs and aliases before authoring new metadata.
- Expand the existing `pattern` taxonomy; do not introduce a competing
  `movementFamily` field.
- Model machine variants and grips as child variants unless mechanics or history
  are materially different.
- Bilateral and unilateral forms share a family but keep separate performance
  histories.
- Horizontal selectorized and 45-degree plate-loaded leg presses are distinct.
- The two pec-deck stations represent the same exercise.
- Machine Press/Fly Combo is distinct from both Chest Press and Pec Deck.
- Do not build a configurable gym-equipment catalogue yet, but keep exercise and
  performance types open to a future equipment/version ID.

Required additions/cleanup:

- Side/Glute-Medius Hip Thrust (band or plate above knee);
- Single-Leg Glute Bridge (bodyweight is load `0`);
- Single-Leg Hip Thrust;
- Single-Leg Machine Hip Thrust;
- Copenhagen Plank and dynamic Copenhagen Raise, each with short/long lever;
- Stripper Squat as independent history in the Hack Squat family;
- full GHR with assisted/eccentric/full/loaded ladder;
- Nordic assisted/partial/eccentric/full/loaded ladder;
- Reverse Hyperextension with controlled-ROM progression;
- Supported Sissy Squat with myo-reps permitted from the start;
- preserve Stiletto Squat and Heels-Off Narrow Leg Press.

Training unilateral rule: perform the weaker side first and make the stronger
side match it. Never prescribe additional reps for the stronger side. Do not add
per-side set logging. Apex assessment results may still store left/right values.

### F3 — Canonical exercise metadata *(authored; owner audit pending)*

Author all fields for the complete library before a decision-making consumer
ships. Codex writes the first pass; the owner audits it.

Use documented ordinal values `0..4` with anchored meanings and an explicit
`unknown` state during authoring. Store schema version and provenance.

Canonical fields include:

- expanded `pattern`;
- primary and secondary muscles;
- equipment and variants;
- stability demand;
- systemic fatigue/cost (one field, not two);
- axial, lower-back, elbow, shoulder and knee cost;
- lengthened/shortened bias;
- unilateral capability;
- intrinsic systemic-compound default;
- home compatibility;
- camera friendliness;
- density compatibility;
- ordinary failure suitability.

Replace generic joint-stress tags with the separate cost fields. Progression
type belongs to the plan slot, not the exercise. `systemicCompound` exists as an
exercise default and a slot-level override. Every contextual cost supports a
slot override.

### F4 — PerformanceProfile *(collection/write foundation complete)*

Use `users/{uid}/performanceProfile/{exerciseId}` documents rather than embedding
all exercise history in the user profile. A compact summary/cache may live on the
user document only when profiling demonstrates a real read benefit.

Store multiple qualifying observations per session and retain the source set,
exercise variant, plan, date, load, reps, RIR, quality, completion reason, e1RM,
confidence and future equipment/version identity.

- e1RM is considered ordinarily reliable from 5–15 reps.
- Values outside that range may be retained but are flagged low-confidence.
- Pull-ups/dips store external load and total system weight when available.
- If total system weight is unknown, external load remains usable.
- Assistance-machine load is negative external load.
- Foot-on-box assistance uses a categorical level, not fake kilograms.
- Machine history is directly comparable in the current gym; the schema must
  allow future equipment versions to break comparison chains.
- Confidence decays with time, detraining, plan changes and variation distance.
- The athlete can reject or correct transferred suggestions.
- No historical backfill/migration is needed because launch data will be wiped.

Default qualifying rules:

- prescribed completed work: include;
- completed extra work: include in profile, exclude from plan progression;
- warm-ups and incomplete work: exclude;
- technique-derived mini/drop rows: log, but do not use as comparable e1RM;
- quality-invalid work: preserve in the workout log but not as a performance best.

### F5 — Plan preferences and schedule modes *(foundation complete; plan UI pending)*

Store preferences per plan, including schedule mode and exercise selections.
Schedule changes may occur repeatedly but take effect only after the current
program week is completed. Calendar time determines the week boundary. Preserve
phase, load, history and week number. Restore prior preferences on rerun.

### F6 — Shared session engines *(pure foundations complete; plan UI pending)*

Build and verify:

- double progression;
- calibration and confidence;
- top-set/back-off rows derived from entered top-set weight;
- fixed-load progression ladders;
- quality/completion reason capture;
- block timer/density recording;
- total-system-weight progression;
- exercise/role preserving swaps;
- recovery prompt (`recovered`, `somewhat fatigued`, `performance impaired`);
- fatigue recommendation and confirmation;
- plan phase transforms and hard set caps.

Back-off rows remain editable when the top set is skipped or failed. A clean
upper-target top set at acceptable RIR progresses load; a missed or invalid set
holds it.

---

## 4. Safety and quality contract

Completion reasons:

- target completed;
- muscular failure;
- technical failure;
- voluntary stop;
- pain/discomfort stop.

Quality input (`clean`, `borderline`, `invalid`) appears only in plans where it
materially affects decisions. `borderline` work counts as completed but does not
progress. `invalid` work neither progresses nor establishes a best.

Exercise metadata defines ordinary failure suitability. Advanced plan slots may
explicitly override it with plan-specific instructions. Pain/discomfort stops the
exercise, recommends consulting a trainer/physio as appropriate, and presents a
compatible alternative without medical diagnosis.

---

## 5. Already-developed expansion plans

These belong to the same master program as the 12 concepts.

### House of Iron *(implemented 2026-08-10)*

- 8-week repeatable, free-order Push A/Pull A/Push B/Pull B.
- Two days allowed, three recommended, four supported.
- User records a list of available DB/KB weights and chooses a preferred
  implement when both types exist.
- Recommendation is advisory; ignored imbalance produces a warning, never a
  block.
- Progression ladders are authored per family and require confirmation.
- Two clean top-range exposures trigger the next ladder recommendation.
- Week 8 proposes confirmed Cycle-2 variations.
- Carries stay optional.

### Apex Predator *(implemented 2026-08-11)*

- 12 weeks, three-day full body.
- Mandatory regions: ankle dorsiflexion, active straight-leg raise, hip rotation,
  shoulder flexion, shoulder rotation and thoracic rotation.
- Squat access is a descriptive integration screen.
- Tests are individually skippable; pain/skip is invalid rather than poor.
- Store exact left/right measurements when supplied and accept a 1–3 fallback;
  test-specific thresholds normalize measurements before region ranking.
- Squat/Bench/Deadlift video analysis is optional AI advice, never a diagnosis
  and never an automatic prescription change.
- Test-specific asymmetry thresholds; preserve left/right assessment trends.
- Select up to two genuinely deficient regions, never invent weaknesses.
- At most two access movements of two sets per session.
- Improved regions may be replaced after a preview at retest.
- Completion suggests only Skeleton or Immaculate, depending on outcome.

### REDLINE *(implemented 2026-08-11)*

- 8 weeks, four-day full body, 40–50 minutes.
- Persistent Furnace choice: Paused Bench or Standing OHP.
- Hack Squat default Pressure anchor; free squat advanced swap.
- Heavy pulldown default; weighted pull-up when at least five strict reps.
- Stable row defaults: Converging Machine Row, bilateral Hammer Low Row and
  Unilateral Machine Row. Never suggest the core/hamstring-taxing Standing Row.
- Carries are timed. Timed work after expiry may be logged but does not improve
  density.
- Density comparison requires equivalent exercise/variant/load/reps/duration;
  the engine adapts comparison lineage rather than throwing history away blindly.
- Standardized Week-8 five-minute benchmark unless recovery is red.
- Uses PerformanceProfile and shared block infrastructure.
- Recovery input precedes each session; temporary finisher reduction is visible
  and reversible.

### Venus Rising *(implemented 2026-08-11)*

- 12 weeks; four-day default, three-day FBW option.
- Phase 2 lowers RIR and adds limited priority volume inside the hard cap.
- Dashboard includes phase, priority exposure, representative glute/delt/pull
  performance, schedule consistency and progression readiness.
- No plan-specific measurement widget.
- User selects approved variants once per run.
- Include Side/Glute-Medius Hip Thrust, rotating/replacing ordinary abduction.
- Supported Sissy Squat is mainly reserved for quad specialization/low-cost burn.
- Default chest movement is DB Press.

### Athena *(implemented 2026-08-11)*

- 12 weeks; four-day default and three-day FBW option.
- RDL is the default hinge; main-lift families are selectable per run.
- Back-offs derive from entered top-set weight; 10% default with 7.5–12.5%
  slot overrides.
- Optional onboarding maxes for selected primary lifts; skipped values calibrate
  on first exposure.
- Week 12 consolidates at reduced volume without a mandatory max test.
- Approved machine variants are allowed.
- No per-side training logs; weaker side governs unilateral work.

### Kali *(implemented 2026-08-11)*

- 8 weeks, permanently four-day only.
- Anchors: Hack Squat, Weighted/Assisted Pull-Up, Paused Bench, RDL.
- Assisted Pull-Up is the preferred regression; pulldown remains optional.
- Optional starting bodyweight; data model remains open to future daily-weight
  integration.
- Fixed glute/lat intensification slots; Week 8 adaptively repeats the
  best-tolerated approved technique.
- Preservation bands: ≥97 preserved/improved, 93–96 small decline, 88–92
  meaningful decline, <88 intervention recommendation, all confidence-aware.
- Calibration is offered on uncertain first exposures without turning the whole
  session into a test.
- Standing Row counts as systemic if ever configured.

---

## 6. Twelve-concept specifications

### BLACKOUT *(implemented 2026-08-11)*

- Advanced only; 8 weeks, three-day full body.
- Warm-up/calibration, one primary work set, optional earned back-off.
- Back-off requires clean primary quality and acceptable recovery.
- Manual quality and completion reason are mandatory.
- Failure only on approved low-risk slots.
- Stall response: recovery check → repeat → rep-target adjustment → exercise
  change → only then consider an added set.
- Recovery recommends the next exposure but never blocks another session.

### QUADFATHER *(implemented 2026-08-11)*

- 10 weeks, four days; quads three times, other major muscles maintained twice.
- Roles: Load, Unilateral/Depth, Knee-extension/Burn.
- Hack Squat is the main load default. Squatting is advised for short/regular
  limb proportions; Stiletto Squat is offered for long-limbed athletes.
- ROM is manually confirmed and may also be inferred from an approved variation.
- Knee feedback may replace main or accessory work after confirmation.
- Burn pool includes Supported Sissy Squat, Leg Extension, Reverse Nordic and
  Stripper Squat. Stripper Squat is a burn movement, not a late strength variant.
- Dashboard shows role balance and ROM, not a squat-total imitation.

### MONOLITH *(implemented 2026-08-11)*

- 10 weeks, four-day upper/lower; machine-dominant, not machine-exclusive.
- Uses the known fixed gym inventory without per-run machine selection.
- Mix bilateral/unilateral execution for useful variety.
- Systemic-fatigue aware; it does not ban barbells categorically.
- Progress effort/RIR first, then selected safe machine techniques.
- Machine Press/Fly Combo has independent history. Do not pair it operationally
  with the distant Pec Deck when transition time breaks the session.

### LAZARUS *(implemented 2026-08-11)*

- Any previously trained athlete after at least three months away; 8 weeks,
  three-day full body.
- Onboarding records break duration and prior experience.
- Uses exercise/close-variation history; broader transfer requires calibration.
- Memory Curve shows lifetime best and latest stable pre-break performance.
- Weeks 1–2 set caps remain hard despite readiness.
- Two clean underestimated sessions accelerate progression.
- Works from self-reported history plus calibration when no profile exists.
- Injury-return copy states that this is not rehabilitation and suggests a
  trainer/physio and/or Apex according to severity.

### ATLAS *(implemented 2026-08-11)*

- 10 weeks, three-day full body, organized as two five-week gauntlets so the
  athlete can master a movement set before switching.
- Defaults: Safety-Bar Squat, Trap-Bar Deadlift, Standing Barbell Press,
  Weighted Pull-Up, unilateral legs, rows, trunk, grip and carries.
- Conventional and sumo deadlifts are approved hinge choices.
- Carries use `time × load` as the main metric and optional limiting-factor tags.
- One main carry and one shorter carry exposure weekly.
- Optional power work includes KB swings, KB shoulder press and Turkish get-up.

### THE MINIMUM *(implemented 2026-08-11)*

- 10 weeks; two mandatory full-body sessions, about 14–16 sets each.
- Different movements cover every major muscle in both sessions.
- Bonus sessions are technically unlimited but one/week is recommended.
- Bonus modules are approved templates, low-systemic and underexposure-driven.
- Bonus work enters volume/profile/history but never mandatory progression.
- Performance decline discourages the next bonus session.
- Avoid redundant isolation and high-transition work.

### CATHEDRAL *(implemented 2026-08-11)*

- 10 weeks, four days, chest three times; Three Arches remain balanced.
- Primary heavy press: Incline DB Press.
- Stretch role: below-parallel Dips and Cable Flyes.
- Adduction: Pec Deck/Chest Crossover; Combo machine may fill Press or Adduction.
- No barbell bench; Smith Incline Bench is an approved alternative.
- Dashboard combines the Arches into one chest profile while still exposing
  limiting fatigue (triceps, anterior delts, shoulders, pecs).
- Shift pressing toward stable adduction work when non-pec fatigue dominates.

### IRON CLOCK *(implemented 2026-08-11)*

- 8 weeks; four-day primary mode plus three-day FBW option.
- Shared block engine with REDLINE, but density is the overload method.
- Block count/duration adapts to schedule rather than obeying a rigid template.
- Progress: valid completion → reps/rounds → time compression → load increase →
  target reset.
- Athlete manages rest with a maximum-rest warning; show all timer/pacing data.
- Round-level quality confirmation.
- Pairings are curated pragmatically, not by a universal antagonistic rule.
- Changed exercises/loads/variants adapt comparison using equivalence/confidence
  rather than automatically discarding all history.

### ORACLE *(implemented 2026-08-11)*

- Dedicated 10-week, four-day upper/lower validation plan; Weeks 1–2 calibrate.
- Build the full prediction capability rather than restricting production to a
  permanently hand-coded heuristic. Begin with transparent priors and allow the
  model to personalize as comparable evidence accumulates.
- High confidence requires at least three comparable recent exposures, including
  one within four weeks.
- Low confidence offers calibration; medium gives a range; high gives one editable
  target.
- Prediction error uses reps, load and reported RIR, not e1RM alone.
- External-factor flags reduce anomaly influence.
- May adjust load, reps and sets.
- Accuracy uses honest bands/trends; standardized percentages only when valid.
- Provider confirmed 2026-08-11: Gemini, called through Cloud Functions with the
  key in Secret Manager. Configuration, bounds and privacy are documented in
  [AI integration](../architecture/ai.md).
- Offline and outage behaviour: the prior-based prediction is the product. Model
  refinement is bounded to ±7.5% and its absence changes nothing.

### PROJECT CHIMERA *(implemented 2026-08-11)*

- 16 weeks, four-day upper/lower, four 4-week blocks.
- Balanced Squat/Hinge/Push/Pull/Unilateral/Hypertrophy base.
- Every mutation is previewed and confirmable by component.
- May change exercises when stagnation/fatigue is meaningful and confidence is
  adequate.
- Reallocation cap: normally two weekly sets per quality per block.
- Preserve minimum exposure in every quality.
- May invest in weaknesses or fast-improving qualities when evidence supports it.
- Phenotype appears after every block but never drives logic.
- Insufficient data means no forced mutation.

### EVENT HORIZON *(implemented 2026-08-11)*

- 12 weeks, dedicated four-day hypertrophy plan.
- Exercise costs and recovery budgets use the documented 0–4 ordinal model.
- User reports region plus `normal / strained / impaired`; explicit impaired
  feedback is authoritative for recommendations.
- Every recommendation shows planned movement, replacement, preserved role,
  reduced costs and tradeoffs.
- Every swap requires confirmation.
- Initial stimulus preservation is rule-based, not a fake exact score.
- May split one demanding movement into multiple cheaper roles.
- Present all safe options when no perfect swap exists.
- Personal learning begins after three comparable exposures and remains bounded
  around expert metadata.
- Track whether accepted swaps improve subsequent performance/fatigue.

### GHOST IN THE MACHINE — video analysis shipped 2026-08-11

- Still no dedicated plan. What shipped is the video-analysis capability,
  surfaced inside Apex Predator's optional assessment step.
- Squat, Bench Press and Deadlift are analysed by Gemini through
  `aiAnalyzeLift`; the clip is forwarded and discarded, never stored.
- The result is advice. It is confidence-flagged, it refuses to diagnose, and no
  prescription in the app may change because of it.
- On-device signal work remains unexplored.
- Acceptance requires reliable rep counting, concentric trend, coarse ROM
  consistency, bad-angle rejection and zero programming action from low confidence.

---

## 7. Existing-plan review commitments

- Pencilneck keeps Wide-Grip Barbell Row and Standing Military Press.
- Peachy GHR gains the full progression ladder; Single-Leg Machine Hip Thrust
  remains fixed rather than alternating with a free-weight version.
- Pain & Glory keeps knee-flexion work dominant; Reverse Hyper is only an
  optional controlled low-load substitute, never extra hinge volume.
- Bench Domination may swap Reverse Nordic for Supported Sissy Squat.
- Super Mutant's indefinite-pool mode shipped 2026-08-11 as an opt-in: the base
  12+2 programme remains the default and is unchanged, and the mode rotates only
  which movement fills a slot the existing generator already produced.
- Exercise swaps are selected once per plan run, not dynamically from equipment
  occupancy.

---

## 8. Tip system *(implemented 2026-08-11; owner audit outstanding)*

Canonical sources:

1. **Plan/slot-specific prescription cue** — rendered first in the plan accent or
   a related high-contrast signal.
2. **General exercise technique cue** — rendered second in a distinct, quieter
   color.

Do not add visible text labels; color and ordering provide separation. Both tips
show by default. A plan may suppress the general tip only through an explicit,
exceptional Admin control.

Admin requirements:

- Exercise Library edits English and Polish general tips, setup notes and coverage.
- Plan Composer edits plan-movement and scoped plan-slot tips.
- Show the inherited general cue while authoring plan guidance.
- Provide append/suppress behavior; retire ordinary replacement semantics.
- Preserve unsaved edits and version plan-tip changes.
- Add filters for missing English, awaiting audit, missing Polish and overridden.
- Migrate legacy `notes`, translation-key advice and `variantTips.ts` into the two
  canonical layers without losing wording.
- Verify precedence, bilingual fallback, scope and duplicate elimination.

Authoring proceeds in two gates: Codex drafts every English general tip based on
the owner's original-eight style; the owner audits training content; Polish is
written only after English approval.

---

## 9. Theme system

Every plan artwork is visual evidence for its theme. Preserve the shared Protocol
Sheet shell and interaction hierarchy. Per-plan identity is a token set, never a
layout fork:

- neutral accessible chassis;
- artwork-derived panel tint;
- artwork-derived primary signal;
- contrast-safe signal text;
- optional restrained secondary tint;
- grayscale-first artwork with color in active/featured states.

Audit all current and future plans, including the new local artwork in `public`.
Extract candidate palettes from the actual images, then review perceptually rather
than trusting filename or automated averages. Verify every theme in English and
Polish, dark/light exceptions, mobile/desktop, focus, error and disabled states.

---

## 10. QA gates

Every engine requires example tests plus invariant/property tests. Every plan must
pass automated checks for:

- registry/theme/artwork/i18n completeness;
- session set caps and phase transforms;
- weekly volume and meaningful frequency;
- systemic-compound and unilateral requirements;
- metadata completeness and schema version;
- swap role/cost/progression compatibility;
- extra/technique isolation from plan progression;
- rerun, calendar-week and schedule-switch safety;
- missing/low-confidence history;
- dashboard source correctness;
- tip precedence and bilingual fallback;
- accessibility and responsive rendering.

Structural invariants fail CI. Training-volume/fatigue judgments produce review
reports with explicit documented exceptions.

Build a multi-cycle simulator covering stalls, skipped sessions, calendar passage,
mode switches, reruns, fatigue responses and deloads.

---

## 11. Recommended implementation waves

1. F0–F3: baseline, progression extraction, library normalization, metadata.
2. F4–F6: PerformanceProfile, lifecycle/preferences and shared session engines.
3. House of Iron, Apex Predator, Venus, Athena, Kali and REDLINE.
4. Tip Admin + English audit and full artwork-derived theme pass. *(system and
   drafts shipped; the English audit itself is the owner's pass)*
5. THE MINIMUM, LAZARUS, QUADFATHER, CATHEDRAL, IRON CLOCK.
6. BLACKOUT, MONOLITH, ATLAS.
7. PROJECT CHIMERA, ORACLE, EVENT HORIZON.
8. Portfolio recommendation system and end-of-plan follow-ups. *(shipped)*
9. Super Mutant indefinite-pool redesign. *(shipped as an opt-in mode)*
10. Optional Ghost feasibility prototype only. *(video analysis shipped inside
    Apex; on-device signals not attempted)*

The precise order inside a wave may change when a newly completed engine makes a
different plan the cheaper validation target. Each plan still receives its own
pre-implementation confirmation round.

---

## 12. Catalogue and follow-ups *(implemented 2026-08-11)*

- Maintain a formal portfolio matrix: goal, experience, frequency, equipment,
  adaptability, fatigue, signature mechanic, prerequisites and “not for you if”.
- Similar broad goals are allowed when method and training experience differ.
- Rely on clear plan descriptions rather than overlap warning banners.
- Build the recommendation system after the plans.
- Suggest follow-up plans only when a plan is completed.

---

## 13. Documentation cleanup target

The documentation hierarchy is:

1. portfolio/product strategy;
2. shared engine specifications;
3. one canonical specification per plan;
4. implementation roadmap/status;
5. generated plan index and QA matrix;
6. archived source concepts, comparisons and historical handoffs.

Canonical documents use tool-neutral engineering language. Source wording and
authorship history remain intact in the archive, whose index points back to the
canonical replacements.

Unique historical material is moved rather than deleted. Archive moves require a
content map and repaired inbound links.
