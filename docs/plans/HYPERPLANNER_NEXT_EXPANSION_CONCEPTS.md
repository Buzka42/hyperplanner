# HyperPlanner — Next Expansion Concepts
## Selected New Plans + High-Tech Concepts

**Status:** Concept exploration before detailed programming / Claude implementation specs  
**Scope:** 12 selected concepts  
**Design rule:** every plan must solve a distinct training problem and have at least one reason to exist inside HyperPlanner rather than as a static spreadsheet.

## Selected concepts

### Conventional / Method Plans
1. **BLACKOUT** — ultra-low-volume high-intensity hypertrophy
2. **QUADFATHER** — quad specialization
3. **MONOLITH** — machine-dominant high-effort bodybuilding
4. **LAZARUS** — return-to-training / muscle-memory rebuild
5. **ATLAS** — brute strength with efficient loaded movement
6. **THE MINIMUM** — serious 2-day/week hypertrophy
7. **CATHEDRAL** — chest hypertrophy specialization
8. **IRON CLOCK** — density-progression hypertrophy

### High-Tech Plans
9. **ORACLE** — predictive performance autoregulation
10. **GHOST IN THE MACHINE** — camera-based rep-quality / fatigue analysis
11. **PROJECT CHIMERA** — block mutation based on emerging athlete profile
12. **EVENT HORIZON** — personalized stimulus-to-fatigue budgeting

Not selected:
- ARMOR
- ENGINE ROOM
- TERMINAL VELOCITY

---

# Portfolio principle

Do not create these as twelve variations of:

> pick exercises → add sets → increase weight.

A useful test is:

> **If this plan were exported to paper, what important behavior would be lost?**

For straightforward plans such as QUADFATHER or CATHEDRAL, that may be:
- specialization dashboard;
- intelligent swaps;
- phase progression;
- performance tracking.

For ORACLE or EVENT HORIZON, the lost behavior should be substantial:
- prediction;
- personalization;
- automatic load adjustment;
- exercise substitution;
- learned recovery/fatigue behavior.


# BLACKOUT

## Core identity

> **Minimal volume. Maximum commitment.**

A genuine low-volume, high-intensity hypertrophy plan.

Suggested direction:
- 3 days/week;
- full body;
- about 7–10 true work sets/session;
- 35–50 minutes;
- 8–10 weeks;
- major muscles still trained multiple times per week.

The plan should reduce **sets**, not frequency.

## Programming style

Stable compounds:
- 1 top set;
- optionally 1 back-off.

Stable machine/isolation work:
- usually 1 hard set;
- selected movements can use rest-pause.

Effort:
- mostly 0–2 RIR depending on exercise safety.

Failure can be used selectively on:
- machine press;
- pulldown;
- leg extension;
- leg curl;
- lateral raise;
- curls/extensions.

Avoid uncontrolled failure on:
- free squat;
- heavy hinge;
- unstable unilateral work.

## Interesting lead — Recovery earns the next exposure

BLACKOUT should not automatically add volume when progress slows.

Possible logic:

```text
Performance progressing?
YES → maintain dose.

Performance stable and recovered?
YES → maintain dose.

Performance declining?
Check recovery before adding work.
```

The philosophical default is:
> **less unnecessary work, not more.**

## Signature mechanic — FAILURE QUALITY

Track:
- load;
- initial reps;
- RIR;
- rest-pause reps;
- rep drop;
- next-exposure recovery.

Potential dashboard:

```text
BLACKOUT RESPONSE

Chest Press
Dose:             1 + RP
Last performance: +2 reps
Recovery:         COMPLETE

Leg Curl
Dose:             1 + RP
Last performance: -3 reps
Recovery:         INCOMPLETE
```

## Interesting lead — Observed minimum productive dose

After enough sessions, HyperPlanner could estimate the **lowest observed productive dose in this cycle** for a muscle/exercise family.

Do not present this as a precise biological MEV calculation.

## Main risk

BLACKOUT becoming random failure training.

Prevent that with:
- stable exercise selection;
- safety classification;
- strict execution;
- recovery tracking.


# QUADFATHER

## Core identity

> **Grow the quads. The squat number is secondary.**

Distinct from King of the Squat:

- King = squat performance.
- QUADFATHER = quad hypertrophy.

Suggested:
- 10–12 weeks;
- 4 days/week;
- quads 3 meaningful exposures/week;
- other major muscles at least 2× maintenance/growth exposure;
- 45–60 min sessions.

## Three quad roles

### LOAD
- standing Hack Squat;
- Smith heel-elevated squat.

### UNILATERAL / DEPTH
- FFE Bulgarian split squat;
- Goblet Skater Squat.

### KNEE EXTENSION / BURN
- Leg Extension;
- Sissy Squat.

Prefer around 12–16 direct/effectively-primary quad sets rather than automatically chasing huge volume.

## Interesting lead — Quad Bias metadata

Possible internal fields:

```text
quadBias
gluteBias
axialCost
kneeStress
stability
```

The app can prevent a supposed quad week from accidentally becoming glute/axial dominant.

## Signature mechanic — THREE FAMILIES

```text
QUADFATHER

LOAD        ████████
DEPTH       ██████
EXTENSION   ███████
```

## Interesting lead — ROM progression

For split squats, Sissy Squats and heel-elevated work, progression may include:
- deeper ROM;
- more knee travel;
- less support;
- longer lengthened pauses.

## Main risk

Knee-stress accumulation. Future QA should audit:
- extension volume;
- Sissy Squat volume;
- deep-knee-flexion volume;
- hard lower-body sessions in sequence.


# MONOLITH

## Core identity

> **Maximum local effort. Minimum unnecessary instability.**

Machine-dominant bodybuilding for users who want:
- stable setup;
- low skill cost;
- repeatable loading;
- high local muscular effort;
- less systemic fatigue than free-weight-dominant bodybuilding.

Suggested:
- 4 days/week;
- Upper/Lower or Push/Pull;
- 10–12 weeks;
- 12–16 sets/session.

Prioritize:
- Hack Squat;
- Leg Extension;
- Leg Curl;
- Hammer Chest Press;
- Hammer Row;
- useful Matrix machines;
- Pulldown;
- Pec Deck;
- Rear-Delt Machine;
- cables.

Free weights appear only where clearly useful.

## Signature mechanic — STABILITY PREMIUM

Classify exercises:

```text
HIGH STABILITY    → can be taken closer to failure
MEDIUM STABILITY  → normal RIR rules
LOW STABILITY     → preserve technical reserve
```

## Interesting lead — Local vs systemic fatigue

MONOLITH can introduce a simple internal distinction:

```text
LOCAL FATIGUE
vs
SYSTEMIC COST
```

The aim:
> high target-muscle effort with low unnecessary non-target fatigue.

## Interesting lead — Machine identity

Machine loads vary across gyms. Performance history should ideally be tied to:
- exercise;
- machine/equipment identity where possible.

Do not assume 80 kg on one machine equals 80 kg on another.

## Main risk

Boredom. Solve with:
- clear progression;
- controlled high effort;
- machine-specific PRs;
- phase-based rep changes;
not random exercise rotation.


# LAZARUS

## Core identity

> **You trained before. Your body remembers. Your numbers do not.**

Return-to-training plan for previously trained users after a significant layoff.

The user is not a beginner, but old PRs are not safe current prescriptions.

## Suggested duration

**8 weeks**

### Weeks 1–2 — AWAKEN
- conservative;
- technique re-entry;
- low/moderate soreness exposure;
- ~3 RIR.

### Weeks 3–4 — REMEMBER
- rapid load/repetition progression;
- ~2 RIR;
- modest volume rise.

### Weeks 5–6 — RESTORE
- near-normal intermediate structure;
- 1–2 RIR.

### Weeks 7–8 — RETURN
- establish current working baselines;
- selected rep PRs;
- recommend next plan.

## Signature mechanic — MEMORY CURVE

```text
HISTORICAL BEST
      ↓
RETURN BASELINE
      ↓
CURRENT RECOVERY
```

Example:

```text
BENCH

Historical best     100%
Week 1 return        71%
Week 4               86%
Week 8               95%
```

## Interesting lead — Time-decayed starting estimate

Use:
- time since last meaningful training;
- exercise familiarity;
- historical load/reps;
- first-session RIR.

Historical estimates should stay low-confidence until calibrated.

## Interesting lead — Fast recalibration

Reuse calibration logic:

1. historical estimate;
2. first set;
3. user reports RIR;
4. app adjusts quickly.

## Interesting lead — Tissue-tolerance guardrail

Returning athletes may recover strength faster than tolerance to old training volume.

Early-cycle set caps should prevent:
> "I still feel strong, so I did my old volume."

## Main risk

Progressing too slowly. Once actual performance confirms readiness, LAZARUS should accelerate quickly.


# ATLAS

## Core identity

> **Brute strength with minimal wasted movement.**

Carries are useful but should not dominate.

Available carry equipment:
- dumbbells up to 50 kg each;
- trap bar suitable for carries.

Use carries as **one performance quality**, not the identity of every session.

## Goal

Develop:
- general strength;
- upper back;
- grip;
- trunk;
- loaded movement;
- unilateral leg strength.

Not powerlifting, not strongman, not bodybuilding specialization.

Suggested:
- 3 days/week;
- 45–55 minutes;
- 8–10 weeks;
- full-body strength.

## Possible roles

### DAY I — LIFT
Heavy squat/hinge + upper pull.

### DAY II — PRESS
Pressing + unilateral lower + row.

### DAY III — LOAD
Moderate full-body work + one carry emphasis.

Carries can also appear as brief finishers once or twice per week.

## Efficient carry use

Examples:
- Trap-Bar Carry: 2–3 short heavy sets;
- DB Farmer Carry: 2 sets;
- Suitcase Carry: 1–2 sets/side.

No need for a strongman-volume approach.

## Signature mechanic — LOAD CAPACITY

Track:

```text
LIFT
PULL
PRESS
CARRY
```

## Interesting lead — Limiting-factor tagging

After a carry, user may mark:
- grip;
- breathing;
- trunk;
- legs.

This can slightly alter assistance emphasis.

## Main risk

Overlap with generic strength plans.

Keep ATLAS centered on simple force production, upper-back/trunk development and occasional efficient carries.


# THE MINIMUM

## Core identity

> **Two sessions. No wasted sets.**

A serious hypertrophy plan for users who can reliably train only twice per week.

Suggested:
- 2 mandatory full-body sessions/week;
- 45–60 minutes;
- 12–16 work sets/session;
- 8–12 weeks.

Every major muscle should receive meaningful work in both sessions.

## Signature mechanic — BONUS DAY

User taps:

**I HAVE TIME TODAY**

HyperPlanner selects/generates a short third session based on what has received the least stimulus that week.

Rules:
- 25–35 minutes;
- low systemic fatigue;
- must not disrupt next mandatory session;
- emphasizes underexposed muscles.

## Interesting lead — Mandatory vs opportunistic training

Track separately:

```text
MANDATORY WORK
BONUS WORK
```

Progression must never assume bonus sessions happened.

The base plan must fully work with two days.

## Interesting lead — Efficiency ranking

Internal exercise scoring could consider:
- muscles covered;
- setup time;
- stability;
- fatigue;
- progression ease.

## Main risk

Turning two sessions into marathons.

Hard-cap session length/volume and prioritize high-return movements.


# CATHEDRAL

## Core identity

> **Build the chest, not the bench total.**

Chest hypertrophy specialization, distinct from Bench Domination.

Suggested:
- 10–12 weeks;
- 4 days/week;
- chest 3×/week;
- other major muscles retain sensible maintenance/growth frequency.

## Three Arches

### PRESS
Stable heavy pressing.

Examples:
- Hammer Chest Press;
- DB Press;
- selected barbell press.

### STRETCH
Long-length-biased work.

Examples:
- deep DB incline press;
- cable fly;
- pec deck with controlled stretch.

### ADDUCTION
Stable shortened/adduction-focused work.

Examples:
- Pec Deck;
- cable crossover;
- machine pressing.

## Signature mechanic — THREE ARCHES

```text
CATHEDRAL

PRESS       ███████
STRETCH     ██████
ADDUCTION   ████████
```

## Interesting lead — Regional emphasis without fake precision

Allow broad biases such as:
- clavicular emphasis;
- general pec;
- adduction.

Do not claim exact regional isolation percentages.

## Interesting lead — Pressing fatigue balance

Track whether extra chest stimulus is increasingly limited by:
- triceps;
- anterior delts;
- shoulder stress.

If pressing burden gets too high, shift additional chest work toward:
- pec deck;
- cable work;
- stable machine work.

## Main risk

Three chest exposures becoming three bench variations. Do not allow it.


# IRON CLOCK

## Core identity

> **The work stays. The clock gets shorter.**

Density-based hypertrophy.

Distinct from REDLINE:

- REDLINE: density supports a cut.
- IRON CLOCK: density itself is the overload method.

Suggested:
- 4 days/week;
- 8–10 weeks;
- Upper/Lower or Push/Pull;
- fixed timed blocks.

## Example block

10 minutes, alternating:
- Hammer Row × 8;
- Machine Chest Press × 8.

Progression can be:
1. more reps;
2. more rounds;
3. same work in less time;
4. more load once density ceiling is reached.

## Signature mechanic — CLOCK ENGINE

Store:

```text
exercises
load
targetReps
rounds
elapsedTime
rir
```

The app decides the next progression.

## Interesting lead — Density ceiling

Possible logic:

```text
If target work is completed under threshold
AND RIR remains acceptable:
    increase load
    reset density target
```

This creates:
> compress time → add load → compress again.

## Interesting lead — Pairing metadata

Classify pairs:
- antagonistic;
- non-competing;
- partially competing;
- high interference.

Prefer:
- chest + back;
- quads + upper body;
- hamstrings + delts;
- arms + calves.

Avoid:
- squat + RDL;
- two grip-limited pulling movements;
- two high-systemic movements.

## Main risk

Users sacrifice ROM to beat the clock.

A completed round should count only if technique/ROM standards remain acceptable.


# ORACLE

## Core identity

> **Predict today's performance before prescribing today's load.**

Predictive autoregulation.

Distinct from Super Mutant:

- Super Mutant decides what muscles need training.
- ORACLE keeps a recognizable plan and predicts how hard today's planned work should be.

## Realistic initial inputs

- exercise history;
- load;
- reps;
- RIR/RPE;
- days since same movement;
- recent volume;
- recent failures;
- session duration;
- bodyweight if available.

Possible future optional inputs:
- resting HR;
- wearable HR;
- sleep;
- HRV;
- subjective readiness.

Wearables should never be mandatory.

## Example output

```text
TODAY'S PROPHECY

Hack Squat
Expected:
145 kg × 8 @ 2 RIR

Confidence:
HIGH
```

The first set acts as calibration.

## Signature mechanic — PREDICTION ERROR

Store:
- predicted performance;
- actual performance;
- error;
- confidence.

Dashboard:

```text
ORACLE ACCURACY
Last 20 predictions: 88%
```

## Interesting lead — Personal recovery curve

After enough data, estimate how this user tends to perform at different intervals after the same movement/muscle stress.

Frame as observed individual history, not universal recovery biology.

## Interesting lead — Response to prior stress

Explore relationships such as:
- high hinge volume → next squat;
- high pressing volume → next bench;
- failure sets → next-session performance.

Start with conservative heuristics, then evolve.

## Interesting lead — Confidence-based autonomy

### High confidence
Adjust load more assertively.

### Medium
Show a range.

### Low
Require calibration set.

## Main risk

False precision.

Never show fake statements like:
> 93.7% recovered.

Prefer predicted performance + confidence + observed accuracy.


# GHOST IN THE MACHINE

## Core identity

> **The camera watches the set deteriorate.**

Camera-assisted rep analysis.

This is the most experimental plan and should be prototyped before full implementation.

## Potential signals

With a fixed phone camera, possibly:
- rep count;
- rep duration;
- concentric duration;
- eccentric duration;
- approximate ROM consistency;
- pauses;
- rep-to-rep slowing.

Do not initially claim laboratory-grade bar velocity.

Useful signal:
> within-user change under similar camera setup.

## Possible training engine

A set may stop when:
- concentric-duration slowdown exceeds threshold;
- ROM falls below threshold;
- or fixed reps are completed and the app adjusts next set.

## Phase idea

### Weeks 1–2 — SIGNAL
Collect baseline rep signatures.

### Weeks 3–4 — CALIBRATE
Compare camera slowdown with user-reported RIR.

### Weeks 5–8 — OVERRIDE
Use that relationship for autoregulation.

### Weeks 9–12 — GHOST MODE
More individualized set termination.

## Signature mechanic — FATIGUE TRACE

```text
REP DURATION

1  ███
2  ███
3  ████
4  █████
5  ███████
```

## Interesting lead — Technique consistency

Camera ROM tracking could reward:
- consistent squat depth;
- consistent press ROM;
- stable split-squat depth;
- consistent curl/lateral raise execution.

## Interesting lead — Quality PRs

Example:
```text
100 kg × 6
same load/reps
ROM consistency +9%
less slowdown
```

## Interesting lead — Camera confidence

If:
- athlete leaves frame;
- angle is poor;
- obstruction occurs;
- detection is uncertain;

the app should not make strong programming changes.

## Main risk

Computer-vision reliability.

Prototype first on a few camera-friendly movements:
1. rep counting;
2. timing;
3. ROM consistency.

Only then build the full plan.


# PROJECT CHIMERA

## Core identity

> **The program mutates according to the athlete you are becoming.**

Starts balanced, then changes future blocks according to emerging performance.

Distinct from:
- Trinary sticking points;
- Immaculate structural ratios;
- Super Mutant recovery.

CHIMERA reacts to the athlete's **emerging performance phenotype**.

## Candidate qualities

Keep it limited:

```text
SQUAT
HINGE
PUSH
PULL
UNILATERAL
HYPERTROPHY
```

Carries can remain optional rather than a core category.

## Suggested structure

12–16 weeks in 4-week blocks.

### Block 1 — BASE FORM
Balanced.

### Block 2 — FIRST MUTATION
React to meaningful weakness/stagnation.

### Block 3 — SECOND MUTATION
Reassess and adjust again.

### Block 4 — EXPRESSION
Final phenotype-specific block.

## Mutation logic

At each checkpoint identify:
- strongest quality;
- weakest;
- fastest improving;
- most stagnant;
- highest-fatigue quality.

Then reallocate only a limited training budget.

Example:

```text
Pull improving rapidly.
Squat stagnant.
Hinge fatigue high.

Next block:
+2 squat-focused sets/week
-1 hinge set/week
maintain pull
```

Do not completely rewrite the program every block.

## Signature mechanic — MUTATION MAP

```text
PROJECT CHIMERA

SQUAT       61 ↑
HINGE       68 →
PUSH        64 ↑
PULL        76 ↑↑
UNILATERAL  55 →
```

## Interesting lead — Phenotype endings

Possible game-like classifications:
- JUGGERNAUT;
- HUNTER;
- TITAN;
- CHIMERA;
- etc.

These are entertainment labels, not physiological claims.

## Interesting lead — Anti-overcorrection

Do not attack the lowest score automatically.

Only mutate when:
- the gap is meaningful;
- data confidence is adequate;
- the quality can be improved without unreasonable recovery cost.

## Main risk

Too much variation.

Prefer mutating:
- set allocation;
- emphasis;
- assistance;
before changing primary exercises.


# EVENT HORIZON

## Core identity

> **Spend fatigue where it buys the most useful stimulus.**

A fatigue-budget / optimization plan.

The question is:

> **What is the lowest-cost way to deliver today's required stimulus?**

## Exercise cost profile

Potential metadata:

```text
primaryStimulus
secondaryStimulus
axialCost
lowerBackCost
elbowCost
shoulderCost
kneeCost
systemicCost
stability
```

Initially expert-authored, later personalized.

Example:

### RDL
- hamstrings: high;
- glutes: medium;
- lower back: high;
- systemic: high.

### Leg Curl
- hamstrings: medium/high;
- lower back: minimal;
- systemic: low.

If lower-back capacity is poor, EVENT HORIZON can preserve hamstring stimulus by changing the exercise mix.

## Dashboard

```text
RECOVERY BUDGET

SYSTEMIC       ███████░░░
LOWER BACK     ████░░░░░░
ELBOWS         ████████░░
SHOULDERS      ███████░░░
KNEES          ██████░░░░
```

This is a training-management abstraction, not a medical recovery score.

## Interesting lead — Stimulus-to-cost selection

Internally rank eligible exercises by expected target stimulus relative to current relevant fatigue cost.

Do not expose fake exact ratios initially.

## Interesting lead — Personal cost learning

Over time, adjust assumptions from:
- performance drops;
- repeated fatigue flags;
- RIR deterioration;
- session-to-session strength loss;
- user recovery input.

## Interesting lead — Required stimulus floor

The optimizer must not solve fatigue by removing training.

Every week keeps minimum targets.

EVENT HORIZON should:
> preserve the goal while finding a cheaper way to deliver it.

## Interesting lead — Red-zone swap

```text
TODAY

Lower-back budget: LOW

Planned:
Barbell RDL 3 sets

Suggested:
Hip-Supported DB Deadlift 2 sets
Leg Curl 2 sets

Target stimulus preserved
Lower-back cost reduced
```

## Main risk

Pretending fatigue is exactly measurable.

Use:
- broad cost tiers;
- confidence;
- observed individual response.


# Shared infrastructure opportunities

## PerformanceProfile

Useful for:
- LAZARUS;
- ORACLE;
- CHIMERA;
- EVENT HORIZON;
- Kali;
- Athena.

Possible fields:

```text
exerciseId
load
reps
rir
e1rm
date
movementFamily
sourceProgram
confidence
recentPerformances[]
```

## Exercise metadata

```text
movementFamily
primaryMuscles
secondaryMuscles
equipment
stabilityDemand
systemicFatigue
axialCost
lowerBackCost
elbowCost
shoulderCost
kneeCost
unilateral
systemicCompound
homeCompatible
cameraFriendly
densityCompatible
```

## Confidence system

Potential levels:
- HIGH
- MEDIUM
- LOW

Useful for:
- load transfer;
- ORACLE predictions;
- CHIMERA mutations;
- camera analysis;
- EVENT HORIZON fatigue estimates.

## Block-level performance

Useful for IRON CLOCK, REDLINE and GHOST:

```text
blockId
elapsedTime
exerciseLoads
reps
rounds
rir
qualityValid
```

## User recovery signals

Keep them small and usable:
- recovered;
- somewhat fatigued;
- performance impaired.

Avoid long readiness questionnaires.


# Product-level lead — HyperPlanner as a training operating system

These plans suggest separating:

## PLAN
The user-facing method and identity.

from

## ENGINES
Reusable intelligent components.

Examples:

```text
Progression Engine
Performance Profile
Fatigue Model
Exercise Swap Engine
Prediction Engine
Camera Quality Engine
Density Engine
Assessment Engine
```

Possible combinations:

- Bench Domination → AMRAP/e1RM + deload engine
- House of Iron → fixed-load progression + balance engine
- REDLINE → density + retention engine
- ORACLE → prediction + calibration engine
- EVENT HORIZON → fatigue + swap engine

This is more scalable than making every plan completely isolated.


# Efficiency as a first-class design metric

The selected concepts repeatedly point toward **efficiency**, not maximum complexity.

Potential internal considerations:
- useful work per session;
- setup/transition burden;
- systemic cost;
- session duration;
- number of exercises;
- effective exposure frequency.

This should strongly influence:
- THE MINIMUM;
- MONOLITH;
- BLACKOUT;
- EVENT HORIZON;
- REDLINE;
- House of Iron.

If a user only has 40 minutes, do not just shorten rest. Prefer:
- stable multi-muscle movements;
- low setup;
- compatible supersets;
- fewer redundant exercises.


# Suggested development priority

## Tier A — High value, relatively feasible
1. **THE MINIMUM**
2. **LAZARUS**
3. **QUADFATHER**
4. **CATHEDRAL**
5. **IRON CLOCK**

## Tier B — Moderate complexity
6. **BLACKOUT**
7. **MONOLITH**
8. **ATLAS**
9. **PROJECT CHIMERA**

## Tier C — Platform-level / advanced
10. **ORACLE**
11. **EVENT HORIZON**
12. **GHOST IN THE MACHINE**

Suggested order:
1. THE MINIMUM
2. LAZARUS
3. QUADFATHER
4. CATHEDRAL
5. IRON CLOCK
6. BLACKOUT
7. MONOLITH
8. ATLAS
9. PROJECT CHIMERA
10. ORACLE
11. EVENT HORIZON
12. GHOST IN THE MACHINE

Rationale:
- early plans expand the catalogue quickly;
- LAZARUS begins using history intelligently;
- IRON CLOCK builds density infrastructure;
- CHIMERA forces normalized performance categories;
- ORACLE builds on PerformanceProfile;
- EVENT HORIZON builds on exercise/fatigue metadata;
- GHOST should wait until camera analysis is proven.


# Do not lock too early

Before detailed Claude specs, avoid prematurely locking:
- exact set counts;
- exact machine swaps;
- exact fatigue-cost values;
- exact prediction formulas;
- exact camera thresholds;
- exact Chimera archetypes;
- exact ORACLE model type.

First lock:
1. training problem;
2. identity;
3. required inputs;
4. required outputs;
5. signature mechanic;
6. guardrails;
7. minimum viable version.

Then add sophistication in layers.

---

# Final direction

The selected plans solve distinct problems:

- **BLACKOUT:** how little work can still drive progress?
- **QUADFATHER:** how do we specialize quads without making it squat specialization?
- **MONOLITH:** how hard can we train locally while minimizing unnecessary instability/systemic cost?
- **LAZARUS:** how do we rapidly but sensibly restore a previously trained athlete?
- **ATLAS:** how do we build practical brute strength efficiently?
- **THE MINIMUM:** how much can we accomplish with only two reliable sessions?
- **CATHEDRAL:** how do we specialize chest rather than bench performance?
- **IRON CLOCK:** how can density itself become progressive overload?
- **ORACLE:** can HyperPlanner predict today's performance well enough to improve prescription?
- **GHOST IN THE MACHINE:** can rep behavior become an objective autoregulation signal?
- **PROJECT CHIMERA:** can the program evolve based on the athlete's emerging strengths?
- **EVENT HORIZON:** can the same training goal be achieved with less recoverability cost?

The long-term opportunity is to make these plans share intelligent infrastructure while preserving completely different user experiences.
