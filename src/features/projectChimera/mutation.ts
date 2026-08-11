/**
 * PROJECT CHIMERA — block mutations.
 *
 * Every four weeks the plan may reallocate a little volume between qualities.
 * The constraints matter more than the cleverness:
 *
 *   - at most two weekly sets per quality per block;
 *   - every quality keeps a minimum weekly exposure, whatever the evidence says;
 *   - insufficient data means no mutation at all, not a guess;
 *   - every component of a proposal is previewed and separately confirmable.
 *
 * The phenotype is a description shown to the athlete after each block. It is
 * never an input to any of this.
 */

export type Quality = 'squat' | 'hinge' | 'push' | 'pull' | 'unilateral' | 'hypertrophy';

export const QUALITIES: Quality[] = ['squat', 'hinge', 'push', 'pull', 'unilateral', 'hypertrophy'];

/** Weekly sets below which a quality is no longer meaningfully trained. */
export const MINIMUM_WEEKLY_SETS: Record<Quality, number> = {
    squat: 4, hinge: 4, push: 6, pull: 6, unilateral: 3, hypertrophy: 6,
};

export const REALLOCATION_CAP = 2;

export interface QualityEvidence {
    quality: Quality;
    /** Comparable exposures in the block. Fewer than three is not evidence. */
    comparableExposures: number;
    /** Estimated change over the block, as a fraction (0.04 = +4%). */
    trend: number;
    /** Athlete-reported fatigue for the quality, 0–4 ordinal. */
    fatigue: number;
    stalled: boolean;
}

export interface MutationComponent {
    kind: 'reallocate-sets' | 'change-exercise';
    quality: Quality;
    /** Positive = sets gained, negative = sets given up. */
    setDelta?: number;
    fromExerciseId?: string;
    toExerciseId?: string;
    rationale: string;
    /** Each component is confirmed on its own. */
    confirmed: false;
}

export interface MutationProposal {
    block: number;
    components: MutationComponent[];
    message: string;
}

const HAS_EVIDENCE = 3;

/**
 * Builds a proposal for the next block.
 *
 * @param evidence   One entry per quality from the block just finished.
 * @param currentSets Current weekly sets per quality.
 */
export const proposeMutation = (
    block: number,
    evidence: QualityEvidence[],
    currentSets: Record<Quality, number>,
): MutationProposal => {
    const usable = evidence.filter(entry => entry.comparableExposures >= HAS_EVIDENCE);
    if (usable.length < 2) {
        return { block, components: [], message: 'Not enough comparable work this block to justify changing anything. The programme continues as written.' };
    }

    // Give up sets where fatigue is high relative to return; invest where the
    // athlete is either improving fastest or clearly behind.
    const donors = [...usable]
        .filter(entry => currentSets[entry.quality] - REALLOCATION_CAP >= MINIMUM_WEEKLY_SETS[entry.quality])
        .sort((a, b) => (b.fatigue - b.trend * 10) - (a.fatigue - a.trend * 10));
    const receivers = [...usable].sort((a, b) => (b.trend * 10 - b.fatigue) - (a.trend * 10 - a.fatigue));

    const donor = donors[0];
    const receiver = receivers.find(entry => entry.quality !== donor?.quality);

    const components: MutationComponent[] = [];

    if (donor && receiver && donor.quality !== receiver.quality) {
        const delta = Math.min(REALLOCATION_CAP, currentSets[donor.quality] - MINIMUM_WEEKLY_SETS[donor.quality]);
        if (delta > 0) {
            components.push({
                kind: 'reallocate-sets', quality: donor.quality, setDelta: -delta, confirmed: false,
                rationale: `${donor.quality} cost more than it returned this block — ${delta} weekly set${delta === 1 ? '' : 's'} moves elsewhere.`,
            });
            components.push({
                kind: 'reallocate-sets', quality: receiver.quality, setDelta: delta, confirmed: false,
                rationale: `${receiver.quality} responded best this block and takes the ${delta} set${delta === 1 ? '' : 's'}.`,
            });
        }
    }

    // A stalled quality with real evidence behind it earns an exercise change —
    // separately confirmable, so the athlete can take the sets and keep the lift.
    for (const entry of usable.filter(item => item.stalled)) {
        components.push({
            kind: 'change-exercise', quality: entry.quality, confirmed: false,
            rationale: `${entry.quality} has stalled across ${entry.comparableExposures} comparable exposures. Changing the movement is worth trying.`,
        });
    }

    return {
        block,
        components,
        message: components.length
            ? 'Proposed changes for the next block. Confirm each one separately; anything you decline stays as it is.'
            : 'Nothing worth changing this block.',
    };
};

/** Applies only the confirmed components, and never below a minimum. */
export const applyMutation = (
    currentSets: Record<Quality, number>,
    components: (MutationComponent & { confirmed: boolean })[],
): Record<Quality, number> => {
    const next = { ...currentSets };
    for (const component of components) {
        if (!component.confirmed || component.kind !== 'reallocate-sets' || !component.setDelta) continue;
        const proposed = next[component.quality] + component.setDelta;
        next[component.quality] = Math.max(MINIMUM_WEEKLY_SETS[component.quality], proposed);
    }
    return next;
};

/** Total reallocation in a block, used to enforce the cap per quality. */
export const withinCap = (components: MutationComponent[]): boolean => {
    const perQuality = new Map<Quality, number>();
    for (const component of components) {
        if (component.kind !== 'reallocate-sets' || !component.setDelta) continue;
        perQuality.set(component.quality, (perQuality.get(component.quality) ?? 0) + Math.abs(component.setDelta));
    }
    return [...perQuality.values()].every(total => total <= REALLOCATION_CAP);
};

// ---------------------------------------------------------------------------
// Phenotype
// ---------------------------------------------------------------------------

/**
 * A description, not a diagnosis, and deliberately not an input anywhere else
 * in this module.
 */
export const phenotype = (evidence: QualityEvidence[]): { label: string; caveat: string } => {
    const usable = evidence.filter(entry => entry.comparableExposures >= HAS_EVIDENCE);
    if (usable.length < 3) {
        return { label: 'Not enough data yet', caveat: 'Shown for interest only. It never changes your programme.' };
    }
    const best = [...usable].sort((a, b) => b.trend - a.trend)[0];
    const labels: Record<Quality, string> = {
        squat: 'Squat-responsive', hinge: 'Hinge-responsive', push: 'Press-responsive',
        pull: 'Pull-responsive', unilateral: 'Unilateral-responsive', hypertrophy: 'Volume-responsive',
    };
    return { label: labels[best.quality], caveat: 'Shown for interest only. It never changes your programme.' };
};
