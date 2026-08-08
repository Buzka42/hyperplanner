import { PLAN_REGISTRY } from './plans';
import { ORDERED_PLAN_META } from './planMeta';

export const normalizeKeyword = (value: string) => value.trim().toLowerCase();

/** Plan pickers everywhere; ordered by PLAN_META, named by the plan's own program. */
export const PLAN_OPTIONS = ORDERED_PLAN_META.map(meta => ({
    id: meta.id,
    name: PLAN_REGISTRY[meta.id]?.program.name ?? meta.id,
}));

export const ALWAYS_FREE_PLAN_IDS = ORDERED_PLAN_META.filter(meta => meta.alwaysFree).map(meta => meta.id);
export const isAlwaysFreePlan = (planId: string) => ALWAYS_FREE_PLAN_IDS.includes(planId);
export const withAlwaysFreePlans = (planIds: string[]) => Array.from(new Set([...ALWAYS_FREE_PLAN_IDS, ...planIds]));

export type AccessKey = {
    keyword: string;
    allowedPlanIds: string[];
    active: boolean;
    source: 'admin' | 'public';
    label?: string;
    allowPlanSwitching?: boolean;
    expiresAt?: string | null;
    createdAt: string;
    createdBy?: string;
};

export type OnboardingConfig = {
    generalPlanIds: string[];
    allowPublicKeywordCreation: boolean;
    keywordMinLength: number;
    keywordMaxLength: number;
    defaultExpiryDays: number;
};

export const DEFAULT_ONBOARDING_CONFIG: OnboardingConfig = {
    generalPlanIds: withAlwaysFreePlans(PLAN_OPTIONS.map(plan => plan.id)),
    allowPublicKeywordCreation: true,
    keywordMinLength: 4,
    keywordMaxLength: 32,
    defaultExpiryDays: 0,
};

export const isAccessKeyUsable = (key: AccessKey) =>
    key.active && (!key.expiresAt || new Date(key.expiresAt).getTime() > Date.now());
