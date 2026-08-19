/**
 * portfolio-metrics — shared measurement core for portfolio reviews.
 *
 * Expands every plan's representative training week into a flat exercise list,
 * then scores it on the axes the v2 audit used: exercise variety, set volume,
 * sets/session, systemic and axial load, and muscle coverage.
 *
 * Nothing here mutates the shipped plans. `sim-v2-portfolio.ts` layers the
 * post-audit vote map on top of the same expansion so before/after is measured
 * with one ruler.
 */

import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_IDS } from '../src/data/planMeta';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { createResolver } from '../src/data/exercises';
import { buildExerciseIntelligence } from '../src/data/exercises/exerciseIntelligence';
import { MUSCLE_AGGREGATES } from '../src/data/exercises/types';
import type { MajorMuscleGroup, MuscleGroup, LibraryExercise } from '../src/data/exercises/types';
import { buildPreviewUser } from '../src/pages/admin/previewUser';
import {
    ADVENTURE_PAIRS, ADVENTURE_PORTALS, ADVENTURE_PLAN_ID,
    getAdventurePair, getAdventureExercise,
} from '../src/data/adventure';
import type { WorkoutDay } from '../src/types';

/**
 * The resolver the whole analysis runs through.
 *
 * Mutable so a simulation can add movements the library does not ship yet —
 * proposing a Seated Hammer Shoulder Press is only meaningful if it can be
 * scored on the same basis as everything else. Shipped data is never touched;
 * `extendLibrary` affects this process only.
 */
let library: LibraryExercise[] = EXERCISE_LIBRARY;
export let RESOLVER = createResolver(library);

export const extendLibrary = (proposed: LibraryExercise[]) => {
    const known = new Set(library.map(e => e.id));
    library = [...library, ...proposed.filter(e => !known.has(e.id))];
    RESOLVER = createResolver(library);
    INTEL.clear();
};

const INTEL = new Map<string, ReturnType<typeof buildExerciseIntelligence>>();
export const intelOf = (entry: LibraryExercise) => {
    let hit = INTEL.get(entry.id);
    if (!hit) { hit = buildExerciseIntelligence(entry); INTEL.set(entry.id, hit); }
    return hit;
};

export const majorOf = (muscle: MuscleGroup): MajorMuscleGroup | undefined =>
    (Object.entries(MUSCLE_AGGREGATES) as [MajorMuscleGroup, MuscleGroup[]][])
        .find(([, muscles]) => muscles.includes(muscle))?.[0];

/** One prescribed slot in a materialised week. */
export type Slot = {
    day: number;          // index into the week's training days
    dayName: string;
    name: string;         // as written by the plan
    id: string;           // resolved library id, or `unmapped:*`
    sets: number;
    /**
     * Prescribed as a timed/density block rather than straight sets — REDLINE's
     * finishers, Iron Clock's rounds. Counted as one set for volume, but not a
     * "1-set slot" in the set-shape sense: there is no second set to add.
     */
    block?: boolean;
};

export type PlanWeek = {
    planId: string;
    name: string;
    /** Which week number the sample came from. */
    week: number;
    /** Days that carry at least one working set. */
    trainingDays: number;
    slots: Slot[];
    /** Plans whose generator ignores the calendar — weekly figures are estimates. */
    perVisitGenerator: boolean;
    notes: string[];
};

/** Sessions per week for plans with no fixed calendar, from each plan's own card. */
const PER_VISIT_FREQUENCY: Record<string, number> = {
    'super-mutant': 5,          // card: "dynamic 4-6 sessions/week"
    '30-minute-adventure': 3,   // portfolio.ts frequency: [2,3,4]
};

const workingSets = (ex: { sets?: number; prescription?: any }): number => {
    if (ex.prescription?.block?.kind === 'density') return 1;
    return Math.max(0, ex.sets || 0);
};

/**
 * Materialises a plan's sample week.
 *
 * Week choice matters: several plans ship a week 1 that is a calibration or
 * test week and therefore unrepresentative of the plan's steady state. The
 * heuristic takes the first week whose total set count is within 15% of the
 * plan's median week, which lands on a normal working week without needing a
 * hand-maintained per-plan table.
 */
/**
 * 30 Minute Adventure has no calendar week and no fixed session: the athlete
 * re-picks one pair per portal every time. Measuring one hand-chosen route
 * describes that route, not the plan. This builds the *expected* session
 * instead — every pair in a portal weighted by its equal chance of being
 * picked — so the systemic/axial figures are the plan's average behaviour and
 * variety is measured against the whole reachable pool.
 */
const materialiseAdventure = (sessionsPerWeek = 3): PlanWeek => {
    const slots: Slot[] = [];
    for (let day = 1; day <= sessionsPerWeek; day += 1) {
        for (const portal of ADVENTURE_PORTALS) {
            const pairs = portal.pairIds.map(getAdventurePair).filter(Boolean) as any[];
            // Each portal contributes 4 sets/session (2 exercises × 2 rounds).
            const perExercise = 2 / pairs.length;
            for (const pair of pairs) {
                for (const key of [pair.a, pair.b]) {
                    const ex = getAdventureExercise(key);
                    if (!ex) continue;
                    slots.push({
                        day,
                        dayName: portal.shortName.en,
                        name: ex.name.en,
                        id: RESOLVER.resolveId(ex.name.en),
                        sets: perExercise,
                    });
                }
            }
        }
    }
    return {
        planId: ADVENTURE_PLAN_ID,
        name: '30 Minute Adventure',
        week: 1,
        trainingDays: sessionsPerWeek,
        slots,
        perVisitGenerator: true,
        notes: [
            `free-choice generator: expected session averaged over all ${ADVENTURE_PAIRS.length} pairs, × ${sessionsPerWeek} sessions/week`,
            'variety counts the reachable pool, not one route — 20 sets/session by construction',
        ],
    };
};

export const materialise = (planId: string): PlanWeek | undefined => {
    if (planId === ADVENTURE_PLAN_ID) return materialiseAdventure();
    const config = PLAN_REGISTRY[planId];
    if (!config) return undefined;
    const notes: string[] = [];

    /**
     * The shared preview user trains Mon/Wed/Fri. Plans that reflow their
     * template onto the athlete's chosen days (Bench Domination's "smart day
     * assignment") then compress a 6-day week into 3 and report roughly half
     * their real volume. Hand each plan a schedule matching the days its own
     * template actually uses.
     */
    const rawDays = config.program.weeks
        .flatMap(w => w.days)
        .filter(d => (d.exercises ?? []).length > 0)
        .map(d => d.dayOfWeek);
    const selectedDays = rawDays.length ? [...new Set(rawDays)].sort((a, b) => a - b) : [1, 3, 5];
    const user = { ...buildPreviewUser(planId), selectedDays } as ReturnType<typeof buildPreviewUser>;

    const runDay = (day: WorkoutDay): WorkoutDay => {
        try { return config.hooks?.preprocessDay?.(day, user) ?? day; }
        catch { return day; }
    };

    // Detect per-visit generators the same way verify:volume does: a generator
    // that hands back a session for every calendar day, all identical.
    const perVisitGenerator = (() => {
        const week = config.program.weeks[0];
        if (!week) return false;
        const sigs = week.days.map(d => (runDay(d).exercises ?? []).map(e => e.name).join('|'));
        return sigs.every(Boolean) && sigs.length > 1 && new Set(sigs).size === 1;
    })();

    const weekTotals = config.program.weeks.map(week => {
        const days = week.days.map(runDay);
        const total = days.reduce((sum, d) =>
            sum + (d.exercises ?? []).reduce((s, e) => s + workingSets(e), 0), 0);
        return { week, days, total };
    }).filter(w => w.total > 0);

    if (!weekTotals.length) return undefined;

    const sorted = [...weekTotals].map(w => w.total).sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const pick = weekTotals.find(w => Math.abs(w.total - median) <= median * 0.15) ?? weekTotals[0];
    if (pick.week.weekNumber !== weekTotals[0].week.weekNumber)
        notes.push(`sampled week ${pick.week.weekNumber} (week 1 is off-median at ${weekTotals[0].total} sets)`);

    const slots: Slot[] = [];
    let dayIndex = 0;
    for (const day of pick.days) {
        const exercises = (day.exercises ?? []).filter(e => workingSets(e) > 0);
        if (!exercises.length) continue;
        dayIndex += 1;
        for (const ex of exercises) {
            slots.push({
                day: dayIndex,
                dayName: day.name ?? `Day ${dayIndex}`,
                name: ex.name,
                id: RESOLVER.resolveId(ex.name),
                sets: workingSets(ex),
                ...((ex as any).prescription?.block ? { block: true } : {}),
            });
        }
    }

    /**
     * Dynamic plans have no calendar week to measure. Running their generator
     * once per weekday multiplies a single session by seven, which is how
     * Super Mutant reads as 210 sets. Collapse to one session and re-express at
     * the plan's own declared frequency instead.
     */
    if (perVisitGenerator) {
        const freq = PER_VISIT_FREQUENCY[planId] ?? 3;
        const oneSession = slots.filter(s => s.day === 1);
        slots.length = 0;
        for (let d = 1; d <= freq; d += 1)
            for (const s of oneSession) slots.push({ ...s, day: d });
        dayIndex = freq;
        notes.push(`per-visit generator: one session × ${freq} sessions/week (declared frequency)`);
    }

    return {
        planId,
        name: config.program.name,
        week: pick.week.weekNumber,
        trainingDays: dayIndex,
        slots,
        perVisitGenerator,
        notes,
    };
};

export type Metrics = {
    planId: string;
    name: string;
    week: number;
    days: number;
    totalSets: number;
    setsPerSession: number;
    slotsPerSession: number;
    distinctExercises: number;
    /** Distinct exercises per 10 sets — variety density, comparable across sizes. */
    varietyDensity: number;
    /** Share of weekly sets spent on the plan's single most-used movement. */
    topExerciseShare: number;
    /** Shannon evenness over set distribution across exercises, 0–1. */
    evenness: number;
    systemic: number;
    axial: number;
    lowerBack: number;
    perSetSystemic: number;
    perSetAxial: number;
    /** Sets whose movement carries systemicCost >= 3. */
    highSystemicSets: number;
    /** Compound share: sets on movements flagged systemicCompound. */
    compoundShare: number;
    /** Major muscle groups receiving >= 4 direct sets/week. */
    groupsCovered: number;
    /** Major groups with zero direct sets. */
    groupsMissing: string[];
    /** Direct sets by major group. */
    volume: Record<string, number>;
    /** Groups trained on >= 2 distinct days. */
    twicePlusGroups: number;
    /** Set-weighted mean lengthened-position bias, 0–4 — stimulus quality per set. */
    avgLengthened: number;
    /** Set-weighted mean stability demand, 0–4 — how much of the set is spent balancing. */
    avgStability: number;
    /** Stimulus per unit fatigue: lengthened bias earned per point of systemic cost. */
    stimulusPerFatigue: number;
    /** Share of sets on movements it is safe to take to failure. */
    failureSafeShare: number;
    weeklyShoulderCost: number;
    weeklyKneeCost: number;
    weeklyElbowCost: number;
    /** Direct sets: (chest+shoulders+triceps) / (back+biceps). 1.0 is balanced. */
    pushPullRatio: number | null;
    /** Direct sets: quads / hamstrings. */
    quadHamRatio: number | null;
    /** Major groups sitting in the 10–20 set/week hypertrophy band. */
    groupsInMav: number;
    /** Major groups above 20 direct sets/week. */
    groupsOverMav: string[];
    /** Major groups on 1–9 direct sets — trained, but under a growth dose. */
    groupsUnderMev: string[];
    unmapped: string[];
    notes: string[];
};

const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

/**
 * Weekly direct-set bands per major group.
 *
 * A flat 10–20 window flags calves and core as under-dosed on almost every
 * plan, which says more about the window than about the plans: the smaller
 * groups get a real growth stimulus at lower set counts and are routinely
 * programmed there on purpose. Large groups keep the conventional 10–20.
 */
const SET_BANDS: Record<string, { mev: number; mav: number }> = {
    chest: { mev: 10, mav: 20 }, back: { mev: 10, mav: 20 },
    quads: { mev: 10, mav: 20 }, hamstrings: { mev: 10, mav: 20 },
    glutes: { mev: 10, mav: 20 }, shoulders: { mev: 10, mav: 20 },
    biceps: { mev: 6, mav: 20 }, triceps: { mev: 6, mav: 20 },
    calves: { mev: 6, mav: 20 }, core: { mev: 6, mav: 20 },
};
const band = (group: string) => SET_BANDS[group] ?? { mev: 10, mav: 20 };

/** Ratios are undefined, not enormous, when a plan trains none of the denominator. */
const ratio = (num: number, den: number): number | null =>
    den > 0 ? round(num / den, 2) : null;

export const score = (week: PlanWeek): Metrics => {
    const totalSets = week.slots.reduce((s, x) => s + x.sets, 0);

    const setsById = new Map<string, number>();
    for (const slot of week.slots) setsById.set(slot.id, (setsById.get(slot.id) ?? 0) + slot.sets);

    let systemic = 0, axial = 0, lowerBack = 0, highSystemicSets = 0, compoundSets = 0;
    let lengthened = 0, stability = 0, failureSafe = 0;
    let shoulderCost = 0, kneeCost = 0, elbowCost = 0, scored = 0;
    const direct = new Map<string, number>();
    const dayHits = new Map<string, Set<number>>();
    const unmapped: string[] = [];

    for (const slot of week.slots) {
        const entry = RESOLVER.byId(slot.id as any);
        if (!entry) { if (!unmapped.includes(slot.name)) unmapped.push(slot.name); continue; }
        const intel = intelOf(entry);
        systemic += intel.systemicCost * slot.sets;
        axial += intel.axialCost * slot.sets;
        lowerBack += intel.lowerBackCost * slot.sets;
        if (intel.systemicCost >= 3) highSystemicSets += slot.sets;
        if (intel.systemicCompound) compoundSets += slot.sets;
        lengthened += intel.lengthenedBias * slot.sets;
        stability += intel.stabilityDemand * slot.sets;
        if (intel.failureSuitability === 'suitable') failureSafe += slot.sets;
        shoulderCost += intel.shoulderCost * slot.sets;
        kneeCost += intel.kneeCost * slot.sets;
        elbowCost += intel.elbowCost * slot.sets;
        scored += slot.sets;

        /*
         * Count each major group ONCE per exercise.
         *
         * `back` aggregates lats + upperBack + traps + lowerBack, and a row
         * lists both `upperBack` and `lats` as primary — so iterating the
         * primary list naively credited a 3-set row with 6 sets of back.
         * Quads and hamstrings are single-muscle groups and never inflate,
         * which made every multi-muscle group look like it dominated.
         */
        const hitGroups = new Set<MajorMuscleGroup>();
        for (const muscle of entry.primary ?? []) {
            const group = majorOf(muscle);
            if (group) hitGroups.add(group);
        }
        for (const group of hitGroups) {
            direct.set(group, (direct.get(group) ?? 0) + slot.sets);
            if (!dayHits.has(group)) dayHits.set(group, new Set());
            dayHits.get(group)!.add(slot.day);
        }
    }

    // Shannon evenness over set share per distinct exercise.
    const shares = [...setsById.values()].map(v => v / totalSets).filter(p => p > 0);
    const H = -shares.reduce((s, p) => s + p * Math.log(p), 0);
    const evenness = shares.length > 1 ? H / Math.log(shares.length) : 0;

    const groups = Object.keys(MUSCLE_AGGREGATES) as MajorMuscleGroup[];
    const volume: Record<string, number> = {};
    for (const g of groups) volume[g] = round(direct.get(g) ?? 0);

    return {
        planId: week.planId,
        name: week.name,
        week: week.week,
        days: week.trainingDays,
        totalSets: round(totalSets),
        setsPerSession: round(totalSets / Math.max(1, week.trainingDays)),
        slotsPerSession: round(week.slots.length / Math.max(1, week.trainingDays)),
        distinctExercises: setsById.size,
        varietyDensity: round((setsById.size / totalSets) * 10, 2),
        topExerciseShare: round(Math.max(...setsById.values()) / totalSets, 3),
        evenness: round(evenness, 3),
        systemic: round(systemic),
        axial: round(axial),
        lowerBack: round(lowerBack),
        perSetSystemic: round(systemic / Math.max(1, totalSets), 2),
        perSetAxial: round(axial / Math.max(1, totalSets), 2),
        highSystemicSets: round(highSystemicSets),
        compoundShare: round(compoundSets / Math.max(1, totalSets), 3),
        groupsCovered: groups.filter(g => (direct.get(g) ?? 0) >= 4).length,
        groupsMissing: groups.filter(g => !(direct.get(g) ?? 0)),
        volume,
        twicePlusGroups: groups.filter(g => (dayHits.get(g)?.size ?? 0) >= 2).length,
        avgLengthened: round(lengthened / Math.max(1, scored), 2),
        avgStability: round(stability / Math.max(1, scored), 2),
        stimulusPerFatigue: round(lengthened / Math.max(1, systemic), 2),
        failureSafeShare: round(failureSafe / Math.max(1, scored), 3),
        weeklyShoulderCost: round(shoulderCost),
        weeklyKneeCost: round(kneeCost),
        weeklyElbowCost: round(elbowCost),
        pushPullRatio: ratio(
            (volume.chest ?? 0) + (volume.shoulders ?? 0) + (volume.triceps ?? 0),
            (volume.back ?? 0) + (volume.biceps ?? 0)),
        quadHamRatio: ratio(volume.quads ?? 0, volume.hamstrings ?? 0),
        groupsInMav: groups.filter(g => volume[g] >= band(g).mev && volume[g] <= band(g).mav).length,
        groupsOverMav: groups.filter(g => volume[g] > band(g).mav),
        groupsUnderMev: groups.filter(g => volume[g] > 0 && volume[g] < band(g).mev),
        unmapped,
        notes: week.notes,
    };
};

export const ALL_PLAN_IDS = PLAN_IDS;

// ---------------------------------------------------------------------------
// Set distribution
// ---------------------------------------------------------------------------

/**
 * How a week's sets are spread across its slots.
 *
 * Two failure modes matter and the weekly total hides both. A slot carrying one
 * set is usually a token gesture — not enough to drive anything, but it still
 * costs setup time and a line on the screen. A slot carrying four or more is
 * only productive when it is the session's actual driver; stacked on an
 * accessory it is junk volume that a second movement would spend better.
 */
export type SetShape = {
    slots: number;
    singletons: number;          // slots at exactly 1 set
    twos: number;
    threes: number;
    fourPlus: number;            // slots at 4+ sets
    avgSetsPerSlot: number;
    /** Slots at 4+ sets that are not the day's first (highest-priority) slot. */
    deepAccessorySlots: { day: string; name: string; sets: number }[];
    singletonSlots: { day: string; name: string }[];
    /** Per-day: [dayName, slotCount, totalSets]. */
    days: { name: string; slots: number; sets: number }[];
};

export const setShape = (week: PlanWeek): SetShape => {
    const byDay = new Map<number, Slot[]>();
    for (const s of week.slots) {
        if (!byDay.has(s.day)) byDay.set(s.day, []);
        byDay.get(s.day)!.push(s);
    }

    const singletonSlots: SetShape['singletonSlots'] = [];
    const deepAccessorySlots: SetShape['deepAccessorySlots'] = [];
    const days: SetShape['days'] = [];
    let singletons = 0, twos = 0, threes = 0, fourPlus = 0, total = 0;

    for (const [, slots] of [...byDay.entries()].sort((a, b) => a[0] - b[0])) {
        let daySets = 0;
        slots.forEach((s, i) => {
            daySets += s.sets;
            total += s.sets;
            const n = Math.round(s.sets);
            if (s.block) { /* timed block: not a set-count decision */ }
            else if (n <= 1) { singletons += 1; singletonSlots.push({ day: s.dayName, name: s.name }); }
            else if (n === 2) twos += 1;
            else if (n === 3) threes += 1;
            else {
                fourPlus += 1;
                // The first slot of a day is the day's driver by convention; a
                // 4+ set block anywhere after it is the case worth flagging.
                if (i > 0) deepAccessorySlots.push({ day: s.dayName, name: s.name, sets: s.sets });
            }
        });
        days.push({ name: slots[0]?.dayName ?? '', slots: slots.length, sets: Math.round(daySets * 10) / 10 });
    }

    return {
        slots: week.slots.length,
        singletons, twos, threes, fourPlus,
        avgSetsPerSlot: Math.round((total / Math.max(1, week.slots.length)) * 100) / 100,
        deepAccessorySlots, singletonSlots, days,
    };
};
