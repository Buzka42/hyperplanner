# The Minimum

> Unified plan document, v2 format. Supersedes `docs/plans/the-minimum.md`.
> Volume figures are computed from `docs/analysis/exercise-attribution-map.md`;
> systemic figures from each movement's `intelligence` block. Nothing here is
> estimated by eye.

| | |
|---|---|
| **id** | `the-minimum` |
| **Length** | 10 weeks |
| **Frequency** | 2 required sessions / week |
| **Weekly sets** | 29 (Session A 14 · Session B 15) |
| **Session time** | ≈ 45 min incl. warm-up |
| **Weekly time** | ≈ 90 min |
| **Declared kind** | `general`, `minWeeklyExposures: 2` |
| **Progression** | Double progression, +2.5 kg, every slot |
| **Source** | `src/data/plans/theMinimum.ts` |
| **Stated promise** | *"Two mandatory full-body sessions, with optional bonus work when you have time. Bonus work never gates progress."* |

---

## 1. Structure

Two full-body sessions covering every major muscle, deliberately using
**different movements** in each so the second weekly exposure is a variation
rather than a repeat. No slot appears in both sessions — this is the plan's
best design decision and it holds up.

### Session A — 14 sets (Mon)

| # | Movement | Sets × reps | Rest | Systemic | Axial |
|---|---|---|---|---|---|
| 1 | Hack Squat | 2 × 6–10 | 150s | 3 | 2 |
| 2 | Romanian Deadlift | 2 × 6–10 | 150s | 3 | 3 |
| 3 | Incline DB Bench Press | 2 × 6–10 | 90s | 2 | 0 |
| 4 | Single-Arm Hammer Row | 2 × 8–12 | 90s | 1 | 0 |
| 5 | Lateral Raise | 2 × 12–15 | 90s | 1 | 0 |
| 6 | Hammer Curl | 1 × 8–12 | 90s | 1 | 0 |
| 7 | Cable Triceps Extension | 1 × 8–15 | 90s | 1 | 0 |
| 8 | Hack Calf Raise | 1 × 12–20 | 90s | 1 | 0 |
| 9 | Ab Wheel | 1 × 8–12 | 90s | 2 | 0 |

### Session B — 15 sets (Thu)

| # | Movement | Sets × reps | Rest | Systemic | Axial |
|---|---|---|---|---|---|
| 1 | Leg Press | 2 × 8–12 | 150s | 2 | 2 |
| 2 | Seated Hamstring Curl | 2 × 10–15 | 90s | 1 | 0 |
| 3 | Hammer Chest Press | 2 × 8–12 | 90s | 1 | 0 |
| 4 | Lat Pulldown | 2 × 8–12 | 90s | 1 | 0 |
| 5 | Seated DB Shoulder Press | 2 × 8–12 | 90s | 2 | 2 |
| 6 | Single-Leg Machine Hip Thrust | 1 × 10–15 | 90s | 1 | 0 |
| 7 | Cable Curl | 1 × 10–15 | 90s | 1 | 0 |
| 8 | Rope Pressdown | 1 × 10–15 | 90s | 1 | 0 |
| 9 | Leg Press Calf Raise | 1 × 12–20 | 90s | 1 | 0 |
| 10 | Hanging Knee Raise | 1 × 10–15 | 90s | 1 | 0 |

### Phases

| Phase | Weeks | What actually changes |
|---|---|---|
| Establish | 1–3 | — |
| Build | 4–7 | **Nothing.** Label only |
| Press | 8–9 | `rpe: 9` stamped on non-compound slots |
| Confirm | 10 | **Nothing.** Label only |

**Weeks 1–7 and week 10 are byte-identical.** Verified programmatically: the
exercise/set/rep signature is unchanged across all ten weeks. The single
mechanical change in the entire plan is an RPE stamp in weeks 8–9. See §7.1.

---

## 2. Weekly fractional volume

All 35 dimensions. `†` = the muscle is loaded in a lengthened position by at
least one contributing movement.

### Meets a development stimulus (≥ 5.0)

| Muscle | Sets | Sources |
|---|---|---|
| Glute max (lower) | **5.0**† | RDL 2.0, hack squat 1.0, leg press 1.0, SL hip thrust 1.0 |
| Front delt | **5.0** | Incline DB 2.0, DB press 2.0, laterals 0.5, chest press 0.5 |

### Maintenance band (3.0 – 4.9)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Biceps femoris | 4.5† | | Vastus lateralis | 4.0 |
| Triceps lateral | 4.5 | | Vastus medialis | 4.0 |
| Triceps medialis | 4.5 | | Vastus intermedius | 4.0 |
| Semimemb/tendinosus | 4.0† | | Lats (lower) | 3.75† |
| Forearm flexors | 3.25 | | Pec upper | 3.0† |
| Pec lower | 3.0 | | Side delt | 3.0 |
| Teres major | 3.0 | | Biceps long head | 3.0 |

### Below maintenance (1.0 – 2.9)

| Muscle | Sets | | Muscle | Sets |
|---|---|---|---|---|
| Brachialis | 2.5 | | Gastrocnemius | 2.5† |
| Triceps long head | 2.25† | | Abs (lower) | 2.0 |
| Lats (upper) | 2.0† | | Rhomboids | 2.0 |
| Abs (upper) | 1.5† | | Biceps short head | 1.25 |
| Obliques | 1.25 | | Erectors | 1.0 |
| Trap mid | 1.0 | | Glute max (upper) | 1.0 |
| Adductors | 1.0 | | Soleus | 1.0 |
| Brachioradialis | 1.0 | | Abdominal wall | 1.0 |

### Effectively untrained (< 1.0)

| Muscle | Sets |
|---|---|
| Rear delt | **0.5** |
| Trap upper | **0.5** |
| Trap lower | **0.5** |
| Glute medius | **0.5** |
| Rectus femoris | **0.5** |
| Serratus | **0.5** |
| Subscapularis | 0.5 |
| **Infraspinatus** | **0** |
| **Forearm extensors** | **0** |
| **Tibialis anterior** | **0** |
| **TFL** | **0** |

### On the ≥ 5 fractional-set target

**It is arithmetically unreachable here, and that is not a defect.** 29 sets ×
≈ 4 attributed muscles per set ≈ 116 fractional units, spread across 35
dimensions — a mean of 3.3. Hitting 5.0 everywhere would require ≈ 175
fractional units, i.e. roughly 44 sets/week, which breaks the plan's defining
promise.

The Minimum must be judged against **MEV (minimum effective volume)**, not MAV.
On that basis the distribution is defensible for the mid-band and indefensible
for the bottom band — the problem is not *how much* volume exists but *which
muscles get none*, and every one of those gaps is fixable within 29 sets by
substitution rather than addition (§8).

---

## 3. Frequency and exposure

Counting an exposure at ≥ 0.5 attribution, per the map's convention.

| Group | Exposures/wk | Verdict |
|---|---|---|
| Quads, hamstrings, glutes, chest, lats, front delt, triceps, biceps, calves, abs | 2 | Meets the declared floor |
| Side delt | 2 | Meets |
| Rear delt, traps, erectors, glute medius | **1 or 0** | Below floor |

Schoenfeld, Ogborn & Krieger (2016) find 2×/week superior to 1× at matched
volume, with no further benefit demonstrated for 3× once volume is equated.
**Two sessions is the right frequency choice** — the plan's premise is sound.

---

## 4. Systemic and joint load

Computed from `intelligence` costs × sets.

| Metric | Session A | Session B | Week |
|---|---|---|---|
| Systemic | 25 | 19 | **44** |
| Axial | 10 | 8 | 18 |
| Stability | 23 | 10 | 33 |
| Lower back | **8** | 0 | 8 |
| Knee | 4 | 6 | 10 |
| Shoulder | 4 | 6 | 10 |
| Per-set systemic | **1.79** | 1.27 | — |

**Session A is 40% more systemically costly than Session B** and carries the
entire lower-back load of the week (8 vs 0). Both come from stacking hack squat
(sys 3, axial 2) directly into RDL (sys 3, axial 3, lower-back 3) — the two
heaviest movements in the plan, back to back, in the first four sets.

### Weekly CNS curve

Flat at 44 for weeks 1–7, rising modestly in weeks 8–9 (RPE 9 on 10 of 14
non-compound slots), flat again in week 10.

```
W1  ████████████████████ 44
W2  ████████████████████ 44
W3  ████████████████████ 44
W4  ████████████████████ 44   ← "Build" begins; nothing changes
W5  ████████████████████ 44
W6  ████████████████████ 44
W7  ████████████████████ 44
W8  ██████████████████████ 48  ← RPE 9 stamp
W9  ██████████████████████ 48
W10 ████████████████████ 44   ← "Confirm"; no deload, no peak
```

There is **no deload in ten weeks** and no taper. At 29 sets/week that is
survivable — this is genuinely the one plan where omitting a deload is
defensible — but week 10 "Confirm" confirms nothing: it is identical to week 1.

---

## 5. Session flow

### Order

**Session A is mis-ordered.** Slots 1–2 place the two highest-systemic, highest-axial
movements consecutively, concentrating all 8 points of lower-back cost into the
opening four sets. RDL quality — a hinge whose whole value is a loaded stretch
under control — is being tested on erectors already fatigued by hack squats.

Interleaving one upper-body slot between them costs nothing and restores RDL
quality: **hack squat → incline press → RDL → row**.

**Session B is well ordered.** Systemic cost descends cleanly (2, 1, 1, 1, 2 …)
and the one axial item (DB shoulder press) sits mid-session.

### Pairing

**No supersets anywhere**, despite time being the plan's entire reason to
exist. Four natural antagonist pairs exist and are currently run straight:

| Pair | Session | Time saved |
|---|---|---|
| Hammer Curl + Cable Triceps Ext | A | ~3 min |
| Row + Incline Press | A | ~4 min |
| Cable Curl + Rope Pressdown | B | ~3 min |
| Lat Pulldown + DB Shoulder Press | B | ~4 min |

Robbins et al. (2010) and Weakley et al. (2017): agonist–antagonist pairing
preserves volume and force output while cutting session time substantially.
For a plan named The Minimum this is free.

### Time

Session A ≈ 9 min work + 25 min rest ≈ **34 min** + warm-up.
Session B ≈ 10 min work + 24.5 min rest ≈ **35 min** + warm-up.
Both land at ≈ 45 min door to door. **The plan's time claim is honest.**

---

## 6. Progression

Double progression on every slot, +2.5 kg, via the shared `genericDoubleProgression`
handler with loads persisted to `workingLoads['the-minimum']`.

Sound and appropriate. Two caveats:

1. **+2.5 kg is a single global increment** applied to lateral raises and hack
   squats alike. On a 2×12–15 lateral raise, +2.5 kg is a 15–25% jump — far
   beyond what double progression assumes. Isolation slots need 1–1.25 kg.
2. **Load is the only progression vector for 8 of 10 weeks.** See §7.1.

---

## 7. Findings

### 7.1 Ten weeks, one change · **severity: high**

The tree is identical in weeks 1–7 and 10. The sole mechanical progression is
an RPE stamp in weeks 8–9. The phase names Establish / Build / Press / Confirm
promise a periodised structure that does not exist — three of the four are
labels over identical training.

The source comments the intent honestly: *"Effort rises rather than volume:
adding sets would break the promise the plan is named after."* The intent is
right; the execution stops short. Effort can rise through RPE, tempo, rest
compression, or technique — none is used before week 8.

### 7.2 Rear delt, traps and cuff are absent · **severity: high**

Rear delt 0.5, trap lower 0.5, trap upper 0.5, infraspinatus 0. For a
twice-weekly full-body plan aimed at time-poor (overwhelmingly desk-bound)
trainees, the postural muscles are the ones omitted. Session A's only shoulder
isolation is a lateral raise; Session B's is a front-dominant press.

### 7.3 Both calf slots are the same muscle · **severity: medium**

`hack-calf-raise` and `leg-press-calf-raise` are both knee-extended, so both
load gastrocnemius (1.0) and only touch soleus (0.5). Weekly soleus = 1.0.
Soleus is ~80% type-I and requires knee-flexed loading; two slots are being
spent to train one head twice.

### 7.4 No knee-extension movement · **severity: medium**

Hack squat and leg press are pure vasti work. Rectus femoris is biarticular and
stays shortened at the hip throughout both, so it receives 0.5 sets/week. The
plan has no leg extension, sissy squat or reverse nordic.

### 7.5 Blanket tempo contradicts the cues · **severity: medium**

`defaultTempo: '20X0'` is applied to all 19 slots, including ab wheel, lateral
raise and hanging knee raise where a rep-tempo notation is meaningless. On hack
calf raises it **directly contradicts the exercise tip**, which reads *"1 second
pause at bottom, slow eccentric"* — the tip asks for roughly `3:1:X:0`.

### 7.6 UI defects (browser clickthrough, live site)

| Finding | Severity | Detail |
|---|---|---|
| Hero card misreports the session | **High** | Selecting Week 6 makes the NEXT SESSION card read *Week 6 · Build · bonus unused*, but its link targets `/app/workout/1/1` and loads *Week 1 · Establish*. Display binds to the week selector; the link binds to the true next session |
| Session lost on reload | **High** | Any refresh or deep link to `/app/*` returns to the login screen |
| Plan cards unreachable by keyboard | **High** | Cards carry no button/link role and nothing focusable; only "Help me choose" and "Cancel" are tabbable. Affects every plan |
| Nav controls unlabeled | Medium | Nav rail links and several action buttons expose no accessible name |
| Live LOAD field renders empty | Medium | On set 2+ the input is blank although the previous load *is* applied on save — the athlete cannot see what will be recorded |
| `"1 sets × 8-12"` | Low | Grammar, on all six single-set slots |
| `· bonus unused` reads as a warning | Low | Appended to the session name and every history row; looks like a defect, not an invitation |
| `program_status` widget still declared | Low | `ui.dashboardWidgets` still lists it although the efficiency overhaul retired it |

Confirmed working: `· bonus unused` gating from week 6, phase-name transitions,
double progression persistence, bilingual tips, schedule-mode selection.

---

## 8. Improvements, ranked

### 1. Make the ten weeks actually progress — without adding a session

Highest impact, cheapest fix, and it repairs the plan's central credibility
problem. Effort and density are progression vectors that do not touch the set
count:

| Phase | Weeks | Proposal |
|---|---|---|
| Establish | 1–3 | RIR 3→2. Learn the loads |
| Build | 4–7 | RIR 2→1. Last set of each **isolation** slot to failure (hard-two logic, already implemented elsewhere in the portfolio) |
| Press | 8–9 | RPE 9 as today, plus rest compression 90s → 75s on isolation |
| Confirm | 10 | **Deload**: sets ×0.6 (≈ 18), load held. Then re-test |

Week 10 becomes a real confirmation week instead of a copy of week 1.
Progressive overload does not require more volume (Plotkin et al. 2022:
load- and rep-progression produce equivalent hypertrophy) — but it does require
*something* to change, and for seven weeks nothing does.

### 2. Buy back rear delt, traps and cuff by substitution, not addition

Costs zero extra sets and zero new library entries:

| Change | Effect |
|---|---|
| Session A slot 5: Lateral Raise 2 → **1 lateral + 1 `single-arm-reverse-pec-deck`** | Rear delt 0.5 → 1.5, side delt 3.0 → 2.5 |
| Session B slot 4: Lat Pulldown → **`rope-cable-row`** or keep pulldown and make slot 5 a `face-pulls` | Rear delt → ~2.5, trap mid → 2.0, trap lower → 1.5 |

`single-arm-reverse-pec-deck` is already used by 15 plans; `face-pulls` and
`rope-cable-row` exist and are used by none. This is the deployment problem
from the library review, in miniature.

### 3. Make one calf slot knee-flexed, and reclaim the other for quads

Two changes, no net set cost:

- Session B `leg-press-calf-raise` → **seated (knee-bent) calf raise**. Soleus
  1.0 → 2.0 and gastroc stays covered by Session A. The library's
  `seated-dumbbell-calf-raise` exists but is currently unreachable — this is one
  of the seven gaps that needs deployment, not invention.
- Session A `hack-calf-raise` → keep, but add **`leg-extension`** in place of
  one lateral-raise set if §2's swap is not taken. Rectus femoris 0.5 → 1.5.

### 4. Superset the four antagonist pairs

Cuts ≈ 8–10 min/week with no volume or load loss, on the one plan where session
length *is* the product. Pair curls with triceps and rows with presses in both
sessions; leave the two 150s compounds straight.

### 5. Reorder Session A

`hack squat → incline press → RDL → row → laterals → …`. Costs nothing,
de-stacks 6 points of axial load and 8 of lower-back cost, and protects RDL
technique — the movement in this plan with the highest injury cost and the
greatest dependence on positional quality.

### 6. Per-slot load increments

Replace the global +2.5 kg with increment by movement class: 5 kg on leg press,
2.5 kg on compounds, **1–1.25 kg on isolation**. A +2.5 kg jump on a 2×12–15
lateral raise is a 15–25% load increase and guarantees the athlete stalls or
breaks form. The library already carries `weightMode` and equipment data to
drive this.

### 7. Fix the tempo default

Apply `20X0` only to slots where it means something. Ab wheel, hanging knee
raise and lateral raise should carry no tempo, and the hack calf raise should
read `3:1:X:0` to match its own cue.

### 8. Surface the bonus system properly

`· bonus unused` is the only place bonuses appear, it reads as an error, and it
repeats on every history row. Replace with a dashboard card naming the actual
underexposed muscle — the data already exists — e.g. *"Rear delts are your
lowest exposure this week. 10 min available?"* That converts a scold into the
plan's most interesting feature.

---

## 9. Verdict

**The Minimum is the most intellectually honest plan in the portfolio, and it
delivers on its promise.**

The premise is well supported. Two weekly full-body sessions is the frequency
the evidence favours at low volume (Schoenfeld 2016). Both sessions cover every
major muscle with *different* movements, which is a genuinely better design
than the usual A/B repeat. The 14–16 set cap is enforced in code and honoured.
The ~45-minute session estimate is accurate. Bonus work is architecturally
prevented from becoming a third mandatory session, which is exactly the
discipline this concept needs.

Judged as what it is — a **maintenance and slow-accrual plan for someone whose
training time is genuinely scarce** — it works. At ~4 direct sets per major
muscle per week it sits below the ~10-set/week band associated with maximal
hypertrophy (Schoenfeld, Ogborn & Krieger 2017), but comfortably above the
threshold for meaningful growth in novice and detrained trainees, and far above
the volume needed to *retain* mass (Bickel et al. 2011 — as little as one-ninth
of accumulated volume preserves size and strength for months). For its intended
user this is the correct dose.

Two things stop it being excellent rather than good:

**The ten weeks do not progress.** Seven identical weeks, then an RPE stamp,
then an identical tenth week labelled "Confirm". The plan is honest about not
adding volume but never substitutes another progression vector, so a
disciplined athlete arrives at week 10 doing week 1's session at a slightly
heavier load. That is a mesocycle in name only.

**The omissions are the wrong ones.** Given 29 sets you must leave things out —
but the muscles left out are rear delts, lower traps, external rotators and
soleus, which are precisely the ones a sedentary, time-poor trainee most needs.
Every one is fixable by substitution within the existing set budget, using
movements already in the library.

Fix those two and this becomes the plan I would recommend to most people who
train twice a week. Neither fix costs the promise in its name.

---

## 10. Export block

```yaml
id: the-minimum
version: 2
weeks: 10
sessions_per_week: 2
weekly_sets: 29
session_minutes: 45
kind: general
min_weekly_exposures: 2
progression: { type: double, increment_kg: 2.5 }
deload_weeks: []
phases:
  - { name: Establish, weeks: [1,2,3] }
  - { name: Build,     weeks: [4,5,6,7] }
  - { name: Press,     weeks: [8,9], rpe: 9 }
  - { name: Confirm,   weeks: [10] }
systemic_load: { session_a: 25, session_b: 19, weekly: 44 }
volume_top:   { gluteMaxLower: 5.0, frontDelt: 5.0, bicepsFemoris: 4.5 }
volume_zero:  [infraspinatus, forearmExtensors, tibialisAnterior, tfl]
audit:        { date: 2026-08-14, findings: 8, verdict: "sound for purpose; no progression, wrong omissions" }
```
