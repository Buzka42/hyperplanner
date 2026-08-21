/**
 * How to take each Apex access measurement.
 *
 * The assessment used to be six number fields with no explanation of what to
 * measure or how, which is a reliable way to collect six numbers that mean
 * nothing. Each region now carries what it measures, how it is scored, the
 * steps, and photographs of the positions — the same model in every shot, so
 * the athlete is comparing like with like rather than reading six people.
 *
 * Text is authored in both languages rather than run through the `t()`
 * dictionary: these are long instructional passages that belong next to the
 * images they describe.
 */

import type { ApexRegion } from '../../data/apexAccess';

export type ApexStep = {
    en: string;
    pl: string;
    /** File under `public/apex`, without extension. */
    image?: string;
};

export type ApexInstruction = {
    /** What the number represents. */
    measures: { en: string; pl: string };
    /** How the number becomes a 1-3 score. */
    scoring: { en: string; pl: string };
    steps: ApexStep[];
};

export const APEX_INSTRUCTIONS: Record<ApexRegion, ApexInstruction> = {
    ankle: {
        measures: {
            en: 'How far the knee travels over the toes before the heel lifts. Measured in centimetres, both sides.',
            pl: 'Jak daleko kolano wysunie się przed palce, zanim pięta oderwie się od podłoża. Pomiar w centymetrach, obie strony.',
        },
        scoring: {
            en: 'Under 8 cm scores 1 · 8–10 cm scores 2 · over 10 cm scores 3.',
            pl: 'Poniżej 8 cm to 1 · 8–10 cm to 2 · powyżej 10 cm to 3.',
        },
        steps: [
            {
                en: 'Stand facing a wall in a split stance, the test foot flat on the floor, toes about a hand’s width from the wall.',
                pl: 'Stań przodem do ściany w wykroku, badana stopa płasko na podłodze, palce mniej więcej na szerokość dłoni od ściany.',
                image: 'ankle-step1',
            },
            {
                en: 'Keep the heel glued down and the knee tracking over the second toe. Drive the knee forward toward the wall.',
                pl: 'Trzymaj piętę przyklejoną do podłogi, a kolano prowadź nad drugim palcem. Wypchnij kolano do przodu w stronę ściany.',
                image: 'ankle-step2',
            },
            {
                en: 'If the knee touches easily, slide the foot back and repeat. Find the greatest distance where the knee still touches without the heel rising or the arch collapsing.',
                pl: 'Jeśli kolano dotyka bez trudu, odsuń stopę i powtórz. Znajdź największą odległość, przy której kolano wciąż dotyka, a pięta nie odrywa się i łuk stopy nie zapada.',
            },
            {
                en: 'Measure from the tip of the big toe to the wall. Record that number.',
                pl: 'Zmierz odległość od czubka dużego palca do ściany. Zapisz tę liczbę.',
                image: 'ankle-step4',
            },
        ],
    },
    hipFlexion: {
        measures: {
            en: 'How high one straight leg lifts from the floor while the other stays down. Measured in degrees, both sides.',
            pl: 'Jak wysoko uniesiesz wyprostowaną nogę, trzymając drugą na podłodze. Pomiar w stopniach, obie strony.',
        },
        scoring: {
            en: 'Under 45° scores 1 · 45–70° scores 2 · over 70° scores 3.',
            pl: 'Poniżej 45° to 1 · 45–70° to 2 · powyżej 70° to 3.',
        },
        steps: [
            {
                en: 'Lie on your back on the floor with both legs straight and arms relaxed at your sides.',
                pl: 'Połóż się na plecach, obie nogi wyprostowane, ręce swobodnie wzdłuż ciała.',
            },
            {
                en: 'Keep the down leg flat and the knee of the lifting leg locked. Raise one leg as far as it goes without the other leg breaking contact with the floor.',
                pl: 'Noga leżąca zostaje płasko, kolano unoszonej nogi wyprostowane. Unieś jedną nogę tak wysoko, jak potrafisz, bez odrywania drugiej od podłogi.',
                image: 'aslr-step2',
            },
            {
                en: 'Estimate the angle between the lifted leg and the floor. Straight up is 90°.',
                pl: 'Oszacuj kąt między uniesioną nogą a podłogą. Pionowo w górę to 90°.',
                image: 'aslr-step3',
            },
        ],
    },
    hipRotation: {
        measures: {
            en: 'How far the rear thigh rotates from the 90/90 seated position. Measured in degrees, both sides.',
            pl: 'Jak daleko tylne udo obróci się z pozycji siedzącej 90/90. Pomiar w stopniach, obie strony.',
        },
        scoring: {
            en: 'Under 25° scores 1 · 25–40° scores 2 · over 40° scores 3.',
            pl: 'Poniżej 25° to 1 · 25–40° to 2 · powyżej 40° to 3.',
        },
        steps: [
            {
                en: 'Sit on the floor with the front leg bent 90° and the shin in front of you, and the rear leg bent 90° with the shin out to the side. Sit tall.',
                pl: 'Usiądź na podłodze: przednia noga zgięta 90° z podudziem przed sobą, tylna zgięta 90° z podudziem na bok. Trzymaj tułów wyprostowany.',
                image: 'hip9090-step1',
            },
            {
                en: 'Keep the torso upright and the pelvis still. Rotate the rear thigh toward the floor without letting the trunk lean.',
                pl: 'Tułów wyprostowany, miednica nieruchoma. Obracaj tylne udo w stronę podłogi, nie pozwalając tułowiowi się przechylić.',
            },
            {
                en: 'Estimate how far the rear thigh travelled from where it started.',
                pl: 'Oszacuj, o ile stopni tylne udo przemieściło się od pozycji startowej.',
                image: 'hip9090-step3',
            },
        ],
    },
    shoulderFlexion: {
        measures: {
            en: 'How far both arms sweep overhead with the back flat against a wall. Measured in degrees, both sides.',
            pl: 'Jak daleko obie ręce sięgną nad głowę przy plecach przylegających do ściany. Pomiar w stopniach, obie strony.',
        },
        scoring: {
            en: 'Under 150° scores 1 · 150–170° scores 2 · over 170° scores 3.',
            pl: 'Poniżej 150° to 1 · 150–170° to 2 · powyżej 170° to 3.',
        },
        steps: [
            {
                en: 'Stand with your back and head against a wall, feet a short step out from it.',
                pl: 'Stań plecami i głową przy ścianie, stopy krok od niej.',
            },
            {
                en: 'Tuck the ribs so the lower back stays flat against the wall, then sweep both arms overhead. Stop the moment the ribs flare or the back leaves the wall.',
                pl: 'Ściągnij żebra, żeby dolne plecy przylegały do ściany, i unieś obie ręce nad głowę. Zatrzymaj się, gdy żebra się wysuną albo plecy odejdą od ściany.',
                image: 'shoulderflex-step2',
            },
            {
                en: 'Estimate the angle between the upper arm and the floor. Arms flat overhead against the wall is 180°.',
                pl: 'Oszacuj kąt między ramieniem a podłogą. Ręce płasko nad głową przy ścianie to 180°.',
                image: 'shoulderflex-step3',
            },
        ],
    },
    shoulderRotation: {
        measures: {
            en: 'How far the forearm rotates upward with the elbow held at shoulder height. Measured in degrees, both sides.',
            pl: 'Jak daleko przedramię obróci się w górę przy łokciu na wysokości barku. Pomiar w stopniach, obie strony.',
        },
        scoring: {
            en: 'Under 60° scores 1 · 60–80° scores 2 · over 80° scores 3.',
            pl: 'Poniżej 60° to 1 · 60–80° to 2 · powyżej 80° to 3.',
        },
        steps: [
            {
                en: 'Raise one elbow to shoulder height and bend it to 90°, forearm pointing forward with the palm down.',
                pl: 'Unieś łokieć na wysokość barku i zegnij go do 90°, przedramię skierowane do przodu, dłoń w dół.',
                image: 'shoulderrot-step1',
            },
            {
                en: 'Keep the elbow at that height and the torso still, then rotate the forearm upward as far as it goes.',
                pl: 'Trzymaj łokieć na tej wysokości, tułów nieruchomo, i obracaj przedramię w górę tak daleko, jak się da.',
                image: 'shoulderrot-step2',
            },
            {
                en: 'Estimate the angle travelled from the start. Forearm straight up is 90°.',
                pl: 'Oszacuj przebyty kąt od pozycji startowej. Przedramię pionowo w górę to 90°.',
            },
        ],
    },
    thoracicRotation: {
        measures: {
            en: 'How far the top arm opens behind you with the knees pinned together. Measured in degrees, both sides.',
            pl: 'Jak daleko górna ręka otworzy się za plecami przy złączonych kolanach. Pomiar w stopniach, obie strony.',
        },
        scoring: {
            en: 'Under 30° scores 1 · 30–50° scores 2 · over 50° scores 3.',
            pl: 'Poniżej 30° to 1 · 30–50° to 2 · powyżej 50° to 3.',
        },
        steps: [
            {
                en: 'Lie on your side with hips and knees bent to 90°, both arms straight out in front, palms together.',
                pl: 'Połóż się na boku, biodra i kolana zgięte do 90°, obie ręce wyprostowane przed sobą, dłonie złączone.',
                image: 'openbook-step1',
            },
            {
                en: 'Keep the knees stacked and pressed together — that is what stops the movement coming from the lower back. Open the top arm toward the floor behind you, following the hand with your eyes.',
                pl: 'Kolana pozostają złączone i dociśnięte — to one nie pozwalają, by ruch pochodził z odcinka lędźwiowego. Otwieraj górną rękę w stronę podłogi za plecami, wodząc za nią wzrokiem.',
                image: 'openbook-step2',
            },
            {
                en: 'Stop when the knees start to separate. Estimate the angle the top arm travelled from the start.',
                pl: 'Zatrzymaj się, gdy kolana zaczną się rozchodzić. Oszacuj kąt, jaki pokonała górna ręka.',
            },
        ],
    },
};
