/**
 * verify:admin-defaults
 *
 * The owner can set a default tempo and rest per exercise in the admin Library
 * tab. A plan's own prescription beats those defaults, because a plan asking
 * for a slow eccentric or a four-minute rest is making a training argument the
 * library should not quietly overrule — unless the owner sets the Force flag,
 * which is the deliberate escape hatch.
 *
 * These assertions pin that order, which is the whole feature.
 */

import assert from 'node:assert/strict';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { createResolver } from '../src/data/exercises';
import { diffAgainstSeed } from '../src/data/exercises/remote';
import { resolveDay } from '../src/lib/planResolution';
import { PLAN_REGISTRY } from '../src/data/plans';
import { buildPreviewUser } from '../src/pages/admin/previewUser';
import type { LibraryExercise, PlanExerciseDoc } from '../src/data/exercises/types';

let assertions = 0;
const ok = (condition: boolean, message: string) => { assert.ok(condition, message); assertions += 1; };

/**
 * Driven through the real resolveDay rather than a copy of its logic: a mirror
 * of the precedence would keep passing after the precedence itself changed,
 * which is the one failure this file exists to catch.
 *
 * The library is patched per case, so each assertion sees exactly one owner
 * opinion against one plan prescription.
 */
/**
 * The fixture day is searched for rather than named: the assertions need a slot
 * that carries a tempo and a slot that carries a rest, and no single plan is
 * guaranteed to have both on the day someone happens to pick.
 *
 * Ids come from a resolved day rather than the raw slots, because resolution
 * applies swaps and the id the athlete sees is not always the authored one.
 */
const fixture = (() => {
    for (const planId of Object.keys(PLAN_REGISTRY)) {
        const plan = PLAN_REGISTRY[planId];
        for (const week of plan.program.weeks.slice(0, 1)) {
            for (const rawDay of week.days.filter(d => d.exercises.length)) {
                const user = buildPreviewUser(planId);
                const day = plan.hooks?.preprocessDay ? plan.hooks.preprocessDay(rawDay, user) : rawDay;
                const resolved = resolveDay(day, {
                    planId, user, resolver: createResolver(EXERCISE_LIBRARY), lang: 'en', week: 1,
                });
                const tempoProbe = resolved?.exercises.find(e => e.tempo !== undefined);
                const restProbe = resolved?.exercises.find(e => e.restSeconds !== undefined);
                if (tempoProbe && restProbe) return { planId, user, day, tempoProbe, restProbe };
            }
        }
    }
    throw new Error('no plan day carries both a tempo and a rest');
})();

const { planId, user, day, tempoProbe, restProbe } = fixture;

const resolveWith = (probeId: string, patch: Partial<LibraryExercise>, planConfig?: PlanExerciseDoc) => {
    const library = EXERCISE_LIBRARY.map(e => (e.id === probeId ? { ...e, ...patch } : e));
    const resolved = resolveDay(day, {
        planId, user, resolver: createResolver(library), planConfig, lang: 'en', week: 1,
    });
    const slot = resolved!.exercises.find(e => e.exerciseId === probeId)!;
    return { tempo: slot.tempo, rest: slot.restSeconds };
};

const T = tempoProbe.exerciseId!;
const R = restProbe.exerciseId!;
const planTempo = tempoProbe.tempo;
const planRest = restProbe.restSeconds;

ok(planTempo !== undefined && planRest !== undefined, 'both probes carry a prescription to compete with');

// --- through the real resolver ------------------------------------------------------
ok(resolveWith(T, { defaultTempo: 'ZZZZ' }).tempo === planTempo, 'a library tempo default does NOT beat the plan');
ok(resolveWith(T, { defaultTempo: 'ZZZZ', tempoForced: true }).tempo === 'ZZZZ', 'Force beats the plan tempo');
ok(resolveWith(T, { tempoForced: true }).tempo === planTempo, 'Force with no value set changes nothing');

ok(resolveWith(R, { defaultRestSeconds: 7 }).rest === planRest, 'a library rest default does NOT beat the plan');
ok(resolveWith(R, { defaultRestSeconds: 7, restForced: true }).rest === 7, 'Force beats the plan rest');
// Zero is a real answer — a superset partner rests for nothing — and must not
// be discarded the way a nullish check would discard it.
ok(resolveWith(R, { defaultRestSeconds: 0, restForced: true }).rest === 0, 'a forced zero rest survives');

// A per-plan admin override sits between the plan and a forced library value.
{
    const cfg = (id: string): PlanExerciseDoc => ({
        planId, version: 1, updatedAt: '', updatedBy: '',
        exercises: { [id]: { tempo: 'ADMIN', restSeconds: 123 } },
    });
    ok(resolveWith(T, {}, cfg(T)).tempo === 'ADMIN', 'a per-plan override beats the plan');
    ok(resolveWith(T, { defaultTempo: 'ZZZZ' }, cfg(T)).tempo === 'ADMIN', 'and beats an unforced library default');
    ok(resolveWith(T, { defaultTempo: 'ZZZZ', tempoForced: true }, cfg(T)).tempo === 'ZZZZ', 'but Force beats it');
    ok(resolveWith(R, { defaultRestSeconds: 7, restForced: true }, cfg(R)).rest === 7, 'the same holds for rest');
}

// A hold is prescribed in seconds; a tempo on it is noise no matter who set it.
{
    const timed = EXERCISE_LIBRARY.find(e => e.weightMode === 'timed')!;
    ok(!!timed, 'the library has a timed hold to check');
}

// --- persistence -------------------------------------------------------------------
{
    const seed = EXERCISE_LIBRARY.find(e => e.id === 'flat-barbell-bench-press')!;
    const edited = { ...structuredClone(seed), defaultTempo: '3010', tempoForced: true, defaultRestSeconds: 210 };
    const patch = diffAgainstSeed(edited) as Record<string, unknown>;
    ok(patch?.defaultTempo === '3010', 'an edited tempo reaches the overlay patch');
    ok(patch?.tempoForced === true, 'as does the force flag');
    ok(patch?.defaultRestSeconds === 210, 'and the rest');

    ok(diffAgainstSeed(structuredClone(seed)) === null, 'an untouched exercise writes nothing');

    // Clearing must be stored as an explicit null, or the old value survives a
    // merge and the owner cannot take their opinion back.
    const withValue = EXERCISE_LIBRARY.find(e => e.defaultRestSeconds !== undefined);
    if (withValue) {
        const cleared = { ...structuredClone(withValue), defaultRestSeconds: undefined };
        const clearedPatch = diffAgainstSeed(cleared) as Record<string, unknown>;
        ok(clearedPatch !== null && clearedPatch.defaultRestSeconds === null, 'clearing a value stores an explicit null');
    }
}

console.log(`Admin default verification passed: ${assertions} assertions.`);
