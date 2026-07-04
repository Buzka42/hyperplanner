# Pencilneck Eradication Protocol

**Program ID:** `pencilneck-eradication` · **Source:** [src/data/pencilneck.ts](../../src/data/pencilneck.ts)
**Duration:** 8 weeks per cycle, repeatable (Cycle 2+ changes the rules) · **Frequency:** 4 days/week (Push A / Pull A / rest / Push B / Pull B)

A classic hypertrophy push/pull split with legs folded into each day. All loading is **user-driven double progression** — the app never calculates weights, it only tells you when to add.

## Weekly Structure (identical every week)

- **Day 1 – Push A:** Flat BB Bench 3×8-12, Incline DB Press 3×10-14, Cable Flyes 3×12-15, Seated DB Shoulder Press 3×8-12, Leaning Lateral Raises 3×15-20, Overhead Tricep Ext 3×12-15, Hack Squat 3×10-15, Leg Extensions 3×15-20, Leg Press Calves 3×12-18
- **Day 2 – Pull A:** Hammer Pulldown 3×8-12, Seated Cable Row 3×10-14, Lat Prayer 3×12-15, Wide Grip BB Row 3×15-25, Side-Lying Rear Delt Flyes 3×15-20, Preacher Curls 3×10-15, RDL 3×8-12, Lying Leg Curls 3×12-16, Hanging Leg Raises 3×12-20
- **Day 4 – Push B:** Incline BB Bench 3×8-12, Flat DB Press 3×10-14, Pec Deck 3×12-15, Standing Military Press 3×8-12, Laterals 3×15-20, Close-Grip Bench 3×10-14, Front Squats 3×10-15, Walking Lunges 3×12-16, Hack Calf Raises 3×15-20
- **Day 5 – Pull B:** Lat Pulldown (neutral) 3×10-14, SA Hammer Row 3×10-14, SA DB Row 3×12-15, Rear-Delt Rope Pulls 3×20-30, Machine Rear Delt Fly 3×15-20, Incline DB Curls 3×12-15, Stiff-Legged DL 3×10-14, Seated Leg Curls 3×12-16, Ab Wheel 3×failure

Swappable via Settings preferences: Hack Squat ↔ High-Foot Leg Press, Pec Deck ↔ Low-to-High Cable Flyes, Front Squats ↔ Narrow-Stance Leg Press ↔ Stiletto Squats.

## Phase Logic (`preprocessDay`)

- **Weeks 1–4 (Volume phase):** rep ranges as listed above.
- **Weeks 5–8 (Heavy phase):** every exercise in the `COMPOUND_EXERCISES` set switches to **6–10 reps** (isolation work is untouched). Swapped-in exercises not in the set keep high reps by design.
- **Intensity techniques:** the last set of each compound gets "Drop Set or Rest-Pause to Failure" —
  - Cycle 1: weeks 7–8 only.
  - Cycle 2+: all 8 weeks.
- **Week 8 Day 4 Final Exam:** bonus Leaning Lateral failure + drop set, and a 100-rep Rear Delt Burnout.

## Progression (all via `getExerciseAdvice`)

- **Standard double progression:** all sets completed at the **top of the rep range** → "Increase weight!" next session. Weights are always user-entered.
- **Week 5 heavy-phase seeding:** for each compound, the app scans the last ~5 logs for the best completed weight and suggests **max × 1.15**, floored to 2.5 kg.
- **Cycle 2 Week 1 reload:** suggested weight = Cycle 1 Week 8 max × **0.87 (compounds) / 0.92 (isolation)**, but never below **Cycle 1 Week 1 weight × 1.10**; floored to 2.5 kg.
- Cycle context is smuggled into exercise IDs as a `-c{n}` suffix so advice can tell cycles apart.

## Tracking & Completion

- **Bench e1RM tracking:** every Flat BB Bench session stores the best Epley e1RM in `pencilneckBenchHistory` (feeds the 20/30 kg bench-jump badges).
- **Completion:** finishing Week 8 Pull B sets `pencilneckStatus.completed`, plays the victory screen and awards **Certified Boulder**. Cycle 1 completion offers "Start Cycle 2" (resets progress, `cycle: 2`); Cycle 2 completion points at trainer contact.
- Dashboard widgets: Commandments list, Trap Barometer (week/8 progress), weekly status quotes.
