# Apex Predator

> Unified plan document, v2 format. Supersedes `docs/plans/apex-predator.md`
> if one exists. Seventh and final plan of **Wave 5 (Conditioning /
> constrained)** — closes the wave. Structure and wiring verified via direct
> source trace of `src/data/plans/apexPredator.ts`,
> `src/features/apexPredator/ApexDashboard.tsx`,
> `src/features/apexPredator/assessment.ts`,
> `src/features/apexPredator/prescription.ts`,
> `src/features/apexPredator/videoAdvice.ts`, `src/data/apexAccess.ts`,
> `src/pages/Dashboard.tsx`, `src/contexts/UserContext.tsx`,
> `firestore.rules`, `src/data/portfolio.ts`, `src/contexts/translations.ts`,
> `src/types.ts` — **plus a full `test_claude` live pass**: logged in on the
> first attempt, switched into Apex Predator (mandatory 3-day Mon/Wed/Fri
> weekday selection), landed directly on the plan's onboarding movement
> assessment (Checkpoint 0), entered fallback scores for all 6 regions,
> attempted **Save Assessment twice** and watched it fail both times
> ("The assessment could not be saved"), confirmed via direct Firestore
> reads that `apexPredatorStatus` was absent both times, confirmed the
> identical payload succeeds instantly via an admin-privileged write
> (isolating the failure to the client write path, not the data shape),
> then — with the admin-seeded assessment in place — reloaded, confirmed the
> dashboard correctly resolved emphasis to "Ankle dorsiflexion + Hip
> rotation," started Session A, and confirmed both `apex-access-placeholder`
> slots resolved live to the correct exercises (Loaded Ankle Rock, Loaded
> 90/90 Hip Transition) with the correct level-1 ROM cue text. Also ran a
> deliberate `dashboardViewWeek` localStorage-poisoning test to confirm T-9
> immunity. Volume and systemic figures computed from a throwaway `tsx`
> script (deleted after use) resolving all 16 distinct exercise ids against
> `EXERCISE_BY_ID`'s native primary/secondary categorization and
> `intelligence` block (16/16 resolved).

| | |
|---|---|
| **id** | `apex-predator` |
| **Length** | 12 weeks, 6 phases (Stalk 1-3, First Hunt·Retest 4, Adapt 5-7, Second Hunt·Retest 8, Apex 9-11, Final Hunt·Retest 12) over 3 static `DaySpec` days (A/B/C) |
| **Frequency** | Fixed 3 days/week, mandatory weekday selection at onboarding |
| **Weekly sets** | 47 mandatory sets/week (Stalk/Adapt/Apex phases) across 3 sessions; 40 on retest weeks 4/8 (transform clamps every slot to `min(sets, 2)`); 28 on the week-12 Final Hunt (`sets>=3?2:1`, laterals held at 2) — see §4 |
| **Declared kind** | All experience levels, `adaptability: 'adaptive'`, `fatigue: 2`, goal `['assessment', 'general']` |
| **Calibration** | `applyApexAccess` (`preprocessDay` hook) substitutes two `apex-access-placeholder` slots per relevant day with real corrective-movement exercises, chosen from `user.apexPredatorStatus.emphasis.regions` |
| **Source** | `src/data/plans/apexPredator.ts` (47 lines) + `src/features/apexPredator/{assessment,prescription,videoAdvice}.ts` (~100 lines) + `src/features/apexPredator/ApexDashboard.tsx` (87 lines) + `src/data/apexAccess.ts` (24 lines) |
| **Stated promise** | Card: *"A 12-week full-body plan that turns repeatable movement assessments into focused access work."* Features: *"3 full-body days," "Six optional measured regions," "Retests in weeks 4, 8 and 12," "Optional AI video advice."* Portfolio quiz `signatureMechanic`: *"Repeatable movement assessments that turn into at most two access movements per session."* |

---

## 1. Headline finding

**The plan's entire signature mechanic — a movement-access assessment that drives which corrective exercises appear in every session — is real, well-designed, and (once seeded) demonstrably works end-to-end live. But the one button that writes it, "Save Assessment," fails for every real athlete, every time, permanently locking the plan onto its untested default (ankle + thoracic rotation) for its full 12-week run.**

### 1a. The assessment engine, once it has data, is the cleanest-built mechanic in Wave 5

`ApexDashboard.tsx` presents six optional movement tests (ankle dorsiflexion, active straight-leg raise, hip rotation, shoulder flexion, shoulder rotation, thoracic rotation) — each accepting either an exact left/right measurement or a 1-3 fallback score, with an explicit "Pain — invalidate result" option that correctly excludes a painful test from scoring (`validRegionScore` returns `null` on `pain === 'pain'`, live-confirmed via the "Fewer than 3 valid regions" / "N valid regions" live counter reacting correctly to every fallback-score entry). `selectApexEmphasis` picks the two lowest-scoring valid regions, tie-broken first by left/right asymmetry then by not-recently-emphasized, and correctly falls back to `['ankle', 'thoracicRotation']` when fewer than 3 regions are valid — all confirmed by direct trace (`src/features/apexPredator/assessment.ts:24-33`) and, once seeded, live: entering fallback scores of ankle=1, hipFlexion=3, hipRotation=1, shoulderFlexion=3, shoulderRotation=2, thoracicRotation=3 and reading back the resulting emphasis correctly produced "Ankle dorsiflexion + Hip rotation" (the two lowest, tied-at-1 pair, in region-declaration order). `applyApexAccess` (`prescription.ts`) then substitutes the plan's `apex-access-placeholder` slots with real exercises from `APEX_ACCESS`, live-confirmed: with emphasis seeded to `[ankle, hipRotation]`, Day A's two placeholder slots resolved exactly to **Loaded Ankle Rock** and **Loaded 90/90 Hip Transition**, each carrying the correct level-1 ROM cue text ("Knee to toes" / "Hands supported") sourced from `romCues[Math.min(level,...)-1]` with `level` defaulting to 1 for a fresh assessment. This is a genuinely sophisticated, correctly-executing adaptive mechanic — the strongest piece of "declared feature actually does what the card says" engineering found anywhere in Wave 5.

### 1b. "Save Assessment" cannot be completed by any real athlete — live-confirmed, twice

Every attempt to save an assessment through the actual onboarding UI — the only route a real athlete has into this mechanic — fails. Two independent live attempts (identical fallback-score payload both times, `test_claude`, fresh onboarding into the plan) both produced the on-screen error **"The assessment could not be saved"** after clicking Save. A direct Firestore read after each attempt confirmed `apexPredatorStatus` was entirely absent from the user document both times — this is not a display-only error masking a successful write. Console and network instrumentation (added mid-session, listening for uncaught errors, unhandled promise rejections, and `console.error`) captured nothing on either attempt, consistent with `ApexDashboard.tsx`'s `save()` swallowing the underlying error into a generic catch-all with no logging.

To isolate the cause, the **exact same payload** the client attempted (assessments array, region scores, emphasis) was written directly via an admin-privileged Firestore call. **It succeeded immediately, on the first try**, with no schema or size-limit rejection — proving the assessment object itself is well-formed and fully compliant with `firestore.rules`'s `validUserProfile` constraints (`apexPredatorStatus.size() <= 6`, the field is on the allowed-keys list, `userAuthorityUnchanged()` and `validSelectedProgram()` both hold since the update never touches `ownerUid`/`id`/`codeword`/`allowedPlanIds`/`programId`). Manual line-by-line trace of every relevant `firestore.rules` clause against the live-fetched deployed rules text (confirmed identical to the repo's `firestore.rules`, so this is not a stale-deployment gap) found no rule the payload should fail. The failure is real, reproducible, and isolated to the authenticated-user write path specifically — but its exact trigger could not be pinned to a single rule clause or SDK-level cause from client-side observation alone within this session (deeper network/body inspection was blocked by this session's own tooling sandbox). What is certain: **no athlete using the shipped app can ever save a real assessment**, and the plan silently and permanently runs on its untested-fallback emphasis (`ankle` + `thoracicRotation`) for every athlete, every week, for the full 12-week program — since `ApexDashboard`'s read path uses the identical `?? ['ankle', 'thoracicRotation']` fallback whether the fallback exists because of a genuinely unlucky assessment or because the assessment was simply never allowed to be written.

### 1c. Once data exists (by any means), the read/prescription path is fully live-confirmed correct

With the admin-seeded assessment in place, reloading the dashboard correctly showed "APEX PROFILE · WEEK 1 — Ankle dorsiflexion + Hip rotation," the "Latest assessment" table correctly echoed the seeded ankle score (1) and correctly showed "—" for the four unset regions, and starting Session A produced a live 17-set workout with the two access placeholders correctly resolved (§1a). This confirms the entire downstream mechanic — dashboard emphasis display, session generation, ROM cue selection — genuinely works; only the one write that is supposed to feed it from a real assessment is broken.

---

## 2. Structure

### Three static days, six mandatory placeholder-bearing slots

| Day | Slots | Placeholders |
|---|---|---|
| A — Lower Access + Push/Pull | Hack Squat (3), Flat DB Press (3), Bench-Supported 1-Arm DB Row (3), Seated Hamstring Curl (2), Lateral Raise (2) | 2× `apex-access-placeholder` (2 sets each) |
| B — Hinge + Vertical | Romanian Deadlift (3), Assisted Pull-up (3), Seated DB Shoulder Press (2), Front-Foot-Elevated Bulgarian Split Squat (2), Single-Arm Reverse Pec Deck (2) | 1× `apex-access-placeholder` (2 sets); Suitcase Carry (1 set, `optional: true`) |
| C — Unilateral + Shape | Deficit Reverse Lunge (3), Hammer Chest Press (2), Single-Arm Hammer Row (3), Hip Thrust (2), Leg Extension (2) | 2× `apex-access-placeholder` (2 sets each) |

`applyApexAccess` resolves each placeholder by cycling a cursor through `accessExercisesFor(emphasis)` (2 entries, one per emphasized region) — Day A and Day C each get one of each emphasized region's exercise; Day B gets only the first. `defaultTempo: '20X0'` is applied plan-wide.

### Phases and the retest transform

`weeks: 12`, six phases: Stalk (1-3, full sets), First Hunt·Retest (4, `min(sets,2)`), Adapt (5-7, full sets), Second Hunt·Retest (8, `min(sets,2)`), Apex (9-11, full sets), Final Hunt·Retest (12, `sets>=3?2:(lateral-raise?2:1)`). The retest weeks are a deload-shaped taper, not literally a retest of anything measured — no code path on a retest week actually re-triggers the movement-access assessment; the plan's own checkpoint schedule (`checkpointFor`: 0/4/8/12) determines when the *dashboard* considers a new assessment "due," which does line up with the retest weeks, but the retest week's only mechanical effect on the workout itself is the set-count clamp.

### Onboarding

Live-confirmed: mandatory "select exactly 3 training days" screen, then straight into the Checkpoint 0 movement assessment (§1). No separate exercise-selection step exists for this plan (unlike Atlas's dead hinge-preference gap) — the assessment screen *is* the plan's only onboarding customization surface, and it is unreachable for its intended purpose (§1b).

### `xStatus`, T-2, T-3, T-4, T-9, T-22, T-23, reverse-nordic

- **`apexPredatorStatus` is a real, load-bearing status object with a genuinely broken write path.** Unlike Iron Clock/REDLINE/Lazarus (status objects nobody ever tries to write to, because no UI step asks for the data) or Skeleton's single-string-literal read bug, this is the first Wave-5 case where the *write UI exists, is reachable, is filled in correctly by the athlete, and still fails* (§1b).
- **`apexPredatorStatus` is missing from `resetProgram()`'s hardcoded allowlist** (`UserContext.tsx:467-470` lists only `bench-domination`/`pencilneck-eradication`/`skeleton-to-threat`) — confirmed by direct source read, no `apex` reference anywhere in `UserContext.tsx`. Currently low-consequence in practice only because no athlete can ever populate the field in the first place (§1b); would have the same real consequence as Athena/Kali/House of Iron's T-2 gaps (a reset that doesn't actually clear a load-bearing field) the moment §1b is fixed.
- **T-9 is structurally immune — confirmed live.** `ApexDashboard` is a true early-returning dedicated component (`Dashboard.tsx:206`: `if (isApexPredator) return <ApexDashboard user={user} />;`, before the shared `dashboardViewWeek` render path at line ~209+ is ever reached) — same shape as Athena/Venus Rising/Kali/House of Iron/30-Min Adventure. Live-confirmed via a deliberate `dashboardViewWeek-test_claude` localStorage-poisoning test (set to `'9'`, reloaded): the dashboard correctly showed "APEX PROFILE · WEEK 1," ignoring the poisoned key entirely.
- **No `type: 'wave'` anywhere** — zero T-3 exposure. All progressed slots use `{ type: 'double', increment: ... }`.
- **No classic T-4 duplicated-definition drift.** Each of the 16 distinct exercise ids is defined exactly once across the three static days.
- **No `reverse-nordic-curl`** anywhere in the exercise pool.
- **T-22 does not apply.** `dashboardWidgets: ['program_status', 'workout_history']` requests no `strength_chart`, and no code path calls `trackedLiftFor()` for this plan.
- **T-23 does not apply — structurally.** All 16 distinct exercise ids in the plan's pool (mandatory slots plus all 6 `APEX_ACCESS` movements) resolve to `weightMode` values of `external`, `bodyweight`, or `timed` — none is `weighted-bodyweight`. Confirmed via direct `EXERCISE_LIBRARY`/`libraryAdditions.ts` lookup for every id. Directly answers the audit brief: the `WorkoutView.tsx:842` allowlist gap does not reproduce a fourth time, for the same structural reason as Lazarus and Skeleton — there is no total-system-weight concept anywhere in this plan's pool.
- **`programProgress['apex-predator']` never received an entry at all**, even after a completed `switchProgram()` call that correctly set `programId: 'apex-predator'` — confirmed via direct Firestore read immediately after switching in. Same shape as REDLINE's T-37, Atlas's T-46, and Lazarus/Skeleton's ordinary-completion equivalent, but the widest instance of the pattern found this wave: here the entry is missing even before a single session is logged, not just missing its `startDate` sub-field after one.
- **The "Optional AI video advice" feature degrades gracefully, exactly as designed, and is not a dead-feature finding.** `appConfig/ai` (confirmed via direct Firestore read) currently has `enabled: false` and `features.videoAnalysis: false` platform-wide — `videoAdviceAvailable()`/`requestApexVideoAdvice()` are both explicitly built to treat this as an expected, non-error state (`analyzeLiftVideo` catches and returns `undefined` rather than throwing, `requestApexVideoAdvice` surfaces a clear "AI video analysis is switched off" message rather than a silent failure). The card's own wording — "Optional" — matches what the athlete actually gets: a functioning upload control that currently declines gracefully, not a promised feature with no path to activation. Contrast with §1b, which is a genuine defect on a feature the card does not even qualify as optional.

---

## 3. Findings

### 3.1 The movement-access assessment — the plan's entire signature mechanic — cannot be saved by any real athlete, permanently locking every athlete onto the untested default emphasis · **severity: critical, `plan-local`**

Detailed in §1b. Live-confirmed twice: identical fallback-score payloads through the real onboarding UI both produced "The assessment could not be saved" and left `apexPredatorStatus` absent from Firestore. The identical payload succeeds instantly via an admin-privileged write, proving the object itself is valid and the failure is specific to the authenticated-user write path. This is the highest-severity finding of Wave 5 in one specific sense: unlike Iron Clock/REDLINE/Lazarus's fully dead mechanics (never built a UI at all) or Skeleton's cosmetic display bug (data was always correct underneath), Apex Predator built the entire mechanic correctly, made it reachable, and it still cannot be used — the one thing standing between "excellent adaptive design" and "works for zero athletes" is a single broken write.

### 3.2 `apexPredatorStatus` missing from `resetProgram()`'s allowlist · **severity: low today, high once §3.1 ships, `shared-bug`**

Detailed in §2. Currently consequence-free only because nothing can populate the field (§3.1). The moment the save path is fixed, this becomes the same real-consequence gap already found on Athena/Kali/House of Iron: "Reset Current Progress" would leave a stale `emphasis.regions` selection in place, silently continuing to drive access-exercise substitution from pre-reset assessment data.

### 3.3 `programProgress['apex-predator']` never receives an entry, even immediately after switching in · **severity: low, `shared-bug`**

Detailed in §2. Same family as REDLINE's T-37, Atlas's T-46, Lazarus/Skeleton's post-completion gap — but the widest instance: here there is no entry at all, not merely a missing `startDate` sub-field, confirmed via a Firestore read taken immediately after a successful `switchProgram()` call. `ApexDashboard`'s own week calculation (`clampProgramWeek`) tolerates this via its `user.startDate` fallback (same mechanism already confirmed working on Atlas), so no wrong week was observed live — but the gap is real and worth fixing alongside the other four plans' instances of this pattern.

### 3.4 The Final Hunt (week 12) transform silently exempts one specific exercise by name, with no explanatory comment · **severity: low, `hypothesis`**

`slot.sets >= 3 ? 2 : (slot.ex === 'lateral-raise' ? 2 : 1)` (`apexPredator.ts:42`) means every other 2-set accessory (Seated Hamstring Curl, Single-Arm Reverse Pec Deck, both access placeholders) drops to 1 set in the closing week, while Lateral Raise alone holds at 2 — with no comment anywhere explaining why this one exercise is special-cased. Not incorrect, but a maintainability gap: a future editor changing the accessory roster has no signal that Lateral Raise's exemption was deliberate rather than incidental to whatever exercise happened to occupy that literal string when the transform was written.

### 3.5 "Retests in weeks 4, 8 and 12" describes a dashboard checkpoint cadence, not an in-workout retest of anything · **severity: low, `plan-local`**

The card's third bullet reads "Retests in weeks 4, 8 and 12." In the live app this means the *dashboard* becomes eligible to prompt a new movement-access assessment on those weeks (`checkpointFor`) — nothing in the actual training session on those weeks re-tests a lift, a rep max, or any measured quantity; the only in-workout effect of those weeks is the unrelated set-count taper (§2). An athlete reading "retest" might reasonably expect a structured re-assessment moment inside the session itself, similar to how Athena/King of the Squat frame their checkpoints; here it is entirely a dashboard-side prompt, and — per §3.1 — one that currently cannot even be acted on.

---

## 4. Weekly volume (fractional sets/muscle/week)

Computed from `EXERCISE_BY_ID`'s native primary(1.0)/secondary(0.5) categorization, matching the convention used throughout Wave 5. All 16 distinct mandatory-slot exercise ids resolved cleanly (Suitcase Carry excluded as `optional: true`; access placeholders resolved to the plan's actual permanent-default pair, Loaded Ankle Rock + Open Book Rotation, given §1b means no athlete ever escapes that default in practice).

### Stalk / Adapt / Apex weeks (1-3, 5-7, 9-11) — 47 mandatory sets/week across 3 sessions

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Glutes | 13.0 | | Front delt | 4.5 |
| Upper back | 10.5 | | Rear delt | 5.0 |
| Quads | 10.0 | | Biceps | 4.5 |
| Hamstrings | 10.0 | | Obliques | 4.0 |
| Lats | 9.0 | | Side delt | 3.0 |
| Calves | 7.0 | | Triceps | 3.5 |
| Chest | 5.0 | | Adductors | 1.5 |
| | | | Lower back | 1.5 |
| | | | Rotator cuff | 1.0 |

### Retest weeks (4, 8) — 40 sets/week

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Glutes | 10.0 | | Rear delt | 4.0 |
| Upper back | 8.0 | | Front delt | 4.0 |
| Quads | 8.0 | | Biceps | 3.0 |
| Hamstrings | 8.0 | | Obliques | 4.0 |
| Lats | 6.0 | | Side delt | 3.0 |
| Calves | 7.0 | | Triceps | 3.0 |
| Chest | 4.0 | | Adductors | 1.0 |
| | | | Lower back | 1.0 |
| | | | Rotator cuff | 1.0 |

### Final Hunt (week 12) — 28 sets/week

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Glutes | 8.0 | | Rear delt | 3.0 |
| Upper back | 6.5 | | Biceps | 3.0 |
| Quads | 6.0 | | Front delt | 2.5 |
| Hamstrings | 6.0 | | Obliques | 2.0 |
| Lats | 6.0 | | Side delt | 2.5 |
| Calves | 3.5 | | Triceps | 2.0 |
| Chest | 3.0 | | Adductors | 1.0 |
| | | | Lower back | 1.0 |
| | | | Rotator cuff | 0.5 |

Against the ≥5-sets/muscle/week reference point (§7 calibration principle, judged case by case): the working-phase weeks clear the floor comfortably everywhere except side delt (3.0), triceps (3.5), adductors (1.5), lower back (1.5), and rotator cuff (1.0) — all appropriate for a full-body assessment/general-purpose plan with no isolation specialization anywhere in its 5-exercise-per-day core template. Chest (5.0) sits right at the floor, carried entirely by Flat DB Press and Hammer Chest Press with no isolation flye work. No direct hamstring-flexion isolation beyond Seated Hamstring Curl and the RDL's stretch-position credit; no soleus-specific loader, no upper-trap or tibialis-anterior exposure — consistent with the map's portfolio-wide zero-coverage findings, same as every plan audited this wave. Both access exercises (Loaded Ankle Rock, Open Book Rotation) are captured at their native `EXERCISE_BY_ID` primary/secondary attribution; since §1b means these are the *only* access exercises any real athlete will ever see, this table is not a "week 1 snapshot before personalization" the way it would be on a correctly-working plan — it is, in practice, the plan's permanent volume profile for every athlete.

---

## 5. Systemic and joint load (weekly, 3 sessions)

| Metric | Stalk/Adapt/Apex | Retest (4, 8) | Final Hunt (wk 12) |
|---|---|---|---|
| Systemic | **68** | **54** | **42** |
| Axial | **19** | **14** | **12** |
| Lower back | **15** | **10** | **10** |
| Knee | **22** | **18** | **13** |
| Shoulder | **16** | **14** | **10** |
| Elbow | **10** | **8** | **6** |
| Sets | 47 | 40 | 28 |
| Per-set systemic | **1.45** | **1.35** | **1.50** |

Mid-pack for Wave 5's per-set systemic cost (Iron Clock 1.47, Lazarus 1.42-1.49, Skeleton 1.58, REDLINE 1.52, 30-Min Adventure 1.80, Atlas 1.87-2.02) — consistent with a general full-body template mixing free-weight compounds (Hack Squat, RDL, Bulgarian Split Squat) with supported/assisted movements (Bench-Supported Row, Assisted Pull-up, Single-Arm Reverse Pec Deck) and low-load corrective access work. Knee cost (22 in the working phase) is the plan's most concentrated single metric, driven by three separate knee-flexion/extension-heavy slots per week (Hack Squat, Bulgarian Split Squat, Deficit Reverse Lunge, Leg Extension) plus, for the ankle-emphasis default every athlete actually gets (§1b), Loaded Ankle Rock's own knee-forward-travel demand — appropriate for a plan whose declared emphasis mechanism is built around joint access work, though the irony is that the knee-heaviest exercise in the whole template (the ankle access movement) is the one component guaranteed to run for every athlete regardless of what their real mobility profile actually needs, precisely because §1b prevents anyone from ever steering away from it.

---

## 6. Improvements, ranked

### 1. Fix the "Save Assessment" write path so the plan's headline mechanic can be used by a single real athlete · `plan-local`

By far the highest-leverage fix in this doc. Detailed in §1b/§3.1: the assessment is well-designed, reachable, and correctly filled in by the athlete, but the write consistently fails while the identical payload succeeds via an admin-privileged write. Until this is fixed, every athlete on Apex Predator runs the entire 12-week program on the untested `['ankle', 'thoracicRotation']` default, regardless of their actual limiting joints — the plan's one differentiating idea never activates for anyone. Root-causing the exact client-write failure (this session's tooling could isolate it to the authenticated-user path but not pin the precise trigger) should be the first step of any implementation pass touching this plan.

### 2. Add `apexPredatorStatus` to `resetProgram()`'s allowlist in the same pass as item 1 · `shared-bug`

Detailed in §2/§3.2. Currently invisible because nothing populates the field — but shipping the item-1 fix without this one reproduces the exact real-consequence gap already found on Athena/Kali/House of Iron: a "Reset Current Progress" that silently leaves a stale, pre-reset `emphasis.regions` selection driving access-exercise substitution.

### 3. Backfill `programProgress['apex-predator']` on `switchProgram()`, not only on session completion · `shared-bug`

Detailed in §2/§3.3. The widest instance of the REDLINE-T-37/Atlas-T-46/Lazarus/Skeleton pattern found this wave — here the entry is missing outright, even before the first session, relying entirely on the `user.startDate` fallback already confirmed working elsewhere. Worth fixing in the same cross-plan pass as the other four instances.

### 4. Give the week-12 taper's exercise-name exemption an explanatory comment, or generalize it to a role-based rule · `hypothesis`

Detailed in §3.4. `slot.ex === 'lateral-raise'` as a literal string with no comment is exactly the kind of silent, easy-to-break special case this audit has repeatedly found drifting unnoticed elsewhere (T-4 family). A one-line comment ("laterals held at 2 sets in the taper — shoulder capsule health, not a set-count typo") or a `keepFullSets: true` flag on the slot definition would make the intent durable against future edits.

### 5. Soften "Retests in weeks 4, 8 and 12" to describe what actually happens, or build an in-session retest moment to match the stronger claim · `plan-local`

Detailed in §3.5. Either reframe the card copy around what's real (a dashboard-side re-assessment prompt on a fixed cadence, once item 1 makes it usable) or add an actual in-workout retest element on those weeks — e.g. a guided re-measurement flow at the top of the first session of week 4/8/12 — to match the stronger, more literal reading "retest" invites.

### 6. Surface the emphasis-driven access exercises' rationale on the workout card itself, not just the ROM cue text · `hypothesis`

Currently an athlete sees "Loaded Ankle Rock" with a ROM cue but no indication that this exercise is there *because* of their (or the default) assessment result. A one-line "Because: Ankle dorsiflexion" tag alongside the cue would make the plan's adaptive logic visible in the one place athletes actually spend their time — the workout screen — complementing the dashboard's existing "Latest assessment" summary rather than duplicating it.

---

## 7. Verdict

**Apex Predator is Wave 5's most frustrating result: the best-engineered adaptive mechanic in the entire wave, rendered completely inert for every real athlete by a single broken write.** Every other piece — the six-region assessment UI, the pain-invalidation logic, the lowest-two-regions emphasis selection with asymmetry and recency tie-breaks, the placeholder-to-real-exercise substitution with level-gated ROM cues, the graceful AI-video-advice degradation when the platform-wide feature flag is off — was live-confirmed working exactly as designed, once the one blocked step was bypassed by an admin write. That is a meaningfully different failure shape than Iron Clock/REDLINE/Lazarus's Wave-5-opening streak (a mechanic that was simply never wired to any UI) or Skeleton's cosmetic display bug (data always correct, only the readout broken) — here the entire feature exists, is reachable, and the athlete does everything right, and it still doesn't work. On pure training-design merit, independent of §1b: a 3-day, 5-core-exercise-per-day full-body template with sensible free-weight/supported-movement balance, a real (if currently pointless) taper structure across three retest weeks, and mid-pack systemic cost for the wave is a sound skeleton for a general-purpose assessment-driven plan — but "assessment-driven" is the entire premise, and right now nothing an athlete does ever gets assessed.

**This closes Wave 5.** See `_audit-status.md` for the full seven-plan wave summary.

---

## 8. Export block

```yaml
id: apex-predator
version: 2
length: { weeks: 12, phases: 6 }
frequency: fixed_3day_mandatory_weekday_selection
weekly_sets: { stalk_adapt_apex: 47, retest_wk4_8: 40, final_hunt_wk12: 28 }
kind: general_fullbody_movement_assessment_driven_access_work
calibration: applyApexAccess_preprocessDay_hook_substitutes_placeholder_slots_from_assessment_emphasis
engine: definePlan_generic_static_dayspec_plus_phase_transforms_dedicated_dashboard_component
systemic_load: { stalk_adapt_apex: { systemic: 68, axial: 19, lower_back: 15, knee: 22, shoulder: 16, elbow: 10, sets: 47, per_set: 1.45 }, retest: { systemic: 54, axial: 14, lower_back: 10, knee: 18, shoulder: 14, elbow: 8, sets: 40, per_set: 1.35 }, final_hunt: { systemic: 42, axial: 12, lower_back: 10, knee: 13, shoulder: 10, elbow: 6, sets: 28, per_set: 1.50 } }
volume_top_stalk_adapt_apex: { glutes: 13.0, upperBack: 10.5, quads: 10.0, hamstrings: 10.0, lats: 9.0, calves: 7.0, chest: 5.0 }
positive_findings:
  - "Movement-access assessment engine (selectApexEmphasis, validRegionScore, accessExercisesFor) is fully correct on trace and, once seeded, live-confirmed end to end: seeded fallback scores produced the exact predicted emphasis pair, and the two apex-access-placeholder slots resolved to the correct real exercises with correct level-1 ROM cue text"
  - "ApexDashboard is a true dedicated component -- T-9 immunity live-confirmed via a dashboardViewWeek localStorage-poisoning test"
  - "Optional AI video advice degrades gracefully and matches its own card wording exactly -- platform-wide appConfig/ai has videoAnalysis disabled, and the feature's own code treats this as an expected non-error state, not a dead-feature claim"
  - "No reverse-nordic-curl, no type:'wave' exposure, no classic T-4 duplicated-slot drift, no T-22 exposure, no T-23 exposure (structural -- zero weighted-bodyweight exercises across all 16 distinct ids in the pool)"
dead_features:
  - area: "src/features/apexPredator/ApexDashboard.tsx save() -> updateUserProfile({ apexPredatorStatus })"
    detail: "The plan's entire signature mechanic cannot be activated by any real athlete. Two independent live attempts through the real onboarding UI, both with a correctly-filled six-region assessment, both produced 'The assessment could not be saved' and left apexPredatorStatus absent from Firestore. The identical payload succeeds instantly via an admin-privileged write, proving the object is valid and the failure is specific to the authenticated-user write path; manual trace of every relevant firestore.rules clause against the live-fetched deployed rules text found no rule the payload should fail, so the precise trigger was not pinned down from client-side observation alone this session. Every athlete permanently runs the plan on its untested ['ankle','thoracicRotation'] default emphasis for the full 12 weeks."
plan_local_bugs:
  - area: "src/contexts/UserContext.tsx resetProgram() allowlist"
    detail: "apexPredatorStatus is absent from the hardcoded status-nulling allowlist (bench-domination/pencilneck-eradication/skeleton-to-threat only). Currently consequence-free only because the dead write path (see dead_features) means nothing ever populates the field; becomes a real gap the moment that fix ships, same shape as Athena/Kali/House of Iron's T-2 findings."
  - area: "src/contexts/UserContext.tsx switchProgram() / programProgress"
    detail: "programProgress['apex-predator'] never receives an entry, confirmed via a Firestore read taken immediately after a successful switchProgram() call -- wider than REDLINE's T-37/Atlas's T-46/Lazarus's and Skeleton's post-completion-only gaps, since here there is no entry at all rather than a missing startDate sub-field. ApexDashboard's own user.startDate fallback (same mechanism confirmed working on Atlas) meant no wrong week was observed live."
  - area: "src/data/plans/apexPredator.ts:42 (Final Hunt phase transform)"
    detail: "slot.ex === 'lateral-raise' is a bare string-literal exemption from the week-12 set-count taper, with no comment explaining the intent -- the same silent, easy-to-drift special-case shape the audit's T-4 family has repeatedly flagged elsewhere, though not itself currently incorrect."
verification_note: "test_claude logged in successfully on the first attempt this session. Full live pass: onboarding (mandatory Mon/Wed/Fri weekday selection), landed directly on the Checkpoint 0 movement assessment, entered fallback scores for all 6 regions (confirmed via reading back live select values and the '6 valid regions' counter), attempted Save Assessment twice with identical results ('The assessment could not be saved', confirmed via direct Firestore reads showing apexPredatorStatus absent both times), isolated the failure to the authenticated-user write path by writing the identical payload successfully via an admin-privileged Firestore call, reloaded with the admin-seeded data in place and confirmed the dashboard correctly resolved and displayed the emphasis and latest-assessment table, started Session A and confirmed both apex-access-placeholder slots resolved to the correct real exercises with correct ROM cue text, and ran a deliberate dashboardViewWeek localStorage-poisoning test confirming T-9 immunity."
audit: { date: 2026-08-15, findings: 5, verdict: "Apex Predator's entire signature mechanic (movement-access assessment driving corrective access work) is real, well-designed, and live-confirmed working end to end once seeded -- but the one write that is supposed to feed it from a real assessment fails for every athlete, every time, live-confirmed twice and isolated to the authenticated-user write path via a successful admin-bypass write of the identical payload. This is the sharpest form of Wave 5's dead-mechanic pattern: not an unbuilt feature, but a fully-built one blocked by a single broken write, so the entire plan silently runs on its untested default for its full 12-week length. T-9 is structurally immune (true dedicated dashboard, live-confirmed). T-23 does not reproduce (structural, zero weighted-bodyweight exposure). Closes Wave 5." }
```
