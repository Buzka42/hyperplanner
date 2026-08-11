/**
 * LAZARUS — the Memory Curve.
 *
 * A returning athlete's problem is not that they have no data; it is that the
 * data is old and they remember the wrong number. The Memory Curve shows two
 * points explicitly — the lifetime best and the last *stable* performance
 * before the break — and prescribes from the second, never the first.
 *
 * Nothing here is rehabilitation. Where an injury caused the break, the plan
 * says so in copy and points at a professional; it does not model it.
 */

import { transferConfidence, type TransferDistance } from '../workout/engines';
import type { LazarusStatus } from '../../types';

export interface MemoryPoint {
    lifetimeBestKg?: number;
    preBreakKg?: number;
    source: 'profile' | 'self-reported';
}

export interface OpeningPrescription {
    /** Undefined means: no usable memory, open with a calibration set. */
    openingKg?: number;
    percentOfPreBreak: number;
    confidence: 'high' | 'medium' | 'low' | 'expired';
    requiresCalibration: boolean;
    rationale: string;
}

/**
 * Detraining discount applied to the last stable pre-break load.
 *
 * Deliberately conservative and deliberately flat after a year: past that
 * point the old number stops being evidence and calibration is more honest
 * than a curve pretending to extrapolate.
 */
export const detrainingFactor = (breakMonths: number): number => {
    if (breakMonths < 3) return 0.9;
    if (breakMonths < 6) return 0.8;
    if (breakMonths < 12) return 0.7;
    return 0.6;
};

export const openingLoad = (
    point: MemoryPoint | undefined,
    breakMonths: number,
    distance: TransferDistance = 'exact',
    sourceDate = new Date().toISOString(),
    now = new Date().toISOString(),
): OpeningPrescription => {
    const percent = detrainingFactor(breakMonths);

    if (!point?.preBreakKg) {
        return {
            percentOfPreBreak: percent,
            confidence: 'low',
            requiresCalibration: true,
            rationale: 'No stable pre-break load for this movement — the first working set is a calibration set.',
        };
    }

    const { confidence } = transferConfidence({ distance, sourceDate, now, detrainingReported: true });

    // Anything past a close variation is a different lift for prescription
    // purposes, however good the old number was.
    if (distance === 'same-pattern' || distance === 'same-muscle' || confidence === 'expired') {
        return {
            openingKg: Math.round((point.preBreakKg * percent * 0.85) / 2.5) * 2.5,
            percentOfPreBreak: percent * 0.85,
            confidence: confidence === 'expired' ? 'expired' : 'low',
            requiresCalibration: true,
            rationale: 'Only indirect history exists for this movement, so the opening load is a starting point to calibrate against.',
        };
    }

    return {
        openingKg: Math.round((point.preBreakKg * percent) / 2.5) * 2.5,
        percentOfPreBreak: percent,
        confidence,
        requiresCalibration: point.source === 'self-reported',
        rationale: point.source === 'self-reported'
            ? 'Opened from your reported pre-break load; the first exposure confirms it.'
            : 'Opened from your last stable pre-break performance, discounted for the time away.',
    };
};

/**
 * Weeks 1–2 are capped whatever the athlete's readiness says.
 *
 * This is the one place the plan overrules the person using it: coming back
 * feeling strong is exactly the state that produces a week-3 injury.
 */
export const weekSetCap = (week: number, baseSets: number): number => {
    if (week <= 2) return Math.min(baseSets, 2);
    return baseSets;
};

export const capIsHard = (week: number): boolean => week <= 2;

export interface AccelerationOutcome {
    accelerate: boolean;
    reason: string;
}

/**
 * Two clean sessions where the prescription was clearly an underestimate
 * accelerate progression. One is noise; two is a pattern.
 */
export const shouldAccelerate = (status: LazarusStatus | undefined, week: number): AccelerationOutcome => {
    if (week <= 2) return { accelerate: false, reason: 'Weeks 1–2 are capped regardless of how easy the work feels.' };
    const recent = (status?.underestimated ?? []).filter(entry => entry.week >= week - 3);
    if (recent.length >= 2) {
        return { accelerate: true, reason: 'Two clean sessions came in well under target — jumps increase from here.' };
    }
    return { accelerate: false, reason: 'Progression continues at the standard step.' };
};

/** Copy shown when the athlete says the break was caused by injury. */
export const injuryReturnGuidance = (breakMonths: number) => ({
    heading: 'This plan is not rehabilitation.',
    body: 'Lazarus assumes you are cleared to train. If the injury still limits you, see a trainer or physiotherapist first.',
    suggestion: breakMonths >= 12 ? 'apex-predator' : undefined,
});
