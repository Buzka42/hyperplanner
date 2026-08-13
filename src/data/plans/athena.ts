import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { calendarPlanWeek } from '../../features/planLifecycle';
import { EXERCISE_BY_ID } from '../exercises/library';

const double = { type: 'double' as const, increment: 2.5 };
const main = new Set(['barbell-squat', 'flat-barbell-bench-press', 'romanian-deadlift', 'standing-barbell-military-press']);
const s = (ex: string, sets: number, reps = '6-10', restSeconds = 90): SlotSpec => ({ ex, sets, reps, restSeconds, progression: double, primary: main.has(ex) });

export const ATHENA_FOUR_DAY: DaySpec[] = [
    { name: 'Lower A — Squat', dayOfWeek: 1, slots: [s('barbell-squat', 4, '6-8', 150), s('romanian-deadlift', 3, '6-10', 120), s('front-foot-elevated-bulgarian-split-squat', 2), s('seated-hamstring-curl', 2), s('hack-calf-raise', 2), s('ab-wheel', 2)] },
    { name: 'Upper A — Bench', dayOfWeek: 2, slots: [s('flat-barbell-bench-press', 4, '6-8', 150), s('single-arm-hammer-row', 3), s('assisted-pull-up', 3), s('seated-dumbbell-shoulder-press', 2), s('single-arm-reverse-pec-deck', 2), s('cable-triceps-extension', 1), s('hammer-curl', 1)] },
    { name: 'Lower B — Hinge', dayOfWeek: 4, slots: [s('romanian-deadlift', 3, '5-8', 150), s('paused-squat', 3), s('hip-thrust', 2), s('leg-extension', 2), s('lying-leg-curl', 2), s('hack-calf-raise', 2), s('ab-wheel', 1)] },
    { name: 'Upper B — Press/Pull', dayOfWeek: 5, slots: [s('standing-barbell-military-press', 3, '6-8', 150), s('assisted-pull-up', 3), s('incline-dumbbell-bench-press', 2), s('pec-deck', 2), s('single-arm-hammer-row', 2), s('lateral-raise', 1), s('hammer-curl', 1), s('cable-triceps-extension', 1)] },
];

export const ATHENA_THREE_DAY: DaySpec[] = [
    { name: 'Athena I — Squat Emphasis', dayOfWeek: 1, slots: [s('barbell-squat', 4, '6-8', 150), s('flat-barbell-bench-press', 3, '6-8', 120), s('single-arm-hammer-row', 3), s('seated-hamstring-curl', 2), s('lateral-raise', 2), s('cable-triceps-extension', 1)] },
    { name: 'Athena II — Hinge Emphasis', dayOfWeek: 3, slots: [s('romanian-deadlift', 3, '5-8', 150), s('standing-barbell-military-press', 3, '6-8', 120), s('assisted-pull-up', 3), s('front-foot-elevated-bulgarian-split-squat', 3), s('hammer-curl', 1), s('ab-wheel', 2)] },
    { name: 'Athena III — Press + Secondary Lower', dayOfWeek: 5, slots: [s('flat-barbell-bench-press', 4, '6-8', 150), s('paused-squat', 3), s('romanian-deadlift', 2), s('single-arm-hammer-row', 3), s('seated-dumbbell-shoulder-press', 2), s('hack-calf-raise', 1)] },
];

const phases = [
    { name: 'Wisdom', weeks: [1, 2, 3, 4] },
    { name: 'Discipline', weeks: [5, 6, 7, 8], transform: (slot: SlotSpec) => slot.primary ? { ...slot, progression: { type: 'top-set-backoff' as const, topReps: [4, 6] as [number, number], backoffPercent: 15, backoffSets: slot.sets - 1, backoffReps: [6, 8] as [number, number], incrementKg: 2.5 } } : slot },
    { name: 'Command', weeks: [9, 10, 11], transform: (slot: SlotSpec) => slot.primary ? { ...slot, progression: { type: 'top-set-backoff' as const, topReps: [3, 5] as [number, number], backoffPercent: 15, backoffSets: Math.max(1, slot.sets - 1), backoffReps: [5, 7] as [number, number], incrementKg: 2.5 } } : slot },
    { name: 'Judgment', weeks: [12], transform: (slot: SlotSpec) => slot.primary ? { ...slot, sets: Math.min(slot.sets, 3), notes: 'Default: a confident single. AMRAP is opt-in only.', progression: { type: 'top-set-backoff' as const, topReps: [1, 3] as [number, number], backoffPercent: 15, backoffSets: Math.min(2, slot.sets - 1), backoffReps: [5, 7] as [number, number], incrementKg: 2.5 } } : { ...slot, sets: Math.max(1, slot.sets - 1) } },
];

const four = definePlan({ id: 'athena', name: 'Athena', weeks: 12, defaultTempo: '20X0', days: ATHENA_FOUR_DAY, phases });
const three = definePlan({ id: 'athena-3day-internal', name: 'Athena', weeks: 12, defaultTempo: '20X0', days: ATHENA_THREE_DAY, phases });

export const effectiveAthenaMode = (user: UserProfile, now = new Date().toISOString()): '3day' | '4day' => {
    const prefs = user.planPreferences?.athena;
    let mode: '3day' | '4day' = prefs?.scheduleMode === '3day' ? '3day' : '4day';
    const pending = prefs?.pendingScheduleChange;
    if (!pending) return mode;
    const start = user.programProgress?.athena?.startDate ?? user.startDate;
    const completedWeek = Math.floor((user.programProgress?.athena?.completedSessions ?? 0) / (mode === '3day' ? 3 : 4));
    if (calendarPlanWeek(start, now) > pending.requestedDuringWeek && completedWeek >= pending.requestedDuringWeek) mode = pending.mode === '3day' ? '3day' : '4day';
    return mode;
};

const replace = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const choices = user.planPreferences?.athena?.exerciseSelections ?? {};
    const map: Record<string, string | undefined> = {
        'barbell-squat': choices.squat, 'flat-barbell-bench-press': choices.bench,
        'romanian-deadlift': choices.hinge, 'standing-barbell-military-press': choices.verticalPress,
    };
    return { ...day, exercises: day.exercises.map(exercise => {
        const choice = exercise.exerciseId ? map[exercise.exerciseId] : undefined;
        const entry = choice ? EXERCISE_BY_ID[choice] : undefined;
        return entry ? { ...exercise, exerciseId: entry.id, name: entry.name.en } : exercise;
    }) };
};

const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const match = day.id?.match(/-w(\d+)-d(\d+)$/);
    if (!match) return replace(day, user);
    const selected = effectiveAthenaMode(user) === '4day' ? day : (three.program.weeks[Number(match[1]) - 1]?.days.find(candidate => candidate.dayOfWeek === Number(match[2])) ?? day);
    return replace(selected, user);
};

export const ATHENA_CONFIG: PlanConfig = { ...four, hooks: { ...four.hooks, preprocessDay: preprocess, calculateWeight: (target, user, exerciseName, context) => {
    const entry = Object.values(EXERCISE_BY_ID).find(item => item.name.en === exerciseName || item.name.pl === exerciseName);
    const saved = entry && user.athenaStatus?.exerciseLoads?.[entry.id];
    return saved ? String(saved) : four.hooks?.calculateWeight?.(target, user, exerciseName, context);
} }, ui: { themeClass: 'theme-athena', coverImage: '/athena.png', navImage: '/athena.png', dashboardWidgets: ['program_status', 'workout_history'] } };
