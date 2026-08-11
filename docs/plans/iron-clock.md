# Iron Clock

Eight weeks in which density, not load, is the overload method. Four-day mode
is the default; a three-day full-body mode is selectable and takes effect only
after the current program week completes. In three-day mode the untrained
weekdays are genuine rest days — the plan never hands a three-day athlete a
fourth session.

Every session opens with one straight-set anchor at full rest. Everything after
it is timed blocks: curated pairs worked alternately inside one window, chosen
so both movements sit within reach of each other.

Base windows are 10, 8 and 6 minutes; the compression floor is two thirds of
base. The ladder in `src/features/ironClock/progression.ts` decides what counts
as better:

1. **reps** — add a round at the same load and window;
2. **time** — hold the work, compress the window by a minute;
3. **load** — at the floor with the window full, add load;
4. **reset** — the window and round target return at the new load.

A block only climbs on a valid completion: the target was met *and* the rounds
were confirmed clean. Borderline rounds count as completed but hold the
prescription; invalid rounds hold it and set no density best. Load increases
always require confirmation.

Rest is the athlete's to manage. Exceeding the rest guide produces a warning
and nothing more — the block still counts, and density shows the cost.

Changing an exercise, load or window does not discard history. Comparability
degrades instead: identical lineage, load and window compares `strict`; a
compressed window or a single substitution is `adapted`; a rebuilt block is
`incomparable`.

Weeks 3–5 add a round, weeks 6–7 add a round and compress the window, and week
8 returns to the opening windows so the final benchmark is comparable to week 1.

Verification: `npm run verify:iron-clock`.
