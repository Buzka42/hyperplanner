/**
 * KING OF THE SQUAT — squat-specialisation powerlifting, 12 weeks, 4 days.
 *
 * From HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md section 4.
 *
 * Squat 3x weekly, bench 2x, deadlift once and deliberately light. The
 * deadlift rule matters: it is practised for setup, bar speed and competition
 * skill, and is never progressed aggressively while squatting is the priority
 * — spinal and systemic fatigue is the budget being protected.
 *
 * Loading is wave-based: 5/4/3 for weeks 1-3, 4/3/2 for 4-6, 3/2/1 for 7-9,
 * then realisation and a test week.
 */

import { definePlan } from '../planBuilder';
import type { DaySpec } from '../planBuilder';
import { EXERCISE_BY_ID } from '../exercises/library';
import type { UserProfile, WorkoutDay } from '../../types';

const HEAVY_SQUAT: DaySpec = {
    name: 'Heavy Squat',
    dayOfWeek: 1,
    slots: [
        {
            ex: 'low-bar-squat',
            sets: 6,
            reps: '5',
            restSeconds: 240,
            technique: { kind: 'wave', ladder: [5, 4, 3], waves: 2 },
            progression: { type: 'wave', ladder: [5, 4, 3], waves: 2, basePercent: 0.75, step: 0.025, of: 'squat' },
            tempo: '10X0',
            alternates: ['High Bar Squat', 'Safety Bar Squat'],
            notes: 'Two waves of 5/4/3. Each wave heavier than the last. Swap stance or bar if the hips complain.',
        },
        { ex: 'leg-extension', sets: 3, reps: '8-12', restSeconds: 90 },
        { ex: 'seated-ham-curl', sets: 3, reps: '8-12', restSeconds: 90 },
        { ex: 'long-pause-bench-press', sets: 4, reps: '6-8', restSeconds: 180, tempo: '11X0' },
        { ex: 'hammer-upper-row', sets: 4, reps: '8-12', restSeconds: 120 },
    ],
};

const BENCH_AND_DEADLIFT: DaySpec = {
    name: 'Bench + Deadlift Maintenance',
    dayOfWeek: 2,
    slots: [
        {
            ex: 'wide-grip-bench-press',
            sets: 5,
            reps: '3-5',
            restSeconds: 210,
            progression: { type: 'percentage', of: 'pausedBench', percent: 0.85 },
            tempo: '11X0',
        },
        {
            ex: 'conventional-deadlift',
            sets: 3,
            reps: '3',
            restSeconds: 180,
            progression: { type: 'percentage', of: 'conventionalDeadlift', percent: 0.575 },
            tempo: '10X0',
            notes: 'Deliberately easy. Perfect setup, fast bar speed, no grinding. Do not add weight chasing a PR.',
        },
        { ex: 'hammer-lower-row', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'glute-ham-raise', sets: 3, reps: '10-15', restSeconds: 90 },
        { ex: 'rear-delt-rope-pulls-to-face', sets: 3, reps: '12-20', restSeconds: 75 },
        { ex: 'ab-wheel', sets: 3, reps: '10-20', restSeconds: 90 },
    ],
};

const SQUAT_VOLUME: DaySpec = {
    name: 'Squat Volume',
    dayOfWeek: 4,
    slots: [
        {
            ex: 'paused-back-squat',
            sets: 5,
            reps: '5-8',
            restSeconds: 210,
            progression: { type: 'percentage', of: 'squat', percent: 0.675 },
            tempo: '12X0',
            notes: 'Two seconds motionless in the hole. Positional strength, not a max.',
        },
        { ex: 'heel-elevated-goblet-squat', sets: 3, reps: '10-15', restSeconds: 90 },
        { ex: 'hip-adduction', sets: 3, reps: '12-15', restSeconds: 75 },
        { ex: 'pull-up', sets: 4, reps: '6-10', restSeconds: 120 },
        { ex: 'heavy-rolling-tricep-extension', sets: 4, reps: '10-15', restSeconds: 75 },
        { ex: 'seated-dumbbell-shoulder-press', sets: 3, reps: '8-12', restSeconds: 90 },
    ],
};

const STRUCTURAL_SQUAT: DaySpec = {
    name: 'Structural Squat + Heavy Bench',
    dayOfWeek: 5,
    slots: [
        {
            ex: 'front-squat',
            sets: 5,
            reps: '3-6',
            restSeconds: 210,
            progression: { type: 'percentage', of: 'squat', percent: 0.6 },
            alternates: ['Safety Bar Squat'],
            tempo: '10X0',
            // Section 2.7: keep reps low so the upper back is not the limiter.
            notes: 'Keep the reps low. If the upper back folds before the legs, the load is doing the wrong job.',
        },
        {
            ex: 'paused-bench-press',
            sets: 5,
            reps: '3',
            restSeconds: 240,
            progression: { type: 'percentage', of: 'pausedBench', percent: 0.875 },
            tempo: '11X0',
        },
        { ex: 'hip-supported-db-deadlift', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'hack-calf-raise', sets: 4, reps: '10-20', restSeconds: 75 },
        { ex: 'rear-delt-fly', sets: 3, reps: '15-20', restSeconds: 60 },
    ],
};

export const KING_OF_THE_SQUAT_CONFIG = definePlan({
    id: 'king-of-the-squat',
    name: 'King of the Squat',
    weeks: 12,
    days: [HEAVY_SQUAT, BENCH_AND_DEADLIFT, SQUAT_VOLUME, STRUCTURAL_SQUAT],
    phases: [
        {
            name: 'Volume Waves',
            weeks: [1, 2, 3],
            transform: slot => (slot.ex === 'low-bar-squat' ? { ...slot, reps: '5', sets: 6 } : slot),
        },
        {
            name: 'Intensity Waves',
            weeks: [4, 5, 6],
            transform: slot =>
                slot.ex === 'low-bar-squat'
                    ? { ...slot, reps: '4', sets: 6, technique: { kind: 'wave', ladder: [4, 3, 2], waves: 2 } }
                    : slot,
        },
        {
            name: 'Peak Waves',
            weeks: [7, 8, 9],
            transform: slot =>
                slot.ex === 'low-bar-squat'
                    ? { ...slot, reps: '3', sets: 6, technique: { kind: 'wave', ladder: [3, 2, 1], waves: 2 } }
                    : slot,
        },
        {
            name: 'Realisation',
            weeks: [10, 11],
            transform: slot =>
                slot.ex === 'low-bar-squat' ? { ...slot, reps: '2', sets: 4 } : { ...slot, sets: Math.max(2, slot.sets - 1) },
        },
        {
            name: 'Test Week',
            weeks: [12],
            transform: slot =>
                slot.ex === 'low-bar-squat'
                    ? { ...slot, reps: '1', sets: 3, notes: 'Squat test. Work up to a single you are certain of.' }
                    : { ...slot, sets: Math.max(1, slot.sets - 2) },
        },
    ],
    hooks: {
        preprocessDay: (day: WorkoutDay, user: UserProfile): WorkoutDay => {
            const choices = user.planPreferences?.['king-of-the-squat']?.exerciseSelections ?? {};
            const jobs: Array<[string, string | undefined]> = [
                ['long-pause-bench-press', choices.benchJob1],
                ['wide-grip-bench-press', choices.benchJob2],
                ['paused-bench-press', choices.benchJob3],
            ];
            return jobs.reduce((result, [from, to]) => {
                if (!to || to === from) return result;
                const entry = EXERCISE_BY_ID[to];
                if (!entry) return result;
                return {
                    ...result,
                    exercises: result.exercises.map(exercise =>
                        exercise.exerciseId === from ? { ...exercise, exerciseId: entry.id, name: entry.name.en } : exercise
                    ),
                };
            }, day);
        },
    },
    ui: {
        themeClass: 'theme-king-of-the-squat',
        coverImage: '/squatking.png',
        navImage: '/squatking.png',
        dashboardWidgets: ['1rm', 'program_status', 'strength_chart', 'workout_history'],
    },
});
