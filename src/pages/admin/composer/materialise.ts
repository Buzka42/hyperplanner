/**
 * Turning a plan into something the composer can edit.
 *
 * Plans generate their days in code, so the only truthful way to show an owner
 * what a session contains is to run the plan's own generator and then push the
 * result through `resolveDay` — the same function the athlete's workout view
 * uses. That means the composer previews the athlete's session exactly, pending
 * edits included, rather than approximating it.
 *
 * Two materialisations, because they answer different questions:
 *
 *   - `materialiseSessions` runs one representative athlete, so a session is a
 *     real session with a real running order — which is what you need to
 *     reorder it or count its sets.
 *   - `materialiseMovements` unions every preview state, so plans that rotate a
 *     queue (Super Mutant, Trinary, Skeleton) expose their whole exercise pool
 *     rather than whichever slice one state happens to produce.
 */

import { PLAN_REGISTRY } from '../../../data/plans';
import { slotKey } from '../../../data/exercises/types';
import type { PlanExerciseDoc, ResolvedExercise } from '../../../data/exercises/types';
import type { ExerciseResolver } from '../../../data/exercises';
import { resolveDay } from '../../../lib/planResolution';
import { computeSessionStats, type SessionStats } from '../../../lib/sessionStats';
import type { Exercise, UserProfile, WorkoutDay } from '../../../types';
import { buildPreviewUser, buildPreviewVariants } from '../previewUser';

/** Rest/mobility entries occupy an exercise slot but are not movements. */
export const isPlaceholder = (name: string) =>
    /^(rest|rest\s*\/\s*mobility|rest day|mobility|active recovery)$/i.test(name.trim());

/** One editable position in a session. */
export type ComposerSlot = {
    /**
     * The generated index. This is the stable address — it keys the slot
     * override and stamps the athlete's logged `slot`, so it never changes when
     * a session is reordered.
     */
    index: number;
    slot: string;
    exerciseId: string;
    name: string;
    unmapped: boolean;
    /** What the plan generated, before any override. */
    source: Exercise;
    /** What the athlete will actually see. Absent when the movement is disabled. */
    resolved?: ResolvedExercise;
};

export type ComposerDay = {
    key: string;
    week: number;
    dayOfWeek: number;
    dayName: string;
    /** In the running order the athlete sees, after any admin reordering. */
    slots: ComposerSlot[];
    /** Movements switched off by an override, kept visible so they can be switched back on. */
    disabled: ComposerSlot[];
    stats: SessionStats;
};

/**
 * Whether this plan addresses its exercises by a stable slot.
 *
 * Super Mutant and friends return whichever session is next for the athlete
 * rather than the day they were handed, so `w3d2#1` names a different movement
 * for every athlete. Slot-scoped edits — reordering above all — would land on
 * whatever happened to be in that position, so the composer offers only
 * movement-scoped edits for these plans and says why.
 */
export const hasStableSlots = (planId: string): boolean => {
    const config = PLAN_REGISTRY[planId];
    const week = config?.program.weeks[0];
    if (!week || week.days.length < 2) return true;

    const user = buildPreviewUser(planId);
    const signatures = week.days
        .map(day => {
            try {
                const generated = config?.hooks?.preprocessDay?.(day, user) ?? day;
                return (generated.exercises ?? []).map(e => e.name).join('|');
            } catch {
                return '';
            }
        })
        .filter(Boolean);

    // Every weekday producing the identical session is the signature of a
    // generator that ignores the calendar.
    return !(signatures.length > 1 && new Set(signatures).size === 1);
};

const generate = (planId: string, day: WorkoutDay, user: UserProfile): WorkoutDay => {
    try {
        return PLAN_REGISTRY[planId]?.hooks?.preprocessDay?.(day, user) ?? day;
    } catch {
        return day;   // a state this generator cannot reach
    }
};

/**
 * Every session of the plan for one representative athlete, resolved against
 * the config currently being edited.
 */
export const materialiseSessions = (
    planId: string,
    doc: PlanExerciseDoc,
    resolver: ExerciseResolver
): ComposerDay[] => {
    const config = PLAN_REGISTRY[planId];
    if (!config) return [];

    const user = buildPreviewUser(planId);
    const days: ComposerDay[] = [];

    for (const week of config.program.weeks) {
        for (const day of week.days) {
            const generated = generate(planId, { ...day, weekNumber: week.weekNumber }, user);
            const source = (generated.exercises ?? []).filter(e => !isPlaceholder(e.name));
            if (!source.length) continue;

            const resolvedDay = resolveDay(generated, {
                planId,
                user,
                resolver,
                planConfig: doc,
                lang: 'en',
                week: week.weekNumber,
            });

            const byIndex = new Map<number, ComposerSlot>();
            (generated.exercises ?? []).forEach((exercise, index) => {
                if (isPlaceholder(exercise.name)) return;
                const entry = resolver.resolve(exercise.name);
                byIndex.set(index, {
                    index,
                    slot: slotKey(week.weekNumber, generated.dayOfWeek, index),
                    exerciseId: entry?.id ?? `unmapped:${exercise.name}`,
                    name: entry?.name.en ?? exercise.name,
                    unmapped: !entry,
                    source: exercise,
                });
            });

            // `resolveDay` has already applied the running order and dropped
            // anything disabled, so its output *is* the session — walking it
            // gives the composer the athlete's view for free.
            const slots: ComposerSlot[] = [];
            for (const resolved of resolvedDay?.exercises ?? []) {
                const index = Number(resolved.slot?.split('#')[1] ?? -1);
                const base = byIndex.get(index);
                if (!base) continue;
                slots.push({ ...base, resolved });
                byIndex.delete(index);
            }

            const stats = computeSessionStats({
                exercises: slots.map(s => s.resolved as Exercise).filter(Boolean),
                lookup: exercise => resolver.resolve(exercise.name),
                restFor: exercise => (exercise as ResolvedExercise).restSeconds,
                tempoFor: exercise => (exercise as ResolvedExercise).tempo,
                stats: user.stats as unknown as Record<string, number>,
            });

            days.push({
                key: `w${week.weekNumber}d${generated.dayOfWeek}`,
                week: week.weekNumber,
                dayOfWeek: generated.dayOfWeek,
                dayName: generated.dayName,
                slots,
                disabled: [...byIndex.values()],
                stats,
            });
        }
    }
    return days;
};

export type ComposerMovement = {
    id: string;
    name: string;
    unmapped: boolean;
    weeks: number[];
    /** Distinct prescriptions this movement carries across the plan. */
    prescriptions: string[];
    /** How many session slots it occupies, i.e. how much an edit here reaches. */
    appearances: number;
};

/** Every movement the plan can produce, across every preview state. */
export const materialiseMovements = (
    planId: string,
    resolver: ExerciseResolver
): ComposerMovement[] => {
    const config = PLAN_REGISTRY[planId];
    if (!config) return [];

    const previewUsers = buildPreviewVariants(planId);
    const map = new Map<string, {
        name: string; unmapped: boolean; weeks: Set<number>; prescriptions: Set<string>; appearances: number;
    }>();
    const seen = new Set<string>();

    for (const week of config.program.weeks) {
        for (const day of week.days) {
            for (const user of previewUsers) {
                const generated = generate(planId, { ...day, weekNumber: week.weekNumber }, user);
                if (!generated.exercises?.length) continue;

                const signature = `${week.weekNumber}:${generated.dayOfWeek}:${generated.exercises.map(e => e.name).join('|')}`;
                if (seen.has(signature)) continue;
                seen.add(signature);

                for (const exercise of generated.exercises) {
                    // Giant-set containers and rest placeholders occupy a slot
                    // without being movements; listing them is just noise.
                    if (exercise.giantSetConfig?.steps?.length || isPlaceholder(exercise.name)) continue;

                    const entry = resolver.resolve(exercise.name);
                    const id = entry?.id ?? `unmapped:${exercise.name}`;
                    const existing = map.get(id) ?? {
                        name: entry?.name.en ?? exercise.name,
                        unmapped: !entry,
                        weeks: new Set<number>(),
                        prescriptions: new Set<string>(),
                        appearances: 0,
                    };
                    existing.weeks.add(week.weekNumber);
                    existing.prescriptions.add(`${exercise.sets}x${exercise.target?.reps ?? '?'}`);
                    existing.appearances += 1;
                    map.set(id, existing);
                }
            }
        }
    }

    return [...map.entries()]
        .map(([id, v]) => ({
            id,
            name: v.name,
            unmapped: v.unmapped,
            appearances: v.appearances,
            weeks: [...v.weeks].sort((a, b) => a - b),
            prescriptions: [...v.prescriptions],
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
};
