/**
 * OVERHEAD DOMINION — shoulder specialisation, 10 weeks, 4 days.
 *
 * From HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md section 10.
 *
 * Delts four times weekly, upper back 3x, everything else twice. The doc is
 * explicit that the four shoulder exposures must not all be maximal presses,
 * so they are deliberately different in function: a heavy standing press, a
 * high-volume lateral/rear day, a braced unilateral press, and a structural
 * day built on external rotation and rear delts.
 */

import { definePlan } from '../planBuilder';
import type { DaySpec } from '../planBuilder';

const OVERHEAD_STRENGTH: DaySpec = {
    name: 'Overhead Strength',
    dayOfWeek: 1,
    slots: [
        {
            ex: 'standing-barbell-military-press',
            sets: 5,
            reps: '5-8',
            restSeconds: 210,
            progression: { type: 'double', increment: 2.5 },
            notes: 'Strict. If the knees bend, the set is over.',
        },
        { ex: 'weighted-chin-up', sets: 5, reps: '5-8', restSeconds: 180 },
        { ex: 'cable-lateral-raise', sets: 2, reps: '12-20', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        // Side delts carry the plan's specialisation target (§9.17.1, ~12-16 hard
        // sets). Hard-two keeps every set honest, so the volume comes from a
        // second angle rather than a longer straight-set run.
        { ex: 'leaning-one-arm-lateral-raise', sets: 2, reps: '12-20', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'rope-pressdown', sets: 2, reps: '10-15', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'rear-delt-fly', sets: 2, reps: '15-20', restSeconds: 60, technique: { kind: 'last-set-failure' } },
    ],
};

const DELTS_AND_LEGS: DaySpec = {
    name: 'Delts + Legs',
    dayOfWeek: 2,
    slots: [
        { ex: 'cable-lateral-raise', sets: 2, reps: '12-20', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'seated-dumbbell-lateral-raise', sets: 2, reps: '12-20', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'single-arm-reverse-pec-deck', sets: 2, reps: '12-20', restSeconds: 60, notes: 'Per side.', technique: { kind: 'last-set-failure' } },
        { ex: 'hack-squat', sets: 3, reps: '8-12', restSeconds: 150 },
        { ex: 'seated-ham-curl', sets: 3, reps: '8-12', restSeconds: 90 },
        // Second weekly chest exposure. The doc calls for chest 2x, but its own
        // day lists press only on day 3.
        { ex: 'hammer-chest-press', sets: 3, reps: '8-12', restSeconds: 105 },
        { ex: 'standing-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'cable-crunch', sets: 3, reps: '12-20', restSeconds: 60 },
    ],
};

const SHOULDER_HYPERTROPHY: DaySpec = {
    name: 'Shoulder Hypertrophy',
    dayOfWeek: 4,
    slots: [
        {
            ex: 'one-arm-braced-db-press',
            sets: 4,
            reps: '8-12',
            restSeconds: 120,
            notes: 'Weaker side first; the stronger side matches its reps.',
        },
        { ex: 'single-arm-dumbbell-row', sets: 2, reps: '8-12', restSeconds: 120 },
        { ex: 'lat-prayer', sets: 2, reps: '8-12', restSeconds: 120 },
        { ex: 'seated-dumbbell-lateral-raise', sets: 2, reps: '12-20', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'leaning-one-arm-lateral-raise', sets: 2, reps: '12-20', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'rear-delt-fly', sets: 3, reps: '15-25', restSeconds: 60 },
        { ex: 'incline-dumbbell-bench-press', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'cable-curl', sets: 3, reps: '10-15', restSeconds: 60 },
    ],
};

const STRUCTURAL_SHOULDERS: DaySpec = {
    name: 'Structural Shoulders + Legs',
    dayOfWeek: 5,
    slots: [
        { ex: 'seated-dumbbell-shoulder-press', sets: 3, reps: '8-12', restSeconds: 150 },
        { ex: 'single-arm-external-rotation', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'rear-delt-fly', sets: 3, reps: '15-20', restSeconds: 60 },
        { ex: 'goblet-skater-squat', sets: 3, reps: '8-12', restSeconds: 105, notes: 'Per side.' },
        { ex: 'hip-supported-db-deadlift', sets: 3, reps: '10-15', restSeconds: 120 },
        { ex: 'standing-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        // Second weekly tricep and chest exposure; the doc's own day lists
        // leave both at one, against its two-exposure minimum.
        { ex: 'cable-ezbar-pressdown', sets: 3, reps: '12-20', restSeconds: 60 },
    ],
};

export const OVERHEAD_DOMINION_CONFIG = definePlan({
    id: 'overhead-dominion',
    name: 'Overhead Dominion',
    weeks: 10,
    defaultTempo: '20X0',
    days: [OVERHEAD_STRENGTH, DELTS_AND_LEGS, SHOULDER_HYPERTROPHY, STRUCTURAL_SHOULDERS],
    phases: [
        { name: 'Bombardment', weeks: [1, 2, 3, 4, 5] },
        {
            name: 'Artillery',
            weeks: [6, 7, 8, 9, 10],
            // Later block moves the press onto 5/3/2 waves, per the doc.
            transform: (slot, ctx) =>
                slot.ex === 'standing-barbell-military-press'
                    ? ctx.week >= 9
                        ? { ...slot, reps: '3', sets: 5, notes: 'Weeks 9–10: optional push-press on the top set only. Strict on the rest.', technique: { kind: 'wave', ladder: [5, 3, 2], waves: 2 } }
                        : { ...slot, reps: '3', sets: 5, technique: { kind: 'wave', ladder: [5, 3, 2], waves: 2 } }
                    : slot,
        },
    ],
    ui: {
        themeClass: 'theme-overhead-dominion',
        coverImage: '/dominion.png',
        navImage: '/dominion.png',
        dashboardWidgets: ['program_status', 'strength_chart', 'workout_history'],
    },
});
