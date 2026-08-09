# HyperPlanner Portfolio Review
## Old Plans vs New Plans — Summary + Claude Change Proposals

**Purpose:** condensed review of the original HyperPlanner programs against the newer catalogue, with concrete changes for Claude to consider before implementation/refactoring.

---

# 1. Executive conclusion

Do **not** retire the original plans.

The strongest old programs still contain some of the best app-native logic in HyperPlanner:

- dynamic progression;
- AMRAP/e1RM recalculation;
- reactive deloads;
- weak-point selection;
- dynamic workout generation;
- rolling volume/recovery logic;
- user-specific progression state.

The new plans improve the catalogue because they fill missing niches:

- squat specialization;
- weighted calisthenics;
- structural balance;
- periodized hypertrophy;
- shoulder specialization;
- hamstring specialization;
- arm specialization;
- weighted-chin/back specialization;
- 1–6 powerbuilding;
- GVT/high-volume training.

The main development risk is:

> **New plans becoming themed static spreadsheets while the old flagship plans remain much more mechanically sophisticated.**

Every important new plan should have at least one signature app mechanic that makes it meaningfully better inside HyperPlanner than as a PDF.

---

# 2. Portfolio snapshot

## Original / Existing Plans

| Plan | Primary Role |
|---|---|
| Bench Domination | Bench press specialization |
| Pain & Glory | Deadlift specialization |
| Peachy | Glute specialization |
| Pencilneck Eradication Protocol | General bodybuilding / hypertrophy |
| From Skeleton to Threat | Beginner full-body |
| Ritual of Strength | High-frequency powerlifting |
| Super Mutant | Reactive high-frequency bodybuilding |
| Trinary | Conjugate powerlifting |
| 30 Minute Adventure | Flexible short-session generator |

## Newer Plans

| Plan | Primary Role |
|---|---|
| King of the Squat | Squat specialization |
| Gravity Is Optional | Weighted calisthenics / relative strength |
| Immaculate (Re)Structure | Structural balance / weak-link correction |
| Purgatorio | Accumulation/intensification hypertrophy |
| Overhead Dominion | Shoulder specialization |
| Hamstring Foundry | Hamstring specialization |
| Arms Race | Arm specialization |
| Workhorse | Back / weighted chin specialization |
| Neural Overload | 1–6 powerbuilding |
| Tenfold | German Volume Training |

## Additional plans now being developed

- House of Iron
- Apex Predator
- Venus Rising
- Athena
- Kali
- Valkyrie
- REDLINE

These should be treated as a second expansion layer rather than replacements for the old plans.

---

# 3. Naming changes to propagate

Replace old concept names everywhere they surface:

- **The Weakest Link → Immaculate (Re)Structure**
- **Accumulate / Intensify → Purgatorio**
- **The Upper-Body Squat → Workhorse**

Claude should search:

- README/docs;
- plan metadata;
- plan registry;
- onboarding copy;
- translations;
- badges/widgets;
- analytics labels;
- plan-browser labels;
- tests/snapshots.

---

# 4. Portfolio ranking

## Flagship / highly differentiated

1. **Super Mutant**
2. **Bench Domination**
3. **Trinary**
4. **Immaculate (Re)Structure**
5. **King of the Squat**
6. **Gravity Is Optional**

## Very strong

- Pain & Glory
- Ritual of Strength
- Peachy
- Purgatorio
- Workhorse
- Overhead Dominion
- Hamstring Foundry

## Necessary straightforward programs

- From Skeleton to Threat
- Pencilneck Eradication Protocol
- Arms Race

Their relative simplicity is useful. Not every user should be forced into an algorithmically complex plan.

## Niche / method programs

- Neural Overload
- Tenfold
- 30 Minute Adventure

"Niche" does not mean weak; it means the user needs to specifically want that method or training experience.

---

# 5. Bench Domination

## Why it remains a flagship

Its identity comes from:

- four weekly bench exposures;
- heavy, volume, power and AMRAP days;
- paused-bench base calculation;
- AMRAP progression;
- checkpoint e1RM recalculation;
- automatic/reactive deload logic;
- assistance-lift progression;
- test-vs-peak branch;
- final peaking block.

## Claude proposals

- Preserve the current core logic.
- Do not simplify it into a generic declarative plan unless all dynamic behavior survives.
- Extract reusable low-level primitives where useful:
  - AMRAP → e1RM;
  - rounding;
  - checkpoint recalculation;
  - reactive deload;
  - top-set history.
- Keep its user-facing progression unique.
- Audit overlap with Workhorse because Bench Domination already contains sophisticated weighted-pull-up progression.

---

# 6. Pain & Glory

## Why it remains distinct

- extreme deficit snatch-grip deadlift volume;
- later E2MOM conventional work;
- AMRAP-derived e1RM;
- heavy triple/double/single peak.

## Claude proposals

Consider a support-volume taper:

### Weeks 1–8
Normal hypertrophy support.

### Weeks 9–12
Moderately reduced support volume.

### Weeks 13–16
Maintenance-only support volume while the deadlift peak dominates.

Do not rewrite the core deadlift engine.

Protect its identity from Hamstring Foundry:

- Pain & Glory = deadlift performance first.
- Hamstring Foundry = hamstring hypertrophy first.

---

# 7. Peachy

## Strengths

- multiple weekly glute exposures;
- unilateral work;
- hip extension;
- posterior-chain work;
- upper-body maintenance;
- squat progression;
- late-cycle intensity;
- glute-specific tracking.

## Claude proposals

No major rewrite.

Audit:

- direct glute/quads/hamstring sets by phase;
- whether late drop-set logic creates unnecessary volume;
- whether exercise swaps preserve the intended glute emphasis.

Keep distinct from Hamstring Foundry.

---

# 8. Pencilneck Eradication Protocol

## Correct role

Pencilneck should remain:

> **Classic bodybuilding with a predictable schedule, simple loading and minimal algorithmic interference.**

Its stability is a feature.

## Claude proposals

- Keep the fixed push/pull structure.
- Keep simple double progression.
- Do not add Super-Mutant-style recovery scheduling.
- Distinguish strongly from Purgatorio.

### Pencilneck
- stable split;
- predictable weekly structure;
- mostly double progression.

### Purgatorio
- accumulation/intensification;
- phase-specific reps;
- tempo/rest changes;
- phase-specific exercise/loading philosophy.

Also run a volume/fatigue audit because Pencilneck has high exercise density.

---

# 9. From Skeleton to Threat

## Role

Essential beginner entry plan.

## Required change

Enforce minimum useful frequency:

- **2 days/week = minimum**
- **3 days/week = recommended**
- **4 days/week = allowed**

## Claude proposals

- enforce minimum selected days in onboarding/settings;
- show 3-day recommendation copy;
- verify progression under 2/3/4-day modes;
- verify Week 12 completion with different selected-day patterns.

---

# 10. Ritual of Strength

## Why it remains distinct

- all three lifts every session;
- one heavy emphasis;
- two lighter exposures;
- recurring Ascension tests;
- e1RM updates;
- ME progression;
- velocity-response logic;
- user-selected accessories.

## Claude proposals

- preserve the core.
- centralize repeated Ascension update logic if possible;
- verify inserted deload numbering cannot break test logic;
- ensure accessory injection cannot duplicate across renders;
- preserve per-lift light-work reduction state.

Keep separate from Trinary:

- Ritual = high-frequency competition-lift practice.
- Trinary = conjugate ME/DE/RE variation.

---

# 11. Super Mutant

## Why it remains a flagship

- no normal fixed calendar;
- muscle cooldowns;
- rolling 7-day volume;
- dynamically generated workouts;
- muscle contribution accounting;
- reactive sets;
- exercise alternation;
- RIR wave;
- automatic dropping of over-volume muscles.

## Claude proposals

Protect the core.

Technical audits worth performing:

- cooldown timestamp correctness;
- rolling-volume expiration;
- secondary muscle contribution accounting;
- extra-set exclusion;
- rolling 6-session cap;
- regenerated-day draft reconciliation;
- obsolete legacy status fields.

Do not spread Super Mutant's recovery-reactive design to every new hypertrophy plan.

---

# 12. Trinary

## Strengths

- all three lifts every workout;
- ME/DE/RE rotation;
- selectable ME style;
- weak-point assessment;
- dynamic variation selection;
- alternate RE deadlift movements;
- accessory-day insertion.

## Claude proposals

- preserve weak-point logic;
- make UI clearly distinguish variation-start suggestions from actual block loading;
- keep sticking-point analysis separate from structural-balance assessment.

Trinary asks:

> Where does the competition lift fail?

Immaculate asks:

> Which structural relationship is underdeveloped?

---

# 13. 30 Minute Adventure

## Role

Not a conventional long-cycle plan.

Useful for:

- short sessions;
- flexibility;
- entry/free tier;
- low commitment;
- gamified intensity.

## Claude proposals

- verify pair-selection balance;
- ensure the "easy?" → failure mechanic uses technical-failure guardrails on risky compounds;
- optionally track repeatedly selected pairings;
- recommend underused pairings without making the plan rigid.

---

# 14. King of the Squat

## Verdict

Strong addition and necessary squat-specialization slot.

## Claude proposals

Give it a signature system distinct from Bench Domination.

Possible **Three Pillars**:

- Heavy Squat
- Volume Squat
- Structural/Front-Squat quality

Possible dashboard:

- heavy wave performance;
- volume performance;
- secondary squat progress;
- projected squat strength.

Do not copy the Bench AMRAP engine.

---

# 15. Gravity Is Optional

## Verdict

Strong, low-overlap addition.

## Claude proposals

Add a **Total System Weight / Gravity Rating** system for weighted pull-ups/dips:

```text
bodyweight + external load
```

Track:

- total-system-weight PR;
- reps at system weight;
- relative-strength progression.

Preserve distinctive lower-body work such as:

- Sissy Squat;
- Goblet Skater Squat;
- Goblet Heel-Elevated Squat;
- Hip-Supported DB Deadlift.

---

# 16. Immaculate (Re)Structure

## Verdict

Potential flagship if the assessment actually changes programming.

## Claude proposals

Implement:

1. structural assessment;
2. normalized result storage;
3. weak-link ranking;
4. exercise/emphasis injection;
5. reassessment;
6. before/after structural profile.

Also audit non-priority frequency:

- chest should not fall to 1× if the plan is partly hypertrophy;
- triceps should not fall to 1×;
- other major muscle groups should retain sensible maintenance frequency.

Keep separate from Apex Predator:

- Apex = beginner movement access/mobility.
- Immaculate = advanced structural strength relationships.

---

# 17. Purgatorio

## Main risk

Becoming "Pencilneck with different artwork."

## Required identity

### Accumulation
- more volume;
- higher reps;
- shorter rest;
- slower/controlled tempo;
- more fatigue accumulation.

### Intensification
- heavier loading;
- lower reps;
- longer rest;
- changed exercise emphasis;
- more strength-oriented execution.

## Claude proposals

- explicit phase state;
- phase-specific exercise targets;
- phase-specific tempos/rest;
- visible transition UI;
- block dashboard;
- progression rules that materially change by phase.

If the user barely notices the phase transition, redesign it.

---

# 18. Overhead Dominion

## Verdict

Good shoulder-specialization concept.

## Required audit

Verify:

- chest ≥2 meaningful weekly exposures;
- biceps ≥2;
- triceps ≥2;
- back ≥2;
- lower body maintains appropriate frequency.

Maintenance volume can be very small.

Potential fix:

- add 2 sets Hammer Chest Press or DB Bench on a second day;
- add small direct arm exposures where needed.

---

# 19. Hamstring Foundry

## Required identity

### FIRE I — Hip Extension
Heavy hinge.

### FIRE II — Knee Flexion
Curl/Nordic/GHR.

### FIRE III — Lengthened Controlled Hinge
Supported hinge / long-length loading.

## Claude proposals

- keep systemic fatigue below Pain & Glory;
- ensure knee-flexion work is prominent;
- use Hip-Supported DB Deadlift where appropriate;
- when dumbbell load caps out, progress using:
  - reps;
  - eccentric;
  - pauses;
  - ROM;
  - 1.5 reps.

Potential dashboard:

**Three Fires balance**

---

# 20. Arms Race

## Verdict

Strong, commercially clear specialization plan.

## Claude proposals

Make the four arm exposures different:

1. heavy;
2. brachialis/forearm;
3. lengthened;
4. density/pump.

Audit maintenance frequency:

- chest ~2×;
- back ~2×;
- delts ~2×;
- legs ~2×.

Possible app mechanic:

- arm performance profile;
- curl/extension progression;
- optional arm measurement.

---

# 21. Workhorse

## Verdict

Strong weighted-chin/back specialization.

## Required distinction

Do not reuse Bench Domination's pull-up progression.

Workhorse should center on:

- total system weight;
- accumulated quality reps;
- pulling volume;
- multiple pulling qualities;
- upper-back development.

## Claude proposals

Potential **Pulling Strength Index** using:

- bodyweight;
- external chin load;
- reps;
- standardized row marker.

Also add/verify a second small direct triceps exposure.

---

# 22. Neural Overload

## Main risk

Becoming generic powerlifting.

## Required identity

The **1–6 method must remain the product**.

The user should clearly experience:

```text
heavy neural set
→ 6-rep set
→ heavier neural set
→ 6-rep set
```

## Claude proposals

Avoid:

- ME/DE/RE;
- large weak-point systems;
- multiple max-test frameworks;
- generic percentages that hide the 1–6 pattern.

Potential app mechanic:

**1–6 Session Engine**

Track:

- heavy-set progression;
- 6-rep performance;
- relationship between heavy and 6-rep work.

---

# 23. Tenfold

## Verdict

Keep as a simple method plan.

## Claude proposals

Useful app features:

- 10-set completion meter;
- rep-drop chart;
- strict rest timer;
- total tonnage;
- repeat/increase-load recommendation.

Do not overengineer it.

---

# 24. Cross-portfolio reactivity tiers

Not every plan should have the same complexity.

## Static
Fixed well-designed structure.

Example:
- Tenfold.

## Progression-Reactive
Schedule fixed, loading changes.

Example:
- Pencilneck.

## Phase-Reactive
Program changes by block.

Example:
- Purgatorio.

## Performance-Reactive
Tests update future prescriptions.

Example:
- Bench Domination.

## Assessment-Reactive
Assessment changes exercise emphasis.

Example:
- Immaculate / Apex Predator.

## Recovery-Reactive
Workout changes from recent recovery/volume.

Example:
- Super Mutant.

This hierarchy should be deliberate.

---

# 25. Shared progression infrastructure Claude should consider

Potential reusable primitives:

- double progression;
- top set + back-off;
- AMRAP → e1RM;
- RPE/RIR adjustment;
- wave loading;
- total-rep progression;
- density progression;
- tempo progression;
- total-system-weight progression;
- fixed-load progression;
- calibration set;
- performance-retention comparison.

Reuse infrastructure without homogenizing the user-facing plans.

---

# 26. Shared exercise metadata Claude should consider

Potential exercise fields:

```text
movementFamily
primaryMuscles
secondaryMuscles
equipment
stabilityDemand
systemicFatigue
jointStressTags
lengthenedBias
shortenedBias
unilateral
systemicCompound
homeCompatible
progressionType
```

This would improve:

- exercise swaps;
- fatigue audits;
- Apex/Immaculate mapping;
- Kali's systemic-compound rule;
- REDLINE density compatibility;
- House of Iron filtering.

---

# 27. Hypertrophy-frequency QA rule

## General hypertrophy
Major muscles normally:

**≥2 meaningful weekly exposures**

## Large-muscle specialization
Usually:

**~3 exposures/week**

## Small-muscle specialization
Usually:

**3–4 exposures/week**

Do not blindly treat all secondary compound work as direct work.

Internally distinguish:

- direct;
- secondary;
- maintenance.

---

# 28. Volume audit

For each plan and major phase, calculate:

- direct sets/muscle/week;
- secondary sets;
- meaningful exposure count;
- highest-volume week;
- deload volume;
- specialization volume;
- maintenance volume.

Highest-priority plans to audit:

- Pencilneck
- Super Mutant
- Overhead Dominion
- Arms Race
- Hamstring Foundry
- Purgatorio
- Venus Rising
- REDLINE
- Kali

The purpose is to catch obvious mistakes, not enforce one universal set target.

---

# 29. Fatigue audit

Track at least:

## Axial loading
- squat;
- deadlift;
- good morning;
- unsupported row.

## Lower-back stress
- hinges;
- deadlifts;
- bent rows;
- squat combinations.

## Elbow stress
- weighted chins;
- heavy curls;
- heavy extensions;
- high pressing frequency.

## Shoulder stress
- dips;
- frequent pressing;
- BTN work;
- excessive fly volume.

## Knee stress
- hack squat;
- sissy squat;
- extensions;
- high lunge volume.

A program can have reasonable muscle volume but poor fatigue distribution.

---

# 30. Exercise-swap rules

A good swap should preserve more than muscle name.

Prefer to preserve:

- movement pattern;
- role in program;
- stability demand;
- fatigue cost;
- rep range;
- lengthened/shortened emphasis;
- unilateral/bilateral status;
- progression compatibility.

Example:

**Chest-Supported Row → Hammer Row**
Good.

**Chest-Supported Row → Pendlay Row**
Potentially poor if the original role was to reduce systemic fatigue.

---

# 31. Plan QA checklist for Claude

## Training

- [ ] Main goal is unambiguous
- [ ] Target audience is clear
- [ ] Major-muscle frequency is appropriate
- [ ] Specialization frequency is appropriate
- [ ] Weekly volume is plausible
- [ ] Exercise order makes sense
- [ ] Fatigue distribution is reasonable
- [ ] Progression is clear
- [ ] Stalling/failure behavior is defined
- [ ] Deload/taper logic exists where needed

## App

- [ ] Extra sets do not corrupt progression
- [ ] Exercise swaps preserve progression
- [ ] Inserted weeks do not corrupt phase numbering
- [ ] Re-running resets only appropriate state
- [ ] History lookup is cycle-aware
- [ ] Translation markers resolve correctly
- [ ] Missing history does not crash calculations
- [ ] Dashboard reads correct logs
- [ ] Badge logic cannot trigger from invalid/partial work
- [ ] Legacy status formats remain compatible where required

## UX

- [ ] Frequency visible before start
- [ ] Session-duration estimate visible
- [ ] Equipment requirements visible
- [ ] Difficulty explained
- [ ] Progression explained simply
- [ ] "Not for you if..." guidance exists
- [ ] End-of-program next step exists

---

# 32. Suggested user-facing catalogue structure

## START HERE
- From Skeleton to Threat
- Apex Predator
- House of Iron
- 30 Minute Adventure

## BUILD MUSCLE
- Pencilneck Eradication
- Purgatorio
- Super Mutant
- Tenfold
- Venus Rising

## SPECIALIZE
- Peachy
- Arms Race
- Overhead Dominion
- Hamstring Foundry
- Workhorse

## GET STRONG
- Bench Domination
- King of the Squat
- Pain & Glory
- Ritual of Strength
- Trinary
- Neural Overload
- Athena
- Valkyrie

## CUTTING
- REDLINE
- Kali

## OTHER METHODS
- Gravity Is Optional
- Immaculate (Re)Structure

---

# 33. Program recommendation layer

With the catalogue becoming large, Claude should consider a recommendation system based on:

1. primary goal;
2. experience;
3. training days/week;
4. gym/home/minimal equipment;
5. body part/lift specialization;
6. fixed vs adaptive schedule;
7. strength vs hypertrophy bias;
8. current cutting phase;
9. fatigue tolerance;
10. interest in mobility/structural assessment.

Return:

- best match;
- alternative;
- short explanation.

---

# 34. Plan-to-plan transitions

Examples:

## From Skeleton to Threat
Next:
- Venus Rising;
- Pencilneck;
- Gravity Is Optional;
- Apex Predator if movement-quality focus is desired.

## Apex Predator
Next:
- Immaculate (Re)Structure;
- Venus;
- Athena.

## Venus Rising
Next:
- Athena;
- Valkyrie;
- Kali;
- Peachy.

## Athena
Next:
- Kali;
- Valkyrie;
- Ritual/Trinary depending goal.

## Bench Domination
Next:
- Purgatorio;
- Ritual;
- hypertrophy/resensitization block.

## Pain & Glory
Avoid immediately recommending another maximal hinge-heavy cycle.

## Tenfold
Potentially:
- Purgatorio;
- Neural Overload.

---

# 35. Highest-priority changes

1. Fix Skeleton minimum-frequency edge case.
2. Audit Overhead Dominion chest/arm maintenance frequency.
3. Add/verify second triceps exposure in Workhorse.
4. Audit Immaculate non-priority muscle frequency.
5. Keep Hamstring Foundry distinct from Pain & Glory.
6. Keep Neural Overload centered on 1–6.
7. Make Purgatorio phase changes mechanically obvious.
8. Upgrade new plans with signature app mechanics.
9. Standardize shared progression primitives.
10. Standardize exercise metadata.
11. Add volume/fatigue QA tooling.
12. Update renamed-plan references everywhere.
13. Add catalogue categories/filtering.
14. Begin plan-transition recommendations.
15. Avoid adding more programs unless a genuine portfolio gap appears.

---

# 36. Final design principle

The portfolio should remain deliberately diverse.

A user should be able to experience:

- straightforward bodybuilding;
- reactive bodybuilding;
- lift specialization;
- conjugate powerlifting;
- high-frequency powerlifting;
- weighted calisthenics;
- structural assessment;
- beginner movement assessment;
- minimal-equipment home training;
- cutting;
- high-volume methods;

without feeling like each program is the same template wearing different artwork.

The standard should be:

> **Every plan needs a clear training problem, a distinctive programming solution, and at least one reason that solution benefits from being implemented inside HyperPlanner.**

The old flagship plans already meet that standard.

The current priority is bringing the newer plans to the same level without homogenizing them.
