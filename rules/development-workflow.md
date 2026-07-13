# rules/development-workflow.md

## Working with the Task Queue (parallel sessions)

Claiming a task is done MANUALLY by the human before invoking Claude Code.
The human runs `bash scripts/claim-task.sh <task-id>` in their terminal, then
pastes the builder prompt into Claude Code with the task ID filled in.
Claude Code never claims a task autonomously -- it receives an already-claimed task.

Before building anything:
1. `git pull` -- get the latest AGENTS.md and `.planning/` files
2. Confirm the task ID you have claimed is marked `in-progress` in AGENTS.md
3. Read the task description in AGENTS.md (a summary only), then read the GSD plan file for
   the phase -- the plan file is the real spec (see Step 1 of the build order)
4. Follow the feature build order below -- Step 1 is mandatory and cannot be skipped
5. Run `bash scripts/complete-task.sh <task-id>` when done -- Claude Code runs this
6. Loop -- human checks the sprint board for the next available task and claims it

If all tasks are `in-progress` or `blocked`: pull every 5 minutes and wait.
Never start a task that is not marked `available` or `in-progress` (claimed by you).

---

## Feature build order

### Step 1 -- Read the GSD plan file (MANDATORY -- do not skip, do not defer)

The GSD plan was approved before build started. It is the locked specification.
Do not invoke GSD, do not re-plan, do not modify `.planning/` files during execution.

**Identify which GSD phase the task belongs to:**

| Task prefix | GSD phase |
|---|---|
| T1 | Phase 1 |
| V1a, V1b, V1c, V1d | Phase 2 |
| V2a, V2b, V2c | Phase 3 |
| V3 | Phase 4 |

**Run:**

```bash
bash scripts/check-plan.sh [N]
```

This locates the phase plan file (`.planning/phases/[N]-*/[N]-01-PLAN.md`) and prints its
path. **Read that plan file in full** -- it is your specification. The plan covers the
whole phase. Implement only the section that corresponds to your task ID. Do not
build work belonging to other task IDs in the same phase.

Before proceeding to Step 2, confirm the plan serves the rubric criteria in DAY1.md
EVENT CONFIG.
If any criterion is missing, STOP and tell the human. Do not invoke GSD.

If check-plan.sh reports the plan file is missing:
STOP. Do not invoke GSD or re-plan. Tell the human:
"Plan file for phase [N] is missing. The lead must fix this before execution can continue."

**Do not proceed to Step 2 until you have read the plan file end to end.**

### Step 2 -- Rule 0 (UI tasks only)

If this is task T1: invoke `frontend-design` then `design-taste-frontend` to lock
design tokens, then fill `design-system/README.md`. Hard blocker.
Full process: `rules/frontend-design.md`.

If this is any other task (V1x, V2x, V3): read `design-system/README.md` for tokens.
Do not re-run Rule 0 on V1x or later tasks.

### Step 3 -- Uncertain on direction?

Brainstorm first (`rules/brainstorming.md`) before committing to an approach.
Do not re-open the planning phase. Stay within the scope of the approved plan.

### Step 4 -- Build (from the plan file)

1. Define types/interfaces first
2. Write validation schema if a form is involved
3. Build UI with all states: loading, error, empty, success
4. Verify before claiming done (`rules/verification-before-completion.md`)
5. Run `rules/documentation-hooks.md` hooks before the next feature

### Step 5 -- Mark complete

Once all code is committed and HANDOFF.md is updated:
```bash
bash scripts/complete-task.sh <task-id>
```
This marks the task done in AGENTS.md, unblocks dependents, and pushes. Claude Code
runs this. The human does not need to run it.

---

## Before writing any component
- Visual? Rule 0 (Step 2 above)
- Fetches data? See `rules/data-and-forms.md`
- Bug or unexpected behaviour? See `rules/systematic-debugging.md`
- Missing capability? `find-skills`

## Day 1 foundations (do before any feature)
1. Agree stack, fill AGENTS.md
2. Rule 0 on T1 only: run frontend-design + design-taste-frontend, fill `design-system/README.md`
3. Global layout shell: nav, page wrapper, mobile breakpoint
4. Mock data layer: static JSON or in-memory objects
5. Generic error/empty fallback component
