import {
    PERFORMANCE_PROFILE_SCHEMA_VERSION,
    type PerformanceObservation,
    type PerformanceProfileSummary,
} from './types';

const RECENT_LIMIT = 10;

const later = (a: PerformanceObservation, b: PerformanceObservation): number =>
    a.date.localeCompare(b.date) || a.id.localeCompare(b.id);

export const updatePerformanceSummary = (
    previous: PerformanceProfileSummary | undefined,
    incoming: PerformanceObservation[],
): PerformanceProfileSummary | undefined => {
    if (!incoming.length) return previous;
    const exerciseId = incoming[0].exerciseId;
    if (incoming.some(observation => observation.exerciseId !== exerciseId)) {
        throw new Error('Performance summaries can only contain one exercise id.');
    }

    const latestObservation = [...incoming, ...(previous ? [previous.latestObservation] : [])]
        .sort(later)
        .at(-1)!;
    const bestCandidates = [
        ...incoming.filter(item => item.eligibleForBest && item.estimated1RMKg != null),
        ...(previous?.bestObservation ? [previous.bestObservation] : []),
    ];
    const bestObservation = bestCandidates.sort((a, b) =>
        (a.estimated1RMKg ?? 0) - (b.estimated1RMKg ?? 0) || later(a, b),
    ).at(-1);

    const recentById = new Map<string, PerformanceObservation>();
    for (const item of [...(previous?.recentObservations ?? []), ...incoming]) recentById.set(item.id, item);
    const recentObservations = [...recentById.values()].sort(later).slice(-RECENT_LIMIT).reverse();

    return {
        schemaVersion: PERFORMANCE_PROFILE_SCHEMA_VERSION,
        exerciseId,
        updatedAt: latestObservation.date,
        observationCount: (previous?.observationCount ?? 0) + incoming.filter(
            item => !(previous?.recentObservations ?? []).some(old => old.id === item.id),
        ).length,
        latestObservation,
        ...(bestObservation && { bestObservation }),
        recentObservations,
    };
};
