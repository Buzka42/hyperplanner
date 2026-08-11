import type { ApexVideoAdvice } from './assessment';
import { analyzeLiftVideo, loadAiConfig } from '../../lib/ai';

export type ApexVideoInput = { lift: ApexVideoAdvice['lift']; file: File };

/**
 * Optional lift analysis, served by the `aiAnalyzeLift` callable.
 *
 * The clip goes to the function, which forwards it to Gemini and discards it —
 * nothing is written to Storage or Firestore, and the API key never leaves the
 * server. The result is advice: it is stored on the assessment for the athlete
 * to read, and no prescription in the app is permitted to change because of it.
 *
 * Low confidence is preserved rather than smoothed over, because a bad camera
 * angle producing a confident-sounding critique is the failure mode this
 * feature has to avoid.
 */
export const requestApexVideoAdvice = async ({ lift, file }: ApexVideoInput): Promise<ApexVideoAdvice> => {
    if (file.size > 18 * 1024 * 1024) throw new Error('Use a video under 18 MB — a few working reps is enough.');

    const config = await loadAiConfig();
    if (!config.enabled || !config.features.videoAnalysis) {
        throw new Error('AI video analysis is switched off.');
    }

    const analysis = await analyzeLiftVideo(lift, file);
    if (!analysis) throw new Error('Video analysis could not be completed. Your session is unaffected.');

    return {
        lift,
        summary: analysis.summary,
        observations: analysis.observations,
        suggestions: analysis.suggestions,
        confidence: analysis.confidence,
    };
};

/** Whether the feature should be offered at all, checked before rendering it. */
export const videoAdviceAvailable = async (): Promise<boolean> => {
    const config = await loadAiConfig();
    return config.enabled && config.features.videoAnalysis;
};
