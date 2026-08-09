/**
 * Presentation metadata for the maxes a plan can ask for at onboarding.
 *
 * `definePlan` derives *which* stats a plan needs (see `requiredStatsFor`);
 * this module says how to render each one. Keeping them apart means adding a
 * plan never touches this file, and adding a new benchmarkable lift never
 * touches the plans.
 */

import type { LiftingStats } from '../types';

export type BenchmarkLift = {
    /** i18n key suffix under `onboarding.benchmark.lifts`. */
    key: string;
    /** Placeholder for the numeric input — a plausible intermediate load. */
    placeholder: string;
};

export const BENCHMARK_LIFTS: Partial<Record<keyof LiftingStats, BenchmarkLift>> = {
    pausedBench: { key: 'pausedBench', placeholder: '100' },
    squat: { key: 'squat', placeholder: '140' },
    lowBarSquat: { key: 'lowBarSquat', placeholder: '140' },
    conventionalDeadlift: { key: 'conventionalDeadlift', placeholder: '180' },
    wideGripBench: { key: 'wideGripBench', placeholder: '95' },
    spotoPress: { key: 'spotoPress', placeholder: '95' },
    lowPinPress: { key: 'lowPinPress', placeholder: '90' },
    btnPress: { key: 'btnPress', placeholder: '50' },
};

/**
 * Required stats that we know how to render, in a stable order so the form
 * doesn't reshuffle between renders. Unknown keys are dropped rather than
 * rendered blank — `verify:onboarding` fails the build if a plan needs one.
 */
const ORDER: (keyof LiftingStats)[] = [
    'squat', 'lowBarSquat', 'pausedBench', 'wideGripBench',
    'spotoPress', 'lowPinPress', 'btnPress', 'conventionalDeadlift',
];

export const benchmarkLiftsFor = (
    required: (keyof LiftingStats)[] | undefined,
): { stat: keyof LiftingStats; lift: BenchmarkLift }[] => {
    if (!required?.length) return [];
    const wanted = new Set(required);
    return ORDER
        .filter(stat => wanted.has(stat) && BENCHMARK_LIFTS[stat])
        .map(stat => ({ stat, lift: BENCHMARK_LIFTS[stat]! }));
};
