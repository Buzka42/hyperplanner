# Ritual of Strength

**Program ID:** `ritual-of-strength` · **Source:** [src/data/ritual.ts](../../src/data/ritual.ts)
**Duration:** 16 weeks (4-week ramp-in + 12-week main phase) · **Frequency:** 3 days/week (Mon / Wed / Fri pattern)

Cult-themed powerlifting frequency program: every session touches all three lifts — one at max effort, the other two light — plus user-chosen accessories.

## Phase 1: Ramp-In (Weeks 1–4, first-timers)

Each week: Day 1 bench focus, Day 2 squat focus, Day 3 deadlift focus, each with 2 accessories (rows/face pulls, ham curls/leg extensions, farmer holds/ab wheel).

- Week 1: 3×9 @ **70%** of 1RM
- Week 2: 3×6 @ **80%**
- Week 3: 3×3 @ **90%**
- Week 4: **Ascension Test** — 1 AMRAP @ **85%** + 3×5 back-down @ 80%. The AMRAP is run through Epley (`weight × (1 + reps/30)`, floored to 2.5 kg) and **replaces the stored 1RM** for that lift.

Users marked `isFirstProgram: false` skip straight to week 5 (`preprocessDay` swaps in week-5 content).

## Phase 2: Main Phase (Weeks 5–16)

Every session (rotating which lift is ME):

- **ME lift:** 1 heavy single @ ~**95%** of current 1RM (+ accumulated ME progression)
- **Other two lifts (Light):** 3×5 @ **70%** — velocity work
- Day 3 adds Farmer Holds 3×20-30 s
- Up to 3 **user-selected accessories** per day type (bench: rows/rear delts/tricep ext/face pulls; squat: ham curls/leg ext/hip thrusts/calves; deadlift: shrugs/pull-aparts/ab wheel/planks) at 3×10-12, injected from `ritualStatus.ritualAccessories`.
- Day names for weeks 8 and 16 used to incorrectly read "Purge Day" (they're Ascension Test weeks, not deload weeks) — fixed to always use the normal Bench/Squat/Deadlift day names.

**Ascension Tests** recur every 4 weeks (weeks 8, 12, 16): AMRAP @ 85% + back-downs, updating 1RMs via Epley. This update now correctly fires on **every** ascension week (see bugfix note below) — not just week 4.

> **Known gap (pre-existing, not yet built):** "Purge/deload weeks" after weeks 8/12/16 are referenced in `preprocessDay` (checking for dynamically-inserted weeks 9/17) but the program's static week array only contains weeks 1–16 and nothing ever inserts a week 9 or 17 — so this deload path is currently unreachable. Likewise, the Light-work velocity checkbox ("Good bar speed?") is rendered but its "-5% if slow" answer is not yet persisted anywhere, so it has no effect on next session's weight. Both are pending features, not something this pass touched.

## Progression Mechanics (applied in `handleSaveSession`)

- **Ascension Test 1RM update (fixed):** previously this only ran when `weekNum === 4`, so the recurring Ascension Tests at weeks 8/12/16 never actually updated the stored 1RM — the ME weight would silently stall since `calculateWeight` derives everything from that 1RM. It's now gated purely by the exercise name containing "Ascension Test" (which only appears on ascension weeks anyway), so all four tests (4, 8, 12, 16) update the 1RM via Epley. Each Ascension Test recalculation also **resets that lift's accumulated ME checkbox bonus to 0** — the bonus was computed against the old 1RM and would otherwise stack on top of the freshly-recalculated one.
- **ME singles auto-PR:** any successful single heavier than the stored 1RM (floored to 2.5 kg) overwrites it.
- **Checkbox progression:** after entering a single, a safety checkbox appears — "RPE ≤9 with perfect form?" → queues **+2.5 kg** for the next ME session; a second checkbox ("exceptionally easy") upgrades it to **+5 kg**. Stored per-lift in `benchMEProgression / squatMEProgression / deadliftMEProgression` and added on top of the 95% calculation.
- **Velocity check on Light work:** UI-only today (see known gap above) — answering the bar-speed checkbox does not currently change next session's weight.

## State & Badges

`ritualStatus`: three 1RMs, `currentWeek`, `completedWorkouts`, `isFirstProgram`/`rampInComplete`, weak points, accessory picks, ME progressions, `lastAscensionWeek`, `lastDeloadWeek`.

Badges: **Initiate of Iron** (complete week 1, all 3 sessions) · **Disciple of Pain** (complete ramp-in incl. all of week 4) · **Acolyte of Strength** (any week-16 log) · **High Priest of Power** (2+ full cycles with continued training) · **Eternal Worshipper** (Ritual PRs are all-time bests across all programs, all three lifts).

Dashboard centerpiece: the **Strength Altar** — three candles displaying current bench/squat/deadlift 1RMs.
