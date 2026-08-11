import { canonicalPlanId } from './planIds';

/**
 * Plan presentation metadata — the single source of truth for everything about
 * a plan that isn't its training content.
 *
 * Before this existed, the plan id list was duplicated in four places
 * (plans.ts, firestore.rules validPlanIds(), ProtectedLayout's PROGRAM_UI, and
 * ten hand-written onboarding cards), so adding a plan meant editing four files
 * and hoping you didn't miss one. `npm run verify:registry` now fails the build
 * if they drift.
 *
 * Adding a plan = one entry here + one PLAN_REGISTRY entry + one line in
 * firestore.rules validPlanIds().
 */

export type PlanMeta = {
    id: string;
    /**
     * Key suffix under `onboarding.programs.*` in translations.ts, used for the
     * localized name, description and feature bullets.
     */
    i18nKey: string;
    /** Theme class applied to the app shell for this plan. */
    themeClass: string;
    /** Sidebar mark and onboarding card artwork. */
    logo: string;
    /** Onboarding card backdrop. Adventure uses its own near-black violet. */
    coverBg: string;
    /** Scrim over the card artwork so the title stays legible. Matches coverBg. */
    coverGradient: string;
    /** Shown with a FREE badge and always included in every access key. */
    alwaysFree?: boolean;
    /** Display order in onboarding. */
    order: number;
};

export const PLAN_META: Record<string, PlanMeta> = {
    'bench-domination': {
        id: 'bench-domination',
        i18nKey: 'benchDomination',
        themeClass: 'theme-bench-domination',
        logo: '/benchdomination.png',
        coverBg: 'bg-black',
        coverGradient: 'from-black/90',
        order: 1
    },
    'pencilneck-eradication': {
        id: 'pencilneck-eradication',
        i18nKey: 'pencilneck',
        themeClass: 'theme-pencilneck',
        logo: '/pencilneck.png',
        coverBg: 'bg-black',
        coverGradient: 'from-black/90',
        order: 2
    },
    'skeleton-to-threat': {
        id: 'skeleton-to-threat',
        i18nKey: 'skeleton',
        themeClass: 'theme-skeleton',
        logo: '/SKELETON.png',
        coverBg: 'bg-black',
        coverGradient: 'from-black/90',
        order: 3
    },
    'peachy-glute-plan': {
        id: 'peachy-glute-plan',
        i18nKey: 'peachy',
        themeClass: 'theme-peachy',
        logo: '/peachy.png',
        coverBg: 'bg-black',
        coverGradient: 'from-black/90',
        order: 4
    },
    'pain-and-glory': {
        id: 'pain-and-glory',
        i18nKey: 'painGlory',
        themeClass: 'theme-pain-glory',
        logo: '/painglory.png',
        coverBg: 'bg-black',
        coverGradient: 'from-black/90',
        order: 5
    },
    'trinary': {
        id: 'trinary',
        i18nKey: 'trinary',
        themeClass: 'theme-trinary',
        logo: '/trinary.png',
        coverBg: 'bg-black',
        coverGradient: 'from-black/90',
        order: 6
    },
    'ritual-of-strength': {
        id: 'ritual-of-strength',
        i18nKey: 'ritualOfStrength',
        themeClass: 'theme-ritual',
        logo: '/ritual.png',
        coverBg: 'bg-black',
        coverGradient: 'from-black/90',
        order: 7
    },
    'super-mutant': {
        id: 'super-mutant',
        i18nKey: 'superMutant',
        themeClass: 'theme-super-mutant',
        logo: '/supermutant.png',
        coverBg: 'bg-black',
        coverGradient: 'from-black/90',
        order: 8
    },
    '30-minute-adventure': {
        id: '30-minute-adventure',
        i18nKey: 'adventure',
        themeClass: 'theme-adventure',
        logo: '/30min.png',
        coverBg: 'bg-[#080617]',
        coverGradient: 'from-[#080617]',
        alwaysFree: true,
        order: 9
    },
    'king-of-the-squat': {
        id: 'king-of-the-squat',
        i18nKey: 'kingOfTheSquat',
        themeClass: 'theme-king-of-the-squat',
        logo: '/squatking.png',
        coverBg: 'bg-[#0a0705]',
        coverGradient: 'from-[#0a0705]',
        order: 10
    },
    'gravity-is-optional': {
        id: 'gravity-is-optional',
        i18nKey: 'gravityIsOptional',
        themeClass: 'theme-gravity-is-optional',
        logo: '/gravityoptional.png',
        coverBg: 'bg-[#0a0a0a]',
        coverGradient: 'from-[#0a0a0a]',
        order: 11
    },
    'purgatorio': {
        id: 'purgatorio',
        i18nKey: 'purgatorio',
        themeClass: 'theme-purgatorio',
        logo: '/purgatorio.png',
        coverBg: 'bg-[#0a0806]',
        coverGradient: 'from-[#0a0806]',
        order: 12
    },
    'immaculate-restructure': {
        id: 'immaculate-restructure',
        i18nKey: 'immaculateRestructure',
        themeClass: 'theme-immaculate-restructure',
        logo: '/imamculate.png',
        coverBg: 'bg-[#0a0906]',
        coverGradient: 'from-[#0a0906]',
        order: 13
    },
    'overhead-dominion': {
        id: 'overhead-dominion',
        i18nKey: 'overheadDominion',
        themeClass: 'theme-overhead-dominion',
        logo: '/dominion.png',
        coverBg: 'bg-[#070705]',
        coverGradient: 'from-[#070705]',
        order: 14
    },
    'hamstring-foundry': {
        id: 'hamstring-foundry',
        i18nKey: 'hamstringFoundry',
        themeClass: 'theme-hamstring-foundry',
        logo: '/hamstringfoundry.png',
        coverBg: 'bg-[#0a0503]',
        coverGradient: 'from-[#0a0503]',
        order: 15
    },
    'arms-race': {
        id: 'arms-race',
        i18nKey: 'armsRace',
        themeClass: 'theme-arms-race',
        logo: '/armsrace.png',
        coverBg: 'bg-[#0a0705]',
        coverGradient: 'from-[#0a0705]',
        order: 16
    },
    'workhorse': {
        id: 'workhorse',
        i18nKey: 'workhorse',
        themeClass: 'theme-workhorse',
        logo: '/workhorse.png',
        coverBg: 'bg-[#080604]',
        coverGradient: 'from-[#080604]',
        order: 17
    },
    'neural-overload': {
        id: 'neural-overload',
        i18nKey: 'neuralOverload',
        themeClass: 'theme-neural-overload',
        logo: '/neuraloverload.png',
        coverBg: 'bg-[#0a0a05]',
        coverGradient: 'from-[#0a0a05]',
        order: 18
    },
    'tenfold': {
        id: 'tenfold',
        i18nKey: 'tenfold',
        themeClass: 'theme-tenfold',
        logo: '/tenfold.png',
        coverBg: 'bg-[#0a0808]',
        coverGradient: 'from-[#0a0808]',
        order: 19
    },
    'house-of-iron': {
        id: 'house-of-iron',
        i18nKey: 'houseOfIron',
        themeClass: 'theme-house-of-iron',
        logo: '/houseofiron.png',
        coverBg: 'bg-[#090805]',
        coverGradient: 'from-[#090805]',
        order: 20
    },
    'apex-predator': {
        id: 'apex-predator',
        i18nKey: 'apexPredator',
        themeClass: 'theme-apex-predator',
        logo: '/apexpredator.png',
        coverBg: 'bg-[#071014]',
        coverGradient: 'from-[#071014]',
        order: 21
    },
    'venus-rising': {
        id: 'venus-rising', i18nKey: 'venusRising', themeClass: 'theme-venus-rising', logo: '/venusrising.png',
        coverBg: 'bg-[#12080e]', coverGradient: 'from-[#12080e]', order: 22
    },
    'athena': {
        id: 'athena', i18nKey: 'athena', themeClass: 'theme-athena', logo: '/athena.png',
        coverBg: 'bg-[#080d14]', coverGradient: 'from-[#080d14]', order: 23
    },
    'kali': { id: 'kali', i18nKey: 'kali', themeClass: 'theme-kali', logo: '/kali.png', coverBg: 'bg-[#100405]', coverGradient: 'from-[#100405]', order: 24
    },
    'redline': {
        id: 'redline', i18nKey: 'redline', themeClass: 'theme-redline', logo: '/redline.png',
        coverBg: 'bg-[#0a0a0a]', coverGradient: 'from-[#0a0a0a]', order: 25
    },
    'iron-clock': {
        id: 'iron-clock', i18nKey: 'ironClock', themeClass: 'theme-iron-clock', logo: '/ironclock.png',
        coverBg: 'bg-[#0e0b07]', coverGradient: 'from-[#0e0b07]', order: 26
    },
    'the-minimum': {
        id: 'the-minimum', i18nKey: 'theMinimum', themeClass: 'theme-the-minimum', logo: '/minimum.png',
        coverBg: 'bg-[#0a0d0d]', coverGradient: 'from-[#0a0d0d]', order: 27
    },
    'lazarus': {
        id: 'lazarus', i18nKey: 'lazarus', themeClass: 'theme-lazarus', logo: '/lazarus.png',
        coverBg: 'bg-[#080b0d]', coverGradient: 'from-[#080b0d]', order: 28
    },
    'quadfather': {
        id: 'quadfather', i18nKey: 'quadfather', themeClass: 'theme-quadfather', logo: '/quadfather.png',
        coverBg: 'bg-[#0f0a06]', coverGradient: 'from-[#0f0a06]', order: 29
    },
    'cathedral': {
        id: 'cathedral', i18nKey: 'cathedral', themeClass: 'theme-cathedral', logo: '/cathedral.png',
        coverBg: 'bg-[#0a0810]', coverGradient: 'from-[#0a0810]', order: 30
    },
    'blackout': {
        id: 'blackout', i18nKey: 'blackout', themeClass: 'theme-blackout', logo: '/blackout.png',
        coverBg: 'bg-[#070707]', coverGradient: 'from-[#070707]', order: 31
    },
    'monolith': {
        id: 'monolith', i18nKey: 'monolith', themeClass: 'theme-monolith', logo: '/monolith.png',
        coverBg: 'bg-[#080a0b]', coverGradient: 'from-[#080a0b]', order: 32
    },
    'atlas': {
        id: 'atlas', i18nKey: 'atlas', themeClass: 'theme-atlas', logo: '/atlas.png',
        coverBg: 'bg-[#0d0a06]', coverGradient: 'from-[#0d0a06]', order: 33
    },
    'event-horizon': {
        id: 'event-horizon', i18nKey: 'eventHorizon', themeClass: 'theme-event-horizon', logo: '/eventhorizon.png',
        coverBg: 'bg-[#0a070d]', coverGradient: 'from-[#0a070d]', order: 34
    },
    'project-chimera': {
        id: 'project-chimera', i18nKey: 'projectChimera', themeClass: 'theme-project-chimera', logo: '/projectchimera.png',
        coverBg: 'bg-[#060a07]', coverGradient: 'from-[#060a07]', order: 35
    },
    'oracle': {
        id: 'oracle', i18nKey: 'oracle', themeClass: 'theme-oracle', logo: '/oracle.png',
        coverBg: 'bg-[#08070d]', coverGradient: 'from-[#08070d]', order: 36
    }
};

/** Every plan id, in onboarding display order. */
export const PLAN_IDS = Object.values(PLAN_META)
    .sort((a, b) => a.order - b.order)
    .map(meta => meta.id);

/** Plans in display order. */
export const ORDERED_PLAN_META = Object.values(PLAN_META).sort((a, b) => a.order - b.order);

/**
 * Falls back to Bench Domination so a stale/unknown programId can't blank the
 * shell. Pre-rename ids resolve through `canonicalPlanId`, so an athlete whose
 * document still says `the-weakest-link` keeps their artwork and theme.
 */
export const getPlanMeta = (planId?: string): PlanMeta =>
    (planId && PLAN_META[canonicalPlanId(planId)!]) || PLAN_META['bench-domination'];
