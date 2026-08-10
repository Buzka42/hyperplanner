---
name: Hyperplanner
description: Protocol Sheet — a quiet, precise document the lifter writes into.
colors:
  chassis: "hsl(210 8% 4%)"
  panel: "hsl(210 8% 7%)"
  ink: "hsl(200 6% 95%)"
  muted: "hsl(205 7% 71%)"
  hairline: "rgba(255, 255, 255, 0.14)"
  hairline-strong: "rgba(255, 255, 255, 0.24)"
  signal-ice: "hsl(203 38% 90%)"
  warning-red: "hsl(0 72% 51%)"
typography:
  display:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 5vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  figure:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "clamp(2.5rem, 10vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.62rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  structure: "0"
  input: "0"
  control: "2px"
  floating: "6px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.signal-ice}"
    textColor: "{colors.chassis}"
    typography: "{typography.label}"
    rounded: "{rounded.structure}"
    padding: "0 24px"
    height: "64px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.input}"
    padding: "8px 0"
    height: "44px"
  row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.structure}"
    padding: "12px 0"
    height: "48px"
---

# Design System: Hyperplanner

## Overview

The app is a single well-composed document — a spec sheet the lifter writes
into. Near-black chassis, ink-white type, hairline rules, one program accent
used sparingly. Luxury here means *nothing to remove*: every element is either
information or a control.

This replaces "Pit-Wall Instrument" (Saira Semi Condensed, chamfered graphite
panels, machined textures, billet buttons), which was retired in full. The
direction is derived from the owner's site, hypertraining.works.

**Read `PRODUCT.md` first.** Its six product truths outrank everything here.
The two that shape the most decisions: numbers are the hero, and this is read
one-handed under a barbell.

### What is banned

- **Fluff text as interface furniture.** No `01 / SESSION`, no `SYS / READY`, no
  fake system-status lines, no decorative protocol numbering. Numbers must be
  data — a set count, a load, a week.
- **Saira Semi Condensed**, anywhere.
- **Oversized type.** Nothing outside the live load figure exceeds 2.5rem.
- **Per-page style forks.** If a page needs a colour, it needs a token.
- **Emoji as icons**, gradient text, `animate-pulse` decoration.
- **Pills in primary workflow**, chamfers, clip-paths, textures.

---

## Colors

Themes are complete token sets, one per program, applied as a class on the app
shell (`ProtectedLayout`). Pages never redefine tokens.

### The chassis is neutral

`--background` is `#0a0b0c` for every program. Flavor comes from the program's
accent, its artwork, and its copy — never from the chrome.

Peachy is the one inverted chassis and stays light. It is not a naive inversion;
it carries its own dark-on-light hairline scale.

### Signal scarcity

The program accent appears on: the primary action, the active navigation state,
progress indication, focus rings, and small data highlights. Never on headings,
never as decoration.

### `--signal-text` — the one rule people get wrong

**Text that carries the program accent must use `var(--signal-text)`, never
`hsl(var(--primary))`.**

Several program primaries fail 4.5:1 as text on the chassis — Bench Domination's
purple is 4.15:1. `--signal-text` mixes the accent toward the foreground, which
raises contrast on the dark themes and lowers luminance on Peachy, so one rule
serves both polarities without thirteen hand-tuned values.

Fills, edges and glyphs keep `--primary` directly: the contrast gate pushes a
failing accent out of *text* roles, not out of the interface.

It is declared on `.instrument-shell`, not `:root`. Custom properties are
substituted where they are declared, so a `:root` declaration would bake in the
default ice accent for every program.

### Named rules

- `--instrument-rule` — the 1px hairline that does the work borders and shadows
  used to do.
- Body text clears **4.5:1 in every one of the 19 themes**. This is enforced, not
  aspirational — see *Verification*.

---

## Typography

**Hanken Grotesk** for everything, **JetBrains Mono** for data only. Both are
self-hosted: gym Wi-Fi should never sit between the lifter and the interface.

| Role | Size | Notes |
|---|---|---|
| Live load figure | `clamp(2.5rem, 10vw, 4.5rem)` | the largest type in the app, and only in the console |
| Page title | `clamp(1.5rem, 5vw, 2.5rem)` | sentence case |
| Section title | 1.25rem | |
| Body | 1rem | |
| Secondary | 0.875rem | |
| Micro-label | 0.62rem | mono, tracked 0.14em, uppercase |

**Sentence case headlines.** Uppercase is reserved for micro-labels and button
labels. Numerals are tabular everywhere.

### The live figure

Two mechanisms keep it readable, and both matter:

- Its **size** comes from its own container (`cqi`), not the viewport. On desktop
  the console's measurement band splits in two, so a `vw`-sized figure overflows
  its actual column.
- Its **width** comes from its own value's character count (`ch`). The face is
  monospaced, so the field can never be narrower than what it holds. This is why
  the athlete cannot type 333 and see 33.

Do not replace either with a fixed value.

---

## Shape, space, depth

- **Corners:** 0 on structure and tables. 2px on buttons. 6px on floating layers
  only. No chamfers, no clip-paths.
- **Rules:** 1px `--instrument-rule`. `.24` white for strong separation.
- **Spacing:** 8px base (8/12/16/24/40). Section gaps lean 24–40, not 12.
- **Depth:** tonal steps only. Exactly one shadow is permitted, and only on
  floating layers: `0 16px 40px rgba(0,0,0,.45)`.
- **Composition:** horizontal bands separated by hairlines; spec rows of a label
  column and a value column; generous left margin. Cards as decorated boxes do
  not exist.

---

## Components

### Rows — the core grammar

Most of the app is rows. The set ledger, the week list, the library, modal
choices and the history archive all share one shape: a hairline-bottomed row,
≥48px, with a left edge that goes accent when selected. Reuse it before
inventing a layout.

### Spec rows

`.spec-rows` — label column sized to content, value column flexible. Used by the
dashboard, the console and the profile. The label column must be `auto` and the
value `minmax(0, 1fr)`; reversed, a long value grows past the row and prints
over its own label.

### Buttons

One primary action per surface, as a full-width signal block, ≥56px, square.
Secondary actions are hairline-bordered, uppercase mono micro-labels.
Destructive actions use `--destructive`, never the accent.

### Inputs

**Underline only.** The owner chose this over boxed inputs, overriding the
spec's own gym-safety recommendation. The agreed mitigation is load-bearing:
every field is ≥44px, the `<label>` wrapping it is the click target so the
affordance is the whole row rather than the rule, and focus is a 2px accent
underline.

### Floating layers

`.instrument-floating` on `ui/dialog` and `ui/sheet` — 6px corners, the one
permitted shadow. Bottom sheets round only their top corners. Every modal in the
app is built from these two primitives; restyle there, not per modal.

### The live-set console

Hairline-divided bands, no panel box, one column at every width. Head (with its
bottom rule doubling as the session progress meter), spec rows, measurements,
telemetry, and a full-width LOG SET block flush to the bottom edge.

`WEIGHT · AUTO` marks a load the plan computed; it drops to plain `WEIGHT` the
moment the athlete types their own. That is PRODUCT.md principle 5 rendered on
the field it describes, rather than as the status line the brief bans.

### The ledger

Read-only rows; the console is the only editor. Tapping a row hands its set to
the console and scrolls the console into view. Row state is exposed as text as
well as a glyph — done is fill **and** check **and** the word "Logged".

---

## Motion

One easing: `cubic-bezier(.16, 1, .3, 1)`, 200–350ms. State changes only. No
ambient animation, no glow pulses, no counting tweens.

**Animate `transform`, never `height` or `width`.** Progress meters use
`scaleX`. Two meters animated layout before this was enforced.

`prefers-reduced-motion` collapses everything globally, and it is verified.

---

## Accessibility & i18n

- Every interactive element ≥44×44px.
- 4.5:1 body text on every program chassis, including Peachy.
- Focus: 2px signal ring or underline, visible on dark and light skins.
- **State is never carried by colour alone.** Done is fill + glyph + text. AMRAP
  is the literal word. Locked trophies say "Locked".
- Polish runs ~20% longer than English. Nothing may truncate; labels wrap. The
  mobile dock steps its type down below 360px so `USTAWIENIA` fits — it used to
  break to `USTAWIENI / A`.

---

## Verification

There is no unit-test runner and no logged-in session available to an assistant,
so surfaces are verified by rendering their real markup against the real
compiled CSS and asserting on the result. Every phase of the overhaul added a
harness page rather than another script.

Asserted on each surface, across viewport × theme × locale:

- no horizontal overflow;
- no interactive element under 44px;
- no clipped text and no mid-word breaks;
- **≥4.5:1 on every text role**, composited through translucent row fills;
- all motion collapsed under `prefers-reduced-motion`.

Two ways to write a contrast probe that lies, both of which produced confident
false failures during this work:

1. Treating a 7% row tint as an opaque background reports the full-strength
   accent as the ground. Only stop the background walk at alpha 1.
2. `color-mix()` computes to `oklab(...)`, whose three numbers are not RGB.
   Resolve colours through a canvas.

Also: the 14 `npm run verify:*` scripts guard plan data and must stay green.

---

## Traps

- **Never declare `display` in `index.css` for an element that also carries a
  Tailwind display utility.** Tailwind v4 emits utilities into
  `@layer utilities`, and an unlayered rule beats every layered one regardless of
  specificity. This silently defeated `md:hidden` and rendered the mobile dock
  on desktop.
- **`@import` must precede all other rules.** A `@font-face` above
  `@import "tailwindcss"` drops the entire Tailwind import.
- **`translations.ts` has nested `workout` blocks.** `adventure.workout` sits at
  a similar indent to the top-level `workout`. Anchor inserts on the real locale
  boundaries, not the first match.
- **Peachy must stay light.** A global "flatten backgrounds to the chassis" pass
  turns it dark.
- **When a defect is "this element is too narrow", check what made the column
  narrow** before shrinking the element.
