import { collection, doc, runTransaction, type DocumentData } from 'firebase/firestore';
import { db } from '../../firebase';
import { updatePerformanceSummary } from './summary';
import type { PerformanceObservation, PerformanceProfileSummary } from './types';

const observationDocumentId = (observation: PerformanceObservation): string =>
    observation.id.replaceAll('/', '_').slice(0, 512);

/**
 * Creates a workout and its derived profile records atomically. Immutable
 * observation documents are authoritative; the parent document is a compact
 * query cache for plan engines and dashboards.
 */
export const createWorkoutWithPerformanceProfile = async (
    userId: string,
    workoutId: string,
    workout: DocumentData,
    observations: PerformanceObservation[],
): Promise<void> => {
    const workoutRef = doc(db, 'users', userId, 'workouts', workoutId);
    const groups = new Map<string, PerformanceObservation[]>();
    for (const observation of observations) {
        const group = groups.get(observation.exerciseId) ?? [];
        group.push(observation);
        groups.set(observation.exerciseId, group);
    }

    await runTransaction(db, async transaction => {
        // Firestore transactions require every read before the first write.
        const summaries = new Map<string, PerformanceProfileSummary | undefined>();
        for (const exerciseId of groups.keys()) {
            const summaryRef = doc(db, 'users', userId, 'performanceProfile', exerciseId);
            const snapshot = await transaction.get(summaryRef);
            summaries.set(exerciseId, snapshot.exists()
                ? snapshot.data() as PerformanceProfileSummary
                : undefined);
        }

        transaction.set(workoutRef, workout);
        for (const [exerciseId, exerciseObservations] of groups) {
            const summaryRef = doc(db, 'users', userId, 'performanceProfile', exerciseId);
            const summary = updatePerformanceSummary(summaries.get(exerciseId), exerciseObservations);
            if (summary) transaction.set(summaryRef, summary);

            const observationsRef = collection(summaryRef, 'observations');
            for (const observation of exerciseObservations) {
                transaction.set(doc(observationsRef, observationDocumentId(observation)), observation);
            }
        }
    });
};
