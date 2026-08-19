# Kali

> Unified plan document, v2 format. Supersedes `docs/plans/kali.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> computed programmatically from each movement's `intelligence` block via a
> throwaway `tsx` script (deleted after use). Wiring verified via direct
> source trace of `src/data/plans/kali.ts`, `src/features/kali/KaliDashboard.tsx`,
> `src/pages/WorkoutView.tsx`, `src/pages/Dashboard.tsx`, and
> `src/features/workout/progression/genericDouble.ts`. The original audit
> session's live browser pass was blocked entirely by a `test_claude`
> device-lock error; that error has since been root-caused (a stale
> `ownerUid` field on the `test_claude` user doc, pinning it to an old
> anonymous-auth session) and fixed, confirmed by House of Iron's clean
> login and by a full retro-verification session on 2026-08-15. **All
> headline findings below (T-23, T-9 immunity, and the
> `performanceProfile`/`isTestAccount` question) are now live-confirmed** —
> see the "Retro-verification" notes inline. One finding changed materially
> on live testing: §1c's claim that `performanceProfile` is structurally
> untestable via `test_claude` was a misread — the `test_claude` access key
> has `testAccount: false`, so `isTestAccount` is never set on this account,
> and the feature is fully testable live (and was tested). Improvements
> tagged `hypothesis` / `shared-bug` / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `kali` |
| **Length** | 8 weeks (Severance 1-2, Preservation 3-5, Unleashed I 6, Unleashed II 7, Unleashed III 8) |
| **Frequency** | Fixed 4 days/week (schedule day-of-week selectable, session count is not) |
| **Weekly sets** | 59 (15 + 14 + 15 + 15) |
| **Declared kind** | cutting / strength-retention |
| **Calibration** | none (`onboarding.requireBodyweight: true` instead) |
| **Source** | `src/data/plans/kali.ts` (42 lines) + `src/features/kali/KaliDashboard.tsx` (dedicated dashboard) |
| **Stated promise** | *"An 8-week cutting plan that protects strength while controlling systemic fatigue."* Features: fixed four-day structure, one systemic anchor per session, glute and lat intensification, performance-retention dashboard. |

---

## 1. Headline finding

**T-23 (total-system-weight never actually used in progression) reproduces a third time on Kali, and Kali's own onboarding makes the bug maximally visible: one of its three selectable "pull anchor" exercises (`weighted-pull-up`) is a genuine `weighted-bodyweight` lift, but the plan has no dedicated progression handler, so it falls through to `genericDoubleProgression`, which reads only `sets[0].weight` — the belt plate, never bodyweight+plate. Everything else on the card is unusually honest: the "one systemic anchor per session" claim is real and correctly flagged in the source, and Kali is a genuine, verified-by-source third T-9-immune plan via the same dedicated-dashboard mechanism as Athena and Venus Rising.**

### 1a. T-23 reproduces a third time — and Kali's UI actively steers into it — now live-confirmed

`KALI_PULL_ANCHORS` (`src/features/planSelections/options.ts:7-11`) offers three
Hunt-day pull options: `assisted-pull-up` (`weightMode: 'bodyweight'`),
`weighted-pull-up` (`weightMode: 'weighted-bodyweight'`), and `lat-pulldown`
(`weightMode: 'external'`, not bodyweight-relevant). Kali is absent from
`PROGRESSION_HANDLERS` (`src/features/workout/progression/index.ts:29-45`),
so it falls through to `genericDoubleProgression`
(`src/features/workout/progression/genericDouble.ts:18-57`), which computes
`current = parseFloat(sets[0]?.weight || '0')` and never reads
`totalSystemWeightKg` anywhere in the function — an identical mechanism to
Workhorse's and Gravity Is Optional's confirmed T-23. `WorkoutView.tsx:840-844`
does correctly *compute* `totalSystemWeightKg = bodyweight + external` for
Kali specifically (it's in the plan-id allowlist alongside Workhorse and
Gravity Is Optional) and displays it in the set-row UI (`WorkoutView.tsx:1711`,
`"TSW {value}kg"`) — so an athlete doing weighted pull-ups sees an honest TSW
number on screen, and the progression engine silently ignores it the moment
the set is logged.

**Retro-verification (2026-08-15):** live-reproduced exactly as predicted.
`test_claude` was switched into Kali, `weighted-pull-up` selected as the
Hunt-day pull anchor during onboarding (confirmed via the radio button's
`aria-checked="true"` state), and a real Hunt-day set logged at 20kg × 5
reps. On session completion, direct Firestore read showed
`workingLoads.kali.weighted-pull-up: 20` — the belt-plate weight only, with
bodyweight never folded in, exactly as the source trace predicted. This is
the third and last of the three plans the audit status file flagged sharing
this gate, and the first of the three to have T-23 independently
reproduced live within this audit rather than only via source trace of an
identical code path.

### 1b. Third T-9-immune plan, same mechanism as Athena and Venus Rising — now live-confirmed

`Dashboard.tsx:209` early-returns `<KaliDashboard user={user}/>` **before**
line 211's `weekData = currentProgram.weeks.find(...)` — the point where the
shared, buggy `viewWeek`/`localStorage` state would otherwise be consumed.
`KaliDashboard.tsx:28-29` computes its own week directly:
`clampProgramWeek({ startDate: user.programProgress?.kali?.startDate ??
user.startDate, completedSessions: ..., sessionsPerWeek: 4, maxWeeks: 8 })`
— architecturally identical to Athena's (T-25) and Venus Rising's immunity
mechanism, never touching `dashboardViewWeek-${user.id}`. Third plan in a
row with a dedicated dashboard, third plan in a row structurally immune to
T-9.

**Retro-verification (2026-08-15):** independently live-reproduced.
`localStorage['dashboardViewWeek-test_claude']` was set to a stale `'7'`
(Kali only has 8 weeks, so this would have been a real Unleashed-III-week
mismatch) and the Dashboard tab reloaded — the header correctly read
**"KALI · WEEK 1"**, matching the account's true `programProgress.kali`
state and ignoring the poisoned key entirely.

### 1c. `performanceProfile` read path is genuinely wired — and IS testable live via `test_claude` (original claim was a misread)

Per the audit status file's carried-over research note, Kali's dashboard is
the one confirmed live consumer of the cross-plan `performanceProfile`
subcollection other plans write into. Confirmed by source: `KaliDashboard.tsx:36`
calls `getDocs(collection(db, 'users', user.id, 'performanceProfile'))`,
buckets each summary's `latestObservation.estimated1RMKg` into one of four
lift families (squat/hinge/push/pull, derived from `EXERCISE_BY_ID[id].pattern`),
takes the max per family, and renders `"{current/baseline * 100}%"` under
"Performance retained" — comparing against a one-time `kaliStatus.baseline`
snapshot captured the first time any data exists. This is real, wired
consumption, not a dead feature.

**Correction (2026-08-15 retro-verification):** the original session's claim
that this is "structurally untestable via `test_claude`" because
`WorkoutView.tsx:871-872` skips writing observations when
`user.isTestAccount === true` was checked against live state and against
the `isTestAccount`-setting code path
(`UserContext.tsx:352`, `...(access.testAccount === true && {
isTestAccount: true})` — only set at account-creation time, from the access
key's own `testAccount` flag) — and **the premise doesn't hold for this
account**. Direct Firestore reads of both `users/test_claude` (no
`isTestAccount` field present at all) and `accessKeys/test_claude`
(`testAccount: false`) confirm `test_claude` was never flagged as a Lab
Mode/test account by the admin who created the key, so `isTestAccount` is
never set true on this user doc, and `WorkoutView.tsx`'s skip condition
never fires for it. This was independently confirmed two ways: (1) the
account's `users/test_claude/performanceProfile/*` subcollection already
had 6 real documents from earlier sessions in this audit (House of Iron,
Workhorse) before this session touched Kali at all; (2) logging a live
Hunt-day weighted-pull-up set this session produced a genuine new
`performanceProfile/weighted-pull-up` document
(`estimated1RMKg: 23.3`, `externalLoadKg: 20`, `reps: 5`), and the
KaliDashboard's "Performance retained" widget rendered real, non-blank
percentages (SQUAT 100%, PUSH 100%, PULL 100%, HINGE —) driven by that
data and a freshly-captured `kaliStatus.baseline`. **The feature is fully
testable through the audit's standard account and was tested live this
session** — the original finding's severity-none/positive framing was
right, but its "untestable" caveat and the paired improvement (#3 below,
"give test_claude a way to populate performanceProfile") were building a
fix for a constraint that doesn't actually apply to this key. If the owner
wants a genuinely `isTestAccount: true` key tested against this gate in the
future, that would require a *different*, admin-flagged test keyword — not
`test_claude`.

### 1d. "One systemic compound anchor per session" — confirmed true

Every day has exactly one `systemicCompound: true` slot at 150s rest, all
others 75s: Earth → `hack-squat`, Hunt → `assisted-pull-up`, Death →
`romanian-deadlift`, Rebirth → `paused-bench-press`. All four are also the
day's first slot. This is a specific, checkable claim and it survives
verification cleanly — a contrast with several Wave 3/4 plans whose
signature mechanical claims didn't.

---

## 2. Structure

### Weekly template (Severance/Preservation phases, weeks 1-5, 59 sets)

| Day | Sets | Key work |
|---|---|---|
| I — Earth | 15 | Hack Squat 3 (anchor), FFE Bulgarian Split Squat 2, Seated Ham Curl 2, Hammer Pulldown 3, Lateral Raise 2, Hack Calf Raise 2, Cable Tricep Ext 1 |
| II — Hunt | 14 | Assisted/Weighted Pull-up 3 (anchor, swappable), Hammer Chest Press 2, Single-Leg Machine Hip Thrust 3, SA Hammer Row 2, Lateral Raise 2, Hammer Curl 1, Cable Tricep Ext 1 |
| III — Death | 15 | Romanian Deadlift 3 (anchor), Leg Extension 2, Lat Prayer 3, Machine Hip Abduction 3, SA Reverse Pec Deck 2, Ab Wheel 1, Hack Calf Raise 1 |
| IV — Rebirth | 15 | Paused Bench Press 3 (anchor), SA Hammer Row 3, Single-Leg Hip Thrust 3, Lat Pulldown 2, Lying Leg Curl 2, Lateral Raise 1, Hammer Curl 1 |

### Phases

| Phase | Weeks | Change |
|---|---|---|
| Severance | 1-2 | Base |
| Preservation | 3-5 | Base (identical to Severance in the source — phase exists for naming/UI only, no `transform`) |
| Unleashed I | 6 | `single-leg-machine-hip-thrust` + `hammer-pulldown` → rest-pause (2 bursts, 20s, last set) |
| Unleashed II | 7 | `machine-hip-abduction` + `lat-prayer` → myo-reps (12-20 activation, 3×4-5 mini-sets, 5 breaths) |
| Unleashed III | 8 | Clean week, unless the athlete's `week8Intensifier` preference repeats one of the two prior techniques on the same targets via `preprocessDay`'s `-w8-` day-id branch |

The glute/lat intensifiers land precisely on the plan's two highest-volume
non-anchor muscle groups (see §4) — the "glute and lat intensification"
card claim is not just true in name, it targets the actual volume leaders.

### `xStatus`, T-2, T-3, T-4, T-14, T-22, reverse-nordic

- **`kaliStatus`** (`bodyweightKg`, `aggressive`, `baseline: Partial<Record<Family, number>>`)
  is genuinely written by `KaliDashboard`'s save button and the auto-baseline
  effect — not a dead-status plan. **Missing from `resetProgram()`'s
  allowlist** (`UserContext.tsx:468-470` only covers `benchDominationStatus`/
  `pencilneckStatus`/`skeletonStatus`) — same T-2 gap as Athena's T-26, and
  with real consequence here too: `baseline` is a one-time snapshot that,
  once set, never re-captures (`if (!user.kaliStatus?.baseline && ...)`), so
  a "Reset Current Progress" that doesn't clear it leaves the "Performance
  retained" percentage comparing a fresh run's early numbers against a
  stale baseline from a previous run.
- **`planPreferences.kali`** (`exerciseSelections.pullAnchor`,
  `exerciseSelections.week8Intensifier`) is real, read by `preprocessDay`.
  `resetProgram()` never touches `planPreferences` for any plan (T-28,
  first found on Venus Rising) — reproduces here too: a reset leaves the
  athlete's pull-anchor choice and week-8 intensifier pinned from the prior
  run.
- **No `type: 'wave'`, no `technique` field outside the two Unleashed-week
  transforms** — not exposed to T-3/T-14.
- **No classic T-4 pattern.** `lateral-raise`, `hammer-curl`, and
  `cable-triceps-extension` each appear multiple times across days at
  different set counts (2/2/1 for lateral raise; 1/1 for the others), but
  every occurrence is an independent slot in `KALI_DAYS`, not a duplicated
  definition of the *same* slot patched inconsistently — no drift risk.
- **No `reverse-nordic-curl`** anywhere in either day tree — clean, as has
  now been true for every plan since Quadfather.
- **T-22 does not apply.** `ui.dashboardWidgets: ['program_status',
  'workout_history']` never requests `strength_chart`; `KaliDashboard`
  doesn't call `trackedLiftFor()` either. Worth recording as a clean
  absence — Kali's own bespoke performance-tracking mechanism
  (`performanceProfile`, §1c) makes the broken generic widget moot for this
  plan specifically, even though the underlying `liftHistory` bug (T-22)
  is unrelated and still unfixed.

### `preprocessDay` mechanics

Three independent hooks, all gated on `user` state rather than plan week
alone:
1. Hunt-day pull-slot swap (`planPreferences.kali.exerciseSelections.pullAnchor`,
   default `assisted-pull-up`) — resolves via `EXERCISE_BY_ID`, replaces
   index 0 of the Hunt exercise array.
2. Week-8 (`-w8-` day id) intensifier repeat, gated on
   `exerciseSelections.week8Intensifier` (`'myo' | 'rest-pause' | undefined`).
3. `kaliStatus.aggressive` deficit mode: drops the *last* exercise in the
   day's array with `sets <= 2`. Because `cable-triceps-extension` (Earth,
   Hunt) and `hack-calf-raise`/`hammer-curl` (Death, Rebirth) are always the
   final slot in their respective days and always ≤2 sets, this
   deterministically drops the same named exercise per day every time the
   toggle is on — not a rotating or athlete-chosen accessory, despite the
   UI copy ("drop 1 accessory per day") reading as if it might vary.

---

## 3. Findings

### 3.1 T-23 reproduces a third time, with a UI path that makes it maximally reachable · **severity: high, `shared-bug`, live-confirmed**

Detailed in §1a. Confirms the audit status file's prediction — Kali was
"the remaining unchecked plan" sharing the TSW gate with Workhorse and
Gravity Is Optional, and it does reproduce. Slightly worse than the other
two in one respect: Kali's onboarding actively offers the exact
`weighted-bodyweight` exercise (`weighted-pull-up`) that triggers the bug,
where Workhorse's and Gravity's exposure was to their plan's only
progressed lift, not one of three user-selectable options. Live-confirmed
2026-08-15: a logged 20kg×5 weighted-pull-up set produced
`workingLoads.kali.weighted-pull-up: 20`, the external plate weight only.

### 3.2 Third T-9-immune plan · **severity: none (positive finding, live-confirmed)**

Detailed in §1b. Live-confirmed 2026-08-15 via poisoned-localStorage test;
dashboard correctly showed "KALI · WEEK 1" regardless.

### 3.3 `performanceProfile` genuinely wired and testable through the standard test account · **severity: none (positive design finding), original "untestable" caveat corrected**

Detailed in §1c. The 2026-08-15 retro-verification session found the
original "structurally untestable via `test_claude`" claim didn't hold —
`test_claude`'s access key has `testAccount: false`, so `isTestAccount` is
never set on this user doc and the `WorkoutView.tsx` skip condition never
fires. The dashboard's "Performance retained" widget was observed live,
rendering real percentages off a genuinely fresh `performanceProfile` write
from this session's own Hunt-day set.

### 3.4 `kaliStatus` missing from `resetProgram()`'s allowlist, with real consequence · **severity: medium, `plan-local`**

Detailed in §2. Same T-2 family as Athena's T-26 — but where some T-2
findings hit inert status objects, `kaliStatus.baseline` actively drives
the dashboard's headline "Performance retained" number, so a stale
baseline after a reset produces a wrong percentage, not just an unreset
flag.

### 3.5 `planPreferences.kali` survives a reset (T-28 generalizes again) · **severity: low, `plan-local`**

A third plan (after Venus Rising) confirming `resetProgram()` never clears
`planPreferences` for any plan — Kali's pull-anchor and week-8-intensifier
choices persist across a reset.

### 3.6 "One systemic anchor per session" and phase/intensifier targeting both confirmed true · **severity: none (positive finding)**

Detailed in §1d and §2. Two independent, specific, checkable claims that
both survive source verification — an unusually clean record for this
point in the audit.

### 3.7 UI/UX

**Retro-verified live 2026-08-15.** Full onboarding was clicked through:
Training Schedule day-picker, the "Exercise choices" screen (pull-anchor
radio group matching `KALI_PULL_ANCHORS` exactly, week-8-intensifier
choice), the `KaliDashboard` (Performance retained widget, Run settings),
and a complete Hunt-day session (14 sets, "II — Hunt · Severance" header,
correct exercise list and set counts against the source table) through to
`COMPLETE WORKOUT`. No discrepancies found between the source trace and
the live rendering.

---

## 4. Weekly volume (59 sets/week, Severance/Preservation phase)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Teres major | 13.5 | | Lats (lower) | 13.0 |
| Glute max (lower) | 12.5 | | Lats (upper) | 9.5 |
| Hamstrings (biceps femoris) | 10.0 | | Glute max (upper) | 7.5 |
| Quads (3 heads, each) | 7.0 | | Glute medius | 7.0 |
| Hamstrings (semiMemb/Tend) | 7.0 | | Rhomboids | 7.5 |
| Biceps (long head) | 7.5 | | Forearm flexors | 6.5 |
| Side delt | 5.0 | | Pec (lower) | 5.0 |
| Brachialis | 6.0 | | Gastrocnemius | 4.0 |

All 21 distinct exercises resolved to attribution rows — no missing data,
no `reverse-nordic-curl` exposure.

### The card's "glute and lat intensification" claim, quantified

| Focus area | Combined dimensions | Weekly sets |
|---|---|---|
| Lats/upper-back pull | latsUpper + latsLower + teresMajor + rhomboids | **43.5** |
| Glutes | gluteMaxLower + gluteMaxUpper + gluteMedius | **27.0** |
| Quads | vastus×3 + rectusFemoris | **24.25** |
| Posterior chain (hamstrings) | bicepsFemoris + semiMembTend | **17.0** |

Lats and glutes are the two largest combined-volume groups in the plan,
ahead of quads and every individual delt/press dimension — the two muscle
groups the plan explicitly names for "intensification" in the final weeks
are, independently, already its two highest-volume groups at baseline. The
Unleashed-week technique upgrades (§2) land on real volume leaders, not an
arbitrary or under-trained pair.

---

## 5. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **77** |
| Axial | **15** |
| Lower back | **11** |
| Knee | **18** |
| Shoulder | **15** |
| Elbow | **24** |
| Sets | 59 |
| Per-set systemic | **1.31** |

Moderate-low systemic cost per set, in line with a cutting/fatigue-managed
plan built around one heavy compound anchor per day (all four
`systemicCompound`-flagged, 150s rest) surrounded by machine/dumbbell
accessory work at 75s rest. Elbow cost (24) is the single highest raw
total, driven by the high pulling-volume structure (rows, pulldowns,
pull-ups all load elbow flexion) rather than any dedicated elbow-flexion
excess — consistent with a back-dominant accessory split, not a red flag
on its own.

---

## 6. Improvements, ranked

### 1. Fix `genericDoubleProgression` to use `totalSystemWeightKg` when present · `shared-bug`

Third confirmed occurrence of T-23. The fix belongs in the shared engine
(`genericDoubleProgression`, or a small `weighted-bodyweight`-aware branch
in it) rather than per-plan, since it would simultaneously fix Workhorse,
Gravity Is Optional, and Kali. Kali is the strongest case yet for
prioritizing this fix, since its onboarding actively offers the exact
exercise (`weighted-pull-up`) that triggers it as a first-class menu
choice, not an edge case.

### 2. Add `kaliStatus` (and `planPreferences`, generally) to `resetProgram()`'s reach · `shared-bug`

`kaliStatus.baseline` actively drives a displayed percentage; leaving it
unreset produces a visibly wrong number, not just an inert flag. Bundle
with the T-28 `planPreferences` fix already logged from Venus Rising, since
Kali needs both fixed for a clean reset.

### 3. ~~Give the `test_claude`-class test account a way to populate `performanceProfile`~~ · superseded, 2026-08-15

**Correction:** this improvement was built on a misread. `test_claude`'s
access key has `testAccount: false`, so `isTestAccount` is never set on
this user doc, and `performanceProfile` writes were never actually blocked
for the account this audit uses — confirmed live 2026-08-15 (see §1c). The
underlying `isTestAccount`-gated skip in `WorkoutView.tsx:871-872` is real
and does exist for genuinely admin-flagged Lab Mode accounts, but it isn't
a constraint on this audit's testing capability. No action needed unless
the owner separately wants a *bona fide* `isTestAccount: true` keyword
tested against this gate, which would need a different keyword than
`test_claude`.

### 4. Make "aggressive deficit" actually rotate or let the athlete pick the dropped accessory · `plan-local`

Currently deterministic per day (§2) — always the same named exercise,
despite copy implying a general "drop 1 accessory" behavior. Not
inaccurate, exactly, but a more literal implementation of the stated
intent would either round-robin across sessions or let `kaliStatus`
record which slot to drop.

### 5. Un-differentiate or merge Severance/Preservation, or add a real distinction between them · `plan-local` (`hypothesis`)

The two phases are programmed identically in the source (no `transform` on
either) — two named phases spanning 5 of the plan's 8 weeks with zero
behavioral difference. Cosmetic today; either collapse them into one phase
name or use the boundary for an actual load/rep change (e.g. a small RPE
bump into Preservation) so the phase structure carries real information.

---

## 7. Verdict

**Kali is one of the more honestly-executed plans in the audit's Wave 4 —
its two most specific, checkable claims ("one systemic anchor per
session," "glute and lat intensification" landing on the actual volume
leaders) both survive verification, and it's a third confirmed
T-9-immune, dedicated-dashboard plan with a genuinely wired
cross-plan-consuming feature (`performanceProfile`) that no other
audited plan has been shown to actually read.**

Its real defect is entirely a shared one: T-23 reproduces for a third and
final time among the plans sharing the TSW gate, and Kali's own
onboarding — offering `weighted-pull-up` as a first-class pull-anchor
choice — makes the bug easier to trigger than on either prior plan. The
`resetProgram()` gaps (`kaliStatus`, `planPreferences`) are real but lower
stakes, matching a now-familiar pattern from Athena and Venus Rising. The
plan's core training design (one heavy compound per day, moderate-low
systemic cost, glute/lat volume genuinely dominant and correctly targeted
by the late-block intensifiers) is coherent and well-matched to a cutting
context.

**2026-08-15 retro-verification update:** the device lock that blocked the
original session's live pass has been root-caused (stale `ownerUid`,
cleared) and fixed. A full live pass this session reproduced every headline
finding exactly as the source trace predicted — T-23 (a real 20kg×5
weighted-pull-up set wrote `workingLoads.kali.weighted-pull-up: 20`, no
bodyweight folded in), T-9 immunity (poisoned-localStorage test held), and
onboarding/dashboard rendering all matched. One finding changed materially
on live testing rather than merely being confirmed: §1c's
"`performanceProfile` is structurally untestable via `test_claude`" claim
was a misread — the key's `testAccount` flag is `false`, `isTestAccount` is
never set on this account, and the feature was directly observed working
live, including a fresh write from this session's own logged set. Every
other finding in this doc holds unchanged.

---

## 8. Export block

```yaml
id: kali
version: 2
length: { weeks: 8, phases: [severance_1to2, preservation_3to5, unleashed_i_6, unleashed_ii_7, unleashed_iii_8] }
frequency: fixed_4day_selectable_calendar_days
weekly_sets: { severance_preservation: 59 }
kind: cutting_strength_retention
calibration: none
engine: definePlan_generic_dual_day_tree_dedicated_dashboard
systemic_load: { weekly: 77, axial: 15, lower_back: 11, knee: 18, shoulder: 15, elbow: 24, sets: 59, per_set: 1.31 }
volume_top: { teresMajor: 13.5, latsLower: 13.0, gluteMaxLower: 12.5, bicepsFemoris: 10.0 }
focus_area_totals: { lats_upper_back: 43.5, glutes: 27.0, quads: 24.25, hamstrings: 17.0 }
positive_findings:
  - "'one systemic compound anchor per session' confirmed true — all four day-lead slots flagged systemicCompound:true at 150s rest, everything else 75s"
  - "third confirmed T-9-immune plan via the same dedicated-dashboard mechanism as Athena (T-25) and Venus Rising — live-confirmed 2026-08-15 (poisoned localStorage viewWeek key, dashboard still showed correct week)"
  - "performanceProfile cross-plan read path genuinely wired on KaliDashboard (family-bucketed 1RM retention vs a locked baseline) — the first plan in the audit confirmed to actually consume this data; live-confirmed 2026-08-15 with a real fresh write and non-blank dashboard percentages, correcting the original session's 'untestable via test_claude' misread (the key's testAccount flag is false, so isTestAccount is never set on this account)"
  - "'glute and lat intensification' claim quantitatively correct — lats and glutes are the plan's two largest combined-volume groups, and the week 6/7 technique upgrades target exactly those muscles' exercises"
shared_bugs:
  - id: T-23
    detail: "third reproduction — Kali has no dedicated progression handler (absent from PROGRESSION_HANDLERS), falls through to genericDoubleProgression, which reads only sets[0].weight and never totalSystemWeightKg despite WorkoutView.tsx correctly computing and displaying TSW for Kali's weighted-pull-up option. Live-confirmed 2026-08-15: a logged 20kg x5 weighted-pull-up set wrote workingLoads.kali.weighted-pull-up: 20, external load only."
plan_local_bugs:
  - area: "resetProgram() allowlist"
    detail: "kaliStatus (bodyweightKg/aggressive/baseline) not covered; baseline in particular is a one-time snapshot that, left unreset, compares a fresh run against a stale prior-run baseline"
  - area: "resetProgram() vs planPreferences"
    detail: "T-28 generalizes a third time — planPreferences.kali (pullAnchor, week8Intensifier) survives a reset untouched"
  - area: "'aggressive deficit — drop 1 accessory per day' copy"
    detail: "deterministic per day (always the last ≤2-set slot in the array), not a rotating or athlete-chosen drop despite the implied variability"
verification_note: "original session's device lock was root-caused (stale ownerUid on the test_claude user doc) and fixed; a 2026-08-15 retro-verification session independently live-confirmed T-23, T-9 immunity, and the full onboarding/dashboard/session UI, with no discrepancies against the original source trace. One finding was corrected rather than confirmed: the performanceProfile/isTestAccount 'untestable' claim (§1c) was a misread — test_claude's access key has testAccount:false, so isTestAccount is never set on this account and the feature is fully testable live, which it now has been"
audit: { date: 2026-08-15, findings: 7, verdict: "one of the more honestly-executed plans audited — its specific checkable claims survive verification and it's a third T-9-immune plan with a genuinely wired unique dashboard feature, but T-23 reproduces a third and most-easily-triggered time via its own onboarding menu; all headline findings now live-confirmed as of the 2026-08-15 retro-verification pass" }
```
