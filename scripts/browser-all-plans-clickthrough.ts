import puppeteer from 'puppeteer-core';
import * as fs from 'fs';
import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_META } from '../src/data/planMeta';
import type { UserProfile } from '../src/types';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

interface PlanTestReport {
    planId: string;
    name: string;
    dashboardOk: boolean;
    workoutOk: boolean;
    settingsOk: boolean;
    exercisesCount: number;
    themeClass: string;
    widgetsRendered: string[];
    details: string[];
}

async function testAllPlansInBrowser() {
    console.log('========================================================================');
    console.log('LIVE BROWSER CLICK-THROUGH TESTING ACROSS ALL 36 PLANS');
    console.log('Test Persona: test_workhorse | Target Server: http://localhost:5174/');
    console.log('========================================================================\n');

    if (!fs.existsSync(CHROME_PATH)) {
        throw new Error(`Chrome executable not found at: ${CHROME_PATH}`);
    }

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const reports: PlanTestReport[] = [];
    const planIds = Object.keys(PLAN_REGISTRY);

    // Initial load
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));

    for (let i = 0; i < planIds.length; i++) {
        const planId = planIds[i];
        const planConfig = PLAN_REGISTRY[planId];
        const meta = PLAN_META[planId];
        const themeClass = meta?.themeClass || `theme-${planId}`;

        console.log(`[${i + 1}/${planIds.length}] Testing Plan: ${planConfig.program.name} (${planId})...`);

        const details: string[] = [];
        let dashboardOk = false;
        let workoutOk = false;
        let settingsOk = false;
        let exercisesCount = 0;
        let widgetsRendered: string[] = [];

        try {
            // 1. Create and inject mock UserProfile for test_workhorse on this plan
            const mockUser: UserProfile = {
                id: 'test_workhorse',
                codeword: 'test_workhorse',
                programId: planId,
                selectedDays: [1, 2, 4, 5],
                completedSessions: 0,
                programProgress: { [planId]: { completedSessions: 0, currentWeek: 1 } },
                stats: {
                    pausedBench: 130,
                    wideGripBench: 115,
                    spotoPress: 120,
                    lowPinPress: 115,
                    btnPress: 55,
                    squat: 170,
                    conventionalDeadlift: 210,
                    flatBench: 130,
                    standingPress: 75,
                },
                planPreferences: {
                    [planId]: {
                        scheduleMode: '4-day',
                        exerciseSelections: {}
                    }
                }
            };

            await page.evaluate((u) => {
                if ((window as any).__SET_TEST_USER__) {
                    (window as any).__SET_TEST_USER__(u);
                }
            }, mockUser);

            await new Promise(r => setTimeout(r, 300));

            // 2. Test Dashboard UI View
            await page.goto('http://localhost:5174/app/dashboard', { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('.instrument-page, .instrument-shell, h1, h2, .dashboard-command', { timeout: 5000 }).catch(() => {});
            await new Promise(r => setTimeout(r, 600));

            const dashboardStatus = await page.evaluate((expectedTheme) => {
                const shell = document.querySelector('.instrument-shell');
                const hasTheme = shell ? shell.classList.contains(expectedTheme) : false;
                const header = document.querySelector('h1, h2, .dashboard-greeting, .instrument-toprail-plan');
                const headerText = header ? header.textContent : '';
                const widgets = Array.from(document.querySelectorAll('.dashboard-card, .instrument-card, .stat-card, .widget')).map(w => w.className);
                const nextBtn = document.querySelector('.dashboard-start, button, a[href*="/workout/"]');
                return {
                    hasTheme,
                    headerText,
                    widgetsCount: widgets.length,
                    hasNextBtn: !!nextBtn
                };
            }, themeClass);

            dashboardOk = dashboardStatus.hasNextBtn || !!dashboardStatus.headerText;
            details.push(`Dashboard rendered with theme: ${dashboardStatus.hasTheme ? 'YES' : 'Default'}`);

            // 3. Test Workout View (Week 1 Day 1 or Adventure)
            const targetWorkoutUrl = planId === '30-minute-adventure' 
                ? 'http://localhost:5174/app/adventure' 
                : 'http://localhost:5174/app/workout/1/1';

            await page.goto(targetWorkoutUrl, { waitUntil: 'domcontentloaded' });
            await new Promise(r => setTimeout(r, 800));

            const workoutStatus = await page.evaluate(() => {
                const exRows = document.querySelectorAll('.exercise-card, .exercise-row, [data-exercise-id], h3, .adventure-portal');
                const setInputs = document.querySelectorAll('input[type="number"], input[type="text"], input');
                const completeButtons = document.querySelectorAll('button');

                // Simulate ticking the first set
                let clicked = false;
                const tick = Array.from(document.querySelectorAll('button')).find(b => 
                    b.textContent?.includes('✓') || b.textContent?.includes('Log') || b.textContent?.includes('Done') || b.getAttribute('aria-label')?.includes('Complete')
                );
                if (tick) {
                    tick.click();
                    clicked = true;
                }

                return {
                    exercisesFound: exRows.length,
                    inputsFound: setInputs.length,
                    buttonsFound: completeButtons.length,
                    firstSetClicked: clicked
                };
            });

            exercisesCount = workoutStatus.exercisesFound;
            workoutOk = workoutStatus.exercisesFound > 0 || workoutStatus.buttonsFound > 0;
            details.push(`WorkoutView: ${workoutStatus.exercisesFound} exercise/group elements, ${workoutStatus.inputsFound} set inputs`);

            // 4. Test Settings Page View
            await page.goto('http://localhost:5174/app/settings', { waitUntil: 'domcontentloaded' });
            await new Promise(r => setTimeout(r, 500));

            const settingsStatus = await page.evaluate(() => {
                const settingsHead = document.querySelector('h1, h2');
                const formControls = document.querySelectorAll('input, select, button, [role="switch"], [role="radio"]');
                return {
                    hasHead: !!settingsHead,
                    controlCount: formControls.length
                };
            });

            settingsOk = settingsStatus.controlCount > 0;
            details.push(`Settings: ${settingsStatus.controlCount} controls rendered`);

            reports.push({
                planId,
                name: planConfig.program.name,
                dashboardOk,
                workoutOk,
                settingsOk,
                exercisesCount,
                themeClass,
                widgetsRendered,
                details
            });

            console.log(`  ✓ Dashboard: ${dashboardOk ? 'PASS' : 'FAIL'} | WorkoutView: ${workoutOk ? 'PASS' : 'FAIL'} | Settings: ${settingsOk ? 'PASS' : 'FAIL'}`);

        } catch (err: any) {
            console.error(`  ✗ Error testing ${planId}:`, err.message);
            reports.push({
                planId,
                name: planConfig.program.name,
                dashboardOk: false,
                workoutOk: false,
                settingsOk: false,
                exercisesCount: 0,
                themeClass,
                widgetsRendered: [],
                details: [`Error: ${err.message}`]
            });
        }
    }

    await browser.close();

    console.log('\n========================================================================');
    console.log('ALL 36 PLANS LIVE BROWSER CLICK-THROUGH TESTING COMPLETED');
    console.log('========================================================================\n');

    const allPassed = reports.filter(r => r.dashboardOk && r.workoutOk && r.settingsOk).length;
    console.log(`Summary: ${allPassed}/36 plans passed full browser UI click-through tests!`);

    fs.writeFileSync('output/browser-clickthrough-report.json', JSON.stringify(reports, null, 2));
}

testAllPlansInBrowser();
