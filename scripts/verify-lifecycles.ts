import { BENCH_DOMINATION_CONFIG } from '../src/data/program';
import { PENCILNECK_CONFIG } from '../src/data/pencilneck';
import { SKELETON_CONFIG } from '../src/data/skeleton';
import { PEACHY_CONFIG } from '../src/data/peachy';
import { PAIN_GLORY_CONFIG } from '../src/data/painglory';
import { TRINARY_CONFIG } from '../src/data/trinary';
import { RITUAL_CONFIG } from '../src/data/ritual';
import type { PlanConfig, UserProfile, WorkoutDay, WorkoutLog } from '../src/types';

const base = (programId: string): UserProfile => ({
  id:'lifecycle', codeword:'lifecycle', programId, startDate:'2026-01-01T00:00:00.000Z', completedSessions:0,
  stats:{ pausedBench:120, wideGripBench:105, spotoPress:110, lowPinPress:100, btnPress:50, squat:160, conventionalDeadlift:200, lowBarSquat:160 },
  benchHistory:[], squatHistory:[], programProgress:{}, badges:[], gluteMeasurements:[], pencilneckBenchHistory:[]
});

const fixtures: Array<{ config:PlanConfig; expectedWeeks:number; user:UserProfile }> = [
  { config:BENCH_DOMINATION_CONFIG, expectedWeeks:16, user:{...base('bench-domination'), benchDominationModules:{tricepGiantSet:true,behindNeckPress:true,weightedPullups:true,accessories:true,legDays:true}, benchDominationStatus:{completedWeeks:0,addedDeloadWeeks:[],forcedDeloadCompleted:false}} },
  { config:PENCILNECK_CONFIG, expectedWeeks:8, user:{...base('pencilneck-eradication'), pencilneckStatus:{cycle:1,completed:false}, exercisePreferences:{}} },
  { config:SKELETON_CONFIG, expectedWeeks:12, user:{...base('skeleton-to-threat'), selectedDays:[1,3,5], skeletonStatus:{completed:false,plankTargetSeconds:30}} },
  { config:PEACHY_CONFIG, expectedWeeks:12, user:base('peachy-glute-plan') },
  { config:PAIN_GLORY_CONFIG, expectedWeeks:16, user:{...base('pain-and-glory'), painGloryStatus:{deficitSnatchGripWeight:90,squatProgress:0}} },
  { config:TRINARY_CONFIG, expectedWeeks:9, user:{...base('trinary'), trinaryStatus:{completedWorkouts:0,currentBlock:1,bench1RM:120,deadlift1RM:200,squat1RM:160,benchVariation:'Paused Bench Press',deadliftVariation:'Deficit Deadlift',squatVariation:'Pause Squat',workoutLog:[],cycleNumber:1,isDeload:false,meRepMaxStyle:'3rm'}} },
  { config:RITUAL_CONFIG, expectedWeeks:19, user:{...base('ritual-of-strength'), ritualStatus:{completedWorkouts:0,currentWeek:1,isFirstProgram:true,rampInComplete:false,benchPress1RM:120,deadlift1RM:200,squat1RM:160,benchMEProgression:0,deadliftMEProgression:0,squatMEProgression:0}} },
];

const failures:string[] = [];
let sessions=0, exercises=0, weights=0, adviceChecks=0;
for (const {config,expectedWeeks,user} of fixtures) {
  if (config.program.weeks.length !== expectedWeeks) failures.push(`${config.id}: expected ${expectedWeeks} weeks, got ${config.program.weeks.length}`);
  for (const week of config.program.weeks) for (const sourceDay of week.days) {
    let day:WorkoutDay;
    try { day = config.hooks?.preprocessDay ? config.hooks.preprocessDay(structuredClone(sourceDay), user) : structuredClone(sourceDay); }
    catch (error) { failures.push(`${config.id} W${week.weekNumber} D${sourceDay.dayOfWeek}: preprocess crashed: ${error}`); continue; }
    if (!day.dayName || day.dayOfWeek < 0 || day.dayOfWeek > 7) failures.push(`${config.id} W${week.weekNumber}: invalid day metadata`);
    if (!day.exercises.length) continue;
    sessions++;
    const ids = new Set<string>();
    for (const exercise of day.exercises) {
      exercises++;
      if (!exercise.id || ids.has(exercise.id)) failures.push(`${config.id} W${week.weekNumber} D${day.dayOfWeek}: duplicate/missing exercise id ${exercise.id}`);
      ids.add(exercise.id);
      const zeroSetController = config.id === 'bench-domination' && exercise.sets === 0 && (exercise.name === 'Weighted Pull-ups' || exercise.name === 'Rest / Mobility');
      if ((!Number.isInteger(exercise.sets) || exercise.sets < 1) && !zeroSetController) failures.push(`${config.id} ${exercise.name}: invalid sets ${exercise.sets}`);
      if (!exercise.target?.reps) failures.push(`${config.id} ${exercise.name}: missing rep target`);
      if (config.hooks?.calculateWeight) {
        try {
          const result = config.hooks.calculateWeight(exercise.target, user, exercise.name, {week:week.weekNumber,day:day.dayOfWeek});
          if (result !== undefined) { weights++; const numeric=Number(result); if (!Number.isFinite(numeric) || numeric < 0) failures.push(`${config.id} ${exercise.name}: invalid weight ${result}`); }
        } catch (error) { failures.push(`${config.id} W${week.weekNumber} ${exercise.name}: weight calculation crashed: ${error}`); }
      }
      if (config.hooks?.getExerciseAdvice) {
        const top = Number(String(exercise.target.reps).split('-').pop()) || 10;
        const history:WorkoutLog[]=[{id:'test',date:'2026-01-01',programId:config.id,week:week.weekNumber,day:day.dayOfWeek,exercises:[{id:exercise.id,name:exercise.name,setsData:Array.from({length:exercise.sets},()=>({reps:String(top),weight:'50',completed:true}))}]}];
        try { config.hooks.getExerciseAdvice(exercise, history); adviceChecks++; }
        catch (error) { failures.push(`${config.id} ${exercise.name}: advice crashed: ${error}`); }
      }
    }
  }
}

console.log(`Lifecycle sweep: ${fixtures.length} plans, ${sessions} sessions, ${exercises} exercise prescriptions, ${weights} calculated loads, ${adviceChecks} progression checks, ${failures.length} failures`);
for (const failure of failures) console.error(`FAIL: ${failure}`);
if (failures.length) process.exit(1);
