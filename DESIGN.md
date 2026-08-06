---
name: Hyperplanner
description: A premium pit-wall instrument system for focused workout execution.
colors:
  steel-black: "hsl(222 47% 6%)"
  graphite-panel: "hsl(222 44% 8%)"
  telemetry-white: "hsl(210 40% 98%)"
  signal-blue: "hsl(217 91% 60%)"
  muted-steel: "hsl(215 20% 70%)"
  warning-red: "hsl(0 72% 45%)"
typography:
  display:
    fontFamily: "Saira Semi Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 8vw, 5.5rem)"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Source Sans 3, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Source Sans 3, Arial, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  input: "6px"
  control: "8px"
  panel: "12px"
  command: "14px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.steel-black}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
    height: "44px"
  input:
    backgroundColor: "{colors.steel-black}"
    textColor: "{colors.telemetry-white}"
    typography: "{typography.body}"
    rounded: "{rounded.input}"
    padding: "8px 12px"
    height: "44px"
  panel:
    backgroundColor: "{colors.graphite-panel}"
    textColor: "{colors.telemetry-white}"
    rounded: "{rounded.panel}"
    padding: "24px"
---

# Design System: Hyperplanner

## Overview

**Creative North Star: "Pit-Wall Instrument"**

Hyperplanner should feel like a precise, premium command surface used during a live performance event: dark machined materials, dense but ordered telemetry, and decisive controls. It is technical without becoming sterile and energetic without decorative noise. Each workout plan may change the signal color, while the graphite structure, typography, geometry, and interaction hierarchy remain stable.

The interface prioritizes the next physical action. Session names, working load, reps, progress, and the primary command dominate; supporting detail recedes into measured sectors.

**Key Characteristics:**

- Machined graphite surfaces with restrained billet highlights.
- Condensed uppercase display type and tabular measurement values.
- Chamfered silhouettes, hairline rules, and high-contrast signal accents.
- One dominant command per operational surface.

## Colors

The neutral chassis is invariant; a plan's theme supplies the signal color through the shared primary token.

### Primary

- **Signal Accent:** Identifies active navigation, progress, focus, and the single primary command. Its hue changes by plan.

### Neutral

- **Steel Black:** The application chassis and page background.
- **Graphite Panel:** Operational cards and command surfaces.
- **Telemetry White:** Critical labels, headings, and live measurements.
- **Muted Steel:** Supporting labels, metadata, and inactive readings.

### Named Rules

**The Signal Channel Rule.** Plan identity changes the accent channel, never the underlying chassis or information hierarchy.

**The Scarcity Rule.** Reserve full-strength primary color for progress, active state, and the most important action.

## Typography

**Display Font:** Saira Semi Condensed (with Arial Narrow fallback)
**Body Font:** Source Sans 3 (with Arial fallback)
**Label Font:** Source Sans 3

**Character:** Lightly condensed headings retain the timing-board silhouette without relying on brute weight. Source Sans 3 keeps instructions and longer Polish strings open and legible.

### Hierarchy

- **Display** (500, fluid, 0.94 line-height): Workout names and live exercise identity.
- **Title** (500–600, semi-condensed): Cards, sectors, and navigation groups.
- **Body** (400–500, 1rem): Instructions and supporting content.
- **Label** (600, tracked uppercase): Telemetry labels, modes, counters, and statuses.

### Named Rules

**The Readout Rule.** Loads, reps, percentages, timers, and counters use tabular numerals and must visually outrank their units.

## Layout

Desktop uses a persistent protocol rail and a wide operational canvas. Dashboard and workout screens begin with one dominant command module, followed by smaller telemetry sectors. At 900px the live-set console becomes a split instrument; below that it stacks. Mobile uses a compact top rail and a safe-area-aware bottom command dock. Spacing follows an 8px-based rhythm with denser internal measurement grids and more generous separation between operational groups.

## Elevation & Depth

Depth is structural: tonal layering, borders, inset rules, and subtle material texture do most of the work. Large command modules may use a broad low-contrast shadow; ordinary cards remain visually close to the chassis. Graphite texture is a low-opacity soft-light layer, never a foreground illustration.

### Shadow Vocabulary

- **Command Depth** (`0 20px 48px hsl(var(--background) / .4)`): Dashboard and live-set command surfaces only.
- **Panel Depth** (`0 14px 34px hsl(var(--background) / .24)`): Reusable instrument panels.

### Named Rules

**The Structural Depth Rule.** Use borders and tonal layers before adding shadow; shadow signals operational priority.

## Shapes

Panels use clipped 12–14px chamfers with a restrained rounded edge and an inset technical rule. Controls use smaller 6–8px corners and clipped diagonal corners. Circular pills and soft consumer-app bubbles do not belong in primary workflows.

## Components

### Buttons

- **Shape:** Compact 8px control radius with chamfered opposing corners.
- **Primary:** Plan signal background, dark foreground, uppercase tracked label, and a minimum 44px target.
- **Hover / Focus:** Controlled color shift and a visible signal-color focus halo; active state moves down by 1px.
- **Secondary / Ghost:** Tonal or transparent until interaction, preserving the primary command's dominance.

### Cards / Containers

- **Corner Style:** 12px panel radius with clipped corners and inset rule.
- **Background:** Graphite panel over the steel-black chassis.
- **Shadow Strategy:** Low panel depth; stronger only for command surfaces.
- **Border:** One-pixel theme-aware technical rule.
- **Internal Padding:** Typically 24px, reduced on dense measurement sectors.

### Inputs / Fields

- **Style:** Dark vertical gradient, 6px corners, one-pixel input border, semibold tabular values.
- **Focus:** Two-pixel plan-signal ring with offset.
- **Disabled:** Reduced opacity while retaining readable structure.

### Navigation

Desktop navigation is a left protocol rail; mobile navigation becomes a bottom command dock. Active items gain a signal-colored border and label, while inactive controls stay neutral. Labels remain uppercase and iconography must come from the shared vector icon system.

### Live Set Console

The live console owns the workout's strongest hierarchy: exercise identity, progress meter, oversized load and reps, conditional RPE/rest telemetry, set count, and one `LOG SET` transition. It must not invent RPE when a plan does not prescribe it.

## Do's and Don'ts

### Do:

- **Do** preserve each plan's primary accent through shared semantic tokens.
- **Do** make the next workout action visually unmistakable.
- **Do** use uppercase tracked micro-labels for machine-like telemetry.
- **Do** honor reduced-motion preferences and 44px minimum interactive targets.

### Don't:

- **Don't** use emoji as interface icons or status decoration.
- **Don't** introduce gradients, glows, or textures without an operational role.
- **Don't** display an RPE target when the plan has none.
- **Don't** let secondary cards compete with the dashboard or live-set command surface.
