# Day 1 Kickoff

Everyone reads this first. Everything you need is here.

---

## Timeline

```
00:00  Problem announced
00:05  Abhi opens planner session, pastes planner prompt from CLAUDE.md
       Everyone else: open Claude Code, paste builder prompt below, wait
00:30  Abhi pushes "chore: task queue ready" -- announces in group chat
       Everyone: tell your Claude "pull latest and run next-task.sh"
00:32  3+ tasks claimable -- each person claims one and starts building
~2:00  First V1 vertical lands -- something judges can touch
```

---

## Abhi -- Planner session

1. Open Claude Code
2. Paste the **Planner prompt** from `CLAUDE.md` (DAY 1 KICKOFF section)
3. Answer Claude's questions about the problem statement
4. Approve the roadmap when proposed
5. Run `/gsd-plan-phase [N]` for **every** phase (1 through 4) before opening the build
   phase. Each run writes the real spec to `.planning/phases/[N]-*/[N]-01-PLAN.md` -- this
   is what every builder reads before coding. Do not skip a phase.
6. Fill the AGENTS.md task queue with short summaries that point at those plan files
7. **Commit all `.planning/` files** (plans, ROADMAP, STATE, REQUIREMENTS) together with
   AGENTS.md before signalling the team. Builders cannot read a plan that was never pushed.
8. Claude commits "chore: task queue ready" -- announce this in the group chat
9. Close the planner session. Open a **new** Claude session
10. Paste the builder prompt below, claim a task, start building

**Why this matters:** builders build from the GSD plan file, not from the one-line task
summary. If a phase was never planned or the `.planning/` files were never committed, every
builder on that phase stalls. Plan all phases and push `.planning/` before you say "ready".

---

## Everyone else -- Builder session

Environment is already set up via Claude Code project settings. Just open Claude Code and paste:

```
Read CLAUDE.md, AGENTS.md, HANDOFF.md, and all files in rules/
Then follow the SESSION START instruction in CLAUDE.md.
Wait for me to confirm before claiming anything.
```

Once you claim a task, the first thing your Claude does before any code is run
`bash scripts/check-plan.sh <phase>` and read the GSD plan file it points to. That plan
file (`.planning/phases/[N]-*/[N]-01-PLAN.md`) is your spec, not the AGENTS.md summary.

Claude will run `next-task.sh`. If it shows "CLAIMABLE NOW: none" or only T1:
- The planner is still working -- this is expected
- Use this time to read AGENTS.md and HANDOFF.md so you understand the project
- Watch for Abhi's message in the group chat: "task queue ready"
- When it arrives: tell your Claude "pull latest and run next-task.sh"
- You will see 3+ claimable tasks with a parallel suggestion
- Say "claim V1a" (or whichever the suggestion shows for you)

### If T1 is taking longer than expected (>40 min)

Tell your Claude:
```
T1 is not done yet. Read the problem statement from HANDOFF.md and
brainstorm the component structure for your assigned vertical so we
are ready to build the moment T1 lands. Do not write any code yet.
Use rules/brainstorming.md.
```
This keeps you productive without creating conflicts.

---

## Task naming convention

| Prefix | Meaning |
|---|---|
| T1 | Shared foundation -- one person, others wait (max 30-40 min) |
| V1x | Version 1 -- minimum demoable prototype, highest priority |
| V2x | Version 2 -- second priority, build if V1 is done |
| V3 | Polish, deploy, mobile verify, demo prep -- always last |

V1 is done when all V1x tasks are marked done. At that point you have a fully demoable prototype. Announce it in the group chat.

---

## Key commands (Claude runs these for you)

```bash
bash scripts/next-task.sh                      # what is claimable right now
bash scripts/claim-task.sh <task-id>           # e.g. claim-task.sh V1a
bash scripts/complete-task.sh <task-id>        # e.g. complete-task.sh V1a
```

You never run these directly -- tell your Claude which task to claim/complete and it handles it.

---

## If you finish a task and nothing is claimable

Tell your Claude:
```
Run next-task.sh. If nothing is claimable, show me what is in-progress
and suggest how I can help the person closest to finishing.
```
Options: PR review, write tests, help debug, work on documentation.
Never sit idle.
