export interface PendingScheduleChange {
    mode: string;
    requestedAt: string;
    requestedDuringWeek: number;
}

export interface PlanPreferences {
    scheduleMode: string;
    exerciseSelections: Record<string, string>;
    pendingScheduleChange?: PendingScheduleChange;
    updatedAt: string;
}

export type PlanPreferenceMap = Record<string, PlanPreferences>;

export interface PlanRunState {
    planId: string;
    startedAt: string;
    week: number;
    phase?: string;
    completedThroughWeek: number;
}
