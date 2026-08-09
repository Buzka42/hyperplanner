/**
 * Turns a finishing technique into the extra set rows it actually requires.
 *
 * Before this, a drop set was a coloured badge and nothing else: the athlete
 * was told to do three drops and then had nowhere to record them, so the work
 * vanished from their history. These rows are real, logged, and tagged with
 * their provenance so progression still judges only prescribed work.
 */

import type { IntensityTechniqueSpec, SetKind } from '../../data/exercises/types';

export type TechniqueRow = {
    kind: SetKind;
    /** Shown instead of a set number, e.g. "Drop 1". */
    label: string;
    /** Target reps for the row, where the technique implies one. */
    reps?: string;
    /** Suggested load, derived from the working weight. */
    weight?: string;
    /** Rest before this row, in seconds. */
    restSeconds?: number;
};

const round2p5 = (n: number) => Math.max(0, Math.round(n / 2.5) * 2.5);

/** Whether the technique attaches to this working-set index. */
export const techniqueAppliesTo = (
    technique: IntensityTechniqueSpec | undefined,
    setIndex: number,
    totalWorkingSets: number
): boolean => {
    if (!technique || technique.kind === 'none') return false;
    const scope = 'applyTo' in technique ? technique.applyTo : 'last';
    if (scope === 'all') return true;
    if (Array.isArray(scope)) return scope.includes(setIndex);
    return setIndex === totalWorkingSets - 1;
};

/**
 * Rows to append after the working set the technique attaches to.
 *
 * `workingWeight` is whatever the athlete actually used, so drop percentages
 * come off the real load rather than the prescription — someone training
 * lighter than planned should get lighter drops, not the planned ones.
 */
export const techniqueRows = (
    technique: IntensityTechniqueSpec | undefined,
    workingWeight: string
): TechniqueRow[] => {
    if (!technique || technique.kind === 'none') return [];
    const weight = parseFloat(workingWeight || '0');
    const hasWeight = Number.isFinite(weight) && weight > 0;

    switch (technique.kind) {
        case 'drop-set': {
            const rows: TechniqueRow[] = [];
            let current = weight;
            for (let i = 0; i < technique.drops; i++) {
                current = current * (1 - technique.dropPercent / 100);
                rows.push({
                    kind: 'drop',
                    label: `Drop ${i + 1}`,
                    reps: technique.toFailure ? 'Failure' : undefined,
                    weight: hasWeight ? String(round2p5(current)) : undefined,
                    // Drop sets are continuous: rack the weight and go again.
                    restSeconds: 0,
                });
            }
            return rows;
        }

        case 'rest-pause':
            return Array.from({ length: technique.bursts }, (_, i) => ({
                kind: 'rest-pause' as SetKind,
                label: `Burst ${i + 1}`,
                reps: 'Failure',
                weight: hasWeight ? String(round2p5(weight)) : undefined,
                restSeconds: technique.restSeconds,
            }));

        case 'myo-reps':
            return Array.from({ length: technique.miniSets }, (_, i) => ({
                kind: 'myo' as SetKind,
                label: `Mini ${i + 1}`,
                reps: technique.miniReps,
                weight: hasWeight ? String(round2p5(weight)) : undefined,
                // Counted in breaths rather than seconds; roughly 3s each.
                restSeconds: technique.restBreaths * 3,
            }));

        case 'cluster':
            return Array.from({ length: technique.clusters }, (_, i) => ({
                kind: 'cluster' as SetKind,
                label: `Cluster ${i + 1}`,
                reps: technique.repsPerCluster,
                weight: hasWeight ? String(round2p5(weight)) : undefined,
                restSeconds: technique.intraRestSeconds,
            }));

        case 'back-off':
            return Array.from({ length: technique.sets }, (_, i) => ({
                kind: 'extra' as SetKind,
                label: `Back-off ${i + 1}`,
                reps: technique.reps,
                weight: hasWeight ? String(round2p5(weight * (technique.percent / 100))) : undefined,
                restSeconds: 120,
            }));

        // Tempo, 1.5 reps, total-reps, waves and AMRAP finishers change how the
        // prescribed sets are performed rather than adding any; they are shown
        // as badges on the exercise instead.
        default:
            return [];
    }
};
