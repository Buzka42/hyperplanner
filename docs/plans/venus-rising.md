# Venus Rising

Twelve weeks in either a four-day (lower/upper, Mon/Tue/Thu/Fri) or three-day
(full-body, Mon/Wed/Fri) schedule; the user picks, and a pending schedule
change takes effect only once both the calendar week and the completed-session
count have moved past the week it was requested in. Both variants share one
phase structure and a default 20X0 tempo. Every slot runs double progression
with a 2.5 kg increment.

The phases escalate effort rather than volume. Foundation (weeks 1-4) is plain
work. Rising (5-8) pins every slot at RPE 8.5. Ascension (9-11) pushes lateral
raises, leg extensions and reverse pec-deck to RPE 9.5 while the rest stays at
8.5. Rebirth (week 12) is a taper: sets drop to 2 (or 1 below three) at RPE 8.

Two runtime behaviours sit outside the declarative spec. During weeks 5-8, up
to two user-designated priority exercises get a third set, capped at 16 total
sets per session. And when the three-day mode is active, each day's exercises
are swapped in from a parallel internal plan by week and day-of-week, so the
calendar of the four-day plan is preserved.

Verification: `npm run verify:venus`.
