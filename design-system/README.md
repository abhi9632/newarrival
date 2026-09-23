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
| /timeline (obligation timeline) | yes | yes | yes | Claude |
| /timeline (perturbation cascade, settled) | yes | yes | yes | Claude |

---

### Obligation timeline

Checked against `docs/visual-gate/03-timeline-375.png` and `03-timeline-1280.png`, captured
with Playwright against a local production build (`next build && next start -p 3100`); the
live Vercel URL is still blocked pending the GitHub App authorisation in `HANDOFF.md`. Two
gate iterations: the first pass had "Standing condition" printed twice per standing card
(once in the status pill, once again as body text), fixed by dropping the redundant line
so the pill is the only place that label appears.

1. **Matches the Art direction, specifically the Signature?** Yes. The terracotta vertical
   rail with ticked dots beside the dated obligations is the recorded Signature directly,
   now doing its named job as "the obligation timeline's spine." The burnt terracotta
   accent carries the status pills, the rail, the source links and the preset buttons; the
   background stays ink on eucalyptus-washed bone; headings run in Space Grotesk, body and
   card copy in IBM Plex Sans.
2. **Could this be any other team's project with the logo swapped?** No. The combination of
   the dated rail, the terracotta status pills and the warm cream palette is specific to
   this concept; nothing on screen is a stock Tailwind or shadcn card grid on white.
3. **Would this pass as a paying client's shipped deliverable?** Yes. Typography hierarchy,
   spacing and the status colour system read as finished. The native select and date
   controls render with the browser's own chrome rather than a custom skin; that is the
   scope's explicit choice (native elements, zero new dependencies), not an oversight.
4. **At 375, reachable, legible, does the dated axis survive?** Yes. Every control stacks to
   full width and stays reachable, every card is legible with no clipped text, and the rail
   with its dated ticks survives the narrow viewport without collapsing or overlapping.

---

### Perturbation cascade

Assumption: PASS 2026-09-23

Checked against `docs/visual-gate/04-cascade-375.png` and `04-cascade-1280.png`, captured
with Playwright against a local production build (`next build && next start -p 3100`); the
live Vercel URL is still blocked pending the GitHub App authorisation in `HANDOFF.md`. Priya's
profile, course end date dragged three months earlier and released.

1. **The assumption.** Does the cascade read as a single legible event rather than visual
   noise? Yes. Every changed card carries a short, plainly worded marker directly under its
   date line ("Moved minus 92 days, was May 27, 2028" or "Runs until August 26, 2027"), so the
   change is legible from the text alone even without watching the motion happen. At 375 the
   cards stack to one column and the markers stay attached to the date they annotate rather
   than floating loose.
2. **The holds.** In the settled 375 screenshot, can you tell which obligations did not
   change? Yes. Every one of the 9 held cards carries "Held, this date does not move" in the
   same position the movers carry their marker, so the absence of change is a stated fact
   rather than an absence of information. The summary line above the rail ("3 obligations
   moved, across 4 agencies") gives the same claim as one on-stage sentence.
3. **The Signature.** Does this screen still match the Art direction block? Yes. The terracotta
   dated rail from the timeline is unchanged and still carries the Signature; the new rail
   control and its markers use the same accent and muted tokens, no new colour was introduced.
   Could this be any other team's project with the logo swapped? No, same reasoning as the
   Phase 3 entry.
4. **The client bar.** Would this pass as a paying client's shipped deliverable? Yes. The
   native range control renders with browser chrome by design (zero new dependency), the
   reset control disables itself correctly at the baseline, and no marker text reads as
   internal debug output.

Reduced motion verified separately: with `prefers-reduced-motion: reduce` forced via Playwright,
the same drag produces the same state, summary line and 12 markers with no difference in
outcome, only the animation is absent, confirmed by reading the DOM after the commit rather
than by eye.

Repeatability verified: pressed reset (slider back to 0, readout back to the original date,
0 markers, reset button disabled again), then ran the same drag a second time with no page
reload; it produced the identical 3 moved, 4 agencies result.

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
