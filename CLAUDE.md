# CLAUDE.md

> `HANDOFF.md` auto-loads via SessionStart hook. Read it first.

## GIT IDENTITY -- enforced before every commit
- NEVER commit using the author name "Claude Code" or email "claude@anthropic.com".
- Before ANY git commit, run `git config user.name`. If it is missing or set to
  "Claude Code": STOP and ask the user: "What is your GitHub username and email?"
  Then run `git config --global user.name "<answer>"` and
  `git config --global user.email "<answer>"` before proceeding.
- Do NOT inject "Co-Authored-By: Claude" or "Generated with Claude Code" into
  commit messages. Attribution is disabled in .claude/settings.json.

## SESSION START -- run this immediately, every session, no exceptions

Check the sprint board for the next claimable task, claim it there, then run Prompt 4
from README.md with the claimed task ID and phase number filled in.

After claiming, before writing ANY code: run `bash scripts/check-plan.sh <phase>`
(phase map: T1=1, V1x=2, V2x=3, V3=4) and read the GSD plan file it points to in full.
That plan file is your specification, not the AGENTS.md summary. If check-plan.sh reports
the plan is missing, run `/gsd-plan-phase [N]`, wait for it to finish, then proceed.

Do not run `next-task.sh` to claim -- claiming is done on the sprint board.
`next-task.sh` may still be used to read queue state if needed.

## PROJECT
IAG Hackathon 2026 (UTS Tech Festival). UI prototype solving a real IAG customer problem. No backend. Stack: [fill Day 1 during planning].

## IDENTITY
You are one AI developer in a 3-4 person parallel team. Each teammate has their own Claude Code session on their own machine. The repo is the only shared source of truth -- git is the integration layer between all sessions. You are not the sole developer. Coordinate through AGENTS.md, not through conversation.

Every feature must be: seamless, visually polished, solves a real pain point.

## NO EM DASHES -- ever. Use comma, colon, semicolon, or split the sentence.

## RULE 0 -- before ANY front-end code
Invoke `frontend-design` then `design-taste-frontend`. Hard blocker. Full process: `rules/frontend-design.md`.

## GSD PLANNING -- the plan file is the spec, read it before ANY code
GSD is planning-only. The planner runs `/gsd-plan-phase [N]` during Phase A, which writes
the real specification to `.planning/phases/[N]-*/[N]-01-PLAN.md`. Before building, every
task must read that plan file. Run `bash scripts/check-plan.sh [N]` to locate it; if it is
missing, run `/gsd-plan-phase [N]` and wait for it before proceeding.
Phase map: T1=1, V1x=2, V2x=3, V3=4. This is not optional. Build from the plan, not from
the AGENTS.md one-line summary.

## DAY 1 KICKOFF PROTOCOL

Two roles run simultaneously. See `DAY1.md` for the full per-person instructions.

### Role: Planner (abhi9632 only)

Paste this into your Claude session:

```
You are the planning agent for this hackathon. Read CLAUDE.md, SKILL.md,
and rules/parallel-workflow.md fully before doing anything.

Then run SKILL.md phases 1 through 5 only (problem framing, requirements,
stack, architecture, roadmap). Stop after the roadmap is approved.

When filling the AGENTS.md Task Queue, follow these rules exactly:

1. VERTICAL SLICES only. Every task must be independently demoable or
   directly support something demoable. Never split a single user flow
   across multiple tasks.

2. VERSION LABELS. Prefix every task with V1 / V2 / V3:
   - V1 = minimum demoable prototype (judges can touch it)
   - V2 = second-priority features (nice to have if time allows)
   - V3 = ALWAYS includes: deploy to Vercel/Netlify, verify on real
     mobile device, demo script, feature freeze. Non-negotiable.

3. T1 IS FOUNDATION ONLY. T1 = shared foundation: types, mock data,
   AppShell, router, design tokens. Minimum viable shared code only.
   Nothing feature-specific in T1.

4. PARALLEL SPLITS. After T1, produce at least 3 tasks claimable
   simultaneously -- one per teammate. Each must touch different files
   with zero overlap.

5. TASK SIZE. Each task = 60 to 120 minutes. Larger: split it.
   Smaller: merge it.

6. SELF-DESCRIBING. Each task description must be specific enough for
   a teammate to start building without asking questions. Include:
   what to build, which files, which routes, which components.

7. DESIGN SYSTEM. After Rule 0 runs and tokens are agreed, fill
   design-system/README.md with the full token reference before
   committing the task queue. Every builder reads it before writing UI.

Commit message when done: "chore: task queue ready -- build phase open"
Do not start Phase B. Your planning job ends at that commit.
```

### Role: Builders (everyone else)

Environment is already configured via Claude Code project settings.
Open Claude Code, paste the session-start prompt from DAY1.md, and wait
for the planner's commit signal before claiming any task.

---

## CLAIMING A TASK

Claim on the sprint board (shared dashboard). Do not use `claim-task.sh` to claim.
Once claimed on the board, run Prompt 4 from README.md with your task ID and phase number.

## FINISHING A TASK

```bash
bash scripts/complete-task.sh <task-id>
```

Then check the sprint board for the next claimable task.
Never sit idle -- if something is claimable, claim it.

---

## DECISION TABLE
| Situation | Action |
|---|---|
| UI/front-end work | Rule 0 first, then `design-system/README.md` |
| Building any feature | Read the GSD plan file first (`bash scripts/check-plan.sh [N]`); if missing, `/gsd-plan-phase [N]` |
| Exploring a problem or direction | `rules/brainstorming.md` |
| Bug or unexpected behaviour | `rules/systematic-debugging.md` |
| About to claim something is done | `rules/verification-before-completion.md` |
| Need an unknown capability | `find-skills` before improvising |
| Scope addition not in plan | Ask first, do not build |
| Library/API currency uncertain | search_web, never guess |
| Something broke (not resolved) | Fix or abandon, log in HANDOFF.md Code failures |
| About to start a work block | Pull latest, read HANDOFF.md |
| Finishing a work block | Push commits, update HANDOFF.md |
| Working with a teammate | Read rules/parallel-workflow.md first |
| About to start a task | Claim on sprint board FIRST, then run Prompt 4 |
| Just finished a task | bash scripts/complete-task.sh <task-id> |
| All tasks blocked or in-progress | Check sprint board and wait |
| Teammate file has a conflict | Pull, resolve (keep latest Status/Claimed By), commit, log |

## RULES -- load on demand only
| Doing... | Read |
|---|---|
| Any UI | `rules/frontend-design.md` |
| Exploring before building | `rules/brainstorming.md` |
| Any feature | `rules/development-workflow.md` |
| Data fetch or form | `rules/data-and-forms.md` |
| Components / a11y | `rules/quality.md` |
| Any bug or failure | `rules/systematic-debugging.md` |
| Claiming done / committing | `rules/verification-before-completion.md` |
| Feature complete | `rules/documentation-hooks.md` |
| Parallel team build | `rules/parallel-workflow.md` |

## SESSION END
1. Update HANDOFF.md (Quick resume + Current state + Session log)
2. Set `HANDOFF_SYNCED_COMMIT: <HEAD hash>`
3. Commit and push
Stop hook blocks close if skipped.
