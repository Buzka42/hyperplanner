/**
 * EVENT HORIZON — cost-aware substitution.
 *
 * The plan's premise is that a movement's cost is separable from its stimulus:
 * when a region is strained, the answer is usually a cheaper way to buy the same
 * stimulus, not less training. Everything here is built around three rules:
 *
 *   1. the athlete's own report of a region is authoritative — `impaired`
 *      always produces an offer;
 *   2. stimulus preservation is stated in rules, never as an invented score;
 *   3. nothing is applied without confirmation.
 *
 * Personal learning is deliberately bounded: it starts only after three
 * comparable exposures and can move a cost by at most one ordinal step away
 * from the expert metadata.
 */

import { EXERCISE_LIBRARY } from '../../data/exercises/library';
import { rankExerciseSwaps } from '../workout/engines';
import type { ExerciseIntelligence, LibraryExercise } from '../../data/exercises/types';

export type CostField = 'systemicCost' | 'axialCost' | 'lowerBackCost' | 'elbowCost' | 'shoulderCost' | 'kneeCost';
export type RegionReport = 'normal' | 'strained' | 'impaired';

export const REGION_COSTS: Record<string, CostField> = {
    lowerBack: 'lowerBackCost',
    knee: 'kneeCost',
    shoulder: 'shoulderCost',
    elbow: 'elbowCost',
    spine: 'axialCost',
    systemic: 'systemicCost',
};

const rating = (exercise: LibraryExercise | undefined, field: CostField): number => {
    const value = exercise?.intelligence?.[field as keyof ExerciseIntelligence];
    return typeof value === 'number' ? value : 4;
};

// ---------------------------------------------------------------------------
// Personal learning
// ---------------------------------------------------------------------------

export interface ExposureRecord {
    exerciseId: string;
    region: string;
    report: RegionReport;
    comparable: boolean;
}

/**
 * Adjusts a cost by at most one ordinal step, and only once three comparable
 * exposures agree. The expert value stays the anchor; this is a correction, not
 * a replacement.
 */
export const learnedCost = (
    exerciseId: string,
    field: CostField,
    exposures: ExposureRecord[],
): { value: number; learned: boolean } => {
    const base = rating(EXERCISE_LIBRARY.find(item => item.id === exerciseId), field);
    const relevant = exposures.filter(exposure => exposure.exerciseId === exerciseId && exposure.comparable && REGION_COSTS[exposure.region] === field);
    if (relevant.length < 3) return { value: base, learned: false };

    const strained = relevant.filter(exposure => exposure.report !== 'normal').length;
    if (strained >= relevant.length * 0.6) return { value: Math.min(4, base + 1), learned: true };
    if (strained === 0) return { value: Math.max(0, base - 1), learned: true };
    return { value: base, learned: false };
};

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------

export interface SwapOption {
    exerciseId: string;
    name: string;
    /** What the replacement is there to do — never dropped in a swap. */
    preservedRole: string;
    costBefore: number;
    costAfter: number;
    /** Plain-language costs of taking this option. Never hidden. */
    tradeoffs: string[];
}

export interface SwapRecommendation {
    plannedExerciseId: string;
    region: string;
    report: RegionReport;
    options: SwapOption[];
    /** Where no single movement preserves the role, two cheaper ones may. */
    split?: { exerciseIds: string[]; rationale: string };
    requiresConfirmation: true;
    message: string;
}

const describe = (exercise: LibraryExercise): string => exercise.name.en;

const tradeoffsFor = (source: LibraryExercise, candidate: LibraryExercise): string[] => {
    const notes: string[] = [];
    if (rating(candidate, 'systemicCost') > rating(source, 'systemicCost')) notes.push('higher overall fatigue');
    if ((candidate.intelligence?.stabilityDemand ?? 0) > (source.intelligence?.stabilityDemand ?? 0)) notes.push('more balance and setup demand');
    if (!candidate.unilateral && source.unilateral) notes.push('loses the unilateral quality');
    if (candidate.unilateral && !source.unilateral) notes.push('takes longer — both sides');
    if ((candidate.intelligence?.lengthenedBias ?? 0) < (source.intelligence?.lengthenedBias ?? 0)) notes.push('less loaded stretch');
    return notes.length ? notes : ['no material downside identified'];
};

export const recommendSwap = (
    plannedExerciseId: string,
    region: string,
    report: RegionReport,
    exposures: ExposureRecord[] = [],
): SwapRecommendation | undefined => {
    if (report === 'normal') return undefined;

    const field = REGION_COSTS[region];
    if (!field) return undefined;

    const source = EXERCISE_LIBRARY.find(item => item.id === plannedExerciseId);
    if (!source) return undefined;

    const before = learnedCost(plannedExerciseId, field, exposures).value;

    const ranked = rankExerciseSwaps({ source, candidates: EXERCISE_LIBRARY })
        .filter(candidate => learnedCost(candidate.exercise.id, field, exposures).value < before);

    const options: SwapOption[] = ranked.slice(0, 4).map(candidate => ({
        exerciseId: candidate.exercise.id,
        name: describe(candidate.exercise),
        preservedRole: source.pattern,
        costBefore: before,
        costAfter: learnedCost(candidate.exercise.id, field, exposures).value,
        tradeoffs: tradeoffsFor(source, candidate.exercise),
    }));

    // When one movement cannot carry the role cheaply, two can: a lighter
    // compound for the pattern plus an isolation for the muscle it stops
    // loading hard enough.
    const split = options.length === 0
        ? splitFor(source, field, exposures)
        : undefined;

    return {
        plannedExerciseId,
        region,
        report,
        options,
        split,
        requiresConfirmation: true,
        message: options.length
            ? `${options.length} option${options.length === 1 ? '' : 's'} keep the ${source.pattern} role at a lower ${region} cost. Nothing changes until you confirm.`
            : split
                ? 'No single movement preserves this role cheaply — two lighter movements can cover it instead.'
                : `No lower-cost option exists for this ${source.pattern} slot. Reduce load or range, or skip the slot today.`,
    };
};

/**
 * Rule-based, not a score. The split preserves the pattern with a cheaper
 * compound and adds an isolation for the primary muscle; if either half is
 * missing, no split is offered rather than a half-preserved one.
 */
const splitFor = (source: LibraryExercise, field: CostField, exposures: ExposureRecord[]) => {
    const before = learnedCost(source.id, field, exposures).value;
    const cheaperCompound = EXERCISE_LIBRARY
        .filter(item => item.status === 'active' && item.pattern === source.pattern && item.id !== source.id)
        .filter(item => learnedCost(item.id, field, exposures).value < before)
        .sort((a, b) => learnedCost(a.id, field, exposures).value - learnedCost(b.id, field, exposures).value)[0];

    const isolation = EXERCISE_LIBRARY
        .filter(item => item.status === 'active' && item.primary.length === 1 && source.primary.includes(item.primary[0]))
        .filter(item => learnedCost(item.id, field, exposures).value < before)
        .sort((a, b) => learnedCost(a.id, field, exposures).value - learnedCost(b.id, field, exposures).value)[0];

    if (!cheaperCompound || !isolation) return undefined;
    return {
        exerciseIds: [cheaperCompound.id, isolation.id],
        rationale: `${describe(cheaperCompound)} keeps the movement pattern and ${describe(isolation)} keeps the muscle working, both below the cost that bothered you.`,
    };
};

// ---------------------------------------------------------------------------
// Did the swap help?
// ---------------------------------------------------------------------------

export interface SwapOutcome {
    acceptedExerciseId: string;
    replacedExerciseId: string;
    /** Region report at the following exposure. */
    followUpReport: RegionReport;
    /** Whether the following exposure performed at least as well. */
    performanceHeld: boolean;
}

export const swapVerdict = (outcome: SwapOutcome): 'helped' | 'mixed' | 'did-not-help' => {
    if (outcome.followUpReport === 'normal' && outcome.performanceHeld) return 'helped';
    if (outcome.followUpReport === 'impaired' && !outcome.performanceHeld) return 'did-not-help';
    return 'mixed';
};
