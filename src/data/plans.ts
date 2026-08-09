
import type { PlanConfig } from '../types';
import { BENCH_DOMINATION_CONFIG } from './program';
import { PENCILNECK_CONFIG } from './pencilneck';
import { SKELETON_CONFIG } from './skeleton';
import { PEACHY_CONFIG } from './peachy';
import { PAIN_GLORY_CONFIG } from './painglory';
import { TRINARY_CONFIG } from './trinary';
import { RITUAL_CONFIG } from './ritual';
import { SUPER_MUTANT_CONFIG } from './supermutant';
import { ADVENTURE_CONFIG } from './adventure';
import { KING_OF_THE_SQUAT_CONFIG } from './plans/kingOfTheSquat';
import { GRAVITY_IS_OPTIONAL_CONFIG } from './plans/gravityIsOptional';
import { ACCUMULATE_INTENSIFY_CONFIG } from './plans/accumulateIntensify';
import { THE_WEAKEST_LINK_CONFIG } from './plans/theWeakestLink';
import { OVERHEAD_DOMINION_CONFIG } from './plans/overheadDominion';
import { HAMSTRING_FOUNDRY_CONFIG } from './plans/hamstringFoundry';
import { ARMS_RACE_CONFIG } from './plans/armsRace';
import { UPPER_BODY_SQUAT_CONFIG } from './plans/upperBodySquat';
import { NEURAL_OVERLOAD_CONFIG } from './plans/neuralOverload';
import { TENFOLD_CONFIG } from './plans/tenfold';

export const PLAN_REGISTRY: Record<string, PlanConfig> = {
    [BENCH_DOMINATION_CONFIG.id]: BENCH_DOMINATION_CONFIG,
    [PENCILNECK_CONFIG.id]: PENCILNECK_CONFIG,
    [SKELETON_CONFIG.id]: SKELETON_CONFIG,
    [PEACHY_CONFIG.id]: PEACHY_CONFIG,
    [PAIN_GLORY_CONFIG.id]: PAIN_GLORY_CONFIG,
    [TRINARY_CONFIG.id]: TRINARY_CONFIG,
    [RITUAL_CONFIG.id]: RITUAL_CONFIG,
    [SUPER_MUTANT_CONFIG.id]: SUPER_MUTANT_CONFIG,
    [ADVENTURE_CONFIG.id]: ADVENTURE_CONFIG,
    [KING_OF_THE_SQUAT_CONFIG.id]: KING_OF_THE_SQUAT_CONFIG,
    [GRAVITY_IS_OPTIONAL_CONFIG.id]: GRAVITY_IS_OPTIONAL_CONFIG,
    [ACCUMULATE_INTENSIFY_CONFIG.id]: ACCUMULATE_INTENSIFY_CONFIG,
    [THE_WEAKEST_LINK_CONFIG.id]: THE_WEAKEST_LINK_CONFIG,
    [OVERHEAD_DOMINION_CONFIG.id]: OVERHEAD_DOMINION_CONFIG,
    [HAMSTRING_FOUNDRY_CONFIG.id]: HAMSTRING_FOUNDRY_CONFIG,
    [ARMS_RACE_CONFIG.id]: ARMS_RACE_CONFIG,
    [UPPER_BODY_SQUAT_CONFIG.id]: UPPER_BODY_SQUAT_CONFIG,
    [NEURAL_OVERLOAD_CONFIG.id]: NEURAL_OVERLOAD_CONFIG,
    [TENFOLD_CONFIG.id]: TENFOLD_CONFIG
};

export const getPlan = (id?: string) => {
    if (!id) return BENCH_DOMINATION_CONFIG; // Default fallback
    return PLAN_REGISTRY[id] || BENCH_DOMINATION_CONFIG;
};
