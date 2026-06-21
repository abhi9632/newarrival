# rules/frontend-design.md — RULE 0

## Mandatory before ANY front-end code

1. Invoke `frontend-design` (Anthropic official skill)
2. Invoke `design-taste-frontend` (anti-slop taste skill)

Both at `.agents/skills/<name>/SKILL.md`. Hard blocker — nothing visual ships without both.
If a skill won't load, read the SKILL.md file directly as fallback.

"Front-end code" = HTML, CSS, Tailwind, JSX/TSX, `.astro`, `.vue`, `.svelte`, layout, animation, or any visual change.

Process: invoke both skills → follow `design-system/README.md` tokens → cover every state (default, hover, loading, error, empty, success) → a11y + `prefers-reduced-motion`.

## Vendor skills (run once on first session)
```sh
npx skills add anthropics/claude-code --skill "frontend-design"
npx skills add Leonxlnx/taste-skill --skill "design-taste-frontend"
npx skills add skills-sh/find-skills --skill "find-skills"
```
Commit `.agents/skills/` + `skills-lock.json`.

## Skill discovery
Before improvising a missing capability: invoke `find-skills` or run `npx skills find "<task>"`.
