/**
 * Live UI audit: every plan, week 1 / mid / last, contrast + overflow + session text.
 * Requires `npm run dev` on http://localhost:5173/
 */
import puppeteer from 'puppeteer-core';
import * as fs from 'fs';
import * as path from 'path';
import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_META } from '../src/data/planMeta';
import { PORTFOLIO } from '../src/data/portfolio';
import type { UserProfile } from '../src/types';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:5173';
const OUT = path.resolve('output/plan-ui-audit');

type ContrastHit = {
    text: string;
    ratio: number;
    fontSize: number;
    color: string;
    background: string;
    tag: string;
    className: string;
};

const mockUser = (planId: string, week: number): UserProfile => ({
    id: 'test_workhorse',
    codeword: 'test_workhorse',
    programId: planId,
    selectedDays: [1, 2, 4, 5],
    completedSessions: 0,
    programProgress: { [planId]: { completedSessions: 0, currentWeek: week } },
    stats: {
        pausedBench: 140,
        wideGripBench: 125,
        spotoPress: 130,
        lowPinPress: 125,
        btnPress: 60,
        squat: 180,
        conventionalDeadlift: 220,
        flatBench: 140,
        standingPress: 80,
        closeGripBench: 125,
        frontSquat: 140,
        trapBarDeadlift: 200,
        hipThrust: 140,
        overheadPress: 80,
    },
    benchDominationModules: {
        tricepGiantSet: true,
        behindNeckPress: true,
        weightedPullups: true,
        accessories: true,
        legDays: true,
    },
    planPreferences: {
        [planId]: {
            scheduleMode: '4-day',
            exerciseSelections: {},
        },
    },
    houseOfIronStatus: {
        equipment: [
            { id: 'db24', type: 'dumbbell', weightKg: 24, count: 2 },
            { id: 'kb32', type: 'kettlebell', weightKg: 32, count: 1 },
        ],
        preferredType: 'dumbbell',
        acceptedLevels: {},
        earned: {},
    },
} as UserProfile);

const PAGE_PROBE = `(() => {
    const parseColor = (c) => {
        if (!c || c === 'transparent') return null;
        const m = c.match(/rgba?\\(([\\d.]+),\\s*([\\d.]+),\\s*([\\d.]+)(?:,\\s*([\\d.]+))?\\)/);
        if (!m) return null;
        return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] == null ? 1 : Number(m[4])];
    };
    const rel = (r, g, b) => {
        const f = (v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const contrast = (fg, bg) => {
        const a = fg[3];
        const mixed = [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a)];
        const L1 = rel(mixed[0], mixed[1], mixed[2]);
        const L2 = rel(bg[0], bg[1], bg[2]);
        return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    };
    const solidBg = (el) => {
        let n = el;
        while (n) {
            const bg = parseColor(getComputedStyle(n).backgroundColor);
            if (bg && bg[3] > 0.6) return bg;
            n = n.parentElement;
        }
        return parseColor(getComputedStyle(document.body).backgroundColor);
    };
    const contrastHits = [];
    const overflowHits = [];
    const tinyHits = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
        const style = getComputedStyle(node);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < 0.15) continue;
        const rect = node.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) continue;
        const text = (node.innerText || '').trim();
        if (!text || text.length > 180) continue;
        const childText = Array.from(node.children).map(c => (c.innerText || '').trim()).filter(Boolean);
        if (childText.length && childText.join('').replace(/\\s/g, '') === text.replace(/\\s/g, '')) continue;
        const color = parseColor(style.color);
        const bg = solidBg(node);
        if (color && bg) {
            const ratio = contrast(color, bg);
            const fontSize = parseFloat(style.fontSize);
            const large = fontSize >= 18 || (fontSize >= 14 && (style.fontWeight === '700' || Number(style.fontWeight) >= 700));
            const min = large ? 3 : 4.5;
            if (ratio < min && color[3] > 0.2) {
                contrastHits.push({
                    text: text.slice(0, 80),
                    ratio: Math.round(ratio * 100) / 100,
                    fontSize,
                    color: style.color,
                    background: 'rgb(' + bg[0] + ',' + bg[1] + ',' + bg[2] + ')',
                    tag: node.tagName.toLowerCase(),
                    className: String(node.className || '').slice(0, 80),
                });
            }
        }
        if (node.scrollWidth > node.clientWidth + 8 && text.length > 4) {
            overflowHits.push({ text: text.slice(0, 80), className: String(node.className || '').slice(0, 80) });
        }
        const fontSize = parseFloat(style.fontSize);
        if (fontSize > 0 && fontSize < 11 && text.length > 2) {
            tinyHits.push({ text: text.slice(0, 80), fontSize, className: String(node.className || '').slice(0, 80) });
        }
    }
    const uniq = (arr) => {
        const seen = new Set();
        return arr.filter(h => { if (seen.has(h.text)) return false; seen.add(h.text); return true; });
    };
    const heading = (document.querySelector('h1, h2') || {}).textContent || '';
    const exercises = Array.from(document.querySelectorAll('.ledger-title, h1, h2, h3')).map(el => (el.textContent || '').trim()).filter(Boolean).slice(0, 24);
    const notes = Array.from(document.querySelectorAll('.ledger-prescription, .ledger-tips')).map(el => (el.textContent || '').trim()).filter(t => t.length > 8).slice(0, 12);
    const loads = Array.from(document.querySelectorAll('input')).map(el => (el.value || '').trim()).filter(Boolean).slice(0, 20);
    const bodyText = document.body.innerText || '';
    const rawKeys = bodyText.match(/\\bt:[a-zA-Z0-9._|{}"]+/g) || [];
    const empty = /No workout|nothing here|undefined|NaN kg|\\bnull\\b/i.test(bodyText);
    return {
        heading: heading.trim(),
        exercises,
        notes,
        loads,
        rawKeys: rawKeys.slice(0, 8),
        empty,
        contrastHits: uniq(contrastHits).slice(0, 18),
        overflowHits: uniq(overflowHits).slice(0, 10),
        tinyHits: uniq(tinyHits).slice(0, 8),
        worstRatio: contrastHits.reduce((m, h) => Math.min(m, h.ratio), 99),
    };
})()`;

async function inject(page: puppeteer.Page, planId: string, week: number) {
    await page.evaluate((u) => {
        (window as any).__SET_TEST_USER__?.(u);
    }, mockUser(planId, week));
    await new Promise(r => setTimeout(r, 250));
}

async function run() {
    fs.mkdirSync(OUT, { recursive: true });
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=390,844'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });

    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof (window as any).__SET_TEST_USER__ === 'function', { timeout: 15000 });

    const all: unknown[] = [];
    const planIds = Object.keys(PLAN_REGISTRY);

    for (let i = 0; i < planIds.length; i++) {
        const planId = planIds[i];
        const config = PLAN_REGISTRY[planId];
        const allWeeks = config.program.weeks;
        const trainingWeeks = allWeeks.filter(w => w.days.some(d => d.exercises.length > 0));
        const weekCount = Math.max(
            trainingWeeks.length,
            allWeeks.length,
            PORTFOLIO.find(p => p.id === planId)?.weeks ?? 1,
        );
        const sampleWeeks = [1, Math.max(1, Math.ceil(weekCount / 2)), weekCount];
        const uniqueWeeks = [...new Set(sampleWeeks)];
        const firstTrainingDay =
            trainingWeeks[0]?.days.find(d => d.exercises.length > 0)?.dayOfWeek
            ?? 1;

        console.log(`\n[${i + 1}/${planIds.length}] ${planId} weeks ${uniqueWeeks.join(',')}`);

        await inject(page, planId, uniqueWeeks[0]);

        const pages: Record<string, unknown> = {};
        const visit = async (label: string, url: string, shot: boolean) => {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await new Promise(r => setTimeout(r, 700));
            const probe = await page.evaluate(PAGE_PROBE) as {
                heading: string;
                exercises: string[];
                notes: string[];
                loads: string[];
                rawKeys: string[];
                empty: boolean;
                contrastHits: ContrastHit[];
                overflowHits: { text: string; className: string }[];
                tinyHits: { text: string; fontSize: number; className: string }[];
                worstRatio: number;
            };
            pages[label] = probe;
            const bad = (probe.contrastHits as ContrastHit[]).length > 0 || (probe.overflowHits as unknown[]).length > 0 || probe.empty || (probe.rawKeys as string[]).length > 0;
            if (shot || bad) {
                const file = path.join(OUT, `${planId}-${label.replace(/[^\w-]/g, '_')}.png`);
                await page.screenshot({ path: file, fullPage: false });
            }
            const worst = probe.worstRatio === 99 ? 'ok' : `contrast ${probe.worstRatio}`;
            console.log(`  ${label}: ${probe.heading?.slice(0, 40) || '(no h)'} | ${worst} | hits=${(probe.contrastHits as ContrastHit[]).length} overflow=${(probe.overflowHits as unknown[]).length}`);
        };

        await visit('dashboard', `${BASE}/app/dashboard`, false);

        if (planId === '30-minute-adventure') {
            await visit('adventure', `${BASE}/app/adventure`, false);
        } else {
            for (const week of uniqueWeeks) {
                await inject(page, planId, week);
                await visit(`w${week}d${firstTrainingDay}`, `${BASE}/app/workout/${week}/${firstTrainingDay}`, false);
            }
        }

        all.push({
            planId,
            name: config.program.name,
            theme: PLAN_META[planId]?.themeClass,
            claimedWeeks: PORTFOLIO.find(p => p.id === planId)?.weeks,
            pages,
        });
    }

    await browser.close();
    const jsonPath = path.join(OUT, 'report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(all, null, 2));
    console.log(`\nWrote ${jsonPath}`);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
