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

# Install standing skills.
# Install all three. Invoke only ONE design skill per design pass -- see
# rules/frontend-design.md.
npx skills add anthropics/claude-code --skill "frontend-design"
npx skills add Leonxlnx/taste-skill --skill "design-taste-frontend"
npx skills add vercel-labs/skills --skill "find-skills"

# Install GSD Core for this machine.
# Not committed to the repo on purpose: the installer bakes machine-absolute paths
# into every agent and command file, so a vendored copy only works on the machine
# that produced it. The script is idempotent and re-checks on every setup run, so a
# teammate who skipped this step still gets GSD when /kickoff reaches its preflight.
bash scripts/ensure-gsd.sh || echo "GSD install failed. Planning falls back per SKILL.md Phase 2 Step 0."

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
Read CLAUDE.md and DAY1.md. Do not read the whole repo -- CLAUDE.md tells you
which rules/ file to load when, and reading them all up front burns the context
you need for building.

Then:

1. Follow docs/skills-setup.md and install the three standing skills:
   frontend-design, design-taste-frontend, find-skills.
   Install all three. Never load more than one design skill in a single design
   pass -- see rules/frontend-design.md.

2. All git operations in this project: commit and push directly to main.
   Never create a branch. Never open a pull request.

3. Confirm the skills installed, then tell me you are ready and wait for the
   project brief. Do not read further or plan anything yet.
```

---

### Lead only -- Prompt 2: Kickoff (run the moment the problem drops)

One command carries the morning from problem to buildable queue. Run it in a single
session and leave it running.

```
/kickoff [PROBLEM STATEMENT]
```

If the event published no problem statement, run `/kickoff` with nothing after it. Its
FRAME phase derives a problem statement from the theme, sponsor, track and rubric, and
has you pick one before ideation starts.

What it does, in order: fills DAY1.md EVENT CONFIG gaps, runs the 90-minute Ideation
Sprint into `docs/CONCEPT.md`, gates on that concept being complete and committed,
installs GSD Core if this machine lacks it, runs the planning skill through its approval
gate, then writes the phase plans and opens the build.

It stops for you exactly twice: choosing the winning concept, and approving the roadmap.
It is resumable. If the session dies, run `/kickoff` again and it restarts at the first
unfinished stage.

<details>
<summary>Manual fallback, if the /kickoff command is unavailable</summary>

Run these as two prompts, in this order. Nothing else changes.

```
Run the Ideation Sprint in rules/ideation-sprint.md now. Here is the problem statement:
[PROBLEM STATEMENT]

Read DAY1.md EVENT CONFIG first for scope mode, team size, and the judging rubric.
If no problem statement is given above, run the FRAME phase first to derive one.
Enforce the 90-minute timebox: announce each phase transition and hard-stop at T+90.
End with docs/CONCEPT.md written, committed and pushed, then run
bash scripts/check-concept.sh and bash scripts/ensure-gsd.sh. No product code this session.
```

```
Run the project planning skill. The brief is docs/CONCEPT.md plus DAY1.md EVENT CONFIG.
Read both before starting. The concept is already locked -- do not re-ideate.

Team: [number] developer(s), [solo / group]
```
</details>

No code before `docs/CONCEPT.md` exists and is committed.

---

### All teammates -- Prompt 3: Start of any session (run first, every session)

Run this before doing anything else. Do not skip it even if you have been in this repo before.
Replace `<claimed-handle>` with your GitHub username.

```
First, configure git identity for this session -- run these two commands now before anything else:
git config user.name "<claimed-handle>"
git config user.email "<claimed-handle>@users.noreply.github.com"

Never use "Claude" or any Anthropic email as the git identity at any point in this session.

The SessionStart hook already printed the HANDOFF summary. Using that summary, tell me:
1. What was the last thing completed
2. What the next incomplete step is
3. What you need from me to continue

Read CLAUDE.md if it is not already loaded. Do not read the rest of the repo yet --
load a rules/ file only when the task you are given calls for it.

Do not start building anything yet.

Push directly to main. Never create a branch, never open a pull request.
```

---

### All teammates -- Prompt 4: Execute task (run after Prompt 3)

Replace `<task-id>` with your task ID (e.g. V2a), or just describe the task if your team
is not using the queue.

```
I am working on task <task-id>. Execute it now.

1. Say which effort tier this is (Quick / Feature / Foundation, see CLAUDE.md).
   Quick tier: do it, commit, push, stop. Ignore the rest of this prompt.

2. git pull.

3. Read the AGENTS.md row for <task-id>. Derive the phase (T1=1, V1x=2, V2x=3, V3=4)
   and run `bash scripts/check-plan.sh <phase>`. Read only the section of the plan
   that belongs to <task-id>.
   If the plan file is missing, say so in one line and build from docs/CONCEPT.md and
   the AGENTS.md task description instead. Do not stall and do not re-plan.

4. UI work: read design-system/README.md, especially the Art direction block, and
   reinforce the Signature. Use ONE design authority skill if this pass needs a
   design decision. Never two.

5. Build. Commit and push as soon as anything works -- do not batch to the end.

6. UI: pass the visual gate before calling it done. Run the app, screenshot the real
   screen at 375 and 1280, and answer in writing whether this could be any other
   team's project with the logo swapped. If yes, fix it. Log the pass in
   design-system/README.md.

7. Update HANDOFF.md in the same commit as your final change, then push.
   If your team uses the queue: bash scripts/complete-task.sh <task-id>
```

---

### Any session -- Prompt 5: Quick task

For a commit, a copy fix, a config change, a one-line bug. Do not use Prompt 4 for these.

```
Quick tier task: <describe it>.
Do it now, commit, and push to main. No plan file, no task queue, no HANDOFF update.
If nothing worth handing off changed, put "no-handoff" in the commit message.
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
| `.claude/commands/kickoff.md` | `/kickoff`: the Day 1 chain, ideation to buildable queue. |
| `rules/ideation-sprint.md` | 90-minute concept lock. Runs first, before planning. |
| `docs/CONCEPT.md` | The locked concept. Written during ideation, input to planning. |
| `scripts/ensure-gsd.sh` | Installs GSD Core on this machine if missing. Idempotent. |
| `scripts/check-concept.sh` | Gate: concept complete and committed before planning starts. |
| `docs/pitch-playbook.md` | Pitch phase: script, deck in product design language, rehearsal. |
| `rules/parallel-workflow.md` | How to build in parallel with teammates. |
| `rules/frontend-design.md` | Rule 0: ONE design authority, art direction, visual gate. |
| `docs/postmortem-2026-09.md` | Why these rules exist. Read before relaxing any of them. |
| `.claude/` | Only `settings.json` and two commands are committed. GSD installs per machine. |
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
| `scripts/check-freeze.sh` | Gate: freeze is only real once this exits 0 (live URL responds, rehearsal logged, HANDOFF reflects it). |
| `docs/submission-checklist.md` | The last task. A working, rehearsed demo is not the same as a submitted entry. |

---

## Start of Day 1

1. Complete collaborator setup above (every person, once)
2. Lead fills DAY1.md EVENT CONFIG and runs Prompt 1
3. Problem drops -- lead runs `/kickoff` (Prompt 2) and stays in that session. Ideation,
   concept lock, GSD install check, planning and the phase plans all happen inside it
4. Lead confirms all phase plan files exist: `bash scripts/check-plan.sh <N>` per phase
5. Each session runs Prompt 3, then human claims a task, then runs Prompt 4

## End of the event

1. At the freeze time in DAY1.md EVENT CONFIG, run `bash scripts/check-freeze.sh`. Not
   frozen until it exits 0
2. Claim P1-P3 in `docs/pitch-playbook.md`, logging each rehearsal run in its table
3. Once check-freeze.sh passes and P3 is done: `docs/submission-checklist.md`
4. Submitted is a state, not an assumption -- the checklist's last item is a saved
   confirmation screenshot or email

---

## Non-negotiables

1. **Name the effort tier before doing anything.** Quick / Feature / Foundation.
   Full ceremony on a Quick task is the most expensive habit this repo has had
2. **ONE design authority per design pass.** Never load two design skills for the same
   pass. Stacking them averages into the default look. `rules/frontend-design.md`
3. **Art direction before tokens.** `design-system/README.md` opens with Signature,
   Reference, Anti-reference, Type stance, Colour world. Tokens alone are not a design
4. **Visual gate before any screen is done.** Screenshot 375 + 1280, and answer: could
   this be another team's project with the logo swapped? If yes, it is not done
5. **Push to main after every unit of work.** No branches, no pull requests, no batching.
   Uncommitted work dies with the session
6. **Max 2 concurrent agents**, each committing its own work
7. **Missing plan file is not a stop.** Say so, build from `docs/CONCEPT.md` + AGENTS.md,
   log the assumption
8. **No queue below 3 parallel sessions.** Solo and pairs build straight from scope
9. **Never hardcode a secret** in any file, including demo pages and dashboards.
   Runtime config goes in localStorage, an env var, or the host dashboard
10. **No em dashes** anywhere. Commas, colons, semicolons
11. **Every fetch**: loading / error / empty. **Every form**: pending-disable, preserve
    input on error, inline validation
12. **No code before `docs/CONCEPT.md`** exists and is committed, and it stays the only
    concept file
13. **HANDOFF summary stays under 60 lines.** It is injected into every session start
14. **Deploy in T1**, not V3. A live URL from hour one
15. **Pitch length comes from DAY1.md EVENT CONFIG.** Never assume 3 minutes
