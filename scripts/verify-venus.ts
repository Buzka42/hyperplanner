import assert from 'node:assert/strict';
import { VENUS_FOUR_DAY, VENUS_RISING_CONFIG, VENUS_THREE_DAY, effectiveVenusMode } from '../src/data/plans/venusRising';
import type { UserProfile } from '../src/types';

let assertions = 0;
const ok = (value: unknown, message: string) => { assert.ok(value, message); assertions++; };
for (const [name, days] of [['4-day', VENUS_FOUR_DAY], ['3-day', VENUS_THREE_DAY]] as const) {
    ok(days.length === (name === '4-day' ? 4 : 3), `${name} has correct frequency`);
    for (const day of days) {
        const sets = day.slots.reduce((sum, slot) => sum + slot.sets, 0);
        ok(sets >= 15 && sets <= 16, `${name} ${day.name} stays at 15–16 sets`);
    }
}
ok(VENUS_RISING_CONFIG.program.weeks.length === 12, 'plan has 12 weeks');
const week12 = VENUS_RISING_CONFIG.program.weeks[11].days.filter(day => day.exercises.length);
for (const day of week12) {
    const base = VENUS_RISING_CONFIG.program.weeks[0].days.find(item => item.dayOfWeek === day.dayOfWeek)!;
    const ratio = day.exercises.reduce((n, ex) => n + ex.sets, 0) / base.exercises.reduce((n, ex) => n + ex.sets, 0);
    ok(ratio >= 0.6 && ratio <= 0.7, `${day.dayName} rebirth volume is 60–70%`);
}
const baseUser = { startDate: '2026-01-01T00:00:00.000Z', programProgress: { 'venus-rising': { completedSessions: 0, startDate: '2026-01-01T00:00:00.000Z' } }, planPreferences: { 'venus-rising': { scheduleMode: '4day', exerciseSelections: {}, updatedAt: '', pendingScheduleChange: { mode: '3day', requestedAt: '2026-01-03T00:00:00.000Z', requestedDuringWeek: 1 } } } } as unknown as UserProfile;
ok(effectiveVenusMode(baseUser, '2026-01-10T00:00:00.000Z') === '4day', 'mode holds until existing week is completed');
baseUser.programProgress!['venus-rising'].completedSessions = 4;
ok(effectiveVenusMode(baseUser, '2026-01-10T00:00:00.000Z') === '3day', 'mode applies after calendar boundary and completed week');
const risingDay = VENUS_RISING_CONFIG.hooks!.preprocessDay!(VENUS_RISING_CONFIG.program.weeks[4].days[0], { ...baseUser, planPreferences: { 'venus-rising': { scheduleMode: '4day', updatedAt: '', exerciseSelections: { priority1: 'leg-extension', priority2: 'lateral-raise' } } } } as UserProfile);
ok(risingDay.exercises.reduce((sum, ex) => sum + ex.sets, 0) <= 16, 'priority additions cannot exceed session cap');
console.log(`Venus Rising verification passed: ${assertions} assertions.`);
