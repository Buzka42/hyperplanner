# Portfolio and recommendations

## The matrix

`src/data/portfolio.ts` carries one row per plan. `verify:portfolio` fails if a
plan is missing a row, a row points at a plan that does not exist, or a declared
length drifts from the built program.

| Column | Meaning |
|---|---|
| `goal` | What the block is for. Overlap between plans is allowed. |
| `experience` | Who it is written for. |
| `frequency` | Sessions per week the plan actually requires. |
| `weeks` | Program length, checked against the built plan. |
| `equipment` | What it needs to run. |
| `adaptability` | `fixed`, `responsive` or `adaptive`. |
| `fatigue` | Weekly systemic cost on the shared 0–4 ordinal. |
| `signatureMechanic` | The one thing this plan does that no other does the same way. Unique across the portfolio. |
| `prerequisites` | What you need before starting. |
| `notForYouIf` | A real reason to walk away, not a disclaimer. |
| `followUps` | Plans worth considering after finishing. |

Similar broad goals are deliberately permitted. Where two plans share a goal
they differ by method or by assumed training experience, and the signature
mechanic is what carries that difference — which is why no two may be the same.
There are no overlap warning banners; the descriptions do that work.

## Recommendation

`src/features/portfolio/recommend.ts` is a filter with a ranking, not a scoring
model. Only three things exclude a plan:

- the athlete's access key does not include it;
- its lowest supported frequency exceeds the days they have;
- their equipment cannot run it (a full gym covers everything; a machine gym
  does not cover barbell work).

Everything else adjusts rank. An experience mismatch lowers the score and is
stated in the reasons rather than hiding the plan. A plan already completed
still appears, ranked lower, labelled as one they have run.

Every recommendation carries its reasons — always including the signature
mechanic — and its own `notForYouIf` lines, which are never suppressed.

The UI is `PlanFinder`, an opt-in panel above the onboarding catalogue. Three
questions produce a shortlist; the full grid stays the primary surface.

## Follow-ups

`followUpsFor(planId, completed)` returns nothing unless the plan is finished. A
plan you are halfway through is not a problem to be solved with a different
plan. Completion is the caller's judgement, taken from the plan's own state
rather than from elapsed calendar weeks.

Follow-ups respect the same eligibility rules, so nothing unreachable is
suggested. `FollowUps` renders them on the dashboard.

## Comparisons

`comparableTo(planId)` lists plans sharing a goal and explains how each differs.
It exists to answer "how is this different from that one", not to warn.
