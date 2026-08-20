/**
 * Free-attendance rotation: sessions advance as they are completed, not by
 * weekday. Caps and gaps are the only things that hold a session back.
 */

export interface RotationPolicy {
    /** Maximum sessions in any rolling 7-day window. */
    capPer7Days: number;
    /** Minimum hours since the last session (e.g. 36 for every-other-day). */
    minHoursBetween?: number;
    /**
     * How many training days sit on the automatic deck. Later training days
     * in definition order are optional (Arms Race Go Nuclear).
     */
    trainingDays?: number;
}

export type RotationGate =
    | { allowed: true }
    | { allowed: false; reason: string };

const DAY_MS = 86_400_000;

export const sessionsInLastDays = (dates: string[], now: Date, windowDays = 7): number => {
    const cutoff = now.getTime() - windowDays * DAY_MS;
    return dates.filter(value => {
        const ms = new Date(value).getTime();
        return Number.isFinite(ms) && ms > cutoff;
    }).length;
};

export const hoursSinceLatest = (dates: string[], now: Date): number | null => {
    const latest = dates
        .map(value => new Date(value).getTime())
        .filter(ms => Number.isFinite(ms))
        .sort((a, b) => b - a)[0];
    if (latest == null) return null;
    return (now.getTime() - latest) / 3_600_000;
};

export const canStartRotationSession = (
    policy: RotationPolicy,
    sessionDates: string[],
    now = new Date(),
): RotationGate => {
    const recent = sessionsInLastDays(sessionDates, now);
    if (recent >= policy.capPer7Days) {
        return { allowed: false, reason: `This plan caps at ${policy.capPer7Days} sessions in 7 days.` };
    }
    if (policy.minHoursBetween) {
        const hours = hoursSinceLatest(sessionDates, now);
        if (hours != null && hours < policy.minHoursBetween) {
            return { allowed: false, reason: `Wait ${policy.minHoursBetween} hours between sessions.` };
        }
    }
    return { allowed: true };
};

/** Next deck index from completed-session count — weekday-agnostic. */
export const nextDeckIndex = (completedSessions: number, deckLength: number): number => {
    if (deckLength <= 0) return 0;
    return ((completedSessions % deckLength) + deckLength) % deckLength;
};
