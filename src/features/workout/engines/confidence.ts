export type TransferDistance = 'exact' | 'close-variation' | 'same-pattern' | 'same-muscle';
export type TransferConfidence = 'high' | 'medium' | 'low' | 'expired';

const BASE: Record<TransferDistance, number> = {
    exact: 1,
    'close-variation': 0.8,
    'same-pattern': 0.6,
    'same-muscle': 0.4,
};

export interface TransferConfidenceInput {
    distance: TransferDistance;
    sourceDate: string;
    now?: string;
    equipmentChanged?: boolean;
    detrainingReported?: boolean;
}

export const transferConfidence = (input: TransferConfidenceInput): { score: number; confidence: TransferConfidence } => {
    const ageDays = Math.max(0, (new Date(input.now ?? Date.now()).getTime() - new Date(input.sourceDate).getTime()) / 86_400_000);
    let score = BASE[input.distance];
    // Full confidence through the requested three-month history horizon, then
    // a gradual decay rather than an arbitrary cliff.
    if (ageDays > 90) score *= Math.max(0, 1 - (ageDays - 90) / 180);
    if (input.equipmentChanged) score *= 0.7;
    if (input.detrainingReported) score *= 0.6;
    score = Math.round(score * 100) / 100;
    const confidence: TransferConfidence = score >= 0.8 ? 'high' : score >= 0.55 ? 'medium' : score >= 0.25 ? 'low' : 'expired';
    return { score, confidence };
};
