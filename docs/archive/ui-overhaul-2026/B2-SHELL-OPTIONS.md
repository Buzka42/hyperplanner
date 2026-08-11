# B2 — Shell: design options

The option round the owner asked for before every UI phase. The `impeccable`
skill was not available in the session that wrote this, so the round is recorded
here rather than through `context.mjs` / the sketch roll. The direction is
brief-pinned anyway (`docs/protocol-sheet-redesign.md`), so the concept seed was
never in play — only these element treatments were.

Each pick below is **built**. Every one of them is a class-level change with no
logic behind it, so any of the alternates is a small revert.

---

## What was already locked, and is not re-opened here

| From | Decision |
|---|---|
| Q5 | Desktop keeps the **labelled sidebar**, re-skinned flat |
| Q5 | Mobile dock is **5 items, no drawer** |
| Q6 | Trophy case leaves the shell for a new **`/app/profile`** route |
| Q3 | Program artwork gets a **defined slot, grayscale-first, colour on active** |
| §7.2 | Brand lockup font swaps to **Hanken** |

The chosen sketch (`.impeccable/sketches/hypertraining-protocol.png`) is the
grammar reference for the lockup and the dock. Note that the sketch's own
`SYS / READY` and `01 / SESSION` lines are **not** built — the owner banned that
fluff after the sketch was drawn, and the ban outranks the picture.

---

## 1. The mobile top rail, now that the drawer is gone

The rail existed to hold a hamburger. Deleting the drawer removes its only job.

- **(a) Keep it as a sheet masthead — chosen.** Wordmark left, active plan name
  beneath it, one identity affordance right (→ `/app/profile`). It is the only
  place a mobile athlete can reach the profile route without spending a dock
  slot, and the plan name is real orientation, not chrome.
- (b) Delete it entirely; each page owns its header. Cheapest, most "nothing to
  remove" — but strands `/app/profile` with no mobile entry point.
- (c) Wordmark only. Saves 14px and loses the orientation.

## 2. How `/app/profile` is reached

- **(a) The identity row — chosen.** The sidebar footer's codeword block becomes
  the link on desktop; the top-rail identity mark is the same link on mobile.
  The thing you tap to see who you are is the thing that says who you are.
- (b) A sixth dock item. Breaks the locked five, and profile is not a
  mid-workout destination.
- (c) A link inside Settings. One tap deeper and semantically wrong — Settings
  is preferences, profile is identity and earned history.

## 3. Program artwork slot

- **(a) Sidebar plate, `grayscale(.8) contrast(1.05)`, full colour when its
  route is active or hovered — chosen.** The plate links to the dashboard, so
  "active" means a real navigation state rather than a decorative hover trick,
  and the rule is the same one the nav items obey.
- (b) Always full colour. Loudest, but the chassis is deliberately neutral and
  eight covers at full saturation is exactly the "flavor in the chrome" the
  brief bans.
- (c) No artwork in the shell at all. Cleanest; throws away the one place the
  eight skins are visible outside the accent.

## 4. Brand lockup

- **(a) Logo mark at 24px + `HYPERPLANNER` in tracked caps, one tone — chosen.**
  Takes the sketch's typographic treatment (single tone, `.18em` tracking, 600)
  while keeping the brand asset the product already owns.
- (b) Wordmark only, no mark — literally the sketch. Considered; dropping a
  brand asset felt like a call for the owner rather than a build decision, and
  it is a one-line revert if that is what you want.
- (c) Keep the two-tone `Hyper`/`Planner` split. It is decoration inside the
  brand, and two tones in a lockup fight the one-accent rule.

---

## Consequences worth knowing

- **The drawer held more than nav.** Logout and the language switcher were only
  reachable on mobile through it. Both moved to `/app/profile`, which is why
  that route is identity + trophies + language + logout rather than a badge
  grid on its own.
- **The dock was `grid-cols-4` with five items**, so Settings was rendering
  outside its grid. Fixed by the rebuild rather than separately.
- **Active state is a top hairline in the accent plus the accent label**, never
  a filled pill — pills are banned in primary workflow, and the dock is the most
  primary workflow there is.
- **The badge-unlock overlay** (confetti, gradient panel, `CLAIM GLORY`) still
  lives in `ProtectedLayout` and is untouched. It belongs to the modal family,
  which is B6.
