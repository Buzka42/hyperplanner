/**
 * Client side of the AI proxy.
 *
 * There is no API key in this file, and there must never be one: the browser
 * calls a callable function, the function holds the key. Every entry point here
 * degrades to `undefined` rather than throwing into a training session — a
 * model being unavailable is never allowed to block logging a set.
 */

import { doc, getDoc } from 'firebase/firestore';
import { app, db } from '../firebase';

/**
 * The Functions SDK is loaded on first use, not at module scope.
 *
 * Initialising it eagerly threw `Service functions is not available` during app
 * start-up and took the whole shell down with it — an AI feature nobody has
 * switched on must not be able to do that.
 */
const getCallable = async <Request, Response>(name: string) => {
    const { getFunctions, httpsCallable } = await import('firebase/functions');
    return httpsCallable<Request, Response>(getFunctions(app, 'europe-central2'), name);
};

export type AiFeature = 'oracle' | 'videoAnalysis';

export type AiConfig = {
    enabled: boolean;
    model: string;
    features: Record<AiFeature, boolean>;
    dailyRequestLimit: number;
};

export const DEFAULT_AI_CONFIG: AiConfig = {
    enabled: false,
    model: 'gemini-2.5-flash',
    features: { oracle: false, videoAnalysis: false },
    dailyRequestLimit: 50,
};

/** Off unless the config says otherwise — a missing document means disabled. */
export const loadAiConfig = async (): Promise<AiConfig> => {
    try {
        const snapshot = await getDoc(doc(db, 'appConfig', 'ai'));
        if (!snapshot.exists()) return DEFAULT_AI_CONFIG;
        const data = snapshot.data() as Partial<AiConfig>;
        return {
            ...DEFAULT_AI_CONFIG,
            ...data,
            features: { ...DEFAULT_AI_CONFIG.features, ...(data.features ?? {}) },
        };
    } catch {
        return DEFAULT_AI_CONFIG;
    }
};

export interface CompletionRequest {
    feature: AiFeature;
    prompt: string;
    systemInstruction?: string;
    json?: boolean;
}

export const aiComplete = async (request: CompletionRequest): Promise<string | undefined> => {
    try {
        const call = await getCallable<CompletionRequest, { text: string; model: string }>('aiComplete');
        const result = await call(request);
        return result.data.text;
    } catch (error) {
        console.warn('AI completion unavailable', error);
        return undefined;
    }
};

export interface LiftAnalysis {
    lift: 'squat' | 'bench' | 'deadlift';
    summary: string;
    observations: string[];
    suggestions: string[];
    confidence: 'low' | 'medium' | 'high';
    repCount: number | null;
    /** Always true. The app must never turn this into a prescription change. */
    advisoryOnly: true;
}

/**
 * Sends a clip for analysis. The video is passed inline and is not stored
 * anywhere — not in Storage, not in Firestore, not in the returned document.
 */
export const analyzeLiftVideo = async (
    lift: LiftAnalysis['lift'],
    file: Blob,
): Promise<LiftAnalysis | undefined> => {
    try {
        const videoBase64 = await toBase64(file);
        const call = await getCallable<
            { lift: string; videoBase64: string; mimeType: string },
            LiftAnalysis
        >('aiAnalyzeLift');
        const result = await call({ lift, videoBase64, mimeType: file.type || 'video/mp4' });
        return result.data;
    } catch (error) {
        console.warn('Lift analysis unavailable', error);
        return undefined;
    }
};

const toBase64 = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
        const result = String(reader.result ?? '');
        resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.readAsDataURL(blob);
});
