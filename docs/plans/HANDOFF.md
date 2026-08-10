# HyperPlanner — session handoff

Written 2026-08-10. Branch `ui-overhaul-gym-ux`, pushed to
`github.com/Buzka42/hyperplanner`. Working tree clean at `641991e`.

Read this first, then `docs/plans/IMPLEMENTATION_PLAN.md` for the full plan and
`docs/protocol-sheet-redesign.md` for the design contract.

---

## 1. What this work is

Three strands, in order:

**A. Onboarding bug — done.** Picking any of the ten declarative plans landed on
Onboarding's unconditional fallback render, the Bench Domination calibration
form, whose submit handler hardcoded `switchProgram(BENCH_DOMINATION_PROGRAM.id)`.
Finishing it enrolled the athlete in Bench Domination rather than the plan they
chose. Replaced with a generic benchmark step plus first-exposure calibration.

**B. UI overhaul — B1 of 8 done.** Replacing the "Pit-Wall Instrument" visual
world with "Protocol Sheet", per `docs/protocol-sheet-redesign.md`. The direction
was chosen by the owner before this work started and is pinned; it is not open
for re-derivation.

**C. Plan testing — not started.**

Along the way: three plan renames (names, artwork, ids) and a console defect
where the load figure clipped the logged number.

---

## 2. Commits on this branch

```
641991e Add the plan cover artwork
9468548 Rename plan ids, and stop the live figure clipping the logged number
dd53e03 Apply the three plan renames and self-host the fonts
6403692 Swap the token layer from Pit-Wall Instrument to Protocol Sheet
3eb0839 Establish skipped maxes with a first-exposure calibration set
aed34a8 Stop onboarding enrolling every new plan in Bench Domination
```

Branch point: `b3468c8`. The owner wants a push at every major addition.

---

## 3. Owner action items — nothing else is blocked on these

1. **Run the plan-id migration.** `npm run migrate:plan-ids` (dry) then
   `-- --apply`. Needs `npm i -D firebase-admin` and
   `GOOGLE_APPLICATION_CREDENTIALS`. Not run by the assistant — it writes to
   production Firestore. Nothing is broken while pending; see §6.
2. **Optional:** `.firebase/hosting.ZGlzdA.cache` is tracked but regenerated on
   every deploy, so it keeps dirtying the tree. Candidate for `.gitignore`.
3. **Optional:** `public/imamculate.png` is misspelled (should be *immaculate*).
   Referenced consistently, so nothing is broken.

---

## 4. Decisions locked — do not re-litigate

### Onboarding
| Question | Decision |
|---|---|
| "I don't know my 1RM" | **First-session calibration set.** No rep-test at onboarding. |
| Which plans ask for which lifts | **Derived from plan data** (`progression.of`), not declared per plan. |

### UI — all 11 open questions from the spec's §11
| # | Question | Decision |
|---|---|---|
| 1 | Neutral default signal | Ice `#dce8f1` |
| 2 | Chassis | Neutral `#0a0b0c` everywhere; program tint on **panels only** |
| 3 | Program artwork | Defined slot, **grayscale-first**, colour on active |
| 4 | Mono usage | Micro-labels + live-set figures only |
| 5 | Mobile dock | **5 items, no drawer** |
| 6 | Trophy case | Out of the shell, into a **new `/app/profile` route** |
| 7 | Load steppers | **None** — tap-to-edit only |
| 8 | RestTimer | **Full-width bar above the dock** |
| 9 | Set ledger | **Protocol sheet + click-to-edit** (see §7) |
| 10 | Inputs | **Underline everywhere** |
| 11 | Adventure route | **Full overhaul**, not exempt |
| 7.1 | Desktop nav | **Keep labelled sidebar**, re-skinned flat |

The owner overrode the spec's own recommendation on 7, 8, 10 and 11.
For #10, the agreed mitigation is row-level tap targets ≥44px with the whole row
clickable, not just the underline.

### Naming
- Renamed plans keep **English names in the Polish locale**, unlike descriptive
  neighbours ("Król Przysiadu"), because they are brand names set into the cover
  artwork and a translated label would contradict the image beside it.
- **Plan ids were renamed** (the owner asked for this explicitly after initially
  being told ids would be left alone).

---

## 5. Section A — what was built

- `requiredStatsFor()` in `planBuilder.ts` derives each plan's needed maxes from
  its own `progression.of` keys; `definePlan` attaches them to `PlanConfig`.
- `src/data/benchmarkLifts.ts` holds render metadata, deliberately separate so
  adding a plan never touches it and adding a lift never touches the plans.
- Generic `benchmark` step in `Onboarding.tsx` with an "I don't know" toggle.
  Enrols in the **selected** plan. A plan needing no maxes (Tenfold) degrades to
  a plain confirmation rather than inventing questions.
- `registerUser` gained an `extra?: Partial<UserProfile>` argument so
  `pendingCalibration` is written in the same document create — a follow-up
  `updateUserProfile` would race the context's `user` state.
- `src/features/workout/progression/calibration.ts`: plan-agnostic, keys off the
  athlete's `pendingCalibration` rather than the program's identity, so it runs
  for every plan. Epley on the **best** set, not the heaviest.
- `scripts/verify-onboarding.ts` — 84 assertions. Mutation-tested (an
  untranslated lift makes it fail), and it caught a real mistake during the
  build: calibration copy landing in `adventure.workout` instead of `workout`.

**Not verified in a browser.** The entry gate needs a Firestore access keyword;
the assistant declined to create an account or enter credentials. The owner chose
to defer visual verification to phase B7, when the step is restyled anyway.

---

## 6. Plan id rename — how the compatibility works

| Old id | New id |
|---|---|
| `accumulate-intensify` | `purgatorio` |
| `the-weakest-link` | `immaculate-restructure` |
| `upper-body-squat` | `workhorse` |

Ids key user documents, `programProgress` entries, saved workout logs and access
keys. Three mechanisms make code deploy and data migration safe **in either
order**:

1. `canonicalPlanId()` in `src/data/planIds.ts` — all reads resolve through it.
2. `firestore.rules` `validPlanIds()` still accepts the old ids.
3. `normalizeLegacyPlanIds()` rewrites a loaded profile in memory.

**Workout logs are deliberately never rewritten.** A saved session records what
was run under the id current at the time. So `LEGACY_PLAN_IDS` is permanent;
only the `firestore.rules` entries get removed once the migration has run.

`verify:registry` enforces this rather than being silenced: each legacy id must
be declared, point at a real plan, and appear in `validPlanIds()`.

---

## 7. Next up — B2, the shell

The owner asked for design options **before** building, via the `impeccable`
skill, on every UI phase. Do not skip that.

B2 scope: labelled sidebar re-skinned flat; 5-item mobile dock replacing the
hamburger drawer; brand lockup in Hanken; trophy case extracted to a new
`/app/profile` route; grayscale-first program artwork slot.

Then B3 (live-set console — the proof surface, screenshot review against the
sketch), B4 (ledger + click-to-edit), B5 (dashboard), B6 (RestTimer + modals),
B7 (History, ExerciseBrowser, Settings, Entry/Onboarding, Adventure), B8 (finish
pass: contrast audit of all themes incl. light-skin Peachy, PL strings,
reduced-motion, detector, then **rewrite `DESIGN.md`**).

### B4 needs a spec before code
"Protocol sheet with click-to-edit" is the owner's own wording and the most
design-heavy item. The agreed direction: one hairline table, tapping a row
expands it in place into an edit surface while the rest of the sheet stays
visible; one row open at a time; logging collapses and advances. **Show the
interaction spec to the owner before building it.**

---

## 8. Known open defects, not yet fixed

| Where | Problem | Fix in |
|---|---|---|
| `src/pages/Entry.tsx` | Primary button hardcodes `bg-zinc-100 text-black`, so it renders grey instead of the ice signal. A per-page style fork, which PRODUCT.md bans. | B7 |
| Live-set console | Exercise name wraps to four lines ("Flat / Barbell / Bench / Press") in a column too narrow for it. | B3 |
| Live-set console | `LOAD MODE — MANUAL` is exactly the fake system-status line the spec bans as fluff. | B3 |
| `src/index.css` | Two `transition: height` / `transition: width` on progress meters (detector findings). Should become transform-based. | B3/B5 |
| Entry | "CREATE A NEW KEYWORD" is untranslated in Polish. Pre-existing. | B7 |
| `DESIGN.md` | Still documents the replaced Pit-Wall world, so the detector reports ~146 "undeclared font/size/colour" findings. Expected. | B8 |

---

## 9. How to verify — and the constraints

**No unit-test runner exists.** Verification is 14 `verify:*` tsx scripts plus
the browser preview. Full sweep:

```bash
for s in registry onboarding plans lifecycles progression library techniques extra-sets volume tip-coverage; do npm run verify:$s; done
```

All pass at `641991e`, and `npm run build` is clean.

**Browser:** a dev server already runs on port 5173 (the owner's), so
`preview_start` with a `name` fails on a port clash — open the URL directly
instead. **There is no logged-in session in the assistant's browser pane**, and
the entry gate needs a Firestore keyword, so authenticated surfaces cannot be
driven directly. Two workarounds used successfully:
- mount real markup with real classes via `javascript_tool` and measure computed
  layout (this is how the clipping fix was verified across 48 combinations);
- ask the owner to log in and then drive their session.

**Impeccable:** run `node <skill-base>/scripts/context.mjs --target <file>` once
per session. The direction is brief-pinned, so the concept-seed roll is skipped.
Run `detect.mjs` on changed files once per phase.

---

## 10. Traps already hit — don't repeat them

- **`@import` must precede all other rules.** Putting `@font-face` above
  `@import "tailwindcss"` silently drops the entire Tailwind import.
- **`translations.ts` has nested `workout` blocks.** `adventure.workout` sits at
  a similar indent to the top-level `workout`; copy landed in the wrong one.
  `verify:onboarding` now catches this class of error.
- **Peachy is the one light theme.** A global "flatten all backgrounds to the
  neutral chassis" pass turned it dark. It must stay light.
- **The console splits into two columns on desktop**, so anything sized in `vw`
  overflows its actual column. Use container queries (`cqi`).
- **`figureLength` buckets must account for the `kg` suffix**, which eats ~30px
  of the column; the first fix still clipped at narrow widths without it.
- **`planMeta.ts` and `plans.ts` must not import each other** — hence the
  dependency-free `planIds.ts`.
- Artwork was assigned by *new* name to the *wrong old* id, crossing Purgatorio
  and Workhorse. **Check the wordmark rendered inside the image**, not the
  filename.
