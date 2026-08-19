/**
 * v2-change-map — the post-audit votes, expressed as edits to a materialised week.
 *
 * Source of truth: `docs/plans/v2/_effectiveness-questions.md` (the `*-RB-*` and
 * `*-V-*` decision tables) and `_audit-closeout.md` §2–3 (catalog XR rules).
 * Every entry cites the vote id it implements so a disagreement can be traced
 * back to a decision rather than to this file's author.
 *
 * Only edits that MOVE A MEASURED NUMBER are encoded. Votes about wiring,
 * tempo, RIR, progression, onboarding copy and dashboards are real work but
 * invisible to a volume/fatigue model, so they are listed in `nonStructural`
 * for the write-up instead of being faked into the arithmetic.
 *
 * Where a vote makes a slot a *picker*, the simulation takes the picker's
 * stated default and records the alternatives in `pickers` — variety the
 * athlete can reach that a single-week snapshot would otherwise miss.
 */

export type Edit =
    | { op: 'swap'; from: string; to: string; day?: number; limit?: number; why: string }
    | { op: 'add'; id: string; sets: number; day: number; why: string }
    | { op: 'drop'; id: string; day?: number; sets?: number; why: string }
    | { op: 'setSets'; id: string; day?: number; sets: number; why: string }
    | { op: 'rebuild'; days: { name: string; slots: [string, number][] }[]; why: string };

export type PlanChange = {
    /** Vote ids covered here. */
    votes: string[];
    edits: Edit[];
    /** Alternatives an athlete can select that this snapshot does not show. */
    pickers?: { slot: string; options: string[]; vote: string }[];
    /** Voted changes that do not move a volume/fatigue number. */
    nonStructural?: string[];
    /** Anything the votes left genuinely undecided. */
    open?: string[];
    /** Plan is parked — measure but exclude from portfolio conclusions. */
    parked?: boolean;
};

const TRI_MIX = 'XR-mix tri: even overhead vs pressdown/skull';
const XR_CALF = 'XR-calf: standing DB/KB → hack-calf when strong, never seated';

export const CHANGES: Record<string, PlanChange> = {

    'bench-domination': {
        votes: ['BD-V-core', 'BD-V-pec', 'BD-E19', 'BD-E12'],
        edits: [
            { op: 'swap', from: 'y-raise', to: 'cable-crunch', day: 6, why: 'BD-V-core: second core slot → cable crunch (substitute, not add)' },
            { op: 'swap', from: 'hip-adduction', to: 'machine-hip-abduction', day: 4, why: 'BD-E19: rotate adduction/abduction, 2 sets' },
        ],
        nonStructural: [
            'BD-E12/BD-1: fix the Weighted Pull-ups 0-set bug — restores real lat and biceps volume this model cannot see, because the shipped slot prescribes zero sets',
            'BD-RB-M: everything paused 11X0 including the Saturday AMRAP',
            'BD-RB-P: accessory RIR 3→1 in accumulation',
            'BD-E17/E18: onboarding set counter; defaults giant-set on + one leg day on',
        ],
        open: ['Weighted Pull-ups stays at 0 sets in the measured week — the fix is voted but unimplemented, so chest:back stays as broken as the audit found it'],
    },

    'pencilneck-eradication': {
        votes: ['PN-RB-F', 'PN-RB-F2', 'PN-RB-R', 'PN-V-core', 'PN-V-calf'],
        edits: [],
        pickers: [{ slot: 'second core slot', options: ['hanging-leg-raise', 'machine-crunch'], vote: 'PN-V-core (wheel is not up for swap)' }],
        nonStructural: [
            'PN-V-core: the ab wheel stays; the hanging leg raise gains machine crunch as an optional swap. Default week is unchanged',
            'PN-RB-I: retag intermediate',
            'PN-RB-F/F2/R: ramp from ~50 sets to a ~90–100 peak instead of a flat 91 from week 1 — the peak week measured here is unchanged, the opening week is roughly halved',
            'PN-RB-T/T2/P: cycle-2 drop-sets and rest-pause on isolations; compounds double progression',
        ],
        open: ['machine-crunch library id does not exist yet (closeout §4)'],
    },

    'skeleton-to-threat': {
        votes: ['SKEL-V-ham', 'SKEL-V-core', 'SKEL-V-pec', 'SKEL-RB-F'],
        edits: [],
        nonStructural: [
            'SKEL-V-ham: supported SLDL is the hip-supported DB DL — merge the ids and fix the eccentric to 3–4s. Same movement, same volume, so no number moves',
            'SKEL-RB-F: 3-day opens at 2 sets/slot and climbs to 3 — the measured week is the late-cycle state; the opening week is ~40 sets, not 57',
            'SKEL-RB-I/P: load double progression on weighted slots, rep DP on bodyweight, plank stays timed',
        ],
    },

    'peachy-glute-plan': {
        votes: ['PEA-V-core', 'PEA-V-pec', 'PEA-V-ham', 'PEA-RB-R'],
        edits: [
            { op: 'add', id: 'cable-crunch', sets: 2, day: 2, why: 'PEA-V-core: two sessions × 2 sets of core' },
            { op: 'add', id: 'cable-crunch', sets: 2, day: 4, why: 'PEA-V-core: second core session' },
        ],
        nonStructural: [
            'PEA-RB-R: heavy hinge/squat 5–8, abduction/pump 12–20, break the 3-set wallpaper',
            'PEA-RB-F: optional 3-day (two lower + one upper) keeping the hinge dose',
            'PEA-RB-T: one-and-a-half reps move to lighter quad squats, off the Kas bridge',
        ],
        open: ['PEA-V-core movement never chosen — cable crunch modelled; machine crunch and ab wheel were equally live (closeout §5)'],
    },

    'pain-and-glory': {
        votes: ['PG-V-push', 'PG-V-nordic', 'PG-V-core', 'PG-V-tri', 'PG-V-thrust'],
        edits: [
            { op: 'swap', from: 'incline-dumbbell-bench-press', to: 'paused-bench-press', day: 2, why: 'PG-V-push: paused bench on one push day instead of two inclines' },
            { op: 'swap', from: 'standing-barbell-military-press', to: 'rear-delt-fly', day: 3, why: 'PG-V-push: Thursday OHP → rear-delt work' },
        ],
        nonStructural: [
            'PG-RB-M: the 10×6 deficit pull is a 3–4s eccentric, not a speed pull',
            'PG-4: forced deloads at weeks 8 and 12, optional after week 4',
            'PG-6/PG-V-nordic: Nordics never on 10×6 deficit days; GHR and lying curl as options',
        ],
    },

    trinary: {
        votes: ['TRI-V-tri', 'TRI-V-delt', 'TRI-V-row', 'TRI-V-core', 'TRI-V-glute', 'TRI-RB-F'],
        edits: [],
        nonStructural: [
            'Trinary\'s accessory work is generated per weak-point bundle and does not materialise in a template week — the measured 45 sets are the ME/DE/RE barbell spine only',
            'TRI-V-tri: 2 overhead + 2 pressdown/skull on the accessory list',
            'TRI-V-delt: shoulder press → Y-raise; TRI-V-row: chest-supported cable row',
            'TRI-V-core: add 2 sets cable crunch / ab wheel, rotating',
            'TRI-E1: meet-date picker, indefinite run with programmed deloads',
        ],
        open: ['Accessory volume is invisible to any template-based measurement — Trinary\'s real weekly load is 45 barbell sets plus up to one accessory day'],
    },

    'ritual-of-strength': {
        votes: ['RIT-V-row', 'RIT-V-tri', 'RIT-V-core', 'RIT-V-y', 'RIT-V-glute', 'RIT-RB-F'],
        edits: [
            { op: 'add', id: 'cable-crunch', sets: 2, day: 3, why: 'RIT-V-core: add cable crunch to the DL-day list (wheel + plank stay)' },
            { op: 'add', id: 'seated-cable-row', sets: 3, day: 2, why: 'RIT-V-row: bench-day default chest-supported cable row' },
        ],
        pickers: [
            { slot: 'bench-day row', options: ['seated-cable-row', 'single-arm-dumbbell-row'], vote: 'RIT-V-row' },
            { slot: 'accessory triceps', options: ['overhead-tricep-extension', 'rope-pressdown', 'ezbar-skullcrushers'], vote: 'RIT-V-tri' },
            { slot: 'glute', options: ['hip-thrust', 'machine-hip-thrust', 'high-foot-leg-press'], vote: 'RIT-V-glute (SL glute leg press id missing)' },
        ],
        nonStructural: [
            'RIT-RB-F: 3-day default, optional 4th = Hungry back-off + accessory',
            'RIT-V-y: skip Y-raise — face pulls, rear delts and pull-aparts already cover it',
            'RIT-RB-P: RIR 2→1 on one builder accessory, double progression elsewhere',
        ],
    },

    'super-mutant': {
        votes: ['SM-V-abs', 'SM-V-back', 'SM-V-ham', 'SM-V-delt', 'SM-V-chest-fin', 'SM-V-calf', 'SM-RB-F'],
        edits: [],
        nonStructural: [
            'SM-RB-I: fix both writes — the reactive ~20 sets/muscle engine only works once volume actually records',
            'SM-V-abs: rotate cable crunch / ab wheel in the abs slot (equal cost, no number moves)',
            'SM-RB-F: 4–6 dynamic sessions, 48h/72h cooldowns, capped 6 per 7 days',
        ],
        open: ['Measured at 5 sessions/week — the plan floats 4–6, so weekly volume genuinely ranges 120–180 sets'],
    },

    '30-minute-adventure': {
        votes: ['ADV-V-pullthrough', 'ADV-V-pair-rule', 'ADV-V-new-pairs', 'ADV-RB-I'],
        edits: [
            { op: 'drop', id: 'cable-pull-through', why: 'ADV-V-pullthrough: drop every cable-pull-through pair in both portals' },
            { op: 'add', id: 'incline-dumbbell-bench-press', sets: 0.29, day: 1, why: 'ADV-V-new-pairs: upper FW+machine pair' },
            { op: 'add', id: 'seated-cable-row', sets: 0.29, day: 1, why: 'ADV-V-new-pairs: upper FW+machine pair' },
            { op: 'add', id: 'kas-glute-bridge', sets: 0.33, day: 1, why: 'ADV-V-new-pairs: core pair' },
            { op: 'add', id: 'cable-crunch', sets: 0.33, day: 1, why: 'ADV-V-new-pairs: core pair' },
            { op: 'add', id: 'y-raise', sets: 0.29, day: 1, why: 'ADV-V-new-pairs: calves/shoulders pair' },
            { op: 'add', id: 'hack-calf-raise', sets: 0.29, day: 1, why: 'ADV-V-new-pairs: calves/shoulders pair' },
            { op: 'add', id: 'dumbbell-hammer-curl', sets: 0.29, day: 1, why: 'ADV-V-new-pairs: posterior pair replacing dropped pull-through' },
            { op: 'add', id: 'lying-leg-curl', sets: 0.29, day: 1, why: 'ADV-V-new-pairs: posterior pair replacing dropped pull-through' },
        ],
        nonStructural: [
            'ADV-RB-I: 30-minute budget enforced on randomize; never repeat a pairing; no duplicate movement across portals',
            'ADV-RB-X: equipment exclusion filter',
            'ADV-V-new-ids: machine crunch and side hanging knee raise need library ids',
        ],
    },

    'king-of-the-squat': {
        votes: ['KOS-X5', 'KOS-X6', 'KOS-X10', 'KOS-X11', 'KOS-X12', 'KOS-X15', 'KOS-V-tri', 'KOS-V-core', 'KOS-V-calf', 'KOS-V-hinge'],
        edits: [
            { op: 'swap', from: 'leg-extension', to: 'hip-adduction', day: 3, why: 'KOS-X5: one leg-extension slot → adductor / VMO bias' },
            { op: 'swap', from: 'seated-ham-curl', to: 'glute-ham-raise', day: 2, why: 'KOS-X6: hamstring slot is a picker, not a second seated curl' },
            { op: 'swap', from: 'standing-barbell-military-press', to: 'rear-delt-rope-pulls-to-face', day: 2, why: 'KOS-X10: military → rear-delt / face-pull' },
            { op: 'swap', from: 'tricep-extension', to: 'overhead-tricep-extension', day: 3, why: 'KOS-X15 + KOS-V-tri: triceps move to a bench day, even overhead/pressdown mix' },
            { op: 'swap', from: 'hanging-knee-raise', to: 'ab-wheel', day: 2, why: 'KOS-V-core: picker — hanging knee / plank / wheel / machine crunch' },
            { op: 'swap', from: 'calf-raise', to: 'hack-calf-raise', day: 4, why: XR_CALF },
            { op: 'setSets', id: 'hammer-upper-row', day: 1, sets: 5, why: 'KOS-X11: increase hammer-row sets, add back work — scapular muscles rank with lats' },
            { op: 'add', id: 'seated-cable-row', sets: 3, day: 3, why: 'KOS-X11: add back work (true horizontal, per XR-H/V)' },
        ],
        pickers: [
            { slot: 'main squat', options: ['low-bar-squat', 'high-bar-squat', 'safety-bar-squat'], vote: 'KOS-X1/X2' },
            { slot: 'structural squat', options: ['paused-squat', 'safety-bar-squat', 'front-squat', 'box-squat'], vote: 'KOS-X3' },
            { slot: 'hamstring', options: ['glute-ham-raise', 'nordic-curl', 'stiff-legged-deadlift'], vote: 'KOS-X6' },
            { slot: 'core', options: ['hanging-knee-raise', 'plank', 'ab-wheel', 'machine-crunch'], vote: 'KOS-V-core' },
        ],
        nonStructural: [
            'KOS-X9: the three duplicate paused-bench slots become technique / hypertrophy / heavy with their own menus',
            'KOS-X7: conventional DL at 65% with a 90% single every third week',
            'KOS-RB-F: 4-day only, no 3-day SKU; KOS-5: deload after intensity around week 7',
        ],
    },

    'gravity-is-optional': {
        votes: ['GIO-V-ham', 'GIO-V-core', 'GIO-V-pec-tri', 'GIO-RB-P'],
        edits: [
            { op: 'swap', from: 'hip-supported-db-deadlift', to: 'nordic-curl', day: 4, why: 'GIO-V-ham: GHR / Nordic added as the progression above hip-supported' },
        ],
        pickers: [
            { slot: 'hamstring', options: ['hip-supported-db-deadlift', 'glute-ham-raise', 'nordic-curl'], vote: 'GIO-V-ham' },
            { slot: 'core', options: ['hanging-leg-raise', 'hanging-knee-raise', 'ab-wheel', 'plank', 'dragon-flags', 'bench-reverse-crunch'], vote: 'GIO-V-core' },
        ],
        nonStructural: [
            'GIO-RB-I: fix T-23 system weight so pull and dip families genuinely run 3×/week',
            'GIO-RB-P: unweighted phase first, then weighted; pull-up (overhand) is the focus, chin-up belongs to Workhorse',
            'GIO-RB-A: assistance path for athletes who cannot do 5 unassisted reps',
        ],
    },

    purgatorio: {
        votes: ['PUR-RB-I', 'PUR-RB-V', 'PUR-V-map', 'PUR-RB-P', 'PUR-RB-F'],
        edits: [
            {
                op: 'rebuild',
                why: 'PUR-V-map: the voted pair table. Upper = compound + isolation on the same station; lower = never two machines, one machine + one DB/KB/BW. PUR-RB-P: peak accumulation ~90 sets, opening ~75 rather than shipping at max',
                days: [
                    {
                        name: 'Upper A', slots: [
                            ['flat-dumbbell-press', 4], ['ezbar-preacher-curl', 3],
                            ['lat-pulldown', 4], ['rope-pressdown', 3],
                            ['seated-dumbbell-shoulder-press', 4], ['leaning-one-arm-lateral-raise', 3],
                        ],
                    },
                    {
                        name: 'Upper B', slots: [
                            ['incline-dumbbell-bench-press', 4], ['dumbbell-hammer-curl', 3],
                            ['seated-cable-row', 4], ['lying-dumbbell-skullcrusher', 3],
                            ['rear-delt-rope-pulls-to-face', 3], ['single-arm-reverse-pec-deck', 3],
                        ],
                    },
                    {
                        name: 'Lower A', slots: [
                            ['hack-squat', 4], ['hack-calf-raise', 4],
                            ['lying-leg-curl', 4], ['single-leg-dumbbell-romanian-deadlift', 4],
                            ['hip-adduction', 4], ['plank', 3],
                        ],
                    },
                    {
                        name: 'Lower B', slots: [
                            ['heel-elevated-goblet-squat', 4], ['machine-hip-abduction', 4],
                            ['seated-ham-curl', 4], ['standing-dumbbell-kb-calf-raise', 4],
                            ['dumbbell-romanian-deadlift', 4], ['plank', 3],
                        ],
                    },
                ],
            },
        ],
        nonStructural: [
            'PUR-RB-R: accumulation 8–12 / 10–15; intensification compounds 5–8 or 6–10',
            'PUR-RB-M: 30X0 on compounds, isolations may drop tempo',
            'Pairing rule is a placement constraint, not a volume one — equipment must be reachable without crossing the gym',
        ],
    },

    'immaculate-restructure': {
        votes: ['IMM-V-pass', 'IMM-RB-I', 'IMM-RB-F', 'IMM-RB-P'],
        edits: [],
        nonStructural: [
            'IMM-V-pass: exercise selection follows Poliquin\'s plan — deliberately exempt from the XR variety rules',
            'IMM-RB-I: fix day-of-week so all six structural ratios can fire; add the preacher strengthRef',
            'IMM-RB-P: double progression against the ratio target; bonus sets only below 90% of target',
        ],
    },

    'overhead-dominion': {
        votes: ['OHP-V-press', 'OHP-V-tri', 'OHP-V-row', 'OHP-V-rest', 'OHP-RB-F2'],
        edits: [
            { op: 'swap', from: 'standing-barbell-military-press', to: 'incline-dumbbell-bench-press', day: 1, why: 'OHP-V-press: some military volume → incline DB / Smith incline (upper pec, still a press)' },
            { op: 'swap', from: 'hammer-upper-row', to: 'single-arm-dumbbell-row', day: 3, why: 'OHP-V-row: hammer-upper-row is a pulldown, not a row (XR-H/V)' },
            { op: 'swap', from: 'rope-pressdown', to: 'overhead-tricep-extension', day: 4, why: TRI_MIX },
        ],
        nonStructural: [
            'OHP-RB-I: Artillery becomes a real 5/3/2 wave',
            'OHP-RB-D/D2: wire the front/side/rear weekly-set dashboard widget, or delete the claim',
            'OHP-RB-F2: optional 3-day = two overhead/delt days + one upper-back maintenance day',
        ],
    },

    'hamstring-foundry': {
        votes: ['HF-V-row', 'HF-V-tri', 'HF-V-core', 'HF-V-curl', 'HF-RB-V'],
        edits: [
            { op: 'swap', from: 'hammer-upper-row', to: 'rope-cable-row', day: 1, why: 'HF-V-row: Monday needs a true horizontal pull' },
            { op: 'swap', from: 'rope-pressdown', to: 'overhead-tricep-extension', day: 1, why: TRI_MIX },
        ],
        pickers: [
            { slot: 'hinge', options: ['hip-supported-db-deadlift', 'single-leg-rdl', 'glute-ham-raise', 'nordic-curl'], vote: 'HF-RB-V (difficulty ladder chosen at onboarding)' },
            { slot: 'core', options: ['ab-wheel', 'cable-crunch', 'hanging-leg-raise'], vote: 'HF-V-core' },
        ],
        nonStructural: [
            'HF-RB-I: all three hamstring functions must actually progress (hinge, knee flexion, lengthened)',
            'HF-RB-M: 4s eccentric in Forging only; Tempering is controlled, not 4s',
        ],
    },

    'arms-race': {
        votes: ['AR-V-oh-tri', 'AR-V-chest', 'AR-V-row', 'AR-V-legs', 'AR-V-calf'],
        edits: [
            { op: 'swap', from: 'cable-triceps-extension', to: 'overhead-tricep-extension', day: 2, why: 'AR-V-oh-tri: point the Tuesday "overhead" slot at an actual overhead extension' },
            { op: 'swap', from: 'flat-dumbbell-press', to: '30-smith-incline-bench-press', day: 1, why: 'AR-V-chest: Smith incline + pec-deck, drop flat DB' },
            { op: 'swap', from: 'incline-barbell-bench-press', to: 'pec-deck', day: 3, why: 'AR-V-chest: pec-deck as the second chest slot' },
        ],
        nonStructural: [
            'AR-RB-I: fix the 3-set wallpaper without redesigning the engine',
            'AR-RB-R: heavy 4–6/6–8 on one curl and one press, 8–12 builders, 2-set myo/pump',
            'AR-V-row: hammer-upper-row stays, but it is a vertical pull — noted, not swapped',
        ],
    },

    workhorse: {
        votes: ['WH-V-hpull', 'WH-V-tri', 'WH-V-chest', 'WH-V-core', 'WH-V-ohp'],
        edits: [
            { op: 'swap', from: 'hammer-upper-row', to: 'dumbbell-seal-row', day: 3, why: 'WH-V-hpull: Thursday needs a real horizontal pull' },
            { op: 'swap', from: 'flat-dumbbell-press', to: 'pec-deck', day: 4, why: 'WH-V-chest: incline DB + hammer chest + pec-deck, drop flat DB' },
            { op: 'swap', from: 'rope-pressdown', to: 'overhead-tricep-extension', day: 3, why: TRI_MIX },
        ],
        pickers: [{ slot: 'core', options: ['ab-wheel', 'hanging-leg-raise', 'cable-crunch'], vote: 'WH-V-core' }],
        nonStructural: [
            'WH-RB-I: chin-up is the job — progress total system weight (fix T-23)',
            'WH-RB-P: chin structured powerlifting-style; builders RIR 2→1, pumps RIR 2→0',
        ],
    },

    'neural-overload': {
        votes: ['NO-V-row', 'NO-V-chest', 'NO-V-tri', 'NO-V-ham', 'XR-front'],
        edits: [
            { op: 'swap', from: 'hammer-upper-row', to: 'barbell-row', day: 1, why: 'NO-V-row: Monday → barbell row' },
            { op: 'swap', from: 'hammer-chest-press', to: 'low-to-high-cable-fly', day: 4, why: 'NO-V-chest: drop hammer chest, add an upper-chest fly' },
            { op: 'swap', from: 'rope-pressdown', to: 'overhead-tricep-extension', day: 3, why: TRI_MIX },
            { op: 'setSets', id: 'hip-supported-db-deadlift', day: 4, sets: 3, why: 'NO-V-ham: −1 hip-supported set' },
            { op: 'add', id: 'rear-delt-fly', sets: 1, day: 4, why: 'NO-V-ham: the freed set goes to the lowest-volume muscle that week' },
        ],
        pickers: [{ slot: 'front squat', options: ['front-squat', 'safety-bar-squat', 'stiletto-squat'], vote: 'XR-front' }],
        nonStructural: [
            'NO-RB-I: Overload must actually be heavier than Charge; fix the onboarding write',
            'NO-RB-T: optional speed clusters on the singles',
        ],
    },

    tenfold: {
        votes: ['TEN-V-ham-list', 'TEN-V-tri', 'TEN-V-core', 'TEN-V-vpull', 'TEN-RB-C'],
        edits: [
            { op: 'swap', from: 'rope-pressdown', to: 'overhead-tricep-extension', day: 3, why: TRI_MIX },
        ],
        pickers: [
            { slot: 'ham 10×10', options: ['seated-hamstring-curl', 'lying-leg-curl', 'dumbbell-romanian-deadlift'], vote: 'TEN-V-ham-list' },
            { slot: 'four main lifts', options: ['athlete-selected at onboarding from 10×10-capable compounds'], vote: 'TEN-RB-I/I2' },
        ],
        nonStructural: [
            'TEN-RB-C: keep the "trades a set for load" copy and stop halving accessories in Consolidation, so the copy becomes true',
            'TEN-V-vpull: chest-day hammer-upper-row stays as the vertical accessory',
        ],
    },

    'house-of-iron': {
        votes: ['HOI-V-core', 'HOI-V-calf', 'HOI-V-equip', 'HOI-RB-P'],
        edits: [
            { op: 'add', id: 'ab-wheel', sets: 2, day: 1, why: 'HOI-V-core: add a real abs slot with a bodyweight picker' },
            { op: 'add', id: 'plank', sets: 2, day: 3, why: 'HOI-V-core: second abs exposure from the picker' },
            { op: 'add', id: 'standing-dumbbell-kb-calf-raise', sets: 2, day: 2, why: 'HOI-V-calf: XR-calf — the plan shipped with no calf work at all' },
            { op: 'add', id: 'standing-dumbbell-kb-calf-raise', sets: 2, day: 4, why: 'HOI-V-calf: second calf exposure' },
            { op: 'add', id: 'pull-up', sets: 3, day: 2, why: 'HOI-V-equip: optional chin bar makes pull-up/chin-up ladder options, covering the missing vertical pull' },
        ],
        pickers: [
            { slot: 'abs', options: ['plank', 'ab-wheel', 'weighted-crunch', 'hanging-knee-raise'], vote: 'HOI-V-core' },
            { slot: 'vertical pull (if chin bar)', options: ['pull-up', 'chin-up'], vote: 'HOI-V-equip' },
        ],
        nonStructural: [
            'HOI-RB-I: fix AMRAP so push-up and close-grip actually climb the ladder',
            'HOI-RB-P: Foundation / Build / Harden must genuinely differ in ladder entry point and climb rate',
        ],
    },

    'apex-predator': {
        votes: ['APX-V-pec', 'APX-V-tri', 'APX-V-core', 'APX-V-squat'],
        edits: [
            { op: 'swap', from: 'flat-dumbbell-press', to: 'incline-dumbbell-bench-press', day: 1, why: 'APX-V-pec: flat DB → incline DB, hammer chest stays' },
            { op: 'swap', from: 'hack-squat', to: 'goblet-heel-elevated-squat', day: 1, why: 'APX-V-squat: hack → goblet → high-bar picker' },
            { op: 'swap', from: 'lateral-raise', to: 'overhead-tricep-extension', day: 1, why: 'APX-V-tri: take the triceps sets from laterals / leg extension, never from the access slots' },
            { op: 'swap', from: 'leg-extension', to: 'rope-pressdown', day: 3, why: 'APX-V-tri: second triceps slot, even mix' },
            { op: 'add', id: 'ab-wheel', sets: 2, day: 2, why: 'APX-V-core: abs picker AND the optional suitcase carry' },
        ],
        pickers: [
            { slot: 'squat', options: ['goblet-heel-elevated-squat', 'high-bar-squat'], vote: 'APX-V-squat' },
            { slot: 'abs', options: ['ab-wheel', 'hanging-knee-raise', 'plank', 'cable-crunch'], vote: 'APX-V-core' },
        ],
        nonStructural: [
            'APX-RB-I: fix the assessment save; keep retests at weeks 4/8/12',
            'APX-RB-X: drop the AI video claim from the card',
            'Access slots (ankle rock, open-book) are identity and stay untouched',
        ],
    },

    'venus-rising': {
        votes: ['VEN-V-squat', 'VEN-V-core', 'VEN-V-ham', 'VEN-V-priority', 'VEN-RB-I'],
        edits: [
            { op: 'swap', from: 'hack-squat', to: 'goblet-heel-elevated-squat', day: 1, why: 'VEN-V-squat: same picker as Apex' },
            { op: 'swap', from: 'ab-wheel', to: 'hanging-knee-raise', day: 1, why: 'VEN-V-core: rotate hanging knee raise + plank, not crunch/wheel' },
            { op: 'setSets', id: 'seated-dumbbell-shoulder-press', day: 4, sets: 2, why: 'VEN-RB-I: fix the Upper A 15–16 vs claimed 17 miscount' },
            { op: 'add', id: 'machine-hip-abduction', sets: 2, day: 3, why: 'VEN-V-priority: priorities add volume on the existing five ids — this must actually change the 4-day' },
        ],
        pickers: [{ slot: 'core', options: ['hanging-knee-raise', 'plank'], vote: 'VEN-V-core' }],
        nonStructural: ['VEN-RB-R: job lifts 8–12, isolations 12–20 / 15–25'],
    },

    athena: {
        votes: ['ATH-V-tri', 'ATH-V-core', 'ATH-V-bench', 'ATH-V-squat'],
        edits: [
            { op: 'swap', from: 'cable-triceps-extension', to: 'overhead-tricep-extension', day: 2, why: TRI_MIX },
            { op: 'swap', from: 'ab-wheel', to: 'cable-crunch', day: 3, why: 'ATH-V-core: rotate cable crunch / ab wheel' },
            { op: 'add', id: 'lateral-raise', sets: 2, day: 2, why: 'Audit §6.3: front delt outweighs side and rear roughly 3:1 — the plan\'s own ranked improvement' },
        ],
        pickers: [{ slot: 'squat family', options: ['barbell-squat', 'hack-squat', 'leg-press', 'safety-bar-squat'], vote: 'ATH-V-squat adds leg-press' }],
        nonStructural: [
            'ATH-RB-P: worse top set widens the back-off by −5%; optional AMRAP on realisation weeks',
            'Add athenaStatus to the resetProgram allowlist — the highest-consequence T-2 instance found',
        ],
    },

    kali: {
        votes: ['KALI-V-squat', 'KALI-V-pec', 'KALI-V-tri', 'KALI-V-core', 'KALI-V-ham', 'KALI-RB-X'],
        edits: [
            { op: 'swap', from: 'hack-squat', to: 'high-bar-squat', day: 1, why: 'KALI-V-squat: Earth anchor → high-bar squat' },
            { op: 'swap', from: 'hammer-chest-press', to: 'incline-dumbbell-bench-press', day: 2, why: 'KALI-V-pec: Hunt → incline DB, paused bench stays the Rebirth anchor' },
            { op: 'swap', from: 'cable-triceps-extension', to: 'overhead-tricep-extension', day: 2, why: TRI_MIX },
            { op: 'swap', from: 'ab-wheel', to: 'cable-crunch', day: 3, why: 'KALI-V-core: rotate cable crunch / ab wheel' },
        ],
        nonStructural: [
            'KALI-RB-X: no deficit toggle, volume stays ~59, rest-pause and myo only in Unleashed',
            'KALI-RB-I: fix T-23 if Hunt is a weighted pull-up',
        ],
    },

    redline: {
        votes: ['RL-V-squat', 'RL-V-hinge', 'RL-V-pec', 'RL-V-tri', 'RL-RB-V'],
        edits: [
            { op: 'swap', from: 'hack-squat', to: 'leg-press', day: 1, why: 'RL-V-squat: Pressure anchor → leg press' },
            { op: 'swap', from: 'romanian-deadlift', to: 'trap-bar-deadlift', day: 4, why: 'RL-V-hinge: Afterburn anchor → trap-bar deadlift' },
            { op: 'swap', from: 'hammer-chest-press', to: 'deficit-push-up', why: 'RL-V-pec: both hammer chest slots → deficit push-up (feet-elevated as the progression)' },
            { op: 'swap', from: 'cable-triceps-extension', to: 'overhead-tricep-extension', day: 1, why: TRI_MIX },
        ],
        nonStructural: [
            'RL-RB-I: wire the recovery check before every session — that is the plan\'s headline mechanic',
            'RL-RB-V: rebuild the pool as upper/mixed so it stops being an Iron Clock twin',
            'RL-RB-F: optional 20-minute express prune',
        ],
        open: ['REDLINE abs were never voted — it still ships two ab-wheel slots (closeout §5)'],
    },

    'iron-clock': {
        parked: true,
        votes: ['IC-V-retire', 'IC-RB-I', 'IC-RB-F', 'IC-RB-D'],
        edits: [],
        nonStructural: [
            'IC-V-retire: parked. Exercise selection gets a dedicated pass before it is viable again',
            'IC-RB-I/D: wire the density ladder, cut the opening 4-day dose off catalog-max',
            'IC-RB-F: start 3-day with the 4th optional',
        ],
        open: ['Parked — measured for completeness but excluded from portfolio conclusions'],
    },

    'the-minimum': {
        votes: ['MIN-V-squat', 'MIN-V-ham', 'MIN-V-pec', 'MIN-V-tri', 'MIN-RB-I'],
        edits: [
            { op: 'swap', from: 'romanian-deadlift', to: 'hip-supported-db-deadlift', day: 1, why: 'MIN-V-ham: Session A RDL → hip-supported DL' },
            { op: 'swap', from: 'hammer-chest-press', to: '30-smith-incline-bench-press', day: 2, why: 'MIN-V-pec: Session B → Smith incline, A keeps incline DB' },
            { op: 'swap', from: 'rope-pressdown', to: 'overhead-tricep-extension', day: 2, why: TRI_MIX },
        ],
        nonStructural: ['MIN-RB-X: bonus slots stay optional and never gate progression'],
    },

    lazarus: {
        votes: ['LAZ-V-ham', 'LAZ-V-pec', 'LAZ-V-tri', 'LAZ-V-squat', 'LAZ-RB-I'],
        edits: [
            { op: 'swap', from: 'romanian-deadlift', to: 'hip-supported-db-deadlift', day: 2, why: 'LAZ-V-ham: a stable id for the Memory Curve to key on after the swap' },
            { op: 'swap', from: 'hammer-chest-press', to: 'dip', day: 2, why: 'LAZ-V-pec: Return II → chest-dip / pec-deck picker' },
            { op: 'swap', from: 'hack-squat', to: 'goblet-heel-elevated-squat', day: 1, why: 'LAZ-V-squat: Return I → goblet → high-bar picker' },
            { op: 'swap', from: 'cable-triceps-extension', to: 'overhead-tricep-extension', day: 1, why: TRI_MIX },
        ],
        pickers: [
            { slot: 'Return II chest', options: ['dip', 'pec-deck'], vote: 'LAZ-V-pec' },
            { slot: 'Return I squat', options: ['goblet-heel-elevated-squat', 'high-bar-squat'], vote: 'LAZ-V-squat' },
        ],
        nonStructural: [
            'LAZ-RB-I: wire the Memory Curve (break months + last stable loads), write underestimated so acceleration fires',
            'LAZ-RB-F: optional 2-day for very deconditioned returns',
        ],
    },

    quadfather: {
        votes: ['QF-V-load', 'QF-V-pec', 'QF-V-tri-core', 'QF-V-ham'],
        edits: [
            { op: 'swap', from: 'hammer-chest-press', to: 'dip', day: 2, why: 'QF-V-pec: maintain hammer chest → dip, incline stays' },
            { op: 'swap', from: 'cable-triceps-extension', to: 'overhead-tricep-extension', day: 2, why: 'QF-V-tri-core: one overhead among the pressdowns' },
            { op: 'swap', from: 'ab-wheel', to: 'cable-crunch', day: 4, why: 'QF-V-tri-core: crunch/wheel rotate' },
        ],
        pickers: [{ slot: 'main load', options: ['hack-squat', 'high-bar-squat', 'leg-press', 'barbell-squat', 'stiletto-squat'], vote: 'QF-V-load' }],
        nonStructural: ['QF-RB-I: wire ROM confirm and knee-feedback swaps; keep Load / Depth / Burn roles'],
    },

    cathedral: {
        votes: ['CAT-V-squat', 'CAT-V-pec', 'CAT-V-tri', 'CAT-V-core', 'CAT-RB-I'],
        edits: [
            { op: 'swap', from: 'hack-squat', to: 'leg-press', day: 2, why: 'CAT-V-squat: Crypt → leg press' },
            { op: 'swap', from: 'cable-triceps-extension', to: 'overhead-tricep-extension', day: 1, why: 'CAT-V-tri: one cable slot → overhead, dips stay' },
            { op: 'swap', from: 'ab-wheel', to: 'cable-crunch', day: 2, why: 'CAT-V-core: crunch only, not wheel' },
        ],
        nonStructural: [
            'CAT-RB-I/I2: stand the three arches, delete the rebalancer',
            'CAT-RB-F2: optional 3-day = Upper / Lower / Stretch focus with chest every session',
        ],
    },

    blackout: {
        votes: ['BLK-V-squat', 'BLK-V-pec', 'BLK-V-tri', 'BLK-V-core', 'BLK-V-ham', 'BLK-RB-I'],
        edits: [
            { op: 'swap', from: 'hack-squat', to: 'leg-press', day: 1, why: 'BLK-V-squat: Day I hack → leg press' },
            { op: 'swap', from: 'leg-press', to: 'hack-squat', day: 2, why: 'BLK-V-squat: Day II leg press → hack (the two days swap houses)' },
            { op: 'swap', from: 'paused-bench-press', to: 'hammer-chest-press', day: 2, why: 'BLK-V-pec: paused bench → hammer chest' },
            { op: 'swap', from: 'cable-triceps-extension', to: 'overhead-tricep-extension', day: 2, why: TRI_MIX },
            { op: 'drop', id: 'romanian-deadlift', day: 1, why: 'BLK-V-ham: drop RDL, keep seated + lying curls only' },
            { op: 'add', id: 'seated-hamstring-curl', sets: 1, day: 1, why: 'BLK-V-ham: the hamstring slot becomes a curl' },
            { op: 'add', id: 'cable-crunch', sets: 1, day: 3, why: 'BLK-V-core: add one cable crunch set — the plan ships with no core at all' },
        ],
        nonStructural: [
            'BLK-RB-I/X: wire earned back-offs and a mandatory quality/stop-reason prompt. Identity is one work set',
        ],
    },

    monolith: {
        votes: ['MON-RB-F', 'MON-RB-F2', 'MON-V-press', 'MON-V-pull', 'MON-V-tri', 'MON-V-curl', 'MON-V-delt', 'MON-V-quad', 'MON-V-uni', 'MON-V-ham', 'MON-V-calf', 'MON-V-full', 'MON-V-core', 'MON-V-incline'],
        edits: [
            {
                op: 'rebuild',
                why: 'MON-RB-F/F2: default becomes 3-day Upper / Lower / Full (light machines) opening at ~60–70 sets. MON-V-*: machines-only house — hammer chest + pec-deck (no incline), hammer pulldown, machine dip primary triceps with cable overhead as the second-day swap, machine curl primary, hammer/machine shoulder press with reverse pec-deck and no laterals, leg press + leg extension with the hack squat dropped, lying curl on Lower and seated curl on Full, abduction/adduction on Full only, standing calf progressing to hack-calf, plus a cable-crunch core slot',
                days: [
                    {
                        name: 'Upper', slots: [
                            ['hammer-chest-press', 4], ['hammer-pulldown', 4],
                            ['single-arm-hammer-row', 3], ['seated-dumbbell-shoulder-press', 3],
                            ['machine-press-fly-combo', 3], ['cable-triceps-extension', 3],
                            ['cable-curl', 3], ['cable-crunch', 2],
                        ],
                    },
                    {
                        name: 'Lower', slots: [
                            ['leg-press', 4], ['leg-extension', 4],
                            ['lying-leg-curl', 3], ['single-leg-machine-hip-thrust', 3],
                            ['standing-dumbbell-kb-calf-raise', 3], ['cable-crunch', 2],
                        ],
                    },
                    {
                        name: 'Full (light)', slots: [
                            ['pec-deck', 3], ['single-arm-reverse-pec-deck', 3],
                            ['seated-hamstring-curl', 3], ['standing-dumbbell-kb-calf-raise', 3],
                            ['machine-hip-abduction', 3], ['hip-adduction', 3],
                            ['cable-triceps-extension', 2], ['cable-curl', 2],
                        ],
                    },
                ],
            },
        ],
        nonStructural: [
            'MON-RB-P: double progression on everything; MON-RB-T: no intensifiers weeks 1–6, then a drop-set on the last isolation only',
            'RB-V1b: Monolith\'s job in the clone cluster is machines + drop-sets',
            'MON-V-calf: standing default with a hack-calf progression tip (hack starts +40kg). Never seated',
        ],
    },

    atlas: {
        votes: ['ATL-V-tri', 'ATL-V-core', 'ATL-V-pec', 'ATL-RB-F', 'XR-front'],
        edits: [
            { op: 'swap', from: 'cable-triceps-extension', to: 'overhead-tricep-extension', day: 2, why: TRI_MIX },
        ],
        pickers: [{ slot: 'G2 front squat', options: ['front-squat', 'safety-bar-squat', 'stiletto-squat'], vote: 'XR-front' }],
        nonStructural: [
            'ATL-RB-I: surface the time×load score and limiter advice',
            'ATL-RB-X: wire the hinge-sub UI, optional KB power toggle, distance vs timed carries',
            'ATL-V-core/pec: wheel + carries and the flat DB press deliberately left alone',
        ],
    },

    'event-horizon': {
        votes: ['EH-V-pec', 'EH-V-tri', 'EH-V-core', 'EH-V-squat', 'EH-RB-F'],
        edits: [
            { op: 'swap', from: 'rope-pressdown', to: 'overhead-tricep-extension', day: 3, why: 'EH-V-tri: 2 overhead + 2 pressdown' },
            { op: 'swap', from: 'ab-wheel', to: 'cable-crunch', day: 4, why: 'EH-V-core: rotate cable crunch / ab wheel' },
        ],
        pickers: [{ slot: 'Lower A/B squat', options: ['hack-squat', 'leg-press'], vote: 'EH-V-squat' }],
        nonStructural: [
            'EH-RB-I: wire the region report and confirmable swaps — that is the product',
            'EH-RB-F/F3: no fixed weekdays; rotate Upper A → Lower A → Upper B → Lower B as sessions complete, up to 6 in a row',
            'EH-RB-P: replace the RPE hammers with RIR 2 → 1 → 0 → 0+intensity',
        ],
    },

    'project-chimera': {
        votes: ['CH-V-tri-core', 'CH-V-pec', 'CH-V-squat', 'CH-V-ham', 'CH-RB-F'],
        edits: [
            { op: 'swap', from: 'cable-triceps-extension', to: 'overhead-tricep-extension', day: 1, why: TRI_MIX },
            { op: 'add', id: 'cable-crunch', sets: 2, day: 1, why: 'CH-V-tri-core: add a core slot ON TOP — explicitly do not steal an isolation' },
        ],
        nonStructural: [
            'CH-RB-I: wire the confirmable reallocation after each 4-week block — that is the product',
            'CH-RB-F: free attendance capped at 4 sessions per 7 days, unlike EH/Oracle',
            'CH-RB-U: auto-apply when evidence is strong, confirm only on exercise swaps',
        ],
    },

    oracle: {
        votes: ['OR-V-pec', 'OR-V-tri', 'OR-V-core', 'OR-V-squat', 'OR-RB-V'],
        edits: [
            { op: 'swap', from: 'rope-pressdown', to: 'overhead-tricep-extension', day: 3, why: 'OR-V-tri: 2 overhead + 2 pressdown' },
            { op: 'swap', from: 'ab-wheel', to: 'cable-crunch', day: 4, why: 'OR-V-core: rotate cable crunch / ab wheel' },
            { op: 'swap', from: 'hack-squat', to: 'leg-press', day: 4, why: 'OR-V-squat: Lower B picker — Lower A already has leg press + BB squat' },
        ],
        pickers: [{ slot: 'Lower B squat', options: ['hack-squat', 'leg-press'], vote: 'OR-V-squat' }],
        nonStructural: [
            'OR-RB-I/AI: wire the scoring bands and the ±7.5% AI nudge',
            'OR-RB-P2: AI-calculated heavy 3–5 to last-set failure on compounds only, with unique compounds per day',
        ],
    },
};
