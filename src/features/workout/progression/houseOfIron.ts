import type { HouseOfIronStatus } from '../../../types';
import { empty, type ProgressionHandler } from './types';

export const HOUSE_LADDERS: Record<string, string[]> = {
    'goblet-heel-elevated-squat': ['reps', 'rom', 'pause-1s', 'pause-2s', 'eccentric-3s', 'eccentric-4s', 'one-and-half', 'goblet-skater-squat', 'density', 'heavier-equipment'],
    'single-arm-floor-press': ['reps', 'pause-1s', 'pause-2s', 'eccentric-3s', 'eccentric-4s', 'one-and-half', 'glute-bridge-floor-press', 'density', 'heavier-equipment'],
    'bulgarian-split-squat': ['reps', 'rom', 'pause-1s', 'pause-2s', 'eccentric-3s', 'eccentric-4s', 'one-and-half', 'density', 'heavier-equipment'],
    'push-up': ['reps', 'deficit', 'pause-1s', 'eccentric-3s', 'feet-elevated', 'density', 'heavier-equipment'],
    'romanian-deadlift': ['reps', 'rom', 'pause-1s', 'eccentric-3s', 'staggered-stance-rdl', 'single-leg-rdl', 'density', 'heavier-equipment'],
    'staggered-stance-rdl': ['reps', 'rom', 'pause-1s', 'eccentric-3s', 'single-leg-rdl', 'density', 'heavier-equipment'],
    'glute-bridge': ['reps', 'rom', 'pause-1s', 'pause-2s', 'eccentric-3s', 'one-and-half', 'single-leg-glute-bridge', 'density', 'heavier-equipment'],
    'single-arm-dumbbell-row': ['reps', 'rom', 'pause-1s', 'pause-2s', 'eccentric-3s', 'density', 'heavier-equipment'],
    'dumbbell-pullover': ['reps', 'rom', 'pause-1s', 'eccentric-3s', 'density', 'heavier-equipment'],
    'single-arm-standing-press': ['reps', 'pause-1s', 'eccentric-3s', 'one-and-half', 'density', 'heavier-equipment'],
    'goblet-skater-squat': ['reps', 'rom', 'pause-1s', 'pause-2s', 'eccentric-3s', 'one-and-half', 'density', 'heavier-equipment'],
    'supported-sissy-squat': ['reps', 'rom', 'pause-1s', 'eccentric-3s', 'one-and-half', 'density', 'heavier-equipment'],
};

const defaultLadder = ['reps', 'pause-1s', 'eccentric-3s', 'density', 'heavier-equipment'];
const sessionId = (day?: number): 'push-a' | 'pull-a' | 'push-b' | 'pull-b' =>
    day === 2 ? 'pull-a' : day === 3 ? 'push-b' : day === 4 ? 'pull-b' : 'push-a';

const topReps = (reps: string): number | null => {
    const matches = reps.match(/\d+/g);
    return matches?.length ? Number(matches.at(-1)) : null;
};

export const houseOfIronProgression: ProgressionHandler = ctx => {
    if (ctx.isExistingLog || !ctx.workout) return empty();
    const status: HouseOfIronStatus = ctx.user.houseOfIronStatus ?? {};
    const progression = { ...(status.progression ?? {}) };
    const pendingProgressions = { ...(status.pendingProgressions ?? {}) };
    const exerciseImplementIds = { ...(status.exerciseImplementIds ?? {}) };
    const earnedAt = new Date().toISOString();

    for (const exercise of ctx.workout.exercises) {
        const canonicalId = exercise.exerciseId;
        const upper = topReps(exercise.target.reps);
        if (!canonicalId || upper == null || pendingProgressions[canonicalId]) continue;
        const attempted = (ctx.sets[exercise.id] ?? []).slice(0, exercise.sets);
        if (!attempted.some(set => set.completed)) continue;

        if (!exerciseImplementIds[canonicalId] && status.equipment?.length) {
            const usedWeight = Math.max(...attempted.filter(set => set.completed).map(set => Number(set.weight) || 0));
            const exact = status.equipment.filter(item => item.weightKg === usedWeight);
            const chosen = exact.find(item => item.type === status.preferredImplement) ?? exact[0];
            if (chosen) exerciseImplementIds[canonicalId] = chosen.id;
        }

        const cleanTop = attempted.length >= exercise.sets && attempted.every(set =>
            set.completed && Number(set.reps) >= upper && (set.kind == null || set.kind === 'work'),
        );
        const prior = progression[canonicalId] ?? {
            stageIndex: 0, consecutiveStalls: 0, cleanTopRangeExposures: 0,
        };
        const cleanTopRangeExposures = cleanTop ? prior.cleanTopRangeExposures + 1 : 0;
        progression[canonicalId] = { ...prior, cleanTopRangeExposures };

        if (cleanTopRangeExposures >= 2) {
            const ladder = HOUSE_LADDERS[canonicalId] ?? defaultLadder;
            const nextIndex = Math.min(prior.stageIndex + 1, ladder.length - 1);
            pendingProgressions[canonicalId] = { stage: ladder[nextIndex], earnedAt };
            progression[canonicalId] = { ...progression[canonicalId], cleanTopRangeExposures: 0 };
        }
    }

    const history = [...(status.sessionHistory ?? []), { session: sessionId(ctx.day), date: earnedAt }].slice(-64);
    return {
        updates: {
            'houseOfIronStatus.progression': progression,
            'houseOfIronStatus.pendingProgressions': pendingProgressions,
            'houseOfIronStatus.sessionHistory': history,
            'houseOfIronStatus.exerciseImplementIds': exerciseImplementIds,
        },
        appends: [],
        effects: [],
    };
};
