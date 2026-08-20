# Plan audit — status and standing context

> **Read this file first in any new session continuing this audit.** It has
> everything needed to pick the work back up without re-deriving context:
> where things stand, how to test, what's already been found, and what to
> watch for based on patterns seen so far.

Last updated: 2026-08-16. **Audit documentation is closed.** Start at
`docs/plans/v2/_audit-closeout.md` (waves 0–7 + rebuild votes + variety maps +
leftovers). Live-defect synthesis remains
`docs/plans/v2/_end-of-audit-synthesis-report.md`. Findings-only per PROC-1;
does not authorize implementation. **Only remaining work the owner must open:
the implementation pass (PROC-1).** Iron Clock is parked until a dedicated
selection pass. REDLINE abs and Peachy core movements were not fully voted.

---

## 1. What this audit is

A plan-by-plan review of all 36 shipped training plans (+ Ghost in the
Machine, an unbuilt concept reviewed last), requested by the owner. For each
plan:

1. Weekly fractional muscle-group volume, using the attribution map (§2 below).
2. Full plan breakdown: CNS/systemic fatigue estimate, plan length, exercise
   order/superset pairing sanity.
3. A live browser clickthrough of the plan's distinctive features, checking
   both correctness and UI readability/intuitiveness.
4. An honest, science-backed viability verdict for the plan's stated purpose.
5. (Deferred to the advanced-plans wave) a roadmap for Project Chimera, Ghost
   in the Machine, Oracle, and possibly Immaculate + Apex.
6. A rewritten `.md` doc per plan in a unified format, replacing the
   original — written to `docs/plans/v2/`, originals in `docs/plans/*.md`
   untouched until the owner signs off on the replacement. **Complete
   (2026-08-15): see `docs/plans/v2/_end-of-audit-synthesis-report.md`**
   for the end-of-audit cross-plan synthesis this item also covers.

At least 5 ranked, science-based improvement suggestions per plan, ordered by
importance. No code changes during the audit itself — findings only. Findings
get fixed in a separate pass after the owner reviews.

---

## 2. The foundation: exercise attribution map

**File:** `docs/analysis/exercise-attribution-map.md`

Before any plan was reviewed, all 232 exercises in the library got a
from-scratch fractional muscle attribution (35 dimensions — up from the
library's native 23-key `MuscleGroup` union, which can't express upper/lower
pec, quad heads, glute subdivisions, triceps by head, etc.) plus strength
ratios against 8 anchor lifts (squat/bench/row/OHP/pull-up/deadlift/curl/
skullcrusher), each with a confidence grade (H/M/L).

**This map is the numeric basis for every volume table in every plan doc.**
Always compute from it — never eyeball muscle volume.

Also produced during that pass, and relevant to every future plan review:

- **A merge spec** for genuine exercise duplicates (4 identical seated-leg-curl
  entries, etc.) — approved by the owner, NOT YET APPLIED to the codebase
  (this was analysis-only; implementation is a future pass).
- **A list of attribution bugs already in the live data** — most importantly
  `reverse-nordic-curl`, which is filed as `hamstrings`/knee-flexion in the
  library but is mechanically a knee-*extension* (quad) movement. **This has
  now shown up as a real finding on two separate plans (Quadfather,
  Bench Domination)** — check for it on every remaining plan that trains legs.
- **Nine muscles with zero trained loader across all 36 plans** at the time of
  the library pass: soleus, tibialis anterior, direct adductors, direct
  erectors, upper traps, lower traps, serratus, isolated upper pec, and (thin
  coverage) rectus femoris. Worth checking whether any later-audited plan
  claims to cover one of these — it likely doesn't, and the map already
  explains why.

Read that file's own §25 ("Complete coverage findings") for the full list of
attribution bugs, concentration-risk exercises (13 movements appear in ~45%
of all plans), and proposed library additions.

---

**Wave 6 session note (2026-08-15, Super Mutant):** login and dashboard reads
worked fine on the first attempt (both a fresh tab and an already-open tab).
However, ordinary `updateDoc` writes to `test_claude`'s own user document
failed with `permission-denied` at two independent points this session — the
Super Mutant onboarding write, and (after an admin-privileged write seeded
the account into the plan to unblock testing) the save-time progression
write on a fully completed, fully logged workout. The `workouts/{id}` log
itself saved correctly both times the write path was exercised; only writes
to the user doc failed. Admin-privileged writes of the identical resulting
document succeeded instantly both times, isolating the failure to the
client write path rather than data shape — same isolation method as Apex
Predator's T-54. Given the failure touched portfolio-wide fields
(`completedSessions`) as well as plan-local ones (`superMutantStatus`),
worth watching on Neural Overload/Immaculate/Oracle/Project Chimera to see
whether this is Super-Mutant-specific or a broader `test_claude`
account/session-state issue (the account is now carrying state for ~30
plans). See `super-mutant.md` §1 for full detail.

## 3. Review order (owner-approved, plan by plan, not batched)

```
Wave 0 · Calibrate         The Minimum ✅, Blackout ✅
Wave 1 · Powerlifting      Pain & Glory ✅, Trinary ✅, Ritual of Strength ✅,
                           Bench Domination ✅, King of the Squat ✅
Wave 2 · Hypertrophy       Monolith, Purgatorio, Event Horizon, Tenfold, Pencilneck
  generalists
Wave 3 · Specialisation    Overhead Dominion, Arms Race, Hamstring Foundry,
                           Quadfather, Cathedral, Peachy, Workhorse, Gravity
Wave 4 · Powerbuilding /   Athena, Venus Rising, Kali, House of Iron
  physique
Wave 5 · Conditioning /    Iron Clock, REDLINE, 30-Min Adventure, Atlas,
  constrained               Lazarus, Skeleton, Apex Predator
Wave 6 · Advanced           Super Mutant, Neural Overload, Immaculate, Oracle,
  prototypes + roadmap      Project Chimera
Wave 7 · Concept            Ghost in the Machine (doc-only, feasibility + spec) ✅
```

**Wave 0-7 review order is fully complete.** Rebuild and variety votes are
complete (2026-08-16). Remaining work is the **implementation pass (PROC-1)**
when the owner opens it — see `_audit-closeout.md`.

**Wave 5 (conditioning / constrained) complete — Iron Clock, REDLINE, 30-Min
Adventure, Atlas, Lazarus, Skeleton, Apex Predator all done. Wave 6 (advanced
prototypes + roadmap) is now complete: Super Mutant, Neural Overload,
Immaculate, Oracle, and Project Chimera all done. Wave 7 (Ghost in the
Machine, doc-only) is now also complete, closing the full Wave 0-7 review
order.**

**Wave 7 summary (Ghost in the Machine, doc-only):** an existing pre-audit
pitch fragment was found (not written from scratch) describing camera-based
rep-quality/fatigue analysis driving autoregulation, deliberately sequenced
last of 12 original expansion concepts pending proof that reliable
computer-vision signal extraction was possible at all. That gate has since
been partially cleared: a video-lift-advice feature shipped, but inside Apex
Predator as an advisory bolt-on, not as a standalone Ghost plan — no
`src/data/plans/ghostInTheMachine.ts` or equivalent exists anywhere in the
repo. The Wave 7 doc assesses feasibility against this audit's own
accumulated findings rather than the pitch in isolation, and flags the same
dead-status-object/unwired-engine pattern that hit 5/5 Wave 6 plans as the
single most important thing a future Ghost build must design around from day
one, plus exposure to the still-unresolved shared write-path bug. See
`ghost-in-the-machine.md` for full detail and open questions for the owner.

**Wave 6 summary (5/5 plans done):** every single Wave 6 plan shipped with its
own headline mechanic either fully or partially non-functional — a 5/5 rate
with no exceptions, the worst per-wave "does the signature feature actually
work" record in the audit so far. Severity escalated across the wave rather
than staying flat: Super Mutant and Immaculate had broken *write* paths
freezing otherwise-real mechanics (13/12-muscle session locked forever;
1-of-6 ratio relationships reachable); Neural Overload's bug was a pure logic
gap (a two-state conditional standing in for three phases) rather than a
wiring failure; Oracle was the first "half genuinely works" case (the
prediction engine is real and good, the scoring/accuracy half is dead code);
and Project Chimera closes the wave as the single worst instance of the
whole audit — not a partial gap or a broken write, but a *fully authored,
zero-caller* reallocation engine with no UI stub anywhere in the app, the
cleanest "declared, wired, unreachable" case found across all 36+ plans.
T-9 (plan-switch/stale-week routing) reproduced on every Wave 6 plan checked
except Super Mutant, which was traced immune for a plan-local structural
reason (reads plan-local counters directly rather than the shared
`dashboardViewWeek` cache) — 4/5 exposure this wave, continuing the audit's
sharpened rule that immunity tracks with *what state a dashboard block
reads*, not merely whether it's a separate component. The `ownerUid`
write-path saga was this wave's dominant infrastructure story: it began on
Super Mutant as an unexplained `permission-denied` on two isolated write
call sites, widened through Neural Overload (a third unrelated write shape
failing identically) into "likely one shared condition," escalated on
Immaculate to blocking *login itself* (a fully absent `ownerUid` field) and
then a three-site failure in one session, hit a first *total* loss on Oracle
(every write in a completed-session flow failing together, including the
session log itself), and reproduced a final time on Project Chimera in the
more common *partial*-split shape (session log saves, user-document
progress writes silently fail) — eight structurally distinct failing write
call sites confirmed across five plans by wave's end, never once explained
by a rules-clause trace, and never once failing on an admin-privileged
write of the identical payload. **Status at wave close: unresolved.** This
is flagged as the single highest-priority infra item for the owner across
the whole audit to date, ahead of any individual plan-local finding. Compared
to prior waves' dominant themes — Wave 3's concentration on dead
UI-adjacent features (Cathedral/Quadfather/Event Horizon), Wave 4's T-2
allowlist gaps and preference-picker dead ends, Wave 5's mix of dead
progression systems and T-9 exposure — Wave 6's throughline is that the
portfolio's most ambitious engineering (prediction models, adaptive
reallocation, reactive scheduling) is consistently the least likely to
actually reach an athlete, whether through a broken write path or through
never being called at all.

**Session note (2026-08-15):** mid-Venus-Rising-audit, the browser tab lost
its authenticated `test_claude` session (device-lock error on re-login —
"keyword already in use on another device"). Venus Rising's doc was
finished from thorough source-level research rather than a fresh live
pass; two specific findings (T-9 immunity, live UI clickthrough) are
flagged in that doc as high-confidence-but-not-independently-re-verified-
live this session. **Kali's session hit the identical device-lock error
twice, several minutes apart** — its doc is also finished from source-level
trace (with a direct Firestore read confirming no stale/contaminated prior
Kali state, ruling out that alternative explanation). **House of Iron's
session logged in successfully on the first attempt** — the lock did not
recur a third time, and a full live pass (switch-in, equipment onboarding,
session selection, a complete 13-set logged workout, Firestore
cross-check) was completed. The lock appears to have been transient /
session-specific rather than a persistent block on the `test_claude`
account — worth trying live first on Wave 5 rather than assuming it will
recur, but falling back to source-trace-plus-Firestore-read (as
established on Venus Rising and Kali) remains the documented fallback if
it does.

**Root cause found and fixed (2026-08-15, later same day):** the device
lock was a stale `ownerUid` field on the `users/test_claude` doc, pinning
it to an old anonymous-auth session; the field was cleared. A dedicated
retro-verification session logged into `test_claude` on the first attempt
and completed full live passes on both Venus Rising and Kali, converting
their previously source-trace-only findings (T-9 immunity on both, Venus's
priority-selection write path, Kali's T-23 reproduction) to live-confirmed.
Kali's doc also had one finding corrected on live testing: the
`performanceProfile`/`isTestAccount` "untestable via `test_claude`" claim
was a misread — `test_claude`'s access key has `testAccount: false`, so
`isTestAccount` is never set on this account, and the feature is fully
testable live.

---

## 4. Files written so far

```
docs/analysis/exercise-attribution-map.md          — the shared foundation, §2 above
docs/plans/v2/the-minimum.md                        — Wave 0
docs/plans/v2/blackout.md                           — Wave 0
docs/plans/v2/pain-and-glory.md                     — Wave 1
docs/plans/v2/trinary.md                            — Wave 1
docs/plans/v2/ritual-of-strength.md                 — Wave 1
docs/plans/v2/bench-domination.md                   — Wave 1
docs/plans/v2/king-of-the-squat.md                  — Wave 1
docs/plans/v2/_comparison-wave1-powerlifting.md     — cross-plan diff, Wave 1
docs/plans/v2/monolith.md                           — Wave 2
docs/plans/v2/purgatorio.md                         — Wave 2
docs/plans/v2/event-horizon.md                      — Wave 2
docs/plans/v2/tenfold.md                            — Wave 2
docs/plans/v2/pencilneck.md                         — Wave 2 (complete)
docs/plans/v2/overhead-dominion.md                  — Wave 3
docs/plans/v2/arms-race.md                          — Wave 3
docs/plans/v2/hamstring-foundry.md                  — Wave 3
docs/plans/v2/quadfather.md                         — Wave 3
docs/plans/v2/cathedral.md                          — Wave 3
docs/plans/v2/peachy.md                             — Wave 3
docs/plans/v2/workhorse.md                          — Wave 3
docs/plans/v2/gravity-is-optional.md                — Wave 3 (complete)
docs/plans/v2/athena.md                             — Wave 4
docs/plans/v2/venus-rising.md                       — Wave 4
docs/plans/v2/kali.md                               — Wave 4
docs/plans/v2/house-of-iron.md                      — Wave 4 (complete)
docs/plans/v2/iron-clock.md                         — Wave 5 (in progress)
docs/plans/v2/redline.md                            — Wave 5 (in progress)
docs/plans/v2/30-minute-adventure.md                — Wave 5 (in progress)
docs/plans/v2/atlas.md                              — Wave 5 (in progress)
docs/plans/v2/lazarus.md                            — Wave 5 (in progress)
docs/plans/v2/skeleton-to-threat.md                 — Wave 5
docs/plans/v2/apex-predator.md                      — Wave 5 (complete)
docs/plans/v2/super-mutant.md                       — Wave 6 (complete)
docs/plans/v2/neural-overload.md                    — Wave 6 (complete)
docs/plans/v2/immaculate-restructure.md              — Wave 6 (complete)
docs/plans/v2/oracle.md                             — Wave 6 (complete)
docs/plans/v2/project-chimera.md                    — Wave 6 (complete, closes Wave 6)
docs/plans/v2/_wave6-advanced-plans-roadmap.md      — Wave 6 roadmap (Project Chimera, Oracle, Immaculate, Apex Predator)
docs/plans/v2/ghost-in-the-machine.md               — Wave 7 (complete, closes the full review order)
docs/plans/v2/_audit-status.md                      — this file
docs/plans/v2/_audit-decisions.md                   — living decision log (owner-maintained, read before each wave)
```

**Do not write per-wave `_comparison-waveN-*.md` files from Wave 2 onward**
(AUDIT-4, decided B) — one end-of-audit cross-plan report after Wave 7
instead. Tag every ranked improvement `hypothesis` / `shared-bug` /
`plan-local` (AUDIT-2, decided C). No code changes during the audit except
the narrow AUDIT-6b exception already implemented elsewhere (claimed-keyword
UX + Pain & Glory `registerUser` slot) — **Pain & Glory is reportedly fixed
and testable again** (owner note, 2026-08-14); re-run its live clickthrough
and update its doc when Wave 2 finishes, since re-opening a finished doc
outside the current wave isn't otherwise part of the review order.

Every plan doc ends with a YAML "export block" — a compact machine-readable
summary of that plan's key numbers and bugs, meant to seed the eventual
plan-portability/export-import format the owner mentioned wanting. Keep
writing these.

---

## 5. How to test a plan (the actual mechanics — read before starting)

### 5.1 Getting into the app

- Live URL: `https://workout-planner-b5bd6.web.app`
- **Use keyword `test_claude`** — an admin-created, multi-plan key with
  `allowPlanSwitching: true`. Do not ask the owner for a new keyword per
  plan; switch plans in-app via **Settings → Program Management → Switch
  Program**.
- Per-plan test keywords (`test_minimum`, `test_blackout`, `test_pain`,
  `test_king`, `test_workhorse`) were used earlier in the audit but are
  **claimed by the owner's real account** (`ownerUid:
  W17SGTVR9udvr9PbC6kS9Q7Gwl32`) once opened once — a separate anonymous
  browser session gets `permission-denied` on any write to that user doc
  after that. `test_claude` avoids this entirely. Use it going forward.
- **Never try to log in with the admin keyword (`judziek`) yourself.** It
  functions as a credential; entering it is against operating rules
  regardless of what it would unlock. If genuinely blocked on something only
  admin panel access solves, stop and ask the owner rather than typing it.

### 5.2 Browser automation — hard-won lessons, don't relearn these

- **The `computer` tool's click/type coordinates only match the frame of the
  most recent `screenshot` call — never `read_page`'s reported positions.**
  Clicking a `ref` from `read_page` without an intervening `screenshot` will
  silently miss. This caused most of the wasted turns in Wave 1. Prefer the
  **direct-DOM-click workaround** below over coordinate clicking entirely.
- **Direct DOM interaction, done via `javascript_tool`, is far more reliable
  than pixel clicking** for this app's UI (many controls, especially plan
  selection cards, are non-focusable divs with no button/link role — a
  pre-existing accessibility defect, already flagged in the shared findings
  below). Patterns that work:
  ```js
  // Click a button by visible text:
  [...document.querySelectorAll('button')].find(x => /switch program/i.test(x.textContent||'')).click();
  // Click a plan card by its heading:
  [...document.querySelectorAll('h3,h2,h4')].find(x => /^Plan Name$/i.test(x.textContent.trim())).closest('div').click();
  // Set a form input's value so React's controlled-input state actually updates
  // (plain .value= does NOT fire React's onChange — this native-setter trick does):
  const setVal = (el, val) => {
    const proto = Object.getPrototypeOf(el);
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');
    desc.set.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  setVal(inputEl, '160');
  ```
  Always immediately read back the value/state after setting it (e.g.
  `JSON.stringify([...document.querySelectorAll('input[type=number]')].map(...))`)
  to confirm it actually registered before submitting — don't trust a click
  succeeded just because the tool call returned without error.
- **A hard `navigate()` to a URL drops the session** (auth doesn't survive a
  full page load reliably in this app) — this is itself a shared finding
  (§6 below), not just a testing obstacle. Use in-app SPA links/clicks to
  move around, not `navigate()`, once inside the app. `navigate()` is fine
  for the initial load of the root URL only.
- **Always cross-check a suspicious browser observation against Firestore
  directly** before writing it up as a bug. The Firebase MCP tools
  (`mcp__plugin_firebase_firebase__firestore_get_document`, project
  `workout-planner-b5bd6`, database `(default)`, path
  `projects/workout-planner-b5bd6/databases/(default)/documents/users/test_claude`)
  are faster and more trustworthy than re-reading the DOM, and this is how
  every confirmed bug in Wave 1 was actually verified (vs. several apparent
  "bugs" that turned out to be my own coordinate-click misses on blank
  forms — always rule that out first by checking whether the form fields
  actually held the values you think you typed).
- **Console errors persist across page state** — don't trust a console error
  as evidence of a *fresh* failure without confirming the error count grew
  after your latest action, or better, checking Firestore state directly.

### 5.3 Computing numbers instead of eyeballing them

For every plan, pull structure and compute figures programmatically rather
than reading `WorkoutView.tsx` renders by eye. The working pattern (used
throughout Wave 1): write a throwaway `.ts` file importing from
`src/data/plans` (or the plan's own file under `src/data/`), `PLAN_REGISTRY`,
and `EXERCISE_LIBRARY`, run it with `npx --yes tsx <file>.ts`, then delete
it. Never leave scratch scripts in the repo. Key snippets that come up every
time:

```ts
import { PLAN_REGISTRY } from './src/data/plans';
import { EXERCISE_LIBRARY } from './src/data/exercises/library';
const byId = new Map(EXERCISE_LIBRARY.map(e => [e.id, e]));
// For legacy free-text plans, resolve by name + alias instead:
const byName = new Map();
for (const e of EXERCISE_LIBRARY) {
  byName.set(e.name.en.toLowerCase(), e);
  for (const a of e.aliases ?? []) byName.set(String(a).toLowerCase(), e);
}
```

Systemic/axial/lower-back/knee cost sums straight off each exercise's
`intelligence` block × sets — this is what every "systemic load" table in
every doc so far is built from. For plans with a `definePlan`-based
`calculateWeight` hook, you can call it directly with a synthetic `user`
object to verify load math without touching the browser at all (this is how
King of the Squat's headline bug was proven analytically before the live
confirmation).

---

## 6. Shared findings — apply this lens to every remaining plan

These are no longer "possible" issues to check for — they are **confirmed,
repeating patterns**. Actively test for them on every plan from Wave 2
onward, and note in each plan's doc whether it's present or absent (absence
is itself worth recording, it calibrates whether the pattern is universal or
just common).

1. **Plan-switch / fresh-registration routing bug.** Confirmed on 3/5 Wave-1
   dedicated-engine plans (Ritual, Bench Domination, King of the Squat). Root
   cause: the dashboard's "next session" resolver doesn't reliably derive the
   correct week/day from the newly-active plan's actual progress state after
   a `switchProgram()` call — sometimes because it ignores a real status
   field (Ritual), sometimes because no field exists yet and stale client
   state leaks across the switch (Bench Domination, King of the Squat). **Test
   procedure:** switch into the plan from a different plan's mid-cycle week,
   check what "NEXT SESSION" shows before touching anything, then check
   Firestore's `programProgress[newPlanId]` and the plan's own status field
   directly. Do this on every plan with dedicated `xStatus` state.

2. **`resetProgram()`'s hardcoded status-nulling allowlist.** Currently only
   covers `benchDominationStatus`, `pencilneckStatus`, `skeletonStatus`. Any
   plan with its own `xStatus` object not in that list will have "Reset
   Current Progress" silently fail to reset it, contradicting the button's
   copy. Check `src/contexts/UserContext.tsx`'s `resetProgram()` against
   each new plan's status field name.

3. **`reverse-nordic-curl` misattribution.** Filed as hamstring/knee-flexion,
   is actually quad/knee-extension. Check whether each new plan uses it and
   whether the plan (or this audit's volume table) is crediting the wrong
   muscle group as a result.

4. **Duplicated exercise definitions drifting independently.** Bench
   Domination's Weighted Pull-ups (three separate `sets:` values in three
   places, only one ever fixed) is the extreme case, but the *pattern* —
   same exercise, same slot, defined more than once, only some copies
   patched by a later progression rule — is worth grepping for specifically
   (`grep -n "exerciseName ===\|ex.name ===" <planfile>`) on any plan with
   week-specific overrides layered on a base template.

5. **Shared-engine bugs vs. local bugs.** King of the Squat's wave-progression
   bug lives in `src/data/planBuilder.ts` (`wavePercentForSet`), not in the
   plan's own file — meaning **any other plan using `type: 'wave'`
   progression may have the identical bug**, silently. Neural Overload was
   flagged but not yet checked — check it, and any other `type: 'wave'`
   consumer, early in Wave 2/3.

6. **Non-focusable plan-selection cards.** Confirmed via `read_page`
   accessibility-tree checks in earlier sessions (The Minimum, Blackout docs)
   — plan cards have no button/link role. This is app-wide, not
   plan-specific; don't re-derive it per plan, just note "confirmed present"
   or move on unless a plan's onboarding flow does something structurally
   different.

7. **Hard navigation drops the session.** App-wide, not plan-specific — noted
   once, don't re-test.

8. **"Never compound an estimate on an estimate."** Not a bug — a
   consistently well-implemented *pattern* worth checking for as a positive
   signal. Four plans (Trinary, Bench Domination, Ritual, Pain & Glory-by-design)
   independently do this correctly. Worth noting in each new plan's doc
   whether its own progression system respects this, especially any plan
   using AMRAP/e1RM-style checkpoints.

9. **`liftHistory` has no write path anywhere in the codebase (T-22, found
   on Workhorse).** Declared in `types.ts`, read in 7 places in
   `trackedLift.ts` to feed the `strength_chart` dashboard widget (used by
   Overhead Dominion, Hamstring Foundry, Cathedral, Quadfather, Workhorse,
   and likely others), but never written by any code path. Confirmed live:
   a fully completed and logged Workhorse session left `workingLoads`
   correctly updated but `liftHistory` entirely absent from the user
   document. **Check any plan with a `strength_chart` widget for this —
   likely a single-fix, portfolio-wide bug**, not plan-specific.

---

## 7. Calibration decisions already made — don't re-litigate these

- **The ≥5 fractional-sets/muscle/week target is not a hard rule.** Judged
  case by case against the plan's own volume budget — e.g. The Minimum's 29
  sets/week can't possibly reach 5 everywhere (would need ~44 sets/week), so
  it's judged against MEV instead, and the finding becomes *which* muscles
  are below floor, not *that* the floor is universally unmet. Apply the same
  judgment to low-volume plans in later waves (Blackout-style minimalist
  plans especially).
- **Exercise merges:** approved by the owner for true duplicates only
  (identical movement, no distinguishing content) — NOT for genuine
  variations, even similar ones. See the map's §4 for the exact approved
  list. Don't propose new merges without checking that section first — the
  owner explicitly reversed an earlier over-eager merge proposal mid-session.
- **Strength-ratio confidence grades (H/M/L) are deliberate**, not filler —
  `L` means "machine/leverage-dependent, seed only, don't treat as ground
  truth" and should be treated that way when citing a ratio in a plan doc's
  findings (e.g. don't call a hack-squat load "wrong" against a ratio graded
  `L`).
- **Wiring must be verified live, not assumed from source reading.** Several
  Wave-1 findings (Trinary's variation-name resolution, Bench Domination's
  0-set pull-ups, King of the Squat's wave math) were only fully trusted
  once confirmed in the actual running app or via a direct function call —
  source reading alone generates hypotheses, not findings. Keep this
  standard for every remaining plan.

---

## 8. Open items / things to follow up on, not yet done

Design votes for identity/frequency/progression and exercise variety are
**logged** (`_effectiveness-questions.md`, `_audit-closeout.md`). They are not
applied in code.

- **PROC-1 implementation** — not started; owner must open it.
- **Iron Clock** — parked (selection pass later; optional hide-from-catalog at PROC-1).
- **REDLINE abs** — not voted (two wheels).
- **Peachy core movements** — two 2-set sessions; crunch vs machine vs wheel TBD.
- Pain & Glory is **still untestable** until the AUDIT-6b exception ships
  (claimed-keyword UX + `painGloryStatus` on `registerUser` extra). Owner
  approved that as the only in-audit code. Do not expand the exception.
- The exercise-duplicate merge spec (§2 above) has not been applied to the
  codebase — analysis only so far.
- Attribution-bug fixes (`reverse-nordic-curl`, `around-the-worlds`,
  `y-raise`, `wall-slide`, `loaded-ankle-rock`, `high-foot-leg-press` — see
  the map's §25) have not been applied — analysis only so far.
- No plan-rebuild code has been made as part of this audit. Everything
  above is a finding, not a fix. Confirm with the owner before starting any
  implementation pass.

---

## 9. Format reminders for future plan docs

Keep matching the structure already established (see any Wave-1 doc as the
template): header table → structure → wiring table → findings (numbered,
severity-tagged) → weekly volume table (from the attribution map) →
systemic/joint load table → improvements (ranked, ≥5, science-cited) →
verdict → YAML export block. Write to `docs/plans/v2/<plan-id>.md`. Don't
touch the original `docs/plans/*.md` files.

**Improvements tagging (owner, 2026-08-14):** every ranked improvement must
be labeled as one of `hypothesis` (design change, not a ticket yet),
`shared-bug` (engine/dashboard/library — will recur), or `plan-local`
(this file only). Do not treat hypotheses as implementation orders.

**Do not write** `_comparison-waveN-*.md` for later waves. Owner wants a
single end-of-audit cross-plan report after Wave 7. Leave the Wave 1
comparison file as-is. Still update this status file at the end of each
wave, and append observed repeats to
`docs/plans/v2/_audit-decisions.md` §0c (running patterns, no owner votes).
