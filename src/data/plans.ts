
import type { PlanConfig } from '../types';
import { canonicalPlanId } from './planIds';
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
import { PURGATORIO_CONFIG } from './plans/purgatorio';
import { IMMACULATE_RESTRUCTURE_CONFIG } from './plans/immaculateRestructure';
import { OVERHEAD_DOMINION_CONFIG } from './plans/overheadDominion';
import { HAMSTRING_FOUNDRY_CONFIG } from './plans/hamstringFoundry';
import { ARMS_RACE_CONFIG } from './plans/armsRace';
import { WORKHORSE_CONFIG } from './plans/workhorse';
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
    [PURGATORIO_CONFIG.id]: PURGATORIO_CONFIG,
    [IMMACULATE_RESTRUCTURE_CONFIG.id]: IMMACULATE_RESTRUCTURE_CONFIG,
    [OVERHEAD_DOMINION_CONFIG.id]: OVERHEAD_DOMINION_CONFIG,
    [HAMSTRING_FOUNDRY_CONFIG.id]: HAMSTRING_FOUNDRY_CONFIG,
    [ARMS_RACE_CONFIG.id]: ARMS_RACE_CONFIG,
    [WORKHORSE_CONFIG.id]: WORKHORSE_CONFIG,
    [NEURAL_OVERLOAD_CONFIG.id]: NEURAL_OVERLOAD_CONFIG,
    [TENFOLD_CONFIG.id]: TENFOLD_CONFIG
};

export const getPlan = (id?: string) => {
    if (!id) return BENCH_DOMINATION_CONFIG; // Default fallback
    return PLAN_REGISTRY[canonicalPlanId(id)!] || BENCH_DOMINATION_CONFIG;
};

export { LEGACY_PLAN_IDS, canonicalPlanId } from './planIds';
