/**
 * ORACLE — next-session prediction.
 *
 * The plan's job is to find out whether the app can predict what an athlete
 * will do before they do it. Two design rules keep that honest:
 *
 *   1. The prediction is always computable without a model. Transparent priors
 *      produce the number; the AI, when enabled, may only *refine* it inside a
 *      bounded window. A model outage degrades the prediction, never the
 *      session.
 *   2. Confidence is earned by comparable evidence, not asserted. Low
 *      confidence offers calibration instead of pretending.
 *
 * Prediction error is measured on what was actually prescribed — load, reps and
 * reported RIR — rather than on e1RM alone, because e1RM hides exactly the
 * errors this plan exists to find.
 */

import { aiComplete } from '../../lib/ai';

export type Confidence = 'low' | 'medium' | 'high';

export interface Exposure {
    date: string;
    loadKg: number;
    reps: number;
    rir?: number;
    /** Same exercise, variant and equipment. Anything else is not comparable. */
    comparable: boolean;
    /** Illness, travel, bad sleep — reduces this exposure's weight. */
    externalFactor?: boolean;
}

export interface Prediction {
    loadKg: number;
    reps: [number, number];
    sets: number;
    confidence: Confidence;
    /** Shown for medium confidence; a single editable target for high. */
    range?: [number, number];
    offersCalibration: boolean;
    rationale: string;
    source: 'priors' | 'priors+model';
}

const DAY = 86_400_000;
const daysAgo = (iso: string, now: number) => Math.max(0, (now - new Date(iso).getTime()) / DAY);

/**
 * High confidence needs at least three comparable exposures *and* one of them
 * within four weeks. Three exposures from last winter describe a different
 * athlete.
 */
export const assessConfidence = (exposures: Exposure[], now = Date.now()): Confidence => {
    const comparable = exposures.filter(exposure => exposure.comparable);
    const recent = comparable.filter(exposure => daysAgo(exposure.date, now) <= 28);
    if (comparable.length >= 3 && recent.length >= 1) return 'high';
    if (comparable.length >= 1) return 'medium';
    return 'low';
};

const epley = (loadKg: number, reps: number) => loadKg * (1 + reps / 30);

/**
 * The transparent prior: a weighted recent average of estimated capability,
 * discounted for staleness, with flagged sessions counted at a third.
 */
const priorEstimate = (exposures: Exposure[], now: number): number | undefined => {
    const usable = exposures.filter(exposure => exposure.comparable && exposure.reps > 0);
    if (!usable.length) return undefined;

    let weighted = 0;
    let weight = 0;
    for (const exposure of usable) {
        const age = daysAgo(exposure.date, now);
        const recency = Math.max(0.2, 1 - age / 120);
        // An anomaly still carries information; it just should not dominate.
        const factor = exposure.externalFactor ? 1 / 3 : 1;
        // RIR is evidence about the load, not decoration: two reps in reserve
        // means the set understated what the athlete could do.
        const effective = epley(exposure.loadKg, exposure.reps + (exposure.rir ?? 0));
        weighted += effective * recency * factor;
        weight += recency * factor;
    }
    return weight > 0 ? weighted / weight : undefined;
};

const round2p5 = (value: number) => Math.round(value / 2.5) * 2.5;

export interface PredictionRequest {
    exerciseId: string;
    targetReps: [number, number];
    sets: number;
    exposures: Exposure[];
    now?: number;
}

/** The prior-only prediction. Always available, and always the fallback. */
export const predictFromPriors = (request: PredictionRequest): Prediction => {
    const now = request.now ?? Date.now();
    const confidence = assessConfidence(request.exposures, now);
    const estimate = priorEstimate(request.exposures, now);
    const midReps = (request.targetReps[0] + request.targetReps[1]) / 2;

    if (!estimate) {
        return {
            loadKg: 0,
            reps: request.targetReps,
            sets: request.sets,
            confidence: 'low',
            offersCalibration: true,
            rationale: 'No comparable history for this movement yet — the first working set is a calibration set.',
            source: 'priors',
        };
    }

    const loadKg = round2p5(estimate / (1 + midReps / 30));

    if (confidence === 'low') {
        return {
            loadKg, reps: request.targetReps, sets: request.sets, confidence,
            offersCalibration: true,
            rationale: 'Only indirect evidence so far. Treat this as a starting point and calibrate.',
            source: 'priors',
        };
    }

    if (confidence === 'medium') {
        return {
            loadKg, reps: request.targetReps, sets: request.sets, confidence,
            range: [round2p5(loadKg * 0.94), round2p5(loadKg * 1.06)],
            offersCalibration: false,
            rationale: 'One or two comparable sessions — a range is the honest answer.',
            source: 'priors',
        };
    }

    return {
        loadKg, reps: request.targetReps, sets: request.sets, confidence,
        offersCalibration: false,
        rationale: 'Three or more comparable sessions, including a recent one. Edit the target if today feels different.',
        source: 'priors',
    };
};

/**
 * Optional model refinement, bounded to ±7.5% of the prior.
 *
 * The bound is the entire safety argument: a model that hallucinates a number
 * can only nudge the prescription, and a model that is unavailable changes
 * nothing at all.
 */
export const refineWithModel = async (
    prediction: Prediction,
    request: PredictionRequest,
): Promise<Prediction> => {
    if (prediction.confidence === 'low' || !prediction.loadKg) return prediction;

    const history = request.exposures
        .filter(exposure => exposure.comparable)
        .slice(-8)
        .map(exposure => `${exposure.date}: ${exposure.loadKg}kg x ${exposure.reps}${exposure.rir != null ? ` @${exposure.rir} RIR` : ''}${exposure.externalFactor ? ' (flagged session)' : ''}`)
        .join('\n');

    const text = await aiComplete({
        feature: 'oracle',
        json: true,
        systemInstruction: 'You adjust a strength prescription that was already computed from the athlete\'s history. Return JSON only: {"loadKg": number, "rationale": string}. Stay within 7.5% of the given load. If the history gives you no reason to change it, return it unchanged.',
        prompt: `Movement: ${request.exerciseId}\nTarget: ${request.sets} sets of ${request.targetReps.join('-')} reps\nComputed load: ${prediction.loadKg} kg\n\nRecent comparable sessions:\n${history}`,
    });

    if (!text) return prediction;

    try {
        const parsed = JSON.parse(text) as { loadKg?: number; rationale?: string };
        const proposed = Number(parsed.loadKg);
        if (!Number.isFinite(proposed)) return prediction;

        // Clamp rather than trust. A model outside the window is wrong by
        // definition here, not interesting.
        const low = prediction.loadKg * 0.925;
        const high = prediction.loadKg * 1.075;
        const clamped = round2p5(Math.min(high, Math.max(low, proposed)));

        return {
            ...prediction,
            loadKg: clamped,
            rationale: parsed.rationale ? `${prediction.rationale} ${parsed.rationale}` : prediction.rationale,
            source: 'priors+model',
        };
    } catch {
        return prediction;
    }
};

export const predict = async (request: PredictionRequest, useModel: boolean): Promise<Prediction> => {
    const prediction = predictFromPriors(request);
    return useModel ? refineWithModel(prediction, request) : prediction;
};

// ---------------------------------------------------------------------------
// Accuracy
// ---------------------------------------------------------------------------

export interface PredictionOutcome {
    predictedLoadKg: number;
    predictedReps: [number, number];
    actualLoadKg: number;
    actualReps: number;
    actualRir?: number;
    confidence: Confidence;
}

/**
 * Error on the whole prescription, not on e1RM: load error plus rep error plus
 * an RIR penalty when the athlete finished much fresher or much closer to
 * failure than the target implied.
 */
export const predictionError = (outcome: PredictionOutcome): number => {
    const loadError = outcome.predictedLoadKg > 0
        ? Math.abs(outcome.actualLoadKg - outcome.predictedLoadKg) / outcome.predictedLoadKg
        : 1;
    const [low, high] = outcome.predictedReps;
    const repMiss = outcome.actualReps < low ? low - outcome.actualReps
        : outcome.actualReps > high ? outcome.actualReps - high
            : 0;
    const repError = repMiss / Math.max(1, high);
    const rirError = outcome.actualRir == null ? 0 : Math.max(0, Math.abs(outcome.actualRir - 2) - 1) * 0.05;
    return Math.round((loadError + repError + rirError) * 1000) / 1000;
};

export type AccuracyBand = 'sharp' | 'usable' | 'loose' | 'unreliable';

/** Honest bands. No standardised percentage until the sample supports one. */
export const accuracyBand = (errors: number[]): { band: AccuracyBand; sample: number; note: string } => {
    if (errors.length < 5) {
        return { band: 'unreliable', sample: errors.length, note: 'Too few predictions to describe accuracy yet.' };
    }
    const mean = errors.reduce((sum, value) => sum + value, 0) / errors.length;
    const band: AccuracyBand = mean <= 0.05 ? 'sharp' : mean <= 0.1 ? 'usable' : mean <= 0.2 ? 'loose' : 'unreliable';
    return { band, sample: errors.length, note: `Mean error ${(mean * 100).toFixed(1)}% across ${errors.length} predictions.` };
};

/** Is the trend improving? Compared as halves, which needs a real sample. */
export const accuracyTrend = (errors: number[]): 'improving' | 'flat' | 'worsening' | 'unknown' => {
    if (errors.length < 8) return 'unknown';
    const half = Math.floor(errors.length / 2);
    const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
    const early = mean(errors.slice(0, half));
    const late = mean(errors.slice(half));
    if (late < early * 0.9) return 'improving';
    if (late > early * 1.1) return 'worsening';
    return 'flat';
};
