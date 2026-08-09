import React from 'react';
import { Link2, Timer, Zap } from 'lucide-react';

import { techniqueLabel } from '../../data/planBuilder';
import type { IntensityTechniqueSpec } from '../../data/exercises/types';
import { formatRest } from './formatRest';

/**
 * Renders the structured parts of a prescription that used to be buried in a
 * free-text notes line: superset role, tempo, rest, and finishing technique.
 *
 * The new plans set these on every slot, so "A1 · Tempo 40X0 · Rest 90s" was
 * arriving as one grey sentence the eye slides past.
 */
export const PrescriptionBadges: React.FC<{
    pairRole?: string;
    tempo?: string;
    restSeconds?: number;
    technique?: IntensityTechniqueSpec;
    className?: string;
}> = ({ pairRole, tempo, restSeconds, technique, className }) => {
    const hasTechnique = technique && technique.kind !== 'none';
    if (!pairRole && !tempo && !restSeconds && !hasTechnique) return null;

    return (
        <div className={`prescription-badges${className ? ` ${className}` : ''}`}>
            {pairRole && (
                <span className="prescription-badge is-pair" title="Perform back to back with its partner">
                    <Link2 className="h-3 w-3" />{pairRole}
                </span>
            )}
            {tempo && (
                <span
                    className="prescription-badge"
                    title="Eccentric · pause · concentric · pause, in seconds. X means explosive."
                >
                    {tempo}
                </span>
            )}
            {typeof restSeconds === 'number' && restSeconds > 0 && (
                <span className="prescription-badge">
                    <Timer className="h-3 w-3" />{formatRest(restSeconds)}
                </span>
            )}
            {hasTechnique && (
                <span className="prescription-badge is-technique">
                    <Zap className="h-3 w-3" />{techniqueLabel(technique)}
                </span>
            )}
        </div>
    );
};
