import type { ExerciseIntelligence, LibraryExercise } from '../../../data/exercises/types';

const rating = (value: ExerciseIntelligence[keyof ExerciseIntelligence] | undefined): number =>
    typeof value === 'number' ? value : 0;

export interface SwapRequest {
    source: LibraryExercise;
    candidates: LibraryExercise[];
    availableEquipment?: Set<string>;
    maximumSystemicCost?: number;
    maximumJointCost?: Partial<Record<'lowerBackCost' | 'elbowCost' | 'shoulderCost' | 'kneeCost', number>>;
    requireDensityCompatible?: boolean;
}

export interface RankedSwap {
    exercise: LibraryExercise;
    score: number;
    reasons: string[];
}

/** Ranks only role-preserving candidates; the athlete still confirms the swap. */
export const rankExerciseSwaps = (request: SwapRequest): RankedSwap[] => request.candidates
    .filter(candidate => candidate.id !== request.source.id && candidate.status === 'active')
    .filter(candidate => candidate.pattern === request.source.pattern)
    .filter(candidate => candidate.primary.some(muscle => request.source.primary.includes(muscle)))
    .filter(candidate => !request.availableEquipment || candidate.equipment.some(item => request.availableEquipment!.has(item)))
    .filter(candidate => request.maximumSystemicCost == null || rating(candidate.intelligence?.systemicCost) <= request.maximumSystemicCost)
    .filter(candidate => Object.entries(request.maximumJointCost ?? {}).every(([field, maximum]) =>
        rating(candidate.intelligence?.[field as keyof ExerciseIntelligence]) <= maximum,
    ))
    .filter(candidate => !request.requireDensityCompatible || candidate.intelligence?.densityCompatible === true)
    .map(candidate => {
        const primaryOverlap = candidate.primary.filter(muscle => request.source.primary.includes(muscle)).length;
        const sameGroup = !!request.source.swapGroup && candidate.swapGroup === request.source.swapGroup;
        const costImprovement = rating(request.source.intelligence?.systemicCost) - rating(candidate.intelligence?.systemicCost);
        return {
            exercise: candidate,
            score: primaryOverlap * 10 + (sameGroup ? 20 : 0) + costImprovement,
            reasons: [
                'same-pattern',
                `${primaryOverlap}-primary-muscle-overlap`,
                ...(sameGroup ? ['approved-swap-group'] : []),
                ...(costImprovement > 0 ? ['lower-systemic-cost'] : []),
            ],
        };
    })
    .sort((a, b) => b.score - a.score || a.exercise.id.localeCompare(b.exercise.id));
