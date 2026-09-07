# rules/documentation-hooks.md

Run after every completed **Feature or Foundation** task. Quick-tier work skips this
entire file: commit, push, done.

Run after every completed feature or state change:

| Hook | Trigger | Update |
|---|---|---|
| 1 | New page/route | AGENTS.md Pages & Routes |
| 2 | New component | AGENTS.md Components |
| 3 | Scope change | HANDOFF.md Scope changes |
| 4 | Session end | HANDOFF.md Quick resume + Current state + Session log. Set `HANDOFF_SYNCED_COMMIT` to HEAD. Commit. |
| 5 | Design system change | AGENTS.md Design Tokens + `design-system/README.md` |
| 6 | Bug fixed or abandoned | HANDOFF.md Code failures & fixes (permanent, never pruned) |
| 7 | Starting a task from the queue | Run `bash scripts/claim-task.sh <task-number> <your-name>`. This atomically claims the task -- if someone else got there first, it will tell you and abort. Pick a different available task. |
| 8 | Task complete | AGENTS.md Task Queue: set Status = done, clear Claimed By. Check if any blocked task now has all deps done -- set those to available. Commit before moving to next task. |
| 9 | Session ends mid-task | AGENTS.md Task Queue: set Status back to available, clear Claimed By. Log progress in HANDOFF.md so teammate can resume. Commit. |

## Task Queue commit messages
- Claiming: `chore: claim T[n] -- [your name]` (done automatically by claim-task.sh)
- Done: `chore: T[n] done -- T[m] now available`
- Abandoned mid-session: `chore: release T[n] -- session ended mid-task`
