/**
 * QUADFATHER — roles, range of motion and knee feedback.
 *
 * A quad specialisation goes wrong in two predictable ways: it becomes three
 * copies of the same heavy squat pattern, or it becomes a pile of leg
 * extensions. The plan therefore assigns every quad slot one of three roles and
 * checks the balance rather than the total, and it treats depth as something
 * confirmed rather than assumed.
 */

import { EXERCISE_BY_ID } from '../../data/exercises/library';
import type { QuadfatherStatus } from '../../types';

export type QuadRole = 'load' | 'depth' | 'burn';

/** Authored assignment: a movement's role is a plan decision, not a property. */
export const QUAD_ROLES: Record<string, QuadRole> = {
    'hack-squat': 'load',
    'barbell-squat': 'load',
    'stiletto-squat': 'load',
    'leg-press': 'load',
    'front-foot-elevated-bulgarian-split-squat': 'depth',
    'knee-over-toe-split-squat': 'depth',
    'goblet-heel-elevated-squat': 'depth',
    'heel-elevated-goblet-squat': 'depth',
    'weighted-step-up': 'depth',
    'deficit-reverse-lunge': 'depth',
    'leg-extension': 'burn',
    'supported-sissy-squat': 'burn',
    'reverse-nordic-curl': 'burn',
    // Stripper Squat is a burn movement. It is not a late-plan strength
    // variation, however heavy it can be loaded.
    'stripper-squat': 'burn',
};

export const roleOf = (exerciseId: string): QuadRole | undefined => QUAD_ROLES[exerciseId];

/** The burn pool, kept explicit so a swap cannot promote a burn movement. */
export const BURN_POOL = Object.entries(QUAD_ROLES).filter(([, role]) => role === 'burn').map(([id]) => id);

export const roleBalance = (exerciseIds: string[]): Record<QuadRole, number> => {
    const balance: Record<QuadRole, number> = { load: 0, depth: 0, burn: 0 };
    for (const id of exerciseIds) {
        const role = roleOf(id);
        if (role) balance[role] += 1;
    }
    return balance;
};

// ---------------------------------------------------------------------------
// Main-load selection
// ---------------------------------------------------------------------------

export type LimbProportion = 'short' | 'regular' | 'long' | 'unknown';

export interface LoadRecommendation {
    exerciseId: string;
    alternatives: string[];
    rationale: string;
}

/**
 * Hack Squat is the default because it holds torso position for everyone.
 * Free squatting is *advised* for shorter and regular proportions and offered
 * to everyone else; long-limbed athletes are additionally offered the Stiletto
 * Squat. Nothing is imposed — all three remain selectable.
 */
export const recommendMainLoad = (proportion: LimbProportion): LoadRecommendation => {
    if (proportion === 'short' || proportion === 'regular') {
        return {
            exerciseId: 'hack-squat',
            alternatives: ['barbell-squat', 'stiletto-squat'],
            rationale: 'Your proportions suit free squatting well — the barbell squat is a good swap if you prefer it.',
        };
    }
    if (proportion === 'long') {
        return {
            exerciseId: 'hack-squat',
            alternatives: ['stiletto-squat', 'barbell-squat'],
            rationale: 'Long limbs make the free squat a hip movement as much as a quad one — Stiletto Squat keeps the load on the quads.',
        };
    }
    return { exerciseId: 'hack-squat', alternatives: ['barbell-squat', 'stiletto-squat'], rationale: 'Hack Squat is the default main load.' };
};

// ---------------------------------------------------------------------------
// Range of motion
// ---------------------------------------------------------------------------

export type Depth = 'partial' | 'parallel' | 'below-parallel';

/**
 * Variations whose setup implies a depth. Confirmation still wins — this only
 * saves the athlete from being asked about a movement that answers itself.
 */
export const DEPTH_BY_VARIATION: Record<string, Depth> = {
    'high-box-squat': 'partial',
    'low-box-squat': 'parallel',
    'heels-off-narrow-leg-press': 'below-parallel',
    'goblet-heel-elevated-squat': 'below-parallel',
    'heel-elevated-goblet-squat': 'below-parallel',
    'front-foot-elevated-bulgarian-split-squat': 'below-parallel',
    'knee-over-toe-split-squat': 'below-parallel',
    'supported-sissy-squat': 'below-parallel',
};

export const resolveDepth = (exerciseId: string, status?: QuadfatherStatus): { depth?: Depth; source: 'confirmed' | 'inferred' | 'unknown' } => {
    const confirmed = status?.rom?.[exerciseId]?.confirmed;
    if (confirmed) return { depth: confirmed, source: 'confirmed' };
    const inferred = DEPTH_BY_VARIATION[exerciseId];
    if (inferred) return { depth: inferred, source: 'inferred' };
    return { source: 'unknown' };
};

// ---------------------------------------------------------------------------
// Knee feedback
// ---------------------------------------------------------------------------

export interface KneeSwap {
    from: string;
    to?: string;
    preservedRole?: QuadRole;
    requiresConfirmation: true;
    message: string;
}

const kneeCost = (exerciseId: string): number => {
    const value = EXERCISE_BY_ID[exerciseId]?.intelligence?.kneeCost;
    return typeof value === 'number' ? value : 4;
};

/**
 * Knee feedback may replace main or accessory work — after confirmation, and
 * only with a movement in the same role that actually costs the knee less.
 * `impaired` is authoritative: it always produces an offer.
 */
export const proposeKneeSwap = (
    exerciseId: string,
    severity: 'normal' | 'strained' | 'impaired',
): KneeSwap | undefined => {
    if (severity === 'normal') return undefined;

    const role = roleOf(exerciseId);
    if (!role) return undefined;

    const current = kneeCost(exerciseId);
    const candidate = Object.entries(QUAD_ROLES)
        .filter(([id, candidateRole]) => candidateRole === role && id !== exerciseId && kneeCost(id) < current)
        .sort((a, b) => kneeCost(a[0]) - kneeCost(b[0]))[0]?.[0];

    if (!candidate) {
        return {
            from: exerciseId,
            requiresConfirmation: true,
            message: severity === 'impaired'
                ? 'No lower-cost movement is available in this role. Consider dropping the slot this week and speaking to a trainer or physiotherapist.'
                : 'No lower-cost movement is available in this role — reduce load or range instead.',
        };
    }

    return {
        from: exerciseId,
        to: candidate,
        preservedRole: role,
        requiresConfirmation: true,
        message: `${EXERCISE_BY_ID[candidate]?.name.en ?? candidate} keeps the ${role} role at a lower knee cost. Confirm to swap.`,
    };
};
