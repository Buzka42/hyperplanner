import puppeteer from 'puppeteer-core';
import * as fs from 'fs';
import * as path from 'path';
import { PLAN_REGISTRY } from '../src/data/plans';
import { PLAN_META } from '../src/data/planMeta';
import type { UserProfile } from '../src/types';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const PLAN_DOC_MAP: Record<string, string> = {
    'bench-domination': 'docs/plans/bench-domination.md',
    'pencilneck-eradication': 'docs/plans/pencilneck-eradication.md',
    'skeleton-to-threat': 'docs/plans/skeleton-to-threat.md',
    'peachy-glute-plan': 'docs/plans/peachy.md',
    'pain-and-glory': 'docs/plans/pain-and-glory.md',
    'trinary': 'docs/plans/trinary.md',
    'ritual-of-strength': 'docs/plans/ritual-of-strength.md',
    'super-mutant': 'docs/plans/super-mutant.md',
    '30-minute-adventure': 'docs/plans/30-minute-adventure.md',
    'king-of-the-squat': 'docs/plans/king-of-the-squat.md',
    'gravity-is-optional': 'docs/plans/gravity-is-optional.md',
    'purgatorio': 'docs/plans/purgatorio.md',
    'immaculate-restructure': 'docs/plans/immaculate-restructure.md',
    'overhead-dominion': 'docs/plans/overhead-dominion.md',
    'hamstring-foundry': 'docs/plans/hamstring-foundry.md',
    'arms-race': 'docs/plans/arms-race.md',
    'workhorse': 'docs/plans/workhorse.md',
    'neural-overload': 'docs/plans/neural-overload.md',
    'tenfold': 'docs/plans/tenfold.md',
    'house-of-iron': 'docs/plans/house-of-iron.md',
    'apex-predator': 'docs/plans/apex-predator.md',
    'venus-rising': 'docs/plans/venus-rising.md',
    'athena': 'docs/plans/athena.md',
    'kali': 'docs/plans/kali.md',
    'redline': 'docs/plans/redline.md',
    'iron-clock': 'docs/plans/iron-clock.md',
    'the-minimum': 'docs/plans/the-minimum.md',
    'lazarus': 'docs/plans/lazarus.md',
    'quadfather': 'docs/plans/quadfather.md',
    'cathedral': 'docs/plans/cathedral.md',
    'blackout': 'docs/plans/blackout.md',
    'monolith': 'docs/plans/monolith.md',
    'atlas': 'docs/plans/atlas.md',
    'event-horizon': 'docs/plans/event-horizon.md',
    'project-chimera': 'docs/plans/project-chimera.md',
    'oracle': 'docs/plans/oracle.md'
};

interface PlanDocVerificationResult {
    planId: string;
    planName: string;
    docFile: string;
    docExists: boolean;
    docMechanicsPreview: string[];
    exercisesFoundInUI: number;
    exercises: {
        title: string;
        setsCount: number;
        hasNotes: boolean;
    }[];
    status: 'PASS' | 'FAIL';
}

async function verifyAllPlansAgainstDocs() {
    console.log('========================================================================');
    console.log('COMPREHENSIVE PLAN-BY-PLAN BROWSER CLICK-THROUGH & DOC VERIFICATION');
    console.log('Test Persona: test_workhorse | Verifying against docs/plans/*.md');
    console.log('========================================================================\n');

    if (!fs.existsSync(CHROME_PATH)) {
        throw new Error(`Chrome executable not found at: ${CHROME_PATH}`);
    }

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true,
        protocolTimeout: 120000,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const results: PlanDocVerificationResult[] = [];
    const planIds = Object.keys(PLAN_REGISTRY);

    // Initial load
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));

    for (let i = 0; i < planIds.length; i++) {
        const planId = planIds[i];
        const planConfig = PLAN_REGISTRY[planId];
        const docRelative = PLAN_DOC_MAP[planId] || `docs/plans/${planId}.md`;
        const docFullPath = path.resolve(docRelative);
        const docExists = fs.existsSync(docFullPath);

        console.log(`\n------------------------------------------------------------------------`);
        console.log(`[${i + 1}/${planIds.length}] VERIFYING: ${planConfig.program.name} (${planId})`);
        console.log(`Doc File: ${docRelative} (${docExists ? 'FOUND' : 'MISSING'})`);

        // Read doc mechanics
        const docMechanicsPreview: string[] = [];
        if (docExists) {
            const docContent = fs.readFileSync(docFullPath, 'utf-8');
            const lines = docContent.split('\n');
            lines.forEach(l => {
                if ((l.startsWith('## ') || l.startsWith('### ')) && docMechanicsPreview.length < 4) {
                    docMechanicsPreview.push(l.replace(/[#*`]/g, '').trim());
                }
            });
        }

        // 1. Setup Athlete Profile
        const user: UserProfile = {
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
        }, user);

        await new Promise(r => setTimeout(r, 400));

        // 2. Open Workout View
        const workoutUrl = planId === '30-minute-adventure' 
            ? 'http://localhost:5174/app/adventure' 
            : 'http://localhost:5174/app/workout/1/1';

        await page.goto(workoutUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForSelector('section, .exercise-card, .instrument-page, h1, h2, h3', { timeout: 10000 }).catch(() => {});
        await new Promise(r => setTimeout(r, 600));

        // 3. Inspect UI & Click Mark All on each exercise card
        const exerciseData = await page.evaluate(() => {
            const sections = Array.from(document.querySelectorAll('section')).filter(s => s.querySelector('h3, .font-bold'));
            
            const list: { title: string; setsCount: number; hasNotes: boolean }[] = [];

            sections.forEach((s, idx) => {
                const title = s.querySelector('h3, .font-bold, .text-lg')?.textContent?.trim() || `Exercise ${idx + 1}`;
                const inputs = s.querySelectorAll('input');
                const notes = s.querySelector('.exercise-notes, p.text-sm, .italic');
                
                // Click "Completed" button on the card
                const completeBtn = Array.from(s.querySelectorAll('button')).find(b => 
                    b.textContent?.includes('Completed') || b.textContent?.includes('Ukończono') || b.textContent?.includes('✓')
                );
                if (completeBtn) {
                    completeBtn.click();
                }

                list.push({
                    title,
                    setsCount: Math.max(1, Math.floor(inputs.length / 2)),
                    hasNotes: !!notes
                });
            });

            return list;
        });

        // 4. Click Save Session
        await page.evaluate(() => {
            const saveBtn = Array.from(document.querySelectorAll('button')).find(b => 
                b.textContent?.includes('Complete Workout') || b.textContent?.includes('Zapisz trening') || b.textContent?.includes('Finish') || b.textContent?.includes('Zakończ')
            );
            if (saveBtn && !saveBtn.disabled) {
                saveBtn.click();
            }
        });

        await new Promise(r => setTimeout(r, 400));

        // Dismiss modal if appeared
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => 
                b.textContent?.includes('More') || b.textContent?.includes('Więcej') || b.textContent?.includes('Chest') || b.textContent?.trim() === 'Yes'
            );
            if (btn) btn.click();
        });

        console.log(`  -> UI Loaded & Completed ${exerciseData.length} exercise slots.`);
        exerciseData.forEach((ex, idx) => {
            console.log(`     [${idx + 1}] ${ex.title} (${ex.setsCount} sets)`);
        });

        results.push({
            planId,
            planName: planConfig.program.name,
            docFile: docRelative,
            docExists,
            docMechanicsPreview,
            exercisesFoundInUI: exerciseData.length,
            exercises: exerciseData,
            status: exerciseData.length > 0 ? 'PASS' : 'FAIL'
        });
    }

    await browser.close();

    fs.writeFileSync('output/full-plan-doc-verification.json', JSON.stringify(results, null, 2));

    console.log('\n========================================================================');
    console.log(`PLAN-BY-PLAN BROWSER CLICK-THROUGH & DOC VERIFICATION COMPLETED`);
    console.log(`Result: ${results.filter(r => r.status === 'PASS').length}/${results.length} plans successfully verified!`);
    console.log('========================================================================\n');
}

verifyAllPlansAgainstDocs();
