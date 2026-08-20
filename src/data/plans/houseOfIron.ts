import { definePlan, type DaySpec } from '../planBuilder';
import { applyHouseProgressions } from '../../features/houseOfIron/prescription';

const days: DaySpec[] = [
    {
        name: 'Push A — Chest + Quads', dayOfWeek: 1, slots: [
            { ex: 'goblet-heel-elevated-squat', sets: 3, reps: '8-15', restSeconds: 90 },
            { ex: 'single-arm-floor-press', sets: 3, reps: '8-15', restSeconds: 90, notes: 'Weaker side first; match reps.' },
            { ex: 'bulgarian-split-squat', sets: 2, reps: '8-15', restSeconds: 90, notes: 'Reverse lunge is the no-support fallback.' },
            { ex: 'push-up', sets: 2, reps: 'AMRAP', rpe: 8, restSeconds: 75, notes: 'Stop with 1–2 reps in reserve.' },
            { ex: 'single-arm-overhead-triceps-extension', sets: 2, reps: '10-20', restSeconds: 60 },
            { ex: 'suitcase-hold', sets: 1, reps: '30-60', restSeconds: 45, optional: true, notes: 'Optional; seconds per side.' },
        ],
    },
    {
        name: 'Pull A — Back + Hamstrings', dayOfWeek: 2, slots: [
            { ex: 'single-arm-dumbbell-row', sets: 3, reps: '8-15', restSeconds: 90 },
            { ex: 'romanian-deadlift', sets: 3, reps: '8-15', restSeconds: 120 },
            { ex: 'dumbbell-pullover', sets: 2, reps: '10-20', restSeconds: 75 },
            { ex: 'single-leg-rdl', sets: 2, reps: '8-15', restSeconds: 90 },
            { ex: 'hammer-curl', sets: 2, reps: '10-20', restSeconds: 60, notes: 'Curl role; selection can be changed in plan preferences.' },
            { ex: 'suitcase-carry', sets: 1, reps: '30-60', restSeconds: 45, optional: true, notes: 'Optional carry or march; seconds per side.' },
        ],
    },
    {
        name: 'Push B — Shoulders + Quads/Glutes', dayOfWeek: 3, slots: [
            { ex: 'single-arm-standing-press', sets: 3, reps: '6-12', restSeconds: 90 },
            { ex: 'goblet-skater-squat', sets: 3, reps: '6-12', restSeconds: 120 },
            { ex: 'single-arm-floor-press', sets: 2, reps: '10-15', restSeconds: 75 },
            { ex: 'supported-sissy-squat', sets: 2, reps: '10-20', restSeconds: 75, technique: { kind: 'last-set-failure' } },
            { ex: 'leaning-one-arm-lateral-raise', sets: 2, reps: '12-25', restSeconds: 60, notes: 'Shorten the lever if the available bell is too heavy.', technique: { kind: 'last-set-failure' } },
            { ex: 'close-grip-push-up', sets: 2, reps: 'AMRAP', restSeconds: 75 },
        ],
    },
    {
        name: 'Pull B — Back + Glutes/Hamstrings', dayOfWeek: 4, slots: [
            { ex: 'staggered-stance-rdl', sets: 3, reps: '8-15', restSeconds: 120 },
            { ex: 'single-arm-dumbbell-row', sets: 3, reps: '10-20', restSeconds: 90 },
            { ex: 'glute-bridge', sets: 3, reps: '10-20', restSeconds: 75 },
            { ex: 'dumbbell-pullover', sets: 2, reps: '12-20', restSeconds: 75 },
            { ex: 'bent-over-rear-delt-row', sets: 2, reps: '12-20', restSeconds: 60 },
            { ex: 'hammer-curl', sets: 2, reps: '10-20', restSeconds: 60 },
        ],
    },
];

export const HOUSE_OF_IRON_CONFIG = definePlan({
    id: 'house-of-iron',
    name: 'House of Iron',
    weeks: 8,
    days,
    phases: [
        { name: 'Foundation', weeks: [1, 2] },
        { name: 'Build', weeks: [3, 4] },
        { name: 'Harden', weeks: [5, 6] },
        { name: 'House on Fire', weeks: [7] },
        {
            name: 'Rebuild', weeks: [8],
            transform: slot => ({
                ...slot,
                sets: slot.sets >= 3 ? 2 : (slot.ex === 'push-up' || slot.ex === 'single-leg-rdl' ? 2 : 1),
            }),
        },
    ],
    session: { kind: 'session-select' },
    hooks: { preprocessDay: applyHouseProgressions },
    ui: {
        themeClass: 'theme-house-of-iron',
        coverImage: '/houseofiron.png',
        navImage: '/houseofiron.png',
        dashboardWidgets: ['program_status', 'workout_history'],
    },
});
