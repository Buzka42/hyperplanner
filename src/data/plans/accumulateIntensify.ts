/**
 * ACCUMULATE / INTENSIFY — general hypertrophy / powerbuilding.
 *
 * From HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md section 6.
 *
 * Repeating 6-week blocks: three weeks accumulating (9-15 reps, more sets,
 * machines and cables, moderate rest), then three intensifying (5-8 reps,
 * heavier, fewer exercises, longer rest, free weights). Every major muscle
 * group gets at least two weekly exposures in both states.
 *
 * The whole plan is expressed as one set of days plus two phase transforms —
 * the block character is a function of the phase, not a second copy of the
 * programme. Antagonist pairing (A1/A2) runs throughout, per section 2.3.
 */

import { definePlan } from '../planBuilder';
import type { DaySpec, SlotSpec } from '../planBuilder';

/** Accumulation: more volume at moderate load, controlled eccentrics. */
const accumulate = (slot: SlotSpec): SlotSpec => ({
    ...slot,
    sets: slot.sets + 1,
    reps: slot.reps === 'AMRAP' || slot.reps === 'Failure' ? slot.reps : '10-15',
    restSeconds: Math.max(60, Math.round((slot.restSeconds ?? 90) * 0.75)),
    tempo: slot.tempo ?? '30X0',
});

/** Intensification: heavier, fewer reps, longer rest, no added tempo work. */
const intensify = (slot: SlotSpec): SlotSpec => ({
    ...slot,
    reps: slot.reps === 'AMRAP' || slot.reps === 'Failure' ? slot.reps : '5-8',
    restSeconds: Math.round((slot.restSeconds ?? 90) * 1.4),
    tempo: undefined,
});

const UPPER_A: DaySpec = {
    name: 'Upper A',
    dayOfWeek: 1,
    slots: [
        { ex: 'flat-dumbbell-press', sets: 3, reps: '8-12', restSeconds: 120, pair: 'A1' },
        { ex: 'hammer-upper-row', sets: 3, reps: '8-12', restSeconds: 120, pair: 'A2' },
        { ex: 'seated-dumbbell-shoulder-press', sets: 3, reps: '8-12', restSeconds: 105, pair: 'B1' },
        { ex: 'lat-pulldown', sets: 3, reps: '8-12', restSeconds: 105, pair: 'B2' },
        { ex: 'standing-straight-bar-curl', sets: 3, reps: '10-12', restSeconds: 75, pair: 'C1' },
        { ex: 'rope-pressdown', sets: 3, reps: '10-12', restSeconds: 75, pair: 'C2' },
    ],
};

const LOWER_A: DaySpec = {
    name: 'Lower A',
    dayOfWeek: 2,
    slots: [
        { ex: 'hack-squat', sets: 3, reps: '8-12', restSeconds: 150, pair: 'A1' },
        { ex: 'seated-ham-curl', sets: 3, reps: '8-12', restSeconds: 150, pair: 'A2' },
        { ex: 'leg-extension', sets: 3, reps: '10-15', restSeconds: 90, pair: 'B1' },
        { ex: 'barbell-romanian-deadlift', sets: 3, reps: '8-12', restSeconds: 120, pair: 'B2' },
        { ex: 'standing-calf-raise', sets: 3, reps: '12-20', restSeconds: 60, pair: 'C1' },
        { ex: 'cable-crunch', sets: 3, reps: '12-20', restSeconds: 60, pair: 'C2' },
    ],
};

/** Day 3 and 4 rotate the variations, per section 2.5 — recognisable, not identical. */
const UPPER_B: DaySpec = {
    name: 'Upper B',
    dayOfWeek: 4,
    slots: [
        { ex: 'incline-dumbbell-bench-press', sets: 3, reps: '8-12', restSeconds: 120, pair: 'A1' },
        { ex: 'hammer-lower-row', sets: 3, reps: '8-12', restSeconds: 120, pair: 'A2' },
        { ex: 'cable-lateral-raise', sets: 3, reps: '12-20', restSeconds: 75, pair: 'B1' },
        { ex: 'pull-up', sets: 3, reps: '6-10', restSeconds: 120, pair: 'B2' },
        { ex: 'dumbbell-hammer-curl', sets: 3, reps: '10-12', restSeconds: 75, pair: 'C1' },
        { ex: 'lying-dumbbell-skullcrusher', sets: 3, reps: '10-12', restSeconds: 75, pair: 'C2' },
    ],
};

const LOWER_B: DaySpec = {
    name: 'Lower B',
    dayOfWeek: 5,
    slots: [
        { ex: 'front-squat', sets: 3, reps: '6-10', restSeconds: 150, pair: 'A1' },
        { ex: 'single-leg-hamstring-curl', sets: 3, reps: '10-12', restSeconds: 120, pair: 'A2' },
        { ex: 'heel-elevated-goblet-squat', sets: 3, reps: '10-15', restSeconds: 90, pair: 'B1' },
        { ex: 'hip-supported-db-deadlift', sets: 3, reps: '10-12', restSeconds: 120, pair: 'B2' },
        { ex: 'seated-dumbbell-calf-raise', sets: 3, reps: '12-20', restSeconds: 60, pair: 'C1' },
        { ex: 'ab-wheel', sets: 3, reps: '8-15', restSeconds: 60, pair: 'C2' },
    ],
};

export const ACCUMULATE_INTENSIFY_CONFIG = definePlan({
    id: 'accumulate-intensify',
    name: 'Accumulate / Intensify',
    weeks: 12,
    days: [UPPER_A, LOWER_A, UPPER_B, LOWER_B],
    phases: [
        { name: 'Accumulation', weeks: [1, 2, 3], transform: accumulate },
        { name: 'Intensification', weeks: [4, 5, 6], transform: intensify },
        { name: 'Accumulation II', weeks: [7, 8, 9], transform: accumulate },
        { name: 'Intensification II', weeks: [10, 11, 12], transform: intensify },
    ],
    ui: {
        themeClass: 'theme-accumulate-intensify',
        coverImage: '/workhorse.png',
        navImage: '/workhorse.png',
        dashboardWidgets: ['program_status', 'strength_chart', 'workout_history'],
    },
});
