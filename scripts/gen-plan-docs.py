# -*- coding: utf-8 -*-
"""
gen-plan-docs — renders docs/plans/<plan>.md from docs/analysis/plan-facts.json.

Every figure in the generated docs comes from the materialised week the app
actually produces, so the docs cannot drift from the code without this script
being re-run. Regenerate with:

    npx --yes tsx scripts/dump-plan-facts.ts && python scripts/gen-plan-docs.py
"""
import io, json, os, re

FACTS = json.load(io.open('docs/analysis/plan-facts.json', encoding='utf-8'))

# Filenames kept from the pre-rebuild docs so existing links still resolve.
SLUG = {
    'peachy-glute-plan': 'peachy',
}

SOURCE = {}
for line in io.open('src/data/plans.ts', encoding='utf-8'):
    m = re.match(r"import \{ (\w+_CONFIG) \} from '\./([\w/]+)'", line.strip())
    if m:
        SOURCE[m.group(1)] = 'src/data/%s.ts' % m.group(2)


def slug(pid):
    return SLUG.get(pid, pid)


# Weekly direct-set bands per major group, mirroring SET_BANDS in
# scripts/portfolio-metrics.ts. Smaller groups grow on a lower dose.
BANDS = {
    'chest': (10, 20), 'back': (10, 20), 'quads': (10, 20), 'hamstrings': (10, 20),
    'glutes': (10, 20), 'shoulders': (10, 20), 'biceps': (6, 20), 'triceps': (6, 20),
    'calves': (6, 20), 'core': (6, 20),
}


def band_note(group, sets):
    mev, mav = BANDS.get(group, (10, 20))
    if sets == 0:
        return 'no direct sets'
    if sets < mev:
        return 'below the %d-set growth dose' % mev
    if sets > mav:
        return 'above the %d-set ceiling' % mav
    return 'in band'


FATIGUE_WORD = {1: 'low', 2: 'moderate', 3: 'high', 4: 'very high'}


def esc(s):
    return (s or '').replace('|', r'\|')


def render(r):
    pid = r['id']
    card = r.get('card') or {}
    pf = r.get('portfolio') or {}
    m = r.get('metrics') or {}
    ss = r.get('setShape') or {}
    name = card.get('name') or pid
    L = []
    add = L.append

    add('# %s' % name)
    add('')
    add('> Plan reference, v3 format — regenerated from the shipped code by')
    add('> `scripts/gen-plan-docs.py` off `docs/analysis/plan-facts.json`. Every')
    add('> number below is measured from the week the app actually builds, not')
    add('> transcribed from a spec. Supersedes the pre-rebuild doc and the v2')
    add('> audit note, both kept in `docs/archive/plans-v2-2026-08/`.')
    add('')

    add('| | |')
    add('|---|---|')
    add('| **id** | `%s` |' % pid)
    if pf.get('weeks'):
        add('| **Length** | %d weeks |' % pf['weeks'])
    elif r.get('weeksInProgram'):
        add('| **Length** | %d weeks |' % r['weeksInProgram'])
    freq = pf.get('frequency') or []
    if freq:
        add('| **Frequency** | %s days/week |' % '/'.join(str(f) for f in freq))
    add('| **Weekly sets** | %s across %s training days (week %s sample) |' % (
        m.get('totalSets'), r['week']['trainingDays'], r['week']['sampledWeek']))
    add('| **Sets/session** | %s |' % m.get('setsPerSession'))
    if pf.get('goal'):
        add('| **Goal** | %s |' % ', '.join(pf['goal']))
    if pf.get('experience'):
        add('| **Experience** | %s |' % ', '.join(pf['experience']))
    if pf.get('equipment'):
        add('| **Equipment** | %s |' % ', '.join(pf['equipment']))
    if pf.get('adaptability'):
        add('| **Adaptability** | %s |' % pf['adaptability'])
    if pf.get('fatigue'):
        add('| **Fatigue cost** | %d/4 — %s |' % (pf['fatigue'], FATIGUE_WORD[pf['fatigue']]))
    add('| **Session engine** | `%s` |' % r.get('engine'))
    ob = r.get('onboarding') or {}
    cal = []
    if ob.get('requiredStats'):
        cal.append('required: %s' % ', '.join('`%s`' % s for s in ob['requiredStats']))
    if ob.get('seedStats'):
        cal.append('seeded: %s' % ', '.join('`%s`' % s for s in ob['seedStats']))
    if ob.get('requireBodyweight'):
        cal.append('`requireBodyweight: true`')
    add('| **Calibration** | %s |' % (('; '.join(cal)) if cal else 'none'))
    if r.get('hooks'):
        add('| **Hooks** | %s |' % ', '.join('`%s`' % h for h in r['hooks']))
    if r.get('techniques'):
        add('| **Techniques used** | %s |' % ', '.join('`%s`' % t for t in sorted(r['techniques'])))
    if r.get('alwaysFree'):
        add('| **Access** | always free |')
    if r.get('hidden'):
        add('| **Catalogue** | hidden from onboarding |')
    if card.get('description'):
        add('| **Card promise** | *"%s"* |' % esc(card['description']))
    add('')
    add('---')
    add('')

    add('## 1. What this plan is')
    add('')
    if pf.get('signatureMechanic'):
        add('**Signature mechanic.** %s' % pf['signatureMechanic'])
        add('')
    if card.get('features'):
        add('The onboarding card claims:')
        add('')
        for f in card['features']:
            add('- %s' % f)
        add('')
    if pf.get('prerequisites'):
        add('**Prerequisites.** %s' % '; '.join(pf['prerequisites']))
        add('')
    if pf.get('notForYouIf'):
        add('**Not for you if.**')
        add('')
        for n in pf['notForYouIf']:
            add('- %s' % n)
        add('')
    if pf.get('followUps'):
        add('**Follow-ups.** %s' % ', '.join('[%s](%s.md)' % (f, slug(f)) for f in pf['followUps']))
        add('')
    add('---')
    add('')

    add('## 2. The training week')
    add('')
    if r['week'].get('perVisitGenerator'):
        add("This plan generates each session on demand rather than from a fixed")
        add("calendar, so the week below is a representative sample taken at the")
        add("plan's own stated frequency, not a fixed template.")
        add('')
    for n in (r['week'].get('notes') or []):
        add('> **Measurement note.** %s' % n)
        add('')
    # materialise() labels days positionally; the program carries the real
    # names, so prefer those for the sampled week when the shapes line up.
    sampled = next((w for w in (r.get('weekShapes') or [])
                    if w['week'] == r['week']['sampledWeek']), None)
    detail = r.get('dayDetail', [])
    names = [d['name'] for d in sampled['days']] if sampled and len(sampled['days']) == len(detail) \
        else [d['name'] for d in detail]

    # A per-visit generator's "week" is one sampled session repeated to the
    # declared frequency, so listing it N times would imply a template it does
    # not have. Show the representative session once instead.
    per_visit = bool(r['week'].get('perVisitGenerator'))
    rows = detail[:1] if per_visit else detail
    labels = ['Representative session'] if per_visit else names

    # A free-choice generator's expected session spreads fractional sets over
    # the whole reachable pool, so no slot rounds to a real prescription. A
    # slot table would read as a workout nobody is ever given; describe the
    # pool instead.
    free_choice = per_visit and rows and max((s['sets'] for s in rows[0]['slots']), default=0) < 1

    if free_choice:
        pool = sorted({s['name'] for s in rows[0]['slots']})
        add('This plan draws each session from a pool rather than prescribing one,')
        add('so the measured "session" is an expectation averaged over every route')
        add('through it. No single slot table describes what an athlete is handed.')
        add('')
        add('| | |')
        add('|---|---:|')
        add('| Reachable movements | %d |' % len(pool))
        add('| Sets per session | %d (by construction) |' % rows[0]['sets'])
        add('| Sessions per week | %s (declared) |' % r['week']['trainingDays'])
        add('')
        add('<details><summary>The reachable pool (%d movements)</summary>' % len(pool))
        add('')
        for nm in pool:
            add('- %s' % nm)
        add('')
        add('</details>')
        add('')
    else:
        reps = r.get('repsByExercise') or {}

        def slot_text(sl):
            rng = reps.get(sl['name'])
            return '%s %d%s' % (esc(sl['name']), sl['sets'], '×%s' % esc(rng) if rng else '')

        add('| Day | Slots | Sets | Work (sets×reps) |')
        add('|---|---:|---:|---|')
        for label, d in zip(labels, rows):
            work = ', '.join(slot_text(sl) for sl in d['slots'])
            add('| %s | %d | %d | %s |' % (esc(label), len(d['slots']), d['sets'], work))
        add('')
        if per_visit:
            add('Weekly totals elsewhere in this doc are that session multiplied by the')
            add("plan's declared %s sessions per week." % r['week']['trainingDays'])
            add('')

    shapes = [] if per_visit else (r.get('weekShapes') or [])
    if len(shapes) > 1:
        sig = {}
        for w in shapes:
            key = tuple((d['name'], d['sets']) for d in w['days'])
            sig.setdefault(key, []).append(w['week'])
        if len(sig) > 1:
            add('### Week-to-week shape')
            add('')
            add('The program runs %d weeks falling into %d distinct set-count shapes:' % (len(shapes), len(sig)))
            add('')
            add('| Weeks | Sets per training day |')
            add('|---|---|')
            for key, weeks in sorted(sig.items(), key=lambda kv: kv[1][0]):
                add('| %s | %s |' % (', '.join(str(w) for w in weeks),
                                     ', '.join('%s %d' % (esc(n), s) for n, s in key)))
            add('')
        else:
            add('All %d weeks carry the same set-count shape; what varies week to' % len(shapes))
            add('week is load, reps and technique rather than volume.')
            add('')
    add('---')
    add('')

    add('## 3. Weekly volume by muscle group')
    add('')
    add('Direct sets, counted once per exercise per major group.')
    add('')
    add('| Group | Sets | Read |')
    add('|---|---:|---|')
    vol = m.get('volume') or {}
    for g, v in sorted(vol.items(), key=lambda kv: -kv[1]):
        add('| %s | %s | %s |' % (g, v, band_note(g, v)))
    add('')
    if m.get('groupsMissing'):
        add('**Untrained groups:** %s.' % ', '.join('`%s`' % g for g in m['groupsMissing']))
        add('')
    add('| Balance | Value |')
    add('|---|---|')
    add('| Push:pull (direct sets) | %s |' % (m.get('pushPullRatio') if m.get('pushPullRatio') is not None else 'n/a'))
    add('| Quad:hamstring | %s |' % (m.get('quadHamRatio') if m.get('quadHamRatio') is not None else 'n/a'))
    add('| Groups covered (4+ sets) | %s of 10 |' % m.get('groupsCovered'))
    add('| Groups trained on two or more days | %s |' % m.get('twicePlusGroups'))
    add('')
    add('---')
    add('')

    add('## 4. Systemic and joint load')
    add('')
    add('| Metric | Value |')
    add('|---|---|')
    add('| Systemic (weekly) | **%s** |' % m.get('systemic'))
    add('| Axial | **%s** |' % m.get('axial'))
    add('| Lower back | %s |' % m.get('lowerBack'))
    add('| Per-set systemic | %s |' % m.get('perSetSystemic'))
    add('| High-systemic sets (cost 3+) | %s |' % m.get('highSystemicSets'))
    add('| Compound share | %s%% |' % round((m.get('compoundShare') or 0) * 100))
    add('| Shoulder / knee / elbow cost | %s / %s / %s |' % (
        m.get('weeklyShoulderCost'), m.get('weeklyKneeCost'), m.get('weeklyElbowCost')))
    add('')
    add('| Stimulus quality | Value |')
    add('|---|---|')
    add('| Mean lengthened bias (0-4) | %s |' % m.get('avgLengthened'))
    add('| Mean stability demand (0-4) | %s |' % m.get('avgStability'))
    add('| Stimulus per unit fatigue | %s |' % m.get('stimulusPerFatigue'))
    add('| Failure-safe share of sets | %s%% |' % round((m.get('failureSafeShare') or 0) * 100))
    add('')
    add('---')
    add('')

    add('## 5. Set shape')
    add('')
    add('| | |')
    add('|---|---:|')
    add('| Slots | %s |' % ss.get('slots'))
    add('| At 1 set | %s |' % ss.get('singletons'))
    add('| At 2 sets | %s |' % ss.get('twos'))
    add('| At 3 sets | %s |' % ss.get('threes'))
    add('| At 4+ sets | %s |' % ss.get('fourPlus'))
    add('| Mean sets per slot | %s |' % ss.get('avgSetsPerSlot'))
    add('| Distinct exercises | %s |' % m.get('distinctExercises'))
    add('| Variety density (exercises per 10 sets) | %s |' % m.get('varietyDensity'))
    add('| Largest single-exercise share | %s%% |' % round((m.get('topExerciseShare') or 0) * 100))
    add('')
    # Every slot at 1 set or above 3 gets listed, per the standing review rule.
    # Timed/density blocks are excluded from the 1-set flag: there is no second
    # set to add to a block.
    singles, deep = [], []
    for label, d in (zip(labels, rows) if not free_choice else []):
        for i, s in enumerate(d['slots']):
            if s['sets'] == 1 and not s.get('block'):
                singles.append((label, s['name']))
            elif s['sets'] >= 4:
                deep.append((label, s['name'], s['sets'], i == 0))

    if singles or deep:
        add('### Flagged slots')
        add('')
        add('Every slot at one set, and every slot at four or more. Both are review')
        add('flags rather than automatic defects — a plan built on one all-out work')
        add('set, a top-single mechanic, a density block, or specialisation volume')
        add('on its own muscle earns them. The rest are worth a second look.')
        add('')
        if singles:
            add('**One set (%d):**' % len(singles))
            add('')
            for day, nm in singles:
                add('- %s — %s' % (esc(day), esc(nm)))
            add('')
        if deep:
            add('**Four or more sets (%d):**' % len(deep))
            add('')
            for day, nm, sets, opener in deep:
                add('- %s — %s, %d sets%s' % (
                    esc(day), esc(nm), sets, ' *(session opener)*' if opener else ''))
            add('')
    elif free_choice:
        add('Set shape is a property of each drafted pair rather than of a fixed')
        add('template here, so per-slot flags do not apply.')
        add('')
    else:
        add('No slot sits at one set and none carries more than three. Nothing to flag.')
        add('')
    add('---')
    add('')

    ranges = r.get('distinctRepRanges') or []
    if ranges:
        add('## 6. Rep schemes')
        add('')
        add('%d distinct rep ranges across the plan. A plan that prescribes one' % len(ranges))
        add('range for every movement is asking a lateral raise and a squat the')
        add('same question; a real spread is the sign that each slot was chosen.')
        add('')
        add('| Range | Movements |')
        add('|---|---|')
        by_range = {}
        for nm, rng in (r.get('repsByExercise') or {}).items():
            by_range.setdefault(rng, []).append(nm)
        for rng in ranges:
            add('| `%s` | %s |' % (esc(rng), ', '.join(esc(n) for n in sorted(by_range[rng]))))
        add('')
        add('---')
        add('')

    prog = r.get('progressionByExercise') or {}
    if prog:
        add('## 7. Load progression')
        add('')
        add('How the weight on each movement is chosen, and what makes it go up.')
        add('Two layers combine: the rule the plan declares on a slot, and the')
        add('save-time handler that writes the next working load after a session.')
        add('')
        add('| | |')
        add('|---|---|')
        handler_desc = {
            'own': 'its own rule — `PROGRESSION_HANDLERS[%r]`, which does **not** '
                   'fall back to the shared double progression' % pid,
            'own+double': 'its own rule — `PROGRESSION_HANDLERS[%r]` — composed on top '
                          'of the shared double progression' % pid,
            'shared': 'none of its own; the shared `genericDoubleProgression` runs',
        }
        add('| **Save-time handler** | %s |' % handler_desc.get(r.get('progressionHandler'), 'unknown'))
        add('| **Slot-level rules** | %s |' % (
            'declared on at least one movement' if r.get('declaresSlotRules')
            else 'none — every movement is carried by the handler'))
        cov = r.get('progressionCoverage')
        if cov:
            add('| **Next load written** | %d of %d movements (%d%%) after a clean session |' % (
                cov['written'], cov['movements'], cov['pct']))
        add('')
        if cov and cov['pct'] < 100:
            add("> **Coverage note.** %d of this plan's %d movements come back from a" % (
                cov['movements'] - cov['written'], cov['movements']))
            add('> fully-completed session with no next load recorded, so the athlete')
            add('> carries those numbers themselves. A plan with its own save-time')
            add('> handler never runs the shared double progression, so any movement')
            add('> that handler does not cover is left unprogressed.')
            add('')
        grouped = {}
        for nm, rule in prog.items():
            grouped.setdefault((rule['from'], rule['advances']), []).append(nm)
        add('| Prescribed from | Advances by | Movements |')
        add('|---|---|---|')
        for (frm, adv), names in sorted(grouped.items(), key=lambda kv: -len(kv[1])):
            add('| %s | %s | %s |' % (esc(frm), esc(adv), ', '.join(esc(n) for n in sorted(names))))
        add('')
        add('---')
        add('')

    add('## 8. Export block')
    add('')
    add('```yaml')
    add('id: %s' % pid)
    add('version: 3')
    add('generated_from: docs/analysis/plan-facts.json')
    if pf.get('weeks'):
        add('length_weeks: %d' % pf['weeks'])
    add('frequency: %s' % (freq or 'n/a'))
    add('engine: %s' % r.get('engine'))
    add('sampled_week: %s' % r['week']['sampledWeek'])
    add('weekly: { sets: %s, days: %s, sets_per_session: %s, slots: %s }' % (
        m.get('totalSets'), m.get('days'), m.get('setsPerSession'), ss.get('slots')))
    add('load: { systemic: %s, axial: %s, lower_back: %s, per_set_systemic: %s }' % (
        m.get('systemic'), m.get('axial'), m.get('lowerBack'), m.get('perSetSystemic')))
    add('volume: { %s }' % ', '.join('%s: %s' % (g, v) for g, v in sorted(vol.items(), key=lambda kv: -kv[1])))
    add('coverage: { covered: %s, missing: %s, in_band: %s, over: %s, under: %s }' % (
        m.get('groupsCovered'), m.get('groupsMissing'), m.get('groupsInMav'),
        m.get('groupsOverMav'), m.get('groupsUnderMev')))
    add('set_shape: { slots: %s, ones: %s, twos: %s, threes: %s, four_plus: %s, mean: %s }' % (
        ss.get('slots'), ss.get('singletons'), ss.get('twos'), ss.get('threes'),
        ss.get('fourPlus'), ss.get('avgSetsPerSlot')))
    if ranges:
        add('rep_ranges: %s' % ranges)
    if prog:
        add('progression: { handler: %s, slot_rules: %s, distinct_rules: %d }' % (
            r.get('progressionHandler'), str(bool(r.get('declaresSlotRules'))).lower(),
            len({(v['from'], v['advances']) for v in prog.values()})))
    add('variety: { distinct: %s, density: %s, top_share: %s, evenness: %s }' % (
        m.get('distinctExercises'), m.get('varietyDensity'), m.get('topExerciseShare'), m.get('evenness')))
    if m.get('unmapped'):
        add('unmapped_exercises: %s' % m['unmapped'])
    add('```')
    add('')
    return '\n'.join(L)


written = []
for r in FACTS:
    path = 'docs/plans/%s.md' % slug(r['id'])
    io.open(path, 'w', encoding='utf-8', newline='\n').write(render(r))
    written.append((r, path))

I = []
I.append('# Training-plan documentation')
I.append('')
I.append('One file per shipped plan, regenerated from the code by')
I.append('`scripts/gen-plan-docs.py`. The figures are measured from the week the')
I.append('app actually builds, so a plan doc cannot silently drift from its')
I.append('implementation the way the pre-rebuild docs did.')
I.append('')
I.append('Regenerate after changing any plan:')
I.append('')
I.append('```bash')
I.append('npx --yes tsx scripts/dump-plan-facts.ts && python scripts/gen-plan-docs.py')
I.append('```')
I.append('')
I.append('Pre-rebuild docs and the v2 audit notes are kept in')
I.append('[`docs/archive/plans-v2-2026-08/`](../archive/plans-v2-2026-08/).')
I.append('')
I.append('## Plans')
I.append('')
I.append('| Plan | ID | Weeks | Days | Weekly sets | Fatigue | Signature mechanic |')
I.append('|---|---|---:|---:|---:|---:|---|')
for r, path in written:
    pf = r.get('portfolio') or {}
    m = r.get('metrics') or {}
    card = r.get('card') or {}
    name = card.get('name') or r['id']
    weeks = pf.get('weeks') or r.get('weeksInProgram') or ''
    freq = '/'.join(str(f) for f in (pf.get('frequency') or [])) or str(m.get('days', ''))
    I.append('| [%s](%s) | `%s` | %s | %s | %s | %s | %s |' % (
        name, os.path.basename(path), r['id'], weeks, freq, m.get('totalSets'),
        pf.get('fatigue', ''), esc(pf.get('signatureMechanic', ''))))
I.append('')
I.append('## Reference')
I.append('')
I.append('- [Apex Predator assessment guide](apex-assessment-guide.md)')
I.append('- [Implementation specs](specs/)')
I.append('- [Master expansion roadmap](../roadmap/master-expansion.md)')
I.append('- [PerformanceProfile architecture](../architecture/performance-profile.md)')
I.append('')
io.open('docs/plans/INDEX.md', 'w', encoding='utf-8', newline='\n').write('\n'.join(I))
print('wrote %d plan docs + INDEX.md' % len(written))
