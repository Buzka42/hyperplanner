/**
 * verify:portfolio
 *
 * The matrix has to stay complete and honest: a row per plan, real content in
 * every column, follow-ups that point at plans that exist, and a recommender
 * that never offers something the athlete cannot run — or a follow-up for a
 * plan they have not finished.
 */

import assert from 'node:assert/strict';
import { PORTFOLIO, PORTFOLIO_BY_ID, missingFromPortfolio } from '../src/data/portfolio';
import { comparableTo, eligible, followUpsFor, recommend } from '../src/features/portfolio/recommend';
import { PLAN_IDS } from '../src/data/planMeta';
import { PLAN_REGISTRY } from '../src/data/plans';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

// --- completeness -------------------------------------------------------------
ok(missingFromPortfolio().length === 0, `every plan has a matrix row (missing: ${missingFromPortfolio().join(', ')})`);
const strays = PORTFOLIO.filter(entry => !PLAN_IDS.includes(entry.id));
ok(strays.length === 0, `no matrix row points at a missing plan (${strays.map(e => e.id).join(', ')})`);
ok(PORTFOLIO.length === PLAN_IDS.length, 'the matrix and the registry are the same size');

for (const entry of PORTFOLIO) {
    ok(entry.goal.length > 0, `${entry.id} declares a goal`);
    ok(entry.experience.length > 0, `${entry.id} declares who it is for`);
    ok(entry.frequency.length > 0 && entry.frequency.every(days => days >= 1 && days <= 7), `${entry.id} declares a real frequency`);
    ok(entry.equipment.length > 0, `${entry.id} declares its equipment`);
    ok(entry.fatigue >= 1 && entry.fatigue <= 4, `${entry.id} rates its fatigue cost on the shared scale`);
    // The two columns most likely to be filled with filler.
    ok(entry.signatureMechanic.length > 25, `${entry.id} describes what makes it different`);
    ok(entry.notForYouIf.length > 0, `${entry.id} says who should walk away`);
    ok(entry.notForYouIf.every(line => line.length > 10), `${entry.id} avoids one-word disclaimers`);
    ok(entry.followUps.every(id => PORTFOLIO_BY_ID[id]), `${entry.id} follow-ups all exist`);
    ok(!entry.followUps.includes(entry.id), `${entry.id} does not recommend itself`);
    // Declared weeks should match the built program, so the matrix cannot drift.
    const config = PLAN_REGISTRY[entry.id];
    if (config && config.program.weeks.length > 1) {
        ok(entry.weeks === config.program.weeks.length, `${entry.id} declares its real length (${entry.weeks} vs ${config.program.weeks.length})`);
    }
}

// Signature mechanics are what distinguish two plans sharing a goal.
const mechanics = PORTFOLIO.map(entry => entry.signatureMechanic);
ok(new Set(mechanics).size === mechanics.length, 'no two plans claim the same signature mechanic');

// --- eligibility --------------------------------------------------------------
const minimum = PORTFOLIO_BY_ID['the-minimum'];
const house = PORTFOLIO_BY_ID['house-of-iron'];
const ritual = PORTFOLIO_BY_ID['ritual-of-strength'];

ok(eligible(minimum, { daysPerWeek: 2 }), 'a two-day plan fits a two-day week');
ok(!eligible(ritual, { daysPerWeek: 2 }), 'a three-day plan does not fit a two-day week');
ok(eligible(house, { equipment: 'minimal' }), 'a minimal-equipment plan fits a minimal gym');
ok(!eligible(ritual, { equipment: 'minimal' }), 'a barbell plan does not fit a minimal gym');
ok(eligible(ritual, { equipment: 'full-gym' }), 'a full gym covers everything');
ok(!eligible(ritual, { availablePlanIds: ['the-minimum'] }), 'access keys are respected');
ok(!eligible(PORTFOLIO_BY_ID['iron-clock']!, {}), 'Iron Clock is hidden from the catalogue');

// --- recommendation -----------------------------------------------------------
const busy = recommend({ goal: 'general', daysPerWeek: 2, experience: 'beginner' });
ok(busy.length > 0, 'a two-day beginner gets recommendations');
ok(busy.every(item => Math.min(...item.entry.frequency) <= 2), 'nothing recommended needs more days than they have');
ok(busy.some(item => item.entry.id === 'the-minimum'), 'the two-day plan surfaces for a two-day week');

const advanced = recommend({ goal: 'strength', experience: 'advanced', daysPerWeek: 4, equipment: 'full-gym' });
ok(advanced.length > 0, 'an advanced strength athlete gets recommendations');
ok(advanced[0].reasons.length >= 2, 'every recommendation explains itself');
ok(advanced.every(item => item.caveats.length > 0), 'every recommendation carries its own caveats');
ok(advanced.every(item => item.reasons.some(reason => reason === item.entry.signatureMechanic)),
    'the signature mechanic is always part of the reason');

// Overlapping goals are allowed, and the differences stay visible.
const hypertrophy = recommend({ goal: 'hypertrophy', experience: 'intermediate', daysPerWeek: 4 }, 8);
ok(hypertrophy.length >= 3, 'several plans may share a goal');
ok(new Set(hypertrophy.map(item => item.entry.signatureMechanic)).size === hypertrophy.length,
    'plans sharing a goal are distinguished by method');

// A plan already run is still offered, just ranked lower.
const repeat = recommend({ goal: 'hypertrophy', experience: 'intermediate', completedPlanIds: ['tenfold'] }, 20);
const tenfold = repeat.find(item => item.entry.id === 'tenfold');
ok(tenfold !== undefined, 'a completed plan is not hidden');
ok(tenfold!.reasons.some(reason => reason.includes('run this before')), 'and the athlete is told they have run it');

// Experience mismatch warns rather than hides.
const beginnerAdvanced = recommend({ goal: 'strength', experience: 'beginner', daysPerWeek: 6 }, 20);
const hard = beginnerAdvanced.find(item => item.entry.experience.includes('advanced') && !item.entry.experience.includes('beginner'));
ok(hard === undefined || hard.reasons.some(reason => reason.includes('Assumes')), 'an experience mismatch is stated');

// --- follow-ups ---------------------------------------------------------------
ok(followUpsFor('kali', false).length === 0, 'no follow-ups while a plan is unfinished');
const finished = followUpsFor('kali', true);
ok(finished.length > 0, 'finishing a plan produces follow-ups');
ok(finished.every(item => PORTFOLIO_BY_ID[item.planId]), 'follow-ups point at real plans');
ok(finished.every(item => item.why.length > 0 && item.signatureMechanic.length > 0), 'follow-ups say what they are and why');
ok(followUpsFor('kali', true, { daysPerWeek: 2 }).every(item => Math.min(...PORTFOLIO_BY_ID[item.planId].frequency) <= 2),
    'follow-ups respect the athlete’s week');
ok(followUpsFor('not-a-plan', true).length === 0, 'an unknown plan produces nothing');

// --- comparisons --------------------------------------------------------------
const similar = comparableTo('cathedral');
ok(similar.length > 0, 'a specialisation plan has comparable plans');
ok(similar.every(item => item.planId !== 'cathedral'), 'a plan is not comparable to itself');
ok(similar.every(item => item.differs.length > 20), 'comparisons explain the difference rather than warning about overlap');

console.log(`Portfolio verification passed: ${assertions} assertions across ${PORTFOLIO.length} plans.`);
