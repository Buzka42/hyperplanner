# Hyper Planner - Program Documentation

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
   - Added tip: "Full stretch at the bottom"

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

**New Exercise Tips Added:**
- Flat Barbell Bench Press: "Slow down the bar before touching chest, do not bounce"
- Cable Flyes (mid height): "Big stretch, push chest out forward at the bottom"
- Seated DB Shoulder Press: "Full ROM, touch shoulders with DBs at the bottom"
- Overhead Tricep Extensions: Comprehensive attachment and form guidance
- Hack Squat: "Feet Narrow, full ROM - ass to grass (try to touch calves with glutes)"
- Leg Extensions: "Full ROM, do not bounce out of the hole. Angle between legs and torso should be 120° or more"
- Hammer Pulldown (Underhand): "Go for single-arm variation for maximum stretch, add a squeeze at the bottom"
- Preacher EZ-Bar Curls: "Full ROM, slow down at the stretched position"
- Hanging Leg Raises: "Straight Legs if bent is too easy"
- Lying Leg Curls: "Full ROM, slow down at the stretched position"
- Incline Barbell Bench Press (45°): "Slow down the bar before touching chest, do not bounce"
- Flat DB Press: "Flare elbows, arc back, go for full stretch and think of 'reaching' with your chest"
- Close-Grip Bench Press: "Grip 1.5 hand-width closer than regular bench press, around shoulder width"
- Lat Pulldown (Neutral): "'Dead Hang' position at the top, head between shoulders, SLIGHT lean back when you pull"
- Single-Arm Hammer Strength Row: "Round shoulders at the stretched position. Extra padding for stretch"
- Single-Arm DB Row: "Limit lower back movement"
- Machine Rear Delt Fly: "Do single arm sitting sideways for maximum stretch"
- Incline DB Curls: "As low of an incline as you can go without hitting the ground with DBs"
- Stiff-Legged Deadlift: "Slow down and lightly touch the ground"
- Ab Wheel Rollouts: "Start from the knees and go as far as you can while hitting 5+ reps"

**Minor Updates:**
- Sleep recommendation updated: 8+ hours → 7+ hours (Dashboard)
- Paused Bench AMRAP tip cleaned up (removed microplate reference)
- Incline DB Press tip updated to match Flat DB Press guidance
- Walking Lunges tip simplified
- Hack Calf Raises tip updated: "1 second pause at the bottom, slow eccentric"
- Seated Leg Curls tip punctuation fixed

**Technical Changes:**
- Updated COMPOUND_EXERCISES set in pencilneck.ts to include new exercises
- Added 22 new tip mappings in WorkoutView.tsx tipMap
- Added 22 new tip translations in translations.ts
- All tips are now properly linked and will display during workouts

**Files Modified:**
- `src/data/pencilneck.ts` - Exercise definitions and COMPOUND_EXERCISES set
- `src/contexts/translations.ts` - Exercise tip translations
- `src/pages/WorkoutView.tsx` - Tip mapping system
- `src/pages/Dashboard.tsx` - Sleep recommendation
- `src/pages/Entry.tsx` - Removed "New Recruit Found" popup for direct navigation

## Program Structure

### Pencilneck Eradication Protocol
- **Duration:** 8 weeks, supports multiple cycles
- **Split:** 5-day push/pull split
- **Days:**
  - Day 1: Push A (Chest/Delts/Tri/Quads)
  - Day 2: Pull A (Back/Rear Delt/Bi/Hams)
  - Day 3: Rest & Recovery
  - Day 4: Push B (Chest/Delts/Tri/Quads)
  - Day 5: Pull B (Back/Rear Delt/Bi/Hams)
  - Day 6-7: Rest

**Progression Logic:**
- Weeks 1-4: High rep ranges for hypertrophy
- Weeks 5-8: Heavy phase (compound exercises drop to 6-10 rep range)
- Cycle 1 Week 7-8: Intensity techniques on compounds (last set)
- Cycle 2+: Intensity techniques on all compounds, all weeks
- Week 8 Day 4: Final exam with burnout sets

**Cycle System:**
- Cycle 1: Base phase with progressive intensity
- Cycle 2+: Advanced phase with full intensity from week 1
- Automatic reload calculation for cycle transitions

### Bench Domination
- 12-week bench press specialization program
- Peaking block available (weeks 13-15)
- Module system for customization

### From Skeleton to Threat
- 12-week full-body program
- Custom day selection support

### Peachy Glute Plan
- 12-week glute specialization
- Dynamic paused squat calculation (80% of Monday squats)

## Backup Strategy

All major changes are documented here. Create backup in `/backups` folder with:
- Date stamp
- Associated git commit hash
- Description of changes

Example: `PLAN_2025-12-26_commit-abc1234.md`
