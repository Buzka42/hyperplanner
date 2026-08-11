import { EXERCISE_BY_ID } from '../../data/exercises/library';
import type { UserProfile, WorkoutDay } from '../../types';
import { HOUSE_LADDERS } from '../workout/progression/houseOfIron';

const CUES: Record<string, string> = {
    rom: 'Use the largest controlled range available.',
    'pause-1s': 'Pause one second in the difficult or lengthened position.',
    'pause-2s': 'Pause two seconds in the difficult or lengthened position.',
    'eccentric-3s': 'Use a controlled three-second eccentric.',
    'eccentric-4s': 'Use a controlled four-second eccentric.',
    'one-and-half': 'Use approved 1.5-rep technique.',
    density: 'Complete equivalent work in less total block time; never rush technique.',
    'heavier-equipment': 'This movement has exhausted its useful fixed-load ladder. A heavier implement would now help.',
    deficit: 'Use a stable deficit for more controlled range.',
    'feet-elevated': 'Use a stable feet-elevated setup.',
    'glute-bridge-floor-press': 'Perform the floor press from a controlled glute-bridge position.',
};

export const applyHouseProgressions = (day: WorkoutDay, user: UserProfile): WorkoutDay => ({
    ...day,
    exercises: day.exercises.map(exercise => {
        const canonicalId = exercise.exerciseId;
        const state = canonicalId ? user.houseOfIronStatus?.progression?.[canonicalId] : undefined;
        if (!canonicalId || !state) return exercise;
        const ladder = HOUSE_LADDERS[canonicalId] ?? ['reps', 'pause-1s', 'eccentric-3s', 'density', 'heavier-equipment'];
        const stage = ladder[Math.min(state.stageIndex, ladder.length - 1)];
        const replacement = EXERCISE_BY_ID[stage];
        const cue = CUES[stage] ?? (replacement ? `Confirmed harder variation: ${replacement.name.en}.` : `Confirmed progression: ${stage}.`);
        const restSeconds = exercise.prescription?.restSeconds;
        return {
            ...exercise,
            ...(replacement && { exerciseId: replacement.id, name: replacement.name.en }),
            notes: [exercise.notes, cue].filter(Boolean).join(' '),
            prescription: {
                ...exercise.prescription,
                ...(stage.startsWith('eccentric-') && { tempo: stage === 'eccentric-4s' ? '40X0' : '30X0' }),
                ...(stage === 'density' && restSeconds && { restSeconds: Math.max(30, Math.round(restSeconds * 0.9)) }),
            },
        };
    }),
});
