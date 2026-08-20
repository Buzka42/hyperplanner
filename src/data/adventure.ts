import type { PlanConfig, Program } from '../types';

export const ADVENTURE_PLAN_ID = '30-minute-adventure';
export const adventureDraftKey = (userId: string) => `adventure_draft_${userId}`;

export type AdventureLanguage = 'en' | 'pl';
export type AdventureEquipment = 'bodyweight' | 'dumbbells' | 'barbell' | 'cable' | 'machines';
export type AdventureFailureMode = 'muscular' | 'technical' | 'preprogrammed';
export type AdventureWeightMode = 'external' | 'bodyweight' | 'assisted' | 'timed' | 'optional';

export type AdventureExercise = {
    key: string;
    name: Record<AdventureLanguage, string>;
    target: { min: number; max: number; unit: 'reps' | 'seconds' };
    weightMode: AdventureWeightMode;
    failureMode: AdventureFailureMode;
    cue: Record<AdventureLanguage, string>;
    variants?: Record<AdventureLanguage, string[]>;
};

export type AdventurePair = {
    id: string;
    portalId: AdventurePortalId;
    a: string;
    b: string;
    restSeconds: number;
    setup: 'fast' | 'moderate' | 'slow';
    estimatedMinutes: number;
    equipment: AdventureEquipment[];
    heroPick?: boolean;
    note: Record<AdventureLanguage, string>;
};

export type AdventurePortalId = 'upper' | 'core-glutes' | 'calves-shoulders' | 'quads-triceps' | 'arms-posterior';

export type AdventurePortal = {
    id: AdventurePortalId;
    name: Record<AdventureLanguage, string>;
    shortName: Record<AdventureLanguage, string>;
    pairIds: string[];
};

const exercise = (
    key: string,
    en: string,
    pl: string,
    min: number,
    max: number,
    options: Partial<Omit<AdventureExercise, 'key' | 'name' | 'target'>> = {}
): AdventureExercise => ({
    key,
    name: { en, pl },
    target: { min, max, unit: 'reps' },
    weightMode: 'external',
    failureMode: 'muscular',
    cue: {
        en: 'Control the eccentric and finish every rep in the same position.',
        pl: 'Kontroluj fazę opuszczania i kończ każde powtórzenie w tej samej pozycji.'
    },
    ...options
});

const technical = { failureMode: 'technical' as const };
const bodyweight = { weightMode: 'bodyweight' as const };

export const ADVENTURE_EXERCISES: Record<string, AdventureExercise> = Object.fromEntries([
    exercise('flat-db-bench', 'Flat Dumbbell Bench Press', 'Wyciskanie hantli na ławce płaskiej', 6, 8, technical),
    exercise('supported-one-arm-row', 'Bench-Supported One-Arm Dumbbell Row', 'Jednorącz wiosłowanie hantlem z podparciem', 10, 12, technical),
    exercise('incline-barbell-bench', 'Incline Barbell Bench Press', 'Wyciskanie sztangi na ławce skośnej', 6, 8, technical),
    exercise('barbell-row', 'Barbell Row', 'Wiosłowanie sztangą', 8, 10, technical),
    exercise('smith-incline-bench', '30° Smith Incline Bench Press', 'Wyciskanie na skosie 30° w Smithie', 8, 10, technical),
    exercise('db-seal-row', 'Dumbbell Seal Row', 'Seal row z hantlami', 12, 15, technical),
    exercise('pec-deck', 'Pec Deck', 'Rozpiętki na maszynie', 10, 12),
    exercise('reverse-pec-deck', 'Reverse Pec Deck', 'Odwrotne rozpiętki na maszynie', 15, 20, {
        variants: { en: ['Bilateral', 'Single arm'], pl: ['Oburącz', 'Jednorącz'] }
    }),
    exercise('dual-cable-chest-press', 'Dual-Cable Chest Press', 'Wyciskanie na dwóch wyciągach', 8, 10),
    exercise('dual-cable-high-row', 'Dual-Cable High Row', 'Wysokie wiosłowanie na dwóch wyciągach', 12, 15, technical),
    exercise('push-up', 'Push-Up', 'Pompka', 12, 15, {
        ...bodyweight,
        variants: { en: ['Knee', 'High incline', 'Standard', 'Feet elevated'], pl: ['Na kolanach', 'Wysoki skos', 'Klasyczna', 'Nogi wyżej'] }
    }),
    exercise('pull-up', 'Pull-Up', 'Podciąganie', 6, 10, { weightMode: 'assisted', failureMode: 'technical' }),
    exercise('cable-crossover', 'Cable Crossover', 'Krzyżowanie linek wyciągu', 12, 15),
    exercise('kneeling-one-arm-cable-row', 'Kneeling One-Arm Cable Row', 'Jednorącz wiosłowanie na wyciągu w klęku', 10, 12, technical),

    exercise('hanging-leg-raise', 'Hanging Leg Raise', 'Unoszenie nóg w zwisie', 10, 15, { ...bodyweight, failureMode: 'technical' }),
    exercise('bench-hip-thrust', 'Bench Hip Thrust', 'Hip thrust przy ławce', 8, 12, technical),
    exercise('machine-hip-thrust', 'Machine Hip Thrust', 'Hip thrust na maszynie', 8, 10),
    exercise('plank', 'Plank', 'Deska', 30, 45, {
        weightMode: 'timed', failureMode: 'preprogrammed', target: { min: 30, max: 45, unit: 'seconds' },
        cue: { en: 'Set two continues only while the pelvis and ribs stay stacked.', pl: 'Druga seria trwa tylko tak długo, jak utrzymujesz żebra i miednicę w jednej pozycji.' }
    } as Partial<Omit<AdventureExercise, 'key' | 'name' | 'target'>>),
    exercise('seated-cable-row', 'Seated Cable Row', 'Wiosłowanie na wyciągu siedząc', 10, 12, technical),
    exercise('kas-glute-bridge', 'Kas Glute Bridge', 'Kas glute bridge', 10, 15, technical),
    exercise('y-raise', 'Y-Raise', 'Wznos Y', 12, 15),
    exercise('lying-leg-curl', 'Lying Leg Curl', 'Uginanie nóg leżąc', 10, 15),
    exercise('cable-crunch', 'Cable Crunch', 'Spięcia brzucha na wyciągu', 12, 15),
    exercise('cable-pull-through', 'Cable Pull-Through', 'Pull-through na wyciągu', 10, 15, technical),
    exercise('reverse-crunch', 'Bench Reverse Crunch', 'Odwrotne spięcia na ławce', 12, 20, { ...bodyweight, failureMode: 'technical' }),
    exercise('db-hip-thrust', 'Dumbbell Hip Thrust', 'Hip thrust z hantlem', 8, 12),
    exercise('ab-wheel', 'Ab Wheel', 'Kółko do brzucha', 8, 12, { ...bodyweight, failureMode: 'technical' }),
    exercise('frog-pump', 'Frog Pump', 'Frog pump', 25, 40, { weightMode: 'optional' }),
    exercise('weighted-crunch', 'Weighted Crunch', 'Spięcia brzucha z obciążeniem', 15, 20),
    exercise('b-stance-hip-thrust', 'B-Stance Hip Thrust', 'Hip thrust w pozycji B-stance', 10, 12, technical),

    exercise('military-press', 'Standing Military Press', 'Wyciskanie żołnierskie stojąc', 6, 8, technical),
    exercise('standing-calf-raise', 'Standing Dumbbell/KB Calf Raise', 'Wspięcia na palce stojąc z hantlem/kettlem', 15, 20),
    exercise('hack-calf-raise', 'Hack-Squat Calf Raise', 'Wspięcia na palce na hack-maszynie', 10, 15),
    exercise('leaning-lateral-raise', 'Leaning One-Arm Lateral Raise', 'Jednorącz unoszenie bokiem w pochyleniu', 12, 20),
    exercise('leg-press-calf-raise', 'Leg Press Calf Raise', 'Wspięcia na palce na suwnicy', 15, 25),
    exercise('seated-lateral-raise', 'Seated Dumbbell Lateral Raise', 'Unoszenie hantli bokiem siedząc', 12, 20),
    exercise('cable-lateral-raise', 'Cable Lateral Raise', 'Unoszenie ramienia bokiem na wyciągu', 15, 20),
    exercise('single-leg-cable-calf', 'Single-Leg Cable Calf Raise', 'Jednonóż wspięcia na palce przy wyciągu', 10, 15),
    exercise('arnold-press', 'Arnold Press', 'Arnold press', 8, 10, technical),
    exercise('seated-db-shoulder-press', 'Seated Dumbbell Shoulder Press', 'Wyciskanie hantli nad głowę siedząc', 8, 10, technical),
    exercise('step-calf-raise', 'Standing Calf Raise off Step', 'Wspięcia na palce na podwyższeniu', 15, 20, { weightMode: 'optional' }),
    exercise('smith-ohp', 'Smith Machine Overhead Press', 'Wyciskanie nad głowę w Smithie', 8, 10, technical),
    exercise('smith-calf-raise', 'Smith Machine Calf Raise', 'Wspięcia na palce w Smithie', 12, 15),

    exercise('leg-extension', 'Leg Extension', 'Prostowanie nóg na maszynie', 12, 15),
    exercise('french-press', 'French Press', 'Wyciskanie francuskie', 8, 10, technical),
    exercise('barbell-squat', 'Barbell Squat', 'Przysiad ze sztangą', 5, 8, technical),
    exercise('db-skullcrusher', 'Lying Dumbbell Skullcrusher', 'Francuskie wyciskanie hantli leżąc', 15, 20, technical),
    exercise('heel-elevated-goblet-squat', 'Heel-Elevated Goblet Squat', 'Goblet squat z uniesionymi piętami', 8, 12, technical),
    exercise('one-db-overhead-extension', 'One-Dumbbell Overhead Triceps Extension', 'Prostowanie ramion nad głową jednym hantlem', 12, 15),
    exercise('bulgarian-split-squat', 'Bulgarian Split Squat', 'Przysiad bułgarski', 8, 10, technical),
    exercise('close-grip-push-up', 'Close-Grip Push-Up', 'Pompka wąska', 15, 25, { ...bodyweight, failureMode: 'technical' }),
    exercise('cable-cyclist-squat', 'Cable Cyclist Squat', 'Cyclist squat na wyciągu', 8, 12, technical),
    exercise('rope-pressdown', 'Rope Pressdown', 'Prostowanie ramion z liną', 15, 20),
    exercise('walking-lunge', 'Dumbbell Walking Lunge', 'Wykroki chodzone z hantlami', 10, 10, technical),
    exercise('diamond-push-up', 'Diamond Push-Up', 'Pompka diamentowa', 8, 20, { ...bodyweight, failureMode: 'preprogrammed' }),

    exercise('barbell-rdl', 'Barbell Romanian Deadlift', 'Martwy ciąg rumuński ze sztangą', 6, 8, technical),
    exercise('straight-bar-curl', 'Standing Straight-Bar Curl', 'Uginanie ramion ze sztangą prostą', 15, 20),
    exercise('db-rdl', 'Dumbbell Romanian Deadlift', 'Martwy ciąg rumuński z hantlami', 8, 10, technical),
    exercise('incline-lying-db-curl', '30° Incline-Lying Dumbbell Curl', 'Uginanie hantli leżąc na skosie 30°', 10, 12),
    exercise('rope-hammer-curl', 'Rope Hammer Curl', 'Uginanie młotkowe z liną', 12, 15),
    exercise('cable-rdl', 'Cable Romanian Deadlift', 'Martwy ciąg rumuński na wyciągu', 8, 10, technical),
    exercise('cable-straight-bar-curl', 'Straight-Bar Cable Curl', 'Uginanie ramion na wyciągu z drążkiem', 12, 15),
    exercise('single-leg-db-rdl', 'Single-Leg Dumbbell Romanian Deadlift', 'Jednonóż martwy ciąg rumuński z hantlem', 8, 10, technical),
    exercise('db-hammer-curl', 'Dumbbell Hammer Curl', 'Uginanie młotkowe z hantlami', 10, 15),
    exercise('back-extension', '45° Back Extension', 'Wyprost grzbietu na ławce 45°', 12, 15, technical),
    exercise('low-pulley-curl', 'Low-Pulley Cable Curl', 'Uginanie ramion na dolnym wyciągu', 12, 15)
].map(item => [item.key, item]));

const pair = (
    id: string,
    portalId: AdventurePortalId,
    a: string,
    b: string,
    restSeconds: number,
    setup: AdventurePair['setup'],
    equipment: AdventureEquipment[],
    en: string,
    pl: string,
    heroPick = false
): AdventurePair => ({
    id, portalId, a, b, restSeconds, setup, equipment, heroPick,
    estimatedMinutes: setup === 'fast' ? 5 : setup === 'moderate' ? 6 : 7,
    note: { en, pl }
});

export const ADVENTURE_PAIRS: AdventurePair[] = [
    pair('upper-db-bench-row', 'upper', 'flat-db-bench', 'supported-one-arm-row', 75, 'moderate', ['dumbbells'], 'One bench, one dumbbell area.', 'Jedna ławka i strefa hantli.'),
    pair('upper-incline-barbell-row', 'upper', 'incline-barbell-bench', 'barbell-row', 90, 'slow', ['barbell'], 'Heavy rack route. Take longer when technique needs it.', 'Ciężki wariant ze sztangą. Odpocznij dłużej, gdy wymaga tego technika.', true),
    pair('upper-smith-seal', 'upper', 'smith-incline-bench', 'db-seal-row', 75, 'slow', ['machines', 'dumbbells'], 'Smith plus nearby dumbbells and bench.', 'Smith, hantle i ławka w pobliżu.'),
    pair('upper-pec-reverse', 'upper', 'pec-deck', 'reverse-pec-deck', 60, 'fast', ['machines'], 'Best on a convertible pec-deck station.', 'Najlepiej na maszynie z funkcją odwrotnych rozpiętek.'),
    pair('upper-dual-cable', 'upper', 'dual-cable-chest-press', 'dual-cable-high-row', 60, 'fast', ['cable'], 'Keep both handles connected.', 'Pozostaw oba uchwyty podpięte.'),
    pair('upper-push-pull', 'upper', 'pull-up', 'push-up', 60, 'fast', ['bodyweight'], 'Choose a push-up level you can repeat cleanly.', 'Wybierz wariant pompki, który powtórzysz technicznie.'),
    pair('upper-incline-db-cable-row', 'upper', 'incline-barbell-bench', 'seated-cable-row', 75, 'moderate', ['barbell', 'cable'], 'Bench and cable station side by side.', 'Ławka i wyciąg obok siebie.'),
    pair('upper-crossover-kneeling-row', 'upper', 'cable-crossover', 'kneeling-one-arm-cable-row', 60, 'moderate', ['cable'], 'Reserve one cable bay and change height once.', 'Zajmij jedną bramę i zmień wysokość tylko raz.'),

    pair('core-hanging-hip-thrust', 'core-glutes', 'bench-hip-thrust', 'hanging-leg-raise', 75, 'slow', ['barbell', 'bodyweight'], 'Complete the hip thrust first while fresh.', 'Najpierw wykonaj hip thrust, gdy jesteś wypoczęty.'),
    pair('core-machine-plank', 'core-glutes', 'machine-hip-thrust', 'plank', 60, 'fast', ['machines', 'bodyweight'], 'Set two plank ends at positional failure.', 'Druga deska kończy się przy utracie pozycji.'),
    pair('core-reverse-crunch-db-thrust', 'core-glutes', 'db-hip-thrust', 'reverse-crunch', 60, 'fast', ['dumbbells', 'bodyweight'], 'One bench and one dumbbell.', 'Jedna ławka i jeden hantel.'),
    pair('core-ab-wheel-frog-pump', 'core-glutes', 'ab-wheel', 'frog-pump', 60, 'fast', ['bodyweight'], 'Floor-only route with minimal setup.', 'Wariant na podłodze, bez zmiany stanowiska.'),
    pair('core-kas-cable-crunch', 'core-glutes', 'kas-glute-bridge', 'cable-crunch', 60, 'moderate', ['barbell', 'cable'], 'Bridge on the bench, crunch on the stack.', 'Mostek na ławce, spięcia na wyciągu.'),
    pair('core-weighted-crunch-b-stance', 'core-glutes', 'b-stance-hip-thrust', 'weighted-crunch', 75, 'slow', ['dumbbells'], 'Unilateral hip thrusts make this a longer route.', 'Jednostronne hip thrusty wydłużają ten wariant.'),

    pair('calves-military-standing', 'calves-shoulders', 'military-press', 'standing-calf-raise', 90, 'moderate', ['dumbbells'], 'Press first; calf work must not fatigue your stance.', 'Najpierw wyciskanie; łydki nie mogą zmęczyć pozycji.'),
    pair('calves-hack-leaning-lateral', 'calves-shoulders', 'hack-calf-raise', 'leaning-lateral-raise', 60, 'moderate', ['machines', 'dumbbells'], 'Keep the dumbbell beside the hack station.', 'Trzymaj hantel obok hack-maszyny.'),
    pair('calves-seated-lateral', 'calves-shoulders', 'standing-calf-raise', 'seated-lateral-raise', 60, 'fast', ['dumbbells'], 'One bench and two manageable dumbbell loads.', 'Jedna ławka i dwa dobrane ciężary hantli.'),
    pair('calves-cable-lateral', 'calves-shoulders', 'cable-lateral-raise', 'standing-calf-raise', 60, 'slow', ['cable', 'dumbbells'], 'Cable laterals then standing calves.', 'Unoszenia na wyciągu, potem wspięcia stojąc.'),
    pair('calves-arnold-seated', 'calves-shoulders', 'arnold-press', 'standing-calf-raise', 60, 'fast', ['dumbbells'], 'One bench, shoulder work first.', 'Jedna ławka, najpierw barki.'),
    pair('calves-seated-press-standing', 'calves-shoulders', 'seated-db-shoulder-press', 'standing-calf-raise', 75, 'moderate', ['dumbbells'], 'Press seated, then stand for the calves.', 'Wyciskaj siedząc, potem wstań do łydek.'),
    pair('calves-y-raise-hack', 'calves-shoulders', 'y-raise', 'hack-calf-raise', 60, 'fast', ['dumbbells', 'machines'], 'Light dumbbells beside the hack station.', 'Lekkie hantle obok hack-maszyny.'),
    pair('calves-smith-route', 'calves-shoulders', 'smith-ohp', 'standing-calf-raise', 75, 'moderate', ['machines', 'dumbbells'], 'Smith press then standing calves.', 'Wyciskanie w Smithie, potem wspięcia stojąc.'),

    pair('quads-extension-french', 'quads-triceps', 'leg-extension', 'french-press', 60, 'moderate', ['machines', 'dumbbells'], 'Keep the triceps implement beside the machine.', 'Trzymaj obciążenie na triceps obok maszyny.'),
    pair('quads-squat-skullcrusher', 'quads-triceps', 'barbell-squat', 'db-skullcrusher', 90, 'slow', ['barbell', 'dumbbells'], 'Heavy rack route. Use safeties and take clean reps only.', 'Ciężki wariant. Ustaw zabezpieczenia i kończ na ostatnim czystym powtórzeniu.', true),
    pair('quads-goblet-overhead', 'quads-triceps', 'heel-elevated-goblet-squat', 'one-db-overhead-extension', 60, 'fast', ['dumbbells'], 'One dumbbell can serve both movements.', 'Jeden hantel może obsłużyć oba ćwiczenia.'),
    pair('quads-bulgarian-close-push', 'quads-triceps', 'bulgarian-split-squat', 'close-grip-push-up', 75, 'slow', ['dumbbells', 'bodyweight'], 'Unilateral legs make this a longer route.', 'Jednostronna praca nóg wydłuża ten wariant.'),
    pair('quads-cable-cyclist-pressdown', 'quads-triceps', 'cable-cyclist-squat', 'rope-pressdown', 60, 'fast', ['cable'], 'One cable stack, two height settings.', 'Jeden stos, dwa ustawienia wysokości.'),
    pair('quads-lunge-diamond', 'quads-triceps', 'walking-lunge', 'diamond-push-up', 75, 'slow', ['dumbbells', 'bodyweight'], 'Set two diamond push-ups goes to clean technical failure.', 'Druga seria pompek diamentowych do czystego upadku technicznego.'),

    pair('posterior-barbell-rdl-curl', 'arms-posterior', 'barbell-rdl', 'straight-bar-curl', 90, 'slow', ['barbell'], 'Hinge first. Two bars or a substantial load change may be needed.', 'Najpierw zawias biodrowy. Mogą być potrzebne dwie sztangi lub duża zmiana ciężaru.', true),
    pair('posterior-db-rdl-incline-curl', 'arms-posterior', 'db-rdl', 'incline-lying-db-curl', 90, 'slow', ['dumbbells'], 'Prepare separate dumbbell loads before starting.', 'Przygotuj dwa różne ciężary hantli przed startem.'),
    pair('posterior-cable-rdl-straight-curl', 'arms-posterior', 'cable-rdl', 'cable-straight-bar-curl', 75, 'fast', ['cable'], 'One straight bar, low cable throughout.', 'Jeden prosty drążek, dolny wyciąg przez cały czas.'),
    pair('posterior-single-leg-rdl-hammer', 'arms-posterior', 'single-leg-db-rdl', 'db-hammer-curl', 75, 'slow', ['dumbbells'], 'Complete both hinge sides before curls.', 'Wykonaj obie strony martwego ciągu przed uginaniem.'),
    pair('posterior-hammer-curl-lying-curl', 'arms-posterior', 'db-hammer-curl', 'lying-leg-curl', 60, 'fast', ['dumbbells', 'machines'], 'Curl machine with dumbbells beside it — replaces the dropped pull-through routes.', 'Maszyna do uginania nóg z hantlami obok – zastępuje usunięte warianty z pull-through.'),
    pair('posterior-back-extension-hammer', 'arms-posterior', 'back-extension', 'db-hammer-curl', 60, 'moderate', ['dumbbells'], 'Keep dumbbells beside the back-extension bench.', 'Trzymaj hantle przy ławce do wyprostów.'),
];

const portal = (id: AdventurePortalId, en: string, pl: string, shortEn: string, shortPl: string): AdventurePortal => ({
    id,
    name: { en, pl },
    shortName: { en: shortEn, pl: shortPl },
    pairIds: ADVENTURE_PAIRS.filter(item => item.portalId === id).map(item => item.id)
});

export const ADVENTURE_PORTALS: AdventurePortal[] = [
    portal('upper', 'Chest / Upper Back', 'Klatka / Górne plecy', 'Upper Gate', 'Brama góry'),
    portal('core-glutes', 'Abs / Glutes', 'Brzuch / Pośladki', 'Core Gate', 'Brama centrum'),
    portal('calves-shoulders', 'Calves / Shoulders', 'Łydki / Barki', 'Signal Gate', 'Brama sygnału'),
    portal('quads-triceps', 'Quads / Triceps', 'Czworogłowe / Triceps', 'Power Gate', 'Brama mocy'),
    portal('arms-posterior', 'Biceps / Hamstrings / Lower Back', 'Biceps / Dwugłowe / Dół pleców', 'Rear Gate', 'Brama tylna')
];

export const getAdventurePair = (id: string) => ADVENTURE_PAIRS.find(item => item.id === id);
export const getAdventureExercise = (key: string) => ADVENTURE_EXERCISES[key];

export const adventureResultKey = (pairId: string, exerciseKey: string, round: number) => `${pairId}:${exerciseKey}:${round}`;

export const buildAdventureSequence = (selectedPairIds: Record<string, string>) =>
    ADVENTURE_PORTALS.flatMap(portalItem => {
        const selected = getAdventurePair(selectedPairIds[portalItem.id]);
        if (!selected) return [];
        return [
            { pairId: selected.id, portalId: portalItem.id, exerciseKey: selected.a, round: 1 as const, slot: 'A' as const },
            { pairId: selected.id, portalId: portalItem.id, exerciseKey: selected.b, round: 1 as const, slot: 'B' as const },
            { pairId: selected.id, portalId: portalItem.id, exerciseKey: selected.a, round: 2 as const, slot: 'A' as const },
            { pairId: selected.id, portalId: portalItem.id, exerciseKey: selected.b, round: 2 as const, slot: 'B' as const }
        ];
    });

export const findPreviousAdventureWeight = (
    sequence: ReturnType<typeof buildAdventureSequence>,
    results: Record<string, { weight?: string | number; completed?: boolean }>,
    currentIndex: number,
    exerciseKey: string
) => {
    for (let index = currentIndex - 1; index >= 0; index -= 1) {
        const step = sequence[index];
        if (step.exerciseKey !== exerciseKey) continue;
        const prior = results[adventureResultKey(step.pairId, step.exerciseKey, step.round)];
        if (prior?.completed && prior.weight !== undefined && String(prior.weight) !== '') return String(prior.weight);
    }
    return '';
};

export const ADVENTURE_PROGRAM: Program = {
    id: ADVENTURE_PLAN_ID,
    name: '30 Minute Adventure',
    weeks: [{ weekNumber: 1, days: [{ dayName: '30 Minute Adventure', dayOfWeek: 1, exercises: [] }] }]
};

export const ADVENTURE_CONFIG: PlanConfig = {
    id: ADVENTURE_PLAN_ID,
    program: ADVENTURE_PROGRAM,
    session: { kind: 'pair-select' },
    ui: {
        themeClass: 'theme-adventure',
        coverImage: '/30min.png',
        navImage: '/30min.png',
        dashboardWidgets: ['workout_history']
    }
};
