import type { PlanPreferences, PlanRunState } from './types';

const DAY_MS = 86_400_000;

/** Calendar-derived, one-based program week. */
export const calendarPlanWeek = (startedAt: string, now: string): number => {
    const elapsedDays = Math.max(0, Math.floor((new Date(now).getTime() - new Date(startedAt).getTime()) / DAY_MS));
    return Math.floor(elapsedDays / 7) + 1;
};

export const requestScheduleMode = (
    preferences: PlanPreferences,
    run: PlanRunState,
    mode: string,
    requestedAt: string,
): PlanPreferences => ({
    ...preferences,
    pendingScheduleChange: {
        mode,
        requestedAt,
        requestedDuringWeek: calendarPlanWeek(run.startedAt, requestedAt),
    },
    updatedAt: requestedAt,
});

/**
 * A requested mode begins only after both the calendar week turns over and the
 * athlete completes the week in which it was requested.
 */
export const applyPendingScheduleMode = (
    preferences: PlanPreferences,
    run: PlanRunState,
    now: string,
): PlanPreferences => {
    const pending = preferences.pendingScheduleChange;
    if (!pending) return preferences;
    const calendarWeek = calendarPlanWeek(run.startedAt, now);
    if (calendarWeek <= pending.requestedDuringWeek || run.completedThroughWeek < pending.requestedDuringWeek) {
        return preferences;
    }
    const { pendingScheduleChange: _pending, ...rest } = preferences;
    return { ...rest, scheduleMode: pending.mode, updatedAt: now };
};

/** A rerun starts a fresh run while retaining the athlete's per-plan choices. */
export const rerunPlan = (previous: PlanRunState, startedAt: string): PlanRunState => ({
    planId: previous.planId,
    startedAt,
    week: 1,
    completedThroughWeek: 0,
});
