# Product

## Register

product

## Users

The owner and a small circle of friends/training clients (Polish and English speakers). They open the app **mid-workout, on a phone, in a gym** — sweaty hands, bright overhead light, between sets. Secondary context: at home on desktop, reviewing progress and picking the next program.

## Product Purpose

A workout execution engine for 8 self-authored training programs (Bench Domination, Pencilneck Eradication, Skeleton→Threat, Peachy, Pain & Glory, Trinary, Ritual of Strength, Super Mutant). It auto-calculates working weights from 1RMs/AMRAPs, tracks progression rules per program, and logs every set. Success = the lifter never has to do math or remember a rule at the gym; the app tells them exactly what to lift today.

## Brand Personality

Brutal, irreverent, disciplined. A heavy-metal strength coach: the copy trash-talks ("Eradicate the weakness", "Rest or Perish") but the numbers are dead serious. Each program is its own themed world (Fallout wasteland, cult ritual, gladiator arena, peach-pink) living inside one consistent, rock-solid system.

## Anti-references

- Generic AI/SaaS dashboard slop: gradient text everywhere, `animate-pulse` on headings, emoji-as-icons (⛧ 🔥 ☢️ scattered inline), identical stat-card grids.
- Corporate fitness apps (Fitbod/Apple Fitness pastel-friendly minimalism) — too polite for this voice.
- Anything that sacrifices mid-set legibility for decoration.

## Design Principles

1. **Numbers are the hero.** Weight and reps are the content; they get the largest type, tabular figures, highest contrast. Decoration never competes with the target weight.
2. **Glanceable under a barbell.** Big touch targets (≥44px), one-thumb reach, state readable from a meter away (done/pending/AMRAP).
3. **One system, eight skins.** Themes are token swaps (CSS variables), never per-page style forks. Structure, spacing, and components are identical across programs.
4. **Menace through restraint.** The brutal personality comes from typography, copy, and one committed accent per theme — not from pulsing gradients and emoji.
5. **Trust the log.** Anything saved must look saved; destructive actions look dangerous; auto-calculated values are visually distinct from user-entered ones.

## Accessibility & Inclusion

- Body text ≥4.5:1 contrast in every theme (dark and light themes both).
- Full `prefers-reduced-motion` support; no meaning carried by motion alone.
- Bilingual EN/PL — labels must survive ~20% longer Polish strings without truncation.
