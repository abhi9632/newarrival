# rules/frontend-design.md — RULE 0

## Mandatory before ANY front-end code

1. Invoke `frontend-design` (Anthropic official skill)
2. Invoke `design-taste-frontend` (anti-slop taste skill)

Both at `.agents/skills/<name>/SKILL.md`. Hard blocker — nothing visual ships without both.
If a skill won't load, read the SKILL.md file directly as fallback.

"Front-end code" = HTML, CSS, Tailwind, JSX/TSX, `.astro`, `.vue`, `.svelte`, layout, animation, or any visual change.

Process: invoke both skills → follow `design-system/README.md` tokens → cover every state (default, hover, loading, error, empty, success) → a11y + `prefers-reduced-motion`.

## Distinctive by default

Most teams ship the default Tailwind/shadcn look -- judges see 30 of those in one
afternoon. Default look is a bug, not a baseline.

At T1 token lock, decide a visual identity, not just tokens: one signature element judges
will remember. Pick at least one:
- A bold typographic system
- A distinctive color world beyond safe blue/purple SaaS
- A hero moment with motion
- An illustration/iconography style

Write it into `design-system/README.md` as "Signature" so every builder reinforces it.

Micro-interactions on the demo path only: the 5 screens in the click-path get
transition/hover/motion polish first. Everything else can be plain.

Real copy from the persona's world, never lorem or placeholder names.

Test on a projector-like setup: high contrast, readable at distance, key flows visible at
1280x720.

## Vendor skills (run once on first session)
```sh
npx skills add anthropics/claude-code --skill "frontend-design"
npx skills add Leonxlnx/taste-skill --skill "design-taste-frontend"
npx skills add vercel-labs/skills --skill "find-skills"
```
Commit `.agents/skills/` + `skills-lock.json`.

## Skill discovery
Before improvising a missing capability: invoke `find-skills` or run `npx skills find "<task>"`.
