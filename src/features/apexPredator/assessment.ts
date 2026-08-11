import { APEX_ACCESS, APEX_REGIONS, type ApexRegion } from '../../data/apexAccess';

export type ApexPain = 'none' | 'discomfort' | 'pain';
export type ApexRegionResult = { left?: number | null; right?: number | null; score?: 1 | 2 | 3 | null; pain: ApexPain; skipped?: boolean };
export type ApexAssessment = { week: 0 | 4 | 8 | 12; date: string; regions: Partial<Record<ApexRegion, ApexRegionResult>>; squatScreen?: string; videoAdvice?: ApexVideoAdvice[] };
export type ApexVideoAdvice = { lift: 'squat' | 'bench' | 'deadlift'; summary: string; observations: string[]; suggestions: string[]; confidence: 'low' | 'medium' | 'high' };

const thresholds: Record<ApexRegion, [number, number]> = {
    ankle: [8, 10], hipFlexion: [70, 85], hipRotation: [30, 40],
    shoulderFlexion: [150, 170], shoulderRotation: [60, 80], thoracicRotation: [35, 50],
};

export const validRegionScore = (result?: ApexRegionResult, region?: ApexRegion): number | null => {
    if (!result || result.skipped || result.pain === 'pain') return null;
    if (result.score) return result.score;
    const values = [result.left, result.right].filter((n): n is number => typeof n === 'number' && Number.isFinite(n));
    if (!values.length) return null;
    const exact = values.reduce((a, b) => a + b, 0) / values.length;
    if (!region) return exact;
    const [low, high] = thresholds[region];
    return exact < low ? 1 : exact < high ? 2 : 3;
};

export const selectApexEmphasis = (assessment: ApexAssessment, previous: ApexRegion[] = []): [ApexRegion, ApexRegion] => {
    const valid = APEX_REGIONS.map(region => ({ region, result: assessment.regions[region], score: validRegionScore(assessment.regions[region], region) }))
        .filter((item): item is typeof item & { score: number } => item.score !== null);
    if (valid.length < 3) return ['ankle', 'thoracicRotation'];
    valid.sort((a, b) => a.score - b.score
        || asymmetry(b.result) - asymmetry(a.result)
        || Number(previous.includes(a.region)) - Number(previous.includes(b.region))
        || APEX_REGIONS.indexOf(a.region) - APEX_REGIONS.indexOf(b.region));
    return [valid[0].region, valid[1].region];
};

const asymmetry = (result?: ApexRegionResult) => typeof result?.left === 'number' && typeof result.right === 'number' ? Math.abs(result.left - result.right) : 0;

export const accessExercisesFor = (regions: ApexRegion[]) => regions.slice(0, 2).map(region => APEX_ACCESS[region][0]);

export const nextRomLevel = (current: number, controlled: boolean, cap: number): number =>
    controlled ? Math.min(cap, Math.max(1, current) + 1) : Math.max(1, current);
