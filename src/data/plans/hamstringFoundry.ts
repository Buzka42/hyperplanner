/**
 * HAMSTRING FOUNDRY — hamstring specialisation, 10 weeks, 4 days.
 *
 * From HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md section 11.
 *
 * Hamstrings three times weekly through three different functions, which is the
 * whole point: heavy hip extension (RDL), knee flexion (curls, with a
 * four-second eccentric during accumulation), and lengthened control
 * (hip-supported DB deadlift). All three must progress.
 *
 * Day 3 is deliberately upper-dominant with no hard hamstring work — it exists
 * to protect recovery between the specialised lower sessions.
 */

import { definePlan } from '../planBuilder';
import type { DaySpec } from '../planBuilder';

const HEAVY_HIP_EXTENSION: DaySpec = {
    name: 'Heavy Hip Extension',
    dayOfWeek: 1,
    slots: [
        {
            ex: 'romanian-deadlift',
            sets: 4,
            reps: '5-8',
            restSeconds: 210,
            progression: { type: 'double', increment: 5 },
            notes: 'Hips back, bar against the legs. Stop where the hamstrings stop, not where the back rounds.',
        },
        { ex: 'seated-ham-curl', sets: 4, reps: '8-12', restSeconds: 105 },
        { ex: 'flat-dumbbell-press', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'rope-cable-row', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'cable-lateral-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'cable-curl', sets: 2, reps: '10-15', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'overhead-tricep-extension', sets: 2, reps: '10-15', restSeconds: 60, technique: { kind: 'last-set-failure' } },
    ],
};

const KNEE_FLEXION_AND_QUADS: DaySpec = {
    name: 'Knee Flexion + Quads',
    dayOfWeek: 2,
    slots: [
        {
            ex: 'seated-ham-curl',
            sets: 4,
            reps: '8-12',
            restSeconds: 105,
            tempo: '40X0',
            notes: 'Four-second lowering. The eccentric is the exercise here.',
        },
        { ex: 'goblet-skater-squat', sets: 3, reps: '8-12', restSeconds: 105, notes: 'Per side.' },
        { ex: 'sissy-squat', sets: 3, reps: '12-20', restSeconds: 90 },
        { ex: 'pull-up', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'hammer-chest-press', sets: 3, reps: '8-12', restSeconds: 105 },
        { ex: 'hack-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
    ],
};

const UPPER_DOMINANT: DaySpec = {
    name: 'Upper Dominant',
    dayOfWeek: 4,
    slots: [
        { ex: 'incline-dumbbell-bench-press', sets: 4, reps: '8-12', restSeconds: 120 },
        { ex: 'hammer-lower-row', sets: 2, reps: '8-12', restSeconds: 120 },
        { ex: 'rope-cable-row', sets: 2, reps: '8-12', restSeconds: 120 },
        { ex: 'lat-pulldown', sets: 3, reps: '8-12', restSeconds: 105 },
        { ex: 'seated-dumbbell-shoulder-press', sets: 3, reps: '8-12', restSeconds: 120 },
        { ex: 'rear-delt-fly', sets: 2, reps: '15-20', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'dumbbell-hammer-curl', sets: 2, reps: '10-15', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        { ex: 'cable-triceps-extension', sets: 2, reps: '10-15', restSeconds: 60, technique: { kind: 'last-set-failure' } },
        // No hard hamstring work today by design — this day protects recovery
        // between the two specialised lower sessions.
    ],
};

const LENGTHENED_HAMSTRINGS: DaySpec = {
    name: 'Lengthened Hamstrings',
    dayOfWeek: 5,
    slots: [
        {
            ex: 'hip-supported-db-deadlift',
            sets: 4,
            reps: '10-15',
            restSeconds: 120,
            notes: 'Lengthened control. Progress the ladder: 3s eccentric → 4s → pause in the stretch → 1.5 reps → extra reps.',
        },
        { ex: 'single-leg-hamstring-curl', sets: 3, reps: '10-15', restSeconds: 90, notes: 'Weaker leg first.' },
        { ex: 'heel-elevated-goblet-squat', sets: 3, reps: '10-15', restSeconds: 90 },
        { ex: 'hack-calf-raise', sets: 3, reps: '12-20', restSeconds: 60 },
        { ex: 'ab-wheel', sets: 3, reps: '8-15', restSeconds: 60 },
        // Second weekly chest and quad exposure so the upper day is not the only one.
        { ex: 'pec-deck', sets: 3, reps: '10-15', restSeconds: 75 },
    ],
};

export const HAMSTRING_FOUNDRY_CONFIG = definePlan({
    id: 'hamstring-foundry',
    name: 'Hamstring Foundry',
    weeks: 10,
    days: [HEAVY_HIP_EXTENSION, KNEE_FLEXION_AND_QUADS, UPPER_DOMINANT, LENGTHENED_HAMSTRINGS],
    phases: [
        {
            name: 'Forging',
            weeks: [1, 2, 3, 4, 5],
            // Accumulation: the four-second eccentric applies to all curl work.
            transform: slot => (slot.ex.includes('ham-curl') ? { ...slot, tempo: '40X0' } : slot),
        },
        {
            name: 'Tempering',
            weeks: [6, 7, 8, 9, 10],
            transform: slot =>
                slot.ex === 'romanian-deadlift'
                    ? { ...slot, reps: '4-6', sets: 5 }
                    : slot.ex.includes('ham-curl')
                        ? { ...slot, tempo: undefined, reps: '6-10' }
                        : slot,
        },
    ],
    ui: {
        themeClass: 'theme-hamstring-foundry',
        coverImage: '/hamstringfoundry.png',
        navImage: '/hamstringfoundry.png',
        dashboardWidgets: ['program_status', 'strength_chart', 'workout_history'],
    },
});
