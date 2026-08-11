
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
import { HOUSE_OF_IRON_CONFIG } from './plans/houseOfIron';
import { APEX_PREDATOR_CONFIG } from './plans/apexPredator';
import { VENUS_RISING_CONFIG } from './plans/venusRising';
import { ATHENA_CONFIG } from './plans/athena';
import { KALI_CONFIG } from './plans/kali';
import { REDLINE_CONFIG } from './plans/redline';
import { IRON_CLOCK_CONFIG } from './plans/ironClock';
import { THE_MINIMUM_CONFIG } from './plans/theMinimum';
import { LAZARUS_CONFIG } from './plans/lazarus';
import { QUADFATHER_CONFIG } from './plans/quadfather';
import { CATHEDRAL_CONFIG } from './plans/cathedral';
import { BLACKOUT_CONFIG } from './plans/blackout';
import { MONOLITH_CONFIG } from './plans/monolith';
import { ATLAS_CONFIG } from './plans/atlas';
import { EVENT_HORIZON_CONFIG } from './plans/eventHorizon';
import { PROJECT_CHIMERA_CONFIG } from './plans/projectChimera';
import { ORACLE_CONFIG } from './plans/oracle';

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
    [TENFOLD_CONFIG.id]: TENFOLD_CONFIG,
    [HOUSE_OF_IRON_CONFIG.id]: HOUSE_OF_IRON_CONFIG,
    [APEX_PREDATOR_CONFIG.id]: APEX_PREDATOR_CONFIG,
    [VENUS_RISING_CONFIG.id]: VENUS_RISING_CONFIG,
    [ATHENA_CONFIG.id]: ATHENA_CONFIG,
    [KALI_CONFIG.id]: KALI_CONFIG,
    [REDLINE_CONFIG.id]: REDLINE_CONFIG,
    [IRON_CLOCK_CONFIG.id]: IRON_CLOCK_CONFIG,
    [THE_MINIMUM_CONFIG.id]: THE_MINIMUM_CONFIG,
    [LAZARUS_CONFIG.id]: LAZARUS_CONFIG,
    [QUADFATHER_CONFIG.id]: QUADFATHER_CONFIG,
    [CATHEDRAL_CONFIG.id]: CATHEDRAL_CONFIG,
    [BLACKOUT_CONFIG.id]: BLACKOUT_CONFIG,
    [MONOLITH_CONFIG.id]: MONOLITH_CONFIG,
    [ATLAS_CONFIG.id]: ATLAS_CONFIG,
    [EVENT_HORIZON_CONFIG.id]: EVENT_HORIZON_CONFIG,
    [PROJECT_CHIMERA_CONFIG.id]: PROJECT_CHIMERA_CONFIG,
    [ORACLE_CONFIG.id]: ORACLE_CONFIG
};

export const getPlan = (id?: string) => {
    if (!id) return BENCH_DOMINATION_CONFIG; // Default fallback
    return PLAN_REGISTRY[canonicalPlanId(id)!] || BENCH_DOMINATION_CONFIG;
};

export { LEGACY_PLAN_IDS, canonicalPlanId } from './planIds';
