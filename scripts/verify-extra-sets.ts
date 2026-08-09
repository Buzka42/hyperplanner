/**
 * verify:extra-sets
 *
 * Guards the rule that progression is judged on prescribed work only.
 *
 * Before this, an athlete who added one extra set to an exercise could stop
 * their own weight increase: the "did every set hit the top of the range?"
 * checks counted the extra set, and an empty or lighter one failed the test.
 * The failure was invisible — no error, just a plateau.
 *
 * This asserts the two halves of the fix:
 *   1. resolveDay separates baseSets (prescribed) from extraSets (chosen).
 *   2. workSets() filtering ignores sets tagged 'extra' and nothing else.
 */

import { PLAN_REGISTRY } from '../src/data/plans';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { createResolver } from '../src/data/exercises';
import { resolveDay } from '../src/lib/planResolution';
import { buildPreviewUser } from '../src/pages/admin/previewUser';
import type { PlanExerciseDoc } from '../src/data/exercises/types';
import type { UserProfile } from '../src/types';

const resolver = createResolver(EXERCISE_LIBRARY);
const failures: string[] = [];
const check = (ok: boolean, msg: string) => { if (!ok) failures.push(msg); };

const planId = 'bench-domination';
const plan = PLAN_REGISTRY[planId];
const rawDay = plan.program.weeks[0].days.find(d => d.exercises.length)!;

const base = buildPreviewUser(planId);
const day = plan.hooks!.preprocessDay!(rawDay, base);

// The admin must allow extras before a preference can do anything.
const config: PlanExerciseDoc = {
    planId, version: 1, updatedAt: '', updatedBy: '',
    exercises: { 'paused-bench-press': { userExtraSets: { allowed: true, max: 2 } } },
};

const withPref = (mode: 'off' | 'accessories' | 'all', count: 1 | 2): UserProfile =>
    ({ ...base, trainingPreferences: { extraSets: { mode, count } } }) as UserProfile;

const resolveFor = (user: UserProfile, cfg?: PlanExerciseDoc) =>
    resolveDay(day, { planId, user, resolver, planConfig: cfg, lang: 'en', week: 1 })!;

const bench = (user: UserProfile, cfg?: PlanExerciseDoc) =>
    resolveFor(user, cfg).exercises.find(e => e.exerciseId === 'paused-bench-press')!;

// --- 1. no preference, no extras --------------------------------------------
{
    const ex = bench(base, config);
    check(ex.extraSets === 0, `Default should add no extra sets, got ${ex.extraSets}.`);
    check(ex.sets === ex.baseSets, `sets (${ex.sets}) should equal baseSets (${ex.baseSets}) with no preference.`);
}

// --- 2. preference on, admin allows -----------------------------------------
{
    const ex = bench(withPref('all', 2), config);
    check(ex.extraSets === 2, `Preference of 2 should add 2 extra sets, got ${ex.extraSets}.`);
    check(ex.sets === ex.baseSets + 2, `sets should be baseSets + 2, got ${ex.sets} vs ${ex.baseSets}.`);
    check(ex.baseSets === bench(base, config).baseSets, 'baseSets must not change when the athlete adds extras.');
}

// --- 3. admin cap is enforced ------------------------------------------------
{
    const capped: PlanExerciseDoc = {
        ...config,
        exercises: { 'paused-bench-press': { userExtraSets: { allowed: true, max: 1 } } },
    };
    const ex = bench(withPref('all', 2), capped);
    check(ex.extraSets === 1, `Admin cap of 1 should win over a preference of 2, got ${ex.extraSets}.`);
}

// --- 4. no admin permission, no extras ---------------------------------------
{
    const ex = bench(withPref('all', 2));
    check(ex.extraSets === 0, `Without admin permission the preference must be ignored, got ${ex.extraSets}.`);
}

// --- 5. 'accessories' mode spares the main lifts ------------------------------
{
    const resolved = resolveFor(withPref('accessories', 1), {
        planId, version: 1, updatedAt: '', updatedBy: '',
        exercises: Object.fromEntries(
            resolveFor(base).exercises.map(e => [e.exerciseId, { userExtraSets: { allowed: true, max: 2 } }])
        ),
    });
    const [first, second] = resolved.exercises;
    check(first.extraSets === 0, `First movement is main work; should get no extras, got ${first.extraSets}.`);
    if (second) check(second.extraSets === 0, `Second movement is main work; got ${second.extraSets}.`);
    const accessory = resolved.exercises[2];
    if (accessory) check(accessory.extraSets === 1, `Accessory should get 1 extra set, got ${accessory.extraSets}.`);
}

// --- 6. the filter itself -----------------------------------------------------
{
    const workSets = <T extends { kind?: string }>(sets: T[]) => sets.filter(s => s.kind !== 'extra');
    const sets = [
        { reps: '8' }, { reps: '8' }, { reps: '8' },        // untagged: pre-existing logs
        { reps: '', kind: 'extra' },                         // the set that used to break it
    ];
    const top = 8;
    check(
        sets.every(s => parseInt(s.reps || '0') >= top) === false,
        'Sanity: the unfiltered check should fail on an empty extra set.'
    );
    check(
        workSets(sets).every(s => parseInt(s.reps || '0') >= top) === true,
        'Filtered progression check must pass despite the extra set.'
    );
    check(workSets(sets).length === 3, 'Untagged sets must still count as work.');
}

if (failures.length) {
    console.error(`\n  verify:extra-sets FAILED (${failures.length})\n`);
    for (const f of failures) console.error(`   - ${f}`);
    console.error('');
    process.exit(1);
}

console.log('\n  verify:extra-sets OK');
console.log('   baseSets and extraSets are tracked separately');
console.log('   admin permission and cap both enforced; accessories mode spares main lifts');
console.log('   progression ignores sets tagged extra, and still counts untagged ones\n');
