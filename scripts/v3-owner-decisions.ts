/**
 * v3-owner-decisions — per-plan decisions taken batch by batch with the owner.
 *
 * Layered after `v2-round2-map.ts`. Round 2 was a catalogue-wide policy pass;
 * this file is the opposite — individual judgement calls on individual plans,
 * each recorded with the reasoning that produced it so a later reader can
 * disagree with the reasoning rather than guess at it.
 *
 * Card-level changes (experience tags, fatigue ratings) do not move a measured
 * number, so they live in `CARD_CHANGES` and are reported, not simulated.
 */

import type { Edit } from './v2-change-map';

export type CardChange = {
    field: 'experience' | 'fatigue' | 'goal' | 'copy';
    from: string;
    to: string;
    why: string;
};

export type Decision = {
    batch: number;
    summary: string;
    edits: Edit[];
    cardChanges?: CardChange[];
    /**
     * Antagonist pairings, as `pair` labels the console alternates on. These do
     * not move a measured number — they buy session time — so they are recorded
     * rather than simulated.
     */
    supersets?: { day: number; pairs: [string, string][] }[];
    /** Voted or agreed, but needs engine work this simulation cannot express. */
    engineWork?: string[];
    open?: string[];
};

export const DECISIONS: Record<string, Decision> = {

    // -- Batch 1 --------------------------------------------------------------

    'pencilneck-eradication': {
        batch: 1,
        summary: 'Training content stays exactly as shipped. The plan is retagged intermediate — it was never a beginner plan at 22.8 sets a session.',
        edits: [],
        cardChanges: [
            { field: 'experience', from: 'beginner + intermediate', to: 'intermediate',
              why: 'PN-RB-I, confirmed by measurement: 22.8 sets/session and 147 weekly systemic is the second-heaviest plan in the catalogue' },
        ],
        open: [
            'The card still declares fatigue 2 against a measured band 4. Owner retagged experience only, so the fatigue rating is left as-is pending a separate call.',
            'Shoulders 22 and back 21 sit over MAV while biceps 4 and triceps 5 sit under, on a plan that sells upper emphasis. Left alone by decision — the plan stays as shipped.',
        ],
    },

    cathedral: {
        batch: 1,
        summary: 'A chest specialisation measuring in the catalogue\'s lightest quartile gets more chest work, but cheaply: a cable fly at a different angle on each of the three chest days, two sets each, plus the Smith incline promoted to a real heavy slot.',
        edits: [
            // One fly angle per chest day. D3 already runs two cable movements,
            // so it keeps the crossover and loses the duplicate mid-height fly
            // in favour of the low-to-high angle the plan has nowhere else.
            { op: 'add', id: 'low-to-high-cable-fly', sets: 2, day: 1,
              why: 'Upper-chest fly angle on the incline day — lightweight, adds stimulus without systemic cost' },
            { op: 'swap', from: 'cable-fly', to: 'mid-cable-fly', day: 3,
              why: 'Seated mid fly is a distinct angle from the crossover already on this day' },
            { op: 'add', id: 'cable-fly', sets: 2, day: 4,
              why: 'Mid-height standing fly on the flat/contracted day — third distinct angle' },
            // The Smith incline was the plan's only other pressing slot with
            // real load behind it; treat it as the second heavy anchor.
            { op: 'setSets', id: '30-smith-incline-bench-press', day: 3, sets: 4,
              why: 'Second genuinely heavy pressing slot, matching the incline DB anchor on D1' },
        ],
        engineWork: [
            'The second set of each cable fly takes a finishing technique in the later phases (drop-set or myo-reps), not from week 1 — CAT-RB-T already establishes the technique catalogue for this plan',
        ],
    },

    'king-of-the-squat': {
        batch: 1,
        summary: 'Implements KOS-X9 (three distinct bench jobs instead of three identical paused-bench slots), restores a pressing pattern the round-1 face-pull swap deleted, and reverses round 1\'s own back-volume addition in favour of the groups sitting under a growth dose.',
        edits: [
            // KOS-X9: the plan ran `paused-bench-press` on three separate days
            // at 4/5/5 sets — 14 sets of one movement, and the reason this plan
            // had the lowest exercise variety of any full-size plan.
            { op: 'swap', from: 'paused-bench-press', to: 'long-pause-bench-press', day: 1,
              why: 'KOS-X9 job 1 — power/technique: long-pause and CAT bench' },
            { op: 'swap', from: 'paused-bench-press', to: 'wide-grip-bench-press', day: 2,
              why: 'KOS-X9 job 2 — hypertrophy: athlete picks wide bench / DB bench / heavy dips' },
            // D4 keeps the competition paused bench as the heavy job (X9 job 3).

            // KOS-X10 replaced the military press with a face-pull, which left
            // shoulders at 6 direct sets. Restore a press on the lighter day
            // rather than on Tuesday after 85% bench and deadlifts, which is
            // what the vote was actually objecting to.
            { op: 'add', id: 'seated-dumbbell-shoulder-press', sets: 3, day: 3,
              why: 'Restores the pressing pattern X10 removed, on the light day rather than after heavy bench + deadlift' },

            // Round 1 read KOS-X11 as "add rowing". X11 asked for scapular
            // muscles to COUNT in volume reviews, not for more volume — and the
            // card says accessories hold the position rather than add volume.
            { op: 'drop', id: 'seated-cable-row', day: 3,
              why: 'Reverses round 1\'s own addition — KOS-X11 asked for scapular muscles to rank in reviews, not for a fourth back slot' },
            { op: 'setSets', id: 'hammer-upper-row', day: 1, sets: 4,
              why: 'Reverses round 1\'s 4→5 bump for the same reason' },

            // The freed sets go to the groups measuring under a growth dose:
            // triceps 3, calves 3, core 3.
            { op: 'setSets', id: 'heavy-rolling-tricep-extension', day: 3, sets: 4,
              why: 'Triceps sat at 3 direct sets on a plan benching four days a week' },
            { op: 'setSets', id: 'hack-calf-raise', day: 4, sets: 4,
              why: 'Calves sat at 3 direct sets — KOS-X13 keeps them Friday-only, so the one slot has to carry the dose' },
        ],
        engineWork: [
            'KOS-X9 is a menu, not a fixed list: job 1 offers long-pause + CAT, job 2 offers wide bench / DB bench / heavy dips, job 3 offers Spoto / pin / board / floor alongside the paused max. The simulation scores the default of each.',
        ],
    },

    // -- Batch 2 --------------------------------------------------------------

    kali: {
        batch: 2,
        summary: 'A cut plan should retain strength through intensity, not volume. Rather than inflating the anchors, each day gains one second movement worth pushing on — two sets, failure-safe, so it can be taken hard while dieting.',
        edits: [
            { op: 'add', id: 'leg-press', sets: 2, day: 1,
              why: 'Squat day: machine compound that can be pushed to failure safely when fatigued. Quads were the second-lowest group at 7 sets' },
            { op: 'add', id: 'pec-deck', sets: 2, day: 2,
              why: 'Press day: chest was the lowest group in the plan at 5 direct sets across four days' },
            { op: 'add', id: 'hack-squat', sets: 2, day: 3,
              why: 'Hinge day already carries a leg extension — a second pushable quad exposure rather than more posterior volume' },
            { op: 'add', id: 'dip', sets: 2, day: 4,
              why: 'Paused-bench day: second chest exposure that takes real load' },
        ],
        engineWork: [
            'KALI-RB-X confines rest-pause and myo-reps to the Unleashed phase. These four slots are the natural home for them — they are chosen to be safe to push, which is the whole point.',
        ],
        open: [
            'Volume consequence: 66 → 74 sets. KALI-RB-X froze the plan at ~59, and the round-2 set floor had already taken it to 66. If the cut identity needs the total back down, the cheapest trim is the four 2-set lateral and curl slots, not these.',
        ],
    },

    blackout: {
        batch: 2,
        summary: 'Card corrections only. The training content is coherent and stays untouched — the ratings were describing a different plan.',
        edits: [],
        cardChanges: [
            { field: 'fatigue', from: '3', to: '2',
              why: 'Measures band 1 at 29 weekly systemic and 7.7 sets/session. Even executed perfectly, 23 weekly sets does not accumulate band-3 recovery cost — what it costs is effort, which the copy should say instead of the number' },
            { field: 'experience', from: 'advanced', to: 'intermediate',
              why: 'One set to failure per movement is a low-volume, hard-to-overreach structure. The real gate is judging true failure, not training age' },
        ],
        engineWork: [
            'BLK-RB-I and BLK-RB-X remain the real dependency: earned back-offs plus a mandatory stop-reason and quality prompt. Until they ship, nothing enforces that the single set is all-out, and no set-count change can substitute.',
        ],
    },

    'iron-clock': {
        batch: 2,
        summary: 'Hidden from the catalogue. Parked was not enough — 24 of its 28 slots carry a single set because the density ladder that was meant to make them meaningful is unwired, so what ships is a thin plan wearing a conditioning label.',
        edits: [],
        cardChanges: [
            { field: 'copy', from: 'listed in the catalogue', to: 'hidden from the catalogue',
              why: 'Owner decision, batch 2. Supersedes the IC-V-retire "do not hide until PROC-1" line: every week it stays visible is a week it can be selected' },
        ],
        engineWork: [
            'Registry change: remove from the onboarding catalogue while leaving PLAN_REGISTRY intact so existing athletes are not stranded mid-plan.',
            'If it returns, IC-RB-V already split the territory: Iron Clock owns lower-body density, REDLINE owns upper/mixed. That would also clear the last clone pair in the portfolio.',
        ],
    },

    // -- Batch 3: the over-three flags ----------------------------------------
    //
    // Owner rule: a 4-set block behind the day's opener is two exercises'
    // worth of work in one slot. Total sets are kept; the block is split into
    // two distinct movements for the same body part at 2 sets each.

    'event-horizon': {
        batch: 3,
        summary: 'Both 4-set second compounds split into two movements. Keeps the volume, doubles the angles — which is what a joint-accommodating swap-pool plan should be doing anyway.',
        edits: [
            { op: 'setSets', id: 'single-arm-hammer-row', day: 1, sets: 2,
              why: 'Half of the D1 row block' },
            { op: 'add', id: 'dumbbell-seal-row', sets: 2, day: 1,
              why: 'Chest-supported row is the second horizontal angle, and the most joint-friendly option in the family' },
            { op: 'setSets', id: 'hammer-chest-press', day: 3, sets: 2,
              why: 'Half of the D3 press block' },
            { op: 'add', id: 'machine-press-fly-combo', sets: 2, day: 3,
              why: 'Second chest angle on a fixed path — the plan already runs pec-deck here, so this is the press half' },
        ],
    },

    oracle: {
        batch: 3,
        summary: 'Both 4-set second compounds split. OR-RB-P2 wants unique compounds per day, so the partners are movements the plan does not already use elsewhere.',
        edits: [
            { op: 'setSets', id: 'single-arm-hammer-row', day: 1, sets: 2,
              why: 'Half of the D1 row block' },
            { op: 'add', id: 'seated-cable-row', sets: 2, day: 1,
              why: 'Bilateral cable row as the second horizontal angle — distinct from the unilateral hammer row' },
            { op: 'setSets', id: 'hammer-pulldown', day: 3, sets: 2,
              why: 'Half of the D3 pulldown block' },
            { op: 'add', id: 'bench-supported-single-arm-cable-pulldown', sets: 2, day: 3,
              why: 'Single-arm vertical pull for the range a bilateral machine cannot reach' },
        ],
    },

    'project-chimera': {
        batch: 3,
        summary: 'Both 4-set second compounds split, using the trap-bar/free-weight house and the unilateral quality tag rather than adding more machine work.',
        edits: [
            { op: 'setSets', id: 'single-arm-hammer-row', day: 1, sets: 2,
              why: 'Half of the D1 row block' },
            { op: 'add', id: 'bench-supported-one-arm-dumbbell-row', sets: 2, day: 1,
              why: 'Free-weight supported row — second horizontal angle, and it serves the unilateral quality tag' },
            { op: 'setSets', id: 'incline-dumbbell-bench-press', day: 3, sets: 2,
              why: 'Half of the D3 press block' },
            { op: 'add', id: '30-smith-incline-bench-press', sets: 2, day: 3,
              why: 'Second incline angle on a fixed path, so the free-weight and guided versions both get worked' },
        ],
    },

    monolith: {
        batch: 3,
        summary: 'One set off the hammer pulldown, per owner decision. The machine house keeps its two 4-set openers on the lower day.',
        edits: [
            { op: 'setSets', id: 'hammer-pulldown', day: 1, sets: 3,
              why: 'Owner decision: drop the extra set rather than split — D1 already carries a second row' },
        ],
    },

    'super-mutant': {
        batch: 3,
        summary: 'The single-leg machine hip thrust was 4 sets in every session — 20 weekly sets of one accessory on a plan running five days. Split into two unilateral movements at 2 sets each, per the owner’s replacements.',
        edits: [
            { op: 'swap', from: 'single-leg-machine-hip-thrust', to: 'front-foot-elevated-bulgarian-split-squat',
              why: 'Owner replacement 1 — single-leg FFE Bulgarian split squat' },
            { op: 'setSets', id: 'front-foot-elevated-bulgarian-split-squat', sets: 2,
              why: 'Half the old block' },
            { op: 'add', id: 'dumbbell-walking-lunge', sets: 2, day: 1,
              why: 'Owner replacement 2 — walking lunges' },
            { op: 'add', id: 'dumbbell-walking-lunge', sets: 2, day: 2, why: 'Same, session 2' },
            { op: 'add', id: 'dumbbell-walking-lunge', sets: 2, day: 3, why: 'Same, session 3' },
            { op: 'add', id: 'dumbbell-walking-lunge', sets: 2, day: 4, why: 'Same, session 4' },
            { op: 'add', id: 'dumbbell-walking-lunge', sets: 2, day: 5, why: 'Same, session 5' },
        ],
        open: [
            'Both replacements are lunge-pattern (quads + glutes) where the hip thrust was pure hip extension, so glute volume shifts toward quads. Deliberate per the owner’s choice, but worth watching against the reactive ~20 sets/muscle engine.',
        ],
    },

    'hamstring-foundry': {
        batch: 3,
        summary: 'The D3 row block split, same treatment as the clone-family plans. Hamstrings are the specialisation; the upper day is support work and should not stack a 4-set block behind a 4-set press.',
        edits: [
            { op: 'setSets', id: 'hammer-lower-row', day: 3, sets: 2,
              why: 'Half the D3 row block' },
            { op: 'add', id: 'rope-cable-row', sets: 2, day: 3,
              why: 'Owner-chosen partner. Already the Monday row (HF-V-row), so this is a second weekly exposure rather than a new movement' },
        ],
    },

    'overhead-dominion': {
        batch: 3,
        summary: 'The D3 row block split. D1’s weighted chin-up stays the plan’s pull anchor; this was a second 4-set row sitting behind a 4-set braced press on the same day.',
        edits: [
            { op: 'setSets', id: 'single-arm-dumbbell-row', day: 3, sets: 2,
              why: 'Half the D3 row block' },
            { op: 'add', id: 'lat-prayer', sets: 2, day: 3,
              why: 'Owner-chosen partner. Straight-arm pulldown is a different job to the row, and new to this plan' },
        ],
    },

    // -- Batch 4: the beginner-facing plans -----------------------------------

    'house-of-iron': {
        batch: 4,
        summary: 'Plan content stays exactly as it is. The card was understating what a one-implement plan asks of a beginner, and understating its cost.',
        edits: [],
        cardChanges: [
            { field: 'fatigue', from: '2', to: '3',
              why: 'Measures band 3 at 118 weekly systemic and 1.79/set. The RDL, staggered RDL and single-leg RDL are all systemic 3, and the plan has no machine work to offset them' },
            { field: 'copy', from: 'prerequisite: at least one adjustable or moderately heavy implement',
              to: 'prerequisite: at least one adjustable or moderately heavy implement — and the ability to hold a solid position under load, because every movement here is unilateral or unsupported with no machine to fall back on',
              why: 'Stability demand 2.32 is the highest in the catalogue and 97% of sets are on movements not rated safe to take to failure. Inherent to the format, so the card should name it rather than the plan change' },
        ],
    },

    'apex-predator': {
        batch: 4,
        summary: 'Left as-is by owner decision. The under-dosed groups are the honest consequence of an assessment block and the card already says so.',
        edits: [],
        open: [
            'The single-arm landmine press added in round 2 carries failureSuitability "avoid" on a plan open to beginners. Left in place by decision; worth revisiting if the assessment slots ever get a technical-demand review.',
        ],
    },

    'venus-rising': {
        batch: 4,
        summary: 'Re-aimed as an entry-level plan rather than a physique specialisation. The lower-body emphasis stays — that is what the plan is for — but every slot is re-picked so technique is never the limiter: nothing above stability 2, machine and cable versions where a free-weight version was only harder rather than better, and the two holes (back, core) filled.',
        edits: [
            // D1 — the hardest balance demand in the plan sat on day one.
            { op: 'swap', from: 'front-foot-elevated-bulgarian-split-squat', to: 'leg-press', day: 1,
              why: 'Stability 3, the highest demand in the plan, on the first session. Leg press loads quads and glutes hard with no balance cost — the single biggest barrier removed' },
            { op: 'swap', from: 'hanging-knee-raise', to: 'cable-crunch', day: 1,
              why: 'A hanging raise makes grip and shoulder endurance the limiter before the abs are worked. Cable crunch is loadable and progresses cleanly' },

            // D2 — two skill-heavy isolations replaced with the versions that
            // teach the same job without the setup problem.
            { op: 'swap', from: 'behind-the-back-cable-lateral-raise', to: 'cable-lateral-raise', day: 2,
              why: 'The behind-the-back setup is a nuance for someone who already trains delts. Straight cable lateral is the same constant tension, learnable in one session' },
            { op: 'swap', from: 'overhead-tricep-extension', to: 'rope-pressdown', day: 2,
              why: 'Overhead extension is an elbow-position skill and rates advanced-only. The pressdown is the entry-level triceps movement and is failure-safe' },

            // D3 — keep the hinge as a taught skill, lose the spine load.
            { op: 'swap', from: 'romanian-deadlift', to: 'cable-romanian-deadlift', day: 3,
              why: 'The hinge is worth teaching, the axial cost is not: RDL is stability 2 / systemic 3 / axial 3, the cable version is 1 / 2 / 1 and the cable line gives the athlete the hip-back cue for free' },
            { op: 'swap', from: 'deficit-reverse-lunge', to: 'b-stance-hip-thrust', day: 3,
              why: 'A deficit adds range and balance demand to a lunge a beginner is still learning. B-stance hip thrust keeps the unilateral glute job, failure-safe and stable' },

            // D4 — fix the two holes: a third distinct pull, and a machine press.
            { op: 'swap', from: 'single-arm-hammer-row', to: 'hammer-pulldown', day: 4,
              why: 'The plan ran the same single-arm row on two days and had only two distinct pulls. Back sat at 9 sets, below chest — a vertical pull adds the missing pattern' },
            { op: 'swap', from: 'seated-dumbbell-shoulder-press', to: 'seated-hammer-shoulder-press', day: 4,
              why: 'Overhead pressing is where beginners most often load a position they cannot hold. The machine version keeps the pattern and removes the risk' },
            { op: 'swap', from: 'lying-cable-lat-raise', to: 'seated-cable-row', day: 4,
              why: 'With the specialisation framing dropped, delts at 13 sets were serving the old priority list while back sat at 9 — below chest. Trading the third lateral for a third distinct row puts back in the growth band at 12 and leaves shoulders at 10, still the second-largest dose in the plan' },
            { op: 'add', id: 'plank', sets: 2, day: 4,
              why: 'Core sat at 2 sets a week, the lowest in the catalogue outside Blackout. A second exposure on a different pattern to the D1 crunch' },
        ],
        cardChanges: [
            { field: 'goal', from: 'hypertrophy + specialisation', to: 'hypertrophy + general',
              why: 'Owner: this is an entry-level plan, not a specialisation. It declared no specialisation group in PLAN_RULES anyway, so nothing was checking the claim' },
            { field: 'copy', from: '"Physique priorities you choose once, held inside a hard weekly set cap."',
              to: 'a first structured plan — lower-body led, machine and cable led, with the priorities you pick once held inside a weekly set cap',
              why: 'The mechanic is unchanged; the framing should say who it is for' },
        ],
        engineWork: [
            'VEN-RB-I still stands: the five priority ids must actually change the 4-day, not just the 3-day.',
        ],
        open: [
            'The RDL swap supersedes VEN-V-ham ("Leave RDL"). That vote was taken under the physique-specialisation framing; under an entry-level brief the barbell RDL is the most technical and most axially expensive movement in the plan. Say the word and it goes back.',
        ],
    },

    // -- Batch 5: the on-ramp and return cluster ------------------------------

    athena: {
        batch: 5,
        summary: 'Left as-is by owner decision. The strongest-built plan in the catalogue keeps its shape, including the axial stack on D1.',
        edits: [],
        open: [
            'Axial sits at 49 (0.71/set, third highest in the catalogue against a 0.38 median), driven by a 4-set barbell squat followed by a 3-set RDL on D1 and a second RDL plus paused squat on D3. Deliberate for a strength bridge; worth knowing the prerequisite is only "basic barbell competence".',
            'Two leaning one-arm lateral raises at stability 3 are the most technical isolations in a plan whose other isolations are all machine or cable.',
        ],
    },

    'the-minimum': {
        batch: 5,
        summary: 'Left as-is by owner decision. It stays a true minimum: every slot at two sets, no compound premium.',
        edits: [],
        open: [
            'Zero groups sit in a growth band and every one of the 19 slots carries exactly 2 sets. Both are honest for a declared 2-day MEV plan (MIN-RB-I) and the card says so — recorded so a later reader does not read it as an oversight.',
        ],
    },

    lazarus: {
        batch: 5,
        summary: 'A return plan should not have its most technical movement be its only core work, and D3 should not be six slots with no pressing. Both fixed; the exercise house round 2 built — machine and fixed-path throughout — is otherwise right for the job.',
        edits: [
            { op: 'swap', from: 'ab-wheel', to: 'cable-crunch', day: 1,
              why: 'The ab wheel is stability 3, the single most demanding movement left in the plan, and it was the only core work. Cable crunch is loadable and progresses with a returning lifter' },
            { op: 'add', id: 'machine-press-fly-combo', sets: 3, day: 3,
              why: 'D3 ran six slots and 15 sets with no pressing pattern at all. A press/fly machine is the right fit for a return, and it keeps Lazarus off the pec-deck that Blackout, Monolith and Event Horizon all use — adding a pec-deck here had pushed the Lazarus/Blackout overlap to 0.52' },
            { op: 'add', id: 'plank', sets: 2, day: 3,
              why: 'Second core exposure on a different pattern to the D1 crunch — core 2 to 4' },
        ],
        open: [
            'reverse-nordic-curl on D2 is tagged knee-flexion in the library but is functionally a quad movement (attribution map section 25). It is the right movement for a return — lengthened quad work at low load — so the fix belongs in the library, not the plan. Until then the measured quad dose here reads lower than it really is.',
        ],
    },

    // -- Batch 6: the high-fatigue hypertrophy group --------------------------

    purgatorio: {
        batch: 6,
        summary: 'Both Romanian deadlift blocks trimmed by a set. The pair structure and exercise selection stay as the voted map built them.',
        edits: [
            { op: 'setSets', id: 'single-leg-dumbbell-romanian-deadlift', day: 3, sets: 3,
              why: 'Stability 3 and systemic 3 — the most demanding accessory in a plan whose premise is high-rep work near failure. A set off the top' },
            { op: 'setSets', id: 'dumbbell-romanian-deadlift', day: 4, sets: 3,
              why: 'Matches the D3 trim and pulls glutes back off the only over-MAV figure in the plan' },
        ],
        open: [
            'The card declares fatigue 4 and the plan measures 3. PUR-RB-P deliberately ramped it off catalogue-max (systemic 151 to 125), so the rating and the plan now disagree by one band — either is defensible, neither has been chosen.',
            'Chest 8, back 8 and quads 8 sit under a growth dose while glutes lead. Left alone by decision: the pair map is what the plan is, and rebalancing it would mean reopening PUR-V-map.',
        ],
    },

    tenfold: {
        batch: 6,
        summary: 'D4 was the longest session in the plan at 29 sets, immediately after 100 reps of seated hamstring curl. Trimmed to 24 by cutting two accessories to two sets and dropping the hinge.',
        edits: [
            { op: 'setSets', id: 'cable-lateral-raise', day: 4, sets: 2,
              why: 'Accessory trim on the plan’s longest day' },
            { op: 'setSets', id: 'standing-calf-raise', day: 4, sets: 2,
              why: 'Same — calves still get three sets on D2' },
            { op: 'drop', id: 'hip-supported-db-deadlift', day: 4,
              why: 'A systemic-3 hinge stacked behind a 10-set hamstring block is the worst-placed slot in the plan' },
        ],
        open: [
            'Dropping the hip-supported deadlift removes the plan’s only hinge pattern. Hamstrings stay well covered by the 10x10 seated curl, but the plan now trains knee flexion without hip extension — deliberate given the day it sat on, worth knowing.',
        ],
    },

    'gravity-is-optional': {
        batch: 6,
        summary: 'Left as-is by owner decision. One of the best-balanced plans in the catalogue: eight groups in a growth band, everything trained twice weekly, and the lowest spine load anywhere.',
        edits: [],
        open: [
            'Axial 12 (0.15/set) is the lowest in the catalogue — correct for a calisthenics plan and worth stating as a selling point rather than leaving implicit.',
            'Shoulders at 5 sets is the lowest group and the plan has no vertical press at all. Deliberate per GIO-V-pec-tri (bodyweight house, no cable or dumbbell mandate) — the card could say so.',
            'Goblet skater squat (stability 3) sits on D2 while the more stable heel-elevated goblet squat sits on D3. Swapping them was proposed and declined.',
        ],
    },

    // -- Batch 7: the remaining specialisation plans --------------------------

    workhorse: {
        batch: 7,
        summary: 'A back specialisation had shoulders at 16 sets against back at 17, on a plan whose card says it is not for someone who wants a pressing-led block. D1 was also the shortest session with a single back movement.',
        edits: [
            { op: 'add', id: 'hammer-lower-row', sets: 3, day: 1,
              why: 'Second back pattern behind the heavy chin, on the shortest day in the plan. Back 17 to 20, clearing shoulders by a proper margin' },
        ],
    },

    quadfather: {
        batch: 7,
        summary: 'Core moves off the burn day and onto two exposures. The plan is otherwise the best-executed specialisation in the catalogue: Load / Depth / Burn are genuinely three different sessions, and it carries the widest movement pool of any specialisation plan.',
        edits: [
            { op: 'drop', id: 'cable-crunch', day: 4,
              why: 'Relocated. Core was a single 2-set slot on the last day' },
            { op: 'add', id: 'cable-crunch', sets: 2, day: 1,
              why: 'First core exposure, on the load day' },
            { op: 'add', id: 'cable-crunch', sets: 3, day: 3,
              why: 'Second, heavier core exposure on the depth day. Core 2 to 5' },
        ],
        engineWork: [
            'Library fixed in this pass: reverse-nordic-curl was classified knee-flexion with hamstrings primary. It is knee EXTENSION under a lengthened quad, so it is now pattern knee-extension with quads primary. This corrects the measured quad dose here and on Lazarus and Bench Domination.',
        ],
        open: [
            'stripper-squat carries shortenedBias 3 while being a lengthened-position quad movement. Not touched: a separate library review call.',
        ],
    },

    'arms-race': {
        batch: 7,
        summary: 'Full overhaul. The plan becomes a three-session rotation run every other day rather than a fixed weekly split, with the old heavy day relocated to the end as an optional fourth "go nuclear" session. Set counts come off the flat 3-set template, and no biceps movement repeats inside the regular rotation.',
        edits: [
            {
                op: 'rebuild',
                why: 'Reorders the week, rebuilds the nuclear day around two giant sets, breaks the 3-set wallpaper (AR-RB-I asked for exactly this and round 1 only half-did it), and removes every duplicated biceps movement from the D1-D3 rotation',
                days: [
                    {
                        // Old D2. French press becomes a 4-set close-grip bench and
                        // the pressdown drops to 2, per the owner worked example.
                        name: 'Volume + Legs', slots: [
                            ['close-grip-bench-press', 4], ['rope-hammer-curl', 4],
                            ['reverse-curl', 3], ['rope-pressdown', 2],
                            ['hack-squat', 3], ['standing-calf-raise', 3],
                            ['hip-supported-db-deadlift', 2],
                        ],
                    },
                    {
                        // Old D3. The lengthened day gets the fourth set on its two
                        // lengthened-position movements; support work comes down.
                        name: 'Lengthened', slots: [
                            ['bayesian-cable-curl', 4], ['rolling-dumbbell-tricep-extension', 4],
                            ['30-incline-lying-dumbbell-curl', 3], ['french-press', 2],
                            ['bench-supported-single-arm-cable-pulldown', 3], ['pec-deck', 2],
                            ['behind-the-back-cable-lateral-raise', 2],
                        ],
                    },
                    {
                        // Old D4. Straight-bar curl and skullcrushers hold at 4 as
                        // instructed. The repeated rope hammer curl and rope pressdown
                        // become a machine curl and a triangle pushdown.
                        name: 'Pump', slots: [
                            ['standing-straight-bar-curl', 4], ['lying-dumbbell-skullcrusher', 4],
                            ['machine-curl', 3], ['triangle-pushdown', 2],
                            ['heel-elevated-goblet-squat', 3], ['standing-calf-raise', 3],
                            ['cable-crunch', 3], ['seated-ham-curl', 2],
                        ],
                    },
                    {
                        // Old D1, now the optional fourth session. The two 5-set arm
                        // slots become the two giant sets; the rest of the day stands.
                        name: 'Go Nuclear (optional)', slots: [
                            ['bodyweight-dip', 2], ['rolling-dumbbell-tricep-extension', 2],
                            ['banded-ezbar-bar-skullcrushers', 2],
                            ['30-incline-lying-dumbbell-curl', 2],
                            ['30-smith-incline-bench-press', 3], ['hammer-upper-row', 3],
                            ['rear-delt-fly', 2],
                        ],
                    },
                ],
            },
        ],
        cardChanges: [
            { field: 'copy', from: 'four days a week, fixed weekly split',
              to: 'a three-session rotation run every other day, with an optional fourth go-nuclear session',
              why: 'Owner decision. Supersedes AR-RB-F ("4-day only") because the rotation is no longer keyed to the calendar week' },
        ],
        engineWork: [
            'Scheduling: D1-D3 run as a rolling every-other-day rotation rather than on fixed weekdays. Same free-attendance scheduler EH and Oracle use (EH-RB-F), with a three-card deck instead of four.',
            'Go Nuclear is athlete-initiated, not scheduled. On starting it, show a required acknowledgement: take at least one or two full days off before the next session.',
            'Tricep giant set is a verbatim copy of the Bench Domination one: 2 rounds of bodyweight dips x5, rolling DB tricep extensions x10, banded EZ-bar skullcrushers x15, last round to failure. Shared component, so build it once and reference it from both plans.',
            'Biceps giant set: one extended myo-rep set of the 30-degree incline-lying DB curl targeting 30-40 total reps, finished with 3-4 cheat eccentric-only reps. Load is suggested as a percentage of what the athlete used for the same lift on the Lengthened day, so it needs to read that session logged weight.',
        ],
        open: [
            'Volume reads differently depending on whether the nuclear day runs: 65 sets across the regular three sessions, 81 with the fourth. The measured figures score the four-day case so they stay comparable with the previous 86-set measurement.',
            'The two giant sets are modelled as their component movements at 2 sets each, which is what the athlete actually performs. Effective stimulus is lower than the raw count suggests, since the rounds run continuous to failure.',
            'The incline-lying DB curl appears on both the Lengthened day and the nuclear day. That is deliberate, because the nuclear load is prescribed as a percentage of it, and is the one sanctioned exception to the no-repeated-biceps-movement rule.',
        ],
    },

    // -- Batch 8: the last non-legacy plans -----------------------------------

    redline: {
        batch: 8,
        summary: 'Every one-set slot goes to two. The timed finishers were exempt from the round-2 floor because a block has no second set to add, but the owner rule is that no exercise runs at one set, and three muscle groups were living on a single block a week.',
        edits: [
            // D1
            { op: 'setSets', id: 'rope-hammer-curl', day: 1, sets: 2, why: 'No single-set slots' },
            { op: 'setSets', id: 'overhead-tricep-extension', day: 1, sets: 2, why: 'Triceps were at 2 sets for the week' },
            { op: 'setSets', id: 'kettlebell-swing', day: 1, sets: 2, why: 'No single-set slots' },
            { op: 'setSets', id: 'farmer-carry', day: 1, sets: 2, why: 'Two rounds of the carry finisher' },
            // D2
            { op: 'setSets', id: 'hack-calf-raise', day: 2, sets: 2, why: 'Calves were at 2 sets for the week' },
            { op: 'setSets', id: 'ab-wheel', day: 2, sets: 2, why: 'Core was at 2 sets for the week' },
            { op: 'setSets', id: 'goblet-heel-elevated-squat', day: 2, sets: 2, why: 'No single-set slots' },
            { op: 'setSets', id: 'push-up', day: 2, sets: 2, why: 'No single-set slots' },
            { op: 'setSets', id: 'farmer-carry', day: 2, sets: 2, why: 'Two rounds of the carry finisher' },
            // D3
            { op: 'setSets', id: 'rope-hammer-curl', day: 3, sets: 2, why: 'No single-set slots' },
            { op: 'setSets', id: 'kettlebell-swing', day: 3, sets: 2, why: 'No single-set slots' },
            { op: 'setSets', id: 'deficit-reverse-lunge', day: 3, sets: 2, why: 'No single-set slots' },
            { op: 'setSets', id: 'deficit-push-up', day: 3, sets: 2, why: 'No single-set slots' },
            // D4
            { op: 'setSets', id: 'cable-triceps-extension', day: 4, sets: 2, why: 'Second triceps exposure of the week' },
            { op: 'setSets', id: 'hack-calf-raise', day: 4, sets: 2, why: 'Second calf exposure of the week' },
            { op: 'setSets', id: 'ab-wheel', day: 4, sets: 2, why: 'Second core exposure of the week' },
            { op: 'setSets', id: 'farmer-carry', day: 4, sets: 2, why: 'Two rounds of the carry finisher' },
        ],
        supersets: [
            // Pair labels only — the console alternates A1/A2 (see
            // features/workout/superset.ts). Volume is unchanged; this buys the
            // session time back that the set floor cost.
            { day: 1, pairs: [['incline-dumbbell-bench-press', 'single-arm-hammer-row'],
                              ['seated-hamstring-curl', 'cable-lateral-raise'],
                              ['rope-hammer-curl', 'overhead-tricep-extension']] },
            { day: 2, pairs: [['front-foot-elevated-bulgarian-split-squat', 'deficit-push-up'],
                              ['hip-supported-db-deadlift', 'single-arm-reverse-pec-deck'],
                              ['hack-calf-raise', 'ab-wheel'],
                              ['goblet-heel-elevated-squat', 'push-up']] },
            { day: 3, pairs: [['goblet-skater-squat', 'bench-supported-single-arm-cable-pulldown'],
                              ['leg-extension', 'lat-prayer'],
                              ['behind-the-back-cable-lateral-raise', 'rope-hammer-curl'],
                              ['deficit-reverse-lunge', 'deficit-push-up']] },
            { day: 4, pairs: [['deficit-push-up', 'hammer-pulldown'],
                              ['deficit-reverse-lunge', 'single-arm-hammer-row'],
                              ['behind-the-back-cable-lateral-raise', 'cable-triceps-extension'],
                              ['hack-calf-raise', 'ab-wheel']] },
        ],
        open: [
            'Triceps, calves and core each go from 2 sets a week to 4, exactly as asked. Raw cost is 65 to 82 sets and 16.3 to 20.5 per session, on a plan whose card promises forty-to-fifty minute sessions — the superset map above is what buys that time back. RL-RB-F still allows the optional twenty-minute express prune if sessions run long.',
            'The heavy anchor on each day stays straight sets, and the kettlebell swings and farmer carries stay unpaired timed blocks. Every pair follows the rule set on Purgatorio: one machine or cable plus one free-weight or bodyweight, close enough to hold both stations — which the card already warns about.',
            'Deficit push-up now appears five times across the week. RL-V-pec put it in both former hammer-chest slots and the finishers use it too. Not raised as a problem, but it is the most repeated movement in the plan.',
        ],
    },

    atlas: {
        batch: 8,
        summary: 'Left as-is by owner decision. Fatigue 4 is honest and the card already names the space requirement and the isolation trade-off.',
        edits: [],
        open: [
            'Axial 56 at 1.00 per set is the highest per-set spine load in the catalogue, nearly triple the 0.38 median. D1 alone stacks safety-bar squat, military press, single-leg RDL and farmer carry, all axially loaded. That is the plan identity rather than a defect, but the card does not say it: notForYouIf names gym space and isolation preference, not three spine-loading sessions a week.',
            'Three stability-3 slots on D1 (single-leg RDL, ab wheel, farmer carry) all fall after a 4-set safety bar squat.',
        ],
    },

    'neural-overload': {
        batch: 8,
        summary: 'Removes round 1 orphan set, which had landed as a lone rear-delt fly on the lower day and survived only because this plan is exempt from the set floor for its PAP singles. It becomes a real back slot on the bench day, and the D4 anchor becomes a picker.',
        edits: [
            { op: 'drop', id: 'rear-delt-fly', day: 4,
              why: 'Round 1 NO-V-ham took a set off the hip-supported deadlift and sent it to the lowest-volume muscle. It landed as a 1-set rear-delt fly on the lower-body day, duplicating the 3-set slot already on D3' },
            { op: 'add', id: 'wide-grip-cable-row', sets: 3, day: 1,
              why: 'Owner replacement, relocated to the bench day. Back was at 8 sets on a plan whose D3 anchor is a weighted chin-up; a real horizontal pull takes it to 11' },
        ],
        cardChanges: [
            { field: 'copy', from: 'D4 anchor is the front squat',
              to: 'D4 anchor is a picker: front squat / hack squat / stripper squat / safety-bar squat',
              why: 'Owner decision. Widens XR-front (front / SSB / stiletto) for this plan specifically, adding the hack and stripper squats so the powerbuilding day can be run without a front-rack position' },
        ],
        engineWork: [
            'wide-grip-cable-row does not exist in the library yet. Modelled here as a proposed entry alongside the other new ids.',
        ],
        open: [
            'The D4 picker is scored on its front-squat default. Choosing hack or stripper squat would drop the plan axial load materially, since front squat is axial 3 and the stripper squat is axial 1.',
        ],
    },

    // -- Batch 9: the legacy powerlifting plans, review only ------------------
    //
    // Exempt from the variety pass by owner instruction. Reviewed for defects
    // the earlier passes would not have surfaced; no exercise selection changed.

    'bench-domination': {
        batch: 9,
        summary: 'Review only. Two findings the variety passes could not reach, both about volume that does not exist rather than volume in the wrong place.',
        edits: [],
        open: [
            'ZERO direct back, biceps and triceps volume. Weighted Pull-ups prescribes 0 sets (the critical defect the audit opened with, BD-E12 votes the fix) AND the Tricep Giant Set is not a library id, so it resolves to nothing and its triceps work is invisible to every volume check in the app. Two separate causes producing the same hole.',
            'The card declares frequency 4. The template materialises SIX training days (Mon-Sat). BD-E1 makes frequency an onboarding choice and adds an option to disable one leg day, but the portfolio entry still advertises a number the default plan does not run.',
            'Chest at 28 direct sets is the single highest group dose in the catalogue, and glutes at 22 is over MAV on a bench specialisation. Both are the shape of the plan rather than errors, but nothing else in the week is inside a growth band except quads and shoulders.',
            'The two leg days are identical apart from hip adduction on one and abduction on the other (BD-E19). Fine as designed; noted so it is not read as a copy-paste error.',
        ],
    },

    'pain-and-glory': {
        batch: 9,
        summary: 'Review only. The plan is internally consistent and the round-1 push-day differentiation landed. The one thing it needs is already voted and unbuilt.',
        edits: [],
        open: [
            'Axial 90, at 1.22 per set, is the highest total spine load in the catalogue — two 10x6 deficit snatch-grip deadlift sessions a week. Entirely deliberate, and the card is honest: notForYouIf leads with "your lower back is your limiting factor".',
            'Back 28, glutes 32 and hamstrings 24 are all over MAV while chest 8, biceps 4, calves 4 and core 4 sit under. PG-11 already votes an optional fifth day for the lowest-volume body parts — that is precisely the fix, and it is unimplemented.',
            'PG-V-push worked: D2 and D3 now differ by two movements (paused bench + military vs incline DB + rear delt fly) where they used to be identical.',
            '13 distinct exercises, second lowest in the catalogue after Trinary. Expected for a deadlift specialisation running the same two sessions twice.',
        ],
    },

    trinary: {
        batch: 9,
        summary: 'Review only. Nothing measurable is wrong; the plan is largely invisible to this kind of analysis and that is the finding.',
        edits: [],
        open: [
            'Axial 2.20 per set is the highest in the catalogue — more than five times the median. That is what conjugate ME and DE work costs, and the card is advanced-only at fatigue 4.',
            'Only 3 distinct exercises materialise. Accessory work is generated per weak-point bundle and never appears in a template week, so the measured 45 sets are the barbell spine alone. No volume, variety or coverage figure for this plan can be trusted — including the "1 group in a growth band" reading.',
            'The three days render identically because the generator branches on completedWorkouts and the preview user sits at zero. The real rotation differs day to day.',
        ],
    },

    'ritual-of-strength': {
        batch: 9,
        summary: 'Review only. One genuine card defect: the advertised frequency contradicts a decision already taken.',
        edits: [],
        open: [
            'The card declares frequency 5/6. RIT-RB-F voted default 3-day with the fourth marketed as an add-on, and the plan materialises 3 days. The portfolio entry needs to read 3/4.',
            'Sessions are very lopsided: 7 sets on D1 against 24 on D3. D1 is the ME day (one max-effort bench single plus squat and deadlift work) so a short session is the point, but a 3.4x spread between the lightest and heaviest day is worth a deliberate look.',
            'Accessories are athlete-chosen (RIT-E4, up to 3x10-12 per day), so like Trinary the measured figures understate the plan. Shoulders 3, chest 7, quads 9 and hamstrings 5 all read under a growth dose and probably are not.',
        ],
    },

    // -- Batch 10: final sweep, review only -----------------------------------

    'skeleton-to-threat': {
        batch: 10,
        summary: 'Review only. The plan is exactly what SKEL-RB-I and SKEL-V-pec describe: seven movements, three identical full-body sessions, nothing to complicate.',
        edits: [],
        open: [
            'Shoulders, biceps and triceps get ZERO direct sets. Not under-dosed, absent: no overhead press, no curl, no extension anywhere in the plan. Push-ups and pulldowns cover them as secondaries only. Three of ten major groups missing is unique in the catalogue, and SKEL-V-pec explicitly protected it. If a fourth movement is ever added, a seated machine press fills all three at once.',
            'Every session is identical, which is the design rather than a template bug.',
        ],
    },

    'peachy-glute-plan': {
        batch: 10,
        summary: 'Review only. The specialisation holds cleanly and the round-1 core addition landed.',
        edits: [],
        open: [
            'Biceps and triceps get zero direct sets, but unlike Skeleton this is declared: the card leads with "not for you if you want upper-body development in the same block".',
            'D1 stacks three axially loaded squat and hinge patterns back to back (sumo deadlift, front-foot-elevated Bulgarian, barbell squat) on a plan open to beginners with no prerequisite listed. The heaviest technical day of any beginner-facing plan except Athena.',
        ],
    },

    '30-minute-adventure': {
        batch: 10,
        summary: 'Review only. On variety it outperforms everything else in the catalogue by a factor of two, and the round-2 calf rule cleaned up its one inconsistency.',
        edits: [],
        open: [
            'Sixty-three reachable movements, all ten major groups trained, ten of them twice or more. Nothing in the portfolio comes close.',
            'Fatigue declares 1 and measures 2. At roughly 20 sets and 29 systemic per session it is a real training session — but sessions are half an hour and the athlete picks the load, so 1 is defensible positioning rather than a misstatement.',
            'Round 2 removed the single-leg cable calf raise that round 1 had itself added via ADV-V-new-pairs, under the hack-or-standing-only rule.',
        ],
    },

    'immaculate-restructure': {
        batch: 10,
        summary: 'Review only, per IMM-V-pass. The best-balanced plan in the catalogue: eight of ten groups in a growth band, every group trained twice weekly, none missing, and near-identical day lengths.',
        edits: [],
        open: [
            'Back at 8 sets is one of only two under-dosed groups, despite the weighted chin-up being the 81% ratio lift. The hammer upper row at 4 is the only other back slot.',
            'single-arm-external-rotation runs on both upper days at 3 sets each. Six weekly sets of cuff work is the Poliquin 9%-ratio prescription, not an oversight.',
            'IMM-RB-I remains the real dependency: fix the day-of-week bug so all six structural ratios can fire, and add the preacher strengthRef. Without it the plan headline mechanic does not run at all.',
        ],
    },
};
