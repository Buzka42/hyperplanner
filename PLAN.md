# Workout Planner - Master Program Documentation

This document serves as the single source of truth for all workout programs, progression logic, and exercise specifications available in the application. It consolidates previous documentation and includes the latest updates.

**Note:** For technical implementation details, see `README.md`.

---

## 1. Bench Domination (`bench-domination`)
*The flagship program designed to detonate your bench press 1RM.*

### Plan Configuration
*   **Duration:** 15 Weeks
*   **Frequency:** Up to 6 Days/Week (User Selectable & Smart Assigned)
*   **Widgets:** `1rm` (Base Management), `program_status` (Progress), `strength_chart` (History)

### Modules (User Customization)
These toggles strictly **remove** exercises if disabled.
*   **Tricep Giant Set:** Enables/Disables "Tricep Giant Set" (Mon/Thu).
*   **Behind-the-Neck Press:** Enables/Disables "Behind-the-Neck Press" (Mon/Thu).
*   **Weighted Pull-ups:** Enables/Disables "Weighted Pull-ups" (Wed/Sat).
*   **Accessories:** Enables/Disables "Dragon Flags" (Mon), "Y-Raises" (Wed), and "Around-the-Worlds" (Wed).
*   **Leg Days:** Enables/Disables the entire Tuesday and Friday workouts.

### Progression Logic

> **Sustainable progression for long-term gains – no large jumps, no microplates.**

*   **User Base Weight (`pausedBench`) – Phased AMRAP Thresholds:**
    *   **Weeks 1–6:** Saturday AMRAP **≥12 reps** = +2.5 kg next week
    *   **Weeks 7–9:** Saturday AMRAP **≥10 reps** = +2.5 kg next week
    *   **Weeks 10–12:** Saturday AMRAP **≥8 reps** = +2.5 kg next week
    *   **Peaking Weeks 13–15:** Saturday AMRAP **≥6 reps** = +2.5 kg next week
    *   **Below Threshold:** No increase (Stall)
    *   **Max Jump:** +2.5 kg only (no larger jumps, no microplates)
    *   **Logic:** Adds +2.5kg directly to base weight for every qualifying AMRAP week found in history.

*   **Bench Press Variations (Independent from Main AMRAP):**
    *   **FIXED Rep Targets (Spoto Press 5 reps, Low Pin Press 4 reps):**
        *   Hit exact target reps on **ALL sets** in current session = automatic **+2.5 kg** next session
        *   Miss any set = keep same weight
        *   Message: *"Target reps hit – weight auto-increased +2.5 kg next time"*
    *   **REP RANGES (Wide-Grip Bench Press 6–8 reps):**
        *   Hit TOP of range (8 reps) on **ALL sets** for **2 consecutive weeks** = +2.5 kg
        *   Otherwise = keep same weight
        *   Message: *"Hit top reps on all sets for 2 straight weeks → +2.5 kg"*
    *   **Smart Weighing**: Automatically detects if stored stat is 1RM (>85% of Bench) or Working Weight.

*   **Behind-the-Neck Press:**
    *   **Monday (Heavy)**: Hit max reps (5) on all sets = **+2.5 kg** for NEXT week.
    *   **Thursday (Volume)**: Auto-scaled to **85%** of Monday's weight.

*   **Weighted Pull-ups (EMOM Progression):**
    *   All weights in kilograms only (no lbs)
    *   **Weeks 1-3:** Max reps EMOM until form breaks
        *   Add smallest plate (2.5 kg)
        *   Start every minute, rest for remainder
        *   Variable sets (up to 15-set cap)
    *   **Weeks 4-6:** Fixed-weight EMOM
        *   User enters weight and reps on first set
        *   App auto-fills ALL remaining sets with EXACT same weight
        *   User can override individual sets
        *   Max 15 fields, live total rep counter
        *   Session ends: "EMOM complete – 15 minutes/sets reached. Total reps: X"
    *   **Weeks 7-9:** Daily max triple + back-offs
        *   1 field for max triple
        *   6 back-off fields auto-filled at 87.5% of max triple weight (rounded to nearest 2.5 kg)
        *   Total: 7 sets
    *   **Weeks 10-12:**
        *   Week 10: 1 field for max single (on Wednesday, Saturday follows Week 11-12 logic)
        *   Weeks 11-12: 5 fields auto-filled at 92.5% of Week 10 max single (rounded to nearest 2.5 kg)

*   **Reactive Deload:**
    *   **Trigger:** If Saturday's AMRAP is **≤7 reps** for **2 consecutive weeks**.
    *   **Effect:** Next week is **-15% Weight, Half Volume**.

*   **Elite Warm-up Protocol (Paused every rep):**
    1.  Empty Bar (20kg): 8-10 reps.
    2.  50%: 5 reps.
    3.  70%: 3 reps.
    4.  85%: 2 reps.
    5.  95%: 1 rep (Heavy Days Only: Mon/Thu).

### Phase 1: Accumulation & Intensity (Weeks 1-12)

#### Monday - Heavy Strength
1.  **Paused Bench Press** (4 sets x 3 reps)
    *   Intensity: 82.5% -> 87.5%
2.  **Wide-Grip Bench Press** (3 sets x 6-8 reps)
    *   Intensity: 67.5%
3.  **Behind-the-Neck Press** (4 sets x 3-5 reps)
4.  **Tricep Giant Set** (2-3 sets)
    *   *Tip:* "~10 second rest between exercises. 2 minute rest between sets."
5.  **Dragon Flags** (3 sets to Failure)

#### Tuesday - Legs (Optional)
1.  **Walking Lunges:** 3 sets, 10-15 reps.
2.  **Heels-Off Narrow Leg Press:** 3 sets, 10-15 reps.
3.  **Reverse Nordic Curls:** 2 sets, Failure.
4.  **Single-Leg Machine Hip Thrust:** 3 sets, 10-15 reps.
5.  **Nordic Curls / Glute-Ham Raise:** 3 sets, Failure.
6.  **Hack Squat Calf Raises:** 3 sets, 15-20 reps.
    *   *Tip:* "1 second pause at bottom."
7.  **Hip Adduction:** 2 sets, 8-12 reps.

#### Wednesday - Volume Hypertrophy
1.  **Paused Bench Press** (4 sets x 8-10 reps)
    *   Intensity: 72.5% -> 77.5%
2.  **Spoto Press** (3 sets x 5 reps)
    *   *Note:* +2.5kg immediately if all sets @ 5 reps.
3.  **Weighted Pull-ups (EMOM)** (Max 15 sets)
    *   *See Weighted Pull-ups progression above for week-specific behavior*
4.  **Y-Raises / High-Elbow Facepulls** (3 sets x 12-15 reps)
5.  **Around-the-Worlds / Power Hanging Leg Raises** (3 sets x 10-16 reps)
    *   *Tip (Leg Raises):* "Explosive movement, slow eccentric, full stretch at bottom. Straight legs if bent is too easy."

#### Thursday - Power / Speed
1.  **Paused Bench Press** (5 sets x 3-5 reps OR 4 sets if Pin Press swap active)
    *   Intensity: 77.5% (Explosive)
    *   *Optional Swap:* Enable "Low Pin Press Extra Set" to move 1 set from Paused Bench → Low Pin Press
2.  **Low Pin Press** (2 sets x 4 reps OR 3 sets if swap active)
    *   *Swap Button:* "Trouble with lockout? Click to swap 1 set of Paused Bench to Pin Press"
3.  **Behind-the-Neck Press** (4 sets x 5-8 reps @ 85% of Mon)
4.  **Tricep Exercise** (3-4 sets) — SWAPPABLE:
    *   **Default:** Tricep Giant Set (Dips 5 / Extensions 12 / Skullcrushers 25)
    *   **Alternative:** Heavy Rolling Tricep Extensions (4 sets x 4-6 reps)
        *   Progression: Hit 6 reps on all 4 sets = +2.5 kg next Thursday
        *   Message: "Heavy tricep option selected – focusing on lockout strength"


#### Friday - Legs (Optional)
1.  **Walking Lunges:** 3 sets, 10-15 reps.
2.  **Heels-Off Narrow Leg Press:** 3 sets, 10-15 reps.
3.  **Reverse Nordic Curls:** 2 sets, Failure.
4.  **Single-Leg Machine Hip Thrust:** 3 sets, 10-15 reps.
5.  **Nordic Curls / Glute-Ham Raise:** 3 sets, Failure.
6.  **Hack Squat Calf Raises:** 3 sets, 15-20 reps.
    *   *Tip:* "1 second pause at bottom."
7.  **Hip Adduction:** 2 sets, 8-12 reps.

#### Saturday - AMRAP Test
1.  **Paused Bench Press (AMRAP)** (1 set)
    *   Progression: Phased thresholds (W1-6 ≥12, W7-9 ≥10, W10-12 ≥8, Peaking ≥6) = +2.5kg Base.
2.  **Paused Bench Press (Back-off)** (3 sets x 5 reps)
3.  **Wide-Grip Bench Press** (3 sets x 6-8 reps)
4.  **Weighted Pull-ups** (Same as Wed)
5.  **Y-Raises** (3 sets)

### Phase 2: Peaking Block (Weeks 13-15)
*   **Week 13 (Doubles):** Mon 4x2 @ 90-92.5%. Sat AMRAP @ 75%.
*   **Week 14 (Singles):** Mon 5x1 @ 95-97.5%. Sat AMRAP @ 81%.
*   **Week 15 (Test):** Mon Active Recovery. Sat **1RM TEST** (105%).

---

## 2. Pencilneck Eradication Protocol (`pencilneck-eradication`)
*A hypertrophy-focused upper/lower split designed to broaden the frame.*

### Plan Configuration
*   **Duration:** 8 Weeks (with optional "Cycle 2" re-run)
*   **Frequency:** 4 Days/Week
*   **Split:** Push A / Pull A / Rest / Push B / Pull B / Rest / Rest
*   **Widgets:** `pencilneck_commandments`, `program_status`, `trap_barometer`

### Progression Phases
*   **Phase 1 (Weeks 1-4):** Standard Hypertrophy Ranges.
*   **Phase 2 (Weeks 5-8):** **Heavy Phase**. All compounds drop to **6-10 Reps**.
*   **Cycle 2+:** Intensity techniques (Drop Sets/Rest-Pause) on LAST SET of all compounds.

### Weekly Schedule & Tips

#### Day 1: Push A (Chest/Delts/Tri/Quads)
1.  **Flat Barbell Bench Press**
    *   3 sets x 8-12 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Slow down the bar before touching chest, do not bounce."
2.  **Incline DB Press (45°)**
    *   3 sets x 10-14 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Upper chest focus. Slight elbow tuck, full stretch."
3.  **Cable Flyes (mid height)**
    *   3 sets x 12-15
    *   *Tip:* "Big stretch, push chest out forward at the bottom."
4.  **Seated DB Shoulder Press**
    *   3 sets x 8-12 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Full ROM, touch shoulders with DBs at the bottom."
5.  **Leaning Single Arm DB Lateral Raises**
    *   3 sets x 15-20
    *   *Tip:* "Lean against a wall at 15-30°, rep ends when DB is pointing straight down."
6.  **Overhead Tricep Extensions**
    *   3 sets x 12-15
    *   *Tip:* Check app for attachment guidance.
7.  **Hack Squat** (Swappable for Leg Press etc.)
    *   3 sets x 10-15 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Feet Narrow, full ROM - ass to grass."
8.  **Leg Extensions**
    *   3 sets x 15-20
    *   *Tip:* "Full ROM, 120° angle between legs and torso."
9.  **Leg Press Calf Raises**
    *   3 sets x 12-18
    *   *Tip:* "Full stretch, explode up, stop 0–1 rep shy."

#### Day 2: Pull A (Back/Rear Delt/Bi/Hams)
1.  **Hammer Pulldown (Underhand)**
    *   3 sets x 8-12
    *   *Tip:* "Single-arm variation for max stretch."
2.  **Seated Cable Row**
    *   3 sets x 10-14 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Neutral or Wide grip."
3.  **Lat Prayer** (Replaced Wide-Grip Seated Row)
    *   3 sets x 12-15 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Internal Rotation at the stretched position for maximum lat stretch."
4.  **Wide Grip BB Row** (Replaced Face Pulls)
    *   3 sets x 10-15
    *   *Tip:* "Pinky fingers on the inner rings."
5.  **Side-Lying Rear Delt Flyes**
    *   3 sets x 15-20
    *   *Tip:* "Pinky leads, think 'pouring water' at top."
6.  **Preacher EZ-Bar Curls**
    *   3 sets x 10-15
    *   *Tip:* "Full ROM, slow down at stretched position."
7.  **Romanian Deadlift**
    *   3 sets x 8-12 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Heavy. Straps OK. 1–2 sec glute squeeze at top."
8.  **Lying Leg Curls**
    *   3 sets x 12-16
9.  **Hanging Leg Raises**
    *   3 sets x 12-20
    *   *Tip:* "Straight Legs if bent is too easy."

#### Day 3: Push B (Chest/Delts/Tri/Quads)
1.  **Incline Barbell Bench Press (45°)**
    *   3 sets x 8-12 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Slow down before touching chest."
2.  **Flat DB Press**
    *   3 sets x 10-14 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Flare elbows, arc back, full stretch."
3.  **Pec Deck**
    *   3 sets x 12-15
    *   *Tip:* "Full stretch at the bottom."
4.  **Standing Barbell Military Press**
    *   3 sets x 8-12 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Strict, no leg drive. Proud chest, squeeze delts."
5.  **Leaning Single Arm DB Lateral Raises**
    *   3 sets x 15-20
    *   *Tip:* "Lean against a wall at 15-30°, rep ends when DB is pointing straight down."
6.  **Close-Grip Bench Press**
    *   3 sets x 10-14 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Grip shoulder width."
7.  **Front Squats** (Swappable with **Stiletto Squats**)
    *   3 sets x 10-15 (W1-4) / 6-10 (W5-8)
    *   *Front Squat Tip:* "Full ROM, slow down the eccentric."
    *   *Stiletto Squat Tip:* "Ass to grass - touch calves with glutes."
8.  **Walking Lunges (DB)**
    *   3 sets x 12-16 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Long strides, do not push off back leg."
9.  **Hack Calf Raises**
    *   3 sets x 15-20
    *   *Tip:* "1 second pause at bottom."

#### Day 4: Pull B (Back/Rear Delt/Bi/Hams)
1.  **Lat Pulldown (Neutral)**
    *   3 sets x 10-14
    *   *Tip:* "Dead hang at top, slight lean back."
2.  **Single-Arm Hammer Strength Row**
    *   3 sets x 10-14 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Round shoulders at stretch."
3.  **Single-Arm DB Row**
    *   3 sets x 12-15 (W1-4) / 6-10 (W5-8)
4.  **Rear-Delt Rope Pulls to Face**
    *   3 sets x 20-30
5.  **Machine Rear Delt Fly**
    *   3 sets x 15-20
    *   *Tip:* "Single arm sideways for max stretch."
6.  **Incline DB Curls**
    *   3 sets x 12-15
    *   *Tip:* "As low incline as possible."
7.  **Stiff-Legged Deadlift**
    *   3 sets x 10-14 (W1-4) / 6-10 (W5-8)
    *   *Tip:* "Slow down, lightly touch ground."
8.  **Seated Leg Curls**
    *   3 sets x 12-16
    *   *Tip:* "Lean torso forward... Control the eccentric."
9.  **Ab Wheel Rollouts**
    *   3 sets x Max
    *   *Tip:* "Start from knees, progress distance."

---

## 3. Peachy Glute Plan (`peachy-glute-plan`)
*High-frequency 4-day glute specialization.*

### Plan Configuration
*   **Week 1-4:** "Feeling Froggy" | **Week 5-12:** "Feeling Peachy"
*   **Dynamic Weight:** **Paused Squat** = 80% of Monday Squat.
*   **Progression:** Add 2.5kg to Squats when 3x10 is hit.

### Weekly Schedule

#### Monday - Glute/Legs Heavy
1.  Sumo Deadlift (3x5-8)
2.  Front-Foot Elevated Bulgarian Split Squat (3x8-12)
3.  Squats (3x5-10)
4.  Seated Hamstring Curl (3x8-12)
5.  Hack Squat Calf Raises (3x15-20)

#### Wednesday - Glute/Upper Pump
1.  Kas Glute Bridge (3x8-12)
2.  45-Degree Hyperextension (2x15-20)
3.  Standing Military Press (2x8-12)
4.  Incline DB Bench Press (2x8-12)
5.  Inverted Rows (3x8-12)
6.  Side-Lying Rear Delt Fly (3x12-15)
    *   *Tip:* "Pinky leads, think 'pouring water' at top."

#### Friday - Posterior Chain
1.  DB Romanian Deadlift (3x5-8)
2.  Paused Squat (3x5-10)
3.  Glute Ham Raise (3xFailure)
4.  Hip Adduction (3x8-12)
5.  Leg Press Calf Raises (3x15-20)

#### Saturday - Unilateral & Pump
1.  Deficit Reverse Lunge (2x8-12)
2.  Single Leg Machine Hip Thrust (3x12-15)
3.  Deficit Push-ups (3xAMRAP)
4.  Assisted Pull-ups (2xAMRAP)
5.  Y-Raises (2x12-15)
6.  Lying Cable Lat Raises (3x12-15)
7.  Glute Pump Finisher (1x100)

---

## 4. From Skeleton to Threat (`skeleton-to-threat`)
*Aggressive linear progression 3-day full body.*

### Daily Workout (Repeated 3x/Week)
1.  **Deficit Push-ups:** 3 sets, AMRAP.
    *   Goal: Beat last week's best set.
2.  **Leg Extensions:** 3-4 sets, 12-20 reps.
    *   Goal: Hit 20 reps on all sets -> +7 kg.
3.  **Supported Stiff Legged DB Deadlift:** 3-4 sets, 10-15 reps.
    *   Goal: Hit 15 reps on all sets -> +1 kg each DB.
4.  **Standing Calf Raises:** 3-4 sets, 15-20 reps.
    *   Goal: Hit 20 reps on all sets -> Switch to Single Leg.
5.  **Inverted Rows:** 2-3 sets, 8-15 reps.
    *   Goal: Hit 15 reps -> Go deeper.
6.  **Overhand Mid-Grip Pulldown:** 2-3 sets, 10-15 reps.
    *   Goal: Hit 15 reps on all sets -> +7 kg.

---

## 5. Pain & Glory (`pain-and-glory`)
*16-Week Intermediate Deadlift Specialization - Pain today, glory tomorrow.*

### Plan Configuration
*   **Duration:** 16 Weeks
*   **Frequency:** 4 Days/Week (Pull/Push/Rest/Push/Pull/Rest/Rest)
*   **Widgets:** `deficit_snatch_tracker`, `strength_chart`
*   **Theme:** Sand background, blood-red accents

### Stats Required (Onboarding)
*   **Conventional Deadlift 1RM** (kg)
*   **Low Bar Squat 1RM** (kg)

### Progression Phases

#### Phase 1: Accumulation (Weeks 1-8)

**Pull Days:**
1.  **Deficit Snatch Grip Deadlift** (10 × 6)
    *   Starting weight: 45% of Conventional Deadlift 1RM
    *   Tip: "4 second eccentric, max 2 min rest. Do NOT cheat on eccentric."
    *   **Post-workout modal with 3 buttons:**
        *   "Ready for more" → +5 kg next Pull day
        *   "Good, maintain" → same weight
        *   "Wrecked" → -5 kg next Pull day
2.  **Close Neutral Grip Lat Pulldown** (4 × 6-10)
3.  **Slow Eccentric Cheat Nordic Curls** (2 × failure)
4.  **Single-Leg Machine Hip Thrust** (3 × 8-12)
5.  **Dead Hang + Planks superset** (3 × failure)

**Push Days:**
1.  **Paused Low Bar Squat** (4 × 4-6)
    *   Starting weight: ~70% of Squat 1RM
    *   **Weeks 1-4:** RPE 7, +2.5 kg weekly on success
    *   **Week 5 Reset:** +7.5% to 1RM (rounded to 2.5 kg), restart RPE 7
    *   **Weeks 5-8:** +2.5 kg weekly on success
2.  **Leg Extensions** (3 × 6-10)
3.  **Hack Squat Calf Raises** (3 × 15-20)
4.  **Incline DB Bench Press** (4 × 6-10)
5.  **Standing Military Press** (3 × 6-10)

#### Phase 2: E2MOM Transition (Weeks 9-12)

**Second Pull Day (Friday):** Replace Deficit Snatch Grip with:
*   **Conventional Deadlift E2MOM** (6 sets × 3-5 reps)
    *   Starting weight = Highest Deficit Snatch Grip weight × 1.35 (rounded to 2.5 kg)
    *   **Auto progression:** All 6 sets hit 5 reps → +2.5 kg next week

**Push Days (Weeks 9-16):**
*   **Squat weight FIXED** at ~85-90% of Week 8 final weight
*   Maintain RPE 6-7, no weight progression

#### Phase 3: Peaking (Weeks 13-16)

**Week 13 - AMRAP Test:**
*   Weight = Week 12 Deficit Snatch Grip × 2.22 (rounded to 2.5 kg)
*   Targets ~5-8 reps
*   **Calculate e1RM** using Epley: `weight × (1 + reps/30)`

**Week 14 - Heavy Triple:**
*   **Main:** 1 × 3 @ 90% e1RM (RPE 9)
*   **Back-down:** 3 × 3 @ 85% of triple weight

**Week 15 - Heavy Double:**
*   **Main:** 1 × 2 @ 93% e1RM (RPE 9.5)
*   **Back-down:** 3 × 2 @ 87.5% of double weight

**Week 16 - Max Single:**
*   **Main:** 1 × 1 @ 97% e1RM (RPE 9.5-10)
*   **Optional:** Second single attempt

**Second Pull Day (Weeks 15-16):**
*   **CAT Conventional Deadlift** (4 × 6 @ 70% of Week 13 AMRAP weight)
*   Tip: "Compensatory Acceleration Training – explode as fast as possible every rep."

### Accessory Progression
*   Hit top reps on ALL sets = +2.5-5 kg next session

---

## 6. Badges & Achievements
*   **Certified Threat:** Complete "From Skeleton to Threat"
*   **Certified Shoulder Boulder:** Complete "Pencilneck Eradication Protocol"
*   **Bench Psychopath:** Full Bench Domination + peaking + new PR
*   **Deload Denier:** Never triggered reactive deload in Bench Domination
*   **Rear-Delt Reaper:** Rear-delt rope pulls 4×30+
*   **3D Delts Unlocked:** Lying laterals 3×20 @ ≥20 kg
*   **Immortal:** All programs completed at least once

---

## Backup Strategy
All major workout plan changes are detailed in README.md changelog.
When making changes:
1.  Create backup in `/backups` folder (e.g. `PLAN_2025-12-26_commit-hash.md`).
2.  Update this `PLAN.md` file with plan details.
3.  Update `README.md` with changelog entry.
4.  **General Guideline:** Sleep 7+ hours/night for optimal recovery.

---

*Generated from source code – January 11, 2026*
