export interface DensitySet {
    weightKg: number;
    reps: number;
    completed: boolean;
}

export interface DensityResult {
    elapsedSeconds: number;
    completedReps: number;
    volumeKg: number;
    /** Conventional work density: volume divided by elapsed minutes. */
    volumePerMinuteKg: number;
    /** Open-ended gauntlet metric requested by the portfolio specification. */
    timeLoadProduct: number;
}

export const calculateDensity = (sets: DensitySet[], elapsedSeconds: number): DensityResult => {
    const valid = sets.filter(set => set.completed && set.reps > 0 && set.weightKg >= 0);
    const completedReps = valid.reduce((sum, set) => sum + set.reps, 0);
    const volumeKg = valid.reduce((sum, set) => sum + set.weightKg * set.reps, 0);
    const minutes = Math.max(elapsedSeconds, 1) / 60;
    const averageLoad = completedReps > 0 ? volumeKg / completedReps : 0;
    return {
        elapsedSeconds,
        completedReps,
        volumeKg,
        volumePerMinuteKg: Math.round((volumeKg / minutes) * 10) / 10,
        timeLoadProduct: Math.round(minutes * averageLoad * 10) / 10,
    };
};
