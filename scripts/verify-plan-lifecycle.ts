import assert from 'node:assert/strict';
import { applyPendingScheduleMode, calendarPlanWeek, requestScheduleMode, rerunPlan } from '../src/features/planLifecycle';

const run = { planId: 'athena', startedAt: '2026-08-03T08:00:00.000Z', week: 1, completedThroughWeek: 0 };
const preferences = { scheduleMode: 'four-day', exerciseSelections: { squat: 'hack-squat' }, updatedAt: run.startedAt };
assert.equal(calendarPlanWeek(run.startedAt, '2026-08-09T23:00:00.000Z'), 1);
assert.equal(calendarPlanWeek(run.startedAt, '2026-08-10T08:00:00.000Z'), 2);

const requested = requestScheduleMode(preferences, run, 'three-day', '2026-08-05T12:00:00.000Z');
assert.equal(applyPendingScheduleMode(requested, { ...run, completedThroughWeek: 1 }, '2026-08-09T20:00:00.000Z').scheduleMode, 'four-day');
assert.equal(applyPendingScheduleMode(requested, run, '2026-08-11T12:00:00.000Z').scheduleMode, 'four-day');
const applied = applyPendingScheduleMode(requested, { ...run, completedThroughWeek: 1 }, '2026-08-11T12:00:00.000Z');
assert.equal(applied.scheduleMode, 'three-day');
assert.equal(applied.pendingScheduleChange, undefined);

const rerun = rerunPlan({ ...run, week: 12, phase: 'judgment', completedThroughWeek: 12 }, '2026-11-01T08:00:00.000Z');
assert.deepEqual(rerun, { planId: 'athena', startedAt: '2026-11-01T08:00:00.000Z', week: 1, completedThroughWeek: 0 });
assert.equal(preferences.exerciseSelections.squat, 'hack-squat', 'preferences live outside run state and survive reruns');

console.log('Plan lifecycle verification passed.');
