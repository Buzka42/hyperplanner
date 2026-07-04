# Bench Domination

**Program ID:** `bench-domination` · **Source:** [src/data/program.ts](../../src/data/program.ts)
**Duration:** 16 weeks (15 generated weeks + 1 inserted deload) · **Frequency:** 6 days/week (4 bench days + 2 optional leg days)

The flagship bench-press specialization program. Everything revolves around a single number — the **Paused Bench base** — which is seeded from the onboarding 1RM and then driven entirely by Saturday AMRAP performance.

## Weekly Structure (Weeks 1–12)

| Day | Session | Bench work |
|---|---|---|
| Monday | Heavy Strength | Paused Bench 4×3 @ 82.5% (85% from W5, 87.5% from W10), Wide-Grip 3×6-8, BTN Press 4×3-5, Tricep Giant Set, Dragon Flags |
| Tuesday | Legs | Lunges, leg press, Nordics, hip thrusts, calves, adduction (toggleable module) |
| Wednesday | Volume Hypertrophy | Paused Bench 4×5-10 @ 72.5%→77.5%, Spoto Press 3×5 @ 72.5%, Weighted Pull-ups, Y-Raises, Around-the-Worlds |
| Thursday | Power / Speed | Paused Bench 5×3-5 @ **65% of last week's AMRAP e1RM** (explosive), Low Pin Press 2×4 @ 77.5%, BTN Press 4×5-8, Tricep Giant Set |
| Friday | Legs | Copy of Tuesday |
| Saturday | AMRAP Test | **Paused Bench AMRAP @ 67.5%**, back-off 3×5, Wide-Grip, Pull-ups, Y-Raises |
| Sunday | Rest | — |

Week 9 is an auto-inserted deload (see below); original weeks 9–15 shift to 10–16.

## The Base-Weight Engine (`getPausedBenchBase`)

All bench percentages are taken from a *current base*, not the raw onboarding 1RM:

1. **Start:** base = onboarding `stats.pausedBench`.
2. **Weekly AMRAP progression:** each logged Saturday AMRAP is checked against a phased rep threshold. Meeting it adds **+2.5 kg** to the base:
   - Weeks 1–6: ≥12 reps
   - Weeks 7–9: ≥10 reps
   - Weeks 10–12: ≥8 reps
   - Weeks 13+: ≥6 reps
3. **e1RM recalculation** at the start of weeks 5, 9, 13 (after completing weeks 4/8/12): the checkpoint week's AMRAP is run through **Epley** (`e1RM = weight × (1 + reps/30)`), rounded **down** to 2.5 kg, and that becomes the new base. Progressions from before the checkpoint are discarded; only post-checkpoint AMRAPs add +2.5 kg on top.

**Rounding rules** (`calculateWeight`):
- Heavy day (Mon): round to **nearest** 2.5 kg with a safety cap (never round up more than +2.5 kg).
- Volume/AMRAP days (Wed/Sat): round **up** to 2.5 kg so progression is always visible.

`benchHistory` entries store `weight` = calculated e1RM, `actualWeight`/`actualReps` = the real AMRAP set.

### Thursday is the exception: `getPowerDayBenchBase`

Thursday's Paused Bench weight is **not** part of the cumulative base system above. It is simply **65% of last week's Saturday AMRAP e1RM**, recalculated fresh every single week — it never compounds and never increases on its own; it only moves when the most recent AMRAP e1RM changes. If no AMRAP has been logged yet (week 1), it falls back to the onboarding 1RM. This applies to both the working weight (`calculateWeight`) and the warm-up sets generated for that day.

## Deloads

- **Forced deload (Week 9):** inserted automatically after Week 8 Saturday. Duplicates Week 8 with **−15% weight and half volume**. Leg-exercise deload weights are auto-derived from the last completed leg day (−15%, floored to 2.5 kg).
- **Reactive deload:** two consecutive Saturday AMRAPs ≤7 reps (checked in weeks 5–8) triggers the forced deload early. `preprocessDay` also applies −15%/half-volume to any day when the last two AMRAPs were ≤7.
- **Big-drop check:** at the Week 5 recalc, if the new base dropped >15% vs. Week 4's base, an extra deload week is registered (`drop-recalc`).
- Deload state lives in `benchDominationStatus.addedDeloadWeeks` / `forcedDeloadCompleted`.

## Week 13 Crossroads & Peaking (Weeks 13–16)

After Week 12 the dashboard forces a choice (`post12WeekChoice`):
- **Test now:** Saturday of Week 13 becomes a **1RM test** (target 100–105% of base); weeks 14+ are hidden.
- **Peak:** 3-week peaking block —
  - Week 14: 4×2 @ ~91% + light technique Saturday (4×3 @ 65%)
  - Week 15: 5×1 @ ~96% + very light technique (3×2-3 @ 60%)
  - Week 16: Monday primer (3×3 @ 50%), **Saturday Judgment Day: 1RM test @ ~105%**

Week 13 itself is a selective deload: Monday drops Wide-Grip and triceps, Wed/Thu bench work gets −15%/half volume, Saturday keeps only AMRAP/test + pull-ups + delts.

## Accessory Progression Rules

- **Behind-the-Neck Press:** seeded at 40% of bench 1RM (floored to 2.5 kg). Monday is the driver: if all 4 sets hit the top of 3–5 reps, `btnPress` +2.5 kg for next week (`btnPressWeek` prevents same-week application). Thursday always uses 85% of Monday's weight.
- **Spoto / Low Pin Press:** fixed rep target; all sets hit → stored working weight +2.5 kg immediately.
- **Wide-Grip Bench:** needs **2 consecutive Mondays** at the top of 6–8 before +2.5 kg (`wideGripConsecutive` counter). A miss resets the counter.
- **Variation-weight heuristic:** if a stored variation value is >85% of bench 1RM it's treated as a 1RM (percentage applied); otherwise it's used directly as a working weight.
- **Weighted Pull-ups (EMOM system):**
  - Weeks 1–3: +2.5 kg fixed, EMOM style — each completed set at target spawns the next row (cap 15 sets).
  - Weeks 4–6: fixed 15 kg EMOM, 3–5 reps.
  - Weeks 7–9: daily max triple, then back-off sets at 87.5% (auto-filled).
  - Week 10: max-effort single (stored as `pullup1RM`), then 92.5% sets.
  - Weeks 11–13: 4 sets of 2+ at auto-calculated 92.5% of the stored 1RM (rounded up to 2.5).
  - The displayed rep-range text for Saturday (and pre-override Wednesday) pull-ups is bucketed by the **final, post-deload-insertion week number** (`displayWeek = w >= 9 ? w + 1 : w`), not the raw generation-loop week — otherwise the Week 9 deload insertion shifts every bucket boundary off by one for weeks 10+.
- **Tricep Giant Set:** dips 5 → rolling extensions 12 → banded skullcrushers 25; 2 rounds (3 from W9). "Increase weight" advice when the last skullcrusher step hits 25.

## Modules & Warm-ups

`benchDominationModules` toggles: tricep giant set, BTN press, weighted pull-ups, accessories, leg days, Thursday tricep variant (`giant-set` | `heavy-extensions` 4×4-6), and `lowPinPressExtraSet` (moves one Thursday set from Paused Bench to Low Pin Press). Custom training-day selection remaps workouts, placing rest-critical sessions (Heavy, AMRAP) on isolated days.

Elite warm-up protocol is auto-generated for Paused Bench and BTN: bar ×8-10 → 50%×5 → 70%×3 → 85%×2 (→ 95%×1 on heavy days). 1RM tests use more conservative 75%/88% steps.
