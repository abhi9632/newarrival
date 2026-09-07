# AGENTS.md -- Project facts

## IDENTITY
| Field | Value |
|---|---|
| Project | [fill Day 1 -- see DAY1.md EVENT CONFIG] |
| Repo | [fill Day 1] |
| Problem domain | [fill Day 1 during planning] |
| Framework | [fill Day 1 during planning] |
| Styling | [fill Day 1 during planning] |
| Deployment | [fill Day 1 -- see DAY1.md EVENT CONFIG deploy target] |
| Backend | [fill Day 1 -- None if scope mode is prototype; see DAY1.md EVENT CONFIG] |
| Auth | [fill Day 1 -- None for prototype] |

## TEAM & AGENTS
| Person | GitHub | Role |
|---|---|---|
| [lead] | @[handle] | Lead dev + Planner (Day 1) |
| [teammate] | @[handle] | Builder |
| [teammate] | @[handle] | Builder |
| [teammate] | @[handle] | Builder |

Full roster (with machines) lives in DAY1.md EVENT CONFIG. Fill both.

**Integration rule:** Git is the only sync layer between sessions. Pull before claiming any task. Push after every completed component. Never assume another session's work is in your local state.

**Parallel workflow:** See `rules/parallel-workflow.md`. Phase A = planning (lead only, ~30 min). Phase B = build (all sessions simultaneously, pick from this queue).

---

## TASK QUEUE

> **Only fill this table if 3 or more sessions will run in parallel.** Solo and pairs
> delete it and build from the SCOPE section plus `docs/CONCEPT.md`. Last event the queue
> was never filled, yet every prompt still required it to be checked. See
> `rules/parallel-workflow.md`.

Contract between parallel sessions. No pre-assignment. Anyone picks the next available task.
Filled by the planner during Phase A. Expect 8-12 tasks total for a 3-4 person team.

> **Task descriptions below are SUMMARIES only.** The full specification for each task lives
> in that phase's GSD plan file: `.planning/phases/[N]-*/[N]-01-PLAN.md`. After claiming a
> task, run `bash scripts/check-plan.sh [N]` to locate the plan file and read it in full
> before writing any code. Phase map: T1=1, V1x=2, V2x=3, V3=4. Never build from the summary
> alone -- the plan file is the source of truth.

| # | Task | Depends On | Status | Claimed By |
|---|---|---|---|---|
| T1 | Shared foundation: mockData, AppShell/layout, art direction + tokens, router, **deploy pipeline (live URL from hour one)** | -- | available | |
| V1a | [fill Day 1 -- vertical slice 1, e.g. primary user flow] | T1 | blocked | |
| V1b | [fill Day 1 -- vertical slice 2, e.g. secondary view] | T1 | blocked | |
| V1c | [fill Day 1 -- vertical slice 3, e.g. shared components] | T1 | blocked | |
| V1d | [fill Day 1 -- compose V1a+V1b into full flow] | V1a, V1b | blocked | |
| V2a | [fill Day 1 -- second priority feature] | V1d | blocked | |
| V2b | [fill Day 1 -- second priority feature] | V1d | blocked | |
| V3 | Polish, mobile verify, backup demo recording (deploy already live since T1) | V2a, V2b | blocked | |
| P1 | Pitch script + click-path demo script (docs/pitch-playbook.md) | feature freeze | blocked | |
| P2 | Slide deck in product design language (HTML deck using design-system tokens) | P1 | blocked | |
| P3 | Rehearsal + backup capture | P2 | blocked | |

**Status values:** `available` / `in-progress` / `blocked` / `done`

**Pitch tasks (P1-P3):** claimable only after feature freeze (time in DAY1.md EVENT CONFIG).
P1 starts `blocked`; at feature freeze the lead flips P1 to `available`. P2 and P3 unblock
automatically through the normal dependency chain (P2 needs P1, P3 needs P2). Real queue
tasks, not an afterthought.

**How to claim a task (use the script -- do not manually edit this table):**
```bash
bash scripts/claim-task.sh <task-id>    # e.g. bash scripts/claim-task.sh V1a
bash scripts/complete-task.sh <task-id> # e.g. bash scripts/complete-task.sh V1a
bash scripts/next-task.sh               # see what is claimable right now
```

---

## DESIGN TOKENS
| Token | Value |
|---|---|
| Palette | [fill after Rule 0] |
| Fonts | [fill after Rule 0] |
| Spacing | 4px base |
| Radius | [fill after Rule 0] |
| Icons | [fill Day 1] |

Full reference: `design-system/README.md` (filled by planner during Phase A after Rule 0)

## SECRETS
Never hardcode a token, key or password in any file in this repo, including HTML, demo
pages and dashboards. A previous version of `docs/index.html` shipped a live GitHub PAT
into every repo cloned from this template. Runtime config goes in localStorage, an env
var, or the host's dashboard.

## CODE STANDARDS
- TypeScript strict if using TS
- No `console.log` in commits
- Typed Props on every component
- No inline styles -- design tokens only
- Every interactive element: keyboard + focus + aria-label
- Images: descriptive alt, lazy below fold
- `prefers-reduced-motion` on all animations
- Every async path: loading, error, empty states

## SCOPE
Scope and rubric: see DAY1.md EVENT CONFIG. Every feature built must serve at least one rubric criterion. A simple, clear demo scores higher than a complex one that is hard to follow.
