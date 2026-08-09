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
 *   - powerlifting may practise a non-priority competition lift once weekly,
 *     but the musculature still needs additional work
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
};

const majorOf = (muscle: MuscleGroup): MajorMuscleGroup | undefined =>
    (Object.entries(MUSCLE_AGGREGATES) as [MajorMuscleGroup, MuscleGroup[]][])
        .find(([, muscles]) => muscles.includes(muscle))?.[0];

/**
 * Working sets only. An exercise with 0 sets is a disabled module, and
 * technique sub-sets are not part of the prescription.
 */
const workingSets = (exercise: Exercise): number => Math.max(0, exercise.sets || 0);

export const analyseWeek = (
    days: WorkoutDay[],
    week: number,
    resolver: ExerciseResolver,
    rules: VolumeRules
): WeekAnalysis => {
    const direct = new Map<MajorMuscleGroup, number>();
    const secondary = new Map<MajorMuscleGroup, number>();
    const dayHits = new Map<MajorMuscleGroup, Set<number>>();

    for (const day of days) {
        for (const exercise of day.exercises ?? []) {
            const sets = workingSets(exercise);
            if (!sets) continue;

            const entry = resolver.resolve(exercise.name);
            if (!entry) continue;   // unmapped: verify:library is the gate for this

            for (const muscle of entry.primary ?? []) {
                const group = majorOf(muscle);
                if (!group) continue;
                direct.set(group, (direct.get(group) ?? 0) + sets);
                if (!dayHits.has(group)) dayHits.set(group, new Set());
                dayHits.get(group)!.add(day.dayOfWeek);
            }
            for (const muscle of entry.secondary ?? []) {
                const group = majorOf(muscle);
                if (!group) continue;
                secondary.set(group, (secondary.get(group) ?? 0) + sets * SECONDARY_WEIGHT);
            }
        }
    }

    const groups = Object.keys(MUSCLE_AGGREGATES) as MajorMuscleGroup[];
    const volumes: MuscleVolume[] = groups.map(group => ({
        group,
        directSets: Math.round((direct.get(group) ?? 0) * 10) / 10,
        totalSets: Math.round(((direct.get(group) ?? 0) + (secondary.get(group) ?? 0)) * 10) / 10,
        exposures: dayHits.get(group)?.size ?? 0,
        days: [...(dayHits.get(group) ?? [])].sort((a, b) => a - b),
    }));

    return {
        week,
        volumes,
        findings: evaluate(volumes, rules),
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
            const target = rules.specialisationExposures
                ?? (LARGE_GROUPS.includes(volume.group) ? 3 : 3);
            if (volume.exposures < target) {
                findings.push({
                    severity: 'error',
                    group: volume.group,
                    message: `Specialisation target is ${target} weekly exposures; this week has ${volume.exposures}.`,
                });
            }
            continue;
        }

        if (rules.kind === 'powerlifting') {
            // A non-priority competition lift may be practised once weekly, but
            // the musculature still needs additional work.
            if (volume.exposures < floor && volume.directSets < 6) {
                findings.push({
                    severity: 'warning',
                    group: volume.group,
                    message: `Only ${volume.exposures} exposure and ${volume.directSets} direct sets. A once-weekly competition lift is allowed, but the musculature needs supporting work.`,
                });
            }
            continue;
        }

        if (volume.exposures < floor) {
            findings.push({
                severity: 'error',
                group: volume.group,
                message: `Trained on ${volume.exposures} day${volume.exposures === 1 ? '' : 's'} this week; ${floor} meaningful exposures is the minimum.`,
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
    'pain-and-glory': { kind: 'powerlifting' },
    'trinary': { kind: 'powerlifting' },
    'ritual-of-strength': { kind: 'powerlifting' },
    'super-mutant': { kind: 'hypertrophy' },
    '30-minute-adventure': { kind: 'general', minWeeklyExposures: 1 },
    // New plans are held to the concept doc's rules under --strict.
    'king-of-the-squat': { kind: 'powerlifting', specialisation: ['quads'], specialisationExposures: 3 },
    'gravity-is-optional': { kind: 'hypertrophy', specialisation: ['back'], specialisationExposures: 3 },
    'accumulate-intensify': { kind: 'hypertrophy' },
    'the-weakest-link': { kind: 'hypertrophy' },
    'overhead-dominion': { kind: 'specialisation', specialisation: ['shoulders'], specialisationExposures: 4 },
    'hamstring-foundry': { kind: 'specialisation', specialisation: ['hamstrings'], specialisationExposures: 3 },
};
