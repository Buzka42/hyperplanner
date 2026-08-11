/**
 * HyperPlanner AI proxy.
 *
 * The Gemini key lives in Secret Manager and is read only here, on the server.
 * It is never shipped to the browser, never written to Firestore, and never
 * returned in a response — the client calls a callable function and receives
 * text back.
 *
 * Set the key once, from your own machine:
 *
 *     firebase functions:secrets:set GEMINI_API_KEY
 *
 * The model and per-feature switches live in `appConfig/ai`, editable by an
 * admin in the app, so turning a feature off never needs a deploy.
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');

initializeApp();
const db = getFirestore();

const DEFAULT_CONFIG = {
    enabled: false,
    model: 'gemini-2.5-flash',
    features: { oracle: false, videoAnalysis: false },
    /** Requests per user per day. A hard stop, not a warning. */
    dailyRequestLimit: 50,
};

const loadConfig = async () => {
    const snapshot = await db.doc('appConfig/ai').get();
    const stored = snapshot.exists ? snapshot.data() : {};
    return {
        ...DEFAULT_CONFIG,
        ...stored,
        features: { ...DEFAULT_CONFIG.features, ...(stored?.features ?? {}) },
    };
};

/**
 * Per-user daily quota. Costs are the athlete's problem to notice and the
 * owner's to pay, so the limit is enforced server-side where it cannot be
 * edited by a client.
 */
const consumeQuota = async (uid, limit) => {
    const today = new Date().toISOString().slice(0, 10);
    const ref = db.doc(`aiUsage/${uid}`);
    const used = await db.runTransaction(async tx => {
        const snapshot = await tx.get(ref);
        const data = snapshot.exists ? snapshot.data() : {};
        const count = data?.date === today ? (data.count ?? 0) : 0;
        if (count >= limit) return count;
        tx.set(ref, { date: today, count: count + 1, updatedAt: new Date().toISOString() }, { merge: true });
        return count + 1;
    });
    if (used > limit) {
        throw new HttpsError('resource-exhausted', `Daily AI limit of ${limit} requests reached. It resets at midnight UTC.`);
    }
};

const callGemini = async ({ model, apiKey, parts, systemInstruction, responseMimeType }) => {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
            body: JSON.stringify({
                contents: [{ role: 'user', parts }],
                ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
                generationConfig: {
                    temperature: 0.2,
                    ...(responseMimeType ? { responseMimeType } : {}),
                },
            }),
        },
    );

    if (!response.ok) {
        const detail = await response.text();
        // The upstream body can echo request content; log it, do not return it.
        console.error('Gemini request failed', response.status, detail.slice(0, 500));
        throw new HttpsError('unavailable', `The AI service returned ${response.status}.`);
    }

    const body = await response.json();
    const text = body?.candidates?.[0]?.content?.parts?.map(part => part.text).filter(Boolean).join('\n') ?? '';
    if (!text) throw new HttpsError('unavailable', 'The AI service returned an empty response.');
    return text;
};

const requireCaller = request => {
    if (!request.auth?.uid) throw new HttpsError('unauthenticated', 'Sign in before using AI features.');
    return request.auth.uid;
};

/**
 * Generic text/JSON completion. `feature` gates the request against the
 * per-feature switches, so an admin can disable Oracle without disabling video
 * analysis.
 */
export const aiComplete = onCall(
    { secrets: [GEMINI_API_KEY], region: 'europe-central2', cors: true, timeoutSeconds: 60 },
    async request => {
        const uid = requireCaller(request);
        const config = await loadConfig();
        const feature = String(request.data?.feature ?? '');

        if (!config.enabled) throw new HttpsError('failed-precondition', 'AI features are switched off.');
        if (!config.features[feature]) throw new HttpsError('failed-precondition', `The ${feature || 'requested'} feature is switched off.`);

        const prompt = String(request.data?.prompt ?? '').slice(0, 24_000);
        if (!prompt) throw new HttpsError('invalid-argument', 'A prompt is required.');

        await consumeQuota(uid, config.dailyRequestLimit);

        const text = await callGemini({
            model: config.model,
            apiKey: GEMINI_API_KEY.value(),
            parts: [{ text: prompt }],
            systemInstruction: String(request.data?.systemInstruction ?? '').slice(0, 4_000) || undefined,
            responseMimeType: request.data?.json ? 'application/json' : undefined,
        });

        return { text, model: config.model };
    },
);

/**
 * Lift video analysis. The clip is passed inline as base64 and is never stored:
 * it is forwarded to the model and discarded when the request ends.
 *
 * The response is advice. It is not a diagnosis, and nothing in the app is
 * allowed to change a prescription from it.
 */
export const aiAnalyzeLift = onCall(
    { secrets: [GEMINI_API_KEY], region: 'europe-central2', cors: true, timeoutSeconds: 300, memory: '1GiB' },
    async request => {
        const uid = requireCaller(request);
        const config = await loadConfig();

        if (!config.enabled) throw new HttpsError('failed-precondition', 'AI features are switched off.');
        if (!config.features.videoAnalysis) throw new HttpsError('failed-precondition', 'Video analysis is switched off.');

        const lift = String(request.data?.lift ?? '');
        if (!['squat', 'bench', 'deadlift'].includes(lift)) throw new HttpsError('invalid-argument', 'Unsupported lift.');

        const video = String(request.data?.videoBase64 ?? '');
        const mimeType = String(request.data?.mimeType ?? 'video/mp4');
        if (!video) throw new HttpsError('invalid-argument', 'A video is required.');
        // ~18 MB of base64. Larger clips belong in Storage, which this proxy
        // deliberately does not touch.
        if (video.length > 24_000_000) throw new HttpsError('invalid-argument', 'That clip is too large. Trim it to a few working reps.');

        await consumeQuota(uid, config.dailyRequestLimit);

        const text = await callGemini({
            model: config.model,
            apiKey: GEMINI_API_KEY.value(),
            responseMimeType: 'application/json',
            systemInstruction: [
                'You analyse strength-training technique from video for an experienced lifter.',
                'You are not a clinician. Never diagnose an injury and never name a medical condition.',
                'If the camera angle, lighting or framing makes a judgement unreliable, say so and return low confidence instead of guessing.',
                'Return JSON only: {"summary": string, "observations": string[], "suggestions": string[], "confidence": "low"|"medium"|"high", "repCount": number|null}.',
            ].join(' '),
            parts: [
                { inlineData: { mimeType, data: video } },
                { text: `Analyse this ${lift}. Report what you can actually see: bar path, depth or lockout, position changes across reps, and how consistent the reps are. Prefer fewer, well-supported observations over a long list.` },
            ],
        });

        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch {
            throw new HttpsError('unavailable', 'The AI service returned an unreadable response.');
        }

        return {
            lift,
            summary: String(parsed.summary ?? ''),
            observations: Array.isArray(parsed.observations) ? parsed.observations.slice(0, 8).map(String) : [],
            suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 8).map(String) : [],
            confidence: ['low', 'medium', 'high'].includes(parsed.confidence) ? parsed.confidence : 'low',
            repCount: Number.isFinite(parsed.repCount) ? Number(parsed.repCount) : null,
            model: config.model,
            /** Restated on every response so no caller can forget it. */
            advisoryOnly: true,
        };
    },
);
