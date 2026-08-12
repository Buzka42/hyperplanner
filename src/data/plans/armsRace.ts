/**
 * ARMS RACE — biceps/triceps specialisation, 8 weeks, 4 days.
 *
 * From HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md section 9.
 *
 * Arms four times weekly, and the doc is explicit that the four exposures must
 * differ in function and loading — so they are: heavy elbow flexion and
 * extension, brachialis and reverse-grip work, lengthened positions, then a
 * density day run as supersets. Everything else stays at twice weekly.
 */

import { definePlan } from '../planBuilder';
import type { DaySpec } from '../planBuilder';

const ARM_STRENGTH: DaySpec = {
    name: 'Arm Strength',
    dayOfWeek: 1,
    slots: [
        {
            ex: 'close-grip-bench-press',
            sets: 5,
            reps: '4-6',
            restSeconds: 210,
            progression: { type: 'double', increment: 2.5 },
        },
        {
            ex: 'standing-straight-bar-curl',
            sets: 5,
            reps: '4-6',
            restSeconds: 180,
            progression: { type: 'double', increment: 2.5 },
            notes: 'Heavy elbow flexion. Strict enough that the load is doing the work, not the hips.',
        },
        { ex: 'flat-dumbbell-press', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'hammer-upper-row', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'rear-delt-fly', sets: 3, reps: '15-20', restSeconds: 60 },
    ],
};

const BRACHIALIS_AND_LEGS: DaySpec = {
    name: 'Brachialis + Legs',
    dayOfWeek: 2,
    slots: [
        { ex: 'reverse-curl', sets: 3, reps: '8-12', restSeconds: 75 },
        { ex: 'dumbbell-hammer-curl', sets: 3, reps: '10-15', restSeconds: 75 },
        { ex: 'cable-triceps-extension', sets: 3, reps: '10-15', restSeconds: 75, notes: 'Overhead. Long head under stretch.' },
        { ex: 'rope-pressdown', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'hack-squat', sets: 3, reps: '8-12', restSeconds: 150 },
        { ex: 'hip-supported-db-deadlift', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'standing-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
    ],
};

const LENGTHENED_ARMS: DaySpec = {
    name: 'Lengthened Arms + Torso',
    dayOfWeek: 4,
    slots: [
        { ex: '30-incline-lying-dumbbell-curl', sets: 3, reps: '8-12', restSeconds: 75, notes: 'Arm behind the torso — that stretch is the point.' },
        { ex: 'bayesian-cable-curl', sets: 3, reps: '12-15', restSeconds: 60 },
        { ex: 'cable-triceps-extension', sets: 3, reps: '10-15', restSeconds: 60 },
        { ex: 'french-press', sets: 3, reps: '10-15', restSeconds: 75 },
        { ex: 'incline-barbell-bench-press', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'lat-pulldown', sets: 3, reps: '8-12', restSeconds: 105 },
        { ex: 'cable-lateral-raise', sets: 3, reps: '15-20', restSeconds: 60 },
    ],
};

const ARM_DENSITY: DaySpec = {
    name: 'Arm Density + Legs',
    dayOfWeek: 5,
    slots: [
        { ex: 'standing-straight-bar-curl', sets: 4, reps: '8-12', restSeconds: 30, pair: 'A1' },
        { ex: 'lying-dumbbell-skullcrusher', sets: 4, reps: '12-15', restSeconds: 90, pair: 'A2' },
        { ex: 'rope-hammer-curl', sets: 3, reps: '12-20', restSeconds: 30, pair: 'B1' },
        { ex: 'rope-pressdown', sets: 3, reps: '12-20', restSeconds: 90, pair: 'B2' },
        { ex: 'heel-elevated-goblet-squat', sets: 3, reps: '10-15', restSeconds: 90 },
        { ex: 'seated-ham-curl', sets: 3, reps: '10-15', restSeconds: 90 },
        { ex: 'standing-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'cable-crunch', sets: 3, reps: '12-20', restSeconds: 60 },
    ],
};

export const ARMS_RACE_CONFIG = definePlan({
    id: 'arms-race',
    name: 'Arms Race',
    weeks: 8,
    defaultTempo: '20X0',
    days: [ARM_STRENGTH, BRACHIALIS_AND_LEGS, LENGTHENED_ARMS, ARM_DENSITY],
    phases: [
        { name: 'Escalation', weeks: [1, 2, 3, 4] },
        {
            name: 'Proliferation',
            weeks: [5, 6, 7, 8],
            // Density block: arm work gains a set, everything else holds.
            transform: slot =>
                slot.pair || slot.ex.includes('curl') || slot.ex.includes('pressdown')
                    ? { ...slot, sets: slot.sets + 1 }
                    : slot,
        },
    ],
    ui: {
        themeClass: 'theme-arms-race',
        coverImage: '/armsrace.png',
        navImage: '/armsrace.png',
        dashboardWidgets: ['program_status', 'strength_chart', 'workout_history'],
    },
});
