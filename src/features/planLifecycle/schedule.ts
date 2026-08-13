import type { PlanPreferences, PlanRunState } from './types';

const DAY_MS = 86_400_000;

/** Display week: completed sessions win; otherwise calendar. Missing start → week 1. */
export const clampProgramWeek = (opts: {
    startDate?: string;
    completedSessions?: number;
    sessionsPerWeek: number;
    maxWeeks: number;
    now?: string;
}): number => {
    if (typeof opts.completedSessions === 'number' && opts.sessionsPerWeek > 0) {
        return Math.min(opts.maxWeeks, Math.max(1, Math.floor(opts.completedSessions / opts.sessionsPerWeek) + 1));
    }
    return Math.min(opts.maxWeeks, calendarPlanWeek(opts.startDate, opts.now ?? new Date().toISOString()));
};

/** Calendar-derived, one-based program week. */
export const calendarPlanWeek = (startedAt: string | undefined, now: string): number => {
    if (!startedAt) return 1;
    const startMs = new Date(startedAt).getTime();
    const nowMs = new Date(now).getTime();
    if (!Number.isFinite(startMs) || !Number.isFinite(nowMs)) return 1;
    const elapsedDays = Math.max(0, Math.floor((nowMs - startMs) / DAY_MS));
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
