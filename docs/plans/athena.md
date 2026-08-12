# Athena

Twelve weeks of upper/lower barbell training, offered as four days (lower/upper
x2) or three full-body days. The four lifts that matter — squat, bench, RDL,
military press — are flagged `primary` and carry double progression at 2.5 kg;
assistance sits in the 6–12 range with 90-second rests. The two schedules are
compiled from the same slot builder and share one phase list.

The user can swap the four primary lifts for library alternatives, and a
preprocess hook rewrites the day's exercises from those saved choices at render
time. The same hook resolves which schedule to serve: a mid-plan switch between
3-day and 4-day is stored as a pending change and only takes effect once both
the calendar week and the completed-session count have passed the week it was
requested, so a week is never split between two schedules. Working weights come
from saved per-exercise loads in the user's Athena status before falling back
to the default calculation.

Phases only touch primary slots. Wisdom (weeks 1–4) is plain double
progression. Discipline (5–8) switches primaries to a top set of 4–6 with 10%
back-offs; Command (9–11) drops the top set to 3–5. Judgment (week 12) tapers:
primaries cap at three sets, everything else loses a set.

Verification: `npm run verify:athena`.
