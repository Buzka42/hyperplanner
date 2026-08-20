import type { ExerciseSwapMap, SetKind, TrainingPreferences } from './data/exercises/types';
import type { PlanPreferenceMap } from './features/planLifecycle';

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
    /**
     * Maxes for plans whose primary lifts are heavy enough that guessing the
     * first working set costs a fortnight. They seed an opening load; the
     * plan's own progression takes over from the first logged set.
     */
    flatBench?: number;
    standingPress?: number;
    bodyweightKg?: number;
};

export type BenchDominationModules = {
    tricepGiantSet: boolean;
    behindNeckPress: boolean;
    weightedPullups: boolean;
    accessories: boolean;
    legDays: boolean; // Toggle for Tuesday/Friday leg sessions
    thursdayTricepVariant?: 'giant-set' | 'heavy-extensions'; // Thursday tricep exercise option
    lowPinPressExtraSet?: boolean; // Toggle to swap 1 set from Paused Bench to Low Pin Press
    /** Display/tempo only — competition pause stays the default. */
    pauseStyle?: 'paused' | 'touch-and-go';
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
    /** Wednesday paused-bench average RIR was ≥ 3 — Saturday backoff may bump. */
    wednesdayVolumeEasy?: boolean;
    /** +2.5 kg on Saturday back-off only, not the paused-bench base. */
    saturdayBackoffBump?: boolean;
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
    /** Classic GVT-style 10×6 speed, or a lower-fatigue 8×3 for older backs. */
    speedScheme?: 'classic' | 'low-fatigue';
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
    deProgressionPending?: { lift: 'bench' | 'deadlift' | 'squat'; amount: number }[]; // +2.5kg bar-weight progression for successful DE work
    excludedVariations?: string[];
    // User preference for accessory days
    preferredAccessoryType?: 'upper' | 'lower' | null;
    accessoryDaysCompleted?: number;
    skipNextAccessory?: boolean;
    forceAccessoryDay?: boolean;
    // Onboarding choice: work up to a 1-rep max (singles) or 3-rep max (ladder) on ME days
    meRepMaxStyle?: '1rm' | '3rm';
    // Settings choice: substitute movement for the Repeated Effort deadlift slot
    reDeadliftVariant?: 'Romanian Deadlift' | 'Reverse Hyperextensions' | 'Good Mornings';
};

export type SuperMutantStatus = {
    completedWorkouts: number;
    currentCycle: number; // 1-4 (tracks which 4-week cycle user is in)
    muscleGroupTimestamps: {
        chest?: number;
        shoulders?: number;
        triceps?: number;
        back?: number;
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
        back: number;
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
    // Block alternation for new queue system
    nextUpperBlock?: 'A' | 'B'; // Chest/Tri/Bi (A) or Back/Shoulders/Calves (B)
    nextLowerBlock?: 'C' | 'D'; // Hams/Glutes/LBack (C) or Quads/Abd/Abs (D)
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
    quadExercise: 'Hack Squat' | 'Front Squat' | 'Safety Bar Squat';
    hamstringExercise: 'Good Mornings' | 'Deficit RDLs';
    // Weekly session tracking for cap
    weeklySessionDates?: string[]; // Last 7 days of session dates
    volumeHistory?: { date: string; contributions: Record<string, number> }[];
    exerciseLoads?: Record<string, number>;
    /** Optional indefinite-pool rotation state. Absent means the base plan. */
    pool?: { lastUsed?: Record<string, Record<string, string>>; excluded?: string[] };
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

export type HouseImplement = {
    id: string;
    type: 'dumbbell' | 'kettlebell';
    weightKg: number;
    count: 1 | 2;
};

export type HouseProgressionState = {
    variationId?: string;
    stageIndex: number;
    consecutiveStalls: number;
    cleanTopRangeExposures: number;
};

export type HouseOfIronStatus = {
    equipment?: HouseImplement[];
    preferredImplement?: 'dumbbell' | 'kettlebell';
    exerciseImplementIds?: Record<string, string>;
    progression?: Record<string, HouseProgressionState>;
    pendingProgressions?: Record<string, { stage: string; earnedAt: string }>;
    sessionHistory?: { session: 'push-a' | 'pull-a' | 'push-b' | 'pull-b'; date: string }[];
};

export type ApexRegion = 'ankle' | 'hipFlexion' | 'hipRotation' | 'shoulderFlexion' | 'shoulderRotation' | 'thoracicRotation';
export type ApexPredatorStatus = {
    assessments?: {
        week: 0 | 4 | 8 | 12;
        date: string;
        regions: Partial<Record<ApexRegion, { left?: number | null; right?: number | null; score?: 1 | 2 | 3 | null; pain: 'none' | 'discomfort' | 'pain'; skipped?: boolean }>>;
        squatScreen?: string;
        videoAdvice?: { lift: 'squat' | 'bench' | 'deadlift'; summary: string; observations: string[]; suggestions: string[]; confidence: 'low' | 'medium' | 'high' }[];
    }[];
    emphasis?: { regions: [ApexRegion, ApexRegion]; sinceWeek: number };
    rom?: Record<string, { level: number; updatedWeek: number }>;
};
export type AthenaStatus = { exerciseLoads?: Record<string, number> };
export type KaliStatus = { bodyweightKg?: number; aggressive?: boolean; baseline?: Partial<Record<'squat' | 'hinge' | 'push' | 'pull', number>> };
export type RedlineStatus = { nextRecovery?: { response: 'recovered' | 'somewhat-fatigued' | 'performance-impaired'; confirmed: boolean; recordedAt: string }; baseline?: Record<string, number> };

/**
 * Iron Clock records a block's result, not a set's: the same round list at a
 * shorter duration is progress, so the comparison lineage carries the exercise,
 * load and target that produced it.
 */
export type IronClockBlockRecord = {
    blockId: string;
    week: number;
    durationSeconds: number;
    rounds: number;
    reps: number;
    loadKg: number;
    /** Round-level confirmation; a block the athlete flagged never progresses. */
    quality: 'clean' | 'borderline' | 'invalid';
    /** Exercise ids in order — a changed pairing breaks strict comparability. */
    lineage: string[];
    date: string;
};
export type IronClockStatus = {
    history?: IronClockBlockRecord[];
    /** Per block: where it currently sits on the reps → time → load ladder. */
    stage?: Record<string, { step: 'reps' | 'time' | 'load' | 'reset'; sinceWeek: number }>;
    maxRestSeconds?: number;
};

export type MinimumStatus = {
    /** Completed bonus sessions, kept out of mandatory progression entirely. */
    bonusSessions?: { moduleId: string; date: string; week: number }[];
    /** Exposure counter per muscle, used to pick which bonus module is offered. */
    exposure?: Record<string, number>;
    /** Set when the last mandatory session declined; discourages a bonus. */
    lastDecline?: { week: number; exerciseId: string };
};

export type LazarusStatus = {
    breakMonths?: number;
    priorExperienceYears?: number;
    /** Self-reported or profile-derived pre-break bests, per exercise id. */
    memoryCurve?: Record<string, { lifetimeBestKg?: number; preBreakKg?: number; source: 'profile' | 'self-reported' }>;
    /** Sessions where the athlete beat the prescription cleanly; two accelerate. */
    underestimated?: { week: number; date: string }[];
    injuryReturn?: boolean;
};

export type QuadfatherStatus = {
    /** Confirmed depth per exercise; also inferable from an approved variation. */
    rom?: Record<string, { confirmed: 'partial' | 'parallel' | 'below-parallel'; week: number }>;
    /** `exerciseId` is what the feedback was about; `acceptedSwap` replaces it. */
    kneeFeedback?: { week: number; exerciseId: string; severity: 'normal' | 'strained' | 'impaired'; acceptedSwap?: string }[];
    roleBalance?: Record<'load' | 'depth' | 'burn', number>;
};

export type CathedralStatus = {
    /** Weekly set count per arch, the only chest balance signal the plan trusts. */
    arches?: Record<'press' | 'stretch' | 'adduction', number>;
    /** What actually failed first, which decides whether pressing gives way. */
    limitingFatigue?: { week: number; region: 'triceps' | 'frontDelt' | 'shoulder' | 'chest' }[];
    comboMachineRole?: 'press' | 'adduction';
};

/** Blackout's single work set carries the whole session's evidence. */
export type BlackoutStatus = {
    stall?: Record<string, { stageIndex: number; consecutiveStalls: number }>;
    /** Back-offs actually earned, kept so the dashboard can show how rare they are. */
    earnedBackoffs?: { week: number; exerciseId: string; date: string }[];
    lastRecovery?: { response: 'recovered' | 'somewhat-fatigued' | 'performance-impaired'; recordedAt: string };
};

export type AtlasStatus = {
    /** Carry results, scored as time × load with the limiting factor kept. */
    carries?: { exerciseId: string; week: number; seconds: number; loadKg: number; implements: 1 | 2; limiter?: string; date: string }[];
    hinge?: string;
    powerWorkEnabled?: boolean;
};

export type EventHorizonStatus = {
    /** exerciseId -> accepted replacement, or a pair when a movement was split. */
    acceptedSwaps?: Record<string, string | string[]>;
    /** Region reports, which also feed the bounded personal-cost learning. */
    reports?: { week: number; region: string; report: 'normal' | 'strained' | 'impaired'; exerciseId: string; comparable: boolean }[];
    /** Did an accepted swap actually help? Tracked, never assumed. */
    swapOutcomes?: { acceptedExerciseId: string; replacedExerciseId: string; verdict: 'helped' | 'mixed' | 'did-not-help'; week: number }[];
};

export type ProjectChimeraStatus = {
    /** block number -> quality -> weekly set delta, confirmed by the athlete. */
    allocation?: Record<number, Record<string, number>>;
    acceptedExerciseChanges?: Record<string, string>;
    /** Shown after each block. Never an input to a mutation. */
    phenotype?: { block: number; label: string }[];
};

export type OracleStatus = {
    /** Comparable-exposure ledger the predictor reads. */
    exposures?: { exerciseId: string; date: string; loadKg: number; reps: number; rir?: number; comparable: boolean; externalFactor?: boolean }[];
    /** Prediction errors, scored on load, reps and RIR rather than e1RM. */
    errors?: { week: number; exerciseId: string; error: number; confidence: 'low' | 'medium' | 'high' }[];
    /** Athlete opt-in for model refinement, on top of the owner's switch. */
    modelRefinementEnabled?: boolean;
};

export type UserProfile = {
    id: string; // Codeword or Auth UID
    ownerUid?: string; // Firebase Auth owner; required by production Firestore rules
    codeword: string;
    stats: LiftingStats;
    startDate: string; // ISO date
    programId: string;
    allowedPlanIds?: string[];
    allowPlanSwitching?: boolean;
    completedSessions: number;
    lastAmrapDate?: string;
    benchHistory: { date: string; week?: number; weight: number; actualWeight?: number; actualReps?: number }[];
    squatHistory?: { date: string; week?: number; weight: number; actualWeight?: number; actualReps?: number }[];
    selectedDays?: number[]; // [1, 2, 4, 5] for Mon,Tue,Thu,Fri
    /**
     * 'fixed' (default): sessions are bound to `selectedDays` weekdays.
     * 'rolling': an irregular template (e.g. 2 on / 1 off) was chosen, so
     * sessions advance on completion, weekday-agnostic.
     */
    scheduleMode?: 'fixed' | 'rolling';
    exercisePreferences?: Record<string, string>; // "legPrimary": "Hack Squat"
    benchDominationModules?: BenchDominationModules;
    // Status tracking for complex programs
    benchDominationStatus?: Partial<BenchDominationStatus>;
    pencilneckStatus?: PencilneckStatus;
    skeletonStatus?: { completed: boolean; completionDate?: string; plankTargetSeconds?: number };
    painGloryStatus?: PainGloryStatus; // Pain & Glory program status
    trinaryStatus?: TrinaryStatus; // Trinary conjugate periodization status
    ritualStatus?: any; // Ritual of Strength status (imported from ritual.ts to avoid circular dependency)
    superMutantStatus?: SuperMutantStatus; // Super Mutant status
    houseOfIronStatus?: HouseOfIronStatus;
    apexPredatorStatus?: ApexPredatorStatus;
    athenaStatus?: AthenaStatus;
    kaliStatus?: KaliStatus;
    redlineStatus?: RedlineStatus;
    ironClockStatus?: IronClockStatus;
    minimumStatus?: MinimumStatus;
    lazarusStatus?: LazarusStatus;
    quadfatherStatus?: QuadfatherStatus;
    cathedralStatus?: CathedralStatus;
    blackoutStatus?: BlackoutStatus;
    atlasStatus?: AtlasStatus;
    eventHorizonStatus?: EventHorizonStatus;
    projectChimeraStatus?: ProjectChimeraStatus;
    oracleStatus?: OracleStatus;
    kingOfTheSquatStatus?: { hipCapsuleStreak?: number };
    /** definePlan double-progression seeds, keyed planId → exerciseId → kg. */
    workingLoads?: Record<string, Record<string, number>>;
    liftHistory?: Record<string, { date: string; weight: number }[]>;
    neuralOverloadStatus?: { sixLoads?: Record<string, number>; holdWave2?: boolean; coupleNextSixes?: boolean };
    tenfoldStatus?: { collapsePending?: boolean };
    programProgress?: Record<string, { completedSessions: number; startDate: string; }>;

    /**
     * Maxes the athlete chose not to enter at onboarding. The first prescribed
     * exposure of each lift runs as a calibration set, which writes the derived
     * 1RM into `stats` and drops the key from this list.
     */
    pendingCalibration?: (keyof LiftingStats)[];

    // New Fields
    badges?: BadgeId[];
    gluteMeasurements?: { date: string; sizeCm: number }[];
    armMeasurements?: { date: string; sizeCm: number }[];
    adventureEquipment?: ('bodyweight' | 'dumbbells' | 'barbell' | 'cable' | 'machines')[];
    pencilneckBenchHistory?: { date: string; week?: number; weight: number; actualWeight?: number; actualReps?: number }[]; // Separate tracking for Pencilneck

    // Exercise system (see src/data/exercises/types.ts)
    /** Plan-agnostic training preferences: extra sets, rest timer, tips, units. */
    trainingPreferences?: TrainingPreferences;
    /** planId -> exerciseId -> chosen replacement. Supersedes `exercisePreferences`. */
    exerciseSwaps?: ExerciseSwapMap;
    /** Per-plan schedule and exercise choices; retained when that plan is rerun. */
    planPreferences?: PlanPreferenceMap;
    /** Granted via an access key flagged `testAccount`; unlocks Lab Mode. */
    isTestAccount?: boolean;
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
    /** Canonical library identity, distinct from the week/day slot id. */
    exerciseId?: string;
    /** May be omitted without making the session incomplete. */
    optional?: boolean;
    name: string;
    sets: number;
    target: SetTarget;
    notes?: string;
    /** Predicted load for Oracle / Lazarus, shown next to the logged set. */
    predictedKg?: number;
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
    /**
     * Structured prescription authored by the plan (see definePlan).
     *
     * These used to be flattened into `notes` as "A1 · Tempo 40X0 · Rest 90s",
     * which meant the rest timer had nothing to read and the UI could not tell
     * a superset from a tempo. Admin overrides still win over anything here.
     */
    prescription?: {
        restSeconds?: number;
        tempo?: string;
        technique?: import('./data/exercises/types').IntensityTechniqueSpec;
        /** Superset role, e.g. 'A1'. Partners share the letter. */
        pair?: string;
        topSetBackoff?: { backoffPercent: number; backoffSets: number; backoffReps: string; incrementKg: number };
        block?: { kind: 'anchor' | 'burn' | 'finisher' | 'density'; id: string; durationSeconds?: number };
    };
};

export type WorkoutDay = {
    id?: string;
    /** Stamped by the session view so preprocess can see the program week. */
    weekNumber?: number;
    dayName: string; // "Monday - Heavy Strength"
    dayOfWeek: number; // 1=Mon, 2=Tue...
    exercises: Exercise[];
};

export interface PlanConfig {
    id: string;
    program: Program;
    session?: {
        kind: 'scheduled' | 'pair-select' | 'session-select' | 'rotation';
        rotation?: {
            capPer7Days: number;
            minHoursBetween?: number;
            /** First N training days form the automatic deck; later days are optional. */
            trainingDays?: number;
        };
    };
    ui?: {
        dashboardWidgets?: ('1rm' | 'program_status' | 'strength_chart' | 'pencilneck_commandments' | 'trap_barometer' | 'skeleton_countdown' | 'skeleton_pushup_max' | 'skeleton_quotes' | 'glute_tracker' | 'arm_tracker' | 'deficit_snatch_tracker' | 'strength_altar' | 'workout_history' | 'mutagen_exposure' | 'recovery_gauge' | 'mutant_mindset')[];
        themeClass?: string;
        coverImage?: string;
        navImage?: string;
    };
    onboarding?: {
        /**
         * Stat keys this plan's progressions actually read. `definePlan` derives
         * these from the slot specs, so a plan cannot silently ship a
         * percentage progression whose base is never collected.
         *
         * Plans with a bespoke onboarding step (Bench Domination, Trinary,
         * Ritual, Pain & Glory) collect their own stats and leave this unset.
         */
        requiredStats?: (keyof LiftingStats)[];
        /**
         * Maxes used only to seed the first working load, for plans whose
         * primary lifts are heavy enough that guessing set one costs a
         * fortnight. Always optional to enter: the plan progresses on its own
         * terms from the first logged set, and may move away from the seed.
         */
        seedStats?: (keyof LiftingStats)[];
        /** Workhorse / Gravity / Kali need BW for total system weight. */
        requireBodyweight?: boolean;
    };
    schedule?: {
        /**
         * Onboarding offers weekday selection for this many sessions a week.
         * Declarative plans get this by default from `definePlan`; plans with
         * bespoke flows (Bench Domination, Super Mutant) set it false.
         */
        selectable?: boolean;
        /** Suggested weekday combinations, 1 = Monday … 7 = Sunday. */
        suggestedSplits?: number[][];
        /**
         * Irregular rotation templates ("2 days on / 1 day off"). Choosing one
         * enrols with `scheduleMode: 'rolling'`: sessions advance on
         * completion rather than calendar weekday.
         */
        irregularTemplates?: { id: string; onDays: number; offDays: number }[];
    };
    calibration?: {
        /**
         * Exercise display name → the max it establishes. Derived by
         * `definePlan` from the same progressions that consume the max, so the
         * calibrating lift is always the one whose loads depend on it.
         */
        exerciseNameToStat?: Record<string, keyof LiftingStats>;
    };
    hooks?: {
        preprocessDay?: (day: WorkoutDay, user: UserProfile) => WorkoutDay;
        getExerciseAdvice?: (exercise: Exercise, history: WorkoutLog[]) => string | null;
        calculateWeight?: (
            target: SetTarget,
            user: UserProfile,
            exerciseName?: string,
            context?: { week: number; day: number; setIndex?: number; exerciseId?: string }
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
    sessionKind?: 'scheduled' | 'pair-select' | 'session-select' | 'rotation';
    elapsedSeconds?: number;
    adventure?: {
        sessionToken: string;
        selectedPairIds: Record<string, string>;
        challengeAnswers: Record<string, string[]>;
    };
    /** Session was logged by a test account; excluded from PRs, badges and analytics. */
    isTest?: boolean;
    exercises?: {
        id: string;
        exerciseKey?: string;
        /** Canonical library id. Written alongside `name` so history survives renames. */
        exerciseId?: string;
        pairId?: string;
        portalId?: string;
        name: string;
        setsData: {
            reps: string; // Note: Input stores strings, converted to number usually? UserContext used string.
            weight: string;
            completed: boolean;
            /**
             * Provenance of the set. Absent means 'work' (all pre-migration logs).
             * Progression handlers count only 'work' sets, so user-added extras
             * and technique sub-sets can't block a progression.
             */
            kind?: SetKind;
            rir?: number;
            quality?: 'clean' | 'borderline' | 'invalid';
        }[];
        notes?: string;
    }[];

    notes?: string;
    redline?: { blocks: { id: string; kind: 'burn' | 'finisher'; elapsedSeconds: number; completed: boolean; expired?: boolean; signature: string }[]; recovery?: 'recovered' | 'somewhat-fatigued' | 'performance-impaired' };
};
