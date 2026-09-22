# HANDOFF.md

HANDOFF_SYNCED_COMMIT: none

> **Size budget: Quick resume + Current state must stay under 60 lines combined.**
> This summary is injected into every session start by the SessionStart hook. Last event
> it reached 16KB and every session paid that cost before doing any work. When it grows,
> move detail into docs/session-archive.md, do not raise the budget.

## Quick resume
Planning nearly done. Concept LOCKED in `docs/CONCEPT.md` (NewArrival: four facts derive a dated, sourced obligation timeline for a new arrival to Australia). Phases 1 to 4 are planned and pushed; Phase 5 was re-running at session end, so check `.planning/phases/05-*/` before assuming it exists. **Blocked on one human action: Abhi must authorise Vercel on `abhi9632/newarrival`, see `docs/manual-actions.md`.** Repo is `abhi9632/newarrival`, NOT the template. Verify plans with `bash scripts/check-plan.sh <N>` before building.

## Current state
- Phase: planning. Build not started. Phase 1 executes first, once Vercel is authorised.
- Concept: four facts (visa subclass, citizenship, arrival date, state) derive the timeline. Signature moment is the perturbation cascade: drag the course end date, obligations across three agencies recompute, and the ones that should hold must visibly hold.
- Scope locked at 2 subclasses (500, 482) x 2 citizenships (India, Italy) x 2 states (VIC, NSW). A third value of anything is v2 and is refused.
- Design authority LOCKED: `design-taste-frontend`, single authority, every screen, then `emil-design-eng` sequentially. Rule 0 is discharged in Phase 1; later phases build against those tokens and never pick a second authority.
- ENGINE-01 is the gating requirement: no per-profile hardcoded output anywhere, or the pitch claim is false. Phase 3 ships a runnable check for it.
- Engine interface is `derive(records, profile, today)` in `src/lib/derive.ts`. Corpus is the first parameter and the reference date is injectable; Phase 4's cascade check depends on both.
- Clock: feature freeze 19:30, demo 23:30 on 2026-09-22. Roadmap estimates 4h36m against 5h45m.
- The Ledger (dollar counter) is deliberately v2. Do not let it creep into v1.

## Standing blockers
- [ ] **Vercel not authorised on `abhi9632/newarrival`.** Blocks Phase 1 completion and therefore SHIP-03. Click path in `docs/manual-actions.md`.
- [ ] Confirm Phase 5's plan exists and is valid. Its planner was killed once by a rate limit and re-run.
- [ ] Every legal figure in the rules corpus must be verified against its live .gov.au source during Phase 2, with the check date recorded. Nothing from model memory. Phase 2 ships an 11 gate validator that enforces it.
- [ ] Repo is private. Flip to public if judges need source: `gh repo edit abhi9632/newarrival --visibility public`.

## Infra & access blockers
This is the human-action ledger: accounts, dashboard settings, DNS, purchases, API keys,
anything Claude cannot do itself. Capture items the moment they surface so they can be
actioned in parallel with the build.

(none)

## Code failures & fixes
(none -- permanent log, never pruned)

**Tooling trap found during Phase 1 planning (2026-09-22):** the long-dash sweep nearly
shipped broken on this machine. `grep -P` exits 2 ("supports only unibyte and UTF-8
locales"). The shell dollar-quote escape form expanded correctly in one invocation but
silently failed to expand in a chained one, where it then matched almost every line and
would have failed the gate on a clean file. The working form, used in every plan, builds
each dash from its UTF-8 bytes with printf octal escapes:

    grep -rIn -e "$(printf '\342\200\224')" -e "$(printf '\342\200\223')" src/

Do not "simplify" it back.

**Rate limit killed two planners mid-flight (2026-09-22, session limit).** Phase 3's planner had
written all three PLAN.md files but died before committing; the files were intact and were
validated then pushed rather than regenerated. Phase 5's planner had written nothing and was
re-run from scratch. Lesson, already in CLAUDE.md but now with evidence: an agent that does not
commit before it reports back can lose everything. Planner prompts now carry an explicit
instruction to commit and push before returning.

**Phases 3 and 4 disagreed on the core interface (2026-09-22).** They were planned concurrently,
so neither saw the other's output. Phase 3 specified `derive(records, profile, today)` in
`src/lib/derive.ts`; Phase 4 was written against `deriveObligations(rules, profile, referenceDate)`
in `src/lib/engine.ts`. The architecture agreed (corpus first, injectable date), only the names
differed, but Phase 4's cascade check greps a hardcoded path so it would have failed at execution
rather than degrading quietly. Fixed by renaming Phase 4's 15 references onto Phase 3's names.
General lesson: concurrent planners that share an interface need the contract pinned in both
prompts, or a reconciliation pass before execution. Two further traps, both hit while writing this note: those octal
escapes are consumed if the command is authored through a shell heredoc, so edit that line
with a file-editing tool instead; and a note that quotes the literal dash characters makes
the repo-wide sweep fail on the note itself, which is why this paragraph never shows them.

## Session log
| # | Date/Time | Owner | Summary |
|---|---|---|---|
| 1 | 2026-09-22 11:25-13:05 | Abhi + Claude | `/kickoff` stages 0-5. Filled DAY1 EVENT CONFIG (practice run, Australia, prototype, fallback rubric, freeze 19:30). Ran the Ideation Sprint: 14 candidates scored, finalists were the Simulator and the Ledger, lead picked the Simulator with the Ledger deferred to v2. Locked `docs/CONCEPT.md`, concept gate exit 0. Moved the repo off the template to `abhi9632/newarrival` and force-reset the template's main back to a201104. Installed GSD, wrote PROJECT.md, config.json, REQUIREMENTS.md (31 v1 reqs) and a 5-phase ROADMAP.md. Roadmap APPROVED by Abhi. Phase plans written by gsd-planner, 2 concurrent (the CLAUDE.md cap). Opened `docs/manual-actions.md` with the Vercel authorisation step. Phases 1 to 4 planned and pushed; a rate limit killed two planners, Phase 3's output was rescued from disk and Phase 5 was re-run. Reconciled a real interface mismatch between the Phase 3 and Phase 4 plans. |

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
