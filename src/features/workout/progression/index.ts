/**
 * Registry of per-plan save-time progression handlers.
 *
 * Plans are extracted from `handleSaveSession` one at a time; anything not
 * listed here still runs inline in WorkoutView. Each handler is a pure
 * function verified against the rules in docs/plans/ by `verify:progression`.
 */

import { peachyProgression, pencilneckProgression } from './historyEntries';
import type { ProgressionHandler } from './types';

export * from './types';

export const PROGRESSION_HANDLERS: Record<string, ProgressionHandler> = {
    'peachy-glute-plan': peachyProgression,
    'pencilneck-eradication': pencilneckProgression,
};
