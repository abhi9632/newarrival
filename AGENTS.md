# AGENTS.md -- Project facts

## IDENTITY
| Field | Value |
|---|---|
| Project | IAG Hackathon 2026 |
| Repo | github.com/abhi9632/iag-hackathon-2026 |
| Problem domain | [fill Day 1 during planning] |
| Framework | [fill Day 1 during planning] |
| Styling | [fill Day 1 during planning] |
| Deployment | [fill Day 1 -- Vercel or Netlify] |
| Backend | None (UI prototype, mock data only) |
| Auth | None |

## TEAM & AGENTS
| Person | GitHub | Role |
|---|---|---|
| abhi9632 | @abhi9632 | Lead dev + Planner (Day 1) |
| [teammate] | @[handle] | Builder |
| [teammate] | @[handle] | Builder |
| [teammate] | @[handle] | Builder |

**Integration rule:** Git is the only sync layer between sessions. Pull before claiming any task. Push after every completed component. Never assume another session's work is in your local state.

**Parallel workflow:** See `rules/parallel-workflow.md`. Phase A = planning (abhi9632 only, ~30 min). Phase B = build (all sessions simultaneously, pick from this queue).

---

## TASK QUEUE

Contract between all parallel sessions. No pre-assignment. Anyone picks the next available task.
Filled by the planner during Phase A. Expect 8-12 tasks total for a 3-4 person team.

> **Task descriptions below are SUMMARIES only.** The full specification for each task lives
> in that phase's GSD plan file: `.planning/phases/[N]-*/[N]-01-PLAN.md`. After claiming a
> task, run `bash scripts/check-plan.sh [N]` to locate the plan file and read it in full
> before writing any code. Phase map: T1=1, V1x=2, V2x=3, V3=4. Never build from the summary
> alone -- the plan file is the source of truth.

| # | Task | Depends On | Status | Claimed By |
|---|---|---|---|---|
| T1 | Shared foundation: mockData, AppShell/layout, design tokens, router | -- | available | |
| V1a | [fill Day 1 -- vertical slice 1, e.g. claimant flow] | T1 | blocked | |
| V1b | [fill Day 1 -- vertical slice 2, e.g. assessor view] | T1 | blocked | |
| V1c | [fill Day 1 -- vertical slice 3, e.g. shared components] | T1 | blocked | |
| V1d | [fill Day 1 -- compose V1a+V1b into full flow] | V1a, V1b | blocked | |
| V2a | [fill Day 1 -- second priority feature] | V1d | blocked | |
| V2b | [fill Day 1 -- second priority feature] | V1d | blocked | |
| V3 | Polish, freeze, deploy, mobile verify, demo prep | V2a, V2b | blocked | |

**Status values:** `available` / `in-progress` / `blocked` / `done`

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
48-hour UI prototype. Mock/static data. No real backend. Judges assess: problem clarity, UX polish, solution quality, feasibility.
