# Neural Overload

> Unified plan document, v2 format. Supersedes `docs/plans/neural-overload.md`
> if one exists. Second plan of **Wave 6 (Advanced prototypes + roadmap)**.
> Structure and wiring verified via direct source trace of
> `src/data/plans/neuralOverload.ts` (157 lines), `src/data/planBuilder.ts`
> (the shared `definePlan()` engine, `wavePercentForSet`, `buildWeightCalculator`),
> `src/pages/Dashboard.tsx`, `src/pages/WorkoutView.tsx`,
> `src/contexts/UserContext.tsx`, `src/features/dashboard/trackedLift.ts` — plus
> direct function calls against `NEURAL_OVERLOAD_CONFIG.hooks.calculateWeight`
> with a synthetic user across all 9 weeks, and a live `test_claude` pass:
> logged in successfully on the first attempt, switched into Neural Overload
> via Settings → Program Management → Switch Program, completed weekday
> selection and reached the "Starting Numbers" calibration screen (confirming
> onboarding requests exactly `squat`/`pausedBench`, matching the source), then
> hit a `permission-denied` "Registration failed" console error identical in
> shape to Super Mutant's T-58 and Apex Predator's T-54 when submitting —
> `programId`/`stats.pausedBench` confirmed unchanged in Firestore afterward.
> Isolated the failure to the client write path with an admin-privileged
> Firestore write of the identical resulting document (`programId:
> 'neural-overload'`, a fresh `programProgress` entry, `stats.pausedBench:
> 100`), which succeeded instantly — then, with the account seeded, reloaded
> with a deliberately poisoned `dashboardViewWeek-test_claude` localStorage key
> (set to `9`) and confirmed T-9 live, and opened the live Week-9 Bench Neural
> session to confirm the plan's actual computed loads on screen match the
> function-call prediction exactly.

| | |
|---|---|
| **id** | `neural-overload` |
| **Length** | 9 weeks, 4 days/week (fixed weekday selection at onboarding — live-confirmed as an ordinary `definePlan()` schedule picker, no bespoke scheduling) |
| **Frequency** | Bench Neural (Mon), Squat Neural (Tue), Chin Neural (Thu), Lower Powerbuilding (Fri) — fixed day-of-week slots, no rotation |
| **Declared kind** | Poliquin-style "1-6" post-activation-potentiation loading: heavy single → moderate back-off six → heavier single → heavier back-off six, on one main lift per Bench/Squat/Chin day; day 4 is a lower-fatigue straight-sets powerbuilding day by explicit design |
| **Calibration** | Onboarding requests exactly two 1RMs — Squat, Paused Bench Press — matching `requiredStatsFor()`'s derivation from the plan's own `progression.of` references. Live-confirmed: the Squat field pre-filled "From your profile: 160 kg" (a prior plan's calibration carrying over), Paused Bench required manual entry. No bespoke exercise-selection step exists or is needed — the plan has no swappable slots |
| **Source** | `src/data/plans/neuralOverload.ts` (157 lines, `definePlan()`-generic — no bespoke hooks, no `xStatus` object of any kind) |
| **Stated promise** | Card: *"9 weeks of 1-6 loading. Heavy single, back-off six, heavier single, heavier six."* Features: *"Post-activation: does the second six beat the first?", "The single is never a weekly max attempt", "Day 4 builds without adding neural cost."* |

---

## 1. Headline finding — T-3 does NOT reproduce, but a closely related, plan-local percentage bug does

**Neural Overload has zero exposure to T-3.** `wavePercentForSet`/`type: 'wave'` — the specific mechanism King of the Squat's T-3 lives in — is never referenced anywhere in `neuralOverload.ts`. The plan's "1-6 wave" is Poliquin terminology for the *set structure* (single/six/single/six), not the engine's `type: 'wave'` progression strategy; it is implemented entirely with `type: 'percentage'` slots whose `percent` field is a **function of `ProgressionContext`** rather than a static number — a shape `buildWeightCalculator` already supports correctly (`planBuilder.ts:398-401`, `typeof progression.percent === 'function' ? progression.percent(ctx) : progression.percent`). This resolves the audit's five-wave-old flagged question directly: **the specific candidate carried since early Wave 2 for a second `wavePercentForSet` reproduction was never actually exposed to that function at all.**

That said, the plan's own custom percentage function has a real, closely-adjacent defect, uncovered by direct function-call testing and then live-confirmed exactly:

### 1a. The `discharge()` helper keys off absolute week number, not phase — so the "Overload" phase silently reuses the "Charge" phase's percentages verbatim

`oneSixWave()`'s `discharge = (charge, rest) => (ctx) => ctx.week >= 4 && ctx.week <= 6 ? rest : charge` branches on `ctx.week` (the absolute 1-9 week number) rather than `ctx.phase`/`ctx.weekInPhase`. Weeks 1-3 (**Charge**) and weeks 7-9 (**Overload**) both fail the `4 <= week <= 6` test and fall through to the identical `charge` branch — so every one of the four 1-6 percentages (90% / 75% / 92.5% / 77.5% of the relevant 1RM) is **byte-identical** in the plan's first and third named phases. Only weeks 4-6 (**Discharge**) get the lower `rest` values (85% / 70% / 87.5% / 72.5%).

Confirmed by direct call to `NEURAL_OVERLOAD_CONFIG.hooks.calculateWeight` against a synthetic 200kg-squat/140kg-paused-bench user across all 9 weeks — Squat Neural's four working weights were **180/150/185/155kg on weeks 1, 2, 3, 7, 8, and 9 alike**, dropping to 170/140/175/145kg only on weeks 4-6. Then live-confirmed on the real `test_claude` account (100kg paused bench): the Week-9 Bench Neural session displayed **90kg / 75kg / 92.5kg / 77.5kg** for its four 1-6 sets — exactly the Week-1-3 Charge values, not a progression past them.

**Why this matters for the plan's own stated design:** the phase names imply a three-block arc — build (Charge), unload (Discharge), then a harder final push (**Overload**, whose own header comment reads "Accessory volume drops so the neural work stays the priority," implying the neural work itself is what's being emphasized). In practice, the *only* thing that changes in the Overload phase is a one-set trim on accessories (`sets >= 3 ? sets - 1 : sets`, confirmed live — Hammer Upper Row rendered 3 sets in Week 9 instead of the base 4). The named "neural" 1-6 work — the plan's entire differentiator — never exceeds its Week-1 baseline for the whole back half of the program. An athlete finishing week 9 lifts the identical single/six weights they lifted in week 1, four weeks after a deliberate discharge dip, with no re-test or manual 1RM update built into the plan to let it climb (the only stat inputs are the one-time onboarding numbers; `user.stats` never updates automatically).

This is **not** T-3 — the bug lives in a plan-local closure over `ctx.week`, not in the shared `wavePercentForSet`. It is a materially different failure shape from every prior "wave" finding in the audit: not a miscalculation of a real wave ladder, not a decorative label with no engine behind it (T-14-style), but a genuine, correctly-invoked percentage function whose own conditional simply omits the third phase from the two it was clearly meant to distinguish from.

### 1b. Onboarding cannot write `stats.pausedBench`/`programId` for a real athlete — third independent plan showing this exact failure shape this wave

Live-confirmed: submitting the real "Starting Numbers" onboarding form (Squat 160, Paused Bench 100) produced a console `FirebaseError: Missing or insufficient permissions.` (`"Registration failed"`), with `programId` still `super-mutant` (the plan active before this session) and `stats.pausedBench` still `0` in Firestore afterward — despite `stats.squat` already correctly showing `160` from an earlier plan's calibration. Writing the identical resulting document via an admin-privileged Firestore call succeeded immediately. This is the **third** independent plan this wave (after Apex Predator's T-54 and Super Mutant's T-57/T-58) where an ordinary `updateUserProfile`/`switchProgram` write to `test_claude`'s own user document fails with `permission-denied` while an admin write of the same payload succeeds instantly — now spanning three structurally unrelated write call sites (an assessment save, a plan-switch-with-status-object, and a plain onboarding calibration with no bespoke status object at all). This strengthens the standing hypothesis flagged after Super Mutant: the failure is very likely a broader `test_claude` account/session-state condition rather than three coincidentally-identical plan-local bugs, though it remains not pinned to an exact `firestore.rules` clause from client-side observation alone.

---

## 2. Structure

### `definePlan()`-generic, three phases, no bespoke hooks

| Phase | Weeks | Transform |
|---|---|---|
| Charge | 1-3 | none (base slots as authored) |
| Discharge | 4-6 | none directly — the *percentage functions themselves* branch on this window (§1a) |
| Overload | 7-9 | `slot.sets >= 3 ? sets - 1 : sets` (accessory-only; no percentage change, §1a) |

Four fixed days, no rotation, no swappable/optional slots beyond `front-squat`'s single `alternates: ['Safety Bar Squat']` (a Swap-sheet offer, not a plan mechanic). No `xStatus` object of any kind — `neuralOverloadStatus` does not exist anywhere in the codebase.

### Onboarding

Live-confirmed: reaches weekday selection (4/4 required, suggested "Mon·Tue·Thu·Fri" split selectable in one click) then "Starting Numbers" (Squat, Paused Bench — exactly the two stats `requiredStatsFor()` derives from the plan's `progression.of` references, correctly excluding the unused `conventionalDeadlift` type parameter that `oneSixWave()`'s signature accepts but no call site ever passes). No exercise-selection step — correctly absent, since the plan has no swap-driven slots that would need one. Submission fails (§1b).

### `xStatus`, T-2, T-4, T-9, T-22, T-23, reverse-nordic

- **No `xStatus` object exists — T-2/T-28 structurally does not apply.** Same shape as Monolith/Purgatorio (Wave 2's cleanest plans): `resetProgram()`'s generic `programProgress` clear already covers everything this plan has.
- **No classic T-4 duplicated-definition drift.** `oneSixWave()` is a single shared slot-generator function called twice (Bench, Squat); Chin Neural's four hand-written 1-6 rows share the same display name (`weighted-chin-up`) but resolve correctly via `buildWeightCalculator`'s exercise-id/slot-index matching (`context.exerciseId`'s `-e(\d+)$` suffix) — confirmed live, all four Chin Neural rows rendered distinct prescriptions (1-2/6/1-2/6 reps at ascending/descending pattern) with no collision.
- **T-9 reproduces live, first attempt.** No dedicated dashboard component or conditional block for Neural Overload anywhere in `Dashboard.tsx` (zero matches for "neural"). Confirmed via the standard poisoning test: `dashboardViewWeek-test_claude` set to `9`, reload after an admin seed showing zero completed Neural Overload sessions and a fresh `startDate` → dashboard displayed **"WEEK 9 · Bench Neural · Overload"** regardless, sourced entirely from the stale localStorage key.
- **T-22 reproduces.** `dashboardWidgets` includes `'strength_chart'`, but `trackedLiftFor()` (`trackedLift.ts:12-40`) has no `case 'neural-overload'` — it falls to the `default` branch (`{ title: 'Paused bench', history: asHistory(user.benchHistory), startKg: user.stats.pausedBench }`), reading `user.benchHistory`, which the audit has already established has no write path anywhere in the codebase (T-22, first found on Workhorse). The widget would render a "Paused bench" chart that can never populate.
- **T-23 reproduces — same allowlist-gate mechanism as Atlas's T-43, a fourth independent instance.** Chin Neural's four `weighted-chin-up` slots are `weightMode: 'weighted-bodyweight'`, but `WorkoutView.tsx:842`'s `totalSystemWeightKg` computation is gated to a hardcoded `programData.id === 'kali' || 'workhorse' || 'gravity-is-optional'` allowlist that excludes `neural-overload`. Because these slots also have no explicit `progression` field, `buildWeightCalculator` returns `undefined` for them and WorkoutView's generic `genericDoubleProgression` fallback governs — reading `sets[0].weight` only, external load alone, never bodyweight. A logged Chin Neural single would silently under-report total load exactly as it does on Workhorse/Gravity Is Optional/Kali/Atlas.
- **No `reverse-nordic-curl` anywhere in the exercise pool.** Leg work is `low-bar-squat`/`front-squat`, `seated-ham-curl`, `leg-extension`, `goblet-skater-squat`, `hip-supported-db-deadlift`, `standing-calf-raise` — no knee-flexion/extension misattribution risk exists in this plan.

---

## 3. Findings

### 3.1 T-3 does not reproduce — Neural Overload never invokes `wavePercentForSet` · **finding: structural non-exposure, resolves a 5-wave-old open question**

Detailed in §1. The plan's "1-6" mechanic uses `type: 'percentage'` with a function-valued `percent`, a shape the engine already supports correctly. `type: 'wave'`/`wavePercentForSet` has zero references anywhere in `neuralOverload.ts`. This closes the specific question flagged at the start of Wave 2 — Neural Overload was never actually a second `type: 'wave'` consumer, and the portfolio-wide T-3 exposure count for `wavePercentForSet` remains at 1 of all plans reviewed so far (King of the Squat only).

### 3.2 The "Overload" phase's 1-6 percentages are identical to the "Charge" phase's — the plan's named final block never actually intensifies the neural work it's built around · **severity: high, `plan-local`**

Detailed in §1a. Live-confirmed and function-call-confirmed to agree exactly. Not a wiring failure (the function runs and is invoked correctly every time) — a logic gap in the function's own conditional, which only distinguishes one window (4-6) from "everything else" instead of distinguishing all three named phases. The accessory-set trim in the Overload phase is real and does fire (live-confirmed), so the plan is not entirely static in its back half — but the mechanic the card and file header actually describe (heavier, PAP-primed neural work) plateaus at week-1 numbers for two-thirds of the program's length.

### 3.3 Onboarding cannot write `stats.pausedBench`/`programId`, blocking entry to the plan for every real athlete · **severity: critical, `shared-bug`**

Detailed in §1b. Third independent reproduction this wave (Apex Predator T-54, Super Mutant T-57/T-58, now Neural Overload) across three structurally different write call sites, strengthening the case that this is an account/session-state condition broader than any one plan's status-object shape, and the single highest-priority item for the owner to investigate directly (e.g., server-side Firestore logs for the exact denied rule) before the next wave, since client-side rule tracing has now failed to pin the cause three times running.

### 3.4 `strength_chart` widget requested but unreachable via a missing switch case, reading the already-known-dead `benchHistory` field · **severity: low, `shared-bug`**

Detailed in §2. Two independent gaps stack here: `trackedLiftFor()` has no `neural-overload` case (falls to a generic "Paused bench" default), and the field that default reads (`benchHistory`) is T-22's confirmed-portfolio-wide unwritten field. Fixing T-22 alone would not fix this plan's chart — it would still show a generic, unlabeled "Paused bench" title rather than anything specific to the plan's actual 1-6 lifts, unless a dedicated case is added.

### 3.5 `weighted-chin-up`'s total system weight is silently dropped, same allowlist gate as Atlas · **severity: medium, `shared-bug`**

Detailed in §2. Fourth confirmed instance of the `WorkoutView.tsx:842` hardcoded plan-id allowlist (Workhorse, Gravity Is Optional, Kali, Atlas, now Neural Overload) — continues to support the post-audit recommendation already on record (T-43) to make the gate `weightMode`-driven instead of plan-id-driven.

### 3.6 T-9 reproduces — no dedicated dashboard component · **severity: medium, `shared-bug`**

Detailed in §2. Live-confirmed via poisoned localStorage. Consistent with the portfolio-wide pattern: dedicated-dashboard immunity correlates with whether a plan built its own dashboard block, not with wave or plan category, and Neural Overload built none.

---

## 4. Weekly volume (fractional sets/muscle/week)

Computed from `EXERCISE_BY_ID`'s native `primary`/`secondary` muscle-group arrays (primary = full set credit, secondary = half credit) summed across each week's actual generated exercise list — i.e. after phase transforms are applied, matching what an athlete would actually see that week. A full 35-dimension fractional pass against `exercise-attribution-map.md`'s per-exercise entries was not reconstructed line-by-line this session (time budget); the primary/secondary approximation used here is coarser than that map on split-muscle detail (e.g. it cannot separate pec-upper/lower or quad heads) but is directionally reliable for the whole-plan shape below, and every exercise in this plan's pool was checked against the map's prose entries for known attribution bugs (§25) — none apply (no `reverse-nordic-curl`, no `around-the-worlds`, no `y-raise`, no `wall-slide`, no `loaded-ankle-rock`).

| Muscle | Week 2 (Charge) | Week 5 (Discharge) | Week 8 (Overload) |
|---|---|---|---|
| Quads | 15 | 15 | 12 |
| Glutes | 16 | 16 | 13 |
| Hamstrings | 16 | 16 | 12 |
| Chest | 11 | 11 | 9 |
| Triceps | 10.5 | 10.5 | 8.5 |
| Biceps | 9.5 | 9.5 | 8.5 |
| Calves | 9 | 9 | 6 |
| Lats | 8 | 8 | 7 |
| Front delt | 7.5 | 7.5 | 6 |
| Upper back | 7.5 | 7.5 | 6 |
| Brachialis | 6 | 6 | 5 |
| Rear delt | 5 | 5 | 3.5 |
| Adductors | 4.5 | 4.5 | 4 |
| Abs | 4.5 | 4.5 | 3 |
| Forearms | 3 | 3 | 2 |
| Lower back | 2 | 2 | 1.5 |
| Side delt | 2 | 2 | 2 |
| Obliques | 1.5 | 1.5 | 1 |
| Rotator cuff | 1.5 | 1.5 | 1 |

Loads (§1a) do not change between Week 2 and Week 8 for the four 1-6 lifts — only the accessory-set trim moves the numbers above, uniformly shaving every muscle by roughly the same 15-25% rather than reallocating volume toward the "neural" lifts the phase name implies. Quads/glutes/hamstrings lead comfortably (Squat Neural + Lower Powerbuilding both load posterior chain and quads directly), consistent with the plan's own "Strength and size together" framing rather than a pure-upper-body powerbuilding split. No muscle from the attribution map's zero-coverage list (soleus, tibialis anterior, direct adductors, direct erectors, upper/lower traps, serratus, isolated upper pec) gets a dedicated loader here either — standard-calf-raise/adductor credit above is secondary-only, consistent with every other plan audited.

---

## 5. Systemic / joint load

Computed the same way, from each exercise's `intelligence` block × sets, summed per week:

| Metric | Week 2 (Charge) | Week 5 (Discharge) | Week 8 (Overload) |
|---|---|---|---|
| Systemic cost | 109 | 109 | 88 |
| Axial cost | 31 | 31 | 27 |
| Lower-back cost | 30 | 30 | 25 |
| Knee cost | 36 | 36 | 28 |
| Elbow cost | 35 | 35 | 29 |
| Shoulder cost | 16 | 16 | 13 |

Systemic/axial/lower-back/knee cost stay flat between Charge and Discharge — expected, since §1a means the actual *loads* don't drop in Discharge relative to Charge on paper here (this table sums intelligence cost by set count, not by percentage-of-max, so it doesn't directly show the 85/70/87.5/72.5% dip); the meaningful Charge→Discharge change is in bar weight, not set count. The Overload column's ~19-22% drop across every metric is the accessory-set trim, the plan's one genuinely differentiating mechanism across its three phases.

---

## 6. Ranked improvements

1. **`shared-bug` — Investigate the `test_claude` write-path failure as an account/session-state issue, not per-plan.** Third independent plan this wave (Apex Predator, Super Mutant, now Neural Overload) failing an ordinary authenticated-user Firestore write with `permission-denied` while an admin-privileged write of the identical payload succeeds instantly, across three unrelated write shapes. Client-side rules tracing has failed to pin this down three times running — recommend server-side Firestore audit logs for the exact denied request as the next diagnostic step, since this now blocks onboarding into any newly-tested plan on this account.

2. **`plan-local` — Fix `discharge()`'s window check so the Overload phase actually intensifies past Charge, or rename/redesign the phase if flat-then-cut is the intended arc.** The one-line fix (branch on `ctx.phase === 'Discharge'` or `weekInPhase`/`ctx.week` bucketed into three ranges, not two) would let weeks 7-9 exceed weeks 1-3's percentages, matching what "Overload" and the file's own "neural work stays the priority" comment imply. Alternatively, if flat percentages plus lighter accessories is the actual intended design (a plausible, defensible fatigue-management choice on its own terms), the phase name and card copy should say so rather than imply progression that isn't there.

3. **`shared-bug` — Add a `neural-overload` case to `trackedLiftFor()`, and fix T-22's underlying `benchHistory`/`liftHistory` write gap.** Both are needed: the switch-case fix alone would still show a chart with no data (T-22), and the T-22 fix alone would leave this plan showing a generic "Paused bench" title rather than crediting its actual PAP-single mechanic.

4. **`shared-bug` — Make `WorkoutView.tsx:842`'s `totalSystemWeightKg` gate `weightMode`-driven instead of plan-id-hardcoded.** Already recommended after Atlas (T-43); Neural Overload is now the fourth plan silently excluded from its own "total system weight" credit for a weighted-bodyweight lift, and Chin Neural's own slot notes ("Total system weight — bodyweight plus the belt") explicitly promise the number this gate currently withholds.

5. **`hypothesis` — Give the plan a way to update its calibration mid-cycle.** With no re-test, no AMRAP checkpoint, and no automatic 1RM adjustment anywhere in the file, an athlete who genuinely gets stronger over 9 weeks trains the entire back half at their onboarding-day numbers regardless — compounding §1a's flat-Overload-phase gap rather than offsetting it. Even a simple optional "update your 1RM" prompt at the Discharge→Overload boundary (week 7) would let the phase transition mean something numerically, not just in accessory volume.

6. **`hypothesis` — Reconsider whether Day 4's "straight sets, not 1-6" framing undersells its own consistency value.** Front Squat at a flat 65% × 5 sets of 3-5 across all 9 weeks (untouched by any phase transform on its percentage) is, by design, the plan's one genuinely stable strength stimulus — worth stating on the card as a deliberate contrast to the 1-6 days' flat-Overload gap, rather than leaving it to read as an incidental fourth day.

---

## 7. Verdict

**As a set-structure design, "1-6" is a coherent, well-cited Poliquin-style post-activation-potentiation scheme, correctly and cleanly implemented via the shared `type: 'percentage'` progression path — not the buggy `type: 'wave'` engine the audit has been watching for since Wave 2.** That five-wave-old open question resolves cleanly here: T-3 does not apply to this plan at all. What the live and function-call testing surfaced instead is narrower but still real: the plan's three-phase arc only actually has two distinct percentage states (Charge/Overload identical, Discharge lower), so the "Overload" phase's headline promise — heavier PAP work as accessories taper — never happens numerically, only volumetrically. Layered on top of the wave's now-third instance of a broader account-level write-path failure that currently blocks any real athlete from even starting the plan, Neural Overload's honest current state is: a sound, if quietly under-delivering, training design that cannot be onboarded into today, and would deliver two-thirds flat, one-third genuinely progressive intensity even if it could be.

---

```yaml
plan: neural-overload
wave: 6
audit_status: complete
headline_finding: >
  T-3 (wavePercentForSet ignoring phase) does NOT reproduce — the plan never
  uses type:'wave', resolving a 5-wave-old open question. Instead, a related
  plan-local bug: the Overload phase's 1-6 percentages are byte-identical to
  the Charge phase's (both fall through the same ctx.week>=4&&<=6 check),
  so the plan's named final block never actually intensifies past week 1-3
  loads. Onboarding also fails with permission-denied (third independent
  plan this wave with the same write-path failure shape).
findings:
  - id: T-62
    severity: none (structural non-exposure)
    tag: shared-bug
    summary: T-3 does not reproduce — Neural Overload never invokes wavePercentForSet or uses type:'wave'; uses type:'percentage' with a function-valued percent instead.
  - id: T-63
    severity: high
    tag: plan-local
    summary: discharge() branches only on week 4-6 vs everything-else, so Charge (wk1-3) and Overload (wk7-9) phases share byte-identical 1-6 percentages; only the accessory-set trim differs in Overload.
  - id: T-64
    severity: critical
    tag: shared-bug
    summary: Onboarding write (updateUserProfile/switchProgram) fails permission-denied for a real authenticated user — third independent plan this wave with this exact failure shape (Apex Predator T-54, Super Mutant T-57/T-58).
  - id: T-65
    severity: low
    tag: shared-bug
    summary: trackedLiftFor() has no neural-overload case, falls to default reading the already-dead benchHistory field (T-22 family).
  - id: T-66
    severity: medium
    tag: shared-bug
    summary: weighted-chin-up total system weight dropped — WorkoutView.tsx:842 allowlist gate excludes neural-overload, same as Atlas's T-43.
t3_status: does not reproduce — structural non-exposure, plan never uses type:'wave'
t9_status: reproduces (live-confirmed via localStorage poisoning) — no dedicated dashboard component
t22_status: reproduces (strength_chart widget requested, trackedLiftFor has no case, falls to dead benchHistory default)
t23_status: reproduces (weighted-chin-up excluded from WorkoutView.tsx:842 allowlist, 4th instance after Workhorse/Gravity Is Optional/Kali/Atlas)
reverse_nordic_curl: absent
wave_progression: not used — type:'percentage' with function-valued percent instead
weekly_volume_charge_week2_top5:
  glutes: 16
  hamstrings: 16
  quads: 15
  chest: 11
  triceps: 10.5
weekly_volume_overload_week8_top5:
  glutes: 13
  quads: 12
  hamstrings: 12
  chest: 9
  triceps: 8.5
live_test_login: success
live_test_onboarding_write: failed (permission-denied), admin-seed used to unblock further live testing
live_test_t3_check: confirmed via both direct function call and live UI — Week 9 Bench Neural rendered 90/75/92.5/77.5kg, identical to Week 1-3 predicted values
```
