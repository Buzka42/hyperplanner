# Apex Predator

Twelve weeks of three full-body days a week built on standard hypertrophy work
(hack squat, dumbbell press, rows, RDL, curls and raises in the 6–20 rep ranges,
double progression with 2–2.5 kg jumps) plus a mechanism the fixed lifts are
scaffolding for: access slots.

Every day carries `apex-access-placeholder` slots that a preprocess hook fills
at render time from the user's mobility assessment. The hook reads the assessed
emphasis regions, picks access movements for them, and attaches a ROM cue
matched to the user's current level for that movement. Defaults when nothing is
assessed are ankle and thoracic rotation. Two sets each, never more, and the
slots are placeholders in the source precisely so the prescription stays
data-driven.

The phase structure is three three-week build blocks (Stalk, Adapt, Apex)
separated by Hunt weeks. Hunts are retests, not deloads: sets are capped at
two across the board, and the final Hunt caps anything at three sets or more —
plus lateral raises — at two and drops everything else to one. Volume is the
only lever the phases pull; exercise selection and progression never change.

Verification: `npm run verify:apex`.
