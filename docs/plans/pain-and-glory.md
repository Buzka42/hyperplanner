# Pain & Glory

**Program ID:** `pain-and-glory` · **Source:** [src/data/painglory.ts](../../src/data/painglory.ts)
**Duration:** 16 weeks · **Frequency:** 4 days/week (Pull Mon / Push Tue / Push Thu / Pull Fri)

Intermediate **deadlift specialization** built on brutal submaximal volume: 8 weeks of 10×6 deficit snatch-grip pulls, 4 weeks of E2MOM conventional work, then a 4-week peak to a max single.

## Phase Map (main pull movement)

| Weeks | Pull Day 1 (Mon) | Pull Day 2 (Fri) |
|---|---|---|
| 1–8 | Deficit Snatch Grip DL 10×6 | Deficit Snatch Grip DL 10×6 |
| 9–12 | Deficit Snatch Grip DL 10×6 | Conventional DL **E2MOM 6×3-5** |
| 13 | **AMRAP test** + 3×5 back-down | Conventional DL (CAT) 4×6 |
| 14 | Heavy Triple @ RPE 9 + 3×3 back-down | CAT 4×6 |
| 15 | Heavy Double @ RPE 9.5 + 3×2 back-down | CAT 4×6 |
| 16 | **Heavy Single @ RPE 10** (+ optional 2nd single) | CAT 4×6 |

**Fixed accessories every pull day:** Close Neutral Lat Pulldown 4×6-10, Slow-Eccentric Cheat Nordics 2×failure, SL Machine Hip Thrust 3×8-12, Dead Hang + Planks 3×failure.
**Push days (identical Tue/Thu, all 16 weeks):** Paused Low Bar Squat 4×4-6 @ ~70%, Leg Extensions 3×6-10, Hack Squat Calves 3×15-20, Incline DB Bench 4×6-10, Standing Military Press 3×6-10.

## Calculations & Progressions

- **Deficit Snatch Grip:** starts at **45% of `conventionalDeadlift` 1RM**, floored to 2.5 kg. After every session (weeks 1–11) an RPE modal asks how it felt:
  - ⚔️ Ready For More → **+5 kg** next session
  - 🩸 Good, Maintain → same weight
  - 💀 Wrecked → **−5 kg** (floor 20 kg)
  The running value lives in `painGloryStatus.deficitSnatchGripWeight`.
- **Paused Low Bar Squat:**
  - Weeks 1–4: base = `lowBarSquat 1RM × 0.70`; all sets completed at 4–6 reps → `squatProgress` +2.5 kg for next session.
  - Week 5 reset: base = `(1RM × 1.075) × 0.70` + accumulated progress.
  - Week 8's weight is saved as `week8SquatWeight`; weeks 9–16 hold **85% of it** as maintenance (deadlift peaking takes priority).
- **Conventional E2MOM (weeks 9–12):** start weight = **highest deficit weight × 1.35** (floored). All 6 sets at ≥5 reps → `e2momWeightAdjustment` +2.5 kg.
- **Week 13 AMRAP:** target weight = **deficit weight × 2.22 × 0.85** (floored). The result is stored (`amrapWeight`, `amrapReps`) and Epley e1RM (`estimatedE1RM`, floored to 2.5) drives the peak:
  - Week 13 back-down: 85% of AMRAP weight
  - Week 14 triple: **e1RM × 0.90** (back-down ×0.85 of that)
  - Week 15 double: **e1RM × 0.93** (back-down ×0.875)
  - Week 16 single: **e1RM × 0.97**
  - CAT sets (weeks 13–16): **70% of AMRAP weight**
- **Accessories:** standard double progression advice (top of range on all sets → increase weight). Main lifts are excluded from advice since they auto-progress.

## Badges & Widgets

- **Void Gazer:** ≥6 distinct weeks logged in weeks 1–8 incl. week 8 · **EMOM Executioner:** 6 sets ×5 in weeks 9–12 · **Deficit Demon:** +30 kg on deficit pulls within weeks 1–8 · **Glory Achieved:** Week 16 deadlift beats all prior weights · **Single Supreme:** Week 16 single ≥97% e1RM · **50 Tonne Club:** 50,000 kg total deadlift tonnage.
- Dashboard: **Glory Counter** (total kg lifted across all deadlift variations, progress bar to 50 t) and the deficit snatch-grip tracker.
