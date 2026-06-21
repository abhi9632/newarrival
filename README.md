# IAG Hackathon 2026 -- UTS Tech Festival

**Date:** Monday 22 June -- Tuesday 23 June 2026
**Location:** UTS Building 07, Level 03, Room 10G/10B
**Lead:** abhi9632 (this Claude session)
**Deliverable:** UI functional prototype (no backend required)

---

## Collaborator setup (do this before your first session)

Go to **Settings > Setup Script** in your Claude Code project and paste the script below.
Then replace the three values at the top with your own details. That is the only step.

```bash
#!/usr/bin/env bash
# Replace the three values below with your own details.
# GIT_USER_NAME  -- your GitHub username
# GIT_USER_EMAIL -- the email address on your GitHub account
# SESSION_OWNER  -- your first name (used to mark task ownership in AGENTS.md)
GIT_USER_NAME="your-github-username"
GIT_USER_EMAIL="your-github-email@example.com"
SESSION_OWNER="YourFirstName"

# ---------------------------------------------------------------
# Do not edit below this line
# ---------------------------------------------------------------
set -euo pipefail

# Set git identity via both git config AND environment variables.
# The env vars (GIT_AUTHOR_NAME etc.) override git config at commit time
# and ensure commits are attributed correctly even when Claude Code
# injects its own default identity.
git config --global user.name  "$GIT_USER_NAME"
git config --global user.email "$GIT_USER_EMAIL"

export GIT_AUTHOR_NAME="$GIT_USER_NAME"
export GIT_AUTHOR_EMAIL="$GIT_USER_EMAIL"
export GIT_COMMITTER_NAME="$GIT_USER_NAME"
export GIT_COMMITTER_EMAIL="$GIT_USER_EMAIL"
export SESSION_OWNER

echo "Git identity: $GIT_USER_NAME <$GIT_USER_EMAIL>"
echo "Session owner: $SESSION_OWNER"

[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] && git config --global commit.gpgsign false

# Install dependencies
if [ -d "src" ]; then
  cd src && npm install && cd ..
fi

# Install standing skills
npx skills add anthropics/claude-code --skill "frontend-design"
npx skills add Leonxlnx/taste-skill --skill "design-taste-frontend"

exit 0
```

> **Never skip this setup.** If your identity is not set, commits will be attributed
> to the wrong person and task claims will fail.

---

## Session prompts

Copy and paste these prompts exactly. Do not paraphrase.

---

### Lead only -- Prompt 1: Initial setup (run once, first session ever)

```
Read and deeply understand every file in this repo before doing anything else.
Start with CLAUDE.md, then AGENTS.md, then HANDOFF.md, then SKILL.md, then every
file in rules/, then scripts/, then design-system/, then docs/. Read them all --
do not skim or summarise early.

Once you have read everything:

1. Follow docs/skills-setup.md exactly and install all three standing skills:
   frontend-design, design-taste-frontend, and find-skills.

2. For all git operations in this session: commit and push directly to main.
   Do not create branches. Do not open pull requests.

3. Once everything above is confirmed working, tell me you are ready and wait
   for me to provide the project brief.

Note: any changes made must be pushed to main directly without creating any
branches. We do not work with branches at all. Thoroughly go through every
bit of code in the repo.
```

---

### Lead only -- Prompt 2: Planning (run after Prompt 1 is complete)

```
Run the project planning skill. Here's the brief:
[PROJECT BRIEF]

Team: [number] developer(s), [solo / group]
```

Replace `[PROJECT BRIEF]` with the actual problem statement and `[number]` / `[solo / group]` with your team size.

---

### All teammates -- Prompt 3: Start of any session (run first, every session)

Run this before doing anything else. Do not skip it even if you have been in this repo before.
Replace `<claimed-handle>` with your GitHub username.

```
First, configure git identity for this session -- run these two commands now before anything else:
git config user.name "<claimed-handle>"
git config user.email "<claimed-handle>@users.noreply.github.com"

Never use "Claude" or any Anthropic email as the git identity at any point in this session.

Now read every file in this repo before doing anything, especially:
CLAUDE.md, AGENTS.md, HANDOFF.md, SKILL.md, and all files in rules/

Thoroughly go through every bit of code in the repo.

Once done, read HANDOFF.md carefully and tell me:
1. What was the last thing completed
2. What the next incomplete step is
3. What you need from me to continue

Do not start building anything yet.

Note: any changes made must be pushed to main directly without creating any
branches. We do not work with branches at all in this session.
```

---

### All teammates -- Prompt 4: Execute task (run after Prompt 3, once you have claimed a task on the sprint board)

Replace `<task-id>` with the task ID you claimed (e.g. V2a) and `<phase-number>` with the
corresponding GSD phase number (T1=1, V1x=2, V2x=3, V3=4).

```
I have claimed task <task-id> on the sprint board. Execute it now.

Before writing any code:
1. Run `git pull` to get the latest state of the repo
2. Read the task description for <task-id> in AGENTS.md (this is a summary only)
3. Find your task's phase number (T1=1, V1x=2, V2x=3, V3=4), then run
   `bash scripts/check-plan.sh <phase-number>`. If it reports the plan is missing,
   run /gsd-plan-phase <phase-number>, wait for it, commit the .planning/ files,
   then re-run check-plan.sh.
4. Read the GSD plan file it points to (.planning/phases/<N>-*/<N>-01-PLAN.md) in
   full before writing a single line. That plan file is your specification.
5. Follow rules/development-workflow.md exactly.
6. If the task involves any UI, invoke frontend-design and design-taste-frontend
   (Rule 0) before writing a single line of HTML/CSS/JS

Once the task is complete:
1. Run bash scripts/complete-task.sh <task-id>
2. Push all commits directly to main -- no branches, no pull requests
3. Update HANDOFF.md: Quick resume, Current state, Session log
4. Tell me what was completed and what task is next on the board
```

---

## Agent model

abhi9632 runs this Claude Code session. Teammates may run their own agents on separate machines.
**Git is the only sync layer between agents.** Pull before every feature. Push after every component.

---

## Doc model

```
HANDOFF.md  ->  CLAUDE.md  ->  AGENTS.md  ->  rules/*.md
(live state,     (bootstrap,     (project facts,   (dev discipline,
 read FIRST       read every      task queue,       load on demand)
 every session)   session)        agent ownership)
```

| File | Role |
|------|------|
| `HANDOFF.md` | Live state. Read FIRST every session. |
| `CLAUDE.md` | Per-session bootstrap. Identity, Rule 0, decision table. |
| `AGENTS.md` | Project facts + task queue for parallel build. |
| `rules/parallel-workflow.md` | How to build in parallel with teammates. |
| `rules/frontend-design.md` | Rule 0. Mandatory before any UI code. |
| `rules/brainstorming.md` | Structured ideation before committing to a direction. |
| `rules/development-workflow.md` | Feature build order. |
| `rules/data-and-forms.md` | Fetch and form standards. |
| `rules/quality.md` | Components, a11y, performance. |
| `rules/systematic-debugging.md` | Root-cause-first debugging. |
| `rules/verification-before-completion.md` | Evidence before claiming done. |
| `rules/documentation-hooks.md` | What to update after each feature. |
| `design-system/README.md` | Design tokens (fill in Day 1 after Rule 0). |
| `docs/git-integration.md` | Multi-agent git sync protocol. |
| `docs/demo-prep.md` | Feature freeze schedule + demo checklist. |

---

## Start of Day 1

1. Complete collaborator setup above (every person, once)
2. Lead runs Prompt 1, then Prompt 2 with the project brief
3. Once planning is approved and Task Queue in AGENTS.md is filled, all sessions begin
4. Each session runs Prompt 3, then claims a task on the sprint board, then runs Prompt 4

---

## Non-negotiables

1. **Rule 0** before ANY UI code: invoke `frontend-design` + `design-taste-frontend`
2. **GSD plan file** before ANY code: `bash scripts/check-plan.sh [N]`, then read the plan file (if missing, `/gsd-plan-phase [N]`)
3. **No em dashes** anywhere. Use commas, colons, or semicolons
4. **Every fetch**: loading / error / empty states
5. **Every form**: pending-disable, preserve input on error, inline validation
6. **Before claiming done**: `rules/verification-before-completion.md`
7. **Any bug**: `rules/systematic-debugging.md` before attempting a fix
8. **End of every work block**: push commits, update HANDOFF.md
