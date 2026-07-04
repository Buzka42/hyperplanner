# Graph Report - workout planner  (2026-07-04)

## Corpus Check
- 45 files · ~2,578,204 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 295 nodes · 280 edges · 56 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6dfbbe80`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
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
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 14 edges
2. `useUser()` - 12 edges
3. `cn()` - 12 edges
4. `Badge & Achievement System` - 11 edges
5. `Plan Registry` - 9 edges
6. `generateNextWorkout()` - 8 edges
7. `mkU()` - 6 edges
8. `day()` - 5 edges
9. `Bench Domination Configuration` - 5 edges
10. `getPausedBenchBase()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Acolyte of Strength Badge Image` --asset_for--> `Badge & Achievement System`  [EXTRACTED]
  public/badges/acolyte.png → src/types.ts
- `Behemoth of the Wastes Badge Image` --asset_for--> `Badge & Achievement System`  [EXTRACTED]
  public/badges/behemoth.png → src/types.ts
- `20kg Bench Jump Badge Image` --asset_for--> `Badge & Achievement System`  [EXTRACTED]
  public/badges/bench_jump_20kg.png → src/types.ts
- `30kg Bench Jump Badge Image` --asset_for--> `Badge & Achievement System`  [EXTRACTED]
  public/badges/bench_jump_30kg.png → src/types.ts
- `Bench Psychopath Badge Image` --asset_for--> `Badge & Achievement System`  [EXTRACTED]
  public/badges/bench_psychopath.png → src/types.ts

## Hyperedges (group relationships)
- **Program Identity & Theming Framework** — comp_protectedlayout, prog_trinary, prog_supermutant, prog_painglory, types_userprofile [EXTRACTED 1.00]
- **Program Configurations** — program_bench_domination_config, pencilneck_pencilneck_config, skeleton_skeleton_config, peachy_peachy_config, painglory_pain_glory_config, trinary_trinary_config, ritual_ritual_config, supermutant_super_mutant_config [EXTRACTED 1.00]
- **Program Definitions** — painglory_pain_glory_program, peachy_peachy_program [EXTRACTED 1.00]
- **Workout Logging Flow** — dashboard_dashboard, workoutview_workoutview, workouthistory_workouthistory [INFERRED 0.95]
- **Workout Programs** — readme_v15_finaltrinaryfixes_bench_domination, readme_v15_finaltrinaryfixes_painglory, readme_v15_finaltrinaryfixes_peachy, readme_v15_finaltrinaryfixes_pencilneck, readme_v15_finaltrinaryfixes_skeleton, readme_v15_finaltrinaryfixes_trinary [EXTRACTED 1.00]
- **Workout Achievement System** — emom_executioner_badge, final_boss_badge, first_blood_badge, glory_achieved_badge, glute_queen_badge, highpriest_badge, immortal_badge, initiate_badge, kas_glute_bridge_100_badge, mutant_badge [INFERRED 0.95]

## Communities (75 total, 45 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (5): UserProvider(), useUser(), useLanguage(), getPlan(), cn()

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (29): Badges Registry, Pain & Glory Configuration, Pain & Glory Program, Peachy Configuration, Peachy Program, Compound Exercises Set, Heavy Phase Logic, Pencilneck Configuration (+21 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (14): adv(), day(), exByName(), gen(), hist(), it(), mkU(), mkUser() (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (9): resolveTemplate(), getMuscleContributions(), getBlockFromWorkout(), selectVariation(), async(), fetchPreviousStats(), handleSaveSession(), initializeEmptyState() (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (19): Acolyte of Strength Badge Image, Behemoth of the Wastes Badge Image, 20kg Bench Jump Badge Image, 30kg Bench Jump Badge Image, Bench Psychopath Badge Image, Certified Shoulder Boulder Badge Image, Cannonball Delts Badge Image, Deficit Demon Badge Image (+11 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (13): AdminPanel, Authentication Gate, Dashboard, Entry Page, History Page, Onboarding Flow, Bench Domination Configuration, Bench Domination Program (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.31
Nodes (8): calculateReactiveSetsForMuscle(), generateNextWorkout(), getCurrentCycle(), getIntensificationTechnique(), getRepRange(), getRIRForWeek(), getRIRMessage(), isClusterReady()

### Community 8 - "Community 8"
Cohesion: 0.31
Nodes (4): calculateE1RM(), getPausedBenchBase(), getRepThresholdForWeek(), roundDownToNearest2_5()

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (6): calculateE1RM(), createTrinaryWeeks(), getSetTarget(), getWorkoutPattern(), getWorkoutPositionInBlock(), roundDownTo2_5()

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (7): Bench Domination Badge, Pain & Glory Badge, AMRAP (As Many Reps As Possible), Bench Domination, Epley Formula, Pain & Glory, Reactive Deload

### Community 12 - "Community 12"
Cohesion: 0.7
Nodes (3): calculateE1RM(), roundDownTo2_5(), updateRitual1RMsFromAscensionTest()

## Knowledge Gaps
- **98 isolated node(s):** `Firebase Firestore & Auth Configuration`, `Super Mutant Hypertrophy Program`, `Pain & Glory Program`, `Multilingual Translation System`, `Weak Point Selection Modal` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getBlockFromWorkout()` connect `Community 3` to `Community 9`, `Community 2`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `useUser()` connect `Community 0` to `Community 10`, `Community 3`, `Community 6`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `useLanguage()` connect `Community 0` to `Community 3`, `Community 6`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `Firebase Firestore & Auth Configuration`, `Super Mutant Hypertrophy Program`, `Pain & Glory Program` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._