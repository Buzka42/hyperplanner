import React from 'react';
import { Repeat2, Timer, Zap } from 'lucide-react';

import { techniqueLabel } from '../../data/planBuilder';
import type { IntensityTechniqueSpec } from '../../data/exercises/types';
import { formatRest } from './formatRest';

/**
 * The structured parts of a prescription: superset pairing, tempo, rest and any
 * finishing technique.
 *
 * These were rendered as small grey monospace text the eye slid straight past —
 * a superset read as decoration rather than an instruction. They are now chips
 * with enough weight to register, and each one says what it means on hover and
 * to a screen reader, because "40X0" and "90s" are only obvious if you already
 * know.
 */

/**
 * Tempo digits are separated so the four phases are legible as four numbers.
 *
 * `40X0` is one token to anyone who already knows the convention and noise to
 * everyone else; `4:0:X:0` at least reads as structure.
 */
export const formatTempo = (tempo: string): string => {
    const cleaned = tempo.trim().toUpperCase();
    if (cleaned.includes(':')) return cleaned;
    // Only the canonical four-phase form is reformatted; anything else is
    // author-written prose and is left exactly as it was typed.
    return /^[0-9X]{4}$/.test(cleaned) ? cleaned.split('').join(':') : tempo;
};

const TEMPO_TITLE = 'Tempo — seconds per phase: lowering : pause at the bottom : lifting : pause at the top. X means move it as fast as you can.';
const REST_TITLE = 'Rest between sets of this exercise, before the next one starts.';
const REST_PAIR_TITLE = 'Rest after the pair, once both movements are done. Move straight between them.';

export const PrescriptionBadges: React.FC<{
    pairRole?: string;
    /** Display names of the movements this one alternates with. */
    pairPartners?: string[];
    tempo?: string;
    restSeconds?: number;
    technique?: IntensityTechniqueSpec;
    className?: string;
}> = ({ pairRole, pairPartners = [], tempo, restSeconds, technique, className }) => {
    const hasTechnique = technique && technique.kind !== 'none';
    if (!pairRole && !tempo && !restSeconds && !hasTechnique) return null;

    // A lone label is not a superset — Bench Domination uses roles for grouping
    // without alternation, and calling that a superset would be a lie.
    const supersetted = Boolean(pairRole) && pairPartners.length > 0;
    const partnerText = pairPartners.join(' + ');

    return (
        <div className={`prescription-badges${className ? ` ${className}` : ''}`}>
            {pairRole && (
                <span
                    className={supersetted ? 'prescription-badge is-pair is-superset' : 'prescription-badge is-pair'}
                    title={supersetted
                        ? `Superset ${pairRole} — alternate sets with ${partnerText}. Do one set of each, then rest.`
                        : `Group ${pairRole}`}
                >
                    <Repeat2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="prescription-badge-key">{pairRole}</span>
                    {supersetted && <span className="prescription-badge-partner">with {partnerText}</span>}
                </span>
            )}
            {tempo && (
                <span className="prescription-badge is-tempo" title={TEMPO_TITLE}>
                    <span className="prescription-badge-key">Tempo</span>
                    <span className="prescription-badge-value">{formatTempo(tempo)}</span>
                </span>
            )}
            {typeof restSeconds === 'number' && restSeconds > 0 && (
                <span className="prescription-badge is-rest" title={supersetted ? REST_PAIR_TITLE : REST_TITLE}>
                    <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="prescription-badge-key">Rest</span>
                    <span className="prescription-badge-value">{formatRest(restSeconds)}</span>
                </span>
            )}
            {hasTechnique && (
                <span className="prescription-badge is-technique" title="Finishing technique for this exercise.">
                    <Zap className="h-3.5 w-3.5" aria-hidden="true" />{techniqueLabel(technique)}
                </span>
            )}
        </div>
    );
};
