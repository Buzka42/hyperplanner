# Graph Report - workout planner  (2026-08-21)

## Corpus Check
- 290 files · ~8,364,035 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1328 nodes · 2148 edges · 107 communities detected
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 269 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cd6b79b3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 102|Community 102]]
- [[_COMMUNITY_Community 103|Community 103]]
- [[_COMMUNITY_Community 104|Community 104]]
- [[_COMMUNITY_Community 105|Community 105]]
- [[_COMMUNITY_Community 132|Community 132]]
- [[_COMMUNITY_Community 133|Community 133]]
- [[_COMMUNITY_Community 134|Community 134]]
- [[_COMMUNITY_Community 135|Community 135]]
- [[_COMMUNITY_Community 136|Community 136]]
- [[_COMMUNITY_Community 137|Community 137]]
- [[_COMMUNITY_Community 138|Community 138]]
- [[_COMMUNITY_Community 139|Community 139]]
- [[_COMMUNITY_Community 140|Community 140]]
- [[_COMMUNITY_Community 144|Community 144]]
- [[_COMMUNITY_Community 145|Community 145]]
- [[_COMMUNITY_Community 146|Community 146]]
- [[_COMMUNITY_Community 147|Community 147]]
- [[_COMMUNITY_Community 148|Community 148]]
- [[_COMMUNITY_Community 149|Community 149]]
- [[_COMMUNITY_Community 150|Community 150]]
- [[_COMMUNITY_Community 151|Community 151]]
- [[_COMMUNITY_Community 152|Community 152]]
- [[_COMMUNITY_Community 153|Community 153]]
- [[_COMMUNITY_Community 154|Community 154]]
- [[_COMMUNITY_Community 155|Community 155]]
- [[_COMMUNITY_Community 156|Community 156]]
- [[_COMMUNITY_Community 157|Community 157]]
- [[_COMMUNITY_Community 158|Community 158]]
- [[_COMMUNITY_Community 159|Community 159]]
- [[_COMMUNITY_Community 160|Community 160]]
- [[_COMMUNITY_Community 161|Community 161]]
- [[_COMMUNITY_Community 162|Community 162]]
- [[_COMMUNITY_Community 163|Community 163]]
- [[_COMMUNITY_Community 164|Community 164]]
- [[_COMMUNITY_Community 165|Community 165]]
- [[_COMMUNITY_Community 166|Community 166]]
- [[_COMMUNITY_Community 167|Community 167]]

## God Nodes (most connected - your core abstractions)
1. `empty()` - 42 edges
2. `doc()` - 32 edges
3. `definePlan()` - 32 edges
4. `merge()` - 32 edges
5. `useLanguage()` - 29 edges
6. `genericDoubleProgression()` - 26 edges
7. `cn()` - 22 edges
8. `useUser()` - 22 edges
9. `updateUserProfile()` - 21 edges
10. `registerUser()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `loadRawPlanConfig()` --calls--> `doc()`  [INFERRED]
  src/data/exercises/planConfigRemote.ts → scripts/verify-composer.ts
- `handleSave()` --calls--> `doc()`  [INFERRED]
  src/pages/Settings.tsx → scripts/verify-composer.ts
- `async()` --calls--> `doc()`  [INFERRED]
  src/pages/Settings.tsx → scripts/verify-composer.ts
- `handleSwapChoice()` --calls--> `doc()`  [INFERRED]
  src/pages/WorkoutView.tsx → scripts/verify-composer.ts
- `Acolyte of Strength Badge Image` --asset_for--> `Badge & Achievement System`  [EXTRACTED]
  public/badges/acolyte.png → src/types.ts

## Hyperedges (group relationships)
- **Program Identity & Theming Framework** — comp_protectedlayout, prog_trinary, prog_supermutant, prog_painglory, types_userprofile [EXTRACTED 1.00]
- **Program Configurations** — program_bench_domination_config, pencilneck_pencilneck_config, skeleton_skeleton_config, peachy_peachy_config, painglory_pain_glory_config, trinary_trinary_config, ritual_ritual_config, supermutant_super_mutant_config [EXTRACTED 1.00]
- **Program Definitions** — painglory_pain_glory_program, peachy_peachy_program [EXTRACTED 1.00]
- **Workout Logging Flow** — dashboard_dashboard, workoutview_workoutview, workouthistory_workouthistory [INFERRED 0.95]
- **Workout Programs** — readme_v15_finaltrinaryfixes_bench_domination, readme_v15_finaltrinaryfixes_painglory, readme_v15_finaltrinaryfixes_peachy, readme_v15_finaltrinaryfixes_pencilneck, readme_v15_finaltrinaryfixes_skeleton, readme_v15_finaltrinaryfixes_trinary [EXTRACTED 1.00]
- **Workout Achievement System** — emom_executioner_badge, final_boss_badge, first_blood_badge, glory_achieved_badge, glute_queen_badge, highpriest_badge, immortal_badge, initiate_badge, kas_glute_bridge_100_badge, mutant_badge [INFERRED 0.95]

## Communities (168 total, 57 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (47): checkBadges(), checkCodeword(), clearAllWorkoutDrafts(), KeywordClaimedError, registerUser(), resetProgram(), switchProgram(), updateUserProfile() (+39 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (25): advanceStall(), earnedBackoff(), failureAllowed(), isEvaluable(), nextExposureAdvice(), transferConfidence(), recoveryRecommendation(), advanceDensityBlock() (+17 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (26): selectVariation(), async(), calculateWeight(), fetchPreviousStats(), handleSwapChoice(), initializeEmptyState(), initView(), isAutoLoad() (+18 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (40): analyseWeek(), credit(), evaluate(), majorOf(), summarise(), workingSets(), round(), classifyCore() (+32 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (27): differsFromSeed(), isDirty(), sameDefaults(), save(), hasEn(), hasPl(), patch(), save() (+19 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (26): getAdventureExercise(), accuracyTrend(), agg(), jaccard(), mean(), median(), nearest(), pairScores() (+18 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (12): buildWeightCalculator(), calibrationExercisesFor(), definePlan(), phaseFor(), maxFor(), openingLoad(), percentageBaseFor(), seedLoadFor() (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (42): AdminPanel, Authentication Gate, Badges Registry, Dashboard, Entry Page, History Page, Onboarding Flow, Pain & Glory Configuration (+34 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (18): adventureDraftKey(), adventureResultKey(), buildAdventureSequence(), findPreviousAdventureWeight(), getAdventurePair(), applyHouseProgressions(), houseBalance(), recommendHouseSession() (+10 more)

### Community 9 - "Community 9"
Cohesion: 0.1
Nodes (18): a(), b(), f(), s(), adv(), day(), exByName(), gen() (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (13): adjustForLimitingFatigue(), archBalance(), archOf(), chestProfile(), isBalanced(), preprocess(), preprocess(), kneeCost() (+5 more)

### Community 11 - "Community 11"
Cohesion: 0.19
Nodes (16): doubleProgression(), predictionError(), atlasProgression(), eventHorizonProgression(), genericDoubleProgression(), topOfRange(), gravityProgression(), kingOfTheSquatProgression() (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (14): save(), toggleFeature(), analyzeVideo(), save(), accessExercisesFor(), nextRomLevel(), selectApexEmphasis(), validRegionScore() (+6 more)

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (19): applyUndo(), publish(), revert(), diff(), rollback(), bumpPlanVersion(), cacheKey(), emptyDoc() (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (13): backoffPercentFor(), deriveBackoffLoad(), roundToIncrement(), applyPendingScheduleMode(), calendarPlanWeek(), clampProgramWeek(), requestScheduleMode(), effectiveAthenaMode() (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (14): accept(), confirm(), save(), saveReport(), toggle(), baseWeeklySets(), blockFor(), meetsMinimums() (+6 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (13): calculateReactiveSetsForMuscle(), generateNextWorkout(), getCurrentCycle(), getIntensificationTechnique(), getRepRange(), getRIRForWeek(), getRIRMessage(), isClusterReady() (+5 more)

### Community 17 - "Community 17"
Cohesion: 0.12
Nodes (4): editable(), prune(), save(), resolveTemplate()

### Community 18 - "Community 18"
Cohesion: 0.16
Nodes (10): computeSessionStats(), estimateReps(), formatDuration(), formatTonnage(), heldSeconds(), isPlaceholder(), majorOf(), setLoadKg() (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.11
Nodes (19): Acolyte of Strength Badge Image, Behemoth of the Wastes Badge Image, 20kg Bench Jump Badge Image, 30kg Bench Jump Badge Image, Bench Psychopath Badge Image, Certified Shoulder Boulder Badge Image, Cannonball Delts Badge Image, Deficit Demon Badge Image (+11 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (9): carryScore(), compareCarries(), gauntletFor(), isPowerWork(), limiterAdvice(), nextCarryFor(), preprocess(), firstDayIds() (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.15
Nodes (6): handleSaveSession(), extractPerformanceObservations(), calibrationOutcomes(), calibrationProgression(), round2p5(), progressionHandlerFor()

### Community 22 - "Community 22"
Cohesion: 0.28
Nodes (11): baseAxial(), baseLowerBack(), baseStability(), baseSystemic(), buildExerciseIntelligence(), clamp(), failureSuitability(), hasAny() (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.14
Nodes (3): houseOfIronProgression(), sessionId(), topReps()

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (14): amrapTest(), deficitFeedback(), e2mom(), painGloryProgression(), setsFor(), squat(), ascensionTest(), floor2p5() (+6 more)

### Community 25 - "Community 25"
Cohesion: 0.2
Nodes (10): requiredStatsFor(), getBlockFromWorkout(), topSetCanProgress(), athenaProgression(), upper(), allSetsReach(), liftOf(), progressionForRpe() (+2 more)

### Community 26 - "Community 26"
Cohesion: 0.18
Nodes (7): calculateE1RM(), createWeeks(), getPausedBenchBase(), getRepThresholdForWeek(), roundDownToNearest2_5(), tricepGiantSet(), nuclearGiantSet()

### Community 27 - "Community 27"
Cohesion: 0.21
Nodes (8): rankExerciseSwaps(), describe(), learnedCost(), rating(), recommendSwap(), splitFor(), swapVerdict(), tradeoffsFor()

### Community 29 - "Community 29"
Cohesion: 0.24
Nodes (10): peachyProgression(), pencilneckBenchHistory(), pencilneckCompletion(), pencilneckProgression(), liftHistoryProgression(), epley(), findExercise(), validSets() (+2 more)

### Community 30 - "Community 30"
Cohesion: 0.26
Nodes (10): aiComplete(), accuracyBand(), assessConfidence(), daysAgo(), epley(), predict(), predictFromPriors(), priorEstimate() (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.19
Nodes (7): slotKey(), clampSets(), inScope(), overrideFor(), pickText(), resolveBaseSets(), resolveTips()

### Community 32 - "Community 32"
Cohesion: 0.24
Nodes (8): harvestDay(), harvestExercise(), isProbablyExercise(), normalise(), record(), syntheticUser(), tokens(), userVariants()

### Community 33 - "Community 33"
Cohesion: 0.21
Nodes (5): missingFromPortfolio(), comparableTo(), eligible(), followUpsFor(), recommend()

### Community 35 - "Community 35"
Cohesion: 0.36
Nodes (9): analysePlan(), generatesPerVisit(), buildPreviewUser(), buildPreviewVariants(), generate(), hasStableSlots(), isPlaceholder(), materialiseMovements() (+1 more)

### Community 36 - "Community 36"
Cohesion: 0.25
Nodes (5): getVariantTip(), tipFor(), newTip(), norm(), oldTip()

### Community 37 - "Community 37"
Cohesion: 0.27
Nodes (5): deriveBackoffLoad(), roundToIncrement(), isHeavyCompound(), topRepOf(), warmupFor()

### Community 38 - "Community 38"
Cohesion: 0.24
Nodes (4): resolveDay(), resolveWith(), bench(), resolveFor()

### Community 40 - "Community 40"
Cohesion: 0.33
Nodes (7): check(), checkDay(), checkExercise(), fail(), isPlaceholder(), syntheticUser(), userVariants()

### Community 41 - "Community 41"
Cohesion: 0.33
Nodes (5): calculateE1RM(), createPurgeWeek(), createRitualWeeks(), roundDownTo2_5(), updateRitual1RMsFromAscensionTest()

### Community 42 - "Community 42"
Cohesion: 0.33
Nodes (6): calculateE1RM(), createTrinaryWeeks(), getSetTarget(), getWorkoutPattern(), getWorkoutPositionInBlock(), roundDownTo2_5()

### Community 44 - "Community 44"
Cohesion: 0.22
Nodes (3): techniqueLabel(), formatRest(), formatTempo()

### Community 45 - "Community 45"
Cohesion: 0.46
Nodes (6): contain_image(), front(), make_pdf(), paragraph(), reverse(), wrap()

### Community 47 - "Community 47"
Cohesion: 0.46
Nodes (7): accessories(), allSetsReach(), amrapRepThreshold(), benchDominationProgression(), deloads(), firstWeight(), topOfRange()

### Community 49 - "Community 49"
Cohesion: 0.43
Nodes (4): humanise(), isCuratedGeneralCue(), isPrescriptionSpecific(), rank()

### Community 51 - "Community 51"
Cohesion: 0.29
Nodes (7): Bench Domination Badge, Pain & Glory Badge, AMRAP (As Many Reps As Possible), Bench Domination, Epley Formula, Pain & Glory, Reactive Deload

### Community 53 - "Community 53"
Cohesion: 0.53
Nodes (5): channel(), contrast(), hslToRgb(), luminance(), triplet()

### Community 62 - "Community 62"
Cohesion: 0.6
Nodes (3): canStartRotationSession(), hoursSinceLatest(), sessionsInLastDays()

### Community 63 - "Community 63"
Cohesion: 0.7
Nodes (4): completion(), plankProgression(), plankTarget(), skeletonProgression()

### Community 65 - "Community 65"
Cohesion: 0.83
Nodes (3): inject(), mockUser(), run()

### Community 66 - "Community 66"
Cohesion: 0.83
Nodes (3): brand_front(), build(), tracked_text()

## Knowledge Gaps
- **106 isolated node(s):** `extract-theme  Derives a plan's colour theme from its cover artwork.  Each n`, `WCAG relative luminance.`, `Emitted as bare `H S% L%` to match the existing hsl(var(--token)) usage.`, `Lighten (or darken) until the pair clears `target`.`, `Near-black or near-white, whichever reads better on `rgb`.` (+101 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **57 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `doc()` connect `Community 0` to `Community 2`, `Community 4`, `Community 8`, `Community 12`, `Community 13`, `Community 18`, `Community 21`, `Community 60`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `definePlan()` connect `Community 6` to `Community 1`, `Community 8`, `Community 9`, `Community 10`, `Community 12`, `Community 14`, `Community 15`, `Community 20`, `Community 55`, `Community 25`, `Community 26`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `useLanguage()` connect `Community 43` to `Community 0`, `Community 2`, `Community 35`, `Community 36`, `Community 39`, `Community 8`, `Community 12`, `Community 44`, `Community 14`, `Community 46`, `Community 17`, `Community 61`, `Community 56`, `Community 59`, `Community 60`, `Community 29`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 26 inferred relationships involving `empty()` (e.g. with `athenaProgression()` and `accessories()`) actually correct?**
  _`empty()` has 26 INFERRED edges - model-reasoned connections that need verification._
- **Are the 31 inferred relationships involving `doc()` (e.g. with `checkCodeword()` and `registerUser()`) actually correct?**
  _`doc()` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `merge()` (e.g. with `atlasProgression()` and `benchDominationProgression()`) actually correct?**
  _`merge()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `extract-theme  Derives a plan's colour theme from its cover artwork.  Each n`, `WCAG relative luminance.`, `Emitted as bare `H S% L%` to match the existing hsl(var(--token)) usage.` to the rest of the system?**
  _106 weakly-connected nodes found - possible documentation gaps or missing edges._