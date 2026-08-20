# House of Iron — focused implementation specification

**Status:** implemented 2026-08-10. The master roadmap supersedes conflicting
historical source wording.

## Product contract

House of Iron is an eight-week, repeatable minimal-equipment plan. It must work
with one dumbbell or kettlebell and solve limited loading through exercise
difficulty rather than endless repetitions. It is deliberately lighter-weight
than Super Mutant.

- Free-order session cards: `Push A`, `Pull A`, `Push B`, `Pull B`.
- Two sessions/week allowed, three recommended, four supported.
- No weekday lock and no fifth-session mode in this implementation.
- 12–15 prescribed working sets, normally 35–50 minutes.
- Carries/core are optional and never required to complete a session.
- Session recommendation is advisory. The athlete may select any card.

## Equipment onboarding

The athlete records every available implement as a list entry:

```ts
type HouseImplement = {
  id: string;
  type: 'dumbbell' | 'kettlebell';
  weightKg: number;
  count: 1 | 2;
};
```

At least one entry is required. A preferred implement type is chosen when both
types exist. A pair unlocks swaps but is never required. Assignment remains
editable; the plan must not assume a commercial-gym inventory.

## Session templates

Unilateral prescriptions mean weaker side first and equal reps on the stronger
side. They count as the listed number of working sets, not double, and sides are
not logged separately.

### Push A — chest and quads

1. Goblet heel-elevated squat — 3×8–15.
2. Single-arm floor press — 3×8–15.
3. Bulgarian split squat; reverse-lunge fallback — 2×8–15.
4. Push-up — 2×AMRAP, stop around 1–2 RIR.
5. Single-arm overhead triceps extension — 2×10–20.
6. Optional suitcase hold — 1–2×30–60 seconds.

### Pull A — back and hamstrings

1. Supported one-arm DB/KB row — 3×8–15.
2. DB/KB Romanian deadlift — 3×8–15.
3. DB/KB pullover — 2×10–20.
4. Single-leg RDL — 2×8–15.
5. User-selected curl variation — 2×10–20.
6. Optional suitcase carry or march — 1–2 rounds.

### Push B — shoulders and quads/glutes

1. Single-arm standing press — 3×6–12.
2. Goblet skater squat — 3×6–12.
3. Single-arm floor press — 2×10–15.
4. Supported sissy squat — 2×10–20.
5. Short-lever single-arm lateral raise — 2×12–25.
6. Close-grip push-up — 1–2×AMRAP.

### Pull B — back and glutes/hamstrings

1. B-stance RDL — 3×8–15.
2. Supported one-arm row variation — 3×10–20.
3. Glute bridge — 3×10–20; load `0` is valid.
4. Pullover — 2×12–20.
5. Rear-delt row — 2×12–20.
6. Hammer curl — 1–2×10–20.

The generic source-audit reports `Curl` and `One-Arm Row Variation` as missing
because they are roles, not canonical exercises. Onboarding resolves them to a
real library exercise; no generic placeholder records are added.

## Eight-week cycle

- Weeks 1–2, Foundation: establish variants, standard tempo, 2–3 RIR.
- Weeks 3–4, Build: 1–2 RIR; introduce approved pause steps after rep mastery.
- Weeks 5–6, Harden: ROM/tempo progression on capped priority movements; safe
  final isolation sets may approach 1 RIR.
- Week 7, House on Fire: hardest normal week; selected safe final sets may use
  0–1 RIR. No failure prescription for unilateral squats or RDLs.
- Week 8, Rebuild: reduce prescribed work 30–40%, retain movement difficulty,
  record outcomes, then offer a confirmed Cycle-2 progression.

## Fixed-load progression

Each exercise family receives an authored ladder. Unsupported stages are
skipped rather than generated from metadata:

1. top-range reps;
2. increased usable ROM;
3. one- then two-second pause in the difficult/lengthened position;
4. three- then four-second eccentric;
5. 1.5 reps on approved squats, split squats, bridges and presses;
6. approved unilateral/leverage child variation;
7. equivalent work in less block time on density-compatible exercises;
8. heavier-equipment recommendation.

Two clean top-range exposures produce a recommendation, never an automatic
mutation. `borderline`, `invalid`, technical-failure and pain-stopped work do
not progress the ladder. A confirmed step stores rep, ROM, pause, eccentric,
variation and density state at slot level. The heavier-equipment message appears
only after the useful authored ladder is exhausted.

## Balance and recommendation

Track weekly contributions to upper push, upper pull, knee-dominant lower and
hip-dominant lower. Recommend the session that repairs the largest deficit,
then the least-recent A/B card. Recent repetition and a session inside the last
24–48 hours lower a card's rank. Imbalance produces a warning, never a block.

## Persistence and verification

Store equipment, progression and selections under House-specific plan state;
generic per-plan preferences retain the selections on rerun. Completed work
also writes to PerformanceProfile. Required simulations cover two/three/four
session cadences, ignored recommendations, repeated cards, ladder confirmation,
Week-8 reduction, Cycle-2 rerun and optional carry omission.

## Confirmed implementation decisions

1. The two clean top-range exposures must be consecutive for the same exercise
   and variation.
2. Multiple weights are stored; the first qualifying exposure associates an
   exact listed implement with that exercise and remains editable.
3. Cycle 2 carries only earned and confirmed harder progressions.
4. Optional suitcase holds/carries are excluded from the required 12–15 sets
   and all balance counters.
5. Four weekly sessions is the maximum; there is no fifth-session mode.
