import assert from 'node:assert/strict';
import { ATHENA_CONFIG, ATHENA_FOUR_DAY, ATHENA_THREE_DAY, effectiveAthenaMode } from '../src/data/plans/athena';
import { backoffPercentFor, deriveBackoffLoad, topSetCanProgress } from '../src/features/workout/engines/topSetBackoff';
import { athenaProgression } from '../src/features/workout/progression/athena';
import type { UserProfile } from '../src/types';

let assertions = 0; const ok = (v: unknown, m: string) => { assert.ok(v, m); assertions++; };
for (const [label, days, count] of [['4-day', ATHENA_FOUR_DAY, 4], ['3-day', ATHENA_THREE_DAY, 3]] as const) {
    ok(days.length === count, `${label} frequency`);
    for (const day of days) { const sets = day.slots.reduce((n, slot) => n + slot.sets, 0); ok(sets >= 15 && sets <= 16, `${day.name} has 15–16 sets`); }
}
ok(deriveBackoffLoad(101, 10, 2.5) === 90, 'back-off uses top load, 10%, and equipment rounding');
ok(deriveBackoffLoad(100, 7.5, 5) === 95, 'slot override and increment rounding work');
// The grind cut is a response to a ground-out top set, never the resting default.
ok(backoffPercentFor(10, { rir: 2 }) === 10, 'a normal top set keeps the plan back-off');
ok(backoffPercentFor(10, { rir: 0 }) === 15, 'RIR 0 deepens the cut to 15% for that session');
ok(backoffPercentFor(10, { rpe: 9.5 }) === 15, 'RPE 9.5 deepens the cut to 15%');
ok(backoffPercentFor(10, {}) === 10, 'missing top-set metadata falls back to the plan back-off');
ok(backoffPercentFor(20, { rir: 0 }) === 20, 'a plan that already cuts deeper than 15% keeps its own');
ok(deriveBackoffLoad(100, backoffPercentFor(10, { rir: 0 }), 2.5) === 85, 'a ground-out 100kg top set backs off to 85kg');
ok(topSetCanProgress({ completed: true, reps: 6, targetMaxReps: 6, rir: 2, quality: 'clean' }), 'clean upper-target top set progresses');
for (const input of [
    { completed: false, reps: 6, rir: 1, quality: 'clean' as const },
    { completed: true, reps: 6, rir: 1, quality: 'borderline' as const },
    { completed: true, reps: 6, rir: 1, quality: 'invalid' as const },
    { completed: true, reps: 6, rir: undefined, quality: 'clean' as const },
]) ok(!topSetCanProgress({ ...input, targetMaxReps: 6 }), 'skipped/failed/borderline/invalid/missing-metadata top holds');
const w5 = ATHENA_CONFIG.program.weeks[4].days.find(day => day.dayOfWeek === 1)!;
ok(w5.exercises[0].prescription?.topSetBackoff?.backoffPercent === 10, 'Discipline introduces 10% top-set back-offs');
ok(w5.exercises[0].sets === 4 && w5.exercises[0].prescription?.topSetBackoff?.backoffSets === 3, 'top + back-offs preserve set count');
const clean = athenaProgression({ planId: 'athena', week: 5, day: 1, isExistingLog: false, user: { athenaStatus: {} } as UserProfile, workout: { dayName: '', dayOfWeek: 1, exercises: [w5.exercises[0]] }, sets: { [w5.exercises[0].id]: [{ reps: '6', weight: '100', completed: true, rir: 2, quality: 'clean' }] } });
ok((clean.updates['athenaStatus.exerciseLoads'] as Record<string, number>)['barbell-squat'] === 102.5, 'clean top set queues next load');
const held = athenaProgression({ planId: 'athena', week: 5, day: 1, isExistingLog: false, user: { athenaStatus: {} } as UserProfile, workout: { dayName: '', dayOfWeek: 1, exercises: [w5.exercises[0]] }, sets: { [w5.exercises[0].id]: [{ reps: '6', weight: '100', completed: true, rir: 2, quality: 'borderline' }] } });
ok((held.updates['athenaStatus.exerciseLoads'] as Record<string, number>)['barbell-squat'] === 100, 'borderline top holds load while back-offs remain loggable');
const user = { startDate: '2026-01-01', programProgress: { athena: { completedSessions: 0, startDate: '2026-01-01' } }, planPreferences: { athena: { scheduleMode: '4day', exerciseSelections: {}, updatedAt: '', pendingScheduleChange: { mode: '3day', requestedAt: '', requestedDuringWeek: 1 } } } } as unknown as UserProfile;
ok(effectiveAthenaMode(user, '2026-01-10') === '4day', 'mode holds before week completion'); user.programProgress!.athena.completedSessions = 4; ok(effectiveAthenaMode(user, '2026-01-10') === '3day', 'mode applies after completion and calendar boundary');
const w12 = ATHENA_CONFIG.program.weeks[11].days.find(day => day.dayOfWeek === 1)!;
ok(w12.exercises[0].sets === 3 && w12.exercises[2].sets === 1, 'Judgment preserves main exposure and reduces accessory volume');
console.log(`Athena verification passed: ${assertions} assertions.`);
