import { generateNextWorkout, getMuscleContributions } from '../src/data/supermutant';
import type { UserProfile, SuperMutantStatus } from '../src/types';

const muscles = ['chest','shoulders','triceps','back','biceps','calves','hamstrings','glutes','lowerBack','quads','abductors','abs'];
let simulatedNow = Date.UTC(2026, 0, 5, 12);
Date.now = () => simulatedNow;

const status: SuperMutantStatus = {
  completedWorkouts: 0, currentCycle: 1, muscleGroupTimestamps: {},
  rolling7DayVolume: Object.fromEntries(muscles.map(m => [m, 0])) as SuperMutantStatus['rolling7DayVolume'],
  chestVariant: 'A', backVariant: 'A', bench1RM: 100, deadlift1RM: 160, squat1RM: 140,
  quadExercise: 'Front Squat', hamstringExercise: 'Deficit RDLs', weeklySessionDates: [], volumeHistory: [], exerciseLoads: {}
};
const user = { id:'simulation', codeword:'simulation', programId:'super-mutant', startDate:new Date(simulatedNow).toISOString(), completedSessions:0, stats:{pausedBench:0,wideGripBench:0,spotoPress:0,lowPinPress:0}, benchHistory:[], superMutantStatus:status } as UserProfile;
const failures: string[] = [];
const seen = new Set<string>();
let restDays = 0;
let pastFailureSessions = 0;
let chestA = 0, chestB = 0, backA = 0, backB = 0;

for (let day = 0; day < 150 && status.completedWorkouts < 84; day++, simulatedNow += 24 * 3600e3) {
  status.weeklySessionDates = (status.weeklySessionDates || []).filter(d => new Date(d).getTime() > simulatedNow - 7 * 86400e3);
  const workout = generateNextWorkout(user);
  if (!workout?.exercises.length) { restDays++; continue; }
  if ((status.weeklySessionDates?.length || 0) >= 6) failures.push(`cap exceeded before workout ${status.completedWorkouts + 1}`);
  const contributions: Record<string, number> = {};
  for (const ex of workout.exercises) {
    seen.add(ex.name);
    if (ex.id.startsWith('chest-a-')) chestA++; if (ex.id.startsWith('chest-b-')) chestB++;
    if (ex.id.startsWith('back-a-')) backA++; if (ex.id.startsWith('back-b-')) backB++;
    if (/REST-PAUSE|DROPSET|MYO-REPS/.test(ex.notes || '')) pastFailureSessions++;
    for (const [muscle, share] of Object.entries(getMuscleContributions(ex.id))) {
      contributions[muscle] = (contributions[muscle] || 0) + ex.sets * share;
      if (share >= 1) status.muscleGroupTimestamps[muscle as keyof typeof status.muscleGroupTimestamps] = simulatedNow;
    }
  }
  status.volumeHistory = (status.volumeHistory || []).filter(e => new Date(e.date).getTime() > simulatedNow - 7 * 86400e3);
  status.volumeHistory.push({ date:new Date(simulatedNow).toISOString(), contributions });
  status.rolling7DayVolume = Object.fromEntries(muscles.map(m => [m, status.volumeHistory!.reduce((n,e) => n + (e.contributions[m] || 0), 0)])) as SuperMutantStatus['rolling7DayVolume'];
  if (contributions.chest) status.chestVariant = status.chestVariant === 'A' ? 'B' : 'A';
  if (contributions.back) status.backVariant = status.backVariant === 'A' ? 'B' : 'A';
  status.weeklySessionDates!.push(new Date(simulatedNow).toISOString());
  status.completedWorkouts++;
}

if (status.completedWorkouts !== 84) failures.push(`simulation reached only ${status.completedWorkouts}/84 workouts`);
for (const muscle of muscles) if (!status.muscleGroupTimestamps[muscle as keyof typeof status.muscleGroupTimestamps]) failures.push(`${muscle} never trained`);
if (!seen.has('Front Squat') || seen.has('Hack Squat')) failures.push('quad onboarding preference not respected');
if (!seen.has('Deficit RDLs') || seen.has('Good Mornings')) failures.push('hamstring onboarding preference not respected');
if (!chestA || !chestB || !backA || !backB) failures.push('A/B alternation did not expose every variant');
if (!pastFailureSessions) failures.push('past-failure techniques never appeared');
if (!restDays) failures.push('recovery/cap never produced a rest day');

console.log(`Super Mutant simulation: ${status.completedWorkouts} workouts, ${restDays} recovery days, ${seen.size} exercises, ${failures.length} failures`);
for (const failure of failures) console.error(`FAIL: ${failure}`);
if (failures.length) process.exit(1);
