# Peachy

**Program ID:** `peachy-glute-plan` · **Source:** [src/data/peachy.ts](../../src/data/peachy.ts)
**Duration:** 12 weeks · **Frequency:** 4 days/week (Mon / Wed / Fri / Sat)

Glute-focused lower/upper hybrid. The only light-pink theme in the app; the dashboard mascot switches from Froggy (weeks 1–4) to Peachy (week 5+).

## Weekly Structure (identical every week)

- **Monday – Glute & Leg Heavy:** Sumo Deadlift 3×5-8, FFE Bulgarian Split Squat 3×8-12, Squats 3×5-10, Seated Ham Curl 3×8-12, Hack Squat Calves 3×15-20
- **Wednesday – Glute & Upper Pump:** Kas Glute Bridge 3×8-12, 45° Hyperextension 2×15-20, Standing Military Press 2×8-12, Incline DB Bench 2×8-12, Inverted Rows 3×8-12, Side-Lying Rear Delt Fly 3×12-15
- **Friday – Posterior Chain:** DB RDL 3×5-8, **Paused Squat 3×5-10 @ 80% of Monday's squat**, GHR (eccentric only) 3×failure, Hip Adduction 3×8-12, Leg Press Calves 3×15-20
- **Saturday – Unilateral & Pump:** Deficit Reverse Lunge 2×8-12, SL Machine Hip Thrust 3×12-15, Deficit Push-ups 3×max, Assisted Pull-ups 2×max, Y-Raises 2×12-15, Lying Cable Lat Raises 3×12-15
- **Week 12 Saturday:** adds the 100-rep **Glute Pump Finisher**.

## Calculations (`calculateWeight`)

- **Paused Squat (Friday):** finds this week's Monday squat entry in `squatHistory` and returns **80% of it, floored to 2.5 kg**. Falls back to `stats.squat × percentage` (rounded to nearest 2.5) if no history.
- Everything else is user-entered.

## Progression & Phase Logic

- **Squats:** hitting **3×10** last week → "+2.5 kg now."
- **All other range exercises:** standard double progression — every set at the top of the range → "Increase Weight!".
- **Weeks 9–12 intensifier:** Bulgarian Split Squats and Deficit Reverse Lunges get "LAST SET: drop to bodyweight, go to failure".

## Tracking, Badges & Widgets

- Every "Squats" session logs max completed weight/reps into `squatHistory` (drives the squat progression chart and Paused Squat calc).
- **Glute tracker widget:** weekly circumference (cm) entries stored in `gluteMeasurements` with a mini trend chart; **+3 cm total → Glute Gainz Queen** badge.
- Other badges: 48 completed sessions → **Peachy Perfection**; Kas Glute Bridge ≥100 kg completed set → **Kas Glute Bridge 100**; squat +30 kg from first to last log → **Squat +30 kg**.
