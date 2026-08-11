# AI integration

The app talks to Gemini through Cloud Functions. The key never reaches the
browser, and no AI feature is ever on the critical path of logging a set.

## Where the key lives

Secret Manager, read only by the callable functions. It is not in the client
bundle, not in Firestore, not in this repository, and not in any response body.

Set it once from your own machine:

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

Then deploy the functions:

```bash
firebase deploy --only functions
```

## Endpoints

Both are callable functions in `europe-central2`, defined in `functions/index.js`.

| Callable | Purpose |
|---|---|
| `aiComplete` | Text or JSON completion. Used by Oracle's optional refinement. |
| `aiAnalyzeLift` | Squat/bench/deadlift video analysis for Apex Predator. |

Both require an authenticated caller, both check the master switch and their own
feature switch, and both consume a per-athlete daily quota enforced server-side
in `aiUsage/{uid}` — a collection no client can read or write.

## Configuration

`appConfig/ai`, editable by an admin under the console's **AI** tab:

- `enabled` — the master switch; everything is off while this is false;
- `model` — the Gemini model id, e.g. `gemini-2.5-flash`;
- `features.oracle`, `features.videoAnalysis` — per-feature switches;
- `dailyRequestLimit` — requests per athlete per day.

The document deliberately has no key field, and the security rules reject one.

## What the model is allowed to do

- **Oracle** — the prediction is computed from transparent priors first. The
  model may only move that number within ±7.5%, and a response outside the
  window is clamped rather than trusted. If the call fails or the feature is
  off, the prior-based prediction stands unchanged.
- **Video analysis** — advice only. The response carries `advisoryOnly: true`,
  it is stored on the Apex assessment for the athlete to read, and nothing in
  the app changes a prescription because of it. Low confidence is preserved
  rather than smoothed over, and the system prompt forbids diagnosis.

## Privacy

Video clips are passed inline to the function, forwarded to the model, and
discarded when the request ends. They are not written to Storage or Firestore,
and the analysis response contains no copy of the clip.

Prompts carry training numbers — exercise, load, reps, RIR, dates. They do not
carry the athlete's codeword, email or any account identifier.
