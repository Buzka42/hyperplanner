/**
 * Exercise system — canonical types.
 *
 * Hyperplanner's 9 plans each invented their own representation of the same
 * movements as free-text strings. This module defines the single vocabulary
 * they all resolve into.
 *
 * Layering (see the plan doc):
 *   1. LibraryExercise   — bundled seed ⊕ Firestore `exerciseLibrary/{id}` overlay
 *   2. PlanExerciseDoc   — bundled seed ⊕ Firestore `planConfigs/{planId}` overlay
 *   3. TrainingPreferences / exerciseSwaps on the user profile
 *
 * All three merge in `resolveDay()`, which runs AFTER a plan's own
 * `hooks.preprocessDay`. Plans keep generating days in code; this layer
 * post-processes what they produce.
 */

import type { SetTarget } from '../../types';

/** Languages the app ships. Mirrors `AdventureLanguage` in ../adventure.ts. */
export type Lang = 'en' | 'pl';

/** Bilingual free text. Every user-visible string in the library uses this. */
export type LocalizedText = Record<Lang, string>;

/**
 * Stable kebab-case movement identifier, e.g. `paused-bench-press`.
 * Never derived from a display name at runtime — always looked up through
 * `resolveExerciseId()` so renames can't sever history.
 */
export type ExerciseId = string;

// ---------------------------------------------------------------------------
// Taxonomy
// ---------------------------------------------------------------------------

/**
 * What the movement *does*, independent of equipment. Drives swap suggestions
 * and the structural-balance categories in Immaculate (Re)Structure.
 */
export type MovementPattern =
    | 'horizontal-press'
    | 'incline-press'
    | 'vertical-press'
    | 'horizontal-pull'
    | 'vertical-pull'
    | 'squat'
    | 'hinge'
    | 'lunge'
    | 'knee-flexion'
    | 'knee-extension'
    | 'hip-extension'
    | 'hip-abduction'
    | 'hip-adduction'
    | 'elbow-flexion'
    | 'elbow-extension'
    | 'shoulder-abduction'
    | 'shoulder-horizontal-abduction'
    | 'external-rotation'
    | 'calf'
    | 'core-flexion'
    | 'core-antiextension'
    | 'core-antirotation'
    | 'carry'
    | 'mobility'
    | 'other';

/**
 * Fine-grained muscles. Deliberately finer than Super Mutant's 12-group model
 * so Overhead Dominion can show front/side/rear delts separately — see
 * `MUSCLE_AGGREGATES` for rolling up, and `SUPER_MUTANT_MUSCLE_MAP` for
 * back-compat with `SuperMutantStatus.rolling7DayVolume`.
 */
export type MuscleGroup =
    | 'chest'
    | 'frontDelt'
    | 'sideDelt'
    | 'rearDelt'
    | 'rotatorCuff'
    | 'triceps'
    | 'biceps'
    | 'brachialis'
    | 'forearms'
    | 'lats'
    | 'upperBack'
    | 'traps'
    | 'lowerBack'
    | 'abs'
    | 'obliques'
    | 'glutes'
    | 'hamstrings'
    | 'quads'
    | 'adductors'
    | 'abductors'
    | 'calves'
    | 'tibialis'
    | 'neck';

/** Coarse groups used by frequency rules ("2 weekly exposures per major group"). */
export type MajorMuscleGroup =
    | 'chest'
    | 'shoulders'
    | 'back'
    | 'biceps'
    | 'triceps'
    | 'quads'
    | 'hamstrings'
    | 'glutes'
    | 'calves'
    | 'core';

/** Which fine-grained muscles roll up into each major group. */
export const MUSCLE_AGGREGATES: Record<MajorMuscleGroup, MuscleGroup[]> = {
    chest: ['chest'],
    shoulders: ['frontDelt', 'sideDelt', 'rearDelt', 'rotatorCuff'],
    back: ['lats', 'upperBack', 'traps', 'lowerBack'],
    biceps: ['biceps', 'brachialis', 'forearms'],
    triceps: ['triceps'],
    quads: ['quads'],
    hamstrings: ['hamstrings'],
    glutes: ['glutes', 'abductors', 'adductors'],
    calves: ['calves', 'tibialis'],
    core: ['abs', 'obliques']
};

/**
 * Maps the library taxonomy onto the 12 keys already persisted in
 * `SuperMutantStatus.rolling7DayVolume` / `muscleGroupTimestamps`, so the
 * existing Super Mutant volume tracking keeps working unchanged.
 */
export const SUPER_MUTANT_MUSCLE_MAP: Partial<Record<MuscleGroup, string>> = {
    chest: 'chest',
    frontDelt: 'shoulders',
    sideDelt: 'shoulders',
    rearDelt: 'shoulders',
    rotatorCuff: 'shoulders',
    triceps: 'triceps',
    biceps: 'biceps',
    brachialis: 'biceps',
    forearms: 'biceps',
    lats: 'back',
    upperBack: 'back',
    traps: 'back',
    lowerBack: 'lowerBack',
    abs: 'abs',
    obliques: 'abs',
    glutes: 'glutes',
    hamstrings: 'hamstrings',
    quads: 'quads',
    adductors: 'abductors',
    abductors: 'abductors',
    calves: 'calves',
    tibialis: 'calves'
};

/**
 * Equipment vocabulary, matching the gym inventory in
 * HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md §1 so `verify:library` can
 * flag any movement the gym cannot actually perform.
 */
export type Equipment =
    | 'barbell'
    | 'ez-bar'
    | 'dumbbell'
    | 'kettlebell'
    | 'cable'
    | 'machine'
    | 'smith'
    | 'hack-squat'
    | 'hammer-strength'
    | 'pec-deck'
    | 'leg-extension'
    | 'leg-curl'
    | 'rear-delt-machine'
    | 'bodyweight'
    | 'pull-up-bar'
    | 'dip-station'
    | 'trx'
    | 'bands'
    | 'ab-wheel'
    | 'bench'
    | 'plate'
    | 'other';

/**
 * How load is expressed for this movement. Drives the weight input and, for
 * `weighted-bodyweight`, the total-system-weight maths that Gravity Is
 * Optional and Workhorse need.
 */
export type WeightMode =
    | 'external'            // straight external load
    | 'bodyweight'          // no load input
    | 'weighted-bodyweight' // bodyweight + added load = total system weight
    | 'assisted'            // bodyweight - assistance
    | 'timed'               // seconds, not reps
    | 'optional';           // load input shown but not required

/** How the set is meant to end — carried over from AdventureExercise.failureMode. */
export type FailureMode = 'muscular' | 'technical' | 'preprogrammed';

/**
 * Expert-authored ordinal used by exercise-selection engines.
 *
 * 0 = absent/negligible, 1 = low, 2 = moderate, 3 = high, 4 = very high.
 * `unknown` is permitted while the library is being authored but is rejected by
 * the strict completeness audit required before a consuming engine ships.
 */
export type ExerciseRating = 0 | 1 | 2 | 3 | 4 | 'unknown';

export type ExerciseIntelligence = {
    schemaVersion: 1;
    provenance: 'codex-v1' | 'owner-reviewed-v1';

    stabilityDemand: ExerciseRating;
    systemicCost: ExerciseRating;
    axialCost: ExerciseRating;
    lowerBackCost: ExerciseRating;
    elbowCost: ExerciseRating;
    shoulderCost: ExerciseRating;
    kneeCost: ExerciseRating;
    lengthenedBias: ExerciseRating;
    shortenedBias: ExerciseRating;

    /** Intrinsic default. A plan slot may override this contextual property. */
    systemicCompound: boolean;
    homeCompatible: boolean;
    cameraFriendly: boolean;
    densityCompatible: boolean;
    failureSuitability: 'avoid' | 'advanced-only' | 'suitable';
};

// ---------------------------------------------------------------------------
// The library entry
// ---------------------------------------------------------------------------

export type LibraryExercise = {
    id: ExerciseId;
    name: LocalizedText;

    /**
     * Every legacy display string that must resolve to this exercise.
     *
     * This is the migration safety net. Logs are joined on exercise name in
     * ~10 places across the plan hooks, so merging two duplicate movements
     * means folding the loser's name in here — never deleting it.
     */
    aliases: string[];

    pattern: MovementPattern;
    primary: MuscleGroup[];
    secondary?: MuscleGroup[];
    equipment: Equipment[];
    unilateral?: boolean;

    weightMode: WeightMode;
    failureMode?: FailureMode;

    /**
     * Expert-authored selection/fatigue metadata. Kept in a separate authored
     * map and merged into the canonical seed so library entries stay readable.
     */
    intelligence?: ExerciseIntelligence;

    /** The single canonical coaching cue. Merged from the four legacy tip sources. */
    tip?: LocalizedText;
    /**
     * Audit state of the general cue. `draft` means Codex-authored English
     * awaiting the owner's training-content review; Polish is written only
     * after approval, so a rejected cue never becomes a translation source.
     */
    tipStatus?: 'draft' | 'approved';
    /** Longer setup instructions, shown in the exercise detail sheet. */
    setupNotes?: LocalizedText;

    media?: { image?: string; video?: string };

    defaultTarget?: SetTarget;

    /**
     * Owner-set defaults for the movement, edited in the admin Library tab.
     *
     * A plan's own prescription wins over these, because a plan that asks for
     * a three-second eccentric or a four-minute rest is making a training
     * argument the library should not quietly overrule.
     *
     * Setting the matching `Forced` flag inverts that for this one movement:
     * the library value then beats the plan. That is the escape hatch for "I
     * do not care what any plan says, I tempo this lift my way".
     */
    defaultTempo?: string;
    tempoForced?: boolean;
    defaultRestSeconds?: number;
    restForced?: boolean;
    /** Difficulty variants, e.g. push-up: knee → incline → standard → feet-elevated. */
    variants?: Record<Lang, string[]>;

    /**
     * Named pool this movement belongs to, e.g. `vertical-pull-heavy`.
     * A plan config with `swap.policy: 'group'` offers everything in the pool.
     */
    swapGroup?: string;

    /**
     * Poliquin structural-balance reference, expressed relative to another lift.
     * Displayed as a "Poliquin structural-balance target", never as a
     * safe/unsafe threshold — see the concept doc §2.6 and §15.
     */
    strengthRef?: { ratioOf: ExerciseId; poliquinPercent: number };

    tags?: string[];
    status: 'active' | 'deprecated';
    /** When deprecated, the surviving exercise this one merged into. */
    deprecatedFor?: ExerciseId;
};

// ---------------------------------------------------------------------------
// Finishing techniques
// ---------------------------------------------------------------------------

/** Which of an exercise's working sets a technique applies to. */
export type TechniqueScope = 'last' | 'all' | number[];

/**
 * Serializable finishing techniques. Replaces the free-text
 * `Exercise.intensityTechnique` banner and generalises `giantSetConfig`.
 *
 * Each kind maps to a display badge, a set-row shape, and a logging shape.
 */
export type IntensityTechniqueSpec =
    | { kind: 'none' }
    | { kind: 'drop-set'; drops: number; dropPercent: number; applyTo: TechniqueScope; toFailure?: boolean }
    | { kind: 'rest-pause'; bursts: number; restSeconds: number; applyTo: TechniqueScope }
    | { kind: 'myo-reps'; miniSets: number; miniReps: string; restBreaths: number }
    | { kind: 'cluster'; clusters: number; repsPerCluster: string; intraRestSeconds: number }
    | { kind: 'partials'; extraReps: string; range: 'top' | 'bottom'; applyTo: TechniqueScope }
    | { kind: 'one-and-half' }
    | { kind: 'tempo'; tempo: string }
    | { kind: 'total-reps'; targetReps: number; maxSets?: number }
    | { kind: 'back-off'; percent: number; sets: number; reps: string }
    | { kind: 'wave'; ladder: number[]; waves: number }
    | { kind: 'amrap-finisher' }
    | { kind: 'last-set-failure' };

export type TechniqueKind = IntensityTechniqueSpec['kind'];

/**
 * Supersets are a property of a *group of exercises*, not of one exercise —
 * which is why `Exercise` never modelled them. Generalises Adventure's
 * `AdventurePair` and Bench Domination's `giantSetConfig`.
 */
export type ExerciseGroup = {
    id: string;
    kind: 'superset' | 'antagonist' | 'giant' | 'circuit';
    label?: LocalizedText;
    /** Ordered slot keys or exercise ids — defines A1 → A2 → A3 order. */
    members: string[];
    restBetweenMembers: number;
    restAfterRound: number;
    rounds?: number;
};

// ---------------------------------------------------------------------------
// Per-plan configuration (the admin editing surface)
// ---------------------------------------------------------------------------

export type SwapPolicy = 'locked' | 'pool' | 'group' | 'any';

export type SwapRule = {
    policy: SwapPolicy;
    /** Explicit allowlist, used when policy is 'pool'. */
    pool?: ExerciseId[];
    /** Named `swapGroup`, used when policy is 'group'. */
    group?: string;
};

export type UserExtraSetsRule = {
    allowed: boolean;
    /** Hard cap on how many sets the user may add on top of the prescription. */
    max: number;
};

/**
 * Admin overrides for one movement within one plan. Every field is optional —
 * an absent field means "whatever the plan's own generator produced".
 */
export type PlanExerciseConfig = {
    /** false removes the movement from the plan entirely. */
    enabled?: boolean;
    /** Admin-level replacement, applied before any user swap. */
    substituteWith?: ExerciseId;

    /** Absolute set count. Wins over setsDelta. */
    setsOverride?: number;
    /** Relative adjustment against what the plan generated, e.g. -1 or +2. */
    setsDelta?: number;

    target?: Partial<SetTarget>;
    repsMin?: number;
    repsMax?: number;

    restSeconds?: number;
    /** Poliquin-style tempo string, e.g. '40X0'. */
    tempo?: string;

    technique?: IntensityTechniqueSpec;

    swap?: SwapRule;
    userExtraSets?: UserExtraSetsRule;

    /**
     * Plan/slot prescription cue. Rendered first, in the plan accent.
     *
     * Despite the name it no longer replaces the general cue — the two are
     * separate layers, and removing the general one requires
     * `suppressGeneralTip`. The name is kept so stored plan configs keep
     * resolving.
     */
    tipOverride?: LocalizedText;
    /** Extends the general cue rather than replacing it. */
    tipAppend?: LocalizedText;
    /** Exceptional, explicit removal of the general cue for this plan. */
    suppressGeneralTip?: boolean;

    groupId?: string;
    /** Display role within the group, e.g. 'A1' | 'A2' | 'B1'. */
    groupRole?: string;

    /** Narrows this override to specific weeks/days. Absent = the whole plan. */
    scope?: { weeks?: number[]; days?: number[] };
};

export type PlanExerciseDefaults = {
    userExtraSets?: UserExtraSetsRule;
    swap?: SwapRule;
    restSeconds?: number;
};

export type PlanExerciseDoc = {
    planId: string;
    version: number;
    updatedAt: string;
    updatedBy: string;

    /**
     * Movement-scope overrides — the primary editing surface. Keyed by
     * ExerciseId so they apply everywhere the movement shows up, which is the
     * only scope that works for plans that synthesise days at runtime
     * (Super Mutant, Trinary, Skeleton, Ritual).
     */
    exercises: Record<ExerciseId, PlanExerciseConfig>;

    /**
     * Slot-scope overrides, keyed `w{week}d{dayOfWeek}#{index}`. Wins over
     * movement scope. For static plans where the same movement appears twice
     * with different prescriptions.
     */
    slots?: Record<string, PlanExerciseConfig>;

    groups?: Record<string, ExerciseGroup>;
    defaults?: PlanExerciseDefaults;
};

/** Builds the canonical slot key for slot-scope overrides. */
export const slotKey = (week: number, dayOfWeek: number, index: number) =>
    `w${week}d${dayOfWeek}#${index}`;

// ---------------------------------------------------------------------------
// User preferences
// ---------------------------------------------------------------------------

export type TrainingPreferences = {
    extraSets?: { mode: 'off' | 'accessories' | 'all'; count: 1 | 2 };
    restTimer?: { enabled: boolean; autoStart: boolean };
    showTips?: boolean;
    /** Opt out of drop sets / rest-pause / myo-reps prescriptions. */
    techniquesEnabled?: boolean;
    units?: 'kg' | 'lb';
    /**
     * Which exercise name leads in the workout view. Default 'en': English on
     * top, Polish underneath in small type. 'pl' flips the priority.
     */
    exerciseNamePriority?: 'en' | 'pl';
    /** Replaces hanging-leg-raise everywhere it is prescribed. */
    coreRaiseId?: ExerciseId;
};

/** planId → exerciseId → chosen replacement exerciseId. */
export type ExerciseSwapMap = Record<string, Record<ExerciseId, ExerciseId>>;

// ---------------------------------------------------------------------------
// Resolution output
// ---------------------------------------------------------------------------

/**
 * Provenance of a logged set.
 *
 * This is what stops user-added sets from breaking progression: the per-plan
 * progression handlers filter to `kind === 'work'`, so extra sets and
 * technique sub-sets can never block a `+2.5 kg` bump.
 */
export type SetKind = 'work' | 'extra' | 'warmup' | 'drop' | 'rest-pause' | 'cluster' | 'myo';

export type ResolvedSwap = {
    policy: SwapPolicy;
    options: LibraryExercise[];
    /** Set when the user (or admin) has swapped away from the plan's default. */
    current?: ExerciseId;
    /** The movement the plan originally prescribed, for "reset to default". */
    original: ExerciseId;
};

/**
 * A plan exercise after library + overrides + user preferences are applied.
 *
 * Deliberately a superset of `Exercise` so existing consumers keep compiling
 * and can migrate incrementally.
 */
export type ResolvedExercise = {
    // --- carried through from Exercise ---
    id: string;
    name: string;
    sets: number;
    target: SetTarget;
    notes?: string;
    predictedKg?: number;
    rest?: string;
    giantSetConfig?: { steps: { name: string; targetReps: string; inputPlaceholder?: string; editableWeight?: boolean }[] };
    warmups?: { sets: { reps: string; weight: string; completed?: boolean }[]; note?: string };
    alternates?: string[];
    intensityTechnique?: string;
    /**
     * The plan's own structured prescription, carried through unchanged.
     * Resolution folds this into the fields below; it stays here so a
     * consumer can still read the plan's intent after an admin override.
     */
    prescription?: {
        restSeconds?: number;
        tempo?: string;
        technique?: IntensityTechniqueSpec;
        pair?: string;
        topSetBackoff?: { backoffPercent: number; backoffSets: number; backoffReps: string; incrementKg: number };
        block?: { kind: 'anchor' | 'burn' | 'finisher' | 'density'; id: string; durationSeconds?: number };
    };

    // --- added by resolution ---
    exerciseId: ExerciseId;
    /** Undefined only for unmapped movements, which `verify:library` fails on. */
    library?: LibraryExercise;
    /** Language-aware display name. Falls back to the plan's raw name. */
    displayName: string;
    /** Fully resolved tip strings, ready to render. */
    tips: string[];
    /** Set by a plan that explicitly hides the movement's general cue. */
    suppressGeneralTip?: boolean;

    /** Set count the plan prescribed, before user extras. Progression reads this. */
    baseSets: number;
    /** How many sets the user added on top. */
    extraSets: number;

    technique?: IntensityTechniqueSpec;
    tempo?: string;
    restSeconds?: number;
    group?: { id: string; role: string; kind: ExerciseGroup['kind'] };
    swap?: ResolvedSwap;

    /** Slot key this exercise resolved at, for slot-scope admin edits. */
    slot?: string;
};

export type ResolvedDay = {
    id?: string;
    dayName: string;
    dayOfWeek: number;
    exercises: ResolvedExercise[];
    groups: Record<string, ExerciseGroup>;
};

// ---------------------------------------------------------------------------
// Overlay plumbing
// ---------------------------------------------------------------------------

/**
 * `appConfig/libraryMeta` — the cache key. The client reads this one small doc
 * per session and only refetches the overlay collections when a version bumps.
 */
export type LibraryMeta = {
    libraryVersion: number;
    planConfigVersions: Record<string, number>;
    updatedAt: string;
};

/** A partial library entry stored in Firestore, merged over the bundled seed. */
export type LibraryOverlayEntry = Partial<Omit<LibraryExercise, 'id'>> & { id: ExerciseId };
