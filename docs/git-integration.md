# docs/git-integration.md -- Multi-agent git sync protocol

## Setup
Each person uses their own Claude Code session on their own machine.
Git is the only integration layer. No shared sessions, no shared context.
Task ownership is tracked in AGENTS.md via the scripts -- not by editing the file manually.

## Before starting any task
1. `bash scripts/next-task.sh` -- pulls latest and shows what is claimable
2. Confirm the task you want is available (status = available, not in-progress or blocked)
3. `bash scripts/claim-task.sh <task-id>` -- atomically locks the task in the remote repo
4. Only then: read the task description and start building

Do NOT manually edit the Status or Claimed By columns in AGENTS.md.
The scripts handle that atomically. Manual edits cause merge conflicts.

## During work
- Commit after every completed component -- not just end of day
- Commit message format: `feat: <what>`, `fix: <what>`, `style: <what>`, `chore: <what>`
- Push after every commit -- teammates pull from origin
- Keep commits small so token death mid-task loses as little as possible

## Finishing a task
1. Run `rules/verification-before-completion.md` gate
2. `bash scripts/complete-task.sh <task-id>` -- marks done, auto-unblocks dependents, pushes
3. `bash scripts/next-task.sh` -- immediately see what just unlocked
4. Update HANDOFF.md Session log with 1-line summary
5. Commit: `chore: update handoff after <task-id>`
6. Push

## Conflict prevention
- One person owns one task at a time (enforced by claim-task.sh)
- Shared files (global layout, design tokens, mock data): only T1 owner touches them
- After T1 is done, those files are read-only for feature tasks -- open a discussion if you need to change them
- If a conflict happens in AGENTS.md: keep the most recent Status + Claimed By per row, never downgrade done to in-progress

## Sync rhythm
- Every 90 minutes: pull + read HANDOFF.md Current state
- After lunch: full sync -- read HANDOFF.md together, agree on afternoon task split
- 1 hour before demo: feature freeze (see `docs/demo-prep.md`)

## If a teammate's agent breaks something
1. `git log --oneline -10` to find the offending commit
2. Follow `rules/systematic-debugging.md` before attempting a revert
3. Log in HANDOFF.md Code failures & fixes
4. Communicate with the teammate before reverting their work

## Releasing a task mid-session (token death or context switch)
- In AGENTS.md: set your task back to available, clear Claimed By -- then commit and push
- Log in HANDOFF.md what was done and what remains
- Teammate reads HANDOFF.md and can pick it up fresh
