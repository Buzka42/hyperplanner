/**
 * verify:oracle
 *
 * Oracle's integrity rests on two properties: the prediction is always
 * computable without a model, and confidence is earned rather than claimed.
 * Both are asserted here, along with the bound that keeps model refinement from
 * ever being able to do damage.
 */

import assert from 'node:assert/strict';
import { ORACLE_CONFIG, ORACLE_DAYS, isCalibrationWeek } from '../src/data/plans/oracle';
import {
    accuracyBand, accuracyTrend, assessConfidence, predictFromPriors, predictionError, type Exposure,
} from '../src/features/oracle/prediction';
import type { UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };

ok(ORACLE_CONFIG.program.weeks.length === 10, 'Oracle runs ten weeks');
ok(ORACLE_DAYS.length === 4, 'Oracle is four-day upper/lower');
ok(isCalibrationWeek(1) && isCalibrationWeek(2) && !isCalibrationWeek(3), 'weeks 1–2 are the calibration weeks');

const now = Date.parse('2026-06-01T00:00:00.000Z');
const exposure = (over: Partial<Exposure> = {}): Exposure =>
    ({ date: '2026-05-25T00:00:00.000Z', loadKg: 100, reps: 8, rir: 2, comparable: true, ...over });

// --- confidence is earned -----------------------------------------------------
ok(assessConfidence([], now) === 'low', 'no history is low confidence');
ok(assessConfidence([exposure()], now) === 'medium', 'one comparable session is medium');
ok(assessConfidence([exposure(), exposure(), exposure()], now) === 'high', 'three recent comparable sessions are high');
// Three old sessions describe a different athlete.
ok(assessConfidence([1, 2, 3].map(() => exposure({ date: '2026-01-01T00:00:00.000Z' })), now) === 'medium',
    'stale evidence cannot reach high confidence');
ok(assessConfidence([exposure({ comparable: false }), exposure({ comparable: false })], now) === 'low',
    'incomparable work is not evidence');

// --- the prediction is always computable --------------------------------------
const request = { exerciseId: 'flat-barbell-bench-press', targetReps: [5, 8] as [number, number], sets: 4, now };

const blank = predictFromPriors({ ...request, exposures: [] });
ok(blank.offersCalibration && blank.confidence === 'low', 'no history offers calibration');
ok(blank.source === 'priors', 'the prediction never requires a model');

const medium = predictFromPriors({ ...request, exposures: [exposure()] });
ok(medium.confidence === 'medium' && !!medium.range, 'medium confidence gives a range');
ok(medium.range![0] < medium.loadKg && medium.range![1] > medium.loadKg, 'the range brackets the estimate');
ok(!medium.offersCalibration, 'medium confidence does not demand calibration');

const high = predictFromPriors({ ...request, exposures: [exposure(), exposure(), exposure()] });
ok(high.confidence === 'high' && !high.range, 'high confidence gives one editable target');
ok(high.loadKg > 0, 'a high-confidence prediction produces a load');
ok(high.rationale.includes('Edit'), 'the athlete is told the target is editable');

// RIR is used as evidence about the load, not ignored.
const fresh = predictFromPriors({ ...request, exposures: [1, 2, 3].map(() => exposure({ rir: 4 })) });
const grinding = predictFromPriors({ ...request, exposures: [1, 2, 3].map(() => exposure({ rir: 0 })) });
ok(fresh.loadKg > grinding.loadKg, 'reps left in reserve predict a heavier next session');

// Flagged sessions are damped rather than discarded.
const clean = predictFromPriors({ ...request, exposures: [exposure(), exposure(), exposure()] });
const flagged = predictFromPriors({ ...request, exposures: [exposure(), exposure(), exposure({ loadKg: 60, externalFactor: true })] });
const undamped = predictFromPriors({ ...request, exposures: [exposure(), exposure(), exposure({ loadKg: 60 })] });
ok(flagged.loadKg < clean.loadKg, 'a bad session still counts for something');
ok(flagged.loadKg > undamped.loadKg, 'a flagged session counts for less than an unflagged one');

// --- session sheets state confidence -----------------------------------------
const withHistory = { oracleStatus: { exposures: [1, 2, 3].map(() => ({
    exerciseId: 'flat-barbell-bench-press', date: new Date().toISOString(), loadKg: 100, reps: 8, rir: 2, comparable: true,
})) } } as unknown as UserProfile;

const calibration = ORACLE_CONFIG.hooks!.preprocessDay!(ORACLE_CONFIG.program.weeks[0].days.find(d => d.dayOfWeek === 1)!, withHistory);
ok(calibration.exercises[0].notes?.includes('Calibration week'), 'calibration weeks make no prediction');

const predicted = ORACLE_CONFIG.hooks!.preprocessDay!(ORACLE_CONFIG.program.weeks[5].days.find(d => d.dayOfWeek === 1)!, withHistory);
ok(predicted.exercises[0].notes?.includes('high confidence'), 'a predicted slot states its confidence');
const unknown = ORACLE_CONFIG.hooks!.preprocessDay!(ORACLE_CONFIG.program.weeks[5].days.find(d => d.dayOfWeek === 1)!, {} as UserProfile);
ok(unknown.exercises[0].notes?.includes('Low confidence'), 'an unknown movement says so rather than guessing');

// --- error is measured on the prescription ------------------------------------
const perfect = predictionError({ predictedLoadKg: 100, predictedReps: [5, 8], actualLoadKg: 100, actualReps: 6, actualRir: 2, confidence: 'high' });
ok(perfect === 0, 'a hit inside the rep range with the predicted load is zero error');

const loadMiss = predictionError({ predictedLoadKg: 100, predictedReps: [5, 8], actualLoadKg: 90, actualReps: 6, actualRir: 2, confidence: 'high' });
ok(loadMiss > 0, 'a load miss is an error');
const repMiss = predictionError({ predictedLoadKg: 100, predictedReps: [5, 8], actualLoadKg: 100, actualReps: 3, actualRir: 0, confidence: 'high' });
ok(repMiss > 0, 'a rep miss is an error even at the predicted load');
// e1RM alone would score this as nearly perfect; the whole point is that it is not.
ok(repMiss > 0.2, 'a large rep miss is scored as a large error');
const rirMiss = predictionError({ predictedLoadKg: 100, predictedReps: [5, 8], actualLoadKg: 100, actualReps: 6, actualRir: 6, confidence: 'high' });
ok(rirMiss > perfect, 'finishing far fresher than intended is an error');

// --- accuracy is reported honestly --------------------------------------------
ok(accuracyBand([0.02, 0.03]).band === 'unreliable', 'a tiny sample is not an accuracy claim');
ok(accuracyBand([0.02, 0.03]).note.includes('Too few'), 'and it says so');
ok(accuracyBand([0.02, 0.03, 0.04, 0.03, 0.02]).band === 'sharp', 'a good sample earns a good band');
ok(accuracyBand([0.3, 0.4, 0.35, 0.5, 0.45]).band === 'unreliable', 'bad predictions are reported as such');
ok(accuracyTrend([0.2, 0.2, 0.2]) === 'unknown', 'a trend needs a real sample');
ok(accuracyTrend([0.3, 0.3, 0.3, 0.3, 0.1, 0.1, 0.1, 0.1]) === 'improving', 'improvement is detected');
ok(accuracyTrend([0.1, 0.1, 0.1, 0.1, 0.3, 0.3, 0.3, 0.3]) === 'worsening', 'regression is reported, not hidden');

console.log(`Oracle verification passed: ${assertions} assertions.`);
