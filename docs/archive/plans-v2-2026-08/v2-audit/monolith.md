# Monolith

> Unified plan document, v2 format. Supersedes `docs/plans/monolith.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`.

| | |
|---|---|
| **id** | `monolith` |
| **Length** | 10 weeks |
| **Frequency** | 4 days/week upper/lower (Mon / Tue / Thu / Fri) |
| **Weekly sets** | 79 (weeks 1–9), ~72 (week 10, "Settling" −1 set/slot) |
| **Declared kind** | hypertrophy, machine-dominant, low systemic cost |
| **Calibration** | none — no stats collected at onboarding |
| **Source** | `src/data/plans/monolith.ts` — 110 lines, `definePlan()`-based (shared generic engine, not a bespoke one) |
| **Stated promise** | *"A 10-week machine-dominant upper/lower plan for accumulating volume you can recover from."* |

---

## 1. Headline finding

**A fresh Monolith registration shows "NEXT SESSION — WEEK 5" instead of Week 1, because the dashboard's view-week cache is keyed only by user ID, never by program ID.**

`src/pages/Dashboard.tsx:79`:

```ts
const savedViewWeek = localStorage.getItem(`dashboardViewWeek-${user.id}`);
```

and `Dashboard.tsx:187-189`:

```ts
useEffect(() => {
    if (user && viewWeek) {
        localStorage.setItem(`dashboardViewWeek-${user.id}`, viewWeek.toString());
```

The cache key has no `programId` component. Any plan switch inherits whatever
week the athlete last had open on their *previous* plan.

**Confirmed live and in Firestore.** `test_claude` was on King of the Squat
at week 5 (confirmed via page text: *"NEXT SESSION — WEEK 5 — Heavy Squat ·
Intensity Waves"*). After switching to Monolith through Settings → Program
Management → Switch Program → onboarding (schedule: Mon/Tue/Thu/Fri), the
dashboard immediately showed:

> *NEXT SESSION — Upper A · Pressure — WEEK 5 — 7 EXERCISES*

"Pressure" is Monolith's weeks-4-6 phase — this is not cosmetically harmless
the way it was on Bench Domination (where weeks 1–8 are structurally
identical). Here the athlete is silently placed in the **RPE-9-effort phase**
on session one, skipping the entire 3-week "Placement" ramp the plan design
depends on.

A direct Firestore read of `users/test_claude` immediately after the switch
confirms the client-side value has no backing:

```json
"programId": "monolith",
"programProgress": {
  "bench-domination": {...}, "king-of-the-squat": {...},
  "ritual-of-strength": {...}, "trinary": {...}
  // no "monolith" key at all
},
"startDate": "2026-08-14T20:15:28.265Z"   // fresh
```

`completedSessions: 0` and a brand-new `startDate` are both correct — the
week-5 display is pure stale `localStorage`, not a Firestore data problem.

**This is a third distinct mechanism behind the same class of bug** (§6.1 of
the audit status file): Ritual ignores a real status field, Bench Domination
shows a stale value with no state at all to ignore, and here the stale value
comes from a literal cross-plan shared cache key — the most direct version of
the bug found so far, and the easiest to fix (namespace the key by
`programId`, or clear it in `switchProgram()`).

---

## 2. Structure

### Weekly template (weeks 1–9, 79 sets; week 10 "Settling" drops 1 set/slot, ~72 sets)

| Day | Focus | Sets | Key work |
|---|---|---|---|
| Mon | Upper A | 21 | Hammer Chest Press 4×6-10 (primary), Hammer Pulldown 4×8-12, Machine Press/Fly Combo 3×10-15, SA Hammer Row 3×8-12 (uni), Lateral Raise 3×12-15, Cable Tri Ext 2×10-15, Hammer Curl 2×8-12 |
| Tue | Lower A | 19 | Hack Squat 4×6-10 (systemic, primary), Lying Leg Curl 3×10-15, Leg Press 3×10-15, SL Machine Hip Thrust 3×10-15 (uni), Leg Extension 3×12-15, Hack Calf Raise 3×12-20 |
| Thu | Upper B | 20 | Lat Pulldown 4×8-12 (primary), Incline DB Bench 3×6-10, SA Reverse Pec Deck 3×12-15 (uni), Pec Deck 3×12-15, Seated DB Shoulder Press 3×8-12, Rope Pressdown 2×10-15, Cable Curl 2×10-15 |
| Fri | Lower B | 19 | Leg Press 4×8-12 (systemic, primary), Seated Ham Curl 3×10-15, FFE Bulgarian Split Squat 3×8-12 (uni), Hip Abduction 3×12-20, Leg Extension 3×12-20, Hack Calf Raise 3×12-20 |

Exactly one `systemicCompound` anchor per lower day (Hack Squat Tue, Leg
Press Fri); upper days carry none. This "one systemic anchor/day" discipline
matches the pattern also seen well-executed in Kali and King of the Squat.

### Phases

| Phase | Weeks | Change |
|---|---|---|
| Placement | 1–3 | Base prescription, no transform |
| Pressure | 4–6 | Non-systemic slots → RPE 9 |
| Weight of It | 7–9 | `TECHNIQUE_SAFE` machines (10 exercises) → RPE 9 + 1 drop-set at −20% on the last set |
| Settling | 10 | `sets = max(1, sets − 1)` per slot — deload via volume cut, not intensity cut |

Effort (RPE) is progressed before technique (drop-sets) — a deliberate,
stated design choice ("effort first, technique later") that reads as
genuinely sound periodization: RPE 9 alone for 3 weeks lets the athlete
adapt to proximity-to-failure before drop-sets add metabolic/technical
complexity on top.

### The "distant pairs" guard

`DISTANT_PAIRS = [['machine-press-fly-combo','pec-deck'], ['hack-squat','lat-prayer']]`,
enforced by a `preprocessDay` hook that strips any `pair` label matching
these combinations. **No superset pairing is actually authored anywhere in
`MONOLITH_DAYS`** — every slot in the source has no `pair` key at all. The
guard is defensive against a *future* edit accidentally superset-pairing two
exercises the plan's own header comment says sit at opposite ends of the gym
floor. Confirmed live: the Upper A session rendered all 7 exercises as
sequential single slots, no pairing UI, no rest-period compression —
consistent with source.

---

## 3. Findings

### 3.1 Plan-switch view-week cache is not namespaced by program · **severity: high**

Detailed in §1. Root cause identified precisely (`Dashboard.tsx:79` /
`:187-189`, no `programId` in the localStorage key) — the cleanest fix of
the three plan-switch mechanisms found across the audit so far. Recommended
fix: `dashboardViewWeek-${user.id}-${user.programId}`, or clear/reset the
key inside `switchProgram()`.

### 3.2 `resetProgram()` — absence confirmed safe · **severity: none (positive finding)**

Monolith has no dedicated `xStatus` object (grepped `UserContext.tsx` for
`monolith`/`Monolith` — zero matches), so it isn't a candidate for the
hardcoded-allowlist bug (§6.2) the way Bench Domination/Ritual/etc. are.
`resetProgram()`'s generic path (`programProgress[currentId] = {
completedSessions: 0, startDate: ... }`, `UserContext.tsx:430-449`) does
cover Monolith correctly — confirmed by reading the full function body, not
assumed from the absence of a status field. Worth recording as an absence
per the audit's calibration standard (§7).

### 3.3 No `type: 'wave'` exposure, no duplicated-exercise-definition exposure, no `reverse-nordic-curl` exposure · **severity: none (positive findings)**

- Phases use `transform` functions applied at read time to a single
  authoritative `SlotSpec` per exercise per day — structurally immune to the
  Bench-Domination-style duplicated-definition bug (no `exerciseName ===`/
  `ex.name ===` patching anywhere in the file).
- No `type: 'wave'` progression — not exposed to the King of the Squat
  `wavePercentForSet` bug.
- `reverse-nordic-curl` is not used anywhere in the plan.

Three consecutive "absent" results is itself worth noting: Monolith's
`definePlan()` + phase-transform architecture is structurally cleaner than
every bespoke-engine plan audited in Wave 1, and it shows in the bug count —
one real bug found (§3.1, and it's a shared/app-wide one, not local to this
file) versus Bench Domination's six.

### 3.4 Quad and pec/lat volume double-counted across near-duplicate movements on separate days · **severity: low–medium**

`leg-press` (Lower A ×3, Lower B ×4 = 7 sets/wk) and `leg-extension` (Lower A
×3, Lower B ×3 = 6 sets/wk) each appear on *both* lower days — combined with
Hack Squat and Bulgarian Split Squat, all three quad heads (vastus
lateralis/medialis/intermedius) land at **20.0 fractional sets/week**, the
single highest number in the plan by a wide margin. Similarly, upper body
stacks three closely related pressing/pulling patterns across its two days:
Hammer Chest Press + Machine Press/Fly Combo + Pec Deck (all horizontal
press, `pecLower` 11.5, `teresMajor` 9.5) and Hammer Pulldown + Lat Pulldown
(both vertical pull, `latsUpper` 8.0). This isn't a bug — it's a legitimate
design choice to hit the same muscle from two machine angles across the
week — but it does mean Monolith's "upper/lower ×2" frequency claim
understates how concentrated the *actual* stimulus is on a handful of
movement patterns, worth knowing when comparing against a plan that spreads
the same weekly set count across more distinct exercises.

### 3.5 Adductors and erectors sit far below everything else · **severity: low**

Adductors: 4.25 sets/week (lowest nonzero muscle in the plan); erectors: 0.
Per the attribution map's §25 findings, Monolith has no dedicated
adductor or erector loader — consistent with the map's plan-wide finding
that erectors are one of nine muscles with zero trained loader across the
whole portfolio at the time of the library pass. Not a Monolith-specific
defect, but worth flagging since a "machine-dominant volume" plan is an
easy place to add a seated/machine adductor exercise without breaking the
theme, if the owner wants to close this gap plan-by-plan rather than
library-wide.

### 3.6 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| Week-5 RPE-9 correctly rendered | — | "RPE 9" shown against every non-systemic Upper A slot at week 5, matching the Pressure-phase transform exactly |
| Exercise order matches source | — | 7/7 slots rendered in declared order, correct set/rep ranges, correct 90s rest |
| Tempo/rest copy | — | `2:0:X:0` tempo and rest both shown per-exercise, consistent with `defaultTempo: '20X0'` |
| No accidental superset pairing | — | Confirmed no `pair` UI on Machine Press/Fly Combo or Pec Deck despite both appearing in the same week's sessions on different days |
| "Extra sets are yours to add" copy | — | Present on every slot, consistent with the app-wide "Extra sets never count toward progression" setting |
| Non-focusable plan card | Low | Confirmed present — app-wide finding (§6.6), not re-derived in detail |

---

## 4. Weekly volume (weeks 1–9, as computed from the attribution map)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Vastus lateralis/medialis/intermedius** | **20.0 each** | | Glute max (lower) | 11.5 |
| Pec (lower) | 11.5 | | Teres major | 9.5 |
| Front delt | 9.25 | | Triceps (lateral) | 8.75 |
| Lats (upper) | 8.0 | | Triceps (medial) | 8.0 |
| Pec (upper) | 8.0 | | Rectus femoris | 7.75 |
| Biceps (long) | 7.5 | | Gastrocnemius | 7.5 |
| Biceps femoris | 7.5 | | Lats (lower) | 7.0 |
| Brachialis | 7.0 | | Rhomboids | 7.0 |
| Glute medius | 6.0 | | Semimembranosus/tendinosus | 6.0 |
| Glute max (upper) | 4.5 | | Forearm flexors | 4.5 |
| Side delt | 4.5 | | Adductors | 4.25 |
| Triceps (long) | 4.0 | | Rear delt | 3.75 |
| Trap (mid) | 3.0 | | Soleus | 3.0 |
| Biceps (short) | 2.8 | | Brachioradialis | 2.0 |
| Trap (lower) | 2.0 | | TFL | 1.5 |
| Obliques | 0.75 | | Abdominal wall | 0.75 |
| Subscapularis | 0.75 | | Infraspinatus | 0.75 |
| Serratus | 0.75 | | Trap (upper) | 0.75 |

Zero volume anywhere: **erectors, abs upper, abs lower, tibialis anterior.**
All 23 exercises resolved to an attribution row — no missing-data caveats.

Against the audit's case-by-case MEV standard (§7): at 79 sets/week spread
across 35+ dimensions, most trained muscles clear 5+ fractional sets/week
comfortably — quads especially so, at 4× the floor. The muscles below floor
(TFL 1.5, obliques/abs/rotator-cuff cluster 0.75) are all secondary/stability
targets nowhere claimed as a focus of this plan, so their low numbers read as
appropriate incidental volume, not a shortfall against the plan's own goals.
Direct core work is genuinely absent — no ab or oblique-focused exercise
appears in any of the 4 days — worth noting for an athlete relying on
Monolith as their only program.

---

## 5. Systemic and joint load

Week 1–9 totals, computed from `intelligence`:

| Metric | Value |
|---|---|
| Systemic | **103** |
| Axial | **28** |
| Sets | 79 |
| Per-set systemic | **1.30** |

Lowest per-set systemic cost of any plan audited so far (Bench Domination:
1.46, and that was already the lowest powerlifting figure) — consistent with
the plan's stated design goal of "accumulating volume you can recover from."
Only two systemic-compound slots exist in the entire week (Hack Squat,
Leg Press), each isolated to its own day with no other systemic work
alongside it — the "one systemic anchor per lower day, zero on upper days"
structure is the direct mechanical reason the per-set average comes in this
low.

---

## 6. Improvements, ranked

### 1. Namespace the dashboard view-week cache by program · `shared-bug`

`localStorage` key `dashboardViewWeek-${user.id}` → `dashboardViewWeek-${user.id}-${user.programId}`,
or clear the existing key inside `switchProgram()`. This is the cleanest of
the three plan-switch bug mechanisms found in the audit (Ritual/Bench
Domination/here) to fix, and fixing it here likely fixes it for every other
`definePlan()`-based generic plan simultaneously, since none of them have
their own `xStatus` object to shadow the same bug — see the shared
recommendation already logged against Ritual and Bench Domination (T-1).

### 2. Add a direct core/ab exercise · `plan-local` (`hypothesis`)

No day in the 4-day split trains abs or obliques directly (0.75 fractional
sets/week on both, entirely incidental from compound bracing). A single
2-3×12-15 slot on either upper day would close this without disrupting the
"machine-dominant, low systemic cost" identity — most gyms have an ab
crunch/rotation machine that fits the theme.

### 3. Consider trimming redundant near-duplicate slots · `plan-local` (`hypothesis`)

§3.4's quad/pec/lat stacking across near-identical movements (Leg
Press+Leg Extension on both lower days; three horizontal-press variants
across the week) isn't wrong, but it does mean roughly a third of the
plan's weekly exercise-slot count is spent re-hitting the same pattern from
a slightly different machine angle rather than adding a genuinely new
stimulus (e.g., a direct adductor or erector exercise, both currently at the
low/zero end of the volume table).

### 4. Add a dedicated adductor or erector loader · `plan-local` (`hypothesis`, ties to a portfolio-wide gap)

Both sit far below every other trained muscle (adductors 4.25, erectors 0).
Per the attribution map's §25, this is a portfolio-wide gap, but Monolith's
"any fixed-gym machine" framing makes it one of the easier plans to patch
locally — e.g., a seated hip adduction machine slot on a lower day.

### 5. Document the "Settling" week's actual set count in the onboarding copy · `plan-local`

Week 10 quietly drops to ~72 sets (−1/slot) with no onboarding-facing
mention of a deload/taper week — every other plan audited so far that has an
explicit deload states it in the feature list or overview copy. A one-line
addition ("Week 10 tapers volume for recovery") would match user expectation
to what's actually programmed.

---

## 7. Verdict

**Monolith is the cleanest-engineered plan audited so far — one real bug,
and it's a shared app-wide issue rather than a local defect — but that one
bug is unusually costly here because it silently skips the plan's entire
3-week ramp-in phase.**

The `definePlan()` + phase-transform architecture avoids every local-bug
pattern found repeatedly in Wave 1's bespoke-engine plans: no duplicated
exercise definitions, no wave-progression exposure, no `reverse-nordic-curl`
misattribution, and a `resetProgram()` path that (for once) correctly covers
the plan without needing a per-plan patch. The "effort first, technique
later" phase design is genuinely sound periodization, and the one-systemic-
anchor-per-lower-day discipline produces the lowest per-set systemic cost of
any plan audited to date — a real, measurable expression of the "volume you
can recover from" promise.

The plan-switch bug is nonetheless serious: because it's driven by a
cross-plan-shared `localStorage` key rather than any Monolith-specific
state, any athlete who tries Monolith after another plan — which, given
this is plan 21+ in a 36-plan portfolio behind a multi-plan test/admin
keyword, is the common case, not the edge case — starts on whatever week
they'd last viewed elsewhere. Here that means possibly landing on RPE-9
effort work with zero adaptation to the base prescription, which is exactly
what the 3-week Placement phase exists to prevent.

---

## 8. Export block

```yaml
id: monolith
version: 2
length: { weeks: 10 }
frequency: 4_per_week
weekly_sets: { w1_9: 79, w10_settling: ~72 }
kind: hypertrophy_machine_dominant
calibration: none
engine: definePlan_generic
phases:
  placement: { weeks: [1,2,3], change: none }
  pressure: { weeks: [4,5,6], change: "non-systemic slots -> RPE 9" }
  weight_of_it: { weeks: [7,8,9], change: "TECHNIQUE_SAFE machines -> RPE 9 + 1 drop-set -20% last set" }
  settling: { weeks: [10], change: "sets = max(1, sets-1) per slot" }
systemic_load: { weekly: 103, axial: 28, sets: 79, per_set: 1.30 }
volume_w1_top: { vastusLateralis: 20.0, vastusMedialis: 20.0, vastusIntermedius: 20.0, gluteMaxLower: 11.5, pecLower: 11.5 }
volume_w1_zero: [erectors, absUpper, absLower, tibialisAnterior]
absent_bug_patterns: [duplicated_exercise_definitions, wave_progression_bug, reverse_nordic_curl_misattribution, resetProgram_allowlist_gap]
high_bug:
  area: "Dashboard.tsx dashboardViewWeek localStorage cache"
  detail: "key is `dashboardViewWeek-${user.id}` with no programId component (Dashboard.tsx:79, :187-189); switching plans inherits the previously-viewed plan's week number"
  confirmed: "live: fresh Monolith registration after King of the Squat week 5 showed 'NEXT SESSION WEEK 5 / Upper A Pressure'; Firestore users/test_claude has no programProgress.monolith entry and a fresh startDate, proving the week-5 display is pure stale localStorage"
  generalizes: "third distinct mechanism behind the plan-switch bug family (Ritual: ignores real field; Bench Domination: no field, stale value shown anyway; Monolith: literal shared cache key with no plan namespace at all) — likely affects every definePlan()-based generic plan with no xStatus of its own"
audit: { date: 2026-08-14, findings: 6, verdict: "cleanest-engineered plan audited so far; one shared app-wide bug, unusually costly here because it skips the entire ramp-in phase" }
```
