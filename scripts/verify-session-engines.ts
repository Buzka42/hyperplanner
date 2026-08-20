import assert from 'node:assert/strict';
import {
    deriveBackoffLoad,
    doubleProgression,
    enforceSetCap,
    recoveryRecommendation,
    topSetProgression,
    totalSystemWeight,
    advanceStallLadder,
    calculateDensity,
    transferConfidence,
    rankExerciseSwaps,
    canStartRotationSession,
    nextDeckIndex,
    sessionsInLastDays,
} from '../src/features/workout/engines';
import { EXERCISE_BY_ID } from '../src/data/exercises/library';

const clean = (reps: number, rir = 2) => ({ reps, rir, weightKg: 100, completed: true, quality: 'clean' as const });
assert.equal(doubleProgression({ prescribedSets: 3, targetMaxReps: 12, currentLoadKg: 100, incrementKg: 2.5, sets: [clean(12), clean(12), clean(12)] }).nextLoadKg, 102.5);
assert.equal(doubleProgression({ prescribedSets: 3, targetMaxReps: 12, currentLoadKg: 100, incrementKg: 2.5, sets: [clean(12), clean(12), { ...clean(12), quality: 'borderline' }] }).decision, 'hold');
assert.equal(topSetProgression({ topSet: clean(6), targetMaxReps: 6, currentLoadKg: 100, incrementKg: 2.5, maximumProgressionRir: 2 }).decision, 'progress');
assert.equal(topSetProgression({ topSet: { ...clean(6), completionReason: 'technical-failure' }, targetMaxReps: 6, currentLoadKg: 100, incrementKg: 2.5, maximumProgressionRir: 2 }).decision, 'hold');
assert.equal(deriveBackoffLoad(101, 10), 90);
assert.equal(deriveBackoffLoad(undefined, 10), undefined, 'failed/skipped top sets leave back-offs editable');
assert.equal(totalSystemWeight(-20, 80), 60);
assert.equal(totalSystemWeight(20), undefined);

const capped = enforceSetCap([
    { id: 'main', sets: 4, priority: 10, protected: true, minimumSets: 4 },
    { id: 'priority', sets: 4, priority: 8, minimumSets: 2 },
    { id: 'isolation', sets: 4, priority: 1, minimumSets: 1 },
], 9);
assert.deepEqual(capped.map(slot => slot.sets), [4, 4, 1]);
assert.equal(recoveryRecommendation('somewhat-fatigued').requiresConfirmation, true);
assert.equal(recoveryRecommendation('recovered').action, 'continue');
assert.equal(recoveryRecommendation('recovered', true).recommendConsultation, true);

let ladder = { stageIndex: 0, consecutiveStalls: 0 };
ladder = advanceStallLadder(ladder, 'stalled').state;
assert.equal(advanceStallLadder(ladder, 'stalled').stage, 'rom');
assert.equal(advanceStallLadder({ stageIndex: 4, consecutiveStalls: 1 }, 'stalled').requiresVariationConfirmation, true);
assert.equal(advanceStallLadder({ stageIndex: 3, consecutiveStalls: 1 }, 'progressed').stage, 'reps');

const density = calculateDensity([{ weightKg: 100, reps: 10, completed: true }], 120);
assert.equal(density.volumeKg, 1000);
assert.equal(density.volumePerMinuteKg, 500);
assert.equal(density.timeLoadProduct, 200);

assert.equal(transferConfidence({ distance: 'exact', sourceDate: '2026-06-01', now: '2026-08-10' }).confidence, 'high');
assert.equal(transferConfidence({ distance: 'same-muscle', sourceDate: '2025-01-01', now: '2026-08-10' }).confidence, 'expired');

const source = EXERCISE_BY_ID['flat-barbell-bench-press'];
const swapCandidates = Object.values(EXERCISE_BY_ID).filter(exercise => exercise.pattern === source.pattern);
const swaps = rankExerciseSwaps({ source, candidates: swapCandidates, maximumSystemicCost: 3 });
assert.ok(swaps.length > 0);
assert.ok(swaps.every(item => item.exercise.pattern === source.pattern));

assert.equal(nextDeckIndex(4, 4), 0);
assert.equal(nextDeckIndex(5, 4), 1);
assert.equal(sessionsInLastDays(['2026-08-18T10:00:00.000Z', '2026-08-12T10:00:00.000Z'], new Date('2026-08-19T10:00:00.000Z')), 1);
assert.equal(canStartRotationSession({ capPer7Days: 4 }, ['2026-08-18', '2026-08-17', '2026-08-16', '2026-08-15'], new Date('2026-08-19')).allowed, false);
assert.equal(canStartRotationSession({ capPer7Days: 6, minHoursBetween: 36 }, ['2026-08-18T10:00:00.000Z'], new Date('2026-08-19T08:00:00.000Z')).allowed, false);
assert.equal(canStartRotationSession({ capPer7Days: 6, minHoursBetween: 36 }, ['2026-08-17T10:00:00.000Z'], new Date('2026-08-19T10:00:00.000Z')).allowed, true);

console.log('Shared session engine verification passed.');
