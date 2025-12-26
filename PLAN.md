# Hyper Planner - Workout Plans Documentation

This file documents all changes and specifications for the workout programs themselves (exercise substitutions, progression schemes, rep ranges, etc.).

For technical implementation details, see `README.md`.

---

## Pencilneck Eradication Protocol

### Program Overview
- **Duration:** 8 weeks, supports multiple cycles
- **Split:** 5-day push/pull split
- **Days:**
  - Day 1: Push A (Chest/Delts/Tri/Quads)
  - Day 2: Pull A (Back/Rear Delt/Bi/Hams)
  - Day 3: Rest & Recovery
  - Day 4: Push B (Chest/Delts/Tri/Quads)
  - Day 5: Pull B (Back/Rear Delt/Bi/Hams)
  - Day 6-7: Rest

### Progression Logic
- Weeks 1-4: High rep ranges for hypertrophy
- Weeks 5-8: Heavy phase (compound exercises drop to 6-10 rep range)
- Cycle 1 Week 7-8: Intensity techniques on compounds (last set)
- Cycle 2+: Intensity techniques on all compounds, all weeks
- Week 8 Day 4: Final exam with burnout sets

### Cycle System
- Cycle 1: Base phase with progressive intensity
- Cycle 2+: Advanced phase with full intensity from week 1
- Automatic reload calculation for cycle transitions

---

## Change Log

### 2025-12-26 - Pencilneck Program Updates

**Exercise Changes:**

1. **Lying Lateral Raises** → **Leaning Single Arm DB Lateral Raises**
   - New technique: Lean against a wall at 15-30°, rep ends when DB is pointing straight down
   - Updated on both Push A (Day 1) and Push B (Day 4)
   - Final exam exercise in Week 8 Day 4 also updated

2. **Pec-Dec** → **Pec Deck**
   - Name standardized
   - Removed alternates (no swap button)
   - Note: "Full stretch at the bottom"

3. **Wide-Grip Seated Row** → **Lat Prayer**
   - New exercise for better lat development
   - Tip: "Internal Rotation at the stretched position for maximum lat stretch"
   - Added to COMPOUND_EXERCISES set for proper phase logic

4. **Face Pulls** → **Wide Grip BB Row**
   - Changed to barbell row for more compound movement
   - Tip: "Pinky fingers on the inner rings"
   - Added to COMPOUND_EXERCISES set

5. **Single-Arm DB Rear Delt Fly** → **Side-Lying Rear Delt Flyes**
   - Updated to match Peachy program standard
   - Tip: "Pinky leads, think 'pouring water' at top"

6. **Front Squats** - Added Alternative
   - Now has "Stiletto Squats" as an alternate option
   - Front Squats tip: "Full ROM, slow down the eccentric"
   - Stiletto Squats tip: "Ass to grass - touch calves with glutes"
   - Both added to COMPOUND_EXERCISES set

**Exercise Tips Added:**
- Flat Barbell Bench Press: "Slow down the bar before touching chest, do not bounce"
- Cable Flyes (mid height): "Big stretch, push chest out forward at the bottom"
- Seated DB Shoulder Press: "Full ROM, touch shoulders with DBs at the bottom"
- Overhead Tricep Extensions: Comprehensive attachment and form guidance
- Hack Squat: "Feet Narrow, full ROM - ass to grass"
- Leg Extensions: "Full ROM, 120° angle between legs and torso"
- Hammer Pulldown (Underhand): "Single-arm variation for max stretch"
- Preacher EZ-Bar Curls: "Full ROM, slow down at stretched position"
- Hanging Leg Raises: "Straight Legs if bent is too easy"
- Incline Barbell Bench Press: "Slow down before touching chest"
- Flat DB Press: "Flare elbows, arc back, full stretch"
- Close-Grip Bench Press: "Grip shoulder width"
- Lat Pulldown (Neutral): "Dead hang at top, slight lean back"
- Single-Arm Hammer Strength Row: "Round shoulders at stretch"
- Machine Rear Delt Fly: "Single arm sideways for max stretch"
- Incline DB Curls: "As low incline as possible"
- Stiff-Legged Deadlift: "Slow down, lightly touch ground"
- Ab Wheel Rollouts: "Start from knees, progress distance"

**Minor Updates:**
- Sleep recommendation: 8+ hours → 7+ hours
- Incline DB Press tip updated to match Flat DB Press
- Hack Calf Raises: "1 second pause at bottom"
- Various tip refinements for clarity

---

## Bench Domination

### Program Overview
- 12-week bench press specialization program
- Optional 3-week peaking block (weeks 13-15)
- Module system for customization

### Main Modules
1. Core Bench Progression (Required)
2. Tricep Giant Sets
3. Behind-the-Neck Press
4. Weighted Pull-ups
5. Leg Days
6. Accessories

---

## From Skeleton to Threat

### Program Overview
- 12-week full-body beginner program
- Custom day selection support (3 days/week)
- Progressive overload system

---

## Peachy Glute Plan

### Program Overview
- 12-week glute specialization
- 4 days per week
- Dynamic paused squat calculation (80% of Monday squats)

---

## Backup Strategy

All major workout plan changes are documented here. Create backup in `/backups` folder with:
- Date stamp
- Associated git commit hash
- Description of changes

Example: `PLAN_2025-12-26_commit-abc1234.md`
