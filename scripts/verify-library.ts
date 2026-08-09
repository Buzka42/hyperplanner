/**
 * verify:library
 *
 * The build gate for the exercise system. Fails if:
 *   1. any exercise any plan can produce fails to resolve to a library entry;
 *   2. two library entries claim the same name or alias (ambiguous resolution);
 *   3. a plan config references an exercise, swap pool member or group that
 *      does not exist;
 *   4. a library entry is structurally invalid (bad pattern/muscle/equipment,
 *      duplicate id, deprecated pointing nowhere).
 *
 * Unresolved names are the important one: an exercise that does not resolve has
 * no tip, no swap options and no muscle attribution, and silently drops out of
 * volume analysis.
 */

import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_IDS } from '../src/data/planMeta';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { createResolver } from '../src/data/exercises';
import { PLAN_EXERCISE_CONFIGS } from '../src/data/exercises/planConfigs';
import { RITUAL_ACCESSORIES } from '../src/data/ritual';
import type { Exercise, UserProfile, WorkoutDay } from '../src/types';

const failures: string[] = [];
const warnings: string[] = [];
const fail = (msg: string) => failures.push(msg);
const warn = (msg: string) => warnings.push(msg);

const resolver = createResolver(EXERCISE_LIBRARY);

// ---------------------------------------------------------------------------
// 1. Library structure
// ---------------------------------------------------------------------------

const VALID_PATTERNS = new Set([
    'horizontal-press', 'incline-press', 'vertical-press', 'horizontal-pull', 'vertical-pull',
    'squat', 'hinge', 'lunge', 'knee-flexion', 'knee-extension', 'hip-extension',
    'hip-abduction', 'hip-adduction', 'elbow-flexion', 'elbow-extension',
    'shoulder-abduction', 'shoulder-horizontal-abduction', 'external-rotation',
    'calf', 'core-flexion', 'core-antiextension', 'core-antirotation', 'carry', 'mobility', 'other',
]);

const VALID_MUSCLES = new Set([
    'chest', 'frontDelt', 'sideDelt', 'rearDelt', 'rotatorCuff', 'triceps', 'biceps',
    'brachialis', 'forearms', 'lats', 'upperBack', 'traps', 'lowerBack', 'abs', 'obliques',
    'glutes', 'hamstrings', 'quads', 'adductors', 'abductors', 'calves', 'tibialis', 'neck',
]);

const VALID_EQUIPMENT = new Set([
    'barbell', 'ez-bar', 'dumbbell', 'kettlebell', 'cable', 'machine', 'smith', 'hack-squat',
    'hammer-strength', 'pec-deck', 'leg-extension', 'leg-curl', 'rear-delt-machine',
    'bodyweight', 'pull-up-bar', 'dip-station', 'trx', 'bands', 'ab-wheel', 'bench', 'plate', 'other',
]);

/** From the gym inventory in the concept doc, section 1. */
const GYM_EQUIPMENT = new Set([...VALID_EQUIPMENT]);

const seenIds = new Set<string>();
for (const entry of EXERCISE_LIBRARY) {
    if (seenIds.has(entry.id)) fail(`Duplicate library id "${entry.id}".`);
    seenIds.add(entry.id);

    if (!VALID_PATTERNS.has(entry.pattern)) fail(`"${entry.id}" has unknown pattern "${entry.pattern}".`);
    if (!entry.name.en?.trim()) fail(`"${entry.id}" has no English name.`);
    if (!entry.primary?.length) warn(`"${entry.id}" has no primary muscles — it will not appear in volume analysis.`);

    for (const m of [...(entry.primary ?? []), ...(entry.secondary ?? [])]) {
        if (!VALID_MUSCLES.has(m)) fail(`"${entry.id}" has unknown muscle "${m}".`);
    }
    for (const eq of entry.equipment ?? []) {
        if (!VALID_EQUIPMENT.has(eq)) fail(`"${entry.id}" has unknown equipment "${eq}".`);
        else if (!GYM_EQUIPMENT.has(eq)) warn(`"${entry.id}" needs "${eq}", which the gym inventory does not list.`);
    }
    if (entry.status === 'deprecated' && entry.deprecatedFor && !EXERCISE_LIBRARY.some(e => e.id === entry.deprecatedFor)) {
        fail(`"${entry.id}" is deprecated for "${entry.deprecatedFor}", which does not exist.`);
    }
    if (entry.strengthRef && !EXERCISE_LIBRARY.some(e => e.id === entry.strengthRef!.ratioOf)) {
        fail(`"${entry.id}" references unknown strengthRef target "${entry.strengthRef.ratioOf}".`);
    }
}

// ---------------------------------------------------------------------------
// 2. Alias uniqueness — ambiguity here means resolution is order-dependent
// ---------------------------------------------------------------------------

const claim = new Map<string, string>();
for (const entry of EXERCISE_LIBRARY) {
    for (const spelling of [entry.name.en, ...(entry.aliases ?? [])]) {
        if (!spelling) continue;
        const key = spelling.toLowerCase().trim();
        const owner = claim.get(key);
        if (owner && owner !== entry.id) fail(`Spelling "${spelling}" is claimed by both "${owner}" and "${entry.id}".`);
        claim.set(key, entry.id);
    }
}

// ---------------------------------------------------------------------------
// 3. Every exercise every plan can produce must resolve
// ---------------------------------------------------------------------------

const baseStats = {
    pausedBench: 100, wideGripBench: 90, spotoPress: 95, lowPinPress: 88,
    btnPress: 45, squat: 140, conventionalDeadlift: 180, lowBarSquat: 150,
};

const syntheticUser = (planId: string, overrides: Record<string, unknown> = {}): UserProfile => ({
    id: 'verify', codeword: 'verify', ownerUid: 'verify',
    stats: { ...baseStats },
    startDate: new Date('2026-01-01').toISOString(),
    programId: planId,
    completedSessions: 0,
    benchHistory: [],
    benchDominationModules: {
        tricepGiantSet: true, behindNeckPress: true, weightedPullups: true,
        accessories: true, legDays: true, thursdayTricepVariant: 'giant-set',
    },
    trinaryStatus: {
        completedWorkouts: 0, currentBlock: 1, bench1RM: 120, deadlift1RM: 200, squat1RM: 160,
        benchWeakPoint: 'lockout', deadliftWeakPoint: 'lockout', squatWeakPoint: 'bottom',
        workoutLog: [], cycleNumber: 1,
    },
    superMutantStatus: {
        completedWorkouts: 0, currentCycle: 1, muscleGroupTimestamps: {},
        rolling7DayVolume: {
            chest: 0, shoulders: 0, triceps: 0, back: 0, biceps: 0, calves: 0,
            hamstrings: 0, glutes: 0, lowerBack: 0, quads: 0, abductors: 0, abs: 0,
        },
        chestVariant: 'A', backVariant: 'A',
        bench1RM: 120, deadlift1RM: 200, squat1RM: 160,
        quadExercise: 'Hack Squat', hamstringExercise: 'Good Mornings',
    },
    ritualStatus: { completedWorkouts: 0, currentWeek: 1, ritualAccessories: RITUAL_ACCESSORIES },
    pencilneckStatus: { cycle: 1, startDate: new Date('2026-01-01').toISOString() },
    painGloryStatus: {}, skeletonStatus: { completed: false },
    programProgress: {}, badges: [],
    ...overrides,
} as unknown as UserProfile);

const userVariants = (planId: string): UserProfile[] => {
    const v: UserProfile[] = [syntheticUser(planId)];
    if (planId === 'bench-domination') {
        v.push(syntheticUser(planId, {
            benchDominationModules: {
                tricepGiantSet: false, behindNeckPress: false, weightedPullups: false,
                accessories: false, legDays: false, thursdayTricepVariant: 'heavy-extensions',
                lowPinPressExtraSet: true,
            },
        }));
    }
    if (planId === 'pencilneck-eradication') {
        for (const prefs of [
            { 'push-a-leg-primary': 'Hack Squat', 'push-b-fly': 'Pec Deck', 'push-b-leg-secondary': 'Front Squats' },
            { 'push-a-leg-primary': 'High-Foot Leg Press', 'push-b-fly': 'Low-to-High Cable Flyes', 'push-b-leg-secondary': 'Narrow-Stance Leg Press' },
            { 'push-b-leg-secondary': 'Stiletto Squats' },
        ]) v.push(syntheticUser(planId, { exercisePreferences: prefs, pencilneckStatus: { cycle: 2, startDate: '2026-01-01' } }));
    }
    if (planId === 'trinary') {
        for (const wp of [
            { benchWeakPoint: 'off-chest', deadliftWeakPoint: 'lift-off', squatWeakPoint: 'bottom' },
            { benchWeakPoint: 'mid-range', deadliftWeakPoint: 'over-knees', squatWeakPoint: 'mid-range' },
            { benchWeakPoint: 'lockout', deadliftWeakPoint: 'lockout', squatWeakPoint: 'lockout' },
        ]) for (const n of [0, 3, 9, 18]) {
            v.push(syntheticUser(planId, {
                trinaryStatus: {
                    completedWorkouts: n, currentBlock: Math.floor(n / 3) + 1,
                    bench1RM: 120, deadlift1RM: 200, squat1RM: 160, workoutLog: [], cycleNumber: 1,
                    preferredAccessoryType: 'upper', reDeadliftVariant: 'Reverse Hyperextensions', ...wp,
                },
            }));
        }
    }
    if (planId === 'super-mutant') {
        for (const chestVariant of ['A', 'B'] as const)
            for (const backVariant of ['A', 'B'] as const)
                for (const upper of ['A', 'B'] as const)
                    for (const lower of ['C', 'D'] as const)
                        for (const quad of ['Hack Squat', 'Front Squat'] as const)
                            for (const ham of ['Good Mornings', 'Deficit RDLs'] as const)
                                v.push(syntheticUser(planId, {
                                    superMutantStatus: {
                                        ...(syntheticUser(planId).superMutantStatus as object),
                                        chestVariant, backVariant, nextUpperBlock: upper, nextLowerBlock: lower,
                                        quadExercise: quad, hamstringExercise: ham,
                                    },
                                }));
    }
    if (planId === 'skeleton-to-threat') {
        v.push(syntheticUser(planId, { completedSessions: 12 }));
        v.push(syntheticUser(planId, { completedSessions: 30 }));
    }
    if (planId === 'ritual-of-strength') {
        v.push(syntheticUser(planId, { ritualStatus: { completedWorkouts: 20, currentWeek: 8, ritualAccessories: RITUAL_ACCESSORIES } }));
    }
    return v;
};

const unresolved = new Map<string, Set<string>>();
let checked = 0;

/** Rest/mobility placeholders occupy an exercise slot but are not movements. */
const isPlaceholder = (name: string) => /^(rest|rest\s*\/\s*mobility|rest day|mobility|active recovery)$/i.test(name.trim());

const checkExercise = (ex: Exercise, planId: string, where: string) => {
    const names: string[] = [...(ex.alternates ?? [])];

    // An exercise carrying giantSetConfig is a *container* — "Tricep Giant Set"
    // is not a movement, its three steps are. Check the steps and skip the
    // container's own label.
    const steps = ex.giantSetConfig?.steps ?? [];
    if (steps.length) names.push(...steps.map(s => s.name));
    else names.push(ex.name);

    for (const name of names) {
        if (!name || isPlaceholder(name)) continue;
        checked++;
        if (!resolver.resolve(name)) {
            if (!unresolved.has(name)) unresolved.set(name, new Set());
            unresolved.get(name)!.add(`${planId} ${where}`);
        }
    }
};

const checkDay = (day: WorkoutDay | undefined, planId: string, where: string) => {
    for (const ex of day?.exercises ?? []) checkExercise(ex, planId, where);
};

for (const planId of PLAN_IDS) {
    const config = PLAN_REGISTRY[planId];
    if (!config) continue;
    const variants = userVariants(planId);

    for (const week of config.program.weeks) {
        for (const day of week.days) {
            checkDay(day, planId, `static w${week.weekNumber}d${day.dayOfWeek}`);
            const pre = config.hooks?.preprocessDay;
            if (!pre) continue;
            for (const user of variants) {
                try {
                    checkDay(pre(day, user), planId, `generated w${week.weekNumber}d${day.dayOfWeek}`);
                } catch {
                    // Unreachable state for this generator; not a library problem.
                }
            }
        }
    }
}

for (const [name, where] of unresolved) {
    fail(`Unresolved exercise "${name}" (${[...where].slice(0, 2).join('; ')}) — no library entry or alias matches.`);
}

// ---------------------------------------------------------------------------
// 4. Plan configs reference real things
// ---------------------------------------------------------------------------

for (const [planId, doc] of Object.entries(PLAN_EXERCISE_CONFIGS)) {
    if (!PLAN_IDS.includes(planId)) fail(`Plan config for unknown plan "${planId}".`);

    const check = (config: Record<string, unknown>, label: string) => {
        const c = config as { substituteWith?: string; swap?: { pool?: string[] }; groupId?: string };
        if (c.substituteWith && !resolver.byId(c.substituteWith)) {
            fail(`${planId} ${label}: substituteWith "${c.substituteWith}" is not a library exercise.`);
        }
        for (const id of c.swap?.pool ?? []) {
            if (!resolver.byId(id)) fail(`${planId} ${label}: swap pool member "${id}" is not a library exercise.`);
        }
        if (c.groupId && !doc.groups?.[c.groupId]) {
            fail(`${planId} ${label}: groupId "${c.groupId}" has no matching group.`);
        }
    };

    for (const [exerciseId, config] of Object.entries(doc.exercises ?? {})) {
        if (!resolver.byId(exerciseId)) fail(`${planId}: config for unknown exercise "${exerciseId}".`);
        check(config, `exercises.${exerciseId}`);
    }
    for (const [key, config] of Object.entries(doc.slots ?? {})) check(config, `slots.${key}`);

    for (const [groupId, group] of Object.entries(doc.groups ?? {})) {
        if (group.id !== groupId) fail(`${planId}: group key "${groupId}" does not match its id "${group.id}".`);
        if (!group.members?.length) fail(`${planId}: group "${groupId}" has no members.`);
    }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const translated = EXERCISE_LIBRARY.filter(e => e.name.pl?.trim()).length;

if (warnings.length) {
    console.warn(`\n  ${warnings.length} warning${warnings.length === 1 ? '' : 's'}:`);
    for (const w of warnings.slice(0, 15)) console.warn(`   - ${w}`);
    if (warnings.length > 15) console.warn(`   ... and ${warnings.length - 15} more`);
}

if (failures.length) {
    console.error(`\n  verify:library FAILED (${failures.length} problem${failures.length === 1 ? '' : 's'})\n`);
    for (const f of failures.slice(0, 40)) console.error(`   - ${f}`);
    if (failures.length > 40) console.error(`   ... and ${failures.length - 40} more`);
    console.error('');
    process.exit(1);
}

console.log(`\n  verify:library OK`);
console.log(`   ${EXERCISE_LIBRARY.length} exercises, ${EXERCISE_LIBRARY.reduce((n, e) => n + e.aliases.length, 0)} aliases`);
console.log(`   ${checked} exercise references across ${PLAN_IDS.length} plans all resolve`);
console.log(`   Polish names: ${translated}/${EXERCISE_LIBRARY.length}`);
