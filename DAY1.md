# Day 1 Kickoff

Everyone reads this first. Everything you need is here.

---

## EVENT CONFIG (filled 2026-09-22 11:31 AEST)

This block is the single source of truth for every event-specific fact. No other file
hardcodes the rubric, scope, stack, dates, or freeze time. They all point here.

**Event**
| Field | Value |
|---|---|
| Event name | Practice run (mock_3), self-run |
| Dates | 2026-09-22, single day |
| Venue | Remote, solo |

**Judging rubric**

No published rubric. This is a self-run practice event with no organiser, no rules page,
no Discord and no sponsor, so there is nothing to check. Fallback rubric from `SKILL.md`
adopted as the scoring model.

| Criterion | Weight | What judges look for |
|---|---|---|
| Problem clarity | equal (20%) | The problem is specific and immediately obvious |
| Solution quality | equal (20%) | The solution actually addresses the problem |
| UX polish | equal (20%) | The demo looks and feels designed, not templated |
| Feasibility | equal (20%) | The approach is realistic and the tech choice is explainable |
| Presentation | equal (20%) | The story is clear and easy to follow in about 3 minutes |

**Pitch and demo length**
| Field | Value |
|---|---|
| Pitch length (hard limit) | 3 min |
| Q&A after pitch | No |
| Demo inside the pitch | Live app |

**Scope mode** -- pick one:
- `prototype`: mock data only, no backend. Every data path is static JSON or hardcoded objects.
- `full-stack`: real backend allowed. Adds a backend/data task to the plan and a deploy path that runs it.

Chosen: `prototype`

**Country / jurisdiction**: Australia. All rules, agencies, visa subclasses and dollar
figures in the product are Australian and must be traceable to a named real source.

**Stack** -- chosen Day 1 during planning: Next.js (App Router) + TypeScript + Tailwind

**Deploy target**: Vercel. Deploy is part of T1, so every push produces a live URL.

**Team roster**
| Name | GitHub handle | Machine |
|---|---|---|
| Abhi | @abhi9632 | Windows 11 |

**Timeline**
| Milestone | Time |
|---|---|
| Problem announced | 11:25 |
| Ideation sprint start | 11:35 |
| Ideation sprint end (hard stop, +90 min) | 13:05 |
| Planning done (target) | 13:45 |
| V1 demoable (target) | 17:00 |
| FEATURE FREEZE (hard) | 19:30 |
| Demo | 23:30 |

Rule: feature freeze must be at least 4 hours before demo. After freeze, only V3 polish
and P pitch tasks are claimable. No new features.

---

## Timeline

```
Problem announced
  +5 min   Ideation Sprint starts (90 min, hard stop) -- lead + Claude,
           rules/ideation-sprint.md. Ends with docs/CONCEPT.md committed and pushed.
           Everyone else: open Claude Code, paste builder prompt below, wait.
  +95 min  CONCEPT.md locked. Lead opens planner session, pastes planner prompt.
  +125 min Lead pushes "chore: task queue ready" -- announces in group chat.
           Everyone: tell your Claude "pull latest and run next-task.sh".
  +130 min 3+ tasks claimable -- each person claims one and starts building.
  V1       First V1 vertical lands -- something judges can touch.
```

Actual clock times for each milestone live in EVENT CONFIG above.

---

## Lead -- Ideation Sprint (runs first, before planning)

The moment the problem drops, the lead runs the Ideation Sprint with Claude. This is the
headline fix for the team's biggest past failure: hours lost brainstorming, a weak concept
locked late. The sprint locks a strong concept in 90 minutes, hard stop.

1. Open Claude Code
2. Paste **Prompt 2a** from `README.md` with the problem statement
3. Claude runs `rules/ideation-sprint.md` and enforces the 90-minute clock
4. At T+90, one concept is LOCKED and written to `docs/CONCEPT.md`
5. Claude commits and pushes `docs/CONCEPT.md` before the planner session opens

No code before `docs/CONCEPT.md` exists and is committed.

---

## Lead -- Planner session (only after CONCEPT.md is locked)

1. Open Claude Code
2. Paste **Prompt 2b** (Planning) from `README.md`. Brief = `docs/CONCEPT.md` + EVENT CONFIG above
3. Answer Claude's questions about the concept
4. Approve the roadmap when proposed
5. Run `/gsd-plan-phase [N]` for **every** phase before opening the build phase. Each run
   writes the real spec to `.planning/phases/[N]-*/[N]-01-PLAN.md` -- this is what every
   builder reads before coding. Do not skip a phase.
6. Fill the AGENTS.md task queue with short summaries that point at those plan files
7. **Commit all `.planning/` files** (plans, ROADMAP, STATE, REQUIREMENTS) together with
   AGENTS.md before signalling the team. Builders cannot read a plan that was never pushed.
8. Claude commits "chore: task queue ready" -- announce this in the group chat
9. Close the planner session. Open a **new** Claude session
10. Paste the builder prompt below, claim a task, start building

**Why this matters:** builders build from the GSD plan file, not from the one-line task
summary. If a phase was never planned or the `.planning/` files were never committed, every
builder on that phase stalls. Plan all phases and push `.planning/` before you say "ready".

---

## Everyone else -- Builder session

Environment is already set up via Claude Code project settings. Just open Claude Code and paste:

```
Read CLAUDE.md, AGENTS.md, HANDOFF.md, and all files in rules/
Then follow the SESSION START instruction in CLAUDE.md.
Wait for me to confirm before claiming anything.
```

Once you claim a task, the first thing your Claude does before any code is run
`bash scripts/check-plan.sh <phase>` and read the GSD plan file it points to. That plan
file (`.planning/phases/[N]-*/[N]-01-PLAN.md`) is your spec, not the AGENTS.md summary.

Claude will run `next-task.sh`. If it shows "CLAIMABLE NOW: none" or only T1:
- The planner is still working -- this is expected
- Use this time to read AGENTS.md and HANDOFF.md so you understand the project
- Watch for the lead's message in the group chat: "task queue ready"
- When it arrives: tell your Claude "pull latest and run next-task.sh"
- You will see 3+ claimable tasks with a parallel suggestion
- Say "claim V1a" (or whichever the suggestion shows for you)

### If T1 is taking longer than expected (>40 min)

Tell your Claude:
```
T1 is not done yet. Read docs/CONCEPT.md and the problem statement from HANDOFF.md
and brainstorm the component structure for your assigned vertical so we are ready
to build the moment T1 lands. Do not write any code yet. Use rules/brainstorming.md.
```
This keeps you productive without creating conflicts.

---

## Task naming convention

| Prefix | Meaning |
|---|---|
| T1 | Shared foundation -- one person, others wait (max 30-40 min) |
| V1x | Version 1 -- minimum demoable prototype, highest priority |
| V2x | Version 2 -- second priority, build if V1 is done |
| V3 | Polish, deploy, mobile verify -- always last |
| P | Pitch tasks: script, deck, rehearsal -- final phase, claimable after feature freeze |

V1 is done when all V1x tasks are marked done. At that point you have a fully demoable prototype. Announce it in the group chat.

---

## Key commands (Claude runs these for you)

```bash
bash scripts/next-task.sh                      # what is claimable right now
bash scripts/claim-task.sh <task-id>           # e.g. claim-task.sh V1a
bash scripts/complete-task.sh <task-id>        # e.g. complete-task.sh V1a
```

You never run these directly -- tell your Claude which task to claim/complete and it handles it.

---

## If you finish a task and nothing is claimable

Tell your Claude:
```
Run next-task.sh. If nothing is claimable, show me what is in-progress
and suggest how I can help the person closest to finishing.
```
Options: PR review, write tests, help debug, work on documentation.
Never sit idle.
