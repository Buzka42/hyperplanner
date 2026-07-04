# Super Mutant

**Program ID:** `super-mutant` · **Source:** [src/data/supermutant.ts](../../src/data/supermutant.ts)
**Duration:** 16 weeks (4 × 4-week cycles) · **Frequency:** dynamic — the app generates the next workout on demand

Fallout-themed high-frequency bodybuilding. There is no fixed calendar: `preprocessDay` calls `generateNextWorkout(user)` every time, building the session from muscle-group **cooldown timers** and a rolling **7-day set-volume** ledger.

## The Queue System

Muscles are grouped into four blocks:

| Block | Muscles | Cooldown |
|---|---|---|
| Upper A | Chest, Triceps, Biceps | 48 h |
| Upper B | Back, Shoulders, Calves | 48 h |
| Lower C | Hamstrings, Glutes, Lower Back | 72 h |
| Lower D | Quads, Abductors, Abs | 72 h |

Each workout = **one upper block (always) + one lower block (if off cooldown)**. Block choice is **stateless**: among the blocks whose muscles are all recovered, the one trained longest ago wins ("sort by oldest"), which alternates A↔B / C↔D naturally and falls back to the other block when the scheduled one is still cooling down. (`nextUpperBlock`/`nextLowerBlock` are legacy fields nothing writes — not used.) A **10-hour grace period** lets you train slightly early (`isMuscleGroupReady`). If neither upper block is ready → Rest Day.

**Exercise selection:** chest and back alternate A/B variants each time they're trained (pre-exhaust → main → finisher for chest; 3 movements for back). Quads and hamstrings use the onboarding preference (Hack vs Front Squat; Good Mornings vs Deficit RDLs).

## Reactive Volume (`calculateReactiveSetsForMuscle`)

Target ≈ **20 sets per muscle per week**. Per-exercise sets are computed as `ceil((20 − current7DayVolume) / estimatedMuscleSessionsThisWeek)`, clamped to **2–4**. Pre-exhaust and finishers are fixed at 2 sets; lower-body muscles with no volume history start at 4. Muscles already **over 20 sets/7d** (triceps, biceps, shoulders) are dropped from the session entirely. A "crank" rule bumps the first primary movement to 4 sets when the projected session is under 45 minutes.

**Volume accounting (on save)** uses fractional counting driven by `getMuscleContributions(exerciseId)` in supermutant.ts — a stable **exercise-id → muscle shares** map (1.0 primary, 0.5 assisting): presses log 1.0 chest + 0.5 triceps + 0.5 shoulders per completed set, rows 1.0 back + 0.5 biceps + 0.5 rear delts, squats 1.0 quads + 0.5 hams/glutes/abductors, etc. Timestamps (`muscleGroupTimestamps`) restart cooldowns for every muscle with a 1.0 share. (The old name-keyword matching mis-attributed sets — "Seated Ham Curl"→biceps, "Standing Calf Raises"→shoulders — and is gone.)

## RIR Wave (4-week cycles)

`getRIRForWeek` maps the workout count into a repeating 4-week intensity wave:

- Week 1: **2 RIR**
- Week 2: **1 RIR**
- Week 3: **0 RIR** (to failure)
- Week 4: **past failure** — every exercise note includes an intensification technique:
  - Main lifts → **Rest-Pause** (fail, 10–15 s, 3–5 more reps, ×2–3)
  - Pre-exhaust → **Dropset** (−20–30%, 2–3 drops)
  - Finishers/abs → **Myo-reps** (activation set + 3–5 mini-sets)

**Rep ranges shift by cycle** (`getRepRange`): cycles 1–2 → main 8-12 / isolation 10-15; cycles 3–4 → main 10-15 / isolation 15-20.

## Deload (Week 9)

Workouts 57–63 (after 8 full weeks at 7/week pace) generate deload sessions: one block, **one exercise per muscle at 2 sets**, RIR 2–3, form focus.

## State & Badges

`superMutantStatus`: `completedWorkouts`, `currentCycle`, per-muscle timestamps and rolling volume, A/B variant flags, block alternation, exercise preferences, `weeklySessionDates` (7-day session cap tracking), initial 1RMs.

Badges: **Super Mutant Aspirant** (72 workouts) · **Behemoth of the Wastes** (84 workouts).

**Dashboard/system extras:** Mutagen Exposure progress widget (X/84), an over-mutation warning when ≥6 sessions land in the rolling 7 days, and at 84 workouts the INITIATE card becomes a re-run offer (resets counters/volume/timestamps, keeps history; add +2.5-5 kg to working weights manually). Settings has a dev-labeled **Skip 24 hours** button that shifts all cooldown timestamps back a day. Workout drafts restored from localStorage are reconciled against the freshly generated day, since the same week/day slot can regenerate differently.

Dashboard: **Recovery Gauge** (all 12 muscles with ready/soon/cooldown status + 7-day set counts), rotating Mutant Mindset quote (indexed by workout count), and the INITIATE button that routes to the next generated session (`week = floor(count/7)+1`, `day = count%7+1` — each workout gets a unique save slot).
