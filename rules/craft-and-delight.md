# rules/craft-and-delight.md -- how it feels, not just how it looks

Loaded at D3 (craft + motion), after `emil-design-eng`, and again at the D4 gate. The
Awwwards floor makes a screen look award-level; this file makes it *feel* hand-made.
Three hard requirements (haptics, one easter egg, no dead gutters) and a detail list.
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

## 3. No dead gutters -- the edges of the screen are part of the design

The most reliable AI-slop tell: one centred `max-w-3xl mx-auto` column on a 1440+ screen,
with hundreds of pixels of flat background on both sides and nothing living there. It
reads as a template at a glance. Readable line length is a rule for **paragraphs**, not
for the **page**.

Where gutters come from: `design-taste-frontend` tells builders to contain every page in
`max-w-7xl mx-auto` (or 1400px). At 1920 that alone leaves about 260px of nothing each
side, and a `max-w-3xl` section inside it leaves far more. This rule wins over that
default: the container holds text grids only; visuals, bands and the signature break out
of it to the viewport edge.

At 1440 and 1920, every section uses the width on purpose. Pick per section:
- **Full bleed**: the signature, imagery, a diagram or a colour band runs edge to edge.
- **Asymmetric grid**: a 12-column grid at full width; text holds 5 to 6 columns, the
  visual or the product takes the rest. Offsets beat centring.
- **Useful rails**: the margins carry something real: a section index or progress
  ("02 / 05"), a sticky table of contents, running metadata (time, coordinates, the
  live value of the signature), a vertical label, margin notes.
- **Bleed off the edge**: a marquee or horizontal scroller that runs past the viewport,
  saying there is more.

A centred reading column is allowed on long-form text only when the rails carry
something (progress, TOC, notes). A background colour alone does not count as using the
width.

**Finder** (run with Playwright `browser_evaluate` at 1920 wide; the screenshot is the
judge, this lists suspects):

```js
[...document.querySelectorAll('main > *, footer')].map(s => {
  let l = innerWidth, r = 0;
  s.querySelectorAll('*').forEach(e => { const b = e.getBoundingClientRect();
    if (b.width && b.height && b.width < innerWidth * 0.98) { l = Math.min(l, b.left); r = Math.max(r, b.right); } });
  return { el: s.id || s.tagName, leftGap: Math.round(l / innerWidth * 100), rightGap: Math.round((innerWidth - r) / innerWidth * 100) };
}).filter(x => x.leftGap > 18 && x.rightGap > 18)
```

Any section listed needs a full-bleed element, a rail, or an asymmetric layout.

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

`haptic map: <n> events | egg: <trigger> | gutters: finder clean at 1440 + 1920 | details: 10/10`
plus 1440 and 1920 screenshots of the landing next to the 375 and 1280 ones.
