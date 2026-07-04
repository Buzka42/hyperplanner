# Trinary

**Program ID:** `trinary` · **Source:** [src/data/trinary.ts](../../src/data/trinary.ts)
**Duration:** 27 workouts = 9 blocks × 3 workouts (workout-count based, not calendar) · **Frequency:** flexible; recommended spacing shown on dashboard

**Conjugate-periodization powerlifting.** Every workout trains all three lifts, each under a different effort type, rotating so each lift cycles through Max Effort → Dynamic Effort → Repetition Effort across a block.

## Workout Pattern

| Position in block | ME | DE | RE |
|---|---|---|---|
| Workout 1 | Deadlift | Squat | Bench |
| Workout 2 | Squat | Bench | Deadlift |
| Workout 3 | Bench | Deadlift | Squat |

Set/rep prescriptions (`getSetTarget`):
- **ME:** depends on the onboarding **Max Effort Style** choice (`trinaryStatus.meRepMaxStyle`):
  - `3rm` (default): 3×1-3 @ RPE 9 — a short ladder building to a top triple.
  - `1rm`: 1×1 @ RPE 9 — a single top-set attempt, mirroring Ritual of Strength's ME day.
  - The static program template always generates the `3rm` version; `preprocessDay` overrides `sets`/`target` per-user based on the stored choice. Progression logic (both the RPE selector's visibility and the save-time 1RM bump) reads the required rep count from the *processed* exercise (`ex.sets <= 1 ? 1 : 3`), so it stays correct either way.
- **DE:** 8×2-3 (speed)
- **RE:** 4×8-12 — for the deadlift slot specifically, the movement itself is a user choice (see below).

## Loading (`calculateWeight`)

Weight = **lift 1RM × block percentage**, floored to 2.5 kg. Block percentages rise every 3 blocks:

| Blocks | ME | DE | RE |
|---|---|---|---|
| 1–3 | 90% | 60% | 70% |
| 4–6 | 92% | 65% | 75% |
| 7–9 | 95% | 70% | 80% |

1RMs live in `trinaryStatus.bench1RM / deadlift1RM / squat1RM` (editable in Settings). The lift is inferred from the exercise name (keyword matching: "bench/press/board/floor…", "deadlift/rdl/deficit/rack pull…", "squat/box/stiletto…").

## Variations & Weak Points

- Blocks 1–3: ME uses the competition lifts (Paused Bench / Conventional DL / Low Bar Squat). DE always uses competition lifts, and so does RE — **except** the RE deadlift slot (see below).
- After workouts 9 and 18 a **weak-point modal** asks where each lift fails (bench: off-chest / mid-range / lockout; deadlift: lift-off / over-knees / lockout; squat: bottom / mid-range / lockout). The app picks the next ME variation from that category (`selectVariation`, rotating through the list, honoring `excludedVariations` from Settings), then a swap modal lets the user override.
- `VARIATION_PERCENTAGES` maps each variation to a suggested starting % of 1RM (e.g. Rack Pulls 115%, Snatch Grip Deficit 65%) — used for the first-day suggestion tip only; actual loading still uses block %.

### RE Deadlift movement (Settings choice)

Unlike every other DE/RE slot, the **Repeated Effort deadlift** movement is user-selectable in Settings: Romanian Deadlift (default), Reverse Hyperextensions, or Good Mornings — stored in `trinaryStatus.reDeadliftVariant`. Reverse Hyperextensions and Good Mornings use `deadlift1RM × RE block %` like any other RE slot; **Romanian Deadlift is a fixed 55% of deadlift 1RM** instead (block-scaled 70-80% would be far too heavy for an 8-12 rep RDL). The RE double-progression bonus still stacks on top for all three variants. The lift-detection keyword matching recognizes "hyperextension" and "good morning" as deadlift-based movements so both the weight calc and the progression bonus resolve correctly.

## Progression

- **ME (RPE-based, applied on save):** once all prescribed sets hit the required top reps (3 for the `3rm` style, 1 for the `1rm` style), the post-set RPE selector grants a 1RM bump: RPE ≤7 → **+10 kg**, RPE 7-8 → **+5 kg**, RPE 8-9 → **+2.5 kg**.
- **RE (double progression):** all 4 sets ×12 → +2.5 kg queued in `reProgressionPending` for that lift's next RE day (stacks).
- **DE:** no progression; speed work rides the block percentages.

## Accessory Days & Cycle End

- If ≥4 workouts were logged in the last 7 days, the next session becomes an **accessory day** (upper: triceps/rows/shoulder press/rear delts; lower: leg ext/ham curls/calves/hip thrusts — all 4×8-12). Preference or alternation decides upper vs lower; it can be skipped (`skipNextAccessory`) or forced manually from the dashboard. Accessory days don't advance the 27-workout counter.
- **After workout 27** a re-run modal offers: (A) deload week re-run (50% volume, −25% ME / −15% DE-RE), (B) continue immediately, or (C) 4–5 days rest with light accessories. All paths reset to workout 1, increment `cycleNumber`, and re-ask weak points.

Dashboard shows the next workout's ME/DE/RE preview, 27-workout progress bar, block counter, and the three 1RMs.
