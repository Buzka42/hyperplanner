
import type { PlanConfig, Program, ProgramWeek, WorkoutDay, UserProfile, Exercise, WorkoutLog } from '../types';

export const SKELETON_PROGRAM: Program = {
    id: "skeleton-to-threat",
    name: "From Skeleton to Threat",
    weeks: [] // Populated below
};

// 12 Weeks Duration
const createSkeletonWeeks = (): ProgramWeek[] => {
    const weeks: ProgramWeek[] = [];
    for (let w = 1; w <= 12; w++) {
        const days: WorkoutDay[] = [];
        for (let d = 1; d <= 7; d++) {
            days.push({
                id: `sk-w${w}-d${d}`,
                dayName: "t:dayNames.restAndRecovery",
                dayOfWeek: d,
                exercises: []
            });
        }
        weeks.push({ weekNumber: w, days });
    }
    return weeks;
};
SKELETON_PROGRAM.weeks = createSkeletonWeeks();

const SKELETON_CONFIG: PlanConfig = {
    id: SKELETON_PROGRAM.id,
    program: SKELETON_PROGRAM,
    ui: {
        dashboardWidgets: ['skeleton_countdown', 'skeleton_pushup_max', 'skeleton_quotes', 'workout_history']
    },
    hooks: {
        preprocessDay: (day: WorkoutDay, user: UserProfile) => {
            const isTrainingDay = user.selectedDays?.includes(day.dayOfWeek);
            if (!isTrainingDay) return { ...day, dayName: "t:dayNames.restAndRecovery", exercises: [] };

            let w = 1;
            if (day.id) {
                const parts = day.id.split('-');
                if (parts.length >= 2) w = parseInt(parts[1].replace('w', '')) || 1;
            }

            const isLatePhase = w >= 9;
            const getSets = (base: number) => isLatePhase ? base + 1 : base;

            // Updated Exercise List & Order
            const exercises: Exercise[] = [
                // 1. Push-ups Moved to First
                {
                    id: `sk-w${w}-d${day.dayOfWeek}-e6`,
                    name: "Deficit Push-ups",
                    sets: 3,
                    target: { type: "amrap", reps: "AMRAP" }
                },
                {
                    id: `sk-w${w}-d${day.dayOfWeek}-e1`,
                    name: "Leg Extensions",
                    sets: getSets(3),
                    target: { type: "range", reps: "12-20" }
                },
                // 2. Renamed Deadlift
                {
                    id: `sk-w${w}-d${day.dayOfWeek}-e2`,
                    name: "Supported Stiff Legged DB Deadlift",
                    sets: getSets(3),
                    target: { type: "range", reps: "10-15" }
                },
                {
                    id: `sk-w${w}-d${day.dayOfWeek}-e3`,
                    name: "Standing Calf Raises",
                    sets: getSets(3),
                    target: { type: "range", reps: "15-20" }
                },
                {
                    id: `sk-w${w}-d${day.dayOfWeek}-e4`,
                    name: "Inverted Rows",
                    sets: getSets(2),
                    target: { type: "range", reps: "8-15" }
                },
                {
                    id: `sk-w${w}-d${day.dayOfWeek}-e5`,
                    name: "Overhand Mid-Grip Pulldown",
                    sets: getSets(2),
                    target: { type: "range", reps: "10-15" }
                }
            ];

            return { ...day, dayName: `t:dayNames.fullBodyWeek|{"week":${w}}`, exercises };
        },
        calculateWeight: () => undefined,
        getExerciseAdvice: (exercise: Exercise, history: WorkoutLog[]) => {
            if (history.length === 0) return null;

            // Filter logs to find the most recent one where this exercise was performed
            const lastLog = history[0]; // Assuming ordered by date desc

            // Handle both modern and legacy format
            let prevSets: { reps: string; weight: string; completed: boolean }[] = [];

            if (lastLog.exercises) {
                // Modern format
                const prevExData = lastLog.exercises.find(e => e.name === exercise.name);
                if (prevExData) {
                    prevSets = prevExData.setsData.filter(s => s.completed);
                }
            } else if (lastLog.setResults) {
                // Legacy format - convert to string format
                prevSets = lastLog.setResults
                    .filter(s => s.completed)
                    .map(s => ({
                        reps: s.reps.toString(),
                        weight: s.weight.toString(),
                        completed: s.completed
                    }));
            }

            if (prevSets.length === 0) return null;

            // Helper: All sets hit top range?
            const allHit = (reps: number) => {
                if (prevSets.length < exercise.sets) return false;
                // Parse string reps to number
                return prevSets.every(s => parseInt(s.reps || "0") >= reps);
            };

            // 1. Deficit Push-ups
            if (exercise.name === "Deficit Push-ups") {
                const maxReps = Math.max(...prevSets.map(s => parseInt(s.reps || "0")));
                return `Try to beat: ${maxReps} reps this week`;
            }

            // 2. Leg Extensions
            if (exercise.name === "Leg Extensions") {
                // Top range 20
                if (allHit(20)) return "Target reps hit across all sets last week! Add +5 kg";
            }

            // 3. Supported Stiff Legged DB Deadlift
            if (exercise.name === "Supported Stiff Legged DB Deadlift") {
                // Top range 15
                if (allHit(15)) {
                    // Check weight.
                    const maxWeight = Math.max(...prevSets.map(s => parseFloat(s.weight || "0")));
                    if (maxWeight >= 10) return "Target reps hit across all sets last week! Add +2.5 kg";
                    return "Target reps hit across all sets last week! Add +1 kg each dumbbell";
                }
            }

            // 4. Standing Calf Raises / Single Leg
            if (exercise.name === "Standing Calf Raises") {
                if (allHit(20)) return "Target reps hit across all sets last week! Now switch to single-leg";
            }
            if (exercise.name === "Single Leg Calf Raises") {
                if (allHit(20)) return "Target reps hit across all sets last week! Add +5 kg dumbbell";
            }

            // 5. Inverted Rows
            if (exercise.name === "Inverted Rows") {
                if (allHit(15)) return "Target reps hit across all sets last week! Go deeper – decrease angle between legs and floor";
            }

            // 6. Overhand Mid-Grip Pulldown
            if (exercise.name === "Overhand Mid-Grip Pulldown") {
                if (allHit(15)) return "Target reps hit across all sets last week! Add +7 kg";
            }

            return null;
        }
    }
};

export { SKELETON_CONFIG };
