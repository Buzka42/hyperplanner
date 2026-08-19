/**
 * spec-fit — does each plan actually do what its card says?
 *
 * Three independent checks, each against a declaration the plan already makes
 * somewhere in the codebase, so this measures the plan against its own promise
 * rather than against an outside opinion:
 *
 *   1. Specialisation — `PLAN_RULES[id].specialisation` names the muscles the
 *      plan claims to prioritise. Does that group actually lead on direct sets,
 *      and does it get the exposures the rule demands?
 *   2. Fatigue — `PORTFOLIO[id].fatigue` is a 1–4 declaration. Compare it with
 *      where the plan's weekly systemic load actually sits in the catalogue.
 *   3. Experience — `PORTFOLIO[id].experience`. A plan open to beginners should
 *      not demand the most technical movements or the longest sessions.
 */

import { PORTFOLIO_BY_ID } from '../src/data/portfolio';
import { PLAN_RULES } from '../src/lib/volumeAnalysis';
import { RESOLVER, intelOf, majorOf, extendLibrary, type PlanWeek } from './portfolio-metrics';
import { simulate } from './sim-v2-portfolio';
import { PROPOSED_EXERCISES } from './v2-round2-map';
import { DECISIONS } from './v3-owner-decisions';

extendLibrary(PROPOSED_EXERCISES);

export type Verdict = 'holds' | 'partial' | 'misses' | 'n/a';

export type SpecFit = {
    planId: string;
    name: string;

    declaredSpecialisation: string[];
    /** Direct sets on the declared groups. */
    specSets: number;
    /** Share of the week's direct-set total spent on them. */
    specShare: number;
    /** Rank of the best-served declared group among all major groups. */
    specRank: number;
    /** Distinct training days carrying direct work for the declared groups. */
    specExposures: number;
    requiredExposures: number;
    /** The group that actually leads the week. */
    topGroup: string;
    topGroupSets: number;
    specialisationVerdict: Verdict;

    declaredFatigue: number;
    /** 1–4 band from the plan's weekly systemic load against the catalogue. */
    measuredFatigue: number;
    fatigueVerdict: Verdict;

    declaredExperience: string[];
    setsPerSession: number;
    avgStability: number;
    /** Share of sets on movements rated 'avoid' or 'advanced-only' for failure. */
    technicalShare: number;
    experienceVerdict: Verdict;

    notes: string[];
};

const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

const groupVolume = (week: PlanWeek) => {
    const direct = new Map<string, number>();
    const days = new Map<string, Set<number>>();
    let stability = 0, technical = 0, total = 0;

    for (const slot of week.slots) {
        const entry = RESOLVER.byId(slot.id as any);
        if (!entry) continue;
        const intel = intelOf(entry);
        stability += intel.stabilityDemand * slot.sets;
        if (intel.failureSuitability !== 'suitable') technical += slot.sets;
        total += slot.sets;
        // Once per group per exercise — see the note in portfolio-metrics.
        const hit = new Set<string>();
        for (const muscle of entry.primary ?? []) {
            const g = majorOf(muscle);
            if (g) hit.add(g);
        }
        for (const g of hit) {
            direct.set(g, (direct.get(g) ?? 0) + slot.sets);
            if (!days.has(g)) days.set(g, new Set());
            days.get(g)!.add(slot.day);
        }
    }
    return { direct, days, stability, technical, total };
};

export const specFit = (): SpecFit[] => {
    const sims = simulate().filter((r): r is Extract<typeof r, { finalWeek: PlanWeek }> => 'finalWeek' in r);

    /*
     * Fatigue bands come from the catalogue's own spread — "fatigue 4" is a
     * claim about being among the hardest plans on offer, not an absolute.
     *
     * Weekly systemic total alone gets this wrong: Ritual of Strength runs
     * three brutal sessions and lands mid-table on the weekly figure while
     * being the second most intense plan per set. Fatigue is experienced per
     * session and accumulated per week, so band on the average percentile rank
     * of three views: weekly systemic, systemic per session, and axial per
     * session (spine load drives recovery more than total tonnage).
     */
    const live = sims.filter(r => r.planId !== 'iron-clock');
    const axis = (get: (r: typeof live[0]) => number) => {
        const sorted = live.map(get).sort((a, b) => a - b);
        return (v: number) => sorted.filter(x => x < v).length / Math.max(1, sorted.length - 1);
    };
    const pWeekly = axis(r => r.final.systemic);
    const pSession = axis(r => r.final.systemic / Math.max(1, r.final.days));
    const pAxial = axis(r => r.final.axial / Math.max(1, r.final.days));
    const bandOf = (r: typeof live[0]) => {
        const pct = (pWeekly(r.final.systemic)
            + pSession(r.final.systemic / Math.max(1, r.final.days))
            + pAxial(r.final.axial / Math.max(1, r.final.days))) / 3;
        return pct < 0.25 ? 1 : pct < 0.5 ? 2 : pct < 0.75 ? 3 : 4;
    };

    return sims.map(r => {
        const week = r.finalWeek;
        const m = r.final;
        const portfolio = PORTFOLIO_BY_ID[r.planId];
        const rules = PLAN_RULES[r.planId];
        const { direct, days, stability, technical, total } = groupVolume(week);
        const notes: string[] = [];

        const ranked = [...direct.entries()].sort((a, b) => b[1] - a[1]);
        const declared = rules?.specialisation ?? [];
        const specSets = declared.reduce((s, g) => s + (direct.get(g) ?? 0), 0);
        const specRank = declared.length
            ? Math.min(...declared.map(g => {
                const i = ranked.findIndex(([group]) => group === g);
                return i < 0 ? 99 : i + 1;
            }))
            : 0;
        const specExposures = declared.length
            ? Math.max(...declared.map(g => days.get(g)?.size ?? 0))
            : 0;
        const required = rules?.specialisationExposures ?? 3;

        let specialisationVerdict: Verdict = 'n/a';
        if (!declared.length && portfolio?.goal.includes('specialisation'))
            notes.push('card sells this as a specialisation but PLAN_RULES declares no specialisation group, so nothing checks it');
        if (declared.length) {
            const leads = specRank === 1;
            const exposuresOk = specExposures >= required;
            specialisationVerdict = leads && exposuresOk ? 'holds'
                : (specRank <= 3 && exposuresOk) || (leads && !exposuresOk) ? 'partial'
                : 'misses';
            if (!leads)
                notes.push(`declared ${declared.join('/')} ranks #${specRank} — ${ranked[0][0]} leads at ${round(ranked[0][1], 1)} sets`);
            if (!exposuresOk)
                notes.push(`${specExposures} weekly exposures, rule wants ${required}`);
        }

        /*
         * Card decisions already taken with the owner count as the declaration.
         * Without this the report keeps flagging a mismatch that has been
         * resolved — the plan is measured against the rating it is *getting*,
         * not the one it shipped with.
         */
        const cards = DECISIONS[r.planId]?.cardChanges ?? [];
        const fatigueCard = cards.find(c => c.field === 'fatigue');
        const experienceCard = cards.find(c => c.field === 'experience');
        if (fatigueCard) notes.push(`fatigue rating retagged ${fatigueCard.from} → ${fatigueCard.to} by decision`);
        if (experienceCard) notes.push(`retagged ${experienceCard.from} → ${experienceCard.to} by decision`);

        const declaredFatigue = fatigueCard ? Number(fatigueCard.to) : (portfolio?.fatigue ?? 0);
        const measuredFatigue = bandOf(r as any);
        const gap = measuredFatigue - declaredFatigue;
        const fatigueVerdict: Verdict = !declaredFatigue ? 'n/a'
            : Math.abs(gap) === 0 ? 'holds' : Math.abs(gap) === 1 ? 'partial' : 'misses';
        if (Math.abs(gap) >= 1)
            notes.push(`declares fatigue ${declaredFatigue}, measures ${measuredFatigue} (${m.systemic} systemic/wk, ${round(m.systemic / Math.max(1, m.days))}/session, ${m.perSetSystemic}/set)`);

        const declaredExperience = experienceCard
            ? experienceCard.to.split('+').map(x => x.trim())
            : (portfolio?.experience ?? []);
        const opensToBeginners = declaredExperience.includes('beginner');
        const advancedOnly = declaredExperience.length === 1 && declaredExperience[0] === 'advanced';
        const avgStability = round(stability / Math.max(1, total));
        const technicalShare = round(technical / Math.max(1, total), 3);

        let experienceVerdict: Verdict = 'holds';
        if (opensToBeginners) {
            if (m.setsPerSession > 22) { experienceVerdict = 'misses'; notes.push(`open to beginners at ${m.setsPerSession} sets/session`); }
            else if (avgStability > 1.8 || technicalShare > 0.75) {
                experienceVerdict = 'partial';
                notes.push(`open to beginners but stability demand ${avgStability} / ${Math.round(technicalShare * 100)}% of sets are not failure-safe`);
            }
        }
        if (advancedOnly && m.setsPerSession < 12 && measuredFatigue <= 1) {
            experienceVerdict = 'partial';
            notes.push('advanced-only, but the weekly dose sits in the catalogue\'s lightest quartile');
        }

        return {
            planId: r.planId, name: m.name,
            declaredSpecialisation: declared,
            specSets: round(specSets, 1), specShare: round(specSets / Math.max(1, m.totalSets), 3),
            specRank, specExposures, requiredExposures: required,
            topGroup: ranked[0]?.[0] ?? '—', topGroupSets: round(ranked[0]?.[1] ?? 0, 1),
            specialisationVerdict,
            declaredFatigue, measuredFatigue, fatigueVerdict,
            declaredExperience, setsPerSession: m.setsPerSession, avgStability, technicalShare,
            experienceVerdict,
            notes,
        };
    });
};

const isEntry = process.argv[1]?.replace(/\\/g, '/').endsWith('spec-fit.ts');
if (isEntry) {
    const rows = specFit();
    if (process.argv.includes('--json')) {
        console.log(JSON.stringify(rows, null, 1));
    } else {
        const mark = (v: Verdict) => v === 'holds' ? ' ok ' : v === 'partial' ? 'part' : v === 'misses' ? 'MISS' : ' -  ';
        console.log('plan                      spec        rank exp/req  fat d/m   exper   notes');
        for (const r of rows) {
            console.log(
                r.planId.padEnd(24),
                mark(r.specialisationVerdict),
                (r.declaredSpecialisation.join('+') || '—').padEnd(12).slice(0, 12),
                `#${r.specRank}`.padStart(3),
                `${r.specExposures}/${r.requiredExposures}`.padStart(5),
                mark(r.fatigueVerdict), `${r.declaredFatigue}/${r.measuredFatigue}`,
                mark(r.experienceVerdict),
                r.notes.join(' · '),
            );
        }
    }
}
