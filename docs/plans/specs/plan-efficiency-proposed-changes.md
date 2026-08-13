# Plan efficiency — proposed changes

**Status:** owner review. Nothing is scheduled until you answer under each question.  
**Branch:** `cbranch`  
**Date:** 2026-08-12  
**Keyword used for live tests:** `test_workhorse`

This is a training-efficiency audit: load, volume quality, recovery, specialisation stimulus. Gemini’s two blueprints were read and filtered. Comfort checkboxes, radars, chimes, particle bursts and “visual celebration cards” are listed only so you can kill them in place.

How to answer: write under **Your answer.** Tick, rewrite, or say no. Blank on a per-plan item means leave that plan as-is.

---

## 1. How this was produced

| Source | What it actually showed |
|---|---|
| `npm run verify:plans` | 732 checks, 0 failures. Spec-vs-code for existing docs is clean. |
| `verify:plan-lifecycle`, `verify:progression`, `verify:volume` | Lifecycle OK. Progression OK **for the 9 plans that have save-time handlers**. Volume auditor reports **0 breaches** because it has a frequency floor and **no upper bound**. |
| `test_workhorse` group 1–6 simulations | **All 36 plans passed** (~1,300 assertions). Generators, phases, swaps, and lifecycle match the written specs. |
| Live click-through (`test_workhorse` → onboarding → injected lab user) | Keyword opens the full protocol picker. Workhorse W1D1 and Tenfold W1D1 match their docs. **Neural Overload W1D1 does not** — see P0-1. |
| Later-week live pass (W1 / mid / last, all 36, mobile 390px) | Phase *names* change where the spec has phases. **Loads do not** on Neural. Skeleton always renders Week 1. Super Mutant `/workout/n/1` is Rest without `superMutantStatus`. |
| Visual (desktop) | Peachy is readable. Pencilneck commandment numbers fail contrast. Gravity / Neural muted copy is the dimmest. Pain & Glory RPE modal uses `text-amber-900` on a dark card. |
| Literature (not Gemini) | Schoenfeld 2017 / Baz-Valle 2022 volume; Wolf 2023 / Pedrosa 2022 / Maeo 2021 lengthened-position; Hackett 2018 + Amirthalingam 2017 GVT; PAP rest 4–8 min (Gołaś / Blazevich); Androulakis-Korakakis 2020 minimum effective dose; Poliquin ratios treated as coaching heuristics, not validated constants. |

Gemini files considered:

- `docs/plans/specs/all-plans-enhancement-blueprint.md`
- `docs/plans/specs/bodybuilding-specialization-overhaul.md`

Lab injection used `window.__SET_TEST_USER__` with paused bench 140 / squat 180 / deadlift 220.

---

## 2. Science baseline (the numbers we will argue from)

These are working ranges, not laws. Use them to judge a plan, not to flatten every plan into 4×10.

| Goal | Productive band | Past this, extra sets are usually junk |
|---|---|---|
| Hypertrophy, trained | ~10–20 hard sets / muscle / week (Schoenfeld 2017; Baz-Valle 2022) | >20–25 unless the extra sets are easy, lengthened, or a true specialisation block with recovery paid for |
| Strength / powerlifting main lift | High specificity, 1–6 reps, long rest, frequency 2–4 | Accessory hypertrophy can sit at maintenance (~4–8) |
| Specialisation | Push the target to the top of MAV (~16–25), **cut** non-target toward MV (~4–8) | Adding 30–40 sets of the same pattern is not specialisation, it is junk |
| Cut / time-crunch / return | Androulakis-Korakakis 2020: 1 hard set × 2–3 / week still moves 1RM | Hypertrophy will stall; that is acceptable if the plan says so |
| Lengthened position | Seated curl > prone (Maeo 2021, +14% vs +9% hamstring volume). Lengthened partials ≈ full ROM, shortened partials lose (Wolf 2023, Pedrosa 2022) | 30-second “loaded stretch finishers” are not a substitute for loaded lengthened work |
| GVT 10×10 | Hackett 2018 / Amirthalingam 2017: 10 sets **not better** than 5 sets; some lean-mass loss in weeks 6–12 of 10-set | Keep Tenfold as a density *method*, not as “more sets = more growth” |
| PAP / 1–6 | Heavy single 85–90% can raise subsequent volume if rest is ~4–8 min and the single is **not** a grind (Gołaś 2021; Conrado de Freitas 2021) | 180 s after a 90% single is on the short side; a third wave at 95% is fatigue, not PAP |
| Poliquin ratios | Coaching screen from elite-athlete observation (Poliquin 1997). Not RCT-validated. Chin-up 81% of close-grip is often *easy* for trained pullers | Use as a **weak-link finder**, never as a medical threshold |
| Last-set to failure | Proximity to failure on the last set does most of the hypertrophy work (Refalo 2022; Pelland / Robinson). A third set at RIR 3 is usually junk when the muscle already has 3–4 weekly exposures | Never on squat / RDL / standing press / weighted-chin strength / 1–6 / 10×10 |

Poliquin techniques we should keep and sharpen, not abandon: 1–6 coupling, tempo as a progression lever, structural-balance *screening*, rest that matches the quality (3–4 min on 3–5s), wave loading, antagonist pairing.

---

## 3. Gym lock — no new movements

The library is the gym. `libraryAdditions.ts` is authored against that inventory: DBs to 50 kg, Smith, standing hack squat, Hammer chest / upper / lower row, pec deck, cables, TRX, ab wheel, hanging space, pull-up bar. Core `library.ts` is the rest of what you already train there.

Hard rule for every change in this file:

- Prescription changes only (sets, reps, rest, tempo, last-set-failure, progression).
- Swaps only from `EXERCISE_BY_ID` / existing `swapGroup`s. If it is not in the library, it is not in the gym.
- Do not add preacher machines, pendulum squat, hip-thrust machine, Nordic bench variants, extra cable stations, or “better” literature movements that you cannot load there.
- Dual-name EN/PL already exists; do not invent display names that are not library entries.

**Question.** Do we treat the exercise library as the gym — standing constraint for this whole overhaul?

**Your answer:** No, if you see any equipment on the list you just provided, you can invent new exercises for it if they are very good.




---

## 4. Gemini filter — keep vs kill

### Already in the product (do not rebuild)

| Gemini item | Reality |
|---|---|
| CATH-1 limiter feedback | `adjustForLimitingFatigue` in `src/features/cathedral/arches.ts` already shifts press → adduction |
| TRI-1 weak-point accessories | Trinary already maps off-chest / mid-range / lockout to variation lists |
| LAZ-2 acceleration gate | `shouldAccelerate` already exists in `src/features/lazarus/memoryCurve.ts` |
| QF-1 knee feedback | Quadfather docs already describe knee-feedback swaps |
| IM-1 radar as the *only* Immaculate upgrade | Ratios already live as notes; the missing piece is **load + extra dose**, not a chart |

### Keep (changes the training)

These survive because they alter load, volume quality, or recovery — not because they look like a feature.

| ID | Keep as | Why |
|---|---|---|
| TF-1 | Intra-session 10×10 collapse discount | GVT fails when set 5 is already 6 reps; finishing 10 junk sets is the opposite of the method |
| NO-1 | Couple wave 2 to wave 1 performance | That *is* the 1–6 thesis. Today the UI cannot even apply four different % loads |
| ATH-1 | Widen backoff if top set is a grind | Protects volume quality; cheap |
| IM-2 | Lagging-ratio third dose | Spec already promises it; code does not auto-add it |
| HF-2 | Nordic progression ladder | Nordics are a skill+eccentric; a 5-stage ladder is real programming |
| BO-1 | Earned rest-pause / myo on the work set | Fits Blackout’s “intensity is the overload” thesis; optional |
| PURG-1 | Seed intensification loads from accumulation e1RM | Block transition currently has no load memory |
| KALI-1 | Deficit-aware set prune | Only if it **removes** sets, never adds |

### Kill (fluff, or it makes the plan worse)

| Gemini item | Why it dies |
|---|---|
| Particle animations, audio chimes, graduation certificates, yoke/phenotype/mobility spider radars as the deliverable | Zero training effect |
| Arm circumference / HR / DOMS auto-taper widgets | Measurement theatre; DOMS is a bad volume governor |
| Knee-sleeve +5% load | Equipment does not change the prescription; it changes what the athlete can display |
| VL vs RF “bias selector” | EMG-split programming. Quadfather already has load / depth / burn roles, which is the useful split |
| Pre-exhaust pec deck before compounds | Usually *reduces* the load you can press. Cathedral’s arches already solve the limiter problem |
| Daily lateral booster on Overhead Dominion | Shoulders already ~41 attributed sets/week. More laterals is the wrong direction |
| OD-4 push-press peak as default | Changes the lift. Fine as an **optional** week-9–10 overload, not a silent swap |
| Wave 3 Overdrive (1 @ 95% + 6 @ 80%) | PAP literature: extra heavy singles add fatigue, not potentiation |
| 8×8 as a “smooth GVT consolidation” that still does 8 hard sets of 8 | Hackett saw lean-mass *loss* in the second 6 weeks of high-set GVT. Consolidation should drop to **5×10 or 6×6**, not 8×8 |
| Form-cue modals | General tips already exist; do not duplicate them in a popup |

**Question.** Kill-list as default? If you want to keep something from the kill table, list it.

**Your answer:** Looks ok




---

## 5. Shared intensification toolkit

Do not sprinkle myo-reps on everything. Attach one lever per plan, in a late block, on the *target* muscle only.

| Lever | When it is the right overload | When it is fluff |
|---|---|---|
| Double progression | Default for hypertrophy slots | Already tagged, not executed — see P0-2 |
| Wave load (5/4/3…) | Strength specialisation (KoS, OD press) | Hypertrophy isolation |
| Last-set to failure (2 hard sets) | Specialisation isolation, machines, cables, DBs | Squat / RDL / press / weighted-chin strength / 1–6 / 10×10 |
| Lengthened partials after failure | Stretch-day finishers (Cathedral flyes, Arms Race lengthened day, Foundry curls) | Replacing full-ROM compounds |
| Tempo 40X0 / 30X0 | Accumulation (Purgatorio, Foundry curls, Tenfold) | Strength singles |
| Density (rounds in a window) | Iron Clock, Arms Race density day, Redline furnace | Strength days |
| PAP 1–6 | Neural Overload only, with rest that matches the literature | Adding a third wave |
| Earned backoff | Blackout (already) | Scheduling backoffs that are not earned |
| Block flip acc/int | Purgatorio (already) | Flipping every plan into 3+3 |

**Question.** Is this the allowed toolkit, or do you want something added or removed?

**Your answer:** More mechanical dropsets and high effort -> low effort supersets on the same muscle group in specialization plans (for example going from pushups to light cable flyes,or from hacksquat to sissy squat). Possibly more tempo modulation on last reps. Explosiveness work also matters (review science in regards to it and apply some principles that could enhance programs)




---

## 6. Cross-cutting P0 — these beat any per-plan widget

### P0-1. Same-name slot load collision (confirmed live)

**Bug.** `definePlan`’s `calculateWeight` resolves by **exercise display name** and `.find()`s the first slot.

Live `test_workhorse` on Neural Overload W1 Bench Neural, paused bench 140 kg:

| Slot (spec) | Should be | UI showed |
|---|---|---|
| 1 @ 90% | **125 kg** | 125 kg |
| 6 @ 75% | **105 kg** | **125 kg** |
| 1 @ 92.5% | **130 kg** | **125 kg** |
| 6 @ 77.5% | **107.5–110 kg** | **125 kg** |

The 1–6 method is currently a 90% single repeated four times. That is not PAP. Same class of bug anywhere two slots share a name with different % (King of the Squat waves; Athena top-set vs backoff).

**Fix:** resolve by slot index / `target.percentage` already stamped on the set, never by name. WorkoutView already has a fallback that would do this *if the hook did not win first*.

W5 Discharge and W9 Overload still show four paused-bench rows at **125 kg**. Warm-up ramp (20 → 117.5) is duplicated under **each** of the four slots, so the sheet is a wall of grey and the last line clips (“lat activati”). Overload only drops accessory sets. Later weeks do not save P0-1.

**Question.** Fix Neural (and any same-name %) by slot, not by name? Also collapse the paused-bench warm-up so it only sits on the first of the four slots?

**Your answer:** Yes for both.




---

### P0-2. `progression: 'double'` is decorative on ~20 plans

`doubleProgression()` exists and is tested. `PROGRESSION_HANDLERS` only lists: Peachy, Pencilneck, Skeleton, Bench Domination, Pain & Glory, Ritual, Super Mutant, Trinary, House of Iron, Athena.

Almost every `definePlan` plan tags `progression: { type: 'double', increment: 2.5 }` and **nothing calls it on save**. `calculateWeight` only implements `percentage` / `wave` / `linear`. Result: the athlete types a load, and next week the field is empty or `0` unless they remember.

Venus Rising’s onboarding even advertises “Simple double progression.”

**Fix:** one generic save-time handler: if every prescribed set hits the top of the range cleanly, next session’s seed is `last + increment`. Do not invent per-plan handlers.

**Question.** Wire generic double for all `definePlan` slots, only each plan’s primary lifts, or leave it?

**Your answer:** Basically every lift needs some kind of progression, on bodybuilding plans we can do different kinds of progression, you can also review that and propose some solutions.




---

### P0-3. Opening-load seed is only wired on Atlas / Chimera / Oracle

`seedLoadFor` (inverse Epley × 0.95 from onboarding maxes) is the right idea. Machines are correctly excluded. Barbell/DB compounds on Quadfather, Cathedral, Workhorse, Neural, King of the Squat, etc. still open at blank/`0`.

**Fix:** call `seedLoadFor` in `definePlan`’s weight calculator as the fallback when there is no last log and the movement is in `LIFT_SOURCES`.

**Question.** Seed opening loads on the other plans? Barbell/DB only, or skip?

**Your answer:** Yes




---

### P0-4. Volume auditor has no ceiling

Week-1 attributed hard sets (from `verify:volume`):

| Plan | Specialty / problem | Sets |
|---|---|---|
| Overhead Dominion | shoulders | **41** |
| Arms Race | biceps **33** + triceps **24** | far past MAV |
| Cathedral | chest | **27** |
| Pencilneck | whole week | **144** total, no deload |
| Iron Clock | whole week | **154** (density rounds counted as sets — check the metric) |
| Tenfold | whole week | **138** |
| Venus / Athena / Kali | chest | **5–6** (hypertrophy plans underdosing a major) |
| The Minimum | chest / quads | **4** (intentional if bonuses unused) |
| Blackout | per muscle | **3–4** (intentional HIT) |

**Fix the auditor first:** add `maxWeeklySets` per kind (hypertrophy 22, specialisation target 28, others unset) and split delts into front/side/rear so Overhead Dominion is not punished for laterals + rear delts + press. Then use the report to cut junk, not to add more isolation.

**Question.** Add ceilings, ceilings plus split delts, or leave the auditor as frequency-only?

**Your answer:** For specialization plans we need to split by small muscle group for each exercise, and count fractional sets, 33 for biceps is fine, but 41 for shoulders will fry them I guess, focus on quality sets and intensifying techniques rather than straight sets - that's why Tenfold needs some overhaul, maybe a periodization of some kind




---

### P0-5. Total system weight is a note, not a number

Workhorse and Gravity Is Optional *say* they progress TSW. Live Workhorse W1D1: “Total system weight: bodyweight plus the belt” is a tip. The load field is belt weight (or empty). There is no bodyweight field in the set row, no TSW display, and double progression is not wired.

**Fix:** set row = belt kg; header shows `TSW = BW + belt`. Progress the belt when 6×5 (Workhorse) or the day’s target is clean. Require bodyweight at onboarding for these two plans.

**Question.** Wire TSW as a real number on Workhorse and Gravity?

**Your answer:** Bodyweight widget on dashboard and some nice calculation in the workout view shown for the user




---

### P0-6. Skeleton loses the week when days are remapped

`selectedDays` remap in `UserContext` keeps only days that **already have exercises**. Skeleton stores empty days and fills them in `preprocessDay`, reading week from `day.id` (`sk-w6-d1`). Remap replaces those with `{ dayName: 'Rest', exercises: [] }` **with no id**. Preprocess then always parses week **1**. Late phase (`w >= 9`, +1 set) never appears.

Live: `/workout/6/1` and `/workout/12/1` still say Full Body – Week 1, still 3 sets.

Pencilneck survives because exercises exist before remap, so `pn-w8-d1` ids live.

**Fix:** remap must copy `id` / `weekNumber`, or preprocess must take week from the URL / `weekData.weekNumber`, never from a reconstructed Rest stub.

**Question.** Fix Skeleton week ids so week 9+ actually adds a set?

**Your answer:** Yes




---

### P0-7 / P0-8. Text that is hard to read

Live contrast (normal text, 4.5:1 required):

| Surface | Ratio | Text |
|---|---|---|
| Bench Domination module chip `bg-primary/20 text-primary` | **3.81** | “Core Bench” |
| Pencilneck “5 Commandments” numbers `font-bold text-primary` | **3.79** | 1. 2. 3. 4. 5. |
| Kali `START EARTH` primary button | **4.32** | borderline |

`--muted-foreground` sits around 62–68% on a 4% background. On Gravity / Neural / Pencilneck that is the Polish secondary name, “Extra sets are yours to add”, placeholders, and the long warm-up paragraph. Peachy (the light theme) is the **clearest** of the set.

`.identity-row strong` is `.82rem` ellipsis; `.dashboard-command-label` is **.65rem**. Adventure’s “30 MINUTE ADVENTURE” overflowed the identity row at 390px.

**Fix:** raise muted-foreground toward ~75% on dark themes; stop using `text-primary` for body lists; let long plan names wrap in the rail. Bump `--primary` lightness on failing themes, or paint chips with `--foreground` / `--signal-text`.

Micro-labels at 9.6–10.9px (WEEK / EXERCISES / top-rail) are the instrument spec. I would leave those unless you want ≥12px.

**Question.** Global muted bump plus stop using `text-primary` for body lists? Per-theme only? Leave micro-labels?

**Your answer:** Per theme




---

### P0-9. Pain & Glory RPE modal is dark-on-dark

`WorkoutView` deficit modal: `text-amber-900` and `text-red-800` on `bg-card` (Pain & Glory card is ~13% lightness). Those Tailwind ambers are for **light** paper. The copy will vanish on the actual theme. That modal *is* the load feedback.

**Question.** Switch that modal to theme foreground tokens?

**Your answer:** Yes




---

### P0-10. Calendar dashboards ignore the week you opened

Athena / Venus / Kali / Apex / House compute week from `calendarPlanWeek(startDate, now)`. Injecting `currentWeek: 1` without `startDate` makes Athena’s dashboard say **Judgment** (week 12) while `/workout/1/1` correctly says Wisdom. Real athletes with a start date are fine; lab, reruns, and a missing `startDate` are not.

**Question.** Clamp those dashboards to the program week, or require `startDate` and leave calendar math?

**Your answer:** Yes




---

### P0-12. `strength_chart` always plots bench (except Peachy)

```208:210:src/pages/Dashboard.tsx
    const strengthHistory = isPeachy ? (user.squatHistory || []) : (user.benchHistory || []);
    const strengthChartTitle = isPeachy ? t('dashboard.cards.squatStrengthProgression') : t('dashboard.cards.strengthProgression');
```

King of the Squat, Overhead Dominion, Workhorse, Gravity, Foundry, Arms Race, Tenfold, Neural, Purgatorio, Immaculate all request `strength_chart` and get **paused-bench history**. That is not a tracker. It is a lie.

History fields today: `benchHistory`, `squatHistory`. Pencilneck already writes bench e1RM; Peachy writes heaviest squat. Everyone else with a chart is piggy-backing bench.

**Fix:** one `trackedLift` per plan (library id + history field). Append on save like Peachy/Pencilneck. Chart title = that lift’s name.

| Plan | Track this (already in the gym) |
|---|---|
| Bench Domination / Neural / Trinary | Paused bench e1RM (already) |
| King of the Squat / Athena / Peachy | Squat (heaviest or e1RM) |
| Pain & Glory | Conventional + deficit snatch-grip (Glory Counter already; keep it) |
| Ritual | Altar already has bench / squat / deadlift — **keep**, do not add a fourth sparkline |
| Overhead Dominion | Standing press |
| Workhorse / Gravity | Chin **belt kg** (TSW = BW + belt, P0-5) |
| Hamstring Foundry | RDL heaviest |
| Arms Race | Straight-bar curl heaviest **and** close-grip bench (two numbers, one card, no dual rainbow) |
| Cathedral | Incline DB heaviest |
| Quadfather | Hack squat heaviest |
| Tenfold | The day’s 10×10 load (chest / quad / back / ham) — four small figures, not a bench line |
| Immaculate | The lagging lift’s working weight |
| Pencilneck | Bench e1RM (already logged) — **replace** commandments + fake trap barometer with this number + a goal |

**Question.** Accept this `trackedLift` map, or change specific plans?

**Your answer:** Yes




---

## 7. Two hard sets, last to failure

You are right: **3×8–12 on everything is the default habit**, not a method. Quadfather / Cathedral already mix 4 / 3 / 2 / 1. Most `definePlan` specialisation accessories and almost all of Pencilneck are still `sets: 3`.

Two hard sets, set 1 at RIR 1–2, set 2 to true failure:

- raises quality per minute
- frees recovery for the *next* specialised session (the whole point of Arms Race / OD / Foundry / Cathedral frequency)
- cuts the volume-ceiling problem without deleting the exercise

**Never** take these to failure: squat, RDL, standing press, deficit / snatch-grip pull, weighted chin strength work, close-grip 4–6, Neural 1–6, Tenfold 10×10, any axial grind. Failure lives on **machines, cables, DBs, unilateral, isolation**.

There is no `last-set-failure` kind yet. `TechniqueScope` already has `'last'`. Add `{ kind: 'last-set-failure' }`. UI: badge on the last working set only (`TO FAILURE` / `DO ZAŁAMANIA`). Logging: last set is AMRAP, no cap. Double progression: if that AMRAP hits the top of the range, add the increment next time (still P0-2). Same library ids — `hardTwo(ex, reps)`.

| Plan | Convert to 2 + last-to-failure | Leave as-is |
|---|---|---|
| **Pencilneck** | Flyes, pec deck, laterals, rear delt, tri extensions, curls, leg extension, calf, ham curl | Bench / row / pulldown / hack / RDL stay 3 (heavier 6–10 in W5–8) |
| **Arms Race** | Lengthened + density isolation (incline DB curl, Bayesian cable, pressdown, skullcrusher, hammer curl). Day 2 reverse/hammer/overhead tri | Day 1 CGBP + straight-bar curl **5×4–6** | Keep it high volume, just try to incorporate more intensifying techniques, you can replace some sets
| **Overhead Dominion** | Cable lateral, rear-delt fly, reverse pec deck, pressdown | Standing press + weighted chin **5×5–8** | Definitely need a volume rework, more intensifying techniques rather than raw volume
| **Hamstring Foundry** | Upper accessories (press, row, lateral, curl, pressdown). Optional: the *second* seated-curl exposure in a week | RDL 4×5–8; first seated curl 4×8–12 @ 40X0 (that *is* the specialisation) |
| **Cathedral** | Pec deck, cable fly, crossover, laterals | Incline DB 4×6–10, dips 3, Smith incline 3 |
| **Quadfather** | Leg extension, sissy, reverse Nordic, laterals, arm maintenance | Hack 4×5–8, BSS/KOT 3, press 3 |
| **Workhorse / Gravity** | Chest / rear delt / tri / lateral accessories | Weighted chin / dip strength slots |
| **Peachy** | Seated ham curl, calf, laterals if present | Sumo / squat / BSS / hip thrust stay 3 — load is the overload |
| **Tenfold** | Accessories only (row, lateral, tri, curl) | The 10×10 (or 5×10 if you tick consolidation) |
| **Event Horizon / Chimera / Venus / Monolith** | Isolation slots currently at 3 | Systemic compounds |
| **Blackout / Kali / Minimum / Lazarus** | Skip or only on the isolation that is already a finisher | Intensity/density is already the method |
| **Strength plans** (BD, KoS, Ritual, Neural, Purgatorio, Atlas) | Isolation accessories only if they are 3× fluff | All main-lift work |

This is also how we cut Arms Race ~33 biceps sets and OD ~41 delt sets **without adding a fifth day or a new curl**.

**Question.** Hard-two on specialisation isolation, keep compounds? Also Pencilneck isolation in the same pass, or specialisation first?

**Your answer:** We need to weave the 2 sets in throughout the plans where it makes sense. Review scientific data and apply it.




---

## 8. Later-week pass (what actually changes after week 1)

Every plan was opened at week 1, a mid-block week, and the last week.

Phase **titles** mostly work. The training change underneath is uneven.

| Plan | W1 → mid → last (day 1) | Verdict |
|---|---|---|
| Workhorse | Ascent 6×3–5 → Overhang 6×3 → Chin-Up Trial 3×1–3 | Phases are real. TSW still a note |
| Tenfold | 10×10 → 10×10 → Consolidation **8×8–10** | Phase exists. Consolidation is still high-set GVT; prefer 5×10 / 6×6 |
| Neural | Charge → Discharge → Overload (accessories −1 set) | Title + accessory cut work. **All four 1–6 slots stay 125 kg in W5 and W9** |
| King of the Squat | Volume Waves → Intensity Waves → Test Week | Real wave change |
| Gravity | Ascent → Escape Velocity → Orbit | Real |
| Purgatorio | Accumulation → Intensification → Intensification II | Real. Still no load memory across the block cut (PURG-1) |
| Immaculate | Assessment → Correction → Re-Test | Real |
| Overhead Dominion | Bombardment through W5 → Artillery W10 | Mid-block is a label, not a cut |
| Hamstring Foundry | Forging through W5 → Tempering W10 | Same |
| Arms Race | Escalation through W4 → Proliferation W8 | Volume does not come down |
| Ritual | Ramp-In → Bench ME (W10) → Purge (W19) | Real |
| Bench Domination | Heavy → same pattern W8 → W16 legs maintenance | Peaking exists. A 4-day `selectedDays` remap can put `/1/1` on **Tuesday Legs** |
| Pencilneck | Same split all 8 weeks; W5–8 compounds go **6–10** via `preprocessDay` | Heavier phase is real. No deload. 144 sets still standing |
| Peachy | Same days all 12 weeks; W9–12 only adds a bodyweight drop-set note on BSS / reverse lunge | Weak intensification |
| Athena | Wisdom 6–8 → Discipline 4–6 → Judgment 3–5 | Workout weeks are real. Dashboard can say Judgment on week 1 if `startDate` is missing |
| Venus / Kali / Apex / House | Workout phases change | Same calendar-week dashboard trap |
| Atlas | Gauntlet I through W5 → Gauntlet II W10 | Real |
| Chimera | Block I → II (W8) → IV (W16) | Real |
| Event Horizon | Approach → Accretion → Escape | Real |
| Oracle | Calibration → Reading → Proof | Title changes; slot tree is one shape (engine is runtime) |
| Lazarus | Waking → Remembering → Returned | Real |
| Quadfather / Cathedral / Monolith / Blackout / Redline / Iron Clock / Minimum | Phase names change on schedule | Blackout / Kali / Minimum / Oracle / Atlas / Trinary trees are **one shape**; change is runtime or intensity |
| Skeleton | W1 / W6 / W12 all render **Full Body – Week 1**, 3 sets not 4 | **Bug.** P0-6 |
| Super Mutant | `/workout/*/1` = **Rest** | Needs `superMutantStatus`. Static day 1 is empty until `generateNextWorkout` |
| Adventure | No week tree; route builder | Fine. Identity-row name overflows at 390px |

Efficiency notes from this pass (not fluff):

1. Neural “Discharge” does not discharge. Weeks 4–6 are a rename. The 1–6 percents never move.
2. Tenfold Consolidation is 8×8–10. Still high-set GVT.
3. Overhead Dominion / Arms Race / Hamstring Foundry mid-block weeks are the same tree as week 1. Intensification is a title.
4. Peachy W9–12 only stamps a drop-set sentence.
5. Pencilneck W8 is still a full 9-exercise Push A. Heavier reps without a set cut is how you get 144 weekly sets with no deload.
6. Skeleton late phase never runs until P0-6 is fixed.
7. Workhorse trial week is correct (3×1–3). Wire TSW before inventing a new chin variation.
8. Atlas / Chimera / Oracle / Blackout / Kali look static in the generator because the engine mutates at save time. Do not flatten them into definePlan phases.

**Question.** Does Neural Discharge need to change 1–6 percents, only rest, or is the title enough? Any later-week row you disagree with?

**Your answer:** I agree with most, pencilneck requires a lot of rework.




---

## 9. Per-plan proposals

Each block: what is already good, what is leaving stimulus on the table, concrete change, then the question. Blank answer = leave that plan as-is.

### 9.1 Bench Domination

**Already good.** AMRAP-driven base, Thursday as 65% of last e1RM (non-compounding), forced + reactive deloads, module toggles. Matches a DUP bench specialisation.

**Leave on the table.** Wednesday volume is % only — no RPE/velocity brake. Accessory chest volume is modest once you count only competition-style bench (~14 chest sets in week 1, which is fine for a *strength* plan).

**Propose**

1. If Wednesday paused-bench average RIR ≥ 3 and Saturday AMRAP crushed the threshold, add **+2.5 kg to Saturday’s back-off only**, not to the base. Protects the test.
2. Paused vs touch-and-go as a **display/tempo** switch (11X0 vs 10X0), **not** a formula rewrite. Competition pause is the point of the plan.
3. Kill: live 1RM sparkline as a project. History chart already exists.

Gemini BD-1 (Wednesday RPE cutting Saturday target) is backwards: if Wednesday is hard, the athlete needs a **lighter Wednesday**, not a weaker test.

**Question.** Saturday back-off bump? Tempo display switch? Neither?

**Your answer:** All 3




---

### 9.2 King of the Squat

**Already good.** Descending waves, squat 3×, deadlift deliberately light (3×3 @ 57.5%). Week-1 quads ~25 sets — at the specialisation ceiling.

**Propose**

1. Confirm wave loads are **per set in the ladder**, not collapsed by name (same class as P0-1).
2. **Do not** add a third squat day or “front squat volume booster.” Recovery is the constraint.
3. Optional **stance/bar** swap (low-bar / high-bar / SSB) as an exercise swap from the library, not a new program.
4. Kill hip-capsule modal unless it **auto-swaps** to SSB after two flagged sessions (same pattern as Cathedral limiter).

**Question.** Stance swap? SSB auto-swap after two flags? Leave as-is?

**Your answer:** All 4




---

### 9.3 Pain & Glory

**Already good.** Speed → CAT → peak, RPE singles, 16 weeks.

**Problem.** Week-1 **140 attributed sets**, glutes 34 / hams 24, plus failure accessories. That is a hypertrophy week wearing a deadlift costume. RPE modal contrast is P0-9.

**Propose**

1. Cap failure accessories at **1 set** or convert to RIR 1–2.
2. Speed day 10×6 @ 45% is a lot of spinal cycles. Offer **8×3** or **6×2** as a “low-fatigue speed” module for older backs.
3. Kill wrap/sleeve/belt RPE fudge. Belt is a skill, not a +% cheat.

**Question.** Cut failure accessories? Speed-volume module?

**Your answer:** This is where we could incorporate the 2 sets on accessories, also limit going to failure when there's a lot of other work. I like all changes




---

### 9.4 Trinary

**Already good.** ME/DE/RE, weak-point variations, RPE ME.

**Propose**

1. Bands/chains as an **optional DE load note** (accommodating resistance %), not a new engine.
2. Kill ME record-board widget. History is enough.
3. If DE is always 60–70% straight weight, a “speed quality” hold (repeat week if bar speed died) is worth more than a dashboard.

**Question.** Bands/chains note? DE speed-hold?

**Your answer:** All of these




---

### 9.5 Ritual of Strength

**Already good.** ME singles, Purge deload, Ascension test. Week-1 chest **4 sets** — correct for MED powerlifting. Altar widget is the right dashboard.

**Propose.** Do not add hypertrophy volume. Optional: if ME RPE ≤ 7 two weeks running, jump +5 kg (already close to current +5 on RPE). Kill velocity-penalty amber chip unless it changes next week’s load (if it already does, just show the existing reason).

**Question.** Leave Ritual lean, or change something?

**Your answer:** I like all your proposals




---

### 9.6 Athena

**Already good.** Real save-time handler, top-set / backoff, 3/4-day. Workout weeks actually change: Wisdom 6–8 → Discipline 4–6 → Judgment 3–5.

**Propose**

1. If top-set RPE ≥ 9.5 or RIR 0, backoff drop **−15%** instead of −10% for that session only.
2. Week-12 AMRAP-on-the-single as an **opt-in**, default remains a confident single.
3. Chest ~6 sets/week is low for a “powerbuilding” label. Either own it as strength-primary or add **2** machine press sets on the second upper day (library Hammer / DB press).

Dashboard is currently a settings form (P0-10). See §10.

**Question.** Grind backoff? Week-12 AMRAP opt-in? +2 chest sets, or own it as strength-primary?

**Your answer:** I like all your proposals, only increase chest if we can cut some volume from elsewhere, maybe supersetting/intensifying




---

### 9.7 Pencilneck

**Already good.** Classic BB density, 3× frequency on yoke muscles. W5–8 compounds go 6–10 via `preprocessDay`.

**Problem.** 144 sets/week, **no deload**. That is how people quit in week 6. Commandment numbers fail contrast. Trap barometer “13% GONE” is not data.

**Propose**

1. Insert a **week-5 2/3-volume week** (or drop isolation to 1–2 sets / hard-two).
2. Trap/neck modules: **optional**, 6–9 extra sets max, not 3×2 extra days of shrugs plus harness. Direct neck work is fine as a 2×/week 3-set add-on — only if the movement is already in the library.
3. Kill yoke radar. Replace commandments + barometer with bench e1RM + a target (see §10).

**Question.** Week-5 cut? Neck module? Trap module? Hard-two on isolation in the same pass as specialisation plans?

**Your answer:** I like all your proposals




---

### 9.8 Super Mutant

**Already good.** RIR wave 2→1→0→past failure, 48h/72h cooldowns, reactive queue. Copy now matches RIR (not RPE). Recovery gauge changes the next session.

**Propose.** The real risk is **starvation vs stacking**: one muscle <10 hard sets while another >25. A weekly clamp “if group X < 8 sets in 7 days, next session must include it” is the efficiency upgrade. Kill the 12-axis spider unless it is that clamp’s UI. `/workout/*/1` is Rest until `superMutantStatus` exists — that is by design of the queue, not a missing week tree.

**Question.** 7-day underdose clamp?

**Your answer:** Yes




---

### 9.9 Venus Rising

**Already good.** 3/4-day trees, RPE escalation, priority +1 set.

**Problem.** Advertises double progression (P0-2). Chest **5 sets**/week on a physique plan. Arms 1 set.

**Propose**

1. Wire double (P0-2).
2. Floor **chest and side delts at 8–10** hard sets in 4-day mode (one extra fly or laterals slot from the library), or stop calling it a balanced physique plan.
3. Kill silhouette 65/35 selector until the floor exists — a ratio selector on an underdosed chest is decoration.

**Question.** Chest/delt floor? Silhouette selector later?

**Your answer:** I like all your proposals




---

### 9.10 Tenfold

**Already good.** One 10×10 per day (the constraint that makes GVT survivable). Live W1D1 matches: Hammer Chest 10×10, then accessories. Hold-until-complete is the right progression *idea*.

**Science.** 10 sets ≉ better than 5 (Hackett 2018). Weeks 6–12 of 10-set GVT can lose lean mass. Live consolidation is **8×8–10**.

**Propose**

1. If any set before set 6 is ≤7, prompt **−10% load** and finish the remaining sets at the new load. Do not grind 10 ugly sets.
2. Start load: 60% of a related max if known, else first-session calibrate. Currently no seed (correct for Hammer, wrong if you ever put a barbell in the tenfold slot).
3. Weeks 6–8: **5×10** or **6×6 @ +5–7.5%**, not Gemini’s 8×8. The point of consolidation is to **raise load**, not to keep drowning in sets.
4. Rest 90 s is inside the classic 60–90 window; keep it. Chimes are fluff.
5. Wire hold-until-complete as a real handler (today it is a note).
6. Hard-two on accessories only (row, lateral, tri, curl).

**Question.** Collapse prompt? Consolidation = 5×10, 6×6, or keep 8×8–10?

**Your answer:** I like all your proposals




---

### 9.11 Neural Overload

**Already good.** 90/75/92.5/77.5 on paper; day 4 is a low-neural strength day; singles are not tests.

**Broken in the app.** P0-1: all four loads = 90% in every phase.

**Propose**

1. Fix P0-1. Without this, no other Neural change matters.
2. Rest after the single: **240–300 s** (literature 4–8 min for 85–90% CA). Keep 180 s after the six if you want density.
3. If six #1 is RIR ≥ 3 **and** six #2 beats it in reps or bar-speed checkbox, next week’s sixes +2.5 kg, singles held. If single was a grind (RPE 10), **hold wave 2 at 90/75**.
4. **Kill wave 3.** Optional “overdrive” is how you miss week 7.
5. A “felt faster” checkbox is only useful if it feeds that coupling.
6. If the second six dies after a 90% single: lighter bar allowed, or % stays fixed and only rest changes?

**Question.** 240 s after singles? Couple next week to six-vs-six? No wave 3? Lighter second six allowed?

**Your answer:** I like all your proposals




---

### 9.12 Purgatorio

**Already good.** Acc 10–15 / short rest vs Int 5–8 / long rest, antagonist pairs, 30X0 in accumulation. Phase titles are real.

**Propose**

1. Seed intensification opening loads from accumulation e1RM (PURG-1). Block transition currently has no load memory.
2. Tempo metronome: **only if** missed tempo is a real failure mode you see in logs. Otherwise the 30X0 chip is enough.
3. Do not add a third block type.

**Question.** Seed loads across the acc → int cut?

**Your answer:** I like all your proposals




---

### 9.13 Quadfather

**Already good.** Three roles (load / depth / burn), ~23 quad sets, myo on burn in weeks 4–7. That *is* specialisation. Engines live in `roles.ts` and **no dashboard uses them**.

**Propose**

1. Do not add a VMO finisher on top of 23 sets. If anything, **cap quads at 22–24** and make burn quality higher (lengthened leg extension, cyclist/sissy already in the library). Hard-two on extension / sissy / reverse Nordic / laterals / arm maintenance.
2. Knee auto-swap (sissy / reverse Nordic → extension) after two “strained” flags — only if it **removes** shear, not if it adds a modal.
3. Kill VL/RF selector and sleeve +5%.
4. Dashboard: Load / Depth / Burn as three figures + “next session job” (§10).

**Question.** Knee auto-swap? No extra VMO work? Goal card on the dashboard?

**Your answer:** I like all your proposals




---

### 9.14 Cathedral

**Already good.** Three arches, no flat barbell, limiter already shifts press → adduction, myo on adduction weeks 4–7, chest 27 sets. `arches.ts` exists; dashboard ignores it.

**Propose**

1. 27 is above the hypertrophy band. **Do not add** costal flyes, 30 s stretches, or pre-exhaust. If pecs are the limiter, you are done. If triceps/delts are the limiter, the existing shifter should fire — verify it in the UI, not a new modal.
2. Optional **lengthened partials on the last flye set** (bottom ½) — this is the one stretch upgrade that matches Pedrosa/Wolf, and it costs zero extra sets. Library fly / crossover only.
3. Incline angle 15/30/45 as a **swap** (Smith 30 already in library), not a volume add.
4. Hard-two on pec deck / fly / crossover / laterals. Press stays 4/3.
5. Dashboard: Press / Stretch / Adduction as three figures + next session job.

**Question.** Last-set lengthened partials on flyes? Incline-angle swap? No extra chest volume? Arch card on the dashboard?

**Your answer:** I like all your proposals




---

### 9.15 Arms Race

**Already good.** Four distinct exposures (heavy / brachialis / lengthened / density). That architecture is the plan.

**Problem.** Biceps 33 + triceps 24 attributed sets. Specialisation should be ~16–22 **hard** sets per arm muscle, not 30+ of mixed junk. Mid-block “Proliferation” does not cut volume.

**Propose**

1. Cut **1 set** from each non-lengthened arm slot, **and/or** hard-two on isolation. Keep four *exposures*, reduce *sets*. Density: myo / rest-pause on 2 exercises instead of giant-set volume.
2. Lengthened day: Bayesian / incline curl and overhead extension already belong here — make them the **lead** slots, not an add-on module.
3. Elbow “strained” → swap EZ/straight bar to neutral/cable (library). No circumference tracker unless you ask for tape in §10.
4. 3 s pause at long head stretch on overhead extensions: a **tip**, not a new engine.
5. Dashboard: curl + CGBP now vs start (P0-12).

**Question.** Is 33 biceps sets a short overreach you want, or should it live ~20 hard sets? Cut ~6–8 weekly arm sets? Bayesian as lengthened lead? Elbow auto-swap?

**Your answer:** More intensifying techniques rather than volume, but 33 isn't that bad for a spec program




---

### 9.16 Hamstring Foundry

**Already good.** Three functions, 40X0 curls, ~19 ham sets, seated curl already in the tree (Maeo 2021 supports seated > prone). Mid-block “Tempering” is mostly a title.

**Propose**

1. Default curl orientation **seated**. Lying/prone as the secondary, not 50/50.
2. Nordic **5-stage ladder** (band → 5 s ecc → partial → full → loaded) using existing Nordic/band library entries. This is real. Do not bury it in a tip.
3. If “lower back before hams” twice, swap the auxiliary hinge to seated curl + 45° extension (this one is training, not fluff).
4. GHD as a **swap** for a hinge slot only if it is already in the library — otherwise skip.
5. Hard-two on upper accessories. Keep RDL 4×5–8 and the first seated curl 4×8–12 @ 40X0.
6. Dashboard: RDL now vs start.

**Question.** Seated-first? Nordic ladder? LB-limiter swap? GHD swap only if it exists in the library?

**Your answer:** I like all your proposals




---

### 9.17 Overhead Dominion

**Already good.** 4× delt frequency, wave press in block 2, front/side/rear tracked separately in copy.

**Problem.** 41 attributed shoulder sets. Press already hammers front delts. Gemini’s “daily lateral booster” would make this worse. Mid-block is a label.

**Propose**

1. Split auditor into front/side/rear. Target **side ~12–16, rear ~8–12, front mostly from press**.
2. Cut 1–2 front-delt isolation sets if a dedicated front-raise exists. Hard-two on cable lateral, rear-delt fly, reverse pec deck, pressdown.
3. Impingement flag → landmine / neutral DB (swap from library), not extra face-pulls on top.
4. Optional **push press** as week 9–10 top set only, not a silent default.
5. Dashboard: press now vs onboarding. Laterals do not get a chart.

**Question.** Cut front-delt isolation? Impingement swap? Optional push-press peak in weeks 9–10?

**Your answer:** I like all your proposals




---

### 9.18 Peachy

**Already good.** 12 weeks, 4 days, glutes ~28 sets, paused squat 80%. Light theme is the most readable. Glute tape is the right specialisation metric. Squat chart is the right lift (the only plan where `strength_chart` is not secretly bench).

**Propose.** Direct abduction is the usual hole in glute plans. **2×/week** seated/leaning abduction from the library is enough — 3 sets or hard-two, no 30° lore. Stance guide = tip, not a card. Do not auto-taper on DOMS.

W9–12 currently only stamps a bodyweight drop-set note on BSS / reverse lunge. If the block is 12 weeks, W9 should add load or drop a set on squat / hip thrust.

Sparkline today uses hardcoded `#FF7A5C`. Must use theme tokens (§10).

**Question.** Add abduction 2×/week? W9 load/set change on squat or hip thrust? Keep tape as the goal widget?

**Your answer:** I like all your proposals 




---

### 9.19 Workhorse

**Live W1D1:** Weighted Chin 6×3–5, Hammer Chest 3×8–12, rear delt 15–20, tri 10–15, laterals 12–20. Matches the spec. Rest 210 s is in the source; TSW is a note. Trial week is correct (3×1–3).

**Propose.** P0-5 (TSW as a number) + P0-2 (double on the chin). Grip selector = swap (neutral / supinated / rings from the library). Dip:chin ratio card only if both are trained as TSW — they are not, so kill that. Hard-two on chest / rear delt / tri / lateral. Dashboard: chin TSW now / week-1 / trial target.

**Question.** TSW row? Grip swap?

**Your answer:** I like all your proposals




---

### 9.20 Gravity Is Optional

Same TSW gap as Workhorse. Total-rep days are the interesting overload — keep them, show **sets taken to hit 40**. Shoulder comfort → dip-width / deficit push-up swap from the library. Hard-two on accessories. Dashboard: chin TSW.

**Question.** TSW? Total-rep set counter?

**Your answer:** I like all your proposals




---

### 9.21 Immaculate (Re)Structure

**Already good.** Close-grip as reference, ER / reverse curl / preacher in the tree, copy correctly says “targets not medical thresholds.” Phases Assessment → Correction → Re-Test are real.

**Gap.** Ratios are notes. Weak-link third dose is promised in onboarding and **not auto-prescribed**. Loads are not % of close-grip.

**Propose**

1. After week-1 logs (or onboarding maxes), compute % vs close-grip. The **lowest** ratio gets **+2 sets** of that movement on days 2 and 4 (isolation, not another compound).
2. Optional: seed preacher / reverse curl / ER from close-grip × 0.46 / 0.30 / 0.09 as *opening* loads, athlete can overwrite.
3. Radar is optional UI **after** (1) exists. Dashboard: lagging lift’s working weight (P0-12).

**Question.** Auto-add the third dose, or only recommend and wait for confirm (Chimera-style)? Seed isolation from ratios? Radar later?

**Your answer:** I like all your proposals




---

### 9.22 From Skeleton to Threat

Beginner linear. Per-muscle often <10 on 3 days — correct. Do not add specialisation. Graduation screen is fluff; a “next plan” recommendation (Athena / Venus / House of Iron) is enough. Push-up PR + weeks-left are the right widgets. Quotes are fluff. P0-6 must land or week 9 never adds a set.

**Question.** Next-plan prompt at week 12? Kill quote card?

**Your answer:** I like all your proposals




---

### 9.23 House of Iron

Ladders are the overload. Kill particle steppers. Equipment increment filter (2 vs 4 kg jumps) actually changes when you move a rung — **keep that**. Equipment list is the right dashboard (constraint is the program).

**Question.** Keep increment filter, anything else?

**Your answer:** I like all your proposals




---

### 9.24 30 Minute Adventure

No progressive overload engine by design. Equipment exclusion filter is the only efficiency upgrade (stops drafting a lift you cannot do). Audio metronome is fluff. Identity-row name overflows at 390px — wrap, don’t ellipsis.

**Question.** Equipment exclusion filter? Wrap the plan name in the rail?

**Your answer:** I like all your proposals




---

### 9.25 REDLINE

Time cap is the thesis. 20-minute express that **prunes accessories** is valid. HR log is not. Do not let the furnace grow to 8 minutes if the next day’s anchor dies — cap furnace at **6 min** unless recovery check is green.

**Question.** 20-min prune? Furnace cap 6 min unless green?

**Your answer:** I like all your proposals




---

### 9.26 Iron Clock

Density *is* the progression. 154 “sets” is probably rounds×exercises — fix the metric before cutting. Visible countdown for the window is training (you cannot density-train without a clock). Particle bursts are not.

**Question.** Density timer if missing? Fix set-count metric before any volume cut?

**Your answer:** I like all your proposals




---

### 9.27 The Minimum

40 sets/week, 4 chest. Correct **if** bonuses are used. If logs show bonuses unused >50% of weeks, surface the bonus as a **default-on optional** with one tap, still not gating progression.

**Question.** Bonus one-tap prompt?

**Your answer:** I like all your proposals




---

### 9.28 Lazarus

Caps, memory curve, `shouldAccelerate` already exist. Gemini’s jump-to-week-4 is more aggressive than the current gate — **do not skip weeks**; accelerating load inside the current week is enough. Kill the pretty detraining curve unless it shows actual vs predicted 1RM.

**Question.** Leave acceleration as-is? Show predicted vs actual 1RM?

**Your answer:** I like all your proposals




---

### 9.29 Blackout

30 sets/week, earned backoff, quality mandatory. Matches HIT + Androulakis-Korakakis for **strength**. Hypertrophy will be suboptimal — the plan should say so in onboarding (it does). Skip hard-two except on an isolation that is already a finisher.

**Propose.** Optional rest-pause cluster **instead of** a second backoff, not on top. Machine swap for pain is Event Horizon’s job; do not duplicate.

**Question.** Rest-pause as earned intensifier (replacing a backoff, not stacking)?

**Your answer:** I like all your proposals




---

### 9.30 Monolith

Machine U/L, effort then drops. Microplates on stacks are a real load problem (2.5 kg jumps on a 10-rep machine stall people). Cam-curve essays are tips. Hard-two on isolation currently at 3.

**Question.** 1.25 kg add-on in rounding?

**Your answer:** We usually have the option of smaller plates on most machines except: pec deck, rear delt fly machine, leg extension machine, chest pressdown machine (these go up only by 5kg), I will get back to you what are the jumps on other machines later, hold for now




---

### 9.31 Kali

~59 sets, intensifiers only late, many 1-set slots. Correct for a cut. “Performance retained %” is the right widget — keep, make the numbers large. Deficit selector that **removes** 1 accessory when “aggressive” is the only Gemini Kali item that is training. Do not add volume. Skip hard-two.

**Question.** Aggressive = −1 accessory/day?

**Your answer:** I like all your proposals




---

### 9.32 Atlas

Carries as time×load is the interesting bit. Limiting-factor (grip / trap / trunk) should change the **next carry variation**, not add accessories. Distance vs time switch is real programming. Gauntlet I → II is a real later-week change.

**Question.** Limiter → next carry variant? Distance/time switch?

**Your answer:** I like all your proposals




---

### 9.33 Event Horizon

Cost-aware swaps already exist and passed group-6 tests. A live “fatigue budget meter” is only useful if swaps are priced. One-tap low-cost day is a **deload**, name it that. Hard-two on isolation currently at 3.

**Question.** Priced budget meter? Named low-cost deload?

**Your answer:** I like all your proposals




---

### 9.34 Project Chimera

±2 sets/quality/block is conservative on purpose. If a quality is still the worst after two blocks, allow **±4** once. Mutation tree UI is fluff; a table of six qualities is enough. Hard-two on isolation currently at 3.

**Question.** ±4 after two failed ±2 blocks?

**Your answer:** I like all your proposals




---

### 9.35 Oracle

Prediction + stated confidence is the product. Accuracy tracker is **not** fluff if it already computes the delta — show it. Confidence badges on the set are OK if they are the same numbers, not a new model.

**Question.** Show predicted vs logged on the set?

**Your answer:** I like all your proposals




---

### 9.36 Apex Predator

Assessment → access slots is the thesis. Re-tests at 4/8/12 already in copy. Radar is optional. Do not add volume; empty placeholders underdose — if a region is skipped, **fill with a default access movement from the library**, do not leave a hole. Assessment scores are the goal widget — do not add a bench chart.

**Question.** Default fill for skipped regions?

**Your answer:** I like all your proposals




---

## 10. Dashboards — keep the lift trackers, kill the theatre, fit the sheet

The strength 1RM + history line is the right idea. Two problems: most specialisation dashboards do not track **their** lift (P0-12), and the chart is a Recharts default sitting on an instrument sheet.

### Keep — they are the goal

| Widget | Why it stays |
|---|---|
| Bench 1RM + chart (once it is the right lift) | Strength plans live or die on this |
| Ritual Strength Altar | Three numbers, one glance, on-theme |
| P&G Glory Counter + deficit tracker | Tonnes pulled is the motivation; deficit load is the method |
| Skeleton deficit push-up PR + weeks-left | The actual beginner goal |
| Peachy glute cm log | The specialisation metric. Sparkline must use theme tokens (today `stroke="#FF7A5C"`) |
| Super Mutant recovery gauge | It changes the next session |
| House equipment list | Constraint is the program |
| Adventure route command | The plan *is* the picker |
| Kali performance retained % | The cut’s actual goal — make the numbers large |
| Apex assessment scores | The thesis — do not add a bench chart |

### Replace — flavour sitting where a goal should be

| Now | Replace with |
|---|---|
| `program_status` “Week N / Viewing schedule” | Delete. The command header already has the week |
| Pencilneck commandments + trap barometer (“13% GONE” is not data) | Bench e1RM + a **target** you set at onboarding |
| Skeleton quotes / mutant mindset | Push-up PR is enough |
| Athena / Venus dashboards | They are **settings forms**. Keep the selectors, add squat / hinge / press **current vs start** like the altar |
| Quadfather / Cathedral | Engines exist and **no dashboard uses them**. Show Load / Depth / Burn or Press / Stretch / Adduction as three figures + “next session job” |
| Workhorse / Gravity | Chin TSW now / TSW at week 1 / trial target |
| OD | Press now vs onboarding |
| Foundry | RDL now vs start |
| Arms Race | Curl + CGBP now vs start |
| Oracle / Chimera / Event Horizon | Honest engine output (prediction, mutation, cost) — they already have copy; do not slap a bench line on them |

### Kill

- Particle / chime / radar (already in Gemini kill-list)
- Circumference widgets on non-Peachy plans unless you ask for arm tape below
- A second generic “strength progression” card that is not the plan’s lift
- Rainbow `--chart-2`…`--chart-5` series on a single-lift card

**Question.** Kill `program_status`, trap barometer, and quote cards? Replace Pencilneck commandments with bench e1RM + onboarding target? Quadfather / Cathedral / Athena / Venus goal cards as above?

**Your answer:** I like all your proposals. Also get rid of 'Welcome' messages




---

### Chart style — instrument sheet, not a dashboard kit

Today: Recharts `monotone` line, dots on every point, `label` on every kg, hidden axes, Peachy sparkline hardcoded coral. Theme files define `--chart-1`…`5` as a hue wheel that nothing in the sheet language uses.

**Rules if we draw a graph**

1. Stroke = `hsl(var(--primary))`. Fill none. No area gradient.
2. One series unless the plan truly has two lifts (Ritual altar is numbers, not two lines).
3. Dots only on the **last** point. Tabular kg, Hanken / JetBrains, `hsl(var(--foreground))`.
4. No X/Y chrome. If a rule is needed, `var(--instrument-rule)` hairline, not a Recharts grid.
5. Height ~140px, full width of the card, no `pl-0` clipping.
6. Empty state = the onboarding max as a single point labelled Start — already done; keep it.
7. Peachy glute sparkline: same rules, drop `#FF7A5C`.
8. Do not animate. `prefers-reduced-motion` already matters in the sheet spec.

Goal-setting on the same card, not a second widget: **Start · Now · Target**. Target is set once at onboarding (or “beat week-1 by 5%”). That is motivation that is still a number.

**Question.** Accept these chart rules, or tweak?

**Your answer:** I like all your proposals




---

**Question.** Peachy keeps glute tape. For Arms Race / Pencilneck, is the bar/curl number enough, or do you want an optional arm tape like glutes?

**Your answer:** Add optional arm tape in arms, rest is fine




---

## 11. Implementation order (if you approve a slice)

Do not start with dashboards. Order is “does the next session get the right load and the right amount of hard sets.”

1. **P0-1** Neural slot loads (and same-name % anywhere)
2. **P0-6** Skeleton week id after remap
3. **P0-2** generic double-progression on save
4. **P0-3** seedLoadFor fallback
5. **P0-9** Pain & Glory modal tokens
6. **P0-8** muted-foreground bump + no `text-primary` on body lists
7. **P0-5** TSW for Workhorse + Gravity
8. Tenfold collapse + real hold-until-complete
9. Neural rest + six-vs-six coupling + single warm-up
10. Volume ceiling + delt split in the auditor
11. Hard-two + last-set-failure on specialisation isolation
12. **P0-12** trackedLift + instrument charts
13. Quadfather / Cathedral / Athena goal cards
14. Everything else you answered yes to

**Question.** Accept this order, or reorder / cut?

**Your answer:** Yes




---

## 12. What I will not do unless you explicitly override

- New plans.
- New exercises that are not already in `EXERCISE_BY_ID` / the gym library.
- More weekly days on specialisation plans that are already at 4.
- “Daily extra laterals / extra VMO / extra neck” on plans that are already past 20 hard sets on the target.
- Taking squat / RDL / standing press / weighted-chin strength work to failure.
- Replacing Poliquin 1–6, waves, or structural screening with a generic PPL.
- Treating Poliquin ratios as injury prediction.
- Building Gemini’s animation layer.
- A bench sparkline on a squat or chin plan.
