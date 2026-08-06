import { PLAN_REGISTRY } from './plans';

export const normalizeKeyword = (value: string) => value.trim().toLowerCase();

export const PLAN_OPTIONS = Object.values(PLAN_REGISTRY).map(plan => ({
    id: plan.id,
    name: plan.program.name,
}));

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
    generalPlanIds: PLAN_OPTIONS.map(plan => plan.id),
    allowPublicKeywordCreation: true,
    keywordMinLength: 4,
    keywordMaxLength: 32,
    defaultExpiryDays: 0,
};

export const isAccessKeyUsable = (key: AccessKey) =>
    key.active && (!key.expiresAt || new Date(key.expiresAt).getTime() > Date.now());
