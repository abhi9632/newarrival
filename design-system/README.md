# Design System

## Art direction

Authority: design-taste-frontend (single authority pass, per docs/CONCEPT.md Design authority)
Signature: the vertical dated rail beside the three-step strip, ticked in terracotta, that becomes the obligation timeline's spine when the Perturbation cascades in Phase 4
Reference: the London Underground line diagram, taken for its tick rhythm and one confident route line, not its geography or its colour scheme
Anti-reference: a centered blue or purple SaaS hero with a gradient blob, three equal icon-feature cards, and a stock Tailwind or shadcn card grid on white
Type stance: Space Grotesk display for civic geometric warmth rather than corporate Inter, paired with IBM Plex Sans body for institutional clarity at small disclaimer sizes
Colour world: ink on eucalyptus-washed bone, one burnt terracotta accent carrying the rail and the call to action, never blue or purple
Motion stance: restrained here, one hover, press and focus cycle on the single anchor; full reflow motion is reserved for the Perturbation in Phase 4

---

## Visual gate log

Every UI task records its gate pass here (see `rules/frontend-design.md`).
One line per screen. If a screen has no line, that screen is not done.

| Screen | 375 checked | 1280 checked | Matches signature? | By |
|---|---|---|---|---|

---

## How to fill this file (planner / T1 owner)

After Rule 0 runs and design tokens are agreed, document the following sections here and commit.

---

## Colour tokens

<!-- List every CSS custom property name and its value. Example:
--color-primary: #01696f
--color-bg: #f7f6f2
--color-text: #28251d
--color-surface: #f9f8f5
--color-border: oklch(from var(--color-text) l c h / 0.12)
--color-accent: ...
--color-error: ...
--color-success: ...
--color-warning: ...
--radius-sm / --radius-md / --radius-lg / --radius-full
--shadow-sm / --shadow-md / --shadow-lg
--transition-interactive
--font-display: 'FontName', fallback, serif
--font-body: 'FontName', fallback, sans-serif
--text-xs through --text-hero (clamp values)
--space-1 through --space-32
--content-narrow / --content-default / --content-wide
-->

---

## Typography

<!-- Display font name, body font name, CDN load link, weight variants used -->

---

## Component conventions

<!-- Button variants (primary / secondary / ghost), card surface level, input style, badge/chip, divider style -->

---

## File locations

Shared token CSS file: `src/app/globals.css`
Route entry: `src/app/page.tsx`

<!-- Where is the shared mock data? e.g. src/data/mockData.ts -->
<!-- Where is the AppShell / layout wrapper? e.g. src/components/AppShell.tsx -->

---

## Do not duplicate

- Never redefine tokens in a feature component file. Import from the shared token file.
- Never create a second mock data file. Add to the shared one.
- Never create a second AppShell. Compose inside it.
