# Workout Planner Implementation Guide

## Overview
This application is a **React + Vite** single-page application (SPA) backed by **Firebase (Firestore + Auth)**. It is designed to be a modular workout scheduling platform where different "Plans" (Bench Domination, Peachy, etc.) can be plugged in via configuration files, though some UI elements remain hardcoded for specific flavor requirements.

---

## 🏗️ Architecture

### 1. **Data Layer (`src/data/`)**
The core of the modularity lies here. Each plan is defined as a self-contained `PlanConfig` object.
*   **`program.ts`**: Configuration for *Bench Domination*. Contains complex hook logic for 1RM calculations, reactive deloads, and peaking blocks.
*   **`peachy.ts`**: Configuration for *Peachy Glute Plan*. Contains theme triggers and Saturday finisher injection logic.
*   **`pencilneck.ts`**: Configuration for *Pencilneck Eradication*. Contains heavy phase logic (Weeks 5-8), Cycle 2 re-run adjustments, and suggested weight calculations.
*   **`skeleton.ts`**: Configuration for *Skeleton to Threat*. Contains 12-week structure and "Forced Progression" advice logic.
*   **`painglory.ts`**: Configuration for *Pain & Glory*. Contains 16-week deadlift specialization with E2MOM phases and peaking logic.
*   **`trinary.ts`**: Configuration for *Trinary*. Contains conjugate periodization with ME/DE/RE rotation, weak-point based exercise variations, and accessory day triggers.

**Key Interface (`src/types.ts`):**
```typescript
interface PlanConfig {
    id: string; // Unique ID (e.g., 'bench-domination')
    program: Program; // The static week/day/exercise structure
    ui: {
        dashboardWidgets: string[]; // List of widget IDs to render
    };
    hooks?: {
        preprocessDay?: (day: WorkoutDay, user: UserProfile) => WorkoutDay; // Dynamic modification
        calculateWeight?: (target: SetTarget, user: UserProfile) => string | undefined; // Weight math
        getExerciseAdvice?: (exercise: Exercise, history: WorkoutLog[]) => string | null; // Progression advice
    };
}
```

### 2. **State Management (`src/contexts/UserContext.tsx`)**
*   Handles Firebase Auth state.
*   Loads `UserProfile` from Firestore (`users/{userId}`).
*   **Badges:** Checks for new badges every time a workout is saved via `checkForBadges()`.
*   **Plan Switching:** Manages the `activePlanConfig` based on the user's `programId`.

### 3. **The Widget System (`src/pages/Dashboard.tsx`)**
Widgets are **semi-modular**. They are defined by string IDs in the `PlanConfig`, but their implementation is **hardcoded** inside `Dashboard.tsx`.
*   **Implementation:** A monolithic render method checks `if (activeWidgets.includes('widget_id'))` to render the component.
*   **Available Widgets:**
    *   `1rm`: Displays estimated 1RM.
    *   `program_status`: Simple week/schedule chart.
    *   `strength_chart`: Recharts line graph (dynamic axis based on plan type).
    *   `glute_tracker`: Input field for glute measurements.
    *   `pencilneck_commandments`: Hardcoded list of rules.
    *   `skeleton_countdown`: "Weeks left until..." logic.
    *   `skeleton_quotes`: "Your muscles are knitting armor..."
    *   `trap_barometer`: **Hardcoded** to `pencilneck-eradication` ID check (not a strict widget ID, embedded logic).

### 4. **Localization (`src/contexts/useTranslation.tsx`)**
The app supports full English/Polish localization (`en` / `pl`).
*   **Mechanism:** React Context + `translations.ts` dictionary object.
*   **Storage:** Persisted in `localStorage` under the key `'language'`.
*   **Usage:** `const { t } = useLanguage();` -> `t('common.save')`.
*   **Structure:** Translations are nested objects. `t()` supports dot-notation access (e.g., `t('dashboard.cards.est1rm')`).

### 5. **Workout Execution (`src/pages/WorkoutView.tsx`)**
*   **Dynamic Rendering:** Renders exercises based on the `currentDay` object returned by `preprocessDay` hook.
*   **Tips Engine:** Displays tips from two sources:
    1.  **Static:** `exercise.notes` from the data file.
    2.  **Global:** `translations.ts` mapping (fallback if no static note exists).
*   **Progression Advice:** Calls `hooks.getExerciseAdvice()` to compare current history with targets (e.g., "Increase Weight!").

---

## 🛠️ Hardcoded vs. Modular
To maintain and expand the app, it is crucial to understand what is generic and what is hardcoded.

### **Fully Modular (Config-Driven)**
*   **Weekly Structure:** defined in `src/data/*.ts`.
*   **Exercise Lists:** defined in `src/data/*.ts`.
*   **Rep/Set Schemes:** defined in `src/data/*.ts`.
*   **Progression Math:** defined in `hooks.calculateWeight`.
*   **Progression Advice:** defined in `hooks.getExerciseAdvice`.

### **Hardcoded (Requires Component Edits)**
*   **Dashboard Widgets:** To add a new widget, you must add the condition and JSX in `Dashboard.tsx`.
*   **Themes:**
    *   **Peachy Theme:** CSS variables are injected via a `<style>` tag in `Dashboard.tsx` and class checks in `ProtectedLayout.tsx`.
    *   To add a new theme, you must edit `ProtectedLayout.tsx` and `Dashboard.tsx` to handle the new Plan ID.
*   **Special Logic:**
    *   **Bench Domination Modules:** The display of active modules is hardcoded to check `activePlanConfig.id === 'bench-domination'`.
    *   **Pencilneck Titles/Banners:** The specific weekly titles and the Cycle 2 banner are hardcoded inside `Dashboard.tsx`.
    *   **Completion Modals:** The new "Next Level" skeleton modal is hardcoded in `Dashboard.tsx`.

---

## 🚀 How to Add a New Plan

1.  **Create Data File:**
    *   Create `src/data/new_plan.ts`.
    *   Define `createWeeks()` to generate structure.
    *   Define `hooks` for any logic.
    *   Export `NEW_PLAN_CONFIG`.

2.  **Register Plan:**
    *   Import in `src/data/plans.ts`.
    *   Add to `PLAN_REGISTRY`.

3.  **Add Widgets (Optional):**
    *   If using existing widgets (`1rm`, `program_status`), add to `ui.dashboardWidgets`.
    *   If new widget needed:
        *   Add ID to config.
        *   Implement JSX in `Dashboard.tsx`.

4.  **Badges (Optional):**
    *   Add badge definition in `src/data/badges.ts`.
    *   Add logic check in `src/contexts/UserContext.tsx` within `checkForBadges`.

---

## 🔐 Data Persistence & User Session Management (February 2026)

### Codeword Isolation Fix

**Problem:** The app was storing codewords in `localStorage`, causing workout plans to accidentally overwrite each other when multiple users tested different plans on the same device.

**Solution:**
*   **Removed all `localStorage` persistence for codewords** in `UserContext.tsx`
*   Modified functions:
    *   `checkCodeword()`: Removed `localStorage.setItem('bench-domination-id')` calls
    *   `registerUser()`: Removed localStorage operations after successful registration
    *   `logout()`: Removed `localStorage.removeItem()` cleanup
*   **Effect:** Users must enter their codeword fresh every session, preventing data contamination between different workout plans/users

**Implementation Details:**
```typescript
// Before (line 31):
const [listeningId, setListeningId] = useState<string | null>(() => localStorage.getItem('bench-domination-id'));

// After:
const [listeningId, setListeningId] = useState<string | null>(null);

// All localStorage.setItem/removeItem calls for 'bench-domination-id' removed throughout the file
```

**Rationale:** This prevents the scenario where testing a new plan with codeword "test123" would overwrite stats for the primary user's plan with codeword "mezo1" on the same browser.

---

### Soft-Save Feature for Workout Data

**Problem:** Rep and weight entries in workout fields were only saved when clicking "Complete Workout". If the browser closed unexpectedly, all entered data was lost.

**Solution:** Implemented a dual-save system in `WorkoutView.tsx`:

#### **Soft Save (Automatic, Immediate)**
*   **Trigger:** Fires automatically whenever `exerciseData` or `exerciseNotes` state changes
*   **Storage:** Saves to `localStorage` with unique key: `workout_draft_{userId}_{programId}_{week}_{day}`
*   **Data Saved:**
    ```typescript
    {
        exerciseData: Record<string, SetLog[]>,
        exerciseNotes: Record<string, string>,
        timestamp: string
    }
    ```
*   **Implementation:** React `useEffect` hook at line 317-333

#### **Hard Save (Manual, Final)**
*   **Trigger:** User clicks "Complete Workout" button
*   **Action:** Saves workout session to Firestore with stat updates and progression logic
*   **Cleanup:** Clears corresponding localStorage draft after successful save (lines 1340-1357)

#### **Load Priority on Mount**
1.  **Check for soft-save draft** in localStorage (lines 113-123)
2.  If draft exists: Load it and skip fetching completed session from Firestore
3.  If no draft: Check Firestore for existing completed log
4.  If no completed log: Initialize empty state from program config

**Key Benefits:**
*   ✅ Data survives browser crashes/accidental closes
*   ✅ No risk of accidentally overwriting completed sessions (drafts are separate)
*   ✅ Automatic cleanup prevents stale data accumulation
*   ✅ Per-user, per-program, per-workout isolation
*   ✅ **All drafts cleared on new user registration** (prevents cross-contamination)

**Technical Notes:**
*   Soft-saves are program-specific: switching programs won't show drafts from different programs
*   Draft persists until workout completion or manual browser storage clear
*   No network calls during soft-save (instant, local-only operation)
*   **Cleanup on registration:** `clearAllWorkoutDrafts()` removes all `workout_draft_*` keys from localStorage when a new user registers (line 258 in `UserContext.tsx`)
*   Ensures fresh slate when testing new plans or switching between user accounts

---

## 📂 Implementation Details by File

### `src/data/program.ts` (Bench Domination)
*   **Smart Scheduling:** Logic inside `preprocessDay` analyzes `user.selectedDays` to map "Heavy" workouts to isolated days and "Volume" to consecutive blocks.
*   **Reactive Deload:** Checks if last 2 consecutive AMRAPs were ≤7 reps. If so, effectively rewrites the current week's sets/reps in the hook.
*   **Peaking Block:** `createWeeks` function generates different content for W13-15.
*   **Main Progression (Phased Thresholds):** Sustainable progression with gradual threshold lowering:
    *   Weeks 1-6: ≥12 reps = +2.5 kg
    *   Weeks 7-9: ≥10 reps = +2.5 kg
    *   Weeks 10-12: ≥8 reps = +2.5 kg
    *   Peaking Weeks 13-15: ≥6 reps = +2.5 kg
    *   No microplates, no large jumps – +2.5 kg max increase.
*   **Weight Calculation Methodology (`calculateWeight` hook) – January 2026 Overhaul:**
    ```
    1. Get current base from getPausedBenchBase():
       a. Start with onboarding 1RM
       b. Apply +2.5 kg for each qualifying AMRAP (phased thresholds)
       c. At weeks 4, 8, 12: recalculate e1RM using Epley (weight × (1 + reps/30))
       d. Reset base to e1RM rounded DOWN to nearest 2.5 kg
    2. Calculate raw weight: currentBase × workout-specific percentage
    3. Round to nearest 2.5 kg with UPWARD CAP SAFETY:
       - Never round up more than +2.5 kg above raw value
       - Example: raw 134.375 → 135 ✓, raw 135.1 → 135 ✓ (rounds down)
    4. Peaking (W13-15): Uses final Week 12 e1RM for all % calculations
    ```
    **Important:** The old onboarding jump system has been REMOVED. All progress is now driven exclusively by AMRAP performance and e1RM recalculations.
*   **Variation Progression:**
    *   **Fixed-Rep Targets (Spoto Press 5 reps, Low Pin Press 4 reps):** Hit exact target on ALL sets = +2.5 kg next session. Message: *"Target reps hit – weight auto-increased +2.5 kg next time"*
    *   **Rep Ranges (Wide-Grip Bench 6-8 reps):** Hit top reps (8) on ALL sets for 2 consecutive weeks = +2.5 kg. Message: *"Hit top reps on all sets for 2 straight weeks → +2.5 kg"*
*   **Elite Warmups:** Added for main bench lifts.
*   **Deload System (January 2026 Final Implementation):**
    *   **Week 9 Static Deload:**
        *   Inserted after week 8 in `createWeeks()` function
        *   Clones week 8 structure, applies -15% weight and half volume via `preprocessDay` hook
        *   Detection: `dayName.includes('DELOAD')` triggers automatic modifications
        *   All exercises modified: `sets = Math.max(1, Math.floor(sets / 2))`, `percentage *= 0.85`
        *   Weeks renumbered after insertion: original weeks 9-15 become 10-16
        *   Total program: 16 weeks (was 15)
    *   **Week 13 Peaking Deload:**
        *   Monday: Only Paused Bench (4x2 @ 91%), no accessories, triceps removed via preprocessDay filter
        *   Wednesday/Thursday: Bench exercises get -15% weight and half volume
        *   Tricep exercises filtered out: `!ex.name.includes('Tricep') && !ex.name.includes('Rolling')`
        *   Saturday: Conditional test (AMRAP or 1RM based on `user.benchDominationStatus.post12WeekChoice`)
        *   Placeholder exercise replaced in preprocessDay based on modal selection
    *   **1RM Test Warmup Protocol:**
        *   Detection: `ex.name.includes('1RM TEST')`
        *   Modified percentages: 80% double (was 85%), 90% single (was 95%)
        *   Applied in warmup generation logic to reduce fatigue before max attempt
    *   **Weighted Pull-ups Progression (W10-12):**
        *   Week 10: Set 1 = "1" reps (1RM test), Sets 2-4 = "2-3" reps @ 92.5%
        *   Week 11-12: All sets = "2+" reps @ 92.5% of Week 10 max
        *   Modified in preprocessDay hook when `weekNum >= 10 && weekNum <= 12 && day.dayOfWeek === 3`
    *   **Trigger Detection (Future Dynamic System):**
        *   Forced deload: Tracked in `WorkoutView.tsx` on Week 8 Saturday completion
        *   Reactive: 2 consecutive AMRAPs ≤7 reps detection (weeks 5-8)
        *   Big drop: >15% e1RM drop at Week 5 recalculation
        *   All triggers save to `user.benchDominationStatus.addedDeloadWeeks[]`
        *   UI insertion not implemented (tracked for future enhancement)


### `src/data/peachy.ts` (Peachy Plan)
*   **Finisher Injection:** Logic in `createPeachyWeeks` specifically pushes the "Glute Pump Finisher" to the Saturday array if `w === 12`.
*   **Squat Goal Hook:** `getExerciseAdvice` specifically checks for 3 sets of 10 reps on Squats to trigger the "+2.5kg" message.

### `src/data/pencilneck.ts`
*   **Heavy Phase (W5-8):** `preprocessDay` dynamically sets rep ranges to 6-10 for Compound exercises if `week >= 5`.
*   **Cycle 2 Logic:** Checks `user.pencilneckStatus.cycle` to apply heavier weights and mandatory intensity techniques.
*   **Suggested Weights:** `getExerciseAdvice` calculates recommended loads based on historical W3-4 performance.
*   **Intensity Techniques:** Uses `intensityTechnique` field for weeks 7-8 (cycle 1) and all weeks (cycle 2+) on compounds.
*   **Exercise Swaps:** Front Squats can be swapped for Stiletto Squats via alternates array
*   **Comprehensive Tips:** 22+ exercise-specific tips covering form, tempo, and technique cues
*   **Recent Updates (Dec 2025):**
    *   Replaced Lying Lateral Raises with Leaning Single Arm DB Lateral Raises (wall-assisted technique)
    *   Updated Pec-Dec to Pec Deck (standardized naming, removed alternates)
    *   Changed Wide-Grip Seated Row to Lat Prayer (internal rotation focus)
    *   Replaced Face Pulls with Wide Grip BB Row (compound movement)
    *   Updated Single-Arm DB Rear Delt Fly to Side-Lying Rear Delt Flyes
    *   Added Stiletto Squats as Front Squat alternative
    *   All new exercises added to COMPOUND_EXERCISES set for proper phase logic

---

## 📊 Weight Calculation Systems - Complete Technical Reference

This section documents the precise weight calculation algorithms for ALL programs. Each entry includes the mathematical formula, decision tree logic, rounding rules, and concrete numerical examples.

### 1. **BENCH DOMINATION** - Advanced Percentage-Based Progression

#### **System Overview**
Bench Domination uses a sophisticated base weight system with phased AMRAP progression and periodic e1RM recalculations. All calculations round to 2.5kg increments.

#### **Core Components**

**A. Helper Functions**
```javascript
// Round to nearest 2.5kg with +2.5kg upward cap
roundToNearest2_5WithCap(rawWeight):
    nearestRounded = Math.round(rawWeight / 2.5) * 2.5
    difference = nearestRounded - rawWeight
    if (difference > 2.5):
        return Math.floor(rawWeight / 2.5) * 2.5
    return nearestRounded

// Round DOWN to nearest 2.5kg
roundDownToNearest2_5(weight):
    return Math.floor(weight / 2.5) * 2.5

// Round UP to nearest 2.5kg
roundUpToNearest2_5(weight):
    return Math.ceil(weight / 2.5) * 2.5

// Epley e1RM formula
calculateE1RM(weight, reps):
    if (reps <= 0) return weight
    return weight × (1 + reps/30)
```

**B. Paused Bench Press Base Weight Calculation**

The `getPausedBenchBase(user, context)` function determines the current base weight:

```
1. Input: user.stats.pausedBench (onboarding 1RM), user.benchHistory[], context.week
2. Start: currentBase = onboarding 1RM
3. Sort benchHistory by week (ascending), filter to weeks < currentWeek

4. Check for e1RM recalculation checkpoints:
   Checkpoints: Week 4 → applies from Week 5
                Week 8 → applies from Week 9
                Week 12 → applies from Week 13
   
   For each applicable checkpoint:
       Find AMRAP entry for checkpoint week
       e1RM = calculateE1RM(actualWeight, actualReps)
       currentBase = roundDownToNearest2_5(e1RM)
       Mark all weeks ≤ checkpoint as processed
       Console log: "[e1RM RESET] Week X checkpoint for week Y"

5. Apply weekly AMRAP progressions for unprocessed weeks:
   For each AMRAP in benchHistory:
       if week already processed: skip
       threshold = getRepThresholdForWeek(week)
           Week 1-6: threshold = 12
           Week 7-9: threshold = 10
           Week 10-12: threshold = 8
           Week 13-15: threshold = 6
       
       if (actualReps >= threshold):
           currentBase += 2.5
           Console log: "[AMRAP PROGRESS] Week X: Y reps >= Z threshold → +2.5kg"
       else:
           Console log: "[AMRAP STALL] Week X: Y reps < Z threshold → no increase"

6. Return: currentBase
```

**C. Working Weight Calculation**

The `calculateWeight` function applies workout-specific percentages:

```
1. currentBase = getPausedBenchBase(user, {week})
2. percentage = target.percentage (from exercise definition)
3. rawWeight = currentBase × percentage
4. Rounding strategy based on day:
   
   Monday (day 1) - Heavy Day:
       finalWeight = roundToNearest2_5WithCap(rawWeight)
       Console: "[WEIGHT CALC] Paused Bench (Heavy): base X kg × Y% = raw Z kg → NEAREST W kg"
   
   Wednesday (day 3) - Volume Day:
       finalWeight = roundUpToNearest2_5(rawWeight)
       Console: "[WEIGHT CALC] Paused Bench (Volume): base X kg × Y% = raw Z kg → CEIL W kg"
   
   Thursday (day 4) - Power Day:
       finalWeight = roundToNearest2_5WithCap(rawWeight)
       Console: "[WEIGHT CALC] Paused Bench (Power): base X kg × Y% = raw Z kg → NEAREST W kg"
   
   Saturday (day 6) - AMRAP Day:
       finalWeight = roundUpToNearest2_5(rawWeight)
       Console: "[WEIGHT CALC] Paused Bench (AMRAP): base X kg × Y% = raw Z kg → CEIL W kg"

5. Return: finalWeight as string
```

**D. Bench Press Variations** (Wide-Grip, Spoto, Low Pin Press)

Uses heuristic detection to determine if stored value is 1RM or working weight:

```
1. Get storedValue from user.stats[variationKey]
2. Get bench1RM from user.stats.pausedBench
3. threshold = bench1RM × 0.85

4. Console: "[VARIATION CALC] {exerciseName} - Week X, Day Y"
5. Console: "[VARIATION CALC] Bench 1RM (pausedBench): {bench1RM} kg"
6. Console: "[VARIATION CALC] Stored value for {statKey}: {storedValue} kg"
7. Console: "[VARIATION CALC] Threshold (85% of bench 1RM): {threshold} kg"

8. IF storedValue > threshold:
       Console: "[VARIATION CALC] {storedValue} kg > {threshold} kg → Treating as 1RM"
       percentage = target.percentage || 1.0
       rawWeight = storedValue × percentage
       Console: "[VARIATION CALC] Raw weight: {storedValue} kg × {percentage}% = {rawWeight} kg"
       finalWeight = roundToNearest2_5WithCap(rawWeight)
       Console: "[VARIATION CALC] Final weight (rounded): {finalWeight} kg"
   ELSE:
       Console: "[VARIATION CALC] {storedValue} kg <= {threshold} kg → Using directly"
       finalWeight = storedValue
       Console: "[VARIATION CALC] Final weight: {storedValue} kg"

9. Return: finalWeight as string
```

#### **Concrete Examples**

**Example 1: Week 1-4 Progression (No e1RM yet)**
```
Onboarding: pausedBench = 100kg
benchHistory: []

Week 1:
- currentBase = 100kg (no history)
- Monday @ 82.5%: 100 × 0.825 = 82.5kg
- Wednesday @ 72.5%: 100 × 0.725 = 72.5kg
- Saturday AMRAP @ 67.5%: 100 × 0.675 = 67.5kg
- User lifts 67.5kg × 13 reps → qualifies (≥12)
- benchHistory updated: [{week: 1, actualWeight: 67.5, actualReps: 13}]

Week 2:
- currentBase = 100 + 2.5 = 102.5kg (Week 1 qualified)
- Monday @ 82.5%: 102.5 × 0.825 = 84.5625 → roundNearest = 85kg
- Wednesday @ 72.5%: 102.5 × 0.725 = 74.3125 → roundUp = 75kg
- Saturday AMRAP @ 67.5%: 102.5 × 0.675 = 69.1875 → roundUp = 70kg
- User lifts 70kg × 11 reps → STALL (11 < 12)

Week 3:
- currentBase = 102.5kg (Week 2 did not qualify)
- Saturday AMRAP @ 67.5%: 102.5 × 0.675 = 69.1875 → roundUp = 70kg
- User lifts 70kg × 14 reps → qualifies

Week 4:
- currentBase = 102.5 + 2.5 = 105kg
- Saturday AMRAP @ 67.5%: 105 × 0.675 = 70.875 → roundUp = 72.5kg
- User lifts 72.5kg × 12 reps → qualifies
```

**Example 2: Week 5 e1RM Recalculation + Intensity Progression**
```
Previous state:
- Original 1RM: 100kg
- Week 4 AMRAP: 72.5kg × 12 reps

Week 5 calculation:
- e1RM checkpoint: Week 4 data found
- e1RM = 72.5 × (1 + 12/30) = 72.5 × 1.4 = 101.5kg
- newBase = roundDown(101.5) = 100kg
- Console: "[e1RM RESET] Week 4 checkpoint for week 5:"
- Console: "[e1RM RESET] AMRAP: 72.5kg × 12 reps"
- Console: "[e1RM RESET] e1RM = 101.50 kg → New base = 100kg"

Week 5 - Intensity Progression Kicks In:
- Monday @ 85% (was 82.5%): 100 × 0.85 = 85kg
- Wednesday @ 75% (was 72.5%): 100 × 0.75 = 75kg
- Saturday AMRAP @ 67.5%: 100 × 0.675 = 67.5kg
- Note: Percentages increased by 2.5% for progressive overload

Week 9 - Second Intensity Jump:
- Assuming base has progressed to 110kg through AMRAPs
- Monday @ 87.5% (was 85%): 110 × 0.875 = 96.25 → roundNearest = 95kg
- Wednesday @ 77.5% (was 75%): 110 × 0.775 = 85.25 → roundUp = 85kg
- Note: Another 2.5% increase for continued adaptation
```

**Example 3: Variation Weight Calculation**
```
User stats:
- pausedBench = 120kg
- wideGripBench = 115kg (saved during onboarding)

Week 8, Thursday (Wide-Grip Bench @ 67.5%):
- threshold = 120 × 0.85 = 102kg
- storedValue = 115kg
- 115 > 102 → Treating as 1RM
- rawWeight = 115 × 0.675 = 77.625kg
- finalWeight = roundNearest(77.625) = 77.5kg
- Console: "[VARIATION CALC] Wide-Grip Bench Press - Week 8, Day 4"
- Console: "[VARIATION CALC] 115 kg > 102 kg → Treating as 1RM"
- Console: "[VARIATION CALC] Final weight (rounded): 77.5 kg"

Later (after weeks of progression to 107.5kg working weight):
- User has progressed Wide-Grip from initial 77.5kg to 107.5kg
- storedValue = 107.5kg
- 107.5 > 102 → Still treating as 1RM (close to bench 1RM)
- Console: "[VARIATION CALC] 107.5 kg > 102 kg → Treating as 1RM"

Even later (if saved as working weight after manual progression):
- storedValue = 82.5kg (manually logged working weight)
- 82.5 < 102 → Treating as working weight (use directly)
- finalWeight = 82.5kg
- Console: "[VARIATION CALC] 82.5 kg <= 102 kg → Using directly"
```

---

### 2. **PEACHY GLUTE PLAN** - Static Percentage with Dynamic Paused Squat

#### **System Overview**
Peachy uses simple percentage-based calculations with one special dynamic exercise.

#### **Weight Calculations**

**A. Standard Exercises**
```
No automatic weight calculation
Uses manual double progression:
1. User enters weight manually
2. getExerciseAdvice checks if top range hit on all sets
3. If yes: displays "Increase Weight!"
```

**B. Paused Squat (Friday) - Dynamic Calculation**
```
Target: 80% of Monday Squats (same week)

calculateWeight(target, user, "Paused Squat", context):
    1. Find Monday's squat log for current week in user.squatHistory
    2. If found:
           base = historyEntry.weight
           percentage = target.percentage || 0.8
           finalWeight = Math.floor((base × percentage) / 2.5) * 2.5
       Else:
           Use onboarding 1RM fallback:
           finalWeight = Math.round((user.stats.squat × 0.8) / 2.5) * 2.5
    3. Return finalWeight
```

#### **Concrete Examples**

**Example 1: Paused Squat Progression**
```
Week 5:
- Monday: User logs Squats at 90kg (progression from previous week)
- squatHistory updated: [{week: 5, weight: 90}]

- Friday calculation:
  - base = 90kg
  - target = 90 × 0.8 = 72kg
  - finalWeight = Math.floor(72 / 2.5) * 2.5 = 72kg (exact)
  - Display: "Target 72kg"

Week 6:
- Monday: User logs Squats at 92.5kg
- Friday calculation:
  - base = 92.5kg
  - target = 92.5 × 0.8 = 74kg
  - finalWeight = Math.floor(74 / 2.5) * 2.5 = 72.5kg (round down)
  - Display: "Target 72.5kg"
```

**Example 2: Squat Progression Advice**
```
Week 3, Monday Squats (Target: 3×5-10):
- User logs: [90kg × 10, 90kg × 10, 90kg × 10]
- All 3 sets hit 10 reps (top of range)
- Advice: "You hit 3x10 last week! +2.5kg now."

Week 4, Monday:
- User follows advice, uses 92.5kg
```

---

### 3. **PENCILNECK ERADICATION** - User-Driven with Cycle-Based Suggestions

#### **System Overview**
No automatic weight calculations. All weights are user-entered with intelligent suggestions based on historical performance and cycle progression.

#### **Suggestion Algorithms**

**A. Week 5 Heavy Phase Suggestion** (Compounds Only)
```
getExerciseAdvice(exercise, history):
    if (week !== 5 OR !isCompound(exercise.name)):
        skip
    
    maxWeight = 0
    Scan last 5 logs:
        For each completed set:
            if (weight > maxWeight):
                maxWeight = weight
    
    if (maxWeight > 0):
        suggested = Math.floor((maxWeight × 1.15) / 2.5) * 2.5
        return "Week 5 Heavy Phase: Suggested {suggested}kg"
```

**B. Cycle 2 Week 1 Reload Suggestion**
```
getExerciseAdvice(exercise, history):
    if (cycle <= 1 OR week !== 1):
        skip
    
    1. Find max weight from last 8 logs (includes Week 8 peak)
    2. multiplier = isCompound ? 0.87 : 0.92
    3. suggested = maxW8 × multiplier
    4. Find oldest log to get Cycle 1 Week 1 starting weight
    5. minTarget = firstWeight × 1.10
    6. if (suggested < minTarget): suggested = minTarget
    7. suggested = Math.floor(suggested / 2.5) * 2.5
    8. return "Cycle {N} Reload: Suggested ~{suggested}kg"
```

#### **Concrete Examples**

**Example 1: Week 5 Heavy Phase**
```
Flat Barbell Bench Press:
Weeks 3-4 history:
- Week 3: [85kg × 12, 85kg × 11, 85kg × 10]
- Week 4: [87.5kg × 11, 87.5kg × 10, 87.5kg × 9]

maxWeight = 87.5kg
Week 5 suggestion:
- suggested = Math.floor((87.5 × 1.15) / 2.5) * 2.5
- suggested = Math.floor(100.625 / 2.5) * 2.5
- suggested = Math.floor(40.25) * 2.5 = 40 * 2.5 = 100kg
- Display: "Week 5 Heavy Phase: Suggested weight ~100kg (based on 87.5kg recent max). Aim for 6-10 reps."
```

**Example 2: Cycle 2 Week 1 Reload**
```
Cycle 1 complete. Incline DB Press history:
- Cycle 1 Week 1 max: 25kg × 12
- Cycle 1 Week 8 max: 35kg × 8

Cycle 2 Week 1:
- maxW8 = 35kg
- multiplier = 0.87 (compound)
- suggested = 35 × 0.87 = 30.45kg
- firstWeight = 25kg
- minTarget = 25 × 1.10 = 27.5kg
- 30.45 > 27.5, so use 30.45
- suggested = Math.floor(30.45 / 2.5) * 2.5 = 30kg
- Display: "Cycle 2 Reload: Suggested ~30kg (Based on 35kg max & +10% over original start)"
```

---

### 4. **FROM SKELETON TO THREAT** - No Automatic Calculations

#### **System Overview**
Fully user-driven weight selection. Program focuses on forced progression messaging rather than calculations.

#### **Advice System**
```
Example: Leg Extensions (Target: 12-20 reps)
If all sets hit ≥20 reps:
    return "Target reps hit! Add +5kg"

Example: Deficit Push-ups (AMRAP)
Always returns:
    maxReps = max reps from last session
    return "Try to beat: {maxReps} reps this week"
```

No weight calculations = No examples needed.

---

### 5. **PAIN & GLORY** - Multi-System Hybrid

#### **System Overview**
Pain & Glory uses different calculation methods for different exercises:
1. Deficit Snatch Grip: Progressive with RPE-based adjustments
2. E2MOM Conventional: Multiplier-based with weekly adjustments
3. Paused Low Bar Squat: Progressive weeks 1-8, fixed weeks 9-16
4. CAT Deadlift: Percentage of AMRAP test

#### **Weight Calculations**

**A. Deficit Snatch Grip Deadlift** (Weeks 1-12)
```
calculateWeight(target, user, "Deficit Snatch Grip Deadlift", context):
    base1RM = user.stats.conventionalDeadlift
    
    currentWeight = user.painGloryStatus?.deficitSnatchGripWeight
                    || Math.floor((base1RM × 0.45) / 2.5) * 2.5
    
    return currentWeight

Progress mechanism: RPE modal after each session
- Ready For More: currentWeight + 5kg
- Good, Maintain: currentWeight (same)
- Wrecked: max(20kg, currentWeight - 5kg)
```

**B. Conventional Deadlift E2MOM** (Weeks 9-12)
```
calculateWeight(target, user, "Conventional Deadlift (E2MOM)", context):
    deficitWeight = user.painGloryStatus.deficitSnatchGripWeight
    e2momAdjustment = user.painGloryStatus.e2momWeightAdjustment || 0
    
    startWeight = Math.floor((deficitWeight × 1.35) / 2.5) * 2.5
    finalWeight = startWeight + e2momAdjustment
    
    return finalWeight

Progression: +2.5kg each week if all 6 sets completed with good form
```

**C. Paused Low Bar Squat** (Progressive then Maintenance)
```
calculateWeight(target, user, "Paused Low Bar Squat", context):
    squat1RM = user.stats.lowBarSquat
    
    IF week 1-8:
        squatProgress = user.painGloryStatus.squatProgress || 0
        
        baseWeight = squat1RM × 0.7
        IF week >= 5:
            baseWeight = (squat1RM × 1.075) × 0.7  // +7.5% reset at week 5
        
        progressedWeight = baseWeight + squatProgress
        return Math.floor(progressedWeight / 2.5) * 2.5
    
    ELSE (weeks 9-16):
        week8Weight = user.painGloryStatus.week8SquatWeight || (squat1RM × 0.85)
        return Math.floor(week8Weight / 2.5) * 2.5
```

**D. CAT Deadlift** (Weeks 13-16)
```
calculateWeight(target, user, "Conventional Deadlift (CAT)", context):
    amrapWeight = user.painGloryStatus.amrapWeight  // From Week 13 AMRAP test
    catWeight = Math.floor((amrapWeight × 0.7) / 2.5) * 2.5
    return catWeight
```

#### **Concrete Examples**

**Example 1: Deficit Progression (Weeks 1-12)**
```
Onboarding: conventionalDeadlift = 180kg

Week 1:
- Initial weight = Math.floor((180 × 0.45) / 2.5) * 2.5 = Math.floor(81 / 2.5) * 2.5 = 80kg
- User performs 10×6 @ 80kg
- RPE modal: "Ready For More" → deficitSnatchGripWeight = 85kg

Week 2:
- Weight = 85kg
- User struggles → "Wrecked" → deficitSnatchGripWeight = 80kg

Week 3-8:
- Gradual progression selecting "Ready For More" when fresh
- By Week 8: deficitSnatchGripWeight = 100kg

Week 9:
- E2MOM starts: 100 × 1.35 = 135kg → Math.floor(135 / 2.5) * 2.5 = 135kg
- User completes all 6 sets → e2momAdjustment = +2.5kg

Week 10:
- Weight = 135 + 2.5 = 137.5kg
```

**Example 2: Paused Low Bar Squat Progression**
```
Onboarding: lowBarSquat = 140kg

Week 1:
- baseWeight = 140 × 0.7 = 98kg
- squatProgress = 0
- finalWeight = 98kg
- User completes 4×4-6, hits all 6 reps → squatProgress = +2.5kg

Week 2-4:
- baseWeight = 98kg, squatProgress accumulates
- Week 4: squatProgress = 7.5kg, finalWeight = 105.5 → rounds to 105kg

Week 5 (Reset):
- baseWeight = (140 × 1.075) × 0.7 = 150.5 × 0.7 = 105.35kg
- squatProgress now starts from 0 again
- finalWeight = Math.floor(105.35 / 2.5) * 2.5 = 105kg

Week 8:
- squatProgress = 10kg, finalWeight = 115kg
- week8SquatWeight saved = 115kg

Week 9-16 (Maintenance):
- All weeks use 115kg (no progression)
```

**Example 3: Peaking Phase (Weeks 13-16)**
```
Week 13 Monday:
- AMRAP Test weight = Math.floor((100 × 2.22 × 0.85) / 2.5) * 2.5 = 187.5kg
  (100kg = highest deficit weight)
- User lifts 187.5kg × 8 reps
- e1RM = 187.5 × (1 + 8/30) = 187.5 × 1.267 = 237.5kg → rounds to 237.5kg
- amrapWeight saved = 187.5kg

Week 14:
- Heavy Triple @ 90% e1RM = Math.floor((237.5 × 0.90) / 2.5) * 2.5 = 212.5kg

Week 15:
- Heavy Double @ 93% e1RM = Math.floor((237.5 × 0.93) / 2.5) * 2.5 = 220kg

Week 15 Friday (CAT):
- CAT @ 70% of AMRAP weight = Math.floor((187.5 × 0.7) / 2.5) * 2.5 = 130kg

Week 16:
- Heavy Single @ 97% e1RM = Math.floor((237.5 × 0.97) / 2.5) * 2.5 = 230kg
```

---

### 6. **TRINARY** - Block-Based Conjugate System

#### **System Overview**
Trinary uses a two-tier percentage system:
1. Block percentages (ME/DE/RE intensity levels)
2. Variation percentages (exercise-specific modifiers - shown as tips only)

**IMPORTANT:** Only block percentages affect calculated weight. Variation percentages are informational.

#### **Calculation Algorithm**

```
calculateWeight(target, user, exerciseName, context):
    workoutNum = user.trinaryStatus.completedWorkouts + 1
    block = Math.ceil(workoutNum / 3)  // Blocks 1-9
    
    // Determine effort type from exercise name
    isME = exerciseName.includes('(ME)')
    isDE = exerciseName.includes('(DE)')
    isRE = exerciseName.includes('(RE)')
    
    // Extract base name and determine which 1RM to use
    baseName = exerciseName without suffix
    
    IF baseName contains 'bench', 'press', 'floor', 'board', 'close grip', 'lockout':
        current1RM = user.trinaryStatus.bench1RM
    ELSE IF baseName contains 'deadlift', 'rdl', 'deficit', 'rack', 'pull':
        current1RM = user.trinaryStatus.deadlift1RM
    ELSE IF baseName contains 'squat', 'box', 'stiletto', 'safety', 'banded':
        current1RM = user.trinaryStatus.squat1RM
    
    // Get block percentage
    blockPercentages = {
        1-3: {me: 0.90, de: 0.60, re: 0.70}
        4-6: {me: 0.92, de: 0.65, re: 0.75}
        7-9: {me: 0.95, de: 0.70, re: 0.80}
    }
    
    blockPct = isME ? blockPercentages[block].me :
               isDE ? blockPercentages[block].de :
               blockPercentages[block].re
    
    // Calculate base weight
    calculatedWeight = roundDownTo2_5(current1RM × blockPct)
    
    // Apply RE progression bonus if earned
    IF isRE AND user.trinaryStatus.reProgressionPending:
        bonus = find pending progression for this lift type
        calculatedWeight += bonus.amount
    
    return calculatedWeight
```

#### **1RM Updates**

```
After completing ME sets with all 3 reps:
    Find heaviest successful single from ME sets
    newEstimate = roundDownTo2_5(heaviest weight)
    
    IF newEstimate > current1RM:
        Update current1RM to newEstimate
```

#### **Concrete Examples**

**Example 1: Block 1 Progression (Standard Lifts)**
```
User 1RMs:
- bench1RM = 100kg
- deadlift1RM = 160kg
- squat1RM = 140kg

Workout 1 (Deadlift ME, Squat DE, Bench RE):
- Deadlift (ME): 160 × 0.90 = 144 → roundDown = 142.5kg
  Sets: Work up to 1-3 reps @ 142.5kg
  User hits: [142.5kg × 3, 145kg × 2, 147.5kg × 1]
  New estimate = 147.5kg → deadlift1RM updated

- Squat (DE): 140 × 0.60 = 84 → roundDown = 82.5kg
  Sets: 8 sets × 2-3 reps @ 82.5kg (explosive)

- Bench (RE): 100 × 0.70 = 70kg
  Sets: 4 sets × 8-12 reps @ 70kg
  User completes: [70kg × 12, 70kg × 12, 70kg × 12, 70kg × 11]
  Qualifies for progression → reProgressionPending = [{lift: 'bench', amount: 2.5}]
```

**Example 2: Block 4 with Variation (ME uses variation)**
```
User state:
- bench1RM = 105kg (updated from Block 1-3)
- Weak point selected: Off-chest
- Auto-selected variation: Long Pause Bench Press

Workout 10 (Bench ME):
- Exercise name: "Long Pause Bench Press (ME)"
- Block 4, ME percentage = 0.92
- calculatedWeight = roundDown(105 × 0.92) = roundDown(96.6) = 95kg
- Display: "Target 95kg"

Note: Variation percentage (0.91 for Long Pause) is shown as a tip:
"Suggested starting weight: 95.55kg (91% of 105kg 1RM)"
But calculated weight is 95kg (92% block progression)
```

**Example 3: RE Progression Bonus**
```
Block 5, Workout 14 (Squat RE):
- squat1RM = 150kg
- Block 5 RE% = 0.75
- Base calculation: 150 × 0.75 = 112.5kg
- Previous workout earned +2.5kg bonus
- reProgressionPending = [{lift: 'squat', amount: 2.5}]
- Final weight = 112.5 + 2.5 = 115kg

User completes: [115kg × 12, 115kg × 12, 115kg × 12, 115kg × 11]
- Qualifies again → bonus updated to 5kg for next RE squat
```

---

### 7. **RITUAL OF STRENGTH** - Phase-Based with ME Checkbox System

#### **System Overview**
Ritual uses different percentage systems for ramp-in (Weeks 1-4) vs main phase (Weeks 5-16):

#### **Calculation Algorithm**

```
calculateWeight(target, user, exerciseName, context):
    week = context.week || user.ritualStatus.currentWeek
    
    // Determine base 1RM
    IF exercise contains 'bench':
        base1RM = user.ritualStatus.benchPress1RM
    ELSE IF exercise contains 'squat':
        base1RM = user.ritualStatus.squat1RM
    ELSE IF exercise contains 'deadlift':
        base1RM = user.ritualStatus.deadlift1RM
    
    // Phase-specific percentages
    IF week <= 4 (Ramp-in):
        percentage = {1: 0.70, 2: 0.80, 3: 0.90, 4: 0.85}[week]
    
    ELSE IF week >= 5 AND week <= 16 (Main/Peak):
        IF exercise.includes('(ME)'):
            percentage = 0.95
            
            // Get ME progression bonus from checkbox confirmations
            progressionKey = exercise contains 'Bench' ? 'benchMEProgression' :
                           exercise contains 'Squat' ? 'squatMEProgression' :
                           'deadliftMEProgression'
            meProgression = user.ritualStatus[progressionKey] || 0
            
            calculatedWeight = roundDownTo2_5(base1RM × percentage)
            return calculatedWeight + meProgression
        
        ELSE IF exercise.includes('(Light)'):
            percentage = 0.70
        
        ELSE IF exercise.includes('(Ascension Test)'):
            percentage = 0.85
        
        ELSE IF exercise.includes('(Back-down)'):
            percentage = 0.80
    
    ELSE (Week 17 - Purge):
        percentage = 0.70
    
    calculatedWeight = roundDownTo2_5(base1RM × percentage)
    return calculatedWeight
```

#### **ME Progression System**

```
After completing ME workout:
    User sees checkboxes: "+2.5kg" or "+5kg"
    IF checkbox selected:
        progressionAmount = selected amount
        Update ritualStatus.{lift}MEProgression += progressionAmount
    
This cumulative progression is applied in next ME calculation
```

#### **Concrete Examples**

**Example 1: Ramp-in Phase (Weeks 1-4)**
```
Onboarding 1RMs:
- benchPress1RM = 110kg
- squat1RM = 150kg
- deadlift1RM = 180kg

Week 1 - Bench Day:
- Paused Bench @ 70%: 110 × 0.70 = 77 → roundDown = 77.5kg
  (Back-down sets also at 77.5kg)

Week 2 - Bench Day:
- Paused Bench @ 80%: 110 × 0.80 = 88 → roundDown = 87.5kg

Week 3 - Bench Day:
- Paused Bench @ 90%: 110 × 0.90 = 99→ roundDown = 97.5kg

Week 4 - Ascension Test (Bench):
- AMRAP @ 85%: 110 × 0.85 = 93.5 → roundDown = 92.5kg
- User lifts: 92.5kg × 10 reps
- e1RM = 92.5 × (1 + 10/30) = 92.5 × 1.333 = 123.3kg → roundDown = 122.5kg
- benchPress1RM updated to 122.5kg
```

**Example 2: ME Progression (Weeks 5+)**
```
Week 5 - Bench Day:
- benchPress1RM = 122.5kg (from Week 4 ascension)
- benchMEProgression = 0
- ME @ 95%: 122.5 × 0.95 = 116.375 → roundDown = 115kg
- User completes: [115kg × 3, 117.5kg × 2, 120kg × 1]
- Checkbox: User confirms "+2.5kg" → benchMEProgression = 2.5kg

Week 6 - Bench Day:
- ME calculation: 115kg + 2.5 = 117.5kg
- User completes: [117.5kg × 3, 120kg × 2, 122.5kg × 1]
- New 1RM detected: 122.5kg (no change from before)
- Checkbox: User confirms "+2.5kg" → benchMEProgression = 5kg

Week 7 - Bench Day:
- ME calculation: 115kg + 5 = 120kg
- User completes: [120kg × 3, 122.5kg × 2, 125kg × 1 (failed)]
- New 1RM detected: 122.5kg
- No checkbox (failed top single) → benchMEProgression stays at 5kg

Week 8 (Deload check):
- Light work @ 70%: 122.5 × 0.70 = 85.75 → roundDown = 85kg
- Recovery session focuses on form
```

**Example 3: Complete Program Arc**
```
Starting 1RMs: Bench 100kg, Squat 140kg, Deadlift 170kg

Week 4 Ascension Results:
- Bench: 85kg × 12 reps → e1RM = 119kg
- Squat: 119kg × 10 reps → e1RM = 158.5kg → 157.5kg
- Deadlift: 144.5kg × 9 reps → e1RM = 188kg → 187.5kg

Week 5-12 ME Progressions:
- Bench: +2.5kg × 6 weeks = 15kg accumulated
- Squat: +2.5kg × 5 weeks = 12.5kg (one bad week)
- Deadlift: +5kg × 4 weeks = 20kg (aggressive progression)

Week 12 Ascension Results:
- Bench: (119 × 0.95) + 15 = 128kg, user lifts 128kg × 8 → e1RM = 162.5kg
- Squat: (157.5 × 0.95) + 12.5 = 162kg, user lifts 162kg × 7 → e1RM = 200kg
- Deadlift: (187.5 × 0.95) + 20 = 198kg, user lifts 198kg × 6 → e1RM = 237.5kg

Weeks 13-16 Peaking:
- Same ME singles progression continues
- Final 1RMs expected: Bench ~170kg, Squat ~210kg, Deadlift ~250kg
```

---

## Summary Table: Weight Calculation by Program

| Program | Primary Method | Rounding | Auto-Progress | User Input |
|---------|---------------|----------|---------------|------------|
| **Bench Domination** | Base + % with e1RM recalc | Nearest/Up/Down 2.5kg | ✓ AMRAP thresholds | - |
| **Peachy** | Static % (Paused Squat dynamic) | Down 2.5kg | - | ✓ Manual |
| **Pencilneck** | User-driven | - | - | ✓ Full control |
| **Skeleton** | User-driven | - | - | ✓ Full control |
| **Pain & Glory** | Multi-system hybrid | Down 2.5kg | ✓ RPE/E2MOM | Partial |
| **Trinary** | Block × 1RM | Down 2.5kg | ✓ ME singles | - |
| **Ritual** | Phase % + ME bonus | Down 2.5kg | ✓ Checkboxes | - |

---

*Weight calculation documentation generated from source code – January 16, 2026*

### Pencilneck Exercise Swaps

| Original Exercise | Alternative | Sets | Reps | Notes |
|-------------------|-------------|------|------|-------|
| Front Squats | Stiletto Squats | 3 | 10-15 | Full ROM vs. ATG focus |

### Pencilneck Tip System

The Pencilneck program features extensive exercise guidance through the tip system:

**Implementation:**
- Tips defined in `src/contexts/translations.ts`
- Mapped to exercises in `WorkoutView.tsx` tipMap
- Displayed as yellow alert boxes with 💡 icon
- Multiple tips can stack (exercise notes + global tips)

**Coverage:**
- All major compound movements (bench press, rows, squats)
- Isolation exercises (curls, extensions, raises)
- Technique-specific cues (tempo, ROM, positioning)
- Equipment alternatives and variations


### `src/data/skeleton.ts`
*   **Forced Progression:** `getExerciseAdvice` checks previous logs to trigger specific messages (e.g., "Try to beat X reps" for push-ups).
*   **Dynamic Volume:** `preprocessDay` checks `w >= 9` to increment set counts dynamically.

---

## 🔥 Intensity Technique Display Pattern

**New Feature:** Exercises can now specify `intensityTechnique` field to display prominent, flashy messages.

### Implementation Pattern

1. **Data Layer (`Exercise` type)**:
   ```typescript
   intensityTechnique?: string; // e.g., "LAST SET: Drop Set or Rest-Pause to Failure"
   ```

2. **Set in `preprocessDay` hooks**:
   ```typescript
   // Example from pencilneck.ts
   if (shouldApplyIntensity) {
       return { ...ex, intensityTechnique: "LAST SET: Drop Set or Rest-Pause to Failure" };
   }
   ```

3. **UI Display (`WorkoutView.tsx`)**:
   - Rendered as an orange/red gradient banner with lightning bolt icons
   - Appears **after sets grid, before notes section**
   - Uses `animate-pulse` for attention-grabbing effect
   - Upper-case, bold text with high contrast

### Current Usage

**Pencilneck Eradication:**
- **Cycle 1, Weeks 7-8**: Compounds only
- **Cycle 2+, All Weeks**: All compounds

**Peachy Glute Plan:**
- **Weeks 9-12**: Front-Foot Elevated Bulgarian Split Squat & Deficit Reverse Lunge
- Message: "LAST SET: Drop to Bodyweight - Go to Failure"

### Future Plans
All programs can adopt this pattern by:
1. Adding `intensityTechnique` to exercises in `preprocessDay`
2. No UI changes needed - automatic display

---

## 🔄 Exercise Swap System

**Feature:** Exercises can be swapped for alternatives that suit user preferences or equipment availability.

### Implementation Pattern

1. **Data Layer (`Exercise` type)**:
   ```typescript
   alternates?: string[]; // e.g., ["Power Hanging Leg Raises"]
   ```

2. **Set in data files or `preprocessDay` hooks**:
   ```typescript
   // Example from program.ts
   { name: "Around-the-Worlds", alternates: ["Power Hanging Leg Raises"] }
   ```

3. **User Preferences**:
   - Stored in `user.exercisePreferences` as key-value pairs
   - Keys: `'y-raise-variant'`, `'around-worlds-variant'`, `'nordic-variant'`

4. **Swap Handling (`WorkoutView.tsx` and `program.ts`)**:
   - `handleSwap()` saves preference to Firestore
   - `preprocessDay` hook checks preference and returns swapped exercise

### Current Swaps (Bench Domination)

| Original Exercise | Alternative | Sets | Reps |
|-------------------|-------------|------|------|
| Y-Raises | High-Elbow Facepulls | 3 | 15-20 |
| Around-the-Worlds | Power Hanging Leg Raises | 3 | 10-15 |
| Nordic Curls | Glute-Ham Raise | 3 | Failure |

### Tips for Swapped Exercises
- **Power Hanging Leg Raises**: "Explosive movement – knees to chest fast, slow eccentric (3-5 sec), full stretch at bottom. Build power and core strength."
- **Glute-Ham Raise**: "Control the eccentric, explode up. Use assistance if needed for full ROM."
- **Nordic/Glute-Ham Swap Tip (Both)**: "If the original exercise is too hard, swap to the alternative for better progression and safety."

---

## ⏱️ EMOM Features (Weighted Pull-ups)

**Feature:** Enhanced Every-Minute-On-the-Minute tracking for Weighted Pull-ups in Bench Domination.

### Features

1. **Live Total Rep Counter**
   - Real-time tracking of total reps across all EMOM sets
   - Displays: "Total reps: X"

2. **15-Set Cap**
   - Stops auto-generating new set fields after 15 sets
   - Represents ~15 minutes of EMOM work

3. **Completion Message**
   - When 15 sets are completed:
   - "EMOM Complete – 15 sets reached! Total reps: X"

### Implementation
- **Set Cap Logic**: `handleSetChange()` in `WorkoutView.tsx` checks `currentSets.length < MAX_EMOM_SETS`
- **Rep Counter UI**: Rendered after intensity techniques block, before notes section
- **Styling**: Primary color theme, prominent display

---

## 🌍 Internationalization (i18n) System

**Status:** Infrastructure complete, ready for multi-language support

### Architecture

The i18n system centralizes all user-facing text in `src/contexts/translations.ts` with utility functions for easy access.

### Translation Files

**`src/contexts/translations.ts`** (~400+ strings organized by feature):
- `common` - Shared UI (Back, Next, Save, kg, reps, etc.)
- `entry` - Entry page text
- `onboarding` - All program descriptions, module info, preferences
- `dashboard` - Dashboard widgets, completion modals, quotes
- `workout` - Workout view labels
- `settings` - Settings page text
- `history` - History page text
- `alerts` - All error/success messages
- `exercises` - Exercise names
- `tips` - All exercise tips (85+ exercises)
- `quotes` - Program-specific quotes (28+ quotes)

**`src/contexts/useTranslation.ts`** - Translation utilities:
```typescript
import { t, tArray, tObject } from './useTranslation';

// Simple string translation
t('common.save')  // => "Save"

// With placeholder replacement
t('dashboard.nExercises', { count: 5 })  // => "5 Exercises"

// Array translations
tArray('dashboard.commandments.list')  // => ["300-500 kcal...", ...]

// Object translations
tObject('onboarding.programs.benchDomination')  // => { name, description, features }
```

### Adding New Language

1. Duplicate the `en` object in `translations.ts`
2. Translate all strings
3. Add language selector in Settings

### References
- Full audit: `TRANSLATION_AUDIT.md`
- Usage examples in each translation section
- Helper types for type-safe key access

### Language Switcher Component

**Status:** Implemented and functional (EN/PL)

**Location:**
- Entry page: Top-right corner (absolute positioned)
- Protected pages: Sidebar bottom, below Logout button

**Implementation:**
```tsx
import { LanguageSwitcher } from './components/LanguageSwitcher';

// Usage
<LanguageSwitcher size="md" />  // Entry page
<LanguageSwitcher size="sm" />  // Sidebar
```

**Features:**
- Flag-based UI (EN/PL flags from `/public`)
- Active language highlighted with primary border + shadow
- Persists selection to localStorage (`language` key)
- Reactive state via React Context (LanguageProvider)
- Smooth hover animations (scale 1.1x)
- English fallback for missing Polish translations

**Files:**
- `src/components/LanguageSwitcher.tsx` - Flag button component
- `src/contexts/useTranslation.tsx` - Context provider with t(), tArray(), tObject()
- `src/App.tsx` - Wrapped with LanguageProvider
- `src/pages/Entry.tsx` - Switcher in top-right
- `src/components/ProtectedLayout.tsx` - Switcher in sidebar
-   `src/components/LanguageSwitcher.tsx` - Flag button component
-   `src/contexts/useTranslation.tsx` - Context provider with t(), tArray(), tObject()
-   `src/App.tsx` - Wrapped with LanguageProvider
-   `src/pages/Entry.tsx` - Switcher in top-right
-   `src/components/ProtectedLayout.tsx` - Switcher in sidebar
-   `public/eng.png` - English flag icon
-   `public/pl.png` - Polish flag icon

**Current Status:**
- ✅ Infrastructure complete
- ✅ English translations (~500+ strings)
- ✅ Polish translations complete (~500+ strings)
- ✅ Exercise tips translated (85+ exercises)
- ✅ Badge descriptions translated (18 badges)
- ✅ Switcher UI visible on all pages
- ✅ State persists across sessions

**Translation Reference:**
- Master document: `TRANSLATIONS.md` (all EN→PL mappings)
- Contains: Common UI, Sidebar, Workout View, Day Names, Onboarding, Dashboard, Program Descriptions, Exercise Tips, Badges

---

## 💡 Tip System

**Architecture:** Centralized in `translations.ts`, mapped in `WorkoutView.tsx`

### Implementation

**Previous System (Deprecated):**
- Tips stored in two places causing duplicates:
  1. Hardcoded `notes` field on exercises
  2. `tips` object in translations.ts

**Current System:**
- ALL tips in `src/contexts/translations.ts` only
- Mapped to exercises via `tipMap` in `WorkoutView.tsx`
- 85+ exercise mappings with program-specific logic

**Display Logic:**
```typescript
// In WorkoutView.tsx
const tipMap: Record<string, keyof typeof translations.en.tips> = {
    "Hack Squat": "hackSquat",
    "Deficit Push-ups": programData.id === 'skeleton-to-threat' 
        ? "deficitPushupsSkeleton" 
        : "deficitPushups",
    // Multiple tips can apply to same exercise based on context
};
```

**Features:**
- Program-specific tips (different tip for same exercise)
- Week-based variations (e.g., week 11 intensity tips)
- No duplicates - single source of truth

**Files Modified (Dec 26, 2025):**
- Removed all hardcoded `notes` from:
  - `src/data/pencilneck.ts` (15 exercises)
  - `src/data/peachy.ts` (23 exercises)
  - `src/data/skeleton.ts` (6 exercises)
- Expanded `tipMap` in `WorkoutView.tsx` to 85+ mappings
- Organized tips by program in `translations.ts`

**Note:** Dynamic notes in `program.ts` (Bench Domination) are intentionally kept as they vary by week/phase.

---

## Changelog

### January 12, 2026 – **Trinary Feature Update**
- **Manual 1RM Overrides**: Added Settings card to manually update Bench/Squat/Deadlift 1RMs.
- **Variation Exclusion**: Added Settings section to exclude specific lift variations (e.g. bad equipment).
- **Variation Swap Modal**: Users can now review and swap auto-selected variations during block transitions.

### January 12, 2026 – **NEW PROGRAM: Trinary (Conjugate Periodization)**
- **Trinary Program Added**: Complete conjugate periodization powerlifting program
  - 27 workouts structured into 9 blocks (3 workouts per block)
  - ME/DE/RE (Max Effort/Dynamic Effort/Repeated Effort) rotation across Bench/Deadlift/Squat
  - Phased progression: Build Base (Blocks 1-3) → Intensify (Blocks 4-6) → Peak (Blocks 7-9)
- **Weak Point System**: Exercise variations selected based on user-identified weak points
  - Bench: Off-chest / Mid-range / Lockout
  - Deadlift: Lift-off / Over-knees / Lockout
  - Squat: Bottom / Mid-range / Lockout
- **Accessory Day Trigger**: Automatically triggered when >4 workouts in rolling 7-day period
- **Weight Calculation**: Block-specific percentages × Variation-specific percentages
- **Theme**: Heavy metal inspired dark zinc/slate color palette
- **Dashboard Widgets**: Schedule Tip, Workout Progress, Next Workout button
- **Full EN/PL Translations**: Complete translations for all UI elements
- **Affected Files**: `trinary.ts`, `types.ts`, `plans.ts`, `Onboarding.tsx`, `Dashboard.tsx`, `translations.ts`

### January 12, 2026 – **MAJOR: Paused Bench Press Calculation Overhaul**
- **COMPLETE OVERHAUL**: Paused Bench Press weight calculation system has been completely rebuilt
- **NEW: e1RM Recalculation Every 4 Weeks**
  - End of Week 4, Week 8, Week 12: Calculate estimated 1RM from latest Saturday AMRAP
  - Formula: Epley `e1RM = weight × (1 + reps/30)`
  - New base = e1RM rounded DOWN to nearest 2.5 kg
  - Console logging: `"e1RM updated from AMRAP: X kg. Base reset for next block."`
- **NEW: Safe Rounding Rules (Working Weights)**
  - All working weights now round to nearest 2.5 kg with **upward cap safety**
  - Never rounds up more than +2.5 kg above raw calculated value
  - Examples: raw 134.375 → 135 ✓ (up +0.625), raw 135.1 → 135 ✓ (down)
- **REMOVED: Old Onboarding Jump System**
  - No more direct weight jumps from onboarding values
  - All progress now driven exclusively by AMRAP and phased thresholds
  - Explicit note in PLAN.md: "Old onboarding jump system removed"
- **AMRAP Progression Unchanged**
  - Weeks 1-6: ≥12 reps = +2.5 kg
  - Weeks 7-9: ≥10 reps = +2.5 kg
  - Weeks 10-12: ≥8 reps = +2.5 kg
  - Peaking Weeks 13-15: ≥6 reps = +2.5 kg
- **Peaking Block (Weeks 13-15)**: Uses final Week 12 e1RM recalculation as base
- **Reactive Deload Unchanged**: 2 consecutive ≤7 reps → -15% weight + half volume
- **Backward Compatible**: Existing users get new logic forward (no retroactive weight changes)
- **Helper Functions Added**: `roundToNearest2_5WithCap()`, `roundDownToNearest2_5()`, `calculateE1RM()`
- **PLAN.md Regenerated**: Complete documentation of new system with tables and examples
- **Affected Files**: `program.ts`, `PLAN.md`
- **Backup Created**: `backups/PLAN_2026-01-12_e1rm-overhaul_6f8a510.md`
- **Doc Update**: Updated `PLAN.md` with complete list of badges from `src/data/badges.ts` to match current app state.

### January 11, 2026
- **NEW PROGRAM: Pain & Glory** (16-Week Intermediate Deadlift Specialization)
  - Complete 16-week program with 3 phases: Accumulation (W1-8), E2MOM Transition (W9-12), Peaking (W13-16)
  - **Pull Days:** Deficit Snatch Grip Deadlift 10×6 @ 45% with RPE feedback modal (+5kg/-5kg/same)
  - **Push Days:** Paused Low Bar Squat with limited progression (W1-8 only, then fixed weight)
  - **E2MOM Phase (W9-12):** Conventional Deadlift 6 sets every 2 min, auto +2.5kg on success
  - **Peaking Phase:** AMRAP test (W13) → Epley e1RM → Triple (W14) → Double (W15) → Single (W16)
  - Themed onboarding with sand background, blood-red accents
  - Full EN/PL translations (25+ exercise tips each)
  - **Affected Files**: `painglory.ts`, `Onboarding.tsx`, `translations.ts`, `types.ts`, `plans.ts`

- **BUG FIX: AMRAP Weight Progression Calculation**
  - **Issue**: Week 5 weights increased by +5kg on Monday/Wednesday instead of +2.5kg after qualifying AMRAP.
  - **Fix**: Calculate progressed base first, then apply percentage in `calculateWeight`.
  
- **BUG FIX: EMOM Logic Missing (Weeks 4+)**
  - Implemented week-specific Weighted Pull-ups behavior:
    - Weeks 1-6: 1 set growing dynamically via EMOM (max 15 sets)
    - Weeks 4-6: Fixed-weight EMOM (same weight auto-fills all sets)
    - Weeks 7-9: 7 sets (1 max triple + 6 back-offs at 87.5%)
    - Weeks 10-12: 5 sets at 92.5%
  - Live total rep counter and 15-set cap working
  - **Affected Code**: `WorkoutView.tsx` - `initializeEmptyState` and `handleSetChange`

- **BUG FIX: Around-the-Worlds Rep Range**
  - Changed from 12-15 to **10-16** reps
  - **Affected Code**: `program.ts` line 267

- **BUG FIX: Thursday Paused Bench "Increase Weight" Message**
  - Added "Paused Bench Press" to `autoProgressExercises` skip list
  - Prevents spurious "Increase Weight!" message on exercises with built-in progression
  - **Affected Code**: `program.ts` - `getExerciseAdvice` (line ~1018)

- **BUG FIX: Rest Day Translation Keys Missing**
  - Added `tuesdayRest` and `fridayRest` to both EN and PL `dayNames` sections
  - **Affected Code**: `translations.ts`

### January 02, 2026
- **Thursday Tricep Swap Option**: New customization for Thursday Power/Speed day
  - Default: Tricep Giant Set (Dips / Extensions / Skullcrushers)
  - Alternative: Heavy Rolling Tricep Extensions (4×4-6 reps)
    - Progression: Hit 6 reps on all 4 sets → +2.5 kg next Thursday
    - Message displays: "Heavy tricep option selected – focusing on lockout strength"
  - **UI Location**: Settings → Program Modules → Radio group for selection
  - Module setting: `thursdayTricepVariant` ('giant-set' | 'heavy-extensions')
- **Low Pin Press Set Swap**: Optional redistribution of sets for lockout emphasis
  - Swap button available on Low Pin Press exercise card (pulsating hint button)
  - Effect: Moves 1 set from Paused Bench Press (5→4) to Low Pin Press (2→3) on Thursday
  - Button text: "Trouble with lockout? Click to swap 1 set of Paused Bench to Pin Press"
  - **UI Location**: Settings → Program Modules → Toggle "Low Pin Press Extra Set"
  - Module setting: `lowPinPressExtraSet` (boolean)
  - Description: "Move 1 set from Paused Bench (5→4) to Low Pin Press (2→3) on Thursday for extra lockout focus"
  - Persistent toggle (user can revert anytime)
- **Polish Translations Added**:
  - "Heavy Rolling Tricep Extensions" → "Heavy Rolling Tricep Extensions"
  - "Trouble with lockout? Click to swap 1 set of Paused Bench to Pin Press" → "Problemy z lockoutem? Kliknij, aby zamienić 1 serię Paused Bench na Pin Press"
  - "Heavy tricep option selected – focusing on lockout strength" → "Wybrano ciężką opcję na triceps – skupienie na sile lockoutu"
- **Documentation**: PLAN.md updated with new swap options, UI locations, and progression logic
- **Deployment**: All changes deployed to https://workout-planner-b5bd6.web.app

### December 28, 2025
- **AMRAP Progression Phased Thresholds**: Bench Domination now uses gradual threshold lowering
  - Weeks 1-6: ≥12 reps = +2.5 kg
  - Weeks 7-9: ≥10 reps = +2.5 kg
  - Weeks 10-12: ≥8 reps = +2.5 kg
  - Peaking Weeks 13-15: ≥6 reps = +2.5 kg
- **Variation Progression Rules Updated**:
  - Fixed-rep targets (Spoto Press, Low Pin Press): Hit target on ALL sets = +2.5 kg next session
  - Rep ranges (Wide-Grip Bench): Hit top reps on ALL sets for 2 consecutive weeks = +2.5 kg
- **Exercise Tips Enhanced**: All variation cards now display their specific progression rules
- **Sustainable Progression Note**: "No large jumps, no microplates" philosophy documented

### December 27, 2025
- **Polish Translations Complete**: All 500+ strings translated to Polish
  - Dashboard headers updated (Peachy, Pencilneck, Skeleton program-specific)
  - Exercise tips translated (85+ exercises with improved form cues)
  - Badge descriptions updated (18 badges)
  - Program names updated to use English names where appropriate
  - Master reference document: `TRANSLATIONS.md`

---

*Generated from source code – January 12, 2026*
