# HANDOFF.md

HANDOFF_SYNCED_COMMIT: none

> **Size budget: Quick resume + Current state must stay under 60 lines combined.**
> This summary is injected into every session start by the SessionStart hook. Last event
> it reached 16KB and every session paid that cost before doing any work. When it grows,
> move detail into docs/session-archive.md, do not raise the budget.

## Quick resume
Fresh template, no project yet. First action: lead fills DAY1.md EVENT CONFIG, then runs the Ideation Sprint (Prompt 2a in README.md). No code before docs/CONCEPT.md is committed.

## Current state
- Phase: template ready, no event configured
- Next: fill DAY1.md EVENT CONFIG, run Ideation Sprint, lock docs/CONCEPT.md, then planning (Prompt 2b)

## Standing blockers
- [ ] Fill DAY1.md EVENT CONFIG (lead, Day 1 morning, before anything else)
- [ ] Add teammates as collaborators: GitHub > Settings > Collaborators
- [ ] Agree stack Day 1 during planning, fill into AGENTS.md
- [ ] Vendor skills on first session: `frontend-design`, `design-taste-frontend`, `find-skills` (see `docs/skills-setup.md`). Install all three, invoke ONE per design pass

## Infra & access blockers
This is the human-action ledger: accounts, dashboard settings, DNS, purchases, API keys,
anything Claude cannot do itself. Capture items the moment they surface so they can be
actioned in parallel with the build.

(none)

## Code failures & fixes
(none -- permanent log, never pruned)

## Session log
| # | Date/Time | Owner | Summary |
|---|---|---|---|

## Scope changes
(none)

## Document map
| Doc | Purpose | When |
|---|---|---|
| `CLAUDE.md` | Non-negotiables, Rule 0, decision table | Every session |
| `AGENTS.md` | Project facts, task queue, tokens, scope | Every session |
| `DAY1.md` | EVENT CONFIG (single source of event facts) + kickoff timeline | Day 1 morning |
| `SKILL.md` | Planning automation (run on Day 1 morning only) | Day 1 planning only |
| `rules/ideation-sprint.md` | 90-minute concept lock protocol | After problem drops, before planning |
| `docs/CONCEPT.md` | Locked concept, input to planning | Written during Ideation Sprint |
| `rules/frontend-design.md` | Rule 0: one design authority, art direction, visual gate | Before any UI |
| `docs/postmortem-2026-09.md` | Why the process is shaped this way | Before changing the process |
| `rules/brainstorming.md` | Structured ideation before building | When direction is unclear |
| `rules/development-workflow.md` | Feature build order | Building a feature |
| `rules/data-and-forms.md` | Fetch + form standards | Fetching data or building forms |
| `rules/quality.md` | Components, a11y, performance | Writing components |
| `rules/systematic-debugging.md` | 4-phase root-cause debugging | Any bug or failure |
| `rules/verification-before-completion.md` | Evidence before claims | Before claiming done |
| `rules/documentation-hooks.md` | Doc update triggers | After finishing a feature |
| `design-system/README.md` | Design tokens reference (fill after Rule 0) | Before any UI decisions |
| `docs/pitch-playbook.md` | P1-P3 pitch tasks: script, deck, rehearsal | After feature freeze |
| `docs/demo-prep.md` | Feature freeze schedule + demo checklist | Freeze day |
| `docs/skills-setup.md` | Standing skills install instructions | First session only |
| `docs/git-integration.md` | Multi-agent git sync protocol | Coordinating with teammates |
| `docs/session-archive.md` | Old session log entries | Reference only |
