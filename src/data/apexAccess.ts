export const APEX_REGIONS = ['ankle', 'hipFlexion', 'hipRotation', 'shoulderFlexion', 'shoulderRotation', 'thoracicRotation'] as const;
export type ApexRegion = typeof APEX_REGIONS[number];

export type ApexAccessMovement = {
    exerciseId: string;
    equipment: string[];
    unilateral: boolean;
    maxRomLevel: number;
    romCues: [string, ...string[]];
};

export const APEX_ACCESS: Record<ApexRegion, ApexAccessMovement[]> = {
    ankle: [{ exerciseId: 'loaded-ankle-rock', equipment: ['dumbbell', 'plate'], unilateral: true, maxRomLevel: 3, romCues: ['Knee to toes', 'Knee beyond toes with heel down', 'Increase controlled reach'] }],
    hipFlexion: [{ exerciseId: 'knee-over-toe-split-squat', equipment: ['bodyweight', 'dumbbell'], unilateral: true, maxRomLevel: 3, romCues: ['Comfortable depth', 'Deeper with full foot', 'Full controlled depth'] }],
    hipRotation: [{ exerciseId: 'loaded-90-90-transition', equipment: ['bodyweight', 'plate'], unilateral: false, maxRomLevel: 3, romCues: ['Hands supported', 'No hand support', 'Light counterweight'] }],
    shoulderFlexion: [{ exerciseId: 'wall-slide', equipment: ['bodyweight', 'bands'], unilateral: false, maxRomLevel: 3, romCues: ['Comfortable wall range', 'Reach higher without rib flare', 'Band-resisted full range'] }],
    shoulderRotation: [{ exerciseId: 'single-arm-external-rotation', equipment: ['cable'], unilateral: true, maxRomLevel: 3, romCues: ['Elbow supported', 'Increase controlled range', 'Full range with pause'] }],
    thoracicRotation: [
        { exerciseId: 'open-book-rotation', equipment: ['bodyweight'], unilateral: true, maxRomLevel: 3, romCues: ['Short comfortable arc', 'Reach toward floor', 'Full controlled arc'] },
        { exerciseId: 'half-kneeling-rotational-row', equipment: ['cable'], unilateral: true, maxRomLevel: 3, romCues: ['Small trunk turn', 'Controlled full turn', 'Full turn with pause'] },
    ],
};

