# Workout Planner - Program Documentation

This document provides a comprehensive and strictly accurate breakdown of all workout plans available in the application, based on the source code configuration.

---

## 1. Bench Domination (`bench-domination`)
*The flagship program designed to detonate your bench press 1RM.*

### **Plan Configuration**
*   **Duration:** 15 Weeks
*   **Frequency:** Up to 6 Days/Week (User Selectable & Smart Assigned)
*   **Widgets:** `1rm` (Base Management), `program_status` (Progress), `strength_chart` (History)

### **Modules (User Customization)**
These toggles strictly **remove** exercises if disabled. There are **no replacement** exercises provided in the code.
*   **Tricep Giant Set:** Enables/Disables "Tricep Giant Set" (Mon/Thu).
*   **Behind-the-Neck Press:** Enables/Disables "Behind-the-Neck Press" (Mon/Thu).
*   **Weighted Pull-ups:** Enables/Disables "Weighted Pull-ups" (Wed/Sat).
*   **Accessories:** Enables/Disables "Dragon Flags" (Mon), "Y-Raises" (Wed), and "Around-the-Worlds" (Wed).
*   **Leg Days:** Enables/Disables the entire Tuesday and Friday workouts.

### **Progression Logic**
*   **User Base Weight (`pausedBench`):**
    *   **≥ 12 Reps on AMRAP:** Base increases by **+2.5 kg**.
    *   **9-11 Reps on AMRAP:** No increase (Stall).
    *   **< 9 Reps:** No increase (Stall).
    *   **Note:** No microplates available – progression uses full 2.5 kg jumps only.
    *   **Logic:** Adds +2.5kg directly to base weight for every qualifying AMRAP week found in history.

*   **Bench Press Variations (Independent Double Progression):**
    *   **Wide-Grip Bench Press (6-8 reps):**
        *   Requires **2 consecutive MONDAY weeks** hitting top reps (8) on ALL sets to increase weight by +2.5 kg.
        *   Saturday follows Monday's weight (does not drive progression).
    *   **Spoto Press (5 reps) & Low Pin Press (4 reps):**
        *   **Immediate Progression**: Hit target reps on ALL sets = **+2.5 kg** next session.
    *   **Smart Weighing**: Automatically detects if stored stat is 1RM (>85% of Bench) or Working Weight to prevent drops.

*   **Behind-the-Neck Press:**
    *   **Monday (Heavy)**: Independent progression. Hit max reps (5) on all sets = **+2.5 kg** for NEXT week.
    *   **Thursday (Volume)**: Auto-scaled to **85%** of Monday's weight.
    *   **Sync**: Thursday progression is locked to Monday. Increases only apply to the *following* week.

*   **Reactive Deload:**
    *   **Trigger:** If Saturday's AMRAP is **≤ 8 reps** for **2 consecutive weeks**.
    *   **Effect:** The *next* week becomes a "Reactive Deload".
        *   **Weight:** Reduced by 15% (multiplied by 0.85).
        *   **Volume:** Sets reduced by 50% (floored, min 1).
        *   **Tagline:** `[DELOAD: -15% Weight, Half Volume]` added to notes.

*   **Elite Warm-up Protocol:**
    *   **Applied to:** Paused Bench Press & BTN Press.
    *   **Goal:** Minimal fatigue, maximal potentiation.
    *   **Structure (Paused every rep):**
        1.  **Empty Bar (20kg)**: 8-10 reps.
        2.  **50%**: 5 reps.
        3.  **70%**: 3 reps.
        4.  **85%**: 2 reps.
        5.  **95%**: 1 rep (**Heavy Days Only**: Mon/Thu).

### **Phase 1: Accumulation & Intensity (Weeks 1-12)**
*Percentages and Volumes adjust dynamically at Week 5 and Week 9.*

**Weekly Schedule:**

#### **Monday - Heavy Strength**
1.  **Paused Bench Press**
    *   **Sets:** 4 | **Reps:** 3
    *   **Recall:** Elite Warm-up (incl. 95% single).
    *   **Intensity:** 82.5% (W1-4), 85% (W5-8), 87.5% (W9+)
2.  **Wide-Grip Bench Press**
    *   **Sets:** 3 | **Reps:** 6-8 | **Intensity:** 67.5% (Relative to Working Weight)
    *   **Note:** +2.5kg after 2 consecutive Mondays @ 8 reps.
3.  **Behind-the-Neck Press** (Module dependant)
    *   **Sets:** 4 | **Reps:** 3-5 (Heavy)
    *   **Recall:** Elite Warm-up (incl. 95% single).
    *   **Note:** +2.5kg next week if max reps hit.
4.  **Tricep Giant Set** (Module dependant)
    *   **Sets:** 2 (W1-8), 3 (W9+) | **Reps:** "Giant"
    *   *Tip:* "~10 second rest between exercises. 2 minute rest between sets."
5.  **Dragon Flags** (Module dependant)
    *   **Sets:** 3 | **Reps:** Failure

#### **Tuesday - Legs** (Module dependant)
1.  **Walking Lunges:** 3 sets, 10-15 reps.
2.  **Heels-Off Narrow Leg Press:** 3 sets, 10-15 reps.
3.  **Reverse Nordic Curls:** 2 sets, Failure.
4.  **Single-Leg Machine Hip Thrust:** 3 sets, 10-15 reps.
5.  **Nordic Curls:** 3 sets, Failure.
    *   **Swap:** "Glute-Ham Raise" | **Sets:** 3 | **Reps:** Failure.
    *   *Tip (Both):* "If the original exercise is too hard, swap to the alternative for better progression and safety."
6.  **Hack Squat Calf Raises:** 3 sets, 15-20 reps.
7.  **Hip Adduction:** 2 sets, 8-12 reps.

#### **Wednesday - Volume Hypertrophy**
1.  **Paused Bench Press**
    *   **Sets:** 4 | **Reps:** 8-10
    *   **Recall:** Elite Warm-up (No 95% single).
    *   **Intensity:** 72.5% (W1-4), 75% (W5-8), 77.5% (W9+)
2.  **Spoto Press**
    *   **Sets:** 3 | **Reps:** 5 | **Intensity:** 72.5%
    *   **Note:** +2.5kg immediately if all sets @ 5 reps.
3.  **Weighted Pull-ups (EMOM)** (Module dependant)
    *   **Sets:** Dynamic (Max 15) | **Reps:** "Max" (W1-3), "3-5" (W4-6), "3" (W7-9), "2-3" (W10-12)
    *   **EMOM Features:**
        *   **Live Rep Counter:** Tracks total reps in real-time.
        *   **15-Set Cap:** Stops generating new sets after 15 sets.
        *   **Completion Message:** "EMOM Complete – 15 sets reached! Total reps: X"
4.  **Accessory Slot** (Module: Accessories):
    *   **Default:** "Y-Raises" | **Sets:** 3 | **Reps:** 12-15.
    *   **Swap:** "High-Elbow Facepulls" | **Sets:** 3 | **Reps:** 15-20.
5.  **Around-the-Worlds** (Module dependant): 3 sets, 12-15 reps.
    *   **Swap:** "Power Hanging Leg Raises" | **Sets:** 3 | **Reps:** 10-15.
    *   *Tip (Power Hanging Leg Raises):* "Explosive movement – knees to chest fast, slow eccentric (3-5 sec), full stretch at bottom. Build power and core strength."

#### **Thursday - Power / Speed**
1.  **Paused Bench Press**
    *   **Sets:** 5 | **Reps:** 3-5 | **Intensity:** 77.5% ("Explosive")
    *   **Recall:** Elite Warm-up (incl. 95% single).
2.  **Low Pin Press**
    *   **Sets:** 2 | **Reps:** 4 | **Intensity:** 77.5%
    *   **Note:** +2.5kg immediately if all sets @ 4 reps.
3.  **Behind-the-Neck Press** (Module dependant)
    *   **Sets:** 4 | **Reps:** 5-8 (Volume)
    *   **Recall:** Elite Warm-up (incl. 95% single).
    *   **Note:** Weight = 85% of Monday.
4.  **Tricep Giant Set:** 3 sets (W1-8), 4 sets (W9+).

#### **Friday - Legs** (Module dependant)
1.  **Lying Hamstring Curls:** 3 sets, 10-12 reps.
2.  **Leg Extensions:** 3 sets, 15-20 reps.
3.  **Bulgarian Split Squats:** 3 sets, 8-12 reps.
4.  **Sissy Squats:** 3 sets, Failure.
5.  **Dumbbell RDL:** 3 sets, 10-12 reps.
6.  **Seated Calf Raises:** 3 sets, 10-15 reps.

#### **Saturday - AMRAP Test**
1.  **Paused Bench Press (AMRAP)**
    *   **Sets:** 1 | **Reps:** AMRAP
    *   **Recall:** Elite Warm-up (No 95% single).
    *   **Intensity:** 82.5% (matches Monday)
    *   **Progression:** ≥12 Reps = +2.5kg Base (Next Week).
2.  **Paused Bench Press (Back-off)**
    *   **Sets:** 3 | **Reps:** 5 | **Intensity:** 82.5%
3.  **Wide-Grip Bench Press**
    *   **Sets:** 3 | **Reps:** 6-8 | **Intensity:** Matches Monday weight.
4.  **Weighted Pull-ups:** Same as Wed.
5.  **Accessory Slot** (Module: Accessories):
    *   **Default:** "Y-Raises" | **Sets:** 3 | **Reps:** 12-15.
    *   **Swap:** "High-Elbow Facepulls" | **Sets:** 3 | **Reps:** 15-20.

#### **Sunday**
*   **Rest Day** (Empty).

### **Phase 2: Peaking Block (Weeks 13-15)**
*Structure changes significantly.*

*   **Week 13 (Doubles):**
    *   Monday Bench: 4 sets x 2 reps @ **90-92.5%** (Doubles).
    *   Saturday AMRAP: 1 set @ **75%**.
*   **Week 14 (Singles):**
    *   Monday Bench: 5 sets x 1 rep @ **95-97.5%** (Singles).
    *   Saturday AMRAP: 1 set @ **81%**.
*   **Week 15 (Test):**
    *   **Monday:** Active Recovery / Primer (3 sets x 3 reps @ 50%).
    *   **Saturday:** **1RM TEST** (1 set x 1 rep @ 105%).
    *   *Note:* "Warm up well. Go for PR. YOU ARE A THREAT."

---

## 2. Peachy Glute Plan (`peachy-glute-plan`)
*A high-frequency glute specialization program.*

### **Plan Configuration**
*   **Duration:** 12 Weeks
*   **Frequency:** 4 Days/Week
*   **Widgets:** `glute_tracker`, `strength_chart`
*   **Themes:**
    *   Weeks 1-4: "Feeling Froggy" theme.
    *   Weeks 5-12: "Feeling Peachy" theme.

### **Calculated Logic**
*   **Squats:** "Add 2.5 kg the week you hit 3x10."
*   **Paused Squat:** Weight calculation = `(MondaySquat * 0.8)`.

### **Intensity Techniques**
*   **Weeks 9-12:** Drop Sets on **Front-Foot Elevated Bulgarian Split Squat** and **Deficit Reverse Lunge**.
    *   "LAST SET: Drop to Bodyweight - Go to Failure" displayed prominently.

### **Weekly Schedule**

#### **Monday - Glute/Legs Heavy**
1.  **Sumo Deadlift:** 3 sets, 5-8 reps. ("Crack a walnut")
2.  **Front-Foot Elevated Bulgarian Split Squat:** 3 sets, 8-12 reps.
3.  **Squats:** 3 sets, 5-10 reps.
4.  **Seated Hamstring Curl:** 3 sets, 8-12 reps.
5.  **Hack Squat Calf Raises:** 3 sets, 15-20 reps.

#### **Wednesday - Glute/Upper Pump** (Includes All Upper Body)
1.  **Kas Glute Bridge:** 3 sets, 8-12 reps.
2.  **45-Degree Hyperextension:** 2 sets, 15-20 reps.
3.  **Standing Military Press:** 2 sets, 8-12 reps.
4.  **Incline DB Bench Press (45°):** 2 sets, 8-12 reps.
5.  **Inverted Rows:** 3 sets, 8-12 reps.
6.  **Side-Lying Rear Delt Fly:** 3 sets, 12-15 reps.

#### **Friday - Posterior Chain**
1.  **DB Romanian Deadlift:** 3 sets, 5-8 reps.
2.  **Paused Squat:** 3 sets, 5-10 reps.
3.  **Glute Ham Raise:** 3 sets, Failure.
4.  **Hip Adduction:** 3 sets, 8-12 reps.
5.  **Leg Press Calf Raises:** 3 sets, 15-20 reps.

#### **Saturday - Unilateral & Pump**
1.  **Deficit Reverse Lunge:** 2 sets, 8-12 reps.
2.  **Single Leg Machine Hip Thrust:** 3 sets, 12-15 reps.
3.  **Deficit Push-ups:** 3 sets, Max (AMRAP).
4.  **Assisted Pull-ups:** 2 sets, Max (AMRAP).
5.  **Y-Raises:** 2 sets, 12-15 reps.
6.  **Lying Cable Lat Raises:** 3 sets, 12-15 reps.
7.  **Glute Pump Finisher:** 1 set, 100 reps.
    *   *Note:* Listed for **every Saturday**. "Chase the insane pump. 100 reps banded thrust/abduction in <5 min."

---

## 3. From Skeleton to Threat (`skeleton-to-threat`)
*An aggressive linear progression program for beginners.*

### **Plan Configuration**
*   **Duration:** 12 Weeks (Updated)
*   **Frequency:** 3 Days/Week (User Selectable)
*   **Widgets:** `skeleton_countdown`, `skeleton_pushup_max`, `skeleton_quotes`

### **Forced Progression Rules**
Specific messages are triggered in the "Advice" box when previous week's performance meets goals:
*   **Deficit Push-ups:** Shows "Try to beat: X reps" (Based on last week's best set).
*   **Leg Extensions:** "Target reps hit across all sets last week! Add +7 kg" (Trigger: Hit 20 reps on all sets).
*   **Supported Stiff Legged DB Deadlift:** "+1 kg each dumbbell" (or +2.5kg if >10kg). (Trigger: Hit 15 reps on all sets).
*   **Standing Calf Raises:** "Now switch to single-leg" (Trigger: Hit 20 reps on all sets).
    *   **Single Leg Calf Raises:** "Add +5 kg dumbbell" (Trigger: Hit 20 reps).
*   **Inverted Rows:** "Go deeper than last time" (Trigger: Hit 15 reps on all sets).
*   **Overhand Mid-Grip Pulldown:** "Target reps hit across all sets last week! Add +7 kg" (Trigger: Hit 15 reps on all sets).

### **Daily Workout (Repeated)**
1.  **Deficit Push-ups:** 3 sets, AMRAP. (Moved to First Exercise)
    *   *Advice:* "You are a THREAT! (Goal Met)" if 3x12 hit.
2.  **Leg Extensions:** 3-4 sets, 12-20 reps.
3.  **Supported Stiff Legged DB Deadlift:** 3-4 sets, 10-15 reps.
4.  **Standing Calf Raises:** 3-4 sets, 15-20 reps.
5.  **Inverted Rows:** 2-3 sets, 8-15 reps.
6.  **Overhand Mid-Grip Pulldown:** 2-3 sets, 10-15 reps.

---

## 4. Pencilneck Eradication Protocol (`pencilneck-eradication`)
*A hypertrophy-focused upper/lower split.*

### **Plan Configuration**
*   **Duration:** 8 Weeks (with optional "Cycle 2" re-run)
*   **Frequency:** 4 Days/Week
*   **Widgets:** `pencilneck_commandments`, `program_status`, `trap_barometer` (New)
*   **Progression Rule:** Standard Double Progression (Increase weight when top of range is hit on all sets).

### **Weekly Transformation Titles**
*   **Week 1:** “Neck still looks like a coat hanger”
*   **Week 2:** “Collarbones starting to hide”
*   **Week 3:** “Delts now cast a shadow”
*   **Week 4:** “T-shirts beginning to surrender”
*   **Week 5:** “First recorded door-frame collision”
*   **Week 6:** “Neck officially gone – mission successful”
*   **Week 7:** “People asking if you ‘even lift bro?’ in fear”
*   **Week 8:** “You are now a certified shoulder boulder”

### **Phase Structure**
*   **Phase 1 (Weeks 1-4):** Standard Hypertrophy Ranges.
*   **Phase 2 (Weeks 5-8):** **Heavy Phase**.
    *   All Compound Exercises switch to **6-10 Reps**.
    *   **Suggested Weight (W5):** Based on Week 3-4 top performance × 1.15, rounded down.
    *   **Intensity Techniques (Weeks 7-8 ONLY):** "LAST SET: Drop Set or Rest-Pause to Failure" displayed prominently for compounds.
*   **Cycle 2 (Re-run):**
    *   Week 1 Suggested Weight based on Week 8 top weight × 0.87, rounded down.
    *   Minimum +10% over original Cycle 1 Week 1 weight enforced.
    *   **Intensity Techniques (ALL Weeks):** Mandatory on last set of every compound.

### **Weekly Schedule**

#### **Day 1 - Push A (Chest/Delts/Tri/Quads)**
1.  **Flat Barbell Bench Press**
    *   **Sets:** 3 | **Reps:** 8-12 (W1-4), 6-10 (W5-8)
2.  **Incline DB Press (45°)**
    *   **Sets:** 3 | **Reps:** 10-14 (W1-4), 6-10 (W5-8)
    *   *Tip:* "Upper chest focus. Slight elbow tuck, full stretch."
3.  **Cable Flyes (mid height)**
    *   **Sets:** 3 | **Reps:** 12-15
4.  **Seated DB Shoulder Press**
    *   **Sets:** 3 | **Reps:** 8-12 (W1-4), 6-10 (W5-8)
5.  **Lying Lateral Raises**
    *   **Sets:** 3 | **Reps:** 15-20
    *   *Tip:* "Pull ‘away’ from body, not up."
6.  **Overhead Tricep Extensions**
    *   **Sets:** 3 | **Reps:** 12-15
7.  **Hack Squat** (Swappable)
    *   **Sets:** 3 | **Reps:** 10-15 (W1-4), 6-10 (W5-8)
8.  **Leg Extensions**
    *   **Sets:** 3 | **Reps:** 15-20
9.  **Leg Press Calf Raises**
    *   **Sets:** 3 | **Reps:** 12-18
    *   *Tip:* "Full stretch, explode up, stop 0–1 rep shy."

#### **Day 2 - Pull A (Back/Rear Delt/Bi/Hams)**
1.  **Hammer Pulldown (Underhand)**
    *   **Sets:** 3 | **Reps:** 8-12
2.  **Seated Cable Row**
    *   **Sets:** 3 | **Reps:** 10-14 (W1-4), 6-10 (W5-8)
    *   *Note:* "Neutral or Wide grip"
3.  **Wide-Grip Seated Row**
    *   **Sets:** 3 | **Reps:** 12-15 (W1-4), 6-10 (W5-8)
    *   *Note:* "Mag grip preferably"
4.  **Face Pulls**
    *   **Sets:** 3 | **Reps:** 15-25
5.  **Single-Arm DB Rear Delt Fly**
    *   **Sets:** 3 | **Reps:** 15-20
    *   *Note:* "Chest-supported"
6.  **Preacher EZ-Bar Curls**
    *   **Sets:** 3 | **Reps:** 10-15
7.  **Romanian Deadlift**
    *   **Sets:** 3 | **Reps:** 8-12 (W1-4), 6-10 (W5-8)
    *   *Tip:* "Heavy. Straps OK. 1–2 sec glute squeeze at top."
8.  **Lying Leg Curls**
    *   **Sets:** 3 | **Reps:** 12-16
9.  **Hanging Leg Raises**
    *   **Sets:** 3 | **Reps:** 12-20

#### **Day 3 - Push B (Chest/Delts/Tri/Quads)**
1.  **Incline Barbell Bench Press (45°)**
    *   **Sets:** 3 | **Reps:** 8-12 (W1-4), 6-10 (W5-8)
2.  **Flat DB Press**
    *   **Sets:** 3 | **Reps:** 10-14 (W1-4), 6-10 (W5-8)
3.  **Pec-Dec** (Swappable)
    *   **Sets:** 3 | **Reps:** 12-15
4.  **Standing Barbell Military Press**
    *   **Sets:** 3 | **Reps:** 8-12 (W1-4), 6-10 (W5-8)
    *   *Tip:* "Strict, no leg drive. Proud chest, squeeze delts."
5.  **Lying Lateral Raises**
    *   **Sets:** 3 | **Reps:** 15-20
6.  **Close-Grip Bench Press**
    *   **Sets:** 3 | **Reps:** 10-14 (W1-4), 6-10 (W5-8)
7.  **Front Squats** (Swappable)
    *   **Sets:** 3 | **Reps:** 10-15 (W1-4), 6-10 (W5-8)
8.  **Walking Lunges (DB)**
    *   **Sets:** 3 | **Reps:** 12-16 (W1-4), 6-10 (W5-8)
    *   *Note:* "Steps per leg"
    *   *Tip:* "Long strides, do not push off back leg"
9.  **Hack Calf Raises**
    *   **Sets:** 3 | **Reps:** 15-20
    *   *Note:* "5-sec stretch at bottom"

#### **Day 4 - Pull B (Back/Rear Delt/Bi/Hams)**
1.  **Lat Pulldown (Neutral)**
    *   **Sets:** 3 | **Reps:** 10-14
2.  **Single-Arm Hammer Strength Row**
    *   **Sets:** 3 | **Reps:** 10-14 (W1-4), 6-10 (W5-8)
3.  **Single-Arm DB Row**
    *   **Sets:** 3 | **Reps:** 12-15 (W1-4), 6-10 (W5-8)
4.  **Rear-Delt Rope Pulls to Face**
    *   **Sets:** 3 | **Reps:** 20-30
5.  **Machine Rear Delt Fly**
    *   **Sets:** 3 | **Reps:** 15-20
6.  **Incline DB Curls**
    *   **Sets:** 3 | **Reps:** 12-15
7.  **Stiff-Legged Deadlift**
    *   **Sets:** 3 | **Reps:** 10-14 (W1-4), 6-10 (W5-8)
8.  **Seated Leg Curls**
    *   **Sets:** 3 | **Reps:** 12-16
    *   *Tip:* "Lean torso forward... Control the eccentric."
9.  **Ab Wheel Rollouts**
    *   **Sets:** 3 | **Reps:** Max (Failure)

*   **Week 8 Final Exam:**
    1.  **Lying Lateral Raises (FINAL EXAM):** 1 set, Failure + Drop set.
    2.  **Rear Delt Burnout:** 1 set, 100 reps.

---

## 5. Badges & Achievements
*Complete list of unlockable milestones.*

1.  **Certified Threat:** Complete “From Skeleton to Threat”
2.  **Certified Shoulder Boulder:** Complete “Pencilneck Eradication Protocol”
3.  **Perfect Attendance War Criminal:** Zero missed sessions in any program
4.  **Bench Psychopath:** Full Bench Domination + peaking + new PR
5.  **20 kg Bench Jump:** ≥20 kg gain (Bench Domination or Pencilneck)
6.  **30 kg Bench Jump:** ≥30 kg gain (Bench Domination or Pencilneck)
7.  **Deload Denier:** Never triggered reactive deload in Bench Domination
8.  **Rear-Delt Reaper:** Rear-delt rope pulls 4×30+
9.  **3D Delts Unlocked:** Lying laterals 3×20 @ ≥20 kg
10. **Cannonball Delts:** Both #8 and #9 in same run
11. **First Blood:** First workout ever
12. **100 Sessions Club:** 100 total sessions
13. **Immortal:** All programs completed at least once
14. **The Final Boss:** 10+ badges earned
15. **Peachy Perfection:** All 48 Peachy sessions
16. **Thick Thighs Save Lives:** +30 kg on Squat
17. **Glute Gainz Queen:** ≥3 cm glute growth
18. **Kas Glute Bridge 100 kg:** 100 kg+ for reps

---
*Generated from source code – December 20, 2025*
