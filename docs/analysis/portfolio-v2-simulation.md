# Portfolio review — votes, variety, set shape, and the per-plan decision record

**Date:** 2026-08-16 · **Scope:** all 36 catalogue plans, all reviewed · **Status:** analysis and decision record; authorises no code beyond the two library fixes noted in §2

Four layers of simulation over the shipped catalogue, all measured on the v2
audit's own axes:

| Layer | What it is | File |
|---|---|---|
| Round 1 | The post-audit votes | `scripts/v2-change-map.ts` |
| Round 2 | Variety assignment + set-shape policy | `scripts/v2-round2-map.ts` |
| Round 3 | Per-plan decisions taken with the owner, in ten batches | `scripts/v3-owner-decisions.ts` |
| Standing | Set-shape flag check, run on every review | `scripts/review-flags.ts` |

Companion chart: `docs/analysis/portfolio-v2-review.html`.

---

## 1. Where the catalogue landed

| | Shipped | Round 1 | Final |
|---|--:|--:|--:|
| Median weekly sets | 69 | 68 | 74 |
| Median sets/session | 18.5 | 18.5 | 19 |
| Median distinct exercises | 21 | 22 | **23** |
| Variety density (per 10 sets) | 3.08 | 3.08 | **3.33** |
| Median systemic | 109 | 112 | 112 |
| Median axial | 31 | 30 | **28** |
| Median axial per set | 0.46 | 0.40 | **0.38** |
| Mean pairwise plan similarity | 0.176 | 0.167 | **0.130** |
| Plan pairs sharing >50% of movements | 53 | 35 | **1** |
| Distinct library movements in use | 182 | 183 | **191** of 232 |
| 1-set slots (28 plans the floor applies to) | 49 | 49 | **3** |
| Unexplained set-shape flags | — | — | **0** |

The single remaining near-clone pair is REDLINE–Iron Clock, and Iron Clock is
hidden from the catalogue.

**Round 1 was the problem, not the fix.** Its catalogue-wide rules put
`overhead-tricep-extension` into 22 plans (from 2) and `cable-crunch` into 17
(from 6), and pushed the Chimera–Oracle overlap *up* from 0.74 to 0.85. Rounds 2
and 3 spend the library instead of converging on it.

---

## 2. Corrections made during the review

Three things were wrong and were fixed. Two were in the analysis; **one is a
shipped-code defect that is still live**.

**Major muscle groups were double-counted.** `back` aggregates lats + upperBack
+ traps + lowerBack, and a row lists two of them as primary — so a 3-set row was
credited with six sets of back. Quads and hamstrings are single-muscle groups
and never inflate, which made every multi-muscle group look dominant. Each group
is now counted once per exercise. This reversed two findings: **Hamstring
Foundry and Workhorse both hold their specialisation**, and King of the Squat is
led by glutes, not back. **The same defect is live in
`src/lib/volumeAnalysis.ts`**, which `verify:volume` uses to gate new plans.

**`reverse-nordic-curl` was classified as a hamstring movement.** It is knee
*extension* under a lengthened quad. Fixed in `src/data/exercises/library.ts` —
now `knee-extension` with quads primary. This corrects the measured quad dose on
Quadfather, Lazarus and Bench Domination. `verify:library` passes (232
exercises, 94,513 references resolve).

**The preview user trains Mon/Wed/Fri.** Plans that reflow their template onto
the athlete's chosen days — Bench Domination's smart day assignment — reported
roughly half their real volume. Each plan is now handed a schedule matching the
days its own template uses.

---

## 3. The standing set-shape check

```bash
npx tsx scripts/review-flags.ts          # all plans
npx tsx scripts/review-flags.ts kali     # one plan
npx tsx scripts/review-flags.ts --json
```

Flags every slot at **one set** or **above three sets** in a session. Exemptions
are per plan *and* per movement, each naming the mechanic it protects, so a plan
that later grows a genuinely bad block still gets flagged.

**Current state: 149 flags, 149 explained, 0 to answer for.**

| Exemption class | Plans |
|---|---|
| Leads the session — the day's driver | all |
| Specialisation muscle | the ten specialisation plans, on their own muscle |
| One all-out work set is the identity | Blackout |
| PAP / cluster singles are the mechanic | Neural Overload |
| ME / AMRAP / top singles are the mechanic | the four legacy powerlifting plans |
| Antagonist supersets — both halves carry the same count | Purgatorio |
| Poliquin ratio lifts are structural anchors | Immaculate |
| The dip and pull families *are* the plan | Gravity Is Optional |
| Timed / density blocks, carries and holds | all — no second set exists |

---

## 4. The variety assignment (round 2)

The owner's list, applied per plan by what the plan is for.

| Movement | Rule applied |
|---|---|
| **Incline DB press** | Kept as the default. Moved to Smith incline on four SKUs where a fixed path is the point: Event Horizon (joint-accommodating), Kali (technique under a deficit), Lazarus (returning lifter), Blackout (one maximal set, trained alone) |
| **Calves** | Hack or standing only, everywhere. Converted leg-press calf raises, the generic machine calf, and Adventure's Smith / off-step / single-leg cable versions — the last of which round 1 had itself just added |
| **Overhead triceps extension** | Split three ways. **French press** where elbow stress is affordable (Cathedral, Arms Race, Event Horizon, Purgatorio, Tenfold, Super Mutant). **Rolling extensions** on strength SKUs (King of the Squat, Neural Overload, Atlas, Blackout, Athena, Oracle, Chimera). Overhead kept where fatigue is tight |
| **Leg extension** | No substitute, so it stays. Progressions beside it: supported sissy squat (Event Horizon, Cathedral), banded/weighted reverse Nordic (Lazarus) |
| **Seated DB shoulder press** | Seated barbell on strength-leaning plans; seated hammer press on machine houses; single-arm landmine press on Chimera and Apex |
| **Lat pulldown** | Grip and implement variety: close-neutral, overhand mid-grip, lat prayer, pull-ups on advanced SKUs, and a bench-supported single-arm cable pulldown |
| **Hammer curl** | Replaced almost everywhere. **Kept** on Purgatorio (superset — a mobile implement beside a station is the carve-out), House of Iron (minimal equipment) and Adventure's pairs |
| **SA reverse pec deck** | Moved off the pec-deck station to side-lying or bench-supported DB rear-delt work, on twelve plans |
| **Lateral raise** | Spread across the cable and leaning families, widest on Overhead Dominion and Venus |

**Exempt as instructed:** Pain & Glory, Bench Domination, Trinary, Ritual of
Strength. Immaculate by IMM-V-pass, Skeleton by SKEL-V-pec.

### Set-shape policy

- **Floor:** every working slot gets at least 2 sets.
- **Cap:** accessory isolation slots capped at 3 unless the plan specialises in
  that muscle.
- Owner decisions apply **after** the policy and are not re-normalised — a
  per-plan judgement call beats a catalogue-wide default.

### Eight proposed library ids

Defined in `v2-round2-map.ts` as simulation-only entries merged into a local
resolver, so they score on the same basis as real movements:

`seated-hammer-shoulder-press` · `single-arm-landmine-press` · `machine-curl` ·
`behind-the-back-cable-lateral-raise` ·
`bench-supported-single-arm-cable-pulldown` · `wide-grip-cable-row` ·
`bench-supported-dumbbell-rear-delt-fly`

Plus the five round 1 needed: `machine-crunch`, side hanging knee raise,
feet-elevated push-up, chest-supported cable row, SL glute leg press.

---

## 5. Decisions by batch

### Batch 1 — where the dose did not match the promise

**Pencilneck** — content unchanged, retagged **intermediate**. *Open:* the card
still declares fatigue 2 against a measured band 4.

**Cathedral** — a cable fly at a different angle on each of the three chest days
(low-to-high D1, seated mid D3, standing mid D4) at 2 sets, plus the Smith
incline promoted to a 4-set anchor. Chest 20 → 28. *Open:* systemic only moved
89 → 91, so it still measures band 1 against a card claiming 3 — lightweight
cable work is systemically cheap by design.

**King of the Squat** — implements **KOS-X9**: three identical paused-bench slots
(14 sets of one movement) become long-pause / wide-grip / paused max. Restores a
press KOS-X10 had deleted. Reverses round 1's own back-volume addition, which
misread KOS-X11. Exercises 17 → 22.

### Batch 2 — the fatigue-rating mismatches

**Kali** — one second pushable movement per day at 2 sets, chosen failure-safe so
it can be taken hard on a deficit: leg press, pec deck, hack squat, dip. Band
1 → 2, chest 5 → 9, quads 7 → 11.

**Blackout** — card only. Fatigue **3 → 2**, experience **advanced →
intermediate**. *Engine:* BLK-RB-I / BLK-RB-X remain the real dependency.

**Iron Clock** — **hidden from the catalogue**, superseding IC-V-retire.
`PLAN_REGISTRY` stays intact so nobody mid-plan is stranded.

### Batch 3 — the over-three flags

A 4-set block behind the day's opener is two exercises' worth of work in one
slot. Volume kept, block split into two movements at 2 sets.

| Plan | Split | Exercises |
|---|---|---|
| Event Horizon | SA hammer row + DB seal row · hammer chest + machine press/fly | 24 → 28 |
| Project Chimera | SA hammer row + bench-supported DB row · incline DB + Smith incline | 23 → 27 |
| Oracle | SA hammer row + seated cable row · hammer pulldown + SA cable pulldown | 24 → 26 |
| Hamstring Foundry | hammer lower row + rope cable row | 24 |
| Overhead Dominion | SA DB row + lat prayer | 21 → 24 |
| Monolith | hammer pulldown 4 → 3 (owner: drop, do not split) | 18 |
| Super Mutant | SL machine hip thrust (20 weekly sets of one accessory) → SL FFE Bulgarian + walking lunges | 12 → 13 |

The Chimera/Oracle splits cleared the last near-clone pair.

### Batch 4 — the beginner-facing plans

**House of Iron** — content unchanged. Fatigue **2 → 3**, and the prerequisite
now names what a one-implement plan demands: the ability to hold a solid
position under load, with no machine to fall back on (stability 2.32, highest in
the catalogue; 97% of sets not failure-safe).

**Apex Predator** — left as-is. *Open:* the round-2 landmine press rates
`avoid` for failure on a plan open to beginners.

**Venus Rising** — re-aimed as an entry-level plan. Goal drops `specialisation`.
Full exercise pass: FFE Bulgarian → leg press, hanging knee raise → cable
crunch, behind-the-back lateral → cable lateral, overhead extension → rope
pressdown, barbell RDL → cable RDL, deficit reverse lunge → b-stance hip thrust,
third SA row → hammer pulldown, seated DB press → seated hammer press, third
lateral → seated cable row, plus a plank. **Max stability 3 → 2**, systemic/set
1.35 → 1.23, back 9 → 12, core 2 → 4.
*Open:* the RDL swap supersedes VEN-V-ham, and a delt slot was traded for a row.

### Batch 5 — the on-ramp and return cluster

**Athena** — left as-is. *Open:* axial 49 at 0.71/set is third highest in the
catalogue, driven by a 4-set barbell squat followed by a 3-set RDL on D1, on a
plan gated only by "basic barbell competence".

**The Minimum** — left as-is. It stays a true minimum: every slot at 2 sets, zero
groups in a growth band, both honest for a declared 2-day MEV plan.

**Lazarus** — ab wheel (stability 3, and the only core work) → cable crunch;
machine press/fly combo and a plank added to a D3 that had six slots and no
pressing. Chest 6 → 9, core 2 → 4. The press/fly rather than a pec deck keeps
Lazarus off Blackout's roster — a pec deck had pushed that pair to 0.52.

### Batch 6 — the high-fatigue hypertrophy group

**Purgatorio** — both RDL blocks down a set. Glutes 22 → 20, off the only
over-MAV figure; groups in band 6 → 7. *Open:* card says fatigue 4, measures 3.

**Tenfold** — D4 trimmed 29 → 24 sets so the 10×10 day is no longer the longest
session. *Open:* dropping the hip-supported deadlift removes the plan's only
hinge pattern.

**Gravity Is Optional** — left as-is. Eight groups in band, everything twice
weekly, and axial 12 (0.15/set) is the lowest in the catalogue — a selling point
the card does not state.

### Batch 7 — the remaining specialisation plans

**Workhorse** — +3× hammer lower row on D1. Back 17 → **20**, clear of shoulders
at 16, and the shortest day gains a second back pattern.

**Quadfather** — core off D4 onto two exposures (2 sets D1, 3 sets D3), 2 → 5.
Library fix lands here: quads read 25.

**Arms Race — full overhaul.** Three-session rotation run every other day, with
the old heavy day relocated to the end as an optional fourth "go nuclear"
session.

| Day | Slots |
|---|---|
| D1 Volume + Legs *(21)* | 4× Close-Grip Bench · 4× Rope Hammer Curl · 3× Reverse Curl · 2× Rope Pressdown · 3× Hack Squat · 3× Standing Calf · 2× Hip-Supported DB DL |
| D2 Lengthened *(20)* | 4× Bayesian Cable Curl · 4× Rolling DB Tri Ext · 3× 30° Incline-Lying DB Curl · 2× French Press · 3× Bench-Supported SA Cable Pulldown · 2× Pec Deck · 2× BTB Cable Lateral |
| D3 Pump *(24)* | 4× Straight-Bar Curl · 4× Lying DB Skullcrusher · 3× Machine Curl · 2× Triangle Pushdown · 3× Heel-Elevated Goblet Squat · 3× Standing Calf · 3× Cable Crunch · 2× Seated Ham Curl |
| D4 Go Nuclear *(16, optional)* | **Tricep giant set** ×2 (BW dips 5 → rolling DB ext 10 → banded EZ skullcrushers 15) · **Biceps myo-rep**: 30° incline-lying DB curl, 30–40 reps + 3–4 cheat eccentrics · 3× Smith Incline · 3× Hammer Upper Row · 2× Rear Delt Fly |

Set spread is now 2×12 / 3×11 / 4×6 — the flat 3-set template is gone. No biceps
movement repeats inside D1–D3. Supersedes AR-RB-F ("4-day only").
*Engine:* rolling three-card scheduler; mandatory rest acknowledgement on
initiating Go Nuclear; the tricep giant set shared with Bench Domination; the
myo-rep load read as a percentage of the Lengthened day's logged weight.

### Batch 8 — the last non-legacy plans

**REDLINE** — every 1-set slot to 2. Triceps, calves and core all 2 → **4**; zero
single-set slots remain. Raw cost 65 → 82 sets, so **15 antagonist pairs** were
added across the week to buy the session time back (anchors stay straight sets;
swings and carries stay unpaired timed blocks). *Open:* fatigue now measures 4
against a declared 3 — the reverse of before, driven by the carries doubling.

**Atlas** — left as-is. *Open:* axial 1.00/set is the highest in the catalogue,
nearly triple the median, and D1 alone stacks four axially loaded slots. The card
names gym space and isolation preference but not the spine loading.

**Neural Overload** — round 1's orphan 1-set rear-delt fly on D4 (which survived
only because this plan is floor-exempt for its PAP singles) becomes a 3-set
wide-grip cable row on D1. Back 8 → **11**. D4 anchor recorded as a picker:
front / hack / stripper / safety-bar squat.

### Batch 9 — the legacy powerlifting plans, review only

**Bench Domination** — **zero direct back, biceps *and* triceps volume**, from
two separate causes: Weighted Pull-ups prescribes 0 sets (BD-E12 votes the fix),
*and* `Tricep Giant Set` is not a library id, so its work is invisible to every
volume check in the app. Also: the card declares frequency 4, the template
materialises **six** days.

**Pain & Glory** — internally consistent; axial 90 (1.22/set) is the highest
total in the catalogue and the card is honest about it. Back, glutes and
hamstrings over MAV while chest, biceps, calves and core sit under — **PG-11
already votes the optional fifth day that fixes exactly those groups**.

**Trinary** — axial 2.20/set, five times the median. Only 3 exercises
materialise: accessory work generates per weak-point bundle and never appears in
a template week, so no volume or coverage figure for this plan is trustworthy.

**Ritual of Strength** — the card declares frequency 5/6; **RIT-RB-F voted 3-day
default** and the plan materialises 3 days. Sessions are lopsided, 7 sets on D1
against 24 on D3.

### Batch 10 — final sweep, review only

**Skeleton** — shoulders, biceps and triceps get **zero** direct sets. Not
under-dosed, absent. Unique in the catalogue, and SKEL-V-pec explicitly
protected it.

**Peachy** — specialisation holds; biceps and triceps at zero are declared on the
card. D1 stacks three axially loaded squat/hinge patterns on a beginner-facing
plan with no prerequisite.

**30 Minute Adventure** — 63 reachable movements, all ten groups trained, ten
twice-plus. Best variety in the portfolio by a factor of two.

**Immaculate** — the **best-balanced plan in the catalogue**: eight of ten groups
in band, every group twice weekly, none missing, near-identical day lengths. Its
dependency is unchanged: IMM-RB-I, so all six structural ratios can fire.

---

## 6. Final per-plan matrix (Δ vs shipped)

`B` batch · `D` days · `Ex` distinct exercises · `Sys/set` fatigue density ·
`Band` groups in a growth dose · `2×+` groups trained twice weekly.

| Plan | B | D | Sets | Δ | /sess | Ex | Δ | Sys | Δ | Ax | Δ | Sys/set | Band | 2×+ |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| Bench Domination | 9 | 6 | 93 | · | 15.5 | 18 | +2 | 137 | · | 28 | · | 1.47 | 4 | 7 |
| Pencilneck Eradication Protocol | 1 | 4 | 91 | · | 22.8 | 35 | · | 147 | · | 45 | · | 1.62 | 4 | 10 |
| From Skeleton to Threat | 10 | 3 | 57 | · | 19.0 | 7 | · | 90 | · | 9 | · | 1.58 | 3 | 7 |
| Peachy | 10 | 4 | 68 | +4 | 17.0 | 24 | +1 | 107 | +4 | 34 | · | 1.57 | 5 | 8 |
| Pain & Glory | 9 | 4 | 74 | · | 18.5 | 13 | +2 | 141 | -3 | 90 | -6 | 1.91 | 2 | 9 |
| Trinary | 9 | 3 | 45 | · | 15.0 | 3 | · | 123 | · | 99 | · | 2.73 | 1 | 5 |
| Ritual of Strength | 9 | 3 | 44 | +5 | 14.7 | 10 | +2 | 97 | +5 | 60 | · | 2.20 | 4 | 6 |
| Super Mutant | 3 | 5 | 150 | · | 30.0 | 13 | +1 | 250 | +20 | 80 | · | 1.67 | 2 | 7 |
| 30 Minute Adventure | 10 | 3 | 60 | · | 19.9 | 63 | +2 | 86 | · | 19 | · | 1.45 | 4 | 10 |
| King of the Squat | 1 | 4 | 82 | +5 | 20.5 | 22 | +5 | 156 | +8 | 72 | · | 1.90 | 3 | 6 |
| Gravity Is Optional | 6 | 4 | 82 | · | 20.5 | 21 | +2 | 139 | -6 | 12 | -3 | 1.70 | 8 | 10 |
| Purgatorio | 6 | 4 | 79 | -12 | 19.8 | 23 | -1 | 119 | -32 | 30 | -22 | 1.51 | 7 | 10 |
| Immaculate (Re)Structure | 10 | 4 | 78 | · | 19.5 | 22 | -1 | 127 | · | 31 | · | 1.63 | 8 | 10 |
| Overhead Dominion | 3 | 4 | 81 | · | 20.3 | 24 | +3 | 115 | -1 | 17 | -16 | 1.42 | 3 | 9 |
| Hamstring Foundry | 3 | 4 | 79 | · | 19.8 | 24 | · | 120 | · | 28 | · | 1.52 | 6 | 9 |
| Arms Race | 7 | 4 | 81 | -5 | 20.3 | 26 | +3 | 106 | -9 | 14 | -1 | 1.31 | 2 | 9 |
| Workhorse | 7 | 4 | 79 | +3 | 19.8 | 25 | +1 | 117 | +4 | 15 | · | 1.48 | 5 | 10 |
| Neural Overload | 8 | 4 | 70 | +2 | 17.5 | 20 | +1 | 117 | +8 | 38 | +7 | 1.67 | 6 | 9 |
| Tenfold | 6 | 4 | 88 | -7 | 22.0 | 18 | -2 | 123 | -13 | 28 | -3 | 1.40 | 7 | 10 |
| House of Iron | 4 | 4 | 66 | +13 | 16.5 | 24 | +4 | 118 | +19 | 26 | · | 1.79 | 5 | 10 |
| Apex Predator | 4 | 3 | 50 | +2 | 16.7 | 19 | +1 | 73 | +4 | 19 | · | 1.46 | 3 | 9 |
| Venus Rising | 4 | 4 | 70 | +8 | 17.5 | 27 | +3 | 86 | · | 15 | -2 | 1.23 | 4 | 10 |
| Athena | 5 | 4 | 69 | +8 | 17.3 | 23 | +2 | 110 | +7 | 49 | · | 1.59 | 5 | 10 |
| Kali | 2 | 4 | 74 | +15 | 18.5 | 29 | +7 | 101 | +24 | 26 | +11 | 1.36 | 4 | 9 |
| REDLINE | 8 | 4 | 82 | +17 | 20.5 | 28 | +2 | 144 | +35 | 43 | +13 | 1.76 | 7 | 10 |
| ~~Iron Clock~~ (hidden) | 2 | 4 | 36 | · | 9.0 | 22 | · | 60 | · | 17 | · | 1.67 | 1 | 9 |
| The Minimum | 5 | 2 | 38 | +9 | 19.0 | 19 | · | 54 | +10 | 10 | -8 | 1.42 | 0 | 10 |
| Lazarus | 5 | 3 | 56 | +11 | 18.7 | 21 | +3 | 77 | +10 | 15 | -12 | 1.38 | 2 | 10 |
| Quadfather | 7 | 4 | 75 | +6 | 18.8 | 25 | +1 | 108 | +5 | 32 | -6 | 1.44 | 4 | 10 |
| Cathedral | 1 | 4 | 68 | +9 | 17.0 | 24 | +3 | 91 | +2 | 15 | -4 | 1.34 | 2 | 6 |
| Blackout | 2 | 3 | 23 | +1 | 7.7 | 20 | +1 | 29 | -2 | 6 | -3 | 1.26 | 0 | 9 |
| Monolith | 3 | 3 | 64 | -15 | 21.3 | 18 | -5 | 68 | -35 | 8 | -20 | 1.06 | 3 | 8 |
| Atlas | 8 | 3 | 56 | +3 | 18.7 | 20 | +1 | 110 | +3 | 56 | · | 1.96 | 4 | 10 |
| Event Horizon | 3 | 4 | 78 | · | 19.5 | 28 | +4 | 102 | -6 | 25 | -6 | 1.31 | 6 | 9 |
| Project Chimera | 3 | 4 | 79 | +2 | 19.8 | 27 | +4 | 132 | +7 | 51 | · | 1.67 | 6 | 9 |
| Oracle | 3 | 4 | 77 | · | 19.3 | 26 | +2 | 112 | -6 | 41 | · | 1.45 | 6 | 9 |

---

## 7. Method and limits

Each plan's representative week is materialised from `PLAN_REGISTRY` (generators
run, hooks applied), every slot resolved against the exercise library, and
scored using the `exerciseIntelligence` ratings the audit used. The harness
reproduces the audit's published figures where they overlap.

```bash
npx tsx scripts/build-portfolio-report.ts   # report JSON behind the chart
npx tsx scripts/review-flags.ts             # standing set-shape check
npx tsx scripts/spec-fit.ts                 # card versus content
npx tsx scripts/sim-v2-portfolio.ts         # before/after table
```

**Limits.** One steady-state week per plan, so voted ramps change opening weeks
rather than the week measured. Trinary and Ritual generate accessories outside
the template — their figures are the barbell spine only. Super Mutant is measured
at 5 sessions from a declared 4–6. Adventure is the expected value over all
reachable pair routes. Arms Race is scored with the optional nuclear day
included (65 sets without it). Iron Clock is excluded from every aggregate.

---

## 8. Still open

1. **`src/lib/volumeAnalysis.ts` double-counts major muscle groups** — the same
   defect corrected here, live in the code that gates new plans.
2. **Bench Domination has no back, biceps or triceps volume** — the 0-set
   Weighted Pull-ups bug *and* the unmapped Tricep Giant Set.
3. **Card frequency mismatches:** Bench Domination declares 4, runs 6; Ritual
   declares 5/6, runs 3.
4. **Fatigue ratings** — Pencilneck 2 vs 4, Cathedral 3 vs 1, REDLINE 3 vs 4,
   plus several off by one band.
5. **`cable-triceps-extension` in 21 plans and `cable-crunch` in 19** — the
   pressdown half of the triceps rule and the core rule never got the per-plan
   treatment the overhead half did.
6. **Thirteen library ids to add** (eight proposed here, five from round 1), plus
   the `stripper-squat` shortenedBias review.
7. **PG-11's optional fifth day** — voted, unbuilt, and it fixes exactly the
   groups Pain & Glory under-doses.
8. **Blackout's enforcement mechanism** (BLK-RB-I / BLK-RB-X) and **Immaculate's
   day-of-week fix** (IMM-RB-I) — both plans' headline mechanics depend on them.
9. **Declare specialisation groups** for Pain & Glory so `verify:volume` can
   check it. Venus no longer needs one — it dropped the specialisation goal.
