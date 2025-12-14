
import type { PlanConfig, Program, ProgramWeek, WorkoutDay, UserProfile, Exercise, WorkoutLog } from '../types';

const COMPOUND_EXERCISES = new Set([
    "Flat Barbell Bench Press",
    "Incline DB Press (45°)",
    "Incline Barbell Bench Press (45°)",
    "Flat DB Press",
    "Seated DB Shoulder Press",
    "Standing Barbell Military Press",
    "Close-Grip Bench Press",
    "Hammer Pulldown (Underhand)",
    "Seated Cable Row",
    "Wide-Grip Seated Row",
    "Single-Arm Hammer Strength Row",
    "Single-Arm DB Row",
    "Lat Pulldown (Neutral)",
    "Romanian Deadlift",
    "Stiff-Legged Deadlift",
    "Hack Squat",
    "Front Squats",
    "Walking Lunges (DB)"
]);

// 8 Weeks Duration
const generatePencilneckWeeks = (): ProgramWeek[] => {
    const weeks: ProgramWeek[] = [];
    // Weeks 1-8
    for (let w = 1; w <= 8; w++) {
        weeks.push({
            weekNumber: w,
            days: [
                {
                    dayName: "Push A (Chest/Delts/Tri/Quads)",
                    dayOfWeek: 1,
                    exercises: [
                        { id: `pn-w${w}-d1-e1`, name: "Flat Barbell Bench Press", sets: 3, target: { type: "range", reps: "8-12" } },
                        { id: `pn-w${w}-d1-e2`, name: "Incline DB Press (45°)", sets: 3, target: { type: "range", reps: "10-14" }, notes: "Upper chest focus. Slight elbow tuck, full stretch." },
                        { id: `pn-w${w}-d1-e3`, name: "Cable Flyes (mid height)", sets: 3, target: { type: "range", reps: "12-15" } },
                        { id: `pn-w${w}-d1-e4`, name: "Seated DB Shoulder Press", sets: 3, target: { type: "range", reps: "8-12" } },
                        { id: `pn-w${w}-d1-e5`, name: "Lying Lateral Raises", sets: 3, target: { type: "range", reps: "15-20" }, notes: "Pull ‘away’ from body, not up." },
                        { id: `pn-w${w}-d1-e6`, name: "Overhead Tricep Extensions", sets: 3, target: { type: "range", reps: "12-15" } },
                        { id: `pn-w${w}-d1-e7`, name: "Hack Squat", sets: 3, target: { type: "range", reps: "10-15" }, alternates: ["Leg Press"] },
                        { id: `pn-w${w}-d1-e8`, name: "Leg Extensions", sets: 3, target: { type: "range", reps: "15-20" } },
                        { id: `pn-w${w}-d1-e9`, name: "Leg Press Calf Raises", sets: 3, target: { type: "range", reps: "12-18" }, notes: "Full stretch, explode up, stop 0–1 rep shy." }
                    ]
                },
                {
                    dayName: "Pull A (Back/Rear Delt/Bi/Hams)",
                    dayOfWeek: 2,
                    exercises: [
                        { id: `pn-w${w}-d2-e1`, name: "Hammer Pulldown (Underhand)", sets: 3, target: { type: "range", reps: "8-12" } },
                        { id: `pn-w${w}-d2-e2`, name: "Seated Cable Row", sets: 3, target: { type: "range", reps: "10-14" }, notes: "Neutral or Wide grip" },
                        { id: `pn-w${w}-d2-e3`, name: "Wide-Grip Seated Row", sets: 3, target: { type: "range", reps: "12-15" }, notes: "Mag grip preferably" },
                        { id: `pn-w${w}-d2-e4`, name: "Face Pulls", sets: 3, target: { type: "range", reps: "15-25" } },
                        { id: `pn-w${w}-d2-e5`, name: "Single-Arm DB Rear Delt Fly", sets: 3, target: { type: "range", reps: "15-20" }, notes: "Chest-supported" },
                        { id: `pn-w${w}-d2-e6`, name: "Preacher EZ-Bar Curls", sets: 3, target: { type: "range", reps: "10-15" } },
                        { id: `pn-w${w}-d2-e7`, name: "Romanian Deadlift", sets: 3, target: { type: "range", reps: "8-12" }, notes: "Heavy. Straps OK. 1–2 sec glute squeeze at top." },
                        { id: `pn-w${w}-d2-e8`, name: "Lying Leg Curls", sets: 3, target: { type: "range", reps: "12-16" } },
                        { id: `pn-w${w}-d2-e9`, name: "Hanging Leg Raises", sets: 3, target: { type: "range", reps: "12-20" } }
                    ]
                },
                {
                    dayName: "Rest & Recovery",
                    dayOfWeek: 3,
                    exercises: []
                },
                {
                    dayName: "Push B (Chest/Delts/Tri/Quads)",
                    dayOfWeek: 4,
                    exercises: [
                        { id: `pn-w${w}-d4-e1`, name: "Incline Barbell Bench Press (45°)", sets: 3, target: { type: "range", reps: "8-12" } },
                        { id: `pn-w${w}-d4-e2`, name: "Flat DB Press", sets: 3, target: { type: "range", reps: "10-14" } },
                        { id: `pn-w${w}-d4-e3`, name: "Pec-Dec", sets: 3, target: { type: "range", reps: "12-15" }, alternates: ["Cable Flyes"] },
                        { id: `pn-w${w}-d4-e4`, name: "Standing Barbell Military Press", sets: 3, target: { type: "range", reps: "8-12" }, notes: "Strict, no leg drive. Proud chest, squeeze delts." },
                        { id: `pn-w${w}-d4-e5`, name: "Lying Lateral Raises", sets: 3, target: { type: "range", reps: "15-20" } },
                        { id: `pn-w${w}-d4-e6`, name: "Close-Grip Bench Press", sets: 3, target: { type: "range", reps: "10-14" } },
                        { id: `pn-w${w}-d4-e7`, name: "Front Squats", sets: 3, target: { type: "range", reps: "10-15" } },
                        { id: `pn-w${w}-d4-e8`, name: "Walking Lunges (DB)", sets: 3, target: { type: "range", reps: "12-16" }, notes: "Steps per leg. Long strides, do not push off back leg" },
                        { id: `pn-w${w}-d4-e9`, name: "Hack Calf Raises", sets: 3, target: { type: "range", reps: "15-20" }, notes: "5-sec stretch at bottom" }
                    ]
                },
                {
                    dayName: "Pull B (Back/Rear Delt/Bi/Hams)",
                    dayOfWeek: 5,
                    exercises: [
                        { id: `pn-w${w}-d5-e1`, name: "Lat Pulldown (Neutral)", sets: 3, target: { type: "range", reps: "10-14" } },
                        { id: `pn-w${w}-d5-e2`, name: "Single-Arm Hammer Strength Row", sets: 3, target: { type: "range", reps: "10-14" } },
                        { id: `pn-w${w}-d5-e3`, name: "Single-Arm DB Row", sets: 3, target: { type: "range", reps: "12-15" } },
                        { id: `pn-w${w}-d5-e4`, name: "Rear-Delt Rope Pulls to Face", sets: 3, target: { type: "range", reps: "20-30" } },
                        { id: `pn-w${w}-d5-e5`, name: "Machine Rear Delt Fly", sets: 3, target: { type: "range", reps: "15-20" } },
                        { id: `pn-w${w}-d5-e6`, name: "Incline DB Curls", sets: 3, target: { type: "range", reps: "12-15" } },
                        { id: `pn-w${w}-d5-e7`, name: "Stiff-Legged Deadlift", sets: 3, target: { type: "range", reps: "10-14" } },
                        { id: `pn-w${w}-d5-e8`, name: "Seated Leg Curls", sets: 3, target: { type: "range", reps: "12-16" }, notes: "Lean torso forward... Control the eccentric." },
                        { id: `pn-w${w}-d5-e9`, name: "Ab Wheel Rollouts", sets: 3, target: { type: "failure", reps: "Failure" } }
                    ]
                },
                { dayName: "Rest", dayOfWeek: 6, exercises: [] },
                { dayName: "Rest", dayOfWeek: 7, exercises: [] }
            ]
        });
    }
    return weeks;
}

export const PENCILNECK_PROGRAM: Program = {
    id: "pencilneck-eradication",
    name: "Pencilneck Eradication Protocol",
    weeks: generatePencilneckWeeks()
};

export const PENCILNECK_CONFIG: PlanConfig = {
    id: PENCILNECK_PROGRAM.id,
    program: PENCILNECK_PROGRAM,
    ui: {
        dashboardWidgets: ['pencilneck_commandments', 'program_status', 'trap_barometer'] // trap_barometer hardcoded logic check in dashboard
    },
    hooks: {
        preprocessDay: (day: WorkoutDay, user: UserProfile): WorkoutDay => {
            let exercises = [...day.exercises];

            // 1. Swaps
            exercises = exercises.map(ex => {
                let name = ex.name;
                // Simple preferences check (e.g. "Hack Squat" -> "Leg Press")
                const key = ex.name.toLowerCase().replace(/ /g, '-');
                const pref = user.exercisePreferences?.[key] || user.exercisePreferences?.[ex.name];
                if (pref) name = pref;
                return { ...ex, name };
            });

            // Parse Week and Day from clean IDs (before we might mess with them)
            // Assumes structure pn-w{N}-d{N}-e{N}
            let weekNum = 1;
            let dayNum = 1;

            if (exercises.length > 0) {
                const firstId = exercises[0].id;
                const parts = firstId.split('-');
                // parts: ['pn', 'w1', 'd1', 'e1']
                if (parts.length >= 2) {
                    weekNum = parseInt(parts[1].replace('w', '')) || 1;
                    dayNum = parseInt(parts[2].replace('d', '')) || 1;
                }
            }

            // 2. Cycle Logic
            const cycle = user.pencilneckStatus?.cycle || 1;

            // Phase Logic
            // Cycle 2+ or Week 5-8: Heavy Phase applies to COMPOUNDS
            // Cycle 2 Week 1-4 ALSO uses High reps? 
            // Prompt: "Cycle 2... New week 1 weight... returning to higher reps".
            // So Cycle 2 W1-4 is High Reps. Cycle 2 W5-8 is Heavy.
            // So `isHeavierPhase` depends solely on WEEK NUMBER regardless of cycle.
            const isHeavierPhase = weekNum >= 5 && weekNum <= 8;

            if (isHeavierPhase) {
                exercises = exercises.map(ex => {
                    // Fuzzy match check (handle swaps if they keep "Press" etc?) 
                    // Better to check original name or current name in Set. 
                    // Using current Name if it matches standard list.
                    // If swapped, it might not match. But prompt implied standard list changes.
                    // We'll check if name is in COMPOUND_EXERCISES.
                    // NOTE: If user swaps Hack Squat -> Leg Press, Leg Press is NOT in COMPOUND set. 
                    // So it won't get rep change. This is safer.
                    if (COMPOUND_EXERCISES.has(ex.name)) {
                        return { ...ex, target: { ...ex.target, type: "range", reps: "6-10" } };
                    }
                    return ex;
                });
            }

            // 3. Intensity Techniques
            // Cycle 1: Week 7-8 ONLY -> Last set intensity on compounds
            // Cycle 2+: Week 1-8 -> Last set intensity on COMPOUNDS
            exercises = exercises.map((ex) => {
                let shouldApply = false;
                const isCompound = COMPOUND_EXERCISES.has(ex.name);

                if (cycle === 1) {
                    // Only weeks 7-8 for cycle 1
                    if (weekNum >= 7 && weekNum <= 8 && isCompound) shouldApply = true;
                } else if (cycle > 1) {
                    if (isCompound) shouldApply = true;
                }

                if (shouldApply) {
                    return { ...ex, intensityTechnique: "LAST SET: Drop Set or Rest-Pause to Failure" };
                }
                return ex;
            });

            // 4. Week 8 Final Exam (Day 4)
            if (weekNum === 8 && dayNum === 4) {
                exercises.push({
                    id: `pn-w8-d4-bonus1`, // Will get cycle tag below
                    name: "Lying Lateral Raises (FINAL EXAM)",
                    sets: 1,
                    target: { type: "failure", reps: "Failure" },
                    notes: "Failure + Drop set to oblivion"
                });
                exercises.push({
                    id: `pn-w8-d4-bonus2`,
                    name: "Rear Delt Burnout",
                    sets: 1,
                    target: { type: "range", reps: "100" },
                    notes: "100 reps total. Rest-pause if needed."
                });
            }

            // 5. Append Cycle to ID
            // CRITICAL: This allows getExerciseAdvice to know the cycle context
            exercises = exercises.map(ex => ({
                ...ex,
                id: `${ex.id}-c${cycle}`
            }));

            return { ...day, exercises };
        },

        calculateWeight: (_target, _user) => undefined, // Standard double progression, user input driven

        getExerciseAdvice: (exercise: Exercise, history: WorkoutLog[]) => {
            // Parse context from ID
            const idParts = exercise.id.split('-c');
            const cycleStr = idParts[1];
            const cycle = parseInt(cycleStr || "1") || 1;

            // Parse Week
            const mainId = idParts[0];
            const wParts = mainId.split('-'); // pn, w1, d1, e1
            const wStr = wParts[1]; // w5
            const week = parseInt(wStr?.replace('w', '') || "1");

            // Sort history (Newest first)
            // history passed here is for THIS exercise name.
            const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            // const lastLog = sortedHistory[0]; // Not used currently

            if (week === 5 && COMPOUND_EXERCISES.has(exercise.name)) {
                // Heavier Phase Suggestion
                // Look for max weight in Week 3-4?
                // We just scan history for max weight in the last 4 weeks?
                // Or simplified: Just look at the absolute best recent lift.
                if (history.length > 0) {
                    let maxWeight = 0;
                    // Scan last 5 logs
                    sortedHistory.slice(0, 5).forEach(log => {
                        let sets: any[] | undefined = log.exercises?.find(e => e.name === exercise.name)?.setsData;
                        if (!sets && log.setResults) sets = log.setResults;

                        if (sets) {
                            sets.forEach(s => {
                                if (s.completed) {
                                    const w = parseFloat(s.weight || "0");
                                    if (w > maxWeight) maxWeight = w;
                                }
                            });
                        }
                    });

                    if (maxWeight > 0) {
                        const suggested = Math.floor((maxWeight * 1.15) / 2.5) * 2.5;
                        return `Week 5 Heavy Phase: Suggested weight calculated from recent performance (${maxWeight}kg). Aim for ~${suggested}kg. Round down to nearest available plate.`;
                    }
                }
            }

            // Cycle 2 Week 1 Logic
            if (cycle > 1 && week === 1) {
                // Need Previous Week 8 Max (from Cycle 1)
                // We scan history for weights.
                // Assuming Week 8 was recent.
                if (history.length > 0) {
                    let maxW8 = 0;
                    // Look deeper in history if needed, but last few logs should contain W8
                    sortedHistory.slice(0, 8).forEach(log => {
                        let sets: any[] | undefined = log.exercises?.find(e => e.name === exercise.name)?.setsData;
                        if (!sets && log.setResults) sets = log.setResults;

                        if (sets) {
                            sets.forEach(s => {
                                if (s.completed) {
                                    const w = parseFloat(s.weight || "0");
                                    if (w > maxW8) maxW8 = w;
                                }
                            });
                        }
                    });

                    if (maxW8 > 0) {
                        const isCompound = COMPOUND_EXERCISES.has(exercise.name);
                        const multiplier = isCompound ? 0.87 : 0.92;
                        let suggested = maxW8 * multiplier;

                        // Enforce +10% over Original Cycle 1 Week 1
                        // Need oldest log
                        const oldestLog = sortedHistory[sortedHistory.length - 1]; // Oldest
                        if (oldestLog) {
                            let firstWeight = 0;
                            let sets: any[] | undefined = oldestLog.exercises?.find(e => e.name === exercise.name)?.setsData;
                            if (!sets && oldestLog.setResults) sets = oldestLog.setResults;

                            if (sets) {
                                sets.forEach(s => {
                                    if (s.completed) {
                                        const w = parseFloat(s.weight || "0");
                                        if (w > firstWeight) firstWeight = w;
                                    }
                                });
                            }

                            if (firstWeight > 0) {
                                const minTarget = firstWeight * 1.10;
                                if (suggested < minTarget) suggested = minTarget;
                            }
                        }

                        suggested = Math.floor(suggested / 2.5) * 2.5;
                        return `Cycle ${cycle} Reload: Suggested weight ~${suggested}kg (Based on previous max & original start +10%). Round down.`;
                    }
                }
            }

            // Standard Double Progression Advice
            if (sortedHistory.length > 0) {
                const lastLog = sortedHistory[0];
                let prevSets: any[] | undefined = lastLog.exercises?.find(e => e.name === exercise.name)?.setsData;
                if (!prevSets && lastLog.setResults) prevSets = lastLog.setResults;

                if (prevSets) {
                    const completedSets = prevSets.filter((s: any) => s.completed);
                    if (completedSets.length >= exercise.sets) {
                        if (exercise.target.type === 'range' && typeof exercise.target.reps === 'string') {
                            const rangeMatch = exercise.target.reps.match(/(\d+)-(\d+)/);
                            if (rangeMatch) {
                                const upper = parseInt(rangeMatch[2]);
                                const allHit = completedSets.every((s: any) => parseInt(s.reps || "0") >= upper);
                                if (allHit) {
                                    return "Upper rep range hit! Increase weight by 2.5kg.";
                                }
                            }
                        }
                    }
                }
            }

            return null;
        }
    }
};
