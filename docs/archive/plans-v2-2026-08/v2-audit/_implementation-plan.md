# Implementation plan — PROC-1

**Opened:** 2026-08-16 · **Covers:** the v2 audit packet, the three simulation rounds, and the ten batches of per-plan decisions
**Supersedes:** the suggested order in `_audit-closeout.md` §6

Everything decided across the audit and the review, sequenced so each phase
lands on ground the previous one made stable. Phases 0–3 are shared work that
touches every plan; 4–6 are per-plan and parallelisable; 7 makes the whole thing
hold.

**Scale:** 306 exercise-level edits across 33 plans · 13 new library ids · 10
card changes · 13 plan-specific engine features · 50 recorded open items.

---

## Phase 0 — Unblock the write path

**Nothing downstream can be verified until this is fixed.** Everything else in
this plan produces changes an athlete is supposed to experience, and right now
authenticated client writes fail unpredictably.

| Item | Detail |
|---|---|
| **Root-cause `permission-denied` on authenticated writes** | Eight structurally distinct failing call sites across five plans (T-54, T-57/58, T-64, T-70, T-75, T-79). Never explained by a rules-clause trace; never fails on an admin-privileged write of the identical payload. That signature isolates it to the authenticated client write path, not data shape. |
| **Start from Apex Predator** | T-54 is the cleanest, earliest isolation — a single assessment-save write with a small payload. Both the Wave 6 roadmap and the synthesis report independently name it as the starting case. |
| **Escalation case: Immaculate** | T-70 blocked *login* — the test document had no `ownerUid` and the client-side self-claim write that exists for exactly that case also failed. Whatever the root cause is, it reaches auth bootstrap. |

**Definition of done:** a real authenticated athlete can complete a session on
Apex Predator, Super Mutant, Neural Overload, Immaculate, Oracle and Project
Chimera with every write landing — session log, `completedSessions`, and the
plan-local status object.

**Note:** `firestore.rules` already carries six uncommitted lines. Confirm
whether that is a partial fix in flight before starting.

---

## Phase 1 — Shared integrity

One fix each, many plans resolved. Highest leverage per line changed in the
whole plan.

### 1.1 Dashboard week routing (T-1 / T-9)

`Dashboard.tsx`'s `dashboardViewWeek-${user.id}` localStorage key carries no
`programId`, so switching plans inherits the week last viewed on a *different*
plan. **The highest confirmed-instance-count bug in the audit** — reproduced on
the clear majority of plans from Wave 2 onward.

Immunity tracks with *what state a block reads*, not whether it has its own
component: Athena, Venus, Kali, House of Iron, Adventure, Apex and Super Mutant
are immune because they read plan-local progress directly. Add `programId` to
the key and every confirmed instance resolves at once.

### 1.2 `resetProgram()` allowlist (T-2 / T-28)

The hardcoded nulling list in `UserContext.tsx` covers three plans
(`benchDominationStatus`, `pencilneckStatus`, `skeletonStatus`) and was never
updated as new plans shipped their own status object. Missing on every Wave 4
and Wave 6 plan with one.

**Derive the allowlist from `PLAN_REGISTRY`** rather than hardcoding. Also
extend it to `planPreferences` (T-28), which reset never touches for any plan —
this matters on Venus, Kali and Atlas, where preferences drive mode and exercise
selection.

Severity varies: consequence-free where the status field is itself dead, real
where the mechanic is wired (Athena's `exerciseLoads`, Kali's status, House of
Iron's substituted-variation state, Atlas's carry-limiter tag). **Land it
alongside each plan's write-path repair** — fixing the allowlist alone does not
help a status object nothing populates.

### 1.3 `totalSystemWeightKg` gate (T-23)

Blocks bodyweight-plus-load progression from recording. Workhorse (chin is the
job, WH-RB-I), Gravity Is Optional (GIO-RB-I, the plan's entire premise is
counting system weight) and Kali (KALI-RB-I, if Hunt is a weighted pull-up) all
depend on it.

### 1.4 `liftHistory` write (T-22)

Feeds the `strength_chart` widget. Plans that request the widget render an empty
chart without it.

### 1.5 Muscle-group double-counting in `volumeAnalysis.ts` ⚠️

**`src/lib/volumeAnalysis.ts:102-108` credits a 3-set row with six sets of
back.** `back` aggregates lats + upperBack + traps + lowerBack and a row lists
two of them as primary, so the loop adds the set count once per matching muscle.
Quads and hamstrings are single-muscle groups and never inflate, which makes
every multi-muscle group look dominant.

This is the code `verify:volume` uses to gate new plans, so every specialisation
judgement it has ever made about back, shoulders, glutes, biceps, calves or core
is inflated. Fixed already in `scripts/portfolio-metrics.ts` — port the same
change: collect the distinct groups an exercise hits, then add the set count once
per group.

**Re-baseline `verify:volume` after this lands.** Expect several plans to change
verdict; two did in the analysis (Hamstring Foundry and Workhorse went from
failing their specialisation to holding it).

---

## Phase 2 — Library

Blocks Phase 4 — several decisions cannot be expressed without these ids.

### 2.1 Thirteen new ids

**From the variety assignment** (defined with full metadata in
`scripts/v2-round2-map.ts` → `PROPOSED_EXERCISES`, ready to lift):

`seated-hammer-shoulder-press` · `single-arm-landmine-press` · `machine-curl` ·
`behind-the-back-cable-lateral-raise` ·
`bench-supported-single-arm-cable-pulldown` · `wide-grip-cable-row` ·
`bench-supported-dumbbell-rear-delt-fly`

**From the audit votes** (`_audit-closeout.md` §4):

`machine-crunch` · side hanging knee raise · feet-elevated push-up (REDLINE's
deficit-PU progression) · dedicated chest-supported cable row · SL glute leg
press (Ritual; closest existing is `high-foot-leg-press`)

Each needs Polish names — `verify:library` checks 232/232 coverage.

### 2.2 Make the Tricep Giant Set resolvable ⚠️

`"Tricep Giant Set"` in `src/data/program.ts` is a display name with a
`giantSetConfig`, not a library id. It resolves to nothing, so **its triceps work
is invisible to every volume check in the app** — one of two reasons Bench
Domination measures zero triceps volume.

Arms Race now uses the same giant set (batch 7). Build it once as a shared
component and reference it from both plans.

### 2.3 Merges and aliases

- `hip-supported-db-deadlift` **=** `supported-stiff-legged-dumbbell-deadlift` —
  same movement, name mismatch (SKEL-V-ham, KOS-V-hinge). Merge ids, fold the
  loser's name into `aliases`, never delete it: logs join on exercise name in
  ~10 places. Fix the tempo to a 3–4s eccentric.
- Note in tips: `hammer-upper-row` is a **vertical** pull, not a row.
- Pick one dip family (`dip` / `bodyweight-dip` / `weighted-dip`) and progress it.

### 2.4 Attribution fixes

- ✅ **`reverse-nordic-curl` — done.** Was `knee-flexion` / hamstrings; it is knee
  *extension* under a lengthened quad. Now `knee-extension` / quads. Corrects the
  measured quad dose on Quadfather, Lazarus and Bench Domination.
- `stripper-squat` carries `shortenedBias: 3` while being a lengthened-position
  quad movement. Review.
- Remaining `docs/analysis/exercise-attribution-map.md` §25 bugs and duplicate
  merges.

---

## Phase 3 — Catalogue rules

Apply once, everywhere, before per-plan work — otherwise Phase 4 re-litigates
them plan by plan.

| Rule | What it says |
|---|---|
| **XR-calf** | Standing DB/KB calf → hack-calf when strong. **Never seated.** No other calf movement anywhere. Only volume differs by plan. |
| **XR-front** | Any front-squat slot is a picker: `front-squat` / `safety-bar-squat` / `stiletto-squat`. Neural Overload's D4 widens this to include `hack-squat` and `stripper-squat`. |
| **XR-mix tri** | Even split between overhead and pressdown/skull families. |
| **XR-mix pec** | Upper bias, lower as variation. Does **not** apply to Bench Domination, Immaculate or P&G accessories. |
| **XR-mix ham** | Even short (seated curl) / long (lying, Nordic, GHR, hinge). |
| **XR-H/V** | Every plan needs a true horizontal **and** a true vertical pull. |
| **XR-core** | Cable crunch is the flexion mainstay; wheel allowed. |
| **Set-shape floor** | Every working slot gets ≥ 2 sets. |
| **Set-shape cap** | Accessory isolation slots capped at 3 unless the plan specialises in that muscle. |

Exemptions for both set-shape rules are per plan *and* per movement, each naming
the mechanic it protects — see `scripts/review-flags.ts`.

---

## Phase 4 — Plan content

306 edits across 33 plans, all encoded and machine-readable:

| Round | File | Edits |
|---|---|--:|
| 1 — audit votes | `scripts/v2-change-map.ts` | 98 |
| 2 — variety + set shape | `scripts/v2-round2-map.ts` | 127 |
| 3 — owner decisions | `scripts/v3-owner-decisions.ts` | 81 |

Every edit carries a `why` citing its vote id or the reasoning that produced it.
Work in tranches, largest structural change first.

### 4.1 The three rebuilds

| Plan | Change |
|---|---|
| **Monolith** | 4-day → 3-day Upper / Lower / Full, machines-only house (MON-RB-F2 + the MON-V table). 79 → 64 sets, systemic 103 → 68, axial 28 → 8. Broke the catalogue's worst clone pair (0.88 with Event Horizon). |
| **Purgatorio** | Voted pair map (PUR-V-map) — upper compound+isolation, lower never two machines. 91 → 79 sets, axial 52 → 30. |
| **Arms Race** | Three-session rotation run every other day, plus an optional fourth "Go Nuclear" day built on two giant sets. Set spread now 2×12 / 3×11 / 4×6. |

### 4.2 Everything else

The remaining 30 plans are swap-and-set-count lists. Highest-volume first:
REDLINE (26 edits), Venus Rising (19), King of the Squat (16), Oracle (15), Kali
(14), Lazarus (14), Blackout (14), Event Horizon (14), Cathedral (13).

**Zero content edits:** Skeleton (SKEL-V-pec — do not complicate), Trinary
(accessories generate outside the template), Iron Clock (hidden).

### 4.3 Superset labels

Pair labels (`A1`/`A2`) that the console alternates on —
`src/features/workout/superset.ts` already implements this and Purgatorio already
uses it.

- **REDLINE:** 15 pairs across 4 days, recorded in the decision record. Anchors
  stay straight sets; swings and carries stay unpaired timed blocks. This is what
  buys back the session time the set floor cost (65 → 82 sets).
- **Purgatorio:** the voted pair map is the plan's identity — confirm the labels
  match the table.

---

## Phase 5 — Cards and registry

Ten card changes plus three corrections the review surfaced.

| Plan | Field | Change |
|---|---|---|
| Pencilneck | experience | beginner + intermediate → **intermediate** |
| House of Iron | fatigue | 2 → **3** |
| House of Iron | prerequisite | add: *"and the ability to hold a solid position under load — every movement here is unilateral or unsupported, with no machine to fall back on"* |
| Blackout | fatigue | 3 → **2** |
| Blackout | experience | advanced → **intermediate** |
| Venus Rising | goal | hypertrophy + specialisation → **hypertrophy + general** |
| Venus Rising | copy | reframe as a first structured plan, lower-body led |
| Arms Race | copy | four-day fixed split → **three-session rotation, optional fourth** |
| Neural Overload | copy | D4 anchor is a **picker**: front / hack / stripper / safety-bar |
| Iron Clock | catalogue | **hide from onboarding**, leave `PLAN_REGISTRY` intact so nobody mid-plan is stranded |

**Plus three corrections:**

1. **Bench Domination declares frequency 4 and runs six days.** ⚠️ *Open
   decision* — either correct the card to 6, or make the default template 4 via
   BD-E1's module toggles.
2. **Ritual of Strength declares 5/6 and runs 3.** RIT-RB-F voted 3-day default
   with the fourth marketed as an add-on. Card should read **3/4**.
3. **Pain & Glory sells a specialisation `PLAN_RULES` does not declare**, so
   `verify:volume` cannot test it. Declare the group.

**Still unresolved fatigue ratings:** Pencilneck declares 2 / measures 4;
Cathedral declares 3 / measures 1; REDLINE declares 3 / measures 4 (the batch-8
additions flipped it). Several more sit one band out.

---

## Phase 6 — Plan engine work

Each plan's headline mechanic. Grouped by shared machinery so common parts are
built once.

### 6.1 Schedulers

- **Free-attendance rotation** (EH-RB-F / OR-RB-F): no fixed weekdays, rotate the
  day deck as sessions complete, up to 6 in a row. **Event Horizon, Oracle.**
- **Same scheduler, 3-card deck, every-other-day** — **Arms Race**.
- **Same scheduler, capped at 4 sessions per 7 days** (CH-RB-F) — **Chimera**.
- **Dynamic cooldown** (SM-RB-F): 48h upper / 72h lower, cap 6 per 7 days —
  **Super Mutant**.

### 6.2 Pickers and menus

- **KOS-X9** — three distinct bench jobs, each a menu: technique (long-pause +
  CAT), hypertrophy (wide / DB / heavy dips), heavy (paused max + Spoto / pin /
  board / floor).
- **Neural Overload D4** — front / hack / stripper / safety-bar squat.
- Squat, core, hamstring and triceps pickers across ~15 plans (the `pickers`
  entries in the round-1 change map).

### 6.3 Techniques and prompts

- **Blackout** (BLK-RB-I / BLK-RB-X) — earned back-offs plus a mandatory
  stop-reason and quality prompt. **Until this ships nothing enforces that the
  single set is all-out, and no set-count change substitutes for it.**
- **Arms Race Go Nuclear** — athlete-initiated, with a required acknowledgement
  to take one or two full days off before the next session.
- **Arms Race biceps giant set** — one extended myo-rep set of the 30° incline-
  lying DB curl, 30–40 reps, finished with 3–4 cheat eccentrics. Load suggested
  as a percentage of the same lift's logged weight on the Lengthened day.
- **Cathedral** — the second set of each cable fly takes a finishing technique in
  later phases only (CAT-RB-T).
- **Kali** — rest-pause and myo-reps confined to Unleashed (KALI-RB-X); the four
  new pushable slots are their natural home.

### 6.4 Dead features to wire or delete

The audit's largest single defect category. Each is a declared mechanic that
never runs:

Memory Curve (**Lazarus**) · adaptive reallocation (**Chimera**) · scoring bands
and the ±7.5% AI nudge (**Oracle**) · region report and confirmable swaps
(**Event Horizon**) · assessment save (**Apex**) · recovery check (**REDLINE**) ·
density ladder (**Iron Clock**, only if it returns) · ROM confirm and knee
feedback (**Quadfather**) · split-delt dashboard (**Overhead Dominion**) ·
day-of-week fix so all six ratios fire + preacher `strengthRef` (**Immaculate**)
· priorities that actually change the 4-day (**Venus**) · total-rep progression
(**Gravity**) · time × load score and limiter advice (**Atlas**) · ladder stepper
(**House of Iron**) · Super Mutant's two writes.

### 6.5 Plan-specific fixes

- **Bench Domination:** Weighted Pull-ups prescribes **0 sets** at two of three
  definition sites (BD-E12 / BD-1 votes fix-the-bug-only). Combined with §2.2,
  this is why the plan measures zero back, biceps *and* triceps volume.
- **Pain & Glory:** PG-11's optional fifth day for the lowest-volume body parts —
  voted, unbuilt, and it fixes exactly the groups the plan under-doses.
- **Pencilneck:** PN-RB-F's ramp from ~50 sets to a ~90–100 peak. The plan
  currently opens at its peak.

---

## Phase 7 — Verification

### 7.1 Add to CI

```bash
npx tsx scripts/review-flags.ts        # 1-set and 4+-set slots, must be 0 unexplained
npx tsx scripts/spec-fit.ts            # card versus content
npm run verify:volume -- --strict      # after the Phase 1.5 fix
npm run verify:library
```

`review-flags` needs a `--strict` exit code. It currently reports 149 flags, 149
explained, **0 to answer for** — that is the state to hold.

### 7.2 Regression target

`scripts/build-portfolio-report.ts` emits the full expected end state. After
implementation, re-run the harness against the shipped plans and diff — every
number should match the simulation, or the difference should be explainable.

Headline figures to land on:

| | Shipped | Target |
|---|--:|--:|
| Near-clone pairs (>50% overlap) | 53 | **1** |
| Mean pairwise similarity | 0.176 | **0.130** |
| 1-set filler slots | 49 | **3** |
| Median distinct exercises | 21 | **23** |
| Median axial per set | 0.46 | **0.38** |
| Library movements in use | 182 | **191** |

### 7.3 Live retest

The audit verified findings through `test_claude` clickthroughs. Re-run that for
the plans with the largest structural change — Monolith, Purgatorio, Arms Race,
Venus, REDLINE — plus the five that exposed write-path failures.

---

## Sequencing

```
Phase 0  ─────────────────────────────────►  blocks all verification
   │
Phase 1  ──┬── 1.1 dashboard key            ─┐
           ├── 1.2 reset allowlist           │ independent of each other,
           ├── 1.3 system weight             │ land in any order
           ├── 1.4 liftHistory               │
           └── 1.5 volumeAnalysis ⚠──────────┘  ← re-baseline verify:volume
   │
Phase 2  ── library ids ──────────────────►  blocks Phase 4
   │
Phase 3  ── catalogue rules ──────────────►  blocks Phase 4
   │
Phase 4  ── plan content (33 plans) ──────►  parallelisable per plan
Phase 5  ── cards & registry ─────────────►  parallel with 4
   │
Phase 6  ── engine work ──────────────────►  parallel per plan, after 0
   │
Phase 7  ── verification
```

**Parallel-safe:** Phases 4, 5 and 6 are per-plan and can run concurrently once
2 and 3 land. Phase 6 additionally needs Phase 0.

**Not parallel-safe:** Phase 1.5 changes what `verify:volume` reports, so it must
land before anyone judges a plan's volume. Phase 2 blocks the content edits that
reference new ids.

---

## Open decisions

Items where the work is understood but the call has not been made.

1. **Bench Domination frequency** — card says 4, template runs 6. Correct the
   card or the default?
2. **Fatigue ratings** — Pencilneck (2 vs 4), Cathedral (3 vs 1), REDLINE (3 vs
   4), plus several one band out. Correct the ratings or change the plans?
3. **`cable-triceps-extension` in 21 plans, `cable-crunch` in 19** — the pressdown
   half of the triceps rule and the core rule never got the per-plan assignment
   the overhead half did. Same failure mode round 2 was built to fix.
4. **Tenfold's missing hinge** — batch 6 dropped the hip-supported deadlift from
   D4, so the plan now trains knee flexion without hip extension.
5. **REDLINE session length** — +17 sets against a card promising 40–50 minutes.
   The 15 supersets should cover it; RL-RB-F's 20-minute express prune is the
   fallback.
6. **Skeleton's three missing groups** — shoulders, biceps and triceps get zero
   direct sets. SKEL-V-pec protected this; a single seated machine press would
   fill all three.
7. **Iron Clock's return** — IC-RB-V splits the territory (Iron Clock owns
   lower-body density, REDLINE owns upper/mixed). Needs a dedicated selection
   pass before it comes back.

---

## Files

| File | Role |
|---|---|
| `scripts/portfolio-metrics.ts` | Measurement core — materialise, score, set shape |
| `scripts/v2-change-map.ts` | Round 1: audit votes, each citing its vote id |
| `scripts/v2-round2-map.ts` | Round 2: variety assignment, set-shape policy, proposed library ids |
| `scripts/v3-owner-decisions.ts` | Round 3: per-plan decisions, ten batches, with reasoning |
| `scripts/sim-v2-portfolio.ts` | Applies all three layers, diffs every state |
| `scripts/spec-fit.ts` | Card versus content |
| `scripts/review-flags.ts` | Standing set-shape check |
| `scripts/build-portfolio-report.ts` | Report JSON behind the chart |
| `docs/analysis/portfolio-v2-simulation.md` | The full decision record |
| `docs/analysis/portfolio-v2-review.html` | The chart |
| `docs/plans/v2/_audit-closeout.md` | Vote index |
| `docs/plans/v2/_effectiveness-questions.md` | Owner answers by vote id |
