/**
 * verify:blackout
 *
 * One work set is the entire plan. The assertions here exist because every
 * plausible future edit — a stall fix, a "just one more set", a default-on
 * back-off — turns Blackout into an ordinary three-day full body.
 */

import assert from 'node:assert/strict';
import { BLACKOUT_CONFIG, BLACKOUT_DAYS } from '../src/data/plans/blackout';
import {
    BLACKOUT_STALL_LADDER, advanceStall, earnedBackoff, failureAllowed, isEvaluable, nextExposureAdvice,
    type PrimarySetResult,
} from '../src/features/blackout/singleSet';
import type { UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

ok(BLACKOUT_CONFIG.program.weeks.length === 8, 'Blackout runs eight weeks');
ok(BLACKOUT_DAYS.length === 3, 'Blackout is three-day full body');

// --- one set, everywhere -----------------------------------------------------
for (const day of BLACKOUT_DAYS) {
    ok(day.slots.every(slot => slot.sets === 1), `${day.name} prescribes one set per slot`);
    ok(day.slots.length >= 6, `${day.name} covers the body despite the single sets`);
}
for (const week of BLACKOUT_CONFIG.program.weeks) {
    for (const day of week.days.filter(d => d.exercises.length)) {
        ok(day.exercises.every(e => e.sets === 1), `week ${week.weekNumber} ${day.dayName} stays at one set`);
    }
}
// Even the late phase, which sharpens the primary sets, adds no volume.
const late = BLACKOUT_CONFIG.program.weeks[7].days.flatMap(d => d.exercises);
ok(late.every(e => e.sets === 1), 'the final phase adds effort, not sets');
ok(late.some(e => e.target.rpe === 10), 'the final phase sharpens the primary sets');

// --- mandatory metadata ------------------------------------------------------
const clean: PrimarySetResult = { reps: 8, targetReps: [6, 10], loadKg: 100, quality: 'clean', completionReason: 'target-completed' };
ok(isEvaluable(clean), 'a fully labelled set is evaluable');
ok(!isEvaluable({ ...clean, quality: undefined }), 'a set with no quality is not evaluable');
ok(!isEvaluable({ ...clean, completionReason: undefined }), 'a set with no completion reason is not evaluable');
ok(!earnedBackoff({ ...clean, quality: undefined }, 'recovered').offered, 'an unlabelled set earns nothing');

// --- earned back-off ---------------------------------------------------------
ok(earnedBackoff(clean, 'recovered').offered, 'a clean set with good recovery earns a back-off');
ok(earnedBackoff(clean, 'recovered').sets === 1, 'the back-off is a single set');
ok(!earnedBackoff({ ...clean, quality: 'borderline' }, 'recovered').offered, 'a borderline set earns nothing');
ok(!earnedBackoff({ ...clean, quality: 'invalid' }, 'recovered').offered, 'an invalid set earns nothing');
ok(!earnedBackoff({ ...clean, completionReason: 'technical-failure' }, 'recovered').offered, 'technical failure ends the session');
ok(!earnedBackoff({ ...clean, completionReason: 'pain' }, 'recovered').offered, 'a pain stop ends the session');
ok(!earnedBackoff({ ...clean, reps: 4 }, 'recovered').offered, 'a missed target earns nothing');
ok(!earnedBackoff(clean, 'somewhat-fatigued').offered, 'poor recovery earns nothing');
ok(!earnedBackoff(clean, 'recovered', true).offered, 'reported pain earns nothing');

// --- failure suitability -----------------------------------------------------
ok(failureAllowed('leg-extension'), 'isolation on a machine is approved for failure');
ok(!failureAllowed('hack-squat'), 'a loaded squat pattern is not approved for failure');
ok(!failureAllowed('romanian-deadlift'), 'a hinge is not approved for failure');
const day1 = BLACKOUT_CONFIG.hooks!.preprocessDay!(BLACKOUT_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!, {} as UserProfile);
ok(day1.exercises.find(e => e.exerciseId === 'hack-squat')?.notes?.includes('not approved'), 'the squat slot says so on the session sheet');
ok(day1.exercises.find(e => e.exerciseId === 'leg-extension')?.notes?.includes('approved'), 'the approved slot says so too');

// --- stall ladder ------------------------------------------------------------
ok(BLACKOUT_STALL_LADDER[0] === 'recovery-check', 'the ladder asks about recovery first');
ok(BLACKOUT_STALL_LADDER[BLACKOUT_STALL_LADDER.length - 1] === 'add-set', 'adding a set is the last resort');
ok(BLACKOUT_STALL_LADDER.indexOf('rep-target') < BLACKOUT_STALL_LADDER.indexOf('exercise-change'), 'rep targets change before movements do');

let state = { stageIndex: 0, consecutiveStalls: 0 };
const stages: string[] = [];
for (let i = 0; i < 5; i++) {
    const response = advanceStall(state, false);
    state = response.state;
    stages.push(response.stage);
}
ok(stages.join(',') === 'repeat,rep-target,exercise-change,add-set,add-set', `the ladder climbs in order (got ${stages.join(',')})`);
ok(advanceStall({ stageIndex: 2, consecutiveStalls: 3 }, false).requiresConfirmation, 'an exercise change is confirmed');
ok(advanceStall({ stageIndex: 3, consecutiveStalls: 4 }, false).requiresConfirmation, 'adding a set is confirmed');
ok(advanceStall({ stageIndex: 3, consecutiveStalls: 4 }, true).state.stageIndex === 0, 'progress resets the ladder');

// --- recovery advises, never blocks ------------------------------------------
for (const response of ['recovered', 'somewhat-fatigued', 'performance-impaired'] as const) {
    const advice = nextExposureAdvice(response);
    ok(advice.blocks === false, `${response} does not block the next session`);
    ok(advice.recommendedRestDays >= 1, `${response} still recommends a gap`);
}
ok(nextExposureAdvice('performance-impaired').recommendedRestDays > nextExposureAdvice('recovered').recommendedRestDays,
    'worse recovery recommends a longer gap');

console.log(`Blackout verification passed: ${assertions} assertions.`);
