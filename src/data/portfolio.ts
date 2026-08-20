/**
 * The portfolio matrix.
 *
 * One row per plan, describing what it is for rather than what it contains.
 * Two plans may share a broad goal — several do — as long as the method or the
 * training experience they assume genuinely differ; that difference is what
 * `signatureMechanic` and `experience` are for.
 *
 * `notForYouIf` is the most useful column and the easiest to write badly. It
 * should name a real reason to walk away, not a disclaimer.
 */

import { PLAN_IDS } from './planMeta';

export type Goal = 'strength' | 'hypertrophy' | 'specialisation' | 'conditioning' | 'return' | 'assessment' | 'general';
export type Experience = 'beginner' | 'intermediate' | 'advanced';
export type Equipment = 'full-gym' | 'machines' | 'minimal' | 'barbell';
/** How much the plan changes itself in response to the athlete. */
export type Adaptability = 'fixed' | 'responsive' | 'adaptive';
/** Systemic cost of a normal week, on the shared 0–4 ordinal. */
export type FatigueCost = 1 | 2 | 3 | 4;

export interface PortfolioEntry {
    id: string;
    goal: Goal[];
    experience: Experience[];
    /** Sessions per week the plan actually requires. */
    frequency: number[];
    weeks: number;
    equipment: Equipment[];
    adaptability: Adaptability;
    fatigue: FatigueCost;
    /** The one thing this plan does that no other plan does the same way. */
    signatureMechanic: string;
    prerequisites: string[];
    notForYouIf: string[];
    /** Plans worth considering after finishing this one. */
    followUps: string[];
    /** Omit from onboarding and the plan finder. The registry row stays. */
    hiddenFromCatalogue?: boolean;
}

export const PORTFOLIO: PortfolioEntry[] = [
    {
        id: 'bench-domination', goal: ['strength', 'specialisation'], experience: ['intermediate', 'advanced'],
        frequency: [4], weeks: 16, equipment: ['barbell', 'full-gym'], adaptability: 'responsive', fatigue: 3,
        signatureMechanic: 'Percentage bench work off five separate press maxes, with modules you switch off when life gets busy.',
        prerequisites: ['A tested or confident paused bench max'],
        notForYouIf: ['You want balanced development — this is a bench plan first', 'You cannot train four days most weeks'],
        followUps: ['trinary', 'ritual-of-strength', 'neural-overload'],
    },
    {
        id: 'pencilneck-eradication', goal: ['hypertrophy'], experience: ['intermediate'],
        frequency: [4], weeks: 8, equipment: ['full-gym'], adaptability: 'fixed', fatigue: 2,
        signatureMechanic: 'Classic bodybuilding split run in repeatable eight-week cycles.',
        prerequisites: [],
        notForYouIf: ['You want your squat and deadlift to go up — legs are maintained, not pushed'],
        followUps: ['super-mutant', 'tenfold', 'event-horizon'],
    },
    {
        id: 'skeleton-to-threat', goal: ['general', 'hypertrophy'], experience: ['beginner'],
        frequency: [3], weeks: 12, equipment: ['full-gym'], adaptability: 'fixed', fatigue: 2,
        signatureMechanic: 'Full-body beginner progression that adds load whenever the last session was clean.',
        prerequisites: [],
        notForYouIf: ['You already train and progress — you will outgrow the jumps in a fortnight'],
        followUps: ['pencilneck-eradication', 'the-minimum', 'athena'],
    },
    {
        id: 'peachy-glute-plan', goal: ['specialisation', 'hypertrophy'], experience: ['beginner', 'intermediate'],
        frequency: [4], weeks: 12, equipment: ['full-gym'], adaptability: 'fixed', fatigue: 2,
        signatureMechanic: 'Glute specialisation with a measurement widget and a hip-thrust progression that actually loads.',
        prerequisites: [],
        notForYouIf: ['You want upper-body development in the same block'],
        followUps: ['venus-rising', 'quadfather', 'event-horizon'],
    },
    {
        id: 'pain-and-glory', goal: ['strength', 'specialisation'], experience: ['intermediate', 'advanced'],
        frequency: [4], weeks: 16, equipment: ['barbell', 'full-gym'], adaptability: 'responsive', fatigue: 4,
        signatureMechanic: 'Deadlift specialisation where the deficit work is dosed by how wrecked the last one left you.',
        prerequisites: ['A conventional deadlift max you trust', 'Tolerance for heavy pulling'],
        notForYouIf: ['Your lower back is your limiting factor', 'You want a plan that goes easy on you'],
        followUps: ['trinary', 'atlas', 'ritual-of-strength'],
    },
    {
        id: 'trinary', goal: ['strength'], experience: ['advanced'],
        frequency: [3, 4], weeks: 9, equipment: ['barbell', 'full-gym'], adaptability: 'adaptive', fatigue: 4,
        signatureMechanic: 'Conjugate rotation driven by the weak point you name for each lift.',
        prerequisites: ['Competent squat, bench and deadlift technique', 'At least a year of structured training'],
        notForYouIf: ['You want a fixed weekly template', 'You cannot judge your own weak points honestly'],
        followUps: ['ritual-of-strength', 'blackout', 'oracle'],
    },
    {
        id: 'ritual-of-strength', goal: ['strength'], experience: ['intermediate', 'advanced'],
        frequency: [3, 4], weeks: 19, equipment: ['barbell', 'full-gym'], adaptability: 'responsive', fatigue: 4,
        signatureMechanic: 'High-frequency powerlifting: the competition lifts most days, autoregulated by feel.',
        prerequisites: ['Solid technique under fatigue', 'Time for three sessions a week — four if you add the optional day'],
        notForYouIf: ['You train two days a week', 'You need long recovery between heavy sessions'],
        followUps: ['trinary', 'blackout', 'oracle'],
    },
    {
        id: 'super-mutant', goal: ['hypertrophy'], experience: ['advanced'],
        frequency: [4, 5, 6], weeks: 14, equipment: ['full-gym'], adaptability: 'adaptive', fatigue: 4,
        signatureMechanic: 'A session queue that picks what to train from rolling volume and how long each muscle has rested.',
        prerequisites: ['Enough training history to handle failure work', 'A flexible schedule'],
        notForYouIf: ['You want to know on Sunday what Thursday looks like'],
        followUps: ['event-horizon', 'monolith', 'project-chimera'],
    },
    {
        id: '30-minute-adventure', goal: ['general', 'conditioning'], experience: ['beginner', 'intermediate'],
        frequency: [2, 3, 4], weeks: 4, equipment: ['full-gym', 'minimal'], adaptability: 'fixed', fatigue: 1,
        signatureMechanic: 'Pick-a-path sessions that fit in half an hour and never repeat the same pairing twice.',
        prerequisites: [],
        notForYouIf: ['You are chasing a specific strength or size target'],
        followUps: ['the-minimum', 'skeleton-to-threat', 'house-of-iron'],
    },
    {
        id: 'king-of-the-squat', goal: ['strength', 'specialisation'], experience: ['intermediate', 'advanced'],
        frequency: [4], weeks: 12, equipment: ['barbell', 'full-gym'], adaptability: 'fixed', fatigue: 4,
        signatureMechanic: 'Squat three times a week with the accessories chosen to hold the position, not to add volume.',
        prerequisites: ['A squat you can load without technical breakdown'],
        notForYouIf: ['Your knees or hips are the reason you are reading this'],
        followUps: ['quadfather', 'atlas', 'trinary'],
    },
    {
        id: 'gravity-is-optional', goal: ['hypertrophy', 'strength'], experience: ['intermediate'],
        frequency: [4], weeks: 12, equipment: ['minimal', 'full-gym'], adaptability: 'fixed', fatigue: 3,
        signatureMechanic: 'Weighted calisthenics counted as total system weight, so bodyweight progress is visible.',
        prerequisites: ['Five strict pull-ups and ten strict dips'],
        notForYouIf: ['You cannot yet perform the entry movements'],
        followUps: ['workhorse', 'atlas', 'monolith'],
    },
    {
        id: 'purgatorio', goal: ['hypertrophy', 'conditioning'], experience: ['intermediate', 'advanced'],
        frequency: [4], weeks: 12, equipment: ['full-gym'], adaptability: 'fixed', fatigue: 4,
        signatureMechanic: 'Sustained high-rep suffering with the rest periods as the prescription.',
        prerequisites: ['A base of general fitness'],
        notForYouIf: ['You are trying to add maximal strength', 'You dislike training near failure'],
        followUps: ['redline', 'event-horizon'],
    },
    {
        id: 'immaculate-restructure', goal: ['hypertrophy'], experience: ['intermediate'],
        frequency: [4], weeks: 10, equipment: ['full-gym'], adaptability: 'fixed', fatigue: 3,
        signatureMechanic: 'Proportion-led rebuild: the weakest region gets the frequency, everything else holds.',
        prerequisites: ['A year or so of consistent training'],
        notForYouIf: ['You have no clear structural weak point yet'],
        followUps: ['event-horizon', 'project-chimera', 'monolith'],
    },
    {
        id: 'overhead-dominion', goal: ['specialisation', 'strength'], experience: ['intermediate', 'advanced'],
        frequency: [4], weeks: 10, equipment: ['barbell', 'full-gym'], adaptability: 'fixed', fatigue: 3,
        signatureMechanic: 'Shoulder specialisation built on the standing press four times a week.',
        prerequisites: ['Comfortable overhead position'],
        notForYouIf: ['Overhead pressing is where your shoulder complains'],
        followUps: ['atlas', 'monolith', 'cathedral'],
    },
    {
        id: 'hamstring-foundry', goal: ['specialisation', 'hypertrophy'], experience: ['intermediate'],
        frequency: [4], weeks: 10, equipment: ['full-gym'], adaptability: 'fixed', fatigue: 3,
        signatureMechanic: 'Hamstrings by both functions — knee flexion and hip extension — three times weekly.',
        prerequisites: [],
        notForYouIf: ['You want your quads to grow in the same block'],
        followUps: ['pain-and-glory', 'quadfather', 'event-horizon'],
    },
    {
        id: 'arms-race', goal: ['specialisation', 'hypertrophy'], experience: ['intermediate'],
        frequency: [3, 4], weeks: 8, equipment: ['full-gym'], adaptability: 'fixed', fatigue: 2,
        signatureMechanic: 'A three-session rotation run every other day, with an optional fourth go-nuclear session of giant sets.',
        prerequisites: [],
        notForYouIf: ['Your compounds are the thing that needs work'],
        followUps: ['pencilneck-eradication', 'monolith', 'cathedral'],
    },
    {
        id: 'workhorse', goal: ['specialisation', 'hypertrophy'], experience: ['intermediate'],
        frequency: [4], weeks: 10, equipment: ['full-gym'], adaptability: 'fixed', fatigue: 3,
        signatureMechanic: 'Back specialisation that separates width, thickness and the lower lats into their own slots.',
        prerequisites: [],
        notForYouIf: ['You want a pressing-led block'],
        followUps: ['gravity-is-optional', 'atlas', 'monolith'],
    },
    {
        id: 'neural-overload', goal: ['strength', 'hypertrophy'], experience: ['advanced'],
        frequency: [4], weeks: 9, equipment: ['barbell', 'full-gym'], adaptability: 'fixed', fatigue: 4,
        signatureMechanic: 'The 1-6 method: a heavy single potentiating a set of six, twice over. Day 4’s squat is a picker — front, hack, stripper or safety-bar.',
        prerequisites: ['Confident singles', 'A training age past the beginner jumps'],
        notForYouIf: ['You are uncomfortable taking heavy singles alone'],
        followUps: ['trinary', 'blackout', 'oracle'],
    },
    {
        id: 'tenfold', goal: ['hypertrophy'], experience: ['intermediate'],
        frequency: [4], weeks: 8, equipment: ['full-gym'], adaptability: 'fixed', fatigue: 4,
        signatureMechanic: 'German volume training: ten sets of ten on exactly one lift per session.',
        prerequisites: ['Tolerance for repetitive high-volume work'],
        notForYouIf: ['You bore easily', 'Your joints object to volume before your muscles do'],
        followUps: ['purgatorio', 'event-horizon', 'monolith'],
    },
    {
        id: 'house-of-iron', goal: ['general', 'hypertrophy'], experience: ['beginner', 'intermediate'],
        frequency: [2, 3, 4], weeks: 8, equipment: ['minimal'], adaptability: 'responsive', fatigue: 3,
        signatureMechanic: 'One dumbbell or kettlebell made to last through authored difficulty ladders instead of more load.',
        prerequisites: ['At least one adjustable or moderately heavy implement — and the ability to hold a solid position under load, because every movement here is unilateral or unsupported with no machine to fall back on'],
        notForYouIf: ['You have a full gym and want to use it'],
        followUps: ['the-minimum', '30-minute-adventure', 'skeleton-to-threat'],
    },
    {
        id: 'apex-predator', goal: ['assessment', 'general'], experience: ['beginner', 'intermediate', 'advanced'],
        frequency: [3], weeks: 12, equipment: ['full-gym'], adaptability: 'adaptive', fatigue: 2,
        signatureMechanic: 'Repeatable movement assessments that turn into at most two access movements per session.',
        prerequisites: [],
        notForYouIf: ['You are in pain right now — see someone qualified first', 'You want maximum size or strength this block'],
        followUps: ['skeleton-to-threat', 'immaculate-restructure'],
    },
    {
        id: 'venus-rising', goal: ['hypertrophy', 'general'], experience: ['beginner', 'intermediate'],
        frequency: [3, 4], weeks: 12, equipment: ['full-gym'], adaptability: 'fixed', fatigue: 2,
        signatureMechanic: 'A first structured plan — lower-body led, machine and cable led, with the priorities you pick once held inside a weekly set cap.',
        prerequisites: [],
        notForYouIf: ['You want a strength-first block'],
        followUps: ['kali', 'peachy-glute-plan', 'event-horizon'],
    },
    {
        id: 'athena', goal: ['strength', 'hypertrophy'], experience: ['beginner', 'intermediate'],
        frequency: [3, 4], weeks: 12, equipment: ['barbell', 'full-gym'], adaptability: 'responsive', fatigue: 3,
        signatureMechanic: 'A bridge into heavy training: top sets with editable back-offs and no mandatory max test.',
        prerequisites: ['Basic barbell competence'],
        notForYouIf: ['You already train with percentages and know your maxes'],
        followUps: ['kali', 'oracle', 'project-chimera'],
    },
    {
        id: 'kali', goal: ['strength', 'conditioning'], experience: ['intermediate'],
        frequency: [4], weeks: 8, equipment: ['full-gym'], adaptability: 'responsive', fatigue: 3,
        signatureMechanic: 'A cutting plan that protects strength: one systemic anchor a session and preservation bands.',
        prerequisites: ['An established strength baseline to protect'],
        notForYouIf: ['You are gaining weight', 'You cannot commit to four days'],
        followUps: ['athena', 'venus-rising', 'oracle'],
    },
    {
        id: 'redline', goal: ['conditioning', 'hypertrophy'], experience: ['intermediate'],
        frequency: [4], weeks: 8, equipment: ['full-gym'], adaptability: 'responsive', fatigue: 3,
        signatureMechanic: 'Forty-to-fifty minute sessions: one heavy anchor, paired burn work, timed finishers.',
        prerequisites: ['A base of general fitness'],
        notForYouIf: ['You want long unhurried sessions', 'Your gym is too crowded to hold two stations'],
        followUps: ['kali', 'the-minimum'],
    },
    {
        id: 'iron-clock', goal: ['conditioning', 'hypertrophy'], experience: ['intermediate'],
        frequency: [3, 4], weeks: 8, equipment: ['full-gym'], adaptability: 'responsive', fatigue: 3,
        signatureMechanic: 'Density is the overload: beat the block by rounds, then by time, and only then by load.',
        prerequisites: ['Willingness to work against a clock'],
        notForYouIf: ['You want maximal strength this block', 'You cannot hold two stations at once'],
        followUps: ['redline', 'atlas', 'project-chimera'],
        hiddenFromCatalogue: true,
    },
    {
        id: 'the-minimum', goal: ['general', 'hypertrophy'], experience: ['beginner', 'intermediate'],
        frequency: [2], weeks: 10, equipment: ['full-gym'], adaptability: 'fixed', fatigue: 2,
        signatureMechanic: 'Two required sessions that cover everything, with bonus work that never becomes required.',
        prerequisites: [],
        notForYouIf: ['You have four days a week and want to use them'],
        followUps: ['pencilneck-eradication', 'athena', 'monolith'],
    },
    {
        id: 'lazarus', goal: ['return', 'general'], experience: ['intermediate', 'advanced'],
        frequency: [3], weeks: 8, equipment: ['full-gym'], adaptability: 'responsive', fatigue: 2,
        signatureMechanic: 'The Memory Curve: loads open from your last stable pre-break performance, not your best ever.',
        prerequisites: ['Previous structured training', 'At least three months away'],
        notForYouIf: ['You never stopped training', 'You are returning from an injury that still limits you'],
        followUps: ['athena', 'pencilneck-eradication', 'project-chimera'],
    },
    {
        id: 'quadfather', goal: ['specialisation', 'hypertrophy'], experience: ['intermediate'],
        frequency: [4], weeks: 10, equipment: ['full-gym'], adaptability: 'responsive', fatigue: 3,
        signatureMechanic: 'Three quad sessions doing three different jobs — load, depth and burn — never three of the same.',
        prerequisites: ['Knees that tolerate loaded knee flexion'],
        notForYouIf: ['Your posterior chain is the weak link'],
        followUps: ['king-of-the-squat', 'hamstring-foundry', 'event-horizon'],
    },
    {
        id: 'cathedral', goal: ['specialisation', 'hypertrophy'], experience: ['intermediate'],
        frequency: [4], weeks: 10, equipment: ['full-gym'], adaptability: 'responsive', fatigue: 3,
        signatureMechanic: 'Three balanced arches — press, stretch and adduction — and no barbell bench anywhere.',
        prerequisites: ['Access to dips and cable stations'],
        notForYouIf: ['You want to train the competition bench press'],
        followUps: ['bench-domination', 'monolith', 'arms-race'],
    },
    {
        id: 'blackout', goal: ['strength', 'hypertrophy'], experience: ['intermediate'],
        frequency: [3], weeks: 8, equipment: ['full-gym'], adaptability: 'responsive', fatigue: 2,
        signatureMechanic: 'One work set per movement, and a back-off you have to earn with a clean one.',
        prerequisites: ['Years of training', 'Honest self-assessment of set quality'],
        notForYouIf: ['You are still learning what a hard set feels like', 'You need volume to feel like you trained'],
        followUps: ['trinary', 'oracle', 'project-chimera'],
    },
    {
        id: 'monolith', goal: ['hypertrophy'], experience: ['beginner', 'intermediate'],
        frequency: [3], weeks: 10, equipment: ['machines', 'full-gym'], adaptability: 'fixed', fatigue: 2,
        signatureMechanic: 'Three machine-house days — Upper, Lower, Full — that keep systemic cost low: effort first, techniques much later.',
        prerequisites: ['A gym with a reasonable machine inventory'],
        notForYouIf: ['You want to get better at barbell lifts'],
        followUps: ['event-horizon', 'project-chimera', 'cathedral'],
    },
    {
        id: 'atlas', goal: ['strength', 'general'], experience: ['intermediate', 'advanced'],
        frequency: [3], weeks: 10, equipment: ['barbell', 'full-gym'], adaptability: 'fixed', fatigue: 4,
        signatureMechanic: 'Two five-week gauntlets, with carries trained as a lift and scored as time × load.',
        prerequisites: ['Trap bar or a hinge you can load', 'Somewhere you can actually walk with weight'],
        notForYouIf: ['Your gym has no space for carries', 'You want isolation-led hypertrophy'],
        followUps: ['trinary', 'pain-and-glory'],
    },
    {
        id: 'event-horizon', goal: ['hypertrophy'], experience: ['intermediate', 'advanced'],
        frequency: [4], weeks: 12, equipment: ['full-gym'], adaptability: 'adaptive', fatigue: 3,
        signatureMechanic: 'When a joint complains it finds you a cheaper way to buy the same stimulus, and asks first.',
        prerequisites: ['Enough experience to report a region honestly'],
        notForYouIf: ['You are in pain now rather than occasionally strained'],
        followUps: ['project-chimera', 'monolith', 'oracle'],
    },
    {
        id: 'project-chimera', goal: ['hypertrophy', 'strength'], experience: ['intermediate', 'advanced'],
        frequency: [4], weeks: 16, equipment: ['full-gym', 'barbell'], adaptability: 'adaptive', fatigue: 3,
        signatureMechanic: 'Four blocks that quietly reallocate a couple of sets toward whatever you respond to.',
        prerequisites: ['Sixteen weeks you can actually commit to'],
        notForYouIf: ['You want a short block', 'You will not log consistently enough to produce evidence'],
        followUps: ['oracle', 'event-horizon', 'blackout'],
    },
    {
        id: 'oracle', goal: ['general', 'assessment'], experience: ['intermediate', 'advanced'],
        frequency: [4], weeks: 10, equipment: ['full-gym', 'barbell'], adaptability: 'adaptive', fatigue: 3,
        signatureMechanic: 'It predicts your next session, states how confident it is, and shows you how close it got.',
        prerequisites: ['Consistent, honest logging including RIR'],
        notForYouIf: ['You will not report RIR', 'You want the plan to chase a single peak'],
        followUps: ['project-chimera', 'blackout', 'trinary'],
    },
];

export const PORTFOLIO_BY_ID: Record<string, PortfolioEntry> = Object.fromEntries(
    PORTFOLIO.map(entry => [entry.id, entry]),
);

/** Ids present in the registry but missing a matrix row. Should always be empty. */
export const missingFromPortfolio = (): string[] => PLAN_IDS.filter(id => !PORTFOLIO_BY_ID[id]);
