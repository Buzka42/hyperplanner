/**
 * v2-round2-map — the owner's variety assignment, layered on the vote simulation.
 *
 * Round 1 (`v2-change-map.ts`) applied the audit votes and showed the problem:
 * catalogue-wide rules gave every plan the same answer, so `overhead-tricep-
 * extension` landed in 22 plans and `cable-crunch` in 17. This round spends the
 * library instead of converging on it — each high-occurrence movement gets a
 * family of alternatives, assigned by what the plan is actually for.
 *
 * Owner's constraints, applied literally:
 *   - Incline DB press is a good exercise; only some plans move to Smith incline
 *   - Hack / standing calf raises everywhere, NO other calf movement anywhere
 *   - Overhead extension → French press where fatigue is affordable, rolling
 *     extensions on powerlifting / strength plans
 *   - Leg extension has no substitute; sissy squats (myo) or reverse Nordics
 *     are progressions layered beside it, not replacements
 *   - Seated DB press → seated barbell / seated hammer / SL landmine
 *   - Lat pulldown needs grip variety, single-arm work, prayers, pull-ups
 *   - Hammer curl mostly replaced, kept only where a superset needs a mobile
 *     implement
 *   - SA reverse pec deck → side-lying or bench-supported DB rear-delt work
 *   - Lateral raises need variation across the cable and leaning families
 *   - The four legacy powerlifting plans are exempt from all of the above:
 *     Pain & Glory, Bench Domination, Trinary, Ritual of Strength
 */

import type { LibraryExercise } from '../src/data/exercises/types';
import type { Edit } from './v2-change-map';

/** Plans the owner ruled out of the variety pass entirely. */
export const LEGACY_PL = new Set([
    'pain-and-glory', 'bench-domination', 'trinary', 'ritual-of-strength',
]);

// ---------------------------------------------------------------------------
// Movements the assignment needs that the library does not have yet
// ---------------------------------------------------------------------------

/**
 * Simulation-only entries, merged into a local resolver so the assignment can
 * be scored properly instead of being modelled with a stand-in. These are
 * proposals for the library, not shipped data — `verify:library` never sees
 * them.
 *
 * Ratings follow the same pattern/equipment derivation `buildExerciseIntelligence`
 * uses, so a proposed movement is scored on the same basis as a real one.
 */
export const PROPOSED_EXERCISES: LibraryExercise[] = [
    {
        id: 'seated-hammer-shoulder-press',
        name: { en: 'Seated Hammer Shoulder Press', pl: 'Wyciskanie barków na maszynie Hammer' },
        aliases: ['Machine Shoulder Press', 'Hammer Strength Shoulder Press'],
        pattern: 'vertical-press',
        primary: ['frontDelt'], secondary: ['sideDelt', 'triceps'],
        equipment: ['hammer-strength', 'machine'],
        weightMode: 'external', failureMode: 'muscular', status: 'active',
    },
    {
        id: 'single-arm-landmine-press',
        name: { en: 'Single-Arm Landmine Press', pl: 'Jednorącz wyciskanie landmine' },
        aliases: ['Landmine Press'],
        pattern: 'vertical-press',
        primary: ['frontDelt'], secondary: ['sideDelt', 'triceps', 'abs'],
        equipment: ['barbell'], unilateral: true,
        weightMode: 'external', failureMode: 'technical', status: 'active',
    },
    {
        id: 'machine-curl',
        name: { en: 'Machine Curl', pl: 'Uginanie ramion na maszynie' },
        aliases: ['Biceps Curl Machine'],
        pattern: 'elbow-flexion',
        primary: ['biceps'], secondary: ['brachialis'],
        equipment: ['machine'],
        weightMode: 'external', failureMode: 'muscular', status: 'active',
    },
    {
        id: 'behind-the-back-cable-lateral-raise',
        name: { en: 'Behind-the-Back Cable Lateral Raise', pl: 'Wznos bokiem z linką za plecami' },
        aliases: ['Behind the Body Cable Lateral Raise'],
        pattern: 'shoulder-abduction',
        primary: ['sideDelt'], secondary: [],
        equipment: ['cable'], unilateral: true,
        weightMode: 'external', failureMode: 'muscular', status: 'active',
    },
    {
        id: 'bench-supported-single-arm-cable-pulldown',
        name: { en: 'Bench-Supported Single-Arm Cable Pulldown', pl: 'Jednorącz ściąganie linki z podparciem o ławkę' },
        aliases: ['Supported One-Arm Cable Pulldown'],
        pattern: 'vertical-pull',
        primary: ['lats'], secondary: ['upperBack', 'biceps'],
        equipment: ['cable', 'bench'], unilateral: true,
        weightMode: 'external', failureMode: 'muscular', status: 'active',
    },
    {
        id: 'wide-grip-cable-row',
        name: { en: 'Wide-Grip Cable Row', pl: 'Wiosłowanie linka szerokim uchwytem' },
        aliases: ['Wide Grip Seated Cable Row'],
        pattern: 'horizontal-pull',
        primary: ['upperBack', 'lats'], secondary: ['rearDelt', 'biceps'],
        equipment: ['cable'],
        weightMode: 'external', failureMode: 'muscular', status: 'active',
    },
    {
        id: 'bench-supported-dumbbell-rear-delt-fly',
        name: { en: 'Bench-Supported DB Rear Delt Fly', pl: 'Odwrotne rozpiętki z podparciem o ławkę' },
        aliases: ['Chest-Supported Rear Delt Fly'],
        pattern: 'shoulder-horizontal-abduction',
        primary: ['rearDelt'], secondary: ['upperBack', 'traps'],
        equipment: ['dumbbell', 'bench'],
        weightMode: 'external', failureMode: 'muscular', status: 'active',
    },
] as LibraryExercise[];

// ---------------------------------------------------------------------------
// Set-shape rules
// ---------------------------------------------------------------------------

/**
 * A slot at one set is a gesture; a fourth set on an accessory isolation is
 * usually better spent on a second movement. Both are corrected by rule rather
 * than by a hand-written list, so the policy stays visible and arguable.
 */
export const SET_SHAPE = {
    /** Every working slot gets at least this many sets. */
    floor: 2,
    /** Isolation accessory slots are capped here unless the plan specialises in that muscle. */
    isolationCap: 3,

    /** Plans whose identity is one work set, or whose singles are the mechanic. */
    floorExempt: new Set([
        'blackout',              // BLK-RB-I: identity is one work set
        'neural-overload',       // 1-6 PAP singles are the plan
        'iron-clock',            // parked
        '30-minute-adventure',   // fractional expected-value model, not real slots
        ...LEGACY_PL,            // ME / AMRAP / top singles are the mechanic
    ]),

    /** Muscles each plan is allowed to stack 4+ accessory sets on. */
    capExempt: {
        'hamstring-foundry': ['hamstrings'],
        'arms-race': ['biceps', 'triceps'],
        'quadfather': ['quads'],
        'peachy-glute-plan': ['glutes'],
        'cathedral': ['chest'],
        'overhead-dominion': ['shoulders'],
        'workhorse': ['back'],
        'gravity-is-optional': ['back'],
        'king-of-the-squat': ['quads'],
        'tenfold': ['back', 'chest', 'quads', 'hamstrings'],  // 10×10 is the plan
        'super-mutant': ['hamstrings'],                        // reactive ~20 sets/muscle engine
    } as Record<string, string[]>,

    /** Movement patterns treated as isolation for the cap. */
    isolationPatterns: new Set([
        'knee-flexion', 'knee-extension', 'hip-abduction', 'hip-adduction',
        'elbow-flexion', 'elbow-extension', 'shoulder-abduction',
        'shoulder-horizontal-abduction', 'external-rotation', 'calf',
    ]),

    /** Carries and holds are prescribed in rounds, not sets — leave them alone. */
    skipPatterns: new Set(['carry', 'core-antirotation', 'mobility']),
};

// ---------------------------------------------------------------------------
// Variety assignment
// ---------------------------------------------------------------------------

export type Round2 = { rationale: string; edits: Edit[] };

const swap = (from: string, to: string, why: string, day?: number, limit?: number): Edit =>
    ({ op: 'swap', from, to, why, ...(day === undefined ? {} : { day }), ...(limit === undefined ? {} : { limit }) });

export const ROUND2: Record<string, Round2> = {

    // --- Machine / low-fatigue hypertrophy house -----------------------------
    monolith: {
        rationale: 'Machine house (RB-V1b). Every replacement stays on a machine or cable: the hammer shoulder press MON-V-delt already voted, a machine curl as the voted primary, and rear-delt work that is not a third pec-deck station.',
        edits: [
            swap('seated-dumbbell-shoulder-press', 'seated-hammer-shoulder-press', 'MON-V-delt: main shoulder = hammer or machine shoulder press'),
            swap('cable-curl', 'machine-curl', 'MON-V-curl: machine curl primary'),
            swap('single-arm-reverse-pec-deck', 'rear-delt-fly', 'Rear delt off the pec-deck station so Upper and Full do not share it'),
        ],
    },

    'event-horizon': {
        rationale: 'Joint-accommodating hypertrophy with a swap pool — the one plan where grip and angle variety IS the product. Smith incline gives the fixed-path option a joint-limited athlete needs, and the pulldown moves to a different grip than Oracle uses.',
        edits: [
            swap('incline-dumbbell-bench-press', '30-smith-incline-bench-press', 'Fixed path for the joint-accommodating SKU; also breaks the Blackout overlap'),
            swap('seated-dumbbell-shoulder-press', 'seated-hammer-shoulder-press', 'Machine press is the joint-friendly option'),
            swap('lat-pulldown', 'close-neutral-grip-lat-pulldown', 'Grip variety — Oracle keeps the neutral pulldown'),
            swap('hammer-curl', 'bayesian-cable-curl', 'Lengthened-position curl; hammer curls leave the clone cluster'),
            swap('lateral-raise', 'cable-lateral-raise', 'Constant tension for the joint-limited athlete', 1),
            swap('lateral-raise', 'lying-cable-lat-raise', 'Second delt angle', 3),
            swap('overhead-tricep-extension', 'french-press', 'Fatigue 3 hypertrophy plan can afford the stretch position'),
            swap('leg-extension', 'supported-sissy-squat', 'Sissy squat as the second knee-extension exposure, myo-rep capable', 4),
        ],
    },

    oracle: {
        rationale: 'Barbell anchors + machines to cut axial load (OR-RB-V), and every compound must be unique per day (OR-RB-P2). Its movements diverge from Chimera here, which is the point — they shared 85% after round 1.',
        edits: [
            swap('seated-dumbbell-shoulder-press', 'shoulder-press', 'OR-RB-V: barbell anchor on the press slot'),
            swap('hammer-curl', 'ezbar-preacher-curl', 'Fixed short-position curl, distinct from Chimera'),
            swap('cable-curl', 'straight-bar-cable-curl', 'Second curl angle'),
            swap('lat-pulldown', 'lat-prayer', 'Straight-arm pulldown is a different job to the Lower B pulldown'),
            swap('single-arm-reverse-pec-deck', 'bench-supported-dumbbell-rear-delt-fly', 'Off the pec-deck station'),
            swap('lateral-raise', 'behind-the-back-cable-lateral-raise', 'Lengthened-position lateral', 1),
            swap('lateral-raise', 'leaning-one-arm-lateral-raise', 'Second lateral angle', 3),
            swap('overhead-tricep-extension', 'rolling-dumbbell-tricep-extension', 'Strength-leaning powerbuilding SKU'),
        ],
    },

    'project-chimera': {
        rationale: 'Trap-bar squat/hinge house with six quality tags (CH-RB-V). Upper work should be inventive and must stop mirroring Oracle — free-weight and unilateral where Oracle goes barbell-and-machine.',
        edits: [
            swap('seated-dumbbell-shoulder-press', 'single-arm-landmine-press', 'CH-RB-V: inventive upper, and the unilateral quality tag earns a real movement'),
            swap('hammer-curl', 'standing-straight-bar-curl', 'Barbell curl vs Oracle preacher/cable'),
            swap('lat-pulldown', 'pull-up', 'Advanced SKU: bodyweight vertical pull rather than a fourth pulldown'),
            swap('lateral-raise', 'leaning-one-arm-lateral-raise', 'Unilateral quality tag'),
            swap('single-arm-reverse-pec-deck', 'side-lying-rear-delt-fly', 'Off the pec-deck station'),
            swap('overhead-tricep-extension', 'heavy-rolling-tricep-extension', 'Strength-leaning SKU'),
        ],
    },

    blackout: {
        rationale: 'One all-out work set per slot. Every movement must be safe and repeatable solo at maximum effort, which argues for fixed paths and against free-weight incline and hammer curls.',
        edits: [
            swap('incline-dumbbell-bench-press', '30-smith-incline-bench-press', 'A single maximal set alone is safer on a fixed path'),
            swap('seated-dumbbell-shoulder-press', 'shoulder-press', 'Strength SKU: barbell press'),
            swap('hammer-curl', 'machine-curl', 'Machine curl takes a true single set to failure safely'),
            swap('lat-pulldown', 'overhand-mid-grip-pulldown', 'Grip variety across the two pulldown days'),
            swap('lateral-raise', 'cable-lateral-raise', 'Constant tension holds up on one set'),
            swap('overhead-tricep-extension', 'rolling-dumbbell-tricep-extension', 'Strength SKU'),
            swap('single-arm-reverse-pec-deck', 'rear-delt-fly', 'Bilateral machine — one set, no side-to-side bookkeeping'),
        ],
    },

    // --- Specialisation plans ------------------------------------------------
    quadfather: {
        rationale: 'Quad specialisation. The leg-extension family earns a real progression here rather than a swap, and the arm work stops being 1-set filler.',
        edits: [
            swap('hammer-curl', 'ezbar-preacher-curl', 'Fixed short-position curl'),
            swap('lat-pulldown', 'lat-prayer', 'Straight-arm work beside the hammer pulldown'),
            swap('seated-dumbbell-shoulder-press', 'seated-hammer-shoulder-press', 'Machine press keeps upper fatigue off the quad work'),
            swap('lateral-raise', 'cable-lateral-raise', 'Constant tension'),
            swap('single-arm-reverse-pec-deck', 'bench-supported-dumbbell-rear-delt-fly', 'Off the pec-deck station'),
        ],
    },

    cathedral: {
        rationale: 'Chest specialisation at fatigue 3 — it can afford the French press, and its non-chest work should be cheap.',
        edits: [
            swap('overhead-tricep-extension', 'french-press', 'Chest spec can absorb the extra elbow stress; dips stay'),
            swap('hammer-curl', 'ezbar-preacher-curl', 'One real curl instead of two 1-set hammer slots'),
            swap('seated-dumbbell-shoulder-press', 'seated-hammer-shoulder-press', 'Machine press so shoulder work does not tax the chest days'),
            swap('lateral-raise', 'lying-cable-lat-raise', 'Lengthened-position lateral'),
            swap('single-arm-reverse-pec-deck', 'side-lying-rear-delt-fly', 'Off the pec-deck station — the plan already occupies it for chest'),
            swap('leg-extension', 'supported-sissy-squat', 'Sissy squat as the knee-extension progression on a chest plan\'s minimal leg day'),
        ],
    },

    'overhead-dominion': {
        rationale: 'Shoulder specialisation with split-delt tracking. Lateral raises are the plan\'s core work and should span the whole family, not repeat one movement.',
        edits: [
            swap('cable-lateral-raise', 'behind-the-back-cable-lateral-raise', 'Lengthened-position lateral in the spec plan that most needs the range', 1),
            swap('seated-dumbbell-lateral-raise', 'lying-cable-lat-raise', 'Fourth distinct lateral angle', 3),
            swap('single-arm-reverse-pec-deck', 'bench-supported-dumbbell-rear-delt-fly', 'Rear-delt variety in a delt specialisation'),
            swap('seated-dumbbell-shoulder-press', 'seated-hammer-shoulder-press', 'Machine press for the maintenance day, saving the barbell for spec work'),
            swap('cable-curl', 'bayesian-cable-curl', 'Lengthened curl'),
        ],
    },

    workhorse: {
        rationale: 'Back specialisation — the pulldown family should show real grip variety, and the chin-up stays the job.',
        edits: [
            swap('hammer-lower-row', 'bench-supported-single-arm-cable-pulldown', 'A single-arm pulldown adds range no bilateral machine can, and the plan already runs three hammer stations'),
            swap('reverse-curl', 'bayesian-cable-curl', 'Lengthened curl beside heavy chin work'),
            swap('seated-dumbbell-lateral-raise', 'cable-lateral-raise', 'Constant tension'),
            swap('rear-delt-fly', 'bench-supported-dumbbell-rear-delt-fly', 'Free-weight rear delt on the horizontal day', 3),
        ],
    },

    'hamstring-foundry': {
        rationale: 'Hamstring specialisation. Everything above the waist is support work and should be cheap and varied.',
        edits: [
            swap('dumbbell-hammer-curl', 'straight-bar-cable-curl', 'Cable curl instead of a hammer curl in the clone family'),
            swap('cable-curl', 'machine-curl', 'Second curl, different implement'),
            swap('seated-dumbbell-shoulder-press', 'shoulder-press', 'Barbell press — the plan already has ample machine work'),
            swap('lat-pulldown', 'close-neutral-grip-lat-pulldown', 'Grip variety'),
            swap('cable-lateral-raise', 'leaning-one-arm-lateral-raise', 'Lengthened lateral'),
        ],
    },

    'arms-race': {
        rationale: 'Arm specialisation at fatigue 2 — the one plan that should show the entire curl and extension library. Its 5-set straight-bar curl is the plan\'s driver and stays.',
        edits: [
            swap('overhead-tricep-extension', 'french-press', 'Arm spec: the EZ-bar overhead position is the point'),
            swap('dumbbell-hammer-curl', 'rope-hammer-curl', 'Keep the hammer pattern, change the implement'),
            swap('cable-triceps-extension', 'rolling-dumbbell-tricep-extension', 'Third distinct extension angle', 3),
            swap('lat-pulldown', 'bench-supported-single-arm-cable-pulldown', 'Single-arm pulldown; back work is support here'),
            swap('cable-lateral-raise', 'behind-the-back-cable-lateral-raise', 'Lengthened lateral'),
        ],
    },

    'peachy-glute-plan': {
        rationale: 'Glute specialisation. Upper-body work is maintenance and already varied; only the delt slot needs the grip pass.',
        edits: [
            swap('side-lying-rear-delt-fly', 'bench-supported-dumbbell-rear-delt-fly', 'Free-weight rear delt on a plan with little machine time'),
            swap('leg-press-calf-raise', 'standing-calf-raise', 'Calf rule: hack or standing only'),
        ],
    },

    'gravity-is-optional': {
        rationale: 'Weighted calisthenics. Cable and machine substitutes would break the house — only the calf rule and a lengthened curl apply.',
        edits: [
            swap('cable-curl', 'bayesian-cable-curl', 'The plan already uses cables on its accessory day; lengthened position is the upgrade'),
            swap('cable-lateral-raise', 'leaning-one-arm-lateral-raise', 'Second lateral angle across the two slots', 4),
        ],
    },

    // --- Clone cluster: each gets a different answer --------------------------
    kali: {
        rationale: 'Cutting / strength retention. Volume is fixed at ~59 sets (KALI-RB-X), so every slot must earn its place — this is the plan with seven 1-set slots, all of them arms and calves.',
        edits: [
            swap('incline-dumbbell-bench-press', '30-smith-incline-bench-press', 'Fixed path under a calorie deficit, where technique degrades first'),
            swap('hammer-curl', 'machine-curl', 'Machine curl under fatigue'),
            swap('lat-pulldown', 'bench-supported-single-arm-cable-pulldown', 'Single-arm pulldown beside the hammer pulldown and lat prayer'),
            swap('lateral-raise', 'cable-lateral-raise', 'Constant tension retains stimulus at lower loads', 1),
            swap('lateral-raise', 'lying-cable-lat-raise', 'Second angle', 2),
            swap('single-arm-reverse-pec-deck', 'side-lying-rear-delt-fly', 'Off the pec-deck station'),
        ],
    },

    lazarus: {
        rationale: 'Return to training. Everything should be stable, forgiving and easy to load from a low base — this is the strongest case in the catalogue for fixed paths.',
        edits: [
            swap('incline-dumbbell-bench-press', '30-smith-incline-bench-press', 'Returning lifter: fixed path while coordination comes back'),
            swap('seated-dumbbell-shoulder-press', 'seated-hammer-shoulder-press', 'Machine press for a deconditioned shoulder'),
            swap('hammer-curl', 'machine-curl', 'Machine curl — no stabiliser demand on the return'),
            swap('lat-pulldown', 'overhand-mid-grip-pulldown', 'Grip variety across the two pulldown days'),
            swap('lateral-raise', 'cable-lateral-raise', 'Constant tension at light loads'),
            swap('single-arm-reverse-pec-deck', 'rear-delt-fly', 'Bilateral machine is simpler on the return'),
            swap('leg-extension', 'reverse-nordic-curl', 'Reverse Nordic (banded / weighted) as the knee-extension progression'),
        ],
    },

    'the-minimum': {
        rationale: '2-day minimum effective dose. Nine of nineteen slots sit at one set — the set floor does most of the work here; variety is about making two sessions not feel like the same session.',
        edits: [
            swap('hammer-curl', 'ezbar-preacher-curl', 'One real curl per session, two different ones'),
            swap('cable-curl', 'bayesian-cable-curl', 'Session B curl differs from session A'),
            swap('lat-pulldown', 'close-neutral-grip-lat-pulldown', 'Grip variety'),
            swap('lateral-raise', 'cable-lateral-raise', 'Constant tension'),
            swap('seated-dumbbell-shoulder-press', 'seated-hammer-shoulder-press', 'Machine press for the beginner/intermediate SKU'),
            swap('leg-press-calf-raise', 'standing-calf-raise', 'Calf rule: hack or standing only'),
        ],
    },

    redline: {
        rationale: 'Conditioning / mixed. Seventeen of thirty-nine slots are single sets — worse than any live plan. The set floor fixes the arms; variety keeps the fast circuit interesting.',
        edits: [
            swap('hammer-curl', 'rope-hammer-curl', 'Cable is faster to change between circuit rounds'),
            swap('single-arm-hammer-row', 'bench-supported-single-arm-cable-pulldown', 'Vertical/horizontal split — the plan runs four hammer-row slots', 3),
            swap('lateral-raise', 'cable-lateral-raise', 'Constant tension in a circuit', 1),
            swap('lateral-raise', 'behind-the-back-cable-lateral-raise', 'Second angle', 4),
            swap('lateral-raise', 'behind-the-back-cable-lateral-raise', 'Third lateral angle across the four circuit days', 3),
        ],
    },

    athena: {
        rationale: 'Strength bridge, beginner-to-intermediate. Barbell where it teaches something, machines where it does not — and six 1-set slots to fix.',
        edits: [
            swap('seated-dumbbell-shoulder-press', 'shoulder-press', 'Strength bridge: teach the barbell press'),
            swap('hammer-curl', 'standing-straight-bar-curl', 'Barbell curl fits the bridge identity'),
            swap('overhead-tricep-extension', 'rolling-dumbbell-tricep-extension', 'Strength SKU'),
            swap('lateral-raise', 'leaning-one-arm-lateral-raise', 'Lengthened lateral'),
            swap('single-arm-reverse-pec-deck', 'bench-supported-dumbbell-rear-delt-fly', 'Free-weight rear delt'),
        ],
    },

    'venus-rising': {
        rationale: 'Physique: glutes, delts, back, quads. Its 4-set lateral raise blocks are spec work and stay; the 1-set arm slots are the problem.',
        edits: [
            swap('bayesian-cable-curl', 'ezbar-preacher-curl', 'One real curl instead of two 1-set slots'),
            swap('hammer-curl', 'machine-curl', 'Second session curl, different implement'),
            swap('lateral-raise', 'behind-the-back-cable-lateral-raise', 'Delt is a stated priority — spend the range', 2),
            swap('lateral-raise', 'lying-cable-lat-raise', 'Second priority-delt angle', 4),
            swap('single-arm-reverse-pec-deck', 'side-lying-rear-delt-fly', 'Off the pec-deck station'),
        ],
    },

    'apex-predator': {
        rationale: 'Assessment plan across all experience levels. Movements must be learnable and comparable between retests, which argues against exotic variations.',
        edits: [
            swap('seated-dumbbell-shoulder-press', 'single-arm-landmine-press', 'Unilateral press is a genuine assessment signal; access slots untouched'),
            swap('overhead-tricep-extension', 'single-arm-overhead-triceps-extension', 'Unilateral extension is a cleaner assessment signal than a bilateral one'),
            swap('single-arm-reverse-pec-deck', 'bench-supported-dumbbell-rear-delt-fly', 'Free-weight rear delt'),
        ],
    },

    atlas: {
        rationale: 'Full-body strength at fatigue 4 with carries. Rolling extensions are the strength-plan triceps answer; carries and the wheel stay untouched (ATL-V-core).',
        edits: [
            swap('overhead-tricep-extension', 'heavy-rolling-tricep-extension', 'Strength SKU at fatigue 4'),
            swap('hammer-curl', 'standing-straight-bar-curl', 'Barbell curl fits the barbell house'),
            swap('lateral-raise', 'leaning-one-arm-lateral-raise', 'Lengthened lateral'),
        ],
    },

    'king-of-the-squat': {
        rationale: 'Powerlifting squat specialisation — but NOT one of the four legacy plans, so the variety pass applies. Rolling extensions are the strength answer the owner named.',
        edits: [
            swap('overhead-tricep-extension', 'heavy-rolling-tricep-extension', 'Powerlifting SKU: rolling extensions'),
        ],
    },

    'neural-overload': {
        rationale: 'Advanced 1-6 PAP powerbuilding at fatigue 4. Its singles are the mechanic and are exempt from the set floor; the accessory arms are not.',
        edits: [
            swap('overhead-tricep-extension', 'heavy-rolling-tricep-extension', 'Strength SKU'),
            swap('dumbbell-hammer-curl', 'standing-straight-bar-curl', 'Barbell curl in a barbell plan'),
            swap('cable-curl', 'bayesian-cable-curl', 'Second curl, lengthened position'),
            swap('cable-lateral-raise', 'leaning-one-arm-lateral-raise', 'Lengthened lateral'),
        ],
    },

    purgatorio: {
        rationale: 'Antagonist-paired supersets. Hammer curls stay — a mobile implement beside a station is exactly the case the owner carved out. Set counts come down off the flat 4s the round-1 rebuild left.',
        edits: [
            swap('lying-dumbbell-skullcrusher', 'french-press', 'Fatigue 4 hypertrophy: the EZ overhead position is affordable, and it pairs on the same bench as the row', 2),
        ],
    },

    tenfold: {
        rationale: 'German Volume Training. The 10×10 blocks are the plan and are exempt from the cap; the accessories around them should not also be 4-set blocks.',
        edits: [
            swap('overhead-tricep-extension', 'french-press', 'Fatigue 4 SKU'),
            swap('dumbbell-hammer-curl', 'ezbar-preacher-curl', 'Fixed short-position curl'),
            swap('cable-curl', 'machine-curl', 'Second curl, different implement'),
            swap('lat-pulldown', 'assisted-pull-up', 'Vertical pull variety beside the 10×10 row'),
            swap('seated-dumbbell-lateral-raise', 'cable-lateral-raise', 'Constant tension'),
        ],
    },

    'super-mutant': {
        rationale: 'Advanced high-frequency bodybuilding at fatigue 4 with a reactive ~20 sets/muscle engine. Hamstrings are exempt from the cap; the arm pool should show more of the library.',
        edits: [
            swap('single-arm-overhead-extension', 'french-press', 'Fatigue 4 advanced SKU'),
            swap('hammer-curl', 'machine-curl', 'Third curl in the pool, different implement'),
            swap('30-incline-lying-dumbbell-curl', 'bayesian-cable-curl', 'Two lengthened curls in the pool, not two incline DB variants'),
        ],
    },

    'pencilneck-eradication': {
        rationale: 'Upper-emphasis hypertrophy, 35 distinct exercises already — the most varied plan in the catalogue. Only the calf rule and one delt angle apply.',
        edits: [
            swap('leg-press-calf-raise', 'standing-calf-raise', 'Calf rule: hack or standing only'),
            swap('rear-delt-fly', 'bench-supported-dumbbell-rear-delt-fly', 'Free-weight rear delt beside the machine one', 4),
        ],
    },

    'house-of-iron': {
        rationale: 'Minimal home equipment. Cable and machine substitutes are unavailable by definition — hammer curls stay as the mobile-implement case, and only the DB families vary.',
        edits: [
            swap('lateral-raise', 'leaning-one-arm-lateral-raise', 'Leaning lateral needs only a dumbbell and a wall'),
        ],
    },

    'immaculate-restructure': {
        rationale: 'Poliquin structural balance — exercise selection is dictated by the ratio table (IMM-V-pass). Only the calf rule applies.',
        edits: [
            swap('calf-raise', 'standing-calf-raise', 'Calf rule: hack or standing only'),
        ],
    },

    'skeleton-to-threat': {
        rationale: 'Beginner, 7 movements by design (SKEL-V-pec: do not complicate). No variety changes.',
        edits: [],
    },

    '30-minute-adventure': {
        rationale: 'Free-choice generator — variety is already its mechanic at 65 reachable movements. Only the calf rule applies, which overrides the round-1 pair that added a single-leg cable calf raise.',
        edits: [
            swap('single-leg-cable-calf-raise', 'standing-calf-raise', 'Calf rule overrides ADV-V-new-pairs'),
            swap('smith-calf-raise', 'standing-calf-raise', 'Calf rule: hack or standing only'),
            swap('standing-calf-raise-off-step', 'standing-calf-raise', 'Calf rule: hack or standing only'),
        ],
    },
};
