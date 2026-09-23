# AGENTS.md -- Project facts

## IDENTITY
| Field | Value |
|---|---|
| Project | NewArrival, a live model of a new arrival's legal status in Australia |
| Repo | abhi9632/newarrival |
| Problem domain | Australian visa, tax, health and tenancy obligations derived from four facts |
| Framework | Next.js (App Router) + TypeScript + Tailwind |
| Styling | Tailwind v4 tokens in src/app/globals.css, design-taste-frontend authority |
| Deployment | Vercel |
| Live URL | [blocked: GitHub App not authorised on this private repo, see docs/manual-actions.md. `scripts/check-freeze.sh` will fail on this field until a human completes that authorisation and a deploy exists] |
| Backend | None, scope is prototype, every data path is static JSON in src/data/rules.json |
| Auth | None |

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
| Palette | Ink on eucalyptus-washed bone, one burnt terracotta accent, never blue or purple |
| Fonts | Space Grotesk (display), IBM Plex Sans (body) |
| Spacing | 4px base |
| Radius | --radius-sm 0.25rem / --radius-md 0.5rem / --radius-lg 1rem |
| Icons | None, native browser chrome only |

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
