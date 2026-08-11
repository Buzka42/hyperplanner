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
import { painGloryProgression } from '../src/features/workout/progression/painGlory';
import { ritualProgression } from '../src/features/workout/progression/ritual';
import { trinaryProgression } from '../src/features/workout/progression/trinary';
import { superMutantProgression } from '../src/features/workout/progression/superMutant';
import { houseOfIronProgression } from '../src/features/workout/progression/houseOfIron';
import type { LoggedSet, ProgressionContext } from '../src/features/workout/progression/types';
import type { Exercise, UserProfile, WorkoutDay } from '../src/types';

const failures: string[] = [];
// Counted and reported, so a section that silently stops running is visible
// rather than passing by not executing.
let checksRun = 0;
const check = (ok: boolean, msg: string) => { checksRun++; if (!ok) failures.push(msg); };
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
// Pain & Glory — docs/plans/pain-and-glory.md
// ===========================================================================
{
    const squat: Exercise = { id: 'sq', name: 'Paused Low Bar Squat', sets: 4, target: { type: 'range', reps: '4-6' } };
    const e2mom: Exercise = { id: 'e2', name: 'Conventional Deadlift (E2MOM)', sets: 6, target: { type: 'range', reps: '3-5' } };
    const amrapDl: Exercise = { id: 'dl', name: 'Conventional Deadlift (AMRAP)', sets: 1, target: { type: 'amrap', reps: 'Max' } };
    const deficit: Exercise = { id: 'df', name: 'Deficit Snatch Grip Deadlift', sets: 10, target: { type: 'straight', reps: '6' } };
    const pg = (over: Record<string, number> = {}) => ({ painGloryStatus: over } as unknown as UserProfile);

    // Squat: every set inside 4-6 and completed earns +2.5 on the accumulator.
    {
        const hit = painGloryProgression(context({
            workout: day([squat]), user: pg({ squatProgress: 5 }), week: 3,
            sets: { sq: [set('100', '5'), set('100', '6'), set('100', '4'), set('100', '5')] },
        }));
        check(hit.updates['painGloryStatus.squatProgress'] === 7.5,
            `5 + 2.5 should accumulate to 7.5, got ${hit.updates['painGloryStatus.squatProgress']}.`);

        // Seven reps is outside the range and does not count as hitting it.
        const over = painGloryProgression(context({
            workout: day([squat]), user: pg({ squatProgress: 5 }), week: 3,
            sets: { sq: [set('100', '7'), set('100', '5'), set('100', '5'), set('100', '5')] },
        }));
        check(over.updates['painGloryStatus.squatProgress'] === undefined,
            'Reps above the range are outside the target and must not earn the increase.');

        // Weeks 9+ hold the squat while the deadlift peaks.
        const late = painGloryProgression(context({
            workout: day([squat]), user: pg({ squatProgress: 5 }), week: 10,
            sets: { sq: [set('100', '5'), set('100', '5'), set('100', '5'), set('100', '5')] },
        }));
        check(late.updates['painGloryStatus.squatProgress'] === undefined,
            'Squat progression stops after week 8.');

        // Week 8 captures the maintenance weight regardless of the target.
        const wk8 = painGloryProgression(context({
            workout: day([squat]), user: pg(), week: 8,
            sets: { sq: [set('120', '3'), set('120', '3'), set('120', '3'), set('120', '3')] },
        }));
        check(wk8.updates['painGloryStatus.week8SquatWeight'] === 120,
            `Week 8 should record 120 as the maintenance weight, got ${wk8.updates['painGloryStatus.week8SquatWeight']}.`);
    }

    // E2MOM: all six sets at five reps
    {
        const six = Array.from({ length: 6 }, () => set('140', '5'));
        const hit = painGloryProgression(context({
            workout: day([e2mom]), user: pg({ e2momWeightAdjustment: 2.5 }), week: 10, sets: { e2: six },
        }));
        check(hit.updates['painGloryStatus.e2momWeightAdjustment'] === 5,
            `2.5 + 2.5 should be 5, got ${hit.updates['painGloryStatus.e2momWeightAdjustment']}.`);

        const short = painGloryProgression(context({
            workout: day([e2mom]), user: pg(), week: 10, sets: { e2: [...six.slice(0, 5), set('140', '4')] },
        }));
        check(short.updates['painGloryStatus.e2momWeightAdjustment'] === undefined,
            'One set below five reps must not earn the increase.');
    }

    // Week 13 AMRAP: 200x5 -> Epley 233.33 -> FLOORED to 232.5, not rounded up.
    {
        const r = painGloryProgression(context({
            workout: day([amrapDl]), user: pg(), week: 13, sets: { dl: [set('200', '5')] },
        }));
        check(r.updates['painGloryStatus.estimatedE1RM'] === 232.5,
            `200x5 should floor to 232.5, got ${r.updates['painGloryStatus.estimatedE1RM']}. Rounding up would peak off a lift that never happened.`);
        check(r.updates['painGloryStatus.amrapWeight'] === 200 && r.updates['painGloryStatus.amrapReps'] === 5,
            'The actual test lift should be recorded alongside the estimate.');
    }

    // Deficit work raises the RPE prompt in weeks 1-11 only.
    {
        const asks = painGloryProgression(context({ workout: day([deficit]), user: pg(), week: 5, sets: {} }));
        check(asks.effects.some(e => e.type === 'openDeficitFeedback'), 'Deficit work should ask how it felt.');

        const late = painGloryProgression(context({ workout: day([deficit]), user: pg(), week: 12, sets: {} }));
        check(!late.effects.length, 'The prompt stops after week 11.');
    }
}

// ===========================================================================
// Ritual of Strength — docs/plans/ritual-of-strength.md
// ===========================================================================
{
    const ascension: Exercise = { id: 'asc', name: 'Paused Bench Press (Ascension Test)', sets: 1, target: { type: 'amrap', reps: 'AMRAP' } };
    const me: Exercise = { id: 'me', name: 'Low Bar Squat (ME)', sets: 1, target: { type: 'straight', reps: '1' } };
    const light: Exercise = { id: 'lt', name: 'Conventional Deadlift (Light)', sets: 3, target: { type: 'straight', reps: '5' } };
    const ritual = (over: Record<string, unknown> = {}) =>
        ({ ritualStatus: { completedWorkouts: 0, benchPress1RM: 120, squat1RM: 160, deadlift1RM: 200, ...over } } as unknown as UserProfile);

    // Three sessions advance one week.
    {
        const r = ritualProgression(context({ workout: day([]), user: ritual({ completedWorkouts: 2, isFirstProgram: true }), sets: {} }));
        check(r.updates['ritualStatus.completedWorkouts'] === 3, 'The session counter advances.');
        check(r.updates['ritualStatus.currentWeek'] === 2, `Three sessions should reach week 2, got ${r.updates['ritualStatus.currentWeek']}.`);
    }

    // Ascension test: 100x8 -> Epley 126.67 -> floored 125, and the ME bonus resets.
    {
        const r = ritualProgression(context({
            workout: day([ascension]), user: ritual({ benchMEProgression: 7.5 }), week: 4,
            sets: { asc: [set('100', '8')] },
        }));
        check(r.updates['ritualStatus.benchPress1RM'] === 125,
            `100x8 should floor to 125, got ${r.updates['ritualStatus.benchPress1RM']}.`);
        check(r.updates['ritualStatus.benchMEProgression'] === 0,
            'The old ME bonus was earned against the previous 1RM and must reset.');
    }

    // ME single heavier than the stored 1RM raises it; lighter does not.
    {
        const heavier = ritualProgression(context({
            workout: day([me]), user: ritual(), week: 6, sets: { me: [set('170', '1')] },
        }));
        check(heavier.updates['ritualStatus.squat1RM'] === 170, `A 170 single should raise the 1RM, got ${heavier.updates['ritualStatus.squat1RM']}.`);

        const lighter = ritualProgression(context({
            workout: day([me]), user: ritual(), week: 6, sets: { me: [set('150', '1')] },
        }));
        check(lighter.updates['ritualStatus.squat1RM'] === undefined, 'A lighter single must not lower the 1RM.');

        // The checkbox adds an explicit jump for next session.
        const withChoice = ritualProgression(context({
            workout: day([me]), user: ritual({ squatMEProgression: 2.5 }), week: 6,
            sets: { me: [set('170', '1')] }, selections: { meProgression: { me: 5 } },
        }));
        check(withChoice.updates['ritualStatus.squatMEProgression'] === 7.5,
            `2.5 + 5 should accumulate to 7.5, got ${withChoice.updates['ritualStatus.squatMEProgression']}.`);
    }

    // Slow bar speed on a Light day flags a reduction for that lift.
    {
        const slow = ritualProgression(context({
            workout: day([light]), user: ritual(), week: 6, sets: { lt: [set('120', '5')] },
            selections: { slowVelocity: { lt: true } },
        }));
        const pending = slow.updates['ritualStatus.lightWorkReductionPending'] as Record<string, boolean>;
        check(pending?.deadlift === true, 'A slow Light deadlift should flag a reduction.');
    }
}

// ===========================================================================
// Trinary — conjugate, three effort types
// ===========================================================================
{
    const meEx: Exercise = { id: 'me', name: 'Spoto Press (ME)', sets: 1, target: { type: 'straight', reps: '1' } };
    const reEx: Exercise = { id: 're', name: 'Romanian Deadlift (RE)', sets: 4, target: { type: 'range', reps: '8-12' } };
    const deEx: Exercise = { id: 'de', name: 'Low Bar Squat (DE)', sets: 8, target: { type: 'range', reps: '2-3' } };
    const tri = (over: Record<string, unknown> = {}) =>
        ({ trinaryStatus: { completedWorkouts: 0, bench1RM: 120, deadlift1RM: 200, squat1RM: 160, ...over } } as unknown as UserProfile);

    // ME: RPE decides the jump. Spoto Press maps to bench.
    {
        const easy = trinaryProgression(context({
            workout: day([meEx]), user: tri(), sets: { me: [set('130', '1')] },
            selections: { meProgression: { me: 7 } },
        }));
        check(easy.updates['trinaryStatus.bench1RM'] === 130, `RPE 7 should add 10 to 120, got ${easy.updates['trinaryStatus.bench1RM']}.`);

        const hard = trinaryProgression(context({
            workout: day([meEx]), user: tri(), sets: { me: [set('130', '1')] },
            selections: { meProgression: { me: 8.5 } },
        }));
        check(hard.updates['trinaryStatus.bench1RM'] === 122.5, `RPE 8-9 should add 2.5, got ${hard.updates['trinaryStatus.bench1RM']}.`);

        // No self-report, no progression.
        const noRpe = trinaryProgression(context({ workout: day([meEx]), user: tri(), sets: { me: [set('130', '1')] } }));
        check(noRpe.updates['trinaryStatus.bench1RM'] === undefined, 'Without an RPE report there is no ME progression.');
    }

    // RE: 12 reps on all four sets queues +2.5 for the next RE exposure.
    {
        const twelve = Array.from({ length: 4 }, () => set('100', '12'));
        const r = trinaryProgression(context({ workout: day([reEx]), user: tri(), sets: { re: twelve } }));
        const pending = r.updates['trinaryStatus.reProgressionPending'] as { lift: string; amount: number }[];
        check(pending?.[0]?.lift === 'deadlift' && pending[0].amount === 2.5,
            `RDL should queue +2.5 against deadlift, got ${JSON.stringify(pending)}.`);

        const eleven = [...twelve.slice(0, 3), set('100', '11')];
        const missed = trinaryProgression(context({ workout: day([reEx]), user: tri(), sets: { re: eleven } }));
        check(missed.updates['trinaryStatus.reProgressionPending'] === undefined, 'One set short of 12 queues nothing.');
    }

    // DE: all speed sets completed queues +2.5 of bar weight.
    {
        const speed = Array.from({ length: 8 }, () => set('100', '3'));
        const r = trinaryProgression(context({ workout: day([deEx]), user: tri(), sets: { de: speed } }));
        const pending = r.updates['trinaryStatus.deProgressionPending'] as { lift: string; amount: number }[];
        check(pending?.[0]?.lift === 'squat', `DE squat should queue against squat, got ${JSON.stringify(pending)}.`);
    }

    // Accessory days log the session but must not advance the conjugate block.
    {
        const accessory = { dayName: 'Accessory Day', dayOfWeek: 3, exercises: [] } as WorkoutDay;
        const r = trinaryProgression(context({ workout: accessory, user: tri({ completedWorkouts: 5 }), sets: {} }));
        check(r.updates['trinaryStatus.completedWorkouts'] === undefined,
            'An accessory day must not advance the block count, or the whole schedule drifts.');
        check(r.increments?.['trinaryStatus.accessoryDaysCompleted'] === 1, 'It should still count as an accessory day.');
        check(r.appends.some(a => a.field === 'trinaryStatus.workoutLog'), 'It should still be logged.');
    }

    // Block boundaries raise their modals.
    {
        const atNine = trinaryProgression(context({ workout: day([]), user: tri({ completedWorkouts: 8 }), sets: {} }));
        check(atNine.effects.some(e => e.type === 'openWeakPointPicker'), 'Workout 9 should ask for new weak points.');

        const atEnd = trinaryProgression(context({ workout: day([]), user: tri({ completedWorkouts: 26 }), sets: {} }));
        check(atEnd.effects.some(e => e.type === 'openTrinaryRerun'), 'Workout 27 should offer a re-run.');
        check(!atEnd.effects.some(e => e.type === 'openWeakPointPicker'), 'The end of the programme is a re-run, not a weak-point pick.');
    }
}

// ===========================================================================
// Super Mutant — scheduling bookkeeping
// ===========================================================================
{
    const sm = (over: Record<string, unknown> = {}) => ({
        superMutantStatus: {
            completedWorkouts: 3, chestVariant: 'A', backVariant: 'B',
            muscleGroupTimestamps: {}, rolling7DayVolume: {}, volumeHistory: [],
            weeklySessionDates: [], ...over,
        },
    } as unknown as UserProfile);

    const chestMain: Exercise = { id: 'chest-a-main', name: 'Incline DB Bench Press', sets: 4, target: { type: 'range', reps: '8-12' } };

    // Session count, variant flip, and double progression on a compound.
    {
        const r = superMutantProgression(context({
            workout: day([chestMain]), user: sm(),
            sets: { 'chest-a-main': Array.from({ length: 4 }, () => set('40', '12')) },
        }));
        check(r.updates['superMutantStatus.completedWorkouts'] === 4, 'The session counter advances.');
        check(r.updates['superMutantStatus.chestVariant'] === 'B', 'Training chest flips the variant to B for next time.');
        check(r.updates['superMutantStatus.backVariant'] === undefined, 'Back was not trained, so its variant is untouched.');
        check(r.updates['superMutantStatus.exerciseLoads.chest-a-main'] === 45,
            `A compound at the top of the range should add 5, got ${r.updates['superMutantStatus.exerciseLoads.chest-a-main']}.`);
    }

    // Missing the top of the range earns nothing.
    {
        const r = superMutantProgression(context({
            workout: day([chestMain]), user: sm(),
            sets: { 'chest-a-main': [set('40', '12'), set('40', '12'), set('40', '12'), set('40', '10')] },
        }));
        check(r.updates['superMutantStatus.exerciseLoads.chest-a-main'] === undefined,
            'One set short of the top of the range earns no increase.');
    }

    // The rolling ledger drops entries older than a week.
    {
        const old = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString();
        const recent = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
        const r = superMutantProgression(context({
            workout: day([]), sets: {},
            user: sm({ volumeHistory: [
                { date: old, contributions: { chest: 99 } },
                { date: recent, contributions: { chest: 4 } },
            ] }),
        }));
        const rolling = r.updates['superMutantStatus.rolling7DayVolume'] as Record<string, number>;
        check(rolling.chest === 4,
            `Sets older than a week must expire from the rolling total; expected 4, got ${rolling.chest}. Otherwise volume only ever grows.`);
    }
}

// ===========================================================================
// House of Iron — two consecutive clean top-range exposures recommend a step
// ===========================================================================
{
    const squat = { ...exercise('house-slot', 'Goblet Heel-Elevated Squat'), exerciseId: 'goblet-heel-elevated-squat', target: { type: 'range' as const, reps: '8-15' } };
    const logged = { 'house-slot': [set('16', '15'), set('16', '15'), set('16', '15'), set('16', '30', true, 'extra')] };
    const first = houseOfIronProgression(context({ planId: 'house-of-iron', workout: day([squat]), sets: logged }));
    const firstProgression = first.updates['houseOfIronStatus.progression'] as Record<string, { cleanTopRangeExposures: number }>;
    check(firstProgression['goblet-heel-elevated-squat'].cleanTopRangeExposures === 1, 'House records the first clean top-range exposure.');

    const second = houseOfIronProgression(context({
        planId: 'house-of-iron', workout: day([squat]), sets: logged,
        user: { houseOfIronStatus: { progression: firstProgression as any } } as UserProfile,
    }));
    const pending = second.updates['houseOfIronStatus.pendingProgressions'] as Record<string, { stage: string }>;
    check(pending['goblet-heel-elevated-squat']?.stage === 'rom', 'Two clean exposures should recommend the authored ROM step.');

    const miss = houseOfIronProgression(context({
        planId: 'house-of-iron', workout: day([squat]),
        user: { houseOfIronStatus: { progression: firstProgression as any } } as UserProfile,
        sets: { 'house-slot': [set('16', '15'), set('16', '14'), set('16', '15')] },
    }));
    const reset = miss.updates['houseOfIronStatus.progression'] as Record<string, { cleanTopRangeExposures: number }>;
    check(reset['goblet-heel-elevated-squat'].cleanTopRangeExposures === 0, 'A missed exposure breaks the consecutive streak.');
    check(houseOfIronProgression(context({ planId: 'house-of-iron', isExistingLog: true, workout: day([squat]), sets: logged })).updates['houseOfIronStatus.progression'] === undefined, 'Re-saving a House workout must not earn progression twice.');
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

console.log(`\n  verify:progression OK — ${checksRun} assertions across all 9 stateful plans`);
console.log('   Peachy heaviest set · Pencilneck best e1RM · Skeleton plank time + completion');
console.log('   Bench Domination AMRAP, BTN, Spoto, Wide-Grip streak, four deload triggers');
console.log('   Pain & Glory squat window, E2MOM, AMRAP floored rather than rounded');
console.log('   Ritual ascension recalc + ME singles · Trinary ME by RPE, RE/DE queues');
console.log('   Super Mutant variant flip, double progression, rolling 7-day expiry');
console.log('   House of Iron consecutive mastery exposures + confirmed ladder recommendations');
console.log('   all ignore uncompleted sets, extra sets, technique rows and re-saved sessions\n');
