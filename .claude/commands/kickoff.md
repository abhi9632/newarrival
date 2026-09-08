---
name: kickoff
description: Day 1 chain -- ideate, lock the concept, plan with GSD, open the build. Resumes wherever it left off.
argument-hint: "[problem statement, or nothing if the event has not published one]"
---

# /kickoff -- Day 1, problem to buildable queue, one command

`$ARGUMENTS` is the problem statement, if the event published one. It may be empty.

This is one continuous session. Run the stages in order and **auto-advance between them**.
Stop only at the two decision points marked STOP. Do not ask the human to paste another
prompt between stages: re-prompting between stages is what made this take half a morning
last event.

Announce each stage as you enter it, in one line: `STAGE n/6: <name>`.

---

## STAGE 0 -- Resume check (always first, costs one command)

```bash
bash scripts/check-concept.sh; echo "concept_exit=$?"
ls .planning/ROADMAP.md .planning/phases/*/[0-9]*-PLAN.md 2>/dev/null
```

Jump to the first stage that is not already done:

| State on disk | Start at |
|---|---|
| No `docs/CONCEPT.md`, or check-concept exits 1 | Stage 1 |
| CONCEPT.md locked, no `.planning/ROADMAP.md` | Stage 3 |
| ROADMAP.md exists, no phase PLAN files | Stage 5 |
| Phase PLAN files exist | Stage 6 |

Say in one line which stage you are starting at and why. Never redo a completed stage.
Never re-ideate a locked concept.

---

## STAGE 1 -- Event config

Read `DAY1.md` EVENT CONFIG. If the judging rubric, scope mode, pitch length, or the
feature freeze and demo times still read `[fill]`, ask the human for those values **in one
message, as one list**, then write them into DAY1.md and commit. Everything downstream
reads the rubric from here, so an unfilled rubric silently breaks concept scoring.

Do not ask about fields the event has not announced yet. Record those as `TBD` and carry on.

---

## STAGE 2 -- Ideation Sprint

Read `rules/ideation-sprint.md` and run it now, in this session, enforcing its 90-minute
clock and announcing each phase transition.

Two entry cases:

- **Problem statement given** (`$ARGUMENTS` is non-empty, or the human pasted it):
  start at DECOMPOSE with that statement.
- **No problem statement**: run the FRAME phase in `rules/ideation-sprint.md` first, which
  derives a problem statement from the event theme, sponsor, track, and audience, and has
  the human pick one. Then continue into DECOMPOSE with the derived statement.

**STOP 1 (the only unavoidable human decision):** at CONVERGE, present the two finalists
and their scores and ask the lead to pick one. One question, one answer, then continue.

Write `docs/CONCEPT.md` from the template in `rules/ideation-sprint.md`, commit it, push it.
Never create a second concept file.

---

## STAGE 3 -- Concept gate

```bash
bash scripts/check-concept.sh
```

Exit 0: continue. Exit 1: fix exactly what it names inside `docs/CONCEPT.md`, commit,
re-run. Do not proceed into planning on a half-filled concept.

---

## STAGE 4 -- GSD preflight

```bash
bash scripts/ensure-gsd.sh
```

This installs GSD Core for this machine if it is missing. GSD is deliberately not committed:
its installer bakes machine-absolute paths into every file it writes.

- Exit 0: continue to Stage 5.
- Command exists but `/gsd-new-project` is not recognised: the session started before the
  install. Tell the human to restart the session and run `/kickoff` again. Stage 0 will
  resume from here, nothing is lost.
- Install fails: **do not stall.** Say so in one line and run the fallback in
  `SKILL.md` Phase 2, "If GSD is unavailable". The hackathon does not stop for a package.

---

## STAGE 5 -- Planning

Read `SKILL.md` and run its Phases 1 through 4 in sequence, without pausing for a new
prompt between them. The planning input is `docs/CONCEPT.md` plus DAY1.md EVENT CONFIG,
never the raw problem statement, and never a fresh round of ideation.

**STOP 2:** SKILL.md Phase 4 is the approval gate. Present it and wait for `APPROVED`.

---

## STAGE 6 -- Open the build

Once the roadmap is approved:

1. Run `/gsd-plan-phase [N]` for every phase in the roadmap, in order.
2. Verify each one: `bash scripts/check-plan.sh [N]`. Every phase must return a plan path.
3. Commit and push all `.planning/` files.
4. Only if 3 or more sessions will build in parallel, fill the AGENTS.md task queue
   (`rules/parallel-workflow.md`). Solo or pair: skip the queue, build from CONCEPT.md and
   the AGENTS.md scope. An unfilled queue that every prompt demands is worse than no queue.
5. Report, in five lines or fewer: concept in one sentence, phase count, feature freeze time,
   demo time, and the first task to build.

Then stop. Building starts with README Prompt 4, in a fresh session.
