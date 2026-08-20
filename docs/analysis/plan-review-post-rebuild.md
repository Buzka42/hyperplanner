# Post-rebuild plan review — all 36 plans

*2026-08-20, against `main` @ `8286174`. Measured from
`docs/analysis/plan-facts.json`, which materialises each plan's representative
week through the same harness the portfolio reviews use — generators run, hooks
applied. Every number here is what the app builds, not what a spec claims.*

---

## 1. How to read this

Three things are being checked per plan:

1. **Does it deliver its own claim?** The onboarding card and the `PORTFOLIO`
   row make specific, checkable promises about frequency, focus and method.
2. **Is the volume coherent for its goal?** Direct sets per major group against
   the growth bands in `portfolio-metrics.ts`, plus push:pull and quad:ham.
3. **Is the set shape defensible?** Every slot at one set or four-plus, judged
   against the plan's identity rather than a flat rule.

### Measurement caveats that matter

Two classes of finding below would be wrong if read naively, so they are
excluded from the defect list rather than reported as problems:

- **Per-visit generators** (Super Mutant, Trinary, 30 Minute Adventure) have no
  fixed week. The harness samples one session and multiplies. So Super Mutant
  measuring "zero direct back sets" is an artifact of which session got
  sampled — its pool contains four back movements and the 84-workout simulation
  in `verify:supermutant` trains back throughout. Do not act on coverage gaps
  for these three.
- **Density and block plans** (Iron Clock, REDLINE finishers) count a timed
  block as one set. Iron Clock reading 9 sets/session and 6/10 coverage is a
  units mismatch, not a thin plan.

---

## 2. Portfolio-level conclusions

**The set-shape problem is essentially solved.** Across the 33 fixed-calendar
plans there are 872 slots, of which 43 sit at one set — 4.9%. But 35 of those 43
belong to Blackout (23) and Neural Overload (12), where single sets *are* the
method. Outside those two the entire catalogue carries **eight** one-set slots,
and every one of them is earned: ME singles in Ritual of Strength, the AMRAP
test set in Bench Domination, loaded carries and holds in House of Iron and Apex
Predator, and Arms Race's incline-lying curl — which is now a 30–40 rep myo-rep
set with cheat eccentrics, explicitly documented in the source as the plan's one
sanctioned repeat. Compared to the 49 token one-set slots that motivated the
review rule, this is a real fix rather than a relabel.

**Slots at four-plus sets are concentrated where they belong.** 92 of 872
(10.6%), and they cluster in Tenfold (10×10 by definition), Pain & Glory's
deadlift protocol, King of the Squat's squat waves, Gravity Is Optional's
weighted chins and dips, and Trinary's dynamic-effort squats. These are session
anchors, not accessories stacked deep.

**Systemic cost is well separated across the catalogue.** Per-set systemic runs
from 1.06 (Monolith) to 2.73 (Trinary), and it tracks the declared fatigue
rating almost perfectly. Monolith's "low systemic cost" card claim is the
lowest in the portfolio and is genuinely earned; Trinary and Ritual of Strength
sit at the top and both declare fatigue 4.

**Session size spans 7.7 to 30 sets**, which is a healthy spread rather than a
problem — Blackout at 7.7 and Super Mutant at 30 are opposite ends of a
deliberate catalogue. The one number worth watching is Super Mutant at 30
sets/session and 150 sets/week; it is the only plan where volume alone, not
just intensity, is the limiting factor.

**Specialisation plans deliver their specialisation.** Nine of eleven put their
target muscle at the top of the volume table. The two that do not are both
correct on inspection: Pain & Glory (back 28) is topped by glutes 32 and King of
the Squat (quads 22) by glutes 28, because the deadlift and squat both attribute
glutes as a prime mover. Arms Race shows triceps 24 over biceps 22, which is
appropriate given triceps are the larger of the two.

---

## 3. Defects worth fixing

Ranked by how likely they are to mislead or shortchange an athlete.

### 3.1 Bench Domination's portfolio row understates its frequency · **high**

The card is correct: *"4 Benching days a week + 2 Lower Body days"*. The
measured week is 6 training days, 112 sets. But `PORTFOLIO` declares
`frequency: [4]`, and the row's own `notForYouIf` reads *"You cannot train four
days most weeks."*

This is the single most consequential metadata error found. The portfolio row
drives the plan finder, so an athlete filtering for a four-day plan is offered a
six-day one, and the walk-away warning names the wrong commitment. The plan is
fine; the row describing it is not.

**Fix:** `frequency: [6]`, and reword `notForYouIf` to name six days.

### 3.2 Monolith's card claims a structure it does not have · **medium**

Card feature reads *"4 days, upper/lower"*. The plan runs **three** days, and
they are Upper / Lower / **Full** — which is exactly what its own
`signatureMechanic` says: *"Three machine-house days — Upper, Lower, Full."*
The `PORTFOLIO` row's `frequency: [3]` is right. Only the card bullet is wrong,
and it contradicts the row sitting next to it.

**Fix:** card bullet to "3 days — upper, lower, full".

### 3.3 From Skeleton to Threat has three gaps unusual for a beginner plan · **medium**

This is a 12-week plan sold to *"those who have never touched a weight"*, and it
is the one plan where the measured shape raises real questions:

- **No direct shoulder, biceps or triceps work.** Zero prime-mover sets for all
  three. Deficit push-ups, inverted rows and pulldowns cover them as
  secondaries, but a beginner gets no overhead press and no arm work in twelve
  weeks.
- **No squat or hinge pattern.** Quads come from Leg Extensions, hamstrings
  from Supported Stiff-Legged DB Deadlift. Neither teaches a movement the
  athlete carries forward, which is usually the main argument for a beginner
  block.
- **All three sessions are byte-identical.** Confirmed in source: `preprocessDay`
  builds the same seven exercises for every selected day. Weeks 9+ add one set
  per slot and that is the only progression in structure.

None of this is a bug — it is a coherent "no barbell skill required, nothing to
learn, just show up" design, and push:pull sits at a reasonable 0.75. But it is
worth an explicit decision, because it is the plan most likely to be a user's
first, and it currently hands them no press, no squat and no arms.

**Fix (if the design is to stand):** say so on the card. *"Machines and
bodyweight only — no barbell skills required"* would make the trade honest
rather than surprising.

**Fix (if not):** the cheapest change is swapping one pulldown set for a seated
machine shoulder press and letting the late-phase extra set land on a curl.

### 3.4 Bench Domination stacks 12 sets of weighted pull-ups in one session · **medium**

`program.ts:189` sets pull-up volume by week: 8 sets in weeks 1–3, **12 in weeks
4–6**, 7 in 7–9, 5 thereafter. Twelve sets of a single loaded movement in one
session is the largest single-slot load anywhere in the catalogue outside
Tenfold's 10×10, and Tenfold's is the entire point of the plan.

On a bench specialisation this sits on the pulling day as accessory work. Twelve
sets of weighted pull-ups is a back workout in its own right, and it competes
directly with the four benching sessions it is supposed to support.

**Fix:** cap the peak at 8 and spread the difference to the Saturday pull-up
slot, which currently runs 3–4.

### 3.5 Bench Domination has no direct biceps work at all · **low**

Zero prime-mover biceps sets across 112 weekly sets and 16 weeks. Weighted
pull-ups and Y-raises load them heavily as secondaries, so this is not a
neglected muscle in practice — but it is the only plan in the catalogue with a
major group at zero across a six-day week, and one curl slot on the pull day
would close it.

### 3.6 Pencilneck's arms are its smallest muscle group on an upper-body plan · **medium**

Card: *"Focus: Upper Body Mass."* Measured: shoulders 22, back 21, chest 19 —
then **biceps 4 and triceps 5**, both below the 6-set growth dose. Meanwhile
legs total 36 sets, and the `notForYouIf` says *"legs are maintained, not
pushed."* Thirty-six sets is not maintenance; it is more volume than the arms
and chest combined.

The plan is internally fine as a full-body-with-upper-bias split. Its
description is what is off.

**Fix:** either move ~6 sets from legs to arms, or restate the card as an
upper-biased full-body plan and drop the "maintained, not pushed" line.

### 3.7 Pencilneck jumps 65% in volume entering week 3 · **low**

Weeks 1–2 run 55 sets (compounds 2, isolations 1). Week 3 jumps to 91 (compounds
3, isolations 2). That is a deliberate ramp-in, and the one-set isolations carry
`last-set-failure` so they are not token — but a 65% weekly-volume step in a
single week is steep, and the plan gives no signal it is coming.

**Fix:** an intermediate week, or a note on the week-3 card explaining the step.

### 3.8 Peachy has no direct arm work across two upper-body days · **low**

Days 2 and 4 carry presses, rows, pulldowns and rear-delt work, but biceps and
triceps are both at zero prime-mover sets. On a glute specialisation nobody is
buying it for arms, and glutes at 32 sets is exactly what was promised — but
two dedicated upper days with no arm slot is an easy gap to close.

### 3.9 Trinary trains five of ten major groups · **low, by design**

Shoulders, biceps, triceps, calves and core all at zero prime-mover sets, axial
99 and per-set systemic 2.73 — the highest in the portfolio. For a conjugate
powerlifting plan at fatigue 4 this is coherent and the `notForYouIf` should
carry it. Flagged only so the decision is on record rather than assumed.

### 3.10 Pain & Glory's deadlift dose is the portfolio's outlier · **low, by design**

Ten sets of six at 45% of the conventional max on deficit snatch-grip
deadlifts, **twice weekly** — 120 reps a week of a deficit pull, axial 90,
lower back 76. This is a classic Russian-style volume block and it is plainly
the intent of a plan called Pain & Glory at fatigue 4.

Worth recording that it *is* autoregulated: the `low-fatigue` speed scheme cuts
it to 8×3 (`painglory.ts:368`). The mechanism exists and works. No change
recommended; noted because it is the highest sustained axial load shipped.

---

## 4. Per-plan verdict

| Plan | Sets/wk | Sets/sess | Systemic | Axial | Verdict |
|---|---:|---:|---:|---:|---|
| Bench Domination | 112 | 18.7 | 175 | 28 | Delivers. Portfolio row wrong (§3.1); pull-up peak high (§3.4); no biceps (§3.5) |
| Pencilneck Eradication | 91 | 22.8 | 147 | 45 | Solid split, mis-sold as upper-body (§3.6); week-3 step (§3.7) |
| From Skeleton to Threat | 57 | 19.0 | 90 | 9 | Coherent but three gaps for a beginner plan (§3.3) |
| Peachy | 68 | 17.0 | 107 | 34 | Delivers — glutes 32, clearly the leader. No arms (§3.8) |
| Pain & Glory | 74 | 18.5 | 141 | 90 | Delivers. Highest axial in the catalogue, autoregulated (§3.10) |
| Trinary | 45 | 15.0 | 123 | 99 | Delivers. Narrowest coverage by design (§3.9) |
| Ritual of Strength | 42 | 14.0 | 95 | 60 | Delivers. ME singles correctly exempt |
| Super Mutant | 150 | 30.0 | 250 | 80 | Delivers. Largest sessions shipped; coverage gaps are sampling artifacts |
| 30 Minute Adventure | 60 | 20.0 | 87 | 19 | Delivers. Lowest fatigue, 59-movement pool |
| King of the Squat | 82 | 20.5 | 156 | 72 | Delivers. Quads 22, glutes 28 — both squat-driven |
| Gravity Is Optional | 82 | 20.5 | 145 | 15 | Delivers. Back 20, axial 15 — cleanest load profile of any specialisation |
| Purgatorio | 79 | 19.8 | 119 | 30 | Delivers. Full coverage, no flags |
| Immaculate (Re)Structure | 78 | 19.5 | 127 | 31 | Delivers. Full coverage, no flags |
| Overhead Dominion | 81 | 20.3 | 118 | 33 | Delivers. Shoulders 40 — strongest specialisation signal in the catalogue |
| Hamstring Foundry | 79 | 19.8 | 120 | 28 | Delivers. Hamstrings 19, leads its table |
| Arms Race | 80 | 20.0 | 105 | 14 | Delivers. Triceps 24 / biceps 22; myo-rep single is documented and earned |
| Workhorse | 79 | 19.8 | 117 | 15 | Delivers. Back 20, axial 15 |
| Neural Overload | 70 | 17.5 | 117 | 38 | Delivers. 12 singles are the 1-6 PAP method |
| Tenfold | 88 | 22.0 | 123 | 28 | Delivers. Four 10×10 slots, exactly as claimed |
| House of Iron | 55 | 13.8 | 102 | 26 | Delivers. Carries and holds correctly exempt |
| Apex Predator | 50 | 16.7 | 73 | 19 | Delivers. Low volume by design; carry is exempt |
| Venus Rising | 68 | 17.0 | 84 | 15 | Delivers. Second-lowest per-set systemic — right for a first structured plan |
| Athena | 67 | 16.8 | 108 | 49 | Delivers. Full coverage, no flags |
| Kali | 74 | 18.5 | 101 | 26 | Delivers. Preservation bands hold |
| REDLINE | 73 | 18.3 | 120 | 30 | Delivers. Full coverage |
| Iron Clock | 36 | 9.0 | 60 | 17 | Delivers. Low counts are block-units, not thin programming |
| The Minimum | 38 | 19.0 | 54 | 10 | Delivers. Groups at 4 sets are the honest cost of two sessions |
| Lazarus | 56 | 18.7 | 77 | 15 | Delivers. Full coverage at low load — correct for a return plan |
| Quadfather | 75 | 18.8 | 108 | 32 | Delivers. Quads 25, quad:ham 3.13 |
| Cathedral | 68 | 17.0 | 91 | 15 | Delivers. Chest 28, no barbell bench as claimed |
| Blackout | 23 | 7.7 | 29 | 6 | Delivers. 23 singles are the entire method |
| Monolith | 68 | 22.7 | 72 | 8 | Delivers. Lowest per-set systemic shipped. Card wrong (§3.2) |
| Atlas | 56 | 18.7 | 110 | 56 | Delivers. Carries scored as a lift |
| Event Horizon | 78 | 19.5 | 102 | 25 | Delivers. Full coverage |
| Project Chimera | 79 | 19.8 | 132 | 51 | Delivers. Full coverage |
| Oracle | 77 | 19.3 | 112 | 41 | Delivers. Full coverage |

**34 of 36 deliver their stated claim without qualification.** The two that do
not — Bench Domination and Monolith — both fail on *metadata describing the
plan*, not on the plan itself.

---

## 5. Improvements, ranked

### Fix now — cheap, and they correct something an athlete is told

1. **Bench Domination `frequency: [6]`** and reword its `notForYouIf` (§3.1).
2. **Monolith card bullet → "3 days — upper, lower, full"** (§3.2).

Both are one-line data edits with no programming consequences.

### Decide, then act

3. **Skeleton to Threat's scope** (§3.3). Either add a press and a curl, or put
   the machines-and-bodyweight constraint on the card. The current state is a
   silent trade in the plan most likely to be someone's first.
4. **Pencilneck's positioning** (§3.6). Move ~6 sets from legs to arms, or stop
   calling it an upper-body plan. Right now the copy and the programming
   disagree.

### Worth doing

5. **Cap Bench Domination's pull-up peak at 8 sets** (§3.4), moving the surplus
   to the Saturday slot.
6. **Add one curl slot to Bench Domination and to Peachy** (§3.5, §3.8). Two
   slots total, closing the only zero-coverage gaps that are not deliberate.
7. **Soften Pencilneck's week-3 volume step** (§3.7), or announce it.

### Explicitly decided against

8. Pain & Glory's deadlift dose and Trinary's narrow coverage are correct for
   what those plans are (§3.9, §3.10). Recorded so they are not re-raised.
9. Super Mutant, Trinary and 30 Minute Adventure coverage "gaps" are sampling
   artifacts of per-visit generation. If they should be measurable, the fix is
   in the harness — sample N sessions and union the coverage — not in the plans.

---

## 6. Reproducing this

```bash
npm run docs:plans        # refresh docs/analysis/plan-facts.json and docs/plans/
```

Every figure above reads from `plan-facts.json`. The per-plan documents in
[`docs/plans/`](../plans/INDEX.md) carry the full breakdown for each plan,
including the complete slot lists this review summarises.
