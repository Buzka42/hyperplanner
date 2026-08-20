/**
 * TENFOLD — German Volume Training derivative, 8 weeks, 4 days.
 *
 * From HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md section 7.
 *
 * Exactly one priority exercise per session runs the ten-set format; everything
 * else is normal accessory work. That constraint is what keeps the plan
 * survivable and still gives every major muscle two weekly exposures.
 *
 * Load is held constant until all ten sets hit the target, then increased —
 * so the progression is "complete the tenth set", not "add weight weekly".
 */

import { definePlan } from '../planBuilder';
import type { DaySpec, SlotSpec } from '../planBuilder';

/** The ten-set block. One per day, always first. */
const tenfold = (ex: string): SlotSpec => ({
    ex,
    sets: 10,
    reps: '10',
    restSeconds: 90,
    tempo: '40X0',
    notes: 'Hold the load until all ten sets reach ten reps. Only then add weight.',
});

const CHEST_TENFOLD: DaySpec = {
    name: 'Chest Tenfold',
    dayOfWeek: 1,
    slots: [
        tenfold('hammer-chest-press'),
        { ex: 'hammer-upper-row', sets: 2, reps: '8-12', restSeconds: 120, technique: { kind: 'last-set-failure' } },
        { ex: 'cable-lateral-raise', sets: 2, reps: '12-20', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'cable-triceps-extension', sets: 2, reps: '10-15', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'machine-curl', sets: 2, reps: '10-15', restSeconds: 60, technique: { kind: 'last-set-failure' } },
    ],
};

const QUAD_TENFOLD: DaySpec = {
    name: 'Quad Tenfold',
    dayOfWeek: 2,
    slots: [
        tenfold('hack-squat'),
        { ex: 'seated-ham-curl', sets: 4, reps: '8-12', restSeconds: 105 },
        { ex: 'hack-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'cable-crunch', sets: 3, reps: '12-20', restSeconds: 60 },
        // Second weekly chest and back exposure, so the split still satisfies
        // the two-exposure minimum around its single-muscle focus days.
        { ex: 'pec-deck', sets: 3, reps: '10-15', restSeconds: 75 },
    ],
};

const BACK_TENFOLD: DaySpec = {
    name: 'Back Tenfold',
    dayOfWeek: 4,
    slots: [
        tenfold('hammer-lower-row'),
        { ex: 'incline-dumbbell-bench-press', sets: 4, reps: '8-12', restSeconds: 120 },
        { ex: 'rear-delt-fly', sets: 3, reps: '15-20', restSeconds: 60 },
        { ex: 'ezbar-preacher-curl', sets: 3, reps: '10-15', restSeconds: 60 },
        { ex: 'french-press', sets: 3, reps: '10-15', restSeconds: 60 },
    ],
};

const HAMSTRING_TENFOLD: DaySpec = {
    name: 'Hamstring Tenfold',
    dayOfWeek: 5,
    slots: [
        tenfold('seated-ham-curl'),
        { ex: 'heel-elevated-goblet-squat', sets: 4, reps: '10-15', restSeconds: 90 },
        { ex: 'hack-calf-raise', sets: 2, reps: '12-20', restSeconds: 60 },
        { ex: 'ab-wheel', sets: 3, reps: '8-15', restSeconds: 60 },
        { ex: 'assisted-pull-up', sets: 3, reps: '8-12', restSeconds: 105 },
        { ex: 'cable-lateral-raise', sets: 2, reps: '12-20', restSeconds: 60 },
    ],
};

export const TENFOLD_CONFIG = definePlan({
    id: 'tenfold',
    name: 'Tenfold',
    weeks: 8,
    days: [CHEST_TENFOLD, QUAD_TENFOLD, BACK_TENFOLD, HAMSTRING_TENFOLD],
    phases: [
        { name: 'Ten Sets', weeks: [1, 2, 3, 4, 5] },
        {
            name: 'Consolidation',
            weeks: [6, 7, 8],
            // Ten sets of ten cannot run for eight straight weeks; the back half
            // trades a set for a rep range so the load can finally move.
            transform: slot =>
                slot.sets === 10
                    ? { ...slot, sets: 5, reps: '10', notes: 'Consolidation: 5×10. Add 5–7.5% to the tenfold load.' }
                    : { ...slot, sets: 2, technique: { kind: 'last-set-failure' as const } },
        },
    ],
    ui: {
        themeClass: 'theme-tenfold',
        coverImage: '/tenfold.png',
        navImage: '/tenfold.png',
        dashboardWidgets: ['program_status', 'strength_chart', 'workout_history'],
    },
});
