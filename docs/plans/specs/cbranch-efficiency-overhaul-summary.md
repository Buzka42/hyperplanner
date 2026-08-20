# cbranch — plan efficiency overhaul

What this branch introduced, against owner answers in `docs/plans/specs/plan-efficiency-proposed-changes.md`. Gemini blueprints were not treated as truth.

**Hold:** Monolith machine rounding (1.25 kg vs 5 kg stacks) stays unchanged until real gym jumps are reported.

---

## Shared / P0

- **Percentage stamps.** `buildWeightCalculator` writes `target.percentage`. Wave sets use `wavePercentForSet`. Consecutive same-name slots warm up only on the first (Neural 1–6).
- **Generic double progression.** Plans without a dedicated save-time handler use `genericDoubleProgression` and persist `workingLoads[planId][exerciseId]`. Dedicated handlers remain for Peachy, Pencilneck, Skeleton, Bench Domination, Pain & Glory, Ritual, Super Mutant, Trinary, House of Iron, Athena, King of the Squat, Neural Overload, Tenfold, and Atlas. Athena is not double-applied.
- **Seed loads.** `seedLoadFor` fills opening weights for `double` / `top-set-backoff`. Paused bench seeds from `pausedBench` (fallback `flatBench`); high-bar squat from squat.
- **Total system weight.** Workout view shows TSW for Workhorse / Gravity / Kali. Dashboard TSW card for Workhorse and Gravity. Bodyweight is required at onboarding for those three plans (`onboarding.requireBodyweight`) and stored on `stats.bodyweightKg`.
- **Calendar / remap.** Weeks with no static training days are skipped. Rest stubs keep ids. Workout view stamps `weekNumber` before `preprocessDay`. Skeleton empty placeholders keep `sk-wN-dN`. Skeleton quotes widget removed.
- **Contrast.** Gravity and Neural muted text ~75%; Pencilneck ~78%. Identity-row names wrap instead of ellipsis.
- **Program week.** `calendarPlanWeek(undefined)` → 1. `clampProgramWeek` uses completed sessions when present (Athena, Venus, Kali, Apex, House).
- **Dashboard hygiene.** Shared `trackedLiftFor`. Sparkline uses `hsl(var(--primary))`. Strength chart dots only the last point. Welcome / `program_status` / mutant-mindset / skeleton quotes killed.

---

## Per-plan (9.1–9.36)

| Plan | Introduced |
|---|---|
| Bench Dom, KoS, P&G, Trinary, Ritual | Batch-1 efficiency / progression / copy from the spec |
| Athena | Grind backoff 15%; week-12 confident-single notes; pec-deck on Upper B; dashboard loads |
| Pencilneck | Isolation 2 + last-set-failure; widgets reduced to strength chart |
| Super Mutant | Underdose clamp prefers blocks covering muscles with &lt;8 sets / 7 days |
| Venus | Chest + side-delt floor (incline 3, pec-deck, laterals 4+4) |
| Tenfold | Consolidation 5×10; collapse −10% if any of first 5 sets ≤7; accessories hard-two; `tenfoldProgression` |
| Neural | Rest 270s after singles / 180s after sixes; discharge percents drop; lighter second six allowed; isolation hard-two; `neuralOverloadProgression` |
| QF / Cathedral / OD / Arms / Foundry / Workhorse / Gravity | Isolation last-set-failure / myo / lengthened partials as specified |
| Arms Race | Bayesian lead; myo instead of +1 set; **arm tape** widget (`armMeasurements`) |
| Peachy | Abduction 2×/week; W9+ squat / paused squat extra set |
| Event Horizon | Week 7 named Deload, sets −1; isolation hard-two + last-set-failure |
| Chimera | `reallocationCap` → 4 after two failed ±2 blocks; hypertrophy slots hard-two |
| Blackout | Stall add-set copy = rest-pause, not a second backoff |
| Kali | Aggressive deficit drops last ≤2-set accessory; dashboard toggle persists `kaliStatus.aggressive`; large “performance retained %” |
| REDLINE | Furnace finishers cap 360s unless recovery is `recovered` |
| The Minimum | Week ≥6 with unused bonuses → dayName `· bonus unused` |
| Immaculate | Weeks 3–7, days 2 and 4: if working load vs Poliquin close-grip ratio is &lt;90%, +2 sets on that slot; rear-delt hard-two |
| Atlas | Two identical carry limiters swap the next carry via `nextCarryFor`; limiter chips on carry slots; `atlasProgression` logs `time × load` |
| Oracle | `predictedKg` on the slot; ledger shows predicted vs logged |
| Lazarus | Memory-curve opening stamped as `predictedKg`; dashboard predicted vs logged; no week skip |
| Adventure | Equipment filter persisted on `user.adventureEquipment` |
| Iron Clock | Density blocks count as **1** working set (the 154-set metric was rounds×exercises) |
| Quadfather | After two unaccepted strained/impaired flags on the same id, auto-apply `proposeKneeSwap`; Load / Depth / Burn card |
| Cathedral | Press / Stretch / Adduction card |
| House of Iron | Laterals and sissy last-set-failure |
| Purgatorio | C-pair curls/pressdowns and laterals hard-two + last-set-failure |
| Volume analysis | `maxDirectSets` / `maxSpecialisationSets` warnings; OD `splitDelts` front-vs-side warning. Errors still 0 |

---

## Types / persistence added

`workingLoads`, `liftHistory`, `neuralOverloadStatus`, `tenfoldStatus`, `LiftingStats.bodyweightKg`, `WorkoutDay.weekNumber`, `KaliStatus.aggressive`, `Exercise.predictedKg`, `armMeasurements`, `adventureEquipment`, `onboarding.requireBodyweight`, dashboard widget `arm_tracker`.

---

## Constraints kept

- No invented library entries for equipment not in the gym.
- Hard-two is isolation / machines / cables / DBs / unilateral. Never squat, RDL, standing press, weighted-chin strength, Neural 1–6, or Tenfold 10×10.
- No new plans. Atlas / Chimera / Oracle / Blackout / Kali trees stay runtime, not flattened into extra `definePlan` phases.
- Arms Race biceps volume was not cut to ~20.
- Monolith rounding is still on hold.

---

## Verification (this pass)

- `npx tsc -b` clean
- `verify:library` 232 exercises / 36 plans
- `verify:progression` 93 assertions
- `verify:techniques` OK
- `verify:volume` 0 errors (advisory ceilings / split-delt warnings only)
- Iron Clock week 1 reports **52** direct sets (density = 1), not 154

---

## Follow-ups still outside this branch

- Monolith per-machine plate jumps (owner will report later)
- Any remaining dashboard-only polish that is not training
- Live density countdown UI for Iron Clock if a clock is still missing in the session view
