/**
 * verify:project-chimera
 *
 * The plan is allowed to adapt, within limits that are the whole point: two
 * sets per quality per block, a floor under every quality, no mutation without
 * evidence, and a phenotype that decides nothing.
 */

import assert from 'node:assert/strict';
import {
    BLOCKS, CHIMERA_DAYS, PROJECT_CHIMERA_CONFIG, SLOT_QUALITY, baseWeeklySets, blockFor, meetsMinimums,
} from '../src/data/plans/projectChimera';
import {
    MINIMUM_WEEKLY_SETS, QUALITIES, REALLOCATION_CAP, applyMutation, phenotype, proposeMutation, withinCap,
    type Quality, type QualityEvidence,
} from '../src/features/projectChimera/mutation';
import type { UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

ok(PROJECT_CHIMERA_CONFIG.program.weeks.length === 16, 'Project Chimera runs sixteen weeks');
ok(CHIMERA_DAYS.length === 4, 'Project Chimera is four-day upper/lower');
ok(BLOCKS.length === 4 && BLOCKS.every(block => block.length === 4), 'four four-week blocks');
ok(blockFor(1) === 1 && blockFor(8) === 2 && blockFor(12) === 3 && blockFor(16) === 4, 'weeks map onto blocks');

// --- balanced base -----------------------------------------------------------
const weekly = baseWeeklySets();
ok(meetsMinimums(weekly), `the base plan clears every minimum (${JSON.stringify(weekly)})`);
for (const quality of QUALITIES) ok(weekly[quality] > 0, `${quality} is trained in the base plan`);
ok(CHIMERA_DAYS.every(day => day.slots.every(slot => SLOT_QUALITY[slot.ex])), 'every slot declares its quality');

// --- evidence gates mutation -------------------------------------------------
const evidence = (over: Partial<QualityEvidence>[] = []): QualityEvidence[] => QUALITIES.map((quality, index) => ({
    quality, comparableExposures: 4, trend: 0.02, fatigue: 2, stalled: false, ...(over[index] ?? {}),
}));

const thin = proposeMutation(2, evidence().map(entry => ({ ...entry, comparableExposures: 1 })), weekly);
ok(thin.components.length === 0, 'insufficient data forces no mutation');
ok(thin.message.includes('continues as written'), 'the athlete is told why nothing changed');

const rich = proposeMutation(2, evidence([
    { trend: -0.01, fatigue: 4 },                    // squat: expensive, going nowhere
    {}, {}, {}, {},
    { trend: 0.08, fatigue: 1 },                     // hypertrophy: responding
]), weekly);
ok(rich.components.length > 0, 'good evidence produces a proposal');
ok(rich.components.every(component => component.confirmed === false), 'no component starts confirmed');
ok(rich.components.every(component => !!component.rationale), 'every component explains itself');
ok(rich.message.includes('Confirm each one separately'), 'components are separately confirmable');

// --- the cap -----------------------------------------------------------------
ok(REALLOCATION_CAP === 2, 'the cap is two weekly sets per quality per block');
ok(withinCap(rich.components), 'a generated proposal respects the cap');
ok(!withinCap([
    { kind: 'reallocate-sets', quality: 'squat', setDelta: -2, rationale: '', confirmed: false },
    { kind: 'reallocate-sets', quality: 'squat', setDelta: -2, rationale: '', confirmed: false },
]), 'stacked components cannot exceed the cap');

const donors = rich.components.filter(component => (component.setDelta ?? 0) < 0);
const receivers = rich.components.filter(component => (component.setDelta ?? 0) > 0);
ok(donors.length > 0 && receivers.length > 0, 'sets are moved, not created');
ok(Math.abs(donors.reduce((n, c) => n + (c.setDelta ?? 0), 0)) === receivers.reduce((n, c) => n + (c.setDelta ?? 0), 0),
    'what one quality gives up, another takes on');

// --- minimums hold -----------------------------------------------------------
const atFloor = { ...weekly, squat: MINIMUM_WEEKLY_SETS.squat } as Record<Quality, number>;
const floored = proposeMutation(3, evidence([{ trend: -0.05, fatigue: 4 }]), atFloor);
ok(!floored.components.some(component => component.quality === 'squat' && (component.setDelta ?? 0) < 0),
    'a quality at its floor is never asked to give up sets');

const forced = applyMutation(atFloor, [{ kind: 'reallocate-sets', quality: 'squat', setDelta: -2, rationale: '', confirmed: true }]);
ok(forced.squat === MINIMUM_WEEKLY_SETS.squat, 'the floor holds even against a confirmed component');

// --- only confirmed components apply -----------------------------------------
const unconfirmed = applyMutation(weekly, rich.components.map(component => ({ ...component, confirmed: false })));
ok(JSON.stringify(unconfirmed) === JSON.stringify(weekly), 'unconfirmed components change nothing');
const partly = applyMutation(weekly, rich.components.map((component, index) => ({ ...component, confirmed: index === 0 })));
ok(JSON.stringify(partly) !== JSON.stringify(weekly), 'a single confirmed component applies on its own');

// The session builder honours the same rules.
const day = () => PROJECT_CHIMERA_CONFIG.program.weeks[4].days.find(d => d.dayOfWeek === 2)!;
const plain = PROJECT_CHIMERA_CONFIG.hooks!.preprocessDay!(day(), {} as UserProfile);
ok(plain.exercises.reduce((n, e) => n + e.sets, 0) === day().exercises.reduce((n, e) => n + e.sets, 0), 'no status means no change');

const mutated = PROJECT_CHIMERA_CONFIG.hooks!.preprocessDay!(day(), {
    projectChimeraStatus: { allocation: { 2: { squat: -1, hypertrophy: 1 } } },
} as unknown as UserProfile);
const squatSets = (exercises: { exerciseId?: string; sets: number }[]) => exercises
    .filter(e => SLOT_QUALITY[e.exerciseId ?? ''] === 'squat').reduce((n, e) => n + e.sets, 0);
ok(squatSets(mutated.exercises) < squatSets(day().exercises), 'a confirmed reallocation reaches the session');
ok(mutated.exercises.every(e => e.sets >= 1), 'no slot is reduced out of existence');

const swapped = PROJECT_CHIMERA_CONFIG.hooks!.preprocessDay!(day(), {
    projectChimeraStatus: { acceptedExerciseChanges: { 'barbell-squat': 'hack-squat' } },
} as unknown as UserProfile);
ok(swapped.exercises[0].exerciseId === 'hack-squat', 'a confirmed exercise change is applied');

// --- phenotype decides nothing -----------------------------------------------
const label = phenotype(evidence([{}, {}, {}, {}, {}, { trend: 0.09 }]));
ok(label.label.length > 0, 'a phenotype is produced');
ok(label.caveat.includes('never changes your programme'), 'the phenotype says it is inert');
ok(phenotype(evidence().map(entry => ({ ...entry, comparableExposures: 1 }))).label === 'Not enough data yet',
    'a phenotype is withheld without evidence');

console.log(`Project Chimera verification passed: ${assertions} assertions.`);
