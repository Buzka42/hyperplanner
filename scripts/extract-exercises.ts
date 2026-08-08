/**
 * extract-exercises
 *
 * Harvests every exercise name the app can produce, clusters near-duplicates,
 * and writes output/exercise-merge-report.md.
 *
 * This is an authoring aid, not a build gate — its output is reviewed by hand
 * before anything lands in src/data/exercises/library.ts. `verify:library` is
 * the gate.
 *
 * Three harvest passes, because no single one is complete:
 *   A. Source literals   — every `name: '...'` in src/data/*.ts. Catches names
 *                          on code paths that need user state to reach.
 *   B. Static walk       — every week x day in each PLAN_REGISTRY entry.
 *   C. preprocessDay     — sampled against synthetic users, since Super Mutant,
 *                          Trinary, Skeleton and Ritual synthesise their days
 *                          at runtime and their static weeks are stubs.
 *   D. Dictionaries      — the module-level pools (Trinary variations, Ritual
 *                          accessories, Super Mutant EXERCISES, Adventure).
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PLAN_REGISTRY } from '../src/data/plans';
import { BENCH_VARIATIONS, DEADLIFT_VARIATIONS, SQUAT_VARIATIONS } from '../src/data/trinary';
import { RITUAL_ACCESSORIES } from '../src/data/ritual';
import { ADVENTURE_EXERCISES } from '../src/data/adventure';
import type { Exercise, UserProfile, WorkoutDay } from '../src/types';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------------------
// Occurrence collection
// ---------------------------------------------------------------------------

type Occurrence = { plan: string; where: string; sets?: number; reps?: string };
const sightings = new Map<string, Occurrence[]>();

const record = (rawName: string, occ: Occurrence) => {
    const name = rawName.trim();
    if (!name) return;
    if (!sightings.has(name)) sightings.set(name, []);
    sightings.get(name)!.push(occ);
};

/**
 * Names that live in a `name:` field but aren't movements — day labels,
 * program names, Super Mutant's muscle-cluster labels, rest days.
 */
const NON_EXERCISE = /^(rest|rest \/ mobility|rest day|heavy strength|volume hypertrophy|power \/ speed|legs|upper|lower|amrap test|deload|bench domination|pencilneck eradication|pencilneck eradication protocol|from skeleton to threat|peachy|pain & glory|trinary|ritual of strength|super mutant|30 minute adventure|mobility)$/i;

/** Super Mutant labels its muscle clusters with a `name:` field too. */
const CLUSTER_LABEL = /^[a-z]+(\/[a-z]+)+$/i;

const isProbablyExercise = (name: string) => {
    if (!name || name.length < 3 || name.length > 80) return false;
    if (name.includes('${')) return false;       // unevaluated template literal
    if (NON_EXERCISE.test(name)) return false;
    if (CLUSTER_LABEL.test(name)) return false;  // "Hamstrings/Glutes/LowerBack"
    if (/^t:/.test(name)) return false;          // translation marker
    if (/^[a-z]+\.[a-z]/i.test(name)) return false; // dotted i18n key
    return true;
};

// ---------------------------------------------------------------------------
// Pass A — source literals
// ---------------------------------------------------------------------------

/** Source filename -> plan id, so a name found both ways reports one plan. */
const FILE_TO_PLAN: Record<string, string> = {
    program: 'bench-domination',
    pencilneck: 'pencilneck-eradication',
    skeleton: 'skeleton-to-threat',
    peachy: 'peachy-glute-plan',
    painglory: 'pain-and-glory',
    trinary: 'trinary',
    ritual: 'ritual-of-strength',
    supermutant: 'super-mutant',
    adventure: '30-minute-adventure'
};

const dataDir = join(root, 'src', 'data');
for (const file of readdirSync(dataDir).filter(f => f.endsWith('.ts'))) {
    const planId = FILE_TO_PLAN[file.replace('.ts', '')];
    if (!planId) continue; // plans.ts, planMeta.ts, accessControl.ts, badges.ts
    const src = readFileSync(join(dataDir, file), 'utf8');
    const lines = src.split('\n');
    lines.forEach((line, i) => {
        for (const m of line.matchAll(/\bname:\s*(['"`])([^'"`]+)\1/g)) {
            if (isProbablyExercise(m[2])) {
                record(m[2], { plan: planId, where: `source:${file}:${i + 1}` });
            }
        }
        // Adventure's exercise() helper: exercise('key', 'English', 'Polish', min, max)
        for (const m of line.matchAll(/\bexercise\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'/g)) {
            record(m[2], { plan: planId, where: `source:${file}:${i + 1} (key=${m[1]})` });
        }
    });
}

// ---------------------------------------------------------------------------
// Synthetic users — enough state for each plan's preprocessDay to run
// ---------------------------------------------------------------------------

const baseStats = {
    pausedBench: 100, wideGripBench: 90, spotoPress: 95, lowPinPress: 88,
    btnPress: 45, squat: 140, conventionalDeadlift: 180, lowBarSquat: 150
};

const syntheticUser = (planId: string, overrides: Record<string, unknown> = {}): UserProfile => ({
    id: 'extract', codeword: 'extract', ownerUid: 'extract',
    stats: { ...baseStats },
    startDate: new Date('2026-01-01').toISOString(),
    programId: planId,
    completedSessions: 0,
    benchHistory: [],
    benchDominationModules: {
        tricepGiantSet: true, behindNeckPress: true, weightedPullups: true,
        accessories: true, legDays: true, thursdayTricepVariant: 'giant-set'
    },
    trinaryStatus: {
        completedWorkouts: 0, currentBlock: 1, bench1RM: 120, deadlift1RM: 200, squat1RM: 160,
        benchWeakPoint: 'lockout', deadliftWeakPoint: 'lockout', squatWeakPoint: 'bottom',
        workoutLog: [], cycleNumber: 1
    },
    superMutantStatus: {
        completedWorkouts: 0, currentCycle: 1,
        muscleGroupTimestamps: {}, rolling7DayVolume: {
            chest: 0, shoulders: 0, triceps: 0, back: 0, biceps: 0, calves: 0,
            hamstrings: 0, glutes: 0, lowerBack: 0, quads: 0, abductors: 0, abs: 0
        },
        chestVariant: 'A', backVariant: 'A',
        bench1RM: 120, deadlift1RM: 200, squat1RM: 160,
        quadExercise: 'Hack Squat', hamstringExercise: 'Good Mornings'
    },
    ritualStatus: { completedWorkouts: 0, currentWeek: 1, ritualAccessories: RITUAL_ACCESSORIES },
    pencilneckStatus: { cycle: 1, startDate: new Date('2026-01-01').toISOString() },
    painGloryStatus: {},
    skeletonStatus: { completed: false },
    programProgress: {},
    badges: [],
    ...overrides
} as unknown as UserProfile);

/** Variant user states that unlock different branches of each generator. */
const userVariants = (planId: string): UserProfile[] => {
    const variants: UserProfile[] = [syntheticUser(planId)];

    if (planId === 'bench-domination') {
        variants.push(syntheticUser(planId, {
            benchDominationModules: {
                tricepGiantSet: false, behindNeckPress: false, weightedPullups: false,
                accessories: false, legDays: false, thursdayTricepVariant: 'heavy-extensions',
                lowPinPressExtraSet: true
            }
        }));
    }
    if (planId === 'pencilneck-eradication') {
        for (const prefs of [
            { 'push-a-leg-primary': 'Hack Squat', 'push-b-fly': 'Pec Deck', 'push-b-leg-secondary': 'Front Squats' },
            { 'push-a-leg-primary': 'High-Foot Leg Press', 'push-b-fly': 'Low-to-High Cable Flyes', 'push-b-leg-secondary': 'Narrow-Stance Leg Press' },
            { 'push-b-leg-secondary': 'Stiletto Squats' }
        ]) variants.push(syntheticUser(planId, { exercisePreferences: prefs, pencilneckStatus: { cycle: 2, startDate: '2026-01-01' } }));
    }
    if (planId === 'trinary') {
        for (const wp of [
            { benchWeakPoint: 'off-chest', deadliftWeakPoint: 'lift-off', squatWeakPoint: 'bottom' },
            { benchWeakPoint: 'mid-range', deadliftWeakPoint: 'over-knees', squatWeakPoint: 'mid-range' },
            { benchWeakPoint: 'lockout', deadliftWeakPoint: 'lockout', squatWeakPoint: 'lockout' }
        ]) {
            for (const n of [0, 3, 9, 18]) {
                variants.push(syntheticUser(planId, {
                    trinaryStatus: {
                        completedWorkouts: n, currentBlock: Math.floor(n / 3) + 1,
                        bench1RM: 120, deadlift1RM: 200, squat1RM: 160,
                        workoutLog: [], cycleNumber: 1, preferredAccessoryType: 'upper',
                        reDeadliftVariant: 'Reverse Hyperextensions', ...wp
                    }
                }));
            }
        }
    }
    if (planId === 'super-mutant') {
        // The queue rotates on block/variant state; sample every combination.
        for (const chestVariant of ['A', 'B'] as const)
            for (const backVariant of ['A', 'B'] as const)
                for (const upper of ['A', 'B'] as const)
                    for (const lower of ['C', 'D'] as const)
                        for (const quad of ['Hack Squat', 'Front Squat'] as const)
                            for (const ham of ['Good Mornings', 'Deficit RDLs'] as const)
                                variants.push(syntheticUser(planId, {
                                    superMutantStatus: {
                                        ...(syntheticUser(planId).superMutantStatus as object),
                                        chestVariant, backVariant,
                                        nextUpperBlock: upper, nextLowerBlock: lower,
                                        quadExercise: quad, hamstringExercise: ham
                                    }
                                }));
    }
    if (planId === 'skeleton-to-threat') {
        variants.push(syntheticUser(planId, { completedSessions: 12 }));
        variants.push(syntheticUser(planId, { completedSessions: 30 }));
    }
    if (planId === 'ritual-of-strength') {
        variants.push(syntheticUser(planId, { ritualStatus: { completedWorkouts: 20, currentWeek: 8, ritualAccessories: RITUAL_ACCESSORIES } }));
    }
    return variants;
};

// ---------------------------------------------------------------------------
// Passes B + C — static walk and preprocessDay sampling
// ---------------------------------------------------------------------------

const harvestExercise = (ex: Exercise, planId: string, where: string) => {
    if (isProbablyExercise(ex.name)) {
        record(ex.name, { plan: planId, where, sets: ex.sets, reps: ex.target?.reps });
    }
    for (const step of ex.giantSetConfig?.steps ?? []) {
        record(step.name, { plan: planId, where: `${where} (giant-set step)`, reps: step.targetReps });
    }
    for (const alt of ex.alternates ?? []) {
        record(alt, { plan: planId, where: `${where} (alternate)` });
    }
};

const harvestDay = (day: WorkoutDay | undefined, planId: string, where: string) => {
    for (const ex of day?.exercises ?? []) harvestExercise(ex, planId, where);
};

for (const [planId, config] of Object.entries(PLAN_REGISTRY)) {
    for (const week of config.program.weeks) {
        for (const day of week.days) {
            harvestDay(day, planId, `static w${week.weekNumber}d${day.dayOfWeek}`);

            const pre = config.hooks?.preprocessDay;
            if (!pre) continue;
            for (const [vi, user] of userVariants(planId).entries()) {
                try {
                    harvestDay(pre(day, user), planId, `preprocess w${week.weekNumber}d${day.dayOfWeek} v${vi}`);
                } catch {
                    // Some generators reject states they can't reach; that's fine here.
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Pass D — module-level dictionaries
// ---------------------------------------------------------------------------

for (const [group, names] of Object.entries({ ...BENCH_VARIATIONS, ...DEADLIFT_VARIATIONS, ...SQUAT_VARIATIONS })) {
    for (const name of names as string[]) record(name, { plan: 'trinary', where: `variation pool: ${group}` });
}
for (const [day, names] of Object.entries(RITUAL_ACCESSORIES)) {
    for (const name of names) record(name, { plan: 'ritual-of-strength', where: `accessory pool: ${day}` });
}
for (const ex of Object.values(ADVENTURE_EXERCISES)) {
    record(ex.name.en, { plan: '30-minute-adventure', where: `adventure key: ${ex.key}` });
}

// ---------------------------------------------------------------------------
// Normalisation + clustering
// ---------------------------------------------------------------------------

const ABBREV: [RegExp, string][] = [
    [/\bdb\b/g, 'dumbbell'], [/\bbb\b/g, 'barbell'], [/\bez\b/g, 'ezbar'],
    [/\bsl\b/g, 'single leg'], [/\brdls?\b/g, 'romanian deadlift'],
    [/\bghr\b/g, 'glute ham raise'], [/\bohp\b/g, 'overhead press'],
    [/\bbtn\b/g, 'behind the neck'], [/\btrx\b/g, 'trx'],
    [/\bsldl\b/g, 'stiff legged deadlift'], [/\bhs\b/g, 'hammer strength'],
    [/\bmachine\b/g, ''], [/\bcable\b/g, 'cable'],
];

const PLURALS: [RegExp, string][] = [
    [/\bflyes\b/g, 'fly'], [/\bflys\b/g, 'fly'], [/\bflies\b/g, 'fly'],
    [/\braises\b/g, 'raise'], [/\bcurls\b/g, 'curl'], [/\bextensions\b/g, 'extension'],
    [/\bsquats\b/g, 'squat'], [/\bpresses\b/g, 'press'], [/\brows\b/g, 'row'],
    [/\bpushups\b/g, 'push up'], [/\bpush ups\b/g, 'push up'], [/\bpullups\b/g, 'pull up'],
    [/\bpull ups\b/g, 'pull up'], [/\bchinups\b/g, 'chin up'], [/\bchin ups\b/g, 'chin up'],
    [/\bdips\b/g, 'dip'], [/\blunges\b/g, 'lunge'], [/\bholds\b/g, 'hold'],
    [/\bplanks\b/g, 'plank'], [/\bcalves\b/g, 'calf'], [/\bdeadlifts\b/g, 'deadlift'],
    [/\brollouts\b/g, 'rollout'], [/\bthrusts\b/g, 'thrust'], [/\bshrugs\b/g, 'shrug'],
];

/** Effort suffixes the plans append at runtime; they aren't different movements. */
const EFFORT_SUFFIX = /\s*\((me|de|re|amrap|back-?off|back-?down|e2mom|emom|cat|final exam|eccentric only|1cm above chest|4-8cm)\)\s*$/i;

const normalise = (raw: string) => {
    let s = raw.toLowerCase().trim();
    s = s.replace(EFFORT_SUFFIX, '');
    s = s.replace(/\([^)]*\)/g, ' ');       // drop remaining parentheticals
    s = s.replace(/[^a-z0-9\s]/g, ' ');     // punctuation -> space
    s = s.replace(/\s+/g, ' ').trim();
    for (const [re, to] of ABBREV) s = s.replace(re, to);
    for (const [re, to] of PLURALS) s = s.replace(re, to);
    return s.replace(/\s+/g, ' ').trim();
};

const tokens = (s: string) => new Set(normalise(s).split(' ').filter(Boolean));
const jaccard = (a: Set<string>, b: Set<string>) => {
    const inter = [...a].filter(t => b.has(t)).length;
    return inter / (a.size + b.size - inter);
};

const allNames = [...sightings.keys()].sort();

// Cluster by exact normalised form first, then merge clusters that are close.
const byNormal = new Map<string, string[]>();
for (const name of allNames) {
    const key = normalise(name);
    if (!byNormal.has(key)) byNormal.set(key, []);
    byNormal.get(key)!.push(name);
}

type Cluster = { key: string; names: string[] };
const clusters: Cluster[] = [...byNormal.entries()].map(([key, names]) => ({ key, names }));

const SIMILARITY = 0.72;
const merged: Cluster[] = [];
const consumed = new Set<number>();
for (let i = 0; i < clusters.length; i++) {
    if (consumed.has(i)) continue;
    const group = { ...clusters[i], names: [...clusters[i].names] };
    const ti = tokens(clusters[i].key);
    for (let j = i + 1; j < clusters.length; j++) {
        if (consumed.has(j)) continue;
        if (jaccard(ti, tokens(clusters[j].key)) >= SIMILARITY) {
            group.names.push(...clusters[j].names);
            consumed.add(j);
        }
    }
    merged.push(group);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const collisions = merged.filter(c => c.names.length > 1).sort((a, b) => b.names.length - a.names.length);
const singles = merged.filter(c => c.names.length === 1).sort((a, b) => a.key.localeCompare(b.key));

const plansOf = (name: string) => [...new Set(sightings.get(name)!.map(o => o.plan))].sort().join(', ');
const usageOf = (name: string) => {
    const occ = sightings.get(name)!;
    const prescriptions = [...new Set(occ.filter(o => o.sets).map(o => `${o.sets}x${o.reps}`))];
    return prescriptions.slice(0, 4).join(', ') || '—';
};

const out: string[] = [];
out.push('# Exercise merge report');
out.push('');
out.push('Generated by `npm run extract:exercises`. **Review by hand** — this is a');
out.push('suggestion list, not a decision. Each collision group below is a candidate');
out.push('for one library entry whose `aliases` absorb every other spelling.');
out.push('');
out.push(`- Distinct name strings found: **${allNames.length}**`);
out.push(`- Collision groups (2+ spellings): **${collisions.length}**`);
out.push(`- Names inside collision groups: **${collisions.reduce((n, c) => n + c.names.length, 0)}**`);
out.push(`- Unique singletons: **${singles.length}**`);
out.push(`- Estimated distinct movements: **${merged.length}**`);
out.push('');
out.push('---');
out.push('');
out.push('## Collision groups — merge candidates');
out.push('');
for (const c of collisions) {
    out.push(`### \`${c.key}\` — ${c.names.length} spellings`);
    out.push('');
    out.push('| Name as written | Plans | Prescriptions |');
    out.push('|---|---|---|');
    for (const n of c.names.sort()) out.push(`| \`${n}\` | ${plansOf(n)} | ${usageOf(n)} |`);
    out.push('');
}
out.push('---');
out.push('');
out.push('## Singletons');
out.push('');
out.push('| Name | Plans | Prescriptions |');
out.push('|---|---|---|');
for (const c of singles) {
    const n = c.names[0];
    out.push(`| \`${n}\` | ${plansOf(n)} | ${usageOf(n)} |`);
}
out.push('');

mkdirSync(join(root, 'output'), { recursive: true });
writeFileSync(join(root, 'output', 'exercise-merge-report.md'), out.join('\n'), 'utf8');

// Machine-readable companion for the tip merger and library seeding.
writeFileSync(
    join(root, 'output', 'exercise-inventory.json'),
    JSON.stringify(
        {
            generatedAt: new Date().toISOString(),
            clusters: merged.map(c => ({
                normalised: c.key,
                names: c.names.sort(),
                plans: [...new Set(c.names.flatMap(n => sightings.get(n)!.map(o => o.plan)))].sort()
            })),
            sightings: Object.fromEntries([...sightings].map(([n, o]) => [n, o]))
        },
        null,
        2
    ),
    'utf8'
);

console.log(`  extract:exercises`);
console.log(`   ${allNames.length} distinct name strings -> ${merged.length} estimated movements`);
console.log(`   ${collisions.length} collision groups covering ${collisions.reduce((n, c) => n + c.names.length, 0)} names`);
console.log(`   wrote output/exercise-merge-report.md and output/exercise-inventory.json`);
