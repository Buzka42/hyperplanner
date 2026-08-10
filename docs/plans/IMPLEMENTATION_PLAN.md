# HyperPlanner — Implementation Plan

Sequence: **A. Onboarding bug → B. UI overhaul (B1–B8) → C. Plan testing.**
All three are complete and merged to `main`.

---

## Status

| Item | State |
|---|---|
| A. Onboarding bug (benchmark step + calibration) | **Done** |
| Plan renames (names, artwork, ids) | **Done** — migration pending, see below |
| B1. Tokens & fonts | **Done** (fonts self-hosted) |
| B2. Shell | **Done** — options in `B2-SHELL-OPTIONS.md` |
| B3. Live-set console | **Done** — options in `B3-CONSOLE-OPTIONS.md` |
| B4. Ledger + click-to-edit | **Done** — spec approved as option (b), `B4-LEDGER-SPEC.md` |
| B5. Dashboard | **Done** — options in `B5-DASHBOARD-OPTIONS.md` |
| B6. RestTimer + modals | **Done** — options in `B6-TIMER-MODALS-OPTIONS.md` |
| B7. Remaining surfaces | **Done** |
| B8. Finish pass | **Done** |
| C. Plan testing | **Done** — `verify:calibration` + volume audit |

### Action required from the owner — the only blocking item

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

### B2. Shell ⇧ PUSH — done
Labeled sidebar re-skinned flat. 5-item mobile dock, drawer deleted. Brand lockup in
Hanken. Trophy case extracted to a new `/app/profile` route. Program artwork slot,
grayscale-first.

Option round: `docs/plans/B2-SHELL-OPTIONS.md` (four open element treatments,
each with the alternates and why the built one won). Built beyond the stated
scope, and worth knowing:

- **The drawer held more than nav.** Logout and the language switcher were only
  reachable on mobile through it, so `/app/profile` is identity + trophies +
  language + logout rather than a badge grid alone.
- **Page titles are sentence case now.** `.instrument-page > h1` still carried
  `text-transform: uppercase` from the Pit-Wall world; B1 missed it. This
  changes Dashboard, History, ExerciseBrowser and Settings ahead of their own
  phases — toward their end state, so they stay shippable.
- **The language switcher's buttons were 36–38px.** The flag was the whole
  target. The flag is now the mark and the button around it is ≥44px. Shared
  component, so Entry gets it too.
- **The dock was `grid-cols-4` holding five items**, so Settings rendered
  outside its grid.

Verification: 9 viewport/theme/locale combinations rendered from the real
compiled CSS, audited for horizontal overflow, sub-44px targets, clipped text
and mid-word breaks. All clean. `b2-mobile-narrow-pl` found `USTAWIENIA`
breaking into `USTAWIENI / A` at 320px; fixed with a narrow-width dock rule.

### B3. Live-set console — the proof surface ⇧ PUSH — done

Option round: `docs/plans/B3-CONSOLE-OPTIONS.md`.

The console stopped being a box. It is horizontal bands separated by hairlines,
sitting directly on the chassis, one column at every width.

Both defects carried into this phase are fixed at the cause:

- **The four-line exercise name.** The cause was the desktop two-column split
  (`1.15fr .85fr`), which gave the head a ~390px column at 1024px. Dropping the
  split to one column of bands is what §6 asks for anyway, and it widens the
  measurement columns rather than narrowing them.
- **`LOAD MODE — MANUAL`.** Banned fluff, but what it reported is required by
  PRODUCT.md principle 5. It moved onto the field it describes: the weight's
  micro-label reads `WEIGHT · AUTO` while the value is still the plan's
  computed load, plain `WEIGHT` once the athlete types their own. Derived, so
  there is no flag to keep in sync.

Both transform-less progress transitions are gone. The session meter is no
longer an 8×66px bar animating `height` — the head's own bottom hairline is the
progress rule, filled with `scaleX`. `.admin-progress` moved from `width` to
`scaleX` too.

Also: history and advice pills (a banned shape) became spec rows, which gave
the per-exercise set counter a home once LOG SET went full width; four
hardcoded English strings (`Live set`, `Log set`, `RPE`, `Rest`) got real i18n
keys; and the figure input is now sized in `ch` from its own value's length, so
the clipping bug is impossible by construction rather than by bucket — which
also puts the `kg` unit beside the number instead of stranded at the far edge
of a 400px column.

Verified across 8 viewport/theme/locale combinations, asserting on each: no
horizontal overflow, no clipped figure, the load figure is the largest type on
screen, the exercise name fits in ≤2 lines, the CTA is ≥56px, and nothing in
the console is under 44px. Screenshots in `.impeccable/qa/b3-*`.

### B4. Set ledger + click-to-edit ⇧ PUSH — done

Spec: `docs/plans/B4-LEDGER-SPEC.md`. The owner chose **option (b)** from its
§7: the console stays the only editor, and ledger rows are read-only and tap to
hand their set to the console. (The spec recommended (a), the sheet absorbing
the console. Overridden, recorded, not re-litigated.)

The ledger is one hairline table now. The per-exercise `Card` panels are gone,
nothing collapses, and the twenty-four live inputs that used to sit on one
screen are gone with them — a row reads `number / load × reps / state` and
nothing else.

How the two surfaces relate:

- `selectedSet` pins the console to a chosen set. `null` means "whatever comes
  next", the behaviour that was always there.
- Tapping a row pins it and scrolls the console into view — a selection the
  athlete cannot see would be a dead tap.
- Logging releases the pin, so the console advances on its own.
- The pin is validated on every render: a swap or a removed extra set can leave
  it dangling, and a dangling pin falls back to the derived set.
- Re-opening a logged set shows **Update set**, not **Log set** — a button that
  looks like it does nothing is worse than no button.

Row states: pending, selected, done, AMRAP, warm-up, technique, extra. Each
states its condition in text for screen readers as well as in the glyph, so
nothing is carried by colour or icon alone.

Found while building:

- **The pull-up EMOM auto-fill was about to be lost.** The ledger passed
  `isPullup` and the rep target into `handleSetChange`; the console did not.
  With the console as the only editor, editing set 1 would have stopped
  filling the rest. It passes both now.
- **A named row cannot live in a numeric gutter.** `Incline DB Press` broke
  mid-word in the 2.5rem set-number column. Named rows (giant-set steps,
  technique labels) stack their label above their values and indent to the
  value column, so the value column runs unbroken down the sheet.
- **The technique label was a hardcoded yellow**, a style fork PRODUCT.md bans,
  and it failed on Peachy. The stacked uppercase label already reads as "not a
  numbered set", so it needs no colour.
- **The program accent is not safe to set type in.** Bench Domination's purple
  is 4.15:1 on the chassis, under the 4.5 gate §4 sets. New `--signal-text`
  mixes the accent toward the foreground, which raises contrast on the dark
  themes and lowers luminance on Peachy — one rule for both polarities instead
  of thirteen hand-tuned values. Fills, edges and glyphs still use `--primary`
  directly; only text uses this. It is declared on `.instrument-shell`, not
  `:root`, because custom properties substitute where they are declared and a
  `:root` declaration would bake in the default ice accent for every program.
  **This does not replace the B8 audit** — it fixes the text roles this phase
  and B3 introduced, and gives B8 the mechanism to fix the rest.

Verified across 7 viewport/theme/locale combinations, asserting no horizontal
overflow, no sub-44px targets, no clipped or mid-word-broken text, no row
without a text state, no tappable warm-up, and **≥4.5:1 on every text role in
the sheet**, composited through the rows' translucent fills. Screenshots in
`.impeccable/qa/b4-*`.

Two probe bugs were fixed along the way and are worth knowing, because both
reported failures that were not real: a 7% row tint counted as an opaque
background, and `color-mix` computes to `oklab(...)`, whose numbers are not
RGB. Colours are resolved through a canvas now.

### B5. Dashboard ⇧ PUSH — done

Option round: `docs/plans/B5-DASHBOARD-OPTIONS.md`.

Spec-sheet header, hairline, spec rows, full-width signal START block, week list
as hairline rows in the same grammar as the set ledger.

- **The `01`–`04` manifest numbering is gone.** Numbers must be data; a
  decorative index in front of an exercise name is the fluff the owner banned.
- **No "Est. time" row.** The plan sketched one, but nothing in the app measures
  session duration and a number that lies is worse than a missing row. Rows are
  Week, Exercises, Movements. A real estimate is derivable later from set count
  × prescribed rest.
- **Six greeting forks became one.** Peachy, Pain & Glory, Trinary, Ritual,
  Super Mutant and the default each rendered their own block with their own
  hardcoded button colours. Now one structure picks its copy by program.
  ~110 lines and every hardcoded colour in that block are gone. Peachy's frog
  and peach stay — they are program copy, and PRODUCT.md bans emoji *as icons*,
  which is a different thing.
- **`Card` itself was flattened** rather than restyling thirteen widgets. The
  inset double border, gradient wash and drop shadow came off `instrument-panel`,
  so every widget flattened at once and "one system, eight skins" stays true.
  This reaches History, ExerciseBrowser, Settings and Admin — intended, since
  those are B7 and this moves them toward their end state.
- `CardTitle` lost its uppercase transform, same rule as page titles in B2.

Found: **`spec-rows` had its columns backwards.** The label took the flexible
column and the value an unbounded `auto`, so a long value grew past the row and
printed itself over its own label. It only showed up once a row carried real
content — the Profile page's short values had hidden it since B2.

Verified with the new generic audit (`audit.mjs`), 8 viewport/theme/locale
combinations. Screenshots in `.impeccable/qa/b5-*`.

### B6. RestTimer + modals/sheets ⇧ PUSH — done

Option round: `docs/plans/B6-TIMER-MODALS-OPTIONS.md`.

The rest timer is a full-width bar fixed above the dock, per the owner's
decision #8 — it used to be sticky at the *top* of the workout page, scrolling
with the sheet and sitting nowhere near the thumb. Countdown at 1.75rem in the
mono face, three ≥44px zones.

**A behaviour was removed:** the restart control. The spec asks for skip and
add-30s; extending is what an athlete reaches for mid-rest, restarting a rest
period is not, and a fourth target in a bottom bar makes every one narrower.
Cheap to put back.

The modal family was re-skinned through its two shared primitives rather than
five components — same lever as `Card` in B5. `.instrument-floating` gives
`ui/dialog` and `ui/sheet` 6px corners and the one permitted shadow; bottom
sheets round only their top corners, keyed off a new `data-side`. Choices render
as ruled rows. `PrescriptionBadges` is de-pilled: the information stays as
hairline-separated micro-labels, the bubbles go, and its hardcoded yellow went
with them.

Found:

- **`--font-display` was never defined.** Five rules said
  `font-family: var(--font-display)` and have always silently resolved to
  whatever was inherited — a token from a system predating even the Pit-Wall
  world. Replaced with the real stack.
- **Peachy's destructive control was 4.2:1** under its own white label. A
  destructive control failing the contrast gate is the last one that should;
  darkened to 41% lightness.
- **The accent-as-text problem is broader than B4 found.** The active dock
  label, the active sidebar item, the identity row, the calibration labels, the
  earned-trophy state and `shimmer-text` were all setting type in the raw
  program accent. All moved to `--signal-text`. Glyphs, fills and edges keep
  `--primary` — the contract pushes a failing accent out of *text* roles, not
  out of the interface. Adventure and Admin still use it for text; they are B7.

Verified on a new harness plus a regression run of the B3, B4 and B5 harnesses,
since the token sweep reaches all of them. All clean. Screenshots in
`.impeccable/qa/b6-*`.

### B7. History, ExerciseBrowser, Settings, Entry/Onboarding, Adventure, Admin ⇧ PUSH — done

**Inputs are underline everywhere**, the owner's decision #10. Done at the
shared `ui/input`, so Settings, Onboarding, Entry, the ledger and Admin all
changed at once. The agreed mitigation for the weaker affordance is built in:
every field is ≥44px, the `<label>` wrapping it is the click target, and focus
is a 2px accent underline rather than a ring a hairline layout has nowhere to
put.

**Entry** is a split spec sheet, and both of its logged defects are fixed. The
primary button hardcoded `bg-zinc-100 text-black`, so it rendered grey instead
of the signal in every program; and `CREATE A NEW KEYWORD`, `CREATE & CONTINUE`,
`Use an existing keyword` and the `Calculate / Execute / Log` line were all
hardcoded English. They have real keys now. The logo image went too, matching
the lockup.

**History** was the worst style fork in the app: 32 hardcoded zinc greys and a
red accent, so every program rendered its own archive in Pencilneck's colours.
It is a hairline table now, reusing the ledger's row grammar, with real i18n
keys for the six strings that were hardcoded English.

**ExerciseBrowser**: the spec's "grayscale-first images" item does not apply —
the library has no artwork. What it needed was the shared row grammar and a
search field that stays findable.

**Adventure and Admin** were still setting type in the raw program accent;
moved to `--signal-text` with the rest.

**The zinc ramp is gone from the app.** It was a hardcoded restatement of the
token scale that ignored Peachy entirely — a light theme rendering its modals in
dark greys. ~180 occurrences across five files mapped onto tokens.

**Two outright PRODUCT.md violations went with it:** four gradient-text titles
(`bg-clip-text text-transparent`) in Onboarding, and the gradient panel
backgrounds the chassis replaced with tonal steps.

Verified with harnesses for Entry, History and the library across
viewport/theme/locale combinations. Screenshots in `.impeccable/qa/b7-*`.

### B8. Finish pass ⇧ PUSH — done

**Contrast audit: all 19 themes, clean.** Every text role on five surfaces
(console, ledger, dashboard, rest timer + modals, and History/Entry/library) at
≥4.5:1, composited through the rows' translucent fills. The failures this found
were fixed in the phase that introduced them — the accent-as-text problem
(B4/B6) and Peachy's destructive control (B6) — so the sweep at the end confirms
rather than discovers, which is the point of doing it last.

**44px audit: clean** on the same matrix.

**Polish: clean** at 320px and 390px on every surface. The one real failure was
`USTAWIENIA` breaking to `USTAWIENI / A` in a 320px dock slot, fixed in B2.

**`prefers-reduced-motion`: verified, not assumed.** A Chromium context with
`reducedMotion: 'reduce'` walks every element on every harness and asserts no
transition or animation still has a live duration. Clean. The one straggler was
`shimmer-text`, which kept a raw-accent colour inside the reduced-motion block.

**Retired assets deleted:** `public/materials/machined-graphite.png` and
`brushed-billet.png`. Nothing referenced them after B1; they were 2 files of the
replaced world still shipping.

**`DESIGN.md` rewritten.** It documented the Pit-Wall world — Saira, signal
blue, graphite panels, 5.5rem display type — which is why the Impeccable
detector reported ~146 "undeclared font/size/colour" findings against it. It now
describes Protocol Sheet: the token layer, the `--signal-text` rule, the row
grammar, the two mechanisms that keep the live figure readable, how verification
works here, and the traps.

**Not done: the Impeccable detector run.** The skill is not installed in this
environment, so `detect.mjs` could not be run. The audit script covers what the
detector would have checked for contrast, tap targets and text overflow; it does
not cover the detector's undeclared-token analysis. Worth a run when the skill
is available — `DESIGN.md` being current should make it quiet now.

# C. Plan testing — done

## C1. The calibration path, end to end ✅

`npm run verify:calibration` — **151 checks across every declarative plan.**

`verify:onboarding` already guarded the *contract* (every stat a progression
reads is collectable). This guards the *behaviour*, which is what Section A was
actually about: King of the Squat and Neural Overload declared percentage
progressions against maxes nothing collected, so every load resolved from 0 and
the plans prescribed an empty bar. That failure was invisible — the app
rendered, the workout looked normal, the numbers were wrong.

Asserted per plan:

1. Before calibration, a load depending on an uncollected max resolves to
   `undefined` — "not yet known" — never `"0"`, which is a prescription of
   nothing.
2. Every required stat has an exercise that can establish it, **and** every
   exercise whose load is computed from a max appears in the calibration map.
3. Logging that exercise writes a plate-rounded Epley 1RM and clears exactly
   the flags it established, leaving other maxes outstanding.
4. After calibration every dependent load is a 2.5kg multiple inside 30–115% of
   the max.
5. Re-saving a completed session does not re-establish a max the athlete has
   since trained past.

**Mutation-tested, and the first attempt was not good enough.** Reintroducing
the original bug (a missing base resolving to `0`) fails loudly and names King
of the Squat and Neural Overload. But narrowing the calibration map to
percentage-only progressions — dropping wave and linear — *passed*, silently
running 18 fewer checks, because the stats stayed reachable through other
exercises. Check 2b was added for exactly that: it probes through the public
surface, giving the calculator every max and asserting that any exercise it can
now price is in the calibration map. The second mutation now fails.

## C2. Volume audit ✅

`npm run verify:volume` against the portfolio doc's §28 priority list.

**The frequency rules no longer apply to powerlifting plans**, at the owner's
direction. Two changes, both one-liners in the advisory script:

- The 2-exposures-a-week floor is skipped for `kind: 'powerlifting'`. The rule
  exists to stop a *hypertrophy* plan under-stimulating a group; once-weekly
  supporting work for a non-priority group is a legitimate choice when the goal
  is a total. This clears Ritual's shoulder finding, which was the plan working
  as designed.
- The specialisation *frequency* target is skipped for powerlifting too. The
  owner named the 2/week rule specifically; this is the 3/week specialisation
  target, a different rule — but the same reasoning applies, and it was
  reporting Bench Domination as breaching its own design for benching twice a
  week. **Extended by inference, so worth a second look.**

Either check is opt-in: a powerlifting plan that wants it declares
`minWeeklyExposures` or `specialisationExposures`. King of the Squat does, and
is still checked.

`verify:volume` now reports **0 breaches** across the portfolio.

**A measurement gap was hiding a whole plan.** `verify:volume` reported "no
materialised training weeks" for Skeleton and moved on, so it had never been
volume-audited at all — while the portfolio's §35 lists Skeleton
minimum-frequency as a top-priority item. Two causes, both in the harness:

- The preview user had no `selectedDays`, and Skeleton's `preprocessDay` gates
  on them, so every day came back as an empty rest day. The preview user now
  trains Mon/Wed/Fri, which is what Skeleton's own onboarding requires.
- The "generates one session per visit" detector then skipped it. Its heuristic
  was "every day produces the same session", which is also what a legitimate
  full-body 3×/week plan looks like. The real discriminator is that a per-visit
  generator ignores the calendar — it fills *every* day it is handed, including
  the plan's own rest days. Tightened accordingly; Trinary and Super Mutant are
  still correctly skipped.

Skeleton now audits at 72 direct sets in week 1 with 3× weekly frequency on
every group it trains, and no rule breaches.

## Still out of scope

The portfolio doc's §35 items (Skeleton minimum-frequency, Overhead Dominion
maintenance frequency, Workhorse second triceps exposure, Immaculate
non-priority frequency) remain separate work, as agreed. C2 makes the first of
them measurable; it does not change any plan's programming.

The four design-only plans (House of Iron, Apex, Venus/Athena/Kali, REDLINE)
are still unimplemented and out of scope.
