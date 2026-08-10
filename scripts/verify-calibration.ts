/**
 * verify:calibration
 *
 * Section C's first test: the benchmark → calibration → prescribed-load path,
 * end to end, for every declarative plan.
 *
 * `verify:onboarding` guards the *contract* — that every stat a progression
 * reads is collectable. This guards the *behaviour*: that an athlete who said
 * "I don't know my 1RM" gets a real prescribed load once they've logged the
 * calibration set, and never a silent 0 kg before they have.
 *
 * The bug class it exists to catch is the one Section A was written for. King of
 * the Squat and Neural Overload declare percentage progressions against maxes
 * nothing collected, so every load resolved from 0 and the plans prescribed an
 * empty bar. That failure was invisible: the app rendered, the workout looked
 * normal, and the numbers were wrong.
 *
 * Four properties, asserted per plan:
 *
 *   1. Before calibration, a load that depends on an uncollected max resolves to
 *      `undefined` — "not yet known", which the console renders as a suggested
 *      starting load. Never "0", which reads as a real prescription of nothing.
 *   2. Every stat a plan requires has an exercise that can establish it.
 *   3. Logging that exercise writes a plate-rounded 1RM and clears exactly the
 *      flags it established, leaving any others outstanding.
 *   4. After calibration every dependent load resolves to a plate-rounded number
 *      inside a sane fraction of the max.
 *
 * Plus: re-saving a completed session must not re-establish a max the athlete
 * has since trained past.
 */

import { PLAN_REGISTRY } from '../src/data/plans';
import type { LiftingStats, UserProfile } from '../src/types';
import type { LoggedSet, ProgressionContext } from '../src/features/workout/progression/types';
import { calibrationProgression } from '../src/features/workout/progression/calibration';

const failures: string[] = [];
let checksRun = 0;
const check = (ok: boolean, msg: string) => { checksRun++; if (!ok) failures.push(msg); };

/** Hand-written plans own their onboarding and carry no requiredStats. */
const isDeclarative = (plan: (typeof PLAN_REGISTRY)[string]) => Boolean(plan.onboarding?.requiredStats);

const makeUser = (planId: string, pending: (keyof LiftingStats)[], stats: Partial<LiftingStats> = {}): UserProfile =>
    ({
        codeword: 'verify-calibration',
        programId: planId,
        stats: stats as LiftingStats,
        pendingCalibration: pending,
    }) as unknown as UserProfile;

/** A hard set of 8 — what the calibration copy actually asks the athlete for. */
const CAL_SETS: LoggedSet[] = [
    { weight: '80', reps: '8', completed: true },
    { weight: '90', reps: '8', completed: true },
    { weight: '95', reps: '6', completed: true },
];
// Epley on the best set: 95 × 6 → 95 × (1 + 6/30) = 114 → 115 at 2.5kg rounding.
const EXPECTED_1RM = 115;

for (const [planId, plan] of Object.entries(PLAN_REGISTRY)) {
    if (!isDeclarative(plan)) continue;

    const required = plan.onboarding!.requiredStats!;
    const calMap = plan.calibration?.exerciseNameToStat ?? {};
    const calculate = plan.hooks?.calculateWeight;

    if (!required.length) {
        // A plan needing no maxes (Tenfold) must also declare no calibration
        // exercises, or the onboarding step would ask a question with no answer.
        check(
            Object.keys(calMap).length === 0,
            `${planId}: requires no stats but declares calibration exercises — one of the two is wrong.`,
        );
        continue;
    }

    check(Boolean(calculate), `${planId}: declarative plan with requiredStats but no calculateWeight hook.`);
    if (!calculate) continue;

    // --- 2. every required stat can be established ------------------------
    const establishable = new Set(Object.values(calMap));
    for (const stat of required) {
        check(
            establishable.has(stat),
            `${planId}: requires "${stat}" but no exercise in calibration.exerciseNameToStat establishes it — ` +
            `an athlete who skips that max can never resolve their loads.`,
        );
    }

    // --- 2b. the map must cover every lift whose load depends on a max ----
    //
    // `calibrationExercisesFor` and `buildWeightCalculator` read the same slots
    // and must agree about which lifts are base-dependent. If the map narrows —
    // dropping wave or linear progressions, say — an athlete's first exposure of
    // that lift silently stops being a calibration set, and the plan runs on a
    // max that is never established. Nothing else in the suite notices, because
    // the *stat* usually stays reachable through some other exercise.
    //
    // Probed through the public surface: give the calculator every max, and any
    // exercise it can now price is by definition base-dependent.
    const allMaxed = makeUser(
        planId,
        [],
        Object.fromEntries(required.map(stat => [stat, EXPECTED_1RM])) as Partial<LiftingStats>,
    );
    const seen = new Set<string>();
    for (const week of plan.program.weeks) {
        for (const day of week.days ?? []) {
            for (const exercise of day.exercises ?? []) {
                if (seen.has(exercise.name)) continue;
                seen.add(exercise.name);
                const priced = calculate({} as never, allMaxed, exercise.name, { week: week.weekNumber ?? 1, day: day.dayOfWeek });
                if (priced === undefined) continue;
                check(
                    exercise.name in calMap,
                    `${planId} / ${exercise.name}: its load is computed from a max, but it is missing from ` +
                    `calibration.exerciseNameToStat — its first exposure will not be treated as a calibration set.`,
                );
            }
        }
    }

    // Every slot whose loads depend on a required stat, by exercise name.
    const dependents = Object.entries(calMap).filter(([, stat]) => required.includes(stat));

    for (const [exerciseName, stat] of dependents) {
        // --- 1. uncalibrated resolves to "unknown", never to zero ---------
        const blank = makeUser(planId, [stat]);
        const before = calculate({} as never, blank, exerciseName, { week: 1, day: 1 });
        check(
            before === undefined,
            `${planId} / ${exerciseName}: with "${stat}" uncalibrated the load resolved to ${JSON.stringify(before)}, ` +
            `expected undefined. A "0" here is prescribed as an empty bar.`,
        );

        // --- 3. logging the calibration set establishes the max -----------
        const exerciseId = `${planId}-cal`;
        const ctx: ProgressionContext = {
            planId,
            week: 1,
            day: 1,
            isExistingLog: false,
            user: makeUser(planId, required),
            workout: { exercises: [{ id: exerciseId, name: exerciseName }] } as never,
            sets: { [exerciseId]: CAL_SETS },
        };

        const result = calibrationProgression(ctx, calMap);
        const written = result.updates[`stats.${stat}`];
        check(
            written === EXPECTED_1RM,
            `${planId} / ${exerciseName}: calibration wrote ${JSON.stringify(written)} for "${stat}", expected ${EXPECTED_1RM} ` +
            `(Epley on the best set, rounded to 2.5kg).`,
        );

        const stillPending = result.updates.pendingCalibration as (keyof LiftingStats)[] | undefined;
        check(
            Array.isArray(stillPending) && !stillPending.includes(stat),
            `${planId} / ${exerciseName}: "${stat}" is still pending after being calibrated.`,
        );
        // Other outstanding maxes must survive: one session establishes one lift.
        for (const other of required.filter(s => s !== stat && !dependentsShare(calMap, exerciseName, s))) {
            check(
                Array.isArray(stillPending) && stillPending.includes(other),
                `${planId} / ${exerciseName}: calibrating "${stat}" also cleared "${other}", which this session never trained.`,
            );
        }

        // --- 4. calibrated loads are real numbers -------------------------
        const calibrated = makeUser(planId, [], { [stat]: EXPECTED_1RM } as Partial<LiftingStats>);
        for (const week of [1, 4, 8, 12]) {
            const after = calculate({} as never, calibrated, exerciseName, { week, day: 1 });
            if (after === undefined) continue;   // slot not prescribed that week

            const value = Number(after);
            check(
                Number.isFinite(value) && value > 0,
                `${planId} / ${exerciseName} wk${week}: resolved to ${JSON.stringify(after)} after calibration.`,
            );
            check(
                Math.abs(value / 2.5 - Math.round(value / 2.5)) < 1e-9,
                `${planId} / ${exerciseName} wk${week}: ${value}kg is not a 2.5kg multiple — not loadable with real plates.`,
            );
            const fraction = value / EXPECTED_1RM;
            check(
                fraction >= 0.3 && fraction <= 1.15,
                `${planId} / ${exerciseName} wk${week}: ${value}kg is ${(fraction * 100).toFixed(0)}% of a ${EXPECTED_1RM}kg max — ` +
                `outside the 30-115% band, so the percentage is probably wrong.`,
            );
        }

        // --- re-saving must not re-establish -------------------------------
        const resave = calibrationProgression({ ...ctx, isExistingLog: true }, calMap);
        check(
            Object.keys(resave.updates).length === 0,
            `${planId} / ${exerciseName}: re-saving a completed session rewrote stats — an athlete editing an old ` +
            `log would have their current max replaced by an old one.`,
        );
    }
}

/** True when `exerciseName` also establishes `stat` (a lift can back two maxes). */
function dependentsShare(
    map: Record<string, keyof LiftingStats>,
    exerciseName: string,
    stat: keyof LiftingStats,
): boolean {
    return map[exerciseName] === stat;
}

if (failures.length) {
    console.error(`\n  verify:calibration — ${failures.length} of ${checksRun} checks failed\n`);
    for (const f of failures) console.error(`   ${f}`);
    console.error('');
    process.exit(1);
}

console.log(`\n  verify:calibration — ${checksRun} checks passed across every declarative plan.\n`);
