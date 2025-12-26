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
            optional: "Optional",
            primary: "Primary",
            yes: "Yes",
            no: "No",
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
                    description: "12-week powerlifting program to explode your bench press. With optional 3 week peaking phase.",
                    features: [
                        "Focus: Bench Strength",
                        "12 Week Program",
                        "Optional 3 Week Peaking",
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
                }
            },

            // Modules Step (Bench Domination)
            buildPerfectHell: "Build Your Perfect Bench Hell",
            customizeBrutality: "Customize the brutality. The core lift is sacred.",
            modules: {
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
            feelingFroggy: "Feeling Froggy",
            feelingPeachy: "Feeling Peachy",

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

            // Pencilneck widgets
            pencilneck: {
                weekStatus: "Week {week} Status",
                trapBarometer: "Trap Barometer",
                pencil: "Pencil",
                boulder: "Boulder",
                percentGone: "{percent}% GONE",
                restDayThought: "Rest Day Thought"
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
                survived: "You have survived 12 weeks of hell. You must now take a mandatory 7-10 day deload.",
                restTimer: "Mandatory Rest Timer",
                daysLeft: "DAYS LEFT",
                restAdvice: "Do not lift heavy. Sleep. Eat.",
                proceedQuestion: "After your rest, how do you want to proceed?",
                optionA: {
                    title: "Option A: The Peak (Recommended)",
                    description: "Enter a 3-week peaking block (Weeks 13-15) to acclimatize to heavy loads and explicitly peak for a new 1RM."
                },
                optionB: {
                    title: "Option B: Test Now",
                    description: "Skip the peaking block and test your 1RM immediately aka \"YOLO\"."
                }
            },

            // Week navigation
            mandatoryDeload: "MANDATORY DELOAD",
            peakingBlock: "PEAKING BLOCK",
            nExercises: "{count} Exercises"
        },

        // ========================================
        // WORKOUT VIEW
        // ========================================
        workout: {
            completed: "Completed",
            lastLabel: "last:",
            tip: "Tip:",
            sets: "sets",
            reps: "reps",
            giantSets: "giant sets",
            target: "Target:",
            increaseWeight: "Increase Weight!",
            increaseWeightNext: "Increase Weight Next Time!",
            completeWorkout: "COMPLETE WORKOUT",
            saving: "SAVING...",
            setHeader: "SET",
            kgHeader: "KG",
            repsHeader: "REPS",
            notesPlaceholder: "Notes...",
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

        // ========================================
        // EXERCISE TIPS - CONSOLIDATED & REFINED
        // ========================================
        tips: {
            // --- BENCH DOMINATION TIPS ---
            pausedBench: "Warm-up: ramp fast, low reps, paused every set. Save energy for working sets. Bar comes to complete stop at chest, 0.5-1 second full pause.",
            wideGripBench: "Wide grip with elbows flared. Focus on deep stretch at the bottom.",
            spotoPress: "Stop bar 4-8 cm above chest, hold 1 second, then press explosively.",
            lowPinPress: "Set pins at your sticking point. Explosive press from dead stop.",
            pausedBenchAMRAP: "This set drives progression! ≥12 reps = +2.5kg next week, 9-11 reps = maintain, <9 reps = maintain.",
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
            aroundTheWorlds: "If 15 reps is easy, slow down the eccentric (3-4 sec).",
            yRaises: "Focus on scapular retraction. Swap to facepulls if shoulder issues.",
            highElbowFacepulls: "Cable at forehead height, wide elbows, external rotation at top (thumbs back). Light weight, perfect form.",
            behindNeckPress: "Light and crisp. Strict form, no momentum.",

            // --- PULL-UP PROGRESSIONS (BENCH DOM) ---
            pullupWeeks1to3: "Add smallest plate. Max strict reps EMOM until form breaks. (EMOM: Start every minute, rest for remainder)",
            pullupWeeks4to6: "Add 10-15 kg. 3-5 reps EMOM for 12-15 minutes.",
            pullupWeeks7to9: "Daily max triple + 4-6 back-off triples @ 85-90%.",
            pullupWeek10: "Test your max weighted single rep.",
            pullupWeeks11to12: "3-5 sets of 2-3 reps @ 90-95%.",

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
            seatedLegCurls: "Lean torso forward. Control the eccentric.",
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
            optional: "Opcjonalne",
            primary: "Główne",
            yes: "Tak",
            no: "Nie",
        },

        entry: {
            title: "HYPER",
            subtitle: "PLANNER",
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
            choosePath: "Wybierz ścieżkę transformacji.",

            programs: {
                benchDomination: {
                    name: "Dominacja Wyciskania",
                    description: "12-tygodniowy program siłowy na eksplozję w wyciskaniu. Z opcjonalną 3-tygodniową fazą szczytowania.",
                    features: [
                        "Cel: Siła wyciskania",
                        "Program 12-tygodniowy",
                        "Opcjonalny 3-tyg. peaking",
                        "Autoregulacja oparta na teście AMRAP"
                    ]
                },
                pencilneck: {
                    name: "Eliminacja Patyczaka",
                    description: "8-tygodniowy split na górną partię ciała. Dla tych, co wyglądają jak lizak.",
                    features: [
                        "Cel: Masa górnej partii",
                        "4 dni / tydzień",
                        "Split Push / Pull"
                    ]
                },
                skeleton: {
                    name: "Ze Szkieletu w Zagrożenie",
                    description: "12-tygodniowy program dla początkujących. Dla tych, co nigdy nie ruszali żelastwa.",
                    features: [
                        "Cel: Całe ciało",
                        "3 dni / tydzień",
                        "Elastyczny grafik"
                    ]
                },
                peachy: {
                    name: "Brzoskwinia",
                    description: "12-tygodniowa specjalizacja na pośladki. Dla tych, co chcą lepszy tyłek.",
                    features: [
                        "Cel: Pośladki i dół",
                        "4 dni / tydzień",
                        "Programowanie oparte na nauce"
                    ]
                }
            },

            buildPerfectHell: "Zbuduj swoje piekło wyciskania",
            customizeBrutality: "Dostosuj brutalność. Główny ruch jest świętością.",
            modules: {
                coreBench: {
                    title: "Główna progresja wyciskania",
                    description: "Wyciskanie pauzowane, wariacje (szeroki/Spoto/Pin), sobotni test AMRAP."
                },
                tricepGiantSets: {
                    title: "Giant sety na triceps",
                    description: "Sekretny sos na siłę lockoutu. Pon. i Czw."
                },
                behindNeckPress: {
                    title: "Wyciskanie zza karku",
                    description: "Kompleksowy rozwój i stabilizacja barków. Pon. i Czw."
                },
                weightedPullups: {
                    title: "Podciągania z obciążeniem",
                    description: "Siła pleców na stabilność w wyciskaniu. Śr. i Sob."
                },
                legDays: {
                    title: "Dni nóg",
                    description: "Przysiady, Leg Press, Wykroki. Wt. i Pt."
                },
                accessories: {
                    title: "Akcesoria",
                    description: "Dragon Flags, Y-Raises, Around-the-Worlds."
                }
            },

            trainingSchedule: "Grafik treningowy",
            selectDays: "Wybierz dokładnie {count} dni treningowe.",
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
            chooseMovements: "Wybierz preferowane ruchy.",
            preferences: {
                pushALegPrimary: "Push A: Główne nogi",
                pushBChestIsolation: "Push B: Izolacja klatki",
                pushBLegSecondary: "Push B: Dodatkowe nogi"
            },
            exerciseOptions: {
                hackSquat: "Hack Squat",
                highFootLegPress: "Leg Press (stopy wysoko)",
                pecDec: "Pec-Dec",
                lowToHighCableFlyes: "Rozpiętki w górę (wyciąg)",
                frontSquats: "Przysiady frontowe",
                narrowStanceLegPress: "Leg Press (wąski rozstaw)",
                stilettoSquats: "Przysiady na podwyższeniu"
            },

            calibrationPhase: "Faza kalibracji",
            enterStats: "Wpisz aktualne maksima. Od nich zależą wszystkie obliczenia.",
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
        },

        dashboard: {
            timeTo: "Czas, by",
            eradicateThe: "Wyeliminować",
            becomeA: "Zostać",
            dominate: "Zdominować",
            weakness: "Słabość",
            threat: "Zagrożeniem",
            welcomeBack: "Witaj,",

            feelingFroggy: "Czujesz się żabko",
            feelingPeachy: "Czujesz się brzoskwiniowo",

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
                activeModules: "Aktywne moduły",
                coreBench: "Główne wyciskanie",
                strengthProgression: "Progresja siły",
                squatStrengthProgression: "Progresja siły w przysiadzie"
            },

            pencilneck: {
                weekStatus: "Status tyg. {week}",
                trapBarometer: "Barometr kapturów",
                pencil: "Patyczak",
                boulder: "Głaz",
                percentGone: "{percent}% ZNIKŁO",
                restDayThought: "Myśl na dzień odpoczynku"
            },

            skeleton: {
                metamorphosis: "Metamorfoza",
                weeksLeft: "tygodni zostało",
                untilNoLongerSkeleton: "Do momentu, gdy przestaniesz być szkieletem.",
                deficitPushupPR: "Rekord pompek z deficytu",
                perfectRepsSingleSet: "Idealne powtórzenia (jedna seria)",
                restDayQuote: "Twoje mięśnie właśnie budują zbroję."
            },

            commandments: {
                title: "5 Przykazań Wzrostu",
                list: [
                    "Nadwyżka 300–500 kcal obowiązkowa",
                    "Kontroluj fazę ekscentryczną, nie odbijaj z dołu",
                    "Zawsze rozgrzewaj się min. 1 serią po 12 przy 50% ciężaru roboczego",
                    "Trenuj ciężko, max 1–3 RIR (powtórzenia w zapasie) na serię",
                    "Śpij 7+ godzin"
                ]
            },

            crossroads: {
                title: "ROZSTAJE",
                survived: "Przetrwałeś 12 tygodni piekła. Teraz musisz zrobić obowiązkowy 7-10 dniowy deload.",
                restTimer: "Obowiązkowy timer odpoczynku",
                daysLeft: "DNI ZOSTAŁO",
                restAdvice: "Nie podnoś ciężko. Śpij. Jedz.",
                proceedQuestion: "Po odpoczynku, jak chcesz kontynuować?",
                optionA: {
                    title: "Opcja A: Szczyt (zalecane)",
                    description: "Wejdź w 3-tygodniowy blok peakingowy (tyg. 13-15), by przyzwyczaić się do ciężkich obciążeń i wyraźnie szczytować na nowe 1RM."
                },
                optionB: {
                    title: "Opcja B: Testuj teraz",
                    description: "Pomiń blok peakingowy i testuj 1RM od razu, czyli \"YOLO\"."
                }
            },

            mandatoryDeload: "OBOWIĄZKOWY DELOAD",
            peakingBlock: "BLOK PEAKINGOWY",
            nExercises: "{count} Ćwiczeń"
        },

        workout: {
            completed: "Ukończono",
            lastLabel: "poprz.:",
            tip: "Wskazówka:",
            sets: "serie",
            reps: "powt.",
            giantSets: "giant sety",
            target: "Cel:",
            increaseWeight: "Dodaj ciężar!",
            increaseWeightNext: "Dodaj ciężar następnym razem!",
            completeWorkout: "ZAKOŃCZ TRENING",
            saving: "ZAPISYWANIE...",
            setHeader: "SERIA",
            kgHeader: "KG",
            repsHeader: "POWT.",
            notesPlaceholder: "Notatki...",
        },

        settings: {
            title: "Ustawienia",
            description: "Zarządzaj preferencjami programu.",

            exercisePreferences: "Preferencje ćwiczeń",
            exercisePreferencesDesc: "Dostosuj swoje wybory ćwiczeń \"LUB\". Zmiany będą stosowane do przyszłych treningów.",

            programModules: "Moduły programu",
            programModulesDesc: "Włącz lub wyłącz opcjonalne komponenty 12-tygodniowego bloku Dominacji Wyciskania.",

            manual1rmOverride: "Ręczne nadpisanie 1RM",
            manual1rmDesc: "Ręcznie dostosuj 1RM w wyciskaniu pauzowanym.",
            manual1rmWarning: "⚠️ UWAGA: Zmieniaj to tylko gdy naprawdę konieczne (np. restart po kontuzji, znacząca utrata siły, lub gdy autoregulacja kompletnie nie działa). Program automatycznie dostosowuje 1RM na podstawie sobotnieh AMRAP. Sztuczne zawyżanie doprowadzi do porażki.",
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
            noWorkoutsDesc: "Wejdź tam i zmiażdż stalówę.",
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
                "Twoje latsy mają własny kod pocztowy.",
                "Twoje kapturki zablokowały komuś Wi-Fi.",
                "Bluzy składają wnioski o azyl.",
                "Nie mieścisz się już w selfie.",
                "Twoje tylne deltki mają tylne deltki.",
                "Gratulacje. Jesteś teraz final bossem planety Ziemia."
            ]
        },

        tips: {
            pausedBench: "Rozgrzewka: szybka rampa, mało powtórzeń, pauza w każdej serii. Oszczędzaj energię. Sztanga zatrzymuje się całkowicie na klatce, 0.5-1 sek pełnej pauzy.",
            wideGripBench: "Szeroki chwyt z łokciami na zewnątrz. Skup się na głębokim rozciągnięciu na dole.",
            spotoPress: "Zatrzymaj sztangę 4-8 cm nad klatką, trzymaj 1 sek, potem wyciśnij eksplozywnie.",
            lowPinPress: "Ustaw piny na swoim martwym punkcie. Eksplozywne wyciskanie z martwego startu.",
            pausedBenchAMRAP: "Ta seria napędza progresję! ≥12 powt. = +2.5kg następnego tyg., 9-11 powt. = utrzymuj, <9 powt. = utrzymuj.",
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
            aroundTheWorlds: "Jeśli 15 powt. jest łatwe, zwolnij ekscentrykę (3-4 sek).",
            yRaises: "Skup się na retrakcji łopatek. Zamień na facepulle jeśli problemy z barkiem.",
            highElbowFacepulls: "Wyciąg na wysokości czoła, szerokie łokcie, rotacja zewnętrzna na górze (kciuki do tyłu). Lekki ciężar, idealna forma.",
            behindNeckPress: "Lekko i ostro. Ścisła forma, bez momentum.",

            pullupWeeks1to3: "Dodaj najmniejszy talerz. Max czyste powt. EMOM aż forma się załamie. (EMOM: Start co minutę, odpocznij resztę)",
            pullupWeeks4to6: "Dodaj 10-15 kg. 3-5 powt. EMOM przez 12-15 minut.",
            pullupWeeks7to9: "Dzienna max trójka + 4-6 back-off trójek @ 85-90%.",
            pullupWeek10: "Przetestuj max pojedynczą z obciążeniem.",
            pullupWeeks11to12: "3-5 serii po 2-3 powt. @ 90-95%.",

            sumoDeadlift: "Idź brutalnie ciężko. Używaj pasków. 1-2 sek ścisk na górze - rozgnieciesz orzech pośladkami.",
            bulgarianSplitSquat: "Trzymaj stojak jedną ręką, hantla w drugiej. Tylna stopa sznurówkami na ławce (palce W DÓŁ). Usiądź do tyłu, ogranicz ruch kolana do przodu, trzymaj się prosto.",
            squats: "Każde powtórzenie musi przejść poniżej równoległej. Dodaj 2.5 kg gdy zrobisz 3×10.",
            seatedHamstringCurl: "Pochyl tułów do przodu dla mega rozciągnięcia. Kontroluj ekscentrykę.",
            kasGluteBridge: "Górna część pleców na ławce. Opuszczaj tylko 5-10 cm, nigdy nie dotykaj podłogi. Ciągłe napięcie.",
            hyperextension45: "Lekko zaokrąglij górne plecy, palce stóp rozstawione 45°, wciśnij biodra MOCNO w pad. Czysty zawias biodrowy.",
            militaryPress: "Ścisłe, bez odbicia nóg. Dumna klatka, ścisk deltków na górze.",
            inclineDBBench: "Łokcie szeroko, arch pleców, idź po pełne rozciągnięcie. Myśl 'sięganie' klatką.",
            invertedRows: "Rozluźnij barki na dole dla rozciągnięcia. Trzymaj biodra idealnie prosto.",
            sideLyingRearDeltFly: "Mały palec prowadzi, myśl 'wylewanie wody' na górze.",
            dbRDL: "Ciężko. Paski OK. 1-2 sek ścisk pośladków na górze.",
            pausedSquat: "80% ciężaru poniedziałkowego przysiadu. 2 pełne sekundy w dole - bez odbicia.",
            ghr: "3-5 sek opuszczania (tylko ekscentryka). Oszukuj w górę jak chcesz.",
            legPressCalves: "Pełne rozciągnięcie na dole, eksploduj w górę. Zatrzymaj się 0-1 powt. przed upadkiem.",
            deficitReverseLunge: "Przednia stopa na talerzu. Tylne kolano dotyka podłogi w każdym powt.",
            deficitPushups: "Klatka do podłogi w każdym powt. Nie dasz 5? Przejdź na kolana i kontynuuj.",
            assistedPullups: "Ogranicz asystę do minimum. Najpierw czyste powtórzenia, potem odpychaj się od pudełka/ławki.",
            yRaisesPeachy: "Mały palec prowadzi, kciuki w górę, rotacja zewnętrzna na górze.",
            lyingCableLatRaises: "Ciągnij 'od' ciała, nie w górę. Skup się na rozciągnięciu bocznego deltoidu.",
            glutePumpFinisher: "100 powt. hip thrust/odwodzenia z gumą w mniej niż 5 minut. Goń pompę.",
            powerHangingLegRaises: "Eksplozywnie - kolana do klatki szybko, wolna ekscentryka (3-5 sek), pełne rozciągnięcie na dole.",
            gluteHamRaise: "Kontroluj ekscentrykę, eksploduj w górę. Użyj asysty jeśli trzeba dla pełnego ROM.",

            flatBarbellBenchPress: "Zwolnij przed dotknięciem klatki. Bez odbijania. Kontroluj całe powtórzenie.",
            cableFlyes: "Duże rozciągnięcie na dole. Wypchnij klatkę do przodu, poczuj stretch.",
            seatedDBShoulderPress: "Pełny ROM - dotknij barków hantlami na dole.",
            overheadTricepExtensions: "Użyj paska, stój prosto przy wyciągu na dole. Pełny ROM - przedramiona dotykają bicepsów na dole.",
            hackSquat: "Stopy wąsko, pełny ROM - pupa do trawy. Próbuj dotknąć łydek pośladkami.",
            legExtensions: "Pełny ROM, bez podskoków. Kąt między nogami a tułowiem >120° (zsuń się do przodu jeśli trzeba).",
            hammerPulldown: "Jednoręcznie dla max rozciągnięcia. Dodaj ścisk na dole dla zwiększenia trudności.",
            preacherEZBarCurls: "Pełny ROM, zwolnij w pozycji rozciągniętej. Kontroluj negatyw.",
            hangingLegRaises: "Proste nogi jeśli zgięte jest za łatwo. Bez kiwania się.",
            lyingLegCurls: "Pełny ROM, zwolnij w pozycji rozciągniętej.",
            inclineBarbellBenchPress: "Zwolnij przed dotknięciem klatki. Bez odbicia.",
            flatDBPress: "Łokcie szeroko, arch pleców, pełne rozciągnięcie. Myśl 'sięganie' klatką.",
            closeGripBenchPress: "Chwyt 1.5 szerokości dłoni węższy niż normalnie - mniej więcej szerokość barków.",
            latPulldownNeutral: "'Martwy wis' na górze (głowa między barkami). Lekki odchył w tył przy ciągnięciu.",
            singleArmHammerStrengthRow: "Zaokrąglaj barki w pozycji rozciągniętej. Dodaj podkładkę między klatką a siedzeniem dla extra stretcha.",
            singleArmDBRow: "Ogranicz ruch dolnych pleców. Skup się na skurczu lata.",
            machineRearDeltFly: "Jednoręcznie siedząc bokiem dla max rozciągnięcia.",
            inclineDBCurls: "Jak najniższe nachylenie bez uderzania hantlami o podłogę. Max stretch.",
            stiffLeggedDeadlift: "Zwolnij i lekko dotknij podłogi. Poczuj rozciągnięcie dwugłowych.",
            abWheelRollouts: "Zacznij z kolan, jedź tak daleko jak możesz robiąc 5+ powt. Progresuj dystans co tydzień.",
            frontSquats: "Pełny ROM, wolna ekscentryka. Trzymaj się prosto, łokcie wysoko.",
            stilettoSquats: "Pupa do trawy - dotknij łydek pośladkami. Pięty podniesione.",
            inclineDBPress: "Łokcie szeroko, arch pleców, pełne rozciągnięcie. Myśl 'sięganie' klatką.",
            seatedCableRow: "Neutralny lub szeroki chwyt. Zaokrąglaj ramiona do przodu dla max stretcha na dole.",
            latPrayer: "Rotacja wewnętrzna w pozycji rozciągniętej dla max rozciągnięcia latów.",
            wideGripBBRow: "Małe palce na wewnętrznych pierścieniach. Ciągnij do dolnej klatki.",
            romanianDeadlift: "Ciężko. Paski OK. 1-2 sek ścisk pośladków na górze.",
            standingMilitaryPress: "Ścisłe, bez odbicia nóg. Dumna klatka, ścisk deltków.",
            leaningLateralRaises: "Oprzyj się o ścianę pod 15-30°. Powt. kończy się gdy hantel wskazuje prosto w dół.",
            walkingLungesDB: "Długie kroki, nie odpychaj się tylną nogą.",
            hackCalfRaises: "1 sek pauza na dole, wolna ekscentryka.",
            seatedLegCurls: "Pochyl tułów do przodu. Kontroluj ekscentrykę.",
            pecDeck: "Pełne rozciągnięcie na dole. Ścisk w kontrakcji.",

            deficitPushupsSkeleton: "Klatka do podłogi w każdym idealnym powt. Przejdź na kolana tylko gdy forma się załamie. Jeśli <5 idealnych, przejdź na kolana do 5 łącznie.",
            legExtensionsSkeleton: "Min. 120° kąt między udami a tułowiem. Pełne rozciągnięcie, mocny ścisk quadów.",
            supportedSLDL: "Oprzyj się o smith machine lub sztangę na stojakach. Pięty pod lub za sztangą. 3-4 sek ekscentryka.",
            standingCalfRaises: "Pełne rozciągnięcie na dole, 2-sek pauza na dole. Step, hack machine, lub leg-press.",
            invertedRowsSkeleton: "Opuść kółka/drążek lub przejdź stopami do przodu gdy zrobisz 15 powt.",
            overhandPulldown: "Lekki odchył, ciągnij do górnej klatki, ściśnij łopatki razem.",

            nordicSwapTip: "Jeśli za trudne, zamień na alternatywę dla lepszej progresji i bezpieczeństwa.",
        },
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
