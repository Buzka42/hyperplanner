/**
 * How to take each Apex access measurement.
 *
 * The assessment used to be six number fields with no explanation of what to
 * measure or how, which is a reliable way to collect six numbers that mean
 * nothing. Each region now carries what it measures, what you need, how it is
 * scored, the steps, and photographs of the positions — the same model in every
 * shot, so the athlete is comparing like with like rather than reading six
 * different people.
 *
 * Each step can carry a `watch`: the one mistake that quietly invalidates it.
 * Those are separated from the instruction because they are read at a different
 * moment — the instruction before moving, the warning while moving.
 *
 * Text is authored in both languages rather than run through the `t()`
 * dictionary: these are long instructional passages that belong beside the
 * images they describe, and splitting them across a key file would make them
 * impossible to review as prose.
 */

import type { ApexRegion } from '../../data/apexAccess';

export type ApexStep = {
    en: string;
    pl: string;
    /** The mistake that invalidates this step, where there is an obvious one. */
    watch?: { en: string; pl: string };
    /** File under `public/apex`, without extension. */
    image?: string;
};

export type ApexScoreOption = { value: 1 | 2 | 3; en: string; pl: string };

export type ApexInstruction = {
    /** What the number represents, and why it is worth knowing. */
    measures: { en: string; pl: string };
    /**
     * Scored by what the position looks like rather than by a measurement.
     *
     * Where present the athlete picks one of these instead of entering degrees:
     * some access is far easier to judge by whether you can hold a shape than
     * by trying to eyeball an angle on your own body.
     */
    scoreOptions?: ApexScoreOption[];
    /** What you need to hand before starting. */
    needs: { en: string; pl: string };
    /** How the number becomes a 1-3 score. */
    scoring: { en: string; pl: string };
    steps: ApexStep[];
};

export const APEX_INSTRUCTIONS: Record<ApexRegion, ApexInstruction> = {
    ankle: {
        measures: {
            en: 'How far your knee travels forward over your toes before the heel is pulled off the floor. This is what decides how upright you can stay in a deep squat.',
            pl: 'Jak daleko kolano wysunie się przed palce, zanim pięta oderwie się od podłogi. To właśnie ten zakres decyduje, jak pionowo utrzymasz tułów w głębokim przysiadzie.',
        },
        needs: {
            en: 'A wall and a tape measure. Bare feet. Test both sides — they are often different.',
            pl: 'Ściana i miarka. Boso. Zbadaj obie strony — często się różnią.',
        },
        scoring: {
            en: 'Under 8 cm scores 1 · 8–10 cm scores 2 · over 10 cm scores 3.',
            pl: 'Poniżej 8 cm to 1 · 8–10 cm to 2 · powyżej 10 cm to 3.',
        },
        steps: [
            {
                en: 'Stand facing a wall in a split stance with the foot you are testing in front, flat on the floor. Put the toes about a hand’s width from the wall and rest your hands on the wall for balance.',
                pl: 'Stań przodem do ściany w wykroku — badana stopa z przodu, płasko na podłodze. Ustaw palce mniej więcej na szerokość dłoni od ściany i oprzyj dłonie o ścianę dla równowagi.',
                image: 'ankle-step1',
            },
            {
                en: 'Press the heel into the floor and drive the knee forward until it touches the wall. Let it travel straight out over the second toe, not inward.',
                pl: 'Dociśnij piętę do podłogi i wypychaj kolano do przodu, aż dotknie ściany. Prowadź je prosto nad drugim palcem, a nie do środka.',
                watch: {
                    en: 'The moment the heel lifts, or the arch of the foot rolls inward, the attempt does not count. Both let the knee travel further than your ankle really allows.',
                    pl: 'W chwili, gdy pięta się unosi albo łuk stopy zapada do środka, próba się nie liczy. Oba te błędy pozwalają kolanu przejechać dalej, niż faktycznie pozwala staw skokowy.',
                },
                image: 'ankle-step2',
            },
            {
                en: 'If the knee reaches the wall easily, slide the foot back a centimetre and try again. Keep going until you find the furthest position where the knee still just touches with the heel down.',
                pl: 'Jeśli kolano sięga ściany bez trudu, odsuń stopę o centymetr i spróbuj ponownie. Powtarzaj, aż znajdziesz najdalszą pozycję, w której kolano wciąż ledwo dotyka, a pięta zostaje na podłodze.',
            },
            {
                en: 'Hook the tape against the wall and run it along the line of your foot. Read off the number at the tip of your big toe and write it down. The photo shows a 9 cm result.',
                pl: 'Zaczep miarkę o ścianę i poprowadź ją wzdłuż linii stopy. Odczytaj liczbę na wysokości czubka dużego palca i zapisz ją. Na zdjęciu wynik to 9 cm.',
                image: 'ankle-step4',
            },
        ],
    },
    hipFlexion: {
        measures: {
            en: 'How high one straight leg lifts while the other stays flat on the floor. It tells you how much hip and hamstring range you have before your lower back starts helping.',
            pl: 'Jak wysoko uniesiesz wyprostowaną nogę, gdy druga zostaje płasko na podłodze. Pokazuje, ile masz zakresu w biodrze i w dwugłowym uda, zanim zacznie dokładać odcinek lędźwiowy.',
        },
        needs: {
            en: 'Floor space and a mat. Someone watching from the side helps, but you can judge it yourself. Test both sides.',
            pl: 'Miejsce na podłodze i mata. Ktoś, kto popatrzy z boku, pomaga, ale poradzisz sobie sam. Zbadaj obie strony.',
        },
        scoring: {
            en: 'Under 45° scores 1 · 45–70° scores 2 · over 70° scores 3.',
            pl: 'Poniżej 45° to 1 · 45–70° to 2 · powyżej 70° to 3.',
        },
        steps: [
            {
                en: 'Lie flat on your back with both legs straight and your arms relaxed by your sides. Press your lower back gently down toward the floor.',
                pl: 'Połóż się płasko na plecach, obie nogi wyprostowane, ręce swobodnie wzdłuż ciała. Delikatnie dociśnij dolne plecy do podłogi.',
            },
            {
                en: 'Keeping both knees locked straight, raise one leg as high as it will go. The other leg has to stay in contact with the floor the whole time.',
                pl: 'Trzymając oba kolana wyprostowane, unieś jedną nogę tak wysoko, jak zdołasz. Druga noga przez cały czas musi pozostać na podłodze.',
                watch: {
                    en: 'Stop the moment the resting leg lifts or the raised knee bends. Past that point you are measuring your lower back, not your hip.',
                    pl: 'Zatrzymaj się, gdy tylko leżąca noga się uniesie albo uniesione kolano się ugnie. Od tego momentu mierzysz już odcinek lędźwiowy, a nie biodro.',
                },
                image: 'aslr-step2',
            },
            {
                en: 'Judge the angle between the raised leg and the floor. Straight up is 90°, and halfway to that is 45°. Round to the nearest five degrees and record it.',
                pl: 'Oceń kąt między uniesioną nogą a podłogą. Pionowo w górę to 90°, a połowa tej drogi to 45°. Zaokrąglij do pięciu stopni i zapisz.',
            },
        ],
    },
    hipRotation: {
        measures: {
            en: 'Whether you can sit in a 90/90 position at all, and what it costs you to hold it. Tight hips force the pelvis to tuck, and the only way to stay balanced is to lean back or prop yourself up.',
            pl: 'Czy w ogóle usiądziesz w pozycji 90/90 i ile cię to kosztuje. Ciasne biodra podwijają miednicę, a jedynym sposobem na utrzymanie równowagi jest odchylenie się do tyłu albo podparcie rękami.',
        },
        needs: {
            en: 'Clear floor, or a mat if the floor is hard. Set the position on both sides — most people are noticeably better one way round.',
            pl: 'Wolne miejsce na podłodze albo mata, jeśli podłoga jest twarda. Ustaw pozycję na obie strony — u większości osób jedna wychodzi wyraźnie lepiej.',
        },
        scoring: {
            en: 'Judged by what it takes to hold the position, not by an angle. Pick the line below that describes you.',
            pl: 'Ocena zależy od tego, czego wymaga utrzymanie pozycji, a nie od kąta. Wybierz opis, który do ciebie pasuje.',
        },
        scoreOptions: [
            {
                value: 1,
                en: 'I have to lean back to sit in it at all',
                pl: 'Muszę odchylić się do tyłu, żeby w ogóle w niej usiąść',
            },
            {
                value: 2,
                en: 'I can stay upright, but only propped up on my hands',
                pl: 'Utrzymam pion, ale tylko podpierając się rękami',
            },
            {
                value: 3,
                en: 'I can sit upright with my hands off the floor',
                pl: 'Siedzę wyprostowany z rękami oderwanymi od podłogi',
            },
        ],
        steps: [
            {
                en: 'Sit on the floor and set both legs to a right angle: the front shin crossing in front of you, the back shin running out to the side behind you.',
                pl: 'Usiądź na podłodze i ustaw obie nogi pod kątem prostym: przednie podudzie w poprzek przed sobą, tylne podudzie na bok, za tobą.',
                image: 'hip9090-step1',
            },
            {
                en: 'Try to sit tall, chest up, and take your hands off the floor. Hold it for a few seconds and notice what your body does to stay there.',
                pl: 'Spróbuj usiąść wyprostowany, z klatką w górze, i oderwij ręce od podłogi. Wytrzymaj kilka sekund i zauważ, co robi twoje ciało, żeby tam pozostać.',
                watch: {
                    en: 'Be honest about leaning. If your shoulders end up behind your hips, that is a lean — it is the pelvis tucking under you, and it is exactly what the test is looking for.',
                    pl: 'Bądź szczery co do odchylenia. Jeśli barki znajdą się za biodrami, to jest odchylenie — miednica podwija się pod tobą, a właśnie tego szuka ten test.',
                },
            },
            {
                en: 'Pick the option that matches what happened, and repeat with the legs swapped. Score the harder side.',
                pl: 'Wybierz opis, który pasuje do tego, co się stało, i powtórz z zamienionymi nogami. Oceń trudniejszą stronę.',
            },
        ],
    },
    shoulderFlexion: {
        measures: {
            en: 'How far your arms reach overhead before your ribs have to flare to let them. This decides whether you can press or hold anything directly above you.',
            pl: 'Jak daleko ręce sięgną nad głowę, zanim żebra muszą się wysunąć, żeby im to umożliwić. To decyduje, czy możesz wyciskać lub trzymać cokolwiek pionowo nad sobą.',
        },
        needs: {
            en: 'A clear stretch of wall, shoes off. Both arms move together, so this is one measurement rather than two.',
            pl: 'Kawałek wolnej ściany, bez butów. Obie ręce poruszają się razem, więc to jeden pomiar, nie dwa.',
        },
        scoring: {
            en: 'Under 150° scores 1 · 150–170° scores 2 · over 170° scores 3.',
            pl: 'Poniżej 150° to 1 · 150–170° to 2 · powyżej 170° to 3.',
        },
        steps: [
            {
                en: 'Stand with your back against the wall and your feet a short step away from it. Your head, upper back and buttocks should all be touching the wall.',
                pl: 'Stań plecami do ściany, stopy krok od niej. Głowa, górna część pleców i pośladki mają dotykać ściany.',
            },
            {
                en: 'Flatten your lower back against the wall by drawing your ribs down, then sweep both arms up overhead, keeping them as close to the wall as you can.',
                pl: 'Dociśnij dolne plecy do ściany, ściągając żebra w dół, a potem unieś obie ręce nad głowę, prowadząc je jak najbliżej ściany.',
                watch: {
                    en: 'The test ends the instant your lower back arches away from the wall. Almost anyone can touch the wall with their hands if they let the ribs flare — but that measures the spine, not the shoulder.',
                    pl: 'Test kończy się w chwili, gdy dolne plecy odrywają się od ściany. Prawie każdy dotknie ściany dłońmi, jeśli pozwoli żebrom się wysunąć — tyle że wtedy mierzy kręgosłup, a nie bark.',
                },
                image: 'shoulderflex-step2',
            },
            {
                en: 'Judge the angle between your upper arm and the floor at the point where you had to stop. Arms flat against the wall overhead is 180°; straight out in front of you is 90°.',
                pl: 'Oceń kąt między ramieniem a podłogą w miejscu, w którym musiałeś przerwać. Ręce płasko przy ścianie nad głową to 180°, wyprostowane przed sobą to 90°.',
            },
        ],
    },
    shoulderRotation: {
        measures: {
            en: 'How far your forearm rotates upward with the elbow parked at shoulder height. It is the range needed both at the bottom of a bench press and to catch anything overhead.',
            pl: 'Jak daleko przedramię obróci się w górę, gdy łokieć pozostaje na wysokości barku. To zakres potrzebny i na dole wyciskania, i przy każdym chwycie nad głową.',
        },
        needs: {
            en: 'Nothing but room to stand. Test both arms — one side is often noticeably tighter.',
            pl: 'Wystarczy miejsce, żeby stanąć. Zbadaj obie ręce — jedna strona bywa wyraźnie sztywniejsza.',
        },
        scoring: {
            en: 'Under 60° scores 1 · 60–80° scores 2 · over 80° scores 3.',
            pl: 'Poniżej 60° to 1 · 60–80° to 2 · powyżej 80° to 3.',
        },
        steps: [
            {
                en: 'Raise one arm out to the side until the elbow is level with your shoulder, then bend the elbow to a right angle so the forearm points straight forward, palm facing down.',
                pl: 'Unieś jedną rękę w bok, aż łokieć znajdzie się na wysokości barku, a potem zegnij łokieć pod kątem prostym, tak by przedramię wskazywało prosto przed siebie, dłonią w dół.',
                image: 'shoulderrot-step1',
            },
            {
                en: 'Hold the elbow exactly where it is and rotate the forearm upward, as though turning a key. Stop when it will not go further without the rest of you joining in.',
                pl: 'Utrzymaj łokieć dokładnie w tym miejscu i obracaj przedramię w górę, jakbyś przekręcał klucz. Zatrzymaj się, gdy dalszy obrót wymagałby ruchu resztą ciała.',
                watch: {
                    en: 'Two things quietly add degrees: the elbow drifting down toward your ribs, and the shoulder rolling forward. Keep the elbow at shoulder height and the chest still.',
                    pl: 'Dwie rzeczy po cichu dodają stopni: opadanie łokcia w stronę żeber i wysuwanie barku do przodu. Trzymaj łokieć na wysokości barku, a klatkę nieruchomo.',
                },
                image: 'shoulderrot-step2',
            },
            {
                en: 'Judge how far the forearm travelled from the starting position. Straight up is 90°, and the photo marks 80°.',
                pl: 'Oceń, jak daleko przedramię przemieściło się od pozycji startowej. Pionowo w górę to 90°, a na zdjęciu zaznaczono 80°.',
            },
        ],
    },
    thoracicRotation: {
        measures: {
            en: 'How far your upper back rotates when your hips are locked out of the movement. This is the range that lets you stay square under a bar instead of twisting.',
            pl: 'Jak daleko obraca się górna część pleców, gdy biodra są wyłączone z ruchu. To zakres, dzięki któremu ustawiasz się równo pod sztangą, zamiast się skręcać.',
        },
        needs: {
            en: 'A mat and floor space. Test both sides by rolling onto the other side and repeating.',
            pl: 'Mata i miejsce na podłodze. Zbadaj obie strony, przewracając się na drugi bok i powtarzając.',
        },
        scoring: {
            en: 'Under 30° scores 1 · 30–50° scores 2 · over 50° scores 3.',
            pl: 'Poniżej 30° to 1 · 30–50° to 2 · powyżej 50° to 3.',
        },
        steps: [
            {
                en: 'Lie on your side with your hips and knees bent to a right angle, both arms stretched out in front of you at shoulder height, palms together.',
                pl: 'Połóż się na boku, biodra i kolana zgięte pod kątem prostym, obie ręce wyciągnięte przed siebie na wysokości barków, dłonie złączone.',
                image: 'openbook-step1',
            },
            {
                en: 'Press your knees firmly together and keep one stacked on the other — they are what stops your hips joining in. Now open the top arm away from the bottom one, toward the floor behind you, turning your head to follow your hand.',
                pl: 'Mocno złącz kolana i trzymaj jedno na drugim — to one nie pozwalają biodrom włączyć się do ruchu. Teraz otwórz górną rękę od dolnej, w stronę podłogi za plecami, obracając głowę za dłonią.',
                watch: {
                    en: 'The knees are the whole test. The moment the top knee slides back off the bottom one, the movement has passed to your hips and lower back, and the number stops meaning anything.',
                    pl: 'Kolana są istotą tego testu. W chwili, gdy górne kolano zsuwa się z dolnego, ruch przechodzi na biodra i odcinek lędźwiowy, a wynik przestaje cokolwiek znaczyć.',
                },
                image: 'openbook-step2',
            },
            {
                en: 'Stop where the knees begin to part, and judge how far the top arm travelled from where it started. Flat on the floor behind you would be 90°.',
                pl: 'Zatrzymaj się tam, gdzie kolana zaczynają się rozchodzić, i oceń, jak daleko przemieściła się górna ręka. Płasko na podłodze za plecami to 90°.',
            },
        ],
    },
};
