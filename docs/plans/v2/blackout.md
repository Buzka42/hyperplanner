# Blackout

> Unified plan document, v2 format. Supersedes `docs/plans/blackout.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures from
> each movement's `intelligence` block; wiring claims verified by source search
> and confirmed in the live app.

| | |
|---|---|
| **id** | `blackout` |
| **Length** | 8 weeks |
| **Frequency** | 3 full-body sessions / week |
| **Weekly sets** | 22 (7 · 7 · 8) — **every slot is 1 set** |
| **Session time** | ≈ 25–30 min |
| **Declared kind** | `general`, `minWeeklyExposures: 2` |
| **Progression** | Double progression, +2.5 kg (generic handler) |
| **Audience** | Advanced only, per its own copy |
| **Source** | `src/data/plans/blackout.ts` · `src/features/blackout/singleSet.ts` |
| **Stated promise** | *"One work set per movement. Back-off sets are earned, not scheduled. Quality and stop reason are mandatory."* |

---

## 1. Headline finding

**Blackout's entire identity is dead code.** The plan card sells four features.
Two of them do not exist in the running application, and a third exists only as
a static string.

| Advertised on the plan card | Reality |
|---|---|
| "3 full-body days" | ✅ True |
| "One work set per exercise" | ✅ True — enforced in `preprocessDay` |
| **"Back-off sets are earned, not scheduled"** | ❌ `earnedBackoff()` is imported and re-exported by `blackout.ts` and **called from nowhere in the application** |
| **"Quality and stop reason are mandatory"** | ❌ Neither field is ever collected. The live-set panel offers Load, reps, Log set — nothing else |

Verified by source search across `src/`:

| Function | Referenced outside `singleSet.ts`? |
|---|---|
| `earnedBackoff` | Import + re-export only. Never invoked |
| `advanceStall` | **Never** |
| `BLACKOUT_STALL_LADDER` | **Never** |
| `nextExposureAdvice` | **Never** |
| `isEvaluable` | **Never** |
| `failureAllowed` | ✅ Used — to pick one of two note strings |

`WorkoutView` gates the quality/RIR telemetry panel on
`prescription.topSetBackoff || bench-domination day 3 || oracle`. **Blackout is
not in that list**, so `quality` and `completionReason` are structurally
uncollectable — meaning `isEvaluable()` could never return `true` even if
something called it, and `earnedBackoff()` could never offer a back-off even if
it were wired.

`UserProfile.earnedBackoffs` exists in `types.ts:308` and nothing ever writes it.

**Why this was invisible:** `verify:blackout` passes with 36 assertions. Every
one of them calls the pure functions directly. None asserts that the app calls
them. This is the clearest case in the portfolio for a wiring-level test.

Blackout has no entry in the progression registry either, so it falls through to
`genericDoubleProgression` — the same handler as any plan with no logic at all.

### What the athlete actually gets

A 3-day, 22-set, one-set-per-slot full-body plan with generic double
progression and a sentence telling them whether failure is allowed. Everything
else in the concept is unreachable.

---

## 2. Structure

### Blackout I — 7 sets (Mon)

| # | Movement | Sets × reps | Rest | Sys | Ax | Failure? |
|---|---|---|---|---|---|---|
| 1 | Hack Squat | 1 × 5–8 | 240s | 3 | 2 | ✗ |
| 2 | Incline DB Bench Press | 1 × 6–10 | 150s | 2 | 0 | ✗ |
| 3 | Single-Arm Hammer Row | 1 × 8–12 | 150s | 1 | 0 | ✗ |
| 4 | Romanian Deadlift | 1 × 6–10 | 150s | 3 | 3 | ✗ |
| 5 | Lateral Raise | 1 × 12–15 | 150s | 1 | 0 | ✓ |
| 6 | Leg Extension | 1 × 12–15 | 150s | 1 | 0 | ✓ |
| 7 | Hammer Curl | 1 × 8–12 | 150s | 1 | 0 | ✓ |

### Blackout II — 7 sets (Wed)

| # | Movement | Sets × reps | Rest | Sys | Ax | Failure? |
|---|---|---|---|---|---|---|
| 1 | Paused Bench Press | 1 × 4–6 | 240s | 2 | 0 | ✗ |
| 2 | Hammer Pulldown | 1 × 8–12 | 150s | 1 | 0 | ✓ |
| 3 | Leg Press | 1 × 8–12 | 150s | 2 | 2 | ✗ |
| 4 | Seated Hamstring Curl | 1 × 10–15 | 150s | 1 | 0 | ✓ |
| 5 | Single-Arm Reverse Pec Deck | 1 × 12–15 | 150s | 1 | 0 | ✓ |
| 6 | Cable Triceps Extension | 1 × 10–15 | 150s | 1 | 0 | ✓ |
| 7 | Hack Calf Raise | 1 × 12–20 | 150s | 1 | 0 | ✓ |

### Blackout III — 8 sets (Fri)

| # | Movement | Sets × reps | Rest | Sys | Ax | Failure? |
|---|---|---|---|---|---|---|
| 1 | FFE Bulgarian Split Squat | 1 × 6–10 | 150s | 2 | 0 | ✗ |
| 2 | Seated DB Shoulder Press | 1 × 6–10 | 150s | 2 | 2 | ✗ |
| 3 | Lat Pulldown | 1 × 8–12 | 150s | 1 | 0 | ✗ |
| 4 | Lying Leg Curl | 1 × 10–15 | 150s | 1 | 0 | ✓ |
| 5 | Pec Deck | 1 × 12–15 | 150s | 1 | 0 | ✓ |
| 6 | Hammer Curl | 1 × 10–15 | 150s | 1 | 0 | ✓ |
| 7 | Cable Triceps Extension | 1 × 10–15 | 150s | 1 | 0 | ✓ |
| 8 | Hack Calf Raise | 1 × 12–20 | 150s | 1 | 0 | ✓ |

### Phases

| Phase | Weeks | What actually changes |
|---|---|---|
| Adjustment | 1–2 | — |
| Blackout | 3–6 | **Nothing.** Label only |
| Deep | 7–8 | `rpe: 10` on `primary` slots |

Verified: the exercise/set/rep signature is **identical across all 8 weeks**.
Same finding as The Minimum — see §7.2.

---

## 3. Weekly fractional volume

22 sets ≈ 95 fractional units across 35 dimensions — a mean of **2.7**. The
lowest-volume plan in the portfolio, by design.

### Best served (3.0 – 4.0)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Vastus lateralis | 4.0 | | Vastus medialis | 4.0 |
| Vastus intermedius | 4.0 | | Front delt | 3.0 |
| Biceps femoris | 3.0† | | Semimemb/tendinosus | 3.0† |
| Glute max (lower) | 3.0† | | Brachialis | 3.0 |

### Thin (1.0 – 2.9)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Triceps long head | 2.75† | | Triceps lateral | 2.5 |
| Triceps medialis | 2.5 | | Pec lower | 2.5 |
| Teres major | 2.5 | | Biceps long head | 2.5 |
| Forearm flexors | 2.5 | | Gastrocnemius | 2.5† |
| Lats (lower) | 2.25† | | Pec upper | 2.0† |
| Lats (upper) | 2.0† | | Rhomboids | 2.0 |
| Brachioradialis | 2.0 | | Side delt | 1.5 |
| Rectus femoris | 1.5 | | Rear delt | 1.25 |
| Trap mid | 1.0 | | Adductors | 1.0 |
| Soleus | 1.0 | | | |

### Zero or negligible

| Muscle | Sets |
|---|---|
| **Abs (upper)** | **0** |
| **Abs (lower)** | **0** |
| **Obliques** | **0** |
| **Glute max (upper)** | **0** |
| Forearm extensors | 0 |
| Tibialis anterior | 0 |
| TFL | 0 |
| Abdominal wall | 0.25 |
| Infraspinatus | 0.25 |
| Trap upper | 0.25 |
| Subscapularis | 0.25 |
| Trap lower | 0.5 |
| Glute medius | 0.5 |
| Serratus | 0.5 |

**Blackout contains no core work of any kind.** No ab wheel, no crunch, no leg
raise, no carry, no plank. The only trunk loading is 0.25 incidental from the
split squat. Every other full-body plan in the portfolio trains abs directly;
this one is comparing 22 sets against The Minimum's 29 and spending none of the
difference on the trunk.

**Glute max upper is also zero** — no hip thrust, bridge or any short-position
glute movement. All glute work comes at long muscle length from RDL and split
squats.

---

## 4. Systemic and joint load

| Metric | Day I | Day II | Day III | Week |
|---|---|---|---|---|
| Systemic | 12 | 9 | 10 | **31** |
| Axial | 5 | 2 | 2 | 9 |
| Lower back | 3 | 0 | 0 | 3 |
| Per-set systemic | 1.71 | 1.29 | 1.25 | — |

Weekly systemic 31 vs The Minimum's 44 across one more session. This is a
genuinely low-fatigue plan, which is the correct pairing for its austerity —
recovery is not the limiting factor here, stimulus is.

### Weekly CNS curve

```
W1  ███████████████ 31
W2  ███████████████ 31
W3  ███████████████ 31   ← "Blackout" phase begins; nothing changes
W4  ███████████████ 31
W5  ███████████████ 31
W6  ███████████████ 31
W7  █████████████████ 34  ← RPE 10 on primary slots
W8  █████████████████ 34
```

No deload — appropriate at this volume. No taper, no test week, and the plan
simply ends at week 8.

---

## 5. Session flow

**Ordering is good.** Day I leads with the two systemic items but separates
them (hack squat → incline press → row → RDL), which is exactly the fix The
Minimum needs. Days II and III descend cleanly in systemic cost.

**Rest is long and correct.** 240s on the two heavy primaries and 150s
elsewhere. On a one-set plan the set must be maximal, so full recovery between
slots is right — this is one of the few plans where long rest is clearly
justified rather than defaulted.

**Sessions are short.** Day I ≈ 19 min rest + 5 min work ≈ **25 min**. Days II
and III similar. The austerity claim is honest.

**No supersets, correctly.** Pairing would compromise the single maximal set.

**One duplicate slot:** `cable-triceps-extension` appears on Days II and III,
and `hammer-curl` on Days I and III. The plan's own comment says *"every slot
is one set, so the plan still covers the body twice a week without ever running
three sets of anything"* — but arms get three weekly exposures while abs get
zero.

---

## 6. The scientific problem with the premise

Blackout's design rests on a claim the evidence does not support in the form
the plan implements it.

**Single-set training is inferior to multi-set for hypertrophy.** Krieger's 2010
meta-analysis found multiple sets produce roughly 40% greater effect sizes;
Schoenfeld, Ogborn & Krieger (2017) established a dose–response relationship
where weekly set count predicts growth. At 2–4 direct sets per muscle per week,
Blackout sits at or below the volume associated with *maintenance*.

**Single sets can still work — but only taken to or very near failure.**
Low-volume protocols produce meaningful hypertrophy specifically when
proximity to failure is high (Lasevicius et al. 2022; Fisher & Steele's HIT
literature). Effort is the compensating variable when volume is minimal.

**And this is where Blackout contradicts itself.** The `FAILURE_APPROVED` list
permits failure on 11 isolation and machine movements, but forbids it on hack
squat, RDL, paused bench, incline press, split squat, shoulder press and
row — *the movements carrying the most muscle mass*. Those slots read *"Stop at
the target. This slot is not approved for failure."*

So the plan's highest-value sets are single sets, explicitly not taken to
failure, with **no RIR or RPE captured** to verify they were close to it. That
is the lowest-stimulus configuration available: minimum volume *and*
unverified, capped effort.

The restriction is defensible on safety grounds — failure on a loaded RDL is a
genuinely bad idea. But the correct expression is *"leave 0–1 reps in
reserve"*, captured and tracked, not *"stop at the target"*, which an athlete
reads as "stop at rep 8 regardless of how easy it was." The RIR capture that
would resolve this is precisely the feature that was written and never wired
(§1).

---

## 7. Findings

### 7.1 The plan's identity is unreachable · **severity: critical**

See §1. Two of four advertised features do not execute. This is a
mis-description of the product at the point of sale, not merely an
implementation gap.

### 7.2 Eight weeks, one change · **severity: high**

Identical tree weeks 1–8; only an RPE stamp in weeks 7–8. Identical pattern to
The Minimum, suggesting a portfolio-wide issue rather than a per-plan one.

### 7.3 Zero core, zero upper glute · **severity: high**

No direct trunk work anywhere in 22 sets, while arms receive three weekly
exposures via duplicated curl and triceps slots.

### 7.4 "+ ADD SET" contradicts the premise · **severity: medium**

Every slot renders a `+ ADD SET` control with the generic copy *"Extra sets are
yours to add — the plan doesn't expect them."* On a plan whose entire thesis is
that adding a set changes what the plan **is** — and whose source comments say
exactly that — this affordance is the one thing the UI should suppress or
challenge. The plan file guards against it in `preprocessDay`; the UI hands it
back.

### 7.5 Failure list mismatches the metadata · **severity: medium**

`FAILURE_APPROVED` includes `hammer-pulldown` and `hammer-chest-press` but the
latter appears in no Blackout session. Meanwhile `lat-pulldown` (Day III) is
*not* approved though `hammer-pulldown` (Day II) is — two near-identical
vertical pulls with opposite failure permissions and no stated reason.

### 7.6 UI defects

Shared with The Minimum: hero card misreports week/phase, session lost on
reload, plan cards not keyboard-accessible, nav controls unlabeled, live LOAD
field renders empty, `"1 sets × 5-8"` grammar, `program_status` still declared
in `ui.dashboardWidgets`.

Blackout-specific:

| Finding | Severity | Detail |
|---|---|---|
| No telemetry inputs | **Critical** | Live-set panel is Load / reps / Log set only |
| Failure notes render before the exercise cue | Low | *"Stop at the target…"* precedes the technique tip, so the safety instruction reads as the primary cue |
| Nav item renders as "Recimias" | Low | Appears to be a mis-rendered or untranslated label in the nav rail |

Confirmed working: one-set enforcement, failure-approval notes, phase labels,
240s/150s rest differentiation, bilingual tips, 3-day schedule selection.

---

## 8. Improvements, ranked

### 1. Wire the runtime, or stop advertising it

Nothing else matters until this is fixed. Two honest options:

**(a) Implement it.** Add Blackout to `WorkoutView`'s telemetry gate so quality
and completion reason are captured on every set; call `earnedBackoff()` after
the primary set logs and surface the offer; persist to the
`earnedBackoffs` field that already exists; drive `advanceStall` from the
progression handler. The logic is written, tested and correct — it needs
roughly the wiring that Oracle already has.

**(b) Withdraw the claims.** Remove the two dead bullets from the plan card and
delete the unreachable code.

(a) is strongly preferable: the earned back-off is the most interesting idea in
the portfolio and directly solves §6 — a clean set at good recovery earns
volume, a poor one does not. That is autoregulation done properly.

**Add a wiring test.** `verify:blackout` passes with 36 assertions while the
feature is entirely dead. Every plan with a dedicated feature module needs one
assertion that the application actually calls it.

### 2. Capture RIR and make the effort target explicit

Directly fixes the scientific contradiction in §6. Replace *"Stop at the
target. This slot is not approved for failure"* with *"Leave 1 rep in reserve.
This slot is not approved for failure"*, and capture RIR on every set. On a
one-set plan, proximity to failure is the entire stimulus variable and it is
currently neither prescribed numerically nor recorded.

### 3. Add core, and stop triple-dosing arms

`cable-triceps-extension` and `hammer-curl` each appear twice across the week,
giving arms three exposures while the trunk gets none. Swap the Day III
duplicates:

| Change | Effect |
|---|---|
| Day III slot 6 (`hammer-curl`) → **`ab-wheel`** | Abs 0 → 1.0/1.0, abdominal wall 0.25 → 1.25 |
| Day III slot 7 (`cable-triceps-extension`) → **`hanging-leg-raise`** | Abs lower → 2.0, obliques → 0.5 |

Arms still receive two weekly exposures each, which matches every other muscle
in the plan. Both replacements are already in the library and in use elsewhere.

### 4. Give the eight weeks a progression vector

Same fix as The Minimum, adapted to a plan that cannot add sets:

| Phase | Weeks | Proposal |
|---|---|---|
| Adjustment | 1–2 | RIR 2. Calibrate the single set |
| Blackout | 3–6 | RIR 1, then RIR 0 on failure-approved slots from week 5 |
| Deep | 7–8 | RPE 10 on primaries as today, **plus** the earned back-off unlocked |
| — | 8 | End on a re-test of the two primaries, not a silent stop |

This uses effort and earned volume rather than prescribed volume, which keeps
the plan's identity intact — and it only works once §1 is wired.

### 5. Add one short-position glute movement

Glute max upper is 0. All glute work is long-length (RDL, split squat).
Swapping Day II's `leg-press` for a hip thrust would cost nothing and cover the
gap, though it also removes a quad slot — alternatively add the hip thrust in
place of Day II's duplicated `cable-triceps-extension` if §3 is taken
differently. Both hip thrust variants are already used by other plans.

### 6. Suppress or challenge "+ ADD SET"

On this plan the control should either be hidden or replaced with a
confirmation that states the cost: *"Blackout is one work set. Adding a second
changes the plan — the stall ladder exists for this."* The copy already exists
in `BLACKOUT_STALL_LADDER`.

### 7. Reconcile the failure-approval list

`lat-pulldown` and `hammer-pulldown` are both machine vertical pulls with
near-identical risk profiles and opposite permissions. Either approve both or
neither, and remove `hammer-chest-press` which no Blackout session uses.

---

## 9. Verdict

**The concept is the best in the portfolio. The implementation is the most
broken.**

The idea — one maximal work set, back-off volume *earned* through demonstrated
set quality and recovery, and a stall ladder that asks about recovery before it
reaches for more volume — is genuinely sophisticated. It is a better-reasoned
approach to autoregulation than anything else in the app, and the code in
`singleSet.ts` is clean, well-commented and correct.

None of it runs. The athlete gets a static 22-set plan with generic double
progression, and a plan card that promises two features which cannot execute.
That gap between claim and behaviour is the single most serious finding of this
audit so far.

Judged on what actually ships: at 2–4 fractional sets per muscle per week, with
single sets explicitly not taken to failure on every major compound and no
effort metric captured, Blackout delivers **less stimulus than the evidence
suggests is needed for growth in a trained lifter** — which is precisely the
audience it declares. It would maintain muscle. It would not build it. For an
advanced athlete on a deliberate maintenance block, or someone returning from a
lay-off with severely limited time, it is a reasonable choice. As the "advanced"
plan it presents itself as, it is under-dosed.

Wire §1, add RIR capture per §2, and give the trunk 2 of the 22 sets, and this
becomes something genuinely novel — a minimum-effective-dose plan that earns
its volume instead of prescribing it. The distance between where it is and
where it should be is mostly integration work, not design work, because the
design is already right.

---

## 10. Export block

```yaml
id: blackout
version: 2
weeks: 8
sessions_per_week: 3
weekly_sets: 22
sets_per_slot: 1
session_minutes: 27
kind: general
audience: advanced
progression: { type: double, increment_kg: 2.5, handler: generic }
deload_weeks: []
phases:
  - { name: Adjustment, weeks: [1,2] }
  - { name: Blackout,   weeks: [3,4,5,6] }
  - { name: Deep,       weeks: [7,8], rpe: 10, applies_to: primary }
systemic_load: { day_i: 12, day_ii: 9, day_iii: 10, weekly: 31 }
volume_top:   { vastusLateralis: 4.0, frontDelt: 3.0, bicepsFemoris: 3.0 }
volume_zero:  [absUpper, absLower, obliques, gluteMaxUpper, forearmExtensors, tibialisAnterior, tfl]
dead_features: [earnedBackoff, advanceStall, nextExposureAdvice, isEvaluable]
audit: { date: 2026-08-14, findings: 9, verdict: "best concept, most broken implementation; identity is dead code" }
```
