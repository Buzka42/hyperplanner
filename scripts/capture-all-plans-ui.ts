import puppeteer from 'puppeteer-core';
import * as fs from 'fs';
import * as path from 'path';
import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_META } from '../src/data/planMeta';
import type { UserProfile } from '../src/types';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve('output/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

interface DetailedPlanAudit {
    planId: string;
    name: string;
    onboardingSummary: string;
    dashboardVisuals: {
        greeting: string;
        plate: string;
        hasCustomWidgets: boolean;
        widgetNames: string[];
    };
    workoutViewVisuals: {
        title: string;
        exerciseCount: number;
        exercises: {
            title: string;
            hasTempo: boolean;
            tempoText?: string;
            hasRest: boolean;
            restText?: string;
            hasPrescriptionBadges: boolean;
            badgeText?: string;
            notes?: string;
        }[];
    };
    settingsVisuals: {
        hasPlanSettings: boolean;
        settingsControlsFound: string[];
    };
    critiqueAndObservations: string[];
}

async function auditPlansSlowAndThorough() {
    console.log('========================================================================');
    console.log('STARTING THOROUGH STEP-BY-STEP BROWSER VISUAL AUDIT & UI CLICK-THROUGH');
    console.log('Target Server: http://localhost:5174/');
    console.log('========================================================================\n');

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const audits: DetailedPlanAudit[] = [];
    const planIds = Object.keys(PLAN_REGISTRY);

    // Initial load
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));

    for (let i = 0; i < planIds.length; i++) {
        const planId = planIds[i];
        const planConfig = PLAN_REGISTRY[planId];
        const meta = PLAN_META[planId];

        console.log(`\n------------------------------------------------------------------------`);
        console.log(`[${i + 1}/${planIds.length}] STEPPING THROUGH PLAN: ${planConfig.program.name} (${planId})`);
        console.log(`------------------------------------------------------------------------`);

        const critique: string[] = [];

        // 1. Setup Athlete State
        const mockUser: UserProfile = {
            id: 'test_workhorse',
            codeword: 'test_workhorse',
            programId: planId,
            selectedDays: [1, 2, 4, 5],
            completedSessions: 0,
            programProgress: { [planId]: { completedSessions: 0, currentWeek: 1 } },
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
            },
            benchDominationModules: {
                tricepGiantSet: true,
                behindNeckPress: true,
                weightedPullups: true,
                accessories: true,
                legDays: true
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

        await new Promise(r => setTimeout(r, 500));

        // 2. Audit Dashboard
        await page.goto('http://localhost:5174/app/dashboard', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 800));

        const dashboardData = await page.evaluate(() => {
            const greeting = document.querySelector('h1, .dashboard-greeting, .dashboard-command-label')?.textContent?.trim() || '';
            const plate = document.querySelector('.plan-plate strong, .instrument-toprail-plan')?.textContent?.trim() || '';
            const widgets = Array.from(document.querySelectorAll('.dashboard-card, .instrument-card, .widget, .stat-card, section')).map(s => {
                const head = s.querySelector('h2, h3, .font-bold, p')?.textContent?.trim();
                return head || '';
            }).filter(Boolean);

            return {
                greeting,
                plate,
                hasCustomWidgets: widgets.length > 2,
                widgetNames: Array.from(new Set(widgets)).slice(0, 5)
            };
        });

        const dashScreenshotPath = path.join(SCREENSHOT_DIR, `${planId}-dashboard.png`);
        await page.screenshot({ path: dashScreenshotPath });
        console.log(`  -> Dashboard: Greeting="${dashboardData.greeting}" | Widgets=[${dashboardData.widgetNames.join(', ')}]`);

        // 3. Audit Workout View (Week 1 Day 1)
        const workoutUrl = planId === '30-minute-adventure' 
            ? 'http://localhost:5174/app/adventure' 
            : 'http://localhost:5174/app/workout/1/1';

        await page.goto(workoutUrl, { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 1000));

        const workoutData = await page.evaluate(() => {
            const title = document.querySelector('h1, h2, .workout-header')?.textContent?.trim() || '';
            const sections = Array.from(document.querySelectorAll('section')).filter(s => s.querySelector('h3, .font-bold'));
            
            const exercises = sections.map(s => {
                const exTitle = s.querySelector('h3, .font-bold, .text-lg')?.textContent?.trim() || 'Exercise';
                const tempoEl = s.querySelector('.tempo-badge, [title*="Tempo"], .text-muted-foreground');
                const tempoText = tempoEl?.textContent?.includes('Tempo') || tempoEl?.textContent?.includes('0') ? tempoEl.textContent.trim() : undefined;
                const restEl = s.querySelector('.rest-timer-badge, [title*="Rest"], .badge');
                const restText = restEl?.textContent?.includes('s') || restEl?.textContent?.includes('Rest') ? restEl.textContent.trim() : undefined;
                const badges = Array.from(s.querySelectorAll('.badge, .prescription-chip, [role="status"]')).map(b => b.textContent?.trim() || '');
                const notesEl = s.querySelector('.exercise-notes, p.text-sm, .italic');
                const notes = notesEl?.textContent?.trim();

                return {
                    title: exTitle,
                    hasTempo: !!tempoText,
                    tempoText,
                    hasRest: !!restText,
                    restText,
                    hasPrescriptionBadges: badges.length > 0,
                    badgeText: badges.join(' | '),
                    notes
                };
            });

            return {
                title,
                exerciseCount: exercises.length,
                exercises
            };
        });

        const workoutScreenshotPath = path.join(SCREENSHOT_DIR, `${planId}-workout.png`);
        await page.screenshot({ path: workoutScreenshotPath });
        console.log(`  -> WorkoutView: Prescribed ${workoutData.exerciseCount} exercises on Day 1`);

        // 4. Audit Settings
        await page.goto('http://localhost:5174/app/settings', { waitUntil: 'domcontentloaded' });
        await new Promise(r => setTimeout(r, 600));

        const settingsData = await page.evaluate(() => {
            const controls = Array.from(document.querySelectorAll('label, .card-title, h3')).map(l => l.textContent?.trim() || '').filter(Boolean);
            const planSpecific = controls.filter(c => !c.includes('Language') && !c.includes('Account') && !c.includes('Reset') && !c.includes('Danger'));
            return {
                hasPlanSettings: planSpecific.length > 0,
                settingsControlsFound: planSpecific.slice(0, 6)
            };
        });

        console.log(`  -> Settings: Custom Controls Found: ${settingsData.settingsControlsFound.length > 0 ? settingsData.settingsControlsFound.join(', ') : 'None (Empty plan settings)'}`);

        // 5. Formulate In-Depth Critique
        if (!settingsData.hasPlanSettings) {
            critique.push('Settings Page is currently blank for this plan. Needs dedicated modular toggles and variation pickers.');
        }

        if (workoutData.exerciseCount === 0) {
            critique.push('Workout view did not populate standard exercises on Day 1 (custom layout or missing seed).');
        } else {
            const missingTempos = workoutData.exercises.filter(e => !e.hasTempo).length;
            if (missingTempos > 0 && ['purgatorio', 'immaculate-restructure', 'arms-race'].includes(planId)) {
                critique.push(`Lacks explicit tempo cues on ${missingTempos} exercises where Poliquin/tempo execution is critical.`);
            }
        }

        audits.push({
            planId,
            name: planConfig.program.name,
            onboardingSummary: meta?.summary || planConfig.program.description || '',
            dashboardVisuals: dashboardData,
            workoutViewVisuals: workoutData,
            settingsVisuals: settingsData,
            critiqueAndObservations: critique
        });
    }

    await browser.close();

    fs.writeFileSync('output/full-visual-audit-report.json', JSON.stringify(audits, null, 2));
    console.log('\n========================================================================');
    console.log(`FULL BROWSER AUDIT COMPLETE: Audited all ${audits.length} plans in detail.`);
    console.log('========================================================================\n');
}

auditPlansSlowAndThorough();
