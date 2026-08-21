/**
 * IRON CLOCK — 8 weeks of density work.
 *
 * Each session is one straight-set anchor followed by timed blocks. The anchor
 * exists so the plan still trains something heavy; everything after it is
 * measured against the clock, and the ladder in
 * `src/features/ironClock/progression.ts` decides what "better" means.
 *
 * Blocks are curated pairs, not antagonist pairs on principle: the rule is that
 * the two movements can actually be alternated in one corner of a gym without
 * walking anywhere.
 */

import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { calendarPlanWeek } from '../../features/planLifecycle';


const double = { type: 'double' as const, increment: 2.5 };

/** Anchor: straight sets, full rest, load progression. */
const anchor = (ex: string, sets = 3, reps = '5-8'): SlotSpec =>
    ({ ex, sets, reps, restSeconds: 180, progression: double, primary: true, systemicCompound: true, block: { kind: 'anchor', id: 'anchor' } });

/**
 * A density slot. `sets` is the round target the block opens at; the athlete
 * beats it by rounds first, then by compressing `durationSeconds`.
 */
const block = (ex: string, id: string, pair: string, rounds: number, reps: string, durationSeconds: number): SlotSpec =>
    ({ ex, sets: rounds, reps, restSeconds: 0, progression: double, pair, block: { kind: 'density', id, durationSeconds } });

/** Base windows. The ladder compresses each to two thirds before adding load. */
export const IRON_CLOCK_WINDOWS = { a: 600, b: 480, c: 360 } as const;
export const IRON_CLOCK_MIN_WINDOWS = { a: 420, b: 300, c: 240 } as const;
export const IRON_CLOCK_MAX_ROUNDS = 6;

export const IRON_CLOCK_FOUR_DAY: DaySpec[] = [
    { name: 'First Bell', dayOfWeek: 1, slots: [
        anchor('hack-squat', 3, '5-8'),
        block('incline-dumbbell-bench-press', 'bell-1-a', 'A1', 4, '8-10', IRON_CLOCK_WINDOWS.a),
        block('single-arm-hammer-row', 'bell-1-a', 'A2', 4, '8-10', IRON_CLOCK_WINDOWS.a),
        block('seated-hamstring-curl', 'bell-1-b', 'B1', 4, '10-12', IRON_CLOCK_WINDOWS.b),
        block('lateral-raise', 'bell-1-b', 'B2', 4, '12-15', IRON_CLOCK_WINDOWS.b),
        block('kettlebell-swing', 'bell-1-c', 'C1', 4, '12-15', IRON_CLOCK_WINDOWS.c),
        block('ab-wheel', 'bell-1-c', 'C2', 4, '8-12', IRON_CLOCK_WINDOWS.c),
    ] },
    { name: 'Second Bell', dayOfWeek: 2, slots: [
        anchor('lat-pulldown', 3, '6-8'),
        block('front-foot-elevated-bulgarian-split-squat', 'bell-2-a', 'A1', 4, '8-10', IRON_CLOCK_WINDOWS.a),
        block('hammer-chest-press', 'bell-2-a', 'A2', 4, '8-10', IRON_CLOCK_WINDOWS.a),
        block('hip-supported-db-deadlift', 'bell-2-b', 'B1', 4, '8-12', IRON_CLOCK_WINDOWS.b),
        block('single-arm-reverse-pec-deck', 'bell-2-b', 'B2', 4, '12-15', IRON_CLOCK_WINDOWS.b),
        block('hack-calf-raise', 'bell-2-c', 'C1', 4, '12-20', IRON_CLOCK_WINDOWS.c),
        block('hammer-curl', 'bell-2-c', 'C2', 4, '8-15', IRON_CLOCK_WINDOWS.c),
    ] },
    { name: 'Third Bell', dayOfWeek: 4, slots: [
        anchor('paused-bench-press', 3, '4-6'),
        block('goblet-skater-squat', 'bell-3-a', 'A1', 4, '8-12', IRON_CLOCK_WINDOWS.a),
        block('hammer-pulldown', 'bell-3-a', 'A2', 4, '8-10', IRON_CLOCK_WINDOWS.a),
        block('leg-extension', 'bell-3-b', 'B1', 4, '10-15', IRON_CLOCK_WINDOWS.b),
        block('lat-prayer', 'bell-3-b', 'B2', 4, '10-15', IRON_CLOCK_WINDOWS.b),
        block('hammer-curl', 'bell-3-c', 'C1', 4, '8-15', IRON_CLOCK_WINDOWS.c),
        block('cable-ezbar-pressdown', 'bell-3-c', 'C2', 4, '8-15', IRON_CLOCK_WINDOWS.c),
    ] },
    { name: 'Final Bell', dayOfWeek: 5, slots: [
        anchor('romanian-deadlift', 3, '5-8'),
        block('hammer-chest-press', 'bell-4-a', 'A1', 4, '8-12', IRON_CLOCK_WINDOWS.a),
        block('single-arm-hammer-row', 'bell-4-a', 'A2', 4, '8-12', IRON_CLOCK_WINDOWS.a),
        block('deficit-reverse-lunge', 'bell-4-b', 'B1', 4, '8-12', IRON_CLOCK_WINDOWS.b),
        block('lateral-raise', 'bell-4-b', 'B2', 4, '12-20', IRON_CLOCK_WINDOWS.b),
        block('hack-calf-raise', 'bell-4-c', 'C1', 4, '12-20', IRON_CLOCK_WINDOWS.c),
        block('rolling-dumbbell-tricep-extension', 'bell-4-c', 'C2', 4, '10-15', IRON_CLOCK_WINDOWS.c),
    ] },
];

/**
 * Three-day full body. Block count rises rather than block length, because the
 * limiting factor on a three-day week is exposure, not session duration.
 */
export const IRON_CLOCK_THREE_DAY: DaySpec[] = [
    { name: 'Iron Clock I', dayOfWeek: 1, slots: [
        anchor('hack-squat', 3, '5-8'),
        block('incline-dumbbell-bench-press', 'clock-1-a', 'A1', 4, '8-10', IRON_CLOCK_WINDOWS.a),
        block('single-arm-hammer-row', 'clock-1-a', 'A2', 4, '8-10', IRON_CLOCK_WINDOWS.a),
        block('seated-hamstring-curl', 'clock-1-b', 'B1', 4, '10-12', IRON_CLOCK_WINDOWS.b),
        block('lateral-raise', 'clock-1-b', 'B2', 4, '12-15', IRON_CLOCK_WINDOWS.b),
        block('kettlebell-swing', 'clock-1-c', 'C1', 4, '12-15', IRON_CLOCK_WINDOWS.c),
        block('ab-wheel', 'clock-1-c', 'C2', 4, '8-12', IRON_CLOCK_WINDOWS.c),
    ] },
    { name: 'Iron Clock II', dayOfWeek: 3, slots: [
        anchor('paused-bench-press', 3, '4-6'),
        block('front-foot-elevated-bulgarian-split-squat', 'clock-2-a', 'A1', 4, '8-10', IRON_CLOCK_WINDOWS.a),
        block('hammer-pulldown', 'clock-2-a', 'A2', 4, '8-10', IRON_CLOCK_WINDOWS.a),
        block('hip-supported-db-deadlift', 'clock-2-b', 'B1', 4, '8-12', IRON_CLOCK_WINDOWS.b),
        block('single-arm-reverse-pec-deck', 'clock-2-b', 'B2', 4, '12-15', IRON_CLOCK_WINDOWS.b),
        block('hack-calf-raise', 'clock-2-c', 'C1', 4, '12-20', IRON_CLOCK_WINDOWS.c),
        block('hanging-knee-raise', 'clock-2-c', 'C2', 4, '8-12', IRON_CLOCK_WINDOWS.c),
    ] },
    { name: 'Iron Clock III', dayOfWeek: 5, slots: [
        anchor('romanian-deadlift', 3, '5-8'),
        block('hammer-chest-press', 'clock-3-a', 'A1', 4, '8-12', IRON_CLOCK_WINDOWS.a),
        block('lat-pulldown', 'clock-3-a', 'A2', 4, '8-10', IRON_CLOCK_WINDOWS.a),
        block('leg-extension', 'clock-3-b', 'B1', 4, '10-15', IRON_CLOCK_WINDOWS.b),
        block('lat-prayer', 'clock-3-b', 'B2', 4, '10-15', IRON_CLOCK_WINDOWS.b),
        block('hammer-curl', 'clock-3-c', 'C1', 4, '8-15', IRON_CLOCK_WINDOWS.c),
        block('rolling-dumbbell-tricep-extension', 'clock-3-c', 'C2', 4, '8-15', IRON_CLOCK_WINDOWS.c),
    ] },
];

/**
 * Phases move the *default* window, not the ladder. An athlete whose blocks
 * have already compressed keeps their own state; these are the opening
 * prescriptions for someone with no history in that block.
 */
const phases = [
    { name: 'Winding', weeks: [1, 2] },
    { name: 'Tension', weeks: [3, 4, 5], transform: (slot: SlotSpec): SlotSpec =>
        slot.block?.kind === 'density' ? { ...slot, sets: slot.sets + 1 } : slot },
    { name: 'Escapement', weeks: [6, 7], transform: (slot: SlotSpec): SlotSpec =>
        slot.block?.kind === 'density'
            ? { ...slot, sets: slot.sets + 1, block: { ...slot.block, durationSeconds: Math.round((slot.block.durationSeconds ?? 480) * 5 / 6) } }
            : slot },
    // Week 8 is a benchmark, not a peak: the opening windows return so the
    // final numbers are comparable to week 1 rather than to a compressed week 7.
    { name: 'Benchmark', weeks: [8] },
];

const four = definePlan({ id: 'iron-clock', name: 'Iron Clock', weeks: 8, defaultTempo: '20X0', days: IRON_CLOCK_FOUR_DAY, phases });
const three = definePlan({ id: 'iron-clock-3day-internal', name: 'Iron Clock', weeks: 8, defaultTempo: '20X0', days: IRON_CLOCK_THREE_DAY, phases });

export const effectiveIronClockMode = (user: UserProfile, now = new Date().toISOString()): '3day' | '4day' => {
    const prefs = user.planPreferences?.['iron-clock'];
    let mode: '3day' | '4day' = prefs?.scheduleMode === '3day' ? '3day' : '4day';
    const pending = prefs?.pendingScheduleChange;
    if (!pending) return mode;
    // A schedule change takes effect only once the requested week is both
    // finished on the calendar and finished in sessions.
    const start = user.programProgress?.['iron-clock']?.startDate ?? user.startDate;
    const completedWeek = Math.floor((user.programProgress?.['iron-clock']?.completedSessions ?? 0) / (mode === '3day' ? 3 : 4));
    if (calendarPlanWeek(start, now) > pending.requestedDuringWeek && completedWeek >= pending.requestedDuringWeek) {
        mode = pending.mode === '3day' ? '3day' : '4day';
    }
    return mode;
};

/** Applies the athlete's own ladder state over the authored prescription. */
const applyLadder = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const stage = user.ironClockStatus?.stage;
    if (!stage) return day;
    return { ...day, exercises: day.exercises.map(exercise => {
        const blockSpec = exercise.prescription?.block;
        if (blockSpec?.kind !== 'density') return exercise;
        const state = stage[blockSpec.id];
        if (!state) return exercise;
        return { ...exercise, notes: exercise.notes ?? `Ladder: ${state.step} since week ${state.sinceWeek}` };
    }) };
};

const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const match = day.id?.match(/-w(\d+)-d(\d+)$/);
    if (!match) return applyLadder(day, user);
    if (effectiveIronClockMode(user) === '4day') return applyLadder(day, user);

    const dayOfWeek = Number(match[2]);
    const replacement = three.program.weeks[Number(match[1]) - 1]?.days.find(candidate => candidate.dayOfWeek === dayOfWeek);
    // Days the three-day week does not train become rest days rather than
    // falling through to the four-day session, which would quietly hand a
    // three-day athlete a fourth session.
    if (!replacement) return { ...day, dayName: 'Rest', exercises: [] };
    return applyLadder(replacement, user);
};

export const IRON_CLOCK_CONFIG: PlanConfig = {
    ...four,
    hooks: { ...four.hooks, preprocessDay: preprocess },
    ui: { themeClass: 'theme-iron-clock', coverImage: '/ironclock.png', navImage: '/ironclock.png', dashboardWidgets: ['program_status', 'workout_history'] },
};
