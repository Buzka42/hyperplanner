# Shared session and lifecycle engines

Reusable training decisions live outside individual plan handlers. The engines
are pure functions: plans provide prescriptions and logged outcomes, while the
caller owns persistence and UI confirmation.

Implemented foundations:

- double progression and clean top-set progression;
- editable derived back-off loads;
- total-system-weight calculation;
- fixed-load mastery ladder (`reps → ROM → pause → eccentric → variation`);
- conventional density and time × average-load metrics;
- hard set caps that preserve declared main-lift/minimum-set constraints;
- recovery recommendations that always require confirmation when reducing work;
- pain-stop outcome that recommends consultation and substitution without diagnosis;
- age, variation-distance, detraining and equipment-aware transfer confidence;
- role-preserving, metadata-cost-aware swap ranking;
- calendar-week schedule changes and reruns that preserve per-plan preferences.

Exercise variation is never changed silently. Swap ranking and the last stage of
the stall ladder produce recommendations that require athlete confirmation.
Quality-dependent behavior is intended only for plans whose specification opts
into quality capture; lower-level plans may omit RIR and quality entirely.

Executable contracts:

```text
npm run verify:session-engines
npm run verify:plan-lifecycle
```

UI integration remains plan-driven. An engine being available does not add a
recovery prompt, timer, quality field, or swap control to every existing plan.
