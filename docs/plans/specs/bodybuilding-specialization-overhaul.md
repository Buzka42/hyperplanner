# HyperPlanner Comprehensive Plan Enhancement & Upgrade Blueprint

**Document Status:** Master Working Proposal (Live & Editable)  
**Target Git Branch:** `cbranch`  
**Reviewer:** You (Owner) — Toggle `[x]` / `[ ]`, change priority tags, edit formulas, or add notes in any section.

---

## How to Use & Edit This Document
- **Approval Checkbox:** Toggle `[x]` to approve a feature for implementation, or leave `[ ]` to defer/reject.
- **Priority Tags:** Edit `[High]`, `[Medium]`, `[Low]` based on your development roadmap.
- **Owner Notes / Decisions:** Type your specific feedback, custom rep ranges, or exercise replacements under the `> **Owner Notes:**` blocks.

---

# SECTION 1: Bodybuilding & Muscle Specialization Plans

---

### 1.1 Quadfather (Quad Specialization & Knee Resilience)
*Transform Quadfather into the premier quad hypertrophy protocol with real-time patellar joint monitoring, limb proportion logic, and VMO finishers.*

- **Priority:** [High]
- [x] **QF-1: Interactive Patellar Tendon Comfort Check (`openQuadfatherFeedback`)**
  - **Mechanic:** Post-session modal after Day 1/3/4: *"How did your knees feel during deep knee flexion work?"* (`Fresh`, `Comfortable`, `Strained`, `Impaired`).
  - **Behavior:** If marked `Strained` or `Impaired` for 2 sessions in a row, automatically prompts to swap high-shear movements (Sissy Squat, Reverse Nordic) to compressive machine variants (Leg Extension with 3s squeeze at 90° flexion).
- [ ] **QF-2: VMO Teardrop Finisher Module (`vmoTeardropFinisher`)**
  - **Mechanic:** Modular Settings switch adding 2 optional sets of Cyclist Squats (heels elevated 45°, torso vertical) or Poliquin Step-Ups on Day 4.
- [ ] **QF-3: Dynamic 3-Minute Density Burn Window (`densityBurnWindow`)**
  - **Mechanic:** Converts the final Day 4 quad burn slot into a continuous 3-minute density window with a live on-screen countdown.
- [ ] **QF-4: Vastus Lateralis vs Rectus Femoris Bias Selector (`quadBiasPreference`)**
  - **Mechanic:** Settings selector: `Balanced (Default)`, `Sweep Bias (Vastus Lateralis - Narrow Stance)`, `Upper Thigh / Hip Flexor Bias (Rectus Femoris - Sissy/Extension focus)`.
- [ ] **QF-5: Knee Sleeves / Bare Knee Mode (`kneeSupportMode`)**
  - **Mechanic:** Settings toggle: Adjusts baseline squat loading expectations by +5% when heavy 7mm neoprene sleeves or wraps are equipped.
> **Owner Notes / Decision:**  
> _(Type your adjustments, preferred exercises, or notes here)_

---

### 1.2 Cathedral (Chest Specialization & Three Arches Architecture)
*Eliminate flat barbell benching and optimize pec hypertrophy through active management of the Three Arches (Heavy Press, Stretch, and Stable Adduction).*

- **Priority:** [High]
- [x] **CATH-1: Interactive Limiting Fatigue Shifter (`openCathedralLimiterFeedback`)**
  - **Mechanic:** Post-session modal after Heavy Pressing Day: *"What gave out first on your heavy presses?"* (`Pecs (Target Achieved)`, `Triceps (Lockout Fatigue)`, `Front Delts (Anterior Shoulder)`).
  - **Behavior:** If Triceps or Delts dominate fatigue 2 weeks in a row, automatically prompts to shift 2 pressing sets into stable Adduction work (Pec Deck / Low-to-High Cable Crossover) next week.
- [ ] **CATH-2: Incline Bench Angle Preference (`benchAnglePreference`)**
  - **Mechanic:** Settings dropdown: `15° (Low Incline - Clavicular & Sternal Balance)`, `30° (Standard Incline)`, `45° (High Incline - Upper Pec & Front Delt)`.
- [ ] **CATH-3: 30-Second Loaded Stretch Finisher (`loadedStretchFinisher`)**
  - **Mechanic:** Appends a timed 30-second weighted stretch countdown on the final set of Cable Flyes on Stretch Day.
- [ ] **CATH-4: Costal Arch / Lower Pec Flye Module (`costalArchModule`)**
  - **Mechanic:** Settings toggle adding high-to-low decline cable flyes focusing on the lower abdominal head of the pectoralis major.
- [ ] **CATH-5: Pre-Exhaust Pec Activation Toggle (`preExhaustPecActivation`)**
  - **Mechanic:** Places 2 high-RIR sets of Pec Deck Flyes directly before compound dumbbell presses to pre-activate pec motor units without taxing triceps.
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

### 1.3 Arms Race (Arm Hypertrophy & Elbow Longevity)
*Deliver 4 distinct weekly arm exposures (Heavy, Brachialis/Overhead, Lengthened, Density) while actively safeguarding the distal triceps and elbow tendons.*

- **Priority:** [High]
- [x] **AR-1: Elbow Tendon Comfort Check (`openArmsRaceFeedback`)**
  - **Mechanic:** Post-session modal after Day 1 & Day 3: *"How did your elbows feel during extension/curl movements?"* (`Great Pump / Pain-Free`, `Mild Sensitivity`, `Strained`).
  - **Behavior:** If `Strained`, automatically swaps straight-bar curls and skull crushers to neutral-grip dumbbell hammer curls and Bayesian cable curls.
- [ ] **AR-2: Arm Priority Focus Selector (`armPriorityFocus`)**
  - **Mechanic:** Settings selector: `Balanced (Default)`, `Bicep Peak Emphasis (Long Head)`, `Tricep Long-Head Emphasis (Overhead Stretch)`, `Forearm & Grip Focus (Brachioradialis / Pronators)`.
- [ ] **AR-3: Cold vs Pump Arm Circumference Tracker**
  - **Mechanic:** Dedicated arm measurement tracker card on the Arms Race dashboard (tracking baseline vs peak intra-workout pump circumference in cm/in).
- [ ] **AR-4: Bayesian 45° Cable Curl Integration (`bayesianCurlSlot`)**
  - **Mechanic:** Explicit slot for Bayesian curls with step-forward angle and shoulder hyperextension for maximal long-head stretch.
- [ ] **AR-5: 3-Second Isometric Stretch Cues for Tricep Overhead Work**
  - **Mechanic:** Dynamic exercise note enforcing a 3-second pause at maximum elbow flexion on Katana and overhead cable extensions.
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

### 1.4 Hamstring Foundry (3-Function Hamstring Specialization)
*Comprehensive development across Hip Extension, Knee Flexion, and Lengthened Control while preventing spinal erector burnout.*

- **Priority:** [High]
- [x] **HF-1: Lower Back vs Hamstring Sensation Check (`openHamstringFeedback`)**
  - **Mechanic:** Post-session prompt after Day 1 Heavy Hinge: *"Did your lower back or hamstrings fatigue first on heavy RDLs?"* (`Hamstrings (Pure Stretch)`, `Lower Back / Spinal Erectors`).
  - **Behavior:** If Lower Back dominates, Day 4's auxiliary hinge automatically offers a Seated Leg Curl + 45° Back Extension combination to eliminate spinal loading.
- [ ] **HF-2: Structured 5-Stage Nordic Curl Progression Ladder (`nordicProgressionStage`)**
  - **Mechanic:** Formal progression ladder in UI: `Stage 1: Band-Assisted → Stage 2: 5s Eccentric Only → Stage 3: Partial to Box → Stage 4: Full Bodyweight Nordic → Stage 5: Weighted (+Load)`.
- [ ] **HF-3: Seated vs Lying Leg Curl Ratio Selector (`curlOrientationRatio`)**
  - **Mechanic:** Settings selector: `Lengthened Bias (Seated Curls 70%)`, `Balanced (50/50)`, `Shortened Peak Bias (Lying Curls 70%)`.
- [ ] **HF-4: Glute-Ham Developer (GHD) Integration Option**
  - **Mechanic:** Toggle to swap Romanian Deadlifts for full Glute-Ham Raises if gym equipment is available.
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

### 1.5 Overhead Dominion (Overhead Press & Shoulder Width)
*Build a massive overhead press while maximizing lateral and rear delt hypertrophy.*

- **Priority:** [Medium]
- [ ] **OD-1: Shoulder Impingement & Acromion Comfort Check (`openOverheadFeedback`)**
  - **Mechanic:** Post-session check after heavy standing presses. If anterior shoulder pinching occurs, automatically suggests swapping to Landmine Press, Swiss Bar OHP, or Incline Neutral DB Press.
- [ ] **OD-2: Daily Lateral Delt Volume Booster (`dailyLateralBooster`)**
  - **Mechanic:** Modular Settings switch adding 3 light, high-rep sets (15–25 reps) of cable/dumbbell lateral raises at the end of every training session.
- [ ] **OD-3: Face Pull External Rotation Finisher (`facePullFinisher`)**
  - **Mechanic:** Appends 3 sets of Rope Face Pulls with a 2-second external rotation hold on upper body days.
- [ ] **OD-4: Push Press Overload Peak Phase (Weeks 7–10)**
  - **Mechanic:** Option to introduce dynamic leg drive on the final single set to overload eccentric lockout strength.
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

### 1.6 Peachy (Glute Specialization)
*Maximize glute hypertrophy across stretch, thrust, and abduction vectors.*

- **Priority:** [Medium]
- [ ] **PCH-1: Hip Thrust Stance & Foot Placement Guide**
  - **Mechanic:** In-workout visual guidance card detailing foot distance and knee abduction angles for maximal gluteus maximus vs hamstring activation.
- [ ] **PCH-2: Gluteus Medius / Abduction Hypertrophy Module (`gluteMediusModule`)**
  - **Mechanic:** Adds 3 sets of Seated Cable Abduction (leaning forward 30°) on Days 2 & 4.
- [ ] **PCH-3: Glute Pump & DOMS Auto-Taper**
  - **Mechanic:** Post-session rating adjusting next session's Kas Glute Bridge volume if severe soreness impairs hip hinge mechanics.
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

# SECTION 2: Bodybuilding & Powerbuilding Engines

---

### 2.1 Neural Overload (1-6 Post-Activation Powerbuilding)
*Scientific post-activation potentiation where 90% heavy singles prime explosive 75% 6-rep hypertrophy waves.*

- **Priority:** [High]
- [x] **NO-1: Autoregulated Wave Coupling (`autoregulatedWaveCoupling`)**
  - **Mechanic:** If Set 2 (6 reps @ 75%) moves with high bar speed (RIR ≥ 3 or checked "Explosive"), dynamically increases Wave 2 loads (+2.5 kg single @ 92.5%, +2.5 kg six-pack @ 77.5%).
  - **Grind Handling:** If Set 1 was an RPE 10 grind, caps Wave 2 at 90% (holding load).
- [ ] **NO-2: Bar Velocity / Sensation Feedback Checkbox**
  - **Mechanic:** Interactive checkbox on Set 2: *"Felt lighter & faster than Set 1 single?"* (Confirms PAP potentiation).
- [ ] **NO-3: Optional Wave 3 Overdrive Module (`wave3Overdrive`)**
  - **Mechanic:** For advanced powerbuilders in Weeks 6–9: Unlocks an optional 3rd wave (1 rep @ 95%, 6 reps @ 80%) if both previous waves achieved RIR ≥ 2.
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

### 2.2 Tenfold (German Volume Training 10×10)
*High-density 100-rep single-movement stimulus with strict rest pacing.*

- **Priority:** [High]
- [x] **TF-1: Intra-Session Rep Collapse Auto-Discount (`tenfoldRepCollapsePrompt`)**
  - **Mechanic:** If reps drop below 7 before Set 6 (e.g. Sets 1–4: 10 reps, Set 5: 6 reps), prompt athlete: *"Drop load by 10% to complete all 10 sets with target hypertrophy stimulus?"*
- [ ] **TF-2: Strict Audio / Visual Rest Pacing Chime (`strictRestChime`)**
  - **Mechanic:** Visual pulsing countdown and sound chime enforcing strict 60s (supersets) or 90s (primary lifts) rest intervals.
- [ ] **TF-3: 8×8 Consolidation Wave (Weeks 5–8)**
  - **Mechanic:** Smooth transition from 10×10 @ 60% into Gironda-style 8×8 @ 68% in Phase 2.
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

### 2.3 Pencilneck Eradication Protocol (Bodybuilding & Yoke Focus)
*Classic bodybuilding with intense heavy/drop-set phases and Final Exam challenges.*

- **Priority:** [Medium]
- [ ] **PN-1: Heavy Trap Hypertrophy Module (`trapHypertrophyModule`)**
  - **Mechanic:** Settings switch adding 3 sets of Heavy Kelso Shrugs or Barbell Power Shrugs on Day 1 & Day 3.
- [ ] **PN-2: Direct Neck Flexion & Extension Module (`neckFlexionModule`)**
  - **Mechanic:** Settings switch adding 3 sets of Neck Extension (plate/harness) and 3 sets of Neck Flexion.
- [ ] **PN-3: Yoke Index Dashboard Radar**
  - **Mechanic:** Visual radar tracking Upper Traps, Neck, Rear Delts, and Lateral Delts development over cycles.
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

### 2.4 Purgatorio (Accumulation & Intensification Waves)
*Alternating 3-week Accumulation (high volume, 30X0 tempo) and 3-week Intensification (heavy loads).*

- **Priority:** [Medium]
- [ ] **PURG-1: Dynamic Load Seeding from Accumulation to Intensification**
  - **Mechanic:** Automatically seeds Intensification opening loads from the peak estimated 1RM achieved during the 3-week Accumulation block.
- [ ] **PURG-2: 30X0 Strict Tempo Visual Metronome**
  - **Mechanic:** On-screen visual metronome pulsing 3-second eccentric countdown for Accumulation sets.
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

### 2.5 Venus Rising (Glute & Upper Silhouette Hypertrophy)
*Dual-tree (3/4-day) female bodybuilding split.*

- **Priority:** [Medium]
- [ ] **VR-1: Glute vs Upper Body Silhouette Ratio Selector**
  - **Mechanic:** Settings selector: `Glute Dominant (65/35)`, `Balanced (50/50)`, `Upper Silhouette / Delts Dominant (60/40)`.
- [ ] **VR-2: RPE Escalation Feedback Check**
  - **Mechanic:** Post-session check validating whether the final isolation drop-sets achieved true muscular failure (RIR 0).
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

# SECTION 3: Calisthenics & Structural Balance Plans

---

### 3.1 Workhorse (Weighted Calisthenics & Chin-Up Specialization)
*Weighted Chin-Up as the central strength lift using Total System Weight.*

- **Priority:** [Medium]
- [ ] **WH-1: Forearm & Grip Sensation Check (`openWorkhorseFeedback`)**
  - **Mechanic:** Post-workout prompt: *"Did your grip fatigue before your lats on heavy chins?"* If yes, recommends chalk/strap protocol or auxiliary pinch-grip work.
- [ ] **WH-2: Chin-Up Grip Variation Selector (`chinGripPreference`)**
  - **Mechanic:** Settings selector: `Neutral-Grip (Shoulder/Elbow Friendly)`, `Supinated (Classic Bicep)`, `Gymnastic Rings (Free Rotation)`.
- [ ] **WH-3: Weighted Dip vs Weighted Chin-Up Strength Ratio Card**
  - **Mechanic:** Visual balance indicator comparing Total System Weight on Dips vs Chin-Ups (ideal ratio 1.05 : 1.00).
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

### 3.2 Gravity Is Optional (Calisthenics & Density)
*Bodyweight mastery, total system weight, and total-rep challenge days.*

- **Priority:** [Medium]
- [ ] **GIO-1: Shoulder Capsule Comfort Check**
  - **Mechanic:** Checks anterior shoulder comfort after heavy weighted dip sessions, recommending dip bar width adjustments or deficit push-up swaps if discomfort arises.
- [ ] **GIO-2: Total-Rep Challenge Ladder (Day 3)**
  - **Mechanic:** Interactive leaderboard tracking the minimum number of sets required to complete 40 total chin-ups.
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

### 3.3 Immaculate (Re)Structure (Poliquin Structural Ratios)
*Diagnose and repair muscular imbalances using Charles Poliquin's gold-standard strength ratios.*

- **Priority:** [High]
- [ ] **IM-1: Poliquin Structural Balance Radar Chart on Dashboard**
  - **Mechanic:** Visual spider/radar chart displaying athlete's current 1RMs vs ideal ratios relative to Close Grip Bench:
    - Incline Bench: 83%
    - Weighted Chin-Up: 81% (Total System Weight)
    - Scott / Preacher Curl: 46%
    - Reverse Barbell Curl: 30%
    - Standing External Rotation: 9%
- [ ] **IM-2: Lagging Ratio Remediation Workouts (`laggingRatioBooster`)**
  - **Mechanic:** Automatically identifies the athlete's single lowest ratio and adds 2 targeted isolation sets at the end of Day 2 & Day 4.
> **Owner Notes / Decision:**  
> _(Type your adjustments or notes here)_

---

# SECTION 4: Density, Time-Capped & Machine Plans

---

### 4.1 Iron Clock (Density Overload Engine)
- [ ] **IC-1: Density Block Visual Stopwatch & Rep Sound Chimes**
  - **Mechanic:** Interactive 8-minute / 10-minute density block timer with audible beat chimes at 30-second marks.
- [ ] **IC-2: Round Completion Particle Animation**
  - **Mechanic:** High-impact visual celebratory animation upon logging each round in the density block.

### 4.2 REDLINE (Time-Budgeted Full Body)
- [ ] **RL-1: Emergency 20-Minute Express Mode (`redlineExpressMode`)**
  - **Mechanic:** One-tap toggle pruning auxiliary sets to compress the session into a strict 20-minute window when time is limited.
- [ ] **RL-2: Conditioning Recovery Heart-Rate Log**
  - **Mechanic:** Post-session RPE and breath recovery tracker following the 8-minute furnace finisher.

### 4.3 Lazarus (Return to Training & Muscle Memory Curve)
- [ ] **LAZ-1: Muscle Memory Detraining Visual Curve on Dashboard**
  - **Mechanic:** Interactive curve showing projected vs actual strength re-acquisition across the 8-week ramp.
- [ ] **LAZ-2: Acceleration Jump Gate**
  - **Mechanic:** If Week 2 AMRAP achieves RIR ≥ 4, prompts the athlete to skip directly to Week 4 volume/load tiers.

### 4.4 Blackout (Single-Work-Set High-Intensity Protocol)
- [ ] **BO-1: Rest-Pause & Myo-Rep Match Expansion**
  - **Mechanic:** Option to convert the single work set into a rest-pause cluster (1 work set to failure + 3 mini-sets of 3–4 reps with 15s rest).
- [ ] **BO-2: Low-Fatigue High-Stimulus Machine Switcher**
  - **Mechanic:** Fast 1-tap swap from free weight compounds to stable plate-loaded machines (e.g. Pendulum Squat / Prime Incline Press).

### 4.5 Monolith (Machine-Dominant Hypertrophy)
- [ ] **MON-1: Machine Stack Pin Micro-Increment Calculator**
  - **Mechanic:** Includes 1.25 kg / 2.5 kg magnetic add-on plates in load calculations for selectorized weight stacks.
- [ ] **MON-2: Resistance Curve / Cam Tension Cues**
  - **Mechanic:** Exercise cues detailing where peak tension occurs (Lengthened vs Mid-Range vs Shortened) for each machine.

---

# SECTION 5: Summary Checklist & Next Steps

| Plan | Priority | Proposed Features | Status |
|---|---|---|---|
| **Quadfather** | High | Patellar check, VMO finisher, density burn, knee mode | Ready for Review |
| **Cathedral** | High | Limiter feedback, bench angle, 30s stretch, pre-exhaust | Ready for Review |
| **Arms Race** | High | Elbow check, focus selector, Bayesian curl, arm tracker | Ready for Review |
| **Hamstring Foundry** | High | Sensation check, Nordic ladder, curl ratio, GHD | Ready for Review |
| **Neural Overload** | High | Autoregulated wave coupling, velocity check, wave 3 | Ready for Review |
| **Tenfold** | High | Rep collapse discount, audio timer, 8x8 wave | Ready for Review |
| **Immaculate Restructure** | High | Poliquin balance radar, lagging ratio booster | Ready for Review |
| **Overhead Dominion** | Med | Acromion check, lateral booster, face pull finisher | Ready for Review |
| **Workhorse** | Med | Grip check, grip variations, dip/chin ratio card | Ready for Review |
| **Pencilneck Eradication** | Med | Trap module, neck module, yoke radar | Ready for Review |
| **Purgatorio** | Med | Dynamic load seeding, 30X0 visual metronome | Ready for Review |
| **Venus Rising** | Med | Silhouette ratio, RPE failure validator | Ready for Review |
| **Peachy** | Med | Stance guide, glute medius module, DOMS taper | Ready for Review |
| **Gravity Is Optional** | Med | Shoulder check, 40-rep challenge ladder | Ready for Review |
| **Iron Clock** | Med | Density stopwatch, round completion effects | Ready for Review |
| **REDLINE** | Med | 20-min express mode, conditioning tracker | Ready for Review |
| **Lazarus** | Med | Memory curve graph, acceleration gate | Ready for Review |
| **Blackout** | Med | Rest-pause cluster, low-fatigue machine swap | Ready for Review |
| **Monolith** | Med | Pin micro-increments, cam curve notes | Ready for Review |
