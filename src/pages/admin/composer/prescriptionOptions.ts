/**
 * The vocabulary the composer offers for a prescription.
 *
 * Separate from `MovementEditor` so both the editor and the plan-defaults panel
 * can read the same lists — and so the editor file exports only components,
 * which is what keeps fast refresh working during development.
 */

import type { IntensityTechniqueSpec, SwapPolicy } from '../../../data/exercises/types';

export const TECHNIQUE_KINDS: IntensityTechniqueSpec['kind'][] = [
    'none', 'drop-set', 'rest-pause', 'myo-reps', 'cluster', 'partials',
    'one-and-half', 'tempo', 'total-reps', 'back-off', 'wave', 'amrap-finisher',
    'last-set-failure',
];

export const SWAP_POLICIES: { value: SwapPolicy; label: string; help: string }[] = [
    { value: 'locked', label: 'Locked', help: 'No swapping. The plan\'s own legacy alternates still apply.' },
    { value: 'pool', label: 'Chosen list', help: 'Only the exercises you pick below.' },
    { value: 'group', label: 'Swap group', help: 'Anything sharing this movement\'s swap group.' },
    { value: 'any', label: 'Same pattern', help: 'Anything with the same movement pattern.' },
];

export const TECHNIQUE_SCOPES = ['last', 'all', 'first'] as const;

/** Sensible starting parameters so a technique is usable the moment it is picked. */
export const defaultTechnique = (kind: IntensityTechniqueSpec['kind']): IntensityTechniqueSpec => {
    switch (kind) {
        case 'drop-set': return { kind, drops: 2, dropPercent: 20, applyTo: 'last', toFailure: true };
        case 'rest-pause': return { kind, bursts: 3, restSeconds: 15, applyTo: 'last' };
        case 'myo-reps': return { kind, miniSets: 4, miniReps: '3-5', restBreaths: 4 };
        case 'cluster': return { kind, clusters: 4, repsPerCluster: '2', intraRestSeconds: 20 };
        case 'partials': return { kind, extraReps: '5', range: 'bottom', applyTo: 'last' };
        case 'tempo': return { kind, tempo: '40X0' };
        case 'total-reps': return { kind, targetReps: 40 };
        case 'back-off': return { kind, percent: 80, sets: 2, reps: '6' };
        case 'wave': return { kind, ladder: [5, 4, 3], waves: 2 };
        default: return { kind: kind as 'none' };
    }
};
