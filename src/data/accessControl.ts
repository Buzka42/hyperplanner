import { PLAN_REGISTRY } from './plans';

export const normalizeKeyword = (value: string) => value.trim().toLowerCase();

export const PLAN_OPTIONS = Object.values(PLAN_REGISTRY).map(plan => ({
    id: plan.id,
    name: plan.program.name,
}));

export const ALWAYS_FREE_PLAN_IDS = ['30-minute-adventure'] as const;
export const isAlwaysFreePlan = (planId: string) => (ALWAYS_FREE_PLAN_IDS as readonly string[]).includes(planId);
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
