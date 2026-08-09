/**
 * Registry of per-plan save-time progression handlers.
 *
 * Plans are extracted from `handleSaveSession` one at a time; anything not
 * listed here still runs inline in WorkoutView. Each handler is a pure
 * function verified against the rules in docs/plans/ by `verify:progression`.
 */

import { peachyProgression, pencilneckProgression } from './historyEntries';
import { skeletonProgression } from './skeleton';
import { benchDominationProgression } from './benchDomination';
import { painGloryProgression } from './painGlory';
import { ritualProgression } from './ritual';
import { superMutantProgression } from './superMutant';
import { trinaryProgression } from './trinary';
import type { ProgressionHandler } from './types';

export * from './types';

export const PROGRESSION_HANDLERS: Record<string, ProgressionHandler> = {
    'peachy-glute-plan': peachyProgression,
    'pencilneck-eradication': pencilneckProgression,
    'skeleton-to-threat': skeletonProgression,
    'bench-domination': benchDominationProgression,
    'pain-and-glory': painGloryProgression,
    'ritual-of-strength': ritualProgression,
    'super-mutant': superMutantProgression,
    'trinary': trinaryProgression,
};
