# B3 — Live-set console: design options

The option round before the build, same format as B2. This is the proof
surface: it is read at arm's length, mid-set, heart rate up, and it is the one
place the design either works or doesn't.

Locked going in (§5, §7.4): the load figure is the largest type in the app;
one primary action; RPE is never invented when the plan doesn't prescribe it;
the figure keeps its container-query sizing (a `vw` figure clipped the athlete's
own typed load on desktop — see the handoff's trap list).

---

## 1. The desktop split — the cause of a known defect

The console currently splits into two columns on desktop (`1.15fr .85fr`), head
on the left, measurements/telemetry/command stacked right. That is a Pit-Wall
instrument-panel idea, and it is why the logged defect exists: at ~1024px the
head column is ~390px and `Flat Barbell Bench Press` wraps to four lines.

- **(a) One column of horizontal bands at every width — chosen.** It is
  literally the grammar §6 asks for ("horizontal bands separated by hairlines").
  It fixes the four-line wrap at the cause rather than shrinking the type to
  survive a column that shouldn't be narrow. It also *widens* the measurement
  labels, so the container-query figure sizing gets more headroom, not less.
- (b) Keep the split, shrink the name. Treats the symptom, and the name is the
  second most important thing on the surface after the load.
- (c) Keep the split, let the name truncate. Never — the athlete needs to know
  which movement they are on.

## 2. The session meter

Currently a vertical 8×66px bar with `transition: height`, which is one of the
two transform-less transitions the detector flagged.

- **(a) Delete the bar; the head's own bottom hairline becomes the progress
  rule, filled by `transform: scaleX()` — chosen.** The line was already there
  doing separation; now it separates *and* reports. Nothing added, one thing
  removed, and the transition is transform-based by construction.
- (b) Keep a vertical rule, animate it with `scaleY`. Fixes the transition but
  keeps a decorative element competing with the head.
- (c) Progress in the counter text only. Loses the at-a-glance read.

## 3. History and advice

Currently two rounded pills — a banned shape in primary workflow.

- **(a) One hairline spec row: `LAST 100 kg × 8` / `ADVICE +2.5 kg` / `SET 3/5`
  — chosen.** Label column, value column, the site's grammar. It also gives the
  per-exercise set counter a home, which it needs once LOG SET goes full width.
- (b) One prose line ("last: 100 × 8 · advice: +2.5 kg"). Compact but the
  values stop being scannable, and scanning is the point.

## 4. `LOAD MODE — MANUAL`

The spec bans fake system-status lines by name, and this is one. But the thing
underneath it is real and required: PRODUCT.md principle 5 says auto-calculated
values must be visually distinct from user-entered ones.

- **(a) Move it onto the field it describes — chosen.** The weight's micro-label
  reads `WEIGHT · AUTO` while the value still equals the load the plan computed,
  and plain `WEIGHT` the moment the athlete types something else. It is data
  about that input, not a status line about the system, and it needs no new
  state — the comparison is already derivable.
- (b) An accent tick beside the figure. Quieter, but colour alone carrying
  meaning fails §9.
- (c) Drop the distinction entirely. Cheapest, and gives up a product principle.

## 5. The LOG SET block

- **(a) Full-width signal block flush to the bottom edge, 64px, tracked label —
  chosen**, per §7.4. The set counter that shared its row moves to the spec row
  (option 3).
- (b) Keep the counter beside it. Halves the target width for no gain; this is
  the one action on the screen.

---

## Consequences worth knowing

- **The console stops being a box.** No border, no gradient, no shadow — bands
  separated by hairlines, sitting directly on the chassis. That is the single
  biggest visual change in this phase, and it is what §7.4 asks for.
- **Four strings were hardcoded English** (`Live set`, `Log set`, `RPE`,
  `Rest`). They are real labels, so they got real keys rather than staying
  untranslated in the Polish locale.
- **`RPE` stays `RPE` in both locales** — it is the standard abbreviation in
  Polish training writing too, not an untranslated string.
