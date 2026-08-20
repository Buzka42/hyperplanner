import type { UserProfile } from '../types';
import { canonicalPlanId } from './planIds';

/**
 * Profile field that holds a plan's own run state. Reset and the Firestore
 * allowlist both derive from this instead of a three-plan hardcoded list.
 * Plans that store choices only in `planPreferences` (Venus, Kali, Atlas, …)
 * are absent here on purpose — reset still clears that map key separately.
 */
export const PLAN_STATUS_FIELD = {
    'bench-domination': 'benchDominationStatus',
    'pencilneck-eradication': 'pencilneckStatus',
    'skeleton-to-threat': 'skeletonStatus',
    'pain-and-glory': 'painGloryStatus',
    trinary: 'trinaryStatus',
    'ritual-of-strength': 'ritualStatus',
    'super-mutant': 'superMutantStatus',
    'house-of-iron': 'houseOfIronStatus',
    'apex-predator': 'apexPredatorStatus',
    athena: 'athenaStatus',
    kali: 'kaliStatus',
    redline: 'redlineStatus',
    'iron-clock': 'ironClockStatus',
    'the-minimum': 'minimumStatus',
    lazarus: 'lazarusStatus',
    quadfather: 'quadfatherStatus',
    cathedral: 'cathedralStatus',
    blackout: 'blackoutStatus',
    atlas: 'atlasStatus',
    'event-horizon': 'eventHorizonStatus',
    'project-chimera': 'projectChimeraStatus',
    oracle: 'oracleStatus',
    'king-of-the-squat': 'kingOfTheSquatStatus',
    'neural-overload': 'neuralOverloadStatus',
    tenfold: 'tenfoldStatus',
} as const satisfies Partial<Record<string, keyof UserProfile>>;

export const statusFieldFor = (planId: string): keyof UserProfile | undefined =>
    PLAN_STATUS_FIELD[canonicalPlanId(planId) as keyof typeof PLAN_STATUS_FIELD];
