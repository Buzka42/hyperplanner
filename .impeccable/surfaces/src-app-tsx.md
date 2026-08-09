---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/components/ProtectedLayout.tsx","src/pages/Dashboard.tsx","src/pages/WorkoutView.tsx","src/pages/Entry.tsx","src/pages/Settings.tsx","src/pages/WorkoutHistory.tsx"]
---

Scope: Authenticated Hyperplanner application shell and workout execution surfaces.
Mode: Operate.
Audience and job: A lifter using a phone under bright gym lighting must see the current prescription, record a set, and advance without doing program math. Desktop supports program review and configuration.
Primary task: Execute and log the active workout; secondary tasks are choosing the next session, reviewing history, and configuring a plan.
Constraints: Eight program palettes remain semantic token swaps; Peachy remains a high-contrast light skin. EN/PL labels must fit. Touch targets are at least 44px. Existing Firebase and plan behavior remain intact.
Chosen direction: Protocol Sheet (clean luxury), chosen from the three-direction round on branch `ui-overhaul-gym-ux`; sketch `.impeccable/sketches/hypertraining-protocol.png`; handoff spec `docs/protocol-sheet-redesign.md`. Owner bans: Saira Semi Condensed, decorative status copy, oversized type. Program themes carry the flavor; chrome stays neutral.
Memorable moment: The active set expands into a load-and-reps instrument with a vertical session meter and one LOG SET command; the dashboard opens with a billet session-command manifest.
Component grammar: 10–14px chamfered corners, 1px calibrated rules, restrained soft offset depth, Saira Semi Condensed display type at 500–600 weight, Source Sans 3 UI text, tabular measurements, and plan primary color reserved for active state/action.
Implementation inventory: semantic HTML/CSS for layout, controls, rules, chamfers, and motion; Lucide SVG icons; existing program image assets; no decorative raster imagery required.
Unresolved: Firestore security rules and legacy lint debt are outside the visual surface scope.
