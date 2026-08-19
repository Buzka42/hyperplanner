# 30 Minute Adventure

> Unified plan document, v2 format. Supersedes `docs/plans/30-minute-adventure.md`
> if one exists. Third plan of **Wave 5 (Conditioning / constrained)**.
> Structure and wiring verified via direct source trace of
> `src/data/adventure.ts`, `src/pages/AdventureSession.tsx`,
> `src/pages/AdventureDashboard.tsx`, `src/pages/Dashboard.tsx`,
> `src/contexts/UserContext.tsx`, `src/data/portfolio.ts`, and
> `src/features/portfolio/FollowUps.tsx` — **plus a full `test_claude` live
> pass**: logged in on the first attempt, switched in from REDLINE, generated
> a random 5-portal route (`~33 min` estimate), drove all 20 working sets
> through to completion via direct-DOM set logging (including a rest-skip and
> a "neither" challenge-prompt answer on every pair), committed the session,
> and cross-checked the resulting document directly in Firestore both before
> and after, plus a direct read of the written `workouts` subcollection
> document to confirm per-set data integrity. Volume and systemic figures
> computed from a throwaway `tsx` script (deleted after use) that resolved
> each of the plan's 62 self-contained exercise definitions in
> `src/data/adventure.ts` against `EXERCISE_LIBRARY` by exact name match (all
> 62 resolved cleanly, zero unmatched) to reuse the attribution map's
> `primary`/`secondary` categorization and `intelligence` cost fields, since
> the plan's exercises are a separate, disconnected pool from the shared
> library rather than references into it.

| | |
|---|---|
| **id** | `30-minute-adventure` |
| **Length** | Freely repeatable — the plan has no week/phase structure at all; `ADVENTURE_PROGRAM.weeks` is a single placeholder week with zero authored exercises (all content is generated per session). `docs/plans/v2` portfolio metadata (`src/data/portfolio.ts`) separately tags it `weeks: 4` for the recommendation quiz only — the two numbers describe different subsystems and are not meant to match, but nothing reconciles them for a reader comparing the onboarding card ("1 WK" badge, from `ADVENTURE_PROGRAM.weeks.length`) against the "Help Me Choose" quiz copy. |
| **Frequency** | User's choice, 2-4 sessions/week per `portfolio.ts` (`frequency: [2,3,4]`); nothing in the app enforces or tracks this — no fixed weekday selection step exists (unlike Iron Clock/REDLINE) |
| **Weekly sets** | Not fixed — each session is 20 working sets (5 portals × 1 pair × 2 exercises × 2 rounds) by construction, but the athlete freely re-picks portals/pairs every session, so no stable "weekly volume" exists independent of how often and what they choose |
| **Declared kind** | Free-plan full-body session generator, conditioning/general fitness, non-repeatable-in-content (portal picks vary session to session) but structurally repeatable forever |
| **Calibration** | None — `weightMode: 'external'` exercises carry the last-used or last-logged weight forward automatically (`findPreviousAdventureWeight`/`history` lookup); no 1RM/RPE step at onboarding |
| **Source** | `src/data/adventure.ts` (264 lines: 62 exercise defs, 33 pairs, 5 portals) + `src/pages/AdventureSession.tsx` (session runner, 425 lines) + `src/pages/AdventureDashboard.tsx` (dedicated dashboard, 100 lines) — the only Wave-5 plan so far with its own dashboard component |
| **Stated promise** | Onboarding card: *"A flexible full-body session generator built for fast, equipment-aware training."* Features: 5 portals · 10 exercises · 20 working sets · No 1RM or RPE calibration · Exercise history and load recommendations. Dashboard copy: *"Two rounds per pair, twenty working sets, no RPE math"* and *"Thirty-minute target — fast routes land near thirty minutes. Longer setups are labelled before you commit."* The "Help Me Choose" recommendation quiz additionally describes it via `portfolio.ts`'s `signatureMechanic`: *"Pick-a-path sessions that fit in half an hour and never repeat the same pairing twice."* |

---

## 1. Headline finding

**30-Min Adventure breaks Wave 5's 2/2 dead-headline-mechanic streak decisively — its entire session-generator mechanic is real, live-confirmed, and writes correct state end-to-end.** Unlike Iron Clock's density ladder (T-32, dead) and REDLINE's recovery check (T-34, dead), the "pick a pair per portal, log 20 sets, commit" mechanic that *is* the plan — there is no other content — actually runs. A full live pass generated a random 5-portal route, logged all 20 sets with per-round data (weight/reps/completion), committed it, and Firestore confirmed both `programProgress['30-minute-adventure']` (`completedSessions: 1`, `startDate` populated — unlike REDLINE's T-37 gap, this plan's `startDate` write is correct) and a fully-populated `workouts` subcollection document with all 10 exercises × 2 rounds of real `setsData`, correctly omitting the `weight` field for the one bodyweight exercise in the route (Diamond Push-Up) while populating it for every `external`-mode exercise. This is the cleanest, most completely-wired session-completion path seen in Wave 5 so far.

However, two of the plan's *other* specific, quotable claims do not hold up:

### 1a. "Thirty-minute target" is not reliably true — live-confirmed overrun on a randomly generated route

The dashboard explicitly frames the plan around thirty minutes (`"Thirty-minute target"` / `"Fast routes land near thirty minutes"`), and the onboarding card's `signatureMechanic` says sessions *"fit in half an hour."* Each of the 33 pairs carries a flat, editorial `estimatedMinutes` (5/6/7, keyed only off a `setup: 'fast'|'moderate'|'slow'` label — not computed from actual rest-seconds, set count, or target reps). Live-confirmed: clicking "Random Adventure" (`randomize()`, uniform-random selection with no time-budget awareness) produced a route estimated at **~33 minutes** — over the stated target on the very first randomized attempt, with no special effort to pick slow options. A throwaway script confirmed this is structural, not a rare unlucky roll: summing the *minimum* `estimatedMinutes` pair in every portal gives 25 minutes; summing the *maximum* gives 35 minutes. Since `randomize()` has no session-total awareness at all (it independently rolls each portal without checking the running sum), roughly half of all possible portal combinations land above 30 minutes, and `randomize()` can produce any of them with no bias toward the stated target. The card copy hedges this ("longer setups are labelled") and the UI does show a running `~NN min` estimate before commit — so this is not a fully-dead promise the way Iron Clock/REDLINE's were, but "thirty-minute target" and "fit in half an hour" are materially optimistic given the mechanism that is supposed to deliver them (uniform random selection) will exceed 30 minutes roughly as often as not.

### 1b. "Never repeat the same pairing twice" is unenforced and demonstrably false at the single-exercise level

`portfolio.ts`'s `signatureMechanic` for this plan (shown verbatim to the athlete in the "Help Me Choose" recommendation flow, `src/features/portfolio/FollowUps.tsx:42`) states routes *"never repeat the same pairing twice."* No code implements this: `randomize()` uses `Math.floor(Math.random() * options.length)` with no history lookup, `AdventureDashboard`'s own `logs` fetch (used only to render the last completed route's name strip) is never consulted by the selector, and nothing prevents an athlete from generating or manually selecting the exact same 5-pair route in two consecutive sessions. Worse, the claim fails within a *single* session: `cable-pull-through` appears in three different pairs spanning **two different portals** (`core-cable-crunch-pull-through` in Abs/Glutes, `posterior-pull-through-rope-curl` and `posterior-pull-through-low-curl` in Biceps/Hamstrings/Lower Back) — since each portal is selected independently, an athlete who picks the Abs/Glutes pull-through pair and either Biceps/Hamstrings pull-through pair trains the identical movement twice in the same 20-set session, directly contradicting the "never repeat" framing regardless of whether "pairing" is read strictly (pair ID) or loosely (movement).

---

## 2. Structure

### The five portals and their pair pools

| Portal | Pairs available | `heroPick` |
|---|---|---|
| Chest / Upper Back (`upper`) | 7 | Incline Barbell Bench + Barbell Row |
| Abs / Glutes (`core-glutes`) | 6 | — (none marked) |
| Calves / Shoulders (`calves-shoulders`) | 7 | — (none marked) |
| Quads / Triceps (`quads-triceps`) | 6 | Barbell Squat + DB Skullcrusher |
| Biceps / Hamstrings / Lower Back (`arms-posterior`) | 7 | Barbell RDL + Straight-Bar Curl |

33 pairs total, 62 distinct exercise definitions (all locally defined in `adventure.ts`, disconnected from `EXERCISE_LIBRARY` but a 100% clean name-match against it — no orphaned or invented movements). A session = exactly one pair per portal (enforced: `startSession()` checks `selectedCount !== ADVENTURE_PORTALS.length`), each pair run as 2 rounds of A then B (4 total sets), for a fixed 20 sets/session regardless of which 5 pairs are chosen.

### Equipment filtering, randomize, and reroll

`selectedEquipment` (persisted to `user.adventureEquipment`, confirmed live via a real `updateUserProfile` write on toggle) filters which pairs are selectable per portal (`pairItem.equipment.every(item => selectedEquipment.includes(item))`). `randomize()` rolls one pair per portal uniformly at random from the equipment-filtered pool; `rerollPortal()` re-rolls a single portal excluding its current pick. Neither considers running time total or prior-session history (§1b).

### Round-2 escalation ("challenge") mechanic — real and working

Round 2 of each pair triggers a genuine adaptive-difficulty branch: after logging round-1 slot B, a "challenge" prompt (`promptPairId`) asks the athlete to nominate A, B, both, or neither for a harder round-2 target. If nominated, `specialTarget` becomes true for that exercise's round 2, and the UI target label swaps from the normal rep range to `"Last clean rep"` (technical/preprogrammed movements) or `"Failure"` (muscular movements), with a matching safety-copy warning (`ShieldAlert` block). This is a real, live-confirmed (challenge prompt appeared after every A/B pair in the live session, "neither" was selectable and correctly routed to advance) mechanic, distinct in kind from Iron Clock/REDLINE's dead mechanics — a genuinely working piece of the plan's differentiation.

### History-driven load carry-forward and "increase" advice — real, partially exercised live

`findPreviousAdventureWeight()` carries the last-completed weight for the *same exercise* forward within a session (round 2 pre-fills from round 1; a later portal reusing the same exercise, where possible, pre-fills from the earlier portal). Across sessions, a `getDocs` scan of the `workouts` subcollection (filtered to `programId === ADVENTURE_PLAN_ID`) builds a `history` map keyed by exercise, and flags `increase: true` when either both of the last two logged sets hit top-of-range or the last logged rep count beat top-of-range by 3+ (a real "beat your best" signal, shown via a `<Zap>` "Increase load" pill). Live-confirmed the weight-carry-forward path (round 1 auto-filled round 2's weight field within the session); the cross-session `increase` flag was not exercised this session since it requires two prior sessions of a matching exercise, which `test_claude` does not have for any Adventure exercise yet — flagged as **plausible-but-not-independently-reproduced-live**, consistent with the audit's standard for claims not directly walked this session.

### `xStatus`, T-2, T-3, T-4, T-9, T-22, T-23, reverse-nordic

- **No `adventureStatus` or any dedicated status object exists at all** — the plan carries no `xStatus` field the way every other Wave 1-5 plan does. State lives entirely in `user.adventureEquipment` (equipment filter, real write), `user.programProgress['30-minute-adventure']` (generic, real write, confirmed live), and a `localStorage` session-in-progress draft (`adventureDraftKey`, cleared on commit). **T-2/T-28 do not apply** — there is no status object for `resetProgram()`'s allowlist to omit. `resetProgram()`'s existing generic path (nulls `completedSessions`/`startDate` and rewrites `programProgress[currentId]`) fully covers this plan's only persistent state.
- **`resetProgram()` does not clear a stale in-progress draft** (`localStorage['adventure_draft_' + userId]`), only `AdventureSession`'s own `resetDraft()` does. Low severity: if an athlete resets progress mid-route, the next visit to `/app/adventure` would restore the abandoned draft's `stage`/`selectedPairIds`/`results` rather than starting fresh — inconsistent with "Reset Current Progress" copy, but scoped to a narrow, self-correcting edge case (opening the selector and clicking "Clear route" fixes it manually).
- **No `type: 'wave'` anywhere** — zero T-3 exposure.
- **No classic T-4 duplicated-definition drift.** All 62 exercises and 33 pairs are defined exactly once via the `exercise()`/`pair()` factory functions; the only "reuse" is the cross-portal `cable-pull-through` case (§1b), which is intentional content reuse, not drifting duplicate definitions.
- **No `reverse-nordic-curl`** anywhere in the 62-exercise pool — clean.
- **T-9 does not reproduce — first Wave-5 plan with a dedicated dashboard.** `Dashboard.tsx:48,204` checks `isAdventure = activePlanConfig.id === ADVENTURE_PLAN_ID` and returns `<AdventureDashboard />` before any of the shared `dashboardViewWeek`-localStorage week-resolution logic runs. Confirmed both by source (the early-return happens before the buggy code path is ever reached) and live (switching in from REDLINE — whose own session had just been logged at Week 1 — went straight to a correct, fresh "0 sessions" Adventure dashboard with no stale week/phase artifact of any kind, since the Adventure dashboard doesn't have a week/phase concept to get wrong in the first place). Matches the standing hypothesis (Athena's T-25, House of Iron, Kali, Venus Rising): dedicated dashboard component is the actual T-9-immunity predictor, independent of plan category — Wave 5 now splits 1-for-3 on this axis (Iron Clock exposed, REDLINE exposed, 30-Min Adventure immune).
- **T-22 does not apply.** `dashboardWidgets: ['workout_history']` only — no `strength_chart` request, no `trackedLiftFor()` call anywhere in the plan's code.
- **T-23 does not apply, structurally.** Census of all 62 exercises' `weightMode`: `external` (52), `bodyweight` (6: push-up, pull-up variant grouping aside, hanging-leg-raise, reverse-crunch, ab-wheel, close-grip-push-up, diamond-push-up — 6 counted, `pull-up` itself is `assisted`), `assisted` (1: pull-up), `timed` (1: plank), `optional` (2: frog-pump, step-calf-raise). No `weighted-bodyweight` mode exists anywhere in this plan's pool — no `totalSystemWeightKg` progression axis to break.

---

## 3. Findings

### 3.1 "Thirty-minute target" overruns on a randomly generated route, with no time-budget awareness in the generator itself · **severity: medium, `plan-local`**

Detailed in §1a. `estimatedMinutes` is a flat 5/6/7 lookup keyed off a `setup` label the plan's own author assigned per pair, not computed from the pair's actual rest seconds, set count, or rep ranges — and `randomize()`/manual selection have no awareness of the running total at all until after all 5 portals are picked, when the UI simply displays whatever total results. A live-generated random route landed at ~33 minutes on the first attempt; the portal-by-portal min/max computation shows the true range is 25-35 minutes depending on selection, meaning roughly half of all reachable combinations exceed the stated 30-minute target. The card copy's hedge ("fast routes land near thirty minutes... longer setups are labelled") is honest about *why* this happens, but does not change that the plan's headline number is not what the default, lowest-effort path (hit "Random Adventure") reliably delivers.

### 3.2 "Never repeat the same pairing twice" is aspirational copy with no enforcing mechanism · **severity: medium, `plan-local`**

Detailed in §1b. No history-aware exclusion exists in `randomize()`, `rerollPortal()`, or manual pair selection — `AdventureDashboard`'s own workout-history fetch (used to show the last route's name strip) is architecturally available to solve this (it already resolves `selectedPairIds` from prior logs) but is never passed to or consulted by `AdventureSession`'s selector. The claim also fails within a single session, not just across sessions: `cable-pull-through` spans two portals (Abs/Glutes and Biceps/Hamstrings/Lower Back), so a specific two-pair combination trains the same exercise twice in one 20-set route. This is shown to the athlete as marketing copy in the "Help Me Choose" quiz (`FollowUps.tsx:42`), not just internal documentation, so it is a user-facing, falsifiable claim.

### 3.3 `resetProgram()` can leave a stale in-progress route draft behind · **severity: low, `plan-local`**

Detailed in §2. `resetProgram()`'s generic path clears `programProgress`/`completedSessions`/`startDate` but has no plan-specific hook to also clear `localStorage['adventure_draft_' + userId]`. An athlete who resets progress while mid-route (stage `'work'`, some sets logged) will find that draft restored on their next visit to `/app/adventure`, contradicting "Reset Current Progress"'s Week-1-Day-1-style framing for this plan — though since Adventure has no week/day concept, the practical harm is limited to resuming an old half-finished route rather than starting a clean selector, and is self-correctable via the in-app "Clear route" button.

### 3.4 `weeks: 4` (portfolio quiz metadata) and the "1 WK" onboarding badge (from `ADVENTURE_PROGRAM.weeks.length`) describe different things and are never reconciled for the reader · **severity: low, `hypothesis`, not root-caused**

`src/data/portfolio.ts`'s `weeks: 4` field feeds the "Help Me Choose" recommendation quiz's internal comparisons only. The plan-selection card's "1 WK" badge is derived structurally from `ADVENTURE_PROGRAM.weeks` having exactly one placeholder entry (the plan generates content per session rather than authoring weeks in advance, so this is *correct* for what it measures — there is genuinely one templated "week" in the data model). Both numbers are individually defensible for their own subsystem, but nothing in the app explains to a reader comparing the quiz's implied 4-week engagement against the card's "1 WK" tag that they're measuring different things — a minor, low-stakes inconsistency, not independently confirmed to mislead any real decision (the plan is free and switchable, so the practical cost of this ambiguity is low).

### 3.5 UI/UX

Fully live-tested this session, no login friction (`test_claude` worked on the first attempt, continued directly from REDLINE). Switch-in flow: Settings → Switch Program → 30 Minute Adventure card → immediately lands on `AdventureDashboard` with no intermediate onboarding/preference step (equipment defaults to all five categories, consistent with the plan's "Free for every new keyword" framing — a genuinely lighter-weight switch-in than every other Wave 5 plan, which all have a mandatory schedule/equipment step first). Route selection (portal accordion, pair cards showing A/B targets, rest, setup tier, hero-pick badge), the reroll and random-route controls, live session flow (rest countdown with skip, challenge prompt, per-set weight/reps entry, progress bar, elapsed timer), and commit-to-summary all worked without error across a full 20-set session. The one rough edge: the equipment-filter toggle buttons and portal accordion headers are real `<button>` elements (not the non-focusable-div pattern flagged app-wide, §6 item 6 in `_audit-status.md`) — a small positive contrast worth noting, though not independently re-verified against the shared accessibility-tree finding this session.

---

## 4. Session volume (one representative route: hero-pick-first default, 20 sets)

Since the plan has no fixed weekly template — the athlete freely re-picks 5 of 33 pairs every session — there is no single "weekly volume" table the way template-based plans have. The table below is computed for one representative session (heroPick pair where available, else the pool's first pair, per portal) to show what a typical 20-set route trains; actual muscle distribution varies session to session based on the athlete's choices, by design.

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Glutes | 6.0 | | Front delt | 4.0 |
| Triceps | 4.0 | | Hamstrings | 4.0 |
| Biceps | 3.0 | | Chest | 2.0 |
| Upper back | 2.0 | | Lats | 2.0 |
| Abs | 2.0 | | Calves | 2.0 |
| Quads | 2.0 | | Rear delt | 1.0 |
| Obliques | 1.0 | | Side delt | 1.0 |
| Adductors | 1.0 | | Lower back | 1.0 |
| Brachialis | 1.0 | | | |

Computed from `EXERCISE_LIBRARY`'s native primary(1.0)/secondary(0.5) categorization, resolving each Adventure exercise to its library counterpart by exact name match (62/62 resolved). A single 20-set session cannot be judged against a weekly MEV/MAV target (§7 calibration principle) — the honest comparison is against 2-4x/week (the plan's own stated frequency range), which would put glutes/front-delt/hamstrings/triceps in a reasonable weekly range (12-24 sets at 2-4x) while chest/upper-back/lats/quads/calves stay comparatively light (4-8 sets/week at the same frequency) purely because this particular route under-samples them relative to other reachable portal combinations — a different athlete choosing different pairs every session would land on a materially different distribution, which is inherent to a free-choice generator rather than a defect.

No direct adductor isolation beyond the 1.0 secondary credit above, no direct erector work, no soleus-specific loader, no upper-trap work, no tibialis-anterior exposure — consistent with the map's portfolio-wide zero-coverage findings (§2 of `_audit-status.md`); this plan does nothing to close any of those gaps, same as every plan audited so far.

---

## 5. Systemic and joint load (same representative session)

| Metric | Value |
|---|---|
| Systemic | **36** |
| Axial | **20** |
| Lower back | **16** |
| Knee | **4** |
| Shoulder | **6** |
| Elbow | **12** |
| Sets | 20 |
| Per-set systemic | **1.80** |

Per-set systemic cost (1.80) is the highest of the three Wave 5 plans audited so far (REDLINE 1.52, Iron Clock 1.47) despite being the shortest session by set count — driven by the hero-pick default's inclusion of two barbell-loaded compounds (Incline Barbell Bench Press, Barbell Squat with DB Skullcrusher, Barbell RDL with Straight-Bar Curl) rather than the machine/dumbbell-dominant mix REDLINE and Iron Clock lean on for the bulk of their volume. A fast-setup-only route (all `cable`/`dumbbell`/`bodyweight` pairs, no barbell) would score meaningfully lower — again, this varies by athlete choice rather than being fixed by the plan, unlike every template-based plan audited so far where systemic load is a fixed property of the plan itself.

---

## 6. Improvements, ranked

### 1. Give `randomize()` (and the running total display) actual time-budget awareness · `plan-local`

The single highest-value fix relative to the plan's own headline promise. Either bias `randomize()`'s per-portal roll toward pairs that keep the running total near 30 minutes (e.g. weighted sampling, or a greedy fill that prefers `fast`/`moderate` once the total is already at 20+ minutes), or soften the marketing copy ("near thirty minutes" is more honest than "fit in half an hour" / "Thirty-minute target" as currently worded) so the claim matches what the lowest-effort path (hitting the one-click random button) actually produces. Given `~33 min` appeared on the very first live-tested random roll, this is not a rare edge case.

### 2. Either implement pairing-repeat avoidance, or remove/soften the "never repeat the same pairing twice" claim · `plan-local`

`AdventureDashboard` already fetches and resolves the athlete's full session history (`selectedPairIds` per log) for its "last route" display — the data needed to implement real repeat-avoidance already flows through the codebase, it's just never passed into the selector. A light-touch version (grey out or de-prioritize the exact pair used last session, per portal) would make the claim true without needing a complex algorithm. Fixing the `cable-pull-through` cross-portal duplicate (§1b/3.2) separately would close the single-session version of the same gap — either swap one of its three pair placements for a different exercise, or accept and document that portal categories aren't guaranteed muscle-exclusive.

### 3. Add draft-clearing to `resetProgram()`'s Adventure-specific path · `plan-local`

Detailed in §3.3. A one-line addition (`localStorage.removeItem(adventureDraftKey(user.id))` inside `resetProgram()`, gated on `currentId === ADVENTURE_PLAN_ID`) would make "Reset Current Progress" behave consistently for this plan the way it already does for every other plan's stale-state concerns.

### 4. Compute `estimatedMinutes` from real per-pair arithmetic instead of a 3-value editorial lookup · `hypothesis`

Detailed in §3.1's root cause. A duration model incorporating actual `restSeconds`, set count (always 4 per pair), and a reasonable per-set work-time estimate (e.g. ~30-40s for a working set at the prescribed rep ranges) would make the displayed total both more accurate and self-consistent with `randomize()`'s selection — the same fix partially addresses improvement #1, since an accurate running total is a prerequisite for any budget-aware selection logic.

### 5. Consider surfacing the round-2 "increase load" cross-session signal more prominently, given it's one of the plan's few genuinely working differentiators · `hypothesis`

The `history`-driven `increase` flag (§2) is real, correctly gated (requires either two consecutive top-of-range sets or a 3+ rep PR), and quietly good design — but it's a small `<Zap>` pill easy to miss mid-session, and (per the "Progress by movement" dashboard tile's own framing) is arguably the plan's actual retention mechanic for a free, no-calibration plan with otherwise minimal progression structure. Worth a design pass to make it a first-class part of the session-completion summary rather than an inline per-exercise pill only visible while actively working that exercise.

### 6. Reconcile the `portfolio.ts` `weeks: 4` field against the plan's actual weeks-less structure · `hypothesis`

Detailed in §3.4. Low-stakes given the plan is free and switchable, but worth a look alongside any future portfolio-metadata cleanup — either the quiz's internal comparison logic should treat Adventure specially (it doesn't have a "weeks" concept the way template plans do) or the field should be renamed/repurposed to avoid implying a fixed-length program that doesn't exist.

---

## 7. Verdict

**30-Min Adventure is the strongest-wired plan in Wave 5 so far, and a useful data point that the "entire headline mechanic is dead" pattern is not universal to the wave — it's specific to plans layering an unwired auto-regulation/progression status object on top of an otherwise-templated structure.** Adventure has no such status object to fail to wire: its entire mechanic (pick 5 pairs, log 20 sets, commit) *is* the UI the athlete directly interacts with, and a full live pass confirmed every piece of it — equipment filtering, randomize/reroll, round-2 challenge escalation, weight carry-forward, session completion, and the resulting Firestore writes (`programProgress`, full `workouts` document with correct per-round data and correct bodyweight-mode omission) — works exactly as designed. It is also the first Wave-5 plan with genuine T-9 immunity, via a real dedicated dashboard component rather than an accident of category.

Where it falls short is narrower but still real: two of its three headline marketing claims ("thirty-minute target" / "fit in half an hour," and "never repeat the same pairing twice") are optimistic-to-false given the actual generator mechanism, not because the mechanism is unwired but because it was never built with those specific claims' constraints in mind — `randomize()` has no time-budget awareness, and nothing anywhere tracks or avoids prior selections. Both are honestly disclosed nowhere as strongly as they're claimed elsewhere in the product (the dashboard's own copy hedges the time claim reasonably; the "never repeat" claim has no hedge anywhere it appears). For a free, no-calibration, equipment-aware "grab a workout in 30 minutes" plan aimed at beginners/intermediates per its own `experience` tag, these are moderate-severity findings, not existential ones — the core promise (a real, varied, functioning full-body session with genuine round-2 progression) is delivered; the specific numbers and repetition claim in the marketing copy are the parts that don't fully hold up under live arithmetic.

---

## 8. Export block

```yaml
id: 30-minute-adventure
version: 2
length: { weeks: null, note: "no week/phase structure; freely repeatable session generator; portfolio.ts weeks:4 is quiz-only metadata, not a real program length" }
frequency: user_chosen_2to4_per_week_unenforced
weekly_sets: { per_session_fixed: 20, weekly_total: "depends on athlete-chosen frequency, no fixed weekly template" }
kind: free_plan_session_generator_conditioning_general_fitness
calibration: none
engine: pair_select_session_kind_custom_AdventureSession_and_AdventureDashboard_no_xStatus_dedicated_dashboard_component
systemic_load: { representative_session: 36, axial: 20, lower_back: 16, knee: 4, shoulder: 6, elbow: 12, sets: 20, per_set: 1.80 }
volume_top_representative_session: { glutes: 6.0, frontDelt: 4.0, triceps: 4.0, hamstrings: 4.0, biceps: 3.0 }
positive_findings:
  - "Headline session-generator mechanic is fully wired end-to-end and live-confirmed: real programProgress write with correct startDate (unlike REDLINE's T-37), real per-set workouts document with correct bodyweight-mode weight omission, breaking Wave 5's 2/2 dead-headline-mechanic streak"
  - "First Wave-5 plan with genuine T-9 immunity via a real dedicated dashboard component (Dashboard.tsx's isAdventure early return bypasses the shared dashboardViewWeek path entirely, not just incidentally avoiding it)"
  - "Round-2 challenge/escalation mechanic and cross-session history-driven 'increase load' signal are both real, correctly gated, working progression features — genuinely differentiated design for a free plan with no calibration step"
  - "No adventureStatus/xStatus object at all, so T-2/T-28's allowlist gap is structurally inapplicable rather than merely inert; structurally immune to T-22 and T-23; no reverse-nordic-curl; no classic T-4 duplicated-definition drift; lightest switch-in flow of any Wave-5 plan (no mandatory schedule/equipment step)"
plan_local_bugs:
  - area: "src/data/adventure.ts pair() estimatedMinutes + AdventureSession.tsx randomize()"
    detail: "'Thirty-minute target' / 'fit in half an hour' claims are not reliably met: estimatedMinutes is a flat 5/6/7 editorial lookup by setup tier, not computed from actual rest/reps/set-count; randomize() has no running-total awareness. Live-confirmed: a randomly generated route scored ~33 minutes on the first attempt. Portal-by-portal min/max computation shows the true range is 25-35 minutes depending on selection, with roughly half of all reachable combinations exceeding 30 minutes."
  - area: "src/data/portfolio.ts signatureMechanic + AdventureSession.tsx randomize()/rerollPortal()"
    detail: "'Never repeat the same pairing twice' (shown verbatim to athletes in the Help Me Choose quiz, FollowUps.tsx:42) has no enforcing mechanism anywhere — no history-aware exclusion in randomize/reroll/manual selection, despite AdventureDashboard already resolving prior selectedPairIds for its own last-route display. Also fails within a single session: cable-pull-through appears in pairs spanning two different portals (Abs/Glutes and Biceps/Hamstrings/Lower Back), so a specific two-portal combination trains the identical exercise twice in one 20-set route."
  - area: "src/contexts/UserContext.tsx resetProgram()"
    detail: "No Adventure-specific clause clears the localStorage in-progress route draft (adventure_draft_<userId>), only the in-component resetDraft() does. An athlete resetting progress mid-route will find the abandoned draft restored on next visit, contradicting the Reset button's framing — low-severity, self-correctable via the in-app Clear route control."
  - area: "src/data/portfolio.ts weeks field vs ADVENTURE_PROGRAM.weeks.length"
    detail: "portfolio.ts's weeks:4 (quiz-only metadata) and the onboarding card's '1 WK' badge (from the program's actual single placeholder week) describe different things and are never reconciled for a reader comparing both surfaces. Not independently confirmed to mislead any real decision; low-stakes given the plan is free and switchable."
verification_note: "test_claude continued directly from the prior REDLINE session, no fresh login needed. A full live pass was completed: switch-in (single click, no onboarding step), Random Adventure route generation (~33 min estimate captured), a complete 20-set session driven via direct-DOM set logging with rest-skip and challenge-prompt handling automated, session commit, and direct Firestore cross-checks of both the top-level user document (programProgress) and the newly written workouts subcollection document (per-exercise, per-round setsData) both before and after."
audit: { date: 2026-08-15, findings: 4, verdict: "First Wave-5 plan whose headline mechanic is fully wired and live-confirmed working end-to-end, breaking the wave's 2/2 dead-mechanic streak; and the first Wave-5 plan with genuine T-9 immunity via a real dedicated dashboard. Two narrower marketing claims (time budget, no-repeat) do not hold up under live arithmetic, but neither is dead code — both are real mechanisms that simply weren't built to guarantee the specific claim made about them." }
```
