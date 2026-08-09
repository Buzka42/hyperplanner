/**
 * THE UPPER-BODY SQUAT — chin-up / back specialisation, 10 weeks, 4 days.
 *
 * From HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md section 12.
 *
 * Back three times weekly, biceps 3x, everything else twice. Per section 2.8
 * the weighted chin-up is treated as a major strength lift rather than an
 * accessory, and progressed on total system weight — bodyweight plus the load
 * on the belt.
 *
 * Week 10 is the Chin-Up Trial.
 */

import { definePlan } from '../planBuilder';
import type { DaySpec } from '../planBuilder';

const WEIGHTED_CHIN_STRENGTH: DaySpec = {
    name: 'Weighted Chin Strength',
    dayOfWeek: 1,
    slots: [
        {
            ex: 'weighted-chin-up',
            sets: 6,
            reps: '3-5',
            restSeconds: 210,
            progression: { type: 'double', increment: 2.5 },
            notes: 'Total system weight: bodyweight plus the belt. Full hang every rep.',
        },
        { ex: 'hammer-chest-press', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'rear-delt-fly', sets: 3, reps: '15-20', restSeconds: 60 },
        { ex: 'cable-triceps-extension', sets: 3, reps: '10-15', restSeconds: 60 },
        { ex: 'cable-lateral-raise', sets: 3, reps: '12-20', restSeconds: 60 },
    ],
};

const LEGS_AND_PULL_VOLUME: DaySpec = {
    name: 'Legs + Vertical Pull Volume',
    dayOfWeek: 2,
    slots: [
        { ex: 'goblet-skater-squat', sets: 3, reps: '8-12', restSeconds: 105, notes: 'Per side.' },
        { ex: 'hip-supported-db-deadlift', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'hack-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'pull-up', sets: 4, reps: '6-10', restSeconds: 150, notes: 'Pronated. Different grip, same specialisation.' },
        { ex: '30-incline-lying-dumbbell-curl', sets: 3, reps: '10-15', restSeconds: 75 },
        { ex: 'ab-wheel', sets: 3, reps: '8-15', restSeconds: 60 },
    ],
};

const HORIZONTAL_BACK: DaySpec = {
    name: 'Horizontal Back',
    dayOfWeek: 4,
    slots: [
        { ex: 'hammer-upper-row', sets: 4, reps: '6-10', restSeconds: 150 },
        { ex: 'hammer-lower-row', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'incline-dumbbell-bench-press', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'standing-barbell-military-press', sets: 3, reps: '6-10', restSeconds: 150 },
        { ex: 'reverse-curl', sets: 3, reps: '10-15', restSeconds: 75 },
        // Second weekly tricep exposure; the doc's day 3 has none.
        { ex: 'rope-pressdown', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'rear-delt-fly', sets: 3, reps: '15-20', restSeconds: 60 },
    ],
};

const LEGS_AND_CHEST: DaySpec = {
    name: 'Legs + Chest',
    dayOfWeek: 5,
    slots: [
        { ex: 'heel-elevated-goblet-squat', sets: 3, reps: '10-15', restSeconds: 90 },
        { ex: 'sissy-squat', sets: 3, reps: '12-20', restSeconds: 90 },
        { ex: 'seated-ham-curl', sets: 3, reps: '10-15', restSeconds: 90 },
        { ex: 'flat-dumbbell-press', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'hanging-leg-raise', sets: 3, reps: '10-20', restSeconds: 60 },
        // Second weekly calf and shoulder exposure; the doc's day lists leave
        // both at one against its own two-exposure minimum.
        { ex: 'standing-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'seated-dumbbell-lateral-raise', sets: 3, reps: '12-20', restSeconds: 60 },
    ],
};

export const UPPER_BODY_SQUAT_CONFIG = definePlan({
    id: 'upper-body-squat',
    name: 'Workhorse',
    weeks: 10,
    days: [WEIGHTED_CHIN_STRENGTH, LEGS_AND_PULL_VOLUME, HORIZONTAL_BACK, LEGS_AND_CHEST],
    phases: [
        { name: 'Ascent', weeks: [1, 2, 3, 4] },
        {
            name: 'Overhang',
            weeks: [5, 6, 7, 8, 9],
            transform: slot => (slot.ex === 'weighted-chin-up' ? { ...slot, reps: '3', sets: 6 } : slot),
        },
        {
            name: 'Chin-Up Trial',
            weeks: [10],
            transform: slot =>
                slot.ex === 'weighted-chin-up'
                    ? {
                        ...slot,
                        sets: 3,
                        reps: '1-3',
                        notes: 'Chin-Up Trial: work to a weighted 3RM, or test bodyweight max reps. Pick one and record it.',
                    }
                    : { ...slot, sets: Math.max(2, slot.sets - 1) },
        },
    ],
    ui: {
        themeClass: 'theme-upper-body-squat',
        coverImage: '/purgatorio.png',
        navImage: '/purgatorio.png',
        dashboardWidgets: ['1rm', 'program_status', 'strength_chart', 'workout_history'],
    },
});
