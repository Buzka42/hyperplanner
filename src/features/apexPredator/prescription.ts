import type { UserProfile, WorkoutDay } from '../../types';
import { EXERCISE_BY_ID } from '../../data/exercises/library';
import { accessExercisesFor } from './assessment';

export const applyApexAccess = (day: WorkoutDay, user: UserProfile): WorkoutDay => {
    const emphasis = user.apexPredatorStatus?.emphasis?.regions ?? ['ankle', 'thoracicRotation'];
    const access = accessExercisesFor(emphasis);
    let cursor = 0;
    return {
        ...day,
        exercises: day.exercises.flatMap(exercise => {
            if (exercise.exerciseId !== 'apex-access-placeholder') return [exercise];
            const movement = access[cursor++ % access.length];
            const entry = EXERCISE_BY_ID[movement.exerciseId];
            if (!entry) return [];
            const level = user.apexPredatorStatus?.rom?.[entry.id]?.level ?? 1;
            return [{ ...exercise, exerciseId: entry.id, name: entry.name.en, sets: 2, notes: movement.romCues[Math.min(level, movement.romCues.length) - 1] }];
        }),
    };
};

