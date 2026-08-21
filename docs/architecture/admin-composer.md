# Admin composer

The owner's editing surface for a plan: what it contains, in what order, at what
prescription — and what each session costs to perform.

Plans generate their days in code and can never move to Firestore, so nothing
here replaces a generator. The composer runs the plan's own generator, then
shows and edits the layer that post-processes it (`resolveDay`). Editing what
the athlete actually receives, rather than the static literal, is what makes the
dynamic plans (Super Mutant, Trinary, Skeleton, Ritual) editable at all.

## Two scopes, and why both exist

- **Movement scope** (`exercises[exerciseId]`) — reaches the movement wherever
  the generator puts it. The only scope that works for plans with no fixed
  calendar.
- **Slot scope** (`slots['w{week}d{day}#{index}']`) — one position in one
  session. Wins over movement scope. For static plans where the same movement
  appears twice at different prescriptions.

The composer defaults every edit to movement scope and offers "this session
only" per row, because the narrower scope is the one that silently fails to
apply when a plan turns out to be dynamic.

`hasStableSlots()` decides which plans get the session view. A generator that
returns the identical session for every weekday is ignoring the calendar, so no
slot key names the same movement twice and the session view is withheld with an
explanation rather than shown and quietly wrong.

## Running order

`PlanExerciseConfig.order` is a sort key, applied in `resolveDay`.

The default key is the movement's **generated index**, so a day with no `order`
anywhere comes out exactly as the plan produced it, and setting `order` on one
movement moves that movement without disturbing the rest. Ties fall back to the
generated index, so equal keys never shuffle.

Order is stored per slot, never per movement: position is a property of a
session, and a movement-scoped order would drag every appearance of a movement
to the same position everywhere it occurs.

**The load-bearing invariant:** reordering must never renumber slots. A slot key
is also the address stamped onto the athlete's logged sets, so renumbering would
sever history from its movement and stall progressions with no visible error.
`resolveDay` therefore sorts *after* computing each entry's slot from its
generated index. `scripts/verify-composer.ts` pins this.

One deliberate consequence: the "first two movements are the main work"
heuristic (`isAccessorySlot`) reads the **displayed** position, so moving a
movement to the front of a session also makes it count as that session's main
work.

## Session statistics

`src/lib/sessionStats.ts`. Distinct from `volumeAnalysis`, which answers a
weekly, portfolio-level question ("is chest trained twice a week"). This answers
a per-session one: how long is it, how much work is in it, where does that work
land. Four balanced weeks can still contain one two-hour Wednesday.

Everything is derived from the prescription, never from logged history, so the
figures exist for a session nobody has performed — the only time they can still
change the programming.

The estimates are honest for comparing two sessions against each other, which is
what they are for. They are not a stopwatch. Specifically:

- Rep ranges collapse to their **midpoint**; `AMRAP`, `Failure` and `Max` count
  as ten; `8+` assumes a couple over. A figure that parses to nothing
  contributes nothing rather than defaulting to a number that would inflate the
  total.
- Duration assumes the athlete takes the prescribed rest, and prices a rep by
  the tempo string where one exists (`X` is explosive, not free) or three
  seconds where it does not.
- The rest **after the final set** belongs to the next movement and is not
  counted. Counting it made every session read several minutes long.
- Tonnage is reported only where the load is genuinely determinable — a
  percentage-of-a-lift slot or a fixed weight. A double-progression slot whose
  load lives in the athlete's history is reported as unknown, and the strip
  shows coverage (`tonnage (3/5)`) rather than a confident wrong number.
- A major muscle group is credited **once per movement** however many of its
  heads the library lists as primary, matching `volumeAnalysis`. A row lists
  both `lats` and `upperBack`; crediting each would double-count.
- A secondary muscle earns a third of a set, also matching `volumeAnalysis`.
- Giant-set containers are not movements: the work is in their steps, which is
  where it is credited.

## Changelog and revert

`planConfigs/{planId}/versions/{n}` is append-only — the security rules deny
update and delete outright.

A revert therefore does not rewind the version counter. It republishes the older
payload as a **new** version, which is why the changelog reverts on one click
with no confirmation dialog: nothing is deleted, the live document is still in
history, and the revert is itself revertible. The Undo offered afterwards is a
convenience on top of that guarantee, not the safety net.

The changelog reads across the whole portfolio, but only fetches plans listed in
`appConfig/libraryMeta.planConfigVersions` with a version above zero. Most of the
36 plans run entirely on their bundled definition, and fetching a history
subcollection for each would be wasted round trips.

`note` is a free-text reason attached to the published version. It is **omitted
entirely** when blank rather than written as an empty string, so publishing keeps
working against a deployment whose rules predate the field.

## Verification

- `npm run verify:composer` — ordering, slot stability, removal, rep parsing and
  the statistics maths, plus every plan materialising and every preview user
  surviving its generator. Runs in-process; touches no network.
- `npm run verify:plan-config-writes` — the publish sequence against the real
  `firestore.rules` on the emulator: snapshot, version bump, document write, the
  note constraints, append-only history, the revert round trip, and denial for
  athletes and anonymous sessions.

The two are complementary: the first cannot see the rules, and the second cannot
see the plans.
