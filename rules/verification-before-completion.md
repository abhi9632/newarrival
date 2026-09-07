# rules/verification-before-completion.md

**Core principle: evidence before claims, always.**

## Scale the evidence to the tier

Verification is not a fixed ritual. Running a full build and test sweep to prove a copy
tweak landed is how simple tasks ate an hour last event.

| Tier | Evidence required |
|---|---|
| **Quick** | The command exited 0, or you read the changed line back. Nothing more. |
| **Feature** | The gate below, in full. UI also passes the visual gate. |
| **Foundation** | The gate below, plus the app actually starts and the demo path runs. |

## The gate (Feature and Foundation)

1. What command proves this is done?
2. Run it. Fresh. In full.
3. Read the complete output and exit code.
4. Does the output confirm the claim?
   - Yes: make the claim WITH the evidence.
   - No: state the actual status WITH the evidence.

## Claim requirements

| Claim | Requires |
|---|---|
| Feature works | Demo it in the running app |
| Screen is done | Visual gate: screenshot at 375 + 1280, judged against the Art direction, logged in `design-system/README.md`. See `rules/frontend-design.md` |
| Bug fixed | Reproduce the original symptom: now passes |
| Build passes | Build command: exit 0 |
| Session complete | HANDOFF.md updated in the same commit as the work |

## "It renders" is not "it is designed"

The old version of this file accepted "component renders, visual check at 375 and 1280".
A component can render perfectly and still be indistinguishable from every other team's
project. Last event that is exactly what shipped, and the human had to reject it twice.

For any screen a judge will see, the check is not "does it appear". It is: **could this
be another team's project with the logo swapped?** If yes, it is not done.

## Red flags (stop immediately)
- Using "should", "probably", "seems to"
- About to commit without verifying
- Moving to the next feature before confirming the current one works end to end
- Trusting a subagent's success report without checking
- Marking a screen done without having looked at a screenshot of it

## Hackathon note
Judges will click every button. "Should work" is not a demo. Run it, see it, THEN say it
is done. But verify at the tier of the task: over-verifying trivia costs the same clock
as under-verifying features.
