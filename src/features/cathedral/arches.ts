/**
 * CATHEDRAL — the Three Arches.
 *
 * A chest specialisation collapses when it becomes a pressing plan: the athlete
 * accumulates triceps and front-delt fatigue, the pecs never get the work, and
 * the weekly total looks fine. Cathedral splits chest work into three arches —
 * press, stretch and adduction — and keeps them balanced, then uses what
 * actually failed first to decide whether pressing should give way.
 */

import type { CathedralStatus } from '../../types';

export type Arch = 'press' | 'stretch' | 'adduction';

/**
 * Authored arch assignment. The combo machine is deliberately absent: it can
 * fill either Press or Adduction, and which one is the athlete's choice.
 */
export const ARCHES: Record<string, Arch> = {
    'incline-dumbbell-bench-press': 'press',
    'flat-dumbbell-press': 'press',
    '30-smith-incline-bench-press': 'press',
    'hammer-chest-press': 'press',
    'dip': 'stretch',
    'weighted-dip': 'stretch',
    'bodyweight-dip': 'stretch',
    'cable-fly': 'stretch',
    'low-to-high-cable-fly': 'stretch',
    'mid-cable-fly': 'stretch',
    'pec-deck': 'adduction',
    'cable-crossover': 'adduction',
};

export const COMBO_MACHINE = 'machine-press-fly-combo';

export const archOf = (exerciseId: string, comboRole?: Arch): Arch | undefined =>
    exerciseId === COMBO_MACHINE ? comboRole ?? 'press' : ARCHES[exerciseId];

/** No barbell bench, at all. Smith incline is the approved alternative. */
export const FORBIDDEN = ['flat-barbell-bench-press', 'incline-barbell-bench-press', 'paused-bench-press', 'wide-grip-bench-press', 'spoto-press', 'close-grip-bench-press', 'long-pause-bench-press'];

export const archBalance = (exerciseIds: string[], setsById: Record<string, number>, comboRole?: Arch): Record<Arch, number> => {
    const balance: Record<Arch, number> = { press: 0, stretch: 0, adduction: 0 };
    for (const id of exerciseIds) {
        const arch = archOf(id, comboRole);
        if (arch) balance[arch] += setsById[id] ?? 1;
    }
    return balance;
};

/**
 * Balanced means no arch carries less than half of the largest.
 *
 * A ratio rather than a fixed number, because the plan's absolute chest volume
 * moves across its phases and a hard-coded floor would drift out of date.
 */
export const isBalanced = (balance: Record<Arch, number>): boolean => {
    const values = Object.values(balance);
    const largest = Math.max(...values);
    return largest > 0 && Math.min(...values) >= largest / 2;
};

export interface ArchAdjustment {
    /** Sets moved out of pressing, into adduction. Never negative. */
    shiftSets: number;
    from?: Arch;
    to?: Arch;
    message: string;
    requiresConfirmation: boolean;
}

/**
 * When something other than the pecs limits pressing, more pressing is the
 * wrong answer. Shift toward stable adduction, which loads the chest without
 * asking the triceps or the front delt for anything.
 */
export const adjustForLimitingFatigue = (status: CathedralStatus | undefined, week: number): ArchAdjustment => {
    const recent = (status?.limitingFatigue ?? []).filter(entry => entry.week >= week - 2);
    const nonPec = recent.filter(entry => entry.region !== 'chest');

    if (nonPec.length < 2) {
        return { shiftSets: 0, message: 'Pressing is limited by the chest, as intended — no change.', requiresConfirmation: false };
    }

    return {
        shiftSets: 2,
        from: 'press',
        to: 'adduction',
        message: `${nonPec[nonPec.length - 1].region} has limited your pressing twice recently. Move two pressing sets to stable adduction work?`,
        requiresConfirmation: true,
    };
};

/**
 * The chest profile shown on the dashboard: one combined picture, with the
 * limiting factor still visible rather than averaged away.
 */
export const chestProfile = (balance: Record<Arch, number>, status?: CathedralStatus) => ({
    balance,
    balanced: isBalanced(balance),
    totalSets: balance.press + balance.stretch + balance.adduction,
    limitingFatigue: status?.limitingFatigue?.[status.limitingFatigue.length - 1]?.region,
});
