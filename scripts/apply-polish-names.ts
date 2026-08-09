/**
 * apply-polish-names
 *
 * Fills in the Polish name for library exercises that had none.
 *
 * Follows the convention already set by the existing entries, which is a
 * deliberate mix rather than a blanket translation: movements with an
 * established Polish name get it ("Wyciskanie sztangi leżąc"), while terms
 * Polish lifters actually say in English are left alone (Spoto Press, Nordic
 * curls, Y-Raises, hack squat, Dragon Flags). Translating those would read as
 * stilted to the people using the app.
 *
 * One-shot: library.ts is hand-maintained, and these are editable from the
 * admin Exercise library tab afterwards.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const libPath = join(root, 'src', 'data', 'exercises', 'library.ts');

const NAMES: Record<string, string> = {
    // --- pressing ---
    'flat-barbell-bench-press': 'Wyciskanie sztangi leżąc',
    'close-grip-bench-press': 'Wyciskanie sztangi wąskim chwytem',
    'incline-dumbbell-bench-press': 'Wyciskanie hantli na skosie',
    'long-pause-bench-press': 'Wyciskanie z długą pauzą',
    'low-pin-press': 'Wyciskanie z niskich zaczepów',
    'larsen-press': 'Larsen Press',
    'spoto-press': 'Spoto Press',
    'hammer-chest-press': 'Wyciskanie na maszynie Hammer',
    'shoulder-press': 'Wyciskanie nad głowę',
    'bodyweight-dip': 'Dipy na masie ciała',
    'deficit-push-up': 'Pompki z deficytu',

    // --- chest isolation ---
    'cable-fly': 'Rozpiętki na wyciągu (środkowa wysokość)',
    'low-to-high-cable-fly': 'Rozpiętki na wyciągu z dołu do góry',
    'mid-cable-fly': 'Rozpiętki na wyciągu siedząc',

    // --- back ---
    'row': 'Wiosłowanie',
    'seated-cable-row': 'Wiosłowanie na wyciągu siedząc',
    'rope-cable-row': 'Wiosłowanie liną na wyciągu',
    'single-arm-cable-row': 'Wiosłowanie jednorącz na wyciągu',
    'single-arm-dumbbell-row': 'Wiosłowanie hantlem jednorącz',
    'single-arm-hammer-row': 'Wiosłowanie Hammer jednorącz',
    'wide-grip-barbell-row': 'Wiosłowanie sztangą szerokim chwytem',
    'inverted-row': 'Wiosłowanie australijskie',
    'lat-pulldown': 'Ściąganie drążka chwytem neutralnym',
    'close-neutral-grip-lat-pulldown': 'Ściąganie drążka wąskim chwytem neutralnym',
    'overhand-mid-grip-pulldown': 'Ściąganie drążka nachwytem średnim',
    'hammer-pulldown': 'Ściąganie Hammer podchwytem',
    'hammer-underhand-pulldown': 'Ściąganie Hammer podchwytem',
    'lat-prayer': 'Prostowanie ramion na wyciągu (lat prayer)',
    'assisted-pull-up': 'Podciąganie z asystą',
    'shrug': 'Wznosy barków (szrugsy)',

    // --- shoulders ---
    'lateral-raise': 'Wznosy bokiem',
    'leaning-single-arm-dumbbell-lateral-raise': 'Wznosy bokiem jednorącz z odchyleniem',
    'lying-cable-lat-raise': 'Wznosy bokiem na wyciągu leżąc',
    'rear-delt-fly': 'Odwrotne rozpiętki na maszynie',
    'side-lying-rear-delt-fly': 'Odwodzenie leżąc bokiem (tylny akton)',
    'single-arm-reverse-pec-deck': 'Odwrotny motylek jednorącz',
    'rear-delt-burnout': 'Dobicie tylnego aktonu',
    'rear-delt-rope-pulls-to-face': 'Przyciąganie liny do twarzy (tylny akton)',
    'face-pulls': 'Face pull',
    'high-elbow-facepulls': 'Face pull z wysokimi łokciami',
    'band-pull-aparts': 'Rozciąganie gumy przed sobą',
    'y-raise': 'Y-Raises',
    'around-the-worlds': 'Around-the-Worlds',

    // --- arms ---
    'tricep-extension': 'Prostowanie ramion',
    'overhead-tricep-extension': 'Wyciskanie francuskie nad głowę',
    'single-arm-overhead-extension': 'Wyciskanie francuskie jednorącz nad głowę',
    'heavy-rolling-tricep-extension': 'Ciężkie rolling tricep extensions',
    'ezbar-skullcrushers': 'Wyciskanie francuskie leżąc (EZ)',
    'triangle-pushdown': 'Prostowanie ramion z uchwytem trójkątnym',
    'ezbar-preacher-curl': 'Uginanie na modlitewniku (EZ)',
    'hammer-curl': 'Uginanie młotkowe',
    'ham-curl': 'Uginanie nóg',

    // --- squat pattern ---
    'front-squat': 'Przysiad przedni',
    'paused-squat': 'Przysiad z pauzą',
    'low-bar-squat': 'Przysiad low bar z pauzą',
    'high-box-squat': 'Przysiad na wysoką skrzynię',
    'low-box-squat': 'Przysiad na niską skrzynię',
    'mid-pin-squat': 'Przysiad ze średnich zaczepów',
    'safety-bar-squat': 'Przysiad ze sztangą safety bar',
    'zercher-squat': 'Przysiad Zerchera',
    'tempo-squat': 'Przysiad w tempie',
    'banded-squat': 'Przysiad z gumami',
    'stiletto-squat': 'Stiletto squat',
    'hack-squat': 'Hack squat',
    'leg-press': 'Suwnica (leg press)',
    'high-foot-leg-press': 'Suwnica – stopy wysoko',
    'narrow-stance-leg-press': 'Suwnica – wąska pozycja stóp',
    'front-foot-elevated-bulgarian-split-squat': 'Przysiad bułgarski z przednią nogą uniesioną',
    'deficit-reverse-lunge': 'Wykrok w tył z deficytu',

    // --- hinge ---
    'conventional-deadlift': 'Martwy ciąg klasyczny',
    'sumo-deadlift': 'Martwy ciąg sumo',
    'romanian-deadlift': 'Martwy ciąg rumuński',
    'deficit-romanian-deadlift': 'Martwy ciąg rumuński z deficytu',
    'stiff-legged-deadlift': 'Martwy ciąg na prostych nogach',
    'supported-stiff-legged-dumbbell-deadlift': 'Martwy ciąg na prostych nogach z hantlami (z podparciem)',
    'deficit-deadlift': 'Martwy ciąg z deficytu',
    'paused-deficit-deadlift': 'Martwy ciąg z deficytu z pauzą',
    'deficit-snatch-grip-deadlift': 'Martwy ciąg snatch grip z deficytu',
    'paused-deadlift': 'Martwy ciąg z pauzą (połowa piszczeli)',
    'block-pull': 'Martwy ciąg z podkładek (połowa piszczeli)',
    'anderson-deadlift': 'Martwy ciąg Andersona',
    'speed-deadlift-with-bands': 'Martwy ciąg dynamiczny z gumami',
    'good-mornings': 'Good morning (skłon ze sztangą)',

    // --- hamstrings / glutes ---
    'seated-ham-curl': 'Uginanie nóg siedząc',
    'seated-hamstring-curl': 'Uginanie nóg siedząc',
    'seated-leg-curl': 'Uginanie nóg siedząc',
    'lying-leg-curl': 'Uginanie nóg leżąc',
    'nordic-curl': 'Nordic curls',
    'slow-eccentric-cheat-nordic-curl': 'Nordic curls z wolnym ekscentrykiem',
    'glute-ham-raise': 'Glute-ham raise',
    'kas-glute-bridge': 'Kas glute bridge',
    'glute-pump-finisher': 'Finisher na pośladki',

    // --- calves ---
    'calf': 'Łydki',
    'calf-raise': 'Wspięcia na palce',
    'standing-calf-raise': 'Wspięcia na palce stojąc',
    'leg-press-calf-raise': 'Wspięcia na palce na suwnicy',

    // --- core / other ---
    'cable-crunches': 'Spięcia brzucha na wyciągu',
    'ab-wheel-rollout': 'Rollouty z kółkiem',
    'dragon-flags': 'Dragon Flags',
    'dead-hang-plank': 'Zwis na drążku + deska',
    'farmer-hold': "Farmer's hold (przytrzymanie)",
};

let source = readFileSync(libPath, 'utf8');
let applied = 0;
const missing: string[] = [];

for (const [id, polish] of Object.entries(NAMES)) {
    // Match this exercise's entry, then its empty Polish name within it.
    const pattern = new RegExp(
        `(id: '${id.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}',[\\s\\S]{0,400}?name: \\{ en: '[^']*', pl: )''`
    );
    if (!pattern.test(source)) {
        missing.push(id);
        continue;
    }
    source = source.replace(pattern, `$1'${polish.replace(/'/g, "\\'")}'`);
    applied++;
}

writeFileSync(libPath, source, 'utf8');

console.log('  apply-polish-names');
console.log(`   ${applied} Polish names written into src/data/exercises/library.ts`);
if (missing.length) {
    console.warn(`   ${missing.length} did not match (already translated, or id changed):`);
    for (const id of missing) console.warn(`      - ${id}`);
}
