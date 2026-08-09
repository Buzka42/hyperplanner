# Protocol Sheet — UI overhaul spec

Status: **direction chosen, element treatments open for discussion.**
Implementation: handed to Claude (another session). This document is the contract
plus the option space — decisions marked ◆ are locked, items marked ◇ are open
and meant to be discussed before or during the build.

Chosen via the Impeccable decision round (branch `ui-overhaul-gym-ux`), sketches in
`.impeccable/sketches/` (`hypertraining-protocol.png` is the chosen card).

---

## 1. What we are doing and why ◆

A full visual overhaul of the authenticated app (`src/App.tsx` shell and everything
under it). The current world — "Pit-Wall Instrument" (Saira Semi Condensed,
chamfered graphite panels, machined textures, billet buttons) — is replaced.

Two concrete complaints triggered it:

- The display font (Saira Semi Condensed) didn't land.
- Type was too large in places (7.5rem live-set digits, 5.5rem dashboard headlines).

The replacement direction is **Protocol Sheet**, derived from the owner's site
[hypertraining.works](https://hypertraining.works), refined as **clean luxury**:
quiet, precise, generous with space, no decoration theater. The UI chrome carries
no flavor — **flavor comes from the eight training programs** (their accent color,
artwork, and copy), never from status role-play in the interface.

Explicitly banned by the owner: ◆

- "Fluff text" as interface furniture — no `01 / SESSION`, no `SYS / READY`,
  no fake system-status lines, no decorative protocol numbering.
- Saira Semi Condensed anywhere.
- Oversized type. Disciplined scale everywhere (see §5).

Also banned by PRODUCT.md (still in force): emoji as icons, gradient text,
`animate-pulse` decoration, per-page style forks.

---

## 2. The product truth that constrains everything ◆

From PRODUCT.md — these outrank every aesthetic idea in this document:

1. **Numbers are the hero.** Weight and reps get the largest type on any screen,
   tabular figures, highest contrast. Decoration never competes with the target.
2. **Glanceable under a barbell.** Phone in one hand, sweaty, bright overhead
   light, between sets. Touch targets ≥44px, one-thumb reach, state readable
   from a meter away (done / pending / AMRAP).
3. **One system, eight skins.** Programs are token swaps (CSS variables), never
   per-page forks. Structure and components are identical across programs.
4. **Menace through restraint.** Personality comes from typography, copy, and
   one committed accent per program — not effects.
5. **Trust the log.** Saved looks saved; destructive looks dangerous;
   auto-calculated values are visually distinct from user-entered ones.
6. Body text ≥4.5:1 contrast in every theme; full `prefers-reduced-motion`
   support; EN/PL bilingual — Polish strings run ~20% longer, nothing truncates.

---

## 3. Direction: Protocol Sheet, clean luxury ◆

**Thesis:** the app is a single well-composed document — a spec sheet the lifter
writes into. Near-black chassis, ink-white type, hairline rules, one program
accent used sparingly. Luxury here means *nothing to remove*: every element is
either information or a control.

**Source language (from hypertraining.works, extracted from production CSS):**

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0b0c` | page chassis |
| panel | `#111315` / graphite `#242629` | raised surfaces (sparingly) |
| `--ink` | `#f2f3f3` | primary text |
| `--muted` | `#aeb4b9` | secondary text |
| hairline | `#ffffff24` (≈14% white) | all rules/borders |
| `--silver` | `#c7c9cb` | quiet emphasis |
| `--signal` | `#dce8f1` | the site's ice accent — see §4 |
| easing | `cubic-bezier(.16,1,.3,1)` | all motion |
| fonts | Hanken Grotesk 100–900, JetBrains Mono 400–700 | see §5 |

**What changes from the current app:**

| Current (Pit-Wall) | Protocol Sheet |
|---|---|
| Saira Semi Condensed display | Hanken Grotesk, tight tracking |
| Chamfered clip-path panels | Square or ≤2px corners, 1px hairlines |
| Machined-graphite / brushed-billet textures | No textures. Tonal steps only |
| Command-depth shadows | Near-zero elevation; one soft shadow for floating layers |
| Blue signal default | Ice-silver neutral; program accent per plan |
| Uppercase display everywhere | Sentence case headlines; uppercase only for micro-labels |
| Big display scale | Capped scale (§5) |

**What survives untouched:** all logic, Firebase, progression engines, routing,
i18n keys, the theme-token architecture (`index.css` `@layer base` themes),
Lucide icons, the 44px minimum, and the product copy's voice.

---

## 4. Color & theming: where program flavor lives ◆ / ◇

The chassis is deliberately neutral so the **program** supplies the color.
The existing per-program token sets in `src/index.css` (`--primary`, `--accent`,
per-program backgrounds) remain the mechanism.

◆ Locked:

- **Signal scarcity.** Program accent appears only on: the primary action,
  active navigation state, progress indication, focus rings, and small data
  highlights (e.g. progression deltas). Never on headings or decoration.
- **Contrast gate.** Any accent used for text must hit 4.5:1 on the chassis.
  Accents that fail (some program primaries will) are pushed to non-text roles
  or brightened for the text role. Claude: audit all ~13 themes and report.
- **Peachy stays a light skin** — the one inverted chassis. It needs its own
  hairline scale (dark-on-light) rather than a naive inversion.

◇ Open — worth discussing:

- **Neutral default signal.** When no program is active (Entry, Onboarding),
  does the app use the site's ice `#dce8f1`, or the current steel blue?
  Recommendation: ice — it aligns app and site identity.
- **How loud is a "loud" program?** Super Mutant's irradiated green and Pain &
  Glory's torch red want more presence than a 1px rule. Options:
  (a) strict scarcity, same for every program — cleanest, flattens personality;
  (b) scarcity for chrome, but the program artwork (existing `public/*.png`
  covers) gets a defined slot with real presence — recommended;
  (c) per-program chassis tint (current behavior: each theme shifts
  background hue) — keep or flatten to one neutral chassis for all?
  Flattening is more "clean luxury"; keeping chassis tints preserves the
  "eight skins" feel. This is the biggest theming decision — see §11.
- **Program artwork slot.** If artwork gets a home (dashboard card, sidebar
  plate), define the treatment: grayscale-first like the site
  (`grayscale(.8) contrast(1.05)`, color on the active state) or full color?

---

## 5. Typography ◆

**Fonts:** Hanken Grotesk (UI + display), JetBrains Mono (data only).
Both are already loaded by the site; add via Google Fonts or self-host
(the site self-hosts — self-hosting also helps gym Wi-Fi).

**Roles:**

- *Display/headlines:* Hanken Grotesk 600–650, tracking −0.02…−0.045em,
  sentence case. Weight 650 via variable font.
- *Body/UI:* Hanken Grotesk 400–500, 1rem, line-height 1.5.
- *Micro-labels:* 600, 0.7rem, tracking 0.12em, uppercase. ◇ Face: mono
  (site-faithful) or Hanken (quieter)? Recommendation: mono, but *only* for
  real labels — never decorative tags.
- *Numerals:* tabular always. ◇ Mono for the big load/reps figures
  (site's price-readout character) vs Hanken tabular (calmer)? Recommendation:
  mono for the live-set figures only; Hanken tabular elsewhere.

**Scale (capped — this is the owner's explicit ask):** ◆

| Role | Size | Notes |
|---|---|---|
| Live load figure | clamp(2.5rem, 10vw, 4.5rem) | the single largest thing on screen, and only in the console |
| Page title | clamp(1.5rem, 5vw, 2.5rem) | was 4.5rem |
| Section title | 1.25rem | |
| Body | 1rem | |
| Secondary/small | 0.875rem | |
| Micro-label | 0.7rem | tracked uppercase |

Hard rule: nothing outside the live load figure exceeds 2.5rem on mobile.

---

## 6. Shape, space, depth ◆

- **Corners:** 0 on structural zones and hairline tables; 2px allowed on inputs
  and buttons; 6–8px only on floating layers (sheets, modals, toasts).
  No chamfers, no clip-paths, no pills in primary workflows.
- **Rules:** 1px, `rgba(255,255,255,.14)` default; `.24` for strong separation.
  Hairlines do the work borders-and-shadows did before.
- **Spacing:** 8px base rhythm (8/12/16/24/40). Clean luxury = more air:
  section gaps lean 24–40, not 12.
- **Depth:** tonal steps only (chassis → panel). One soft shadow permitted for
  floating layers: `0 16px 40px rgba(0,0,0,.45)`. Retire
  `0 20px 48px` command-depth and all texture overlays
  (`/materials/machined-graphite.png`, `brushed-billet.png` references go).
- **Composition:** the site's grammar is *horizontal bands separated by
  hairlines, spec rows (label column + value column), generous left margin*.
  Panels become flat zones; cards as decorated boxes mostly disappear.

---

## 7. Element-by-element — gym-scene review ◇ (all open)

Each element: the constraint from the squat rack, options, a recommendation.
**This is the discussion agenda with Claude — nothing here is final until agreed.**

### 7.1 App shell & navigation

Current: desktop left sidebar (wordmark, plan plate, 5 nav buttons, trophy case,
logout), mobile top rail + hamburger drawer + 4-slot bottom dock
(`mobile-command-dock`).

Gym constraint: mid-workout, only the dock matters. Dashboard / current workout /
history / settings; one-thumb, safe-area aware.

◇ Options:
- **(a) Keep 5-item dock**, icons + 9px mono labels, active = accent hairline-top
  or accent label. Recommended — kills the drawer, everything one tap away.
- (b) 4 items + "More" sheet. Fewer targets, one more tap for settings.
- Desktop: slim icon rail vs current labeled sidebar? A narrow rail with the plan
  plate on top is more site-like; labeled sidebar is faster to scan.
- **Trophy case** (badge grid in sidebar): flavor that lives in chrome — against
  the brief. Move to a Dashboard/History section, or keep desktop-only?
  Recommendation: move it out of the shell.

### 7.2 Brand lockup

Current: logo + "HyperPlanner" two-tone wordmark, Saira. ◆ Font swaps to Hanken.
◇ Consider adopting the site's lockup (`HYPERTRAINING`-style tracked caps,
small) for cross-product identity, or keep the png logo + Hanken wordmark.

### 7.3 Dashboard — next-session module

Current: `dashboard-command` chamfered panel, huge headline, manifest grid,
big START button, then telemetry widget grid.

Gym constraint: opened on the walk in or between sessions; the job is
"what today, how heavy, start it."

◇ Options:
- **(a) Spec-sheet header:** quiet eyebrow-free title (program name, sentence
  case), hairline, spec rows (Day / Focus / Top set / Estimated time), full-width
  signal START block below. Recommended — directly the chosen sketch's grammar.
- (b) Keep the two-column command layout, re-skinned square/flat.
- Manifest rows: keep `NN / label / value` columns but drop decorative numbering
  if it reads as fluff — numbers must be data (e.g. set counts, kilos).
- Telemetry widgets below: flatten to hairline-separated rows/sections;
  chart series colors already tokenized (`--chart-*`) — keep, but check against
  the quieter chassis.

### 7.4 WorkoutView — live-set console (the signature surface)

Current zones: head (exercise name, live-set counter, history pills, advice
pill) → measurements (giant load + reps inputs) → telemetry strip (RPE/rest/etc.)
→ command (set count + LOG SET billet bar).

Gym constraint: this is read at arm's length, mid-set, heart rate up. The target
weight must be findable in <1s; logging a set must be one fat-finger-proof tap.

◆ Locked: the load figure is the largest type in the app (per §5 scale);
one primary action; RPE never invented when the plan doesn't prescribe it.

◇ Options & questions:
- **Structure:** keep the zone stack but render it as hairline-divided bands
  (no panel box). The LOG SET command becomes a full-width signal block,
  mono/Hanken tracked label, min-height 56–64px, flush to the console's bottom
  edge. Recommended.
- **Load entry:** giant input (current) vs input flanked by −/+ steppers
  (±2.5 / ±1.25 kg — plate-realistic increments)? Steppers win with sweaty
  hands; keep the input tap-to-edit. ◇ Are micro-plates (1.25) used by these
  programs, or is 2.5 the smallest jump?
- **History pills + advice pill:** currently rounded pills (banned shape).
  Re-render as one quiet line of tabular history ("last: 100 × 8 · advice:
  +2.5 kg") above the head, or a hairline spec row. Recommendation: spec row.
- **Session meter** (vertical progress bar in head): keep as a 1px-track
  vertical rule with accent fill — it fits the language; or move progress into
  the counter text. ◇
- **Telemetry strip:** hairline-divided cells stay; labels mono micro;
  values tabular; hide cells the plan doesn't use (already true — keep).
- **Auto-calculated vs user-entered** (principle 5): proposal — calculated
  values get a small accent tick or muted suffix; edited values stay full ink.
  Needs a visible-but-quiet convention. ◇

### 7.5 Set rows & exercise sectors (the ledger)

Current: `exercise-sector` panels containing `set-row`s with inline inputs;
complete rows get a primary-tinted fill; focus gets an inset accent bar.

Gym constraint: scanning "what's left" between sets; logging out of order
happens; done state must read from a meter away.

◇ Options:
- **(a) True ledger:** drop the sector panels; the whole workout is one
  hairline table — exercise name as a section row, sets as ruled rows with
  set# / load × reps / state. Recommended — it's the literal "protocol sheet".
- (b) Keep per-exercise flat panels with hairline rows inside.
- Done state: quiet fill + check (Lucide `Check`, 44px hit zone on the row).
  AMRAP set: accent left tick (2px) rather than a pill.
- Swipe actions on rows (edit/swap)? Discuss discoverability vs the existing
  tap-to-open `SwapSheet`.

### 7.6 RestTimer

Current: `src/features/workout/RestTimer.tsx` — appears after logging.
Gym constraint: glanced at while breathing hard, phone possibly on the floor.

◇ Options:
- (a) Full-width bottom bar above the dock: huge tabular countdown,
  skip/add-30s zones. Maximum glanceability.
- **(b) Integrated strip inside the console command zone** (replaces LOG SET
  while resting, since logging mid-rest is invalid anyway). Recommended —
  one command zone, one meaning at a time.
- Keep haptic/sound completion cue if present; reduced-motion safe.

### 7.7 Modals & sheets

Family: `SwapSheet`, `WeakPointModal`, `VariationSwapModal`,
`TrinaryRerunModal`, `AccessoryChoiceModal`, `ui/dialog`, `ui/sheet`.

◇ Re-skin: 6–8px radius floating layer, the one permitted shadow, hairline
header, choices as full-width ruled rows (radio behavior), confirm = signal
block. Bottom-sheet pattern on mobile (thumb reach), centered dialog desktop.
Destructive confirmations (any delete/reset paths) in warning red, never accent.

### 7.8 PrescriptionBadges

Current: pill badges on prescriptions (technique sets etc.).
Pills are banned in primary workflow. ◇ Re-render as micro-label + value text
runs, or square 2px chips. Keep the information, drop the bubble.

### 7.9 Inputs & forms

`ui/input`, `select`, `switch`, `checkbox`, `textarea`, Settings and Onboarding
forms. ◇ Site grammar is underline-only inputs (border-bottom hairline, focus =
signal underline). That's clean but weaker affordance on mobile — options:
(a) boxed 2px inputs (current shape, re-colored) — recommended for gym;
(b) underline everywhere (site-faithful, settings-only contexts).
Numeric inputs: keep `inputmode="decimal"`, tabular, no spinners (already true).

### 7.10 History / WorkoutHistory

Dense tabular data — natural fit: hairline table, mono dates/numbers, session
rows expandable. ◇ Any charts inherit `--chart-*` tokens; check muted-grid
treatment on the new chassis.

### 7.11 ExerciseBrowser

Library grid/list with images. ◇ Image treatment: grayscale-first like the
site's covers, full color on active? Keep search input prominent (gym use:
"swap this movement NOW").

### 7.12 Settings

Forms + toggles; desktop-weighted. Inherit everything; lowest priority.
Keep language switcher placement consistent between Entry and Settings.

### 7.13 Entry & Onboarding

First impression; currently `entry-console`/`entry-instrument` with the old
world's textures. ◇ Proposal: split spec-sheet — left: wordmark + one line of
product truth; right: the auth form, hairline separated; program artwork only
after a plan is chosen. Onboarding: numbered *steps* are fine (they're real
sequence, not fluff — but present them as "Step 2 of 4", data not decoration).

### 7.14 Adventure route (30 Minute Adventure)

`AdventureSession/Dashboard` is a deliberately themed special route with its own
CSS section. ◇ Leave its world intact (it's program flavor, not chrome) but
swap its Saira references to Hanken, or fully exempt it? Recommendation: exempt
from the overhaul except the global font swap, revisit later.

### 7.15 Admin

`AdminPanel` + `admin/*` — internal tool. Inherit base tokens (it will pick up
fonts/colors automatically), no bespoke restyle in this pass.

---

## 8. Motion ◆

- One easing: `cubic-bezier(.16,1,.3,1)`, 200–350ms. State changes only
  (expand, appear, progress fill). No ambient animation, no glow pulses.
- Page/sheet transitions: subtle translate+fade ≤8px; none under
  `prefers-reduced-motion` (global rule already in `index.css`, keep).
- Number changes in the console may cross-fade (150ms) — legibility first,
  no counting tweens.

---

## 9. Accessibility & i18n checklist ◆

- [ ] Every interactive element ≥44×44px (dock items, row checks, steppers).
- [ ] 4.5:1 body text on every program chassis — audit all themes, incl. Peachy.
- [ ] Focus: 2px signal ring, offset 2px, visible on dark and light skins.
- [ ] State never by color alone: done = check + fill, AMRAP = tick + label.
- [ ] Polish string pass on: dock labels, spec-row labels, LOG SET
  (`ZAPISZ SERIĘ` is longer), buttons generally — no fixed-width text boxes.
- [ ] `prefers-reduced-motion`: all transitions collapse.
- [ ] Screen-reader: console zones keep their `aria-label`s; ledger rows expose
  set state in text.

---

## 10. Build order (suggested) ◇

1. **Tokens & fonts:** swap font loading, rewrite `index.css` base layer +
   `tailwind.config.js` mapping, retire texture/Saira rules. App should look
   "wrong but working" — proves the token swap end-to-end.
2. **Shell:** ProtectedLayout (sidebar/rail/dock), brand lockup, trophy-case move.
3. **Live-set console** (WorkoutView zones) — the proof surface; screenshot
   review against the sketch before proceeding.
4. **Dashboard** command module + telemetry.
5. **Ledger rows, RestTimer, modals/sheets family.**
6. **History, ExerciseBrowser, Settings, Entry/Onboarding.**
7. **Finish pass:** contrast audit, PL strings, reduced-motion, then the
   Impeccable detector: `node <skill-base>/scripts/detect.mjs --json <changed
   files>` and a screenshot review (desktop + mobile) of every screen.

Rules for the build: no logic/Firestore changes; class restructuring is fine;
i18n keys unchanged (add keys only if a label genuinely doesn't exist);
each phase leaves the app shippable.

---

## 11. Open questions for the discussion ◇

1. Neutral default signal: ice `#dce8f1` (site parity) or keep steel blue?
2. One neutral chassis for all programs, or keep per-program chassis tints?
   (Cleanest luxury vs strongest "eight skins".)
3. Program artwork: defined slot with grayscale-first treatment, or full color,
   or no artwork in the UI at all?
4. Mono usage: labels + live figures (recommended), labels only, or none?
5. Dock: 5 items (recommended) vs 4 + More; desktop rail vs labeled sidebar.
6. Trophy case out of the shell — to Dashboard, History, or a profile area?
7. Load steppers: which increments (2.5/1.25? 5/2.5?) — program-dependent?
8. RestTimer: console-integrated strip (recommended) vs bottom bar?
9. Set ledger: full hairline table (recommended) vs flat per-exercise panels?
10. Underline inputs (site-faithful) vs boxed inputs (gym-safe)? Mixed by
    context is possible: boxed mid-workout, underline in settings.
11. Adventure route: font swap only, or full exemption this round?

---

## 12. References

- Direction card & sketches: `.impeccable/sketches/hypertraining-protocol.png`
  (chosen), plus the two rejected directions for contrast.
- Product truth: `PRODUCT.md`. Current system (being replaced): `DESIGN.md` —
  rewrite at finish per Impeccable flow.
- Surface brief: `.impeccable/surfaces/src-app-tsx.md`.
- Source site: https://hypertraining.works (tokens in §3 extracted from its
  production CSS).
- Branch: `ui-overhaul-gym-ux`.
