import {
    PERFORMANCE_PROFILE_SCHEMA_VERSION,
    type PerformanceObservation,
    type ProfileSessionInput,
} from './types';

const numeric = (value: string | number): number | null => {
    const parsed = typeof value === 'number' ? value : Number(value.trim().replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : null;
};

/** Epley is intentionally transparent and approximate; confidence is recorded separately. */
export const estimateOneRepMax = (loadKg: number, reps: number): number =>
    Math.round((loadKg * (1 + reps / 30)) * 10) / 10;

export const extractPerformanceObservations = (
    session: ProfileSessionInput,
): PerformanceObservation[] => {
    const observations: PerformanceObservation[] = [];

    for (const exercise of session.exercises) {
        if (!exercise.exerciseId) continue;
        const exerciseId = exercise.exerciseId;

        exercise.setsData.forEach((set, setIndex) => {
            const kind = set.kind ?? 'work';
            // Warmups and technique fragments remain in the workout log but are
            // not comparable independent performances. User-added extras are.
            if (!set.completed || (kind !== 'work' && kind !== 'extra')) return;

            const reps = numeric(set.reps);
            const externalLoadKg = numeric(set.weight);
            if (reps == null || externalLoadKg == null || reps <= 0) return;

            const estimateLoad = set.totalSystemWeightKg ?? externalLoadKg;
            const reliableRepRange = reps >= 5 && reps <= 15;
            const hasComparableLoad = estimateLoad > 0;
            const qualityEligible = set.quality !== 'invalid' && set.quality !== 'borderline';
            const comparableEstimate = hasComparableLoad && qualityEligible;
            const id = `${session.sessionId}-${exercise.id}-${setIndex}`;

            observations.push({
                schemaVersion: PERFORMANCE_PROFILE_SCHEMA_VERSION,
                id,
                sessionId: session.sessionId,
                exerciseId,
                sourceExerciseId: exercise.id,
                date: session.date,
                programId: session.programId,
                week: session.week,
                day: session.day,
                setIndex,
                setKind: kind,
                reps,
                externalLoadKg,
                ...(set.totalSystemWeightKg != null && { totalSystemWeightKg: set.totalSystemWeightKg }),
                ...(set.assistanceCategory && { assistanceCategory: set.assistanceCategory }),
                ...(set.rir != null && { rir: set.rir }),
                ...(set.quality && { quality: set.quality }),
                ...(set.completionReason && { completionReason: set.completionReason }),
                ...(set.variantId && { variantId: set.variantId }),
                ...(set.equipmentVersionId && { equipmentVersionId: set.equipmentVersionId }),
                ...(hasComparableLoad && { estimated1RMKg: estimateOneRepMax(estimateLoad, reps) }),
                estimateConfidence: reliableRepRange ? 'standard' : 'low',
                comparableEstimate,
                eligibleForBest: comparableEstimate && reliableRepRange,
            });
        });
    }

    return observations;
};
