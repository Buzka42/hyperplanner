/**
 * GRAVITY IS OPTIONAL — weighted calisthenics + hypertrophy, 12 weeks, 4 days.
 *
 * From HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md section 3.
 *
 * Vertical pulling and the dip family three times weekly, arms 2-3x, quads and
 * posterior chain twice. The distinguishing mechanic is total system weight:
 * bodyweight plus added load, which is why the pull-up and dip are typed
 * `weighted-bodyweight` in the library rather than as plain external lifts.
 *
 * Day 3 uses total-rep targets rather than sets — hit 40 chin-ups in as few
 * sets as possible and beat last time's set count.
 */

import { definePlan } from '../planBuilder';
import type { DaySpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { EXERCISE_BY_ID } from '../exercises/library';
import { GRAVITY_ABS_SLOTS } from '../../features/planSelections/options';

const HEAVY_GRAVITY: DaySpec = {
    name: 'Heavy Gravity',
    dayOfWeek: 1,
    slots: [
        {
            ex: 'weighted-chin-up',
            sets: 5,
            reps: '3-5',
            restSeconds: 210,
            progression: { type: 'double', increment: 2.5 },
            notes: 'All five sets at five clean reps earns +2.5 kg next exposure.',
        },
        {
            ex: 'weighted-dip',
            sets: 5,
            reps: '3-5',
            restSeconds: 210,
            progression: { type: 'double', increment: 2.5 },
        },
        { ex: 'hammer-upper-row', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'sissy-squat', sets: 3, reps: '10-15', restSeconds: 90 },
        { ex: 'hanging-leg-raise', sets: 3, reps: '10-20', restSeconds: 75 },
    ],
};

const SINGLE_LEG_GRAVITY: DaySpec = {
    name: 'Single-Leg Gravity',
    dayOfWeek: 2,
    slots: [
        { ex: 'goblet-skater-squat', sets: 4, reps: '8-12', restSeconds: 120, notes: 'Per side.' },
        { ex: 'hip-supported-db-deadlift', sets: 4, reps: '8-12', restSeconds: 120 },
        { ex: 'trx-body-row', sets: 3, reps: '10-15', restSeconds: 90 },
        { ex: 'deficit-push-up', sets: 3, reps: 'AMRAP', restSeconds: 90 },
        // Second weekly calf exposure. The concept doc's own day lists put
        // calves on day 4 only, which breaks its "2 meaningful weekly
        // exposures" rule; section 16's intent wins over the literal listing.
        { ex: 'standing-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'ab-wheel', sets: 3, reps: '6-15', restSeconds: 75 },
    ],
};

const VOLUME_GRAVITY: DaySpec = {
    name: 'Volume Gravity',
    dayOfWeek: 4,
    slots: [
        {
            ex: 'chin-up',
            sets: 6,
            reps: 'AMRAP',
            restSeconds: 120,
            technique: { kind: 'total-reps', targetReps: 40, maxSets: 12 },
            notes: 'Accumulate 40 total reps in as few sets as you can. Beat last session on set count, not reps.',
        },
        {
            ex: 'dip',
            sets: 6,
            reps: 'AMRAP',
            restSeconds: 120,
            technique: { kind: 'total-reps', targetReps: 50, maxSets: 12 },
            notes: 'Accumulate 50 total reps.',
        },
        { ex: 'heel-elevated-goblet-squat', sets: 4, reps: '10-15', restSeconds: 90 },
        { ex: 'cable-lateral-raise', sets: 2, reps: '12-20', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'cable-curl', sets: 2, reps: '10-15', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'cable-triceps-extension', sets: 2, reps: '10-15', restSeconds: 60, technique: { kind: 'last-set-failure' } },
    ],
};

const CONTROL_GRAVITY: DaySpec = {
    name: 'Control Gravity',
    dayOfWeek: 5,
    slots: [
        { ex: 'trx-push-up', sets: 3, reps: '10-20', restSeconds: 90 },
        { ex: 'trx-body-row', sets: 3, reps: '10-20', restSeconds: 90 },
        // Second weekly side-delt exposure, for the same reason as calves above.
        { ex: 'cable-lateral-raise', sets: 3, reps: '15-25', restSeconds: 60 },
        { ex: 'sissy-squat', sets: 3, reps: '12-20', restSeconds: 90 },
        {
            ex: 'hip-supported-db-deadlift',
            sets: 3,
            reps: '12-15',
            restSeconds: 90,
            tempo: '40X0',
            // Dumbbells cap at 50 kg each, so tempo buys difficulty that load cannot.
            notes: 'Four-second lowering. Once 2x50 kg stops being hard, add time under tension before adding reps.',
        },
        { ex: 'standing-calf-raise', sets: 3, reps: '15-25', restSeconds: 60 },
        { ex: 'hanging-knee-raise', sets: 3, reps: '12-20', restSeconds: 60 },
    ],
};

const base = definePlan({
    id: 'gravity-is-optional',
    name: 'Gravity Is Optional',
    weeks: 12,
    days: [HEAVY_GRAVITY, SINGLE_LEG_GRAVITY, VOLUME_GRAVITY, CONTROL_GRAVITY],
    phases: [
        { name: 'Ascent', weeks: [1, 2, 3, 4] },
        {
            name: 'Escape Velocity',
            weeks: [5, 6, 7, 8],
            // Strength block: the weighted work gets an extra set, everything
            // else holds so total fatigue stays flat.
            transform: slot =>
                slot.ex === 'weighted-chin-up' || slot.ex === 'weighted-dip'
                    ? { ...slot, sets: slot.sets + 1 }
                    : slot,
        },
        {
            name: 'Orbit',
            weeks: [9, 10, 11, 12],
            transform: slot =>
                slot.technique?.kind === 'total-reps'
                    ? { ...slot, technique: { ...slot.technique, targetReps: Math.round(slot.technique.targetReps * 1.25) } }
                    : slot,
        },
    ],
    ui: {
        themeClass: 'theme-gravity-is-optional',
        coverImage: '/gravityoptional.png',
        navImage: '/gravityoptional.png',
        dashboardWidgets: ['program_status', 'strength_chart', 'workout_history'],
    },
});

export const GRAVITY_IS_OPTIONAL_CONFIG: PlanConfig = {
    ...base,
    onboarding: { ...base.onboarding, requireBodyweight: true },
    hooks: {
        ...base.hooks,
        preprocessDay: (day: WorkoutDay, user: UserProfile): WorkoutDay => {
            const chosen = user.planPreferences?.['gravity-is-optional']?.exerciseSelections?.abs
                ?? user.trainingPreferences?.coreRaiseId;
            const entry = chosen ? EXERCISE_BY_ID[chosen] : undefined;
            if (!entry) return day;
            return {
                ...day,
                exercises: day.exercises.map(exercise =>
                    GRAVITY_ABS_SLOTS.has(exercise.exerciseId ?? '')
                        ? {
                            ...exercise,
                            exerciseId: entry.id,
                            name: entry.name.en,
                            notes: chosen === 'ab-wheel-rollout'
                                ? 'Chest to the ground every rep.'
                                : exercise.notes,
                        }
                        : exercise),
            };
        },
    },
};
