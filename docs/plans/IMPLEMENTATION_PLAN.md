# HyperPlanner — Implementation Plan

Branch: `ui-overhaul-gym-ux`. Push to GitHub at every gate marked **⇧ PUSH**.

Sequence: **A. Onboarding bug → B. UI overhaul (phases 1–7) → C. Plan testing.**

---

## Status

| Item | State |
|---|---|
| A. Onboarding bug (benchmark step + calibration) | **Done** |
| Plan renames (names, artwork, ids) | **Done** — migration pending, see below |
| B1. Tokens & fonts | **Done** (fonts self-hosted) |
| B2. Shell | Next |
| B3–B8 | Not started |
| C. Plan testing | Not started |

### Action required from the owner

`npm run migrate:plan-ids` — rewrites the renamed plan ids in Firestore. Needs
`GOOGLE_APPLICATION_CREDENTIALS` pointing at a service account, and
`npm i -D firebase-admin`. Dry runs by default; `-- --apply` writes.

Nothing is broken while this is pending: the app reads through
`canonicalPlanId`, and `firestore.rules` still accepts the old ids. After it has
run everywhere, the three legacy entries can come out of `validPlanIds()` — but
**`LEGACY_PLAN_IDS` in `src/data/planIds.ts` stays**, because historical workout
logs keep the id they were written with and are deliberately not rewritten.

---

## Plan renames

| Old name | New name | Old id | New id |
|---|---|---|---|
| Accumulate / Intensify | Purgatorio | `accumulate-intensify` | `purgatorio` |
| The Weakest Link | Immaculate (Re)Structure | `the-weakest-link` | `immaculate-restructure` |
| The Upper-Body Squat | Workhorse | `upper-body-squat` | `workhorse` |

Two cover images were also crossed (`accumulate-intensify` held `workhorse.png`
and vice versa), verified against the wordmarks in the artwork and swapped.

The three names stay in English in the Polish locale, unlike the descriptive
plan names around them, because they are brand names set into the cover art.

---

## Decisions locked in this session

### Onboarding
| Question | Decision |
|---|---|
| "I don't know my 1RM" path | **First-session calibration set.** No rep-test in onboarding. The plan's first exposure of that lift becomes a calibration set; the app back-fills the 1RM from the logged result. |
| Which plans prompt for which lifts | **Derived from plan data.** Scan each plan's slots for `progression.of` keys. Self-maintaining. |

### UI (protocol-sheet-redesign.md §11)
| # | Question | Decision |
|---|---|---|
| 1 | Neutral default signal | Ice `#dce8f1` |
| 2 | Chassis | **Neutral chassis + tinted panels only.** Page bg `#0a0b0c` everywhere; raised surfaces carry a faint program tint. |
| 3 | Program artwork | Defined slot, **grayscale-first** (`grayscale(.8) contrast(1.05)`, color on active) |
| 4 | Mono usage | Micro-labels + live-set figures only |
| 5 | Mobile dock | **5 items, no drawer** |
| 6 | Trophy case | **New profile area** (new route) |
| 7 | Load steppers | **None** — tap-to-edit only |
| 8 | RestTimer | **Full-width bar above the dock** |
| 9 | Set ledger | **Protocol sheet + click-to-edit** — see §B4 below |
| 10 | Inputs | **Underline everywhere** |
| 11 | Adventure route | **Full overhaul** — brought into Protocol Sheet |
| 7.1 | Desktop nav | **Keep labeled sidebar**, re-skinned flat/square |

Owner overrode the doc recommendation on 7, 8, 10 and 11. Noted, not re-litigated.
Mitigation for #10 (underline inputs are a weaker tap affordance than boxed): row-level
tap targets ≥44px, whole row clickable rather than the underline alone, 2px ice focus
underline. Cheap to revert to boxed in the console if it reads badly at review.

---

# A. Onboarding bug

## A1. The defect

Three layered problems, found in `src/pages/Onboarding.tsx`:

1. **Wrong form.** `Onboarding.tsx:1174` is an *unconditional fallback* render — the Bench
   Domination paused-bench form. `handleProgramSelect` (`:122`) routes every unbranched plan
   to `setStep('stats')`, so all ten declarative plans land there.
2. **Wrong enrolment (the serious one).** `handleBenchDominationSubmit` (`:315`) hardcodes
   `switchProgram(BENCH_DOMINATION_PROGRAM.id)` and
   `registerUser(..., BENCH_DOMINATION_PROGRAM.id, ...)`. A user who fills that form is
   silently enrolled in Bench Domination instead of the plan they picked.
3. **Missing data.** King of the Squat and Neural Overload declare
   `{ type: 'percentage', of: 'squat' | 'pausedBench' | 'conventionalDeadlift' }` progressions,
   but nothing collects those stats for them. Every percentage-derived load resolves from `0`.
   Those plans currently prescribe an empty bar.

## A2. Fix

**Step 1 — derive requirements from plan data.**
Add `requiredStats(plan): (keyof LiftingStats)[]` in `src/data/planBuilder.ts`: walk
`spec.days[].slots[].progression`, collect `.of` from `percentage` / `wave` / `linear`.
Memoise per plan id. Covers `definePlan` plans; hand-written plans (Bench Domination,
Trinary, Ritual, Pain & Glory) keep their bespoke steps and are excluded by id.

**Step 2 — generic benchmark step.**
New `step: 'benchmark'` replacing the fallback. For each required stat: label, `inputmode`
decimal input, exercise tip explaining how to find the weight, and a **"I don't know"**
toggle that marks the stat for calibration instead of requiring a number.

**Step 3 — generic submit.**
New `handleGenericSubmit` that enrols in `selectedProgramId` — not a hardcoded id. The
existing `handleBenchDominationSubmit` stays, reachable only from the bench-modules flow.

**Step 4 — calibration sets.**
Store `pendingCalibration: (keyof LiftingStats)[]` on the profile. On the first exposure of
a lift in that list, the console renders it as a calibration set (target ~8–10 reps @ ~2 RIR,
per the Kali spec §22 ladder), then writes the derived 1RM back to `stats` and clears the flag.
Percentage progressions must treat a `0`/absent stat as "not yet calibrated" and show
*Suggested starting load* rather than a computed number — never a silent 0 kg.

**Step 5 — guard.**
New `scripts/verify-onboarding.ts`: for every registered plan, assert that every stat key
referenced by a progression is either collected by that plan's onboarding step or listed as
calibratable. Fails the build on a new plan that forgets its benchmark. Wire into `package.json`.

**Gate:** `npm run verify:plans && verify:progression && verify:onboarding && npm run build`;
manually walk onboarding for King of the Squat, Neural Overload and Tenfold in the preview.
**⇧ PUSH — "Fix wrong-plan enrolment and add plan-derived benchmark onboarding"**

---

# B. UI overhaul — Protocol Sheet

Rules throughout: no logic/Firestore changes, i18n keys unchanged (add only if a label
genuinely doesn't exist), each phase leaves the app shippable.

### B1. Tokens & fonts ⇧ PUSH — done
Self-host Hanken Grotesk + JetBrains Mono (gym Wi-Fi). Rewrite `index.css` `@layer base`
and the `tailwind.config.js` mapping. Retire Saira, `machined-graphite.png`,
`brushed-billet.png`, chamfer clip-paths, command-depth shadows. Neutral chassis
`#0a0b0c` for every theme; per-program tint moves to panel surfaces only. App will look
"wrong but working" — that proves the token swap end to end.

### B2. Shell ⇧ PUSH — next
Labeled sidebar re-skinned flat. 5-item mobile dock, drawer deleted. Brand lockup in
Hanken. Trophy case extracted to a new `/app/profile` route. Program artwork slot,
grayscale-first.

### B3. Live-set console — the proof surface ⇧ PUSH

Carries two defects found during B1 review, already fixed but worth keeping
visible because the rebuild must not reintroduce them:
- the live figure was sized from `vw`, so on desktop (where the console splits
  into two columns) a 3-digit load overflowed and the input clipped it — the
  athlete typed 333 and saw 33. Now sized from its own container via `cqi`,
  stepping down by digit count. Verified: 0 clipped across 48 width/value
  combinations from 620px down to 150px.
- `transition: height` / `transition: width` on the progress meters (detector
  findings) should become transform-based here.
Hairline-divided bands, no panel box. Load figure `clamp(2.5rem, 10vw, 4.5rem)` in mono —
the largest type in the app. History/advice pills → one spec row. Telemetry strip as
hairline cells. LOG SET as a full-width signal block, min-height 56–64px.
**Screenshot review against the sketch before proceeding.**

### B4. Set ledger + click-to-edit ⇧ PUSH
The design-heavy item. **I will spec this flow and show it to you before building it.**
Direction: the workout renders as one hairline table — exercise names as section rows, sets
as ruled rows (`set# / load × reps / state`). Tapping any row expands it *in place* into an
edit surface (underline inputs, done/AMRAP state, swap affordance) while the rest of the
sheet stays visible and dimmed-but-legible. One row open at a time; logging collapses it and
advances to the next. The sheet never navigates away, so "what's left" is always scannable —
which is the whole point of a protocol sheet.

### B5. Dashboard ⇧ PUSH
Spec-sheet header (program name, sentence case), hairline, spec rows (Day / Focus / Top set /
Est. time), full-width signal START block, telemetry flattened to hairline sections.

### B6. RestTimer + modals/sheets ⇧ PUSH
RestTimer as a full-width bar above the dock: huge tabular countdown, skip / +30s zones.
Modal family re-skinned — 6–8px radius, the one permitted shadow, choices as ruled rows,
destructive confirmations in warning red. Bottom sheets on mobile, centered dialogs desktop.
PrescriptionBadges de-pilled.

### B7. History, ExerciseBrowser, Settings, Entry/Onboarding, Adventure, Admin ⇧ PUSH
History as a hairline table. ExerciseBrowser images grayscale-first. Underline inputs in
Settings/Onboarding. Entry as a split spec sheet. Adventure fully overhauled into Protocol
Sheet. Admin inherits tokens only.

### B8. Finish pass ⇧ PUSH
Contrast audit of all ~13 themes incl. Peachy (light skin needs its own dark-on-light hairline
scale); 4.5:1 body text everywhere; accents failing the gate pushed to non-text roles.
Polish string pass (PL runs ~20% longer — dock labels, `ZAPISZ SERIĘ`, spec-row labels).
`prefers-reduced-motion`. 44px audit. Then the Impeccable detector and a desktop+mobile
screenshot review of every screen. Rewrite `DESIGN.md`.

---

# C. Plan testing

Scope confirmed after B lands. Starting candidates, highest value first:

1. **King of the Squat** and **Neural Overload** — they consume the new benchmark/calibration
   path, so they test A end to end. Verify percentage loads resolve correctly post-calibration.
2. A **volume/fatigue audit** via the existing `verify:volume`, against the portfolio doc's
   §28 priority list.

The portfolio doc's §35 highest-priority items (Skeleton minimum-frequency, Overhead Dominion
maintenance frequency, Workhorse second triceps exposure, Immaculate non-priority frequency)
are separate work — not in this branch unless you say otherwise.

---

# Open items I still need from you

1. **§B4 ledger flow** — I'll produce the interaction spec; approve before I build it.
2. **Calibration-set UX** — does a calibration set look visually distinct in the console
   (a labelled band), or is it just a normal set with a different tip? Deciding at A4.
3. **New plans (House of Iron, Apex, Venus/Athena/Kali, REDLINE)** are *design docs only* —
   none are implemented. They are out of scope here; C tests existing plans.
