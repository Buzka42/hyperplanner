/**
 * Per-session statistics.
 *
 * `volumeAnalysis` answers "does this plan train chest twice a week" — a
 * portfolio-level question, aggregated per week. This answers the question an
 * owner has while editing one session: how long is it, how much work is in it,
 * and where does that work land.
 *
 * Everything here is derived from the prescription, never from logged history,
 * so it is available for a session nobody has performed yet — which is the only
 * time it can still change the programming.
 *
 * Estimates are labelled as estimates. Rep counts collapse ranges to their
 * midpoint, and duration assumes an athlete who takes the prescribed rest. Both
 * are honest for comparing two sessions against each other, which is what they
 * are for; neither is a stopwatch.
 */

import { MUSCLE_AGGREGATES } from '../data/exercises/types';
import type { LibraryExercise, MajorMuscleGroup, MuscleGroup } from '../data/exercises/types';
import type { Exercise, SetTarget } from '../types';

/** A secondary muscle earns a third of a set, matching `volumeAnalysis`. */
const SECONDARY_WEIGHT = 1 / 3;

/** Seconds per rep when the movement declares no tempo. */
const DEFAULT_SECONDS_PER_REP = 3;

/** Rest assumed when neither the plan, the override nor the library says. */
const FALLBACK_REST_SECONDS = 120;

/** An AMRAP or a set to failure is counted as this many reps for estimating. */
const OPEN_ENDED_REPS = 10;

export type MuscleShare = {
    group: MajorMuscleGroup;
    directSets: number;
    /** Direct + weighted secondary. */
    totalSets: number;
};

export type MovementStat = {
    exerciseId: string;
    name: string;
    sets: number;
    reps: string;
    /** Estimated total reps across all sets. */
    estimatedReps: number;
    restSeconds: number;
    /** Estimated seconds this movement occupies, rest included. */
    estimatedSeconds: number;
    /** Tonnage in kg, present only where the load is actually determinable. */
    tonnageKg?: number;
    technique?: string;
    timed: boolean;
};

export type SessionStats = {
    movements: number;
    /** Prescribed working sets. Technique sub-sets are not sets. */
    workingSets: number;
    estimatedReps: number;
    estimatedSeconds: number;
    /** Seconds spent resting, of `estimatedSeconds`. */
    restSeconds: number;
    /** Total kg lifted, summed over the movements whose load is determinable. */
    tonnageKg: number;
    /** How many movements contributed to `tonnageKg`, of `movements`. */
    tonnageCoverage: number;
    /** Held time for timed work, e.g. planks and carries. */
    timedSeconds: number;
    muscles: MuscleShare[];
    techniques: string[];
    perMovement: MovementStat[];
};

/**
 * Midpoint of a prescribed rep figure.
 *
 * Handles "8", "6-8", "6–8" (en dash, which the plans do use), "8+", "AMRAP",
 * "Failure" and "30s". A figure that parses to nothing contributes nothing
 * rather than defaulting to a number that would quietly inflate the estimate.
 */
export const estimateReps = (reps: string | undefined): number => {
    if (!reps) return 0;
    const text = reps.trim().toLowerCase();
    if (!text) return 0;
    if (/amrap|failure|max/.test(text)) return OPEN_ENDED_REPS;

    const range = text.match(/(\d+)\s*[-–—]\s*(\d+)/);
    if (range) return (Number(range[1]) + Number(range[2])) / 2;

    const single = text.match(/(\d+)/);
    if (!single) return 0;
    const n = Number(single[1]);
    // "8+" is an open-ended bottom, not a target — assume a couple over.
    return /\+/.test(text) ? n + 2 : n;
};

/** Seconds of held time for a timed prescription, e.g. "45s" or "45". */
const heldSeconds = (reps: string | undefined): number => {
    if (!reps) return 0;
    const match = reps.trim().match(/(\d+)/);
    return match ? Number(match[1]) : 0;
};

/** Total seconds implied by a tempo string like "40X0"; X means explosive, not free. */
const tempoSeconds = (tempo: string | undefined): number | undefined => {
    if (!tempo) return undefined;
    const digits = tempo.trim().toUpperCase().match(/^(\d|X)(\d|X)(\d|X)(\d|X)?$/);
    if (!digits) return undefined;
    const total = digits
        .slice(1)
        .filter((d): d is string => Boolean(d))
        .reduce((sum, d) => sum + (d === 'X' ? 1 : Number(d)), 0);
    return total > 0 ? total : undefined;
};

const majorOf = (muscle: MuscleGroup): MajorMuscleGroup | undefined =>
    (Object.entries(MUSCLE_AGGREGATES) as [MajorMuscleGroup, MuscleGroup[]][])
        .find(([, muscles]) => muscles.includes(muscle))?.[0];

/**
 * Load for one set, where it can be known.
 *
 * A percentage-of-a-lift prescription is computable given the athlete's stats;
 * an absolute weight is already there. Everything else — bodyweight work, a
 * double-progression slot whose load lives in the athlete's history — is
 * genuinely unknown here, and is reported as unknown rather than guessed.
 */
const setLoadKg = (
    target: SetTarget | undefined,
    stats: Record<string, number> | undefined
): number | undefined => {
    if (!target) return undefined;
    if (typeof target.weightAbsolute === 'number') return target.weightAbsolute;
    if (typeof target.percentage === 'number' && target.percentageRef && stats) {
        const base = stats[target.percentageRef as string];
        if (typeof base === 'number' && base > 0) return base * target.percentage;
    }
    return undefined;
};

export type SessionStatsInput = {
    /** The day's exercises, in the order the athlete will see them. */
    exercises: Exercise[];
    /** Resolves a plan's free-text exercise name to its library entry. */
    lookup: (exercise: Exercise) => LibraryExercise | undefined;
    /** Rest actually in force for a movement, after admin overrides. */
    restFor?: (exercise: Exercise, library: LibraryExercise | undefined) => number | undefined;
    /** Tempo actually in force, after admin overrides. */
    tempoFor?: (exercise: Exercise, library: LibraryExercise | undefined) => string | undefined;
    /** Lifting stats used to price percentage-based slots. Omit for no tonnage. */
    stats?: Record<string, number>;
};

/** Rest/mobility entries occupy a slot but are not movements. */
const isPlaceholder = (name: string) =>
    /^(rest|rest\s*\/\s*mobility|rest day|mobility|active recovery)$/i.test(name.trim());

export const computeSessionStats = (input: SessionStatsInput): SessionStats => {
    const { exercises, lookup, restFor, tempoFor, stats } = input;

    const direct = new Map<MajorMuscleGroup, number>();
    const secondary = new Map<MajorMuscleGroup, number>();
    const techniques = new Set<string>();
    const perMovement: MovementStat[] = [];

    let workingSets = 0;
    let estimatedReps = 0;
    let estimatedSeconds = 0;
    let restTotal = 0;
    let tonnageKg = 0;
    let tonnageCoverage = 0;
    let timedSeconds = 0;

    for (const exercise of exercises) {
        if (isPlaceholder(exercise.name)) continue;

        const library = lookup(exercise);
        const sets = Math.max(0, exercise.sets || 0);
        const timed = library?.weightMode === 'timed';

        const rest = restFor?.(exercise, library)
            ?? exercise.prescription?.restSeconds
            ?? library?.defaultRestSeconds
            ?? FALLBACK_REST_SECONDS;

        // A giant set is one container holding several movements; its steps are
        // where the actual work is, so credit those rather than the wrapper.
        const steps = exercise.giantSetConfig?.steps ?? [];

        const repsPerSet = timed
            ? heldSeconds(exercise.target?.reps)
            : steps.length
                ? steps.reduce((sum, step) => sum + estimateReps(step.targetReps), 0)
                : estimateReps(exercise.target?.reps);

        const perRep = tempoSeconds(
            tempoFor?.(exercise, library) ?? exercise.prescription?.tempo ?? library?.defaultTempo
        ) ?? DEFAULT_SECONDS_PER_REP;

        const workSeconds = timed ? sets * repsPerSet : sets * repsPerSet * perRep;
        // The rest after the final set belongs to the next movement, not this
        // one — counting it makes every session read a few minutes long.
        const restSecondsTotal = Math.max(0, sets - 1) * rest;
        const movementSeconds = workSeconds + restSecondsTotal;

        const load = setLoadKg(exercise.target, stats);
        const movementTonnage = load !== undefined && !timed ? load * sets * repsPerSet : undefined;

        workingSets += sets;
        estimatedSeconds += movementSeconds;
        restTotal += restSecondsTotal;
        if (timed) timedSeconds += workSeconds; else estimatedReps += sets * repsPerSet;
        if (movementTonnage !== undefined) { tonnageKg += movementTonnage; tonnageCoverage += 1; }

        const technique = exercise.prescription?.technique?.kind ?? exercise.intensityTechnique;
        if (technique && technique !== 'none') techniques.add(String(technique));

        if (library) {
            // Each major group is credited once per movement: a row lists both
            // `lats` and `upperBack` as primary, and crediting each would
            // double-count the same three sets of back.
            const hitDirect = new Set<MajorMuscleGroup>();
            for (const muscle of library.primary ?? []) {
                const group = majorOf(muscle);
                if (group) hitDirect.add(group);
            }
            for (const group of hitDirect) direct.set(group, (direct.get(group) ?? 0) + sets);

            for (const muscle of library.secondary ?? []) {
                const group = majorOf(muscle);
                if (group && !hitDirect.has(group)) {
                    secondary.set(group, (secondary.get(group) ?? 0) + sets * SECONDARY_WEIGHT);
                }
            }
        }

        perMovement.push({
            exerciseId: library?.id ?? exercise.name,
            name: library?.name.en ?? exercise.name,
            sets,
            reps: exercise.target?.reps ?? '—',
            estimatedReps: timed ? 0 : sets * repsPerSet,
            restSeconds: rest,
            estimatedSeconds: movementSeconds,
            tonnageKg: movementTonnage,
            technique: technique && technique !== 'none' ? String(technique) : undefined,
            timed,
        });
    }

    const groups = new Set([...direct.keys(), ...secondary.keys()]);
    const muscles: MuscleShare[] = [...groups]
        .map(group => ({
            group,
            directSets: direct.get(group) ?? 0,
            totalSets: (direct.get(group) ?? 0) + (secondary.get(group) ?? 0),
        }))
        .sort((a, b) => b.directSets - a.directSets || b.totalSets - a.totalSets);

    return {
        movements: perMovement.length,
        workingSets,
        estimatedReps,
        estimatedSeconds,
        restSeconds: restTotal,
        tonnageKg,
        tonnageCoverage,
        timedSeconds,
        muscles,
        techniques: [...techniques].sort(),
        perMovement,
    };
};

/** "1h 04m" / "48m" — a duration an owner can compare at a glance. */
export const formatDuration = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds <= 0) return '—';
    const total = Math.round(seconds / 60);
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    return hours ? `${hours}h ${String(minutes).padStart(2, '0')}m` : `${minutes}m`;
};

/** "12.4 t" / "840 kg" — tonnage gets large fast and reads badly in kg. */
export const formatTonnage = (kg: number): string => {
    if (!Number.isFinite(kg) || kg <= 0) return '—';
    return kg >= 1000 ? `${(kg / 1000).toFixed(1)} t` : `${Math.round(kg)} kg`;
};
