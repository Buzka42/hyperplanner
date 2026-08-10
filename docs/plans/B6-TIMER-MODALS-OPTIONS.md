# B6 — RestTimer + modals: design options

## 1. The rest timer's position

Locked by the owner (decision #8): **full-width bar above the dock**, overriding
the spec's own recommendation of a console-integrated strip.

Today it is a sticky strip at the top of the workout page — it scrolls with the
sheet and sits nowhere near the thumb.

- **(a) Fixed above the dock — chosen**, as decided. Above the dock on mobile,
  flush to the bottom on desktop where there is no dock. Countdown in the mono
  face at the size the console's telemetry uses, three ≥44px zones.
- (b) Sticky at the top, restyled. Keeps a position chosen for a layout that no
  longer exists.

## 2. Its controls

Today: pause/resume, restart, dismiss. The spec asks for "skip / add-30s zones".

- **(a) +30s, pause/resume, skip — chosen.** Extending is the thing an athlete
  actually reaches for mid-rest; restarting a rest period is not. Restart is
  dropped, and `+30s` covers the case it served.
- (b) Keep all four. A fourth target in a bottom bar makes each one narrower for
  a control nobody uses at a rack.

**This removes a behaviour** (restart). Cheap to put back if you disagree.

## 3. The modal family

`SwapSheet`, `WeakPointModal`, `VariationSwapModal`, `TrinaryRerunModal`,
`AccessoryChoiceModal`, plus `ui/dialog` and `ui/sheet`.

- **(a) Re-skin the two shared primitives — chosen.** Same lever as `Card` in
  B5: `dialog` and `sheet` are what all five are built from. 6px radius, the one
  permitted shadow (`0 16px 40px rgba(0,0,0,.45)`), hairline header and footer,
  and the uppercase transform off the title.
- (b) Restyle each modal. Re-forks what a shared component already unifies.

Bottom-sheet on mobile and centered dialog on desktop is already how `sheet` and
`dialog` divide, so no change is needed there.

## 4. Dead token

`font-family: var(--font-display)` appears in five rules. **`--font-display` was
never defined** — it is a token from a system that predates even the Pit-Wall
world, so those five rules have always silently resolved to whatever was
inherited. Replaced with the real stack.
