import React, { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';

import { db, auth } from '../../firebase';
import { DEFAULT_AI_CONFIG, loadAiConfig, type AiConfig, type AiFeature } from '../../lib/ai';

/**
 * AI settings.
 *
 * Deliberately has no key field. The Gemini key is held in Secret Manager and
 * read only by the callable functions, so it never travels through the browser
 * or Firestore. Everything here is a switch: which model, what is turned on,
 * and how many requests a single athlete may spend in a day.
 */
export const AiTab: React.FC = () => {
    const [config, setConfig] = useState<AiConfig>(DEFAULT_AI_CONFIG);
    const [status, setStatus] = useState<string>();
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadAiConfig().then(setConfig); }, []);

    const save = async (next: AiConfig) => {
        setConfig(next);
        setSaving(true);
        try {
            await setDoc(doc(db, 'appConfig', 'ai'), {
                enabled: next.enabled,
                model: next.model,
                features: next.features,
                dailyRequestLimit: next.dailyRequestLimit,
                updatedAt: new Date().toISOString(),
                updatedBy: auth.currentUser?.uid ?? 'unknown',
            }, { merge: true });
            setStatus('Saved.');
        } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Could not save.');
        } finally {
            setSaving(false);
        }
    };

    const toggleFeature = (feature: AiFeature) =>
        save({ ...config, features: { ...config.features, [feature]: !config.features[feature] } });

    return (
        <section className="admin-panel">
            <header className="admin-panel-header">
                <h2>AI</h2>
                <p className="text-sm text-muted-foreground">
                    The Gemini key lives in Secret Manager, not here. Set it once from your own machine with
                    {' '}<code>firebase functions:secrets:set GEMINI_API_KEY</code>, then deploy the functions.
                </p>
            </header>

            <div className="admin-panel-body space-y-6">
                <label className="flex items-center gap-3">
                    <input type="checkbox" checked={config.enabled} disabled={saving}
                        onChange={() => save({ ...config, enabled: !config.enabled })} />
                    <span><strong>AI enabled</strong> — the master switch. Everything below is ignored while this is off.</span>
                </label>

                <label className="block">
                    <span className="block text-sm mb-1">Model</span>
                    <input className="admin-input" value={config.model} disabled={saving}
                        onChange={event => setConfig({ ...config, model: event.target.value })}
                        onBlur={() => save(config)} />
                    <span className="block text-xs text-muted-foreground mt-1">
                        Gemini model id, for example <code>gemini-2.5-flash</code> or <code>gemini-2.5-pro</code>.
                    </span>
                </label>

                <fieldset className="space-y-2">
                    <legend className="text-sm font-medium">Features</legend>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" checked={config.features.oracle} disabled={saving || !config.enabled}
                            onChange={() => toggleFeature('oracle')} />
                        <span>Oracle predictions — the plan still works without this, using its transparent priors.</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" checked={config.features.videoAnalysis} disabled={saving || !config.enabled}
                            onChange={() => toggleFeature('videoAnalysis')} />
                        <span>Lift video analysis — advisory only, and never changes a prescription.</span>
                    </label>
                </fieldset>

                <label className="block">
                    <span className="block text-sm mb-1">Daily request limit per athlete</span>
                    <input className="admin-input" type="number" min={0} max={1000} value={config.dailyRequestLimit} disabled={saving}
                        onChange={event => setConfig({ ...config, dailyRequestLimit: Number(event.target.value) })}
                        onBlur={() => save(config)} />
                    <span className="block text-xs text-muted-foreground mt-1">
                        Enforced on the server, so a client cannot spend past it.
                    </span>
                </label>

                <p className="text-sm text-muted-foreground">
                    Video clips are forwarded to the model and discarded when the request ends. They are not written to
                    Storage or Firestore.
                </p>

                {status && <p className="text-sm">{status}</p>}
            </div>
        </section>
    );
};
