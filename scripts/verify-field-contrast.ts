/**
 * verify:field-contrast
 *
 * The boundary of a control has to be visible against its own background.
 * WCAG 1.4.11 puts that at 3:1, and the app ships 37 per-plan themes, so a
 * token that reads well on one can vanish on another.
 *
 * This existed because it happened: form inputs were drawn with
 * `--instrument-rule`, a divider colour measured at 1.31:1 on the dark theme.
 * On the onboarding numbers screen the fields read as static text — you could
 * not tell the 1RM was something you were meant to type into.
 *
 * `--instrument-field` is the input boundary, and this checks it composited
 * over every theme's own background.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ALPHA = 0.62;          // keep in step with --instrument-field in index.css
const MINIMUM = 3;

const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: number[]) =>
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

const hslToRgb = (h: number, s: number, l: number): number[] => {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    const table = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]];
    return table[Math.floor(h / 60) % 6].map(v => Math.round((v + m) * 255));
};

const contrast = (a: number[], b: number[]) => {
    const [l1, l2] = [luminance(a), luminance(b)];
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');

// The declared alpha must match what this file assumes, or the check is fiction.
const declared = css.match(/--instrument-field:\s*hsl\(var\(--muted-foreground\)\s*\/\s*([\d.]+)\)/);
assert.ok(declared, '--instrument-field is declared in terms of --muted-foreground');
assert.equal(Number(declared![1]), ALPHA, 'the alpha here matches the stylesheet');

// Literal regexes on purpose: built from a template string, `\s` inside the
// literal collapses to a bare `s` and the pattern silently matches nothing.
const BACKGROUND = /--background:\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/;
const MUTED = /--muted-foreground:\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/;

const triplet = (body: string, pattern: RegExp) => {
    const m = body.match(pattern);
    return m ? hslToRgb(Number(m[1]), Number(m[2]), Number(m[3])) : null;
};

let checked = 0;
const failures: string[] = [];
for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const background = triplet(body, BACKGROUND);
    const muted = triplet(body, MUTED);
    if (!background || !muted) continue;

    // The border is semi-transparent, so it must be composited over the page
    // before it is measured — the declared colour is not what the eye sees.
    const effective = muted.map((c, i) => Math.round(c * ALPHA + background[i] * (1 - ALPHA)));
    const ratio = contrast(effective, background);
    checked += 1;
    if (ratio < MINIMUM) {
        failures.push(`${selector.trim().split('\n').pop()!.trim()} — ${ratio.toFixed(2)}:1`);
    }
}

assert.ok(checked >= 30, `every theme is measured (found ${checked})`);
assert.equal(failures.length, 0,
    `input borders below ${MINIMUM}:1 against their own theme:\n  ${failures.join('\n  ')}`);

console.log(`Field contrast verification passed: ${checked} themes, all at or above ${MINIMUM}:1.`);
