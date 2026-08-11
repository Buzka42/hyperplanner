export type HouseSessionId = 'push-a' | 'pull-a' | 'push-b' | 'pull-b';

export const HOUSE_SESSION_DAY: Record<HouseSessionId, number> = {
    'push-a': 1, 'pull-a': 2, 'push-b': 3, 'pull-b': 4,
};

export interface HouseSessionHistoryEntry { session: HouseSessionId; date: string }
export interface HouseBalance { upperPush: number; upperPull: number; knee: number; hip: number }

export const houseBalance = (history: HouseSessionHistoryEntry[]): HouseBalance => history.reduce((balance, entry) => {
    if (entry.session.startsWith('push')) balance.upperPush += 1;
    else balance.upperPull += 1;
    if (entry.session === 'push-a' || entry.session === 'push-b') balance.knee += 1;
    else balance.hip += 1;
    return balance;
}, { upperPush: 0, upperPull: 0, knee: 0, hip: 0 });

export const recommendHouseSession = (
    history: HouseSessionHistoryEntry[],
    now = new Date().toISOString(),
): HouseSessionId => {
    const balance = houseBalance(history);
    const last = new Map<HouseSessionId, number>();
    history.forEach(entry => last.set(entry.session, new Date(entry.date).getTime()));
    const current = new Date(now).getTime();
    const sessions = Object.keys(HOUSE_SESSION_DAY) as HouseSessionId[];

    return sessions.sort((a, b) => {
        const score = (session: HouseSessionId) => {
            const pushPullNeed = session.startsWith('push')
                ? balance.upperPull - balance.upperPush
                : balance.upperPush - balance.upperPull;
            const lowerNeed = session.startsWith('push') ? balance.hip - balance.knee : balance.knee - balance.hip;
            const recencyPenalty = current - (last.get(session) ?? 0) < 48 * 3_600_000 ? 4 : 0;
            return pushPullNeed * 3 + lowerNeed * 2 - recencyPenalty;
        };
        return score(b) - score(a) || (last.get(a) ?? 0) - (last.get(b) ?? 0) || a.localeCompare(b);
    })[0];
};
