export const translations = {
    en: {
        // ========================================
        // COMMON - Shared UI elements
        // ========================================
        common: {
            back: "Back",
            next: "Next",
            save: "Save",
            cancel: "Cancel",
            close: "Close",
            loading: "Loading...",
            saving: "SAVING...",
            saved: "Saved",
            saveChanges: "Save Changes",
            confirm: "Confirm",
            delete: "Delete",
            edit: "Edit",
            log: "Log",
            kg: "kg",
            reps: "reps",
            sets: "sets",
            week: "Week",
            day: "Day",
            exercises: "Exercises",
            more: "more",
            required: "REQUIRED",
            exportData: "Export Data Backup",
            optional: "Optional",
            primary: "Primary",
            yes: "Yes",
            no: "No",
            failure: "Failure",
        },

        // ========================================
        // SIDEBAR - Navigation
        // ========================================
        sidebar: {
            dashboard: "Dashboard",
            currentWorkout: "Current Workout",
            settings: "Settings",
            trophyCase: "Trophy Case",
            loggedInAs: "Logged in as:",
            logout: "Logout",
            history: "Workout History",
        },

        // ========================================
        // WORKOUT VIEW
        // ========================================
        workout: {
            restDayOrInvalid: "Rest Day or Invalid Date",
            completed: "Completed",
            last: "last",
            target: "Target:",
            giantSets: "giant sets",
            notesPlaceholder: "Workout notes (optional)...",
            saving: "SAVING...",
            completeWorkout: "Complete Workout",
            markAllCompleted: "Mark All Completed",
            exercisesCount: "{count} Exercises",
            andMore: "+ {count} more",
            sets: "sets",
            reps: "reps",
        },

        // ========================================
        // DAY NAMES - For all programs
        // ========================================
        dayNames: {
            // Common
            rest: "Rest",
            restAndRecovery: "Rest & Recovery",

            // Bench Domination
            mondayHeavyStrength: "Monday - Heavy Strength",
            mondayPrimer: "Monday - Primer",
            mondayPeaking: "Monday - Peaking",
            tuesdayLegs: "Tuesday - Legs",
            tuesdayLegsMaintenance: "Tuesday - Legs (Maintenance)",
            wednesdayVolumeHypertrophy: "Wednesday - Volume Hypertrophy",
            wednesdayLightSpeed: "Wednesday - Light/Speed",
            thursdayPowerSpeed: "Thursday - Power / Speed",
            thursdayRest: "Thursday - Rest",
            fridayLegs: "Friday - Legs",
            tuesdayRest: "Tuesday - Rest",
            fridayRest: "Friday - Rest",
            saturdayAMRAPTest: "Saturday - AMRAP Test",
            saturdayPeakingAMRAP: "Saturday - Peaking AMRAP",
            saturdayLightTechnique: "Saturday - Light Technique",
            saturdayJudgmentDay: "Saturday - JUDGMENT DAY",
            sundayRest: "Sunday - Rest",

            // Week 9 Deload
            mondayRecovery: "Monday - Recovery",
            tuesdayLightLegs: "Tuesday - Light Legs",
            wednesdayLight: "Wednesday - Light",
            thursdayLightPower: "Thursday - Light Power",
            fridayLightLegs: "Friday - Light Legs",
            saturdayTechnique: "Saturday - Technique",

            // Pencilneck
            pushAChestDeltsTri: "Push A (Chest/Delts/Tri/Quads)",
            pullABackDeltBi: "Pull A (Back/Rear Delt/Bi/Hams)",
            pushBChestDeltsTri: "Push B (Chest/Delts/Tri/Quads)",
            pullBBackDeltBi: "Pull B (Back/Rear Delt/Bi/Hams)",

            // Peachy
            mondayGluteLegHeavy: "Monday - Glute/Legs Heavy",
            wednesdayGluteUpperPump: "Wednesday - Glute/Upper Pump",
            thursdayPausedSquat: "Thursday - Paused Squat",
            fridayPosteriorChain: "Friday - Posterior Chain",
            saturdayUnilateralPump: "Saturday - Unilateral & Pump",

            // Skeleton
            fullBodyWeek: "Full Body - Week {week}",

            // Pain & Glory
            pullDay: "Pull Day",
            pushDay: "Push Day",

            // Trinary
            trinaryWorkout: "Workout {num}",
            trinaryAccessory: "Accessory Day ({type})",

            // Ritual of Strength
            ritualDay1RampIn: "Day 1 - Bench (Ramp-In)",
            ritualDay2RampIn: "Day 2 - Squat (Ramp-In)",
            ritualDay3RampIn: "Day 3 - Deadlift (Ramp-In)",
            ritualDay1Bench: "Day 1 - Bench ME",
            ritualDay2Squat: "Day 2 - Squat ME",
            ritualDay3Deadlift: "Day 3 - Deadlift ME",
            ritualPurgeDay1: "Purge Week - Day 1",
            ritualPurgeDay2: "Purge Week - Day 2",
            ritualPurgeDay3: "Purge Week - Day 3",
        },

        badges: {
            certified_threat: { description: 'Complete "From Skeleton to Threat"' },
            certified_boulder: { description: 'Complete "Pencilneck Eradication Protocol"' },
            perfect_attendance: { description: 'Zero missed sessions ever' },
            bench_psychopath: { description: 'Bench Domination + peaking + new PR' },
            bench_jump_20kg: { description: '≥20 kg gain in one run' },
            bench_jump_30kg: { description: '≥30 kg gain in one run' },
            deload_denier: { description: 'Never triggered reactive deload' },
            rear_delt_reaper: { description: 'Rear-delt rope pulls 4×30+ (Pencilneck)' },
            "3d_delts": { description: 'Lying laterals 3×20 @ ≥20 kg' },
            cannonball_delts: { description: 'Both Reaper and 3D Delts badges' },
            first_blood: { description: 'First workout ever logged' },
            "100_sessions": { description: '100 total sessions' },
            immortal: { description: 'All programs completed at least once' },
            final_boss: { description: '10+ badges earned' },
            peachy_perfection: { description: 'Complete Peachy Glute Plan' },
            squat_30kg: { description: '+30 kg on Squat' },
            glute_gainz_queen: { description: '≥3 cm glute growth' },
            kas_glute_bridge_100: { description: '100 kg+ for reps' },
            pain_embracer: { description: 'Complete Weeks 1-8 of Pain & Glory' },
            emom_executioner: { description: 'Complete 6x5 E2MOM (Weeks 9-12)' },
            glory_achieved: { description: 'Complete Pain & Glory + New PR' },
            deficit_demon: { description: '+30 kg on Deficit Snatch Grip (Weeks 1-8)' },
            single_supreme: { description: 'Week 16 Single @ ≥97% e1RM' },
            "50_tonne_club": { description: '50,000 kg total volume in Pain & Glory' },
            initiate_of_iron: { description: 'Week 1 of the Ritual of Strength completed' },
            disciple_of_pain: { description: 'Ramp in of the Ritual of Strength completed' },
            acolyte_of_strength: { description: 'First cycle of the Ritual of Strength completed' },
            high_priest_of_power: { description: 'Multiple cycles of the Ritual of Strength completed + PR' },
            eternal_worshipper: { description: 'All-time PRs smashed during the Ritual of Strength' },
            super_mutant_aspirant: { description: 'Complete Week 12 of Super Mutant' },
            behemoth_of_wastes: { description: 'Complete all 14 weeks + new PR in any lift' }
        },

        // ========================================
        // ENTRY PAGE
        // ========================================
        entry: {
            title: "HYPER",
            subtitle: "PLANNER",
            description: "Enter your codeword to access your program.",
            placeholder: "Enter Codeword...",
            button: "ENTER",
            newRecruit: "New Recruit Found",
            notRegistered: "is not registered.",
            availablePrograms: "Available Programs:",
            startProgram: "START PROGRAM",
            programName: "12-Week Bench Domination",
            programDescription: "Specialization program to explode your bench press.",
        },

        // ========================================
        // ONBOARDING
        // ========================================
        onboarding: {
            // Program Selection
            selectProtocol: "Select Your Protocol",
            choosePath: "Choose the path to your transformation.",

            // Program Cards
            programs: {
                benchDomination: {
                    name: "Bench Domination",
                    description: "13-week powerlifting program to explode your bench press, extended with added deload weeks for optimal recovery. Daily Undulating Periodization - build muscle and strength at the same time.",
                    features: [
                        "Focus: Bench Strength",
                        "13 Week Core Cycle + Optional 3 Week Peaking",
                        "Flexible Duration: Extended with deload weeks for recovery",
                        "4 Benching days a week + 2 Lower Body days, optional accessories",
                        "Auto-regulating progression based on AMRAP test"
                    ]
                },
                pencilneck: {
                    name: "Pencilneck Eradication",
                    description: "8-week upper body hypertrophy split. For those who look like a lollipop.",
                    features: [
                        "Focus: Upper Body Mass",
                        "4 Days / Week",
                        "Push / Pull Split"
                    ]
                },
                skeleton: {
                    name: "From Skeleton to Threat",
                    description: "12-week beginner program. For those who have never touched a weight.",
                    features: [
                        "Focus: Full Body",
                        "3 Days / Week",
                        "Flexible Schedule"
                    ]
                },
                peachy: {
                    name: "Peachy",
                    description: "12-week glute specialization. For those who want a better booty.",
                    features: [
                        "Focus: Glutes & Lower",
                        "4 Days / Week",
                        "Science-Based Glute Programming"
                    ]
                },
                painGlory: {
                    name: "Pain & Glory",
                    description: "Pain today, glory tomorrow.",
                    features: [
                        "Focus: Heavy Deadlifting",
                        "4 Days / Week - Pull/Push",
                        "16 Week Program with Peaking",
                        "Self-regulating via RPE feedback"
                    ]
                },
                trinary: {
                    name: "Trinary",
                    description: "Conjugate periodization powerlifting. Adapt to your weak points.",
                    features: [
                        "Focus: Bench / Deadlift / Squat",
                        "Flexible 3-4 Days / Week",
                        "27 Workouts (9 Blocks)",
                        "Auto-adapts to weak point selection"
                    ]
                },
                ritualOfStrength: {
                    name: "Ritual of Strength",
                    description: "3 day/week minimum effective dose powerlifting program.",
                    features: [
                        "Focus: Bench / Deadlift / Squat",
                        "3 Days / Week (Mon/Wed/Fri ideal)",
                        "16 Week Program (with optional 4-week ramp-in)",
                        "ME singles + RPE based progression"
                    ]
                },
                superMutant: {
                    name: "Super Mutant",
                    description: "Advanced 12+2 week Fallout-themed high-frequency bodybuilding. Embrace the mutation through pain and iron.",
                    features: [
                        "Focus: All muscle groups",
                        "Dynamic 4-6 sessions/week",
                        "Auto-adaptive cooldown system (48h upper / 72h lower)",
                        "Reactive volume targeting ~20 sets/muscle/week",
                        "Progressive RPE ramp (8→9→9.5→10)"
                    ]
                }
            },

            // Pain & Glory Calibration
            painGlory: {
                calibrationTitle: "Calibration Phase",
                calibrationDesc: "Enter your current 1RM for Conventional Deadlift and Low Bar Squat. Be honest - the program auto-regulates based on these.",
                deadliftLabel: "Conventional Deadlift 1RM (kg)",
                deadliftHint: "Your true max, not an estimate.",
                squatLabel: "Low Bar Squat 1RM (kg)",
                squatHint: "Competition depth, full ROM.",
                scheduleTitle: "Suggested Schedule:",
                scheduleDesc: "Mon: Pull / Tue: Push / Thu: Push / Fri: Pull (Rest: Wed, Sat, Sun)",
                buildButton: "FORGE MY DESTINY"
            },

            // Trinary Calibration
            trinary: {
                calibrationTitle: "Calibration Phase",
                calibrationDesc: "Enter your current 1RM for all three competition lifts. Be honest - the program auto-regulates based on these.",
                benchLabel: "Paused Bench Press 1RM (kg)",
                benchHint: "Competition pause, full ROM.",
                deadliftLabel: "Conventional Deadlift 1RM (kg)",
                deadliftHint: "Your true max, not an estimate.",
                squatLabel: "Low Bar Squat 1RM (kg)",
                squatHint: "Competition depth, full ROM.",
                scheduleTitle: "Suggested Schedule:",
                scheduleDesc: "Train 3-4 days per week (e.g., Mon/Wed/Fri/Sat). The app tracks weekly workouts – after 4 workouts/week, accessory days auto-trigger.",
                buildButton: "BUILD MY PROGRAM"
            },

            // Ritual of Strength Calibration
            ritualOfStrength: {
                firstProgramQuestion: "Is this your first powerlifting program?",
                firstProgramYes: "Yes - I need the ramp-in",
                firstProgramNo: "No - Jump to main phase",
                firstProgramNote: "Note: If this is your first powerlifting program, you'll start with a 4-week ramp-in phase to build proper technique and confidence.",
                calibrationTitle: "Enter Your 1RM (kg only)",
                calibrationDesc: "Enter your approximate 1RM for each lift. The program auto-regulates based on these.",
                benchLabel: "Paused Bench Press 1RM (kg)",
                benchHint: "Competition pause, full ROM.",
                deadliftLabel: "Conventional Deadlift 1RM (kg)",
                deadliftHint: "Your true max, not an estimate.",
                squatLabel: "Low Bar Squat 1RM (kg)",
                squatHint: "Competition depth, full ROM.",
                scheduleTitle: "Training Frequency",
                scheduleDesc: "3 days/week recommended (Mon/Wed/Fri ideal). Suggest at least 1 day rest between sessions.",
                selectDaysPrompt: "Select your 3 training days:",
                buildButton: "BEGIN THE RITUAL",

                // Recovery Check Modal (Weeks 8, 12, 16)
                recoveryCheckTitle: "Recovery Status Check",
                recoveryCheckDesc: "Rate your recovery over the last 4 weeks (1-10, where 10 = perfect)",
                recoveryRating: "Recovery Rating",
                recoveryPoor: "Poor (≤6) - Immediate Purge Week recommended",
                recoveryGood: "Good - Continue as planned",
                submitRecovery: "SUBMIT",

                // Weak Point Modal (After Ascension Tests)
                weakPointTitle: "Identify Your Weak Points",
                weakPointDesc: "Where did you struggle most during the Ascension Test?",
                weakPointBench: "Bench Press weak point:",
                weakPointSquat: "Squat weak point:",
                weakPointDeadlift: "Deadlift weak point:",
                weakPointOffChest: "Off-chest",
                weakPointMid: "Mid-range",
                weakPointLockout: "Lockout",
                weakPointBottom: "Bottom",
                weakPointTop: "Top",
                submitWeakPoints: "NEXT",

                // Re-Run Modal (End of Week 16)
                rerunTitle: "Cycle Complete - The Ritual Continues?",
                rerunDesc: "You have completed one full cycle of the Ritual. Your strength has ascended.",
                rerunStats: "Your Progress:",
                rerunContinue: "BEGIN NEW CYCLE",
                rerunEnd: "END RITUAL",

                // Ascension Test UI
                ascensionTestComplete: "ASCENSION TEST COMPLETE",
                ascensionTestCongrats: "The iron gods have witnessed your sacrifice",
                new1RMs: "New Estimated 1RMs:"
            },

            // Modules Step (Bench Domination)
            buildPerfectHell: "Build Your Perfect Bench Hell",
            customizeBrutality: "Customize the brutality. The core lift is sacred.",
            modules: {
                title: "Program Modules",
                description: "Customize which modules to include in your program.",
                selectDays: "Select Training Days",
                coreBench: {
                    title: "Core Bench Progression",
                    description: "Paused Bench, Variations (Wide/Spoto/Pin), Saturday AMRAP Test."
                },
                tricepGiantSets: {
                    title: "Tricep Giant Sets",
                    description: "The secret sauce for lockout strength. Mon & Thu."
                },
                behindNeckPress: {
                    title: "Behind-the-Neck Press",
                    description: "Complete shoulder development & stability. Mon & Thu."
                },
                weightedPullups: {
                    title: "Weighted Pull-ups",
                    description: "Back strength for bench stability. Wed & Sat."
                },
                legDays: {
                    title: "Leg Days",
                    description: "Squats, Leg Press, Lunges. Tue & Fri."
                },
                accessories: {
                    title: "Accessories",
                    description: "Dragon Flags, Y-Raises, Around-the-Worlds."
                }
            },

            // Days Selection
            trainingSchedule: "Training Schedule",
            selectDays: "Select exactly {count} training days per week.",
            days: {
                monday: "Monday",
                tuesday: "Tuesday",
                wednesday: "Wednesday",
                thursday: "Thursday",
                friday: "Friday",
                saturday: "Saturday",
                sunday: "Sunday"
            },

            // Preferences Step
            customizeProtocol: "Customize Protocol",
            chooseMovements: "Choose your preferred movements.",
            preferences: {
                title: "Customize Protocol",
                description: "Choose your preferred movements.",
                pushALegPrimary: "Push A: Leg Primary",
                pushBChestIsolation: "Push B: Chest Isolation",
                pushBLegSecondary: "Push B: Leg Secondary"
            },
            exerciseOptions: {
                hackSquat: "Hack Squat",
                highFootLegPress: "High-Foot Leg Press",
                pecDec: "Pec-Dec",
                lowToHighCableFlyes: "Low-to-High Cable Flyes",
                frontSquats: "Front Squats",
                narrowStanceLegPress: "Narrow-Stance Leg Press",
                stilettoSquats: "Stiletto Squats"
            },

            // Stats Step
            calibrationPhase: "Calibration Phase",
            enterStats: "Enter your current lifting stats. These drive all weight calculations.",
            stats: {
                pausedBench: "Paused Bench Press 1RM (Primary)",
                wideGripBench: "Wide-Grip Bench 1RM (Optional)",
                spotoPress: "Spoto Press 1RM (Optional)",
                lowPinPress: "Low Pin Press 1RM (Optional)"
            },
            estPlaceholder: "Est:",

            // Navigation
            buildProgram: "BUILD PROGRAM",
            building: "BUILDING...",
            begin: "BEGIN TRAINING",
            nextExerciseSelection: "NEXT: EXERCISE SELECTION",
        },

        // ========================================
        // DASHBOARD
        // ========================================
        dashboard: {
            // Headers
            timeTo: "Time to",
            eradicateThe: "Eradicate the",
            becomeA: "Become a",
            dominate: "Dominate",
            weakness: "Weakness",
            threat: "Threat",
            welcomeBack: "Welcome back,",

            // Peachy headers
            feelingFroggy: "Feeling",
            froggyStatus: "Froggy",
            feelingPeachy: "Feeling",
            peachyStatus: "Peachy",

            // Cycle banner
            cycleTitle: "Cycle {cycle}: Heavier. Meaner. Shoulders incoming.",
            cycleDescription: "Mandatory intensity techniques engaged. Weights increased. Good luck.",

            // Completion modals
            completion: {
                skeletonTitle: "You Are Now A Threat",
                skeletonSubtitle: "The Skeleton is dead. Long live the machine.",
                pencilneckTitle: "ERADICATED",
                pencilneckSubtitle: "Pencilneck Status: REVOKED. Shoulders: 3D.",
                certifiedThreat: "CERTIFIED THREAT",
                certifiedBoulder: "CERTIFIED BOULDER",
                claimVictory: "CLAIM VICTORY",
                startCycle2: "START CYCLE 2 (HEAVIER)"
            },

            // Next steps modal
            nextSteps: {
                title: "NEXT LEVEL UNLOCKED",
                skeletonDescription: "You have completed \"From Skeleton to Threat\". You are now ready for advanced programming. Consult with your personal trainer for personalized next steps.",
                pencilneckDescription: "You have completed 2 cycles of \"Pencilneck Eradication Protocol\". Your shoulders are now certified boulders. Consult with your personal trainer for personalized next steps.",
                contactTrainer: "CONTACT TRAINER"
            },

            // Stats cards
            cards: {
                est1rm: "Est. 1RM (From AMRAP)",
                calculatedMax: "Calculated max",
                weeklyGluteTracker: "Weekly Glute Tracker",
                currentCircumference: "Current Circumference (cm)",
                latestGrowthTrend: "Latest Growth Trend",
                programStatus: "Program Status",
                viewingSchedule: "Viewing Schedule",
                activeModules: "Active Modules",
                coreBench: "Core Bench",
                strengthProgression: "Strength Progression",
                squatStrengthProgression: "Squat Strength Progression"
            },

            // Week navigation
            mandatoryDeload: "MANDATORY DELOAD",
            peakingBlock: "PEAKING BLOCK",
            nExercises: "{count} Exercises",

            // Trinary Dashboard
            trinary: {
                title: "TRINARY",
                tagline: "Conjugate powerlifting – adapt to your weak points",
                workoutProgress: "Workout {current} of {total}",
                scheduleTip: "Schedule Tip",
                scheduleAdvice: "For best gains train 3–4 days/week (e.g., Mon/Wed/Fri/Sat). The app tracks weekly workouts – after 4 workouts/week, accessory days auto-trigger.",
                progressTitle: "Workouts Completed",
                block: "Block",
                nextWorkout: "Workout {num}",
                readyWhenYouAre: "Ready when you are. Train on your schedule.",
                startWorkout: "START WORKOUT",
                accessoryTriggered: "Excess workouts this week – accessory day triggered to hit weak points",
                startAccessory: "START ACCESSORY DAY",
                skipAccessory: "SKIP ACCESSORY",
                accessoryRecommendation: "⚠️ Skipping not recommended – accessories target weak points",
                manualAccessoryHint: "Need extra recovery or volume? Trigger an accessory day manually.",
                startManualAccessory: "Start Manual Accessory Day"
            },

            // Super Mutant Dashboard
            superMutant: {
                tagline: "Evolve through iron and radiation",
                recoveryInfo: "Upper: 48h (38h+ trainable) • Lower: 72h (62h+ trainable)",
                mindsetTitle: "— MUTANT MINDSET —",
                nextSession: "Next Mutation Session",
                dynamicWorkout: "Dynamic workout based on your recovery"
            }
        },

        // Trinary Modals
        trinary: {
            weakPointModal: {
                title: "Identify Your Weak Points",
                description: "For each lift, select where the bar slows or sticks. This determines your exercise variations for the next block.",
                tipTitle: "Tip",
                tipText: "Review videos or feel where the bar slows/sticks. If unsure, select the phase where it feels hardest.",
                benchTitle: "Bench Press",
                benchOffChest: "Off chest (first 2-3 inches)",
                benchMidRange: "Mid-range (halfway up)",
                benchLockout: "Lockout (final few inches)",
                deadliftTitle: "Deadlift",
                deadliftLiftOff: "Lift-off (breaking from floor)",
                deadliftOverKnees: "Over knees (mid-shin to knee)",
                deadliftLockout: "Lockout (knee to hip)",
                squatTitle: "Squat",
                squatBottom: "Bottom (out of the hole)",
                squatMidRange: "Mid-range (halfway up)",
                squatLockout: "Lockout (final drive)",
                variations: "Possible variations",
                submit: "SAVE & CONTINUE"
            },
            rerunModal: {
                title: "Trinary Complete! 🎉",
                description: "You've finished 27 workouts (9 blocks). Choose your next step – a deload is recommended.",
                optionATitle: "Deload Week (Recommended)",
                optionADesc: "1 week at 50% volume on ME/DE/RE, with reduced intensity:",
                optionADetail1: "ME: -25% intensity (blocks restart at lower %)",
                optionADetail2: "DE: -15% intensity",
                optionADetail3: "RE: -15% intensity",
                optionAButton: "DELOAD & RESTART",
                optionBTitle: "Continue Without Deload",
                optionBDesc: "Restart immediately with new variations based on updated weak points.",
                optionBButton: "NO DELOAD, CONTINUE",
                optionCTitle: "4-5 Days Off",
                optionCDesc: "Take a complete rest or do light accessory work at RPE 7-8. Then restart with new variations.",
                optionCButton: "TAKE REST DAYS"
            },
            rpeSelector: {
                title: "How did the last set feel? (RPE on final set)",
                description: "Select based on your perceived exertion – this determines your 1RM progression for next block."
            },
            accessoryModal: {
                title: "Choose Accessory Focus",
                description: "Select which muscle groups you want to target today",
                upperTitle: "Upper Body",
                upperDesc: "Triceps, shoulders, back",
                lowerTitle: "Lower Body",
                lowerDesc: "Glutes, hamstrings, quads, core"
            }
        },

        // Pencilneck widgets
        pencilneck: {
            weekStatus: "Week {week} Status",
            trapBarometer: "Trap Barometer",
            pencil: "Pencil",
            boulder: "Boulder",
            percentGone: "{percent}% GONE",
            restDayThought: "Rest Day Thought",
            commandmentsTitle: "5 Commandments of Growth",
            quotes: [
                "Your former self is crying in the corner watching you eat 500 g of rice.",
                "Somewhere a graphic designer just lost a client because your traps ate the logo.",
                "Mirrors are filing complaints.",
                "Your neck called – it’s not missing.",
                "T-shirts have unionized against you.",
                "Children now think you’re two people standing close.",
                "Doorways whisper ‘not today’ when you approach.",
                "Your shadow has stretch marks.",
                "Old photos of you are now classified as missing person posters.",
                "Airports charge you for two seats.",
                "Your delts entered the chat.",
                "The sun now orbits your shoulders.",
                "Seatbelts go around you twice.",
                "NASA just asked for your yoke measurements.",
                "Your lats have their own postal code.",
                "Your traps blocked someone’s Wi-Fi.",
                "Hoodies file for asylum.",
                "You no longer fit in selfies.",
                "Your rear delts have rear delts.",
                "Congratulations. You are now the final boss of planet Earth."
            ]
        },

        // Skeleton widgets
        skeleton: {
            metamorphosis: "Metamorphosis",
            weeksLeft: "weeks left",
            untilNoLongerSkeleton: "Until you are no longer a skeleton.",
            deficitPushupPR: "Deficit Push-up PR",
            perfectRepsSingleSet: "Perfect Reps (Single Set)",
            restDayQuote: "Your muscles are knitting armor right now."
        },

        // 5 Commandments
        commandments: {
            title: "5 Commandments of Growth",
            list: [
                "300–500 kcal surplus mandatory",
                "Control the eccentric, don't bounce out of the hole",
                "Always warm up with at least 1 set of 12 at 50% of your working weight",
                "Train hard, only 1–3 Reps In Reserve (RIR) every set",
                "Sleep 7+ hours"
            ]
        },

        // Crossroads (Week 13)
        crossroads: {
            title: "CROSSROADS REACHED",
            survived: "You have survived 12 weeks of hell. You must now take a small deload and decide your fate.",
            restTimer: "Mandatory Rest Timer",
            daysLeft: "DAYS LEFT",
            restAdvice: "Do not lift heavy. Sleep. Eat.",
            proceedQuestion: "After your rest, how do you want to proceed?",
            optionA: {
                title: "Option A: The Peak (Recommended)",
                description: "Enter a 3-week peaking block (Weeks 14-16) to acclimatize to heavy loads and explicitly peak for a new 1RM."
            },
            optionB: {
                title: "Option B: Test Now",
                description: "Skip the peaking block and test your 1RM immediately aka \"YOLO\"."
            }
        },

        // ========================================
        // SETTINGS
        // ========================================
        settings: {
            title: "Settings",
            description: "Manage your program preferences.",

            // Exercise Preferences
            exercisePreferences: "Exercise Preferences",
            exercisePreferencesDesc: "Customize your \"OR\" exercise selections. These changes will apply to future workouts.",
            pushALegPrimary: "Push A: Leg Primary",
            pushBChestIsolation: "Push B: Chest Isolation",
            pushBLegSecondary: "Push B: Leg Secondary",

            // Program Modules
            programModules: "Program Modules",
            programModulesDesc: "Enable or disable optional components of the Bench Domination 12-week block.",

            // Manual 1RM Override
            manual1rmOverride: "Manual 1RM Override",
            manual1rmDesc: "Manually adjust your Paused Bench Press 1RM.",
            manual1rmWarning: "⚠️ WARNING: Only change this if absolutely necessary (e.g., injury restart, significant strength loss, or if the auto-regulation is way off). The program automatically adjusts your 1RM based on Saturday AMRAP performance. Artificial inflation will lead to failure.",
            pausedBench1rm: "Paused Bench Press 1RM (kg)",
            currentCalculatedMax: "Current calculated max",

            // Program Management
            programSettings: "Program Settings",
            noConfigurableSettings: "This program has no configurable settings.",
            programManagement: "Program Management",
            programManagementDesc: "Manage your active program and progress data.",
            switchProgram: "Switch Program",
            switchProgramDesc: "Keep your current progress and start a different protocol.",
            resetProgress: "Reset Current Progress",
            resetProgressDesc: "Reset your sessions to Week 1 Day 1. Stats and history are preserved.",
            resetProgressButton: "Reset Progress",

            // Export
            exportDataBackup: "Export Data Backup"
        },

        // ========================================
        // HISTORY
        // ========================================
        history: {
            title: "Workout History",
            loading: "Loading logs...",
            noWorkouts: "No workouts logged yet",
            noWorkoutsDesc: "Get in there and crush some steel.",
            weekDay: "Week {week} Day {day}"
        },

        // ========================================
        // ALERTS & MESSAGES
        // ========================================
        alerts: {
            errorSaving: "Error saving workout. Please try again.",
            progressReset: "Progress reset properly.",
            selectDays3: "Please select exactly 3 training days.",
            selectDays4: "Please select exactly 4 training days.",
            invalidBench: "Please enter a valid Paused Bench 1RM greater than 0.",
            buildFailed: "Failed to build program:",
            accessDenied: "ACCESS DENIED",
            deleteFailed: "Failed to delete user.",
            updateSuccess: "User updated successfully.",
            updateFailed: "Update failed.",
            confirmReset: "Are you sure you want to reset your progress for this program? This cannot be undone.",
            unknownError: "Unknown error"
        },

        // ========================================
        // DAYS OF WEEK
        // ========================================
        days: {
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday",
            sunday: "Sunday",
            // Full day names with focus
            mondayHeavy: "Monday - Heavy Strength",
            tuesdayLegs: "Tuesday - Legs",
            wednesdayVolume: "Wednesday - Volume Hypertrophy",
            thursdayPower: "Thursday - Power / Speed",
            fridayLegs: "Friday - Legs",
            saturdayAmrap: "Saturday - AMRAP Test",
            restRecovery: "Rest & Recovery"
        },

        // ========================================
        // EXERCISES (Names)
        // ========================================
        exercises: {
            "Paused Bench Press": "Paused Bench Press",
            "Wide-Grip Bench Press": "Wide-Grip Bench Press",
            "Behind-the-Neck Press": "Behind-the-Neck Press",
            "Tricep Giant Set": "Tricep Giant Set",
            "Dragon Flags": "Dragon Flags",
            "Walking Lunges": "Walking Lunges",
            "Heels-Off Narrow Leg Press": "Heels-Off Narrow Leg Press",
            "Reverse Nordic Curls": "Reverse Nordic Curls",
            "Single-Leg Machine Hip Thrust": "Single-Leg Machine Hip Thrust",
            "Nordic Curls": "Nordic Curls",
            "Hack Squat Calf Raises": "Hack Squat Calf Raises",
            "Hip Adduction": "Hip Adduction",
            "Spoto Press": "Spoto Press",
            "Weighted Pull-ups": "Weighted Pull-ups",
            "Y-Raises": "Y-Raises",
            "Around-the-Worlds": "Around-the-Worlds",
            "Low Pin Press": "Low Pin Press",
            "Paused Bench Press (AMRAP)": "Paused Bench Press (AMRAP)",
            "Paused Bench Press (Back-off)": "Paused Bench Press (Back-off)",
            "Dips": "Dips",
            "Rolling DB Tricep Extensions": "Rolling DB Tricep Extensions",
            "Banded EZ Bar Skullcrushers": "Banded EZ Bar Skullcrushers",
        },

        // ========================================
        // QUOTES (Pencilneck)
        // ========================================
        quotes: {
            painGloryBadges: {
                void_gazer: "You stared into the deficit abyss – and it blinked first.",
                emom_executioner: "6×5 every 2 minutes. You didn't quit. The bar did.",
                glory_achieved: "Pain paid off. Glory is yours. Now go break it again.",
                deficit_demon: "Most people run from deficits. You made them your bitch.",
                single_supreme: "One rep. One moment. One legend.",
                "50_tonne_club": "That's literally a Boeing 737.",
                initiate_of_iron: "The first sacrifice is complete. The iron gods acknowledge you.",
                disciple_of_pain: "Four weeks of devotion. You've earned the right to suffer more.",
                acolyte_of_strength: "Sixteen weeks of ritual. The path of ascension continues.",
                high_priest_of_power: "Multiple cycles. Multiple PRs. You are one with the iron.",
                eternal_worshipper: "Mortal limits shattered. You have become legend.",
                super_mutant_aspirant: "The radiation has changed you. Week 12 complete – you are no longer human.",
                behemoth_of_wastes: "Unstoppable. Immortal. The wasteland bows before you. Behemoth status achieved."
            },
            pencilneckStatus: [
                "Neck still looks like a coat hanger",
                "Collarbones starting to hide",
                "Delts now cast a shadow",
                "T-shirts beginning to surrender",
                "First recorded door-frame collision",
                "Neck officially gone - mission successful",
                "People asking if you 'even lift bro?' in fear",
                "You are now a certified shoulder boulder"
            ],
            pencilneckRestDay: [
                "Your former self is crying in the corner watching you eat 500 g of rice.",
                "Somewhere a graphic designer just lost a client because your traps ate the logo.",
                "Mirrors are filing complaints.",
                "Your neck called – it's not missing.",
                "T-shirts have unionized against you.",
                "Children now think you're two people standing close.",
                "Doorways whisper 'not today' when you approach.",
                "Your shadow has stretch marks.",
                "Old photos of you are now classified as missing person posters.",
                "Airports charge you for two seats.",
                "Your delts entered the chat.",
                "The sun now orbits your shoulders.",
                "Seatbelts go around you twice.",
                "NASA just asked for your yoke measurements.",
                "Your lats have their own postal code.",
                "Your traps blocked someone's Wi-Fi.",
                "Hoodies file for asylum.",
                "You no longer fit in selfies.",
                "Your rear delts have rear delts.",
                "Congratulations. You are now the final boss of planet Earth."
            ]
        },

        superMutantQuotes: [
            "The radiation transforms weakness into power",
            "Every rep brings you closer to mutation",
            "Pain is the path to evolution",
            "The wasteland demands strength",
            "Embrace the burn - it's your DNA changing",
            "Normal humans rest. Mutants adapt.",
            "Your limits were human. You're becoming something more.",
            "The FEV flows through iron and sweat",
            "Evolution isn't comfortable. Keep pushing.",
            "Super Mutants don't make excuses",
            "The old you is dead. The new you is unstoppable.",
            "Radiation sickness is just gains in disguise"
        ],

        // ========================================
        // EXERCISE TIPS - CONSOLIDATED & REFINED
        // ========================================
        tips: {
            // --- ELITE WARM-UP SCHEME (Bench, Squat, Deadlift) ---
            warmupBench: "Warm up rotator cuff, do some dynamic arching motion, light lat activation pump work (single arm banded lat prayer recommended) and single leg glute bridges with concentric hold for glute activation before the main warm up.",
            warmupSquat: "Do some hip swings, hip air planes, cossack squats, banded good mornings, hamstring stretches, single leg glute bridges with concentric hold and ass-to-grass bodyweight squats before main warm up.",
            warmupDeadlift: "Do some hip swings, hip airplanes, barbell/banded good mornings + stiff legged good mornings, bodyweight lunges/bulgarian split squats, light lat activation pump (single arm banded lat prayer recommended) and single leg glute bridges with concentric hold before main warm up.",

            // --- BENCH DOMINATION TIPS ---
            pausedBench: "Warm-up: ramp fast, low reps, paused every set. Save energy for working sets. Bar comes to complete stop at chest, 0.5-1 second full pause. General warm-up (rotator cuff, dynamic arching, lat activation, glute bridges) → Barbell warm-up. All warm-up sets paused.",
            wideGripBench: "Wide grip with elbows flared. Focus on deep stretch at the bottom. 📈 Hit top reps (8) on ALL sets for 2 straight weeks → +2.5 kg",
            spotoPress: "Stop bar 4-8 cm above chest, hold 1 second, then press explosively. 📈 Target reps hit on ALL sets = +2.5 kg next session",
            lowPinPress: "Set pins at your sticking point. Explosive press from dead stop. 📈 Target reps hit on ALL sets = +2.5 kg next session",
            pausedBenchAMRAP: "AMRAP drives progression! Weeks 1-6: ≥12 reps, Weeks 7-9: ≥10 reps, Weeks 10-12: ≥8 reps.",
            pausedBenchWednesday: "Leave 2 reps in reserve on Set 1 & 2 and 1 rep on Set 3 & 4.",
            pausedBenchBackoff: "Technique work - focus on perfect form, controlled tempo.",
            tricepGiantSet: "~10 second rest between exercises. 2 minute rest between sets. Hit 25 reps on Banded Skullcrushers to progress weight.",
            dragonFlags: "Cheat the concentric if needed, control the eccentric (3-5 sec lowering).",
            walkingLunges: "Long strides, do not push off back leg. Drive through front heel.",
            walkingLungesWeek11: "Long strides, do not push off back leg. Last set: rest-pause to failure.",
            heelsOffLegPress: "Knees out, deep stretch at the bottom. Try to touch hamstrings with calves.",
            heelsOffLegPressWeek11: "Knees out, deep stretch at the bottom. Last set: triple drop set.",
            reverseNordic: "1 weighted set, 1 weighted + drop set to bodyweight.",
            singleLegHipThrust: "Drive through heel, full hip extension, brutal glute squeeze at top.",
            singleLegHipThrustWeek11: "Explosive reps. Last set: 20 sec isometric hold + partials.",
            nordicCurls: "Cheat concentric if under 5 reps. Control eccentric (3-5 sec lowering).",
            hackSquatCalves: "Push through the burn. Go 0-1 reps from failure on every set.",
            hipAdduction: "Stretch with warm-up, then max width. Use arms to help wedge into position if needed.",
            aroundTheWorlds: "If 16 reps is easy, slow down the eccentric (3-4 sec).",
            yRaises: "Focus on scapular retraction. Swap to facepulls if shoulder issues.",
            highElbowFacepulls: "Cable at forehead height, wide elbows, external rotation at top (thumbs back). Light weight, perfect form.",
            behindNeckPress: "Light and crisp. Strict form, no momentum.",

            // --- PULL-UP PROGRESSIONS (BENCH DOM) ---
            pullupWeeks1to3: "Add smallest plate. Max strict reps EMOM until form breaks. (EMOM: Start every minute, rest for remainder)",
            pullupWeeks4to6: "Add 10-15 kg. 3-5 reps EMOM for 12-15 minutes.",
            pullupWeeks7to9: "Daily max triple + 4-6 back-off triples @ 85-90%.",
            pullupWeek10: "Test your max weighted single rep.",
            pullupWeeks11to12: "3-5 sets of 2-3 reps @ 90-95%.",
            pullupWeeks11to13Note: "All sets @ 92.5% of your Week 10 max. Aim for quality reps, beat Week 10's back-off volume.",

            // --- PEACHY PROGRAM TIPS ---
            sumoDeadlift: "Go brutally heavy. Use straps. 1-2 sec squeeze at top - crack a walnut with your glutes.",
            bulgarianSplitSquat: "Hold rack with one hand, DB in other. Rear foot shoelaces on bench (toes DOWN). Sit back, limit front knee travel, stay upright.",
            squats: "Every rep must break parallel. Add 2.5 kg when you hit 3×10.",
            seatedHamstringCurl: "Lean torso forward for massive stretch. Control the eccentric.",
            kasGluteBridge: "Upper back on bench. Lower only 5-10 cm, never touch floor. Constant tension.",
            hyperextension45: "Round upper back slightly, toes flared 45°, press hips HARD into pad. Pure hip hinge.",
            militaryPress: "Strict, no leg drive. Proud chest, squeeze delts at top.",
            inclineDBBench: "Flare elbows, arch back, go for full stretch. Think 'reaching' with your chest.",
            invertedRows: "Let shoulders slump forward at bottom for stretch. Keep hips perfectly straight.",
            sideLyingRearDeltFly: "Pinky leads, think 'pouring water' at top.",
            dbRDL: "Heavy. Straps OK. 1-2 sec glute squeeze at top.",
            pausedSquat: "80% of Monday squat weight. 2 full seconds in the hole - no bounce.",
            ghr: "3-5 sec lowering (eccentric only). Cheat up any way possible.",
            legPressCalves: "Full stretch at bottom, explode up. Stop 0-1 rep shy of failure.",
            deficitReverseLunge: "Front foot on plate. Back knee touches floor every rep.",
            deficitPushups: "Chest to floor every rep. Can't hit 5? Drop to knees and continue.",
            assistedPullups: "Limit assistance to minimum. Strict reps first, then push off box/bench.",
            yRaisesPeachy: "Pinky leads, thumbs up, external rotation at top.",
            lyingCableLatRaises: "Pull 'away' from body, not up. Focus on side delt stretch.",
            glutePumpFinisher: "100 reps banded thrust/abduction in under 5 minutes. Chase the pump.",
            powerHangingLegRaises: "Explosive - knees to chest fast, slow eccentric (3-5 sec), full stretch at bottom.",
            gluteHamRaise: "Control the eccentric, explode up. Use assistance if needed for full ROM.",

            // --- PENCILNECK PROGRAM TIPS ---
            flatBarbellBenchPress: "Slow down before touching chest. No bouncing. Control the entire rep.",
            cableFlyes: "Big stretch at the bottom. Push chest forward, feel the pec stretch.",
            seatedDBShoulderPress: "Full ROM - touch shoulders with DBs at the bottom.",
            overheadTricepExtensions: "Use strap attachment, stand upright with cable at bottom. Full ROM - forearms touch biceps at bottom.",
            hackSquat: "Feet narrow, full ROM - ass to grass. Try to touch calves with glutes.",
            legExtensions: "Full ROM, no bouncing. Angle between legs and torso should be 120°+ (slide forward if needed).",
            hammerPulldown: "Go single-arm for max stretch. Add squeeze at bottom to increase difficulty.",
            preacherEZBarCurls: "Full ROM, slow down at the stretched position. Control the negative.",
            hangingLegRaises: "Straight legs if bent is too easy. No swinging.",
            lyingLegCurls: "Full ROM, slow down at the stretched position.",
            inclineBarbellBenchPress: "Slow down before touching chest. No bouncing.",
            flatDBPress: "Flare elbows, arch back, go for full stretch. Think 'reaching' with your chest.",
            closeGripBenchPress: "Grip 1.5 hand-width closer than normal - around shoulder width.",
            latPulldownNeutral: "'Dead hang' at the top (head between shoulders). Slight lean back when pulling.",
            singleArmHammerStrengthRow: "Round shoulders at stretched position. Add padding between chest and seat for extra stretch.",
            singleArmDBRow: "Limit lower back movement. Focus on lat contraction.",
            machineRearDeltFly: "Do single arm sitting sideways for maximum stretch.",
            inclineDBCurls: "As low incline as possible without DBs hitting floor. Maximum stretch.",
            stiffLeggedDeadlift: "Slow down and lightly touch the ground. Feel the hamstring stretch.",
            abWheelRollouts: "Start from knees, go as far as possible while hitting 5+ reps. Progress distance weekly.",
            frontSquats: "Full ROM, slow eccentric. Stay upright, elbows high.",
            stilettoSquats: "Ass to grass - touch calves with glutes. Elevated heels.",
            inclineDBPress: "Flare elbows, arch back, go for full stretch. Think 'reaching' with your chest.",
            seatedCableRow: "Neutral or wide grip. Round shoulders forward for max stretch at bottom.",
            latPrayer: "Internal rotation at stretched position for maximum lat stretch.",
            wideGripBBRow: "Pinky fingers on the inner rings. Pull to lower chest.",
            romanianDeadlift: "Heavy. Straps OK. 1-2 sec glute squeeze at top.",
            standingMilitaryPress: "Strict, no leg drive. Proud chest, squeeze delts.",
            leaningLateralRaises: "Lean against wall at 15-30°. Rep ends when DB points straight down.",
            walkingLungesDB: "Long strides, do not push off back leg.",
            hackCalfRaises: "1 second pause at bottom, slow eccentric.",
            seatedLegCurls: "Pochyl tułów do przodu. Control the eccentric.",
            pecDeck: "Full stretch at the bottom. Squeeze at contraction.",

            // --- SKELETON PROGRAM TIPS ---
            deficitPushupsSkeleton: "Chest to floor every perfect rep. Drop to knees only when form breaks. If <5 perfect reps, drop to knees until 5 total.",
            legExtensionsSkeleton: "At least 120° angle between thighs and torso. Full stretch, hard quad squeeze.",
            supportedSLDL: "Lean over smith machine or racked bar. Heels under or behind bar. 3-4 sec eccentric.",
            standingCalfRaises: "Full stretch at bottom, 2-sec pause at bottom. Step, hack machine, or leg-press.",
            invertedRowsSkeleton: "Lower rings/bar or walk feet forward when you hit 15 reps.",
            overhandPulldown: "Slight lean, pull to upper chest, squeeze blades together.",


            // --- SWAP TIPS ---
            nordicSwapTip: "If too difficult, swap to alternative for better progression and safety.",

            // --- NEW: THURSDAY TRICEP SWAP & LOW PIN PRESS ---
            heavyRollingTricepExtensions: "Heavy tricep option – focusing on lockout strength. 📈 Hit 6 reps on all 4 sets = +2.5 kg next Thursday",
            lowPinPressSwapButton: "Trouble with lockout? Click to swap 1 set of Paused Bench to Pin Press",
            heavyTricepOptionSelected: "Heavy tricep option selected – focusing on lockout strength",
            explosiveThursday: "Explosive",

            // --- PAIN & GLORY TIPS ---
            deficitSnatchGrip: "4 second eccentric, no more than 2 minute rest between sets. Do NOT cheat on the eccentric as it will mess up self-regulation and push weight too fast.",
            closeNeutralLatPulldown: "Full stretch 'dead hang' at top, split movement: pulldown + scap pull at bottom, squeeze scap pull.",
            slowEccentricNordic: "Cheat up, lower as slowly as possible – aim to control more each week.",
            singleLegHipThrustPG: "Explode up, think 'squeeze glutes' not just lift – go relatively light.",
            deadHangPlanks: "Straight to planks after hangs, 2 min rest between supersets.",
            pausedLowBarSquat: "Progression only weeks 1-8: +2.5 kg weekly on success. Weeks 9-16: fixed weight to prioritize deadlift peaking.",
            legExtensionsPG: "120° hip angle, full ROM.",
            hackCalfRaisesPG: "Full stretch, close to failure every set.",
            inclineDBBenchPG: "Touch biceps with inside DBs at bottom, 'reach up' with chest.",
            standingMilitaryPG: "No body english, strict full ROM.",
            conventionalE2MOM: "E2MOM – every 2 minutes: perform 3-5 reps, rest remainder. Grip and form are priority. Aim for consistent 3-5 reps across all 6 sets.",
            conventionalDeadliftAMRAP: "AMRAP test. Go all out but maintain perfect form. This determines your peaking weights.",
            conventionalDeadliftTriple: "Heavy triple @ RPE 9.",
            conventionalDeadliftDouble: "Heavy double @ RPE 9.5. Very close to max effort.",
            conventionalDeadliftSingle: "JUDGMENT DAY. Your moment of glory.",
            conventionalDeadliftOptional: "Optional second single if you feel you have more.",
            conventionalDeadliftBackdown: "Back-down work. Focus on speed and form.",
            conventionalCAT: "Compensatory Acceleration Training – explode as fast as possible every rep.",
            increaseWeight: "Increase Weight!",

            // Pain & Glory Dashboard
            painGloryDashboardTagline: "Intermediate heavy deadlifting – pain today, glory tomorrow",
            deficitSnatchGripTracker: "Deficit Snatch Grip Progress",
            currentWeight: "Current Weight",
            trend: "Trend",

            // --- TRINARY TIPS ---
            trinaryMEStandard: "Max Effort – work up to 90-95% of 1RM. Focus on perfect technique. 📈 RPE 9 or lower + 3 clean reps = +5 kg next ME session.",
            trinaryMEVariation: "Max Effort Variation – targeting your weak point. Start with suggested weight, adjust based on feel.",
            trinaryDE: "Dynamic Effort – explosive speed is the goal. Move the bar as fast as possible. Consider bands/chains.",
            trinaryRE: "Repeated Effort – hypertrophy focus. 📈 Hit 12 reps on ALL sets = +2.5 kg next session.",
            trinaryREProgression: "Double progression: hit 12 reps on all sets → +2.5 kg next RE session for this lift.",
            trinaryDESpeed: "Focus on bar speed, not weight. Explode through the entire range of motion.",
            trinaryAccessory: "Accessory work for weak points. Double progression: 12 reps on all sets = +2.5 kg.",
            trinaryRPECheck: "RPE 9 or lower with perfect form?",
            trinaryStartingWeight: "Suggested starting weight: {weight} kg (~{percent}% of your {lift} 1RM). Adjust based on feel.",

            // --- RITUAL OF STRENGTH TIPS ---
            ritualRampIn: "Competition style – focus on perfect form. RPE 7-8. Build confidence with the big 3.",
            ritualAscensionTest: "ASCENSION TEST – 3×AMRAP @ ~85% 1RM + back-down 3×5 @ 80%. Target 5-8 reps. Updates all 1RMs via Epley formula. The iron gods judge your sacrifice.",
            ritualMESingle: "MAX EFFORT SINGLE – work up to 1 clean rep @ 90-100% 1RM. +2.5-5 kg if clean (no hitch, full ROM). Check RPE 9 or lower for progression.",
            ritualLightWork: "Light work @ 70% 1RM. Speed and form focus. Aim bar velocity >0.8 m/s. If slow, drop 5% next session.",
            ritualBackDown: "Back-down sets @ 80% of Ascension Test weight. Technique work after the test.",
            ritualGripWork: "Mandatory grip work on deadlift days. Farmer Holds or Fat Grip Deadlift Holds 3×20-30 sec @ bodyweight or light. Progress time or weight when easy.",
            ritualAccessory: "Ritual Accessories – double progression. Hit  top reps all sets → +2.5 kg next session. Target weak points.",
            ritualPurgeWeek: "PURGE WEEK (Deload) – 50% volume, 70% intensity. Rest and recover. The ritual demands sacrifice, but also respite.",
            ritualMEAdvice: "Work up to 1 clean rep @ 90-100% 1RM. Progression: +2.5-5 kg if clean (no hitch, full ROM, RPE ≤9). Safety checkbox required.",
            ritualVelocityTip: "Aim bar velocity >0.8 m/s – use phone app or feel. If slow, drop 5% next session.",
            ritualRecoveryCheck: "Recovery last 4 weeks? Rate 1-10 (10 = perfect). If ≤6: immediate Purge Week triggered.",
            ritualDashboardTagline: "The ritual of iron – sacrifice for ascension",

            // --- WARM-UP TIPS FOR ALL LIFT VARIATIONS ---
            // These apply to ANY bench/squat/deadlift variation in Trinary, Pain & Glory, Ritual
            "Paused Bench Press (ME)": "General warm-up (see Bench warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1. All paused. Max Effort – work up to 90-95% 1RM.",
            "Paused Bench Press (Light)": "General warm-up (see Bench warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3 (skip 85%, 95%). All paused. Light work @ 70% for speed.",
            "Paused Bench Press (Ascension Test)": "General warm-up (see Bench warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2. All paused. ASCENSION TEST – AMRAP @ 85%.",
            "Low Bar Squat (ME)": "General warm-up (see Squat warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1.  Max Effort single.",
            "Low Bar Squat (Light)": "General warm-up (see Squat warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3 (skip 85%, 95%).  Light work @ 70% for speed.",
            "Low Bar Squat (Ascension Test)": "General warm-up (see Squat warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2.  ASCENSION TEST.",
            "Conventional Deadlift (ME)": "General warm-up (see Deadlift warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1.  Max Effort single.",
            "Conventional Deadlift (Light)": "General warm-up (see Deadlift warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3 (skip 85%, 95%).  Light work @ 70% for speed.",
            "Conventional Deadlift (Ascension Test)": "General warm-up (see Deadlift warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2.  ASCENSION TEST.",
            "Conventional Deadlift": "General warm-up (see Deadlift warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1 (heavy days).  ",
            "Low Bar Squat": "General warm-up (see Squat warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1 (heavy days).  ",
            "Paused Low Bar Squat": "General warm-up (see Squat warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2. All paused. 2-sec pause in hole. Progression weeks 1-8: +2.5kg weekly. Weeks 9-16: fixed weight to prioritize deadlift peaking.",
            "Deficit Snatch Grip Deadlift": "General warm-up (see Deadlift warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3",
            "Conventional Deadlift E2MOM": "E2MOM – every 2 min: 3-5 reps, rest remainder. Grip/form priority. Aim 3-5 reps all 6 sets. General warm-up (see Deadlift warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2.",
            "Conventional Deadlift (AMRAP Test)": "General warm-up (see Deadlift warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2. AMRAP test. Perfect form. Determines peaking weights.",
            "Conventional Deadlift (Heavy Triple)": "General warm-up (see Deadlift warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1. Heavy triple @ RPE 9.",
            "Conventional Deadlift (Heavy Double)": "General warm-up (see Deadlift warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1. Heavy double @ RPE 9.5. Very close to max.",
            "Conventional Deadlift (Max Single)": "General warm-up (see Deadlift warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1. JUDGMENT DAY. Your moment of glory.",
            "Conventional Deadlift (CAT)": "CAT – explode as fast as possible every rep. General warm-up (see Deadlift warm-up tip above) → Barbell warm-up: Empty bar × 8-10, 50% × 5, 70% × 3. Speed/form focus."
        },
    },

    // ========================================
    // POLISH TRANSLATIONS
    // ========================================
    pl: {
        common: {
            back: "Wróć",
            next: "Dalej",
            save: "Zapisz",
            cancel: "Anuluj",
            close: "Zamknij",
            loading: "Ładowanie...",
            saving: "ZAPISYWANIE...",
            saved: "Zapisano",
            saveChanges: "Zapisz zmiany",
            confirm: "Potwierdź",
            delete: "Usuń",
            edit: "Edytuj",
            log: "Zapisz",
            kg: "kg",
            reps: "powt.",
            sets: "serie",
            week: "Tydzień",
            day: "Dzień",
            exercises: "Ćwiczenia",
            more: "więcej",
            required: "WYMAGANE",
            exportData: "Eksportuj kopię danych",
            optional: "Opcjonalne",
            primary: "Główne",
            yes: "Tak",
            no: "Nie",
            failure: "Do upadku",
        },

        sidebar: {
            dashboard: "Pulpit",
            createAccount: "Utwórz konto",
            currentWorkout: "Aktualny trening",
            settings: "Ustawienia",
            trophyCase: "Trofea",
            loggedInAs: "Zalogowany jako:",
            logout: "Wyloguj",
            history: "Historia treningów",
        },

        workout: {
            restDayOrInvalid: "Dzień wolny lub błędna data",
            completed: "Ukończono",
            last: "ost.",
            target: "Cel:",
            giantSets: "serie gigantyczne",
            notesPlaceholder: "Notatki treningowe...",
            saving: "ZAPISYWANIE...",
            completeWorkout: "Zakończ trening",
            markAllCompleted: "Oznacz wszystko jako ukończone",
            exercisesCount: "{count} Ćwiczeń",
            andMore: "+ {count} więcej",
            sets: "serie",
            reps: "powt.",
        },

        dayNames: {
            // Common
            rest: "Odpoczynek",
            restAndRecovery: "Odpoczynek i regeneracja",

            // Bench Domination
            mondayHeavyStrength: "Poniedziałek – Siła",
            mondayPrimer: "Poniedziałek – Primer",
            mondayPeaking: "Poniedziałek - Peaking",
            tuesdayLegs: "Wtorek - Nogi",
            tuesdayLegsMaintenance: "Wtorek – Nogi (maintenance)",
            wednesdayVolumeHypertrophy: "Środa – Hipertrofia",
            wednesdayLightSpeed: "Środa – Prędkość",
            thursdayPowerSpeed: "Czwartek – Moc / Prędkość",
            thursdayRest: "Czwartek - Odpoczynek",
            fridayLegs: "Piątek - Nogi",
            tuesdayRest: "Wtorek - Odpoczynek",
            fridayRest: "Piątek - Odpoczynek",
            saturdayAMRAPTest: "Sobota - Test AMRAP",
            saturdayPeakingAMRAP: "Sobota – Peaking AMRAP",
            saturdayJudgmentDay: "Sobota – DZIEŃ SĄDU OSTATECZNEGO",
            sundayRest: "Niedziela - Odpoczynek",

            // Tydzień 9 Deload
            mondayRecovery: "Poniedziałek - Regeneracja",
            tuesdayLightLegs: "Wtorek - Lekkie Nogi",
            wednesdayLight: "Środa - Lekki",
            thursdayLightPower: "Czwartek - Lekka Moc",
            fridayLightLegs: "Piątek - Lekkie Nogi",
            saturdayTechnique: "Sobota - Technika",

            // Pencilneck
            pushAChestDeltsTri: "Push A",
            pullABackDeltBi: "Pull A",
            pushBChestDeltsTri: "Push B",
            pullBBackDeltBi: "Pull B",

            // Peachy
            mondayGluteLegHeavy: "Poniedziałek – Pośladki i nogi (ciężki)",
            wednesdayGluteUpperPump: "Środa – Pośladki i góra ciała",
            thursdayPausedSquat: "Czwartek - Przysiad z pauzą",
            fridayPosteriorChain: "Piątek - Łańcuch tylny",
            saturdayUnilateralPump: "Sobota – Lżejszy przysiad i góra ciała",

            // Skeleton
            fullBodyA: "Full Body A",
            fullBodyB: "Full Body B",
            fullBodyC: "Full Body C",

            // Pain & Glory
            pullDay: "Dzień Pull",
            pushDay: "Dzień Push",

            // Trinary
            trinaryWorkout: "Trening {num}",
            trinaryAccessory: "Dzień akcesoryjny ({type})",

            // Ritual of Strength
            ritualDay1RampIn: "Dzień 1 - Bench",
            ritualDay2RampIn: "Dzień 2 - Przysiad",
            ritualDay3RampIn: "Dzień 3 - Martwy ciąg",
            ritualDay1Bench: "Dzień 1 - Bench ME",
            ritualDay2Squat: "Dzień 2 - Przysiad ME",
            ritualDay3Deadlift: "Dzień 3 - Martwy ciąg ME",
            ritualPurgeDay1: "Tydzień Oczyszczenia - Dzień 1",
            ritualPurgeDay2: "Tydzień Oczyszczenia - Dzień 2",
            ritualPurgeDay3: "Tydzień Oczyszczenia - Dzień 3",
        },

        badges: {
            certified_threat: { description: 'Ukończ "Od Szkieletu do Zagrożenia"' },
            certified_boulder: { description: 'Ukończ "Protokół Eradykacji Ołówkowej Szyji"' },
            perfect_attendance: { description: 'Zero opuszczonych sesji' },
            bench_psychopath: { description: 'Bench Press Domination skończony + peaking + nowy PR' },
            bench_jump_20kg: { description: 'Wzrost ≥20 kg w jednym cyklu' },
            bench_jump_30kg: { description: 'Wzrost ≥30 kg w jednym cyklu' },
            deload_denier: { description: 'Nigdy nie aktywowano reaktywnego deloadu' },
            rear_delt_reaper: { description: 'Rear-delt rope pulls 4×30+ (Pencilneck)' },
            "3d_delts": { description: 'Lying laterals 3×20 @ ≥20 kg' },
            cannonball_delts: { description: 'Obie odznaki - Reaper i 3D Delts zdobyte' },
            first_blood: { description: 'Pierwszy zalogowany trening' },
            "100_sessions": { description: '100 sesji łącznie' },
            immortal: { description: 'Wszystkie programy ukończone przynajmniej raz' },
            final_boss: { description: 'Zdobyto 10+ odznak' },
            peachy_perfection: { description: 'Ukończono plan Peachy' },
            squat_30kg: { description: '+30 kg w przysiadzie' },
            glute_gainz_queen: { description: 'Wzrost pośladków ≥3 cm' },
            kas_glute_bridge_100: { description: '100 kg+ na powtórzenia' },
            void_gazer: { description: 'Ukończ Tygodnie 1-8 programu Pain & Glory' },
            emom_executioner: { description: 'Ukończ 6x5 E2MOM (Tygodnie 9-12)' },
            glory_achieved: { description: 'Ukończ Pain & Glory + Nowy PR' },
            deficit_demon: { description: '+30 kg w Deficit Snatch Grip (Tygodnie 1-8)' },
            single_supreme: { description: 'Singiel w 16. tygodniu @ ≥97% e1RM' },
            "50_tonne_club": { description: '50,000 kg łącznej objętości w Pain & Glory' },
            initiate_of_iron: { description: 'Ukończono 1 tydzień Rytuału siły' },
            disciple_of_pain: { description: 'Ukończono Ramp-up Rytuału siły' },
            acolyte_of_strength: { description: 'Pierwszy cykl Rytuału siły ukończony' },
            high_priest_of_power: { description: 'Ukończono wiele cyklu Rytuału siły + Nowy PR' },
            eternal_worshipper: { description: 'Wszystkie PR pobite podczas Rytuału siły' },
            super_mutant_aspirant: { description: 'Ukończ tydzień 12 programu Super Mutant' },
            behemoth_of_wastes: { description: 'Ukończ wszystkie 14 tygodni + nowy PR w dowolnym ruchu' }
        },

        entry: {
            title: "HYPER",
            subtitle: "PLANNER",
            needStats: "Potrzebujemy kilku liczb, żeby spersonalizować program",
            description: "Wpisz swój kod dostępu.",
            placeholder: "Wpisz kod...",
            button: "WEJDŹ",
            newRecruit: "Nowy rekrut wykryty",
            notRegistered: "nie jest zarejestrowany.",
            availablePrograms: "Dostępne programy:",
            startProgram: "ROZPOCZNIJ",
            programName: "12-Tygodniowa Dominacja Wyciskania",
            programDescription: "Program specjalizacyjny na eksplozyjny wzrost wyciskania.",
        },

        onboarding: {
            selectProtocol: "Wybierz swój protokół",
            choosePath: "Krok 2: Wybierz program transformacji.",

            programs: {
                benchDomination: {
                    name: "Bench Press Domination",
                    benchLabel: "Aktualny 1RM – Paused Bench Press (kg)",
                    description: "13-tygodniowy program siłowy z fokusem na wyciskanie, rozszerzony o tygodnie odciążeniowe dla optymalnej regeneracji. Daily Undulating Periodization - buduj siłę i masę jednocześnie.",
                    features: [
                        "Cel: Siła wyciskania",
                        "13 tygodni cyklu głównego + opcjonalnie 3 tygodnie peakingu",
                        "Elastyczny czas trwania: Rozszerzony o tygodnie odciążeniowe dla regeneracji",
                        "4 dni wyciskania + 2 dni dolnej części ciała, opcjonalne akcesoria",
                        "Autoregulacja oparta na teście AMRAP"
                    ]
                },
                pencilneck: {
                    name: "Protokół Pencilneck",
                    description: "8-tygodniowy split na górę ciała. Dla tych, których szyja wygląda jak ołówek.",
                    features: [
                        "Cel: Hipertrofia upper body",
                        "4 dni/tydzień",
                        "Split Push / Pull"
                    ]
                },
                skeleton: {
                    name: "Od Szkieleta do Zagrożenia",
                    description: "12-tygodniowy program dla początkujących. Dla tych, którzy nigdy nie ruszyli żelastwa.",
                    features: [
                        "Cel: Hipertrofia całego ciała",
                        "3 dni/tydzień",
                        "Elastyczny grafik"
                    ]
                },
                peachy: {
                    name: "Peachy",
                    description: "8-tygodniowy program hipertrofii pośladków. Zbuduj prawdziwą półkę.",
                    features: [
                        "Cel: Pośladki i dół",
                        "5 dni/tydzień",
                        "Programowanie oparte na nauce"
                    ]
                },
                painGlory: {
                    name: "Pain & Glory",
                    description: "16-tygodniowy program specjalizacyjny na martwy ciąg. Dziś ból, jutro chwała.",
                    features: [
                        "Cel: Siła w martwym ciągu",
                        "4 dni/tydzień - Pull/Push",
                        "16 tyg. z peakingiem",
                        "Autoregulacja przez uproszczony system RPE"
                    ]
                },
                trinary: {
                    name: "Trinary",
                    description: "Zaawansowana periodyzacja trójboju siłowego na podstawie metody Conjugate z elastycznym grafikiem.",
                    features: [
                        "Cel: Wycisk / Martwy / Przysiad",
                        "Elastyczny 3-4 dni/tydzień",
                        "27 treningów (9 bloków)",
                        "Autoregulacja przez słabe punkty"
                    ]
                },
                ritualOfStrength: {
                    name: "Rytuał Siły",
                    description: "3 dni/tydzień prograu trójboju siłowego z minimalną efektywną dawką.",
                    features: [
                        "Cel: Wycisk / Martwy / Przysiad",
                        "3 dni/tydzień (Pon/Śr/Pt idealnie)",
                        "16 tyg. (z opcjonalną 4-tyg. rozgrzewką)",
                        "ME single + progresja na podstawie oceny RPE"
                    ]
                },
                superMutant: {
                    name: "Super Mutant",
                    description: "Zaawansowany 12+2 tyg. program kulturystyczny o wysokiej częstotliwości w stylu Fallout. Przyjmij mutację poprzez ból i żelazo.",
                    features: [
                        "Cel: Wszystkie grupy mięśniowe",
                        "Dynamiczny 4-6 sesji/tydzień",
                        "Auto-adaptacyjny system przerw (48h góra / 72h dół)",
                        "Reaktywny cel objętości ~20 serii/mięsień/tydzień",
                        "Progresywny wzrost RPE (8→9→9.5→10)"
                    ]
                }
            },

            // Pain & Glory Calibration
            painGlory: {
                calibrationTitle: "Faza kalibracji",
                calibrationDesc: "Podaj swój 1RM klasycznego martwego ciągu i przysiadu low bar. Bądź szczery - program sam się reguluje (lepiej zacząć konserwatywnie).",
                deadliftLabel: "Klasyczny martwy ciąg 1RM (kg)",
                deadliftHint: "Prawdziwe maksimum, nie szacunek.",
                squatLabel: "Low Bar Squat 1RM (kg)",
                squatHint: "Głębokość poniżej kąta 90 stopni w kolanie.",
                scheduleTitle: "Sugerowany grafik:",
                scheduleDesc: "Pon: Pull / Wt: Push / Czw: Push / Pt: Pull (Odp: Śr, Sob, Ndz)",
                buildButton: "WYKUJ MÓJ LOS"
            },

            // Trinary Calibration
            trinary: {
                calibrationTitle: "Faza kalibracji",
                calibrationDesc: "Podaj swój 1RM dla wszystkich trzech bojów. Bądź szczery - program sam się reguluje (lepiej zacząć konserwatywnie).",
                benchLabel: "Wyciskanie na ławce 1RM (kg)",
                benchHint: "Z sekundową pauzą.",
                deadliftLabel: "Klasyczny martwy ciąg 1RM (kg)",
                deadliftHint: "Prawdziwe maksimum, nie szacunek.",
                squatLabel: "Low Bar Squat 1RM (kg)",
                squatHint: "Głębokość poniżej kąta 90 stopni w kolanie.",
                scheduleTitle: "Sugerowany grafik:",
                scheduleDesc: "Trenuj 3-4 dni w tygodniu (np. Pon/Śr/Pt/Sob). Aplikacja śledzi treningi – po 4 treningach/tydzień, dni akcesoryjne aktywują się automatycznie.",
                buildButton: "ZACZYNAMY!"
            },

            // Ritual of Strength Calibration
            ritualOfStrength: {
                firstProgramQuestion: "Czy to Twój pierwszy program trójboju siłowego?",
                firstProgramYes: "Tak - Potrzebuję rozgrzewki",
                firstProgramNo: "Nie - Przejdź do fazy głównej",
                firstProgramNote: "Uwaga: Jeśli to Twój pierwszy program trójboju siłowego, rozpoczniesz od 4-tygodniowej fazy rozgrzewkowej, aby zbudować właściwą technikę i pewność siebie.",
                calibrationTitle: "Podaj swój 1RM (tylko kg)",
                calibrationDesc: "Wpisz przybliżony 1RM dla każdego ruchu. Program automatycznie reguluje się na ich podstawie.",
                benchLabel: "Wyciskanie z pauzą 1RM (kg)",
                benchHint: "Z pauzą na klatce, pełny ROM.",
                deadliftLabel: "Klasyczny martwy ciąg 1RM (kg)",
                deadliftHint: "Prawdziwe maksimum, nie szacunek.",
                squatLabel: "Low Bar Squat 1RM (kg)",
                squatHint: "Głębokość poniżej równoległej, pełny ROM.",
                scheduleTitle: "Częstotliwość treningu",
                scheduleDesc: "Zalecane 3 dni/tydzień (idealnie Pon/Śr/Pt). Przynajmniej 1 dzień odpoczynku między sesjami.",
                selectDaysPrompt: "Wybierz swoje 3 dni treningowe:",
                buildButton: "ROZPOCZNIJ RYTUAŁ",

                // Recovery Check Modal (Weeks 8, 12, 16)
                recoveryCheckTitle: "Sprawdzenie Regeneracji",
                recoveryCheckDesc: "Oceń swoją regenerację przez ostatnie 4 tygodnie (1-10, gdzie 10 = perfekcja)",
                recoveryRating: "Ocena Regeneracji",
                recoveryPoor: "Słaba (≤6) - Zalecany natychmiastowy Tydzień Oczyszczenia",
                recoveryGood: "Dobra - Kontynuuj zgodnie z planem",
                submitRecovery: "ZATWIERDŹ",

                // Weak Point Modal (After Ascension Tests)
                weakPointTitle: "Zidentyfikuj Swoje Słabe Punkty",
                weakPointDesc: "Gdzie miałeś największe trudności podczas Testu Wzniesienia?",
                weakPointBench: "Słaby punkt w wyciskaniu:",
                weakPointSquat: "Słaby punkt w przysiadzie:",
                weakPointDeadlift: "Słaby punkt w martwym ciągu:",
                weakPointOffChest: "Z klatki",
                weakPointMid: "Środek ruchu",
                weakPointLockout: "Zamknięcie",
                weakPointBottom: "Dół",
                weakPointTop: "Góra",
                submitWeakPoints: "DALEJ",

                // Re-Run Modal (End of Week 16)
                rerunTitle: "Rytuał ukończony, czy zaczynamy kolejny cykl?",
                rerunDesc: "Ukończyłeś Rytuał Siły.",
                rerunStats: "Twój Postęp:",
                rerunContinue: "ROZPOCZNIJ NOWY CYKL",
                rerunEnd: "ZAKOŃCZ RYTUAŁ",

                // Ascension Test UI
                ascensionTestComplete: "TEST ASCENSJI UKOŃCZONY",
                ascensionTestCongrats: "Żelazni bogowie byli świadkami twojego poświęcenia",
                new1RMs: "Nowe Szacowane 1RM:"
            },

            buildPerfectHell: "Zbuduj swój idealny program!",
            customizeBrutality: "Dostosuj brutalność.",
            modules: {
                title: "Moduły programu",
                description: "Wybierz, które moduły chcesz włączyć do programu.",
                selectDays: "Wybierz dni treningowe",
                coreBench: {
                    title: "Główna progresja wyciskania",
                    description: "Najbrutalniejsza apka do śledzenia treningów, jakiej kiedykolwiek użyjesz.",
                },
                tricepGiantSets: {
                    title: "Tricep Giant Set",
                    description: "3× Giant Set: dips → rolling extensions → banded skullcrushers"
                },
                behindNeckPress: {
                    title: "Behind-the-Neck Press",
                    description: "Rozbudowanie barków dla zaawansowanych"
                },
                weightedPullups: {
                    title: "Podciąganie z obciążeniem w stylu EMOM",
                    pullupLabel: "Maks. podciągnięcie z obciążeniem (dodatkowe kg)",
                    description: "Siła pleców na stabilność w wyciskaniu. Śr. i Sob."
                },
                legDays: {
                    title: "Dni nóg",
                    description: "Opcjonalny trening nóg"
                },
                accessories: {
                    title: "Ćwiczenia akcesoryjne - core i stabilność łopatek",
                    description: "Dragon Flags, Y-Raises, Around-the-Worlds."
                }
            },

            trainingSchedule: "Grafik treningowy",
            selectDays: "Wybierz dni treningowe",
            days: {
                monday: "Poniedziałek",
                tuesday: "Wtorek",
                wednesday: "Środa",
                thursday: "Czwartek",
                friday: "Piątek",
                saturday: "Sobota",
                sunday: "Niedziela"
            },

            customizeProtocol: "Dostosuj protokół",
            chooseMovements: "Wybierz preferowane ćwiczenia.",
            preferences: {
                title: "Dostosuj protokół",
                description: "Wybierz preferowane ćwiczenia.",
                pushALegPrimary: "Push A: Główne ćwiczenie na nogi",
                pushBChestIsolation: "Push B: Izolacja klatki",
                pushBLegSecondary: "Push B: Dodatkowe ćwiczenie na nogi"
            },
            exerciseOptions: {
                hackSquat: "Hack Squat",
                highFootLegPress: "Leg Press (stopy wysoko na platformie)",
                pecDec: "Pec-Dec",
                lowToHighCableFlyes: "Rozpiętki w górę (wyciąg)",
                frontSquats: "Front Squat",
                narrowStanceLegPress: "Leg Press (wąski rozstaw stóp)",
                stilettoSquats: "Przysiady na podwyższeniu",
                squatHelper: "Twój aktualny 1 Rep Max na przysiadzie",
            },

            calibrationPhase: "Faza kalibracji",
            enterStats: "Wpisz aktualne 1RM. Od nich zależą wszystkie obliczenia. Bądź szczery - program sam się reguluje (lepiej zacząć konserwatywnie).",
            stats: {
                pausedBench: "Wyciskanie pauzowane 1RM (główne)",
                wideGripBench: "Szeroki chwyt 1RM (opcja)",
                spotoPress: "Spoto Press 1RM (opcja)",
                lowPinPress: "Low Pin Press 1RM (opcja)"
            },
            estPlaceholder: "Szac.:",

            buildProgram: "ZBUDUJ PROGRAM",
            building: "BUDOWANIE...",
            begin: "ZACZNIJ TRENING",
            nextExerciseSelection: "DALEJ: WYBÓR ĆWICZEŃ",
        },

        dashboard: {
            timeTo: "Time to",
            eradicateThe: "Protokół Eradykacji Ołówkowej Szyji:",
            becomeA: "Stań się",
            dominate: "Dominate",
            weakness: "Aktywowany",
            threat: "Zagrożeniem",
            welcomeBack: "Witaj",

            feelingFroggy: "Status:",
            froggyStatus: "Żabka",
            feelingPeachy: "Status:",
            peachyStatus: "Brzoskwinka",

            cycleTitle: "Cykl {cycle}: Ciężej. Brutalniej. Barki nadchodzą.",
            cycleDescription: "Obowiązkowe techniki intensywności aktywne. Ciężary podniesione. Powodzenia.",

            completion: {
                skeletonTitle: "Jesteś teraz zagrożeniem",
                skeletonSubtitle: "Szkielet nie żyje. Niech żyje maszyna.",
                pencilneckTitle: "WYELIMINOWANY",
                pencilneckSubtitle: "Status patyczaka: COFNIĘTY. Barki: 3D.",
                certifiedThreat: "CERTYFIKOWANE ZAGROŻENIE",
                certifiedBoulder: "CERTYFIKOWANY GŁAZ",
                claimVictory: "ODBIERZ ZWYCIĘSTWO",
                startCycle2: "ZACZNIJ CYKL 2 (CIĘŻSZY)"
            },

            nextSteps: {
                title: "ODBLOKOWANO KOLEJNY POZIOM",
                skeletonDescription: "Ukończyłeś \"Ze Szkieletu w Zagrożenie\". Jesteś gotowy na zaawansowane programowanie. Skonsultuj się z trenerem personalnym.",
                pencilneckDescription: "Ukończyłeś 2 cykle \"Protokołu Eliminacji Patyczaka\". Twoje barki są teraz certyfikowanymi głazami. Skonsultuj się z trenerem personalnym.",
                contactTrainer: "SKONTAKTUJ SIĘ Z TRENEREM"
            },

            cards: {
                est1rm: "Szac. 1RM (z AMRAP)",
                calculatedMax: "Obliczone maksimum",
                weeklyGluteTracker: "Tygodniowy tracker pośladków",
                currentCircumference: "Obecny obwód (cm)",
                latestGrowthTrend: "Ostatni trend wzrostu",
                programStatus: "Status programu",
                viewingSchedule: "Podgląd grafiku",
                activeModules: "Włączone moduły",
                coreBench: "Główne wyciskanie",
                benchHelper: "Twój aktualny 1 Rep Max na pauzowanym wyciskaniu",
                strengthProgression: "Progresja siły",
                squatStrengthProgression: "Progresja przysiadu"
            },

            mandatoryDeload: "OBOWIĄZKOWY DELOAD",
            peakingBlock: "PEAKING BLOK",
            nExercises: "{count} Ćwiczeń",

            // Trinary Dashboard
            trinary: {
                title: "TRINARY",
                tagline: "Metoda Conjugate – trening dostosowany do słabych punktów",
                workoutProgress: "Trening {current} z {total}",
                scheduleTip: "Wskazówka",
                scheduleAdvice: "Dla najlepszych rezultatów trenuj 3-4 dni/tydzień (np. Pon/Śr/Pt/Sob). Aplikacja śledzi treningi – po 4 treningach/tydzień, dni akcesoryjne aktywują się automatycznie.",
                progressTitle: "Ukończone treningi",
                block: "Blok",
                nextWorkout: "Trening {num}",
                readyWhenYouAre: "Gotowe, kiedy ty. Trenuj według swojego grafiku.",
                startWorkout: "ROZPOCZNIJ TRENING",
                accessoryTriggered: "Nadmiar treningów w tym tygodniu – dni akcesoryjne wyzwolone",
                startAccessory: "ROZPOCZNIJ AKCESORIA",
                skipAccessory: "POMIŃ AKCESORIA",
                accessoryRecommendation: "⚠️ Pomijanie niezalecane – akcesoria celują w słabe punkty",
                manualAccessoryHint: "Potrzebujesz dodatkowej regeneracji lub objętości? Ręcznie uruchom dzień akcesoryjny.",
                startManualAccessory: "Rozpocznij ręczny dzień akcesoryjny"
            },

            // Super Mutant Dashboard
            superMutant: {
                tagline: "Czas rozpocząć mutację",
                recoveryInfo: "Górne: 48h (38h+ trenowalne) • Dolne: 72h (62h+ trenowalne)",
                mindsetTitle: "— MUTANT MINDSET —",
                nextSession: "Następna Sesja Mutacji",
                dynamicWorkout: "Dynamiczny trening oparty na Twojej regeneracji"
            }
        },

        // Trinary Modals
        trinary: {
            weakPointModal: {
                title: "Zidentyfikuj słabe punkty",
                description: "Dla każdego boju wybierz, gdzie sztanga zwalnia lub się zatrzymuje. To określi warianty ćwiczeń na następny blok.",
                tipTitle: "Wskazówka",
                tipText: "Obejrzyj nagrania lub poczuj, gdzie sztanga zwalnia/zatrzymuje się. Jeśli nie jesteś pewny, wybierz fazę, która wydaje się najtrudniejsza.",
                benchTitle: "Wyciskanie na ławce",
                benchOffChest: "Z klatki (pierwsze 5-8 cm)",
                benchMidRange: "Środek zakresu (w połowie drogi)",
                benchLockout: "Lockout (ostatnie centymetry)",
                deadliftTitle: "Martwy ciąg",
                deadliftLiftOff: "Start z podłogi",
                deadliftOverKnees: "Nad kolanami (do kolan)",
                deadliftLockout: "Lockout (od kolan do bioder)",
                squatTitle: "Przysiad",
                squatBottom: "Dół (wyjście z dołka)",
                squatMidRange: "Środek zakresu (w połowie drogi)",
                squatLockout: "Lockout (końcowy napęd)",
                variations: "Możliwe warianty",
                submit: "ZAPISZ I KONTYNUUJ"
            },
            rerunModal: {
                title: "Trinary ukończony! 🎉",
                description: "Ukończyłeś 27 treningów (9 bloków). Wybierz następny krok – deload jest zalecany.",
                optionATitle: "Tydzień deloadu (zalecane)",
                optionADesc: "1 tydzień przy 50% objętości ME/DE/RE, ze zredukowaną intensywnością:",
                optionADetail1: "ME: -25% intensywności (bloki zaczynają od niższych %)",
                optionADetail2: "DE: -15% intensywności",
                optionADetail3: "RE: -15% intensywności",
                optionAButton: "DELOAD I RESTART",
                optionBTitle: "Kontynuuj bez deloadu",
                optionBDesc: "Zacznij od razu z nowymi wariantami na podstawie zaktualizowanych słabych punktów.",
                optionBButton: "BEZ DELOADU, KONTYNUUJ",
                optionCTitle: "4-5 dni odpoczynku",
                optionCDesc: "Weź kompletny odpoczynek lub zrób lekką pracę akcesoryjną na RPE 7-8. Potem zacznij z nowymi wariantami.",
                optionCButton: "ODPOCZYNEK"
            },
            rpeSelector: {
                title: "Jak czułeś się w ostatniej serii? (RPE na ostatnim secie)",
                description: "Wybierz na podstawie odczuwanego wysiłku – to określa progresję 1RM na następny blok."
            },
            accessoryModal: {
                title: "Wybierz fokus akcesoryjny",
                description: "Wybierz, które grupy mięśniowe chcesz dzisiaj trenować",
                upperTitle: "Góra ciała",
                upperDesc: "Triceps, barki, plecy",
                lowerTitle: "Dół ciała",
                lowerDesc: "Pośladki, ścięgna, czworogłowe, core"
            }
        },

        pencilneck: {
            weekStatus: "Status tygodnia {week}",
            trapBarometer: "Barometr kapturów",
            pencil: "Ołówkoszyjny",
            boulder: "Głazoramienny",
            percentGone: "{percent}% DROGI",
            restDayThought: "Myśl na dzień wolny",
            commandmentsTitle: "5 Przykazań Wzrostu",
            quotes: [
                "Twoje dawne ja płacze w kącie, patrząc jak zjadasz 500 g ryżu.",
                "Gdzieś grafik właśnie stracił zlecenie – twoje kaptury pożarły logo.",
                "Lustra składają oficjalne skargi.",
                "Twoja szyja dzwoniła – nie zaginęła.",
                "Koszulki założyły związek zawodowy przeciwko tobie.",
                "Dzieci myślą, że jesteś dwiema osobami stojącymi blisko siebie.",
                "Ościeżnice szepczą „nie dzisiaj”, gdy się zbliżasz.",
                "Twój cień ma rozstępy.",
                "Stare zdjęcia ciebie są teraz używane jako listy gończe.",
                "Lotniska kasują cię za dwa miejsca.",
                "Twoje barki dołączyły do czatu.",
                "Słońce teraz orbituje wokół twoich barków.",
                "Pasy bezpieczeństwa oplatają cię dwa razy.",
                "NASA właśnie pytała o wymiary twojego karku.",
                "Twoje najszersze grzbietu mają własny kod pocztowy.",
                "Twoje kaptury zablokowały komuś Wi-Fi.",
                "Bluzy z kapturem ubiegają się o azyl.",
                "Już nie mieścisz się w selfie.",
                "Twoje tylne barki mają własne tylne barki.",
                "Gratulacje. Jesteś teraz końcowym bossem planety Ziemia."
            ]
        },

        skeleton: {
            metamorphosis: "Metamorfoza",
            weeksLeft: "tygodni do końca",
            untilNoLongerSkeleton: "aż przestaniesz być szkieletem.",
            deficitPushupPR: "Rekord pompek z deficytu",
            perfectRepsSingleSet: "Idealne powtórzenia w jednej serii",
            restDayQuote: "Twoje mięśnie właśnie tkają zbroję."
        },

        commandments: {
            title: "5 Przykazań Wzrostu",
            list: [
                "Nadwyżka 300–500 kcal – OBOWIĄZKOWA",
                "Kontroluj opuszczanie – nie odbijaj na dole powtórzenia",
                "Zawsze rozgrzej się co najmniej 1 serią 12 powt. na 50% ciężaru roboczego",
                "Trenuj ciężko – zostawiaj tylko 1–3 powtórzenia w zapasie (RIR) na każdej serii",
                "Śpij minimum 7 godzin"
            ]
        },

        crossroads: {
            title: "ROZSTAJE",
            survived: "Przetrwałeś 12 tygodni piekła. Teraz musisz zrobić zrobić mały deload i zadecydować o swoim losie.",
            restTimer: "Obowiązkowy timer odpoczynku",
            daysLeft: "DNI ZOSTAŁO",
            restAdvice: "Zluzuj z treningiem. Śpij. Jedz.",
            proceedQuestion: "Po odpoczynku, jak chcesz kontynuować?",
            optionA: {
                title: "Opcja A: Peaking (zalecane)",
                description: "Wejdź w 3-tygodniowy blok peakingowy (tyg. 13-15), by przyzwyczaić się do ciężkich obciążeń i wyraźnie szczytować na nowe 1RM."
            },
            optionB: {
                title: "Opcja B: Testuj teraz",
                description: "Pomiń blok peakingowy i testuj 1RM od razu, czyli \"YOLO\"."
            }
        },

        settings: {
            title: "Ustawienia",
            description: "Zarządzaj preferencjami programu.",

            exercisePreferences: "Preferencje ćwiczeń",
            exercisePreferencesDesc: "Dostosuj swoje wybory ćwiczeń \"LUB\". Zmiany będą stosowane do przyszłych treningów.",
            pushALegPrimary: "Push A: Główne nogi",
            pushBChestIsolation: "Push B: Izolacja klatki",
            pushBLegSecondary: "Push B: Dodatkowe nogi",

            programModules: "Moduły programu",
            programModulesDesc: "Włącz lub wyłącz opcjonalne komponenty 12-tygodniowego bloku Dominacji Wyciskania.",

            manual1rmOverride: "Ręczne nadpisanie 1RM",
            manual1rmDesc: "Ręcznie dostosuj 1RM w wyciskaniu pauzowanym.",
            manual1rmWarning: "⚠️ UWAGA: Zmieniaj to tylko gdy naprawdę konieczne (np. restart po kontuzji, znacząca utrata siły, lub gdy autoregulacja kompletnie nie działa). Program automatycznie dostosowuje 1RM na podstawie sobotniego AMRAP. Sztuczne zawyżanie doprowadzi do porażki.",
            pausedBench1rm: "Wyciskanie pauzowane 1RM (kg)",
            currentCalculatedMax: "Aktualne obliczone maksimum",

            programSettings: "Ustawienia programu",
            noConfigurableSettings: "Ten program nie ma konfigurowalnych ustawień.",
            programManagement: "Zarządzanie programem",
            programManagementDesc: "Zarządzaj aktywnym programem i danymi postępu.",
            switchProgram: "Zmień program",
            switchProgramDesc: "Zachowaj obecny postęp i zacznij inny protokół.",
            resetProgress: "Zresetuj postęp",
            resetProgressDesc: "Zresetuj sesje do Tyg. 1 Dzień 1. Statystyki i historia zachowane.",
            resetProgressButton: "Resetuj postęp",

            exportDataBackup: "Eksportuj kopię zapasową"
        },

        history: {
            title: "Historia treningów",
            loading: "Ładowanie logów...",
            noWorkouts: "Brak zapisanych treningów",
            noWorkoutsDesc: "Czas przerzucić trochę żelastwa.",
            weekDay: "Tydzień {week} Dzień {day}"
        },

        alerts: {
            errorSaving: "Błąd zapisu treningu. Spróbuj ponownie.",
            progressReset: "Postęp zresetowany pomyślnie.",
            selectDays3: "Wybierz dokładnie 3 dni treningowe.",
            selectDays4: "Wybierz dokładnie 4 dni treningowe.",
            invalidBench: "Wpisz prawidłowe 1RM wyciskania pauzowanego większe niż 0.",
            buildFailed: "Nie udało się zbudować programu:",
            accessDenied: "DOSTĘP ZABRONIONY",
            deleteFailed: "Nie udało się usunąć użytkownika.",
            updateSuccess: "Użytkownik zaktualizowany pomyślnie.",
            updateFailed: "Aktualizacja nie powiodła się.",
            confirmReset: "Czy na pewno chcesz zresetować postęp dla tego programu? Tego nie można cofnąć.",
            unknownError: "Nieznany błąd"
        },

        days: {
            monday: "Poniedziałek",
            tuesday: "Wtorek",
            wednesday: "Środa",
            thursday: "Czwartek",
            friday: "Piątek",
            saturday: "Sobota",
            sunday: "Niedziela",
            mondayHeavy: "Poniedziałek - Ciężka siła",
            tuesdayLegs: "Wtorek - Nogi",
            wednesdayVolume: "Środa - Hipertrofia objętościowa",
            thursdayPower: "Czwartek - Moc / Prędkość",
            fridayLegs: "Piątek - Nogi",
            saturdayAmrap: "Sobota - Test AMRAP",
            restRecovery: "Odpoczynek i regeneracja"
        },

        exercises: {
            "Paused Bench Press": "Wyciskanie pauzowane",
            "Wide-Grip Bench Press": "Wyciskanie szerokim chwytem",
            "Behind-the-Neck Press": "Wyciskanie zza karku",
            "Tricep Giant Set": "Giant set na triceps",
            "Dragon Flags": "Dragon Flags",
            "Walking Lunges": "Wykroki w marszu",
            "Heels-Off Narrow Leg Press": "Leg Press (pięty w górze, wąsko)",
            "Reverse Nordic Curls": "Odwrócone Nordic Curls",
            "Single-Leg Machine Hip Thrust": "Hip Thrust jednónoż (maszyna)",
            "Nordic Curls": "Nordic Curls",
            "Hack Squat Calf Raises": "Łydki na Hack Squat",
            "Hip Adduction": "Przywodzenie bioder",
            "Spoto Press": "Spoto Press",
            "Weighted Pull-ups": "Podciągania z obciążeniem",
            "Y-Raises": "Y-Raises",
            "Around-the-Worlds": "Around-the-Worlds",
            "Low Pin Press": "Low Pin Press",
            "Paused Bench Press (AMRAP)": "Wyciskanie pauzowane (AMRAP)",
            "Paused Bench Press (Back-off)": "Wyciskanie pauzowane (back-off)",
            "Dips": "Dipy",
            "Rolling DB Tricep Extensions": "Rolling tricep extensions (hantle)",
            "Banded EZ Bar Skullcrushers": "Skullcrushers z gumą (EZ bar)",
        },

        quotes: {
            painGloryBadges: {
                void_gazer: "Spojrzałeś w otchłań deficytu – i to ona pierwsza mrugnęła.",
                emom_executioner: "6×5 co 2 minuty. Nie odpuściłeś. Sztanga odpuściła.",
                glory_achieved: "Ból się opłacił. Chwała jest Twoja. Teraz idź i pobij to jeszcze raz.",
                deficit_demon: "Większość ucieka przed deficytami. Ty uczyniłeś je swoimi niewolnikami.",
                single_supreme: "Jedno powtórzenie. Jeden moment. Jedna legenda.",
                "50_tonne_club": "Cały Boeing 737.",
                initiate_of_iron: "Pierwsza ofiara została złożona. Żelazni bogowie cię dostrzegają.",
                disciple_of_pain: "Cztery tygodnie oddania. Zasłużyłeś na prawo do dalszego cierpienia.",
                acolyte_of_strength: "Szesnaście tygodni rytuału. Ścieżka ascenzji trwa.",
                high_priest_of_power: "Wiele cykli. Wiele rekordów życiowych. Jesteś jednością z żelazem.",
                eternal_worshipper: "Śmiertelne ograniczenia zniszczone. Stałeś się legendą.",
                super_mutant_aspirant: "Promieniowanie cię zmieniło. Tydzień 12 ukończony – już nie jesteś człowiekiem.",
                behemoth_of_wastes: "Nie do powstrzymania. Nieśmiertelny. Pustkowia kłaniają się przed tobą. Status Behemotha osiągnięty."
            },
            pencilneckStatus: [
                "Szyja wciąż wygląda jak wieszak na ubrania",
                "Obojczyki zaczynają się chować",
                "Deltki rzucają już cień",
                "Koszulki zaczynają się poddawać",
                "Pierwsze udokumentowane zderzenie z framugą",
                "Szyja oficjalnie zniknęła - misja zakończona sukcesem",
                "Ludzie pytają czy 'w ogóle ćwiczysz bro?' ze strachu",
                "Jesteś teraz certyfikowanym głazem ramiennym"
            ],
            pencilneckRestDay: [
                "Twoje dawne ja płacze w kącie patrząc jak jesz 500g ryżu.",
                "Gdzieś grafik właśnie stracił klienta, bo twoje kapturki zjadły logo.",
                "Lustra składają skargi.",
                "Twoja szyja dzwoniła – nie tęskni.",
                "Koszulki się związkowały przeciwko tobie.",
                "Dzieci myślą, że to dwóch ludzi stojących blisko siebie.",
                "Framugi szepczą 'nie dzisiaj' gdy się zbliżasz.",
                "Twój cień ma rozstępy.",
                "Stare zdjęcia ciebie są teraz klasyfikowane jako plakaty o zaginionych.",
                "Linie lotnicze liczą ci za dwa miejsca.",
                "Twoje deltki weszły na czat.",
                "Słońce teraz orbituje wokół twoich barków.",
                "Pasy bezpieczeństwa owijają się dwa razy.",
                "NASA właśnie poprosiła o wymiary twojego jarzma.",
                "Twoje plecy mają własny kod pocztowy.",
                "Twoje kapturki zablokowały komuś Wi-Fi.",
                "Bluzy składają wnioski o azyl.",
                "Nie mieścisz się już w selfie.",
                "Twoje tylne deltki mają tylne deltki.",
                "Gratulacje. Jesteś teraz final bossem planety Ziemia."
            ]
        },

        superMutantQuotes: [
            "Promieniowanie przekształca słabość w siłę",
            "Każde powtórzenie zbliża cię do mutacji",
            "Ból to ścieżka do ewolucji",
            "Pustkowia wymagają siły",
            "Przyjmij spalanie - to twoje DNA się zmienia",
            "Normalni ludzie odpoczywają. Mutanci adaptują się.",
            "Twoje limity były ludzkie. Stajesz się czymś więcej.",
            "FEV przepływa przez żelazo i pot",
            "Ewolucja nie jest wygodna. Nie przestawaj.",
            "Super Mutanci nie szukają wymówek",
            "Stare ja umarło. Nowe ja jest nie do powstrzymania.",
            "Choroba popromienna to tylko ukryte przyrosty"
        ],

        tips: {
            pausedBench: "Rozgrzewka: szybka progresja ciężaru, mało powtórzeń, pauza w każdej serii. Oszczędzaj energię. Sztanga zatrzymuje się całkowicie na klatce, 0.5-1 sek pełnej pauzy. Rozgrzej obręcz barkową, lekko spompuj najszerszy grzbietu, wykonaj kilka dynamicznych ruchów a'la mostkowanie i glute bridge jednonóż z przytrzymaniem w spięciu zanim przejdziesz do rozgrzewki ze sztangą (lub pomiędzy seriami rozgrzewkowymi).",
            wideGripBench: "Szeroki chwyt z łokciami na zewnątrz. Skup się na głębokim rozciągnięciu na dole. 📈 Zrób max powt. (8) na WSZYSTKICH seriach przez 2 tygodnie z rzędu → +2.5 kg",
            spotoPress: "Zatrzymaj sztangę 4-8 cm nad klatką, trzymaj 1 sek, potem wyciśnij eksplozywnie. 📈 Docelowe powt. na WSZYSTKICH seriach = +2.5 kg następna sesja",
            lowPinPress: "Ustaw piny na swoim martwym punkcie. Eksplozywne wyciskanie z martwego startu. 📈 Docelowe powt. na WSZYSTKICH seriach = +2.5 kg następna sesja",
            pausedBenchAMRAP: "AMRAP napędza progresję! Tyg. 1-6: ≥12 powt., Tyg. 7-9: ≥10 powt., Tyg. 10-12: ≥8 powt.",
            pausedBenchWednesday: "Zostaw 2 powtórzenia w zapasie w serii 1 i 2 oraz 1 powtórzenie w serii 3 i 4.",
            pausedBenchBackoff: "Praca nad techniką - skup się na idealnej formie, kontrolowane tempo.",
            tricepGiantSet: "~10 sek przerwy między ćwiczeniami. 2 min przerwy między seriami. Zrób 25 powt. Skullcrusherów z gumą, by progresnąć ciężar.",
            dragonFlags: "Oszukuj fazę koncentryczną jeśli trzeba, kontroluj ekscentrykę (3-5 sek opuszczania).",
            walkingLunges: "Długie kroki, nie odpychaj się tylną nogą. Napędzaj przednią piętą.",
            walkingLungesWeek11: "Długie kroki, nie odpychaj się tylną nogą. Ostatnia seria: rest-pause do upadku.",
            heelsOffLegPress: "Kolana na zewnątrz, głębokie rozciągnięcie na dole. Próbuj dotknąć dwugłowymi łydek.",
            heelsOffLegPressWeek11: "Kolana na zewnątrz, głębokie rozciągnięcie. Ostatnia seria: potrójny drop set.",
            reverseNordic: "1 seria z obciążeniem, 1 z obciążeniem + drop do własnej masy.",
            singleLegHipThrust: "Napędzaj piętą, pełne wyprostowanie bioder, brutalny ścisk pośladków na górze.",
            singleLegHipThrustWeek11: "Eksplozywne powtórzenia. Ostatnia seria: 20 sek izometryczny hold + częściówki.",
            nordicCurls: "Oszukuj koncentrykę jeśli poniżej 5 powt. Kontroluj ekscentrykę (3-5 sek opuszczania).",
            hackSquatCalves: "Przeciśnij się przez pieczenie. Idź 0-1 powt. od upadku w każdej serii.",
            hipAdduction: "Rozciągnij na rozgrzewce, potem max szerokość. Użyj rąk do wklinowania się w pozycję jeśli trzeba.",
            aroundTheWorlds: "Jeśli 16 powt. jest łatwe, zwolnij ekscentrykę (3-4 sek).",
            yRaises: "Skup się na retrakcji łopatek. Zamień na facepulle jeśli problemy z barkiem.",
            highElbowFacepulls: "Wyciąg na wysokości czoła, szerokie łokcie, rotacja zewnętrzna na górze (kciuki do tyłu). Lekki ciężar, idealna forma.",
            behindNeckPress: "Czysto technicznie, bez rozpędu.",

            pullupWeeks1to3: "Dodaj najmniejszy krążek. Maks. czystych powtórzeń EMOM, aż technika się załamie. (EMOM: start co minutę, reszta to odpoczynek)",
            pullupWeeks4to6: "Dodaj 10-15 kg. 3-5 powt. EMOM przez 12-15 minut.",
            pullupWeeks7to9: "Dzienny maks. na 3 powt. + 4-6 lżejszych serii po 3 @ 85-90%.",
            pullupWeek10: "Znajdź swój maksymalny ciężar na pojedyńcze powtórzenie.",
            pullupWeeks11to12: "3-5 serii po 2-3 powt. @ 90-95%.",
            pullupWeeks11to13Note: "Wszystkie serie @ 92.5% twojego maks. z Tyg. 10. Celuj w czyste powtórzenia, pobij objętość z serii oddechowych z Tyg. 10.",

            sumoDeadlift: "Ciężkie powtórzenia! Używaj pasków. 1-2 sek ścisk na górze – myśl 'zgniatanie orzechów' pośladkami.",
            bulgarianSplitSquat: "Trzymaj stojak jedną ręką, hantlę w drugiej. Tylna stopa sznurówkami na ławce (palce W DÓŁ). Siadaj do tyłu - ogranicz ruch kolana do przodu, trzymaj tors prosto.",
            squatLabel: "Aktualny 1RM – Squat (kg)",
            squats: "Na każdym powtórzeniu kąt w kolanie musi zejść poniżej 90°. Dodaj 2.5 kg, gdy zrobisz 3×10.",
            seatedHamstringCurl: "Pochyl tułów do przodu dla mega rozciągnięcia. Kontroluj opuszczanie.",
            kasGluteBridge: "Górna część pleców na ławce. Opuszczaj tylko 5-10 cm – nigdy nie dotykaj podłogi. Ciągłe napięcie.",
            hyperextension45: "Lekko zaokrąglij górną część pleców, stopy rozstawione 45° do zewnątrz, wciśnij biodra MOCNO w podkladkę. Czysty hip hinge.",
            militaryPress: "Czysto technicznie, bez pomocy nóg. Klatka do góry, ściśnij barki na górze.",
            inclineDBBench: "Łokcie szeroko, łuk w plecach, pełne rozciągnięcie na dole (hantle dotykają bicepsów). Myśl „sięganie do przodu” klatką piersiową.",
            invertedRows: "Zaokrąglij barki do przodu na dole dla maks. rozciągnięcia. Biodra idealnie proste.",
            sideLyingRearDeltFly: "Mały palec prowadzi, myśl „nalewanie wody” na górze.",
            dbRDL: "Ciężkie powtórzenia! Paski OK. 1-2 sek ścisk pośladków na górze.",
            pausedSquat: "80% ciężaru z poniedziałkowego przysiadu. 2 pełne sekundy w dołku – bez odbijania.",
            ghr: "3-5 sek opuszczanie (tylko ekscentryk). Oszukiwane powtórzenia w górę (zegnij się w biodrach).",
            legPressCalves: "Pełne rozciągnięcie na dole, eksplozywnie w górę. Zatrzymaj się 0-1 powt. przed upadkiem.",
            deficitReverseLunge: "Przednia stopa na krążku. Tylne kolano dotyka podłogi za każdym powtórzeniem.",
            deficitPushups: "Nogi na podniesieniu, aby były równoległe do podłogi. Klatka do podłogi za każdym powtórzeniem. Nie dasz rady 5? Zejdź na kolana i kontynuuj.",
            assistedPullups: "Jedna stopa na skrzynce/ławce przed sobą, aby pomóc sobie w górę. Ogranicz pomoc do minimum. Najpierw czyste powt., potem pomagaj sobie od skrzynki/ławki.",
            yRaisesPeachy: "Mały palec prowadzi, kciuki w górę, rotacja zewnętrzna na górze.",
            lyingCableLatRaises: "Ciągnij „od” ciała, nie w górę. Skup się na rozciągnięciu bocznej części barku.",
            glutePumpFinisher: "100 powt. hip thrust/odwodzenie z gumą w poniżej 5 minut. Maksymalna pompa.",
            powerHangingLegRaises: "Wybuchowo – kolana do klatki szybko, wolny ekscentryk (3-5 sek), pełne rozciągnięcie na dole.",
            gluteHamRaise: "Kontroluj ekscentryk, wystrzel do góry. Użyj pomocy (odepchnij się od czegoś na dole) jeśli potrzebne żeby uzyskać pełny zakres powtórzenia.",

            flatBarbellBenchPress: "Zwolnij przed dotknięciem klatki. Bez odbijania. Kontroluj całe powtórzenie.",
            cableFlyes: "Duże rozciągnięcie na dole. Wypchnij klatkę do przodu, poczuj rozciągnięcie.",
            seatedDBShoulderPress: "Pełny zakres – dotknij barków hantlami na dole.",
            overheadTricepExtensions: "Użyj nakładki z paskami, stój prosto z linką na dole. Pełny zakres – przedramiona dotykają bicepsów na dole.",
            hackSquat: "Stopy wąsko, pełny zakres – tyłek do ziemi. Spróbuj dotknąć łydek pośladkami.",
            legExtensions: "Pełny zakres, bez odbijania. Kąt między nogami a tułowiem co najmniej 120° (przesuń się do przodu jeśli trzeba).",
            hammerPulldown: "Jednorącz dla maks. rozciągnięcia. Dodaj ściśnięcie na dole, by zwiększyć trudność.",
            preacherEZBarCurls: "Pełny zakres, zwolnij w rozciągnieciu. Kontroluj fazę negatywną.",
            hangingLegRaises: "Proste nogi, jeśli zgięte są za łatwe. Bez kołysania.",
            lyingLegCurls: "Pełny zakres, zwolnij w rozciągnieciu.",
            inclineBarbellBenchPress: "Zwolnij przed dotknięciem klatki. Bez odbicia.",
            flatDBPress: "Łokcie szeroko, łuk w plecach, pełne rozciągnięcie na dole (hantle dotykają bicepsów). Myśl „sięganie do przodu” klatką piersiową.",
            closeGripBenchPress: "Chwyt o 1,5 szerokości dłoni węższy niż normalnie – około szerokości barków.",
            latPulldownNeutral: "„Martwy zwis” na górze (głowa między barkami). Lekkie odchylenie do tyłu przy ciągnięciu.",
            singleArmHammerStrengthRow: "Zaokrąglij barki do przodu w pozycji rozciągniętej. Dodaj bloczek między klatką a siedzeniem dla dodatkowego rozciągnięcia.",
            singleArmDBRow: "Ogranicz ruch dolnej części pleców. Skup się na spięciu najszerszych grzbietu.",
            machineRearDeltFly: "Jednorącz siedząc bokiem dla maksymalnego rozciągnięcia.",
            inclineDBCurls: "Ławka nachylona jak najniżej możesz bez dotykania hantlami podłogi. Maksymalne rozciągnięcie.",
            stiffLeggedDeadlift: "Zwolnij i lekko dotknij ziemi. Poczuj rozciągnięcie mięśni dwugłowych.",
            abWheelRollouts: "Start z kolan, wyjedź tak daleko jak możesz przy minimum 5 powt. Zwiększaj dystans co tydzień.",
            frontSquats: "Pełny ROM, wolna ekscentryka. Trzymaj się prosto, łokcie wysoko.",
            stilettoSquats: "Pupa do trawy - dotknij łydek pośladkami. Pięty podniesione.",
            inclineDBPress: "Łokcie szeroko, arch pleców, pełne rozciągnięcie. Myśl 'sięganie' klatką.",
            seatedCableRow: "Neutralny lub szeroki chwyt. Zaokrąglaj ramiona do przodu dla max stretcha na dole.",
            pullupHelper: "Maksymalny dodatkowy ciężar na 1 czyste podciągnięcie",
            latPrayer: "Rotacja wewnętrzna w pozycji rozciągniętej dla max rozciągnięcia latów.",
            wideGripBBRow: "Małe palce na wewnętrznych pierścieniach. Ciągnij do dolnej klatki.",
            romanianDeadlift: "Ciężko. Paski OK. 1-2 sek ścisk pośladków na górze.",
            standingMilitaryPress: "Ścisłe, bez odbicia nóg. Dumna klatka, ścisk deltków.",
            leaningLateralRaises: "Oprzyj się o ścianę pod 15-30°. Powt. kończy się gdy hantel wskazuje prosto w dół.",
            walkingLungesDB: "Długie kroki, nie odpychaj się tylną nogą.",
            hackCalfRaises: "1 sek pauza na dole, wolna ekscentryka.",
            seatedLegCurls: "Pochyl tułów do przodu. Kontroluj ekscentrykę.",
            pecDeck: "Pełne rozciągnięcie na dole. Ścisk w kontrakcji.",

            deficitPushupsSkeleton: "Klatka do podłogi za każdym powtórzeniem. Zejdź na kolana gdy technika się załamie. Jeśli <5 pełnych, zejdź na kolana i kontynuuj do 5 łącznie.",
            legExtensionsSkeleton: "Przynajmniej 120° kąt między udami a tułowiem. Pełne rozciągnięcie.",
            supportedSLDL: "Oprzyj się o maszynę Smitha lub sztangę na stojaku. Pięty pod lub przed sztangą. 3-4 sek opuszczanie.",
            standingCalfRaises: "Pełne rozciągnięcie na dole, 2-sek pauza na dole. Step, maszyna hack lub leg-press.",
            invertedRowsSkeleton: "Obniż pierścienie/drążek lub przesuń stopy do przodu, gdy osiągniesz 15 powt.",
            overhandPulldown: "Lekkie odchylenie do tyłu przy ściąganiu, ciągnij do górnej części klatki, ściśnij łopatki razem.",

            nordicSwapTip: "Jeśli ćwiczenie jest zbyt trudne, zamień na alternatywę dla lepszej progresji i bezpieczeństwa, lub dodaj gumy jako support.",

            // --- NEW: THURSDAY TRICEP SWAP & LOW PIN PRESS ---
            heavyRollingTricepExtensions: "Heavy Rolling Tricep Extensions",
            lowPinPressSwapButton: "Problemy z lockoutem? Kliknij, aby zamienić 1 serię Paused Bench na Pin Press",
            heavyTricepOptionSelected: "Wybrano ciężką opcję na triceps – skupienie na sile lockoutu",
            explosiveThursday: "Eksplozywnie",

            // --- PAIN & GLORY TIPS ---
            deficitSnatchGrip: "4 sekunduwe opuszczanie, max 2 min przerwy między seriami. NIE oszukuj na opadaniu - to zepsuje autoregulację.",
            closeNeutralLatPulldown: "Pełne rozciągnięcie, 'martwy zwis' na górze, rozbij ruch na 2 części: ściąganie łopatek + pulldown.",
            slowEccentricNordic: "Oszukuj fazę wstępującą, opadaj jak najwolniej – celuj w lepszą kontrolę każdego tygodnia.",
            singleLegHipThrustPG: "Eksplozywnie w górę, myśl 'ścisk pośladków' nie tylko podnoszenie – użyj relatywnie niskiego ciężaru.",
            deadHangPlanks: "Od razu do planków po zwisach, 2 min przerwy między superseriami.",
            pausedLowBarSquat: "Progresja tylko w tygodniach 1-8: +2.5 kg tygodniowo przy sukcesie. Tygodnie 9-16: stały ciężar dla priorytetu peakingu martwego.",
            legExtensionsPG: "Kąt bioder 120°, pełny ROM.",
            hackCalfRaisesPG: "Pełne rozciągnięcie, zbliż się do upadku w każdej serii.",
            inclineDBBenchPG: "Dotknij hantlami bicepsów na dole, 'sięgaj w górę' klatką przy rozciągnięciu.",
            standingMilitaryPG: "Bez szarpania, ścisła technika, pełny ROM.",
            conventionalE2MOM: "E2MOM – co 2 minuty: 3-5 powt., reszta to odp. Forma jest priorytetem. Celuj w stałe 3-5 powt. we wszystkich 6 seriach.",
            conventionalDeadliftAMRAP: "Test AMRAP. Daj z siebie wszystko zachowując perfekcyjną formę. To określa ciężary peakingowe.",
            conventionalDeadliftTriple: "Ciężka trójka @ RPE 9.",
            conventionalDeadliftDouble: "Ciężka dwójka @ RPE 9.5.",
            conventionalDeadliftSingle: "DZIEŃ SĄDU. Twój moment chwały.",
            conventionalDeadliftOptional: "Opcjonalne drugie podejście jeśli czujesz że masz więcej.",
            conventionalDeadliftBackdown: "Back down work. Skup się na prędkości i formie.",
            conventionalCAT: "Compensatory Acceleration Training – eksploduj jak najszybciej w każdym powt.",
            increaseWeight: "Zwiększ ciężar!",

            // Pain & Glory Dashboard
            painGloryDashboardTagline: "Dziś ból, jutro chwała",
            deficitSnatchGripTracker: "Progres Deficit Snatch Grip",
            currentWeight: "Aktualny ciężar",
            trend: "Trend",

            // --- TRINARY TIPS ---
            trinaryMEStandard: "Max Effort – dojdź do 90-95% 1RM. Skup się na perfekcyjnej technice. 📈 RPE 9 lub mniej + 3 czyste powt. = +5 kg następna sesja ME.",
            trinaryMEVariation: "Max Effort Variation – celuj w słaby punkt. Zacznij od sugerowanego ciężaru, dostosuj wg samopoczucia.",
            trinaryDE: "Dynamic Effort – eksplozywny ruch. Rozważ gumy/łańcuchy.",
            trinaryRE: "Repeated Effort – cel: hipertrofia. 📈 Zrób 12 powt. we WSZYSTKICH seriach = +2.5 kg następna sesja.",
            trinaryREProgression: "Podwójna progresja: 12 powt. we wszystkich seriach → +2.5 kg następna sesja RE dla tego boju.",
            trinaryDESpeed: "Skup się na prędkości, nie na ciężarze.",
            trinaryAccessory: "Praca akcesoryjne na słabe punkty. Podwójna progresja: 12 powt. we wszystkich seriach = +2.5 kg.",
            trinaryRPECheck: "RPE 9 (lekki zapas) lub niższe z perfekcyjną formą? ",
            trinaryStartingWeight: "Sugerowany ciężar startowy: {weight} kg (~{percent}% twojego {lift} 1RM). Dostosuj wg samopoczucia.",

            // --- RITUAL OF STRENGTH TIPS ---
            ritualRampIn: "Skup się na perfekcyjnej formie. RPE 7-8. Technika trójbojowa.",
            ritualAscensionTest: "TEST ASCENSJI – 3×AMRAP @ ~85% 1RM + back-down 3×5 @ 80%. Cel: 5-8 powt. Aktualizuje wszystkie 1RM wzorem Epleya. Żelazni bogowie osądzają twoje poświęcenie.",
            ritualMESingle: "MAX EFFORT SINGLE – dojdź do 1 prawidłowego technicznie powtórzenia @ 90-100% 1RM. Jeśli RPE <9, możesz progresować w kolejnej sesji.",
            ritualLightWork: "Lekka praca @ 70% 1RM. Skupienie na prędkości i formie. Celuj w prędkość sztangi >0.8 m/s. Jeśli sztanga porusza się wolno, zredukuj ciężar o 5% w kolejnej sesji.",
            ritualBackDown: "Serie back-down @ 80% ciężaru z Testu Ascensji. Praca nad techniką po teście.",
            ritualGripWork: "Trening chwytu. Farmer Holds lub Fat Grip Deadlift Holds 3×20-30 sek @ waga ciała lub lżejsza. Progresja: +czas lub +ciężar jeśli zbyt łatwe.",
            ritualAccessory: "Rytualne akcesoria – osiągnij max powt. we wszystkich seriach → +2.5 kg następną sesją. Celuj w słabe punkty.",
            ritualPurgeWeek: "TYDZIEŃ OCZYSZCZENIA (Deload) – 50% objętości, 70% intensywności. Odpoczynek i regeneracja. Rytuał wymaga poświęcenia, ale też wytchnienia.",
            ritualMEAdvice: "Dojdź do 1 prawidłowego technicznie powtórzenia @ 90-100% 1RM. Jeśli RPE <9, możesz progresować w kolejnej sesji.",
            ritualVelocityTip: "Celuj w prędkość sztangi >0.8 m/s – użyj aplikacji lub czuj. Jeśli sztanga porusza się wolno, zredukuj ciężar o 5% w kolejnej sesji.",
            ritualRecoveryCheck: "Regeneracja ostatnie 4 tyg.? Oceń 1-10 (10 = perfekcja). Jeśli ≤6: natychmiastowy Tydzień Oczyszczenia.",
            ritualDashboardTagline: "Rytuał siły - ofiara dla bogów żelaza",

            // --- ROZGRZEWKA DLA WSZYSTKICH WARIANTÓW ĆWICZEŃ ---
            warmupBench: "Rozgrzej rotatory, wykonaj dynamiczne mostkowanie, lekką spompuj najszerszy grzbietu i zrób glute bridge jednonóż z przytrzymaniem w spięciu przed główną rozgrzewką (lub pomiędzy seriami rozgrzewkowymi).",
            warmupSquat: "Wykonaj wymachy bioder, airplanes, przysiady kozackie, goodmorningi z gumą, rozciąganie ścięgien, mosty pośladkowe na jednej nodze z przytrzymaniem i przysiady bodyweight dupa-ziemia przed główną rozgrzewką (lub pomiędzy seriami rozgrzewkowymi).",
            warmupDeadlift: "Wykonaj wymachy bioder, airplanes, goodmorningi z gumą/sztangą + goodmorningi na sztywnych nogach, wykroki/split squaty bodyweight, lekko spompuj najszerszy grzbietu i glute bridge jednonóż z przytrzymaniem w spięciu przed główną rozgrzewką (lub pomiędzy seriami rozgrzewkowymi).",

            "Paused Bench Press (ME)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka wyciskania) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1. Wszystkie z pauzą. Max Effort – dojdź do 90-95% 1RM.",
            "Paused Bench Press (Light)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka wyciskania) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3 (pomiń 85%, 95%). Wszystkie z pauzą. Lekka praca @ 70% na prędkość.",
            "Paused Bench Press (Ascension Test)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka wyciskania) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2. Wszystkie z pauzą. TEST ASCENSJI – AMRAP @ 85%.",
            "Low Bar Squat (ME)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka przysiadu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1.  Max Effort singiel.",
            "Low Bar Squat (Light)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka przysiadu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3 (pomiń 85%, 95%).  Lekka praca @ 70% na prędkość.",
            "Low Bar Squat (Ascension Test)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka przysiadu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2.  TEST ASCENSJI.",
            "Conventional Deadlift (ME)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka martwego ciągu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1.  Max Effort singiel.",
            "Conventional Deadlift (Light)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka martwego ciągu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3 (pomiń 85%, 95%).  Lekka praca @ 70% na prędkość.",
            "Conventional Deadlift (Ascension Test)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka martwego ciągu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2.  TEST ASCENSJI.",
            "Conventional Deadlift": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka martwego ciągu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1 (ciężkie dni).  ",
            "Low Bar Squat": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka przysiadu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1 (ciężkie dni).  ",
            "Paused Low Bar Squat": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka przysiadu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2. Wszystkie z pauzą. 2-sek pauza w dole. Progresja tyg. 1-8: +2.5kg co tydzień. Tyg. 9-16: stały ciężar (priorytet peaking).",
            "Deficit Snatch Grip Deadlift": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka martwego ciągu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3 (lżejsze %: deficyt + snatch grip).",
            "Conventional Deadlift E2MOM": "E2MOM – co 2 min: 3-5 powt., reszta odpoczynek. Chwyt/forma priorytet. Celuj 3-5 powt. wszystkie 6 serie. Rozgrzewka ogólna (patrz powyżej – rozgrzewka martwego ciągu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2.",
            "Conventional Deadlift (AMRAP Test)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka martwego ciągu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2. Test AMRAP. Perfekcyjna forma. Określa ciężary peakingowe.",
            "Conventional Deadlift (Heavy Triple)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka martwego ciągu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1. Ciężki tripel @ RPE 9.",
            "Conventional Deadlift (Heavy Double)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka martwego ciągu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1. Ciężki dubel @ RPE 9.5. Bardzo blisko max.",
            "Conventional Deadlift (Max Single)": "Rozgrzewka ogólna (patrz powyżej – rozgrzewka martwego ciągu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3, 85% × 2, 95% × 1. DZIEŃ SĄDU. Twój moment chwały.",
            "Conventional Deadlift (CAT)": "CAT – eksploduj maksymalnie szybko każde powt. Rozgrzewka ogólna (patrz powyżej – rozgrzewka martwego ciągu) → Rozgrzewka sztangą: Pusty gryf × 8-10, 50% × 5, 70% × 3. Prędkość/forma."
        }
    }
};

export type TranslationKey = typeof translations.en;

// Helper type for nested translation access
export type NestedKeyOf<T> = T extends object
    ? { [K in keyof T]: K extends string
        ? T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}` | K
        : K
        : never
    }[keyof T]
    : never;
