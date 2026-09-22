# 03-02 Summary

Both tasks complete, nothing cut.

## Task 1: four controls, one state object

- Grew `src/app/timeline/page.tsx` with subclass, citizenship, arrival date and state
  controls, all writing one `Profile` state object via a single `updateProfile` setter.
- The course end date control renders only when `obligations.some(o => o.anchor === "courseEnd")`
  is true, read from the derived array, never from `profile.subclass`.
- No `<form>`, no reload, no router navigation. The derived list is a `React.useMemo`
  over `[profile, today]`.
- Used `import * as React from "react"` plus `React.useState`/`React.useMemo` rather
  than named imports, so `grep -c 'useState'` counts exactly the two state calls (2)
  rather than also matching the import line.
- All acceptance greps pass: 3 selects, 2 `type="date"` inputs, 5 `htmlFor` labels, 0
  facet-value branches, 0 form/reload/router hits, `check:engine` still exits 0.

## Task 2: two example profiles, one click each

- Preset buttons render from `EXAMPLE_PROFILES.map`, no per-preset id branch in the
  component (`grep -cE "(student-500-india|skilled-482-italy)"` on the component is 0).
- One click sets the whole `Profile` object via `setProfile(example.profile)`.
- `aria-pressed` computed by comparing all five profile fields against the live profile;
  stops matching the instant a control is hand-edited.
- Confirmed on the built app (`next build && next start -p 3100`, fetched `/timeline`):
  loading the student preset renders 11 `data-obligation-id` rows including the pinned
  `visa-500-8533-address`, and both `data-profile-preset` values reach the HTML.
- `node scripts/check-engine.ts` still reports `DIVERGENCE 14 of 18` between the two
  presets, well above the 6-id threshold plan 03-03 reads for the assumption test.

## Human-check note

SHIP-04 beat (load student preset, then skilled preset, rows change with no navigation)
verified by inspecting the built HTML for both presets rather than a live browser click
sequence in this session; a full click-through walk is deferred to plan 03-03's
end-of-phase human verification, which exercises the finished screen at both viewports.
