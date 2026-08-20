# Ritual of Strength

> Unified plan document, v2 format. Supersedes `docs/plans/ritual-of-strength.md`.
> Volume from `docs/analysis/exercise-attribution-map.md`; systemic figures
> from each movement's `intelligence` block. Onboarding, routing and load
> calculations verified live via `test_claude` (calibrated bench 100 /
> deadlift 200 / squat 160 kg, "not first program" branch).

| | |
|---|---|
| **id** | `ritual-of-strength` |
| **Length** | 19 schedule weeks (4 ramp-in + 12 main + 3 dynamically-inserted purge/deload) |
| **Frequency** | 3 days/week (Mon/Wed/Fri suggested) |
| **Weekly sets** | 7 barbell sets/lift/week (1 ME + 6 Light) + up to 9 user-chosen accessory sets/day |
| **Declared kind** | `powerlifting` (exempt from frequency floors) |
| **Calibration** | Bench, squat, deadlift 1RM + "is this your first program?" branch |
| **Progression** | Dedicated handler, mostly well wired, **one confirmed high-severity routing bug** |
| **Source** | `src/data/ritual.ts` (548 lines) · `src/features/workout/progression/ritual.ts` (175 lines) |
| **Stated promise** | *"3 day/week minimum effective dose powerlifting program... ME singles + RPE based progression."* |

---

## 1. Structure

### The 19-week schedule

Ritual's week numbering is genuinely clever: 16 "training weeks" (4 ramp-in +
12 main) get 3 additional **purge weeks** spliced in automatically after every
Ascension Test, so the schedule the athlete sees runs 1–19:

| Schedule weeks | Content |
|---|---|
| 1–4 | Ramp-in (first-timers only) — competition-style singles at rising volume, no ME/Light split yet |
| 5–8 | Main phase, block 1 |
| **9** | **Purge week** (auto-inserted after week 8's Ascension Test) |
| 10–13 | Main phase, block 2 (training weeks 9–12) |
| **14** | **Purge week** |
| 15–18 | Main phase, block 3 (training weeks 13–16) |
| **19** | **Purge week** |

Ascension Tests land on training weeks 8, 12, 16 → schedule weeks 8, 13, 18 —
each immediately followed by its purge week. That is a real periodisation
structure: test, then deliberately back off, on a fixed 4-week cadence. Traced
the schedule-week arithmetic (`createRitualWeeks`'s `scheduleWeek` mapping)
by hand against `getRitualTrainingWeek`'s inverse — both are internally
consistent with no off-by-one.

### Main-phase day structure (verified live, week 5)

| Day | ME lift | Light work | Verified load |
|---|---|---|---|
| 1 — Bench | Paused Bench Press (ME) 1×1 | Squat (Light) 3×5, Deadlift (Light) 3×5 | ME 95kg = 100×0.95 ✓ · Light 110kg = 160×0.70 (floored) ✓ |
| 2 — Squat | Low Bar Squat (ME) 1×1 | Bench (Light) 3×5, Deadlift (Light) 3×5 | — |
| 3 — Deadlift | Conventional Deadlift (ME) 1×1 | Bench (Light) 3×5, Squat (Light) 3×5, Farmer Holds | — |

Each lift receives **1 ME set + 6 Light sets per week** — 7 barbell-touching
exposures — plus up to 3 user-selected accessories (3×10–12 each) per session,
chosen once in Settings and applied automatically by `preprocessDay`.

### Purge weeks

Every purge week collapses each day to 1–2 sets per lift at a flat 70% for 5
reps — genuine deload, not a relabelled normal week (confirmed:
`createPurgeWeek` halves set counts and hardcodes `percentage: 0.70`,
independent of the athlete's actual block). **This is the only plan audited
so far with a real, automatically-scheduled deload**, and it lands at exactly
the right cadence (every 4–5 weeks) for the systemic load involved.

---

## 2. Wiring — mostly excellent, one confirmed live bug

| Feature | Status |
|---|---|
| Ramp-in skip for returning athletes | ✅ onboarding correctly writes `currentWeek: 5`, `isFirstProgram: false` |
| ME single progression (RPE checkbox → +2.5/+5kg, streak-aware) | ✅ traced and consistent |
| Ascension Test → new 1RM via Epley, floored | ✅, and correctly zeroes the accumulated ME bonus so it isn't double-counted on the new max |
| Back-down load (85% AMRAP × 80% = 68% 1RM) | ✅ verified against the formula in `calculateWeight` |
| Purge-week flat 70%/5 reps | ✅ independent of block, confirmed |
| Light-day bar-speed flag → 5% reduction next exposure | ✅ live-confirmed: "BAR SPEED WAS SLOW — REDUCE THIS LIFT BY 5% NEXT SESSION" rendered correctly on the squat Light set |
| Schedule advances every 3 completed sessions | ✅ verified by construction (linear 1–19 counter with no gaps) |
| **Default "next session" routing for a fresh, non-first-program registration** | ❌ **confirmed broken — see §3.1** |

### 2.1 The routing bug, confirmed step by step

1. Onboarding: selected "NO – jump to main phase" → Firestore confirms
   `ritualStatus: { currentWeek: 5, isFirstProgram: false, rampInComplete: true }`.
2. Dashboard's "NEXT SESSION" card reads **"Day 1 – Bench (Ramp-In)" / WEEK 1**,
   and its `START WORKOUT` link points at `/app/workout/1/1`.
3. Following that link loads genuine week-1 ramp-in content: Paused Bench
   Press 3×9 @ **70kg** (100 × 0.70 — the week-1 ramp-in percentage, not the
   week-5 ME percentage).
4. Manually stepping the dashboard's week selector to **5** surfaces the
   correct content at its own route (`/app/workout/5/1`): "Day 1 – Bench ME",
   Paused Bench Press (ME) 1×1 @ **95kg** (100 × 0.95, correct), Squat (Light)
   3×5 @ 110kg (160 × 0.70, floored, correct).

**The content and every load calculation are correct wherever they're
reached.** The bug is narrow but severe: the dashboard's default entry point
for a brand-new profile does not consult `ritualStatus.currentWeek` — it
defaults to week 1, day 1, the same generic pointer every other plan uses for
a fresh `completedSessions: 0`. Ritual is the one plan in the portfolio whose
week number is *not* 1 at registration for a meaningful fraction of its
users, and the dashboard's shared "next session" logic doesn't know that.

**Impact:** an experienced powerlifter who explicitly told onboarding they
don't need the ramp-in is shown a ramp-in session, loaded at 70% 1RM for 9
reps — a warm-up-intensity session dressed as their first real workout. If
they don't notice the week number and manually correct it, they train the
entire 4-week ramp-in they opted out of, delaying real ME work by a month.
Nothing in the UI flags the mismatch; the session renders as if it's exactly
what's prescribed.

---

## 3. Findings

### 3.1 Fresh-registration routing ignores `ritualStatus.currentWeek` · **severity: critical**

Detailed above. The fix is narrow: the dashboard's next-session resolver needs
to special-case plans (Ritual, and any future plan) whose own status object
carries an authoritative current-week pointer, rather than falling through to
the shared `completedSessions`-based default. Given Trinary and Pain & Glory
both also maintain their own progression state, this class of bug is worth a
systematic check across every plan with a dedicated `xStatus` object, not just
a Ritual-specific patch.

### 3.2 "Reset Current Progress" silently ignores Ritual (and Trinary, Pain & Glory) · **severity: high**

Traced `resetProgram()` in `UserContext.tsx`:

```js
const statusUpdates: any = {};
if (currentId === 'bench-domination') statusUpdates.benchDominationStatus = null;
if (currentId === 'pencilneck-eradication') statusUpdates.pencilneckStatus = null;
if (currentId === 'skeleton-to-threat') statusUpdates.skeletonStatus = null;
// ritualStatus, trinaryStatus, painGloryStatus are never touched
```

The Settings button promises *"Reset your sessions to Week 1 Day 1. Stats and
history are preserved."* For Ritual, this is false: `completedSessions` and
`startDate` reset at the top level, but `ritualStatus.currentWeek`,
`benchMEProgression`/`squatMEProgression`/`deadliftMEProgression`,
`meEasyStreak` and every 1RM stay exactly where they were. An athlete who
resets expecting a clean slate keeps their accumulated ME progression bonuses
and stays on whatever week they'd reached — while the calendar/history view
now shows `completedSessions: 0`, creating a direct mismatch between what the
UI implies and what the plan-specific engine actually does. This is the same
class of bug as §3.1: a hardcoded plan allowlist that predates the plans with
their own status objects.

### 3.3 Ramp-in's Day/Rep scheme skips a rep target · **severity: low**

Ramp-in reps: week 1 → 9 reps, week 2 → 6 reps, week 3 → 3 reps, week 4 →
AMRAP test. A 9-6-3 taper is a reasonable intensity ramp, but there's no
explicit percentage shown to the athlete for weeks 1–3 in the same inline
style as the main phase (`calculateWeight` computes 70/80/90% correctly, but
the exercise notes text — `t:tips.ritualRampIn` — is a single shared
translation key across all three weeks, so the athlete can't tell from the
copy alone that week 3 is meaningfully heavier than week 1 beyond the rep
count changing). Minor, cosmetic.

### 3.4 Accessory selection has no muscle-balance guidance · **severity: low**

`RITUAL_ACCESSORIES` groups by day type only (bench/squat/deadlift), and the
athlete picks up to 3 freely in Settings. There's no check that the selection
covers a sensible spread (e.g. an athlete could pick 3 pressing accessories on
bench day and get zero pulling volume). Given how deliberately engineered the
rest of the plan is, this is the one place athlete choice is unconstrained.

### 3.5 UI/UX (live clickthrough)

| Finding | Severity | Detail |
|---|---|---|
| Strength Altar widget | — | Clean, correctly renders all three calibrated 1RMs; good use of the plan's theme |
| Bar-speed flag copy | — | "BAR SPEED WAS SLOW — REDUCE THIS LIFT BY 5% NEXT SESSION" is exactly the right amount of visible-but-not-alarming |
| Warm-up ramps | — | Auto-generated and percentage-correct on every exercise checked |
| First-program branch UI | — | Clear, simple yes/no gate with an explanation of what the ramp-in is for |
| Week selector on dashboard | — | Works correctly once the athlete finds it; but per §3.1 they should never need it on day one |

Shared defects from prior audits (plan cards not keyboard-reachable, some nav
controls unlabeled) assumed present, reported once in the final compilation.

---

## 4. Weekly volume (main phase, per lift)

7 barbell sets/lift/week (1 ME + 6 Light, spread across the week as the
prime lift on its own day and the light exposure on the other two days) plus
grip and accessory work.

| Muscle | Sets/week | | Muscle | Sets/week |
|---|---|---|---|---|
| **Biceps femoris** | 7.0† | | **Semimemb/tendinosus** | 7.0† |
| **Glute max (lower)** | 7.0† | | **Vastus lat/med/int** | 7.0 each |
| **Pec lower** | 7.0† | | **Erectors** | 5.95 |
| Triceps lat/med | 3.5 each | | Front delt | 3.5 |
| Trap mid | 3.5 | | Forearm flexors | 6.5 (incl. Farmer Holds) |
| Adductors | 1.75 | | Rectus femoris | 1.75 |
| Triceps long | 1.75† | | — | — |

Structurally identical in shape to Trinary's blocks 1–3 volume (same three
lifts, same attribution profile) but at roughly half the sets/lift/week — 7 vs
15 — which is consistent with Ritual's "minimum effective dose" framing. The
gap is filled by up to 9 accessory sets/day, entirely athlete-directed, which
means actual accessory-muscle coverage varies athlete to athlete in a way that
isn't auditable from the plan definition alone.

---

## 5. Systemic and joint load

Week 5, Day 1 (Bench ME + Squat Light + Deadlift Light):

| Metric | Value |
|---|---|
| Systemic | **20** |
| Axial | **18** |
| Lower back | **15** |
| Sets | 7 |
| Per-set systemic | **2.86** |

Highest per-set systemic cost of any plan audited so far (Trinary 2.73,
Pain & Glory 1.95, Blackout 1.41) — but the session is only 7 barbell sets,
so the *absolute* weekly systemic total is far lower than Trinary's (roughly
60/week here vs Trinary's ~123/week across three 15-set sessions). This is
exactly what "minimum effective dose" should look like: high intensity per
set, low total accumulated fatigue, real deloads on a fixed cadence. Of every
powerlifting plan audited, this is the one whose systemic profile most
closely matches its own marketing claim.

---

## 6. Improvements, ranked

### 1. Fix the fresh-registration routing bug

Highest severity, and the fix is scoped: the dashboard's "next session"
resolver must check for a plan-specific current-week pointer
(`ritualStatus.currentWeek`, `trinaryStatus.completedWorkouts`,
`painGloryStatus`-equivalent if one exists) before falling back to the
generic `completedSessions`-based default. Given this is now confirmed
affecting Ritual and structurally likely to affect any plan with its own
progression state, this should be a shared fix in the dashboard's routing
logic, not a per-plan patch.

### 2. Make "Reset Current Progress" honest, or scope its copy per plan

Either extend `resetProgram()`'s `statusUpdates` to null out every plan's
dedicated status object (`ritualStatus`, `trinaryStatus`, `painGloryStatus`,
and any others sharing this pattern), or change the button's copy on those
plans to state precisely what it does and doesn't reset. The current universal
"Reset your sessions to Week 1 Day 1" promise is false for at least three
plans.

### 3. Show the ramp-in's actual percentage in the exercise copy

Weeks 1–3 compute 70/80/90% correctly but display a single shared tip that
doesn't state the number. Since the main phase already shows explicit
percentages in its notes (e.g. "work up to 90-95% 1RM"), matching that
transparency in the ramp-in costs nothing and helps a first-timer understand
why week 3 feels different from week 1 beyond "fewer reps."

### 4. Add a muscle-balance nudge to accessory selection

When the athlete picks accessories in Settings, flag (not block) a selection
that's all-push or all-pull for a given day — e.g. "You've picked 3 pressing
accessories for Bench day; consider a pull for balance." Low cost, and it's
the one place in an otherwise carefully-balanced plan where the athlete can
accidentally create an imbalance.

### 5. Confirm the same routing/reset bugs on Pain & Glory

Pain & Glory also maintains dedicated status (`painGloryStatus`) without a
`currentWeek` equivalent (it uses calendar-driven `calculateWeek` via
`startDate`, per the earlier audit), so §3.1's specific failure mode may not
apply there — but `resetProgram()`'s hardcoded allowlist affects it identically
for the reset-copy mismatch in §3.2. Worth a five-minute check once §2 is
scoped, rather than assuming Ritual is the only plan affected.

---

## 7. Verdict

**The most carefully periodised plan in the portfolio, undermined at the exact
moment it matters most: the first session a returning powerlifter sees.**

Everything about Ritual's design is deliberate and well-reasoned. The 19-week
schedule with three auto-inserted purge weeks on a fixed post-Ascension-Test
cadence is real periodisation, not a label. The ME/Light split at 7 barbell
sets/lift/week backed by up to 9 accessory sets is a legitimate minimum
effective dose, and its systemic profile — the highest per-set intensity
audited, at the lowest weekly accumulation — matches that claim better than
any other powerlifting plan reviewed so far. The progression logic (RPE
checkbox with streak-awareness, Ascension Test 1RM recalculation with correct
zeroing of the old ME bonus, bar-speed-triggered Light-day reduction) is
sound and, where I could verify it live, produced exactly the numbers it
should.

But the one thing every returning lifter does on day one — register, say "I
don't need the ramp-in," and start training — is broken. They land on a
warm-up-intensity ramp-in session with no indication anything is wrong, and
the only way to reach their correct week-5 content is to notice the week
number is off and manually step a selector to 5. For a plan whose entire pitch
is respecting an experienced athlete's time ("minimum effective dose"), asking
them to spend their first month on a ramp-in they explicitly declined is the
worst possible first impression. The fix is small and shared with at least two
other plans carrying the same architecture — it should be near the top of the
queue.

---

## 8. Export block

```yaml
id: ritual-of-strength
version: 2
length: { schedule_weeks: 19, ramp_in_weeks: 4, main_weeks: 12, purge_weeks: 3 }
frequency: 3_per_week
weekly_sets: { per_lift: { me: 1, light: 6 }, accessories_max: 9 }
kind: powerlifting
calibration: [bench1RM, squat1RM, deadlift1RM, isFirstProgram]
progression:
  me: { rule: "RPE checkbox, streak-aware +2.5/+5kg", wired: true }
  ascension_test: { rule: "Epley e1RM, floored, zeroes accumulated ME bonus", wired: true, cadence: "every 4 weeks" }
  light: { rule: "bar-speed flag -> -5% next exposure", wired: true }
  purge: { rule: "flat 70% x5, half sets", wired: true, auto_scheduled: true }
verified_loads: { bench_ramp_in_w1: "100*0.70=70 (confirmed)", bench_me_w5: "100*0.95=95 (confirmed)", squat_light_w5: "160*0.70->110 (confirmed)" }
systemic_load: { day1_week5: { systemic: 20, axial: 18, lower_back: 15, sets: 7, per_set: 2.86 } }
critical_bug: { area: "dashboard next-session routing", detail: "fresh non-first-program registration defaults to /app/workout/1/1 regardless of ritualStatus.currentWeek=5; content and math are correct once reached at the right route" }
reset_bug: { area: "Settings > Reset Current Progress", detail: "resetProgram() hardcoded allowlist omits ritualStatus/trinaryStatus/painGloryStatus; copy promise is false for these plans" }
audit: { date: 2026-08-14, findings: 5, verdict: "best-periodised plan in the portfolio; a routing bug undoes its first impression for the athletes it's built for" }
```
