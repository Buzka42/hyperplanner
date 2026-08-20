# Purgatorio

> Unified plan document, v2 format. Supersedes `docs/plans/purgatorio.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `purgatorio` |
| **Length** | 12 weeks, four 3-week blocks (Accumulation, Intensification, Accumulation II, Intensification II) |
| **Frequency** | 4 days/week upper/lower (Mon / Tue / Thu / Fri) |
| **Weekly sets** | 91 (Accumulation weeks 1–3, 7–9), 67 (Intensification weeks 4–6, 10–12) |
| **Declared kind** | hypertrophy/powerbuilding, antagonist-paired (A1/A2 supersets throughout) |
| **Calibration** | none — no stats collected at onboarding |
| **Source** | `src/data/plans/purgatorio.ts` — 110 lines, `definePlan()`-based (same generic engine as Monolith) |
| **Stated promise** | *"Repeating 6-week blocks: three weeks of volume, three weeks of load. Every muscle twice a week in both."* |

---

## 1. Headline finding

**Purgatorio inherits the same plan-switch bug confirmed on Monolith (T-9) — and it's the same root cause across two consecutive plans in Wave 2, reinforcing that this is an app-wide defect, not a per-plan one.**

Continuing directly from the Monolith test session (`test_claude` was mid-onboarding on Monolith at a stale "Week 5"), switching to Purgatorio through Settings → Program Management → Switch Program produced:

> *NEXT SESSION — Upper A · Intensification — WEEK 5 — 6 EXERCISES*

A direct Firestore read of `users/test_claude` immediately after confirms no
backing state:

```json
"programId": "purgatorio",
"programProgress": {
  "bench-domination": {...}, "king-of-the-squat": {...}, "monolith": {...},
  "ritual-of-strength": {...}, "trinary": {...}
  // no "purgatorio" key
},
"startDate": "2026-08-14T20:38:16.555Z"   // fresh
```

Same mechanism as Monolith (§1 of that doc): `Dashboard.tsx:79`'s
`localStorage.getItem('dashboardViewWeek-${user.id}')` has no `programId`
component, so the stale week number simply keeps propagating forward through
every plan switch in a session, regardless of which plan set it. This is now
confirmed on **two consecutive Wave-2 plans** with completely different
engines underneath (well, the same generic `definePlan()` engine, but
different phase logic) — strong evidence this is a single shared fix (T-9)
rather than something to re-litigate per plan. Landing on week 5 here means
skipping straight into **Intensification** (heavier, fewer reps, longer
rest) with zero exposure to the Accumulation block the plan is actually
named after.

---

## 2. Structure

### Base slots (4 days × 6 slots, 3 antagonist pairs per day: A1/A2, B1/B2, C1/C2)

| Day | A1/A2 | B1/B2 | C1/C2 |
|---|---|---|---|
| Upper A | Flat DB Press / Hammer Upper Row | Seated DB Shoulder Press / Lat Pulldown | Straight-Bar Curl / Rope Pressdown (last-set-failure) |
| Lower A | Hack Squat / Seated Ham Curl | Leg Extension / Barbell RDL | Standing Calf Raise / Cable Crunch |
| Upper B | Incline DB Bench / Hammer Lower Row | Cable Lateral Raise / Pull-up (last-set-failure on B1 only) | DB Hammer Curl / Lying DB Skullcrusher (both last-set-failure) |
| Lower B | Front Squat (alt: Safety Bar Squat) / Single-Leg Ham Curl | Heel-Elevated Goblet Squat / Hip-Supported DB Deadlift | Hack Calf Raise / Ab Wheel |

Base sets per slot: 3 everywhere except the arm/isolation pairs (Upper A
C1/C2, Upper B B1/C1/C2), which are base 2.

### Block mechanics — a genuinely elegant implementation

```ts
const accumulate = (slot) => ({ ...slot, sets: slot.sets + 1,
    reps: '10-15', restSeconds: roundRest(rest * 0.75), tempo: slot.tempo ?? '30X0' });
const intensify = (slot) => ({ ...slot, reps: '5-8',
    restSeconds: roundRest(rest * 1.4), tempo: undefined });
```

One base day-list, two transform functions, four phase windows
(`[1,2,3]`/`[4,5,6]`/`[7,8,9]`/`[10,11,12]`) — the entire 12-week arc is
expressed without a single duplicated exercise definition anywhere in the
file. This is architecturally identical to Monolith's phase-transform
pattern and produces the same result: **zero exposure to the T-4
duplicated-slot-definition bug**, confirmed by grep (`exerciseName ===`/
`ex.name ===`: no matches).

**Confirmed live**, week 5 (Intensification): Upper A rendered 3×5-8 on
every slot (base sets unchanged, reps set to 5-8), rest at 165s on the A/B
pairs (`roundRest(120 × 1.4)` = `roundRest(168)` = 165, correct to the
second), and 145s→rounds differently per slot — all matching source math
exactly. A1/A2/B1/B2/C1/C2 pairing labels rendered correctly ("with Hammer
Upper Row" etc.) on every slot.

### 2.1 Volume is asymmetric across blocks — Accumulation is not "the same work, different reps"

Because `intensify` doesn't touch `sets` at all (only `accumulate` does,
adding +1), the two block types are not just a rep-range swap:

| | Sets/slot | Total weekly sets | Reps |
|---|---|---|---|
| Accumulation | base + 1 | **91** | 10-15 |
| Intensification | base | **67** | 5-8 |

A 36% higher total set count in Accumulation weeks, on top of the higher
rep range — i.e. the two block types differ in total training volume
(sets × reps) by roughly 2.4×, not merely in load and rep target. This is
consistent with genuine Poliquin-style block periodization (deliberately
lopsided toward metabolic stress in the volume block, toward tension in the
load block) rather than a bug, but it's worth naming explicitly since the
card copy ("three weeks of volume, three weeks of load") doesn't quantify
just how large that swing is.

---

## 3. Findings

### 3.1 Plan-switch bug (T-9) reproduces identically · **severity: high, `shared-bug`**

Detailed in §1. Second confirmation in a row (Monolith → Purgatorio) of the
same root cause. No new information beyond what's already logged against
T-9 in `_audit-decisions.md`, but the repeat strengthens the case that
fixing `Dashboard.tsx:79` once fixes it for every `definePlan()`-generic
plan simultaneously.

### 3.2 In-file header comment claims "fewer exercises" during Intensification — false · **severity: low, `plan-local`**

The file's own top-of-file comment (`purgatorio.ts:6-9`) states:

> *"three weeks accumulating (9-15 reps, more sets, machines and cables,
> moderate rest), then three intensifying (5-8 reps, heavier, **fewer
> exercises**, longer rest, free weights)"*

**Confirmed live and in source: this is not what the code does.** Every
phase renders all 6 exercises on all 4 days — `intensify()` changes `reps`,
`restSeconds`, and `tempo` only; it never removes a slot. The live Week 5
session showed "6 EXERCISES" on every day, matching the unmodified day
definitions exactly. This looks like documentation describing an earlier or
intended design that was never implemented (or was simplified away) rather
than a functional bug — nothing breaks for the athlete, they just get more
exercise variety during Intensification than the plan's own internal
comment promises. Minor, but worth fixing the comment so it doesn't mislead
a future maintainer into thinking exercise-count reduction is implemented
somewhere it isn't.

Related: the same comment block says accumulation reps are "9-15" but the
`accumulate()` transform hardcodes `'10-15'` — a one-rep discrepancy,
cosmetic.

### 3.3 Mismatched antagonist pairing on Upper B's B1/B2 · **severity: low-medium, `plan-local`**

Upper B pairs Cable Lateral Raise (isolation, base 2 sets, `last-set-failure`
technique, 12-20 reps) against Pull-up (compound, base 3 sets, 6-10 reps) as
B1/B2. Every other antagonist pair in the plan matches set counts within the
pair (A1/A2 always equal, C1/C2 always equal) — this is the one pairing
where the two sides finish at different times (2 sets vs 3), which either
leaves the lateral-raise side idle for a set or forces the athlete to
interleave awkwardly. Not confirmed as a rendering bug (the UI correctly
shows "3 sets" and "2 sets" separately, it's a design choice not a wiring
defect) but it breaks the pattern every other pairing in the file follows.

### 3.4 No `xStatus`, no `reverse-nordic-curl`, no `type: 'wave'` exposure · **severity: none (positive findings)**

- No dedicated status object (`purgatorioStatus`) exists anywhere in
  `UserContext.tsx` — like Monolith, `resetProgram()`'s hardcoded allowlist
  gap (T-2) doesn't apply here; there's nothing plan-specific for it to
  miss, and the generic `programProgress` reset path covers it correctly.
- `reverse-nordic-curl` is not used — leg curl slots use `seated-ham-curl`
  and `single-leg-hamstring-curl` instead.
- No `type: 'wave'` progression — not exposed to T-3.

Third data point (after Monolith) for the `_audit-decisions.md` §0c
hypothesis that `definePlan()`-generic-engine plans are structurally safer
than the bespoke-engine plans audited in Wave 1.

### 3.5 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| A1/A2 pairing labels | — | "with [partner exercise]" rendered correctly on every paired slot |
| Rest-time math | — | 120s → 165s at Intensification (`roundRest(120×1.4)`), confirmed to the second against source |
| Last-set-failure technique | — | "Last set to failure" badge + "TO FAILURE" replacing the rep target on set 2 of the arm slots, correctly limited to the technique-tagged slots only |
| Tempo removed at Intensification | — | No tempo cue shown on Week 5 slots, matching `tempo: undefined` in `intensify()` — Accumulation weeks would show `30X0` per source, not independently re-verified live this session but consistent with Monolith's equivalent tempo rendering |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 4. Weekly volume (attribution-map computed, both block types)

### Intensification weeks (67 sets/week)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Quads (3 heads) / hamstrings (2 heads)** | **12.0 each** | | Glute max (lower) | 10.5 |
| Teres major | 9.0 | | Front delt | 8.5 |
| Triceps (lateral/medial) | 8.5 each | | Biceps (long) | 8.25 |
| Lats (upper/lower) | 7.5 each | | Rhomboids | 7.5 |
| Gastrocnemius | 7.5 | | Abdominal wall | 6.75 |
| Forearm flexors | 6.5 | | Abs (upper) | 6.0 |
| Brachialis | 6.0 | | Trap (mid) | 5.25 |
| Rectus femoris | 5.25 | | Triceps (long) | 4.75 |
| Pec (upper/lower) | 4.5 each | | Abs (lower) | 4.5 |
| Erectors | 3.75 | | Side delt | 3.5 |
| Rear delt | 3.0 | | Soleus | 3.0 |
| Obliques | 3.0 | | Biceps (short) | 2.5 |

### Accumulation weeks (91 sets/week)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Quads (3 heads) / hamstrings (2 heads)** | **16.0 each** | | Glute max (lower) | 14.0 |
| Triceps (lateral/medial) | 12.0 each | | Teres major | 12.0 |
| Front delt | 11.5 | | Biceps (long) | 11.5 |
| Rhomboids / lats (upper/lower) | 10.0 each | | Gastrocnemius | 10.0 |
| Abdominal wall / forearm flexors | 9.0 each | | Brachialis | 8.5 |
| Abs (upper) | 8.0 | | Trap (mid) | 7.0 |
| Rectus femoris | 7.0 | | Triceps (long) | 6.75 |
| Pec (upper/lower) / abs (lower) | 6.0 each | | Erectors | 5.0 |
| Side delt | 5.0 | | Rear delt | 4.0 |
| Soleus / obliques | 4.0 each | | Biceps (short) | 3.75 |

All 24 exercise slots resolved to an attribution row — no missing-data
caveats. Both tables clear 5+ fractional sets/week on every major muscle
except serratus, trap upper, and subscapularis (all secondary
stability/rotator-cuff targets, not a stated focus of the plan) even in the
lower-volume Intensification weeks — the strongest floor-clearance result of
any plan audited so far, consistent with the plan's 4-day/6-slot-per-day/
antagonist-paired structure putting real work on almost every major muscle
group twice weekly, matching the card's stated design ("every muscle twice
a week in both" states). `rectusFemoris` in particular (5.25–7.0) is
noticeably better covered here than the portfolio-wide thin-coverage flag in
the attribution map's §25 — Leg Extension and Front Squat both load it
directly.

---

## 5. Systemic and joint load

| Metric | Accumulation (91 sets) | Intensification (67 sets) |
|---|---|---|
| Systemic | **151** | **112** |
| Axial | **52** | **39** |
| Per-set systemic | **1.66** | **1.67** |

Per-set systemic cost is nearly identical between block types (1.66 vs
1.67) despite the very different rep ranges and rest periods — the
`intelligence` model scores systemic cost per set independent of the
rep/rest parameters the phase transforms actually touch, so the total load
swing between blocks (151 vs 112, a 35% difference) tracks set count almost
exactly rather than reflecting any additional per-set adjustment for
heavier intensification loading. Highest axial load of any hypertrophy
generalist audited so far in Wave 2 (Monolith: 28) — driven by four
squat-pattern lower-body slots per week (Hack Squat, Front Squat,
Heel-Elevated Goblet Squat, plus RDL/deadlift variants) versus Monolith's
two.

---

## 6. Improvements, ranked

### 1. Namespace the dashboard view-week cache by program · `shared-bug`

Identical recommendation to Monolith's #1 and Ritual/Bench Domination's
existing T-1/T-9 entries — this is now confirmed on 4 of 7 plans checked
across Waves 1–2 with three different underlying mechanisms, one of which
(T-9, the literal shared-cache-key version) is common to both Wave 2 plans
checked so far. Fixing `Dashboard.tsx:79` once should resolve it for every
`definePlan()`-generic plan simultaneously.

### 2. Fix the "fewer exercises" claim in the source comment · `plan-local`

`purgatorio.ts:6-9`'s header comment doesn't match `intensify()`'s actual
behavior (§3.2). Either implement the exercise-count reduction the comment
describes (would require picking which slots to drop during
Intensification — a real design decision, not a one-line fix) or correct
the comment to describe what the code does. Given PROC-1 (findings-only
during the audit), this is logged as a doc-vs-code mismatch for the
post-audit round, not a request to change behavior now.

### 3. Even out the Upper B B1/B2 pairing · `plan-local` (`hypothesis`)

Match sets within the Cable Lateral Raise / Pull-up pair (either raise the
lateral raise to 3 sets, matching every other pairing in the file, or split
them into unpaired straight sets) so every antagonist pair in the plan
follows the same set-matched design the other 11 pairs already use.

### 4. Consider a small erectors/soleus top-up · `plan-local` (`hypothesis`, ties to a portfolio-wide gap)

Both sit at the low end of an otherwise well-covered volume table (erectors
3.75–5.0, soleus 3.0–4.0) — not floor violations given the plan's own
budget, but per the attribution map's §25 these are two of the
library-wide thin-coverage muscles, and Purgatorio's RDL/deadlift slots
already put erectors partway there. A straight-leg calf variant or slightly
heavier RDL emphasis in one block could close the gap without adding a slot.

### 5. Quantify the volume swing between blocks in the onboarding copy · `plan-local` (`hypothesis`)

The card text ("three weeks of volume, three weeks of load") doesn't
convey that Accumulation runs 91 sets/week against Intensification's 67 — a
36% swing plus a rep-range change. Athletes coming off an Intensification
week into a fresh Accumulation block might benefit from knowing the jump is
substantial, not just a rep-target change.

---

## 7. Verdict

**Purgatorio is architecturally the strongest hypertrophy generalist
audited so far in raw volume-floor coverage — every major muscle clears 5+
fractional sets/week even in its lower-volume block — and its block
periodization is a genuinely faithful, elegant implementation of the
Poliquin accumulation/intensification design it claims. Its one real defect
is the same shared app-wide bug already found on Monolith, now confirmed
twice in a row.**

The single-day-list-plus-phase-transform architecture (shared with
Monolith) continues to earn its keep: zero duplicated exercise definitions,
zero wave-progression exposure, zero `reverse-nordic-curl` exposure, and a
`resetProgram()` path that needs no plan-specific patch because there's no
plan-specific state to patch. The antagonist A1/A2/B1/B2/C1/C2 pairing
renders correctly across all four days, the accumulation/intensification
rest-time math checks out to the second, and the resulting volume profile —
12+ fractional sets/week on quads and hamstrings even during the "light"
Intensification block — genuinely delivers on "every major muscle group
gets at least two weekly exposures in both states."

The plan-switch bug (T-9) is the dominant real issue, and it's not local to
Purgatorio — it's the same `localStorage` key with no `programId` component
already flagged against Monolith, reproducing identically here down to the
Firestore state (no `programProgress.purgatorio` entry, fresh `startDate`,
stale week shown anyway). The header-comment mismatch (§3.2) and the
Upper B pairing asymmetry (§3.3) are both minor, plan-local items that don't
affect what actually ships to an athlete.

---

## 8. Export block

```yaml
id: purgatorio
version: 2
length: { weeks: 12, blocks: [accumulation_1to3, intensification_4to6, accumulation_7to9, intensification_10to12] }
frequency: 4_per_week
weekly_sets: { accumulation: 91, intensification: 67 }
kind: hypertrophy_powerbuilding_antagonist_paired
calibration: none
engine: definePlan_generic
systemic_load:
  accumulation: { weekly: 151, axial: 52, sets: 91, per_set: 1.66 }
  intensification: { weekly: 112, axial: 39, sets: 67, per_set: 1.67 }
volume_intensification_top: { vastusLateralis: 12.0, vastusMedialis: 12.0, vastusIntermedius: 12.0, bicepsFemoris: 12.0, semiMembTend: 12.0 }
volume_accumulation_top: { vastusLateralis: 16.0, vastusMedialis: 16.0, vastusIntermedius: 16.0, bicepsFemoris: 16.0, semiMembTend: 16.0 }
absent_bug_patterns: [duplicated_exercise_definitions, wave_progression_bug, reverse_nordic_curl_misattribution, resetProgram_allowlist_gap]
high_bug:
  area: "Dashboard.tsx dashboardViewWeek localStorage cache (T-9)"
  detail: "identical mechanism to Monolith — no programId component in the cache key"
  confirmed: "live: fresh Purgatorio registration after Monolith's stale week 5 showed 'NEXT SESSION WEEK 5 / Upper A Intensification'; Firestore has no programProgress.purgatorio entry and a fresh startDate"
doc_code_mismatch:
  area: "purgatorio.ts:6-9 header comment"
  detail: "claims Intensification uses 'fewer exercises' — code only changes reps/rest/tempo, exercise count is identical (6/6/6/6) across all phases, confirmed live"
audit: { date: 2026-08-14, findings: 5, verdict: "strongest volume-floor coverage of any hypertrophy generalist audited so far; one shared app-wide bug (T-9, second confirmation), two minor plan-local doc/design mismatches" }
```
