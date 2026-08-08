# 30 Minute Adventure — Workout Plan Specification

> App: **Buzka42/hyperplanner**
> Plan type: superset-based, 30-minute sessions with exercise-pair selection at workout start.
> Theme: bodybuilder-out-of-a-portal, Rick & Morty–inspired art style. Plan hero image: Arnold popping out of a portal with a chat bubble **"Come with me if you want to lift."**

---

## 1. Session Structure

1. User picks (or the app rotates) one of the **5 muscle pairings** ("dimensions").
2. User selects **2 exercise pairs** from that pairing's list.
3. Warm-up (~3 min) → **4 supersets per pair**, no rest inside a superset, **60–75 s rest** between supersets.
4. Timing math: ~2.5 min per superset × 8 supersets ≈ 20–22 min work + warm-up + setup = **~30 min**.

**Rep philosophy:** heavy compound at 6–10 reps, its superset partner at 12–20 reps. Never pair two exercises that require walking between machines — every pair is doable from one spot (bench, rack, single cable stack, or adjacent machines).

---

## 2. Interactive Mechanic — "Did that feel easy?"

- **Trigger:** after the user saves reps for **both exercises of superset 1** of an exercise pair (fires once per pair → max 2× per workout).
- **Prompt:** `Did that feel easy?` → **Yes / No**
- **Yes** → portal animation: Arnold pops out of the portal, chat bubble **"GO TO FAILURE ON THIS SET"**. The next superset is flagged as an AMRAP set (flame icon on the rep field); the app logs actual reps achieved.
- **No** → small thumbs-up acknowledgment, nothing else.
- **Progression loop:** if the user answered *Yes* and beat target reps by 3+, auto-suggest a weight increase next session.

---

## 3. Exercise Pairs

Legend:
- **(AC)** = Arnold's Choice
- Tips marked **[user]** are authored by the plan creator and must be kept verbatim.
- Tips marked **[suggested]** are additional advice — **the coding app must check whether existing advice for the same exercise is already present in the exercise database before adding these.**

---

### Dimension 1 — Chest / Upper Back

#### 1.1 Flat DB Bench Press (8–10) × Bench-Supported Single-Arm DB Row (10–12/arm)
- **[user]** One hand/knee on the bench + use straps on the Row.
- **[suggested — DB Bench Press]** Kick the dumbbells up with your knees one at a time to get into position safely.
- **[suggested — Single-Arm DB Row]** Pull toward your hip, not your armpit — let the elbow graze your side.

#### 1.2 Incline Barbell Bench Press (6–8) × Barbell Row (8–10) **(AC)**
- **[suggested — Incline Bench]** Set the incline to 30° — steeper shifts the load to shoulders.
- **[suggested — Barbell Row]** Same bar, same spot: bench inside or right next to the rack so the bar never travels.

#### 1.3 30° Incline Smith Machine Bench Press (8–10) × DB Seal Row (12–15)
- **[user]** Use same bench for both, just move it forward for Rows.
- **[suggested — Smith Incline Press]** Lower the bar to your upper chest, just below the collarbones.
- **[suggested — DB Seal Row]** Let the dumbbells hang dead at the bottom — no leg drive, pure back.

#### 1.4 Push-Ups, Selectable Difficulty (12–15) × Pull-Ups (6–10) *(new)*
- **Difficulty ladder (selectable in-app):** Knee Push-Ups → High-Incline Push-Ups (bar/bench) → Standard Push-Ups → Feet-Elevated Push-Ups.
- **[user]** Do them off handles (or hex dumbbells) for deeper range and happier wrists.
- **[suggested — Push-Ups]** When you hit the top of the rep range at your current level, move up one difficulty step.
- **[suggested — Pull-Ups]** Too hard for 6 reps? Bands or slow negatives. Too easy? Add a dumbbell between your feet.
- Setup: do push-ups directly under the pull-up bar — zero transition time.

#### 1.5 Cable Crossover Fly (12–15) × Kneeling Single-Arm Cable Row (10–12/arm) *(new)*
- Same dual stack — just move the pulley high → low.
- **[suggested]** One D-handle does both exercises, no attachment swapping.
- **[suggested — Cable Fly]** Slight forward lean, hug a barrel — squeeze at the midline for a full second.

#### 1.6 Pec Deck (10–12) × Reverse Pec Deck (15–20) *(new)*
- Gym has **2+2 machines next to each other** — use two adjacent machines, or flip one machine between modes if occupied.
- **[suggested — Pec Deck]** Elbows slightly below shoulder height; don't let the pads slam back.
- **[suggested — Reverse Pec Deck]** Drop the weight ~60% vs. the fly — lead with your pinkies and don't cheat the reps.

---

### Dimension 2 — Abs / Glutes

#### 2.1 Hanging Leg Raises (10–15) × Hip Thrusts (10–12)
- **[user]** Hip Thrusts off a Bench preferably somewhere close to a pullup bar.
- **[suggested — Hanging Leg Raises]** Curl the pelvis up at the top — knees to chest is the regression, straight legs the progression.
- **[suggested — Hip Thrusts]** Chin tucked, ribs down, full squeeze at lockout for one second.

#### 2.2 Machine Hip Thrust (8–10) × Planks (max hold)
- **[user]** Do planks while resting between Hip Thrusts, then catch a breath and do hip thrusts, on second set of planks go to failure.
- **[suggested — Machine Hip Thrust]** Drive through your heels; toes can even come off the platform.
- **[suggested — Plank]** Squeeze glutes and brace like you're about to be punched — a sagging plank counts for nothing.

#### 2.3 Cable Crunch (12–15) × Cable Pull-Through (12–15) *(new)*
- Same stack, one rope attachment, pulley high ↔ low.
- **[suggested]** Kneel facing the stack for crunches, turn around and step out for pull-throughs.
- **[suggested — Cable Crunch]** Flex the spine — pull ribs to hips, don't just bow at the waist.
- **[suggested — Pull-Through]** Hinge, don't squat: push your hips back until you feel the hamstrings load, then snap them through.

#### 2.4 B-Stance Hip Thrust off Bench (10–12/side) × Weighted Crunch (15–20) *(new)*
- **[suggested]** One dumbbell does both — on your hips for thrusts, hugged to your chest for crunches.
- **[suggested — B-Stance Hip Thrust]** 80/20 weight split: working leg flat, assist leg on the heel.

---

### Dimension 3 — Calves / Shoulders

#### 3.1 Standing DB/KB Calf Raises, Single or Double Leg (15–20) × Standing Military Press (6–8)
- **[user]** Do the calf raises off a step close to the rack where you press, support yourself with one hand on the rack, DB/Kettlebell in the other.
- **[suggested — Calf Raises]** Pause one full second at the bottom stretch — no bouncing.
- **[suggested — Military Press]** Squeeze glutes and brace abs so the lower back doesn't arch.

#### 3.2 Hack Squat Calf Raises (12–15) × Side-Leaning Single-Arm DB Side Delt Raises (12–15/arm)
- **[user]** Lean against the Smith Machine and just cycle the two exercises since you are doing one arm at a time.
- **[suggested — Hack Squat Calf Raises]** Machine starts at 40 kg — if that's too heavy for strict reps, do the bodyweight step variant instead.
- **[suggested — Leaning Lateral Raise]** The lean gives tension at the bottom — control the negative, no swinging.

#### 3.3 Seated DB Shoulder Press (8–10) × Standing Calf Raise off a Step (15–20) *(new)*
- Same dumbbells, same square meter — use a step next to the bench.
- **[suggested — Seated DB Press]** Bench at ~80–85°, not fully vertical — easier on the shoulders.
- **[suggested — Calf Raise off Step]** Full stretch at the bottom, hold the top for a beat; hold one DB for load, other hand on the bench for balance.

#### 3.4 Smith Machine OHP (8–10) × Smith Machine Calf Raises (12–15) *(new)*
- **[suggested]** Same loaded bar for both — press it, then rest it across your shoulders for calf raises.
- **[suggested — Smith OHP]** Set the bar to start just below chin height; press slightly back so it finishes over mid-foot.

#### 3.5 Cable Lateral Raise (12–15/arm) × Single-Leg Calf Raise at the Tower (15–20/leg) *(new)*
- **[user]** The cable tower is your balance support — cycle arms and legs like the hack squat pairing. Can use the same cable to add weight if done off a bench.
- **[suggested — Cable Lateral Raise]** Set the pulley at hip height, cable behind your back — constant tension through the whole arc.

---

### Dimension 4 — Quads / Triceps

#### 4.1 Leg Extensions (12–15) × French Press (10–12)
- **[suggested — Leg Extensions]** Pause a full second at lockout and squeeze — this machine is very good, use its range.
- **[suggested — French Press]** Keep elbows tucked in and stationary; only the forearms move.

#### 4.2 Barbell Squat (6–8) × Lying DB Skullcrushers (15–20) **(AC)**
- **[user]** 15–20 reps on the skullcrushers.
- **[suggested — Squat]** Park the dumbbells and a bench next to the rack before your first set.
- **[suggested — DB Skullcrushers]** Lower the DBs beside your ears, not to your forehead — deeper stretch, safer.

#### 4.3 Goblet Squat (12–15) × Single-DB Overhead Triceps Extension (12–15) *(new)*
- **[suggested]** One dumbbell, zero setup — squat it, then press it overhead. Great for a crowded gym.
- **[suggested — Goblet Squat]** Elbows track inside the knees at the bottom; heels stay glued down.

#### 4.4 DB Walking Lunges (10/leg) × Diamond Push-Ups (to failure) *(new)*
- **[suggested]** Lunge down the aisle, drop and push where you land.
- **[suggested — Walking Lunges]** Long steps = more glute, short steps = more quad. Take short steps in this dimension.

---

### Dimension 5 — Biceps / Hamstrings / Lower Back

#### 5.1 Standing Straight Barbell Bicep Curl (20) × Barbell Romanian Deadlift (8–10) **(AC)**
- **[user]** Get a ready to use assembled bar with your bicep curl weight — do not overestimate weight as you will be doing 20 reps. Use straps for RDLs and go heavy.
- **[suggested — Barbell Curl]** Elbows pinned to your sides; the last 5 reps should burn, not swing.
- **[suggested — Barbell RDL]** Bar drags down your thighs; hinge until the hamstrings scream, don't chase the floor.

#### 5.2 30° Incline Lying DB Bicep Curl (10–12) × DB Romanian Deadlift (8–10)
- **[user]** Go very slow on the deadlift if you are strong enough to lift 50kg in each hand.
- **[suggested — Incline DB Curl]** Let the arms hang fully behind your torso — the stretch is the point, no half reps.

#### 5.3 45° Back Extension (12–15) × DB Hammer Curls (10–12) *(new)*
- **[suggested]** Park the dumbbells next to the hyper bench — hug one for extensions, curl both between sets.
- **[suggested — Back Extension]** Round through the glutes-focused version or stay rigid for pure erectors — pick one and be consistent.

#### 5.4 Low-Pulley Cable Curl (12–15) × Cable Pull-Through (12–15) *(new)*
- **[suggested]** Same stack, low pulley for both — straight bar for curls, clip on the rope for pull-throughs, 10-second transition.
- **[suggested — Cable Curl]** Step back a foot from the stack so there's tension even at the bottom of the rep.

> ⚠️ Note for the coding app: **Cable Pull-Through appears in both 2.3 and 5.4** — advice must be stored once against the exercise, not duplicated per pairing.

---

## 4. Theme & UI Spec

### Palette
- Portal green (#97CE4C-adjacent) + electric purple + acid yellow accents.
- Each dimension gets its own accent color; workout picker = **portal-select screen**.

### Animations
- Plan hero: Arnold emerging from a portal — chat bubble **"Come with me if you want to lift."**
- "Easy set" event: portal opens on-screen, Arnold pops out — bubble **"GO TO FAILURE ON THIS SET"**, next set flagged AMRAP with a flame icon.

### Badges
| Tier | Style | Trigger examples |
|---|---|---|
| Barbarian era | sword / fur / mountain | strength PRs |
| Cyborg / chrome | terminator-inspired | consistency streaks ("Back for more" — 10 workouts) |
| Golden era | classic bodybuilding poses | total volume milestones |

### IP note
Arnold's likeness, movie stills, and the Rick & Morty art style are protected IP/publicity rights. For public distribution, use original "inspired-by" art (generic bodybuilder-through-a-portal, generic barbarian/cyborg badges). The parody line "Come with me if you want to lift" is the lowest-risk element.

---

## 5. Rules for the Coding App

1. **Before adding any [suggested] tip, check the exercise database for existing advice on that exercise.** Skip or merge if advice already exists.
2. **[user] tips are authoritative** — keep verbatim, never overwrite.
3. Advice is stored **per exercise**, not per pairing (see Cable Pull-Through duplication note).
4. Tip bubbles are shown in the **training view**.
5. "Did that feel easy?" fires only after **superset 1 of each pair**, max twice per workout.
6. Rep targets are ranges; AMRAP sets log actual reps and feed the auto-progression suggestion.
