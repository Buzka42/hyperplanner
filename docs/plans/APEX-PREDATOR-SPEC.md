# Apex Predator — implementation spec

Design doc: `HYPERPLANNER_APEX_PREDATOR_PLAN.md`. This is the build spec derived
from it plus the owner's four decisions.

**Correcting the earlier scoping.** `NEW-PLANS-IMPLEMENTATION-PLAN.md` listed
Apex as "the declarative one — probably needs no engine work". That was wrong,
and it was wrong because the audit script found no exercises in this doc and I
read that as "simple" rather than "differently shaped". The three base days are
declarative; the assessment battery, the per-user access slots, the retest
reallocation and ROM tracking are all new engine work.

---

## Decisions

| # | Question | Decision |
|---|---|---|
| 1 | Assessment length | **All 7 tests presented, each individually skippable** |
| 2 | Access slots | **Recomputed at each retest** (weeks 0, 4, 8, 12) |
| 3 | Pain on a test | **Invalidate that test, train normally** |
| 4 | ROM tracking | **Build with v1** |

### Consequence of #1 that needs a rule

Individually skippable tests mean the "two lowest valid regions" selection can
run on a profile with one or zero valid entries. That is not a hypothetical —
"skip everything" is the fastest path through onboarding and beginners will
take it.

**Rule: the emphasis selection needs at least 3 valid regions.** Below that the
plan assigns a **default module — ankle + thoracic rotation** — and says so
plainly on the profile: *"Not enough tests completed to pick your weak points.
Training the two most commonly restricted regions until you complete more."*
Completing tests later re-runs the selection at the next checkpoint.

Ankle and t-spine because they are the two the doc's own exercise mappings
support most fully, and because both are trainable with loaded work that
benefits everyone regardless of whether they were actually restricted.

**This rule is my call, not the owner's.** Flagging it as the one inferred
decision in this spec.

---

## 1. Data model

```ts
apexProfile = {
  assessments: [{
    week: 0 | 4 | 8 | 12,
    date: string,
    regions: {
      [region]: {
        left?:  number | null,   // null = skipped
        right?: number | null,
        pain?: 'none' | 'discomfort' | 'pain',
        valid: boolean,          // false when pain === 'pain' or skipped
      }
    }
  }],
  emphasis: { regions: [Region, Region], since: number },  // week it was set
  rom: { [exerciseId]: { level: number, updatedWeek: number } },
}
```

Regions: `ankle`, `hipFlexion`, `hipRotation`, `shoulderFlexion`,
`shoulderRotation`, `thoracicRotation`, `squatAccess`.

Scores are **ordinal 1–3**, not measurements. The doc is explicit about
avoiding fake precision, so the ankle test's centimetre reading is bucketed into
1–3 on entry and the raw number is kept only for the athlete's own reference.

## 2. Assessment flow

Week 0, after plan selection. Seven cards, each: instruction, a 1–3 score (L/R
where the test is sided), a pain question, and **Skip**.

- `pain === 'pain'` → test ends, `valid: false`, neutral copy: this region will
  not be assigned access work, consider a professional assessment. **No
  diagnosis, no cause attributed.**
- `pain === 'discomfort'` → valid, recorded.
- Skip → `valid: false`, no copy beyond a count of what's left.

## 3. Emphasis selection

At weeks 0, 4, 8 and 12:

1. take valid regions only;
2. if fewer than 3 → default module (see above);
3. otherwise pick the two lowest-scoring;
4. tie-break on the larger left/right asymmetry, then on the region not
   emphasised last block — so a checkpoint always changes something when the
   scores are flat;
5. within a chosen region, if one side scores lower, that side goes **first**
   in the session and gets **one** extra set. Not more — the doc says modest
   rebalancing, not punishment volume.

## 4. Base days

Declarative, `definePlan`, double progression, 3 days/week, 13–16 sets.

- **A — Lower access + push/pull:** heel-elevated goblet/hack squat 3, machine/DB
  chest press 3, supported row 3, leg curl 2, lateral raise 2, + access slots.
- **B — Hinge + vertical:** hip-supported DB deadlift/RDL 3, pulldown/assisted
  pull-up 3, half-kneeling or seated DB press 2–3, FFE split squat 2–3, rear
  delt 2, + access slot, core/carry 1.
- **C — Unilateral + shape:** reverse lunge / goblet skater squat 3, machine
  chest press / push-up 2, single-arm supported row 3, hip thrust 2–3, leg
  extension / calf 2, + access slots.

Phases: STALK 1–3 (2–3 RIR), FIRST HUNT 4 (retest, accessory volume down),
ADAPT 5–7 (1–2 RIR), SECOND HUNT 8 (retest), APEX 9–11 (hardest), FINAL HUNT 12
(volume −30–40%, final assessment, next-plan recommendation).

**No percentage progressions**, so Apex requires no 1RM and `verify:calibration`
will correctly find nothing to check. Double progression only — the doc is
explicit that the plan is already cognitively rich from the assessment system.

## 5. Access slots

A slot is a normal exercise carrying `accessRegion`. The plan file declares a
**placeholder slot** per day; `preprocessDay` swaps in the movement for the
current emphasis. That keeps the base days declarative and confines the
dynamic behaviour to one hook.

Mapping table (`src/data/apexAccess.ts`), keyed by region — exercise id,
equipment, unilateral, difficulty, pain guard, progression type. A table, not
conditionals scattered through the app, as the doc asks.

**Library gap: not yet triaged.** The audit found nothing for Apex because the
doc never writes a `sets × reps` prescription. The access movements need reading
out by hand and most look absent — knee-over-toe split squat, ankle rock, wall
slide, open-book, quadruped rotation, 90/90 transition, rotational row. Expect
**~8–10 additions**. Do this before writing the plan file.

## 6. ROM as a progression variable

Per-exercise `rom.level`, integer, starting 1. Applies only to exercises whose
mapping declares `progression: 'rom'` — pullover, split squat, RDL and the
access movements, not the base pressing and rowing.

- The console shows the current ROM cue for that level, not a number.
- After a session, an exercise at ROM progression asks one question:
  *"Did you control that range?"* — yes advances the level at the next exposure,
  no holds it. One tap, no new numeric input.
- Level is capped per exercise by the mapping so it cannot escalate forever.

This is deliberately the smallest thing that satisfies "treat ROM as a
progression variable" without inventing a range-measurement UI the phone cannot
honestly support.

## 7. Dashboard

An `APEX PROFILE` widget: region rows, L/R as three-dot ordinal marks, trend
arrows at checkpoints, and the current emphasis named in words. **No overall
percentage** — the doc bans it and it would be fake precision.

Renders in the Protocol Sheet's row grammar; the dots need a text equivalent
for screen readers, per the state-never-by-colour-or-shape-alone rule.

## 8. Build order

1. Library triage + additions for the access movements *(blocks everything)*
2. `apexAccess.ts` mapping table + region types
3. Assessment onboarding step
4. Emphasis selection + the <3-valid fallback
5. Base days via `definePlan` + the `preprocessDay` slot swap
6. Retest checkpoints at weeks 4/8/12
7. ROM level tracking + the one-tap question
8. `APEX PROFILE` dashboard widget
9. Theme tokens, cover art, i18n (EN+PL), registry in three places
10. `verify:apex` — every region maps to ≥1 valid exercise; every mapped
    exercise resolves; emphasis selection is deterministic; the fallback fires
    below 3 valid regions

## 9. What this plan must never do

From the doc, and worth restating because it is a safety boundary rather than a
style rule: Apex does not diagnose. Not injuries, not pathology, not
impingement, not instability. It does not attribute cause between regions ("your
ankle caused your squat problem") without separate supporting test data. The
CAGED / HUNTER / PREDATOR / APEX labels are gamification and must never be
presented as an assessment of health.
