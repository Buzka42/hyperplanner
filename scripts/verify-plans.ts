// PLAN.md spec-verification harness (temporary, not part of the app).
// Asserts the concrete numbers/structures documented in PLAN.md against the
// real plan modules. Output: FAIL = code breaches spec (or crashes),
// NOTE = documented-vs-implemented discrepancy for the user to rule on.

import * as fs from 'fs';
import * as path from 'path';
import { BENCH_DOMINATION_CONFIG, BENCH_DOMINATION_PROGRAM } from '../src/data/program';
import { PENCILNECK_CONFIG, PENCILNECK_PROGRAM } from '../src/data/pencilneck';
import { SKELETON_CONFIG, SKELETON_PROGRAM } from '../src/data/skeleton';
import { PEACHY_CONFIG, PEACHY_PROGRAM } from '../src/data/peachy';
import { PAIN_GLORY_CONFIG, PAIN_GLORY_PROGRAM } from '../src/data/painglory';
import { TRINARY_CONFIG, TRINARY_PROGRAM, getBlockFromWorkout } from '../src/data/trinary';
import { RITUAL_CONFIG, RITUAL_PROGRAM } from '../src/data/ritual';
import { SUPER_MUTANT_CONFIG } from '../src/data/supermutant';
import { BADGES } from '../src/data/badges';
import { translations } from '../src/contexts/translations';

const fails: string[] = [];
const notes: string[] = [];
let checks = 0;
function check(cond: any, msg: string) { checks++; if (!cond) fails.push(msg); }
function note(msg: string) { notes.push(msg); }

const floorD = (w: number) => Math.floor(w / 2.5) * 2.5;
const ceilD = (w: number) => Math.ceil(w / 2.5) * 2.5;
const nearCap = (w: number) => { let r = Math.round(w / 2.5) * 2.5; if (r - w > 2.5) r -= 2.5; return r; };

const day = (prog: any, week: number, dow: number) => prog.weeks.find((w: any) => w.weekNumber === week)?.days.find((d: any) => d.dayOfWeek === dow);
const exByName = (d: any, name: string) => d?.exercises.find((e: any) => e.name === name || e.name.startsWith(name));

// ============================================================
// 1. BENCH DOMINATION
// ============================================================
{
    const P = 'BD';
    const cfg = BENCH_DOMINATION_CONFIG;
    const user: any = {
        id: 'u', programId: 'bench-domination', completedSessions: 0,
        stats: { pausedBench: 100, wideGripBench: 90, spotoPress: 95, lowPinPress: 88, btnPress: 40 },
        benchHistory: [],
        benchDominationModules: { tricepGiantSet: true, behindNeckPress: true, weightedPullups: true, accessories: true, legDays: true },
    };
    const pp = (week: number, dow: number, u = user) => cfg.hooks.preprocessDay(day(BENCH_DOMINATION_PROGRAM, week, dow), u);
    const cw = (ex: any, week: number, dow: number, u = user) => cfg.hooks.calculateWeight(ex.target, u, ex.name, { week, day: dow });

    check(BENCH_DOMINATION_PROGRAM.weeks.length === 16, `${P}: expected 16 weeks, got ${BENCH_DOMINATION_PROGRAM.weeks.length}`);

    // Monday structure W1
    const mon1 = pp(1, 1);
    const pb1 = exByName(mon1, 'Paused Bench Press');
    check(pb1 && pb1.sets === 4 && pb1.target.reps === '3', `${P} W1 Mon: Paused Bench should be 4x3, got ${pb1?.sets}x${pb1?.target.reps}`);
    check(pb1?.target.percentage === 0.825, `${P} W1 Mon PB perc 0.825, got ${pb1?.target.percentage}`);
    const wg1 = exByName(mon1, 'Wide-Grip Bench Press');
    check(wg1 && wg1.sets === 3 && wg1.target.reps === '6-8', `${P} W1 Mon: Wide-Grip 3x6-8, got ${wg1?.sets}x${wg1?.target.reps}`);
    const btn1 = exByName(mon1, 'Behind-the-Neck Press');
    check(btn1 && btn1.sets === 4 && btn1.target.reps === '3-5', `${P} W1 Mon: BTN 4x3-5, got ${btn1?.sets}x${btn1?.target.reps}`);
    check(!!exByName(mon1, 'Tricep Giant Set'), `${P} W1 Mon: Tricep Giant Set missing`);
    check(!!exByName(mon1, 'Dragon Flags'), `${P} W1 Mon: Dragon Flags missing`);

    // Monday percentage tiers (display weeks 5 and 10)
    check(exByName(day(BENCH_DOMINATION_PROGRAM, 5, 1), 'Paused Bench Press')?.target.percentage === 0.85, `${P} W5 Mon PB perc should be 0.85`);
    check(exByName(day(BENCH_DOMINATION_PROGRAM, 10, 1), 'Paused Bench Press')?.target.percentage === 0.875, `${P} W10 Mon PB perc should be 0.875`);

    // Wednesday structure W1
    const wed1 = pp(1, 3);
    const pbw = exByName(wed1, 'Paused Bench Press');
    check(pbw && pbw.sets === 4 && pbw.target.reps === '5-10' && pbw.target.percentage === 0.725, `${P} W1 Wed PB 4x5-10@72.5, got ${pbw?.sets}x${pbw?.target.reps}@${pbw?.target.percentage}`);
    check(exByName(day(BENCH_DOMINATION_PROGRAM, 5, 3), 'Paused Bench Press')?.target.percentage === 0.75, `${P} W5 Wed PB perc 0.75`);
    check(exByName(day(BENCH_DOMINATION_PROGRAM, 10, 3), 'Paused Bench Press')?.target.percentage === 0.775, `${P} W10 Wed PB perc 0.775`);
    const spoto = exByName(wed1, 'Spoto Press');
    check(spoto && spoto.sets === 3 && spoto.target.reps === '5', `${P} W1 Wed Spoto 3x5, got ${spoto?.sets}x${spoto?.target.reps}`);
    check(!!exByName(wed1, 'Weighted Pull-ups'), `${P} W1 Wed pull-ups missing`);
    check(!!wed1.exercises.find((e: any) => e.name.includes('Y-Raises')), `${P} W1 Wed Y-Raises missing`);

    // Thursday structure & the 65%-of-AMRAP rule
    const thu1 = pp(1, 4);
    const pbt = exByName(thu1, 'Paused Bench Press');
    check(pbt && pbt.sets === 5 && pbt.target.reps === '3-5', `${P} W1 Thu PB 5x3-5, got ${pbt?.sets}x${pbt?.target.reps}`);
    const lpp = exByName(thu1, 'Low Pin Press');
    check(lpp && lpp.sets === 2 && lpp.target.reps === '4', `${P} W1 Thu LowPin 2x4, got ${lpp?.sets}x${lpp?.target.reps}`);
    const btnT = exByName(thu1, 'Behind-the-Neck Press');
    check(btnT && btnT.sets === 4 && btnT.target.reps === '5-8', `${P} W1 Thu BTN 4x5-8, got ${btnT?.sets}x${btnT?.target.reps}`);
    check(cw(pbt!, 1, 4) === '65', `${P} Thu W1 PB weight should be 65 (100x0.65 fallback), got ${cw(pbt!, 1, 4)}`);
    const u2: any = { ...user, benchHistory: [{ date: '2026-01-08', week: 1, weight: 120, actualWeight: 67.5, actualReps: 15 }] };
    check(cw(pbt!, 2, 4, u2) === nearCap(120 * 0.65).toString(), `${P} Thu W2 PB = 65% of last AMRAP e1RM(120) = ${nearCap(78)}, got ${cw(pbt!, 2, 4, u2)}`);

    // Saturday structure
    const sat1 = pp(1, 6);
    const amrap = exByName(sat1, 'Paused Bench Press (AMRAP)');
    check(amrap && amrap.sets === 1 && amrap.target.percentage === 0.675, `${P} W1 Sat AMRAP 1 set @67.5%, got ${amrap?.sets}@${amrap?.target.percentage}`);
    const backoff = exByName(sat1, 'Paused Bench Press (Back-off)');
    check(backoff && backoff.sets === 3 && backoff.target.reps === '5', `${P} W1 Sat back-off 3x5, got ${backoff?.sets}x${backoff?.target.reps}`);

    // Legs days (Tue/Fri) and rest Sunday
    check((pp(1, 2)?.exercises.length || 0) >= 6, `${P} W1 Tue legs should have >=6 exercises`);
    const sun = day(BENCH_DOMINATION_PROGRAM, 1, 7);
    check(!sun || sun.exercises.length === 0, `${P} W1 Sun should be rest`);

    // Rounding rules: Monday nearest-with-cap, Saturday ceil
    check(cw(pb1!, 1, 1) === nearCap(100 * 0.825).toString(), `${P} Mon W1 weight nearest-cap(82.5) got ${cw(pb1!, 1, 1)}`);
    check(cw(amrap!, 1, 6) === ceilD(100 * 0.675).toString(), `${P} Sat W1 AMRAP ceil(67.5) got ${cw(amrap!, 1, 6)}`);

    // AMRAP threshold phases: +2.5 only when phase threshold met
    const mkU = (week: number, reps: number): any => ({ ...user, benchHistory: [{ date: '2026-01-08', week, weight: 100, actualWeight: 67.5, actualReps: reps }] });
    const wBase = (u: any, wk: number) => parseFloat(cfg.hooks.calculateWeight({ type: 'range', reps: '3', percentage: 1, percentageRef: 'pausedBench' } as any, u, 'Paused Bench Press', { week: wk, day: 1 })!);
    check(wBase(mkU(1, 12), 2) === nearCap(102.5), `${P} base: W1 AMRAP 12 reps should bump base to 102.5`);
    check(wBase(mkU(1, 11), 2) === nearCap(100), `${P} base: W1 AMRAP 11 reps should NOT bump base`);
    check(wBase(mkU(7, 10), 8) === nearCap(102.5), `${P} base: W7 AMRAP 10 reps should bump base (phase >=10)`);
    check(wBase(mkU(7, 9), 8) === nearCap(100), `${P} base: W7 AMRAP 9 reps should NOT bump`);
    check(wBase(mkU(10, 8), 11) === nearCap(102.5), `${P} base: W10 AMRAP 8 reps should bump (phase >=8)`);
    check(wBase(mkU(10, 7), 11) === nearCap(100), `${P} base: W10 AMRAP 7 reps should NOT bump`);
    // e1RM recalc checkpoint: W5 base = Epley(actualWeight, actualReps) of the W4 AMRAP, floored to 2.5
    const uRecalc: any = { ...user, benchHistory: [{ date: '2026-02-01', week: 4, weight: 123, actualWeight: 70, actualReps: 15 }] };
    check(wBase(uRecalc, 5) === nearCap(floorD(70 * (1 + 15 / 30))), `${P} base: W5 recalc = floor(Epley(70x15))=105, got ${wBase(uRecalc, 5)}`);

    // Warm-ups: normal heavy day 50/70/85/95; 1RM test 80/90
    const pbMon = exByName(pp(1, 1), 'Paused Bench Press');
    const wu = pbMon?.warmups?.sets.map((s: any) => parseFloat(s.weight));
    check(wu && wu[0] === 20 && wu[1] === floorD(82.5 * 0.5) && wu[2] === floorD(82.5 * 0.7) && wu[3] === floorD(82.5 * 0.85) && wu[4] === floorD(82.5 * 0.95),
        `${P} Mon warmups expected [20,${floorD(41.25)},${floorD(57.75)},${floorD(70.1)},${floorD(78.3)}], got ${JSON.stringify(wu)}`);
    const uTest: any = { ...user, benchDominationStatus: { post12WeekChoice: 'test', completedWeeks: 12 } };
    const sat13 = cfg.hooks.preprocessDay(day(BENCH_DOMINATION_PROGRAM, 13, 6), uTest);
    const testEx = sat13?.exercises.find((e: any) => e.name.toLowerCase().includes('test') || e.name.includes('1RM'));
    if (testEx?.warmups) {
        const tw = testEx.warmups.sets.map((s: any) => parseFloat(s.weight));
        const load = parseFloat(cfg.hooks.calculateWeight(testEx.target, uTest, testEx.name, { week: 13, day: 6 }) || '0') || (testEx.target.weightAbsolute ?? 0);
        if (load > 0) {
            check(tw[3] === floorD(load * 0.8) && tw[4] === floorD(load * 0.9), `${P} 1RM-test warmups should be 80%/90% of ${load}, got ${tw[3]}/${tw[4]}`);
        }
    } else {
        note(`${P}: could not locate W13 'test now' 1RM exercise with warmups (found: ${sat13?.exercises.map((e: any) => e.name).join(', ')})`);
    }

    // Deload week 9: half volume
    const mon9 = pp(9, 1);
    const pb9 = exByName(mon9, 'Paused Bench Press');
    check(pb9 && pb9.sets <= 2, `${P} W9 deload Mon PB should be half volume (<=2 sets), got ${pb9?.sets}`);

    // Module toggles remove exercises
    const uOff: any = { ...user, benchDominationModules: { tricepGiantSet: false, behindNeckPress: false, weightedPullups: false, accessories: false, legDays: false } };
    const monOff = cfg.hooks.preprocessDay(day(BENCH_DOMINATION_PROGRAM, 1, 1), uOff);
    check(!exByName(monOff, 'Tricep Giant Set') && !exByName(monOff, 'Behind-the-Neck Press') && !exByName(monOff, 'Dragon Flags'),
        `${P} modules off: Mon still contains ${monOff.exercises.map((e: any) => e.name).join(',')}`);
    const wedOff = cfg.hooks.preprocessDay(day(BENCH_DOMINATION_PROGRAM, 1, 3), uOff);
    check(!exByName(wedOff, 'Weighted Pull-ups'), `${P} modules off: Wed still has pull-ups`);
    const tueOff = cfg.hooks.preprocessDay(day(BENCH_DOMINATION_PROGRAM, 1, 2), uOff);
    check((tueOff?.exercises.length || 0) === 0, `${P} legDays off: Tue should be empty, got ${tueOff?.exercises.length}`);

    // BTN: Monday uses stored stat; Thursday 85% of Monday
    const btnMonW = parseFloat(cw(btn1!, 1, 1)!);
    const btnThuW = parseFloat(cw(btnT!, 1, 4)!);
    check(Math.abs(btnThuW - floorD(btnMonW * 0.85)) < 0.01, `${P} BTN Thu should be 85% of Mon (${btnMonW}) = ${floorD(btnMonW * 0.85)}, got ${btnThuW}`);

    // Pull-up week-11-13 auto weight = ceil(pullup1RM * .925)
    const uPull: any = { ...user, pullup1RM: 20 };
    const wed11 = cfg.hooks.preprocessDay(day(BENCH_DOMINATION_PROGRAM, 11, 3), uPull);
    const pu11 = exByName(wed11, 'Weighted Pull-ups');
    const puW = (pu11 as any)?.calculatedWeight ?? pu11?.target.weightAbsolute ?? NaN;
    check(Math.abs(puW - ceilD(20 * 0.925)) < 0.01, `${P} W11 pull-up weight should be ceil(18.5)=20, got ${puW}`);
}

// ============================================================
// 2. PENCILNECK — exercise tables vs PLAN + phase logic
// ============================================================
{
    const P = 'PN';
    const cfg = PENCILNECK_CONFIG;
    const mkUser = (cycle: number): any => ({ id: 'u', programId: 'pencilneck-eradication', stats: {}, pencilneckStatus: { cycle, startDate: '2026-01-01' }, exercisePreferences: {} });

    // PLAN.md rep-range table (W1-4). name -> [sets, reps]
    const planTable: Record<number, [string, number, string][]> = {
        1: [["Flat Barbell Bench Press", 3, "8-12"], ["Incline DB Press", 3, "10-14"], ["Cable Flyes", 3, "12-15"], ["Seated DB Shoulder Press", 3, "8-12"], ["Leaning Single Arm DB Lateral Raises", 3, "15-20"], ["Overhead Tricep Extensions", 3, "12-15"], ["Hack Squat", 3, "10-15"], ["Leg Extensions", 3, "15-20"], ["Leg Press Calf Raises", 3, "12-18"]],
        2: [["Hammer Pulldown", 3, "8-12"], ["Seated Cable Row", 3, "10-14"], ["Lat Prayer", 3, "12-15"], ["Wide Grip BB Row", 3, "10-15"], ["Side-Lying Rear Delt Flyes", 3, "15-20"], ["Preacher EZ-Bar Curls", 3, "10-15"], ["Romanian Deadlift", 3, "8-12"], ["Lying Leg Curls", 3, "12-16"], ["Hanging Leg Raises", 3, "12-20"]],
        4: [["Incline Barbell Bench Press", 3, "8-12"], ["Flat DB Press", 3, "10-14"], ["Pec-Dec", 3, "12-15"], ["Standing Barbell Military Press", 3, "8-12"], ["Leaning Single Arm DB Lateral Raises", 3, "15-20"], ["Close-Grip Bench Press", 3, "10-14"], ["Front Squats", 3, "10-15"], ["Walking Lunges", 3, "12-16"], ["Hack Calf Raises", 3, "15-20"]],
        5: [["Lat Pulldown", 3, "10-14"], ["Single-Arm Hammer Strength Row", 3, "10-14"], ["Single-Arm DB Row", 3, "12-15"], ["Rear-Delt Rope Pulls", 3, "20-30"], ["Machine Rear Delt Fly", 3, "15-20"], ["Incline DB Curls", 3, "12-15"], ["Stiff-Legged Deadlift", 3, "10-14"], ["Seated Leg Curls", 3, "12-16"], ["Ab Wheel", 3, "Failure"]],
    };
    for (const [dowStr, rows] of Object.entries(planTable)) {
        const dow = Number(dowStr);
        const d = cfg.hooks.preprocessDay(day(PENCILNECK_PROGRAM, 1, dow), mkUser(1));
        for (const [name, sets, reps] of rows) {
            const ex = d?.exercises.find((e: any) => e.name.toLowerCase().includes(name.toLowerCase().slice(0, 12)));
            if (!ex) { note(`PN W1 D${dow}: PLAN lists "${name}" — not found (day has: ${d?.exercises.map((e: any) => e.name).join(', ')})`); continue; }
            if (ex.sets !== sets || String(ex.target.reps).toLowerCase() !== reps.toLowerCase()) {
                note(`PN W1 D${dow} "${ex.name}": PLAN says ${sets}x${reps}, code has ${ex.sets}x${ex.target.reps}`);
            }
            checks++;
        }
    }
    // Heavy phase W5-8: compounds 6-10
    const d1w5 = cfg.hooks.preprocessDay(day(PENCILNECK_PROGRAM, 5, 1), mkUser(1));
    const flat5 = d1w5?.exercises.find((e: any) => e.name.includes('Flat Barbell'));
    check(flat5?.target.reps === '6-10', `${P} W5 Flat BB should be 6-10, got ${flat5?.target.reps}`);
    const flyes5 = d1w5?.exercises.find((e: any) => e.name.includes('Flyes') || e.name.includes('Pec'));
    check(flyes5 && flyes5.target.reps !== '6-10', `${P} W5 isolation (flyes) should keep high reps, got ${flyes5?.target.reps}`);
    // Intensity techniques: c1 only W7-8; c2 all weeks
    const it = (cycle: number, week: number) => {
        const d = cfg.hooks.preprocessDay(day(PENCILNECK_PROGRAM, week, 1), mkUser(cycle));
        const c = d?.exercises.find((e: any) => e.name.includes('Flat Barbell'));
        return !!(c?.intensityTechnique);
    };
    check(!it(1, 3), `${P} C1 W3 should have NO intensity technique`);
    check(it(1, 7), `${P} C1 W7 should have intensity technique`);
    check(it(2, 2), `${P} C2 W2 should have intensity technique`);
    // Week 8 final exam extras on day 4
    const w8d4 = cfg.hooks.preprocessDay(day(PENCILNECK_PROGRAM, 8, 4), mkUser(1));
    check((w8d4?.exercises.length || 0) > (cfg.hooks.preprocessDay(day(PENCILNECK_PROGRAM, 7, 4), mkUser(1))?.exercises.length || 0), `${P} W8 D4 final exam should add bonus exercises`);
}

// ============================================================
// 3. SKELETON
// ============================================================
{
    const P = 'SK';
    const cfg = SKELETON_CONFIG;
    const user: any = { id: 'u', programId: 'skeleton-to-threat', stats: {}, selectedDays: [1, 3, 5], skeletonStatus: {} };
    const d1 = cfg.hooks.preprocessDay(day(SKELETON_PROGRAM, 1, 1), user);
    const names = d1.exercises.map((e: any) => e.name);
    for (const n of ['Deficit Push-ups', 'Leg Extensions', 'Supported Stiff Legged DB Deadlift', 'Standing Calf Raises', 'Inverted Rows', 'Overhand Mid-Grip Pulldown', 'Planks'])
        check(names.includes(n), `${P}: W1 missing ${n}`);
    const ranges: Record<string, string> = { 'Leg Extensions': '12-20', 'Supported Stiff Legged DB Deadlift': '10-15', 'Standing Calf Raises': '15-20', 'Inverted Rows': '8-15', 'Overhand Mid-Grip Pulldown': '10-15' };
    for (const [n, r] of Object.entries(ranges)) check(exByName(d1, n)?.target.reps === r, `${P}: ${n} should be ${r}, got ${exByName(d1, n)?.target.reps}`);
    // late phase +1 set (except push-ups & planks)
    const d9 = cfg.hooks.preprocessDay(day(SKELETON_PROGRAM, 9, 1), user);
    check(exByName(d9, 'Leg Extensions')?.sets === 4, `${P} W9 Leg Ext should be 4 sets`);
    check(exByName(d9, 'Deficit Push-ups')?.sets === 3, `${P} W9 push-ups should stay 3 sets`);
    check(exByName(d9, 'Planks')?.sets === 3, `${P} W9 planks should stay 3 sets`);
    check(exByName(d9, 'Inverted Rows')?.sets === 3, `${P} W9 rows should be 3 sets (2+1)`);
    // rest day for unselected
    check(cfg.hooks.preprocessDay(day(SKELETON_PROGRAM, 1, 2), user).exercises.length === 0, `${P}: Tue should be rest`);
    // advice mapping
    const hist = (name: string, reps: number, weight = 20, sets = 3): any[] => [{ exercises: [{ name, setsData: Array.from({ length: sets }, () => ({ reps: String(reps), weight: String(weight), completed: true })) }] }];
    const adv = (exName: string, reps: number, weight = 20) => cfg.hooks.getExerciseAdvice(exByName(d1, exName), hist(exName, reps, weight) as any);
    check(adv('Leg Extensions', 20) === 't:tips.skeletonLegExtensionsIncrease', `${P} leg-ext advice wrong: ${adv('Leg Extensions', 20)}`);
    check(adv('Leg Extensions', 19) === null, `${P} leg-ext 19 reps should give no advice`);
    check(adv('Supported Stiff Legged DB Deadlift', 15, 12) === 't:tips.skeletonSLDLIncreaseKg', `${P} SLDL heavy advice wrong`);
    check(adv('Supported Stiff Legged DB Deadlift', 15, 8) === 't:tips.skeletonSLDLIncreaseDB', `${P} SLDL light advice wrong`);
    check(adv('Standing Calf Raises', 20) === 't:tips.skeletonCalvesSwitchSingleLeg', `${P} calves advice wrong`);
    check(adv('Inverted Rows', 15) === 't:tips.skeletonInvertedRowsDeeper', `${P} rows advice wrong`);
    check(adv('Overhand Mid-Grip Pulldown', 15) === 't:tips.skeletonPulldownIncrease', `${P} pulldown advice wrong`);
    check(String(adv('Deficit Push-ups', 12)).startsWith('t:tips.skeletonBeatLastWeek'), `${P} pushup advice wrong`);
    check(adv('Planks', 30) === 't:tips.increaseTime', `${P} planks advice wrong: ${adv('Planks', 30)}`);
    note(`SK: PLAN says Leg Extensions progression is "+7 kg"; code/translations say "+5 kg" (t:tips.skeletonLegExtensionsIncrease). Which is intended?`);
    note(`SK: PLAN says SLDL progression is flat "+1 kg each DB"; code adds "+2.5 kg" once DBs reach >=10 kg (richer rule). Confirm intended.`);
}

// ============================================================
// 4. PEACHY
// ============================================================
{
    const P = 'PY';
    const cfg = PEACHY_CONFIG;
    const user: any = { id: 'u', programId: 'peachy-glute-plan', stats: { squat: 60 }, squatHistory: [] };
    const pp = (w: number, d_: number) => cfg.hooks.preprocessDay ? cfg.hooks.preprocessDay(day(PEACHY_PROGRAM, w, d_), user) : day(PEACHY_PROGRAM, w, d_);
    const mon = pp(1, 1), wed = pp(1, 3), fri = pp(1, 5), sat = pp(1, 6);
    for (const [d, n] of [[mon, 'Sumo Deadlift'], [mon, 'Squats'], [wed, 'Kas Glute Bridge'], [wed, 'Inverted Rows'], [fri, 'Paused Squat'], [fri, 'Hip Adduction'], [sat, 'Deficit Push-ups'], [sat, 'Single Leg Machine Hip Thrust']] as any)
        check(!!exByName(d, n), `${P}: missing ${n}`);
    check(exByName(mon, 'Squats')?.target.reps === '5-10', `${P} Squats 5-10, got ${exByName(mon, 'Squats')?.target.reps}`);
    // Paused squat 80% of Monday history
    const uH: any = { ...user, squatHistory: [{ date: '2026-01-05', week: 1, weight: 62.5, actualWeight: 62.5, actualReps: 10 }] };
    const psW = cfg.hooks.calculateWeight(exByName(fri, 'Paused Squat')!.target, uH, 'Paused Squat', { week: 1, day: 5 });
    check(psW === floorD(62.5 * 0.8).toString(), `${P} Paused Squat should be floor(50)=50, got ${psW}`);
    // Weeks 9-12 drop-set note on BSS / deficit lunges
    const mon9 = pp(9, 1), sat9 = pp(9, 6);
    const bss9 = mon9.exercises.find((e: any) => e.name.toLowerCase().includes('bulgarian'));
    const drl9 = sat9.exercises.find((e: any) => e.name.toLowerCase().includes('reverse lunge'));
    check(!!(bss9?.notes && /failure|drop/i.test(String(bss9.notes))) || !!bss9?.intensityTechnique, `${P} W9 Bulgarian SS should carry drop-to-BW note; notes=${bss9?.notes}`);
    check(!!(drl9?.notes && /failure|drop/i.test(String(drl9.notes))) || !!drl9?.intensityTechnique, `${P} W9 Deficit Reverse Lunge should carry drop-to-BW note`);
    // Week 12 Saturday finisher 1x100
    const sat12 = pp(12, 6);
    const fin = sat12.exercises.find((e: any) => e.name.toLowerCase().includes('finisher') || e.name.toLowerCase().includes('pump'));
    check(!!fin && String(fin.target.reps).includes('100'), `${P} W12 Sat should include 100-rep Glute Pump Finisher, got ${fin?.name}/${fin?.target.reps}`);
    // Squats advice 3x10
    const advS = cfg.hooks.getExerciseAdvice(exByName(mon, 'Squats')!, [{ setResults: [{ reps: 10, weight: 60, completed: true }, { reps: 10, weight: 60, completed: true }, { reps: 10, weight: 60, completed: true }] }] as any);
    check(advS === 't:tips.peachySquatsIncrease', `${P} Squats 3x10 advice, got ${advS}`);
}

// ============================================================
// 5. PAIN & GLORY
// ============================================================
{
    const P = 'PG';
    const cfg = PAIN_GLORY_CONFIG;
    const mkU = (status: any = {}): any => ({ id: 'u', programId: 'pain-and-glory', stats: { conventionalDeadlift: 150, lowBarSquat: 130 }, painGloryStatus: status });
    const pp = (w: number, d_: number, u = mkU()) => cfg.hooks.preprocessDay ? cfg.hooks.preprocessDay(day(PAIN_GLORY_PROGRAM, w, d_), u) : day(PAIN_GLORY_PROGRAM, w, d_);
    const cwn = (name: string, w: number, d_: number, u: any) => cfg.hooks.calculateWeight({ type: 'straight', reps: '6' } as any, u, name, { week: w, day: d_ });

    // Structure per phase map
    check(!!exByName(pp(1, 1), 'Deficit Snatch Grip Deadlift') && exByName(pp(1, 1), 'Deficit Snatch Grip Deadlift')!.sets === 10, `${P} W1 Mon deficit 10 sets`);
    check(!!exByName(pp(8, 5), 'Deficit Snatch Grip Deadlift'), `${P} W8 Fri should still be deficit`);
    const e2 = exByName(pp(9, 5), 'Conventional Deadlift (E2MOM)');
    check(!!e2 && e2!.sets === 6 && String(e2!.target.reps) === '3-5', `${P} W9 Fri E2MOM 6x3-5, got ${e2?.sets}x${e2?.target.reps}`);
    check(!!exByName(pp(13, 1), 'Conventional Deadlift (AMRAP)'), `${P} W13 Mon AMRAP missing`);
    check(!!exByName(pp(14, 1), 'Conventional Deadlift (Triple)') || !!pp(14, 1).exercises.find((e: any) => /triple/i.test(e.name)), `${P} W14 Mon triple missing`);
    check(!!pp(16, 1).exercises.find((e: any) => /single/i.test(e.name)), `${P} W16 Mon single missing`);
    check(!!pp(15, 5).exercises.find((e: any) => /CAT/.test(e.name)), `${P} W15 Fri CAT missing`);
    const push = pp(1, 2);
    for (const n of ['Paused Low Bar Squat', 'Leg Extensions', 'Hack Squat Calf Raises', 'Incline DB Bench Press', 'Standing Military Press'])
        check(!!exByName(push, n), `${P} push day missing ${n}`);

    // Weight rules
    check(cwn('Deficit Snatch Grip Deadlift', 1, 1, mkU()) === floorD(150 * 0.45).toString(), `${P} deficit start 45% -> ${floorD(67.5)}, got ${cwn('Deficit Snatch Grip Deadlift', 1, 1, mkU())}`);
    check(cwn('Deficit Snatch Grip Deadlift', 3, 1, mkU({ deficitSnatchGripWeight: 80 })) === '80', `${P} deficit should use stored running weight`);
    check(cwn('Paused Low Bar Squat', 1, 2, mkU()) === floorD(130 * 0.7).toString(), `${P} squat W1 = 70% -> ${floorD(91)}, got ${cwn('Paused Low Bar Squat', 1, 2, mkU())}`);
    check(cwn('Paused Low Bar Squat', 5, 2, mkU({ squatProgress: 10 })) === floorD(130 * 1.075 * 0.7 + 10).toString(), `${P} squat W5 reset+progress, got ${cwn('Paused Low Bar Squat', 5, 2, mkU({ squatProgress: 10 }))}`);
    check(cwn('Paused Low Bar Squat', 10, 2, mkU({ week8SquatWeight: 105 })) === '105', `${P} squat W10 maintenance = week8 weight`);
    note(`PG: PLAN says weeks 9-16 squat is "FIXED at ~85-90% of Week 8 final weight"; code holds 100% of the week-8 weight (week8SquatWeight, fallback 85% of 1RM only when missing). Confirm intended.`);
    check(cwn('Conventional Deadlift (E2MOM)', 9, 5, mkU({ deficitSnatchGripWeight: 100, e2momWeightAdjustment: 5 })) === (floorD(135) + 5).toString(), `${P} E2MOM = floor(100*1.35)+5`);
    const st = { deficitSnatchGripWeight: 100, amrapWeight: 187.5, amrapReps: 8, estimatedE1RM: 235 };
    const wAbs = (w: number, d_: number, frag: string) => {
        const ex = pp(w, d_, mkU(st)).exercises.find((e: any) => e.name.includes(frag));
        return ex?.target.weightAbsolute ?? NaN;
    };
    check(wAbs(13, 1, 'AMRAP') === floorD(100 * 2.22 * 0.85), `${P} AMRAP target = floor(188.7)=187.5, got ${wAbs(13, 1, 'AMRAP')}`);
    check(wAbs(14, 1, 'Triple') === floorD(235 * 0.90), `${P} triple = 90% e1RM, got ${wAbs(14, 1, 'Triple')}`);
    check(wAbs(16, 1, 'Single') === floorD(235 * 0.97), `${P} single = 97% e1RM, got ${wAbs(16, 1, 'Single')}`);
    check(wAbs(15, 5, 'CAT') === floorD(187.5 * 0.7), `${P} CAT = 70% of AMRAP weight, got ${wAbs(15, 5, 'CAT')}`);
}

// ============================================================
// 6. TRINARY
// ============================================================
{
    const P = 'TR';
    const cfg = TRINARY_CONFIG;
    const mkU = (extra: any = {}): any => ({
        id: 'u', programId: 'trinary', stats: {},
        trinaryStatus: { completedWorkouts: 0, currentBlock: 1, bench1RM: 100, deadlift1RM: 140, squat1RM: 120, workoutLog: [], cycleNumber: 1, ...extra },
    });
    const cwn = (name: string, u: any) => cfg.hooks.calculateWeight({ type: 'range', reps: '1-3' } as any, u, name, { week: 1, day: 1 });
    // Block percentages
    check(cwn('Paused Bench Press (ME)', mkU()) === floorD(100 * 0.90).toString(), `${P} block1 ME 90%`);
    check(cwn('Low Bar Squat (DE)', mkU()) === floorD(120 * 0.60).toString(), `${P} block1 DE 60%`);
    check(cwn('Conventional Deadlift (RE)', mkU()) === floorD(140 * 0.70).toString(), `${P} block1 RE 70%`);
    check(cwn('Paused Bench Press (ME)', mkU({ completedWorkouts: 9 })) === floorD(100 * 0.92).toString(), `${P} block4 ME 92%`);
    check(cwn('Paused Bench Press (ME)', mkU({ completedWorkouts: 18 })) === floorD(100 * 0.95).toString(), `${P} block7 ME 95%`);
    check(cwn('Low Bar Squat (DE)', mkU({ completedWorkouts: 9 })) === floorD(120 * 0.65).toString(), `${P} block4 DE 65%`);
    check(cwn('Conventional Deadlift (RE)', mkU({ completedWorkouts: 18 })) === floorD(140 * 0.80).toString(), `${P} block7 RE 80%`);
    // RDL 55% + pending bonus
    check(cwn('Romanian Deadlift (RE)', mkU()) === floorD(140 * 0.55).toString(), `${P} RDL RE = 55%`);
    check(cwn('Romanian Deadlift (RE)', mkU({ reProgressionPending: [{ lift: 'deadlift', amount: 5 }] })) === (floorD(77) + 5).toString(), `${P} RDL RE + pending bonus`);
    // ME rep style override
    const w2d1 = cfg.hooks.preprocessDay(day(TRINARY_PROGRAM, 2, 1), mkU({ completedWorkouts: 3, meRepMaxStyle: '1rm' }));
    const me1 = w2d1.exercises.find((e: any) => e.name.includes('(ME)'));
    check(me1?.sets === 1 && me1?.target.reps === '1', `${P} 1rm style ME should be 1x1, got ${me1?.sets}x${me1?.target.reps}`);
    const w2d1b = cfg.hooks.preprocessDay(day(TRINARY_PROGRAM, 2, 1), mkU({ completedWorkouts: 3 }));
    const me3 = w2d1b.exercises.find((e: any) => e.name.includes('(ME)'));
    check(me3?.sets === 3 && me3?.target.reps === '1-3', `${P} default ME 3x1-3, got ${me3?.sets}x${me3?.target.reps}`);
    // DE/RE structure
    const de = w2d1b.exercises.find((e: any) => e.name.includes('(DE)'));
    check(de?.sets === 8 && String(de?.target.reps) === '2-3', `${P} DE 8x2-3, got ${de?.sets}x${de?.target.reps}`);
    const re = w2d1b.exercises.find((e: any) => e.name.includes('(RE)'));
    check(re?.sets === 4 && re?.target.reps === '8-12', `${P} RE 4x8-12, got ${re?.sets}x${re?.target.reps}`);
    // ME/DE/RE rotation pattern
    const pat = (pos: number) => {
        const d = cfg.hooks.preprocessDay(day(TRINARY_PROGRAM, 1, pos), mkU({ completedWorkouts: pos - 1 }));
        const f = (t: string) => d.exercises.find((e: any) => e.name.includes(t))?.name || '';
        return { me: f('(ME)'), de: f('(DE)'), re: f('(RE)') };
    };
    const p1 = pat(1);
    check(/Deadlift/.test(p1.me) && /Squat/.test(p1.de) && /Bench/.test(p1.re), `${P} workout1 pattern DL-ME/SQ-DE/BP-RE, got ${JSON.stringify(p1)}`);
    const p2 = pat(2);
    check(/Squat/.test(p2.me) && /Bench/.test(p2.de) && /Deadlift|Romanian|Hyperextension|Good Morning/.test(p2.re), `${P} workout2 pattern, got ${JSON.stringify(p2)}`);
    // Variation after block 3 with weak point
    const uVar = mkU({ completedWorkouts: 9, benchVariation: 'Wide-Grip Bench Press', deadliftVariation: 'RDLs', squatVariation: 'Paused Squat' });
    const w4 = cfg.hooks.preprocessDay(day(TRINARY_PROGRAM, 4, 1), uVar);
    check(!!w4.exercises.find((e: any) => e.name === 'RDLs (ME)'), `${P} block4 ME should use deadlift variation, got ${w4.exercises.map((e: any) => e.name).join(',')}`);
    // Accessory trigger at >=4 workouts/7d
    const recent = Array.from({ length: 4 }, (_, i) => ({ date: new Date(Date.now() - i * 86400000).toISOString(), workoutNumber: i + 1 }));
    const acc = cfg.hooks.preprocessDay(day(TRINARY_PROGRAM, 2, 2), mkU({ completedWorkouts: 4, workoutLog: recent }));
    check(String(acc.dayName).includes('trinaryAccessory'), `${P} accessory day should trigger at 4 workouts/7d`);
    check(acc.exercises.length === 4 && acc.exercises.every((e: any) => e.sets === 4 && e.target.reps === '8-12'), `${P} accessory day should be 4 exercises of 4x8-12`);
    note(`TR: PLAN says the weak-point modal triggers after EVERY 3rd workout (3,6,9,...); code triggers only after workouts 9 and 18 (every 9th, i.e. variations change once per 3 blocks). Which is intended?`);
    note(`TR: PLAN's DE progression says "+2.5 kg OR add bands/chains"; code has no DE progression (pure block %). Confirm intended.`);
}

// ============================================================
// 7. RITUAL
// ============================================================
{
    const P = 'RT';
    const cfg = RITUAL_CONFIG;
    const mkU = (extra: any = {}): any => ({
        id: 'u', programId: 'ritual-of-strength', stats: {},
        ritualStatus: { benchPress1RM: 100, deadlift1RM: 140, squat1RM: 120, completedWorkouts: 0, currentWeek: 1, isFirstProgram: true, rampInComplete: false, ritualAccessories: { bench: ['Rows', 'Face Pulls'], squat: ['Ham Curls'], deadlift: ['Shrugs'] }, ...extra },
    });
    const cwn = (name: string, w: number, u = mkU({ currentWeek: w })) => cfg.hooks.calculateWeight({ type: 'straight', reps: '5' } as any, u, name, { week: w, day: 1 });
    // Ramp-in %s (PLAN: 70/80/90; W4 ascension @85)
    check(cwn('Paused Bench Press', 1) === floorD(100 * 0.70).toString(), `${P} W1 70%`);
    check(cwn('Paused Bench Press', 2) === floorD(100 * 0.80).toString(), `${P} W2 80%`);
    check(cwn('Paused Bench Press', 3) === floorD(100 * 0.90).toString(), `${P} W3 90%`);
    check(cwn('Paused Bench Press (Ascension Test)', 4) === floorD(100 * 0.85).toString(), `${P} W4 ascension 85%`);
    // Ramp-in structure: W1-3 sets/reps 3x9 / 3x6 / 3x3
    const reps = (w: number) => { const d = cfg.hooks.preprocessDay(day(RITUAL_PROGRAM, w, 1), mkU({ currentWeek: w })); const e = d.exercises[0]; return `${e.sets}x${e.target.reps}`; };
    check(reps(1) === '3x9', `${P} W1 3x9, got ${reps(1)}`);
    check(reps(2) === '3x6', `${P} W2 3x6, got ${reps(2)}`);
    check(reps(3) === '3x3', `${P} W3 3x3, got ${reps(3)}`);
    // Main phase: ME 95%+prog, light 70%, ascension weeks 8/12/16 present
    check(cwn('Paused Bench Press (ME)', 6) === floorD(95).toString(), `${P} ME 95%`);
    check(cwn('Paused Bench Press (ME)', 6, mkU({ currentWeek: 6, benchMEProgression: 5 })) === (floorD(95) + 5).toString(), `${P} ME 95% + progression`);
    check(cwn('Low Bar Squat (Light)', 6) === floorD(120 * 0.70).toString(), `${P} light 70%`);
    for (const w of [8, 12, 16]) {
        const d = cfg.hooks.preprocessDay(day(RITUAL_PROGRAM, w, 1), mkU({ currentWeek: w, isFirstProgram: false, rampInComplete: true }));
        check(!!d.exercises.find((e: any) => e.name.includes('Ascension Test')), `${P} W${w} should be Ascension Test week`);
    }
    // skip ramp-in path
    const skip = cfg.hooks.preprocessDay(day(RITUAL_PROGRAM, 2, 1), mkU({ currentWeek: 2, isFirstProgram: false, rampInComplete: true }));
    check(!!skip.exercises.find((e: any) => e.name.includes('(ME)')), `${P} isFirstProgram=false W2 should show main-phase ME day`);
    // accessories injected
    const d6 = cfg.hooks.preprocessDay(day(RITUAL_PROGRAM, 6, 1), mkU({ currentWeek: 6, isFirstProgram: false, rampInComplete: true }));
    check(!!exByName(d6, 'Rows'), `${P} user accessory 'Rows' should be injected on bench day`);
    // grip work on deadlift day
    const dDay = RITUAL_PROGRAM.weeks.find((w: any) => w.weekNumber === 6)!.days
        .map((dd: any) => cfg.hooks.preprocessDay(dd, mkU({ currentWeek: 6, isFirstProgram: false, rampInComplete: true })))
        .find((d: any) => d.exercises.some((e: any) => e.name.includes('Deadlift') && e.name.includes('(ME)')));
    check(!!dDay?.exercises.find((e: any) => /farmer|grip/i.test(e.name)), `${P} deadlift ME day should include Farmer Holds/grip work`);
    note(`RT: PLAN says Ascension back-down = 3x5 @ 80% of the AMRAP WEIGHT (~68% of 1RM); code computes 80% of the 1RM. Also W4 ramp-in back-down currently gets the flat W4 85%. Confirm intended.`);
    note(`RT: PLAN's Purge/deload weeks (post-8/12/16 recovery-check insertion) and the Light-work velocity -5% persistence are still pending implementation (unreachable/UI-only). Already flagged previously.`);
    note(`RT: PLAN says accessories are "up to 3 per day" with an in-workout "Add Ritual Accessory" button + custom entry; verify that button exists in WorkoutView (not found in code greps).`);
}

// ============================================================
// 8. SUPER MUTANT
// ============================================================
{
    const P = 'SM';
    const muscles = ['chest', 'shoulders', 'triceps', 'back', 'biceps', 'calves', 'hamstrings', 'glutes', 'lowerBack', 'quads', 'abductors', 'abs'];
    const mkU = (extra: any = {}): any => ({
        id: 'u', programId: 'super-mutant', stats: {},
        superMutantStatus: {
            completedWorkouts: 0, currentCycle: 1, muscleGroupTimestamps: {}, rolling7DayVolume: Object.fromEntries(muscles.map(m => [m, 0])),
            chestVariant: 'A', backVariant: 'A', bench1RM: 100, deadlift1RM: 140, squat1RM: 120,
            quadExercise: 'Hack Squat', hamstringExercise: 'Good Mornings', weeklySessionDates: [], ...extra,
        },
    });
    const gen = (u: any) => SUPER_MUTANT_CONFIG.hooks.preprocessDay({ dayName: 'x', dayOfWeek: 1, exercises: [] } as any, u);

    // Workout 1: fresh user -> upper A + a lower block
    const w1 = gen(mkU());
    const n1 = w1.exercises.map((e: any) => e.name).join(' | ');
    check(/Pec Deck|Incline DB Bench/.test(n1), `${P} workout1 should start with Chest block A, got: ${n1}`);
    // RIR notes by week-in-cycle
    const rir = (cw_: number) => { const d = gen(mkU({ completedWorkouts: cw_ })); return d.exercises[0]?.notes || d.exercises[0]?.rirNote || JSON.stringify(d.exercises[0]); };
    const noteHas = (cw_: number, frag: string) => { const d = gen(mkU({ completedWorkouts: cw_ })); return d.exercises.some((e: any) => String(e.notes || '').includes(frag)); };
    check(noteHas(0, 'Leave 2 reps'), `${P} week1 RIR2 note missing (workout 0): ${rir(0)}`);
    check(noteHas(7, 'Leave 1 rep'), `${P} week2 RIR1 note missing`);
    check(noteHas(14, 'failure'), `${P} week3 RIR0 note missing`);
    const w4d = gen(mkU({ completedWorkouts: 21 }));
    check(w4d.exercises.some((e: any) => /REST-PAUSE|DROPSET|MYO-REPS/.test(String(e.notes || ''))), `${P} week4 should carry intensification techniques`);
    // Cooldown: chest trained 24h ago -> no chest block; back block instead
    const now = Date.now();
    const uCool = mkU({ completedWorkouts: 1, nextUpperBlock: 'A', muscleGroupTimestamps: { chest: now - 24 * 3600e3, triceps: now - 24 * 3600e3, biceps: now - 24 * 3600e3 } });
    const dCool = gen(uCool);
    const chestNames = ['Pec Deck', 'Incline DB Bench Press', 'Hammer Chest Press', 'Mid Cable Flyes (Seated)', 'Deficit Pushups'];
    const coolNames = dCool.exercises.map((e: any) => e.name);
    check(!coolNames.some((n: string) => chestNames.includes(n)), `${P} chest on 24h cooldown should not be trained, got: ${coolNames.join(' | ')}`);
    // Grace period: 39h elapsed (>38h) should allow upper block again
    const uGrace = mkU({ completedWorkouts: 2, nextUpperBlock: 'A', muscleGroupTimestamps: Object.fromEntries(['back', 'shoulders', 'calves'].map(m => [m, now - 2 * 3600e3])), });
    const uGrace2 = { ...uGrace, superMutantStatus: { ...uGrace.superMutantStatus, muscleGroupTimestamps: { ...uGrace.superMutantStatus.muscleGroupTimestamps, chest: now - 39 * 3600e3, triceps: now - 39 * 3600e3, biceps: now - 39 * 3600e3 } } };
    const dGrace = gen(uGrace2);
    check(/Pec Deck|Incline DB Bench|Hammer Chest|Mid Cable/.test(dGrace.exercises.map((e: any) => e.name).join('|')), `${P} 39h-elapsed chest (grace) should be trainable, got: ${dGrace.dayName} / ${dGrace.exercises.map((e: any) => e.name).join('|')}`);
    // Over-volume: triceps >20 sets -> excluded from block A, chest kept
    const uVol = mkU({ rolling7DayVolume: { ...mkU().superMutantStatus.rolling7DayVolume, triceps: 22 } });
    const dVol = gen(uVol);
    const nVol = dVol.exercises.map((e: any) => e.name).join(' | ');
    check(/Pec Deck|Incline DB Bench/.test(nVol) && !/Pushdown|Skullcrusher|Overhead Extension/.test(nVol), `${P} triceps>20/7d should be excluded (chest kept), got: ${nVol}`);
    // Rep ranges by cycle: cycle 3 main 10-15
    const late = gen(mkU({ completedWorkouts: 70 }));
    const mainLate = late.exercises.find((e: any) => /Bench|Chest Press/.test(e.name));
    if (mainLate) check(String(mainLate.target.reps) === '10-15', `${P} cycle3 main lift 10-15, got ${mainLate?.target.reps} (workout 60: ${late.dayName})`);
    else note(`${P}: workout 60 generated "${late.dayName}" (likely deload window) — cycle-3 rep-range check skipped`);
    // Deload window (workouts 57-63): reduced sets
    const dl = gen(mkU({ completedWorkouts: 57 }));
    check(String(dl.dayName).toLowerCase().includes('deload'), `${P} workout 57 should be DELOAD, got ${dl.dayName}`);
    check(dl.exercises.length > 0 && dl.exercises.every((e: any) => e.sets <= 2), `${P} deload sets should be <=2, got ${dl.exercises.map((e: any) => e.sets).join(',')}`);
    note(`SM: PLAN documents a "+24h time-skip button (for testing)" on the dashboard — I removed it earlier as a dev artifact. Restore it, keep it removed, or gate it behind admin?`);
    note(`SM: PLAN describes a "Mutagen Exposure" progress widget (X/84 or X/112 workouts), a 16-week completion re-run modal ("The mutation is incomplete. Continue?") with +2.5-5 kg weight migration, and a >6 sessions/7d "Over-mutation risk" prompt. None of these exist in the code. PLAN also self-contradicts on program length (84 vs 112 workouts). Pending features or drop from PLAN?`);
}

// ============================================================
// 9. BADGES: PLAN list vs BADGES data
// ============================================================
{
    const planBadges = ['certified_threat', 'certified_boulder', 'perfect_attendance', 'bench_psychopath', 'bench_jump_20kg', 'bench_jump_30kg', 'deload_denier', 'rear_delt_reaper', '3d_delts', 'cannonball_delts', 'first_blood', '100_sessions', 'immortal', 'final_boss', 'peachy_perfection', 'squat_30kg', 'glute_gainz_queen', 'kas_glute_bridge_100', 'void_gazer', 'emom_executioner', 'glory_achieved', 'deficit_demon', 'single_supreme', '50_tonne_club', 'initiate_of_iron', 'disciple_of_pain', 'acolyte_of_strength', 'high_priest_of_power', 'eternal_worshipper'];
    const ids = new Set(BADGES.map(b => b.id));
    for (const b of planBadges) check(ids.has(b), `BADGES: PLAN badge '${b}' missing from data/badges.ts`);
    const ucSrc = fs.readFileSync(path.join('src', 'contexts', 'UserContext.tsx'), 'utf8');
    for (const b of BADGES.map(x => x.id)) {
        if (!ucSrc.includes(`'${b}'`) && !ucSrc.includes(`"${b}"`)) note(`BADGES: '${b}' defined but never referenced in checkBadges (may be unawardable)`);
    }
}

// ============================================================
// 10. TRANSLATION COMPLETENESS SCAN
// ============================================================
{
    const lookup = (root: any, keyPath: string): any => keyPath.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), root);
    const srcFiles: string[] = [];
    const walk = (dir: string) => { for (const f of fs.readdirSync(dir)) { const p = path.join(dir, f); const s = fs.statSync(p); if (s.isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(f) && !f.includes('translations')) srcFiles.push(p); } };
    walk('src');
    const used = new Map<string, string>();
    for (const f of srcFiles) {
        const src = fs.readFileSync(f, 'utf8');
        for (const m of src.matchAll(/\bt(?:Array|Object)?\(\s*['"`]([a-zA-Z0-9_.]+)['"`]/g)) used.set(m[1], f);
        for (const m of src.matchAll(/['"`]t:([a-zA-Z0-9_.]+)/g)) used.set(m[1], f);
    }
    let missEn = 0, missPl = 0;
    used.delete('some.key'); // docstring example in useTranslation.tsx, not a real key
    for (const [key, file] of used) {
        const en = lookup((translations as any).en, key);
        const pl = lookup((translations as any).pl, key);
        if (en === undefined) { fails.push(`i18n: '${key}' used in ${path.basename(file)} but MISSING in EN`); missEn++; }
        else if (pl === undefined) { missPl++; if (missPl <= 25) notes.push(`i18n: '${key}' missing in PL (falls back to EN) [${path.basename(file)}]`); }
        checks++;
    }
    console.log(`i18n scan: ${used.size} keys used, ${missEn} missing EN, ${missPl} missing PL`);
    if (missPl > 25) notes.push(`i18n: ...and ${missPl - 25} more keys missing in PL`);
}

// ============================================================
console.log(`\n${'='.repeat(72)}\nCHECKS RUN: ${checks}   FAILURES: ${fails.length}   DISCREPANCY NOTES: ${notes.length}\n${'='.repeat(72)}`);
console.log('\n--- FAILURES (spec breaches / bugs) ---');
for (const f of fails) console.log('FAIL:', f);
console.log('\n--- NOTES (PLAN-vs-code discrepancies for user review) ---');
for (const n of notes) console.log('NOTE:', n);
