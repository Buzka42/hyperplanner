import assert from 'node:assert/strict';
import {
    ADVENTURE_EXERCISES,
    ADVENTURE_PAIRS,
    ADVENTURE_PLAN_ID,
    ADVENTURE_PORTALS,
    adventureResultKey,
    buildAdventureSequence,
    findPreviousAdventureWeight,
    getAdventurePair
} from '../src/data/adventure';
import { PLAN_REGISTRY } from '../src/data/plans';
import { ALWAYS_FREE_PLAN_IDS, DEFAULT_ONBOARDING_CONFIG } from '../src/data/accessControl';
import { translations } from '../src/contexts/translations';

assert.equal(ADVENTURE_PAIRS.length, 33, 'The merged source inventory must contain 33 pair cards.');
assert.deepEqual(ADVENTURE_PORTALS.map(portal => portal.pairIds.length), [7, 6, 7, 6, 7], 'Portal pair distribution drifted.');
assert.equal(new Set(ADVENTURE_PAIRS.map(pair => pair.id)).size, ADVENTURE_PAIRS.length, 'Pair IDs must be unique.');
assert.equal(ADVENTURE_PAIRS.filter(pair => pair.heroPick).length, 3, 'Exactly three Action Hero picks are required.');
assert.ok(PLAN_REGISTRY[ADVENTURE_PLAN_ID], 'Adventure must be registered.');
assert.ok(ALWAYS_FREE_PLAN_IDS.includes(ADVENTURE_PLAN_ID as never), 'Adventure must be an always-free plan.');
assert.ok(DEFAULT_ONBOARDING_CONFIG.generalPlanIds.includes(ADVENTURE_PLAN_ID), 'Adventure must appear in default onboarding access.');

for (const pair of ADVENTURE_PAIRS) {
    assert.ok(ADVENTURE_EXERCISES[pair.a], `Missing exercise ${pair.a}.`);
    assert.ok(ADVENTURE_EXERCISES[pair.b], `Missing exercise ${pair.b}.`);
    assert.notEqual(pair.a, pair.b, `${pair.id} cannot pair an exercise with itself.`);
    assert.ok(pair.equipment.length > 0, `${pair.id} needs equipment metadata.`);
    assert.ok(pair.restSeconds >= 45 && pair.restSeconds <= 120, `${pair.id} rest must remain realistic.`);
    assert.ok(pair.note.en && pair.note.pl, `${pair.id} requires bilingual setup notes.`);
}

for (const exercise of Object.values(ADVENTURE_EXERCISES)) {
    assert.ok(exercise.name.en && exercise.name.pl, `${exercise.key} requires bilingual names.`);
    assert.ok(exercise.cue.en && exercise.cue.pl, `${exercise.key} requires bilingual cues.`);
    assert.ok(exercise.target.min > 0 && exercise.target.max >= exercise.target.min, `${exercise.key} has an invalid target.`);
}

const selected = Object.fromEntries(ADVENTURE_PORTALS.map(portal => [portal.id, portal.pairIds[0]]));
const sequence = buildAdventureSequence(selected);
assert.equal(sequence.length, 20, 'A route must produce 20 working sets.');
assert.equal(new Set(sequence.map(step => `${step.pairId}:${step.exerciseKey}`)).size, 10, 'A route must produce ten exercise instances.');

for (const portal of ADVENTURE_PORTALS) {
    const pairId = selected[portal.id];
    const pair = getAdventurePair(pairId)!;
    const steps = sequence.filter(step => step.pairId === pairId);
    assert.deepEqual(steps.map(step => `${step.slot}${step.round}`), ['A1', 'B1', 'A2', 'B2'], `${pairId} has the wrong execution order.`);
    assert.deepEqual(steps.map(step => step.exerciseKey), [pair.a, pair.b, pair.a, pair.b], `${pairId} exercise order drifted.`);
}

const firstExercise = sequence[0];
const repeatedExerciseIndex = sequence.findIndex((step, index) => index > 0 && step.exerciseKey === firstExercise.exerciseKey);
const carriedResults = {
    [adventureResultKey(firstExercise.pairId, firstExercise.exerciseKey, firstExercise.round)]: { weight: '42.5', completed: true }
};
assert.equal(
    findPreviousAdventureWeight(sequence, carriedResults, repeatedExerciseIndex, firstExercise.exerciseKey),
    '42.5',
    'Round two must inherit the completed weight from round one.'
);
assert.equal(
    findPreviousAdventureWeight(sequence, { [adventureResultKey(firstExercise.pairId, firstExercise.exerciseKey, 1)]: { weight: '50', completed: false } }, repeatedExerciseIndex, firstExercise.exerciseKey),
    '',
    'Incomplete sets must not seed later working weights.'
);

assert.equal(ADVENTURE_EXERCISES.plank.failureMode, 'preprogrammed', 'Plank must not receive a redundant challenge prompt.');
assert.equal(ADVENTURE_EXERCISES['diamond-push-up'].failureMode, 'preprogrammed', 'Diamond push-ups must not receive a redundant challenge prompt.');
for (const key of ['barbell-squat', 'barbell-rdl', 'db-rdl', 'military-press', 'barbell-row']) {
    assert.equal(ADVENTURE_EXERCISES[key].failureMode, 'technical', `${key} must use last-clean-rep safety.`);
}

assert.ok(translations.en.adventure && translations.pl.adventure, 'Adventure UI requires EN/PL dictionaries.');
assert.ok(translations.en.onboarding.programs.adventure && translations.pl.onboarding.programs.adventure, 'Adventure onboarding copy requires EN/PL parity.');

console.log(`Adventure verified: ${ADVENTURE_PORTALS.length} portals, ${ADVENTURE_PAIRS.length} pair cards, ${Object.keys(ADVENTURE_EXERCISES).length} canonical exercises, ${sequence.length} working sets.`);
