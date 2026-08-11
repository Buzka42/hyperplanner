import { definePlan, type DaySpec } from '../planBuilder';
import { applyApexAccess } from '../../features/apexPredator/prescription';

const days: DaySpec[] = [
    { name: 'A — Lower Access + Push/Pull', dayOfWeek: 1, slots: [
        { ex: 'hack-squat', sets: 3, reps: '8-12', restSeconds: 120, progression: { type: 'double', increment: 2.5 } },
        { ex: 'flat-dumbbell-press', sets: 3, reps: '8-12', restSeconds: 90, progression: { type: 'double', increment: 2 } },
        { ex: 'bench-supported-one-arm-dumbbell-row', sets: 3, reps: '8-12', restSeconds: 90, progression: { type: 'double', increment: 2 } },
        { ex: 'seated-hamstring-curl', sets: 2, reps: '10-15', restSeconds: 75 },
        { ex: 'lateral-raise', sets: 2, reps: '12-20', restSeconds: 60 },
        { ex: 'apex-access-placeholder', sets: 2, reps: '8-12', restSeconds: 60 },
        { ex: 'apex-access-placeholder', sets: 2, reps: '8-12', restSeconds: 60 },
    ] },
    { name: 'B — Hinge + Vertical', dayOfWeek: 3, slots: [
        { ex: 'romanian-deadlift', sets: 3, reps: '6-10', restSeconds: 120, progression: { type: 'double', increment: 2.5 } },
        { ex: 'assisted-pull-up', sets: 3, reps: '6-10', restSeconds: 90 },
        { ex: 'seated-dumbbell-shoulder-press', sets: 2, reps: '8-12', restSeconds: 90 },
        { ex: 'front-foot-elevated-bulgarian-split-squat', sets: 2, reps: '8-12', restSeconds: 90 },
        { ex: 'single-arm-reverse-pec-deck', sets: 2, reps: '12-20', restSeconds: 60 },
        { ex: 'apex-access-placeholder', sets: 2, reps: '8-12', restSeconds: 60 },
        { ex: 'suitcase-carry', sets: 1, reps: '30-60', restSeconds: 60, optional: true },
    ] },
    { name: 'C — Unilateral + Shape', dayOfWeek: 5, slots: [
        { ex: 'deficit-reverse-lunge', sets: 3, reps: '8-12', restSeconds: 90 },
        { ex: 'hammer-chest-press', sets: 2, reps: '8-15', restSeconds: 90 },
        { ex: 'single-arm-hammer-row', sets: 3, reps: '8-15', restSeconds: 90 },
        { ex: 'hip-thrust', sets: 2, reps: '8-15', restSeconds: 90 },
        { ex: 'leg-extension', sets: 2, reps: '12-20', restSeconds: 60 },
        { ex: 'apex-access-placeholder', sets: 2, reps: '8-12', restSeconds: 60 },
        { ex: 'apex-access-placeholder', sets: 2, reps: '8-12', restSeconds: 60 },
    ] },
];

export const APEX_PREDATOR_CONFIG = definePlan({
    id: 'apex-predator', name: 'Apex Predator', weeks: 12, days,
    phases: [
        { name: 'Stalk', weeks: [1, 2, 3] },
        { name: 'First Hunt · Retest', weeks: [4], transform: slot => ({ ...slot, sets: Math.min(slot.sets, 2) }) },
        { name: 'Adapt', weeks: [5, 6, 7] },
        { name: 'Second Hunt · Retest', weeks: [8], transform: slot => ({ ...slot, sets: Math.min(slot.sets, 2) }) },
        { name: 'Apex', weeks: [9, 10, 11] },
        { name: 'Final Hunt · Retest', weeks: [12], transform: slot => ({ ...slot, sets: slot.sets >= 3 || slot.ex === 'lateral-raise' ? 2 : 1 }) },
    ],
    hooks: { preprocessDay: applyApexAccess },
    ui: { themeClass: 'theme-apex-predator', coverImage: '/apexpredator.png', navImage: '/apexpredator.png', dashboardWidgets: ['program_status', 'workout_history'] },
});
