# rules/development-workflow.md

## Step 0 -- name the effort tier

Before anything else, say which tier this is (see CLAUDE.md EFFORT TIERS):

- **Quick**: commit, push, copy fix, config, one-line bug, a question.
  Do it now. Skip the rest of this file. Commit and push.
- **Feature**: a component, screen, or data flow. Continue below.
- **Foundation**: T1, architecture, design direction, deploy. Continue below, in full.

Running Foundation process on Quick work is the single most expensive habit in this
repo's history. It is not thoroughness, it is latency.

---

## Feature build order

### Step 1 -- Read the spec for YOUR task only

If a GSD plan exists, run:

```bash
bash scripts/check-plan.sh [N]
```

Phase map: T1 = 1, V1x = 2, V2x = 3, V3 = 4.

Read the **section of the plan for your task ID**. The plan covers the whole phase; you
implement one section. Do not read the whole phase file end to end unless you are the
Foundation owner. Do not build work belonging to other task IDs.

**If the plan file does not exist:** say so in one line and keep going. Build from
`docs/CONCEPT.md` plus the AGENTS.md task description and scope, and record the
assumption in HANDOFF.md. Do not invoke GSD, do not re-plan, and do not stall waiting
for a plan file.

This used to be a hard STOP. Last event `.planning/` was never created at all, so that
rule meant every task either blocked or silently ignored the rule. A hackathon clock does
not pause for a missing document.

Confirm the work serves a rubric criterion in DAY1.md EVENT CONFIG. If it serves none,
say so and ask before building.

### Step 1a -- Write the screen spec before code (any screen on the demo path)

One short paragraph, written and read back before implementation starts: what this
screen shows, what data it needs, its states (loading/error/empty/success), and one
sentence for "done when". Skipping this is cheap right up until it isn't: one past
project's result screen went through five separate live rearrangements across sessions
(reordering which card comes first, adding a card, deleting it, adding it back
differently) because nothing was decided before the code existed to argue with. A
paragraph is faster than a rewrite.

Not needed for Quick-tier tweaks or screens nobody will judge.

### Step 2 -- Design (UI tasks only)

**ONE design authority per pass.** Never two. See `rules/frontend-design.md`.

- T1: pick the authority, invoke it, write the Art direction block and the tokens in
  `design-system/README.md`.
- Any other task: read `design-system/README.md` and reinforce the Signature. If the
  screen you produce looks generic, run a fresh single-authority pass on it.

### Step 3 -- Uncertain on direction?

`rules/brainstorming.md` before committing to an approach. Stay inside the approved scope.

### Step 4 -- Build

1. Types and interfaces first
2. Validation schema if a form is involved
3. UI with all states: loading, error, empty, success
4. **Commit and push as soon as something works.** Do not wait for the whole task.
5. Verify per `rules/verification-before-completion.md`, at your tier
6. UI: pass the visual gate and log it in `design-system/README.md`

### Step 5 -- Close out

- Commit and push everything.
- Update HANDOFF.md in that same commit (the Stop hook checks the last commit touched it).
- If the task queue is in use, run `bash scripts/complete-task.sh <task-id>`.

---

## Working with the Task Queue (3+ parallel sessions only)

Skip this section for a solo or two-person team. See `rules/parallel-workflow.md`.

The human runs `bash scripts/claim-task.sh <task-id>` before pasting the builder prompt.
Claude Code runs `bash scripts/complete-task.sh <task-id>` when the task is done. Claude
never claims a task autonomously.

1. `git pull`
2. Confirm your task ID is `in-progress` in AGENTS.md
3. Build per the order above
4. `bash scripts/complete-task.sh <task-id>`

---

## Before writing any component
- Visual? Step 2 above. One authority.
- Fetches data? `rules/data-and-forms.md`
- Bug or unexpected behaviour? `rules/systematic-debugging.md`
- Missing capability? `find-skills`

## Day 1 foundations (before any feature)
1. Agree the stack, fill AGENTS.md
2. Rule 0 on T1: one design authority, Art direction block, then tokens
3. Global layout shell: nav, page wrapper, mobile breakpoint
4. Mock data layer
5. Generic error and empty fallback component
6. A running demo path. Before the first feature task closes, `npm run dev` must show
   something clickable end to end. A design plan handed to another tool is not a demo,
   and the human should never have to ask "is this even a usable product".
