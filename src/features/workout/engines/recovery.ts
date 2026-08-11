import type { RecoveryResponse } from './types';

export interface RecoveryRecommendation {
    action: 'continue' | 'reduce-volume' | 'stop-and-substitute';
    volumeMultiplier: number;
    requiresConfirmation: boolean;
    recommendConsultation: boolean;
}

export const recoveryRecommendation = (
    response: RecoveryResponse,
    painReported = false,
): RecoveryRecommendation => {
    if (painReported) return {
        action: 'stop-and-substitute',
        volumeMultiplier: 0,
        requiresConfirmation: true,
        recommendConsultation: true,
    };
    if (response === 'performance-impaired') return {
        action: 'reduce-volume', volumeMultiplier: 0.7, requiresConfirmation: true, recommendConsultation: false,
    };
    if (response === 'somewhat-fatigued') return {
        action: 'reduce-volume', volumeMultiplier: 0.85, requiresConfirmation: true, recommendConsultation: false,
    };
    return { action: 'continue', volumeMultiplier: 1, requiresConfirmation: false, recommendConsultation: false };
};
