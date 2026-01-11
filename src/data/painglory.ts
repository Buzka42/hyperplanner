import type { Program, ProgramWeek, WorkoutDay, PlanConfig, Exercise, UserProfile, WorkoutLog } from '../types';

// ============ PAIN & GLORY - 16-Week Intermediate Deadlift Specialization ============

const createPainGloryWeeks = (): ProgramWeek[] => {
    const weeks: ProgramWeek[] = [];

    for (let w = 1; w <= 16; w++) {
        const days: WorkoutDay[] = [];

        // ============ PULL DAY 1 (Monday) ============
        const pullDay1Exercises: Exercise[] = [];

        if (w >= 1 && w <= 8) {
            // Weeks 1-8: Deficit Snatch Grip Deadlift
            pullDay1Exercises.push({
                id: `pg-w${w}-d1-e1`,
                name: "Deficit Snatch Grip Deadlift",
                sets: 10,
                target: { type: "straight", reps: "6", percentage: 0.45, percentageRef: "conventionalDeadlift" as keyof import('../types').LiftingStats },
                notes: "t:tips.deficitSnatchGrip"
            });
        } else if (w >= 9 && w <= 12) {
            // Weeks 9-12: Keep Deficit Snatch Grip on first Pull day
            pullDay1Exercises.push({
                id: `pg-w${w}-d1-e1`,
                name: "Deficit Snatch Grip Deadlift",
                sets: 10,
                target: { type: "straight", reps: "6", percentage: 0.45, percentageRef: "conventionalDeadlift" as keyof import('../types').LiftingStats },
                notes: "t:tips.deficitSnatchGrip"
            });
        } else if (w === 13) {
            // Week 13: AMRAP Test
            pullDay1Exercises.push({
                id: `pg-w${w}-d1-e1`,
                name: "Conventional Deadlift (AMRAP)",
                sets: 1,
                target: { type: "amrap", reps: "Max" },
                notes: "t:tips.conventionalDeadliftAMRAP"
            });
            pullDay1Exercises.push({
                id: `pg-w${w}-d1-e1b`,
                name: "Conventional Deadlift (Back-down)",
                sets: 3,
                target: { type: "straight", reps: "5" },
                notes: "t:tips.conventionalDeadliftBackdown"
            });
        } else if (w === 14) {
            // Week 14: Heavy Triple
            pullDay1Exercises.push({
                id: `pg-w${w}-d1-e1`,
                name: "Conventional Deadlift (Heavy Triple)",
                sets: 1,
                target: { type: "straight", reps: "3", rpe: 9 },
                notes: "t:tips.conventionalDeadliftTriple"
            });
            pullDay1Exercises.push({
                id: `pg-w${w}-d1-e1b`,
                name: "Conventional Deadlift (Back-down)",
                sets: 3,
                target: { type: "straight", reps: "3" },
                notes: "t:tips.conventionalDeadliftBackdown"
            });
        } else if (w === 15) {
            // Week 15: Heavy Double
            pullDay1Exercises.push({
                id: `pg-w${w}-d1-e1`,
                name: "Conventional Deadlift (Heavy Double)",
                sets: 1,
                target: { type: "straight", reps: "2", rpe: 9.5 },
                notes: "t:tips.conventionalDeadliftDouble"
            });
            pullDay1Exercises.push({
                id: `pg-w${w}-d1-e1b`,
                name: "Conventional Deadlift (Back-down)",
                sets: 3,
                target: { type: "straight", reps: "2" },
                notes: "t:tips.conventionalDeadliftBackdown"
            });
        } else if (w === 16) {
            // Week 16: Heavy Single (Test Day)
            pullDay1Exercises.push({
                id: `pg-w${w}-d1-e1`,
                name: "Conventional Deadlift (Heavy Single)",
                sets: 1,
                target: { type: "straight", reps: "1", rpe: 10 },
                notes: "t:tips.conventionalDeadliftSingle"
            });
            pullDay1Exercises.push({
                id: `pg-w${w}-d1-e1b`,
                name: "Conventional Deadlift (Optional 2nd Single)",
                sets: 1,
                target: { type: "straight", reps: "1" },
                notes: "t:tips.conventionalDeadliftOptional"
            });
        }

        // Pull Day accessories (all weeks)
        pullDay1Exercises.push(
            {
                id: `pg-w${w}-d1-e2`,
                name: "Close Neutral Grip Lat Pulldown",
                sets: 4,
                target: { type: "range", reps: "6-10" },
                notes: "t:tips.closeNeutralLatPulldown"
            },
            {
                id: `pg-w${w}-d1-e3`,
                name: "Slow Eccentric Cheat Nordic Curls",
                sets: 2,
                target: { type: "failure", reps: "Failure" },
                notes: "t:tips.slowEccentricNordic"
            },
            {
                id: `pg-w${w}-d1-e4`,
                name: "Single-Leg Machine Hip Thrust",
                sets: 3,
                target: { type: "range", reps: "8-12" },
                notes: "t:tips.singleLegHipThrustPG"
            },
            {
                id: `pg-w${w}-d1-e5`,
                name: "Dead Hang + Planks",
                sets: 3,
                target: { type: "failure", reps: "Failure" },
                notes: "t:tips.deadHangPlanks"
            }
        );

        // ============ PUSH DAY 1 (Tuesday) ============
        const pushDay1Exercises: Exercise[] = [
            {
                id: `pg-w${w}-d2-e1`,
                name: "Paused Low Bar Squat",
                sets: 4,
                target: { type: "range", reps: "4-6", percentage: 0.7, percentageRef: "lowBarSquat" as keyof import('../types').LiftingStats },
                notes: "t:tips.pausedLowBarSquat"
            },
            {
                id: `pg-w${w}-d2-e2`,
                name: "Leg Extensions",
                sets: 3,
                target: { type: "range", reps: "6-10" },
                notes: "t:tips.legExtensionsPG"
            },
            {
                id: `pg-w${w}-d2-e3`,
                name: "Hack Squat Calf Raises",
                sets: 3,
                target: { type: "range", reps: "15-20" },
                notes: "t:tips.hackCalfRaisesPG"
            },
            {
                id: `pg-w${w}-d2-e4`,
                name: "Incline DB Bench Press",
                sets: 4,
                target: { type: "range", reps: "6-10" },
                notes: "t:tips.inclineDBBenchPG"
            },
            {
                id: `pg-w${w}-d2-e5`,
                name: "Standing Military Press",
                sets: 3,
                target: { type: "range", reps: "6-10" },
                notes: "t:tips.standingMilitaryPG"
            }
        ];

        // ============ PUSH DAY 2 (Thursday) ============
        const pushDay2Exercises: Exercise[] = [
            {
                id: `pg-w${w}-d4-e1`,
                name: "Paused Low Bar Squat",
                sets: 4,
                target: { type: "range", reps: "4-6", percentage: 0.7, percentageRef: "lowBarSquat" as keyof import('../types').LiftingStats },
                notes: "t:tips.pausedLowBarSquat"
            },
            {
                id: `pg-w${w}-d4-e2`,
                name: "Leg Extensions",
                sets: 3,
                target: { type: "range", reps: "6-10" },
                notes: "t:tips.legExtensionsPG"
            },
            {
                id: `pg-w${w}-d4-e3`,
                name: "Hack Squat Calf Raises",
                sets: 3,
                target: { type: "range", reps: "15-20" },
                notes: "t:tips.hackCalfRaisesPG"
            },
            {
                id: `pg-w${w}-d4-e4`,
                name: "Incline DB Bench Press",
                sets: 4,
                target: { type: "range", reps: "6-10" },
                notes: "t:tips.inclineDBBenchPG"
            },
            {
                id: `pg-w${w}-d4-e5`,
                name: "Standing Military Press",
                sets: 3,
                target: { type: "range", reps: "6-10" },
                notes: "t:tips.standingMilitaryPG"
            }
        ];

        // ============ PULL DAY 2 (Friday) ============
        const pullDay2Exercises: Exercise[] = [];

        if (w >= 1 && w <= 8) {
            // Weeks 1-8: Same as Pull Day 1
            pullDay2Exercises.push({
                id: `pg-w${w}-d5-e1`,
                name: "Deficit Snatch Grip Deadlift",
                sets: 10,
                target: { type: "straight", reps: "6", percentage: 0.45, percentageRef: "conventionalDeadlift" as keyof import('../types').LiftingStats },
                notes: "t:tips.deficitSnatchGrip"
            });
        } else if (w >= 9 && w <= 12) {
            // Weeks 9-12: Conventional Deadlift E2MOM
            pullDay2Exercises.push({
                id: `pg-w${w}-d5-e1`,
                name: "Conventional Deadlift (E2MOM)",
                sets: 6,
                target: { type: "range", reps: "3-5" },
                notes: "t:tips.conventionalE2MOM"
            });
        } else if (w >= 13 && w <= 16) {
            // Weeks 13-16: CAT Conventional Deadlift (70% of Week 13 AMRAP)
            pullDay2Exercises.push({
                id: `pg-w${w}-d5-e1`,
                name: "Conventional Deadlift (CAT)",
                sets: 4,
                target: { type: "straight", reps: "6" },
                notes: "t:tips.conventionalCAT"
            });
        }

        // Pull Day 2 accessories
        pullDay2Exercises.push(
            {
                id: `pg-w${w}-d5-e2`,
                name: "Close Neutral Grip Lat Pulldown",
                sets: 4,
                target: { type: "range", reps: "6-10" },
                notes: "t:tips.closeNeutralLatPulldown"
            },
            {
                id: `pg-w${w}-d5-e3`,
                name: "Slow Eccentric Cheat Nordic Curls",
                sets: 2,
                target: { type: "failure", reps: "Failure" },
                notes: "t:tips.slowEccentricNordic"
            },
            {
                id: `pg-w${w}-d5-e4`,
                name: "Single-Leg Machine Hip Thrust",
                sets: 3,
                target: { type: "range", reps: "8-12" },
                notes: "t:tips.singleLegHipThrustPG"
            },
            {
                id: `pg-w${w}-d5-e5`,
                name: "Dead Hang + Planks",
                sets: 3,
                target: { type: "failure", reps: "Failure" },
                notes: "t:tips.deadHangPlanks"
            }
        );

        // Push Days to the week
        days.push({ dayName: "t:dayNames.pullDay", dayOfWeek: 1, exercises: pullDay1Exercises });
        days.push({ dayName: "t:dayNames.pushDay", dayOfWeek: 2, exercises: pushDay1Exercises });
        days.push({ dayName: "t:dayNames.pushDay", dayOfWeek: 4, exercises: pushDay2Exercises });
        days.push({ dayName: "t:dayNames.pullDay", dayOfWeek: 5, exercises: pullDay2Exercises });

        weeks.push({ weekNumber: w, days });
    }

    return weeks;
};

export const PAIN_GLORY_PROGRAM: Program = {
    id: "pain-and-glory",
    name: "Pain & Glory",
    weeks: createPainGloryWeeks()
};

export const PAIN_GLORY_CONFIG: PlanConfig = {
    id: PAIN_GLORY_PROGRAM.id,
    program: PAIN_GLORY_PROGRAM,
    ui: {
        dashboardWidgets: ['deficit_snatch_tracker']
    },
    hooks: {
        preprocessDay: (day: WorkoutDay, user: UserProfile): WorkoutDay => {
            const weekMatch = day.exercises[0]?.id.match(/w(\d+)/);
            const weekNum = weekMatch ? parseInt(weekMatch[1]) : 1;

            let processedDay = { ...day };

            // Handle peaking weeks weight calculations
            if (weekNum >= 13 && weekNum <= 16) {
                processedDay.exercises = processedDay.exercises.map(ex => {
                    // Handle peaking deadlift weights
                    if (ex.name.includes("Conventional Deadlift") && user.painGloryStatus) {
                        const e1rm = user.painGloryStatus.estimatedE1RM || 0;
                        let targetWeight = 0;

                        if (weekNum === 13 && ex.name.includes("AMRAP")) {
                            // AMRAP weight = highest deficit × 2.22 × 0.85
                            const deficitWeight = user.painGloryStatus.deficitSnatchGripWeight || 0;
                            targetWeight = Math.floor((deficitWeight * 2.22 * 0.85) / 2.5) * 2.5;
                        } else if (weekNum === 13 && ex.name.includes("Back-down")) {
                            // Week 13 backdown: 85% of AMRAP weight
                            const amrapWeight = user.painGloryStatus.amrapWeight || 0;
                            targetWeight = Math.floor((amrapWeight * 0.85) / 2.5) * 2.5;
                        } else if (weekNum === 14 && ex.name.includes("Triple")) {
                            targetWeight = Math.floor((e1rm * 0.90) / 2.5) * 2.5;
                        } else if (weekNum === 14 && ex.name.includes("Back-down")) {
                            const tripleWeight = Math.floor((e1rm * 0.90) / 2.5) * 2.5;
                            targetWeight = Math.floor((tripleWeight * 0.85) / 2.5) * 2.5;
                        } else if (weekNum === 15 && ex.name.includes("Double")) {
                            targetWeight = Math.floor((e1rm * 0.93) / 2.5) * 2.5;
                        } else if (weekNum === 15 && ex.name.includes("Back-down")) {
                            const doubleWeight = Math.floor((e1rm * 0.93) / 2.5) * 2.5;
                            targetWeight = Math.floor((doubleWeight * 0.875) / 2.5) * 2.5;
                        } else if (weekNum === 16 && ex.name.includes("Single")) {
                            targetWeight = Math.floor((e1rm * 0.97) / 2.5) * 2.5;
                        } else if ((weekNum >= 13 && weekNum <= 16) && ex.name.includes("CAT")) {
                            // CAT @ 70% of Week 13 AMRAP weight (weeks 13-16)
                            targetWeight = Math.floor((user.painGloryStatus.amrapWeight || 0) * 0.7 / 2.5) * 2.5;
                        }

                        if (targetWeight > 0) {
                            return { ...ex, target: { ...ex.target, weightAbsolute: targetWeight } };
                        }
                    }
                    return ex;
                });
            }

            return processedDay;
        },

        calculateWeight: (_target, user, exerciseName, context): string | undefined => {
            if (!context) return undefined;
            const weekNum = context.week;

            // ============ DEFICIT SNATCH GRIP DEADLIFT ============
            if (exerciseName === "Deficit Snatch Grip Deadlift") {
                const base1RM = (user.stats as any).conventionalDeadlift || 0;
                if (!base1RM) return undefined;

                // Get current accumulated weight from user profile
                const currentWeight = (user as any).painGloryStatus?.deficitSnatchGripWeight
                    || Math.floor((base1RM * 0.45) / 2.5) * 2.5;

                return currentWeight.toString();
            }

            // ============ CONVENTIONAL DEADLIFT E2MOM (Weeks 9-12) ============
            if (exerciseName === "Conventional Deadlift (E2MOM)") {
                // Start weight = highest deficit × 1.35
                const deficitWeight = (user as any).painGloryStatus?.deficitSnatchGripWeight || 0;
                const e2momAdjustment = (user as any).painGloryStatus?.e2momWeightAdjustment || 0;

                const startWeight = Math.floor((deficitWeight * 1.35) / 2.5) * 2.5;
                const finalWeight = startWeight + e2momAdjustment;

                return finalWeight.toString();
            }

            // ============ PAUSED LOW BAR SQUAT ============
            if (exerciseName === "Paused Low Bar Squat") {
                const squat1RM = (user.stats as any).lowBarSquat || 0;
                if (!squat1RM) return undefined;

                if (weekNum >= 1 && weekNum <= 8) {
                    // Weeks 1-8: Progressive with +2.5kg weekly on success
                    const squatProgress = (user as any).painGloryStatus?.squatProgress || 0;

                    // Week 5 reset: +7.5% of original 1RM
                    let baseWeight = squat1RM * 0.7; // ~70% start
                    if (weekNum >= 5) {
                        baseWeight = (squat1RM * 1.075) * 0.7;
                    }

                    const progressedWeight = baseWeight + squatProgress;
                    return (Math.floor(progressedWeight / 2.5) * 2.5).toString();
                } else {
                    // Weeks 9-16: Fixed weight (maintenance)
                    const week8Weight = (user as any).painGloryStatus?.week8SquatWeight || (squat1RM * 0.85);
                    return (Math.floor(week8Weight / 2.5) * 2.5).toString();
                }
            }

            // ============ CAT DEADLIFT (Weeks 15-16) ============
            if (exerciseName === "Conventional Deadlift (CAT)") {
                const amrapWeight = (user as any).painGloryStatus?.amrapWeight || 0;
                const catWeight = Math.floor((amrapWeight * 0.7) / 2.5) * 2.5;
                return catWeight.toString();
            }

            return undefined;
        },

        getExerciseAdvice: (exercise: Exercise, history: WorkoutLog[]): string | null => {
            // Exercises with automatic progression - don't show manual tips
            const autoProgressExercises = [
                'Paused Low Bar Squat',
                'Conventional Deadlift (E2MOM)',
                'Deficit Snatch Grip Deadlift'
            ];

            if (autoProgressExercises.includes(exercise.name)) {
                return null;
            }

            // Standard accessory progression: hit top reps all sets = +2.5-5kg
            if (exercise.target.type === 'range') {
                const parts = exercise.target.reps.split('-');
                const topRange = parseInt(parts[1] || parts[0]);

                if (history.length > 0) {
                    const last = history[0];
                    if (last.setResults && last.setResults.length >= exercise.sets) {
                        const relevant = last.setResults.slice(0, exercise.sets);
                        const allHit = relevant.every((s: any) => s.reps >= topRange);
                        if (allHit) return "t:tips.increaseWeight";
                    }
                }
            }

            return null;
        }
    }
};
