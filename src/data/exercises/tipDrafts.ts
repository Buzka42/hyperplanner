/**
 * Drafted English general cues, awaiting owner audit.
 *
 * These are the movements that reached the two-layer tip system with no general
 * coaching cue at all. They are kept in a separate file, and flagged
 * `tipStatus: 'draft'`, so the audit ledger is a diff rather than a hunt: once
 * a cue is approved it can be promoted into the library entry and dropped from
 * here, and the admin Library tab filters on the same flag.
 *
 * Authoring rules, from docs/architecture/exercise-tip-authoring.md:
 *
 *   - one to three of: the setup detail that changes the movement, the cue that
 *     prevents the common invalid rep, the intended range, the quality stop
 *     condition, or a progression constraint intrinsic to the exercise;
 *   - nothing about plan phase, weekly load, prescribed RIR, set counts or test
 *     days — that is prescription content and belongs to the other layer;
 *   - no medical, rehabilitation or fake-biomechanical claims.
 *
 * Polish translations live in `TIP_DRAFTS_PL` below. They were commissioned by
 * the owner together with the English review; both still render under
 * `tipStatus: 'draft'` until approved in the admin Library tab.
 */

/** exerciseId -> drafted English general cue. */
export const TIP_DRAFTS_EN: Record<string, string> = {
    // --- squat and knee-dominant ---------------------------------------------
    'low-bar-squat': 'Bar on the rear delts, wrists neutral, more forward lean than a high-bar squat. Break at the hips and knees together; stop the set when the chest starts dropping ahead of the hips.',
    'high-box-squat': 'Sit back to the box under control and pause without rocking. The box sets the depth, not a bounce off it.',
    'low-box-squat': 'Sit to the box at or just below parallel, stay tight through the pause, then drive up without shifting forward.',
    'paused-squat': 'Full stop at the bottom with the torso braced. Hold the position rather than sinking into it, then stand without a bounce.',
    'tempo-squat': 'Control the descent for the prescribed count and keep it even — most tempo squats are fast at the bottom, which is the part that matters.',
    'safety-bar-squat': 'Hold the handles without pulling the bar down, and let the yoke keep the torso upright. Elbows stay under the bar, not flared forward.',
    'zercher-squat': 'Bar in the crook of the elbows, held tight to the body. Keep the chest up; the set ends when the bar starts sliding, not when the legs give out.',
    'mid-pin-squat': 'Start from a dead stop on the pins with everything already braced. No rebound off the pins.',
    'banded-squat': 'The band gets heavier as you stand, so accelerate through the top rather than letting it stall you.',
    'bulgarian-split-squat': 'Rear foot on the bench, front shin roughly vertical, weight through the whole front foot. Work the weaker side first and match it with the stronger one.',
    'heel-elevated-goblet-squat': 'Heels raised, torso tall, knees travelling forward over the toes. Sit straight down rather than back.',
    'cable-cyclist-squat': 'Heels elevated and stance narrow so the quads take the work. Keep the cable tension constant at the top.',
    'leg-press': 'Feet mid-platform, lower until the pelvis is about to round off the pad, then press without locking the knees hard. Range beats plate count here.',
    'high-foot-leg-press': 'Feet high on the platform shifts the work toward the hips and hamstrings. Keep the lower back flat against the pad.',
    'narrow-stance-leg-press': 'Feet close and low on the platform for the quads. Stop the descent when the hips start to tuck.',
    'leg-extension': 'Line the knee up with the machine pivot, pause briefly at the top, and lower under control instead of letting the stack drop.',

    // --- hinge, hip extension and hamstrings ---------------------------------
    'conventional-deadlift': 'Bar over mid-foot, lats set, hips high enough that the bar leaves the floor with the shoulders slightly ahead of it. Stop the set when the lower back starts rounding on the way up.',
    'paused-deadlift': 'Pause just off the floor or below the knee without relaxing. The hold is the point; do not use it to reposition.',
    'deficit-deadlift': 'Standing on the deficit adds range at the hardest position. Keep the same start position you would use on the floor and reduce the load to get it.',
    'paused-deficit-deadlift': 'Deficit plus a pause is the most demanding version of the start. Hold position rather than sagging into the bar.',
    'deficit-snatch-grip-deadlift': 'Wide grip and a deficit put the upper back under real load. Keep the bar against the legs and stop when the upper back gives way.',
    'block-pull': 'Bar on the blocks, same brace and lat set as a floor pull. Do not let the shortened range turn it into a stiff-legged pull.',
    'anderson-deadlift': 'Every rep starts dead from the pins with no rebound. Reset the brace between reps.',
    'speed-deadlift-with-bands': 'Move the bar as fast as you can while keeping position. Accelerate through the lockout rather than easing into it.',
    'barbell-romanian-deadlift': 'Bar close to the legs, hips back, knees soft and fixed. Lower until the hamstrings stop lengthening — not until the bar reaches the floor.',
    'cable-romanian-deadlift': 'Constant tension from the cable makes the stretch position the hardest part. Keep the pull horizontal rather than letting it drift up.',
    'deficit-romanian-deadlift': 'Standing on a plate adds stretch at the bottom. Add range before you add load.',
    'single-leg-dumbbell-romanian-deadlift': 'Hips square, weight tracking close to the working leg. Stop when the hip starts to open rather than chasing depth.',
    'good-mornings': 'Bar high on the back, hips back, spine held still. Keep the load light enough that the position never changes.',
    'cable-pull-through': 'Drive the hips forward to finish; this is a hinge, not a squat or a lower-back extension. Squeeze at lockout without leaning back.',
    'seated-ham-curl': 'Hips fixed against the pad and torso still. Control the return; the lengthened position is where the work is.',

    // --- hip thrust and glutes ------------------------------------------------
    'bench-hip-thrust': 'Bench under the shoulder blades, chin tucked, ribs down. Finish with the hips level rather than hyperextending the lower back.',
    'dumbbell-hip-thrust': 'Dumbbell across the hips with a pad. Same lockout as a barbell thrust: hips level, ribs down, brief squeeze.',
    'b-stance-hip-thrust': 'Working foot flat, the other only for balance on the heel. Most of the load stays on the working side.',
    'frog-pump': 'Soles together, knees out. Short range and constant tension; drive from the glutes rather than the lower back.',

    // --- horizontal press and chest -------------------------------------------
    'spoto-press': 'Stop the bar an inch off the chest and hold it there, then press. No touch, no bounce.',
    'larsen-press': 'Feet off the floor, so nothing comes from leg drive. Keep the upper back tight against the bench.',
    'long-pause-bench-press': 'Full stop on the chest with the bar still. The pause is the exercise; shorten the set before shortening the pause.',
    'low-pin-press': 'Dead stop on the pins near chest height. Reset the brace each rep rather than rebounding.',
    '30-smith-incline-bench-press': 'Fixed bar path, so set the bench position first. Touch high on the chest and press without letting the shoulders roll forward.',
    'hammer-chest-press': 'Set the seat so the handles line up with mid-chest. Press without shrugging, and stop short of a hard lockout to keep tension.',
    'dual-cable-chest-press': 'Cables set at chest height, a slight forward lean and a step out to load the start. Press and let the hands converge.',
    'push-up': 'Body in one line, hands under the shoulders, chest to the floor. The set ends when the hips start sagging.',
    'close-grip-push-up': 'Hands inside shoulder width, elbows tracking back. Keep the ribs down rather than arching to reach the floor.',
    'diamond-push-up': 'Hands together under the sternum, elbows close. Stop the set when the elbows start flaring.',
    'deficit-push-up': 'Hands elevated on plates or handles for extra stretch. Lower slowly into the added range instead of dropping into it.',
    'bodyweight-dip': 'Slight forward lean for the chest, upright for the triceps. Lower to a comfortable stretch and stop the set at the first sign of shoulder pinch.',
    'mid-cable-fly': 'Soft fixed elbow angle throughout. Open until the chest is stretched, then bring the hands together rather than pressing.',
    'low-to-high-cable-fly': 'Hands travel up and in, finishing in front of the collarbone. Keep the elbow angle constant.',
    'cable-crossover': 'Slight forward lean, hands crossing past each other at the finish. Control the return; the stretch is the point.',
    'reverse-pec-deck': 'Chest against the pad, arms nearly straight, lead with the elbows. Stop when the traps take over.',
    'single-arm-reverse-pec-deck': 'One arm lets the shoulder blade move naturally. Keep the torso still; do not rotate into the rep.',

    // --- vertical and horizontal pull ----------------------------------------
    'pull-up': 'Full hang, shoulders set, chin over the bar without kipping. Lower under control — the eccentric is most of the value.',
    'weighted-pull-up': 'Total system weight is bodyweight plus the belt load. Full hang to chin over the bar; stop the set when range shortens.',
    'inverted-row': 'Body in one line, bar to the sternum, shoulder blades finishing together. Raise the bar or bend the knees to regress rather than shortening the range.',
    'barbell-row': 'Torso angle fixed for the whole set. Pull to the lower ribs and stop when the torso starts rising to meet the bar.',
    'dumbbell-seal-row': 'Chest on the bench removes any body English. Pull to the hips and pause; nothing moves but the arms and shoulder blades.',
    'bench-supported-one-arm-dumbbell-row': 'Support the free hand and keep the torso square. Row toward the hip rather than the armpit.',
    'kneeling-one-arm-cable-row': 'Half-kneeling and braced, so the pull comes from the back rather than the trunk. Let the shoulder blade travel forward at the start.',
    'single-arm-cable-row': 'Allow the shoulder blade to reach at the front and finish by pulling it back, not by twisting the torso.',
    'rope-cable-row': 'Pull the rope to the mid-section and separate the hands at the finish. Elbows stay close.',
    'dual-cable-high-row': 'Pull down and back toward the lower ribs. Keep the chest up; this is a row, not a pulldown.',
    'hammer-underhand-pulldown': 'Underhand grip brings in the lower lats and biceps. Drive the elbows to the ribs and stop the set when the torso starts swinging.',
    'dumbbell-pullover': 'Ribs down and hips low. Reach back until the lats stretch, then pull the weight over the chest without arching.',

    // --- delts, arms and forearms ---------------------------------------------
    'smith-overhead-press': 'Fixed bar path, so seat position sets everything. Press without letting the ribs flare, and stop short of a hard lockout.',
    'arnold-press': 'Rotate from palms-in to palms-forward as you press. Keep the rotation smooth rather than snapping at the bottom.',
    'seated-dumbbell-lateral-raise': 'Seated removes the swing. Lead with the elbows to shoulder height and lower slowly.',
    'leaning-one-arm-lateral-raise': 'Lean away from the working side to load the stretch. Keep the torso still — the lean is the setup, not part of the rep.',
    'cable-lateral-raise': 'Constant tension through the whole range. Raise to shoulder height with the elbow leading and control the return.',
    'y-raise': 'Arms out at roughly forty-five degrees with the thumbs up. Light load; stop when the traps take over.',
    'band-pull-aparts': 'Arms nearly straight, pull until the band touches the chest. Squeeze the shoulder blades without shrugging.',
    'face-pulls': 'Rope at eye level, pull toward the face and rotate the hands back. Light and controlled; this is not a heavy row.',
    'rear-delt-rope-pulls-to-face': 'High cable, elbows travelling out and back. Stop before the lower back starts extending to help.',
    'shrug': 'Straight up and down. Pause at the top; rolling the shoulders adds nothing and loads the joint awkwardly.',
    'standing-straight-bar-curl': 'Elbows at the sides, no swing. The set ends when the torso starts moving, not when the arms fail.',
    'straight-bar-cable-curl': 'Constant tension throughout. Keep the elbows fixed and squeeze at the top without pulling back.',
    'low-pulley-cable-curl': 'Cable from the low pulley keeps tension at the stretch. Do not let the elbows drift forward.',
    'dumbbell-hammer-curl': 'Neutral grip throughout, elbows fixed at the sides. Control the lowering; this one is easy to cheat.',
    'hammer-curl': 'Neutral grip, elbows fixed at the sides, no swing. Lower under control — this one is easy to cheat and the eccentric is where the brachialis works.',
    'rope-hammer-curl': 'Neutral grip with the rope, elbows at the sides. Pull the ends slightly apart at the top.',
    'ezbar-skullcrushers': 'Lower toward the forehead or just behind it with the elbows fixed. Stop the set at the first elbow discomfort rather than pushing through it.',
    'banded-ezbar-bar-skullcrushers': 'Band tension peaks at lockout, so keep the elbows still and finish the extension deliberately.',
    'lying-dumbbell-skullcrusher': 'Dumbbells allow a slightly kinder elbow path. Keep the upper arms still and lower behind the head.',
    'rolling-dumbbell-tricep-extension': 'Roll the dumbbells back past the head, then extend. The roll is what makes the stretch; do not shorten it.',
    'french-press': 'Elbows in and pointed up, lower behind the head under control. Reduce the load before letting the elbows flare.',
    'one-dumbbell-overhead-triceps-extension': 'Both hands on one dumbbell, elbows close to the head. Full stretch at the bottom, no arching to press it up.',
    'single-arm-overhead-extension': 'Keep the working elbow pointed up and close to the head. The free hand supports rather than assists.',
    'rope-pressdown': 'Elbows pinned at the sides, separate the rope at lockout. Stop when the shoulders start driving the movement.',
    'triangle-pushdown': 'Neutral grip on the attachment, elbows fixed. Full extension at the bottom without leaning into it.',

    // --- calves, trunk and the rest -------------------------------------------
    'calf': 'Full stretch at the bottom and a real pause at the top. Bouncing turns this into a tendon exercise.',
    'standing-calf-raise-off-step': 'Heels well below the step for full stretch, then all the way up. Slow at both ends.',
    'standing-dumbbell-kb-calf-raise': 'Balance against something so the calves do the work rather than the ankles stabilising. Full range, brief squeeze.',
    'smith-calf-raise': 'The fixed bar lets you push the stretch safely. Do not rush the bottom position.',
    'single-leg-cable-calf-raise': 'One leg at a time, full stretch and a pause. Match the weaker side.',
    'plank': 'One line from head to heels with the ribs down and glutes on. End the set when the hips drop, not when the timer says so.',
    'cable-crunch': 'Round the spine down toward the knees rather than hinging at the hips. Control the return.',
    'cable-crunches': 'Round the spine down toward the knees rather than hinging at the hips. Control the return.',
    'weighted-crunch': 'Short range, spine rounding, no hip flexor pull. Add load only once the movement stays clean.',
    'bench-reverse-crunch': 'Lift the hips off the bench with the abs rather than swinging the legs. Slow on the way down.',
    'ab-wheel': 'Ribs down and hips tucked. Roll out only as far as you can hold that position, and stop the set the moment the lower back arches.',
    'dumbbell-walking-lunge': 'Torso upright, step long enough that the front shin stays near vertical. Stop when the steps start shortening.',

    // --- machines and placeholders --------------------------------------------
    'apex-access-placeholder': 'Placeholder slot for a selected access movement. The prescribed movement carries its own cue.',
};

/** exerciseId -> Polish translation of the drafted cue above. */
export const TIP_DRAFTS_PL: Record<string, string> = {
    // --- squat and knee-dominant ---------------------------------------------
    'low-bar-squat': 'Sztanga na tylnych aktach barków, nadgarstki neutralne, większy pochyl niż w high bar. Schodź biodrami i kolanami razem; kończ serię, gdy klatka zaczyna wyprzedzać biodra.',
    'high-box-squat': 'Siadaj na boks pod kontrolą i pauzuj bez odbijania. To boks ustawia głębokość, nie odbicie od niego.',
    'low-box-squat': 'Siadaj na boks na równoległości lub minimalnie poniżej, utrzymaj napięcie w pauzie i wstań bez przesuwania się w przód.',
    'paused-squat': 'Pełne zatrzymanie na dole z usztywnionym tułowiem. Trzymaj pozycję zamiast w nią zapadać, potem wstań bez odbicia.',
    'tempo-squat': 'Schodź równo przez zadaną liczbę sekund — w większości tempo przysiadów dołek jest za szybki, a to on jest najważniejszy.',
    'safety-bar-squat': 'Trzymaj uchwyty bez ściągania sztangi w dół i pozwól klamrze utrzymać tułów pionowo. Łokcie pod sztangą, nie rozchylone w przód.',
    'zercher-squat': 'Sztanga w zgięciach łokci, przyciśnięta do ciała. Klatka wysoko; seria kończy się, gdy sztanga zaczyna zjeżdżać, nie gdy poddają nogi.',
    'mid-pin-squat': 'Start z martwego zatrzymania na pinach, z pełnym napięciem przed ruchem. Żadnego odbijania od pinów.',
    'banded-squat': 'Guma ciężeje w miarę wstawania, więc przyspieszaj przez górę zamiast pozwalać jej zatrzymać ruch.',
    'bulgarian-split-squat': 'Tylna stopa na ławce, przednia goleń mniej więcej pionowo, ciężar na całej przedniej stopie. Zacznij od słabszej strony i wyrównaj nią silniejszą.',
    'heel-elevated-goblet-squat': 'Pięty uniesione, tułów wysoko, kolana jadą w przód za palce. Schodź prosto w dół, nie w tył.',
    'cable-cyclist-squat': 'Pięty uniesione i wąski rozstaw, żeby pracowały czworogłowe. Utrzymaj stałe napięcie linki na górze.',
    'leg-press': 'Stopy w połowie platformy, schodź aż miednica zacznie się podwijać, potem wypchnij bez twardego prostowania kolan. Zakres ważniejszy niż liczba talerzy.',
    'high-foot-leg-press': 'Stopy wysoko na platformie przenoszą pracę na biodra i dwugłowe. Dolne plecy cały czas płasko na oparciu.',
    'narrow-stance-leg-press': 'Stopy blisko i nisko na platformie pod czworogłowe. Przerwij zjazd, gdy biodra zaczynają się podwijać.',
    'leg-extension': 'Ustaw kolano w osi obrotu maszyny, krótka pauza na górze i opuszczaj pod kontrolą zamiast spuszczać stos.',

    // --- hinge, hip extension and hamstrings ---------------------------------
    'conventional-deadlift': 'Sztanga nad środkiem stopy, najszersze napięte, biodra tak wysoko, żeby sztanga oderwała się z barkami minimalnie przed nią. Kończ serię, gdy dolne plecy zaczynają się zaokrąglać w górze.',
    'paused-deadlift': 'Pauza tuż nad podłogą lub pod kolanem bez rozluźniania. To zatrzymanie jest celem; nie używaj go do poprawiania ułożenia.',
    'deficit-deadlift': 'Stanie na podwyższeniu dokłada zakresu w najtrudniejszej pozycji. Zachowaj tę samą pozycję startową co z podłogi i zmniejsz ciężar, żeby ją utrzymać.',
    'paused-deficit-deadlift': 'Deficyt plus pauza to najbardziej wymagająca wersja startu. Trzymaj pozycję zamiast zapadać się na sztangę.',
    'deficit-snatch-grip-deadlift': 'Szeroki chwyt i deficyt obciążają górę pleców na serio. Trzymaj sztangę przy nogach i kończ, gdy góra pleców puszcza.',
    'block-pull': 'Sztanga na blokach, to samo napięcie i ustawienie najszerszych co przy ciągu z podłogi. Nie pozwól, by skrócony zakres zamienił go w ciąg na prostych nogach.',
    'anderson-deadlift': 'Każde powtórzenie startuje martwo z pinów, bez odbicia. Odnów napięcie między powtórzeniami.',
    'speed-deadlift-with-bands': 'Prowadź sztangę tak szybko jak potrafisz, zachowując pozycję. Przyspieszaj przez zamknięcie zamiast w nie wjeżdżać.',
    'barbell-romanian-deadlift': 'Sztanga blisko nóg, biodra w tył, kolana miękkie i nieruchome. Schodź, aż dwugłowe przestaną się wydłużać — nie aż sztanga dotknie podłogi.',
    'cable-romanian-deadlift': 'Stałe napięcie wyciągu sprawia, że najtrudniejsza jest pozycja rozciągnięcia. Prowadź ciąg poziomo, nie daj mu uciekać w górę.',
    'deficit-romanian-deadlift': 'Stanie na płytce dokłada rozciągnięcia na dole. Najpierw zakres, potem ciężar.',
    'single-leg-dumbbell-romanian-deadlift': 'Biodra ustawione równo, ciężar prowadzony blisko pracującej nogi. Stop, gdy biodro zaczyna się otwierać, zamiast gonić głębokość.',
    'good-mornings': 'Sztanga wysoko na plecach, biodra w tył, kręgosłup nieruchomy. Ciężar tak lekki, żeby pozycja nigdy się nie zmieniała.',
    'cable-pull-through': 'Kończ wypchnięciem bioder w przód; to zawias, nie przysiad ani wyprost dolnych pleców. Ściśnij w zamknięciu bez odchylania się.',
    'seated-ham-curl': 'Biodra dociśnięte do siedziska, tułów nieruchomy. Kontroluj powrót; praca jest w pozycji wydłużonej.',

    // --- hip thrust and glutes ------------------------------------------------
    'bench-hip-thrust': 'Ławka pod łopatkami, broda schowana, żebra w dół. Kończ z biodrami w linii, bez przeprostu w lędźwiach.',
    'dumbbell-hip-thrust': 'Hantel na biodrach z podkładką. To samo zamknięcie co w wersji ze sztangą: biodra w linii, żebra w dół, krótkie spięcie.',
    'b-stance-hip-thrust': 'Pracująca stopa płasko, druga tylko dla balansu na pięcie. Większość ciężaru zostaje po pracującej stronie.',
    'frog-pump': 'Podeswy razem, kolana na zewnątrz. Krótki zakres i stałe napięcie; pchaj z pośladków, nie z dolnych pleców.',

    // --- horizontal press and chest -------------------------------------------
    'spoto-press': 'Zatrzymaj sztangę centymetry nad klatką, przytrzymaj i wypchnij. Bez dotyku, bez odbicia.',
    'larsen-press': 'Stopy nad podłogą, więc nic nie pochodzi z pracy nóg. Góra pleców cały czas dociśnięta do ławki.',
    'long-pause-bench-press': 'Pełne zatrzymanie na klatce, sztanga nieruchoma. Pauza jest ćwiczeniem; skróć serię, zanim skrócisz pauzę.',
    'low-pin-press': 'Martwy start z pinów na wysokości klatki. Odnów napięcie co powtórzenie zamiast się odbijać.',
    '30-smith-incline-bench-press': 'Tor sztangi jest ustalony, więc najpierw ustaw ławkę. Dotykaj wysoko na klatce i wyciskaj bez toczenia barków w przód.',
    'hammer-chest-press': 'Ustaw siedzisko tak, żeby uchwyty były na wysokości środka klatki. Wyciskaj bez wzruszania barków i nie prostuj twardo na górze, żeby utrzymać napięcie.',
    'dual-cable-chest-press': 'Wyciągi na wysokości klatki, lekki pochyl i krok w przód dla napięcia na starcie. Wyciskaj i pozwól dłoniom zbliżyć się.',
    'push-up': 'Ciało w jednej linii, dłonie pod barkami, klatka do podłogi. Seria kończy się, gdy biodra zaczynają opadać.',
    'close-grip-push-up': 'Dłonie wężej niż barki, łokcie wzdłuż tułowia. Żebra w dół zamiast wygiania się, by dosięgnąć podłogi.',
    'diamond-push-up': 'Dłonie razem pod mostkiem, łokcie blisko. Kończ serię, gdy łokcie zaczynają uciekać na boki.',
    'deficit-push-up': 'Dłonie na płytkach lub uchwytach dla dodatkowego rozciągnięcia. Schodź powoli w nowy zakres zamiast w niego wpadać.',
    'bodyweight-dip': 'Lekki pochyl w przód dla klatki, pionowo dla tricepsa. Schodź do komfortowego rozciągnięcia i kończ przy pierwszym ukłuciu w barku.',
    'mid-cable-fly': 'Miękki, stały kąt w łokciach przez cały ruch. Otwieraj aż klatka się rozciągnie, potem zbieraj dłonie zamiast wyciskać.',
    'low-to-high-cable-fly': 'Dłonie jadą w górę i do środka, kończąc przed obojczykiem. Kąt łokcia bez zmian.',
    'cable-crossover': 'Lekki pochyl, dłonie mijają się na końcu ruchu. Kontroluj powrót; to rozciągnięcie jest celem.',
    'reverse-pec-deck': 'Klatka na poduszce, ramiona prawie proste, prowadź łokciami. Stop, gdy przejmują czworoboczne.',
    'single-arm-reverse-pec-deck': 'Jedno ramię pozwala łopatce pracować naturalnie. Tułów nieruchomy; nie dokręcaj się do powtórzenia.',

    // --- vertical and horizontal pull ----------------------------------------
    'pull-up': 'Pełne zwisanie, barki ustawione, broda nad drążkiem bez szarpania. Opuszczaj pod kontrolą — ekscentryk to większość wartości.',
    'weighted-pull-up': 'Ciężar całkowity to masa ciała plus obciążenie na pasie. Pełne zwisanie do brody nad drążkiem; kończ serię, gdy zakres się skraca.',
    'inverted-row': 'Ciało w jednej linii, drążek do mostka, łopatki schodzą się na końcu. Podnieś drążek lub ugnij kolana zamiast skracać zakres.',
    'barbell-row': 'Kąt tułowia ustalony na całą serię. Przyciągaj pod dolne żebra i kończ, gdy tułów zaczyna się podnosić do sztangi.',
    'dumbbell-seal-row': 'Klatka na ławce wyklucza szarpanie. Przyciągaj do bioder i pauzuj; ruszają się tylko ramiona i łopatki.',
    'bench-supported-one-arm-dumbbell-row': 'Oprzyj wolną rękę i trzymaj tułów prosto. Wiosłuj w stronę biodra, nie pachy.',
    'kneeling-one-arm-cable-row': 'W półklęku, spięty, żeby ciągnąć z pleców, nie z tułowia. Pozwól łopatce odjechać w przód na starcie.',
    'single-arm-cable-row': 'Pozwól łopatce wyjść w przód i kończ ściągając ją z powrotem, nie skręcając tułowia.',
    'rope-cable-row': 'Przyciągnij linę do środka tułowia i rozdziel dłonie na końcu. Łokcie blisko ciała.',
    'dual-cable-high-row': 'Przyciągaj w dół i w tył pod dolne żebra. Klatka wysoko; to wiosłowanie, nie ściąganie drążka.',
    'hammer-underhand-pulldown': 'Podchwyt angażuje dolne najszersze i biceps. Prowadź łokcie do żeber i kończ serię, gdy tułów zaczyna się bujać.',
    'dumbbell-pullover': 'Żebra w dół, biodra nisko. Sięgnij w tył aż poczujesz rozciągnięcie najszerszych, potem przeciągnij ciężar nad klatkę bez wygiania.',

    // --- delts, arms and forearms ---------------------------------------------
    'smith-overhead-press': 'Tor sztangi jest ustalony, więc ustawienie siedziska decyduje o wszystkim. Wyciskaj bez wydychania żeber i bez twardego zamknięcia na górze.',
    'arnold-press': 'Rotuj z dłoni do siebie na dłonie w przód w trakcie wyciskania. Rotacja płynna, bez szarpnięcia na dole.',
    'seated-dumbbell-lateral-raise': 'Siedzenie eliminuje wymach. Prowadź łokciami do wysokości barków i opuszczaj powoli.',
    'leaning-one-arm-lateral-raise': 'Odsuń się od pracującej strony, by obciążyć rozciągnięcie. Tułów nieruchomy — pochyl to ustawienie, nie część powtórzenia.',
    'cable-lateral-raise': 'Stałe napięcie przez cały zakres. Unoś łokciem do wysokości barków i kontroluj powrót.',
    'y-raise': 'Ramiona pod kątem około 45 stopni, kciuki w górę. Lekki ciężar; stop, gdy przejmują czworoboczne.',
    'band-pull-aparts': 'Ramiona prawie proste, rozciągaj gumę aż dotknie klatki. Ściśnij łopatki bez wzruszania barków.',
    'face-pulls': 'Lina na wysokości oczu, przyciągaj do twarzy i rotuj dłonie w tył. Lekko i pod kontrolą; to nie jest ciężkie wiosłowanie.',
    'rear-delt-rope-pulls-to-face': 'Górny wyciąg, łokcie jadą na zewnątrz i w tył. Stop, zanim dolne plecy zaczną pomagać wyprostem.',
    'shrug': 'Prosto w górę i w dół. Pauza na górze; kręcenie barkami nic nie daje, a obciąża staw.',
    'standing-straight-bar-curl': 'Łokcie przy bokach, bez bujania. Seria kończy się, gdy tułów zaczyna się ruszać, nie gdy ramiona się poddają.',
    'straight-bar-cable-curl': 'Stałe napięcie przez cały ruch. Łokcie nieruchome, ściśnij na górze bez odciągania w tył.',
    'low-pulley-cable-curl': 'Dolny wyciąg utrzymuje napięcie w rozciągnięciu. Nie pozwól łokciom odjeżdżać w przód.',
    'dumbbell-hammer-curl': 'Chwyt neutralny przez cały ruch, łokcie przy bokach. Kontroluj opuszczanie; tu łatwo oszukiwać.',
    'hammer-curl': 'Chwyt neutralny, łokcie przy bokach, bez bujania. Opuszczaj pod kontrolą — tu łatwo oszukiwać, a ekscentryk pracuje na ramienne.',
    'rope-hammer-curl': 'Chwyt neutralny na linie, łokcie przy bokach. Rozciągnij końcówki liny na górze.',
    'ezbar-skullcrushers': 'Opuszczaj do czoła lub minimalnie za głowę, łokcie nieruchome. Kończ serię przy pierwszym dyskomforcie w łokciach zamiast przez niego przechodzić.',
    'banded-ezbar-bar-skullcrushers': 'Napięcie gumy szczytuje w zamknięciu, więc łokcie nieruchomo i prostuj zdecydowanie do końca.',
    'lying-dumbbell-skullcrusher': 'Hantle dają łagodniejszy tor dla łokci. Ramiona nieruchome, opuszczaj za głowę.',
    'rolling-dumbbell-tricep-extension': 'Tocz hantle za głowę, potem prostuj. To toczanie buduje rozciągnięcie; nie skracaj go.',
    'french-press': 'Łokcie blisko i skierowane w górę, opuszczaj za głowę pod kontrolą. Zmniejsz ciężar, zanim łokcie zaczną się rozjeżdżać.',
    'one-dumbbell-overhead-triceps-extension': 'Obie dłonie na jednym hantlu, łokcie blisko głowy. Pełne rozciągnięcie na dole, bez wygiania się, by go wypchnąć.',
    'single-arm-overhead-extension': 'Pracujący łokieć w górze i blisko głowy. Wolna ręka podpiera, nie pomaga.',
    'rope-pressdown': 'Łokcie przy bokach, rozdziel linę w zamknięciu. Stop, gdy barki zaczynają napędzać ruch.',
    'triangle-pushdown': 'Chwyt neutralny na uchwycie, łokcie nieruchome. Pełne wyprostowanie na dole bez wchodzenia w uchwyt tułowiem.',

    // --- calves, trunk and the rest -------------------------------------------
    'calf': 'Pełne rozciągnięcie na dole i prawdziwa pauza na górze. Podskoki zamieniają to w ćwiczenie ścięgna.',
    'standing-calf-raise-off-step': 'Pięty wyraźnie poniżej stopnia dla pełnego rozciągnięcia, potem maksymalnie w górę. Powoli na obu końcach.',
    'standing-dumbbell-kb-calf-raise': 'Oprzyj się o coś, żeby łydki pracowały zamiast stabilizujących kostek. Pełny zakres, krótkie spięcie.',
    'smith-calf-raise': 'Prowadzona sztanga pozwala bezpiecznie wejść głęboko w rozciągnięcie. Nie spiesz się w dolnej pozycji.',
    'single-leg-cable-calf-raise': 'Jedna noga naraz, pełne rozciągnięcie i pauza. Wyrównaj słabszą stronę.',
    'plank': 'Jedna linia od głowy do pięt, żebra w dół, pośladki spięte. Kończ serię, gdy biodra opadają, nie gdy mówi zegar.',
    'cable-crunch': 'Zaokrąglaj kręgosłup w stronę kolan zamiast zginać się w biodrach. Kontroluj powrót.',
    'cable-crunches': 'Zaokrąglaj kręgosłup w stronę kolan zamiast zginać się w biodrach. Kontroluj powrót.',
    'weighted-crunch': 'Krótki zakres, zaokrąglenie kręgosłupa, bez ciągnięcia biodrami. Dokładaj ciężar dopiero, gdy ruch jest czysty.',
    'bench-reverse-crunch': 'Unoś biodra nad ławkę brzuchem, nie zamachem nóg. Powoli w dół.',
    'ab-wheel': 'Żebra w dół, biodra podwinięte. Wyjeżdżaj tylko tak daleko, jak utrzymasz tę pozycję, i kończ serię w momencie wygięcia w lędźwiach.',
    'dumbbell-walking-lunge': 'Tułów pionowo, krok tak długi, żeby przednia goleń była blisko pionu. Stop, gdy kroki zaczynają się skracać.',

    // --- machines and placeholders --------------------------------------------
    'apex-access-placeholder': 'Miejsce na wybrany ruch dostępowy. Wskazówka pochodzi od przypisanego ćwiczenia.',
};
