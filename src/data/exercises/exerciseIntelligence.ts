/**
 * Expert-authored exercise selection and fatigue metadata.
 *
 * The baseline is deliberately deterministic and reviewable: movement pattern,
 * equipment and unilateral demand establish the ordinary profile, then named
 * exceptions correct exercises whose real setup differs materially from their
 * broad family. Ratings are ordinal 0–4, never fake physiological percentages.
 *
 * All resolved entries begin as `codex-v1`. Owner-approved overrides can set
 * `provenance: 'owner-reviewed-v1'` one exercise at a time without forking the
 * rest of the policy.
 */

import type {
    Equipment,
    ExerciseIntelligence,
    LibraryExercise,
    MovementPattern,
} from './types';

type NumericRating = 0 | 1 | 2 | 3 | 4;
type IntelligenceOverride = Partial<ExerciseIntelligence>;

const clamp = (value: number): NumericRating =>
    Math.max(0, Math.min(4, Math.round(value))) as NumericRating;

const hasAny = (equipment: Equipment[], values: Equipment[]) =>
    values.some(value => equipment.includes(value));

const compoundPatterns = new Set<MovementPattern>([
    'horizontal-press', 'incline-press', 'vertical-press', 'horizontal-pull',
    'vertical-pull', 'squat', 'hinge', 'lunge', 'carry',
]);

const isolationPatterns = new Set<MovementPattern>([
    'knee-flexion', 'knee-extension', 'hip-abduction', 'hip-adduction',
    'elbow-flexion', 'elbow-extension', 'shoulder-abduction',
    'shoulder-horizontal-abduction', 'external-rotation', 'calf',
]);

const homeEquipment = new Set<Equipment>([
    'bodyweight', 'dumbbell', 'kettlebell', 'bands', 'ab-wheel', 'bench',
    'plate', 'pull-up-bar', 'dip-station', 'trx',
]);

const baseStability = (exercise: LibraryExercise): NumericRating => {
    const equipment = exercise.equipment;
    let value = hasAny(equipment, ['machine', 'hammer-strength', 'pec-deck', 'leg-extension', 'leg-curl', 'rear-delt-machine'])
        ? 0
        : hasAny(equipment, ['smith', 'hack-squat', 'cable'])
            ? 1
            : hasAny(equipment, ['barbell'])
                ? 2
                : hasAny(equipment, ['dumbbell', 'kettlebell'])
                    ? 2
                    : 1;

    if (exercise.unilateral) value += 1;
    if (exercise.pattern === 'carry') value += 1;
    if (exercise.pattern === 'mobility') value = Math.min(value, 1);
    return clamp(value);
};

const baseSystemic = (exercise: LibraryExercise): NumericRating => {
    const stable = hasAny(exercise.equipment, [
        'machine', 'hammer-strength', 'pec-deck', 'leg-extension', 'leg-curl',
        'rear-delt-machine', 'cable',
    ]);

    let value = 1;
    if (exercise.pattern === 'squat' || exercise.pattern === 'hinge') value = stable ? 2 : 3;
    else if (exercise.pattern === 'carry') value = 3;
    else if (exercise.pattern === 'lunge') value = 2;
    else if (compoundPatterns.has(exercise.pattern)) value = stable ? 1 : 2;
    else if (exercise.pattern.startsWith('core-')) value = 1;
    else if (exercise.pattern === 'mobility') value = 0;
    return clamp(value);
};

const baseAxial = (exercise: LibraryExercise): NumericRating => {
    let value = 0;
    if (exercise.pattern === 'squat') value = hasAny(exercise.equipment, ['barbell', 'smith']) ? 3 : 2;
    if (exercise.pattern === 'hinge') value = hasAny(exercise.equipment, ['barbell']) ? 3 : 1;
    if (exercise.pattern === 'carry') value = 3;
    if (exercise.pattern === 'vertical-press' && hasAny(exercise.equipment, ['barbell', 'dumbbell', 'kettlebell'])) value = 2;
    if (hasAny(exercise.equipment, ['machine', 'bench']) && exercise.pattern !== 'squat') value -= 1;
    return clamp(value);
};

const baseLowerBack = (exercise: LibraryExercise): NumericRating => {
    let value = 0;
    if (exercise.pattern === 'hinge') value = hasAny(exercise.equipment, ['machine']) ? 1 : 3;
    if (exercise.pattern === 'horizontal-pull' && !hasAny(exercise.equipment, ['machine', 'hammer-strength', 'bench', 'cable'])) value = 2;
    if (exercise.pattern === 'squat' && hasAny(exercise.equipment, ['barbell'])) value = 2;
    if (exercise.pattern === 'carry') value = 2;
    return clamp(value);
};

const jointCost = (exercise: LibraryExercise, joint: 'elbow' | 'shoulder' | 'knee'): NumericRating => {
    const pattern = exercise.pattern;
    if (joint === 'elbow') {
        if (pattern === 'elbow-flexion' || pattern === 'elbow-extension') return 2;
        if (pattern === 'vertical-pull' || pattern.includes('press')) return 1;
        return 0;
    }
    if (joint === 'shoulder') {
        if (pattern === 'vertical-press') return 2;
        if (pattern === 'horizontal-press' || pattern === 'incline-press') return 1;
        if (pattern === 'shoulder-abduction' || pattern === 'shoulder-horizontal-abduction') return 1;
        return 0;
    }
    if (pattern === 'squat' || pattern === 'lunge' || pattern === 'knee-extension') return 2;
    if (pattern === 'knee-flexion') return 1;
    return 0;
};

const lengthBias = (pattern: MovementPattern): NumericRating => {
    if (pattern === 'hinge') return 4;
    if (pattern === 'lunge' || pattern === 'incline-press') return 3;
    if (pattern === 'knee-flexion' || pattern === 'elbow-flexion' || pattern === 'elbow-extension') return 3;
    if (pattern === 'horizontal-press' || pattern === 'vertical-pull' || pattern === 'hip-extension') return 2;
    if (pattern === 'mobility') return 3;
    return 1;
};

const shortenedBias = (pattern: MovementPattern): NumericRating => {
    if (pattern === 'hip-abduction' || pattern === 'hip-adduction') return 4;
    if (pattern === 'shoulder-abduction' || pattern === 'shoulder-horizontal-abduction') return 3;
    if (pattern === 'hip-extension' || pattern === 'knee-extension' || pattern === 'calf') return 3;
    if (pattern === 'elbow-flexion' || pattern === 'elbow-extension') return 2;
    return 1;
};

const failureSuitability = (exercise: LibraryExercise): ExerciseIntelligence['failureSuitability'] => {
    if (exercise.failureMode === 'technical') return 'avoid';
    if (isolationPatterns.has(exercise.pattern) && baseStability(exercise) <= 1) return 'suitable';
    if (hasAny(exercise.equipment, ['machine', 'hammer-strength', 'pec-deck', 'leg-extension', 'leg-curl', 'rear-delt-machine'])
        && exercise.pattern !== 'squat' && exercise.pattern !== 'hinge') return 'suitable';
    if (compoundPatterns.has(exercise.pattern)) return 'advanced-only';
    return 'advanced-only';
};

/** Named corrections where pattern/equipment alone would misrepresent the setup. */
const OVERRIDES: Record<string, IntelligenceOverride> = {
    '45-back-extension': { lowerBackCost: 2, axialCost: 0, systemicCost: 1, lengthenedBias: 4 },
    'ab-wheel': { stabilityDemand: 3, systemicCost: 2, lowerBackCost: 2, failureSuitability: 'advanced-only' },
    'ab-wheel-rollout': { stabilityDemand: 3, systemicCost: 2, lowerBackCost: 2, failureSuitability: 'advanced-only' },
    'assisted-pull-up': { stabilityDemand: 1, systemicCost: 1, elbowCost: 1, shoulderCost: 1 },
    'barbell-row': { systemicCost: 3, axialCost: 2, lowerBackCost: 3, stabilityDemand: 2 },
    'behind-the-neck-press': { shoulderCost: 4, failureSuitability: 'avoid' },
    'bodyweight-dip': { shoulderCost: 3, elbowCost: 2, failureSuitability: 'advanced-only', lengthenedBias: 3 },
    'copenhagen-plank': { stabilityDemand: 3, systemicCost: 1, lengthenedBias: 2, shortenedBias: 3 },
    'copenhagen-raise': { stabilityDemand: 3, systemicCost: 1, lengthenedBias: 3, shortenedBias: 4 },
    'dead-hang': { shoulderCost: 2, elbowCost: 1, failureSuitability: 'avoid' },
    'glute-ham-raise': { kneeCost: 1, lengthenedBias: 4, shortenedBias: 2, failureSuitability: 'advanced-only' },
    'good-mornings': { systemicCost: 4, axialCost: 4, lowerBackCost: 4, stabilityDemand: 3, failureSuitability: 'avoid' },
    'heels-off-narrow-leg-press': { kneeCost: 3, systemicCost: 2, stabilityDemand: 0, shortenedBias: 3 },
    'nordic-curl': { kneeCost: 2, lengthenedBias: 4, failureSuitability: 'advanced-only' },
    'reverse-hyperextension': { stabilityDemand: 0, systemicCost: 1, axialCost: 0, lowerBackCost: 1, shortenedBias: 3, failureSuitability: 'avoid' },
    'reverse-nordic-curl': { kneeCost: 3, lengthenedBias: 4, failureSuitability: 'advanced-only' },
    'side-glute-medius-hip-thrust': { stabilityDemand: 2, systemicCost: 0, shortenedBias: 4, lengthenedBias: 1, failureSuitability: 'suitable' },
    'single-leg-glute-bridge': { stabilityDemand: 2, systemicCost: 1, shortenedBias: 4, failureSuitability: 'suitable' },
    'single-leg-hip-thrust': { stabilityDemand: 2, systemicCost: 1, shortenedBias: 4, failureSuitability: 'suitable' },
    'single-leg-machine-hip-thrust': { stabilityDemand: 1, systemicCost: 1, shortenedBias: 4, failureSuitability: 'suitable' },
    'slow-eccentric-cheat-nordic-curl': { kneeCost: 2, lengthenedBias: 4, failureSuitability: 'advanced-only' },
    'stiletto-squat': { stabilityDemand: 2, systemicCost: 2, axialCost: 1, kneeCost: 2, lengthenedBias: 3 },
    'stripper-squat': { stabilityDemand: 0, systemicCost: 1, axialCost: 1, kneeCost: 3, lengthenedBias: 4, shortenedBias: 1, failureSuitability: 'suitable' },
    'supported-sissy-squat': { stabilityDemand: 1, systemicCost: 0, axialCost: 0, kneeCost: 3, lengthenedBias: 4, shortenedBias: 3, failureSuitability: 'suitable' },
    'weighted-dip': { shoulderCost: 3, elbowCost: 2, failureSuitability: 'advanced-only', lengthenedBias: 3 },
};

export const buildExerciseIntelligence = (exercise: LibraryExercise): ExerciseIntelligence => {
    const stabilityDemand = baseStability(exercise);
    const systemicCost = baseSystemic(exercise);
    const systemicCompound = compoundPatterns.has(exercise.pattern)
        && systemicCost >= 2
        && !hasAny(exercise.equipment, ['cable', 'pec-deck', 'rear-delt-machine']);

    const baseline: ExerciseIntelligence = {
        schemaVersion: 1,
        provenance: 'codex-v1',
        stabilityDemand,
        systemicCost,
        axialCost: baseAxial(exercise),
        lowerBackCost: baseLowerBack(exercise),
        elbowCost: jointCost(exercise, 'elbow'),
        shoulderCost: jointCost(exercise, 'shoulder'),
        kneeCost: jointCost(exercise, 'knee'),
        lengthenedBias: lengthBias(exercise.pattern),
        shortenedBias: shortenedBias(exercise.pattern),
        systemicCompound,
        homeCompatible: exercise.equipment.some(item => homeEquipment.has(item)),
        cameraFriendly: ['squat', 'hinge', 'horizontal-press', 'incline-press', 'elbow-flexion', 'shoulder-abduction'].includes(exercise.pattern),
        densityCompatible: systemicCost <= 2 && stabilityDemand <= 2 && exercise.pattern !== 'mobility',
        failureSuitability: failureSuitability(exercise),
    };

    return { ...baseline, ...(OVERRIDES[exercise.id] ?? {}) };
};
