/**
 * ORACLE — 10 weeks, four-day upper/lower, built to test prediction.
 *
 * Weeks 1–2 calibrate: the plan collects comparable exposures before it claims
 * to know anything. From week 3 each slot arrives with a predicted load whose
 * confidence is stated, and the prediction is scored against what actually
 * happened.
 *
 * The prescription is always computable from the priors in
 * `src/features/oracle/prediction.ts`. The model, when the owner has enabled
 * it, may only refine that number inside a bounded window.
 */

import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { predictFromPriors, type Exposure } from '../../features/oracle/prediction';

const double = { type: 'double' as const, increment: 2.5 };
const s = (ex: string, sets: number, reps = '6-10', options: Partial<SlotSpec> = {}): SlotSpec =>
    ({ ex, sets, reps, restSeconds: options.systemicCompound ? 150 : 90, progression: double, ...options });

export const ORACLE_DAYS: DaySpec[] = [
    { name: 'Oracle — Upper A', dayOfWeek: 1, slots: [
        s('flat-barbell-bench-press', 4, '5-8', { primary: true }),
        s('single-arm-hammer-row', 4, '8-12', { unilateral: true }),
        s('seated-dumbbell-shoulder-press', 3, '8-12'),
        s('lat-pulldown', 3, '8-12'),
        s('lateral-raise', 3, '12-15'),
        s('cable-triceps-extension', 2, '10-15'),
        s('hammer-curl', 2, '8-12'),
    ] },
    { name: 'Oracle — Lower A', dayOfWeek: 2, slots: [
        s('barbell-squat', 4, '5-8', { systemicCompound: true, primary: true }),
        s('romanian-deadlift', 3, '6-10'),
        s('leg-press', 3, '8-12'),
        s('seated-hamstring-curl', 3, '10-15'),
        s('leg-extension', 3, '12-15'),
        s('hack-calf-raise', 3, '12-20'),
    ] },
    { name: 'Oracle — Upper B', dayOfWeek: 4, slots: [
        s('incline-dumbbell-bench-press', 4, '6-10', { primary: true }),
        s('hammer-pulldown', 4, '8-12'),
        s('hammer-chest-press', 3, '8-12'),
        s('single-arm-reverse-pec-deck', 3, '12-15', { unilateral: true }),
        s('lateral-raise', 3, '12-20'),
        s('rope-pressdown', 2, '10-15'),
        s('cable-curl', 2, '10-15'),
    ] },
    { name: 'Oracle — Lower B', dayOfWeek: 5, slots: [
        s('hack-squat', 4, '6-10', { systemicCompound: true, primary: true }),
        s('lying-leg-curl', 3, '10-15'),
        s('front-foot-elevated-bulgarian-split-squat', 3, '8-12', { unilateral: true }),
        s('single-leg-machine-hip-thrust', 3, '10-15', { unilateral: true }),
        s('hack-calf-raise', 3, '12-20'),
        s('ab-wheel', 2, '8-12'),
    ] },
];

const phases = [
    // Calibration is the plan working, not the plan warming up: these two weeks
    // exist to produce comparable exposures.
    { name: 'Calibration', weeks: [1, 2], transform: (slot: SlotSpec): SlotSpec => ({ ...slot, rpe: 8 }) },
    { name: 'Reading', weeks: [3, 4, 5] },
    { name: 'Prediction', weeks: [6, 7, 8] },
    { name: 'Proof', weeks: [9, 10] },
];

const base = definePlan({ id: 'oracle', name: 'Oracle', weeks: 10, days: ORACLE_DAYS, phases });

export const isCalibrationWeek = (week: number): boolean => week <= 2;

const exposuresFor = (user: UserProfile, exerciseId: string): Exposure[] =>
    (user.oracleStatus?.exposures ?? [])
        .filter(exposure => exposure.exerciseId === exerciseId)
        .map(exposure => ({
            date: exposure.date,
            loadKg: exposure.loadKg,
            reps: exposure.reps,
            rir: exposure.rir,
            comparable: exposure.comparable,
            externalFactor: exposure.externalFactor,
        }));

/**
 * Annotates each slot with its prediction and stated confidence. The model
 * refinement is asynchronous and belongs to the session UI; this hook only
 * produces the prior-based prediction, so a session sheet is never waiting on
 * a network call.
 */
const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const week = Number(day.id?.match(/-w(\d+)-/)?.[1] ?? 1);
    if (isCalibrationWeek(week)) {
        return { ...day, exercises: day.exercises.map(exercise => ({
            ...exercise,
            notes: exercise.notes ?? 'Calibration week — train to the target and report RIR honestly. No prediction yet.',
        })) };
    }

    return { ...day, exercises: day.exercises.map(exercise => {
        if (!exercise.exerciseId) return exercise;
        const targetReps = exercise.target.reps.split('-').map(Number);
        const prediction = predictFromPriors({
            exerciseId: exercise.exerciseId,
            targetReps: [targetReps[0] || 5, targetReps[1] || targetReps[0] || 8],
            sets: exercise.sets,
            exposures: exposuresFor(user, exercise.exerciseId),
        });

        const label = prediction.offersCalibration
            ? `Low confidence — ${prediction.rationale}`
            : prediction.range
                ? `Predicted ${prediction.range[0]}–${prediction.range[1]} kg (medium confidence). ${prediction.rationale}`
                : `Predicted ${prediction.loadKg} kg (high confidence). ${prediction.rationale}`;

        return { ...exercise, notes: exercise.notes ?? label };
    }) };
};

export const ORACLE_CONFIG: PlanConfig = {
    ...base,
    hooks: { ...base.hooks, preprocessDay: preprocess },
    ui: { themeClass: 'theme-oracle', coverImage: '/oracle.png', navImage: '/oracle.png', dashboardWidgets: ['program_status', 'workout_history'] },
};
