# Kali

Eight weeks of four days — Earth, Hunt, Death, Rebirth — on a 20X0 tempo. Each
day opens with a systemic compound in the 3–6 rep range (hack squat, assisted
pull-up, Romanian deadlift, paused bench) on longer 150-second rests, then
moves through unilateral and machine work at 8–12 on 75-second rests. Volume
is modest by design: one to three sets per slot, with single-set finishers for
arms and calves. Everything progresses by double progression at 2.5 kg.

The first two phases are deliberately plain. Severance (weeks 1–2) and
Preservation (weeks 3–5) run the same prescriptions unchanged; the plan saves
its teeth for the end. Unleashed I (week 6) bolts a rest-pause onto the last
set of the single-leg hip thrust and hammer pulldown. Unleashed II (week 7)
swaps the intensifier to myo-reps on machine hip abduction and lat prayer.
Unleashed III (week 8) has no transform of its own — instead a runtime hook
lets the user re-apply either the rest-pause or the myo-reps target pair for
the final week.

Two things are resolved at runtime rather than in the spec. The day-2 pull
anchor defaults to assisted pull-up but can be swapped for another library
entry via plan preferences, and the week-8 intensifier choice is read from the
same preferences object in `preprocessDay`. Unilateral slots are flagged so
the session engine handles per-side logging.

Verification: `npm run verify:kali`.
