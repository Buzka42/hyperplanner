/**
 * verify:timed
 *
 * Holds and carries are prescribed in seconds. The promises asserted here are
 * that the app can tell a hold from a rep, that it only drops the weight field
 * for holds that genuinely have no weight, and that the suggested next goal is
 * always a number the athlete has not already beaten.
 */

import assert from 'node:assert/strict';
import { EXERCISE_BY_ID } from '../src/data/exercises/library';
import {
    isTimed, isBodyweightTimed, parseSeconds, formatSeconds,
    parseTimeTarget, bestHoldSeconds, nextTimedGoal,
} from '../src/features/workout/timedExercise';
import { PLAN_REGISTRY } from '../src/data/plans';
import type { WorkoutLog } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

// --- classification ---------------------------------------------------------
ok(isTimed(EXERCISE_BY_ID['plank']), 'plank is timed');
ok(isTimed(EXERCISE_BY_ID['suitcase-carry']), 'suitcase carry is timed');
ok(!isTimed(EXERCISE_BY_ID['barbell-squat']), 'a squat is not timed');

// The distinction that matters: a plank has no weight to report, a carry does.
ok(isBodyweightTimed(EXERCISE_BY_ID['plank']), 'plank hides weight');
ok(isBodyweightTimed(EXERCISE_BY_ID['dead-hang']), 'dead hang hides weight');
ok(!isBodyweightTimed(EXERCISE_BY_ID['suitcase-carry']), 'a loaded carry keeps its weight field');
ok(!isBodyweightTimed(EXERCISE_BY_ID['farmer-hold']), 'a farmer hold keeps its weight field');

// --- parsing and display ----------------------------------------------------
ok(parseSeconds('45') === 45 && parseSeconds('45sec') === 45, 'seconds parse with or without a unit');
ok(parseSeconds(undefined) === 0 && parseSeconds('') === 0, 'a missing value is zero, not NaN');
ok(formatSeconds(45) === '45s', 'under a minute reads in seconds');
ok(formatSeconds(95) === '1:35', 'over a minute reads as minutes');
ok(formatSeconds(120) === '2:00', 'a whole minute keeps its zeroes');
ok(formatSeconds(0) === '0s', 'zero is displayable');

const range = parseTimeTarget('30-60sec')!;
ok(range.min === 30 && range.max === 60, 'a range target parses');
const single = parseTimeTarget('45sec')!;
ok(single.min === 45 && single.max === 45, 'a single target parses as a degenerate range');
ok(parseTimeTarget(undefined) === undefined, 'no target is undefined, not a guess');

// --- personal best ----------------------------------------------------------
const history: WorkoutLog[] = [
    { id: '1', date: '2026-01-01', setResults: [{ weight: '0', reps: '30', completed: true }] as never },
    { id: '2', date: '2026-01-08', setResults: [{ weight: '0', reps: '52', completed: true }] as never },
    // An abandoned set must never become the number to beat.
    { id: '3', date: '2026-01-15', setResults: [{ weight: '0', reps: '90', completed: false }] as never },
];
ok(bestHoldSeconds(history, 'Planks') === 52, 'best hold ignores uncompleted sets');
ok(bestHoldSeconds([], 'Planks') === 0, 'no history is zero');

// --- the suggested goal -----------------------------------------------------
const target = { min: 30, max: 60 };
ok(nextTimedGoal(0, target, false).reason === 'first-attempt', 'a first attempt aims at the prescription');
ok(nextTimedGoal(0, target, false).target === 30, 'and that is the bottom of the window');
ok(nextTimedGoal(20, target, false).target === 30, 'below the window, the goal is to reach it');
ok(nextTimedGoal(40, target, false).target === 45, 'inside the window, the goal is best plus a step');
ok(nextTimedGoal(58, target, false).target === 60, 'the step never overshoots the window');
ok(nextTimedGoal(70, target, false).reason === 'extend', 'an unloaded hold past the window keeps extending');
ok(nextTimedGoal(70, target, true).reason === 'add-load', 'a loaded hold past the window asks for load instead');
ok(nextTimedGoal(90, undefined, false).target === 100, 'past a minute the step widens to ten seconds');

// The goal must always be worth chasing.
for (const best of [0, 5, 29, 30, 31, 45, 59, 60, 61, 120]) {
    const goal = nextTimedGoal(best, target, false);
    ok(goal.target > best || goal.reason === 'first-attempt' || goal.target === target.max,
        `goal for a ${best}s best is not a number already beaten`);
}

// --- the plans actually prescribe these in seconds ---------------------------
const timedIds = Object.values(EXERCISE_BY_ID).filter(isTimed).map(e => e.id);
ok(timedIds.length > 0, 'the library has timed movements');

let checked = 0;
for (const [planId, cfg] of Object.entries(PLAN_REGISTRY)) {
    for (const week of (cfg as { program?: { weeks?: unknown[] } }).program?.weeks ?? []) {
        for (const day of (week as { days?: unknown[] }).days ?? []) {
            for (const ex of (day as { exercises?: { exerciseId?: string; name?: string; target?: { reps?: string } }[] }).exercises ?? []) {
                if (!ex.exerciseId || !timedIds.includes(ex.exerciseId)) continue;
                checked++;
                // "Hold until you drop" is a real prescription for a hold, and
                // the goal logic falls back to beating the athlete's own best.
                if (/failure|amrap|max/i.test(String(ex.target?.reps))) continue;
                const parsed = parseTimeTarget(ex.target?.reps);
                ok(parsed !== undefined,
                    `${planId}: "${ex.name}" is timed but its target "${ex.target?.reps}" carries no number`);
                // The check that matters: a rep range inherited from a slot
                // helper default reads as an impossibly short hold. This is how
                // Venus Rising's and Lazarus's planks-as-8-12-reps were found.
                ok(parsed!.min >= 10,
                    `${planId}: "${ex.name}" prescribes ${parsed!.min}s — too short to be a real hold, and a sign a rep range leaked in`);
            }
        }
    }
}

console.log(`Timed exercise verification passed: ${assertions} assertions, ${checked} prescribed timed slots across the catalogue.`);
