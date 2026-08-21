/**
 * Superset ordering.
 *
 * A pair label (`A1`/`A2`) is a promise that the two movements are alternated:
 * a set of one, then a set of the other, then back. The console was picking the
 * next set as "first exercise in the sheet with anything left", which runs A1 to
 * completion before A2 is ever offered — the plan says superset, the athlete
 * gets straight sets.
 *
 * This module is pure so the ordering can be reasoned about without the console:
 * it takes what is prescribed and what is already logged, and returns which slot
 * is next.
 */

export interface SupersetSlot {
    id: string;
    /** `A1`, `B2`, … Absent for straight-set work. */
    pair?: string;
    /** Superset group id when the plan supplies one (blocks, groups). */
    groupId?: string;
    totalSets: number;
    completedSets: number;
}

/**
 * The group two slots share, or undefined when a slot is not supersetted.
 *
 * Derived from the letter, so `A1` and `A2` pair while `A1` and `B1` do not.
 * An explicit group id wins when the plan supplies one.
 */
export const groupKeyOf = (slot: SupersetSlot): string | undefined => {
    if (slot.groupId) return slot.groupId;
    if (!slot.pair) return undefined;
    const letter = slot.pair.trim().match(/^([A-Za-z]+)/)?.[1];
    return letter ? letter.toUpperCase() : undefined;
};

/** Position within the group: A1 before A2. Unlabelled slots sort last. */
const roleOrder = (slot: SupersetSlot): number => {
    const digits = slot.pair?.match(/(\d+)/)?.[1];
    return digits ? Number(digits) : Number.MAX_SAFE_INTEGER;
};

const isFinished = (slot: SupersetSlot) => slot.completedSets >= slot.totalSets;

/**
 * Which slot the console should offer next.
 *
 * Straight sets behave exactly as before — the first slot with work left. A
 * supersetted slot hands over to its partner as soon as the partner is a round
 * behind, which produces A1, A2, A1, A2 … and finishes the group before moving
 * on.
 */
export const nextSlot = (slots: SupersetSlot[]): SupersetSlot | undefined => {
    const pending = slots.filter(slot => !isFinished(slot));
    if (!pending.length) return undefined;

    const leader = pending[0];
    const group = groupKeyOf(leader);
    if (!group) return leader;

    // Everything in the group that still has sets left, in authored order.
    const members = slots
        .filter(slot => groupKeyOf(slot) === group && !isFinished(slot))
        .sort((a, b) => roleOrder(a) - roleOrder(b) || slots.indexOf(a) - slots.indexOf(b));
    if (members.length <= 1) return leader;

    // The member with the fewest completed rounds goes next; ties keep the
    // authored order, so a fresh group opens on A1 rather than wherever the
    // sheet happens to start.
    const fewest = Math.min(...members.map(member => member.completedSets));
    return members.find(member => member.completedSets === fewest) ?? leader;
};

/**
 * Partner slots for display: what the athlete alternates with.
 *
 * Returned in authored order and excluding the slot itself, so the badge can
 * name the partner rather than showing a bare "A1" whose meaning has to be
 * inferred from another row.
 */
export const partnersOf = (slots: SupersetSlot[], id: string): SupersetSlot[] => {
    const slot = slots.find(candidate => candidate.id === id);
    const group = slot && groupKeyOf(slot);
    if (!group) return [];
    return slots
        .filter(candidate => candidate.id !== id && groupKeyOf(candidate) === group)
        .sort((a, b) => roleOrder(a) - roleOrder(b));
};

/** True when a group has more than one member — a lone `A1` is not a superset. */
export const isSupersetted = (slots: SupersetSlot[], id: string): boolean => partnersOf(slots, id).length > 0;

/**
 * Does the set just logged hand straight over to a partner, with no rest?
 *
 * `slots` must already count the logged set, because the answer is about what
 * comes next, not what just happened.
 *
 * This is deliberately asked of the ordering rather than of the label: a pair
 * is not always even. A 4-set A1 against a 3-set A2 alternates for three rounds
 * and then leaves A1 a set on its own — and that last set does rest, because
 * there is no longer anything to move to. Reading `nextSlot` gets that for free,
 * where "is this A1?" would wrongly suppress the rest.
 */
export const handsOffToPartner = (slots: SupersetSlot[], id: string): boolean => {
    const slot = slots.find(candidate => candidate.id === id);
    const group = slot && groupKeyOf(slot);
    if (!group) return false;

    const next = nextSlot(slots);
    return !!next && next.id !== id && groupKeyOf(next) === group;
};
