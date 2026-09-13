# Postmortem: NCS Hack for Humanity, September 2026

Why this file exists: the template changes it describes look like they weaken the process
(less reading, less ceremony, fewer skills, softer stops). They do not. Each one is a
response to a specific, measured failure. Read this before reverting any of them.

Source: the Claude Code session transcripts for that event, 158 human messages across
30 sessions.

---

## Failure 1: the design was rejected as AI slop

### What happened

In the design session, four complete design systems were loaded inside 58 seconds:

| Time | Skill |
|---|---|
| 09:51:46 | `frontend-design` |
| 09:51:51 | `design-taste-frontend` |
| 09:52:24 | `impeccable` |
| 09:52:44 | `awwwards` |

Then four more, 30 minutes later: `motion-principles`, `framer-motion`, `css-native`,
`cast`. Eight skills, one pass. The taste skill alone is roughly 88KB of instruction.

The human's verdict: *"the preview landing page looks bad. i dont think the design plugins
and skills were used for it. redesign it entirely and make sure that it doesnt look like
an AI slop."*

The next day, one skill was invoked alone (`design-taste-frontend`, 04:33:51) with the
instruction *"use the taste skill on the landing page and polish the landing page"*. Same
page, same codebase, same model. That result was accepted.

### Root cause

Two of them, both in the template.

**a. Rule 0 mandated stacking.** The old rule said "invoke `frontend-design` then
`design-taste-frontend`", with no arbitration between them and no ceiling on adding more.
Each design skill is a complete opinionated system with its own decision procedure. Run
together they do not compose, they average, and the average of several strong opinions is
the default look. Having mandated two, the template had no ground to refuse four.

**b. Rule 0 produced tokens, not a design.** The gate was "fill in
`design-system/README.md`" with colours, fonts, radii and spacing. You can pass that gate
completely and still ship a layout indistinguishable from every other team's. The old
`rules/frontend-design.md` did mention a "Signature", but as one bullet inside a section,
not as the gate.

**c. Nothing ever looked at the result.** `verification-before-completion.md` asked for
"component renders, visual check at 375px and 1280px". Renders, not "is designed". The
session that produced the good design ran a screenshot-judge-adjust loop (16 screenshots,
multiple viewports). The session that produced the slop wrote code from four skills and
never evaluated the output.

### Fixes

- `rules/frontend-design.md` rewritten: ONE design authority per pass, with a table
  mapping brief type to authority, and an explicit instruction for what to do when the
  human names several skills at once (pick one, say which, treat the rest as unread).
- Motion and implementation skills reclassified as non-authorities, loadable only after
  the direction is locked.
- `design-system/README.md` now opens with an **Art direction** block (Signature,
  Reference, Anti-reference, Type stance, Colour world, Motion stance), filled before
  tokens.
- **Visual gate** added: no UI task is done until the real screen is screenshotted at
  375 and 1280 and judged against the question "could this be any other team's project
  with the logo swapped?". Logged in a table in `design-system/README.md`.
- The blanket ban on re-running design work after T1 is gone. A generic screen is a bug,
  and a fresh single-authority pass on it is allowed.

---

## Failure 2: everything took too long, including commit and push

Five separate causes, all in the template.

### a. The Stop hook forced two commits per session

`handoff-check.sh` blocked session end unless `HANDOFF_SYNCED_COMMIT` in HANDOFF.md
equalled current HEAD. You cannot know HEAD until after you commit, so the only way to
satisfy it was: commit the work, edit the marker, commit again. The project's own git
history proves it ran that way: `docs: bump HANDOFF_SYNCED_COMMIT` and `docs: sync
HANDOFF for session 14, HANDOFF_SYNCED_COMMIT to 8fa1d27`.

**Fix:** the gate is now "did the last commit touch HANDOFF.md". One commit. A
`no-handoff` opt-out exists for trivial sessions. Verified against root commits, merge
commits, clean and dirty trees.

### b. The SessionStart hook injected 16KB into every session

`print-handoff.sh` printed HANDOFF.md's Quick resume and Current state verbatim, with no
cap. By the end of the event HANDOFF.md was 61KB and the hook was emitting 16.5KB at the
start of every session, before any work, including sessions that only needed a one-line
fix. It also ended with a hard "WAITING FOR HUMAN AUTHORISATION. Do NOT begin any work.
Do NOT run any scripts." wall on every single session.

**Fix:** 60-line cap, measured output down from 16,549 to 4,387 bytes against the same
file, plus an explicit "your HANDOFF is over budget, prune it" message. The authorisation
wall is gone. HANDOFF.md itself now carries the 60-line budget as a rule.

### c. Uniform ceremony regardless of task size

Old Prompt 4 was six mandatory pre-steps and four post-steps for every task, no matter
how small: pull, read the AGENTS row, derive the phase, run check-plan.sh, read
`rules/development-workflow.md` in full, read the whole phase plan in full, then build,
then verify, then run nine documentation hooks, then update four HANDOFF sections, then
complete-task.sh, then commit and push. There was no fast path for "fix this label".

**Fix:** three effort tiers (Quick / Feature / Foundation) in CLAUDE.md, threaded through
`development-workflow.md`, `verification-before-completion.md` and the README prompts. A
new Prompt 5 exists for Quick work. Verification scales to the tier.

### d. Mandatory reading that was never needed

`CLAUDE.md` eagerly imported `rules/parallel-workflow.md` (183 lines) and
`rules/verification-before-completion.md` on every session, while claiming in its own text
that rules load on demand. Prompts 1 and 3 both said "read every file in this repo" and
"thoroughly go through every bit of code in the repo".

**Fix:** eager imports removed. Prompts trimmed to CLAUDE.md plus the hook summary, with
rules loaded when a task calls for them.

### e. A coordination layer nobody used

`.planning/` was never created during the event. The AGENTS.md task queue was never
filled: at the end, rows still read `[fill Day 1]` with status `blocked`. Yet CLAUDE.md,
AGENTS.md, `development-workflow.md` and Prompt 4 all required consulting the queue and
reading a phase plan file before any code, and required a hard **STOP** if the plan file
was missing. Every task either blocked on a document that did not exist or silently broke
the rule.

**Fix:** the queue is now explicitly for 3+ parallel sessions only; solo and pairs skip
it. A missing plan file is no longer a stop: say so, build from `docs/CONCEPT.md` and the
AGENTS.md scope, and log the assumption.

---

## Failure 3: parallel agents lost their work

Six subagents were spawned concurrently. A single session rate limit terminated all six
at the same instant. None had committed. All of that work was lost.

The human then had to ask for the right behaviour three separate times:
*"keep pushing completed work"*, *"i need constant pushes becasue i might run out of
session tokens and i will be stuck later, without any progress"*, and
*"dont spawn too many agents at once. do it sequentially and keep pushing incrementally
so things dont get lost when the session ends due to token outage"*.

The old `parallel-workflow.md` pushed in the opposite direction: maximise parallelism,
"never put a task in the queue that only one person can claim". It said nothing about
subagent fan-out, commit cadence, or rate limits.

**Fix:** cap of 2 concurrent agents, each commits and pushes its own work before
reporting, never fan out on top of uncommitted work, push after every unit rather than at
task end. Stated in CLAUDE.md and `rules/parallel-workflow.md`, and the Stop hook now
warns on both uncommitted changes and unpushed commits.

---

## Things the human had to say that the template should have said

| Correction, repeated | Now written into |
|---|---|
| Push to main, never branch (said twice in the first message alone) | CLAUDE.md PUSH POLICY, README prompts 1, 3, 4 |
| Push constantly, I may lose the session (3 times) | CLAUDE.md PUSH POLICY, parallel-workflow.md, Stop hook warnings |
| Do not spawn so many agents | CLAUDE.md SUBAGENTS, parallel-workflow.md |
| Low on tokens, no extensive testing (twice) | Effort tiers, tier-scaled verification |
| The page looks like AI slop, redesign it (twice) | One-authority rule, Art direction block, visual gate |
| Is this even a usable product, it was supposed to be a working demo | `development-workflow.md` Day 1 foundations item 6: a running demo path before the first feature task closes |
| The admin screens look the same as the volunteer screens | Concept and plan must differentiate roles; call it out during ideation, not after build |
| No traces of Claude in commits | Already fixed: CLAUDE.md GIT IDENTITY, `.claude/settings.json` |

---

## Addendum: GSD was never actually installed

Found while checking for GSD updates after the event.

The template vendored a complete GSD Core install (332 files, 4.0MB, 93% of the repo's
file count) at version 1.4.5. Two things were wrong with it.

**The paths pointed at someone else's machine.** 170 of those files contained imports
like `@/home/user/claude_template/.claude/gsd-core/references/mandatory-initial-read.md`.
That directory exists on no machine any of us use, so every GSD agent, command and
workflow silently loaded nothing. Re-running the installer locally confirms why: it
writes machine-absolute paths into all ~460 files it manages. A vendored copy is only
ever correct on the machine that generated it, which makes vendoring GSD into a template
repo unfixable in principle, not just misconfigured.

**Its hooks were never wired.** The committed `.claude/settings.json` contained zero
`gsd-` hook entries.

So the GSD layer was inert from the initial commit, while CLAUDE.md, AGENTS.md,
`development-workflow.md` and Prompt 4 all treated its plan files as a hard prerequisite
and a hard STOP if missing. The Base44 mandate explains why nobody noticed.

**Fix:** GSD is no longer committed. `.gitignore` excludes everything the installer owns
and the Setup Script runs `npx -y @opengsd/gsd-core@latest --local --claude`, so every
machine gets a working install at the current version, with correct paths. The repo went
from 505 files to 37. `/gsd-update` keeps it current from there.

Also removed while in there: `.claude/commands/dev.md` was a tombstone pointing at
`/start`, and `.claude/commands/audit.md` referenced `rules/security.md` and
`rules/pre-launch-checklist.md`, neither of which exists in this template. `/audit` was
rewritten around files that do exist and now leads with a secret scan.

---

## Failure 4: a fully working, fully tested demo that still couldn't win

### What happened

A solo dogfood run of this template (OpenAI Build Week brief, Developer Tools track)
produced Spotter, a local static-code-review tool: real rule engine, 12/12 tests
passing, verified live in a browser, zero em dashes, HANDOFF current, every gate this
template runs scripted and green. The human's verdict: *"it was supposed to be an end
to end tested workflow... this cannot even be considered a finished product. it's a
tool. that's not what we're building for hackathon... i was hoping i would see a
complete site."* Every mechanical gate passed. The thing itself was not good enough.

### Root cause

Two, one execution and one template.

**a. The design authority was applied thinly, not wrongly.** `design-taste-frontend` is
the preferred authority even for product UI/dashboard briefs (confirmed: the human
prefers it over `frontend-design` generally). The session did invoke it, but only
extracted six CSS variables from it and stopped: no hero/intro moment, no imagery, no
motion beyond one progress rail, none of the skill's actual taste system (art direction,
layout craft, AI-tell avoidance) carried through into the build. Naming a skill and
sampling a palette from it is not the same as following it.

**b. Nothing in the template ever asked "would this look like a shipped product?"**
`rules/ideation-sprint.md` SCORE scored rubric fit, buildability, demo length and
distinctiveness. None of those catch "the concept is a mechanism with no product
surface around it." `SKILL.md` scope rules said "prototype: mock data, no backend, no
auth" and that got read, correctly by the letter and wrongly in spirit, as permission to
ship a bare single screen: one card, a paste box, a list. The visual gate only asked "is
this generic" and "does it match the tokens", never "does this clear the same bar as a
paying client's deliverable."

**c. `SKILL.md`'s own UI polish section contradicted Rule 0.** It said "run
`frontend-design` and `design-taste-frontend` once" in the same T1 pass. That is the
exact two-skill stacking pattern Failure 1 exists to prevent. Nobody had hit it yet
because past runs happened to only reach for one skill anyway.

### Fixes

- `rules/ideation-sprint.md` SCORE gained a fifth axis, Production value: would the
  built-out concept look like a shipped product or a bare utility screen. DIVERGE now
  requires every candidate to name its product surface, not just its mechanism.
- `docs/CONCEPT.md`'s template gained a locked **Design authority** field, filled at
  CONVERGE from the same table `rules/frontend-design.md` already had. Gated by
  `check-concept.sh`. The build session reads the pick, it does not re-derive it.
- `rules/frontend-design.md` and `CLAUDE.md` Rule 0 both gained a third visual-gate
  question: would this pass as a paying client's shipped deliverable, not just "is it
  generic". Functional and tested was never the same question as this one.
- `SKILL.md` Scope and UI polish sections rewritten: prototype scope constrains the
  backend, never the visual bar, and the UI polish section no longer tells anyone to run
  two design skills in one pass.
- Phase 4's rubric checklist gained a line: confirm the roadmap has an explicit task
  for the product surface (the wrapper), not only the mechanism.

---

## The one-line version

Stacking design skills produced worse design than using one. Uniform ceremony made small
tasks as expensive as large ones. A hook that could only be satisfied by committing twice
made every session end slowly. None of that was the model improvising; all of it was
written in the template.
