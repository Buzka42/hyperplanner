/**
 * Week-1 (and mean working-week) muscle volume + mix flags for the variety brief.
 * Direct sets = primary involvement; secondary = 1/3 (same as analyseWeek).
 */
import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_IDS } from '../src/data/planMeta';
import { EXERCISE_LIBRARY } from '../src/data/exercises/library';
import { createResolver } from '../src/data/exercises';
import { analyseWeek, PLAN_RULES } from '../src/lib/volumeAnalysis';
import { buildPreviewUser } from '../src/pages/admin/previewUser';
import type { WorkoutDay } from '../src/types';
import type { LibraryExercise } from '../src/data/exercises/types';

const resolver = createResolver(EXERCISE_LIBRARY);

const OVERHEAD_TRI = /overhead|french press|incline.*(skull|extension)|jm press|jm-press/i;
const PRESSDOWN_TRI = /pressdown|pushdown|kickback|cable tri|rope.*(tri|extension)|straight.?bar.*(tri|push)/i;
const SKULL_TRI = /skull|lying.*(tri|extension)|rolling tricep/i;
const DIP = /dip/i;
const INCLINE = /incline/i;
const DECLINE = /decline/i;
const PEC_LOWER = /dip|decline|pec.?deck|chest fly|flye|crossover|hammer chest|flat.*(bench|press)|machine chest/i;
const PEC_UPPER = /incline|low.?to.?high|clavicular/i;
const HIP_SUPP = /hip.?support/i;
const SEATED_CURL = /seated.*(ham|leg).?curl|seated-ham/i;
const LYING_CURL = /lying.*(ham|leg).?curl|nordic|glute.?ham|ghr/i;
const HINGE_HAM = /rdl|romanian|good.?morning|stiff.?leg|deadlift/i;
const Y_TRAP = /y.?raise|face.?pull|prone y|rear delt fly/i;
const PULL_LT = /pull.?up|chin|chest.?supported|meadow|incline row|seal row|face.?pull/i;
const STANDING_CALF = /standing.*calf|hack.?calf|donkey.?calf|leg.?press.?calf/i;
const SEATED_CALF = /seated.*calf/i;
const CABLE_CRUNCH = /cable crunch/i;
const AB_WHEEL = /ab.?wheel|rollout/i;
const HANGING = /hanging.*(leg|knee)|knee raise|side.*raise/i;
const PLANKISH = /plank|dead.?bug|mcgill|hollow|suitcase|pallof/i;

const BEGINNER = new Set([
    'skeleton-to-threat', 'lazarus', 'monolith', 'house-of-iron',
    'apex-predator', 'the-minimum',
]);

function workingSets(ex: { sets?: number; prescription?: { block?: { kind?: string } } }): number {
    if (ex.prescription?.block?.kind === 'density') return 1;
    return Math.max(0, ex.sets || 0);
}

function classifyTri(entry: LibraryExercise | undefined, name: string): 'oh' | 'pressdown' | 'skull' | 'dip' | 'other' | null {
    const n = `${entry?.id ?? ''} ${name}`;
    const isTri = entry?.primary?.includes('triceps') || entry?.pattern === 'elbow-extension';
    if (!isTri && !/tricep|pressdown|skull|overhead.*(ext|cable)/i.test(n)) return null;
    if (OVERHEAD_TRI.test(n)) return 'oh';
    if (DIP.test(n) && /dip/i.test(entry?.id ?? name)) return 'dip';
    if (PRESSDOWN_TRI.test(n)) return 'pressdown';
    if (SKULL_TRI.test(n)) return 'skull';
    if (entry?.pattern === 'elbow-extension' || entry?.primary?.includes('triceps')) return 'other';
    return null;
}

function classifyPec(entry: LibraryExercise | undefined, name: string): 'upper' | 'lower' | 'mid' | null {
    if (!entry?.primary?.includes('chest') && !/press|fly|dip|pec/i.test(name)) return null;
    if (!entry?.primary?.includes('chest')) return null;
    if (entry.pattern === 'incline-press' || PEC_UPPER.test(`${entry.id} ${name}`)) return 'upper';
    if (DIP.test(entry.id) || DECLINE.test(entry.id) || /pec-deck|chest-fly|crossover/i.test(entry.id)) return 'lower';
    if (entry.pattern === 'horizontal-press') return 'mid';
    return 'mid';
}

function classifyHam(entry: LibraryExercise | undefined, name: string): 'short' | 'long' | 'hipSupp' | null {
    const n = `${entry?.id ?? ''} ${name}`;
    const ham = entry?.primary?.includes('hamstrings') || entry?.pattern === 'knee-flexion' || entry?.pattern === 'hinge';
    if (!ham) return null;
    if (HIP_SUPP.test(n)) return 'hipSupp';
    if (SEATED_CURL.test(n) || (entry?.pattern === 'knee-flexion' && /seated/i.test(n))) return 'short';
    if (LYING_CURL.test(n) || HINGE_HAM.test(n) || entry?.pattern === 'hinge') return 'long';
    if (entry?.pattern === 'knee-flexion') return 'short';
    return null;
}

function classifyCore(entry: LibraryExercise | undefined, name: string): string | null {
    const n = `${entry?.id ?? ''} ${name}`;
    if (entry?.pattern?.startsWith('core-') || entry?.primary?.includes('abs') || entry?.primary?.includes('obliques')) {
        if (CABLE_CRUNCH.test(n) || /weighted-crunch|machine.?crunch/i.test(n)) return 'crunch';
        if (AB_WHEEL.test(n)) return 'wheel';
        if (HANGING.test(n) || /reverse.?crunch/i.test(n)) return 'raise';
        if (PLANKISH.test(n)) return 'anti';
        return entry?.pattern ?? 'core';
    }
    return null;
}

function daysFor(config: (typeof PLAN_REGISTRY)[string], user: ReturnType<typeof buildPreviewUser>, weekIndex: number): WorkoutDay[] {
    const week = config.program.weeks[weekIndex];
    if (!week) return [];
    return week.days.map(day => {
        try {
            return config.hooks?.preprocessDay?.(day, user) ?? day;
        } catch {
            return day;
        }
    });
}

type Mix = {
    tri: Record<string, number>;
    pec: Record<string, number>;
    ham: Record<string, number>;
    core: Record<string, number>;
    lowerTrapDirect: number;
    lowerTrapViaBack: number;
    standingCalf: number;
    seatedCalf: number;
    slots: { name: string; id: string; sets: number; tags: string[] }[];
};

function mixWeek(days: WorkoutDay[]): Mix {
    const mix: Mix = {
        tri: {}, pec: {}, ham: {}, core: {},
        lowerTrapDirect: 0, lowerTrapViaBack: 0, standingCalf: 0, seatedCalf: 0,
        slots: [],
    };
    const add = (bag: Record<string, number>, k: string, n: number) => { bag[k] = (bag[k] ?? 0) + n; };

    for (const day of days) {
        for (const ex of day.exercises ?? []) {
            const sets = workingSets(ex);
            if (!sets) continue;
            const entry = resolver.resolve(ex.name);
            const id = entry?.id ?? `unmapped:${ex.name}`;
            const tags: string[] = [];
            const t = classifyTri(entry, ex.name);
            if (t) { add(mix.tri, t, sets); tags.push(`tri:${t}`); }
            const p = classifyPec(entry, ex.name);
            if (p) { add(mix.pec, p, sets); tags.push(`pec:${p}`); }
            const h = classifyHam(entry, ex.name);
            if (h) { add(mix.ham, h, sets); tags.push(`ham:${h}`); }
            const c = classifyCore(entry, ex.name);
            if (c) { add(mix.core, c, sets); tags.push(`core:${c}`); }
            const n = `${id} ${ex.name}`;
            if (Y_TRAP.test(n)) { mix.lowerTrapDirect += sets; tags.push('trapLower:direct'); }
            else if (entry?.primary?.includes('lats') || entry?.primary?.includes('upperBack')) {
                if (PULL_LT.test(n)) { mix.lowerTrapViaBack += sets; tags.push('trapLower:via'); }
            }
            if (entry?.pattern === 'calf' || /calf/i.test(n)) {
                if (SEATED_CALF.test(n)) mix.seatedCalf += sets;
                else if (STANDING_CALF.test(n) || entry?.pattern === 'calf') mix.standingCalf += sets;
                tags.push('calf');
            }
            if (tags.length) mix.slots.push({ name: ex.name, id, sets, tags });
        }
    }
    return mix;
}

const GROUPS = ['chest', 'shoulders', 'back', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'] as const;

const rows: unknown[] = [];

for (const planId of PLAN_IDS) {
    const config = PLAN_REGISTRY[planId];
    const rules = PLAN_RULES[planId] ?? { kind: 'general' as const };
    if (!config) continue;
    const user = buildPreviewUser(planId);
    const w0 = daysFor(config, user, 0);
    const analysis = analyseWeek(w0, 1, resolver, rules);
    const vol: Record<string, number> = {};
    for (const g of GROUPS) {
        vol[g] = analysis.volumes.find(v => v.group === g)?.directSets ?? 0;
    }
    const mix = mixWeek(w0);

    const working = config.program.weeks
        .map((_, i) => analyseWeek(daysFor(config, user, i), i + 1, resolver, rules))
        .filter(w => w.totalSets > 0);
    const meanTotal = working.length
        ? Math.round(working.reduce((s, w) => s + w.totalSets, 0) / working.length)
        : analysis.totalSets;

    const flags: string[] = [];
    const v = vol;
    const maxBody = Math.max(...GROUPS.map(g => v[g]));
    const lowTotal = analysis.totalSets > 0 && analysis.totalSets < 40;
    if (lowTotal) flags.push('low-week-sets');
    for (const g of GROUPS) {
        if (v[g] === 0 && !['calves', 'core'].includes(g)) flags.push(`zero:${g}`);
        if (maxBody >= 18 && v[g] === maxBody) flags.push(`peak:${g}:${v[g]}`);
        if (v[g] >= 22) flags.push(`hot:${g}:${v[g]}`);
        if (v[g] > 0 && v[g] <= 3 && !['calves', 'core', 'biceps', 'triceps'].includes(g)) flags.push(`thin:${g}:${v[g]}`);
    }

    const triOh = mix.tri.oh ?? 0;
    const triOther = (mix.tri.pressdown ?? 0) + (mix.tri.skull ?? 0) + (mix.tri.dip ?? 0) + (mix.tri.other ?? 0);
    if (triOh + triOther >= 6) {
        if (triOh === 0) flags.push('tri:no-overhead');
        if (triOther === 0) flags.push('tri:all-overhead');
        if (triOh > 0 && triOther > 0 && Math.abs(triOh - triOther) / (triOh + triOther) > 0.55) flags.push('tri:lopsided');
    }
    const pecU = mix.pec.upper ?? 0;
    const pecL = mix.pec.lower ?? 0;
    const pecM = mix.pec.mid ?? 0;
    if (pecU + pecL + pecM >= 6) {
        if (pecU === 0) flags.push('pec:no-upper');
        if (pecL === 0 && pecM + pecU >= 8) flags.push('pec:no-lower-variation');
    }
    const hamS = mix.ham.short ?? 0;
    const hamL = (mix.ham.long ?? 0) + (mix.ham.hipSupp ?? 0);
    if (hamS + hamL >= 6) {
        if (hamS === 0) flags.push('ham:no-shortened');
        if (hamL === 0) flags.push('ham:no-lengthened');
    }
    if ((mix.ham.hipSupp ?? 0) > 0 && !BEGINNER.has(planId) && (mix.ham.hipSupp ?? 0) >= hamL && hamL >= 6) {
        flags.push('ham:hip-supp-is-main');
    }
    if (BEGINNER.has(planId) && hamL > 0 && (mix.ham.hipSupp ?? 0) === 0 && (mix.ham.long ?? 0) >= 4) {
        flags.push('ham:beginner-missing-hip-supp');
    }
    if (mix.seatedCalf > 0) flags.push('calf:seated');
    if (v.calves > 0 && mix.standingCalf === 0 && mix.seatedCalf === 0) flags.push('calf:unclassified');
    const coreKinds = Object.keys(mix.core).length;
    if (v.core >= 4 && coreKinds <= 1 && (mix.core.wheel ?? 0) > 0) flags.push('core:wheel-only');
    if (v.core >= 4 && (mix.core.crunch ?? 0) === 0) flags.push('core:no-crunch');
    if (mix.lowerTrapDirect === 0 && mix.lowerTrapViaBack === 0 && v.back >= 8) flags.push('trapLower:none');

    rows.push({
        id: planId,
        name: config.program.name,
        beginner: BEGINNER.has(planId),
        week1Sets: analysis.totalSets,
        meanWeekSets: meanTotal,
        vol,
        mix: {
            tri: mix.tri, pec: mix.pec, ham: mix.ham, core: mix.core,
            lowerTrapDirect: mix.lowerTrapDirect,
            lowerTrapViaBack: mix.lowerTrapViaBack,
            standingCalf: mix.standingCalf,
            seatedCalf: mix.seatedCalf,
        },
        flags,
        slots: mix.slots,
    });
}

console.log(JSON.stringify(rows, null, 2));
