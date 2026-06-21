# docs/skills-setup.md -- Standing skills setup

Run these three commands at the start of your first session only.
The project Setup Script runs them automatically on every subsequent session start.
If the Setup Script has already run them, these are no-ops.

## Install the three standing skills

```bash
npx skills add anthropics/claude-code --skill "frontend-design"
npx skills add Leonxlnx/taste-skill --skill "design-taste-frontend"
npx skills add anthropics/claude-code --skill "find-skills"
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
| `frontend-design` | Before ANY UI code (Rule 0, step 1) | `invoke frontend-design` |
| `design-taste-frontend` | Immediately after `frontend-design` (Rule 0, step 2) | `invoke design-taste-frontend` |
| `find-skills` | When you need a capability not in this repo | `invoke find-skills` |

## Rule 0 reminder

Both `frontend-design` and `design-taste-frontend` must be invoked before the first
component is written. This is a hard blocker. Not optional. Not a reminder.
If you are about to write a component and have not run Rule 0: stop and run it now.
