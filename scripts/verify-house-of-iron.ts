import assert from 'node:assert/strict';
import { HOUSE_OF_IRON_CONFIG } from '../src/data/plans/houseOfIron';
import { HOUSE_LADDERS } from '../src/features/workout/progression/houseOfIron';
import { houseBalance, recommendHouseSession } from '../src/features/houseOfIron/recommendation';
import { applyHouseProgressions } from '../src/features/houseOfIron/prescription';

assert.equal(HOUSE_OF_IRON_CONFIG.session?.kind, 'session-select');
assert.equal(HOUSE_OF_IRON_CONFIG.program.weeks.length, 8);
for (const week of HOUSE_OF_IRON_CONFIG.program.weeks) {
    assert.equal(week.days.filter(day => day.exercises.length > 0).length, 4);
}

const week1 = HOUSE_OF_IRON_CONFIG.program.weeks[0].days.filter(day => day.exercises.length);
for (const day of week1) {
    const requiredSets = day.exercises.filter(exercise => !exercise.optional).reduce((sum, exercise) => sum + exercise.sets, 0);
    assert.ok(requiredSets >= 12 && requiredSets <= 15, `${day.dayName} has ${requiredSets} required sets`);
}
const week8 = HOUSE_OF_IRON_CONFIG.program.weeks[7].days.filter(day => day.exercises.length);
week1.forEach((day, index) => {
    const normal = day.exercises.filter(exercise => !exercise.optional).reduce((sum, exercise) => sum + exercise.sets, 0);
    const rebuild = week8[index].exercises.filter(exercise => !exercise.optional).reduce((sum, exercise) => sum + exercise.sets, 0);
    const reduction = 1 - rebuild / normal;
    assert.ok(reduction >= 0.3 && reduction <= 0.4, `${day.dayName} rebuild reduction is ${Math.round(reduction * 100)}%`);
});

assert.deepEqual(houseBalance([
    { session: 'push-a', date: '2026-08-01' },
    { session: 'push-b', date: '2026-08-02' },
]), { upperPush: 2, upperPull: 0, knee: 2, hip: 0 });
assert.ok(recommendHouseSession([
    { session: 'push-a', date: '2026-08-01' },
    { session: 'push-b', date: '2026-08-02' },
], '2026-08-05').startsWith('pull'));
assert.equal(HOUSE_LADDERS['goblet-heel-elevated-squat'].at(-1), 'heavier-equipment');
assert.ok(HOUSE_LADDERS['romanian-deadlift'].includes('single-leg-rdl'));

const rdlDay = week1.find(day => day.dayName.startsWith('Pull A'))!;
const progressed = applyHouseProgressions(rdlDay, {
    houseOfIronStatus: { progression: { 'romanian-deadlift': { stageIndex: 4, consecutiveStalls: 0, cleanTopRangeExposures: 0, variationId: 'staggered-stance-rdl' } } },
} as any);
const changedRdl = progressed.exercises.find(exercise => exercise.exerciseId === 'staggered-stance-rdl');
assert.equal(changedRdl?.name, 'B-Stance Romanian Deadlift');

console.log('House of Iron verification passed.');
