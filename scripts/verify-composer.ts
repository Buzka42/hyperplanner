/**
 * verify:composer
 *
 * The admin composer gained three things that reach the athlete: an explicit
 * running order, per-session statistics, and movements that can be switched
 * off. Each of those is a claim about what `resolveDay` produces, so each is
 * pinned here rather than trusted.
 *
 * The ordering assertions matter most. A running order is stored per slot, and
 * a slot key is also the address the athlete's logged sets join on — so if
 * reordering ever renumbered slots, history would silently stop matching. That
 * is the kind of defect nobody notices until a progression stalls.
 */

import assert from 'node:assert/strict';

import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_IDS } from '../src/data/planMeta';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { createResolver } from '../src/data/exercises';
import { slotKey } from '../src/data/exercises/types';
import type { PlanExerciseDoc } from '../src/data/exercises/types';
import { resolveDay } from '../src/lib/planResolution';
import { computeSessionStats, estimateReps, formatDuration, formatTonnage } from '../src/lib/sessionStats';
import type { Exercise, UserProfile, WorkoutDay } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

const resolver = createResolver(EXERCISE_LIBRARY);

const doc = (overrides: Partial<PlanExerciseDoc> = {}): PlanExerciseDoc => ({
    planId: 'test', version: 1, updatedAt: '', updatedBy: '',
    exercises: {}, slots: {}, groups: {}, defaults: {}, ...overrides,
});

const exercise = (name: string, sets = 3, reps = '8'): Exercise => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    sets,
    target: { type: 'straight', reps },
});

const day = (names: string[]): WorkoutDay => ({
    dayName: 'Test day',
    dayOfWeek: 1,
    exercises: names.map(n => exercise(n)),
});

const ctx = (planConfig: PlanExerciseDoc) => ({
    planId: 'test',
    user: null,
    resolver,
    planConfig,
    lang: 'en' as const,
    week: 1,
});

// Three real library movements with distinct patterns.
const A = 'Flat Barbell Bench Press';
const B = 'Barbell Row';
const C = 'Push-Up';

// --- rep estimation ------------------------------------------------------------
ok(estimateReps('8') === 8, 'a plain figure is itself');
ok(estimateReps('6-8') === 7, 'a range collapses to its midpoint');
ok(estimateReps('6–8') === 7, 'an en-dash range parses too — the plans use both');
ok(estimateReps('AMRAP') === 10, 'AMRAP is counted at a nominal ten');
ok(estimateReps('Failure') === 10, 'so is a set to failure');
ok(estimateReps('8+') === 10, 'an open-ended bottom assumes a couple over');
ok(estimateReps(undefined) === 0, 'an absent prescription contributes nothing');
ok(estimateReps('') === 0, 'and so does an empty one');
ok(estimateReps('Giant') === 0, 'a non-numeric label is not invented into reps');

// --- formatting ------------------------------------------------------------------
ok(formatDuration(0) === '—', 'a zero duration reads as nothing, not "0m"');
ok(formatDuration(3840) === '1h 04m', 'over an hour is split, and zero-padded');
ok(formatDuration(1800) === '30m', 'under an hour stays in minutes');
ok(formatTonnage(840) === '840 kg', 'kilos below a tonne');
ok(formatTonnage(12400) === '12.4 t', 'and tonnes above one');
ok(formatTonnage(0) === '—', 'no determinable load reads as nothing, not zero');

// --- running order ---------------------------------------------------------------
{
    const source = day([A, B, C]);

    const untouched = resolveDay(source, ctx(doc()));
    ok(
        untouched?.exercises.map(e => e.name).join() === `${A},${B},${C}`,
        'with no order set, the session comes out exactly as the plan generated it'
    );

    // Move the third movement to the front, leaving the others alone.
    const moved = resolveDay(source, ctx(doc({
        slots: { [slotKey(1, 1, 2)]: { order: -1 } },
    })));
    ok(
        moved?.exercises.map(e => e.name).join() === `${C},${A},${B}`,
        'an order on one movement moves that movement and nothing else'
    );

    // The whole day given explicit positions, as the composer writes it.
    const reversed = resolveDay(source, ctx(doc({
        slots: {
            [slotKey(1, 1, 0)]: { order: 2 },
            [slotKey(1, 1, 1)]: { order: 1 },
            [slotKey(1, 1, 2)]: { order: 0 },
        },
    })));
    ok(
        reversed?.exercises.map(e => e.name).join() === `${C},${B},${A}`,
        'a full ordering is honoured end to end'
    );

    // The load-bearing guarantee: a slot key addresses the generated position,
    // so reordering must not renumber it.
    ok(
        reversed?.exercises.map(e => e.slot).join() === `${slotKey(1, 1, 2)},${slotKey(1, 1, 1)},${slotKey(1, 1, 0)}`,
        'reordering moves movements without renumbering their slots'
    );
    ok(
        new Set(reversed?.exercises.map(e => e.slot)).size === 3,
        'and every slot in the session stays distinct'
    );

    // Equal keys must not shuffle: two movements told to sit at 0 keep their
    // generated order relative to each other.
    const tied = resolveDay(source, ctx(doc({
        slots: { [slotKey(1, 1, 0)]: { order: 0 }, [slotKey(1, 1, 1)]: { order: 0 } },
    })));
    ok(
        tied?.exercises.map(e => e.name).join() === `${A},${B},${C}`,
        'a tied order falls back to the generated order rather than shuffling'
    );
}

// --- removal ---------------------------------------------------------------------
{
    const source = day([A, B, C]);

    const withoutB = resolveDay(source, ctx(doc({
        exercises: { [resolver.resolveId(B)]: { enabled: false } },
    })));
    ok(withoutB?.exercises.length === 2, 'a disabled movement is dropped from the session');
    ok(!withoutB?.exercises.some(e => e.name === B), 'and it is the right one that went');

    // Removal and reordering must compose: the survivors keep the order asked for.
    const both = resolveDay(source, ctx(doc({
        exercises: { [resolver.resolveId(B)]: { enabled: false } },
        slots: { [slotKey(1, 1, 2)]: { order: -1 } },
    })));
    ok(
        both?.exercises.map(e => e.name).join() === `${C},${A}`,
        'removal and reordering compose'
    );
}

// --- session statistics ------------------------------------------------------------
{
    const stats = computeSessionStats({
        exercises: [exercise(A, 4, '6-8'), exercise(B, 3, '10')],
        lookup: e => resolver.resolve(e.name),
    });

    ok(stats.movements === 2, 'both movements are counted');
    ok(stats.workingSets === 7, 'working sets are the prescription, summed');
    ok(stats.estimatedReps === 4 * 7 + 3 * 10, 'reps are sets times the per-set estimate');
    ok(stats.perMovement.length === 2, 'and each movement is itemised');

    // Rest after the final set belongs to the next movement, not this one.
    const single = computeSessionStats({
        exercises: [exercise(A, 1, '5')],
        lookup: e => resolver.resolve(e.name),
        restFor: () => 180,
    });
    ok(single.restSeconds === 0, 'a single set is followed by no counted rest');

    const triple = computeSessionStats({
        exercises: [exercise(A, 3, '5')],
        lookup: e => resolver.resolve(e.name),
        restFor: () => 180,
    });
    ok(triple.restSeconds === 360, 'three sets carry two rests, not three');
    ok(triple.estimatedSeconds > triple.restSeconds, 'and the work itself is counted on top');

    // A placeholder occupies a slot without being a movement.
    const withRest = computeSessionStats({
        exercises: [exercise(A, 3, '5'), exercise('Rest / Mobility', 1, '—')],
        lookup: e => resolver.resolve(e.name),
    });
    ok(withRest.movements === 1, 'a rest placeholder is not counted as a movement');

    // Tonnage is reported only where the load is actually determinable.
    const unknownLoad = computeSessionStats({
        exercises: [exercise(A, 3, '5')],
        lookup: e => resolver.resolve(e.name),
    });
    ok(unknownLoad.tonnageCoverage === 0, 'a load that lives in history is not guessed at');
    ok(unknownLoad.tonnageKg === 0, 'and contributes nothing to tonnage');

    const known: Exercise = {
        ...exercise(A, 3, '5'),
        target: { type: 'straight', reps: '5', percentage: 0.8, percentageRef: 'pausedBench' },
    };
    const priced = computeSessionStats({
        exercises: [known],
        lookup: e => resolver.resolve(e.name),
        stats: { pausedBench: 100 },
    });
    ok(priced.tonnageCoverage === 1, 'a percentage slot is priceable against the athlete stats');
    ok(priced.tonnageKg === 80 * 3 * 5, 'and prices to load x sets x reps');

    // A muscle must be credited once per movement however many of its heads
    // the library lists as primary.
    const rowStats = computeSessionStats({
        exercises: [exercise(B, 3, '10')],
        lookup: e => resolver.resolve(e.name),
    });
    const back = rowStats.muscles.find(m => m.group === 'back');
    ok(back?.directSets === 3, 'a row credits back three sets, not once per listed head');
}

// --- every plan materialises -------------------------------------------------------
// The composer runs each plan's real generator. A generator that throws used to
// show as an empty plan; this fails instead.
for (const planId of PLAN_IDS) {
    const config = PLAN_REGISTRY[planId];
    ok(config !== undefined, `${planId} is registered`);

    let sessionsSeen = 0;
    for (const week of config.program.weeks.slice(0, 2)) {
        for (const source of week.days) {
            const resolved = resolveDay(
                { ...source, weekNumber: week.weekNumber },
                { planId, user: null, resolver, planConfig: doc({ planId }), lang: 'en', week: week.weekNumber }
            );
            if (!resolved?.exercises.length) continue;
            sessionsSeen += 1;

            // Slot keys are the athlete's join key; a collision inside one day
            // would make two movements share a history.
            const slots = resolved.exercises.map(e => e.slot);
            ok(
                new Set(slots).size === slots.length,
                `${planId} week ${week.weekNumber} day ${source.dayOfWeek}: slot keys are unique`
            );

            const stats = computeSessionStats({
                exercises: resolved.exercises as unknown as Exercise[],
                lookup: e => resolver.resolve(e.name),
                restFor: e => (e as unknown as { restSeconds?: number }).restSeconds,
                tempoFor: e => (e as unknown as { tempo?: string }).tempo,
            });
            ok(
                Number.isFinite(stats.estimatedSeconds) && stats.estimatedSeconds >= 0,
                `${planId} week ${week.weekNumber} day ${source.dayOfWeek}: duration is a real number`
            );
            ok(
                stats.workingSets >= 0 && stats.movements >= 0,
                `${planId} week ${week.weekNumber} day ${source.dayOfWeek}: counts are non-negative`
            );
        }
    }

    // Plans that synthesise every session at runtime ship stub weeks, so an
    // empty static programme is expected for them and not a failure.
    void sessionsSeen;
}

// The preview user the composer feeds these generators is exercised the same
// way, so a generator that reads a field the preview does not populate fails
// here rather than showing an admin an empty plan.
{
    const { buildPreviewUser } = await import('../src/pages/admin/previewUser');
    for (const planId of PLAN_IDS) {
        const user = buildPreviewUser(planId) as UserProfile;
        ok(user !== undefined, `${planId} has a preview user`);

        const config = PLAN_REGISTRY[planId];
        for (const week of config.program.weeks.slice(0, 1)) {
            for (const source of week.days) {
                assert.doesNotThrow(
                    () => config.hooks?.preprocessDay?.({ ...source, weekNumber: week.weekNumber }, user),
                    `${planId} week ${week.weekNumber} day ${source.dayOfWeek}: generator runs against the preview user`
                );
                assertions++;
            }
        }
    }
}

console.log(`Composer verification passed: ${assertions} assertions.`);
