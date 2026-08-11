import type { SessionSlot } from './types';

export const roundToIncrement = (value: number, incrementKg: number): number => {
    if (incrementKg <= 0) return value;
    return Math.round(value / incrementKg) * incrementKg;
};

export const deriveBackoffLoad = (
    topSetWeightKg: number | undefined,
    reductionPercent: number,
    incrementKg = 2.5,
): number | undefined => {
    if (topSetWeightKg == null || topSetWeightKg <= 0) return undefined;
    return roundToIncrement(topSetWeightKg * (1 - reductionPercent / 100), incrementKg);
};

/**
 * Applies a hard cap without deleting slots. Lowest-priority, unprotected sets
 * are removed first; every slot retains its declared minimum.
 */
export const enforceSetCap = (slots: SessionSlot[], cap: number): SessionSlot[] => {
    const result = slots.map(slot => ({ ...slot }));
    let total = result.reduce((sum, slot) => sum + slot.sets, 0);
    const removable = [...result].sort((a, b) =>
        Number(a.protected) - Number(b.protected) || a.priority - b.priority,
    );
    while (total > cap) {
        const slot = removable.find(candidate => candidate.sets > (candidate.minimumSets ?? 1));
        if (!slot) throw new Error(`Set cap ${cap} cannot preserve declared minimums.`);
        slot.sets -= 1;
        total -= 1;
    }
    return result;
};
