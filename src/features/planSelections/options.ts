export const CORE_RAISE_OPTIONS = [
    { id: 'hanging-leg-raise', level: 'beginner' as const, label: 'Hanging Leg Raises', hint: 'Straight legs if bent is too easy.' },
    { id: 'ab-wheel-rollout', level: 'advanced' as const, label: 'Ab Wheel Rollouts', hint: 'Chest to the ground every rep.' },
    { id: 'dragon-flags', level: 'expert' as const, label: 'Dragon Flags', hint: 'Control the lowering.' },
] as const;

export const KALI_PULL_ANCHORS = [
    { id: 'assisted-pull-up', label: 'Assisted pull-up' },
    { id: 'weighted-pull-up', label: 'Weighted pull-up' },
    { id: 'lat-pulldown', label: 'Lat pulldown' },
] as const;

export const KALI_WEEK8 = [
    { id: 'none', label: 'Choose after week 7' },
    { id: 'rest-pause', label: 'Rest-pause (week 6 — press and pec deck)' },
    { id: 'myo', label: 'Myo-reps (week 7 — hack squat and dip)' },
] as const;

export const NEURAL_D4_SQUATS = [
    { id: 'front-squat', label: 'Front squat' },
    { id: 'hack-squat', label: 'Hack squat' },
    { id: 'stripper-squat', label: 'Stripper squat' },
    { id: 'safety-bar-squat', label: 'Safety-bar squat' },
] as const;

/**
 * Athena's four movement families.
 *
 * These used to be chosen on the dashboard, which made a decision that shapes
 * the whole twelve weeks look like a widget. They belong at onboarding, and in
 * settings for the athlete who changes gym.
 */
export const ATHENA_FAMILIES = [
    { key: 'squat', label: 'Squat', options: ['barbell-squat', 'hack-squat', 'safety-bar-squat', 'leg-press'] },
    { key: 'hinge', label: 'Hinge', options: ['romanian-deadlift', 'conventional-deadlift', 'sumo-deadlift'] },
    { key: 'bench', label: 'Bench', options: ['flat-barbell-bench-press', 'paused-bench-press', 'hammer-chest-press'] },
    { key: 'verticalPress', label: 'Vertical press', options: ['standing-barbell-military-press', 'seated-dumbbell-shoulder-press', 'shoulder-press-machine'] },
] as const;

export const KOS_SQUAT_BAR = [
    { id: 'low-bar-squat', label: 'Low bar' },
    { id: 'high-bar-squat', label: 'High bar' },
    { id: 'safety-bar-squat', label: 'Safety bar' },
] as const;

export const KOS_BENCH_JOB1 = [
    { id: 'long-pause-bench-press', label: 'Long-pause bench (CAT)' },
    { id: 'paused-bench-press', label: 'Paused bench' },
] as const;

export const KOS_BENCH_JOB2 = [
    { id: 'wide-grip-bench-press', label: 'Wide-grip bench' },
    { id: 'flat-dumbbell-press', label: 'Dumbbell bench' },
    { id: 'dip', label: 'Heavy dips' },
] as const;

export const KOS_BENCH_JOB3 = [
    { id: 'paused-bench-press', label: 'Paused max' },
    { id: 'spoto-press', label: 'Spoto press' },
    { id: 'low-pin-press', label: 'Pin press' },
] as const;

export const GRAVITY_ABS_SLOTS = new Set(['hanging-leg-raise', 'ab-wheel']);

export const LAZARUS_SQUATS = [
    { id: 'heel-elevated-goblet-squat', label: 'Heel-elevated goblet squat' },
    { id: 'high-bar-squat', label: 'High-bar squat' },
    { id: 'hack-squat', label: 'Hack squat' },
] as const;

export const LAZARUS_CHEST = [
    { id: 'dip', label: 'Dip' },
    { id: 'pec-deck', label: 'Pec deck' },
    { id: 'hammer-chest-press', label: 'Hammer chest press' },
] as const;

export const QUADFATHER_LOAD = [
    { id: 'hack-squat', label: 'Hack squat' },
    { id: 'high-bar-squat', label: 'High-bar squat' },
    { id: 'leg-press', label: 'Leg press' },
    { id: 'barbell-squat', label: 'Barbell squat' },
    { id: 'stiletto-squat', label: 'Stiletto squat' },
] as const;

export const REDLINE_FURNACE = [
    { id: 'paused-bench-press', label: 'Paused bench' },
    { id: 'flat-dumbbell-press', label: 'Dumbbell bench' },
    { id: 'dip', label: 'Dips' },
] as const;

export const ATLAS_HINGES = [
    { id: 'trap-bar-deadlift', label: 'Trap-bar deadlift' },
    { id: 'conventional-deadlift', label: 'Conventional deadlift' },
    { id: 'sumo-deadlift', label: 'Sumo deadlift' },
] as const;

export const ATLAS_FRONT = [
    { id: 'front-squat', label: 'Front squat' },
    { id: 'safety-bar-squat', label: 'Safety-bar squat' },
    { id: 'stiletto-squat', label: 'Stiletto squat' },
] as const;

export const needsPlanSelections = (planId: string) =>
    planId === 'kali'
    || planId === 'gravity-is-optional'
    || planId === 'neural-overload'
    || planId === 'king-of-the-squat'
    || planId === 'lazarus'
    || planId === 'quadfather'
    || planId === 'redline'
    || planId === 'atlas'
    || planId === 'athena';
