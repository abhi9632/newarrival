# 03-03 Summary

All three tasks complete. Nothing from the binding cut order was cut: TIME-05 (urgency
count) and SRC-03 (last-checked date) both shipped.

## Task 1: obligation card and dated timeline

- `src/components/ObligationCard.tsx`: status pill, due date with a relative phrase,
  title, agency, instrument, a new-tab source link (`noopener noreferrer`), the
  `verifiedOn` date, and the plain-language `detail` behind a native `<details>`
  disclosure. `STATUS_CLASS` uses complete literal Tailwind classes built from the
  Phase 1 `@theme` colour tokens (`text-overdue`, `bg-due-soon/10`, etc.), no runtime
  class composition.
- `src/app/timeline/page.tsx` split the derived array into a dated rail (`border-l-2`
  accent line with ticked dots, the recorded Signature) and a standing-conditions
  group below it, rather than inventing dates for the 9+ standing rules in the corpus.
- All acceptance greps pass; `npm run build` still embeds the pinned obligation id.

## Task 2: polish pass and visual gate

- Added the TIME-05 urgency count above the dated rail.
- Judged the built screen against the Signature: reinforces it directly (the rail is
  the Signature's own description, now doing its job). No second design-authority pass
  needed.
- `emil-design-eng` polish pass: hover/focus-visible states on the four intake controls
  (reusing the `.affordance` class), a rotating chevron on the disclosure summary with a
  `prefers-reduced-motion` override added to `globals.css`.
- Visual gate run against a **local production build** (`next build && next start -p
  3100`, screenshotted with Playwright's `browser_resize` + `browser_take_screenshot`),
  not the live Vercel URL: `HANDOFF.md`'s Vercel-authorisation blocker is still open, so
  no live URL exists yet. This mirrors the 01-02 fallback already logged in HANDOFF's
  Code failures & fixes.
- Two gate iterations. The first pass showed "Standing condition" twice per standing
  card (status pill + a redundant body-text line); fixed by dropping the body line
  since the pill already carries the label. Second pass passed cleanly at both
  viewports; answers logged in `design-system/README.md` under `### Obligation
  timeline`.
- Screenshots: `docs/visual-gate/03-timeline-375.png`, `03-timeline-1280.png`.

## Task 3: assumption 3

- Measured: `node scripts/check-engine.ts` reports `DIVERGENCE 14 of 18` between the
  student and skilled example profiles at reference date 2026-09-22. 14 >= 6 and the
  4-id shared overlap is well under half of the 18-id union.
- Seen: `docs/visual-gate/03-profiles-500-1280.png` and `03-profiles-482-1280.png`,
  captured back to back on the live build. Side by side they read as two entirely
  different timelines: the student profile shows visa condition cards (address,
  enrolment, work hour cap, OSHC, graduate visa window) plus VIC tenancy; the skilled
  profile shows sponsor obligations, the PR pathway, the RHCA Italy health agreement
  and NSW tenancy. Only the shared tax records look similar between the two.
- Fallback comparison: swapping citizenship alone on the student profile (the RHCA
  health swap) changes exactly 2 cards (`health-no-rhca-india` and `health-rhca-italy`),
  versus 14 for the full profile swap. The two-profile moment diverges 7x more than its
  named fallback.
- Outcome recorded verbatim in `HANDOFF.md`:
  `ASSUMPTION 3 (student vs skilled divergence): HOLDS. 14 of 18 obligations differ,
  legible side by side at 1280 (near-total card replacement across visa, health and
  tenancy modules, not a few rows swapped; the citizenship-only health swap changes
  only 2 cards by comparison). Pitch keeps the two profile moment.`
- `node scripts/check-rules.mjs` still exits 0; the corpus was not touched.

## Standing blocker carried forward

Vercel is still not authorised on `abhi9632/newarrival` (`docs/manual-actions.md` has
the click path). All of this phase's visual evidence was captured against a local
production build instead of the live URL for that reason.
