# Design System

## Art direction

Authority: design-taste-frontend (single authority pass, per docs/CONCEPT.md Design authority)
Signature: the vertical dated rail beside the three-step strip, ticked in terracotta, that becomes the obligation timeline's spine when the Perturbation cascades in Phase 4
Reference: the London Underground line diagram, taken for its tick rhythm and one confident route line, not its geography or its colour scheme
Anti-reference: a centered blue or purple SaaS hero with a gradient blob, three equal icon-feature cards, and a stock Tailwind or shadcn card grid on white
Type stance: Space Grotesk display for civic geometric warmth rather than corporate Inter, paired with IBM Plex Sans body for institutional clarity at small disclaimer sizes
Colour world: ink on eucalyptus-washed bone, one burnt terracotta accent carrying the rail and the call to action, never blue or purple
Motion stance: CSS only, one easing family (--ease-out for entrances, --ease-in-out for on-screen morphs). Landing: the route diagram draws on load and re-routes on fact switches; timeline: the Perturbation cascade. Everything else stays still
Haptic map: landing route scrubber, `tick` when the pointer crosses a visible station or year mark (`src/components/LiveRoute.tsx` `scrubTo`); landing fact pill and `/timeline` fact switch, `tap` on every change (`switchFact`, `FactSwitch`); `/timeline` course-end-date slider, `tick` per step (`WhatIfRail` `handleChange`); its reset button, `success`; the easter egg firing, `success`. Every event falls back to a 140ms scale pulse (`src/lib/pressPulse.ts`) when `haptic()` returns false on a coarse pointer; toggle taps rely on the existing `.affordance` press-scale instead of a separate pulse
Easter egg: trigger is dragging the `/timeline` course-end-date slider (`WhatIfRail`) all the way to its maximum, 12 months out. The reward lives on the dated timeline's own rail, not in a separate box: a marker appears at the foot of the rail in the same stroke, dot and pl-6 indent as every dated obligation above it, reading "Priya graduates. Every dated obligation above resettles around this day." (`src/app/timeline/page.tsx` `atGraduation`, draft offset lifted from `WhatIfRail` via `onDraftChange`). Fires a success haptic once, is reversible by dragging back or pressing Escape, is keyboard reachable because the trigger is the slider itself, is announced through a visually-hidden `aria-live` region next to the slider control, and the marker's reveal is a `fade-up` which is a still no-animation state under reduced motion. It fits because the whole concept is a dated line from arrival; this is that same line reaching its natural end, not a bolted-on reward. A console message in the product's voice fires once on every page load for anyone opening DevTools (`src/components/ConsoleEasterEgg.tsx`)
Concept: This is about the four facts that decide an arrival's obligations; it feels like a transit map because every obligation is a stop on a dated line from arrival
Signature moment spec (landing, marketing / explanatory, exempt from the 300ms UI cap):
- Trigger: page load, then any fact pill switch (visa, citizenship, state)
- Phases: lines draw left to right 900ms, lanes 90ms apart; each station pops 260ms as the line passes it; labels fade 320ms after. Switch: stations leave 150ms / arrive 220ms, spans re-scale 280ms, standing conditions fade 240ms
- Input: three two-way radio pills; the readout line names what fell away, appeared and held
- Fallback: server-rendered static diagram, no JS needed to read it
- Mobile: same diagram, labels narrowed, span captions dropped (listed beside each lane instead); Visa rail above the fold at 375
- Reduced motion: no draw or pop; stations and text cross-fade at 150ms, state is identical
- First 3 seconds at 1280: four terracotta lines drawing across a dated axis beside the headline

### Awwwards pass (2026-09-23, awwwards as the craft authority over the locked D1 system)

Register: civic editorial, kinetic. Palette and type pair unchanged; scale, rhythm and motion rebuilt.
One signature, three inputs. The route is the only idea; everything else stays quieter.
- Load: headline lines rise out of a mask (anchor), the route draws (support), labels resolve (detail).
- Pointer: a hairline scrubber follows the pointer across the diagram, reading out the date under it
  and filling every station it has passed. Touch: drag on the diagram, vertical scroll stays native.
- Scroll: "Ride the line", a sticky scene (not a hijack, native scrollbar) where scroll is time: a
  giant date ticks from arrival to the last stop, a terracotta head travels the line, each stop
  lights and its card slides in. Progress signal: "Stop n of 5" plus the line itself.
- Reduced motion: no mask rise, no scrub, no sticky ride; the ride renders as a static dated list.
- Supporting craft (quiet): page progress as a terracotta route line in the sticky header, one
  view-driven reveal (24px, once, groups only, content visible without support), link underlines
  that sweep, arrow nudges, agency rows that draw a terracotta rule on hover, an ink closing band.
Motion tokens: --dur-fast 180ms, --dur-base 400ms, --dur-slow 900ms; --ease-out expo-style,
--ease-in-out for travel. One family.

---

## Visual gate log

Every UI task records its gate pass here (see `rules/frontend-design.md`).
One line per screen. If a screen has no line, that screen is not done.

| Screen | 375 checked | 1280 checked | Matches signature? | By |
|---|---|---|---|---|
| /timeline (obligation timeline) | yes | yes | yes | Claude |
| /timeline (perturbation cascade, settled) | yes | yes | yes | Claude |
| Intro moment (05-intro) | yes | yes | yes | Claude |
| Four fact intake (05-intake) | yes | yes | yes | Claude |
| Derived timeline (05-timeline) | yes | yes | yes | Claude |
| Cascade mid pass (05-cascade-mid) | yes | yes | yes | Claude |
| Cascade settled (05-cascade-settled) | yes | yes | yes | Claude |
| Landing live route (06-landing) | yes | yes | yes | Claude + visual-gate-reviewer PASS (2nd round) |
| Landing, gutters + egg pass (07-landing) | yes | yes | yes | Claude + visual-gate-reviewer PASS (1st round) |
| /timeline, gutters + egg pass (07-timeline) | yes | yes | yes | Claude + visual-gate-reviewer PASS (1st round) |

### Gutter + egg gate pass (2026-09-23)

Routes: `/` and `/timeline`, shot at 375/1280/1440/1920 (`docs/gate/`). visual-gate-reviewer: PASS
on both, 1st round, no re-fix needed. Finder (`rules/craft-and-delight.md` section 3) re-run at
1440 and 1920 on both routes after the fixes: `[]` on all four, plus zero horizontal overflow at
375/1280, zero console errors, zero running animations under forced `prefers-reduced-motion`.
`haptic map: 5 events | egg: drag course-end slider to max offset (or Escape/drag-back to reverse) | gutters: finder clean at 1440 + 1920 | details: 6/10`
Detail list gaps still open: overscroll-behavior (no inner scrollers to apply it to), in-place
save confirmation (no save/submit action exists yet), optional sound toggle (not built), designed
favicon/OG image (tracked in `HANDOFF.md`, not this pass's scope).

## Pipeline state

| Screen | Stage | Last skill run | Next | By |
|---|---|---|---|---|
| Landing (/) | D4 passed | awwwards D0 spec, design-taste-frontend build, emil-design-eng, impeccable detector, visual-gate-reviewer | Awwwards 15-audit perf pass at freeze | Claude |
| /timeline | D4 passed (pre-pipeline) | design-taste-frontend | D3 liveliness pass: intake still native controls | Claude |

---

### 06-landing, Live route diagram (landing)

Screenshots: `06-landing-1280-full.png` (1280x1880 viewport, settled), `06-landing-1280-toggled.png`
(Skilled 482 + Italy, clicks via JS so no hover state), `06-landing-375.png`, `06-landing-375-full.png`,
`06-landing-320.png`. Local production build on port 3100.

1. Signature: yes. The terracotta rail is now the hero. Every lane carries terracotta in every
   profile (solid span for conditions with an end date, thin band for whole-stay conditions).
2. Another team's project? No. Dated transit diagram of real corpus rules, Space Grotesk over Plex.
3. Paying client bar: yes after round 2. Round 1 FAIL (visual-gate-reviewer): bare lanes, faint
   Arrived control, rail below the mobile fold, no Italy-fix evidence. All fixed.
4. Liveliness: signature visible in the first 3 seconds at 1280; hero shows the product computing;
   switches visibly re-route (482 + Italy: "1 fell away, 1 appeared, 9 held").
5. Copy: product copy only; "every one checked on" claim is computed from the corpus dates.
Checks: impeccable detector `[]`; no overflow 320/375/1280/1920; no clipped pill at 320; tap targets
>= 30px; reduced motion: all stations opaque at load, zero running animations; check:rules,
check:engine, check:cascade all OK. Known: at 320x700 the card and axis sit above the fold, the
first line 122px below.

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

### 05-intro, Intro moment

Checked against `docs/visual-gate/05-intro-375.png` and `05-intro-1280.png`, captured with
Playwright against a local production build; the live Vercel URL remains blocked (see
`HANDOFF.md`). Cold load, no stored state.

1. Does this match the Art direction, specifically the Signature? Yes, the burnt terracotta
   primary button and the ink on eucalyptus-washed bone background carry the palette; the rail
   Signature itself belongs to the timeline screen and is not expected here.
2. Could this be any other team's project with the logo swapped? No. The specific claim
   ("Four facts decide every deadline you have in Australia") and the three-step strip are
   particular to this concept, not a generic hero.
3. Would this pass as a paying client's shipped deliverable? Yes. Typography hierarchy and
   spacing read as finished, both calls to action are clear.
4. Every visible string is product copy: the headline, the three-step explainer, the two
   buttons, and the disclaimer. Nothing reads as process narration. At 375, every control is
   reachable and the disclaimer is fully readable at the foot of the page, not clipped.

### 05-intake, Four fact intake

Checked against `docs/visual-gate/05-intake-375.png` and `05-intake-1280.png`, viewport only
(not full page), `/timeline` cold with the student preset pre-selected.

1. Matches the Signature: yes, the terracotta accent carries the pressed preset button and the
   focus rings; the native selects and date inputs render with browser chrome by design.
2. Could this be any other team's project? No, the four named facts (visa subclass,
   citizenship, arrival date, state) and the two named worked examples are specific to this
   product.
3. Paying client bar: yes, labels are clear, spacing is consistent, nothing looks unfinished.
4. All copy is product copy (field labels, preset names). At 375 every control stacks to full
   width and is reachable with no clipping.

### 05-timeline, Derived timeline

Checked against `docs/visual-gate/05-timeline-375.png` and `05-timeline-1280.png`, scrolled to
the dated heading, student preset.

1. Matches the Signature: yes, directly, the terracotta dated rail with ticked dots is the
   recorded Signature doing its named job.
2. Could this be any other team's project? No, same reasoning as the Phase 3 entry this
   extends.
3. Paying client bar: yes.
4. All copy is product copy: status pills, dates, agency names, instrument names, source
   links. At 375 the rail survives the narrow viewport without collapsing.

### 05-cascade-mid, Cascade mid pass

Checked against `docs/visual-gate/05-cascade-mid-375.png` and `05-cascade-mid-1280.png`,
captured immediately on release with no settle wait. At 1280 the file is byte distinct from
the settled capture. At 375 it came back byte identical to the settled capture because the
browser automation round trip exceeded the 720ms settle budget; recorded honestly in
`docs/demo-prep.md` rather than re-shot to force an artificial difference. The state shown in
both is the correct settled diff (3 moved, 4 agencies), which is what this judgement is
against.

1. Matches the Signature: yes, same rail and palette as the settled state.
2. Could this be any other team's project? No.
3. Paying client bar: yes, nothing reads as broken or mid-glitch.
4. All copy is product copy. At 375 every control remains reachable.

### 05-cascade-settled, Cascade settled

Checked against `docs/visual-gate/05-cascade-settled-375.png` and `05-cascade-settled-1280.png`.
This is the same evidence and judgement recorded under `### Perturbation cascade` above,
cross-referenced here under the Phase 5 screen key for `scripts/check-demo.sh` Section 6 to
pair against.

1. Matches the Signature: yes.
2. Could this be any other team's project? No.
3. Paying client bar: yes.
4. All copy is product copy, including the change markers. At 375 the held cards remain
   fully legible, not dimmed to the point of disappearing.

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
