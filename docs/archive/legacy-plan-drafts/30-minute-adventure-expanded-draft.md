# 30 Minute Adventure — Hyperplanner Plan Specification

**Project:** Hyperplanner  
**Plan name:** `30 Minute Adventure`  
**Recommended plan ID:** `30-minute-adventure`  
**Primary goal:** A genuinely fast full-body hypertrophy/strength workout built from five user-selected supersets.  
**Target workout duration:** approximately 30 minutes after warm-up/setup.  
**Core constraint:** minimize equipment changes and walking between stations.

---

## 1. Product concept

`30 Minute Adventure` is not a conventional fixed exercise list.

At the beginning of every workout, the user chooses **one exercise pairing from each of five muscle-group portals**:

1. Chest / Upper Back
2. Abs / Glutes
3. Calves / Shoulders
4. Quads / Triceps
5. Biceps / Hamstrings / Lower Back

Each selected pairing contains two exercises performed as a superset.

### Workout size

- 5 selected pairings
- 10 exercises total
- 2 working sets per exercise
- 20 working sets total
- Minimal transition time between exercise A and exercise B
- Short rest after the complete A+B superset
- Target: finish in roughly 30 minutes

Do **not** default this plan to 3 working sets per exercise. Five supersets × 3 rounds would produce 30 working sets and would make the 30-minute target unrealistic for normal gym use.

---

# 2. Non-negotiable pairing rules

When implementing or later expanding the exercise pool:

1. **Do not pair exercises that require walking between unrelated machines.**
2. Prefer:
   - same bench;
   - same rack;
   - same Smith station;
   - same cable stack;
   - same cable attachment;
   - same dumbbell area;
   - same machine;
   - machine + bodyweight exercise performed next to the machine.
3. A small adjustment such as moving a bench, changing a cable height, changing a weight-stack pin, or switching dumbbells is acceptable.
4. Whenever practical, pair:
   - one lower-rep/heavier exercise; and
   - one higher-rep/lighter exercise.
5. Compound exercises generally use lower rep ranges.
6. Isolation/bodyweight exercises generally use higher rep ranges.
7. Exercise order should prioritize:
   - safety;
   - speed of setup;
   - logical loading;
   - keeping the 30-minute promise.
8. Do not add a new pairing solely because it is physiologically interesting if it creates excessive station changes.

---

# 3. Exercise-tip / advice deduplication rule

## IMPORTANT IMPLEMENTATION INSTRUCTION

Before adding **any new advice, note, technique cue, setup cue, safety cue, or tip-bubble text** for an exercise, the coding agent must first inspect the existing Hyperplanner codebase.

Check at minimum:

- existing `Exercise.notes`;
- all plan data files containing the same exercise;
- translated/global exercise-tip mappings;
- aliases or alternative spellings of the exercise;
- existing `getExerciseAdvice()` implementations;
- any plan-specific advice helpers;
- exercise alternates that may contain the same movement under another name.

### Normalize aliases before deciding advice is missing

Examples:

- `DB` = `Dumbbell`
- `BB` = `Barbell`
- `RDL` = `Romanian Deadlift`
- `Military Press` may overlap with `Standing Overhead Press`
- `French Press` may overlap with `Overhead Triceps Extension`
- `Side Delt Raise` may overlap with `Lateral Raise`
- `Rear Delt Fly` may overlap with `Reverse Fly`
- singular/plural exercise names should not create duplicate advice

### Deduplication behavior

If equivalent advice already exists:

- **reuse it;**
- do not create a second copy with slightly different wording.

If existing advice covers only part of the proposed cue:

- preserve the existing advice;
- append only the missing useful information.

If the new cue is universally applicable to that exercise:

- prefer the existing global/reusable advice mechanism instead of duplicating it only inside `30-minute-adventure`.

If the cue is specific to this pairing/setup:

- keep it pair-specific.

### Tip-bubble style

Keep workout-view tips short enough to read between sets.

Preferred structure:

1. **setup/logistics cue;**
2. **one important execution cue;**
3. optional **safety cue** where justified.

Avoid turning tip bubbles into exercise tutorials.

---

# 4. Superset execution model

Each selected portal becomes one superset block.

Example:

```text
PORTAL I — CHEST / UPPER BACK

A1 Flat DB Bench Press          6–8
B1 Bench-Supported 1-Arm Row   10–12 / side

REST 60–75 sec

A2 Flat DB Bench Press          6–8 or FAILURE
B2 Bench-Supported 1-Arm Row   10–12 / side or FAILURE
```

### Default transition timing

- A → B: no formal rest timer; transition immediately when safe.
- B → next round: use the pair's prescribed rest.
- Do not lock the UI while a timer is running.

### Suggested post-superset rest

- Heavy barbell / RDL / squat / standing press pair: **75 sec**
- Normal mixed compound + isolation pair: **60 sec**
- Mostly isolation/bodyweight pair: **45–60 sec**

The user can take longer when needed. The app should guide speed, not prevent sensible recovery.

---

# 5. "Did that feel easy?" mechanic

This is a defining feature of the plan.

After the user saves the **first working set** for an eligible exercise, show:

> **Did that feel easy?**

Buttons:

- `YES`
- `NO`

This should be **exercise-specific**, not one question for the entire pair.

Example:

1. User completes Flat DB Bench Press set 1.
2. User saves weight/reps.
3. Prompt: `Did that feel easy?`
4. User selects `YES`.
5. Portal animation triggers.
6. Arnold-style character pops out.
7. Chat bubble displays:

> **GO TO FAILURE ON THIS SET**

8. Set 2 target for that exercise changes visually to `FAILURE`.

If user selects `NO`:

- retain the normal set-2 rep target.

Repeat independently for exercise B.

## Exception

If set 2 is **already programmed to failure** for that exercise, do not ask the redundant `Did that feel easy?` question.

Example: the second plank in Machine Hip Thrust / Plank is already programmed to failure.

---

# 6. Failure rules

The visual Arnold message can remain:

> **GO TO FAILURE ON THIS SET**

However, implementation should distinguish between:

### True / momentary muscular failure

Appropriate for many:

- machine exercises;
- cable isolation exercises;
- curls;
- lateral raises;
- triceps isolation;
- calf raises;
- controlled bodyweight movements;
- pec deck;
- rear-delt machine;
- frog pumps.

### Technical failure / last clean rep

Use for higher-risk free-weight compounds:

- Barbell Squat
- Barbell Romanian Deadlift
- heavy DB Romanian Deadlift
- Cable Romanian Deadlift if technique deteriorates
- Standing Military Press
- Barbell Row
- heavy pressing where no safe spotter/safeties are available

For these movements the user's visible target can still say `FAILURE`, but the tip should make the rule clear:

> **Stop at the last clean rep. Do not chase an ugly failed rep.**

Do not encourage an intentionally failed squat or uncontrolled hinge.

---

# 7. PORTAL I — Chest / Upper Back

## Pair 1 — Flat DB Bench Press / Bench-Supported Single-Arm DB Row

**Rep targets**

- Flat DB Bench Press: **6–8**
- Bench-Supported Single-Arm DB Row: **10–12 / side**
- Rest after pair: **60–75 sec**

**Station logic:** same bench + same dumbbell area.

### Pair setup tip

> Use the same bench for both exercises. Keep the row dumbbell beside the bench before starting.

### Flat DB Bench Press advice

Preserve/reuse any existing Hyperplanner bench-press advice before adding this.

Proposed additional cues if missing:

- Set the shoulder blades before the first rep and keep the upper back planted.
- Use a controlled descent; do not turn the last reps into shallow half-reps.
- Choose a load that lets the dumbbells stay stable without wasting time on an excessively heavy setup.
- If training alone, stop before a rep that would leave the dumbbells trapped over you.

### Bench-Supported Single-Arm DB Row advice

**User-provided cue that must be preserved:**

> One hand and one knee on the bench. Use straps on the row.

Additional cues if not already present:

- Keep the torso stable instead of rotating the chest open to move the dumbbell.
- Drive the elbow back toward the hip rather than shrugging the shoulder toward the ear.
- Let the shoulder blade reach at the bottom without losing your supported position.
- Set up both row straps before the superset so the transition stays quick.

---

## Pair 2 — Incline Barbell Bench Press / Barbell Row — ARNOLD'S CHOICE

**Rep targets**

- Incline Barbell Bench Press: **6–8**
- Barbell Row: **10–12**
- Rest after pair: **75 sec**

**Station logic:** same rack + same bar area.

**Tag:** `ARNOLD'S CHOICE`

### Pair setup tip

> Keep the bar/rack area ready for both movements. Move the bench clear for rows instead of relocating to another station.

### Incline Barbell Bench Press advice

Additional cues if missing:

- Use a moderate incline rather than turning the movement into a near-vertical shoulder press.
- Keep the upper back tight against the bench throughout the set.
- Touch consistently around the upper/mid chest based on comfortable shoulder mechanics.
- Use safeties or a spotter when pushing the second set hard.

### Barbell Row advice

Additional cues if missing:

- Brace before each set and hold a consistent torso angle.
- Pull the bar toward the lower ribs/upper abdomen instead of standing progressively more upright.
- Do not turn the final reps into full-body heaves.
- Treat failure as **technical failure**: stop when the torso position or bar path breaks down.

---

## Pair 3 — 30° Incline Smith Machine Bench Press / DB Seal Row

**Rep targets**

- 30° Incline Smith Machine Bench Press: **6–8**
- DB Seal Row: **12–15**
- Rest after pair: **60–75 sec**

**Station logic:** same bench; bench remains in/near Smith area.

### Pair setup tip

**User-provided cue that must be preserved:**

> Use the same bench for both. Move it forward for rows.

Additional setup cue if missing:

- Place the row dumbbells beside the front of the bench before beginning so the station change takes seconds.

### 30° Incline Smith Machine Bench Press advice

Additional cues if missing:

- Position the bench so the fixed Smith bar path feels natural at the bottom.
- Keep the scapulae set and avoid letting the shoulders roll forward near lockout.
- Do not bounce the bar off the chest.
- Set the Smith safeties before the hard set.

### DB Seal Row advice

Additional cues if missing:

- Keep the chest supported for the entire rep; do not lift the torso to finish.
- Pull with the elbows rather than initiating by shrugging.
- Briefly control the top before lowering into a full stretch.
- Use straps if grip starts becoming the limiter.

---

## Pair 4 — Pec Deck / Single-Arm Rear-Delt Machine Fly

**Rep targets**

- Pec Deck: **8–12**
- Single-Arm Rear-Delt Machine Fly: **15–20 / side**
- Rest after pair: **45–60 sec**

**Station logic:** same pec-deck / rear-delt machine if the gym's unit supports both functions.

### Pair setup tip

> Do not leave the machine. Switch the machine from pec-deck position to rear-delt position and continue the superset.

### Pec Deck advice

Additional cues if missing:

- Keep the chest against the pad/back support rather than reaching the shoulders forward to finish.
- Think about bringing the upper arms together instead of squeezing with the hands.
- Use a controlled stretch; do not allow the machine to yank the shoulders backward.
- Keep the weight moderate enough that the torso does not leave the pad.

### Single-Arm Rear-Delt Machine Fly advice

Additional cues if missing:

- Work one arm at a time if that gives a cleaner rear-delt line of pull.
- Let the arm travel slightly across the body at the start if the machine allows it comfortably.
- Lead with the upper arm rather than turning the movement into a triceps extension.
- Keep the trap relaxed; stop before shoulder elevation takes over.

---

## Pair 5 — Dual-Cable Chest Press / Dual-Cable High Row

**Rep targets**

- Dual-Cable Chest Press: **8–10**
- Dual-Cable High Row: **12–15**
- Rest after pair: **60 sec**

**Station logic:** same dual cable rack.

### Pair setup tip

> Keep both pulleys around chest/shoulder height. Press facing away from the stack, then turn around for the row. Avoid rebuilding the cable station between exercises.

### Dual-Cable Chest Press advice

Additional cues if missing:

- Use a staggered stance if needed for stability.
- Keep ribs and pelvis controlled rather than leaning farther forward as fatigue builds.
- Allow a comfortable chest stretch without letting the shoulders dump forward.
- Press on a consistent slightly inward arc.

### Dual-Cable High Row advice

Additional cues if missing:

- Pull toward upper chest/lower face height based on cable position.
- Keep elbows in a comfortable high-but-not-forced position.
- Finish with the upper back/rear delts rather than lumbar extension.
- Control the reach forward before beginning the next rep.

---

# 8. PORTAL II — Abs / Glutes

## Pair 1 — Hanging Leg Raise / Bench Hip Thrust

**Rep targets**

- Hanging Leg Raise: **10–15**
- Bench Hip Thrust: **6–10**
- Rest after pair: **60–75 sec**

**Station logic:** bench positioned near a pull-up bar.

### Pair setup tip

**User-provided cue that must be preserved:**

> Hip thrusts off a bench, preferably somewhere close to a pull-up bar.

Additional setup cue if missing:

- Prepare the bar/pad/weight before beginning the hanging leg raises so the transition does not become the longest part of the superset.

### Hanging Leg Raise advice

Additional cues if missing:

- Start the rep by curling the pelvis rather than only swinging the legs upward.
- Minimize momentum and reset the hang if swinging becomes excessive.
- Do not force straight legs if hamstring flexibility makes the movement sloppy; bent-knee raises are acceptable.
- Stop if grip gives out before the abs and use an appropriate variation rather than turning the set into kipping.

### Bench Hip Thrust advice

Additional cues if missing:

- Set the bench contact around the lower shoulder blades and keep it stable.
- Finish by extending the hips, not by hyperextending the lower back.
- Keep the chin slightly tucked and ribs controlled at lockout.
- Pause briefly in the contracted position instead of bouncing through the top.

---

## Pair 2 — Machine Hip Thrust / Plank

**Rep targets**

- Machine Hip Thrust: **6–10**
- Plank set 1: **30–45 sec**
- Plank set 2: **FAILURE**
- Rest after pair: **as needed after plank, usually 30–60 sec**

**Station logic:** plank is performed beside the hip-thrust machine.

### Pair setup tip

**User-provided cue that must be preserved:**

> Do planks while resting between hip thrusts, then catch a breath and do hip thrusts. On the second set of planks go to failure.

Recommended sequence:

1. Hip Thrust set 1
2. Plank set 1
3. Brief breathing recovery
4. Hip Thrust set 2
5. Plank set 2 to failure

Because plank set 2 is already programmed to failure, **do not show the "Did that feel easy?" prompt for plank set 1.**

### Machine Hip Thrust advice

Additional cues if missing:

- Adjust the machine so the pad/load sits securely over the hips.
- Keep the pelvis controlled and avoid finishing through lumbar hyperextension.
- Drive through a stable foot position and maintain even pressure left/right.
- Use the machine's safety/start mechanism deliberately; do not rush the unrack.

### Plank advice

Additional cues if missing:

- Brace glutes and abs together so the lower back does not sag.
- Keep the ribs down and pelvis slightly tucked.
- End the set when spinal position can no longer be maintained.
- "Failure" means inability to hold the correct plank position, not simply remaining on the elbows while the posture collapses.

---

## Pair 3 — Cable Crunch / Cable Pull-Through

**Rep targets**

- Cable Crunch: **12–15**
- Cable Pull-Through: **8–12**
- Rest after pair: **60 sec**

**Station logic:** same cable stack + same rope.

### Pair setup tip

> Keep the rope attached. Crunch from the high pulley, move the pulley to the bottom position, change the weight pin if needed, and go directly into pull-throughs.

### Cable Crunch advice

Additional cues if missing:

- Flex the trunk rather than turning the exercise into a kneeling hip hinge.
- Keep the rope position consistent near the head without pulling aggressively with the arms.
- Exhale into the shortened position.
- Use a load that allows spinal flexion instead of simply sitting the hips backward.

### Cable Pull-Through advice

Additional cues if missing:

- Walk far enough from the stack that the cable stays loaded at the bottom.
- Push the hips backward and keep the shins relatively quiet.
- Finish with the glutes rather than leaning backward.
- Keep the rope close to the body during the hinge.

---

## Pair 4 — Bench Reverse Crunch / DB Hip Thrust

**Rep targets**

- Bench Reverse Crunch: **12–20**
- DB Hip Thrust: **8–12**
- Rest after pair: **45–60 sec**

**Station logic:** same bench + dumbbell.

### Pair setup tip

> Use one bench for everything. Perform reverse crunches, then slide into position for the dumbbell hip thrust without changing stations.

### Bench Reverse Crunch advice

Additional cues if missing:

- Think about rolling the pelvis toward the ribs rather than merely bringing the knees toward the chest.
- Lower under control until the pelvis returns to the bench.
- Avoid creating momentum by swinging the legs.
- Hold the bench only as firmly as needed for stability.

### DB Hip Thrust advice

Additional cues if missing:

- Center the dumbbell securely over the hips and use padding if needed.
- Keep feet planted and finish with the glutes.
- Avoid overextending the lower back at lockout.
- If the dumbbell becomes awkward to position at heavier loads, switch to a safer loading method rather than fighting the setup.

---

## Pair 5 — Ab Wheel / Frog Pump

**Rep targets**

- Ab Wheel: **8–12**
- Frog Pump: **25–40**
- Rest after pair: **45–60 sec**

**Station logic:** floor/bodyweight station; nearly zero setup.

### Pair setup tip

> Keep the ab wheel beside your mat. Finish the rollout set and immediately move into frog pumps.

### Ab Wheel advice

Additional cues if missing:

- Maintain a slight posterior pelvic tilt and keep the ribs from flaring.
- Only roll as far as you can while controlling the lumbar spine.
- Initiate the return with the abs rather than aggressively pulling the hips backward.
- Shorten the range before allowing the lower back to collapse.

### Frog Pump advice

Additional cues if missing:

- Place the soles of the feet together and let the knees fall outward comfortably.
- Drive the hips upward through the glutes rather than lumbar extension.
- Use continuous controlled reps and a strong squeeze at the top.
- High reps are intentional; do not rush them into tiny partials.

---

# 9. PORTAL III — Calves / Shoulders

## Pair 1 — Standing DB/KB Single- or Double-Leg Calf Raise / Standing Military Press

**Rep targets**

- Standing DB/KB Calf Raise: **15–20**
- Standing Military Press: **6–8**
- Rest after pair: **75 sec**

**Station logic:** step beside the press rack.

### Pair setup tip

**User-provided cue that must be preserved:**

> Do the calf raises off a step close to the rack where you press. Support yourself with one hand on the rack, DB/Kettlebell in the other.

Additional setup cue if missing:

- Prepare the step and calf weight before the first press set; do not carry equipment across the gym mid-superset.

### Standing DB/KB Calf Raise advice

Additional cues if missing:

- Use the support hand for balance, not to pull yourself upward.
- Lower into a controlled stretch before each rep.
- Rise through the ball of the foot and avoid bouncing out of the bottom.
- For single-leg work, keep the working ankle tracking naturally rather than rolling outward.

### Standing Military Press advice

Additional cues if missing:

- Brace the trunk and glutes before the bar leaves the shoulders.
- Keep the bar path close to the face and finish stacked overhead.
- Do not turn the last reps into a standing incline press through excessive back extension.
- Failure target = **last clean rep**, especially without safeties.

---

## Pair 2 — Hack Squat Calf Raise / Side-Leaning Single-Arm DB Lateral Raise

**Rep targets**

- Hack Squat Calf Raise: **10–15**
- Side-Leaning Single-Arm DB Lateral Raise: **12–20 / side**
- Rest after pair: **60 sec**

**Station logic:** ideally perform lateral raises while leaning against the hack frame itself. If that is not safe/possible, use the nearest stable upright. Avoid walking to a distant Smith machine solely for the lateral raise.

### Pair setup tip

**User-provided concept to preserve:**

> Lean against a stable upright and cycle the two exercises since the lateral raise is performed one arm at a time.

Gym-specific note:

- The available standing hack squat begins at approximately **40 kg**, so the calf-raise target is deliberately not set excessively high.

### Hack Squat Calf Raise advice

Additional cues if missing:

- Position the feet so the heels can travel through a comfortable full range.
- Keep knees softly extended rather than aggressively locked.
- Pause/control the stretched bottom position instead of bouncing.
- Use the machine's safety stops correctly.

### Side-Leaning Single-Arm DB Lateral Raise advice

Additional cues if missing:

- Use the lean to load the delt through a longer useful range, not to create momentum.
- Lead with the elbow/upper arm.
- Stop around the point where the upper trap begins taking over.
- Keep the torso fixed against the support rather than rocking with each rep.

---

## Pair 3 — Seated DB Calf Raise / Seated DB Lateral Raise

**Rep targets**

- Seated DB Calf Raise: **15–25**
- Seated DB Lateral Raise: **12–20**
- Rest after pair: **45–60 sec**

**Station logic:** same bench.

### Pair setup tip

> Stay on the same bench. Keep the heavier calf dumbbell and lighter lateral-raise dumbbells beside you before the first round.

### Seated DB Calf Raise advice

Additional cues if missing:

- Place the dumbbell securely above the knee rather than directly on the kneecap.
- Elevate the forefoot on a small plate/step if needed for more range.
- Control the bottom stretch and finish each rep with plantar flexion.
- Do not bounce the dumbbell off the thigh.

### Seated DB Lateral Raise advice

Additional cues if missing:

- Keep the torso quiet; the seated position should remove body English.
- Raise through the upper arm rather than shrugging.
- Use a load that allows the delt to control the eccentric.
- Do not force the dumbbells far above shoulder height if the upper traps dominate.

---

## Pair 4 — Single-Leg Cable Calf Raise / Cable Lateral Raise

**Rep targets**

- Single-Leg Cable Calf Raise: **10–15 / side**
- Cable Lateral Raise: **15–20 / side**
- Rest after pair: **45–60 sec**

**Station logic:** same low pulley + same area.

### Pair setup tip

> Keep the pulley low. Work efficiently by completing the movements on one side before changing sides if the station layout allows it.

Possible sequence:

1. Left calf
2. Left lateral raise
3. Right calf
4. Right lateral raise

### Single-Leg Cable Calf Raise advice

Additional cues if missing:

- Use the free hand for balance if needed.
- Keep cable tension continuous but do not let it pull the torso out of position.
- Use a full controlled ankle range.
- Avoid bouncing through the stretched position.

### Cable Lateral Raise advice

Additional cues if missing:

- Start with the cable slightly behind/across the body if comfortable.
- Keep the shoulder down and lead with the upper arm.
- Maintain cable tension through the bottom rather than resting between reps.
- Use a smooth eccentric.

---

## Pair 5 — Seated DB Calf Raise / Arnold Press

**Rep targets**

- Seated DB Calf Raise: **15–25**
- Arnold Press: **8–10**
- Rest after pair: **60 sec**

**Station logic:** same bench + dumbbell area.

### Pair setup tip

> Keep both dumbbell loads beside the bench before starting. Calf raises stay seated; then use the same bench for Arnold presses.

### Seated DB Calf Raise advice

Use existing advice from Pair 3 if already centralized. Do not duplicate it.

Additional pairing-specific cue if useful:

- Finish the calf set, place the heavy dumbbell safely on the floor, and only then pick up the pressing pair.

### Arnold Press advice

Additional cues if missing:

- Rotate smoothly through the press instead of forcing an exaggerated twist.
- Keep the forearms controlled and avoid crashing the dumbbells together overhead.
- Maintain torso position against the bench.
- Stop at the last clean rep if shoulder position or spinal position deteriorates.

---

# 10. PORTAL IV — Quads / Triceps

## Pair 1 — Leg Extension / French Press

**Rep targets**

- Leg Extension: **12–15**
- French Press: **8–10**
- Rest after pair: **60 sec**

**Station logic:** keep the triceps implement beside the leg-extension machine. A seated DB French Press performed at/next to the machine is preferable if it preserves station efficiency.

### Pair setup tip

**User-provided pairing to preserve.**

Additional setup cue:

> Set up the triceps weight before the first leg-extension set. Do not walk away searching for equipment between exercises.

### Leg Extension advice

Additional cues if missing:

- Align the machine's knee joint/pivot as closely as practical with your knee.
- Keep hips/back against the pad.
- Extend under control and lower through the available comfortable range.
- Avoid violently kicking the stack or letting the plates crash between reps.

### French Press advice

Additional cues if missing:

- Keep the upper arms relatively stable while the elbows flex.
- Lower under control into a comfortable long-head triceps stretch.
- Do not flare the elbows aggressively if that causes discomfort.
- Choose an implement that can be safely positioned quickly beside the leg-extension station.

---

## Pair 2 — Barbell Squat / Lying DB Skullcrusher — ARNOLD'S CHOICE

**Rep targets**

- Barbell Squat: **5–8**
- Lying DB Skullcrusher: **15–20**
- Rest after pair: **75 sec**

**Station logic:** skullcrushers performed on the squat-rack bench or a bench immediately inside the same rack area.

**Tag:** `ARNOLD'S CHOICE`

### Pair setup tip

**User-provided cue that must be preserved:**

> 15–20 reps on the skullcrushers.

Additional setup cue:

> Put the skullcrusher dumbbells beside the rack before beginning. Do not leave the rack between exercises.

### Barbell Squat advice

Additional cues if missing:

- Set the rack height and safeties before the superset starts.
- Brace before descending and keep the bar balanced over the mid-foot.
- Maintain the chosen depth standard from rep to rep.
- Failure target = **technical failure / last clean rep**. Do not intentionally miss a squat to satisfy the animation prompt.

### Lying DB Skullcrusher advice

Additional cues if missing:

- Keep the upper arms slightly back if that gives a better triceps stretch.
- Lower the dumbbells under control beside/behind the head rather than dropping them toward the face.
- Allow natural elbow movement but avoid turning the set into a dumbbell press.
- The prescribed 15–20 reps are deliberate; do not choose a load suited only to 8–10 reps.

---

## Pair 3 — Heel-Elevated Goblet Squat / DB Overhead Triceps Extension

**Rep targets**

- Heel-Elevated Goblet Squat: **8–12**
- DB Overhead Triceps Extension: **15–20**
- Rest after pair: **60 sec**

**Station logic:** same dumbbell/bench area; one dumbbell may potentially serve both movements depending on strength.

### Pair setup tip

> Keep the heel wedge/plates and dumbbell in one area. Avoid rebuilding the station between exercises.

### Heel-Elevated Goblet Squat advice

Additional cues if missing:

- Use the heel elevation to allow a more upright, knee-forward squat.
- Keep the whole forefoot planted rather than rolling onto the toes.
- Let the knees travel naturally in line with the toes.
- Stop when torso or knee position breaks down rather than turning the set into a good morning.

### DB Overhead Triceps Extension advice

Additional cues if missing:

- Keep the ribs controlled and avoid excessive lumbar extension.
- Lower the dumbbell behind the head under control.
- Keep the upper arms reasonably stable without forcing an uncomfortable elbow position.
- Use a secure two-hand grip on the dumbbell.

---

## Pair 4 — Bulgarian Split Squat / Close-Grip Push-Up

**Rep targets**

- Bulgarian Split Squat: **8–10 / leg**
- Close-Grip Push-Up: **15–25**
- Rest after pair: **60–75 sec**

**Station logic:** same bench.

### Pair setup tip

> Use the same bench for both exercises. Complete both legs, then turn around and use the bench/floor immediately for close-grip push-ups.

### Bulgarian Split Squat advice

Additional cues if missing:

- Choose a stance length that allows stable front-foot pressure.
- Keep most of the work on the front leg; the rear foot is support.
- Descend under control and avoid bouncing off the bottom.
- Because this is unilateral and time-consuming, keep setup simple and do not overcomplicate loading.

### Close-Grip Push-Up advice

Additional cues if missing:

- Keep hands close enough to bias triceps without forcing an uncomfortable extreme hand position.
- Maintain a rigid trunk.
- Keep elbows tracking comfortably instead of flaring excessively.
- Elevate the hands on the bench if needed to stay inside the intended rep range; elevate the feet or add load only if 25 clean reps are easy.

---

## Pair 5 — Cable Cyclist Squat / Rope Pressdown

**Rep targets**

- Cable Cyclist Squat: **8–12**
- Rope Pressdown: **15–20**
- Rest after pair: **60 sec**

**Station logic:** same cable stack + same rope; move pulley from low to high.

### Pair setup tip

> Keep the rope attached. Squat from the low pulley, move the pulley high, change the pin, and go straight into pressdowns.

### Cable Cyclist Squat advice

Additional cues if missing:

- Use heel elevation and an upright torso to keep the movement quad-dominant.
- Keep constant cable tension without allowing it to pull you forward.
- Let the knees travel forward naturally.
- Choose a position far enough from the stack to preserve tension but close enough to remain stable.

### Rope Pressdown advice

Additional cues if missing:

- Keep the upper arms close to the torso.
- Extend the elbows fully under control and separate the rope naturally at the bottom.
- Do not use torso rocking to move the stack.
- Let the elbows flex enough at the top to achieve a useful triceps stretch without losing shoulder position.

---

# 11. PORTAL V — Biceps / Hamstrings / Lower Back

## Pair 1 — Standing Straight-Bar Barbell Curl / Barbell Romanian Deadlift — ARNOLD'S CHOICE

**Rep targets**

- Standing Straight-Bar Barbell Curl: **15–20**
- Barbell Romanian Deadlift: **6–8**
- Rest after pair: **75 sec**

**Tag:** `ARNOLD'S CHOICE`

### Pair setup tip

**User-provided cue that must be preserved:**

> Get a ready-to-use assembled bar with your biceps-curl weight. Do not overestimate the curl weight because you will be doing 20 reps. Use straps for RDLs and go heavy.

### Implementation/logistics warning

Curl and RDL loads may differ drastically.

The coding/app design does not need to solve gym logistics automatically, but the tip should not imply that every user can use the same loaded bar for both exercises.

Preferred real-world options:

1. use a ready-made fixed curl bar and a nearby RDL bar;
2. use a rack/platform where both bars can be kept safely in the same immediate area;
3. if the gym setup makes this pairing slow, the user should choose another portal option.

### Standing Straight-Bar Barbell Curl advice

Additional cues if missing:

- Keep the upper arms relatively still and avoid turning the set into repeated hip swings.
- Use a full comfortable elbow range.
- Control the eccentric instead of dropping the bar from the top.
- The 15–20 target is intentional; select the curl weight accordingly.

### Barbell Romanian Deadlift advice

Additional cues if missing:

- **Use straps** as specified when grip would otherwise limit the posterior chain.
- Push the hips backward while keeping the bar close to the legs.
- Maintain a stable braced spine.
- Descend only as far as hamstring mobility allows without losing position.
- Failure = **last clean rep**, never a rounded-back grinder.

---

## Pair 2 — 30° Incline Lying DB Biceps Curl / DB Romanian Deadlift

**Rep targets**

- 30° Incline Lying DB Biceps Curl: **12–15**
- DB Romanian Deadlift: **6–10**
- Rest after pair: **75 sec**

**Station logic:** same bench + dumbbell area.

### Pair setup tip

**User-provided cue that must be preserved:**

> Go very slow on the deadlift if you are strong enough to lift 50 kg in each hand.

Recommended wording for the actual workout tip:

> If you are strong enough to RDL 50 kg in each hand, slow the eccentric and keep every rep controlled rather than rushing the heavy dumbbells.

### 30° Incline Lying DB Biceps Curl advice

Additional cues if missing:

- Keep the shoulders behind the torso and allow the biceps to work from a lengthened position.
- Do not swing the upper arm forward to finish the rep.
- Supinate comfortably and squeeze without losing shoulder position.
- Lower the dumbbells under control.

### DB Romanian Deadlift advice

Additional cues if missing:

- Keep the dumbbells close to the thighs/shins.
- Push the hips backward rather than turning the movement into a squat.
- Use straps when grip limits the hinge.
- Heavy dumbbells demand a controlled eccentric.
- Failure = **technical failure / last clean rep**.

---

## Pair 3 — Rope Hammer Curl / Cable Pull-Through

**Rep targets**

- Rope Hammer Curl: **15–20**
- Cable Pull-Through: **8–12**
- Rest after pair: **60 sec**

**Station logic:** same low pulley + same rope.

### Pair setup tip

> Same rope, same low pulley. Hammer curl facing the stack, change the weight pin, turn around, and perform pull-throughs.

### Rope Hammer Curl advice

Additional cues if missing:

- Keep the elbows near the torso.
- Curl without leaning backward to move the stack.
- Keep the neutral/hammer grip throughout the useful range.
- Control the return instead of letting the cable pull the arms down.

### Cable Pull-Through advice

Reuse the existing Cable Pull-Through advice from Portal II if centralized.

Pair-specific cue if useful:

- Walk out only far enough to maintain cable tension; excessive distance wastes setup time and can make the movement unstable.

---

## Pair 4 — Straight-Bar Cable Curl / Cable Romanian Deadlift

**Rep targets**

- Straight-Bar Cable Curl: **12–15**
- Cable Romanian Deadlift: **6–10**
- Rest after pair: **60–75 sec**

**Station logic:** same straight-bar attachment + same low pulley.

### Pair setup tip

> Do not change the attachment. Curl, change the stack weight, then hinge.

### Straight-Bar Cable Curl advice

Additional cues if missing:

- Keep the elbows relatively fixed.
- Avoid leaning backward as the stack gets heavy.
- Use the cable's continuous tension and control the eccentric.
- Stop the set when shoulder flexion/body swing becomes the main way the bar moves.

### Cable Romanian Deadlift advice

Additional cues if missing:

- Stand far enough from the stack to maintain tension through the bottom position.
- Keep the bar close to the body.
- Hinge through the hips with a braced trunk.
- Squeeze the glutes to stand tall without leaning backward.
- Failure = last clean hinge rep.

---

## Pair 5 — DB Hammer Curl / DB Single-Leg Romanian Deadlift

**Rep targets**

- DB Hammer Curl: **12–15**
- DB Single-Leg Romanian Deadlift: **8–10 / leg**
- Rest after pair: **60–75 sec**

**Station logic:** dumbbell area only; no machine required.

### Pair setup tip

> Keep the required dumbbells together before starting. This is the no-machine/busy-gym option for the portal.

### DB Hammer Curl advice

Additional cues if missing:

- Keep the wrists neutral.
- Avoid shoulder swing and torso lean.
- Let the elbows fully open at the bottom without relaxing the shoulder excessively.
- Control the lowering phase.

### DB Single-Leg Romanian Deadlift advice

Additional cues if missing:

- Keep the hips mostly square to the floor.
- Reach the free leg back while the torso and leg move as one unit.
- Use a small amount of support from a rack/bench if balance prevents the hamstrings/glutes from being the limiter.
- Do not chase depth after pelvic/spinal position is lost.
- Because the exercise is unilateral, setup should remain simple to protect the 30-minute goal.

---

# 12. Complete launch pool summary

## Chest / Upper Back

| Pair | Exercise A | Reps | Exercise B | Reps | Rest |
|---|---|---:|---|---:|---:|
| 1 | Flat DB Bench Press | 6–8 | Bench-Supported Single-Arm DB Row | 10–12/side | 60–75s |
| 2 | Incline Barbell Bench Press | 6–8 | Barbell Row | 10–12 | 75s |
| 3 | 30° Incline Smith Bench Press | 6–8 | DB Seal Row | 12–15 | 60–75s |
| 4 | Pec Deck | 8–12 | Single-Arm Rear-Delt Machine Fly | 15–20/side | 45–60s |
| 5 | Dual-Cable Chest Press | 8–10 | Dual-Cable High Row | 12–15 | 60s |

## Abs / Glutes

| Pair | Exercise A | Reps | Exercise B | Reps | Rest |
|---|---|---:|---|---:|---:|
| 1 | Hanging Leg Raise | 10–15 | Bench Hip Thrust | 6–10 | 60–75s |
| 2 | Machine Hip Thrust | 6–10 | Plank | 30–45s; set 2 failure | 30–60s |
| 3 | Cable Crunch | 12–15 | Cable Pull-Through | 8–12 | 60s |
| 4 | Bench Reverse Crunch | 12–20 | DB Hip Thrust | 8–12 | 45–60s |
| 5 | Ab Wheel | 8–12 | Frog Pump | 25–40 | 45–60s |

## Calves / Shoulders

| Pair | Exercise A | Reps | Exercise B | Reps | Rest |
|---|---|---:|---|---:|---:|
| 1 | Standing DB/KB Calf Raise | 15–20 | Standing Military Press | 6–8 | 75s |
| 2 | Hack Squat Calf Raise | 10–15 | Side-Leaning Single-Arm DB Lateral Raise | 12–20/side | 60s |
| 3 | Seated DB Calf Raise | 15–25 | Seated DB Lateral Raise | 12–20 | 45–60s |
| 4 | Single-Leg Cable Calf Raise | 10–15/side | Cable Lateral Raise | 15–20/side | 45–60s |
| 5 | Seated DB Calf Raise | 15–25 | Arnold Press | 8–10 | 60s |

## Quads / Triceps

| Pair | Exercise A | Reps | Exercise B | Reps | Rest |
|---|---|---:|---|---:|---:|
| 1 | Leg Extension | 12–15 | French Press | 8–10 | 60s |
| 2 | Barbell Squat | 5–8 | Lying DB Skullcrusher | 15–20 | 75s |
| 3 | Heel-Elevated Goblet Squat | 8–12 | DB Overhead Triceps Extension | 15–20 | 60s |
| 4 | Bulgarian Split Squat | 8–10/leg | Close-Grip Push-Up | 15–25 | 60–75s |
| 5 | Cable Cyclist Squat | 8–12 | Rope Pressdown | 15–20 | 60s |

## Biceps / Hamstrings / Lower Back

| Pair | Exercise A | Reps | Exercise B | Reps | Rest |
|---|---|---:|---|---:|---:|
| 1 | Standing Straight-Bar Barbell Curl | 15–20 | Barbell Romanian Deadlift | 6–8 | 75s |
| 2 | 30° Incline Lying DB Biceps Curl | 12–15 | DB Romanian Deadlift | 6–10 | 75s |
| 3 | Rope Hammer Curl | 15–20 | Cable Pull-Through | 8–12 | 60s |
| 4 | Straight-Bar Cable Curl | 12–15 | Cable Romanian Deadlift | 6–10 | 60–75s |
| 5 | DB Hammer Curl | 12–15 | DB Single-Leg Romanian Deadlift | 8–10/leg | 60–75s |

---

# 13. Arnold's Choice

These three pairings should have a special selection-card label:

> **ARNOLD'S CHOICE**

1. Incline Barbell Bench Press / Barbell Row
2. Barbell Squat / Lying DB Skullcrusher
3. Standing Straight-Bar Barbell Curl / Barbell Romanian Deadlift

Completing all three at least once can unlock an `ARNOLD'S CHOICE` badge/achievement.

---

# 14. Workout selection UI

Opening the workout should show the themed exercise-selection experience before the normal live workout screen.

## Hero

Plan title:

> **30 MINUTE ADVENTURE**

Hero concept:

- muscular Arnold-inspired action hero emerging through a glowing sci-fi portal;
- colorful irreverent adult-cartoon/sci-fi aesthetic;
- green portal as the dominant signal/accent;
- graphite/dark Hyperplanner chassis underneath.

Hero bubble:

> **COME WITH ME IF YOU WANT TO LIFT**

## Selection heading

> **CHOOSE YOUR 5 PORTALS**

Display five sections:

1. `PORTAL I — CHEST / UPPER BACK`
2. `PORTAL II — ABS / GLUTES`
3. `PORTAL III — CALVES / SHOULDERS`
4. `PORTAL IV — QUADS / TRICEPS`
5. `PORTAL V — BICEPS / HAMSTRINGS / LOWER BACK`

The user must select exactly one pair in each portal.

Each pair card should show:

- exercise A;
- exercise B;
- both rep targets;
- short station-efficiency tag when useful;
- `ARNOLD'S CHOICE` tag where applicable.

Possible station tags:

- `SAME BENCH`
- `SAME CABLE`
- `SAME MACHINE`
- `SAME RACK`
- `DUMBBELLS ONLY`
- `ZERO SETUP`

## Buttons

Primary:

> **ENTER THE PORTAL**

Disabled until all five pairings are selected.

Secondary:

> **RANDOM ADVENTURE**

`RANDOM ADVENTURE` selects one random valid pairing from every category.

The user must be able to review/change random selections before entering the workout.

---

# 15. Workout UI behavior

Once the workout begins, render each pair as a visually unified superset block rather than two unrelated exercise cards.

Recommended layout:

```text
PORTAL I
CHEST / UPPER BACK

A  FLAT DB BENCH PRESS
   6–8 REPS

B  BENCH-SUPPORTED SINGLE-ARM DB ROW
   10–12 / SIDE

ROUND 1 OF 2
```

The app should always make the next action obvious.

### Set completion flow

For round 1:

1. complete A1;
2. save A1;
3. eligible exercise → ask `Did that feel easy?`;
4. move immediately to B1;
5. save B1;
6. eligible exercise → ask `Did that feel easy?`;
7. start pair-rest timer;
8. round 2.

### Timer

- Timer begins after the second exercise of the round.
- User can interact with everything while timer runs.
- Timer may be dismissed/skipped.
- Do not block set logging.

---

# 16. Easy-set portal animation

When `YES` is selected:

1. glowing green portal opens;
2. Arnold-inspired character appears from portal;
3. speech bubble slams/pops in;
4. bubble text:

> **GO TO FAILURE ON THIS SET**

5. Set 2 target changes to `FAILURE`.

The animation should be energetic but fast and non-blocking.

### Repeated animation variants

To avoid the same animation becoming annoying over ten possible prompts, cycle/randomize simple variants:

- pointing;
- flexing;
- thumbs up;
- sunglasses/action-hero pose;
- barbarian-style pose.

Do not require unique functionality for each; animation/image variation is sufficient.

### Reduced-motion behavior

Respect the app's reduced-motion behavior.

When reduced motion is enabled:

- no large portal travel animation;
- use a static/fade appearance;
- retain the message and state change.

---

# 17. Theme / visual direction

Maintain Hyperplanner's existing dark graphite base UI.

For this plan use:

### Primary signal

- radioactive / portal green

### Illustration accent colors

- bright green
- cyan
- purple
- magenta
- occasional orange/yellow action-comic accents

### Important distinction

The **selection screen** can be extremely colorful.

The **live workout logging screen** should remain clearer and more restrained:

- graphite/black base;
- white primary text;
- portal-green active state;
- additional colors mainly for illustration/badges/status.

Do not let decorative color compete with:

- weight;
- reps;
- set number;
- save button;
- next exercise;
- timer.

---

# 18. Badge concepts

Potential Adventure-specific badges:

| Badge | Requirement | Visual concept |
|---|---|---|
| COME WITH ME | Complete first 30 Minute Adventure | action hero + portal |
| T-800 | Complete an Adventure in ≤30:00 | Terminator-inspired |
| I'LL BE BACK | Complete a second Adventure | returning action hero |
| THE BARBARIAN | Complete 10 Adventures | Conan/barbarian-inspired |
| CRUSH YOUR ENEMIES | Complete 25 Adventures | barbarian throne/action motif |
| NO FATE | Complete 50 Adventures | endoskeleton/sci-fi machine motif |
| ARNOLD'S CHOICE | Complete all 3 Arnold's Choice pairings | classic bodybuilding/action motif |
| PORTAL ADDICT | Complete every launch pairing at least once | multiple portals |

Follow the existing badge architecture and image conventions in the repo instead of creating a separate achievement subsystem.

### Rights / production note

If this is distributed publicly/commercially, literal Arnold Schwarzenegger likenesses and direct Terminator/Conan movie assets may require rights/licensing.

Keep the code/assets separable so production art can be swapped for an original 1980s action-bodybuilder/barbarian character without rewriting the plan logic.

---

# 19. Data persistence requirements

The user's five selected pairing IDs must be included in the workout draft state.

If the browser is refreshed or accidentally closed:

- restore the same selected five pairings;
- restore entered sets/reps/weights;
- restore relevant `Did that feel easy?` decisions if they already occurred;
- restore which set-2 targets were switched to failure.

Do **not** force the user back through pair selection if a valid draft already exists for the workout.

When the workout is fully completed:

- save the chosen pairing/exercise information with the session;
- clear the draft using the existing workout-draft lifecycle.

Historical logs should retain the actual exercises selected, not merely the five portal category names.

---

# 20. Exercise history / weight suggestions

When an exercise reappears in a future Adventure:

- show the user's last relevant performance for that exercise using the app's existing history patterns;
- do not treat the paired exercise as part of the exercise identity;
- changing partners should not erase exercise history.

Example:

If the user previously did `Cable Pull-Through` with `Cable Crunch` and later gets/chooses `Cable Pull-Through` with `Rope Hammer Curl`, the previous Cable Pull-Through load/reps are still relevant.

### Optional V1 progression recommendation

Do not add an entirely new complex progression engine unless needed.

A simple future recommendation can use existing Hyperplanner advice conventions:

- if both sets repeatedly reach the top of the prescribed range with clean technique, recommend the next practical load increase;
- if a `YES` easy-set response is recorded and the second set also strongly exceeds the range, that is additional evidence the next-session load should rise.

This is secondary to the workout-selection/superset feature and should not delay V1.

---

# 21. Suggested implementation shape

Do not solve this by hardcoding dozens of `programId === '30-minute-adventure'` checks unless the current architecture leaves no cleaner path.

Prefer extending the plan/config model so the selection concept is represented explicitly.

Conceptual example only:

```ts
type PairSelectionMode = {
  type: 'pair-select';
  rounds: 2;
  groups: ExercisePairGroup[];
};

type ExercisePairGroup = {
  id: string;
  name: string;
  pairs: ExercisePair[];
};

type ExercisePair = {
  id: string;
  exerciseA: Exercise;
  exerciseB: Exercise;
  tag?: 'arnolds-choice';
  stationTag?: string;
  restAfterPair?: string;
  pairingNote?: string;
};
```

Potential exercise-level field:

```ts
failureMode?: 'failure' | 'technical-failure';
```

Potential workout state:

```ts
selectedPairIds: Record<string, string>;
easySetResponses: Record<string, boolean>;
failureOverrides: Record<string, boolean>;
```

The final implementation should follow the current repo conventions after inspecting the actual current branch rather than copying these types literally.

---

# 22. Existing Hyperplanner architecture to respect

At the time this specification was prepared, the repository already used:

- plan-specific config/data;
- `Exercise.notes`;
- exercise `rest`;
- exercise `alternates`;
- intensity-technique metadata;
- `SetTarget` including `failure`;
- plan hooks including `getExerciseAdvice`;
- workout soft-save drafts;
- badges;
- English/Polish localization;
- reduced-motion design guidance.

The coding agent must inspect the current branch before implementation because the codebase may have changed.

Relevant files to inspect include at least:

```text
src/types.ts
src/pages/WorkoutView.tsx
src/data/plans.ts
src/data/badges.ts
src/contexts/UserContext.tsx
src/contexts/useTranslation.tsx
translations / translation dictionaries used by current branch
DESIGN.md
README.md
existing src/data/*.ts plan files
```

---

# 23. Localization strings

New UI strings should go through the existing EN/PL localization system rather than being hardcoded in JSX.

## English

```text
30 Minute Adventure
Come with me if you want to lift
Choose your 5 portals
Portal I
Portal II
Portal III
Portal IV
Portal V
Enter the portal
Random adventure
Arnold's Choice
Did that feel easy?
Yes
No
Go to failure on this set
Same bench
Same cable
Same machine
Same rack
Dumbbells only
Zero setup
Round 1 of 2
Round 2 of 2
Last clean rep — stop before technique breaks down
```

## Suggested Polish

```text
30-minutowa przygoda
Chodź ze mną, jeśli chcesz dźwigać
Wybierz 5 portali
Portal I
Portal II
Portal III
Portal IV
Portal V
Wejdź do portalu
Losowa przygoda
Wybór Arnolda
Czy to było łatwe?
Tak
Nie
W tej serii jedź do upadku
Ta sama ławka
Ten sam wyciąg
Ta sama maszyna
Ten sam rack
Tylko hantle
Zero ustawiania
Runda 1 z 2
Runda 2 z 2
Ostatnie czyste powtórzenie — zakończ serię, zanim technika się rozpadnie
```

The coding agent may adjust translations to match the tone/style already used in Hyperplanner.

---

# 24. Acceptance criteria

The implementation is not finished until all of the following are true.

## Plan selection

- [ ] `30 Minute Adventure` appears as a valid Hyperplanner plan.
- [ ] Workout starts with five portal categories.
- [ ] Exactly one exercise pair can be chosen per category.
- [ ] `Random Adventure` fills all five categories.
- [ ] Random selections can be changed before starting.
- [ ] `Enter the Portal` remains disabled until five valid choices exist.

## Exercise pool

- [ ] All 25 launch pairings are included.
- [ ] Rep ranges match this specification unless intentionally changed and documented.
- [ ] Arnold's Choice tag exists on exactly the three specified launch pairings.
- [ ] Pair-specific station/logistics tips are included.
- [ ] Existing exercise advice was searched before adding new exercise advice.
- [ ] No obvious duplicate tip text was added under aliases.

## Workout

- [ ] Five selected pairs create ten exercises.
- [ ] Every exercise has two working sets.
- [ ] Exercises display as paired/superset blocks.
- [ ] Pair rest starts after the second exercise of the round.
- [ ] Timer is non-blocking.
- [ ] Set inputs and selected pairs survive refresh through draft persistence.

## Easy-set mechanic

- [ ] Saving first set can trigger `Did that feel easy?`.
- [ ] Prompt is tracked independently per exercise.
- [ ] `YES` triggers the portal/character message.
- [ ] Message says `GO TO FAILURE ON THIS SET`.
- [ ] Set 2 visibly changes to failure.
- [ ] `NO` leaves the normal rep range.
- [ ] Exercises already prescribed failure on set 2 do not receive a redundant question.
- [ ] Higher-risk compounds communicate last-clean-rep/technical-failure behavior.

## Theme

- [ ] Portal green is the plan's main signal color.
- [ ] Selection screen is more colorful than the live logging screen.
- [ ] Live workout remains readable and action-first.
- [ ] Reduced-motion preference is respected.
- [ ] New interactive targets follow existing accessibility sizing rules.

## Localization

- [ ] New English strings use localization.
- [ ] New Polish strings use localization.
- [ ] No essential new Adventure text is hardcoded only in English.

## Badges

- [ ] Adventure badge IDs follow the existing type/registry architecture.
- [ ] `ARNOLD'S CHOICE` badge can detect completion of all three specified pairs if implemented.
- [ ] Badge assets follow current asset-path conventions.

---

# 25. V1 priorities

If implementation scope has to be split, prioritize in this order:

1. plan registration;
2. pair-selection data model;
3. all 25 exercise pairs;
4. five-portal selection UI;
5. paired/superset WorkoutView;
6. draft persistence of selected pairs;
7. `Did that feel easy?` logic;
8. failure override for set 2;
9. portal animation;
10. exercise tips/advice deduplication and final wording pass;
11. localization;
12. badges;
13. decorative animation variants.

The core plan must be functional before decorative assets are treated as complete.

---

# 26. One-sentence design rule

> **Every decision in 30 Minute Adventure should make the workout faster to start, faster to navigate, and realistically completable in about 30 minutes without turning the live workout screen into visual noise.**
