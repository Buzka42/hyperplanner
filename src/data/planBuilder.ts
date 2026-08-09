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
    | { type: 'totalReps'; target: number; maxSets?: number };

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
    /** Restrict this slot to specific weeks. */
    weeks?: number[];
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
};

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

const targetFor = (slot: SlotSpec): SetTarget => {
    const reps = slot.reps.trim();
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

/**
 * Slots carry structured tempo/technique/pairing, but `Exercise` only has a
 * free-text `notes` field until the runtime consumes the resolved shape. The
 * prescription is written there so nothing is invisible to the athlete in the
 * meantime.
 */
const describe = (slot: SlotSpec): string | undefined => {
    const parts: string[] = [];
    if (slot.pair) parts.push(slot.pair);
    if (slot.tempo) parts.push(`Tempo ${slot.tempo}`);
    if (slot.technique && slot.technique.kind !== 'none') parts.push(techniqueLabel(slot.technique));
    if (slot.restSeconds) parts.push(`Rest ${slot.restSeconds}s`);
    if (slot.notes) parts.push(slot.notes);
    return parts.length ? parts.join(' · ') : undefined;
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
        default: return '';
    }
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
                        name: entry.name.en,
                        sets: slot.sets,
                        target: targetFor(slot),
                        notes: describe(slot),
                        rest: slot.restSeconds ? `${slot.restSeconds}s` : undefined,
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

/**
 * Resolves percentage-of-max, wave and linear progressions into a working
 * weight. Anything else returns undefined so WorkoutView's own fallback runs.
 */
const buildWeightCalculator = (spec: PlanSpec): NonNullable<PlanConfig['hooks']>['calculateWeight'] => {
    const byName = new Map<string, SlotSpec>();
    for (const day of spec.days) {
        for (const slot of day.slots) {
            const entry = EXERCISE_BY_ID[slot.ex];
            if (entry && !byName.has(entry.name.en)) byName.set(entry.name.en, slot);
        }
    }

    return (_target, user, exerciseName, context) => {
        const slot = exerciseName ? byName.get(exerciseName) : undefined;
        const progression = slot?.progression;
        if (!progression || !user?.stats) return undefined;

        const week = context?.week ?? 1;
        const phase = spec.phases?.find(p => p.weeks.includes(week));
        const weekInPhase = phase ? phase.weeks.indexOf(week) + 1 : week;
        const ctx: ProgressionContext = { week, weekInPhase, phase: phase?.name, user };

        switch (progression.type) {
            case 'percentage': {
                const base = (user.stats[progression.of] as number) || 0;
                if (!base) return undefined;
                const percent = typeof progression.percent === 'function'
                    ? progression.percent(ctx)
                    : progression.percent;
                return round2p5(base * percent).toString();
            }
            case 'wave': {
                const base = (user.stats[progression.of] as number) || 0;
                if (!base) return undefined;
                // Each wave through the ladder is heavier than the last.
                const percent = progression.basePercent + progression.step * (weekInPhase - 1);
                return round2p5(base * percent).toString();
            }
            case 'linear': {
                const base = (user.stats[progression.of] as number) || 0;
                if (!base) return undefined;
                return round2p5(base * progression.startPercent + progression.increment * (week - 1)).toString();
            }
            default:
                return undefined;
        }
    };
};
