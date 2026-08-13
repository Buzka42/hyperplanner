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
    { id: 'rest-pause', label: 'Rest-pause (week 6 intensifier)' },
    { id: 'myo', label: 'Myo-reps (week 7 intensifier)' },
] as const;

export const GRAVITY_ABS_SLOTS = new Set(['hanging-leg-raise', 'ab-wheel']);

export const needsPlanSelections = (planId: string) =>
    planId === 'kali' || planId === 'gravity-is-optional';
