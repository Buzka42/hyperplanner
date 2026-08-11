# B5 — Dashboard: design options

Same format as B2–B4.

---

## 1. The next-session module

Today it is `dashboard-command`: a bordered, gradient-filled panel with an
eyebrow, a headline, a four-item "manifest" numbered `01`–`04`, and a START
button.

- **(a) Spec-sheet header — chosen**, and what the plan already proposed. Program
  day name in sentence case, hairline, spec rows, full-width signal START block.
- (b) Keep the two-column command layout, re-skinned flat. Preserves a shape
  built for the world being replaced.

**The manifest's `01`–`04` numbering goes.** The contract's rule is that numbers
must be data; a decorative index in front of an exercise name is the exact fluff
the owner banned. The movement names stay — they are the actual answer to "what
is today".

**The spec rows are only real data.** The plan sketched `Day / Focus / Top set /
Est. time`. There is no estimated-duration figure anywhere in the app and
inventing one would be a number that lies, so the rows are Week, Focus, and
Movements. If you want an estimate later it needs a real basis — set count ×
prescribed rest is derivable, and can be added as a fourth row.

## 2. The greeting block — six style forks

Peachy, Pain & Glory, Trinary, Ritual, Super Mutant and the default each render
their own greeting, and each hardcodes its own button colours
(`border-rose-300`, `bg-red-950/20`, `border-zinc-700`, `border-green-800/50`…).

PRODUCT.md bans per-page style forks; it does not ban per-program *copy*, which
is where flavor is supposed to live.

- **(a) One structure, program copy — chosen.** A single greeting component
  picks its line from the program and renders it identically for all thirteen.
  The History link becomes one control with no per-program colour.
- (b) Leave them. Six variants of the same block, each drifting on its own.

This deletes ~110 lines and every hardcoded colour in that block.

## 3. Telemetry widgets

There are thirteen program-specific widgets, most of them `Card`s. Restyling
each one is ~900 lines of churn.

- **(a) Re-skin the shared `Card` — chosen.** `Card` is the one component every
  widget is built from, so flattening it there flattens all of them at once, and
  keeps "one system, eight skins" true. The inset double-border and the
  gradient wash come off; a card becomes a hairline-bounded flat zone.
- (b) Rewrite each widget's markup. Enormous, and would re-fork what a shared
  component already unifies.

`CardTitle` loses its uppercase transform for the same reason page titles did in
B2 — uppercase is reserved for micro-labels.

## 4. The week list

Cards in a two-column grid, with done state as a green/red border.

- **(a) Hairline rows — chosen.** One row per day: name, exercise count, state.
  Same grammar as the set ledger, which is what makes the app read as one
  document rather than a series of screens.
- (b) Keep the card grid, re-skinned.

Done state follows the ledger's convention exactly: fill plus glyph plus a text
label, never colour alone.

---

## Consequences worth knowing

- Flattening `Card` reaches every page that uses it — History, ExerciseBrowser,
  Settings, Admin. That is intended: they are B7 phases and this moves them
  toward their end state rather than away from it.
- The Peachy 🍑 emoji and the frog image in the greeting are program copy, not
  interface furniture, so they stay. PRODUCT.md bans emoji **as icons**, which
  is a different thing.
