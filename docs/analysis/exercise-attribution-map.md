# Exercise attribution map

Fractional muscle attribution and strength ratios for every movement in the
library. Built as analysis data first — it is the spec for a later change to
`src/data/exercises/types.ts`, and the basis of every weekly-volume number in
the per-plan audits.

Status: **schema + tranche 1 of 12** (horizontal-press). Format under review.

---

## 1. Why this exists

`MuscleGroup` in the library is 23 flat keys, and `analyseWeek` counts a
primary as 1 set and a secondary as ⅓. That cannot express:

- upper vs lower pec (bench press is `primary: ['chest']` and nothing more)
- quad head bias, hamstring head bias, glute subdivision
- rhomboid vs teres major (both collapse into `upperBack`)
- triceps by head
- serratus anterior or the deep abdominal wall (absent entirely)

Over half the requested granularity is uncomputable today. This map supplies it.

---

## 2. Dimensions

35 dimensions. Names are stable keys, intended to become the new `MuscleGroup`
union.

| Region | Keys |
|---|---|
| Chest | `pecUpper` (clavicular), `pecLower` (sternocostal) |
| Shoulder | `frontDelt`, `sideDelt`, `rearDelt` |
| Cuff | `infraspinatus` (incl. teres minor), `subscapularis` |
| Back — vertical | `latsUpper`, `latsLower`, `teresMajor` |
| Back — scapular | `rhomboids`, `trapUpper`, `trapMid`, `trapLower` |
| Back — spinal | `erectors` |
| Arm — flexors | `bicepsLong`, `bicepsShort`, `brachialis`, `brachioradialis` |
| Arm — extensors | `tricepsLong`, `tricepsLateral`, `tricepsMedial` |
| Forearm | `forearmFlexors`, `forearmExtensors` |
| Core | `absUpper`, `absLower`, `obliques`, `serratus`, `abdominalWall` (TVA) |
| Quad | `rectusFemoris`, `vastusLateralis`, `vastusMedialis`, `vastusIntermedius` |
| Posterior chain | `bicepsFemoris`, `semiMembTend` (semimembranosus + semitendinosus) |
| Hip | `gluteMaxUpper`, `gluteMaxLower`, `gluteMedius`, `adductors`, `tfl` |
| Shank | `gastrocnemius`, `soleus`, `tibialisAnterior` |

`abductors` from the old taxonomy splits into `gluteMedius` + `tfl`, which is
what actually distinguishes a seated abduction from a lateral band walk.

### Fractional convention

| Value | Meaning |
|---|---|
| **1.0** | Prime mover. The set is *for* this muscle |
| **0.5** | Strong contributor, meaningfully loaded through a working range |
| **0.25** | Real but minor involvement |
| **0.1** | Stabiliser / isometric only — counted, never an exposure |
| 0 | Omitted from the row |

A muscle only earns an **exposure** at ≥ 0.5. This matters: bench press should
not create a "triceps exposure" that lets a plan claim triceps frequency.

### Stretch flag

`†` after a value marks the muscle being loaded in a **lengthened** position
(the exercise's `lengthenedBias` ≥ 3 applied to that specific muscle). Regional
hypertrophy and stretch-mediated growth both track this, and it is the honest
way to say a Bayesian curl and a preacher curl are not the same 1.0 for biceps.

---

## 3. Strength ratios

Expected working load as a percentage of a reference lift, for seeding opening
weights (`seedLoadFor`) and for sanity-checking logged loads.

Anchors: `SQ` back squat · `BP` flat bench · `ROW` barbell row · `OHP` standing
press · `PU` pull-up (bodyweight + added) · `DL` conventional deadlift ·
`CURL` barbell curl · `SKULL` EZ skullcrusher.

Confidence: **H** = well-evidenced ratio · **M** = reasonable central estimate,
individual variance ±10% · **L** = machine- or leverage-dependent, treat as a
starting guess only · **—** = no meaningful ratio (isolation with no barbell
equivalent, or bodyweight-determined).

Dumbbell ratios are **total across both hands** unless marked *per hand*.

---

## 4. Merge spec

Applied as canonical in this map. Losing ids become `aliases` so history joins.

| Canonical | Absorbs | Reason |
|---|---|---|
| `seated-hamstring-curl` | `seated-ham-curl`, `seated-leg-curl`, `ham-curl` | 4 byte-identical definitions; the two live ones are used by *different* plans, so leg-curl history silently splits |
| `leaning-one-arm-lateral-raise` | `leaning-single-arm-dumbbell-lateral-raise` | Same movement, one dead |
| `ab-wheel` | `ab-wheel-rollout` | Same movement, one dead |
| `cable-crunch` | `cable-crunches` | Same movement, one dead |

**Deliberately not merged** — distinct variations worth keeping: every squat,
deadlift, press and row variant; lying vs seated leg curl (different hamstring
stretch, Maeo 2021); nordic vs slow-eccentric nordic; `single-arm-lateral-raise`
(no torso lean) vs the leaning version.

**Legacy stubs needing a decision** — no distinguishing content, but reachable
by display name from free-text plans, so they cannot simply be deleted:
`row`, `shrug`, `shoulder-press`, `calf`, `tricep-extension`. Proposal: alias
each onto the canonical concrete movement (`barbell-row`, `barbell-shrug`,
`standing-barbell-military-press`, `standing-calf-raise`, `rope-pressdown`).

---

## 5. Attribution — horizontal press (26)

### Barbell

**`flat-barbell-bench-press`** · barbell · 3 plans · **BP 100%** (anchor, H)
`pecLower 1.0` · `pecUpper 0.5` · `frontDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `tricepsLong 0.25` · `serratus 0.25` · `subscapularis 0.1`

**`paused-bench-press`** · barbell · 6 plans · **BP 92%** (H)
`pecLower 1.0†` · `pecUpper 0.5` · `frontDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `tricepsLong 0.25` · `serratus 0.25`
Dead-stop kills the stretch reflex; the pec sits loaded at length longer than a touch-and-go.

**`long-pause-bench-press`** · barbell · 0 plans · **BP 88%** (M)
`pecLower 1.0†` · `pecUpper 0.5` · `frontDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `tricepsLong 0.25` · `serratus 0.25`

**`spoto-press`** · barbell · 0 plans · **BP 90%** (M)
`pecLower 1.0†` · `pecUpper 0.5` · `frontDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `tricepsLong 0.25`
Stops short of the chest — constant tension, no chest contact.

**`larsen-press`** · barbell · 0 plans · **BP 90%** (M)
`pecLower 1.0` · `pecUpper 0.5` · `frontDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `tricepsLong 0.25` · `abdominalWall 0.25` · `obliques 0.1`
Legs up removes leg drive and adds a real trunk-stability cost.

**`wide-grip-bench-press`** · barbell · 0 plans · **BP 100%** (M)
`pecLower 1.0†` · `pecUpper 0.5` · `frontDelt 0.5` · `tricepsLateral 0.25` · `tricepsMedial 0.25` · `serratus 0.25`
Shorter ROM offsets the reduced triceps leverage; more pec stretch, less triceps.

**`close-grip-bench-press`** · barbell · 2 plans · **BP 88%** (H)
`tricepsLateral 1.0` · `tricepsMedial 1.0` · `tricepsLong 0.5` · `pecLower 0.5` · `pecUpper 0.5` · `frontDelt 0.5`
The one horizontal press where triceps are the prime mover, not a contributor.

**`low-pin-press`** · barbell · 0 plans · **BP 88%** (M)
`pecLower 1.0` · `pecUpper 0.5` · `frontDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `tricepsLong 0.25`
Dead start from the bottom pin; no elastic contribution at all.

### Dumbbell / unilateral

**`flat-dumbbell-press`** · dumbbell · 9 plans · **BP 78%** total, *39% per hand* (H)
`pecLower 1.0†` · `pecUpper 0.5` · `frontDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `tricepsLong 0.25` · `subscapularis 0.25`
Greater adduction range and deeper stretch than the barbell.

**`single-arm-floor-press`** · dumbbell/kettlebell · 1 plan · **BP 22% per hand** (M)
`pecLower 1.0` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `tricepsLong 0.5` · `frontDelt 0.5` · `obliques 0.5` · `abdominalWall 0.5` · `subscapularis 0.25`
Floor caps the ROM (no stretch); the anti-rotation demand is the real feature.

### Machine / cable — press

**`hammer-chest-press`** · hammer-strength · **16 plans** · **BP ~95%** (L)
`pecLower 1.0` · `pecUpper 0.5` · `frontDelt 0.25` · `tricepsLateral 0.5` · `tricepsMedial 0.5`
Load is leverage-dependent; ratio is a seed, not a truth. The most-used chest movement in the portfolio.

**`dual-cable-chest-press`** · cable · 0 plans · **BP 60%** (L)
`pecLower 1.0` · `pecUpper 0.5` · `frontDelt 0.25` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `abdominalWall 0.25`

**`machine-press-fly-combo`** · machine · 1 plan · — (L)
`pecLower 1.0†` · `pecUpper 0.5` · `frontDelt 0.25` · `tricepsLateral 0.25`

### Machine / cable — fly

**`pec-deck`** · pec-deck · 8 plans · **— ** (L)
`pecLower 1.0†` · `pecUpper 0.5` · `frontDelt 0.25` · `bicepsShort 0.1`
Isolation: no barbell equivalent. Seed from prior machine load only.

**`cable-fly`** · cable · 1 plan · — (L)
`pecLower 1.0†` · `pecUpper 0.25` · `frontDelt 0.25`

**`cable-crossover`** · cable · 1 plan · — (L)
`pecLower 1.0` · `pecUpper 0.25` · `frontDelt 0.25`
Crossing past midline biases the sternal fibres at short length.

**`mid-cable-fly`** · cable · 0 plans · — (L)
`pecLower 1.0†` · `pecUpper 0.5` · `frontDelt 0.25`

**`low-to-high-cable-fly`** · cable · 0 plans · — (L)
`pecUpper 1.0†` · `pecLower 0.25` · `frontDelt 0.5`
**The library's only true upper-pec isolation, and no plan uses it.** See §6.

### Bodyweight / dip

**`push-up`** · bodyweight · 2 plans · **≈64% bodyweight** (H)
`pecLower 1.0` · `pecUpper 0.5` · `frontDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `serratus 0.5` · `abdominalWall 0.25`

**`deficit-push-up`** · bodyweight · 2 plans · **≈68% bodyweight** (M)
`pecLower 1.0†` · `pecUpper 0.5` · `frontDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `serratus 0.5` · `abdominalWall 0.25`

**`close-grip-push-up`** · bodyweight · 1 plan · **≈66% bodyweight** (M)
`tricepsLateral 1.0` · `tricepsMedial 1.0` · `tricepsLong 0.5` · `pecLower 0.5` · `frontDelt 0.5` · `serratus 0.25`

**`diamond-push-up`** · bodyweight · 0 plans · **≈68% bodyweight** (M)
`tricepsLateral 1.0` · `tricepsMedial 1.0` · `tricepsLong 0.5` · `pecLower 0.5` · `frontDelt 0.5`

**`trx-push-up`** · trx/bodyweight · 1 plan · — (L)
`pecLower 1.0` · `pecUpper 0.5` · `frontDelt 0.5` · `tricepsLateral 0.5` · `serratus 0.5` · `abdominalWall 0.5` · `obliques 0.25`

**`dip`** · dip-station · 2 plans · **bodyweight** (H)
`pecLower 1.0†` · `tricepsLateral 1.0` · `tricepsMedial 1.0` · `tricepsLong 0.5` · `frontDelt 0.5` · `pecUpper 0.1`
Forward lean shifts toward pec; upright shifts toward triceps. Attribution assumes the plan's default cue.

**`bodyweight-dip`** · dip-station · 0 plans · **bodyweight** (H)
As `dip`. Candidate merge — flagged, not merged, pending your read on whether the loaded/unloaded split is deliberate.

**`weighted-dip`** · dip-station/plate · 1 plan · **bodyweight + load; ≈BP 75% total system** (M)
`pecLower 1.0†` · `tricepsLateral 1.0` · `tricepsMedial 1.0` · `tricepsLong 0.5` · `frontDelt 0.5`

---

## 6. Tranche-1 coverage findings

1. **Upper pec is structurally underserved.** Of 26 horizontal presses, exactly
   one (`low-to-high-cable-fly`) has `pecUpper` as prime mover, and **no plan
   uses it**. Every other upper-pec contribution is 0.5 or less, incidental to
   a flat press. The real upper-pec work lives in the 3-exercise `incline-press`
   pattern. For any plan claiming balanced chest development this is the gap —
   and it is invisible under the current `chest` single key.

2. **`hammer-chest-press` is the portfolio's most-used chest movement** (16
   plans) and its load ratio is leverage-dependent, so seeded weights on it are
   guesses. Worth a calibration prompt rather than a derived seed.

3. **Six barbell bench variants are unused** (`larsen`, `long-pause`, `spoto`,
   `low-pin`, `wide-grip`, plus `bodyweight-dip`). Given how narrow plan
   selection is, these are inventory to deploy, not dead weight to cut.

4. **Triceps attribution was systematically wrong** in the old data: every
   press listed `secondary: ['triceps']` undifferentiated, which credits the
   long head for work it does not do in a bench press (it is a shoulder
   extensor and stays short). Splitting by head changes triceps volume numbers
   materially for press-heavy plans.

---

## 7. Attribution — squat (22)

Quad-head principle used throughout: **rectus femoris is biarticular**. In any
squat the hip flexes, shortening RF at the same time the knee flexes and
lengthens it, so RF never works hard in a squat pattern. RF earns ≥ 0.5 only
where the hip is extended or neutral (knee extension, reverse nordic, sissy).
This is the single biggest correction the head split makes — every plan that
"covers quads" with squats alone under-trains RF.

**`barbell-squat`** · barbell · 3 plans · **SQ 100%** (anchor, H)
`vastusLateralis 1.0` · `vastusMedialis 1.0` · `vastusIntermedius 1.0` · `gluteMaxLower 1.0†` · `gluteMaxUpper 0.5` · `adductors 0.5†` · `erectors 0.5` · `rectusFemoris 0.25` · `semiMembTend 0.25` · `bicepsFemoris 0.25` · `abdominalWall 0.25`

**`high-bar-squat`** · barbell · 0 plans · **SQ 100%** (H)
As `barbell-squat`; more knee flexion, `adductors 0.5†`, `erectors 0.25`.

**`low-bar-squat`** · barbell · 2 plans · **SQ 105%** (H)
`vastusLateralis 1.0` · `vastusMedialis 1.0` · `vastusIntermedius 1.0` · `gluteMaxLower 1.0†` · `gluteMaxUpper 0.5` · `erectors 0.5` · `adductors 0.5` · `bicepsFemoris 0.5` · `semiMembTend 0.25`
More hip, less knee — the hamstrings genuinely contribute here, unlike high-bar.

**`front-squat`** · barbell · 4 plans · **SQ 82%** (H)
`vastusLateralis 1.0` · `vastusMedialis 1.0` · `vastusIntermedius 1.0` · `rectusFemoris 0.5` · `gluteMaxLower 0.5†` · `erectors 0.5` · `adductors 0.25` · `abdominalWall 0.5` · `trapUpper 0.25`
Upright torso keeps the hip more open, so RF is less shortened than in a back squat.

**`paused-squat`** · barbell · 1 plan · **SQ 90%** (M)
As `barbell-squat`, `gluteMaxLower 1.0†`, `adductors 0.5†`. Pause removes elastic return.

**`paused-back-squat`** · barbell · 1 plan · **SQ 90%** (M)
As `paused-squat` plus `erectors 0.5`. **Duplicate candidate** with `paused-squat` — flagged, not merged.

**`tempo-squat`** · barbell · 0 plans · **SQ 85%** (M)
As `barbell-squat`; eccentric emphasis, `vastus* 1.0†`.

**`safety-bar-squat`** · barbell · 1 plan · **SQ 90%** (M)
As `barbell-squat` plus `erectors 0.5`, `trapMid 0.25`. Bar pushes the torso down.

**`zercher-squat`** · barbell · 0 plans · **SQ 70%** (M)
`vastus* 1.0` · `gluteMaxLower 0.5†` · `rectusFemoris 0.5` · `erectors 0.5` · `abdominalWall 0.5` · `bicepsLong 0.25` · `trapMid 0.25`

**`high-box-squat`** · barbell · 0 plans · **SQ 105%** (M)
`vastus* 0.5` · `gluteMaxLower 1.0` · `gluteMaxUpper 0.5` · `bicepsFemoris 0.5` · `erectors 0.5`
Short ROM, hip-dominant — this is a posterior-chain exercise wearing a squat's name.

**`low-box-squat`** · barbell · 0 plans · **SQ 95%** (M)
As `barbell-squat` with `gluteMaxLower 1.0`, dead-stop at depth.

**`mid-pin-squat`** · barbell · 0 plans · **SQ 88%** (M)
`vastus* 1.0` · `gluteMaxLower 0.5` · `erectors 0.5` — dead start, no stretch reflex.

**`banded-squat`** · bands · 0 plans · — (L)
As `barbell-squat` at reduced load; accommodating resistance biases the top.

**`hack-squat`** · hack-squat · **17 plans** · **SQ ~120%** (L)
`vastusLateralis 1.0†` · `vastusMedialis 1.0†` · `vastusIntermedius 1.0†` · `gluteMaxLower 0.5†` · `adductors 0.25` · `rectusFemoris 0.25`
The portfolio's most-used squat. Back support removes erector and trunk cost — a genuinely different stimulus from a barbell squat, and plans treat them as interchangeable.

**`stripper-squat`** · hack-squat · 1 plan · — (L)
`vastusLateralis 1.0†` · `vastusMedialis 1.0†` · `vastusIntermedius 1.0†` · `gluteMaxLower 1.0†` · `gluteMaxUpper 0.5` · `adductors 0.5†`

**`leg-press`** · machine · 8 plans · **SQ ~200%** (L)
`vastusLateralis 1.0` · `vastusMedialis 1.0` · `vastusIntermedius 1.0` · `gluteMaxLower 0.5†` · `adductors 0.25`
Ratio is near-meaningless across machines — calibrate, never seed.

**`narrow-stance-leg-press`** · machine · 0 plans · **SQ ~190%** (L)
`vastusLateralis 1.0` · `vastusIntermedius 1.0` · `vastusMedialis 0.5` · `gluteMaxLower 0.25`

**`high-foot-leg-press`** · machine · 0 plans · **SQ ~190%** (L)
`gluteMaxLower 1.0†` · `bicepsFemoris 0.5` · `semiMembTend 0.5` · `vastus* 0.5` — a hip-extension movement, misfiled as a squat.

**`heels-off-narrow-leg-press`** · machine · 0 plans · **SQ ~180%** (L)
`vastusLateralis 1.0†` · `vastusMedialis 1.0†` · `vastusIntermedius 1.0†` · `rectusFemoris 0.25` · `gastrocnemius 0.1`

**`heel-elevated-goblet-squat`** · dumbbell · 8 plans · — (M)
`vastusLateralis 1.0†` · `vastusMedialis 1.0†` · `vastusIntermedius 1.0†` · `gluteMaxLower 0.5†` · `adductors 0.25` · `abdominalWall 0.5` · `trapMid 0.25`

**`goblet-heel-elevated-squat`** · dumbbell/kettlebell · 3 plans · — (M)
Identical attribution to `heel-elevated-goblet-squat`. **Duplicate — merge candidate** (name order transposed). Both are live, in different plans; same split-history risk as the leg curls.

**`cable-cyclist-squat`** · cable · 0 plans · — (L)
`vastusLateralis 1.0†` · `vastusMedialis 1.0†` · `vastusIntermedius 1.0†` · `rectusFemoris 0.25`

**`stiletto-squat`** · dumbbell · 0 plans · — (L)
`vastusLateralis 1.0†` · `vastusMedialis 1.0†` · `vastusIntermedius 1.0†` · `gluteMaxLower 0.5` · `soleus 0.25`

---

## 8. Attribution — lunge (9)

Unilateral: sets count once for the athlete, and load ratios are *per leg*.
All carry a real `gluteMedius` demand that bilateral squatting does not — this
is where frontal-plane hip work actually lives in most plans.

**`front-foot-elevated-bulgarian-split-squat`** · dumbbell · **13 plans** · **SQ 25% per hand** (M)
`vastusLateralis 1.0†` · `vastusMedialis 1.0†` · `vastusIntermedius 1.0†` · `gluteMaxLower 1.0†` · `gluteMedius 0.5` · `adductors 0.5†` · `rectusFemoris 0.25` · `abdominalWall 0.25`

**`bulgarian-split-squat`** · dumbbell · 1 plan · **SQ 25% per hand** (M)
As above with `gluteMaxLower 1.0†`, less quad stretch (no front elevation).

**`split-squat`** · dumbbell · 1 plan · **SQ 30% per hand** (M)
`vastus* 1.0` · `gluteMaxLower 0.5` · `gluteMedius 0.5` · `adductors 0.25`

**`deficit-reverse-lunge`** · dumbbell · 4 plans · **SQ 25% per hand** (M)
`gluteMaxLower 1.0†` · `vastus* 0.5` · `gluteMedius 0.5` · `adductors 0.5†` · `bicepsFemoris 0.25`
Reverse step is hip-dominant; the deficit deepens the glute stretch.

**`walking-lunge`** · dumbbell · 0 plans · **SQ 25% per hand** (M)
`vastus* 1.0` · `gluteMaxLower 1.0†` · `gluteMedius 0.5` · `adductors 0.5`

**`dumbbell-walking-lunge`** · dumbbell · 0 plans · **SQ 25% per hand** (M)
Identical to `walking-lunge`. **Duplicate — merge candidate.**

**`goblet-skater-squat`** · dumbbell · 9 plans · — (M)
`vastus* 1.0†` · `gluteMaxLower 0.5†` · `gluteMedius 0.5` · `abdominalWall 0.5` · `adductors 0.25`

**`knee-over-toe-split-squat`** · bodyweight/dumbbell · 1 plan · — (L)
`vastusLateralis 1.0†` · `vastusMedialis 1.0†` · `vastusIntermedius 1.0†` · `rectusFemoris 0.25` · `gluteMaxLower 0.5†` · `soleus 0.25` · `gluteMedius 0.25`

**`weighted-step-up`** · dumbbell/kettlebell · 1 plan · **SQ 25% per hand** (M)
`gluteMaxLower 1.0†` · `vastus* 0.5` · `gluteMedius 0.5` · `adductors 0.25`

---

## 9. Attribution — knee extension (4)

The only place rectus femoris is a prime mover. Four exercises, and the plans
lean almost entirely on one of them.

**`leg-extension`** · leg-extension · **17 plans** · — (L)
`vastusLateralis 1.0` · `vastusMedialis 1.0` · `vastusIntermedius 1.0` · `rectusFemoris 1.0`
Seated (hip flexed) shortens RF — hip-extended or reclined seat backs load RF at length and are meaningfully better for it.

**`sissy-squat`** · bodyweight · 3 plans · — (L)
`rectusFemoris 1.0†` · `vastusLateralis 1.0†` · `vastusMedialis 1.0†` · `vastusIntermedius 1.0†` · `abdominalWall 0.5`
Hip extended while the knee flexes — the strongest RF-at-length stimulus in the library.

**`supported-sissy-squat`** · bodyweight/smith · 3 plans · — (L)
As `sissy-squat`, `abdominalWall 0.25`.

**`reverse-nordic-curl`** · bodyweight · 1 plan (filed under knee-flexion) · — (L)
`rectusFemoris 1.0†` · `vastusLateralis 1.0†` · `vastusMedialis 1.0†` · `vastusIntermedius 1.0†` · `abdominalWall 0.5`
**Misfiled**: `pattern: 'knee-flexion'` with `primary: ['hamstrings']`. It is a knee-*extensor* exercise under eccentric load and hits zero hamstring. A plan using it for hamstring volume is getting none. Highest-severity attribution bug found so far.

---

## 10. Attribution — knee flexion (10)

Hamstring principle: **seated (hip-flexed) curls train the hamstring at longer
muscle length and produce more growth than lying curls** (Maeo 2021), and the
biarticular heads — biceps femoris long head, semitendinosus, semimembranosus —
are the ones that benefit. Short-head BF is monoarticular and works in both.

**`seated-hamstring-curl`** · leg-curl · **16 plans** · — (L)
`bicepsFemoris 1.0†` · `semiMembTend 1.0†` · `gastrocnemius 0.25`
**Canonical** — absorbs `seated-ham-curl` (9 plans), `seated-leg-curl`, `ham-curl`.

**`lying-leg-curl`** · leg-curl · 10 plans · — (L)
`bicepsFemoris 1.0` · `semiMembTend 1.0` · `gastrocnemius 0.25`
Genuinely distinct from seated — hip extended, shorter working length. Keep.

**`single-leg-hamstring-curl`** · leg-curl · 3 plans · — (L)
`bicepsFemoris 1.0` · `semiMembTend 1.0` · `gastrocnemius 0.25`

**`nordic-curl`** · bodyweight · 0 plans · — (—)
`bicepsFemoris 1.0` · `semiMembTend 1.0` · `gastrocnemius 0.25` · `erectors 0.25`
Supramaximal eccentric; the strongest evidence base for hamstring injury resilience in the library, and unused by every plan.

**`slow-eccentric-cheat-nordic-curl`** · bodyweight · 0 plans · — (—)
As `nordic-curl`. Distinct execution — keep.

**`glute-ham-raise`** · machine · 0 plans · — (M)
`bicepsFemoris 1.0` · `semiMembTend 1.0` · `gluteMaxLower 0.5` · `erectors 0.5` · `gastrocnemius 0.25`
The only movement that trains the hamstring at both joints simultaneously. Unused.

**`reverse-nordic-curl`** — see §9. Attribution and pattern are both wrong.

**`ham-curl`**, **`seated-leg-curl`**, **`seated-ham-curl`** — merged into `seated-hamstring-curl`.

---

## 11. Attribution — hinge (23)

**`conventional-deadlift`** · barbell · 1 plan · **DL 100%** (anchor, H)
`gluteMaxLower 1.0†` · `bicepsFemoris 1.0†` · `semiMembTend 1.0†` · `erectors 1.0` · `trapMid 0.5` · `trapUpper 0.5` · `latsLower 0.5` · `forearmFlexors 0.5` · `vastus* 0.5` · `adductors 0.25`

**`sumo-deadlift`** · barbell · 0 plans · **DL 100%** (H)
`gluteMaxLower 1.0†` · `adductors 1.0†` · `vastus* 0.5` · `erectors 0.5` · `bicepsFemoris 0.5` · `semiMembTend 0.5` · `trapMid 0.5` · `forearmFlexors 0.5`
**The library's best adductor loader** — and no plan uses it. See §6 of the adductor gap.

**`trap-bar-deadlift`** · barbell · 2 plans · **DL 105%** (H)
`gluteMaxLower 1.0†` · `vastus* 0.5` · `bicepsFemoris 0.5` · `semiMembTend 0.5` · `erectors 0.5` · `trapUpper 0.5` · `forearmFlexors 0.5`

**`deficit-deadlift`** · barbell · 0 plans · **DL 90%** (M)
As conventional with `gluteMaxLower 1.0†`, `vastus* 0.5`, `erectors 1.0`.

**`paused-deadlift`** · barbell · 0 plans · **DL 88%** (M) · as conventional, `erectors 1.0`.

**`paused-deficit-deadlift`** · barbell · 0 plans · **DL 82%** (M) · as deficit, `erectors 1.0`.

**`block-pull`** · barbell · 0 plans · **DL 110%** (M)
`erectors 1.0` · `trapMid 0.5` · `trapUpper 0.5` · `gluteMaxLower 0.5` · `bicepsFemoris 0.5` · `forearmFlexors 0.5` — top-range, little stretch.

**`anderson-deadlift`** · barbell · 0 plans · **DL 92%** (M) · dead start from pins; as conventional minus stretch (`gluteMaxLower 0.5`).

**`deficit-snatch-grip-deadlift`** · barbell · 0 plans · **DL 72%** (M)
`erectors 1.0` · `trapMid 1.0` · `trapUpper 0.5` · `gluteMaxLower 1.0†` · `bicepsFemoris 1.0†` · `semiMembTend 1.0†` · `forearmFlexors 1.0` · `rhomboids 0.5`
Widest grip + deficit = the largest upper-back and grip demand of any hinge.

**`speed-deadlift-with-bands`** · bands · 0 plans · **DL 60%** (M) · as conventional at speed.

**`romanian-deadlift`** · barbell · **15 plans** · **DL 82%** (H)
`bicepsFemoris 1.0†` · `semiMembTend 1.0†` · `gluteMaxLower 1.0†` · `erectors 0.5` · `latsLower 0.25` · `forearmFlexors 0.5`

**`barbell-romanian-deadlift`** · barbell · 2 plans · **DL 82%** (H)
Identical to `romanian-deadlift`. **Duplicate — merge candidate**, and again split across different plans.

**`deficit-romanian-deadlift`** · barbell · 0 plans · **DL 75%** (M) · as RDL, deeper stretch on all three.

**`stiff-legged-deadlift`** · barbell · 0 plans · **DL 78%** (M)
`bicepsFemoris 1.0†` · `semiMembTend 1.0†` · `gluteMaxLower 0.5†` · `erectors 1.0`
Distinct from RDL: more knee extension, more erector. Keep separate.

**`good-mornings`** · barbell · 0 plans · **DL 45%** (M)
`bicepsFemoris 1.0†` · `semiMembTend 1.0†` · `erectors 1.0` · `gluteMaxLower 0.5†`

**`dumbbell-romanian-deadlift`** · dumbbell/kettlebell · 0 plans · **DL 60%** (M) · as RDL.

**`supported-stiff-legged-dumbbell-deadlift`** · dumbbell · 0 plans · **DL 55%** (L) · as stiff-legged, `erectors 0.5` (chest support).

**`hip-supported-db-deadlift`** · dumbbell/smith · **12 plans** · — (L)
`bicepsFemoris 1.0†` · `semiMembTend 1.0†` · `gluteMaxLower 1.0†` · `erectors 0.25`
Hip support removes the spinal cost — the reason it appears in so many plans.

**`cable-romanian-deadlift`** · cable · 0 plans · — (L) · as RDL, constant tension.

**`single-leg-rdl`** · dumbbell/kettlebell · 2 plans · **DL 25% per hand** (M)
`bicepsFemoris 1.0†` · `semiMembTend 1.0†` · `gluteMaxLower 1.0†` · `gluteMedius 0.5` · `erectors 0.5` · `obliques 0.5`

**`single-leg-dumbbell-romanian-deadlift`** · dumbbell · 0 plans · **DL 25% per hand** (M)
Identical to `single-leg-rdl`. **Duplicate — merge candidate.**

**`staggered-stance-rdl`** · dumbbell/kettlebell · 1 plan · **DL 40% per hand** (M)
`bicepsFemoris 1.0†` · `semiMembTend 1.0†` · `gluteMaxLower 1.0†` · `gluteMedius 0.25`

**`kettlebell-swing`** · kettlebell · 2 plans · — (—)
`gluteMaxUpper 1.0` · `gluteMaxLower 0.5` · `bicepsFemoris 0.5` · `semiMembTend 0.5` · `erectors 0.5`
Ballistic, concentric-dominant — poor hypertrophy stimulus, real conditioning one. Should never count as hamstring hypertrophy volume.

---

## 12. Attribution — hip extension (14)

Glute principle: **hip thrusts peak tension at short muscle length; squats and
lunges at long length.** They are complements, not substitutes, and a glute
plan needs both. Upper vs lower glute max separates by hip angle and abduction
component.

**`hip-thrust`** · machine · 4 plans · **SQ 100%** (M)
`gluteMaxUpper 1.0` · `gluteMaxLower 1.0` · `bicepsFemoris 0.5` · `semiMembTend 0.25` · `abdominalWall 0.25`

**`single-leg-machine-hip-thrust`** · machine · 6 plans · **SQ 30% per leg** (M)
`gluteMaxUpper 1.0` · `gluteMaxLower 1.0` · `gluteMedius 0.5` · `bicepsFemoris 0.5` · `obliques 0.25`

**`single-leg-hip-thrust`** · bodyweight/dumbbell · 1 plan · — (M) · as above.

**`b-stance-hip-thrust`** · machine · 0 plans · — (M)
`gluteMaxUpper 1.0` · `gluteMaxLower 1.0` · `gluteMedius 0.5` · `bicepsFemoris 0.5`

**`bench-hip-thrust`** · machine · 0 plans · — (M) · as `hip-thrust`.

**`dumbbell-hip-thrust`** · dumbbell/machine · 0 plans · — (M) · as `hip-thrust`.

**`glute-bridge`** · bodyweight/dumbbell · 1 plan · — (L)
`gluteMaxUpper 1.0` · `gluteMaxLower 0.5` · `bicepsFemoris 0.5` — shorter ROM than a thrust.

**`single-leg-glute-bridge`** · bodyweight · 0 plans · — (L)
`gluteMaxUpper 1.0` · `gluteMaxLower 0.5` · `gluteMedius 0.5` · `bicepsFemoris 0.5`

**`kas-glute-bridge`** · bodyweight · 0 plans · — (L)
`gluteMaxUpper 1.0` · `gluteMaxLower 0.25` — deliberately minimal ROM, top-range only.

**`frog-pump`** · bodyweight · 0 plans · — (—)
`gluteMaxUpper 1.0` · `gluteMedius 0.5` · `adductors 0.25` — abducted, externally rotated.

**`glute-pump-finisher`** · bodyweight · 0 plans · — (—)
`gluteMaxUpper 1.0` · `gluteMaxLower 0.25`. No distinguishing content vs `frog-pump`/`kas-glute-bridge`; candidate for retirement.

**`cable-pull-through`** · cable · 0 plans · — (L)
`gluteMaxLower 1.0†` · `gluteMaxUpper 0.5` · `bicepsFemoris 0.5` · `semiMembTend 0.5` · `erectors 0.25`

**`45-back-extension`** · machine · 0 plans · — (M)
`erectors 1.0` · `gluteMaxLower 1.0` · `bicepsFemoris 0.5` · `semiMembTend 0.5`
**The library's only direct erector exercise**, and no plan uses it. Erector volume across the whole portfolio comes entirely as a by-product of deadlifting.

**`reverse-hyperextension`** · machine · 0 plans · — (L)
`gluteMaxLower 1.0` · `bicepsFemoris 0.5` · `semiMembTend 0.5` · `erectors 0.5`

---

## 13. Attribution — vertical pull (12)

Lat principle: `latsUpper` (costal/upper fibres) dominate in wide-grip overhead
pulling; `latsLower` (iliac fibres) in narrow/neutral and pullover-style
shoulder extension. `teresMajor` tracks lats closely but is pure shoulder
adduction/extension — it earns nothing from elbow flexion.

**`pull-up`** · pull-up-bar · 4 plans · **bodyweight** (anchor, H)
`latsUpper 1.0†` · `latsLower 0.5` · `teresMajor 1.0` · `bicepsLong 0.5` · `brachialis 0.5` · `rhomboids 0.5` · `trapLower 0.5` · `forearmFlexors 0.5` · `abdominalWall 0.25`

**`weighted-pull-up`** · pull-up-bar · 1 plan · **PU bodyweight + load** (H) · as `pull-up`.

**`chin-up`** · pull-up-bar · 1 plan · **PU 105%** (H)
`latsUpper 1.0†` · `latsLower 0.5` · `teresMajor 1.0` · `bicepsLong 1.0` · `bicepsShort 1.0` · `brachialis 0.5` · `trapLower 0.5` · `forearmFlexors 0.5`
Supinated grip makes this a genuine biceps builder — the only vertical pull where biceps is a prime mover.

**`weighted-chin-up`** · pull-up-bar/plate · 5 plans · **PU 105% + load** (H) · as `chin-up`.

**`assisted-pull-up`** · machine · 4 plans · **PU minus assist** (M) · as `pull-up`.

**`lat-pulldown`** · cable · **16 plans** · **PU ~85% of bodyweight** (M)
`latsUpper 1.0†` · `latsLower 0.5` · `teresMajor 1.0` · `bicepsLong 0.5` · `brachialis 0.5` · `rhomboids 0.5` · `trapLower 0.25` · `forearmFlexors 0.5`

**`overhand-mid-grip-pulldown`** · cable · 0 plans · — (M) · as `lat-pulldown`.

**`close-neutral-grip-lat-pulldown`** · cable · 0 plans · — (M)
`latsLower 1.0†` · `latsUpper 0.5` · `teresMajor 1.0` · `bicepsLong 0.5` · `brachialis 0.5` · `rhomboids 0.25`

**`hammer-pulldown`** · hammer-strength/cable · 11 plans · — (L) · as `lat-pulldown`.

**`hammer-underhand-pulldown`** · hammer-strength/cable · 0 plans · — (L)
`latsLower 1.0†` · `teresMajor 1.0` · `bicepsLong 1.0` · `bicepsShort 0.5` · `brachialis 0.5`

**`lat-prayer`** · cable · 3 plans · — (L)
`latsLower 1.0†` · `latsUpper 0.5` · `teresMajor 1.0` · `abdominalWall 0.25`
Straight-arm — no elbow flexion, so zero biceps. One of only two pure shoulder-extension lat movements.

**`dumbbell-pullover`** · dumbbell/kettlebell · 1 plan · — (M)
`latsLower 1.0†` · `latsUpper 0.5` · `teresMajor 1.0` · `pecLower 0.5†` · `tricepsLong 0.5` · `serratus 0.5` · `abdominalWall 0.25`

---

## 14. Attribution — horizontal pull (18)

**`barbell-row`** · barbell · 2 plans · **ROW 100%** (anchor, H; ≈ DL 60%)
`rhomboids 1.0` · `trapMid 1.0` · `latsLower 1.0` · `rearDelt 0.5` · `teresMajor 0.5` · `bicepsLong 0.5` · `brachialis 0.5` · `erectors 0.5` · `forearmFlexors 0.5` · `trapLower 0.25`

**`wide-grip-barbell-row`** · barbell · 0 plans · **ROW 92%** (M)
`rhomboids 1.0` · `trapMid 1.0` · `rearDelt 1.0` · `latsUpper 0.5` · `bicepsLong 0.25` · `erectors 0.5`
Wide + high elbow = rear delt and mid-trap over lat.

**`row`** — legacy stub → alias onto `barbell-row`.

**`dumbbell-seal-row`** · dumbbell · 0 plans · **ROW 70%** (M)
`rhomboids 1.0` · `trapMid 1.0` · `latsLower 0.5` · `rearDelt 0.5` · `bicepsLong 0.5` · `teresMajor 0.5`
Chest-supported: zero erector, zero cheating. The cleanest upper-back stimulus in the library — unused.

**`single-arm-dumbbell-row`** · dumbbell · 1 plan · **ROW 30% per hand** (M)
`latsLower 1.0` · `rhomboids 0.5` · `trapMid 0.5` · `teresMajor 0.5` · `rearDelt 0.25` · `bicepsLong 0.5` · `obliques 0.25`

**`bench-supported-one-arm-dumbbell-row`** · dumbbell · 1 plan · **ROW 30% per hand** (M) · as above, no obliques.

**`single-arm-hammer-row`** · hammer-strength · **16 plans** · — (L)
`latsLower 1.0†` · `rhomboids 0.5` · `trapMid 0.5` · `teresMajor 0.5` · `rearDelt 0.25` · `bicepsLong 0.5`

**`hammer-upper-row`** · hammer-strength · 10 plans · — (L)
`rhomboids 1.0` · `trapMid 1.0` · `rearDelt 1.0` · `latsUpper 0.5` · `bicepsLong 0.25`

**`hammer-lower-row`** · hammer-strength · 5 plans · — (L)
`latsLower 1.0†` · `teresMajor 1.0` · `rhomboids 0.5` · `trapMid 0.5` · `bicepsLong 0.5`

**`seated-cable-row`** · cable · 0 plans · **ROW 85%** (M)
`rhomboids 1.0` · `trapMid 1.0` · `latsLower 1.0` · `rearDelt 0.5` · `bicepsLong 0.5` · `erectors 0.25`

**`rope-cable-row`** · cable · 0 plans · — (M)
`rhomboids 1.0` · `trapMid 1.0` · `rearDelt 1.0` · `trapLower 0.5` · `latsUpper 0.25`

**`dual-cable-high-row`** · cable · 0 plans · — (M)
`rhomboids 1.0` · `trapMid 1.0` · `rearDelt 1.0` · `latsUpper 0.5` · `trapLower 0.25`

**`single-arm-cable-row`** · cable · 0 plans · — (M) · as `single-arm-dumbbell-row`.

**`kneeling-one-arm-cable-row`** · cable · 0 plans · — (M)
`latsLower 1.0` · `rhomboids 0.5` · `teresMajor 0.5` · `obliques 0.5` · `abdominalWall 0.5`

**`half-kneeling-rotational-row`** · cable · 0 plans · — (L)
`latsLower 0.5` · `rhomboids 0.5` · `obliques 1.0` · `abdominalWall 0.5`

**`inverted-row`** · bodyweight/barbell · 0 plans · **≈ 60% bodyweight** (M)
`rhomboids 1.0` · `trapMid 1.0` · `latsLower 0.5` · `rearDelt 0.5` · `bicepsLong 0.5` · `abdominalWall 0.5`

**`trx-body-row`** · trx/bodyweight · 1 plan · — (L) · as `inverted-row`.

**`shrug`** · barbell/dumbbell · 0 plans · **DL 60%** (M)
`trapUpper 1.0` · `trapMid 0.25` · `forearmFlexors 0.5`
Legacy stub, but the **only** dedicated upper-trap movement in the library. Should be promoted to a real entry rather than aliased away.

---

## 15. Running coverage findings

Added to §6:

5. **Rectus femoris is barely trained anywhere.** It is a prime mover in only 4
   movements (`leg-extension`, both sissy variants, `reverse-nordic-curl`), and
   one of those is misfiled as a hamstring exercise. Squat-and-lunge quad
   coverage leaves RF close to untrained.

6. **`reverse-nordic-curl` is attributed to hamstrings and filed as knee
   flexion.** It is a loaded knee *extension*. Any plan counting it as
   hamstring volume is counting zero.

7. **Adductors have no dedicated loader in use.** `sumo-deadlift` is the
   library's best adductor movement (0 plans), the Copenhagens are unreachable,
   and `hip-adduction` is pool-only. Adductor volume across the entire
   portfolio is incidental to squatting.

8. **Erectors have exactly one direct exercise** (`45-back-extension`, 0 plans)
   and `reverse-hyperextension` (0 plans). All erector work is a deadlift
   by-product.

9. **Upper traps have one movement** (`shrug`) and it is a legacy stub used by
   no plan.

10. **More duplicate pairs found**, same split-history risk as the leg curls:
    `heel-elevated-goblet-squat` / `goblet-heel-elevated-squat` (both live, 8
    and 3 plans), `romanian-deadlift` / `barbell-romanian-deadlift` (15 and 2),
    `single-leg-rdl` / `single-leg-dumbbell-romanian-deadlift`,
    `walking-lunge` / `dumbbell-walking-lunge`, `paused-squat` /
    `paused-back-squat`, `dip` / `bodyweight-dip`.

---

## 16. Attribution — incline press (3)

The entire upper-pec inventory of the library. Three exercises, one of which
carries 20 plans on its own.

**`incline-dumbbell-bench-press`** · dumbbell · **20 plans** · **BP 65%** total, *32% per hand* (H)
`pecUpper 1.0†` · `pecLower 0.5` · `frontDelt 1.0` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `tricepsLong 0.25` · `subscapularis 0.25`
Note `frontDelt 1.0` — at 30–45° the front delt is a prime mover, not a helper. Plans stacking incline press *and* overhead press on the same day are double-dipping front delt without knowing it.

**`incline-barbell-bench-press`** · barbell · 2 plans · **BP 82%** (H)
`pecUpper 1.0†` · `pecLower 0.5` · `frontDelt 1.0` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `tricepsLong 0.25`

**`30-smith-incline-bench-press`** · smith · 1 plan · **BP 85%** (L)
`pecUpper 1.0†` · `pecLower 0.5` · `frontDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5`
Fixed bar path removes stabilisation, so front delt drops.

---

## 17. Attribution — vertical press (10)

**`standing-barbell-military-press`** · barbell · 5 plans · **OHP 100%** (anchor, H; ≈ BP 62%)
`frontDelt 1.0` · `sideDelt 0.5` · `tricepsLong 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `trapUpper 0.5` · `serratus 0.5` · `abdominalWall 0.5` · `erectors 0.25` · `pecUpper 0.25`

**`shoulder-press`** — legacy stub → alias onto `standing-barbell-military-press`.

**`behind-the-neck-press`** · barbell · 0 plans · **OHP 85%** (M)
`frontDelt 0.5` · `sideDelt 1.0` · `trapUpper 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `infraspinatus 0.25`
Genuinely more side-delt than a front press — worth deploying, with the mobility caveat.

**`seated-dumbbell-shoulder-press`** · dumbbell · **16 plans** · **OHP 72%** total (H)
`frontDelt 1.0` · `sideDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `tricepsLong 0.25` · `serratus 0.25`

**`arnold-press`** · dumbbell · 0 plans · **OHP 60%** (M)
`frontDelt 1.0` · `sideDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `subscapularis 0.25`

**`smith-overhead-press`** · smith/machine · 0 plans · **OHP 95%** (L)
`frontDelt 1.0` · `sideDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5`

**`one-arm-braced-db-press`** · dumbbell · 1 plan · **OHP 40% per hand** (M)
`frontDelt 1.0` · `sideDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `obliques 0.25`
Bracing removes the trunk cost that makes the standing single-arm version useful.

**`single-arm-standing-press`** · dumbbell/kettlebell · 1 plan · **OHP 38% per hand** (M)
`frontDelt 1.0` · `sideDelt 0.5` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `obliques 1.0` · `abdominalWall 0.5` · `gluteMedius 0.25`

**`kettlebell-shoulder-press`** · kettlebell · 0 plans · **OHP 38% per hand** (M)
`frontDelt 1.0` · `sideDelt 0.5` · `tricepsLong 0.5` · `tricepsLateral 0.5` · `abdominalWall 0.5`

**`wall-slide`** · bodyweight/bands · 0 plans · — (—)
`trapLower 1.0` · `serratus 1.0` · `infraspinatus 0.25`
**Misattributed** as `frontDelt`. It is a scapular-upward-rotation drill; it trains lower trap and serratus and essentially no front delt.

---

## 18. Attribution — shoulder abduction (7)

**`lateral-raise`** · dumbbell · **17 plans** · **— ** (L)
`sideDelt 1.0` · `frontDelt 0.25` · `trapUpper 0.25`

**`cable-lateral-raise`** · cable · 8 plans · — (L)
`sideDelt 1.0†` · `frontDelt 0.25` · `trapUpper 0.25`
Cable keeps tension at the bottom where the dumbbell has none — meaningfully better, and correctly the choice in Overhead Dominion.

**`seated-dumbbell-lateral-raise`** · dumbbell · 3 plans · — (L)
`sideDelt 1.0` · `trapUpper 0.1` — seated removes the leg drive/cheat.

**`leaning-one-arm-lateral-raise`** · dumbbell · 1 plan · — (L)
`sideDelt 1.0†` · `trapUpper 0.1`
**Canonical** — absorbs `leaning-single-arm-dumbbell-lateral-raise`. Leaning lengthens the side delt at the bottom.

**`single-arm-lateral-raise`** · dumbbell/kettlebell · 0 plans · — (L)
`sideDelt 1.0` · `frontDelt 0.25` · `trapUpper 0.25` — no lean. Kept distinct.

**`lying-cable-lat-raise`** · cable · 0 plans · — (L)
`sideDelt 1.0†` · `trapUpper 0.1`

---

## 19. Attribution — shoulder horizontal abduction (12)

Twelve rear-delt movements; **two are used by any plan**. Rear delt is the
best-stocked and least-deployed shelf in the library.

**`rear-delt-fly`** · rear-delt-machine · 8 plans · — (L)
`rearDelt 1.0` · `rhomboids 0.5` · `trapMid 0.5` · `infraspinatus 0.25`

**`single-arm-reverse-pec-deck`** · pec-deck · **15 plans** · — (L)
`rearDelt 1.0†` · `rhomboids 0.5` · `trapMid 0.5` · `infraspinatus 0.25`

**`reverse-pec-deck`** · pec-deck · 0 plans · — (L) · as above, bilateral.

**`bent-over-rear-delt-row`** · dumbbell · 1 plan · — (M)
`rearDelt 1.0` · `rhomboids 1.0` · `trapMid 1.0` · `erectors 0.25`

**`side-lying-rear-delt-fly`** · rear-delt-machine · 0 plans · — (L)
`rearDelt 1.0†` · `infraspinatus 0.25` — strict, gravity-aligned through the full arc.

**`face-pulls`** · cable · 0 plans · — (L)
`rearDelt 1.0` · `infraspinatus 0.5` · `trapMid 0.5` · `trapLower 0.5` · `rhomboids 0.5`

**`high-elbow-facepulls`** · cable · 0 plans · — (L) · as `face-pulls`, `trapLower 0.5`.

**`rear-delt-rope-pulls-to-face`** · cable · 0 plans · — (L) · as `face-pulls`. Third near-identical face-pull entry.

**`rear-delt-burnout`** · cable · 0 plans · — (—) · `rearDelt 1.0`. No distinguishing content; retirement candidate.

**`band-pull-aparts`** · bands · 0 plans · — (—)
`rearDelt 1.0` · `rhomboids 0.5` · `trapMid 0.5` · `infraspinatus 0.25`

**`y-raise`** · cable · 0 plans · — (L)
`trapLower 1.0` · `rearDelt 0.5` · `serratus 0.25`
**Reattributed** from `rearDelt` primary. The Y-raise is the library's best lower-trap movement — the only other one is `face-pulls` at 0.5.

**`around-the-worlds`** · cable · 0 plans · — (L)
`pecUpper 1.0†` · `frontDelt 1.0` · `sideDelt 0.5` · `rearDelt 0.1`
**Reattributed** from `rearDelt` primary — it is a chest/front-delt sweep and was contributing false rear-delt volume.

---

## 20. Attribution — elbow flexion (11)

Biceps principle: the **long head** crosses the shoulder, so it is loaded at
length only when the elbow is *behind* the torso (incline, Bayesian) and
shortened in preacher/spider work. The **short head** dominates when the
shoulder is flexed. `brachialis` responds to neutral/pronated grips and is
what actually adds arm thickness.

**`standing-straight-bar-curl`** · barbell · 2 plans · **CURL 100%** (anchor, H)
`bicepsLong 1.0` · `bicepsShort 1.0` · `brachialis 0.5` · `forearmFlexors 0.5` · `frontDelt 0.25`

**`straight-bar-cable-curl`** · cable/barbell · 0 plans · **CURL 90%** (M) · as above, constant tension.

**`ezbar-preacher-curl`** · ez-bar · 1 plan · **CURL 70%** (M)
`bicepsShort 1.0` · `bicepsLong 0.5` · `brachialis 0.5` · `forearmFlexors 0.25`
Shoulder flexed onto the pad — long head shortened. The opposite end of the range from a Bayesian curl.

**`30-incline-lying-dumbbell-curl`** · dumbbell · 2 plans · **CURL 45%** total (M)
`bicepsLong 1.0†` · `bicepsShort 0.5` · `brachialis 0.25`
Arm behind the torso — maximum long-head stretch.

**`bayesian-cable-curl`** · cable · 2 plans · — (L)
`bicepsLong 1.0†` · `bicepsShort 0.5` · `brachialis 0.25`
Same lengthened position with cable tension held at the bottom.

**`cable-curl`** · cable · 9 plans · — (L)
`bicepsLong 0.5` · `bicepsShort 1.0` · `brachialis 0.5` · `forearmFlexors 0.25`

**`low-pulley-cable-curl`** · cable · 0 plans · — (L) · as `cable-curl`.

**`hammer-curl`** · dumbbell · **16 plans** · **CURL 55%** total (M)
`brachialis 1.0` · `brachioradialis 1.0` · `bicepsLong 0.5` · `bicepsShort 0.25` · `forearmFlexors 0.5`

**`dumbbell-hammer-curl`** · dumbbell · 5 plans · **CURL 55%** (M)
Identical to `hammer-curl`. **Duplicate — merge candidate**, split 16 / 5 across plans.

**`rope-hammer-curl`** · cable · 1 plan · — (L) · as `hammer-curl`, constant tension.

**`reverse-curl`** · ez-bar/barbell · 3 plans · **CURL 60%** (M)
`brachioradialis 1.0` · `brachialis 1.0` · `forearmExtensors 1.0` · `bicepsLong 0.25`
The library's only real forearm-extensor loader.

---

## 21. Attribution — elbow extension (14)

Triceps principle: the **long head** crosses the shoulder and is loaded at
length only in *overhead* positions. Pressdowns train it short and barely at
all. A plan whose entire triceps volume is pressdowns is training two of three
heads — which the old undifferentiated `triceps` key made invisible.

**`ezbar-skullcrushers`** · ez-bar · 0 plans · **SKULL 100%** (anchor, H)
`tricepsLong 1.0†` · `tricepsLateral 1.0` · `tricepsMedial 1.0`

**`banded-ezbar-bar-skullcrushers`** · ez-bar/bands · 0 plans · **SKULL 85%** (L) · as above.

**`lying-dumbbell-skullcrusher`** · dumbbell · 2 plans · **SKULL 75%** (M) · as above.

**`french-press`** · ez-bar · 1 plan · **SKULL 80%** (M)
`tricepsLong 1.0†` · `tricepsLateral 0.5` · `tricepsMedial 0.5` — fully overhead, deepest long-head stretch.

**`overhead-tricep-extension`** · dumbbell · 1 plan · **SKULL 70%** (M) · as `french-press`.

**`one-dumbbell-overhead-triceps-extension`** · dumbbell · 0 plans · **SKULL 70%** (M) · as `french-press`.

**`single-arm-overhead-triceps-extension`** · dumbbell/kettlebell · 1 plan · **SKULL 30% per hand** (M) · as `french-press`.

**`single-arm-overhead-extension`** · dumbbell · 0 plans · — (M)
Identical to `single-arm-overhead-triceps-extension`. **Duplicate — merge candidate.**

**`cable-triceps-extension`** · cable · **22 plans** · — (L)
`tricepsLong 1.0†` · `tricepsLateral 0.5` · `tricepsMedial 0.5`
Aliases say *"Overhead Cable Extension"* — so this is the overhead variant and correctly gets the long head. **The most-used isolation movement in the entire portfolio.** Worth confirming plans actually intend overhead, because the display name alone reads as a generic pressdown.

**`rope-pressdown`** · cable · 11 plans · — (L)
`tricepsLateral 1.0` · `tricepsMedial 1.0` · `tricepsLong 0.25`

**`triangle-pushdown`** · cable · 0 plans · — (L) · as `rope-pressdown`.

**`tricep-extension`** — legacy stub → alias onto `rope-pressdown`.

**`rolling-dumbbell-tricep-extension`** · dumbbell · 0 plans · **SKULL 70%** (M)
`tricepsLong 1.0†` · `tricepsLateral 0.5` · `tricepsMedial 0.5` · `latsLower 0.25`

**`heavy-rolling-tricep-extension`** · dumbbell · 0 plans · **SKULL 75%** (M)
Identical. **Duplicate — merge candidate** ("heavy" is a loading cue, not a variation).

---

## 22. Attribution — calf (11)

Head principle: **gastrocnemius crosses the knee**, so it is loaded only with
the knee near-straight (standing). **Soleus** dominates when the knee is bent
(seated). A plan with only standing raises trains soleus poorly and vice versa.
Nothing in the library is a seated calf raise on a machine — see §24.

**`standing-calf-raise`** · machine · 9 plans · **— ** (L)
`gastrocnemius 1.0†` · `soleus 0.5`

**`hack-calf-raise`** · hack-squat · **17 plans** · — (L)
`gastrocnemius 1.0†` · `soleus 0.5` — knee straight on a hack sled.

**`standing-calf-raise-off-step`** · machine · 0 plans · — (L) · as standing, deeper stretch.

**`smith-calf-raise`** · smith/machine · 0 plans · — (L) · as standing.

**`standing-dumbbell-kb-calf-raise`** · dumbbell/kettlebell · 0 plans · — (L) · as standing.

**`calf-raise`** · machine · 2 plans · — (L) · generic; as standing.

**`calf`** — legacy stub → alias onto `standing-calf-raise`.

**`leg-press-calf-raise`** · machine · 1 plan · — (L)
`gastrocnemius 1.0†` · `soleus 0.5` — knee straight on the sled.

**`seated-dumbbell-calf-raise`** · dumbbell · 0 plans · — (L)
`soleus 1.0` · `gastrocnemius 0.25`
**The library's only knee-bent calf movement**, currently unreachable. Soleus is otherwise untrained across all 36 plans.

**`single-leg-cable-calf-raise`** · cable · 0 plans · — (L) · `gastrocnemius 1.0†` · `soleus 0.5`.

**`loaded-ankle-rock`** · dumbbell · 0 plans · — (—)
`tibialisAnterior 1.0` · `soleus 0.25`
**Misattributed** as `calves`. It is the **only** tibialis anterior exercise in the library, and it is filed as a calf movement in a mobility pool. Tibialis volume across the portfolio is zero.

---

## 23. Attribution — core & carry (16)

**`ab-wheel`** · ab-wheel · **18 plans** · — (—)
`absUpper 1.0†` · `absLower 1.0†` · `abdominalWall 1.0` · `obliques 0.5` · `latsLower 0.25`
**Canonical** — absorbs `ab-wheel-rollout`.

**`plank`** · bodyweight · 0 plans · — (—)
`abdominalWall 1.0` · `absUpper 0.5` · `obliques 0.5` — isometric; no lengthened work.

**`dragon-flags`** · bodyweight · 0 plans · — (—)
`absLower 1.0†` · `absUpper 1.0` · `abdominalWall 1.0` · `obliques 0.5`

**`dead-hang`** · pull-up-bar · 0 plans · — (—)
`forearmFlexors 1.0` · `latsUpper 0.25` · `abdominalWall 0.25` — grip, correctly primary.

**`dead-hang-plank`** · pull-up-bar · unreachable · — (—) · `abdominalWall 1.0` · `forearmFlexors 0.5`. Retirement candidate.

**`cable-crunch`** · cable · 5 plans · — (L)
`absUpper 1.0` · `absLower 0.5` · `obliques 0.5`
**Canonical** — absorbs `cable-crunches`.

**`weighted-crunch`** · bodyweight · 0 plans · — (—) · `absUpper 1.0` · `obliques 0.25`.

**`bench-reverse-crunch`** · bodyweight · 0 plans · — (—) · `absLower 1.0` · `absUpper 0.5` · `obliques 0.25`.

**`hanging-knee-raise`** · pull-up-bar · 3 plans · — (—)
`absLower 1.0` · `absUpper 0.5` · `obliques 0.5` · `forearmFlexors 0.5`

**`hanging-leg-raise`** · pull-up-bar · 3 plans · — (—)
`absLower 1.0†` · `absUpper 0.5` · `obliques 0.5` · `forearmFlexors 0.5` · `rectusFemoris 0.25`

**`suitcase-carry`** · dumbbell/kettlebell · 3 plans · **DL 25% per hand** (M)
`obliques 1.0` · `abdominalWall 0.5` · `forearmFlexors 1.0` · `trapUpper 0.5` · `gluteMedius 0.5`

**`suitcase-hold`** · dumbbell/kettlebell · 2 plans · **DL 30% per hand** (M) · as above, isometric.

**`farmer-carry`** · dumbbell/kettlebell · 2 plans · **DL 50% total** (M)
`forearmFlexors 1.0` · `trapUpper 1.0` · `abdominalWall 0.5` · `gluteMedius 0.25`

**`farmer-hold`** · dumbbell · 0 plans · **DL 55% total** (M) · as above, isometric.

**`turkish-get-up`** · kettlebell · 0 plans · — (—)
`obliques 1.0` · `abdominalWall 1.0` · `frontDelt 0.5` · `subscapularis 0.5` · `infraspinatus 0.25` · `gluteMaxLower 0.25`

**`apex-access-placeholder`** · bodyweight · 1 plan · — · not a real movement; assessment gate for Apex Predator. Exclude from all volume maths.

---

## 24. Attribution — hip abduction / adduction / rotation / mobility (9)

**`machine-hip-abduction`** · machine · 4 plans · — (L)
`gluteMedius 1.0` · `gluteMaxUpper 0.5` · `tfl 0.5`
The only abduction movement any plan uses.

**`side-glute-medius-hip-thrust`** · bodyweight/bands · 0 plans · — (—)
`gluteMedius 1.0` · `gluteMaxUpper 0.5` · `obliques 0.25`

**`hip-adduction`** · machine · 0 plans · — (L) · `adductors 1.0`.

**`copenhagen-plank`** · bodyweight/bench · unreachable · — (—)
`adductors 1.0` · `obliques 0.5` · `abdominalWall 0.5`

**`copenhagen-raise`** · bodyweight/bench · unreachable · — (—)
`adductors 1.0†` · `obliques 0.5` · `abdominalWall 0.5`
Best evidence base for adductor strength and groin-injury resilience in the library. Unreachable.

**`single-arm-external-rotation`** · cable/dumbbell · 2 plans · — (L)
`infraspinatus 1.0` · `rearDelt 0.25`
The library's only external-rotation movement, and the only meaningful `infraspinatus` loader above 0.5.

**`loaded-90-90-transition`** · bodyweight/plate · 0 plans · — (—)
`gluteMedius 0.5` · `adductors 0.5` · `gluteMaxLower 0.25` — mobility, not hypertrophy volume.

**`open-book-rotation`** · bodyweight · 0 plans · — (—)
`obliques 0.25` · `trapMid 0.25` — mobility. Should not count as core volume.

**`wall-slide`** — see §17. Reattributed to `trapLower` / `serratus`.

---

## 25. Complete coverage findings

Consolidating §6 and §15 across all 232 movements.

### Attribution bugs (wrong data, corrupts volume maths)

| Exercise | Current | Correct | Impact |
|---|---|---|---|
| `reverse-nordic-curl` | `hamstrings`, knee-flexion | `rectusFemoris`+vasti, knee-extension | Quadfather counts it as hamstring volume; it delivers none |
| `around-the-worlds` | `rearDelt` | `pecUpper`/`frontDelt` | False rear-delt volume |
| `y-raise` | `rearDelt` | `trapLower` | Hides the only good lower-trap option |
| `wall-slide` | `frontDelt` | `trapLower`/`serratus` | Mobility drill counted as pressing |
| `loaded-ankle-rock` | `calves` | `tibialisAnterior` | Hides the only tibialis exercise |
| `high-foot-leg-press` | squat pattern | hip-extension | Counted as quad work; it is glute/hamstring |
| all presses | `triceps` undifferentiated | split by head | Long head credited for pressdown-only plans |

### Muscles with no adequate loader in any plan

| Muscle | Movements available | Movements *used* |
|---|---|---|
| **Soleus** | 1 (`seated-dumbbell-calf-raise`) | **0** — unreachable |
| **Tibialis anterior** | 1 (`loaded-ankle-rock`) | **0** — misfiled |
| **Adductors (direct)** | 4 (`hip-adduction`, 2 Copenhagens, `sumo-deadlift`) | **0** |
| **Erectors (direct)** | 2 (`45-back-extension`, `reverse-hyperextension`) | **0** |
| **Upper traps (direct)** | 1 (`shrug`, legacy stub) | **0** |
| **Lower traps (direct)** | 2 (`y-raise`, `face-pulls`) | **0** |
| **Rectus femoris** | 4 | 3, thinly |
| **Serratus (direct)** | 1 (`wall-slide`) | **0** |
| **Upper pec (isolation)** | 1 (`low-to-high-cable-fly`) | **0** |

### Concentration risk

Eleven movements carry a disproportionate share of the entire portfolio:
`cable-triceps-extension` (22 plans), `incline-dumbbell-bench-press` (20),
`ab-wheel` (18), `hack-squat` (17), `lateral-raise` (17), `leg-extension` (17),
`hack-calf-raise` (17), `hammer-curl` (16), `lat-pulldown` (16),
`seated-hamstring-curl` (16), `single-arm-hammer-row` (16),
`seated-dumbbell-shoulder-press` (16), `hammer-chest-press` (16).

Thirteen movements appear in ~45% of plans. This is the mechanical cause of the
sameness you flagged — plans differ in set/rep schemes far more than in
movement selection.

### Duplicate pairs still splitting history

`heel-elevated-goblet-squat` / `goblet-heel-elevated-squat` (8 / 3 plans) ·
`romanian-deadlift` / `barbell-romanian-deadlift` (15 / 2) · `hammer-curl` /
`dumbbell-hammer-curl` (16 / 5) · `single-leg-rdl` /
`single-leg-dumbbell-romanian-deadlift` · `walking-lunge` /
`dumbbell-walking-lunge` · `paused-squat` / `paused-back-squat` · `dip` /
`bodyweight-dip` · `rolling-dumbbell-tricep-extension` /
`heavy-rolling-tricep-extension` · `single-arm-overhead-extension` /
`single-arm-overhead-triceps-extension`

The first three are the damaging ones — both sides are live, in different
plans, with no alias linking them.

### Proposed additions (§ for your review)

Filling the zero-coverage rows, gym inventory permitting:

1. **Seated calf raise (machine)** — soleus has no trained loader at all.
2. **Tibialis raise** (bodyweight or dedicated) — promote `loaded-ankle-rock`
   out of mobility, or add a proper one.
3. **Seated machine hip adduction** — `hip-adduction` exists; it needs to be
   deployed, plus the Copenhagens made reachable.
4. **Back extension / 45° hyper** — `45-back-extension` exists and is unused.
5. **Barbell/DB shrug** — promote `shrug` from legacy stub to a real entry.
6. **Incline/reclined-seat leg extension** — RF at length.
7. **Cable upper-chest fly** — `low-to-high-cable-fly` exists and is unused.

**Six of the seven gaps need no new library entries at all** — the movements
are already there and simply unused. That is the headline for the per-plan
audits: the portfolio's coverage problem is deployment, not inventory.

