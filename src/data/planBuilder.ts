/**
 * Declarative plan format.
 *
 * `definePlan()` turns a plain data description into a full `PlanConfig`, so a
 * new plan needs one literal rather than several hundred lines of hand-written
 * week/day/exercise trees plus bespoke hooks.
 *
 * Plans that need genuinely novel behaviour can still supply their own `hooks`;
 * this covers the shapes the Poliquin concept doc actually asks for:
 * wave loading, accumulation/intensification blocks, antagonist pairing,
 * tempo prescriptions, total-rep targets and weighted-bodyweight lifts.
 *
 * Exercises are referenced by library id, so `verify:library` catches a typo at
 * build time rather than the athlete finding an unresolvable exercise.
 */

import { EXERCISE_BY_ID } from './exercises/library';
import type { IntensityTechniqueSpec } from './exercises/types';
import { LIFT_SOURCES, percentageBaseFor, seedLoadFor } from '../features/onboarding/seedLoads';
import type {
    Exercise,
    LiftingStats,
    PlanConfig,
    Program,
    ProgramWeek,
    SetTarget,
    UserProfile,
    WorkoutDay,
} from '../types';

// ---------------------------------------------------------------------------
// Progression strategies
// ---------------------------------------------------------------------------

export type ProgressionContext = {
    week: number;
    /** 1-based index of the week within its phase. */
    weekInPhase: number;
    phase?: string;
    user: UserProfile;
};

export type Progression =
    /** Add load once every set hits the top of the rep range. */
    | { type: 'double'; increment: number }
    /** A percentage of a tracked 1RM. */
    | { type: 'percentage'; of: keyof LiftingStats; percent: number | ((ctx: ProgressionContext) => number) }
    /** Wave ladder, e.g. 5/4/3 repeated twice at rising loads. */
    | { type: 'wave'; ladder: number[]; waves: number; basePercent: number; step: number; of: keyof LiftingStats }
    /** Accumulate a fixed jump per week. */
    | { type: 'linear'; increment: number; of: keyof LiftingStats; startPercent: number }
    /** Hit a total rep count in as few sets as possible. */
    | { type: 'totalReps'; target: number; maxSets?: number }
    | { type: 'top-set-backoff'; topReps: [number, number]; backoffPercent?: number; backoffSets: number; backoffReps: [number, number]; incrementKg?: number };

// ---------------------------------------------------------------------------
// Plan description
// ---------------------------------------------------------------------------

export type SlotSpec = {
    /** Library exercise id. */
    ex: string;
    sets: number;
    /** '5', '8-12', 'AMRAP', 'Failure'. */
    reps: string;
    rpe?: number;
    restSeconds?: number;
    tempo?: string;
    technique?: IntensityTechniqueSpec;
    progression?: Progression;
    /** Antagonist / superset pairing label, e.g. 'A1'. Shares a letter with its partner. */
    pair?: string;
    notes?: string;
    optional?: boolean;
    primary?: boolean;
    systemicCompound?: boolean;
    unilateral?: boolean;
    block?: { kind: 'anchor' | 'burn' | 'finisher' | 'density'; id: string; durationSeconds?: number };
    /** Restrict this slot to specific weeks. */
    weeks?: number[];
    /** Legacy-style swap alternates (library display names), offered in the Swap sheet. */
    alternates?: string[];
};

export type DaySpec = {
    name: string;
    dayOfWeek: number;
    slots: SlotSpec[];
};

export type PhaseSpec = {
    name: string;
    weeks: number[];
    /** Applied to every slot in the phase — how accumulation/intensification differ. */
    transform?: (slot: SlotSpec, ctx: ProgressionContext) => SlotSpec;
};

export type PlanSpec = {
    id: string;
    name: string;
    weeks: number;
    days: DaySpec[];
    phases?: PhaseSpec[];
    /** Merged over the generated config; use for plan-specific behaviour. */
    hooks?: PlanConfig['hooks'];
    ui?: PlanConfig['ui'];
    session?: PlanConfig['session'];
    /** Applied to every slot without its own tempo, e.g. '20X0' on hypertrophy plans. */
    defaultTempo?: string;
    /**
     * Scheduling options shown at onboarding. Defaults: weekday selection with
     * suggested splits and 2-on/1-off and 3-on/1-off irregular templates.
     * Set `selectable: false` to keep the authored weekdays.
     */
    schedule?: PlanConfig['schedule'];
};

/** Sensible weekday combinations per sessions-per-week, 1 = Monday. */
const DEFAULT_SPLITS: Record<number, number[][]> = {
    2: [[1, 4], [2, 6], [1, 5]],
    3: [[1, 3, 5], [2, 4, 6], [1, 3, 6]],
    4: [[1, 2, 4, 5], [1, 3, 5, 6], [2, 4, 6, 7]],
    5: [[1, 2, 3, 5, 6], [1, 2, 4, 5, 6]],
    6: [[1, 2, 3, 4, 5, 6], [1, 2, 3, 5, 6, 7]],
};

const DEFAULT_IRREGULAR_TEMPLATES = [
    { id: '2on-1off', onDays: 2, offDays: 1 },
    { id: '3on-1off', onDays: 3, offDays: 1 },
    { id: 'every-other-day', onDays: 1, offDays: 1 },
];

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

const targetFor = (slot: SlotSpec): SetTarget => {
    const reps = slot.progression?.type === 'top-set-backoff'
        ? slot.progression.topReps.join('-')
        : slot.reps.trim();
    const type: SetTarget['type'] =
        /amrap/i.test(reps) ? 'amrap'
            : /fail/i.test(reps) ? 'failure'
                : reps.includes('-') ? 'range'
                    : 'straight';

    const target: SetTarget = { type, reps };
    if (slot.rpe !== undefined) target.rpe = slot.rpe;

    if (slot.progression?.type === 'percentage' && typeof slot.progression.percent === 'number') {
        target.percentage = slot.progression.percent;
        target.percentageRef = slot.progression.of;
    }
    return target;
};

export const techniqueLabel = (technique: IntensityTechniqueSpec): string => {
    switch (technique.kind) {
        case 'drop-set': return `Drop set: ${technique.drops} drops of ${technique.dropPercent}%`;
        case 'rest-pause': return `Rest-pause: ${technique.bursts} bursts, ${technique.restSeconds}s`;
        case 'myo-reps': return `Myo-reps: ${technique.miniSets}x${technique.miniReps}`;
        case 'cluster': return `Cluster: ${technique.clusters}x${technique.repsPerCluster}, ${technique.intraRestSeconds}s`;
        case 'partials': return `Partials: ${technique.extraReps} at ${technique.range}`;
        case 'one-and-half': return '1.5 reps';
        case 'tempo': return `Tempo ${technique.tempo}`;
        case 'total-reps': return `Total ${technique.targetReps} reps`;
        case 'back-off': return `Back-off ${technique.sets}x${technique.reps} @ ${technique.percent}%`;
        case 'wave': return `Waves: ${technique.waves}x ${technique.ladder.join('/')}`;
        case 'amrap-finisher': return 'AMRAP finisher';
        case 'last-set-failure': return 'Last set to failure';
        default: return '';
    }
};

/**
 * The stat keys a plan's progressions resolve against.
 *
 * Onboarding reads this to ask for exactly the maxes a plan uses — no more (a
 * hypertrophy plan should never be asked for a deadlift 1RM it ignores) and no
 * fewer (a percentage progression whose base was never collected silently falls
 * back to WorkoutView's generic estimate, so the authored percentages never
 * apply). Deriving it from the specs keeps new plans correct by default.
 *
 * Reads base slots only, matching `buildWeightCalculator` — neither applies
 * phase transforms. If a transform ever rewrites `progression`, both must change.
 */
export const requiredStatsFor = (spec: PlanSpec): (keyof LiftingStats)[] => {
    const keys = new Set<keyof LiftingStats>();
    for (const day of spec.days) {
        for (const slot of day.slots) {
            const progression = slot.progression;
            if (!progression) continue;
            if (progression.type === 'percentage' || progression.type === 'wave' || progression.type === 'linear') {
                keys.add(progression.of);
            }
        }
    }
    return [...keys];
};

/**
 * Which exercise establishes which max, keyed by display name.
 *
 * Mirrors `buildWeightCalculator`'s name lookup: the exercise whose progression
 * reads `stats.squat` is by definition the one that can calibrate it. Keyed by
 * display name because that is what the logged session carries.
 */
export const calibrationExercisesFor = (spec: PlanSpec): Record<string, keyof LiftingStats> => {
    const map: Record<string, keyof LiftingStats> = {};
    for (const day of spec.days) {
        for (const slot of day.slots) {
            const progression = slot.progression;
            if (!progression) continue;
            if (progression.type !== 'percentage' && progression.type !== 'wave' && progression.type !== 'linear') continue;
            const entry = EXERCISE_BY_ID[slot.ex];
            // First exercise wins, matching buildWeightCalculator's byName map,
            // so calibration and load resolution can never disagree.
            if (entry && !map[entry.name.en]) map[entry.name.en] = progression.of;
        }
    }
    return map;
};

const phaseFor = (spec: PlanSpec, week: number): PhaseSpec | undefined =>
    spec.phases?.find(p => p.weeks.includes(week));

export const definePlan = (spec: PlanSpec): PlanConfig => {
    // Fail loudly at module load rather than shipping an unresolvable exercise.
    for (const day of spec.days) {
        for (const slot of day.slots) {
            if (!EXERCISE_BY_ID[slot.ex]) {
                throw new Error(`definePlan(${spec.id}): unknown exercise id "${slot.ex}" on ${day.name}`);
            }
        }
    }

    const weeks: ProgramWeek[] = [];
    for (let week = 1; week <= spec.weeks; week++) {
        const phase = phaseFor(spec, week);
        const weekInPhase = phase ? phase.weeks.indexOf(week) + 1 : week;

        const days: WorkoutDay[] = spec.days.map(day => {
            const exercises: Exercise[] = day.slots
                .filter(slot => !slot.weeks || slot.weeks.includes(week))
                .map((rawSlot, index) => {
                    const ctx: ProgressionContext = {
                        week, weekInPhase, phase: phase?.name,
                        user: undefined as unknown as UserProfile,
                    };
                    const slot = phase?.transform ? phase.transform(rawSlot, ctx) : rawSlot;
                    const entry = EXERCISE_BY_ID[slot.ex];

                    return {
                        id: `${spec.id}-w${week}-d${day.dayOfWeek}-e${index + 1}`,
                        exerciseId: entry.id,
                        name: entry.name.en,
                        sets: slot.sets,
                        target: targetFor(slot),
                        notes: slot.notes,
                        alternates: slot.alternates,
                        optional: slot.optional,
                        rest: slot.restSeconds ? `${slot.restSeconds}s` : undefined,
                        // Structured, so the rest timer and prescription badges
                        // can read it. `notes` keeps only the author's prose —
                        // flattening tempo and rest into that string left both
                        // invisible to the runtime.
                        prescription: {
                            restSeconds: slot.restSeconds,
                            // An isometric hold has no eccentric or concentric to
                            // time. Unconditional, because a phase transform can
                            // stamp a tempo onto every slot it touches
                            // (Purgatorio's accumulation phase does exactly that)
                            // and a hold must not inherit it from there either.
                            tempo: entry.weightMode === 'timed' ? undefined : (slot.tempo ?? spec.defaultTempo),
                            technique: slot.technique,
                            pair: slot.pair,
                            ...(slot.progression?.type === 'top-set-backoff' && { topSetBackoff: {
                                backoffPercent: slot.progression.backoffPercent ?? 10,
                                backoffSets: slot.progression.backoffSets,
                                backoffReps: slot.progression.backoffReps.join('-'),
                                incrementKg: slot.progression.incrementKg ?? 2.5,
                            } }),
                            ...(slot.progression && { progression: {
                                kind: slot.progression.type,
                                ...('increment' in slot.progression && typeof slot.progression.increment === 'number'
                                    ? { increment: slot.progression.increment } : {}),
                                ...('incrementKg' in slot.progression && typeof slot.progression.incrementKg === 'number'
                                    ? { increment: slot.progression.incrementKg } : {}),
                                ...('of' in slot.progression ? { of: String(slot.progression.of) } : {}),
                                ...('percent' in slot.progression && typeof slot.progression.percent === 'number'
                                    ? { percent: slot.progression.percent } : {}),
                            } }),
                            ...(slot.block && { block: slot.block }),
                        },
                    };
                });

            return {
                id: `${spec.id}-w${week}-d${day.dayOfWeek}`,
                dayName: phase ? `${day.name} · ${phase.name}` : day.name,
                dayOfWeek: day.dayOfWeek,
                exercises,
            };
        });

        // Rest days keep the calendar honest for the day-remap in UserContext.
        const trained = new Set(days.map(d => d.dayOfWeek));
        for (let dow = 1; dow <= 7; dow++) {
            if (!trained.has(dow)) {
                days.push({ id: `${spec.id}-w${week}-d${dow}`, dayName: 'Rest', dayOfWeek: dow, exercises: [] });
            }
        }
        days.sort((a, b) => a.dayOfWeek - b.dayOfWeek);

        weeks.push({ weekNumber: week, days });
    }

    const program: Program = { id: spec.id, name: spec.name, weeks };

    return {
        id: spec.id,
        program,
        ui: spec.ui,
        session: spec.session,
        onboarding: { requiredStats: requiredStatsFor(spec) },
        calibration: { exerciseNameToStat: calibrationExercisesFor(spec) },
        schedule: spec.schedule ?? {
            selectable: true,
            suggestedSplits: DEFAULT_SPLITS[spec.days.length],
            irregularTemplates: DEFAULT_IRREGULAR_TEMPLATES,
        },
        hooks: {
            calculateWeight: buildWeightCalculator(spec),
            ...(spec.hooks ?? {}),
        },
    };
};

// ---------------------------------------------------------------------------
// Load calculation
// ---------------------------------------------------------------------------

const round2p5 = (n: number) => Math.round(n / 2.5) * 2.5;

/** Percent for one rung of a 5/4/3-style wave. Wave 2 starts one step above wave 1. */
export const wavePercentForSet = (
    progression: Extract<Progression, { type: 'wave' }>,
    weekInPhase: number,
    setIndex: number,
): number => {
    const rungs = Math.max(1, progression.ladder.length);
    const rung = setIndex % rungs;
    const waveIndex = Math.floor(setIndex / rungs);
    return progression.basePercent
        + progression.step * (weekInPhase - 1)
        + progression.step * waveIndex
        + progression.step * rung;
};

/**
 * Resolves percentage-of-max, wave and linear progressions into a working
 * weight. Anything else returns undefined so WorkoutView's own fallback runs.
 *
 * Slot percentage stamped on `target` wins over a name lookup — four Neural
 * 1-6 rows share a display name and must not all resolve to the first %.
 */
const buildWeightCalculator = (spec: PlanSpec): NonNullable<PlanConfig['hooks']>['calculateWeight'] => {
    const byName = new Map<string, SlotSpec>();
    for (const day of spec.days) {
        for (const slot of day.slots) {
            const entry = EXERCISE_BY_ID[slot.ex];
            if (entry && !byName.has(entry.name.en)) byName.set(entry.name.en, slot);
        }
    }

    return (target, user, exerciseName, context) => {
        const week = context?.week ?? 1;
        const phase = spec.phases?.find(p => p.weeks.includes(week));
        const weekInPhase = phase ? phase.weeks.indexOf(week) + 1 : week;
        const ctx: ProgressionContext = { week, weekInPhase, phase: phase?.name, user };

        let slot: SlotSpec | undefined;
        if (exerciseName && context?.day) {
            const daySpec = spec.days.find(d => d.dayOfWeek === context.day);
            const matches = daySpec?.slots.filter(s => EXERCISE_BY_ID[s.ex]?.name.en === exerciseName) ?? [];
            if (context.exerciseId) {
                const indexMatch = context.exerciseId.match(/-e(\d+)$/);
                const slotIndex = indexMatch ? parseInt(indexMatch[1], 10) - 1 : 0;
                slot = matches[slotIndex] ?? matches[0];
            } else {
                slot = matches[0];
            }
        }
        if (!slot && exerciseName) {
            for (const day of spec.days) {
                const s = day.slots.find(s => EXERCISE_BY_ID[s.ex]?.name.en === exerciseName && s.progression);
                if (s) { slot = s; break; }
            }
            if (!slot) slot = byName.get(exerciseName);
        }
        /**
         * The movement actually being performed, which is not always the slot's.
         *
         * King of the Squat lets the athlete swap the wide-grip bench for
         * dumbbell bench or heavy dips. Resolving against the slot would have
         * prescribed a dip at 85% of a wide-grip barbell max.
         */
        const performedId = (exerciseName
            ? Object.values(EXERCISE_BY_ID).find(e => e.name.en === exerciseName)?.id
            : undefined) ?? slot?.ex;

        const baseMaxFor = (of: keyof LiftingStats): number => {
            // A movement with no known relationship to the referenced max gets
            // no prescription at all: the double-progression path seeds it or
            // the athlete calibrates on the first set. A wrong number is worse
            // than an empty field.
            if (performedId && performedId !== slot?.ex && !LIFT_SOURCES[performedId]) return 0;
            return percentageBaseFor(user?.stats, performedId, of);
        };

        // Resolved percentages carried on the target take the same route, so a
        // built week and a live lookup can never disagree.
        if (typeof target?.percentage === 'number' && target.percentageRef && user?.stats) {
            const base = baseMaxFor(target.percentageRef);
            if (base) return round2p5(base * target.percentage).toString();
        }

        const progression = slot?.progression;
        if (!progression || !user) return undefined;

        switch (progression.type) {
            case 'percentage': {
                const base = baseMaxFor(progression.of);
                if (!base) return undefined;
                const percent = typeof progression.percent === 'function'
                    ? progression.percent(ctx)
                    : progression.percent;
                return round2p5(base * percent).toString();
            }
            case 'wave': {
                const base = baseMaxFor(progression.of);
                if (!base) return undefined;
                const percent = wavePercentForSet(progression, weekInPhase, context?.setIndex ?? 0);
                return round2p5(base * percent).toString();
            }
            case 'linear': {
                const base = baseMaxFor(progression.of);
                if (!base) return undefined;
                return round2p5(base * progression.startPercent + progression.increment * (week - 1)).toString();
            }
            case 'double':
            case 'top-set-backoff': {
                if (!slot) return undefined;
                const saved = user.workingLoads?.[spec.id]?.[slot.ex];
                if (saved) return String(saved);
                const seed = seedLoadFor(user.stats, slot.ex, slot.reps);
                return seed ? String(seed.kg) : undefined;
            }
            default:
                return undefined;
        }
    };
};
