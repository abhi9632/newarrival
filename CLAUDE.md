# CLAUDE.md

@rules/parallel-workflow.md
@rules/verification-before-completion.md

> HANDOFF.md auto-loads via SessionStart hook. Read it first.

---

## GIT IDENTITY -- enforced before every commit
- NEVER commit using the author name "Claude Code" or email "claude@anthropic.com".
- Before ANY git commit, run `git config user.name`. If missing or set to "Claude Code":
  STOP and ask: "What is your GitHub username and email?" Then run:
  `git config --global user.name "<answer>"` and `git config --global user.email "<answer>"`
- Do NOT inject "Co-Authored-By: Claude" or "Generated with Claude Code" into commit messages.
  Attribution is disabled in .claude/settings.json.

---

## PROJECT
Scope mode, stack, and the judging rubric come from `DAY1.md` EVENT CONFIG -- the single
source of event facts. Read it before planning or building. Every feature must serve at
least one rubric criterion.

---

## JUDGING RUBRIC -- from DAY1.md EVENT CONFIG, enforced throughout planning and build

The rubric (criteria, weights, what judges look for) lives in `DAY1.md` EVENT CONFIG. It is
the single source; never hardcode criteria here. During planning and build:
- Every feature must serve at least one rubric criterion. If a feature serves none, cut it.
- Weight effort by rubric points: the highest-weighted criterion gets the most build time.
- If the event published no rubric, EVENT CONFIG uses the fallback rubric from `SKILL.md`.
- Log iteration each session end in HANDOFF.md "Iteration Log": what was assumed, what
  changed, where that change shows in the demo.

Hard rule: the GSD plan file is the specification. It was approved before build started.
Do not re-plan, do not invoke GSD, do not modify .planning/ files during execution.

---

## IDENTITY
One of multiple Claude Code sessions running simultaneously on the same repo.
Each session is an AI developer. No humans are writing code directly.
The repo is the only shared source of truth. Git is the integration layer.
Do not assume another session's work is in your local state -- pull before every task.
Coordinate through AGENTS.md only. Do not reference conversation history across sessions.
Every feature must be: seamless, visually polished, solves a real pain point.

---

## NO EM DASHES -- ever. Use comma, colon, semicolon, or split the sentence.

---

## RULE 0 -- before ANY front-end code
T1 only: invoke `frontend-design` then `design-taste-frontend` to lock tokens,
then fill `design-system/README.md`. Hard blocker. Full process: @rules/frontend-design.md
V1x and later: read `design-system/README.md` for tokens. Do not re-run Rule 0.

---

## TASK OWNERSHIP MODEL

| Action | Owner |
|---|---|
| `bash scripts/next-task.sh` | Human |
| `bash scripts/claim-task.sh <task-id>` | Human |
| Paste builder prompt into Claude Code | Human |
| git pull, read plan, build, commit, push | Claude Code |
| Update HANDOFF.md | Claude Code |
| `bash scripts/complete-task.sh <task-id>` | Claude Code |
| Release mid-task (token death / abandon) | Human (edit AGENTS.md directly) |

---

## SESSION START -- run immediately, every session, no exceptions
1. Read HANDOFF.md (auto-loaded via hook).
2. Check AGENTS.md task queue: confirm your task is marked `in-progress` under your name.
3. Read the task description for your task ID in AGENTS.md (summary only).
4. Run `bash scripts/check-plan.sh <phase>` and read the GSD plan file in full.
   Phase map lives in the AGENTS.md task table (default: T1=1, V1x=2, V2x=3, V3=4).
   The plan covers the whole phase -- implement only the section for your task ID.
   If the plan file is missing: STOP. Do not invoke GSD or re-plan.
   Tell the human: "Plan file for phase <N> is missing. Lead must fix this before build can continue."
5. Confirm the plan serves the rubric criteria in DAY1.md EVENT CONFIG before writing any code.
   If a feature in your task serves no rubric criterion: STOP and tell the human.
   Do not re-plan or invoke GSD.

Do not write any code before steps 1-5 are complete.

---

## PLANNING SESSION -- runs once on Day 1 when planning skill is invoked

- Read SKILL.md fully before doing anything else.
- Run SKILL.md phases in sequence. Stop after roadmap is approved. Do not start Phase B.
- When filling AGENTS.md task queue, apply the translation rules in SKILL.md Phase 3.
- The filled AGENTS.md is the live task board for all build sessions. SKILL.md is not.
- Commit message when done: "chore: task queue ready -- build phase open"
- Planning ends at that commit. Do not claim or build any task.

---

## DECISION TABLE
| Situation | Action |
|---|---|
| About to write any feature code | Confirm active GSD plan serves the rubric criteria in DAY1.md EVENT CONFIG first |
| UI/front-end work | T1: Rule 0 to lock tokens. V1x+: read design-system/README.md |
| Building any feature | Read GSD plan file first (`bash scripts/check-plan.sh [N]`). If missing, STOP and tell the human |
| Exploring a problem or direction | @rules/brainstorming.md |
| Bug or unexpected behaviour | @rules/systematic-debugging.md |
| About to claim something is done | @rules/verification-before-completion.md |
| Need an unknown capability | `find-skills` before improvising |
| Scope addition not in plan | Ask first, do not build |
| Library/API currency uncertain | search_web, never guess |
| Something broke (not resolved) | Fix or abandon, log in HANDOFF.md Code failures |
| About to start a work block | Pull latest, read HANDOFF.md |
| Finishing a work block | Push commits, update HANDOFF.md |
| About to start a task | Human claims first (`claim-task.sh`), then pastes builder prompt |
| Just finished a task | Claude Code runs `bash scripts/complete-task.sh <task-id>` |
| All tasks blocked or in-progress | Check sprint board and wait |
| Teammate file conflict | Pull, resolve (keep latest Status/Claimed By), commit, log |
| Plan file missing at execution time | STOP. Tell the human. Do not invoke GSD or re-plan |

---

## RULES -- load on demand only
| Doing... | Read |
|---|---|
| Any UI | @rules/frontend-design.md |
| Exploring before building | @rules/brainstorming.md |
| Any feature | @rules/development-workflow.md |
| Data fetch or form | @rules/data-and-forms.md |
| Components / a11y | @rules/quality.md |
| Any bug or failure | @rules/systematic-debugging.md |
| Claiming done / committing | @rules/verification-before-completion.md |
| Feature complete | @rules/documentation-hooks.md |
| Parallel team build | @rules/parallel-workflow.md |

---

## SESSION END
1. Update HANDOFF.md: Quick resume + Current state + Session log row (Owner column).
1a. Append to HANDOFF.md "Iteration Log": what was assumed, what changed, demo impact.
2. Set `HANDOFF_SYNCED_COMMIT: <HEAD hash>`.
3. Run `bash scripts/complete-task.sh <task-id>` if task is fully done.
4. Commit and push.
Stop hook blocks close if skipped.
