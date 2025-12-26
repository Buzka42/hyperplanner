# Translation Audit - Hardcoded Text Elements

## Overview
This document lists all hardcoded text elements that need to be moved to `translations.ts` for full internationalization support.

## Categories

### 1. ENTRY PAGE (`Entry.tsx`)
- [x] "HYPER" / "PLANNER" - Already in translations
- [x] "Enter your codeword to access your program." - Already in translations
- [x] "Enter Codeword..." (placeholder) - Already in translations
- [x] "ENTER" (button) - Already in translations

### 2. ONBOARDING PAGE (`Onboarding.tsx`)

#### Program Selection Step
- [ ] "Select Your Protocol" (h1)
- [ ] "Choose the path to your transformation." (description)
- [ ] "Bench Domination" (program title)
- [ ] "12-week powerlifting program to explode your bench press. With optional 3 week peaking phase." (description)
- [ ] "Focus: Bench Strength"
- [ ] "12 Week Peaking"
- [ ] "Optional 3 Week Peaking"
- [ ] "Auto-regulating progression and deloads based on AMRAP test"
- [ ] "Pencilneck Eradication" (program title)
- [ ] "8-week upper body hypertrophy split. For those who look like a lollipop." (description)
- [ ] "Focus: Upper Body Mass"
- [ ] "4 Days / Week"
- [ ] "Push / Pull Split"
- [ ] "From Skeleton to Threat" (program title)
- [ ] "12-week beginner program. For those who have never touched a weight."
- [ ] "Focus: Full Body"
- [ ] "3 Days / Week"
- [ ] "Flexible Schedule"
- [ ] "Peachy" (program title)
- [ ] "12-week glute specialization. For those who want a better booty." (description)
- [ ] "Focus: Glutes & Lower" 
- [ ] "4 Days / Week"
- [ ] "Science-Based Glute Programming"

#### Modules Step (Bench Domination)
- [ ] "Build Your Perfect Bench Hell" (CardTitle)
- [ ] "Customize the brutality. The core lift is sacred." (CardDescription)
- [ ] "Core Bench Progression" (module title)
- [ ] "REQUIRED" (badge)
- [ ] "Paused Bench, Variations (Wide/Spoto/Pin), Saturday AMRAP Test." (description)
- [ ] "Tricep Giant Sets"
- [ ] "The secret sauce for lockout strength. Mon & Thu."
- [ ] "Behind-the-Neck Press"
- [ ] "Complete shoulder development & stability. Mon & Thu."
- [ ] "Weighted Pull-ups"
- [ ] "Back strength for bench stability. Wed & Sat."
- [ ] "Leg Days"
- [ ] "Squats, Leg Press, Lunges. Tue & Fri."
- [ ] "Accessories"
- [ ] "Dragon Flags, Y-Raises, Around-the-Worlds."

#### Days Selection Step
- [ ] "Training Schedule" (CardTitle)
- [ ] "Select exactly X training days per week." (CardDescription)
- [ ] Day names: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"

#### Preferences Step
- [ ] "Customize Protocol" (CardTitle)
- [ ] "Choose your preferred movements." (CardDescription)
- [ ] "Push A: Leg Primary" (label)
- [ ] "Hack Squat" (exercise option)
- [ ] "High-Foot Leg Press" (exercise option)
- [ ] "Push B: Chest Isolation" (label)
- [ ] "Pec-Dec" (exercise option)
- [ ] "Low-to-High Cable Flyes" (exercise option)
- [ ] "Push B: Leg Secondary" (label)
- [ ] "Front Squats" (exercise option)
- [ ] "Narrow-Stance Leg Press" (exercise option)
- [ ] "Stiletto Squats" (exercise option)

#### Stats Step (Bench Domination)
- [ ] "Calibration Phase" (CardTitle)
- [ ] "Enter your current lifting stats. These drive all weight calculations." (CardDescription)
- [ ] "Paused Bench Press 1RM (Primary)" (label)
- [ ] "Wide-Grip Bench 1RM (Optional)" (label)
- [ ] "Spoto Press 1RM (Optional)" (label)
- [ ] "Low Pin Press 1RM (Optional)" (label)

#### Navigation Buttons
- [ ] "Back" (button)
- [ ] "Next" (button)
- [ ] "BUILD PROGRAM" (button)
- [ ] "BUILDING..." (button loading state)

#### Alerts
- [ ] "Please select exactly 3 training days."
- [ ] "Please select exactly 4 training days."
- [ ] "Please enter a valid Paused Bench 1RM greater than 0."
- [ ] "Failed to build program: "

### 3. DASHBOARD PAGE (`Dashboard.tsx`)

#### Headers & Titles
- [ ] "Time to" / "Eradicate the" / "Become a" (dynamic header prefix)
- [ ] "Dominate" / "Weakness" / "Threat" (shimmer text)
- [ ] "Welcome back, {codeword}." (greeting)
- [ ] "Feeling Froggy" / "Feeling Peachy" (Peachy program)

#### Completion Modals
- [ ] "You Are Now A Threat" / "ERADICATED" (completion titles)
- [ ] "The Skeleton is dead. Long live the machine." (skeleton completion)
- [ ] "Pencilneck Status: REVOKED. Shoulders: 3D." (pencilneck completion)
- [ ] "CERTIFIED THREAT" / "CERTIFIED BOULDER" (badge labels)
- [ ] "CLAIM VICTORY" (button)
- [ ] "START CYCLE 2 (HEAVIER)" (button)

#### Next Steps Modal
- [ ] "NEXT LEVEL UNLOCKED" (title)
- [ ] "You have completed 'From Skeleton to Threat'..." (description)
- [ ] "You have completed 2 cycles of 'Pencilneck Eradication Protocol'..." (description)
- [ ] "CONTACT TRAINER" (button)
- [ ] "Close" (link)

#### Cycle 2 Banner (Pencilneck)
- [ ] "Cycle X: Heavier. Meaner. Shoulders incoming." (title)
- [ ] "Mandatory intensity techniques engaged. Weights increased. Good luck." (description)

#### Stats Cards
- [ ] "Est. 1RM (From AMRAP)" (CardTitle)
- [ ] "X kg" (stat display)
- [ ] "Calculated max" (description)
- [ ] "Weekly Glute Tracker" (CardTitle)
- [ ] "Current Circumference (cm)" (label)
- [ ] "Log" (button)
- [ ] "Latest Growth Trend" (label)
- [ ] "Program Status" (CardTitle)
- [ ] "Week X" (stat)
- [ ] "Viewing Schedule" (description)
- [ ] "Active Modules" (CardTitle)
- [ ] "Core Bench" (module badge)
- [ ] "Tricep Giant Set" / "BTN Press" / "W. Pull-ups" / "Accessories" (module badges)
- [ ] "Squat Strength Progression" / "Strength Progression" (chart titles)

#### Pencilneck Widgets
- [ ] "Week X Status" (CardTitle)
- [ ] Week status quotes (8 different quotes based on week)
- [ ] "Trap Barometer" (CardTitle)
- [ ] "Pencil" / "Boulder" (progress labels)
- [ ] "X% GONE" (progress text)
- [ ] "Rest Day Thought" (CardTitle)
- [ ] 20+ rest day quotes for Pencilneck

#### Skeleton Widgets
- [ ] "Metamorphosis" (CardTitle)
- [ ] "X weeks left" (countdown)
- [ ] "Until you are no longer a skeleton." (description)
- [ ] "Deficit Push-up PR" (CardTitle)
- [ ] "Perfect Reps (Single Set)" (description)
- [ ] "Your muscles are knitting armor right now." (rest day quote)

#### 5 Commandments Widget
- [ ] "5 Commandments of Growth" (CardTitle)
- [ ] "300–500 kcal surplus mandatory"
- [ ] "Control the eccentric, don't bounce out of the hole"
- [ ] "Always warm up with at least 1 set of 12 at 50% of your working weight"
- [ ] "Train hard, only 1–3 Reps In Reserve (RIR) every set"
- [ ] "Sleep 7+ hours"

#### Crossroads Card (Week 13)
- [ ] "CROSSROADS REACHED" (CardTitle)
- [ ] "You have survived 12 weeks of hell..." (description)
- [ ] "Mandatory Rest Timer" (label)
- [ ] "X DAYS LEFT" (timer)
- [ ] "Do not lift heavy. Sleep. Eat." (tip)
- [ ] "After your rest, how do you want to proceed?" (question)
- [ ] "Option A: The Peak (Recommended)" (button title)
- [ ] "Enter a 3-week peaking block..." (button description)
- [ ] "Option B: Test Now" (button title)
- [ ] "Skip the peaking block and test..." (button description)

#### Week Navigation
- [ ] "Week X" (dropdown options)
- [ ] "MANDATORY DELOAD" (badge for week 13)
- [ ] "PEAKING BLOCK" (badge for weeks 14-15)
- [ ] "X Exercises" (card subtitle)
- [ ] "+ X more" (exercise list overflow)

### 4. WORKOUT VIEW (`WorkoutView.tsx`)

#### Headers
- [ ] Day names are dynamic from program data

#### Exercise Cards
- [ ] "Completed" (badge)
- [ ] "last: X kg" (previous weight display)
- [ ] "Tip:" (label before tips)
- [ ] "X sets" / "X giant sets" (set count)
- [ ] "Target: X reps" (target display)
- [ ] "Increase Weight!" (advice)
- [ ] "SET" / "KG" / "REPS" (table headers)
- [ ] "Notes..." (placeholder)

#### Buttons & Actions
- [ ] "COMPLETE WORKOUT" (button)
- [ ] "SAVING..." (button loading)
- [ ] "Error saving workout. Please try again." (alert)

### 5. SETTINGS PAGE (`Settings.tsx`)

#### Page Header
- [ ] "Settings" (h2)
- [ ] "Manage your program preferences." (description)

#### Exercise Preferences Card (Pencilneck)
- [ ] "Exercise Preferences" (CardTitle)
- [ ] "Customize your 'OR' exercise selections..." (CardDescription)
- [ ] "Push A: Leg Primary" (label)
- [ ] "Push B: Chest Isolation" (label)
- [ ] "Push B: Leg Secondary" (label)
- [ ] Exercise option labels (same as Onboarding)

#### Program Modules Card (Bench Domination)
- [ ] "Program Modules" (CardTitle)
- [ ] "Enable or disable optional components..." (CardDescription)
- [ ] Module toggles (same as Onboarding)

#### Manual 1RM Override Card
- [ ] "Manual 1RM Override" (CardTitle)
- [ ] "Manually adjust your Paused Bench Press 1RM." (CardDescription)
- [ ] Warning text about artificial inflation
- [ ] "Paused Bench Press 1RM (kg)" (label)
- [ ] "Current calculated max" (helper text)

#### Program Management Card
- [ ] "Program Settings" (CardTitle for non-specific programs)
- [ ] "This program has no configurable settings."
- [ ] "Program Management" (CardTitle)
- [ ] "Manage your active program and progress data." (CardDescription)
- [ ] "Switch Program" (title)
- [ ] "Keep your current progress and start a different protocol." (description)
- [ ] "Switch Program" (button)
- [ ] "Reset Current Progress" (title)
- [ ] "Reset your sessions to Week 1 Day 1. Stats and history are preserved." (description)
- [ ] "Reset Progress" (button)
- [ ] "Progress reset properly." (alert)

#### Footer Buttons
- [ ] "Saved" / "Save Changes" (button states)
- [ ] "Export Data Backup" (button)

### 6. HISTORY PAGE (`History.tsx`)

- [ ] "Workout History" (h2)
- [ ] "Loading logs..." (loading text)
- [ ] "No workouts logged yet" (empty state title)
- [ ] "Get in there and crush some steel." (empty state description)
- [ ] "Week X Day Y" (fallback day name)
- [ ] "Xkg" / "x X" (weight/reps display)

### 7. ADMIN PANEL (`AdminPanel.tsx`)

- [ ] "ACCESS DENIED" (alert)
- [ ] "Failed to delete user." (alert)
- [ ] "User updated successfully." (alert)
- [ ] "Update failed." (alert)
- [ ] "ADMIN CONTROL PANEL" (CardTitle)
- [ ] "THE OVERSEER" (h1)
- [ ] "Enter Codeword..." (placeholder)

### 8. DATA FILES (Keep as-is or translate)

#### Day Names (in program data)
Program day names like "Monday - Heavy Strength" are in program data. These should either:
- Be kept as English identifiers and translated via a mapping
- Be stored as translation keys

#### Badge Names (`badges.ts`)
- Badge names and descriptions

### 9. DATE/TIME FORMATTING
Date formatting uses `date-fns` `format()` - consider using locale-aware formatting.

---

## Priority Order for Translation

### HIGH PRIORITY (User-facing, frequent use)
1. Dashboard page text (most viewed)
2. Workout View text (used every session)
3. Onboarding text (first impression)
4. Entry page (already done)

### MEDIUM PRIORITY
5. Settings page text
6. History page text

### LOW PRIORITY
7. Admin panel text (internal use only)
8. Error messages and alerts
9. Program-specific quotes/jokes (may want to keep English for flavor)

---

## Technical Notes

### Current translations.ts structure:
```typescript
translations = {
    en: {
        entry: { ... },
        onboarding: { ... },
        dashboard: { ... },
        workout: { ... },
        days: { ... },
        exercises: { ... },
        tips: { ... }
    }
}
```

### Recommended new sections:
```typescript
translations = {
    en: {
        // existing...
        common: {
            back: "Back",
            next: "Next",
            save: "Save",
            cancel: "Cancel",
            loading: "Loading...",
            close: "Close",
            // etc.
        },
        programs: {
            benchDomination: { name: "Bench Domination", description: "..." },
            pencilneck: { name: "Pencilneck Eradication", description: "..." },
            skeleton: { name: "From Skeleton to Threat", description: "..." },
            peachy: { name: "Peachy", description: "..." }
        },
        settings: { ... },
        history: { ... },
        alerts: {
            errorSaving: "Error saving workout. Please try again.",
            selectDays: "Please select exactly {count} training days.",
            // etc.
        },
        quotes: {
            pencilneckStatus: [...],
            pencilneckRestDay: [...],
            skeletonQuotes: [...]
        }
    }
}
```

---

## Estimated Effort

- **Total unique text strings**: ~200+
- **Time to create translations.ts structure**: 2-3 hours
- **Time to update all components**: 4-6 hours
- **Testing**: 2-3 hours

Total: ~8-12 hours of work for full internationalization.
