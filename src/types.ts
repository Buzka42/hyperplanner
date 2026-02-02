export type LiftingStats = {
    pausedBench: number;
    wideGripBench: number;
    wideGripConsecutive?: number; // Track consecutive weeks at top reps for Wide-Grip
    spotoPress: number;
    lowPinPress: number;
    btnPress?: number; // Behind-the-Neck Press 1RM (snapshot) or Working Weight
    btnPressWeek?: number; // Week number when btnPress was last updated
    squat?: number;
    // Pain & Glory stats
    conventionalDeadlift?: number;
    lowBarSquat?: number;
};

export type BenchDominationModules = {
    tricepGiantSet: boolean;
    behindNeckPress: boolean;
    weightedPullups: boolean;
    accessories: boolean;
    legDays: boolean; // Toggle for Tuesday/Friday leg sessions
    thursdayTricepVariant?: 'giant-set' | 'heavy-extensions'; // Thursday tricep exercise option
    lowPinPressExtraSet?: boolean; // Toggle to swap 1 set from Paused Bench to Low Pin Press
};

export type BenchDominationStatus = {
    completedWeeks: number;
    post12WeekChoice?: 'test' | 'peak';
    phase?: 'training' | 'preattempt' | 'peaking' | 'test';
    // Deload week tracking (added weeks, not replaced)
    addedDeloadWeeks?: { insertAfterWeek: number; type: 'forced' | 'reactive' | 'drop-recalc' }[];
    forcedDeloadCompleted?: boolean; // Tracks if forced week-8 deload happened
    lastReactiveCheckWeek?: number; // Tracks last week we checked reactive deload
    week5BaseBeforeRecalc?: number; // Base weight before week 5 e1RM recalc (for >15% drop check)
};

export type PencilneckStatus = {
    cycle: number;
    startDate: string;
    completed?: boolean;
    completionDate?: string;
};

export type PainGloryStatus = {
    deficitSnatchGripWeight?: number; // Current working weight for Deficit Snatch Grip
    deficitSnatchGripHistory?: { date: string; week: number; weight: number; feeling: 'more' | 'same' | 'wrecked' }[];
    squatProgress?: number; // Accumulated +2.5kg progression for squat
    week8SquatWeight?: number; // Final squat weight from week 8 for maintenance
    e2momWeightAdjustment?: number; // Accumulated adjustment for E2MOM weeks
    amrapWeight?: number; // Week 13 AMRAP weight
    amrapReps?: number; // Week 13 AMRAP reps achieved
    estimatedE1RM?: number; // Calculated via Epley formula
};

export type TrinaryStatus = {
    completedWorkouts: number;
    currentBlock: number;
    bench1RM: number;
    deadlift1RM: number;
    squat1RM: number;
    benchWeakPoint?: 'off-chest' | 'mid-range' | 'lockout';
    deadliftWeakPoint?: 'lift-off' | 'over-knees' | 'lockout';
    squatWeakPoint?: 'bottom' | 'mid-range' | 'lockout';
    benchVariation?: string;
    deadliftVariation?: string;
    squatVariation?: string;
    benchVariationHistory?: string[]; // Track used variations to rotate
    deadliftVariationHistory?: string[];
    squatVariationHistory?: string[];
    workoutLog: { date: string; workoutNumber: number }[];
    cycleNumber: number;
    isDeload?: boolean;
    meProgressionPending?: { lift: 'bench' | 'deadlift' | 'squat'; amount: number }[]; // +5kg pending for next ME
    reProgressionPending?: { lift: 'bench' | 'deadlift' | 'squat'; amount: number }[]; // +2.5kg pending for next RE
    excludedVariations?: string[];
    // User preference for accessory days
    preferredAccessoryType?: 'upper' | 'lower' | null;
    accessoryDaysCompleted?: number;
    skipNextAccessory?: boolean;
};

export type SuperMutantStatus = {
    completedWorkouts: number;
    muscleGroupTimestamps: {
        chest?: number;
        shoulders?: number;
        triceps?: number;
        upperBack?: number;
        biceps?: number;
        calves?: number;
        hamstrings?: number;
        glutes?: number;
        lowerBack?: number;
        quads?: number;
        abductors?: number;
        abs?: number;
    };
    rolling7DayVolume: {
        chest: number;
        shoulders: number;
        triceps: number;
        upperBack: number;
        biceps: number;
        calves: number;
        hamstrings: number;
        glutes: number;
        lowerBack: number;
        quads: number;
        abductors: number;
        abs: number;
    };
    // Alternation tracking
    chestVariant: 'A' | 'B';
    backVariant: 'A' | 'B';
    // Weak point tracking
    lastWeakPointCheck?: number; // workout number
    weakPointMuscle?: string;
    // Mutation reminders
    lastMutationReminder?: number; // workout number
    // Initial 1RMs
    bench1RM: number;
    deadlift1RM: number;
    squat1RM: number;
    // Exercise preferences
    quadExercise: 'Hack Squat' | 'Front Squat';
    hamstringExercise: 'Good Mornings' | 'Deficit RDLs';
    // Weekly session tracking for cap
    weeklySessionDates?: string[]; // Last 7 days of session dates
};

export type BadgeId =
    | 'certified_threat'
    | 'certified_boulder'
    | 'perfect_attendance'
    | 'bench_psychopath'
    | 'bench_jump_20kg'
    | 'bench_jump_30kg'
    | 'deload_denier'
    | 'rear_delt_reaper'
    | '3d_delts'
    | 'cannonball_delts'
    | 'first_blood'
    | '100_sessions'
    | 'immortal'
    | 'final_boss'
    | 'peachy_perfection'
    | 'squat_30kg'
    | 'glute_gainz_queen'
    | 'kas_glute_bridge_100'
    | 'void_gazer'
    | 'emom_executioner'
    | 'glory_achieved'
    | 'deficit_demon'
    | 'single_supreme'
    | '50_tonne_club'
    | 'initiate_of_iron'
    | 'disciple_of_pain'
    | 'acolyte_of_strength'
    | 'high_priest_of_power'
    | 'eternal_worshipper'
    | 'super_mutant_aspirant'
    | 'behemoth_of_wastes';

export type Badge = {
    id: BadgeId;
    name: string;
    description: string;
    icon: string; // Lucide icon name or image path
    image?: string;
    earnedDate?: string;
};

export type UserProfile = {
    id: string; // Codeword or Auth UID
    codeword: string;
    stats: LiftingStats;
    startDate: string; // ISO date
    programId: string;
    completedSessions: number;
    lastAmrapDate?: string;
    benchHistory: { date: string; week?: number; weight: number; actualWeight?: number; actualReps?: number }[];
    squatHistory?: { date: string; week?: number; weight: number; actualWeight?: number; actualReps?: number }[];
    selectedDays?: number[]; // [1, 2, 4, 5] for Mon,Tue,Thu,Fri
    exercisePreferences?: Record<string, string>; // "legPrimary": "Hack Squat"
    benchDominationModules?: BenchDominationModules;
    // Status tracking for complex programs
    benchDominationStatus?: {
        post12WeekChoice?: 'peak' | 'test';
        completedWeeks?: number;
    };
    pencilneckStatus?: {
        cycle: number;
        startDate: string;
        completed?: boolean;
        completionDate?: string;
    };
    skeletonStatus?: { completed: boolean; completionDate?: string };
    painGloryStatus?: PainGloryStatus; // Pain & Glory program status
    trinaryStatus?: TrinaryStatus; // Trinary conjugate periodization status
    ritualStatus?: any; // Ritual of Strength status (imported from ritual.ts to avoid circular dependency)
    superMutantStatus?: SuperMutantStatus; // Super Mutant status
    programProgress?: Record<string, { completedSessions: number; startDate: string; }>;

    // New Fields
    badges?: BadgeId[];
    gluteMeasurements?: { date: string; sizeCm: number }[];
    pencilneckBenchHistory?: { date: string; week?: number; weight: number; actualWeight?: number; actualReps?: number }[]; // Separate tracking for Pencilneck
};

export type SetTarget = {
    type: 'straight' | 'amrap' | 'range' | 'failure';
    reps: string; // "3", "6-8", "AMRAP", "Failure"
    percentage?: number; // 0.825 for 82.5%
    percentageRef?: keyof LiftingStats; // "pausedBench"
    weightAbsolute?: number; // If fixed weight
    rpe?: number;
};

export type GiantSetStep = {
    name: string;
    targetReps: string;
    inputPlaceholder?: string;
    editableWeight?: boolean;
};

export type Exercise = {
    id: string;
    name: string;
    sets: number;
    target: SetTarget;
    notes?: string;
    rest?: string;
    giantSetConfig?: {
        steps: GiantSetStep[];
    };
    // New: Warmups configuration
    warmups?: {
        sets: { reps: string; weight: string; completed?: boolean }[];
        note?: string;
    };
    // New: Swappable Alternates
    alternates?: string[];
    // New: Intensity Technique (for flashy display)
    intensityTechnique?: string;
};

export type WorkoutDay = {
    id?: string;
    dayName: string; // "Monday - Heavy Strength"
    dayOfWeek: number; // 1=Mon, 2=Tue...
    exercises: Exercise[];
};

export interface PlanConfig {
    id: string;
    program: Program;
    ui?: {
        dashboardWidgets?: ('1rm' | 'program_status' | 'strength_chart' | 'pencilneck_commandments' | 'trap_barometer' | 'skeleton_countdown' | 'skeleton_pushup_max' | 'skeleton_quotes' | 'glute_tracker' | 'deficit_snatch_tracker' | 'strength_altar' | 'workout_history' | 'mutagen_exposure' | 'recovery_gauge' | 'mutant_mindset')[];
    };
    hooks?: {
        preprocessDay?: (day: WorkoutDay, user: UserProfile) => WorkoutDay;
        getExerciseAdvice?: (exercise: Exercise, history: WorkoutLog[]) => string | null;
        calculateWeight?: (
            target: SetTarget,
            user: UserProfile,
            exerciseName?: string,
            context?: { week: number; day: number }
        ) => string | undefined;
    };
}

export type ProgramWeek = {
    weekNumber: number;
    days: WorkoutDay[];
};

export type Program = {
    id: string;
    name: string;
    weeks: ProgramWeek[];
};

export type SetResult = {
    reps: number;
    weight: number;
    completed: boolean;
};

export type WorkoutLog = {
    id: string; // date_exerciseId
    date: string;
    // Legacy (Single Exercise)
    exerciseId?: string;
    setResults?: SetResult[];

    // Modern (Full Session)
    week?: number;
    day?: number;
    programId?: string;
    dayName?: string;
    exercises?: {
        id: string;
        name: string;
        setsData: {
            reps: string; // Note: Input stores strings, converted to number usually? UserContext used string.
            weight: string;
            completed: boolean;
        }[];
        notes?: string;
    }[];

    notes?: string;
};
