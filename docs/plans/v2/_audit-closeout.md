# Audit close-out (2026-08-16)

Index for the finished audit **plus** the post-audit rebuild and variety votes.
Does **not** authorize code. PROC-1 still holds: one implementation pass when
the owner opens it.

| Phase | Status | Where |
|---|---|---|
| Waves 0–7 live/doc audit (36 plans + Ghost) | Complete 2026-08-15 | Per-plan `docs/plans/v2/*.md`; TECHNICAL T-1…T-82 in `_audit-decisions.md` |
| Cross-plan synthesis | Complete 2026-08-15 | `_end-of-audit-synthesis-report.md` |
| Rebuild research (seven levers) | Complete 2026-08-15 | `_rebuild-research.md` |
| Per-plan identity / frequency / progression / tempo votes (`*-RB-*`) | Complete 2026-08-16 | `_effectiveness-questions.md` |
| Catalog XR rules + variety swaps (`*-V-*`) | Complete 2026-08-16 (Iron Clock parked) | This file + `_effectiveness-questions.md` |
| Implementation | **Not started** | Owner must open PROC-1 |

---

## 1. How to read the packet

1. **Wiring / live defects:** `_end-of-audit-synthesis-report.md` then the plan’s v2 doc. Ids `T-n`.
2. **What the plan is supposed to be after rebuild:** that plan’s `*-RB-*` table in `_effectiveness-questions.md`.
3. **What to put in the slots:** catalog rules below, then that plan’s `*-V-*` rows. Shipped `PLAN_REGISTRY` templates often still show the pre-vote wallpaper.
4. **Process / vote log:** `_audit-decisions.md`.
5. **Session resume:** `_audit-status.md` (points here).

Wave 1 PL exercise questions (`KOS-X*`, PG/TRI/RIT E-ids) still stand; variety rows refine them, they do not wipe them.

---

## 2. Catalog rules (apply unless a plan vote overrides)

| Id | Rule |
|---|---|
| **XR-calf** | Standing DB/KB calf → hack-calf when strong. **Never seated.** All plans; only volume differs. Stop per-plan calf questions. |
| **XR-front** | Any front-squat **slot** is a picker: `front-squat` / `safety-bar-squat` / `stiletto-squat`. |
| **XR-mix tri** | Even overhead vs other (pressdown / skull / dip / close-grip). |
| **XR-mix pec** | Upper bias; lower as variation (`pec-deck`, dip, `low-to-high-cable-fly`). **Does not apply** to Bench Domination, Immaculate (Poliquin), or P&G accessories except what those SKUs voted. |
| **XR-mix ham** | Even short (seated curl) / long (lying, Nordic, GHR, hinge). Hip-supported DL and `supported-stiff-legged-dumbbell-deadlift` are the **same movement** — merge ids, fix tempo (3–4s ecc). Beginner stretch; sprinkle later, not the advanced main. **Gravity** keeps hip-supp as the hinge and adds GHR/Nordic as progression. |
| **XR-trapLower** | Sprinkle if space; else a back slot that hits it. **Skip Y-raise** on Ritual / OHP unless asked. Trinary **did** vote Y-raise on accessory. |
| **XR-H/V** | Need a true horizontal **and** a true vertical. `hammer-upper-row` ≈ **pulldown**, not a row. |
| **XR-core** | Cable crunch is the flexion mainstay; wheel allowed. Pencilneck **keeps wheel**; machine crunch is the hanging-raise option. |
| **XR-pool** | No tiny-pool cap. Suggest effective movements if they fit the plan. |
| **XR-holes** | Sprinkle on low volume or swap off overload. High-week plans substitute, they do not stack — **except** Chimera voted **add** core on top. |
| **Adventure pairs** | New pairs = **one free weight + one machine/cable**. Drop all pull-through. |
| **Scapular (KOS-X11)** | Teres major, mid/lower trap, rhomboids, supraspinatus rank with lats in volume reviews. |

---

## 3. Variety votes by plan

Shipped code **lags** these maps. Identity engines (access slots, Poliquin ratios, ten-set days, Adventure generator) stay unless a row says otherwise.

| Plan | Variety (implement this) |
|---|---|
| **Bench Domination** | PL pec-mix N/A. Core: keep one dragon flag; other slot **cable crunch** (sub, don’t add). |
| **Pencilneck** | Keep pec (incline/flat/pec-deck) and OH + close-grip tri. **Keep ab wheel**; hanging raise optional → **machine crunch**. XR-calf. |
| **Skeleton** | Supported SLDL **is** hip-supp (merge ids, fix tempo). **Plank only.** Leave push-ups; don’t complicate delts. |
| **Peachy** | Keep pec/ham. **Two sessions × 2 sets core** (movements **TBD**). |
| **Pain & Glory** | Paused bench for chest variety; Thu OHP → rear delt. No direct tri. Keep hang+plank. Nordics default; GHR/lying curl options (not on 10×6 days). Keep SL hip thrust. |
| **Trinary** | Acc: 2+2 tri OH/pressdown-skull; Y-raise (not shoulder press); CS cable row; keep curls; machine/BB hip thrust; 2 sets crunch/wheel rotate. ME/DE/RE untouched. |
| **Ritual** | CS cable + SA DB row; both tri types; hip thrust + **SL glute leg press option** (id missing — closest `high-foot-leg-press`); keep curls; add cable crunch; **skip Y**. |
| **King of the Squat** | X1–X20 stand. Even tri mix on bench-day slot. Core picker: hanging knee + plank + wheel + machine crunch. Fri XR-calf. Merge hip-supp/SLDL. |
| **Tenfold** | Ham 10×10 list: seated/lying curl + DB RDL. Keep hammer-upper as **vertical** acc. Tri mix. Keep crunch+wheel. |
| **OHP Dominion** | Some military → incline DB / `30-smith-incline-bench-press`. Tri mix. `hammer-upper-row` → `single-arm-dumbbell-row`. Laterals stay. |
| **Arms Race** | Point Tue “overhead” at `overhead-tricep-extension`. **Keep** hammer-upper (vertical). Smith incline + pec-deck. Keep legs. |
| **Foundry** | Mon row → `rope-cable-row`. Tri mix. Core picker. Leave double seated curl. Ham picker stands. |
| **Workhorse** | Hammer-upper → `dumbbell-seal-row`. Tri mix. Incline DB + hammer chest + pec-deck. Core picker. Keep military. |
| **Gravity** | Keep hip-supp; **GHR/Nordic as progression**. BW house — no cable/DB pec/tri mandate. **BW abs picker**. Pull-up (overhand) focused (code may still say chin). |
| **Purgatorio** | **Leave** — voted pair map stands (compound+iso, relocatable, lower never two machines). |
| **Immaculate** | **Leave** — Poliquin selection stands. |
| **Neural** | Hammer-upper → `barbell-row`. Tri mix. Drop hammer chest; add `low-to-high-cable-fly`. −1 hip-supp set → lowest-volume muscle. |
| **Super Mutant** | Leave back/ham/delt/push-up fin. Rotate abs crunch/wheel. Standing calf. Engine/writes first. |
| **Adventure** | Drop all pull-through. New pairs FW+cable/machine. Add machine crunch + side hanging knee raise ids. Leave calf portal. Remap adds: incline DB+seated cable row; Kas+cable crunch; Y-raise+hack-calf or SL cable calf; DB hammer curl+lying curl. |
| **House of Iron** | Home only. Optional chin bar → pull-up/chin. Real abs picker. Standing DB calf. |
| **Apex Predator** | Access slots **stay**. Flat DB → incline DB; keep hammer chest. Tri mix from laterals/ext. Abs picker **and** suitcase. Hack → goblet → high-bar picker. |
| **Venus Rising** | Hack → goblet → high-bar picker. Hanging knee + plank rotate. Leave RDL. Priorities **add volume** on the same five ids (must actually change 4-day — VEN-RB-I). |
| **Athena** | Tri mix. Crunch/wheel rotate. Keep flat BB family default. Keep hack; **add leg-press** to squat family. |
| **Kali** | Earth hack → **high-bar**. Hunt hammer chest → incline DB. Tri mix. Crunch/wheel. Leave ham. Paused bench stays Rebirth. |
| **REDLINE** | Pressure hack → **leg-press**. Afterburn RDL → trap-bar. Both hammer chests → `deficit-push-up` (progression: **feet-elevated**, new id). Tri mix. Furnace already has a deficit-PU **finisher** — retarget that finisher. **Abs not voted** (two wheels). Hip-supp stays. |
| **Iron Clock** | **Parked / retire for now.** Dedicated selection pass later. Ladder + 3-day-default RB votes still stand when it returns. Do not hide from catalog until PROC-1 unless asked. |
| **The Minimum** | Keep A hack. A RDL → hip-supp. B hammer → `30-smith-incline-bench-press`. Tri mix. Abs stay wheel + hanging knee. |
| **Lazarus** | RDL → hip-supp (stable Memory Curve id after swap). Hammer → **dip / pec-deck picker**. Tri mix. Hack → goblet → high-bar picker. |
| **Quadfather** | Load picker **adds high-bar + leg-press** (hack default + BB/stiletto stay). Maintain hammer → **`dip`**. Tri mix + crunch/wheel. Leave ham. Don’t add quad. |
| **Cathedral** | Crypt hack → leg-press. Keep Spire flat DB. Tri mix (dips stay). **Crunch only.** Arches stand. |
| **Blackout** | Day I hack → LP; Day II LP → **hack**. Paused bench → hammer chest. Tri mix. +1 cable crunch. **Drop RDL**; seated + lying curls only. |
| **Monolith** | No incline (hammer + pec-deck only). Add cable crunch. Leave curls (no hip-supp). Rest of MON-V stands: drop hack/laterals/BSS/SL thrust; machine dip + overhead mix; LP+ext only; Full = light leftovers. XR-calf supersedes the old “no hack-calf” line. Default 3-day U/L/Full. |
| **Atlas** | Tri mix. **Leave** wheel + carries. Leave flat DB. No G1 dip (G2 already has dip). XR-front on G2 front squat. |
| **Event Horizon** | Keep hammer chest. Tri 2+2 mix. Crunch/wheel. Lower squat slots: **hack / LP picker**. |
| **Chimera** | Keep hammer chest. Tri mix. **Add** core on top (`cable-crunch`). Keep BB squat. Leave ham. Trap-bar hinge house stays. |
| **Oracle** | Keep hammer chest. Tri mix. Crunch/wheel. Lower B: **hack / LP picker**. Unique compounds for AI 3–5 stay distinct (flat BB vs incline vs squat vs hack/LP). |
| **Ghost** | Do **not** ship a 37th plan this pass. |

---

## 4. Library / naming work at implement time

**Add ids**

- Machine crunch
- Side hanging knee raise
- Feet-elevated push-up (REDLINE deficit-PU progression)
- Dedicated chest-supported **cable** row (today: `seated-cable-row` / seal / dual-cable high row)
- SL glute leg press (Ritual option; closest `high-foot-leg-press`)

**Merge / alias**

- `hip-supported-db-deadlift` = `supported-stiff-legged-dumbbell-deadlift` (tempo 3–4s ecc)

**Note in tips / selection**

- `hammer-upper-row` is vertical (pulldown-like), not a row
- `dip` vs `bodyweight-dip` vs `weighted-dip` — pick one family and progress

Attribution-map §25 bugs (`reverse-nordic-curl` as quad, etc.) and duplicate merges remain analysis-only until PROC-4 / the implementation pass.

---

## 5. Leftovers (not blocking PROC-1, but unresolved)

| Item | Notes |
|---|---|
| **REDLINE abs** | Never voted. Ships two ab-wheel slots. |
| **Peachy core movements** | Two 2-set sessions placed; crunch vs machine vs wheel **TBD**. |
| **Iron Clock selection** | Parked. Hide-from-catalog is a PROC-1 product call. |
| **MON-V-calf wording** | Early “standing only, no hack-calf” vs later XR-calf. **Use XR-calf.** |
| **Chimera core movement** | Logged as add `cable-crunch`; owner did not pick rotate. |
| **PROC-2…5** | Still PARKED (blueprint extras, shared primitives, library hygiene PR split, P&G live retest). |
| **Write-path / T-9 / reset allowlist** | Technical; first in any implementation pass. Not re-voted. |

---

## 6. Implementation pass (when opened)

Suggested order (not a vote):

1. Shared integrity: Firestore write path, `dashboardViewWeek`+programId, `resetProgram()` from registry, T-23 system weight, `liftHistory` write.
2. Library: merges, attribution bugs, new ids above.
3. Catalog XR (calf, front-squat picker, hip-supp alias) once, then per-plan `*-V-*` + `*-RB-*`.
4. Dead headline mechanics (density ladder, recovery check, Memory Curve, Apex save, Super Mutant writes, EH swaps, Chimera reallocation, Oracle scoring, …) per each plan’s `*-RB-I`.
5. Iron Clock: either hide or a dedicated selection pass **before** wiring the ladder onto the current template.

---

## 7. File map

| File | Role |
|---|---|
| `_audit-closeout.md` | This index |
| `_audit-status.md` | Resume / live-test context / standing watch-list |
| `_audit-decisions.md` | PROC, AUDIT, TECHNICAL, vote log |
| `_effectiveness-questions.md` | Owner answers by id |
| `_end-of-audit-synthesis-report.md` | Cross-plan defect themes |
| `_rebuild-research.md` | Lever research that seeded RB questions |
| `_wave6-advanced-plans-roadmap.md` | Chimera / Oracle / Immaculate / Apex effort |
| `_comparison-wave1-powerlifting.md` | Wave 1 only (AUDIT-4: no later comparison files) |
| `docs/analysis/exercise-attribution-map.md` | Volume math + library bugs |
| `docs/plans/v2/<plan>.md` | Per-plan audit (findings still valid; exercise lists may be pre-vote) |
