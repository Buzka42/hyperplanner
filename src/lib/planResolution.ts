/**
 * Plan resolution — the layer that turns a plan's generated day into what the
 * user actually sees.
 *
 * Runs AFTER `PlanConfig.hooks.preprocessDay`, never instead of it. Plan hooks
 * are functions and can never move to Firestore, so plans keep generating days
 * in code and this post-processes the result: library lookup, admin overrides,
 * user swaps and extra sets, finishing techniques, superset grouping and tips.
 *
 * Resolution order, most specific first:
 *   slot override -> movement override -> plan defaults -> global defaults
 */

import type { Exercise, SetTarget, UserProfile, WorkoutDay } from '../types';
import { GLOBAL_DEFAULTS } from '../data/exercises/planConfigs';
import { slotKey } from '../data/exercises/types';
import type {
    ExerciseGroup,
    IntensityTechniqueSpec,
    ExerciseId,
    Lang,
    LibraryExercise,
    PlanExerciseConfig,
    PlanExerciseDoc,
    ResolvedDay,
    ResolvedExercise,
    ResolvedSwap,
    SwapRule,
} from '../data/exercises/types';
import type { ExerciseResolver } from '../data/exercises';

export type ResolveContext = {
    planId: string;
    user?: UserProfile | null;
    resolver: ExerciseResolver;
    planConfig?: PlanExerciseDoc;
    lang: Lang;
    week: number;
    /**
     * Test accounts may swap to anything in the library, ignoring the plan's
     * swap policy. Everyone else is bounded by what the admin allowed.
     */
    testMode?: boolean;
};

// ---------------------------------------------------------------------------
// Override lookup
// ---------------------------------------------------------------------------

const inScope = (config: PlanExerciseConfig, week: number, dayOfWeek: number) => {
    const scope = config.scope;
    if (!scope) return true;
    if (scope.weeks?.length && !scope.weeks.includes(week)) return false;
    if (scope.days?.length && !scope.days.includes(dayOfWeek)) return false;
    return true;
};

/**
 * Merges the slot-scoped override over the movement-scoped one. Slot scope
 * exists for static plans where the same movement appears twice with different
 * prescriptions; movement scope is what dynamic plans (Super Mutant, Trinary)
 * can actually use, since they have no stable slot addresses.
 */
const overrideFor = (
    doc: PlanExerciseDoc | undefined,
    exerciseId: ExerciseId,
    week: number,
    dayOfWeek: number,
    index: number
): PlanExerciseConfig => {
    if (!doc) return {};
    const movement = doc.exercises?.[exerciseId];
    const slot = doc.slots?.[slotKey(week, dayOfWeek, index)];
    return {
        ...(movement && inScope(movement, week, dayOfWeek) ? movement : {}),
        ...(slot && inScope(slot, week, dayOfWeek) ? slot : {}),
    };
};

// ---------------------------------------------------------------------------
// Sets
// ---------------------------------------------------------------------------

const clampSets = (n: number) => Math.max(1, Math.min(30, Math.round(n)));

/** What the plan prescribes, after admin adjustment but before user extras. */
const resolveBaseSets = (exercise: Exercise, config: PlanExerciseConfig): number => {
    if (typeof config.setsOverride === 'number') return clampSets(config.setsOverride);
    if (typeof config.setsDelta === 'number') return clampSets(exercise.sets + config.setsDelta);
    return exercise.sets;
};

/**
 * How many sets the user has added on top.
 *
 * Only offered where the admin allowed it, and always capped. These are tagged
 * `kind: 'extra'` when logged so progression handlers can ignore them — a user
 * adding a junk set must never block a +2.5 kg progression.
 */
const resolveExtraSets = (
    user: UserProfile | null | undefined,
    config: PlanExerciseConfig,
    defaults: typeof GLOBAL_DEFAULTS,
    isAccessory: boolean
): number => {
    const rule = config.userExtraSets ?? defaults.userExtraSets;
    if (!rule?.allowed) return 0;

    const pref = user?.trainingPreferences?.extraSets;
    if (!pref || pref.mode === 'off') return 0;
    if (pref.mode === 'accessories' && !isAccessory) return 0;

    return Math.max(0, Math.min(rule.max ?? 0, pref.count ?? 0));
};

/** Heuristic: the first two movements of a day are its main work. */
const isAccessorySlot = (index: number) => index >= 2;

// ---------------------------------------------------------------------------
// Swaps
// ---------------------------------------------------------------------------

const swapOptionsFor = (
    rule: SwapRule,
    current: LibraryExercise | undefined,
    resolver: ExerciseResolver,
    legacyAlternates: string[] | undefined,
    testMode: boolean
): LibraryExercise[] => {
    // Lab Mode: anything in the library, so a test account can exercise any
    // combination without an admin first authorising it.
    if (testMode) {
        return resolver.all
            .filter(e => e.status === 'active' && e.id !== current?.id)
            .sort((a, b) => a.name.en.localeCompare(b.name.en));
    }

    if (current?.swapGroup === 'core-raise' || current?.id === 'hanging-leg-raise') {
        return resolver.all.filter(e => e.swapGroup === 'core-raise' && e.status === 'active' && e.id !== current.id);
    }

    const byIds = (ids: ExerciseId[]) =>
        ids.map(id => resolver.byId(id)).filter((e): e is LibraryExercise => Boolean(e) && e!.id !== current?.id);

    switch (rule.policy) {
        case 'locked':
            // Legacy `alternates` still work: before this layer existed they
            // rendered a Swap button that silently did nothing for all but six
            // hardcoded names. Honouring them here makes that button real.
            return legacyAlternates?.length
                ? legacyAlternates
                    .map(name => resolver.resolve(name))
                    .filter((e): e is LibraryExercise => Boolean(e) && e!.id !== current?.id)
                : [];
        case 'pool':
            return byIds(rule.pool ?? []);
        case 'group': {
            const group = rule.group ?? current?.swapGroup;
            if (!group) return [];
            return resolver.all.filter(e => e.swapGroup === group && e.status === 'active' && e.id !== current?.id);
        }
        case 'any':
            return resolver.all.filter(
                e => e.status === 'active' && e.pattern === current?.pattern && e.id !== current?.id
            );
        default:
            return [];
    }
};

// ---------------------------------------------------------------------------
// Legacy technique banners
// ---------------------------------------------------------------------------

/**
 * Some plans set `intensityTechnique` as free text inside their own
 * `preprocessDay`, under conditions this layer cannot see — Peachy applies its
 * drop set only from week 9, Pencilneck only to compounds in certain weeks.
 *
 * Rather than duplicating those conditions here, the banner itself is read: the
 * plan has already decided *whether* it applies, and this decides what it
 * means. That turns an instruction the athlete had nowhere to record into real
 * logged rows.
 *
 * Only unambiguous banners are converted. "Drop Set or Rest-Pause" offers the
 * athlete a choice, so it stays as text rather than having one picked for them.
 */
const techniqueFromBanner = (banner: string | undefined): IntensityTechniqueSpec | undefined => {
    if (!banner) return undefined;
    const text = banner.toLowerCase();

    if (text.includes('drop') && text.includes('bodyweight')) {
        // A single drop straight to bodyweight, i.e. all external load removed.
        return { kind: 'drop-set', drops: 1, dropPercent: 100, applyTo: 'last', toFailure: true };
    }
    return undefined;
};

// ---------------------------------------------------------------------------
// Target
// ---------------------------------------------------------------------------

const resolveTarget = (base: SetTarget, config: PlanExerciseConfig): SetTarget => {
    const target: SetTarget = { ...base, ...(config.target ?? {}) };

    // A rep range set in the admin panel wins over whatever the plan produced.
    if (typeof config.repsMin === 'number' || typeof config.repsMax === 'number') {
        const min = config.repsMin;
        const max = config.repsMax;
        if (typeof min === 'number' && typeof max === 'number') {
            target.reps = min === max ? String(min) : `${min}-${max}`;
            target.type = min === max ? 'straight' : 'range';
        } else if (typeof min === 'number') {
            target.reps = `${min}+`;
        }
    }
    return target;
};

// ---------------------------------------------------------------------------
// Tips
// ---------------------------------------------------------------------------

const pickText = (text: Record<Lang, string> | undefined, lang: Lang): string | undefined => {
    if (!text) return undefined;
    return text[lang]?.trim() || text.en?.trim() || undefined;
};

const resolveTips = (
    library: LibraryExercise | undefined,
    config: PlanExerciseConfig,
    lang: Lang,
    legacyNote: string | undefined,
    translate: (key: string) => string
): string[] => {
    const tips: string[] = [];

    // A plan-scoped tip replaces the library default outright; that is how the
    // handful of per-plan tip variants are expressed without duplicating a
    // whole exercise.
    const primary = pickText(config.tipOverride, lang) ?? pickText(library?.tip, lang);
    if (primary) tips.push(primary);

    const appended = pickText(config.tipAppend, lang);
    if (appended) tips.push(appended);

    // Legacy `notes` on the plan exercise, still the source for most tips until
    // the tip migration finishes. 't:' marks a translation key.
    if (legacyNote) {
        if (legacyNote.startsWith('t:')) {
            const key = legacyNote.slice(2);
            const translated = translate(key);
            if (translated && translated !== key && !tips.includes(translated)) tips.push(translated);
        } else if (!tips.includes(legacyNote)) {
            tips.push(legacyNote);
        }
    }

    return tips;
};

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

export const resolveDay = (
    day: WorkoutDay | undefined,
    ctx: ResolveContext,
    translate: (key: string) => string = k => k
): ResolvedDay | undefined => {
    if (!day) return undefined;

    const { planId, user, resolver, planConfig, lang, week, testMode = false } = ctx;
    const defaults = { ...GLOBAL_DEFAULTS, ...(planConfig?.defaults ?? {}) };
    const userSwaps = user?.exerciseSwaps?.[planId] ?? {};

    const exercises: ResolvedExercise[] = [];
    const usedGroups: Record<string, ExerciseGroup> = {};

    day.exercises.forEach((exercise, index) => {
        const originalId = resolver.resolveId(exercise.name);
        const config = overrideFor(planConfig, originalId, week, day.dayOfWeek, index);

        if (config.enabled === false) return;

        // Admin substitution first, then the user's own swap on top of it.
        const adminId = config.substituteWith ?? originalId;
        const userId = userSwaps[originalId]
            ?? (originalId === 'hanging-leg-raise' ? user?.trainingPreferences?.coreRaiseId : undefined);

        const swapRule = config.swap ?? defaults.swap ?? { policy: 'locked' as const };
        const adminEntry = resolver.byId(adminId) ?? resolver.resolve(exercise.name);
        const options = swapOptionsFor(swapRule, adminEntry, resolver, exercise.alternates, testMode);

        // A stored swap is only honoured if it is still permitted — an admin
        // narrowing a pool must retire choices made under the old one.
        const userEntry =
            userId && (testMode || options.some(o => o.id === userId)) ? resolver.byId(userId) : undefined;

        const effective = userEntry ?? adminEntry;
        const effectiveId = effective?.id ?? adminId;

        const baseSets = resolveBaseSets(exercise, config);
        const extraSets = resolveExtraSets(user, config, defaults, isAccessorySlot(index));

        const group = config.groupId ? planConfig?.groups?.[config.groupId] : undefined;
        if (group) usedGroups[group.id] = group;

        const displayName = resolver.displayName(effective, lang, exercise.name);

        const swap: ResolvedSwap | undefined = options.length
            ? {
                policy: testMode ? 'any' : swapRule.policy,
                options,
                current: userEntry?.id,
                original: originalId,
            }
            : undefined;

        exercises.push({
            ...exercise,
            // Keep the plan's own name as the logged identity so pre-migration
            // history keeps joining; displayName is what the UI renders.
            name: exercise.name,
            displayName,
            exerciseId: effectiveId,
            library: effective,
            sets: baseSets + extraSets,
            baseSets,
            extraSets,
            target: resolveTarget(exercise.target, config),
            tips: resolveTips(effective, config, lang, exercise.notes, translate),
            // Admin override, then the plan's own prescription, then the
            // library default. A plan that says "rest 210s" must reach the
            // athlete even when nobody has customised the exercise.
            technique: config.technique
                ?? exercise.prescription?.technique
                ?? techniqueFromBanner(exercise.intensityTechnique),
            tempo: config.tempo ?? exercise.prescription?.tempo,
            restSeconds:
                config.restSeconds
                ?? exercise.prescription?.restSeconds
                ?? effective?.defaultRestSeconds
                ?? defaults.restSeconds,
            group: group
                ? { id: group.id, role: config.groupRole ?? exercise.prescription?.pair ?? '', kind: group.kind }
                : exercise.prescription?.pair
                    ? { id: `pair-${exercise.prescription.pair[0]}`, role: exercise.prescription.pair, kind: 'superset' as const }
                    : undefined,
            swap,
            slot: slotKey(week, day.dayOfWeek, index),
        });
    });

    return {
        id: day.id,
        dayName: day.dayName,
        dayOfWeek: day.dayOfWeek,
        exercises,
        groups: usedGroups,
    };
};
