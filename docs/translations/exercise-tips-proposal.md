# Exercise tips translation proposal

Shared bilingual ledger for every movement in the exercise library.
English and Polish names, general cues, and proposed Polish where the current
wording is missing, calqued, or unnatural.

**Runtime source of truth** remains `src/data/exercises/library.ts` (+ `tipDrafts.ts` for unaudited drafts).
This document is the bilingual review ledger. After the naturalization pass, **PL tip (current) is the applied proposal** in the library.

## Review summary

| Pass | Result |
|---|---|
| Coverage | **231/231** EN + PL tips; **0** missing Polish names; **0** names identical to English |
| Naturalization | ~38 tip rewrites, ~40 name localizations, 4 missing tips filled (applied in `library.ts`) |
| Remaining owner work | Audit English training content (`tipStatus`); promote drafts where needed |

### Principles used

- Prefer established Polish gym verbs: **wyciskanie**, **wiosłowanie**, **uginanie**, **przysiad**, **martwy ciąg**, **rozpiętki**, **unoszenie bokiem**.
- Prefer **faza ekscentryczna / koncentryczna**, **zamknięcie ruchu**, **napięcie** over English leftovers (`hip hinge`, `lockout`, `ROM`, `HARD`, `DB`).
- Keep recognizable English brand/gym norms where Polish gyms use them (**hip thrust**, **hack squat**, Spoto/Larsen as proper nouns) with a Polish descriptor when helpful (`Wyciskanie Spoto`).
- Tips stay short (1–3 sentences); no plan/week/RIR prescription in the general layer.

## Coverage snapshot

| Metric | Count |
|---|---:|
| Exercises | 231 |
| With English tip | 231 |
| Missing English tip | 0 |
| English tip, missing Polish tip | 0 |
| Missing Polish name | 0 |
| Polish name identical to English | 0 |
| Tips from library seed | 231 |
| Tips from draft file | 0 |

## How to use this ledger

1. Owner audits English cue (general layer only — no plan/week/RIR prescription).
2. Polish text below is the applied gym-Polish wording — revise further only if a cue still feels off.
3. Approve English → keep/update `tipStatus` to `approved` in the library.
4. Prefer established Polish gym terms (`wyciskanie`, `wiosłowanie`, `uginanie`, `przysiad`) over English leftovers unless the English name is the local norm (e.g. hip thrust).

## Decision legend

- **applied** — Polish tip/name is in the library after the naturalization pass (same text as Proposed)
- **missing-en** — no English general tip yet

---

## Full exercise table

### `30-incline-lying-dumbbell-curl`

| | |
|---|---|
| **EN name** | 30° Incline-Lying Dumbbell Curl |
| **PL name** | Uginanie hantli leżąc na skosie 30° |
| **Pattern** | elbow-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | As low incline as possible without DBs hitting floor. Maximum stretch. |
| **PL tip (current)** | Ławka nachylona jak najniżej możesz bez dotykania hantlami podłogi. Maksymalne rozciągnięcie. |
| **PL tip (proposed)** | Ławka nachylona jak najniżej możesz bez dotykania hantlami podłogi. Maksymalne rozciągnięcie. |
| **Decision** | applied |

### `30-smith-incline-bench-press`

| | |
|---|---|
| **EN name** | 30° Smith Incline Bench Press |
| **PL name** | Wyciskanie na skosie 30° w Smithie |
| **Pattern** | incline-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Fixed bar path, so set the bench position first. Touch high on the chest and press without letting the shoulders roll forward. |
| **PL tip (current)** | Tor sztangi jest ustalony, więc najpierw ustaw ławkę. Dotykaj wysoko na klatce i wyciskaj bez toczenia barków w przód. |
| **PL tip (proposed)** | Tor sztangi jest ustalony, więc najpierw ustaw ławkę. Dotykaj wysoko na klatce i wyciskaj bez toczenia barków w przód. |
| **Decision** | applied |

### `45-back-extension`

| | |
|---|---|
| **EN name** | 45° Back Extension |
| **PL name** | Wyprost grzbietu na ławce 45° |
| **Pattern** | hip-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Round upper back slightly, toes flared 45°, press hips HARD into pad. Pure hip hinge. |
| **PL tip (current)** | Lekko zaokrąglij górną część pleców, stopy rozstawione 45° na zewnątrz, mocno dociśnij biodra do podkładki. Czysty zawias w biodrach. |
| **PL tip (proposed)** | Lekko zaokrąglij górną część pleców, stopy rozstawione 45° na zewnątrz, mocno dociśnij biodra do podkładki. Czysty zawias w biodrach. |
| **Decision** | applied |

### `ab-wheel`

| | |
|---|---|
| **EN name** | Ab Wheel |
| **PL name** | Kółko do brzucha |
| **Pattern** | core-antiextension |
| **Tip source** | library (`draft`) |
| **EN tip** | Ribs down and hips tucked. Roll out only as far as you can hold that position, and stop the set the moment the lower back arches. |
| **PL tip (current)** | Żebra w dół, biodra podwinięte. Wyjeżdżaj tylko tak daleko, jak utrzymasz tę pozycję, i kończ serię w momencie wygięcia w lędźwiach. |
| **PL tip (proposed)** | Żebra w dół, biodra podwinięte. Wyjeżdżaj tylko tak daleko, jak utrzymasz tę pozycję, i kończ serię w momencie wygięcia w lędźwiach. |
| **Decision** | applied |

### `ab-wheel-rollout`

| | |
|---|---|
| **EN name** | Ab Wheel Rollouts |
| **PL name** | Wyjazdy z kółkiem do brzucha |
| **Pattern** | core-antiextension |
| **Tip source** | library (`approved`) |
| **EN tip** | Start from knees, go as far as possible while hitting 5+ reps. Progress distance weekly. |
| **PL tip (current)** | Zacznij z kolan, wyjedź tak daleko, jak dasz radę przy minimum 5 powtórzeniach. Co tydzień zwiększaj dystans. |
| **PL tip (proposed)** | Zacznij z kolan, wyjedź tak daleko, jak dasz radę przy minimum 5 powtórzeniach. Co tydzień zwiększaj dystans. |
| **Decision** | applied |

### `anderson-deadlift`

| | |
|---|---|
| **EN name** | Anderson Deadlift |
| **PL name** | Martwy ciąg Andersona |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Every rep starts dead from the pins with no rebound. Reset the brace between reps. |
| **PL tip (current)** | Każde powtórzenie startuje martwo z pinów, bez odbicia. Odnów napięcie między powtórzeniami. |
| **PL tip (proposed)** | Każde powtórzenie startuje martwo z pinów, bez odbicia. Odnów napięcie między powtórzeniami. |
| **Decision** | applied |

### `apex-access-placeholder`

| | |
|---|---|
| **EN name** | Apex Access Slot |
| **PL name** | Slot dostępu Apex |
| **Pattern** | mobility |
| **Tip source** | library (`draft`) |
| **EN tip** | Placeholder slot for a selected access movement. The prescribed movement carries its own cue. |
| **PL tip (current)** | Miejsce na wybrany ruch dostępowy. Wskazówka pochodzi od przypisanego ćwiczenia. |
| **PL tip (proposed)** | Miejsce na wybrany ruch dostępowy. Wskazówka pochodzi od przypisanego ćwiczenia. |
| **Decision** | applied |

### `arnold-press`

| | |
|---|---|
| **EN name** | Arnold Press |
| **PL name** | Wyciskanie Arnolda |
| **Pattern** | vertical-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Rotate from palms-in to palms-forward as you press. Keep the rotation smooth rather than snapping at the bottom. |
| **PL tip (current)** | Rotuj z dłoni do siebie na dłonie w przód w trakcie wyciskania. Rotacja płynna, bez szarpnięcia na dole. |
| **PL tip (proposed)** | Rotuj z dłoni do siebie na dłonie w przód w trakcie wyciskania. Rotacja płynna, bez szarpnięcia na dole. |
| **Decision** | applied |

### `around-the-worlds`

| | |
|---|---|
| **EN name** | Around-the-Worlds |
| **PL name** | Krążenia hantli (around-the-worlds) |
| **Pattern** | shoulder-horizontal-abduction |
| **Tip source** | library (`approved`) |
| **EN tip** | If 16 reps is easy, slow down the eccentric (3-4 sec). |
| **PL tip (current)** | Jeśli 16 powtórzeń jest łatwe, zwolnij fazę ekscentryczną (3–4 s). |
| **PL tip (proposed)** | Jeśli 16 powtórzeń jest łatwe, zwolnij fazę ekscentryczną (3–4 s). |
| **Decision** | applied |

### `assisted-pull-up`

| | |
|---|---|
| **EN name** | Assisted Pull-ups |
| **PL name** | Podciąganie z asystą |
| **Pattern** | vertical-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Limit assistance to minimum. Strict reps first, then push off box/bench. |
| **PL tip (current)** | Jedna stopa na skrzynce/ławce przed sobą, aby pomóc sobie w górę. Ogranicz pomoc do minimum. Najpierw czyste powt., potem pomagaj sobie od skrzynki/ławki. |
| **PL tip (proposed)** | Jedna stopa na skrzynce/ławce przed sobą, aby pomóc sobie w górę. Ogranicz pomoc do minimum. Najpierw czyste powt., potem pomagaj sobie od skrzynki/ławki. |
| **Decision** | applied |

### `b-stance-hip-thrust`

| | |
|---|---|
| **EN name** | B-Stance Hip Thrust |
| **PL name** | Hip thrust w pozycji B (jedna noga) |
| **Pattern** | hip-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Working foot flat, the other only for balance on the heel. Most of the load stays on the working side. |
| **PL tip (current)** | Pracująca stopa płasko, druga tylko dla balansu na pięcie. Większość ciężaru zostaje po pracującej stronie. |
| **PL tip (proposed)** | Pracująca stopa płasko, druga tylko dla balansu na pięcie. Większość ciężaru zostaje po pracującej stronie. |
| **Decision** | applied |

### `staggered-stance-rdl`

| | |
|---|---|
| **EN name** | B-Stance Romanian Deadlift |
| **PL name** | Rumuński martwy ciąg w rozkroku B |
| **Pattern** | hinge |
| **Tip source** | library (`approved`) |
| **EN tip** | The back foot is a kickstand, not a second leg — toes down, heel up, almost no weight through it. The front leg does the work. |
| **PL tip (current)** | Tylna noga to podpórka, nie druga noga — palce na ziemi, pięta w górze, prawie bez obciążenia. Pracuje noga przednia. |
| **PL tip (proposed)** | Tylna noga to podpórka, nie druga noga — palce na ziemi, pięta w górze, prawie bez obciążenia. Pracuje noga przednia. |
| **Decision** | applied |

### `band-pull-aparts`

| | |
|---|---|
| **EN name** | Band Pull-Aparts |
| **PL name** | Rozciąganie gumy przed sobą |
| **Pattern** | shoulder-horizontal-abduction |
| **Tip source** | library (`draft`) |
| **EN tip** | Arms nearly straight, pull until the band touches the chest. Squeeze the shoulder blades without shrugging. |
| **PL tip (current)** | Ramiona prawie proste, rozciągaj gumę aż dotknie klatki. Ściśnij łopatki bez wzruszania barków. |
| **PL tip (proposed)** | Ramiona prawie proste, rozciągaj gumę aż dotknie klatki. Ściśnij łopatki bez wzruszania barków. |
| **Decision** | applied |

### `banded-ezbar-bar-skullcrushers`

| | |
|---|---|
| **EN name** | Banded EZ Bar Skullcrushers |
| **PL name** | Wyciskanie francuskie z gumą (EZ) |
| **Pattern** | elbow-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Band tension peaks at lockout, so keep the elbows still and finish the extension deliberately. |
| **PL tip (current)** | Napięcie gumy szczytuje w zamknięciu, więc łokcie nieruchomo i prostuj zdecydowanie do końca. |
| **PL tip (proposed)** | Napięcie gumy szczytuje w zamknięciu, więc łokcie nieruchomo i prostuj zdecydowanie do końca. |
| **Decision** | applied |

### `banded-squat`

| | |
|---|---|
| **EN name** | Banded Squat |
| **PL name** | Przysiad z gumami |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | The band gets heavier as you stand, so accelerate through the top rather than letting it stall you. |
| **PL tip (current)** | Guma ciężeje w miarę wstawania, więc przyspieszaj przez górę zamiast pozwalać jej zatrzymać ruch. |
| **PL tip (proposed)** | Guma ciężeje w miarę wstawania, więc przyspieszaj przez górę zamiast pozwalać jej zatrzymać ruch. |
| **Decision** | applied |

### `barbell-romanian-deadlift`

| | |
|---|---|
| **EN name** | Barbell Romanian Deadlift |
| **PL name** | Martwy ciąg rumuński ze sztangą |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Bar close to the legs, hips back, knees soft and fixed. Lower until the hamstrings stop lengthening — not until the bar reaches the floor. |
| **PL tip (current)** | Sztanga blisko nóg, biodra w tył, kolana miękkie i nieruchome. Schodź, aż dwugłowe przestaną się wydłużać — nie aż sztanga dotknie podłogi. |
| **PL tip (proposed)** | Sztanga blisko nóg, biodra w tył, kolana miękkie i nieruchome. Schodź, aż dwugłowe przestaną się wydłużać — nie aż sztanga dotknie podłogi. |
| **Decision** | applied |

### `barbell-row`

| | |
|---|---|
| **EN name** | Barbell Row |
| **PL name** | Wiosłowanie sztangą |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`draft`) |
| **EN tip** | Torso angle fixed for the whole set. Pull to the lower ribs and stop when the torso starts rising to meet the bar. |
| **PL tip (current)** | Kąt tułowia ustalony na całą serię. Przyciągaj pod dolne żebra i kończ, gdy tułów zaczyna się podnosić do sztangi. |
| **PL tip (proposed)** | Kąt tułowia ustalony na całą serię. Przyciągaj pod dolne żebra i kończ, gdy tułów zaczyna się podnosić do sztangi. |
| **Decision** | applied |

### `barbell-squat`

| | |
|---|---|
| **EN name** | Barbell Squat |
| **PL name** | Przysiad ze sztangą |
| **Pattern** | squat |
| **Tip source** | library (`approved`) |
| **EN tip** | Every rep breaks parallel. Depth is the standard the set is judged by — when it shortens, the set is over. |
| **PL tip (current)** | Każde powtórzenie schodzi poniżej równoległej. To głębokość decyduje o serii — gdy się skraca, seria jest skończona. |
| **PL tip (proposed)** | Każde powtórzenie schodzi poniżej równoległej. To głębokość decyduje o serii — gdy się skraca, seria jest skończona. |
| **Decision** | applied |

### `bayesian-cable-curl`

| | |
|---|---|
| **EN name** | Bayesian Cable Curl |
| **PL name** | Uginanie z linką za tułowiem |
| **Pattern** | elbow-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Step forward so the arm starts behind the torso — that lengthened start is the whole reason for the movement. |
| **PL tip (current)** | Zrób krok w przód, aby ramię zaczynało za tułowiem – ta rozciągnięta pozycja to cały sens tego ćwiczenia. |
| **PL tip (proposed)** | Zrób krok w przód, aby ramię zaczynało za tułowiem – ta rozciągnięta pozycja to cały sens tego ćwiczenia. |
| **Decision** | applied |

### `behind-the-neck-press`

| | |
|---|---|
| **EN name** | Behind-the-Neck Press |
| **PL name** | Wyciskanie zza karku |
| **Pattern** | vertical-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Light and crisp. Strict form, no momentum. |
| **PL tip (current)** | Czysto technicznie, bez rozpędu. |
| **PL tip (proposed)** | Czysto technicznie, bez rozpędu. |
| **Decision** | applied |

### `bench-hip-thrust`

| | |
|---|---|
| **EN name** | Bench Hip Thrust |
| **PL name** | Hip thrust z oparciem o ławkę |
| **Pattern** | hip-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Bench under the shoulder blades, chin tucked, ribs down. Finish with the hips level rather than hyperextending the lower back. |
| **PL tip (current)** | Ławka pod łopatkami, broda schowana, żebra w dół. Kończ z biodrami w linii, bez przeprostu w lędźwiach. |
| **PL tip (proposed)** | Ławka pod łopatkami, broda schowana, żebra w dół. Kończ z biodrami w linii, bez przeprostu w lędźwiach. |
| **Decision** | applied |

### `bench-reverse-crunch`

| | |
|---|---|
| **EN name** | Bench Reverse Crunch |
| **PL name** | Odwrotne spięcia na ławce |
| **Pattern** | core-flexion |
| **Tip source** | library (`draft`) |
| **EN tip** | Lift the hips off the bench with the abs rather than swinging the legs. Slow on the way down. |
| **PL tip (current)** | Unoś biodra nad ławkę brzuchem, nie zamachem nóg. Powoli w dół. |
| **PL tip (proposed)** | Unoś biodra nad ławkę brzuchem, nie zamachem nóg. Powoli w dół. |
| **Decision** | applied |

### `bench-supported-one-arm-dumbbell-row`

| | |
|---|---|
| **EN name** | Bench-Supported One-Arm Dumbbell Row |
| **PL name** | Jednorącz wiosłowanie hantlem z podparciem |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`draft`) |
| **EN tip** | Support the free hand and keep the torso square. Row toward the hip rather than the armpit. |
| **PL tip (current)** | Oprzyj wolną rękę i trzymaj tułów prosto. Wiosłuj w stronę biodra, nie pachy. |
| **PL tip (proposed)** | Oprzyj wolną rękę i trzymaj tułów prosto. Wiosłuj w stronę biodra, nie pachy. |
| **Decision** | applied |

### `block-pull`

| | |
|---|---|
| **EN name** | Block Pull (mid-shin) |
| **PL name** | Martwy ciąg z podkładek (połowa piszczeli) |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Bar on the blocks, same brace and lat set as a floor pull. Do not let the shortened range turn it into a stiff-legged pull. |
| **PL tip (current)** | Sztanga na blokach, to samo napięcie i ustawienie najszerszych co przy ciągu z podłogi. Nie pozwól, by skrócony zakres zamienił go w ciąg na prostych nogach. |
| **PL tip (proposed)** | Sztanga na blokach, to samo napięcie i ustawienie najszerszych co przy ciągu z podłogi. Nie pozwól, by skrócony zakres zamienił go w ciąg na prostych nogach. |
| **Decision** | applied |

### `bodyweight-dip`

| | |
|---|---|
| **EN name** | Bodyweight Dips |
| **PL name** | Pompki na poręczach |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Slight forward lean for the chest, upright for the triceps. Lower to a comfortable stretch and stop the set at the first sign of shoulder pinch. |
| **PL tip (current)** | Lekki pochyl w przód dla klatki, pionowo dla tricepsa. Schodź do komfortowego rozciągnięcia i kończ przy pierwszym ukłuciu w barku. |
| **PL tip (proposed)** | Lekki pochyl w przód dla klatki, pionowo dla tricepsa. Schodź do komfortowego rozciągnięcia i kończ przy pierwszym ukłuciu w barku. |
| **Decision** | applied |

### `bulgarian-split-squat`

| | |
|---|---|
| **EN name** | Bulgarian Split Squat |
| **PL name** | Przysiad bułgarski |
| **Pattern** | lunge |
| **Tip source** | library (`draft`) |
| **EN tip** | Rear foot on the bench, front shin roughly vertical, weight through the whole front foot. Work the weaker side first and match it with the stronger one. |
| **PL tip (current)** | Tylna stopa na ławce, przednia goleń mniej więcej pionowo, ciężar na całej przedniej stopie. Zacznij od słabszej strony i wyrównaj nią silniejszą. |
| **PL tip (proposed)** | Tylna stopa na ławce, przednia goleń mniej więcej pionowo, ciężar na całej przedniej stopie. Zacznij od słabszej strony i wyrównaj nią silniejszą. |
| **Decision** | applied |

### `cable-crossover`

| | |
|---|---|
| **EN name** | Cable Crossover |
| **PL name** | Krzyżowanie linek wyciągu |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Slight forward lean, hands crossing past each other at the finish. Control the return; the stretch is the point. |
| **PL tip (current)** | Lekki pochyl, dłonie mijają się na końcu ruchu. Kontroluj powrót; to rozciągnięcie jest celem. |
| **PL tip (proposed)** | Lekki pochyl, dłonie mijają się na końcu ruchu. Kontroluj powrót; to rozciągnięcie jest celem. |
| **Decision** | applied |

### `cable-crunch`

| | |
|---|---|
| **EN name** | Cable Crunch |
| **PL name** | Spięcia brzucha na wyciągu |
| **Pattern** | core-flexion |
| **Tip source** | library (`draft`) |
| **EN tip** | Round the spine down toward the knees rather than hinging at the hips. Control the return. |
| **PL tip (current)** | Zaokrąglaj kręgosłup w stronę kolan zamiast zginać się w biodrach. Kontroluj powrót. |
| **PL tip (proposed)** | Zaokrąglaj kręgosłup w stronę kolan zamiast zginać się w biodrach. Kontroluj powrót. |
| **Decision** | applied |

### `cable-crunches`

| | |
|---|---|
| **EN name** | Cable Crunches |
| **PL name** | Spięcia brzucha na wyciągu |
| **Pattern** | core-flexion |
| **Tip source** | library (`draft`) |
| **EN tip** | Round the spine down toward the knees rather than hinging at the hips. Control the return. |
| **PL tip (current)** | Zaokrąglaj kręgosłup w stronę kolan zamiast zginać się w biodrach. Kontroluj powrót. |
| **PL tip (proposed)** | Zaokrąglaj kręgosłup w stronę kolan zamiast zginać się w biodrach. Kontroluj powrót. |
| **Decision** | applied |

### `cable-curl`

| | |
|---|---|
| **EN name** | Cable Curl |
| **PL name** | Uginanie na wyciągu |
| **Pattern** | elbow-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Constant tension top to bottom — the cable is the point, so do not rest at the bottom. |
| **PL tip (current)** | Stałe napięcie od góry do dołu – linka ma to zapewnić, więc nie odpoczywaj na dole. |
| **PL tip (proposed)** | Stałe napięcie od góry do dołu – linka ma to zapewnić, więc nie odpoczywaj na dole. |
| **Decision** | applied |

### `cable-cyclist-squat`

| | |
|---|---|
| **EN name** | Cable Cyclist Squat |
| **PL name** | Przysiad kolarski na wyciągu |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Heels elevated and stance narrow so the quads take the work. Keep the cable tension constant at the top. |
| **PL tip (current)** | Pięty uniesione i wąski rozstaw, żeby pracowały czworogłowe. Utrzymaj stałe napięcie linki na górze. |
| **PL tip (proposed)** | Pięty uniesione i wąski rozstaw, żeby pracowały czworogłowe. Utrzymaj stałe napięcie linki na górze. |
| **Decision** | applied |

### `cable-fly`

| | |
|---|---|
| **EN name** | Cable Flyes (mid height) |
| **PL name** | Rozpiętki na wyciągu (środkowa wysokość) |
| **Pattern** | horizontal-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Big stretch at the bottom. Push chest forward, feel the pec stretch. |
| **PL tip (current)** | Duże rozciągnięcie na dole. Wypchnij klatkę do przodu, poczuj rozciągnięcie. |
| **PL tip (proposed)** | Duże rozciągnięcie na dole. Wypchnij klatkę do przodu, poczuj rozciągnięcie. |
| **Decision** | applied |

### `cable-lateral-raise`

| | |
|---|---|
| **EN name** | Cable Lateral Raise |
| **PL name** | Unoszenie ramienia bokiem na wyciągu |
| **Pattern** | shoulder-abduction |
| **Tip source** | library (`draft`) |
| **EN tip** | Constant tension through the whole range. Raise to shoulder height with the elbow leading and control the return. |
| **PL tip (current)** | Stałe napięcie przez cały zakres. Unoś łokciem do wysokości barków i kontroluj powrót. |
| **PL tip (proposed)** | Stałe napięcie przez cały zakres. Unoś łokciem do wysokości barków i kontroluj powrót. |
| **Decision** | applied |

### `cable-pull-through`

| | |
|---|---|
| **EN name** | Cable Pull-Through |
| **PL name** | Przeciąganie linki między nogami |
| **Pattern** | hip-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Drive the hips forward to finish; this is a hinge, not a squat or a lower-back extension. Squeeze at lockout without leaning back. |
| **PL tip (current)** | Kończ wypchnięciem bioder w przód; to zawias, nie przysiad ani wyprost dolnych pleców. Ściśnij w zamknięciu bez odchylania się. |
| **PL tip (proposed)** | Kończ wypchnięciem bioder w przód; to zawias, nie przysiad ani wyprost dolnych pleców. Ściśnij w zamknięciu bez odchylania się. |
| **Decision** | applied |

### `cable-romanian-deadlift`

| | |
|---|---|
| **EN name** | Cable Romanian Deadlift |
| **PL name** | Martwy ciąg rumuński na wyciągu |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Constant tension from the cable makes the stretch position the hardest part. Keep the pull horizontal rather than letting it drift up. |
| **PL tip (current)** | Stałe napięcie wyciągu sprawia, że najtrudniejsza jest pozycja rozciągnięcia. Prowadź ciąg poziomo, nie daj mu uciekać w górę. |
| **PL tip (proposed)** | Stałe napięcie wyciągu sprawia, że najtrudniejsza jest pozycja rozciągnięcia. Prowadź ciąg poziomo, nie daj mu uciekać w górę. |
| **Decision** | applied |

### `cable-triceps-extension`

| | |
|---|---|
| **EN name** | Cable Triceps Extension |
| **PL name** | Prostowanie ramion na wyciągu |
| **Pattern** | elbow-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Upper arm stays where you put it. Only the forearm moves. |
| **PL tip (current)** | Ramię pozostaje nieruchome. Porusza się wyłącznie przedramię. |
| **PL tip (proposed)** | Ramię pozostaje nieruchome. Porusza się wyłącznie przedramię. |
| **Decision** | applied |

### `calf-raise`

| | |
|---|---|
| **EN name** | Calf Raises |
| **PL name** | Wspięcia na palce |
| **Pattern** | calf |
| **Tip source** | library (`approved`) |
| **EN tip** | Accessory work chosen for a weak point. Full range, controlled, no swing. |
| **PL tip (current)** | Ćwiczenie akcesoryjne na słaby punkt. Pełny zakres, pod kontrolą, bez zamachu. |
| **PL tip (proposed)** | Ćwiczenie akcesoryjne na słaby punkt. Pełny zakres, pod kontrolą, bez zamachu. |
| **Decision** | applied |

### `calf`

| | |
|---|---|
| **EN name** | Calves |
| **PL name** | Łydki |
| **Pattern** | calf |
| **Tip source** | library (`draft`) |
| **EN tip** | Full stretch at the bottom and a real pause at the top. Bouncing turns this into a tendon exercise. |
| **PL tip (current)** | Pełne rozciągnięcie na dole i prawdziwa pauza na górze. Podskoki zamieniają to w ćwiczenie ścięgna. |
| **PL tip (proposed)** | Pełne rozciągnięcie na dole i prawdziwa pauza na górze. Podskoki zamieniają to w ćwiczenie ścięgna. |
| **Decision** | applied |

### `chin-up`

| | |
|---|---|
| **EN name** | Chin-Up |
| **PL name** | Podciąganie podchwytem |
| **Pattern** | vertical-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Supinated grip, shoulder width. Lead with the chest, finish with the bar at collarbone height. |
| **PL tip (current)** | Chwyt podchwytem na szerokość barków. Prowadź klatką, kończ ze sztangą na wysokości obojczyków. |
| **PL tip (proposed)** | Chwyt podchwytem na szerokość barków. Prowadź klatką, kończ ze sztangą na wysokości obojczyków. |
| **Decision** | applied |

### `close-neutral-grip-lat-pulldown`

| | |
|---|---|
| **EN name** | Close Neutral Grip Lat Pulldown |
| **PL name** | Ściąganie drążka wąskim chwytem neutralnym |
| **Pattern** | vertical-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Full stretch 'dead hang' at top, split movement: pulldown + scap pull at bottom, squeeze scap pull. |
| **PL tip (current)** | Pełne rozciągnięcie, „martwy zwis” na górze — rozbij ruch na dwie części: ściąganie łopatek, potem ściągnięcie drążka. |
| **PL tip (proposed)** | Pełne rozciągnięcie, „martwy zwis” na górze — rozbij ruch na dwie części: ściąganie łopatek, potem ściągnięcie drążka. |
| **Decision** | applied |

### `close-grip-bench-press`

| | |
|---|---|
| **EN name** | Close-Grip Bench Press |
| **PL name** | Wyciskanie sztangi wąskim chwytem |
| **Pattern** | horizontal-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Grip 1.5 hand-width closer than normal - around shoulder width. |
| **PL tip (current)** | Chwyt o 1,5 szerokości dłoni węższy niż normalnie – około szerokości barków. |
| **PL tip (proposed)** | Chwyt o 1,5 szerokości dłoni węższy niż normalnie – około szerokości barków. |
| **Decision** | applied |

### `close-grip-push-up`

| | |
|---|---|
| **EN name** | Close-Grip Push-Up |
| **PL name** | Pompka wąska |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Hands inside shoulder width, elbows tracking back. Keep the ribs down rather than arching to reach the floor. |
| **PL tip (current)** | Dłonie wężej niż barki, łokcie wzdłuż tułowia. Żebra w dół zamiast wygiania się, by dosięgnąć podłogi. |
| **PL tip (proposed)** | Dłonie wężej niż barki, łokcie wzdłuż tułowia. Żebra w dół zamiast wygiania się, by dosięgnąć podłogi. |
| **Decision** | applied |

### `conventional-deadlift`

| | |
|---|---|
| **EN name** | Conventional Deadlift |
| **PL name** | Martwy ciąg klasyczny |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Bar over mid-foot, lats set, hips high enough that the bar leaves the floor with the shoulders slightly ahead of it. Stop the set when the lower back starts rounding on the way up. |
| **PL tip (current)** | Sztanga nad środkiem stopy, najszersze napięte, biodra tak wysoko, żeby sztanga oderwała się z barkami minimalnie przed nią. Kończ serię, gdy dolne plecy zaczynają się zaokrąglać w górze. |
| **PL tip (proposed)** | Sztanga nad środkiem stopy, najszersze napięte, biodra tak wysoko, żeby sztanga oderwała się z barkami minimalnie przed nią. Kończ serię, gdy dolne plecy zaczynają się zaokrąglać w górze. |
| **Decision** | applied |

### `copenhagen-plank`

| | |
|---|---|
| **EN name** | Copenhagen Plank |
| **PL name** | Deska kopenhaska |
| **Pattern** | hip-adduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Press the top leg into the bench and hold a straight line from shoulder to foot. Use the knee-supported short lever before the ankle-supported long lever. |
| **PL tip (current)** | Dociśnij górną nogę do ławki i utrzymuj prostą linię od barku do stopy. Zacznij od krótkiej dźwigni na kolanie przed wersją na kostce. |
| **PL tip (proposed)** | Dociśnij górną nogę do ławki i utrzymuj prostą linię od barku do stopy. Zacznij od krótkiej dźwigni na kolanie przed wersją na kostce. |
| **Decision** | applied |

### `copenhagen-raise`

| | |
|---|---|
| **EN name** | Copenhagen Raise |
| **PL name** | Unoszenie kopenhaskie |
| **Pattern** | hip-adduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Lower the hips under control, then pull the body back into line with the top adductor. Keep the trunk stacked instead of rolling toward the bench. |
| **PL tip (current)** | Opuść biodra pod kontrolą, a następnie przywodzicielem górnej nogi wróć do prostej linii. Nie obracaj tułowia w stronę ławki. |
| **PL tip (proposed)** | Opuść biodra pod kontrolą, a następnie przywodzicielem górnej nogi wróć do prostej linii. Nie obracaj tułowia w stronę ławki. |
| **Decision** | applied |

### `dumbbell-romanian-deadlift`

| | |
|---|---|
| **EN name** | DB Romanian Deadlift |
| **PL name** | Martwy ciąg rumuński z hantlami |
| **Pattern** | hinge |
| **Tip source** | library (`approved`) |
| **EN tip** | Heavy. Straps OK. Dumbbells track the legs, 1-2 sec glute squeeze at top. |
| **PL tip (current)** | Ciężko. Paski dozwolone. Hantle prowadź wzdłuż nóg, 1–2 sekundy spięcia pośladków na górze. |
| **PL tip (proposed)** | Ciężko. Paski dozwolone. Hantle prowadź wzdłuż nóg, 1–2 sekundy spięcia pośladków na górze. |
| **Decision** | applied |

### `dead-hang`

| | |
|---|---|
| **EN name** | Dead Hang |
| **PL name** | Zwis na drążku |
| **Pattern** | core-antiextension |
| **Tip source** | library (`approved`) |
| **EN tip** | Full hang with the shoulders active, not collapsed. Time it; end the set when the grip starts sliding rather than when it fails. |
| **PL tip (current)** | Pełny zwis z aktywnymi barkami, nie zapadaj się w nich. Mierz czas; zakończ, gdy chwyt zaczyna się zsuwać, a nie gdy puszcza. |
| **PL tip (proposed)** | Pełny zwis z aktywnymi barkami, nie zapadaj się w nich. Mierz czas; zakończ, gdy chwyt zaczyna się zsuwać, a nie gdy puszcza. |
| **Decision** | applied |

### `dead-hang-plank`

| | |
|---|---|
| **EN name** | Dead Hang + Planks |
| **PL name** | Zwis na drążku + deska |
| **Pattern** | core-antiextension |
| **Tip source** | library (`approved`) |
| **EN tip** | Superseded: log the hang and the plank as separate movements. |
| **PL tip (current)** | Zastąpione: zapisuj zwis i deskę jako osobne ćwiczenia. |
| **PL tip (proposed)** | Zastąpione: zapisuj zwis i deskę jako osobne ćwiczenia. |
| **Decision** | applied |

### `deficit-deadlift`

| | |
|---|---|
| **EN name** | Deficit Deadlift |
| **PL name** | Martwy ciąg z deficytu |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Standing on the deficit adds range at the hardest position. Keep the same start position you would use on the floor and reduce the load to get it. |
| **PL tip (current)** | Stanie na podwyższeniu dokłada zakresu w najtrudniejszej pozycji. Zachowaj tę samą pozycję startową co z podłogi i zmniejsz ciężar, żeby ją utrzymać. |
| **PL tip (proposed)** | Stanie na podwyższeniu dokłada zakresu w najtrudniejszej pozycji. Zachowaj tę samą pozycję startową co z podłogi i zmniejsz ciężar, żeby ją utrzymać. |
| **Decision** | applied |

### `deficit-push-up`

| | |
|---|---|
| **EN name** | Deficit Pushups |
| **PL name** | Pompki z deficytu |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Hands elevated on plates or handles for extra stretch. Lower slowly into the added range instead of dropping into it. |
| **PL tip (current)** | Dłonie na płytkach lub uchwytach dla dodatkowego rozciągnięcia. Schodź powoli w nowy zakres zamiast w niego wpadać. |
| **PL tip (proposed)** | Dłonie na płytkach lub uchwytach dla dodatkowego rozciągnięcia. Schodź powoli w nowy zakres zamiast w niego wpadać. |
| **Decision** | applied |

### `deficit-romanian-deadlift`

| | |
|---|---|
| **EN name** | Deficit RDLs |
| **PL name** | Martwy ciąg rumuński z deficytu |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Standing on a plate adds stretch at the bottom. Add range before you add load. |
| **PL tip (current)** | Stanie na płytce dokłada rozciągnięcia na dole. Najpierw zakres, potem ciężar. |
| **PL tip (proposed)** | Stanie na płytce dokłada rozciągnięcia na dole. Najpierw zakres, potem ciężar. |
| **Decision** | applied |

### `deficit-reverse-lunge`

| | |
|---|---|
| **EN name** | Deficit Reverse Lunge |
| **PL name** | Wykrok w tył z deficytu |
| **Pattern** | lunge |
| **Tip source** | library (`approved`) |
| **EN tip** | Front foot on plate. Back knee touches floor every rep. |
| **PL tip (current)** | Przednia stopa na krążku. Tylne kolano dotyka podłogi za każdym powtórzeniem. |
| **PL tip (proposed)** | Przednia stopa na krążku. Tylne kolano dotyka podłogi za każdym powtórzeniem. |
| **Decision** | applied |

### `deficit-snatch-grip-deadlift`

| | |
|---|---|
| **EN name** | Deficit Snatch Grip Deadlift |
| **PL name** | Martwy ciąg chwytem rwaniowym z deficytu |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Wide grip and a deficit put the upper back under real load. Keep the bar against the legs and stop when the upper back gives way. |
| **PL tip (current)** | Szeroki chwyt i deficyt obciążają górę pleców na serio. Trzymaj sztangę przy nogach i kończ, gdy góra pleców puszcza. |
| **PL tip (proposed)** | Szeroki chwyt i deficyt obciążają górę pleców na serio. Trzymaj sztangę przy nogach i kończ, gdy góra pleców puszcza. |
| **Decision** | applied |

### `diamond-push-up`

| | |
|---|---|
| **EN name** | Diamond Push-Up |
| **PL name** | Pompka diamentowa |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Hands together under the sternum, elbows close. Stop the set when the elbows start flaring. |
| **PL tip (current)** | Dłonie razem pod mostkiem, łokcie blisko. Kończ serię, gdy łokcie zaczynają uciekać na boki. |
| **PL tip (proposed)** | Dłonie razem pod mostkiem, łokcie blisko. Kończ serię, gdy łokcie zaczynają uciekać na boki. |
| **Decision** | applied |

### `dip`

| | |
|---|---|
| **EN name** | Dip |
| **PL name** | Pompki na poręczach |
| **Pattern** | horizontal-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Slight forward lean for chest, upright for triceps. Stop when the upper arm is just past parallel. |
| **PL tip (current)** | Lekki przechył w przód na klatkę, pionowo na triceps. Zatrzymaj się tuż za równoległością ramienia. |
| **PL tip (proposed)** | Lekki przechył w przód na klatkę, pionowo na triceps. Zatrzymaj się tuż za równoległością ramienia. |
| **Decision** | applied |

### `dragon-flags`

| | |
|---|---|
| **EN name** | Dragon Flags |
| **PL name** | Flagi smoka |
| **Pattern** | core-antiextension |
| **Tip source** | library (`approved`) |
| **EN tip** | Cheat the concentric if needed, control the eccentric (3-5 sec lowering). |
| **PL tip (current)** | Oszukuj fazę koncentryczną, jeśli trzeba; kontroluj ekscentrykę (3–5 s opuszczania). |
| **PL tip (proposed)** | Oszukuj fazę koncentryczną, jeśli trzeba; kontroluj ekscentrykę (3–5 s opuszczania). |
| **Decision** | applied |

### `dual-cable-chest-press`

| | |
|---|---|
| **EN name** | Dual-Cable Chest Press |
| **PL name** | Wyciskanie na dwóch wyciągach |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Cables set at chest height, a slight forward lean and a step out to load the start. Press and let the hands converge. |
| **PL tip (current)** | Wyciągi na wysokości klatki, lekki pochyl i krok w przód dla napięcia na starcie. Wyciskaj i pozwól dłoniom zbliżyć się. |
| **PL tip (proposed)** | Wyciągi na wysokości klatki, lekki pochyl i krok w przód dla napięcia na starcie. Wyciskaj i pozwól dłoniom zbliżyć się. |
| **Decision** | applied |

### `dual-cable-high-row`

| | |
|---|---|
| **EN name** | Dual-Cable High Row |
| **PL name** | Wysokie wiosłowanie na dwóch wyciągach |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`draft`) |
| **EN tip** | Pull down and back toward the lower ribs. Keep the chest up; this is a row, not a pulldown. |
| **PL tip (current)** | Przyciągaj w dół i w tył pod dolne żebra. Klatka wysoko; to wiosłowanie, nie ściąganie drążka. |
| **PL tip (proposed)** | Przyciągaj w dół i w tył pod dolne żebra. Klatka wysoko; to wiosłowanie, nie ściąganie drążka. |
| **Decision** | applied |

### `dumbbell-hammer-curl`

| | |
|---|---|
| **EN name** | Dumbbell Hammer Curl |
| **PL name** | Uginanie młotkowe z hantlami |
| **Pattern** | elbow-flexion |
| **Tip source** | library (`draft`) |
| **EN tip** | Neutral grip throughout, elbows fixed at the sides. Control the lowering; this one is easy to cheat. |
| **PL tip (current)** | Chwyt neutralny przez cały ruch, łokcie przy bokach. Kontroluj opuszczanie; tu łatwo oszukiwać. |
| **PL tip (proposed)** | Chwyt neutralny przez cały ruch, łokcie przy bokach. Kontroluj opuszczanie; tu łatwo oszukiwać. |
| **Decision** | applied |

### `dumbbell-hip-thrust`

| | |
|---|---|
| **EN name** | Dumbbell Hip Thrust |
| **PL name** | Hip thrust z hantlem |
| **Pattern** | hip-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Dumbbell across the hips with a pad. Same lockout as a barbell thrust: hips level, ribs down, brief squeeze. |
| **PL tip (current)** | Hantel na biodrach z podkładką. To samo zamknięcie co w wersji ze sztangą: biodra w linii, żebra w dół, krótkie spięcie. |
| **PL tip (proposed)** | Hantel na biodrach z podkładką. To samo zamknięcie co w wersji ze sztangą: biodra w linii, żebra w dół, krótkie spięcie. |
| **Decision** | applied |

### `dumbbell-pullover`

| | |
|---|---|
| **EN name** | Dumbbell Pullover |
| **PL name** | Przenoszenie hantla zza głowy |
| **Pattern** | vertical-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Ribs stay down as the arms go overhead. The stretch across the lats is the whole point — do not turn it into a press. |
| **PL tip (current)** | Żebra pozostają w dole, gdy ramiona idą za głowę. Chodzi o rozciągnięcie najszerszych — nie zamieniaj tego w wyciskanie. |
| **PL tip (proposed)** | Żebra pozostają w dole, gdy ramiona idą za głowę. Chodzi o rozciągnięcie najszerszych — nie zamieniaj tego w wyciskanie. |
| **Decision** | applied |

### `dumbbell-seal-row`

| | |
|---|---|
| **EN name** | Dumbbell Seal Row |
| **PL name** | Wiosłowanie leżąc na brzuchu (seal row) |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`draft`) |
| **EN tip** | Chest on the bench removes any body English. Pull to the hips and pause; nothing moves but the arms and shoulder blades. |
| **PL tip (current)** | Klatka na ławce wyklucza szarpanie. Przyciągaj do bioder i pauzuj; ruszają się tylko ramiona i łopatki. |
| **PL tip (proposed)** | Klatka na ławce wyklucza szarpanie. Przyciągaj do bioder i pauzuj; ruszają się tylko ramiona i łopatki. |
| **Decision** | applied |

### `dumbbell-walking-lunge`

| | |
|---|---|
| **EN name** | Dumbbell Walking Lunge |
| **PL name** | Wykroki chodzone z hantlami |
| **Pattern** | lunge |
| **Tip source** | library (`draft`) |
| **EN tip** | Torso upright, step long enough that the front shin stays near vertical. Stop when the steps start shortening. |
| **PL tip (current)** | Tułów pionowo, krok tak długi, żeby przednia goleń była blisko pionu. Stop, gdy kroki zaczynają się skracać. |
| **PL tip (proposed)** | Tułów pionowo, krok tak długi, żeby przednia goleń była blisko pionu. Stop, gdy kroki zaczynają się skracać. |
| **Decision** | applied |

### `ezbar-preacher-curl`

| | |
|---|---|
| **EN name** | EZ Preacher Curl |
| **PL name** | Uginanie na modlitewniku (EZ) |
| **Pattern** | elbow-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Full ROM, slow down at the stretched position. Control the negative. |
| **PL tip (current)** | Pełny zakres, zwolnij w rozciągnięciu. Kontroluj fazę ekscentryczną. |
| **PL tip (proposed)** | Pełny zakres, zwolnij w rozciągnięciu. Kontroluj fazę ekscentryczną. |
| **Decision** | applied |

### `ezbar-skullcrushers`

| | |
|---|---|
| **EN name** | EZ Skullcrushers |
| **PL name** | Wyciskanie francuskie leżąc (EZ) |
| **Pattern** | elbow-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Lower toward the forehead or just behind it with the elbows fixed. Stop the set at the first elbow discomfort rather than pushing through it. |
| **PL tip (current)** | Opuszczaj do czoła lub minimalnie za głowę, łokcie nieruchome. Kończ serię przy pierwszym dyskomforcie w łokciach zamiast przez niego przechodzić. |
| **PL tip (proposed)** | Opuszczaj do czoła lub minimalnie za głowę, łokcie nieruchome. Kończ serię przy pierwszym dyskomforcie w łokciach zamiast przez niego przechodzić. |
| **Decision** | applied |

### `face-pulls`

| | |
|---|---|
| **EN name** | Face Pulls |
| **PL name** | Przyciąganie do twarzy |
| **Pattern** | shoulder-horizontal-abduction |
| **Tip source** | library (`draft`) |
| **EN tip** | Rope at eye level, pull toward the face and rotate the hands back. Light and controlled; this is not a heavy row. |
| **PL tip (current)** | Lina na wysokości oczu, przyciągaj do twarzy i rotuj dłonie w tył. Lekko i pod kontrolą; to nie jest ciężkie wiosłowanie. |
| **PL tip (proposed)** | Lina na wysokości oczu, przyciągaj do twarzy i rotuj dłonie w tył. Lekko i pod kontrolą; to nie jest ciężkie wiosłowanie. |
| **Decision** | applied |

### `farmer-carry`

| | |
|---|---|
| **EN name** | Farmer Carry |
| **PL name** | Spacer farmera |
| **Pattern** | carry |
| **Tip source** | library (`approved`) |
| **EN tip** | Walk tall with short controlled steps. End the interval before grip or posture makes the carry unsafe. |
| **PL tip (current)** | Idź wysoko, krótkimi kontrolowanymi krokami. Zakończ odcinek, zanim chwyt lub pozycja staną się niebezpieczne. |
| **PL tip (proposed)** | Idź wysoko, krótkimi kontrolowanymi krokami. Zakończ odcinek, zanim chwyt lub pozycja staną się niebezpieczne. |
| **Decision** | applied |

### `farmer-hold`

| | |
|---|---|
| **EN name** | Farmer Holds |
| **PL name** | Przytrzymanie farmera |
| **Pattern** | carry |
| **Tip source** | library (`approved`) |
| **EN tip** | Stand tall with the shoulders packed and the ribs down. End the hold when posture breaks, not when the grip finally gives out. |
| **PL tip (current)** | Stój wyprostowany, barki ściągnięte, żebra w dół. Zakończ, gdy traci się postawę, a nie dopiero gdy puści chwyt. |
| **PL tip (proposed)** | Stój wyprostowany, barki ściągnięte, żebra w dół. Zakończ, gdy traci się postawę, a nie dopiero gdy puści chwyt. |
| **Decision** | applied |

### `flat-barbell-bench-press`

| | |
|---|---|
| **EN name** | Flat Barbell Bench Press |
| **PL name** | Wyciskanie sztangi leżąc |
| **Pattern** | horizontal-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Slow down before touching chest. No bouncing. Control the entire rep. |
| **PL tip (current)** | Zwolnij przed dotknięciem klatki. Bez odbijania. Kontroluj całe powtórzenie. |
| **PL tip (proposed)** | Zwolnij przed dotknięciem klatki. Bez odbijania. Kontroluj całe powtórzenie. |
| **Decision** | applied |

### `flat-dumbbell-press`

| | |
|---|---|
| **EN name** | Flat DB Press |
| **PL name** | Wyciskanie hantli na ławce płaskiej |
| **Pattern** | horizontal-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Flare elbows, arch back, go for full stretch. Think 'reaching' with your chest. |
| **PL tip (current)** | Łokcie szeroko, łuk w plecach, pełne rozciągnięcie na dole (hantle dotykają bicepsów). Myśl „sięganie do przodu” klatką piersiową. |
| **PL tip (proposed)** | Łokcie szeroko, łuk w plecach, pełne rozciągnięcie na dole (hantle dotykają bicepsów). Myśl „sięganie do przodu” klatką piersiową. |
| **Decision** | applied |

### `french-press`

| | |
|---|---|
| **EN name** | French Press |
| **PL name** | Wyciskanie francuskie |
| **Pattern** | elbow-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Elbows in and pointed up, lower behind the head under control. Reduce the load before letting the elbows flare. |
| **PL tip (current)** | Łokcie blisko i skierowane w górę, opuszczaj za głowę pod kontrolą. Zmniejsz ciężar, zanim łokcie zaczną się rozjeżdżać. |
| **PL tip (proposed)** | Łokcie blisko i skierowane w górę, opuszczaj za głowę pod kontrolą. Zmniejsz ciężar, zanim łokcie zaczną się rozjeżdżać. |
| **Decision** | applied |

### `frog-pump`

| | |
|---|---|
| **EN name** | Frog Pump |
| **PL name** | Wypychanie bioder w pozycji żaby |
| **Pattern** | hip-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Soles together, knees out. Short range and constant tension; drive from the glutes rather than the lower back. |
| **PL tip (current)** | Podeswy razem, kolana na zewnątrz. Krótki zakres i stałe napięcie; pchaj z pośladków, nie z dolnych pleców. |
| **PL tip (proposed)** | Podeswy razem, kolana na zewnątrz. Krótki zakres i stałe napięcie; pchaj z pośladków, nie z dolnych pleców. |
| **Decision** | applied |

### `front-squat`

| | |
|---|---|
| **EN name** | Front Squats |
| **PL name** | Przysiad przedni |
| **Pattern** | squat |
| **Tip source** | library (`approved`) |
| **EN tip** | Full ROM, slow eccentric. Stay upright, elbows high. |
| **PL tip (current)** | Pełny zakres ruchu, wolna faza ekscentryczna. Trzymaj tułów prosto, łokcie wysoko. |
| **PL tip (proposed)** | Pełny zakres ruchu, wolna faza ekscentryczna. Trzymaj tułów prosto, łokcie wysoko. |
| **Decision** | applied |

### `front-foot-elevated-bulgarian-split-squat`

| | |
|---|---|
| **EN name** | Front-Foot Elevated Bulgarian Split Squat |
| **PL name** | Przysiad bułgarski z przednią nogą uniesioną |
| **Pattern** | lunge |
| **Tip source** | library (`approved`) |
| **EN tip** | Hold rack with one hand, DB in other. Rear foot shoelaces on bench (toes DOWN). Sit back, limit front knee travel, stay upright. |
| **PL tip (current)** | Trzymaj stojak jedną ręką, hantlę w drugiej. Tylna stopa sznurówkami na ławce (palce w dół). Siadaj do tyłu — ogranicz wyjście kolana do przodu, trzymaj tułów prosto. |
| **PL tip (proposed)** | Trzymaj stojak jedną ręką, hantlę w drugiej. Tylna stopa sznurówkami na ławce (palce w dół). Siadaj do tyłu — ogranicz wyjście kolana do przodu, trzymaj tułów prosto. |
| **Decision** | applied |

### `glute-bridge`

| | |
|---|---|
| **EN name** | Glute Bridge |
| **PL name** | Mostek pośladkowy |
| **Pattern** | hip-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Bell across the hips, chin tucked, ribs down. Finish with the hips level to the knees — not by arching the lower back. |
| **PL tip (current)** | Ciężar na biodrach, broda schowana, żebra w dole. Kończ z biodrami na wysokości kolan — nie przez wyginanie lędźwi. |
| **PL tip (proposed)** | Ciężar na biodrach, broda schowana, żebra w dole. Kończ z biodrami na wysokości kolan — nie przez wyginanie lędźwi. |
| **Decision** | applied |

### `glute-pump-finisher`

| | |
|---|---|
| **EN name** | Glute Pump Finisher |
| **PL name** | Dopalenie pośladków |
| **Pattern** | hip-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | 100 reps banded thrust/abduction in under 5 minutes. Chase the pump. |
| **PL tip (current)** | 100 powtórzeń hip thrustu lub odwodzenia z gumą w mniej niż 5 minut. Celuj w maksymalną pompę. |
| **PL tip (proposed)** | 100 powtórzeń hip thrustu lub odwodzenia z gumą w mniej niż 5 minut. Celuj w maksymalną pompę. |
| **Decision** | applied |

### `glute-ham-raise`

| | |
|---|---|
| **EN name** | Glute-Ham Raise |
| **PL name** | Unoszenie tułowia na GHR |
| **Pattern** | knee-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Control the eccentric, explode up. Use assistance if needed for full ROM. |
| **PL tip (current)** | Kontroluj fazę ekscentryczną, wystrzel do góry. Użyj pomocy (odepchnij się od czegoś na dole), jeśli potrzeba pełnego zakresu. |
| **PL tip (proposed)** | Kontroluj fazę ekscentryczną, wystrzel do góry. Użyj pomocy (odepchnij się od czegoś na dole), jeśli potrzeba pełnego zakresu. |
| **Decision** | applied |

### `goblet-heel-elevated-squat`

| | |
|---|---|
| **EN name** | Goblet Heel-Elevated Squat |
| **PL name** | Przysiad goblet z uniesionymi piętami |
| **Pattern** | squat |
| **Tip source** | library (`approved`) |
| **EN tip** | Heels on a book or a plate. Hold the bell at the chest and sit straight down — the elevation is there to let the knees travel. |
| **PL tip (current)** | Pięty na książce lub talerzu. Trzymaj ciężar przy klatce i siadaj pionowo w dół — uniesienie ma pozwolić kolanom wyjść do przodu. |
| **PL tip (proposed)** | Pięty na książce lub talerzu. Trzymaj ciężar przy klatce i siadaj pionowo w dół — uniesienie ma pozwolić kolanom wyjść do przodu. |
| **Decision** | applied |

### `goblet-skater-squat`

| | |
|---|---|
| **EN name** | Goblet Skater Squat |
| **PL name** | Skater squat z hantlem |
| **Pattern** | lunge |
| **Tip source** | library (`approved`) |
| **EN tip** | Rear knee tracks down behind you and taps softly. The counterweight at the chest is what makes it balanceable. |
| **PL tip (current)** | Tylne kolano schodzi za tobą i delikatnie dotyka podłoża. Przeciwwaga przy klatce pozwala utrzymać równowagę. |
| **PL tip (proposed)** | Tylne kolano schodzi za tobą i delikatnie dotyka podłoża. Przeciwwaga przy klatce pozwala utrzymać równowagę. |
| **Decision** | applied |

### `good-mornings`

| | |
|---|---|
| **EN name** | Good Mornings |
| **PL name** | Skłon „good morning” ze sztangą |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Bar high on the back, hips back, spine held still. Keep the load light enough that the position never changes. |
| **PL tip (current)** | Sztanga wysoko na plecach, biodra w tył, kręgosłup nieruchomy. Ciężar tak lekki, żeby pozycja nigdy się nie zmieniała. |
| **PL tip (proposed)** | Sztanga wysoko na plecach, biodra w tył, kręgosłup nieruchomy. Ciężar tak lekki, żeby pozycja nigdy się nie zmieniała. |
| **Decision** | applied |

### `hack-squat`

| | |
|---|---|
| **EN name** | Hack Squat |
| **PL name** | Hack squat (maszyna) |
| **Pattern** | squat |
| **Tip source** | library (`approved`) |
| **EN tip** | Feet narrow, full ROM - ass to grass. Try to touch calves with glutes. |
| **PL tip (current)** | Stopy wąsko, pełny zakres – tyłek do ziemi. Spróbuj dotknąć łydek pośladkami. |
| **PL tip (proposed)** | Stopy wąsko, pełny zakres – tyłek do ziemi. Spróbuj dotknąć łydek pośladkami. |
| **Decision** | applied |

### `hack-calf-raise`

| | |
|---|---|
| **EN name** | Hack Squat Calf Raises |
| **PL name** | Wspięcia na palce na hack squat |
| **Pattern** | calf |
| **Tip source** | library (`approved`) |
| **EN tip** | 1 second pause at bottom, slow eccentric. |
| **PL tip (current)** | 1 sek pauza na dole, wolna ekscentryka. |
| **PL tip (proposed)** | 1 sek pauza na dole, wolna ekscentryka. |
| **Decision** | applied |

### `half-kneeling-rotational-row`

| | |
|---|---|
| **EN name** | Half-Kneeling Rotational Cable Row |
| **PL name** | Rotacyjne wiosłowanie na wyciągu w klęku |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Initiate with a controlled trunk turn, then row; reverse the sequence slowly. |
| **PL tip (current)** | Zacznij od kontrolowanego obrotu tułowia, potem wiosłuj; wracaj powoli w odwrotnej kolejności. |
| **PL tip (proposed)** | Zacznij od kontrolowanego obrotu tułowia, potem wiosłuj; wracaj powoli w odwrotnej kolejności. |
| **Decision** | applied |

### `ham-curl`

| | |
|---|---|
| **EN name** | Ham Curls |
| **PL name** | Uginanie nóg |
| **Pattern** | knee-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Accessory work chosen for a weak point. Full range, controlled, no swing. |
| **PL tip (current)** | Ćwiczenie akcesoryjne na słaby punkt. Pełny zakres, pod kontrolą, bez zamachu. |
| **PL tip (proposed)** | Ćwiczenie akcesoryjne na słaby punkt. Pełny zakres, pod kontrolą, bez zamachu. |
| **Decision** | applied |

### `hammer-chest-press`

| | |
|---|---|
| **EN name** | Hammer Chest Press |
| **PL name** | Wyciskanie na maszynie Hammer |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Set the seat so the handles line up with mid-chest. Press without shrugging, and stop short of a hard lockout to keep tension. |
| **PL tip (current)** | Ustaw siedzisko tak, żeby uchwyty były na wysokości środka klatki. Wyciskaj bez wzruszania barków i nie prostuj twardo na górze, żeby utrzymać napięcie. |
| **PL tip (proposed)** | Ustaw siedzisko tak, żeby uchwyty były na wysokości środka klatki. Wyciskaj bez wzruszania barków i nie prostuj twardo na górze, żeby utrzymać napięcie. |
| **Decision** | applied |

### `hammer-curl`

| | |
|---|---|
| **EN name** | Hammer Curls |
| **PL name** | Uginanie młotkowe |
| **Pattern** | elbow-flexion |
| **Tip source** | library (`draft`) |
| **EN tip** | Neutral grip, elbows fixed at the sides, no swing. Lower under control — this one is easy to cheat and the eccentric is where the brachialis works. |
| **PL tip (current)** | Chwyt neutralny, łokcie przy bokach, bez bujania. Opuszczaj pod kontrolą — tu łatwo oszukiwać, a faza ekscentryczna buduje ramienne. |
| **PL tip (proposed)** | Chwyt neutralny, łokcie przy bokach, bez bujania. Opuszczaj pod kontrolą — tu łatwo oszukiwać, a faza ekscentryczna buduje ramienne. |
| **Decision** | applied |

### `hammer-lower-row`

| | |
|---|---|
| **EN name** | Hammer Lower Row |
| **PL name** | Wiosłowanie Hammer (dolne) |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Drive the elbows back and down toward the hips to bias the lats. |
| **PL tip (current)** | Prowadź łokcie w tył i w dół w stronę bioder, by mocniej zaangażować najszersze. |
| **PL tip (proposed)** | Prowadź łokcie w tył i w dół w stronę bioder, by mocniej zaangażować najszersze. |
| **Decision** | applied |

### `hammer-pulldown`

| | |
|---|---|
| **EN name** | Hammer Pulldown (Underhand) |
| **PL name** | Ściąganie Hammer podchwytem |
| **Pattern** | vertical-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Go single-arm for max stretch. Add squeeze at bottom to increase difficulty. |
| **PL tip (current)** | Jednorącz dla maks. rozciągnięcia. Dodaj ściśnięcie na dole, by zwiększyć trudność. |
| **PL tip (proposed)** | Jednorącz dla maks. rozciągnięcia. Dodaj ściśnięcie na dole, by zwiększyć trudność. |
| **Decision** | applied |

### `hammer-underhand-pulldown`

| | |
|---|---|
| **EN name** | Hammer Underhand Pulldown |
| **PL name** | Ściąganie Hammer podchwytem |
| **Pattern** | vertical-pull |
| **Tip source** | library (`draft`) |
| **EN tip** | Underhand grip brings in the lower lats and biceps. Drive the elbows to the ribs and stop the set when the torso starts swinging. |
| **PL tip (current)** | Podchwyt angażuje dolne najszersze i biceps. Prowadź łokcie do żeber i kończ serię, gdy tułów zaczyna się bujać. |
| **PL tip (proposed)** | Podchwyt angażuje dolne najszersze i biceps. Prowadź łokcie do żeber i kończ serię, gdy tułów zaczyna się bujać. |
| **Decision** | applied |

### `hammer-upper-row`

| | |
|---|---|
| **EN name** | Hammer Upper Row |
| **PL name** | Wiosłowanie Hammer (górne) |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Pull toward the upper ribs and hold the squeeze. Let the shoulder blades travel, do not lock them down. |
| **PL tip (current)** | Ciągnij w stronę górnych żeber i przytrzymaj spięcie. Pozwól łopatkom pracować, nie blokuj ich. |
| **PL tip (proposed)** | Ciągnij w stronę górnych żeber i przytrzymaj spięcie. Pozwól łopatkom pracować, nie blokuj ich. |
| **Decision** | applied |

### `hanging-knee-raise`

| | |
|---|---|
| **EN name** | Hanging Knee Raise |
| **PL name** | Unoszenie kolan w zwisie |
| **Pattern** | core-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Curl the pelvis toward the ribs rather than just lifting the thighs. |
| **PL tip (current)** | Zwijaj miednicę w stronę żeber, zamiast tylko unosić uda. |
| **PL tip (proposed)** | Zwijaj miednicę w stronę żeber, zamiast tylko unosić uda. |
| **Decision** | applied |

### `hanging-leg-raise`

| | |
|---|---|
| **EN name** | Hanging Leg Raises |
| **PL name** | Unoszenie nóg w zwisie |
| **Pattern** | core-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Straight legs if bent is too easy. No swinging. |
| **PL tip (current)** | Proste nogi, jeśli zgięte są za łatwe. Bez kołysania. |
| **PL tip (proposed)** | Proste nogi, jeśli zgięte są za łatwe. Bez kołysania. |
| **Decision** | applied |

### `heavy-rolling-tricep-extension`

| | |
|---|---|
| **EN name** | Heavy Rolling Tricep Extensions |
| **PL name** | Ciężkie wyciskanie francuskie z toczeniem |
| **Pattern** | elbow-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Heavy tricep option – focusing on lockout strength |
| **PL tip (current)** | Ciężka opcja na triceps — skup się na sile w zamknięciu ruchu. |
| **PL tip (proposed)** | Ciężka opcja na triceps — skup się na sile w zamknięciu ruchu. |
| **Decision** | applied |

### `heel-elevated-goblet-squat`

| | |
|---|---|
| **EN name** | Heel-Elevated Goblet Squat |
| **PL name** | Przysiad goblet z uniesionymi piętami |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Heels raised, torso tall, knees travelling forward over the toes. Sit straight down rather than back. |
| **PL tip (current)** | Pięty uniesione, tułów wysoko, kolana jadą w przód za palce. Schodź prosto w dół, nie w tył. |
| **PL tip (proposed)** | Pięty uniesione, tułów wysoko, kolana jadą w przód za palce. Schodź prosto w dół, nie w tył. |
| **Decision** | applied |

### `heels-off-narrow-leg-press`

| | |
|---|---|
| **EN name** | Heels-Off Narrow Leg Press |
| **PL name** | Suwnica – pięty w górze, wąsko |
| **Pattern** | squat |
| **Tip source** | library (`approved`) |
| **EN tip** | Knees out, deep stretch at the bottom. Try to touch hamstrings with calves. |
| **PL tip (current)** | Kolana na zewnątrz, głębokie rozciągnięcie na dole. Próbuj dotknąć dwugłowymi łydek. |
| **PL tip (proposed)** | Kolana na zewnątrz, głębokie rozciągnięcie na dole. Próbuj dotknąć dwugłowymi łydek. |
| **Decision** | applied |

### `high-box-squat`

| | |
|---|---|
| **EN name** | High Box Squat |
| **PL name** | Przysiad na wysoką skrzynię |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Sit back to the box under control and pause without rocking. The box sets the depth, not a bounce off it. |
| **PL tip (current)** | Siadaj na skrzynię pod kontrolą i pauzuj bez odbijania. To skrzynia ustawia głębokość, nie odbicie od niej. |
| **PL tip (proposed)** | Siadaj na skrzynię pod kontrolą i pauzuj bez odbijania. To skrzynia ustawia głębokość, nie odbicie od niej. |
| **Decision** | applied |

### `high-elbow-facepulls`

| | |
|---|---|
| **EN name** | High-Elbow Facepulls |
| **PL name** | Przyciąganie do twarzy z wysokimi łokciami |
| **Pattern** | shoulder-horizontal-abduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Cable at forehead height, wide elbows, external rotation at top (thumbs back). Light weight, perfect form. |
| **PL tip (current)** | Wyciąg na wysokości czoła, szerokie łokcie, rotacja zewnętrzna na górze (kciuki do tyłu). Lekki ciężar, idealna forma. |
| **PL tip (proposed)** | Wyciąg na wysokości czoła, szerokie łokcie, rotacja zewnętrzna na górze (kciuki do tyłu). Lekki ciężar, idealna forma. |
| **Decision** | applied |

### `high-foot-leg-press`

| | |
|---|---|
| **EN name** | High-Foot Leg Press |
| **PL name** | Suwnica – stopy wysoko |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Feet high on the platform shifts the work toward the hips and hamstrings. Keep the lower back flat against the pad. |
| **PL tip (current)** | Stopy wysoko na platformie przenoszą pracę na biodra i dwugłowe. Dolne plecy cały czas płasko na oparciu. |
| **PL tip (proposed)** | Stopy wysoko na platformie przenoszą pracę na biodra i dwugłowe. Dolne plecy cały czas płasko na oparciu. |
| **Decision** | applied |

### `hip-adduction`

| | |
|---|---|
| **EN name** | Hip Adduction |
| **PL name** | Przywodzenie bioder |
| **Pattern** | hip-adduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Stretch with warm-up, then max width. Use arms to help wedge into position if needed. |
| **PL tip (current)** | Rozciągnij się na rozgrzewce, potem ustaw maksymalną szerokość. Rękami dociśnij się w pozycję, jeśli trzeba. |
| **PL tip (proposed)** | Rozciągnij się na rozgrzewce, potem ustaw maksymalną szerokość. Rękami dociśnij się w pozycję, jeśli trzeba. |
| **Decision** | applied |

### `hip-thrust`

| | |
|---|---|
| **EN name** | Hip Thrusts |
| **PL name** | Hip thrust na maszynie |
| **Pattern** | hip-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Accessory work chosen for a weak point. Full range, controlled, no swing. |
| **PL tip (current)** | Ćwiczenie akcesoryjne na słaby punkt. Pełny zakres, pod kontrolą, bez zamachu. |
| **PL tip (proposed)** | Ćwiczenie akcesoryjne na słaby punkt. Pełny zakres, pod kontrolą, bez zamachu. |
| **Decision** | applied |

### `hip-supported-db-deadlift`

| | |
|---|---|
| **EN name** | Hip-Supported Dumbbell Deadlift |
| **PL name** | Martwy ciąg z hantlami z podparciem bioder |
| **Pattern** | hinge |
| **Tip source** | library (`approved`) |
| **EN tip** | Push the hips back into the support. Use straps once grip fails before the hamstrings do. |
| **PL tip (current)** | Wypychaj biodra w podparcie. Użyj pasków, gdy chwyt puszcza wcześniej niż dwugłowe. |
| **PL tip (proposed)** | Wypychaj biodra w podparcie. Użyj pasków, gdy chwyt puszcza wcześniej niż dwugłowe. |
| **Decision** | applied |

### `incline-barbell-bench-press`

| | |
|---|---|
| **EN name** | Incline Barbell Bench Press |
| **PL name** | Wyciskanie sztangi na ławce skośnej |
| **Pattern** | incline-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Slow down before touching chest. No bouncing. |
| **PL tip (current)** | Zwolnij przed dotknięciem klatki. Bez odbicia. |
| **PL tip (proposed)** | Zwolnij przed dotknięciem klatki. Bez odbicia. |
| **Decision** | applied |

### `incline-dumbbell-bench-press`

| | |
|---|---|
| **EN name** | Incline DB Bench Press |
| **PL name** | Wyciskanie hantli na skosie |
| **Pattern** | incline-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Flare elbows, arch back, go for full stretch. Think 'reaching' with your chest. |
| **PL tip (current)** | Łokcie szeroko, łuk w plecach, pełne rozciągnięcie na dole (hantle dotykają bicepsów). Myśl „sięganie do przodu” klatką piersiową. |
| **PL tip (proposed)** | Łokcie szeroko, łuk w plecach, pełne rozciągnięcie na dole (hantle dotykają bicepsów). Myśl „sięganie do przodu” klatką piersiową. |
| **Decision** | applied |

### `inverted-row`

| | |
|---|---|
| **EN name** | Inverted Rows |
| **PL name** | Wiosłowanie australijskie |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`draft`) |
| **EN tip** | Body in one line, bar to the sternum, shoulder blades finishing together. Raise the bar or bend the knees to regress rather than shortening the range. |
| **PL tip (current)** | Ciało w jednej linii, drążek do mostka, łopatki schodzą się na końcu. Podnieś drążek lub ugnij kolana zamiast skracać zakres. |
| **PL tip (proposed)** | Ciało w jednej linii, drążek do mostka, łopatki schodzą się na końcu. Podnieś drążek lub ugnij kolana zamiast skracać zakres. |
| **Decision** | applied |

### `kas-glute-bridge`

| | |
|---|---|
| **EN name** | Kas Glute Bridge |
| **PL name** | Mostek pośladkowy Kasa |
| **Pattern** | hip-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Upper back on bench. Lower only 5-10 cm, never touch floor. Constant tension. |
| **PL tip (current)** | Górna część pleców na ławce. Opuszczaj tylko 5-10 cm – nigdy nie dotykaj podłogi. Ciągłe napięcie. |
| **PL tip (proposed)** | Górna część pleców na ławce. Opuszczaj tylko 5-10 cm – nigdy nie dotykaj podłogi. Ciągłe napięcie. |
| **Decision** | applied |

### `kettlebell-shoulder-press`

| | |
|---|---|
| **EN name** | Kettlebell Shoulder Press |
| **PL name** | Wyciskanie kettla nad głowę |
| **Pattern** | vertical-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Rack the bell on the forearm, ribs down, press without leaning away. Match the weaker side. |
| **PL tip (current)** | Oprzyj kettel na przedramieniu, żebra w dół, wyciskaj bez odchylania tułowia. Dopasuj do słabszej strony. |
| **PL tip (proposed)** | Oprzyj kettel na przedramieniu, żebra w dół, wyciskaj bez odchylania tułowia. Dopasuj do słabszej strony. |
| **Decision** | applied |

### `kettlebell-swing`

| | |
|---|---|
| **EN name** | Kettlebell Swing |
| **PL name** | Swing kettlem |
| **Pattern** | hinge |
| **Tip source** | library (`approved`) |
| **EN tip** | Snap the hips and let the bell float; stop when the hinge turns into a squat or the back loses position. |
| **PL tip (current)** | Dynamicznie wyprostuj biodra i pozwól kettlowi unieść się; przerwij, gdy zawias zmienia się w przysiad albo tracisz pozycję pleców. |
| **PL tip (proposed)** | Dynamicznie wyprostuj biodra i pozwól kettlowi unieść się; przerwij, gdy zawias zmienia się w przysiad albo tracisz pozycję pleców. |
| **Decision** | applied |

### `knee-over-toe-split-squat`

| | |
|---|---|
| **EN name** | Knee-Over-Toe Split Squat |
| **PL name** | Split squat z kolanem nad palcami |
| **Pattern** | lunge |
| **Tip source** | library (`approved`) |
| **EN tip** | Use support and only increase depth while the front heel stays planted and the range is controlled. |
| **PL tip (current)** | Użyj podparcia i zwiększaj głębokość tylko przy pięcie na podłożu i pełnej kontroli. |
| **PL tip (proposed)** | Użyj podparcia i zwiększaj głębokość tylko przy pięcie na podłożu i pełnej kontroli. |
| **Decision** | applied |

### `kneeling-one-arm-cable-row`

| | |
|---|---|
| **EN name** | Kneeling One-Arm Cable Row |
| **PL name** | Jednorącz wiosłowanie na wyciągu w klęku |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`draft`) |
| **EN tip** | Half-kneeling and braced, so the pull comes from the back rather than the trunk. Let the shoulder blade travel forward at the start. |
| **PL tip (current)** | W półklęku, spięty, żeby ciągnąć z pleców, nie z tułowia. Pozwól łopatce odjechać w przód na starcie. |
| **PL tip (proposed)** | W półklęku, spięty, żeby ciągnąć z pleców, nie z tułowia. Pozwól łopatce odjechać w przód na starcie. |
| **Decision** | applied |

### `larsen-press`

| | |
|---|---|
| **EN name** | Larsen Press |
| **PL name** | Wyciskanie Larsena |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Feet off the floor, so nothing comes from leg drive. Keep the upper back tight against the bench. |
| **PL tip (current)** | Stopy nad podłogą, więc nic nie pochodzi z pracy nóg. Góra pleców cały czas dociśnięta do ławki. |
| **PL tip (proposed)** | Stopy nad podłogą, więc nic nie pochodzi z pracy nóg. Góra pleców cały czas dociśnięta do ławki. |
| **Decision** | applied |

### `lat-prayer`

| | |
|---|---|
| **EN name** | Lat Prayer |
| **PL name** | Modlitwa najszerszych (lat prayer) |
| **Pattern** | vertical-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Internal rotation at stretched position for maximum lat stretch. |
| **PL tip (current)** | Rotacja wewnętrzna w pozycji rozciągniętej dla maksymalnego rozciągnięcia najszerszych. |
| **PL tip (proposed)** | Rotacja wewnętrzna w pozycji rozciągniętej dla maksymalnego rozciągnięcia najszerszych. |
| **Decision** | applied |

### `lat-pulldown`

| | |
|---|---|
| **EN name** | Lat Pulldown (Neutral) |
| **PL name** | Ściąganie drążka chwytem neutralnym |
| **Pattern** | vertical-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | 'Dead hang' at the top (head between shoulders). Slight lean back when pulling. |
| **PL tip (current)** | „Martwy zwis” na górze (głowa między barkami). Lekkie odchylenie do tyłu przy ciągnięciu. |
| **PL tip (proposed)** | „Martwy zwis” na górze (głowa między barkami). Lekkie odchylenie do tyłu przy ciągnięciu. |
| **Decision** | applied |

### `lateral-raise`

| | |
|---|---|
| **EN name** | Lateral Raises |
| **PL name** | Unoszenie bokiem |
| **Pattern** | shoulder-abduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Cable or DB variation |
| **PL tip (current)** | Wariant na wyciągu lub z hantlami. |
| **PL tip (proposed)** | Wariant na wyciągu lub z hantlami. |
| **Decision** | applied |

### `leaning-one-arm-lateral-raise`

| | |
|---|---|
| **EN name** | Leaning One-Arm Lateral Raise |
| **PL name** | Jednorącz unoszenie bokiem w pochyleniu |
| **Pattern** | shoulder-abduction |
| **Tip source** | library (`draft`) |
| **EN tip** | Lean away from the working side to load the stretch. Keep the torso still — the lean is the setup, not part of the rep. |
| **PL tip (current)** | Odsuń się od pracującej strony, by obciążyć rozciągnięcie. Tułów nieruchomy — pochyl to ustawienie, nie część powtórzenia. |
| **PL tip (proposed)** | Odsuń się od pracującej strony, by obciążyć rozciągnięcie. Tułów nieruchomy — pochyl to ustawienie, nie część powtórzenia. |
| **Decision** | applied |

### `leaning-single-arm-dumbbell-lateral-raise`

| | |
|---|---|
| **EN name** | Leaning Single Arm DB Lateral Raises |
| **PL name** | Unoszenie bokiem jednorącz z odchyleniem |
| **Pattern** | shoulder-abduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Lean against wall at 15-30°. Rep ends when DB points straight down. |
| **PL tip (current)** | Oprzyj się o ścianę pod 15-30°. Powt. kończy się gdy hantel wskazuje prosto w dół. |
| **PL tip (proposed)** | Oprzyj się o ścianę pod 15-30°. Powt. kończy się gdy hantel wskazuje prosto w dół. |
| **Decision** | applied |

### `leg-extension`

| | |
|---|---|
| **EN name** | Leg Extensions |
| **PL name** | Prostowanie nóg na maszynie |
| **Pattern** | knee-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Line the knee up with the machine pivot, pause briefly at the top, and lower under control instead of letting the stack drop. |
| **PL tip (current)** | Ustaw kolano w osi obrotu maszyny, krótka pauza na górze i opuszczaj pod kontrolą zamiast spuszczać stos. |
| **PL tip (proposed)** | Ustaw kolano w osi obrotu maszyny, krótka pauza na górze i opuszczaj pod kontrolą zamiast spuszczać stos. |
| **Decision** | applied |

### `leg-press`

| | |
|---|---|
| **EN name** | Leg Press |
| **PL name** | Suwnica |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Feet mid-platform, lower until the pelvis is about to round off the pad, then press without locking the knees hard. Range beats plate count here. |
| **PL tip (current)** | Stopy w połowie platformy, schodź aż miednica zacznie się podwijać, potem wypchnij bez twardego prostowania kolan. Zakres ważniejszy niż liczba talerzy. |
| **PL tip (proposed)** | Stopy w połowie platformy, schodź aż miednica zacznie się podwijać, potem wypchnij bez twardego prostowania kolan. Zakres ważniejszy niż liczba talerzy. |
| **Decision** | applied |

### `leg-press-calf-raise`

| | |
|---|---|
| **EN name** | Leg Press Calf Raises |
| **PL name** | Wspięcia na palce na suwnicy |
| **Pattern** | calf |
| **Tip source** | library (`approved`) |
| **EN tip** | Full stretch at bottom, explode up. Stop 0-1 rep shy of failure. |
| **PL tip (current)** | Pełne rozciągnięcie na dole, eksplozywnie w górę. Zatrzymaj się 0-1 powt. przed upadkiem. |
| **PL tip (proposed)** | Pełne rozciągnięcie na dole, eksplozywnie w górę. Zatrzymaj się 0-1 powt. przed upadkiem. |
| **Decision** | applied |

### `loaded-90-90-transition`

| | |
|---|---|
| **EN name** | Loaded 90/90 Hip Transition |
| **PL name** | Dociążone przejście bioder 90/90 |
| **Pattern** | mobility |
| **Tip source** | library (`approved`) |
| **EN tip** | Rotate through the hips slowly; use your hands until you can keep the trunk quiet. |
| **PL tip (current)** | Obracaj się powoli w biodrach; podpieraj się rękami, dopóki nie utrzymasz spokojnego tułowia. |
| **PL tip (proposed)** | Obracaj się powoli w biodrach; podpieraj się rękami, dopóki nie utrzymasz spokojnego tułowia. |
| **Decision** | applied |

### `loaded-ankle-rock`

| | |
|---|---|
| **EN name** | Loaded Ankle Rock |
| **PL name** | Dociążone przesunięcie kolana nad stopę |
| **Pattern** | calf |
| **Tip source** | library (`approved`) |
| **EN tip** | Keep the whole foot down and move the knee forward without the arch collapsing. |
| **PL tip (current)** | Trzymaj całą stopę na podłożu i prowadź kolano do przodu bez zapadania łuku stopy. |
| **PL tip (proposed)** | Trzymaj całą stopę na podłożu i prowadź kolano do przodu bez zapadania łuku stopy. |
| **Decision** | applied |

### `long-pause-bench-press`

| | |
|---|---|
| **EN name** | Long Pause Bench Press |
| **PL name** | Wyciskanie z długą pauzą |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Full stop on the chest with the bar still. The pause is the exercise; shorten the set before shortening the pause. |
| **PL tip (current)** | Pełne zatrzymanie na klatce, sztanga nieruchoma. Pauza jest ćwiczeniem; skróć serię, zanim skrócisz pauzę. |
| **PL tip (proposed)** | Pełne zatrzymanie na klatce, sztanga nieruchoma. Pauza jest ćwiczeniem; skróć serię, zanim skrócisz pauzę. |
| **Decision** | applied |

### `low-box-squat`

| | |
|---|---|
| **EN name** | Low Box Squat |
| **PL name** | Przysiad na niską skrzynię |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Sit to the box at or just below parallel, stay tight through the pause, then drive up without shifting forward. |
| **PL tip (current)** | Siadaj na skrzynię na równoległości lub minimalnie poniżej, utrzymaj napięcie w pauzie i wstań bez przesuwania się w przód. |
| **PL tip (proposed)** | Siadaj na skrzynię na równoległości lub minimalnie poniżej, utrzymaj napięcie w pauzie i wstań bez przesuwania się w przód. |
| **Decision** | applied |

### `low-pin-press`

| | |
|---|---|
| **EN name** | Low Pin Press |
| **PL name** | Wyciskanie z niskich zaczepów |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Dead stop on the pins near chest height. Reset the brace each rep rather than rebounding. |
| **PL tip (current)** | Martwy start z pinów na wysokości klatki. Odnów napięcie co powtórzenie zamiast się odbijać. |
| **PL tip (proposed)** | Martwy start z pinów na wysokości klatki. Odnów napięcie co powtórzenie zamiast się odbijać. |
| **Decision** | applied |

### `low-pulley-cable-curl`

| | |
|---|---|
| **EN name** | Low-Pulley Cable Curl |
| **PL name** | Uginanie ramion na dolnym wyciągu |
| **Pattern** | elbow-flexion |
| **Tip source** | library (`draft`) |
| **EN tip** | Cable from the low pulley keeps tension at the stretch. Do not let the elbows drift forward. |
| **PL tip (current)** | Dolny wyciąg utrzymuje napięcie w rozciągnięciu. Nie pozwól łokciom odjeżdżać w przód. |
| **PL tip (proposed)** | Dolny wyciąg utrzymuje napięcie w rozciągnięciu. Nie pozwól łokciom odjeżdżać w przód. |
| **Decision** | applied |

### `low-to-high-cable-fly`

| | |
|---|---|
| **EN name** | Low-to-High Cable Flyes |
| **PL name** | Rozpiętki na wyciągu z dołu do góry |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Hands travel up and in, finishing in front of the collarbone. Keep the elbow angle constant. |
| **PL tip (current)** | Dłonie jadą w górę i do środka, kończąc przed obojczykiem. Kąt łokcia bez zmian. |
| **PL tip (proposed)** | Dłonie jadą w górę i do środka, kończąc przed obojczykiem. Kąt łokcia bez zmian. |
| **Decision** | applied |

### `lying-cable-lat-raise`

| | |
|---|---|
| **EN name** | Lying Cable Lat Raises |
| **PL name** | Unoszenie bokiem na wyciągu leżąc |
| **Pattern** | shoulder-abduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Pull 'away' from body, not up. Focus on side delt stretch. |
| **PL tip (current)** | Ciągnij „od” ciała, nie w górę. Skup się na rozciągnięciu bocznej części barku. |
| **PL tip (proposed)** | Ciągnij „od” ciała, nie w górę. Skup się na rozciągnięciu bocznej części barku. |
| **Decision** | applied |

### `lying-dumbbell-skullcrusher`

| | |
|---|---|
| **EN name** | Lying Dumbbell Skullcrusher |
| **PL name** | Francuskie wyciskanie hantli leżąc |
| **Pattern** | elbow-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Dumbbells allow a slightly kinder elbow path. Keep the upper arms still and lower behind the head. |
| **PL tip (current)** | Hantle dają łagodniejszy tor dla łokci. Ramiona nieruchome, opuszczaj za głowę. |
| **PL tip (proposed)** | Hantle dają łagodniejszy tor dla łokci. Ramiona nieruchome, opuszczaj za głowę. |
| **Decision** | applied |

### `lying-leg-curl`

| | |
|---|---|
| **EN name** | Lying Leg Curls |
| **PL name** | Uginanie nóg leżąc |
| **Pattern** | knee-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Full ROM, slow down at the stretched position. |
| **PL tip (current)** | Pełny zakres, zwolnij w rozciągnięciu. |
| **PL tip (proposed)** | Pełny zakres, zwolnij w rozciągnięciu. |
| **Decision** | applied |

### `machine-hip-abduction`

| | |
|---|---|
| **EN name** | Machine Hip Abduction |
| **PL name** | Odwodzenie bioder na maszynie |
| **Pattern** | hip-abduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Keep the pelvis stable, open through the hips, and control the return without letting the stack crash. |
| **PL tip (current)** | Utrzymuj stabilną miednicę, odwodź biodra i kontroluj powrót bez uderzania stosu. |
| **PL tip (proposed)** | Utrzymuj stabilną miednicę, odwodź biodra i kontroluj powrót bez uderzania stosu. |
| **Decision** | applied |

### `machine-press-fly-combo`

| | |
|---|---|
| **EN name** | Machine Press/Fly Combo |
| **PL name** | Maszyna wyciskanie/rozpiętki |
| **Pattern** | horizontal-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Pick one arc for the set and keep it. Alternating press and fly mid-set makes the load meaningless. |
| **PL tip (current)** | Wybierz jeden tor ruchu na serię i trzymaj się go. Mieszanie wyciskania z rozpiętkami w serii czyni ciężar bez znaczenia. |
| **PL tip (proposed)** | Wybierz jeden tor ruchu na serię i trzymaj się go. Mieszanie wyciskania z rozpiętkami w serii czyni ciężar bez znaczenia. |
| **Decision** | applied |

### `rear-delt-fly`

| | |
|---|---|
| **EN name** | Machine Rear Delt Fly |
| **PL name** | Odwrotne rozpiętki na maszynie |
| **Pattern** | shoulder-horizontal-abduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Do single arm sitting sideways for maximum stretch. |
| **PL tip (current)** | Jednorącz siedząc bokiem dla maksymalnego rozciągnięcia. |
| **PL tip (proposed)** | Jednorącz siedząc bokiem dla maksymalnego rozciągnięcia. |
| **Decision** | applied |

### `mid-cable-fly`

| | |
|---|---|
| **EN name** | Mid Cable Flyes (Seated) |
| **PL name** | Rozpiętki na wyciągu siedząc |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Soft fixed elbow angle throughout. Open until the chest is stretched, then bring the hands together rather than pressing. |
| **PL tip (current)** | Miękki, stały kąt w łokciach przez cały ruch. Otwieraj aż klatka się rozciągnie, potem zbieraj dłonie zamiast wyciskać. |
| **PL tip (proposed)** | Miękki, stały kąt w łokciach przez cały ruch. Otwieraj aż klatka się rozciągnie, potem zbieraj dłonie zamiast wyciskać. |
| **Decision** | applied |

### `mid-pin-squat`

| | |
|---|---|
| **EN name** | Mid Pin Squat |
| **PL name** | Przysiad ze średnich zaczepów |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Start from a dead stop on the pins with everything already braced. No rebound off the pins. |
| **PL tip (current)** | Zaczynaj z martwego zatrzymania na pinach, z pełnym napięciem przed ruchem. Bez odbijania od pinów. |
| **PL tip (proposed)** | Zaczynaj z martwego zatrzymania na pinach, z pełnym napięciem przed ruchem. Bez odbijania od pinów. |
| **Decision** | applied |

### `narrow-stance-leg-press`

| | |
|---|---|
| **EN name** | Narrow-Stance Leg Press |
| **PL name** | Suwnica – wąska pozycja stóp |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Feet close and low on the platform for the quads. Stop the descent when the hips start to tuck. |
| **PL tip (current)** | Stopy blisko i nisko na platformie pod czworogłowe. Przerwij zjazd, gdy biodra zaczynają się podwijać. |
| **PL tip (proposed)** | Stopy blisko i nisko na platformie pod czworogłowe. Przerwij zjazd, gdy biodra zaczynają się podwijać. |
| **Decision** | applied |

### `nordic-curl`

| | |
|---|---|
| **EN name** | Nordic Curls |
| **PL name** | Nordic curls |
| **Pattern** | knee-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Cheat concentric if under 5 reps. Control eccentric (3-5 sec lowering). |
| **PL tip (current)** | Oszukuj koncentrykę, jeśli schodzisz poniżej 5 powtórzeń. Kontroluj ekscentrykę (3–5 s opuszczania). |
| **PL tip (proposed)** | Oszukuj koncentrykę, jeśli schodzisz poniżej 5 powtórzeń. Kontroluj ekscentrykę (3–5 s opuszczania). |
| **Decision** | applied |

### `one-arm-braced-db-press`

| | |
|---|---|
| **EN name** | One-Arm Braced Dumbbell Press |
| **PL name** | Wyciskanie hantlem jednorącz z podparciem |
| **Pattern** | vertical-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Weaker side first; the stronger side matches its reps. |
| **PL tip (current)** | Najpierw słabsza strona; silniejsza dorównuje liczbie powtórzeń. |
| **PL tip (proposed)** | Najpierw słabsza strona; silniejsza dorównuje liczbie powtórzeń. |
| **Decision** | applied |

### `one-dumbbell-overhead-triceps-extension`

| | |
|---|---|
| **EN name** | One-Dumbbell Overhead Triceps Extension |
| **PL name** | Prostowanie ramion nad głową jednym hantlem |
| **Pattern** | elbow-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Both hands on one dumbbell, elbows close to the head. Full stretch at the bottom, no arching to press it up. |
| **PL tip (current)** | Obie dłonie na jednym hantlu, łokcie blisko głowy. Pełne rozciągnięcie na dole, bez wygiania się, by go wypchnąć. |
| **PL tip (proposed)** | Obie dłonie na jednym hantlu, łokcie blisko głowy. Pełne rozciągnięcie na dole, bez wygiania się, by go wypchnąć. |
| **Decision** | applied |

### `open-book-rotation`

| | |
|---|---|
| **EN name** | Open-Book Rotation |
| **PL name** | Rotacja open book |
| **Pattern** | mobility |
| **Tip source** | library (`approved`) |
| **EN tip** | Keep the knees stacked and rotate the upper back without forcing the shoulder to the floor. |
| **PL tip (current)** | Trzymaj kolana razem i obracaj górę pleców bez wciskania barku na siłę w podłogę. |
| **PL tip (proposed)** | Trzymaj kolana razem i obracaj górę pleców bez wciskania barku na siłę w podłogę. |
| **Decision** | applied |

### `overhand-mid-grip-pulldown`

| | |
|---|---|
| **EN name** | Overhand Mid-Grip Pulldown |
| **PL name** | Ściąganie drążka nachwytem średnim |
| **Pattern** | vertical-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Slight lean, pull to upper chest, squeeze blades together. |
| **PL tip (current)** | Lekkie odchylenie do tyłu przy ściąganiu, ciągnij do górnej części klatki, ściśnij łopatki razem. |
| **PL tip (proposed)** | Lekkie odchylenie do tyłu przy ściąganiu, ciągnij do górnej części klatki, ściśnij łopatki razem. |
| **Decision** | applied |

### `overhead-tricep-extension`

| | |
|---|---|
| **EN name** | Overhead Tricep Extensions |
| **PL name** | Wyciskanie francuskie nad głowę |
| **Pattern** | elbow-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Use strap attachment, stand upright with cable at bottom. Full ROM - forearms touch biceps at bottom. |
| **PL tip (current)** | Użyj nakładki z paskami, stój prosto z linką na dole. Pełny zakres – przedramiona dotykają bicepsów na dole. |
| **PL tip (proposed)** | Użyj nakładki z paskami, stój prosto z linką na dole. Pełny zakres – przedramiona dotykają bicepsów na dole. |
| **Decision** | applied |

### `paused-back-squat`

| | |
|---|---|
| **EN name** | Paused Back Squat |
| **PL name** | Przysiad z pauzą |
| **Pattern** | squat |
| **Tip source** | library (`approved`) |
| **EN tip** | Two seconds motionless in the hole with the brace held. No bouncing out of the bottom. |
| **PL tip (current)** | Dwie sekundy bez ruchu w dole przy utrzymanym napięciu. Bez odbijania z dołu. |
| **PL tip (proposed)** | Dwie sekundy bez ruchu w dole przy utrzymanym napięciu. Bez odbijania z dołu. |
| **Decision** | applied |

### `paused-bench-press`

| | |
|---|---|
| **EN name** | Paused Bench Press |
| **PL name** | Wyciskanie pauzowane |
| **Pattern** | horizontal-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Warm-up: ramp fast, low reps, paused every set. Save energy for working sets. Bar comes to complete stop at chest, 0.5-1 second full pause. General warm-up (rotator cuff, dynamic arching, lat activation, glute bridges) → Barbell warm-up. All warm-up sets paused. |
| **PL tip (current)** | Rozgrzewka: szybka progresja ciężaru, mało powtórzeń, pauza w każdej serii. Oszczędzaj energię. Sztanga zatrzymuje się całkowicie na klatce na 0,5–1 s. Rozgrzej obręcz barkową, lekko napnij najszersze, zrób kilka mostków i mostków pośladkowych jednonóż z przytrzymaniem w spięciu, zanim przejdziesz do rozgrzewki ze sztangą. |
| **PL tip (proposed)** | Rozgrzewka: szybka progresja ciężaru, mało powtórzeń, pauza w każdej serii. Oszczędzaj energię. Sztanga zatrzymuje się całkowicie na klatce na 0,5–1 s. Rozgrzej obręcz barkową, lekko napnij najszersze, zrób kilka mostków i mostków pośladkowych jednonóż z przytrzymaniem w spięciu, zanim przejdziesz do rozgrzewki ze sztangą. |
| **Decision** | applied |

### `paused-deadlift`

| | |
|---|---|
| **EN name** | Paused Deadlift (mid-shin) |
| **PL name** | Martwy ciąg z pauzą (połowa piszczeli) |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Pause just off the floor or below the knee without relaxing. The hold is the point; do not use it to reposition. |
| **PL tip (current)** | Pauza tuż nad podłogą lub pod kolanem bez rozluźniania. To zatrzymanie jest celem; nie używaj go do poprawiania ułożenia. |
| **PL tip (proposed)** | Pauza tuż nad podłogą lub pod kolanem bez rozluźniania. To zatrzymanie jest celem; nie używaj go do poprawiania ułożenia. |
| **Decision** | applied |

### `paused-deficit-deadlift`

| | |
|---|---|
| **EN name** | Paused Deficit Deadlift |
| **PL name** | Martwy ciąg z deficytu z pauzą |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Deficit plus a pause is the most demanding version of the start. Hold position rather than sagging into the bar. |
| **PL tip (current)** | Deficyt plus pauza to najbardziej wymagająca wersja startu. Trzymaj pozycję zamiast zapadać się na sztangę. |
| **PL tip (proposed)** | Deficyt plus pauza to najbardziej wymagająca wersja startu. Trzymaj pozycję zamiast zapadać się na sztangę. |
| **Decision** | applied |

### `low-bar-squat`

| | |
|---|---|
| **EN name** | Paused Low Bar Squat |
| **PL name** | Przysiad low-bar z pauzą |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Bar on the rear delts, wrists neutral, more forward lean than a high-bar squat. Break at the hips and knees together; stop the set when the chest starts dropping ahead of the hips. |
| **PL tip (current)** | Sztanga na tylnych aktonach barków, nadgarstki neutralne, większy pochyl niż przy high-barze. Schodź biodrami i kolanami razem; kończ serię, gdy klatka zaczyna wyprzedzać biodra. |
| **PL tip (proposed)** | Sztanga na tylnych aktonach barków, nadgarstki neutralne, większy pochyl niż przy high-barze. Schodź biodrami i kolanami razem; kończ serię, gdy klatka zaczyna wyprzedzać biodra. |
| **Decision** | applied |

### `paused-squat`

| | |
|---|---|
| **EN name** | Paused Squat |
| **PL name** | Przysiad z pauzą |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Full stop at the bottom with the torso braced. Hold the position rather than sinking into it, then stand without a bounce. |
| **PL tip (current)** | Pełne zatrzymanie na dole z usztywnionym tułowiem. Trzymaj pozycję zamiast w nią zapadać, potem wstań bez odbicia. |
| **PL tip (proposed)** | Pełne zatrzymanie na dole z usztywnionym tułowiem. Trzymaj pozycję zamiast w nią zapadać, potem wstań bez odbicia. |
| **Decision** | applied |

### `pec-deck`

| | |
|---|---|
| **EN name** | Pec Deck |
| **PL name** | Rozpiętki na maszynie |
| **Pattern** | horizontal-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Full stretch at the bottom. Squeeze at contraction. |
| **PL tip (current)** | Pełne rozciągnięcie na dole. Spięcie w skurczu. |
| **PL tip (proposed)** | Pełne rozciągnięcie na dole. Spięcie w skurczu. |
| **Decision** | applied |

### `plank`

| | |
|---|---|
| **EN name** | Planks |
| **PL name** | Deska |
| **Pattern** | core-antiextension |
| **Tip source** | library (`draft`) |
| **EN tip** | One line from head to heels with the ribs down and glutes on. End the set when the hips drop, not when the timer says so. |
| **PL tip (current)** | Jedna linia od głowy do pięt, żebra w dół, pośladki spięte. Kończ serię, gdy biodra opadają, nie gdy mówi zegar. |
| **PL tip (proposed)** | Jedna linia od głowy do pięt, żebra w dół, pośladki spięte. Kończ serię, gdy biodra opadają, nie gdy mówi zegar. |
| **Decision** | applied |

### `pull-up`

| | |
|---|---|
| **EN name** | Pull-Up |
| **PL name** | Podciąganie |
| **Pattern** | vertical-pull |
| **Tip source** | library (`draft`) |
| **EN tip** | Full hang, shoulders set, chin over the bar without kipping. Lower under control — the eccentric is most of the value. |
| **PL tip (current)** | Pełny zwis, barki ustawione, broda nad drążkiem bez szarpania. Opuszczaj pod kontrolą — faza ekscentryczna daje większość wartości. |
| **PL tip (proposed)** | Pełny zwis, barki ustawione, broda nad drążkiem bez szarpania. Opuszczaj pod kontrolą — faza ekscentryczna daje większość wartości. |
| **Decision** | applied |

### `push-up`

| | |
|---|---|
| **EN name** | Push-Up |
| **PL name** | Pompka |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Body in one line, hands under the shoulders, chest to the floor. The set ends when the hips start sagging. |
| **PL tip (current)** | Ciało w jednej linii, dłonie pod barkami, klatka do podłogi. Seria kończy się, gdy biodra zaczynają opadać. |
| **PL tip (proposed)** | Ciało w jednej linii, dłonie pod barkami, klatka do podłogi. Seria kończy się, gdy biodra zaczynają opadać. |
| **Decision** | applied |

### `rear-delt-burnout`

| | |
|---|---|
| **EN name** | Rear Delt Burnout |
| **PL name** | Dobicie tylnego aktonu |
| **Pattern** | shoulder-horizontal-abduction |
| **Tip source** | library (`approved`) |
| **EN tip** | 100 reps total. Rest-pause if needed. |
| **PL tip (current)** | Łącznie 100 powtórzeń. Rób krótkie przerwy w serii, jeśli trzeba. |
| **PL tip (proposed)** | Łącznie 100 powtórzeń. Rób krótkie przerwy w serii, jeśli trzeba. |
| **Decision** | applied |

### `rear-delt-rope-pulls-to-face`

| | |
|---|---|
| **EN name** | Rear-Delt Rope Pulls to Face |
| **PL name** | Przyciąganie liny do twarzy (tylny akton) |
| **Pattern** | shoulder-horizontal-abduction |
| **Tip source** | library (`draft`) |
| **EN tip** | High cable, elbows travelling out and back. Stop before the lower back starts extending to help. |
| **PL tip (current)** | Górny wyciąg, łokcie jadą na zewnątrz i w tył. Stop, zanim dolne plecy zaczną pomagać wyprostem. |
| **PL tip (proposed)** | Górny wyciąg, łokcie jadą na zewnątrz i w tył. Stop, zanim dolne plecy zaczną pomagać wyprostem. |
| **Decision** | applied |

### `bent-over-rear-delt-row`

| | |
|---|---|
| **EN name** | Rear-Delt Row |
| **PL name** | Wiosłowanie na tylne aktony |
| **Pattern** | shoulder-horizontal-abduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Elbows travel wide and high, not toward the hip. Lighter and more controlled than the main row — this is the rear delt, not the lat. |
| **PL tip (current)** | Łokcie idą szeroko i wysoko, nie w stronę biodra. Lżej i bardziej kontrolowanie niż główne wiosłowanie — to tylny akton, nie najszerszy. |
| **PL tip (proposed)** | Łokcie idą szeroko i wysoko, nie w stronę biodra. Lżej i bardziej kontrolowanie niż główne wiosłowanie — to tylny akton, nie najszerszy. |
| **Decision** | applied |

### `reverse-curl`

| | |
|---|---|
| **EN name** | Reverse Curl |
| **PL name** | Uginanie nachwytem |
| **Pattern** | elbow-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Knuckles up throughout. Expect roughly a third of what you curl supinated. |
| **PL tip (current)** | Kostki skierowane w górę przez cały ruch. Spodziewaj się około jednej trzeciej ciężaru z podchwytu. |
| **PL tip (proposed)** | Kostki skierowane w górę przez cały ruch. Spodziewaj się około jednej trzeciej ciężaru z podchwytu. |
| **Decision** | applied |

### `reverse-hyperextension`

| | |
|---|---|
| **EN name** | Reverse Hyperextension |
| **PL name** | Odwrócony wyprost bioder na maszynie |
| **Pattern** | hip-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Raise the legs with the glutes and stop at a repeatable hip-extension height. End the set when momentum, spinal swing or shortened ROM replaces control. |
| **PL tip (current)** | Unoś nogi pracą pośladków i kończ na powtarzalnej wysokości wyprostu bioder. Zakończ serię, gdy kontrolę zastępuje rozpęd, kołysanie kręgosłupa lub krótszy zakres. |
| **PL tip (proposed)** | Unoś nogi pracą pośladków i kończ na powtarzalnej wysokości wyprostu bioder. Zakończ serię, gdy kontrolę zastępuje rozpęd, kołysanie kręgosłupa lub krótszy zakres. |
| **Decision** | applied |

### `reverse-nordic-curl`

| | |
|---|---|
| **EN name** | Reverse Nordic Curls |
| **PL name** | Odwrócone Nordic Curls |
| **Pattern** | knee-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | 1 weighted set, 1 weighted + drop set to bodyweight. |
| **PL tip (current)** | 1 seria z obciążeniem, 1 z obciążeniem i zrzutem do masy ciała. |
| **PL tip (proposed)** | 1 seria z obciążeniem, 1 z obciążeniem i zrzutem do masy ciała. |
| **Decision** | applied |

### `reverse-pec-deck`

| | |
|---|---|
| **EN name** | Reverse Pec Deck |
| **PL name** | Odwrotne rozpiętki na maszynie |
| **Pattern** | shoulder-horizontal-abduction |
| **Tip source** | library (`draft`) |
| **EN tip** | Chest against the pad, arms nearly straight, lead with the elbows. Stop when the traps take over. |
| **PL tip (current)** | Klatka na poduszce, ramiona prawie proste, prowadź łokciami. Stop, gdy przejmują czworoboczne. |
| **PL tip (proposed)** | Klatka na poduszce, ramiona prawie proste, prowadź łokciami. Stop, gdy przejmują czworoboczne. |
| **Decision** | applied |

### `rolling-dumbbell-tricep-extension`

| | |
|---|---|
| **EN name** | Rolling DB Tricep Extensions |
| **PL name** | Wyciskanie francuskie z toczeniem hantli |
| **Pattern** | elbow-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Roll the dumbbells back past the head, then extend. The roll is what makes the stretch; do not shorten it. |
| **PL tip (current)** | Tocz hantle za głowę, potem prostuj. To toczanie buduje rozciągnięcie; nie skracaj go. |
| **PL tip (proposed)** | Tocz hantle za głowę, potem prostuj. To toczanie buduje rozciągnięcie; nie skracaj go. |
| **Decision** | applied |

### `romanian-deadlift`

| | |
|---|---|
| **EN name** | Romanian Deadlift |
| **PL name** | Martwy ciąg rumuński |
| **Pattern** | hinge |
| **Tip source** | library (`approved`) |
| **EN tip** | Heavy. Straps OK. 1-2 sec glute squeeze at top. |
| **PL tip (current)** | Ciężko. Paski dozwolone. 1–2 sekundy spięcia pośladków na górze. |
| **PL tip (proposed)** | Ciężko. Paski dozwolone. 1–2 sekundy spięcia pośladków na górze. |
| **Decision** | applied |

### `rope-cable-row`

| | |
|---|---|
| **EN name** | Rope Cable Row |
| **PL name** | Wiosłowanie liną na wyciągu |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`draft`) |
| **EN tip** | Pull the rope to the mid-section and separate the hands at the finish. Elbows stay close. |
| **PL tip (current)** | Przyciągnij linę do środka tułowia i rozdziel dłonie na końcu. Łokcie blisko ciała. |
| **PL tip (proposed)** | Przyciągnij linę do środka tułowia i rozdziel dłonie na końcu. Łokcie blisko ciała. |
| **Decision** | applied |

### `rope-hammer-curl`

| | |
|---|---|
| **EN name** | Rope Hammer Curl |
| **PL name** | Uginanie młotkowe z liną |
| **Pattern** | elbow-flexion |
| **Tip source** | library (`draft`) |
| **EN tip** | Neutral grip with the rope, elbows at the sides. Pull the ends slightly apart at the top. |
| **PL tip (current)** | Chwyt neutralny na linie, łokcie przy bokach. Rozciągnij końcówki liny na górze. |
| **PL tip (proposed)** | Chwyt neutralny na linie, łokcie przy bokach. Rozciągnij końcówki liny na górze. |
| **Decision** | applied |

### `rope-pressdown`

| | |
|---|---|
| **EN name** | Rope Pressdown |
| **PL name** | Prostowanie ramion z liną |
| **Pattern** | elbow-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Elbows pinned at the sides, separate the rope at lockout. Stop when the shoulders start driving the movement. |
| **PL tip (current)** | Łokcie przy bokach, rozdziel linę w zamknięciu. Stop, gdy barki zaczynają napędzać ruch. |
| **PL tip (proposed)** | Łokcie przy bokach, rozdziel linę w zamknięciu. Stop, gdy barki zaczynają napędzać ruch. |
| **Decision** | applied |

### `row`

| | |
|---|---|
| **EN name** | Rows |
| **PL name** | Wiosłowanie |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Accessory work chosen for a weak point. Full range, controlled, no swing. |
| **PL tip (current)** | Ćwiczenie akcesoryjne na słaby punkt. Pełny zakres, pod kontrolą, bez zamachu. |
| **PL tip (proposed)** | Ćwiczenie akcesoryjne na słaby punkt. Pełny zakres, pod kontrolą, bez zamachu. |
| **Decision** | applied |

### `safety-bar-squat`

| | |
|---|---|
| **EN name** | Safety Bar Squat |
| **PL name** | Przysiad ze sztangą safety bar |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Hold the handles without pulling the bar down, and let the yoke keep the torso upright. Elbows stay under the bar, not flared forward. |
| **PL tip (current)** | Trzymaj uchwyty bez ściągania sztangi w dół i pozwól klamrze utrzymać tułów pionowo. Łokcie pod sztangą, nie rozchylone w przód. |
| **PL tip (proposed)** | Trzymaj uchwyty bez ściągania sztangi w dół i pozwól klamrze utrzymać tułów pionowo. Łokcie pod sztangą, nie rozchylone w przód. |
| **Decision** | applied |

### `seated-cable-row`

| | |
|---|---|
| **EN name** | Seated Cable Row |
| **PL name** | Wiosłowanie na wyciągu siedząc |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Neutral or wide grip. Round shoulders forward for max stretch at bottom. |
| **PL tip (current)** | Chwyt neutralny lub szeroki. Zaokrąglaj ramiona do przodu dla maksymalnego rozciągnięcia na dole. |
| **PL tip (proposed)** | Chwyt neutralny lub szeroki. Zaokrąglaj ramiona do przodu dla maksymalnego rozciągnięcia na dole. |
| **Decision** | applied |

### `seated-dumbbell-shoulder-press`

| | |
|---|---|
| **EN name** | Seated DB Shoulder Press |
| **PL name** | Wyciskanie hantli nad głowę siedząc |
| **Pattern** | vertical-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Full ROM - touch shoulders with DBs at the bottom. |
| **PL tip (current)** | Pełny zakres – dotknij barków hantlami na dole. |
| **PL tip (proposed)** | Pełny zakres – dotknij barków hantlami na dole. |
| **Decision** | applied |

### `seated-dumbbell-calf-raise`

| | |
|---|---|
| **EN name** | Seated Dumbbell Calf Raise |
| **PL name** | Wspięcia na palce siedząc z hantlem |
| **Pattern** | calf |
| **Tip source** | library (`approved`) |
| **EN tip** | Rest the dumbbell across the working thigh. Full stretch at the bottom, brief pause at the top. |
| **PL tip (current)** | Oprzyj hantel na pracującym udzie. Pełne rozciągnięcie na dole, krótka pauza na górze. |
| **PL tip (proposed)** | Oprzyj hantel na pracującym udzie. Pełne rozciągnięcie na dole, krótka pauza na górze. |
| **Decision** | applied |

### `seated-dumbbell-lateral-raise`

| | |
|---|---|
| **EN name** | Seated Dumbbell Lateral Raise |
| **PL name** | Unoszenie hantli bokiem siedząc |
| **Pattern** | shoulder-abduction |
| **Tip source** | library (`draft`) |
| **EN tip** | Seated removes the swing. Lead with the elbows to shoulder height and lower slowly. |
| **PL tip (current)** | Siedzenie eliminuje wymach. Prowadź łokciami do wysokości barków i opuszczaj powoli. |
| **PL tip (proposed)** | Siedzenie eliminuje wymach. Prowadź łokciami do wysokości barków i opuszczaj powoli. |
| **Decision** | applied |

### `seated-ham-curl`

| | |
|---|---|
| **EN name** | Seated Ham Curl |
| **PL name** | Uginanie nóg siedząc |
| **Pattern** | knee-flexion |
| **Tip source** | library (`draft`) |
| **EN tip** | Hips fixed against the pad and torso still. Control the return; the lengthened position is where the work is. |
| **PL tip (current)** | Biodra dociśnięte do siedziska, tułów nieruchomy. Kontroluj powrót; praca jest w pozycji wydłużonej. |
| **PL tip (proposed)** | Biodra dociśnięte do siedziska, tułów nieruchomy. Kontroluj powrót; praca jest w pozycji wydłużonej. |
| **Decision** | applied |

### `seated-hamstring-curl`

| | |
|---|---|
| **EN name** | Seated Hamstring Curl |
| **PL name** | Uginanie nóg siedząc |
| **Pattern** | knee-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Lean torso forward for massive stretch. Control the eccentric. |
| **PL tip (current)** | Pochyl tułów do przodu dla mocnego rozciągnięcia. Kontroluj opuszczanie. |
| **PL tip (proposed)** | Pochyl tułów do przodu dla mocnego rozciągnięcia. Kontroluj opuszczanie. |
| **Decision** | applied |

### `seated-leg-curl`

| | |
|---|---|
| **EN name** | Seated Leg Curls |
| **PL name** | Uginanie nóg siedząc |
| **Pattern** | knee-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Pochyl tułów do przodu. Control the eccentric. |
| **PL tip (current)** | Pochyl tułów do przodu. Kontroluj ekscentrykę. |
| **PL tip (proposed)** | Pochyl tułów do przodu. Kontroluj ekscentrykę. |
| **Decision** | applied |

### `shoulder-press`

| | |
|---|---|
| **EN name** | Shoulder Press |
| **PL name** | Wyciskanie nad głowę |
| **Pattern** | vertical-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Accessory work chosen for a weak point. Full range, controlled, no swing. |
| **PL tip (current)** | Ćwiczenie akcesoryjne na słaby punkt. Pełny zakres, pod kontrolą, bez zamachu. |
| **PL tip (proposed)** | Ćwiczenie akcesoryjne na słaby punkt. Pełny zakres, pod kontrolą, bez zamachu. |
| **Decision** | applied |

### `shrug`

| | |
|---|---|
| **EN name** | Shrugs |
| **PL name** | Szrugsy (unoszenie barków) |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`draft`) |
| **EN tip** | Straight up and down. Pause at the top; rolling the shoulders adds nothing and loads the joint awkwardly. |
| **PL tip (current)** | Prosto w górę i w dół. Pauza na górze; kręcenie barkami nic nie daje, a obciąża staw. |
| **PL tip (proposed)** | Prosto w górę i w dół. Pauza na górze; kręcenie barkami nic nie daje, a obciąża staw. |
| **Decision** | applied |

### `side-glute-medius-hip-thrust`

| | |
|---|---|
| **EN name** | Side Glute-Medius Hip Thrust |
| **PL name** | Boczny hip thrust (pośladkowy średni) |
| **Pattern** | hip-abduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Set up side-on and drive the working hip away from the floor. Load above the knee with a plate or band; do not turn the rep into trunk rotation. |
| **PL tip (current)** | Ustaw się bokiem i unieś pracujące biodro od podłoża. Obciąż nogę nad kolanem talerzem lub gumą; nie zamieniaj ruchu w rotację tułowia. |
| **PL tip (proposed)** | Ustaw się bokiem i unieś pracujące biodro od podłoża. Obciąż nogę nad kolanem talerzem lub gumą; nie zamieniaj ruchu w rotację tułowia. |
| **Decision** | applied |

### `side-lying-rear-delt-fly`

| | |
|---|---|
| **EN name** | Side-Lying Rear Delt Flyes |
| **PL name** | Odwodzenie leżąc bokiem (tylny akton) |
| **Pattern** | shoulder-horizontal-abduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Pinky leads, think 'pouring water' at top. |
| **PL tip (current)** | Mały palec prowadzi, myśl „nalewanie wody” na górze. |
| **PL tip (proposed)** | Mały palec prowadzi, myśl „nalewanie wody” na górze. |
| **Decision** | applied |

### `single-arm-cable-row`

| | |
|---|---|
| **EN name** | Single Arm Cable Row |
| **PL name** | Wiosłowanie jednorącz na wyciągu |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`draft`) |
| **EN tip** | Allow the shoulder blade to reach at the front and finish by pulling it back, not by twisting the torso. |
| **PL tip (current)** | Pozwól łopatce wyjść w przód i kończ ściągając ją z powrotem, nie skręcając tułowia. |
| **PL tip (proposed)** | Pozwól łopatce wyjść w przód i kończ ściągając ją z powrotem, nie skręcając tułowia. |
| **Decision** | applied |

### `single-arm-overhead-extension`

| | |
|---|---|
| **EN name** | Single Arm Overhead Extension |
| **PL name** | Wyciskanie francuskie jednorącz nad głowę |
| **Pattern** | elbow-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Keep the working elbow pointed up and close to the head. The free hand supports rather than assists. |
| **PL tip (current)** | Pracujący łokieć w górze i blisko głowy. Wolna ręka podpiera, nie pomaga. |
| **PL tip (proposed)** | Pracujący łokieć w górze i blisko głowy. Wolna ręka podpiera, nie pomaga. |
| **Decision** | applied |

### `single-arm-reverse-pec-deck`

| | |
|---|---|
| **EN name** | Single Arm Reverse Pec Deck |
| **PL name** | Odwrotny motylek jednorącz |
| **Pattern** | shoulder-horizontal-abduction |
| **Tip source** | library (`draft`) |
| **EN tip** | One arm lets the shoulder blade move naturally. Keep the torso still; do not rotate into the rep. |
| **PL tip (current)** | Jedno ramię pozwala łopatce pracować naturalnie. Tułów nieruchomy; nie dokręcaj się do powtórzenia. |
| **PL tip (proposed)** | Jedno ramię pozwala łopatce pracować naturalnie. Tułów nieruchomy; nie dokręcaj się do powtórzenia. |
| **Decision** | applied |

### `single-leg-machine-hip-thrust`

| | |
|---|---|
| **EN name** | Single Leg Machine Hip Thrust |
| **PL name** | Hip thrust jednonóż na maszynie |
| **Pattern** | hip-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Drive through heel, full hip extension, brutal glute squeeze at top. |
| **PL tip (current)** | Napędzaj piętą, pełne wyprostowanie bioder, brutalny ścisk pośladków na górze. |
| **PL tip (proposed)** | Napędzaj piętą, pełne wyprostowanie bioder, brutalny ścisk pośladków na górze. |
| **Decision** | applied |

### `single-arm-dumbbell-row`

| | |
|---|---|
| **EN name** | Single-Arm DB Row |
| **PL name** | Wiosłowanie hantlem jednorącz |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Limit lower back movement. Focus on lat contraction. |
| **PL tip (current)** | Ogranicz ruch dolnej części pleców. Skup się na spięciu najszerszych grzbietu. |
| **PL tip (proposed)** | Ogranicz ruch dolnej części pleców. Skup się na spięciu najszerszych grzbietu. |
| **Decision** | applied |

### `single-arm-external-rotation`

| | |
|---|---|
| **EN name** | Single-Arm External Rotation |
| **PL name** | Rotacja zewnętrzna jednorącz |
| **Pattern** | external-rotation |
| **Tip source** | library (`approved`) |
| **EN tip** | Elbow pinned to the ribs, rotate from the shoulder only. Light load, strict path. |
| **PL tip (current)** | Łokieć przy żebrach, obracaj wyłącznie w stawie ramiennym. Mały ciężar, ścisły tor ruchu. |
| **PL tip (proposed)** | Łokieć przy żebrach, obracaj wyłącznie w stawie ramiennym. Mały ciężar, ścisły tor ruchu. |
| **Decision** | applied |

### `single-arm-floor-press`

| | |
|---|---|
| **EN name** | Single-Arm Floor Press |
| **PL name** | Wyciskanie jednorącz leżąc na podłodze |
| **Pattern** | horizontal-press |
| **Tip source** | library (`approved`) |
| **EN tip** | The floor caps the range and protects the shoulder. Brace hard — pressing on one side is an anti-rotation exercise as much as a press. |
| **PL tip (current)** | Podłoga ogranicza zakres i chroni bark. Mocno się usztywnij — wyciskanie jednorącz to tak samo ćwiczenie antyrotacyjne, jak wyciskanie. |
| **PL tip (proposed)** | Podłoga ogranicza zakres i chroni bark. Mocno się usztywnij — wyciskanie jednorącz to tak samo ćwiczenie antyrotacyjne, jak wyciskanie. |
| **Decision** | applied |

### `single-arm-hammer-row`

| | |
|---|---|
| **EN name** | Single-Arm Hammer Strength Row |
| **PL name** | Wiosłowanie Hammer jednorącz |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Round shoulders at stretched position. Add padding between chest and seat for extra stretch. |
| **PL tip (current)** | Zaokrąglij barki do przodu w pozycji rozciągniętej. Dodaj bloczek między klatką a siedzeniem dla dodatkowego rozciągnięcia. |
| **PL tip (proposed)** | Zaokrąglij barki do przodu w pozycji rozciągniętej. Dodaj bloczek między klatką a siedzeniem dla dodatkowego rozciągnięcia. |
| **Decision** | applied |

### `single-arm-lateral-raise`

| | |
|---|---|
| **EN name** | Single-Arm Lateral Raise |
| **PL name** | Wznos bokiem jednorącz |
| **Pattern** | shoulder-abduction |
| **Tip source** | library (`approved`) |
| **EN tip** | Lead with the elbow to shoulder height. If the only bell you own is too heavy for this, slow the lowering rather than swinging it up. |
| **PL tip (current)** | Prowadź łokciem do wysokości barku. Jeśli jedyny ciężar, jaki masz, jest za duży, spowolnij opuszczanie zamiast zarzucać go w górę. |
| **PL tip (proposed)** | Prowadź łokciem do wysokości barku. Jeśli jedyny ciężar, jaki masz, jest za duży, spowolnij opuszczanie zamiast zarzucać go w górę. |
| **Decision** | applied |

### `single-arm-overhead-triceps-extension`

| | |
|---|---|
| **EN name** | Single-Arm Overhead Triceps Extension |
| **PL name** | Wyprost ramienia jednorącz zza głowy |
| **Pattern** | elbow-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Elbow points at the ceiling and stays there. Let the weight sink behind the head — the long head only works under that stretch. |
| **PL tip (current)** | Łokieć skierowany w sufit i pozostaje nieruchomo. Pozwól ciężarowi opaść za głowę — długa głowa pracuje tylko w tym rozciągnięciu. |
| **PL tip (proposed)** | Łokieć skierowany w sufit i pozostaje nieruchomo. Pozwól ciężarowi opaść za głowę — długa głowa pracuje tylko w tym rozciągnięciu. |
| **Decision** | applied |

### `single-arm-standing-press`

| | |
|---|---|
| **EN name** | Single-Arm Standing Press |
| **PL name** | Wyciskanie jednorącz stojąc |
| **Pattern** | vertical-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Squeeze the glutes and brace before the bell moves. Pressing on one side wants to bend you sideways; do not let it. |
| **PL tip (current)** | Napnij pośladki i brzuch, zanim ciężar ruszy. Wyciskanie jednorącz chce zgiąć cię na bok; nie pozwól na to. |
| **PL tip (proposed)** | Napnij pośladki i brzuch, zanim ciężar ruszy. Wyciskanie jednorącz chce zgiąć cię na bok; nie pozwól na to. |
| **Decision** | applied |

### `single-leg-cable-calf-raise`

| | |
|---|---|
| **EN name** | Single-Leg Cable Calf Raise |
| **PL name** | Jednonóż wspięcia na palce przy wyciągu |
| **Pattern** | calf |
| **Tip source** | library (`draft`) |
| **EN tip** | One leg at a time, full stretch and a pause. Match the weaker side. |
| **PL tip (current)** | Jedna noga naraz, pełne rozciągnięcie i pauza. Wyrównaj słabszą stronę. |
| **PL tip (proposed)** | Jedna noga naraz, pełne rozciągnięcie i pauza. Wyrównaj słabszą stronę. |
| **Decision** | applied |

### `single-leg-dumbbell-romanian-deadlift`

| | |
|---|---|
| **EN name** | Single-Leg Dumbbell Romanian Deadlift |
| **PL name** | Jednonóż martwy ciąg rumuński z hantlem |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Hips square, weight tracking close to the working leg. Stop when the hip starts to open rather than chasing depth. |
| **PL tip (current)** | Biodra ustawione równo, ciężar prowadzony blisko pracującej nogi. Stop, gdy biodro zaczyna się otwierać, zamiast gonić głębokość. |
| **PL tip (proposed)** | Biodra ustawione równo, ciężar prowadzony blisko pracującej nogi. Stop, gdy biodro zaczyna się otwierać, zamiast gonić głębokość. |
| **Decision** | applied |

### `single-leg-glute-bridge`

| | |
|---|---|
| **EN name** | Single-Leg Glute Bridge |
| **PL name** | Mostek pośladkowy jednonóż |
| **Pattern** | hip-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Keep the pelvis level and finish by shortening the working glute, not by arching the lower back. An unloaded set is recorded as 0 kg. |
| **PL tip (current)** | Utrzymuj miednicę poziomo i kończ ruchem pracującego pośladka, nie wygięciem lędźwi. Serię bez obciążenia zapisuj jako 0 kg. |
| **PL tip (proposed)** | Utrzymuj miednicę poziomo i kończ ruchem pracującego pośladka, nie wygięciem lędźwi. Serię bez obciążenia zapisuj jako 0 kg. |
| **Decision** | applied |

### `single-leg-hamstring-curl`

| | |
|---|---|
| **EN name** | Single-Leg Hamstring Curl |
| **PL name** | Uginanie nóg jednonóż |
| **Pattern** | knee-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Train the weaker leg first and make the stronger one match its reps. |
| **PL tip (current)** | Trenuj najpierw słabszą nogę, a silniejsza ma dorównać liczbie powtórzeń. |
| **PL tip (proposed)** | Trenuj najpierw słabszą nogę, a silniejsza ma dorównać liczbie powtórzeń. |
| **Decision** | applied |

### `single-leg-hip-thrust`

| | |
|---|---|
| **EN name** | Single-Leg Hip Thrust |
| **PL name** | Hip thrust jednonóż |
| **Pattern** | hip-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Set the shoulder blades on the bench, keep the pelvis level and drive through the working foot. Stop when the hip is fully extended without lumbar arching. |
| **PL tip (current)** | Oprzyj łopatki o ławkę, utrzymuj miednicę poziomo i naciskaj pracującą stopą. Zatrzymaj ruch przy pełnym wyproście biodra bez wyginania lędźwi. |
| **PL tip (proposed)** | Oprzyj łopatki o ławkę, utrzymuj miednicę poziomo i naciskaj pracującą stopą. Zatrzymaj ruch przy pełnym wyproście biodra bez wyginania lędźwi. |
| **Decision** | applied |

### `single-leg-rdl`

| | |
|---|---|
| **EN name** | Single-Leg Romanian Deadlift |
| **PL name** | Rumuński martwy ciąg na jednej nodze |
| **Pattern** | hinge |
| **Tip source** | library (`approved`) |
| **EN tip** | Hold a wall or a chair if balance is the limiter — the hamstring should fail before the balance does. |
| **PL tip (current)** | Przytrzymaj się ściany lub krzesła, jeśli ogranicza cię równowaga — ma poddać się dwugłowa, nie balans. |
| **PL tip (proposed)** | Przytrzymaj się ściany lub krzesła, jeśli ogranicza cię równowaga — ma poddać się dwugłowa, nie balans. |
| **Decision** | applied |

### `sissy-squat`

| | |
|---|---|
| **EN name** | Sissy Squat |
| **PL name** | Sissy squat |
| **Pattern** | knee-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Knees travel forward, hips stay extended. Lean back as one piece from knee to shoulder. |
| **PL tip (current)** | Kolana wędrują w przód, biodra pozostają wyprostowane. Odchyl się jednym blokiem od kolana do barku. |
| **PL tip (proposed)** | Kolana wędrują w przód, biodra pozostają wyprostowane. Odchyl się jednym blokiem od kolana do barku. |
| **Decision** | applied |

### `slow-eccentric-cheat-nordic-curl`

| | |
|---|---|
| **EN name** | Slow Eccentric Cheat Nordic Curls |
| **PL name** | Nordic curls z wolnym ekscentrykiem |
| **Pattern** | knee-flexion |
| **Tip source** | library (`approved`) |
| **EN tip** | Cheat up, lower as slowly as possible – aim to control more each week. |
| **PL tip (current)** | Oszukuj fazę wstępującą, opadaj jak najwolniej – celuj w lepszą kontrolę każdego tygodnia. |
| **PL tip (proposed)** | Oszukuj fazę wstępującą, opadaj jak najwolniej – celuj w lepszą kontrolę każdego tygodnia. |
| **Decision** | applied |

### `smith-calf-raise`

| | |
|---|---|
| **EN name** | Smith Machine Calf Raise |
| **PL name** | Wspięcia na palce w Smithie |
| **Pattern** | calf |
| **Tip source** | library (`draft`) |
| **EN tip** | The fixed bar lets you push the stretch safely. Do not rush the bottom position. |
| **PL tip (current)** | Prowadzona sztanga pozwala bezpiecznie wejść głęboko w rozciągnięcie. Nie spiesz się w dolnej pozycji. |
| **PL tip (proposed)** | Prowadzona sztanga pozwala bezpiecznie wejść głęboko w rozciągnięcie. Nie spiesz się w dolnej pozycji. |
| **Decision** | applied |

### `smith-overhead-press`

| | |
|---|---|
| **EN name** | Smith Machine Overhead Press |
| **PL name** | Wyciskanie nad głowę w Smithie |
| **Pattern** | vertical-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Fixed bar path, so seat position sets everything. Press without letting the ribs flare, and stop short of a hard lockout. |
| **PL tip (current)** | Tor sztangi jest ustalony, więc ustawienie siedziska decyduje o wszystkim. Wyciskaj bez wydychania żeber i bez twardego zamknięcia na górze. |
| **PL tip (proposed)** | Tor sztangi jest ustalony, więc ustawienie siedziska decyduje o wszystkim. Wyciskaj bez wydychania żeber i bez twardego zamknięcia na górze. |
| **Decision** | applied |

### `speed-deadlift-with-bands`

| | |
|---|---|
| **EN name** | Speed Deadlift with bands |
| **PL name** | Martwy ciąg dynamiczny z gumami |
| **Pattern** | hinge |
| **Tip source** | library (`draft`) |
| **EN tip** | Move the bar as fast as you can while keeping position. Accelerate through the lockout rather than easing into it. |
| **PL tip (current)** | Prowadź sztangę tak szybko jak potrafisz, zachowując pozycję. Przyspieszaj przez zamknięcie zamiast w nie wjeżdżać. |
| **PL tip (proposed)** | Prowadź sztangę tak szybko jak potrafisz, zachowując pozycję. Przyspieszaj przez zamknięcie zamiast w nie wjeżdżać. |
| **Decision** | applied |

### `split-squat`

| | |
|---|---|
| **EN name** | Split Squat |
| **PL name** | Przysiad bułgarski (w rozkroku) |
| **Pattern** | lunge |
| **Tip source** | library (`approved`) |
| **EN tip** | Front shin vertical for quads, torso leaned forward for glutes. Pick one and keep it. |
| **PL tip (current)** | Pionowa piszczel z przodu na czworogłowe, tułów pochylony na pośladki. Wybierz jedno i trzymaj się tego. |
| **PL tip (proposed)** | Pionowa piszczel z przodu na czworogłowe, tułów pochylony na pośladki. Wybierz jedno i trzymaj się tego. |
| **Decision** | applied |

### `spoto-press`

| | |
|---|---|
| **EN name** | Spoto Press |
| **PL name** | Wyciskanie Spoto |
| **Pattern** | horizontal-press |
| **Tip source** | library (`draft`) |
| **EN tip** | Stop the bar an inch off the chest and hold it there, then press. No touch, no bounce. |
| **PL tip (current)** | Zatrzymaj sztangę centymetry nad klatką, przytrzymaj i wypchnij. Bez dotyku, bez odbicia. |
| **PL tip (proposed)** | Zatrzymaj sztangę centymetry nad klatką, przytrzymaj i wypchnij. Bez dotyku, bez odbicia. |
| **Decision** | applied |

### `standing-calf-raise-off-step`

| | |
|---|---|
| **EN name** | Standing Calf Raise off Step |
| **PL name** | Wspięcia na palce na podwyższeniu |
| **Pattern** | calf |
| **Tip source** | library (`draft`) |
| **EN tip** | Heels well below the step for full stretch, then all the way up. Slow at both ends. |
| **PL tip (current)** | Pięty wyraźnie poniżej stopnia dla pełnego rozciągnięcia, potem maksymalnie w górę. Powoli na obu końcach. |
| **PL tip (proposed)** | Pięty wyraźnie poniżej stopnia dla pełnego rozciągnięcia, potem maksymalnie w górę. Powoli na obu końcach. |
| **Decision** | applied |

### `standing-calf-raise`

| | |
|---|---|
| **EN name** | Standing Calf Raises |
| **PL name** | Wspięcia na palce stojąc |
| **Pattern** | calf |
| **Tip source** | library (`approved`) |
| **EN tip** | Full stretch at bottom, 2-sec pause at bottom. Step, hack machine, or leg-press. |
| **PL tip (current)** | Pełne rozciągnięcie na dole, 2-sekundowa pauza na dole. Stopień, hack squat albo suwnica. |
| **PL tip (proposed)** | Pełne rozciągnięcie na dole, 2-sekundowa pauza na dole. Stopień, hack squat albo suwnica. |
| **Decision** | applied |

### `standing-dumbbell-kb-calf-raise`

| | |
|---|---|
| **EN name** | Standing Dumbbell/KB Calf Raise |
| **PL name** | Wspięcia na palce stojąc z hantlem/kettlem |
| **Pattern** | calf |
| **Tip source** | library (`draft`) |
| **EN tip** | Balance against something so the calves do the work rather than the ankles stabilising. Full range, brief squeeze. |
| **PL tip (current)** | Oprzyj się o coś, żeby łydki pracowały zamiast stabilizujących kostek. Pełny zakres, krótkie spięcie. |
| **PL tip (proposed)** | Oprzyj się o coś, żeby łydki pracowały zamiast stabilizujących kostek. Pełny zakres, krótkie spięcie. |
| **Decision** | applied |

### `standing-barbell-military-press`

| | |
|---|---|
| **EN name** | Standing Military Press |
| **PL name** | Wyciskanie żołnierskie stojąc |
| **Pattern** | vertical-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Strict, no leg drive. Proud chest, squeeze delts at top. |
| **PL tip (current)** | Czysto technicznie, bez pomocy nóg. Klatka do góry, ściśnij barki na górze. |
| **PL tip (proposed)** | Czysto technicznie, bez pomocy nóg. Klatka do góry, ściśnij barki na górze. |
| **Decision** | applied |

### `standing-straight-bar-curl`

| | |
|---|---|
| **EN name** | Standing Straight-Bar Curl |
| **PL name** | Uginanie ramion ze sztangą prostą |
| **Pattern** | elbow-flexion |
| **Tip source** | library (`draft`) |
| **EN tip** | Elbows at the sides, no swing. The set ends when the torso starts moving, not when the arms fail. |
| **PL tip (current)** | Łokcie przy bokach, bez bujania. Seria kończy się, gdy tułów zaczyna się ruszać, nie gdy ramiona się poddają. |
| **PL tip (proposed)** | Łokcie przy bokach, bez bujania. Seria kończy się, gdy tułów zaczyna się ruszać, nie gdy ramiona się poddają. |
| **Decision** | applied |

### `stiff-legged-deadlift`

| | |
|---|---|
| **EN name** | Stiff-Legged Deadlift |
| **PL name** | Martwy ciąg na prostych nogach |
| **Pattern** | hinge |
| **Tip source** | library (`approved`) |
| **EN tip** | Slow down and lightly touch the ground. Feel the hamstring stretch. |
| **PL tip (current)** | Zwolnij i lekko dotknij ziemi. Poczuj rozciągnięcie mięśni dwugłowych. |
| **PL tip (proposed)** | Zwolnij i lekko dotknij ziemi. Poczuj rozciągnięcie mięśni dwugłowych. |
| **Decision** | applied |

### `stiletto-squat`

| | |
|---|---|
| **EN name** | Stiletto Squats |
| **PL name** | Stiletto squat |
| **Pattern** | squat |
| **Tip source** | library (`approved`) |
| **EN tip** | Ass to grass - touch calves with glutes. Elevated heels. |
| **PL tip (current)** | Pupa do trawy - dotknij łydek pośladkami. Pięty podniesione. |
| **PL tip (proposed)** | Pupa do trawy - dotknij łydek pośladkami. Pięty podniesione. |
| **Decision** | applied |

### `straight-bar-cable-curl`

| | |
|---|---|
| **EN name** | Straight-Bar Cable Curl |
| **PL name** | Uginanie ramion na wyciągu z drążkiem |
| **Pattern** | elbow-flexion |
| **Tip source** | library (`draft`) |
| **EN tip** | Constant tension throughout. Keep the elbows fixed and squeeze at the top without pulling back. |
| **PL tip (current)** | Stałe napięcie przez cały ruch. Łokcie nieruchome, ściśnij na górze bez odciągania w tył. |
| **PL tip (proposed)** | Stałe napięcie przez cały ruch. Łokcie nieruchome, ściśnij na górze bez odciągania w tył. |
| **Decision** | applied |

### `stripper-squat`

| | |
|---|---|
| **EN name** | Stripper Squat |
| **PL name** | Przysiad „stripper” na hack squat |
| **Pattern** | knee-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Use a light Hack Squat load. Let the hips rise first, then finish by driving the knees straight; keep every rep controlled and use it as a quad burn movement. |
| **PL tip (current)** | Użyj lekkiego obciążenia na hack squat. Najpierw unieś biodra, potem doprostuj kolana; kontroluj każde powtórzenie i traktuj ruch jako dopalenie czworogłowych. |
| **PL tip (proposed)** | Użyj lekkiego obciążenia na hack squat. Najpierw unieś biodra, potem doprostuj kolana; kontroluj każde powtórzenie i traktuj ruch jako dopalenie czworogłowych. |
| **Decision** | applied |

### `suitcase-carry`

| | |
|---|---|
| **EN name** | Suitcase Carry |
| **PL name** | Marsz walizkowy |
| **Pattern** | core-antirotation |
| **Tip source** | library (`approved`) |
| **EN tip** | Walk without listing to either side. Short steps, ribs down, shoulders level. |
| **PL tip (current)** | Idź, nie przechylając się na żadną stronę. Krótkie kroki, żebra w dół, barki na równi. |
| **PL tip (proposed)** | Idź, nie przechylając się na żadną stronę. Krótkie kroki, żebra w dół, barki na równi. |
| **Decision** | applied |

### `suitcase-hold`

| | |
|---|---|
| **EN name** | Suitcase Hold |
| **PL name** | Trzymanie walizkowe |
| **Pattern** | core-antirotation |
| **Tip source** | library (`approved`) |
| **EN tip** | Load in one hand, stand tall, refuse to lean. The working side is the empty one. |
| **PL tip (current)** | Ciężar w jednej ręce, stój wyprostowany, nie przechylaj się. Pracuje strona bez ciężaru. |
| **PL tip (proposed)** | Ciężar w jednej ręce, stój wyprostowany, nie przechylaj się. Pracuje strona bez ciężaru. |
| **Decision** | applied |

### `sumo-deadlift`

| | |
|---|---|
| **EN name** | Sumo Deadlift |
| **PL name** | Martwy ciąg sumo |
| **Pattern** | hinge |
| **Tip source** | library (`approved`) |
| **EN tip** | Go brutally heavy. Use straps. 1-2 sec squeeze at top - crack a walnut with your glutes. |
| **PL tip (current)** | Ciężkie powtórzenia! Używaj pasków. 1-2 sek ścisk na górze – myśl 'zgniatanie orzechów' pośladkami. |
| **PL tip (proposed)** | Ciężkie powtórzenia! Używaj pasków. 1-2 sek ścisk na górze – myśl 'zgniatanie orzechów' pośladkami. |
| **Decision** | applied |

### `supported-sissy-squat`

| | |
|---|---|
| **EN name** | Supported Sissy Squat |
| **PL name** | Sissy squat z podparciem |
| **Pattern** | knee-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Hold the Smith bar for support, drive the knees forward and lean back so the body stays in one line from knee to shoulder. |
| **PL tip (current)** | Przytrzymaj drążek maszyny Smitha, wypchnij kolana do przodu i odchyl się tak, by ciało tworzyło linię od kolana do barku. |
| **PL tip (proposed)** | Przytrzymaj drążek maszyny Smitha, wypchnij kolana do przodu i odchyl się tak, by ciało tworzyło linię od kolana do barku. |
| **Decision** | applied |

### `supported-stiff-legged-dumbbell-deadlift`

| | |
|---|---|
| **EN name** | Supported Stiff Legged DB Deadlift |
| **PL name** | Martwy ciąg na prostych nogach z hantlami (z podparciem) |
| **Pattern** | hinge |
| **Tip source** | library (`approved`) |
| **EN tip** | Lean over smith machine or racked bar. Heels under or behind bar. 3-4 sec eccentric. |
| **PL tip (current)** | Oprzyj się o maszynę Smitha lub sztangę na stojaku. Pięty pod lub przed sztangą. 3-4 sek opuszczanie. |
| **PL tip (proposed)** | Oprzyj się o maszynę Smitha lub sztangę na stojaku. Pięty pod lub przed sztangą. 3-4 sek opuszczanie. |
| **Decision** | applied |

### `tempo-squat`

| | |
|---|---|
| **EN name** | Tempo Squat |
| **PL name** | Przysiad w tempie |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Control the descent for the prescribed count and keep it even — most tempo squats are fast at the bottom, which is the part that matters. |
| **PL tip (current)** | Schodź równo przez zadaną liczbę sekund — w większości tempo przysiadów dołek jest za szybki, a to on jest najważniejszy. |
| **PL tip (proposed)** | Schodź równo przez zadaną liczbę sekund — w większości tempo przysiadów dołek jest za szybki, a to on jest najważniejszy. |
| **Decision** | applied |

### `trap-bar-deadlift`

| | |
|---|---|
| **EN name** | Trap-Bar Deadlift |
| **PL name** | Martwy ciąg z gryfem heksagonalnym |
| **Pattern** | hinge |
| **Tip source** | library (`approved`) |
| **EN tip** | Handles beside the hips, hips slightly higher than a squat. Stand up; do not turn it into a squat or a stiff-legged pull. |
| **PL tip (current)** | Uchwyty przy biodrach, biodra nieco wyżej niż w przysiadzie. Wstań; nie zamieniaj tego w przysiad ani w martwy ciąg na prostych. |
| **PL tip (proposed)** | Uchwyty przy biodrach, biodra nieco wyżej niż w przysiadzie. Wstań; nie zamieniaj tego w przysiad ani w martwy ciąg na prostych. |
| **Decision** | applied |

### `triangle-pushdown`

| | |
|---|---|
| **EN name** | Triangle Pushdown |
| **PL name** | Prostowanie ramion z uchwytem trójkątnym |
| **Pattern** | elbow-extension |
| **Tip source** | library (`draft`) |
| **EN tip** | Neutral grip on the attachment, elbows fixed. Full extension at the bottom without leaning into it. |
| **PL tip (current)** | Chwyt neutralny na uchwycie, łokcie nieruchome. Pełne wyprostowanie na dole bez wchodzenia w uchwyt tułowiem. |
| **PL tip (proposed)** | Chwyt neutralny na uchwycie, łokcie nieruchome. Pełne wyprostowanie na dole bez wchodzenia w uchwyt tułowiem. |
| **Decision** | applied |

### `tricep-extension`

| | |
|---|---|
| **EN name** | Tricep Extensions |
| **PL name** | Prostowanie ramion |
| **Pattern** | elbow-extension |
| **Tip source** | library (`approved`) |
| **EN tip** | Accessory work chosen for a weak point. Full range, controlled, no swing. |
| **PL tip (current)** | Ćwiczenie akcesoryjne na słaby punkt. Pełny zakres, pod kontrolą, bez zamachu. |
| **PL tip (proposed)** | Ćwiczenie akcesoryjne na słaby punkt. Pełny zakres, pod kontrolą, bez zamachu. |
| **Decision** | applied |

### `trx-body-row`

| | |
|---|---|
| **EN name** | TRX Body Row |
| **PL name** | Wiosłowanie na TRX |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Walk the feet forward to make it harder. Body stays in one line — no hips sagging. |
| **PL tip (current)** | Przesuń stopy do przodu, by utrudnić. Ciało w jednej linii – biodra nie opadają. |
| **PL tip (proposed)** | Przesuń stopy do przodu, by utrudnić. Ciało w jednej linii – biodra nie opadają. |
| **Decision** | applied |

### `trx-push-up`

| | |
|---|---|
| **EN name** | TRX Push-Up |
| **PL name** | Pompka na TRX |
| **Pattern** | horizontal-press |
| **Tip source** | library (`approved`) |
| **EN tip** | The straps will wander — that is the point. Keep the ribs down and the handles under the shoulders. |
| **PL tip (current)** | Taśmy będą uciekać – o to chodzi. Trzymaj żebra w dół, a uchwyty pod barkami. |
| **PL tip (proposed)** | Taśmy będą uciekać – o to chodzi. Trzymaj żebra w dół, a uchwyty pod barkami. |
| **Decision** | applied |

### `turkish-get-up`

| | |
|---|---|
| **EN name** | Turkish Get-Up |
| **PL name** | Wstawanie tureckie |
| **Pattern** | carry |
| **Tip source** | library (`approved`) |
| **EN tip** | One position at a time, eyes on the bell until standing. Stop the set the moment a position stops being controlled. |
| **PL tip (current)** | Jedna pozycja naraz, wzrok na kettlu aż do wstania. Przerwij serię, gdy tylko tracisz kontrolę nad którąś pozycją. |
| **PL tip (proposed)** | Jedna pozycja naraz, wzrok na kettlu aż do wstania. Przerwij serię, gdy tylko tracisz kontrolę nad którąś pozycją. |
| **Decision** | applied |

### `walking-lunge`

| | |
|---|---|
| **EN name** | Walking Lunges |
| **PL name** | Wykroki w marszu |
| **Pattern** | lunge |
| **Tip source** | library (`approved`) |
| **EN tip** | Long strides, do not push off back leg. Drive through front heel. |
| **PL tip (current)** | Długie kroki, nie odpychaj się tylną nogą. Napędzaj przednią piętą. |
| **PL tip (proposed)** | Długie kroki, nie odpychaj się tylną nogą. Napędzaj przednią piętą. |
| **Decision** | applied |

### `wall-slide`

| | |
|---|---|
| **EN name** | Wall Slide |
| **PL name** | Ślizg ramion po ścianie |
| **Pattern** | vertical-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Reach overhead without flaring the ribs; stop at the highest controlled position. |
| **PL tip (current)** | Sięgaj nad głowę bez wypychania żeber; zatrzymaj się w najwyższej kontrolowanej pozycji. |
| **PL tip (proposed)** | Sięgaj nad głowę bez wypychania żeber; zatrzymaj się w najwyższej kontrolowanej pozycji. |
| **Decision** | applied |

### `weighted-chin-up`

| | |
|---|---|
| **EN name** | Weighted Chin-Up |
| **PL name** | Podciąganie podchwytem z obciążeniem |
| **Pattern** | vertical-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Total system weight is bodyweight plus the load on the belt. Full hang to collarbone, no kipping. |
| **PL tip (current)** | Ciężar całkowity to masa ciała plus obciążenie na pasie. Pełny zwis do obojczyków, bez wymachów. |
| **PL tip (proposed)** | Ciężar całkowity to masa ciała plus obciążenie na pasie. Pełny zwis do obojczyków, bez wymachów. |
| **Decision** | applied |

### `weighted-crunch`

| | |
|---|---|
| **EN name** | Weighted Crunch |
| **PL name** | Spięcia brzucha z obciążeniem |
| **Pattern** | core-flexion |
| **Tip source** | library (`draft`) |
| **EN tip** | Short range, spine rounding, no hip flexor pull. Add load only once the movement stays clean. |
| **PL tip (current)** | Krótki zakres, zaokrąglenie kręgosłupa, bez ciągnięcia biodrami. Dokładaj ciężar dopiero, gdy ruch jest czysty. |
| **PL tip (proposed)** | Krótki zakres, zaokrąglenie kręgosłupa, bez ciągnięcia biodrami. Dokładaj ciężar dopiero, gdy ruch jest czysty. |
| **Decision** | applied |

### `weighted-dip`

| | |
|---|---|
| **EN name** | Weighted Dip |
| **PL name** | Pompki na poręczach z obciążeniem |
| **Pattern** | horizontal-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Add weight only once every set is clean at the top of the range. Control the bottom, do not drop into it. |
| **PL tip (current)** | Dodawaj ciężar dopiero, gdy każda seria jest czysta w górnym zakresie. Kontroluj dół, nie opadaj w niego. |
| **PL tip (proposed)** | Dodawaj ciężar dopiero, gdy każda seria jest czysta w górnym zakresie. Kontroluj dół, nie opadaj w niego. |
| **Decision** | applied |

### `weighted-pull-up`

| | |
|---|---|
| **EN name** | Weighted Pull-ups |
| **PL name** | Podciągania z obciążeniem |
| **Pattern** | vertical-pull |
| **Tip source** | library (`draft`) |
| **EN tip** | Total system weight is bodyweight plus the belt load. Full hang to chin over the bar; stop the set when range shortens. |
| **PL tip (current)** | Ciężar całkowity to masa ciała plus obciążenie na pasie. Pełne zwisanie do brody nad drążkiem; kończ serię, gdy zakres się skraca. |
| **PL tip (proposed)** | Ciężar całkowity to masa ciała plus obciążenie na pasie. Pełne zwisanie do brody nad drążkiem; kończ serię, gdy zakres się skraca. |
| **Decision** | applied |

### `weighted-step-up`

| | |
|---|---|
| **EN name** | Weighted Step-Up |
| **PL name** | Wejście na podest z obciążeniem |
| **Pattern** | lunge |
| **Tip source** | library (`approved`) |
| **EN tip** | Drive through the working foot and avoid pushing off the floor leg. Match the weaker side. |
| **PL tip (current)** | Napędzaj ruch nogą na podeście i nie odpychaj się nogą z podłogi. Dopasuj liczbę powtórzeń do słabszej strony. |
| **PL tip (proposed)** | Napędzaj ruch nogą na podeście i nie odpychaj się nogą z podłogi. Dopasuj liczbę powtórzeń do słabszej strony. |
| **Decision** | applied |

### `wide-grip-barbell-row`

| | |
|---|---|
| **EN name** | Wide Grip BB Row |
| **PL name** | Wiosłowanie sztangą szerokim chwytem |
| **Pattern** | horizontal-pull |
| **Tip source** | library (`approved`) |
| **EN tip** | Pinky fingers on the inner rings. Pull to lower chest. |
| **PL tip (current)** | Małe palce na wewnętrznych pierścieniach. Ciągnij do dolnej klatki. |
| **PL tip (proposed)** | Małe palce na wewnętrznych pierścieniach. Ciągnij do dolnej klatki. |
| **Decision** | applied |

### `wide-grip-bench-press`

| | |
|---|---|
| **EN name** | Wide-Grip Bench Press |
| **PL name** | Wyciskanie szerokim chwytem |
| **Pattern** | horizontal-press |
| **Tip source** | library (`approved`) |
| **EN tip** | Wide grip with the elbows flared. Touch under control and take the deep stretch at the bottom rather than bouncing out of it. |
| **PL tip (current)** | Szeroki chwyt, łokcie na zewnątrz. Dotykaj pod kontrolą i bierz głębokie rozciągnięcie na dole zamiast odbijać. |
| **PL tip (proposed)** | Szeroki chwyt, łokcie na zewnątrz. Dotykaj pod kontrolą i bierz głębokie rozciągnięcie na dole zamiast odbijać. |
| **Decision** | applied |

### `y-raise`

| | |
|---|---|
| **EN name** | Y-Raises |
| **PL name** | Unoszenie Y |
| **Pattern** | shoulder-horizontal-abduction |
| **Tip source** | library (`draft`) |
| **EN tip** | Arms out at roughly forty-five degrees with the thumbs up. Light load; stop when the traps take over. |
| **PL tip (current)** | Ramiona pod kątem około 45 stopni, kciuki w górę. Lekki ciężar; stop, gdy przejmują czworoboczne. |
| **PL tip (proposed)** | Ramiona pod kątem około 45 stopni, kciuki w górę. Lekki ciężar; stop, gdy przejmują czworoboczne. |
| **Decision** | applied |

### `zercher-squat`

| | |
|---|---|
| **EN name** | Zercher Squat |
| **PL name** | Przysiad Zerchera |
| **Pattern** | squat |
| **Tip source** | library (`draft`) |
| **EN tip** | Bar in the crook of the elbows, held tight to the body. Keep the chest up; the set ends when the bar starts sliding, not when the legs give out. |
| **PL tip (current)** | Sztanga w zgięciach łokci, przyciśnięta do ciała. Klatka wysoko; seria kończy się, gdy sztanga zaczyna zjeżdżać, nie gdy poddają nogi. |
| **PL tip (proposed)** | Sztanga w zgięciach łokci, przyciśnięta do ciała. Klatka wysoko; seria kończy się, gdy sztanga zaczyna zjeżdżać, nie gdy poddają nogi. |
| **Decision** | applied |
