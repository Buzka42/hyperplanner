import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { calendarPlanWeek } from '../../features/planLifecycle';

const progression = { type: 'double' as const, increment: 2.5 };
const slot = (ex: string, sets: number, reps = '8-12', restSeconds = 75): SlotSpec => ({ ex, sets, reps, restSeconds, progression });

export const VENUS_FOUR_DAY: DaySpec[] = [
    { name: 'Lower A — Quads + Glutes', dayOfWeek: 1, slots: [slot('hack-squat', 3), slot('front-foot-elevated-bulgarian-split-squat', 3), slot('seated-hamstring-curl', 2), slot('leg-extension', 2), slot('machine-hip-abduction', 2), slot('hack-calf-raise', 2), slot('ab-wheel', 1)] },
    { name: 'Upper A — Back + Delts', dayOfWeek: 2, slots: [slot('assisted-pull-up', 3), slot('single-arm-hammer-row', 3), slot('incline-dumbbell-bench-press', 3), slot('lateral-raise', 4, '12-20', 60), slot('single-arm-reverse-pec-deck', 2, '12-20', 60), slot('bayesian-cable-curl', 1, '10-15', 60), slot('overhead-tricep-extension', 1, '10-15', 60)] },
    { name: 'Lower B — Glutes + Posterior Chain', dayOfWeek: 4, slots: [slot('hip-thrust', 3), slot('romanian-deadlift', 3), slot('deficit-reverse-lunge', 3), slot('supported-sissy-squat', 2, '10-15'), slot('lying-leg-curl', 2), slot('hack-calf-raise', 2)] },
    { name: 'Upper B — Shape', dayOfWeek: 5, slots: [slot('single-arm-hammer-row', 3), slot('flat-dumbbell-press', 3), slot('pec-deck', 2), slot('seated-dumbbell-shoulder-press', 1), slot('lateral-raise', 4, '12-20', 60), slot('hammer-curl', 1), slot('cable-triceps-extension', 1)] },
];

export const VENUS_THREE_DAY: DaySpec[] = [
    { name: 'FBW A — Quad / Lat / Glute', dayOfWeek: 1, slots: [slot('hack-squat', 3), slot('assisted-pull-up', 3), slot('hip-thrust', 3), slot('incline-dumbbell-bench-press', 2), slot('lateral-raise', 2, '12-20', 60), slot('seated-hamstring-curl', 2), slot('bayesian-cable-curl', 1)] },
    { name: 'FBW B — Hinge / Row / Delt', dayOfWeek: 3, slots: [slot('romanian-deadlift', 3), slot('single-arm-hammer-row', 3), slot('front-foot-elevated-bulgarian-split-squat', 3), slot('seated-dumbbell-shoulder-press', 2), slot('single-arm-reverse-pec-deck', 2, '12-20', 60), slot('cable-triceps-extension', 1), slot('hack-calf-raise', 1)] },
    { name: 'FBW C — Glute / Shape', dayOfWeek: 5, slots: [slot('deficit-reverse-lunge', 3), slot('hammer-chest-press', 2), slot('dumbbell-pullover', 2), slot('leg-extension', 2), slot('lateral-raise', 3, '12-20', 60), slot('side-glute-medius-hip-thrust', 2), slot('hammer-curl', 1), slot('cable-triceps-extension', 1)] },
];

const phases = [
    { name: 'Foundation', weeks: [1, 2, 3, 4] },
    { name: 'Rising', weeks: [5, 6, 7, 8], transform: (s: SlotSpec) => ({ ...s, rpe: 8.5 }) },
    { name: 'Ascension', weeks: [9, 10, 11], transform: (s: SlotSpec) => ({ ...s, rpe: ['lateral-raise', 'leg-extension', 'single-arm-reverse-pec-deck'].includes(s.ex) ? 9.5 : 8.5 }) },
    { name: 'Rebirth', weeks: [12], transform: (s: SlotSpec) => ({ ...s, sets: s.sets >= 3 ? 2 : 1, rpe: 8 }) },
];

const four = definePlan({ id: 'venus-rising', name: 'Venus Rising', weeks: 12, defaultTempo: '20X0', days: VENUS_FOUR_DAY, phases });
const three = definePlan({ id: 'venus-rising-3day-internal', name: 'Venus Rising', weeks: 12, defaultTempo: '20X0', days: VENUS_THREE_DAY, phases });

export const effectiveVenusMode = (user: UserProfile, now = new Date().toISOString()): '3day' | '4day' => {
    const prefs = user.planPreferences?.['venus-rising'];
    let mode: '3day' | '4day' = prefs?.scheduleMode === '3day' ? '3day' : '4day';
    const pending = prefs?.pendingScheduleChange;
    if (!pending) return mode;
    const start = user.programProgress?.['venus-rising']?.startDate ?? user.startDate;
    const sessionsPerWeek = mode === '3day' ? 3 : 4;
    const completedWeek = Math.floor((user.programProgress?.['venus-rising']?.completedSessions ?? 0) / sessionsPerWeek);
    if (calendarPlanWeek(start, now) > pending.requestedDuringWeek && completedWeek >= pending.requestedDuringWeek) mode = pending.mode === '3day' ? '3day' : '4day';
    return mode;
};

const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const match = day.id?.match(/-w(\d+)-d(\d+)$/);
    if (!match) return day;
    const week = Number(match[1]);
    const selected = effectiveVenusMode(user) === '4day' ? day : (three.program.weeks[week - 1]?.days.find(candidate => candidate.dayOfWeek === Number(match[2])) ?? day);
    if (week < 5 || week > 8) return selected;
    const priorities = Object.values(user.planPreferences?.['venus-rising']?.exerciseSelections ?? {}).slice(0, 2);
    let total = selected.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
    return { ...selected, exercises: selected.exercises.map(exercise => {
        if (total >= 16 || exercise.sets !== 2 || !exercise.exerciseId || !priorities.includes(exercise.exerciseId)) return exercise;
        total += 1;
        return { ...exercise, sets: 3 };
    }) };
};

export const VENUS_RISING_CONFIG: PlanConfig = {
    ...four,
    hooks: { ...four.hooks, preprocessDay: preprocess },
    ui: { themeClass: 'theme-venus-rising', coverImage: '/venusrising.png', navImage: '/venusrising.png', dashboardWidgets: ['program_status', 'workout_history'] },
};
