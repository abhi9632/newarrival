# rules/ideation-sprint.md

## Purpose

Last hackathon: hours lost to unstructured brainstorming, a basic concept locked late,
building itself was easy. This protocol locks a strong concept in 90 minutes, hard stop.
Runs once, immediately after the problem drops, before any planning or code.

## Who

Lead + Claude, one session. Teammates may listen. One voice decides.

## Protocol (timeboxed -- Claude enforces the clock, announces each phase transition)

### 0-15 min -- DECOMPOSE
- Restate the problem in one sentence.
- Name the target persona.
- List constraints: time remaining, team size, scope mode (from DAY1.md EVENT CONFIG).
- Load the rubric from DAY1.md EVENT CONFIG.

### 15-45 min -- DIVERGE
- Claude generates 10+ candidate solutions across the spectrum, safe to wild.
- Each candidate: one-line concept + what the 3-minute demo shows + signature wow moment.
- No filtering during this phase. Quantity over judgment.

### 45-70 min -- SCORE
- Matrix-score every candidate 1-5 on:
  - Rubric fit (weight by DAY1 rubric weights)
  - Buildable in available hours by this team
  - Demo-ability in 3 minutes
  - Distinctiveness (will judges remember it after 30 teams)
- Show the matrix. Top 2 advance.

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

## What each role sees that the others do not
<!-- One line per role. If two roles see the same screens, the concept is not differentiated
     yet. Last event the coordinator screens came out nearly identical to the volunteer
     screens and the human had to send it back. Settle this now, not after building. -->

## Why it wins each rubric criterion
- [criterion]: [one line]

## Top 2 risks + mitigation
1.
2.

## Assumptions to test during build
```

## Anti-patterns
- Brainstorming past the timebox.
- Revisiting the decision after lock.
- Building the first idea without divergence.
- Ideating features instead of concepts.
