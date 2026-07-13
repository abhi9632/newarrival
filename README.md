# General Hackathon Template

Event details live in `DAY1.md` EVENT CONFIG. Fill it Day 1 morning, before anything else.

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

### Lead only -- Prompt 2a: Ideation Sprint (run immediately after the problem drops)

```
Run the Ideation Sprint in rules/ideation-sprint.md now. Here is the problem statement:
[PROBLEM STATEMENT]

Read DAY1.md EVENT CONFIG first for scope mode, team size, and the judging rubric.
Enforce the 90-minute timebox: announce each phase transition and hard-stop at T+90.
End the session with docs/CONCEPT.md written, committed, and pushed. Do not write any
product code -- this session produces the locked concept only.
```

Replace `[PROBLEM STATEMENT]` with the announced problem. This runs before any planning.
No code before docs/CONCEPT.md exists and is committed.

---

### Lead only -- Prompt 2b: Planning (run only after CONCEPT.md is locked)

```
Run the project planning skill. The brief is docs/CONCEPT.md plus DAY1.md EVENT CONFIG.
Read both before starting. The concept is already locked -- do not re-ideate.

Team: [number] developer(s), [solo / group]
```

Replace `[number]` / `[solo / group]` with your team size. The problem is already framed
in docs/CONCEPT.md, so the planner works from the locked concept, not the raw problem.

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
CLAUDE.md, AGENTS.md, HANDOFF.md, and all files in rules/

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

### All teammates -- Prompt 4: Execute task (run after Prompt 3, once you have claimed a task)

Replace `<task-id>` with the task ID you claimed (e.g. V2a). That is the only value you need to fill in.

```
I am working on task <task-id>. Execute it now.

Before writing any code:
1. Run `git pull` to get the latest repo state.
2. Read the task description for <task-id> in AGENTS.md (summary only).
3. Derive the phase number from the task ID using this map:
   T1 = phase 1, V1x = phase 2, V2x = phase 3, V3 = phase 4.
   Run `bash scripts/check-plan.sh <derived-phase-number>`.
   If the plan file is missing, STOP. Do not run any planning commands.
   Tell me: "Plan file for phase <N> is missing. The lead must fix this before
   execution can continue."
4. Read rules/development-workflow.md in full.
5. Read the GSD plan file (.planning/phases/<N>-*/<N>-01-PLAN.md) in full.
   This is your specification. The plan covers the whole phase -- your job is
   to implement only the section that corresponds to <task-id>. Do not build
   work belonging to other task IDs in the same phase.
6. If this is task T1: invoke frontend-design and design-taste-frontend to lock
   design tokens, then fill design-system/README.md.
   If this is any other task: read design-system/README.md for tokens. Do not
   re-run Rule 0.

Once the task is complete:
1. Commit all feature code.
2. Update HANDOFF.md: Quick resume (project-level only), Current state,
   Session log row (Owner column), Iteration Log entry.
3. Run `bash scripts/complete-task.sh <task-id>`
   (this marks done, unblocks dependents, and pushes AGENTS.md).
4. Commit and push all remaining changes.
```

---

## Agent model

The lead runs the planner Claude Code session. Teammates may run their own agents on separate machines.
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
| `DAY1.md` | EVENT CONFIG: single source of event facts (rubric, scope, stack, dates, freeze). |
| `CLAUDE.md` | Per-session bootstrap. Identity, Rule 0, decision table. |
| `AGENTS.md` | Project facts + task queue for parallel build. |
| `rules/ideation-sprint.md` | 90-minute concept lock. Runs first, before planning. |
| `docs/CONCEPT.md` | The locked concept. Written during ideation, input to planning. |
| `docs/pitch-playbook.md` | Pitch phase: script, deck in product design language, rehearsal. |
| `rules/parallel-workflow.md` | How to build in parallel with teammates. |
| `rules/frontend-design.md` | Rule 0. Runs once on T1 to lock tokens. |
| `rules/brainstorming.md` | Structured ideation before committing to a direction. |
| `rules/development-workflow.md` | Feature build order. |
| `rules/data-and-forms.md` | Fetch and form standards. |
| `rules/quality.md` | Components, a11y, performance. |
| `rules/systematic-debugging.md` | Root-cause-first debugging. |
| `rules/verification-before-completion.md` | Evidence before claiming done. |
| `rules/documentation-hooks.md` | What to update after each feature. |
| `design-system/README.md` | Design tokens (filled once during T1). |
| `docs/git-integration.md` | Multi-agent git sync protocol. |
| `docs/demo-prep.md` | Feature freeze schedule + demo checklist. |

---

## Start of Day 1

1. Complete collaborator setup above (every person, once)
2. Lead fills DAY1.md EVENT CONFIG, runs Prompt 1, then Prompt 2a (Ideation Sprint)
3. CONCEPT.md is locked and committed -- lead runs Prompt 2b (Planning)
4. Planning is approved -- lead confirms all phase plan files exist in `.planning/phases/`
5. Each session runs Prompt 3, then human claims a task, then runs Prompt 4

---

## Non-negotiables

1. **Rule 0** on T1 only: invoke `frontend-design` + `design-taste-frontend` to lock tokens. V1x+ read `design-system/README.md` instead
2. **GSD plan file** before ANY code: `bash scripts/check-plan.sh [N]`, then read the plan file. If missing, stop and tell the lead -- do not re-plan
3. **No em dashes** anywhere. Use commas, colons, or semicolons
4. **Every fetch**: loading / error / empty states
5. **Every form**: pending-disable, preserve input on error, inline validation
6. **Before claiming done**: `rules/verification-before-completion.md`
7. **Any bug**: `rules/systematic-debugging.md` before attempting a fix
8. **End of every work block**: push commits, update HANDOFF.md
9. **No code before `docs/CONCEPT.md`** exists and is committed. Ideation locks the concept first
10. **Pitch tasks (P1-P3) are real queue tasks**, not an afterthought; the deck uses product design tokens
11. **Distinctive design mandate** per `rules/frontend-design.md`: the default component-library look is a bug, not a baseline
