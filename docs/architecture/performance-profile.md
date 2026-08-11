# PerformanceProfile

PerformanceProfile is the shared, plan-independent record of comparable
exercise performance. It is written by the central workout save path, so old
and new plans contribute without duplicating logic in plan handlers. The
[master expansion roadmap](../roadmap/master-expansion.md) is authoritative for
product decisions; this document describes the implemented foundation.

## Storage model

```text
users/{userId}/performanceProfile/{exerciseId}                 summary/cache
users/{userId}/performanceProfile/{exerciseId}/observations/* immutable sets
```

The subcollection avoids growing the user document or a single per-exercise
array without bound. The summary stores the latest observation, the best
eligible estimate, a ten-observation recent cache, and an observation count.
Immutable observation documents remain authoritative.

Workout creation and profile writes share one Firestore transaction. Existing
workout-log edits do not generate new observations. Test-account sessions are
saved but excluded from PerformanceProfile.

## Observation rules

- Canonical `exerciseId` is required; display names are never comparison keys.
- Every completed prescribed work set and user-added extra set is retained.
- Warmups, incomplete sets, and technique fragments (drop, myo, cluster, and
  rest-pause rows) remain in workout history but do not become observations.
- Invalid numeric inputs are ignored.
- Epley estimates use total system weight when supplied, otherwise external
  load. Assisted-machine external load may be negative.
- Estimates from 5–15 reps have `standard` confidence. Values outside that
  band are stored with `low` confidence and cannot establish the best estimate.
- Zero/negative comparison load and `borderline` or `invalid` quality cannot
  establish the best estimate.
- RIR, quality, completion reason, assistance category, exercise variant, and
  equipment identity are schema fields now, even though the current logger does
  not collect all of them yet.

The extractor and summary reducer are pure code in
`src/features/performanceProfile/`; run `npm run verify:performance-profile` for
the executable contract.

## Load transfer (next consumer phase)

Plans may later resolve a starting-load recommendation in this order:

1. exact canonical exercise;
2. explicitly approved close variation;
3. matching movement pattern;
4. overlapping primary muscle;
5. no suggestion and optional calibration.

Non-exact matches are recommendations, not silent truth. Optional onboarding
maxes remain valid; calibration is used when the athlete supplies no value.
Direct exact-history transfer between approved sister plans can be trusted when
their specifications explicitly allow it.

This foundation does not yet replace existing `LiftingStats`, change old-plan
progression, or add the starting-load UI. Those are consumers of the profile,
not prerequisites for collecting sound data.
