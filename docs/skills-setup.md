# docs/skills-setup.md -- Standing skills setup

Run these three commands at the start of your first session only.
The project Setup Script runs them automatically on every subsequent session start.
If the Setup Script has already run them, these are no-ops.

## GSD Core installs per machine, not from the repo

```bash
npx -y @opengsd/gsd-core@latest --local --claude
```

The project Setup Script already runs this. It is deliberately not committed: the
installer writes machine-absolute paths into all ~460 files it manages, so a vendored
copy is only correct on the machine that generated it. The copy that used to live in
this repo pointed at `/home/user/claude_template`, which existed on nobody's machine,
so every GSD agent import silently resolved to nothing. Requires Node 24+.

Update it later with `/gsd-update`.

## Install the three standing skills

```bash
npx skills add anthropics/claude-code --skill "frontend-design"
npx skills add Leonxlnx/taste-skill --skill "design-taste-frontend"
npx skills add vercel-labs/skills --skill "find-skills"
```

## Verify installation

```bash
npx skills list
```

You should see `frontend-design`, `design-taste-frontend`, and `find-skills` in the output.
If any are missing, re-run the relevant install command above.

## What each skill does

| Skill | When to invoke | Command |
|---|---|---|
| `frontend-design` | Product UI, dashboards, app screens. One authority per pass | `invoke frontend-design` |
| `design-taste-frontend` | Landing and marketing pages. One authority per pass | `invoke design-taste-frontend` |
| `find-skills` | When you need a capability not in this repo | `invoke find-skills` |

## Rule 0 reminder -- ONE authority, not both

Install all three skills. **Invoke only ONE design skill per design pass.**

`frontend-design` and `design-taste-frontend` are both complete, opinionated design
systems. Loading both for the same pass averages two strong points of view into the
default look. Last event four design skills were loaded inside 58 seconds and the result
was rejected as AI slop; the same page redesigned with `design-taste-frontend` alone was
accepted with no other change.

| Brief | Authority |
|---|---|
| Landing page, marketing, hero, pitch site | `design-taste-frontend` |
| Product UI, dashboard, forms, app screens | `frontend-design` |

Pick one, say which and why, then build. Full rule: `rules/frontend-design.md`.
