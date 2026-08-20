import type { UserProfile } from '../../types';

export type TrackedLift = {
    title: string;
    history: { date: string; weight: number }[];
    startKg?: number;
};

const asHistory = (entries: { date?: string; weight?: number }[] | undefined) =>
    (entries ?? []).map(entry => ({ date: entry.date ?? '', weight: entry.weight ?? 0 }));

/**
 * The lift a plan's strength chart follows, or undefined when it has none.
 *
 * This used to fall back to the paused bench for any plan not named below,
 * which meant Purgatorio, Pencilneck and Tenfold all showed a Bench Domination
 * widget on their dashboards. A plan without a single headline lift should show
 * no chart rather than somebody else's.
 */
export const trackedLiftFor = (planId: string, user: UserProfile): TrackedLift | undefined => {
    const loads = user.workingLoads?.[planId] ?? {};
    const bench = asHistory(user.benchHistory);
    const squat = asHistory(user.squatHistory);

    switch (planId) {
        case 'peachy-glute-plan':
            return { title: 'Squat', history: squat, startKg: user.stats.squat };
        case 'king-of-the-squat':
        case 'athena':
            return { title: 'Squat', history: squat, startKg: user.stats.squat ?? user.stats.lowBarSquat };
        case 'overhead-dominion':
            return { title: 'Standing press', history: asHistory(user.liftHistory?.standingPress), startKg: user.stats.standingPress ?? loads['standing-barbell-military-press'] };
        case 'workhorse':
        case 'gravity-is-optional':
        case 'neural-overload':
            return { title: 'Chin belt', history: asHistory(user.liftHistory?.chinBelt), startKg: loads['weighted-chin-up'] };
        case 'hamstring-foundry':
            return { title: 'RDL', history: asHistory(user.liftHistory?.rdl), startKg: loads['barbell-romanian-deadlift'] };
        case 'cathedral':
            return { title: 'Incline DB', history: asHistory(user.liftHistory?.inclineDb), startKg: loads['incline-dumbbell-bench-press'] };
        case 'quadfather':
            return { title: 'Hack squat', history: asHistory(user.liftHistory?.hackSquat), startKg: loads['hack-squat'] };
        case 'arms-race':
            return { title: 'Curl / close-grip', history: asHistory(user.liftHistory?.curl), startKg: loads['standing-straight-bar-curl'] };
        case 'immaculate-restructure':
            return { title: 'Lagging lift', history: asHistory(user.liftHistory?.lagging), startKg: loads['close-grip-bench-press'] };
        case 'bench-domination':
            return { title: 'Paused bench', history: bench, startKg: user.stats.pausedBench };
        default:
            return undefined;
    }
};
