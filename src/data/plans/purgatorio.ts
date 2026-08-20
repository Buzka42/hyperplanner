/**
 * PURGATORIO — general hypertrophy, antagonist-paired supersets.
 *
 * Voted pair map (PUR-V-map): upper = compound + isolation on the same
 * station; lower = one machine + one free-weight/BW partner where the map
 * allowed it. Accumulation holds the listed set counts; intensification
 * drops a set and the tempo.
 */

import { definePlan } from '../planBuilder';
import type { DaySpec, SlotSpec } from '../planBuilder';

const roundRest = (seconds: number) => Math.max(45, Math.round(seconds / 15) * 15);

const pair = (
    a: SlotSpec,
    b: SlotSpec,
    letter: 'A' | 'B' | 'C',
): [SlotSpec, SlotSpec] => [
    { ...a, pair: `${letter}1` },
    { ...b, pair: `${letter}2` },
];

const accumulate = (slot: SlotSpec): SlotSpec => ({
    ...slot,
    reps: slot.reps === 'AMRAP' || slot.reps === 'Failure' ? slot.reps : '10-15',
    restSeconds: roundRest((slot.restSeconds ?? 90) * 0.75),
    tempo: slot.tempo ?? '30X0',
});

const intensify = (slot: SlotSpec): SlotSpec => ({
    ...slot,
    sets: Math.max(2, slot.sets - 1),
    reps: slot.reps === 'AMRAP' || slot.reps === 'Failure' ? slot.reps : '5-8',
    restSeconds: roundRest((slot.restSeconds ?? 90) * 1.4),
    tempo: undefined,
});

const UPPER_A: DaySpec = {
    name: 'Upper A',
    dayOfWeek: 1,
    slots: [
        ...pair(
            { ex: 'flat-dumbbell-press', sets: 4, reps: '8-12', restSeconds: 120 },
            { ex: 'ezbar-preacher-curl', sets: 3, reps: '10-12', restSeconds: 75, technique: { kind: 'last-set-failure' } },
            'A',
        ),
        ...pair(
            { ex: 'lat-pulldown', sets: 4, reps: '8-12', restSeconds: 105 },
            { ex: 'rope-pressdown', sets: 3, reps: '10-12', restSeconds: 75, technique: { kind: 'last-set-failure' } },
            'B',
        ),
        ...pair(
            { ex: 'seated-dumbbell-shoulder-press', sets: 4, reps: '8-12', restSeconds: 105 },
            { ex: 'leaning-one-arm-lateral-raise', sets: 3, reps: '12-20', restSeconds: 75, technique: { kind: 'last-set-failure' } },
            'C',
        ),
    ],
};

const UPPER_B: DaySpec = {
    name: 'Upper B',
    dayOfWeek: 4,
    slots: [
        ...pair(
            { ex: 'incline-dumbbell-bench-press', sets: 4, reps: '8-12', restSeconds: 120 },
            { ex: 'dumbbell-hammer-curl', sets: 3, reps: '10-12', restSeconds: 75, technique: { kind: 'last-set-failure' } },
            'A',
        ),
        ...pair(
            { ex: 'seated-cable-row', sets: 4, reps: '8-12', restSeconds: 120 },
            { ex: 'french-press', sets: 3, reps: '10-12', restSeconds: 75, technique: { kind: 'last-set-failure' } },
            'B',
        ),
        ...pair(
            { ex: 'rear-delt-rope-pulls-to-face', sets: 3, reps: '12-20', restSeconds: 75 },
            { ex: 'cable-lateral-raise', sets: 3, reps: '12-20', restSeconds: 75 },
            'C',
        ),
    ],
};

const LOWER_A: DaySpec = {
    name: 'Lower A',
    dayOfWeek: 2,
    slots: [
        ...pair(
            { ex: 'hack-squat', sets: 4, reps: '8-12', restSeconds: 150 },
            { ex: 'hack-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
            'A',
        ),
        ...pair(
            { ex: 'lying-leg-curl', sets: 3, reps: '8-12', restSeconds: 120 },
            { ex: 'single-leg-dumbbell-romanian-deadlift', sets: 3, reps: '8-12', restSeconds: 120 },
            'B',
        ),
        ...pair(
            { ex: 'hip-adduction', sets: 3, reps: '10-15', restSeconds: 75 },
            { ex: 'plank', sets: 3, reps: 'Failure', restSeconds: 60, alternates: ['Ab Wheel'] },
            'C',
        ),
    ],
};

const LOWER_B: DaySpec = {
    name: 'Lower B',
    dayOfWeek: 5,
    slots: [
        ...pair(
            { ex: 'heel-elevated-goblet-squat', sets: 4, reps: '10-15', restSeconds: 90 },
            { ex: 'machine-hip-abduction', sets: 3, reps: '12-20', restSeconds: 75 },
            'A',
        ),
        ...pair(
            { ex: 'seated-ham-curl', sets: 3, reps: '8-12', restSeconds: 120 },
            { ex: 'standing-dumbbell-kb-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
            'B',
        ),
        ...pair(
            { ex: 'dumbbell-romanian-deadlift', sets: 3, reps: '8-12', restSeconds: 120 },
            { ex: 'plank', sets: 3, reps: 'Failure', restSeconds: 60, alternates: ['Ab Wheel'] },
            'C',
        ),
    ],
};

export const PURGATORIO_CONFIG = definePlan({
    id: 'purgatorio',
    name: 'Purgatorio',
    weeks: 12,
    days: [UPPER_A, LOWER_A, UPPER_B, LOWER_B],
    phases: [
        { name: 'Accumulation', weeks: [1, 2, 3], transform: accumulate },
        { name: 'Intensification', weeks: [4, 5, 6], transform: intensify },
        { name: 'Accumulation II', weeks: [7, 8, 9], transform: accumulate },
        { name: 'Intensification II', weeks: [10, 11, 12], transform: intensify },
    ],
    ui: {
        themeClass: 'theme-purgatorio',
        coverImage: '/purgatorio.png',
        navImage: '/purgatorio.png',
        dashboardWidgets: ['program_status', 'weekly_sets', 'workout_history'],
    },
});
