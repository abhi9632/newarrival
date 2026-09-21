---
name: rubric-gate
description: Check a proposed feature against the judging rubric in DAY1.md EVENT CONFIG before building it. Use before writing feature code, when scoping a new feature, or when asked whether something serves the rubric.
user-invocable: false
---

# Rubric Gate

CLAUDE.md states "every feature must serve at least one rubric criterion. If a
feature serves none, cut it." That rule has no mechanical check today -- it
relies on the agent remembering to apply it. This skill is that check.

## When to run this

Before writing feature code, whenever a feature idea appears that was not in
`docs/CONCEPT.md`'s Hard constraints, or whenever asked to scope or justify a
feature.

## Steps

1. Read `DAY1.md`, section `## EVENT CONFIG`, subsection "Judging rubric".
   If it still reads `[fill ...]` or is empty, stop and say so -- there is no
   rubric to gate against yet. Do not invent one; point at the fallback rubric
   in `SKILL.md` only if EVENT CONFIG already says the fallback was adopted.
2. List the rubric criteria and their weights exactly as written.
3. For the feature under review, name the ONE criterion it serves most
   directly. A feature that needs two sentences of justification to connect
   it to any criterion does not serve one -- that is the "cut it" case.
4. If it does not clearly serve a criterion: say so plainly and recommend
   cutting or deferring it. Do not soften this into "could also help with X".
5. If it does: name the criterion, in one line, so the build decision is
   traceable later (worth pasting into AGENTS.md task row or a commit
   message, not into this skill's output).
6. When several features are competing for build time, rank them by the
   weight of the criterion they serve -- CLAUDE.md: "Weight effort by rubric
   points: the highest-weighted criterion gets the most build time."

## Output format

```
Rubric: [criterion] ([weight if given])
Feature: [one line]
Verdict: SERVES [criterion] | CUTS -- serves no listed criterion
```

Keep it to that block. This is a gate check, not a design review.
