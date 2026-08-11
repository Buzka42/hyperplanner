/**
 * verify:iron-clock
 *
 * Iron Clock's claims are about the clock: every block is timed, the ladder
 * climbs in the documented order, quality gates progression, and comparability
 * degrades honestly instead of history being discarded.
 */

import assert from 'node:assert/strict';
import {
    IRON_CLOCK_CONFIG, IRON_CLOCK_FOUR_DAY, IRON_CLOCK_THREE_DAY,
    IRON_CLOCK_WINDOWS, IRON_CLOCK_MIN_WINDOWS, IRON_CLOCK_MAX_ROUNDS, effectiveIronClockMode,
} from '../src/data/plans/ironClock';
import {
    advanceDensityBlock, blockDensity, compareBlocks, restWarning, startingState,
    type DensityBlockConfig,
} from '../src/features/ironClock/progression';
import type { IronClockBlockRecord, UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

// --- structure ---------------------------------------------------------------
ok(IRON_CLOCK_CONFIG.program.weeks.length === 8, 'Iron Clock runs eight weeks');
ok(IRON_CLOCK_FOUR_DAY.length === 4, 'four-day mode has four sessions');
ok(IRON_CLOCK_THREE_DAY.length === 3, 'three-day mode has three sessions');

for (const day of [...IRON_CLOCK_FOUR_DAY, ...IRON_CLOCK_THREE_DAY]) {
    ok(day.slots.filter(slot => slot.block?.kind === 'anchor').length === 1, `${day.name} has one anchor`);
    const density = day.slots.filter(slot => slot.block?.kind === 'density');
    ok(density.length >= 6, `${day.name} has at least three density blocks`);
    ok(density.every(slot => slot.block!.durationSeconds), `${day.name} times every density block`);
    ok(density.every(slot => slot.pair), `${day.name} pairs every density slot`);
    // A block is a pair worked alternately; a lone slot in a block would be a
    // straight set wearing a stopwatch.
    const ids = new Set(density.map(slot => slot.block!.id));
    for (const id of ids) {
        const members = density.filter(slot => slot.block!.id === id);
        ok(members.length === 2, `${day.name} block ${id} is a pair`);
        ok(new Set(members.map(slot => slot.block!.durationSeconds)).size === 1, `${day.name} block ${id} shares one window`);
    }
}

// --- schedule mode -----------------------------------------------------------
const user = (mode?: string, pending?: unknown): UserProfile => ({
    planPreferences: { 'iron-clock': { scheduleMode: mode ?? '4day', exerciseSelections: {}, updatedAt: '', ...(pending ? { pendingScheduleChange: pending } : {}) } },
    startDate: '2026-01-01',
} as unknown as UserProfile);

ok(effectiveIronClockMode(user()) === '4day', 'four-day is the default mode');
ok(effectiveIronClockMode(user('3day')) === '3day', 'three-day mode is honoured');
// A mid-week switch must not take effect until the requested week is done.
ok(effectiveIronClockMode(user('4day', { mode: '3day', requestedAt: '', requestedDuringWeek: 99 }), '2026-01-08T00:00:00.000Z') === '4day',
    'a pending switch waits for the week to complete');

const day = (dayOfWeek: number) => IRON_CLOCK_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === dayOfWeek)!;
const threeDayTue = IRON_CLOCK_CONFIG.hooks!.preprocessDay!(day(2), user('3day'));
ok(threeDayTue.exercises.length === 0, 'three-day mode never hands out a fourth session');
const threeDayWed = IRON_CLOCK_CONFIG.hooks!.preprocessDay!(day(3), user('3day'));
ok(threeDayWed.exercises.length > 0, 'three-day mode trains its own Wednesday');
ok(IRON_CLOCK_CONFIG.hooks!.preprocessDay!(day(2), user()).exercises.length > 0, 'four-day mode keeps Tuesday');

// --- phases ------------------------------------------------------------------
const densityRounds = (week: number) => IRON_CLOCK_CONFIG.program.weeks[week - 1].days
    .flatMap(d => d.exercises).filter(e => e.prescription?.block?.kind === 'density')
    .reduce((n, e) => n + e.sets, 0);
ok(densityRounds(3) > densityRounds(1), 'Tension adds rounds');
const windowAt = (week: number) => IRON_CLOCK_CONFIG.program.weeks[week - 1].days
    .flatMap(d => d.exercises).find(e => e.prescription?.block?.kind === 'density')!.prescription!.block!.durationSeconds!;
ok(windowAt(6) < windowAt(3), 'Escapement compresses the window');
ok(windowAt(8) === windowAt(1), 'the week-8 benchmark returns to the opening window');

// --- ladder ------------------------------------------------------------------
const config: DensityBlockConfig = {
    blockId: 'bell-1-a',
    baseDurationSeconds: IRON_CLOCK_WINDOWS.a,
    minDurationSeconds: IRON_CLOCK_MIN_WINDOWS.a,
    baseRounds: 4,
    maxRounds: IRON_CLOCK_MAX_ROUNDS,
    loadIncrementKg: 2.5,
};
const clean = (rounds: number) => ({ completedRounds: rounds, quality: 'clean' as const });

let state = startingState(config, 40);
ok(state.durationSeconds === 600 && state.targetRounds === 4, 'blocks open at the authored window');

// 1. Reps first.
const repsStep = advanceDensityBlock(state, clean(4), config);
ok(repsStep.step === 'reps' && repsStep.state.targetRounds === 5, 'a clean completion adds a round');
ok(repsStep.state.durationSeconds === state.durationSeconds, 'adding rounds does not touch the clock');

// 2. Time compression once rounds are capped.
state = { ...state, targetRounds: IRON_CLOCK_MAX_ROUNDS };
const timeStep = advanceDensityBlock(state, clean(IRON_CLOCK_MAX_ROUNDS), config);
ok(timeStep.step === 'time' && timeStep.state.durationSeconds === 540, 'a capped block compresses by a minute');
ok(timeStep.state.targetRounds === IRON_CLOCK_MAX_ROUNDS, 'compression holds the work');

// 3. Load only at the floor, and it resets the clock.
state = { ...state, durationSeconds: config.minDurationSeconds };
const loadStep = advanceDensityBlock(state, clean(IRON_CLOCK_MAX_ROUNDS), config);
ok(loadStep.step === 'load' && loadStep.state.loadKg === 42.5, 'a full block at the floor earns load');
ok(loadStep.state.durationSeconds === config.baseDurationSeconds && loadStep.state.targetRounds === config.baseRounds, 'load resets the clock and the target');
ok(loadStep.requiresConfirmation, 'a load jump is confirmed, never silent');

// 4. Quality and completion gate everything.
const held = startingState(config, 40);
ok(advanceDensityBlock(held, { completedRounds: 3, quality: 'clean' }, config).state.targetRounds === 4, 'an unmet target holds');
ok(advanceDensityBlock(held, { completedRounds: 4, quality: 'borderline' }, config).state.targetRounds === 4, 'borderline rounds hold');
ok(advanceDensityBlock(held, { completedRounds: 6, quality: 'invalid' }, config).state.targetRounds === 4, 'invalid rounds never progress');

// --- comparability -----------------------------------------------------------
const record = (over: Partial<IronClockBlockRecord> = {}): IronClockBlockRecord => ({
    blockId: 'bell-1-a', week: 1, durationSeconds: 600, rounds: 4, reps: 40, loadKg: 40,
    quality: 'clean', lineage: ['incline-dumbbell-bench-press', 'single-arm-hammer-row'], date: '2026-01-01', ...over,
});
ok(compareBlocks(record(), record()) === 'strict', 'an identical block compares strictly');
ok(compareBlocks(record(), record({ durationSeconds: 540 })) === 'adapted', 'a compressed window is adapted, not discarded');
ok(compareBlocks(record(), record({ lineage: ['incline-dumbbell-bench-press', 'seated-cable-row'] })) === 'adapted', 'one substitution keeps the trend');
ok(compareBlocks(record(), record({ lineage: ['leg-extension', 'lat-prayer'] })) === 'incomparable', 'a rebuilt block starts over');

ok(blockDensity(record()) === 160, 'density is load-weighted work per minute');
ok(blockDensity(record({ quality: 'invalid' })) === 0, 'invalid work sets no density best');

// --- rest --------------------------------------------------------------------
ok(!restWarning(80), 'ordinary rest passes without comment');
ok(restWarning(150)?.includes('still counts'), 'long rest warns but never blocks');

console.log(`Iron Clock verification passed: ${assertions} assertions.`);
