/**
 * ATLAS — carries, gauntlets and optional power work.
 *
 * A carry logged as "3 sets of 40 metres" tells you nothing a month later. The
 * metric here is `time × load`, with an optional tag for whatever actually
 * ended the set, because that tag is the thing that decides what to train next.
 */

export type CarryLimiter = 'grip' | 'trunk' | 'breathing' | 'upper-back' | 'legs' | 'none';

export interface CarryResult {
    exerciseId: string;
    seconds: number;
    loadKg: number;
    /** Total load carried, so a two-implement carry is not undercounted. */
    implements: 1 | 2;
    limiter?: CarryLimiter;
}

/** The headline number: kilogram-seconds, reported in kg·min for readability. */
export const carryScore = (result: CarryResult): number =>
    Math.round(((result.loadKg * result.implements * result.seconds) / 60) * 10) / 10;

export const compareCarries = (a: CarryResult, b: CarryResult): 'better' | 'worse' | 'equal' => {
    const [scoreA, scoreB] = [carryScore(a), carryScore(b)];
    return scoreA > scoreB ? 'better' : scoreA < scoreB ? 'worse' : 'equal';
};

/**
 * What to do about a repeated limiter. Advice only — the plan never rewrites
 * the carry on the athlete's behalf.
 */
export const limiterAdvice = (results: CarryResult[]): string | undefined => {
    const recent = results.slice(-3).map(result => result.limiter).filter((limiter): limiter is CarryLimiter => !!limiter && limiter !== 'none');
    if (recent.length < 2) return undefined;
    const [first] = recent;
    if (!recent.every(limiter => limiter === first)) return undefined;

    switch (first) {
        case 'grip': return 'Grip has ended your carries twice. Add a suitcase hold at the end of the session rather than lengthening the carry.';
        case 'trunk': return 'The trunk is the limiter. Keep the load and shorten the carry until position holds for the whole interval.';
        case 'breathing': return 'Breathing is the limiter — that is conditioning, not a strength ceiling. Hold the load and extend gradually.';
        case 'upper-back': return 'The upper back is giving way first. Reduce the load a step and keep the interval honest.';
        case 'legs': return 'Legs are limiting the carry. Treat it as leg work this week and keep the heavy carry away from squat day.';
        default: return undefined;
    }
};

// ---------------------------------------------------------------------------
// Gauntlets
// ---------------------------------------------------------------------------

/**
 * Atlas is two five-week gauntlets rather than ten weeks of one template. The
 * point is mastery: the athlete keeps a movement long enough to get good at it
 * before the second gauntlet swaps the pattern.
 */
export const gauntletFor = (week: number): 1 | 2 => (week <= 5 ? 1 : 2);

/** Approved hinge choices — the plan defaults to trap bar and never insists. */
export const APPROVED_HINGES = ['trap-bar-deadlift', 'conventional-deadlift', 'sumo-deadlift'];

/** Optional power work. Never required, never a progression input. */
export const POWER_POOL = ['kettlebell-swing', 'kettlebell-shoulder-press', 'turkish-get-up'];

export const isPowerWork = (exerciseId: string): boolean => POWER_POOL.includes(exerciseId);
