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
    'accumulate-intensify': {
        id: 'accumulate-intensify',
        i18nKey: 'accumulateIntensify',
        themeClass: 'theme-accumulate-intensify',
        logo: '/purgatorio.png',
        coverBg: 'bg-[#0a0806]',
        coverGradient: 'from-[#0a0806]',
        order: 12
    },
    'the-weakest-link': {
        id: 'the-weakest-link',
        i18nKey: 'theWeakestLink',
        themeClass: 'theme-the-weakest-link',
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
    'upper-body-squat': {
        id: 'upper-body-squat',
        i18nKey: 'upperBodySquat',
        themeClass: 'theme-upper-body-squat',
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
    }
};

/** Every plan id, in onboarding display order. */
export const PLAN_IDS = Object.values(PLAN_META)
    .sort((a, b) => a.order - b.order)
    .map(meta => meta.id);

/** Plans in display order. */
export const ORDERED_PLAN_META = Object.values(PLAN_META).sort((a, b) => a.order - b.order);

/** Falls back to Bench Domination so a stale/unknown programId can't blank the shell. */
export const getPlanMeta = (planId?: string): PlanMeta =>
    (planId && PLAN_META[planId]) || PLAN_META['bench-domination'];
