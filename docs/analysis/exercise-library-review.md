# Exercise library review

A full listing of every movement in the library, plus a review of what looks
duplicated and what looks missing.

Compiled 2026-08-21 against 250 library entries (243 active, 7 already
deprecated). Figures are derived from the library and the plan generators, not
hand-counted: the **Plans** column is how many of the 36 plans actually produce
that movement, measured by running every plan's generator across every preview
state and resolving the names it emits.

This is a review, not a change. Nothing here has been applied.

## How a merge works here

Worth stating before the recommendations, because it makes them much cheaper
than they look. The library already models merging as a first-class operation:

- `aliases` carries every legacy display string that must still resolve to an
  entry. History and progression join on exercise **name** in roughly ten
  places across the plan hooks, so an alias is never deleted.
- `status: 'deprecated'` plus `deprecatedFor` marks the losing id and points at
  the survivor. Seven entries already sit in that state.

So a merge is: fold the loser's name and aliases into the winner's `aliases`,
mark the loser deprecated, and point it at the winner. **Plans keep their
existing strings and keep working, and logged history keeps joining.** No plan
file has to change, and no athlete's history breaks.

That is why the merges below are graded on whether the two entries are the same
*movement*, not on how much work the merge is.

## Summary

| | |
| --- | --- |
| Entries | 250 (243 active, 7 deprecated) |
| Movement patterns | 25 |
| Used by at least one plan | 191 |
| Unused by any plan | 59 |
| Confident merges identified | 12 |
| Merges worth a judgement call | 6 |
| Additions proposed | 22 |

The 59 unused entries are not a defect. The library is deliberately wider than
the portfolio, because it is also the swap pool and the exercise browser. They
are flagged in the catalogue only so you can see which entries are carrying no
weight at all.

---

## 1. Proposed merges

### 1.1 Confident — same movement, different name

These twelve are the same exercise entered twice. Most have a clear shape: a
widely-used canonical entry, plus a straggler used by exactly one of the older
plans (Super Mutant, Pencilneck, Ritual of Strength) that was never folded in
when the library was built from the plan corpus.

Five of them are confirmed by an objective signal — **two entries carrying an
identical Polish name**, which means whoever wrote the translation already
judged them the same movement.

| Keep | Merge in | Evidence |
| --- | --- | --- |
| `seated-hamstring-curl` (17 plans) | `seated-ham-curl` (10), `seated-leg-curl` (1) | All three are `Uginanie nóg siedząc` in Polish. Three ids for one machine. |
| `cable-crunch` (17 plans) | `cable-crunches` (1, Super Mutant) | Identical Polish. Singular/plural of the same string. |
| `hammer-pulldown` (13 plans) | `hammer-underhand-pulldown` (1, Super Mutant) | Identical Polish. Both are the underhand Hammer pulldown. |
| `rear-delt-fly` (13 plans) | `reverse-pec-deck` (0 plans) | Identical Polish. Same machine, and the loser is unused. |
| `paused-squat` (2 plans) | `paused-back-squat` (1) | Identical Polish. A paused squat is a paused back squat. |
| `ab-wheel` (13 plans) | `ab-wheel-rollout` (1, Pencilneck) | "Ab Wheel" and "Ab Wheel Rollouts" are one movement. |
| `standing-calf-raise` (8 plans) | `calf` (1, Ritual), `calf-raise` (0) | Three generic machine calf-raise entries. `Calves` and `Calf Raises` name no distinct movement. |
| `barbell-row` (3 plans) | `row` (1, Ritual) | `row` is literally named "Rows" with barbell equipment. |
| `leaning-one-arm-lateral-raise` (8 plans) | `leaning-single-arm-dumbbell-lateral-raise` (1, Pencilneck) | Same movement, longer name. |
| `lying-leg-curl` (13 plans) | `ham-curl` (1, Ritual) | "Ham Curls" is the generic name for the lying machine curl. |
| `single-arm-overhead-triceps-extension` (2 plans) | `single-arm-overhead-extension` (1, Super Mutant) | Same movement, and `one-dumbbell-overhead-triceps-extension` (0 plans) is a third spelling of it. |
| `walking-lunge` (2 plans) | `dumbbell-walking-lunge` (1, Super Mutant) | `walking-lunge` already lists dumbbell equipment. |

Doing these twelve removes fifteen ids and costs nothing at the plan level.

### 1.2 Judgement calls — overlapping, but arguably distinct

I would not merge these without your ruling, because each encodes a distinction
somebody deliberately made.

| Entries | The distinction | My read |
| --- | --- | --- |
| `heavy-rolling-tricep-extension` (4) vs `rolling-dumbbell-tricep-extension` (5) | Only "heavy". Polish differs by the word *Ciężkie*. | **Merge.** Load is a prescription, not a movement. If a plan wants it heavy it should say so in sets and reps. |
| `cable-fly` "mid height" (2) vs `mid-cable-fly` "Seated" (2) | Standing versus seated. | **Keep, but rename.** Cathedral uses both, so as named they read as two mid-height cable flyes in one plan. Rename to make the seated/standing split explicit. |
| `face-pulls` (1) vs `rear-delt-rope-pulls-to-face` (3) vs `high-elbow-facepulls` (0) | Elbow height. | **Merge the first two; keep `high-elbow-facepulls`** only if the high-elbow cue is a real programming choice. Otherwise fold all three. |
| `hip-thrust` (5) vs `bench-hip-thrust` (0) | Bench-supported is the standard hip thrust. | **Merge**, unless `hip-thrust` is meant to be the machine and `bench-hip-thrust` the barbell-on-bench version — in which case rename both, because nothing currently says so. |
| `tricep-extension` "Cable Pressdown" (1) vs `cable-triceps-extension` "Cable Straight-Bar Pressdown" (6) | Attachment, implicitly. | **Merge.** A bare "Cable Pressdown" duplicates the straight-bar entry; the rope, EZ and triangle attachments already have their own ids. |
| `heels-off-narrow-leg-press` (1) vs `narrow-stance-leg-press` (1) | Heel position. | **Keep both**, but the names should say the foot position is the point. |

### 1.3 Not duplicates, despite looking like it

Flagging these so a future pass does not "fix" them:

- `pull-up` / `weighted-pull-up`, `chin-up` / `weighted-chin-up`, `dip` /
  `weighted-dip`. The loaded entries carry `weightMode: 'weighted-bodyweight'`,
  which drives the total-system-weight maths Gravity Is Optional and Workhorse
  depend on. Splitting them is deliberate. Note the inconsistency though:
  `bodyweight-dip` was already merged into `dip`, so the family is half-merged.
- `romanian-deadlift` / `stiff-legged-deadlift`. Genuinely different hip and
  knee mechanics, however often they are confused.
- `hanging-leg-raise` / `hanging-knee-raise`. A difficulty progression, and
  `core-raise` is a real swap group.
- `sissy-squat` / `supported-sissy-squat` / `reverse-nordic-curl`. Related but
  distinct knee-extension movements.

---

## 2. Proposed additions

Ranked by how much the gap actually costs, given what the portfolio already
programmes.

### 2.1 Gaps I would fill first

1. **Seated calf raise (machine).** The library has ten calf entries and *no*
   seated calf raise — the only common movement that loads the soleus with the
   knee bent. `seated-dumbbell-calf-raise` was deprecated into a standing
   variant, which removed the last bent-knee option. This is the clearest
   single hole in the library.
2. **Pallof press.** `core-antirotation` contains only a suitcase hold and a
   suitcase carry. The Pallof press is the canonical anti-rotation exercise and
   its absence is why that pattern looks empty.
3. **Tibialis raise.** `tibialis` is trained by exactly one entry — `Loaded
   Ankle Rock`, filed under pattern `other`, used only by Apex Predator as
   movement-quality work. There is no loading option for the muscle, so any
   plan wanting to train it has nothing to prescribe.
4. **Machine lateral raise.** Eight shoulder-abduction entries, all dumbbell or
   cable. The machine is the one most people can actually overload safely.
5. **Rotator cuff / external rotation work.** The whole `external-rotation`
   pattern is a single entry (`single-arm-external-rotation`). For a portfolio
   with a dedicated movement-quality plan (Apex Predator), that is thin. Suggest
   band external rotation and a prone Y-T-W.
6. **Hip abduction beyond the machine.** Two entries total, for a portfolio with
   three glute-focused plans (Peachy, Venus Rising, Athena). Suggest cable hip
   abduction, banded lateral walk, side-lying abduction.

### 2.2 Common movements that are simply absent

7. **Belt squat** — increasingly standard, and the obvious spine-sparing squat.
8. **Pendulum squat** — as above; `hack-squat` is the only fixed-path squat.
9. **Goblet squat (flat-footed)** — only the heel-elevated version exists.
10. **Reverse lunge** — only `deficit-reverse-lunge` exists, so the plain
    version has to be prescribed as a deficit.
11. **Lateral lunge / Cossack squat** — no frontal-plane lunge at all.
12. **Incline dumbbell fly** — `incline-press` has five entries and no fly.
13. **Decline press** — no decline anything.
14. **Floor press (barbell)** — only `single-arm-floor-press` exists.
15. **Concentration curl** and **spider curl** — thirteen curls, neither present.
16. **Wrist curl / reverse wrist curl** — `forearms` is a modelled muscle with
    no direct movement.
17. **Seated calf raise's opposite number: donkey calf raise** — optional.
18. **Side plank** — no frontal-plane anti-lateral-flexion hold.
19. **Chest-supported T-bar row** — nineteen horizontal pulls, no T-bar.
20. **Snatch-grip deadlift** — exists only as `deficit-snatch-grip-deadlift`.
21. **Push press** — no explosive overhead variant anywhere.
22. **Overhead carry / front-rack carry** — `carry` has three entries and
    Atlas is built on carries.

I would not add all of these. 1–6 close real holes; 7–14 are the ones I would
expect an owner to reach for and not find; 15–22 are completeness.

---

## 3. Structural observations

These are not additions or merges, but they affect how the library behaves.

**Swap groups are barely populated.** Nineteen groups exist and most have one or
two members:

- `squat-heavy` has 5, `vertical-pull` and `core-raise` have 3, everything else
  has 1 or 2.
- A group with one member offers the athlete **nothing** — `swap.policy:
  'group'` resolves to an empty option list. Nine of the nineteen groups are in
  that state: `hinge-heavy`, `horizontal-press`, `horizontal-pull-machine`,
  `lateral-raise`, `rear-delt`, `squat`, `triceps-extension`, `vertical-press`
  and `vertical-pull-heavy`.

Since the composer now exposes swap policy per movement, this is the setting
most likely to look configured and do nothing. Populating the groups is
probably higher value than any single exercise addition.

**Four entries look mis-patterned:**

- `shrug` sits in `horizontal-pull`. A shrug is scapular elevation; it shares no
  mechanics with a row.
- `around-the-worlds` sits in `incline-press`. It is a fly.
- `suitcase-carry` sits in `core-antirotation` while `farmer-carry` sits in
  `carry`. Both are loaded carries; they should agree.
- `dumbbell-pullover` sits in `vertical-pull`, which is defensible but worth a
  deliberate ruling since it drives swap suggestions.

**Two entries are techniques, not movements:** `rear-delt-burnout` and
`glute-pump-finisher`. Now that the composer has real finishing-technique
support with editable parameters, these would be better expressed as a
technique on a real movement than as library entries.

**One placeholder is shipping as an exercise:** `apex-access-placeholder`
("Apex Access Slot"). Intentional, presumably, but it is an active library entry
an athlete can encounter in the browser.

---

## 4. Full catalogue

Grouped by movement pattern. **Plans** is the number of the 36 plans that
actually produce the movement.

### horizontal-press  <sub>25 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Bodyweight Dips (legacy id) | `bodyweight-dip` | dip-station, bodyweight | — | **deprecated** → `dip`; bodyweight |
| Cable Crossover | `cable-crossover` | cable | 1 |  |
| Cable Flyes (mid height) | `cable-fly` | cable | 2 |  |
| Close-Grip Bench Press | `close-grip-bench-press` | barbell | 3 |  |
| Close-Grip Push-Up | `close-grip-push-up` | bodyweight | 1 | bodyweight |
| Deficit Pushups | `deficit-push-up` | bodyweight | 5 | bodyweight |
| Diamond Push-Up | `diamond-push-up` | bodyweight | — | bodyweight; _unused by any plan_ |
| Dip | `dip` | dip-station, bodyweight | 6 | bodyweight; group `dip-family` |
| Dual-Cable Chest Press | `dual-cable-chest-press` | cable | — | _unused by any plan_ |
| Flat Barbell Bench Press | `flat-barbell-bench-press` | barbell | 4 |  |
| Flat DB Press | `flat-dumbbell-press` | dumbbell | 7 |  |
| Hammer Chest Press | `hammer-chest-press` | hammer-strength | 12 |  |
| Larsen Press | `larsen-press` | barbell | — | _unused by any plan_ |
| Long Pause Bench Press | `long-pause-bench-press` | barbell | 1 |  |
| Low Pin Press | `low-pin-press` | barbell | — | _unused by any plan_ |
| Low-to-High Cable Flyes | `low-to-high-cable-fly` | cable | 3 |  |
| Machine Press/Fly Combo | `machine-press-fly-combo` | machine | 3 |  |
| Mid Cable Flyes (Seated) | `mid-cable-fly` | cable | 2 |  |
| Paused Bench Press | `paused-bench-press` | barbell | 9 |  |
| Pec Deck | `pec-deck` | pec-deck | 13 |  |
| Push-Up | `push-up` | bodyweight | 2 | bodyweight |
| Single-Arm Floor Press | `single-arm-floor-press` | dumbbell, kettlebell | 1 | unilateral; group `horizontal-press` |
| Spoto Press | `spoto-press` | barbell | 1 |  |
| TRX Push-Up | `trx-push-up` | trx, bodyweight | 1 | bodyweight |
| Weighted Dip | `weighted-dip` | dip-station, plate | 1 | weighted-bodyweight; group `dip-family` |
| Wide-Grip Bench Press | `wide-grip-bench-press` | barbell | 2 |  |

### incline-press  <sub>5 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| 30° Smith Incline Bench Press | `30-smith-incline-bench-press` | smith | 8 |  |
| Around-the-Worlds | `around-the-worlds` | cable | — | _unused by any plan_ |
| Feet-Elevated Push-Up | `feet-elevated-push-up` | bodyweight, bench | — | bodyweight; _unused by any plan_ |
| Incline Barbell Bench Press | `incline-barbell-bench-press` | barbell | 2 |  |
| Incline DB Bench Press | `incline-dumbbell-bench-press` | dumbbell | 21 |  |

### vertical-press  <sub>11 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Arnold Press | `arnold-press` | dumbbell | — | _unused by any plan_ |
| Behind-the-Neck Press | `behind-the-neck-press` | barbell | 1 |  |
| Kettlebell Shoulder Press | `kettlebell-shoulder-press` | kettlebell | — | unilateral; _unused by any plan_ |
| One-Arm Braced Dumbbell Press | `one-arm-braced-db-press` | dumbbell | 1 | unilateral |
| Seated DB Shoulder Press | `seated-dumbbell-shoulder-press` | dumbbell | 6 |  |
| Seated Hammer Shoulder Press | `seated-hammer-shoulder-press` | hammer-strength, machine | 7 |  |
| Shoulder Press | `shoulder-press` | barbell | 3 |  |
| Single-Arm Landmine Press | `single-arm-landmine-press` | barbell | 2 | unilateral |
| Single-Arm Standing Press | `single-arm-standing-press` | dumbbell, kettlebell | 2 | unilateral; group `vertical-press` |
| Smith Machine Overhead Press | `smith-overhead-press` | smith, machine | — | _unused by any plan_ |
| Standing Military Press | `standing-barbell-military-press` | barbell | 7 |  |

### horizontal-pull  <sub>19 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Barbell Row | `barbell-row` | barbell | 3 |  |
| Bench-Supported One-Arm Dumbbell Row | `bench-supported-one-arm-dumbbell-row` | dumbbell | 2 | unilateral |
| Chest-Supported Cable Row | `chest-supported-cable-row` | cable, bench | 1 |  |
| Dual-Cable High Row | `dual-cable-high-row` | cable | — | _unused by any plan_ |
| Dumbbell Seal Row | `dumbbell-seal-row` | dumbbell | 2 |  |
| Half-Kneeling Rotational Cable Row | `half-kneeling-rotational-row` | cable | 1 | unilateral |
| Hammer Lower Row | `hammer-lower-row` | hammer-strength | 4 | group `horizontal-pull-machine` |
| Inverted Rows | `inverted-row` | bodyweight, barbell | 2 | bodyweight |
| Kneeling One-Arm Cable Row | `kneeling-one-arm-cable-row` | cable | — | unilateral; _unused by any plan_ |
| Rope Cable Row | `rope-cable-row` | cable | 2 |  |
| Rows | `row` | barbell | 1 |  |
| Seated Cable Row | `seated-cable-row` | cable | 4 |  |
| Shrugs | `shrug` | barbell, dumbbell | 1 |  |
| Single Arm Cable Row | `single-arm-cable-row` | cable | 1 | unilateral |
| Single-Arm DB Row | `single-arm-dumbbell-row` | dumbbell, kettlebell | 4 | unilateral |
| Single-Arm Hammer Strength Row | `single-arm-hammer-row` | hammer-strength | 18 | unilateral |
| TRX Body Row | `trx-body-row` | trx, bodyweight | 1 | bodyweight |
| Wide Grip BB Row | `wide-grip-barbell-row` | barbell | 1 |  |
| Wide-Grip Cable Row | `wide-grip-cable-row` | cable | 1 |  |

### vertical-pull  <sub>14 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Assisted Pull-ups | `assisted-pull-up` | machine | 6 | bodyweight |
| Bench-Supported Single-Arm Cable Pulldown | `bench-supported-single-arm-cable-pulldown` | cable, bench | 4 | unilateral |
| Chin-Up | `chin-up` | pull-up-bar, bodyweight | 1 | bodyweight; group `vertical-pull` |
| Close Neutral Grip Lat Pulldown | `close-neutral-grip-lat-pulldown` | cable | 3 |  |
| Dumbbell Pullover | `dumbbell-pullover` | dumbbell, kettlebell | 1 | group `vertical-pull` |
| Hammer Pulldown (Underhand) | `hammer-pulldown` | hammer-strength, cable | 13 |  |
| Hammer Underhand Pulldown | `hammer-underhand-pulldown` | hammer-strength, cable | 1 |  |
| Hammer Upper Row | `hammer-upper-row` | hammer-strength | 5 | group `vertical-pull` |
| Lat Prayer | `lat-prayer` | cable | 8 |  |
| Lat Pulldown (Neutral) | `lat-pulldown` | cable | 7 |  |
| Overhand Mid-Grip Pulldown | `overhand-mid-grip-pulldown` | cable | 3 |  |
| Pull-Up | `pull-up` | pull-up-bar | 4 | bodyweight |
| Weighted Chin-Up | `weighted-chin-up` | pull-up-bar, plate | 5 | weighted-bodyweight; group `vertical-pull-heavy` |
| Weighted Pull-ups | `weighted-pull-up` | pull-up-bar | 2 | weighted-bodyweight |

### shoulder-abduction  <sub>8 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Behind-the-Back Cable Lateral Raise | `behind-the-back-cable-lateral-raise` | cable | 3 | unilateral |
| Cable Lateral Raise | `cable-lateral-raise` | cable | 14 |  |
| Lateral Raises | `lateral-raise` | dumbbell | 3 |  |
| Leaning One-Arm Lateral Raise | `leaning-one-arm-lateral-raise` | dumbbell | 8 | unilateral |
| Leaning Single Arm DB Lateral Raises | `leaning-single-arm-dumbbell-lateral-raise` | dumbbell | 1 | unilateral |
| Lying Cable Lat Raises | `lying-cable-lat-raise` | cable | 5 |  |
| Seated Dumbbell Lateral Raise | `seated-dumbbell-lateral-raise` | dumbbell | 2 |  |
| Single-Arm Lateral Raise | `single-arm-lateral-raise` | dumbbell, kettlebell | — | unilateral; group `lateral-raise`; _unused by any plan_ |

### shoulder-horizontal-abduction  <sub>12 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Band Pull-Aparts | `band-pull-aparts` | bands | 1 |  |
| Bench-Supported DB Rear Delt Fly | `bench-supported-dumbbell-rear-delt-fly` | dumbbell, bench | 6 |  |
| Face Pulls | `face-pulls` | cable | 1 |  |
| High-Elbow Facepulls | `high-elbow-facepulls` | cable | — | _unused by any plan_ |
| Machine Rear Delt Fly | `rear-delt-fly` | rear-delt-machine, machine | 13 |  |
| Rear Delt Burnout | `rear-delt-burnout` | cable | 1 |  |
| Rear-Delt Rope Pulls to Face | `rear-delt-rope-pulls-to-face` | cable | 3 |  |
| Rear-Delt Row | `bent-over-rear-delt-row` | dumbbell, kettlebell | 1 | group `rear-delt` |
| Reverse Pec Deck | `reverse-pec-deck` | pec-deck, rear-delt-machine | — | _unused by any plan_ |
| Side-Lying Rear Delt Flyes | `side-lying-rear-delt-fly` | rear-delt-machine | 7 |  |
| Single Arm Reverse Pec Deck | `single-arm-reverse-pec-deck` | pec-deck, rear-delt-machine | 4 | unilateral |
| Y-Raises | `y-raise` | cable | 2 |  |

### external-rotation  <sub>1 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Single-Arm External Rotation | `single-arm-external-rotation` | cable, dumbbell | 2 | unilateral |

### elbow-flexion  <sub>12 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| 30° Incline-Lying Dumbbell Curl | `30-incline-lying-dumbbell-curl` | dumbbell | 5 |  |
| Bayesian Cable Curl | `bayesian-cable-curl` | cable | 10 | unilateral |
| Cable EZ-Bar Curl | `cable-curl` | cable | 4 |  |
| Cable Low-Pulley Curl | `low-pulley-cable-curl` | cable | — | _unused by any plan_ |
| Cable Rope Hammer Curl | `rope-hammer-curl` | cable | 4 |  |
| Cable Straight-Bar Curl | `straight-bar-cable-curl` | cable, barbell | 1 |  |
| Dumbbell Hammer Curl (legacy id) | `dumbbell-hammer-curl` | dumbbell | 2 | **deprecated** → `hammer-curl` |
| EZ Preacher Curl | `ezbar-preacher-curl` | ez-bar | 10 |  |
| Hammer Curls | `hammer-curl` | dumbbell | 3 |  |
| Machine Curl | `machine-curl` | machine | 7 |  |
| Reverse Curl | `reverse-curl` | ez-bar, barbell | 3 |  |
| Standing Straight-Bar Curl | `standing-straight-bar-curl` | barbell | 5 |  |
| Straight-Bar Preacher Curl | `straight-bar-preacher-curl` | barbell | — | _unused by any plan_ |

### elbow-extension  <sub>18 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Banded EZ Bar Skullcrushers | `banded-ezbar-bar-skullcrushers` | ez-bar, barbell, bands | — | _unused by any plan_ |
| Cable EZ-Bar Pressdown | `cable-ezbar-pressdown` | cable, ez-bar | 4 |  |
| Cable Pressdown | `tricep-extension` | cable | 1 |  |
| Cable Rope Pressdown | `rope-pressdown` | cable | 8 |  |
| Cable Straight-Bar Pressdown | `cable-triceps-extension` | cable | 6 |  |
| Cable Triangle Pressdown | `triangle-pushdown` | cable | 7 |  |
| EZ Skullcrushers | `ezbar-skullcrushers` | ez-bar | 1 |  |
| French Press | `french-press` | ez-bar | 5 |  |
| Heavy Rolling Tricep Extensions | `heavy-rolling-tricep-extension` | dumbbell | 4 |  |
| JM Press | `jm-press` | barbell, ez-bar | 1 |  |
| Lying Dumbbell Skullcrusher | `lying-dumbbell-skullcrusher` | dumbbell | 2 |  |
| Machine Triceps Pushdown | `machine-tricep-pushdown` | machine | 2 |  |
| One-Dumbbell Overhead Triceps Extension | `one-dumbbell-overhead-triceps-extension` | dumbbell | — | _unused by any plan_ |
| Overhead Tricep Extensions | `overhead-tricep-extension` | dumbbell | 8 |  |
| Rolling DB Tricep Extensions | `rolling-dumbbell-tricep-extension` | dumbbell | 5 |  |
| Single Arm Overhead Extension | `single-arm-overhead-extension` | dumbbell | 1 | unilateral |
| Single-Arm Overhead Triceps Extension | `single-arm-overhead-triceps-extension` | dumbbell, kettlebell | 2 | unilateral; group `triceps-extension` |
| Smith Machine Skullcrusher | `smith-skullcrusher` | machine | 1 |  |

### squat  <sub>21 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Banded Squat | `banded-squat` | bands | — | _unused by any plan_ |
| Barbell Squat | `barbell-squat` | barbell | 4 |  |
| Cable Cyclist Squat | `cable-cyclist-squat` | cable | — | _unused by any plan_ |
| Front Squats | `front-squat` | barbell | 6 |  |
| Goblet Heel-Elevated Squat (legacy id) | `goblet-heel-elevated-squat` | dumbbell, kettlebell | 1 | **deprecated** → `heel-elevated-goblet-squat`; group `squat` |
| Hack Squat | `hack-squat` | hack-squat | 12 |  |
| Heel-Elevated Goblet Squat | `heel-elevated-goblet-squat` | dumbbell | 13 |  |
| Heels-Off Narrow Leg Press | `heels-off-narrow-leg-press` | machine | 1 |  |
| High Bar Squat | `high-bar-squat` | barbell | 1 | group `squat-heavy` |
| High Box Squat | `high-box-squat` | barbell | — | _unused by any plan_ |
| Leg Press | `leg-press` | machine | 12 |  |
| Low Bar Squat | `low-bar-squat` | barbell | 4 | group `squat-heavy` |
| Low Box Squat | `low-box-squat` | barbell | — | _unused by any plan_ |
| Mid Pin Squat | `mid-pin-squat` | barbell | — | _unused by any plan_ |
| Narrow-Stance Leg Press | `narrow-stance-leg-press` | machine | 1 |  |
| Paused Back Squat | `paused-back-squat` | barbell | 1 | group `squat-heavy` |
| Paused Low Bar Squat | `paused-low-bar-squat` | barbell | 1 | group `squat-heavy` |
| Paused Squat | `paused-squat` | barbell | 2 |  |
| Safety Bar Squat | `safety-bar-squat` | barbell | 1 | group `squat-heavy` |
| Stiletto Squats | `stiletto-squat` | dumbbell | 1 |  |
| Tempo Squat | `tempo-squat` | barbell | — | _unused by any plan_ |
| Zercher Squat | `zercher-squat` | barbell | — | _unused by any plan_ |

### hinge  <sub>21 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Anderson Deadlift | `anderson-deadlift` | barbell | — | _unused by any plan_ |
| B-Stance Romanian Deadlift | `staggered-stance-rdl` | dumbbell, kettlebell | 2 | unilateral; group `hinge` |
| Barbell Romanian Deadlift (legacy id) | `barbell-romanian-deadlift` | barbell | — | **deprecated** → `romanian-deadlift` |
| Block Pull (mid-shin) | `block-pull` | barbell | — | _unused by any plan_ |
| Cable Romanian Deadlift | `cable-romanian-deadlift` | cable | 1 |  |
| Conventional Deadlift | `conventional-deadlift` | barbell | 4 |  |
| DB Romanian Deadlift | `dumbbell-romanian-deadlift` | dumbbell, kettlebell | 2 |  |
| Deficit Deadlift | `deficit-deadlift` | barbell | — | _unused by any plan_ |
| Deficit RDLs | `deficit-romanian-deadlift` | barbell | 1 |  |
| Deficit Snatch Grip Deadlift | `deficit-snatch-grip-deadlift` | barbell | 1 |  |
| Good Mornings | `good-mornings` | barbell | 1 |  |
| Hip-Supported Dumbbell Deadlift | `hip-supported-db-deadlift` | dumbbell, smith | 13 |  |
| Kettlebell Swing | `kettlebell-swing` | kettlebell | 2 |  |
| Paused Deadlift (mid-shin) | `paused-deadlift` | barbell | — | _unused by any plan_ |
| Paused Deficit Deadlift | `paused-deficit-deadlift` | barbell | — | _unused by any plan_ |
| Romanian Deadlift | `romanian-deadlift` | barbell | 12 |  |
| Single-Leg Dumbbell Romanian Deadlift | `single-leg-dumbbell-romanian-deadlift` | dumbbell | 1 | unilateral |
| Single-Leg Romanian Deadlift | `single-leg-rdl` | dumbbell, kettlebell | 2 | unilateral; group `hinge` |
| Speed Deadlift with bands | `speed-deadlift-with-bands` | bands | — | _unused by any plan_ |
| Stiff-Legged Deadlift | `stiff-legged-deadlift` | barbell | 1 |  |
| Sumo Deadlift | `sumo-deadlift` | barbell | 1 |  |
| Supported Stiff Legged DB Deadlift (legacy id) | `supported-stiff-legged-dumbbell-deadlift` | dumbbell | — | **deprecated** → `hip-supported-db-deadlift` |
| Trap-Bar Deadlift | `trap-bar-deadlift` | barbell | 3 | group `hinge-heavy` |

### lunge  <sub>9 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Bulgarian Split Squat | `bulgarian-split-squat` | dumbbell | 1 | unilateral |
| Deficit Reverse Lunge | `deficit-reverse-lunge` | dumbbell | 4 |  |
| Dumbbell Walking Lunge | `dumbbell-walking-lunge` | dumbbell | 1 |  |
| Front-Foot Elevated Bulgarian Split Squat | `front-foot-elevated-bulgarian-split-squat` | dumbbell | 13 | unilateral |
| Goblet Skater Squat | `goblet-skater-squat` | dumbbell | 9 | unilateral |
| Knee-Over-Toe Split Squat | `knee-over-toe-split-squat` | bodyweight, dumbbell | 1 | unilateral |
| Split Squat | `split-squat` | dumbbell | 1 | unilateral |
| Walking Lunges | `walking-lunge` | dumbbell | 2 |  |
| Weighted Step-Up | `weighted-step-up` | dumbbell, kettlebell, bench | 2 | unilateral |

### hip-extension  <sub>16 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| 45° Back Extension | `45-back-extension` | machine | 1 |  |
| B-Stance Hip Thrust | `b-stance-hip-thrust` | machine | 1 | unilateral |
| Bench Hip Thrust | `bench-hip-thrust` | machine | — | _unused by any plan_ |
| Cable Pull-Through | `cable-pull-through` | cable | — | _unused by any plan_ |
| Dumbbell Hip Thrust | `dumbbell-hip-thrust` | dumbbell, machine | — | _unused by any plan_ |
| Frog Pump | `frog-pump` | bodyweight | — | bodyweight; _unused by any plan_ |
| Glute Bridge | `glute-bridge` | bodyweight, dumbbell, kettlebell, plate | 1 | optional; group `hip-extension` |
| Glute Pump Finisher | `glute-pump-finisher` | bodyweight | 1 |  |
| High-Foot Leg Press | `high-foot-leg-press` | machine | 1 |  |
| Hip Thrusts | `hip-thrust` | machine | 5 |  |
| Kas Glute Bridge | `kas-glute-bridge` | bodyweight | 1 |  |
| Reverse Hyperextension | `reverse-hyperextension` | machine | — | group `hip-extension`; _unused by any plan_ |
| Single Leg Machine Hip Thrust | `single-leg-machine-hip-thrust` | machine | 9 | unilateral |
| Single-Leg Glute Bridge | `single-leg-glute-bridge` | bodyweight, dumbbell, plate | — | unilateral; optional; group `hip-extension-unilateral`; _unused by any plan_ |
| Single-Leg Glute Leg Press | `single-leg-glute-leg-press` | machine | — | unilateral; _unused by any plan_ |
| Single-Leg Hip Thrust | `single-leg-hip-thrust` | bodyweight, dumbbell, plate, bench | 1 | unilateral; optional; group `hip-extension-unilateral` |

### knee-flexion  <sub>9 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Glute-Ham Raise | `glute-ham-raise` | machine | 2 |  |
| Ham Curls | `ham-curl` | leg-curl | 1 |  |
| Lying Leg Curls | `lying-leg-curl` | leg-curl | 13 |  |
| Nordic Curls | `nordic-curl` | bodyweight | 1 | bodyweight |
| Seated Ham Curl | `seated-ham-curl` | leg-curl | 10 |  |
| Seated Hamstring Curl | `seated-hamstring-curl` | leg-curl | 17 |  |
| Seated Leg Curls | `seated-leg-curl` | leg-curl | 1 |  |
| Single-Leg Hamstring Curl | `single-leg-hamstring-curl` | leg-curl | 2 | unilateral |
| Slow Eccentric Cheat Nordic Curls | `slow-eccentric-cheat-nordic-curl` | bodyweight | 1 | bodyweight |

### knee-extension  <sub>5 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Leg Extensions | `leg-extension` | leg-extension | 18 |  |
| Reverse Nordic Curls | `reverse-nordic-curl` | bodyweight | 3 | bodyweight |
| Sissy Squat | `sissy-squat` | bodyweight | 3 | bodyweight |
| Stripper Squat | `stripper-squat` | hack-squat | 1 | group `knee-extension` |
| Supported Sissy Squat | `supported-sissy-squat` | bodyweight, smith | 5 | bodyweight; group `knee-extension` |

### hip-adduction  <sub>3 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Copenhagen Plank | `copenhagen-plank` | bodyweight, bench | — | unilateral; timed; group `hip-adduction`; _unused by any plan_ |
| Copenhagen Raise | `copenhagen-raise` | bodyweight, bench | — | unilateral; bodyweight; group `hip-adduction`; _unused by any plan_ |
| Hip Adduction | `hip-adduction` | machine | 6 |  |

### hip-abduction  <sub>2 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Machine Hip Abduction | `machine-hip-abduction` | machine | 6 | group `hip-abduction` |
| Side Glute-Medius Hip Thrust | `side-glute-medius-hip-thrust` | bodyweight, bands, plate, bench | — | unilateral; optional; group `hip-abduction`; _unused by any plan_ |

### calf  <sub>9 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Calf Raises | `calf-raise` | machine | — | _unused by any plan_ |
| Calves | `calf` | machine | 1 |  |
| Hack Squat Calf Raises | `hack-calf-raise` | hack-squat | 25 |  |
| Leg Press Calf Raises | `leg-press-calf-raise` | machine | — | _unused by any plan_ |
| Seated Dumbbell Calf Raise | `seated-dumbbell-calf-raise` | dumbbell | — | **deprecated** → `standing-dumbbell-kb-calf-raise` |
| Single-Leg Cable Calf Raise | `single-leg-cable-calf-raise` | cable | — | unilateral; _unused by any plan_ |
| Smith Machine Calf Raise | `smith-calf-raise` | smith, machine | — | _unused by any plan_ |
| Standing Calf Raise off Step | `standing-calf-raise-off-step` | machine | — | _unused by any plan_ |
| Standing Calf Raises | `standing-calf-raise` | machine | 8 |  |
| Standing Dumbbell/KB Calf Raise | `standing-dumbbell-kb-calf-raise` | dumbbell, kettlebell | 2 |  |

### core-flexion  <sub>8 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Bench Reverse Crunch | `bench-reverse-crunch` | bodyweight | — | _unused by any plan_ |
| Cable Crunch | `cable-crunch` | cable | 17 |  |
| Cable Crunches | `cable-crunches` | cable | 1 |  |
| Hanging Knee Raise | `hanging-knee-raise` | pull-up-bar, bodyweight | 3 | bodyweight |
| Hanging Leg Raises | `hanging-leg-raise` | pull-up-bar | 4 | bodyweight; group `core-raise` |
| Machine Crunch | `machine-crunch` | machine | — | _unused by any plan_ |
| Side Hanging Knee Raise | `side-hanging-knee-raise` | pull-up-bar, bodyweight | — | unilateral; bodyweight; _unused by any plan_ |
| Weighted Crunch | `weighted-crunch` | bodyweight | — | weighted-bodyweight; _unused by any plan_ |

### core-antiextension  <sub>5 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Ab Wheel | `ab-wheel` | ab-wheel | 13 |  |
| Ab Wheel Rollouts | `ab-wheel-rollout` | ab-wheel | 1 | group `core-raise` |
| Dead Hang | `dead-hang` | pull-up-bar, bodyweight | 1 | timed |
| Dead Hang + Planks | `dead-hang-plank` | pull-up-bar, bodyweight | — | **deprecated** → `dead-hang`; timed |
| Dragon Flags | `dragon-flags` | bodyweight | 1 | bodyweight; group `core-raise` |
| Planks | `plank` | bodyweight | 6 | timed |

### core-antirotation  <sub>2 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Suitcase Carry | `suitcase-carry` | dumbbell, kettlebell | 3 | unilateral; timed |
| Suitcase Hold | `suitcase-hold` | dumbbell, kettlebell | 2 | unilateral; timed |

### carry  <sub>3 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Farmer Carry | `farmer-carry` | dumbbell, kettlebell | 2 |  |
| Farmer Holds | `farmer-hold` | dumbbell | 1 | timed |
| Turkish Get-Up | `turkish-get-up` | kettlebell | — | unilateral; _unused by any plan_ |

### mobility  <sub>4 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Apex Access Slot | `apex-access-placeholder` | bodyweight | — | bodyweight; _unused by any plan_ |
| Loaded 90/90 Hip Transition | `loaded-90-90-transition` | bodyweight, plate | — | _unused by any plan_ |
| Open-Book Rotation | `open-book-rotation` | bodyweight | 1 | unilateral; bodyweight |
| Wall Slide | `wall-slide` | bodyweight, bands | — | bodyweight; _unused by any plan_ |

### other  <sub>1 active</sub>

| Exercise | id | Equipment | Plans | Notes |
| --- | --- | --- | --- | --- |
| Loaded Ankle Rock | `loaded-ankle-rock` | dumbbell | 1 | unilateral |
