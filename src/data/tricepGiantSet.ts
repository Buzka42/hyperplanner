import type { Exercise, GiantSetStep } from '../types';

/**
 * Bench Domination's tricep giant set, also used by Arms Race.
 *
 * The container name is not a library id — volume analysis expands these
 * steps so the triceps work is visible.
 */
export const TRICEP_GIANT_SET_WORK: GiantSetStep[] = [
    { name: 'Bodyweight Dips', targetReps: '5', inputPlaceholder: '-' },
    { name: 'Rolling DB Tricep Extensions', targetReps: '12', inputPlaceholder: '-', editableWeight: true },
    { name: 'Banded EZ Bar Skullcrushers', targetReps: '25', inputPlaceholder: '-', editableWeight: true },
];

export const TRICEP_GIANT_SET_TAPER: GiantSetStep[] = [
    { name: 'Bodyweight Dips', targetReps: '5', inputPlaceholder: '-' },
    { name: 'Rolling DB Tricep Extensions', targetReps: '10', inputPlaceholder: '-', editableWeight: true },
    { name: 'Banded EZ Bar Skullcrushers', targetReps: '15', inputPlaceholder: '-', editableWeight: true },
];

export const tricepGiantSet = (id: string, sets: number, variant: 'work' | 'taper' = 'work'): Exercise => ({
    id,
    name: 'Tricep Giant Set',
    sets,
    target: { type: 'failure', reps: 'Giant' },
    giantSetConfig: { steps: variant === 'taper' ? TRICEP_GIANT_SET_TAPER : TRICEP_GIANT_SET_WORK },
});
