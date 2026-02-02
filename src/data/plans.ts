
import type { PlanConfig } from '../types';
import { BENCH_DOMINATION_CONFIG } from './program';
import { PENCILNECK_CONFIG } from './pencilneck';
import { SKELETON_CONFIG } from './skeleton';
import { PEACHY_CONFIG } from './peachy';
import { PAIN_GLORY_CONFIG } from './painglory';
import { TRINARY_CONFIG } from './trinary';
import { RITUAL_CONFIG } from './ritual';
import { SUPER_MUTANT_CONFIG } from './supermutant';

export const PLAN_REGISTRY: Record<string, PlanConfig> = {
    [BENCH_DOMINATION_CONFIG.id]: BENCH_DOMINATION_CONFIG,
    [PENCILNECK_CONFIG.id]: PENCILNECK_CONFIG,
    [SKELETON_CONFIG.id]: SKELETON_CONFIG,
    [PEACHY_CONFIG.id]: PEACHY_CONFIG,
    [PAIN_GLORY_CONFIG.id]: PAIN_GLORY_CONFIG,
    [TRINARY_CONFIG.id]: TRINARY_CONFIG,
    [RITUAL_CONFIG.id]: RITUAL_CONFIG,
    [SUPER_MUTANT_CONFIG.id]: SUPER_MUTANT_CONFIG
};

export const getPlan = (id?: string) => {
    if (!id) return BENCH_DOMINATION_CONFIG; // Default fallback
    return PLAN_REGISTRY[id] || BENCH_DOMINATION_CONFIG;
};
