
import type { Program, ProgramWeek, WorkoutDay, PlanConfig, Exercise } from '../types';

const createPeachyWeeks = (): ProgramWeek[] => {
    const weeks: ProgramWeek[] = [];
    for (let w = 1; w <= 12; w++) {
        const days: WorkoutDay[] = [];

        // Monday
        const d1: Exercise[] = [
            { id: `py-w${w}-d1-e1`, name: "Sumo Deadlift", sets: 3, target: { type: "range", reps: "5-8" } },
            { id: `py-w${w}-d1-e2`, name: "Front-Foot Elevated Bulgarian Split Squat", sets: 3, target: { type: "range", reps: "8-12" } },
            { id: `py-w${w}-d1-e3`, name: "Squats", sets: 3, target: { type: "range", reps: "5-10" } },
            { id: `py-w${w}-d1-e4`, name: "Seated Hamstring Curl", sets: 3, target: { type: "range", reps: "8-12" } },
            { id: `py-w${w}-d1-e5`, name: "Hack Squat Calf Raises", sets: 3, target: { type: "range", reps: "15-20" } }
        ];

        // Wednesday
        const d3: Exercise[] = [
            { id: `py-w${w}-d3-e1`, name: "Kas Glute Bridge", sets: 3, target: { type: "range", reps: "8-12" } },
            { id: `py-w${w}-d3-e2`, name: "45-Degree Hyperextension", sets: 2, target: { type: "range", reps: "15-20" } },
            { id: `py-w${w}-d3-e3`, name: "Standing Military Press", sets: 2, target: { type: "range", reps: "8-12" } },
            { id: `py-w${w}-d3-e4`, name: "Incline DB Bench Press (45°)", sets: 2, target: { type: "range", reps: "8-12" } },
            { id: `py-w${w}-d3-e5`, name: "Inverted Rows", sets: 3, target: { type: "range", reps: "8-12" } },
            { id: `py-w${w}-d3-e6`, name: "Side-Lying Rear Delt Fly", sets: 3, target: { type: "range", reps: "12-15" } }
        ];

        // Friday
        const d5: Exercise[] = [
            { id: `py-w${w}-d5-e1`, name: "DB Romanian Deadlift", sets: 3, target: { type: "range", reps: "5-8" } },
            { id: `py-w${w}-d5-e2`, name: "Paused Squat", sets: 3, target: { type: "range", reps: "5-10", percentage: 0.8, percentageRef: 'squat' } },
            { id: `py-w${w}-d5-e3`, name: "Glute Ham Raise (eccentric only)", sets: 3, target: { type: "failure", reps: "Failure" } },
            { id: `py-w${w}-d5-e4`, name: "Hip Adduction", sets: 3, target: { type: "range", reps: "8-12" } },
            { id: `py-w${w}-d5-e5`, name: "Leg Press Calf Raises", sets: 3, target: { type: "range", reps: "15-20" } }
        ];

        // Saturday
        const d6: Exercise[] = [
            { id: `py-w${w}-d6-e1`, name: "Deficit Reverse Lunge", sets: 2, target: { type: "range", reps: "8-12" } },
            { id: `py-w${w}-d6-e2`, name: "Single Leg Machine Hip Thrust", sets: 3, target: { type: "range", reps: "12-15" } },
            { id: `py-w${w}-d6-e3`, name: "Deficit Push-ups", sets: 3, target: { type: "amrap", reps: "Max" } },
            { id: `py-w${w}-d6-e4`, name: "Assisted Pull-ups", sets: 2, target: { type: "amrap", reps: "Max" } },
            { id: `py-w${w}-d6-e5`, name: "Y-Raises", sets: 2, target: { type: "range", reps: "12-15" } },
            { id: `py-w${w}-d6-e6`, name: "Lying Cable Lat Raises", sets: 3, target: { type: "range", reps: "12-15" } }
        ];

        // Specific condition for Week 12 Glute Pump Finisher
        if (w === 12) {
            d6.push({ id: `py-w${w}-d6-e7`, name: "Glute Pump Finisher", sets: 1, target: { type: "range", reps: "100" } });
        }

        days.push({ dayName: "t:dayNames.mondayGluteLegHeavy", dayOfWeek: 1, exercises: d1 });
        days.push({ dayName: "t:dayNames.wednesdayGluteUpperPump", dayOfWeek: 3, exercises: d3 });
        days.push({ dayName: "t:dayNames.fridayPosteriorChain", dayOfWeek: 5, exercises: d5 });
        days.push({ dayName: "t:dayNames.saturdayUnilateralPump", dayOfWeek: 6, exercises: d6 });

        weeks.push({ weekNumber: w, days });
    }
    return weeks;
}

export const PEACHY_PROGRAM: Program = {
    id: "peachy-glute-plan",
    name: "Peachy",
    weeks: createPeachyWeeks()
};

export const PEACHY_CONFIG: PlanConfig = {
    id: PEACHY_PROGRAM.id,
    program: PEACHY_PROGRAM,
    ui: {
        dashboardWidgets: ['glute_tracker', 'strength_chart', 'workout_history']
    },
    hooks: {
        preprocessDay: (day) => {
            const weekNum = parseInt(day.exercises[0]?.id.split('-')[1].replace('w', '') || "1");

            let processedDay = { ...day };

            // Drop sets logic for Weeks 9-12
            if (weekNum >= 9) {
                processedDay.exercises = processedDay.exercises.map(ex => {
                    if (ex.name === "Front-Foot Elevated Bulgarian Split Squat" || ex.name === "Deficit Reverse Lunge") {
                        return { ...ex, intensityTechnique: "LAST SET: Drop to Bodyweight - Go to Failure" };
                    }
                    return ex;
                });
            }
            return processedDay;
        },
        calculateWeight: (target, user, exerciseName, context) => {
            // Paused Squat (Thursday/Friday): 80% of same week's Monday Squat
            if (exerciseName === "Paused Squat" && context && user.squatHistory) {
                // Find Monday's log for this week
                const historyEntry = user.squatHistory.find(h => h.week === context.week);
                if (historyEntry) {
                    const base = historyEntry.weight;
                    const p = target.percentage || 0.8;
                    // "Round it down to 2.5kg" -> Floor
                    return (Math.floor((base * p) / 2.5) * 2.5).toString();
                }
            }

            if (target.percentageRef === 'squat' && user.stats.squat) {
                return (Math.round((user.stats.squat * (target.percentage || 1)) / 2.5) * 2.5).toString();
            }
            return undefined;
        },
        getExerciseAdvice: (ex, history) => {
            // Special case for Squats (3x10 progression)
            if (ex.name === "Squats" && history.length > 0) {
                const last = history[0];
                if (last.setResults && last.setResults.length >= 3 && last.setResults.slice(0, 3).every(s => s.reps >= 10)) {
                    return "You hit 3x10 last week! +2.5kg now.";
                }
            }

            // General range-based progression for all other exercises
            if (ex.target.type === 'range') {
                const parts = ex.target.reps.split('-');
                const topRange = parseInt(parts[1] || parts[0]);

                if (history.length > 0) {
                    const last = history[0];
                    if (last.setResults && last.setResults.length >= ex.sets) {
                        const relevant = last.setResults.slice(0, ex.sets);
                        const allHit = relevant.every((s: any) => s.reps >= topRange);
                        if (allHit) return "Increase Weight!";
                    }
                }
            }
            return null;
        }
    }
}
