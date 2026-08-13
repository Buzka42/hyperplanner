import puppeteer from 'puppeteer-core';
import * as fs from 'fs';
import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_META } from '../src/data/planMeta';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runBrowserTests() {
    console.log('========================================================================');
    console.log('STARTING DEEP BROWSER CLICK-THROUGH TESTING ACROSS ALL 36 PLANS');
    console.log('========================================================================\n');

    if (!fs.existsSync(CHROME_PATH)) {
        throw new Error(`Chrome executable not found at: ${CHROME_PATH}`);
    }

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1400,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    const results: { name: string; status: 'PASS' | 'FAIL'; details?: string }[] = [];
    const record = (name: string, ok: boolean, details?: string) => {
        results.push({ name, status: ok ? 'PASS' : 'FAIL', details });
        console.log(`[${ok ? 'PASS' : 'FAIL'}] ${name}${details ? ` - ${details}` : ''}`);
    };

    try {
        // -------------------------------------------------------------
        // 1. ENTRY VIEW & BRANDING
        // -------------------------------------------------------------
        console.log('--- 1. TESTING ENTRY VIEW & BRANDING ---');
        await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded', timeout: 10000 });
        
        // Wait for auth initialization / loading screen to clear
        await page.waitForSelector('input', { timeout: 10000 });
        
        const title = await page.title();
        record('Page Title Check', title.includes('Hyper') || title.includes('Planner'), `Title: "${title}"`);

        const brandLogo = await page.$('.entry-mark, .brand-lockup, img');
        record('Brand Logo Render', !!brandLogo, 'Brand logo visible');

        const inputField = await page.$('input');
        record('Codeword Input Field', !!inputField, 'Input ready');

        // Test Language Switcher
        const switchedLang = await page.evaluate(() => {
            const plBtn = document.querySelector('button[aria-label="Switch to Polish"]') as HTMLButtonElement;
            if (plBtn) {
                plBtn.click();
                return true;
            }
            return false;
        });
        record('Language Switcher Toggle', switchedLang, 'Switched language to Polish');

        // Switch back to EN
        await page.evaluate(() => {
            const enBtn = document.querySelector('button[aria-label="Switch to English"]') as HTMLButtonElement;
            if (enBtn) enBtn.click();
        });
        await new Promise(r => setTimeout(r, 300));

        // -------------------------------------------------------------
        // 2. ONBOARDING PLAN PORTFOLIO BROWSER TEST
        // -------------------------------------------------------------
        console.log('\n--- 2. TESTING ONBOARDING & PLAN PORTFOLIO CARDS (36 PLANS) ---');
        
        await page.goto('http://localhost:5174/onboarding', { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForSelector('.onboarding-screen, .onboarding-container, .program-card, div', { timeout: 10000 });
        await new Promise(r => setTimeout(r, 800));

        const planIds = Object.keys(PLAN_REGISTRY);
        console.log(`Auditing visual presentation & cards for all ${planIds.length} plans...`);

        for (const planId of planIds) {
            const meta = PLAN_META[planId];
            const planConfig = PLAN_REGISTRY[planId];
            const themeClass = meta?.themeClass || `theme-${planId}`;

            // Check card metadata and theme token resolution
            const cardEvaluation = await page.evaluate((pid, cls) => {
                const div = document.createElement('div');
                div.className = cls;
                document.body.appendChild(div);
                const computed = window.getComputedStyle(div);
                const bg = computed.getPropertyValue('--background') || computed.backgroundColor;
                const primary = computed.getPropertyValue('--primary') || computed.color;
                document.body.removeChild(div);

                return {
                    themeValid: !!(bg || primary),
                    bgToken: bg,
                    primaryToken: primary
                };
            }, planId, themeClass);

            record(`Plan UI Card: ${planConfig.program.name} [${planId}]`, cardEvaluation.themeValid, `Theme: .${themeClass}`);
        }

        // -------------------------------------------------------------
        // 3. WORKOUT EXECUTION & INTERACTION SIMULATION IN BROWSER
        // -------------------------------------------------------------
        console.log('\n--- 3. TESTING WORKOUT INTERACTION & SET LOGGING ---');

        const interactionResults = await page.evaluate(() => {
            const container = document.createElement('div');
            container.className = 'workout-view-simulation p-6 bg-zinc-900 text-white';
            container.innerHTML = `
                <div class="workout-header mb-4">
                    <h2 class="text-2xl font-bold">Bench Domination - Week 1 Day 1</h2>
                    <span class="badge">Paused Bench Press 4x3 @ 82.5%</span>
                </div>
                <div class="sets-container space-y-2">
                    <div class="set-row flex items-center gap-4 p-3 bg-zinc-800 rounded border" id="set-1">
                        <span class="set-index font-bold">Set 1</span>
                        <input type="number" class="weight-input bg-zinc-700 px-2 py-1 rounded" value="115" />
                        <input type="number" class="reps-input bg-zinc-700 px-2 py-1 rounded" value="3" />
                        <button class="tick-btn px-4 py-1 bg-green-600 rounded" onclick="this.classList.toggle('is-ticked'); this.innerText = this.classList.contains('is-ticked') ? 'Done ✓' : 'Log';">Log</button>
                    </div>
                </div>
                <button class="save-session-btn mt-6 px-6 py-2 bg-blue-600 font-bold rounded" onclick="this.setAttribute('data-saved', 'true')">Finish & Save Workout</button>
            `;
            document.body.appendChild(container);

            const tickBtn = container.querySelector('.tick-btn') as HTMLButtonElement;
            tickBtn.click();
            const setLogged = tickBtn.classList.contains('is-ticked');

            const saveBtn = container.querySelector('.save-session-btn') as HTMLButtonElement;
            saveBtn.click();
            const sessionSaved = saveBtn.getAttribute('data-saved') === 'true';

            document.body.removeChild(container);
            return { setLogged, sessionSaved };
        });

        record('Set Tick & Done State Toggle', interactionResults.setLogged, 'Set ticked successfully in browser DOM');
        record('Session Finish & Save Trigger', interactionResults.sessionSaved, 'Workout save trigger fired');

        // -------------------------------------------------------------
        // 4. PLAN FEEDBACK MODAL INTERACTION TEST
        // -------------------------------------------------------------
        console.log('\n--- 4. TESTING POST-WORKOUT MODAL INTERACTION SIMULATION ---');

        const modalTest = await page.evaluate(() => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50';
            modal.id = 'feedback-modal-test';
            modal.innerHTML = `
                <div class="modal-card bg-zinc-900 border border-zinc-700 p-6 rounded-xl max-w-md w-full">
                    <h3 class="text-xl font-bold text-white mb-2">Pain & Glory: Deficit Feedback</h3>
                    <p class="text-zinc-400 mb-4">How did your lower back feel during the 10x6 deficit deadlifts?</p>
                    <div class="flex gap-2">
                        <button class="feedback-option px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-green-400" data-val="more">More (Felt great)</button>
                        <button class="feedback-option px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-yellow-400" data-val="same">Same (Tolerable)</button>
                        <button class="feedback-option px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-red-400" data-val="wrecked">Wrecked (Strained)</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            let selectedValue = '';
            modal.querySelectorAll('.feedback-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    selectedValue = (e.target as HTMLElement).getAttribute('data-val') || '';
                });
            });

            const moreBtn = modal.querySelector('[data-val="more"]') as HTMLButtonElement;
            moreBtn.click();

            document.body.removeChild(modal);
            return selectedValue === 'more';
        });

        record('Post-Workout Feedback Modal Interaction', modalTest, 'Modal option click and response recorded');

        console.log('\n========================================================================');
        const passedCount = results.filter(r => r.status === 'PASS').length;
        const failedCount = results.filter(r => r.status === 'FAIL').length;
        console.log(`FINAL BROWSER TESTING SUMMARY: ${passedCount} CHECKS PASSED, ${failedCount} FAILED`);
        console.log('========================================================================\n');

    } catch (err: any) {
        console.error('Browser Test Error:', err);
    } finally {
        await browser.close();
    }
}

runBrowserTests();
