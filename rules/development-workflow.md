# rules/development-workflow.md

## Working with the Task Queue (parallel sessions)

Before building anything:
1. `git pull` -- get the latest AGENTS.md and `.planning/` files
2. Confirm the task ID you have claimed is marked `in-progress` in AGENTS.md
3. Read the task description in AGENTS.md (a summary only), then read the GSD plan file for
   the phase -- the plan file is the real spec (see Step 1 of the build order)
4. Follow the feature build order below -- Step 1 is mandatory and cannot be skipped
5. Run `bash scripts/complete-task.sh <task-id>` when done
6. Loop -- check the sprint board for the next available task

If all tasks are `in-progress` or `blocked`: pull every 5 minutes and wait.
Never start a task that is not marked `available` or `in-progress` (claimed by you).

---

## Feature build order

### Step 1 -- Read the GSD plan file (MANDATORY -- do not skip, do not defer)

GSD is planning-only. The planner has already produced the detailed spec during Phase A.
Your job is to read it before any code. No exceptions. Do not build from the AGENTS.md
one-line summary.

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
path. **Read that plan file in full** -- it is your specification.

If check-plan.sh reports the plan is missing, the phase was never planned. Run:

```
/gsd-plan-phase [N]
```

Wait for it to finish, commit the `.planning/` files, then re-run `check-plan.sh [N]` and
read the plan before continuing.

If the planning skill is not installed:
```bash
npx skills add anthropics/claude-code --skill gsd-plan-phase
```

**Do not proceed to Step 2 until you have read the plan file end to end.**

### Step 2 -- Rule 0 (UI tasks only)

Any task touching HTML, CSS, or visual components: invoke `frontend-design` then
`design-taste-frontend` before writing any UI code. Hard blocker.
Full process: `rules/frontend-design.md`.

### Step 3 -- Uncertain on direction?

Brainstorm first (`rules/brainstorming.md`) before committing to an approach.

### Step 4 -- Build (from the plan file)

1. Define types/interfaces first
2. Write validation schema if a form is involved
3. Build UI with all states: loading, error, empty, success
4. Verify before claiming done (`rules/verification-before-completion.md`)
5. Run `rules/documentation-hooks.md` hooks before the next feature

---

## Before writing any component
- Visual? Rule 0 (Step 2 above)
- Fetches data? See `rules/data-and-forms.md`
- Bug or unexpected behaviour? See `rules/systematic-debugging.md`
- Missing capability? `find-skills`

## Day 1 foundations (do before any feature)
1. Agree stack, fill AGENTS.md
2. Rule 0, fill `design-system/README.md` (palette, type, spacing)
3. Global layout shell: nav, page wrapper, mobile breakpoint
4. Mock data layer: static JSON or in-memory objects
5. Generic error/empty fallback component
