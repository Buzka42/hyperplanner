/**
 * NEURAL OVERLOAD — powerbuilding, 9 weeks, 4 days.
 *
 * From HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md section 8.
 *
 * Poliquin-style 1-6 loading: a heavy low-rep exposure, then a moderate
 * six-rep back-off, then a heavier single, then a heavier back-off. The point
 * is post-activation — does the second six-rep set beat the first now that the
 * heavy single has primed the nervous system?
 *
 * The doc is explicit that the single must not become a weekly max attempt, so
 * it is prescribed at 90% rather than as a test, and day 4 deliberately uses a
 * lower-fatigue strength movement instead of forcing 1-6 onto everything.
 */

import { definePlan } from '../planBuilder';
import type { DaySpec, SlotSpec } from '../planBuilder';

/**
 * The 1-6 pattern as four slots. Expressed explicitly rather than as a
 * technique so each exposure carries its own load prescription.
 */
const oneSixWave = (ex: string, of: 'pausedBench' | 'squat' | 'conventionalDeadlift'): SlotSpec[] => [
    {
        ex,
        sets: 1,
        reps: '1',
        restSeconds: 180,
        progression: { type: 'percentage', of, percent: 0.9 },
        notes: 'Heavy single at about 90%. Confident, not maximal — this primes the set that follows.',
    },
    {
        ex,
        sets: 1,
        reps: '6',
        restSeconds: 180,
        progression: { type: 'percentage', of, percent: 0.75 },
        notes: 'Back-off six. Note the bar speed.',
    },
    {
        ex,
        sets: 1,
        reps: '1',
        restSeconds: 180,
        progression: { type: 'percentage', of, percent: 0.925 },
        notes: 'Heavier single.',
    },
    {
        ex,
        sets: 1,
        reps: '6',
        restSeconds: 180,
        progression: { type: 'percentage', of, percent: 0.775 },
        notes: 'Second back-off six, heavier than the first. If it moves better than set two, the priming worked.',
    },
];

const BENCH_NEURAL: DaySpec = {
    name: 'Bench Neural',
    dayOfWeek: 1,
    slots: [
        ...oneSixWave('paused-bench-press', 'pausedBench'),
        { ex: 'hammer-upper-row', sets: 4, reps: '8-12', restSeconds: 120 },
        { ex: 'cable-lateral-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'cable-curl', sets: 3, reps: '10-15', restSeconds: 60 },
        { ex: 'cable-triceps-extension', sets: 3, reps: '10-15', restSeconds: 60 },
    ],
};

const SQUAT_NEURAL: DaySpec = {
    name: 'Squat Neural',
    dayOfWeek: 2,
    slots: [
        ...oneSixWave('low-bar-squat', 'squat'),
        { ex: 'seated-ham-curl', sets: 3, reps: '8-12', restSeconds: 105 },
        { ex: 'leg-extension', sets: 3, reps: '10-15', restSeconds: 90 },
        { ex: 'standing-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'cable-crunch', sets: 3, reps: '12-20', restSeconds: 60 },
    ],
};

const CHIN_NEURAL: DaySpec = {
    name: 'Chin Neural',
    dayOfWeek: 4,
    slots: [
        {
            ex: 'weighted-chin-up',
            sets: 1,
            reps: '1-2',
            restSeconds: 180,
            notes: 'Heavy rep. Total system weight — bodyweight plus the belt.',
        },
        { ex: 'weighted-chin-up', sets: 1, reps: '6', restSeconds: 180, notes: 'Back-off six.' },
        { ex: 'weighted-chin-up', sets: 1, reps: '1-2', restSeconds: 180, notes: 'Heavier rep.' },
        { ex: 'weighted-chin-up', sets: 1, reps: '6', restSeconds: 180, notes: 'Second back-off six, heavier.' },
        { ex: 'incline-dumbbell-bench-press', sets: 4, reps: '8-12', restSeconds: 120 },
        { ex: 'rear-delt-fly', sets: 3, reps: '15-20', restSeconds: 60 },
        { ex: 'dumbbell-hammer-curl', sets: 3, reps: '10-15', restSeconds: 60 },
        { ex: 'rope-pressdown', sets: 3, reps: '10-15', restSeconds: 60 },
    ],
};

const LOWER_POWERBUILDING: DaySpec = {
    name: 'Lower Powerbuilding',
    dayOfWeek: 5,
    slots: [
        {
            ex: 'front-squat',
            sets: 5,
            reps: '3-5',
            restSeconds: 210,
            progression: { type: 'percentage', of: 'squat', percent: 0.65 },
            // Section 8: use a lower-fatigue strength movement rather than
            // forcing literal 1-6 onto every lift.
            notes: 'Straight sets, not 1-6. This day exists to build without adding neural cost.',
        },
        { ex: 'hip-supported-db-deadlift', sets: 4, reps: '8-12', restSeconds: 120 },
        { ex: 'goblet-skater-squat', sets: 3, reps: '10-12', restSeconds: 105, notes: 'Per side.' },
        { ex: 'seated-ham-curl', sets: 3, reps: '10-15', restSeconds: 90 },
        { ex: 'standing-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'hammer-chest-press', sets: 3, reps: '8-12', restSeconds: 105 },
    ],
};

export const NEURAL_OVERLOAD_CONFIG = definePlan({
    id: 'neural-overload',
    name: 'Neural Overload',
    weeks: 9,
    days: [BENCH_NEURAL, SQUAT_NEURAL, CHIN_NEURAL, LOWER_POWERBUILDING],
    phases: [
        { name: 'Charge', weeks: [1, 2, 3] },
        { name: 'Discharge', weeks: [4, 5, 6] },
        {
            name: 'Overload',
            weeks: [7, 8, 9],
            // Accessory volume drops so the neural work stays the priority.
            transform: slot => (slot.sets >= 3 ? { ...slot, sets: slot.sets - 1 } : slot),
        },
    ],
    ui: {
        themeClass: 'theme-neural-overload',
        coverImage: '/neuraloverload.png',
        navImage: '/neuraloverload.png',
        dashboardWidgets: ['1rm', 'program_status', 'strength_chart', 'workout_history'],
    },
});
