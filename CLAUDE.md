# CLAUDE.md

> HANDOFF.md auto-loads via SessionStart hook. That summary is your state. Do not
> re-read the whole file unless the summary is missing something you actually need.

Nothing else is loaded up front. Every `rules/` file is load-on-demand, from the
tables at the bottom. Read what the task needs, not the repo.

---

## EFFORT TIERS -- match the ceremony to the task

The single biggest time sink last event was running full task ceremony on trivial work.
Pick the tier first, in one line, then work at that tier.

| Tier | What it is | Process |
|---|---|---|
| **Quick** | Commit, push, copy fix, token tweak, config, one-line bug, answering a question | Just do it. No plan file, no task queue, no HANDOFF update, no verification ritual. The commit message says what changed. |
| **Feature** | A component, a screen, a data flow, anything a judge will click | Read the plan section for your task, build, verify per `rules/verification-before-completion.md`. UI also passes the visual gate. Commit and push. Update HANDOFF at session end. |
| **Foundation** | T1, architecture, design direction, deploy pipeline | Full process. Rule 0 if visual. Plan file in full. |

If you cannot name the tier, it is Feature. Never run Foundation ceremony on Quick work.
Never claim a tier down to skip the visual gate on a screen a judge will see.

### Model routing

Match the model to the tier. Requested during the last event and worth keeping:
"use sonnet 5 for building easy stuff and opus 5 for complex tasks".

| Tier | Model |
|---|---|
| Quick | Sonnet |
| Feature | Sonnet for a component against an existing pattern, Opus for anything new or cross-cutting |
| Foundation, design direction, debugging a real bug | Opus |

---

## PUSH POLICY -- main only, push constantly

- **Push directly to `main`. Never create a branch. Never open a pull request.**
- Commit and push after **every completed unit of work**, not at the end of the task.
  A session that dies with uncommitted work loses all of it. This happened repeatedly
  last event: six parallel agents were killed by one rate limit and every one of them
  lost its work.
- If you are about to start something that takes more than ~10 minutes, commit what
  already works first.
- Never hold work back waiting for a task to be "finished properly".

---

## GIT IDENTITY -- enforced before every commit
- NEVER commit using the author name "Claude Code" or email "claude@anthropic.com".
- Before ANY git commit, run `git config user.name`. If missing or set to "Claude Code":
  STOP and ask: "What is your GitHub username and email?" Then set both via
  `git config --global`.
- Do NOT inject "Co-Authored-By: Claude" or "Generated with Claude Code" into commit
  messages. Attribution is disabled in .claude/settings.json.

---

## PROJECT
Scope mode, stack, and the judging rubric come from `DAY1.md` EVENT CONFIG -- the single
source of event facts. Read it before planning or building. Every feature must serve at
least one rubric criterion.

---

## JUDGING RUBRIC -- from DAY1.md EVENT CONFIG

The rubric lives in `DAY1.md` EVENT CONFIG. It is the single source; never hardcode
criteria here.
- Every feature must serve at least one rubric criterion. If a feature serves none, cut it.
- Weight effort by rubric points: the highest-weighted criterion gets the most build time.
- If the event published no rubric, EVENT CONFIG uses the fallback rubric from `SKILL.md`.

The plan is the specification. Do not re-plan or modify `.planning/` during execution.

---

## RULE 0 -- before ANY front-end code

**ONE design authority per pass.** Never load two design skills for the same design pass.
Stacking them averages strong opinions into the default look; that is what produced the
rejected "AI slop" landing page last event, and a single-skill pass fixed it with no
other change. Full process and the choice table: `rules/frontend-design.md`.

T1: pick one authority, invoke it, write the **Art direction** block in
`design-system/README.md` (Signature, Reference, Anti-reference, Type stance, Colour
world) and then the tokens.

V1x and later: read `design-system/README.md` and reinforce the Signature. You do not
re-run Rule 0, but you MAY run a fresh single-authority pass on a screen that looks
generic. A generic screen is a bug.

**Visual gate, every UI task:** run the app, screenshot the real screen at 375 and 1280,
and answer in writing: could this be any other team's project with the logo swapped?
If yes, it is not done. Tokens are not evidence. The screenshot is.

---

## NO EM DASHES -- ever. Use comma, colon, semicolon, or split the sentence.

---

## IDENTITY
Possibly one of several Claude Code sessions on the same repo. The repo is the only
shared source of truth; git is the integration layer. Pull before a task, push after
every unit. Coordinate through AGENTS.md only.

**Solo or two-person team: skip the task queue entirely.** The claim/complete scripts
exist for 3+ parallel sessions. Below that they cost more than they coordinate. Last
event the queue was never filled and the rows still read `[fill Day 1]` at the end,
while every session prompt still demanded them. Work straight from the AGENTS.md scope
and `docs/CONCEPT.md`, and keep HANDOFF.md current.

---

## MACHINE HYGIENE

- One dev server at a time. Kill the old one before starting a new one. Background dev
  servers were killed twice last event with "system is running low on memory", which
  silently breaks every screenshot and verification step that follows.
- Never hardcode a token, key or password in any file, including demo pages and
  dashboards. Runtime config goes in localStorage, an env var, or the host dashboard.

---

## SUBAGENTS -- cap at 2 concurrent

- Never spawn more than 2 agents at once.
- Every agent commits and pushes its own work before it reports back.
- Do not fan out work you have not committed. Six concurrent agents were wiped by a
  single session rate limit last event, losing all of it.

---

## SESSION START

1. Read the HANDOFF summary the hook printed. That is your state.
2. Name the effort tier for what you have been asked to do.
3. **Quick tier: start now.** No queue check, no plan file, no further reading.
4. Feature or Foundation tier:
   - If a task queue is in use, confirm your task ID and read its row in AGENTS.md.
   - Run `bash scripts/check-plan.sh <phase>` (T1=1, V1x=2, V2x=3, V3=4) and read the
     section of the plan for your task ID. Not the whole phase, your section.
   - Confirm the work serves a rubric criterion in DAY1.md EVENT CONFIG.

**If the plan file is missing, do not stop.** Say so in one line, then build from
`docs/CONCEPT.md` plus the AGENTS.md scope and task description, and note the assumption
in HANDOFF.md. A missing plan file is not a reason to sit idle during a hackathon. It
was a hard STOP in the old template; `.planning/` was never created last event, so that
rule was either blocking every task or being ignored on every task.

---

## PLANNING SESSION -- runs once on Day 1

- Read SKILL.md. Run its phases in sequence. Stop after the roadmap is approved.
- Fill the AGENTS.md task queue only if 3+ sessions will run in parallel.
- Commit message when done: "chore: task queue ready -- build phase open"

---

## DECISION TABLE
| Situation | Action |
|---|---|
| Anything at all | Name the effort tier first |
| Quick tier work | Do it, commit, push. No ceremony |
| About to write feature code | Confirm it serves a rubric criterion in DAY1.md EVENT CONFIG |
| Any UI work | ONE design authority. T1 also writes Art direction. `rules/frontend-design.md` |
| About to call a screen done | Visual gate: screenshot 375 + 1280, judge it, log it |
| Screen looks generic | Fresh single-authority pass on that screen. Do not ship it |
| Human names 3 design skills at once | Pick one, say which and why, treat the rest as unread |
| Plan file missing | Say so, build from CONCEPT.md + AGENTS.md, log the assumption. Do not stall |
| Finished any unit of work | Commit and push now, do not batch |
| Spawning agents | Max 2. Each commits its own work |
| Exploring a problem | `rules/brainstorming.md` |
| Bug or unexpected behaviour | `rules/systematic-debugging.md` |
| About to claim done | `rules/verification-before-completion.md` |
| Need an unknown capability | `find-skills` before improvising |
| Scope addition not in plan | Ask first, do not build |
| Library or API currency uncertain | search the web, never guess |
| Teammate file conflict | Pull, resolve (keep latest Status and Claimed By), commit |

---

## RULES -- load on demand only
| Doing... | Read |
|---|---|
| Any UI | `rules/frontend-design.md` |
| Exploring before building | `rules/brainstorming.md` |
| Any feature | `rules/development-workflow.md` |
| Data fetch or form | `rules/data-and-forms.md` |
| Components / a11y | `rules/quality.md` |
| Any bug or failure | `rules/systematic-debugging.md` |
| Claiming done | `rules/verification-before-completion.md` |
| 3+ parallel sessions | `rules/parallel-workflow.md` |
| Feature complete | `rules/documentation-hooks.md` |

---

## SESSION END
1. Update HANDOFF.md: Quick resume + Current state + one Session log row.
   Keep Quick resume + Current state under 60 lines combined. That summary is injected
   into every future session start; last event it reached 16KB per session.
2. Commit (the same commit that touches HANDOFF.md) and push.
3. Run `bash scripts/complete-task.sh <task-id>` only if the queue is in use.

The Stop hook checks that your last commit touched HANDOFF.md. One commit, not two.
For a Quick-tier session that changed nothing worth handing off, put `no-handoff` in the
commit message.
