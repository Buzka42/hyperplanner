import type { SetKind } from '../../data/exercises/types';

export const PERFORMANCE_PROFILE_SCHEMA_VERSION = 1 as const;

export type EstimateConfidence = 'low' | 'standard';
export type SetQuality = 'clean' | 'borderline' | 'invalid';
export type CompletionReason =
    | 'target-met'
    | 'technical-failure'
    | 'muscular-failure'
    | 'pain'
    | 'time-limit'
    | 'stopped-early'
    | 'other';

export interface PerformanceObservation {
    schemaVersion: typeof PERFORMANCE_PROFILE_SCHEMA_VERSION;
    id: string;
    sessionId: string;
    exerciseId: string;
    sourceExerciseId: string;
    date: string;
    programId: string;
    week: number;
    day: number;
    setIndex: number;
    setKind: SetKind;
    reps: number;
    /** Load entered by the athlete. Assistance machines use negative values. */
    externalLoadKg: number;
    totalSystemWeightKg?: number;
    assistanceCategory?: string;
    rir?: number;
    quality?: SetQuality;
    completionReason?: CompletionReason;
    variantId?: string;
    equipmentVersionId?: string;
    estimated1RMKg?: number;
    estimateConfidence: EstimateConfidence;
    comparableEstimate: boolean;
    eligibleForBest: boolean;
}

export interface PerformanceProfileSummary {
    schemaVersion: typeof PERFORMANCE_PROFILE_SCHEMA_VERSION;
    exerciseId: string;
    updatedAt: string;
    observationCount: number;
    latestObservation: PerformanceObservation;
    bestObservation?: PerformanceObservation;
    /** A compact cache; immutable observation documents remain authoritative. */
    recentObservations: PerformanceObservation[];
}

export interface ProfileSetInput {
    reps: string | number;
    weight: string | number;
    completed: boolean | null;
    kind?: SetKind;
    totalSystemWeightKg?: number;
    assistanceCategory?: string;
    rir?: number;
    quality?: SetQuality;
    completionReason?: CompletionReason;
    variantId?: string;
    equipmentVersionId?: string;
}

export interface ProfileExerciseInput {
    /** Slot/source id in the workout prescription. */
    id: string;
    /** Canonical exercise-library id. Required for cross-plan comparison. */
    exerciseId?: string;
    setsData: ProfileSetInput[];
}

export interface ProfileSessionInput {
    sessionId: string;
    date: string;
    programId: string;
    week: number;
    day: number;
    exercises: ProfileExerciseInput[];
}
