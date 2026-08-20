/**
 * ARMS RACE — biceps/triceps specialisation, 8 weeks.
 *
 * Three-session rotation (Volume, Lengthened, Pump) plus an optional fourth
 * Go Nuclear day. No biceps movement repeats inside the regular rotation;
 * the incline-lying curl on Nuclear is the one sanctioned exception because
 * its load is prescribed from the Lengthened day.
 */

import { definePlan } from '../planBuilder';
import type { DaySpec, SlotSpec } from '../planBuilder';
import { tricepGiantSet } from '../tricepGiantSet';
import type { UserProfile, WorkoutDay } from '../../types';

const isArm = (ex: string) =>
    /curl|pressdown|extension|skull|french|tricep|bicep|close-grip-bench/.test(ex);

const VOLUME: DaySpec = {
    name: 'Volume + Legs',
    dayOfWeek: 1,
    slots: [
        { ex: 'close-grip-bench-press', sets: 4, reps: '6-10', restSeconds: 180, progression: { type: 'double', increment: 2.5 } },
        { ex: 'rope-hammer-curl', sets: 4, reps: '8-12', restSeconds: 75 },
        { ex: 'reverse-curl', sets: 3, reps: '8-12', restSeconds: 75 },
        { ex: 'rope-pressdown', sets: 2, reps: '12-20', restSeconds: 60 },
        { ex: 'hack-squat', sets: 3, reps: '8-12', restSeconds: 150 },
        { ex: 'hack-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'hip-supported-db-deadlift', sets: 2, reps: '8-12', restSeconds: 120 },
    ],
};

const LENGTHENED: DaySpec = {
    name: 'Lengthened',
    dayOfWeek: 3,
    slots: [
        { ex: 'bayesian-cable-curl', sets: 4, reps: '8-12', restSeconds: 75, notes: 'Lengthened lead — arm behind the torso.' },
        { ex: 'rolling-dumbbell-tricep-extension', sets: 4, reps: '10-15', restSeconds: 75 },
        { ex: '30-incline-lying-dumbbell-curl', sets: 3, reps: '12-15', restSeconds: 60 },
        { ex: 'french-press', sets: 2, reps: '10-15', restSeconds: 75 },
        { ex: 'bench-supported-single-arm-cable-pulldown', sets: 3, reps: '8-12', restSeconds: 105 },
        { ex: 'pec-deck', sets: 2, reps: '12-15', restSeconds: 75 },
        { ex: 'behind-the-back-cable-lateral-raise', sets: 2, reps: '15-20', restSeconds: 60 },
    ],
};

const PUMP: DaySpec = {
    name: 'Pump',
    dayOfWeek: 5,
    slots: [
        { ex: 'standing-straight-bar-curl', sets: 4, reps: '8-12', restSeconds: 30, pair: 'A1', progression: { type: 'double', increment: 2.5 } },
        { ex: 'lying-dumbbell-skullcrusher', sets: 4, reps: '12-15', restSeconds: 90, pair: 'A2' },
        { ex: 'machine-curl', sets: 3, reps: '10-15', restSeconds: 30, pair: 'B1' },
        { ex: 'triangle-pushdown', sets: 2, reps: '12-20', restSeconds: 90, pair: 'B2' },
        { ex: 'heel-elevated-goblet-squat', sets: 3, reps: '10-15', restSeconds: 90 },
        { ex: 'hack-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'cable-crunch', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'seated-ham-curl', sets: 2, reps: '10-15', restSeconds: 90 },
    ],
};

const NUCLEAR: DaySpec = {
    name: 'Go Nuclear (optional)',
    dayOfWeek: 6,
    slots: [
        { ex: 'dip', sets: 2, reps: '5', restSeconds: 0, optional: true },
        { ex: 'rolling-dumbbell-tricep-extension', sets: 2, reps: '10', restSeconds: 0, optional: true },
        { ex: 'banded-ezbar-bar-skullcrushers', sets: 2, reps: '15', restSeconds: 90, optional: true },
        { ex: '30-incline-lying-dumbbell-curl', sets: 2, reps: '12-15', restSeconds: 75, optional: true },
        { ex: '30-smith-incline-bench-press', sets: 3, reps: '8-12', restSeconds: 120, optional: true },
        { ex: 'hammer-upper-row', sets: 3, reps: '8-12', restSeconds: 120, optional: true },
        { ex: 'rear-delt-fly', sets: 2, reps: '15-20', restSeconds: 60, optional: true },
    ],
};

const nuclearGiantSet = (day: WorkoutDay): WorkoutDay => {
    if (!day.dayName.includes('Go Nuclear')) return day;
    const rest = day.exercises.filter(exercise =>
        exercise.exerciseId !== 'dip'
        && exercise.exerciseId !== 'rolling-dumbbell-tricep-extension'
        && exercise.exerciseId !== 'banded-ezbar-bar-skullcrushers');
    return {
        ...day,
        exercises: [
            { ...tricepGiantSet('arms-race-nuclear-tri', 2, 'taper'), optional: true },
            ...rest,
        ],
    };
};

/**
 * Only the optional fourth session collapses the incline curl into one extended
 * myo-rep set. The Lengthened day runs the same movement as three straight sets
 * and is where the nuclear load is read from, so matching on exercise id alone
 * flattened it to a single set too.
 */
const bicepsGiantSet = (day: WorkoutDay): WorkoutDay => ({
    ...day,
    exercises: day.exercises.map(exercise => {
        if (!day.dayName?.startsWith('Go Nuclear')) return exercise;
        if (exercise.exerciseId !== '30-incline-lying-dumbbell-curl') return exercise;
        return {
            ...exercise,
            sets: 1,
            target: { ...exercise.target, type: 'range' as const, reps: '30-40' },
            notes: 'One extended myo-rep set. 30–40 total reps, then 3–4 cheat eccentrics. Load from the Lengthened-day incline curl.',
            prescription: {
                ...exercise.prescription,
                technique: { kind: 'myo-reps', miniSets: 4, miniReps: '5-8', restBreaths: 5 },
            },
        };
    }),
});

export const ARMS_RACE_CONFIG = definePlan({
    id: 'arms-race',
    name: 'Arms Race',
    weeks: 8,
    defaultTempo: '20X0',
    days: [VOLUME, LENGTHENED, PUMP, NUCLEAR],
    session: { kind: 'rotation', rotation: { capPer7Days: 6, minHoursBetween: 36, trainingDays: 3 } },
    schedule: { selectable: false },
    phases: [
        { name: 'Escalation', weeks: [1, 2, 3, 4] },
        {
            name: 'Proliferation',
            weeks: [5, 6, 7, 8],
            transform: (slot: SlotSpec) =>
                isArm(slot.ex)
                    ? { ...slot, technique: { kind: 'myo-reps', miniSets: 2, miniReps: '4-5', restBreaths: 5 } }
                    : slot,
        },
    ],
    hooks: {
        preprocessDay: (day, _user: UserProfile) => bicepsGiantSet(nuclearGiantSet(day)),
    },
    ui: {
        themeClass: 'theme-arms-race',
        coverImage: '/armsrace.png',
        navImage: '/armsrace.png',
        dashboardWidgets: ['program_status', 'strength_chart', 'arm_tracker', 'workout_history'],
    },
});
