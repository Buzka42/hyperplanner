# Venus Rising / Athena / Kali — implementation spec

Design doc: `HYPERPLANNER_VENUS_ATHENA_KALI_VALKYRIE_PLAN.md`. Shared
infrastructure: `PERFORMANCE-PROFILE-SPEC.md`. Valkyrie is deferred (owner
confirmed, doc §26 asks for the same).

This is the session-level spec: schedule modes, day allocation, phase
progression, and the pieces specific to each of the three plans. Kali's load
resolution is entirely PerformanceProfile's job and isn't repeated here.

---

## 1. The one new engine capability: schedule modes

`definePlan`'s `PlanSpec.days: DaySpec[]` is a single fixed list keyed by
`dayOfWeek`. Venus and Athena need **two** day-sets — 3-day FBW and 4-day
Upper/Lower — chosen per athlete and **switchable mid-program** (doc §12,
owner confirmed: applies from the next training week, preserves week number,
loads, progression state, history).

```ts
// New, optional — every other plan keeps using `days` and is unaffected.
export type PlanSpec = {
  // ...unchanged...
  days: DaySpec[];  // stays as the single-mode fallback
  scheduleModes?: {
    default: string;
    modes: Record<string, { label: string; days: DaySpec[] }>;
  };
};
```

`definePlan` resolves the active day-set as
`spec.scheduleModes ? spec.scheduleModes.modes[user.scheduleMode ?? spec.scheduleModes.default].days : spec.days`.
Every place that currently reads `spec.days` statically —
`requiredStatsFor`, `calibrationExercisesFor`, `buildWeightCalculator`'s
`byName` map — takes `user` (they already do, or the caller has it in scope)
and resolves through the same helper, so a mode switch can never leave a
stale slot mapping from the old mode active.

`user.scheduleMode?: string` is a new profile field, plan-scoped by convention
(`'venus-3day'` / `'venus-4day'`, not shared across plans — Athena's modes are
a separate value even though the shape is identical). Changed from Settings;
takes effect at the next `week` boundary, same rule the doc gives for
schedule switching generally — the resolver reads `user.scheduleMode` at the
start of each session, so an in-progress week keeps its already-resolved day
until the athlete's `week` counter increments.

This is the piece §13's "PROGRAM → PHASE TARGETS → SCHEDULE MODE →
ALLOCATION TEMPLATE → RESOLVED DAY" architecture actually needed; everything
below `SCHEDULE MODE` in that diagram is just `PlanSpec.days` per mode, which
`definePlan` already resolves the normal way.

---

## 2. Venus Rising

12 weeks. Priority: glutes, delts, back/lats, quads. Secondary: hamstrings,
chest, arms, calves, abs. 15–16 sets/session cap both modes.

### 4-day (Lower A/B, Upper A/B) and 3-day (FBW A/B/C)

Transcribed directly from doc §3–4 — both are already fully specified set-by-
set. No engine work beyond the schedule-mode plumbing above; these are two
ordinary `DaySpec[]` arrays.

### Phases

- **1–4 Foundation:** base templates, 2–3 RIR.
- **5–8 Rising:** 1–2 RIR **and** ~1 set added to selected priority exercises
  (2→3), staying inside the 15–16 cap. The doc's own text answers "volume or
  RIR" — both, RIR primarily, one set secondarily — so this needed no
  separate decision.
- **9–11 Ascension:** highest effort; final sets of selected safe isolations
  may reach 0–1 RIR. No intensification techniques.
- **12 Rebirth:** ~60–70% volume (3-set accessories → 2, 2-set → 1), keep
  load, some rep-PR opportunities.

Progression: double progression only, 3×8–12 pattern. Stall-breaking ladder
per §5: reps → ROM → pause → slower eccentric → harder variation — the same
shape as Apex's ROM-progression idea and House of Iron's fixed-load ladder,
worth eventually sharing one implementation across all three rather than
writing it a third time. Not done here; flagged for whichever of the three
ships last to generalize.

### Set cap resolution

Doc §1's priority order when a phase would exceed 16: keep the primary
movement, keep priority-muscle work, keep minimum frequency, drop the
lowest-priority isolation set last. Implemented as a `PhaseSpec.transform`
that runs this order as a fallback only if a phase's per-slot set additions
would push a day over 16 — Venus's phase 2 add is small enough (+1 set to 1–2
exercises) that this path is unlikely to trigger in practice, but it exists so
a future edit to the templates can't silently break the cap.

### Dashboard

Reuses the existing spec-row grammar (Day / Focus / Top set), no plan-specific
widget. **Inferred, not asked:** the doc's own open question #4 — "whether body
measurements are excluded to keep Venus distinct from Peachy" — is resolved
here as **excluded from Venus's dashboard**. Body measurement tracking already
exists generically (`gluteMeasurements` on the profile, used by Peachy); Venus
doesn't get its own copy of that widget, so the two plans read as different
programs rather than one wearing two skins. Measurement logging itself stays
available wherever it already is, just not surfaced as a Venus feature.

---

## 3. Athena

12 weeks, same schedule-mode mechanism, same 15–16 cap. Organized by movement
pattern (squat/hinge/horizontal press/vertical press/vertical pull/horizontal
pull/unilateral lower/delts/arms/core) rather than body part.

### 4-day and 3-day templates

Transcribed from doc §8–9. 3-day rotates emphasis (Squat / Hinge / Press +
secondary lower) rather than being a compressed 4-day.

### Phases — becomes harder through structure, not more sets

- **1–4 Wisdom:** double progression, 3–4×6–10, 2–3 RIR.
- **5–8 Discipline:** primary lifts convert to **top-set + back-off**:
  4–6 reps @ ~1–2 RIR for the top set, back-offs at −7.5–12.5% load for
  2–3×6–8. Total set count is unchanged (old 4×6–8 becomes 1 top + 3 back-off,
  still 4 sets) — this is a rep-scheme swap on the *same* slot, not a new
  slot, so it is a `PhaseSpec.transform` on the primary-lift slots rather than
  a different day template.
- **9–11 Command:** top set 3–5 reps @ ~1–2 RIR, back-offs 2–3×5–7. Doc allows
  dropping one back-off set on the most demanding lifts; the freed set is not
  replaced (accessory volume absorbs the cap, same rule as Venus).
- **12 Judgment:** accessories drop first; main-lift exposure preserved.
  **No mandatory 1RM test** — the doc is explicit about this, so "Week 12
  testing method" (doc §29 item 8) isn't an open question needing an answer;
  the top set of whatever the week's normal prescription is *is* the
  performance snapshot, recorded into PerformanceProfile like any other
  session.

### Top-set/back-off as a new progression type

Not expressible by the existing `percentage` / `wave` / `linear` /
`double` progression kinds — it needs **one slot to render as two different
prescriptions** (a heavier top set, then lighter uniform back-offs) with the
back-off's load derived from what the top set actually produced, which none of
today's types do; they all resolve independently per exposure. New
progression kind:

```ts
{ type: 'top-set-backoff', of: keyof LiftingStats, topReps: [number, number],
  backoffPercent: number, backoffSets: number, backoffReps: [number, number] }
```

Console rendering: the slot's set rows split into one top-set row (full
figure, prescribed independently) and N back-off rows whose weight is derived
*after* the top set is logged (`topWeight * (1 - backoffPercent)`), not before
— so back-off load reflects what was actually lifted, per the doc's whole
point of the structure. This is real console work, not just plan data; flagged
as the concrete new capability Athena needs beyond schedule modes.

### PerformanceProfile population

Athena is doc §24's "advanced onboarding program for the wider ecosystem" —
no special write path needed beyond what §3 of `PERFORMANCE-PROFILE-SPEC.md`
already gives every plan; Athena just produces cleaner data because its top
sets are near-limit by design.

**Left open, not decided here:** left/right unilateral storage (doc §29 item
9). The current logged-set shape has no `side` field — a set is weight × reps,
full stop. Splitting L/R would mean either two exercise ids
(`ffe-split-squat-left` / `-right`) or a new field on every logged set across
the app. Both are real data-model changes with consequences for history,
badges and PerformanceProfile beyond Athena. **This needs its own decision
before Athena's unilateral slots (FFE Bulgarian Split Squat) can record
per-side data** — until then they log as a single bilateral-shaped set, same
as every existing plan's unilateral exercises do today.

---

## 4. Kali

8 weeks, **4 days/week fixed** (doc §17: "initially make Kali fixed at 4
days/week" — no 3-day version in v1, doc §29 item 15 leaves it explicitly
open and it isn't needed to ship). 12–15 sets/session.

### Day structure — Earth / Hunt / Death / Rebirth

Transcribed from doc §17. Each day: one heavy anchor (3×3–6 or 3×4–6) plus
5–7 accessory slots, capped at 14–16 total.

**Day II anchor — owner decision, ≥5 strict pull-up reps → weighted pull-up,
else assisted pulldown.** Sourced first from any logged pull-up history
(Bench Domination and others log weighted/assisted pull-ups already — reused
via PerformanceProfile's exact-match tier once populated), else asked
directly at Kali onboarding: *"How many strict pull-ups can you do?"* Below 5,
Day II's anchor becomes an assisted pulldown at the same 3×4–6 prescription.
This is a plan-file-level choice made once at onboarding, not re-evaluated
session to session — an athlete who crosses the threshold mid-cycle keeps
their assigned anchor for that 8-week run rather than the plan silently
swapping movements under them.

### Systemic-compound and unilateral rules — need a guard script

Doc §15–16: at most one `systemicCompound: true` slot per day; at least one
unilateral slot per day. These are properties of the **plan file**, checkable
statically — a new `verify:kali` (or folded into `verify:plans`) walks every
Kali day and asserts both, the same way `verify:volume` checks frequency and
`verify:calibration` checks the onboarding contract. `systemicCompound` is a
new boolean on `SlotSpec`, defaulting `false`; the doc's own examples (heavy
squat/deadlift/bench/OHP/weighted pull-up = true; machine work, cable work,
most supported unilateral work = false) are the seed values.

### Weekly targets, intensification

Doc §18–19 transcribed as commentary/targets, not enforced numerically —
same posture `verify:volume` already takes toward every other plan's
targets (advisory, not a hard gate). Weeks 6–8: glutes and lats get
intensification techniques (rest-pause, myo-reps, dropset) that **replace**
straight sets rather than adding to them — implemented as a `PhaseSpec`
transform that swaps a slot's `technique` field for weeks 6–8 rather than
adding an extra slot, so total set count for that exercise doesn't increase
even though the doc's own list of "good techniques" implies more work per
set. Heavy anchors are explicitly excluded from intensification (doc §19's
"do not intensify" list) — the transform only touches non-`systemicCompound`
slots.

### Preservation Index

Doc §23. Rolls up e1RM history by **movement family** (Squat / Hinge / Push /
Pull), derived the same way PerformanceProfile's tier-3 fallback derives
family from `LibraryExercise.pattern` — no new taxonomy needed, reuse the
existing one. Baseline = the exercise's PerformanceProfile e1RM at the moment
Kali starts; current = latest. Percentage retained is a straight ratio,
displayed as the doc's own example (`Squat: 98% retained`), never as a single
overall number — same "no fake precision, no one blended score" rule the
contrast/volume work already follows elsewhere in this app.

Bodyweight-change context (doc §23, optional) is out of scope for v1 — it
needs a bodyweight-logging surface Kali doesn't currently have reason to
introduce, and the Preservation Index reads fine without it.

---

## 5. Build order

1. Schedule-mode plumbing in `planBuilder.ts` (§1 above) — the one piece both
   Venus and Athena depend on.
2. Venus 3-day + 4-day templates, phases, dashboard exclusion.
3. Athena templates + phases + the new `top-set-backoff` progression type and
   console rendering.
4. PerformanceProfile write hook + `lastProgramId` (from
   `PERFORMANCE-PROFILE-SPEC.md`) — can happen in parallel with 2–3, since it
   doesn't depend on either plan existing.
5. Kali templates + `systemicCompound` field + `verify:kali` guard +
   intensification phase transform + Preservation Index.
6. Registry (three places), theming, i18n for all three.

**Left/right unilateral storage (Athena) is a blocking decision, not yet
made** — flagged in §3 above. Athena can ship without it (unilateral slots log
bilaterally, same as everywhere else today) but the doc's own emphasis on
"useful left/right performance data" won't be delivered until it is.
