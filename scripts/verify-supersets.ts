/**
 * verify:supersets
 *
 * A pair label is an instruction to alternate. The console used to pick "the
 * first row with work left", which ran A1 to completion before offering A2 —
 * the plan said superset and the athlete did straight sets.
 *
 * These assertions pin the ordering, and check that every plan which labels a
 * pair actually prescribes a partner for it.
 */

import assert from 'node:assert/strict';
import { groupKeyOf, handsOffToPartner, isSupersetted, nextSlot, partnersOf, type SupersetSlot } from '../src/features/workout/superset';
import { formatTempo } from '../src/features/workout/PrescriptionBadges';
import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_IDS } from '../src/data/planMeta';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

const slot = (id: string, pair: string | undefined, completed: number, total = 3): SupersetSlot =>
    ({ id, pair, totalSets: total, completedSets: completed });

// --- grouping ------------------------------------------------------------------
ok(groupKeyOf(slot('a', 'A1', 0)) === 'A', 'A1 belongs to group A');
ok(groupKeyOf(slot('a', 'A2', 0)) === 'A', 'A2 belongs to group A');
ok(groupKeyOf(slot('a', 'B1', 0)) === 'B', 'B1 is a different group');
ok(groupKeyOf(slot('a', undefined, 0)) === undefined, 'unlabelled work has no group');

// --- alternation ----------------------------------------------------------------
const pair = () => [slot('a1', 'A1', 0), slot('a2', 'A2', 0), slot('solo', undefined, 0)];

ok(nextSlot(pair())?.id === 'a1', 'a fresh pair opens on A1');

let slots = pair();
slots[0].completedSets = 1;
ok(nextSlot(slots)?.id === 'a2', 'after a set of A1 the console offers A2');

slots[1].completedSets = 1;
ok(nextSlot(slots)?.id === 'a1', 'and back to A1 for round two');

slots[0].completedSets = 3;
slots[1].completedSets = 2;
ok(nextSlot(slots)?.id === 'a2', 'a finished member drops out of the rotation');

slots[1].completedSets = 3;
ok(nextSlot(slots)?.id === 'solo', 'the group finishes before the next exercise starts');

// Straight sets are untouched by any of this.
const straight = [slot('x', undefined, 1), slot('y', undefined, 0)];
ok(nextSlot(straight)?.id === 'x', 'straight sets still run one exercise at a time');
ok(nextSlot([])?.id === undefined, 'an empty session has no next slot');
ok(nextSlot([slot('done', 'A1', 3)]) === undefined, 'a finished session has no next slot');

// A lone label is not a superset: Bench Domination groups without alternating.
const lonely = [slot('only', 'A1', 0), slot('other', undefined, 0)];
ok(nextSlot(lonely)?.id === 'only', 'a lone label behaves like a straight set');
ok(!isSupersetted(lonely, 'only'), 'a lone label is not reported as a superset');
ok(isSupersetted(pair(), 'a1'), 'a real pair is reported as a superset');
ok(partnersOf(pair(), 'a1').map(p => p.id).join() === 'a2', 'the partner is identifiable for display');
ok(partnersOf(pair(), 'solo').length === 0, 'unpaired work has no partner');

// Uneven set counts: the shorter movement finishes and the other carries on.
const uneven = [slot('a1', 'A1', 2, 2), slot('a2', 'A2', 1, 3)];
ok(nextSlot(uneven)?.id === 'a2', 'the unfinished partner continues alone');

// --- tempo formatting -----------------------------------------------------------
ok(formatTempo('40X0') === '4:0:X:0', 'four-phase tempo is separated for legibility');
ok(formatTempo('3010') === '3:0:1:0', 'digits-only tempo is separated too');
ok(formatTempo('4:0:X:0') === '4:0:X:0', 'an already-separated tempo is left alone');
ok(formatTempo('slow eccentric') === 'slow eccentric', 'authored prose is never mangled');

// --- handoff ----------------------------------------------------------------------
{
    const run = (a: number, b: number, aDone: number, bDone: number) => [
        { id: 'a', pair: 'A1', totalSets: a, completedSets: aDone },
        { id: 'b', pair: 'A2', totalSets: b, completedSets: bDone },
    ] as SupersetSlot[];

    ok(handsOffToPartner(run(3, 3, 1, 0), 'a'), 'an even pair hands A1 over to A2');
    ok(handsOffToPartner(run(3, 3, 1, 1), 'b'), 'and A2 back to A1');
    ok(!handsOffToPartner(run(3, 3, 3, 3), 'b'), 'a finished group rests');

    // The uneven case the owner called out: 4 against 3.
    ok(handsOffToPartner(run(4, 3, 3, 2), 'a'), 'round three still alternates');
    ok(!handsOffToPartner(run(4, 3, 4, 3), 'a'), 'the leftover fourth set rests');

    ok(!handsOffToPartner([{ id: 'a', totalSets: 3, completedSets: 1 }], 'a'), 'straight sets rest');
    ok(!handsOffToPartner([{ id: 'a', pair: 'A1', totalSets: 3, completedSets: 1 }], 'a'), 'a lone label rests');
}

// --- plans ------------------------------------------------------------------------
for (const planId of PLAN_IDS) {
    const config = PLAN_REGISTRY[planId];
    for (const week of config.program.weeks.slice(0, 1)) {
        for (const day of week.days.filter(candidate => candidate.exercises.length)) {
            const daySlots: SupersetSlot[] = day.exercises.map(exercise => ({
                id: exercise.id,
                pair: exercise.prescription?.pair,
                totalSets: exercise.sets,
                completedSets: 0,
            }));
            for (const member of daySlots.filter(candidate => candidate.pair)) {
                // A pair label with nobody to alternate with is a label that
                // promises something the session cannot deliver.
                const partners = partnersOf(daySlots, member.id);
                ok(partners.length > 0, `${planId} ${day.dayName}: ${member.pair} has a partner`);
            }
        }
    }
}

console.log(`Superset verification passed: ${assertions} assertions.`);
