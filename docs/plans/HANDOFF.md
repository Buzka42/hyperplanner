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

**B. UI overhaul — all 8 phases done.** Replacing the "Pit-Wall Instrument" visual
world with "Protocol Sheet", per `docs/protocol-sheet-redesign.md`. The direction
was chosen by the owner before this work started and is pinned; it is not open
for re-derivation.

**C. Plan testing — done.** See IMPLEMENTATION_PLAN.md §C.

Along the way: three plan renames (names, artwork, ids) and a console defect
where the load figure clipped the logged number.

---

## 2. Commits on this branch

```
<this commit> Test the calibration path, and unblock the volume audit
             Finish the overhaul: audit every theme and rewrite DESIGN.md
             Bring the remaining surfaces into the Protocol Sheet
             Move the rest timer to the thumb, and flatten the modal family
             Rebuild the dashboard as a spec sheet, and drop the logo mark
1f54109 Turn the ledger into a read-only protocol sheet
ae60948 Spec the ledger's click-to-edit flow for approval
79b2d65 Rebuild the live-set console as hairline bands
f830cf4 Rebuild the shell as a Protocol Sheet
05a949f Add a session handoff document
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

## 7. What is left

**The overhaul is finished.** A, B1–B8 and C are all done and pushed. Every
phase has an options document in `docs/plans/` recording the alternates and why
the built one won, and `DESIGN.md` now documents the system that actually
exists.

### Owner action items

1. **Run the plan-id migration.** Still the only blocking item. It writes to
   production Firestore and there are no credentials in the assistant's
   environment, so it could not be run here. `npm run migrate:plan-ids` (dry)
   then `-- --apply`. The script was read end to end and is correct: the map
   direction is old → new, users and accessKeys are covered, workout logs are
   deliberately untouched.
2. **Decide on Ritual's shoulder volume.** `verify:volume` reports it training
   shoulders once a week on 3 direct sets. Advisory, unchanged.
3. **Run the Impeccable detector** when the skill is available. It was not
   installed here. `DESIGN.md` being current should make it quiet.

### Judgement calls worth reviewing

Each is a small revert if you disagree, and each is recorded in its phase's
options doc:

- The **restart** control on the rest timer was removed (B6).
- **`Est. time`** is not on the dashboard, because nothing measures it (B5).
- The **logo mark** is gone from Entry as well as the shell (B5/B7).
- Page titles are **sentence case app-wide** (B2).
- `/app/profile` absorbed **logout and the language switcher** (B2).

## 8. Known open defects, not yet fixed

| Where | Problem | Fix in |
|---|---|---|
| `src/pages/Entry.tsx` | Primary button hardcodes `bg-zinc-100 text-black`, so it renders grey instead of the ice signal. A per-page style fork, which PRODUCT.md bans. | B7 |
| `ProtectedLayout` | The badge-unlock overlay is still the old world — confetti, gradient panel, `CLAIM GLORY`, `Math.random` during render (4 eslint errors). Left alone deliberately in B2. | B6 |
| `src/index.css` | `.theme-adventure` no longer tints the shell chrome, but Adventure's own route CSS below it is untouched. | B7 |
| Entry | "CREATE A NEW KEYWORD" is untranslated in Polish. Pre-existing. | B7 |
| `DESIGN.md` | Still documents the replaced Pit-Wall world, so the detector reports ~146 "undeclared font/size/colour" findings. Expected. | B8 |

---

## 9. How to verify — and the constraints

**No unit-test runner exists.** Verification is 15 `verify:*` tsx scripts plus
a set of render harnesses. Full sweep:

```bash
for s in registry onboarding calibration plans lifecycles progression library \
         techniques extra-sets volume tip-coverage adventure supermutant; do
  npm run verify:$s
done
```

All pass, and `npm run build` is clean.

**The UI is verified by rendering, not by eye.** There is no logged-in session,
so each phase built a harness page that mounts the real markup against the real
compiled CSS, and `audit.mjs` asserts on the result: no horizontal overflow, no
sub-44px targets, no clipped or mid-word-broken text, ≥4.5:1 on every text role
composited through translucent fills, and all motion collapsed under
`prefers-reduced-motion`. Screenshots live in `.impeccable/qa/b2-*` … `b8-*`.
See `DESIGN.md` § Verification, including two ways to write a contrast probe
that lies.

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
- **Never declare `display` in `index.css` for an element that also carries a
  Tailwind display utility.** Tailwind v4 emits utilities into
  `@layer utilities`, and any unlayered rule beats every layered one regardless
  of specificity — `.mobile-command-dock { display: grid }` silently defeated
  `md:hidden` and rendered the mobile dock and masthead on desktop. Keep
  `display` on the JSX class list; everything else can live in the stylesheet.
- **`overflow-wrap: anywhere` breaks Polish mid-word.** `USTAWIENIA` became
  `USTAWIENI / A` in a 320px dock slot. Keep it as the last-resort guard, and
  size the text so it never fires.
- **When a defect is "this element is too narrow", check what made the column
  narrow before shrinking the element.** The console's four-line exercise name
  was caused by a desktop two-column split that the design contract didn't ask
  for; removing the split fixed the name *and* gave the load figure more room.
- **The figure input is sized in `ch` from its own value's length.** The face is
  monospaced, so it can never be narrower than what it holds. Do not replace
  this with a fixed width or a bucket — that is how the original
  type-333-see-33 bug worked.
- **Text that carries the program accent must use `--signal-text`, not
  `--primary`.** Several program primaries fail 4.5:1 as text on the chassis
  (Bench Domination's purple is 4.15:1). `--signal-text` mixes toward the
  foreground, which works on the dark themes and on Peachy alike. It is
  declared on `.instrument-shell` because custom properties substitute where
  they are declared — on `:root` it would bake in the default ice accent for
  every program.
- **Two ways to write a contrast probe that lies.** Treating a 7% row tint as
  an opaque background reports the full-strength accent as the ground; and
  `color-mix` computes to `oklab(...)`, whose three numbers are not RGB. Both
  produced confident failures that were not real. Resolve colours through a
  canvas and only stop the background walk at alpha 1.
- **When the only editor changes, check what the old editor was passing.** The
  ledger passed `isPullup` and the rep target into `handleSetChange`; the
  console did not, so making the console the only editor nearly dropped the
  pull-up EMOM auto-fill.
