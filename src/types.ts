export type LiftingStats = {
    pausedBench: number;
    wideGripBench: number;
    spotoPress: number;
    lowPinPress: number;
    btnPress?: number; // Behind-the-Neck Press 1RM (snapshot) or Working Weight
    squat?: number;
};

export type BenchDominationModules = {
    tricepGiantSet: boolean;
    behindNeckPress: boolean;
    weightedPullups: boolean;
    accessories: boolean;
    legDays: boolean; // Toggle for Tuesday/Friday leg sessions
};

export type BenchDominationStatus = {
    completedWeeks: number;
    post12WeekChoice?: 'test' | 'peak';
    phase?: 'training' | 'preattempt' | 'peaking' | 'test';
};

export type PencilneckStatus = {
    cycle: number;
    startDate: string;
    completed?: boolean;
    completionDate?: string;
};

export type BadgeId =
    | 'certified_threat'
    | 'certified_boulder'
    | 'perfect_attendance'
    | 'bench_psychopath'
    | 'bench_jump_50'
    | 'bench_jump_100'
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
    | 'kas_glute_bridge_100';

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
    programProgress?: Record<string, { completedSessions: number; startDate: string; }>;

    // New Fields
    badges?: BadgeId[];
    gluteMeasurements?: { date: string; sizeCm: number }[];
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
        dashboardWidgets?: ('1rm' | 'program_status' | 'strength_chart' | 'pencilneck_commandments' | 'trap_barometer' | 'skeleton_countdown' | 'skeleton_pushup_max' | 'skeleton_quotes' | 'glute_tracker')[];
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
