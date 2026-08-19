# Cathedral

> Unified plan document, v2 format. Supersedes `docs/plans/cathedral.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `cathedral` |
| **Length** | 10 weeks (Foundation 1-3, Vaulting 4-7, Consecration 8-9, Rest of the Stone 10) |
| **Frequency** | 4 days/week, chest 3x |
| **Weekly sets** | 59 (Foundation) |
| **Declared kind** | specialisation, chest |
| **Calibration** | none |
| **Source** | `src/data/plans/cathedral.ts` (128 lines, `definePlan()`-based day/phase structure) + `src/features/cathedral/arches.ts` (104 lines, arch logic) |
| **Stated promise** | *"A 10-week chest specialisation built on three arches: press, stretch and adduction... Incline dumbbell press as the heavy arch. Dips and flyes for stretch. No barbell bench."* |

---

## 1. Headline finding

**Three of the four card claims are literally true and confirmed live — "no barbell bench," "incline dumbbell press as the heavy arch," and "three arches" are all genuine. But the plan carries a fourth, unadvertised mechanism — an adaptive limiting-fatigue rebalancer and a combo-machine opt-in — that is entirely dead code, and it's the cleanest case of this pattern in the whole audit: not just unsurfaced, but structurally unreachable by any real user.**

### 1a. "No barbell bench" — confirmed literally true

Grepped the full plan file: zero barbell-bench-variant slots anywhere in
the four days. `arches.ts` even declares an explicit `FORBIDDEN` list of 7
barbell-bench variants — though nothing in the codebase actually enforces
this list against user substitutions elsewhere (it's defined but never
imported by any onboarding/swap-picker code), a lower-priority observation
since the plan's own authored slots never violate it regardless.

### 1b. "Incline dumbbell press as the heavy arch" — confirmed true, live

Incline DB Bench Press is 4×6-10, the only `primary`-marked,
`systemicCompound` slot in the entire plan, and the lowest rep range of any
exercise in the file. Confirmed live: Week 1 rendered "4 sets × 6-10 reps,
REST 2m 30s" — the longest rest and lowest rep target on the day. The
Consecration phase (weeks 8-9) additionally tightens press-arch reps to
5-8 while leaving the other two arches untouched, so the heavy arch gets
heavier as the block progresses, exactly as claimed.

### 1c. "Three arches" — genuinely distinct, confirmed live and in the volume data

Press (incline/flat DB press, Smith incline), Stretch (dips, cable flyes —
lengthened-position loading), and Adduction (pec deck, cable crossover —
short-range peak contraction) map to three real, mechanically distinct
functions grounded in current stretch-vs-shortened-position hypertrophy
literature, not three names for the same movement. Confirmed by the volume
data (§4): Stretch and Adduction land at an identical 8.5 direct chest
sets/week each, Press at 15.0 — a real, structured 1.76:1:1 ratio, not
marketing copy.

### 1d. The limiting-fatigue rebalancer and combo-machine opt-in are entirely unreachable — the cleanest dead-feature case in the audit

`CathedralStatus` (`types.ts:296-301`) declares `arches`, `limitingFatigue`,
and `comboMachineRole`. All three are **read** (in `Dashboard.tsx`'s arch
widget and in `arches.ts`'s `adjustForLimitingFatigue`/`chestProfile`), but
**grepped across the entire codebase, `cathedralStatus` is never written
anywhere** — no `updateDoc`/`updateUserProfile` call touches it, in any
file. `adjustForLimitingFatigue()` (`arches.ts:77-92`, offers to move 2
press sets to adduction after 2 non-chest-limited sessions in 3 weeks) can
never fire, because nothing ever appends to `cathedralStatus.limitingFatigue`.
Neither `Onboarding.tsx` nor `Settings.tsx` contains a single reference to
`cathedral` — unlike Kali, Gravity Is Optional, Athena, or Venus Rising
(all of which have real `exerciseSelections` UI elsewhere in the app),
Cathedral's `planPreferences?.cathedral` is read only inside its own
`preprocessDay` hook and set nowhere.

**Confirmed live**: the dashboard's "Press / Stretch / Adduction" widget
rendered correctly (PRESS 10 / STRETCH 12 / ADDUCTION 10), but this is the
*static, plan-authored* balance via the `?? archBalance(...)` fallback —
`user.cathedralStatus?.arches` is always undefined, so even this one piece
of Cathedral-specific UI never reflects adaptive or logged state, only the
fixed template. More than a third of `cathedral.ts` (the `preprocessDay`
hook's combo-machine and arch-shift branches) can only ever hit its
unchanged early-return path in real usage — this is a stronger version of
Quadfather's dead features, where at least the backend *engine* ran on
real (if unreachable) input; here the consuming pathway itself is
structurally inert.

---

## 2. Structure

### Weekly template (Foundation, weeks 1-3, 59 sets)

| Day | Sets | Key work |
|---|---|---|
| Nave — Press | 15 | Incline DB Bench 4×6-10 (primary, systemic), Dip 3×8-12, Pec Deck 2×12-15 (last-set-failure), SA Hammer Row 3, Lateral Raise 2 (last-set-failure), Cable Tri Ext 1 |
| Crypt — Lower | 14 | Hack Squat 3×6-10 (systemic), RDL 3×8-12, Seated Ham Curl 3×10-15, Leg Extension 2, Hack Calf Raise 2, Ab Wheel 1 |
| Transept — Stretch | 14 | Cable Fly 2×10-15 (partials, bottom range, last set), Smith Incline 3×8-12, Cable Crossover 2×12-20 (last-set-failure), Hammer Pulldown 3, SA Reverse Pec Deck 2, Hammer Curl 2 |
| Spire — Adduction | 16 | Pec Deck 2×12-20 (last-set-failure), Flat DB Press 3×8-12, Dip 2×8-12, Lat Pulldown 3, Seated DB Shoulder Press 2, Hack Calf Raise 2, Cable Tri Ext 1, Hammer Curl 1 |

Confirmed live: Pec Deck rendered at **2 sets**, matching source — the
plan's own original doc (`docs/plans/cathedral.md`) shows 3 sets for Pec
Deck (and similarly overstates Cable Fly/Crossover by one set each), a
stale doc-vs-code mismatch of the same shape already found on Purgatorio in
Wave 2, not a live bug.

### Phases

| Phase | Weeks | Change |
|---|---|---|
| Foundation | 1-3 | Base |
| Vaulting | 4-7 | Adduction-arch slots → myo-reps (3×4-5, 5-breath rest) |
| Consecration | 8-9 | Press-arch slots → 5-8 reps |
| Rest of the Stone | 10 | −1 set/slot, deload |

### `xStatus`, T-2, T-3, T-14, T-4, reverse-nordic

- **`cathedralStatus` exists but is never written** — same shape as
  Quadfather's `quadfatherStatus`, but more complete: here *every* field is
  dead, not just two of three.
- **T-2 confirmed present**: `cathedralStatus` is absent from
  `resetProgram()`'s allowlist — currently inert since nothing writes to
  it, matching the conditional-severity pattern already seen on Event
  Horizon/Quadfather.
- **No `type: 'wave'` and no `technique: {kind:'wave'}`** — not exposed to
  T-3/T-14.
- **No classic T-4 pattern** — single authoritative slot per day, phase
  transforms mutate it rather than branching on duplicated copies.
- **No `reverse-nordic-curl`** anywhere in this plan.

---

## 3. Findings

### 3.1 Limiting-fatigue rebalancer and combo-machine opt-in are fully dead code · **severity: high, `plan-local`**

Detailed in §1d. Fourth consecutive Wave-3 plan with a dead-feature
finding (after Overhead Dominion, Hamstring Foundry, Quadfather), and the
most structurally complete instance: unlike the prior three, where a
backend engine at least computed something on unreachable-but-present
input, here the entire consuming code path in `preprocessDay` can only
ever exercise its no-op branch, since none of `Onboarding.tsx`,
`Settings.tsx`, or any dashboard component ever writes to
`planPreferences.cathedral` or `cathedralStatus`.

### 3.2 Arch-balance widget is real but non-adaptive · **severity: medium, `plan-local`**

The one piece of Cathedral-specific dashboard UI that does exist
(`Dashboard.tsx:674-693`) renders correctly, but it always shows the
static plan-authored ratio, never a logged/adaptive one, because the state
it would need to read is never written (§3.1). The plan's own original doc
claims "Dashboard: missing arch profile UI" — that claim is now **stale**;
the widget exists, it's just inert with respect to the plan's own
`cathedralStatus`.

### 3.3 `resetProgram()` allowlist gap · **severity: low, `shared-bug`**

`cathedralStatus` absent from the allowlist — currently inert, same
conditional-severity shape as prior instances.

### 3.4 `FORBIDDEN` barbell-bench list is declared but never enforced elsewhere · **severity: low, `plan-local`**

`arches.ts`'s `FORBIDDEN` array is defined but never imported by any
swap/substitution logic outside this plan's own dead `preprocessDay`
branches — a minor observation, lower priority than §3.1 since the plan's
authored slots never violate the list regardless of whether it's actively
enforced.

### 3.5 Three literal card claims confirmed true · **severity: none (positive findings)**

"No barbell bench," "incline dumbbell press as the heavy arch," and "three
arches" all hold up completely under live verification — see §1a-1c.

### 3.6 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| "Press / Stretch / Adduction" widget | Medium | Renders correctly but always shows the static fallback — see §3.2 |
| Incline DB Bench Press rendering | — | Correctly the heaviest slot (4×6-10, 2m30s rest) |
| Pec Deck at 2 sets | — | Confirmed matching source, not the stale doc's 3-set table |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 4. Weekly volume (Foundation phase, 59 sets/week)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Pec (lower)** | **19.5** | | Front delt | 14.0 |
| Pec (upper) | 12.5 | | Triceps (lateral/medial) | 12.0 each |
| Teres major | 7.5 | | Lats (lower) | 7.0 |
| Triceps (long) | 6.75 | | Biceps (long) | 6.0 |
| Hamstrings (2 heads) | 6.0 each | | Forearm flexors | 6.0 |
| Lats (upper) | 6.0 | | Brachialis | 6.0 |
| Rhomboids | 5.5 | | Quads (3 heads) | 5.0 each |

All 21 distinct exercises resolved to attribution rows — no missing data.

### The "three arches" claim, quantified (direct chest volume only)

| Arch | Pec (lower) | Pec (upper) | Total |
|---|---|---|---|
| Press | 6.5 | 8.5 | **15.0** |
| Stretch | 7.0 | 1.5 | **8.5** |
| Adduction | 6.0 | 2.5 | **8.5** |

Stretch and Adduction land at an identical 8.5 direct chest sets/week —
genuinely balanced as the card implies for those two. Press is
meaningfully larger (~47% of total direct chest volume, 1.76x either other
arch), which is appropriate given it's explicitly the "heavy" arch and
carries the plan's primary/systemic-compound slot, not an imbalance
contradicting the card's claims. Notably, Press supplies 8.5 of the
plan's 12.5 total pecUpper sets (68%) — upper-pec work is otherwise thin
outside the incline pattern, consistent with the attribution map's general
finding that pecUpper is a structurally underserved dimension across the
portfolio; this plan does route two of its three incline-pattern slots
through genuine upper-pec loaders, which is why pecUpper tracks
reasonably close to pecLower despite far fewer contributing exercises.

---

## 5. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **89** |
| Axial | **19** |
| Sets | 59 |
| Per-set systemic | **1.51** |

Lowest total systemic/axial load of any Wave 3 plan audited so far,
consistent with a chest-specialization plan whose only systemic-compound
slots are Incline DB Bench and the Crypt day's Hack Squat/RDL maintenance
pair — real but modest lower-body upkeep, not a second training focus.

---

## 6. Improvements, ranked

### 1. Build the limiting-fatigue and combo-machine UI, or remove both from the code · `plan-local`

The `adjustForLimitingFatigue`/`comboMachineRole` machinery in
`arches.ts`/`cathedral.ts` is dead in the strictest sense found in the
audit so far — not merely unsurfaced but structurally unreachable, since
no onboarding or settings surface ever populates the state it depends on.
Either build a minimal reporting control (which region felt limiting this
session) and a settings toggle for the combo-machine substitution, or
remove the dead branches — leaving them in risks a future maintainer
assuming this adaptive behavior is live when nothing exercises it.

### 2. Make the arch-balance widget read logged data, not just the static template · `plan-local`

Once `cathedralStatus.arches` has a real writer, the existing widget
(`Dashboard.tsx:674-693`) already has the right shape to display it — this
is a smaller lift than building the report/swap UI from scratch, since the
display layer is already correct.

### 3. Fix the `resetProgram()` allowlist gap · `shared-bug`

Add `cathedralStatus` to both allowlists — currently inert but will matter
the moment improvement #1 ships.

### 4. Correct the plan's own doc's stale set counts · `plan-local`

`docs/plans/cathedral.md`'s weekly-structure table shows Pec Deck, Cable
Fly, and Cable Crossover each one set higher than the live source — fix in
the v2 rewrite (already reflected correctly in §2 of this doc).

---

## 7. Verdict

**Cathedral's actual training design is exactly what it claims to be —
three real, literature-grounded chest functions, no barbell bench
anywhere, and a heavy arch that's genuinely heavier and gets heavier over
the block — but underneath that solid design sits the cleanest dead
feature found anywhere in the audit: an entire adaptive rebalancing system
with no possible way to ever activate.**

Every specific, checkable claim on the plan card survives live
verification without qualification — a genuinely strong result matching
Arms Race's clean pass earlier in Wave 3. The volume data confirms the
"three arches" framing isn't just naming: Stretch and Adduction land at an
identical 8.5 direct chest sets/week, Press appropriately larger as the
designated heavy arch. But the plan's more ambitious, unadvertised
mechanism — a limiting-fatigue-aware rebalancer that would shift volume
between arches based on what's actually bothering the athlete — is
completely unreachable, not because a UI hasn't caught up to a working
backend (as with Event Horizon and Quadfather), but because no code path
anywhere in the product ever writes the state the backend depends on. This
continues Wave 3's now-established pattern: consistently excellent
training design, consistently oversold or entirely unbuilt supporting
features.

---

## 8. Export block

```yaml
id: cathedral
version: 2
length: { weeks: 10, phases: [foundation_1to3, vaulting_4to7, consecration_8to9, rest_of_the_stone_10] }
frequency: 4_per_week
weekly_sets: { foundation: 59 }
kind: specialisation_chest
calibration: none
engine: definePlan_generic_with_bespoke_preprocess_hook
systemic_load: { weekly: 89, axial: 19, sets: 59, per_set: 1.51 }
volume_top: { pecLower: 19.5, frontDelt: 14.0, pecUpper: 12.5, tricepsLateral: 12.0, tricepsMedial: 12.0 }
three_arches_chest_volume: { press: 15.0, stretch: 8.5, adduction: 8.5 }
absent_bug_patterns: [wave_progression_bug, T14_no_wave_technique_used, classic_T4_duplicated_definitions, reverse_nordic_curl_misattribution]
positive_findings:
  - "'no barbell bench' confirmed literally true — zero barbell-bench slots anywhere in the plan file"
  - "incline DB press confirmed the heaviest/lowest-rep arch, live and in source, getting heavier still in Consecration"
  - "'three arches' confirmed genuinely distinct via volume data — stretch and adduction identically balanced at 8.5 direct chest sets/week each"
dead_feature:
  area: "cathedralStatus (arches/limitingFatigue/comboMachineRole) and planPreferences.cathedral"
  detail: "read in Dashboard.tsx and arches.ts, never written anywhere in the codebase; no Onboarding.tsx or Settings.tsx reference to cathedral at all"
  confirmed: "live — dashboard arch widget renders correctly but only the static plan-authored fallback, never adaptive state"
  severity_note: "cleanest dead-feature case in the audit — unlike Event Horizon/Quadfather, the consuming code path itself (preprocessDay's combo/shift branches) is structurally unreachable in real usage, not merely unsurfaced"
shared_bug_gaps:
  T2_resetProgram_allowlist: "cathedralStatus missing, currently inert"
doc_code_mismatch:
  area: "docs/plans/cathedral.md weekly-structure table"
  detail: "shows Pec Deck/Cable Fly/Cable Crossover each one set higher than live source (confirmed live at 2 sets for Pec Deck, not 3)"
audit: { date: 2026-08-15, findings: 4, verdict: "every literal card claim about the training design survives verification; the plan's more ambitious adaptive rebalancing system is entirely unreachable, the cleanest such case in the audit" }
```
