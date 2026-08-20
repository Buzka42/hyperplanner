# Wave 1 comparison — powerlifting plans, and the two non-powerlifting plans audited alongside them

> Companion to the individual v2 plan docs. Read those for full derivations;
> this file is the cross-plan diff. Five powerlifting plans (Pain & Glory,
> Trinary, Ritual of Strength, Bench Domination, King of the Squat) plus the
> two minimalist plans done first to calibrate method (The Minimum, Blackout).
> All figures pulled directly from the individual docs — nothing recomputed
> here.

---

## 1. The one-line verdict on each

| Plan | Verdict |
|---|---|
| **The Minimum** | Delivers its promise; needs real progression vectors and better-chosen omissions |
| **Blackout** | Best concept, most broken build — its two headline features are dead code |
| **Pain & Glory** | Cannot be started — onboarding write is rejected by Firestore rules |
| **Trinary** | Best-engineered system; two design bugs (dead variations, accessory trap) undermine it |
| **Ritual of Strength** | Best-periodised plan; a routing bug wrecks the first session for its target athlete |
| **Bench Domination** | Excellent bench engineering; back-work module silently does nothing for 9/16 weeks |
| **King of the Squat** | Best-scoped design; core wave progression never actually escalates |

**Every single one of the five dedicated-engine plans (Pain & Glory through
King of the Squat) has at least one critical-severity defect that breaks or
undermines its central promise.** None of the five is a design failure — all
five are well-conceived, well-researched programs. All five ship a bug that
prevents the design from being what it claims to be. That pattern, repeated
five times independently, is the single most important finding of Wave 1.

---

## 2. Wiring — does the plan's advertised engine actually run?

| Plan | Core mechanism | Wired? | Evidence |
|---|---|---|---|
| The Minimum | Double progression, bonus-session gating | ✅ Yes | Confirmed live; only missing real inter-week progression |
| Blackout | Earned back-off, mandatory quality/stop-reason capture | ❌ **No** | `earnedBackoff()` imported, re-exported, never called. Quality/RIR fields never collected — `WorkoutView`'s telemetry gate doesn't include Blackout |
| Pain & Glory | AMRAP-driven deficit progression, week-13 e1RM test | ⚠️ Unknown — **can't reach it** | Registration itself fails with `permission-denied` |
| Trinary | ME/DE/RE rotation, weak-point picker, variation rotation, rerun modal | ✅ Yes, all of it | Every effect traced source→UI→Firestore write and confirmed live |
| Ritual of Strength | Ramp-in skip, Ascension Test, ME singles, Light-day velocity flag | ✅ Yes, all of it | Confirmed live at week 5; only the *entry point* to that correct content is broken |
| Bench Domination | Weekly AMRAP checkpoint e1RM, non-compounding power day, deload auto-insert | ✅ Yes, all of it | The progression math is sound; a *specific exercise* (Weighted Pull-ups) is a static-data bug, not a wiring failure |
| King of the Squat | Wave loading escalating 5/4/3→4/3/2→3/2/1, hip/capsule auto-swap | ⚠️ Partially | Auto-swap wired and confirmed; wave *escalation* is mathematically absent — the engine runs, but computes the same thing three times |

Three distinct failure modes, not one:

1. **Total non-wiring** (Blackout) — the feature literally cannot execute; the code exists in isolation.
2. **Total inaccessibility** (Pain & Glory) — can't even get past the front door; unknown whether the engine works because the door doesn't open.
3. **Partial/silent wiring** (Bench Domination, King of the Squat, and to a lesser extent Ritual/Trinary's secondary bugs) — the *system* runs, but a specific data point, calculation term, or entry-point routing is wrong, and nothing in the UI signals it. **This is the more dangerous failure mode of the three**, because it produces a plausible-looking, fully-populated session that quietly delivers the wrong thing — no error, no missing button, just numbers that are wrong in a way only cross-checking against the source reveals.

Ritual and Trinary are the two systems that are *fully* wired end-to-end —
every effect I traced executed correctly — and both still carry a
critical-severity bug elsewhere (routing, and dead variations respectively).
Being fully wired is necessary but not sufficient.

---

## 3. The shared bug: plan-switch / fresh-registration routing

Found independently on **three separate plans** (Ritual, Bench Domination,
King of the Squat), via two different underlying mechanisms:

| Plan | Symptom | Mechanism |
|---|---|---|
| Ritual of Strength | Fresh registration correctly writes `ritualStatus.currentWeek: 5` to Firestore, but the dashboard's "next session" link ignores it and defaults to week 1 | Dashboard's next-session resolver doesn't consult plan-specific status fields |
| Bench Domination | Fresh registration shows "Week 5" with **no `programProgress['bench-domination']` entry existing in Firestore at all** | Stale client-side state from the previously-viewed plan leaks across `switchProgram()` |
| King of the Squat | Same symptom as Bench Domination, immediately after switching from Bench Domination's week 5 | Same leaked-state mechanism, third confirmation |

**This is conclusively a shared dashboard/routing defect**, not three
separate plan bugs. It was found by accident on Ritual (I happened to check
Firestore after a suspicious dashboard read) and then predicted and confirmed
twice more just by switching plans in sequence. Any plan whose week-1 content
differs meaningfully from whatever week the athlete was last viewing is at
risk — Bench Domination and King of the Squat happened to escape visible
damage only because their early weeks are structurally similar to week 5's.
**A plan where week 1 and week 5 differ substantially would silently start a
new athlete mid-program.** This is the highest-leverage single fix available
across the whole audit: one shared-code change resolves three (at least)
confirmed instances at once, and probably more not yet tested.

Also found once, closely related: **"Reset Current Progress" silently
ignores Ritual, Trinary, and Pain & Glory** — `resetProgram()`'s
`statusUpdates` allowlist only covers `benchDominationStatus`,
`pencilneckStatus`, `skeletonStatus`. Same root cause class: shared UI
promises a plan-agnostic behaviour; a hardcoded per-plan list predates the
plans that need it.

---

## 4. Systemic load — cross-plan

Weekly systemic totals and per-set intensity, pulled directly from each
plan's §5 (or equivalent):

| Plan | Weekly systemic | Sets/week | Per-set systemic | Deload? |
|---|---|---|---|---|
| Blackout | 31 | 22 | 1.41 | No (appropriate at this volume) |
| The Minimum | 44 | 29 | 1.52 | No (appropriate at this volume) |
| Pain & Glory | 144 (steady, wk 1) → 108 (wk 13) | 74 → 62 | 1.95 (wk 1) | **No, across 8 straight weeks** |
| King of the Squat | 148 (weeks 1–9, flat) → 69 (wk 12) | 77 → 34 | ~1.9 | **No, across 9 straight weeks** |
| Bench Domination | 139 | 95 | 1.46 | **Yes** — auto-inserted week 9 |
| Trinary | ~123/week (3× 41/session) | 45/block | 2.73 | No explicit deload; short blocks (9 wk) |
| Ritual of Strength | ~60/week (7 sets × 2.86/set, ME+Light only) | 7/lift | **2.86 (highest per-set)** | **Yes** — 3 auto-inserted purge weeks, correctly cadenced |

**Ritual has the highest per-set intensity of any plan audited and the
lowest weekly accumulation** — the only plan whose systemic profile actually
matches a "minimum effective dose" claim. **Pain & Glory and King of the
Squat both run 8–9 straight weeks at a flat, undiminishing systemic load with
no deload** — the same missing-deload pattern, independently, on two
different plans by two different (implied) authors. Bench Domination is the
only plan of the five to auto-insert a real deload *and* correctly renumber
the weeks around it. Given how much engineering effort clearly went into
Ritual's and Bench Domination's deload/purge systems, it is a real gap that
Pain & Glory and King of the Squat — both single-lift-anchored specialisation
plans with the highest sustained systemic cost in the group — have nothing
equivalent.

---

## 5. Progression sophistication — ranked

Ordered by how much the auto-regulation actually adapts to the athlete's
performance, independent of whether it's wired correctly:

1. **Trinary** — three independently-tuned progression rules (ME by RPE band, DE by clean-set completion, RE by rep target), each *queued* to the correct future exposure rather than applied immediately. The most sophisticated design in the portfolio.
2. **Bench Domination** — weekly AMRAP-driven compounding base with hard resets to a fresh Epley e1RM at three checkpoints, deliberately never letting small estimates stack on each other. A second, independently-reasoned non-compounding calculation for the power day. Excellent design, letting down only by an unrelated static-data bug.
3. **Ritual of Strength** — RPE-checkbox ME progression with streak-awareness (two easy sessions auto-upgrades a +2.5 to a +5), Ascension Test e1RM recalculation that correctly zeroes the old accumulated bonus, and a bar-speed-triggered Light-day reduction. Comparable sophistication to Bench Domination, cleaner file organisation.
4. **King of the Squat** — wave-loading is a fine *idea* (5/4/3 → 4/3/2 → 3/2/1 climbing to a peak), undermined by §2/§3 of its own doc — the escalation the design calls for doesn't happen.
5. **Pain & Glory** — real, well-reasoned checkpoint-based e1RM system (identical philosophy to Bench Domination's), but entirely unverifiable — the plan cannot be registered into at all.

**Common thread:** every one of these systems independently arrived at the
same core discipline — *never let a small weekly bump compound indefinitely;
periodically reset to a freshly-tested number.* Four different plans, four
independent implementations, the same correct instinct. That consistency
across otherwise-unrelated plan files suggests either a shared design
document behind the scenes or a genuinely well-internalised principle — worth
knowing, because it means the *pattern* isn't the risk in this portfolio;
each individual implementation's small mistakes are.

---

## 6. File size and structure — does it predict bug density?

| Plan | Source size | Structure | Critical bugs found |
|---|---|---|---|
| Blackout | ~80 lines plan + 152 lines feature module | Clean, modern `definePlan` | 1 (total non-wiring) |
| The Minimum | ~80 lines | Clean, modern `definePlan` | 0 critical (progression-vector gap only) |
| Trinary | 564 + 163 lines | Legacy free-text, but well-organised | 2 |
| Ritual of Strength | 548 + 175 lines | Legacy free-text, but well-organised, best-commented file in the portfolio | 1 critical + 1 shared |
| King of the Squat | 165 + 33 lines | Modern `definePlan`, cleanest file of the five | 1 critical (in **shared** engine, not this file) + 1 shared |
| Bench Domination | **1,446 lines**, single file | Legacy, unstructured, contains shipped design-indecision comments | 1 critical + 1 shared |
| Pain & Glory | ~490 + 116 lines | Legacy free-text | Unknown — can't test |

**No clean correlation between raw file size and bug presence** — King of the
Squat is the smallest, cleanest file of the group and still carries a
critical bug, because its bug lives in the *shared* `planBuilder.ts` engine,
not its own file. Bench Domination's 1,446-line file is the extreme outlier
in size and does carry the most severe single-exercise defect found in Wave
1 — but the mechanism (three independently-typed copies of the same exercise
definition, one never fixed) is exactly the kind of error a monolithic file
invites and a shared/dry file structure would have prevented by construction.
The lesson isn't "big files are buggy," it's **"every place a value is
duplicated instead of computed once is a place a fix can apply to only some
of the copies."** That happened in Bench Domination (three pull-up
definitions) and, differently, in King of the Squat (display ladder updated,
calculation ladder not).

---

## 7. Free-text vs. modern `definePlan` — does the newer architecture help?

| Architecture | Plans | Critical bugs |
|---|---|---|
| Modern `definePlan` builder | Blackout, The Minimum, King of the Squat | Blackout: total non-wiring. King of the Squat: shared-engine math bug. The Minimum: none critical. |
| Legacy free-text | Trinary, Ritual, Bench Domination, Pain & Glory | Trinary: 2. Ritual: 1 (+ shared). Bench Domination: 1 (+ shared). Pain & Glory: unknown (blocked). |

The modern builder didn't prevent King of the Squat's bug — if anything, it
*enabled* it, because the shared `wavePercentForSet` function is exactly the
kind of reusable engine where a single subtle mistake (reading `.length`
instead of intended values) silently applies to every plan using `type:
'wave'`. The free-text plans' bugs are all local to their own files and
don't propagate. This is worth remembering for the rest of the audit: shared
engines concentrate risk into fewer, higher-blast-radius bugs; free-text
plans distribute risk into more, lower-blast-radius bugs. Neither is
strictly safer — they fail differently.

---

## 8. What actually works well, portfolio-wide (don't lose this in the bug list)

- **Warm-up ramp generation** — auto-computed, percentage-correct, on every plan checked, every time.
- **Tempo notation, rest timers, RIR/quality capture UI** (where wired) — consistently well-built components.
- **The "never compound an estimate on an estimate" discipline** — independently reinvented four times, always correctly.
- **Deload/purge auto-insertion with week renumbering** — done correctly (traced by hand) on both Ritual and Bench Domination, a genuinely hard scheduling problem solved twice without an off-by-one either time.
- **Live telemetry (RIR selectors, bar-speed flags, hip/capsule flags)** — every instance found actually wired (Athena-style topSetBackoff, Ritual's Light-day velocity, King of the Squat's hip/capsule streak) worked exactly as designed.
- **Onboarding calibration UX** — clean, well-copy-written, and (King of the Squat) correctly cross-plan-aware, pre-filling a bench 1RM already entered on a different plan.

The failure pattern in Wave 1 is not "these plans are badly designed." It's
"well-designed systems shipped with one or two specific, findable defects
that a systematic pass catches and a casual playtest would not" — exactly the
gap this audit exists to close.

---

## 9. Standing recommendations, ranked by leverage across the whole portfolio

1. **Fix the plan-switch/fresh-registration routing bug.** One shared-code
   change, three confirmed instances resolved at once, likely more latent.
2. **Fix `wavePercentForSet` to read phase-relative progression, not just
   ladder length.** Affects King of the Squat confirmed; check Neural
   Overload and any other `type: 'wave'` consumer for the same latent bug.
3. **Resolve Pain & Glory's Firestore permission block** — currently the only
   plan in the audit that cannot be evaluated at all.
4. **Wire or retire Blackout's `earnedBackoff`/quality-capture system** — the
   single largest gap between advertised and delivered functionality found
   so far.
5. **Fix Bench Domination's Weighted Pull-ups set counts** — highest-severity
   single-exercise defect found; three-line fix once located.
6. **Extend `resetProgram()`'s status-nulling allowlist** to cover every
   plan with a dedicated `xStatus` field, or rewrite its promise-copy to be
   plan-aware.
7. **Add deloads to Pain & Glory and King of the Squat** — both run
   8–9 weeks flat with no relief, the one gap Ritual and Bench Domination
   both already solved.

---

## 10. Reference table — every headline number in one place

| Plan | Length | Freq | Wk-1 sets | Systemic (wk1) | Deload | Critical bugs |
|---|---|---|---|---|---|---|
| The Minimum | 10wk | 2/wk | 29 | 44 | No | 0 |
| Blackout | 8wk | 3/wk | 22 | 31 | No | 1 |
| Pain & Glory | 16wk | 4/wk | 74 | 144 | No | Untestable |
| Trinary | 9 blocks (27 workouts) | 3-4/wk | 45/block | 41 (single session) | No | 2 |
| Ritual of Strength | 19 sched. wk | 3/wk | 7/lift | 20 (single session) | **Yes ×3** | 1 + shared |
| Bench Domination | 16wk | 6/wk | 95 | 139 | **Yes ×1** | 1 + shared |
| King of the Squat | 12wk | 4/wk | 77 | 148 | No | 1 + shared |
