# docs/pitch-playbook.md

## Length comes from DAY1.md EVENT CONFIG

Read the pitch length there before writing a word. Do not assume three minutes; last
event it was two, and the script had to be rewritten three times because it was built
for the wrong clock.

| Pitch length | What fits |
|---|---|
| 2 min | Intro + hook (20s), problem (25s), live demo (60s), close (15s). Nothing else. No architecture segment, no team slide, one flow only. |
| 3 min | The full table below. |

At 2 minutes, cutting is the job. Pick the ONE flow that proves the concept and drop
every other feature from the script, however good it is.

## Write it as a script, not as a table

Deliver actual sentences the speaker reads, not a structure they have to improvise
against. Last event the first draft was a segment table and the feedback was: "i dont
like how it starts. there must be an introduction as well. a proper script".

Every pitch opens with, in this order:
1. **Introduction**: who is speaking and what the product is called, in one sentence.
   Judges need a name to attach the next 2 minutes to. Never open cold on a statistic.
2. **Hook**: the one line that makes a tired judge look up.
3. Then the problem.

## Principle

The deliverable is a 3-minute experience for a tired judge who has seen 30 teams. Pitch is
built, rehearsed, and versioned like code, not improvised the night before.

---

## P1 -- Pitch script

Structure:
| Segment | Time | Content |
|---|---|---|
| Hook | 10s | One line that makes the judge lean in |
| Problem | 30s | Told through the persona, not abstractly |
| LIVE DEMO | 90s | Click-path only, no slides |
| How it works | 20s | Architecture in plain language |
| Feasibility path | 20s | What happens after the hackathon |
| Close / ask | 10s | Memorable line + what you want from judges |

### Click-path demo script template

```markdown
| Step | Exact click | Say while clicking | Timing |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
```

Numbered, exact clicks. What to say during each. Timing per step. Rule: never demo anything
not rehearsed 3 times.

---

## P2 -- Deck in product design language

Build the deck as HTML slides in the repo (e.g. `/pitch` route or `pitch/deck.html`), styled
with `design-system/README.md` tokens: same fonts, colors, spacing, components as the
product. Deck and product read as one designed thing -- judges register coherence as polish.

Slides:
1. Title
2. Problem
3. Persona
4. Demo cue slide (then switch to the live app)
5. Architecture / how it works
6. Feasibility / roadmap
7. Team
8. Close

Requirements: keyboard navigation, works offline, 16:9.

---

## P3 -- Rehearsal

- 3+ timed full runs.
- Roles assigned: driver (clicks), speaker (talks).
- Projector/resolution check.
- Backup plan: screen-recorded demo video captured after freeze, plus deployed URL AND
  local fallback ready.

**Log every run below.** `scripts/check-freeze.sh` counts these rows; fewer than 3 fails
the freeze gate. This exists because two past projects had their deploy and rehearsal
steps slip past the actual deadline with nothing tracking that they hadn't happened yet.

| # | Time | Result (clean / stumbled where) |
|---|---|---|
| | | |
| | | |
| | | |

---

## Freeze coupling

P1-P3 are claimable only after feature freeze (time from DAY1.md EVENT CONFIG). See
`rules/ideation-sprint.md` for how the concept these slides pitch got locked, and
`docs/demo-prep.md` for the freeze-day checklist these tasks feed into.

## After P3

Run `bash scripts/check-freeze.sh`. If it passes, the last task is
`docs/submission-checklist.md` -- actually submitting is not implied by "the demo works".
