/**
 * Registry of per-plan save-time progression handlers.
 *
 * Every stateful implemented plan is listed here. Plans without save-time state
 * do not need a handler. Each handler is a pure function verified against the
 * rules in docs/plans/ by `verify:progression`.
 */

import { peachyProgression, pencilneckProgression } from './historyEntries';
import { skeletonProgression } from './skeleton';
import { benchDominationProgression } from './benchDomination';
import { painGloryProgression } from './painGlory';
import { ritualProgression } from './ritual';
import { superMutantProgression } from './superMutant';
import { trinaryProgression } from './trinary';
import { houseOfIronProgression } from './houseOfIron';
import { athenaProgression } from './athena';
import type { ProgressionHandler } from './types';

export * from './types';
export { calibrationProgression, calibrationOutcomes, type CalibrationOutcome } from './calibration';

export const PROGRESSION_HANDLERS: Record<string, ProgressionHandler> = {
    'peachy-glute-plan': peachyProgression,
    'pencilneck-eradication': pencilneckProgression,
    'skeleton-to-threat': skeletonProgression,
    'bench-domination': benchDominationProgression,
    'pain-and-glory': painGloryProgression,
    'ritual-of-strength': ritualProgression,
    'super-mutant': superMutantProgression,
    'trinary': trinaryProgression,
    'house-of-iron': houseOfIronProgression,
    'athena': athenaProgression,
};
