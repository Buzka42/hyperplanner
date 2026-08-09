/**
 * verify:progression
 *
 * Checks the extracted per-plan progression handlers against the rules
 * documented in docs/plans/, not against a copy of themselves.
 *
 * That distinction matters. A test that compares extracted code to the code it
 * was extracted from proves only that the copy succeeded; it would happily pass
 * on a faithfully copied bug. These assertions state what the plan is supposed
 * to do and check the handler does it.
 *
 * Expected values are computed by hand in the comments so a failure says which
 * rule broke, not merely that two numbers differ.
 */

import { peachyProgression, pencilneckProgression } from '../src/features/workout/progression/historyEntries';
import type { LoggedSet, ProgressionContext } from '../src/features/workout/progression/types';
import type { Exercise, UserProfile, WorkoutDay } from '../src/types';

const failures: string[] = [];
const check = (ok: boolean, msg: string) => { if (!ok) failures.push(msg); };
const near = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol;

const exercise = (id: string, name: string): Exercise =>
    ({ id, name, sets: 3, target: { type: 'range', reps: '5-8' } });

const day = (exercises: Exercise[]): WorkoutDay =>
    ({ dayName: 'Test', dayOfWeek: 1, exercises });

const set = (weight: string, reps: string, completed = true, kind?: string): LoggedSet =>
    ({ weight, reps, completed, ...(kind ? { kind } : {}) });

const context = (over: Partial<ProgressionContext>): ProgressionContext => ({
    planId: 'test', week: 3, day: 1, isExistingLog: false,
    user: {} as UserProfile, workout: undefined, sets: {},
    ...over,
});

// ===========================================================================
// Peachy — records the heaviest completed squat set
// ===========================================================================
{
    const ex = exercise('sq', 'Squats');
    const base = { workout: day([ex]) };

    // Heaviest is 80kg, even though the 60kg set has more reps.
    {
        const result = peachyProgression(context({
            ...base,
            sets: { sq: [set('60', '10'), set('80', '5'), set('70', '8')] },
        }));
        const entry = result.appends[0]?.value as { weight: number; actualReps: number };
        check(result.appends.length === 1, 'Peachy should record exactly one squat history entry.');
        check(entry?.weight === 80, `Peachy should record the heaviest set (80), got ${entry?.weight}.`);
        check(entry?.actualReps === 5, `Peachy should record the reps of the heaviest set (5), got ${entry?.actualReps}.`);
        check(result.appends[0].field === 'squatHistory', 'Peachy writes to squatHistory.');
    }

    // Incomplete sets must not count — an entered but unticked set is not work done.
    {
        const result = peachyProgression(context({
            ...base,
            sets: { sq: [set('60', '10'), set('100', '5', false)] },
        }));
        const entry = result.appends[0]?.value as { weight: number };
        check(entry?.weight === 60, `Uncompleted sets must be ignored; expected 60, got ${entry?.weight}.`);
    }

    // Extra and technique sets are logged work but not the prescription.
    {
        const result = peachyProgression(context({
            ...base,
            sets: { sq: [set('60', '10'), set('90', '3', true, 'extra'), set('85', '5', true, 'drop')] },
        }));
        const entry = result.appends[0]?.value as { weight: number };
        check(entry?.weight === 60, `Extra and drop sets must not set a strength record; expected 60, got ${entry?.weight}.`);
    }

    // Re-saving a finished session must not duplicate the entry.
    {
        const result = peachyProgression(context({ ...base, isExistingLog: true, sets: { sq: [set('80', '5')] } }));
        check(result.appends.length === 0, 'Re-saving an existing log must record nothing.');
    }

    // Nothing logged, nothing recorded.
    {
        check(peachyProgression(context({ ...base, sets: { sq: [] } })).appends.length === 0,
            'No sets means no history entry.');
        check(peachyProgression(context({ ...base, sets: {} })).appends.length === 0,
            'Missing set data means no history entry.');
        check(peachyProgression(context({ workout: day([exercise('x', 'Hip Thrust')]), sets: {} })).appends.length === 0,
            'A day without the tracked lift records nothing.');
    }
}

// ===========================================================================
// Pencilneck — records the best estimated 1RM (Epley)
// ===========================================================================
{
    const ex = exercise('bp', 'Flat Barbell Bench Press');
    const base = { workout: day([ex]) };

    // 60x12 -> 60*(1+12/30) = 84.0
    // 80x5  -> 80*(1+5/30)  = 93.33  <- best
    // 85x2  -> 85*(1+2/30)  = 90.67
    {
        const result = pencilneckProgression(context({
            ...base,
            sets: { bp: [set('60', '12'), set('80', '5'), set('85', '2')] },
        }));
        const entry = result.appends[0]?.value as { weight: number; actualWeight: number; actualReps: number };
        check(result.appends[0]?.field === 'pencilneckBenchHistory', 'Pencilneck writes to pencilneckBenchHistory.');
        check(entry?.weight === 93, `Best e1RM should be 93 (80x5 via Epley), got ${entry?.weight}.`);
        check(entry?.actualWeight === 80 && entry?.actualReps === 5,
            `Should record the actual lift behind the estimate (80x5), got ${entry?.actualWeight}x${entry?.actualReps}.`);
    }

    // The heaviest set is NOT always the best estimate — this is the whole
    // reason Pencilneck uses e1RM rather than top weight.
    // 100x1 -> 103.3 ; 90x5 -> 105.0 <- best despite being lighter
    {
        const result = pencilneckProgression(context({
            ...base,
            sets: { bp: [set('100', '1'), set('90', '5')] },
        }));
        const entry = result.appends[0]?.value as { weight: number; actualWeight: number };
        check(entry?.actualWeight === 90,
            `A lighter set with more reps can win on e1RM; expected 90, got ${entry?.actualWeight}.`);
        check(near(entry?.weight ?? 0, 105), `90x5 should estimate 105, got ${entry?.weight}.`);
    }

    // Same guards as Peachy.
    {
        const incomplete = pencilneckProgression(context({
            ...base, sets: { bp: [set('60', '10'), set('120', '5', false)] },
        }));
        check((incomplete.appends[0]?.value as { actualWeight: number })?.actualWeight === 60,
            'Uncompleted sets must be ignored.');

        const tagged = pencilneckProgression(context({
            ...base, sets: { bp: [set('60', '10'), set('100', '8', true, 'extra')] },
        }));
        check((tagged.appends[0]?.value as { actualWeight: number })?.actualWeight === 60,
            'Extra sets must not set a strength record.');

        check(pencilneckProgression(context({ ...base, isExistingLog: true, sets: { bp: [set('80', '5')] } })).appends.length === 0,
            'Re-saving an existing log must record nothing.');
    }
}

// ===========================================================================
// Handlers must never write directly
// ===========================================================================
{
    const result = peachyProgression(context({
        workout: day([exercise('sq', 'Squats')]), sets: { sq: [set('80', '5')] },
    }));
    check(Object.keys(result.updates).length === 0, 'Peachy uses appends, not field updates.');
    check(Array.isArray(result.appends), 'Every handler returns an appends array.');
}

if (failures.length) {
    console.error(`\n  verify:progression FAILED (${failures.length})\n`);
    for (const f of failures) console.error(`   - ${f}`);
    console.error('');
    process.exit(1);
}

console.log('\n  verify:progression OK');
console.log('   Peachy records the heaviest completed squat set');
console.log('   Pencilneck records the best estimated 1RM, which is not always the heaviest set');
console.log('   both ignore uncompleted sets, extra sets, technique rows and re-saved sessions\n');
