# rules/quality.md

## Components
1. One component per file.
2. Typed Props (if TypeScript).
3. No inline styles -- design tokens only.
4. Every interactive element: keyboard + focus-visible + aria-label.
5. Touch targets >=44x44px.
6. `prefers-reduced-motion` on all animations.
7. Check `design-system/components/*.prompt.md` before building a new primitive.

## Accessibility (WCAG 2.1 AA)
Descriptive alt text, labelled inputs, focus-visible, 4.5:1 contrast, logical heading order, ESC-closable modals.

## Performance
Target: LCP <2.5s, CLS <0.1. Lighthouse >=90 mobile is a direction, not a hard gate during the hackathon -- prioritise LCP and CLS first.
Images: lazy below fold, width+height set. Fonts: `font-display: swap`.

## Hackathon note
Polish happy path first, then error/empty states. Judges will test edge cases.
