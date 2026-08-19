# Athena

> Unified plan document, v2 format. Supersedes `docs/plans/athena.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Wiring and live rendering
> verified via `test_claude`. Improvements tagged `hypothesis` / `shared-bug`
> / `plan-local` per AUDIT-2.

| | |
|---|---|
| **id** | `athena` |
| **Length** | 12 weeks (Wisdom 1-4, Discipline 5-8, Command 9-11, Judgment 12) |
| **Frequency** | 3-day or 4-day mode, user-selectable |
| **Weekly sets** | 61 (4-day, Wisdom phase) |
| **Declared kind** | strength bridge / reusable performance data |
| **Calibration** | none required — no mandatory max test |
| **Source** | `src/data/plans/athena.ts` (69 lines) + `src/features/workout/progression/athena.ts` (25 lines) + `src/features/athena/AthenaDashboard.tsx` (34 lines, dedicated dashboard) |
| **Stated promise** | *"A 12-week bridge into intelligent heavy training and reusable performance data... 3-day or 4-day mode. User-selected lift families. Top sets with editable back-offs. No mandatory max test."* |

---

## 1. Headline finding

**Athena is the first plan in the audit with a genuinely wired, UI-surfaced `xStatus` object — it breaks Wave 3's dominant dead-status-object pattern cleanly — and it's the first plan confirmed structurally immune to T-9, because it never enters the shared dashboard code path that carries the bug.**

### 1a. `athenaStatus` is real, written, and read back correctly

`athenaStatus.exerciseLoads` (keyed by exercise id) is written by a real
progression handler (`progression/athena.ts`) that checks the top set's
completion/quality/RIR/reps via the shared `topSetCanProgress()` engine and
increments by 2.5kg on success. It's read back in two places: the
`calculateWeight` hook (seeding next session's starting weight) and
directly on `AthenaDashboard.tsx`'s own "Loads" section. This is the
inverse of every Wave-3 dead-feature finding (Cathedral, Quadfather,
Overhead Dominion) — a genuine adaptive loop with a reachable UI surface,
not a declared field nothing ever populates.

### 1b. First plan confirmed immune to T-9

**Confirmed live, via a deliberately isolated test**: Monolith's stale
`dashboardViewWeek-${user.id}` cache was manually set to Week 9, then
`test_claude` switched into Athena. Athena's dashboard showed **"ATHENA ·
WEEK 1"** — correct, not carried over. This is because `AthenaDashboard`
(the plan's own dedicated component) never enters `Dashboard.tsx`'s shared
widget-rendering path where the buggy localStorage key lives —
`Dashboard.tsx` returns `<AthenaDashboard user={user}/>` before the
generic week-resolution code ever runs, and `AthenaDashboard` computes its
own week directly from `programProgress.athena`. This is the first
plan in the whole audit (9 plans checked across Waves 2-3) where T-9 does
not reproduce, and it's a structural immunity, not luck — any other plan
with its own dedicated dashboard component bypassing the shared render
path would get the same protection.

### 1c. 3-day/4-day mode and lift-family selection are real, reachable, and well-guarded

Both live on `AthenaDashboard`'s "Run configuration" panel — confirmed
live, rendering a MODE toggle (4 day/3 day) and four family `<select>`s
(SQUAT/HINGE/BENCH/VERTICALPRESS) with real options (e.g. Barbell Squat/
Hack Squat/Safety Bar Squat), wired to `updateUserProfile`. A schedule-mode
change is genuinely guarded against corrupting the current week: it only
takes effect after the calendar week rolls over **and** the athlete
finishes the week they requested it in (`requestScheduleMode`/
`applyPendingScheduleMode`, shared with Venus Rising) — a well-built
"don't let a mode switch corrupt mid-week state" mechanism, not naive
immediate application.

### 1d. "Editable back-offs" is a minor overclaim

The back-off *percentage* itself is hardcoded per phase (10% throughout,
per the phase transforms) with no UI control to change it. What's actually
editable is the resulting **weight number** for the backoff set — a
generic `<Input>` the athlete can freely type over before logging, same as
every other set field app-wide. This is a genuine, reachable behavior, just
narrower than "editable back-offs" implies (which reads as configurable
percentage/rep targets, not "you can overwrite the suggested number").

### 1e. "No mandatory max test" — confirmed true

`Onboarding.tsx` has zero Athena-specific branches — unlike Trinary/Pain &
Glory/etc., which hard-gate submission on entered 1RMs, Athena falls
through the generic path with no forced stats. `calculateWeight` sources
load purely from `athenaStatus.exerciseLoads` (empty at first) or the base
default, never a required max.

### 1f. "Reusable performance data" is real, but Athena only produces it, doesn't consume it

`extractPerformanceObservations()` writes per-set observations (Epley
e1RM, `totalSystemWeightKg` if present) to `users/{id}/performanceProfile`
on every completed session, for all plans — a genuine, plan-agnostic
pipeline, not decorative. But nothing on `AthenaDashboard` reads this data
back; the only confirmed consumer anywhere in the app is Kali's own
dashboard. The card's framing is accurate at the portfolio level (Athena
is a legitimate data producer for a shared pool) but slightly misleading
if read as "Athena reuses its own data" — it doesn't, yet.

---

## 2. Structure

### Weekly template, 4-day mode (Wisdom phase, weeks 1-4, 61 sets)

| Day | Sets | Key work |
|---|---|---|
| Lower A — Squat | 15 | Barbell Squat 4×6-8 (primary), RDL 3×6-10, FFE Bulgarian Split Squat 2, Seated Ham Curl 2, Hack Calf Raise 2, Ab Wheel 2 |
| Upper A — Bench | 16 | Flat Barbell Bench 4×6-8 (primary), SA Hammer Row 3, Assisted Pull-up 3, Seated DB Shoulder Press 2, SA Reverse Pec Deck 2, Cable Tri Ext 1, Hammer Curl 1 |
| Lower B — Hinge | 15 | RDL 3×5-8 (primary), Paused Squat 3, Hip Thrust 2, Leg Extension 2, Lying Leg Curl 2, Hack Calf Raise 2, Ab Wheel 1 |
| Upper B — Press/Pull | 15 | Standing Military Press 3×6-8 (primary), Assisted Pull-up 3, Incline DB Bench 2, Pec Deck 2, SA Hammer Row 2, Lateral Raise 1, Hammer Curl 1, Cable Tri Ext 1 |

3-day mode substitutes an entirely separate internal day tree (Squat
Emphasis / Hinge Emphasis / Press + Secondary Lower) via the same
`preprocessDay` hook, not a subset of the 4-day days — confirmed in source,
a genuinely different program rather than dropping a day from the 4-day
version.

### Phases — real top-set/back-off progression on primaries

| Phase | Weeks | Primary lift progression |
|---|---|---|
| Wisdom | 1-4 | Plain double progression (+2.5kg) |
| Discipline | 5-8 | Top-set-backoff: top 4-6 reps, backoff 10% for `sets-1` at 6-8 reps |
| Command | 9-11 | Top-set-backoff: top 3-5 reps, backoff 10% at 5-7 reps |
| Judgment | 12 | Top-set-backoff: top 1-3 reps (capped at 3 sets), backoff 10% at 5-7 reps; non-primary slots −1 set |

### `xStatus`, T-2, T-3, T-14, T-4, T-9, T-22, reverse-nordic

- **`athenaStatus` genuinely wired** — see §1a. **New T-2 instance**:
  missing from `resetProgram()`'s allowlist (`UserContext.tsx:467-470`
  only nulls `benchDominationStatus`/`pencilneckStatus`/`skeletonStatus`).
  Unlike the T-2 gaps found on dead-status plans (Event Horizon, Quadfather,
  Cathedral), this one has real practical consequence — "Reset Current
  Progress" will not clear saved loads on a plan where those loads
  genuinely drive next session's prescribed weight.
- **T-9 confirmed immune** — see §1b, first such case in the audit.
- **T-22 does not apply** — Athena's `dashboardWidgets` never request
  `strength_chart`, and it bypasses the shared dashboard render path
  entirely (same structural reason as its T-9 immunity).
- **No `type: 'wave'` and no `technique: {kind:'wave'}`** — not exposed to
  T-3/T-14.
- **No classic T-4 pattern** — single authoritative slot per day tree, two
  separate day trees for the two modes rather than duplicated branches
  within one.
- **No `reverse-nordic-curl`** anywhere in either day tree.

---

## 3. Findings

### 3.1 First genuinely wired `xStatus` in the audit · **severity: none (positive finding)**

Detailed in §1a. Breaks Wave 3's dominant pattern cleanly.

### 3.2 First T-9-immune plan in the audit · **severity: none (positive finding)**

Detailed in §1b, confirmed via a deliberately isolated test (Monolith set
to week 9, then switched into Athena, which correctly showed week 1). A
structural immunity worth citing as a model for the eventual T-9 fix — any
plan whose dashboard reads `programProgress[planId]` directly, rather than
relying on the shared `dashboardViewWeek` cache, gets this protection for
free.

### 3.3 `resetProgram()` allowlist gap has real consequence here · **severity: medium, `shared-bug`**

Detailed in §1f above (§2's `xStatus` section). Unlike prior T-2 findings
on dead-status plans, `athenaStatus.exerciseLoads` genuinely drives
prescribed weight — an athlete resetting progress on Athena keeps their
old loads, silently contradicting what "Reset Current Progress" promises
more concretely than on any plan audited so far.

### 3.4 "Editable back-offs" overstates what's configurable · **severity: low, `plan-local`**

Detailed in §1d. Minor card-copy precision issue, not a dead feature — the
underlying mechanism (top-set + backoff) is real and correctly computed.

### 3.5 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| Week resolution immune to T-9 | — (positive) | Confirmed via isolated cross-plan test |
| Run configuration panel (mode + lift families) | — | Confirmed present and correctly populated with real exercise options |
| "Loads" section | — | Confirmed present, correctly showing "—" for unset loads pre-first-session |
| Non-focusable plan card | Low | Confirmed present — app-wide finding, not re-derived in detail |

---

## 4. Weekly volume (4-day mode, Wisdom phase, 61 sets/week)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Glute max (lower) | 17.0 | | Hamstrings (biceps femoris) | 12.75 |
| Hamstrings (semiMemb/Tend) | 12.25 | | Quads (3 heads) | 11.0 each |
| Lats (lower) | 10.25 | | Front delt | 9.75 |
| Abdominal wall | 8.75 | | Teres major | 8.5 |
| Erectors | 7.25 | | Forearm flexors | 7.0 |
| Pec (lower) | 7.0 | | Rhomboids | 6.5 |
| Triceps (lateral/medial) | 6.5 each | | Biceps (long) | 6.5 |
| Lats (upper) | 6.0 | | Pec (upper) | 5.75 |

All 21 distinct exercises resolved to attribution rows — no missing data.
Front delt (9.75) noticeably outweighs side delt (3.5) and rear delt
(3.25) — the attribution map's general "front delt double-dipping" finding
(§16) applies here too, since Incline DB Bench and Standing Military Press
both land as prime movers in the same week's upper days. Not a bug, but
worth noting for anyone stacking Athena with another press-heavy
mesocycle.

---

## 5. Systemic and joint load

| Metric | Value |
|---|---|
| Systemic | **103** |
| Axial | **49** |
| Sets | 61 |
| Per-set systemic | **1.69** |

Highest axial load of any plan audited in Waves 2-4 so far (previous high:
Purgatorio's 52) — expected for a plan built around squat/RDL/hip-thrust
compounds across all 4 days with no dedicated "light" day, appropriate for
a general strength bridge rather than a specialization or hypertrophy
plan.

---

## 6. Improvements, ranked

### 1. Add `athenaStatus` to the `resetProgram()` allowlist · `shared-bug`

The highest-consequence T-2 instance found so far, since the saved loads
genuinely drive prescribed weight rather than sitting inert.

### 2. Consider surfacing a backoff-percentage option, or soften the "editable" claim · `plan-local` (`hypothesis`)

Either expose the 10% figure as an adjustable setting (matching what
"editable back-offs" implies), or adjust the card copy to describe what's
actually editable (the resulting weight number).

### 3. Consider a light rear/side delt accessory · `plan-local` (`hypothesis`)

Front delt outweighs the other two heads roughly 3:1 — a single dedicated
lateral raise or rear-delt slot on one of the lower-priority upper days
would balance this without disrupting the plan's strength-bridge identity.

---

## 7. Verdict

**Athena is the strongest engineering showing of the audit so far —
genuinely wired adaptive progression, a real and well-guarded mode/family
selection system, and the first structural immunity to the audit's most
persistent shared bug — with only a minor card-copy overclaim and a real
(if narrow) `resetProgram()` gap as actual defects.**

Every mechanical claim on the card holds up under live verification except
the precise scope of "editable back-offs." The dedicated `AthenaDashboard`
component is a case study in how to avoid two of this audit's most common
defect classes at once: writing to a status field that's actually read
back (avoiding Wave 3's dead-feature pattern) and computing week
resolution independently of the shared buggy cache (avoiding T-9 by
construction, not luck). The one place this same independence cuts the
wrong way is `resetProgram()` — because Athena's saved loads are real and
consequential, forgetting to clear them on reset actually matters here,
unlike the same gap found on plans where nothing was ever written to the
field in the first place.

---

## 8. Export block

```yaml
id: athena
version: 2
length: { weeks: 12, phases: [wisdom_1to4, discipline_5to8, command_9to11, judgment_12] }
frequency: user_selectable_3day_or_4day
weekly_sets: { four_day_wisdom: 61 }
kind: strength_bridge_reusable_performance_data
calibration: none_required
engine: definePlan_generic_dual_day_tree_dedicated_dashboard
systemic_load: { weekly: 103, axial: 49, sets: 61, per_set: 1.69 }
volume_top: { gluteMaxLower: 17.0, bicepsFemoris: 12.75, semiMembTend: 12.25, vastusLateralis: 11.0 }
positive_findings:
  - "athenaStatus.exerciseLoads genuinely wired — written by a real progression handler, read back for calculateWeight and its own dashboard's Loads section; breaks Wave 3's dead-status-object pattern"
  - "first plan confirmed structurally immune to T-9 — dedicated AthenaDashboard bypasses Dashboard.tsx's shared buggy localStorage week cache entirely, confirmed via isolated cross-plan test (Monolith forced to week 9, Athena still correctly showed week 1)"
  - "3-day/4-day mode switch guarded against mid-week corruption via a calendar-week-rollover + completed-week check before a pending mode change applies"
  - "no mandatory max test confirmed — zero Athena-specific onboarding gates, unlike several other plans"
shared_bug_gaps:
  T2_resetProgram_allowlist: "athenaStatus missing — unlike prior T-2 findings on dead-status plans, this one has real consequence since exerciseLoads genuinely drives prescribed weight"
plan_local_minor: "'editable back-offs' overstates what's configurable — backoff percent is hardcoded per phase (10%), only the resulting weight number is editable"
not_applicable: [T22_liftHistory_strength_chart_never_requested]
audit: { date: 2026-08-15, findings: 3, verdict: "strongest engineering showing of the audit so far — genuinely wired progression, well-guarded mode selection, and first structural T-9 immunity — undercut only by a real resetProgram gap and a minor card-copy overclaim" }
```
