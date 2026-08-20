# Venus Rising

> Unified plan document, v2 format. Supersedes `docs/plans/venus-rising.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering fully
> re-verified live via `test_claude` in a follow-up retro-verification
> session (2026-08-15) after the original audit session's device-lock error
> was root-caused (stale `ownerUid` on the `test_claude` user doc, cleared)
> and confirmed fixed — login succeeded on the first attempt. T-9 immunity
> and the priority-selection write path, previously flagged
> source-trace-only, are now independently live-confirmed (§1a, §1b, §3.1,
> §3.6). Improvements tagged `hypothesis` / `shared-bug` / `plan-local` per
> AUDIT-2.

| | |
|---|---|
| **id** | `venus-rising` |
| **Length** | 12 weeks (Foundation 1-4, Rising 5-8, Ascension 9-11, Rebirth 12) |
| **Frequency** | 3-day full body or 4-day upper/lower, user-selectable |
| **Weekly sets** | 62 (4-day, Foundation phase) |
| **Declared kind** | physique, glutes/delts/back/quads |
| **Calibration** | none |
| **Source** | `src/data/plans/venusRising.ts` (63 lines) + `src/features/venusRising/VenusDashboard.tsx` (dedicated dashboard) |
| **Stated promise** | *"...glutes, delts, back and quads. 3-day full body or 4-day upper/lower. 15–16 sets per session. User-selected priorities. Simple double progression."* |

---

## 1. Headline finding

**Venus Rising is a second confirmed T-9-immune plan via the same dedicated-dashboard mechanism as Athena — but unlike Athena, its "user-selected priorities" mechanism silently no-ops for 4 of its own 5 menu options in the default 4-day mode, and "15-16 sets per session" is off by one on Upper A (17 sets).**

### 1a. Second plan confirmed structurally immune to T-9 (same mechanism as Athena/T-25) — now live-confirmed

`Dashboard.tsx:207` early-returns `<VenusDashboard user={user}/>` before the
shared week-resolution effect's *result* is used, but — critically —
`VenusDashboard` itself computes its own week via `clampProgramWeek()`
directly from `user.programProgress['venus-rising']`, never reading
`viewWeek`/`localStorage`. This is architecturally identical to Athena's
confirmed-live immunity mechanism (T-25).

**Retro-verification (2026-08-15):** independently live-reproduced this
session. With `test_claude` freshly switched into Venus Rising at real Week
1, `localStorage['dashboardViewWeek-test_claude']` was set to a stale `'9'`
and the Dashboard tab reloaded — the header still read **"VENUS RISING ·
WEEK 1"**, correctly ignoring the poisoned localStorage key. Immunity is now
confirmed live, not just by source-pattern analogy to Athena.

### 1b. "User-selected priorities" is real but silently inert for most of its own menu — write path now live-confirmed

The mechanism (`preprocess()`, `venusRising.ts:43-56`) is genuinely wired
— `VenusDashboard` lets the athlete pick 2 of 5 exercises, saved to
`exerciseSelections`, and the plan bumps a matching slot from 2→3 sets.

**Retro-verification (2026-08-15):** the two priority `<select>` elements on
the live dashboard offer exactly the 5 option values the source predicts
(`side-glute-medius-hip-thrust`, `lateral-raise`, `assisted-pull-up`,
`single-arm-hammer-row`, `leg-extension`). Setting Priority 1 to
`leg-extension` and Priority 2 to `lateral-raise` and clicking "Save
Settings" produced an immediate, correctly-shaped Firestore write —
`planPreferences.venus-rising.exerciseSelections: {priority1:
"leg-extension", priority2: "lateral-raise"}` — confirmed via direct
Firestore read. Reloading the dashboard round-tripped the saved values back
into the `<select>` elements correctly. The write mechanism is now
independently live-confirmed, not just source-traced. The weeks-5-8 gating
and the "only `leg-extension` can ever bump in 4-day mode" claim below
remain source-level findings (the live session was at Week 1, inside the
inert Foundation window by design) — but the underlying data-writing
machinery they describe is now proven real, not hypothetical. Two
structural gaps the card doesn't disclose:

- **Only active in weeks 5-8** (`if (week < 5 || week > 8) return selected;`)
  — 8 of the plan's 12 weeks, priority selection has zero effect.
- **In the default 4-day mode, only 1 of the 5 selectable exercises can
  ever actually be boosted.** The bump only fires when
  `exercise.sets === 2`. Checking base set counts against the priority
  list in 4-day mode: `assisted-pull-up` is always 3 sets (never
  boostable), `single-arm-hammer-row` is always 3 sets (never boostable),
  `side-glute-medius-hip-thrust` doesn't exist anywhere in the 4-day tree
  at all (fully decorative in that mode), `lateral-raise` is always 4 sets
  in 4-day mode (never boostable there). Only `leg-extension` (2 sets,
  Lower A) can ever be bumped in the default mode. This is a subtler
  instance of the wave's dead/decorative-claim pattern — the mechanism is
  real and does write data, it just silently fails to do anything for 4 of
  its 5 own menu choices in the mode most athletes will use.

### 1c. "15-16 sets per session" is false for one session — now live-confirmed

Computed directly from source: Lower A 15, **Upper A 17**, Lower B 15,
Upper B 15. Upper A = 3+3+3+4+2+1+1 = 17, one set over the card's stated
maximum. 3-day mode is accurate (16/15/16). The plan's own original doc
also has this session's per-exercise set counts wrong in two places (Incline
DB Bench listed at 2 sets, Lateral Raise at 3) against the live source's 3
and 4 — a stale-doc mismatch of the same shape already found on Purgatorio/
Cathedral/Workhorse, not itself a live bug.

**Retro-verification (2026-08-15):** started Session 2 (Upper A) live —
the workout header read **"LIVE SET 1/17"**, and the rendered exercise list
matched the source exactly: Assisted Pull-ups 3, Single-Arm Hammer Strength
Row 3, Incline DB Bench Press 3, Lateral Raises 4, Single Arm Reverse Pec
Deck 2, Bayesian Cable Curl 1, Overhead Tricep Extensions 1 = 17. Confirmed
live, not just computed from source.

### 1d. "Simple double progression" — confirmed genuinely simple, the one fully honest claim

`progression: { type: 'double', increment: 2.5 }` used uniformly, no
`technique` field anywhere in the file, no wave/backoff/myo-reps. Phase
transforms only touch `rpe` and the Rebirth deload's `sets`. This is
accurate and, if anything, undersold relative to the mode-switch/priority
machinery layered on top of it.

---

## 2. Structure

### Weekly template, 4-day mode (Foundation phase, weeks 1-4, 62 sets)

| Day | Sets | Key work |
|---|---|---|
| Lower A — Quads + Glutes | 15 | Hack Squat 3, FFE Bulgarian Split Squat 3, Seated Ham Curl 2, Leg Extension 2, Hip Abduction 2, Hack Calf Raise 2, Ab Wheel 1 |
| Upper A — Back + Delts | **17** | Assisted Pull-up 3, SA Hammer Row 3, Incline DB Bench 3, Lateral Raise 4, SA Reverse Pec Deck 2, Bayesian Cable Curl 1, Overhead Tricep Ext 1 |
| Lower B — Glutes + Posterior Chain | 15 | Hip Thrust 3, RDL 3, Deficit Reverse Lunge 3, Supported Sissy Squat 2, Lying Leg Curl 2, Hack Calf Raise 2 |
| Upper B — Shape | 15 | SA Hammer Row 3, Flat DB Press 3, Pec Deck 2, Seated DB Shoulder Press 1, Lateral Raise 4, Hammer Curl 1, Cable Tri Ext 1 |

### Phases

| Phase | Weeks | Change |
|---|---|---|
| Foundation | 1-4 | Base |
| Rising | 5-8 | RPE 8.5 everywhere; priority-selection window active |
| Ascension | 9-11 | Lateral Raise/Leg Extension/SA Reverse Pec Deck → RPE 9.5, else 8.5 |
| Rebirth | 12 | Sets ≥3 → 2, else → 1; RPE 8 (deload) |

### Mode-switch guard — real, but a parallel reimplementation of Athena's shared logic

`effectiveVenusMode()` hand-rolls the identical week-boundary gating rule
Athena uses (`calendarPlanWeek(start, now) > requestedDuringWeek &&
completedWeek >= requestedDuringWeek`) inline, rather than calling the
shared `applyPendingScheduleMode()` helper both plans' underlying
`planLifecycle/schedule.ts` module already provides. Logically equivalent
today, but a maintenance/drift risk — a future fix to the shared helper
won't propagate here automatically.

### `xStatus`, T-2, T-3, T-14, T-4, T-22, reverse-nordic

- **No root `xStatus` object** — all state lives in the generic
  `planPreferences['venus-rising']`, genuinely written by
  `VenusDashboard`'s save button. Not exposed to T-2/T-26's literal
  pattern, though see §3.3 for a related `resetProgram()` gap.
- **No `type: 'wave'` and no `technique` field anywhere** — not exposed to
  T-3/T-14, confirming §1d.
- **No classic T-4 pattern** — single authoritative slot per day tree.
- **No `reverse-nordic-curl`** anywhere in either day tree.
- **T-22 does not apply** — `dashboardWidgets: ['program_status',
  'workout_history']` never requests `strength_chart`.

---

## 3. Findings

### 3.1 Second T-9-immune plan, same mechanism as Athena · **severity: none (positive finding, live-confirmed)**

Detailed in §1a. Originally flagged as high-confidence source trace only;
independently live-reproduced in the 2026-08-15 retro-verification session
(poisoned `dashboardViewWeek-test_claude` localStorage key, dashboard still
showed the correct week).

### 3.2 "User-selected priorities" silently inert for 4 of 5 menu options in the default mode · **severity: medium, `plan-local`**

Detailed in §1b. A subtler instance of the wave's dead/decorative-claim
pattern — the mechanism writes real data and does work for one exercise,
but the athlete's other four choices have no possible effect in 4-day mode.

### 3.3 `resetProgram()` doesn't touch `planPreferences` at all, for any plan · **severity: low, `plan-local`**

New observation, generalizable beyond Venus: `resetProgram()` only resets
`programProgress`, never `planPreferences`. For Venus specifically, this
means a stale `pendingScheduleChange.requestedDuringWeek` (computed
against the old run's calendar clock) survives a reset and could compare
against the new run's calendar week incorrectly. Lower severity than
Athena's T-26 since nothing here drives prescribed load — but a real gap
in what "Reset Current Progress" actually resets, worth checking on any
other plan using `planPreferences` for mode/selection state.

### 3.4 "15-16 sets per session" is off by one on Upper A (17 sets) · **severity: low, `plan-local`**

Detailed in §1c. Minor, specific-number inaccuracy; 3-day mode is
accurate. Live-confirmed 2026-08-15 (workout header read "LIVE SET 1/17").

### 3.5 "Simple double progression" confirmed fully honest · **severity: none (positive finding)**

Detailed in §1d.

### 3.6 UI/UX

**Retro-verified live 2026-08-15.** Full onboarding (Training Schedule →
Exercise Selection) and the mode/priority dashboard were clicked through
live via `test_claude`: schedule picker, the 5-option priority `<select>`
elements, save-and-persist round trip, and a full Upper A session start all
worked as the source predicted. The non-focusable plan-selection-card
accessibility defect (shared finding #6, §6 of `_audit-status.md`) is
present here too, consistent with every other plan. No UI discrepancies
found between source trace and live rendering.

---

## 4. Weekly volume (4-day mode, Foundation phase, 62 sets/week)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Glute max (lower) | 13.5 | | Quads (3 heads) | 11.5 each |
| Hamstrings (biceps femoris) | 9.25 | | Side delt | 8.5 |
| Lats (lower) | 8.5 | | Front delt | 8.0 |
| Hamstrings (semiMemb/Tend) | 7.75 | | Pec (lower) | 6.5 |
| Teres major | 6.0 | | Biceps (long) | 6.0 |
| Rectus femoris | 5.5 | | Pec (upper) | 5.5 |
| Rhomboids | 5.5 | | Gastrocnemius | 5.0 |
| Glute medius | 5.0 | | Triceps (lateral/medial) | 4.5 each |

All 24 distinct exercises resolved to attribution rows — no missing data.

### The card's "glutes, delts, back and quads" claim, quantified

| Focus area | Combined dimensions | Weekly sets |
|---|---|---|
| Quads | vastus×3 + rectus femoris | **40.0** |
| Back | lats×2 + teres major + rhomboids | **23.0** |
| Glutes | glute max×2 + glute medius | **22.5** |
| Delts | side + front + rear | **20.0** |

All four combined groups land well ahead of any single non-focus muscle
(next-highest: hamstrings' biceps femoris at 9.25) — the card's claim
holds in aggregate. Two caveats worth noting: combining 3-4 dimensions per
focus area partly explains the ranking margin (individual delt heads range
3.5-8.5, with rear delt at 3.5 actually below hamstrings' individual
numbers), and the posterior chain (hamstrings, from RDL/hip thrust/reverse
lunge stacking on Lower B) rivals any single delt or back sub-dimension
despite not being a named focus area.

---

## 5. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **86** |
| Axial | **17** |
| Sets | 62 |
| Per-set systemic | **1.39** |

Low-moderate systemic cost, consistent with a physique-focused plan built
around machine/dumbbell work rather than heavy barbell compounds — no
`systemicCompound`-flagged slot appears anywhere in the file.

---

## 6. Improvements, ranked

### 1. Fix the priority-selection menu so all 5 options can matter in 4-day mode · `plan-local`

Either add `side-glute-medius-hip-thrust` to the 4-day tree, or change the
bump condition so `assisted-pull-up`/`single-arm-hammer-row`/
`lateral-raise` (all always ≥3-4 sets in 4-day mode) can also receive a
priority bump — currently only `leg-extension` can ever respond to this
setting in the mode most athletes will use.

### 2. Extend the priority window beyond weeks 5-8, or state the window explicitly · `plan-local` (`hypothesis`)

The card doesn't mention the 8-of-12-weeks limitation; either broaden the
window or add a one-line onboarding note so the setting's actual scope
matches athlete expectations.

### 3. Call `applyPendingScheduleMode()` instead of reimplementing it · `plan-local`

Reduce drift risk between Venus's and Athena's mode-switch guards by
having Venus call the shared helper in `planLifecycle/schedule.ts` rather
than maintaining a parallel inline copy of the same rule.

### 4. Fix Upper A's set count or the card's stated range · `plan-local`

Either trim Upper A to 16 sets or update "15-16" to "15-17."

---

## 7. Verdict

**Venus Rising is architecturally close to Athena — a dedicated dashboard,
real user-written preferences, honest "simple" progression — but its
signature feature (user-selected priorities) has a scope gap the card
doesn't disclose, silently doing nothing for 4 of its 5 own menu choices
in the default mode.**

The plan's aggregate focus-area claim ("glutes, delts, back and quads")
holds up numerically, and "simple double progression" is the one fully
honest, uncomplicated claim on the card. Its T-9 immunity (via the same
dedicated-dashboard pattern as Athena) is a genuine positive, now
independently live-confirmed (2026-08-15 retro-verification session,
following the same session that also confirmed Athena's). The
priority-selection gap is the plan's most consequential finding: a real,
wired mechanism — its write path is now also live-confirmed — that mostly
can't do anything in the mode most athletes will choose, a quieter and more
specific version of the dead/decorative-claim pattern that's defined Wave 3
and now appears again in Wave 4.

---

## 8. Export block

```yaml
id: venus-rising
version: 2
length: { weeks: 12, phases: [foundation_1to4, rising_5to8, ascension_9to11, rebirth_12] }
frequency: user_selectable_3day_or_4day
weekly_sets: { four_day_foundation: 62 }
kind: physique_glutes_delts_back_quads
calibration: none
engine: definePlan_generic_dual_day_tree_dedicated_dashboard
systemic_load: { weekly: 86, axial: 17, sets: 62, per_set: 1.39 }
volume_top: { gluteMaxLower: 13.5, vastusLateralis: 11.5, vastusMedialis: 11.5, vastusIntermedius: 11.5 }
focus_area_totals: { quads: 40.0, back: 23.0, glutes: 22.5, delts: 20.0 }
positive_findings:
  - "'simple double progression' confirmed fully honest — no technique field anywhere, no wave/backoff/myo-reps"
  - "second T-9-immune plan via the same dedicated-dashboard mechanism as Athena (T-25) — live-confirmed 2026-08-15 (poisoned localStorage viewWeek key, dashboard still showed correct week)"
  - "'glutes, delts, back, quads' focus-area claim holds numerically against the volume table"
  - "priority-selection write path (planPreferences.venus-rising.exerciseSelections) live-confirmed 2026-08-15 — correct Firestore write and round-trip on save"
plan_local_bugs:
  - area: "'user-selected priorities' card claim"
    detail: "only active weeks 5-8 (8 of 12 weeks inert); in default 4-day mode only 1 of 5 selectable exercises (leg-extension) can ever receive the sets bump — the other 4 are permanently either wrong base set count or absent from the 4-day tree entirely"
  - area: "'15-16 sets per session' card claim"
    detail: "Upper A is 17 sets (3+3+3+4+2+1+1), one over the stated max; 3-day mode is accurate at 15-16"
  - area: "resetProgram() never touches planPreferences"
    detail: "generalizes beyond this plan — a stale pendingScheduleChange.requestedDuringWeek survives a reset and could compare incorrectly against the new run's calendar week; lower severity than Athena's T-26 since nothing here drives prescribed load"
doc_code_mismatch:
  area: "docs/plans/venus-rising.md Upper A table"
  detail: "lists Incline DB Bench at 2 sets and Lateral Raise at 3; live source has 3 and 4 respectively"
verification_note: "original audit session lost authentication mid-audit (device-lock error on re-login, root-caused to a stale ownerUid on the test_claude user doc, since cleared); T-9 immunity, the priority-selection write path, and Upper A's 17-set count were all independently re-verified live in a 2026-08-15 retro-verification session — no discrepancies found between the original source trace and the live pass"
audit: { date: 2026-08-15, findings: 4, verdict: "architecturally close to Athena's strong showing, but its signature user-priority feature silently no-ops for 4 of 5 menu choices in the default mode — a quieter, more specific version of the wave's dominant decorative-claim pattern; all headline findings now live-confirmed" }
```
