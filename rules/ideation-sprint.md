# rules/ideation-sprint.md

## Purpose

Last hackathon: hours lost to unstructured brainstorming, a basic concept locked late,
building itself was easy. This protocol locks a strong concept in 90 minutes, hard stop.
Runs once, immediately after the problem drops, before any planning or code.

## Who

Lead + Claude, one session. Teammates may listen. One voice decides.

## Entry: with or without a problem statement

Most events announce a problem or a theme. Some announce only a sponsor, a track, or a
cause, and expect the team to frame its own problem. Both cases run this same sprint; the
second one adds a FRAME phase in front of it.

- **Problem statement given:** skip FRAME, start the clock at DECOMPOSE.
- **No problem statement, only a theme, track, sponsor or cause:** run FRAME first. The
  90-minute clock starts at DECOMPOSE, so FRAME is 20 extra minutes, not 20 borrowed ones.

## Protocol (timeboxed -- Claude enforces the clock, announces each phase transition)

### FRAME (20 min, only when no problem statement was given)
- Gather every scrap the event did give: theme, track, sponsor, cause, judge bios, prize
  categories, any dataset or API offered, and the rubric from DAY1.md EVENT CONFIG.
- Name 5 to 7 candidate **problems** (not solutions) that fit that material. Each one is a
  single sentence in the form: "[specific person] cannot [do specific thing] because
  [specific obstacle], so [specific cost]."
- Kill any candidate that is really a solution in disguise, that names no specific person,
  or that no judge in this room would recognise as real.
- Score the survivors on: fit to the event material, evidence it is real, and whether a
  48-hour demo could visibly move it.
- Present the ranked list and have the lead pick one. That becomes the problem statement.
- Write the chosen statement down verbatim before continuing. DECOMPOSE starts from it.

### 0-15 min -- DECOMPOSE
- Restate the problem in one sentence.
- Name the target persona.
- List constraints: time remaining, team size, scope mode (from DAY1.md EVENT CONFIG).
- Load the rubric from DAY1.md EVENT CONFIG.

### 15-45 min -- DIVERGE
- Claude generates 10+ candidate solutions across the spectrum, safe to wild.
- Each candidate: one-line concept + what the 3-minute demo shows + signature wow moment.
- Every candidate needs a real **product surface**, not just a mechanism. "A tool that
  scans code" is a mechanism. "A tool that scans code, wrapped in a product with a hero
  moment, a live demo section, and a narrative arc a judge watches unfold" is a concept.
  If the one-line pitch describes only a function (scans X, sorts Y, matches Z) with no
  mention of what a judge would see and feel, add the surface before it counts as a
  candidate.
- No filtering during this phase. Quantity over judgment.

### 45-70 min -- SCORE
- Matrix-score every candidate 1-5 on:
  - Rubric fit (weight by DAY1 rubric weights)
  - Buildable in available hours by this team
  - Demo-ability in 3 minutes
  - Distinctiveness (will judges remember it after 30 teams)
  - **Production value**: built out, would this look like a real shipped product (a
    site, an app) or a bare utility screen? Score low anything whose demo is "a form, a
    button, and a list" with no visual world around it. This axis exists because a
    concept can win every other axis and still lose the room on sight. The published
    rubric almost always includes a Design-shaped criterion (call it Design, UX polish,
    or similar) even when the team's own instinct is to treat visuals as an
    afterthought; score this axis for real, not as a formality.
  - Score this axis 1 for real, do not wave it through: if every candidate would score
    3+ here, the DIVERGE pass was too narrow, add wilder candidates before SCORE closes.
- Show the matrix. Top 2 advance.
- **A concept that is inherently a bare utility (an internal devtool, a CLI, an API)
  still needs a product surface to demo well.** Do not drop production value for these;
  instead the concept must specify what wraps the mechanism: a landing/intro moment
  that frames the problem, a narrative the judge follows, at minimum one screen with
  real visual craft (not the mechanism's raw output rendered plainly). Note this
  explicitly in the candidate's one-line concept, not left implicit for the builder to
  invent later.

### 70-90 min -- CONVERGE
- Stress-test both finalists:
  - "How does the demo end?"
  - "What kills this technically?"
  - "What will 5 other teams build?"
- Lead picks one. LOCK IT.

### Hard stop rule
Decision at T+90 even if imperfect. A good concept locked early beats a perfect concept
locked late. If deadlocked at T+85, take the higher rubric-fit score.

## Output

`docs/CONCEPT.md`, committed and pushed before the planner session starts. Template:

```markdown
# CONCEPT.md

## Problem statement (1 sentence)

## Persona

## Solution concept (3 sentences max)

## Demo narrative (1 sentence: "judge watches X happen")

## Signature wow moment

## Design authority (from rules/frontend-design.md's choice table)
<!-- Pick it now, from the brief, not later during the build session. Say which row of
     the table this concept matches and why. A concept that is a dashboard/devtool still
     needs its product-surface moments (see Production value above) treated as a
     landing/marketing pass if any exist -- name which screens get which authority if
     they differ, e.g. "frontend-design for the tool screen, design-taste-frontend for
     the intro/landing moment in front of it." -->

## What each role sees that the others do not
<!-- One line per role. If two roles see the same screens, the concept is not differentiated
     yet. Last event the coordinator screens came out nearly identical to the volunteer
     screens and the human had to send it back. Settle this now, not after building. -->

## Hard constraints (never do this, even if it would work)
<!-- Things a builder could reasonably reach for mid-build that must not ship, decided
     now while it costs one sentence instead of a built-and-deleted feature. One past
     project built a full LLM chatbot against an external API, shipped it, then tore it
     out two sessions later because "no external API call, ever" was a rule that existed
     only in someone's head. Ask explicitly: any external API call live on stage (cost,
     latency, vendor lock, a network dependency the demo can't survive without), any data
     the org can't legally or ethically share, anything security- or safety-adjacent that
     needs sign-off. If there are none, write "none identified" -- don't skip the section. -->

## Why it wins each rubric criterion
- [criterion]: [one line]

## Top 2 risks + mitigation
1.
2.

## Assumptions to test during build
```

## Handoff into planning -- do not break the chain here

The sprint does not end at the lock. In the same session, once `docs/CONCEPT.md` is
committed and pushed:

1. Run `bash scripts/check-concept.sh`. It fails on any section still empty. Fix what it
   names, commit, re-run.
2. Run `bash scripts/ensure-gsd.sh`. It installs GSD Core if this machine does not have it.
3. Continue straight into planning with `SKILL.md` Phase 1. Do not wait for a new prompt,
   do not open a new session, and do not re-ideate: the concept is locked and planning
   reads it as given.

`/kickoff` runs all of this as one chain. This section is what it follows, and what to do
by hand if the command is not available.

## One concept document, forever

`docs/CONCEPT.md` is the only concept file. Refinements, business-analyst passes and
review notes **edit it in place**. Never create `CONCEPT-REVIEW.md`, `CONCEPT-v2.md` or
similar; last event a second file appeared and the first question asked was "what are
each of those for?". If a review produces findings, fold the accepted ones into
CONCEPT.md and delete the findings list.

## Anti-patterns
- Brainstorming past the timebox.
- Revisiting the decision after lock.
- Building the first idea without divergence.
- Ideating features instead of concepts.
- Producing a second concept document instead of editing the locked one.
- Letting a post-lock refinement session run unbounded. Timebox it like the sprint.
