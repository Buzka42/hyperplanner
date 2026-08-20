/**
 * review-flags — the standing set-shape check every plan review must report.
 *
 * Owner rule: flag every slot carrying **more than 3 sets** or **only 1 set** in
 * a session. Three-plus sets is only productive on the session's main driver;
 * stacked on an accessory it is volume a second movement would spend better. One
 * set is a token gesture that still costs setup time and a line on screen.
 *
 * Exemptions are per-plan and justified by identity, never assumed. Each one
 * below names the mechanic it protects.
 *
 *   npx tsx scripts/review-flags.ts             # all plans
 *   npx tsx scripts/review-flags.ts kali        # one plan
 *   npx tsx scripts/review-flags.ts --json
 */

import { RESOLVER, majorOf, materialise, ALL_PLAN_IDS, type PlanWeek } from './portfolio-metrics';
import { SET_SHAPE } from './v2-round2-map';
import { PLAN_RULES } from '../src/lib/volumeAnalysis';

/**
 * Plans allowed to carry 4+ sets on a slot that does not lead its session,
 * because a named mechanic puts it there. Reviewed with the owner in batch 3.
 *
 * Keyed by plan, then by the movement the exemption covers — a blanket
 * plan-level pass would hide the next case that appears.
 */
const OVER_THREE_EXEMPT: Record<string, Record<string, string>> = {
    'bench-domination': {
        'behind-the-neck-press': 'BD-E7 module: BTN press is a prescribed second press on Mon and Thu',
        'weighted-pull-up': 'the pull-up ladder is an EMOM block prescribed in minutes (8-12 rounds in weeks 1-6, a max triple plus back-offs in 7-9), not an accessory stack',
    },
    'pain-and-glory': {
        '*': 'owner: working as designed — the 10×6 deficit structure and its supporting slots are the plan',
    },
    'trinary': {
        '*': 'conjugate ME/DE/RE: the 8-set dynamic-effort squat and 4-set ME bench are the mechanic',
    },
    'king-of-the-squat': {
        'long-pause-bench-press': 'KOS-X9 job 1 — a bench job, not an accessory',
        'paused-bench-press': 'KOS-X9 job 3 — the heavy bench job',
        'wide-grip-bench-press': 'KOS-X9 job 2 — the hypertrophy bench job',
        'pull-up': 'the only vertical pull in the plan, once weekly',
        'hammer-upper-row': 'squat-day back work at the level the plan shipped with',
        'heavy-rolling-tricep-extension': 'raised deliberately in batch 1 — triceps were at 3 sets',
        'hack-calf-raise': 'raised deliberately in batch 1 — KOS-X13 keeps calves Friday-only, so one slot carries the dose',
    },
    'gravity-is-optional': {
        'dip': 'GIO-RB-I: the dip family runs 3×/week and is half the plan',
        'weighted-dip': 'GIO-RB-I: the dip family is half the plan',
        'hip-supported-db-deadlift': 'GIO-V-ham: the only hinge in the plan',
        'heel-elevated-goblet-squat': 'the only loaded squat pattern in the plan',
    },
    'purgatorio': {
        '*': 'antagonist supersets: both halves of a pair carry the same set count by construction (PUR-V-map)',
    },
    'immaculate-restructure': {
        'weighted-chin-up': 'Poliquin ratio lift at 81% of the close-grip bench reference — a structural anchor',
        'hammer-upper-row': 'IMM-V-pass: selection follows the Poliquin template',
    },
    'overhead-dominion': {
        'weighted-chin-up': 'the pull anchor balancing a shoulder specialisation',
    },
    'neural-overload': {
        'barbell-row': 'the PAP singles lead the day at 1 set each, so this is the session’s actual volume work',
        'incline-dumbbell-bench-press': 'same: the volume work behind the 1-6 singles',
    },
};

/** Single-set slots that are a mechanic on one movement, not a whole plan. */
const SINGLE_SET_EXEMPT_SLOT: Record<string, Record<string, string>> = {
    'arms-race': {
        '30-incline-lying-dumbbell-curl': 'Go Nuclear biceps giant set: one extended myo-rep set of 30-40 reps plus cheat eccentrics — there is no second set to add',
    },
};

/** Why a plan is allowed to break the rule, stated so it can be argued with. */
const SINGLE_SET_EXEMPT: Record<string, string> = {
    'blackout': 'identity is one all-out work set per movement (BLK-RB-I)',
    'neural-overload': '1-6 PAP singles are the plan\'s mechanic',
    'iron-clock': 'parked / hidden from the catalogue',
    '30-minute-adventure': 'free-choice generator, modelled as expected value rather than real slots',
    'bench-domination': 'powerlifting: AMRAP and top singles are the mechanic',
    'pain-and-glory': 'powerlifting: ME and top singles are the mechanic',
    'trinary': 'conjugate: ME singles are the mechanic',
    'ritual-of-strength': 'powerlifting: ME singles are the mechanic',
};

export type Flag = {
    planId: string;
    kind: 'single-set' | 'over-three';
    day: number;
    dayName: string;
    exercise: string;
    sets: number;
    /** True when the slot leads its day — a driver, not an accessory. */
    isDayLead: boolean;
    /** For over-three: does the plan specialise in this movement's muscle? */
    specialises: boolean;
    exempt: string | null;
};

export const reviewFlags = (planId: string, week: PlanWeek): Flag[] => {
    const flags: Flag[] = [];
    const spec = new Set<string>(PLAN_RULES[planId]?.specialisation ?? []);
    const capExtra = new Set(SET_SHAPE.capExempt[planId] ?? []);
    const singleExempt = SINGLE_SET_EXEMPT[planId] ?? null;

    const byDay = new Map<number, PlanWeek['slots']>();
    for (const s of week.slots) {
        if (!byDay.has(s.day)) byDay.set(s.day, []);
        byDay.get(s.day)!.push(s);
    }

    for (const [day, slots] of [...byDay].sort((a, b) => a[0] - b[0])) {
        slots.forEach((slot, index) => {
            const entry = RESOLVER.byId(slot.id as any);
            if (!entry) return;
            // Rounds, not sets — nothing to add or trim.
            if (SET_SHAPE.skipPatterns.has(entry.pattern) || slot.block) return;

            const sets = Math.round(slot.sets);
            const groups = new Set(
                (entry.primary ?? []).map(m => majorOf(m)).filter(Boolean) as string[]);
            const specialises = [...groups].some(g => spec.has(g) || capExtra.has(g));

            if (sets === 1) {
                flags.push({
                    planId, kind: 'single-set', day, dayName: slot.dayName,
                    exercise: entry.name.en, sets, isDayLead: index === 0,
                    specialises,
                    exempt: singleExempt ?? SINGLE_SET_EXEMPT_SLOT[planId]?.[slot.id] ?? null,
                });
            } else if (sets > 3) {
                flags.push({
                    planId, kind: 'over-three', day, dayName: slot.dayName,
                    exercise: entry.name.en, sets, isDayLead: index === 0,
                    specialises,
                    exempt: index === 0 ? 'leads the session — this is the day\'s driver'
                        : specialises ? `plan specialises in ${[...groups].filter(g => spec.has(g) || capExtra.has(g)).join('/')}`
                        : (OVER_THREE_EXEMPT[planId]?.[slot.id]
                            ?? OVER_THREE_EXEMPT[planId]?.['*']
                            ?? null),
                });
            }
        });
    }
    return flags;
};

const isEntry = process.argv[1]?.replace(/\\/g, '/').endsWith('review-flags.ts');
if (isEntry) {
    const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
    const all: Flag[] = [];
    // Reads the shipped plans, not the simulation: this is the standing gate.
    for (const planId of ALL_PLAN_IDS) {
        if (args.length && !args.includes(planId)) continue;
        const week = materialise(planId);
        if (!week) continue;
        all.push(...reviewFlags(planId, week));
    }

    if (process.argv.includes('--json')) {
        console.log(JSON.stringify(all, null, 1));
    } else {
        const unexplained = all.filter(f => !f.exempt);
        const byPlan = new Map<string, Flag[]>();
        for (const f of all) {
            if (!byPlan.has(f.planId)) byPlan.set(f.planId, []);
            byPlan.get(f.planId)!.push(f);
        }
        for (const [plan, flags] of byPlan) {
            const bad = flags.filter(f => !f.exempt);
            console.log(`\n${plan}  —  ${bad.length} to answer for, ${flags.length - bad.length} explained`);
            for (const f of flags) {
                const tag = f.kind === 'single-set' ? '1 set ' : `${f.sets} sets`;
                console.log(`   ${f.exempt ? ' ' : '!'} D${f.day} ${tag}  ${f.exercise}${f.exempt ? `   (${f.exempt})` : ''}`);
            }
        }
        console.log(`\n  ${unexplained.length} unexplained flag${unexplained.length === 1 ? '' : 's'} across ${byPlan.size} plans` +
            `  (${all.filter(f => f.kind === 'single-set' && !f.exempt).length} single-set, ` +
            `${all.filter(f => f.kind === 'over-three' && !f.exempt).length} over-three)\n`);
        if (process.argv.includes('--strict') && unexplained.length) process.exit(1);
    }
}
