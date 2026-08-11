# The Minimum

Ten weeks of two required full-body sessions a week, 14–16 sets each. Both
sessions train every major muscle, and no movement appears in both — the second
exposure is a variation rather than a repeat.

Volume never grows. Weeks 8–9 raise effort (RPE 9 on non-systemic work) instead
of adding sets, because adding sets would break the promise the plan is named
after.

Bonus sessions are optional, technically unlimited, and one a week is the
recommendation rather than a cap. Modules are approved templates only: single
station, low systemic cost, at most six sets, and no isolation the required
sessions already cover twice. The module offered is the one covering whichever
muscles saw least work recently.

Bonus work counts toward weekly volume, the performance profile and workout
history. It never drives plan progression, and it is never a precondition for
progressing the required sessions. When the last required session went
backwards, the next bonus is discouraged in copy — never blocked.

Bonus modules live in `src/features/theMinimum/bonus.ts` and are deliberately
outside the program tree, so they cannot become a third mandatory session.

Verification: `npm run verify:minimum`.
