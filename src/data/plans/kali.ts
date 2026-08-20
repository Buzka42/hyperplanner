import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { EXERCISE_BY_ID } from '../exercises/library';

const d = { type: 'double' as const, increment: 2.5 };
const s = (ex: string, sets: number, reps = '8-12', options: Partial<SlotSpec> = {}): SlotSpec => ({ ex, sets, reps, restSeconds: options.systemicCompound ? 150 : 75, progression: d, ...options });
export const KALI_DAYS: DaySpec[] = [
    { name: 'I — Earth', dayOfWeek: 1, slots: [s('high-bar-squat', 3, '3-6', { systemicCompound: true }), s('leg-press', 2), s('front-foot-elevated-bulgarian-split-squat', 2, '8-12', { unilateral: true }), s('seated-hamstring-curl', 2), s('hammer-pulldown', 3, '8-12', { unilateral: true }), s('cable-lateral-raise', 2), s('hack-calf-raise', 2), s('cable-triceps-extension', 2)] },
    { name: 'II — Hunt', dayOfWeek: 2, slots: [s('assisted-pull-up', 3, '4-6', { systemicCompound: true }), s('30-smith-incline-bench-press', 2), s('pec-deck', 2), s('single-leg-machine-hip-thrust', 3, '8-12', { unilateral: true }), s('single-arm-hammer-row', 2, '8-12', { unilateral: true }), s('lying-cable-lat-raise', 2), s('machine-curl', 2), s('overhead-tricep-extension', 2)] },
    { name: 'III — Death', dayOfWeek: 4, slots: [s('romanian-deadlift', 3, '4-6', { systemicCompound: true }), s('hack-squat', 2), s('leg-extension', 2), s('lat-prayer', 3), s('machine-hip-abduction', 3), s('side-lying-rear-delt-fly', 2, '12-20', { unilateral: true }), s('cable-crunch', 2), s('hack-calf-raise', 2)] },
    { name: 'IV — Rebirth', dayOfWeek: 5, slots: [s('paused-bench-press', 3, '3-6', { systemicCompound: true }), s('dip', 2), s('single-arm-hammer-row', 3, '8-12', { unilateral: true }), s('single-leg-hip-thrust', 3, '8-12', { unilateral: true }), s('bench-supported-single-arm-cable-pulldown', 2), s('lying-leg-curl', 2), s('lateral-raise', 2), s('machine-curl', 2)] },
];
const base = definePlan({ id: 'kali', name: 'Kali', weeks: 8, defaultTempo: '20X0', days: KALI_DAYS, phases: [
    { name: 'Severance', weeks: [1, 2] }, { name: 'Preservation', weeks: [3, 4, 5] },
    { name: 'Unleashed I', weeks: [6], transform: slot => ['leg-press', 'pec-deck'].includes(slot.ex) ? { ...slot, technique: { kind: 'rest-pause', bursts: 2, restSeconds: 20, applyTo: 'last' as const } } : slot },
    { name: 'Unleashed II', weeks: [7], transform: slot => ['hack-squat', 'dip'].includes(slot.ex) ? { ...slot, technique: { kind: 'myo-reps', activationReps: '12-20', miniSets: 3, miniReps: '4-5', restBreaths: 5, applyTo: 'last' as const } } : slot },
    { name: 'Unleashed III', weeks: [8] },
] });
const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    let result = day;
    if (day.dayOfWeek === 2) {
        const choice = user.planPreferences?.kali?.exerciseSelections?.pullAnchor ?? 'assisted-pull-up'; const entry = EXERCISE_BY_ID[choice];
        if (entry) result = { ...result, exercises: result.exercises.map((exercise, index) => index === 0 ? { ...exercise, exerciseId: entry.id, name: entry.name.en } : exercise) };
    }
    if (day.id?.includes('-w8-')) {
        const repeat = user.planPreferences?.kali?.exerciseSelections?.week8Intensifier;
        const targets = repeat === 'myo' ? ['hack-squat', 'dip'] : repeat === 'rest-pause' ? ['leg-press', 'pec-deck'] : [];
        result = { ...result, exercises: result.exercises.map(exercise => targets.includes(exercise.exerciseId ?? '') ? { ...exercise, prescription: { ...exercise.prescription, technique: repeat === 'myo' ? { kind: 'myo-reps', activationReps: '12-20', miniSets: 3, miniReps: '4-5', restBreaths: 5, applyTo: 'last' } : { kind: 'rest-pause', bursts: 2, restSeconds: 20, applyTo: 'last' } } } : exercise) };
    }
    if (user.kaliStatus?.aggressive) {
        const lastAccessory = [...result.exercises].reverse().find(exercise => (exercise.sets ?? 0) <= 2);
        if (lastAccessory) result = { ...result, exercises: result.exercises.filter(exercise => exercise.id !== lastAccessory.id) };
    }
    return result;
};
export const KALI_CONFIG: PlanConfig = {
    ...base,
    onboarding: { ...base.onboarding, requireBodyweight: true },
    hooks: { ...base.hooks, preprocessDay: preprocess },
    ui: { themeClass: 'theme-kali', coverImage: '/kali.png', navImage: '/kali.png', dashboardWidgets: ['program_status', 'workout_history'] },
};
