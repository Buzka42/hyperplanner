import assert from 'node:assert/strict';
import { extractPerformanceObservations, updatePerformanceSummary } from '../src/features/performanceProfile';

const base = {
    sessionId: 'session-1',
    date: '2026-08-10T12:00:00.000Z',
    programId: 'bench-domination',
    week: 1,
    day: 1,
    exercises: [{
        id: 'bench-slot',
        exerciseId: 'barbell-bench-press',
        setsData: [
            { reps: '10', weight: '100', completed: true },
            { reps: '16', weight: '80', completed: true, kind: 'extra' as const },
            { reps: '8', weight: '70', completed: true, kind: 'warmup' as const },
            { reps: '5', weight: '90', completed: true, kind: 'drop' as const },
            { reps: '8', weight: '110', completed: true, quality: 'invalid' as const },
            { reps: '8', weight: 'not-a-number', completed: true },
            { reps: '8', weight: '120', completed: false },
        ],
    }],
};

const observations = extractPerformanceObservations(base);
assert.equal(observations.length, 3, 'work and extra observations should be retained');
assert.equal(observations[0].estimated1RMKg, 133.3);
assert.equal(observations[0].estimateConfidence, 'standard');
assert.equal(observations[0].eligibleForBest, true);
assert.equal(observations[1].estimateConfidence, 'low');
assert.equal(observations[1].eligibleForBest, false);
assert.equal(observations[2].quality, 'invalid');
assert.equal(observations[2].eligibleForBest, false);

const assisted = extractPerformanceObservations({
    ...base,
    sessionId: 'session-2',
    exercises: [{ id: 'pullup', exerciseId: 'assisted-pull-up', setsData: [{
        reps: 8,
        weight: -20,
        totalSystemWeightKg: 60,
        completed: true,
    }] }],
});
assert.equal(assisted[0].externalLoadKg, -20);
assert.equal(assisted[0].estimated1RMKg, 76);

const firstSummary = updatePerformanceSummary(undefined, observations)!;
assert.equal(firstSummary.observationCount, 3);
assert.equal(firstSummary.bestObservation?.id, observations[0].id);
const repeated = updatePerformanceSummary(firstSummary, observations)!;
assert.equal(repeated.observationCount, 3, 'deterministic observation ids must make retries idempotent');

console.log('PerformanceProfile verification passed.');
