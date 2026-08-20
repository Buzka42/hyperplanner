/**
 * Weekly volume and frequency analysis.
 *
 * Encodes the programming rules from HYPERPLANNER_10_NEW_PLAN_CONCEPTS_POLIQUIN.md
 * section 1 so a plan can be checked before it ships:
 *
 *   - never train a major muscle group only once per week in a hypertrophy plan
 *   - general hypertrophy: at least 2 meaningful weekly exposures per group
 *   - specialisation: 3 weekly exposures for large groups (back, quads,
 *     hamstrings), 3-4 for smaller ones (delts, biceps, triceps)
 *   - powerlifting plans are exempt from the frequency minimum: the rule exists
 *     to stop a hypertrophy plan under-stimulating a group, and once-weekly
 *     supporting work for a non-priority group is a legitimate choice when the
 *     goal is a total. They can opt in by declaring `minWeeklyExposures`.
 *
 * "Exposure" means meaningful direct work, not incidental involvement, so
 * secondary muscles count toward volume at a reduced weight and do not by
 * themselves create an exposure.
 */

import type { ExerciseResolver } from '../data/exercises';
import { MUSCLE_AGGREGATES } from '../data/exercises/types';
import type { MajorMuscleGroup, MuscleGroup } from '../data/exercises/types';
import type { Exercise, WorkoutDay } from '../types';

/** A secondary muscle earns a third of a set — real work, but not an exposure. */
const SECONDARY_WEIGHT = 1 / 3;

export type PlanKind = 'hypertrophy' | 'powerlifting' | 'powerbuilding' | 'specialisation' | 'general';

export type VolumeRules = {
    kind: PlanKind;
    /** Groups this plan deliberately specialises in. */
    specialisation?: MajorMuscleGroup[];
    /** Groups exempt from the frequency floor (e.g. a plan that skips legs by design). */
    exempt?: MajorMuscleGroup[];
    minWeeklyExposures?: number;
    specialisationExposures?: number;
    /** Warn when a non-priority group exceeds this many direct sets. */
    maxDirectSets?: number;
    /** Specialised groups may sit higher than maxDirectSets. */
    maxSpecialisationSets?: number;
    /** Report front / side / rear delts separately. */
    splitDelts?: boolean;
};

export type MuscleVolume = {
    group: MajorMuscleGroup;
    /** Direct working sets per week, secondary involvement excluded. */
    directSets: number;
    /** Direct + weighted secondary. */
    totalSets: number;
    /** Distinct days carrying at least one direct set. */
    exposures: number;
    days: number[];
};

export type VolumeFinding = {
    severity: 'error' | 'warning';
    group: MajorMuscleGroup;
    message: string;
};

export type WeekAnalysis = {
    week: number;
    volumes: MuscleVolume[];
    findings: VolumeFinding[];
    totalSets: number;
    splitDelts?: { frontDelt: number; sideDelt: number; rearDelt: number };
};

const majorOf = (muscle: MuscleGroup): MajorMuscleGroup | undefined =>
    (Object.entries(MUSCLE_AGGREGATES) as [MajorMuscleGroup, MuscleGroup[]][])
        .find(([, muscles]) => muscles.includes(muscle))?.[0];

/**
 * Working sets only. An exercise with 0 sets is a disabled module, and
 * technique sub-sets are not part of the prescription.
 */
const workingSets = (exercise: Exercise): number => {
    if (exercise.prescription?.block?.kind === 'density') return 1;
    return Math.max(0, exercise.sets || 0);
};

/**
 * Count each major group ONCE per exercise.
 *
 * `back` aggregates lats + upperBack + traps + lowerBack, and a row lists
 * both `upperBack` and `lats` as primary — so iterating the primary list
 * naively credited a 3-set row with 6 sets of back.
 */
const credit = (
    entry: { primary?: MuscleGroup[]; secondary?: MuscleGroup[] },
    sets: number,
    dayOfWeek: number,
    direct: Map<MajorMuscleGroup, number>,
    secondary: Map<MajorMuscleGroup, number>,
    dayHits: Map<MajorMuscleGroup, Set<number>>,
) => {
    const hitDirect = new Set<MajorMuscleGroup>();
    for (const muscle of entry.primary ?? []) {
        const group = majorOf(muscle);
        if (group) hitDirect.add(group);
    }
    for (const group of hitDirect) {
        direct.set(group, (direct.get(group) ?? 0) + sets);
        if (!dayHits.has(group)) dayHits.set(group, new Set());
        dayHits.get(group)!.add(dayOfWeek);
    }
    const hitSecondary = new Set<MajorMuscleGroup>();
    for (const muscle of entry.secondary ?? []) {
        const group = majorOf(muscle);
        if (group && !hitDirect.has(group)) hitSecondary.add(group);
    }
    for (const group of hitSecondary) {
        secondary.set(group, (secondary.get(group) ?? 0) + sets * SECONDARY_WEIGHT);
    }
};

export const analyseWeek = (
    days: WorkoutDay[],
    week: number,
    resolver: ExerciseResolver,
    rules: VolumeRules
): WeekAnalysis => {
    const direct = new Map<MajorMuscleGroup, number>();
    const secondaryVol = new Map<MajorMuscleGroup, number>();
    const dayHits = new Map<MajorMuscleGroup, Set<number>>();

    for (const day of days) {
        for (const exercise of day.exercises ?? []) {
            const sets = workingSets(exercise);
            if (!sets) continue;

            const steps = exercise.giantSetConfig?.steps ?? [];
            if (steps.length) {
                for (const step of steps) {
                    const entry = resolver.resolve(step.name);
                    if (entry) credit(entry, sets, day.dayOfWeek, direct, secondaryVol, dayHits);
                }
                continue;
            }

            const entry = (exercise.exerciseId ? resolver.byId(exercise.exerciseId) : undefined)
                ?? resolver.resolve(exercise.name);
            if (!entry) continue;   // unmapped: verify:library is the gate for this
            credit(entry, sets, day.dayOfWeek, direct, secondaryVol, dayHits);
        }
    }

    const groups = Object.keys(MUSCLE_AGGREGATES) as MajorMuscleGroup[];
    const volumes: MuscleVolume[] = groups.map(group => ({
        group,
        directSets: Math.round((direct.get(group) ?? 0) * 10) / 10,
        totalSets: Math.round(((direct.get(group) ?? 0) + (secondaryVol.get(group) ?? 0)) * 10) / 10,
        exposures: dayHits.get(group)?.size ?? 0,
        days: [...(dayHits.get(group) ?? [])].sort((a, b) => a - b),
    }));

    const findings = evaluate(volumes, rules);

    if (rules.splitDelts) {
        const delt: Record<'frontDelt' | 'sideDelt' | 'rearDelt', number> = { frontDelt: 0, sideDelt: 0, rearDelt: 0 };
        for (const day of days) {
            for (const exercise of day.exercises ?? []) {
                const sets = workingSets(exercise);
                if (!sets) continue;
                const names = exercise.giantSetConfig?.steps?.length
                    ? exercise.giantSetConfig.steps.map(step => step.name)
                    : [exercise.name];
                for (const name of names) {
                    const entry = resolver.resolve(name);
                    for (const muscle of entry?.primary ?? []) {
                        if (muscle === 'frontDelt' || muscle === 'sideDelt' || muscle === 'rearDelt') {
                            delt[muscle] += sets;
                        }
                    }
                }
            }
        }
        if (delt.frontDelt > delt.sideDelt + 4) {
            findings.push({
                severity: 'warning',
                group: 'shoulders',
                message: `Front delts (${delt.frontDelt}) outrun side delts (${delt.sideDelt}) — cut pressing isolation, keep laterals.`,
            });
        }

        return {
            week,
            volumes,
            findings,
            totalSets: Math.round(volumes.reduce((n, v) => n + v.directSets, 0) * 10) / 10,
            splitDelts: delt,
        };
    }

    return {
        week,
        volumes,
        findings,
        totalSets: Math.round(volumes.reduce((n, v) => n + v.directSets, 0) * 10) / 10,
    };
};

/** Groups big enough that 3 weekly exposures is the specialisation target. */
const LARGE_GROUPS: MajorMuscleGroup[] = ['back', 'quads', 'hamstrings', 'glutes', 'chest'];

const evaluate = (volumes: MuscleVolume[], rules: VolumeRules): VolumeFinding[] => {
    const findings: VolumeFinding[] = [];
    const exempt = new Set(rules.exempt ?? []);
    const specialised = new Set(rules.specialisation ?? []);
    const floor = rules.minWeeklyExposures ?? 2;

    for (const volume of volumes) {
        if (exempt.has(volume.group)) continue;
        if (volume.group === 'core') continue;   // core is trained to taste

        // Nothing at all is a plan-design choice; one exposure is the rule breach
        // the concept doc is explicit about.
        if (volume.directSets === 0) continue;

        if (specialised.has(volume.group)) {
            // Same reasoning as the frequency floor below: a specialisation
            // *frequency* target is a hypertrophy construct. A powerlifting
            // plan that specialises the bench on two heavy exposures a week
            // plus accessories is standard practice, not an under-dose — Bench
            // Domination was being reported as breaching its own design. A
            // powerlifting plan that wants the check declares
            // `specialisationExposures` explicitly.
            if (rules.kind === 'powerlifting' && rules.specialisationExposures === undefined) continue;

            const target = rules.specialisationExposures
                ?? (LARGE_GROUPS.includes(volume.group) ? 3 : 3);
            if (volume.exposures < target) {
                findings.push({
                    severity: 'error',
                    group: volume.group,
                    message: `Specialisation target is ${target} weekly exposures; this week has ${volume.exposures}.`,
                });
            }
            const specCeiling = rules.maxSpecialisationSets ?? 40;
            if (volume.directSets > specCeiling) {
                findings.push({
                    severity: 'warning',
                    group: volume.group,
                    message: `${volume.directSets} direct sets exceeds the ${specCeiling}-set specialisation ceiling.`,
                });
            }
            continue;
        }

        // Powerlifting plans are exempt from the frequency minimum entirely.
        //
        // The rule exists to stop a *hypertrophy* plan under-stimulating a
        // group. A powerlifting plan's job is the total, and once-weekly
        // supporting work for a non-priority group is a legitimate programming
        // choice, not an oversight — Ritual's single weekly shoulder exposure
        // was being reported as a breach when it is the plan working as
        // designed. A plan that genuinely wants the check can still opt in by
        // declaring `minWeeklyExposures`.
        if (rules.kind === 'powerlifting' && rules.minWeeklyExposures === undefined) continue;

        if (volume.exposures < floor) {
            findings.push({
                severity: 'error',
                group: volume.group,
                message: `Trained on ${volume.exposures} day${volume.exposures === 1 ? '' : 's'} this week; ${floor} meaningful exposures is the minimum.`,
            });
        }

        const ceiling = specialised.has(volume.group)
            ? (rules.maxSpecialisationSets ?? 40)
            : rules.maxDirectSets;
        if (ceiling && volume.directSets > ceiling) {
            findings.push({
                severity: 'warning',
                group: volume.group,
                message: `${volume.directSets} direct sets exceeds the ${ceiling}-set ceiling for this role.`,
            });
        }
    }

    return findings;
};

/** Rolls per-week analyses into a plan-level summary. */
export const summarise = (weeks: WeekAnalysis[]) => {
    const errors = weeks.flatMap(w => w.findings.filter(f => f.severity === 'error').map(f => ({ week: w.week, ...f })));
    const warnings = weeks.flatMap(w => w.findings.filter(f => f.severity === 'warning').map(f => ({ week: w.week, ...f })));

    // The same breach repeated across 12 weeks is one problem, not twelve.
    const distinct = new Map<string, { group: MajorMuscleGroup; message: string; weeks: number[] }>();
    for (const e of errors) {
        const key = `${e.group}:${e.message}`;
        const existing = distinct.get(key) ?? { group: e.group, message: e.message, weeks: [] };
        existing.weeks.push(e.week);
        distinct.set(key, existing);
    }

    return {
        weeks,
        errors,
        warnings,
        distinctIssues: [...distinct.values()].sort((a, b) => b.weeks.length - a.weeks.length),
        clean: errors.length === 0,
    };
};

/** Declared intent per plan, so the right rules apply. */
export const PLAN_RULES: Record<string, VolumeRules> = {
    'bench-domination': { kind: 'powerlifting', specialisation: ['chest'] },
    'pencilneck-eradication': { kind: 'hypertrophy', exempt: ['hamstrings', 'glutes', 'calves'] },
    'skeleton-to-threat': { kind: 'general', minWeeklyExposures: 2 },
    'peachy-glute-plan': { kind: 'specialisation', specialisation: ['glutes'] },
    'pain-and-glory': { kind: 'powerlifting', specialisation: ['back', 'hamstrings', 'glutes'] },
    'trinary': { kind: 'powerlifting' },
    'ritual-of-strength': { kind: 'powerlifting' },
    'super-mutant': { kind: 'hypertrophy' },
    '30-minute-adventure': { kind: 'general', minWeeklyExposures: 1 },
    // New plans are held to the concept doc's rules under --strict.
    'king-of-the-squat': { kind: 'powerlifting', specialisation: ['quads'], specialisationExposures: 3 },
    'gravity-is-optional': { kind: 'hypertrophy', specialisation: ['back'], specialisationExposures: 3 },
    'purgatorio': { kind: 'hypertrophy', maxDirectSets: 25 },
    'immaculate-restructure': { kind: 'hypertrophy', maxDirectSets: 25 },
    'overhead-dominion': { kind: 'specialisation', specialisation: ['shoulders'], specialisationExposures: 4, splitDelts: true, maxSpecialisationSets: 40 },
    'hamstring-foundry': { kind: 'specialisation', specialisation: ['hamstrings'], specialisationExposures: 3, maxSpecialisationSets: 28 },
    'arms-race': { kind: 'specialisation', specialisation: ['biceps', 'triceps'], specialisationExposures: 4, maxSpecialisationSets: 40 },
    'workhorse': { kind: 'specialisation', specialisation: ['back'], specialisationExposures: 3 },
    'neural-overload': { kind: 'powerbuilding' },
    'tenfold': { kind: 'hypertrophy', maxDirectSets: 25 },
    // Free-order plan: two sessions are valid, so the four-card catalogue is
    // not a promise that every muscle receives two calendar exposures.
    'house-of-iron': { kind: 'general', minWeeklyExposures: 1 },
    'apex-predator': { kind: 'general', minWeeklyExposures: 2 },
    'venus-rising': { kind: 'hypertrophy', maxDirectSets: 25 },
    'athena': { kind: 'powerbuilding', maxDirectSets: 22 },
    'kali': { kind: 'general', minWeeklyExposures: 2 },
    'redline': { kind: 'general', minWeeklyExposures: 2 },
    'iron-clock': { kind: 'general', minWeeklyExposures: 2 },
    // Two mandatory sessions is the whole premise: every major muscle is hit in
    // both, so two exposures is the floor and the ceiling of what it promises.
    'the-minimum': { kind: 'general', minWeeklyExposures: 2 },
    // Deliberately submaximal on the way back in; weeks 1–2 are capped by design.
    'lazarus': { kind: 'general', minWeeklyExposures: 2 },
    // One work set per slot is the whole premise; the rule that matters here is
    // frequency, which the three full-body days satisfy.
    'blackout': { kind: 'general', minWeeklyExposures: 2 },
    'monolith': { kind: 'hypertrophy' },
    'atlas': { kind: 'general', minWeeklyExposures: 2 },
    'event-horizon': { kind: 'hypertrophy', maxDirectSets: 25 },
    'oracle': { kind: 'powerbuilding', minWeeklyExposures: 2, maxDirectSets: 22 },
    'project-chimera': { kind: 'powerbuilding', minWeeklyExposures: 2, maxDirectSets: 22 },
    'quadfather': { kind: 'specialisation', specialisation: ['quads'], specialisationExposures: 3 },
    // One lower-body day is the deliberate cost of training chest three times.
    // The legs are maintained, not developed, and the plan says so in its copy.
    'cathedral': { kind: 'specialisation', specialisation: ['chest'], specialisationExposures: 3, exempt: ['quads', 'hamstrings', 'glutes'] },
};
