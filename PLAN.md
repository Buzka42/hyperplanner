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
*   **User Base Weight (`pausedBench`):**
    *   **≥ 12 Reps on AMRAP:** Base increases by **+2.5 kg**.
    *   **9-11 Reps on AMRAP:** No increase (Stall).
    *   **< 9 Reps:** No increase (Stall).
    *   **Logic:** Adds +2.5kg directly to base weight for every qualifying AMRAP week found in history.

*   **Bench Press Variations (Independent Double Progression):**
    *   **Wide-Grip Bench Press (6-8 reps):**
        *   Requires **2 consecutive MONDAY weeks** hitting top reps (8) on ALL sets to increase weight by +2.5 kg.
        *   Saturday follows Monday's weight.
    *   **Spoto Press (5 reps) & Low Pin Press (4 reps):**
        *   **Immediate Progression**: Hit target reps on ALL sets = **+2.5 kg** next session.
    *   **Smart Weighing**: Automatically detects if stored stat is 1RM (>85% of Bench) or Working Weight.

*   **Behind-the-Neck Press:**
    *   **Monday (Heavy)**: Hit max reps (5) on all sets = **+2.5 kg** for NEXT week.
    *   **Thursday (Volume)**: Auto-scaled to **85%** of Monday's weight.

*   **Reactive Deload:**
    *   **Trigger:** If Saturday's AMRAP is **≤ 8 reps** for **2 consecutive weeks**.
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
4.  **Y-Raises / High-Elbow Facepulls** (3 sets x 12-15 reps)
5.  **Around-the-Worlds / Power Hanging Leg Raises** (3 sets)
    *   *Tip (Leg Raises):* "Explosive movement, slow eccentric, full stretch at bottom. Straight legs if bent is too easy."

#### Thursday - Power / Speed
1.  **Paused Bench Press** (5 sets x 3-5 reps)
    *   Intensity: 77.5% (Explosive)
2.  **Low Pin Press** (2 sets x 4 reps)
3.  **Behind-the-Neck Press** (4 sets x 5-8 reps @ 85% of Mon)
4.  **Tricep Giant Set** (3-4 sets)

#### Friday - Legs (Optional)
1.  **Lying Hamstring Curls:** 3 sets, 10-12 reps.
2.  **Leg Extensions:** 3 sets, 15-20 reps.
    *   *Tip:* "Full ROM, 120° angle between legs and torso."
3.  **Bulgarian Split Squats:** 3 sets, 8-12 reps.
4.  **Sissy Squats:** 3 sets, Failure.
5.  **Dumbbell RDL:** 3 sets, 10-12 reps.
6.  **Seated Calf Raises:** 3 sets, 10-15 reps.

#### Saturday - AMRAP Test
1.  **Paused Bench Press (AMRAP)** (1 set)
    *   Progression: ≥12 Reps = +2.5kg Base.
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

## 5. Badges & Achievements
*   **Certified Threat:** Complete “From Skeleton to Threat”
*   **Certified Shoulder Boulder:** Complete “Pencilneck Eradication Protocol”
*   **Bench Psychopath:** Full Bench Domination + peaking + new PR
*   **Deload Denier:** Never triggered reactive deload in Bench Domination
*   **Rear-Delt Reaper:** Rear-delt rope pulls 4×30+
*   **3D Delts Unlocked:** Lying laterals 3×20 @ ≥20 kg
*   **Immortal:** All programs completed at least once

---

## Backup Strategy
All major workout plan changes are detailed here.
When making changes:
1.  Create backup in `/backups` folder (e.g. `PLAN_2025-12-26_commit-hash.md`).
2.  Update this `PLAN.md` file.
3.  **General Guideline:** Sleep 7+ hours/night for optimal recovery.
