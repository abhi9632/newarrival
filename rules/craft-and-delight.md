# rules/craft-and-delight.md -- how it feels, not just how it looks

Loaded at D3 (craft + motion), after `emil-design-eng`, and again at the D4 gate. The
Awwwards floor makes a screen look award-level; this file makes it *feel* hand-made.
Three hard requirements (haptics, one easter egg, contained layout with deliberate full bleed) and a detail list.
None of the design skills enforce these on their own: not taste, not awwwards, not Emil.
That is why they live here.

---

## 1. Haptics -- every meaningful touch answers back

Use `design-system/components/haptics.ts`. One call per event: `haptic("tap")`.

**Where (the haptic map):** toggles and segmented switches, a scrubber or slider crossing
a step or detent, drag start and drop, a scroll-driven mechanism crossing a mark (the
reflekt-design compass ticks once per 10 degrees, sound and buzz off the same crossing),
a successful submit (`success`), a rejected action (`warn`), the easter egg firing.

**Where not:** every button press, hover, scroll with no detent, page load, anything on a
timer. A haptic with no physical cause is noise; people turn the phone over to check it.

**Platform reality (verified 2026-09):**
- Android Chrome / Samsung Internet: `navigator.vibrate(ms | pattern)`. Needs a prior user
  tap on the page (sticky activation). Keep pulses 4 to 16ms; longer reads as a phone call.
- iOS Safari has never shipped the Vibration API. The only native web haptic is the user
  directly tapping an `<input type="checkbox" switch>` (iOS 18+). Script-triggered tricks
  (`label.click()` on a hidden switch) stopped working in iOS 26.5. So: build binary
  toggles on a real `<input type="checkbox" switch>` styled to the design, and let a
  visible press pulse carry every other tap on iOS.
- `haptic()` returns `false` when nothing vibrated. Use that to fire the visual fallback
  (a 120ms scale or ring pulse) instead of doubling up, the way reflekt's world toggle does.
- Desktop: no-op. Pointer precision is the feedback there; do not fake it with shake.

Write the map into the Art direction block (`Haptic map:` field) before building it.

## 2. One easter egg, from the concept, never generic

Every project ships at least one. It is the thing people show a friend, and in a pitch
it is the "one more thing" that makes a judge smile after 30 identical demos.

It must grow out of the concept, not be bolted on. Reference points from past work:
- **karavi**: a cursor picker with product-themed cursors, one of which is a rug.
- **reflekt**: a wellness / acai world toggle that swaps the whole site behind a splash.
- **reflekt-design**: a compass that spins with scroll velocity, ticks with sound and
  haptics, and on continuous scrolling reveals the logo.

**Trigger families** (pick one that fits the concept):
- Sustained input: keep scrolling past the end, long-press, hold, spin fast.
- A hidden control that changes the world: cursor set, theme or mode toggle, a dial.
- A sequence: typing the product's word, Konami, clicking the logo N times.
- Context: time of day, a return visit, the dev console (`console.log` a message for the
  judges who open DevTools; zero-cost, always ship one).

**Rules:**
- Never blocks or slows the primary task. Zero cost until triggered: lazy-import it.
- Reversible and harmless: a second trigger or Escape undoes it; nothing is lost.
- Accessible: a control-type egg is keyboard reachable; nothing flashes more than 3
  times a second; reduced motion gets a still version of the reward.
- Brand-true: the reward says something about the product. Confetti is not an easter
  egg, it is a default.
- Record it in the Art direction block (`Easter egg:` trigger, reward, why it fits) and
  in the demo script, so the presenter can land it on stage.

## 3. Contained by default, full bleed on purpose

How Apple and Wise lay out a page: one consistent content container with calm, even
margins, and a few chosen sections that run edge to edge. The margins are not the
problem; they give the page rhythm and keep data readable. The two failures are opposites:

- **The narrow-column tell (AI slop):** the whole page is one `max-w-2xl`/`max-w-3xl`
  column, every section the same width, same background, centred text, so at 1440+ it
  reads as a blog template floating in nothing.
- **The stretch-everything tell (over-correction, rejected on mock_3):** a timeline, lane
  diagram, table or card list stretched across a 1920 viewport. Data gets sparse, labels
  drift far from what they label, and the eye has to travel the whole screen. It looks
  unfinished, not bold.

**The rule:**
1. **One container** for content, about 1200 to 1320px (`--container`), same edges on every
   section so the page has a spine. Inner grids use its full width (12 columns); a
   paragraph still caps at about 65ch inside it.
2. **Backgrounds bleed, content does not.** A section band (colour, ink, tint) runs edge to
   edge while its content sits in the container. This is most of what makes Apple pages
   feel wide.
3. **Full-bleed content is reserved** for 1 to 3 sections that earn it: the hero image or
   signature scene, large photography or product shots, a marquee or horizontal
   scroller that runs off the edge, the closing band. Never data: timelines, diagrams,
   tables, lane charts, forms and card lists stay in the container.
4. **Vary width between sections**, not the container itself: a contained split, then a
   full-bleed image band, then a contained index. At least one full-bleed moment and at
   least one tinted band per landing, so the page is not one width top to bottom.
5. **Rails are optional**: on long pages the margins may carry real content (section
   index, sticky TOC, running metadata). Never filler.

**Finder** (Playwright `browser_evaluate` at 1440 wide; the screenshot judges, this lists
suspects):

```js
[...document.querySelectorAll('main > *, footer')].map(s => {
  let l = innerWidth, r = 0;
  s.querySelectorAll('p,h1,h2,h3,li,svg,img,figure,table,canvas,video').forEach(e => { const b = e.getBoundingClientRect();
    if (b.width && b.height) { l = Math.min(l, b.left); r = Math.max(r, b.right); } });
  const span = Math.round((r - l) / innerWidth * 100);
  return { el: s.id || s.tagName, span, bleedBg: getComputedStyle(s).backgroundColor !== getComputedStyle(document.body).backgroundColor };
}).filter(x => x.span < 50 || x.span > 96)
```

`span < 50` is the narrow-column tell: widen that section's grid to the container. `span >
96` is content running edge to edge: fine for a hero image, scene, marquee or closing
band; anything else (data, text, cards) goes back in the container. Also look at the
unfiltered list: if every section has the same span and no `bleedBg`, the page has no rhythm.

## 4. The detail list -- the things nobody asks for and everybody feels

Check each on the judge-facing screens. Most are one line of CSS.

1. Changing numbers use `font-variant-numeric: tabular-nums`, so digits do not jitter.
2. Headings `text-wrap: balance`, paragraphs `text-wrap: pretty`: no orphans.
3. Touch: `-webkit-tap-highlight-color: transparent` with our own `.press` state instead;
   `touch-action` set on anything draggable; `cursor: grab` / `grabbing` on drag.
4. Anchored sections have `scroll-margin-top` equal to the sticky header.
5. Inner scrollers have `overscroll-behavior: contain`.
6. Designed favicon, `theme-color`, and OG image in the product's world; a tab title
   that says what the page is.
7. A 404 page in the product's voice, using the shared header, not the framework default.
8. Copy, save and submit actions confirm in place (the button itself changes), not in a
   generic toast, unless the result needs to persist.
9. Optional sound: off by default, behind a visible toggle, synced to the same event as
   the haptic, never on page load.
10. The easter egg's console message is there for anyone opening DevTools.

## Gate evidence (add to the D4 log line)

`haptic map: <n> events | egg: <trigger> | layout: finder clean at 1440, bleed sections named | details: 10/10`
plus 1440 and 1920 screenshots of the landing next to the 375 and 1280 ones.
