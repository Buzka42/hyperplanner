import assert from 'node:assert/strict';
import { EXERCISE_BY_ID } from '../src/data/exercises/library';
import { APEX_ACCESS, APEX_REGIONS } from '../src/data/apexAccess';
import { APEX_PREDATOR_CONFIG } from '../src/data/plans/apexPredator';
import { nextRomLevel, selectApexEmphasis, validRegionScore, type ApexAssessment } from '../src/features/apexPredator/assessment';
import { applyApexAccess } from '../src/features/apexPredator/prescription';
import type { UserProfile } from '../src/types';

let assertions = 0;
const ok = (condition: unknown, message: string) => { assert.ok(condition, message); assertions++; };

for (const region of APEX_REGIONS) {
    ok(APEX_ACCESS[region].length > 0, `${region} maps to an access movement`);
    for (const movement of APEX_ACCESS[region]) ok(EXERCISE_BY_ID[movement.exerciseId], `${movement.exerciseId} resolves`);
}

const sparse: ApexAssessment = { week: 0, date: '', regions: { ankle: { score: 1, pain: 'none' }, hipFlexion: { score: 2, pain: 'pain' } } };
assert.deepEqual(selectApexEmphasis(sparse), ['ankle', 'thoracicRotation']); assertions++;
const complete: ApexAssessment = { week: 0, date: '', regions: {
    ankle: { left: 12, right: 12, score: 3, pain: 'none' }, hipFlexion: { score: 2, pain: 'none' }, hipRotation: { left: 1, right: 3, score: 2, pain: 'none' },
    shoulderFlexion: { score: 1, pain: 'none' }, shoulderRotation: { score: 3, pain: 'none' }, thoracicRotation: { score: 3, pain: 'none' },
} };
assert.deepEqual(selectApexEmphasis(complete), ['shoulderFlexion', 'hipRotation']); assertions++;
ok(validRegionScore({ left: 7, right: 9, pain: 'none' }, 'ankle') === 2, 'exact values use test-specific thresholds');
ok(validRegionScore({ score: 1, pain: 'pain' }) === null, 'pain invalidates a test');
ok(nextRomLevel(1, true, 3) === 2 && nextRomLevel(3, true, 3) === 3 && nextRomLevel(2, false, 3) === 2, 'ROM progression advances, caps, and holds');

ok(APEX_PREDATOR_CONFIG.program.weeks.length === 12, 'plan has 12 weeks');
for (const week of APEX_PREDATOR_CONFIG.program.weeks) ok(week.days.filter(day => day.exercises.length).length === 3, `week ${week.weekNumber} has three sessions`);
const baseSets = APEX_PREDATOR_CONFIG.program.weeks[0].days.find(day => day.dayOfWeek === 1)!.exercises.reduce((n, ex) => n + ex.sets, 0);
const finalSets = APEX_PREDATOR_CONFIG.program.weeks[11].days.find(day => day.dayOfWeek === 1)!.exercises.reduce((n, ex) => n + ex.sets, 0);
ok(finalSets / baseSets >= 0.6 && finalSets / baseSets <= 0.7, 'week 12 reduces session volume by 30–40%');

const user = { apexPredatorStatus: { emphasis: { regions: ['shoulderFlexion', 'ankle'], sinceWeek: 0 }, rom: {} } } as unknown as UserProfile;
const processed = applyApexAccess(APEX_PREDATOR_CONFIG.program.weeks[0].days.find(day => day.dayOfWeek === 1)!, user);
const accessIds = processed.exercises.map(ex => ex.exerciseId);
ok(accessIds.includes('wall-slide') && accessIds.includes('loaded-ankle-rock'), 'preprocessor installs both selected access regions');
ok(!accessIds.includes('apex-access-placeholder'), 'no placeholder reaches the workout');

console.log(`Apex Predator verification passed: ${assertions} assertions.`);
