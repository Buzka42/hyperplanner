# Pain & Glory

> Unified plan document, v2 format. Supersedes `docs/plans/pain-and-glory.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures from
> each movement's `intelligence` block, resolved by display name (this plan
> stores no `exerciseId`).
>
> **§8 live clickthrough is incomplete** — the `test_pain` account is already
> claimed by another session. See §8.0.

| | |
|---|---|
| **id** | `pain-and-glory` |
| **Length** | 16 weeks |
| **Frequency** | 4 sessions / week (Pull · Push · Push · Pull) |
| **Weekly sets** | 74 → 70 → 62 → 60 across the cycle |
| **Declared kind** | `powerlifting` (exempt from frequency floors) |
| **Calibration** | Conventional Deadlift 1RM + Low Bar Squat 1RM, at onboarding |
| **Progression** | Dedicated handler, **wired** |
| **Source** | `src/data/painglory.ts` (493 lines) · `src/features/workout/progression/painGlory.ts` |
| **Stated promise** | *"Pain today, glory tomorrow. Focus: Heavy Deadlifting. 16 Week Program with Peaking. Self-regulating via RPE feedback."* |

---

## 1. Structure

Only **two unique sessions**, each run twice a week.

### Pull day (Mon + Fri) — 22 sets

| # | Movement | Sets × reps | Load |
|---|---|---|---|
| 1 | Deficit Snatch Grip Deadlift | **10 × 6** | 45% 1RM |
| 2 | Close Neutral Grip Lat Pulldown | 4 × 6–10 | — |
| 3 | Slow Eccentric Cheat Nordic Curls | 2 × 4–8 | — |
| 4 | Single-Leg Machine Hip Thrust | 2 × 8–12 | — |
| 5 | Dead Hang | 2 × 20–40s | — |
| 6 | Planks | 2 × 20–40s | — |

### Push day (Tue + Thu) — 15 sets

| # | Movement | Sets × reps | Load |
|---|---|---|---|
| 1 | Paused Low Bar Squat | 4 × 4–6 | 70% 1RM |
| 2 | Leg Extensions | 2 × 6–10 | — |
| 3 | Hack Squat Calf Raises | 2 × 15–20 | — |
| 4 | Incline DB Bench Press | 4 × 6–10 | — |
| 5 | Standing Military Press | 3 × 6–10 | — |

### Block structure — real periodisation

Unlike The Minimum and Blackout, **this plan genuinely changes over time.**
Six distinct week shapes:

| Weeks | Sets | Pull-day primary | Purpose |
|---|---|---|---|
| 1–8 | 74 | Deficit Snatch Grip DL 10×6 @ 45% | Accumulation |
| 9–12 | 70 | **Conventional DL E2MOM 6×3–5** | Intensification |
| 13 | 62 | **Conventional DL AMRAP + 3×5 back-down** | Test |
| 14–15 | 62 | Peaking singles | Peak |
| 16 | 60 | — | Realisation |

This is a properly constructed powerlifting cycle: high-volume submaximal
technique work → density work → test → peak. It is the best-periodised plan
audited so far, by a wide margin.

---

## 2. Wiring — this one works

Full end-to-end trace, in deliberate contrast to Blackout:

| Component | Status |
|---|---|
| `painGloryProgression` | ✅ Registered in `progression/index.ts:34` |
| Squat +2.5 kg/session, weeks 1–8 | ✅ Writes `painGloryStatus.squatProgress` |
| Week-8 squat weight capture | ✅ Writes `week8SquatWeight` |
| E2MOM +2.5 kg on 6×5 | ✅ Writes `e2momWeightAdjustment` |
| Week-13 AMRAP → Epley e1RM | ✅ Writes `estimatedE1RM`, floored to 2.5 kg |
| Deficit RPE feedback modal | ✅ `openDeficitFeedback` effect handled in `WorkoutView:784` |
| Deficit autoregulation ±5 kg | ✅ Modal writes `deficitSnatchGripWeight` |
| Onboarding seeds deficit weight | ✅ `Onboarding.tsx:358` |
| `calculateWeight` reads it back | ✅ `painglory.ts:409` |

The Epley estimate is deliberately **floored** rather than rounded, with the
comment *"rounding up would build the peak on a number the athlete never
actually lifted."* That is exactly right and the kind of care the rest of the
portfolio should copy.

### One wiring gap

`handlePainGlorySubmit` computes `initialDeficitWeight` and passes it correctly
on the `updateUserProfile` path — but on the **`registerUser` path** (a brand
new athlete, which is the normal case) it calls:

```
registerUser(codeword, painGloryStats, PAIN_GLORY_CONFIG.id, selectedDays, {})
```

The 5th parameter is `exercisePreferences`, not `extra`. **`painGloryStatus` is
never persisted at registration.** `calculateWeight` then falls back to
`Math.floor((base1RM * 0.45) / 2.5) * 2.5`, which happens to equal the intended
seed — so the bug is invisible until the athlete's first RPE feedback, which
writes the field for the first time. Harmless today, but it is a latent
mis-call that will bite if the seed formula ever changes.

---

## 3. Weekly fractional volume (weeks 1–8)

### Raw fractional sets

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| **Glute max (lower)** | **32.0**† | | **Biceps femoris** | **30.0**† |
| **Erectors** | **26.5** | | **Semimemb/tendinosus** | **26.0**† |
| **Forearm flexors** | **24.0** | | **Trap mid** | **20.0** |
| Front delt | 14.0 | | Trap upper | 13.0 |
| Rhomboids | 12.0 | | Vastus lat/med/int | 12.0 each |
| Pec upper | 9.5† | | Glute max (upper) | 8.0 |
| Abdominal wall | 8.0 | | Lats (lower) | 8.0† |
| Teres major | 8.0 | | Triceps lat/med | 7.0 |
| Lats (upper) | 5.0 | | Triceps long | 5.0 |
| Gastrocnemius | 5.0 | | Adductors | 4.0 |
| Rectus femoris | 4.0 | | Biceps long | 4.0 |
| Brachialis | 4.0 | | Pec lower | 4.0 |
| Side delt | 3.0 | | Obliques | 3.0 |
| Serratus | 3.0 | | Glute medius | 2.0 |
| Abs (upper) | 2.0 | | Soleus | 2.0 |

**Zero:** rear delt · infraspinatus · trap lower · **biceps short** ·
**brachioradialis** · forearm extensors · abs lower · tibialis anterior · TFL

### The effective-volume correction

**Raw fractional sets overstate this plan badly, and the map needs a caveat
here that the previous two plans did not require.**

Twenty of the 74 weekly sets are Deficit Snatch Grip Deadlift at **45% 1RM for
6 reps**. At 45%, a 6-rep set sits somewhere around RIR 15+. It is skill,
positional and connective-tissue work — it is not a hypertrophic stimulus, and
counting it as 20 hard sets is wrong.

Applying an effort weighting (sets below ~60% 1RM count at ~0.2):

| Muscle | Raw | **Effective** |
|---|---|---|
| Glute max (lower) | 32.0 | **16.0** |
| Biceps femoris | 30.0 | **14.0** |
| Erectors | 26.5 | **10.5** |
| Semimemb/tendinosus | 26.0 | **10.0** |
| Forearm flexors | 24.0 | **8.0** |
| Trap mid | 20.0 | **4.0** |

That is a defensible posterior-chain dose. The raw figure is not.

**Methodological note for the remaining audits:** the fractional-set model
assumes sets taken near failure. Any plan prescribing percentage-based
submaximal work needs this second column, and I will carry it forward.

---

## 4. Systemic and joint load

| Metric | Pull day | Push day | **Week (1–8)** | Week 9–12 | Week 13+ |
|---|---|---|---|---|---|
| Systemic | 42 | 30 | **144** | 132 | 108 |
| Axial | 30 | 18 | **96** | 84 | 60 |
| Lower back | 30 | 8 | **76** | 64 | 40 |
| Per-set systemic | 1.91 | 2.00 | **1.95** | 1.89 | 1.74 |

For scale against the plans audited so far:

| Plan | Weekly sets | Weekly systemic | Weekly lower-back |
|---|---|---|---|
| Blackout | 22 | 31 | 3 |
| The Minimum | 29 | 44 | 8 |
| **Pain & Glory** | **74** | **144** | **76** |

**Lower-back load is 9.5× The Minimum's and 25× Blackout's.** Every pull day
carries 30 points of lumbar cost, twice a week, for eight consecutive weeks
with no deload. The axial figure (96/week) is the highest the audit has seen.

### Weekly CNS curve

```
W1-8   ████████████████████████ 144   ← eight weeks, no deload
W9-12  ██████████████████████ 132
W13    ██████████████████ 108         ← AMRAP test
W14-15 ██████████████████ 108         ← peak
W16    █████████████████ ~104
```

The curve descends correctly into the peak — that is proper taper design. The
problem is the entry: **eight identical weeks at the highest systemic load in
the portfolio, with zero deload weeks.** The plan card advertises "16 Week
Program with Peaking" and delivers the peaking; it does not deliver recovery.

---

## 5. Session flow

**Pull day is 10 sets of deadlift variant before anything else.** At 45% this
is tolerable, but it is 30 points of lumbar cost concentrated in the opening
block, and everything after it (lat pulldown, nordics, hip thrust, dead hang,
planks) is performed on a pre-fatigued trunk. The nordic curls in particular —
slow eccentric, hamstrings already loaded by 10 sets of hinging — are being
asked for their hardest quality at their worst moment.

**Push day is well built.** Squat → leg extension → calves → incline press →
military press descends cleanly and separates lower from upper.

**Push day and pull day are each duplicated verbatim.** Mon = Fri, Tue = Thu.
This is a legitimate powerlifting choice (frequency on the competition pattern)
but it is the opposite of The Minimum's design, where the second weekly
exposure deliberately uses different movements. Neither approach is wrong; the
portfolio should be deliberate about which it uses and why.

**No supersets.** Correct for a strength plan at this axial load.

**Time:** pull day ≈ 22 sets at 120–180s rest ≈ 55–65 min. Push day ≈ 45 min.

---

## 6. Findings

### 6.1 Eight weeks at peak systemic load with no deload · **severity: high**

144 systemic units and 76 lumbar units per week, repeated eight times. Standard
periodisation practice inserts a deload every 3–6 weeks under this kind of
axial loading; the plan runs eight and then adds four more at 132 before its
first reduction. Week 13's test arrives after twelve unbroken weeks.

### 6.2 Rear delt, external rotators and lower traps are zero · **severity: high**

The plan performs 8 sets of incline press and 6 of military press per week —
14 sets of pressing — against **zero** rear delt, **zero** infraspinatus and
**zero** lower trap. The only upper-back work is 8 sets of pulldown plus
incidental trap-mid from deadlifting.

For a plan whose entire premise is heavy deadlifting *and* which presses 14
times a week, this is the classic shoulder-health omission. It is also
trivially fixable: the library holds twelve rear-delt movements, of which the
plan uses none.

### 6.3 No direct biceps at all · **severity: medium**

`bicepsShort` 0, `brachioradialis` 0. All elbow flexion is incidental to
pulldowns (0.5 long head). On a 16-week plan with 20 weekly sets of heavy
grip-intensive pulling, the biceps are load-bearing and untrained — a known
tear risk in deadlift-heavy programming.

### 6.4 Legacy free-text identity · **severity: medium**

Every exercise carries `exerciseId: undefined`; the plan joins on display name.
This works — the progression handler matches on `ex.name` and the resolver
handles the library lookup — but it means:

- `workingLoads[planId][exerciseId]` cannot key this plan
- a display-name change silently severs progression
- the exercise-swap system cannot target these slots
- my volume analysis had to resolve by name and alias

`Conventional Deadlift (E2MOM)`, `(AMRAP)` and `(Back-down)` are *three
separate names for one lift*, matched by string. That is the fragile core of an
otherwise well-built handler.

### 6.5 Day names are raw translation keys in the data · **severity: low**

`dayName` is literally `t:dayNames.pullDay`. This is handled — `useTranslation`
and `Dashboard` both strip the `t:` prefix — but it means the raw key leaks
into any consumer that forgets to, and two call sites already special-case it.

### 6.6 The keyword-already-claimed failure mode · **severity: medium**

Discovered while attempting the clickthrough, and **not specific to this plan**:

When a codeword's user document exists but is owned by a different auth uid,
`registerUser` swallows the `permission-denied` on the profile read
(`UserContext.tsx:~305`), treats the athlete as brand new, walks them through
the *entire* onboarding — plan choice, schedule, 1RM calibration — and only
then fails, with a raw Firebase message surfaced through `alert()`.

The check should happen at codeword entry, with copy explaining the keyword is
in use on another device.

---

## 7. Improvements, ranked

### 1. Insert deloads into weeks 1–12

The single most important change. At 144 systemic and 76 lumbar units per week,
eight unbroken weeks is beyond what the evidence supports for sustainable
axial loading. Proposal:

| Weeks | Change |
|---|---|
| 1–3 | As now |
| **4** | **Deload: deficit sets 10 → 5, load held at 45%** |
| 5–7 | As now |
| **8** | **Deload: as week 4** (keep the week-8 squat capture, which the handler already depends on) |
| 9–12 | E2MOM as now |
| **12** | **Deload before the week-13 test** — currently the AMRAP arrives on twelve weeks of accumulated fatigue, which will understate the e1RM that seeds the entire peak |

Week 12 matters most: the whole peaking block is built on the week-13 AMRAP
estimate, and testing a max on unrecovered lumbar tissue produces a low
estimate that then suppresses every peaking weight.

### 2. Add rear delt and external rotation — 4 sets/week, zero new exercises

Fourteen weekly pressing sets against zero rear delt is the plan's clearest
health gap. Push day has room:

| Change | Effect |
|---|---|
| Push day: add **`single-arm-reverse-pec-deck` 2 × 12–15** | Rear delt 0 → 4.0/week (2 sets × 2 days) |
| Push day: add **`single-arm-external-rotation` 1 × 12–20** | Infraspinatus 0 → 2.0/week |

Both are already in the library and used elsewhere. Cost: +3 sets on a 15-set
day, ~6 minutes. Push day is the shortest session in the plan and can absorb it.

### 3. Add direct elbow flexion

`bicepsShort` and `brachioradialis` are zero across 16 weeks while the athlete
performs 20 weekly sets of heavy grip-dependent pulling. Two sets of hammer
curl or reverse curl on push day covers brachialis, brachioradialis and the
short head — and reverse curl is the library's only forearm-extensor loader,
which is also zero here.

### 4. Give the plan real exercise ids

Migrate `painglory.ts` from free-text names to `exerciseId`, keeping the
display names as aliases. This is the precondition for the swap system, for
`workingLoads` persistence, and for the progression handler to stop matching on
strings like `"Conventional Deadlift (E2MOM)"`. It also removes the risk that a
copy edit silently breaks progression.

The handler should key on a stable slot role (`primary-deadlift`) rather than
on the exercise's display name, so the E2MOM/AMRAP/back-down variants resolve
to one tracked lift.

### 5. Reorder pull day, or split the deficit volume

Ten sets of hinging before slow-eccentric nordic curls asks the hamstrings for
their most demanding quality when they are least able to give it. Two options:

- Move nordics **before** the deficit work (they are low-load and act as
  potentiation/warm-up), or
- Interleave: 5 deficit sets → pulldowns → 5 deficit sets → accessories, which
  also breaks up 30 points of continuous lumbar loading.

### 6. Fix the `registerUser` argument mis-call

`handlePainGlorySubmit` passes `painGloryStatus` data into the
`exercisePreferences` slot. Currently masked by a fallback that computes the
same number; it should pass `{ painGloryStatus: {...} }` as the `extra`
parameter.

### 7. Handle claimed keywords at entry

Detect the owned-by-another-uid case at codeword entry and say so, rather than
walking the athlete through full onboarding and failing with a raw Firebase
error. Affects every plan.

---

## 8. UI / clickthrough

### 8.0 Incomplete — blocked

`test_pain` resolves to an existing user document owned by
`W17SGTVR9udvr9PbC6kS9Q7Gwl32` (the same uid that created the access key — your
session). My browser's anonymous uid cannot write it, so onboarding fails at
submit with `permission-denied`.

**To complete this section I need a keyword that has not been claimed yet.**
The code-level audit above is unaffected.

### 8.1 Observed before the block

| Finding | Severity | Detail |
|---|---|---|
| Onboarding UI is inconsistent across plans | Medium | Pain & Glory uses the legacy "select exactly 4 days" checkbox picker. The Minimum and Blackout use the newer schedule-mode UI with fixed/rolling options and suggested splits. Two different onboarding experiences ship side by side |
| Calibration copy is good | — | *"Your true max, not an estimate"* / *"Competition depth, full ROM"* — clear and honest |
| Submit disabled with no explanation | Low | "FORGE MY DESTINY" is disabled until both 1RMs are valid, with no message saying why |
| Registration failure surfaces raw Firebase text | Medium | `alert("Failed to build program: " + err.message)` |

Shared defects confirmed on the two prior plans (hero card misreports week,
session lost on reload, plan cards not keyboard-reachable, unlabeled nav) are
assumed to apply and will be reported once in the final compilation.

---

## 9. Verdict

**The best-engineered plan audited so far, and the one most likely to injure
someone.**

Its periodisation is real: eight weeks of submaximal technique volume, four of
density work, a tested max, then a peak built on that number — with the e1RM
deliberately floored so the peak is never built on a lift the athlete did not
make. The progression handler is wired end to end, the deficit autoregulation
genuinely self-regulates from athlete feedback, and the calibration copy is
honest. After Blackout, where nothing ran, this is a relief.

The design intent is also sound. Ten sets of six at 45% on a snatch-grip
deficit deadlift is not hypertrophy work and is not meant to be — it is
positional practice under load, and 45% is the right number for it. The
effective-volume correction in §3 shows the posterior chain lands around 10–16
effective sets a week, which is a defensible dose for a deadlift specialist.

What it gets wrong is recovery and the shoulder.

**Eight consecutive weeks at 144 systemic and 76 lumbar units with no deload**
is the highest sustained axial load in the portfolio, and the first reduction
comes at week 13 — by which point the AMRAP that seeds the entire peaking block
is being tested on twelve weeks of accumulated fatigue. That single decision
undermines the peak the plan is named for.

**Fourteen weekly pressing sets against zero rear delt, zero external rotation
and zero lower trap** is the other half. For a plan that also performs 20
weekly sets of heavy grip-intensive pulling with no direct elbow flexion, the
omissions cluster exactly where deadlift-heavy programs are known to break
down.

Both are cheap to fix. Three deload weeks and five accessory sets — none of
which requires a new library entry — would turn this from a well-engineered
plan with a recovery problem into the strongest plan in the portfolio.

---

## 10. Export block

```yaml
id: pain-and-glory
version: 2
weeks: 16
sessions_per_week: 4
weekly_sets: { w1_8: 74, w9_12: 70, w13_15: 62, w16: 60 }
unique_sessions: 2   # each run twice weekly
kind: powerlifting
calibration: [conventionalDeadlift1RM, lowBarSquat1RM]
progression: { handler: painGloryProgression, wired: true }
deload_weeks: []
blocks:
  - { weeks: [1,8],   primary: "Deficit Snatch Grip DL 10x6 @45%", purpose: accumulation }
  - { weeks: [9,12],  primary: "Conventional DL E2MOM 6x3-5",      purpose: intensification }
  - { weeks: [13],    primary: "Conventional DL AMRAP + 3x5",      purpose: test }
  - { weeks: [14,15], primary: "peaking singles",                  purpose: peak }
  - { weeks: [16],    primary: "realisation",                      purpose: realisation }
systemic_load: { pull_day: 42, push_day: 30, weekly: 144, lower_back_weekly: 76 }
volume_raw:       { gluteMaxLower: 32.0, bicepsFemoris: 30.0, erectors: 26.5 }
volume_effective: { gluteMaxLower: 16.0, bicepsFemoris: 14.0, erectors: 10.5 }
volume_zero:  [rearDelt, infraspinatus, trapLower, bicepsShort, brachioradialis, forearmExtensors, absLower, tibialisAnterior, tfl]
legacy: { free_text_names: true, exercise_ids: false }
audit: { date: 2026-08-14, findings: 6, clickthrough: blocked, verdict: "best periodisation, no deloads, shoulder omissions" }
```
