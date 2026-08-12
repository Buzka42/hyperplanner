# 30 Minute Adventure

A time-boxed circuit session, not a weekly programme: one ad-hoc workout of
five portals, each portal a superset pair performed for two rounds — A, B, A,
B — twenty logged sets in about thirty minutes. The portals partition the
body: chest/upper back, abs/glutes, calves/shoulders, quads/triceps, and
biceps/hamstrings/lower back.

At the select stage the user picks one pair per portal from 6-7 options each,
filtered live by an equipment toggle (bodyweight, dumbbells, barbell, cable,
machines). A dice button drafts a full route at random, and each portal can be
rerolled individually. Every pair carries a rest interval (60-90 s), a setup
cost (fast/moderate/slow) that maps to a 5/6/7-minute time estimate, and a
bilingual note; the route header shows the running total against the 30-minute
promise. Three pairs are marked hero picks — the heavy barbell routes.

During the session a global elapsed timer runs and a rest countdown appears
only between rounds. After round one of a pair, the app asks whether either
exercise felt easy; a challenged exercise (or one whose failure mode is
preprogrammed) has its round-two target rewritten from the rep range to
technical or muscular failure. Weights pre-fill from earlier in the session or
the user's last logged performance of that exercise, and hitting the top of
the range on both sets flags a weight increase next time. An unfinished draft
persists in local storage and resumes where it left off.

Verification: `npm run verify:adventure`.
