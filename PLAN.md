# Workout Planner - Master Program Documentation

This document serves as the single source of truth for all workout programs, progression logic, and exercise specifications available in the application. It consolidates previous documentation and includes the latest updates.

**Last Updated:** January 16, 2026 - Deload System Philosophy Update  
**Note:** For technical implementation details, see `README.md`.

---

## Elite Warm-up Scheme (Main Lifts)
*Applied to Squat, Bench Press, and Deadlift in: Trinary, Pain & Glory, Ritual of Strength*

### General Warm-up (Before Barbell)
**For Bench Press:**
- Warm up rotator cuff, do some dynamic arching motion
- Light lat activation pump work (single arm banded lat prayer recommended)
- Single leg glute bridges with concentric hold for glute activation

**For Squat:**
- Hip swings, hip airplanes, cossack squats
- Banded good mornings, hamstring stretches
- Single leg glute bridges with concentric hold
- Ass-to-grass bodyweight squats

**For Deadlift:**
- Hip swings, hip airplanes
- Barbell/banded good mornings + stiff legged good mornings
- Bodyweight lunges/bulgarian split squats
- Light lat activation pump (single arm banded lat prayer recommended)
- Single leg glute bridges with concentric hold

### Barbell Warm-up Sets
*Static, grayed-out, non-logged sets displayed before working sets*

**Progression:**
1. **Empty Bar × 8-10** (fast touch-and-go, groove speed/pattern)
2. **50% × 5**
3. **70% × 3**
4. **85% × 2**
5. **95% × 1** (only on heavy/ME days; skip on volume/DE/light days to save energy)

**Rules:**
- All warm-up sets paused (1-sec pause at bottom/chest for bench/squat, brief pause off floor for deadlift)
- Total warm-up reps: ~19-21 max on heavy days
- Percentages calculated from the weight that will be used on the first working set
- Rounded down to nearest 2.5 kg

---

## 1. Bench Domination (`bench-domination`)
*The flagship program designed to detonate your bench press 1RM.*

### Plan Configuration
*   **Duration:** Nominal 15 weeks (13 weeks core cycle + optional 3 week peaking phase), extended with added deload weeks for optimal recovery and gains
*   **Frequency:** Up to 6 Days/Week (User Select able & Smart Assigned)
*   **Widgets:** `1rm` (Base Management), `program_status` (Progress), `strength_chart` (History)

### Modules (User Customization)
These toggles strictly **remove** exercises if disabled.
*   **Tricep Giant Set:** Enables/Disables "Tricep Giant Set" (Mon/Thu).
*   **Behind-the-Neck Press:** Enables/Disables "Behind-the-Neck Press" (Mon/Thu).
*   **Weighted Pull-ups:** Enables/Disables "Weighted Pull-ups" (Wed/Sat).
*   **Accessories:** Enables/Disables "Dragon Flags" (Mon), "Y-Raises" (Wed), and "Around-the-Worlds" (Wed).
*   **Leg Days:** Enables/Disables the entire Tuesday and Friday workouts.

### Paused Bench Press Weight Calculation (January 2026 Overhaul)

> **IMPORTANT: Old onboarding jump system has been completely REMOVED.**
> All progress is now driven exclusively by AMRAP performance and phased thresholds.
> Rounding uses nearest 2.5 kg with safety cap for plate accuracy.

#### Base Weight (`pausedBench`) Calculation
*   **Starting Point:** User's onboarding 1RM value
*   **Progression Driver:** Saturday AMRAP tests with phased rep thresholds

#### AMRAP Progression (Saturday Test)
| Week Range | Rep Threshold | Effect |
|------------|---------------|--------|
| Weeks 1–6  | ≥12 reps      | +2.5 kg to base next week |
| Weeks 7–9  | ≥10 reps      | +2.5 kg to base next week |
| Weeks 10–12| ≥8 reps       | +2.5 kg to base next week |
| Below threshold | — | No increase (stall) |

#### e1RM Re-Calculation (Every 4 Weeks)
*   **Schedule:** End of Week 4, Week 8, Week 12
*   **Formula:** Epley Formula: `e1RM = AMRAP weight × (1 + reps/30)`
*   **New Base:** e1RM rounded **DOWN** to nearest 2.5 kg
*   **Display Message:** `"e1RM updated from AMRAP: X kg. Base reset for next block."`
*   **Example:** AMRAP 90 kg × 12 reps → e1RM = 90 × 1.4 = 126 kg → Base = 125 kg

#### Working Weight Calculation
| Day | Intensity | Percentage of Current Base |
|-----|-----------|---------------------------|
| Monday (Heavy) | 82.5% → 87.5% | Progressive across weeks |
| Wednesday (Volume) | 72.5% → 77.5% | Progressive across weeks |
| Thursday (Power) | 77.5% | Fixed explosive work |
| Saturday (AMRAP) | 67.5% | Test set |

**Rounding Rules (Day-Specific):**
1.  Calculate raw weight: `base × percentage`
2.  Apply rounding based on day type:
    *   **Monday (Heavy) & Thursday (Power):** Round to NEAREST 2.5 kg (conservative)
        *   Upward cap: Never round up more than +2.5 kg above raw value
        *   Example: raw 125.81 kg → nearest 125 kg (down 0.81 kg)
    *   **Wednesday (Volume) & Saturday (AMRAP):** Round UP to nearest 2.5 kg (ceiling)
        *   Ensures visible progression after successful AMRAPs
        *   Example: raw 125.81 kg → ceil 127.5 kg

#### Peaking Block (Weeks 13–15)
*   Uses final Week 12 re-calculated e1RM for all percentage calculations
*   Week 13: 90–92.5% Doubles + 75% AMRAP
*   Week 14: 95–97.5% Singles + 81% AMRAP
*   Week 15: 1RM Test Day (105% attempt)

#### Deload Logic (January 2026 Philosophy Update)

**Core Philosophy: Deloads ADD Extra Weeks, Never Replace Existing Weeks**

This preserves full progression flow and ensures no training stimulus is skipped. Program duration extends organically with recovery needs.

**1. Forced Deload (Always After Week 8)**
*   **Trigger:** Automatically added after completing week 8
*   **Insertion:** Deload week 8.5 (extends program by 1 week)
*   **Details:** -15% all weights, half volume, light technique focus
*   **Message:** "Deload added – recover hard to rebound stronger. Program extended for full progression."
*   **Base Update:** No change to pre-deload base (maintains continuity)
*   **Purpose:** Mandatory recovery before final intensity block

**2. Reactive Deload (Weeks 5-8 Performance Trigger)**
*   **Trigger:** 2 consecutive Saturday AMRAPs ≤7 reps
*   **Weeks 5-8 Logic:** If triggered, immediately adds the forced deload (triggers forced deload quicker, no secondary deload)
    *   Example: If poor performance in weeks 6-7 → forced deload added after week 7 (not week 8)
    *   Only one deload added (reactive triggers forced earlier, prevents double-deload)
*   **After Week 8:** If triggered after forced deload already happened, add extra reactive deload week normally
*   **Message:** "Performance drop detected – deload triggered for recovery. Program extended to preserve progression."

**3. Big Drop Trigger (Week 5 e1RM Recalculation)**
*   **Trigger:** If e1RM recalc at week 5 drops >15% from previous base
*   **Action:** Immediately add a second forced deload week
*   **Message:** "Significant strength drop detected – extra recovery week added to rebuild foundation."
*   **Purpose:** Catch overreaching/underlift early and course-correct

**Deload Week Characteristics:**
*   All exercises: 50% volume (half sets), 85% intensity (-15% all weights)
*   Light technique focus, RPE 6-7 max
*   Maintains movement patterns without fatigue accumulation
*   Full week rest between last hard session and return to progression

**Program Duration Flexibility:**
*   Nominal: 15 weeks (13 core + 3 peaking)
*   Real Duration: 15+ weeks depending on deloads triggered
*   Example scenarios:
    *   No triggers: 15 weeks
    *   Forced only (week 8): 16 weeks
    *   Reactive in week 6 (triggers forced early) + big drop at week 5: 18 weeks
*   Tips/Dashboard: "13 weeks core cycle, optional 3 week peaking phase, extended with extra deload weeks for optimal recovery and gains"

### Bench Press Variations (Independent Progression)

#### Fixed Rep Target Exercises
*   **Spoto Press (5 reps):** Hit exact 5 reps on ALL sets → +2.5 kg next session
*   **Low Pin Press (4 reps):** Hit exact 4 reps on ALL sets → +2.5 kg next session
*   Message: *"Target reps hit – weight auto-increased +2.5 kg next time"*

#### Rep Range Exercises
*   **Wide-Grip Bench Press (6–8 reps):**
    *   Hit TOP of range (8 reps) on ALL sets for 2 consecutive weeks → +2.5 kg
    *   Message: *"Hit top reps on all sets for 2 straight weeks → +2.5 kg"*

*   **Smart Weighing:** System auto-detects if stored stat is 1RM (>85% of Bench) or Working Weight

### Behind-the-Neck Press
*   **Monday (Heavy):** Hit max reps (5) on all sets → +2.5 kg for NEXT week
*   **Thursday (Volume):** Auto-scaled to 85% of Monday's weight

### Weighted Pull-ups (EMOM Progression)
*   All weights in kilograms only (no lbs)
*   **Weeks 1-3:** Max reps EMOM until form breaks (add 2.5 kg plate)
*   **Weeks 4-6:** Fixed-weight EMOM (15-set cap, live total rep counter)
*   **Weeks 7-9:** Daily max triple + 6 back-offs @ 87.5% (7 sets total)
*   **Weeks 10-12:** Max single (Wed W10) → 5 sets @ 92.5% (W11-12)

### Elite Warm-up Protocol
Paused every rep:
1.  Empty Bar (20kg): 8-10 reps
2.  50%: 5 reps
3.  70%: 3 reps
4.  85%: 2 reps
5.  95%: 1 rep (Heavy Days Only: Mon/Thu)

---

### Phase 1: Accumulation & Intensity (Weeks 1-12)

#### Monday - Heavy Strength
1.  **Paused Bench Press** (4 sets × 3 reps) @ 82.5% → 87.5%
2.  **Wide-Grip Bench Press** (3 sets × 6-8 reps) @ 67.5%
3.  **Behind-the-Neck Press** (4 sets × 3-5 reps)
4.  **Tricep Giant Set** (2-3 sets) — *~10 sec rest between exercises, 2 min rest between sets*
5.  **Dragon Flags** (3 sets to Failure)

#### Tuesday - Legs (Optional)
1.  **Walking Lunges:** 3 sets × 10-15 reps
2.  **Heels-Off Narrow Leg Press:** 3 sets × 10-15 reps
3.  **Reverse Nordic Curls:** 2 sets × Failure
4.  **Single-Leg Machine Hip Thrust:** 3 sets × 10-15 reps
5.  **Nordic Curls / Glute-Ham Raise:** 3 sets × Failure
6.  **Hack Squat Calf Raises:** 3 sets × 15-20 reps — *1 second pause at bottom*
7.  **Hip Adduction:** 2 sets × 8-12 reps

#### Wednesday - Volume Hypertrophy
1.  **Paused Bench Press** (4 sets × 8-10 reps) @ 72.5% → 77.5%
2.  **Spoto Press** (3 sets × 5 reps) — *+2.5kg immediately if all sets @ 5 reps*
3.  **Weighted Pull-ups (EMOM)** (Max 15 sets) — *See pull-up progression*
4.  **Y-Raises / High-Elbow Facepulls** (3 sets × 12-15 reps)
5.  **Around-the-Worlds / Power Hanging Leg Raises** (3 sets × 10-16 reps)

#### Thursday - Power / Speed
1.  **Paused Bench Press** (5 sets × 3-5 reps OR 4 sets if Pin Press swap active) @ 77.5% — *Explosive*
2.  **Low Pin Press** (2 sets × 4 reps OR 3 sets if swap active) — *Optional swap button*
3.  **Behind-the-Neck Press** (4 sets × 5-8 reps) @ 85% of Monday
4.  **Tricep Exercise** (3-4 sets) — SWAPPABLE:
    *   **Default:** Tricep Giant Set (Dips 5 / Extensions 12 / Skullcrushers 25)
    *   **Alternative:** Heavy Rolling Tricep Extensions (4 sets × 4-6 reps)
        *   Progression: Hit 6 reps on all 4 sets → +2.5 kg next Thursday
        *   Message: *"Heavy tricep option selected – focusing on lockout strength"*

#### Friday - Legs (Optional)
Same as Tuesday

#### Saturday - AMRAP Test
1.  **Paused Bench Press (AMRAP)** (1 set) @ 67.5% — *Phased threshold dictates progression*
2.  **Paused Bench Press (Back-off)** (3 sets × 5 reps) @ 67.5%
3.  **Wide-Grip Bench Press** (3 sets × 6-8 reps)
4.  **Weighted Pull-ups** — *Same as Wednesday*
5.  **Y-Raises** (3 sets)

---

### Phase 2: Peaking Block (Weeks 13-15)
*Uses final Week 12 e1RM recalculation as base for all percentages*

**Saturday Strategy Change (No AMRAPs in Peaking):**
- **Week 13 Saturday:** Light Technique Day – Paused Bench Press 4×3 @ 60-70% e1RM (explosive, perfect form, RPE 6-7)
- **Week 14 Saturday:** Very Light Technique or Rest – Paused Bench Press 2-3×2-3 @ 60% e1RM (optional, focus speed/form) or full rest
- **Week 15 Saturday:** Pure 1RM Test Day – warm-ups + max attempt only (no back-offs or extra volume)

**Note:** No AMRAPs in peaking weeks 13–14. Replaced with light technique/rest to maximize recovery for heavy singles and final test. Message on peaking Saturdays: "Peaking phase – light technique for confidence, no AMRAP fatigue. Save energy for heavy days and test."

**Monday Heavy Work:**
*   **Week 13 (Doubles):** Mon 4×2 @ 90-92.5%
*   **Week 14 (Singles):** Mon 5×1 @ 95-97.5%
*   **Week 15 (Active Recovery):** Light work only


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
1.  **Flat Barbell Bench Press** — 3 sets × 8-12 (W1-4) / 6-10 (W5-8) — *Slow down before touching chest*
2.  **Incline DB Press (45°)** — 3 sets × 10-14 (W1-4) / 6-10 (W5-8) — *Upper chest focus*
3.  **Cable Flyes (mid height)** — 3 sets × 12-15 — *Big stretch at bottom*
4.  **Seated DB Shoulder Press** — 3 sets × 8-12 (W1-4) / 6-10 (W5-8) — *Full ROM*
5.  **Leaning Single Arm DB Lateral Raises** — 3 sets × 15-20 — *Lean 15-30°*
6.  **Overhead Tricep Extensions** — 3 sets × 12-15
7.  **Hack Squat** — 3 sets × 10-15 (W1-4) / 6-10 (W5-8) — *Full ROM, ass to grass*
8.  **Leg Extensions** — 3 sets × 15-20 — *120° angle*
9.  **Leg Press Calf Raises** — 3 sets × 12-18 — *Full stretch, explode up*

#### Day 2: Pull A (Back/Rear Delt/Bi/Hams)
1.  **Hammer Pulldown (Underhand)** — 3 sets × 8-12 — *Single-arm for max stretch*
2.  **Seated Cable Row** — 3 sets × 10-14 (W1-4) / 6-10 (W5-8) — *Neutral or Wide grip*
3.  **Lat Prayer** — 3 sets × 12-15 (W1-4) / 6-10 (W5-8) — *Internal rotation for stretch*
4.  **Wide Grip BB Row** — 3 sets × 10-15 — *Pinky on inner rings*
5.  **Side-Lying Rear Delt Flyes** — 3 sets × 15-20 — *Pinky leads, 'pouring water'*
6.  **Preacher EZ-Bar Curls** — 3 sets × 10-15 — *Slow at stretch*
7.  **Romanian Deadlift** — 3 sets × 8-12 (W1-4) / 6-10 (W5-8) — *Heavy, straps OK*
8.  **Lying Leg Curls** — 3 sets × 12-16
9.  **Hanging Leg Raises** — 3 sets × 12-20 — *Straight legs if bent is too easy*

#### Day 3: Push B (Chest/Delts/Tri/Quads)
1.  **Incline Barbell Bench Press (45°)** — 3 sets × 8-12 (W1-4) / 6-10 (W5-8)
2.  **Flat DB Press** — 3 sets × 10-14 (W1-4) / 6-10 (W5-8) — *Flare elbows, arc back*
3.  **Pec Deck** — 3 sets × 12-15 — *Full stretch*
4.  **Standing Barbell Military Press** — 3 sets × 8-12 (W1-4) / 6-10 (W5-8) — *Strict, no leg drive*
5.  **Leaning Single Arm DB Lateral Raises** — 3 sets × 15-20
6.  **Close-Grip Bench Press** — 3 sets × 10-14 (W1-4) / 6-10 (W5-8) — *Shoulder width grip*
7.  **Front Squats** or **Stiletto Squats** — 3 sets × 10-15 (W1-4) / 6-10 (W5-8)
8.  **Walking Lunges (DB)** — 3 sets × 12-16 (W1-4) / 6-10 (W5-8) — *Long strides*
9.  **Hack Calf Raises** — 3 sets × 15-20 — *1 sec pause at bottom*

#### Day 4: Pull B (Back/Rear Delt/Bi/Hams)
1.  **Lat Pulldown (Neutral)** — 3 sets × 10-14 — *Dead hang at top, slight lean*
2.  **Single-Arm Hammer Strength Row** — 3 sets × 10-14 (W1-4) / 6-10 (W5-8) — *Round shoulders at stretch*
3.  **Single-Arm DB Row** — 3 sets × 12-15 (W1-4) / 6-10 (W5-8)
4.  **Rear-Delt Rope Pulls to Face** — 3 sets × 20-30
5.  **Machine Rear Delt Fly** — 3 sets × 15-20 — *Single arm sideways for stretch*
6.  **Incline DB Curls** — 3 sets × 12-15 — *As low incline as possible*
7.  **Stiff-Legged Deadlift** — 3 sets × 10-14 (W1-4) / 6-10 (W5-8) — *Slow, lightly touch ground*
8.  **Seated Leg Curls** — 3 sets × 12-16 — *Lean forward, control eccentric*
9.  **Ab Wheel Rollouts** — 3 sets × Max — *Start from knees*

---

## 3. Peachy Glute Plan (`peachy-glute-plan`)
*High-frequency 4-day glute specialization.*

### Plan Configuration
*   **Week 1-4:** "Feeling Froggy" | **Week 5-12:** "Feeling Peachy"
*   **Dynamic Weight:** **Paused Squat** = 80% of Monday Squat
*   **Progression:** Add 2.5kg to Squats when 3×10 is hit

### Weekly Schedule

#### Monday - Glute/Legs Heavy
1.  Sumo Deadlift (3×5-8)
2.  Front-Foot Elevated Bulgarian Split Squat (3×8-12)
3.  Squats (3×5-10)
4.  Seated Hamstring Curl (3×8-12)
5.  Hack Squat Calf Raises (3×15-20)

#### Wednesday - Glute/Upper Pump
1.  Kas Glute Bridge (3×8-12)
2.  45-Degree Hyperextension (2×15-20)
3.  Standing Military Press (2×8-12)
4.  Incline DB Bench Press (2×8-12)
5.  Inverted Rows (3×8-12)
6.  Side-Lying Rear Delt Fly (3×12-15) — *Pinky leads, 'pouring water'*

#### Friday - Posterior Chain
1.  DB Romanian Deadlift (3×5-8)
2.  Paused Squat (3×5-10)
3.  Glute Ham Raise (3×Failure)
4.  Hip Adduction (3×8-12)
5.  Leg Press Calf Raises (3×15-20)

#### Saturday - Unilateral & Pump
1.  Deficit Reverse Lunge (2×8-12)
2.  Single Leg Machine Hip Thrust (3×12-15)
3.  Deficit Push-ups (3×AMRAP)
4.  Assisted Pull-ups (2×AMRAP)
5.  Y-Raises (2×12-15)
6.  Lying Cable Lat Raises (3×12-15)
7.  Glute Pump Finisher (1×100)

---

## 4. From Skeleton to Threat (`skeleton-to-threat`)
*Aggressive linear progression 3-day full body.*

### Daily Workout (Repeated 3x/Week)
1.  **Deficit Push-ups:** 3 sets × AMRAP — *Beat last week's best set*
2.  **Leg Extensions:** 3-4 sets × 12-20 reps — *Hit 20 reps on all sets → +7 kg*
3.  **Supported Stiff Legged DB Deadlift:** 3-4 sets × 10-15 reps — *Hit 15 reps → +1 kg each DB*
4.  **Standing Calf Raises:** 3-4 sets × 15-20 reps — *Hit 20 reps → Single Leg*
5.  **Inverted Rows:** 2-3 sets × 8-15 reps — *Hit 15 reps → Go deeper*
6.  **Overhand Mid-Grip Pulldown:** 2-3 sets × 10-15 reps — *Hit 15 reps → +7 kg*

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
    *   **Post-workout modal:** "Ready for more" (+5 kg) / "Good, maintain" (same) / "Wrecked" (-5 kg)
2.  **Close Neutral Grip Lat Pulldown** (4 × 6-10)
3.  **Slow Eccentric Cheat Nordic Curls** (2 × failure)
4.  **Single-Leg Machine Hip Thrust** (3 × 8-12)
5.  **Dead Hang + Planks superset** (3 × failure)

**Push Days:**
1.  **Paused Low Bar Squat** (4 × 4-6) @ ~70% of Squat 1RM
    *   **Weeks 1-4:** RPE 7, +2.5 kg weekly on success
    *   **Week 5 Reset:** +7.5% to 1RM, restart RPE 7
    *   **Weeks 5-8:** +2.5 kg weekly on success
2.  **Leg Extensions** (3 × 6-10)
3.  **Hack Squat Calf Raises** (3 × 15-20)
4.  **Incline DB Bench Press** (4 × 6-10)
5.  **Standing Military Press** (3 × 6-10)

#### Phase 2: E2MOM Transition (Weeks 9-12)

**Second Pull Day (Friday):** Replace Deficit Snatch Grip with:
*   **Conventional Deadlift E2MOM** (6 sets × 3-5 reps)
    *   Starting weight = Highest Deficit Snatch Grip weight × 1.35
    *   **Auto progression:** All 6 sets hit 5 reps → +2.5 kg next week

**Push Days (Weeks 9-16):**
*   Squat weight FIXED at ~85-90% of Week 8 final weight
*   Maintain RPE 6-7, no weight progression

#### Phase 3: Peaking (Weeks 13-16)

**Week 13 - AMRAP Test:**
*   Weight = Week 12 Deficit Snatch Grip × 2.22 × 0.85
*   Calculate e1RM using Epley: `weight × (1 + reps/30)`

**Week 14 - Heavy Triple:** 1 × 3 @ 90% e1RM (RPE 9) + 3 × 3 back-down @ 85%

**Week 15 - Heavy Double:** 1 × 2 @ 93% e1RM (RPE 9.5) + 3 × 2 back-down @ 87.5%

**Week 16 - Max Single:** 1 × 1 @ 97% e1RM (RPE 9.5-10), optional second attempt

**Second Pull Day (Weeks 15-16):** CAT Conventional Deadlift (4 × 6 @ 70%)

### Accessory Progression
Hit top reps on ALL sets = +2.5-5 kg next session

---

## 6. Trinary (`trinary`)
*Conjugate Periodization Powerlifting - Adapt to your weak points.*

### Plan Configuration
*   **Duration:** 27 Workouts (9 Blocks × 3 Workouts each)
*   **Frequency:** Flexible 3-4 Days/Week (workout-based, not calendar-based)
*   **Theme:** Heavy metal (dark zinc/slate color palette)
*   **Widgets:** `program_status`, Schedule Tip, Workout Progress, Next Workout button

### Stats Required (Onboarding)
*   **Paused Bench Press 1RM** (kg)
*   **Conventional Deadlift 1RM** (kg)
*   **Low Bar Squat 1RM** (kg)

### Workout Structure

#### ME/DE/RE Rotation Pattern
Each workout contains three exercises in this rotation:
| Workout # | ME (Max Effort) | DE (Dynamic Effort) | RE (Repeated Effort) |
|-----------|-----------------|---------------------|---------------------|
| 1, 4, 7... | Deadlift | Squat | Bench |
| 2, 5, 8... | Squat | Bench | Deadlift |
| 3, 6, 9... | Bench | Deadlift | Squat |

#### Set/Rep Targets by Effort Type
| Effort Type | Sets | Reps | Notes |
|-------------|------|------|-------|
| ME (Max Effort) | 3 | 1-3 | RPE 9, heavy singles/doubles/triples |
| DE (Dynamic Effort) | 8 | 2-3 | Explosive speed, consider bands/chains |
| RE (Repeated Effort) | 4 | 8-12 | Hypertrophy focus |

### Phased Progression

#### Block Percentages (of Current 1RM)
| Phase | Blocks | ME % | DE % | RE % |
|-------|--------|------|------|------|
| Build Base | 1-3 (Workouts 1-9) | 90% | 60% | 70% |
| Intensify | 4-6 (Workouts 10-18) | 92% | 65% | 75% |
| Peak | 7-9 (Workouts 19-27) | 95% | 70% | 80% |

### Weight Calculation Rules

#### 1RM Tracking
*   Separate 1RM tracked for Bench, Deadlift, and Squat
*   Updated from ME PRs using Epley formula: `weight × (1 + reps/30)`
*   Rounded DOWN to nearest 2.5 kg

#### Working Weight Calculation
```
Working Weight = Current 1RM × Block % × Variation %
→ Rounded DOWN to nearest 2.5 kg
```

#### Variation-Specific Percentages
**Bench Variations:**
| Weak Point | Variations | % of Bench 1RM |
|------------|------------|----------------|
| Off-chest | Long Pause Bench, Wide-Grip, Spoto (1cm) | 92.5% |
| Mid-range | Spoto (4-8cm), Mid Pin Press, Board Press | 94.5% |
| Lockout | Close Grip, Floor Press, High Pin Press | 100% |

**Deadlift Variations:**
| Weak Point | Variations | % of Deadlift 1RM |
|------------|------------|-------------------|
| Lift-off | Deficit Deadlift, Snatch Grip Deficit | 75% |
| Over-knees | RDLs, Paused DL (mid-shin), Block Pull | 90% |
| Lockout | Paused DL (knee), Rack Pulls, Snatch Grip RDLs | 110% |

**Squat Variations:**
| Weak Point | Variations | % of Squat 1RM |
|------------|------------|----------------|
| Bottom | Paused Squat, Low Box Squat | 92.5% |
| Mid-range | Stiletto Squat, Safety Bar | 92.5% |
| Lockout | High Box Squat, Banded Squat | 105% |

### Progression Rules

#### ME Progression
*   **Trigger:** Hit 3 reps on ALL sets.
*   **RPE Selection:**
    *   RPE ≤ 7: +10 kg
    *   RPE 7-8: +5 kg
    *   RPE 8-9: +2.5 kg

#### DE Progression
*   +2.5 kg OR add bands/chains as needed
*   Focus on bar speed, not weight

#### RE Progression (Double Progression)
*   Hit 12 reps on ALL 4 sets → +2.5 kg next RE session
*   Message: *"Double progression: 12 reps on all sets → +2.5 kg"*

### Weak Point Modal & Transition
*   **Trigger:** After workouts 3, 6, 9, 12, 15, 18, 21, 24 (every 3rd workout)
*   **Selection:** User identifies sticking points per lift.
*   **Confirmation:** App proposes variations; user can confirm or swap them (filtering out excluded lifts).
*   **Rotation:** If same weak point selected multiple blocks, variations rotate (unless manually swapped).

### Accessory Days
*   **Trigger:** If >4 workouts logged in rolling 7-day period
*   **Message:** *"Excess workouts this week – accessory day triggered to hit weak points"*

#### Upper-Focused (if bench/deadlift lockout weak)
1. Tricep Extensions (4×8-12)
2. Rows - neutral grip (4×8-12)
3. Shoulder Press (4×8-12)
4. Rear Delt Flys (4×8-12)

#### Lower-Focused (other weak points)
1. Leg Extensions (4×8-12)
2. Ham Curls (4×8-12)
3. Calf Raises (4×8-12)
4. Hip Thrusts (4×8-12)

*Accessory progression: Double progression (+2.5 kg on 12 reps)*

### Blocks 1-3 (Workouts 1-9)
Uses standard competition lifts:
*   Paused Bench Press
*   Conventional Deadlift
*   Low Bar Squat (paused)

### Blocks 4-9 (Workouts 10-27)
Uses variations selected from Weak Point Modal

### Re-run Modal (After Workout 27)
*   **Options:**
    1. **Run Again:** 1-week deload (50% volume, 70% intensity) → Reset cycle with updated 1RMs
    2. **End Program:** Return to program selection
*   **1RM Update:** Automatically updated from best ME PRs of the cycle

### Accessory Day System
*   **Trigger:** Automatically triggers after 4 workouts in a 7-day rolling window.
*   **Flow:**
    1.  User sees "Accessory Day" prompt on Dashboard.
    2.  User can **START** (triggers choice modal: Upper/Lower) or **SKIP** (bypasses accessory check for current workout).
    3.  Accessory days do **not** increment the main 27-workout program counter (`completedWorkouts`).
    4.  Resetting: `skipNextAccessory` and `preferredAccessoryType` are reset upon completion of ANY workout.

### Workout History & Review
*   **Access:** Available via Sidebar or Dashboard header button.
*   **Review:** Detailed view of past workouts (all exercises, sets, weights, and reps) with a premium dark theme.
*   **Edit:** Supports a "Full Edit" flow - clicking edit redirects the user to the standard `WorkoutView`, allowing them to modify any part of the historical session using the live training interface.

---

## 7. Badges & Achievements
*   **Certified Threat:** Complete "From Skeleton to Threat"
*   **Certified Shoulder Boulder:** Complete "Pencilneck Eradication Protocol"
*   **Perfect Attendance War Criminal:** Zero missed sessions ever
*   **Bench Psychopath:** Bench Domination + peaking + new PR
*   **20 kg Bench Jump:** ≥20 kg gain in one run
*   **30 kg Bench Jump:** ≥30 kg gain in one run
*   **Deload Denier:** Never triggered reactive deload
*   **Rear-Delt Reaper:** Rear-delt rope pulls 4×30+ (Pencilneck)
*   **3D Delts Unlocked:** Lying laterals 3×20 @ ≥20 kg
*   **Cannonball Delts:** Both Reaper and 3D Delts badges
*   **First Blood:** First workout ever logged
*   **100 Sessions Club:** 100 total sessions
*   **Immortal:** All programs completed at least once
*   **The Final Boss:** 10+ badges earned
*   **Peachy Perfection:** Complete Peachy Glute Plan
*   **Thick Thighs Save Lives:** +30 kg on Squat
*   **Glute Gainz Queen:** ≥3 cm glute growth
*   **Kas Glute Bridge 100 kg:** 100 kg+ for reps
*   **Void Gazer:** Complete weeks 1–8 of "Pain & Glory". "You stared into the deficit abyss – and it blinked first."
*   **EMOM Executioner:** Complete all 6 E2MOM sets with 5 reps each (Weeks 9–12). "6×5 every 2 minutes. You didn't quit. The bar did."
*   **Glory Achieved:** Finish 16 weeks + hit new Deadlift PR. "Pain paid off. Glory is yours. Now go break it again."
*   **Deficit Demon:** Add +30 kg to Deficit Snatch Grip (Weeks 1–8). "Most people run from deficits. You made them your bitch."
*   **Single Supreme:** Hit Week 16 heavy single at ≥97% e1RM. "One rep. One moment. One legend."
*   **50 tonne club:** Accumulate 50,000kg total deadlifted weight. "That's literally a Boeing 737."

**Note:** Badges auto-unlock on completion. Retroactive for past runs.

---

## 8. Ritual of Strength (`ritual-of-strength`)
*The ritual of iron – sacrifice for ascension. Cult-themed powerlifting program.*

### Plan Configuration
*   **Duration:** 16+ Weeks (4-week ramp-in optional + 12-week main phase + reactive deload weeks if needed)
*   **Frequency:** 3 Days/Week (Mon/Wed/Fri recommended, minimum 1 day rest between sessions)
*   **Widgets:** `strength_altar` (3 pillars tracker), `program_status`
*   **Theme:** Dark cult aesthetic – black background, dark red accents, gothic fonts, blood drip animations on PRs

### Onboarding
#### First Program Question
*   **Question:** "Is this your first powerlifting program?"
    *   **Yes** → Force 4-week ramp-in (Weeks 1-4)
    *   **No** → Jump directly to main phase (Week 5)

#### 1RM Entry (kg only)
*   Paused Bench Press 1RM
*   Conventional Deadlift 1RM
*   Low Bar Squat 1RM

#### Training Days Selection
*   User selects 3 training days
*   Recommended: Mon/Wed/Fri (at least 1 day rest between sessions)

### Ramp-In Phase (Weeks 1-4, Only if First Program = Yes)
All lifts competition style: Paused Bench Press, Conventional Deadlift, Low Bar Squat

#### Progression Schedule
*   **Week 1:** 3 × 9 @ ~70% 1RM (RPE 7-8)
*   **Week 2:** 3 × 6 @ ~80% 1RM (RPE 8)
*   **Week 3:** 3 × 3 @ ~90% 1RM (RPE 9)
*   **Week 4: Ascension Test**
    *   AMRAP on all 3 lifts @ ~85% estimated 1RM (target 5-8 reps)
    *   Back-down: 3 × 5 @ 80% AMRAP weight
    *   Updates all 1RMs using Epley formula: `e1RM = weight × (1 + reps/30)`

#### Daily Structure (Ramp-In)
*   **Day 1 (Bench Focus):** Bench Press + 2 accessories (Rows, Face Pulls)
*   **Day 2 (Squat Focus):** Squat + 2 accessories (Ham Curls, Leg Extensions)
*   **Day 3 (Deadlift Focus):** Deadlift + 2 accessories (Farmer Holds [grip], Ab Wheel)

### Main Ritual Phase (Weeks 5-16)
3 days/week fixed rotation – ME (Max Effort) singles on focus lift

#### Workout Structure
**Day 1: Bench ME**
1.  Bench Press ME Single (work up to 1 clean rep @ 90-100% 1RM)
2.  Low Bar Squat (Light): 3 × 5 @ 70% 1RM
3.  Conventional Deadlift (Light): 3 × 5 @ 70% 1RM
4.  + 2-3 Ritual Accessories (user-selected from bench list)

**Day 2: Squat ME**
1.  Low Bar Squat ME Single (work up to 1 clean rep @ 90-100% 1RM)
2.  Paused Bench Press (Light): 3 × 5 @ 70% 1RM
3.  Conventional Deadlift (Light): 3 × 5 @ 70% 1RM
4.  + 2-3 Ritual Accessories (user-selected from squat list)

**Day 3: Deadlift ME**
1.  Conventional Deadlift ME Single (work up to 1 clean rep @ 90-100% 1RM)
2.  Paused Bench Press (Light): 3 × 5 @ 70% 1RM
3.  Low Bar Squat (Light): 3 × 5 @ 70% 1RM
4.  **Mandatory Grip Work:** Farmer Holds or Fat Grip Deadlift Holds 3 × 20-30 sec
5.  + 2-3 Ritual Accessories (user-selected from deadlift list)

### Progression Rules

#### ME Single Progression
*   **Goal:** Work up to 1 clean rep @ 90-100% 1RM
*   **Progression Trigger:** Clean execution (no hitch, full ROM) + RPE ≤9
    *   **Safety Checkbox (Red):** "RPE 9 or lower with perfect form?" 
    *   Appears immediately when user enters "1" in any rep field
    *   Must be ticked for ANY progression
*   **Progression Amount:**
    *   +2.5 kg default (if checkbox ticked)
    *   +5 kg if "Exceptionally easy" secondary checkbox is also ticked
    *   No progression if checkbox unticked (same weight next session)
*   **Implementation:** Checkbox state saves to `ritualStatus.benchMEProgression/squatMEProgression/deadliftMEProgression` and accumulates over sessions

#### Light Lifts (3 × 5 @ 70% 1RM)
*   **Goal:** Speed and explosive form focus (target bar velocity >0.8 m/s)
*   **Velocity Check (Blue Checkbox):** "Good bar speed? (Target: >0.8 m/s)"
    *   Appears after entering reps in all 3 sets
    *   If checked: Weight stays same next session
    *   If unchecked: -5% weight reduction next session (bar was too slow)
*   **Purpose:** Auto-regulates light work to maintain explosive quality
*   **Fixed percentage:** 70% of 1RM (no manual progression, only velocity-triggered adjustments)

#### Grip Work (Deadlift Day Only)
*   Mandatory: Farmer Holds or Fat Grip Deadlift Holds 3 × 20-30 sec @ bodyweight or light
*   **Progression:** +time or +weight when current load feels easy

### Accessory System

#### Base Accessories (2 per day, auto-suggested from weak point modal or default)

**Bench Day Accessories:**
*   Rows, Rear Delt Flyes, Tricep Extensions, Face Pulls

**Squat Day Accessories:**
*   Ham Curls, Leg Extensions, Hip Thrusts, Calves

**Deadlift Day Accessories:**
*   Shrugs, Band Pull-Aparts, Ab Wheel, Planks (+ mandatory grip work)

#### Add Accessory Button
*   **In-Workout Button:** "Add Ritual Accessory" (up to 3 total per day)
*   **Click** → Modal with day-specific list + "Custom" field (user types name/reps/sets)

#### Accessory Progression
*   **Double Progression:** Hit top reps on all sets → +2.5 kg next session
*   Message: "Hit top reps all sets → +2.5 kg next time"

### Weak Point Auto-Suggest
*   **Trigger:** After ramp-in (Week 4) OR every 4 weeks during main phase
*   **Modal:** "What feels weakest?"
    *   **Bench:** Off chest / Mid-range / Lockout
    *   **Deadlift:** Lift-off / Over knees / Lockout
    *   **Squat:** Bottom / Mid-range / Lockout
*   **Auto-Suggest:** App proposes 1-2 accessories targeting weak point for next sessions

### Ascension Tests (Every 4 Weeks)
*   **Schedule:** Weeks 4 (ramp-in), 8, 12, 16
*   **Format:** Full Ascension Test on all 3 lifts
    *   AMRAP @ ~85% current 1RM (target 5-8 reps)
    *   Back-down: 3 × 5 @ 80% test weight
*   **1RM Update:** All 1RMs recalculated using Epley formula: `e1RM = weight × (1 + reps/30)`
*   **Visual:** Dark ritual frame with flames. On PR: blood rain confetti + quote

### Deload Logic

#### Auto-Deload (Week 16 Only)
*   **Trigger:** After completing Week 16 (program completion)
*   **Effect:** 1-week Purge Week before re-run option
    *   50% volume (2 sets instead of 3)
    *   70% intensity
    *   All lifts remain but lighter
*   **Purpose:** Mandatory deload before starting a new cycle

#### Reactive Recovery Check (Weeks 8 & 12 Only)
*   **Trigger:** After completing the final workout of Weeks 8 and 12
*   **Modal:** "How was your recovery over the last 4 weeks? Rate 1-10 (10 = perfect)"
*   **Response Actions:**
    *   **If ≤6 (Poor Recovery):** INSERT a 1-week Purge Week NEXT, extending the program by 1 week
        *   User continues to scheduled Week 9 or Week 13 AFTER the deload
        *   Example: Week 8 → Recovery ≤6 → Purge Week → Week 9 → ... → Week 17 (instead of 16)
    *   **If >6 (Good Recovery):** Continue to next scheduled week (no deload inserted)
*   **Note:** No recovery check at Week 16 (auto-deload handles it)

### Re-Run Modal (After Final Workout - Week 16)
*   **Trigger:** After completing Week 16 final workout
*   **Message:** "The ritual is complete. Continue the path of ascension?"
    *   **Yes** → Purge Week (deload) + new cycle with updated 1RMs
    *   **No** → "Mortal weakness returns." (End program, return to selection)

### Cult Theme Elements

#### Strength Altar Widget (Dashboard)
*   Visual tracker with 3 pillars (Bench/Squat/Deadlift)
*   Pillars fill with "blood" (dark red liquid) as 1RM increases
*   Display: Current 1RM, Next Target, "Sacrifices Completed" (workouts done)
*   Flame effects on PR updates

#### Ascension Test Rename
*   AMRAP weeks renamed to "Ascension Test"
*   Dark ritual frame with flames
*   **On PR:** Blood rain confetti + quote: "You have ascended. The iron gods are pleased." (English + Polish)

#### Cult Badges (Trophy Case)
All badges auto-unlock, retroactive, with confetti + savage quote (English + Polish):

1.  **Initiate of Iron** (`initiate.png`) – Complete Week 1 (all 3 workouts)
    *   Quote: "The first sacrifice is complete. The iron gods acknowledge you." / "Pierwsza ofiara została złożona. Żelazni bogowie cię dostrzegają."
2.  **Disciple of Pain** (`disciple.png`) – Complete ramp-in (all 3 workouts of Week 4)
    *   Quote: "Four weeks of devotion. You've earned the right to suffer more." / "Cztery tygodnie oddania. Zasłużyłeś na prawo do dalszego cierpienia."
3.  **Acolyte of Strength** (`acolyte.png`) – First cycle complete (Week 16)
    *   Quote: "Sixteen weeks of ritual. The path of ascension continues." / "Szesnaście tygodni rytuału. Ścieżka ascenzji trwa."
4.  **High Priest of Power** (`highpriest.png`) – Multiple cycles + big PRs
    *   Quote: "Multiple cycles. Multiple PRs. You are one with the iron." / "Wiele cykli. Wiele rekordów życiowych. Jesteś jednością z żelazem."
5.  **Eternal Worshipper** (`worshipper.png`) – All-time PRs smashed (Ritual PRs in ALL 3 lifts beat every other program)
    *   Quote: "Mortal limits shattered. You have become legend." / "Śmiertelne ograniczenia zniszczone. Stałeś się legendą."

#### Ritual Modal at End (Week 16)
*   "The ritual is complete. Continue the path of ascension?"
    *   **Yes** → Purge Week (deload) + new cycle
    *   **No** → "Mortal weakness returns." (return to program selection)

### Translations
*   Program name: "Ritual of Strength" → Polish: "Rytuał Siły"
*   Tagline: "The ritual of iron – sacrifice for ascension" → Polish: "Rytuał żelaza – poświęcenie dla wzniesienia"
*   All UI elements, modal questions, tips translated (exercise names NOT translated)
*   Badge names NOT translated (descriptions translated)

### Implementation Status
**✅ Fully Implemented:**
- 16-week program structure (4 ramp-in + 12 main)
- Auto-updating 1RMs (Week 4 Ascension Test + ME singles)
- ME checkbox system (+2.5kg/+5kg progression)
- Light work velocity checkbox (-5% if slow)
- 5 cult badges with bilingual quotes
- Strength Altar widget
- Full bilingual support (EN/PL)
- Week 16 auto-deload
- Re-run modal

**⏳ Pending Implementation:**
- Recovery check modals (weeks 8, 12)
- Week insertion logic for reactive deloads
- Purge week workout generation

---

*Generated from source code – January 16, 2026*
