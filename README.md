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
*   **Weight Calculation Methodology (`calculateWeight` hook):**
    ```
    1. Count qualifying AMRAPs before current week (progressionCount)
    2. Calculate progressed base: pausedBench + (progressionCount × 2.5)
    3. Apply workout-specific percentage to progressed base
    4. Round to nearest 2.5 kg
    ```
    **Important:** The progression (+2.5 kg per qualifying week) is applied to the BASE first, THEN the percentage is applied. This ensures consistent +2.5 kg increases across all days regardless of their different percentages (Monday 85%, Wednesday 75%, etc.).
*   **Variation Progression:**
    *   **Fixed-Rep Targets (Spoto Press 5 reps, Low Pin Press 4 reps):** Hit exact target on ALL sets = +2.5 kg next session. Message: *"Target reps hit – weight auto-increased +2.5 kg next time"*
    *   **Rep Ranges (Wide-Grip Bench 6-8 reps):** Hit top reps (8) on ALL sets for 2 consecutive weeks = +2.5 kg. Message: *"Hit top reps on all sets for 2 straight weeks → +2.5 kg"*
*   **Elite Warmups:** Added for main bench lifts.

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

### January 11, 2026
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

*Generated from source code – January 11, 2026*
