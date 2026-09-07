# Design System

> **Status: not yet filled.**
> The T1 owner fills this at the end of T1, before any V1 UI work begins.
> Until this file is complete, no builder should write UI code.

---

## Art direction -- FILL THIS FIRST, BEFORE TOKENS

Tokens are not a design. A project can have a perfect token file and still ship a
generic layout. This block is what stops that, and it is what every later builder
reads to keep separate sessions producing one site instead of five.

Filled during Rule 0 by the T1 owner, using ONE design authority skill.
See `rules/frontend-design.md`.

**Signature** -- the one element a judge remembers after 30 demos. Concrete, not abstract.
<!-- e.g. "the capacity dial that resizes the task board live as you drag it" -->
<!-- NOT "bold, modern and clean" -->

**Reference** -- one named real-world visual reference, and what specifically is taken from it.
<!-- e.g. "Linear's changelog: the hairline rules and the 2-column measure, not its palette" -->

**Anti-reference** -- the specific default look this must not resemble.
<!-- e.g. "stock shadcn card grid, white page, blue primary, 3 feature columns" -->

**Type stance** -- display face, body face, and why this pairing for this subject.
<!-- e.g. "Bricolage Grotesque display / Instrument Sans body: warm grotesque, not corporate Inter" -->

**Colour world** -- the world in one line, not a hex list.
<!-- e.g. "deep green and sunflower yellow on a sage canvas, taken from the charity's own brand" -->
<!-- Safe blue/purple SaaS is a rejected default, not a baseline. -->

**Motion stance** -- where motion is allowed. Demo-path screens only; everywhere else plain.

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

<!-- Where is the shared token CSS file? e.g. src/styles/tokens.css -->
<!-- Where is the shared mock data? e.g. src/data/mockData.ts -->
<!-- Where is the AppShell / layout wrapper? e.g. src/components/AppShell.tsx -->
<!-- Where is the router entry? e.g. src/App.tsx -->

---

## Do not duplicate

- Never redefine tokens in a feature component file. Import from the shared token file.
- Never create a second mock data file. Add to the shared one.
- Never create a second AppShell. Compose inside it.
