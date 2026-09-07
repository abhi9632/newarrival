# rules/parallel-workflow.md

## READ THIS FIRST: does your team actually need the queue?

| Sessions running at once | Use |
|---|---|
| 1 or 2 | **No queue.** Work from AGENTS.md scope + `docs/CONCEPT.md`. Skip this file. |
| 3 or more | The queue below. |

The claim/complete/next scripts coordinate 3+ parallel sessions. Below that they cost
more than they coordinate: a pull, a commit and a push per task transition, plus a table
to keep consistent, plus a prompt that tells every session to check a board nobody else
is using.

Evidence: last event the queue was never filled. At the end of the hackathon the rows
still read `[fill Day 1]` with status `blocked`, while every session prompt, CLAUDE.md,
AGENTS.md and the workflow rules all still demanded the queue be consulted before any
code. That is pure overhead paid on every task for zero coordination.

If you are solo or a pair: delete the queue table from AGENTS.md, keep the scope section,
and build.

---

## Subagent limits (applies to every team size)

- **Maximum 2 concurrent agents.** Not five, not six.
- **Every agent commits and pushes its own work before reporting back.** An agent that
  reports a summary but leaves the work uncommitted has produced nothing.
- **Commit before you fan out.** Never spawn agents on top of uncommitted work.
- Assume a rate limit can kill every running agent at the same instant, because it did:
  six agents were terminated by one session limit last event, and every one of them lost
  everything it had built.

## Commit cadence under session limits

- Push after every completed unit of work, never at the end of a task.
- If a step will take more than ~10 minutes, commit what already works first.
- Keep HANDOFF.md current enough that a different account on a different machine can
  resume from the pushed repo alone. That is the only real recovery path.

---

## Core model: dependency-ordered task queue

Instead of pre-assigning features to people, every task lives in a shared
queue in AGENTS.md. Anyone picks the next available task. Flow is preserved
through dependency chains, not through ownership. This means no one waits
because someone else's list is empty -- you just pick the next available task.

---

## CRITICAL RULE: Split tasks so both sessions always have work

When filling the Task Queue (Phase A), every build task that:
- Takes more than ~90 minutes, OR
- Involves multiple independent components

...MUST be split into parallel subtasks along component boundaries.

**The pattern:**
```
V1a  Component A (e.g. UploadDropzone)       -- depends on T1 -- available
V1b  Component B (e.g. TriageResultCard)     -- depends on T1 -- available  <- parallel
V1c  Page composition (wires A + B together) -- depends on V1a, V1b -- blocked
```

V1a and V1b must have zero file overlap -- different components, different files.
V1c unblocks automatically when both are done.

**Never put a task in the queue that only one person can claim while the other has nothing.**
If the queue ever has only one available task, go back and split it.

---

## Day 1 planning protocol

### Step 1 -- One person runs Phase A (first 30 min)
```
Run SKILL.md phases 1 through 5 only. Stop after the roadmap is
approved. Fill the AGENTS.md Task Queue table: every task must have an ID,
a description, and a Depends-On list. Set all statuses to blocked or available.

Task ID convention:
  T1         -- shared foundation (always the first task, no version prefix)
  V1a, V1b   -- Version 1 parallel subtasks
  V1c        -- Version 1 compositor (depends on V1a + V1b)
  V2a, V2b   -- Version 2 parallel subtasks
  V3         -- always the final task: deploy, mobile QA, demo script, feature freeze

IMPORTANT: any build task over 90 minutes or involving multiple independent
components must be split into parallel subtasks (e.g. V1a, V1b) with zero
file overlap between them, and a compositor task (V1c) that depends on both.
The goal: at least 2 tasks claimable at all times during the build phase.

Do not start any build phase. Commit everything when done.
```

### Step 2 -- Both sessions open and immediately run
```bash
bash scripts/next-task.sh
```
The queue already has 2+ claimable tasks. Each person claims one and goes.

### Step 3 -- Throughout the day
When finishing a task: Claude Code runs `bash scripts/complete-task.sh <task-id>`
When wanting next task: human runs `next-task.sh` to see what has opened up,
then claims with `claim-task.sh <task-id>`, then pastes the builder prompt.

---

## Two phases

### Phase A -- Planning (one person, one session, low token cost)

**Only run Phase A if planning has not been done yet** (HANDOFF.md has no
roadmap, AGENTS.md Task Queue is empty or has placeholder rows).

If planning is already done, skip to Phase B. Fill the Task Queue from
the existing `.planning/ROADMAP.md` instead of re-running the planning skill.

Prompt to use for a project where planning is already done:
```
Planning is complete. Read .planning/ROADMAP.md and fill the AGENTS.md
Task Queue with every remaining build task. Use the task ID convention:
  T1 = shared foundation
  V1a/V1b/... = Version 1 parallel tasks
  V1c = Version 1 compositor
  V2a/V2b/... = Version 2 parallel tasks
  V3 = deploy + mobile QA + demo script (final, non-negotiable)
Each task needs an ID, description, Depends-On list, Status (available or blocked),
and Claimed By (leave blank). Split any task over 90 min into parallel subtasks
with zero file overlap. Already-completed work should be marked done.
Commit when done.
```

### Phase B -- Build (everyone, all sessions simultaneously)

Each person opens their own session. The only contract between sessions is
the Task Queue in AGENTS.md. No pre-assignment.

**How Phase B works -- task ownership model:**

| Step | Who | Action |
|---|---|---|
| 1 | Human | `bash scripts/next-task.sh` -- see what is claimable |
| 2 | Human | `bash scripts/claim-task.sh <task-id>` -- claim it |
| 3 | Human | Paste builder prompt into Claude Code with task ID filled in |
| 4 | Claude Code | git pull, read plan, build, update HANDOFF.md, commit, push |
| 5 | Claude Code | `bash scripts/complete-task.sh <task-id>` -- mark done, unblock deps |
| 6 | Human | Repeat from step 1 for the next task |

Follow `rules/development-workflow.md` for the full build loop inside each session.

---

## Task Queue rules

- **Human claims, Claude Code completes.** Human runs `bash scripts/claim-task.sh <task-id>`
  before pasting the builder prompt. Claude Code runs `bash scripts/complete-task.sh <task-id>`
  when the task is done. These are the only two queue-state scripts. Never swap owners.
- **Pull before claiming.** Run `bash scripts/next-task.sh` first -- it pulls automatically
  and shows what is claimable. Then run `claim-task.sh`. Never claim without pulling first.
- **Release if session ends mid-task.** Human edits AGENTS.md to set Status back to
  available and clear Claimed By. Log progress in HANDOFF.md so teammate can resume. Commit.
- **Never start a blocked task.** If everything is in-progress or blocked,
  wait -- run `bash scripts/next-task.sh` to check what has opened up.

---

## Dependency chain (how flow is preserved)

```
T1 (shared foundation) -- no deps -- available from the start
  |-- V1a (component A)  -- depends on T1 -- available after T1 done
  |-- V1b (component B)  -- depends on T1 -- available after T1 done  <- parallel
  |-- V1c (compose A+B)  -- depends on V1a, V1b -- blocked until both done
        |-- V2a (feature D) -- depends on V1c -- blocked
        |-- V2b (feature E) -- depends on V1c -- blocked  <- parallel
              |-- V3 (deploy + QA + demo) -- depends on V2a, V2b -- blocked
```

V1a and V1b are available simultaneously. Anyone picks either.
V1c waits for both. V2a/V2b wait for V1c. V3 waits for V2a and V2b.

---

## Shared foundation (always T1)

The first task in every project must be the shared foundation. One person
claims and commits it before anyone else starts. It must include:
- Mock data file (src/data/mockData.ts or equivalent)
- Global nav shell + page wrapper
- Design token file
- `design-system/README.md` filled with the token reference (required before any V1 UI work)

T1 also runs Rule 0 once (frontend-design + design-taste-frontend) to lock design tokens.
All V1x+ tasks read tokens from `design-system/README.md` -- they do not re-run Rule 0.

Both sessions import from these. Never duplicate them in a feature task.

---

## Merge conflict protocol

Most conflicts will happen in AGENTS.md (the task queue). Resolution:
1. git pull origin main
2. Keep the most recent Status and Claimed By values for each row.
3. Never discard a done status -- if one version says done, it stays done.
4. Commit the merge.
5. Log it in HANDOFF.md Code failures & fixes (permanent, never pruned).

For source code conflicts: keep both if possible, merge manually, commit.

---

## Token death mid-task

- Whatever is committed is safe -- teammate reads HANDOFF.md and picks up.
- Whatever is uncommitted is lost -- keep commits small and frequent.
- If your session hits token death: human edits AGENTS.md directly to set Status
  back to available and clear Claimed By. Commit and push.
- If you cannot update AGENTS.md before dying: teammate sets Status back
  to available after reading your last HANDOFF.md entry.
