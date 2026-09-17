# rules/frontend-design.md -- RULE 0

## The one rule that matters: ONE design authority per pass

**Never invoke more than one design-system skill for a single design pass.**

This is the fix for the biggest failure of the last event. Four full design skills were
loaded inside 58 seconds (`frontend-design`, `design-taste-frontend`, `impeccable`,
`awwwards`), then four motion skills on top. Each of those is a complete, opinionated
system with its own decision procedure. Stacked, they do not add up. They average out,
and the average of four strong opinions is the default look. The result was rejected as
"AI slop". The same page, redesigned later with `design-taste-frontend` alone, was
accepted with no other change.

Stacking design skills is not thoroughness. It is dilution.

### How to choose the one

| Brief | Primary authority |
|---|---|
| Landing page, marketing page, hero, pitch site | `design-taste-frontend` |
| Product UI, dashboard, forms, multi-step app screens | `design-taste-frontend` (default preference); `frontend-design` when the brief is genuinely dense data/admin tooling with no product-surface moment at all |
| Award-level showcase where motion IS the product | `awwwards` |

Default to `design-taste-frontend` even outside landing pages. Its own scope note
excludes dashboards, meaning: don't expect it to hand you dashboard layout mechanics
(data tables, dense grids), but its taste system (art direction, colour discipline,
AI-tell avoidance, motion restraint) still applies and should still be applied in
full, not sampled for a handful of CSS variables and abandoned. `frontend-design` is
the fallback for the rare brief that is pure dense data tooling with no product-surface
moment anywhere in it.

Pick one. Say out loud which one you picked and why, in one line, before writing code.

**This choice is locked at concept time, not improvised at build time.**
`docs/CONCEPT.md`'s Design authority field names the pick already. T1 reads it and uses
it; T1 does not re-derive it from scratch. A build session picking a different authority
than the one the concept locked is a sign the concept itself under-specified its own
product surface, not a free choice at build time.

### Prototype scope constrains the backend, never the visual bar

`scope: prototype` (DAY1.md EVENT CONFIG) means mock data, no real backend, no auth. It
does not mean a bare screen is acceptable. A dashboard/devtool pick from the table above
still has to clear the same bar a landing page does: a real hero or intro moment before
the mechanism, imagery or illustration where it earns its place, a considered type and
colour system, motion with a reason. "It's just a prototype" describes what is faked
behind the screen, never what the screen looks like. If the whole demo is a plain form, a
button and a list with no visual world around it, that is not a finished prototype, it
failed the Production value axis in `rules/ideation-sprint.md` SCORE and the concept
should have specified more surface, or this build session needs to add it before the
visual gate runs.

If the human names several skills in one message, that is a request for quality, not an
instruction to load them all. Pick the primary for the brief, state the choice, and treat
the others as unread. Say: "Using <skill> as the design authority for this pass. Not
loading <others> in the same pass -- stacked design skills average into defaults."

### Supporting skills are not design authorities

Motion and implementation skills (`motion-principles`, `framer-motion`, `css-native`,
`gsap`, `cast`, and the `emilkowalski/skills` set below) are allowed, but only **after**
the visual direction is locked and the static layout is on screen, and only when that
pass actually needs it. Never load them in the same breath as the design authority.

### Mandatory polish pass — `emil-design-eng`, after the authority, every UI task

Once the design authority (above) has locked the visual direction and the layout is on
screen, run `emil-design-eng` as a polish pass before calling the screen done. It governs
invisible-detail decisions the authority skills don't: easing and timing, hover/press/focus
states, interruption behaviour, toast/library choices. This is a second, sequential pass,
not a second authority loaded alongside the first — it never picks palette, type, or layout.

Other `emilkowalski/skills` companions, invoked only when the scenario matches (same rule
as `motion-principles`/`gsap` above — after the authority, never alongside it):

| Scenario | Skill |
|---|---|
| Any animation/motion decision (what animates, curve, duration) | `animate` (web) / `animate-expo` (React Native) |
| Gesture-driven UI, spring physics, sheets | `apple-design` |
| Toast/notification UI | `ask-sonner` |
| Demo must be viewed/judged on a phone (viewport, touch, safe area) | `mobile-native` |
| Reviewing existing motion in a diff | `review-animations` |
| Auditing motion across the whole build | `improve-animations` |
| Finding UI that should animate but doesn't | `find-animation-opportunities` |
| Naming an unfamiliar motion effect | `animation-vocabulary` |
| Choosing a UI library for a specific need | `pick-ui-library` |
| Writing/reviewing Swift (native mobile track) | `write-swift` |

### A second pass is allowed, and encouraged

If a screen looks generic, run another single-authority pass on it. Do not keep the first
result because "Rule 0 already ran". Rule 0 locks the direction once; it never forbids
improving the screens.

---

## Rule 0 process (T1)

1. Read the brief, the persona and `docs/CONCEPT.md`.
2. Pick ONE design authority from the table above. State the pick.
3. Invoke it. Follow it.
4. Write **Art direction** into `design-system/README.md` BEFORE tokens (see below).
5. Write the tokens.
6. Commit.

Both steps 4 and 5 are required. Tokens alone are not a design.

## Rule 0 output is an art direction, not a palette

The old gate was "fill in the token file". A project can pass that gate completely and
still ship a generic layout, because colours and radii are not a design. The gate is now:

`design-system/README.md` must open with an **Art direction** block containing:

- **Signature**: the one element a judge remembers after 30 demos. Name it concretely
  ("the capacity dial that resizes the board live"), not abstractly ("bold and modern").
- **Reference**: one named real-world visual reference and what specifically is taken
  from it.
- **Anti-reference**: the specific default look this must not resemble. Usually
  "stock Tailwind/shadcn card grid on a white page".
- **Type stance**: display face, body face, and why this pairing for this subject.
- **Colour world**: the world in one line. Not a hex list. Safe blue/purple SaaS is
  a rejected default, not a baseline.

Every later builder reads this block and reinforces the signature. That is what makes
separate sessions produce one site instead of five.

---

## THE VISUAL GATE -- no UI task is done without it

Writing the component is not finishing the component. Before any UI task is marked done:

1. Run the app. Open the actual screen.
2. Screenshot it at **375** and **1280**.
3. Look at the screenshots and answer, in writing, three questions:
   - Does this match the Art direction block, specifically the Signature?
   - Could this be any other team's project with the logo swapped?
   - Would this pass as a paying client's shipped deliverable, or does it read as an
     internal wireframe/utility screen that happens to work? Functional and tested is
     not the same question as this one. A plain form, a bare list, or default browser
     controls with tokens swapped in is a wireframe wearing a palette, not a design.
   - Read every visible string on the screen. Is any of it process narration or a
     limitation caveat instead of product copy (see "Copy on the demo is product copy"
     below)? If so it doesn't belong here even if the rest of the screen is done.
4. If the answer to question 2 is yes, question 3 is "wireframe", or question 4 finds
   process narration on screen, it is not done. Fix it and screenshot again.

Evidence, not intent. "I followed the tokens" is not the gate; the screenshot is.

The session that produced the good design did exactly this loop: single skill, screenshot,
judge, adjust, screenshot again. The session that produced slop wrote code from four
skills and never looked at the result.

Micro-interactions and motion go on the demo-path screens only. Everything else stays plain.

---

## Copy on the demo is product copy, never process narration

A prototype can and should have real content: a hero, section copy, a features
showcase, whatever the product needs. That is not "fluff" and Rule 0 does not mean
strip the page down to bare controls. What is banned is a different thing entirely:
**meta-commentary about the build itself, anywhere a judge or user sees it.**

Banned on the live page, in any copy, any tooltip, any empty state, any label:
- Justifying a scope cut or limitation ("we didn't have time for streaks", "heuristic,
  not a hard rule", "capped at warning because this can be wrong")
- Defensive reassurance about the tool's own correctness ("genuinely, not a broken one",
  "this really works")
- Narrating the process ("built with Claude Code", "AI-generated", version/build labels)
- Comparative self-praise ("unlike other solutions", "this proves our approach works")

That material belongs in the pitch deck, the README, `docs/CONCEPT.md`, or spoken during
the pitch, never inside the product surface itself. A judge reading a limitation caveat
on the live screen reads it as the team apologising for their own work while presenting
it. Real content stays; commentary about the content does not. Sweep every visible
string on the demo page before calling a UI task done: does this describe the product,
or does it describe a decision the team made building the product? Only the first kind
ships on screen.

## Non-negotiables for any visual work

- Cover every state: default, hover, focus-visible, loading, error, empty, success.
- `prefers-reduced-motion` on every animation.
- Real copy from the persona's world. Never lorem, never placeholder names.
- Readable on a projector: high contrast, key flows legible at 1280x720.

## Vendor skills (run once on first session)
```sh
npx skills add anthropics/claude-code --skill "frontend-design"
npx skills add Leonxlnx/taste-skill --skill "design-taste-frontend"
npx skills add vercel-labs/skills --skill "find-skills"
npx skills add emilkowalski/skills --skill "emil-design-eng"
npx skills add emilkowalski/skills --skill "animate"
npx skills add emilkowalski/skills --skill "animate-expo"
npx skills add emilkowalski/skills --skill "apple-design"
npx skills add emilkowalski/skills --skill "ask-sonner"
npx skills add emilkowalski/skills --skill "mobile-native"
npx skills add emilkowalski/skills --skill "review-animations"
npx skills add emilkowalski/skills --skill "improve-animations"
npx skills add emilkowalski/skills --skill "find-animation-opportunities"
npx skills add emilkowalski/skills --skill "animation-vocabulary"
npx skills add emilkowalski/skills --skill "pick-ui-library"
npx skills add emilkowalski/skills --skill "write-swift"
```
Commit `.agents/skills/` + `skills-lock.json`. `emil-design-eng` is mandatory (polish
pass, above); the rest fire only when their scenario matches.

Installing several design skills is fine. Loading several in one pass is not.

## Skill discovery
Before improvising a missing capability: invoke `find-skills` or run `npx skills find "<task>"`.
