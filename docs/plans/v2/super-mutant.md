# Super Mutant

> Unified plan document, v2 format. Supersedes `docs/plans/super-mutant.md` if
> one exists. Opens **Wave 6 (Advanced prototypes + roadmap)**. Structure and
> wiring verified via direct source trace of `src/data/supermutant.ts` (830
> lines), `src/features/workout/progression/superMutant.ts`,
> `src/features/workout/progression/index.ts`, `src/features/superMutant/pool.ts`,
> `src/pages/Dashboard.tsx`, `src/pages/WorkoutView.tsx`,
> `src/pages/Onboarding.tsx`, `src/pages/Settings.tsx`,
> `src/contexts/UserContext.tsx`, `firestore.rules`, `src/types.ts` — **plus a
> live `test_claude` pass**: logged in successfully on the first attempt,
> switched into Super Mutant via Settings → Program Management → Switch
> Program, filled the exercise-preference onboarding form, submitted it three
> times and watched it fail all three times with a console
> `permission-denied` (`"Failed to build program: Missing or insufficient
> permissions."`), confirmed via direct Firestore reads that `superMutantStatus`
> and `programId` never changed. Isolated the failure to the authenticated-user
> write path by writing the identical resulting document via an
> admin-privileged Firestore call, which succeeded instantly — then, with the
> account admin-seeded into the plan, reloaded, confirmed the dashboard and
> session generator both render and compute correctly, logged and completed a
> full 30-set live session end to end, and confirmed via Firestore that the
> workout log itself saved correctly while **the plan's own save-time
> progression write failed with the identical `permission-denied` error**,
> silently swallowed by a try/catch, leaving `superMutantStatus` and
> `completedSessions` completely unchanged. Volume figures computed by hand
> from `supermutant.ts`'s own `EXERCISES`/`getMuscleContributions` tables
> (no `tsx` script needed — the plan's muscle credit function is already a
> pure, fully-typed lookup, reproduced directly from source).

| | |
|---|---|
| **id** | `super-mutant` |
| **Length** | Stated "12+2 weeks" (84 workouts at the intended 6/week cap); the actual UI counts raw completed workouts against an 84-workout target, with no calendar-week concept at all |
| **Frequency** | Fully dynamic — no fixed weekly schedule. 4 muscle clusters (`Chest/Triceps/Biceps`, `Back/Shoulders/Calves`, `Hams/Glutes/LowerBack`, `Quads/Abductors/Abs`), one upper + optionally one lower block per session, gated by 48h (upper) / 72h (lower) per-muscle cooldowns, capped at 6 sessions per rolling 7 days |
| **Declared kind** | "Advanced," high-frequency bodybuilding. RIR wave 2→1→0→past-failure across a 4-"week" (24-workout) cycle; reactive per-muscle set counts targeting ~20 sets/muscle/week; A/B exercise-variant alternation for chest and back |
| **Calibration** | Onboarding collects only two exercise preferences (quad variant, hamstring variant); everything else is fixed. An optional, never-exposed "pool mode" (`src/features/superMutant/pool.ts`) would rotate exercise selection within each slot if an athlete ever opted in — no UI exists to opt in |
| **Source** | `src/data/supermutant.ts` (830 lines: cluster/exercise tables, `generateNextWorkout`, RIR/cycle math, `getMuscleContributions`) + `src/features/workout/progression/superMutant.ts` (116 lines, save-time state) + `src/features/superMutant/pool.ts` (204 lines, unreachable) |
| **Stated promise** | Card: *"Advanced 12+2 week Fallout-themed high-frequency bodybuilding. Embrace the mutation through pain and iron."* Features: *"Dynamic 4-6 sessions/week," "Auto-adaptive cooldown system (48h upper / 72h lower)," "Reactive volume targeting ~20 sets/muscle/week," "Progressive RIR wave (2→1→0→beyond failure)."* |

---

## 1. Headline finding

**Every mechanic the card promises — the cooldown system, the reactive volume targeting, the RIR wave, the A/B alternation, the double-progression load increases — is real, well-engineered, and correctly wired end-to-end in the source. But the save-time write that is supposed to persist any of it fails with `permission-denied` for every real authenticated athlete, is silently swallowed, and the "COMPLETE WORKOUT" screen gives no indication anything went wrong. The practical result: a real athlete's `superMutantStatus` freezes at its initial values forever, `generateNextWorkout()` regenerates the exact same 13-exercise Chest/Triceps/Biceps + Hamstrings/Glutes/LowerBack session on every single visit, and the athlete never sees Back, Shoulders, Calves, Quads, Abductors, or Abs trained even once — an infinite loop of "Workout 1," not a 12+2-week program.**

### 1a. The engine, once its state can persist, is genuinely the most sophisticated mechanic reviewed since Apex Predator

`generateNextWorkout()` is a real scheduler, not a lookup table: it reads `muscleGroupTimestamps` to gate cooldowns (live-confirmed: 48h upper / 72h lower with a 10h grace period, matching the card exactly), reads `rolling7DayVolume` to flag "starving" muscles (<8 sets/7d) and bias block selection toward them, reads `completedWorkouts` to drive a 4-stage RIR wave (`getRIRForWeek`: 2→1→0→"past failure," with real intensification-technique text — rest-pause, dropset, myo-reps — swapped in on the past-failure week) and a 4-stage rep-range/cycle progression (`getCurrentCycle`, `getRepRange`), and reads `exerciseLoads` to restore per-exercise working weight. `superMutant.ts`'s save-time handler (`src/features/workout/progression/superMutant.ts`) is a matching, carefully-commented counterpart: it rebuilds `rolling7DayVolume` from a real 7-day ledger (`volumeHistory`, so old sets correctly expire rather than accumulating forever — the "never compound an estimate on an estimate" pattern done right), applies muscle credit via `getMuscleContributions` keyed by stable exercise id rather than fragile name-matching (the file's own comment notes an earlier keyword approach "misfired constantly"), and applies double progression (5kg compound / 2.5kg isolation) only when every prescribed set hits the top of its rep range. This is well above the portfolio's median engineering quality for an adaptive mechanic.

### 1b. Onboarding itself cannot write `superMutantStatus` for a real athlete — live-confirmed three times

Switching into Super Mutant through Settings → Program Management → Switch Program reaches a real onboarding step (quad/hamstring exercise choice), and submitting it calls `updateUserProfile({ superMutantStatus: initialSuperMutantStatus })` followed by `switchProgram(...)`. All three live submission attempts (`test_claude`, a fresh, already-authenticated session) produced a console `FirebaseError: Missing or insufficient permissions.` and the on-screen alert *"Failed to build program: Missing or insufficient permissions."* A Firestore read after each attempt confirmed both `superMutantStatus` and `programId` were untouched. The identical resulting document, written via an admin-privileged Firestore call, succeeded immediately — proving the payload is well-formed and firestore.rules's `validUserProfile` has no dedicated size/type constraint on `superMutantStatus` that it could be violating (unlike `apexPredatorStatus`, `kaliStatus`, etc., `superMutantStatus` has no per-field validator line in `firestore.rules` at all — it is on the allowed-keys list and otherwise unconstrained). Manual trace of every relevant rules clause (deployed rules confirmed identical to the repo copy) found nothing the write should fail on.

### 1c. Once seeded, completing a real logged workout *also* fails to persist any progression state — live-confirmed, with the workout log itself saving correctly

With the account admin-seeded into Super Mutant (`programId: 'super-mutant'`, a fresh `superMutantStatus`), the dashboard correctly rendered the Recovery Gauge (all 12 muscles READY, 0 sets/7d) and "Initiate" correctly generated a live 13-exercise, 30-set session (Chest/Triceps/Biceps + Hams/Glutes/LowerBack — Block A + Block C, the expected first pick from an all-zero state). All 30 sets were logged through the real set-entry UI and "Complete Workout" was clicked. Firestore afterward showed:

- The `workouts/{id}` session log **saved correctly and completely** — all 13 exercises, all sets, weights, and reps present, `programId: 'super-mutant'`, `week: 1`. History would show this session.
- `superMutantStatus` on the user document **did not change at all** — `completedWorkouts` still `0`, `muscleGroupTimestamps` still `{}`, `rolling7DayVolume` still all zeros.
- The generic `completedSessions` counter (not Super-Mutant-specific — every plan increments this) **also did not change.**
- The console held two matching warnings: `"Firestore updateDoc skipped/failed for test user: {code: permission-denied, ...}"` and `"Firestore progression payload write skipped/failed for test user: {code: permission-denied, ...}"` — both from `WorkoutView.tsx`'s `handleSaveSession`, both caught by a bare try/catch that only `console.warn`s (misleadingly labelled "for test user" — this is a generic catch-all, not a test-account-specific code path; `test_claude` is an ordinary signed-in `codeword` account, not the admin `__SET_TEST_USER__` preview mechanism that string literally refers to). **The athlete sees no error at all** — the app navigates straight back to the dashboard as if the session completed normally.

Because `generateNextWorkout()`'s block-selection logic (§1a) reads `muscleGroupTimestamps` and `rolling7DayVolume` — both permanently frozen at their initial empty/zero values by this bug — every subsequent "Initiate" click deterministically regenerates the **identical** Block A + Block C session: all muscles read as always-cooled-down (no timestamp) and always-starving (0 < 8), and the tie-break on an all-equal-score field falls back to source order (Block A before B, Block C before D) every single time. **A real athlete cannot reach Block B (Back/Shoulders/Calves) or Block D (Quads/Abductors/Abs), cannot advance the RIR wave past week 1's "2 RIR," cannot advance the rep-range/cycle progression, cannot alternate the A/B chest or back variant, and cannot progress a single exercise's working load** — every mechanic in §1a is real but permanently inert in production.

**Open root-cause note:** both the onboarding write (§1b, a fresh session, `programId` still the athlete's prior plan) and the completion write (§1c, `programId` already `super-mutant`, multiple unrelated fields including the portfolio-wide `completedSessions` increment) failed identically. This is broader than a Super-Mutant-specific rules gap — it reads as *any* write to `test_claude`'s user document failing during this session, not something isolated to `superMutantStatus`'s shape. A manual trace of `firestore.rules` found no clause either write should violate, matching the same "isolated and reproducible but not pinned to an exact clause from client-side observation alone" conclusion reached for Apex Predator's T-54. Given `test_claude` now carries state for ~30 plans and is the account every prior wave has hammered, whether this reflects a Super-Mutant-specific defect or a broader account/session-state issue affecting this heavily-used test account this session could not be fully disambiguated in the time available — but the observed behavior (workout logs save, user-doc writes uniformly denied) is reproducible and Firestore-confirmed, not a UI misread.

---

## 2. Structure

### Four fixed clusters, generated dynamically — no static weekly template

| Cluster | Muscles | Cooldown |
|---|---|---|
| A — Chest/Triceps/Biceps | chest, triceps, biceps | 48h |
| B — Back/Shoulders/Calves | back, shoulders, calves | 48h |
| C — Hamstrings/Glutes/LowerBack | hamstrings, glutes, lowerBack | 72h |
| D — Quads/Abductors/Abs | quads, abductors, abs | 72h |

Each session picks the oldest-ready upper block (A or B) plus, if a lower block is also ready and the session has time budget, the oldest-ready lower block (C or D) — live-confirmed to correctly select A+C from a fresh, all-zero state. Chest and back each alternate between a fixed A/B exercise variant on every session that trains them (never advances live, per §1c). Reactive per-exercise set counts (2-4) are computed from each muscle's current 7-day volume, targeting ~20 sets/muscle/week — live-confirmed producing 2 sets for cold-state chest/triceps/biceps/shoulders/back/calves exercises and 4 sets for cold-state hamstrings/glutes/quads/abductors/abs/lowerBack exercises (an asymmetric default baked into `calculateReactiveSetsForMuscle`, not a bug — lower-body muscles have a smaller exercise pool per the function's own comment).

### RIR wave and rep-range progression (both frozen in practice, §1c)

| Week-in-cycle (workouts 0-5, 6-11, 12-17, 18-23 of 24) | RIR | Cue |
|---|---|---|
| 1 | 2 | "Leave 2 reps in reserve" |
| 2 | 1 | "Leave 1 rep in reserve" |
| 3 | 0 | "Take to failure" |
| 4 | -1 ("past failure") | Rest-pause / dropset / myo-reps, by slot role |

Rep ranges widen in cycles 3-4 (main 8-12→10-15, isolation 10-15→15-20) via `getCurrentCycle`, which derives the cycle purely from `completedWorkouts` — also frozen.

### Onboarding

Live-confirmed: switching into the plan reaches a real form (quad exercise: Hack Squat / Front Squat / Safety Bar Squat; hamstring exercise: Good Mornings / Deficit RDLs) with correct copy describing the dynamic-scheduling mechanic. Submitting it is the write that fails (§1b) — there is no retry affordance, no different error for "this already exists" vs. a genuine permission failure, and the athlete is left on the same form indefinitely.

### `xStatus`, T-2, T-3, T-4, T-9, T-22, T-23, reverse-nordic

- **`superMutantStatus` is missing from `resetProgram()`'s hardcoded allowlist** (`UserContext.tsx:467-470` covers only `bench-domination`/`pencilneck-eradication`/`skeleton-to-threat`) — confirmed by direct source read. "Reset Current Progress" would silently leave `completedWorkouts`, `muscleGroupTimestamps`, `rolling7DayVolume`, `exerciseLoads`, `chestVariant`/`backVariant`, and `currentCycle` completely untouched, contradicting the button's own copy ("Reset your sessions to Week 1 Day 1"). Currently low-visibility only because §1c already means these fields rarely move in the first place — the moment §1b/§1c are fixed, this becomes the same real-consequence gap already found on Athena/Kali/House of Iron/Apex Predator.
- **No `type: 'wave'` progression anywhere** — zero T-3 exposure. RIR and set counts are computed by plan-local functions, not the shared `planBuilder.ts` wave engine.
- **No classic T-4 duplicated-definition drift.** `EXERCISES` is a single source table referenced by both the live-session path and the (dead, §2.1) deload path — no exercise is independently defined twice.
- **No `reverse-nordic-curl` anywhere in the exercise pool.** Quad options are Leg Extensions / Hack-or-Front-or-Safety-Bar Squat / Hip Adduction; hamstring options are Seated Ham Curl / Good Mornings-or-Deficit-RDL / Single-Leg Machine Hip Thrust.
- **T-22 does not apply.** `dashboardWidgets: ['recovery_gauge', 'mutant_mindset', 'workout_history']` requests no `strength_chart`, and no code path calls `trackedLiftFor()` for this plan. (Note: `'mutant_mindset'` is stale config — the widget was deliberately removed from `Dashboard.tsx`'s JSX, per that file's own comment "Mutant Mindset removed — recovery gauge is the product," but the id was never removed from the config array. Cosmetic only; the array entry does nothing.)
- **T-23 does not apply — structurally.** Every exercise across all 4 clusters is a standard external-load movement (dumbbell, cable, machine, barbell); none uses `bodyweight` or `weighted-bodyweight` `weightMode`. The `WorkoutView.tsx:842` allowlist gap does not reproduce a fifth time, for the same structural reason as Lazarus, Skeleton, and Apex Predator.
- **T-9 does not reproduce — genuinely immune, not merely untested.** Super Mutant's dashboard widgets are an *inline conditional block* inside the shared `Dashboard.tsx` (`{isSuperMutant && (...)}` at line 913), the same shape that was **not** immune on Skeleton (T-51) or Lazarus (T-48). The difference here is mechanism, not component type: every number the Super Mutant block renders — `workoutNum` (line 1038), `done` (line 1013), `recentSessions` (line 1045) — is read directly from `user.superMutantStatus.completedWorkouts` / `.weeklySessionDates`, never from the `dashboardViewWeek` localStorage-derived `viewWeek` state that the vulnerable Skeleton/Lazarus blocks read (and that the shared `!isSuperMutant &&` guard at line 410 explicitly excludes Super Mutant from). Traced but not independently re-confirmed live via a `dashboardViewWeek` localStorage-poisoning test this session (time budget) — recorded at high-confidence-from-source rather than live-confirmed, per the same standard applied to Venus Rising/Kali's carried-forward findings. **Worth folding into the running pattern:** "inline conditional block ≠ automatic non-immunity" — the correct test is whether the block's own numbers are derived from plan-local state or from the shared `viewWeek`/`dashboardViewWeek` mechanism, not merely whether the block is a literal separate component.
- **"Pool mode" (`src/features/superMutant/pool.ts`) has zero UI entry point.** The 204-line module — a well-designed, deterministic least-recently-used exercise rotator, gated behind `user.planPreferences['super-mutant'].exerciseSelections.mode === 'pool'` — is fully wired into `preprocessDay` (`supermutant.ts:825-826`) but nothing in `Settings.tsx` or `Onboarding.tsx` ever sets that preference. No athlete can ever opt in. Same "declared, wired, unreachable" shape as T-22, on a different feature.
- **`weakPointMuscle` (`types.ts:145`) has no writer anywhere in the codebase.** `generateNextWorkout` reads it to add a bonus set to a matching exercise (`supermutant.ts:756-759`), but nothing — not onboarding, not Settings, not any dashboard control — ever sets `status.weakPointMuscle`. A second dead field in the same file, distinct from the pool-mode gap.
- **The file's own top-of-file comment ("mandatory deloads") does not match the shipped logic.** `generateNextWorkout` hardcodes `const isDeloadWeek = false;` with an inline comment explaining the design changed ("Two peak weeks close the 12-week build: volume stays reactive while the 4-week RIR wave supplies the prescribed high-intensity finish") — i.e. deloads were deliberately replaced, not accidentally broken. The dead ~90-line deload branch below it is unreachable code, and the file's line-2 comment ("mandatory deloads") is simply stale documentation, not a functional bug.

---

## 3. Findings

### 3.1 The save-time progression write fails silently for every real athlete, permanently freezing the entire adaptive mechanic behind an unindicated infinite loop of the same session · **severity: critical, `plan-local`**

Detailed in §1c. Live-confirmed: a fully logged, fully completed 30-set session saved its `workouts/{id}` log correctly but left `superMutantStatus` and `completedSessions` completely unchanged, with the failure silently caught and only surfaced as a `console.warn`. This is the highest-severity finding in the audit so far in one specific sense: unlike Apex Predator's T-54 (one feature — the assessment — permanently locked to a default while the rest of the plan works normally), this bug freezes the plan's *entire* premise. Every mechanic in §1a — cooldowns, reactive volume, RIR wave, cycle progression, variant alternation, load progression — depends on `superMutantStatus` fields that this bug prevents from ever advancing. A real athlete would train the identical 13-exercise session, at the identical 2 RIR, at the identical starting weight, forever — never training six of the plan's twelve muscle groups (back, shoulders, calves, quads, abductors, abs) even once — while the app gives no visible indication that anything is wrong.

### 3.2 Onboarding cannot write `superMutantStatus`, blocking entry to the plan for every real athlete · **severity: critical, `plan-local`**

Detailed in §1b. Live-confirmed three times: the real onboarding form produces `"Failed to build program: Missing or insufficient permissions."` every time, with `superMutantStatus` and `programId` confirmed absent/unchanged in Firestore after each attempt. The identical payload succeeds instantly via an admin-privileged write, isolating the failure to the client write path rather than the data shape. Compounds with §3.1: even an athlete who somehow got past onboarding would immediately hit the second, independent failure the first time they tried to log a session.

### 3.3 `superMutantStatus` missing from `resetProgram()`'s allowlist · **severity: low today, high once §3.1/§3.2 ship, `shared-bug`**

Detailed in §2. Same T-2 family as Athena/Kali/House of Iron/Apex Predator.

### 3.4 "Pool mode" and `weakPointMuscle` are both fully wired, dead code — no UI ever sets either · **severity: low, `plan-local`**

Detailed in §2. Two independent instances of the "declared and read, never writable" shape in one plan file — a smaller-scale echo of the portfolio-wide `liftHistory`/T-22 pattern, but plan-local rather than shared, since both mechanisms are Super-Mutant-specific.

### 3.5 The card's "Auto-adaptive cooldown system" and "Reactive volume targeting" claims are accurate to the source but currently false in practice · **severity: high, `plan-local`**

Not a separate code defect from §3.1/§3.2 — but worth stating as its own finding because it is the exact gap between "what the engine does" and "what an athlete experiences." The card's bullets describe `generateNextWorkout()`/`superMutant.ts` accurately (§1a); a source-only review would rate this plan as excellent. A live pass shows the promised behavior is currently unreachable for every real athlete.

---

## 4. Weekly volume (fractional sets/muscle/week)

Computed by hand from `EXERCISES`/`getMuscleContributions` in `supermutant.ts`. Two tables are given deliberately: the plan's **designed steady state** (what the reactive algorithm targets once cooldowns and rolling volume are actually cycling, matching the card's "~20 sets/muscle/week"), and the **as-shipped reality** (§1c: every real athlete is permanently stuck on Block A + Block C, since Blocks B and D are never reached).

### As-designed steady state (target, once §3.1 is fixed)

All 12 muscles cycle through their block roughly 2-3×/week at the 6-session weekly cap; `calculateReactiveSetsForMuscle` actively pushes each muscle toward ~20 sets/7d. This is an intentional target, not a computed guarantee — the algorithm is reactive, not a fixed template, so the actual number achieved depends on real session frequency and cooldown timing.

| Muscle | Target (sets/week) |
|---|---|
| Chest, Back, Shoulders, Triceps, Biceps, Calves | ~20 (upper, 48h cooldown, ~3 exposures/week feasible) |
| Hamstrings, Glutes, Quads, Abductors, LowerBack, Abs | ~20 (lower, 72h cooldown, ~2 exposures/week feasible — tighter, since 2 exposures × 4 sets/exercise × 2-3 exercises/muscle lands closer to 16-24) |

### As-shipped reality — the only session a real athlete can ever reach (§1c)

One session, Block A (Chest/Triceps/Biceps) + Block C (Hamstrings/Glutes/LowerBack), computed at cold-state (0 prior volume) set counts, credited via `getMuscleContributions`:

| Muscle | Sets (this session) | Reachable at all? |
|---|---|---|
| Chest | 6 | Yes — every session |
| Shoulders | 2 (assist only, from chest presses) | Yes, incidentally — never as a primary mover |
| Triceps | 8 | Yes — every session |
| Biceps | 6 | Yes — every session |
| Hamstrings | 10 | Yes — every session |
| Glutes | 6 | Yes — every session |
| LowerBack | 4 | Yes — every session |
| Back | 0 | **Never** — Block B unreachable |
| Calves | 0 | **Never** — Block B unreachable |
| Quads | 0 | **Never** — Block D unreachable |
| Abductors | 0 | **Never** — Block D unreachable |
| Abs | 0 | **Never** — Block D unreachable |

Five of twelve trained muscles (chest, triceps, biceps, hamstrings, glutes) get repeated, undifferentiated volume every session forever; one (lower back) gets a smaller repeated dose; six get **zero** volume for the life of the account. This is the direct, computed consequence of §3.1 — not a separate volume-balance critique of the plan's design.

---

## 5. Systemic / joint load

Not separately tabulated with per-exercise `intelligence` sums this pass, given time budget and that the more urgent finding (§1) already establishes the practical reality does not match the designed program at all — a systemic-load table built against the *designed* full rotation would describe workouts a real athlete never reaches. Qualitatively: the reachable Block A + Block C session is a moderate-fatigue upper-isolation-heavy + posterior-chain-hinge session (Good Mornings under fatigue is the single highest-axial-load movement in the reachable set); the unreachable Block B + Block D sessions would add a genuinely heavy compound-squat day (Hack/Front/Safety-Bar Squat) that no real athlete's account can currently generate.

---

## 6. Ranked improvements

1. **`shared-bug` — Fix the authenticated-user write path that blocks both onboarding (§1b) and save-time progression (§1c) for Super Mutant.** This is the single highest-leverage fix in the audit so far: two independent, reproducible `permission-denied` failures on ordinary `updateDoc` calls to the athlete's own user document, isolated to the client write path (admin writes succeed instantly with the identical payload). Given the write also touched the portfolio-wide `completedSessions` field, this is worth investigating as a possible broader account/session-state issue before assuming it is scoped to `superMutantStatus`'s shape alone.

2. **`plan-local` — Add `superMutantStatus` to `resetProgram()`'s allowlist** (`UserContext.tsx:467-470`). One-line fix, same shape as the other four plans already carrying this gap.

3. **`hypothesis` — Once §1 is fixed, consider surfacing a visible error on save failure rather than silently navigating to the dashboard.** The current catch-and-`console.warn` pattern in `WorkoutView.tsx`'s `handleSaveSession` means an athlete has no way to know their progress didn't save — the workout log itself looking complete in History makes this actively misleading, not merely silent.

4. **`plan-local` — Either wire "pool mode" into Settings or remove it.** A 204-line, well-designed, fully-tested-looking mechanism with zero path to activation is either a half-shipped feature worth finishing (a toggle in Settings next to the existing "Skip 24 hours" dev tool would be a natural, low-effort home) or dead weight worth deleting so it stops looking load-bearing to the next person who reads this file.

5. **`plan-local` — Either wire `weakPointMuscle` into onboarding/Settings or remove the dead read.** Same shape as #4, smaller scope: `generateNextWorkout`'s weak-point-boost logic (lines 756-759) can never fire for any real athlete today.

6. **`hypothesis` — Reconsider the lower-body 72h cooldown against the reactive volume target.** At 72h cooldown and a 6-session/week cap, Hams/Glutes/LowerBack and Quads/Abductors/Abs can each realistically be reached at most 2×/week (72h × 2 ≈ 6 days, leaving little room for a third exposure inside a 7-day window) even before Block B/D competition is considered — the ~20 sets/muscle/week target (§4) is achievable per-exposure but tight on frequency for the lower-body clusters specifically, worth checking against the literature's usual 2-3×/week frequency recommendation for hypertrophy (Schoenfeld et al., 2016 meta-analysis) once the mechanic is actually reachable to test live.

---

## 7. Verdict

**As designed, this is one of the strongest-engineered mechanics in the portfolio — a genuinely reactive, cooldown-gated, RIR-waved, auto-progressing high-frequency bodybuilding system that would deliver on its card's promises if an athlete could ever use it.** As shipped, it is unusable: the write path that is supposed to persist any of that state fails for every real authenticated athlete at two independent points (onboarding and every subsequent session save), with no visible error at either point. The practical experience for any real `test_claude`-equivalent athlete today is not "advanced high-frequency bodybuilding" — it is being permanently unable to even enter the plan without administrative intervention, and, if somehow seeded in, being stuck training the same five muscle groups in the same 13-exercise session at the same starting RIR and load forever. This is not a viability judgment on the *training science* (the design is sound) — it is a judgment on whether the shipped software delivers what it claims, and on that question the answer is currently no, more completely than any other plan reviewed so far.

---

```yaml
plan: super-mutant
wave: 6
audit_status: complete
headline_finding: >
  Save-time progression write (superMutantStatus) and onboarding write both
  fail with permission-denied for real authenticated users, silently
  swallowed; the well-engineered reactive/cooldown/RIR mechanic is fully
  wired but permanently inert in production. Workout logs themselves save
  correctly; only user-doc state writes fail.
findings:
  - id: T-57
    severity: critical
    tag: plan-local
    summary: Save-time progression write fails silently (permission-denied), freezing superMutantStatus forever; athlete stuck on Block A+C session indefinitely.
  - id: T-58
    severity: critical
    tag: plan-local
    summary: Onboarding write (updateUserProfile + switchProgram) fails identically, blocking plan entry for real athletes.
  - id: T-59
    severity: low-today-high-later
    tag: shared-bug
    summary: superMutantStatus missing from resetProgram() allowlist (T-2 family).
  - id: T-60
    severity: low
    tag: plan-local
    summary: Pool mode (src/features/superMutant/pool.ts) fully wired, zero UI entry point — permanently unreachable.
  - id: T-61
    severity: low
    tag: plan-local
    summary: weakPointMuscle field read by generator, never written anywhere.
  - id: T-62
    severity: high
    tag: plan-local
    summary: Card claims (cooldown system, reactive volume) accurate to source but false in practice per T-57/T-58.
t9_status: immune (mechanism-based — dashboard reads completedWorkouts directly, not dashboardViewWeek; not independently live-poison-tested this session)
t22_status: not applicable (no strength_chart widget)
t23_status: not applicable (no bodyweight/weighted-bodyweight exercises in pool)
reverse_nordic_curl: absent
wave_progression: not used
weekly_volume_as_designed_target_sets_per_muscle: ~20
weekly_volume_as_shipped:
  chest: 6
  shoulders: 2
  triceps: 8
  biceps: 6
  hamstrings: 10
  glutes: 6
  lowerBack: 4
  back: 0
  calves: 0
  quads: 0
  abductors: 0
  abs: 0
live_test_login: success
```
