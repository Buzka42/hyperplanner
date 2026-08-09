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
import { skeletonProgression } from '../src/features/workout/progression/skeleton';
import { benchDominationProgression } from '../src/features/workout/progression/benchDomination';
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
// Skeleton — plank time progression and week 12 completion
// docs/plans/skeleton-to-threat.md: "if all sets hit the current target time,
// plankTargetSeconds is incremented by +10 seconds"
// ===========================================================================
{
    const planks: Exercise = { id: 'pl', name: 'Planks', sets: 3, target: { type: 'straight', reps: '30sec' } };
    const base = { workout: day([planks]), user: {} as UserProfile };

    // All three sets at 30s or better -> next target 40.
    {
        const r = skeletonProgression(context({ ...base, sets: { pl: [set('0', '30'), set('0', '35'), set('0', '30')] } }));
        check(r.updates['skeletonStatus.plankTargetSeconds'] === 40,
            `Hitting 30s on all sets should set the next target to 40, got ${r.updates['skeletonStatus.plankTargetSeconds']}.`);
    }

    // One short set means no increase.
    {
        const r = skeletonProgression(context({ ...base, sets: { pl: [set('0', '30'), set('0', '25'), set('0', '30')] } }));
        check(r.updates['skeletonStatus.plankTargetSeconds'] === undefined,
            'Missing the target on any set must not raise it.');
    }

    // Doing fewer sets than prescribed does not earn it, even if all were good.
    {
        const r = skeletonProgression(context({ ...base, sets: { pl: [set('0', '40'), set('0', '40')] } }));
        check(r.updates['skeletonStatus.plankTargetSeconds'] === undefined,
            'The rule is "all sets", not "all the sets you did".');
    }

    // The target is read from the prescription, so it compounds between sessions.
    {
        const at40: Exercise = { ...planks, target: { type: 'straight', reps: '40sec' } };
        const r = skeletonProgression(context({
            workout: day([at40]), user: {} as UserProfile,
            sets: { pl: [set('0', '40'), set('0', '40'), set('0', '40')] },
        }));
        check(r.updates['skeletonStatus.plankTargetSeconds'] === 50,
            `From a 40s target the next should be 50, got ${r.updates['skeletonStatus.plankTargetSeconds']}.`);
    }

    // Completion fires on the athlete's own last training day of week 12.
    {
        const user = { selectedDays: [1, 3, 5] } as UserProfile;
        const onLast = skeletonProgression(context({ ...base, user, week: 12, day: 5, sets: {} }));
        check(onLast.updates['skeletonStatus.completed'] === true, 'Week 12 last day should complete the programme.');
        check(onLast.effects.some(e => e.type === 'openSkeletonCompletion'), 'Completion should raise its celebration effect.');

        const midWeek = skeletonProgression(context({ ...base, user, week: 12, day: 3, sets: {} }));
        check(midWeek.updates['skeletonStatus.completed'] === undefined,
            'An earlier training day in week 12 must not complete the programme.');

        const earlier = skeletonProgression(context({ ...base, user, week: 11, day: 5, sets: {} }));
        check(earlier.updates['skeletonStatus.completed'] === undefined, 'Week 11 must not complete the programme.');
    }
}

// ===========================================================================
// Bench Domination — docs/plans/bench-domination.md, accessory progression
// ===========================================================================
{
    const amrapEx: Exercise = {
        id: 'amrap', name: 'Paused Bench Press (AMRAP)', sets: 1,
        target: { type: 'amrap', reps: 'AMRAP', percentageRef: 'pausedBench' },
    };
    const btn: Exercise = { id: 'btn', name: 'Behind-the-Neck Press', sets: 4, target: { type: 'range', reps: '3-5' } };
    const spoto: Exercise = { id: 'sp', name: 'Spoto Press', sets: 3, target: { type: 'straight', reps: '5' } };
    const wide: Exercise = { id: 'wg', name: 'Wide-Grip Bench Press', sets: 3, target: { type: 'range', reps: '6-8' } };
    const stats = (over: Record<string, number> = {}) => ({ stats: { pausedBench: 100, ...over } } as unknown as UserProfile);

    // AMRAP: 100kg x 10 -> Epley 133.33 -> stored 133
    {
        const r = benchDominationProgression(context({
            workout: day([amrapEx]), user: stats(), week: 6, day: 6,
            sets: { amrap: [set('100', '10')] },
        }));
        const entry = r.appends.find(a => a.field === 'benchHistory')?.value as { weight: number; actualReps: number };
        check(entry?.weight === 133, `100kg x10 should estimate 133, got ${entry?.weight}.`);
        check(entry?.actualReps === 10, 'The actual reps should be recorded alongside the estimate.');
    }

    // BTN press: Monday drives it; all sets at the top of 3-5 earns +2.5
    {
        const hit = benchDominationProgression(context({
            workout: day([btn]), user: stats(), week: 2, day: 1,
            sets: { btn: [set('40', '5'), set('40', '5'), set('40', '5'), set('40', '5')] },
        }));
        check(hit.updates['stats.btnPress'] === 42.5, `All sets at 5 should earn 42.5, got ${hit.updates['stats.btnPress']}.`);
        check(hit.updates['stats.btnPressWeek'] === 2, 'The earning week is recorded so it cannot apply twice.');

        const miss = benchDominationProgression(context({
            workout: day([btn]), user: stats(), week: 2, day: 1,
            sets: { btn: [set('40', '5'), set('40', '4'), set('40', '5'), set('40', '5')] },
        }));
        check(miss.updates['stats.btnPress'] === 40, `A missed set holds the weight at 40, got ${miss.updates['stats.btnPress']}.`);

        const thursday = benchDominationProgression(context({
            workout: day([btn]), user: stats(), week: 2, day: 4,
            sets: { btn: [set('40', '5'), set('40', '5'), set('40', '5'), set('40', '5')] },
        }));
        check(thursday.updates['stats.btnPress'] === undefined, 'Only Monday drives the BTN press progression.');
    }

    // Spoto: fixed target, immediate progression
    {
        const hit = benchDominationProgression(context({
            workout: day([spoto]), user: stats(), week: 3, day: 3,
            sets: { sp: [set('80', '5'), set('80', '5'), set('80', '5')] },
        }));
        check(hit.updates['stats.spotoPress'] === 82.5, `All sets at 5 should earn 82.5, got ${hit.updates['stats.spotoPress']}.`);
    }

    // Wide-Grip: two consecutive Mondays before the increase
    {
        const first = benchDominationProgression(context({
            workout: day([wide]), user: stats({ wideGripConsecutive: 0 }), week: 2, day: 1,
            sets: { wg: [set('70', '8'), set('70', '8'), set('70', '8')] },
        }));
        check(first.updates['stats.wideGripBench'] === 70, 'One good Monday holds the weight.');
        check(first.updates['stats.wideGripConsecutive'] === 1, 'One good Monday advances the counter to 1.');

        const second = benchDominationProgression(context({
            workout: day([wide]), user: stats({ wideGripConsecutive: 1 }), week: 3, day: 1,
            sets: { wg: [set('70', '8'), set('70', '8'), set('70', '8')] },
        }));
        check(second.updates['stats.wideGripBench'] === 72.5, `A second consecutive Monday earns 72.5, got ${second.updates['stats.wideGripBench']}.`);
        check(second.updates['stats.wideGripConsecutive'] === 0, 'The counter resets after the increase.');

        const missed = benchDominationProgression(context({
            workout: day([wide]), user: stats({ wideGripConsecutive: 1 }), week: 3, day: 1,
            sets: { wg: [set('70', '8'), set('70', '6'), set('70', '8')] },
        }));
        check(missed.updates['stats.wideGripConsecutive'] === 0, 'A miss resets the counter.');
        check(missed.updates['stats.wideGripBench'] === 70, 'A miss holds the weight.');
    }

    // An extra set must not decide a progression either way.
    {
        const r = benchDominationProgression(context({
            workout: day([spoto]), user: stats(), week: 3, day: 3,
            sets: { sp: [set('80', '5'), set('80', '5'), set('80', '5'), set('80', '1', true, 'extra')] },
        }));
        check(r.updates['stats.spotoPress'] === 82.5,
            `A trailing extra set must not block the increase, got ${r.updates['stats.spotoPress']}.`);
    }

    // Deloads
    {
        const week8 = benchDominationProgression(context({
            workout: day([]), user: stats(), week: 8, day: 6, sets: {},
        }));
        check(week8.appends.some(a => a.field === 'benchDominationStatus.addedDeloadWeeks'),
            'Completing week 8 Saturday should schedule the forced deload.');

        const stalled = {
            stats: { pausedBench: 100 },
            benchHistory: [{ date: '', week: 5, weight: 120, actualWeight: 90, actualReps: 7 }],
        } as unknown as UserProfile;

        const reactive = benchDominationProgression(context({
            workout: day([amrapEx]), user: stalled, week: 6, day: 6,
            sets: { amrap: [set('90', '6')] },
        }));
        check(reactive.appends.some(a => a.field === 'benchDominationStatus.addedDeloadWeeks'),
            'Two consecutive stalled AMRAPs should bring the deload forward.');

        const strong = benchDominationProgression(context({
            workout: day([amrapEx]), user: stalled, week: 6, day: 6,
            sets: { amrap: [set('90', '12')] },
        }));
        check(!strong.appends.some(a => a.field === 'benchDominationStatus.addedDeloadWeeks'),
            'A strong AMRAP must not trigger a deload.');

        const week4 = benchDominationProgression(context({
            workout: day([]), user: stats(), week: 4, day: 6, sets: {},
        }));
        check(week4.updates['benchDominationStatus.week5BaseBeforeRecalc'] === 100,
            'Week 4 Saturday should record the current base for the week 5 comparison.');
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
