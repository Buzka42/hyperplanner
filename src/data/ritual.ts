import type { Program, ProgramWeek, WorkoutDay, PlanConfig, Exercise, UserProfile, WorkoutLog, SetTarget } from '../types';

// ============ RITUAL OF STRENGTH - Cult-themed 3-day Powerlifting Program ============
// 4-week ramp-in (optional, based on onboarding)
// 12-week main phase (weeks 5-16)
// 3 days/week rotation: Bench ME / Squat ME / Deadlift ME with light work + accessories
// Ascension Tests every 4 weeks, deload auto every 8 weeks + reactive recovery check

// Round down to nearest 2.5kg
const roundDownTo2_5 = (weight: number): number => {
    return Math.floor(weight / 2.5) * 2.5;
};

// Epley formula: e1RM = weight × (1 + reps/30)
export const calculateE1RM = (weight: number, reps: number): number => {
    return roundDownTo2_5(weight * (1 + reps / 30));
};

// Accessory lists by day type
export const RITUAL_ACCESSORIES = {
    bench: ['Rows', 'Rear Delt Flyes', 'Tricep Extensions', 'Face Pulls'],
    squat: ['Ham Curls', 'Leg Extensions', 'Hip Thrusts', 'Calves'],
    deadlift: ['Shrugs', 'Band Pull-Aparts', 'Ab Wheel', 'Planks']
};

// Helper function to update 1RMs after Week 4 Ascension Test
export const updateRitual1RMsFromAscensionTest = (
    _status: any,  // RitualStatus (unused but kept for API compatibility)
    exerciseName: string,
    amrapWeight: number,
    amrapReps: number
): Partial<any> => {  // Partial<RitualStatus>
    const new1RM = roundDownTo2_5(calculateE1RM(amrapWeight, amrapReps));

    if (exerciseName.includes('Bench')) {
        return { benchPress1RM: new1RM };
    } else if (exerciseName.includes('Squat')) {
        return { squat1RM: new1RM };
    } else if (exerciseName.includes('Deadlift')) {
        return { deadlift1RM: new1RM };
    }

    return {};
};

export type RitualStatus = {
    benchPress1RM: number;
    deadlift1RM: number;
    squat1RM: number;
    completedWorkouts: number; //Track total completed workouts
    currentWeek: number;
    isFirstProgram: boolean; // true if ramp-in required
    rampInComplete: boolean;
    weakPointBench?: 'off-chest' | 'mid' | 'lockout';
    weakPointDeadlift?: 'lift-off' | 'over-knees' | 'lockout';
    weakPointSquat?: 'bottom' | 'mid' | 'lockout';
    meProgressionHistory?: { date: string; week: number; lift: 'bench' | 'squat' | 'deadlift'; weight: number; clean: boolean }[];
    lastAscensionWeek?: number;
    lastDeloadWeek?: number;
    selectedDays?: number[]; // User-selected training days (1-7)
    ritualAccessories?: {
        bench?: string[]; // up to 3
        squat?: string[];
        deadlift?: string[];
    };
    // ME progression tracking (RPE-based +5kg increments)
    benchMEProgression?: number;
    squatMEProgression?: number;
    deadliftMEProgression?: number;
};

// Create weeks 1-16 (4 ramp-in + 12 main phase)
// Deload/Purge weeks are triggered dynamically, not pre-allocated
const createRitualWeeks = (): ProgramWeek[] => {
    const weeks: ProgramWeek[] = [];

    for (let w = 1; w <= 16; w++) {
        const days: WorkoutDay[] = [];

        // Determine if this is ramp-in (weeks 1-4) or main phase (5-16)
        const isRampIn = w <= 4;
        const isMainPhase = w >= 5 && w <= 16;

        if (isRampIn) {
            // RAMP-IN: 3 days/week, all competition style, progressive loading
            // Day 1: Bench focus
            days.push({
                dayName: `t:dayNames.ritualDay1RampIn`,
                dayOfWeek: 1,
                exercises: [
                    // Week 4: Ascension Test - 1 AMRAP @ 85% + 3 back-down @ 80%
                    ...(w === 4 ? [
                        {
                            id: `ritual-w${w}-d1-e1-amrap`,
                            name: 'Paused Bench Press (Ascension Test)',
                            sets: 1,
                            target: { type: 'straight', reps: 'AMRAP' },
                            notes: 't:tips.ritualAscensionTest'
                        },
                        {
                            id: `ritual-w${w}-d1-e1-backdown`,
                            name: 'Paused Bench Press (Back-down)',
                            sets: 3,
                            target: { type: 'straight', reps: '5' },
                            notes: 't:tips.ritualBackDown'
                        }
                    ] : [
                        {
                            id: `ritual-w${w}-d1-e1`,
                            name: 'Paused Bench Press',
                            sets: 3,
                            target: { type: 'straight', reps: w === 1 ? '9' : w === 2 ? '6' : '3' },
                            notes: 't:tips.ritualRampIn'
                        }
                    ]),
                    {
                        id: `ritual-w${w}-d1-e2`,
                        name: 'Rows',
                        sets: 3,
                        target: { type: 'range', reps: '10-12' }
                    },
                    {
                        id: `ritual-w${w}-d1-e3`,
                        name: 'Face Pulls',
                        sets: 3,
                        target: { type: 'range', reps: '10-12' }
                    }
                ]
            });

            // Day 2: Squat focus
            days.push({
                dayName: `t:dayNames.ritualDay2RampIn`,
                dayOfWeek: 3,
                exercises: [
                    // Week 4: Ascension Test - 1 AMRAP @ 85% + 3 back-down @ 80%
                    ...(w === 4 ? [
                        {
                            id: `ritual-w${w}-d2-e1-amrap`,
                            name: 'Low Bar Squat (Ascension Test)',
                            sets: 1,
                            target: { type: 'straight' as const, reps: 'AMRAP' },
                            notes: 't:tips.ritualAscensionTest'
                        },
                        {
                            id: `ritual-w${w}-d2-e1-backdown`,
                            name: 'Low Bar Squat (Back-down)',
                            sets: 3,
                            target: { type: 'straight' as const, reps: '5' },
                            notes: 't:tips.ritualBackDown'
                        }
                    ] : [
                        {
                            id: `ritual-w${w}-d2-e1`,
                            name: 'Low Bar Squat',
                            sets: 3,
                            target: { type: 'straight' as const, reps: w === 1 ? '9' : w === 2 ? '6' : '3' },
                            notes: 't:tips.ritualRampIn'
                        }
                    ]),
                    {
                        id: `ritual-w${w}-d2-e2`,
                        name: 'Ham Curls',
                        sets: 3,
                        target: { type: 'range', reps: '10-12' }
                    },
                    {
                        id: `ritual-w${w}-d2-e3`,
                        name: 'Leg Extensions',
                        sets: 3,
                        target: { type: 'range', reps: '10-12' }
                    }
                ]
            });

            // Day 3: Deadlift focus
            days.push({
                dayName: `t:dayNames.ritualDay3RampIn`,
                dayOfWeek: 5,
                exercises: [
                    // Week 4: Ascension Test - 1 AMRAP @ 85% + 3 back-down @ 80%
                    ...(w === 4 ? [
                        {
                            id: `ritual-w${w}-d3-e1-amrap`,
                            name: 'Conventional Deadlift (Ascension Test)',
                            sets: 1,
                            target: { type: 'straight' as const, reps: 'AMRAP' },
                            notes: 't:tips.ritualAscensionTest'
                        },
                        {
                            id: `ritual-w${w}-d3-e1-backdown`,
                            name: 'Conventional Deadlift (Back-down)',
                            sets: 3,
                            target: { type: 'straight' as const, reps: '5' },
                            notes: 't:tips.ritualBackDown'
                        }
                    ] : [
                        {
                            id: `ritual-w${w}-d3-e1`,
                            name: 'Conventional Deadlift',
                            sets: 3,
                            target: { type: 'straight' as const, reps: w === 1 ? '9' : w === 2 ? '6' : '3' },
                            notes: 't:tips.ritualRampIn'
                        }
                    ]),
                    {
                        id: `ritual-w${w}-d3-e2`,
                        name: 'Farmer Holds',
                        sets: 3,
                        target: { type: 'straight', reps: '30sec' },
                        notes: 't:tips.ritualGripWork'
                    },
                    {
                        id: `ritual-w${w}-d3-e3`,
                        name: 'Ab Wheel',
                        sets: 3,
                        target: { type: 'range', reps: '8-12' }
                    }
                ]
            });
        } else if (isMainPhase) {
            const isAscensionWeek = (w - 4) % 4 === 0 && w <= 16; // Weeks 8, 12, 16
            const isPurgeWeekMain = w === 8 || w === 16; // Auto-deload after week 8 and 16

            // Day 1: Bench ME + Squat/Deadlift light
            days.push({
                dayName: isPurgeWeekMain ? `t:dayNames.ritualPurgeDay1` : `t:dayNames.ritualDay1Bench`,
                dayOfWeek: 1,
                exercises: [
                    {
                        id: `ritual-w${w}-d1-e1`,
                        name: isAscensionWeek ? 'Paused Bench Press (Ascension Test)' : 'Paused Bench Press (ME)',
                        sets: isAscensionWeek ? 1 : 1,
                        target: isAscensionWeek ?
                            { type: 'amrap', reps: 'AMRAP' } :
                            { type: 'straight', reps: '1' },
                        notes: isAscensionWeek ? 't:tips.ritualAscensionTest' : 't:tips.ritualMESingle'
                    },
                    ...(isAscensionWeek ? [{
                        id: `ritual-w${w}-d1-e1b`,
                        name: 'Paused Bench Press (Back-down)',
                        sets: 3,
                        target: { type: 'straight', reps: '5' },
                        notes: 't:tips.ritualBackDown'
                    }] : []),
                    {
                        id: `ritual-w${w}-d1-e2`,
                        name: 'Low Bar Squat (Light)',
                        sets: 3,
                        target: { type: 'straight', reps: '5' },
                        notes: 't:tips.ritualLightWork'
                    },
                    {
                        id: `ritual-w${w}-d1-e3`,
                        name: 'Conventional Deadlift (Light)',
                        sets: 3,
                        target: { type: 'straight', reps: '5' },
                        notes: 't:tips.ritualLightWork'
                    }
                    // Accessories added dynamically by user
                ]
            });

            // Day 2: Squat ME + Bench/Deadlift light
            days.push({
                dayName: isPurgeWeekMain ? `t:dayNames.ritualPurgeDay2` : `t:dayNames.ritualDay2Squat`,
                dayOfWeek: 3,
                exercises: [
                    {
                        id: `ritual-w${w}-d2-e1`,
                        name: isAscensionWeek ? 'Low Bar Squat (Ascension Test)' : 'Low Bar Squat (ME)',
                        sets: isAscensionWeek ? 1 : 1,
                        target: isAscensionWeek ?
                            { type: 'amrap', reps: 'AMRAP' } :
                            { type: 'straight', reps: '1' },
                        notes: isAscensionWeek ? 't:tips.ritualAscensionTest' : 't:tips.ritualMESingle'
                    },
                    ...(isAscensionWeek ? [{
                        id: `ritual-w${w}-d2-e1b`,
                        name: 'Low Bar Squat (Back-down)',
                        sets: 3,
                        target: { type: 'straight', reps: '5' },
                        notes: 't:tips.ritualBackDown'
                    }] : []),
                    {
                        id: `ritual-w${w}-d2-e2`,
                        name: 'Paused Bench Press (Light)',
                        sets: 3,
                        target: { type: 'straight', reps: '5' },
                        notes: 't:tips.ritualLightWork'
                    },
                    {
                        id: `ritual-w${w}-d2-e3`,
                        name: 'Conventional Deadlift (Light)',
                        sets: 3,
                        target: { type: 'straight', reps: '5' },
                        notes: 't:tips.ritualLightWork'
                    }
                    // Accessories added dynamically
                ]
            });

            // Day 3: Deadlift ME + Bench/Squat light + grip work
            days.push({
                dayName: isPurgeWeekMain ? `t:dayNames.ritualPurgeDay3` : `t:dayNames.ritualDay3Deadlift`,
                dayOfWeek: 5,
                exercises: [
                    {
                        id: `ritual-w${w}-d3-e1`,
                        name: isAscensionWeek ? 'Conventional Deadlift (Ascension Test)' : 'Conventional Deadlift (ME)',
                        sets: isAscensionWeek ? 1 : 1,
                        target: isAscensionWeek ?
                            { type: 'amrap', reps: 'AMRAP' } :
                            { type: 'straight', reps: '1' },
                        notes: isAscensionWeek ? 't:tips.ritualAscensionTest' : 't:tips.ritualMESingle'
                    },
                    ...(isAscensionWeek ? [{
                        id: `ritual-w${w}-d3-e1b`,
                        name: 'Conventional Deadlift (Back-down)',
                        sets: 3,
                        target: { type: 'straight', reps: '5' },
                        notes: 't:tips.ritualBackDown'
                    }] : []),
                    {
                        id: `ritual-w${w}-d3-e2`,
                        name: 'Paused Bench Press (Light)',
                        sets: 3,
                        target: { type: 'straight', reps: '5' },
                        notes: 't:tips.ritualLightWork'
                    },
                    {
                        id: `ritual-w${w}-d3-e3`,
                        name: 'Low Bar Squat (Light)',
                        sets: 3,
                        target: { type: 'straight', reps: '5' },
                        notes: 't:tips.ritualLightWork'
                    },
                    {
                        id: `ritual-w${w}-d3-e4`,
                        name: 'Farmer Holds',
                        sets: 3,
                        target: { type: 'straight', reps: '20-30sec' },
                        notes: 't:tips.ritualGripWork'
                    }
                    // Accessories added dynamically
                ]
            });
        }

        weeks.push({ weekNumber: w, days });
    }

    return weeks;
};

export const RITUAL_PROGRAM: Program = {
    id: 'ritual-of-strength',
    name: 'Ritual of Strength',
    weeks: createRitualWeeks()
};

export const RITUAL_CONFIG: PlanConfig = {
    id: RITUAL_PROGRAM.id,
    program: RITUAL_PROGRAM,
    ui: {
        dashboardWidgets: ['strength_altar', 'program_status']
    },
    hooks: {
        preprocessDay: (day: WorkoutDay, user: UserProfile): WorkoutDay => {
            const status = (user as any)?.ritualStatus as RitualStatus | undefined;
            if (!status) return day;

            // Skip ramp-in weeks if not first program
            if (!status.isFirstProgram && status.currentWeek <= 4) {
                // Jump to week 5
                const weekData = RITUAL_PROGRAM.weeks.find(w => w.weekNumber === 5);
                if (weekData && weekData.days[day.dayOfWeek - 1]) {
                    return weekData.days[day.dayOfWeek - 1];
                }
            }

            // Apply deload modifications if in purge week
            const isPurgeWeek = status.currentWeek === 9 || status.currentWeek === 17; // After week 8 and 16
            if (isPurgeWeek) {
                return {
                    ...day,
                    exercises: day.exercises.map(ex => ({
                        ...ex,
                        target: {
                            ...ex.target,
                            percentage: ex.target.percentage ? ex.target.percentage * 0.7 : undefined
                        }
                    }))
                };
            }

            // Add user-selected accessories dynamically
            let processedDay = { ...day };

            if (status.ritualAccessories) {
                const dayType = day.dayName.includes('Bench') ? 'bench' :
                    day.dayName.includes('Squat') ? 'squat' :
                        day.dayName.includes('Deadlift') ? 'deadlift' : null;

                if (dayType && status.ritualAccessories[dayType]) {
                    const accessories = status.ritualAccessories[dayType] || [];
                    accessories.forEach((accName, idx) => {
                        processedDay.exercises.push({
                            id: `ritual-acc-${dayType}-${idx}`,
                            name: accName,
                            sets: 3,
                            target: { type: 'range', reps: '10-12' },
                            notes: 't:tips.ritualAccessory'
                        });
                    });
                }
            }

            return processedDay;
        },

        calculateWeight: (_target: SetTarget, user: UserProfile, exerciseName?: string, context?: { week: number; day: number }): string | undefined => {
            const status = (user as any)?.ritualStatus as RitualStatus | undefined;
            if (!status || !exerciseName) return undefined;

            const week = context?.week || status.currentWeek;

            // Determine base 1RM
            let base1RM = 0;
            if (exerciseName.toLowerCase().includes('bench')) {
                base1RM = status.benchPress1RM;
            } else if (exerciseName.toLowerCase().includes('squat')) {
                base1RM = status.squat1RM;
            } else if (exerciseName.toLowerCase().includes('deadlift')) {
                base1RM = status.deadlift1RM;
            }

            if (base1RM <= 0) return undefined;

            // Calculate weight based on exercise type
            let percentage = 1.0;

            // Ramp-in percentages
            if (week <= 4) {
                if (week === 1) percentage = 0.70;
                else if (week === 2) percentage = 0.80;
                else if (week === 3) percentage = 0.90;
                else if (week === 4) percentage = 0.85; // Ascension test
            }
            // Main phase
            else if (week >= 5 && week <= 16) {
                if (exerciseName.includes('(ME)')) {
                    percentage = 0.95; // ME singles work up to 90-100%

                    // Apply accumulated progression from checkbox confirmations
                    let meProgression = 0;
                    if (exerciseName.includes('Bench')) {
                        meProgression = (status as any).benchMEProgression || 0;
                    } else if (exerciseName.includes('Squat')) {
                        meProgression = (status as any).squatMEProgression || 0;
                    } else if (exerciseName.includes('Deadlift')) {
                        meProgression = (status as any).deadliftMEProgression || 0;
                    }

                    const calculatedWeight = roundDownTo2_5(base1RM * percentage);
                    return (calculatedWeight + meProgression).toString();
                } else if (exerciseName.includes('(Light)')) {
                    percentage = 0.70;
                } else if (exerciseName.includes('(Ascension Test)')) {
                    percentage = 0.85;
                } else if (exerciseName.includes('(Back-down)')) {
                    percentage = 0.80; // 80% of AMRAP weight
                }
            }
            // Purge week
            else {
                percentage = 0.70;
            }

            const calculatedWeight = roundDownTo2_5(base1RM * percentage);
            return calculatedWeight.toString();
        },

        getExerciseAdvice: (_exercise: Exercise, _history: WorkoutLog[]): string | null => {
            // No live advice for ME exercises (will use RPE modal instead)
            return null;
        }
        // NOTE: postWorkoutUpdate hook doesn't exist in PlanConfig interface
        // All 1RM update logic is implemented directly in WorkoutView.tsx handleSaveSession() function
    }
};
