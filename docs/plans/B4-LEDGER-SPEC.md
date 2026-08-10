# B4 — Set ledger + click-to-edit: interaction spec

**Status: needs your approval before any code is written.** This is the item
you asked to see specced first, and it is the most design-heavy decision left in
the overhaul.

Your wording was "protocol sheet + click-to-edit". The agreed direction on
record: one hairline table, tapping a row expands it in place into an edit
surface while the rest of the sheet stays visible, one row open at a time,
logging collapses and advances.

This document says what that actually means, screen by screen and state by
state. §7 is the part I most need an answer on.

---

## 1. What exists today

The ledger is a stack of `Card` panels, one per exercise, that expand to reveal
their sets. Every set row is a 10-column grid holding **two always-live text
inputs** — weight and reps — plus a check icon when complete.

Two consequences drive this phase:

- **Nothing is ever read-only.** Twelve sets means twenty-four live inputs on
  one screen. "What's left" is not scannable, because everything looks equally
  editable and equally unfinished.
- **The same set is editable in two places.** The console at the top edits
  whichever set is next; the ledger below edits any set including that one.
  They are two views of the same array with no stated relationship.

The ledger also carries real complexity that the redesign must not drop:
warm-up rows (displayed, never logged), technique rows (`set.label`, e.g. drop
sets), extra sets (`+1`, `+2`, added and removed by the athlete), AMRAP targets,
giant sets, the per-exercise swap affordance, coaching tips, the intensity
technique callout, and an EMOM rep counter.

---

## 2. The sheet

One table for the whole session. No cards, no per-exercise panels.

```
──────────────────────────────────────────────────────────
FLAT BARBELL BENCH PRESS              5 × 6 · 102.5 kg   ⇄
──────────────────────────────────────────────────────────
  1     102.5 kg × 6                                    ✓
  2     102.5 kg × 6                                    ✓
  3     102.5 kg × —                                    ○
  4     102.5 kg × —                                    ○
  5     102.5 kg × —                                    ○
──────────────────────────────────────────────────────────
CLOSE-GRIP BENCH PRESS                3 × 8 · 85 kg
──────────────────────────────────────────────────────────
  1      85 kg × —                                      ○
  …
```

- **Exercise rows** are section headers: name left, prescription right
  (`5 × 6 · 102.5 kg`), swap glyph at the end where the plan allows one. They
  are not collapsible — the whole session stays visible, which is the entire
  point of a protocol sheet. Tips and the technique callout sit directly under
  the header as quiet rows, not boxes.
- **Set rows** are `number / load × reps / state`. Tabular figures. Minimum
  height 48px, whole row is the tap target.
- **Rules** are the 1px hairline throughout. No fills except the two state
  treatments below.

## 3. Row states

| State | Reads as |
|---|---|
| Pending | Muted number, prescribed load shown at 60% ink, `—` for reps, hollow circle |
| Open (being edited) | Full-ink, 2px accent left edge, expanded to the edit surface |
| Done | Full-ink values, quiet accent fill at ~7%, `Check` glyph |
| AMRAP | 2px accent left tick plus the literal label `AMRAP` in the reps cell |
| Warm-up | Half-ink, `W1`/`W2` numbers, no state glyph, not tappable |
| Technique | Its label (`Drop`, `Rest-pause`) in place of the number |
| Extra | `+1`, `+2` in place of the number |

State is never carried by colour alone: done is fill **and** glyph, AMRAP is
tick **and** word.

## 4. The expanded row

Tapping a pending or done row expands **that row in place**. Everything above
and below stays where it is and stays legible — the sheet does not dim, scroll,
or navigate.

```
──────────────────────────────────────────────────────────
▌ 3    LOAD                REPS
       102.5               6
       ─────────           ─────────
       [ LOG SET ]                              Skip  ⇄
──────────────────────────────────────────────────────────
```

- Two underline inputs (your locked decision #10), each with a ≥44px tap zone
  and a 2px accent focus underline.
- The row's own **LOG SET** block: full width of the row, ≥56px.
- Secondary affordances at the end: skip this set, swap the movement.
- **One row open at a time.** Opening another commits the first (see §5).
- The expansion is a height/opacity transition at 200ms on the house easing,
  and is instant under `prefers-reduced-motion`.

## 5. Logging and advancing

1. Tap **LOG SET**. The row writes its values, collapses, and takes the done
   state.
2. The next pending row in the sheet opens automatically, scrolled just far
   enough to sit above the dock and the rest timer. Never a jump to the top.
3. If the exercise has no pending rows left, the next exercise's first row
   opens.
4. If the athlete opens a different row while one is open, the open row keeps
   whatever it holds — **it does not silently discard the edit** — but it is
   not marked done. Editing is not logging.
5. Logging out of order is fully supported and always was; the sheet never
   forces sequence.

## 6. What happens to the rest timer

The timer is a full-width bar above the dock (your locked decision #8). It does
not replace the sheet or the open row — the athlete can keep editing while it
runs. That is B6's build; this spec only fixes that the two do not fight for
the same space.

---

## 7. The question I need answered: does the console survive?

Once every row can be edited in place, the live-set console at the top of the
page is a second editor for the same data. Three ways to resolve it:

**(a) The sheet absorbs the console.** The page becomes one protocol sheet. The
open row *is* the console — same giant mono load figure, same telemetry, same
LOG SET block, just rendered inside the row rather than in a separate zone at
the top. One surface, one meaning, nothing duplicated.
*Cost:* the signature surface you just reviewed in B3 stops existing as its own
thing. The big figure only appears in the open row.

**(b) Console stays, sheet rows are read-only-plus-tap-to-open.** Tapping any
row makes it the console's active set and scrolls the console into view. The
console remains the only editor.
*Cost:* "expands in place into an edit surface" — your own wording — does not
happen. Rows become navigation, not editing.

**(c) Both edit, console is the fast path.** The console always holds the next
unresolved set for one-thumb logging; the sheet edits anything out of order.
*Cost:* two editors for one value. This is what exists today, and it is the
thing this phase was meant to resolve.

**My recommendation: (a).** It is what "the workout renders as one hairline
table" means, and it is the only one of the three where the athlete never has to
know which of two places to touch. The B3 work is not wasted — the console's
band structure, figure sizing and log block all move into the open row
essentially unchanged. B3 also stands on its own if you pick (b) or (c).

Two smaller ones while you're deciding:

- **Extra sets.** Today: two ghost buttons plus the copy "Not recommended —
  only if needed". Proposal: a single quiet `+ Add set` row at the end of each
  exercise's rows, with the caution as a one-line note under it rather than a
  warning label on a control. Remove is the row's own action once it exists.
- **Warm-ups.** They are shown but never logged. Proposal: keep them in the
  sheet at half ink and non-tappable, so the athlete sees the ramp without them
  competing with real sets. Alternative is hiding them behind the exercise
  header.

---

## 8. Accessibility and i18n

- Every row exposes its state as text to screen readers, not only as a glyph.
- The open row is a disclosure: `aria-expanded` on the row, focus moves to the
  load input on open, `Escape` collapses without logging.
- Arrow keys move between rows; `Enter` opens; `Enter` on the log block logs.
- Polish runs ~20% longer: `ZAPISZ SERIĘ` in a row-width block is fine, but the
  exercise header's prescription column needs to wrap rather than truncate.
- Every interactive element ≥44px, including the state glyph's hit zone.

## 9. How it will be verified

Same method as B2 and B3, since there is still no logged-in session available:
render the real markup against the compiled CSS and assert on the result — no
horizontal overflow, no sub-44px targets, no clipped or mid-word-broken text,
in both locales, at 320/390/768/1280, on a dark theme and on Peachy. Plus the
state matrix: pending, open, done, AMRAP, warm-up, technique, extra.
