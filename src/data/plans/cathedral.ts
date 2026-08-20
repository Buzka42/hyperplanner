/**
 * CATHEDRAL — 10 weeks of chest specialisation on four days.
 *
 * Chest is trained three times, and each exposure serves the Three Arches:
 * Press (Incline DB Press), Stretch (dips below parallel and cable flyes) and
 * Adduction (Pec Deck / Crossover). There is no barbell bench anywhere in the
 * plan; Smith incline is the approved alternative for anyone who wants a bar.
 *
 * Balance and limiting-fatigue logic live in `src/features/cathedral/arches.ts`.
 */

import { definePlan, type DaySpec, type SlotSpec } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { COMBO_MACHINE, adjustForLimitingFatigue, archOf } from '../../features/cathedral/arches';
import { EXERCISE_BY_ID } from '../exercises/library';

const double = { type: 'double' as const, increment: 2.5 };
const s = (ex: string, sets: number, reps = '8-12', options: Partial<SlotSpec> = {}): SlotSpec =>
    ({ ex, sets, reps, restSeconds: options.systemicCompound ? 150 : 90, progression: double, ...options });

export const CATHEDRAL_DAYS: DaySpec[] = [
    // Chest exposure 1 — heavy press leads.
    { name: 'Nave — Press', dayOfWeek: 1, slots: [
        s('incline-dumbbell-bench-press', 4, '6-10', { systemicCompound: true, primary: true }),
        s('dip', 3, '8-12'),
        s('low-to-high-cable-fly', 2, '12-15'),
        s('pec-deck', 2, '12-15', { technique: { kind: 'last-set-failure' } }),
        s('single-arm-hammer-row', 3, '8-12', { unilateral: true }),
        s('lying-cable-lat-raise', 2, '12-15', { technique: { kind: 'last-set-failure' } }),
        s('french-press', 2, '10-15'),
    ] },
    // Lower day: the chest gets a day off so the next exposure is not a
    // fatigue test of the triceps.
    { name: 'Crypt — Lower', dayOfWeek: 2, slots: [
        // Legs are maintenance here — the chest specialisation is what the
        // systemic budget is for, so this runs at a cheaper rep range.
        s('leg-press', 3, '10-15', { systemicCompound: true }),
        s('romanian-deadlift', 3, '8-12'),
        s('seated-hamstring-curl', 3, '10-15'),
        s('supported-sissy-squat', 2, '12-15'),
        s('hack-calf-raise', 2, '12-20'),
        s('cable-crunch', 2, '8-12'),
    ] },
    // Chest exposure 2 — stretch leads.
    { name: 'Transept — Stretch', dayOfWeek: 4, slots: [
        s('mid-cable-fly', 2, '10-15', { technique: { kind: 'partials', extraReps: '6', range: 'bottom', applyTo: 'last' } }),
        s('30-smith-incline-bench-press', 4, '8-12'),
        s('cable-crossover', 2, '12-20', { technique: { kind: 'last-set-failure' } }),
        s('hammer-pulldown', 3, '8-12'),
        s('side-lying-rear-delt-fly', 2, '12-15', { unilateral: true }),
        s('ezbar-preacher-curl', 2, '8-12'),
    ] },
    // Chest exposure 3 — adduction leads; the lightest of the three on the
    // shoulder, so it can follow the other two without stacking front-delt cost.
    { name: 'Spire — Adduction', dayOfWeek: 5, slots: [
        s('pec-deck', 2, '12-20', { technique: { kind: 'last-set-failure' } }),
        s('flat-dumbbell-press', 3, '8-12'),
        s('dip', 2, '8-12'),
        s('cable-fly', 2, '12-15'),
        s('lat-pulldown', 3, '8-12'),
        s('seated-hammer-shoulder-press', 2, '8-12'),
        s('hack-calf-raise', 2, '12-20'),
        s('cable-triceps-extension', 2, '10-15'),
        s('ezbar-preacher-curl', 2, '10-15'),
    ] },
];

const FLY = new Set(['low-to-high-cable-fly', 'mid-cable-fly', 'cable-fly']);
const flyFinish = { kind: 'drop-set' as const, drops: 1, dropPercent: 20, applyTo: 'last' as const };

const phases = [
    { name: 'Foundation', weeks: [1, 2, 3] },
    { name: 'Vaulting', weeks: [4, 5, 6, 7], transform: (slot: SlotSpec): SlotSpec =>
        archOf(slot.ex) === 'adduction'
            ? { ...slot, technique: { kind: 'myo-reps', miniSets: 3, miniReps: '4-5', restBreaths: 5 } }
            : FLY.has(slot.ex) ? { ...slot, technique: flyFinish } : slot },
    { name: 'Consecration', weeks: [8, 9], transform: (slot: SlotSpec): SlotSpec =>
        archOf(slot.ex) === 'press'
            ? { ...slot, reps: '5-8' }
            : FLY.has(slot.ex) ? { ...slot, technique: flyFinish } : slot },
    { name: 'Rest of the Stone', weeks: [10], transform: (slot: SlotSpec): SlotSpec => ({ ...slot, sets: Math.max(1, slot.sets - 1) }) },
];

const base = definePlan({ id: 'cathedral', name: 'Cathedral', weeks: 10, defaultTempo: '20X0', days: CATHEDRAL_DAYS, phases });

const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const week = Number(day.id?.match(/-w(\d+)-/)?.[1] ?? 1);
    const choices = user.planPreferences?.cathedral?.exerciseSelections ?? {};
    const adjustment = adjustForLimitingFatigue(user.cathedralStatus, week);
    // A shift only happens once the athlete has confirmed it; the offer itself
    // never changes the session.
    const confirmed = adjustment.shiftSets > 0 && choices.acceptedArchShift === 'yes';

    let pressToShift = confirmed ? adjustment.shiftSets : 0;

    const withCombo = day.exercises.map(exercise => {
        // The combo machine substitutes into whichever arch the athlete
        // assigned it, and nowhere else.
        const comboRole = user.cathedralStatus?.comboMachineRole;
        if (!comboRole || choices.useComboMachine !== 'yes') return exercise;
        if (!exercise.exerciseId || archOf(exercise.exerciseId) !== comboRole) return exercise;
        const entry = EXERCISE_BY_ID[COMBO_MACHINE];
        return entry ? { ...exercise, exerciseId: entry.id, name: entry.name.en } : exercise;
    });

    if (!pressToShift) return { ...day, exercises: withCombo };

    // Sets move between arches; they are not deleted. Pressing gives up what
    // adduction takes on, so the chest keeps its weekly volume while the
    // triceps and front delt get the relief the feedback asked for.
    const removed: number[] = [];
    const reduced = withCombo.map(exercise => {
        if (pressToShift <= 0 || !exercise.exerciseId || archOf(exercise.exerciseId, user.cathedralStatus?.comboMachineRole) !== 'press' || exercise.sets <= 1) return exercise;
        const moved = Math.min(pressToShift, exercise.sets - 1);
        pressToShift -= moved;
        removed.push(moved);
        return { ...exercise, sets: exercise.sets - moved, notes: exercise.notes ?? adjustment.message };
    });

    let toAdd = removed.reduce((n, value) => n + value, 0);
    const adductionSlots = reduced.filter(e => e.exerciseId && archOf(e.exerciseId, user.cathedralStatus?.comboMachineRole) === 'adduction').length;
    if (!adductionSlots) return { ...day, exercises: reduced };

    return { ...day, exercises: reduced.map(exercise => {
        if (toAdd <= 0 || !exercise.exerciseId || archOf(exercise.exerciseId, user.cathedralStatus?.comboMachineRole) !== 'adduction') return exercise;
        const added = Math.ceil(toAdd / adductionSlots);
        toAdd -= added;
        return { ...exercise, sets: exercise.sets + added, notes: exercise.notes ?? adjustment.message };
    }) };
};

export const CATHEDRAL_CONFIG: PlanConfig = {
    ...base,
    hooks: { ...base.hooks, preprocessDay: preprocess },
    ui: { themeClass: 'theme-cathedral', coverImage: '/cathedral.png', navImage: '/cathedral.png', dashboardWidgets: ['program_status', 'workout_history'] },
};
