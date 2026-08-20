# Quadfather

> Unified plan document, v2 format. Supersedes `docs/plans/quadfather.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `quadfather` |
| **Length** | 10 weeks (Introduction 1-3, Enforcement 4-7, Succession 8-9, Settlement 10) |
| **Frequency** | 4 days/week, quads 3x, everything else 2x |
| **Weekly sets** | 69 (Introduction), variable by phase (Enforcement adds myo-reps to Burn-role slots without changing sets; Succession tightens Load-role reps; Settlement −1 set/slot) |
| **Declared kind** | specialisation, quads |
| **Calibration** | none |
| **Source** | `src/data/plans/quadfather.ts` (129 lines, `definePlan()`-based) + `src/features/quadfather/roles.ts` (role map, `resolveDepth`, `proposeKneeSwap`) |
| **Stated promise** | *"Quads 3×, other muscles 2×. Load, depth and burn roles. Confirmed range of motion. Knee-feedback swaps."* |

---

## 1. Headline finding

**Two of the plan card's four claimed features — "confirmed range of motion" and "knee-feedback swaps" — are dead code with genuinely well-designed backends and zero UI entry points, the same pattern already confirmed on Event Horizon and Overhead Dominion. This makes Quadfather the third Wave-3 plan in a row where a specific mechanical claim fails live verification, and here it's half the card's advertised feature list, not just one bullet.**

### 1a. "Confirmed range of motion" — decorative note, no confirmation mechanism anywhere

`resolveDepth()` reads `user.quadfatherStatus.rom[exerciseId].confirmed`; when
unresolved, `preprocess()` appends the note `"Confirm your depth after the
first set."` **Confirmed live**, Week 1, Hack Squat and Leg Extensions both
rendered this exact note — as plain inert text, no checkbox, no button, no
interactive control of any kind anywhere on the exercise card. Nothing in
`src/**/*.tsx` writes `quadfatherStatus.rom`, so depth can never actually
transition out of "unconfirmed" in the running app. The note will read
identically in week 1 and week 10.

### 1b. "Knee-feedback swaps" — a complete, careful swap engine with zero UI entry points

`proposeKneeSwap()` (`roles.ts`) is a genuinely well-designed same-role
substitution engine, and `preprocess()` (`quadfather.ts:79-120`) correctly
consumes both an `accepted` swap map and an `autoSwaps` map (auto-triggering
after ≥2 unaccepted "strained" reports for the same exercise). But **no
`.tsx` file anywhere renders a knee-pain-report control or a swap-accept
control**, and nothing writes `quadfatherStatus.kneeFeedback` from any
reachable UI path. Same structural shape as Event Horizon's T-10 dead swap
engine — confirmed absent live (no report/strain/swap control anywhere on
the dashboard or in the workout view).

**Worth flagging independently of the dead-UI finding**: the preprocess
function's own doc comment claims *"Nothing is swapped here that the
athlete has not already confirmed — `proposeKneeSwap` only produces
offers"* — but the `autoSwaps` branch explicitly swaps an exercise after 2
unaccepted "strained" reports, with **no confirmation step at all**. Even
setting aside that this code path is currently unreachable, the comment
describing the design is factually wrong about the design it describes.

### 1c. "Load, depth and burn roles" — genuinely distinct, confirmed live

Unlike the two dead features above, this claim holds up completely.
**Load** (Hack Squat 4×5-8 systemic-primary, Goblet Heel-Elevated Squat
3×8-12) is heavy/low-rep and gets tightened further in Succession (4-6
reps). **Depth** (FFE Bulgarian Split Squat, Leg Press, Supported Sissy
Squat, Knee-Over-Toe Split Squat) targets range of motion and stays
untouched by phase transforms. **Burn** (Leg Extension, Reverse Nordic
Curl, Stripper Squat) is all last-set-failure, converted to myo-reps in
Enforcement. Confirmed live: the dashboard's role-balance widget rendered
"LOAD 2 / DEPTH 3 / BURN 4" correctly. This is a real, three-axis design —
intensity, ROM, and fatigue — not three copies of similar work.

---

## 2. The `reverse-nordic-curl` misattribution — confirmed, and quantified for this plan specifically

Per the audit's standing watch item (§6.3, `_audit-status.md`): this
exercise is filed in the library as `hamstrings`/knee-flexion but is
mechanically a knee-*extension* (quad) movement. Quadfather uses it once —
Day 4 (The Reckoning — Burn), 2 sets, burn role, `last-set-failure`. This is
the highest-stakes possible plan for this bug to hit, since it's the
plan's own headline muscle being undercounted.

**Quantified, computed from the attribution map, Introduction phase (69
sets/week):**

| | Library classification (current) | Corrected classification |
|---|---|---|
| Quad total (3 vasti + rectus femoris) | 75.5 sets/wk | **83.5 sets/wk (+10.6%)** |
| Hamstring total (biceps femoris + semiMemb/Tend) | 20.0 sets/wk | **16.0 sets/wk (−20.0%)** |

The library's current data makes Quadfather look like it delivers 20
hamstring sets/week — a real, if secondary, hamstring stimulus. Correcting
the single miscoded exercise removes a fifth of that number (down to 16,
from RDL + seated curl + lying curl only) and pushes quad volume — already
this plan's overwhelming focus — over 10% higher still. The bug doesn't
just misclassify a random exercise on this plan; it specifically launders
volume away from the muscle the entire plan exists to maximize, understating
its own headline number in any analysis (including, until this correction,
this audit's own volume tables) that trusts the library's current filing.

---

## 3. Structure

### Weekly template (Introduction phase, weeks 1-3, 69 sets)

| Day | Sets | Key work |
|---|---|---|
| The Offer — Load | 17 | Hack Squat 4×5-8 (systemic, primary), Goblet Heel-Elevated Squat 3×8-12, Leg Extensions 2×12-15 (last-set-failure), Incline DB Bench 3, SA Hammer Row 3, Lateral Raise 2 |
| The Family — Maintain | 20 | Romanian Deadlift 3×6-10 (systemic), Lat Pulldown 3, Hammer Chest Press 3, Seated Ham Curl 3, SA Reverse Pec Deck 2, Hammer Curl 2, Cable Tri Ext 2, Hack Calf Raise 2 — no quad work at all, by design |
| The Debt — Depth | 17 | FFE Bulgarian Split Squat 3×8-12 (uni), Leg Press 3×10-15 (systemic), Supported Sissy Squat 2×10-15 (last-set-failure), Seated DB Shoulder Press 3, Hammer Pulldown 3, Hack Calf Raise 2 |
| The Reckoning — Burn | 15 | Knee-Over-Toe Split Squat 3×8-12 (uni), Stripper Squat 3×10-15, Reverse Nordic Curl 2×8-12 (last-set-failure), Lying Leg Curl 2×10-15, SA Hammer Row 3×8-12 (uni), Hammer Curl 1, Cable Tri Ext 1, Ab Wheel 1 — kept light on the spine by design, following two quad days and a hinge day |

Confirmed live: Maintain day (dow 2) has zero quad-primary exercises,
matching the card's "quads 3x, other muscles 2x" claim precisely.

### `xStatus`, T-2, T-3, T-14, T-4, T-9

- **`quadfatherStatus` exists** (`rom`, `kneeFeedback`, `roleBalance` —
  types.ts:288-294) but **nothing anywhere writes it** — the role-balance
  widget computes its display client-side as a fallback rather than reading
  a persisted value. This is a real T-2 gap (`quadfatherStatus` is absent
  from `resetProgram()`'s allowlist), but currently moot in practice since
  nothing populates the field to begin with — same shape as Event Horizon's
  T-10-adjacent T-2 gap.
- **No `type: 'wave'` and no `technique: {kind:'wave'}`** — not exposed to
  T-3/T-14.
- **No classic T-4 pattern** — cross-day repeats (`single-arm-hammer-row`,
  `hammer-curl`, `cable-triceps-extension`, `hack-calf-raise`) are
  intentional maintenance reuse with deliberately different set counts per
  day, not the same slot defined twice with drifting values.
- **T-9 mechanism reconfirmed** (not a fresh Firestore-verified instance
  this session — the dashboard landed on "Week 1" because that was this
  audit's own last manually-set week value from the Hamstring Foundry
  tempo check, itself consistent with, not contradicting, the same
  `dashboardViewWeek-${user.id}` cache mechanism already confirmed 8 times).

---

## 4. Findings

### 4.1 "Confirmed range of motion" is a dead feature · **severity: high, `plan-local`**

Detailed in §1a. Confirmed live — the note renders as static text.

### 4.2 "Knee-feedback swaps" is a dead feature, with a self-contradicting design comment · **severity: high, `plan-local`**

Detailed in §1b. Third confirmed instance of the Event Horizon/Overhead
Dominion dead-feature pattern (T-10/T-15), and the only one so far where
the underlying design also has an internal inconsistency (auto-swap fires
without confirmation, contradicting the code's own doc comment).

### 4.3 `reverse-nordic-curl` misattribution — confirmed and quantified · **severity: medium, `shared-bug` (library-level, plan-local impact)**

Detailed in §2. Understates this plan's own headline muscle by ~10.6%
relative to its corrected true value, and overstates a muscle the plan
explicitly doesn't specialize in by 20%.

### 4.4 `resetProgram()` allowlist gap · **severity: low, `shared-bug`**

`quadfatherStatus` absent from the allowlist — currently inert since
nothing writes to the field, but will matter the moment #4.1/#4.2 are
fixed, same conditional-severity shape as Event Horizon's T-10 companion
gap.

### 4.5 "Load, depth and burn roles" — confirmed accurate · **severity: none (positive finding)**

Detailed in §1c. The one claim on this card that fully survives live
verification, and it's the plan's actual structural backbone.

### 4.6 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| "Confirm your depth after the first set" | High | Confirmed inert text, no interactive control — see §4.1 |
| No knee-pain-report control anywhere | High | Confirmed absent on dashboard and workout view — see §4.2 |
| Role-balance widget | — | "LOAD 2 / DEPTH 3 / BURN 4" rendered correctly, confirming the one dashboard feature that is real |
| Maintain day genuinely quad-free | — | Confirmed matching the card's claim |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 5. Weekly volume (Introduction phase, 69 sets/week — corrected classification)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Quads (3 heads)** | **25.0 each** | | Glute max (lower) | 15.5 |
| Lats (lower) | 10.0 | | Teres major | 9.0 |
| Rectus femoris | 8.5 | | Hamstrings (2 heads) | 8.0 each |
| Biceps (long) | 7.5 | | Front delt | 7.25 |
| Rhomboids | 7.0 | | Triceps (lateral/medial) | 6.0 each |
| Forearm flexors / lats (upper) / brachialis | 6.0 each | | Adductors | 5.5 |
| Gastrocnemius | 5.25 | | Trap (mid) | 4.75 |
| Abdominal wall | 4.75 | | Pec (upper/lower) | 4.5 each |

All 20 distinct exercise ids resolved cleanly. Under the corrected
attribution, quad volume (25.0/head, 83.5 combined with rectus femoris) is
the clear runaway leader by a wide margin — exactly matching the plan's
stated identity — while hamstrings (8.0/head, 16.0 combined) sit at a
genuinely secondary, maintenance-appropriate level once the
reverse-nordic-curl correction is applied.

---

## 6. Systemic and joint load

Introduction-phase (weeks 1-3) totals, computed from `intelligence`:

| Metric | Value |
|---|---|
| Systemic | **103** |
| Axial | **38** |
| Sets | 69 |
| Per-set systemic | **1.49** |

Second-highest axial load of any Wave 2/3 plan audited (after Purgatorio's
52), unsurprising for a plan that runs three separate squat/lunge-pattern
sessions a week — Hack Squat, Leg Press, two Bulgarian/knee-over-toe
split-squat variants, all landing real axial cost in the same week the
plan explicitly designs "Burn" day to be "light on the spine... since it
follows two quad sessions and a hinge day" (source comment, confirmed
accurate — Burn day itself has no systemic-compound slot).

---

## 7. Improvements, ranked

### 1. Build the ROM-confirmation and knee-swap UI, or remove both claims · `plan-local`

Same recommendation shape as Event Horizon's T-10 fix — both backends
already exist and are reasonably well-designed (the knee-swap engine
especially, modulo §1b's auto-swap/confirmation inconsistency). They need
a UI surface: a per-exercise depth-confirmation control after set 1, and a
knee-strain report + swap-accept flow. Until built, half the card's
advertised feature list is unearned.

### 2. Fix the auto-swap confirmation contradiction · `plan-local`

Either require explicit confirmation before an auto-proposed swap applies
(matching the code's own doc comment), or update the comment to accurately
describe the 2-strikes auto-swap behavior. Fix this at the same time as
improvement #1, since the UI work will surface the discrepancy immediately
once built.

### 3. Correct the `reverse-nordic-curl` attribution (shared fix) · `shared-bug`

Same recommendation already logged against Bench Domination — reclassify
to knee-extension/quad in the library. Fixes the understatement of this
plan's own headline muscle and every other plan using the movement.

### 4. Add `quadfatherStatus` to the `resetProgram()` allowlist · `shared-bug`

Currently inert but will matter the moment improvement #1 ships.

---

## 8. Verdict

**Quadfather's actual training structure is excellent — three genuinely
distinct quad roles, a maintain day that's honestly quad-free, and a Burn
day deliberately sequenced light on the spine — but half its advertised
feature list (ROM confirmation, knee-feedback swaps) is complete,
well-engineered code with no way for an athlete to ever reach it, and its
own headline muscle's volume is quietly understated by the same
reverse-nordic-curl bug already found on two other plans.**

The Load/Depth/Burn framework is the strongest specialization-axis design
in Wave 3 so far — three genuinely different training stimuli (intensity,
range of motion, fatigue), not a marketing repackaging of similar work, and
the role-balance dashboard widget that displays it is real and correctly
wired. But this is now the third Wave-3 plan in a row where a specific,
appealing mechanical claim doesn't survive contact with the running app —
after Overhead Dominion's decorative wave label and dead delt-split
tracking, and Hamstring Foundry's one-of-three-tracked-functions gap,
Quadfather adds two more dead features to the tally, this time both
genuinely well-built rather than half-finished. The pattern across this
wave is consistent: specialization plans keep shipping real backend
engineering for features the frontend never catches up to.

---

## 9. Export block

```yaml
id: quadfather
version: 2
length: { weeks: 10, phases: [introduction_1to3, enforcement_4to7, succession_8to9, settlement_10] }
frequency: 4_per_week
weekly_sets: { introduction: 69 }
kind: specialisation_quads
calibration: none
engine: definePlan_generic
systemic_load: { weekly: 103, axial: 38, sets: 69, per_set: 1.49 }
volume_top_corrected: { vastusLateralis: 25.0, vastusMedialis: 25.0, vastusIntermedius: 25.0, gluteMaxLower: 15.5, latsLower: 10.0 }
reverse_nordic_curl_impact:
  quad_total: { library: 75.5, corrected: 83.5, delta_pct: 10.6 }
  hamstring_total: { library: 20.0, corrected: 16.0, delta_pct: -20.0 }
  note: "the bug specifically understates this plan's own headline muscle while overstating a muscle it explicitly does not specialize in"
absent_bug_patterns: [wave_progression_bug, T14_no_wave_technique_used, classic_T4_duplicated_definitions]
dead_features:
  - area: "ROM confirmation (quadfatherStatus.rom)"
    detail: "resolveDepth() reads it, preprocess() appends 'Confirm your depth after the first set.' note, but nothing anywhere writes rom — confirmed live as inert static text"
  - area: "knee-feedback swaps (quadfatherStatus.kneeFeedback, proposeKneeSwap())"
    detail: "complete, well-designed same-role swap engine with auto-swap after 2 unaccepted strained reports; zero UI entry points anywhere in src/**/*.tsx; confirmed live — no report/swap control on dashboard or workout view"
    design_flaw: "preprocess()'s own doc comment claims nothing swaps without confirmation, but the autoSwaps branch swaps without any confirmation step — contradicts its own documentation independent of the dead-UI finding"
positive_findings:
  - "Load/Depth/Burn roles genuinely distinct — different rep ranges, different phase treatment, confirmed live via the role-balance widget (LOAD 2/DEPTH 3/BURN 4)"
  - "Maintain day confirmed genuinely quad-free, matching the 'other muscles 2x' claim"
shared_bug_gaps:
  T2_resetProgram_allowlist: "quadfatherStatus missing, currently inert since nothing writes to it"
  reverse_nordic_curl: "third confirmed plan (after Bench Domination), highest-stakes case since it's this plan's own specialization muscle"
audit: { date: 2026-08-15, findings: 6, verdict: "excellent three-axis quad-role design undercut by two well-built but completely unreachable headline features, plus a quantified understatement of its own specialization muscle from the reverse-nordic-curl bug" }
```
