import { definePlan, type DaySpec, type SlotSpec, type ProgressionContext } from '../planBuilder';
import type { PlanConfig, UserProfile, WorkoutDay } from '../../types';
import { EXERCISE_BY_ID } from '../exercises/library';

const d = { type: 'double' as const, increment: 2.5 };
const s = (ex: string, sets: number, reps: string, block: SlotSpec['block'], pair?: string): SlotSpec => ({ ex, sets, reps, restSeconds: block?.kind === 'anchor' ? 180 : 60, progression: d, block, pair });
const a = (ex: string, sets = 3) => s(ex, sets, '4-6', { kind: 'anchor', id: 'anchor' });
const b = (ex: string, sets: number, reps: string, id: string, pair: string) => s(ex, sets, reps, { kind: 'burn', id }, pair);
/*
 * A finisher is one timed round, not a set count — `durationSeconds` is the
 * prescription and it grows from five minutes to eight across the phases. The
 * set-shape floor skips blocks for exactly this reason; running every finisher
 * twice added a third of a session to a plan that promises forty to fifty
 * minutes, and pushed its measured fatigue a band above what the card claims.
 *
 * The triceps, calf and core doses the review asked for come from burn slots
 * instead, which is where real sets belong.
 */
const f = (ex: string, reps: string, id: string, pair?: string): SlotSpec => ({ ...s(ex, 1, reps, { kind: 'finisher', id, durationSeconds: 300 }, pair), optional: true });

export const REDLINE_DAYS: DaySpec[] = [
    { name: 'PRESSURE', dayOfWeek: 1, slots: [
        a('leg-press'),
        b('incline-dumbbell-bench-press', 2, '6-10', 'pressure-a', 'A1'),
        b('single-arm-hammer-row', 2, '6-10', 'pressure-a', 'A2'),
        b('seated-hamstring-curl', 2, '8-12', 'pressure-b', 'B1'),
        b('cable-lateral-raise', 2, '12-15', 'pressure-b', 'B2'),
        b('rope-hammer-curl', 2, '8-15', 'pressure-c', 'C1'),
        b('overhead-tricep-extension', 2, '8-15', 'pressure-c', 'C2'),
        f('kettlebell-swing', '10-15', 'pressure-finisher'),
        f('farmer-carry', '20-30', 'pressure-finisher'),
    ] },
    { name: 'REDLINE', dayOfWeek: 2, slots: [
        a('lat-pulldown'),
        b('front-foot-elevated-bulgarian-split-squat', 2, '8-10', 'redline-a', 'A1'),
        b('deficit-push-up', 2, '6-10', 'redline-a', 'A2'),
        b('hip-supported-db-deadlift', 2, '8-10', 'redline-b', 'B1'),
        b('single-arm-reverse-pec-deck', 2, '12-15', 'redline-b', 'B2'),
        b('hack-calf-raise', 2, '12-20', 'redline-c', 'C1'),
        b('ab-wheel', 2, '8-15', 'redline-c', 'C2'),
        f('heel-elevated-goblet-squat', '8', 'redline-finisher', 'D1'),
        f('push-up', '6-10', 'redline-finisher', 'D2'),
        f('farmer-carry', '20-30', 'redline-finisher'),
    ] },
    { name: 'FURNACE', dayOfWeek: 4, slots: [
        a('paused-bench-press'),
        b('goblet-skater-squat', 2, '8-12', 'furnace-a', 'A1'),
        b('bench-supported-single-arm-cable-pulldown', 2, '6-10', 'furnace-a', 'A2'),
        b('leg-extension', 2, '10-15', 'furnace-b', 'B1'),
        b('lat-prayer', 2, '10-15', 'furnace-b', 'B2'),
        b('behind-the-back-cable-lateral-raise', 2, '12-20', 'furnace-c', 'C1'),
        b('bayesian-cable-curl', 2, '8-15', 'furnace-c', 'C2'),
        f('kettlebell-swing', '10', 'furnace-finisher'),
        f('deficit-reverse-lunge', '8', 'furnace-finisher', 'D1'),
        f('deficit-push-up', '6', 'furnace-finisher', 'D2'),
    ] },
    { name: 'AFTERBURN', dayOfWeek: 5, slots: [
        a('trap-bar-deadlift'),
        b('deficit-push-up', 2, '8-12', 'afterburn-a', 'A1'),
        b('hammer-pulldown', 2, '8-12', 'afterburn-a', 'A2'),
        b('deficit-reverse-lunge', 2, '8-12', 'afterburn-b', 'B1'),
        b('single-arm-hammer-row', 2, '8-12', 'afterburn-b', 'B2'),
        b('behind-the-back-cable-lateral-raise', 2, '12-20', 'afterburn-c', 'C1'),
        b('triangle-pushdown', 2, '8-15', 'afterburn-c', 'C2'),
        b('hack-calf-raise', 2, '12-20', 'afterburn-d', 'D1'),
        b('ab-wheel', 2, '8-15', 'afterburn-d', 'D2'),
        f('farmer-carry', '20-40', 'afterburn-finisher'),
    ] },
];

const duration = (week: number) => week <= 2 ? 300 : week <= 4 ? 360 : week === 5 ? 420 : week <= 7 ? 480 : 300;
const phases = [
    { name: 'Ignition', weeks: [1, 2], transform: (slot: SlotSpec, ctx: ProgressionContext) => slot.block?.kind === 'finisher' ? { ...slot, block: { ...slot.block, durationSeconds: duration(ctx.week) } } : slot },
    { name: 'Burn', weeks: [3, 4, 5], transform: (slot: SlotSpec, ctx: ProgressionContext) => slot.block?.kind === 'finisher' ? { ...slot, block: { ...slot.block, durationSeconds: duration(ctx.week) } } : slot },
    { name: 'Redline', weeks: [6, 7], transform: (slot: SlotSpec, ctx: ProgressionContext) => slot.block?.kind === 'finisher' ? { ...slot, block: { ...slot.block, durationSeconds: duration(ctx.week) } } : slot },
    { name: 'Ashes', weeks: [8], transform: (slot: SlotSpec) =>
        slot.block?.kind === 'burn' ? { ...slot, sets: Math.max(1, Math.round(slot.sets * .65)) }
            : slot.block?.kind === 'finisher' ? { ...slot, block: { ...slot.block, durationSeconds: 300 } } : slot },
];
const base = definePlan({ id: 'redline', name: 'REDLINE', weeks: 8, defaultTempo: '20X0', days: REDLINE_DAYS, phases });
const preprocess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    let result = day;
    if (day.dayOfWeek === 4) {
        const id = user.planPreferences?.redline?.exerciseSelections?.furnaceAnchor ?? 'paused-bench-press';
        const entry = EXERCISE_BY_ID[id];
        if (entry) result = { ...result, exercises: result.exercises.map((e, i) => i === 0 ? { ...e, exerciseId: id, name: entry.name.en } : e) };
    }
    const recovery = user.redlineStatus?.nextRecovery;
    const furnace = day.dayOfWeek === 4;
    if (furnace && recovery?.response !== 'recovered') {
        result = { ...result, exercises: result.exercises.map(e => e.prescription?.block?.kind === 'finisher' && e.prescription.block.durationSeconds
            ? { ...e, prescription: { ...e.prescription, block: { ...e.prescription.block, durationSeconds: Math.min(e.prescription.block.durationSeconds, 360) } } }
            : e) };
    }
    if (!recovery?.confirmed) return result;
    if (recovery.response === 'recovered') return result;
    const multiplier = recovery.response === 'somewhat-fatigued' ? 0.85 : 0.7;
    const burn = result.exercises.filter(e => e.prescription?.block?.kind === 'burn');
    const current = burn.reduce((n, e) => n + e.sets, 0);
    let remove = current - Math.round(current * multiplier);
    return { ...result, exercises: result.exercises.flatMap(e => {
        if (recovery.response === 'performance-impaired' && e.prescription?.block?.kind === 'finisher') return [];
        if (e.prescription?.block?.kind !== 'burn' || remove <= 0) return [e];
        const cut = Math.min(remove, Math.max(0, e.sets - 1));
        remove -= cut;
        return [{ ...e, sets: e.sets - cut }];
    }) };
};
export const REDLINE_CONFIG: PlanConfig = { ...base, hooks: { ...base.hooks, preprocessDay: preprocess }, ui: { themeClass: 'theme-redline', coverImage: '/redline.png', navImage: '/redline.png', dashboardWidgets: ['program_status', 'workout_history'] } };
