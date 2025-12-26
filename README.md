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

### 4. **Workout Execution (`src/pages/WorkoutView.tsx`)**
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

## 📂 Implementation Details by File

### `src/data/program.ts` (Bench Domination)
*   **Smart Scheduling:** Logic inside `preprocessDay` analyzes `user.selectedDays` to map "Heavy" workouts to isolated days and "Volume" to consecutive blocks.
*   **Reactive Deload:** Checks if last 2 consecutive AMRAPs were ≤ 8 reps. If so, effectively rewrites the current week's sets/reps in the hook.
*   **Peaking Block:** `createWeeks` function generates different content for W13-15.
*   **Main Progression:** ≥12 reps on Saturday AMRAP = +2.5kg, 9-11 reps = stall, <9 reps = stall. No microplates (no fractional increases).
*   **Variation Progression:** Wide-Grip Bench (2 consecutive Mondays max reps = +2.5kg). Spoto/Low Pin Press (Immediate max reps = +2.5kg). Elite warmups added.

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
*Generated from source code – December 20, 2025*
