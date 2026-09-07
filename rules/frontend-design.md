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
| Product UI, dashboard, forms, multi-step app screens | `frontend-design` |
| Award-level showcase where motion IS the product | `awwwards` |

Pick one. Say out loud which one you picked and why, in one line, before writing code.

If the human names several skills in one message, that is a request for quality, not an
instruction to load them all. Pick the primary for the brief, state the choice, and treat
the others as unread. Say: "Using <skill> as the design authority for this pass. Not
loading <others> in the same pass -- stacked design skills average into defaults."

### Supporting skills are not design authorities

Motion and implementation skills (`motion-principles`, `framer-motion`, `css-native`,
`gsap`, `cast`) are allowed, but only **after** the visual direction is locked and the
static layout is on screen, and only when that pass actually needs motion. Never load
them in the same breath as the design authority.

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
3. Look at the screenshots and answer, in writing, two questions:
   - Does this match the Art direction block, specifically the Signature?
   - Could this be any other team's project with the logo swapped?
4. If the answer to the second is yes, it is not done. Fix it and screenshot again.

Evidence, not intent. "I followed the tokens" is not the gate; the screenshot is.

The session that produced the good design did exactly this loop: single skill, screenshot,
judge, adjust, screenshot again. The session that produced slop wrote code from four
skills and never looked at the result.

Micro-interactions and motion go on the demo-path screens only. Everything else stays plain.

---

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
```
Commit `.agents/skills/` + `skills-lock.json`.

Installing several design skills is fine. Loading several in one pass is not.

## Skill discovery
Before improvising a missing capability: invoke `find-skills` or run `npx skills find "<task>"`.
