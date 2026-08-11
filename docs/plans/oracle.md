# Oracle

Ten weeks, four days, upper/lower — a plan built to find out whether the app can
predict a session before it happens.

Weeks 1–2 calibrate. They are the plan working, not the plan warming up: they
exist to produce comparable exposures, and no prediction is made during them.

From week 3 every slot arrives with a prediction and a stated confidence:

- **low** — offers a calibration set rather than pretending;
- **medium** — gives a range;
- **high** — gives one editable target.

High confidence requires at least three comparable exposures *including one
within four weeks*. Three sessions from last winter describe a different
athlete, so they cap at medium.

The prediction is always computable without a model. Transparent priors — a
recency-weighted estimate that treats reported RIR as evidence about the load —
produce the number. Sessions flagged for an external factor (illness, travel,
bad sleep) count at a third rather than being discarded.

When the owner has enabled AI, the model may refine that number **within ±7.5%**
and nothing more; a response outside the window is clamped. If the call fails,
the prior-based prediction stands and the session is unaffected. See
[AI integration](../architecture/ai.md).

Prediction error is scored on the whole prescription — load, reps and reported
RIR — not on e1RM, which hides exactly the errors this plan exists to find.

Accuracy is reported in honest bands (`sharp`, `usable`, `loose`,
`unreliable`) with the sample size attached, and no band at all below five
predictions. The trend needs eight before it will claim a direction, and it
reports getting worse as readily as getting better.

Verification: `npm run verify:oracle`.
