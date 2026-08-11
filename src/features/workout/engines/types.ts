import type { CompletionReason, SetQuality } from '../../performanceProfile';

export interface EvaluatedSet {
    reps: number;
    weightKg: number;
    completed: boolean;
    rir?: number;
    quality?: SetQuality;
    completionReason?: CompletionReason;
}

export type ProgressionDecision = 'progress' | 'hold' | 'regress';

export interface ProgressionOutcome {
    decision: ProgressionDecision;
    nextLoadKg: number;
    reason: string;
}

export type RecoveryResponse = 'recovered' | 'somewhat-fatigued' | 'performance-impaired';

export interface SessionSlot {
    id: string;
    sets: number;
    priority: number;
    /** Main lift/frequency anchors survive before accessory work. */
    protected?: boolean;
    minimumSets?: number;
}
